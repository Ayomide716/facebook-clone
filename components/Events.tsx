import React from 'react';
import { useData } from '../contexts/DataContext';
import { Calendar, MapPin, Star, Share2, MoreHorizontal } from 'lucide-react';

const Events: React.FC = () => {
  const { events, toggleEventStatus } = useData();

  return (
    <div className="flex-1 py-6 px-4 flex flex-col items-center overflow-y-auto no-scrollbar w-full pb-20">
        <h2 className="text-2xl font-bold mb-6 self-start max-w-5xl w-full mx-auto px-2">Upcoming Events</h2>
        
        <div className="w-full max-w-5xl flex flex-col gap-4 mx-auto px-2">
            {events.map(event => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                    {/* Date Block (Desktop) */}
                    <div className="hidden md:flex flex-col items-center justify-center p-4 bg-gray-100 min-w-[100px] border-r border-gray-200">
                         <span className="text-red-500 font-bold text-sm uppercase">{event.date.split(',')[0]}</span>
                         <span className="text-3xl font-bold text-gray-900">{event.date.split(' ')[1]}</span>
                    </div>

                    {/* Image */}
                    <div className="h-40 md:h-auto md:w-64 relative shrink-0">
                        <img src={event.image} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-white rounded p-1 shadow-sm md:hidden">
                            <span className="block text-center text-xs text-red-500 font-bold uppercase">{event.date.split(',')[0]}</span>
                            <span className="block text-center text-lg font-bold text-black">{event.date.split(' ')[1]}</span>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                             <p className="text-red-500 text-xs font-bold uppercase mb-1">{event.date}</p>
                             <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                             <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                                 <MapPin className="w-4 h-4" />
                                 <span>{event.location}</span>
                             </div>
                             <p className="text-xs text-gray-500">{(event.interested?.length || 0).toLocaleString()} people interested</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-4">
                            <button 
                                onClick={() => toggleEventStatus(event.id, event.status === 'interested' ? null : 'interested')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${event.status === 'interested' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                <Star className={`w-4 h-4 ${event.status === 'interested' ? 'fill-current' : ''}`} />
                                {event.status === 'interested' ? 'Interested' : 'Interested'}
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Events;