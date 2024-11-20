import useGalleryStore from '@/store/galleryStore';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useEffect, useCallback } from 'react';

export default function ImagePreview() {
  const { viewingImage, closeImageView } = useGalleryStore();

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      closeImageView();
    }
  }, [closeImageView]);

  useEffect(() => {
    if (viewingImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [viewingImage, handleKeyDown]);

  if (!viewingImage) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
      onClick={closeImageView}
    >
      <div 
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-50 text-white hover:bg-white/10"
          onClick={closeImageView}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Image container with animation */}
        <div className="relative max-h-[90vh] max-w-[90vw] animate-in fade-in zoom-in-95 duration-200">
          <img
            src={viewingImage.objectUrl || viewingImage.url}
            alt={viewingImage.name || 'Preview'}
            className="h-auto w-auto max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl object-contain"
          />
          
          {/* Optional: Image info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white rounded-b-lg opacity-0 hover:opacity-100 transition-opacity">
            <p className="text-sm font-medium">{viewingImage.name}</p>
            {viewingImage.tags?.length > 0 && (
              <p className="text-xs text-white/80 mt-1">
                {viewingImage.tags.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
