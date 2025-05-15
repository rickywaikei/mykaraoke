# MyKaraoke App

A web-based karaoke application that allows users to create rooms, share songs, and sing together in real-time.

## Features

- **User Authentication**: Sign in with Google account
- **Karaoke Rooms**: Create and join karaoke rooms
- **Song Queue**: Collaborative song queue management
- **Real-time Chat**: Chat with other participants in the room
- **YouTube Integration**: Search and play karaoke songs from YouTube
- **Playlists**: Create and manage personal song playlists
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Firebase Firestore
- **Real-time Communication**: Socket.IO
- **Video Playback**: YouTube iFrame API
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Google Developer account (for OAuth and YouTube API)
- Firebase account (for database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mykaraoke.git
   cd mykaraoke
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in the required environment variables:
     - Google OAuth credentials
     - YouTube API key
     - Firebase configuration
     - NextAuth secret

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Setting up OAuth and APIs

#### Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Create an OAuth 2.0 Client ID
5. Add authorized JavaScript origins: `http://localhost:3000`
6. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local` file

#### YouTube API

1. In the same Google Cloud project, navigate to "APIs & Services" > "Library"
2. Search for and enable the "YouTube Data API v3"
3. Create an API key
4. Copy the API key to your `.env.local` file

#### Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Set up Firestore database
4. Navigate to Project Settings > General
5. Scroll down to "Your apps" and add a web app
6. Copy the Firebase configuration to your `.env.local` file

## Deployment

The easiest way to deploy this application is using [Vercel](https://vercel.com/):

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set up the environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Firebase](https://firebase.google.com/)
- [Socket.IO](https://socket.io/)
- [YouTube API](https://developers.google.com/youtube/v3)
