import React, { useState } from 'react';
import { MoreHorizontal, ThumbsUp, MessageCircle, Share2, Globe, X, Send, Bookmark } from 'lucide-react';
import { PostData } from '../types';
import { useData } from '../contexts/DataContext';
import PhotoViewer from './PhotoViewer';

interface PostProps {
  post: PostData;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (postId: string) => void;
}

const Post: React.FC<PostProps> = ({ post, onLike, onComment, onShare }) => {
  const { toggleSavePost, currentUser } = useData();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText('');
    setShowComments(true);
  };

  const toggleComments = () => {
      setShowComments(!showComments);
  };

  const handleSave = () => {
      toggleSavePost(post.id);
      setShowMenu(false);
  }

  return (
    <>
    {showLightbox && post.image && (
        <PhotoViewer 
            src={post.image}
            onClose={() => setShowLightbox(false)}
        />
    )}
    
    <div className="bg-white rounded-lg shadow-sm mb-4 w-full border border-gray-100">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <img src={post.user.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-200 cursor-pointer hover:opacity-90" alt={post.user.name} />
          <div>
            <h4 className="font-semibold text-gray-900 text-[15px] hover:underline cursor-pointer">{post.user.name}</h4>
            <div className="flex items-center gap-1 text-[13px] text-gray-500">
                <span className="hover:underline cursor-pointer">{post.timestamp}</span>
                <span>•</span>
                <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>
        <div className="flex gap-1 relative">
             <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-[#F0F2F5] rounded-full text-gray-600 transition-colors">
                 <MoreHorizontal className="w-5 h-5" />
             </button>
             {showMenu && (
                 <div className="absolute right-0 top-10 bg-white shadow-xl rounded-lg border border-gray-100 p-2 w-48 z-10">
                     <div 
                        onClick={handleSave} 
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer text-gray-700"
                     >
                         <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-black' : ''}`} />
                         <span className="font-medium">{post.isSaved ? 'Unsave Post' : 'Save Post'}</span>
                     </div>
                 </div>
             )}
             <button className="p-2 hover:bg-[#F0F2F5] rounded-full text-gray-600 transition-colors">
                 <X className="w-5 h-5" />
             </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <p className="text-[#050505] text-[15px] leading-6">{post.content}</p>
      </div>

      {post.image && (
        <div 
            className="w-full h-auto cursor-pointer bg-black/5 relative"
            onClick={() => setShowLightbox(true)}
        >
          <img src={post.image} alt="Post Content" className="w-full object-contain max-h-[700px]" />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
            {post.likes > 0 && (
                <div className="bg-gradient-to-br from-[#1877F2] to-[#0064D1] rounded-full p-[5px] flex items-center justify-center shadow-sm border border-white">
                    <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
                </div>
            )}
            <span className="text-gray-500 text-[15px] hover:underline">{post.likes > 0 ? post.likes : 'Be the first to like this'}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500 text-[15px]">
            <span className="hover:underline cursor-pointer" onClick={toggleComments}>{post.comments} comments</span>
            <span className="hover:underline cursor-pointer">{post.shares} shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mx-3 border-t border-b border-gray-200 py-1 flex items-center justify-between">
        <div 
            onClick={() => onLike(post.id)}
            className={`flex-1 flex items-center justify-center gap-2 hover:bg-[#F0F2F5] py-1.5 rounded-md cursor-pointer transition-colors ${post.isLiked ? 'text-[#1877F2]' : 'text-gray-500'}`}
        >
            <ThumbsUp className={`w-5 h-5 ${post.isLiked ? 'fill-[#1877F2]' : ''}`} />
            <span className="font-semibold text-[15px]">Like</span>
        </div>
         <div 
            onClick={() => setShowComments(true)}
            className="flex-1 flex items-center justify-center gap-2 hover:bg-[#F0F2F5] py-1.5 rounded-md cursor-pointer text-gray-500 transition-colors"
        >
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold text-[15px]">Comment</span>
        </div>
         <div 
            onClick={() => onShare(post.id)}
            className="flex-1 flex items-center justify-center gap-2 hover:bg-[#F0F2F5] py-1.5 rounded-md cursor-pointer text-gray-500 transition-colors"
        >
            <Share2 className="w-5 h-5" />
            <span className="font-semibold text-[15px]">Share</span>
        </div>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="px-4 py-2">
             <div className="flex items-center gap-2 pt-2 mb-3">
                <img src={currentUser.avatar} className="w-8 h-8 rounded-full object-cover border border-gray-200" alt="Me" />
                <form className="flex-1 flex items-center bg-[#F0F2F5] rounded-2xl px-3 py-1.5" onSubmit={handleCommentSubmit}>
                    <input 
                        type="text" 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..." 
                        className="bg-transparent border-none outline-none flex-1 text-[15px] placeholder-gray-500 text-gray-900"
                    />
                    <button type="submit" className={`p-1.5 rounded-full hover:bg-gray-200 transition-colors ${!commentText.trim() ? 'text-gray-400 cursor-default' : 'text-[#1877F2] cursor-pointer'}`}>
                        <Send className="w-4 h-4 fill-current" />
                    </button>
                </form>
            </div>

            {/* Previous Comments */}
            {post.commentsList && post.commentsList.length > 0 && (
                <div className="flex flex-col gap-2">
                    {post.commentsList.map(comment => (
                        <div key={comment.id} className="flex gap-2 items-start group">
                            <img src={comment.user.avatar} className="w-8 h-8 rounded-full object-cover border border-gray-200 mt-1 cursor-pointer hover:opacity-90" alt={comment.user.name} />
                            <div className="flex flex-col">
                                <div className="bg-[#F0F2F5] rounded-2xl px-3 py-2 inline-block">
                                    <p className="font-bold text-[13px] text-gray-900 cursor-pointer hover:underline inline-block">{comment.user.name}</p>
                                    <p className="text-[15px] text-gray-800 leading-snug">{comment.text}</p>
                                </div>
                                <div className="flex gap-4 px-3 text-[12px] font-bold text-gray-500 mt-0.5">
                                    <span className="cursor-pointer hover:underline">Like</span>
                                    <span className="cursor-pointer hover:underline">Reply</span>
                                    <span className="font-normal">{comment.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
    </>
  );
};

export default Post;