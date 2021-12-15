export class DataService {
    topicList: String[] = [];
    notTopicList: String[] = [];

    entriesSearched = [10, 25, 50, 100];
    entryLimit: Number = 5;
    upvoteLimit: Number = 0;
    commentLimit: Number = 0;

    NSFWflag: boolean = false;
    subreddit: String = '';
    type?: String;

    addTopic(value: String): void {
        this.topicList.push(value);
    }

    removeTopic(topic: String): void {
        const index = this.topicList.indexOf(topic);

        if (index >= 0) {
            this.topicList.splice(index, 1);
        }
    }

    addNotTopic(value: String): void {
        this.notTopicList.push(value.trim());
    }

    removeNotTopic(topic: String): void {
        const index = this.notTopicList.indexOf(topic);

        if (index >= 0) {
            this.notTopicList.splice(index, 1);
        }
    }

    changeSubreddit(value: String): void {
        this.subreddit = value.trim();
    }

    changeUpvoteLimit(limit: Number) {
        this.upvoteLimit = limit;
    }

    changeCommentLimit(limit: Number) {
        this.commentLimit = limit;
    }

    changeEntryLimit(limit: Number) {
        this.entryLimit = limit;
    }

    changeNSFW() {
        this.NSFWflag = !this.NSFWflag;
    }

    changeType(type: any) {
        this.type = Type[type];
    }

}

enum Type {
    'text' = 1,
    'media' = 0,
    'all' = -1
}