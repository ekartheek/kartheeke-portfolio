'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function OpticalWaveguideScene() {
  const ribbonsGroupRef = useRef();
  const pulsesRef = useRef();
  const scrollRef = useRef({ current: 0, target: 0 });

  // Track global scroll smoothly
  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollRef.current.target = window.scrollY / max;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Expansive architectural parallel optic waveguide network
  const ribbonCount = 26;
  const pointsPerRibbon = 90;

  const { ribbonGeometries, paths } = useMemo(() => {
    const geometries = [];
    const ribbonPaths = [];

    for (let r = 0; r < ribbonCount; r++) {
      // Offset ribbons across 3D depth and vertical layers
      const zOffset = (r - ribbonCount / 2) * 0.4;
      const yBase = -1.5 + (r / ribbonCount) * 2.8 + Math.sin(r * 0.4) * 0.3;
      const pts = [];

      for (let i = 0; i < pointsPerRibbon; i++) {
        const u = i / (pointsPerRibbon - 1);
        const x = (u - 0.5) * 20; // wide enough to cover wide screens
        // Harmonic carrier wave equation with multi-frequency undulation
        const y = yBase 
          + Math.sin(u * Math.PI * 2.5 + r * 0.28) * 0.5 
          + Math.cos(u * Math.PI * 4 + r * 0.15) * 0.2;
        const z = zOffset + Math.sin(u * Math.PI * 1.5 + r * 0.35) * 0.5;
        pts.push(new THREE.Vector3(x, y, z));
      }

      ribbonPaths.push(pts);
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      geometries.push(geom);
    }

    return { ribbonGeometries: geometries, paths: ribbonPaths };
  }, [ribbonCount, pointsPerRibbon]);

  // High-density optical light pulses traversing the carrier conduits
  const pulseCount = 56;
  const pulseData = useMemo(() => {
    const data = [];
    const colors = [
      new THREE.Color('#38bdf8'), // Laser Sky
      new THREE.Color('#0284c7'), // Single-mode Blue
      new THREE.Color('#10b981'), // NOC Emerald
      new THREE.Color('#38bdf8')  // Cyan
    ];

    for (let i = 0; i < pulseCount; i++) {
      const ribbonIndex = Math.floor(Math.random() * ribbonCount);
      data.push({
        ribbonIndex,
        progress: Math.random(),
        speed: 0.0025 + Math.random() * 0.004,
        size: 0.035 + Math.random() * 0.03,
        color: colors[i % colors.length]
      });
    }
    return data;
  }, [ribbonCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Subtle architectural datum floor grid
  const gridLinesGeometry = useMemo(() => {
    const pts = [];
    const size = 24;
    const step = 1.2;
    const yFloor = -2.8;

    for (let x = -size / 2; x <= size / 2; x += step) {
      pts.push(new THREE.Vector3(x, yFloor, -size / 2));
      pts.push(new THREE.Vector3(x, yFloor, size / 2));
    }
    for (let z = -size / 2; z <= size / 2; z += step) {
      pts.push(new THREE.Vector3(-size / 2, yFloor, z));
      pts.push(new THREE.Vector3(size / 2, yFloor, z));
    }

    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame((state) => {
    // Smooth lerp of scroll target
    scrollRef.current.current = THREE.MathUtils.lerp(
      scrollRef.current.current,
      scrollRef.current.target,
      0.06
    );
    const scrollP = scrollRef.current.current;

    // React dynamically to both ambient time and user scroll depth
    if (ribbonsGroupRef.current) {
      const time = state.clock.elapsedTime;
      // Ambient rotation modulated by scroll position
      ribbonsGroupRef.current.rotation.y = Math.sin(time * 0.06) * 0.08 + (scrollP * 0.6);
      ribbonsGroupRef.current.rotation.x = 0.08 + Math.cos(time * 0.05) * 0.04 - (scrollP * 0.25);
      // Gentle vertical transit across scroll
      ribbonsGroupRef.current.position.y = (scrollP * 0.8) - 0.2;
      ribbonsGroupRef.current.position.z = -0.5 - (scrollP * 0.6);
    }

    // Move optical light pulses smoothly along ribbon curves
    if (pulsesRef.current) {
      pulseData.forEach((pulse, idx) => {
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) pulse.progress = 0;

        const path = paths[pulse.ribbonIndex];
        if (!path) return;

        const pointIndex = Math.floor(pulse.progress * (path.length - 1));
        const nextIndex = Math.min(pointIndex + 1, path.length - 1);
        const fraction = (pulse.progress * (path.length - 1)) - pointIndex;

        const currentPos = new THREE.Vector3().lerpVectors(path[pointIndex], path[nextIndex], fraction);
        dummy.position.copy(currentPos);
        dummy.scale.setScalar(pulse.size);
        dummy.updateMatrix();
        pulsesRef.current.setMatrixAt(idx, dummy.matrix);
      });
      pulsesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={ribbonsGroupRef} position={[0, 0, -0.5]}>
      {/* 1. Architectural Floor Grid Plane */}
      <lineSegments geometry={gridLinesGeometry}>
        <lineBasicMaterial color="#0e1e33" transparent opacity={0.4} />
      </lineSegments>

      {/* 2. Structured Parallel Optical Waveguide Lines */}
      {ribbonGeometries.map((geom, idx) => {
        const isCyan = idx % 4 === 0;
        const isEmerald = idx % 9 === 0;
        const color = isEmerald ? '#10b981' : isCyan ? '#38bdf8' : '#0284c7';
        const opacity = isEmerald ? 0.35 : isCyan ? 0.45 : 0.22;

        return (
          <line key={idx} geometry={geom}>
            <lineBasicMaterial
              color={color}
              transparent
              opacity={opacity}
              linewidth={1}
            />
          </line>
        );
      })}

      {/* 3. Luminous Data Pulses traveling across conduits */}
      <instancedMesh ref={pulsesRef} args={[null, null, pulseCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.95} />
      </instancedMesh>
    </group>
  );
}
