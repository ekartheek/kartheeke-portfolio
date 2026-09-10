'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const crosshairRef = useRef(null);
  const labelRef = useRef(null);

  const [cursorMode, setCursorMode] = useState('default'); // 'default' | 'link' | 'inspect' | 'chart'
  const [cursorLabel, setCursorLabel] = useState('');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position references to avoid React re-renders on mousemove
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only run on desktop devices with fine pointer
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    let animFrameId;

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instantly position the primary laser pinpoint (0ms latency)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check context under cursor
      const target = e.target;
      const cursorTarget = target.closest('[data-cursor]');
      const isButtonOrLink = target.closest('button, a, input, [role="button"]');
      const isTopologyNode = target.closest('svg g.cursor-pointer, [data-cursor="INSPECT"]');
      const isChart = target.closest('#telemetry, svg');

      if (cursorTarget) {
        const mode = cursorTarget.getAttribute('data-cursor');
        if (mode === 'INSPECT') {
          setCursorMode('inspect');
          setCursorLabel('INSPECT');
        } else if (mode === 'FLOW' || mode === 'ROUTE') {
          setCursorMode('inspect');
          setCursorLabel(mode);
        } else {
          setCursorMode('link');
          setCursorLabel(mode);
        }
      } else if (isTopologyNode) {
        setCursorMode('inspect');
        setCursorLabel('PROBE');
      } else if (isButtonOrLink) {
        setCursorMode('link');
        setCursorLabel('');
      } else if (isChart) {
        setCursorMode('chart');
        setCursorLabel('');
      } else {
        setCursorMode('default');
        setCursorLabel('');
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth trailing physics for secondary ring/reticle
    const render = () => {
      // Crisp, responsive lerp factor (0.28 = fast and tactile, zero sluggish float)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.28;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.28;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      if (crosshairRef.current) {
        crosshairRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animFrameId);
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 1. Primary Precision Laser Pinpoint (Instant 1:1 hardware tracking) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-transform z-20"
      >
        <div
          className={`rounded-full transition-all duration-150 ${
            cursorMode === 'inspect'
              ? 'w-1.5 h-1.5 bg-[#38bdf8] shadow-sm shadow-sky-400'
              : cursorMode === 'link'
              ? 'w-2 h-2 bg-[#38bdf8] scale-125'
              : 'w-1.5 h-1.5 bg-sky-400 shadow-sm shadow-sky-500/50'
          } ${isClicking ? 'scale-75 bg-emerald-400' : ''}`}
        />
      </div>

      {/* 2. Responsive Precision Reticle (Smooth tactile lag, contextual morphing) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-transform z-10 flex items-center justify-center"
      >
        {/* State A: Default Ambient Precision Dot */}
        {cursorMode === 'default' && (
          <div
            className={`w-6 h-6 rounded-full border border-sky-500/25 transition-all duration-200 ${
              isClicking ? 'scale-90 border-emerald-400/60' : 'scale-100'
            }`}
          />
        )}

        {/* State B: Interactive Element (Sleek corner brackets / pill frame) */}
        {cursorMode === 'link' && (
          <div
            className={`relative flex items-center justify-center transition-all duration-200 ${
              isClicking ? 'scale-90' : 'scale-100'
            }`}
          >
            {/* Luminous soft background */}
            <div className="w-10 h-10 rounded-lg bg-sky-950/30 border border-sky-400/40 backdrop-blur-[1px] shadow-sm shadow-sky-500/20" />
            {/* Subtle corner tick accents */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-sky-300" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-sky-300" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-sky-300" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-sky-300" />
          </div>
        )}

        {/* State C: Technical Topology Node Inspector (Precision Crosshair) */}
        {cursorMode === 'inspect' && (
          <div
            className={`relative flex items-center justify-center transition-all duration-200 ${
              isClicking ? 'scale-90' : 'scale-100'
            }`}
          >
            {/* Outer targeting crosshair circle */}
            <div className="w-12 h-12 rounded-full border border-dashed border-sky-400/60 animate-spin" style={{ animationDuration: '10s' }} />
            {/* Crosshair ticks */}
            <div className="absolute w-4 h-[1px] bg-sky-300/80 -left-2" />
            <div className="absolute w-4 h-[1px] bg-sky-300/80 -right-2" />
            <div className="absolute h-4 w-[1px] bg-sky-300/80 -top-2" />
            <div className="absolute h-4 w-[1px] bg-sky-300/80 -bottom-2" />

            {cursorLabel && (
              <span className="absolute top-7 px-1.5 py-0.5 rounded bg-black/85 border border-sky-700/60 text-[8px] font-mono font-bold tracking-widest text-sky-300 uppercase shadow-md">
                {cursorLabel}
              </span>
            )}
          </div>
        )}

        {/* State D: Chart / Telemetry View (Subtle measurement probe) */}
        {cursorMode === 'chart' && (
          <div className="relative flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border border-emerald-500/40" />
            <div className="absolute h-10 w-[1px] bg-emerald-400/30" />
            <div className="absolute w-10 h-[1px] bg-emerald-400/30" />
          </div>
        )}
      </div>
    </div>
  );
}
