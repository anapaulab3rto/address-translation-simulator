import { Injectable } from '@angular/core';
import { PageFrame } from '../models/page-frame.interface';
import { Process } from '../models/process.interface';
import { MOCK_FRAMES, MOCK_PROCESSES } from '../mock/mock-data';
import { BehaviorSubject } from 'rxjs';
import { PageReplacement } from './page-replacement.service';
import { PageTableEntry } from '../models/page-table-entry.interface';
import { Address } from '../models/address.interface';

@Injectable({
  providedIn: 'root',
})
export class MemoryService {
  private activeProcessSource = new BehaviorSubject<Process | null>(null);
  activeProcess$ = this.activeProcessSource.asObservable();

  private activePageTableSource = new BehaviorSubject<PageTableEntry[] | null>(null);
  activePageTable$ = this.activePageTableSource.asObservable();

  private addressSource = new BehaviorSubject<any | null>(null);
  address = this.addressSource.asObservable();


  repl = new PageReplacement();
  addressBits = 4;
  pageSizeBytes = 2;
  framesCount = 8;
  replacementPolicy!: 'FIFO' | "LRU";

  private pageFrames: PageFrame[] = MOCK_FRAMES;
  private processes: Process[] = MOCK_PROCESSES;
  private time = 0;
  private faults = 0;
  private hits = 0;

  constructor() { }

  setConfig() {
    
  }

  getProcesses() {
    return this.processes;
  }

  getMemoryFrames() {
    return this.pageFrames;
  }

  private allPteEntries(): PageTableEntry[] {
    return this.processes.flatMap(p => p.pageTable);
  }

  sAddress(p: Process, addr: string) {
    const numberOfPages = this.getNumberOfPages(p);
    const pageNumber = this.bitsNecessarios(numberOfPages);

    const resultado = {
      pageNumber: addr.slice(0, pageNumber),
      offset: addr.slice(pageNumber)
    };
    return resultado;
  }

  bitsNecessarios(n: number): number {
    if (n === 0) return 1;
    return Math.floor(Math.log2(n));
  }

  getNumberOfPages(p: Process) {
    return p.addressSpaceBytes / p.pageSizeBytes;
  }

  translate(pid: number, virtualAddr: number) {
    const p = this.processes.find(p => p.pid === pid);

    if (p) {
      const bits = this.bitsNecessarios(p.addressSpaceBytes);

      const addr = virtualAddr.toString(2).padStart(bits, "0");
      const { pageNumber, offset } = this.sAddress(p, addr);

      let pte: any = this.findPTE(p, pageNumber);

      if(!pte) {
        pte = this.alocatePTE(p, pageNumber);
      }

      if(pte.valid && pte.frameNumber !== undefined) {
          this.hits++;
          pte.referencedAt = this.time;
          this.updatePTE(p, pageNumber, pte);
          const physical = pte.frameNumber + offset;
          console.log(physical);
          this.setAddress(addr, physical, pte, p);
          return;
      }

      this.faults++
      const frameNumber = this.loadPageForProcess(p.pid, pageNumber, pte);
      let loaded = this.findPTE(p, pageNumber)!;
      loaded.loadedAt = this.time;
      loaded.valid = true;
      loaded.offset = offset;
      loaded.frameNumber = frameNumber;
      this.updatePTE(p, pageNumber, loaded);
      const physical = loaded.frameNumber + offset;
      console.log(p);
      this.setAddress(addr, physical, loaded, p);
      console.log(physical);

    }
  }

  findPTE(p: Process, pageNumber: string) {
    return p.pageTable.find(e => e.pageNumber === pageNumber);
  }

  alocatePTE(p: Process, pageNumber: string) {
    const pte = {pid: p.pid, pageNumber: pageNumber, valid: false};
    p.pageTable.push(pte);
    return pte;
  }

  findProcessByPID(pid: number) {
    return this.processes.find(p => p.pid === pid);
  }

  updatePTE(p: Process, pageNumber: string, newPTE: PageTableEntry) {
    let pte = p.pageTable.find(e => e.pageNumber === pageNumber);
    pte = newPTE;
  }

