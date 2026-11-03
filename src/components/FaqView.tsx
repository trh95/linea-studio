/**
 * Linea Studio - Frequently Asked Questions (GYIK)
 * Categorized accordion answering common client questions.
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Search,
  Sparkles,
  MessageCircleQuestion,
  ArrowRight
} from 'lucide-react';
import { FAQS_DATA } from '../data/mockData';

interface FaqViewProps {
  onStartIntake: () => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ onStartIntake }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({
    '0-0': true,
    '1-0': true,
  });

  const toggleAccordion = (catIdx: number, itemIdx: number) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#C6A86A] font-semibold">
          Kérdések & Válaszok
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-[#001D50]">
          Gyakran Ismételt Kérdések
        </h1>
        <div className="w-16 h-0.5 bg-[#C6A86A] mx-auto my-2.5 sm:my-3" />
        <p className="text-xs sm:text-sm text-[#001D50]/80 font-sans leading-relaxed">
          Összegyűjtöttük a kezelésekkel, tartóssággal és a szalonnal kapcsolatos leggyakoribb felvetéseket, hogy minden információ a rendelkezésedre álljon.
        </p>

        {/* Search Input */}
        <div className="pt-3 sm:pt-4 max-w-md mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-[#001D50]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Keresés a kérdések között..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8E5DD] focus:border-[#C6A86A] text-xs text-[#001D50] rounded-xs outline-none shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Accordion Categories */}
      <div className="space-y-6 sm:space-y-8">
        {FAQS_DATA.map((cat, catIdx) => {
          const filteredItems = cat.items.filter(
            (it) =>
              it.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              it.answer.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={catIdx} className="space-y-2.5 sm:space-y-3">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#001D50] flex items-center gap-2 border-b border-[#E8E5DD] pb-2">
                <span className="w-2 h-2 rounded-full bg-[#C6A86A]" />
                <span>{cat.category}</span>
              </h3>

              <div className="space-y-2 sm:space-y-2.5">
                {filteredItems.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = !!openItems[key];

                  return (
                    <div
                      key={itemIdx}
                      className="bg-white border border-[#E8E5DD] hover:border-[#C6A86A]/60 rounded-xs overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(catIdx, itemIdx)}
                        className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 sm:gap-4 cursor-pointer"
                      >
                        <span className="font-serif text-xs sm:text-sm font-semibold text-[#001D50] leading-snug">
                          {item.question}
                        </span>
                        <span className="text-[#C6A86A] shrink-0">
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-1 text-xs text-[#001D50]/80 font-sans leading-relaxed border-t border-[#E8E5DD]/50">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Didn't find answer? CTA */}
      <div className="bg-[#F8F7F2] border border-[#E8E5DD] p-5 sm:p-8 rounded-sm text-center space-y-3 sm:space-y-4">
        <h4 className="font-serif text-lg sm:text-xl font-bold text-[#001D50]">
          Nem találtad a választ a kérdésedre?
        </h4>
        <p className="text-xs text-[#001D50]/75 max-w-md mx-auto font-sans leading-relaxed">
          Töltsd ki az ingyenes konzultációs kérdőívet, ahol a megjegyzés rovatban bármilyen egyéni kérdésedet felteheted, és személyesen válaszolunk rá!
        </p>
        <button
          onClick={onStartIntake}
          className="relative overflow-hidden group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#001D50] bg-gradient-to-r from-[#C6A86A] via-[#DFC285] to-[#C6A86A] hover:from-[#DFC285] hover:to-[#C6A86A] border border-white/50 rounded-full shadow-[0_4px_18px_rgba(198,168,106,0.38)] hover:shadow-[0_6px_24px_rgba(198,168,106,0.58)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer w-full sm:w-auto before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-transform before:duration-700"
        >
          <Sparkles className="w-4 h-4 text-[#001D50] group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 relative z-10" />
          <span className="relative z-10">Kérdezz a Konzultációban</span>
        </button>
      </div>
    </div>
  );
};
