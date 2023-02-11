// === Command Setup ===
// "Emulating" /bin/
var bin = {
  "clear": {"file": cmd_clear, "desc": "Clears the console."},
  "echo": {"file": cmd_echo, "desc": "Prints the content provided to it"},
  "help": {"file": cmd_help, "desc": "Shows this help message"},
  "vmsh": {"file": cmd_vmsh, "desc": "Runs the command in VM Shell"},
  "info": {"file": cmd_info, "desc": "Provides information about the software. Type `info -h` for more options"},
  "export": {"file": cmd_export, "desc": "Reads and writes environment variables"},
  "pwd": {"file": cmd_pwd, "desc": "Prints the working directory"},
  // "color": {"file": cmd_color, "desc": "Change color"},
  "unset": {"file": cmd_unset, "desc": "Remove an environment variable"},
  "reboot": {"file": cmd_reload, "desc": "Reload the browser window"},
  "shutdown": {"file": cmd_reload, "desc": "Reload the browser window"},
  "ls": {"file": cmd_ls, "desc": "List directory"},
  // "kill": {"file": cmd_kill, "desc": "Terminates a process"},
  // "pgrep": {"file": cmd_pgrep, "desc": "Search through all open processes"},
  // "history": {"file": cmd_history, "desc": "Show the user's command history"},
};

// "Emulating" /usr/bin/
var usr_bin = {
  "whoami": {"file": cmd_whoami, "desc": "Print the current user", "ver": "0.1"},
  "blpm": {"file": cmd_blpm, "desc": "BrowserLinux Package Manager", "ver": "0.1"},
  "python": {"file": cmd_pythonunloaded, "desc": "Python interpreter", "ver": "0.0"},
  "py": {"file": cmd_pythonunloaded, "desc": "Python interpreter >{python}"},
  "python3": {"file": cmd_pythonunloaded, "desc": "Python interpreter >{python}"},
  "python3.10": {"file": cmd_pythonunloaded, "desc": "Python interpreter >{python}"},
  "sh": {"file": cmd_vmsh, "desc": "Shell >{vmsh}"},
  "bash": {"file": cmd_vmsh, "desc": "Bourne-again Shell >{vmsh}"},
  "apt": {"file": cmd_blpm, "desc": "Wrapper program for blpm, apt. WIP >{blpm}"},
  "sudo": {"file": cmd_vmsh, "desc": "Pseudo-Superuser Shell >{vmsh}"},
  "reload": {"file": cmd_reload, "desc": "Reload the browser window >{reboot}"},
  "cat": {"file": cmd_cat, "desc": "Prints the contents of a file"},
  "which": {"file": cmd_which, "desc": "Get the location of an executable in the PATH"},
};

// === Environment Variables ===
var env = {
  "USERDIR": "/home/user/",
  "DIR": "/home/user/",
  "USERNAME": "user",
  "BLVERSION": "0.1.0",
  "BLPM_REMOTE_CACHE_DELETE": String(120000), // Default (120000 = 2 minutes), timer for deleting blpm_remote_cache
  "BLPM_INSTALL_DELAY": String(500), // installer delay, in milliseconds. Default (500 = 1/2 second)
  "PATH": "/bin/:/usr/bin/",
};


// env_vars_defaults_pid = instantiatePID("env_vars_defaults");
// IntervalProc(
  setInterval(function(){
  var envdefaults = {
    "USERDIR": "/home/user/",
    "DIR": "/home/user/",
    "USERNAME": "user",
    "BLPM_REMOTE_CACHE_DELETE": String(120000),
    "BLPM_INSTALL_DELAY": String(500),
  };
  var envlist = Object.keys(envdefaults);
  for (x in envlist) {
    if (env[envlist[x]] == undefined) {
      env[envlist[x]] = envdefaults[envlist[x]];
    }
  }
}, 150)//, 'env_vars_defaults');

// === Background Functions ===
function cmdexec(f, command, args) {
  return f[command].file(args)//, 'user', command).out;
}

