import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Trash2, Download, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, type = 'danger' }) => {
    const [inputValue, setInputValue] = React.useState('');

    React.useEffect(() => {
        if (isOpen) setInputValue('');
    }, [isOpen]);

    if (!isOpen) return null;

    const config = {
        danger: {
            icon: <Trash2 className="text-red-500" size={24} />,
            btnClass: "bg-red-500 hover:bg-red-600",
            accent: "border-red-100 bg-red-50/30",
            confirmLabel: "Yes, remove"
        },
        download: {
            icon: <Download className="text-blue-500" size={24} />,
            btnClass: "bg-blue-600 hover:bg-blue-700",
            accent: "border-blue-100 bg-blue-50/30",
            confirmLabel: "Download ZIP"
        },
        warning: {
            icon: <AlertCircle className="text-amber-500" size={24} />,
            btnClass: "bg-amber-500 hover:bg-amber-600",
            accent: "border-amber-100 bg-amber-50/30",
            confirmLabel: "Yes, continue"
        }
    }[type] || {
        icon: <AlertCircle className="text-amber-500" size={24} />,
        btnClass: "bg-amber-500 hover:bg-amber-600",
        accent: "border-amber-100 bg-amber-50/30",
        confirmLabel: "Yes, continue"
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onCancel}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    className="relative w-full max-w-sm bg-white rounded-[2.5rem] overflow-hidden border border-slate-200"
                >
                    <div className="p-8 space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`p-5 rounded-3xl border ${config.accent}`}>
                                {config.icon}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">{message}</p>
                            </div>
                        </div>

                        {type === 'download' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                                    Custom Filename (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Vacation_2024"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => { onConfirm(inputValue); onCancel(); }}
                                className={`w-full py-4 rounded-2xl font-black text-white transition-all active:scale-95 ${config.btnClass}`}
                            >
                                {config.confirmLabel}
                            </button>
                            <button
                                onClick={onCancel}
                                className="w-full py-3 rounded-2xl font-bold text-slate-400 hover:text-slate-600 transition-all text-sm"
                            >
                                No, go back
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;
