import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DataService } from "./data.service";
import { Result } from './result.model';

@Injectable({ providedIn: 'root' })
export class SearchService {

    result?: Result;

    constructor(private http: HttpClient,
        private dataService: DataService) { }

    sendSearchRequest(query: string): Observable<Result> {
        return this.http.get<Result>('http://127.0.0.1:5000/search/' + query);
    }

    /**
 * Sends a request to the backend
 * 
 * returns the post & subreddit data
 * also includes the query string to be used as a title
 */

    search(): void {
        if (this.dataService.topicList.length < 1) return;
        let query = this.buildQuery();

        query = query + '/' +
            this.dataService.subreddit + '/' +
            this.dataService.commentLimit.toString() + '/' +
            this.dataService.upvoteLimit.toString() + '/' +
            this.dataService.entryLimit.toString();

        // Uses service to send HTTP request
        this.sendSearchRequest(query)
            .subscribe(data => {
                data.query = query;
                this.result = data;
            })
    }

    buildQuery() {
        let queryString = '';

        queryString += this.filterTopics(this.dataService.topicList);

        // Advanced component has not been opened
        if (!this.dataService) return queryString;

        if (this.dataService.notTopicList.length > 0) {
            queryString += 'NOT '
            queryString += this.filterTopics(this.dataService.notTopicList);
        }

        if (!this.dataService.NSFWflag) {
            queryString += 'nsfw:no'
            queryString += ' ';
        }

        return queryString;
    }

    filterTopics(topicList: String[]): String {
        let returnString = '(';
        let i;
        for (i = 0; i < topicList.length - 1; i++) {
            returnString += topicList[i];
            returnString += ' AND ';
        }
        returnString += topicList[i];
        return returnString + ') ';
    }
}