export interface PageFrame {
  frameNumber: string;
  pageNumber?: string;
  occupied?: boolean;
  pid?: number;
  loadedAt?: number;
  referenciedAt?: number;
}
