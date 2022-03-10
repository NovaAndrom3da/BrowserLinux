import os, json, subprocess
from flask import Flask, request, Response, abort, redirect
app = Flask(__name__)

@app.route("/blpm/<pkg>")
def pkgExists(pkg):
  if ((pkg+".json") in os.listdir("packages")):
    file=open("packages/"+pkg+".json").read();
    desc=json.loads(file)["desc"]
    return json.dumps({"desc":desc})
  return json.dumps({"Error":"Package not present"})

@app.route("/blpm/<pkg>/install")
def installPackage(pkg):
  if 'Error' in json.loads(pkgExists(pkg)):
    return pkgExists(pkg)
  return open("packages/"+pkg+".json").read()

@app.route("/blpm-listall")
def listallRemote():
  allpackages={}
  dir=os.listdir("packages")
  dir.sort();
  for i in dir:
    file=open("packages/"+i).read()
    name=i.rstrip("json").rstrip(".")
    allpackages[name] = json.loads(file)["desc"]
  return json.dumps(allpackages)

app.run('localhost', 5456)