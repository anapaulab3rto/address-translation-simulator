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
  pid = []
  newProcessName = ''

  constructor(private memory: MemoryService) {}

  ngOnInit() {}

  createProcess() {}

  toggleHistory() {
    this.showHistory = !this.showHistory;
  }

  translate() {
    if (this.form.invalid) return;
    const v = Number(this.form.value.virtual);
    const pid = Number(this.form.value.pid);
    const res = this.memory.translateForProcess(pid, v);
    console.log(res);

    this.history.unshift(res);
    if (this.history.length > 50) this.history.pop();
  }

}