import reddit
import utility
from datetime import datetime

all_subreddits = reddit.reddit.subreddit("all")


def parse_query(query, comment_limit, upvote_limit, entries_limit):
    names = {}
    for content in all_subreddits.search(query):
        utility.increment_entry(names, content.subreddit.display_name)
    return parse_subreddit(names, query, comment_limit, upvote_limit, entries_limit)


def parse_subreddit(names, query, comment_limit, upvote_limit, entries_limit):
    names = dict(sorted(names.items(), key=lambda item: item[1], reverse=True))
    top_five = 5
    top_subreddits = []
    top_posts = []
    filter_posts = []

    for key, value in names.items():
        if value == 1 or top_five <= 0:
            break

        average_score = 0
        average_comments = 0
        average_likability = 0.0
        threads_seen = 0

        for subreddit_content in reddit.reddit.subreddit(key).search(query):
            average_score = utility.average(average_score, subreddit_content.score, threads_seen)
            average_comments = utility.average(average_comments, subreddit_content.num_comments, threads_seen)
            average_likability = utility.average(average_likability, subreddit_content.upvote_ratio, threads_seen)
            threads_seen += 1

        average_score = max(average_score, upvote_limit);
        average_comments = max(average_comments, comment_limit);

        for subreddit_content in reddit.reddit.subreddit(key).search(query):
            subreddit_score = subreddit_content.score
            subreddit_comments = subreddit_content.num_comments
            subreddit_likability = subreddit_content.upvote_ratio

            if (
                        subreddit_comments > average_comments and
                        subreddit_score > average_score and
                        subreddit_likability > average_likability
            ):
                filter_posts.append({
                    "id": subreddit_content.id,
                    "upvotes": subreddit_score,
                    "comments": subreddit_comments
                })

        top_subreddits.append(key)
        top_five -= 1

    if len(filter_posts) == 0:
        return {
            'top_subreddits': [],
            'top_posts': []
        }

    filter_posts = sorted(filter_posts, key=lambda item: (item["upvotes"], item["comments"]))
    min_range = min(25, len(filter_posts), entries_limit)
    for top in range(min_range):
        submission = reddit.reddit.submission(filter_posts[top]["id"])
        top_posts.append({
            "author": str(submission.author),
            "name": submission.title,
            "score": submission.score,
            "url": submission.shortlink,
            "text": submission.selftext,
            "attached_url": submission.url,
            "time": datetime.utcfromtimestamp(submission.created_utc).strftime('%Y-%m-%d %H:%M:%S')
        })

    return {
        'top_subreddits': top_subreddits,
        'top_posts': top_posts
    }
