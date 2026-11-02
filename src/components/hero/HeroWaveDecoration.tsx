/**
 * Linea Studio - HeroWaveDecoration Component
 * Permanent independent vector wave decoration and gold contour lines for the Hero section.
 *
 * CRITICAL ARCHITECTURE:
 * - Completely independent of whether an image or video is playing underneath in HeroMedia.
 * - Carves an organic S-curve boundary matching the reference image.
 * - Fills the left portion with the page background tone (#F8F7F2) to dissolve seamlessly into the hero text.
 * - Draws delicate champagne-gold (#C6A86A) and secondary accent contour paths.
 * - Houses the luxury circular gold LS monogram emblem at the bottom right.
 */

import React from 'react';

export interface HeroWaveDecorationProps {
  /**
   * Optional background tone matching the hero container.
   * Defaults to 'var(--color-warm-bg)'.
   */
  backgroundColor?: string;
  /**
   * Primary gold accent color for contour lines.
   * Defaults to 'var(--color-accent-gold)'.
   */
  goldAccentColor?: string;
  /**
   * Additional custom CSS classes.
   */
  className?: string;
}

export const HeroWaveDecoration: React.FC<HeroWaveDecorationProps> = ({
  backgroundColor = 'var(--color-warm-bg)',
  goldAccentColor = 'var(--color-accent-gold)',
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-10 ${className}`}
      aria-hidden="true"
    >
      {/* =========================================================
          1. VECTOR WAVE OVERLAY (SVG Coordinate Space: 1000 x 1200)
          Seamlessly blends the left media boundary into the hero background
         ========================================================= */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 1200"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle champagne gold gradient for contour strokes - softly fades in at top edge */}
          <linearGradient id="champagneGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-gold-light)" stopOpacity="0" />
            <stop offset="6%" stopColor="var(--color-accent-gold-light)" stopOpacity="0.85" />
            <stop offset="35%" stopColor={goldAccentColor} stopOpacity="1" />
            <stop offset="70%" stopColor="var(--color-accent-gold-dark)" stopOpacity="0.9" />
            <stop offset="94%" stopColor="var(--color-accent-gold-light)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--color-accent-gold-light)" stopOpacity="0" />
          </linearGradient>

          {/* Secondary wave softer gradient */}
          <linearGradient id="secondaryGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={goldAccentColor} stopOpacity="0" />
            <stop offset="8%" stopColor={goldAccentColor} stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--color-accent-gold-light)" stopOpacity="0.55" />
            <stop offset="92%" stopColor={goldAccentColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={goldAccentColor} stopOpacity="0" />
          </linearGradient>

          {/* Right-side organic smoke & silk drape gradient - wider, softer transition */}
        <linearGradient id="rightSmokeSilkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-warm-bg)" stopOpacity="0" />
          <stop offset="20%" stopColor="var(--color-warm-bg)" stopOpacity="0.3" />
          <stop offset="60%" stopColor="var(--color-warm-bg)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--color-warm-bg)" stopOpacity="1" />
        </linearGradient>

          {/* Sheer silk mist accent gradient - matches section background #F8F7F2 with subtle gold highlight */}
          <linearGradient id="sheerMistGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-warm-bg)" stopOpacity="0.85" />
            <stop offset="50%" stopColor="var(--color-warm-bg)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-accent-gold-light)" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* -----------------------------------------------------
            A. LEFT PRIMARY BACKGROUND WAVE FILL
            Covers the left section of the media with #F8F7F2
            so it seamlessly melts into the hero background.
            Path traces the organic S-curve boundary from top to bottom.
           ----------------------------------------------------- */}
        <path
          d="
            M 0,0
            L 210,0
            C 215,160 330,240 335,360
            C 340,480 155,560 145,710
            C 135,850 310,950 345,1080
            C 360,1130 380,1170 410,1200
            L 0,1200
            Z
          "
          fill={backgroundColor}
        />

        {/* -----------------------------------------------------
            B. LEFT SECONDARY SUBTLE ACCENT WAVE (Layered Depth)
            A delicate offset wave creating the multi-layered organic
            flow requested in the design specification.
           ----------------------------------------------------- */}
        <path
          d="
            M 245,0
            C 250,175 365,255 370,375
            C 375,495 190,580 180,730
            C 170,870 345,970 380,1100
            C 395,1150 415,1185 445,1200
          "
          stroke="url(#secondaryGoldGrad)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 6"
        />

        {/* -----------------------------------------------------
            C. LEFT PRIMARY CHAMPAGNE-GOLD CONTOUR OUTLINE
            Crisp, elegant vector stroke running precisely along the
            organic wave boundary, matching the visual reference.
           ----------------------------------------------------- */}
        <path
          d="
            M 210,0
            C 215,160 330,240 335,360
            C 340,480 155,560 145,710
            C 135,850 310,950 345,1080
            C 360,1130 380,1170 410,1200
          "
          stroke="url(#champagneGoldGrad)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* -----------------------------------------------------
            D. RIGHT ORGANIC SMOKE / SILK DRAPE WAVE
            Pushed to the far right edge so the eye and eyelash extensions
            remain completely clear and visible.
           ----------------------------------------------------- */}
        <path
          d="
            M 1000,0
            L 965,0
            C 940,140 910,270 925,420
            C 940,570 900,730 875,890
            C 855,1020 885,1120 920,1200
            L 1000,1200
            Z
          "
          fill="url(#rightSmokeSilkGrad)"
        />

        {/* -----------------------------------------------------
            E. RIGHT PRIMARY CHAMPAGNE-GOLD CONTOUR OUTLINE
            Delicate flowing gold stroke along the shifted right boundary.
           ----------------------------------------------------- */}
        <path
          d="
            M 965,0
            C 940,140 910,270 925,420
            C 940,570 900,730 875,890
            C 855,1020 885,1120 920,1200
          "
          stroke="url(#champagneGoldGrad)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* -----------------------------------------------------
            F. RIGHT SECONDARY SUBTLE ACCENT WAVE
            Secondary offset wave on the right side for multi-layer silk depth.
           ----------------------------------------------------- */}
        <path
          d="
            M 935,0
            C 910,140 880,270 895,420
            C 910,570 870,730 845,890
            C 825,1020 855,1120 890,1200
          "
          stroke="url(#secondaryGoldGrad)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="6 4"
          opacity="0.5"
        />
      </svg>

      {/* =========================================================
          2. SEAMLESS EDGE FADE OVERLAYS (#F8F7F2)
          Ultra-smooth wide gradients for seamless background melting
         ========================================================= */}
      
      {/* Top Edge Soft Mist Fade */}
      <div
        className="absolute top-0 inset-x-0 h-28 sm:h-36 bg-gradient-to-b from-warm-bg via-warm-bg/85 to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />

      
    {/* Right Edge: seamless fade into #f8f7f2 */}
    <div
      className="absolute inset-y-0 right-0 w-24 sm:w-36 lg:w-48 pointer-events-none z-10"
      style={{
      background:
        'linear-gradient(to left, #f8f7f2 0%, rgba(248,247,242,0.94) 20%, rgba(248,247,242,0.65) 48%, rgba(248,247,242,0.22) 72%, transparent 100%)',
     }}
      aria-hidden="true"
    />


      
{/* Bottom Edge: seamless fade into #f8f7f2 */}
<div
  className="absolute bottom-0 inset-x-0 h-32 sm:h-44 lg:h-56 pointer-events-none z-10"
  style={{
    background:
      'linear-gradient(to top, #f8f7f2 0%, rgba(248,247,242,0.96) 18%, rgba(248,247,242,0.72) 42%, rgba(248,247,242,0.30) 70%, transparent 100%)',
  }}
  aria-hidden="true"
/>


      {/* =========================================================
          3. REFINED CIRCULAR GOLD MONOGRAM (Bottom-Right Corner)
          Permanent branding seal matching reference position.
         ========================================================= */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 pointer-events-none">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-accent-gold/60 bg-warm-bg/40 backdrop-blur-xs flex items-center justify-center p-2.5 shadow-[0_4px_16px_#F8F7F2] transition-transform hover:scale-105">
          {/* Subtle concentric inner gold ring */}
          <div className="absolute inset-1 rounded-full border border-accent-gold/25 pointer-events-none" />
          
          {/* Official Linea Studio Monogram */}
          <img
            src="/assets/aistudio/logo_713cd271.png"
            alt="Linea Studio Monogram Emblem"
            className="w-full h-full object-contain filter opacity-90"
          />
        </div>
      </div>
    </div>
  );
};

