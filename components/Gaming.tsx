import React from 'react';
import { useData } from '../contexts/DataContext';
import { Gamepad2, Users, Play, Radio, Heart, User } from 'lucide-react';

const Gaming: React.FC = () => {
  const { games } = useData();
  const liveGames = games.filter(g => g.isLive);
  
  return (
    <div className="flex-1 py-6 px-4 flex flex-col items-center overflow-y-auto no-scrollbar w-full pb-20">
      <div className="w-full max-w-6xl mx-auto px-2">
         {/* Header */}
         <div className="flex items-center justify-between mb-6">
             <h2 className="text-2xl font-bold text-gray-900">Gaming</h2>
             <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 flex items-center gap-2">
                 <User className="w-5 h-5" />
                 <span>Your Games</span>
             </button>
         </div>

         {/* Featured / Live Section */}
         {liveGames.length > 0 && (
             <div className="mb-8">
                 <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                     <Radio className="text-red-500 animate-pulse" />
                     Live Now
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                     {liveGames.map(game => (
                         <div key={game.id} className="bg-white rounded-xl shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                             <div className="relative aspect-video">
                                 <img src={game.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={game.name} />
                                 <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                     <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                     LIVE
                                 </div>
                                 <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md">
                                     {game.players} viewers
                                 </div>
                                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                     <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center backdrop-blur shadow-lg">
                                         <Play className="w-5 h-5 ml-1 text-black" fill="currentColor" />
                                     </div>
                                 </div>
                             </div>
                             <div className="p-3">
                                 <h4 className="font-bold text-gray-900 truncate">{game.name}</h4>
                                 <div className="flex items-center justify-between mt-1">
                                    <p className="text-sm text-gray-500">{game.streamer} is playing</p>
                                    <div className="px-2 py-0.5 bg-gray-100 rounded text-xs font-semibold text-gray-600">{game.category}</div>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
         )}

         {/* All Games Grid */}
         <div>
             <h3 className="text-xl font-bold text-gray-900 mb-4">Suggested Games</h3>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {games.map(game => (
                     <div key={game.id} className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all flex flex-col h-full">
                         <div className="aspect-square relative overflow-hidden">
                             <img src={game.image} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" alt={game.name} />
                         </div>
                         <div className="p-3 flex flex-col flex-1 justify-between">
                             <div>
                                <h4 className="font-bold text-gray-900 truncate text-[15px]">{game.name}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{game.category}</p>
                             </div>
                             <button className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-1.5 rounded-lg text-sm transition-colors">
                                 Play
                             </button>
                         </div>
                     </div>
                 ))}
                 {/* Mock More Games */}
                 {[1,2,3,4].map(i => (
                     <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all flex flex-col h-full opacity-60 hover:opacity-100">
                          <div className="aspect-square bg-gray-200 relative overflow-hidden flex items-center justify-center">
                             <Gamepad2 className="w-10 h-10 text-gray-400" />
                          </div>
                          <div className="p-3">
                             <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                             <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                             <button className="w-full mt-3 bg-gray-100 text-gray-400 font-semibold py-1.5 rounded-lg text-sm cursor-not-allowed">Play</button>
                          </div>
                     </div>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
};

export default Gaming;