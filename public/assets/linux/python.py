# === Initialize ===
try:
  from browser import window, document
  import sys
except:
  window.cmd_reload()

#print = window.print
color = window.color
bold = window.bold
tab = window.tab
console = window.console
scroll = window.scroll
clear = window.cmd_clear

#def print():
  


# === Python Execution Environment ===
class open():
  def __init__(self, filename="", mode="r"):
    self.filename = filename
    self.mode = mode

  def read(self):
    if self.mode == "r" or self.mode == "rw":
      return "Read object"

    else:
       return color("FileReadWriteError: Can not read file on operation '"+bold(self.mode)+"'", "red")

  #def

def help_command(args=help):
  help(args)

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
  "reload": window.cmd_reload,
  "clear": clear,
  "open": open,
  "help": help_command
}

module_env_template = {
  "__name__": "__main__",
  "__package__": None,
  "__builtins__": __builtins__,
  "__annotations__": None,
  "__doc__": None,
  "__loader__": None,
  "__spec__": None,
  "print": print,
  "help": help_command,
  "open": open
}

# === Add Standard IO ===
class stdout():
  def __init__(self):
    pass

  def write(self, a):
    print(a+"<br>")

  def close(self):
    pass

class stderr():
  def __init__(self):
    pass

  def write(self, a):
    print(color(a+"<br>", "red"))

  def close(self):
    pass

sys.stdout = stdout()
sys.stderr = stderr()
sys.exit = window.python_interpreter_quit


# === Python Interpreter ===
def pyeval(args, vars={}):
  try:
    return exec(args, vars)
  except Exception as e:
    if "import" in args:
      if " " in str(e):
        return color("Traceback (most recent call back):\n"+tab()+str(e), "red")
      return color("Could not import the '"+bold(str(e))+"' module.", "red")
    else:
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
    if not window.currline.endswith(":"):
      print(pyeval(window.currline, python_env_template))
      window.cmdprompt.innerHTML += "<br>" + color(">>", "blue")
      pyhistory = window.currline
      window.currline = ""
    else:
      window.cmdprompt.innerHTML += "<br>" + color("...", "blue") + tab()
      window.currline += "\n"
    scroll()
  elif e.key == "ArrowUp":
    pyback = currline
    window.currline = pyhistory
  elif e.key == "ArrowDown":
    pyhistory = window.currline
    window.currline = pyback
  elif e.key == "Tab":
    e.preventDefault()
    window.cmdprompt.focus()

  cmdlist = window.cmdprompt.innerHTML.split("<br>");
  if cmdlist[0] == "":
    cmdlist.pop(0)

  currlineTemp = color(">>", "blue") + " " + window.currline

  cmdlist[-1] = currlineTemp;
  #cmdlist.append(currlineTemp)

  window.cmdprompt.innerHTML = '<br>'.join(map(str, cmdlist))

def cmd_python(args):
  if "-" in args:
    if "-c" in args.split(" "):
      o = pyeval(args.split("-c ")[1], python_env_template)
      if o == None:
        return
      return color(o, "yellow")
    if "-m" in args.split(" "):
      python_run_module_args = args.lstrip("-m ").split(" ")
      python_run_module = python_run_module_args.pop(0)
      sys.argv = python_run_module_args
      try:
        return pyeval("import "+python_run_module, module_env_template.copy())
      except Exception as e:
        return print(color("ImportError: "+String(e), "red"))
    if "-V" in args.split(" "):
      return "Python "+version_main+"."+version_minor+" (Brython "+version_main+"."+version_minor+"."+version_micro+")"
  else:
    if args == "":
      window.currline = ""
      window.userHasAccess = False
      print("Python "+version_main+"."+version_minor+" (Brython "+version_main+"."+version_minor+"."+version_micro+") on BrowserLinux "+window.env["BLVERSION"]+". Type `"+bold("help()")+"` for help and `"+bold("quit()")+"` to quit.\n")
      window.cmdkeybind = cmd_python_text
      window.triggerPrompt()
      #return None
    else:
      sys.argv = args.split(" ")
      return "Running python files (coming soon with introduction of a filesystem)"

version = window.__BRYTHON__.implementation
version_main = str(version[0])
version_minor = str(version[1])
version_micro = str(version[2])
version_blpm = "0.1"
python_version = version_main+"."+version_minor+"."+version_micro+"-bl"+version_blpm

window.usr_bin["python"]["exec"] = cmd_python
window.usr_bin["python"]["ver"] = python_version
python_command_constructor = {
  "exec": cmd_python,
  "type": "js",
  "desc": "Python interpreter",
  "ver": python_version
}
window.silent_usr_bin["py"] = python_command_constructor
window.silent_usr_bin["python3"] = python_command_constructor
window.silent_usr_bin["python3.10"] = python_command_constructor


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

window.__PYTHONREADY__ = True



# === Add Python-Based Internal Commands ===


window.__PYTHONCMDS__ = True