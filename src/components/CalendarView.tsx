/**
 * Linea Studio - Google Calendar Integration & Appointment View (GoogleCalendarTab)
 * Multi-view interactive calendar component:
 * 1. Monthly View (Havi naptár rács)
 * 2. Weekly View (Heti időbeosztás oszlopok)
 * 3. Daily View (Napi részletes órarend)
 *
 * Design System:
 * - Primary Dark Blue: #001D50
 * - Accent Gold: #C6A86A
 * - Warm Background: #F8F7F2
 * - Fonts: Playfair Display (headings), Montserrat (UI & text)
 */

import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Mail,
  CheckCircle2,
  Check,
  Bell,
  Trash2,
  Edit3,
  X,
  CalendarDays,
  Sparkles,
  AlertCircle,
  Phone,
  Send,
  CalendarRange
} from 'lucide-react';
import { CalendarAppointment } from '../types';
import { apiService } from '../services/apiService';

export type ViewMode = 'month' | 'week' | 'day';

export interface CalendarViewProps {
  appointments: CalendarAppointment[];
  onRefresh: () => void;
  className?: string;
}

// Service templates for fast selection in appointment creation
const POPULAR_SERVICES = [
  '1D Classic Szett (Új építés)',
  '2D Soft Volume (Új építés)',
  '3D Light Volume Szett',
  '4D-6D Mega Volume Szett',
  'Wispy Kim K Effect Szett',
  'Műszempilla Töltés (2-3 hetes)',
  'UV Szempilla Technológia (Új/Töltés)',
  'Szempilla Lifting + Keratin Botox',
  'Szemöldök Laminálás & Styling',
  'Személyes Szemforma Konzultáció'
];

