import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { MapPin, Search, Plus, X, Tag } from 'lucide-react';

const CreateListingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { createMarketplaceItem } = useData();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('Electronics');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMarketplaceItem(title, Number(price), location, '', category);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="font-bold text-xl">Create New Listing</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                        <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-100 p-2 rounded-lg outline-blue-600" placeholder="Item name" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                        <input required type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-gray-100 p-2 rounded-lg outline-blue-600" placeholder="0.00" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                        <input required value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-gray-100 p-2 rounded-lg outline-blue-600" placeholder="City, State" />
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-100 p-2 rounded-lg outline-blue-600">
                            <option>Electronics</option>
                            <option>Furniture</option>
                            <option>Vehicles</option>
                            <option>Clothing</option>
                            <option>Hobbies</option>
                        </select>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition-colors">Publish Listing</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const Marketplace: React.FC = () => {
   const { marketplaceItems } = useData();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [filter, setFilter] = useState('All');
   
   const categories = ['All', 'Electronics', 'Furniture', 'Vehicles', 'Clothing', 'Hobbies'];
   const filteredItems = filter === 'All' ? marketplaceItems : marketplaceItems.filter(i => i.category === filter);

   return (
       <div className="flex-1 py-6 px-4 flex flex-col overflow-y-auto no-scrollbar w-full pb-20">
        {isModalOpen && <CreateListingModal onClose={() => setIsModalOpen(false)} />}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 max-w-6xl mx-auto w-full px-2 gap-4">
            <h2 className="text-2xl font-bold">Marketplace</h2>
            <div className="flex gap-2 w-full md:w-auto">
                 <div className="flex-1 md:w-64 bg-gray-200 rounded-full px-4 py-2 flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input className="bg-transparent border-none outline-none text-sm w-full" placeholder="Search marketplace" />
                 </div>
                 <button onClick={() => setIsModalOpen(true)} className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-200 text-sm sm:text-base flex items-center gap-2 whitespace-nowrap">
                    <Plus className="w-4 h-4" />
                    <span>Sell</span>
                </button>
            </div>
        </div>

        {/* Categories */}
        <div className="max-w-6xl mx-auto w-full px-2 mb-6 overflow-x-auto no-scrollbar pb-2">
            <div className="flex gap-2">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors ${filter === cat ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto w-full px-2">
        {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow group">
                <div className="relative">
                     <img src={item.image} className="w-full aspect-square object-cover" />
                     <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md">
                         {item.category}
                     </div>
                </div>
                <div className="p-3">
                    <p className="font-bold text-base sm:text-lg">$ {item.price}</p>
                    <p className="text-gray-900 truncate text-sm sm:text-base font-medium">{item.title}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{item.location}</span>
                    </div>
                </div>
            </div>
        ))}
        </div>
      </div>
   );
}

export default Marketplace;