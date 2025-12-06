import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export function SquadBuilder() {
  const [mode, setMode] = useState('storm');
  const containerRef = useRef(null);
  const playersRef = useRef([]);

  useEffect(() => {
    if (containerRef.current && typeof window !== 'undefined') {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.from(containerRef.current.children, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%'
          }
        });
      });
    }
  }, []);

  const updateMode = (newMode) => {
    setMode(newMode);
    
    // Animation des joueurs
    const stormPlayers = [0, 1, 2];
    const fcPlayers = [3, 4];
    
    if (newMode === 'storm') {
      stormPlayers.forEach((idx) => {
        gsap.to(playersRef.current[idx], {
          scale: 1.2,
          backgroundColor: '#ea580c',
          color: '#fff',
          duration: 0.5,
          ease: 'back.out(1.7)'
        });
      });
      fcPlayers.forEach((idx) => {
        gsap.to(playersRef.current[idx], {
          scale: 1,
          backgroundColor: '#e7e5e4',
          color: '#78716c',
          opacity: 0.5,
          duration: 0.5
        });
      });
    } else {
      fcPlayers.forEach((idx) => {
        gsap.to(playersRef.current[idx], {
          scale: 1.2,
          backgroundColor: '#16a34a',
          color: '#fff',
          duration: 0.5,
          ease: 'back.out(1.7)'
        });
      });
      stormPlayers.forEach((idx) => {
        gsap.to(playersRef.current[idx], {
          scale: 1,
          backgroundColor: '#e7e5e4',
          color: '#78716c',
          opacity: 0.5,
          duration: 0.5
        });
      });
    }
  };

  return (
    <section id="squad" className="py-20 bg-stone-50 dark:bg-stone-900 relative overflow-hidden">
      {/* Background subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent dark:from-orange-950/20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-stone-900 dark:text-stone-100 mb-4">
            La Stratégie d'Équipe
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-3xl mx-auto">
            Vous avez 5 joueurs. Vous ne pouvez pas les utiliser n'importe comment. La "Règle du Split" impose un choix crucial dès le début.
          </p>
        </div>

        <div 
          ref={containerRef}
          className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto border border-stone-200 dark:border-stone-700"
        >
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200">
                  Votre Roster (5 Joueurs)
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Cliquez sur les groupes pour voir les restrictions.
                </p>
              </div>
              <div className="flex space-x-2 p-1 bg-stone-100 dark:bg-stone-700 rounded-lg">
                <button
                  onClick={() => updateMode('storm')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    mode === 'storm'
                      ? 'bg-white dark:bg-stone-600 text-stone-900 dark:text-stone-100 shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  Phase Storm 4
                </button>
                <button
                  onClick={() => updateMode('fc')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    mode === 'fc'
                      ? 'bg-white dark:bg-stone-600 text-stone-900 dark:text-stone-100 shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  Phase FC 25
                </button>
              </div>
            </div>

            {/* Visual Representation */}
            <div className="flex justify-center items-center gap-4 md:gap-8 mb-8">
              {[1, 2, 3, 4, 5].map((num, idx) => (
                <div key={num}>
                  {idx === 2 && <div className="w-px h-24 bg-stone-300 dark:bg-stone-600 mx-2" />}
                  <div
                    ref={(el) => (playersRef.current[idx] = el)}
                    className="w-16 h-16 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-xl font-bold text-stone-500 dark:text-stone-400 transition-all duration-500 cursor-pointer hover:scale-110"
                  >
                    J{num}
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`p-4 rounded-r-md border-l-4 transition-all duration-500 ${
                mode === 'storm'
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
                  : 'bg-green-50 dark:bg-green-900/20 border-green-500'
              }`}
            >
              {mode === 'storm' ? (
                <>
                  <h4 className="font-bold text-orange-800 dark:text-orange-400 mb-2">
                    Le Commando Storm (3 Joueurs)
                  </h4>
                  <p className="text-orange-700 dark:text-orange-300">
                    Ces joueurs participent à Storm 4.{' '}
                    <span className="font-bold">ILS NE PEUVENT PAS</span> jouer à FC 25 ensuite.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-green-800 dark:text-green-400 mb-2">
                    Le Duo FC 25 (2 Joueurs)
                  </h4>
                  <p className="text-green-700 dark:text-green-300">
                    Ce sont les réserves de la première phase. C'est à eux de rattraper les points si l'équipe Storm a échoué.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

