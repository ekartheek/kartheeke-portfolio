'use client';

import React, { useState } from 'react';
import { blueprints } from '../../data/blueprints';
import InteractiveBlueprintSchematic from './InteractiveBlueprintSchematic';
import { audioEngine } from '../shared/AudioEngine';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Quote, 
  Layers, 
  SlidersHorizontal,
  ChevronRight,
  Terminal,
  Activity
} from 'lucide-react';

export default function ProjectSection() {
  const [activeBlueprintId, setActiveBlueprintId] = useState(blueprints[0].id);
  const [activeLayerIdx, setActiveLayerIdx] = useState(null);

  // Active blueprint object
  const activeBlueprint = blueprints.find((bp) => bp.id === activeBlueprintId) || blueprints[0];

  const handleSelectBlueprint = (id) => {
    audioEngine.playClick();
    setActiveBlueprintId(id);
    setActiveLayerIdx(null);
  };

  return (
    <section id="blueprints" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-emerald-400 mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>PRODUCTION ARCHITECTURE // VERIFIED CLIENT ENGAGEMENTS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight uppercase">
          ENTERPRISE NETWORK BLUEPRINTS
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          Interactive architectural schematics engineered across statewide public-safety systems, Tier-1 low-latency trading cores, and global multi-tenant enterprise operations.
        </p>
      </div>

      {/* Streamlined Blueprint Navigator Rail (Lightweight & Seamless) */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#080e1a]/80 border border-[#142136] mb-8 overflow-x-auto">
        {blueprints.map((bp, idx) => {
          const isActive = bp.id === activeBlueprintId;
          return (
            <button
              key={bp.id}
              onClick={() => handleSelectBlueprint(bp.id)}
              data-cursor="SELECT"
              className={`flex-1 min-w-[240px] px-4 py-3 rounded-lg text-left transition-all relative ${
                isActive
                  ? 'bg-sky-950/70 border border-sky-500/60 shadow-md shadow-sky-950/40 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1524] border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${isActive ? 'text-sky-400' : 'text-slate-500'}`}>
                  SYSTEM 0{idx + 1} // {bp.shortName}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {bp.timeline}
                </span>
              </div>
              <div className="text-sm font-mono font-bold truncate">
                {bp.client}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Blueprint Context & Inline SLA Telemetry Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6 pb-6 border-b border-[#121c2e]">
        {/* Left: Client Context & Verified Role */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60 font-semibold uppercase tracking-wide">
              {activeBlueprint.architectureStyle}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{activeBlueprint.location}</span>
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{activeBlueprint.timeline}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            {activeBlueprint.client}
          </h3>

          <p className="text-sm text-slate-400 max-w-2xl font-sans">
            {activeBlueprint.tagline}
          </p>
        </div>

        {/* Right: Inline SLA Telemetry Metrics (Clean, Zero Nested Boxes) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-2 lg:pt-0">
          {activeBlueprint.metrics.map((m, idx) => (
            <div key={idx} className="border-l border-[#1a2d48] pl-3">
              <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                {m.label}
              </div>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                {m.value}
              </div>
              {m.sub && (
                <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                  {m.sub}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Architectural Showcase Centerpiece */}
      <div className="mb-10">
        <InteractiveBlueprintSchematic
          blueprint={activeBlueprint}
          activeLayerIdx={activeLayerIdx}
          onSelectLayerIdx={setActiveLayerIdx}
        />
      </div>

      {/* Balanced Technical Intelligence & Playbook (Clean 2-Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Engineering Playbook & Verified Outcomes (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>ENGINEERING PLAYBOOK & VERIFIED OUTCOMES</span>
          </div>

          <div className="space-y-2.5">
            {activeBlueprint.keyActions.map((action, i) => (
              <div 
                key={i} 
                className="flex items-start gap-3 p-3.5 rounded-lg bg-[#070e1a]/60 border border-[#142136] hover:border-slate-700 transition-colors"
              >
                <div className="p-1 rounded bg-sky-950/60 text-sky-400 mt-0.5 flex-shrink-0">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Grounded Field Dispatch & Production Notes (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-3">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>PRACTICAL FIELD DISPATCH // GROUNDED REALITIES</span>
          </div>

          {/* Clean Quote Box */}
          <div className="relative p-5 rounded-lg bg-[#070d18]/60 border-l-2 border-amber-500/70 border-t border-r border-b border-[#142033]">
            <Quote className="w-5 h-5 text-amber-500/30 mb-2" />
            <p className="text-xs sm:text-sm font-sans italic text-slate-300 leading-relaxed">
              "{activeBlueprint.humanNotes}"
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-500">
              — Kartheek E, {activeBlueprint.role} ({activeBlueprint.timeline})
            </div>
          </div>

          {/* Quick Technical Stack Badges */}
          <div className="pt-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">
              VERIFIED CORE TECHNOLOGIES & PROTOCOLS
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeBlueprint.schematicLayers.map((l, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 rounded bg-[#091220] border border-[#16253c] text-[11px] font-mono text-slate-300"
                >
                  {l.layer}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
