
import React, { useState, useCallback, useEffect } from 'react';
import { ImageData, AppStatus } from './types';
import { generatePdfFromImages } from './services/pdfService';
import ImageUploader from './components/ImageUploader';
import ImageSorter from './components/ImageSorter';
import PdfPreview from './components/PdfPreview';
import BlogView from './components/BlogView';
import { FileText, Loader2, AlertCircle, BookOpen } from 'lucide-react';

type ViewType = 'converter' | 'blog';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('converter');
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [images, setImages] = useState<ImageData[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simple routing based on hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/blog/')) {
        const slug = hash.replace('#/blog/', '');
        setView('blog');
        setCurrentSlug(slug);
        window.scrollTo(0, 0);
      } else if (hash === '#/blog') {
        setView('blog');
        setCurrentSlug(undefined);
        window.scrollTo(0, 0);
      } else {
        setView('converter');
        setCurrentSlug(undefined);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newView: ViewType, slug?: string) => {
    if (newView === 'blog') {
      window.location.hash = slug ? `#/blog/${slug}` : `#/blog`;
    } else {
      window.location.hash = '#/';
    }
  };

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
      <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('converter')}>
            <div className="bg-blue-600 p-2 rounded-lg text-white" aria-hidden="true">
              <FileText size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">ImgToPDF Fast</h1>
          </div>
          <nav className="flex items-center gap-6">
            <button 
              onClick={() => navigate('blog')}
              className={`text-sm font-semibold transition-colors flex items-center gap-2 ${view === 'blog' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <BookOpen size={18} />
              Resources
            </button>
            <div className="hidden sm:block text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Fast & Private
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 max-w-4xl py-8 sm:py-12">
        {view === 'blog' ? (
          <BlogView slug={currentSlug} onNavigate={navigate} />
        ) : (
          <>
            {status === AppStatus.COMPLETED && pdfUrl ? (
              <PdfPreview pdfUrl={pdfUrl} onReset={handleReset} />
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Hero / Step 1 */}
                <section aria-labelledby="step-1-title">
                  <div className="mb-6 text-center sm:text-left">
                    <h2 id="step-1-title" className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                      Convert Images to PDF
                    </h2>
                    <p className="text-gray-500 max-w-lg">
                      Transform your JPG, PNG, or WEBP images into a professional PDF document. Fast, secure, and 100% in your browser.
                    </p>
                  </div>
                  <ImageUploader 
                    onImagesSelected={handleImagesSelected} 
                    disabled={status === AppStatus.GENERATING} 
                  />
                </section>

                {/* Error Message */}
                {error && (
                  <div role="alert" className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
                    <AlertCircle className="shrink-0" size={20} />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Step 2: Sort & Generate */}
                {images.length > 0 && (
                  <section aria-labelledby="step-2-title" className="animate-in slide-in-from-top-2 duration-300">
                    <div className="mb-4">
                      <h2 id="step-2-title" className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold" aria-hidden="true">2</span>
                        Review and Arrange
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
                            <Loader2 className="animate-spin" size={24} aria-hidden="true" />
                            Generating PDF...
                          </>
                        ) : (
                          <>
                            <FileText size={24} aria-hidden="true" />
                            Convert to PDF Now
                          </>
                        )}
                      </button>
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">ImgToPDF Fast</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                The most secure way to convert images to PDF. Your files never leave your device.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Learn More</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                <li><button onClick={() => navigate('blog', 'image-to-pdf-guide')} className="hover:text-blue-600">The Ultimate Guide</button></li>
                <li><button onClick={() => navigate('blog', 'how-to-convert-images-to-pdf-online')} className="hover:text-blue-600">Quick Start</button></li>
                <li><button onClick={() => navigate('blog')} className="hover:text-blue-600 font-medium">All Resources</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Trust</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center gap-2">No data collection</li>
                <li className="flex items-center gap-2">Local processing</li>
                <li className="flex items-center gap-2">Free forever</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-50 text-center text-sm text-gray-400">
            <p>&copy; 2025 ImgToPDF Fast. All processing happens in your browser for maximum security.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
