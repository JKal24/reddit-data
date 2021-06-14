import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  addOnBlur = true;
  advancedDisplayable = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  topicList: String[] = [];

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

  }

  showAdvancedSearch(): void {
    this.advancedDisplayable = true;
  }

  closeAdvancedSearch(): void {
    this.advancedDisplayable = false;
  }

}
