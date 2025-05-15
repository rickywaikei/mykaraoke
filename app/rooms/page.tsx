'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import RoomCard from '../components/RoomCard';
import SearchBar from '../components/SearchBar';
import { Room } from '../types';

// Mock data for demonstration
const mockRooms: Room[] = [
  {
    id: '123',
    name: 'Karaoke Night',
    description: 'Join us for a fun karaoke night with friends!',
    ownerId: '456',
    ownerName: 'John Doe',
    ownerImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    participants: [
      { id: '456', name: 'John Doe', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { id: '789', name: 'Jane Smith', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
    ],
    queue: [
      {
        id: '1',
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        thumbnailUrl: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg',
        videoId: 'JGwWNGJdvx8',
        duration: '4:23',
        addedBy: { id: '456', name: 'John Doe', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
        addedAt: new Date(),
      },
      {
        id: '2',
        title: 'Uptown Funk',
        artist: 'Mark Ronson ft. Bruno Mars',
        thumbnailUrl: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg',
        videoId: 'OPf0YbXqDm0',
        duration: '4:30',
        addedBy: { id: '789', name: 'Jane Smith', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
        addedAt: new Date(),
      },
    ],
    currentSong: {
      id: '3',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      thumbnailUrl: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
      videoId: 'fJ9rUzIMcZQ',
      duration: '5:59',
      addedBy: { id: '456', name: 'John Doe', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
      addedAt: new Date(),
    },
    isPlaying: true,
    createdAt: new Date(),
    isPublic: true,
    code: 'ABC123',
  },
  {
    id: '456',
    name: 'Pop Hits',
    description: 'Sing along to the latest pop hits!',
    ownerId: '789',
    ownerName: 'Jane Smith',
    ownerImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    participants: [
      { id: '789', name: 'Jane Smith', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
    ],
    queue: [],
    isPlaying: false,
    createdAt: new Date(),
    isPublic: true,
    code: 'DEF456',
  },
  {
    id: '789',
    name: 'Rock Classics',
    description: 'Rock out to classic hits from the 70s, 80s, and 90s!',
    ownerId: '101',
    ownerName: 'Mike Johnson',
    ownerImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    participants: [
      { id: '101', name: 'Mike Johnson', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
    ],
    queue: [],
    isPlaying: false,
    createdAt: new Date(),
    isPublic: false,
    code: 'GHI789',
  },
];

export default function RoomsPage() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    publicOnly: false,
    withParticipants: false,
    withSongs: false,
  });

  // Fetch rooms data
  useEffect(() => {
    // In a real app, fetch from API
    setRooms(mockRooms);
    setFilteredRooms(mockRooms);
    setIsLoading(false);
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, filters);
  };

  // Handle filter changes
  const handleFilterChange = (filterName: keyof typeof filters) => {
    const newFilters = {
      ...filters,
      [filterName]: !filters[filterName],
    };
    setFilters(newFilters);
    applyFilters(searchQuery, newFilters);
  };

  // Apply filters and search
  const applyFilters = (query: string, currentFilters: typeof filters) => {
    let filtered = rooms;

    // Apply search query
    if (query) {
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(query.toLowerCase()) ||
          (room.description && room.description.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Apply filters
    if (currentFilters.publicOnly) {
      filtered = filtered.filter((room) => room.isPublic);
    }

    if (currentFilters.withParticipants) {
      filtered = filtered.filter((room) => room.participants.length > 1);
    }

    if (currentFilters.withSongs) {
      filtered = filtered.filter((room) => room.queue.length > 0);
    }

    setFilteredRooms(filtered);
  };

  // Join room by code
  const [roomCode, setRoomCode] = useState('');
  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validate the code and redirect to the room
    console.log('Joining room with code:', roomCode);
  };

  return (
    <>
      <Navbar />
      <main className="py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Karaoke Rooms</h1>
          <Link href="/rooms/create" className="btn btn-primary flex items-center">
            <FaPlus className="mr-2" /> Create Room
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center">
              <SearchBar onSearch={handleSearch} placeholder="Search rooms..." />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="ml-2 p-3 bg-gray-800 rounded-lg text-gray-300 hover:text-white"
              >
                <FaFilter />
              </button>
            </div>
            {showFilters && (
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('publicOnly')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.publicOnly
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  Public Only
                </button>
                <button
                  onClick={() => handleFilterChange('withParticipants')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.withParticipants
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  With Participants
                </button>
                <button
                  onClick={() => handleFilterChange('withSongs')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.withSongs
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  With Songs
                </button>
              </div>
            )}
          </div>
          <div>
            <form onSubmit={handleJoinByCode} className="flex">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No rooms found</h2>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <Link href="/rooms/create" className="btn btn-primary">
              Create a Room
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
