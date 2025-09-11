import { CommonModule } from '@angular/common';
import { Component, effect, Input } from '@angular/core';
import { PageTableEntry } from '../../models/page-table-entry.interface';
import { MemoryService } from '../../service/memory.service';
import { Process } from '../../models/process.interface';

@Component({
  selector: 'app-page-table',
  imports: [CommonModule],
  templateUrl: './page-table.component.html',
  styleUrl: './page-table.component.scss'
})
export class PageTable {
  active?: Process | undefined;
  @Input() entries: PageTableEntry[] = [];

  constructor(private memory: MemoryService) {}

  ngOnInit() {
    this.memory.activeProcess$.subscribe(p => {
      this.active = p ?? undefined;
    })
    this.memory.activePageTable$.subscribe(pageTable => {
      this.entries = pageTable ?? [];
      console.log(pageTable);

    });
  }
}
