/**
 * Linea Studio - Top Navigation Bar
 * Follows the exact structure from PDF Page 1:
 * - Brand wordmark "Linea Studio" with LS logo (takes to Kezdőlap)
 * - "Szolgáltatások ▼" dropdown menu with the 4 core services
 * - "Első alkalom"
 * - "Házirend"
 * - "GYIK"
 * - Prominent "INGYENES KONZULTÁCIÓ" gold CTA button
 * - Fully responsive with mobile hamburger drawer
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Code2,
  Eye,
  Check
} from 'lucide-react';
import { DETAILED_SERVICES } from '../data/mockData';

interface NavbarProps {
  currentView: string;
  activeServiceId?: string;
  onNavigate: (view: string, serviceId?: string) => void;
  isAdminLoggedIn: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  activeServiceId,
  onNavigate,
  isAdminLoggedIn,
  onOpenLogin,
  onLogout,
}) => {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectService = (serviceId: string) => {
    setIsServicesDropdownOpen(false);
    setIsMobileMenuOpen(false);
    onNavigate('service-detail', serviceId);
  };

  return (
    <header className="sticky top-0 z-50 bg-warm-bg/95 backdrop-blur-md border-b border-warm-border px-3 sm:px-6 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Linea Studio brand wordmark + Logo */}
        <button
          onClick={() => {
            setIsMobileMenuOpen(false);
            onNavigate('landing');
          }}
          className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
        >
          <img
            src="/assets/aistudio/logo_713cd271.png"
            alt="Linea Studio"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex items-center flex-col">
            <span className="font-serif text-base sm:text-xl tracking-widest font-bold text-[#001D50] uppercase whitespace-nowrap shrink-0">
              Linea Studio
            </span>
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-[#C6A86A] font-medium -mt-1 font-sans">
              Eyelash & Brow
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-medium text-[#001D50]/85 font-sans">

          {/* 1. Szolgáltatások Dropdown Menu with arrow */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
              className={`flex items-center gap-1.5 hover:text-[#C6A86A] transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                currentView === 'service-detail'
                  ? 'border-[#C6A86A] text-[#001D50] font-bold'
                  : 'border-transparent'
              }`}
            >
              <span>Szolgáltatások</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#C6A86A] transition-transform duration-200 ${
                  isServicesDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Popover */}
            {isServicesDropdownOpen && (
              <div className="absolute top-full left-0 mt-3 w-64 bg-white border border-[#E8E5DD] shadow-xl rounded-sm py-2 z-50 animate-scale-up">
                <div className="px-4 py-2 border-b border-[#E8E5DD] text-[10px] uppercase tracking-widest text-[#C6A86A] font-bold">
                  Szolgáltatásaink
                </div>
                {DETAILED_SERVICES.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => handleSelectService(srv.id)}
                    className={`w-full px-4 py-2.5 text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      currentView === 'service-detail' && activeServiceId === srv.id
                        ? 'bg-accent-gold/10 text-primary-dark font-bold'
                        : 'text-primary-dark/80 hover:bg-warm-bg hover:text-primary-dark'
                    }`}
                  >
                    <span>{srv.name}</span>
                    <span className="text-[10px] text-[#C6A86A] font-mono font-normal">
                      ›
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Első alkalom */}
          <button
            onClick={() => onNavigate('first-visit')}
            className={`hover:text-[#C6A86A] transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
              currentView === 'first-visit' ? 'border-[#C6A86A] text-[#001D50] font-bold' : 'border-transparent'
            }`}
          >
            Első alkalom
          </button>

          {/* 3. Házirend */}
          <button
            onClick={() => onNavigate('house-rules')}
            className={`hover:text-[#C6A86A] transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
              currentView === 'house-rules' ? 'border-[#C6A86A] text-[#001D50] font-bold' : 'border-transparent'
            }`}
          >
            Házirend
          </button>

          {/* 4. GYIK */}
          <button
            onClick={() => onNavigate('faq')}
            className={`hover:text-[#C6A86A] transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
              currentView === 'faq' ? 'border-[#C6A86A] text-[#001D50] font-bold' : 'border-transparent'
            }`}
          >
            GYIK
          </button>

          <button
            onClick={() => (isAdminLoggedIn ? onNavigate('admin') : onOpenLogin())}
            className={`flex items-center gap-1 hover:text-[#C6A86A] transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
              currentView === 'admin' ? 'border-[#C6A86A] text-[#001D50] font-bold' : 'border-transparent'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C6A86A]" />
            <span>{isAdminLoggedIn ? 'Admin Pult' : 'Admin'}</span>
          </button>
        </nav>

        {/* Zone 3: Primary CTA Button "INGYENES KONZULTÁCIÓ" (Header Gold Button) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onNavigate('intake');
            }}
            className="relative overflow-hidden group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-[#001D50] bg-gradient-to-r from-[#C6A86A] via-[#DFC285] to-[#C6A86A] hover:from-[#DFC285] hover:to-[#C6A86A] border border-white/50 rounded-full shadow-[0_4px_18px_rgba(198,168,106,0.38)] hover:shadow-[0_6px_25px_rgba(198,168,106,0.58)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shrink-0 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-transform before:duration-700"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#001D50] group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 relative z-10" />
            <span className="hidden sm:inline relative z-10">Ingyenes Konzultáció</span>
            <span className="sm:hidden flex flex-col text-left leading-tight relative z-10 font-bold">
              <span>Ingyenes</span>
              <span>Konzultáció</span>
            </span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#001D50] hover:text-[#C6A86A] transition-colors focus:outline-none shrink-0"
            aria-label="Menü megnyitása"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E8E5DD] mt-3 py-4 px-6 space-y-4 shadow-xl animate-fade-in font-sans">
          <div className="space-y-1 pb-3 border-b border-[#E8E5DD]">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('landing');
              }}
              className="block w-full text-left py-2 text-xs uppercase font-bold text-[#001D50]"
            >
              Kezdőlap
            </button>
          </div>

          {/* Mobile Services Accordion */}
          <div className="space-y-2 pb-3 border-b border-[#E8E5DD]">
            <div className="text-[11px] uppercase tracking-wider text-[#C6A86A] font-bold">
              Szolgáltatások
            </div>
            <div className="pl-2 space-y-1.5">
              {DETAILED_SERVICES.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => handleSelectService(srv.id)}
                  className="block w-full text-left py-1.5 text-xs text-[#001D50]/80 hover:text-[#001D50]"
                >
                  › {srv.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pb-3 border-b border-[#E8E5DD]">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('first-visit');
              }}
              className="block w-full text-left py-1 text-xs uppercase font-semibold text-[#001D50]"
            >
              Első alkalom útmutató
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('house-rules');
              }}
              className="block w-full text-left py-1 text-xs uppercase font-semibold text-[#001D50]"
            >
              Szalon Házirend
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('faq');
              }}
              className="block w-full text-left py-1 text-xs uppercase font-semibold text-[#001D50]"
            >
              Gyakran Ismételt Kérdések
            </button>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (isAdminLoggedIn) onNavigate('admin');
                else onOpenLogin();
              }}
              className="font-semibold text-[#001D50] flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6A86A]" />
              <span>{isAdminLoggedIn ? 'Admin Pult' : 'Admin Belépés'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