  loadPageForProcess(pid: number, pageNumber: string, pte: PageTableEntry) {
    const frameFree = this.pageFrames.find(f=> f.pageNumber === undefined);
    if(frameFree) {
      frameFree.pageNumber = pageNumber;
      frameFree.pid = pid;
      return frameFree.frameNumber;
    }

    return "00";


  }
//   translateForProcess(pid: number, virtualAddr: number) {
//     this.translate(pid, virtualAddr);
//     this.time++;
//     const p = this.processes.find((p) => p.pid === pid);
//     if (!p) throw new Error(`Processo PID=${pid} não encontrado`);

//     const { pageNumber, offset } = this.splitAddress(virtualAddr);

//     let pte = p.pageTable.find(
//       (e) => e.pageNumber === pageNumber && e.pid === pid
//     );

//     if (!pte) {
//       pte = { pid, pageNumber, valid: false };
//       p.pageTable.push(pte);
//     }

//     if (pte.valid && pte.frameNumber !== undefined) {
//       this.hits++;
//       pte.referencedAt = this.time;
//       const physical = pte.frameNumber * this.pageSizeBytes + offset;
//       return {
//         pid: pid,
//         virtual: virtualAddr.toString(2),
//         physical: physical.toString(2),
//         pageNumber,
//         offset,
//         hit: true,
//         timestamp: this.time,
//       };
//     }

//     this.faults++;
//     this.loadPageForProcess(pid, pageNumber);

//     const loaded = p.pageTable.find(
//       (e) => e.pageNumber === pageNumber && e.pid === pid
//     )!;
//     loaded.referencedAt = this.time;
//     const physical = loaded.frameNumber! * this.pageSizeBytes + offset;
//     return {
//       pid: pid,
//       virtual: virtualAddr.toString(2),
//       physical: physical.toString(2),
//       pageNumber,
//       offset,
//       hit: false,
//       timestamp: this.time,
//     };
//   }

//   loadPageForProcess(pid: number, pageNumber: string) {
//     const free = this.pageFrames.find((f) => f.pageNumber === undefined);
//     if (free) {
//       this.mapPageToFrame(pid, pageNumber, free.frameNumber);
//       return;
//     }

//     const victim = this.repl.chooseVictimFrame(this.replacementPolicy, this.allPteEntries());

//     if (!victim || victim.frameNumber === undefined) {
//       this.mapPageToFrame(pid, pageNumber, '0');
//       return;
//     }
//   }

//   private mapPageToFrame(
//     pid: number,
//     pageNumber: string,
//     frameNumber: string
//   ): void {
//     const frame = this.pageFrames[frameNumber];
//     frame.pageNumber = pageNumber;
//     frame.pid = pid;

//     let proc = this.processes.find((p) => p.pid === pid)!;

//     let pte = proc.pageTable.find(
//       (e) => e.pageNumber === pageNumber && e.pid === pid
//     );

//     if (!pte) {
//       pte = { pid, pageNumber, valid: false };
//       console.log('aq');

//       proc.pageTable.push(pte);
//     }
//     pte.valid = true;
//     pte.frameNumber = frameNumber;
//     pte.loadedAt = this.time;
//     pte.referencedAt = this.time;

//     console.log(this.getActiveProcess()?.pageTable);


//     this.setActiveProcess(this.getActiveProcess());
//   }

  setProcessActive(pid: number) {
    console.log(pid);

    const process = this.processes.find(p => p.pid == pid);

    console.log(process);

    if (process) {
      this.activeProcessSource.next(process);
      this.activePageTableSource.next(process.pageTable);
    } else {
      this.activeProcessSource.next(null);
      this.activePageTableSource.next(null);
    }

  }

  setAddress(v: string, ph: string, pte: PageTableEntry, p: Process ) {
    const response = {
      virtual: v,
      physical: ph,
      pte: pte,
      process: p,
    }
    this.addressSource.next(response);
  }

  setActiveProcess(process: Process | null) {
    if (process) {
      this.activeProcessSource.next(process);
    }
  }

  setActivePageTable(pageTable: PageTableEntry[] | null) {
    if(pageTable) {
      this.activePageTableSource.next(pageTable);
    }
  }

  getActiveProcess() {
    return this.activeProcessSource.value;
  }

  getActivePageTable() {
    return this.activePageTableSource.value;
  }
}
