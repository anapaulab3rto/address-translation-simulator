import { Component, computed } from '@angular/core';
import { MemoryService } from '../../service/memory.service';
import { PageTableEntry } from '../../models/page-table-entry.interface';

@Component({
  selector: 'app-step-by-step-guide',
  imports: [],
  templateUrl: './step-by-step-guide.component.html',
  styleUrl: './step-by-step-guide.component.scss'
})
export class StepByStepGuideComponent {

  addr = computed(() => this.memory.address()?.virtual ?? 'addr');
  vpn = computed(() => this.memory.address()?.vpn ?? 'vpn');
  offset = computed(() => this.memory.address()?.offset ?? 'd');
  f = computed(() => this.memory.address()?.vfn ?? 'frame');

  x = computed(() => this.memory.address()?.spaceAddr ?? 0);
  w = computed(() => this.memory.address()?.pageSizeBytes ?? 0);
  y = computed(() =>
    this.memory.bitsNecessarios(Number(this.memory.address()?.spaceAddr ?? 0)).toString()
  );

  constructor(public memory: MemoryService) {}



}
