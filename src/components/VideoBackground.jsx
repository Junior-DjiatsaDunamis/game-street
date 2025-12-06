import { useEffect, useRef, useState } from 'react';

// Convertir URL YouTube en embed ou utiliser directement si c'est une URL de vidéo
function getVideoEmbedUrl(url) {
  if (!url) return null;
  
  // Si c'est déjà une URL directe de vidéo
  if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')) {
    return url;
  }
  
  // Si c'est une URL YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1`;
    }
  }
  
  return null;
}

export function VideoBackground({ videoUrl, className = '' }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isVideo, setIsVideo] = useState(false);
  const [embedUrl, setEmbedUrl] = useState(null);

  useEffect(() => {
    if (!videoUrl) return;

    const url = getVideoEmbedUrl(videoUrl);
    
    if (url) {
      // Vérifier si c'est une URL directe de vidéo
      if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')) {
        setIsVideo(true);
        const video = document.createElement('video');
        video.src = url;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.className = 'absolute inset-0 w-full h-full object-cover';
        video.style.zIndex = '0';
        
        video.play().catch(() => {});
        containerRef.current?.appendChild(video);
        videoRef.current = video;
      } else {
        // C'est une URL embed (YouTube)
        setIsVideo(false);
        setEmbedUrl(url);
      }
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.remove();
      }
    };
  }, [videoUrl]);

  if (!videoUrl) return null;

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      {!isVideo && embedUrl && (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          style={{
            transform: 'scale(1.5)',
            transformOrigin: 'center center',
            pointerEvents: 'none',
            border: 'none'
          }}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          frameBorder="0"
        />
      )}
      
      {/* Overlay très léger - presque transparent */}
      <div className="absolute inset-0 bg-black/5 dark:bg-black/10" />
    </div>
  );
}