// Function to parse terminal commands.
function parse(command) {
  //await FSWrite(env["USERDIR"]+".history", (await FSRead(env["USERDIR"]+".history")).toString()+"\n"+command);
  userHasAccess = false;
  // Splits commands between the "&&" operator
  andcmds = command.split("&&");
  for (andcmd in andcmds) {
    // Separates commands that have pipes. Returns a single list item if there is no pipe
    pipecmds = andcmds[andcmd].trim().split("|");
    o = "";
    for (pipecmd in pipecmds) {
      // Get and clean up command
      if (pipecmds[pipecmd] == undefined) {
        pipedcommand = "";
      } else {
        pipedcommand = pipecmds[pipecmd];
      }
      fullcommand = pipedcommand.trim().split(" ");
      cmd = fullcommand.shift();
      

      // Runs commands if in /bin/ or /usr/bin/ and returns an error if not
      path = env['PATH'].split(':');
      found = false;
      for (var i = 0; i < path.length; i++) {
        try {
          o = cmdexec(window.get_filesystem_object(path[i]), cmd, fullcommand.join(" ") + o);
          found = true;
          break;
        } catch {}
      }

      if (!found) {
        try {
          o = window.get_filesystem_object(cmd).file(fullcommand.join(' ') + o);
          found = true;
        } catch {}
      }
      // if (cmd == "") {}
      // else if (cmd in bin) {
      //   o = cmdexec(bin, cmd, fullcommand.join(" ")+o);
      // } else if (cmd in usr_bin) {
      //   o = cmdexec(usr_bin, cmd, fullcommand.join(" ")+o);
      // } else if (cmd in silent_usr_bin) {
      //   o = cmdexec(silent_usr_bin, cmd, fullcommand.join(" ")+o);
      // } else {
      if (!found && cmd != '') {
        print(color("vmsh: <strong>"+cmd.split("<br>").join(" ").split(tab()).join(" ")+"</strong>: command not found", "red"), true);
        userHasAccess = true;
        return "";
      }
    }
    print(o);
  }
  userHasAccess = true;
  return "";
}



// Function that prints to the terminal
function print(output) {
  // Ignores empty stings and vague [object Object]
  if (!(output=="" || output=="<br>" || output=="\n" || output==undefined || output=="[object Object]")) {
    // Prints to the terminal after replacing all fake newlines with real newlines
    cmdprompt.appendChild(document.createElement("br"));
    cmdprompt.insertAdjacentHTML('beforeend', String(output).split("\n").join("<br>").split("\\n").join("<br>").split("\\t").join(tab()));
  } else if (output=="[object Object]") {
    // Tries to convert python objects that only return "[object Object]" to strings
    try {
      print(JSON.stringify(output));
    } catch {
      //print(String(output));
      console.log(output);
    }
  }
}

                                                          
// === Commands ===
// "echo" command to print a string
function cmd_echo(args) {
  return args;
}

// Clears the terminal
function cmd_clear(args) {
  cmdprompt.innerHTML = "";
}

// Prints a help message
function cmd_help(args) {
  // Checks arguments
  if (args == "--usr") {
    // Prints /usr/bin/ commands
    text = color("Showing the following "+color(Object.keys(usr_bin).length, "yellow")+" user commands:<br>--------", "green");
    for (x in usr_bin) {
      text += "<br>" + color(x, "yellow") + tab() + tab() + usr_bin[x].desc;
    }
  } else if (args.split(" ").includes("-a") || args.split(" ").includes("--all")) {
    text = color("Showing the following "+color(Object.keys(bin).concat(Object.keys(usr_bin)).length, "yellow")+" commands:<br>--------", "green");
    for (x in bin) {
      text += "<br>" + color(x, "yellow") + tab() + tab() + bin[x].desc;
    }
    for (x in usr_bin) {
      text += "<br>" + color(x, "yellow") + tab() + tab() + usr_bin[x].desc;
    }
    // for (x in silent_usr_bin) {
    //   text += "<br>" + color(x, "yellow") + tab() + tab() + silent_usr_bin[x].desc;
    // }
  } else if (args == "-h" || args == "--help") {
    text = "Commands for `help`:\n"+color("-h --help"+tab()+"Shows this help message", "yellow")+"\n"+color("-a --all"+tab()+"Lists all commands", "yellow")+"\n"+color("--usr"+tab()+"Shows all commands in `/usr/bin/`", "yellow");
  } else {
    // Prints /bin/ commands
    text = color("Showing the following "+color(Object.keys(bin).length, "yellow")+" bin commands:<br>--------", "green");
    for (x in bin) {
      text += "<br>" + color(x, "yellow") + tab() + tab() + bin[x].desc;
    }
    text += "<br>" + color("--------", "green") + "<br>" + color("Type `help --usr` to view all", "green") + " " + color(Object.keys(usr_bin).length, "yellow") + " " + color("commands from installed programs.", "green")
  }
  return text;
}

