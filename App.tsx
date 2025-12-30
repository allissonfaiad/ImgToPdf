
import React, { useState, useCallback, useEffect } from 'react';
import { ImageData, AppStatus } from './types';
import { generatePdfFromImages } from './services/pdfService';
import ImageUploader from './components/ImageUploader';
import ImageSorter from './components/ImageSorter';
import PdfPreview from './components/PdfPreview';
import { FileText, Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [images, setImages] = useState<ImageData[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[ImageToPDF] Status changed:', status);
  }, [status]);

  const handleImagesSelected = (newImages: ImageData[]) => {
    setImages((prev) => [...prev, ...newImages]);
    setStatus(AppStatus.READY);
    setError(null);
  };

  const handleReorder = (newOrder: ImageData[]) => {
    setImages(newOrder);
  };

  const handleRemove = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (filtered.length === 0) setStatus(AppStatus.IDLE);
      return filtered;
    });
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) return;
    
    setStatus(AppStatus.GENERATING);
    setError(null);

    try {
      const pdfBlob = await generatePdfFromImages(images);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setStatus(AppStatus.COMPLETED);
    } catch (err) {
      setError('An error occurred while generating your PDF. Please try again.');
      setStatus(AppStatus.READY);
      console.error('[ImageToPDF] Generation error:', err);
    }
  };

  const handleReset = () => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    
    setImages([]);
    setPdfUrl(null);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <FileText size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">ImgToPDF</h1>
          </div>
          <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Fast & Private
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 max-w-4xl py-8 sm:py-12">
        {status === AppStatus.COMPLETED && pdfUrl ? (
          <PdfPreview pdfUrl={pdfUrl} onReset={handleReset} />
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Step 1: Upload */}
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">1</span>
                  Upload Images
                </h2>
              </div>
              <ImageUploader 
                onImagesSelected={handleImagesSelected} 
                disabled={status === AppStatus.GENERATING} 
              />
            </section>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
                <AlertCircle className="shrink-0" size={20} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Step 2: Sort & Generate */}
            {images.length > 0 && (
              <section className="animate-in slide-in-from-top-2 duration-300">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">2</span>
                    Review and Convert
                  </h2>
                </div>
                
                <ImageSorter 
                  images={images} 
                  onReorder={handleReorder} 
                  onRemove={handleRemove} 
                />

                <div className="mt-12 sticky bottom-8 flex justify-center">
                  <button
                    onClick={handleGeneratePdf}
                    disabled={status === AppStatus.GENERATING}
                    className="w-full sm:w-80 flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-200 shadow-xl shadow-blue-200"
                  >
                    {status === AppStatus.GENERATING ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <FileText size={24} />
                        Convert to PDF Now
                      </>
                    )}
                  </button>
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-400">
        <p>&copy; 2025 ImgToPDF. All processing happens in your browser.</p>
      </footer>
    </div>
  );
};

export default App;
