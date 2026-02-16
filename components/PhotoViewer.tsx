import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoViewerProps {
  src: string;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ src, onClose, onNext, onPrev, hasNext, hasPrev }) => {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    // Disable scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
      {/* Close Button */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50 focus:outline-none"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation Buttons */}
      {hasPrev && onPrev && (
        <button 
            onClick={(e) => { e.stopPropagation(); onPrev(); }} 
            className="absolute left-4 p-4 bg-white/5 hover:bg-white/20 rounded-full text-white transition-colors z-50 hidden sm:flex items-center justify-center group"
        >
          <ChevronLeft className="w-10 h-10 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {hasNext && onNext && (
        <button 
            onClick={(e) => { e.stopPropagation(); onNext(); }} 
            className="absolute right-4 p-4 bg-white/5 hover:bg-white/20 rounded-full text-white transition-colors z-50 hidden sm:flex items-center justify-center group"
        >
          <ChevronRight className="w-10 h-10 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Navigation Click Areas for Mobile/Tablet */}
      <div className="absolute inset-0 flex z-40 sm:hidden">
          {hasPrev && <div className="w-1/4 h-full" onClick={(e) => { e.stopPropagation(); onPrev && onPrev(); }}></div>}
          <div className="flex-1" onClick={onClose}></div>
          {hasNext && <div className="w-1/4 h-full" onClick={(e) => { e.stopPropagation(); onNext && onNext(); }}></div>}
      </div>

      {/* Backdrop click to close (desktop) */}
      <div className="absolute inset-0 z-0" onClick={onClose}></div>

      {/* Image */}
      <img 
        src={src} 
        className="max-h-[95vh] max-w-[95vw] object-contain relative z-10 shadow-2xl select-none" 
        alt="Fullscreen view" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image directly
      />
    </div>
  );
};

export default PhotoViewer;