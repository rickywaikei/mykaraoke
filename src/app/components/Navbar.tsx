'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { FaMicrophone, FaMusic, FaUser, FaSignOutAlt, FaDoorOpen, FaHeadphones, FaSearch } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-2 bg-black shadow-lg'
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full opacity-75 group-hover:opacity-100 blur-sm group-hover:blur-md transition-all duration-300"></div>
                <FaMicrophone className="h-6 w-6 text-white relative z-10" />
              </div>
              <div className="ml-2 flex flex-col">
                <span className="text-xl font-bold gradient-text">MyKaraoke</span>
                <span className="text-xs text-gray-400 -mt-1">Sing Together</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/rooms" className="nav-link">
              <FaDoorOpen className="inline-block mr-1" /> Rooms
            </Link>
            <Link href="/playlists" className="nav-link">
              <FaMusic className="inline-block mr-1" /> Playlists
            </Link>
            <Link href="/songs/popular" className="nav-link">
              <FaHeadphones className="inline-block mr-1" /> Songs
            </Link>

            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-300 hover:text-white transition-colors duration-200 ml-2"
              aria-label="Search"
            >
              <FaSearch />
            </button>

            {/* User Menu */}
            {session ? (
              <div className="relative ml-3">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={36}
                      height={36}
                      className="avatar"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-neon py-2 animate-fade-in origin-top-right">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-700 my-1"></div>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="btn btn-primary ml-4"
              >
                Sign in
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar - Appears when search is clicked */}
        {searchOpen && (
          <div className="mt-4 animate-slide-down">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for songs, rooms, or playlists..."
                className="w-full input pr-10"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FaSearch />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glass rounded-xl p-4 animate-slide-down">
            {session ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3 px-3 py-2 border-b border-gray-700 mb-2">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={40}
                      height={40}
                      className="avatar"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                  )}
                  <div>
                    <div className="text-white font-medium">{session.user?.name}</div>
                    <div className="text-xs text-gray-400">{session.user?.email}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/rooms"
                    className="flex items-center w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaDoorOpen className="mr-3" /> Rooms
                  </Link>
                  <Link
                    href="/playlists"
                    className="flex items-center w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaMusic className="mr-3" /> Playlists
                  </Link>
                  <Link
                    href="/songs/popular"
                    className="flex items-center w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaHeadphones className="mr-3" /> Songs
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser className="mr-3" /> Profile
                  </Link>
                </div>

                <div className="pt-2 border-t border-gray-700">
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg"
                  >
                    <FaSignOutAlt className="mr-3" /> Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <button
                  onClick={() => signIn('google')}
                  className="btn btn-primary w-full"
                >
                  Sign in with Google
                </button>
                <p className="text-center text-sm text-gray-400 mt-4">
                  Sign in to create rooms and save your favorite songs
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
