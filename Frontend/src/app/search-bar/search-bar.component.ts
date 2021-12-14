import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Result } from './result.model';
import { SearchService } from './search.service';
import { AdvancedComponent } from './advanced/advanced.component';
import { DataService } from './data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  advancedDisplayable = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  @ViewChild(AdvancedComponent) advancedComponent !: AdvancedComponent;
  topicList: String[] = this.dataService.topicList;

  @Output() sendResults = new EventEmitter<Result>();

  constructor(private searchService: SearchService,
    private dataService: DataService) { }

  ngOnInit(): void {
  }

  // Basic add & remove functions for search queries

  add(event: MatChipInputEvent): void {
    const value = event.value;

    if (value) {
      this.dataService.addTopic(value.trim());
    } else {
      this.search();
    }
    event.chipInput!.clear();
  }

  remove(topic: String): void {
    const index = this.topicList.indexOf(topic);

    if (index >= 0) {
      this.topicList.splice(index, 1);
    }
  }

  /**
   * Sends a request to the backend
   * 
   * returns the post & subreddit data
   * also includes the query string to be used as a title
   */

  search(): void {
    const resultObservable = this.searchService.search().subscribe(data => {
      data.query = this.searchService.query || "";
      this.sendResults.emit(data)
    });
    
  }

  // Advanced search functionality

  showAdvancedSearch(): void {
    this.advancedDisplayable = true;
  }

  closeAdvancedSearch(): void {
    this.advancedDisplayable = false;
  }

}
