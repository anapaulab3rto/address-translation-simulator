import { PageFrame } from './models/page-frame.interface';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { InputAddress } from './feature/input-address/input-address.component';
import { MemoryView } from './feature/memory-view/memory-view.component';
import { PageTable } from './feature/page-table/page-table.component';
import { MemoryService } from './service/memory.service';
import { StepByStepGuideComponent } from './feature/step-by-step-guide/step-by-step-guide.component';
import { PageTableEntry } from './models/page-table-entry.interface';

@Component({
  selector: 'app-root',
  imports: [FormsModule, InputAddress, MemoryView, PageTable, StepByStepGuideComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'address-translator-simulator';
  addressBits = 8;
  pageSizeBytes = 2;
  framesCount = 10;
  replacementPolicy = 'FIFO'

  memoryFrames: PageFrame[] = []
  pageTable: PageTableEntry[] = [];

  constructor(private memoryService: MemoryService) {

  }

  ngOnInit() {
    this.memoryFrames = this.memoryService.getMemoryFrames();
    this.pageTable = this.memoryService.getActivePageTable() ?? [];
  }

}
