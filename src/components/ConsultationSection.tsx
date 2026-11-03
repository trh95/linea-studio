/**
 * Linea Studio - ConsultationSection Component
 * Luxury Eyelash Consultation Hero Section matching reference visual design.
 *
 * ARCHITECTURAL DESIGN:
 * - Completely decoupled Media Layer (HeroMedia) and Vector Wave Layer (HeroWaveDecoration).
 * - Video-ready: accepts 'image' or 'video' without altering the permanent organic wave or gold contours.
 * - Frameless hero melt: zero card wrappers, borders, or shadows around the media.
 * - Deep Blue #001D50, Accent Gold #C6A86A, Warm Background #F8F7F2.
 * - Playfair Display (H1), Alex Brush (Script Subheading), Montserrat (Body/UI).
 */

import React from 'react';
import { Gift, Sparkles, CheckCircle2 } from 'lucide-react';
import { HeroMedia } from './hero/HeroMedia';
import { HeroWaveDecoration } from './hero/HeroWaveDecoration';

export interface ConsultationSectionProps {
  /**
   * Uppercase category eyebrow label.
   */
  eyebrow?: string;
  /**
   * Main serif headline (H1).
   */
  title?: string;
  /**
   * Decorative cursive script accent subtitle.
   */
  subtitle?: string;
  /**
   * Body paragraph explaining the bespoke consultation experience.
   */
  description?: string;
  /**
   * Informational text inside the gold callout box.
   */
  calloutText?: string;
  /**
   * Media type: 'image' or 'video'.
   * Allows the hero to display photos or play arbitrary local/remote videos seamlessly.
   */
  mediaType?: 'image' | 'video';
  /**
   * Media asset URL (photo or video .mp4).
   */
  mediaSrc?: string;
  /**
   * Optional preview poster image if mediaType is 'video'.
   */
  videoPoster?: string;
  /**
   * Stylist at work image URL.
   * Can be replaced with your own uploaded picture (e.g. '/assets/aistudio/sajat_munka_keped.jpg').
   * Defaults to Lintinger Kata's studio photo '/assets/aistudio/kata.jpg'.
   */
  stylistWorkImage?: string;
  /**
   * Stylist full name. Defaults to 'Lintinger Kata'.
   */
  stylistName?: string;
  /**
   * Stylist title or role. Defaults to 'Szempilla-stylist & szalontulajdonos'.
   */
  stylistRole?: string;
  /**
   * Short caption describing the personal consultation and styling work.
   */
  stylistWorkCaption?: string;
  /**
   * Callback fired when clicking the primary consultation action button.
   */
  onConsultationClick?: () => void;
  /**
   * Additional custom CSS classes.
   */
  className?: string;
}

