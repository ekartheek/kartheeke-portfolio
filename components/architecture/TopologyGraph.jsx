'use client';

import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../shared/AudioEngine';
import { Shield, Server, Activity, AlertTriangle, Send, RefreshCw, X, CheckCircle2, Zap } from 'lucide-react';

export default function TopologyGraph({ isBurst = false }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeScenario, setActiveScenario] = useState('all-transit'); // 'all-transit' | 'failover' | 'burst'
  const [packetProgress, setPacketProgress] = useState(0);
  const [injectedPacket, setInjectedPacket] = useState(null); // { progress: 0, active: false }
  const [pingConsole, setPingConsole] = useState('');

  // 5 Clearly Defined Architectural Layers (Left to Right)
  const layers = [
    { id: 'wan', label: '01 / WAN INGRESS', x: 80, desc: 'Carrier MPLS & Anycast' },
    { id: 'sec', label: '02 / SECURITY', x: 260, desc: 'Stateful L7 Firewall / WAF' },
    { id: 'transit', label: '03 / TRANSIT', x: 460, desc: 'Transit Gateway & DirectConnect' },
    { id: 'spine', label: '04 / SPINE FABRIC', x: 670, desc: '100G Nexus EVPN Core' },
    { id: 'workload', label: '05 / WORKLOADS', x: 880, desc: 'VPCs & Secure DB Enclave' }
  ];

  // Defined Nodes in the 5 Layers
  const nodes = [
    // Layer 1: WAN
    {
      id: 'edge-dns',
      name: 'Anycast Edge DNS',
      layer: 'wan',
      ip: '198.51.100.1',
      protocol: 'BGP Anycast AS64512',
      x: 80,
      y: 140,
      status: 'OPTIMAL',
      throughput: '94.2 Gbps',
      latency: '0.8ms',
      role: 'Global volumetric DDoS mitigation and Geo-DNS Anycast routing.'
    },
    {
      id: 'carrier-mpls',
      name: 'Statewide WAN Trunk',
      layer: 'wan',
      ip: '10.254.0.1',
      protocol: 'MPLS / Carrier DIA',
      x: 80,
      y: 300,
      status: 'OPTIMAL',
      throughput: '40.0 Gbps',
      latency: '1.4ms',
      role: 'Redundant multi-homed ISP carrier circuits for statewide government branches.'
    },

    // Layer 2: Security
    {
      id: 'perimeter-fw',
      name: 'NextGen Firewall / WAF',
      layer: 'sec',
      ip: '10.0.1.1',
      protocol: 'Stateful L7 / IPsec',
      x: 260,
      y: 220,
      status: 'ACTIVE',
      throughput: '82.5 Gbps',
      latency: '0.4ms',
      role: 'Deep packet inspection (DPI), zero-trust TLS inspection, and ingress filtering.'
    },

    // Layer 3: Transit
    {
      id: 'transit-gw',
      name: 'Cloud Transit Gateway',
      layer: 'transit',
      ip: '10.100.0.1',
      protocol: 'BGP over DirectConnect',
      x: 460,
      y: 140,
      status: 'OPTIMAL',
      throughput: '100.0 Gbps',
      latency: '1.2ms',
      role: 'Hub-and-spoke multi-region transit router linking cloud VPCs and on-prem cores.'
    },
    {
      id: 'directconnect',
      name: 'DirectConnect 100G',
      layer: 'transit',
      ip: '10.100.2.1',
      protocol: '802.1Q / Private VIF',
      x: 460,
      y: 300,
      status: 'OPTIMAL',
      throughput: '100.0 Gbps',
      latency: '0.9ms',
      role: 'Dedicated physical fiber circuit between on-prem datacenters and cloud VPCs.'
    },

    // Layer 4: Spine
    {
      id: 'spine-fabric',
      name: '100G Nexus Spine',
      layer: 'spine',
      ip: '10.200.0.1',
      protocol: 'BGP EVPN / VXLAN',
      x: 670,
      y: 140,
      status: 'OPTIMAL',
      throughput: '400.0 Gbps',
      latency: '< 0.4ms',
      role: 'Non-blocking sub-millisecond switching fabric providing wire-speed transport.'
    },
    {
      id: 'leaf-access',
      name: 'ToR Leaf Cluster',
      layer: 'spine',
      ip: '10.200.2.1',
      protocol: 'Multi-Chassis LAG (vPC)',
      x: 670,
      y: 300,
      status: 'OPTIMAL',
      throughput: '100.0 Gbps',
      latency: '0.5ms',
      role: 'Dual-homed Top-of-Rack access aggregation for bare-metal & container clusters.'
    },

    // Layer 5: Workload
    {
      id: 'prod-vpc',
      name: 'Production App VPC',
      layer: 'workload',
      ip: '10.10.0.0/16',
      protocol: 'Overlay Geneve',
      x: 880,
      y: 140,
      status: 'HEALTHY',
      throughput: '48.2 Gbps',
      latency: '1.1ms',
      role: 'Multi-AZ microsegmented citizen-facing applications and transactional services.'
    },
    {
      id: 'db-vault',
      name: 'Secure DB Enclave',
      layer: 'workload',
      ip: '10.30.0.0/24',
      protocol: 'Mutual TLS / Strict ACL',
      x: 880,
      y: 300,
      status: 'LOCKED',
      throughput: '24.0 Gbps',
      latency: '0.45ms',
      role: 'Air-gapped PCI-DSS financial vault with strict egress policies and logging.'
    }
  ];

  // Defined Physical & Logical Conduits between layers
  const links = [
    // Layer 1 -> Layer 2
    { id: 'l1', source: 'edge-dns', target: 'perimeter-fw', label: '100G DIA' },
    { id: 'l2', source: 'carrier-mpls', target: 'perimeter-fw', label: 'Carrier MPLS' },

    // Layer 2 -> Layer 3
    { id: 'l3-primary', source: 'perimeter-fw', target: 'transit-gw', label: 'Primary Transit Trunk' },
    { id: 'l3-backup', source: 'perimeter-fw', target: 'directconnect', label: 'DirectConnect Trunk' },

    // Layer 3 -> Layer 4
    { id: 'l4-a', source: 'transit-gw', target: 'spine-fabric', label: 'EVPN Uplink' },
    { id: 'l4-b', source: 'directconnect', target: 'leaf-access', label: 'Dedicated Link' },

    // Layer 4 -> Layer 5
    { id: 'l5-a', source: 'spine-fabric', target: 'prod-vpc', label: 'Geneve Overlay' },
    { id: 'l5-b', source: 'leaf-access', target: 'db-vault', label: 'mTLS Tunnel' },
    { id: 'l5-cross', source: 'prod-vpc', target: 'db-vault', label: 'Private DB Peering' }
  ];

  // Continuous subtle packet animation
  useEffect(() => {
    let animId;
    let p = 0;
    const loop = () => {
      const step = activeScenario === 'burst' ? 0.035 : 0.016;
      p = (p + step) % 1;
      setPacketProgress(p);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [activeScenario]);

  // Injected packet single-shot animation along active path
  useEffect(() => {
    if (!injectedPacket || !injectedPacket.active) return;
    let animId;
    let p = injectedPacket.progress;
    const loop = () => {
      p += 0.022;
      if (p >= 1) {
        audioEngine.playPacketPing();
        setInjectedPacket(null);
        setPingConsole('PACKET DELIVERED // ACK 200 OK // LATENCY: 0.78ms');
      } else {
        setInjectedPacket({ progress: p, active: true });
        animId = requestAnimationFrame(loop);
      }
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [injectedPacket]);

  const handleInject = () => {
    audioEngine.playPacketPing();
    setInjectedPacket({ progress: 0, active: true });
    setPingConsole('TRANSMITTING SYN PACKET: 198.51.100.1 -> 10.10.0.0/16...');
  };

  const handleScenarioChange = (scenario) => {
    if (scenario === 'burst' || scenario === 'failover') {
      audioEngine.playFailoverAlert();
    } else {
      audioEngine.playClick();
    }
    setActiveScenario(scenario);
  };

  const getNode = (id) => nodes.find((n) => n.id === id);

  // Active path selection based on scenario
  const isFailover = activeScenario === 'failover';
  const isBurstMode = activeScenario === 'burst' || isBurst;

  // In failover: Primary link (FW -> TGW) is DOWN/CUT; traffic reroutes via DirectConnect -> Leaf -> Vault
  const activeLinkIds = isFailover
    ? ['l2', 'l3-backup', 'l4-b', 'l5-b'] // Alternate BGP Failover Path
    : ['l1', 'l3-primary', 'l4-a', 'l5-a', 'l5-cross']; // Nominal All-Transit Path

  return (
    <div className="w-full bg-[#06090e] border border-[#162438] rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Top Integrated Interactive Control HUD */}
      <div className="p-4 sm:p-5 border-b border-[#141f32] bg-[#070c14] flex flex-wrap items-center justify-between gap-4">
        {/* Scenario Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase mr-1">SCENARIO:</span>
          {[
            { id: 'all-transit', label: 'All Transit (Nominal)', color: 'border-sky-500 text-sky-300' },
            { id: 'burst', label: 'Traffic Burst (High Load)', color: 'border-red-500 text-red-300' },
            { id: 'failover', label: 'Simulate Link Cut & Failover', color: 'border-amber-500 text-amber-300' }
          ].map((sc) => {
            const isSelected = activeScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleScenarioChange(sc.id)}
                data-cursor="SCENARIO"
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold tracking-wider transition-all border ${
                  isSelected
                    ? `bg-[#0b1424] ${sc.color} shadow-sm`
                    : 'bg-[#04070d] border-[#152236] text-slate-400 hover:text-white'
                }`}
              >
                {sc.label}
              </button>
            );
          })}
        </div>

        {/* Action: Inject Packet */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleInject}
            disabled={injectedPacket?.active}
            data-cursor="INJECT"
            className="px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-[#0284c7] hover:bg-[#0369a1] text-white border border-[#38bdf8] transition-all flex items-center gap-2 shadow-md shadow-sky-950/50"
          >
            <Send className={`w-3.5 h-3.5 ${injectedPacket?.active ? 'animate-spin' : ''}`} />
            <span>{injectedPacket?.active ? 'Tracing Packet...' : 'Inject Test Packet'}</span>
          </button>
        </div>
      </div>

      {/* Burst / Failover Alert Banner */}
      {isBurstMode && (
        <div className="bg-red-950/90 border-b border-red-500/80 px-4 py-1.5 flex items-center justify-between text-xs font-mono text-red-200 animate-pulse">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>FABRIC LOAD BURST: 98.8 Gbps // PRIMARY TRANSIT SATURATED // CONGESTION RED</span>
          </div>
          <span className="hidden sm:inline">DYNAMIC QoS BUFFER SHAPING ACTIVE</span>
        </div>
      )}

      {isFailover && (
        <div className="bg-amber-950/90 border-b border-amber-500/80 px-4 py-1.5 flex items-center justify-between text-xs font-mono text-amber-200">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>PRIMARY TRANSIT LINK DOWN // TRAFFIC INSTANTLY REROUTED VIA DIRECTCONNECT FAILOVER</span>
          </div>
          <span className="hidden sm:inline">BGP CONVERGENCE: &lt; 1.8s</span>
        </div>
      )}

      {/* Main Expansive SVG Topology Canvas */}
      <div className="relative w-full overflow-x-auto min-h-[440px] flex justify-center p-4 select-none">
        <svg
          viewBox="0 0 960 420"
          className="w-full max-w-[960px] h-auto min-w-[840px]"
        >
          <defs>
            {/* Glow Filter */}
            <filter id="netGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Red Congestion Glow */}
            <filter id="redGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 5 Vertical Architectural Tier Guides */}
          {layers.map((layer, idx) => (
            <g key={layer.id}>
              {/* Vertical Guide Line */}
              <line
                x1={layer.x}
                y1={35}
                x2={layer.x}
                y2={390}
                stroke="#121c2c"
                strokeDasharray="4 4"
              />
              {/* Layer Title Tag */}
              <text
                x={layer.x}
                y={22}
                textAnchor="middle"
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="1"
              >
                {layer.label}
              </text>
            </g>
          ))}

          {/* Optical Conduit Connections between nodes */}
          {links.map((link) => {
            const src = getNode(link.source);
            const tgt = getNode(link.target);
            if (!src || !tgt) return null;

            const isConnectedToSelected = selectedNode && (link.source === selectedNode.id || link.target === selectedNode.id);
            const isLinkActive = activeLinkIds.includes(link.id);
            const isCut = isFailover && link.id === 'l3-primary';
            const isSaturated = isBurstMode && isLinkActive;

            // Compute curved Bezier line
            const dx = tgt.x - src.x;
            const dy = tgt.y - src.y;
            const cx1 = src.x + dx * 0.5;
            const cy1 = src.y;
            const cx2 = src.x + dx * 0.5;
            const cy2 = tgt.y;
            const pathD = `M ${src.x} ${src.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tgt.x} ${tgt.y}`;

            // Compute live packet position along curve
            const t = packetProgress;
            const px = Math.pow(1 - t, 3) * src.x + 3 * Math.pow(1 - t, 2) * t * cx1 + 3 * (1 - t) * Math.pow(t, 2) * cx2 + Math.pow(t, 3) * tgt.x;
            const py = Math.pow(1 - t, 3) * src.y + 3 * Math.pow(1 - t, 2) * t * cy1 + 3 * (1 - t) * Math.pow(t, 2) * cy2 + Math.pow(t, 3) * tgt.y;

            // Conduit color & styling
            let linkColor = '#162438';
            let strokeWidth = 1.5;
            let dashArray = 'none';
            let opacity = 0.25;

            if (isCut) {
              linkColor = '#ef4444';
              strokeWidth = 2;
              dashArray = '5 5';
              opacity = 1;
            } else if (isSaturated) {
              linkColor = '#ef4444';
              strokeWidth = 3.5;
              opacity = 1;
            } else if (isConnectedToSelected) {
              // Highlight connections attached to the inspected node!
              linkColor = '#38bdf8';
              strokeWidth = 3;
              opacity = 1;
            } else if (isLinkActive) {
              linkColor = selectedNode ? '#1e344e' : '#38bdf8';
              strokeWidth = selectedNode ? 1.5 : 2.5;
              opacity = selectedNode ? 0.4 : 1;
            }

            return (
              <g key={link.id}>
                {/* Conduit Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={linkColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  filter={isConnectedToSelected || isSaturated ? 'url(#netGlow)' : undefined}
                  opacity={opacity}
                  className="transition-all duration-300"
                />

                {/* Animated Packet Stream on Active Link */}
                {isLinkActive && !isCut && (
                  <circle
                    cx={px}
                    cy={py}
                    r={isSaturated ? 4.5 : isConnectedToSelected ? 4 : 3}
                    fill={isSaturated ? '#ef4444' : isConnectedToSelected ? '#38bdf8' : '#0284c7'}
                    filter="url(#netGlow)"
                  />
                )}

                {/* Link Failure Marker if Cut */}
                {isCut && (
                  <g transform={`translate(${(src.x + tgt.x) / 2}, ${(src.y + tgt.y) / 2})`}>
                    <circle r="10" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="-4" y1="-4" x2="4" y2="4" stroke="#ef4444" strokeWidth="2" />
                    <line x1="4" y1="-4" x2="-4" y2="4" stroke="#ef4444" strokeWidth="2" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Injected Single-Shot Packet Tracer */}
          {injectedPacket && (
            (() => {
              const pathNodes = isFailover
                ? [getNode('carrier-mpls'), getNode('perimeter-fw'), getNode('directconnect'), getNode('leaf-access'), getNode('db-vault')]
                : [getNode('edge-dns'), getNode('perimeter-fw'), getNode('transit-gw'), getNode('spine-fabric'), getNode('prod-vpc')];

              const totalSegments = pathNodes.length - 1;
              const globalProgress = injectedPacket.progress * totalSegments;
              const segmentIndex = Math.min(Math.floor(globalProgress), totalSegments - 1);
              const localT = globalProgress - segmentIndex;

              const n1 = pathNodes[segmentIndex];
              const n2 = pathNodes[segmentIndex + 1];

              const ix = n1.x + (n2.x - n1.x) * localT;
              const iy = n1.y + (n2.y - n1.y) * localT;

              return (
                <g>
                  <circle cx={ix} cy={iy} r="7" fill="#10b981" filter="url(#netGlow)" />
                  <circle cx={ix} cy={iy} r="14" fill="none" stroke="#34d399" strokeWidth="1.5" className="animate-ping" />
                </g>
              );
            })()
          )}

          {/* Nodes (Hardware Chassis Style) */}
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isSaturated = isBurstMode && activeLinkIds.some((lid) => {
              const l = links.find((item) => item.id === lid);
              return l && (l.source === node.id || l.target === node.id);
            });

            return (
              <g
                key={node.id}
                onClick={() => {
                  audioEngine.playClick();
                  setSelectedNode(node);
                }}
                className="cursor-pointer"
                data-cursor="INSPECT"
              >
                {/* Active Selection Tactical Reticle */}
                {isSelected && (
                  <g>
                    <rect
                      x={node.x - 54}
                      y={node.y - 30}
                      width="108"
                      height="60"
                      rx="14"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      filter="url(#netGlow)"
                    />
                    {/* Targeting tick marks */}
                    <circle cx={node.x} cy={node.y - 30} r="2" fill="#38bdf8" />
                    <circle cx={node.x} cy={node.y + 30} r="2" fill="#38bdf8" />
                    <circle cx={node.x - 54} cy={node.y} r="2" fill="#38bdf8" />
                    <circle cx={node.x + 54} cy={node.y} r="2" fill="#38bdf8" />
                  </g>
                )}

                {/* Saturated State Glow */}
                {!isSelected && isSaturated && (
                  <rect
                    x={node.x - 52}
                    y={node.y - 28}
                    width="104"
                    height="56"
                    rx="12"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    filter="url(#redGlow)"
                    className="animate-pulse"
                  />
                )}

                {/* Node Chassis Card Body */}
                <rect
                  x={node.x - 48}
                  y={node.y - 24}
                  width="96"
                  height="48"
                  rx="8"
                  fill={isSelected ? '#0c1626' : '#0b121e'}
                  stroke={isSelected ? '#38bdf8' : isSaturated ? '#ef4444' : '#1b2a44'}
                  strokeWidth={isSelected ? 2 : 1.2}
                />

                {/* Node Status Pip */}
                <circle
                  cx={node.x - 36}
                  cy={node.y - 12}
                  r="3.5"
                  fill={isSaturated ? '#ef4444' : isSelected ? '#38bdf8' : '#10b981'}
                />

                {/* Layer Badge Text */}
                <text
                  x={node.x - 26}
                  y={node.y - 9}
                  fill={isSelected ? '#38bdf8' : '#64748b'}
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.layer.toUpperCase()}
                </text>

                {/* Node Name */}
                <text
                  x={node.x}
                  y={node.y + 7}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.name.length > 14 ? `${node.name.substring(0, 13)}…` : node.name}
                </text>

                {/* IP / Status subtext */}
                <text
                  x={node.x}
                  y={node.y + 18}
                  textAnchor="middle"
                  fill={isSaturated ? '#ef4444' : isSelected ? '#38bdf8' : '#64748b'}
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {isSaturated ? '98.8G BURST' : node.ip}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Ping Console output if packet injected */}
      {pingConsole && (
        <div className="px-5 py-2.5 bg-[#03060a] border-t border-[#141f32] text-xs font-mono text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{pingConsole}</span>
          </div>
          <button
            onClick={() => setPingConsole('')}
            className="text-slate-500 hover:text-white text-[10px]"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* IMMERSIVE NOC OPERATIONAL INSPECTOR INTERFACE (NO GENERIC REPETITIVE CARDS) */}
      {selectedNode && (
        <div className="bg-[#080d17] border-t border-sky-900/60 p-5 sm:p-6 transition-all duration-300 relative">
          {/* Top Hardware Banner & Diagnostic Status Strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#162438]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0e1a2c] border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-md">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    {selectedNode.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-semibold">
                    STATUS: UP/UP
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                  <span>LAYER: {selectedNode.layer.toUpperCase()}</span>
                  <span>·</span>
                  <span>MTU: 9000 JUMBO</span>
                  <span>·</span>
                  <span className="text-sky-400">INTERFACE: ETH-100G/1</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Action: Live Ping Probe */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  audioEngine.playPacketPing();
                  setPingConsole(`ICMP ECHO -> ${selectedNode.ip}: 64 bytes received in ${selectedNode.latency} (TTL=64 0% Loss)`);
                }}
                data-cursor="PROBE"
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-sky-950/90 hover:bg-sky-900 border border-sky-600 text-sky-300 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>Probe Interface</span>
              </button>

              <button
                onClick={() => setSelectedNode(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                data-cursor="CLOSE"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Throughput & Capacity Bar */}
          <div className="mb-4 bg-[#04070d] p-3.5 rounded-xl border border-[#141f32]">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-400 font-semibold flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>THROUGHPUT LOAD VS RATED CAPACITY</span>
              </span>
              <span className="text-sky-300 font-bold">
                {selectedNode.throughput} / 100 Gbps Core Trunk
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#121a28] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(95, parseFloat(selectedNode.throughput) * 1.05)}%`,
                  background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)'
                }}
              />
            </div>
          </div>

          {/* 2-Column Technical Parameters & Operations Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column A: Addressing & Encapsulation */}
            <div className="bg-[#04070d] p-4 rounded-xl border border-[#141f32] flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
                  ADDRESSING & ENCAPSULATION
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">IP ADDRESS / CIDR:</span>
                    <span className="text-sky-400 font-bold bg-[#09111e] px-2 py-0.5 rounded border border-sky-900/60">
                      {selectedNode.ip}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">PROTOCOL STACK:</span>
                    <span className="text-slate-200 font-bold truncate max-w-[200px]">
                      {selectedNode.protocol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ROUND-TRIP LATENCY:</span>
                    <span className="text-emerald-400 font-bold">
                      {selectedNode.latency} (Jitter: 0.04ms)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#121a28] text-[10px] font-mono text-slate-500">
                Connected Conduits: Active in Layer {selectedNode.layer.toUpperCase()}
              </div>
            </div>

            {/* Column B: Operational Mission Context */}
            <div className="bg-[#04070d] p-4 rounded-xl border border-[#141f32] flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
                  OPERATIONAL MISSION & FAILOVER ROLE
                </div>
                <p className="text-xs font-sans text-slate-300 leading-relaxed">
                  {selectedNode.role}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#121a28] text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Packet Loss Baseline Sustained (99.999% SLA)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

