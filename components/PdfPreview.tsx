
import React from 'react';
import { FileCheck, Download, RefreshCcw, ArrowLeft, ExternalLink } from 'lucide-react';

interface PdfPreviewProps {
  pdfUrl: string;
  onReset: () => void;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ pdfUrl, onReset }) => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl max-w-2xl mx-auto text-center animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
        <FileCheck size={40} />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">PDF Generated!</h2>
      <p className="text-gray-500 mb-8">
        Your images have been successfully converted into a single PDF document.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a
          href={pdfUrl}
          download="converted-document.pdf"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          <Download size={20} />
          Download PDF
        </a>
        
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
        >
          <ExternalLink size={20} />
          Preview
        </a>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mx-auto"
        >
          <ArrowLeft size={18} />
          Convert more images
        </button>
      </div>
    </div>
  );
};

export default PdfPreview;
