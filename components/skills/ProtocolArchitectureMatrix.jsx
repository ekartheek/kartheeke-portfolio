'use client';

import React, { useState } from 'react';
import { protocolArchitectureLayers } from '../../data/skillsData';
import { audioEngine } from '../shared/AudioEngine';
import { 
  Network, 
  GitFork, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Terminal, 
  Cloud, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

export default function ProtocolArchitectureMatrix() {
  const [selectedLayerId, setSelectedLayerId] = useState(protocolArchitectureLayers[0].id);
  const [selectedProtocol, setSelectedProtocol] = useState(protocolArchitectureLayers[0].protocols[0]);

  const activeLayer = protocolArchitectureLayers.find((l) => l.id === selectedLayerId) || protocolArchitectureLayers[0];

  const handleSelectLayer = (id) => {
    audioEngine.playClick();
    setSelectedLayerId(id);
    const layer = protocolArchitectureLayers.find((l) => l.id === id);
    if (layer && layer.protocols.length > 0) {
      setSelectedProtocol(layer.protocols[0]);
    }
  };

  const handleSelectProtocol = (protocol) => {
    audioEngine.playClick();
    setSelectedProtocol(protocol);
  };

  return (
    <div className="space-y-6">
      {/* Layer Architecture Navigator (Meaningful Visual Layers) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {protocolArchitectureLayers.map((layer, idx) => {
          const isSelected = layer.id === selectedLayerId;
          return (
            <button
              key={layer.id}
              onClick={() => handleSelectLayer(layer.id)}
              data-cursor="LAYER"
              className={`p-3 rounded-xl text-left transition-all border relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? `${layer.accentBg} ${layer.accentBorder} shadow-lg text-white`
                  : 'bg-[#060b13] border-[#132034] hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isSelected && (
                <div 
                  className="absolute top-0 left-0 right-0 h-1" 
                  style={{ backgroundColor: layer.color }} 
                />
              )}
              
              <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                TIER 0{idx + 1}
              </div>

              <div className="text-xs font-mono font-bold leading-snug line-clamp-2">
                {layer.name.split(':')[1]?.trim() || layer.name}
              </div>

              <div className="mt-2 text-[9px] font-mono" style={{ color: layer.color }}>
                {layer.protocols.length} PROTOCOLS
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Protocol Architecture Console */}
      <div className="bg-[#050912] rounded-2xl border border-[#142338] shadow-2xl overflow-hidden font-mono">
        {/* Layer Header Banner */}
        <div className="px-5 py-4 bg-[#08101d] border-b border-[#132135] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: activeLayer.color }} 
              />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {activeLayer.name}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                {activeLayer.badge}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              {activeLayer.tagline}
            </p>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>INTERCONNECTED TOPOLOGY ACTIVE</span>
          </div>
        </div>

        {/* Visual Interconnected Protocol Pipeline (Interactive Node Rail) */}
        <div className="p-5 bg-[#070d18] border-b border-[#121e30]">
          <div className="text-[10px] uppercase text-slate-500 tracking-wider mb-3">
            INTERCONNECTED PROTOCOL NODES // CLICK TO INSPECT ENCAPSULATION & CLI
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeLayer.protocols.map((protocol) => {
              const isSelected = selectedProtocol?.name === protocol.name;
              return (
                <button
                  key={protocol.name}
                  onClick={() => handleSelectProtocol(protocol)}
                  data-cursor="PROTOCOL"
                  className={`p-4 rounded-xl text-left transition-all border relative ${
                    isSelected
                      ? 'bg-[#0c182c] border-sky-400 shadow-lg shadow-sky-950/60 text-white'
                      : 'bg-[#09111e] border-[#18273e] hover:border-slate-600 hover:bg-[#0b1626] text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="text-xs font-bold font-mono tracking-wide"
                      style={{ color: isSelected ? '#ffffff' : activeLayer.color }}
                    >
                      {protocol.acronym}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#060b13] border border-slate-800 text-slate-400">
                      {protocol.rfc}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white truncate mb-1">
                    {protocol.name}
                  </div>

                  <div className="text-[11px] font-sans text-slate-400 line-clamp-2">
                    {protocol.role}
                  </div>

                  {/* Interconnection links tags */}
                  <div className="mt-3 pt-2 border-t border-[#142338] flex flex-wrap gap-1">
                    {protocol.interconnectsWith.slice(0, 2).map((target, idx) => (
                      <span 
                        key={idx} 
                        className="text-[8.5px] px-1.5 py-0.5 rounded bg-[#070d18] text-slate-400 border border-slate-800"
                      >
                        ↔ {target}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Protocol Deep-Dive Console (Architecture Specs & Verified CLI) */}
        {selectedProtocol && (
          <div className="p-5 bg-[#060b14] grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Architectural Role & Interconnected Relations (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-4 rounded-xl bg-[#08101d] border border-[#142338]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white tracking-wide">
                    {selectedProtocol.name} ({selectedProtocol.acronym})
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60 font-semibold">
                    {selectedProtocol.rfc}
                  </span>
                </div>

                <div className="text-xs text-sky-300 font-semibold mb-2">
                  MISSION: {selectedProtocol.role}
                </div>

                <p className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed">
                  {selectedProtocol.desc}
                </p>

                {/* Interconnection mesh tags */}
                <div className="mt-4 pt-3 border-t border-[#121e30]">
                  <div className="text-[10px] uppercase text-slate-500 tracking-wider mb-2">
                    CROSS-LAYER PROTOCOL INTERCONNECTIONS:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProtocol.interconnectsWith.map((target, idx) => (
                      <span 
                        key={idx} 
                        className="px-2.5 py-1 rounded bg-[#0b1626] border border-[#1a2d48] text-xs text-slate-200 flex items-center gap-1"
                      >
                        <ChevronRight className="w-3 h-3 text-sky-400" />
                        <span>{target}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Verified Production CLI Configuration Syntax (6 Cols) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="p-4 rounded-xl bg-[#03060c] border border-[#132238] shadow-inner">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-900 text-xs text-slate-500">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span className="font-bold">PRODUCTION CONFIGURATION SYNTAX</span>
                  </div>
                  <span className="text-[10px] text-slate-600">IOS-XE / NX-OS / PAN-OS</span>
                </div>

                <pre className="overflow-x-auto text-[11.5px] leading-relaxed text-emerald-400/90 font-mono py-1">
                  {selectedProtocol.cli}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
