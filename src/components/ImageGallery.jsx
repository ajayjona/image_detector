import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShieldAlert, ImageIcon, Heart, Download } from 'lucide-react';
import { cn } from '../utils/utils';

const ImageCard = ({ image, onRemove, onDownload, onImageClick, thresholds }) => {
  const isBlurry = image.status === 'completed' ? image.blurScore < thresholds.blur : null;
  const isSmiling = image.status === 'completed' ? image.smileScore >= thresholds.smile : null;
  const isPerfect = image.status === 'completed' && !isBlurry && isSmiling;
  const isReject = image.status === 'completed' && (isBlurry || !isSmiling);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative bg-white/80 backdrop-blur-md rounded-2xl border transition-all duration-300 overflow-hidden",
        isPerfect ? "border-emerald-200 ring-1 ring-emerald-500/20" : "border-slate-200",
        isReject ? "opacity-90 grayscale-[0.2]" : ""
      )}
    >
      <div
        className="aspect-[4/3] relative bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onImageClick(image.id)}
      >
        <img
          src={image.preview}
          alt={image.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <button
          onClick={() => onRemove(image.id)}
          className="absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 z-10"
          title="Remove photo"
        >
          <X size={14} />
        </button>

        <button
          onClick={() => onDownload(image)}
          className="absolute top-2 right-10 p-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-full transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 z-10"
          title="Download original"
        >
          <Download size={14} />
        </button>

        {/* Status Overlays */}
        {image.status === 'completed' && (
          <div className="absolute top-2 left-2 flex gap-1.5 z-10">
            {isPerfect && (
              <div className="bg-emerald-500 text-white p-1.5 rounded-full">
                <Check size={14} strokeWidth={4} />
              </div>
            )}
            {!isPerfect && isSmiling && (
              <div className="bg-pink-500 text-white p-1.5 rounded-full">
                <Heart size={14} fill="currentColor" />
              </div>
            )}
            {isBlurry && (
              <div className="bg-amber-500 text-white p-1.5 rounded-full">
                <ShieldAlert size={14} strokeWidth={3} />
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
            {typeof image.size === 'number' ? `${(image.size / (1024 * 1024)).toFixed(1)}MB` : 'N/A'}
          </span>
        </div>

        {image.status === 'error' || image.analysisError ? (
          <p className="text-[10px] text-red-500 font-bold bg-red-50 p-1.5 rounded-lg border border-red-100 italic">
            {image.analysisError || "Analysis failed"}
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {image.status === 'completed' && (
              <>
                <div className={cn(
                  "px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-colors",
                  isBlurry ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                )}>
                  {isBlurry ? "Blurry" : "Sharp"}
                  <span className="opacity-50 font-black ml-0.5">{Math.round(image.blurScore || 0)}</span>
                </div>
                <div className={cn(
                  "px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-colors",
                  isSmiling ? "bg-pink-50 text-pink-600 border border-pink-100" : "bg-slate-50 text-slate-400 border border-slate-100"
                )}>
                  {isSmiling ? "Smiling" : "Neutral"}
                  <span className="opacity-50 font-black ml-0.5">{Math.round((image.smileScore || 0) * 100)}%</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ImageGallery = ({ images, onRemove, onDownload, onImageClick, thresholds }) => {
  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-slate-300"
      >
        <ImageIcon size={64} strokeWidth={1} className="mb-6 opacity-40 animate-pulse text-blue-200" />
        <p className="text-lg font-medium text-slate-400">Your library is empty</p>
        <p className="text-sm text-slate-300 mt-2">Upload some photos to get started</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      <AnimatePresence mode="popLayout">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onRemove={onRemove}
            onDownload={onDownload}
            onImageClick={onImageClick}
            thresholds={thresholds}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;
