import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Address } from '../../models/address.interface';
import { Process } from '../../models/process.interface';
import { MemoryService } from '../../service/memory.service';

@Component({
  selector: 'app-input-address',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  standalone: true,
  templateUrl: './input-address.component.html',
  styleUrl: './input-address.component.scss'
})
export class InputAddress implements OnInit {
  form!: FormGroup;
  processes: Process[] = [];
  history: Address[] = [];
  activePid?: number;
  showHistory = false;

  virtual = 0;
  pid!: number;

  newProcessName = ''

  constructor(private memory: MemoryService) {}

  ngOnInit() {
    this.loadProcesses();
  }

  createProcess() {}

  loadProcesses() {
    this.processes = this.memory.getProcesses();
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
  }

  translate() {
    const pidNumber = Number(this.pid);

    const res = this.memory.translateForProcess(pidNumber, this.virtual);
    this.history.unshift(res);
    if (this.history.length > 10) this.history.pop();
  }

  selectProcess() {
    const pidNumber = Number(this.pid);
    this.memory.setProcessActive(pidNumber);
    this.activePid = this.pid;
  }

}
