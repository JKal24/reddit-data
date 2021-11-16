import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatRadioChange } from '@angular/material/radio';
import { DataService } from '../data.service';

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.css']
})
export class AdvancedComponent {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  entriesSearched = this.dataService.entriesSearched;
  notTopicList = this.dataService.notTopicList;

  constructor(private dataService : DataService) { }

  addNotTopic(event: MatChipInputEvent): void {
    const value = event.value;

    if (value) {
      this.dataService.addNotTopic(value.trim());
    }
    event.chipInput!.clear();
  }

  removeNotTopic(topic: String): void {
    this.dataService.removeNotTopic(topic);
  }

  changeSubreddit(event: KeyboardEvent): void {
    this.dataService.changeSubreddit(((event.target as HTMLInputElement).value).trim());
  }

  changeUpvoteLimit(event: KeyboardEvent) {
    this.dataService.changeUpvoteLimit(parseInt((event.target as HTMLInputElement).value));
  }

  changeCommentLimit(event: KeyboardEvent) {
    this.dataService.changeCommentLimit(parseInt((event.target as HTMLInputElement).value));
  }

  changeEntryLimit(entryLimit: number) {
    this.dataService.changeEntryLimit(entryLimit);
  }

  changeNSFW() {
    this.dataService.changeNSFW();
  }

  changeType(type : MatRadioChange) {
    this.dataService.changeType(type.value);
  }
}
