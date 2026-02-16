import React, { useState } from 'react';
import { Users, Bookmark, Calendar, Clock, ChevronDown, Video, ShoppingBag, Gamepad2, ChevronUp, Star, Flag, Monitor, CreditCard } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { useData } from '../contexts/DataContext';

const SidebarRow: React.FC<{ 
    Icon?: React.ElementType, 
    src?: string, 
    title: string, 
    onClick?: () => void,
    iconColor?: string
}> = ({ Icon, src, title, onClick, iconColor }) => {
  return (
    <div 
        onClick={onClick}
        className="flex items-center gap-4 p-3 hover:bg-[#E4E6E9] rounded-lg cursor-pointer transition-colors duration-100 active:bg-[#dbdde1]"
    >
      {src ? (
        <img src={src} className="w-9 h-9 rounded-full object-cover border border-gray-200" alt={title} />
      ) : (
        Icon && <Icon className={`w-9 h-9 p-1.5 ${iconColor || 'text-[#1877F2]'}`} />
      )}
      <p className="font-medium text-[15px] text-[#050505] truncate">{title}</p>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { 
    navigateToProfile, 
    navigateToFriends, 
    navigateToMemories, 
    navigateToSaved, 
    navigateToGroups, 
    navigateToWatch, 
    navigateToMarketplace, 
    navigateToEvents,
    navigateToGaming,
    navigateToGeneric
  } = useNavigation();

  const { currentUser, groups } = useData();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-2 mt-4 max-w-[300px] xl:max-w-[360px] min-w-[280px] h-[calc(100vh-56px)] overflow-y-auto hidden xl:block sticky top-14 pb-4 hover:overflow-y-auto no-scrollbar scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <SidebarRow 
        src={currentUser.avatar} 
        title={currentUser.name} 
        onClick={() => navigateToProfile(currentUser.id)}
      />
      <SidebarRow Icon={Users} title="Friends" onClick={navigateToFriends} iconColor="text-[#1877F2]" />
      <SidebarRow Icon={Clock} title="Memories" onClick={navigateToMemories} iconColor="text-[#1877F2]" />
      <SidebarRow Icon={Bookmark} title="Saved" onClick={navigateToSaved} iconColor="text-[#A033FF]" />
      <SidebarRow Icon={Users} title="Groups" onClick={navigateToGroups} iconColor="text-[#1877F2]" />
      <SidebarRow Icon={Video} title="Video" onClick={navigateToWatch} iconColor="text-[#1877F2]" />
      <SidebarRow Icon={ShoppingBag} title="Marketplace" onClick={navigateToMarketplace} iconColor="text-[#1877F2]" />
      <SidebarRow Icon={Gamepad2} title="Gaming" onClick={navigateToGaming} iconColor="text-[#1877F2]" />
      
      {isExpanded && (
        <>
            <SidebarRow Icon={Calendar} title="Events" onClick={navigateToEvents} iconColor="text-[#F3425F]" />
            <SidebarRow Icon={Flag} title="Pages" onClick={() => navigateToGeneric('Pages')} iconColor="text-[#F35369]" />
            <SidebarRow Icon={Star} title="Favorites" onClick={() => navigateToGeneric('Favorites')} iconColor="text-[#F7B928]" />
            <SidebarRow Icon={Monitor} title="Ad Center" onClick={() => navigateToGeneric('Ad Center')} iconColor="text-[#1877F2]" />
            <SidebarRow Icon={CreditCard} title="Orders and payments" onClick={() => navigateToGeneric('Orders and payments')} iconColor="text-[#2ABBA7]" />
        </>
      )}

      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-4 p-3 hover:bg-[#E4E6E9] rounded-lg cursor-pointer transition-colors duration-100"
      >
        <div className="w-9 h-9 bg-[#E4E6E9] rounded-full flex items-center justify-center">
             {isExpanded ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
        </div>
        <p className="font-medium text-[15px] text-[#050505]">{isExpanded ? 'See less' : 'See more'}</p>
      </div>

      <div className="border-b border-gray-300 my-2 mx-4" />
      
      <div className="px-4 mt-2 mb-2 flex justify-between items-center group">
        <h3 className="text-gray-500 font-semibold text-[17px]">Your Groups</h3>
      </div>
      
      {groups.slice(0, 5).map(g => (
          <SidebarRow key={g.id} src={g.image} title={g.name} onClick={navigateToGroups} />
      ))}
      
      <div className="px-4 mt-4 text-[13px] text-gray-500">
          Privacy  · Terms  · Advertising  · Ad Choices   · Cookies  ·  More · Meta © 2024
      </div>
    </div>
  );
};

export default Sidebar;