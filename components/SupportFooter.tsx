import React from 'react';

const SupportFooter: React.FC = () => {
  return (
    <div className="py-16 px-4 bg-white border-t border-gray-100 text-center animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="space-y-2">
           <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Love This Tool?</h3>
           <p className="text-gray-500 text-base font-medium">Support development by buying a coffee</p>
        </div>
        <a href="https://ko-fi.com/P5P01R9TEA" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity mt-2 shadow-lg shadow-yellow-100 hover:shadow-xl rounded-lg overflow-hidden border border-yellow-100">
          <img
            src="https://storage.ko-fi.com/cdn/kofi1.png?v=6"
            alt="Buy Me a Coffee at ko-fi.com"
            className="h-10 border-0 block"
          />
        </a>
      </div>
    </div>
  );
};

export default SupportFooter;