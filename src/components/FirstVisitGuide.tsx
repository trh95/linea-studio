/**
 * Linea Studio - First Visit Guide ("Első alkalom")
 * Comprehensive onboarding guide for first-time clients.
 */

import React from 'react';
import {
  Sparkles,
  Heart,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coffee,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { ConsultationButton } from './ConsultationButton';

interface FirstVisitGuideProps {
  onStartIntake: () => void;
}

export const FirstVisitGuide: React.FC<FirstVisitGuideProps> = ({ onStartIntake }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-16 animate-fade-in">
      {/* Hero header */}
      <div className="bg-white border border-[#E8E5DD] p-5 sm:p-8 md:p-10 rounded-sm shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="md:col-span-7 space-y-3.5 sm:space-y-4 text-left">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A86A] font-semibold">
            Útmutató Új Vendégeknek
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#001D50] leading-tight">
            Első alkalommal a Linea Studio-ban?
          </h1>
          <div className="w-16 h-0.5 bg-[#C6A86A] my-2 sm:my-3" />
          <p className="text-xs md:text-sm text-[#001D50]/80 font-sans leading-relaxed">
            Teljesen természetes, ha kérdéseid vagy bizonytalanságaid vannak az első szett előtt. 
            Összegyűjtöttünk minden fontos tudnivalót, hogy a nálunk töltött idő valódi élmény és feltöltődés legyen.
          </p>

          <div className="pt-2">
            <ConsultationButton
              onClick={onStartIntake}
              label="Konzultációs Teszt Kitöltése"
              size="standard"
            />
          </div>
        </div>

        {/* Right side image */}
        <div className="md:col-span-5 relative h-52 sm:h-64 md:h-72 rounded-sm overflow-hidden border border-[#E8E5DD] shadow-md group">
          <img
            src="/assets/aistudio/elso.png"
            alt="Első alkalom a Linea Studio-ban"
            className="w-full h-full object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 border border-[#C6A86A]/30 pointer-events-none" />
        </div>
      </div>

      {/* 3 Steps: Before, During, After */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
        {/* Step 1: Előtte */}
        <div className="bg-white border border-[#E8E5DD] p-7 rounded-sm shadow-2xs space-y-4 relative">
          <div className="w-10 h-10 bg-[#001D50] text-[#C6A86A] font-bold rounded-xs flex items-center justify-center font-mono text-sm">
            01
          </div>
          <h3 className="font-serif text-xl font-bold text-[#001D50]">
            Hogyan készülj az érkezésre?
          </h3>
          <ul className="text-xs text-[#001D50]/80 space-y-2.5 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-[#C6A86A] font-bold">›</span>
              <span><strong>Smink nélkül érkezz:</strong> A szemsmink és szempillaspirál maradványai akadályozzák a ragasztó tartós kötését.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C6A86A] font-bold">›</span>
              <span><strong>Kontaktlencse:</strong> Hozz magaddal tartót és folyadékot, a csukott szemmel töltött időre célszerű kivenni.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C6A86A] font-bold">›</span>
              <span><strong>Koffeinfogyasztás:</strong> Az érkezés előtt közvetlenül érdemes elkerülni az erős kávét/energiaitalt a szemhéjremegés megelőzésére.</span>
            </li>
          </ul>
        </div>

        {/* Step 2: Közben */}
        <div className="bg-white border border-[#C6A86A] p-7 rounded-sm shadow-md space-y-4 relative">
          <div className="w-10 h-10 bg-[#C6A86A] text-[#001D50] font-bold rounded-xs flex items-center justify-center font-mono text-sm">
            02
          </div>
          <h3 className="font-serif text-xl font-bold text-[#001D50]">
            Mi történik a kezelés alatt?
          </h3>
          <ul className="text-xs text-[#001D50]/80 space-y-2.5 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-[#001D50] font-bold">›</span>
              <span><strong>Személyes konzultáció:</strong> Átbeszéljük az online kérdőív eredményét, a stílusodat és a szemformádat.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#001D50] font-bold">›</span>
              <span><strong>Maximális kényelem:</strong> Ergonómikus memóriahabos kezelőágy, puha takaró és halk relaxáló dallamok.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#001D50] font-bold">›</span>
              <span><strong>Fájdalommentes építés:</strong> A szemed csukva marad, a kezelés teljesen biztonságos – a legtöbb vendégünk jóízűt alszik.</span>
            </li>
          </ul>
        </div>

        {/* Step 3: Utána */}
        <div className="bg-white border border-[#E8E5DD] p-7 rounded-sm shadow-2xs space-y-4 relative">
          <div className="w-10 h-10 bg-[#001D50] text-[#C6A86A] font-bold rounded-xs flex items-center justify-center font-mono text-sm">
            03
          </div>
          <h3 className="font-serif text-xl font-bold text-[#001D50]">
            Utóápolás és tartósság
          </h3>
          <ul className="text-xs text-[#001D50]/80 space-y-2.5 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-[#C6A86A] font-bold">›</span>
              <span><strong>Ajándék pilla-kefe:</strong> Minden új vendégünk névre szóló szempillakefét kap az otthoni tisztításhoz.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C6A86A] font-bold">›</span>
              <span><strong>24 órás szabály:</strong> Az első napon kerüld a gőzt, szaunát és a közvetlen vízcsapást.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C6A86A] font-bold">›</span>
              <span><strong>Időpont a töltésre:</strong> Átbeszéljük a természetes szempillaciklusodat és kitűzzük a következő időpontot.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Allergia & Érzékenység tudnivaló */}
      <div className="bg-[#F8F7F2] border border-[#E8E5DD] p-8 rounded-sm space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#C6A86A]" />
          <h4 className="font-serif text-lg font-bold text-[#001D50]">
            Allergia-próba és érzékeny szemek
          </h4>
        </div>
        <p className="text-xs md:text-sm text-[#001D50]/80 leading-relaxed font-sans">
          Ha korábban bármikor allergiás reakciót (viszketés, szemhéjduzzanat) tapasztaltál műszempilla viselésekor, vagy kifejezetten érzékeny a szemed, az új szett felhelyezése előtt 48 órával díjmentes allergia-próbát biztosítunk a szalonban (3-3 szál felhelyezése mindkét szemre).
        </p>
      </div>
    </div>
  );
};
