import { PageTableEntry } from "./page-table-entry.interface";

export interface Process {
  pid: number;
  name: string;
  pageTable: PageTableEntry[];
}
