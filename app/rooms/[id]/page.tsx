'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUsers, FaMusic, FaPlus, FaComments, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import PlayerControls from '../../components/PlayerControls';
import SearchBar from '../../components/SearchBar';
import { Room, Song, Message } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import BackButton from '../../components/BackButton';

// Mock data for demonstration
const mockRoom: Room = {
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
};

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hey everyone! Welcome to the karaoke room!',
    senderId: '456',
    senderName: 'John Doe',
    senderImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    roomId: '123',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    content: 'Thanks for having me! Excited to sing!',
    senderId: '789',
    senderName: 'Jane Smith',
    senderImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    roomId: '123',
    createdAt: new Date(Date.now() - 1800000),
  },
];

export default function RoomPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const { t } = useLanguage();

  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showLyrics, setShowLyrics] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Fetch room data
  useEffect(() => {
    // In a real app, fetch from API
    setRoom(mockRoom);
    setMessages(mockMessages);
    setIsLoading(false);
  }, [roomId]);

  // Handle play/pause
  const handlePlayPause = () => {
    if (room) {
      setRoom({ ...room, isPlaying: !room.isPlaying });
    }
  };

  // Handle next song
  const handleNextSong = () => {
    if (room && room.queue.length > 0) {
      const nextSong = room.queue[0];
      const newQueue = room.queue.slice(1);
      setRoom({
        ...room,
        currentSong: nextSong,
        queue: newQueue,
        isPlaying: true,
      });
      setProgress(0);
    }
  };

  // Handle previous song (not implemented in this demo)
  const handlePreviousSong = () => {
    // In a real app, implement previous song logic
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  // Handle seeking in the song
  const handleSeek = (time: number) => {
    setProgress(time);
    // In a real app, seek the YouTube player
  };

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && session?.user) {
      const newMsg: Message = {
        id: Date.now().toString(),
        content: newMessage,
        senderId: session.user.id,
        senderName: session.user.name,
        senderImage: session.user.image,
        roomId,
        createdAt: new Date(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  // Simulate progress for demo
  useEffect(() => {
    if (room?.isPlaying) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= duration) {
            clearInterval(timer);
            handleNextSong();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [room?.isPlaying, duration]);

  // Set duration when current song changes
  useEffect(() => {
    if (room?.currentSong) {
      // Parse duration string (e.g., "4:30" to seconds)
      const [mins, secs] = room.currentSong.duration.split(':').map(Number);
      setDuration(mins * 60 + secs);
    }
  }, [room?.currentSong]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </>
    );
  }

  if (!room) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">{t('rooms.roomPage.notFound')}</h1>
          <button
            onClick={() => router.push('/rooms')}
            className="btn btn-primary"
          >
            {t('rooms.roomPage.backToRooms')}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <BackButton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player and Lyrics */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="aspect-video relative">
                {/* YouTube player would go here in a real implementation */}
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <Image
                    src={room.currentSong?.thumbnailUrl || ''}
                    alt={room.currentSong?.title || ''}
                    fill
                    className="object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-white text-center">
                      {room.currentSong?.title || 'No song playing'}
                    </h2>
                  </div>
                </div>
              </div>

              {showLyrics && (
                <div className="p-4 bg-gray-800 max-h-60 overflow-y-auto">
                  <h3 className="font-bold mb-2">{t('rooms.roomPage.lyrics')}</h3>
                  <p className="text-gray-300">
                    {/* In a real app, fetch and display synchronized lyrics */}
                    {t('player.lyricsPlaceholder')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Room Info and Queue */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{room.name}</h2>
                <div className="flex items-center">
                  <button
                    onClick={() => setShowParticipants(!showParticipants)}
                    className="flex items-center text-sm text-gray-300 hover:text-white"
                  >
                    <FaUsers className="mr-1" />
                    {room.participants.length}
                    {showParticipants ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                  </button>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="flex items-center text-sm text-gray-300 hover:text-white ml-4"
                  >
                    <FaComments className="mr-1" />
                    {showChat ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                  </button>
                </div>
              </div>

              {showParticipants && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">{t('rooms.participants')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center bg-gray-700 rounded-full px-2 py-1">
                        <Image
                          src={participant.image}
                          alt={participant.name}
                          width={20}
                          height={20}
                          className="rounded-full mr-1"
                        />
                        <span className="text-sm">{participant.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showChat && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">{t('rooms.roomPage.chat')}</h3>
                  <div className="bg-gray-900 rounded-lg p-2 h-60 overflow-y-auto mb-2">
                    {messages.map((message) => (
                      <div key={message.id} className="mb-2">
                        <div className="flex items-start">
                          <Image
                            src={message.senderImage}
                            alt={message.senderName}
                            width={24}
                            height={24}
                            className="rounded-full mr-2 mt-1"
                          />
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-sm">{message.senderName}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendMessage} className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={t('rooms.roomPage.messagePlaceholder')}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg"
                    >
                      {t('rooms.roomPage.sendMessage')}
                    </button>
                  </form>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{t('rooms.roomPage.queue')}</h3>
                  <div className="flex items-center text-sm text-gray-400">
                    <FaMusic className="mr-1" />
                    {room.queue.length} {t('rooms.songs').toLowerCase()}
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-2 max-h-60 overflow-y-auto">
                  {room.queue.length > 0 ? (
                    room.queue.map((song, index) => (
                      <div key={song.id} className="flex items-center p-2 hover:bg-gray-800 rounded">
                        <div className="mr-3 text-gray-500">{index + 1}</div>
                        <div className="w-10 h-10 rounded overflow-hidden mr-3">
                          <Image
                            src={song.thumbnailUrl}
                            alt={song.title}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{song.title}</p>
                          <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                        </div>
                        <div className="text-sm text-gray-500">{song.duration}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">{t('rooms.roomPage.noSongs')}</p>
                  )}
                </div>
                <div className="mt-4">
                  <SearchBar onSearch={(query) => console.log('Search:', query)} placeholder={t('rooms.roomPage.searchSongs')} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PlayerControls
        currentSong={room.currentSong}
        isPlaying={room.isPlaying}
        onPlay={() => setRoom({ ...room, isPlaying: true })}
        onPause={() => setRoom({ ...room, isPlaying: false })}
        onNext={handleNextSong}
        onPrevious={handlePreviousSong}
        onVolumeChange={handleVolumeChange}
        onToggleLyrics={() => setShowLyrics(!showLyrics)}
        showLyrics={showLyrics}
        volume={volume}
        progress={progress}
        duration={duration}
        onSeek={handleSeek}
      />
    </>
  );
}
