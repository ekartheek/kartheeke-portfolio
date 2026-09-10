'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function UnifiedNetworkCoreScene() {
  const groupRef = useRef();
  const innerRef = useRef();
  const packetsRef = useRef();

  // Generate an interconnected 3D network topology spherical lattice
  const { nodes, edges } = useMemo(() => {
    const pts = [];
    const radius = 2.4;
    const count = 38;

    // Fibonacci sphere distribution for harmonious network node placement
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      pts.push({
        pos: [x, y, z],
        size: i % 4 === 0 ? 0.12 : 0.07,
        isCore: i % 4 === 0
      });
    }

    // Connect nodes within threshold distance
    const linePairs = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const v1 = new THREE.Vector3(...pts[i].pos);
        const v2 = new THREE.Vector3(...pts[j].pos);
        if (v1.distanceTo(v2) < 1.7) {
          linePairs.push([i, j]);
        }
      }
    }

    return { nodes: pts, edges: linePairs };
  }, []);

  // Optical fiber lines geometry
  const lineGeometry = useMemo(() => {
    const pts = [];
    edges.forEach(([i, j]) => {
      pts.push(new THREE.Vector3(...nodes[i].pos));
      pts.push(new THREE.Vector3(...nodes[j].pos));
    });
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [nodes, edges]);

  // Packets traveling between nodes along active edges
  const packetCount = 24;
  const packetData = useMemo(() => {
    const data = [];
    for (let i = 0; i < packetCount; i++) {
      const edge = edges[Math.floor(Math.random() * edges.length)];
      if (!edge) continue;
      data.push({
        start: new THREE.Vector3(...nodes[edge[0]].pos),
        end: new THREE.Vector3(...nodes[edge[1]].pos),
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.008
      });
    }
    return data;
  }, [nodes, edges]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.09;
    }

    if (packetsRef.current && packetData.length > 0) {
      packetData.forEach((p, idx) => {
        p.progress += p.speed;
        if (p.progress >= 1) p.progress = 0;
        const currentPos = new THREE.Vector3().lerpVectors(p.start, p.end, p.progress);
        dummy.position.copy(currentPos);
        dummy.scale.setScalar(0.05);
        dummy.updateMatrix();
        packetsRef.current.setMatrixAt(idx, dummy.matrix);
      });
      packetsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Optical Fiber Links */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#0284c7" opacity={0.28} transparent />
      </lineSegments>

      {/* Internal Routing Core Glow */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial color="#0284c7" wireframe transparent opacity={0.2} />
      </mesh>

      {/* Nodes in 3D Space */}
      {nodes.map((node, i) => (
        <group key={i} position={node.pos}>
          <mesh>
            <sphereGeometry args={[node.size, 10, 10]} />
            <meshBasicMaterial
              color={node.isCore ? '#38bdf8' : '#0284c7'}
              transparent
              opacity={node.isCore ? 0.95 : 0.65}
            />
          </mesh>
          {node.isCore && (
            <mesh>
              <sphereGeometry args={[node.size * 2, 8, 8]} />
              <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.25} />
            </mesh>
          )}
        </group>
      ))}

      {/* Dynamic Data Packets */}
      <instancedMesh ref={packetsRef} args={[null, null, packetCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </instancedMesh>
    </group>
  );
}
