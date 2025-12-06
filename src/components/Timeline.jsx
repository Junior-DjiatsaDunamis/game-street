import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const timelineItems = [
  {
    time: '09h00 - 10h00',
    title: 'Check-in & Warm-up',
    description: 'Arrivée des équipes, installation et échauffement.',
    color: 'stone'
  },
  {
    time: '10h00 - 12h30',
    title: 'Phase 1 : Storm 4',
    description: 'Début des hostilités. Les stratèges ouvrent le bal.',
    color: 'orange'
  },
  {
    time: '12h30 - 13h30',
    title: 'Pause & Just Dance',
    description: 'Animation show pendant la pause repas. Garder l\'énergie haute.',
    color: 'pink'
  },
  {
    time: '13h30 - 16h00',
    title: 'Phase 3 : FC 25',
    description: 'Le binôme de réserve entre en scène pour rattraper les points.',
    color: 'green'
  },
  {
    time: '16h00 - 17h00',
    title: 'Phase 2 : Blur (LAN)',
    description: 'Chaos total. Tout le monde joue pour maximiser le score.',
    color: 'blue'
  },
  {
    time: '17h00 - 18h30',
    title: 'Phase 5 : Brawlhalla',
    description: 'Le finish nerveux.',
    color: 'yellow'
  },
  {
    time: '18h45',
    title: 'Podium & Trophée',
    description: 'Couronnement des Street Kings.',
    color: 'stone'
  }
];

const colorClasses = {
  stone: 'bg-stone-400 dark:bg-stone-600',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  green: 'bg-green-600',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500'
};

const textColorClasses = {
  stone: 'text-stone-400 dark:text-stone-500',
  orange: 'text-orange-600 dark:text-orange-500',
  pink: 'text-pink-600 dark:text-pink-500',
  green: 'text-green-700 dark:text-green-500',
  blue: 'text-blue-600 dark:text-blue-500',
  yellow: 'text-yellow-600 dark:text-yellow-500'
};

export function Timeline() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll('.timeline-item');
      
      items.forEach((item, index) => {
        gsap.from(item, {
          x: -100,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          delay: index * 0.1
        });
      });
    }
  }, []);

  return (
    <section id="timeline" className="py-20 bg-stone-50 dark:bg-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-stone-900 dark:text-stone-100 mb-4">
            Planning de la Journée
          </h2>
        </div>
        
        <div ref={containerRef} className="relative border-l-4 border-stone-300 dark:border-stone-700 ml-6 space-y-12">
          {timelineItems.map((item, index) => (
            <div
              key={index}
              className="timeline-item relative pl-8"
            >
              <div
                className={`absolute -left-3.5 top-0 w-6 h-6 ${colorClasses[item.color]} rounded-full border-4 border-stone-50 dark:border-stone-900 transition-transform hover:scale-125`}
              />
              <span className={`text-sm font-bold ${textColorClasses[item.color]}`}>
                {item.time}
              </span>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200 mt-1">
                {item.title}
              </h3>
              <p className="text-stone-600 dark:text-stone-400 mt-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

