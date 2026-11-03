/**
 * Linea Studio - Admin Login Modal
 * Simple, secure authentication dialog for salon owner.
 */

import React, { useState } from 'react';
import { Lock, Mail, X, ShieldCheck, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@lineastudio.hu');
  const [password, setPassword] = useState('SecretPassword123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulated check
    setTimeout(() => {
      if (email.trim() && password.length >= 6) {
        setIsLoading(false);
        onLoginSuccess();
        onClose();
      } else {
        setIsLoading(false);
        setError('Helytelen belépési adatok. A jelszónak legalább 6 karakterből kell állnia.');
      }
    }, 400);
  };

  // MOBIL-OPTIMALIZÁLÁS (5. Elvárás): Mobilon alsó lap (Bottom Sheet - items-end), asztalon középre igazított párbeszédpanel (sm:items-center)
  return (
    <div className="fixed inset-0 z-50 bg-[#001D50]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* MOBIL-OPTIMALIZÁLÁS (5. Elvárás): Mobilon 100% szélesség, lekerekített felső sarok (rounded-t-3xl), asztalon max-w-md és rounded-2xl */}
      <div className="bg-white border border-[#E8E5DD] max-w-md w-full p-6 sm:p-8 rounded-t-3xl sm:rounded-2xl shadow-2xl relative max-h-[92vh] overflow-y-auto animate-scale-up">
        {/* Mobil húzócsík (Bottom sheet handle) */}
        <div className="w-12 h-1.5 bg-[#E8E5DD] rounded-full mx-auto mb-4 sm:hidden" />

        {/* MOBIL-OPTIMALIZÁLÁS (3. Irányelv): Min. 44x44px érintőfelületű bezáró gomb */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Bezárás"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#001D50] text-[#C6A86A] rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#001D50]">
            Linea Studio Adminisztráció
          </h3>
          <p className="text-xs text-[#001D50]/70 font-sans mt-1">
            Jelentkezz be a konzultációk és portfólió kezeléséhez.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* MOBIL-OPTIMALIZÁLÁS (4. és 5. Elvárás): Egymás alatti űrlap, 16px mobilon az auto-zoom ellen, 44px magasság */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#001D50] mb-1.5">
              Admin E-mail cím
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#001D50]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 min-h-[44px] bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-base md:text-xs text-[#001D50] rounded-xl outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#001D50] mb-1.5">
              Jelszó
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#001D50]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 min-h-[44px] bg-[#F8F7F2] border border-[#E8E5DD] focus:border-[#C6A86A] text-base md:text-xs text-[#001D50] rounded-xl outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-[#F8F7F2] p-3 rounded-lg border border-[#E8E5DD] text-[11px] text-[#001D50]/70">
            <strong>Demó fiók előtöltve:</strong> <code>admin@lineastudio.hu</code> / <code>SecretPassword123</code>
          </div>

          {/* MOBIL-OPTIMALIZÁLÁS (3. Irányelv): Min. 44px magas kényelmes belépés gomb */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full min-h-[44px] py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#001D50] hover:bg-[#0A275C] active:scale-[0.99] rounded-xl transition-all shadow-xs disabled:opacity-60 cursor-pointer"
          >
            <span>{isLoading ? 'Belépés...' : 'Biztonságos Belépés'}</span>
            <ArrowRight className="w-4 h-4 text-[#C6A86A]" />
          </button>
        </form>
      </div>
    </div>
  );
};
