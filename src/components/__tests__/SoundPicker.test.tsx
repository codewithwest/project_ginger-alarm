import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SoundPicker from '../SoundPicker';
import React from 'react';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className }: any) => (
      <div onClick={onClick} className={className}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('SoundPicker', () => {
  const mockSounds = Array.from({ length: 20 }, (_, i) => ({
    label: `Sound ${i + 1}`,
    value: `sound${i + 1}.mp3`,
  }));

  const defaultProps = {
    sounds: mockSounds,
    selectedSound: 'sound1.mp3',
    onSelect: vi.fn(),
    onClose: vi.fn(),
    previewingSound: null,
    onTogglePreview: vi.fn(),
    page: 0,
    setPage: vi.fn(),
  };

  it('renders sounds for the given page', () => {
    render(<SoundPicker {...defaultProps} page={0} />);
    expect(screen.getByText('Sound 1')).toBeInTheDocument();
    expect(screen.getByText('Sound 8')).toBeInTheDocument();
    expect(screen.queryByText('Sound 9')).not.toBeInTheDocument();
  });

  it('navigates to the second page when page prop is 1', () => {
    render(<SoundPicker {...defaultProps} page={1} />);
    expect(screen.getByText('Sound 9')).toBeInTheDocument();
    expect(screen.queryByText('Sound 1')).not.toBeInTheDocument();
  });

  it('calls setPage when next-page is clicked', () => {
    const setPage = vi.fn();
    render(<SoundPicker {...defaultProps} setPage={setPage} />);
    const nextBtn = screen.getByTestId('next-page');
    fireEvent.click(nextBtn);
    
    // It should call setPage with a functional update setPage(p => Math.min(totalPages - 1, p + 1))
    expect(setPage).toHaveBeenCalled();
  });

  it('calls setPage with specific index when a dot is clicked', () => {
    const setPage = vi.fn();
    render(<SoundPicker {...defaultProps} setPage={setPage} />);
    const dot2 = screen.getByTitle('Go to page 2');
    fireEvent.click(dot2);
    
    expect(setPage).toHaveBeenCalledWith(1);
  });

  it('calls onSelect when a sound item is clicked', () => {
    render(<SoundPicker {...defaultProps} />);
    fireEvent.click(screen.getByText('Sound 2'));
    expect(defaultProps.onSelect).toHaveBeenCalledWith('sound2.mp3');
  });

  it('calls onTogglePreview when play button is clicked', () => {
    const onTogglePreview = vi.fn();
    render(<SoundPicker {...defaultProps} onTogglePreview={onTogglePreview} />);
    
    const playBtn = screen.getByTestId('play-sound1.mp3');
    fireEvent.click(playBtn);
    
    expect(onTogglePreview).toHaveBeenCalledWith('sound1.mp3');
  });

  it('calls onTogglePreview(null) on unmount', () => {
    const onTogglePreview = vi.fn();
    const { unmount } = render(<SoundPicker {...defaultProps} onTogglePreview={onTogglePreview} />);
    unmount();
    expect(onTogglePreview).toHaveBeenCalledWith(null);
  });
});
