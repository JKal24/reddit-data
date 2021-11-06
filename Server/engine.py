import os
import parse
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__, instance_relative_config=True)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config.from_mapping(SECRET_KEY=os.urandom(24))


@app.route('/search/<string:query>/<int:comment_limit>/<int:upvote_limit>/<int:entries_limit>', methods=["GET"])
@cross_origin()
def gather_data(query, comment_limit, upvote_limit, entries_limit):
    data = parse.parse_query(query, comment_limit, upvote_limit, entries_limit)
    json_query = jsonify(data)
    return json_query


if __name__ == "__main__":
    app.run(debug=True)
