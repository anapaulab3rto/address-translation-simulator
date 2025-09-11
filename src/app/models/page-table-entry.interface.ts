export interface PageTableEntry {
  pid: number;
  pageNumber: any;
  showAddress?: boolean;
  frameNumber?: string;
  offset?: string;
  valid: boolean;
  referencedAt?: number;
  loadedAt?: number;
}
