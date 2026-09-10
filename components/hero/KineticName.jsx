'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function KineticName() {
  return (
    <div className="relative select-none flex flex-col items-center">
      {/* Executive Location & Status Ticker */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono tracking-widest text-slate-400 uppercase mb-3">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
        <span className="text-white font-semibold">EAST GREENBUSH, NY</span>
        <span className="text-slate-600">·</span>
        <span className="text-sky-400 font-semibold">CURRENTLY @ NYS ITS</span>
        <span className="text-slate-600 hidden sm:inline">·</span>
        <span className="text-slate-400 hidden sm:inline">6 YRS PRODUCTION EXPERIENCE</span>
        <span className="text-slate-600 hidden md:inline">·</span>
        <span className="text-emerald-400 font-bold hidden md:inline">CCNP CERTIFIED</span>
      </div>

      {/* Dominant Clean Kinetic Master Name */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-mono font-black tracking-tight uppercase leading-none text-center"
        style={{
          fontSize: 'clamp(2.8rem, 8vw, 6.8rem)',
          letterSpacing: '-0.035em'
        }}
      >
        <span className="text-white drop-shadow-md">KARTHEEK</span>{' '}
        <span
          className="relative inline-block text-[#38bdf8]"
          style={{
            textShadow: '0 0 40px rgba(56, 189, 248, 0.4)'
          }}
        >
          E
        </span>
      </motion.h1>

      {/* Executive Authority Title */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-3 text-sm sm:text-base md:text-lg font-mono font-bold tracking-widest text-slate-300 uppercase"
      >
        NETWORK ENGINEER · ENTERPRISE, DATA CENTER & HYBRID-CLOUD
      </motion.div>

      {/* Verified Cisco CCNP Credential Pill */}
      <motion.a
        href="#protocols"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#081324]/90 hover:bg-[#0a182e] border border-sky-500/50 hover:border-sky-400 transition-all shadow-lg shadow-sky-950/40 text-xs font-mono group cursor-pointer"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <span className="text-slate-300 font-semibold group-hover:text-white transition-colors">
          CISCO CERTIFIED NETWORK PROFESSIONAL
        </span>
        <span className="text-slate-600">·</span>
        <span className="text-sky-300 font-bold tracking-wider group-hover:text-sky-200 transition-colors">
          CCNP ENTERPRISE
        </span>
      </motion.a>
    </div>
  );
}
