import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Result } from './result.model';
import { SearchService } from './search.service';
import { AdvancedComponent } from './advanced/advanced.component';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  advancedDisplayable = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  @ViewChild(AdvancedComponent) advancedComponent !: AdvancedComponent;
  topicList: String[] = [];

  @Output() sendResults = new EventEmitter<Result>();

  constructor(private searchService : SearchService) { }

  ngOnInit(): void {
  }

  // Basic add & remove functions for search queries

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.topicList.push(value);
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
    console.log(this.advancedComponent)
    if (this.topicList.length < 1) return
    let query = this.buildQuery();
    query = query + '/' + 
    this.advancedComponent.commentLimit.toString() + '/' + 
    this.advancedComponent.upvoteLimit.toString() + '/' + 
    this.advancedComponent.entryLimit.toString();

    this.searchService.sendSearchRequest(query)
    .subscribe(data => {
      data.query = query;
      this.sendResults.emit(data)
    })
  }

  // Advanced search functionality

  showAdvancedSearch(): void {
    this.advancedDisplayable = true;
  }

  closeAdvancedSearch(): void {
    this.advancedDisplayable = false;
  }

  buildQuery() {
    let queryString = '';

    queryString += this.filterTopics(this.topicList);

    if (this.advancedComponent.notTopicList.length > 0) {
      queryString += 'NOT '
      queryString += this.filterTopics(this.advancedComponent.notTopicList);
    }

    if (!this.advancedComponent.NSFWflag) {
      queryString += 'nsfw:no' 
      queryString += ' ';
    }

    return queryString; 
  }

  filterTopics(topicList: String[]) : String {
    let returnString = '(';
    let i;
    for (i = 0; i < topicList.length - 1; i++) {
      returnString += topicList[i];
      returnString += ' AND ';
    }
    returnString += topicList[i];
    return returnString + ') ';
  }

}
