'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className = '' }: BackButtonProps) {
  const router = useRouter();
  const { t } = useLanguage();

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.back();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <button
      onClick={() => router.back()}
      className={`flex items-center text-gray-400 hover:text-white ${className}`}
      aria-label={t('common.back')}
    >
      <FaArrowLeft className="mr-2" /> {t('common.back')}
    </button>
  );
}
