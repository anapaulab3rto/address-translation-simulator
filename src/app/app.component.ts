import { Component } from '@angular/core';
import { InputAddress } from './feature/input-address/input-address.component';
import { MemoryView } from './feature/memory-view/memory-view.component';

@Component({
  selector: 'app-root',
  imports: [InputAddress, MemoryView],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'address-translator';


}
