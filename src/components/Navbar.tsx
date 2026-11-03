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
  Check,
  RefreshCw,
  LogOut,
  FileText,
  Calendar as CalendarIcon,
  Image as ImageIcon
} from 'lucide-react';
import { DETAILED_SERVICES } from '../data/mockData';
import { ConsultationButton } from './ConsultationButton';

interface NavbarProps {
  currentView: string;
  activeServiceId?: string;
  onNavigate: (view: string, serviceId?: string) => void;
  isAdminLoggedIn: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  onRefreshAll?: () => Promise<void> | void;
  adminTab?: 'responses' | 'calendar' | 'portfolio';
  onSelectAdminTab?: (tab: 'responses' | 'calendar' | 'portfolio') => void;
  pendingResponsesCount?: number;
  appointmentsCount?: number;
  portfolioCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  activeServiceId,
  onNavigate,
  isAdminLoggedIn,
  onOpenLogin,
  onLogout,
  onRefreshAll,
  adminTab = 'responses',
  onSelectAdminTab,
  pendingResponsesCount = 0,
  appointmentsCount = 0,
  portfolioCount = 0,
}) => {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleRefresh = async () => {
    if (onRefreshAll) {
      setIsRefreshing(true);
      try {
        await onRefreshAll();
      } finally {
        setTimeout(() => setIsRefreshing(false), 300);
      }
    }
  };

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
            <span
              className={`uppercase font-sans whitespace-nowrap transition-all ${
                currentView === 'admin'
                  ? 'text-[7.5px] sm:text-[9.5px] tracking-wider text-[#C6A86A] font-semibold -mt-0.5'
                  : 'text-[8px] sm:text-[10px] tracking-[0.25em] text-[#C6A86A] font-medium -mt-1'
              }`}
            >
              {currentView === 'admin' ? 'Szalonkezelő Irányítópult' : 'Eyelash & Brow'}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop) OR Admin Dashboard Tabs (Desktop/Tablet) */}
        {currentView !== 'admin' ? (
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
        ) : (
          /* Admin Navigation Tabs (Desktop / Tablet) */
          <nav
            aria-label="Irányítópult navigáció"
            className="hidden md:flex items-center gap-1.5 p-1 bg-[#F0EDE5] rounded-full border border-[#E8E5DD]"
          >
            <button
              type="button"
              onClick={() => onSelectAdminTab?.('responses')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                adminTab === 'responses'
                  ? 'bg-[#001D50] text-[#DFC285] shadow-xs'
                  : 'text-[#001D50]/70 hover:text-[#001D50] hover:bg-white/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#C6A86A]" />
              <span>Konzultációk</span>
              {pendingResponsesCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                    adminTab === 'responses'
                      ? 'bg-[#C6A86A] text-[#001D50]'
                      : 'bg-[#001D50] text-[#C6A86A]'
                  }`}
                >
                  {pendingResponsesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onSelectAdminTab?.('calendar')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                adminTab === 'calendar'
                  ? 'bg-[#001D50] text-[#DFC285] shadow-xs'
                  : 'text-[#001D50]/70 hover:text-[#001D50] hover:bg-white/60'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-[#C6A86A]" />
              <span>Google Naptár</span>
              {appointmentsCount > 0 && (
                <span className="text-[10px] opacity-75">({appointmentsCount})</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onSelectAdminTab?.('portfolio')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                adminTab === 'portfolio'
                  ? 'bg-[#001D50] text-[#DFC285] shadow-xs'
                  : 'text-[#001D50]/70 hover:text-[#001D50] hover:bg-white/60'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#C6A86A]" />
              <span>Portfólió</span>
              {portfolioCount > 0 && (
                <span className="text-[10px] opacity-75">({portfolioCount})</span>
              )}
            </button>
          </nav>
        )}

        {/* Zone 3: Primary CTA Button or Admin Actions (Frissítés & Kilépés) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {currentView !== 'admin' ? (
            <ConsultationButton
              isNavbar={true}
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('intake');
              }}
            />
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#001D50] hover:text-[#C6A86A] bg-white border border-[#E8E5DD] hover:border-[#C6A86A] rounded-full shadow-2xs hover:shadow-xs transition-colors cursor-pointer"
                title="Adatok frissítése"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#C6A86A] ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Frissítés</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-full shadow-2xs hover:shadow-xs transition-colors cursor-pointer"
                title="Kijelentkezés az admin felületről"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Kilépés</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger button - strictly hidden on admin view */}
          {currentView !== 'admin' && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#001D50] hover:text-[#C6A86A] transition-colors focus:outline-none shrink-0"
              aria-label="Menü megnyitása"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Admin Mobile Navigation Tabs - strictly no horizontal scroll, always 100% fitting */}
      {currentView === 'admin' && (
        <div className="md:hidden max-w-7xl mx-auto pt-2 mt-2 border-t border-[#E8E5DD] w-full">
          <div className="grid grid-cols-3 gap-1 p-0.5 bg-[#F0EDE5] rounded-xl border border-[#E8E5DD] w-full">
            <button
              type="button"
              onClick={() => onSelectAdminTab?.('responses')}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-tight transition-all cursor-pointer text-center truncate ${
                adminTab === 'responses'
                  ? 'bg-[#001D50] text-[#DFC285] shadow-xs'
                  : 'text-[#001D50]/70 hover:text-[#001D50]'
              }`}
            >
              <FileText className="w-3 h-3 text-[#C6A86A] shrink-0" />
              <span className="truncate">Kérdőívek</span>
              {pendingResponsesCount > 0 && (
                <span
                  className={`px-1 py-0.1 text-[9px] font-bold rounded-full shrink-0 ${
                    adminTab === 'responses'
                      ? 'bg-[#C6A86A] text-[#001D50]'
                      : 'bg-[#001D50] text-[#C6A86A]'
                  }`}
                >
                  {pendingResponsesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onSelectAdminTab?.('calendar')}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-tight transition-all cursor-pointer text-center truncate ${
                adminTab === 'calendar'
                  ? 'bg-[#001D50] text-[#DFC285] shadow-xs'
                  : 'text-[#001D50]/70 hover:text-[#001D50]'
              }`}
            >
              <CalendarIcon className="w-3 h-3 text-[#C6A86A] shrink-0" />
              <span className="truncate">Naptár</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectAdminTab?.('portfolio')}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-tight transition-all cursor-pointer text-center truncate ${
                adminTab === 'portfolio'
                  ? 'bg-[#001D50] text-[#DFC285] shadow-xs'
                  : 'text-[#001D50]/70 hover:text-[#001D50]'
              }`}
            >
              <ImageIcon className="w-3 h-3 text-[#C6A86A] shrink-0" />
              <span className="truncate">Portfólió</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer - ONLY on public views */}
      {currentView !== 'admin' && isMobileMenuOpen && (
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
