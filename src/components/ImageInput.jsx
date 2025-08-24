import { Input } from "./ui/input";
import { putImage, getImageUrl } from "../lib/product";
import { useState, forwardRef, useImperativeHandle } from "react";

const ImageInput = forwardRef(({ onChange, value, onFileSelect }, ref) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    setError(null);
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setSelectedFile(file);

    
    // Notify parent component that a file is selected
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  // Function to upload image (will be called from parent component)
  const uploadImage = async () => {
    if (!selectedFile) {
      throw new Error('No file selected');
    }

    try {
      setError(null);
      setIsUploading(true);
      
      const publicUrl = await putImage({ file: selectedFile });
      
      onChange(publicUrl);
      setSelectedFile(null); // Clear selected file after successful upload
      
      // Notify parent that file is no longer selected
      if (onFileSelect) {
        onFileSelect(null);
      }
      
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload image');
      onChange(''); // Clear the field on error
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Expose uploadImage function to parent component
  useImperativeHandle(ref, () => ({
    uploadImage
  }));

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input 
        type="file" 
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isUploading}
        className="text-sm"
      />
      
      {selectedFile && !value && (
        <p className="text-xs sm:text-sm text-gray-600">
          Selected: {selectedFile.name}
        </p>
      )}
      
      {isUploading && <p className="text-xs sm:text-sm text-blue-600">Uploading to Cloudflare...</p>}
      {error && <p className="text-xs sm:text-sm text-red-600">{error}</p>}
      {value && !isUploading && !error && (
        <div className="mt-2">
          <p className="text-xs sm:text-sm text-green-600 mb-2">Image uploaded successfully!</p>
          <img 
            src={getImageUrl(value)} 
            alt="Preview" 
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border"
          />
        </div>
      )}
    </div>
  );
});

ImageInput.displayName = 'ImageInput';

export default ImageInput;
