import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Result } from './result.model';

@Injectable({providedIn: 'root'})
export class SearchService {

    constructor(private http: HttpClient) { }

    sendSearchRequest(query: string) : Observable<Result> {
        return this.http.get<Result>('http://127.0.0.1:5000/search/' + query);
    }

}