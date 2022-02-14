from browser import window

print = window.print
color = window.color
bold = window.bold
tab = window.tab

def pyeval(args):
  try:
    return color(exec(args), "yellow")
  except Exception as e:
    return color("pyeval: "+str(e), "red")


def cmd_python(args):
  if "-" in args:
    if args.startswith("-c"):
      return pyeval(args.lstrip("-c "))
    if args.startswith("-m"):
      return "Run a runnable python module"
  else:
    if args == "":
      return "Python interprereter coming soon"
    else :
      return "Running python files coming soon (with introduction of a filesystem)"


window.addCommandFromJS(cmd_python, "python", "Python interpereter", "3.9.x-bl0.1")