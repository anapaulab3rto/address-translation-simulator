import { Injectable, signal } from '@angular/core';
import { PageFrame } from '../models/page-frame.interface';
import { Process } from '../models/process.interface';
import { MOCK_FRAMES, MOCK_PROCESSES } from '../mock/mock-data';
import { PageReplacement } from './page-replacement.service';
import { PageTableEntry } from '../models/page-table-entry.interface';
import { ConfigMemory } from '../models/config-memory.interface';

@Injectable({
  providedIn: 'root',
})
export class MemoryService {
  activeProcess = signal<Process | null>(null);
  activePageTable = signal<PageTableEntry[] | null>(null);
  address = signal<any | null>(null);
  activePageFrames = signal<PageFrame[] | null>(null);

  repl = new PageReplacement();
  addressSpace = 64;
  pageSizeBytes = 16;
  framesCount = 7;
  replacementPolicy!: 'FIFO' | 'LRU';

  private pageFrames: PageFrame[] = MOCK_FRAMES;
  private processes: Process[] = MOCK_PROCESSES;
  private time = 0;
  private faults = 0;
  private hits = 0;

  constructor() {
    this.activePageFrames.set([...this.pageFrames]);
  }

  setConfig(config: ConfigMemory) {
    this.addressSpace = config.addressSpace;
    this.pageSizeBytes = config.pageSizeBytes;
    this.replacementPolicy = config.replacementPolicy;
    this.framesCount = config.framesCount;

    this.pageFrames = Array.from({ length: this.framesCount }, (_, i): PageFrame => {
      const bits = this.bitsNecessarios(this.framesCount);
      const frameNumber = i.toString(2).padStart(bits, '0');
      return { frameNumber, occupied: false };
    }
    );

    for (let p of this.processes) p.pageTable = [];

    this.activePageFrames.set([...this.pageFrames]);
    this.activePageTable.set([]);
    this.activeProcess.set(null);
  }
  reset() {
    this.addressSpace = 64;
    this.pageSizeBytes = 16;
    this.framesCount = 7;
    this.replacementPolicy = 'FIFO';

    this.pageFrames = MOCK_FRAMES;
    this.processes = MOCK_PROCESSES;
  }

  getProcesses() {
    return this.processes;
  }

  getAddressSpace(): number {
    return this.addressSpace;
  }

  getMemoryFrames() {
    return this.pageFrames;
  }

  bitsNecessarios(n: number): number {
    if (n === 0) return 1;
    return Math.ceil(Math.log2(n));
  }

  getValidPageTables(): PageTableEntry[] {
    const validEntries: PageTableEntry[] = [];

    this.processes.forEach(process => {
      process.pageTable.forEach(entry => {
        if (entry.valid) {
          validEntries.push(entry);
        }
      });
    });

    return validEntries;
  }

  getNumberOfPages() {
    return this.addressSpace / this.pageSizeBytes;
  }

  sAddress(p: Process, addr: string) {
    const numberOfPages = this.getNumberOfPages();
    const pageNumberBits = this.bitsNecessarios(numberOfPages);
    return {
      pageNumber: addr.slice(0, pageNumberBits),
      offset: addr.slice(pageNumberBits),
    };
  }

  createProcess(pid: number, name: string) {
    const pageTable: PageTableEntry[] = [];
    this.processes.push({ pid, name, pageTable });
  }

  findPTE(p: Process, pageNumber: string) {
    return p.pageTable.find((e) => e.pageNumber === pageNumber);
  }

  alocatePTE(p: Process, pageNumber: string) {
    const pte: PageTableEntry = { pid: p.pid, pageNumber, valid: false };
    p.pageTable = [...p.pageTable, pte];
    this.activePageTable.set([...p.pageTable]);

    if (this.activeProcess()?.pid === p.pid) {
      this.activeProcess.set({ ...p });
    }
    return pte;
  }

  updatePTE(p: Process, pageNumber: string, newPTE: PageTableEntry) {
    const oldPTE = p.pageTable.find(e => e.pageNumber === pageNumber);
    const finalPTE = { ...oldPTE, ...newPTE };

    const newPageTable = p.pageTable.map((e) =>
      e.pageNumber === pageNumber ? finalPTE : e
    );

    p.pageTable = newPageTable;
    this.activePageTable.set([...newPageTable]);

    if (this.activeProcess()?.pid === p.pid) {
      this.activeProcess.set({ ...p });
    }
  }

