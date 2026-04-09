import React, { useState, useMemo } from 'react';
import ImageDropzone from '../components/ImageDropzone';
import ImageGallery from '../components/ImageGallery';
import Sidebar from '../components/Sidebar';
import ImageModal from '../components/ImageModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { cn } from '../utils/utils';
import { analyzeImage, isModelsLoading, isModelsLoaded } from '../utils/analysis';
import JSZip from 'jszip';
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

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      <Sidebar
        filters={filters}
        setFilters={setFilters}
        thresholds={thresholds}
        setThresholds={setThresholds}
        stats={stats}
        modelStatus={modelStatus}
        onProcess={handleProcess}
        isProcessing={isProcessing}
        isExporting={isExporting}
        onClear={handleClear}
        onExport={handleExport}
        filteredCount={filteredImages.length}
      />

      <main className="flex-1 overflow-y-auto scroll-smooth bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-50">
        <div className="max-w-7xl mx-auto p-8 space-y-12">
          {/* Header Section */}
          <div className="space-y-4 relative">
            <div className="absolute -top-24 -left-20 w-64 h-64 bg-blue-200/20 blur-3xl rounded-full" />
            <div className="absolute -top-10 right-0 w-80 h-80 bg-purple-200/20 blur-3xl rounded-full" />

            <h2 className="text-5xl font-black tracking-tighter text-slate-900 bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 uppercase">
              Id'a <span className="text-2xl align-top text-blue-600">by Osoa Lesley</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl leading-relaxed italic">
              "Precision curation for those who live behind the lens."
            </p>
          </div>

          {/* Upload Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Upload Queue</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onImagesSelected([
                      { id: 'test-1', name: 'Neutral.jpg', preview: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80', status: 'pending' },
                      { id: 'test-2', name: 'Smile.jpg', preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', status: 'pending' },
                      { id: 'test-3', name: 'Blurry.jpg', preview: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&blur=50&q=80', status: 'pending' }
                    ]);
                  }}
                  className="text-xs bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded-lg transition-colors"
                >
                  Load Samples
                </button>
                <span className="text-xs text-slate-400 bg-white border border-slate-100 px-2 py-1 rounded-full">
                  {images.length} photos ready
                </span>
              </div>
            </div>
            <ImageDropzone onImagesSelected={onImagesSelected} />
          </section>

          {/* Gallery Section */}
          <section className="space-y-4 pb-20">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                {filteredImages.length === images.length ? "All Photos" : "Filtered View"}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  Showing {filteredImages.length} of {images.length}
                </span>
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
