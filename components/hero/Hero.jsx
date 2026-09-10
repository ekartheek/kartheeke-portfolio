'use client';

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import KineticName from './KineticName';
import { audioEngine } from '../shared/AudioEngine';
import { 
  Network, 
  ChevronDown, 
  Activity
} from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-24 pb-12 overflow-hidden">
      {/* Radial depth vignettes for maximum text contrast */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06090e]/40 via-transparent to-transparent pointer-events-none z-0" />

      {/* Main Foreground Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center justify-center my-auto text-center space-y-8">
        {/* Dominant Kinetic Identity & Authority Title */}
        <KineticName />

        {/* High-Impact Concise Narrative */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="text-base sm:text-lg md:text-xl text-slate-300 font-sans max-w-2xl leading-relaxed text-balance"
        >
          Supporting enterprise, data center, and hybrid-cloud networks with <span className="text-white font-semibold">99.999% uptime</span> — focusing on Cisco, Juniper, and Arista infrastructure across state government and financial services.
        </motion.p>

        {/* Minimalist Key Metric Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-1"
        >
          {[
            { label: 'CREDENTIAL', val: 'CCNP ENTERPRISE', color: 'text-sky-300' },
            { label: 'UPTIME SLA', val: '99.999%', color: 'text-emerald-400' },
            { label: 'CORE LATENCY', val: '< 0.4ms', color: 'text-sky-400' },
            { label: 'SCALE', val: '60,000+ USERS', color: 'text-white' },
            { label: 'PERIMETER', val: 'ZERO-TRUST', color: 'text-amber-400' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="px-3 py-1.5 rounded-lg bg-[#070e1a]/80 backdrop-blur-md border border-[#142338] text-[11px] font-mono flex items-center gap-2 shadow-sm"
            >
              <span className="text-slate-500 font-semibold">{stat.label}:</span>
              <span className={`font-bold ${stat.color}`}>{stat.val}</span>
            </div>
          ))}
        </motion.div>

        {/* Focused Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <a
            href="#blueprints"
            onClick={() => audioEngine.playClick()}
            data-cursor="BLUEPRINTS"
            className="px-6 py-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white border border-[#38bdf8] shadow-lg shadow-sky-950/50"
          >
            <Network className="w-4 h-4" />
            <span>Explore Blueprints</span>
          </a>

          <a
            href="#telemetry"
            onClick={() => audioEngine.playPacketPing()}
            data-cursor="METRICS"
            className="px-6 py-3 rounded-lg text-xs font-mono font-semibold tracking-wider uppercase bg-[#08101d] hover:bg-[#0c1626] text-slate-200 hover:text-white border border-[#17273e] transition-all flex items-center gap-2 shadow-md"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Live Telemetry</span>
          </a>
        </motion.div>
      </div>

      {/* Downward Scroll Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="relative z-10 pt-4 flex flex-col items-center gap-1 text-[11px] font-mono text-slate-500 tracking-widest uppercase select-none"
      >
        <span>ARCHITECTURE & TELEMETRY</span>
        <ChevronDown className="w-4 h-4 text-sky-400 animate-bounce mt-1" />
      </motion.div>
    </section>
  );
}
