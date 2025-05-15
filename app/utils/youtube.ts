import { Song } from '../types';

// YouTube API search function
export async function searchYouTubeKaraoke(query: string): Promise<Song[]> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
        query + ' karaoke'
      )}&type=video&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from YouTube API');
    }

    const data = await response.json();
    
    // Get video details to get duration
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${apiKey}`
    );
    
    if (!videoDetailsResponse.ok) {
      throw new Error('Failed to fetch video details from YouTube API');
    }
    
    const videoDetailsData = await videoDetailsResponse.json();
    
    // Map the video details to our Song type
    const songs: Song[] = data.items.map((item: any, index: number) => {
      const videoDetail = videoDetailsData.items.find(
        (detail: any) => detail.id === item.id.videoId
      );
      
      // Parse ISO 8601 duration to minutes:seconds format
      const duration = videoDetail?.contentDetails?.duration || 'PT0M0S';
      const durationMatch = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      const hours = durationMatch[1] ? parseInt(durationMatch[1]) : 0;
      const minutes = durationMatch[2] ? parseInt(durationMatch[2]) : 0;
      const seconds = durationMatch[3] ? parseInt(durationMatch[3]) : 0;
      
      const formattedDuration = hours > 0
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        videoId: item.id.videoId,
        duration: formattedDuration,
        addedBy: {
          id: 'system',
          name: 'System',
          image: '/images/system-avatar.png',
        },
        addedAt: new Date(),
      };
    });
    
    return songs;
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return [];
  }
}

// Get video details
export async function getYouTubeVideoDetails(videoId: string): Promise<Song | null> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch video details from YouTube API');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }
    
    const videoDetail = data.items[0];
    const snippet = videoDetail.snippet;
    
    // Parse ISO 8601 duration to minutes:seconds format
    const duration = videoDetail.contentDetails.duration || 'PT0M0S';
    const durationMatch = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = durationMatch[1] ? parseInt(durationMatch[1]) : 0;
    const minutes = durationMatch[2] ? parseInt(durationMatch[2]) : 0;
    const seconds = durationMatch[3] ? parseInt(durationMatch[3]) : 0;
    
    const formattedDuration = hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    return {
      id: videoId,
      title: snippet.title,
      artist: snippet.channelTitle,
      thumbnailUrl: snippet.thumbnails.high.url,
      videoId: videoId,
      duration: formattedDuration,
      addedBy: {
        id: 'system',
        name: 'System',
        image: '/images/system-avatar.png',
      },
      addedAt: new Date(),
    };
  } catch (error) {
    console.error('Error getting YouTube video details:', error);
    return null;
  }
}
