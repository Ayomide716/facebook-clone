import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, User } from '../types';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

interface MessageContextType {
  messages: Message[];
  activeChatUser: User | null;
  openChat: (user: User) => void;
  closeChat: () => void;
  sendMessage: (text: string) => Promise<void>;
  markAsRead: (senderId: string) => void;
  getConversation: (userId: string) => Message[];
  unreadCount: number;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);

  // Listen to messages where current user is sender OR receiver
  // Note: Firestore doesn't support logical OR easily in one stream without composite indexes or multiple queries.
  // We will run two listeners and merge them.
  useEffect(() => {
    if (!user) {
        setMessages([]);
        return;
    }

    const q1 = query(collection(db, 'messages'), where('senderId', '==', user.id));
    const q2 = query(collection(db, 'messages'), where('receiverId', '==', user.id));

    let sentMessages: Message[] = [];
    let receivedMessages: Message[] = [];

    const updateMessages = () => {
        const all = [...sentMessages, ...receivedMessages].sort((a, b) => a.timestamp - b.timestamp);
        // Dedupe by ID just in case
        const unique = Array.from(new Map(all.map(item => [item.id, item])).values());
        setMessages(unique);
    };

    const unsub1 = onSnapshot(q1, (snapshot) => {
        sentMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), timestamp: doc.data().timestamp?.toMillis() || Date.now() } as Message));
        updateMessages();
    });

    const unsub2 = onSnapshot(q2, (snapshot) => {
        receivedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), timestamp: doc.data().timestamp?.toMillis() || Date.now() } as Message));
        updateMessages();
    });

    return () => {
        unsub1();
        unsub2();
    };
  }, [user]);

  const openChat = (targetUser: User) => {
    setActiveChatUser(targetUser);
    markAsRead(targetUser.id);
  };

  const closeChat = () => {
    setActiveChatUser(null);
  };

  const sendMessage = async (text: string) => {
    if (!user || !activeChatUser) return;

    await addDoc(collection(db, 'messages'), {
      senderId: user.id,
      receiverId: activeChatUser.id,
      text,
      timestamp: serverTimestamp(),
      isRead: false
    });
  };

  const markAsRead = async (senderId: string) => {
    if (!user) return;
    
    // Find messages from this sender to me that are unread
    const unread = messages.filter(m => m.senderId === senderId && m.receiverId === user.id && !m.isRead);
    
    // Update them in Firestore
    unread.forEach(async (msg) => {
        const msgRef = doc(db, 'messages', msg.id);
        await updateDoc(msgRef, { isRead: true });
    });
  };

  const getConversation = (userId: string) => {
      if (!user) return [];
      return messages.filter(m => 
        (m.senderId === userId && m.receiverId === user.id) || 
        (m.senderId === user.id && m.receiverId === userId)
      ).sort((a, b) => a.timestamp - b.timestamp);
  };

  const unreadCount = user ? messages.filter(m => m.receiverId === user.id && !m.isRead).length : 0;

  return (
    <MessageContext.Provider value={{ 
      messages, 
      activeChatUser, 
      openChat, 
      closeChat, 
      sendMessage, 
      markAsRead, 
      getConversation,
      unreadCount
    }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) throw new Error('useMessage must be used within a MessageProvider');
  return context;
};