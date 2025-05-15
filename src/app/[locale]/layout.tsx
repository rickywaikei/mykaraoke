import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

// Import components
import AuthProvider from "../components/AuthProvider";
import { locales } from "../i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'app' });

  return {
    title: `${t('name')} - ${t('tagline')}`,
    description: "Create and join karaoke rooms, share songs, and sing with friends!",
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  // Get messages for client components
  const messages = (await import(`../../../messages/${locale}/index.json`)).default;

  return (
    <html lang={locale}>
      <body className={`${inter.variable} antialiased min-h-screen bg-gradient-to-b from-gray-900 to-purple-950`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <Toaster position="top-center" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
