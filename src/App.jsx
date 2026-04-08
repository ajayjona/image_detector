import React, { useState, useMemo } from 'react';
import ImageDropzone from './components/ImageDropzone';
import ImageGallery from './components/ImageGallery';
import Sidebar from './components/Sidebar';
import { cn } from './utils/utils';

function App() {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState({
    hideBlurry: false,
    onlySmiling: false,
  });

  const onImagesSelected = (newImages) => {
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleClear = () => {
    setImages([]);
    setFilters({ hideBlurry: false, onlySmiling: false });
  };

  const handleProcess = async () => {
    if (images.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate processing for now
    // In a real app, this would use a Web Worker or TensorFlow.js
    const processedImages = await Promise.all(images.map(async (img) => {
      if (img.status === 'completed') return img;
      
      // Artificial delay to simulate local processing
      await new Promise(r => setTimeout(r, 800));
      
      return {
        ...img,
        status: 'completed',
        isBlurry: Math.random() > 0.7, // Simulated
        isSmiling: Math.random() > 0.5, // Simulated
      };
    }));
    
    setImages(processedImages);
    setIsProcessing(false);
  };

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      if (filters.hideBlurry && img.isBlurry) return false;
      if (filters.onlySmiling && img.isSmiling === false) return false;
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
              Your Local Photo Library
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl">
              Process your photos locally for total privacy. We use AI in the browser to detect blurry or non-smiling photos so you can clean your library quickly.
            </p>
          </div>

          {/* Upload Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Upload Queue</h3>
              <span className="text-xs text-slate-400 bg-white border border-slate-100 px-2 py-1 rounded-full">
                {images.length} photos ready
              </span>
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
