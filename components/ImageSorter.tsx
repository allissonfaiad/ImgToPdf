
import React from 'react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Trash2 } from 'lucide-react';
import { ImageData } from '../types';

interface ImageSorterProps {
  images: ImageData[];
  onReorder: (newOrder: ImageData[]) => void;
  onRemove: (id: string) => void;
}

const ImageSorter: React.FC<ImageSorterProps> = ({ images, onReorder, onRemove }) => {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">
          Order your pages ({images.length} {images.length === 1 ? 'image' : 'images'})
        </h3>
        <p className="text-sm text-gray-500 hidden sm:block">
          Drag handles to reorder pages
        </p>
      </div>

      <Reorder.Group
        axis="y"
        values={images}
        onReorder={onReorder}
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {images.map((image, index) => (
            <Reorder.Item
              key={image.id}
              value={image}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600">
                <GripVertical size={20} />
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                <img
                  src={image.previewUrl}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {image.name}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded">
                    Page {index + 1}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(image.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>

              <button
                onClick={() => onRemove(image.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove image"
              >
                <Trash2 size={18} />
              </button>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
};

export default ImageSorter;
