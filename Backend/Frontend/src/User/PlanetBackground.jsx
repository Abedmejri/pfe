import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';

function Aurora() {
  const auroraRef = useRef();

  useFrame(({ clock }) => {
    if (auroraRef.current) {
      auroraRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.5;
      auroraRef.current.rotation.z = Math.cos(clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <Sphere ref={auroraRef} args={[1.15, 32, 32]}>
      <meshPhongMaterial
        color="#4ade80"
        transparent
        opacity={0.2}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Sphere>
  );
}

function Atmosphere() {
  const atmosphereRef = useRef();

  useFrame(({ clock }) => {
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Sphere ref={atmosphereRef} args={[1.1, 32, 32]}>
      <meshPhongMaterial
        color="#818cf8"
        transparent
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Sphere>
  );
}

function Clouds() {
  const cloudsRef = useRef();

  useFrame(({ clock }) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Sphere ref={cloudsRef} args={[1.02, 32, 32]}>
      <meshPhongMaterial
        color="#f0f9ff"
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </Sphere>
  );
}

function Planet() {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = clock.getElapsedTime() * -0.05;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial
          color="#f472b6"
          shininess={90}
          specular={new THREE.Color('#fdf4ff')}
          emissive={new THREE.Color('#701a75')}
          emissiveIntensity={0.5}
        />
      </Sphere>
      <Sphere ref={glowRef} args={[1.01, 32, 32]}>
        <meshPhongMaterial
          color="#e879f9"
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </Sphere>
      <Clouds />
      <Atmosphere />
      <Aurora />
    </group>
  );
}

export default function PlanetBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-purple-950 via-fuchsia-900 to-black">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#f0abfc" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#4ade80" />
        <pointLight position={[5, 5, -5]} intensity={1.5} color="#818cf8" />
        <Planet />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
}