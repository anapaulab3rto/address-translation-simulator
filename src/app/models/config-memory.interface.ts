export interface ConfigMemory {
  addressSpace: number;
  pageSizeBytes: number;
  framesCount: number;
  replacementPolicy: 'FIFO' | "LRU";
}
