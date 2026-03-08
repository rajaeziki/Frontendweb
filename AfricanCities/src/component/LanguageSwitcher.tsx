import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
  };

  // Chemin vers l'image du drapeau de l'autre langue
  const flagSrc = i18n.language === 'fr' ? '/flags/flagenglais.png' : '/flags/flagfrnacasi .png';
  const alt = i18n.language === 'fr' ? 'Switch to English' : 'Passer en français';

  return (
    <button
      onClick={toggleLanguage}
      className="ml-4 w-8 h-8 focus:outline-none hover:scale-110 transition-transform"
      title={alt}
      aria-label={alt}
    >
      <img
        src={flagSrc}
        alt={alt}
        className="w-full h-full object-cover rounded-sm" // object-cover pour bien cadrer, rounded-sm pour des bords légèrement arrondis (optionnel)
      />
    </button>
  );
};

export default LanguageSwitcher;