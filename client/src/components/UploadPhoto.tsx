import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageIcon, UploadIcon } from "lucide-react";

interface UploadPhotoProps {
  onPhotoChange: (file: File | null) => void;
}

export default function UploadPhoto({ onPhotoChange }: UploadPhotoProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onPhotoChange(file);
    } else {
      setPreview(null);
      onPhotoChange(null);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Check if it's an image
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onPhotoChange(file);
      }
    }
  };
  
  return (
    <div className="rounded-md bg-gray-50 dark:bg-gray-700/30 p-4">
      <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Photo Upload</h3>
      
      <div>
        <Label htmlFor="photoUpload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload Passport Size Photo
        </Label>
        
        <div 
          className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="space-y-1 text-center">
            {preview ? (
              <div className="mx-auto h-32 w-24 overflow-hidden rounded">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            )}
            
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <Label htmlFor="photoUpload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                <span>Upload a file</span>
                <input 
                  id="photoUpload"
                  name="photoUpload"
                  type="file"
                  ref={fileInputRef}
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF up to 2MB
            </p>
            
            {preview && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                  onPhotoChange(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="mt-2"
              >
                Remove Photo
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
