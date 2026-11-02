/**
 * Linea Studio - House Rules ("Házirend")
 * Clean, respectful salon policy and etiquette.
 */

import React from 'react';
import {
  Shield,
  Sparkles,
  Clock,
  CalendarX,
  Users,
  VolumeX,
  Award,
  CheckCircle2
} from 'lucide-react';
import { HOUSE_RULES } from '../data/mockData';

export const HouseRules: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-[#C6A86A]" />;
      case 'clock':
        return <Clock className="w-5 h-5 text-[#C6A86A]" />;
      case 'calendar':
        return <CalendarX className="w-5 h-5 text-[#C6A86A]" />;
      case 'user-check':
        return <Users className="w-5 h-5 text-[#C6A86A]" />;
      case 'phone-off':
        return <VolumeX className="w-5 h-5 text-[#C6A86A]" />;
      case 'shield':
        return <Award className="w-5 h-5 text-[#C6A86A]" />;
      default:
        return <Shield className="w-5 h-5 text-[#C6A86A]" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12 animate-fade-in">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#C6A86A] font-semibold">
          Kölcsönös tisztelet & szalon protokoll
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-[#001D50]">
          Szalon Házirend
        </h1>
        <div className="w-16 h-0.5 bg-[#C6A86A] mx-auto my-2.5 sm:my-3" />
        <p className="text-xs sm:text-sm text-[#001D50]/80 font-sans leading-relaxed">
          Célunk, hogy a Linea Studio-ban töltött idő minden kedves vendégünk számára a zavartalan pihenés, szépülés és nyugalom szigete legyen. Kérjük, olvasd el az alábbi alapvető szabályainkat.
        </p>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {HOUSE_RULES.map((rule, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#E8E5DD] hover:border-[#C6A86A] p-4 sm:p-6 rounded-sm shadow-2xs space-y-2.5 sm:space-y-3 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#F8F7F2] rounded-xs flex items-center justify-center border border-[#E8E5DD] shrink-0">
                {getIcon(rule.iconName)}
              </div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#001D50]">
                {rule.title}
              </h3>
            </div>
            <p className="text-xs text-[#001D50]/80 font-sans leading-relaxed">
              {rule.description}
            </p>
          </div>
        ))}
      </div>

      {/* Hygiene and Safety Guarantee */}
      <div className="bg-[#001D50] text-white p-5 sm:p-8 md:p-10 rounded-sm space-y-4 shadow-lg text-left flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#C6A86A] font-semibold block">
            Egészségügyi és sterilizációs protokoll
          </span>
          <h4 className="font-serif text-lg sm:text-xl font-bold">
            100% Higiéniai Garancia a Szalonban
          </h4>
          <p className="text-xs text-white/80 font-sans leading-relaxed">
            Eszközeinket minden vendég után orvosi minőségű ultrahangos tisztítóban és kórházi szintű fertőtlenítő folyadékban sterilizáljuk. Eldobható alátétekkel és maszkban dolgozunk a te biztonságodért.
          </p>
        </div>

        <div className="shrink-0 flex items-center justify-center gap-2 text-[#C6A86A] font-semibold text-xs uppercase tracking-wider bg-white/10 px-4 py-3 rounded-xs border border-white/10 w-full sm:w-auto">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Steril Környezet</span>
        </div>
      </div>
    </div>
  );
};
