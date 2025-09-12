import { Injectable } from '@angular/core';
import { PageTableEntry } from '../models/page-table-entry.interface';
import { PageFrame } from '../models/page-frame.interface';

@Injectable({
  providedIn: 'root'
})
export class PageReplacement {

  chooseVictimFrame(policy: string, pageTable: PageFrame[]) {
    const loaded = pageTable.filter(p => p.occupied === true && p.frameNumber);
    console.log(loaded);

    if(!loaded.length) return null;
    if(policy === 'FIFO') {
      return this.fifo(loaded)
    };
    return this.lru(loaded);
  }

  private fifo(loaded: PageFrame[]) {
      return loaded.reduce((acc, curr) => (acc.loadedAt! <= curr.loadedAt! ? acc : curr))
  }

  private lru(loaded: PageFrame[]) {
    return loaded.reduce((acc, curr) => (acc.referencedAt! <= curr.referencedAt! ? acc : curr))
  }
}
