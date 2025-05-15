'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeDown, FaVolumeMute, FaRandom, FaRedo, FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdOutlineLyrics, MdQueueMusic, MdFullscreen } from 'react-icons/md';
import { Song } from '../types';

interface PlayerControlsProps {
  currentSong?: Song;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleLyrics: () => void;
  showLyrics: boolean;
  volume: number;
  progress: number;
  duration: number;
  onSeek: (time: number) => void;
}

export default function PlayerControls({
  currentSong,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onVolumeChange,
  onToggleLyrics,
  showLyrics,
  volume,
  progress,
  duration,
  onSeek
}: PlayerControlsProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle volume icon based on volume level
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <FaVolumeMute />;
    if (volume < 0.5) return <FaVolumeDown />;
    return <FaVolumeUp />;
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange(previousVolume);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      onVolumeChange(0);
    }
  };

  // Handle shuffle toggle
  const handleShuffleToggle = () => {
    setIsShuffleOn(!isShuffleOn);
    // Implement shuffle logic in parent component
  };

  // Handle repeat toggle
  const handleRepeatToggle = () => {
    setIsRepeatOn(!isRepeatOn);
    // Implement repeat logic in parent component
  };

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // Implement favorite logic in parent component
  };

  // Handle progress bar click
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const newTime = percentage * duration;

    onSeek(newTime);
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 glass border-t border-gray-700 z-50 transition-all duration-300 ${
        isExpanded ? 'h-96' : 'h-auto'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Progress Bar - Always visible */}
        <div
          ref={progressBarRef}
          className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden cursor-pointer mb-3"
          onClick={handleProgressBarClick}
        >
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"></div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Song Info */}
          <div className="col-span-12 md:col-span-3 flex items-center">
            {currentSong ? (
              <>
                <div className="relative w-14 h-14 rounded-lg overflow-hidden mr-3 shadow-lg">
                  <Image
                    src={currentSong.thumbnailUrl}
                    alt={currentSong.title}
                    width={56}
                    height={56}
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <div className="truncate">
                  <p className="font-medium text-white truncate">{currentSong.title}</p>
                  <p className="text-sm text-gray-400 truncate">{currentSong.artist || 'Unknown Artist'}</p>
                </div>
                <button
                  onClick={handleFavoriteToggle}
                  className="ml-3 p-2 text-lg transition-colors duration-200"
                >
                  {isFavorite ? (
                    <FaHeart className="text-secondary-500 animate-pulse" />
                  ) : (
                    <FaRegHeart className="text-gray-400 hover:text-secondary-500" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-lg bg-gray-800/80 flex items-center justify-center mr-3">
                  <MdQueueMusic className="text-gray-600 text-2xl" />
                </div>
                <p className="text-gray-400">No song playing</p>
              </div>
            )}
          </div>

          {/* Main Controls */}
          <div className="col-span-12 md:col-span-6 flex justify-center">
            <div className="flex items-center justify-center gap-2 md:gap-4">
              <button
                onClick={handleShuffleToggle}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isShuffleOn
                    ? 'text-primary-500 bg-primary-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
                aria-label="Toggle shuffle"
              >
                <FaRandom />
              </button>
              <button
                onClick={onPrevious}
                className="text-xl p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200"
                disabled={!currentSong}
                aria-label="Previous song"
              >
                <FaStepBackward />
              </button>
              <button
                onClick={isPlaying ? onPause : onPlay}
                className={`relative group ${!currentSong ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!currentSong}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full opacity-75 group-hover:opacity-100 blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative z-10 bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 rounded-full flex items-center justify-center w-14 h-14 group-hover:from-primary-500 group-hover:to-secondary-500 transition-all duration-300">
                  {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                </div>
              </button>
              <button
                onClick={onNext}
                className="text-xl p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200"
                disabled={!currentSong}
                aria-label="Next song"
              >
                <FaStepForward />
              </button>
              <button
                onClick={handleRepeatToggle}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isRepeatOn
                    ? 'text-primary-500 bg-primary-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
                aria-label="Toggle repeat"
              >
                <FaRedo />
              </button>
            </div>
          </div>

          {/* Time and Volume Controls */}
          <div className="col-span-12 md:col-span-3 flex items-center justify-between md:justify-end gap-2 mt-2 md:mt-0">
            <div className="flex items-center text-xs text-gray-400 space-x-2">
              <span>{formatTime(progress)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggleLyrics}
                className={`p-2 rounded-full transition-all duration-200 ${
                  showLyrics
                    ? 'text-primary-500 bg-primary-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
                aria-label="Toggle lyrics"
              >
                <MdOutlineLyrics size={20} />
              </button>

              <div className="flex items-center gap-1 group relative">
                <button
                  onClick={handleMuteToggle}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {getVolumeIcon()}
                </button>
                <div className="hidden group-hover:block w-24 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 rounded-lg p-2 shadow-lg">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => {
                      const newVolume = parseFloat(e.target.value);
                      onVolumeChange(newVolume);
                      if (newVolume > 0 && isMuted) setIsMuted(false);
                    }}
                    className="w-full h-2 appearance-none bg-gray-700 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200"
                aria-label={isExpanded ? "Collapse player" : "Expand player"}
              >
                <MdFullscreen size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 h-64 overflow-y-auto">
            <div className="flex items-center justify-center">
              <div className="relative w-56 h-56 rounded-lg overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 animate-pulse"></div>
                {currentSong && (
                  <Image
                    src={currentSong.thumbnailUrl}
                    alt={currentSong.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between">
              {currentSong ? (
                <>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{currentSong.title}</h3>
                    <p className="text-lg text-gray-400">{currentSong.artist || 'Unknown Artist'}</p>

                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span>Added by {currentSong.addedBy.name}</span>
                    </div>
                  </div>

                  {showLyrics && (
                    <div className="mt-4 bg-gray-800/50 rounded-lg p-4 max-h-32 overflow-y-auto">
                      <h4 className="font-medium mb-2 text-primary-400">Lyrics</h4>
                      <p className="text-gray-300 text-sm">
                        Lyrics would be displayed here, synchronized with the song playback.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <MdQueueMusic className="text-gray-600 text-6xl mb-4" />
                  <p className="text-gray-400 text-lg">No song currently playing</p>
                  <p className="text-gray-500 text-sm mt-2">Add songs to the queue to get started</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
