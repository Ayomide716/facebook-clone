import React, { useState } from 'react';
import { Camera, PenLine, Plus, Briefcase, MapPin, GraduationCap, Heart, Phone, Globe, Clock, MoreHorizontal, Search, PlayCircle, Map, Cake, Mail, User as UserIcon, AlertCircle, X, UserCheck, UserPlus, Video, MessageCircle } from 'lucide-react';
import Post from './Post';
import CreatePost from './CreatePost';
import PhotoViewer from './PhotoViewer';
import { User, PostData } from '../types';
import { useData } from '../contexts/DataContext';
import { useCall } from '../contexts/CallContext';
import { useMessage } from '../contexts/MessageContext';

interface ProfileProps {
  user: User;
}

const EditProfileModal: React.FC<{ user: User, onClose: () => void, onSave: (u: Partial<User>) => void }> = ({ user, onClose, onSave }) => {
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || '');
    const [work, setWork] = useState(user.work || '');
    const [education, setEducation] = useState(user.education || '');
    const [location, setLocation] = useState(user.location || '');
    const [coverPhoto, setCoverPhoto] = useState(user.coverPhoto || '');

    const handleSave = () => {
        onSave({ name, bio, work, education, location, coverPhoto });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 shrink-0">
                    <h2 className="text-xl font-bold">Edit Profile</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                    <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1">Full Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-100 rounded-lg p-2 outline-blue-500" />
                    </div>
                     <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1">Cover Photo URL</label>
                        <input value={coverPhoto} onChange={e => setCoverPhoto(e.target.value)} className="w-full bg-gray-100 rounded-lg p-2 outline-blue-500" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1">Bio</label>
                        <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-gray-100 rounded-lg p-2 outline-blue-500" rows={3} />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1">Workplace</label>
                        <input value={work} onChange={e => setWork(e.target.value)} className="w-full bg-gray-100 rounded-lg p-2 outline-blue-500" />
                    </div>
                     <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1">Education</label>
                        <input value={education} onChange={e => setEducation(e.target.value)} className="w-full bg-gray-100 rounded-lg p-2 outline-blue-500" />
                    </div>
                     <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1">Location</label>
                        <input value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-gray-100 rounded-lg p-2 outline-blue-500" />
                    </div>
                </div>
                <div className="p-4 border-t border-gray-200 flex justify-end shrink-0">
                    <button onClick={handleSave} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Save</button>
                </div>
            </div>
        </div>
    )
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const { 
      currentUser, 
      posts, 
      addPost, 
      toggleLike, 
      addComment, 
      sharePost, 
      updateUserProfile,
      toggleFriend,
      getUser
  } = useData();

  const { callUser } = useCall();
  const { openChat } = useMessage();

  const [activeTab, setActiveTab] = useState('Posts');
  const [aboutSubTab, setAboutSubTab] = useState('Overview');
  const [photosSubTab, setPhotosSubTab] = useState('Your Photos');
  const [isEditing, setIsEditing] = useState(false);
  const [isFriendLoading, setIsFriendLoading] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const isCurrentUser = user.id === currentUser.id;
  const isFriend = currentUser.friends?.includes(user.id);

  const userPosts = posts.filter(post => post.user.id === user.id);
  // Collect all images from user's posts
  const userPhotos = userPosts.filter(p => p.image).map(p => p.image!);

  const handleFriendToggle = async () => {
      setIsFriendLoading(true);
      await toggleFriend(user.id);
      setIsFriendLoading(false);
  }

  const handleNextPhoto = () => {
      if (selectedPhotoIndex !== null && selectedPhotoIndex < userPhotos.length - 1) {
          setSelectedPhotoIndex(selectedPhotoIndex + 1);
      }
  };

  const handlePrevPhoto = () => {
      if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
          setSelectedPhotoIndex(selectedPhotoIndex - 1);
      }
  };

  const tabs = ['Posts', 'About', 'Friends', 'Photos', 'Videos', 'Check-ins'];
  const aboutTabs = ['Overview', 'Work and education', 'Places lived', 'Contact and basic info', 'Family and relationships', 'Details about you', 'Life events'];
  const photoTabs = ['Photos of You', 'Your Photos', 'Albums'];

  const renderPostsTab = () => (
    <div className="w-full max-w-5xl flex flex-col xl:flex-row gap-4 px-0 md:px-0">
      {/* Left Column: Intro & Photos */}
      <div className="w-full xl:w-2/5 flex flex-col gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Intro</h2>
          {user.bio && <p className="text-center text-gray-900 mb-4">{user.bio}</p>}
          <div className="flex flex-col gap-3 text-gray-700">
            {user.work && (
                <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gray-400 shrink-0" />
                <span>Works at <strong>{user.work}</strong></span>
                </div>
            )}
            {user.education && (
                <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-gray-400 shrink-0" />
                <span>Studied at <strong>{user.education}</strong></span>
                </div>
            )}
            {user.location && (
                <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <span>From <strong>{user.location}</strong></span>
                </div>
            )}
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-gray-400 shrink-0" />
              <span>Single</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400 shrink-0" />
              <span>Joined February 2023</span>
            </div>
          </div>
          {isCurrentUser && (
            <button onClick={() => setIsEditing(true)} className="w-full bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg mt-4 hover:bg-gray-200">
              Edit Details
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-900">Photos</h2>
            <span 
                className="text-blue-600 text-sm cursor-pointer hover:underline"
                onClick={() => setActiveTab('Photos')}
            >
                See all photos
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
            {userPhotos.slice(0, 9).map((photo, i) => (
              <div 
                key={i} 
                className="aspect-square cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedPhotoIndex(i)}
              >
                  <img src={photo} className="w-full h-full object-cover" alt="User photo" />
              </div>
            ))}
            {userPhotos.length === 0 && <p className="col-span-3 text-center text-gray-500 py-4">No photos yet</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-900">Friends</h2>
            <span 
                className="text-blue-600 text-sm cursor-pointer hover:underline"
                onClick={() => setActiveTab('Friends')}
            >
                See all friends
            </span>
          </div>
          <div className="text-gray-500 text-sm mb-3">{user.friends?.length || 0} friends</div>
          <div className="grid grid-cols-3 gap-2">
            {user.friends?.slice(0, 9).map(friendId => {
                const friend = getUser(friendId);
                if (!friend) return null;
                return (
                    <div key={friend.id} className="flex flex-col">
                        <img src={friend.avatar} className="w-full h-24 object-cover rounded-lg mb-1" alt="Friend" />
                        <span className="text-xs font-semibold text-gray-900 truncate">{friend.name}</span>
                    </div>
                )
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Feed */}
      <div className="w-full xl:w-3/5">
        {isCurrentUser && <CreatePost onPost={addPost} />}
        {userPosts.length > 0 ? (
          userPosts.map(post => (
            <Post
              key={post.id}
              post={post}
              onLike={toggleLike}
              onComment={addComment}
              onShare={sharePost}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500 font-semibold">
            No posts to show
          </div>
        )}
      </div>
    </div>
  );

  const renderAboutContent = () => {
    switch (aboutSubTab) {
      case 'Work and education':
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Work</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                   <Briefcase className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">{user.work || 'No workplace added'}</p>
                </div>
              </div>
            </div>
             <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Education</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                   <GraduationCap className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">{user.education || 'No education added'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Places lived':
        return (
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Places Lived</h3>
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                   <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">{user.location || 'No location added'}</p>
                  <p className="text-xs text-gray-500">Current City</p>
                </div>
              </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-gray-400 shrink-0" />
              <div>
                <p className="text-gray-900">Works at <span className="font-semibold">{user.work || '...'}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-gray-400 shrink-0" />
              <div>
                <p className="text-gray-900">Studied at <span className="font-semibold">{user.education || '...'}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-gray-400 shrink-0" />
              <div>
                <p className="text-gray-900">Lives in <span className="font-semibold">{user.location || '...'}</span></p>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderAboutTab = () => (
    <div className="w-full max-w-5xl bg-white rounded-xl shadow-sm flex flex-col xl:flex-row min-h-[400px]">
      <div className="w-full xl:w-1/3 border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">About</h2>
        <div className="flex flex-col gap-1 overflow-x-auto xl:overflow-visible flex-row xl:flex-col no-scrollbar">
          {aboutTabs.map((item) => (
             <div 
                key={item} 
                onClick={() => setAboutSubTab(item)}
                className={`px-4 py-2 rounded-lg cursor-pointer font-semibold transition-colors whitespace-nowrap ${aboutSubTab === item ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
             >
                {item}
             </div>
          ))}
        </div>
      </div>
      <div className="w-full xl:w-2/3 p-6">
        {renderAboutContent()}
      </div>
    </div>
  );

  const renderPhotosTab = () => (
     <div className="w-full max-w-5xl bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-900">Photos</h2>
        </div>
        
        <div className="flex gap-1 md:gap-4 border-b border-gray-200 mb-4 overflow-x-auto no-scrollbar">
            {photoTabs.map((subTab) => (
                <div 
                    key={subTab} 
                    onClick={() => setPhotosSubTab(subTab)}
                    className={`px-4 py-3 font-semibold cursor-pointer whitespace-nowrap transition-colors ${photosSubTab === subTab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100 rounded-lg'}`}
                >
                    {subTab}
                </div>
            ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {userPhotos.map((img, i) => (
                <div 
                    key={i} 
                    className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100 hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedPhotoIndex(i)}
                >
                    <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                </div>
            ))}
            {userPhotos.length === 0 && <p className="text-gray-500">No photos found.</p>}
        </div>
     </div>
  );

  return (
    <div className="flex-1 py-0 md:py-6 px-0 md:px-4 xl:px-14 flex flex-col items-center overflow-y-auto no-scrollbar pb-24 md:pb-20 w-full">
      {isEditing && <EditProfileModal user={user} onClose={() => setIsEditing(false)} onSave={updateUserProfile} />}
      
      {/* Photo Viewer Modal */}
      {selectedPhotoIndex !== null && (
          <PhotoViewer 
              src={userPhotos[selectedPhotoIndex]}
              onClose={() => setSelectedPhotoIndex(null)}
              onNext={handleNextPhoto}
              onPrev={handlePrevPhoto}
              hasNext={selectedPhotoIndex < userPhotos.length - 1}
              hasPrev={selectedPhotoIndex > 0}
          />
      )}
      
      {/* Header Section */}
      <div className="w-full max-w-5xl bg-white rounded-none md:rounded-b-xl shadow-sm overflow-hidden mb-4">
        {/* Cover Photo */}
        <div className="h-40 sm:h-60 md:h-80 w-full bg-gray-200 relative overflow-hidden group">
             <img src={user.coverPhoto} className="w-full h-full object-cover" alt="Cover" />
             {isCurrentUser && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-end p-2 md:p-4">
                     <button onClick={() => setIsEditing(true)} className="bg-white px-2 py-1.5 md:px-3 md:py-2 rounded-lg font-semibold flex items-center gap-2 shadow-sm hover:bg-gray-50 text-xs md:text-sm">
                        <Camera className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">Edit Cover Photo</span>
                    </button>
                </div>
             )}
        </div>

        {/* Profile Info */}
        <div className="px-4 md:px-8 pb-4">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 sm:-mt-16 md:-mt-8 mb-4 relative z-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white object-cover bg-white"
              />
              {isCurrentUser && (
                <div onClick={() => setIsEditing(true)} className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-gray-200 p-1.5 sm:p-2 rounded-full cursor-pointer hover:bg-gray-300">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </div>
              )}
            </div>

            {/* Name and Stats */}
            <div className="flex-1 text-center md:text-left md:ml-4 md:mb-4 mt-2 md:mt-0 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">{user.name}</h1>
              <p className="text-gray-500 font-semibold text-sm sm:text-base">{user.friends?.length || 0} friends</p>
              <div className="flex justify-center md:justify-start -space-x-2 mt-1">
                {user.friends?.slice(0, 6).map(friendId => {
                   const friend = getUser(friendId);
                   if(!friend) return null;
                   return (
                     <img key={friendId} src={friend.avatar} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover" alt="friend" />
                   )
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 md:mb-4 w-full md:w-auto">
              {isCurrentUser ? (
                <>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base">
                    <Plus className="w-5 h-5" />
                    <span>Add to Story</span>
                  </button>
                  <button onClick={() => setIsEditing(true)} className="bg-gray-200 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center justify-center gap-2 text-sm sm:text-base">
                    <PenLine className="w-5 h-5" />
                    <span>Edit profile</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleFriendToggle}
                    disabled={isFriendLoading}
                    className={`${isFriend ? 'bg-gray-200 text-black' : 'bg-blue-600 text-white'} px-4 py-2 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center gap-2 text-sm sm:text-base flex-1 sm:flex-initial`}
                  >
                    {isFriend ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    <span>{isFriend ? 'Friends' : 'Add Friend'}</span>
                  </button>
                  {isFriend && (
                      <button 
                        onClick={() => openChat(user)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base flex-1 sm:flex-initial"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>Message</span>
                      </button>
                  )}
                  <button onClick={() => callUser(user.id, true)} className="bg-gray-200 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center justify-center gap-2 text-sm sm:text-base flex-1 sm:flex-initial">
                    <Video className="w-5 h-5" />
                    <span>Call</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-gray-300 pt-1">
            <div className="flex gap-1 md:gap-4 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-semibold cursor-pointer whitespace-nowrap border-b-[3px] transition-colors text-sm sm:text-base ${
                    activeTab === tab
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:bg-gray-100 rounded-lg'
                  }`}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'Posts' && renderPostsTab()}
      {activeTab === 'About' && renderAboutTab()}
      {activeTab === 'Friends' && null}
      {activeTab === 'Photos' && renderPhotosTab()}
    </div>
  );
};

export default Profile;