export const ConsultationSection: React.FC<ConsultationSectionProps> = ({
  eyebrow = 'MŰSZEMPILLA KONZULTÁCIÓ',
  title = 'Nem tudod, milyen szempilla illik hozzád?',
  subtitle = 'Beszéljük át együtt. ♡',
  description = 'Nem kell előre tudnod, hogy milyen szettet szeretnél. A konzultáció során elmondhatod, milyen hatást képzeltél el, megmutathatod az inspirációidat, én pedig szakmai szemmel segítek megtalálni azt a megoldást, ami a szemformádhoz, természetes pilláidhoz és a stílusodhoz is illik.',
  calloutText = 'A konzultáció ingyenes, és semmilyen foglalási kötelezettséggel nem jár.',
  mediaType = 'video',
  mediaSrc = '/assets/aistudio/szem.mp4',
  videoPoster = '/assets/aistudio/hero_media_eyelash_pristine.jpg',
  // ITT TUDOD KICSERÉLNI A SAJÁT KÉPEDRE:
  stylistWorkImage = '/assets/aistudio/kata.jpg',
  stylistName = 'Lintinger Kata',
  stylistRole = 'Szempilla-stylist & szalontulajdonos',
  stylistWorkCaption = 'Személyes figyelem, precíz szálankénti technika és prémium alapanyagok minden egyes vendégemnek.',
  onConsultationClick,
  className = '',
}) => {
  return (
    <section
      className={`relative w-full overflow-hidden bg-warm-bg transition-colors ${className}`}
      aria-label="Műszempilla Konzultáció Hero"
    >
      {/* Decorative ambient background curves & gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft atmospheric gradient glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-accent-gold/12 to-transparent blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-gradient-to-tl from-primary-dark/5 to-transparent blur-2xl" />

        {/* Subtle background ambient wave guide */}
        <svg
          className="absolute top-0 right-1/3 w-[500px] h-full opacity-15 hidden lg:block"
          viewBox="0 0 500 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 150,0 C 280,240 40,460 220,800"
            stroke="var(--color-accent-gold)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-8 sm:pb-10 lg:pt-3 lg:pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center lg:items-start">
          
          {/* =========================================================
              LEFT COLUMN: Consultation Messaging & Actions (7 cols)
              Seamlessly integrates into the warm ivory hero canvas
             ========================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6 text-left pt-2 lg:pt-6">
            
            {/* Eyebrow / Category with subtle inline gold divider line */}
            <div className="flex items-center gap-3">
              <span className="uppercase text-xs lg:text-sm tracking-[0.25em] font-semibold text-accent-gold font-sans">
                {eyebrow}
              </span>
              <span className="w-14 sm:w-20 h-px bg-accent-gold/60" />
            </div>

            {/* Main Headline & Handwritten Subtitle */}
            <div className="space-y-1 sm:space-y-1.5">
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-[46px] font-bold leading-[1.2] text-primary-dark tracking-tight">
                {title}
              </h1>
              <span className="font-script text-2xl sm:text-4xl lg:text-[45px] font-normal text-accent-gold block pt-0.5 sm:pt-1">
                {subtitle}
              </span>
            </div>

            {/* Body Description */}
            <p className="font-sans text-primary-dark/85 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-xl font-normal">
              {description}
            </p>

            {/* Luxury Informational Callout Box matching reference */}
            <div className="border border-accent-gold/50 bg-warm-surface/70 backdrop-blur-xs rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex items-center gap-3.5 sm:gap-5 shadow-xs max-w-xl transition-all hover:bg-warm-surface/90">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent-gold/15 border border-accent-gold/35 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-accent-gold" strokeWidth={1.75} />
              </div>
              <p className="text-xs sm:text-sm md:text-base font-medium text-primary-dark leading-snug">
                {calloutText}
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-xl">
              {onConsultationClick && (
                <button
                  type="button"
                  onClick={onConsultationClick}
                  className="relative overflow-hidden group flex items-center justify-center gap-3 w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-widest text-[#001D50] bg-gradient-to-r from-[#C6A86A] via-[#DFC285] to-[#C6A86A] hover:from-[#DFC285] hover:to-[#C6A86A] border border-white/50 rounded-full shadow-[0_4px_22px_rgba(198,168,106,0.4)] hover:shadow-[0_6px_28px_rgba(198,168,106,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-transform before:duration-700"
                >
                  <Sparkles className="w-4 h-4 text-[#001D50] group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10">Ingyenes Konzultáció Kérése</span>
                </button>
              )}
            </div>

          </div>

          {/* =========================================================
              RIGHT COLUMN: Frameless Layered Organic Wave & Media (5 cols)
              - Reusable media container (HeroMedia): photo or video
              - Permanent independent vector wave & gold contour overlay (HeroWaveDecoration)
              - NO CARD WRAPPERS, NO BOX SHADOWS, NO ARTIFICIAL BORDERS
             ========================================================= */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[680px] max-w-lg lg:max-w-none overflow-hidden">
              
              {/* 1. Underlying Media Layer (image or video) */}
              <HeroMedia
                type={mediaType}
                src={mediaSrc}
                poster={videoPoster}
                alt="Linea Studio Műszempilla és Tekintet Styling"
                objectPosition="center 30%"
              />

              {/* 2. Permanent Independent Vector Wave Decoration & Gold Contours */}
              {/* Inherits var(--color-warm-bg) and var(--color-accent-gold) directly from index.css */}
              <HeroWaveDecoration />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
