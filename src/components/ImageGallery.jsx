import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShieldAlert, ImageIcon } from 'lucide-react';
import { cn } from '../utils/utils';

const ImageCard = ({ image, onRemove }) => {
  const isPerfect = image.status === 'completed' && !image.isBlurry && image.isSmiling;
  const isReject = image.status === 'completed' && (image.isBlurry || !image.isSmiling);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative bg-white rounded-xl shadow-sm border transition-all duration-300 overflow-hidden",
        isPerfect ? "border-emerald-200 shadow-emerald-100 shadow-lg" : "border-slate-200",
        isReject ? "opacity-75 grayscale-[0.5]" : ""
      )}
    >
      <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
        <img
          src={image.preview}
          alt={image.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        <button
          onClick={() => onRemove(image.id)}
          className="absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 z-10"
        >
          <X size={14} />
        </button>

        {/* Status Overlays */}
        {image.status === 'completed' && (
          <div className="absolute top-2 left-2 flex gap-1 z-10">
            {isPerfect && (
              <div className="bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
            {isReject && (
              <div className="bg-red-500 text-white p-1 rounded-full shadow-lg">
                <X size={14} strokeWidth={3} />
              </div>
            )}
          </div>
        )}

        {image.status === 'processing' && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
          </div>
        )}
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-700 truncate pr-2" title={image.name}>
            {image.name}
          </p>
          <span className="text-[10px] text-slate-400 whitespace-nowrap">
            {(image.size / (1024 * 1024)).toFixed(1)}MB
          </span>
        </div>

        {image.status === 'error' || image.analysisError ? (
          <p className="text-[10px] text-red-500 font-medium">
            {image.analysisError || "Analysis failed"}
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {image.isBlurry !== null && (
              <div className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-0.5",
                image.isBlurry ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
              )}>
                {image.isBlurry ? <ShieldAlert size={10} /> : <Check size={10} />}
                {image.isBlurry ? "Blurry" : "Sharp"}
                <span className="opacity-50 font-normal ml-0.5">{Math.round(image.blurScore || 0)}</span>
              </div>
            )}
            {image.isSmiling !== null && (
              <div className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-0.5",
                image.isSmiling ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              )}>
                {image.isSmiling ? "Smiling" : "No Smile"}
                <span className="opacity-50 font-normal ml-0.5">{Math.round((image.smileScore || 0) * 100)}%</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ImageGallery = ({ images, onRemove }) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <ImageIcon size={48} strokeWidth={1} className="mb-4 opacity-20" />
        <p className="text-sm">No photos uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <AnimatePresence mode="popLayout">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;
