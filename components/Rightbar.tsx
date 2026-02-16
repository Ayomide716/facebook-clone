import React from 'react';
import { Video, Search, MoreHorizontal } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { useData } from '../contexts/DataContext';
import { useCall } from '../contexts/CallContext';
import { useMessage } from '../contexts/MessageContext';

const ContactRow: React.FC<{ src: string, name: string, onClick: () => void, onCall: (e: React.MouseEvent) => void }> = ({ src, name, onClick, onCall }) => {
  return (
    <div 
        onClick={onClick}
        className="flex items-center justify-between p-2 hover:bg-gray-200 rounded-lg cursor-pointer group"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="relative shrink-0">
            <img src={src} className="w-8 h-8 rounded-full object-cover" alt={name} />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <p className="font-medium text-gray-900 text-sm truncate">{name}</p>
      </div>
      
      {/* Call Button appears on hover */}
      <button 
        onClick={onCall}
        className="p-1.5 rounded-full hover:bg-gray-300 text-gray-500 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Video Call"
      >
        <Video className="w-4 h-4" />
      </button>
    </div>
  );
};

const Rightbar: React.FC = () => {
  const { navigateToProfile } = useNavigation();
  const { friends, getUser } = useData();
  const { callUser } = useCall();
  const { openChat } = useMessage();

  const handleCall = (e: React.MouseEvent, friendId: string) => {
      e.stopPropagation();
      callUser(friendId, true);
  };

  const handleContactClick = (userId: string) => {
      const user = getUser(userId);
      if(user) openChat(user);
  };

  return (
    <div className="hidden xl:block w-[300px] xl:w-[360px] p-2 mt-4 sticky top-16 h-screen overflow-y-auto no-scrollbar pb-20">
      <div className="mb-4 px-2">
        <h3 className="text-gray-500 font-semibold mb-2">Sponsored</h3>
        <div className="flex items-center gap-4 mb-4 hover:bg-gray-200 p-2 rounded-lg cursor-pointer">
            <img src="https://picsum.photos/seed/ad1/150/150" alt="Ad" className="w-28 h-28 rounded-lg object-cover" />
            <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Luxury Hotels</span>
                <span className="text-xs text-gray-500">hotel-luxury.com</span>
            </div>
        </div>
         <div className="flex items-center gap-4 hover:bg-gray-200 p-2 rounded-lg cursor-pointer">
            <img src="https://picsum.photos/seed/ad2/150/150" alt="Ad" className="w-28 h-28 rounded-lg object-cover" />
             <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Coding Bootcamp</span>
                <span className="text-xs text-gray-500">learncode.com</span>
            </div>
        </div>
      </div>

      <div className="border-b border-gray-300 my-4 mx-2" />

      <div className="px-2">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 font-semibold">Contacts</h3>
            <div className="flex gap-2 text-gray-500">
                <Video className="w-4 h-4 cursor-pointer hover:text-gray-700" />
                <Search className="w-4 h-4 cursor-pointer hover:text-gray-700" />
                <MoreHorizontal className="w-4 h-4 cursor-pointer hover:text-gray-700" />
            </div>
        </div>
        {friends.length === 0 ? (
            <p className="text-gray-500 text-sm px-2">No friends yet. Search for people to add!</p>
        ) : (
            friends.map((contact) => (
                <ContactRow 
                    key={contact.id} 
                    src={contact.avatar} 
                    name={contact.name} 
                    onClick={() => handleContactClick(contact.id)}
                    onCall={(e) => handleCall(e, contact.id)}
                />
            ))
        )}
      </div>
    </div>
  );
};

export default Rightbar;