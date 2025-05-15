'use client';

import { useState } from 'react';
import { FaGlobe, FaCheck, FaChevronDown, FaFlag } from 'react-icons/fa';
import { useLanguage, languages, languageNames, Language } from '../contexts/LanguageContext';

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
        className="flex items-center space-x-1 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        {language === 'en' ? (
          <span className="mr-1 text-lg">🇺🇸</span>
        ) : language === 'zh-TW' ? (
          <span className="mr-1 text-lg">🇹🇼</span>
        ) : language === 'zh-CN' ? (
          <span className="mr-1 text-lg">🇨🇳</span>
        ) : (
          <FaGlobe className="mr-1" />
        )}
        <span className="hidden md:inline">{languageNames[language]}</span>
        <FaChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-neon py-2 z-20 animate-fade-in">
          <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
            {language === 'en' ? 'Change Language' :
             language === 'zh-TW' ? '更改語言' :
             language === 'zh-CN' ? '更改语言' : 'Change Language'}
          </div>
          <ul>
            {Object.entries(languageNames).map(([lang, name]) => (
              <li key={lang}>
                <button
                  onClick={() => handleLanguageChange(lang as Language)}
                  className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${
                    language === lang
                      ? 'text-primary-400 bg-primary-900/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <span className="flex items-center">
                    {lang === 'en' ? (
                      <span className="mr-2 text-lg">🇺🇸</span>
                    ) : lang === 'zh-TW' ? (
                      <span className="mr-2 text-lg">🇹🇼</span>
                    ) : lang === 'zh-CN' ? (
                      <span className="mr-2 text-lg">🇨🇳</span>
                    ) : (
                      <FaFlag className="mr-2" />
                    )}
                    {name}
                  </span>
                  {language === lang && <FaCheck className="text-primary-500" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
