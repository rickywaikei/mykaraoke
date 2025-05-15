'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export default function useSocket(roomId: string) {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!session || !roomId) return;

    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      query: {
        roomId,
        userId: session.user.id,
        userName: session.user.name,
        userImage: session.user.image,
      },
    });

    // Set up event listeners
    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Store socket in ref
    socketRef.current = socket;

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [session, roomId]);

  // Function to emit events
  const emit = (event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  // Function to listen for events
  const on = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  // Function to remove event listeners
  const off = (event: string) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    }
  };

  return { isConnected, emit, on, off };
}
