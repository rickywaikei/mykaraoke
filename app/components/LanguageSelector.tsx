'use client';

import { useState } from 'react';
import { FaGlobe, FaCheck, FaChevronDown, FaFlag } from 'react-icons/fa';
import { useLanguage, languages, languageNames, languageLabels, Language } from '../contexts/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <span className="inline-block text-sm font-medium">{languageLabels[language]}</span>
        <FaChevronDown className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 glass rounded-xl shadow-neon py-2 z-20 animate-fade-in">
          <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">
            {language === 'en' ? 'Language' :
             language === 'zh-TW' ? '語言' :
             language === 'zh-CN' ? '语言' : 'Language'}
          </div>
          <ul>
            {Object.entries(languageNames).map(([lang, name]) => (
              <li key={lang}>
                <button
                  onClick={() => handleLanguageChange(lang as Language)}
                  className={`flex items-center justify-between w-full text-left px-3 py-2 text-sm ${
                    language === lang
                      ? 'text-primary-400 bg-primary-900/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <span className="flex items-center">
                    {languageLabels[lang as Language]}
                  </span>
                  {language === lang && <FaCheck className="text-primary-500 ml-1" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
