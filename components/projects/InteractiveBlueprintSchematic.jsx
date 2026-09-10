'use client';

import React, { useState, useMemo } from 'react';
import { audioEngine } from '../shared/AudioEngine';
import { 
  Zap, 
  RotateCcw, 
  Server, 
  ShieldCheck, 
  Activity, 
  SlidersHorizontal,
  ChevronRight,
  Layers,
  Info
} from 'lucide-react';

export default function InteractiveBlueprintSchematic({ 
  blueprint, 
  activeLayerIdx, 
  onSelectLayerIdx 
}) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Active layer object
  const activeLayer = useMemo(() => {
    if (activeLayerIdx === null || activeLayerIdx === undefined) return null;
    return blueprint.schematicLayers[activeLayerIdx] || null;
  }, [blueprint, activeLayerIdx]);

  // Selected node object
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return blueprint.nodes[0] || null;
    return blueprint.nodes.find((n) => n.id === selectedNodeId) || blueprint.nodes[0];
  }, [blueprint, selectedNodeId]);

  // Handle simulation toggle
  const toggleSimulation = () => {
    if (!isSimulating) {
      audioEngine.playAlert();
      setIsSimulating(true);
    } else {
      audioEngine.playClick();
      setIsSimulating(false);
    }
  };

  // Node layer match helper
  const isNodeHighlighted = (node) => {
    if (hoveredNodeId && hoveredNodeId === node.id) return true;
    if (selectedNodeId && selectedNodeId === node.id) return true;
    if (!activeLayer) return true;
    return activeLayer.highlightNodes?.includes(node.id);
  };

  // Link status during simulation
  const getLinkStatus = (link) => {
    if (!isSimulating) return { isFailed: false, isRerouted: false };
    
    const isFailed = blueprint.simulation?.failedLink && 
      blueprint.simulation.failedLink.source === link.source && 
      blueprint.simulation.failedLink.target === link.target;
      
    const isRerouted = blueprint.simulation?.activeFallbackLink && 
      blueprint.simulation.activeFallbackLink.source === link.source && 
      blueprint.simulation.activeFallbackLink.target === link.target;

    return { isFailed, isRerouted };
  };

  // SVG dimensions
  const svgWidth = 820;
  const svgHeight = 420;

  return (
    <div className="relative bg-[#060b14]/90 rounded-2xl border border-[#132034] shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Top Utility & Interactive Layer Filter Rail */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#08101d]/80 border-b border-[#121c2e]">
        {/* Layer Quick-Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-sky-400" />
            <span>LAYER:</span>
          </span>
          
          <button
            onClick={() => {
              audioEngine.playClick();
              onSelectLayerIdx(null);
            }}
            data-cursor="FILTER"
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
              activeLayerIdx === null
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 font-bold'
                : 'text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-800'
            }`}
          >
            All Tiers
          </button>

          {blueprint.schematicLayers.map((layer, idx) => {
            const isSelected = activeLayerIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  audioEngine.playClick();
                  onSelectLayerIdx(idx);
                }}
                data-cursor="FILTER"
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-800'
                }`}
              >
                {layer.layer}
              </button>
            );
          })}
        </div>

        {/* Simulation Trigger Button */}
        {blueprint.simulation && (
          <button
            onClick={toggleSimulation}
            data-cursor="SIMULATE"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              isSimulating
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-lg shadow-amber-950/40'
                : 'bg-[#0c1626] text-slate-300 border border-[#1e304b] hover:border-sky-500 hover:text-sky-300'
            }`}
          >
            {isSimulating ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>{blueprint.simulation.resetText}</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                <span>{blueprint.simulation.buttonText}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Simulation Live Telemetry Banner (Airy & Lightweight) */}
      {isSimulating && blueprint.simulation && (
        <div className="flex items-center justify-between px-5 py-2.5 bg-amber-950/30 border-b border-amber-900/40 text-amber-200 text-xs font-mono animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-bold text-amber-300 uppercase tracking-wide">
              EVENT SIMULATED:
            </span>
            <span className="text-amber-200/90">{blueprint.simulation.impactSummary}</span>
          </div>
        </div>
      )}

      {/* Active Layer Spec Callout (if a specific layer is filtered) */}
      {activeLayer && (
        <div className="flex items-center gap-2 px-5 py-2 bg-sky-950/20 border-b border-sky-900/30 text-xs font-mono text-sky-300 animate-in fade-in duration-200">
          <Info className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
          <span className="font-bold uppercase tracking-wide">{activeLayer.layer}:</span>
          <span className="text-slate-300">{activeLayer.spec}</span>
        </div>
      )}

      {/* Main Architectural SVG Viewport */}
      <div className="relative w-full overflow-x-auto select-none p-2 sm:p-4">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[760px] block"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, #091322 0%, #050912 100%)' }}
        >
          <defs>
            {/* Subtle Grid Pattern */}
            <pattern id="arch-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#0e1828" strokeWidth="0.6" />
            </pattern>

            {/* Glowing Filters */}
            <filter id="soft-cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="soft-red-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="soft-emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width={svgWidth} height={svgHeight} fill="url(#arch-grid)" opacity="0.9" />

          {/* Architectural Zones (Light, Airy Guidelines) */}
          {blueprint.zones.map((zone, idx) => {
            const colWidth = 180;
            const startX = zone.x - 70;
            return (
              <g key={zone.id}>
                {/* Zone Column Background (Subtle Gradient) */}
                <rect
                  x={startX}
                  y={35}
                  width={colWidth}
                  height={svgHeight - 55}
                  fill={idx % 2 === 0 ? '#08101e' : '#060c17'}
                  opacity="0.3"
                  rx="6"
                />

                {/* Zone Demarcation Header */}
                <text
                  x={zone.x + 20}
                  y={48}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                  letterSpacing="1.2"
                >
                  {zone.title}
                </text>

                {/* Subtle boundary divider */}
                {idx > 0 && (
                  <line
                    x1={startX}
                    y1={38}
                    x2={startX}
                    y2={svgHeight - 25}
                    stroke="#101c2e"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                  />
                )}
              </g>
            );
          })}

          {/* Network Connection Conduits */}
          {blueprint.links.map((link, idx) => {
            const srcNode = blueprint.nodes.find((n) => n.id === link.source);
            const tgtNode = blueprint.nodes.find((n) => n.id === link.target);
            if (!srcNode || !tgtNode) return null;

            const { isFailed, isRerouted } = getLinkStatus(link);

            // Smooth cubic bezier conduit
            const dx = tgtNode.x - srcNode.x;
            const cp1X = srcNode.x + dx * 0.45;
            const cp1Y = srcNode.y;
            const cp2X = srcNode.x + dx * 0.55;
            const cp2Y = tgtNode.y;
            const pathD = `M ${srcNode.x + 35} ${srcNode.y + 12} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${tgtNode.x - 35} ${tgtNode.y + 12}`;

            // Conduit styling
            let strokeColor = '#0284c7';
            let strokeWidth = '1.6';
            let strokeDash = 'none';
            let filterId = '';
            let opacity = 0.55;

            if (isFailed) {
              strokeColor = '#ef4444';
              strokeWidth = '2.2';
              strokeDash = '4 3';
              filterId = 'url(#soft-red-glow)';
              opacity = 0.95;
            } else if (isRerouted) {
              strokeColor = '#10b981';
              strokeWidth = '2.2';
              filterId = 'url(#soft-emerald-glow)';
              opacity = 0.95;
            } else if (link.type === 'sync') {
              strokeColor = '#38bdf8';
              strokeDash = '3 3';
              strokeWidth = '1.2';
              opacity = 0.45;
            } else if (link.type === 'secondary') {
              strokeColor = '#0369a1';
              strokeDash = '3 2';
              strokeWidth = '1.4';
              opacity = 0.5;
            } else if (link.type === 'workload') {
              strokeColor = '#334155';
              strokeWidth = '1.3';
              opacity = 0.4;
            }

            return (
              <g key={`link-${idx}`}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  opacity={opacity}
                  filter={filterId}
                />

                {/* Animated Packet Pulse */}
                {!isFailed && (
                  <circle r={isRerouted ? '2.8' : '2'} fill={isRerouted ? '#34d399' : '#38bdf8'}>
                    <animateMotion
                      path={pathD}
                      dur={isRerouted ? '1.5s' : isSimulating ? '1.8s' : '3.4s'}
                      repeatCount="indefinite"
                      begin={`${idx * 0.22}s`}
                    />
                  </circle>
                )}

                {/* Failure label indicator */}
                {isFailed && (
                  <text
                    x={(srcNode.x + tgtNode.x) / 2}
                    y={(srcNode.y + tgtNode.y) / 2 - 6}
                    textAnchor="middle"
                    fill="#ef4444"
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    LINK SEVERED // REROUTED
                  </text>
                )}
              </g>
            );
          })}

          {/* Interactive Architectural Nodes (Sleeker, Lighter Pills) */}
          {blueprint.nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNodeId === node.id;
            const highlighted = isNodeHighlighted(node);
            const opacity = highlighted ? 1 : 0.3;

            // Dimensions for lighter, sleeker node
            const boxW = 132;
            const boxH = 46;
            const boxX = node.x - boxW / 2;
            const boxY = node.y - 11;

            return (
              <g
                key={node.id}
                onClick={() => {
                  audioEngine.playClick();
                  setSelectedNodeId(node.id);
                }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="cursor-pointer transition-all duration-200"
                style={{ opacity }}
              >
                {/* Node Background Frame */}
                <rect
                  x={boxX}
                  y={boxY}
                  width={boxW}
                  height={boxH}
                  rx="6"
                  fill={isSelected ? '#0e1d33' : isHovered ? '#0b1627' : '#080f1c'}
                  stroke={
                    isSelected
                      ? '#38bdf8'
                      : isHovered
                      ? '#0284c7'
                      : highlighted && activeLayer
                      ? '#10b981'
                      : '#18273e'
                  }
                  strokeWidth={isSelected ? '1.8' : isHovered ? '1.4' : '1'}
                  filter={isSelected ? 'url(#soft-cyan-glow)' : ''}
                />

                {/* Status Beacon LED */}
                <circle
                  cx={boxX + 11}
                  cy={boxY + 16}
                  r="3"
                  fill={
                    isSimulating && blueprint.simulation?.failedLink?.source === node.id
                      ? '#ef4444'
                      : '#10b981'
                  }
                />

                {/* Node Name */}
                <text
                  x={boxX + 20}
                  y={boxY + 19}
                  fill={isSelected ? '#ffffff' : '#f8fafc'}
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="0.2"
                >
                  {node.name.length > 17 ? node.name.slice(0, 16) + '…' : node.name}
                </text>

                {/* Node Subtitle / Protocol Tag */}
                <text
                  x={boxX + 20}
                  y={boxY + 34}
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {node.sub}
                </text>

                {/* IP Badge (Right Aligned) */}
                <text
                  x={boxX + boxW - 8}
                  y={boxY + 34}
                  textAnchor="end"
                  fill="#38bdf8"
                  fontSize="7.5"
                  fontFamily="monospace"
                  opacity="0.8"
                >
                  {node.ip.split('/')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating In-Canvas Telemetry Dock (Light, Unobtrusive) */}
      {selectedNode && (
        <div className="px-5 py-3 bg-[#070e1a]/95 border-t border-[#121d2f] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-white tracking-wide">{selectedNode.name}</span>
            </div>
            <span className="text-slate-500">|</span>
            <span className="text-sky-400">{selectedNode.role}</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-400 text-[11px] truncate max-w-md">
              {selectedNode.spec}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="text-slate-400">
              <span className="text-slate-500">IP:</span> {selectedNode.ip}
            </div>
            <div className="text-slate-400">
              <span className="text-slate-500">LAYER:</span>{' '}
              <span className="text-sky-300 font-semibold">{selectedNode.layer}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
