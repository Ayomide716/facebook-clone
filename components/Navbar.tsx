import React, { useState, useRef, useEffect } from 'react';
import { Search, Home, MonitorPlay, Store, Users, Bell, MessageCircle, Grip, ChevronDown, Gamepad2, LogOut, Settings, HelpCircle, Menu, ArrowLeft, Heart, UserPlus, AtSign, Edit } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useMessage } from '../contexts/MessageContext';

const Navbar: React.FC = () => {
  const { 
    currentView,
    navigateToFeed, 
    navigateToProfile, 
    navigateToWatch,
    navigateToMarketplace,
    navigateToGroups,
    navigateToGaming
  } = useNavigation();

  const { 
      currentUser, 
      setSearchQuery, 
      notifications, 
      markNotificationRead, 
      markAllNotificationsRead, 
      deleteNotification, 
      toggleFriend,
      searchQuery,
      getUser
  } = useData();
  const { logout } = useAuth();
  const { unreadCount: unreadMsgCount, messages, openChat } = useMessage();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMsgs, setShowMsgs] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = (type: string) => currentView.type === type;
  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  // Derive recent conversations for dropdown
  const recentConversations = Array.from(new Set(messages.flatMap(m => [m.senderId, m.receiverId])))
    .filter(id => id !== currentUser.id)
    .map(id => {
        const user = getUser(id);
        const lastMsg = messages.filter(m => 
            (m.senderId === id && m.receiverId === currentUser.id) || 
            (m.senderId === currentUser.id && m.receiverId === id)
        ).sort((a,b) => b.timestamp - a.timestamp)[0];
        return { user, lastMsg };
    })
    .sort((a,b) => (b.lastMsg?.timestamp || 0) - (a.lastMsg?.timestamp || 0))
    .slice(0, 8); // Top 8 recent

  // Focus input when mobile search opens
  useEffect(() => {
    if (showMobileSearch && inputRef.current) {
        inputRef.current.focus();
    }
  }, [showMobileSearch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
        setShowNotifs(false);
        setShowMsgs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      if(currentView.type !== 'feed') navigateToFeed();
  };

  const handleFriendRequest = async (e: React.MouseEvent, notifId: string, userId: string, accept: boolean) => {
      e.stopPropagation();
      if(accept) {
          await toggleFriend(userId);
      }
      deleteNotification(notifId);
  }
  
  const handleChatOpen = (user: any) => {
      if(user) {
          openChat(user);
          setShowMsgs(false);
      }
  }

  const NavItem = ({ active, onClick, Icon, badge }: { active: boolean, onClick: () => void, Icon: any, badge?: number }) => (
    <div 
        onClick={onClick}
        className={`relative h-full flex items-center justify-center cursor-pointer group px-1 sm:px-2 md:px-6 lg:px-8 xl:px-10 min-w-[60px]`}
    >
        <div className={`w-full h-[48px] flex items-center justify-center rounded-lg transition-colors group-hover:bg-[#F0F2F5] relative ${active ? '' : ''}`}>
            <Icon className={`w-7 h-7 ${active ? 'text-[#1877F2] fill-[#1877F2]' : 'text-[#65676B]'}`} strokeWidth={active ? 2.5 : 2} />
            {badge && badge > 0 && (
                <div className="absolute top-1 right-2 sm:right-6 md:right-3 lg:right-6 bg-red-500 text-white text-[11px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white">
                    {badge}
                </div>
            )}
        </div>
        {active && (
            <div className="absolute bottom-0 h-[3px] w-full bg-[#1877F2] rounded-t-sm"></div>
        )}
    </div>
  );

  const getNotificationIcon = (type: string) => {
      switch (type) {
          case 'like': return <div className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center"><Heart className="w-3 h-3 text-white fill-white" /></div>;
          case 'comment': return <div className="w-5 h-5 bg-[#45BD62] rounded-full flex items-center justify-center"><MessageCircle className="w-3 h-3 text-white fill-white" /></div>;
          case 'friend_request': return <div className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center"><UserPlus className="w-3 h-3 text-white" /></div>;
          case 'group_invite': return <div className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center"><Users className="w-3 h-3 text-white" /></div>;
          case 'mention': return <div className="w-5 h-5 bg-[#F7B928] rounded-full flex items-center justify-center"><AtSign className="w-3 h-3 text-white" /></div>;
          default: return <div className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center"><Bell className="w-3 h-3 text-white" /></div>;
      }
  }

  return (
    <div className="sticky top-0 z-50 bg-white h-14 shadow-sm flex items-center justify-between px-3 lg:px-4">
      {/* Left: Logo and Search */}
      <div className={`flex items-center gap-2 lg:gap-3 ${showMobileSearch ? 'w-full absolute left-0 px-2 bg-white z-50 h-full' : ''}`}>
        
        {/* Mobile Back Button (Only visible when searching on mobile) */}
        {showMobileSearch ? (
             <div onClick={() => { setShowMobileSearch(false); setSearchQuery(''); }} className="p-2 cursor-pointer rounded-full hover:bg-gray-100">
                 <ArrowLeft className="w-6 h-6 text-gray-600" />
             </div>
        ) : (
             <div 
               onClick={navigateToFeed}
               className="cursor-pointer"
             >
                  <svg viewBox="0 0 36 36" className="fill-[#1877F2] w-10 h-10" height="40" width="40">
                     <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"></path>
                     <path className="fill-white" d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"></path>
                  </svg>
             </div>
        )}
        
        {/* Desktop Search Input - Always visible on lg+ */}
        <div className="hidden lg:flex items-center bg-[#F0F2F5] rounded-full px-3 py-2.5 w-[240px] xl:w-[280px] transition-all focus-within:w-[300px] focus-within:shadow-sm">
          <Search className="text-[#65676B] w-4 h-4 shrink-0" />
          <input 
            type="text" 
            placeholder="Search Facebook" 
            className="bg-transparent border-none outline-none ml-2 text-[15px] w-full placeholder-[#65676B] text-[#050505] font-normal"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Mobile Search Input - Visible when showMobileSearch is true */}
        {showMobileSearch && (
             <div className="flex lg:hidden items-center bg-[#F0F2F5] rounded-full px-3 py-2.5 w-full">
                <Search className="text-[#65676B] w-4 h-4 shrink-0" />
                <input 
                    ref={inputRef}
                    type="text" 
                    placeholder="Search Facebook" 
                    className="bg-transparent border-none outline-none ml-2 text-[15px] w-full text-[#050505]"
                    value={searchQuery}
                    onChange={handleSearch}
                />
             </div>
        )}

        {/* Mobile/Tablet Search Icon - Visible when NOT searching on mobile */}
        {!showMobileSearch && (
            <div 
                onClick={() => setShowMobileSearch(true)} 
                className="lg:hidden w-10 h-10 bg-[#F0F2F5] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#D8DADF] transition-colors"
            >
                <Search className="text-[#050505] w-5 h-5" />
            </div>
        )}
      </div>

      {/* Center: Navigation Icons - Hidden on small screens or when mobile searching */}
      {!showMobileSearch && (
        <div className="hidden md:flex items-center justify-center flex-1 h-full max-w-[680px] absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center justify-between w-full h-full max-w-[580px] px-2">
              <NavItem active={isActive('feed')} onClick={navigateToFeed} Icon={Home} />
              <NavItem active={isActive('watch')} onClick={navigateToWatch} Icon={MonitorPlay} />
              <NavItem active={isActive('marketplace')} onClick={navigateToMarketplace} Icon={Store} />
              <NavItem active={isActive('groups')} onClick={navigateToGroups} Icon={Users} />
              <NavItem active={isActive('gaming')} onClick={navigateToGaming} Icon={Gamepad2} />
          </div>
        </div>
      )}

      {/* Right: Profile and Actions - Hidden when mobile searching */}
      {!showMobileSearch && (
        <div className="flex items-center gap-2 sm:gap-3 justify-end min-w-fit z-50" ref={dropdownRef}>
           {/* Menu Icon for Tablet/Mobile where Nav might be hidden or just extra options */}
           <div className="md:hidden w-10 h-10 bg-[#F0F2F5] rounded-full flex items-center justify-center hover:bg-[#D8DADF] cursor-pointer transition-colors">
              <Menu className="w-6 h-6 text-black" />
           </div>

           {/* Desktop Menu Grid */}
           <div className="hidden xl:flex w-10 h-10 bg-[#E4E6E9] rounded-full items-center justify-center hover:bg-[#D8DADF] cursor-pointer transition-colors">
              <Grip className="w-5 h-5 text-black" />
           </div>
           
           {/* Messenger */}
           <div className="relative">
                <div 
                    onClick={() => setShowMsgs(!showMsgs)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#D8DADF] cursor-pointer transition-colors relative ${showMsgs ? 'bg-[#E7F3FF] text-[#1877F2]' : 'bg-[#E4E6E9] text-black'}`}
                >
                    <MessageCircle className="w-5 h-5" />
                    {unreadMsgCount > 0 && <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">{unreadMsgCount}</div>}
                </div>

                {showMsgs && (
                   <div className="absolute top-12 right-0 w-[360px] bg-white rounded-lg shadow-[0_12px_28px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(255,255,255,0.5)] p-2 border border-gray-100 z-50 overflow-hidden">
                       <div className="flex justify-between items-center px-2 py-2 mb-2">
                            <h3 className="font-bold text-2xl text-gray-900">Chats</h3>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                                    <Edit className="w-5 h-5 text-gray-600" />
                                </div>
                            </div>
                       </div>
                       
                       <div className="px-2 mb-2">
                           <div className="bg-[#F0F2F5] rounded-full px-3 py-1.5 flex items-center">
                               <Search className="w-4 h-4 text-gray-500" />
                               <input type="text" placeholder="Search Messenger" className="bg-transparent border-none outline-none ml-2 text-sm w-full" />
                           </div>
                       </div>

                       <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                           {recentConversations.length === 0 ? <p className="text-gray-500 p-4 text-center">No messages yet.</p> : 
                               recentConversations.map(({ user, lastMsg }) => (
                                   user ? (
                                    <div 
                                        key={user.id} 
                                        className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => handleChatOpen(user)}
                                    >
                                        <div className="relative shrink-0">
                                            <img src={user.avatar} className="w-14 h-14 rounded-full object-cover border border-gray-100" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[15px] font-semibold text-gray-900 truncate">{user.name}</p>
                                            <div className="flex items-center gap-1 text-[13px] text-gray-500 truncate">
                                                <p className={`truncate ${!lastMsg?.isRead && lastMsg?.receiverId === currentUser.id ? 'font-bold text-black' : ''}`}>
                                                    {lastMsg?.senderId === currentUser.id ? 'You: ' : ''}{lastMsg?.text}
                                                </p>
                                                <span>·</span>
                                                <span>1h</span>
                                            </div>
                                        </div>
                                        {!lastMsg?.isRead && lastMsg?.receiverId === currentUser.id && <div className="w-3 h-3 bg-[#1877F2] rounded-full"></div>}
                                    </div>
                                   ) : null
                               ))
                           }
                       </div>
                       
                       <div className="border-t border-gray-100 mt-2 pt-2 text-center pb-1">
                           <span className="text-[#1877F2] font-semibold text-sm cursor-pointer hover:underline">See all in Messenger</span>
                       </div>
                   </div>
               )}
           </div>
           
           {/* Notifications */}
           <div className="relative">
               <div 
                   onClick={() => setShowNotifs(!showNotifs)}
                   className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#D8DADF] cursor-pointer transition-colors ${showNotifs ? 'bg-[#E7F3FF] text-[#1877F2]' : 'bg-[#E4E6E9] text-black'}`}
               >
                   <Bell className={`w-5 h-5 ${showNotifs ? 'fill-current' : ''}`} />
                   {unreadNotifCount > 0 && <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">{unreadNotifCount}</div>}
               </div>
               
               {showNotifs && (
                   <div className="absolute top-12 right-0 w-[360px] bg-white rounded-lg shadow-[0_12px_28px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(255,255,255,0.5)] p-2 border border-gray-100 z-50 overflow-hidden">
                       <div className="flex justify-between items-center px-2 py-2 mb-2">
                            <h3 className="font-bold text-2xl text-gray-900">Notifications</h3>
                            <div className="flex gap-2">
                                <span onClick={markAllNotificationsRead} className="text-blue-600 text-sm font-medium cursor-pointer hover:bg-blue-50 px-2 py-1 rounded">Mark all read</span>
                                <div className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                </div>
                            </div>
                       </div>
                       <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                           {notifications.length === 0 ? <p className="text-gray-500 p-4 text-center">No notifications</p> : 
                               notifications.map(notif => (
                                   <div 
                                       key={notif.id} 
                                       className={`flex flex-col p-2 rounded-lg cursor-pointer transition-colors ${notif.isRead ? 'hover:bg-gray-100' : 'bg-[#E7F3FF] hover:bg-[#DBEBFF]'}`}
                                       onClick={() => markNotificationRead(notif.id)}
                                   >
                                       <div className="flex items-start gap-3">
                                           <div className="relative shrink-0">
                                               <img src={notif.user.avatar} className="w-14 h-14 rounded-full object-cover border border-gray-200" alt="" />
                                               <div className="absolute bottom-0 right-0 p-0.5 rounded-full border-2 border-white bg-transparent">
                                                   {getNotificationIcon(notif.type)}
                                               </div>
                                           </div>
                                           <div className="flex-1">
                                               <p className="text-[15px] leading-5 text-gray-900">
                                                   <span className="font-bold">{notif.user.name}</span> {notif.text}
                                               </p>
                                               <p className="text-[13px] text-blue-600 font-semibold mt-1">{notif.time}</p>
                                           </div>
                                           {!notif.isRead && <div className="w-3 h-3 bg-[#1877F2] rounded-full mt-4 mr-2"></div>}
                                       </div>
                                       
                                       {/* Actions for Friend Requests and Group Invites */}
                                       {(notif.type === 'friend_request' || notif.type === 'group_invite') && (
                                           <div className="pl-[68px] mt-2 flex gap-3">
                                               <button 
                                                    onClick={(e) => handleFriendRequest(e, notif.id, notif.user.id, true)}
                                                    className="flex-1 bg-[#1877F2] text-white font-semibold py-1.5 rounded-lg text-sm hover:bg-[#166FE5]"
                                                >
                                                   {notif.type === 'friend_request' ? 'Confirm' : 'Join'}
                                               </button>
                                               <button 
                                                    onClick={(e) => handleFriendRequest(e, notif.id, notif.user.id, false)}
                                                    className="flex-1 bg-gray-200 text-black font-semibold py-1.5 rounded-lg text-sm hover:bg-gray-300"
                                                >
                                                   Delete
                                               </button>
                                           </div>
                                       )}
                                   </div>
                               ))
                           }
                       </div>
                   </div>
               )}
           </div>

           {/* User Menu Dropdown */}
           <div className="relative">
               <div 
                   onClick={() => setShowUserMenu(!showUserMenu)}
                   className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors overflow-hidden border border-gray-200 relative bg-gray-200`}
               >
                   <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                   <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#E4E6E9] rounded-full flex items-center justify-center border-2 border-white">
                        <ChevronDown className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                   </div>
               </div>

               {showUserMenu && (
                   <div className="absolute top-12 right-0 w-[360px] bg-white rounded-xl shadow-[0_12px_28px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1)] p-4 border border-gray-100 z-50">
                       <div className="p-1 mb-2 shadow-[0_2px_12px_rgba(0,0,0,0.1)] rounded-xl cursor-pointer" onClick={() => { navigateToProfile(currentUser.id); setShowUserMenu(false); }}>
                           <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <img src={currentUser.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-200" alt="" />
                                <span className="font-semibold text-[17px] text-gray-900">{currentUser.name}</span>
                           </div>
                           <div className="border-t border-gray-200 mx-3 mb-1"></div>
                           <div className="p-2 hover:bg-gray-50 rounded-lg m-1">
                                <span className="text-[#1877F2] text-[15px] font-medium block text-center">See your profile</span>
                           </div>
                       </div>
                       
                       <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors mt-2">
                           <div className="w-9 h-9 bg-[#E4E6E9] rounded-full flex items-center justify-center"><Settings className="w-5 h-5 text-black" /></div>
                           <span className="font-medium text-[15px] text-gray-900">Settings & Privacy</span>
                       </div>
                       <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                           <div className="w-9 h-9 bg-[#E4E6E9] rounded-full flex items-center justify-center"><HelpCircle className="w-5 h-5 text-black" /></div>
                           <span className="font-medium text-[15px] text-gray-900">Help & Support</span>
                       </div>
                       <div 
                           onClick={logout}
                           className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                       >
                           <div className="w-9 h-9 bg-[#E4E6E9] rounded-full flex items-center justify-center"><LogOut className="w-5 h-5 text-black" /></div>
                           <span className="font-medium text-[15px] text-gray-900">Log Out</span>
                       </div>
                       <div className="mt-4 text-[13px] text-gray-500 px-2">
                            Privacy  · Terms  · Advertising  · Ad Choices   · Cookies  ·  More · Meta © 2024
                       </div>
                   </div>
               )}
           </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

const MoreHorizontal = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
      <circle cx="5" cy="12" r="2" />
    </svg>
);