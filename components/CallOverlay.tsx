import React, { useEffect, useRef } from 'react';
import { Phone, PhoneOff, Video, Mic, MicOff, VideoOff, Camera } from 'lucide-react';
import { useCall } from '../contexts/CallContext';

const CallOverlay: React.FC = () => {
  const { 
    callState, 
    answerCall, 
    endCall, 
    incomingCaller, 
    localStream, 
    remoteStream, 
    toggleMute, 
    toggleVideo, 
    isMuted, 
    isVideoOff 
  } = useCall();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (callState === 'idle') return null;

  // --- INCOMING CALL UI ---
  if (callState === 'incoming' && incomingCaller) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center w-80 animate-in fade-in zoom-in duration-300">
          <div className="relative mb-6">
             <img src={incomingCaller.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-gray-200" alt={incomingCaller.name} />
             <div className="absolute inset-0 rounded-full animate-ping border-2 border-blue-500"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900">{incomingCaller.name}</h3>
          <p className="text-gray-500 mb-8 mt-1">Incoming video call...</p>
          
          <div className="flex gap-10">
            <button 
                onClick={endCall}
                className="flex flex-col items-center gap-2 group"
            >
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:bg-red-600 transition-colors transform group-hover:scale-110 duration-200">
                    <PhoneOff className="w-8 h-8" />
                </div>
                <span className="text-xs font-semibold text-gray-400">Decline</span>
            </button>
            <button 
                onClick={answerCall}
                className="flex flex-col items-center gap-2 group"
            >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:bg-green-600 transition-colors animate-bounce">
                    <Video className="w-8 h-8" />
                </div>
                <span className="text-xs font-semibold text-gray-400">Accept</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE CALL UI ---
  return (
    <div className="fixed inset-0 z-[100] bg-gray-900 flex flex-col">
       {/* Main View Area */}
       <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black">
            
            {/* Remote Video (Full Screen) */}
            {remoteStream ? (
                <video 
                    ref={remoteVideoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                />
            ) : (
                // Loading / Calling State in Main View
                <div className="flex flex-col items-center justify-center h-full w-full bg-gray-900 animate-pulse">
                     <div className="relative mb-6">
                        <img src={incomingCaller?.avatar || 'https://ui-avatars.com/api/?name=User'} className="w-32 h-32 rounded-full border-4 border-gray-700 bg-gray-800" alt="Caller" />
                        {callState === 'calling' && <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping opacity-20"></div>}
                     </div>
                     <h2 className="text-white text-2xl font-bold mb-2">{incomingCaller?.name}</h2>
                     <p className="text-gray-400 text-lg">
                        {callState === 'calling' ? 'Calling...' : 'Connecting...'}
                     </p>
                </div>
            )}

            {/* Local Video (Picture in Picture) - Only show if we have a stream */}
            {localStream && (
                <div className="absolute top-4 right-4 w-32 h-48 sm:w-48 sm:h-72 bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 z-10">
                    <video 
                        ref={localVideoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                        style={{ transform: 'scaleX(-1)' }} // Mirror effect
                    />
                    {isVideoOff && (
                        <div className="w-full h-full flex items-center justify-center flex-col gap-2">
                            <Camera className="w-8 h-8 text-gray-500" />
                            <span className="text-xs text-gray-500">Camera Off</span>
                        </div>
                    )}
                </div>
            )}
       </div>

       {/* Controls Bar */}
       <div className="h-24 bg-gray-900/90 backdrop-blur flex items-center justify-center gap-8 pb-4">
            <button 
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${isVideoOff ? 'bg-white text-gray-900' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                title="Toggle Camera"
            >
                {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>

            <button 
                onClick={endCall}
                className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-transform hover:scale-105 shadow-xl"
                title="End Call"
            >
                <PhoneOff className="w-10 h-10 fill-current" />
            </button>

            <button 
                onClick={toggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${isMuted ? 'bg-white text-gray-900' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                title="Toggle Microphone"
            >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
       </div>
    </div>
  );
};

export default CallOverlay;