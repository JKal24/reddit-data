import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class Result {
    constructor(public title: String, public content: String, public numComments: number, public numUpvotes: number) {}
}