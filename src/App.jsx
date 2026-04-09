import React, { useState, useMemo } from 'react';
import ImageDropzone from './components/ImageDropzone';
import ImageGallery from './components/ImageGallery';
import Sidebar from './components/Sidebar';
import { cn } from './utils/utils';
import { analyzeImage } from './utils/analysis';

function App() {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState({
    hideBlurry: false,
    onlySmiling: false,
    viewMode: 'all', // 'all', 'perfect', 'rejects'
  });

  const onImagesSelected = (newImages) => {
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleClear = () => {
    setImages([]);
    setFilters({ hideBlurry: false, onlySmiling: false, viewMode: 'all' });
  };

  const handleProcess = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    console.log(`[App] Starting batch processing for ${images.length} images...`);

    // Process images in small batches to keep UI responsive
    const batchSize = 1; // Try 1 at a time for maximum reliability
    const imagesToProcess = images.filter(img => img.status !== 'completed');

    for (let i = 0; i < imagesToProcess.length; i += batchSize) {
      const batch = imagesToProcess.slice(i, i + batchSize);

      await Promise.all(batch.map(async (img) => {
        console.log(`[App] Processing image: ${img.name}`);
        // Update status to processing for UI feedback
        setImages(prev => prev.map(item => item.id === img.id ? { ...item, status: 'processing' } : item));

        try {
          const result = await analyzeImage(img.preview);
          console.log(`[App] Analysis result for ${img.name}:`, result);

          setImages(prev => prev.map(item => item.id === img.id ? {
            ...item,
            status: 'completed',
            isBlurry: result.isBlurry,
            isSmiling: result.isSmiling,
            blurScore: result.blurScore,
            smileScore: result.smileScore,
            hasFaces: result.hasFaces,
            analysisError: result.error
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

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      // Manual Toggles
      if (filters.hideBlurry && img.isBlurry) return false;
      if (filters.onlySmiling && img.isSmiling === false) return false;

      // View Modes
      if (img.status === 'completed') {
        const isPerfect = !img.isBlurry && img.isSmiling;
        if (filters.viewMode === 'perfect' && !isPerfect) return false;
        if (filters.viewMode === 'rejects' && isPerfect) return false;
      } else if (filters.viewMode !== 'all') {
        // Hide un-processed images in specific view modes
        return false;
      }

      return true;
    });
  }, [images, filters]);

  const stats = useMemo(() => {
    return {
      total: images.length,
      blurry: images.filter(img => img.isBlurry === true).length,
      sharp: images.filter(img => img.isBlurry === false).length,
      smiling: images.filter(img => img.isSmiling === true).length,
    };
  }, [images]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      <Sidebar
        filters={filters}
        setFilters={setFilters}
        stats={stats}
        onProcess={handleProcess}
        isProcessing={isProcessing}
        onClear={handleClear}
      />

      <main className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-7xl mx-auto p-8 space-y-12">
          {/* Header Section */}
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Your Local Photo Library 77
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl">
              Process your photos locally for total privacy. We use AI in the browser to detect blurry or non-smiling photos so you can clean your library quickly.
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
            <ImageGallery images={filteredImages} onRemove={removeImage} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
