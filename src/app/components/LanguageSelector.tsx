'use client';

import { useTransition, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { FaGlobe, FaCheck, FaChevronDown } from 'react-icons/fa';
import { locales } from '../i18n';

export default function LanguageSelector() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Get the path without the locale prefix
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(`/${newLocale}${pathnameWithoutLocale}`);
      setIsOpen(false);
    });
  };

  // Get language name based on locale
  const getLanguageName = (localeCode: string) => {
    return t(localeCode);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200"
        aria-expanded={isOpen}
        disabled={isPending}
      >
        <FaGlobe className="mr-1" />
        <span className="hidden md:inline">{getLanguageName(locale)}</span>
        <FaChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-neon py-2 z-20 animate-fade-in">
          <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
            {t('changeLanguage')}
          </div>
          <ul>
            {locales.map((loc) => (
              <li key={loc}>
                <button
                  onClick={() => handleLocaleChange(loc)}
                  className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${
                    locale === loc
                      ? 'text-primary-400 bg-primary-900/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                  disabled={isPending}
                >
                  <span>{getLanguageName(loc)}</span>
                  {locale === loc && <FaCheck className="text-primary-500" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
