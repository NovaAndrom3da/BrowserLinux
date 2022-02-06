# Import modules
from flask import Flask, request
# import os, json    # Where are these modules used?

app = Flask(__name__)

# Add the html file
@app.route("/")
def index():
  return open("linux/index.html").read()

# Adds the *.js and *.css files
@app.route("/assets/<f>")
def assets(f):
  return open('linux/'+f).read()

# Adds any binary or bytes files
@app.route("/bin/<f>")
def binasset(f):
  return open("bin/"+f, "rb").read()

# Run the server
app.run('0.0.0.0', 80)