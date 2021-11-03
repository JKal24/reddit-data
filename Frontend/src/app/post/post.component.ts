import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../search-bar/post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post: Post = new Post();
  expand: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
