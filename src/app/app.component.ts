import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { InputAddress } from './feature/input-address/input-address.component';
import { MemoryView } from './feature/memory-view/memory-view.component';
import { PageTable } from './feature/page-table/page-table.component';

@Component({
  selector: 'app-root',
  imports: [FormsModule, InputAddress, MemoryView, PageTable],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'address-translator';
  addressBits = 8;
  pageSizeBytes = 2;
  framesCount = 10;
  replacementPolicy = 'FIFO'


}
