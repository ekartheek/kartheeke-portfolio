'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ZeroTrustScene({ theme }) {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const shieldMeshRef = useRef();

  useFrame((state, delta) => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.15;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= delta * 0.12;
    if (ring3Ref.current) ring3Ref.current.rotation.x += delta * 0.1;
    if (shieldMeshRef.current) {
      shieldMeshRef.current.rotation.y += delta * 0.2;
      shieldMeshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  const primaryColor = theme?.palette?.primary || '#10b981';
  const accentColor = theme?.palette?.accent || '#34d399';

  return (
    <group>
      {/* Central Cryptographic Enclave Core */}
      <mesh ref={shieldMeshRef}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial color={primaryColor} wireframe transparent opacity={0.65} />
      </mesh>

      {/* Internal Security Anchor */}
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Ring 1 - Outer Firewall Boundary */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[2.2, 2.25, 48]} />
        <meshBasicMaterial color={primaryColor} side={THREE.DoubleSide} transparent opacity={0.4} />
      </mesh>

      {/* Ring 2 - Zero Trust Microsegmentation Layer */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3, 0, 0]}>
        <ringGeometry args={[1.6, 1.64, 48]} />
        <meshBasicMaterial color={accentColor} side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>

      {/* Ring 3 - Deep Packet Inspection Gate */}
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 3, 0]}>
        <ringGeometry args={[2.9, 2.94, 64]} />
        <meshBasicMaterial color={primaryColor} side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
