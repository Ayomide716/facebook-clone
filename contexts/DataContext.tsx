import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PostData, User, Notification, Group, MarketplaceItem, Event, Game, Story, VideoItem } from '../types';
import { useAuth } from './AuthContext';
import { db, storage } from '../lib/firebase';
import { 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot, 
    doc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove, 
    serverTimestamp, 
    getDocs,
    deleteDoc,
    setDoc,
    where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface DataContextType {
  currentUser: User;
  posts: PostData[];
  stories: Story[];
  notifications: Notification[];
  searchQuery: string;
  groups: Group[];
  marketplaceItems: MarketplaceItem[];
  friends: User[];
  allUsers: User[];
  events: Event[];
  games: Game[];
  videos: VideoItem[];
  friendRequests: User[];
  
  setSearchQuery: (query: string) => void;
  addPost: (content: string, image: string | null) => Promise<void>;
  addStory: (image: string) => Promise<void>;
  toggleLike: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  sharePost: (postId: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  toggleGroupJoin: (groupId: string) => void;
  toggleFriend: (targetUserId: string) => Promise<void>;
  getUser: (id: string) => User | undefined;
  createGroup: (name: string, image: string) => void;
  createMarketplaceItem: (title: string, price: number, location: string, image: string, category: string) => void;
  toggleEventStatus: (eventId: string, status: 'going' | 'interested' | 'not_going' | null) => void;
  respondToFriendRequest: (userId: string, accept: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [posts, setPosts] = useState<PostData[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch Users
  useEffect(() => {
      const q = query(collection(db, 'users'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
          const users: User[] = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
          } as User));
          setAllUsers(users);
      });
      return () => unsubscribe();
  }, []);

  // 2. Fetch Posts
  useEffect(() => {
      const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
          const postsData = await Promise.all(snapshot.docs.map(async (docSnap) => {
              const data = docSnap.data();
              const likesSnap = await getDocs(collection(docSnap.ref, 'likes'));
              const commentsSnap = await getDocs(collection(docSnap.ref, 'comments'));
              
              const isLiked = likesSnap.docs.some(d => d.id === user?.id);
              
              const commentsList = commentsSnap.docs.map(c => {
                   const cData = c.data();
                   const cUser = allUsers.find(u => u.id === cData.userId) || { id: cData.userId, name: 'User', avatar: '' } as User;
                   return {
                       id: c.id,
                       userId: cData.userId,
                       user: cUser,
                       text: cData.text,
                       timestamp: cData.timestamp ? new Date(cData.timestamp.toDate()).toLocaleDateString() : 'Just now',
                   };
              });

              const author = allUsers.find(u => u.id === data.userId) || {
                  id: data.userId,
                  name: data.userName || 'Unknown',
                  avatar: data.userAvatar || ''
              } as User;

              return {
                  id: docSnap.id,
                  userId: data.userId,
                  user: author,
                  content: data.content,
                  image: data.image,
                  timestamp: data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : 'Just now',
                  likes: likesSnap.size,
                  comments: commentsSnap.size,
                  shares: data.shares || 0,
                  isLiked,
                  isSaved: false, // Could be impl via subcollection 'saves'
                  commentsList
              } as PostData;
          }));
          setPosts(postsData);
      });
      return () => unsubscribe();
  }, [user, allUsers]);

  // 3. Fetch Stories
  useEffect(() => {
      // Get stories from last 24h
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const q = query(collection(db, 'stories'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
          const validStories = snapshot.docs.map(doc => {
              const data = doc.data();
              const storyUser = allUsers.find(u => u.id === data.userId) || { id: data.userId, name: 'User', avatar: '' } as User;
              return {
                  id: doc.id,
                  userId: data.userId,
                  user: storyUser,
                  image: data.image,
                  timestamp: data.timestamp
              } as Story;
          }).filter(s => {
             // Simple client side filter for demo if server timestamp index missing
             if(!s.timestamp) return true;
             return s.timestamp.toDate() > yesterday;
          });
          setStories(validStories);
      });
      return () => unsubscribe();
  }, [allUsers]);

  // 4. Fetch Notifications for Current User
  useEffect(() => {
      if(!user) return;
      const q = query(collection(db, 'notifications'), where('userId', '==', user.id), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
          const notifs = snapshot.docs.map(doc => {
              const data = doc.data();
              const sender = allUsers.find(u => u.id === data.senderId) || { id: data.senderId, name: 'User', avatar: '' } as User;
              return {
                  id: doc.id,
                  ...data,
                  user: sender,
                  time: data.timestamp ? new Date(data.timestamp.toDate()).toLocaleDateString() : 'Now'
              } as Notification;
          });
          setNotifications(notifs);
      });
      return () => unsubscribe();
  }, [user, allUsers]);

  // 5. Fetch Other Collections
  useEffect(() => {
      const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
          setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() } as Group)));
      });
      const unsubMarket = onSnapshot(collection(db, 'marketplace'), (snap) => {
          setMarketplaceItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as MarketplaceItem)));
      });
      const unsubEvents = onSnapshot(collection(db, 'events'), (snap) => {
          setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() } as Event)));
      });
      const unsubGames = onSnapshot(collection(db, 'games'), (snap) => {
          setGames(snap.docs.map(d => ({ id: d.id, ...d.data() } as Game)));
      });
      
      // Since "Watch" videos are static in previous code, let's create a collection or just use a robust seed if DB empty.
      // For now we'll just query a 'videos' collection
      const unsubVideos = onSnapshot(collection(db, 'videos'), (snap) => {
          setVideos(snap.docs.map(d => {
              const data = d.data();
              const creator = allUsers.find(u => u.id === data.creatorId);
              return { id: d.id, ...data, creator } as VideoItem;
          }));
      });

      return () => {
          unsubGroups();
          unsubMarket();
          unsubEvents();
          unsubGames();
          unsubVideos();
      }
  }, [allUsers]);


  if (!user) return null;

  // Derived State
  const friends = allUsers.filter(u => user.friends?.includes(u.id));
  const friendRequests = allUsers.filter(u => user.friendRequests?.includes(u.id));

  // --- ACTIONS ---

  const addPost = async (content: string, image: string | null) => {
      try {
          let imageUrl = null;
          if (image) {
              const blob = await (await fetch(image)).blob();
              const storageRef = ref(storage, `posts/${user.id}/${Date.now()}.jpg`);
              await uploadBytes(storageRef, blob);
              imageUrl = await getDownloadURL(storageRef);
          }

          await addDoc(collection(db, 'posts'), {
              userId: user.id,
              content,
              image: imageUrl,
              timestamp: serverTimestamp(),
              shares: 0
          });
      } catch (e) {
          console.error("Error posting:", e);
      }
  };

  const addStory = async (image: string) => {
       try {
          const blob = await (await fetch(image)).blob();
          const storageRef = ref(storage, `stories/${user.id}/${Date.now()}.jpg`);
          await uploadBytes(storageRef, blob);
          const imageUrl = await getDownloadURL(storageRef);
          
          await addDoc(collection(db, 'stories'), {
              userId: user.id,
              image: imageUrl,
              timestamp: serverTimestamp()
          });
      } catch (e) {
          console.error("Error creating story:", e);
      }
  }

  const toggleLike = async (postId: string) => {
      const likeRef = doc(db, 'posts', postId, 'likes', user.id);
      const docSnap = await getDocs(query(collection(db, 'posts', postId, 'likes'), where('__name__', '==', user.id)));
      
      const post = posts.find(p => p.id === postId);
      
      if (!docSnap.empty) {
          await deleteDoc(likeRef);
      } else {
          await setDoc(likeRef, { timestamp: serverTimestamp() });
          // Send notification to post owner
          if (post && post.userId !== user.id) {
              await addDoc(collection(db, 'notifications'), {
                  userId: post.userId,
                  senderId: user.id,
                  type: 'like',
                  text: 'liked your post.',
                  timestamp: serverTimestamp(),
                  isRead: false,
                  linkId: postId
              });
          }
      }
  };

  const addComment = async (postId: string, text: string) => {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
          userId: user.id,
          text,
          timestamp: serverTimestamp()
      });
      const post = posts.find(p => p.id === postId);
      if (post && post.userId !== user.id) {
           await addDoc(collection(db, 'notifications'), {
              userId: post.userId,
              senderId: user.id,
              type: 'comment',
              text: 'commented on your post.',
              timestamp: serverTimestamp(),
              isRead: false,
              linkId: postId
          });
      }
  };

  const toggleFriend = async (targetUserId: string) => {
      const myRef = doc(db, 'users', user.id);
      const targetRef = doc(db, 'users', targetUserId);
      
      const isFriend = user.friends?.includes(targetUserId);
      const hasSentRequest = false; // Need complex check for outgoing request, simplified here
      
      if (isFriend) {
          // Unfriend
          await updateDoc(myRef, { friends: arrayRemove(targetUserId) });
          await updateDoc(targetRef, { friends: arrayRemove(user.id) });
      } else {
          // Send Request
          // Check if already sent? For now just arrayUnion on target's friendRequests
          await updateDoc(targetRef, {
              friendRequests: arrayUnion(user.id)
          });
          
          await addDoc(collection(db, 'notifications'), {
              userId: targetUserId,
              senderId: user.id,
              type: 'friend_request',
              text: 'sent you a friend request.',
              timestamp: serverTimestamp(),
              isRead: false
          });
      }
  };

  const respondToFriendRequest = async (targetUserId: string, accept: boolean) => {
      const myRef = doc(db, 'users', user.id);
      const targetRef = doc(db, 'users', targetUserId);

      // Remove from requests in any case
      await updateDoc(myRef, {
          friendRequests: arrayRemove(targetUserId)
      });

      if (accept) {
          // Add to friends for both
          await updateDoc(myRef, { friends: arrayUnion(targetUserId) });
          await updateDoc(targetRef, { friends: arrayUnion(user.id) });
          
          await addDoc(collection(db, 'notifications'), {
              userId: targetUserId,
              senderId: user.id,
              type: 'friend_request', // reusing type or 'friend_accept'
              text: 'accepted your friend request.',
              timestamp: serverTimestamp(),
              isRead: false
          });
      }
  };

  const toggleGroupJoin = async (groupId: string) => {
      const groupRef = doc(db, 'groups', groupId);
      const group = groups.find(g => g.id === groupId);
      if(!group) return;

      const isMember = group.members.includes(user.id);
      
      if (isMember) {
          await updateDoc(groupRef, { members: arrayRemove(user.id) });
      } else {
          await updateDoc(groupRef, { members: arrayUnion(user.id) });
      }
  };

  const createGroup = async (name: string, image: string) => {
       await addDoc(collection(db, 'groups'), {
           name,
           image: image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
           members: [user.id],
           description: 'New group'
       });
  }

  const createMarketplaceItem = async (title: string, price: number, location: string, image: string, category: string) => {
      await addDoc(collection(db, 'marketplace'), {
          title, price, location, 
          image: image || 'https://via.placeholder.com/150',
          category,
          sellerId: user.id,
          timestamp: serverTimestamp()
      });
  }

  const toggleEventStatus = async (eventId: string, status: any) => {
      const eventRef = doc(db, 'events', eventId);
      const event = events.find(e => e.id === eventId);
      if(!event) return;
      
      // Simple logic: if status is passed, add user to 'interested', else remove
      if (status) {
          await updateDoc(eventRef, { interested: arrayUnion(user.id) });
      } else {
          await updateDoc(eventRef, { interested: arrayRemove(user.id) });
      }
  };

  const markNotificationRead = async (id: string) => {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
  }

  const markAllNotificationsRead = async () => {
      const batch = notifications.filter(n => !n.isRead);
      // In production use batch writes, here simple loop
      batch.forEach(n => markNotificationRead(n.id));
  }

  const deleteNotification = async (id: string) => {
      await deleteDoc(doc(db, 'notifications', id));
  }

  // --- Utility ---
  
  const updateUserProfile = async (updates: Partial<User>) => {
      await updateDoc(doc(db, 'users', user.id), updates);
  };

  const toggleSavePost = (postId: string) => {
      // Local placeholder for save post functionality as schema wasn't fully defined
      setPosts(prev => prev.map(p => p.id === postId ? {...p, isSaved: !p.isSaved} : p));
  };
  
  const sharePost = () => alert("Shared!"); // Stub

  const getUser = (id: string) => {
      if (id === user.id) return user;
      return allUsers.find(u => u.id === id);
  }

  return (
    <DataContext.Provider value={{ 
      currentUser: user, 
      posts, 
      stories,
      notifications, 
      searchQuery, 
      groups,
      marketplaceItems,
      friends,
      allUsers,
      events,
      games,
      videos,
      friendRequests,
      setSearchQuery,
      addPost,
      addStory,
      toggleLike,
      toggleSavePost,
      addComment,
      sharePost,
      updateUserProfile,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      toggleGroupJoin,
      toggleFriend,
      getUser,
      createGroup,
      createMarketplaceItem,
      toggleEventStatus,
      respondToFriendRequest
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};