'use client';

import React, { useState, useEffect } from 'react';
import { useRoleTheme } from '../../context/RoleThemeContext';
import { audioEngine } from '../shared/AudioEngine';
import { 
  Volume2, 
  VolumeX, 
  Terminal, 
  Menu, 
  X
} from 'lucide-react';

export default function Navbar() {
  const { audioEnabled, toggleAudio } = useRoleTheme();
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sections = [
    { id: 'hero', num: '00', label: 'CORE' },
    { id: 'telemetry', num: '01', label: 'TELEMETRY' },
    { id: 'topology', num: '02', label: 'TOPOLOGY' },
    { id: 'blueprints', num: '03', label: 'BLUEPRINTS' },
    { id: 'protocols', num: '04', label: 'PROTOCOLS' },
    { id: 'process', num: '05', label: 'TRIAGE' },
    { id: 'trajectory', num: '06', label: 'TRAJECTORY' },
    { id: 'uplink', num: '07', label: 'UPLINK' }
  ];

  // Active section scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleAudioToggle = () => {
    if (!audioEnabled) {
      audioEngine.init();
      audioEngine.enabled = true;
      audioEngine.playPacketPing();
    } else {
      audioEngine.enabled = false;
    }
    toggleAudio();
  };

  const handleNavClick = (id) => {
    audioEngine.playClick();
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Left Minimal Identity Watermark (Unobtrusive & Borderless) */}
      <div className="fixed top-5 left-5 sm:left-8 z-40 pointer-events-auto flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#06090e]/60 backdrop-blur-md border border-slate-800/50 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <a
            href="#hero"
            onClick={() => audioEngine.playClick()}
            className="text-xs font-mono font-bold text-white hover:text-sky-400 transition-colors tracking-wider"
          >
            KARTHEEK E <span className="text-[10px] text-sky-400 font-semibold hidden sm:inline">// CCNP · NET.ARCHITECT</span>
          </a>
        </div>
      </div>

      {/* DESKTOP: Right-Side Ultra-Minimal & Unboxed Navigation Rail */}
      <nav 
        aria-label="Section Navigation Rail"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="hidden md:flex fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end pointer-events-auto select-none"
      >
        {/* Unboxed Container: Zero background box, zero heavy borders */}
        <div className="relative flex flex-col items-end py-2 space-y-4">
          {/* Subtle Vertical Thread Line */}
          <div className="absolute right-[11px] top-3 bottom-12 w-[1px] bg-slate-800/50 pointer-events-none -z-0" />

          {/* Section Markers */}
          {sections.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                data-cursor="NAV"
                className="group flex items-center justify-end gap-3 relative py-0.5 focus:outline-none"
              >
                {/* Minimal Editorial Text Label (Floating cleanly with no box) */}
                <div 
                  className={`flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase transition-all duration-200 ${
                    isActive
                      ? 'text-sky-300 font-bold opacity-100 translate-x-0 drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)]'
                      : isHovered
                      ? 'text-slate-400 hover:text-white opacity-85 translate-x-0'
                      : 'opacity-0 translate-x-2 pointer-events-none'
                  }`}
                >
                  <span className={isActive ? 'text-sky-500' : 'text-slate-600'}>{item.num}</span>
                  <span>{item.label}</span>
                </div>

                {/* Floating Waypoint Marker Node */}
                <div className="relative z-10 flex items-center justify-center w-6 h-6">
                  {isActive ? (
                    <span className="relative flex h-3 w-3 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400 shadow-sm shadow-sky-400" />
                    </span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-slate-300 group-hover:scale-150 transition-all" />
                  )}
                </div>
              </button>
            );
          })}

          {/* Bottom Floating Audio Toggle */}
          <div className="pt-2 w-full flex items-center justify-center">
            <button
              onClick={handleAudioToggle}
              data-cursor="AUDIO"
              title={audioEnabled ? "Mute network audio telemetry" : "Enable electronic telemetry audio"}
              className={`p-2 rounded-full border backdrop-blur-sm transition-all ${
                audioEnabled
                  ? 'bg-sky-950/70 border-sky-500/60 text-sky-400 shadow-sm shadow-sky-900/40'
                  : 'bg-[#06090e]/60 border-slate-800/60 text-slate-500 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE: Conventional Minimal Floating Bar & Drawer (< md) */}
      <div className="md:hidden fixed top-5 right-5 z-40 pointer-events-auto flex items-center gap-2">
        {/* Mobile Audio Toggle */}
        <button
          onClick={handleAudioToggle}
          aria-label="Toggle Audio"
          className={`p-2 rounded-full border backdrop-blur-md transition-all ${
            audioEnabled
              ? 'bg-sky-950/80 border-sky-500 text-sky-400'
              : 'bg-[#060b13]/80 border-slate-800 text-slate-400'
          }`}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Mobile Menu Hamburger Toggle */}
        <button
          onClick={() => {
            audioEngine.playClick();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          aria-label="Open Navigation Menu"
          className="p-2 rounded-full bg-[#060b13]/80 border border-slate-800 text-slate-200 backdrop-blur-md shadow-sm"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Slide-Down Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-[#06090e]/95 backdrop-blur-xl flex flex-col justify-center px-8 py-16 animate-in fade-in duration-200">
          <div className="max-w-xs mx-auto w-full space-y-4 font-mono">
            <div className="text-[11px] uppercase tracking-widest text-sky-400 mb-6 pb-2 border-b border-slate-800">
              NAVIGATION RAIL // SELECT ROUTE
            </div>

            {sections.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between py-2 text-left transition-colors ${
                    isActive
                      ? 'text-sky-400 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{item.num}</span>
                    <span className="text-sm tracking-wider uppercase">{item.label}</span>
                  </div>
                  {isActive && <span className="w-2 h-2 rounded-full bg-sky-400" />}
                </button>
              );
            })}

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>STATUS: PRODUCTION ONLINE</span>
              <span className="text-emerald-400">99.999% SLA</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
