import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Result } from '../result.model';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  addOnBlur = true;
  advancedDisplayable = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  topicList: String[] = [];
  @Output() sendResults = new EventEmitter<Result[]>();

  constructor() { }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.topicList.push(value);
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
    const results : Result[] = [];
    let i = this.topicList.length;
    for (let j = 0; j < i; j++) {
      results.push(new Result(this.topicList[j], this.topicList[j], j, i));
    }

    this.sendResults.emit(results);
  }

  showAdvancedSearch(): void {
    this.advancedDisplayable = true;
  }

  closeAdvancedSearch(): void {
    this.advancedDisplayable = false;
  }

}
