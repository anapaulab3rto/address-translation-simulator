import { CommonModule } from '@angular/common';
import { Component, computed, effect } from '@angular/core';
import { PageTableEntry } from '../../models/page-table-entry.interface';
import { MemoryService } from '../../service/memory.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { Process } from '../../models/process.interface';
import { Address } from '../../models/address.interface';

@Component({
  selector: 'app-page-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './page-table.component.html',
  styleUrl: './page-table.component.scss'
})
export class PageTable {
  entries: PageTableEntry[] = [];
  active = computed(() => this.memory.activeProcess());
  form!: FormGroup;
  processes: Process[] = [];
  history: Address[] = [];
  activePid?: number;
  showHistory = false;


  virtual = 0;
  pid!: number;

  newProcessName = '';
  newProcessID = 0;


  constructor(private memory: MemoryService) {
    effect(() => {
      const current = this.active();
      this.entries = this.memory.getActivePageTable() ?? [];
  });
  }

  ngOnInit() {
    this.loadProcesses();
  }

  createProcess() {
    this.memory.createProcess(this.newProcessID, this.newProcessName);
    this.newProcessID = 0;
    this.newProcessName = '';
  }

  loadProcesses() {
    this.processes = this.memory.getProcesses();
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
  }

  translate() {
    const pidNumber = Number(this.pid);
    if (this.isValidVirtualAddress(this.virtual, this.memory.getAddressSpace())) {
      const p = this.memory.translate(pidNumber, this.virtual);
      this.entries = p?.pageTable ?? [];
    }else {
      alert(
      `Endereço virtual ${this.virtual} inválido!\n` +
      `O espaço de endereçamento do processo suporta até ${this.memory.getAddressSpace()} (precisa de ${this.memory.bitsNecessarios(this.memory.getAddressSpace())} bits).\n` +
      `O endereço fornecido excede o tamanho do espaço virtual e não pode ser traduzido para memória física.`
    );
    }
  }

  isValidVirtualAddress(virtualAddress: number, addressSpaceBytes: number): boolean {
    const bitsNecessarios = Math.ceil(Math.log2(addressSpaceBytes));
    const maxAddress = (1 << bitsNecessarios) - 1;
    return virtualAddress <= maxAddress;
  }

  selectProcess() {
    const pidNumber = Number(this.pid);
    this.memory.setProcessActive(pidNumber);
    this.activePid = this.pid;
  }
}
