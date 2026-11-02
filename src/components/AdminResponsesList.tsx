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
      {/* Header filter & stats bar */}
      <div className="bg-white border border-[#E8E5DD] p-5 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#001D50]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Keresés név, email vagy telefon alapján..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-xs text-[#001D50] rounded-sm outline-none"
          />
        </div>

        {/* Status segmented control */}
        <div className="flex items-center gap-1 bg-[#F8F7F2] p-1 border border-[#E8E5DD] rounded-sm w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors ${
              statusFilter === 'all'
                ? 'bg-[#001D50] text-[#C6A86A] shadow-xs'
                : 'text-[#001D50]/70 hover:text-[#001D50]'
            }`}
          >
            Összes ({responses.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors ${
              statusFilter === 'pending'
                ? 'bg-[#001D50] text-[#C6A86A] shadow-xs'
                : 'text-[#001D50]/70 hover:text-[#001D50]'
            }`}
          >
            Függőben ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('done')}
            className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors ${
              statusFilter === 'done'
                ? 'bg-[#001D50] text-[#C6A86A] shadow-xs'
                : 'text-[#001D50]/70 hover:text-[#001D50]'
            }`}
          >
            Feldolgozva ({doneCount})
          </button>
        </div>
      </div>

      {/* Responses List */}
      <div className="space-y-4">
        {filteredResponses.length === 0 ? (
          <div className="bg-white border border-[#E8E5DD] p-12 text-center rounded-sm text-sm text-[#001D50]/60 font-sans">
            Nem található a szűrésnek megfelelő konzultációs válasz.
          </div>
        ) : (
          filteredResponses.map((item) => {
            const isExpanded = expandedId === item.id;
            const nonBlankAnswers = extractFilteredAnswers(item.answers);

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-sm transition-all overflow-hidden ${
                  item.is_done
                    ? 'border-[#E8E5DD] opacity-90'
                    : 'border-[#C6A86A]/60 shadow-xs'
                }`}
              >
                {/* Summary Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[#F8F7F2]/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* CUSTOM CHECKED BUTTON: is_done: boolean toggle */}
                    <button
                      type="button"
                      title={item.is_done ? 'Megjelölve feldolgozottként (Kattints a feloldáshoz)' : 'Megjelölés feldolgozottként'}
                      onClick={(e) => handleToggleStatus(item, e)}
                      className={`w-9 h-9 rounded-sm flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                        item.is_done
                          ? 'bg-[#001D50] text-[#C6A86A] border border-[#001D50] shadow-sm'
                          : 'bg-white border-2 border-[#C6A86A] hover:bg-[#C6A86A]/10 text-transparent hover:text-[#C6A86A]'
                      }`}
                    >
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </button>

                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-serif text-base font-bold text-[#001D50]">
                          {item.client_name}
                        </h4>
                        <span
                          className={`text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-xs ${
                            item.is_done
                              ? 'bg-neutral-100 text-neutral-600'
                              : 'bg-[#C6A86A]/15 text-[#001D50] font-semibold'
                          }`}
                        >
                          {item.is_done ? 'Feldolgozva' : 'Új konzultáció'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#001D50]/70 mt-1 font-sans">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-[#C6A86A]" />
                          {item.email}
                        </span>
                        {item.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-[#C6A86A]" />
                            {item.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                          <Clock className="w-3 h-3" />
                          {new Date(item.created_at).toLocaleDateString('hu-HU')} {new Date(item.created_at).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Expand Chevron */}
                  <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                    <button
                      onClick={(e) => openEmailModal(item, e)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#001D50] bg-[#C6A86A]/20 hover:bg-[#C6A86A]/30 border border-[#C6A86A]/60 rounded-xs transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#001D50]" />
                      <span>Gyors Válasz</span>
                    </button>

                    <button
                      type="button"
                      className="p-1.5 text-[#001D50]/60 hover:text-[#001D50]"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Viewer (STRICT FILTER RULE ENFORCED) */}
                {isExpanded && (
                  <div className="border-t border-[#E8E5DD] bg-[#F8F7F2]/40 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C6A86A]">
                        Kitöltött kérdések (Kizárólag a megválaszolt & valós értékek listája)
                      </span>
                      <span className="text-xs text-[#001D50]/60 font-mono">
                        {nonBlankAnswers.length} aktív válaszmező
                      </span>
                    </div>

                    {/* Filtered Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {nonBlankAnswers.map((ans, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-[#E8E5DD] p-4 rounded-xs shadow-2xs"
                        >
                          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#001D50]/60 block mb-1.5">
                            {ans.label}
                          </span>
                          {Array.isArray(ans.value) ? (
                            <ul className="text-xs text-[#001D50] space-y-1 font-sans">
                              {ans.value.map((v, vIdx) => (
                                <li key={vIdx} className="flex items-start gap-1.5">
                                  <span className="text-[#C6A86A] font-bold">›</span>
                                  <span>{v}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-[#001D50] font-sans font-medium whitespace-pre-line">
                              {ans.value}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Admin Notes Section */}
                    {item.admin_notes && (
                      <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-xs">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-amber-900 block mb-1">
                          Belső Szalon Megjegyzések:
                        </span>
                        <p className="text-xs text-amber-950 font-sans whitespace-pre-line">
                          {item.admin_notes}
                        </p>
                      </div>
                    )}

                    {/* Bottom Status bar */}
                    <div className="flex items-center justify-between text-xs text-[#001D50]/60 pt-2 border-t border-[#E8E5DD]/60">
                      <span>
                        Feldolgozási állapot:{' '}
                        <strong className="text-[#001D50]">
                          {item.is_done ? 'Lezárva / Időpont egyeztetve' : 'Nyitott, intézésre vár'}
                        </strong>
                      </span>
                      {item.processed_at && (
                        <span>
                          Lezárás dátuma: {new Date(item.processed_at).toLocaleString('hu-HU')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Email Reply Modal */}
      {selectedResponseForEmail && (
        <div className="fixed inset-0 z-50 bg-[#001D50]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E5DD] max-w-xl w-full p-6 md:p-8 rounded-sm shadow-xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#E8E5DD] pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#C6A86A]" />
                <h3 className="font-serif text-lg font-bold text-[#001D50]">
                  Gyors E-mail Válasz a Vendégnek
                </h3>
              </div>
              <button
                onClick={() => setSelectedResponseForEmail(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
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
                <div className="grid grid-cols-2 gap-3 text-xs text-[#001D50] bg-[#F8F7F2] p-3 rounded-xs font-sans">
                  <div>
                    <span className="text-neutral-400 block">Címzett neve:</span>
                    <strong>{selectedResponseForEmail.client_name}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">E-mail címe:</span>
                    <strong>{selectedResponseForEmail.email}</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#001D50] mb-1">
                    Tárgy mező
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-xs text-[#001D50] rounded-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#001D50] mb-1">
                    Üzenet szövege (Időpont javaslatok & instrukciók)
                  </label>
                  <textarea
                    rows={8}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-xs text-[#001D50] rounded-xs outline-none resize-none font-sans"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E5DD]">
                  <button
                    type="button"
                    onClick={() => setSelectedResponseForEmail(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#001D50] hover:bg-neutral-100 rounded-xs"
                  >
                    Mégse
                  </button>
                  <button
                    type="button"
                    disabled={isSendingEmail}
                    onClick={handleSendEmail}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#001D50] hover:bg-[#0A275C] rounded-xs transition-colors shadow-sm disabled:opacity-60"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C6A86A]" />
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
