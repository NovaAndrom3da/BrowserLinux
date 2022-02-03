builtin = {
  "clear": {"exec": cmd_clear, "desc": "Clears the console."},
  "echo": {"exec": cmd_echo, "desc": "Prints the content provided to it"},
  "help": {"exec": cmd_help, "desc": "Shows this help message"},
  "vmsh": {"exec": cmd_vmsh, "desc": "Runs the command in VM Shell"},
//  "man": {"exec": cmd_man, "desc": "Returns detailed information on a specific command"},
  "info": {"exec": cmd_info, "desc": "Provides information about the software. Type `info -h` for more options"},
  "export": {"exec": cmd_export, "desc": "Reads and writes environment variables"},
  "pwd": {"exec": cmd_pwd, "desc": "Prints the working directory"},
  "display": {"exec": cmd_display, "desc": "Connect to a virtual display"},
  "color": {"exec": cmd_color, "desc": "Change color"}
//  "cmdset": {"exec": cmd_cmdset, "desc": "Sets a command stored in an environment variable"},
//  "cd": {"exec": cmd_cd, "desc": "Changes the directory"}
}

env = {
  "USERDIR": "/home/user/",
  "DIR": "/home/user/",
  "USERNAME": "user"
}

usr_bin = {
  "todo": {"exec": cmd_todo, "desc": "Prints the TODO List for BrowserLinux"},
  "eval": {"exec": cmd_eval, "desc": "Evaluates a JS expression"},
  "whoami": {"exec": cmd_whoami, "desc": "Print the current user"},
  "search": {"exec": cmd_search, "desc": "Search the internet"},
  "reload": {"exec": cmd_reload, "desc": "Reload the browser window"},
  "open": {"exec": cmd_open, "desc": "Open a webpage"},
  "curl": {"exec": cmd_curl, "desc": "CURL"}
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
      else if (cmd in builtin) {
        o = builtin[cmd].exec(fullcommand.join(" ")+o);
      } else if (cmd in usr_bin) {
        o = usr_bin[cmd].exec(fullcommand.join(" ")+o);
      } else {
        print(color("vmsh: <strong>"+cmd+"</strong>: command not found", "red"), true);
        return "";
      }
    }
    print(o);
  }
  return "";
}



function print(output, html=false) {
  if(!(output=="" || output=="<br>" || output=="\n" || output==undefined)){
    cmdprompt.innerHTML += "<br>" + output;
  }
}



// Commands
function cmd_echo(args) {
  return args;
}


function cmd_clear(args) {
  cmdprompt.innerHTML = "";
}

function cmd_help(args) {
  if (args == "--usr") {
    text = color("Showing the following "+color(Object.keys(usr_bin).length, "yellow")+" user commands:<br>--------", "green");
    for (x in usr_bin) {
      text += "<br>" + color(x, "yellow") + " - " + usr_bin[x].desc;
    }
  } else {
    text = color("Showing the following "+color(Object.keys(builtin).length, "yellow")+" builtin commands:<br>--------", "green");
    for (x in builtin) {
      text += "<br>" + color(x, "yellow") + " - " + builtin[x].desc;
    }
    text += "<br>" + color("--------", "green") + "<br>" + color("Type `help --usr` to view all", "green") + " " + color(Object.keys(usr_bin).length, "yellow") + " " + color("user commands.", "green")
  }
  return text;
}

/* disabled `man`
function cmd_man(args) {
  return "There are currently no manpages. Check later."
}
*/

function cmd_vmsh(args) {
  parse(args);
}

