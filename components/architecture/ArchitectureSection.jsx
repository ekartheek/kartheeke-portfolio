'use client';

import React from 'react';
import TopologyGraph from './TopologyGraph';
import { Network } from 'lucide-react';

export default function ArchitectureSection() {
  return (
    <section id="topology" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-sky-400 mb-2">
          <Network className="w-4 h-4" />
          <span>HOW I THINK // HYBRID ARCHITECTURE & PACKET TELEMETRY</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight uppercase">
          HYBRID TOPOLOGY & PACKET FLOW ENGINE
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl font-sans">
          Architectural blueprint showing multi-tier carrier ingress, perimeter security, cloud transit gateways, 100G non-blocking spine fabrics, and production compute enclaves. Inject live test packets or trigger real-time failover rerouting.
        </p>
      </div>

      {/* Main Expansive Interactive Topology Experience (No Card Clutter) */}
      <TopologyGraph />
    </section>
  );
}
