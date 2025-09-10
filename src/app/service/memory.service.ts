import { Injectable } from '@angular/core';
import { PageFrame } from '../models/page-frame.interface';
import { PageTableEntry } from '../models/page-table-entry.interface';
import { Process } from '../models/process.interface';

@Injectable({
  providedIn: 'root',
})
export class MemoryService {
  addressBits = 4;
  pageSizeBytes = 2;
  framesCount = 8;
  replacementPolicy = 'FIFO';

  private pageFrames: PageFrame[] = [];
  private pageTable: PageTableEntry[] = [];
  private processes: Process[] = [];
  private time = 0;
  private faults = 0;
  private hits = 0;
  private nextPid = 1;
  private activePid?: number;

  constructor() {}

  splitAddress(virtualAddr: number) {
    const pageSizeBytes = this.pageSizeBytes;
    const pageNumber = Math.floor(virtualAddr / pageSizeBytes);
    const offset = virtualAddr % pageSizeBytes;
    return { pageNumber, offset };
  }

  translateForProcess(pid: number, virtualAddr: number) {
    const p = this.processes.find((p) => p.pid === pid);
    if (!p) throw new Error(`Processo PID=${pid} não encontrado`);

    const { pageNumber, offset } = this.splitAddress(virtualAddr);

    let pte = p.pageTable.find(
      (e) => e.pageNumber === pageNumber && e.pid === pid
    );

    if (!pte) {
      pte = { pid, pageNumber, valid: false };
      p.pageTable.push(pte);
    }

    if (pte.valid && pte.frameNumber !== undefined) {
      this.hits++;
      pte.referencedAt = this.time;
      const physical = pte.frameNumber * this.pageSizeBytes + offset;
      return {
        pid: pid,
        virtual: virtualAddr.toString(2),
        physical: physical.toString(2),
        pageNumber,
        offset,
        hit: true,
        timestamp: this.time,
      };
    }

    this.faults++;
    this.loadPageForProcess(pid, pageNumber);

    const loaded = p.pageTable.find(
      (e) => e.pageNumber === pageNumber && e.pid === pid
    )!;
    loaded.referencedAt = this.time;
    const physical = loaded.frameNumber! * this.pageSizeBytes + offset;
    return {
      pid: pid,
      virtual: virtualAddr.toString(2),
      physical: physical.toString(2),
      pageNumber,
      offset,
      hit: false,
      timestamp: this.time,
    };
  }

  loadPageForProcess(pid: number, pageNumber: number) {
    const free = this.pageFrames.find((f) => f.pageNumber === undefined);
    if (free) {
      this.mapPageToFrame(pid, pageNumber, free.frameNumber);
      return;
    }
  }

  private mapPageToFrame(
    pid: number,
    pageNumber: number,
    frameNumber: number
  ): void {
    const frame = this.pageFrames[frameNumber];
    frame.pageNumber = pageNumber;
    frame.pid = pid;

    let proc = this.processes.find((p) => p.pid === pid)!;
    let pte = proc.pageTable.find(
      (e) => e.pageNumber === pageNumber && e.pid === pid
    );
      
    if (!pte) {
      pte = { pid, pageNumber, valid: false };
      proc.pageTable.push(pte);
    }
    pte.valid = true;
    pte.frameNumber = frameNumber;
    pte.loadedAt = this.time;
    pte.referencedAt = this.time;
  }
}
