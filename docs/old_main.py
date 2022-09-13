# Import modules
from flask import Flask, request, Response, abort
import os, json, socket, urllib.request

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

# Add the html file
@app.route("/")
def index():
  return mimetyper(open("linux/index.html").read(), ".html")
  
# Adds the *.js and *.css files
@app.route("/assets/<f>")
def assets(f):
  try:
    return mimetyper(open('linux/'+f).read(), f)
  except:
    return abort(404)

# Add cpython lib (https://github.com/Froggo8311/cpython)
@app.route("/Lib/<lib>")
def cpythonlib(lib):
  try:
    return mimetyper(open("cpython/Lib/"+lib).read(), lib)
  except:
    return abort(404)

""" # Now is not your time. Your day of greatness will arrive soon.
@app.route("/pip/<lib>")
def pipinstall(lib):
  page = urllib.request.urlopen('https://pypi.org/simple')
  return str(str(">"+lib+"<") in str(page.read()))
"""

# Adds any binary or bytes files
@app.route("/bin/<f>")
def binasset(f):
  return open("bin/"+f, "rb").read()

@app.route("/backgrounds/<f>")
def backgrounds(f):
  return open("bin/backgrounds/"+f, "rb").read()

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

@app.route("/components/<folder>/<file>")
def components_folder_file(folder, file):
  return mimetyper(open("linux/src/components/"+folder+"/"+file).read(), file)

@app.route("/components/<folder1>/<folder2>/<file>")
def components_folder_folder_file(folder1, folder2, file):
  return mimetyper(open("linux/src/components/"+folder1+"/"+folder2+"/"+file).read(), file)

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

#@app.route("/gethostbyname/<domain>")
#def gethostbyname(domain):
 # return json.dumps(socket.gethostbyname_ex(domain))

#@app.route("/gethostname/<address>")
#def gethostname(address):
 # return json.dumps(socket.gethostbyaddr(address))


#@app.route("/pip/<f>")
#def pip(f):
 # return open("pip/"+f).read()
  
# Run the server
app.run('0.0.0.0', 80)

