export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string; 
  bio?: string;
  location?: string;
  coverPhoto?: string;
  work?: string;
  education?: string;
  friends?: string[]; // List of user IDs
  friendRequests?: string[]; // List of user IDs who sent requests
}

export interface Story {
  id: string;
  userId: string;
  user?: User; // Hydrated on client
  image: string;
  timestamp: any; // Firestore Timestamp
}

export interface Comment {
  id: string;
  userId: string;
  user?: User; // Hydrated on client
  text: string;
  timestamp: string;
}

export interface PostData {
  id: string;
  userId: string;
  user: User; // Hydrated on client
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isSaved?: boolean;
  commentsList?: Comment[];
}

export interface Notification {
  id: string;
  userId: string; // The recipient
  senderId: string; // The actor
  user: User; // The actor hydrated
  type: 'like' | 'comment' | 'share' | 'friend_request' | 'group_invite' | 'mention';
  text: string;
  time: string;
  timestamp: any;
  isRead: boolean;
  linkId?: string; // ID of post/group/etc
}

export interface Group {
  id: string;
  name: string;
  members: string[]; // array of IDs
  image: string;
  isJoined?: boolean; // Client side logic
  description?: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  sellerId: string;
  seller?: User;
  category: string;
  timestamp?: any;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
  isRead: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  interested: string[]; // Array of User IDs
  status?: 'going' | 'interested' | 'not_going' | null;
}

export interface Game {
  id: string;
  name: string;
  image: string;
  players: string; // formatted string e.g "1.2k playing"
  category: string;
  isLive?: boolean;
  streamer?: string;
  streamUrl?: string;
}

export interface VideoItem {
  id: string;
  creatorId: string;
  creator?: User;
  title: string;
  thumbnail: string;
  videoUrl?: string; // Optional if we just simulate playback
  views: string;
  timestamp: string;
}