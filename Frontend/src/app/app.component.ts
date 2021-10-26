import { Component } from '@angular/core';
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

  constructor() {
  }
  
  storeResults(result: Result) : void {
    console.log(result);
    this.posts = result.top_posts;
    this.subreddits = result.top_subreddits;
  }

}
