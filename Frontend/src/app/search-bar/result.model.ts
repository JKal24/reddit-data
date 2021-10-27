import { Post } from "./post.model";

export class Result {
    top_posts: Post[] = [];
    top_subreddits: string[] = [];
    query: string = '';

    constructor(top_posts: Post[], top_subreddits: string[]) {
        this.top_posts = top_posts;
        this.top_subreddits = top_subreddits;
    }
}