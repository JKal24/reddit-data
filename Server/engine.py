import os
import parse
from flask import Flask, jsonify, request

app = Flask(__name__, instance_relative_config=True)
app.config.from_mapping(SECRET_KEY=os.urandom(24))


@app.route('/search/')
def gather_data():
    query = request.args.get("query")
    return jsonify()


try:
    print(parse.parse_query("smite NOT leagueoflegends", 0))
except parse.ProcessingException as e:
    print(str(e))


