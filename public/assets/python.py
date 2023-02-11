# === Initialize ===
try:
  from browser import window, document
  import sys, io
except:
  print("Could not load proper python modules, reloading.")
  window.cmd_reload()

print = window.print
color = window.color
bold = window.bold
tab = window.tab
console = window.console
scroll = window.scroll
clear = window.cmd_clear

#def print():
  


# === Python Execution Environment ===
class FakeFileIO(io.TextIOBase):
  def __init__(self, fn, read=False, write=False):
    self.newlines = None
    self.buffer = None

    self.read = read
    self.write = write
    self.append = False

    self.readline_inc = 0

    try:
      self.file = window.get_filesystem_object(fn)
      self.data = self.file.file
    except:
      raise FileNotFoundError

  def detatch(self):
    raise io.UnsupportedOperation
  
  def read(self, size=-1):
    if size >= 0 and self.read:
      return self.data[size]
    elif self.read:
      return self.data
    else:
      raise io.UnsupportedOperation
  
  def readline(size=-1):
    if size >=0 and self.read:
      self.readline_inc += 1
      return self.data.split('\n')[self.readline_inc - 1][:size]
    elif self.read:
      self.readline_inc += 1
      return self.data.split('\n')[self.readline_inc - 1][:size]
    else:
      raise io.UnsupportedOperation
  
  def seek(offset, whence=0):
    return 0
  
  def tell():
    return 0

  def write(s):
    if self.write and self.append:
      s = str(s)
      self.file.file += s
      self.data += s
    elif self.write:
      s = str(s)
      self.file.file = s
      self.data = s
    else:
      raise io.UnsupportedOperation
  
  def close():
    return
    
def open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None):
  mode = list(mode)
  r = False
  w = False
  a = False

  if 'r' in mode or '+' in mode:
    r = True
  if 'w' in mode or '+' in mode:
    w = True
  if 'x' in mode:
    w = True
    # TODO: Create a file
    # window.FILESYSTEM_FILE()
  if 'a' in mode:
    a = True
    w = True
  
  f = FakeFileIO(file, r, w)
  f.append = a
  
  return f

# class open():
#   def __init__(self, filename="", mode="r"):
#     self.filename = filename
#     self.mode = mode

#   async def read(self):
#     if self.mode == "r" or self.mode == "rw":
#       return await window.FSRead(self.filename)

#     else:
#        return color("FileReadWriteError: Can not read file on operation '"+bold(self.mode)+"'", "red")

#   async def write(self, value):
#     if self.mode == "w" or self.mode == "rw":
#       await window.FSWrite(self.filename, value)
      
#     else:
#        return color("FileReadWriteError: Can not read file on operation '"+bold(self.mode)+"'", "red")

  #def

def help_command(args=help):
  help(args)

def DIR(env):
  def _dir(o=env):
    return o.keys()
  return _dir

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

def new_python_env():
  env = python_env_template.copy()
  env['dir'] = DIR(env)
  return env

def cmd_python_text():
  env = new_python_env()
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
        print(pyeval(window.currline, env))
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
  return cmd_python_text

def cmd_python(args):
  if "-" in args:
    if "-c" in args.split(" "):
      o = pyeval(args.split("-c ")[1], new_python_env())
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
      window.cmdkeybind = cmd_python_text()
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

python_command_constructor = {
  "file": cmd_python,
  "type": "js",
  "desc": "Python interpreter",
  "ver": python_version
}
window.usr_bin["python"] = python_command_constructor
window.usr_bin["py"] = python_command_constructor
window.usr_bin["python3"] = python_command_constructor


# class open():
#   def __init__(self, file, mode="r"):
#     self.file = file
#     self.mode = mode

#   def read():
#     if self.mode == "r":
#       return
#     elif self.mode == "rb":
#       return
#     else:
#       raise(FileExistsError)

#   def write(c):
#     if self.mdoe == "w":
#       return
#     if self.mode == "wb":
#       return
#     if self.mode == "a":
#       return
#     else:
#       raise(FileExistsError)

def cmd_pip(args):
  return ""


console.log("Python loaded.")

window.__PYTHONREADY__ = True



# === Add Python-Based Internal Commands ===


window.__PYTHONCMDS__ = True