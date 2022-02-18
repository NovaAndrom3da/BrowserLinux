from browser import window, document
#import sys

print = window.print
color = window.color
bold = window.bold
tab = window.tab
console = window.console
scroll = window.scroll

python_env_template = {
  "window": window,
  "document": document,
  "__name__": "__main__",
  "__package__": None,
  "__builtins__": __builtins__,
  "__annotations__": None,
  "__doc__": None,
  "__loader__": None,
  "__spec__": None,
  "print": print,
  "color": color,
  "bold": bold,
  "tab": tab,
  "quit": window.python_interpreter_quit,
  "reload": window.cmd_reload
}

def printerror(e):
  print(color(e, "red"))
  return 1

#sys.stderr = printerror

def pyeval(args, vars={}):
  try:
    return exec(args, vars)
  except Exception as e:
    console.error(str(e))
    return color(str(e), "red")

window.pyeval = pyeval

def cmd_python_text(e):
  if not (e.key=="Control" or e.key=="Shift" or e.key=="Escape" or e.key=="Tab" or e.key=="Backspace" or e.key=="Enter" or e.key.startswith("Arrow") or e.key=="Meta" or e.key=="Alt"):
    if not e.ctrlKey:
      window.currline += e.key
      window.scroll()
    elif e.key == "v" and e.shiftKey:
      print("pastent")
  elif e.key == "Backspace":
    window.scroll()
    if e.ctrlKey:
      window.currline = window.currline.rstrip(window.currline[-5:])
    else:
      window.currline = window.currline.rstrip(window.currline[-1])
  elif e.key == "Enter":
    print(pyeval(window.currline, python_env_template))
    window.cmdprompt.innerHTML += "<br>"
    pyhistory = currline
    currline = ""
    window.cmdprompt.innerHTML += "<br>" + color(">>", "blue")
    scroll()
  elif e.key == "ArrowUp":
    pyback = currline
    currline = pyhistory
  elif e.key == "ArrowDown":
    pyhistory = currline
    currline = pyback
  elif e.key == "Tab":
    e.preventDefault()
    window.cmdprompt.focus()

  cmdlist = window.cmdprompt.innerHTML.split("<br>");
  if cmdlist[0] == "":
    cmdlist.pop(0)

  currlineTemp = color(">>", "blue") + " " + window.currline

  cmdlist[len(window.cmdlist)-1] = currlineTemp;

  window.cmdprompt.innerHTML = '<br>'.join(map(str, cmdlist))

def cmd_python(args):
  if "-" in args:
    if "-c" in args.split(" "):
      o = pyeval(args.lstrip("-c "), python_env_template)
      if o == None:
        return
      return color(o, "yellow")
    if "-m" in args.split(" "):
      return "Run a runnable python module (coming soon)"
    if "-V" in args.split(" "):
      return "Python "+version_main+"."+version_minor+" (Brython "+version_main+"."+version_minor+"."+version_micro+")"
  else:
    if args == "":
      window.triggerPrompt()
      window.userHasAccess = False
      print("Python "+version_main+"."+version_minor+" (Brython "+version_main+"."+version_minor+"."+version_micro+") on BrowserLinux "+window.__BLVERSION__+". Type `"+bold("help()")+"` for help and `"+bold("quit()")+"` to quit.")
      window.cmd_eval('setTimeout({print(color(">>", "blue")); triggerPrompt();}, 150);')
      window.cmdkeybind = cmd_python_text
      window.triggerPrompt()
      return
    else:
      return "Running python files (coming soon with introduction of a filesystem)"

version = window.__BRYTHON__.implementation
version_main = str(version[0])
version_minor = str(version[1])
version_micro = str(version[2])
version_blpm = "0.1"

window.addCommandFromJS(cmd_python, "python", "Python interpreter", version_main+"."+version_minor+"."+version_micro+"-bl"+version_blpm)

class open():
  def __init__(self, file, mode="r"):
    self.file = file
    self.mode = mode

  def read():
    if self.mode == "r":
      return
    elif self.mode == "rb":
      return
    else:
      raise(FileExistsError)

  def write(c):
    if self.mdoe == "w":
      return
    if self.mode == "wb":
      return
    if self.mode == "a":
      return
    else:
      raise(FileExistsError)

def cmd_pip(args):
  return ""


console.log("Python loaded.")

