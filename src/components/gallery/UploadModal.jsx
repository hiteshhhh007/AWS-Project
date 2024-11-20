import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useGalleryStore from '@/store/galleryStore';
import { Loader2, Upload, X, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Function to truncate filename while preserving extension
const truncateFilename = (filename, maxLength = 30) => {
  if (filename.length <= maxLength) return filename;
  
  const extension = filename.split('.').pop();
  const nameWithoutExt = filename.slice(0, -(extension.length + 1));
  
  const truncatedLength = maxLength - extension.length - 4; // -4 for "..." and "."
  const start = nameWithoutExt.slice(0, truncatedLength / 2);
  const end = nameWithoutExt.slice(-(truncatedLength / 2));
  
  return `${start}...${end}.${extension}`;
};

const UploadModal = ({ open, onClose }) => {
  const { toast } = useToast();
  const { uploadImages, loading } = useGalleryStore();
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({ uploading: false, results: null });

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image to upload",
        variant: "destructive"
      });
      return;
    }

    setUploadStatus({ uploading: true, results: null });
    try {
      const results = await uploadImages(files.map(f => f.file));
      setUploadStatus({ uploading: false, results });
      
      if (results.success.length > 0) {
        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${results.success.length} image${results.success.length > 1 ? 's' : ''}${results.failed.length > 0 ? `. Failed to upload ${results.failed.length} image${results.failed.length > 1 ? 's' : ''}.` : ''}`,
          variant: results.failed.length > 0 ? "warning" : "default"
        });
      } else {
        toast({
          title: "Upload Failed",
          description: "Failed to upload any images. Please try again.",
          variant: "destructive"
        });
      }

      if (results.success.length === files.length) {
        handleClose();
      }
    } catch (error) {
      setUploadStatus({ uploading: false, results: null });
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    files.forEach(file => {
      URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
    setUploadStatus({ uploading: false, results: null });
    onClose();
  };

  const removeFile = (index) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
          <DialogDescription>
            Upload images to your gallery. Maximum size is 10MB per image.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
              "hover:border-primary/50 transition-colors",
              isDragActive && "border-primary bg-primary/5"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              {isDragActive ? (
                <p>Drop the images here</p>
              ) : (
                <p>Drag & drop images here, or click to select</p>
              )}
              <p className="text-sm text-muted-foreground">
                Supports: JPG, JPEG, PNG, GIF up to 10MB
              </p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected Images ({files.length})</p>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {files.map((file, index) => {
                  const isSuccess = uploadStatus.results?.success.includes(file.file.name);
                  const failedResult = uploadStatus.results?.failed.find(f => f.name === file.file.name);
                  const truncatedName = truncateFilename(file.file.name);
                  
                  return (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="h-8 w-8 object-cover rounded"
                      />
                      <span 
                        className="flex-1 text-sm" 
                        title={file.file.name}
                      >
                        {truncatedName}
                      </span>
                      {uploadStatus.uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : uploadStatus.results ? (
                        isSuccess ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : failedResult ? (
                          <div className="flex items-center gap-1">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-xs text-red-500 max-w-[150px] truncate" title={failedResult.error}>
                              {failedResult.error}
                            </span>
                          </div>
                        ) : null
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={uploadStatus.uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={files.length === 0 || uploadStatus.uploading}
              className="min-w-[80px]"
            >
              {uploadStatus.uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Upload'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
