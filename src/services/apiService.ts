/**
 * Linea Studio - API Service Client
 * Handles data mutations, local storage caching, and simulated backend responses.
 */

import { FormResponseItem, PortfolioItem, CalendarAppointment, IntakeAnswers } from '../types';
import { INITIAL_PORTFOLIO, INITIAL_RESPONSES, INITIAL_CALENDAR_EVENTS } from '../data/mockData';

const STORAGE_KEYS = {
  RESPONSES: 'linea_form_responses_v1',
  PORTFOLIO: 'linea_portfolio_v2',
  CALENDAR: 'linea_calendar_v1',
  AUTH_TOKEN: 'linea_admin_token',
};

// Helper to initialize local storage
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const apiService = {
  // ==========================================
  // Form Responses API
  // ==========================================
  async getFormResponses(): Promise<FormResponseItem[]> {
    await new Promise((res) => setTimeout(res, 200));
    return getStored<FormResponseItem[]>(STORAGE_KEYS.RESPONSES, INITIAL_RESPONSES);
  },

  async submitIntakeForm(payload: {
    client_name: string;
    email: string;
    phone?: string;
    answers: IntakeAnswers;
  }): Promise<FormResponseItem> {
    await new Promise((res) => setTimeout(res, 400));
    const current = getStored<FormResponseItem[]>(STORAGE_KEYS.RESPONSES, INITIAL_RESPONSES);
    const newEntry: FormResponseItem = {
      id: Date.now(),
      client_name: payload.client_name,
      email: payload.email,
      phone: payload.phone,
      answers: payload.answers,
      is_done: false,
      created_at: new Date().toISOString(),
    };
    const updated = [newEntry, ...current];
    setStored(STORAGE_KEYS.RESPONSES, updated);
    return newEntry;
  },

  async toggleFormStatus(id: number, is_done: boolean, admin_notes?: string): Promise<FormResponseItem> {
    await new Promise((res) => setTimeout(res, 150));
    const current = getStored<FormResponseItem[]>(STORAGE_KEYS.RESPONSES, INITIAL_RESPONSES);
    const index = current.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('A válasz nem található.');

    const updatedItem: FormResponseItem = {
      ...current[index],
      is_done,
      processed_at: is_done ? new Date().toISOString() : undefined,
      admin_notes: admin_notes !== undefined ? admin_notes : current[index].admin_notes,
    };

    current[index] = updatedItem;
    setStored(STORAGE_KEYS.RESPONSES, current);
    return updatedItem;
  },

  async sendQuickEmailReply(
    formId: number,
    toEmail: string,
    clientName: string,
    subject: string,
    message: string
  ): Promise<{ success: boolean; message: string }> {
    await new Promise((res) => setTimeout(res, 350));
    // Also record note on form
    const current = getStored<FormResponseItem[]>(STORAGE_KEYS.RESPONSES, INITIAL_RESPONSES);
    const index = current.findIndex((item) => item.id === formId);
    if (index !== -1) {
      current[index] = {
        ...current[index],
        admin_notes: (current[index].admin_notes ? current[index].admin_notes + '\n\n' : '') +
          `[E-mail kiküldve ${new Date().toLocaleDateString('hu-HU')}: "${subject}"]`,
      };
      setStored(STORAGE_KEYS.RESPONSES, current);
    }
    return {
      success: true,
      message: `Válaszlevél sikeresen elküldve ide: ${toEmail} (${clientName})`,
    };
  },

  // ==========================================
  // Portfolio API
  // ==========================================
  async getPortfolio(): Promise<PortfolioItem[]> {
    await new Promise((res) => setTimeout(res, 150));
    return getStored<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, INITIAL_PORTFOLIO);
  },

  async addPortfolioImage(data: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem> {
    await new Promise((res) => setTimeout(res, 300));
    const current = getStored<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, INITIAL_PORTFOLIO);
    const newItem: PortfolioItem = {
      id: Date.now(),
      ...data,
    };
    const updated = [newItem, ...current];
    setStored(STORAGE_KEYS.PORTFOLIO, updated);
    return newItem;
  },

  async deletePortfolioImage(id: number): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 200));
    const current = getStored<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, INITIAL_PORTFOLIO);
    const updated = current.filter((item) => item.id !== id);
    setStored(STORAGE_KEYS.PORTFOLIO, updated);
    return true;
  },

  // ==========================================
  // Google Calendar API
  // ==========================================
  async getCalendarEvents(): Promise<CalendarAppointment[]> {
    await new Promise((res) => setTimeout(res, 200));
    return getStored<CalendarAppointment[]>(STORAGE_KEYS.CALENDAR, INITIAL_CALENDAR_EVENTS);
  },

  async createCalendarEvent(eventData: Omit<CalendarAppointment, 'event_id'>): Promise<CalendarAppointment> {
    await new Promise((res) => setTimeout(res, 300));
    const current = getStored<CalendarAppointment[]>(STORAGE_KEYS.CALENDAR, INITIAL_CALENDAR_EVENTS);
    const newEvent: CalendarAppointment = {
      event_id: `evt-${Date.now()}`,
      ...eventData,
    };
    const updated = [newEvent, ...current];
    setStored(STORAGE_KEYS.CALENDAR, updated);
    return newEvent;
  },

  async updateCalendarEvent(eventId: string, updates: Partial<CalendarAppointment>): Promise<CalendarAppointment> {
    await new Promise((res) => setTimeout(res, 250));
    const current = getStored<CalendarAppointment[]>(STORAGE_KEYS.CALENDAR, INITIAL_CALENDAR_EVENTS);
    const index = current.findIndex((evt) => evt.event_id === eventId);
    if (index === -1) throw new Error('Az időpont nem található.');

    const updatedEvent: CalendarAppointment = {
      ...current[index],
      ...updates,
    };
    current[index] = updatedEvent;
    setStored(STORAGE_KEYS.CALENDAR, current);
    return updatedEvent;
  },

  async deleteCalendarEvent(eventId: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 200));
    const current = getStored<CalendarAppointment[]>(STORAGE_KEYS.CALENDAR, INITIAL_CALENDAR_EVENTS);
    const updated = current.filter((evt) => evt.event_id !== eventId);
    setStored(STORAGE_KEYS.CALENDAR, updated);
    return true;
  },
};
