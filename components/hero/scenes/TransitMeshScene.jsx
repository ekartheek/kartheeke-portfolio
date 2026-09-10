'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function TransitMeshScene({ theme }) {
  const groupRef = useRef();
  const packetsRef = useRef();

  // Create primary network routing nodes in 3D space
  const nodes = useMemo(() => {
    return [
      { pos: [0, 0, 0], size: 0.45 },
      { pos: [-2.4, 1.2, -0.5], size: 0.35 },
      { pos: [2.5, 1.1, -0.6], size: 0.35 },
      { pos: [-1.8, -1.5, 0.4], size: 0.32 },
      { pos: [1.9, -1.4, 0.3], size: 0.32 },
      { pos: [-3.5, -0.2, -1.2], size: 0.25 },
      { pos: [3.4, -0.1, -1.1], size: 0.25 },
      { pos: [0, 2.2, -0.8], size: 0.28 },
      { pos: [0, -2.2, -0.5], size: 0.28 }
    ];
  }, []);

  // Compute connections (optical fiber lines) between nodes
  const linePoints = useMemo(() => {
    const points = [];
    // Connect center node to primary satellites
    const edges = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 7], [0, 8],
      [1, 5], [1, 7], [2, 6], [2, 7], [3, 5], [3, 8], [4, 6], [4, 8]
    ];
    edges.forEach(([i, j]) => {
      points.push(new THREE.Vector3(...nodes[i].pos));
      points.push(new THREE.Vector3(...nodes[j].pos));
    });
    return points;
  }, [nodes]);

  const lineGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(linePoints);
    return geom;
  }, [linePoints]);

  // Packets traveling along lines
  const packetCount = 28;
  const packetData = useMemo(() => {
    const data = [];
    for (let i = 0; i < packetCount; i++) {
      const nodeA = nodes[Math.floor(Math.random() * nodes.length)].pos;
      const nodeB = nodes[Math.floor(Math.random() * nodes.length)].pos;
      data.push({
        start: new THREE.Vector3(...nodeA),
        end: new THREE.Vector3(...nodeB),
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.008
      });
    }
    return data;
  }, [nodes]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle subtle rotation
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }

    if (packetsRef.current) {
      packetData.forEach((p, idx) => {
        p.progress += p.speed;
        if (p.progress >= 1) p.progress = 0;
        const currentPos = new THREE.Vector3().lerpVectors(p.start, p.end, p.progress);
        dummy.position.copy(currentPos);
        dummy.scale.setScalar(0.06);
        dummy.updateMatrix();
        packetsRef.current.setMatrixAt(idx, dummy.matrix);
      });
      packetsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const primaryColor = theme?.palette?.primary || '#0284c7';
  const accentColor = theme?.palette?.accent || '#38bdf8';

  return (
    <group ref={groupRef}>
      {/* Optical Fiber Lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={primaryColor} opacity={0.35} transparent />
      </lineSegments>

      {/* Network Core Routing Nodes */}
      {nodes.map((n, i) => (
        <group key={i} position={n.pos}>
          {/* Glowing wireframe node */}
          <mesh>
            <octahedronGeometry args={[n.size, 1]} />
            <meshBasicMaterial color={primaryColor} wireframe transparent opacity={0.7} />
          </mesh>
          {/* Inner core light */}
          <mesh>
            <sphereGeometry args={[n.size * 0.4, 8, 8]} />
            <meshBasicMaterial color={accentColor} />
          </mesh>
        </group>
      ))}

      {/* Dynamic Data Packets (Instanced Mesh for high performance) */}
      <instancedMesh ref={packetsRef} args={[null, null, packetCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={accentColor} />
      </instancedMesh>
    </group>
  );
}
