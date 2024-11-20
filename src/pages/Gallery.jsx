import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ImageGrid from '@/components/gallery/ImageGrid';
import ImagePreview from '@/components/gallery/ImagePreview';
import UploadModal from '@/components/gallery/UploadModal';
import SearchBar from '@/components/gallery/SearchBar';
import TagFilter from '@/components/gallery/TagFilter';
import FilterBar from '@/components/gallery/FilterBar';
import GalleryToolbar from '@/components/gallery/GalleryToolbar';
import { Trash2 } from 'lucide-react';
import useGalleryStore from '@/store/galleryStore';

export default function Gallery() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { selectedImages, batchDeleteImages, fetchImages } = useGalleryStore();

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <GalleryToolbar />
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 space-y-6">
          <TagFilter />
          <FilterBar />
        </div>
        <div className="col-span-9">
          <ImageGrid />
        </div>
      </div>

      <ImagePreview />
      <UploadModal 
        open={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
      />
    </div>
  );
}
