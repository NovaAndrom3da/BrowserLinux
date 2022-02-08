# Import modules
from flask import Flask, request
import os, json

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

# Send information of a package, returns an error if package is nonexistant
@app.route("/blpm/<package>")
def packageExists(package):
  if ((package + ".json") in os.listdir("packages")):
    file = open("packages/"+package+".json").read();
    desc = json.loads(file)["desc"]
    return json.dumps({"desc": desc})
  return json.dumps({"Error": "Package not present"})

# Send full package
@app.route("/blpm/<package>/install")
def installPackage(package):
  if 'Error' in json.loads(packageExists(package)):
    return packageExists(package)
  return open("packages/"+package+".json").read()

@app.route("/blpm-listall")
def listallRemote():
  allpackages = {}
  for i in os.listdir("packages"):
    file = open("packages/"+i).read()
    name = i.rstrip("json").rstrip(".")
    allpackages[name] = json.loads(file)["desc"]
  return json.dumps(allpackages)

# Run the server
app.run('0.0.0.0', 80)