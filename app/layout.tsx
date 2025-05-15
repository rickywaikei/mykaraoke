import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Import components
import AuthProvider from "./components/AuthProvider";
import { LanguageProvider } from "./contexts/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MyKaraoke - Sing Together",
  description: "Create and join karaoke rooms, share songs, and sing with friends!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen bg-gradient-to-b from-gray-900 to-purple-950`}>
        <AuthProvider>
          <LanguageProvider>
            <Toaster position="top-center" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
