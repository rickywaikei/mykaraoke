'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { FaPlus, FaSearch, FaHeart, FaRegHeart, FaPlay } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { useLanguage } from '../contexts/LanguageContext';
import BackButton from '../components/BackButton';

// Mock data for demonstration
const mockPlaylists = [
  {
    id: '1',
    name: 'Pop Hits',
    description: 'The latest and greatest pop hits',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D',
    songCount: 25,
    createdBy: {
      id: '456',
      name: 'John Doe',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    isPublic: true,
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Rock Classics',
    description: 'Timeless rock songs from the 70s, 80s, and 90s',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cm9jayUyMG11c2ljfGVufDB8fDB8fHww',
    songCount: 42,
    createdBy: {
      id: '789',
      name: 'Jane Smith',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    isPublic: true,
    isFavorite: false,
  },
  {
    id: '3',
    name: 'Karaoke Party Mix',
    description: 'Fun and easy songs that everyone can sing along to',
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8a2FyYW9rZXxlbnwwfHwwfHx8MA%3D%3D',
    songCount: 18,
    createdBy: {
      id: '456',
      name: 'John Doe',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    isPublic: true,
    isFavorite: true,
  },
  {
    id: '4',
    name: 'My Favorites',
    description: 'A collection of my personal favorite karaoke songs',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bXVzaWN8ZW58MHx8MHx8fDA%3D',
    songCount: 12,
    createdBy: {
      id: '101',
      name: 'Mike Johnson',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    isPublic: false,
    isFavorite: false,
  },
];

export default function PlaylistsPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Fetch playlists data
  useEffect(() => {
    // In a real app, fetch from API
    setPlaylists(mockPlaylists);
    setFilteredPlaylists(mockPlaylists);
    setIsLoading(false);
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, showFavoritesOnly);
  };

  // Handle favorites filter
  const handleToggleFavorites = () => {
    const newValue = !showFavoritesOnly;
    setShowFavoritesOnly(newValue);
    applyFilters(searchQuery, newValue);
  };

  // Apply filters and search
  const applyFilters = (query: string, favoritesOnly: boolean) => {
    let filtered = playlists;

    // Apply search query
    if (query) {
      filtered = filtered.filter(
        (playlist) =>
          playlist.name.toLowerCase().includes(query.toLowerCase()) ||
          (playlist.description && playlist.description.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Apply favorites filter
    if (favoritesOnly) {
      filtered = filtered.filter((playlist) => playlist.isFavorite);
    }

    setFilteredPlaylists(filtered);
  };

  // Toggle favorite status
  const handleToggleFavorite = (playlistId: string) => {
    const updatedPlaylists = playlists.map((playlist) =>
      playlist.id === playlistId
        ? { ...playlist, isFavorite: !playlist.isFavorite }
        : playlist
    );
    setPlaylists(updatedPlaylists);
    applyFilters(searchQuery, showFavoritesOnly);
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <BackButton />
        </div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('playlists.title')}</h1>
          <Link href="/playlists/create" className="btn btn-primary flex items-center">
            <FaPlus className="mr-2" /> {t('playlists.create')}
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:flex-1">
            <SearchBar onSearch={handleSearch} placeholder={t('playlists.searchPlaceholder')} />
          </div>
          <button
            onClick={handleToggleFavorites}
            className={`flex items-center px-4 py-2 rounded-lg ${
              showFavoritesOnly
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            {showFavoritesOnly ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
            {t('playlists.favoritesOnly')}
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredPlaylists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaylists.map((playlist) => (
              <Link key={playlist.id} href={`/playlists/${playlist.id}`} className="group">
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 hover:shadow-neon hover:scale-[1.02]">
                  <div className="relative aspect-square">
                    <Image
                      src={playlist.coverImage}
                      alt={playlist.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                        <FaPlay className="text-white text-xl" />
                      </div>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleFavorite(playlist.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      {playlist.isFavorite ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart />
                      )}
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 truncate">{playlist.name}</h3>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{playlist.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image
                          src={playlist.createdBy.image}
                          alt={playlist.createdBy.name}
                          width={24}
                          height={24}
                          className="rounded-full mr-2"
                        />
                        <span className="text-xs text-gray-400">{playlist.createdBy.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{playlist.songCount} {t('playlists.songs')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">{t('playlists.noPlaylists')}</h2>
            <p className="text-gray-400 mb-6">{t('playlists.tryAdjusting')}</p>
            <Link href="/playlists/create" className="btn btn-primary">
              {t('playlists.create')}
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
