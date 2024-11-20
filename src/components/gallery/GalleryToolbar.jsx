import { Button } from '@/components/ui/button';
import useGalleryStore from '@/store/galleryStore';
import { Check, Plus, SquareStack, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import UploadModal from './UploadModal';

export default function GalleryToolbar() {
  const { 
    isSelectMode, 
    selectedImages, 
    toggleSelectMode,
    batchDeleteImages
  } = useGalleryStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { toast } = useToast();

  const handleBatchDelete = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select at least one image to delete",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await batchDeleteImages();
      if (result) {
        toast({
          title: "Success",
          description: `Successfully deleted ${selectedImages.length} images`,
        });
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete images",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Button
          variant={isSelectMode ? "secondary" : "outline"}
          size="sm"
          onClick={toggleSelectMode}
        >
          {isSelectMode ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Done
            </>
          ) : (
            <>
              <SquareStack className="h-4 w-4 mr-2" />
              Select
            </>
          )}
        </Button>

        {isSelectMode && selectedImages.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBatchDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected ({selectedImages.length})
          </Button>
        )}

        {isSelectMode && (
          <span className="text-sm text-muted-foreground">
            {selectedImages.length} selected
          </span>
        )}
      </div>

      {!isSelectMode && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      )}

      <UploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
