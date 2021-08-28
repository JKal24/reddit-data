import { Component } from '@angular/core';
import { Result } from './result.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  results: Result[] = [];

  constructor() {
  }
  
  storeResults(result: Result[]) : void {
    this.results = result;
  }

}
