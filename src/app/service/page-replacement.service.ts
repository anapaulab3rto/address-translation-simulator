import { Injectable } from '@angular/core';
import { PageTableEntry } from '../models/page-table-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class PageReplacement {

  chooseVictimFrame(policy: 'FIFO' | 'LRU', pageTable: PageTableEntry[]) {
    const loaded = pageTable.filter(p => p.valid);
    if(!loaded.length) return null;
    if(policy === 'FIFO') {
      return this.fifo(loaded)
    };
    return this.lru(loaded);
  }

  private fifo(loaded: PageTableEntry[]) {
      return loaded.reduce((acc, curr) => (acc.loadedAt! <= curr.loadedAt! ? acc : curr))
  }

  private lru(loaded: PageTableEntry[]) {
    return loaded.reduce((acc, curr) => (acc.referencedAt! <= curr.referencedAt! ? acc : curr))
  }
}
