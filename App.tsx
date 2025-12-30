import React, { useState, useCallback, useEffect } from 'react';
import { ImageData, AppStatus, PdfSettings, PageMargin } from './types';
import { generatePdfFromImages } from './services/pdfService';
import ImageUploader from './components/ImageUploader';
import ImageSorter from './components/ImageSorter';
import PdfPreview from './components/PdfPreview';
import BlogView from './components/BlogView';
import PdfSettingsComponent from './components/PdfSettings';
import FaqSection from './components/FaqSection';
import SupportBanner from './components/SupportBanner';
import SupportFooter from './components/SupportFooter';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import { FileText, Loader2, AlertCircle, BookOpen, Settings2 } from 'lucide-react';
import { blogPosts } from './blogContent';

type ViewType = 'converter' | 'blog';

const DEFAULT_SETTINGS: PdfSettings = {
  orientation: 'p',
  margin: PageMargin.NORMAL,
};

const AppContent: React.FC = () => {
  const [view, setView] = useState<ViewType>('converter');
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [images, setImages] = useState<ImageData[]>([]);
  const [pdfSettings, setPdfSettings] = useState<PdfSettings>(DEFAULT_SETTINGS);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clean URL routing based on pathname
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      
      // 1. Root / Home
      if (path === '/' || path === '') {
        setView('converter');
        setCurrentSlug(undefined);
      } 
      // 2. Blog List
      else if (path === '/blog' || path === '/blog/') {
        setView('blog');
        setCurrentSlug(undefined);
        window.scrollTo(0, 0);
      } 
      // 3. Blog Posts
      else if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '').replace(/\/$/, '');
        setView('blog');
        setCurrentSlug(slug);
        window.scrollTo(0, 0);
      } 
      // 4. Pillar & Programmatic pages (root-level slugs)
      else {
        const slug = path.substring(1).replace(/\/$/, '');
        const postExists = blogPosts.some(p => p.slug === slug);
        if (postExists) {
          setView('blog');
          setCurrentSlug(slug);
          window.scrollTo(0, 0);
        } else {
          // Fallback to converter or 404 (here we fallback to home)
          setView('converter');
          setCurrentSlug(undefined);
        }
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange(); // Initial check

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (newView: ViewType, slug?: string) => {
    let url = '/';
    if (newView === 'blog') {
      if (!slug) {
        url = '/blog';
      } else {
        const post = blogPosts.find(p => p.slug === slug);
        if (post?.isPillar || post?.isProgrammatic) {
          url = `/${slug}`;
        } else {
          url = `/blog/${slug}`;
        }
      }
    }
    
    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
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
      const pdfBlob = await generatePdfFromImages(images, pdfSettings);
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
    setPdfSettings(DEFAULT_SETTINGS);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 py-4 sticky top-0 z-50 shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('converter')}>
            <div className="bg-blue-600 p-2 rounded-lg text-white" aria-hidden="true">
              <FileText size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">ImgToPDF Fast</h1>
          </div>
          <nav className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => navigate('blog')}
              className={`text-sm font-semibold transition-colors flex items-center gap-2 ${view === 'blog' && !currentSlug ? 'text-blue-600' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'}`}
            >
              <BookOpen size={18} />
              <span className="hidden xs:inline">Resources</span>
            </button>
            <div className="hidden sm:block text-sm font-medium text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              Fast & Private
            </div>
            <ThemeToggle />
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
                  <div className="mb-8 text-center sm:text-left">
                    <h2 id="step-1-title" className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-slate-100 mb-4 leading-tight">
                      Convert Images to PDF
                    </h2>
                    <p className="text-gray-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
                      Transform your JPG, PNG, or WEBP images into a professional PDF document. Fast, secure, and 100% in your browser.
                    </p>
                    
                    {/* SUPPORT BANNER (TOP) */}
                    <SupportBanner />
                  </div>
                  
                  <ImageUploader 
                    onImagesSelected={handleImagesSelected} 
                    disabled={status === AppStatus.GENERATING} 
                  />

                  {/* Informational Sections for SEO and UX */}
                  {images.length === 0 && <FaqSection />}
                </section>

                {/* Error Message */}
                {error && (
                  <div role="alert" className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
                    <AlertCircle className="shrink-0" size={20} />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Step 2: Settings & Reorder */}
                {images.length > 0 && (
                  <section aria-labelledby="step-2-title" className="animate-in slide-in-from-top-2 duration-300 space-y-10">
                    <div>
                      <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-200 flex items-center gap-2">
                          <Settings2 size={20} className="text-blue-600" />
                          PDF Settings
                        </h2>
                      </div>
                      <PdfSettingsComponent 
                        settings={pdfSettings} 
                        onChange={setPdfSettings} 
                        disabled={status === AppStatus.GENERATING} 
                      />
                    </div>

                    <div>
                      <div className="mb-4">
                        <h2 id="step-2-title" className="text-lg font-semibold text-gray-800 dark:text-slate-200 flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold" aria-hidden="true">2</span>
                          Review and Arrange
                        </h2>
                      </div>
                      
                      <ImageSorter 
                        images={images} 
                        onReorder={handleReorder} 
                        onRemove={handleRemove} 
                      />

                      <div className="mt-12 sticky bottom-8 flex justify-center z-40">
                        <button
                          onClick={handleGeneratePdf}
                          disabled={status === AppStatus.GENERATING}
                          className="w-full sm:w-80 flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800/50 disabled:cursor-not-allowed transition-all duration-200 shadow-xl shadow-blue-200 dark:shadow-none"
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
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* SUPPORT FOOTER (BOTTOM - ABOVE FOOTER) */}
      <SupportFooter />

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 py-12 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-4">ImgToPDF Fast</h4>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                The most secure way to convert images to PDF. Your files never leave your device.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-4">Learn More</h4>
              <ul className="text-sm text-gray-500 dark:text-slate-400 space-y-2">
                <li><button onClick={() => navigate('blog', 'image-to-pdf-guide')} className="hover:text-blue-600 dark:hover:text-blue-400">The Ultimate Guide</button></li>
                <li><button onClick={() => navigate('blog', 'how-to-convert-images-to-pdf-online')} className="hover:text-blue-600 dark:hover:text-blue-400">Quick Start</button></li>
                <li><button onClick={() => navigate('blog')} className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">All Resources</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-4">Trust</h4>
              <ul className="text-sm text-gray-500 dark:text-slate-400 space-y-2">
                <li className="flex items-center gap-2 text-green-600 dark:text-green-500 font-medium">No data collection</li>
                <li className="flex items-center gap-2">Local processing</li>
                <li className="flex items-center gap-2">Free forever</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-50 dark:border-slate-800 text-center text-sm text-gray-400 dark:text-slate-500">
            <p>&copy; 2025 ImgToPDF Fast. All processing happens in your browser for maximum security.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;