export interface Address {
  pid?: number;
  virtual?: string;
  physical?: string;
  pageNumber?: number;
  frameNumber?: number;
  offset?: number;
  hit?: boolean;
  timestamp?: number;
}
