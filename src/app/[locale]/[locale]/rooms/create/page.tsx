'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaLock, FaUnlock, FaArrowLeft } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

export default function CreateRoomPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle toggle for public/private
  const handleTogglePublic = () => {
    setFormData({
      ...formData,
      isPublic: !formData.isPublic,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error('You must be signed in to create a room');
      return;
    }
    
    if (!formData.name.trim()) {
      toast.error('Room name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, send data to API
      console.log('Creating room:', formData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Room created successfully!');
      router.push('/rooms/123'); // In a real app, redirect to the created room
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white mb-6"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Create a Karaoke Room</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Room Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter a name for your room"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your karaoke room (optional)"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-24"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Room Privacy
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={handleTogglePublic}
                    className={`flex items-center px-4 py-2 rounded-lg mr-4 ${
                      formData.isPublic
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    <FaUnlock className="mr-2" /> Public
                  </button>
                  <button
                    type="button"
                    onClick={handleTogglePublic}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                      !formData.isPublic
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    <FaLock className="mr-2" /> Private
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {formData.isPublic
                    ? 'Anyone can find and join your room'
                    : 'Only people with the room code can join'}
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/rooms')}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white mr-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Room'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
