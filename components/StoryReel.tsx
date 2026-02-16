import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Heart, Send } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Story } from '../types';

const StoryCard: React.FC<{ image: string, profileSrc: string, title: string, onClick: () => void }> = ({ image, profileSrc, title, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className="relative h-48 w-28 sm:h-64 sm:w-36 min-w-[112px] sm:min-w-[144px] bg-gray-200 rounded-xl cursor-pointer overflow-hidden group shadow-sm hover:opacity-90 flex-shrink-0"
    >
        <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-[#1877F2] overflow-hidden bg-white z-10">
             <img src={profileSrc} className="w-full h-full object-cover" alt={title} />
        </div>
        <h4 className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 text-white font-bold text-xs sm:text-[13px] leading-tight z-10 truncate max-w-[90%]">{title}</h4>
    </div>
  );
};

const CreateStoryCard: React.FC<{ onAdd: (file: File) => void }> = ({ onAdd }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { currentUser } = useData();

    return (
        <div 
            className="relative h-48 w-28 sm:h-64 sm:w-36 min-w-[112px] sm:min-w-[144px] bg-white rounded-xl cursor-pointer shadow-sm overflow-hidden group border border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
        >
            <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={(e) => {
                    if(e.target.files?.[0]) onAdd(e.target.files[0]);
                }} 
            />
            <div className="h-[65%] w-full overflow-hidden">
                <img 
                    src={currentUser.avatar} 
                    alt="Current User" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
            </div>
            <div className="h-[35%] bg-white relative flex flex-col items-center justify-end pb-3">
                 <div className="absolute -top-4 sm:-top-5 left-1/2 transform -translate-x-1/2 bg-[#1877F2] rounded-full p-1 border-4 border-white">
                    <Plus className="text-white w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
                 </div>
                 <div className="text-center px-1">
                    <p className="text-xs sm:text-[13px] font-bold text-gray-900 leading-tight">Create story</p>
                 </div>
            </div>
        </div>
    )
}

const StoryViewer: React.FC<{ story: Story | null, onClose: () => void, onNext: () => void, onPrev: () => void }> = ({ story, onClose, onNext, onPrev }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!story) return;
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    onNext();
                    return 0;
                }
                return p + 1;
            });
        }, 50);
        return () => clearInterval(interval);
    }, [story]);

    if (!story) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-cover bg-center blur-md opacity-50 transform scale-110"
                style={{ backgroundImage: `url(${story.image})` }}
            />
            <div className="relative w-full max-w-lg h-full sm:h-[90vh] sm:rounded-xl overflow-hidden bg-black flex flex-col">
                <div className="absolute top-0 left-0 right-0 p-2 z-20 flex gap-1">
                    <div className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden">
                        <div className="h-full bg-white transition-all ease-linear" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <div className="absolute top-4 left-0 right-0 p-4 z-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={story.user?.avatar} className="w-10 h-10 rounded-full border-2 border-blue-500" alt="" />
                        <div>
                            <p className="text-white font-semibold text-sm">{story.user?.name}</p>
                            <p className="text-white/70 text-xs">Recently</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={onClose}><X className="text-white w-6 h-6" /></button>
                    </div>
                </div>
                <div className="absolute inset-0 z-10 flex">
                    <div className="w-1/3 h-full" onClick={onPrev}></div>
                    <div className="w-1/3 h-full"></div>
                    <div className="w-1/3 h-full" onClick={onNext}></div>
                </div>
                <img src={story.image} className="w-full h-full object-cover" alt="Story" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3">
                     <input type="text" placeholder="Reply..." className="flex-1 bg-transparent border border-white/50 rounded-full px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:border-white" />
                     <Heart className="text-white w-8 h-8 cursor-pointer hover:scale-110 transition-transform" />
                     <Send className="text-white w-6 h-6 cursor-pointer" />
                </div>
            </div>
            <button onClick={onPrev} className="hidden sm:block absolute left-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white"><ChevronLeft className="w-8 h-8" /></button>
            <button onClick={onNext} className="hidden sm:block absolute right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white"><ChevronRight className="w-8 h-8" /></button>
            <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
                 <X className="text-white w-8 h-8" />
            </div>
        </div>
    );
}

const StoryReel: React.FC = () => {
  const { stories, addStory } = useData();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const handleNext = () => {
      if (activeStoryIndex !== null) {
          if (activeStoryIndex < stories.length - 1) {
              setActiveStoryIndex(activeStoryIndex + 1);
          } else {
              setActiveStoryIndex(null);
          }
      }
  };

  const handlePrev = () => {
      if (activeStoryIndex !== null) {
          if (activeStoryIndex > 0) {
              setActiveStoryIndex(activeStoryIndex - 1);
          } else {
              setActiveStoryIndex(null);
          }
      }
  };

  const handleCreateStory = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
          if(e.target?.result) {
              addStory(e.target.result as string);
          }
      }
      reader.readAsDataURL(file);
  }

  return (
    <>
        <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-4 sm:py-6 w-full px-2 md:px-0">
        <CreateStoryCard onAdd={handleCreateStory} />
        {stories.map((story, index) => (
            <StoryCard 
                key={story.id}
                image={story.image}
                profileSrc={story.user?.avatar || ''}
                title={story.user?.name || 'User'}
                onClick={() => setActiveStoryIndex(index)}
            />
        ))}
        {stories.length === 0 && (
            <div className="h-48 sm:h-64 flex items-center text-gray-400 text-sm px-4">
                No recent stories
            </div>
        )}
        </div>
        {activeStoryIndex !== null && (
            <StoryViewer 
                story={stories[activeStoryIndex]} 
                onClose={() => setActiveStoryIndex(null)} 
                onNext={handleNext}
                onPrev={handlePrev}
            />
        )}
    </>
  );
};

export default StoryReel;