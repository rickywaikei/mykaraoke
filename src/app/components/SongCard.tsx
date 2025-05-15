'use client';

import Image from 'next/image';
import { FaPlay, FaPlus, FaHeart, FaRegHeart, FaEllipsisH, FaMusic, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
  onPlay?: () => void;
  onAddToQueue?: () => void;
  onAddToPlaylist?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  isCompact?: boolean;
}

export default function SongCard({
  song,
  onPlay,
  onAddToQueue,
  onAddToPlaylist,
  isFavorite = false,
  onToggleFavorite,
  isCompact = false
}: SongCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  // Compact layout for list views
  if (isCompact) {
    return (
      <div
        className="glass rounded-lg overflow-hidden hover:bg-gray-800/80 transition-all duration-300 group flex items-center p-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0">
          <Image
            src={song.thumbnailUrl}
            alt={song.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {isHovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <button
                onClick={onPlay}
                className="text-white p-1"
                aria-label="Play song"
              >
                <FaPlay className="text-sm" />
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{song.title}</h3>
          <p className="text-xs text-gray-400 truncate">{song.artist || 'Unknown Artist'}</p>
        </div>

        <div className="flex items-center space-x-1 ml-2">
          <span className="text-xs text-gray-500 flex items-center">
            <FaClock className="mr-1" /> {song.duration}
          </span>

          {isHovered && (
            <>
              <button
                onClick={onToggleFavorite}
                className="p-1.5 text-gray-400 hover:text-secondary-500 transition-colors duration-200"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite ? <FaHeart className="text-secondary-500" /> : <FaRegHeart />}
              </button>

              <button
                onClick={() => onAddToQueue?.()}
                className="p-1.5 text-gray-400 hover:text-primary-500 transition-colors duration-200"
                aria-label="Add to queue"
              >
                <FaPlus />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Standard card layout
  return (
    <div
      className="card-3d group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video rounded-t-xl overflow-hidden">
        <Image
          src={song.thumbnailUrl}
          alt={song.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={onPlay}
            className="relative group/play"
            aria-label="Play song"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full opacity-0 group-hover:opacity-75 blur-md transition-opacity duration-300"></div>
            <div className="relative bg-white/20 backdrop-blur-sm text-white p-4 rounded-full flex items-center justify-center w-16 h-16 transform scale-90 group-hover:scale-100 transition-all duration-300 z-10">
              <FaPlay className="ml-1 text-xl" />
            </div>
          </button>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center">
          <FaClock className="mr-1 text-gray-400" /> {song.duration}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-2">
            <h3 className="font-medium text-white text-lg truncate group-hover:text-primary-400 transition-colors duration-300">{song.title}</h3>
            <p className="text-sm text-gray-400 truncate">{song.artist || 'Unknown Artist'}</p>
          </div>

          <div className="flex items-center">
            <button
              onClick={onToggleFavorite}
              className="text-lg p-2 transition-transform duration-200 hover:scale-110"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? (
                <FaHeart className="text-secondary-500 animate-pulse" />
              ) : (
                <FaRegHeart className="text-gray-400 hover:text-secondary-500" />
              )}
            </button>

            <div className="relative" ref={optionsRef}>
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="text-lg p-2 text-gray-400 hover:text-white transition-transform duration-200 hover:scale-110"
                aria-label="More options"
              >
                <FaEllipsisH />
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-1 w-48 glass rounded-xl shadow-neon py-2 z-20 animate-fade-in">
                  <button
                    onClick={() => {
                      onAddToQueue?.();
                      setShowOptions(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50"
                  >
                    <FaPlus className="mr-2 text-primary-500" /> Add to Queue
                  </button>
                  <button
                    onClick={() => {
                      onAddToPlaylist?.();
                      setShowOptions(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50"
                  >
                    <FaMusic className="mr-2 text-secondary-500" /> Add to Playlist
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-1" />
            <span>Added {formatDate(song.addedAt)}</span>
          </div>

          <div className="flex items-center">
            <Image
              src={song.addedBy.image}
              alt={song.addedBy.name}
              width={16}
              height={16}
              className="rounded-full mr-1"
            />
            <span>{song.addedBy.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
