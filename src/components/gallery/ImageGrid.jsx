import { useCallback, useEffect, useRef, useState } from 'react';
import useGalleryStore from '@/store/galleryStore';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function ImageGrid() {
  const { 
    filteredImages,
    viewImage,
    selectedImages,
    isSelectMode,
    toggleImageSelection,
    loading,
    error,
    fetchImages
  } = useGalleryStore();

  const { toast } = useToast();

  // Create a map to store loaded image elements
  const imageCache = useRef(new Map());
  const [loadedImages, setLoadedImages] = useState(new Set());

  // Fetch images on mount
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Handle image loading
  const handleImageLoad = useCallback((imageId, imgElement) => {
    imageCache.current.set(imageId, imgElement);
    setLoadedImages(prev => new Set([...prev, imageId]));
  }, []);

  const handleImageClick = useCallback((image, imgElement) => {
    if (isSelectMode) {
      toggleImageSelection(image.imageId);
      return;
    }

    // Use the already loaded image for preview
    viewImage({
      ...image,
      objectUrl: imgElement.src
    });
  }, [isSelectMode, toggleImageSelection, viewImage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchImages}>Try Again</Button>
      </div>
    );
  }

  if (!filteredImages?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No images found
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => {
          const isLoaded = loadedImages.has(image.imageId);
          
          return (
            <div
              key={image.imageId}
              className={cn(
                "group relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-border hover:border-primary transition-colors",
                selectedImages.includes(image.imageId) && "ring-2 ring-primary",
                !isLoaded && "animate-pulse bg-muted"
              )}
              onClick={(e) => {
                const imgElement = e.currentTarget.querySelector('img');
                if (imgElement && isLoaded) {
                  handleImageClick(image, imgElement);
                }
              }}
            >
              {/* Thumbnail with loading state */}
              <img
                src={image.url}
                alt={image.name || "Gallery image"}
                className={cn(
                  "object-cover w-full h-full transition-all duration-300",
                  "group-hover:scale-105",
                  !isLoaded && "opacity-0",
                  isLoaded && "opacity-100"
                )}
                onLoad={(e) => handleImageLoad(image.imageId, e.target)}
                loading="lazy"
              />

              {/* Selection overlay */}
              {isSelectMode && (
                <div className={cn(
                  "absolute inset-0 bg-background/50 flex items-center justify-center transition-opacity",
                  selectedImages.includes(image.imageId) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                    selectedImages.includes(image.imageId) ? "bg-primary border-primary" : "border-white"
                  )}>
                    {selectedImages.includes(image.imageId) && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
