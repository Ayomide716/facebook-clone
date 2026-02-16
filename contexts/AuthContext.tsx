import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { auth, db } from '../lib/firebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    updateProfile,
    signInAnonymously
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  loginGuest: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUser({
                    id: firebaseUser.uid,
                    name: userData.name || firebaseUser.displayName || 'User',
                    email: firebaseUser.email || '',
                    avatar: userData.avatar || firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=random`,
                    bio: userData.bio || '',
                    location: userData.location || '',
                    work: userData.work || '',
                    education: userData.education || '',
                    coverPhoto: userData.coverPhoto || '',
                    friends: userData.friends || []
                });
            } else {
                // If doc doesn't exist (e.g. anonymous), create a basic one in state
                setUser({
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || 'Guest User',
                    email: '',
                    avatar: `https://ui-avatars.com/api/?name=Guest&background=random`,
                    friends: []
                });
            }
        } catch (e) {
            console.error("Error fetching user profile:", e);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to login");
    } finally {
        setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: name });
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name,
            email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            friends: [],
            createdAt: new Date().toISOString()
        });

    } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to create account");
    } finally {
        setIsLoading(false);
    }
  };

  const loginGuest = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const { user } = await signInAnonymously(auth);
        // Create a temporary doc for guest so app doesn't crash on profile read
        await setDoc(doc(db, 'users', user.uid), {
            name: 'Guest User',
            avatar: `https://ui-avatars.com/api/?name=Guest&background=random`,
            friends: [],
            createdAt: new Date().toISOString()
        });
    } catch (e: any) {
        setError(e.message || "Guest login failed");
    } finally {
        setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginGuest, logout, isLoading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};