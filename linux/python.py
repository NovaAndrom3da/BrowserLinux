from browser import window, document

print = window.print
color = window.color
bold = window.bold
tab = window.tab
console = window.console
scroll = window.scroll

def python_interpreter_quit():
  window.userHasAccess = True
  window.cmdkeybind = None
  window.triggerPrompt()
  return

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
  "tab": tab,
  "quit": python_interpreter_quit
}

def pyeval(args, vars={}):
  try:
    return exec(args, vars)
  except Exception as e:
    return color(str(e), "red")

window.pyeval = pyeval

def cmd_python_text(e):
  console.log(e)
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
    if args.startswith("-c"):
      o = pyeval(args.lstrip("-c "))
      if o == None:
        return
      return color(o, "yellow")
    if args.startswith("-m"):
      return "Run a runnable python module"
  else:
    if args == "":
      window.userHasAccess = False
      print("Python 3.9 on BrowserLinux. Type `"+bold("help()")+"` for help and `"+bold("quit()")+"` to quit.")
      window.cmd_eval('setTimeout({print(color(">>", "blue"));}, 150);')
      window.cmdkeybind = cmd_python_text
      window.triggerPrompt()
      return
    else:
      return "Running python files coming soon (with introduction of a filesystem)"

window.addCommandFromJS(cmd_python, "python", "Python interpreter", "3.9.x-bl0.1")

