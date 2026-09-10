'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SpineLeafScene({ theme }) {
  const groupRef = useRef();

  // Spine nodes (top layer) and Leaf nodes (bottom layer)
  const spines = useMemo(() => [
    [-1.6, 1.4, 0],
    [0, 1.4, 0.4],
    [1.6, 1.4, 0]
  ], []);

  const leaves = useMemo(() => [
    [-2.4, -1.2, -0.4],
    [-0.8, -1.2, 0.2],
    [0.8, -1.2, 0.2],
    [2.4, -1.2, -0.4]
  ], []);

  // Full-mesh spine-to-leaf interconnect crossbar
  const crossbarPoints = useMemo(() => {
    const pts = [];
    spines.forEach((s) => {
      leaves.forEach((l) => {
        pts.push(new THREE.Vector3(...s));
        pts.push(new THREE.Vector3(...l));
      });
    });
    return pts;
  }, [spines, leaves]);

  const crossbarGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(crossbarPoints);
  }, [crossbarPoints]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.35;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.12;
    }
  });

  const primaryColor = theme?.palette?.primary || '#d97706';
  const accentColor = theme?.palette?.accent || '#f59e0b';

  return (
    <group ref={groupRef}>
      {/* Interconnect Crossbar lines */}
      <lineSegments geometry={crossbarGeometry}>
        <lineBasicMaterial color={primaryColor} opacity={0.3} transparent />
      </lineSegments>

      {/* Spine Switches */}
      {spines.map((pos, idx) => (
        <group key={`spine-${idx}`} position={pos}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
            <meshBasicMaterial color={primaryColor} wireframe />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color={accentColor} />
          </mesh>
        </group>
      ))}

      {/* Leaf Switches */}
      {leaves.map((pos, idx) => (
        <group key={`leaf-${idx}`} position={pos}>
          <mesh>
            <boxGeometry args={[0.4, 0.18, 0.4]} />
            <meshBasicMaterial color={primaryColor} wireframe />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshBasicMaterial color={accentColor} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
