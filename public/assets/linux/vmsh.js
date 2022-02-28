// === Command Setup ===
// "Emulating" /bin/
bin = {
  "clear": {"exec": cmd_clear, "desc": "Clears the console."},
  "echo": {"exec": cmd_echo, "desc": "Prints the content provided to it"},
  "help": {"exec": cmd_help, "desc": "Shows this help message"},
  "vmsh": {"exec": cmd_vmsh, "desc": "Runs the command in VM Shell"},
  "info": {"exec": cmd_info, "desc": "Provides information about the software. Type `info -h` for more options"},
  "export": {"exec": cmd_export, "desc": "Reads and writes environment variables"},
  "pwd": {"exec": cmd_pwd, "desc": "Prints the working directory"},
  "color": {"exec": cmd_color, "desc": "Change color"},
  "unset": {"exec": cmd_unset, "desc": "Remove an environment variable"}
};

// "Emulating" /usr/bin/
usr_bin = {
  "whoami": {"exec": cmd_whoami, "desc": "Print the current user", "ver": "0.1"},
  "reload": {"exec": cmd_reload, "desc": "Reload the browser window", "ver": "0.1"},
  "blpm": {"exec": cmd_blpm, "desc": "BrowserLinux Package Manager", "ver": "0.1"},
  "python": {"exec": cmd_pythonunloaded, "desc": "Python interpreter", "ver": "0.0"}
};

// like usr_bin, but does not show the content in `blpm list` or `help --usr`
silent_usr_bin = {
  "py": {"exec": cmd_pythonunloaded, "desc": "Python interpreter", "ver": "0.0"},
  "python3": {"exec": cmd_pythonunloaded, "desc": "Python interpreter", "ver": "0.0"},
  "python3.10": {"exec": cmd_pythonunloaded, "desc": "Python interpreter", "ver": "0.0"}
};


// === Environment Variables ===
env = {
  "USERDIR": "/home/user/",
  "DIR": "/home/user/",
  "USERNAME": "user",
  "BLVERSION": "0.1.0"
};

// === Background Functions ===
function cmdexec(from, command, args) {
  return from[command].exec(args);
}

// Function to parse terminal commands.
function parse(command) {
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
      if (cmd == "") {}
      else if (cmd in bin) {
        o = cmdexec(bin, cmd, fullcommand.join(" ")+o);
      } else if (cmd in usr_bin) {
        o = cmdexec(usr_bin, cmd, fullcommand.join(" ")+o);
      } else if (cmd in silent_usr_bin) {
        o = cmdexec(silent_usr_bin, cmd, fullcommand.join(" ")+o);
      } else {
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
    cmdprompt.innerHTML += "<br>" + String(output).split("\n").join("<br>").split("\\n").join("<br>").split("\\t").join(tab());
  } else if (output=="[object Object]") {
    // Tries to convert python objects that only return "[object Object]" to strings
    print(JSON.stringify(output));
  }
}

                                                          
// === Commands ===
// "echo" command to print a string
function cmd_echo(args) {
  return args;
}

// Clears the terminal
function cmd_clear(args) {
  if (args == "-r") {
    parse("clear && info -w");
  } else {
    cmdprompt.innerHTML = "";
  }
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
  } else {
    // Prints /bin/ commands
    text = color("Showing the following "+color(Object.keys(bin).length, "yellow")+" bin commands:<br>--------", "green");
    for (x in bin) {
      text += "<br>" + color(x, "yellow") + tab() + tab() + bin[x].desc;
    }
    text += "<br>" + color("--------", "green") + "<br>" + color("Type `help --usr` to view all", "green") + " " + color(Object.keys(usr_bin).length, "yellow") + " " + color("user commands.", "green")
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
  } else if (args == "-w") {
    // Display welcome message
    return welcomeText;
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

// A virtual display. Not an immediate concern, but could potentially be a feature later on.
function cmd_display(args) {
  if (args == "") {
    return "This command closes this terminal and opens a graphical display. " + color("The graphical display currently does nothing.", "orange") + "<br>" + color("Use `display --yes` to switch to the graphical display.", "yellow");
  } else if (args == "--yes" || args == "-y") {
    return color("Not yet implemented.", "yellow");
  } else if (args == "-h" || args == "--help") {
    return "`-h` `--help`"+tab()+"Shows this help message<br>`--yes` `-y`"+tab()+"Opens the graphical display";
  } else {
    return color("display has no command '"+args+"'. Type `display --help` for help on this command.", "red");
  }
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

// Prints the current user's name
function cmd_whoami(args) {
  return env["USERNAME"];
}

// Changes the color of input text in the terminal
function cmd_color(args) {
  consolecolor=args;
}

// BrowserLinux Package Manager
blpm_install_queue = []; // items to be installed
blpm_remote_cache = []; // cache generated from `blpm remote` for the `blpm install-all` command.
env["BLPM_REMOTE_CACHE_DELETE"] = String(120000); // Default (120000 = 2 minutes), timer for deleting blpm_remote_cache
env["BLPM_INSTALL_DELAY"] = String(2000); // installer delay, in milliseconds

blpm_background_process = setInterval(function(){
  if (blpm_install_queue.length > 0) {
    pkg = blpm_install_queue[0];
    if (pkg == '') {return;}
    if (pkg in usr_bin) {
      print("The package '"+bold(pkg)+"' is already installed.<br>");
      blpm_install_queue.shift();
      return;
    }
    xhr = new XMLHttpRequest();
    xhr.open("GET", "/blpm/"+pkg+"/install");
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
              if (installcmd.exec != "") {
                addCommandFromVMSH(installcmd.exec, pkg, installcmd.desc, installcmd.ver);
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
              if (installcmd.exec != "") {
                addCommandFromJSStr(installcmd.exec, pkg, installcmd.desc, installcmd.ver);
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
    return delete(env[arglist[i]]);
  }
}

function cmd_pythonunloaded(args) {
  return color("Python has not finished loading. Please wait a second and then try again.", "yellow");
}