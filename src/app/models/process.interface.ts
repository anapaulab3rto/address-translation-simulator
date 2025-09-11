import { PageTableEntry } from "./page-table-entry.interface";

export interface Process {
  pid: number;
  name: string;
  pageSizeBytes: number;
  addressSpaceBytes: number;
  pageTable: PageTableEntry[];
}
