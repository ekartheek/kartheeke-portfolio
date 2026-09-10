'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Activity, Play, Pause, Zap, ArrowRight, AlertTriangle, ShieldCheck, Server, Cloud, Cpu } from 'lucide-react';
import { audioEngine } from '../shared/AudioEngine';

export default function NetworkTelemetrySection() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [activeView, setActiveView] = useState('all'); // 'all' | 'bgp' | 'directconnect' | 'spine' | 'core'
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [burstActive, setBurstActive] = useState(false);
  const [burstIntensity, setBurstIntensity] = useState(0); // 0 to 1
  const svgRef = useRef(null);

  // View profiles with distinct baseline, path topology, protocols, and latency
  const viewProfiles = {
    all: {
      label: 'All Transit',
      description: 'Aggregate multi-carrier backbone & multi-cloud hybrid transit mesh.',
      baseIngress: 72,
      baseEgress: 52,
      capacity: '100G Fabric',
      rtt: '0.8ms',
      jitter: '0.04ms',
      protocol: 'BGP ECMP / DirectConnect / EVPN',
      normalColor: '#0284c7',
      accentColor: '#38bdf8',
      nodes: [
        { id: 'edge', name: 'Edge Anycast DNS', type: 'ingress' },
        { id: 'fw', name: 'NextGen Firewall / WAF', type: 'security' },
        { id: 'tgw', name: 'Cloud Transit Gateway', type: 'routing' },
        { id: 'spine', name: '100G Spine Core', type: 'fabric' },
        { id: 'vpc', name: 'Production VPCs', type: 'egress' }
      ]
    },
    bgp: {
      label: 'BGP WAN',
      description: 'Statewide carrier MPLS & DIA Internet transit peering (NYS ITS infrastructure).',
      baseIngress: 54,
      baseEgress: 38,
      capacity: '40G Carrier Trunk',
      rtt: '1.4ms',
      jitter: '0.08ms',
      protocol: 'eBGP AS64512 / Local-Pref / MED',
      normalColor: '#0ea5e9',
      accentColor: '#38bdf8',
      nodes: [
        { id: 'carrier', name: 'Carrier MPLS Circuit', type: 'ingress' },
        { id: 'pe-router', name: 'BGP Edge Router', type: 'routing' },
        { id: 'nat-gw', name: 'Stateful NAT Gateway', type: 'security' },
        { id: 'agency', name: 'Agency Branch WAN', type: 'egress' }
      ]
    },
    directconnect: {
      label: 'Direct Connect',
      description: 'Dedicated physical private interconnect linking on-prem datacenters with AWS Cloud.',
      baseIngress: 42,
      baseEgress: 32,
      capacity: '20G Dedicated LAG',
      rtt: '1.1ms',
      jitter: '0.02ms',
      protocol: '802.1Q QinQ / Private BGP VIF',
      normalColor: '#10b981',
      accentColor: '#34d399',
      nodes: [
        { id: 'onprem', name: 'On-Prem DC Core', type: 'ingress' },
        { id: 'dx-gw', name: 'DirectConnect Gateway', type: 'routing' },
        { id: 'vif', name: 'Private Transit VIF', type: 'security' },
        { id: 'aws-vpc', name: 'AWS Cloud VPC', type: 'egress' }
      ]
    },
    spine: {
      label: 'Spine Fabric',
      description: 'Ultra-low-latency non-blocking East-West data center switching matrix.',
      baseIngress: 78,
      baseEgress: 64,
      capacity: '400G Spine Fabric',
      rtt: '< 0.4ms',
      jitter: '0.01ms',
      protocol: 'BGP EVPN / VXLAN / RoCEv2',
      normalColor: '#38bdf8',
      accentColor: '#60a5fa',
      nodes: [
        { id: 'spine1', name: 'Nexus Spine 01', type: 'fabric' },
        { id: 'spine2', name: 'Nexus Spine 02', type: 'fabric' },
        { id: 'leaf1', name: 'ToR Leaf Switch A', type: 'routing' },
        { id: 'leaf2', name: 'ToR Leaf Switch B', type: 'routing' }
      ]
    },
    core: {
      label: 'Core Security',
      description: 'Financial trading core & air-gapped PCI-DSS microsegmentation enclave (JPMC model).',
      baseIngress: 34,
      baseEgress: 24,
      capacity: '10G Crytpo Enclave',
      rtt: '0.45ms',
      jitter: '0.01ms',
      protocol: 'Mutual TLS / Stateful L7 / Zero-Trust',
      normalColor: '#f59e0b',
      accentColor: '#fbbf24',
      nodes: [
        { id: 'waf-edge', name: 'Deep Packet Inspection', type: 'security' },
        { id: 'zt-proxy', name: 'Zero-Trust Proxy', type: 'security' },
        { id: 'crypto', name: 'mTLS Tunnel Enclave', type: 'fabric' },
        { id: 'vault', name: 'Secure DB Cluster', type: 'egress' }
      ]
    }
  };

  const currentProfile = viewProfiles[activeView] || viewProfiles.all;

  // Initialize and regenerate points whenever activeView changes
  const [telemetryPoints, setTelemetryPoints] = useState([]);

  useEffect(() => {
    const pts = [];
    const base = currentProfile.baseIngress;
    for (let i = 0; i < 24; i++) {
      const ingress = base + Math.sin(i * 0.45) * 10 + (Math.random() * 6 - 3);
      const egress = ingress * 0.72 + (Math.random() * 4 - 2);
      pts.push({
        time: `${String(12 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
        ingress: Math.min(94, Math.max(20, ingress)),
        egress: Math.min(80, Math.max(15, egress)),
        loss: '0.000%'
      });
    }
    setTelemetryPoints(pts);
    setBurstActive(false);
    setBurstIntensity(0);
  }, [activeView]);

  // Live streaming engine
  useEffect(() => {
    if (!isStreaming || telemetryPoints.length === 0) return;

    const interval = setInterval(() => {
      setTelemetryPoints((prev) => {
        if (!prev || prev.length === 0) return prev;
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];

        // Surge multiplier when burst is active
        const targetMultiplier = burstActive ? 1.45 : 1.0;
        const targetBase = currentProfile.baseIngress * targetMultiplier;
        const noise = (Math.random() * 8 - 4);
        const newIngress = Math.min(
          burstActive ? 98.8 : 94.0,
          Math.max(25, targetBase + noise)
        );
        const newEgress = Math.min(88, newIngress * 0.74 + (Math.random() * 4 - 2));

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        next.push({
          time: timeStr,
          ingress: Number(newIngress.toFixed(1)),
          egress: Number(newEgress.toFixed(1)),
          loss: burstActive ? '0.002%' : '0.000%'
        });
        return next;
      });
    }, 1400);

    return () => clearInterval(interval);
  }, [isStreaming, burstActive, currentProfile.baseIngress]);

  // Handle traffic burst simulation with progressive ramp-up
  const handleSimulateBurst = () => {
    audioEngine.playFailoverAlert();
    setBurstActive(true);
    setBurstIntensity(1);

    // After 6 seconds, gracefully ramp down the burst
    setTimeout(() => {
      setBurstActive(false);
      setBurstIntensity(0);
    }, 6000);
  };

  const handleSwitchView = (viewKey) => {
    audioEngine.playClick();
    setActiveView(viewKey);
  };

  // SVG Geometry calculations
  const width = 800;
  const height = 250;
  const paddingX = 40;
  const paddingY = 28;

  const getX = (index) => paddingX + (index / Math.max(1, telemetryPoints.length - 1)) * (width - paddingX * 2);
  const getY = (val) => height - paddingY - (val / 100) * (height - paddingY * 2);

  const ingressPath = telemetryPoints.reduce((acc, pt, i) => {
    const x = getX(i);
    const y = getY(pt.ingress);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const ingressArea = telemetryPoints.length > 0
    ? `${ingressPath} L ${getX(telemetryPoints.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`
    : '';

  const egressPath = telemetryPoints.reduce((acc, pt, i) => {
    const x = getX(i);
    const y = getY(pt.egress);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Dynamic colors: when burst is active, shift progressively to vivid warning RED!
  const strokeColor = burstActive ? '#ef4444' : currentProfile.normalColor;
  const accentColor = burstActive ? '#dc2626' : currentProfile.accentColor;
  const areaGradientId = burstActive ? 'burstRedGrad' : `viewGrad-${activeView}`;

  const currentIngress = telemetryPoints.length > 0 ? telemetryPoints[telemetryPoints.length - 1].ingress : currentProfile.baseIngress;
  const currentEgress = telemetryPoints.length > 0 ? telemetryPoints[telemetryPoints.length - 1].egress : currentProfile.baseEgress;

  const handleMouseMove = (e) => {
    if (!svgRef.current || telemetryPoints.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const normX = (mouseX / rect.width) * width;

    let nearestIdx = 0;
    let minDiff = Infinity;
    telemetryPoints.forEach((_, i) => {
      const diff = Math.abs(getX(i) - normX);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIdx = i;
      }
    });

    setHoveredPoint({
      ...telemetryPoints[nearestIdx],
      x: getX(nearestIdx),
      yIngress: getY(telemetryPoints[nearestIdx].ingress),
      yEgress: getY(telemetryPoints[nearestIdx].egress)
    });
  };

  return (
    <section id="telemetry" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Unified Telemetry Console */}
      <div className={`bg-[#070c14] border rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-colors duration-500 ${
        burstActive ? 'border-red-600/80 shadow-red-950/40' : 'border-[#162438]'
      }`}>
        {/* Burst alert banner when active */}
        {burstActive && (
          <div className="absolute top-0 left-0 right-0 bg-red-950/90 border-b border-red-500 py-1.5 px-4 flex items-center justify-between text-xs font-mono text-red-200 z-20 animate-pulse">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>TRAFFIC BURST DETECTED // FABRIC LOAD CRITICAL (98.8 Gbps)</span>
            </div>
            <span>DYNAMIC BUFFER SCALING ACTIVE // PACKET LOSS 0.002%</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#141f32] pt-2">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase mb-1">
              <Activity className="w-4 h-4" style={{ color: strokeColor }} />
              <span style={{ color: strokeColor }}>LIVE NETWORK TELEMETRY // {currentProfile.label.toUpperCase()}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight uppercase">
              {currentProfile.label} STREAM
            </h2>
            <p className="text-xs font-sans text-slate-400 mt-1 max-w-xl">
              {currentProfile.description}
            </p>
          </div>

          {/* Minimal Key Status Indicators */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 bg-[#0b121e] px-3 py-1.5 rounded-lg border border-[#17253b]">
              <span className={`w-2 h-2 rounded-full ${burstActive ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`} />
              <span className="text-slate-400">STATE:</span>
              <span className={burstActive ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {burstActive ? 'HIGH LOAD' : 'OPTIMAL'}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-[#0b121e] px-3 py-1.5 rounded-lg border border-[#17253b]">
              <span className="text-slate-400">CAPACITY:</span>
              <span className="text-sky-400 font-bold">{currentProfile.capacity}</span>
            </div>

            <div className="flex items-center gap-2 bg-[#0b121e] px-3 py-1.5 rounded-lg border border-[#17253b]">
              <span className="text-slate-400">LATENCY:</span>
              <span className="text-slate-200 font-bold">{currentProfile.rtt}</span>
            </div>

            <div className="flex items-center gap-2 bg-[#0b121e] px-3 py-1.5 rounded-lg border border-[#17253b]">
              <span className="text-slate-400">PROTOCOL:</span>
              <span className="text-amber-400 font-bold">{currentProfile.protocol.split('/')[0]}</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs & Simulation Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          {/* 5 Distinct View Options */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#04070d] p-1.5 rounded-xl border border-[#152338]">
            <span className="text-[10px] font-mono text-slate-500 uppercase px-2 font-bold">VIEW:</span>
            {[
              { id: 'all', name: 'All Transit' },
              { id: 'bgp', name: 'BGP WAN' },
              { id: 'directconnect', name: 'Direct Connect' },
              { id: 'spine', name: 'Spine' },
              { id: 'core', name: 'Core' }
            ].map((tab) => {
              const isSelected = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSwitchView(tab.id)}
                  data-cursor={tab.name}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all ${
                    isSelected
                      ? 'bg-sky-950 border border-sky-500 text-sky-300 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Interactive Simulation Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioEngine.playClick();
                setIsStreaming(!isStreaming);
              }}
              data-cursor="STREAM"
              className="px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 bg-[#090f1a] hover:bg-slate-800 border border-[#152338] text-slate-300 transition-colors"
            >
              {isStreaming ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isStreaming ? 'Pause Feed' : 'Resume'}</span>
            </button>

            {/* Simulate Traffic Burst Button */}
            <button
              onClick={handleSimulateBurst}
              disabled={burstActive}
              data-cursor="BURST"
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 border ${
                burstActive
                  ? 'bg-red-950 border-red-500 text-red-300 animate-pulse'
                  : 'bg-sky-950/80 hover:bg-sky-900 border-sky-600 text-sky-300 shadow-sm'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${burstActive ? 'text-red-400' : 'text-sky-400'}`} />
              <span>{burstActive ? 'Burst Active (Simulated)' : 'Simulate Traffic Burst'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic SVG Waveform Canvas */}
        <div className="relative bg-[#04070d] border border-[#121c2c] rounded-xl p-4 overflow-hidden mb-5">
          {/* Legend and live numbers */}
          <div className="flex items-center justify-between mb-2 text-[11px] font-mono">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 rounded" style={{ backgroundColor: strokeColor }} />
                <span className="text-slate-300">
                  Ingress: <strong style={{ color: strokeColor }}>{currentIngress} Gbps</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 rounded" style={{ backgroundColor: burstActive ? '#dc2626' : '#10b981' }} />
                <span className="text-slate-300">
                  Egress: <strong className={burstActive ? 'text-red-400' : 'text-emerald-400'}>{currentEgress} Gbps</strong>
                </span>
              </div>
            </div>

            <div className="text-slate-500 hidden sm:block">
              {burstActive ? '⚠️ TRAFFIC SURGE STRESS-TEST IN PROGRESS' : 'Hover to probe latency & timestamp'}
            </div>
          </div>

          {/* SVG Visualizer */}
          <div className="w-full select-none cursor-crosshair">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                {/* Normal Grad */}
                <linearGradient id={`viewGrad-${activeView}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={currentProfile.normalColor} stopOpacity="0.4" />
                  <stop offset="75%" stopColor={currentProfile.normalColor} stopOpacity="0.06" />
                  <stop offset="100%" stopColor={currentProfile.normalColor} stopOpacity="0" />
                </linearGradient>

                {/* Red Burst Grad */}
                <linearGradient id="burstRedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.55" />
                  <stop offset="75%" stopColor="#ef4444" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={getY(100)} x2={width - paddingX} y2={getY(100)} stroke="#141e2e" strokeDasharray="3 3" />
              <line x1={paddingX} y1={getY(75)} x2={width - paddingX} y2={getY(75)} stroke="#141e2e" strokeDasharray="3 3" />
              <line x1={paddingX} y1={getY(50)} x2={width - paddingX} y2={getY(50)} stroke="#141e2e" strokeDasharray="3 3" />
              <line x1={paddingX} y1={getY(25)} x2={width - paddingX} y2={getY(25)} stroke="#141e2e" strokeDasharray="3 3" />

              {/* Y-axis Labels */}
              <text x={paddingX - 6} y={getY(100) + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">100G</text>
              <text x={paddingX - 6} y={getY(75) + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">75G</text>
              <text x={paddingX - 6} y={getY(50) + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">50G</text>
              <text x={paddingX - 6} y={getY(25) + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">25G</text>

              {/* Ingress Gradient Area */}
              {ingressArea && <path d={ingressArea} fill={`url(#${areaGradientId})`} />}

              {/* Ingress Line Curve */}
              {ingressPath && (
                <path
                  d={ingressPath}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}

              {/* Egress Line Curve */}
              {egressPath && (
                <path
                  d={egressPath}
                  fill="none"
                  stroke={burstActive ? '#dc2626' : '#10b981'}
                  strokeWidth="1.8"
                  strokeDasharray="4 2"
                />
              )}

              {/* Live Leading Pulse Bead */}
              {telemetryPoints.length > 0 && (
                <>
                  <circle
                    cx={getX(telemetryPoints.length - 1)}
                    cy={getY(currentIngress)}
                    r="4.5"
                    fill={strokeColor}
                  />
                  <circle
                    cx={getX(telemetryPoints.length - 1)}
                    cy={getY(currentIngress)}
                    r="9"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.2"
                    className="animate-ping"
                  />
                </>
              )}

              {/* Interactive Hover Probe */}
              {hoveredPoint && (
                <g>
                  <line
                    x1={hoveredPoint.x}
                    y1={paddingY}
                    x2={hoveredPoint.x}
                    y2={height - paddingY}
                    stroke={strokeColor}
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.8"
                  />
                  <circle cx={hoveredPoint.x} cy={hoveredPoint.yIngress} r="4.5" fill={strokeColor} />
                  <circle cx={hoveredPoint.x} cy={hoveredPoint.yEgress} r="4" fill="#10b981" />
                </g>
              )}
            </svg>
          </div>

          {/* Floating Hover Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute top-8 pointer-events-none bg-[#090f1a]/95 border p-2.5 rounded-lg shadow-2xl font-mono text-xs z-30 backdrop-blur-md transition-all"
              style={{
                borderColor: strokeColor,
                left: `${Math.min(Math.max(hoveredPoint.x - 70, 20), width - 160)}px`
              }}
            >
              <div className="text-[10px] text-slate-400 border-b border-slate-700 pb-1 mb-1">
                TIMESTAMP: <span className="text-white font-bold">{hoveredPoint.time}</span>
              </div>
              <div className="font-bold" style={{ color: strokeColor }}>
                INGRESS: {hoveredPoint.ingress} Gbps
              </div>
              <div className="text-emerald-400">
                EGRESS: {hoveredPoint.egress} Gbps
              </div>
              <div className="text-[9px] text-slate-400 mt-1">
                VIEW: {currentProfile.label} // LOSS: {hoveredPoint.loss}
              </div>
            </div>
          )}
        </div>

        {/* DISTINCT ARCHITECTURAL ACTIVE PATH TOPOLOGY SCHEMATIC */}
        <div className={`mt-5 p-5 rounded-xl border transition-all duration-500 ${
          burstActive
            ? 'bg-red-950/25 border-red-500/80 shadow-2xl shadow-red-950/50'
            : 'bg-[#04070d] border-[#162438]'
        }`}>
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-[#141f32]">
            <div className="flex items-center gap-2">
              <Server className={`w-4 h-4 ${burstActive ? 'text-red-400 animate-pulse' : 'text-sky-400'}`} />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                ACTIVE PATH TOPOLOGY SCHEMATIC // {currentProfile.label.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded border flex items-center gap-1.5 ${
                burstActive
                  ? 'bg-red-950 border-red-500 text-red-300 animate-pulse shadow-sm shadow-red-500/30'
                  : 'bg-[#0a111c] border-emerald-900/60 text-emerald-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${burstActive ? 'bg-red-400' : 'bg-emerald-400 animate-ping'}`} />
                <span>{burstActive ? 'LINK CONGESTION BURST (98.8G)' : 'PATH CONVERGED // 0.00% LOSS'}</span>
              </span>
            </div>
          </div>

          {/* Structured Multi-Tier Topology Chain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-flow-col md:auto-cols-fr gap-3 relative">

            {currentProfile.nodes.map((node, i) => {
              const isLast = i === currentProfile.nodes.length - 1;
              const stepNum = String(i + 1).padStart(2, '0');

              return (
                <div key={node.id} className="relative flex flex-col justify-between">
                  {/* Node Card */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all duration-300 relative z-10 flex flex-col justify-between h-full ${
                      burstActive
                        ? 'bg-red-950/40 border-red-500 text-white shadow-md shadow-red-950/50'
                        : 'bg-[#080d17] border-[#1a2b44] text-slate-200 hover:border-slate-500'
                    }`}
                  >
                    <div>
                      {/* Subsystem Header */}
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                        <span className="text-slate-500">STAGE {stepNum}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                            burstActive
                              ? 'bg-red-900/80 text-red-200'
                              : 'bg-[#0f1a2a] text-sky-400 border border-sky-900/50'
                          }`}
                        >
                          {node.type}
                        </span>
                      </div>

                      {/* Node Title */}
                      <div className="text-xs font-mono font-bold text-white tracking-tight">
                        {node.name}
                      </div>

                      {/* Architecture Role Subtitle */}
                      <div className="text-[10px] font-sans text-slate-400 mt-1 leading-tight">
                        {node.type === 'ingress'
                          ? 'Global traffic entry & Anycast resolution'
                          : node.type === 'security'
                          ? 'Stateful L7 inspection & access ACLs'
                          : node.type === 'routing'
                          ? 'BGP ECMP dynamic route propagation'
                          : node.type === 'fabric'
                          ? '100G non-blocking packet switching'
                          : 'Microsegmented workload instances'}
                      </div>
                    </div>

                    {/* Real-time Link Health Badge */}
                    <div className="mt-3 pt-2 border-t border-[#141f32] flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-500">STATUS:</span>
                      <span
                        className={`font-bold ${
                          burstActive ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                        }`}
                      >
                        {burstActive ? '98.8G BURST' : 'NOMINAL'}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Horizontal Conduit Connector */}
                  {!isLast && (
                    <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 translate-x-1/2 items-center justify-center pointer-events-none">
                      <div className="relative flex items-center">
                        <div
                          className={`h-0.5 w-4 transition-colors duration-300 ${
                            burstActive ? 'bg-red-500 shadow-sm shadow-red-500' : 'bg-sky-500/70'
                          }`}
                        />
                        <div
                          className={`w-2 h-2 rounded-full transition-colors ${
                            burstActive ? 'bg-red-400 animate-ping' : 'bg-[#38bdf8]'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Path Technical Detail Bar */}
          <div className="mt-4 pt-3 border-t border-[#131f32] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">ACTIVE PROTOCOL:</span>
              <span className={burstActive ? 'text-red-300 font-bold' : 'text-sky-400 font-bold'}>
                {currentProfile.protocol}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">RTT LATENCY:</span>
              <span className={burstActive ? 'text-red-300 font-bold' : 'text-emerald-400 font-bold'}>
                {burstActive ? '3.8ms (Jitter Alert)' : currentProfile.rtt}
              </span>
            </div>
            <div className="text-slate-500 hidden sm:block">
              {burstActive ? '⚠️ TRAFFIC PATH SATURATED — RED STATUS' : 'End-to-end multi-tier transit verified'}
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}
