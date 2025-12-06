import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, EyeOff, Grid3x3, Layers } from 'lucide-react';
import arenasData from '../data/arenas.json';
import { VideoBackground } from './VideoBackground';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const colorClasses = {
  orange: {
    bg: 'bg-orange-500',
    text: 'text-orange-600 dark:text-orange-500',
    border: 'border-orange-500',
    hover: 'hover:border-orange-500'
  },
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-500',
    border: 'border-blue-500',
    hover: 'hover:border-blue-500'
  },
  green: {
    bg: 'bg-green-600',
    text: 'text-green-600 dark:text-green-500',
    border: 'border-green-600',
    hover: 'hover:border-green-600'
  },
  pink: {
    bg: 'bg-pink-500',
    text: 'text-pink-600 dark:text-pink-500',
    border: 'border-pink-500',
    hover: 'hover:border-pink-500'
  },
  yellow: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-600 dark:text-yellow-500',
    border: 'border-yellow-500',
    hover: 'hover:border-yellow-500'
  }
};

export function ArenaCards() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [hiddenCards, setHiddenCards] = useState(new Set());
  const videoIntervalRef = useRef(null);
  const videosRef = useRef({});

  // Fonction helper pour convertir URL YouTube
  function getVideoEmbedUrl(url) {
    if (!url) return null;
    
    if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')) {
      return url;
    }
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1`;
      }
    }
    
    return null;
  }

  // Préchargement de toutes les vidéos
  useEffect(() => {
    const videosWithUrl = arenasData.filter(arena => arena.videoUrl);
    if (videosWithUrl.length === 0) {
      setVideosLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalVideos = videosWithUrl.length;

    const checkVideoLoad = (videoUrl, arenaId) => {
      const url = getVideoEmbedUrl(videoUrl);
      
      if (!url) {
        loadedCount++;
        if (loadedCount === totalVideos) {
          setVideosLoaded(true);
        }
        return;
      }

      // Si c'est une URL directe de vidéo
      if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')) {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.muted = true;
        
        video.addEventListener('canplaythrough', () => {
          videosRef.current[arenaId] = video;
          loadedCount++;
          if (loadedCount === totalVideos) {
            setVideosLoaded(true);
          }
        });

        video.addEventListener('error', () => {
          loadedCount++;
          if (loadedCount === totalVideos) {
            setVideosLoaded(true);
          }
        });

        video.src = url;
      } else {
        // Pour YouTube, on considère qu'il est chargé (iframe se charge après)
        loadedCount++;
        if (loadedCount === totalVideos) {
          setVideosLoaded(true);
        }
      }
    };

    videosWithUrl.forEach((arena) => {
      checkVideoLoad(arena.videoUrl, arena.id);
    });

    return () => {
      // Nettoyer les vidéos préchargées
      Object.values(videosRef.current).forEach(video => {
        video.pause();
        video.src = '';
      });
    };
  }, []);

  // Rotation automatique des vidéos en arrière-plan (seulement après chargement)
  useEffect(() => {
    if (!videosLoaded) return;

    const videosWithUrl = arenasData.filter(arena => arena.videoUrl);
    if (videosWithUrl.length === 0) return;

    videoIntervalRef.current = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videosWithUrl.length);
    }, 20000); // 20 secondes par vidéo

    return () => {
      if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
      }
    };
  }, [videosLoaded]);

  const toggleCardVisibility = (arenaId, event) => {
    if (event) event.stopPropagation();
    setHiddenCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(arenaId)) {
        newSet.delete(arenaId);
      } else {
        newSet.add(arenaId);
      }
      return newSet;
    });
  };

  const toggleAllCards = () => {
    const videosWithUrl = arenasData.filter(arena => arena.videoUrl);
    const allHidden = videosWithUrl.every(arena => hiddenCards.has(arena.id));
    
    if (allHidden) {
      // Afficher toutes les cartes
      setHiddenCards(new Set());
    } else {
      // Masquer toutes les cartes avec vidéo
      setHiddenCards(new Set(videosWithUrl.map(arena => arena.id)));
    }
  };

  useEffect(() => {
    if (containerRef.current && typeof window !== 'undefined') {
      const cards = Array.from(containerRef.current.children);
      
      // Animations d'entrée complexes
      cards.forEach((card, index) => {
        gsap.from(card, {
          y: 150,
          opacity: 0,
          rotationX: -90,
          duration: 1.2,
          delay: index * 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });

        // Animations au hover avec effets 3D
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -15,
            scale: 1.05,
            rotationY: 5,
            rotationX: 5,
            z: 20,
            duration: 0.4,
            ease: 'power3.out'
          });
          gsap.to(card.querySelector('.arena-image'), {
            scale: 1.1,
            duration: 0.4,
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            rotationY: 0,
            rotationX: 0,
            z: 0,
            duration: 0.4,
            ease: 'power2.out'
          });
          gsap.to(card.querySelector('.arena-image'), {
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
          });
        });
      });
    }
  }, []);

  const videosWithUrl = arenasData.filter(arena => arena.videoUrl);
  const currentVideo = videosWithUrl[currentVideoIndex];

  return (
    <section id="arena" className="py-20 bg-white dark:bg-stone-950 relative overflow-hidden">
      {/* Écran de chargement */}
      {!videosLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-white dark:bg-stone-950">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 dark:border-orange-500 mb-4"></div>
            <p className="text-stone-600 dark:text-stone-400">Chargement des vidéos...</p>
          </div>
        </div>
      )}

      {/* Vidéo en arrière-plan qui se succède */}
      {videosLoaded && currentVideo && (
        <VideoBackground 
          videoUrl={currentVideo.videoUrl} 
          className="opacity-60 dark:opacity-50"
        />
      )}
      
      {/* Overlay très léger - presque transparent */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/15 to-white/20 dark:from-stone-950/40 dark:via-stone-950/30 dark:to-stone-950/40 z-5" />
      
      {/* Background subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-blue-50/10 to-transparent dark:from-orange-950/10 dark:via-blue-950/5 z-5" />
      
      {/* Bouton flottant pour masquer/afficher toutes les cartes */}
      {videosLoaded && videosWithUrl.length > 0 && (
        <button
          onClick={toggleAllCards}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-orange-600 dark:bg-orange-500 text-white shadow-2xl hover:bg-orange-700 dark:hover:bg-orange-600 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group"
          aria-label={videosWithUrl.every(arena => hiddenCards.has(arena.id)) ? "Afficher toutes les cartes" : "Masquer toutes les cartes"}
        >
          {videosWithUrl.every(arena => hiddenCards.has(arena.id)) ? (
            <Grid3x3 className="w-6 h-6" />
          ) : (
            <Layers className="w-6 h-6" />
          )}
          <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-stone-900 dark:bg-stone-800 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {videosWithUrl.every(arena => hiddenCards.has(arena.id)) ? "Afficher toutes" : "Masquer toutes"}
          </span>
        </button>
      )}
      
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${!videosLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-stone-900 dark:text-stone-100 mb-4">
            Les 5 Arènes
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-400">
            Un parcours conçu pour tester toutes les compétences : Combat, Course, Sport, Rythme.
          </p>
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ perspective: '1000px' }}
        >
          {arenasData.map((arena) => {
            const colors = colorClasses[arena.color];
            const isHidden = hiddenCards.has(arena.id);

            return (
              <div
                key={arena.id}
                className={`bg-white dark:bg-stone-800 rounded-xl p-6 border-2 border-stone-200 dark:border-stone-700 ${colors.hover} transition-all duration-300 cursor-pointer group overflow-hidden shadow-lg hover:shadow-2xl relative`}
                style={{ 
                  transformStyle: 'preserve-3d',
                  opacity: isHidden ? 0 : 1,
                  pointerEvents: isHidden ? 'none' : 'auto'
                }}
              >
                {/* Bouton pour masquer/afficher la carte */}
                {arena.videoUrl && (
                  <button
                    onClick={(e) => toggleCardVisibility(arena.id, e)}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-stone-700 transition-all duration-200 hover:scale-110"
                    aria-label={isHidden ? "Afficher la carte" : "Masquer la carte"}
                  >
                    {isHidden ? (
                      <EyeOff className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                    ) : (
                      <Eye className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                    )}
                  </button>
                )}

                {/* Vidéo en arrière-plan de la carte si c'est la vidéo actuelle */}
                {arena.videoUrl && currentVideo?.id === arena.id && (
                  <VideoBackground 
                    videoUrl={arena.videoUrl} 
                    className="opacity-30 rounded-lg"
                  />
                )}
                
                {/* Image du jeu */}
                {arena.imageUrl && (
                  <div className="arena-image relative h-48 mb-4 rounded-lg overflow-hidden z-10">
                    <img
                      src={arena.imageUrl}
                      alt={arena.name}
                      className="w-full h-full object-cover transition-transform duration-400"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className={`absolute bottom-2 left-2 px-2 py-1 ${colors.bg} text-white text-xs font-bold rounded z-10`}>
                      {arena.players}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                    {arena.name}
                  </h3>
                  {!arena.imageUrl && (
                    <span className="px-2 py-1 bg-stone-200 dark:bg-stone-700 text-xs font-bold rounded text-stone-700 dark:text-stone-300">
                      {arena.players}
                    </span>
                  )}
                </div>
                <div className={`h-1 w-12 ${colors.bg} mb-4 rounded`} />
                <p className="text-stone-700 dark:text-stone-300 mb-4">
                  {arena.description}
                </p>
                <ul className="text-sm text-stone-600 dark:text-stone-400 space-y-2">
                  {arena.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className={`mr-2 ${colors.text} font-bold`}>▶</span>
                      <span className="text-stone-700 dark:text-stone-300">{rule.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

