import React, { useEffect, useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Release {
    filename: string;
    content: string;
    version: string;
    prNumber: string;
}

const ReleaseNotes = () => {
    const [releases, setReleases] = useState<Release[]>([]);
    const [expandedIndex, setExpandedIndex] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReleaseNotes();
    }, []);

    const loadReleaseNotes = async () => {
        try {
            const notes = await window.electronAPI.getReleaseNotes();
            
            const parsed = notes.map(note => {
                const prMatch = note.filename.match(/PR#(\d+)/);
                const prNumber = prMatch ? prMatch[1] : '?';
                
                const versionMatch = note.content.match(/v(\d+\.\d+\.\d+)/);
                const version = versionMatch ? versionMatch[1] : '?.?.?';
                
                return {
                    filename: note.filename,
                    content: note.content,
                    version,
                    prNumber
                };
            });
            
            setReleases(parsed);
            setLoading(false);
        } catch (e) {
            console.error('Failed to load release notes:', e);
            setLoading(false);
        }
    };

    const toggleRelease = (index: number) => {
        setExpandedIndex(expandedIndex === index ? -1 : index);
    };

    if (loading) {
        return (
            <div className="w-full max-w-6xl mx-auto flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading release notes...</p>
                </div>
            </div>
        );
    }

    if (releases.length === 0) {
        return (
            <div className="w-full max-w-6xl mx-auto">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
                    <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                    <h2 className="text-xl font-semibold mb-2">No Release Notes Found</h2>
                    <p className="text-gray-400">Release notes will appear here once available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto pb-16">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-3">
                    <FileText className="text-primary" size={32} />
                    <h1 className="text-4xl font-light tracking-widest uppercase">Release Notes</h1>
                </div>
                <p className="text-gray-400">
                    Complete changelog and feature history for Ginger Alarm
                </p>
            </motion.div>

            <div className="space-y-4">
                {releases.map((release, index) => (
                    <motion.div
                        key={release.filename}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden"
                    >
                        <button
                            onClick={() => toggleRelease(index)}
                            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/20 px-4 py-2 rounded-full">
                                    <span className="text-primary font-semibold">v{release.version}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Release {release.version}</h2>
                                    <p className="text-sm text-gray-400">PR #{release.prNumber}</p>
                                </div>
                            </div>
                            <div className="text-gray-400">
                                {expandedIndex === index ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                            </div>
                        </button>

                        <AnimatePresence>
                            {expandedIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-6 border-t border-white/10 pt-6">
                                        <div className="prose prose-invert prose-sm max-w-none markdown-content">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({...props}) => <h1 className="text-3xl font-bold mb-4 text-primary" {...props} />,
                                                    h2: ({...props}) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-white" {...props} />,
                                                    h3: ({...props}) => <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-200" {...props} />,
                                                    p: ({...props}) => <p className="mb-3 text-gray-300 leading-relaxed" {...props} />,
                                                    ul: ({...props}) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-300" {...props} />,
                                                    ol: ({...props}) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-300" {...props} />,
                                                    li: ({...props}) => <li className="ml-4" {...props} />,
                                                    code: ({inline, ...props}: any) => 
                                                        inline ? (
                                                            <code className="bg-black/40 px-2 py-0.5 rounded text-primary font-mono text-sm" {...props} />
                                                        ) : (
                                                            <code className="block bg-black/40 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto" {...props} />
                                                        ),
                                                    pre: ({...props}) => <pre className="mb-4" {...props} />,
                                                    a: ({...props}) => <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                                    blockquote: ({...props}) => <blockquote className="border-l-4 border-primary pl-4 italic text-gray-400 my-4" {...props} />,
                                                    hr: ({...props}) => <hr className="border-white/10 my-6" {...props} />,
                                                    strong: ({...props}) => <strong className="font-bold text-white" {...props} />,
                                                }}
                                            >
                                                {release.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
                <p>To add new release notes, create a markdown file in <code className="bg-black/40 px-2 py-1 rounded">docs/release/</code></p>
            </div>
        </div>
    );
};

export default ReleaseNotes;
