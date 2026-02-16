import React from 'react';
import { useData } from '../contexts/DataContext';
import Post from './Post';
import { Clock, Calendar } from 'lucide-react';

const Memories: React.FC = () => {
  const { posts, toggleLike, addComment, sharePost } = useData();
  
  // For demo purposes, let's just take the first two posts as "memories"
  const memoryPosts = posts.slice(0, 2);

  return (
    <div className="flex-1 py-6 px-0 md:px-8 flex flex-col items-center overflow-y-auto no-scrollbar w-full pb-20">
       <div className="w-full max-w-2xl px-2">
            {/* Hero Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-8 text-white text-center">
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h2 className="text-3xl font-bold">On This Day</h2>
                    <p className="text-blue-100 mt-2 text-lg">Look back on your memories from years past.</p>
                </div>
                <div className="p-4 bg-white">
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-semibold">
                        <Calendar className="w-4 h-4" />
                        <span>Today's Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-700 mb-4 px-2">1 Year Ago</h3>

            <div className="flex flex-col gap-4">
                {memoryPosts.map(post => (
                    <Post 
                        key={post.id}
                        post={{...post, timestamp: '1 year ago'}} // Override timestamp for effect
                        onLike={toggleLike}
                        onComment={addComment}
                        onShare={sharePost}
                    />
                ))}
            </div>
       </div>
    </div>
  );
};

export default Memories;