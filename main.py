from flask import Flask, request
import os, json

app = Flask(__name__)

@app.route("/")
def index():
  return open("linux/index.html").read()

@app.route("/assets/<f>")
def assets(f):
  return open('linux/'+f).read()

@app.route("/bin/<f>")
def binasset(f):
  return open("bin/"+f, "rb").read()

app.run('0.0.0.0', 80)