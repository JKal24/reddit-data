import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-subreddit',
  templateUrl: './subreddit.component.html',
  styleUrls: ['./subreddit.component.css']
})
export class SubredditComponent implements OnInit {
  @Input() subreddit: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