  findProcessByPID(pid: number) {
    return this.processes.find((p) => p.pid === pid);
  }

  loadPageForProcess(pid: number, pageNumber: string, pte: PageTableEntry) {
    const free = this.pageFrames.find(f => !f.pid);
    console.log(free);
    console.log(this.pageFrames);


    if (free) {
      free.pageNumber = pageNumber;
      free.pid = pid;
      this.activePageFrames.set([...this.pageFrames]);
      return free.frameNumber;
    }

    const victimPTE = this.repl.chooseVictimFrame(this.replacementPolicy, this.getValidPageTables());

    if (!victimPTE) {
      const fallback = { ...this.pageFrames[0], pageNumber, pid, occupied: true };
      this.pageFrames = [fallback, ...this.pageFrames.slice(1)];
      this.activePageFrames.set([...this.pageFrames]);
      return fallback.frameNumber;
    }

    const victimFrame = this.pageFrames.find(f => f.frameNumber === victimPTE.frameNumber);
    victimFrame!.pageNumber = pageNumber;
    victimFrame!.pid = pid;
    this.activePageFrames.set([...this.pageFrames]);

    victimPTE.valid = false;
    victimPTE.frameNumber = undefined;

    this.activePageTable.set([...this.getActiveProcess()?.pageTable ?? []]);

    return victimFrame!.frameNumber;

  }


  translate(pid: number, virtualAddr: number) {
    const p = this.processes.find((p) => p.pid === pid);
    if (!p) return;

    this.time++;
    const bits = this.bitsNecessarios(this.addressSpace);
    const addr = virtualAddr.toString(2).padStart(bits, '0');
    const { pageNumber, offset } = this.sAddress(p, addr);

    let pte = this.findPTE(p, pageNumber);

    if (!pte) pte = this.alocatePTE(p, pageNumber);


    if (pte.valid && pte.frameNumber !== undefined) {
      this.hits++;
      let frame = this.pageFrames.find(f => f.frameNumber === pte.frameNumber);
      pte.referencedAt = this.time;
      frame!.referencedAt = this.time;
      this.updatePTE(p, pageNumber, pte);
      const physical = pte.frameNumber + offset;
      this.setAddress(addr, physical, pageNumber, offset, pte.frameNumber, p);
      this.setProcessActive(p.pid);
      return p;
    }

    this.faults++;
    const frameNumber = this.loadPageForProcess(p.pid, pageNumber, pte);
    const loadedPTE = { ...this.findPTE(p, pageNumber)! };
    let frame = this.pageFrames.find(f => f.frameNumber === frameNumber);
    frame!.referencedAt = this.time;
    frame!.loadedAt = this.time;
    loadedPTE.loadedAt = this.time;
    loadedPTE.referencedAt = this.time;
    loadedPTE.valid = true;
    loadedPTE.offset = offset;
    loadedPTE.frameNumber = frameNumber;
    this.updatePTE(p, pageNumber, loadedPTE);

    const physical = loadedPTE.frameNumber + offset;
    this.setAddress(addr, physical, pageNumber, offset, frameNumber, p);
    this.setProcessActive(p.pid);
    return p;
  }

  setProcessActive(pid: number) {
    const process = this.processes.find((p) => p.pid === pid);
    if (process) {
      this.activeProcess.set(process);

      this.activePageTable.set([...process.pageTable]);
    } else {
      this.activeProcess.set(null);
      this.activePageTable.set(null);
    }
  }

  setAddress(v: string, ph: string, vpn: string, offset: string, vfn: string, p: Process) {
    this.address.set({
      virtual: v,
      physical: ph,
      vpn: vpn,
      offset: offset,
      vfn: vfn,
      process: p,
      pageSizeBytes: this.pageSizeBytes,
      spaceAddr: this.addressSpace,
    });
  }

  getActiveProcess() {
    return this.activeProcess();
  }

  getActivePageTable() {
    return this.activePageTable();
  }
}
