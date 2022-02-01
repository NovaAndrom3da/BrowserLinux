builtin = {
  "clear": {"exec": cmd_clear, "desc": "Clears the console."},
  "echo": {"exec": cmd_echo, "desc": "Prints the content provided to it"},
  "help": {"exec": cmd_help, "desc": "Shows this help message"},
  "vmsh": {"exec": cmd_vmsh, "desc": "Runs the command in VM Shell"},
  "man": {"exec": cmd_man, "desc": "Returns detailed information on a specific command"},
  "info": {"exec": cmd_info, "desc": "Provides information about the software"},
  "export": {"exec": cmd_export, "desc": "Reads and writes environment variables"},
  "todo": {"exec": cmd_todo, "desc": "Prints the TODO List for BrowserLinux"},
  "reload": {"exec": cmd_reload, "desc": "Reload the browser window"},
  "pwd": {"exec": cmd_pwd, "desc": "Prints the working directory"},
  "cd": {"exec": cmd_cd, "desc": "Changes the directory. Warning: this command is incomplete and buggy"}
}

env = {
  "USERDIR": "/home/user/",
  "DIR": "/home/user/"
}


function parse(command) {
  andcmds = command.split("&&");
  for (andcmd in andcmds) {
    pipecmds = andcmds[andcmd].trim().split("|");
    o = "";
    for (pipecmd in pipecmds) {
      fullcommand = pipecmds[pipecmd].trim().split(" ");
      cmd = fullcommand.shift()
      if (cmd == "") {}
      else if (!(cmd in builtin)) {
        print("vmsh: "+cmd+": command not found");
        return 0;
      } else {
        o = builtin[cmd].exec(fullcommand.join(" ")+o);
      }
    }
    print(o);
  }
  return "";
}



function print(output) {
  if(!(output=="" || output=="\n" || output==undefined)){
    cmdprompt.innerText += "\n"+output;
  }
}



// Commands
function cmd_echo(args) {
  return args;
}


function cmd_clear(args) {
  cmdprompt.innerText = "";
}

function cmd_help(args) {
  text = "Here is the following commands:\n--------";
  for (x in builtin) {
    text += "\n    " + x + " - " + builtin[x].desc;
  }
  return text;
}

function cmd_man(args) {
  return "There are currently no manpages. Check later."
}

function cmd_vmsh(args) {
  parse(args);
}

function cmd_info(args) {
  return "BrowserLinux is a free and opes source project aiming to get a linux environment into the standard user's browser. It is licensed under GPLv3 (license information not yet included)."
}

function cmd_export(args) {
  if(args=="") {
    text = "";
    for(envvar in env) {
      text += envvar + " = " + env[envvar] + "\n";
    }
    return text.trim();
  } else if (args.includes("=")) {
    statement = args.split("=");
    env[statement[0].toUpperCase().trim()] = statement[1].trim();
    return statement[0].toUpperCase().trim() + " = " + statement[1].trim();
  } else {
    return env[args.toUpperCase().trim()];
  }
}

function cmd_todo(args) {
  return "TODO List:\n- Add env var fetch using `$VARIABLE`\n- Add useful environment variables\n- Make pipes less buggy (bugs out when more than one pipe is used in a command). `vmsh` seems to be a problem instigator\n- Fix `cd` command\n- Add `wget`/`curl` command\n- Maybe add python/c compiler (!!)";
}

function cmd_reload(args) {
  location.reload();
}

function cmd_pwd(args) {
  return env["DIR"];
}

function cmd_cd(args) {
  if(args == "" || args == "~") {
    env["DIR"] = env["USERDIR"];
  } else if (args[0] == "/") {
    env["DIR"] = args;
  } else if (args[0] == "~") {
    env["DIR"] = env["USERDIR"] + args.substring(1);
  } else if (args == "..") {
    dirlist = env["DIR"].substring(0,-1).split("/");
    dirlist.pop();
    env["DIR"] = dirlist.join("/");
  } else if (args == ".") {
  } else {
    env["DIR"] += "/" + args;
  }

  if (env["DIR"].substring(-1)!="/") {env["DIR"]+="/"}
}