function cmd_info(args) {
  if (args == ""){
    return color("BrowserLinux is a free and open source project aiming to get a linux environment into the standard user's browser. It is licensed under the GPLv3 license. The git repository is located at https://github.com/Froggo8311/BrowserLinux", "blue");
  } else if (args == "--contributors") {
    return color("Currently the only contributor is Froggo. How about you help out!<br>Type `info --gh` to go to the github page.", "orange");
  } else if (args == "--gh") {
    window.open("https://github.com/Froggo8311/BrowserLinux", "_blank");
  } else if (args == "--help" || args == "-h") {
    return color("-h --help", "yellow")+" Displays this help message.<br>"+color("--contributors", "yellow")+" Lists the contributors<br>"+color("--gh", "yellow")+" Opens the GitHub page in a new tab.";
  } else {
    return color("info has no command '"+args+"'. Type `info --help` for help on this command.", "red");
  }
}

function cmd_export(args) {
  if(args=="") {
    text = "";
    for(envvar in env) {
      text += color(envvar, "yellow") + " = " + color(env[envvar], "orange") + "<br>";
    }
    return text.substring(0, text.length-4).trim();
  } else if (args.includes("-u") || args.includes("--unset")) {
    // unset environment variable
  } else if (args == "-h" || args == "--help") {
    return "`export [variable]=[value]` Sets an environment variable<br>`export [variable]` Returns the value of an environment variable<br>`export` Returns all variables and values<br><br>-h --help Displays this help message"
  }else if (args.includes("=")) {
    statement = args.split("=");
    env[statement[0].toUpperCase().trim()] = statement[1].trim();
    return statement[0].toUpperCase().trim() + " = " + statement[1].trim();
  } else {
    return env[args.toUpperCase().trim()];
  }
}

function cmd_todo(args) {
  return "TODO List:<br>- Add env var fetch using `$VARIABLE`<br>- Add useful environment variables<br>- Make pipes less buggy when using `vmsh` as it is a problem instigator<br>- Fix `cd` command<br>- Add `wget`/`curl` command<br>- Maybe add python/c compiler (!!)";
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

function cmd_display(args) {
  if (args == "") {
    return "This command closes this terminal and opens a graphical display. " + color("The graphical display currently does nothing.", "orange") + "<br>" + color("Use `display --yes` to switch to the graphical display.", "yellow");
  } else if (args == "--yes" || args == "-y") {
    return color("Not yet implemented.", "yellow");
  } else if (args == "-h" || args == "--help") {
    return "`-h` `--help` Shows this help message<br>`--yes` `-y` Opens the graphical display";
  } else {
    return color("display has no command '"+args+"'. Type `display --help` for help on this command.", "red");
  }
}

/* Disabled `cmdset`
function cmd_cmdset(args) {
  if (args == "" || args == "-h" || args == "--help") {
    return "USAGE: `cmdset [ENVVAR] as [command name] as [description]`";
  } else if (args.includes(" as ")) {
    kw = args.split(" as ");
    constructed = {
      "exec": function(args) { cmd_vmsh(env[kw[1].trim().toUpperCase()]); },
      "desc": kw[2].trim()
    }
    usr_bin[kw[0].trim()] = constructed;
    delete(env[kw[1].trim()]);
    return kw[1].trim().toUpperCase() + ": "+ kw[2].trim();
  }
}
*/

function cmd_search(args) {
  window.open("https://duckduckgo.com/?q="+args, "_blank");
}

function cmd_eval(args) {
  if (args != "") {
    try {
      return color(Function('"use strict"; return (' + String(args) + ')')(), "yellow");
    } catch (err) {
      return color("eval: "+err, "red");
    }
  } else {
    
  }
}

function cmd_whoami(args) {
  return env["USERNAME"];
}

function cmd_open(args){
  window.open(args, "_blank")
}

function cmd_color(args) {
  consolecolor=args;
}

function cmd_curl(args) {
  var req = new XMLHttpRequest();
  req.open("GET", args);
  req.onreadystatechange = function() {
    if (req.readyState === XMLHttpRequest.DONE) {
      if (req.status === 0 || (req.status >= 200 && req.status < 400)) {
        return req.responseText;
      } else {
        return color("curl: ")
      }
    }
  }
}