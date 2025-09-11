import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { PageFrame } from '../../models/page-frame.interface';
import { MemoryService } from '../../service/memory.service';

@Component({
  selector: 'app-memory-view',
  imports: [CommonModule],
  templateUrl: './memory-view.component.html',
  styleUrl: './memory-view.component.scss'
})
export class MemoryView {
  pageFrames = computed<PageFrame[]>(() => this.memory.activePageFrames() ?? []);

  constructor(private memory: MemoryService) {}

}
