'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaUsers, FaLock, FaUnlock, FaMusic, FaCalendarAlt, FaPlay, FaChevronRight, FaHashtag } from 'react-icons/fa';
import { Room } from '../types';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  // Generate a gradient background based on the room name
  const getGradient = () => {
    const colors = [
      'from-primary-600 to-blue-500',
      'from-secondary-500 to-purple-600',
      'from-blue-500 to-teal-400',
      'from-red-500 to-orange-500',
      'from-green-500 to-emerald-400',
    ];

    // Use the room id to pick a consistent color
    const colorIndex = parseInt(room.id.substring(0, 8), 16) % colors.length;
    return colors[colorIndex];
  };

  // Get a background image based on the room id
  const getBackgroundImage = () => {
    const images = [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2670&auto=format&fit=crop',
    ];

    const imageIndex = parseInt(room.id.substring(0, 8), 16) % images.length;
    return images[imageIndex];
  };

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-3d h-full flex flex-col">
        <div className="relative h-40 rounded-t-xl overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={getBackgroundImage()}
              alt={room.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-40`}></div>
          </div>

          {/* Room Status Badge */}
          <div className="absolute top-3 right-3 glass px-2 py-1 rounded-full text-xs flex items-center">
            {room.isPublic ? (
              <>
                <FaUnlock className="text-green-400 mr-1" />
                <span className="text-white">Public</span>
              </>
            ) : (
              <>
                <FaLock className="text-yellow-400 mr-1" />
                <span className="text-white">Private</span>
              </>
            )}
          </div>

          {/* Room Code Badge */}
          <div className="absolute top-3 left-3 glass px-2 py-1 rounded-full text-xs flex items-center">
            <FaHashtag className="text-gray-400 mr-1" />
            <span className="text-white">{room.code}</span>
          </div>

          {/* Room Name */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white">{room.name}</h3>

            {/* Host Info */}
            <div className="flex items-center mt-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2 border border-white/50">
                <Image
                  src={room.ownerImage}
                  alt={room.ownerName}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-gray-200">Hosted by {room.ownerName}</span>
            </div>
          </div>

          {/* Join Now Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <FaPlay className="text-white mr-2" />
                <span className="text-white font-medium">Join Now</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          {/* Description */}
          {room.description && (
            <p className="text-sm text-gray-300 mb-4 line-clamp-2 flex-grow">{room.description}</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="glass rounded-lg p-2 text-center">
              <div className="flex items-center justify-center text-primary-400 mb-1">
                <FaUsers className="mr-1" />
              </div>
              <div className="text-lg font-bold text-white">{room.participants.length}</div>
              <div className="text-xs text-gray-400">Participants</div>
            </div>

            <div className="glass rounded-lg p-2 text-center">
              <div className="flex items-center justify-center text-secondary-400 mb-1">
                <FaMusic className="mr-1" />
              </div>
              <div className="text-lg font-bold text-white">{room.queue.length}</div>
              <div className="text-xs text-gray-400">Songs</div>
            </div>
          </div>

          {/* Created Date */}
          <div className="text-xs text-gray-500 flex items-center mt-auto">
            <FaCalendarAlt className="mr-1" />
            <span>Created {formatDate(room.createdAt)}</span>
          </div>
        </div>

        {/* Join Button */}
        <div className="p-3 border-t border-gray-800/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              {room.isPlaying ? 'Currently playing' : 'Ready to start'}
            </span>
            <div className="flex items-center text-primary-400 font-medium">
              <span>Join Room</span>
              <FaChevronRight className="ml-1 text-xs" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
