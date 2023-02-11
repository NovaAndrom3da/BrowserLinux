document.querySelectorAll("html")[0].onkeydown = function(e) {
  try {
    e.preventDefault();
  } catch {}
}

// function Proc(f) {
//   return {
//     start: f
//   }
// }

// var vmsh_proc = Proc(function(){
  setTimeout(function(){
    // Current command line
    var currline = "";
    
    // A stone-age approach to a command history
    pausedcmd = "";  // Whatever the user types before pressing "up"
    historyindex = 0;
    cmdhistory = [];
    

    // WIP. For functions to capture user keyboard input
    cmdkeybind = undefined;
    userHasAccess = true;

    // Change the color of the console input text
    consolecolor = "white";

    // Command line text input
    window.cmdprompt_keydown = function(e){
      try {
        e.preventDefault();
      } catch {}
      // Check if command has access to keyboard input
      if (typeof(cmdkeybind)=="undefined") {

        // Check if it is a regular character. Not all special keys have been included yet, such as the function keys
        if(!(e.key=="Control" || e.key=="Shift" || e.key=="Escape" || e.key=="Tab" || e.key=="Backspace" || e.key=="Enter" || e.key.startsWith("Arrow") || e.key=="Meta" || e.key=="Alt")) {
          // Check if control is being pressed
          if(!e.ctrlKey){
            // Add to console & scroll to end of page
            currline += e.key;
          } else if (e.key == "v" && e.shiftKey) {
            // Currently non-working paste function (Ctrl+Shift+V)
            navigator.clipboard.readText()
            .then(text => {
              currline += text;
            })
            .catch(err => {
              print("vmsh: ClipboardPasteError: "+err);
            });
          }
        } else if (e.key == "Backspace") {
          // Remove last character and scroll to end
          scroll();
          if (e.ctrlKey) {
            currline = currline.slice(0, -5);
          } else {
            currline = currline.slice(0, -1);
          }
        } else if (e.key == "Enter") {
          // Return key. Runs the command
          parse(currline);
          cmdprompt.innerHTML += "<br>";
          cmdhistory[cmdhistory.length] = currline;
          currline = "";
          historyindex = cmdhistory.length-1;
        } else if (e.key == "ArrowUp") {
          // Previous command ("history function")
          historyindex-2;
          if (historyindex < 0) {historyindex = 0}
          currline = cmdhistory[historyindex];
        } else if (e.key == "ArrowDown") {
          // Previous command ("history function")
          if (historyindex == cmdhistory.length) {
            currline = pausedcmd;
          } else {
            historyindex++;
            currline = cmdhistory[historyindex];
          }        
        } else if (e.key == "Tab") {
          // Autocomplete command function.
          e.preventDefault();
          keywords = kwsearch(currline);
          if (keywords.length > 1) {
            setTimeout(function(){cmdprompt.innerHTML += "<br>" + color(keywords.join(" "), "yellow");}, 100);
          } else if (keywords.length == 1) {
            currline = keywords[0] + " ";
          } else if (currline == "") {
            setTimeout(function(){cmdprompt.innerHTML += "<br>" + color(Object.keys(bin).concat(Object.keys(usr_bin)).join(" "), "yellow");}, 100);
          }
          cmdprompt.focus();
        }

        // Separate lines of the terminal
        //cmdlist = cmdprompt.innerHTML.split("<br>");
        
        // Remove blank lines from the front of the terminal
        if (cmdprompt.firstChild.tagName==='BR') {
          cmdprompt.removeChild(cmdprompt.firstChild);
        }

        // Sets command to the last line of the terminal
        currlineTemp = color(env["DIR"], "green") + " " + color(">>", "lightblue") + " " + color(currline, consolecolor);
        if (userHasAccess) {
  /*        if (cmdlist[cmdlist.length-1] == "" || cmdlist[cmdlist.length-1].startsWith("<div style='coloredtext fore_green>/")) {} else {
            cmdlist.push("");
          } */
          //cmdlist[cmdlist.length-1] = currlineTemp;
          var cmdpromptlist = cmdprompt.innerHTML.split("<br>");
          cmdpromptlist[cmdpromptlist.length-1] = currlineTemp;
          cmdprompt.innerHTML = cmdpromptlist.join("<br>");
        }

        //cmdprompt.innerHTML = cmdlist.join("<br>");
      } else {
        // Command capture keyboard input
        cmdkeybind(e);
      }
    }
    
    window.triggerPrompt = function() {
      cmdprompt_keydown({"key": "", "shiftKey": false, "ctrlKey": false});
    }

    window.cmdprompt = document.querySelector("#cmdprompt");
    cmdprompt.addEventListener('keydown', cmdprompt_keydown);
    cmdprompt.innerHTML = color(window.env["USERDIR"], "green") + " " + color(">>", "lightblue");
    window.triggerPrompt = function() {
      window.cmdprompt_keydown({"key": "", "shiftKey": false, "ctrlKey": false});
    }

  }, 500);
// }, 'user', 'vmsh');
// vmsh_proc.start();

//setInterval(function(){
  // Ignore HTML not finished loading error
//  try {
//    cmdprompt.focus();
//  } catch {}
//}, 0);


// Color command to add color to a printed statement
function color(text="", forecolor="white", backcolor="black") {
  return "<div class='coloredtext fore_"+forecolor+" back_"+backcolor+"'>"+text+"</div>";
}


// Adds bold to a printed statement
function bold(text="") {
  return "<strong>"+text+"</strong>";
}

// A tab
function tab() {
  return "<div class='tab'>&#9;</div>";
}

// Adds a command to /usr/bin/ with the provided javascript
function addCommandFromJS(cmd=function(args){}, name="", description="No description provided.", ver="0.1") {
  if(typeof(usr_bin[name])=="undefined") {
    usr_bin[name] = {
      "file": cmd,
      "desc": description,
      "ver": ver
    };
    return 1;
  } else {
    return 0;
  }
}

function addCommandFromJSStr(cmd="", name="", description="No description provided.", ver="0.1") {
  if(typeof(usr_bin[name]) == "undefined") {
    usr_bin[name] = {
      "file": Function("args", String(cmd)),
      "desc": description,
      "ver": ver
    }
    return 1;
  } else {
    return 0;
  }
}

// Adds a command to /usr/bin/ with the provided vmshell script
function addCommandFromVMSH(cmd="", name="", description="No description provided.", ver="0.1") {
  if(typeof(usr_bin[name])=="undefined") {
    usr_bin[name] = {
      "file": function(args) {
        parse(cmd + " " + args);
      },
      "desc": description,
      "ver": ver
    }
    return 1;
  } else {
    return 0;
  }
}

// Command autocompletion search for "Tab" key
function kwsearch(query='', param=Object.keys(bin).concat(Object.keys(usr_bin))) {
  if (query == '') {
    return [];
  }
  var reg = new RegExp(query)
  return (param).filter(function(term) {
	  if (term.match(reg)) {
  	  return term;
	  }
  });
}

