import React, { useRef, useState } from 'react';
import { Video, Image, Smile, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface CreatePostProps {
  onPost: (content: string, image: string | null) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPost }) => {
  const { currentUser } = useData();
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);

  const sendPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input && !selectedFile) return;

    onPost(input, selectedFile);
    setInput('');
    setSelectedFile(null);
  };

  const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target?.result as string);
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 w-full border border-gray-100">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <img 
            src={currentUser.avatar} 
            className="w-10 h-10 rounded-full object-cover border border-gray-200 cursor-pointer hover:opacity-90 shrink-0" 
            alt="Current User" 
        />
        <form className="flex-1 flex min-w-0" onSubmit={sendPost}>
             <input
                className="rounded-full h-10 bg-[#F0F2F5] hover:bg-[#E4E6E9] flex-1 px-4 focus:outline-none text-[15px] placeholder-gray-500 text-gray-700 cursor-pointer hover:cursor-text transition-colors min-w-0 truncate"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`What's on your mind?`}
            />
            <button hidden type="submit">Submit</button>
        </form>
      </div>

      {selectedFile && (
          <div className="relative p-4 border border-gray-100 m-2 rounded-lg">
              <div 
                className="absolute top-6 right-6 bg-white rounded-full p-1.5 cursor-pointer hover:bg-gray-100 shadow-md border border-gray-200 z-10" 
                onClick={() => setSelectedFile(null)}
              >
                  <X className="w-5 h-5 text-gray-600" />
              </div>
              <img src={selectedFile} alt="Selected" className="w-full object-contain max-h-[500px] rounded-lg" />
          </div>
      )}

      <div className="flex items-center justify-between pt-3 gap-1">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-[#F0F2F5] p-2 rounded-lg flex-1 justify-center transition-colors">
            <Video className="text-[#F3425F] w-6 h-6 shrink-0" />
            <p className="text-gray-500 font-semibold text-[13px] sm:text-[15px] whitespace-nowrap">Live video</p>
        </div>
        <div 
            onClick={() => filePickerRef.current?.click()}
            className="flex items-center gap-2 cursor-pointer hover:bg-[#F0F2F5] p-2 rounded-lg flex-1 justify-center transition-colors"
        >
            <Image className="text-[#45BD62] w-6 h-6 shrink-0" />
             <p className="text-gray-500 font-semibold text-[13px] sm:text-[15px] whitespace-nowrap">Photo/video</p>
             <input type="file" hidden onChange={addImageToPost} ref={filePickerRef} accept="image/*" />
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-[#F0F2F5] p-2 rounded-lg flex-1 justify-center hidden sm:flex transition-colors">
            <Smile className="text-[#F7B928] w-6 h-6 shrink-0" />
             <p className="text-gray-500 font-semibold text-[15px] whitespace-nowrap">Feeling/activity</p>
        </div>
      </div>
      
       {(input || selectedFile) && (
        <div className="px-2 pt-2 border-t border-gray-100 mt-2">
            <button 
                onClick={sendPost}
                className="w-full bg-[#1877F2] text-white font-bold py-2 rounded-lg hover:bg-[#166FE5] transition-colors mt-2 text-[15px]"
            >
                Post
            </button>
        </div>
       )}
    </div>
  );
};

export default CreatePost;