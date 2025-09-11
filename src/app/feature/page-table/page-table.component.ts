import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
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
  entries = computed<PageTableEntry[]>(() => this.memory.activePageTable() ?? []);
  active = computed(() => this.memory.activeProcess() ?? { pid: 0, name: '—' });

  constructor(private memory: MemoryService) { }

}
