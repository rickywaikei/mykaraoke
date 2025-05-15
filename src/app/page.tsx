'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";
import { FaMicrophone, FaMusic, FaStar, FaHeart, FaFire, FaRandom, FaPlay, FaUsers, FaGlobe } from "react-icons/fa";

// Define category data
const categories = [
  {
    id: 'popular',
    title: '热门歌曲',
    icon: <FaFire className="text-red-500 text-2xl" />,
    color: 'from-red-500 to-orange-500',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop'
  },
  {
    id: 'new',
    title: '热歌新歌',
    icon: <FaMusic className="text-blue-500 text-2xl" />,
    color: 'from-blue-500 to-indigo-500',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2670&auto=format&fit=crop'
  },
  {
    id: 'classics',
    title: '经典',
    icon: <FaStar className="text-yellow-500 text-2xl" />,
    color: 'from-yellow-500 to-amber-500',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2670&auto=format&fit=crop'
  },
  {
    id: 'favorites',
    title: '我的最爱',
    icon: <FaHeart className="text-pink-500 text-2xl" />,
    color: 'from-pink-500 to-rose-500',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2670&auto=format&fit=crop'
  },
  {
    id: 'variety',
    title: '综艺',
    icon: <FaRandom className="text-purple-500 text-2xl" />,
    color: 'from-purple-500 to-violet-500',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2670&auto=format&fit=crop'
  },
  {
    id: 'theme',
    title: '主题点',
    icon: <FaMicrophone className="text-green-500 text-2xl" />,
    color: 'from-green-500 to-emerald-500',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2670&auto=format&fit=crop'
  },
];

// Featured songs for the hero section
const featuredSongs = [
  {
    id: '1',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    image: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg',
  },
  {
    id: '2',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    image: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg',
  },
  {
    id: '3',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    image: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
  },
];

// Stats for the counter section
const stats = [
  { label: 'Active Users', value: 10000, icon: <FaUsers className="text-primary-500" /> },
  { label: 'Songs Available', value: 50000, icon: <FaMusic className="text-secondary-500" /> },
  { label: 'Countries', value: 120, icon: <FaGlobe className="text-blue-500" /> },
];

export default function Home() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));
  const statsRef = useRef<HTMLDivElement>(null);
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  // Auto-rotate featured songs
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSongIndex((prevIndex) => (prevIndex + 1) % featuredSongs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animate stats when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsStatsVisible(true);

          // Animate each stat from 0 to its target value
          stats.forEach((stat, index) => {
            const duration = 2000; // 2 seconds
            const steps = 50;
            const increment = stat.value / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.value) {
                current = stat.value;
                clearInterval(timer);
              }

              setAnimatedStats((prev) => {
                const newValues = [...prev];
                newValues[index] = Math.floor(current);
                return newValues;
              });
            }, duration / steps);
          });
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <Navbar />

      {/* Hero Section with Parallax Effect */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-gray-900/90 z-10"></div>
          <Image
            src={featuredSongs[currentSongIndex].image}
            alt="Hero background"
            fill
            className="object-cover object-center transition-opacity duration-1000"
            style={{ opacity: 0.6 }}
            priority
          />
        </div>

        <div className="container mx-auto px-4 z-10 py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text">Sing</span> Your Heart Out
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-xl">
                Create rooms, share songs, and enjoy karaoke with friends anywhere, anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/rooms/create"
                  className="btn btn-primary text-lg px-8 py-4 neon-glow"
                >
                  Create Room
                </Link>
                <Link
                  href="/rooms"
                  className="btn btn-outline text-lg px-8 py-4"
                >
                  Join Room
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 relative">
              <div className="relative w-full max-w-md mx-auto">
                {/* Floating album artwork with glow effect */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto animate-float">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg opacity-50 blur-xl"></div>
                  <div className="relative z-10 w-full h-full rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src={featuredSongs[currentSongIndex].image}
                      alt={featuredSongs[currentSongIndex].title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                        <FaPlay className="text-white text-3xl" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Song info */}
                <div className="text-center mt-6 animate-fade-in">
                  <h3 className="text-xl font-bold text-white">{featuredSongs[currentSongIndex].title}</h3>
                  <p className="text-gray-400">{featuredSongs[currentSongIndex].artist}</p>
                </div>

                {/* Song indicator dots */}
                <div className="flex justify-center mt-4 space-x-2">
                  {featuredSongs.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSongIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSongIndex
                          ? 'bg-primary-500 w-6'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section with 3D Cards */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Explore Categories</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Find the perfect karaoke songs for your next session
            </p>
          </div>

          <div className="relative overflow-hidden">
            {/* 3D Card Effect for Categories */}
            <div className="flex justify-center perspective-1000">
              <div className="relative w-full max-w-6xl">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                  {categories.map((category, index) => (
                    <Link
                      href={`/songs/${category.id}`}
                      key={category.id}
                      className="card-3d group"
                    >
                      <div className="relative h-60 md:h-72 rounded-xl overflow-hidden">
                        <div className="absolute inset-0">
                          <Image
                            src={category.image}
                            alt={category.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                          <div className={`mb-3 bg-gradient-to-r ${category.color} p-4 rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-110`}>
                            {category.icon}
                          </div>
                          <h3 className="text-white text-xl font-bold text-center">{category.title}</h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="text-4xl">{stat.icon}</div>
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 gradient-text">
                  {formatNumber(animatedStats[index])}+
                </div>
                <p className="text-xl text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get started with MyKaraoke in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-700"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-600 to-primary-800 flex items-center justify-center mx-auto mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Create or Join a Room</h3>
                <p className="text-gray-300 leading-relaxed">
                  Start your own karaoke party or join an existing one with friends. Invite others using a simple room code.
                </p>
              </div>
            </div>

            <div className="card p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary-500 to-secondary-700"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-secondary-600 to-secondary-800 flex items-center justify-center mx-auto mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Add Songs to Queue</h3>
                <p className="text-gray-300 leading-relaxed">
                  Search for your favorite karaoke songs and add them to the shared queue. Everyone can contribute their picks.
                </p>
              </div>
            </div>

            <div className="card p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center mx-auto mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Sing Together</h3>
                <p className="text-gray-300 leading-relaxed">
                  Enjoy singing with synchronized lyrics and video playback. The room owner can cast to a TV for the full experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-secondary-900/50 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Start Your Karaoke Party?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users already singing their hearts out on MyKaraoke
            </p>
            <Link
              href="/rooms/create"
              className="btn btn-primary text-lg px-8 py-4 neon-glow"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-md py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full opacity-75 blur-sm"></div>
                  <FaMicrophone className="h-6 w-6 text-white relative z-10" />
                </div>
                <span className="ml-2 text-xl font-bold gradient-text">MyKaraoke</span>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-6 md:mb-0">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                About
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                Contact
              </Link>
            </div>

            <div className="text-gray-400">
              <p>© {new Date().getFullYear()} MyKaraoke. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
