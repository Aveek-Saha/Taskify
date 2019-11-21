import os
from flask import Flask, request, redirect, url_for, jsonify
from werkzeug import secure_filename
from flask_cors import CORS

import numpy as np
from scipy.stats import lognorm

app = Flask(__name__)
CORS(app)


@app.route("/", methods=['POST'])
def index():
	req = request.json
	#print(req)
	data = req['times']
	shape, loc, scale = lognorm.fit(data, floc=0) 
	fitted = lognorm(shape, loc, scale)
    	
	
	res = fitted.ppf(0.05)


	#return req
	return str(res)
		

if __name__ == "__main__":
    app.run(host='localhost', port=5001, debug=True)
