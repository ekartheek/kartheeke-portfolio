'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import OpticalWaveguideScene from './scenes/OpticalWaveguideScene';

export default function RoleScene() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full h-full relative pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.2, 6.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 5, 8]} intensity={0.9} color="#38bdf8" />
        <pointLight position={[0, -4, 6]} intensity={0.6} color="#10b981" />
        <Suspense fallback={null}>
          <OpticalWaveguideScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
