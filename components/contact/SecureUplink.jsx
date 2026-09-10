'use client';

import React, { useState } from 'react';
import { profile } from '../../data/profile';
import { audioEngine } from '../shared/AudioEngine';
import { Mail, Phone, Linkedin, Send, Terminal, ShieldCheck, Copy, Check } from 'lucide-react';

export default function SecureUplink() {
  const [copied, setCopied] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([
    'INIT UPLINK: TLS 1.3 / AES-256-GCM',
    'PEER: KARTHEEK-E // STATUS: READY_FOR_DISPATCH'
  ]);
  const [pingRunning, setPingRunning] = useState(false);

  const handleCopyEmail = () => {
    audioEngine.playClick();
    navigator.clipboard.writeText(profile.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendPing = () => {
    audioEngine.playPacketPing();
    setPingRunning(true);
    setTerminalLogs((prev) => [...prev, `SEND ICMP ECHO_REQUEST -> ${profile.contact.email}...`]);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `ECHO_REPLY: 64 bytes from uplink.kartheek.net: icmp_seq=1 ttl=64 time=0.42ms [ACK_RECEIVED]`
      ]);
      setPingRunning(false);
    }, 500);
  };

  return (
    <section id="uplink" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-800 bg-sky-950/60 text-sky-400 font-mono text-xs mb-3">
          <Terminal className="w-3.5 h-3.5" />
          <span>DIRECT DISPATCH // SECURE CARRIER UPLINK</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-mono font-black text-white tracking-tight uppercase">
          ESTABLISH SECURE UPLINK
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
          Open to enterprise network engineering, cloud transit architecture, and mission-critical network security roles across the United States.
        </p>
      </div>

      {/* Main Terminal & Contact Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-6 space-y-4">
          {/* Email Direct Action */}
          <div className="bg-[#080d17] border border-[#17253b] rounded-xl p-5 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-950 border border-sky-700 flex items-center justify-center text-sky-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Direct Email</div>
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="text-sm font-mono font-bold text-white hover:text-sky-400 transition-colors"
                  data-cursor="MAIL"
                >
                  {profile.contact.email}
                </a>
              </div>
            </div>
            <button
              onClick={handleCopyEmail}
              data-cursor="COPY"
              className="px-3 py-1.5 rounded text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Phone Direct */}
          <div className="bg-[#080d17] border border-[#17253b] rounded-xl p-5 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Voice & Signal</div>
                <a
                  href={`tel:${profile.contact.phone}`}
                  className="text-sm font-mono font-bold text-white hover:text-emerald-400 transition-colors"
                  data-cursor="CALL"
                >
                  {profile.contact.phone}
                </a>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-500">USA (EST/CST)</span>
          </div>

          {/* LinkedIn Direct */}
          <div className="bg-[#080d17] border border-[#17253b] rounded-xl p-5 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-700 flex items-center justify-center text-blue-400">
                <Linkedin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Professional Network</div>
                <a
                  href={profile.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono font-bold text-white hover:text-sky-400 transition-colors"
                  data-cursor="LINKEDIN"
                >
                  linkedin.com/{profile.contact.linkedinHandle}
                </a>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">Verified Profile</span>
          </div>
        </div>

        {/* Interactive Telemetry Uplink Console */}
        <div className="lg:col-span-6 bg-[#05080e] border border-[#17253b] rounded-xl p-5 shadow-2xl font-mono">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#141f32]">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Terminal className="w-4 h-4 text-sky-400" />
              <span>CARRIER CONSOLE // AS64512</span>
            </div>
            <div className="text-[10px] text-emerald-400">HANDSHAKE: ACTIVE</div>
          </div>

          {/* Terminal log screen */}
          <div className="bg-[#020408] border border-[#0d1522] rounded p-3 h-44 overflow-y-auto space-y-1.5 text-xs text-slate-300">
            {terminalLogs.map((log, i) => (
              <div key={i} className="leading-relaxed">
                <span className="text-slate-600 mr-2">&gt;</span>
                <span className={log.includes('ECHO_REPLY') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSendPing}
              disabled={pingRunning}
              data-cursor="PING"
              className="flex-1 py-2.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-sky-950/80 hover:bg-sky-900 border border-sky-600 text-sky-300 transition-all flex items-center justify-center gap-2"
            >
              <Send className={`w-3.5 h-3.5 ${pingRunning ? 'animate-spin' : ''}`} />
              <span>{pingRunning ? 'Transmitting Ping...' : 'Transmit Test Ping'}</span>
            </button>

            <a
              href={`mailto:${profile.contact.email}`}
              className="px-5 py-2.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 text-emerald-300 transition-all flex items-center justify-center gap-1.5"
              data-cursor="DISPATCH"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Launch Mailer</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer System Credits */}
      <div className="mt-16 pt-8 border-t border-[#141f32] flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 gap-4">
        <div>
          KARTHEEK E // ENTERPRISE NETWORK SYSTEMS ARCHITECTURE
        </div>
        <div>
          STATUS: 99.999% SLA // PACKET LOSS: 0.00% // LOC: USA
        </div>
      </div>
    </section>
  );
}
