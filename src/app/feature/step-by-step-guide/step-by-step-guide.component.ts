import { Component } from '@angular/core';
import { MemoryService } from '../../service/memory.service';
import { PageTableEntry } from '../../models/page-table-entry.interface';

@Component({
  selector: 'app-step-by-step-guide',
  imports: [],
  templateUrl: './step-by-step-guide.component.html',
  styleUrl: './step-by-step-guide.component.scss'
})
export class StepByStepGuideComponent {

  addr = "addr"
  w = "w";
  x = "x";
  y = "y";
  vpn = "vpn";
  offset = "d";
  f = "frame number";
  pte: PageTableEntry = {
    pid: 0,
    valid: true,
    pageNumber: "00",
    frameNumber: "11",
  };

  response = {};

  constructor(private memory: MemoryService) {}

  ngOnInit() {
    this.memory.address.subscribe(res => {
      console.log(res);

      this.addr = res.virtual;
      this.x = res.process.addressSpaceBytes;
      this.w = res.process.pageSizeBytes;
      this.vpn = res.pte.pageNumber;
      this.offset = res.pte.offset;
      this.f = res.pte.frameNumber;
      this.pte = res.pte;
      this.y = this.memory.bitsNecessarios(Number(this.x)).toString();

    })
  }

}
