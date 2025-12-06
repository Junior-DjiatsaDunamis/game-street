import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { AnimatedBackground } from './AnimatedBackground';

// Vérifier que GSAP est disponible côté client
if (typeof window !== 'undefined') {
  window.gsap = gsap;
}

export function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current || !buttonRef.current) return;
    
    // Animations GSAP complexes et intenses
    const tl = gsap.timeline({ delay: 0.2 });
    
    if (titleRef.current.children.length > 0) {
      // Animation avec split text effect - Préserver les classes
      Array.from(titleRef.current.children).forEach((span, index) => {
        const originalClasses = span.className;
        const originalText = span.textContent;
        const isOrange = span.classList.contains('text-orange-600') || span.classList.contains('dark:text-orange-500');
        
        const chars = originalText.split('');
        span.innerHTML = chars.map(char => 
          char === ' ' ? ' ' : `<span class="char">${char}</span>`
        ).join('');
        
        // Réappliquer les classes au span parent
        span.className = originalClasses;
        
        const charSpans = span.querySelectorAll('.char');
        // Appliquer la couleur orange aux caractères si nécessaire
        if (isOrange) {
          charSpans.forEach(charSpan => {
            charSpan.classList.add('text-orange-600', 'dark:text-orange-500');
          });
        }
        
        gsap.from(charSpans, {
          y: 150,
          opacity: 0,
          rotationX: -90,
          duration: 0.8,
          stagger: 0.02,
          delay: index * 0.3,
          ease: 'back.out(1.7)'
        });
      });
    }
    
    tl.from(subtitleRef.current, {
      y: 80,
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: 'elastic.out(1, 0.5)'
    }, '-=0.3')
    .from(buttonRef.current, {
      scale: 0,
      rotation: -180,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(2)'
    }, '-=0.2');

    // Animation continue du bouton
    gsap.to(buttonRef.current, {
      y: -5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header 
      id="concept" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-950"
    >
      {/* Animated Background avec ciel étoilé et support vidéo */}
      <AnimatedBackground videoUrl="" className="" />
      
      {/* Gradient overlay dynamique - Plus transparent pour voir le background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-50/70 to-stone-50 dark:via-stone-900/70 dark:to-stone-900 z-10" />
      
      {/* Effet de lumière animé - Plus visible */}
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/30 via-orange-400/10 to-transparent z-10 animate-pulse" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="flex flex-col space-y-4 items-center">
        <div className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-stone-900 dark:text-stone-100 text-center">
          Plus qu'un tournoi.
        </div>
        <div className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-orange-600 dark:text-orange-500 mt-2 text-center">
          Devenez Street Kings.
        </div>
      </div>
        
        <p 
          ref={subtitleRef}
          className="mt-6 text-lg sm:text-xl md:text-2xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto"
        >
          Une compétition e-sport urbaine par équipes de 5. Cohésion, stratégie et polyvalence sont vos seules armes pour conquérir les 5 phases du tournoi.
        </p>

        <div ref={buttonRef} className="mt-10">
          <button
            onClick={() => scrollToSection('squad')}
            className="group relative px-8 py-4 text-lg font-bold text-white bg-orange-600 dark:bg-orange-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50"
          >
            <span className="relative z-10">Découvrir la Stratégie</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-orange-700 dark:bg-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-orange-600 dark:border-orange-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-orange-600 dark:bg-orange-500 rounded-full mt-2" />
        </div>
      </div>
    </header>
  );
}

