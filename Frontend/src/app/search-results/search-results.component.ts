import { Component, Input, OnInit } from '@angular/core';
import { Result } from '../result.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  @Input() result : Result = new Result('', '', 0, 0);

  constructor() {  }

  ngOnInit(): void {
  }

}
