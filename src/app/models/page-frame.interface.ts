export interface PageFrame {
  frameNumber: number;
  pageNumber?: number;
  occupied?: boolean;
  pid?: number;
  loadedAt?: number;
}