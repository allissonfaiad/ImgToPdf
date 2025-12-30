
import { jsPDF } from 'jspdf';
import { ImageData, PdfSettings, MARGIN_MAP } from '../types';

/**
 * Converts a list of ImageData to a PDF Blob.
 * Each image becomes a page in the PDF.
 */
export const generatePdfFromImages = async (
  images: ImageData[],
  settings: PdfSettings
): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { orientation, margin: marginKey } = settings;
      const margin = MARGIN_MAP[marginKey];

      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // PDF Page dimensions (mm)
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const safeWidth = pdfWidth - (margin * 2);
      const safeHeight = pdfHeight - (margin * 2);

      for (let i = 0; i < images.length; i++) {
        const imgData = images[i];
        
        // Add a new page if it's not the first one
        if (i > 0) {
          pdf.addPage(orientation === 'p' ? 'p' : 'l', 'a4');
        }

        const img = await loadImage(imgData.previewUrl);
        
        // Calculate dimensions to fit image to safe area while maintaining aspect ratio
        let imgWidth = img.width;
        let imgHeight = img.height;
        const ratio = imgWidth / imgHeight;

        // Scale to fit safe area
        if (imgWidth > safeWidth) {
          imgWidth = safeWidth;
          imgHeight = imgWidth / ratio;
        }
        if (imgHeight > safeHeight) {
          imgHeight = safeHeight;
          imgWidth = imgHeight * ratio;
        }

        // Second pass scaling if still too big (e.g. very wide after height scale)
        if (imgWidth > safeWidth) {
          imgWidth = safeWidth;
          imgHeight = imgWidth / ratio;
        }

        // Center the image within the safe area (plus margin offset)
        const x = margin + (safeWidth - imgWidth) / 2;
        const y = margin + (safeHeight - imgHeight) / 2;

        pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');
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
