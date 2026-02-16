import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import { User } from '../types';

interface CallContextType {
  callUser: (receiverId: string, isVideo: boolean) => Promise<void>;
  answerCall: () => void;
  endCall: () => void;
  callState: 'idle' | 'calling' | 'incoming' | 'connected';
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  incomingCaller: User | null;
  isVideoCall: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
  isMuted: boolean;
  isVideoOff: boolean;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

// Prefix to avoid ID collisions on the public PeerJS server
const PEER_ID_PREFIX = 'socialconnect_v1_';

export const CallProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { allUsers } = useData(); // Use allUsers to resolve caller ID
  
  const [peer, setPeer] = useState<Peer | null>(null);
  const [callState, setCallState] = useState<'idle' | 'calling' | 'incoming' | 'connected'>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incomingCaller, setIncomingCaller] = useState<User | null>(null);
  const [activeCall, setActiveCall] = useState<MediaConnection | null>(null);
  const [isVideoCall, setIsVideoCall] = useState(true);
  
  // Media controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  // Refs for stable access in callbacks
  const peerInstanceRef = useRef<Peer | null>(null);
  const allUsersRef = useRef<User[]>([]);

  // Update ref when allUsers changes
  useEffect(() => {
    allUsersRef.current = allUsers;
  }, [allUsers]);

  // Initialize PeerJS when user logs in
  useEffect(() => {
    if (!user) return;

    // Only create peer if ID has changed or doesn't exist
    if (peerInstanceRef.current && peerInstanceRef.current.id === PEER_ID_PREFIX + user.id) {
        return;
    }
    
    // Clean up old peer if exists (unlikely given dependency logic, but safe)
    if (peerInstanceRef.current) {
        peerInstanceRef.current.destroy();
    }

    const newPeer = new Peer(PEER_ID_PREFIX + user.id);
    setPeer(newPeer);
    peerInstanceRef.current = newPeer;

    newPeer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });

    newPeer.on('call', async (call) => {
      // Incoming call
      const callerId = call.peer.replace(PEER_ID_PREFIX, '');
      
      // Resolve caller using Ref to avoid stale closure or dependency loop
      const knownUser = allUsersRef.current.find(u => u.id === callerId);
      const caller = knownUser || { 
          id: callerId, 
          name: 'Unknown User', 
          avatar: `https://ui-avatars.com/api/?name=Unknown&background=random` 
      } as User;
      
      setIncomingCaller(caller);
      setCallState('incoming');
      setActiveCall(call);

      if(call.metadata && call.metadata.type === 'audio') {
          setIsVideoCall(false);
      } else {
          setIsVideoCall(true);
      }
    });

    newPeer.on('error', (err) => {
        console.error("PeerJS Error:", err);
    });

    return () => {
      newPeer.destroy();
      peerInstanceRef.current = null;
    };
  }, [user?.id]); // Only re-run if user ID changes

  const startLocalStream = async (video: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video, audio: true });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error('Failed to get local stream', err);
      alert("Could not access camera/microphone. Please check permissions.");
      return null;
    }
  };

  const callUser = async (receiverId: string, isVideo: boolean) => {
    if (!peer) {
        alert("Connection not ready. Please wait a moment.");
        return;
    }
    
    setIsVideoCall(isVideo);
    setCallState('calling');
    
    // Optimistic resolution from current state
    const targetUser = allUsers.find(u => u.id === receiverId);
    setIncomingCaller(targetUser || { id: receiverId, name: 'User', avatar: '' } as User);

    const stream = await startLocalStream(isVideo);
    if (!stream) {
        setCallState('idle');
        return;
    }

    const call = peer.call(PEER_ID_PREFIX + receiverId, stream, {
        metadata: { type: isVideo ? 'video' : 'audio' }
    });
    
    setActiveCall(call);

    call.on('stream', (remoteStream) => {
      setRemoteStream(remoteStream);
      setCallState('connected');
    });

    call.on('close', () => {
      endCall();
    });
    
    call.on('error', (err) => {
        console.error("Call connection error:", err);
        alert("Could not connect to user. They might be offline.");
        endCall();
    });
  };

  const answerCall = async () => {
    if (!activeCall) return;

    const stream = await startLocalStream(isVideoCall);
    if (!stream) {
        endCall();
        return;
    }

    activeCall.answer(stream);
    setCallState('connected');

    activeCall.on('stream', (remoteStream) => {
      setRemoteStream(remoteStream);
    });

    activeCall.on('close', () => {
      endCall();
    });
  };

  const endCall = () => {
    if (activeCall) {
      activeCall.close();
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);
    setActiveCall(null);
    setCallState('idle');
    setIncomingCaller(null);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const toggleMute = () => {
      if (localStream) {
          localStream.getAudioTracks().forEach(track => {
              track.enabled = !track.enabled;
          });
          setIsMuted(!isMuted);
      }
  }

  const toggleVideo = () => {
      if (localStream) {
          localStream.getVideoTracks().forEach(track => {
              track.enabled = !track.enabled;
          });
          setIsVideoOff(!isVideoOff);
      }
  }

  return (
    <CallContext.Provider value={{ 
      callUser, 
      answerCall, 
      endCall, 
      callState, 
      localStream, 
      remoteStream,
      incomingCaller,
      isVideoCall,
      toggleMute,
      toggleVideo,
      isMuted,
      isVideoOff
    }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) throw new Error('useCall must be used within a CallProvider');
  return context;
};