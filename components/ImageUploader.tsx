
import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X, FileWarning } from 'lucide-react';
import { ImageData } from '../types';

interface ImageUploaderProps {
  onImagesSelected: (images: ImageData[]) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelected, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const validImages: ImageData[] = [];
    Array.from(files).forEach((file) => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

      if (isValidType && isValidSize) {
        validImages.push({
          id: Math.random().toString(36).substring(7),
          file,
          previewUrl: URL.createObjectURL(file),
          name: file.name,
          size: file.size
        });
      } else {
        console.warn(`[ImageToPDF] File rejected: ${file.name}. Type: ${file.type}, Size: ${file.size}`);
      }
    });

    if (validImages.length > 0) {
      onImagesSelected(validImages);
    }
  }, [onImagesSelected]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 text-center flex flex-col items-center justify-center min-h-[300px] cursor-pointer
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="bg-blue-100 p-4 rounded-full mb-4">
        <Upload className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {isDragging ? 'Drop images here' : 'Select images to convert'}
      </h3>
      <p className="text-gray-500 max-w-xs mb-4">
        Drag and drop your images here or click to browse. Supports JPG, PNG, WEBP (Max 10MB each).
      </p>
      <div className="flex gap-4 text-xs font-medium text-gray-400">
        <div className="flex items-center gap-1">
          <ImageIcon size={14} /> 10MB limit
        </div>
        <div className="flex items-center gap-1">
          <FileWarning size={14} /> JPG, PNG, WEBP
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
