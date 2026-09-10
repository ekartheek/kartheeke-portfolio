'use client';

import React, { useState } from 'react';
import { profile } from '../../data/profile';
import { audioEngine } from '../shared/AudioEngine';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  GraduationCap, 
  Terminal, 
  Cpu, 
  Layers, 
  ExternalLink, 
  Sparkles,
  ChevronRight,
  BookOpen,
  Calendar,
  MapPin,
  Flame,
  Check
} from 'lucide-react';

export default function CredentialsCertificationsDeck() {
  const cert = profile.certifications[0];
  const [selectedDomainIdx, setSelectedDomainIdx] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState([
    '# cisco-edge-gw01# show cisco certification-status',
    'STATUS: ACTIVE AND VERIFIED',
    'CREDENTIAL: CISCO CERTIFIED NETWORK PROFESSIONAL (CCNP ENTERPRISE)',
    'HOLDER: KARTHEEK E // VERIFICATION ID: CSCO-CCNP-ENT-8842',
    'VALIDATION: DUAL-STACK ENTERPRISE ROUTING, CAMPUS SWITCHING & AUTOMATION'
  ]);
  const [activeCommand, setActiveCommand] = useState('status');

  const handleSelectDomain = (idx) => {
    audioEngine.playClick();
    setSelectedDomainIdx(idx);
  };

  const handleRunCommand = (cmdKey) => {
    audioEngine.playPacketPing();
    setActiveCommand(cmdKey);

    if (cmdKey === 'status') {
      setTerminalOutput([
        '# cisco-edge-gw01# show cisco certification-status',
        'STATUS: ACTIVE AND VERIFIED',
        'CREDENTIAL: CISCO CERTIFIED NETWORK PROFESSIONAL (CCNP ENTERPRISE)',
        'HOLDER: KARTHEEK E // VERIFICATION ID: CSCO-CCNP-ENT-8842',
        'VALIDATION: DUAL-STACK ENTERPRISE ROUTING, CAMPUS SWITCHING & AUTOMATION'
      ]);
    } else if (cmdKey === 'routing') {
      setTerminalOutput([
        '# cisco-edge-gw01# show ip protocols | include Routing Protocol',
        'Routing Protocol is "bgp 64512"',
        '  IGP synchronization is disabled; Automatic route summarization is disabled',
        '  Neighbor 10.254.1.1 (AS 65000) State: Established, Up 148d12h',
        'Routing Protocol is "ospfv3 100"',
        '  Area 0.0.0.0 backbone active; SPF algorithm executed 4 times',
        'Routing Protocol is "eigrp 200"',
        '  Dual-stack autonomous system converging via feasible successors'
      ]);
    } else if (cmdKey === 'switching') {
      setTerminalOutput([
        '# cisco-nexus-core# show vpc brief',
        'vPC domain id                     : 10',
        'Peer status                       : peer adjacency formed ok',
        'vPC keep-alive status             : Peer is alive',
        'Configuration consistency status  : success',
        'vPC role                          : primary',
        'Number of vPCs configured         : 24 active trunk channels'
      ]);
    } else if (cmdKey === 'security') {
      setTerminalOutput([
        '# cisco-edge-gw01# show authentication sessions summary',
        'Interface   MAC Address    Method   Domain   Status         Session ID',
        'Te1/0/1     0050.56a2.1100 dot1x    DATA     Auth Success   0A18010A0000001',
        'Te1/0/2     0050.56b4.3211 mab      VOICE    Auth Success   0A18010A0000002',
        'RADIUS Server Group ISE-CLUSTER-PROD: ACTIVE [TLS/RADSEC]'
      ]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Primary CCNP Certification Showcase */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#0a1628] via-[#07101e] to-[#040810] border border-sky-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Certification Badge & Verification (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 font-mono text-xs font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>OFFICIALLY VERIFIED CREDENTIAL</span>
              </div>
              <span className="text-slate-500 font-mono text-xs">ID: {cert.verificationId}</span>
            </div>

            <div>
              <div className="text-xs font-mono tracking-widest text-sky-400 font-bold uppercase mb-1">
                CISCO SYSTEMS ACCREDITATION
              </div>
              <h3 className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight uppercase">
                {cert.name}
              </h3>
              <div className="flex items-center gap-2 mt-2 font-mono text-sm">
                <span className="text-sky-300 font-bold px-2.5 py-0.5 rounded bg-sky-950/80 border border-sky-800">
                  {cert.badge}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-emerald-400 font-semibold">{cert.status}</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              {cert.description}
            </p>

            {/* Core Competency Tags */}
            <div className="pt-2">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-sky-400" />
                <span>EXAM & PRODUCTION CURRICULUM MASTERY:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'BGP / OSPF / EIGRP Dynamic Routing',
                  'IPv4 / IPv6 Dual-Stack Core',
                  'Cisco Nexus NX-OS & Catalyst',
                  'VLAN Trunking & 802.1Q',
                  'VXLAN / EVPN Data Center Fabric',
                  '802.1X / RADIUS / TACACS+ AAA',
                  'Zero-Trust Network Segmentation',
                  'Python & Netmiko Automation'
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#07111f] border border-[#182942] text-xs font-mono text-slate-200"
                  >
                    <CheckCircle2 className="w-3 h-3 text-sky-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Domain Breakdown (5 cols) */}
          <div className="lg:col-span-5 bg-[#040810]/80 rounded-xl border border-[#15253e] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#121f33] pb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>CCNP DOMAIN BLUEPRINT</span>
              </div>
              <span className="text-[10px] font-mono text-sky-400">SELECT DOMAIN</span>
            </div>

            <div className="space-y-2">
              {cert.coreDomains.map((dom, idx) => {
                const isSelected = selectedDomainIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectDomain(idx)}
                    data-cursor="DOMAIN"
                    className={`w-full text-left p-2.5 rounded-lg font-mono text-xs transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-sky-950/70 border-sky-500/60 text-white font-bold shadow-sm'
                        : 'bg-[#060c16] border-[#101c2e] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                        isSelected ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="truncate">{dom.domain}</span>
                    </div>
                    <span className={`text-[11px] font-semibold ${isSelected ? 'text-sky-300' : 'text-slate-500'}`}>
                      {dom.percentage}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Domain Deep Dive Box */}
            <div className="p-3.5 rounded-lg bg-[#070e1a] border border-[#162944] text-xs font-mono">
              <div className="text-[11px] text-sky-400 font-bold uppercase mb-2">
                VERIFIED SKILLS // {cert.coreDomains[selectedDomainIdx].domain}
              </div>
              <ul className="space-y-1.5 text-slate-300">
                {cert.coreDomains[selectedDomainIdx].skills.map((skill, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">›</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Deck: Interactive Cisco Live Terminal & Academic Foundation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Simulated Cisco CLI Verification Console (7 cols) */}
        <div className="lg:col-span-7 bg-[#040811] rounded-2xl border border-[#162740] p-5 shadow-xl font-mono">
          <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-[#122035] gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>CISCO IOS-XE // HARDWARE & CREDENTIAL VERIFICATION TERMINAL</span>
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>NOC CONSOLE ONLINE</span>
            </div>
          </div>

          {/* Interactive Command Selector Chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              { id: 'status', label: 'show cert-status' },
              { id: 'routing', label: 'show ip protocols' },
              { id: 'switching', label: 'show vpc brief' },
              { id: 'security', label: 'show dot1x sessions' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleRunCommand(btn.id)}
                data-cursor="CLI_CMD"
                className={`px-3 py-1.5 rounded text-[11px] font-mono transition-all border ${
                  activeCommand === btn.id
                    ? 'bg-sky-950 text-sky-300 border-sky-500 font-bold shadow-sm'
                    : 'bg-[#08101e] text-slate-400 border-[#142338] hover:text-white hover:border-slate-600'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Terminal Screen */}
          <div className="bg-[#02050b] border border-[#0d1626] rounded-xl p-4 h-48 overflow-y-auto space-y-1.5 text-xs text-slate-300 leading-relaxed font-mono">
            {terminalOutput.map((line, lIdx) => (
              <div 
                key={lIdx}
                className={
                  line.startsWith('#')
                    ? 'text-sky-400 font-bold'
                    : line.includes('ACTIVE') || line.includes('Success') || line.includes('Established')
                    ? 'text-emerald-400 font-semibold'
                    : 'text-slate-300'
                }
              >
                {line}
              </div>
            ))}
          </div>
          <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
            <span>TERMINAL EMULATOR // CISCO IOS-XE 17.09.04a</span>
            <span>SWITCHPORT STATUS: UP / FULL-DUPLEX</span>
          </div>
        </div>

        {/* Right: Academic Degrees & Foundations (5 cols) */}
        <div className="lg:col-span-5 bg-[#050b14] rounded-2xl border border-[#142238] p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase border-b border-[#121f33] pb-3">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>ACADEMIC FOUNDATION & DEGREES</span>
          </div>

          <div className="space-y-3">
            {profile.education.map((edu, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#070e1a] border border-[#14243a] space-y-2 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-mono font-bold text-sm text-white leading-snug">
                      {edu.degree}
                    </h4>
                    <div className="text-xs font-mono text-emerald-400 mt-0.5">
                      {edu.institution}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#091524] text-[10px] font-mono text-sky-300 font-semibold flex-shrink-0 border border-sky-900/50">
                    {edu.period.split('–')[1]?.trim() || edu.period}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{edu.location}</span>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{edu.period}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-950/40 to-emerald-950/40 border border-sky-900/40 text-xs font-mono text-slate-300">
            <span className="text-sky-400 font-bold">SYNTHESIS:</span> Advanced theoretical computer science and distributed networks from Dayton combined with hands-on Cisco CCNP Enterprise production validation.
          </div>
        </div>
      </div>
    </div>
  );
}
