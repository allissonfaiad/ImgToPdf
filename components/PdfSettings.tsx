
import React from 'react';
import { Layout, Maximize2, Move, Square, Monitor, Smartphone } from 'lucide-react';
import { PdfSettings, PageOrientation, PageMargin } from '../types';

interface PdfSettingsProps {
  settings: PdfSettings;
  onChange: (settings: PdfSettings) => void;
  disabled?: boolean;
}

const PdfSettingsComponent: React.FC<PdfSettingsProps> = ({ settings, onChange, disabled }) => {
  const handleOrientationChange = (orientation: PageOrientation) => {
    if (disabled) return;
    console.log('[PdfSettings] Changing orientation:', orientation);
    onChange({ ...settings, orientation });
  };

  const handleMarginChange = (margin: PageMargin) => {
    if (disabled) return;
    console.log('[PdfSettings] Changing margin:', margin);
    onChange({ ...settings, margin });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Orientation */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Layout size={18} className="text-blue-600" />
            Page Orientation
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleOrientationChange('p')}
              disabled={disabled}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                settings.orientation === 'p'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-100 hover:border-gray-200 text-gray-500'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Smartphone size={24} />
              <span className="text-xs font-semibold">Portrait</span>
            </button>
            <button
              onClick={() => handleOrientationChange('l')}
              disabled={disabled}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                settings.orientation === 'l'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-100 hover:border-gray-200 text-gray-500'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Monitor size={24} />
              <span className="text-xs font-semibold">Landscape</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-400">Apply to all pages in the final document.</p>
        </div>

        {/* Margins */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Maximize2 size={18} className="text-blue-600" />
            Page Margins
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {(Object.values(PageMargin) as PageMargin[]).map((m) => (
              <button
                key={m}
                onClick={() => handleMarginChange(m)}
                disabled={disabled}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize border-2 transition-all ${
                  settings.margin === m
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-100 hover:border-gray-200 text-gray-500'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-400">
            {settings.margin === 'none' && 'No spacing around images.'}
            {settings.margin === 'small' && 'Subtle 5mm spacing.'}
            {settings.margin === 'normal' && 'Standard 10mm spacing.'}
            {settings.margin === 'large' && 'Spacious 20mm spacing.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PdfSettingsComponent;
