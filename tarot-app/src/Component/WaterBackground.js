"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// 1. Large Twinkling Stars
function TwinklingStars() {
  const pointsRef = useRef();
  
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 35;
    positions[i + 1] = (Math.random() - 0.5) * 25;
    positions[i + 2] = (Math.random() - 0.5) * 25;
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.006;
    pointsRef.current.rotation.x = time * 0.002;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#fef08a"
        size={0.4}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
      />
    </Points>
  );
}

// 2. Ultra-Glowing Mystical Golden Moon with Aura Ring
function GlowingMoon() {
  const moonRef = useRef();
  const auraRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    moonRef.current.rotation.y = time * 0.04;
    // Aura ka halka sa breathing/pulsing effect
    const scale = 1.0 + Math.sin(time * 2) * 0.05;
    auraRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group position={[4, 2.5, -5]}>
      {/* Outer Giant Soft Glow Aura */}
      <mesh ref={auraRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#fde047"
          transparent={true}
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main High-Intensity Moon Core */}
      <Sphere ref={moonRef} args={[1.3, 32, 32]}>
        <meshStandardMaterial
          color="#fef08a"
          emissive="#ffea28"
          emissiveIntensity={6.0}
          roughness={0.1}
          metalness={0.2}
        />
      </Sphere>

      {/* Powerful Point Light for Environment Lighting */}
      <pointLight color="#ffea28" intensity={18} distance={30} decay={1.5} />
    </group>
  );
}

// Main Canvas Wrapper
export default function WaterBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none bg-black">
      <Canvas camera={{ position: [0, 2, 7], fov: 55 }} gl={{ background: '#000000' }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[0, 10, 5] } intensity={2.0} color="#f59e0b" />
        
        <TwinklingStars />
        <GlowingMoon />
      </Canvas>
    </div>
  );
}