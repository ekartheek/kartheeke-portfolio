'use client';

import React from 'react';
import Navbar from '../components/navigation/Navbar';
import Hero from '../components/hero/Hero';
import NetworkTelemetrySection from '../components/telemetry/NetworkTelemetrySection';
import ArchitectureSection from '../components/architecture/ArchitectureSection';
import ProjectSection from '../components/projects/ProjectSection';
import SkillsSection from '../components/skills/SkillsSection';
import ProcessFlow from '../components/process/ProcessFlow';
import Timeline from '../components/experience/Timeline';
import SecureUplink from '../components/contact/SecureUplink';

import ArchitecturalGridBg from '../components/shared/ArchitecturalGridBg';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#06090e] text-[#f8fafc] overflow-x-hidden selection:bg-sky-900 selection:text-white">
      {/* Shared Architectural Ambient Background */}
      <ArchitecturalGridBg />

      {/* Floating Navigation */}
      <Navbar />


      {/* Hero: Clean, Minimal, Visually Focused 3D Network Core */}
      <Hero />

      {/* Rich Visual Telemetry & Analytics (Charts, Waveform, SLA Rings, Matrix) */}
      <NetworkTelemetrySection />

      {/* Signature Centerpiece: How I Think & Interactive Topology Graph */}
      <ArchitectureSection />

      {/* Production Blueprints: NYS ITS, JPMorganChase, ADP */}
      <ProjectSection />

      {/* Protocols & Hardware Rack Simulator */}
      <SkillsSection />

      {/* Triage War-Room: Incident Resolution Pipeline */}
      <ProcessFlow />

      {/* Career Trajectory & Telemetry Timeline */}
      <Timeline />

      {/* Secure Uplink & Terminal Dispatch */}
      <SecureUplink />
    </main>
  );
}
