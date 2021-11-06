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
  NSFWflag : boolean = false;
  
  @Output() sendUpvoteLimit : EventEmitter<number> = new EventEmitter<number>();
  @Output() sendCommentLimit : EventEmitter<number> = new EventEmitter<number>();
  @Output() sendNSFW : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() sendEntryLimit : EventEmitter<number> = new EventEmitter<number>();
  @Output() sendNotTopics : EventEmitter<String[]> = new EventEmitter<String[]>();

  constructor() { }

  ngOnInit(): void { }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.notTopicList.push(value);
    }
    event.chipInput!.clear();
    this.changeNotTopics();
  }

  remove(topic: String): void {
    const index = this.notTopicList.indexOf(topic);

    if (index >= 0) {
      this.notTopicList.splice(index, 1);
    }
    this.changeNotTopics();
  }

  changeUpvoteLimit(event: KeyboardEvent) {
    this.sendUpvoteLimit.emit(parseInt((event.target as HTMLInputElement).value));
  }

  changeCommentLimit(event: KeyboardEvent) {
    this.sendCommentLimit.emit(parseInt((event.target as HTMLInputElement).value));
  }

  changeNSFW() {
    this.NSFWflag = !this.NSFWflag;
    this.sendNSFW.emit(this.NSFWflag);
  }

  changeEntryLimit(entryLimit: number) {
    this.sendEntryLimit.emit(entryLimit);
  }

  changeNotTopics() {
    this.sendNotTopics.emit(this.notTopicList);
  }
}
