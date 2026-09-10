'use client';

import React, { useState } from 'react';
import { careerTrajectory } from '../../data/experience';
import { audioEngine } from '../shared/AudioEngine';
import { 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Compass, 
  Milestone, 
  ChevronRight,
  Shield,
  Layers,
  Award
} from 'lucide-react';

export default function Timeline() {
  const [activeIdx, setActiveIdx] = useState(3); // Default to current role (NYS ITS)

  const activeChapter = careerTrajectory[activeIdx];

  const handleSelectChapter = (idx) => {
    audioEngine.playClick();
    setActiveIdx(idx);
  };

  const handleNext = () => {
    if (activeIdx < careerTrajectory.length - 1) {
      audioEngine.playClick();
      setActiveIdx(activeIdx + 1);
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) {
      audioEngine.playClick();
      setActiveIdx(activeIdx - 1);
    }
  };

  return (
    <section id="trajectory" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header: Editorial & Narrative */}
      <div className="mb-14">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-sky-400 mb-3">
          <Compass className="w-4 h-4" />
          <span>CAREER CHRONICLE // THE EVOLUTION OF A NETWORK ARCHITECT</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-mono font-black text-white tracking-tight uppercase">
          PROFESSIONAL TRAJECTORY
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-400 max-w-2xl font-sans leading-relaxed">
          The story of an engineer forged in high-velocity enterprise NOCs, tested in Wall Street trading cores, and trusted with statewide mission-critical backbones.
        </p>
      </div>

      {/* Cinematic Waypoint Horizon Rail (Continuous Journey Timeline) */}
      <div className="relative mb-16">
        {/* Continuous Horizontal Journey Axis Line */}
        <div className="hidden md:block absolute top-6 left-8 right-8 h-0.5 bg-[#14233a] -z-0">
          {/* Animated Trajectory Beam */}
          <div 
            className="h-full bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-400 transition-all duration-700 ease-out"
            style={{
              width: `${(activeIdx / (careerTrajectory.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* 4 Interactive Waypoints */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {careerTrajectory.map((item, idx) => {
            const isActive = activeIdx === idx;
            const isCompleted = activeIdx > idx;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectChapter(idx)}
                data-cursor="CHAPTER"
                className={`text-left p-3.5 rounded-xl transition-all relative flex flex-col group ${
                  isActive
                    ? 'bg-[#091322] border-2 border-sky-400 shadow-xl shadow-sky-950/60'
                    : isCompleted
                    ? 'bg-[#060b13] border border-[#162740] hover:border-slate-600'
                    : 'bg-[#05080e] border border-[#101b2c] opacity-60 hover:opacity-90'
                }`}
              >
                {/* Waypoint Indicator Beacon */}
                <div className="flex items-center justify-between mb-3 w-full">
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/50 scale-110'
                        : isCompleted
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                        : 'bg-[#0a121e] text-slate-500 border border-slate-800'
                    }`}
                  >
                    0{idx + 1}
                  </div>

                  <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                    isActive ? 'text-sky-300' : 'text-slate-500'
                  }`}>
                    {item.era}
                  </span>
                </div>

                {/* Chapter Theme */}
                <div className={`text-[11px] font-mono uppercase tracking-widest mb-0.5 ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'
                }`}>
                  {item.theme}
                </div>

                {/* Company Name */}
                <div className="text-sm font-mono font-bold text-white truncate">
                  {item.company}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Unfolding Chapter Stage (Editorial Narrative Spotlight) */}
      <div className="relative bg-[#060b14]/90 rounded-3xl border border-[#16253c] p-6 sm:p-12 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Ambient Subtle Trajectory Watermark */}
        <div className="absolute right-6 top-6 text-8xl sm:text-9xl font-mono font-black text-[#0a1424] select-none pointer-events-none -z-0 opacity-60">
          0{activeIdx + 1}
        </div>

        <div className="relative z-10 space-y-10">
          {/* Chapter Metadata & Dramatic Title */}
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono mb-3">
              <span className="px-2.5 py-1 rounded bg-sky-950/80 border border-sky-600/50 text-sky-300 font-bold uppercase tracking-wider">
                {activeChapter.chapter} // {activeChapter.theme}
              </span>
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{activeChapter.era}</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{activeChapter.location}</span>
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-mono font-bold text-white tracking-tight uppercase leading-snug">
              {activeChapter.storyHeadline}
            </h3>

            <div className="text-sm sm:text-base font-mono text-emerald-400 font-semibold mt-2">
              {activeChapter.role} — <span className="text-slate-300 font-normal">{activeChapter.company}</span>
            </div>
          </div>

          {/* Editorial Reflection (The Human Engineering Story) */}
          <div className="relative pl-5 sm:pl-7 border-l-2 border-sky-500/70">
            <p className="text-base sm:text-lg font-sans text-slate-200 leading-relaxed italic">
              "{activeChapter.narrative}"
            </p>
          </div>

          {/* Two-Column Story Facets (Airy, Deep, Non-Dashboard) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-[#121f33]">
            {/* Column 1: The Evolutionary Leap & Environment Stakes (7 Cols) */}
            <div className="md:col-span-7 space-y-6">
              {/* Evolutionary Leap */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400 font-bold mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>THE EVOLUTIONARY LEAP</span>
                </div>
                <p className="text-sm font-sans text-slate-300 leading-relaxed">
                  {activeChapter.evolutionLeap}
                </p>
              </div>

              {/* Environment Stakes Snapshot */}
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                  ENVIRONMENT & OPERATIONAL STAKES:
                </div>
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 w-24 flex-shrink-0">SCALE:</span>
                    <span className="text-white font-semibold">{activeChapter.environmentStakes.scale}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 w-24 flex-shrink-0">TOPOLOGY:</span>
                    <span className="text-slate-200">{activeChapter.environmentStakes.topology}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 w-24 flex-shrink-0">CRITICALITY:</span>
                    <span className="text-emerald-400 font-semibold">{activeChapter.environmentStakes.sla}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 w-24 flex-shrink-0">IMPACT:</span>
                    <span className="text-slate-300 italic">{activeChapter.environmentStakes.impact}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Signature Technologies Mastered in This Era (5 Cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>SIGNATURE TECHNOLOGIES</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeChapter.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-[#08111e] border border-[#17273e] text-xs font-mono text-slate-200 hover:border-sky-500 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#121f33] text-[11px] font-mono text-slate-500">
                <span>DIVISION:</span>{' '}
                <span className="text-slate-400">{activeChapter.division}</span>
              </div>
            </div>
          </div>

          {/* Chapter Navigation Footer Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[#121f33] font-mono text-xs">
            <button
              onClick={handlePrev}
              disabled={activeIdx === 0}
              data-cursor="PREV"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeIdx > 0
                  ? 'text-slate-300 hover:text-white bg-[#091220] hover:bg-sky-950 border border-[#162740] hover:border-sky-500'
                  : 'text-slate-600 border border-transparent cursor-not-allowed opacity-40'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Chapter</span>
            </button>

            <div className="text-slate-500 text-[11px]">
              MILESTONE {activeIdx + 1} OF {careerTrajectory.length}
            </div>

            <button
              onClick={handleNext}
              disabled={activeIdx === careerTrajectory.length - 1}
              data-cursor="NEXT"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeIdx < careerTrajectory.length - 1
                  ? 'text-slate-300 hover:text-white bg-[#091220] hover:bg-sky-950 border border-[#162740] hover:border-sky-500'
                  : 'text-slate-600 border border-transparent cursor-not-allowed opacity-40'
              }`}
            >
              <span>Next Chapter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
