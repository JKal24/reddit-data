import os

import search
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__, instance_relative_config=True)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config.from_mapping(SECRET_KEY=os.urandom(24))


@app.route('/search/<string:query>/<string:subreddit>/<int:comment_limit>/<int:upvote_limit>/<int:entries_limit>', methods=["GET"])
@cross_origin()
def gather_full_data(query, subreddit, comment_limit, upvote_limit, entries_limit):
    data = search.parse_subreddit(query, comment_limit, upvote_limit, entries_limit, subreddit)
    json_query = jsonify(data)
    return json_query


@app.route('/search/<string:query>/<int:comment_limit>/<int:upvote_limit>/<int:entries_limit>', methods=["GET"])
@cross_origin()
def gather_partial_data(query, comment_limit, upvote_limit, entries_limit):
    data = search.parse_subreddits(query, comment_limit, upvote_limit, entries_limit)
    json_query = jsonify(data)
    return json_query


@app.route('/search/<string:query>', methods=["GET"])
@cross_origin()
def gather_data(query):
    data = search.parse_subreddits(query, 0, 0, 0)
    json_query = jsonify(data)
    return json_query


if __name__ == "__main__":
    app.run(debug=True)
