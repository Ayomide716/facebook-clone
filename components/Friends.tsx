import React from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigation } from '../contexts/NavigationContext';

const Friends: React.FC = () => {
    const { friends, friendRequests, respondToFriendRequest } = useData();
    const { navigateToProfile } = useNavigation();

    return (
    <div className="flex-1 py-6 px-4 flex flex-col overflow-y-auto no-scrollbar w-full pb-20">
        <div className="max-w-6xl mx-auto w-full px-2">
            
            {/* Friend Requests Section */}
            {friendRequests.length > 0 && (
                <div className="mb-8">
                     <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Friend Requests</h2>
                        <span className="text-blue-600 text-sm font-semibold cursor-pointer hover:bg-blue-50 px-2 py-1 rounded">See all</span>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                        {friendRequests.map(req => (
                            <div key={req.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                                <img 
                                    src={req.avatar} 
                                    className="w-full aspect-square object-cover cursor-pointer" 
                                    onClick={() => navigateToProfile(req.id)}
                                />
                                <div className="p-3 flex flex-col flex-1">
                                    <h3 
                                        className="font-semibold text-gray-900 truncate mb-1 cursor-pointer hover:underline"
                                        onClick={() => navigateToProfile(req.id)}
                                    >
                                        {req.name}
                                    </h3>
                                    <div className="mt-auto flex flex-col gap-2">
                                        <button 
                                            onClick={() => respondToFriendRequest(req.id, true)}
                                            className="bg-blue-600 text-white py-1.5 rounded-lg font-semibold text-sm hover:bg-blue-700 w-full"
                                        >
                                            Confirm
                                        </button>
                                        <button 
                                            onClick={() => respondToFriendRequest(req.id, false)}
                                            className="bg-gray-200 text-gray-800 py-1.5 rounded-lg font-semibold text-sm hover:bg-gray-300 w-full"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                     </div>
                     <div className="border-b border-gray-300 mt-8"></div>
                </div>
            )}

            {/* All Friends Section */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Friends</h2>
                {friends.length === 0 ? <p className="text-center text-gray-500">You haven't added any friends yet.</p> : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {friends.map(friend => (
                        <div key={friend.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <img 
                                src={friend.avatar} 
                                className="w-full aspect-square object-cover cursor-pointer"
                                onClick={() => navigateToProfile(friend.id)}
                            />
                            <div className="p-3 flex flex-col flex-1">
                                <h3 
                                    className="font-semibold text-gray-900 truncate mb-auto cursor-pointer hover:underline"
                                    onClick={() => navigateToProfile(friend.id)}
                                >
                                    {friend.name}
                                </h3>
                                <div className="flex flex-col gap-2 mt-3">
                                    <button className="bg-blue-600 text-white py-1.5 rounded-lg font-semibold text-sm hover:bg-blue-700 w-full">Message</button>
                                    <button 
                                        onClick={() => navigateToProfile(friend.id)}
                                        className="bg-gray-200 text-gray-800 py-1.5 rounded-lg font-semibold text-sm hover:bg-gray-300 w-full"
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    </div>
)};

export default Friends;