/**
 * Linea Studio - TypeScript Strict Type Definitions
 */

export interface LashSetOption {
  id: string;
  name: string;
  style: string;
  description: string;
  imageUrl: string;
}

export interface IntakeAnswers {
  q01_effect: string[];
  q02_selected_sets: string[];
  q03_emphasis_level: number;
  q04_dislikes: string[];
  q04_dislikes_other?: string;
  q05_style: string[];
  q06_makeup_routine?: string;
  q07_has_previous_lashes?: 'Igen' | 'Nem, ez lenne az első alkalom';
  q07_what_liked?: string;
  q07_what_disliked?: string;
  q08_mirror_wishes: string[];
  q08_mirror_custom_text?: string;
}

export interface FormResponseItem {
  id: number;
  client_name: string;
  email: string;
  phone?: string;
  answers: IntakeAnswers;
  is_done: boolean;
  admin_notes?: string;
  created_at: string;
  processed_at?: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: 'Természetes' | 'Elegáns' | 'Volume' | 'Különleges & Wispy';
  image_url: string;
  description?: string;
  sort_order: number;
  is_visible: boolean;
}

export interface CalendarAppointment {
  event_id: string;
  summary: string;
  start_time: string;
  end_time: string;
  client_name: string;
  client_email: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

export interface ServiceDetailItem {
  id: string; // 'muszempilla' | 'szempilla-lifting' | 'szemoldok-laminalas' | 'szemoldok-formazas'
  name: string;
  shortTag: string;
  headline: string;
  heroImage: string;
  galleryImages: string[];
  generalDescription: string;
  processSteps: string[];
  recommendedFor: string[];
  duration: string;
  durability: string;
  aftercare: string[];
  prices: { name: string; price: string; note?: string }[];
}

export interface GoogleReviewItem {
  id: string;
  authorName: string;
  rating: number;
  relativeTime: string;
  text: string;
  serviceMentioned?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  category: string;
  items: FaqItem[];
}

export interface HouseRuleItem {
  title: string;
  description: string;
  iconName: string;
}