// Pseudo-`bash` command `vmsh`
function cmd_vmsh(args) {
  return parse(args);
}

// Command with info about BrowserLinux project
function cmd_info(args) {
  if (args == ""){
    // Prints information about the projectf
    return color("BrowserLinux is a free and open source project aiming to get a linux environment into the standard user's browser. It is licensed under the GPLv3 license.<br>The git repository is located at https://github.com/Froggo8311/BrowserLinux but can be quickly accessed using `info --gh`", "lightblue");
  } else if (args == "--contributors") {
    // Prints contributors
    return color("Currently the only contributor is Froggo. How about you help out!<br>Type `info --gh` to go to the github page.", "orange");
  } else if (args == "--gh") {
    // Opens the GitHub
    window.open("https://github.com/Froggo8311/BrowserLinux", "_blank");
  } else if (args == "--help" || args == "-h") {
    // Prints arguments
    return color("-h --help", "yellow") + tab() + tab() +"Displays this help message.\n" + color("--contributors", "yellow") + tab() + tab() +"Lists the contributors\n" + color("--gh", "yellow") + tab() + tab() + "Opens the GitHub page in a new tab.\n" + color("-t --todo", "yellow") + tab() + tab() + "Shows the todo list for BrowserLinux's development.";
  } else if (args == "-t" || args == "--todo") {
    // Prints a todo list for the BrowserLinux project.
    return color("TODO List:<br>-"+tab()+"Add env var fetch using `$VARIABLE`<br>-"+tab()+"Make pipes less buggy when using `vmsh` as it is a problem instigator<br>-"+tab()+"Add `wget`/`curl` command<br>-"+tab()+"Add C/C++ compiler using emscrypten<br>-"+tab()+"Add a filesystem using IndexedDB & add `cd` command");
  } else {
    // Returns error for unknown argument
    return color("info has no command '"+bold(args)+"'. Type `info --help` for help on this command.", "red");
  }
}

// Command for reading and writing to environment variables
function cmd_export(args) {
  // Checks arguments
  if(args=="") {
    // Prints environment variables
    text = "";
    for(envvar in env) {
      text += color(envvar, "yellow") + " = " + color(env[envvar], "orange") + "<br>";
    }
    return text.substring(0, text.length-4).trim();
  } else if (args.includes("-u") || args.includes("--unset")) {
    // unset environment variable
  } else if (args == "-h" || args == "--help") {
    // Prints help message
    return color("export [variable]=[value]", "yellow") + tab() + tab() + "Sets an environment variable`export [variable]` Returns the value of an environment variable<br>`export` Returns all variables and values<br><br>-h --help Displays this help message"
  } else if (args.includes("=")) {
    // Sets an environment variable
    statement = args.split("=");
    env[statement[0].toUpperCase().trim()] = statement[1].trim();
    return statement[0].toUpperCase().trim() + " = " + statement[1].trim();
  } else {
    // Prints a specific environment variable
    return env[args.toUpperCase().trim()];
  }
}

// Reloads the BrowserLinux webpage
function cmd_reload(args) {
  location.reload();
}

// Prints the working directory
function cmd_pwd(args) {
  return env["DIR"];
}

function cmd_ls() {
  return window.FILESYSTEM_LIST(env['DIR']).join(' ');
}

