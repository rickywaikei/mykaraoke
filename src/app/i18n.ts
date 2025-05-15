import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define the supported languages
export const locales = ['en', 'zh-TW', 'zh-CN'] as const;
export type Locale = (typeof locales)[number];

// Get messages for the requested locale
export default getRequestConfig(async ({ locale }) => {
  // Validate that the locale is supported
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`../messages/${locale}/index.json`)).default,
  };
});
