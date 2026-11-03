/**
 * Linea Studio - Detailed Service View
 * Implements the exact requirements from PDF Page 4:
 * - Image slider with navigation arrows
 * - General description & duration
 * - Who it is recommended for
 * - Service duration & durability
 * - How to aftercare
 * - Transparent prices
 * - CTA to Free Consultation
 */

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Sparkles,
  ShieldCheck,
  Heart,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { ServiceDetailItem } from '../types';
import { ConsultationButton } from './ConsultationButton';

interface ServiceDetailProps {
  service: ServiceDetailItem;
  onBack: () => void;
  onStartIntake: () => void;
  onSelectOtherService: (serviceId: string) => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({
  service,
  onBack,
  onStartIntake,
  onSelectOtherService,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? service.galleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) =>
      prev === service.galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12 animate-fade-in">
      {/* Top back & breadcrumb link */}
      <div className="flex items-center justify-between border-b border-[#E8E5DD] pb-3 sm:pb-4 gap-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-xs uppercase tracking-wider font-semibold text-[#001D50] hover:text-[#C6A86A] transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Vissza a Főoldalra</span>
        </button>

        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#C6A86A] font-medium font-sans truncate">
          Linea Studio Szolgáltatások
        </span>
      </div>

      {/* Main Grid: Gallery Slider + Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
        {/* Gallery Slider (Col 7) */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          <div className="relative aspect-4/3 bg-neutral-100 rounded-sm overflow-hidden border border-[#E8E5DD] shadow-sm group">
            <img
              src={service.galleryImages[activeImageIndex]}
              alt={`${service.name} fotó ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Slider navigation arrows */}
            {service.galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-[#001D50]/80 hover:bg-[#001D50] text-[#C6A86A] rounded-full flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 cursor-pointer shadow-md"
                  aria-label="Előző kép"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-[#001D50]/80 hover:bg-[#001D50] text-[#C6A86A] rounded-full flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 cursor-pointer shadow-md"
                  aria-label="Következő kép"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}

            {/* Photo Counter Badge */}
            <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-[#001D50]/85 text-white text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xs">
              {activeImageIndex + 1} / {service.galleryImages.length} fotó
            </div>
          </div>

          {/* Thumbnail strip */}
          {service.galleryImages.length > 1 && (
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {service.galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-12 sm:w-20 sm:h-16 rounded-xs overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#C6A86A] ring-2 ring-[#C6A86A]/40 scale-102'
                      : 'border-[#E8E5DD] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Overview & Highlights (Col 5) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C6A86A]/15 text-[#001D50] text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold rounded-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A86A]" />
            <span>{service.shortTag}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#001D50] leading-tight">
            {service.name}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#001D50]/80 font-sans leading-relaxed">
            {service.headline}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-[#E8E5DD]">
            <div className="bg-white border border-[#E8E5DD] p-3.5 sm:p-4 rounded-xs">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                Kezelés Időtartama
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-[#001D50] text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-[#C6A86A]" />
                <span>{service.duration}</span>
              </div>
            </div>

            <div className="bg-white border border-[#E8E5DD] p-3.5 sm:p-4 rounded-xs">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                Várható Tartósság
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-[#001D50] text-xs sm:text-sm">
                <Calendar className="w-4 h-4 text-[#C6A86A]" />
                <span>{service.durability}</span>
              </div>
            </div>
          </div>

          {/* Direct CTA Button */}
          <div className="pt-2">
            <button
              onClick={onStartIntake}
              className="flex items-center justify-center gap-3 w-full py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-widest text-[#001D50] bg-[#C6A86A] hover:bg-[#A98A4D] hover:text-white rounded-xs shadow-md transition-all cursor-pointer"
            >
              <span>Nem tudod ez illik-e hozzád?</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Deep Dive Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-2 sm:pt-4">
        {/* Description & Process */}
        <div className="bg-white border border-[#E8E5DD] p-4 sm:p-6 md:p-8 rounded-sm shadow-2xs space-y-4 sm:space-y-6">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#001D50]">
            Általános leírás a szolgáltatás menetéről
          </h3>
          <p className="text-xs md:text-sm text-[#001D50]/80 leading-relaxed font-sans">
            {service.generalDescription}
          </p>

          <div className="border-t border-[#E8E5DD] pt-4">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#001D50] mb-3">
              A kezelés menete lépésről lépésre:
            </h4>
            <div className="space-y-2.5">
              {service.processSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs text-[#001D50]/80 font-sans">
                  <span className="w-5 h-5 rounded-full bg-[#001D50] text-[#C6A86A] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Who it is for & Aftercare */}
        <div className="bg-white border border-[#E8E5DD] p-4 sm:p-6 md:p-8 rounded-sm shadow-2xs space-y-4 sm:space-y-6">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#001D50] mb-3">
              Kinek ajánlom ezt a kezelést?
            </h3>
            <div className="space-y-2">
              {service.recommendedFor.map((rec, rIdx) => (
                <div key={rIdx} className="flex items-start gap-2 text-xs text-[#001D50]/80 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A86A] shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E8E5DD] pt-4 sm:pt-6">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#C6A86A]" />
              <h4 className="font-serif text-sm sm:text-base font-bold text-[#001D50]">
                Hogyan kell utóápolni otthon?
              </h4>
            </div>
            <div className="space-y-2 text-xs text-[#001D50]/80 font-sans">
              {service.aftercare.map((care, cIdx) => (
                <div key={cIdx} className="flex items-start gap-2">
                  <span className="text-[#C6A86A] font-bold">›</span>
                  <span className="leading-relaxed">{care}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Table Section */}
      <div className="bg-white border border-[#E8E5DD] p-4 sm:p-6 md:p-8 rounded-sm shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#C6A86A] font-semibold">
              Átlátható árak
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#001D50] mt-0.5 sm:mt-1">
              {service.name} Árlista
            </h3>
          </div>
          <span className="text-[11px] sm:text-xs text-[#001D50]/60 font-sans">
            Minden ár tartalmazza a prémium alapanyagokat és a díjmentes konzultációt.
          </span>
        </div>

        <div className="divide-y divide-[#E8E5DD]">
          {service.prices.map((pr, pIdx) => (
            <div key={pIdx} className="py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-[#001D50] block">
                  {pr.name}
                </span>
                {pr.note && (
                  <span className="text-[10px] sm:text-[11px] text-neutral-400 font-sans">{pr.note}</span>
                )}
              </div>
              <span className="font-serif text-sm sm:text-base md:text-lg font-bold text-[#001D50] shrink-0">
                {pr.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-[#001D50] text-white p-5 sm:p-8 md:p-12 rounded-sm text-center space-y-3 sm:space-y-4 shadow-lg">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C6A86A] font-semibold">
          Kérdésed maradt?
        </span>
        <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold leading-snug">
          Nem tudod pontosan, melyik szolgáltatás lenne a legjobb a tekintetednek?
        </h3>
        <p className="text-xs md:text-sm text-white/80 max-w-xl mx-auto font-sans leading-relaxed">
          Töltsd ki az ingyenes 8-kérdéses konzultációs kérdőívet, és készítek számodra egy személyre szabott styling javaslatot!
        </p>
        <div className="pt-2 flex justify-center">
          <ConsultationButton
            onClick={onStartIntake}
            label="Kérem az Ingyenes Konzultációt"
            size="standard"
          />
        </div>
      </div>
    </div>
  );
};
