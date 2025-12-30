import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Info, HelpCircle } from 'lucide-react';

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      q: "Can I convert multiple images into one PDF?",
      a: "Yes. You can upload multiple images, arrange them in any order, and convert them into a single multi-page PDF."
    },
    {
      q: "Can I change the order of pages in the PDF?",
      a: "Absolutely. You can reorder your images before conversion, and the PDF pages will follow the same order."
    },
    {
      q: "Can I choose portrait or landscape orientation?",
      a: "Yes. You can select either portrait or landscape orientation before generating your PDF."
    },
    {
      q: "Can I customize page margins?",
      a: "Yes. You can choose from margin options such as none, small, normal, or large."
    },
    {
      q: "Is this Image to PDF converter free?",
      a: "Yes. The converter is completely free to use, with no watermarks, limits, or registration required."
    },
    {
      q: "Are my files safe and private?",
      a: "Yes. All image processing happens locally in your browser. Your files are never uploaded to a server."
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-16 my-16 animate-in fade-in duration-700">
      {/* How it Works */}
      <section aria-labelledby="how-it-works-title">
        <h2 id="how-it-works-title" className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Info className="text-blue-600" size={28} />
          How Our Image to PDF Converter Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Upload your image files (JPG, PNG, GIF, or WEBP)",
            "Preview thumbnails of your selected images",
            "Arrange the images in the exact order you want for the PDF",
            "Choose page orientation (portrait or landscape) and margins",
            "Click “Convert to PDF”",
            "Download your PDF file instantly"
          ].map((step, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-sm text-gray-600 font-medium leading-tight mt-1.5">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section aria-labelledby="features-title">
        <h2 id="features-title" className="text-2xl font-bold text-gray-900 mb-8">Image to PDF Converter Features</h2>
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            {[
              "100% free with no watermarks or hidden limitations",
              "No account or registration required",
              "Convert one or multiple images into a single PDF",
              "Drag-and-drop page ordering with thumbnail previews",
              "Page orientation options: portrait and landscape",
              "Margin options: none, small, normal, or large",
              "Fast, secure, and private processing (files stay on your device)"
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600 text-sm font-medium">
                <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why Convert */}
      <section aria-labelledby="why-convert-title">
        <h2 id="why-convert-title" className="text-2xl font-bold text-gray-900 mb-8">Why Convert Images to PDF?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Professional Documents</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Convert scanned photos, screenshots, or images into clean PDF files suitable for business, school, or professional use. Ideal for resumes, reports, and presentations.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Better Organization</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Combine multiple images into a single PDF document for easier sharing, storage, and archiving. Perfect for receipts, photo collections, and documentation.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Universal Compatibility</h3>
            <p className="text-sm text-gray-600 leading-relaxed">PDF files display consistently across all devices, browsers, and operating systems, ensuring your documents look the same everywhere.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Secure File Format</h3>
            <p className="text-sm text-gray-600 leading-relaxed">PDFs are more secure than editable image files, helping preserve the integrity of important documents when sharing.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Reduced File Size</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Image optimization during PDF conversion often results in smaller files that are easier to email, upload, and store.</p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section aria-labelledby="faq-title">
        <h2 id="faq-title" className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <HelpCircle className="text-blue-600" size={28} />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqData.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-200">
              <button
                onClick={() => toggleAccordion(i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === i}
              >
                <span className="font-bold text-gray-900 text-base sm:text-lg">{item.q}</span>
                {openIndex === i ? (
                  <ChevronUp size={22} className="text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown size={22} className="text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-sm sm:text-base text-gray-600 animate-in slide-in-from-top-4 duration-300">
                  <div className="pt-2 border-t border-gray-100 mt-2 italic text-gray-500">
                    {item.a}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FaqSection;
