import React from 'react';

const SupportFooter: React.FC = () => {
  return (
    <div className="py-16 px-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 text-center animate-in fade-in duration-700 transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="space-y-2">
           <h3 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight">Love This Tool?</h3>
           <p className="text-gray-500 dark:text-slate-400 text-base font-medium">Support development by buying a coffee</p>
        </div>
        <a href="https://ko-fi.com/P5P01R9TEA" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity mt-2 shadow-lg shadow-yellow-100 dark:shadow-none hover:shadow-xl rounded-xl overflow-hidden border border-yellow-100 dark:border-slate-700">
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