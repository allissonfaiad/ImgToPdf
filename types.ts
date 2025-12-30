
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
