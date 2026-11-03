import React from 'react';
import { Sparkles } from 'lucide-react';
import { useButtonStyle, ButtonStyleVariant } from '../context/ButtonStyleContext';

export interface ConsultationButtonProps {
  onClick?: () => void;
  label?: string;
  size?: 'navbar' | 'standard' | 'large';
  isNavbar?: boolean;
  className?: string;
  forcedVariant?: ButtonStyleVariant;
  type?: 'button' | 'submit' | 'reset';
}

export const ConsultationButton: React.FC<ConsultationButtonProps> = ({
  onClick,
  label = 'Ingyenes Konzultáció',
  size = 'standard',
  isNavbar = false,
  className = '',
  forcedVariant,
  type = 'button',
}) => {
  const { variant: contextVariant } = useButtonStyle();
  const activeVariant = forcedVariant || contextVariant;

  // Variant 2: "Éjfélkék & Dupla Arany Ékszerkeret (Haute Joaillerie Stílus)"
  // Csakis a meglévő mélykék (#001D50) és arany (#C6A86A / #DFC285) színekkel,
  // elegáns ékszerdoboz-szerű dupla arany filigrán kerettel és arany fénnyel.
  const isMidnightGold = activeVariant === 'version-2-midnight-gold';
  const isCrystalGold = activeVariant === 'version-3-crystal-gold';

  // Base styling common to luxury designs
  const baseClasses =
    'relative overflow-hidden group flex items-center justify-center font-bold uppercase cursor-pointer transition-all duration-300 active:scale-[0.98]';

  // Variant-specific visual styling - strictly using #001D50, #C6A86A, #DFC285, #B89758, #F8F7F2 and white
  let variantClasses = '';
  if (isCrystalGold) {
    // 3. Verzió: "Kristály & Selyem-Fehér Arany Prizma"
    // Teljesen egyedi építészeti forma (rounded-xl/2xl beveled jelleg), ragyogó selyemfehér üveg háttér,
    // kettős arany filigrán keret, belső fény és lebegő arany díszcsík az elegáns haute-couture megjelenésért.
    variantClasses =
      'rounded-xl sm:rounded-2xl bg-white/95 text-[#001D50] hover:text-[#001D50] border-2 border-[#C6A86A] ring-1 ring-inset ring-[#C6A86A]/40 shadow-[0_4px_22px_rgba(198,168,106,0.32)] hover:shadow-[0_8px_32px_rgba(198,168,106,0.58)] hover:border-[#DFC285] hover:scale-[1.03] before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-[#DFC285]/35 before:to-transparent before:transition-transform before:duration-700 after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 hover:after:w-2/3 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-[#C6A86A] after:to-transparent after:transition-all after:duration-300';
  } else if (isMidnightGold) {
    // 2. Verzió: "Éjfélkék & Dupla Arany Ékszerkeret"
    variantClasses =
      'rounded-full bg-[#001D50] text-[#DFC285] hover:text-[#001D50] border-2 border-[#C6A86A] ring-2 ring-[#C6A86A]/40 ring-offset-2 ring-offset-[#001D50] hover:ring-[#C6A86A]/80 shadow-[0_4px_22px_rgba(198,168,106,0.35)] hover:shadow-[0_8px_32px_rgba(198,168,106,0.65)] hover:scale-[1.03] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#C6A86A] before:via-[#DFC285] before:to-[#C6A86A] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 after:absolute after:inset-0 after:-translate-x-full hover:after:translate-x-full after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent after:transition-transform after:duration-700';
  } else {
    // 1. Verzió: "Teli Szatén Arany Pill"
    variantClasses =
      'rounded-full text-[#001D50] bg-gradient-to-r from-[#C6A86A] via-[#DFC285] to-[#C6A86A] hover:from-[#DFC285] hover:to-[#C6A86A] border border-white/50 shadow-[0_4px_18px_rgba(198,168,106,0.38)] hover:shadow-[0_6px_25px_rgba(198,168,106,0.58)] hover:scale-[1.03] before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-transform before:duration-700';
  }

  // Size styling
  let sizeClasses = '';
  if (isNavbar) {
    sizeClasses = 'gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs tracking-wider sm:tracking-widest shrink-0';
  } else if (size === 'navbar') {
    sizeClasses = 'gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs tracking-wider sm:tracking-widest';
  } else if (size === 'large') {
    sizeClasses = 'gap-3 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-4.5 text-xs tracking-widest';
  } else {
    // Standard size (Hero & Closing Section CTAs)
    sizeClasses = 'gap-3 w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 text-xs tracking-widest';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
    >
      <Sparkles
        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 shrink-0 transition-all duration-300 ${
          isCrystalGold
            ? 'text-[#C6A86A] group-hover:rotate-90 group-hover:scale-125'
            : isMidnightGold
            ? 'text-[#C6A86A] group-hover:text-[#001D50] group-hover:rotate-45 group-hover:scale-125'
            : 'text-[#001D50] group-hover:rotate-12 group-hover:scale-110'
        }`}
      />

      {isNavbar ? (
        <>
          {/* Desktop single line */}
          <span className="hidden sm:inline relative z-10">{label}</span>
          {/* Mobile two lines explicitly requested by user */}
          <span className="sm:hidden flex flex-col text-left leading-tight relative z-10 font-bold">
            <span>Ingyenes</span>
            <span>Konzultáció</span>
          </span>
        </>
      ) : (
        <span className="relative z-10">{label}</span>
      )}
    </button>
  );
};
