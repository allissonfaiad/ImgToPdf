import React from 'react';

const SupportBanner: React.FC = () => {
  return (
    <div className="my-8 p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100/50 dark:border-blue-800/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-700">
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-600 animate-pulse" aria-hidden="true"></span>
        <h3 className="text-base font-bold text-blue-900 dark:text-blue-300">Support This Free Tool</h3>
      </div>
      <a href="https://ko-fi.com/P5P01R9TEA" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity flex-shrink-0 shadow-sm hover:shadow-md rounded-xl overflow-hidden border border-transparent dark:border-slate-700">
        <img
          src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
          alt="Buy Me a Coffee at ko-fi.com"
          className="h-9 border-0 block"
        />
      </a>
    </div>
  );
};

export default SupportBanner;