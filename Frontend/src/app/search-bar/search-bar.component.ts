import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Result } from './result.model';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  advancedDisplayable = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  topicList: String[] = [];
  notTopics : String[] = [];
  advancedAttributes = {commentLimit : Infinity, upvoteLimit : Infinity, allowNSFW : false, entriesLimit : 25};
  @Output() sendResults = new EventEmitter<Result>();

  constructor(private http: HttpClient) { }

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
    if (this.topicList.length < 1) return
    const query = this.buildQuery();
    this.http.get<Result>('http://127.0.0.1:5000/search/' + query + '/' + 
    this.advancedAttributes.commentLimit.toString() + '/' + 
    this.advancedAttributes.upvoteLimit.toString() + '/' + 
    this.advancedAttributes.entriesLimit.toString())
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

  storeUpvoteLimit(upvoteLimit : number) : void {
    this.advancedAttributes.upvoteLimit = upvoteLimit;
  }

  storeCommentLimit(commentLimit : number) : void {
    this.advancedAttributes.commentLimit = commentLimit;
  }

  storeNSFWFlag(NSFWflag : boolean) : void {
    this.advancedAttributes.allowNSFW = NSFWflag;
  }

  storeEntryLimit(entriesLimit : number) : void {
    this.advancedAttributes.entriesLimit = entriesLimit;
  }

  storeNotTopics(notTopics : String[]) : void {
    this.notTopics = notTopics;
  }

  buildQuery() {
    let queryString = '';

    queryString += this.filterTopics(this.topicList);

    if (this.notTopics.length > 0) {
      queryString += 'NOT '
      queryString += this.filterTopics(this.notTopics);
    }

    if (!this.advancedAttributes.allowNSFW) {
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
