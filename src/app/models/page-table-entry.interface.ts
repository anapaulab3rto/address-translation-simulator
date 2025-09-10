export interface PageTableEntry {
  pid: number;
  pageNumber: number;
  showAddress?: boolean;
  frameNumber?: number;
  offset?: number;
  valid: boolean;
  referencedAt?: number;
  loadedAt?: number;
}