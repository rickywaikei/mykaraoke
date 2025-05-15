'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define supported languages
export const languages = ['en', 'zh-TW', 'zh-CN'] as const;
export type Language = typeof languages[number];

// Define language names
export const languageNames = {
  'en': 'English',
  'zh-TW': '繁體中文',
  'zh-CN': '简体中文'
};

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create a provider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default translations
  const defaultTranslations = {
    app: {
      name: "MyKaraoke",
      tagline: "Sing Together"
    },
    nav: {
      rooms: "Rooms",
      playlists: "Playlists",
      songs: "Songs",
      profile: "Profile",
      settings: "Settings",
      signIn: "Sign in",
      signOut: "Sign out",
      search: "Search",
      searchPlaceholder: "Search for songs, rooms, or playlists..."
    },
    home: {
      hero: {
        title: "Sing Your Heart Out",
        subtitle: "Create rooms, share songs, and enjoy karaoke with friends anywhere, anytime.",
        createRoom: "Create Room",
        joinRoom: "Join Room"
      },
      categories: {
        title: "Explore Categories",
        subtitle: "Find the perfect karaoke songs for your next session"
      },
      stats: {
        activeUsers: "Active Users",
        songsAvailable: "Songs Available",
        countries: "Countries"
      },
      howItWorks: {
        title: "How It Works",
        subtitle: "Get started with MyKaraoke in three simple steps",
        step1: {
          title: "Create or Join a Room",
          description: "Start your own karaoke party or join an existing one with friends. Invite others using a simple room code."
        },
        step2: {
          title: "Add Songs to Queue",
          description: "Search for your favorite karaoke songs and add them to the shared queue. Everyone can contribute their picks."
        },
        step3: {
          title: "Sing Together",
          description: "Enjoy singing with synchronized lyrics and video playback. The room owner can cast to a TV for the full experience."
        }
      },
      cta: {
        title: "Ready to Start Your Karaoke Party?",
        subtitle: "Join thousands of users already singing their hearts out on MyKaraoke",
        button: "Get Started Now"
      }
    },
    language: {
      changeLanguage: "Change Language"
    }
  };

  // Initialize with English or the stored preference
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, any>>(defaultTranslations);

  // Load translations when language changes
  useEffect(() => {
    // For non-English languages, try to load translations
    if (language !== 'en') {
      const loadTranslations = async () => {
        if (typeof window === 'undefined') return;

        try {
          const response = await fetch(`/messages/${language}/index.json`);
          if (response.ok) {
            const data = await response.json();
            setTranslations(data);
          } else {
            console.error(`Failed to load translations for ${language}`);
            // Fallback to default translations
            setTranslations(defaultTranslations);
          }
        } catch (error) {
          console.error(`Error loading translations for ${language}:`, error);
          // Fallback to default translations
          setTranslations(defaultTranslations);
        }
      };

      loadTranslations();
    } else {
      // For English, use the default translations
      setTranslations(defaultTranslations);
    }
  }, [language]);

  // Load language preference from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('language') as Language;
      if (storedLanguage && languages.includes(storedLanguage)) {
        setLanguage(storedLanguage);
      }
    }
  }, []);

  // Save language preference to localStorage
  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
    }
  };

  // Translation function
  const t = (key: string): string => {
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    let value = translations;

    // Navigate through the nested properties
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // If key not found, try to get it from defaultTranslations
        let defaultValue = defaultTranslations;
        let found = true;

        for (const k of keys) {
          if (defaultValue && typeof defaultValue === 'object' && k in defaultValue) {
            defaultValue = defaultValue[k];
          } else {
            found = false;
            break;
          }
        }

        if (found) {
          return defaultValue as string;
        }

        return key; // Return the key itself as fallback
      }
    }

    return value as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
