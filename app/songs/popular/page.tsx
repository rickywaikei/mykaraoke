'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { FaPlay, FaPlus, FaHeart, FaRegHeart, FaMusic, FaFilter, FaChevronDown } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import { useLanguage } from '../../contexts/LanguageContext';
import BackButton from '../../components/BackButton';

// Mock data for demonstration
const mockSongs = [
  {
    id: '1',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    thumbnailUrl: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg',
    videoId: 'JGwWNGJdvx8',
    duration: '4:23',
    playCount: 12500,
    genre: 'Pop',
    language: 'English',
    releaseYear: 2017,
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    thumbnailUrl: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg',
    videoId: 'OPf0YbXqDm0',
    duration: '4:30',
    playCount: 10200,
    genre: 'Funk',
    language: 'English',
    releaseYear: 2014,
    isFavorite: false,
  },
  {
    id: '3',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    thumbnailUrl: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
    videoId: 'fJ9rUzIMcZQ',
    duration: '5:59',
    playCount: 9800,
    genre: 'Rock',
    language: 'English',
    releaseYear: 1975,
    isFavorite: true,
  },
  {
    id: '4',
    title: 'Despacito',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    thumbnailUrl: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
    videoId: 'kJQP7kiw5Fk',
    duration: '4:41',
    playCount: 8700,
    genre: 'Reggaeton',
    language: 'Spanish',
    releaseYear: 2017,
    isFavorite: false,
  },
  {
    id: '5',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    thumbnailUrl: 'https://i.ytimg.com/vi/Zi_XLOBDo_Y/hqdefault.jpg',
    videoId: 'Zi_XLOBDo_Y',
    duration: '4:54',
    playCount: 7500,
    genre: 'Pop',
    language: 'English',
    releaseYear: 1982,
    isFavorite: true,
  },
  {
    id: '6',
    title: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    thumbnailUrl: 'https://i.ytimg.com/vi/1w7OgIMMRc4/hqdefault.jpg',
    videoId: '1w7OgIMMRc4',
    duration: '5:55',
    playCount: 6800,
    genre: 'Rock',
    language: 'English',
    releaseYear: 1987,
    isFavorite: false,
  },
  {
    id: '7',
    title: 'Rolling in the Deep',
    artist: 'Adele',
    thumbnailUrl: 'https://i.ytimg.com/vi/rYEDA3JcQqw/hqdefault.jpg',
    videoId: 'rYEDA3JcQqw',
    duration: '4:54',
    playCount: 6200,
    genre: 'Pop',
    language: 'English',
    releaseYear: 2010,
    isFavorite: true,
  },
  {
    id: '8',
    title: 'Gangnam Style',
    artist: 'PSY',
    thumbnailUrl: 'https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg',
    videoId: '9bZkp7q19f0',
    duration: '4:13',
    playCount: 5900,
    genre: 'K-Pop',
    language: 'Korean',
    releaseYear: 2012,
    isFavorite: false,
  },
];

// Genre options
const genres = ['All', 'Pop', 'Rock', 'Hip Hop', 'R&B', 'Country', 'Electronic', 'Jazz', 'Classical', 'Reggae', 'Folk', 'Blues', 'Metal', 'Funk', 'K-Pop', 'J-Pop', 'Reggaeton'];

// Language options
const languages = ['All', 'English', 'Spanish', 'Korean', 'Japanese', 'Chinese', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Hindi', 'Arabic'];

// Extract unique artists from songs
const getUniqueArtists = (songs) => {
  const artists = songs.map(song => song.artist);
  return ['All', ...Array.from(new Set(artists))];
};

export default function PopularSongsPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: 'All',
    language: 'All',
    artist: 'All',
    favoritesOnly: false,
  });

  const [artists, setArtists] = useState(['All']);

  // Fetch songs data
  useEffect(() => {
    // In a real app, fetch from API
    setSongs(mockSongs);
    setFilteredSongs(mockSongs);
    setArtists(getUniqueArtists(mockSongs));
    setIsLoading(false);
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, filters);
  };

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string | boolean) => {
    const newFilters = {
      ...filters,
      [filterName]: value,
    };
    setFilters(newFilters);
    applyFilters(searchQuery, newFilters);
  };

  // Apply filters and search
  const applyFilters = (query: string, currentFilters: any) => {
    let filtered = songs;

    // Apply search query
    if (query) {
      filtered = filtered.filter(
        (song) =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply genre filter
    if (currentFilters.genre !== 'All') {
      filtered = filtered.filter((song) => song.genre === currentFilters.genre);
    }

    // Apply language filter
    if (currentFilters.language !== 'All') {
      filtered = filtered.filter((song) => song.language === currentFilters.language);
    }

    // Apply artist filter
    if (currentFilters.artist !== 'All') {
      filtered = filtered.filter((song) => song.artist === currentFilters.artist);
    }

    // Apply favorites filter
    if (currentFilters.favoritesOnly) {
      filtered = filtered.filter((song) => song.isFavorite);
    }

    setFilteredSongs(filtered);
  };

  // Toggle favorite status
  const handleToggleFavorite = (songId: string) => {
    const updatedSongs = songs.map((song) =>
      song.id === songId ? { ...song, isFavorite: !song.isFavorite } : song
    );
    setSongs(updatedSongs);
    applyFilters(searchQuery, filters);
  };

  // Format play count
  const formatPlayCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <BackButton />
        </div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('songs.popular')}</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="md:flex-1">
            <SearchBar onSearch={handleSearch} placeholder={t('songs.searchPlaceholder')} />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:text-white"
          >
            <FaFilter className="mr-2" />
            {t('songs.filters')}
            <FaChevronDown className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => handleFilterChange('favoritesOnly', !filters.favoritesOnly)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              filters.favoritesOnly
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            {filters.favoritesOnly ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
            {t('songs.favoritesOnly')}
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 mb-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t('songs.genre')}</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('songs.language')}</label>
                <select
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('songs.artist')}</label>
                <select
                  value={filters.artist}
                  onChange={(e) => handleFilterChange('artist', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {artists.map((artist) => (
                    <option key={artist} value={artist}>
                      {artist}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredSongs.length > 0 ? (
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('songs.title')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">{t('songs.artist')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">{t('songs.genre')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">{t('songs.duration')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('songs.plays')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {filteredSongs.map((song, index) => (
                  <tr key={song.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3 relative group">
                          <Image
                            src={song.thumbnailUrl}
                            alt={song.title}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                            <FaPlay className="text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{song.title}</div>
                          <div className="text-sm text-gray-400 md:hidden">{song.artist}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden md:table-cell">{song.artist}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden lg:table-cell">{song.genre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden lg:table-cell">{song.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="flex items-center">
                        <FaMusic className="mr-1 text-xs" />
                        {formatPlayCount(song.playCount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleToggleFavorite(song.id)}
                          className="text-gray-400 hover:text-white mr-3"
                        >
                          {song.isFavorite ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaRegHeart />
                          )}
                        </button>
                        <button className="text-gray-400 hover:text-white">
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">{t('songs.noSongs')}</h2>
            <p className="text-gray-400 mb-6">{t('songs.tryAdjusting')}</p>
          </div>
        )}
      </main>
    </>
  );
}
