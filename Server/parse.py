import reddit
from enum import Enum
import utility
from datetime import datetime

all_subreddits = reddit.reddit.subreddit("all")


def parse_query(query, parse_type):
    names = {}
    for content in all_subreddits.search(query):
        utility.increment_entry(names, content.subreddit.display_name)
    return parse_subreddit(names, query, parse_type)


def parse_subreddit(names, query, parse_type):
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

        for subreddit_content in reddit.reddit.subreddit(key).search(query):
            subreddit_score = subreddit_content.score
            subreddit_comments = subreddit_content.num_comments
            subreddit_likability = subreddit_content.upvote_ratio
            subreddit_url = subreddit_content.url
            subreddit_self = subreddit_content.is_self

            if parse_type == ParseType.IMAGE.value:
                if (
                        subreddit_comments > average_comments and
                        subreddit_score > average_score and
                        subreddit_likability > average_likability and
                        not subreddit_self
                ):
                    if any(subreddit_url.endswith(extension) for extension in utility.image_types):
                        filter_posts.append({
                            "id": subreddit_content.id,
                            "upvotes": subreddit_score,
                            "comments": subreddit_comments
                        })

            elif parse_type == ParseType.MEDIA.value:
                if (
                        subreddit_comments > average_comments and
                        subreddit_score > average_score and
                        subreddit_likability > average_likability and
                        subreddit_content.permalink not in subreddit_url and
                        subreddit_url != '' and
                        not subreddit_self
                ):
                    filter_posts.append({
                        "id": subreddit_content.id,
                        "upvotes": subreddit_score,
                        "comments": subreddit_comments
                    })

            elif parse_type == ParseType.TEXT.value:
                if (
                        subreddit_self and
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
    min_range = min(25, len(filter_posts))
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


class ParseType(Enum):
    TEXT = 1
    IMAGE = 2
    MEDIA = 3
