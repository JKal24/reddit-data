import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
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
  entriesPerPage: Number[] = [10, 25, 50, 100];

  constructor() { }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.notTopicList.push(value);
    }
    event.chipInput!.clear();
  }

  remove(topic: String): void {
    const index = this.notTopicList.indexOf(topic);

    if (index >= 0) {
      this.notTopicList.splice(index, 1);
    }
  }

}
