import React from 'react';
import StoryReel from './StoryReel';
import CreatePost from './CreatePost';
import Post from './Post';
import { useData } from '../contexts/DataContext';
import { useNavigation } from '../contexts/NavigationContext';
import { UserPlus, UserCheck } from 'lucide-react';

const Feed: React.FC = () => {
  const { posts, addPost, toggleLike, addComment, sharePost, searchQuery, allUsers, currentUser, toggleFriend } = useData();
  const { navigateToProfile } = useNavigation();

  // Filter Posts by content or user name
  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter People (exclude self)
  const filteredPeople = searchQuery ? allUsers.filter(user => 
    user.id !== currentUser.id &&
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const isSearching = searchQuery.length > 0;

  return (
    <div className="flex-1 py-4 md:py-6 px-0 md:px-8 xl:px-14 flex flex-col items-center overflow-y-auto no-scrollbar pb-24 md:pb-20 w-full">
      <div className="w-full max-w-2xl px-0 md:px-0">
        
        {!isSearching && (
            <>
                <StoryReel />
                <div className="px-2 md:px-0">
                    <CreatePost onPost={addPost} />
                </div>
            </>
        )}

        {isSearching && (
             <div className="px-2 md:px-0 mb-4">
                 <h2 className="text-xl font-bold text-gray-500 mb-4 px-2">Search Results</h2>
                 
                 {/* People Results */}
                 {filteredPeople.length > 0 && (
                     <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                         <div className="p-4 border-b border-gray-100">
                             <h3 className="font-bold text-lg text-gray-900">People</h3>
                         </div>
                         <div className="p-2">
                             {filteredPeople.map(user => {
                                 const isFriend = currentUser.friends?.includes(user.id);
                                 return (
                                     <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                         <div 
                                            className="flex items-center gap-3 cursor-pointer"
                                            onClick={() => navigateToProfile(user.id)}
                                         >
                                             <img src={user.avatar} className="w-12 h-12 rounded-full object-cover border border-gray-100" alt={user.name} />
                                             <span className="font-semibold text-gray-900">{user.name}</span>
                                         </div>
                                         <button 
                                            onClick={() => toggleFriend(user.id)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-sm transition-colors ${isFriend ? 'bg-gray-200 text-black' : 'bg-blue-100 text-blue-600'}`}
                                         >
                                             {isFriend ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                                             <span>{isFriend ? 'Friends' : 'Add Friend'}</span>
                                         </button>
                                     </div>
                                 )
                             })}
                         </div>
                     </div>
                 )}

                 {/* Post Results Header */}
                 <div className="mb-2 px-2">
                    <h3 className="font-bold text-lg text-gray-700">Posts</h3>
                 </div>
             </div>
        )}

        <div className="px-2 md:px-0">
            {filteredPosts.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
                    <p>No posts found matching "{searchQuery}"</p>
                </div>
            ) : (
                filteredPosts.map((post) => (
                    <Post 
                        key={post.id} 
                        post={post} 
                        onLike={toggleLike}
                        onComment={addComment}
                        onShare={sharePost}
                    />
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default Feed;