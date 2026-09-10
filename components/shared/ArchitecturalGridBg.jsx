'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const InteractiveNeuralMeshBg = dynamic(() => import('./InteractiveNeuralMeshBg'), {
  ssr: false,
  loading: () => null
});

export default function ArchitecturalGridBg() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Global Interactive Neural Network Small Nodes with Drag & Pull Physics */}
      <InteractiveNeuralMeshBg />

      {/* 2. Precision NOC CAD Grid */}
      <div className="absolute inset-0 noc-grid opacity-50" />

      {/* 3. Subtle Ambient NOC Radial Depth Glows */}
      <div className="absolute -top-24 left-1/4 w-[600px] h-[600px] bg-sky-950/20 rounded-full blur-[150px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute top-1/2 right-1/4 w-[650px] h-[650px] bg-sky-950/15 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-[600px] h-[600px] bg-emerald-950/15 rounded-full blur-[150px] pointer-events-none" />

      {/* 4. Precision Edge Optical Datum Lines with Traveling Light Pulses */}
      <div className="absolute top-0 left-6 sm:left-12 bottom-0 w-[1px] bg-slate-800/40 hidden md:block overflow-hidden">
        {/* Animated Laser Packets Streaming Down Left Conduit */}
        <div className="w-full h-32 bg-gradient-to-b from-transparent via-sky-400 to-transparent animate-laser-stream" />
      </div>

      <div className="absolute top-0 right-6 sm:right-12 bottom-0 w-[1px] bg-slate-800/40 hidden md:block overflow-hidden">
        {/* Animated Laser Packets Streaming Down Right Conduit */}
        <div className="w-full h-32 bg-gradient-to-b from-transparent via-emerald-400 to-transparent animate-laser-stream-delayed" />
      </div>
    </div>
  );
}
