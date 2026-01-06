import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, color }: { position: [number, number, number], color: string }) => {
   const mesh = useRef<THREE.Mesh>(null!);

   useFrame((state, delta) => {
      mesh.current.rotation.x += delta * 0.2;
      mesh.current.rotation.y += delta * 0.3;
   });

   return (
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
         <mesh ref={mesh} position={position}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} wireframe />
         </mesh>
      </Float>
   );
};

const Background3D = () => {
   return (
      <div className="absolute w-full h-full inset-0 -z-10 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
         <Canvas camera={{ position: [0, 0, 10] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
            <FloatingShape position={[-3, 2, -5]} color="#6366f1" />
            <FloatingShape position={[3, -2, -3]} color="#a855f7" />
            <FloatingShape position={[0, 0, -8]} color="#ec4899" />
            <fog attach="fog" args={['#0f172a', 5, 20]} />
         </Canvas>
      </div>
   );
};

export default Background3D;
