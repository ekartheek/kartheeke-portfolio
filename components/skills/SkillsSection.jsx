'use client';

import React, { useState } from 'react';
import HardwareChassisCommander from './HardwareChassisCommander';
import ProtocolArchitectureMatrix from './ProtocolArchitectureMatrix';
import CredentialsCertificationsDeck from './CredentialsCertificationsDeck';
import { audioEngine } from '../shared/AudioEngine';
import { 
  Server, 
  Network, 
  Terminal, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  SlidersHorizontal,
  Activity,
  Award
} from 'lucide-react';

export default function SkillsSection() {
  const [activeView, setActiveView] = useState('hardware'); // 'hardware' | 'protocols' | 'certifications'

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
            PROTOCOLS, HARDWARE & CREDENTIALS
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Tangible enterprise chassis operations, multi-layer routing protocols, and Cisco Certified Network Professional (CCNP Enterprise) production validation.
          </p>
        </div>

        {/* Command-Center Mode Switcher */}
        <div className="flex flex-wrap items-center p-1.5 rounded-xl bg-[#070d18] border border-[#142238] font-mono text-xs gap-1">
          <button
            onClick={() => handleToggleView('hardware')}
            data-cursor="SWITCH"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeView === 'hardware'
                ? 'bg-sky-950 text-sky-300 border border-sky-500/60 font-bold shadow-md shadow-sky-950/50'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>HARDWARE CHASSIS</span>
          </button>

          <button
            onClick={() => handleToggleView('protocols')}
            data-cursor="SWITCH"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeView === 'protocols'
                ? 'bg-sky-950 text-sky-300 border border-sky-500/60 font-bold shadow-md shadow-sky-950/50'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>PROTOCOLS</span>
          </button>

          <button
            onClick={() => handleToggleView('certifications')}
            data-cursor="SWITCH"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeView === 'certifications'
                ? 'bg-sky-950 text-sky-300 border border-sky-500/60 font-bold shadow-md shadow-sky-950/50'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="flex items-center gap-1.5">
              <span>CCNP & CREDENTIALS</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            </span>
          </button>
        </div>
      </div>

      {/* Main Interactive Showcase Body */}
      <div>
        {activeView === 'hardware' && <HardwareChassisCommander />}
        {activeView === 'protocols' && <ProtocolArchitectureMatrix />}
        {activeView === 'certifications' && <CredentialsCertificationsDeck />}
      </div>
    </section>
  );
}
