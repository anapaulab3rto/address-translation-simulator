import { Component } from '@angular/core';
import { InputAddress } from './feature/input-address/input-address.component';

@Component({
  selector: 'app-root',
  imports: [InputAddress],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'address-translator';


}
