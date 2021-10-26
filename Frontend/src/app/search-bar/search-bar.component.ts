import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Result } from './result.model';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  advancedDisplayable = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  topicList: String[] = [];
  advancedAttributes = {commentLimit : Infinity, upvoteLimit : Infinity, allowNSFW : false, entriesLimit : 25};
  @Output() sendResults = new EventEmitter<Result>();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

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

  search(): void {
    // Send request to backend - will configure when design is done
    const query = this.buildQuery(this.topicList);
    this.http.get<Result>('http://127.0.0.1:5000/search/' + query)
    .subscribe(data => {
      console.log(data);
      this.sendResults.emit(data)
    })
  }

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

  buildQuery(topicList: String[]) {
    let queryString = '';

    let i;
    for (i = 0; i < topicList.length - 1; i++) {
      queryString += topicList[i];
      queryString += ' AND ';
    }
    return queryString + topicList[i];
  }

}
