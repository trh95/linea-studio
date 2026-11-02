/**
 * Linea Studio - Haute Couture Client Consultation & Anamnesis Form
 * Faithfully matches the exact 8-question dark luxury mobile & desktop aesthetic
 * shown in the uploaded client consultation screenshots.
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Mail,
  Heart,
  Send,
  AlertCircle,
  Eye,
  Check,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { LASH_SET_OPTIONS } from '../data/mockData';
import { IntakeAnswers, LashSetOption } from '../types';
import { apiService } from '../services/apiService';

interface IntakeFormProps {
  onSuccessNavigate?: () => void;
  onViewAdmin?: () => void;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({ onSuccessNavigate, onViewAdmin }) => {
  // Step indicator: 0 = Editorial Intro, 1 = Kapcsolat & Q1-Q3, 2 = Q4-Q6, 3 = Q7-Q8 & Beküldés
  const [activeStep, setActiveStep] = useState<number>(0);

  // Client info
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // 8 Questions state
  const [answers, setAnswers] = useState<IntakeAnswers>({
    q01_effect: [],
    q02_selected_sets: [],
    q03_emphasis_level: 3,
    q04_dislikes: [],
    q04_dislikes_other: '',
    q05_style: [],
    q06_makeup_routine: 'Minimálisan',
    q07_has_previous_lashes: 'Nem, ez lenne az első alkalom',
    q07_what_liked: '',
    q07_what_disliked: '',
    q08_mirror_wishes: [],
    q08_mirror_custom_text: '',
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<LashSetOption | null>(null);

  // Multi-select toggle helpers
  const toggleArrayItem = (key: keyof IntakeAnswers, item: string) => {
    setAnswers((prev) => {
      const currentList = (prev[key] as string[]) || [];
      const exists = currentList.includes(item);
      return {
        ...prev,
        [key]: exists ? currentList.filter((i) => i !== item) : [...currentList, item],
      };
    });
  };

  const handleNextStep = () => {
    setErrorMsg(null);
    if (activeStep === 1) {
      if (!clientName.trim()) {
        setErrorMsg('Kérjük, add meg a nevedet (Hogyan szólíthatlak?).');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Kérjük, adj meg egy érvényes e-mail címet a kapcsolattartáshoz.');
        return;
      }
    }
    setActiveStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!acceptTerms) {
      setErrorMsg('A beküldéshez kérjük, fogadd el az Adatkezelési Tájékoztatót és az ÁSZF-et.');
      return;
    }

    try {
      setIsSubmitting(true);
      await apiService.submitIntakeForm({
        client_name: clientName,
        email,
        phone,
        answers,
      });
      setSubmittedSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Hiba történt a beküldéskor.';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedSuccess) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-[#00102B] via-[#000E26] to-[#001D50]">
        <div className="max-w-2xl w-full bg-[#001D50]/90 border border-[#C6A86A]/40 p-10 md:p-14 text-center rounded-sm shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="w-20 h-20 bg-[#C6A86A]/15 text-[#C6A86A] border border-[#C6A86A]/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-[11px] uppercase tracking-[0.35em] text-[#C6A86A] font-semibold block mb-2 font-sans">
            Személyre szabott konzultáció rögzítve
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Köszönjük a válaszaidat!
          </h2>

          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-lg mx-auto mb-8 font-sans">
            Kedves <strong className="text-[#DFC99E]">{clientName}</strong>! A kitöltött konzultációs ívedet megkaptuk. 
            Elküldtünk egy visszaigazoló levelet a(z) <span className="underline decoration-[#C6A86A] text-white font-medium">{email}</span> címre.
          </p>

          <div className="bg-[#001438]/80 border border-[#C6A86A]/30 p-6 text-left rounded-sm mb-8 space-y-3 font-sans">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C6A86A] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>A következő lépések:</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              1. Stylistunk elemzi az arc- és szemformádhoz választott szetteket ({answers.q02_selected_sets.length > 0 ? answers.q02_selected_sets.join(', ') : 'Természetes/Volume'}).
            </p>
            <p className="text-xs text-white/80 leading-relaxed">
              2. 24 órán belül megkapod a személyre szabott styling ajánlatunkat és a szabad időpontokat.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {onSuccessNavigate && (
              <button
                onClick={onSuccessNavigate}
                className="w-full sm:w-auto px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#001D50] bg-gradient-to-r from-[#DFC99E] to-[#C6A86A] hover:brightness-110 transition-all rounded-xs shadow-md cursor-pointer"
              >
                Vissza a Főoldalra
              </button>
            )}
            {onViewAdmin && (
              <button
                onClick={onViewAdmin}
                className="w-full sm:w-auto px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white/90 bg-white/10 hover:bg-white/15 border border-[#C6A86A]/40 transition-colors rounded-xs cursor-pointer"
              >
                Megtekintés az Adminban
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000E26] via-[#001438] to-[#000B1F] text-white py-8 sm:py-12 px-3 sm:px-6">
      {/* Step 0: Editorial Intro - matches kerdoiv1_7fcdb2de.jfif */}
      {activeStep === 0 && (
        <div className="max-w-4xl mx-auto bg-[#001844]/90 border border-[#C6A86A]/35 p-5 sm:p-10 lg:p-12 rounded-sm shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
            {/* Left column: Text content & Action button */}
            <div className="md:col-span-7 text-left space-y-4 sm:space-y-5">

              <h1 className="font-serif text-2xl sm:text-4xl lg:text-[40px] font-bold text-white tracking-wide leading-tight">
                Milyen szempilla <br />
                <span className="font-script text-[#C6A86A] text-4xl sm:text-6xl font-normal">
                  illik hozzád?
                </span>
              </h1>

              <div className="w-16 h-px bg-gradient-to-r from-[#C6A86A] to-transparent" />

              <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed font-sans">
                Ez a rövid teszt nem helyettesíti a személyes konzultációt. Arra szolgál, hogy egy kicsit közelebb kerüljünk ahhoz, amit elképzeltél, és könnyebben megértsük egymást.
              </p>

              <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed font-sans">
                Hiszen ugyanaz a szett két különböző emberen nem fog ugyanúgy mutatni. A szemforma, a természetes pillák, az adottságok és az egyéni stílus mind befolyásolják, milyen végeredmény lesz igazán harmonikus.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setActiveStep(1)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#001D50] bg-gradient-to-r from-[#DFC99E] via-[#C6A86A] to-[#A98A4D] hover:brightness-110 transition-all shadow-lg rounded-xs cursor-pointer font-sans font-bold"
                >
                  <span>Kezdjük?</span>
                  <Heart className="w-4 h-4 fill-current text-[#001D50]" />
                </button>
              </div>
            </div>

            {/* Right column: 4:3 Portrait Image */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-xs md:max-w-none aspect-[3/4] rounded-sm overflow-hidden border border-[#C6A86A]/40 shadow-2xl relative group">
                <img
                  src="/assets/aistudio/konzultacio.png"
                  alt="Linea Studio Műszempilla Styling"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001438]/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-center pointer-events-none">
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Questionnaire Steps (1, 2, 3) */}
      {activeStep > 0 && (
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between text-[11px] sm:text-xs uppercase tracking-widest text-white/60 mb-2 font-mono">
              <span className="text-[#C6A86A] font-semibold">
                {activeStep === 1 && '1/3. Lépés: Kapcsolat & Hatás'}
                {activeStep === 2 && '2/3. Lépés: Stílus & Preferenciák'}
                {activeStep === 3 && '3/3. Lépés: Tapasztalat & Kívánságok'}
              </span>
              <span>{Math.round((activeStep / 3) * 100)}% KÉSZ</span>
            </div>
            {/* Custom Gold Progress Bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C6A86A] to-[#DFC99E] transition-all duration-500 rounded-full"
                style={{ width: `${(activeStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#001844]/90 border border-[#C6A86A]/35 p-4 sm:p-8 md:p-12 rounded-sm shadow-2xl backdrop-blur-md">
            {errorMsg && (
              <div className="mb-6 sm:mb-8 p-3.5 sm:p-4 bg-red-950/70 border border-red-500/60 text-red-200 text-xs flex items-center gap-3 rounded-xs font-sans">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: Kapcsolattartási adatok, Q01, Q02, Q03 */}
            {activeStep === 1 && (
              <div className="space-y-12">
                {/* Kapcsolattartási adatok (kerdoiv1 & kerdoiv2) */}
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-1">
                    Kapcsolattartási adatok
                  </h3>
                  <p className="text-xs text-white/70 mb-6 font-sans">
                    Az itt megadott e-mail-címen kereslek a konzultáció további egyeztetésével kapcsolatban. 🤍
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#DFC99E] mb-2 font-sans">
                        Hogyan szólíthatlak? *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Pl. Kovács Anna"
                        className="w-full px-4 py-3 bg-[#00102E] border border-white/15 focus:border-[#C6A86A] text-sm text-white placeholder-white/30 rounded-xs outline-none transition-all font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#DFC99E] mb-2 font-sans">
                        E-mail-cím *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="anna@pelda.hu"
                        className="w-full px-4 py-3 bg-[#00102E] border border-white/15 focus:border-[#C6A86A] text-sm text-white placeholder-white/30 rounded-xs outline-none transition-all font-sans"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#DFC99E] mb-2 font-sans">
                        Telefonszám (opcionális, időpont-egyeztetéshez)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+36 30 123 4567"
                        className="w-full px-4 py-3 bg-[#00102E] border border-white/15 focus:border-[#C6A86A] text-sm text-white placeholder-white/30 rounded-xs outline-none transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* 01. Milyen hatást szeretnél elérni? (kerdoiv2) */}
                <div className="border-t border-white/10 pt-10">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A86A] font-semibold block mb-1">
                    01. Kérdés
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-4">
                    Milyen hatást szeretnél elérni?
                  </h3>

                  <div className="space-y-3 font-sans">
                    {[
                      'Természetes, visszafogott hatást szeretnék',
                      'Elegáns, látható, de nem túlzó hatást szeretnék',
                      'Dúsabb, hangsúlyosabb hatást szeretnék',
                      'Látványos, karakteres szettet szeretnék',
                      'Nem tudom pontosan, ebben szeretném a segítségedet',
                    ].map((option) => {
                      const isChecked = answers.q01_effect.includes(option);
                      return (
                        <div
                          key={option}
                          onClick={() => toggleArrayItem('q01_effect', option)}
                          className={`flex items-center gap-3.5 p-4 border rounded-xs cursor-pointer transition-all ${
                            isChecked
                              ? 'border-[#C6A86A] bg-[#C6A86A]/15 text-white font-medium shadow-sm'
                              : 'border-white/10 bg-[#00102E]/60 hover:border-[#C6A86A]/40 text-white/80'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors shrink-0 ${
                              isChecked
                                ? 'bg-[#C6A86A] border-[#C6A86A] text-[#001D50]'
                                : 'border-white/40 bg-transparent'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-sm">{option}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 02. Melyik szett áll hozzád a legközelebb? (kerdoiv3) */}
                <div className="border-t border-white/10 pt-10">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A86A] font-semibold">
                      02. Kérdés
                    </span>
                    <span className="text-xs text-white/50 font-mono">Több képet is választhatsz</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
                    Melyik szett áll hozzád a legközelebb?
                  </h3>
                  <p className="text-xs text-white/70 mb-6 font-sans">
                    Itt kizárólag saját munkafotók szerepelnek, különböző sűrűségű szettekkel.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {LASH_SET_OPTIONS.map((item) => {
                      const isSelected = answers.q02_selected_sets.includes(item.name);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleArrayItem('q02_selected_sets', item.name)}
                          className={`group border rounded-xs overflow-hidden cursor-pointer transition-all relative ${
                            isSelected
                              ? 'border-[#C6A86A] ring-2 ring-[#C6A86A] bg-[#001D50]'
                              : 'border-white/10 hover:border-[#C6A86A]/50 bg-[#00102E]'
                          }`}
                        >
                          <div className="h-44 overflow-hidden relative">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#000E26]/90 via-transparent to-transparent" />
                            {isSelected && (
                              <div className="absolute top-2.5 right-2.5 bg-[#C6A86A] text-[#001D50] p-1 rounded-full shadow-md">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <div className="p-4 font-sans">
                            <h4 className="font-serif text-sm font-bold text-white">{item.name}</h4>
                            <span className="text-[10px] uppercase tracking-wider text-[#C6A86A] font-semibold block mt-0.5">
                              {item.style}
                            </span>
                            <p className="text-[11px] text-white/70 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 03. Mennyire szeretnéd, hogy hangsúlyos legyen? (kerdoiv3) */}
                <div className="border-t border-white/10 pt-10">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A86A] font-semibold block mb-1">
                    03. Kérdés
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
                    Mennyire szeretnéd, hogy hangsúlyos legyen?
                  </h3>
                  <div className="flex items-center justify-between text-xs text-white/60 mb-5 font-sans">
                    <span>1 — visszafogott</span>
                    <span>5 — hangsúlyos</span>
                  </div>

                  {/* Tactile 1-5 Scale */}
                  <div className="grid grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5].map((num) => {
                      const isSelected = answers.q03_emphasis_level === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, q03_emphasis_level: num }))}
                          className={`py-4 text-center font-bold text-sm md:text-base rounded-xs border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#C6A86A] bg-gradient-to-r from-[#DFC99E] to-[#C6A86A] text-[#001D50] shadow-lg scale-102'
                              : 'border-white/15 bg-[#00102E] text-white hover:border-[#C6A86A]/50'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Q04, Q05, Q06 */}
            {activeStep === 2 && (
              <div className="space-y-12">
                {/* 04. Mi az, amit nagyon nem szeretnél? (kerdoiv4) */}
                <div>
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A86A] font-semibold block mb-1">
                    04. Kérdés
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
                    Mi az, amit nagyon nem szeretnél?
                  </h3>
                  <p className="text-xs text-white/70 mb-5 font-sans">
                    Több választ is megjelölhetsz.
                  </p>

                  <div className="space-y-3 font-sans">
                    {[
                      'Nem szeretném, ha feltűnő lenne, hogy műszempillám van.',
                      'Nem szeretnék túl hosszú pillákat.',
                      'Nem szeretnék túl dús hatást.',
                      'Nem szeretném, ha a szemem külső széle lenne hangsúlyos.',
                      'Nem szeretnék túl nyitott, „babás” tekintetet.',
                      'Nem szeretnék túl művi hatást.',
                      'Nem szeretném, ha nagyon eltérne a megszokott megjelenésemtől.',
                    ].map((option) => {
                      const isChecked = answers.q04_dislikes.includes(option);
                      return (
                        <div
                          key={option}
                          onClick={() => toggleArrayItem('q04_dislikes', option)}
                          className={`flex items-center gap-3.5 p-4 border rounded-xs cursor-pointer transition-all ${
                            isChecked
                              ? 'border-[#C6A86A] bg-[#C6A86A]/15 text-white font-medium'
                              : 'border-white/10 bg-[#00102E]/60 hover:border-[#C6A86A]/40 text-white/80'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors shrink-0 ${
                              isChecked
                                ? 'bg-[#C6A86A] border-[#C6A86A] text-[#001D50]'
                                : 'border-white/40 bg-transparent'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-sm">{option}</span>
                        </div>
                      );
                    })}

                    <div className="pt-3">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#DFC99E] mb-2 font-sans">
                        Egyéb nemkívánt dolog:
                      </label>
                      <input
                        type="text"
                        value={answers.q04_dislikes_other || ''}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, q04_dislikes_other: e.target.value }))
                        }
                        placeholder="Írd le, ha van egyéb egyedi szempont..."
                        className="w-full px-4 py-3 bg-[#00102E] border border-white/15 focus:border-[#C6A86A] text-sm text-white placeholder-white/30 rounded-xs outline-none transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* 05. Milyen a stílusod? (kerdoiv5) */}
                <div className="border-t border-white/10 pt-10">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A86A] font-semibold block mb-1">
                    05. Kérdés
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
                    Milyen a stílusod?
                  </h3>
                  <p className="text-xs text-white/70 mb-5 font-sans">
                    Több választ is megjelölhetsz.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                    {[
                      'Természetes, visszafogott',
                      'Elegáns, letisztult',
                      'Modern, trendibb',
                      'Feltűnőbb, karakteresebb',
                      'Sportos, praktikus',
                      'Romantikus, lágyabb',
                      'Változó, nincs egy konkrét stílusom',
                      'Nehéz megfogalmaznom',
                    ].map((option) => {
                      const isChecked = answers.q05_style.includes(option);
                      return (
                        <div
                          key={option}
                          onClick={() => toggleArrayItem('q05_style', option)}
                          className={`flex items-center gap-3.5 p-4 border rounded-xs cursor-pointer transition-all ${
                            isChecked
                              ? 'border-[#C6A86A] bg-[#C6A86A]/15 text-white font-medium'
                              : 'border-white/10 bg-[#00102E]/60 hover:border-[#C6A86A]/40 text-white/80'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors shrink-0 ${
                              isChecked
                                ? 'bg-[#C6A86A] border-[#C6A86A] text-[#001D50]'
                                : 'border-white/40 bg-transparent'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-sm">{option}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 06. Mennyire sminkelsz a hétköznapokban? (kerdoiv5) */}
                <div className="border-t border-white/10 pt-10">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A86A] font-semibold block mb-1">
                    06. Kérdés
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-4">
                    Mennyire sminkelsz a hétköznapokban?
                  </h3>

                  <div className="space-y-3 font-sans">
                    {[
                      'Szinte soha',
                      'Minimálisan',
                      'Rendszeresen',
                      'Szeretem a hangsúlyos sminket',
                    ].map((option) => {
                      const isSelected = answers.q06_makeup_routine === option;
                      return (
                        <div
                          key={option}
                          onClick={() => setAnswers((prev) => ({ ...prev, q06_makeup_routine: option }))}
                          className={`flex items-center gap-3.5 p-4 border rounded-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#C6A86A] bg-[#C6A86A]/15 text-white font-medium'
                              : 'border-white/10 bg-[#00102E]/60 hover:border-[#C6A86A]/40 text-white/80'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                              isSelected
                                ? 'border-[#C6A86A] bg-[#C6A86A]'
                                : 'border-white/40 bg-transparent'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#001D50]" />}
                          </div>
                          <span className="text-sm">{option}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Q07, Q08, Nyilatkozat & Beküldés */}
            {activeStep === 3 && (
              <div className="space-y-12">
                {/* 07. Volt már műszempillád? (kerdoiv6) */}
                <div>
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A86A] font-semibold block mb-1">
                    07. Kérdés
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-4">
                    Volt már műszempillád?
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 font-sans">
                    {['Igen', 'Nem, ez lenne az első alkalom'].map((val) => {
                      const isSelected = answers.q07_has_previous_lashes === val;
                      return (
                        <div
                          key={val}
                          onClick={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              q07_has_previous_lashes: val as 'Igen' | 'Nem, ez lenne az első alkalom',
                            }))
                          }
                          className={`flex items-center gap-3.5 p-4 border rounded-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#C6A86A] bg-[#C6A86A]/20 text-white font-bold shadow-md'
                              : 'border-white/10 bg-[#00102E]/60 hover:border-[#C6A86A]/40 text-white/80'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#C6A86A] bg-[#C6A86A]' : 'border-white/40'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#001D50]" />}
                          </div>
                          <span className="text-sm">{val}</span>
                        </div>
                      );
                    })}
                  </div>

                  {answers.q07_has_previous_lashes === 'Igen' && (
                    <div className="p-6 bg-[#00102E]/80 border border-[#C6A86A]/30 rounded-xs space-y-4 font-sans animate-fade-in">
                      <span className="text-xs uppercase tracking-wider font-semibold text-[#DFC99E] block">
                        Ha igen:
                      </span>
                      <div>
                        <label className="block text-xs text-white/80 mb-1.5">
                          Mi az, amit különösen szerettél benne?
                        </label>
                        <input
                          type="text"
                          value={answers.q07_what_liked || ''}
                          onChange={(e) =>
                            setAnswers((prev) => ({ ...prev, q07_what_liked: e.target.value }))
                          }
                          placeholder="Pl. mindig rendezett tekintet, kényelem..."
                          className="w-full px-4 py-2.5 bg-[#000E26] border border-white/15 focus:border-[#C6A86A] text-sm text-white rounded-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-white/80 mb-1.5">
                          Mi az, amit nagyon nem szerettél benne?
                        </label>
                        <input
                          type="text"
                          value={answers.q07_what_disliked || ''}
                          onChange={(e) =>
                            setAnswers((prev) => ({ ...prev, q07_what_disliked: e.target.value }))
                          }
                          placeholder="Pl. nehéz érzet, lenövéskor szúrt..."
                          className="w-full px-4 py-2.5 bg-[#000E26] border border-white/15 focus:border-[#C6A86A] text-sm text-white rounded-xs outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 08. Mit szeretnél látni, amikor tükörbe nézel? (kerdoiv7 & kerdoiv8) */}
                <div className="border-t border-white/10 pt-10">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A86A] font-semibold block mb-1">
                    08. Kérdés
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
                    Mit szeretnél látni, amikor tükörbe nézel?
                  </h3>
                  <p className="text-xs text-white/70 mb-5 font-sans">
                    Több választ is megjelölhetsz.
                  </p>

                  <div className="space-y-3 font-sans">
                    {[
                      'Szeretném, ha a szempillám színe harmonizálna a hajammal és a bőrtónusommal.',
                      'Szeretném, ha nyitottabbnak tűnne a tekintetem.',
                      'Szeretnék egy dúsabb, hangsúlyosabb szempillaszettet.',
                      'Szeretnék természetes hatást, mintha a szempilláim a sajátjaim lennének, csak szebbek.',
                      'Szeretném, ha a szempillám különlegesebbé tenné a megjelenésemet, akár színes pillákkal is kifejezve az egyéniségemet.',
                      'Szeretném, ha a szempillám szépen kiemelné a szememet anélkül, hogy túl soknak érezném.',
                      'Szeretném, ha smink nélkül is rendezettnek és hangsúlyosnak tűnne a tekintetem.',
                      'Szeretném, ha a szempillám illeszkedne a saját stílusomhoz, és nem érezném idegennek magamon.',
                    ].map((option) => {
                      const isChecked = answers.q08_mirror_wishes.includes(option);
                      return (
                        <div
                          key={option}
                          onClick={() => toggleArrayItem('q08_mirror_wishes', option)}
                          className={`flex items-center gap-3.5 p-4 border rounded-xs cursor-pointer transition-all ${
                            isChecked
                              ? 'border-[#C6A86A] bg-[#C6A86A]/15 text-white font-medium'
                              : 'border-white/10 bg-[#00102E]/60 hover:border-[#C6A86A]/40 text-white/80'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors shrink-0 ${
                              isChecked
                                ? 'bg-[#C6A86A] border-[#C6A86A] text-[#001D50]'
                                : 'border-white/40 bg-transparent'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-sm">{option}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 p-6 bg-[#00102E]/80 border border-[#C6A86A]/30 rounded-xs font-sans">
                    <h4 className="font-serif text-base font-bold text-white mb-1">
                      Nem találtad meg pontosan, amit keresel?
                    </h4>
                    <p className="text-xs text-white/70 mb-3">
                      Írd le néhány szóban, mit szeretnél látni magadon, amikor belenézel a tükörbe.
                    </p>
                    <textarea
                      rows={3}
                      value={answers.q08_mirror_custom_text || ''}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, q08_mirror_custom_text: e.target.value }))
                      }
                      placeholder="Saját szavaiddal leírt gondolatok..."
                      className="w-full px-4 py-3 bg-[#000E26] border border-white/15 focus:border-[#C6A86A] text-sm text-white rounded-xs outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Consent & ÁSZF */}
                <div className="border-t border-white/10 pt-8 font-sans">
                  <label className="flex items-start gap-3.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#C6A86A] border-gray-600 rounded bg-[#00102E] focus:ring-[#C6A86A]"
                    />
                    <span className="text-xs text-white/80 leading-relaxed">
                      Megismertem és elfogadom az <strong>Adatkezelési Tájékoztatót</strong> és az <strong>Általános Szerződési Feltételeket (ÁSZF)</strong>. Hozzájárulok, hogy a Linea Studio a megadott e-mail címen felvegye velem a kapcsolatot a konzultáció részleteivel.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Stepper Footer Controls */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 border-t border-white/10 pt-6 sm:pt-8 mt-8 sm:mt-10">
              <button
                type="button"
                onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white transition-colors cursor-pointer w-full sm:w-auto"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Vissza</span>
              </button>

              {activeStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#001D50] bg-gradient-to-r from-[#DFC99E] via-[#C6A86A] to-[#A98A4D] hover:brightness-110 transition-all shadow-md rounded-xs cursor-pointer font-bold w-full sm:w-auto"
                >
                  <span>Tovább</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2.5 px-9 py-4 text-xs font-bold uppercase tracking-widest text-[#001D50] bg-gradient-to-r from-[#DFC99E] via-[#C6A86A] to-[#A98A4D] hover:brightness-110 transition-all shadow-xl rounded-xs disabled:opacity-60 cursor-pointer w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <span>Rögzítés folyamatban...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Konzultáció Beküldése</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
