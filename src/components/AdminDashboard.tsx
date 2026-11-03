/**
 * Linea Studio - Admin Dashboard Main Container
 * MOBIL-OPTIMALIZÁLÁS (System Instruction irányelvek alapján):
 * 1. Irányelv: Alsó Navigációs Sáv (Bottom Navigation Bar) mobilon a legfontosabb 5 funkció számára
 *    (Kérdőívek, Naptár, Portfólió, Frissítés, Kilépés).
 * 3. Irányelv: Érintésbarát interfész: Minden interaktív elem min. 44x44px touch targettel rendelkezik.
 * 4. Irányelv: overflow-x-hidden a fő konténeren és megfelelő térköz (pb-24 mobilon a bottom bar miatt).
 */

import React, { useState } from 'react';
import {
  ClipboardList,
  Calendar,
  Image as ImageIcon,
  RotateCw,
  LogOut
} from 'lucide-react';
import { FormResponseItem, PortfolioItem, CalendarAppointment } from '../types';
import { AdminResponsesList } from './AdminResponsesList';
import { PortfolioUpload } from './PortfolioUpload';
import { CalendarView } from './CalendarView';

export type AdminTabType = 'responses' | 'calendar' | 'portfolio';

interface AdminDashboardProps {
  responses: FormResponseItem[];
  portfolio: PortfolioItem[];
  appointments: CalendarAppointment[];
  onRefreshAll: () => void;
  onLogout?: () => void;
  activeTab?: AdminTabType;
  onTabChange?: (tab: AdminTabType) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  responses,
  portfolio,
  appointments,
  onRefreshAll,
  onLogout,
  activeTab = 'responses',
  onTabChange,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshAll();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const pendingResponsesCount = responses.filter((r) => !r.is_done).length;

  return (
    // MOBIL-OPTIMALIZÁLÁS (4. Irányelv): overflow-x-hidden a képernyő széthúzása ellen, pb-24 mobilon a Bottom Bar miatt
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-24 md:pb-8 overflow-x-hidden min-h-[calc(100vh-80px)]">
      {/* Tab Panels */}
      <div>
        {activeTab === 'responses' && (
          <AdminResponsesList
            responses={responses}
            onRefresh={onRefreshAll}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            appointments={appointments}
            onRefresh={onRefreshAll}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioUpload
            portfolio={portfolio}
            onRefresh={onRefreshAll}
          />
        )}
      </div>

      {/* MOBIL-OPTIMALIZÁLÁS (1. és 3. Irányelv): Alsó navigációs sáv (Bottom Navigation Bar)
          Kizárólag mobilon jelenik meg (md:hidden), rögzített helyen (fixed bottom-0), 
          hüvelykujjal kényelmesen elérhető, min. 44x44px touch target méretű gombokkal */}
      <nav
        aria-label="Admin mobil alsó navigáció"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E5DD] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around safe-area-bottom"
      >
        {/* 1. Kérdőívek Tab gomb */}
        <button
          onClick={() => onTabChange?.('responses')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all relative ${
            activeTab === 'responses'
              ? 'text-[#001D50] font-bold bg-[#F8F7F2]'
              : 'text-[#001D50]/60 hover:text-[#001D50]'
          }`}
          aria-label="Kérdőívek nézet"
        >
          <div className="relative">
            <ClipboardList className={`w-5 h-5 ${activeTab === 'responses' ? 'text-[#C6A86A]' : ''}`} />
            {pendingResponsesCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#C6A86A] text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs">
                {pendingResponsesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Kérdőívek</span>
        </button>

        {/* 2. Naptár Tab gomb */}
        <button
          onClick={() => onTabChange?.('calendar')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all relative ${
            activeTab === 'calendar'
              ? 'text-[#001D50] font-bold bg-[#F8F7F2]'
              : 'text-[#001D50]/60 hover:text-[#001D50]'
          }`}
          aria-label="Naptár nézet"
        >
          <div className="relative">
            <Calendar className={`w-5 h-5 ${activeTab === 'calendar' ? 'text-[#C6A86A]' : ''}`} />
            {appointments.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#001D50] text-[#C6A86A] font-bold text-[9px] px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs">
                {appointments.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Naptár</span>
        </button>

        {/* 3. Portfólió Tab gomb */}
        <button
          onClick={() => onTabChange?.('portfolio')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all relative ${
            activeTab === 'portfolio'
              ? 'text-[#001D50] font-bold bg-[#F8F7F2]'
              : 'text-[#001D50]/60 hover:text-[#001D50]'
          }`}
          aria-label="Portfólió nézet"
        >
          <div className="relative">
            <ImageIcon className={`w-5 h-5 ${activeTab === 'portfolio' ? 'text-[#C6A86A]' : ''}`} />
            {portfolio.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#001D50] text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs">
                {portfolio.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Portfólió</span>
        </button>

        {/* 4. Frissítés akciógomb */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] px-2 py-1 text-[#001D50]/70 hover:text-[#001D50] active:scale-95 rounded-xl transition-all cursor-pointer"
          aria-label="Adatok frissítése"
        >
          <RotateCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-[#C6A86A]' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Frissítés</span>
        </button>

        {/* 5. Kilépés akciógomb */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] px-2 py-1 text-red-600 hover:text-red-800 active:scale-95 rounded-xl transition-all cursor-pointer"
            aria-label="Kijelentkezés az admin felületről"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Kilépés</span>
          </button>
        )}
      </nav>
    </div>
  );
};
