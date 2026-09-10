'use client';

import React from 'react';
import { topologyData } from '../../data/topologyData';
import { useRoleTheme } from '../../context/RoleThemeContext';
import { audioEngine } from '../shared/AudioEngine';
import { Play, RotateCcw, AlertTriangle, Send } from 'lucide-react';

export default function SystemFlowController({ activeFlowId, onSelectFlow, onInjectPacket, onSimulateFailover, isFailoverActive }) {
  const { theme } = useRoleTheme();

  return (
    <div className="bg-[#090e18] border border-[#1b2a44] rounded-xl p-4 shadow-xl mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
            SYSTEM FLOW CONTROL // INTERACTIVE PACKET INJECTOR
          </div>
          <div className="text-sm font-mono font-bold text-white mt-0.5">
            Select a Production Scenario to Trace Traffic Flow:
          </div>
        </div>

        {/* Action buttons: Inject Packet & Failover Simulation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioEngine.playPacketPing();
              onInjectPacket();
            }}
            data-cursor="INJECT"
            className="px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider uppercase bg-sky-950/80 hover:bg-sky-900 border border-sky-600 text-sky-300 transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Inject Test Packet</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playFailoverAlert();
              onSimulateFailover();
            }}
            data-cursor="FAILOVER"
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 border ${
              isFailoverActive
                ? 'bg-amber-950/90 border-amber-500 text-amber-300 animate-pulse'
                : 'bg-[#101928] hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{isFailoverActive ? 'Failover: Active' : 'Simulate Link Cut'}</span>
          </button>
        </div>
      </div>

      {/* Preset flow selector cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {topologyData.simulationFlows.map((flow) => {
          const isActive = activeFlowId === flow.id;
          return (
            <button
              key={flow.id}
              onClick={() => {
                audioEngine.playClick();
                onSelectFlow(flow.id);
              }}
              data-cursor="FLOW"
              className={`text-left p-3 rounded-lg border transition-all ${
                isActive
                  ? 'bg-slate-800/90 border-sky-500 shadow-md'
                  : 'bg-[#06090f] border-[#152236] hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white">{flow.name}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />}
              </div>
              <div className="text-[11px] font-sans text-slate-400 mt-1 line-clamp-2">
                {flow.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
