/**
 * Linea Studio - Admin Intake Form Response Viewer
 * STRICT FILTER LOGIC: Renders ONLY non-empty fields and checked boolean flags (true values only).
 * Includes custom `is_done` toggle button and quick email reply modal/drawer.
 */

import React, { useState } from 'react';
import {
  Check,
  CheckCircle,
  Clock,
  Mail,
  Search,
  Filter,
  User,
  Phone,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Send,
  X,
  FileText
} from 'lucide-react';
import { FormResponseItem, IntakeAnswers } from '../types';
import { apiService } from '../services/apiService';

interface AdminResponsesListProps {
  responses: FormResponseItem[];
  onRefresh: () => void;
}

export const AdminResponsesList: React.FC<AdminResponsesListProps> = ({
  responses,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(responses[0]?.id || null);

  // Email Reply Modal State
  const [selectedResponseForEmail, setSelectedResponseForEmail] = useState<FormResponseItem | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);

  // Toggle `is_done` status
  const handleToggleStatus = async (item: FormResponseItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const newStatus = !item.is_done;
      await apiService.toggleFormStatus(item.id, newStatus);
      onRefresh();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Open Quick Email Drawer / Modal
  const openEmailModal = (item: FormResponseItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedResponseForEmail(item);
    setEmailSubject(`Linea Studio - Konzultációs időpont & Személyre szabott javaslat`);
    setEmailBody(
      `Kedves ${item.client_name}!\n\n` +
      `Nagyon köszönöm a konzultációs kérdőív kitöltését. Áttekintettem a stíluspreferenciáidat és a kívánt hatást (${item.answers.q01_effect?.join(', ') || 'természetes/elegáns'}).\n\n` +
      `Szeretettel javaslom számodra a következő időpontokat személyes konzultációra és szettépítésre a szalonban:\n` +
      `- 2026. október 28. (szerda) 10:00\n` +
      `- 2026. október 29. (csütörtök) 14:30\n\n` +
      `Kérlek, jelezz vissza, melyik lenne alkalmas számodra!\n\n` +
      `Üdvözlettel,\nLinea Studio Budapest`
    );
    setEmailSuccessMsg(null);
  };

  const handleSendEmail = async () => {
    if (!selectedResponseForEmail) return;
    try {
      setIsSendingEmail(true);
      const res = await apiService.sendQuickEmailReply(
        selectedResponseForEmail.id,
        selectedResponseForEmail.email,
        selectedResponseForEmail.client_name,
        emailSubject,
        emailBody
      );
      setEmailSuccessMsg(res.message);
      setTimeout(() => {
        setSelectedResponseForEmail(null);
        setEmailSuccessMsg(null);
        onRefresh();
      }, 1800);
    } catch (err) {
      console.error('Failed to send email:', err);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Filter list
  const filteredResponses = responses.filter((item) => {
    const matchesSearch =
      item.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.phone && item.phone.includes(searchQuery));

    if (!matchesSearch) return false;
    if (statusFilter === 'pending') return !item.is_done;
    if (statusFilter === 'done') return item.is_done;
    return true;
  });

  const pendingCount = responses.filter((r) => !r.is_done).length;
  const doneCount = responses.filter((r) => r.is_done).length;

  /**
   * STRICT FILTER HELPER:
   * Extracts ONLY non-empty values and truthy flags from the client's answers object.
   */
  const extractFilteredAnswers = (answers: IntakeAnswers) => {
    const entries: { label: string; value: string | string[] }[] = [];

    // 01. Hatás
    if (answers.q01_effect && answers.q01_effect.length > 0) {
      entries.push({ label: '01. Kívánt hatás', value: answers.q01_effect });
    }

    // 02. Kiválasztott szettek
    if (answers.q02_selected_sets && answers.q02_selected_sets.length > 0) {
      entries.push({ label: '02. Legközelebb álló szettek', value: answers.q02_selected_sets });
    }

    // 03. Hangsúlyosság
    if (answers.q03_emphasis_level) {
      entries.push({
        label: '03. Hangsúlyosság szintje',
        value: `${answers.q03_emphasis_level} / 5 (${
          answers.q03_emphasis_level <= 2
            ? 'visszafogott'
            : answers.q03_emphasis_level === 3
            ? 'közepes'
            : 'hangsúlyos'
        })`,
      });
    }

    // 04. Nemkívánt elemek
    if (answers.q04_dislikes && answers.q04_dislikes.length > 0) {
      entries.push({ label: '04. Amit nagyon nem szeretne', value: answers.q04_dislikes });
    }
    if (answers.q04_dislikes_other && answers.q04_dislikes_other.trim().length > 0) {
      entries.push({ label: '04. Egyéb kizáró tényező', value: answers.q04_dislikes_other.trim() });
    }

    // 05. Stílus
    if (answers.q05_style && answers.q05_style.length > 0) {
      entries.push({ label: '05. Vendég stílusa', value: answers.q05_style });
    }

    // 06. Hétköznapi smink
    if (answers.q06_makeup_routine && answers.q06_makeup_routine.trim().length > 0) {
      entries.push({ label: '06. Hétköznapi smink', value: answers.q06_makeup_routine });
    }

    // 07. Korábbi szempilla
    if (answers.q07_has_previous_lashes) {
      entries.push({ label: '07. Volt már műszempillája?', value: answers.q07_has_previous_lashes });
    }
    if (answers.q07_what_liked && answers.q07_what_liked.trim().length > 0) {
      entries.push({ label: '07. Amit különösen szeretett benne', value: answers.q07_what_liked.trim() });
    }
    if (answers.q07_what_disliked && answers.q07_what_disliked.trim().length > 0) {
      entries.push({ label: '07. Amit nagyon nem szeretett benne', value: answers.q07_what_disliked.trim() });
    }

    // 08. Tükörkép elvárások
    if (answers.q08_mirror_wishes && answers.q08_mirror_wishes.length > 0) {
      entries.push({ label: '08. Tükörkép kívánságok', value: answers.q08_mirror_wishes });
    }
    if (answers.q08_mirror_custom_text && answers.q08_mirror_custom_text.trim().length > 0) {
      entries.push({ label: '08. Szabadszavas tükörkép leírás', value: answers.q08_mirror_custom_text.trim() });
    }

    return entries;
  };

  return (
    <div className="space-y-6">
      {/* MOBIL-OPTIMALIZÁLÁS: 16px-es mobil input méret (zoom tiltása), min. 44px érintési felületek */}
      <div className="bg-white/95 backdrop-blur-xs border border-[#E8E5DD] p-3 sm:p-4 rounded-2xl sm:rounded-full shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        {/* Search Input pill - mobilon 16px (text-base) az automatikus zoom megelőzésére */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#C6A86A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Keresés név, email vagy telefon alapján..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-11 py-2.5 sm:py-2 text-base md:text-xs font-medium text-[#001D50] placeholder:text-[#001D50]/45 bg-[#F8F7F2]/60 hover:bg-white focus:bg-white border border-[#E8E5DD] hover:border-[#C6A86A]/70 focus:border-[#C6A86A] rounded-full shadow-2xs hover:shadow-xs focus:ring-2 focus:ring-[#C6A86A]/20 transition-all outline-none min-h-[44px] sm:min-h-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#001D50]/40 hover:text-[#001D50] rounded-full hover:bg-[#F0EDE5] transition-colors cursor-pointer"
              title="Keresés törlése"
              aria-label="Keresés törlése"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status segmented control & clear button - MOBIL-OPTIMALIZÁLÁS: min. 44px érintőfelület ujjbegyes nyomáshoz, rugalmas térközökkel */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center justify-between gap-1 p-1 bg-[#F0EDE5] rounded-full border border-[#E8E5DD] shadow-2xs w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`flex-[0.85] sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 text-[11px] sm:text-xs font-semibold normal-case sm:uppercase tracking-tight sm:tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-[#001D50] text-[#DFC285] shadow-xs'
                  : 'text-[#001D50]/70 hover:text-[#001D50] hover:bg-white/60'
              }`}
            >
              <span>Összes</span>
              <span
                className={`px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold rounded-full min-w-[16px] text-center shrink-0 ${
                  statusFilter === 'all'
                    ? 'bg-[#C6A86A] text-[#001D50]'
                    : 'bg-[#001D50]/10 text-[#001D50]'
                }`}
              >
                {responses.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 text-[11px] sm:text-xs font-semibold normal-case sm:uppercase tracking-tight sm:tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'pending'
                  ? 'bg-[#001D50] text-[#DFC285] shadow-xs'
                  : 'text-[#001D50]/70 hover:text-[#001D50] hover:bg-white/60'
              }`}
            >
              <span>Függőben</span>
              <span
                className={`px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold rounded-full min-w-[16px] text-center shrink-0 ${
                  statusFilter === 'pending'
                    ? 'bg-[#C6A86A] text-[#001D50]'
                    : 'bg-[#001D50]/10 text-[#001D50]'
                }`}
              >
                {pendingCount}
              </span>
            </button>

            {/* FOCUSED TARGET ELEMENT: Feldolgozva gomb - mobilon flex-[1.35] aránnyal, hogy a leghosszabb szó és a számláló kényelmesen elférjen */}
            <button
              type="button"
              onClick={() => setStatusFilter('done')}
              className={`flex-[1.35] sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 text-[11px] sm:text-xs font-semibold normal-case sm:uppercase tracking-tight sm:tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'done'
                  ? 'bg-[#001D50] text-[#DFC285] shadow-xs'
                  : 'text-[#001D50]/70 hover:text-[#001D50] hover:bg-white/60'
              }`}
            >
              <span>Feldolgozva</span>
              <span
                className={`px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold rounded-full min-w-[16px] text-center shrink-0 ${
                  statusFilter === 'done'
                    ? 'bg-[#C6A86A] text-[#001D50]'
                    : 'bg-[#001D50]/10 text-[#001D50]'
                }`}
              >
                {doneCount}
              </span>
            </button>
          </div>

          {(searchQuery || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] text-xs font-semibold uppercase tracking-wider text-[#001D50] hover:text-[#C6A86A] bg-white border border-[#E8E5DD] hover:border-[#C6A86A] rounded-full shadow-2xs hover:shadow-xs transition-colors cursor-pointer shrink-0 w-full sm:w-auto"
              title="Szűrők alaphelyzetbe"
            >
              <X className="w-4 h-4 text-[#C6A86A]" />
              <span>Szűrők törlése</span>
            </button>
          )}
        </div>
      </div>

      {/* Responses List */}
      <div className="space-y-4">
        {filteredResponses.length === 0 ? (
          <div className="bg-white border border-[#E8E5DD] p-12 text-center rounded-2xl text-sm text-[#001D50]/60 font-sans shadow-2xs">
            Nem található a szűrésnek megfelelő konzultációs válasz.
          </div>
        ) : (
          filteredResponses.map((item) => {
            const isExpanded = expandedId === item.id;
            const nonBlankAnswers = extractFilteredAnswers(item.answers);

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl transition-all overflow-hidden ${
                  item.is_done
                    ? 'border-[#E8E5DD] opacity-90 shadow-2xs'
                    : 'border-[#C6A86A]/70 shadow-xs'
                }`}
              >
                {/* MOBIL-OPTIMALIZÁLÁS (2., 3., 4. Irányelv): Kártya fejléc és adatsorok.
                    Minden adat egy sorban marad (whitespace-nowrap), a telefonszám sosem törik meg! */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-4 sm:p-5 cursor-pointer hover:bg-[#F8F7F2]/50 transition-colors"
                >
                  {/* Felső sor: Pipa gomb (min 44x44px), Név és Státusz jelvény, Akciók */}
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* MOBIL-OPTIMALIZÁLÁS (3. Irányelv): Min. 44x44px kényelmes touch target gomb */}
                      <button
                        type="button"
                        title={item.is_done ? 'Megjelölve feldolgozottként (Kattints a feloldáshoz)' : 'Megjelölés feldolgozottként'}
                        onClick={(e) => handleToggleStatus(item, e)}
                        className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${
                          item.is_done
                            ? 'bg-[#001D50] text-[#C6A86A] border border-[#001D50]'
                            : 'bg-white border-2 border-[#C6A86A] hover:bg-[#C6A86A]/10 text-neutral-300 hover:text-[#C6A86A]'
                        }`}
                        aria-label={item.is_done ? 'Lezárt konzultáció' : 'Függő konzultáció'}
                      >
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      </button>

                      {/* Név, státusz jelvény és beküldési időpont */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-serif text-base sm:text-lg font-bold text-[#001D50] truncate">
                            {item.client_name}
                          </h4>
                          <span
                            className={`text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
                              item.is_done
                                ? 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                                : 'bg-[#C6A86A]/20 text-[#001D50] border border-[#C6A86A]/50'
                            }`}
                          >
                            {item.is_done ? 'Feldolgozva' : 'Új konzultáció'}
                          </span>
                        </div>

                        {/* Beküldés időpontja: Tiszta, 1 soros whitespace-nowrap megjelenés */}
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono mt-0.5 whitespace-nowrap">
                          <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span>
                            {new Date(item.created_at).toLocaleDateString('hu-HU')} • {new Date(item.created_at).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Akciók & Kibontó nyíl: Min. 44px magasságú érintőfelületek */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => openEmailModal(item, e)}
                        className="min-h-[44px] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#001D50] hover:text-[#C6A86A] bg-white border border-[#E8E5DD] hover:border-[#C6A86A] rounded-full shadow-2xs hover:shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        title="Gyors válasz küldése emailben"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#C6A86A] shrink-0" />
                        <span className="hidden xs:inline sm:inline">Válasz</span>
                      </button>

                      <button
                        type="button"
                        className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#001D50]/60 hover:text-[#001D50] rounded-full hover:bg-[#F0EDE5] transition-colors cursor-pointer"
                        aria-label={isExpanded ? 'Részletek összecsukása' : 'Részletek kibontása'}
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* MOBIL-OPTIMALIZÁLÁS: Kapcsolati sáv - Telefonszám és E-mail cím MINDIG EGY SORBAN, nem törik szét! */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 mt-3 border-t border-[#E8E5DD]/70">
                    {/* Telefonszám doboz - 'whitespace-nowrap' megakadályozza a szám több sorba törését mobilon */}
                    {item.phone && (
                      <a
                        href={`tel:${item.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-between sm:justify-start gap-2 px-3 py-2 bg-[#F8F7F2] hover:bg-[#F0EDE5] border border-[#E8E5DD]/80 hover:border-[#C6A86A]/60 rounded-xl transition-all group min-w-0"
                        title="Kattints a híváshoz"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#C6A86A] shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                            <Phone className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold shrink-0">Tel:</span>
                          <span className="text-xs font-semibold font-mono text-[#001D50] group-hover:text-[#C6A86A] transition-colors whitespace-nowrap truncate">
                            {item.phone}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#C6A86A] font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline shrink-0">
                          Hívás
                        </span>
                      </a>
                    )}

                    {/* E-mail cím doboz - tisztán egy sorban, truncate levágással ha túl hosszú, azonnal kattintható */}
                    <a
                      href={`mailto:${item.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-between sm:justify-start gap-2 px-3 py-2 bg-[#F8F7F2] hover:bg-[#F0EDE5] border border-[#E8E5DD]/80 hover:border-[#C6A86A]/60 rounded-xl transition-all group min-w-0"
                      title="Kattints az e-mail küldéséhez"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#C6A86A] shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold shrink-0">Email:</span>
                        <span className="text-xs font-medium text-[#001D50] group-hover:text-[#C6A86A] transition-colors truncate whitespace-nowrap">
                          {item.email}
                        </span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Expanded Detailed Viewer (STRICT FILTER RULE ENFORCED) */}
                {isExpanded && (
                  <div className="border-t border-[#E8E5DD] bg-[#F8F7F2]/40 p-4 sm:p-6 space-y-5 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C6A86A]">
                        Kitöltött kérdések (Kizárólag a megválaszolt & valós értékek listája)
                      </span>
                      <span className="text-xs text-[#001D50]/60 font-mono">
                        {nonBlankAnswers.length} aktív válaszmező
                      </span>
                    </div>

                    {/* Filtered Grid - MOBIL-OPTIMALIZÁLÁS: Egységes, szellős válaszkártyák */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {nonBlankAnswers.map((ans, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-[#E8E5DD] p-3.5 sm:p-4 rounded-xl shadow-2xs hover:border-[#C6A86A]/40 transition-colors"
                        >
                          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#C6A86A] block mb-1.5">
                            {ans.label}
                          </span>
                          {Array.isArray(ans.value) ? (
                            <ul className="text-xs sm:text-sm text-[#001D50] space-y-1.5 font-sans">
                              {ans.value.map((v, vIdx) => (
                                <li key={vIdx} className="flex items-start gap-2">
                                  <span className="text-[#C6A86A] font-bold text-sm leading-none shrink-0 mt-0.5">›</span>
                                  <span className="leading-relaxed">{v}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs sm:text-sm text-[#001D50] font-sans font-medium leading-relaxed whitespace-pre-line break-words">
                              {ans.value}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Admin Notes Section */}
                    {item.admin_notes && (
                      <div className="bg-amber-50/70 border border-amber-200/90 p-4 rounded-xl shadow-2xs">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-amber-900 block mb-1">
                          Belső Szalon Megjegyzések:
                        </span>
                        <p className="text-xs sm:text-sm text-amber-950 font-sans leading-relaxed whitespace-pre-line">
                          {item.admin_notes}
                        </p>
                      </div>
                    )}

                    {/* Bottom Status bar & Quick action buttons inside expanded card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E8E5DD]/70">
                      <div className="text-xs text-[#001D50]/70">
                        <span>
                          Feldolgozási állapot:{' '}
                          <strong className="text-[#001D50]">
                            {item.is_done ? 'Lezárva / Időpont egyeztetve' : 'Nyitott, intézésre vár'}
                          </strong>
                        </span>
                        {item.processed_at && (
                          <div className="text-[11px] text-neutral-400 font-mono mt-0.5 whitespace-nowrap">
                            Lezárás dátuma: {new Date(item.processed_at).toLocaleString('hu-HU')}
                          </div>
                        )}
                      </div>

                      {/* Gyors státuszmódosítás és válaszíró gombok közvetlenül a kártya alján is */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleToggleStatus(item, e)}
                          className={`min-h-[44px] px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 ${
                            item.is_done
                              ? 'bg-white text-neutral-700 hover:text-red-700 border border-[#E8E5DD] hover:border-red-300 hover:bg-red-50/40'
                              : 'bg-[#001D50] text-[#DFC285] hover:bg-[#0A275C] border border-[#001D50]'
                          }`}
                        >
                          <Check className="w-4 h-4 text-[#C6A86A]" />
                          <span>{item.is_done ? 'Újranyitás Függőként' : 'Megjelölés Készként'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => openEmailModal(item, e)}
                          className="min-h-[44px] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#001D50] hover:text-[#C6A86A] bg-white border border-[#E8E5DD] hover:border-[#C6A86A] rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                        >
                          <Mail className="w-4 h-4 text-[#C6A86A]" />
                          <span>E-mail Küldése</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Email Reply Modal - MOBIL-OPTIMALIZÁLÁS: Alsó felugró lap (Bottom Sheet) mobilon, 92vh magassággal, 16px inputokkal */}
      {selectedResponseForEmail && (
        <div className="fixed inset-0 z-50 bg-[#001D50]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white border-t sm:border border-[#E8E5DD] w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl p-5 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4">
            {/* Mobile drag indicator bar */}
            <div className="w-12 h-1.5 bg-[#001D50]/20 rounded-full mx-auto mb-2 sm:hidden" />

            <div className="flex items-center justify-between border-b border-[#E8E5DD] pb-3 mb-2">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#C6A86A]" />
                <h3 className="font-serif text-lg font-bold text-[#001D50]">
                  Gyors E-mail Válasz a Vendégnek
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedResponseForEmail(null)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-[#F0EDE5] transition-colors cursor-pointer"
                aria-label="Ablak bezárása"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {emailSuccessMsg ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-[#C6A86A] mx-auto animate-bounce" />
                <p className="font-serif text-lg font-bold text-[#001D50]">
                  E-mail sikeresen továbbítva!
                </p>
                <p className="text-xs text-[#001D50]/70 font-sans">{emailSuccessMsg}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* MOBIL-OPTIMALIZÁLÁS: Címzett adatok tiszta, egysoros megjelenítése (whitespace-nowrap) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs text-[#001D50] bg-[#F8F7F2] p-3.5 rounded-xl font-sans border border-[#E8E5DD]">
                  <div className="min-w-0">
                    <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Címzett neve:</span>
                    <strong className="text-sm sm:text-xs truncate block">{selectedResponseForEmail.client_name}</strong>
                  </div>
                  <div className="min-w-0">
                    <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">E-mail címe:</span>
                    <strong className="text-sm sm:text-xs font-mono truncate block whitespace-nowrap">{selectedResponseForEmail.email}</strong>
                  </div>
                  {selectedResponseForEmail.phone && (
                    <div className="min-w-0">
                      <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Telefonszám:</span>
                      <strong className="text-sm sm:text-xs font-mono whitespace-nowrap block">{selectedResponseForEmail.phone}</strong>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#001D50] mb-1.5">
                    Tárgy mező
                  </label>
                  {/* MOBIL-OPTIMALIZÁLÁS: text-base (16px) mobilon az automatikus zoom elkerülésére */}
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3.5 py-3 text-base md:text-xs text-[#001D50] bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] rounded-xl outline-none transition-colors min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#001D50] mb-1.5">
                    Üzenet szövege (Időpont javaslatok & instrukciók)
                  </label>
                  {/* MOBIL-OPTIMALIZÁLÁS: text-base (16px) mobilon */}
                  <textarea
                    rows={6}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full p-3.5 text-base md:text-xs text-[#001D50] bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] rounded-xl outline-none resize-none font-sans"
                  />
                </div>

                {/* MOBIL-OPTIMALIZÁLÁS: egymás alá rendezett min. 44px-es gombok mobilon */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-[#E8E5DD]">
                  <button
                    type="button"
                    onClick={() => setSelectedResponseForEmail(null)}
                    className="w-full sm:w-auto px-5 py-3 min-h-[44px] text-xs font-semibold uppercase tracking-wider text-[#001D50] hover:bg-[#F8F7F2] rounded-full transition-colors cursor-pointer text-center"
                  >
                    Mégse
                  </button>
                  <button
                    type="button"
                    disabled={isSendingEmail}
                    onClick={handleSendEmail}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-xs font-semibold uppercase tracking-wider text-white bg-[#001D50] hover:bg-[#0A275C] rounded-full transition-colors shadow-md disabled:opacity-60 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#C6A86A]" />
                    <span>{isSendingEmail ? 'Küldés...' : 'E-mail Elküldése'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
