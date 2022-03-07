# === Server Config ===
install = False
wait = 10


# === Server Program ===
# Import modules
import os, json, socket, urllib.request, subprocess, time

# Ensure modules are installed & load them
if install:
  subprocess.Popen(["pip", "install", "flask"]).communicate()
from flask import Flask, request, Response, abort, redirect

# Start Flask server
time.sleep(wait)
app = Flask(__name__)

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
  dir = os.listdir("packages")
  dir.sort();
  for i in dir:
    file = open("packages/"+i).read()
    name = i.rstrip("json").rstrip(".")
    allpackages[name] = json.loads(file)["desc"]
  return json.dumps(allpackages)

  
# Run the server
app.run('localhost', 5456)

