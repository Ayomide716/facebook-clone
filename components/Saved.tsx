import React from 'react';
import { useData } from '../contexts/DataContext';
import Post from './Post';
import { Bookmark, Filter } from 'lucide-react';

const Saved: React.FC = () => {
  const { posts, toggleLike, addComment, sharePost } = useData();
  
  const savedPosts = posts.filter(post => post.isSaved);

  return (
    <div className="flex-1 py-6 px-0 md:px-8 flex flex-col items-center overflow-y-auto no-scrollbar w-full pb-20">
       <div className="w-full max-w-2xl px-2">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Bookmark className="w-6 h-6 text-purple-600 fill-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Saved Items</h2>
                        <p className="text-sm text-gray-500">{savedPosts.length} items saved</p>
                    </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Filter className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {savedPosts.length === 0 ? (
                <div className="text-center py-12">
                     <div className="inline-flex bg-gray-100 p-6 rounded-full mb-4">
                        <Bookmark className="w-12 h-12 text-gray-400" />
                     </div>
                     <h3 className="text-xl font-bold text-gray-700">No saved posts yet</h3>
                     <p className="text-gray-500 max-w-xs mx-auto mt-2">When you see a post you want to view later, click the three dots and select "Save Post".</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {savedPosts.map(post => (
                        <Post 
                            key={post.id}
                            post={post}
                            onLike={toggleLike}
                            onComment={addComment}
                            onShare={sharePost}
                        />
                    ))}
                </div>
            )}
       </div>
    </div>
  );
};

export default Saved;