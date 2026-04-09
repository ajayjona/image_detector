import React, { useState, useMemo } from 'react';
import ImageDropzone from '../components/ImageDropzone';
import ImageGallery from '../components/ImageGallery';
import Sidebar from '../components/Sidebar';
import ImageModal from '../components/ImageModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { cn } from '../utils/utils';
import { analyzeImage, isModelsLoading, isModelsLoaded } from '../utils/analysis';
import JSZip from 'jszip';
import { Filter, Heart, Trash2, Sliders, ShieldAlert, Download, RefreshCw, Camera } from 'lucide-react';
import { db } from '../utils/db';

function DetectorPage() {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState({
    hideBlurry: false,
    onlySmiling: false,
    viewMode: 'all', // 'all', 'perfect', 'rejects'
  });
  const [thresholds, setThresholds] = useState({
    blur: 40,
    smile: 0.7,
  });
  const [modelStatus, setModelStatus] = useState({ loading: false, loaded: false });
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'danger'
  });

  const onImagesSelected = async (newImages) => {
    const imagesWithBlobs = await Promise.all(newImages.map(async img => {
      if (img.preview.startsWith('http')) {
        const res = await fetch(img.preview);
        const blob = await res.blob();
        return { ...img, data: blob };
      } else if (img.file) {
        return { ...img, data: img.file };
      }
      return img;
    }));

    await db.images.bulkAdd(imagesWithBlobs.map(({ file, ...rest }) => rest));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = async (id) => {
    const img = images.find(i => i.id === id);
    if (!img) return;

    setConfirmState({
      isOpen: true,
      title: 'Remove Photo?',
      message: `Are you sure you want to remove "${img.name}"? This cannot be undone.`,
      type: 'danger',
      onConfirm: async () => {
        if (img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
        await db.images.delete(id);
        setImages((prev) => prev.filter((item) => item.id !== id));
      }
    });
  };

  const handleClear = () => {
    setConfirmState({
      isOpen: true,
      title: 'Clear Library?',
      message: 'This will remove ALL photos from your session. You will need to upload them again.',
      type: 'danger',
      onConfirm: async () => {
        images.forEach(img => {
          if (img.preview.startsWith('blob:')) URL.revokeObjectURL(img.preview);
        });
        await db.images.clear();
        setImages([]);
        setFilters({ hideBlurry: false, onlySmiling: false, viewMode: 'all' });
      }
    });
  };

  const handleExport = async () => {
    if (filteredImages.length === 0) return;

    setConfirmState({
      isOpen: true,
      title: 'Download Filtered Photos?',
      message: `You are about to download ${filteredImages.length} photos as a ZIP archive.`,
      type: 'download',
      onConfirm: async (customName) => {
        setIsExporting(true);
        console.log(`[App] Creating ZIP for ${filteredImages.length} photos...`);

        const zip = new JSZip();
        const folder = zip.folder("filtered_photos");

        try {
          const batchSize = 5;
          for (let i = 0; i < filteredImages.length; i += batchSize) {
            const batch = filteredImages.slice(i, i + batchSize);
            await Promise.all(batch.map(async (img, idx) => {
              try {
                const response = await fetch(img.preview);
                const blob = await response.blob();

                const ext = img.name.includes('.') ? img.name.split('.').pop() : 'jpg';
                const filename = `${img.name.split('.')[0]}_${i + idx + 1}.${ext}`;

                folder.file(filename, blob);
              } catch (err) {
                console.error(`[App] Error adding image to ZIP: ${img.name}`, err);
              }
            }));
            console.log(`[App] Zipped ${Math.min(i + batchSize, filteredImages.length)} / ${filteredImages.length} photos...`);
          }

          const content = await zip.generateAsync({ type: "blob" });
          const url = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          const finalName = customName?.trim() || `curated-photos-${new Date().toISOString().split('T')[0]}`;
          a.download = `${finalName}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error("[App] Export failed:", err);
        } finally {
          setIsExporting(false);
        }
      }
    });
  };

  const handleDownloadSingle = (image) => {
    setConfirmState({
      isOpen: true,
      title: 'Download Photo?',
      message: `Download original file "${image.name}"?`,
      type: 'download',
      onConfirm: () => {
        const a = document.createElement('a');
        a.href = image.preview;
        a.download = image.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  };

  const handleProcess = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    console.log(`[App] Starting batch processing for ${images.length} images...`);

    // Process images in small batches to keep UI responsive
    const batchSize = 2; // Process 2 at a time for better speed while staying responsive
    const imagesToProcess = images.filter(img => img.status !== 'completed');

    for (let i = 0; i < imagesToProcess.length; i += batchSize) {
      const batch = imagesToProcess.slice(i, i + batchSize);

      await Promise.all(batch.map(async (img) => {
        console.log(`[App] Processing image: ${img.name}`);
        // Update status to processing for UI feedback
        setImages(prev => prev.map(item => item.id === img.id ? { ...item, status: 'processing' } : item));

        try {
          const result = await analyzeImage(img.preview, thresholds);
          console.log(`[App] Analysis result for ${img.name}:`, result);

          const updateData = {
            status: 'completed',
            blurScore: result.blurScore,
            smileScore: result.smileScore,
            hasFaces: result.hasFaces,
            analysisError: result.error
          };

          await db.images.update(img.id, updateData);

          setImages(prev => prev.map(item => item.id === img.id ? {
            ...item,
            ...updateData
          } : item));
        } catch (err) {
          console.error(`[App] Error analyzing image ${img.name}:`, err);
          setImages(prev => prev.map(item => item.id === img.id ? { ...item, status: 'error' } : item));
        }
      }));

      // Small pause between batches to allow UI to breathe
      await new Promise(r => setTimeout(r, 100));
    }

    console.log('[App] All images processed.');
    setIsProcessing(false);
  };

  const handleNextImage = () => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImageId);
    if (currentIndex !== -1 && currentIndex < filteredImages.length - 1) {
      setSelectedImageId(filteredImages[currentIndex + 1].id);
    } else if (filteredImages.length > 0) {
      setSelectedImageId(filteredImages[0].id);
    }
  };

  const handlePrevImage = () => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImageId);
    if (currentIndex > 0) {
      setSelectedImageId(filteredImages[currentIndex - 1].id);
    } else if (filteredImages.length > 0) {
      setSelectedImageId(filteredImages[filteredImages.length - 1].id);
    }
  };

  const selectedImage = useMemo(() =>
    images.find(img => img.id === selectedImageId)
    , [images, selectedImageId]);

  // Load from DB on mount
  React.useEffect(() => {
    const loadImages = async () => {
      const storedImages = await db.images.toArray();
      const imagesWithPreviews = storedImages.map(img => ({
        ...img,
        preview: URL.createObjectURL(img.data)
      }));
      setImages(imagesWithPreviews);
    };
    loadImages();
  }, []);

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      // Dynamic Blurry/Smiling flags based on current thresholds
      const isBlurry = img.status === 'completed' ? img.blurScore < thresholds.blur : null;
      const isSmiling = img.status === 'completed' ? img.smileScore >= thresholds.smile : null;

      // Manual Toggles
      if (filters.hideBlurry && isBlurry) return false;
      if (filters.onlySmiling && isSmiling === false) return false;

      // View Modes
      if (img.status === 'completed') {
        const isPerfect = !isBlurry && isSmiling;
        if (filters.viewMode === 'perfect' && !isPerfect) return false;
        if (filters.viewMode === 'rejects' && isPerfect) return false;
      } else if (filters.viewMode !== 'all') {
        return false;
      }

      return true;
    });
  }, [images, filters, thresholds]);

  const stats = useMemo(() => {
    return {
      total: images.length,
      blurry: images.filter(img => img.status === 'completed' && img.blurScore < thresholds.blur).length,
      sharp: images.filter(img => img.status === 'completed' && img.blurScore >= thresholds.blur).length,
      smiling: images.filter(img => img.status === 'completed' && img.smileScore >= thresholds.smile).length,
    };
  }, [images, thresholds]);

  // Track model status for Sidebar feedback
  React.useEffect(() => {
    const checkStatus = () => {
      setModelStatus({
        loading: isModelsLoading(),
        loaded: isModelsLoaded()
      });
    };
    const interval = setInterval(checkStatus, 500);
    return () => clearInterval(interval);
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  // Handle auto-collapse on smaller screens
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-[#fafaf9] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
      <Sidebar
        isCollapsed={!isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <nav className="z-40 flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-black italic tracking-tighter text-slate-900">Detector <span className="text-blue-600">Workplace</span></h2>
          </div>

          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-500",
            modelStatus.loaded ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
              modelStatus.loading ? "bg-blue-50 text-blue-600 border border-blue-100 animate-pulse" :
                "bg-slate-50 text-slate-400 border border-slate-100"
          )}>
            <div className={cn("w-2 h-2 rounded-full", modelStatus.loaded ? "bg-emerald-500" : modelStatus.loading ? "bg-blue-500 animate-ping" : "bg-slate-300")} />
            {modelStatus.loaded ? "AI Engine Ready" : modelStatus.loading ? "Waking up AI..." : "AI Engine Standby"}
          </div>
        </nav>

        {/* Stats Board */}
        <div className="z-30 bg-white border-b border-slate-100 px-12 py-8 shrink-0">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group bg-[#f8fafc] p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md hover:bg-white active:scale-95 cursor-default">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                  <Camera size={24} />
                </div>
                <div>
                  <div className="text-3xl font-black tracking-tight text-slate-900">{stats.total}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Total Photos</div>
                </div>
              </div>
            </div>
            <div className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md hover:bg-white active:scale-95 cursor-default">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-100 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                  <Heart size={24} />
                </div>
                <div>
                  <div className="text-3xl font-black tracking-tight text-emerald-600">{stats.sharp}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Sharp Shots</div>
                </div>
              </div>
            </div>
            <div className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md hover:bg-white active:scale-95 cursor-default">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-sm border border-red-100 transition-colors group-hover:bg-red-500 group-hover:text-white">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <div className="text-3xl font-black tracking-tight text-red-600">{stats.blurry}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Blurry Found</div>
                </div>
              </div>
            </div>
            <div className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md hover:bg-white active:scale-95 cursor-default">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shadow-sm border border-pink-100 transition-colors group-hover:bg-pink-500 group-hover:text-white">
                  <Heart size={24} fill="currentColor" />
                </div>
                <div>
                  <div className="text-3xl font-black tracking-tight text-pink-600">{stats.smiling}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Happy Faces</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto scroll-smooth bg-[#fafaf9]">
          <div className="max-w-7xl mx-auto p-12 space-y-12">

            {/* Control Panel Section */}
            <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 space-y-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between border-b border-slate-100 pb-8">
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Processing Tools</h3>
                  <p className="text-xs font-bold text-slate-500">Fine-tune your selection with AI-driven analysis</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleProcess}
                    disabled={isProcessing || stats.total === 0}
                    className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-slate-200 active:scale-95"
                  >
                    {isProcessing ? <RefreshCw className="animate-spin w-5 h-5" /> : <Filter className="text-blue-400 w-5 h-5" />}
                    {isProcessing ? "Analyzing..." : "Run AI Analysis"}
                  </button>

                  <div className="flex bg-slate-100 p-1.5 rounded-[1.25rem]">
                    {[
                      { id: 'all', label: 'All', icon: Filter },
                      { id: 'perfect', label: 'Perfect', icon: Heart },
                      { id: 'rejects', label: 'Rejects', icon: Trash2 },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setFilters({ ...filters, viewMode: mode.id })}
                        className={cn(
                          "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all",
                          filters.viewMode === mode.id
                            ? "bg-white text-slate-900 shadow-md"
                            : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        <mode.icon className={cn("w-4 h-4", filters.viewMode === mode.id ? "text-blue-500" : "")} />
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {/* AI Thresholds */}
                <div className="space-y-6 group/tip relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Sliders className="w-4 h-4 text-blue-500" />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">AI Thresholds</h4>
                    <div className="absolute -top-12 left-0 w-64 p-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold leading-relaxed shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover/tip:opacity-100 group-hover/tip:translate-y-0 transition-all z-50">
                      Adjust sensitivity levels for automated blur and expression detection.
                      <div className="absolute bottom-[-4px] left-4 w-2 h-2 bg-slate-900 rotate-45" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-600 uppercase">Blur Sensitivity</span>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{thresholds.blur}</span>
                      </div>
                      <input
                        type="range" min="0" max="100" value={thresholds.blur}
                        onChange={(e) => setThresholds({ ...thresholds, blur: parseInt(e.target.value) })}
                        className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-600 uppercase">Smile Confidence</span>
                        <span className="text-[10px] font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded">{Math.round(thresholds.smile * 100)}%</span>
                      </div>
                      <input
                        type="range" min="0" max="100" value={thresholds.smile * 100}
                        onChange={(e) => setThresholds({ ...thresholds, smile: parseInt(e.target.value) / 100 })}
                        className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pink-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Manual Refinement */}
                <div className="space-y-6 group/tip relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="w-4 h-4 text-emerald-500" />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Manual Refinement</h4>
                    <div className="absolute -top-12 left-0 w-64 p-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold leading-relaxed shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover/tip:opacity-100 group-hover/tip:translate-y-0 transition-all z-50">
                      Apply custom filters to show or hide images based on specific AI traits.
                      <div className="absolute bottom-[-4px] left-4 w-2 h-2 bg-slate-900 rotate-45" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center group cursor-pointer bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                      <input
                        type="checkbox" checked={filters.hideBlurry}
                        onChange={(e) => setFilters({ ...filters, hideBlurry: e.target.checked })}
                        className="w-4 h-4 rounded-md border-slate-300 text-blue-600"
                      />
                      <span className="ml-4 text-xs font-black text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                        <ShieldAlert size={16} className="text-red-500" />
                        Exclude Blurry Photos
                      </span>
                    </label>
                    <label className="flex items-center group cursor-pointer bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                      <input
                        type="checkbox" checked={filters.onlySmiling}
                        onChange={(e) => setFilters({ ...filters, onlySmiling: e.target.checked })}
                        className="w-4 h-4 rounded-md border-slate-300 text-pink-600"
                      />
                      <span className="ml-4 text-xs font-black text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                        <Heart size={16} className="text-pink-500" />
                        Focus on Smiling Only
                      </span>
                    </label>
                  </div>
                </div>

                {/* Batch Actions */}
                <div className="space-y-6 group/tip relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="w-4 h-4 text-slate-900" />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Library Actions</h4>
                    <div className="absolute -top-12 left-0 w-64 p-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold leading-relaxed shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover/tip:opacity-100 group-hover/tip:translate-y-0 transition-all z-50">
                      Manage your curated collection with batch export and library maintenance tools.
                      <div className="absolute bottom-[-4px] left-4 w-2 h-2 bg-slate-900 rotate-45" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={handleExport}
                      disabled={filteredImages.length === 0 || isExporting}
                      className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xs transition-all shadow-xl shadow-blue-100 active:scale-95"
                    >
                      {isExporting ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
                      {isExporting ? "Preparing ZIP..." : `Export ${filteredImages.length} Photos`}
                    </button>
                    <button
                      onClick={handleClear}
                      className="flex items-center justify-center gap-3 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 transition-all active:scale-95"
                    >
                      <Trash2 size={14} />
                      Clear Library
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Upload Section - Streamlined */}
            <section className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-8 transition-all hover:bg-slate-100 hover:border-slate-300">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-lg font-black tracking-tight text-slate-900">Upload Workspace</h3>
                  <p className="text-xs font-bold text-slate-400">Drop your session photos here to start AI analysis</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      onImagesSelected([
                        { id: 'test-1', name: 'Neutral.jpg', preview: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80', status: 'pending' },
                        { id: 'test-2', name: 'Smile.jpg', preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', status: 'pending' },
                        { id: 'test-3', name: 'Blurry.jpg', preview: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&blur=50&q=80', status: 'pending' }
                      ]);
                    }}
                    className="text-[10px] font-black uppercase tracking-widest bg-white text-slate-600 px-6 py-3 rounded-xl border border-slate-200 transition-all shadow-sm hover:shadow-md"
                  >
                    Gallery Samples
                  </button>
                  <div className="h-24 w-px bg-slate-200 hidden md:block" />
                  <div className="scale-75 origin-right">
                    <ImageDropzone onImagesSelected={onImagesSelected} />
                  </div>
                </div>
              </div>
            </section>

            {/* Gallery Section */}
            <section className="space-y-8 pb-32">
              <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black italic tracking-tighter text-slate-900">
                    {filteredImages.length === images.length ? "Collection" : "Filtered Matches"}
                  </h3>
                  <span className="text-[10px] font-black text-white bg-slate-900 px-3 py-1 rounded-full uppercase tracking-widest">
                    {filteredImages.length}
                  </span>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure On-Device Processing</span>
                </div>
              </div>
              <ImageGallery
                images={filteredImages}
                onRemove={removeImage}
                onDownload={handleDownloadSingle}
                onImageClick={(id) => setSelectedImageId(id)}
                thresholds={thresholds}
              />
            </section>
          </div>
        </main>
      </div>

      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImageId(null)}
        onDownload={handleDownloadSingle}
        onRemove={removeImage}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState({ ...confirmState, isOpen: false })}
      />
    </div>
  );
}

export default DetectorPage;
