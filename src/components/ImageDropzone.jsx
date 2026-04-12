import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '../utils/utils';

const ImageDropzone = ({ onImagesSelected, className }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      const newImages = acceptedFiles.map(file => ({
        file,
        id: Math.random().toString(36).substring(7),
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        status: 'pending', // pending, processing, completed
        isBlurry: null,
        isSmiling: null,
      }));
      onImagesSelected(newImages);
    }
  }, [onImagesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out p-12 text-center",
        isDragActive
          ? "border-blue-500 bg-blue-50/50"
          : "border-slate-300 hover:border-slate-400 bg-slate-50",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-white rounded-full border border-slate-100 group-hover:scale-110 transition-transform duration-200">
          <Upload className={cn(
            "w-8 h-8",
            isDragActive ? "text-blue-500" : "text-slate-400"
          )} />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-slate-700">
            {isDragActive ? "Drop photos here" : "Drag & drop photos"}
          </p>
          <p className="text-sm text-slate-500">
            Support JPEG, PNG, WebP up to 20MB
          </p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
          Select Files
        </button>
      </div>
    </div>
  );
};

export default ImageDropzone;