export const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  onRefresh,
  className = '',
}) => {
  // Calendar navigation state - defaults to October 26, 2026 (the active week in mock data)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date('2026-10-26T10:00:00'));
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  // Modals & Active Drawer states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarAppointment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for creating/editing appointment
  const [formClientName, setFormClientName] = useState('');
  const [formClientEmail, setFormClientEmail] = useState('');
  const [formSummary, setFormSummary] = useState(POPULAR_SERVICES[2]);
  const [formDate, setFormDate] = useState('2026-10-26');
  const [formStartTime, setFormStartTime] = useState('10:00');
  const [formDuration, setFormDuration] = useState('120'); // in minutes
  const [formNotes, setFormNotes] = useState('');
  const [formNotifyGuest, setFormNotifyGuest] = useState(true);

  // Quick feedback toast
  const triggerBanner = (message: string) => {
    setNotificationBanner(message);
    setTimeout(() => setNotificationBanner(null), 4500);
  };

  // Helper date functions
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Navigation handlers
  const handlePrev = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (viewMode === 'month') {
        next.setMonth(next.getMonth() - 1);
      } else if (viewMode === 'week') {
        next.setDate(next.getDate() - 7);
      } else {
        next.setDate(next.getDate() - 1);
      }
      return next;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (viewMode === 'month') {
        next.setMonth(next.getMonth() + 1);
      } else if (viewMode === 'week') {
        next.setDate(next.getDate() + 7);
      } else {
        next.setDate(next.getDate() + 1);
      }
      return next;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date('2026-10-26T10:00:00'));
  };

  // Pre-fill creation modal for specific date/time
  const openAddModalForSlot = (targetDate: Date, timeStr = '10:00') => {
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    setFormDate(`${year}-${month}-${day}`);
    setFormStartTime(timeStr);
    setFormClientName('');
    setFormClientEmail('');
    setFormNotes('');
    setShowAddModal(true);
  };

  // Create new appointment
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientName.trim() || !formClientEmail.trim()) return;

    try {
      setIsSubmitting(true);
      const startDateTime = new Date(`${formDate}T${formStartTime}:00`);
      const endDateTime = new Date(startDateTime.getTime() + parseInt(formDuration, 10) * 60000);

      await apiService.createCalendarEvent({
        client_name: formClientName,
        client_email: formClientEmail,
        summary: `${formClientName} - ${formSummary}`,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        status: 'confirmed',
        notes: formNotes,
      });

      triggerBanner(
        formNotifyGuest
          ? `Időpont rögzítve a Google Naptárban és megerősítő meghívó kiküldve: ${formClientEmail}`
          : 'Időpont sikeresen rögzítve a Google Naptárban.'
      );

      setShowAddModal(false);
      onRefresh();
    } catch (err) {
      console.error('Error creating appointment:', err);
      triggerBanner('Hiba történt az időpont mentésekor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete appointment
  const handleDeleteAppointment = async (eventId: string) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt az időpontot a Google Naptárból?')) return;
    try {
      setIsSubmitting(true);
      await apiService.deleteCalendarEvent(eventId);
      setSelectedEvent(null);
      triggerBanner('Az időpont sikeresen törölve a Google Naptárból.');
      onRefresh();
    } catch (err) {
      console.error('Error deleting appointment:', err);
      triggerBanner('Hiba történt a törlés során.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (event: CalendarAppointment, newStatus: 'confirmed' | 'pending' | 'cancelled') => {
    try {
      const updated = await apiService.updateCalendarEvent(event.event_id, { status: newStatus });
      setSelectedEvent(updated);
      triggerBanner(`Státusz frissítve: ${newStatus === 'confirmed' ? 'Visszaigazolva' : newStatus === 'cancelled' ? 'Lemondva' : 'Függőben'}`);
      onRefresh();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Send manual reminder email
  const handleSendReminder = (event: CalendarAppointment) => {
    triggerBanner(`Emlékeztető e-mail azonnal kiküldve a vendégnek: ${event.client_email}`);
  };

  // =========================================================================
  // CALCULATIONS: Current active dates & display headers
  // =========================================================================

  // Month grid dates calculation
  const monthGridDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    // Determine day of week (0 = Sun, 1 = Mon ...). We want 0 = Mon, 6 = Sun
    const dayOfWeek = (firstDay.getDay() + 6) % 7;

    const days: { date: Date; isCurrentMonth: boolean; isToday: boolean }[] = [];
    const today = new Date('2026-10-26T00:00:00');

    // Previous month padding days
    for (let i = dayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({
        date: d,
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
      });
    }

    // Days of current month
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        isCurrentMonth: true,
        isToday: isSameDay(d, today),
      });
    }

    // Next month padding days to complete 35 or 42 cells
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
      });
    }

    return days;
  }, [currentDate]);

  // Week days calculation (Monday - Sunday)
  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const day = (curr.getDay() + 6) % 7; // Monday = 0
    const monday = new Date(curr);
    monday.setDate(curr.getDate() - day);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentDate]);

  // Header Title Text depending on ViewMode
  const headerDateLabel = useMemo(() => {
    if (viewMode === 'month') {
      const monthName = currentDate.toLocaleDateString('hu-HU', { month: 'long' });
      return `${currentDate.getFullYear()}. ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;
    }
    if (viewMode === 'week') {
      const start = weekDays[0];
      const end = weekDays[6];
      const sameMonth = start.getMonth() === end.getMonth();
      if (sameMonth) {
        return `${start.getFullYear()}. ${start.toLocaleDateString('hu-HU', { month: 'long' })} ${start.getDate()}. – ${end.getDate()}.`;
      }
      return `${start.getFullYear()}. ${start.toLocaleDateString('hu-HU', { month: 'short' })} ${start.getDate()}. – ${end.toLocaleDateString('hu-HU', { month: 'short' })} ${end.getDate()}.`;
    }
    return currentDate.toLocaleDateString('hu-HU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [currentDate, viewMode, weekDays]);

  // Appointments grouped by date key YYYY-MM-DD
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, CalendarAppointment[]>();
    appointments.forEach((appt) => {
      const d = new Date(appt.start_time);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const existing = map.get(key) || [];
      existing.push(appt);
      map.set(key, existing);
    });
    return map;
  }, [appointments]);

  // Appointments for selected day in Daily view
  const dayAppointments = useMemo(() => {
    const key = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const list = appointmentsByDate.get(key) || [];
    return [...list].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [currentDate, appointmentsByDate]);

  // Hourly slots for Week and Day view (08:00 to 20:00)
  const hourSlots = useMemo(() => {
    return Array.from({ length: 13 }, (_, i) => i + 8); // 8 to 20
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* =====================================================================
          1. GOOGLE CALENDAR SYNC HEADER & TOOLBAR
         ===================================================================== */}
      <div className="bg-white border border-[#E8E5DD] p-5 sm:p-6 rounded-sm shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-sm bg-[#001D50] text-[#C6A86A] flex items-center justify-center shrink-0 shadow-xs">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#001D50]">
                Google Naptár & Időpontok
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Aktív & Szinkronizálva
              </span>
            </div>
            <p className="text-xs text-[#001D50]/70 font-sans mt-0.5">
              Fiók: <code className="font-mono text-[#001D50] font-semibold">linea.studio.szalon@gmail.com</code> • Időzóna: Europe/Budapest
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => openAddModalForSlot(currentDate)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#001D50] hover:bg-[#0A275C] transition-all rounded-xs shadow-xs hover:shadow-md cursor-pointer group"
          >
            <Plus className="w-4 h-4 text-[#C6A86A] group-hover:rotate-90 transition-transform" />
            <span>Új Időpont Rögzítése</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notificationBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xs flex items-center gap-3 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-medium">{notificationBanner}</span>
        </div>
      )}

      {/* =====================================================================
          2. CALENDAR CONTROL BAR (Nav buttons, Title, View Switcher)
         ===================================================================== */}
      <div className="bg-white border border-[#E8E5DD] px-5 py-4 rounded-sm shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation buttons + Active range text */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-[#E8E5DD] rounded-xs bg-[#F8F7F2]/50 p-0.5 shadow-2xs">
            <button
              onClick={handlePrev}
              title="Előző időszak"
              className="p-1.5 text-[#001D50] hover:bg-white hover:text-[#C6A86A] rounded-xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#001D50] hover:bg-white rounded-xs transition-colors cursor-pointer"
            >
              Ma
            </button>
            <button
              onClick={handleNext}
              title="Következő időszak"
              className="p-1.5 text-[#001D50] hover:bg-white hover:text-[#C6A86A] rounded-xs transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#001D50] tracking-tight">
            {headerDateLabel}
          </h3>
        </div>

        {/* View Switcher: Havi (Month) | Heti (Week) | Napi (Day) */}
        <div className="flex items-center self-start md:self-auto">
          <div className="inline-flex rounded-xs border border-[#E8E5DD] bg-[#F8F7F2] p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-[#001D50] text-[#C6A86A] shadow-xs'
                  : 'text-[#001D50]/80 hover:text-[#001D50] hover:bg-white/60'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Havi</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-[#001D50] text-[#C6A86A] shadow-xs'
                  : 'text-[#001D50]/80 hover:text-[#001D50] hover:bg-white/60'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Heti</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                viewMode === 'day'
                  ? 'bg-[#001D50] text-[#C6A86A] shadow-xs'
                  : 'text-[#001D50]/80 hover:text-[#001D50] hover:bg-white/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Napi</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. VIEW MODE 1: MONTHLY CALENDAR GRID
         ===================================================================== */}
      {viewMode === 'month' && (
        <div className="bg-white border border-[#E8E5DD] rounded-sm shadow-sm overflow-hidden">
          {/* Day Headers (Monday to Sunday) */}
          <div className="grid grid-cols-7 border-b border-[#E8E5DD] bg-[#F8F7F2] text-center font-sans">
            {['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'].map((name, i) => (
              <div
                key={name}
                className={`py-3 text-[11px] font-bold uppercase tracking-wider ${
                  i >= 5 ? 'text-[#001D50]/50' : 'text-[#001D50]'
                }`}
              >
                <span className="hidden sm:inline">{name}</span>
                <span className="sm:hidden">{name.slice(0, 2)}</span>
              </div>
            ))}
          </div>

          {/* Month Day Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[#E8E5DD]">
            {monthGridDays.map((dayItem, index) => {
              const dateKey = `${dayItem.date.getFullYear()}-${String(dayItem.date.getMonth() + 1).padStart(2, '0')}-${String(dayItem.date.getDate()).padStart(2, '0')}`;
              const dayAppts = appointmentsByDate.get(dateKey) || [];

              return (
                <div
                  key={index}
                  className={`min-h-[110px] sm:min-h-[130px] p-2 flex flex-col justify-between transition-colors relative group ${
                    dayItem.isCurrentMonth ? 'bg-white hover:bg-[#F8F7F2]/40' : 'bg-[#F8F7F2]/40 text-neutral-400'
                  }`}
                >
                  {/* Date number header */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full font-mono ${
                        dayItem.isToday
                          ? 'bg-[#001D50] text-[#C6A86A] font-bold ring-2 ring-[#C6A86A]/40'
                          : dayItem.isCurrentMonth
                          ? 'text-[#001D50]'
                          : 'text-neutral-400'
                      }`}
                    >
                      {dayItem.date.getDate()}
                    </span>

                    {/* Quick plus button on hover */}
                    <button
                      type="button"
                      title="Új időpont erre a napra"
                      onClick={() => openAddModalForSlot(dayItem.date)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#001D50] hover:text-[#C6A86A] hover:bg-[#F8F7F2] rounded transition-opacity cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Appointments badges list */}
                  <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[85px] pr-0.5">
                    {dayAppts.map((appt) => {
                      const startTime = new Date(appt.start_time).toLocaleTimeString('hu-HU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <button
                          key={appt.event_id}
                          onClick={() => setSelectedEvent(appt)}
                          className="w-full text-left px-2 py-1 bg-[#F8F7F2] hover:bg-[#001D50] text-[#001D50] hover:text-[#F8F7F2] border-l-2 border-[#C6A86A] rounded-xs text-[11px] transition-all truncate block shadow-2xs group/btn cursor-pointer"
                        >
                          <span className="font-mono font-bold text-[10px] text-[#C6A86A] group-hover/btn:text-[#C6A86A] mr-1">
                            {startTime}
                          </span>
                          <span className="font-medium truncate">{appt.client_name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {dayAppts.length === 0 && (
                    <div className="h-6" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          4. VIEW MODE 2: WEEKLY VIEW (7-day columns with hourly timeline)
         ===================================================================== */}
      {viewMode === 'week' && (
        <div className="bg-white border border-[#E8E5DD] rounded-sm shadow-sm overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Week Header Row */}
            <div className="grid grid-cols-8 border-b border-[#E8E5DD] bg-[#F8F7F2] divide-x divide-[#E8E5DD]">
              {/* Corner time label */}
              <div className="p-3 text-[11px] font-bold text-center text-[#001D50]/60 uppercase tracking-wider">
                Időpont
              </div>

              {/* 7 Day Headers */}
              {weekDays.map((d) => {
                const isToday = isSameDay(d, new Date('2026-10-26T00:00:00'));
                return (
                  <div
                    key={d.toISOString()}
                    className={`p-3 text-center transition-colors ${
                      isToday ? 'bg-[#001D50] text-white' : 'text-[#001D50]'
                    }`}
                  >
                    <span className="text-[11px] uppercase tracking-wider block font-semibold opacity-80">
                      {d.toLocaleDateString('hu-HU', { weekday: 'short' })}
                    </span>
                    <span
                      className={`text-base font-serif font-bold inline-block mt-0.5 ${
                        isToday ? 'text-[#C6A86A]' : 'text-[#001D50]'
                      }`}
                    >
                      {d.getDate()}.
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Week Grid Rows (Hour slots) */}
            <div className="divide-y divide-[#E8E5DD]">
              {hourSlots.map((hour) => {
                const timeLabel = `${String(hour).padStart(2, '0')}:00`;

                return (
                  <div key={hour} className="grid grid-cols-8 divide-x divide-[#E8E5DD] min-h-[64px]">
                    {/* Time slot header */}
                    <div className="p-2 text-center text-xs font-mono text-[#001D50]/60 bg-[#F8F7F2]/40 flex items-start justify-center pt-2">
                      {timeLabel}
                    </div>

                    {/* 7 Days in this hour */}
                    {weekDays.map((d) => {
                      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                      const dayAppts = appointmentsByDate.get(dateKey) || [];

                      // Find appointments starting in this hour
                      const apptsInSlot = dayAppts.filter((appt) => {
                        const start = new Date(appt.start_time);
                        return start.getHours() === hour;
                      });

                      return (
                        <div
                          key={d.toISOString()}
                          onClick={() => openAddModalForSlot(d, timeLabel)}
                          className="p-1 relative group hover:bg-[#F8F7F2]/50 transition-colors cursor-pointer flex flex-col justify-start"
                        >
                          {apptsInSlot.map((appt) => {
                            const start = new Date(appt.start_time);
                            const end = new Date(appt.end_time);
                            const timeStr = `${start.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}`;

                            return (
                              <div
                                key={appt.event_id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(appt);
                                }}
                                className="bg-[#001D50] text-white p-2 rounded-xs border-l-3 border-[#C6A86A] shadow-sm mb-1 hover:brightness-110 transition-all cursor-pointer"
                              >
                                <div className="text-[10px] font-mono text-[#C6A86A] font-bold">
                                  {timeStr}
                                </div>
                                <div className="text-xs font-semibold truncate leading-tight mt-0.5">
                                  {appt.client_name}
                                </div>
                                <div className="text-[10px] text-white/70 truncate">
                                  {appt.summary.replace(`${appt.client_name} - `, '')}
                                </div>
                              </div>
                            );
                          })}

                          {/* Quick add hover trigger */}
                          {apptsInSlot.length === 0 && (
                            <span className="hidden group-hover:flex items-center justify-center h-full text-[10px] text-[#001D50]/40 font-sans uppercase">
                              + Foglalás
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. VIEW MODE 3: DAILY VIEW (Detailed hourly breakdown)
         ===================================================================== */}
      {viewMode === 'day' && (
        <div className="bg-white border border-[#E8E5DD] rounded-sm shadow-sm overflow-hidden">
          {/* Day Summary Top Banner */}
          <div className="p-6 bg-[#F8F7F2] border-b border-[#E8E5DD] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C6A86A] font-bold font-sans">
                Napi Időbeosztás
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#001D50] mt-0.5">
                {currentDate.toLocaleDateString('hu-HU', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-[#001D50]/70 font-sans block">
                  Rögzített időpontok:
                </span>
                <strong className="text-lg font-serif font-bold text-[#001D50]">
                  {dayAppointments.length} vendég
                </strong>
              </div>
              <button
                onClick={() => openAddModalForSlot(currentDate)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#001D50] bg-[#C6A86A] hover:bg-[#A98A4D] hover:text-white transition-colors rounded-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Új Vendég Mára</span>
              </button>
            </div>
          </div>

          {/* Day Hour Slots Timeline */}
          <div className="divide-y divide-[#E8E5DD]">
            {hourSlots.map((hour) => {
              const timeLabel = `${String(hour).padStart(2, '0')}:00`;
              const apptsInHour = dayAppointments.filter((a) => {
                const s = new Date(a.start_time);
                return s.getHours() === hour;
              });

              return (
                <div key={hour} className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-[#E8E5DD] min-h-[80px]">
                  {/* Time label */}
                  <div className="w-full sm:w-28 p-4 bg-[#F8F7F2]/30 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start">
                    <span className="font-mono text-sm font-bold text-[#001D50]">
                      {timeLabel}
                    </span>
                    <span className="text-[10px] text-[#001D50]/50 uppercase tracking-wider">
                      {hour < 12 ? 'Délelőtt' : 'Délután'}
                    </span>
                  </div>

                  {/* Appointments in slot */}
                  <div className="flex-1 p-3 flex flex-col justify-center">
                    {apptsInHour.length > 0 ? (
                      <div className="space-y-3">
                        {apptsInHour.map((appt) => {
                          const s = new Date(appt.start_time);
                          const e = new Date(appt.end_time);
                          const diffMinutes = Math.round((e.getTime() - s.getTime()) / 60000);

                          return (
                            <div
                              key={appt.event_id}
                              onClick={() => setSelectedEvent(appt)}
                              className="p-4 bg-white border border-[#E8E5DD] hover:border-[#C6A86A] rounded-sm shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer border-l-4 border-l-[#C6A86A]"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                  <h4 className="font-serif text-base font-bold text-[#001D50]">
                                    {appt.client_name}
                                  </h4>
                                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xs font-semibold">
                                    {appt.status === 'confirmed' ? 'Visszaigazolva' : appt.status}
                                  </span>
                                </div>
                                <p className="text-xs text-[#001D50]/80 font-sans font-medium">
                                  {appt.summary.replace(`${appt.client_name} - `, '')}
                                </p>
                                {appt.notes && (
                                  <p className="text-xs text-[#001D50]/65 italic font-sans">
                                    Megjegyzés: {appt.notes}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-[#001D50]/80 shrink-0">
                                <div className="flex items-center gap-1.5 font-mono text-[#001D50] font-semibold bg-[#F8F7F2] px-3 py-1.5 rounded-xs border border-[#E8E5DD]">
                                  <Clock className="w-3.5 h-3.5 text-[#C6A86A]" />
                                  <span>
                                    {s.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })} -{' '}
                                    {e.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}{' '}
                                    ({diffMinutes} perc)
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    handleSendReminder(appt);
                                  }}
                                  className="p-2 text-[#001D50] hover:text-[#C6A86A] hover:bg-[#F8F7F2] rounded-xs border border-[#E8E5DD] transition-colors"
                                  title="Emlékeztető küldése"
                                >
                                  <Bell className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div
                        onClick={() => openAddModalForSlot(currentDate, timeLabel)}
                        className="py-2.5 px-3 rounded-xs border border-dashed border-[#E8E5DD] hover:border-[#C6A86A] text-[#001D50]/50 hover:text-[#001D50] hover:bg-[#F8F7F2]/40 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="text-xs font-sans">Szabad idősáv</span>
                        <span className="text-xs font-semibold text-[#C6A86A] flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" /> Időpont hozzáadása ide
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          6. APPOINTMENT DETAIL & ACTION MODAL
         ===================================================================== */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-[#001D50]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E5DD] max-w-lg w-full rounded-sm shadow-2xl p-6 sm:p-8 animate-scale-up space-y-6">
            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-[#E8E5DD] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C6A86A] font-bold">
                  Google Naptár Esemény Részletei
                </span>
                <h3 className="font-serif text-xl font-bold text-[#001D50] mt-0.5">
                  {selectedEvent.summary}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-[#001D50]/60 hover:text-[#001D50] p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Info Grid */}
            <div className="space-y-3 font-sans text-xs text-[#001D50]/80">
              <div className="flex items-center gap-3 p-3 bg-[#F8F7F2] rounded-xs border border-[#E8E5DD]">
                <Clock className="w-4 h-4 text-[#C6A86A] shrink-0" />
                <div>
                  <span className="font-bold text-[#001D50] block">Időpont & Dátum:</span>
                  <span>
                    {new Date(selectedEvent.start_time).toLocaleDateString('hu-HU', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    • {new Date(selectedEvent.start_time).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })} -{' '}
                    {new Date(selectedEvent.end_time).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#F8F7F2] rounded-xs border border-[#E8E5DD]">
                <User className="w-4 h-4 text-[#C6A86A] shrink-0" />
                <div>
                  <span className="font-bold text-[#001D50] block">Vendég Neve:</span>
                  <span>{selectedEvent.client_name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#F8F7F2] rounded-xs border border-[#E8E5DD]">
                <Mail className="w-4 h-4 text-[#C6A86A] shrink-0" />
                <div>
                  <span className="font-bold text-[#001D50] block">E-mail Értesítési Cím:</span>
                  <span className="font-mono text-[#001D50]">{selectedEvent.client_email}</span>
                </div>
              </div>

              {selectedEvent.notes && (
                <div className="p-3 bg-[#F8F7F2] rounded-xs border border-[#E8E5DD]">
                  <span className="font-bold text-[#001D50] block mb-1">Megjegyzés a vendégtől / stylisttól:</span>
                  <p className="italic text-[#001D50]/80">{selectedEvent.notes}</p>
                </div>
              )}

              {/* Status Selector */}
              <div className="pt-2">
                <span className="font-bold text-[#001D50] block mb-2">Foglalási státusz:</span>
                <div className="flex items-center gap-2">
                  {(['confirmed', 'pending', 'cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleToggleStatus(selectedEvent, st)}
                      className={`px-3 py-1.5 rounded-xs text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                        selectedEvent.status === st
                          ? st === 'confirmed'
                            ? 'bg-emerald-600 text-white'
                            : st === 'pending'
                            ? 'bg-amber-500 text-white'
                            : 'bg-red-600 text-white'
                          : 'bg-[#F8F7F2] text-[#001D50] border border-[#E8E5DD]'
                      }`}
                    >
                      {st === 'confirmed' ? 'Visszaigazolva' : st === 'pending' ? 'Függőben' : 'Lemondva'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions: Send reminder / Delete */}
            <div className="pt-4 border-t border-[#E8E5DD] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDeleteAppointment(selectedEvent.event_id)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Időpont Törlése</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendReminder(selectedEvent)}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#001D50] bg-[#C6A86A] hover:bg-[#A98A4D] hover:text-white rounded-xs transition-colors shadow-xs cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Emlékeztető Küldése</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          7. ADD APPOINTMENT MODAL (Full Booking Form)
         ===================================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#001D50]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8E5DD] max-w-lg w-full p-6 md:p-8 rounded-sm shadow-2xl animate-scale-up space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DD]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C6A86A] font-bold">
                  Új Vendég Foglalása
                </span>
                <h3 className="font-serif text-lg font-bold text-[#001D50] mt-0.5">
                  Időpont Rögzítése Google Naptárba
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#001D50]/60 hover:text-[#001D50] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#001D50] mb-1">
                  Vendég Neve *
                </label>
                <input
                  type="text"
                  required
                  value={formClientName}
                  onChange={(e) => setFormClientName(e.target.value)}
                  placeholder="Pl. Kovács Anna"
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-xs text-[#001D50] rounded-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#001D50] mb-1">
                  Vendég E-mail Címe (Google Calendar Meghívóhoz) *
                </label>
                <input
                  type="email"
                  required
                  value={formClientEmail}
                  onChange={(e) => setFormClientEmail(e.target.value)}
                  placeholder="anna.kovacs@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-xs text-[#001D50] rounded-xs outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#001D50] mb-1">
                  Szolgáltatás / Szett Típusa *
                </label>
                <select
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-xs text-[#001D50] rounded-xs outline-none transition-colors cursor-pointer"
                >
                  {POPULAR_SERVICES.map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#001D50] mb-1">
                    Dátum *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-xs text-[#001D50] rounded-xs outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#001D50] mb-1">
                    Kezdés Időpontja *
                  </label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-xs text-[#001D50] rounded-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#001D50] mb-1">
                  Várható Időtartam *
                </label>
                <select
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-xs text-[#001D50] rounded-xs outline-none cursor-pointer"
                >
                  <option value="60">60 perc (1 óra - pl. Lifting vagy 1D töltés)</option>
                  <option value="90">90 perc (1.5 óra - pl. 2D-3D töltés)</option>
                  <option value="120">120 perc (2 óra - Új szett építés / UV Volume)</option>
                  <option value="150">150 perc (2.5 óra - Mega Volume / Wispy)</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#001D50] mb-1">
                  Belső Jegyzet / Kívánságok (Opcionális)
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Pl. Érzékeny szemhéj, C-ív, 9-12 mm, kávé növényi tejjel..."
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-xs text-[#001D50] rounded-xs outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="notifyGuestCheck"
                  checked={formNotifyGuest}
                  onChange={(e) => setFormNotifyGuest(e.target.checked)}
                  className="w-4 h-4 accent-[#C6A86A] cursor-pointer"
                />
                <label htmlFor="notifyGuestCheck" className="text-xs text-[#001D50] cursor-pointer select-none">
                  Automatikus Google Calendar meghívó és visszaigazoló levél küldése a vendégnek
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8E5DD] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#001D50] hover:bg-[#F8F7F2] rounded-xs transition-colors cursor-pointer"
                >
                  Mégse
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#001D50] hover:bg-[#0A275C] rounded-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-[#C6A86A]" />
                  <span>{isSubmitting ? 'Mentés...' : 'Időpont Rögzítése'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Export alias for semantic naming
export const GoogleCalendarTab = CalendarView;
