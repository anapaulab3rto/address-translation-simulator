import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PageFrame } from '../../models/page-frame.interface';

@Component({
  selector: 'app-memory-view',
  imports: [CommonModule],
  templateUrl: './memory-view.component.html',
  styleUrl: './memory-view.component.scss'
})
export class MemoryView {
  @Input() pageFrames: PageFrame[] = [];

  constructor() {}
}
