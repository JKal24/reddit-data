import praw
import json

with open('./resources/credentials.json') as f:
    params = json.load(f)

reddit = praw.Reddit(
    username=params['username'],
    password=params['password'],
    client_id=params['client_id'],
    client_secret=params['client_secret'],
    user_agent=params['user_agent']
)
