import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedBackground } from './AnimatedBackground';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScoringSection() {
  const [stage, setStage] = useState('end');
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%'
        }
      });
    }
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      // Animation du graphique avec GSAP
      const bars = chartRef.current.querySelectorAll('.bar');
      gsap.from(bars, {
        scaleY: 0,
        transformOrigin: 'bottom',
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3
      });
    }
  }, [stage]);

  const scoringData = {
    start: {
      regular: [20, 0, 0, 0, 0],
      phoenix: [10, 0, 0, 0, 0]
    },
    mid: {
      regular: [20, 20, 20, 0, 0],
      phoenix: [10, 100, 40, 0, 0]
    },
    end: {
      regular: [20, 20, 20, 40, 20],
      phoenix: [10, 100, 40, 70, 40]
    }
  };

  const data = scoringData[stage];
  const phases = ['Storm 4', 'Just Dance', 'FC 25', 'Blur', 'Brawlhalla'];
  const maxValue = Math.max(...data.regular, ...data.phoenix);

  return (
    <section id="scoring" className="py-20 bg-stone-800 dark:bg-black text-white relative overflow-hidden">
      {/* Background animé */}
      <div className="absolute inset-0 opacity-10">
        <AnimatedBackground videoUrl="" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Street Points : Gardez l'Espoir
            </h2>
            <p className="mt-4 text-stone-400 text-lg">
              Nous avons conçu un système de points cumulatifs pour éviter l'élimination précoce. 
              Perdre une phase n'est pas la fin.
            </p>
            
            <div className="mt-8 space-y-4">
              {[
                { label: 'Vainqueur de Phase', points: 100, color: 'text-orange-500' },
                { label: 'Finaliste', points: 70, color: 'text-stone-300' },
                { label: 'Demi-finalistes (Top 4)', points: 40, color: 'text-stone-400' },
                { label: 'Quarts (Top 8)', points: 20, color: 'text-stone-500' },
                { label: 'Participation', points: 10, color: 'text-stone-600' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-stone-700 pb-2"
                >
                  <span>{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.points} pts</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-stone-800 dark:bg-stone-900 rounded-lg border border-stone-700">
              <h4 className="font-bold text-orange-400 mb-2">💡 Les Primes (Bounties)</h4>
              <p className="text-sm text-stone-400">
                En plus du classement général, chaque jeu offre une récompense immédiate (Cash ou Lot) à son vainqueur. Même dernier au général, vous pouvez repartir gagnant d'une phase.
              </p>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="bg-white dark:bg-stone-800 rounded-xl p-6 text-stone-900 dark:text-stone-100 shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Simulation : La Remontada</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              Voyez comment une équipe qui échoue au début (Team Phoenix) peut rattraper une équipe moyenne (Team Regular).
            </p>
            
            <div ref={chartRef} className="h-64 mb-4 flex items-end justify-between gap-2">
              {phases.map((phase, idx) => {
                const regularHeight = (data.regular[idx] / maxValue) * 100;
                const phoenixHeight = (data.phoenix[idx] / maxValue) * 100;
                const regularTotal = data.regular.slice(0, idx + 1).reduce((a, b) => a + b, 0);
                const phoenixTotal = data.phoenix.slice(0, idx + 1).reduce((a, b) => a + b, 0);
                
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center gap-1" style={{ height: '200px' }}>
                      <div
                        className="bar w-full bg-stone-400 dark:bg-stone-600 rounded-t"
                        style={{ height: `${regularHeight}%` }}
                        title={`Regular: ${regularTotal}pts`}
                      />
                      <div
                        className="bar w-full bg-orange-600 dark:bg-orange-500 rounded-t"
                        style={{ height: `${phoenixHeight}%` }}
                        title={`Phoenix: ${phoenixTotal}pts`}
                      />
                    </div>
                    <span className="text-xs text-center text-stone-600 dark:text-stone-400 mt-2">
                      {phase}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center space-x-2 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-stone-400 dark:bg-stone-600 rounded" />
                <span className="text-xs">Team Regular</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-600 dark:bg-orange-500 rounded" />
                <span className="text-xs">Team Phoenix</span>
              </div>
            </div>

            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={() => setStage('start')}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  stage === 'start'
                    ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 font-bold'
                    : 'bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600'
                }`}
              >
                Début Tournoi
              </button>
              <button
                onClick={() => setStage('mid')}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  stage === 'mid'
                    ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 font-bold'
                    : 'bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600'
                }`}
              >
                Mi-Parcours
              </button>
              <button
                onClick={() => setStage('end')}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  stage === 'end'
                    ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 font-bold'
                    : 'bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600'
                }`}
              >
                Résultat Final
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

