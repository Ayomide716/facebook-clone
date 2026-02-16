import React from 'react';
import { MonitorPlay, ThumbsUp, MessageCircle, Share2, Play } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Watch: React.FC = () => {
  const { videos } = useData();

  return (
    <div className="flex-1 py-6 px-2 sm:px-4 flex flex-col items-center overflow-y-auto no-scrollbar w-full pb-20">
      <h2 className="text-2xl font-bold mb-6 self-start max-w-6xl w-full mx-auto px-2">Watch</h2>
      
      {videos.length === 0 ? (
          <div className="text-center text-gray-500 py-10 w-full">
              <MonitorPlay className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No videos available yet.</p>
          </div>
      ) : (
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mx-auto px-2">
            {videos.map(video => (
            <div key={video.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col group">
                {/* Header */}
                <div className="p-4 flex items-center gap-3">
                <img src={video.creator?.avatar || 'https://via.placeholder.com/50'} className="w-10 h-10 rounded-full object-cover" />
                <div>
                    <p className="font-semibold text-gray-900">{video.creator?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{video.timestamp}</p>
                </div>
                <button className="ml-auto text-blue-600 font-semibold text-sm hover:bg-blue-50 px-3 py-1 rounded-lg">Follow</button>
                </div>
                
                {/* Video Player Simulation */}
                <div className="aspect-video bg-black relative cursor-pointer group-hover:opacity-95 transition-opacity">
                <img src={video.thumbnail || 'https://via.placeholder.com/800x450'} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center border-2 border-white/50 backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-medium">10:00</div>
                </div>
                
                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                <p className="font-semibold text-gray-900 mb-2 leading-tight">{video.title}</p>
                <div className="text-xs text-gray-500 mb-2">{video.views} views</div>
                
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-gray-500">
                    <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors flex-1 justify-center">
                        <ThumbsUp className="w-5 h-5" />
                        <span className="text-sm font-medium">Like</span>
                    </button>
                    <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors flex-1 justify-center">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors flex-1 justify-center">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Share</span>
                    </button>
                </div>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Watch;