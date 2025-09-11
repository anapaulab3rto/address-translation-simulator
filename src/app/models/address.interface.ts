import { Process } from "./process.interface";

export interface Address {
  p?: Process;
  virtual?: string;
  physical?: string;
  pageNumber?: number;
  frameNumber?: number;
  offset?: number;
  hit?: boolean;
  timestamp?: number;
}
