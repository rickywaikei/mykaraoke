'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaUser, FaMusic, FaDoorOpen, FaHistory, FaCog } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { Room, Playlist, Song } from '../types';

// Mock data for demonstration
const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'My Favorites',
    description: 'My favorite karaoke songs',
    songs: [
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
        addedBy: { id: '456', name: 'John Doe', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
        addedAt: new Date(),
      },
    ],
    createdBy: { id: '456', name: 'John Doe', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    createdAt: new Date(),
    isPublic: true,
  },
];

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
    queue: [],
    isPlaying: false,
    createdAt: new Date(),
    isPublic: true,
    code: 'ABC123',
  },
];

const mockRecentSongs: Song[] = [
  {
    id: '1',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    thumbnailUrl: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg',
    videoId: 'JGwWNGJdvx8',
    duration: '4:23',
    addedBy: { id: '456', name: 'John Doe', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    addedAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: '2',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    thumbnailUrl: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg',
    videoId: 'OPf0YbXqDm0',
    duration: '4:30',
    addedBy: { id: '456', name: 'John Doe', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    addedAt: new Date(Date.now() - 172800000), // 2 days ago
  },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('playlists');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    if (!session) {
      return;
    }

    // In a real app, fetch from API
    setPlaylists(mockPlaylists);
    setRooms(mockRooms);
    setRecentSongs(mockRecentSongs);
    setIsLoading(false);
  }, [session]);

  // Redirect if not logged in
  useEffect(() => {
    if (!session && !isLoading) {
      router.push('/');
    }
  }, [session, isLoading, router]);

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="py-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-purple-600 flex items-center justify-center">
                    <FaUser className="text-white text-3xl" />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">{session.user?.name}</h1>
                <p className="text-gray-400">{session.user?.email}</p>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                  <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                    <span className="font-medium">{playlists.length}</span> Playlists
                  </div>
                  <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                    <span className="font-medium">{rooms.length}</span> Rooms
                  </div>
                  <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                    <span className="font-medium">{recentSongs.length}</span> Recent Songs
                  </div>
                </div>
              </div>
              <div className="ml-auto mt-4 md:mt-0">
                <Link href="/profile/settings" className="btn bg-gray-700 hover:bg-gray-600 text-white">
                  <FaCog className="mr-2" /> Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab('playlists')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'playlists'
                    ? 'text-purple-500 border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FaMusic className="inline mr-2" /> Playlists
              </button>
              <button
                onClick={() => setActiveTab('rooms')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'rooms'
                    ? 'text-purple-500 border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FaDoorOpen className="inline mr-2" /> My Rooms
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'history'
                    ? 'text-purple-500 border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FaHistory className="inline mr-2" /> Recent Songs
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'playlists' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">My Playlists</h2>
                <Link href="/playlists/create" className="btn btn-primary">
                  Create Playlist
                </Link>
              </div>
              
              {playlists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {playlists.map((playlist) => (
                    <Link key={playlist.id} href={`/playlists/${playlist.id}`}>
                      <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-gray-800/80 transition-all duration-200 h-full">
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-1">{playlist.name}</h3>
                          {playlist.description && (
                            <p className="text-gray-400 text-sm mb-3">{playlist.description}</p>
                          )}
                          <p className="text-sm text-gray-500">{playlist.songs.length} songs</p>
                        </div>
                        {playlist.songs.length > 0 && (
                          <div className="grid grid-cols-3 gap-1 p-2">
                            {playlist.songs.slice(0, 3).map((song) => (
                              <div key={song.id} className="aspect-video relative">
                                <Image
                                  src={song.thumbnailUrl}
                                  alt={song.title}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-800/60 backdrop-blur-sm rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No playlists yet</h3>
                  <p className="text-gray-400 mb-6">Create your first playlist to save your favorite songs</p>
                  <Link href="/playlists/create" className="btn btn-primary">
                    Create Playlist
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rooms' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">My Rooms</h2>
                <Link href="/rooms/create" className="btn btn-primary">
                  Create Room
                </Link>
              </div>
              
              {rooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <Link key={room.id} href={`/rooms/${room.id}`}>
                      <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-gray-800/80 transition-all duration-200 h-full">
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-1">{room.name}</h3>
                          {room.description && (
                            <p className="text-gray-400 text-sm mb-3">{room.description}</p>
                          )}
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{room.participants.length} participants</span>
                            <span>Code: {room.code}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-800/60 backdrop-blur-sm rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No rooms yet</h3>
                  <p className="text-gray-400 mb-6">Create your first karaoke room to start singing</p>
                  <Link href="/rooms/create" className="btn btn-primary">
                    Create Room
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Recently Played Songs</h2>
              
              {recentSongs.length > 0 ? (
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg overflow-hidden">
                  {recentSongs.map((song, index) => (
                    <div 
                      key={`${song.id}-${index}`}
                      className="flex items-center p-4 hover:bg-gray-700 border-b border-gray-700 last:border-b-0"
                    >
                      <div className="w-16 h-9 rounded overflow-hidden mr-4">
                        <Image
                          src={song.thumbnailUrl}
                          alt={song.title}
                          width={64}
                          height={36}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{song.title}</h3>
                        <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(song.addedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-800/60 backdrop-blur-sm rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No recent songs</h3>
                  <p className="text-gray-400 mb-6">Your recently played songs will appear here</p>
                  <Link href="/rooms" className="btn btn-primary">
                    Join a Room
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
