'use client';

import React, { useState } from 'react';
import HardwareChassisCommander from './HardwareChassisCommander';
import ProtocolArchitectureMatrix from './ProtocolArchitectureMatrix';
import { audioEngine } from '../shared/AudioEngine';
import { 
  Server, 
  Network, 
  Terminal, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  SlidersHorizontal,
  Activity
} from 'lucide-react';

export default function SkillsSection() {
  const [activeView, setActiveView] = useState('hardware'); // 'hardware' | 'protocols'

  const handleToggleView = (view) => {
    audioEngine.playClick();
    setActiveView(view);
  };

  return (
    <section id="protocols" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-sky-400 mb-2">
            <Server className="w-4 h-4" />
            <span>ENTERPRISE INFRASTRUCTURE COMMAND CENTER // TECHNICAL ARSENAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight uppercase">
            PROTOCOLS & HARDWARE STACK
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Tangible enterprise chassis operations, live port transceivers, and interconnected multi-layer routing protocols deployed in mission-critical production.
          </p>
        </div>

        {/* Dual Command-Center Mode Switcher */}
        <div className="flex items-center p-1.5 rounded-xl bg-[#070d18] border border-[#142238] font-mono text-xs">
          <button
            onClick={() => handleToggleView('hardware')}
            data-cursor="SWITCH"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
              activeView === 'hardware'
                ? 'bg-sky-950 text-sky-300 border border-sky-500/60 font-bold shadow-md shadow-sky-950/50'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>HARDWARE CHASSIS DECK</span>
          </button>

          <button
            onClick={() => handleToggleView('protocols')}
            data-cursor="SWITCH"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
              activeView === 'protocols'
                ? 'bg-sky-950 text-sky-300 border border-sky-500/60 font-bold shadow-md shadow-sky-950/50'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>INTERCONNECTED PROTOCOLS</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Showcase Body */}
      <div>
        {activeView === 'hardware' ? (
          <HardwareChassisCommander />
        ) : (
          <ProtocolArchitectureMatrix />
        )}
      </div>
    </section>
  );
}
