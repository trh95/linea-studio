import React, { createContext, useContext, useState, useEffect } from 'react';

export type ButtonStyleVariant =
  | 'version-1-satin-gold'
  | 'version-2-midnight-gold'
  | 'version-3-crystal-gold';

interface ButtonStyleContextType {
  variant: ButtonStyleVariant;
  setVariant: (variant: ButtonStyleVariant) => void;
  toggleVariant: () => void;
}

const ButtonStyleContext = createContext<ButtonStyleContextType | undefined>(undefined);

const STORAGE_KEY = 'linea_consultation_button_style';

export const ButtonStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Option 1 (Teli Szatén Arany) is the selected permanent design
  const [variant, setVariantState] = useState<ButtonStyleVariant>('version-1-satin-gold');

  useEffect(() => {
    // Persist Option 1 as the chosen design
    localStorage.setItem(STORAGE_KEY, 'version-1-satin-gold');
  }, []);

  const setVariant = (newVariant: ButtonStyleVariant) => {
    setVariantState(newVariant);
    localStorage.setItem(STORAGE_KEY, newVariant);
  };

  const toggleVariant = () => {
    let next: ButtonStyleVariant;
    if (variant === 'version-1-satin-gold') {
      next = 'version-2-midnight-gold';
    } else if (variant === 'version-2-midnight-gold') {
      next = 'version-3-crystal-gold';
    } else {
      next = 'version-1-satin-gold';
    }
    setVariant(next);
  };

  return (
    <ButtonStyleContext.Provider value={{ variant, setVariant, toggleVariant }}>
      {children}
    </ButtonStyleContext.Provider>
  );
};

export const useButtonStyle = (): ButtonStyleContextType => {
  const context = useContext(ButtonStyleContext);
  if (!context) {
    throw new Error('useButtonStyle must be used within a ButtonStyleProvider');
  }
  return context;
};
