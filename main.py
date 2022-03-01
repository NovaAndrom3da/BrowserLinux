# Import modules
import os, json, socket, urllib.request, subprocess, time

# Ensure modules are installed & load them
subprocess.Popen(["pip", "install", "flask"]).communicate()
from flask import Flask, request, Response, abort, redirect

# Start Flask server
time.sleep(10)
app = Flask(__name__)

mimetypes = {
  "js": "text/javascript",
  "css": "text/css",
  "py": "text/python",
  "html": "text/html",
  "ts": "text/javascript",
  "svelte": "text/javascript",
  "scss": "text/javascript"
}

def mimetyper(c, f):
  nl = f.split(".")
  return Response(c, mimetype=mimetypes[nl[len(nl)-1]])

# Add cpython lib (https://github.com/Froggo8311/cpython)
@app.route("/Lib/<lib>")
def cpythonlib(lib):
  try:
    return mimetyper(open("cpython/Lib/"+lib).read(), lib)
  except:
    return abort(404)

""" # Packages
@app.route("/pip/<lib>")
def pipinstall(lib):
  page = urllib.request.urlopen('https://pypi.org/simple')
  return str(str(">"+lib+"<") in str(page.read()))
"""

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

