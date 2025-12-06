import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

export function AnimatedBackground({ videoUrl, className = '' }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const starsRef = useRef(null);
  const meshRef = useRef(null);
  const videoRef = useRef(null);
  const shootingStarsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Three.js
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // CIEL ÉTOILÉ - Étoiles en arrière-plan
    const starCount = 2000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starOpacities = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Répartir les étoiles sur une sphère
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);

      starSizes[i] = Math.random() * 2 + 0.5;
      starOpacities[i] = Math.random() * 0.8 + 0.2;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starGeometry.setAttribute('opacity', new THREE.BufferAttribute(starOpacities, 1));

    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        varying float vOpacity;
        uniform float time;
        
        void main() {
          vOpacity = opacity;
          vec3 pos = position;
          // Légère animation des étoiles
          pos.xy += sin(time * 0.1 + position.z * 0.01) * 0.1;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time + position.x) * 0.3);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          // Effet de brillance
          float brightness = 1.0 + sin(distanceToCenter * 10.0) * 0.5;
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * vOpacity * brightness);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    starsRef.current = stars;

    // Système de particules orange - Plus visible
    const particleCount = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = (Math.random() - 0.5) * 40;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;

      // Couleurs orange plus vives
      const hue = 0.08 + Math.random() * 0.1;
      colors[i3] = hue;
      colors[i3 + 1] = 0.7 + Math.random() * 0.3;
      colors[i3 + 2] = 0.5 + Math.random() * 0.5;

      sizes[i] = Math.random() * 0.3 + 0.1;
      speeds[i] = Math.random() * 0.03 + 0.01;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute float speed;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.x += sin(time * speed * 10.0 + position.y * 0.1) * 2.0;
          pos.y += cos(time * speed * 8.0 + position.x * 0.1) * 2.0;
          pos.z += sin(time * speed * 6.0) * 1.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          // Effet de brillance plus intense
          float glow = 1.0 + sin(distanceToCenter * 8.0) * 0.3;
          gl_FragColor = vec4(vColor * glow, alpha * 1.2);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Mesh géométrique animé - Plus visible
    const meshGeometry = new THREE.TorusKnotGeometry(3, 0.8, 100, 16);
    const meshMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b35,
      emissive: 0xff6b35,
      emissiveIntensity: 1.2,
      metalness: 0.9,
      roughness: 0.1
    });
    const mesh = new THREE.Mesh(meshGeometry, meshMaterial);
    mesh.position.set(0, 0, -8);
    scene.add(mesh);
    meshRef.current = mesh;

    // Ajouter des étoiles filantes occasionnelles
    const shootingStars = [];
    for (let i = 0; i < 5; i++) {
      const starGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -2, 0)
      ]);
      const starMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      const shootingStar = new THREE.Line(starGeometry, starMaterial);
      shootingStar.visible = false;
      scene.add(shootingStar);
      shootingStars.push(shootingStar);
    }
    shootingStarsRef.current = shootingStars;

    // Lumières - Plus intenses
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xff6b35, 2, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffa500, 2, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Lumière directionnelle pour les étoiles
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    // Vidéo texture si fournie
    let videoTexture = null;
    if (videoUrl) {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.play().catch(() => {});
      videoRef.current = video;

      videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      
      // Créer un plan pour la vidéo
      const videoGeometry = new THREE.PlaneGeometry(20, 11.25);
      const videoMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture,
        transparent: true,
        opacity: 0.3
      });
      const videoPlane = new THREE.Mesh(videoGeometry, videoMaterial);
      videoPlane.position.z = -8;
      scene.add(videoPlane);
    }

    // Animation loop
    let frame = 0;
    let lastShootingStar = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);
      frame += 0.01;

      // Rotation lente des étoiles
      if (starsRef.current) {
        starsRef.current.rotation.z += 0.0001;
        starsRef.current.material.uniforms.time.value = frame;
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.0005;
        particlesRef.current.rotation.y += 0.0008;
        particlesRef.current.material.uniforms.time.value = frame;
      }

      if (meshRef.current) {
        meshRef.current.rotation.x += 0.001;
        meshRef.current.rotation.y += 0.0015;
        meshRef.current.position.y = Math.sin(frame) * 1;
        meshRef.current.position.x = Math.cos(frame * 0.5) * 0.5;
      }

      if (pointLight1) {
        pointLight1.position.x = Math.sin(frame) * 15;
        pointLight1.position.y = Math.cos(frame) * 15;
        pointLight1.intensity = 2 + Math.sin(frame * 2) * 0.5;
      }

      if (pointLight2) {
        pointLight2.position.x = Math.cos(frame) * -15;
        pointLight2.position.y = Math.sin(frame) * -15;
        pointLight2.intensity = 2 + Math.cos(frame * 2) * 0.5;
      }

      // Étoiles filantes occasionnelles
      if (frame - lastShootingStar > 3 + Math.random() * 5) {
        const star = shootingStarsRef.current[Math.floor(Math.random() * shootingStarsRef.current.length)];
        if (star) {
          star.visible = true;
          const startX = (Math.random() - 0.5) * 30;
          const startY = (Math.random() - 0.5) * 30;
          star.position.set(startX, startY, -20);
          
          gsap.to(star.position, {
            x: startX - 20,
            y: startY - 20,
            z: 20,
            duration: 1.5,
            ease: 'power2.out',
            onComplete: () => {
              star.visible = false;
            }
          });
          
          gsap.to(star.material, {
            opacity: 0,
            duration: 1.5,
            ease: 'power2.out'
          });
          
          lastShootingStar = frame;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      if (meshGeometry) meshGeometry.dispose();
      if (meshMaterial) meshMaterial.dispose();
      if (videoTexture) videoTexture.dispose();
    };
  }, [videoUrl]);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 z-0 ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
}

