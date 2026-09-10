'use client';

import React, { useState, useEffect } from 'react';
import { hardwareChassisData } from '../../data/skillsData';
import { audioEngine } from '../shared/AudioEngine';
import { 
  Server, 
  Cpu, 
  Activity, 
  Zap, 
  Thermometer, 
  CheckCircle2, 
  Terminal, 
  Sliders, 
  Radio, 
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function HardwareChassisCommander() {
  const [selectedChassisId, setSelectedChassisId] = useState(hardwareChassisData[0].id);
  const [selectedPortId, setSelectedPortId] = useState(null);
  const [showCli, setShowCli] = useState(false);

  // Simulated live port activity blinkers
  const [portBlinkers, setPortBlinkers] = useState(
    Array.from({ length: 48 }, () => Math.random() > 0.3)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPortBlinkers((prev) =>
        prev.map((active) => (Math.random() > 0.2 ? !active : active))
      );
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const activeChassis = hardwareChassisData.find((c) => c.id === selectedChassisId) || hardwareChassisData[0];

  const activePort = selectedPortId 
    ? activeChassis.ports.find((p) => p.id === selectedPortId) || activeChassis.ports[0]
    : activeChassis.ports[0];

  const handleSelectChassis = (id) => {
    audioEngine.playClick();
    setSelectedChassisId(id);
    setSelectedPortId(null);
  };

  const handleSelectPort = (port) => {
    audioEngine.playClick();
    setSelectedPortId(port.id);
  };

  return (
    <div className="space-y-6">
      {/* Chassis Selector Buttons (High-Tech NOC Rack Units) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {hardwareChassisData.map((chassis, idx) => {
          const isSelected = chassis.id === selectedChassisId;
          return (
            <button
              key={chassis.id}
              onClick={() => handleSelectChassis(chassis.id)}
              data-cursor="CHASSIS"
              className={`p-3.5 rounded-xl text-left transition-all border relative overflow-hidden ${
                isSelected
                  ? 'bg-[#0a1424] border-sky-500 shadow-lg shadow-sky-950/40 text-white'
                  : 'bg-[#060b13] border-[#132034] hover:border-slate-700 hover:bg-[#08101d] text-slate-400'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400" />
              )}
              
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500">
                  RACK UNIT 0{idx + 1}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                  {chassis.throughput}
                </span>
              </div>

              <div className="text-sm font-mono font-bold text-white truncate">
                {chassis.name}
              </div>

              <div className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                {chassis.role}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Hardware Chassis Faceplate & Visual Deck */}
      <div className="bg-[#050912] rounded-2xl border border-[#142338] shadow-2xl overflow-hidden font-mono">
        {/* Chassis Top Operations Banner */}
        <div className="px-5 py-3 bg-[#08101d] border-b border-[#132135] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-white uppercase tracking-wider">
                {activeChassis.vendor} // {activeChassis.name}
              </span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-sky-400 text-[11px]">{activeChassis.os}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>PSU 1+2 OK</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-sky-300">
              <Activity className="w-3.5 h-3.5" />
              <span>{activeChassis.thermal}</span>
            </span>
            <span>·</span>
            <button
              onClick={() => {
                audioEngine.playClick();
                setShowCli(!showCli);
              }}
              data-cursor="CLI"
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] transition-colors"
            >
              {showCli ? 'Hide CLI' : 'Inspect CLI'}
            </button>
          </div>
        </div>

        {/* Realistic Front Panel Chassis Faceplate */}
        <div className="p-4 sm:p-6 bg-[#070d18] border-b border-[#121e30]">
          {/* Bezel Frame */}
          <div className="relative p-4 rounded-xl bg-[#040811] border-2 border-[#1a2b44] shadow-inner">
            {/* Rack Mount Screws (Left & Right) */}
            <div className="absolute left-1.5 top-2.5 bottom-2.5 flex flex-col justify-between">
              <div className="w-2 h-2 rounded-full bg-[#1e2f47] border border-[#2b4162]" />
              <div className="w-2 h-2 rounded-full bg-[#1e2f47] border border-[#2b4162]" />
            </div>
            <div className="absolute right-1.5 top-2.5 bottom-2.5 flex flex-col justify-between">
              <div className="w-2 h-2 rounded-full bg-[#1e2f47] border border-[#2b4162]" />
              <div className="w-2 h-2 rounded-full bg-[#1e2f47] border border-[#2b4162]" />
            </div>

            {/* Chassis Front Panel Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#142338] px-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white tracking-widest uppercase">
                  {activeChassis.name}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  [{activeChassis.portCount} PORT DENSITY]
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                <span>PORT SELECTOR: CLICK TO PROBE TRANSCEIVER</span>
              </div>
            </div>

            {/* High-Density Port Cage Visuals */}
            <div className="grid grid-cols-6 sm:grid-cols-12 md:grid-cols-18 gap-1.5 sm:gap-2 px-2">
              {activeChassis.ports.map((port, idx) => {
                const isPortSelected = activePort.id === port.id;
                const isBlinking = portBlinkers[idx % portBlinkers.length];
                return (
                  <button
                    key={port.id}
                    onClick={() => handleSelectPort(port)}
                    title={`Port ${port.name} (${port.speed}) - ${port.description}`}
                    data-cursor="PORT"
                    className={`h-11 rounded flex flex-col items-center justify-between p-1 transition-all border ${
                      isPortSelected
                        ? 'bg-sky-950 border-sky-400 shadow-md shadow-sky-500/30'
                        : 'bg-[#0a121f] border-[#182a44] hover:border-sky-500 hover:bg-[#0e1b2f]'
                    }`}
                  >
                    {/* Link & Activity LEDs */}
                    <div className="flex items-center gap-1 w-full justify-center">
                      {/* Link LED (Solid Green) */}
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400" />
                      {/* Activity LED (Blinking Amber) */}
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-opacity duration-150 ${
                          isBlinking ? 'bg-amber-400 opacity-100' : 'bg-amber-950 opacity-30'
                        }`}
                      />
                    </div>

                    {/* Port Name */}
                    <span className="text-[8px] font-mono text-slate-400 leading-none">
                      {port.id}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Chassis Status Footer Bar */}
            <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 mt-4 pt-3 border-t border-[#122034] px-3">
              <div className="flex items-center gap-4">
                <span>STATUS: OPERATIONAL</span>
                <span>FANS: {activeChassis.fans}</span>
              </div>
              <div className="flex items-center gap-4 text-emerald-400 font-semibold">
                <span>CRC FRAMES: {activeChassis.crcErrors}</span>
                <span>POWER DRAW: {activeChassis.powerDraw}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Port Diagnostic Telemetry Strip */}
        <div className="p-4 sm:p-5 bg-[#08101d] border-b border-[#121e30] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-sky-950/70 border border-sky-800/50 text-sky-400 mt-0.5">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  PORT {activePort.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                  SPEED: {activePort.speed} // LINK UP
                </span>
                <span className="text-[10px] text-slate-400">
                  {activePort.vlan}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                <span className="text-slate-500">ASSIGNED CIRCUIT:</span> {activePort.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="text-right">
              <div className="text-[9px] uppercase text-slate-500">OPTICAL POWER</div>
              <div className="font-bold text-slate-200">{activePort.opticalPower}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase text-slate-500">RX THROUGHPUT</div>
              <div className="font-bold text-sky-400">{activePort.rxGbps} Gbps</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase text-slate-500">TX THROUGHPUT</div>
              <div className="font-bold text-emerald-400">{activePort.txGbps} Gbps</div>
            </div>
          </div>
        </div>

        {/* Optional CLI Terminal View */}
        {showCli && (
          <div className="p-4 bg-[#03070e] text-slate-300 font-mono text-xs border-b border-[#132034] animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-slate-500 pb-2 mb-3 border-b border-slate-900 text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>LIVE NX-OS / EOS CONSOLE SESSION // VERIFIED OUTPUT</span>
            </div>
            <pre className="overflow-x-auto text-[11.5px] leading-relaxed text-emerald-400/95 selection:bg-emerald-900 selection:text-white">
              {activeChassis.cliSnippet}
            </pre>
          </div>
        )}

        {/* 4 Minimalist Hardware Telemetry Gauges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:p-5 bg-[#060b14]">
          <div className="p-3.5 rounded-lg bg-[#08101d] border border-[#132238]">
            <div className="text-[10px] uppercase text-slate-500">FORWARDING THROUGHPUT</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{activeChassis.throughput}</div>
            <div className="text-[9px] text-slate-500 mt-0.5">Wire-Speed Non-Blocking</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#08101d] border border-[#132238]">
            <div className="text-[10px] uppercase text-slate-500">ASIC FORWARDING LATENCY</div>
            <div className="text-lg font-bold text-sky-400 mt-0.5">{activeChassis.latency}</div>
            <div className="text-[9px] text-slate-500 mt-0.5">Cut-Through Architecture</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#08101d] border border-[#132238]">
            <div className="text-[10px] uppercase text-slate-500">POWER DRAW & THERMAL</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{activeChassis.powerDraw.split(' ')[0]}</div>
            <div className="text-[9px] text-slate-500 mt-0.5">{activeChassis.thermal}</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#08101d] border border-[#132238]">
            <div className="text-[10px] uppercase text-slate-500">SUPPORTED STACK</div>
            <div className="text-xs font-bold text-white mt-1.5 truncate">
              {activeChassis.protocols.slice(0, 3).join(', ')}
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">+{activeChassis.protocols.length - 3} Production Protocols</div>
          </div>
        </div>
      </div>
    </div>
  );
}
