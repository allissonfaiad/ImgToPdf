
export interface ImageData {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  READY = 'READY',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export type PageOrientation = 'p' | 'l';

export enum PageMargin {
  NONE = 'none',
  SMALL = 'small',
  NORMAL = 'normal',
  LARGE = 'large'
}

export interface PdfSettings {
  orientation: PageOrientation;
  margin: PageMargin;
}

export const MARGIN_MAP: Record<PageMargin, number> = {
  [PageMargin.NONE]: 0,
  [PageMargin.SMALL]: 5,
  [PageMargin.NORMAL]: 10,
  [PageMargin.LARGE]: 20,
};
