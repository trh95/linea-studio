/**
 * Linea Studio - Public Landing Page
 * Faithfully implements the exact 9-step structure from PDF Page 2 & 3:
 * 1. HERO (Nem tudod milyen szempilla illik hozzád? Én igen! + Pécs)
 * 2. "Nálam a személyre szabás alap" (3 pont)
 * 3. SZOLGÁLTATÁSOK (Nagy képes blokkok + CTA)
 * 4. REFERENCIÁK (Válogatott képek + Több munkám Instagram)
 * 5. GOOGLE VÉLEMÉNYEK ("Nem csak én mondom" + 5 csillag + Google gomb)
 * 6. A LINEA STUDIO ÉLMÉNY & SZALONBÁR (kávé, tea, üdítő, növényi tej)
 * 7. RÓLAM (Rövid 2-4 mondat, nem önéletrajz)
 * 8. PÉCSI SZALON (Pécs, Budai Nagy Antal utca 1. + Térkép + Hogyan találsz ide?)
 * 9. ZÁRÓ CTA (Kérj ingyenes konzultációt)
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Clock,
  Shield,
  Star,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Coffee,
  Instagram,
  ArrowRight,
  Calendar,
  ExternalLink,
  Navigation,
  Gift
} from 'lucide-react';
import { PortfolioItem } from '../types';
import {
  DETAILED_SERVICES,
  GOOGLE_REVIEWS,
  GOOGLE_REVIEWS_URL,
  SALON_BAR_ITEMS
} from '../data/mockData';
import { ConsultationSection } from './ConsultationSection';

interface PublicLandingProps {
  portfolio: PortfolioItem[];
  onStartIntake: () => void;
  onSelectService: (serviceId: string) => void;
  onNavigatePage: (page: string) => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({
  portfolio,
  onStartIntake,
  onSelectService,
  onNavigatePage,
}) => {
  const [showAszfModal, setShowAszfModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [reviewStartIndex, setReviewStartIndex] = useState(0);

  const maxReviewIndex = Math.max(0, GOOGLE_REVIEWS.length - 3);
  const visibleReviews = GOOGLE_REVIEWS.slice(reviewStartIndex, reviewStartIndex + 3);

  return (
    <div className="space-y-12 sm:space-y-20 lg:space-y-24 pb-14 sm:pb-20">
      {/* ==========================================
          1. HERO / CONSULTATION SZEKCIÓ (LUXURY BEAUTY DESIGN)
         ========================================== */}
      <ConsultationSection onConsultationClick={onStartIntake} />

      {/* ==========================================
          2. "NÁLAM A SZEMÉLYRE SZABÁS ALAP" (PDF Page 3)
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E8E5DD] p-5 sm:p-8 md:p-12 rounded-sm shadow-sm text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A86A] font-semibold">
            Nem sablon szettek
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#001D50] mt-2 mb-3 sm:mb-4">
            Nálam a személyre szabás alap
          </h2>
          <div className="w-12 h-0.5 bg-[#C6A86A] mx-auto mb-5 sm:mb-6" />
          <p className="text-xs md:text-sm text-[#001D50]/75 font-sans max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Nálad nem a vendég választ egy véletlenszerű szettet egy katalógusból. Minden tekintet egyedi, ezért a styling három alappillérre épül:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
            <div className="p-4 sm:p-6 bg-warm-bg border border-[#E8E5DD] rounded-xs space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#001D50] text-[#C6A86A] text-xs font-bold flex items-center justify-center font-mono">
                1
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#001D50]">
                Szemformádhoz igazítva
              </h3>
              <p className="text-xs text-[#001D50]/70 font-sans leading-relaxed">
                Mandula, kerek, mélyen ülő vagy rejtett szemhéj? A megfelelő ívekkel és hosszúságokkal optikailag nyitjuk és emeljük a tekintetet.
              </p>
            </div>

            <div className="p-4 sm:p-6 bg-warm-bg border border-[#E8E5DD] rounded-xs space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#001D50] text-[#C6A86A] text-xs font-bold flex items-center justify-center font-mono">
                2
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#001D50]">
                Stílusodhoz igazítva
              </h3>
              <p className="text-xs text-[#001D50]/70 font-sans leading-relaxed">
                Természetes, visszafogott elegancia vagy merészebb, karakteres volumen? A mindennapi öltözködésedhez és sminkelési rutinodhoz illeszkedünk.
              </p>
            </div>

            <div className="p-4 sm:p-6 bg-warm-bg border border-[#E8E5DD] rounded-xs space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#001D50] text-[#C6A86A] text-xs font-bold flex items-center justify-center font-mono">
                3
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#001D50]">
                Természetes adottságaidhoz
              </h3>
              <p className="text-xs text-[#001D50]/70 font-sans leading-relaxed">
                Csak annyira terheljük a saját szempilláidat, amit hosszú távon is egészségesen, károsodás nélkül elbírnak. Az egészség az első.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. SZOLGÁLTATÁSOK - NAGY KÉPES BLOKKOK (PDF Page 3 & 4)
         ========================================== */}
      <section id="szolgaltatasok" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A86A] font-semibold">
            Szempillától a szemöldökig
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#001D50] mt-2 mb-2 sm:mb-3">
            Szolgáltatásaink
          </h2>
          <p className="text-xs md:text-sm text-[#001D50]/70 font-sans">
            Kattints bármelyik szolgáltatásra a képek, időtartam, árak és utóápolási részletek megtekintéséhez.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {DETAILED_SERVICES.map((srv) => (
            <div
              key={srv.id}
              onClick={() => onSelectService(srv.id)}
              className="bg-white border border-[#E8E5DD] hover:border-[#C6A86A] rounded-sm overflow-hidden shadow-2xs group cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/9 overflow-hidden relative bg-neutral-100">
                  <img
                    src={srv.heroImage}
                    alt={srv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#001D50]/90 text-[#C6A86A] text-[10px] uppercase font-bold px-2.5 py-1 rounded-xs tracking-wider">
                    {srv.shortTag}
                  </div>
                </div>

                <div className="p-4 sm:p-6 md:p-8 space-y-2.5 sm:space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                    <span className="flex items-center gap-1 text-[#001D50]/70 font-sans font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#C6A86A]" />
                      {srv.duration}
                    </span>
                    <span>{srv.durability}</span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#001D50] group-hover:text-[#0A275C]">
                    {srv.name}
                  </h3>
                  <p className="text-xs md:text-sm text-[#001D50]/75 line-clamp-3 font-sans leading-relaxed">
                    {srv.generalDescription}
                  </p>
                </div>
              </div>

              <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 pt-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border-t border-[#E8E5DD]">
                <span className="text-xs font-bold text-[#001D50] uppercase tracking-wider group-hover:text-[#C6A86A] transition-colors flex items-center gap-1.5">
                  <span>Részletek & Képgaléria</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="font-serif text-xs sm:text-sm font-bold text-[#001D50]">
                  Kezdőár: {srv.prices[0]?.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA banner a szolgáltatások után (PDF Spec) */}
        <div className="mt-8 sm:mt-12 p-5 sm:p-8 bg-warm-bg border border-[#C6A86A]/40 rounded-sm text-center flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="text-left space-y-1">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-[#001D50]">
              Nem tudod, melyiket válaszd?
            </h4>
            <p className="text-xs text-[#001D50]/70 font-sans">
              Segítünk megtalálni a számodra tökéletes megoldást az ingyenes tesztünkkel.
            </p>
          </div>
          <button
            onClick={onStartIntake}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-[#001D50] bg-[#C6A86A] hover:bg-[#A98A4D] hover:text-white rounded-xs transition-colors shrink-0 shadow-sm cursor-pointer"
          >
            <span>Ingyenes Konzultáció</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ==========================================
          4. REFERENCIÁK (Válogatott minőség + Instagram)
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C6A86A] font-semibold">
              Kizárólag saját munkák
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#001D50] mt-1">
              Referenciák & Válogatás
            </h2>
          </div>

          <a
            href="https://www.instagram.com/lintingerkata_beautyartist/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#001D50] bg-white border border-[#E8E5DD] hover:border-[#001D50] transition-colors rounded-xs shadow-2xs"
          >
            <Instagram className="w-4 h-4 text-[#C6A86A]" />
            <span>Több munkám → Instagram</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {portfolio.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-[#E8E5DD] rounded-xs overflow-hidden shadow-2xs relative aspect-square"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001D50]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs font-serif font-bold text-white">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          5. GOOGLE VÉLEMÉNYEK (PDF Page 3 Spec)
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A86A] font-semibold">
            Nem csak én mondom
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#001D50] mt-2 mb-2 sm:mb-3">
            Valódi Google Vélemények
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-current" />
            ))}
            <span className="text-xs font-bold text-[#001D50] ml-2 font-mono">
              5.0 / 5.0 Kiváló Értékelés
            </span>
          </div>
        </div>

        {/* Reviews 3-column Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-all duration-300">
            {visibleReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-[#E8E5DD] p-4 sm:p-6 rounded-sm shadow-2xs flex flex-col justify-between space-y-4 hover:border-accent-gold/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-sans">
                      {rev.relativeTime}
                    </span>
                  </div>

                  <p className="text-xs text-[#001D50]/80 font-sans leading-relaxed italic">
                    „{rev.text}”
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E5DD]">
                  <strong className="text-xs font-serif text-[#001D50] block">
                    {rev.authorName}
                  </strong>
                  {rev.serviceMentioned && (
                    <span className="text-[11px] text-[#C6A86A] font-sans">
                      {rev.serviceMentioned}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation controls if reviews exceed 3 */}
          {GOOGLE_REVIEWS.length > 3 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => setReviewStartIndex((prev) => (prev > 0 ? prev - 1 : maxReviewIndex))}
                aria-label="Előző vélemények"
                className="w-8 h-8 rounded-full border border-[#E8E5DD] bg-white hover:border-[#001D50] hover:bg-warm-bg flex items-center justify-center text-[#001D50] transition-colors cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1.5">
                {Array.from({ length: maxReviewIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReviewStartIndex(idx)}
                    aria-label={`${idx + 1}. vélemény csoport`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      reviewStartIndex === idx
                        ? 'w-6 bg-[#C6A86A]'
                        : 'w-2 bg-[#E8E5DD] hover:bg-[#C6A86A]/50'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setReviewStartIndex((prev) => (prev < maxReviewIndex ? prev + 1 : 0))}
                aria-label="Következő vélemények"
                className="w-8 h-8 rounded-full border border-[#E8E5DD] bg-white hover:border-[#001D50] hover:bg-warm-bg flex items-center justify-center text-[#001D50] transition-colors cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 sm:px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#001D50] bg-white border border-[#E8E5DD] hover:border-[#001D50] hover:bg-warm-bg transition-all rounded-xs shadow-2xs text-center"
          >
            <span>Minden vélemény megtekintése a Google-on (5.0 ★)</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C6A86A]" />
          </a>
        </div>
      </section>

      {/* ==========================================
          6. A LINEA STUDIO ÉLMÉNY & SZALONBÁR (PDF Page 3)
          ========================================== */}
      <section className="bg-white border-y border-[#E8E5DD] py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C6A86A] font-semibold">
              Nem csak szempillát építek — nálam kikapcsolsz
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-[#001D50] leading-tight">
              Egy óra, ami csak rólad szól.
            </h2>
            <p className="text-xs md:text-sm text-[#001D50]/80 font-sans leading-relaxed">
              A Linea Studio nem csupán egy hely, ahol elkészül a szetted. Egy nyugodt, igényes és halk környezetet alakítottam ki Pécsen, ahol a szépülés mellett a valódi pihenésre és kikapcsolódásra is jut idő.
            </p>

            {/* Szalonbár kiemelése */}
            <div className="bg-warm-bg border border-[#E8E5DD] p-4 sm:p-6 rounded-sm space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[#C6A86A]" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#001D50]">
                  Mindig teli készletes Szalonbár
                </h3>
              </div>
              <p className="text-xs text-[#001D50]/75 font-sans leading-relaxed">
                Vendégeinket ingyenes frissítőkkel várjuk a megérkezéskor és a kezelés előtt:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs text-[#001D50]/85 font-sans">
                {SALON_BAR_ITEMS.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#C6A86A] font-bold">✓</span>
                    <div>
                      <strong className="block text-[#001D50]">{item.name}</strong>
                      <span className="text-[10px] text-neutral-500">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-4/3 rounded-sm overflow-hidden border border-[#E8E5DD] shadow-lg">
              <img
                src="/assets/aistudio/studio3.jpeg"
                alt="Linea Studio Szalon Belső Élmény"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. RÓLAM (Röviden, nem önéletrajz) (PDF Page 3)
         ========================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="md:col-span-4">
            <div className="aspect-square rounded-full overflow-hidden border-2 border-[#C6A86A] max-w-[160px] sm:max-w-[220px] mx-auto shadow-md">
              <img
                src="/assets/aistudio/kata.jpg"
                alt="Lintinger Kata - Linea Studio Szempilla-stylist"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          <div className="md:col-span-8 space-y-3 sm:space-y-4 text-left">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A86A] font-semibold">
              Rólam · A te szempilla-stylistod
            </span>
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#001D50]">
              Lintinger Kata · Alapító & Szempilla-stylist
            </h3>
            <p className="text-xs md:text-sm text-[#001D50]/80 font-sans leading-relaxed">
              Számomra a szempillaépítés és szemöldök styling nem futószalagmunka, hanem finom művészet. A Linea Studio-t 2021-ben azért hoztam létre Pécsen, hogy olyan helyet teremtsek, ahol nincsenek elsietett szettek és sablonos ívek: minden vendégemnek a saját arcához és szemformájához legszebben harmonizáló tekintetet készítem el.
            </p>
            <p className="text-xs text-[#001D50]/80 font-sans leading-relaxed">
              Korszerű UV szempilla-technológiával, orvosi tisztaságú és hipoallergén alapanyagokkal dolgozom, hogy az elkészült szetted nemcsak gyönyörű, de tartós és pehelykönnyű is legyen.
            </p>
            <p className="text-xs text-[#001D50]/70 font-sans italic pt-1">
              Várlak sok szeretettel a stúdióban egy finom kávé vagy meleg tea kíséretében!
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          8. PÉCSI SZALON & TÉRKÉP (PDF Page 3)
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E8E5DD] p-5 sm:p-8 md:p-12 rounded-sm shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C6A86A]">
              <MapPin className="w-4 h-4" />
              <span>Pécs Belváros</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#001D50]">
              Linea Studio Pécs
            </h2>
            <div className="space-y-1 font-sans">
              <div className="text-sm font-semibold text-[#001D50]">
                📍 7624 Pécs, Budai Nagy Antal utca 1.
              </div>
              <div className="text-xs text-[#001D50]/75">
                (Tervezők Háza, 1. emelet 112.)
              </div>
              <div className="text-xs font-medium text-[#C6A86A] pt-1">
                📞 +36 70 576 6902 · Lintinger Kata
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 text-xs text-[#001D50]/80 font-sans leading-relaxed border-t border-[#E8E5DD] pt-4">
              <div>
                <strong className="block text-[#001D50] mb-1 font-serif text-sm">
                  Hogyan találsz ide?
                </strong>
                <p>
                  A stúdió Pécs frekventált, mégis csendes részén található a Tervezők Háza 1. emeletén (112-es ajtó).
                </p>
              </div>

              <div>
                <strong className="block text-[#001D50] mb-1">Parkolás:</strong>
                <p>
                  Az épület előtt és a környező kis utcákban kényelmesen elérhető fizetős városi parkolózóna áll rendelkezésre.
                </p>
              </div>

              <div>
                <strong className="block text-[#001D50] mb-1">Tömegközlekedés:</strong>
                <p>
                  A legközelebbi helyi buszmegálló mindössze 2 perc kellemes sétára van a szalon bejáratától.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href="https://maps.google.com/?q=Pécs+Budai+Nagy+Antal+utca+1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 sm:px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#001D50] hover:bg-[#0A275C] transition-colors rounded-xs shadow-xs text-center"
              >
                <Navigation className="w-4 h-4 text-[#C6A86A]" />
                <span>Útvonaltervezés Térképen</span>
              </a>

              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#001D50] bg-white border border-[#E8E5DD] hover:border-[#001D50] transition-colors rounded-xs shadow-xs text-center"
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Google Profil & Vélemények</span>
              </a>
            </div>
          </div>

          {/* Interactive embedded styled map view */}
          <div className="lg:col-span-6">
            <div className="aspect-4/3 rounded-sm overflow-hidden border border-[#E8E5DD] shadow-md relative bg-neutral-100">
              <iframe
                title="Linea Studio Pécs Google Térkép"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2768.204561287661!2d18.2325!3d46.0745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4742b10a4a5!2zUMOpY3MsIEJ1ZGFpIE5hZ3kgQW50YWwgdS4gMSwgNzYyMg!5e0!3m2!1shu!2shu!4v1700000000000"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          9. ZÁRÓ CTA (PDF Page 3 & 5)
         ========================================== */}
      <section className="bg-[#001D50] text-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A86A] font-semibold">
            Kérdésed van?
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
            Nem tudod, melyik szolgáltatás illik hozzád?
          </h2>
          <p className="text-white/80 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-sans leading-relaxed">
            Kérj ingyenes online konzultációt! A teszt kitöltése után személyre szabott styling javaslattal jelentkezem.
          </p>
          <div className="pt-2 sm:pt-4">
            <button
              onClick={onStartIntake}
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-widest text-[#001D50] bg-[#C6A86A] hover:bg-white transition-all shadow-lg rounded-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ingyenes Konzultáció Kérése</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          LÁBLÉC & JOGI MODÁLOK
         ========================================== */}
      <footer className="border-t border-[#E8E5DD] pt-10 sm:pt-12 px-4 sm:px-6 text-xs text-[#001D50]/70 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/assets/aistudio/logo_713cd271.png"
                alt="Linea Studio"
                className="w-8 h-8 object-contain"
              />
              <div className="flex items-center flex-col">
            <span className="font-serif text-base text-lg tracking-widest font-bold text-[#001D50] uppercase whitespace-nowrap shrink-0">
              Linea Studio
            </span>
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-[#C6A86A] font-medium -mt-1 font-sans">
              Eyelash & Brow
            </span>
          </div>
              
            </div>
            <p className="text-xs text-[#001D50]/70 leading-relaxed">
              Exkluzív szempilla és szemöldök styling szalon Pécs belvárosában. Személyre szabott elegancia és valódi pihenés.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <span className="font-semibold uppercase tracking-wider text-[#001D50] block mb-2">
              Elérhetőség & Cím
            </span>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C6A86A] shrink-0 mt-0.5" />
              <span>7624 Pécs, Budai Nagy Antal utca 1. (Tervezők Háza, 1. em. 112.)</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#C6A86A]" />
              <a href="tel:+36705766902" className="hover:text-[#C6A86A] transition-colors">+36 70 576 6902</a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#C6A86A]" />
              <a href="mailto:lintinger.kata@gmail.com" className="hover:text-[#C6A86A] transition-colors">lintinger.kata@gmail.com</a>
            </div>
            <div className="pt-1">
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-[#C6A86A] hover:underline font-semibold"
              >
                <Star className="w-3 h-3 fill-[#C6A86A]" />
                <span>Google Értékelések (5.0 ★)</span>
              </a>
            </div>
          </div>

          {/* Quick links to new subpages */}
          <div className="space-y-2">
            <span className="font-semibold uppercase tracking-wider text-[#001D50] block mb-2">
              Fontos Tudnivalók
            </span>
            <div>
              <button
                onClick={() => onNavigatePage('first-visit')}
                className="hover:text-[#C6A86A] transition-colors cursor-pointer block text-left"
              >
                Első alkalom útmutató
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigatePage('house-rules')}
                className="hover:text-[#C6A86A] transition-colors cursor-pointer block text-left"
              >
                Szalon Házirend
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigatePage('faq')}
                className="hover:text-[#C6A86A] transition-colors cursor-pointer block text-left"
              >
                Gyakran Ismételt Kérdések (GYIK)
              </button>
            </div>
          </div>

          {/* Legal links */}
          <div className="space-y-2">
            <span className="font-semibold uppercase tracking-wider text-[#001D50] block mb-2">
              Jogi Információk
            </span>
            <div>
              <button
                onClick={() => setShowAszfModal(true)}
                className="hover:text-[#C6A86A] transition-colors cursor-pointer block"
              >
                Általános Szerződési Feltételek (ÁSZF)
              </button>
            </div>
            <div>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-[#C6A86A] transition-colors cursor-pointer block"
              >
                Adatkezelési Tájékoztató (GDPR)
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-[#E8E5DD] py-6 flex items-center justify-center text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} Linea Studio Pécs. Minden jog fenntartva.</p>
        </div>
      </footer>

      {/* ÁSZF Modal */}
      {showAszfModal && (
        <div className="fixed inset-0 z-50 bg-[#001D50]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E5DD] max-w-2xl w-full p-8 rounded-sm shadow-xl max-h-[85vh] overflow-y-auto">
            <h3 className="font-serif text-2xl font-bold text-[#001D50] mb-4">
              Általános Szerződési Feltételek (ÁSZF)
            </h3>
            <div className="text-xs text-[#001D50]/80 space-y-3 font-sans leading-relaxed">
              <p><strong>1. Szolgáltató adatai:</strong> Linea Studio Eyelash Atelier, 7622 Pécs, Budai Nagy Antal utca 1.</p>
              <p><strong>2. Időpontfoglalás és lemondási feltételek:</strong> Időpontot kizárólag előzetes egyeztetés vagy az online kérdőív alapján biztosítunk. Lemondást vagy módosítást díjmentesen az időpont előtt legkésőbb 24 órával fogadunk el.</p>
              <p><strong>3. Higiénia és egészségügyi garancia:</strong> A vendég felelőssége a kérdőívben valós adatokat megadni esetleges szembetegségekről, allergiákról vagy kontaktlencse viselésről. A szalonban kizárólag steril eszközökkel és bevizsgált professzionális ragasztókkal dolgozunk.</p>
              <p><strong>4. Garancia:</strong> Szettjeinkre 48 órás garanciát vállalunk rendeltetésszerű otthoni ápolás mellett.</p>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowAszfModal(false)}
                className="px-6 py-2 bg-[#001D50] text-white text-xs font-semibold rounded-xs"
              >
                Bezárás
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-[#001D50]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E5DD] max-w-2xl w-full p-8 rounded-sm shadow-xl max-h-[85vh] overflow-y-auto">
            <h3 className="font-serif text-2xl font-bold text-[#001D50] mb-4">
              Adatkezelési Tájékoztató (GDPR)
            </h3>
            <div className="text-xs text-[#001D50]/80 space-y-3 font-sans leading-relaxed">
              <p><strong>1. Az adatkezelő:</strong> Linea Studio (info@lineastudio.hu, Pécs).</p>
              <p><strong>2. Kezelt adatok köre:</strong> Név, e-mail cím, telefonszám, konzultációs válaszok és stíluspreferenciák.</p>
              <p><strong>3. Az adatkezelés célja:</strong> Személyre szabott szempilla-építési tanácsadás, időpont-egyeztetés és Google Naptári eseményértesítő küldése.</p>
              <p><strong>4. Adatbiztonság:</strong> A Linea Studio a megadott személyes adatokat harmadik fél részére marketing célból nem adja át, biztonságos PostgreSQL adatbázisban tárolja.</p>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-6 py-2 bg-[#001D50] text-white text-xs font-semibold rounded-xs"
              >
                Bezárás
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
