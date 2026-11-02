/**
 * Linea Studio - Admin Dashboard Main Container
 * Houses the Intake Form Response Viewer, Portfolio Manager, and Google Calendar sync.
 */

import React, { useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Calendar as CalendarIcon,
  Sparkles,
  RefreshCw,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { FormResponseItem, PortfolioItem, CalendarAppointment } from '../types';
import { AdminResponsesList } from './AdminResponsesList';
import { PortfolioUpload } from './PortfolioUpload';
import { CalendarView } from './CalendarView';

interface AdminDashboardProps {
  responses: FormResponseItem[];
  portfolio: PortfolioItem[];
  appointments: CalendarAppointment[];
  onRefreshAll: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  responses,
  portfolio,
  appointments,
  onRefreshAll,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'responses' | 'calendar' | 'portfolio'>('responses');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pendingResponsesCount = responses.filter((r) => !r.is_done).length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshAll();
    setTimeout(() => setIsRefreshing(false), 300);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Top dashboard banner */}
      <div className="bg-white border border-[#E8E5DD] p-4 sm:p-6 md:p-8 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#001D50] text-[#C6A86A] text-[11px] uppercase tracking-widest font-semibold rounded-xs mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Védett Szalonkezelő Irányítópult</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#001D50]">
            Linea Studio Admin
          </h1>
          <p className="text-xs text-[#001D50]/70 mt-1 font-sans">
            Beérkezett anamnézis kérdőívek, Google Naptár szinkronizáció és portfólió galéria menedzsment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#001D50] bg-[#F8F7F2] border border-[#E8E5DD] hover:border-[#C6A86A] rounded-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Frissítés</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kilépés</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E5DD] overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('responses')}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'responses'
              ? 'border-[#001D50] text-[#001D50] bg-white font-bold shadow-2xs'
              : 'border-transparent text-[#001D50]/60 hover:text-[#001D50]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#C6A86A]" />
          <span>Konzultációs Kérdőívek</span>
          {pendingResponsesCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-[#001D50] text-[#C6A86A] text-[10px] font-bold rounded-full">
              {pendingResponsesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'calendar'
              ? 'border-[#001D50] text-[#001D50] bg-white font-bold shadow-2xs'
              : 'border-transparent text-[#001D50]/60 hover:text-[#001D50]'
          }`}
        >
          <CalendarIcon className="w-4 h-4 text-[#C6A86A]" />
          <span>Google Naptár & Időpontok ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'portfolio'
              ? 'border-[#001D50] text-[#001D50] bg-white font-bold shadow-2xs'
              : 'border-transparent text-[#001D50]/60 hover:text-[#001D50]'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-[#C6A86A]" />
          <span>Portfólió Menedzser ({portfolio.length})</span>
        </button>
      </div>

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
    </div>
  );
};