// Prints the contents of a file
function cmd_cat(args) {
  // var o = ''
  // for (var i = 0; i < args.length; i++) {
  //   o += window.FILESYSTEM_READ(args[i]);
  // }
  return window.FILESYSTEM_READ(args)
}

// Changes the working directory
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

// Evaluates a javascript expression. Can be used for math
function cmd_eval(args) {
  if (args != "") {
    try {
      return color(Function('"use strict"; return (' + String(args) + ')')(), "yellow");
    } catch (err) {
      return color("eval: "+err, "red");
    }
  } else {}
}

function cmd_which(args) {
  path = env['PATH'].split(':');
  path.push(args);
  for (var i = 0; i < path.length; i++) {
    try {
      if (Object.keys(window.get_filesystem_object(path[i])).includes(args)) {
        return path[i] + args;
      }
    } catch {}
  }
  return color("Could not find '"+args+"'.", 'red');
}

// Prints the current user's name
function cmd_whoami(args) {
  return env["USERNAME"];
}

// Changes the color of input text in the terminal
// function cmd_color(args) {
//   consolecolor=args;
// }

// BrowserLinux Package Manager
var blpm_install_queue = []; // items to be installed
var blpm_remote_cache = []; // cache generated from `blpm remote` for the `blpm install-all` command.

var blpm_background_process = setInterval(function(){
  if (blpm_install_queue.length > 0) {
    pkg = blpm_install_queue[0];
    if (pkg == '') {return;}
    if (pkg in usr_bin) {
      print("The package '"+bold(pkg)+"' is already installed.<br>");
      blpm_install_queue.shift();
      return;
    }
    xhr = new XMLHttpRequest();
    xhr.open("GET", "/packages/"+pkg+".json");
    xhr.timeout = 2000;
    finishLoad = function() {
      if (xhr.readyState == 4) {
        installcmd = JSON.parse(xhr.responseText);
        if (installcmd["Error"] == "Package not present") {
          print(color("There is no package with the name '"+bold(pkg)+"'<br>", "red"));
          blpm_install_queue.shift();
          return;
        }
        if (pkg in usr_bin) {
          print("The package '"+bold(pkg)+"' is already installed.<br>");
          blpm_install_queue.shift();
        } else {
          print("Downloaded '"+bold(pkg)+"'. Installing...");
          if (installcmd["type"] == "vmsh") {
            try {
              if (installcmd.file != "") {
                addCommandFromVMSH(installcmd.file, pkg, installcmd.desc, installcmd.ver);
              }
              blpm_install_queue.shift();
              print("Successfully installed '"+bold(pkg)+"'<br>");
            } catch {
              print(color("There was an issue installing '"+bold(pkg)+"'. Perhaps there is an error in the program?<br>", "red"));
              blpm_install_queue.shift();
              return;
            }
          } else if (installcmd["type"] == "js") {
            try {
              if (installcmd.file != "") {
                addCommandFromJSStr(installcmd.file, pkg, installcmd.desc, installcmd.ver);
              }
              blpm_install_queue.shift();
              print("Successfully installed '"+bold(pkg)+"'<br>");
            } catch {
              print(color("There was an issue installing '"+bold(pkg)+"'. Perhaps there is an error in the program?<br><br>", "red"));
              blpm_install_queue.shift();
              return;
            }
          } else {
            print(color("The command '"+bold(pkg)+"' was found, but has no valid 'type' attribute.<br>", "red"));
            return;
          }
          try {
            if (installcmd.require.filter(blankstring => blankstring).length > 0) {
              print("This packages requires the following packages:<br>"+color(installcmd.require.join(" "), "yellow")+"<br>");
            }
            blpm_install_queue = blpm_install_queue.concat(installcmd.require.filter(blankstring => blankstring));
          } catch {
            print("The package will still be installed, but '"+bold(pkg)+"' does not have a valid 'require' parameter.<br>")
          }
        }
      } else {
        setTimeout(finishLoad, 50);
      }
    }
    xhr.send();
    finishLoad();
    setTimeout(function(){if (blpm_install_queue.length == 0) {print("Finished installing packages.<br>"); triggerPrompt();}}, 1000);
  }
}, Number(env["BLPM_INSTALL_DELAY"]));

