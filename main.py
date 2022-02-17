# Import modules
from flask import Flask, request, Response
import os, json, socket, urllib.request

app = Flask(__name__)

mimetypes = {
  "js": "text/javascript",
  "css": "text/css",
  "py": "text/python",
  "html": "text/html"
}

# Add the html file
@app.route("/")
def index():
  return Response(open("linux/index.html").read(), mimetype="text/html")

# Adds the *.js and *.css files
@app.route("/assets/<f>")
def assets(f):
  nl = f.split(".")
  try:
    return Response(open('linux/'+f).read(), mimetype=mimetypes[nl[len(nl)-1]])
  except:
    return 404

# Add cpython lib (https://github.com/Froggo8311/cpython)
@app.route("/Lib/<lib>")
def cpythonlib(lib):
  try:
    return open("Lib/"+lib).read()
  except:
    return 404

@app.route("/pip/<lib>")
def pipinstall(lib):
  page = urllib.request.urlopen('https://pypi.org/simple')
  return str(str(">"+lib+"<") in str(page.read()))

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
    return Response(json.dumps({"desc": desc}), mimetype="text/json")
  return Response(json.dumps({"Error": "Package not present"}), mimetype="text/json")

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

