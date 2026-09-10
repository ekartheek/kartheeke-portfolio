'use client';

import React, { useState } from 'react';
import { useRoleTheme } from '../../context/RoleThemeContext';
import { audioEngine } from '../shared/AudioEngine';
import { Server, Activity, Shield, Wifi, X, Terminal } from 'lucide-react';

export default function NodeInspectorHUD({ node, onClose }) {
  const { theme } = useRoleTheme();
  const [pingResult, setPingResult] = useState(null);
  const [isPinging, setIsPinging] = useState(false);

  if (!node) return null;

  const handlePing = () => {
    audioEngine.playPacketPing();
    setIsPinging(true);
    setPingResult('PINGING...');
    setTimeout(() => {
      setIsPinging(false);
      setPingResult(`64 bytes from ${node.ip}: icmp_seq=1 ttl=64 time=${(Math.random() * 0.8 + 0.3).toFixed(2)}ms`);
    }, 450);
  };

  return (
    <div className="bg-[#090e18] border border-[#1b2a44] rounded-xl p-5 shadow-2xl relative transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#162438]">
        <div className="flex items-center gap-2.5">
          <Server className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            NODE INSPECTOR // {node.label}
          </span>
        </div>
        <button
          onClick={() => {
            audioEngine.playClick();
            onClose();
          }}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          data-cursor="CLOSE"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of node parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-[#05080e] p-2.5 rounded border border-[#141e2e]">
          <div className="text-[10px] font-mono text-slate-500 uppercase">IP Address / CIDR</div>
          <div className="text-xs font-mono font-bold text-sky-300 mt-0.5">{node.ip}</div>
        </div>
        <div className="bg-[#05080e] p-2.5 rounded border border-[#141e2e]">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Protocol / Encapsulation</div>
          <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">{node.protocol}</div>
        </div>
        <div className="bg-[#05080e] p-2.5 rounded border border-[#141e2e]">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Latency RTT</div>
          <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">{node.latency}</div>
        </div>
        <div className="bg-[#05080e] p-2.5 rounded border border-[#141e2e]">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Peak Throughput</div>
          <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">{node.throughput}</div>
        </div>
      </div>

      {/* Operational Role */}
      <div className="bg-[#05080e] p-3 rounded border border-[#141e2e] mb-4">
        <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">Architecture Function</div>
        <div className="text-xs font-sans text-slate-300 leading-relaxed">{node.role}</div>
      </div>

      {/* Ping simulator terminal trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePing}
          disabled={isPinging}
          data-cursor="PING"
          className="px-4 py-2 rounded text-xs font-mono font-bold tracking-wider uppercase bg-sky-950/80 hover:bg-sky-900 border border-sky-700 text-sky-300 transition-all flex items-center gap-2"
        >
          <Activity className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          <span>Execute ICMP Ping</span>
        </button>

        {pingResult && (
          <div className="flex-1 min-w-[200px] text-[11px] font-mono text-emerald-400 bg-black/60 px-3 py-2 rounded border border-emerald-900/50">
            {pingResult}
          </div>
        )}
      </div>
    </div>
  );
}
