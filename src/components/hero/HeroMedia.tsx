/**
 * Linea Studio - HeroMedia Component
 * Dedicated media container for the Hero section.
 * Supports seamlessly toggling between high-resolution photography and video
 * while remaining completely decoupled from organic vector wave decorations.
 */

import React from 'react';

export interface HeroMediaProps {
  /**
   * The type of media to display: 'image' or 'video'.
   * Defaults to 'image'.
   */
  type?: 'image' | 'video';
  /**
   * Media source URL (e.g. video .mp4 or photo .jpg/.webp).
   */
  src: string;
  /**
   * Optional video poster preview image when type === 'video'.
   */
  poster?: string;
  /**
   * Alternative text for accessibility.
   */
  alt?: string;
  /**
   * CSS object-position for fine-tuning media focal point.
   */
  objectPosition?: string;
  /**
   * Additional custom CSS classes.
   */
  className?: string;
  /**
   * Background tone to blend into. Defaults to 'var(--color-warm-bg)'.
   */
  blendColor?: string;
}

export const HeroMedia: React.FC<HeroMediaProps> = ({
  type = 'image',
  src,
  poster,
  alt = 'Linea Studio Műszempilla és Tekintet Styling',
  objectPosition = 'center 35%',
  className = '',
  blendColor = 'var(--color-warm-bg)',
}) => {
  // CSS mask for organic edge feathering - completely dissolves media into #F8F7F2 before reaching any border
  const edgeMaskStyle: React.CSSProperties = {
    WebkitMaskImage:
      'radial-gradient(ellipse 86% 80% at 50% 50%, black 40%, rgba(0, 0, 0, 0.85) 62%, rgba(0, 0, 0, 0.25) 78%, transparent 92%)',
    maskImage:
      'radial-gradient(ellipse 86% 80% at 50% 50%, black 40%, rgba(0, 0, 0, 0.85) 62%, rgba(0, 0, 0, 0.25) 78%, transparent 92%)',
  };

  return (
    <div
      className={`relative w-full h-full min-h-[420px] sm:min-h-[500px] lg:min-h-[620px] overflow-hidden bg-warm-bg ${className}`}
    >
      {/* 1. Underlying Media (Image or Video) with organic radial edge feathering */}
      {type === 'video' ? (
        <video
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover select-none pointer-events-none transition-all duration-700"
          style={{ objectPosition }}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover select-none pointer-events-none transition-all duration-700"
          style={{ objectPosition }}
        />
      )}

      {/* =========================================================
          2. SEAMLESS EDGE FADE OVERLAYS (#F8F7F2)
          Clean, unified gradient fades matching section background 100%
         ========================================================= */}
      
      {/* Top Edge Soft Mist Fade */}
      
    </div>
  );
};

