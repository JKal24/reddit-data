import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Post } from './search-bar/post.model';
import { Result } from './search-bar/result.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  posts: Post[] = [];
  subreddits: string[] = [];
  title: string = '';

  constructor() {
  }
  
  storeResults(result: Result) : void {
    this.posts = (result.top_posts);
    this.subreddits = (result.top_subreddits);
    this.title = "Search Results for '" +  result.query + "'";
  }

}
