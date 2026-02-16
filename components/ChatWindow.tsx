import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Send, Phone, Video, MoreHorizontal, ThumbsUp } from 'lucide-react';
import { useMessage } from '../contexts/MessageContext';
import { useCall } from '../contexts/CallContext';
import { useAuth } from '../contexts/AuthContext';

const ChatWindow: React.FC = () => {
  const { activeChatUser, closeChat, sendMessage, getConversation, markAsRead } = useMessage();
  const { callUser } = useCall();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = activeChatUser ? getConversation(activeChatUser.id) : [];

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  // Mark messages as read when window is open and conversation changes
  useEffect(() => {
      if (activeChatUser) {
          markAsRead(activeChatUser.id);
      }
  }, [conversation.length, activeChatUser]);

  if (!activeChatUser || !user) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleVideoCall = () => {
      callUser(activeChatUser.id, true);
  };

  const handleAudioCall = () => {
      callUser(activeChatUser.id, false);
  };

  return (
    <div className="fixed bottom-0 right-4 md:right-20 w-80 bg-white rounded-t-xl shadow-2xl z-40 flex flex-col border border-gray-200 h-[450px]">
      {/* Header */}
      <div className="flex items-center justify-between p-2 px-3 border-b border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 rounded-t-xl bg-white z-10">
        <div className="flex items-center gap-2">
            <div className="relative">
                <img src={activeChatUser.avatar} alt={activeChatUser.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
                <h4 className="font-bold text-[15px] text-gray-900 leading-tight">{activeChatUser.name}</h4>
                <p className="text-[11px] text-gray-500 leading-tight">Active now</p>
            </div>
        </div>
        <div className="flex items-center gap-1 text-[#1877F2]">
            <button onClick={handleAudioCall} className="p-1.5 hover:bg-gray-100 rounded-full"><Phone className="w-5 h-5" /></button>
            <button onClick={handleVideoCall} className="p-1.5 hover:bg-gray-100 rounded-full"><Video className="w-5 h-5" /></button>
            <button onClick={closeChat} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 ml-1"><X className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-white">
          <div className="flex flex-col items-center mt-4 mb-6 text-center">
               <img src={activeChatUser.avatar} className="w-16 h-16 rounded-full object-cover mb-2 border border-gray-200" />
               <h4 className="font-bold text-gray-900">{activeChatUser.name}</h4>
               <p className="text-xs text-gray-500">You're friends on SocialConnect</p>
               <p className="text-xs text-gray-400 mt-1">{activeChatUser.location} · {activeChatUser.work}</p>
          </div>

          {conversation.map((msg) => {
              const isMe = msg.senderId === user.id;
              return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1 group`}>
                      {!isMe && (
                          <img src={activeChatUser.avatar} className="w-7 h-7 rounded-full object-cover self-end mr-2 mb-1" />
                      )}
                      <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-[15px] ${isMe ? 'bg-[#1877F2] text-white' : 'bg-[#F0F2F5] text-gray-900'}`}>
                          {msg.text}
                      </div>
                  </div>
              )
          })}
          <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-100">
          <form onSubmit={handleSend} className="flex items-center gap-2">
              <div className="flex-1 bg-[#F0F2F5] rounded-full px-3 py-2 flex items-center">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Aa"
                    className="bg-transparent border-none outline-none w-full text-sm"
                  />
                  <div className="flex items-center gap-1 text-[#1877F2]">
                      <div className="cursor-pointer hover:bg-gray-200 rounded-full p-1"><ThumbsUp className="w-5 h-5" /></div>
                  </div>
              </div>
              <button 
                type="submit" 
                disabled={!inputText.trim()}
                className={`p-2 rounded-full transition-colors ${inputText.trim() ? 'text-[#1877F2] hover:bg-blue-50' : 'text-gray-300 cursor-default'}`}
              >
                  <Send className="w-5 h-5 fill-current" />
              </button>
          </form>
      </div>
    </div>
  );
};

export default ChatWindow;