import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '../utils/utils';

const ImageModal = ({ image, onClose, onDownload, onRemove, onNext, onPrev }) => {
    if (!image) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 md:p-8"
                onClick={onClose}
            >
                <motion.div
                    className="absolute top-6 right-6 flex gap-4 z-[110]"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); onDownload(image); }}
                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 backdrop-blur-md"
                        title="Download"
                    >
                        <Download size={20} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(image.id); onClose(); }}
                        className="p-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full transition-all border border-red-500/20 backdrop-blur-md"
                        title="Remove"
                    >
                        <Trash2 size={20} />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 backdrop-blur-md"
                        title="Close"
                    >
                        <X size={20} />
                    </button>
                </motion.div>

                {/* Navigation Buttons */}
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/5 backdrop-blur-sm hidden md:block"
                >
                    <ArrowLeft size={24} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/5 backdrop-blur-sm hidden md:block"
                >
                    <ArrowRight size={24} />
                </button>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative max-w-full max-h-full flex flex-col md:flex-row items-center justify-center gap-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Image Container */}
                    <div className="relative group max-w-[70vw]">
                        <img
                            src={image.preview}
                            alt={image.name}
                            className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl border border-white/20"
                        />
                    </div>

                    {/* Analysis Side Panel */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="w-80 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 p-8 space-y-8 shadow-2xl"
                    >
                        <div className="space-y-1">
                            <h3 className="text-white font-black text-2xl tracking-tight truncate" title={image.name}>
                                {image.name}
                            </h3>
                            <p className="text-white/40 text-sm font-medium italic">{(image.size / (1024 * 1024)).toFixed(2)} MB • Original Format</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-white/40">
                                    <span>Edge Intensity</span>
                                    <span className={image.blurScore < 40 ? "text-amber-400" : "text-emerald-400"}>
                                        {image.blurScore < 40 ? "Needs Review" : "Studio Sharp"}
                                    </span>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-3xl font-black text-white">
                                            {typeof image.blurScore === 'number' ? Math.round(image.blurScore) : '--'}
                                        </span>
                                        <span className="text-[10px] text-white/30 font-bold mb-1">LAPLACIAN VAR.</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (image.blurScore / 100) * 100)}%` }}
                                            className={cn("h-full rounded-full", image.blurScore < 40 ? "bg-amber-400" : "bg-emerald-400")}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-white/40">
                                    <span>Expression Analysis</span>
                                    <span className={image.smileScore < 0.7 ? "text-slate-400" : "text-pink-400"}>
                                        {image.smileScore < 0.7 ? "Neutral / Posed" : "Genuine Smile"}
                                    </span>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-3xl font-black text-white">
                                            {typeof image.smileScore === 'number' ? Math.round(image.smileScore * 100) : '--'}%
                                        </span>
                                        <span className="text-[10px] text-white/30 font-bold mb-1">CONFIDENCE</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${image.smileScore * 100}%` }}
                                            className={cn("h-full rounded-full", image.smileScore < 0.7 ? "bg-slate-400" : "bg-pink-500")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <button
                                onClick={() => onDownload(image)}
                                className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/5"
                            >
                                <Download size={18} />
                                Download Original
                            </button>
                            <button
                                onClick={() => { onRemove(image.id); onClose(); }}
                                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all border border-red-500/10"
                            >
                                <Trash2 size={16} />
                                Remove from Library
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ImageModal;
