import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeFlowerProps {
  className?: string;
}

export const ThreeFlower: React.FC<ThreeFlowerProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;

    try {
      const width = container.clientWidth || 300;
      const height = container.clientHeight || 300;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 4.5;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Organic Flower Group
      const flowerGroup = new THREE.Group();
      scene.add(flowerGroup);

      // Create Petals using curved geometries
      const petalCount = 8;
      const petalMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffb7c5,
        emissive: 0xffd1dc,
        emissiveIntensity: 0.15,
        roughness: 0.2,
        metalness: 0.05,
        transmission: 0.45,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });

      const innerPetalMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf472b6,
        emissive: 0xfbcfe8,
        emissiveIntensity: 0.2,
        roughness: 0.25,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });

      // Outer Petals
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const petalGeo = new THREE.SphereGeometry(0.7, 16, 16, 0, Math.PI);
        petalGeo.scale(0.5, 1.2, 0.2);
        const petal = new THREE.Mesh(petalGeo, petalMaterial);
        petal.rotation.z = angle;
        petal.rotation.x = 0.55;
        petal.position.x = Math.cos(angle) * 0.35;
        petal.position.y = Math.sin(angle) * 0.35;
        flowerGroup.add(petal);
      }

      // Inner Petals (offset layer)
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const petalGeo = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI);
        petalGeo.scale(0.45, 0.9, 0.25);
        const petal = new THREE.Mesh(petalGeo, innerPetalMaterial);
        petal.rotation.z = angle;
        petal.rotation.x = 0.75;
        petal.position.x = Math.cos(angle) * 0.2;
        petal.position.y = Math.sin(angle) * 0.2;
        petal.position.z = 0.15;
        flowerGroup.add(petal);
      }

      // Center Core
      const coreGeo = new THREE.SphereGeometry(0.28, 16, 16);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfde047,
        emissiveIntensity: 0.4,
        roughness: 0.4
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.z = 0.25;
      flowerGroup.add(core);

      // Ambient floating gentle particles
      const particleCount = 45;
      const particleGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      for (let p = 0; p < particleCount * 3; p += 3) {
        particlePositions[p] = (Math.random() - 0.5) * 4;
        particlePositions[p + 1] = (Math.random() - 0.5) * 4;
        particlePositions[p + 2] = (Math.random() - 0.5) * 2;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xfbcfe8,
        size: 0.04,
        transparent: true,
        opacity: 0.6
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xfff0f5, 1.2);
      dirLight1.position.set(2, 4, 3);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0xe9d5ff, 0.8);
      dirLight2.position.set(-3, -2, 2);
      scene.add(dirLight2);

      // Mouse parallax
      let mouseX = 0;
      let mouseY = 0;
      let targetRotX = 0;
      let targetRotY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Resize observer
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newW = entry.contentRect.width || 300;
          const newH = entry.contentRect.height || 300;
          if (renderer && camera) {
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
          }
        }
      });
      resizeObserver.observe(container);

      // Animation Loop
      let clock = new THREE.Clock();
      const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Organic oscillation
        targetRotY = mouseX * 0.45;
        targetRotX = -mouseY * 0.45;

        flowerGroup.rotation.z = Math.sin(elapsedTime * 0.4) * 0.15 + (elapsedTime * 0.05);
        flowerGroup.rotation.y += (targetRotY - flowerGroup.rotation.y) * 0.05;
        flowerGroup.rotation.x += (targetRotX + Math.sin(elapsedTime * 0.5) * 0.1 - flowerGroup.rotation.x) * 0.05;
        
        // Gentle breathing pulsation
        const scale = 1 + Math.sin(elapsedTime * 1.2) * 0.035;
        flowerGroup.scale.set(scale, scale, scale);

        // Particle slow rotation
        particles.rotation.y = elapsedTime * 0.03;
        particles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;

        if (renderer) {
          renderer.render(scene, camera);
        }
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        resizeObserver.disconnect();
        cancelAnimationFrame(animationFrameId);
        if (renderer && renderer.domElement) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('3D WebGL context could not be initialized, falling back to CSS visual.', err);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full flex items-center justify-center pointer-events-none select-none ${className}`}
    >
      <div className="absolute inset-0 bg-radial from-rose-200/30 via-purple-100/10 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />
    </div>
  );
};
