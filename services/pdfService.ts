
import { jsPDF } from 'jspdf';
import { ImageData } from '../types';

/**
 * Converts a list of ImageData to a PDF Blob.
 * Each image becomes a page in the PDF.
 */
export const generatePdfFromImages = async (images: ImageData[]): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
        compress: true,
      });

      // PDF Page dimensions (px)
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        const imgData = images[i];
        
        // Add a new page if it's not the first one
        if (i > 0) {
          pdf.addPage();
        }

        const img = await loadImage(imgData.previewUrl);
        
        // Calculate dimensions to fit image to A4 while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        const ratio = width / height;

        if (width > pdfWidth) {
          width = pdfWidth;
          height = width / ratio;
        }
        if (height > pdfHeight) {
          height = pdfHeight;
          width = height * ratio;
        }

        // Center the image on the page
        const x = (pdfWidth - width) / 2;
        const y = (pdfHeight - height) / 2;

        pdf.addImage(img, 'JPEG', x, y, width, height, undefined, 'FAST');
      }

      const pdfOutput = pdf.output('blob');
      resolve(pdfOutput);
    } catch (error) {
      console.error('[ImageToPDF] PDF Generation Error:', error);
      reject(error);
    }
  });
};

/**
 * Helper to load an image into an HTMLImageElement
 */
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
};
