import reddit
import utility
from datetime import datetime


def parse_subreddits(query, comment_limit, upvote_limit, entries_limit):
    names = {}
    subreddit_filter = reddit.reddit.subreddit("all")

    for content in subreddit_filter.search(query):
        utility.increment_entry(names, content.subreddit.display_name)

    names = dict(sorted(names.items(), key=lambda item: item[1], reverse=True))
    top_five = 5
    top_subreddits = []
    posts = []

    for key, value in names.items():
        if value == 1 or top_five <= 0:
            break

        build_posts(query, key, posts, upvote_limit, comment_limit)

        top_subreddits.append(key)
        top_five -= 1

    if len(posts) == 0:
        return {
            'top_subreddits': [],
            'top_posts': []
        }

    top_posts = filter_posts(posts, entries_limit);

    return {
        'top_subreddits': top_subreddits,
        'top_posts': top_posts
    }


def parse_subreddit(query, comment_limit, upvote_limit, entries_limit, subreddit):
    posts = []
    build_posts(query, subreddit, posts, upvote_limit, comment_limit)

    top_subreddits = [subreddit]
    top_posts = filter_posts(posts, entries_limit);
    return {
        'top_subreddits': top_subreddits,
        'top_posts': top_posts
    }


def build_posts(query, name, posts, upvote_limit, comment_limit):
    average_score = 0
    average_comments = 0
    average_likability = 0.0
    threads_seen = 0

    for subreddit_content in reddit.reddit.subreddit(name).search(query):
        average_score = utility.average(average_score, subreddit_content.score, threads_seen)
        average_comments = utility.average(average_comments, subreddit_content.num_comments, threads_seen)
        average_likability = utility.average(average_likability, subreddit_content.upvote_ratio, threads_seen)
        threads_seen += 1

    average_score = max(average_score / 3, upvote_limit)
    average_comments = max(average_comments / 3, comment_limit)
    average_likability = average_likability / 3

    for subreddit_content in reddit.reddit.subreddit(name).search(query):
        subreddit_score = subreddit_content.score
        subreddit_comments = subreddit_content.num_comments
        subreddit_likability = subreddit_content.upvote_ratio

        if (
                subreddit_comments > average_comments and
                subreddit_score > average_score and
                subreddit_likability > average_likability
        ):
            posts.append({
                "id": subreddit_content.id,
                "upvotes": subreddit_score,
                "comments": subreddit_comments
            })
    return posts


def filter_posts(posts, entries_limit):
    top_posts = []

    posts = sorted(posts, key=lambda item: (item["upvotes"], item["comments"]), reverse=True)
    min_range = min(25, len(posts), entries_limit)
    for top in range(min_range):
        submission = reddit.reddit.submission(posts[top]["id"])
        top_posts.append({
            "author": str(submission.author),
            "name": submission.title,
            "score": submission.score,
            "url": submission.shortlink,
            "text": submission.selftext,
            "attached_url": submission.url,
            "time": datetime.utcfromtimestamp(submission.created_utc).strftime('%Y-%m-%d %H:%M:%S')
        })
    return top_posts
