import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, X, Users, Compass, Search } from 'lucide-react';

const CreateGroupModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { createGroup } = useData();
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createGroup(name, '');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="font-bold text-xl">Create Group</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Group Name</label>
                        <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-100 p-2 rounded-lg outline-blue-600" placeholder="Name your group" />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                        Groups are great for getting things done and staying in touch with just the people you want. Share photos and updates, plan events, and more.
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition-colors">Create</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const Groups: React.FC = () => {
    const { groups, toggleGroupJoin } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex-1 py-6 px-2 sm:px-4 flex flex-col items-center overflow-y-auto no-scrollbar w-full pb-20">
            {isModalOpen && <CreateGroupModal onClose={() => setIsModalOpen(false)} />}
            
            <div className="flex justify-between items-center mb-6 self-start max-w-4xl w-full mx-auto px-2">
                 <h2 className="text-2xl font-bold">Groups</h2>
                 <button onClick={() => setIsModalOpen(true)} className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create New Group</span>
                    <span className="sm:hidden">Create</span>
                 </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm w-full max-w-4xl mb-6 flex gap-4 overflow-x-auto no-scrollbar">
                 <div className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group">
                     <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                         <Compass className="w-6 h-6" />
                     </div>
                     <span className="text-xs font-semibold text-center">Discover</span>
                 </div>
                 <div className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group">
                     <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-black group-hover:bg-gray-300 transition-colors">
                         <Users className="w-6 h-6" />
                     </div>
                     <span className="text-xs font-semibold text-center">Your Groups</span>
                 </div>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-3 mx-auto px-2">
                <h3 className="font-bold text-gray-500 text-lg mb-2">Suggested for you</h3>
                {groups.map(group => (
                    <div key={group.id} className="bg-white rounded-xl shadow-sm p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                    <img src={group.image} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">{group.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{group.members} members · 10+ posts a day</p>
                        <div className="flex -space-x-1 mt-2">
                             {[1,2,3].map(i => (
                                 <img key={i} src={`https://i.pravatar.cc/150?u=${group.id}${i}`} className="w-5 h-5 rounded-full border border-white" />
                             ))}
                             <div className="text-xs text-gray-400 ml-2 pt-0.5">and others belong to this group</div>
                        </div>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleGroupJoin(group.id); }}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${group.isJoined ? 'bg-gray-200 text-black hover:bg-gray-300' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                    >
                        {group.isJoined ? 'Joined' : 'Join Group'}
                    </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Groups;