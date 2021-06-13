import reddit
from enum import Enum

import utility
from utility import increment_entry, average

all_subreddits = reddit.reddit.subreddit("all")


def parse_query(query, parse_type):
    names = {}
    for content in all_subreddits.search(query):
        increment_entry(names, content.subreddit.display_name)
    return parse_subreddit(names, query, parse_type)


def parse_subreddit(names, query, parse_type):
    names = dict(sorted(names.items(), key=lambda item: item[1], reverse=True))
    top_ten = 10
    top_subreddits = []
    top_posts = []
    filter_posts = []

    for key, value in names.items():
        if value == 1 or top_ten <= 0:
            break

        average_score = 0
        average_comments = 0
        average_likability = 0.0
        threads_seen = 0

        for subreddit_content in reddit.reddit.subreddit(key).search(query):
            average_score = average(average_score, subreddit_content.score, threads_seen)
            average_comments = average(average_comments, subreddit_content.num_comments, threads_seen)
            average_likability = average(average_likability, subreddit_content.upvote_ratio, threads_seen)
            threads_seen += 1

        if parse_type == ParseType.IMAGE:
            for subreddit_content in reddit.reddit.subreddit(key).search(query):
                subreddit_score = subreddit_content.score
                subreddit_comments = subreddit_content.num_comments
                subreddit_likability = subreddit_content.upvote_ratio
                subreddit_text = subreddit_content.selftext

                if (
                        subreddit_comments > average_comments and
                        subreddit_score > average_score and
                        subreddit_likability > average_likability and
                        subreddit_text == ''
                ):
                    if any(subreddit_url.endswith(extension) for extension in utility.image_types):
                        filter_posts.append({
                            "id": subreddit_content.id,
                            "upvotes": subreddit_score,
                            "comments": subreddit_comments
                        })

        elif parse_type == ParseType.MEDIA:
            # check if url == self-text?
            for subreddit_content in reddit.reddit.subreddit(key).search(query):
                subreddit_score = subreddit_content.score
                subreddit_comments = subreddit_content.num_comments
                subreddit_likability = subreddit_content.upvote_ratio
                subreddit_text = subreddit_content.selftext
                subreddit_url = subreddit_content.url

                if (
                        subreddit_comments > average_comments and
                        subreddit_score > average_score and
                        subreddit_likability > average_likability and
                        subreddit_text == '' and
                        subreddit_content.permalink not in subreddit_url and
                        subreddit_url != ''
                ):
                    filter_posts.append({
                        "id": subreddit_content.id,
                        "upvotes": subreddit_score,
                        "comments": subreddit_comments
                    })

        else:
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
        top_ten -= 1

    if len(filter_posts) == 0:
        raise ProcessingException("Found no data for the given query")

    filter_posts = sorted(filter_posts, key=lambda item: (item["upvotes"], item["comments"]))
    for top in range(25):
        submission = reddit.reddit.submission(filter_posts[top]["id"])
        top_posts.append({
            "author": submission.author,
            "name": submission.title,
            "url": submission.shortlink,
            "text": submission.selftext,
            "attached_url": submission.url,
            "time": submission.created_utc
        })

    return {
      'top_subreddits': top_subreddits,
      'top_posts': top_posts
    }


class ProcessingException(Exception):
    pass


class ParseType(Enum):
    IMAGE=1,
    MEDIA=2