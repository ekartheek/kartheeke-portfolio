'use client';

import React, { useState, useEffect } from 'react';
import { audioEngine } from '../shared/AudioEngine';
import { 
  AlertCircle, 
  Search, 
  ShieldAlert, 
  Binary, 
  GitBranch, 
  CheckCircle2, 
  ChevronRight, 
  Play, 
  RotateCcw, 
  Radio, 
  Activity, 
  Terminal,
  ShieldCheck,
  Cpu,
  Clock
} from 'lucide-react';

export default function ProcessFlow() {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stages = [
    {
      id: 'detection',
      step: '01',
      title: 'DETECTION',
      sub: 'Telemetry Anomaly Trigger',
      timer: 'T+00:00:14',
      status: 'CRITICAL ALERT',
      statusColor: '#ef4444',
      statusBg: 'bg-red-950/60',
      statusBorder: 'border-red-800/60',
      icon: AlertCircle,
      tools: ['SolarWinds SNMP Trap', 'NetFlow v9 Jitter Monitor', 'PRTG Health Probe'],
      metric: 'Jitter Spike > 18ms & Interface CRC Counter Increment',
      cliCommand: 'snmp-server enable traps link-down\nlogging host 10.240.99.10 transport udp port 514\nshow logging last 20 | include CRC|FLAP',
      summary: 'Automated telemetry polling triggers alert beacon when interface error frames exceed threshold, notifying the 24/7 NOC before customer-facing services degrade.',
      humanQuote: 'The best network outages are the ones citizens never feel. Automated jitter thresholds fire the 3 AM pager while citizen portals are still operating on active buffers.'
    },
    {
      id: 'identification',
      step: '02',
      title: 'IDENTIFICATION',
      sub: 'Impact & Circuit Scoping',
      timer: 'T+00:01:45',
      status: 'SEV-1 IDENTIFIED',
      statusColor: '#f59e0b',
      statusBg: 'bg-amber-950/60',
      statusBorder: 'border-amber-800/60',
      icon: Search,
      tools: ['Cisco DNA Center', 'BGP Looking Glass', 'IPAM Subnet Audit'],
      metric: 'Circuit ID: NYS-WAN-TRUNK-01 (10G MPLS Primary)',
      cliCommand: 'show interface Eth1/1 status\nshow ip bgp neighbors 198.51.100.1 | include BGP state\nshow vlan id 100-200 summary',
      summary: 'Triage engineers correlate alarm stream to isolate the blast radius: identifies affected carrier circuit, affected VRFs, and dependent agency application pods.',
      humanQuote: 'Instantly determining whether an anomaly is a statewide carrier fiber drop or a localized switch port flap prevents panic and guides surgical remediation.'
    },
    {
      id: 'isolation',
      step: '03',
      title: 'ISOLATION',
      sub: 'Perimeter Quarantine & Drain',
      timer: 'T+00:03:10',
      status: 'TRAFFIC CONTAINED',
      statusColor: '#f97316',
      statusBg: 'bg-orange-950/60',
      statusBorder: 'border-orange-800/60',
      icon: ShieldAlert,
      tools: ['BGP Graceful Shutdown', 'VRF Route Damper', 'ACL Quarantine Filter'],
      metric: 'Degraded Link Drained; 0 Dropped In-Flight Packets',
      cliCommand: 'router bgp 65001\n neighbor 198.51.100.1 graceful-shutdown\n neighbor 198.51.100.1 route-map DRAIN_TRAFFIC out\nroute-map DRAIN_TRAFFIC permit 10\n set local-preference 10',
      summary: 'Executes graceful BGP route withdrawal and local-preference dampening, shedding in-flight packets onto redundant carrier paths without TCP session drops.',
      humanQuote: 'Graceful shutdown allows existing TCP connections to drain cleanly rather than hard-severing the circuit and creating transaction rollback spikes in database clusters.'
    },
    {
      id: 'analysis',
      step: '04',
      title: 'ANALYSIS',
      sub: 'Deep PCAP & Optical Triage',
      timer: 'T+00:06:20',
      status: 'ROOT CAUSE PINPOINTED',
      statusColor: '#818cf8',
      statusBg: 'bg-indigo-950/60',
      statusBorder: 'border-indigo-800/60',
      icon: Binary,
      tools: ['Wireshark PCAP Dissector', 'Optical DDM Transceiver', 'Corvil Sniffer'],
      metric: 'Rx Optical Power: -16.8 dBm (Degraded Transceiver Margin)',
      cliCommand: 'show interface Eth1/1 transceiver details\nOptical Lane 1: Tx Power: -2.1 dBm, Rx Power: -16.8 dBm (WARN LOW)\nmonitor capture CAP1 interface Eth1/1 both\nshow monitor capture CAP1 buffer brief',
      summary: 'Deep packet header analysis with Wireshark and optical DDM power readings verify whether the fault stems from dirty fiber optic patch cables, micro-bursts, or MTU mismatches.',
      humanQuote: 'Wireshark hex streams never lie. When an optical receiver drops to -16.8 dBm, you know immediately that physical layer attenuation is generating the CRC frame corruption.'
    },
    {
      id: 'mitigation',
      step: '05',
      title: 'MITIGATION',
      sub: 'Dynamic Failover & Tuning',
      timer: 'T+00:09:40',
      status: 'CIRCUIT REROUTED',
      statusColor: '#10b981',
      statusBg: 'bg-emerald-950/60',
      statusBorder: 'border-emerald-800/60',
      icon: GitBranch,
      tools: ['Carrier B DIA Secondary', 'vPC Active Peer-Link', 'QoS EF Priority'],
      metric: 'SLA Convergence: 2.1s · Zero Citizen Disconnections',
      cliCommand: 'router bgp 65001\n neighbor 203.0.113.1 set weight 250\nclear ip bgp 198.51.100.1 soft in\nshow ip route 0.0.0.0/0\nGateway of last resort is 203.0.113.1 to network 0.0.0.0',
      summary: 'Secondary carrier link is dynamically promoted via BGP weight and MED adjustments. Traffic flows normally over redundant dark fiber while degraded optics undergo physical hot-swap.',
      humanQuote: 'Watching dynamic BGP convergence swing 40 Gbps of state portal traffic over to Carrier B in 2.1 seconds with zero dropped citizen logins is why we engineer dual-homed networks.'
    },
    {
      id: 'recovery',
      step: '06',
      title: 'RECOVERY',
      sub: 'Health Check & RCA Codification',
      timer: 'T+00:14:00',
      status: '100% RESTORED // CLOSED',
      statusColor: '#38bdf8',
      statusBg: 'bg-sky-950/60',
      statusBorder: 'border-sky-800/60',
      icon: ShieldCheck,
      tools: ['Jira War-Room Postmortem', 'Ansible Config Auditor', 'ServiceNow SLA Closeout'],
      metric: 'MTTR: 14 Minutes · 99.999% SLA Target Preserved',
      cliCommand: 'show interface Eth1/1 counters errors\nRx Errors: 0, Tx Errors: 0, CRC: 0 (Post-replacement OK)\nansible-playbook -i inventory verify_baseline.yml --check',
      summary: 'Physical transceiver replaced, baseline link diagnostics confirmed clean (0 CRC errors), and root-cause findings are codified into automated prevention playbooks.',
      humanQuote: 'An incident is never truly closed until the postmortem is published. We automate configuration validation so the same edge-case failure mode can never occur twice.'
    }
  ];

  // Auto-play / sequence flow simulation
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStageIdx((prev) => {
          const next = (prev + 1) % stages.length;
          if (next === 0) setIsPlaying(false);
          return next;
        });
      }, 2800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, stages.length]);

  const activeStage = stages[activeStageIdx];

  const handleSelectStage = (idx) => {
    audioEngine.playClick();
    setIsPlaying(false);
    setActiveStageIdx(idx);
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      audioEngine.playClick();
      setIsPlaying(true);
    } else {
      audioEngine.playClick();
      setIsPlaying(false);
    }
  };

  return (
    <section id="process" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-amber-400 mb-2">
            <Radio className="w-4 h-4" />
            <span>INCIDENT COMMAND PROTOCOL // 3 AM OPERATIONAL DRILL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight uppercase">
            INCIDENT RESOLUTION PIPELINE
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            A continuous operational journey from automated telemetry anomaly trigger to surgical isolation, dynamic rerouting, and RCA playbook codification.
          </p>
        </div>

        {/* Live Simulation Controls & Progress Counter */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={handleTogglePlay}
            data-cursor="PLAY"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all border ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-lg shadow-amber-950/40'
                : 'bg-[#0b1424] text-slate-300 border-[#1a2d48] hover:border-sky-500 hover:text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>PAUSE SEQUENCE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span>SIMULATE INCIDENT FLOW</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 px-3 py-2 rounded-lg bg-[#070d18] border border-[#142136]">
            <span>PHASE {activeStageIdx + 1} OF 6:</span>
            <span className="text-white font-bold">{activeStage.title}</span>
          </div>
        </div>
      </div>

      {/* Main Continuous Visual Pipeline Track (The Heroic Flow Element) */}
      <div className="relative bg-[#060b14] rounded-2xl border border-[#132034] shadow-2xl p-6 sm:p-8 mb-8 overflow-hidden">
        {/* Ambient Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(#1e3a5f 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} 
        />

        {/* Top Progress / Containment Bar */}
        <div className="relative flex items-center justify-between mb-8 pb-4 border-b border-[#121c2e] text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span 
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: activeStage.statusColor }}
              />
              <span 
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ backgroundColor: activeStage.statusColor }}
              />
            </span>
            <span className="text-white font-bold uppercase tracking-wider">
              {activeStage.status}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{activeStage.timer}</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-500 hidden md:block">
            <span>MEAN TIME TO RECOVERY (MTTR):</span>{' '}
            <span className="text-emerald-400 font-bold">-35% OPTIMIZED</span>
          </div>
        </div>

        {/* The Continuous Horizontal Flow Pipeline (Connected Stages with Flow Conduits) */}
        <div className="relative">
          {/* Continuous Glowing Conduit Line (Connecting all 6 nodes) */}
          <div className="hidden lg:block absolute top-[44px] left-[5%] right-[5%] h-1 bg-[#0f1d32] -z-0">
            {/* Animated Flow Packet traveling along the conduit */}
            <div 
              className="h-full bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400 transition-all duration-700 ease-out"
              style={{
                width: `${((activeStageIdx) / (stages.length - 1)) * 100}%`
              }}
            />
          </div>

          {/* 6 Connected Stage Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-3 relative z-10">
            {stages.map((stage, idx) => {
              const isActive = activeStageIdx === idx;
              const isPassed = activeStageIdx > idx;
              const Icon = stage.icon;

              return (
                <button
                  key={stage.id}
                  onClick={() => handleSelectStage(idx)}
                  data-cursor="STAGE"
                  className={`group text-left transition-all p-3 rounded-xl relative flex flex-col items-center sm:items-start ${
                    isActive
                      ? 'bg-[#0a1528] border-2 border-sky-400 shadow-xl shadow-sky-950/60'
                      : isPassed
                      ? 'bg-[#070e1a] border border-[#1c3352] hover:border-slate-600'
                      : 'bg-[#050912] border border-[#111c2e] opacity-60 hover:opacity-100 hover:border-slate-700'
                  }`}
                >
                  {/* Step Beacon Node Icon */}
                  <div className="flex items-center justify-between w-full mb-3">
                    <div 
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/50'
                          : isPassed
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : 'bg-[#09101c] text-slate-400 border border-[#17253b]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className={`text-[10px] font-mono font-bold ${
                      isActive ? 'text-sky-400' : isPassed ? 'text-emerald-400' : 'text-slate-600'
                    }`}>
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Stage Title */}
                  <div className="text-xs font-mono font-bold text-white tracking-wide mb-1 text-center sm:text-left">
                    {stage.title}
                  </div>

                  {/* Stage Subtitle */}
                  <div className="text-[10px] font-sans text-slate-400 leading-tight hidden sm:block">
                    {stage.sub}
                  </div>

                  {/* Status Tag Pill */}
                  <div className="mt-3 pt-2 border-t border-[#121f33] w-full hidden sm:flex items-center justify-between text-[9px] font-mono">
                    <span style={{ color: stage.statusColor }}>
                      {stage.status.split(' ')[0]}
                    </span>
                    <span className="text-slate-500">
                      {stage.timer.split('+')[1]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Stage Deep-Dive Operations Console (Grounded & Tangible) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
        {/* Left Column: Triage Telemetry & Diagnostic Tools (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-[#070d18] border border-[#142338] shadow-xl">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide border ${activeStage.statusBg} ${activeStage.statusBorder}`} style={{ color: activeStage.statusColor }}>
                STAGE {activeStage.step} // {activeStage.status}
              </span>
              <span className="text-xs text-slate-400">
                TIME ELAPSED: {activeStage.timer}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight mb-2">
              {activeStage.title}: {activeStage.sub}
            </h3>

            <p className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed mb-4">
              {activeStage.summary}
            </p>

            {/* Key Telemetry Trigger / Benchmark Metric */}
            <div className="p-3 rounded-lg bg-[#050912] border border-[#122036] mb-4">
              <div className="text-[10px] uppercase text-slate-500 tracking-wider mb-1">
                KEY OPERATIONAL BENCHMARK / TELEMETRY SIGNAL:
              </div>
              <div className="text-xs font-bold text-emerald-400">
                {activeStage.metric}
              </div>
            </div>

            {/* Enterprise Tooling Suite */}
            <div>
              <div className="text-[10px] uppercase text-slate-500 tracking-wider mb-2">
                ACTIVE TRIAGE TOOLING & PROTOCOLS:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeStage.tools.map((tool, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 rounded bg-[#0b1424] border border-[#162740] text-xs text-slate-300 flex items-center gap-1.5"
                  >
                    <Activity className="w-3 h-3 text-sky-400" />
                    <span>{tool}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Verified CLI Commands & Humanized 3 AM War-Room Notes (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Real-world CLI Syntax Window */}
          <div className="p-4 rounded-xl bg-[#03060c] border border-[#132238] shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-900 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
                <span className="font-bold">VERIFIED TRIAGE COMMAND EXECUTION</span>
              </div>
              <span className="text-[10px] text-slate-600">NX-OS / IOS-XE</span>
            </div>

            <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400/90 font-mono py-1">
              {activeStage.cliCommand}
            </pre>
          </div>

          {/* Genuine 3 AM War-Room Dispatch */}
          <div className="p-5 rounded-xl bg-[#070d18] border-l-2 border-amber-500/70 border-t border-r border-b border-[#142033]">
            <div className="text-[10px] uppercase text-amber-400 font-bold tracking-wider mb-1.5 flex items-center gap-1.5">
              <Radio className="w-3 h-3" />
              <span>3 AM PRODUCTION REALITY // FIELD DISPATCH</span>
            </div>
            <p className="text-xs sm:text-sm font-sans italic text-slate-300 leading-relaxed">
              "{activeStage.humanQuote}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
