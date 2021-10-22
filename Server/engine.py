import os
import parse
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__, instance_relative_config=True)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config.from_mapping(SECRET_KEY=os.urandom(24))


@app.route('/search/<string:query>', methods=["GET"])
@cross_origin()
def gather_data(query):
    data = parse.parse_query(query, 0)
    json_query = jsonify(data)
    return json_query


if __name__ == "__main__":
    app.run(debug=True)

# try:
#     data = parse.parse_query("smite NOT leagueoflegends", 0)
#     with app.app_context():
#         jsonData = jsonify(data)
#         print(jsonData)
#     print(data)
# except parse.ProcessingException as e:
#     print(str(e))


