'use client';

import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes, FaMicrophone, FaHistory } from 'react-icons/fa';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  showVoiceSearch?: boolean;
  recentSearches?: string[];
  onSelectRecent?: (query: string) => void;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search for songs...',
  showVoiceSearch = false,
  recentSearches = [],
  onSelectRecent,
  className = ''
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowRecent(false);
    }
  };

  // Clear search input
  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle voice search (mock implementation)
  const handleVoiceSearch = () => {
    setIsListening(true);
    // In a real implementation, this would use the Web Speech API
    setTimeout(() => {
      setIsListening(false);
      setQuery('Bohemian Rhapsody'); // Mock result
      onSearch('Bohemian Rhapsody');
    }, 2000);
  };

  // Handle selecting a recent search
  const handleSelectRecent = (recentQuery: string) => {
    setQuery(recentQuery);
    onSearch(recentQuery);
    onSelectRecent?.(recentQuery);
    setShowRecent(false);
  };

  // Handle search on input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  // Close recent searches dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowRecent(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchContainerRef} className={`relative ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="relative w-full transition-all duration-300"
      >
        <div className={`relative glass overflow-hidden rounded-full transition-all duration-300 ${
          isFocused ? 'shadow-neon' : 'shadow-md'
        }`}>
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <FaSearch className={`transition-colors duration-300 ${
              isFocused ? 'text-primary-500' : 'text-gray-400'
            }`} />
          </div>

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (recentSearches.length > 0) {
                setShowRecent(true);
              }
            }}
            onBlur={() => setIsFocused(false)}
            className="w-full py-3 pl-12 pr-12 bg-transparent border-none focus:outline-none text-white placeholder-gray-400"
            placeholder={isListening ? 'Listening...' : placeholder}
          />

          <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}

            {showVoiceSearch && (
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`p-1.5 transition-colors duration-200 ${
                  isListening
                    ? 'text-red-500 animate-pulse'
                    : 'text-gray-400 hover:text-primary-500'
                }`}
                aria-label="Voice search"
              >
                <FaMicrophone />
              </button>
            )}
          </div>

          {/* Animated bottom border */}
          <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300 ${
            isFocused ? 'w-full' : 'w-0'
          }`}></div>
        </div>
      </form>

      {/* Recent searches dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute mt-2 w-full glass rounded-xl shadow-neon py-2 z-20 animate-fade-in">
          <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-800/50">
            Recent Searches
          </div>
          <ul>
            {recentSearches.map((recentQuery, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSelectRecent(recentQuery)}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50"
                >
                  <FaHistory className="mr-2 text-gray-500" />
                  {recentQuery}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
