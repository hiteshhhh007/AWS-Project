import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import axios from 'axios';

const UPLOAD_URL = 'https://flmue3oowf.execute-api.us-east-1.amazonaws.com/upload';

export default function Upload() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getSession } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive"
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const session = getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      reader.onload = async () => {
        try {
          // Remove data:image/xxx;base64, prefix
          const base64Data = reader.result.split(',')[1];
          
          const response = await axios.post(
            UPLOAD_URL,
            {
              userId: session.user.username,
              fileName: selectedFile.name,
              imageData: base64Data
            },
            {
              headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json'
              },
              onUploadProgress: (progressEvent) => {
                const progress = (progressEvent.loaded / progressEvent.total) * 100;
                setUploadProgress(Math.round(progress));
              }
            }
          );

          toast({
            title: "Success!",
            description: "Image uploaded successfully",
          });
          navigate('/gallery');
        } catch (error) {
          console.error('Upload error:', error);
          toast({
            title: "Upload failed",
            description: error.response?.data?.message || error.message,
            variant: "destructive"
          });
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      };

      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "Error reading file",
          variant: "destructive"
        });
        setIsUploading(false);
      };

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Upload Image</h1>
          <p className="text-muted-foreground">
            Select an image to add to your gallery
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50 transition-colors">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
            >
              {selectedFile ? (
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Selected file:</p>
                  <p className="text-muted-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Drop your image here, or click to select</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
              )}
            </label>
          </div>

          {isUploading && uploadProgress > 0 && (
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner />
                <span>{uploadProgress}%</span>
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
