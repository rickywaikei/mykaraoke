import { Session } from 'next-auth';

// Extend the Session type to include accessToken
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
  }
}

// Song type
export interface Song {
  id: string;
  title: string;
  artist?: string;
  thumbnailUrl: string;
  videoId: string;
  duration: string;
  addedBy: {
    id: string;
    name: string;
    image: string;
  };
  addedAt: Date;
}

// Playlist type
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  createdBy: {
    id: string;
    name: string;
    image: string;
  };
  createdAt: Date;
  isPublic: boolean;
}

// Room type
export interface Room {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  ownerName: string;
  ownerImage: string;
  participants: {
    id: string;
    name: string;
    image: string;
  }[];
  queue: Song[];
  currentSong?: Song;
  isPlaying: boolean;
  createdAt: Date;
  isPublic: boolean;
  code: string;
}

// Message type for chat
export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderImage: string;
  roomId: string;
  createdAt: Date;
}
