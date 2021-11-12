import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.css']
})
export class AdvancedComponent implements OnInit {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  notTopicList: String[] = [];

  entriesSearched = [10, 25, 50, 100];
  entryLimit : Number = Number.MAX_SAFE_INTEGER;
  upvoteLimit : Number= Number.MAX_SAFE_INTEGER;
  commentLimit : Number= Number.MAX_SAFE_INTEGER;

  NSFWflag : boolean = false;
  subreddit: String = '';
  
  @Output() sendUpvoteLimit : EventEmitter<number> = new EventEmitter<number>();
  @Output() sendCommentLimit : EventEmitter<number> = new EventEmitter<number>();
  @Output() sendNSFW : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() sendEntryLimit : EventEmitter<number> = new EventEmitter<number>();
  @Output() sendNotTopics : EventEmitter<String[]> = new EventEmitter<String[]>();
  @Output() sendSubredditFilters : EventEmitter<String[]> = new EventEmitter<String[]>();

  constructor() { }

  ngOnInit(): void { }

  addNotTopic(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.notTopicList.push(value);
    }
    event.chipInput!.clear();
  }

  removeNotTopic(topic: String): void {
    const index = this.notTopicList.indexOf(topic);

    if (index >= 0) {
      this.notTopicList.splice(index, 1);
    }
  }

  changeSubreddit(event: KeyboardEvent): void {
    this.subreddit = ((event.target as HTMLInputElement).value).trim();
  }

  changeUpvoteLimit(event: KeyboardEvent) {
    this.upvoteLimit = parseInt((event.target as HTMLInputElement).value);
  }

  changeCommentLimit(event: KeyboardEvent) {
    this.commentLimit = parseInt((event.target as HTMLInputElement).value);
  }

  changeEntryLimit(entryLimit: number) {
    this.entryLimit = entryLimit;
  }

  changeNSFW() {
    this.NSFWflag = !this.NSFWflag;
  }
}