// addIIDtoThread(blpm_background_process, instantiatePID("blpm"));
// IntervalProc(blpm_background_process, 'blpm');

function cmd_blpm(args) {
  arglist = args.split(" ");
  blpmcmd = arglist.shift();
  if (blpmcmd == "install") {
    print("Checking package databases...");
    for (i in arglist) {
      blpm_install_queue.push(arglist[i]);
    }
  } else if (blpmcmd == "remove" || blpmcmd == "purge") {
    for (i in arglist) {
      if (arglist[i] in usr_bin) {
        print("Removing "+arglist[i]+"...");
        delete(usr_bin[arglist[i]]);
        print("Done.");
      } else {
        return "blpm: could not find package '"+arglist[i]+"'";
      }
    }
    return "Finished removing packages.";
  } else if (blpmcmd == "list") {
    for (i in usr_bin) {
      print(color(i, "yellow")+tab()+"v"+usr_bin[i].ver);
    }
  } else if (args == "--help" || args == "-h") {
    return color("-h --help", "yellow") + tab() + tab() + "Shows this help message\n" + color("install [packages]", "yellow") + tab() + tab() + "Installs a package\n" + color("remove [packages]", "yellow") + tab() + tab() + "Uninstalls a package\n" + color("purge [packages]", "yellow") + tab() + tab() + "Uninstalls a package\n" + color("list", "yellow") + tab() + tab() + "Lists all currently installed packages\n" + color("remote", "yellow") + tab() + tab() + "Lists all remote programs to install\n" + color("install-all", "yellow") + tab() + tab() + "Installs "+bold("ALL")+" of the packages available to install";
  } else if (blpmcmd == "remote") {
    print("Reading remote database...")
    remotepackages = new XMLHttpRequest();
    remotepackages.open("GET", "/blpm-listall");
    remotepackages.onreadystatechange = function() {
      if(remotepackages.readyState == 4) {
        o = "";
        try {
          commandstoinstall = JSON.parse(remotepackages.responseText);
        } catch {
          print(color("There was an error when trying to connect to the server<br>", "red"));
          return;
        }
        
        keys = Object.keys(commandstoinstall);
        blpm_remote_cache = keys;
        setTimeout(function(){blpm_remote_cache = [];}, Number(env["BLPM_REMOTE_CACHE_DELETE"]));
        for (i in keys) {
          o += color(keys[i], "yellow") + tab() + commandstoinstall[keys[i]] + "<br>";
        }
        print(o);
        triggerPrompt();
      }
    }
    remotepackages.send();
  } else if (blpmcmd == "install-all") {
    print("Installing ALL packages... (this may take a while)");
    if (blpm_remote_cache.length == 0) {
//      if (env["BLPM_INSTALL_DELAY"])
      cmd_blpm("remote");
    }
    setTimeout(function(){blpm_install_queue = blpm_remote_cache;},500);
  } else if (args == "") {
    return "Type '"+bold("blpm --help")+"' for help.";
  } else {
    return color("blpm has no command '"+bold(blpmcmd)+"'. Type `blpm --help` for help on this command.", "red");
  }
}

function cmd_unset(args) {
  arglist = args.split(" ");
  for (i in arglist) {
    if (!(delete(env[arglist[i].toUpperCase()]))) {
      return color("Error: Could not unset '"+bold(arglist[i])+"'", "red");
    }
  }
}

function cmd_pythonunloaded(args) {
  return color("Python has not finished loading. Please wait a second and then try again.", "yellow");
}

// function cmd_kill(args) {}
// function cmd_pgrep(args) {}


// async function cmd_history(args) {
//   var arglist = args.split(" ");
//   if (args == "") {
//     print((await FSRead(env["USERDIR"]+".history")).toString());
//   } else if (arglist.contains("-c")) {
//     await FSWrite(env["USERDIR"]+".history", "");
//   }
// }