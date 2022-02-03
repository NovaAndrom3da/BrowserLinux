function scroll(){window.scrollTo(0,document.body.scrollHeight);}
      
var canvas = document.querySelector("#display");
setInterval(function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}, 5000);

      
setTimeout(function(){
  cmdprompt = document.querySelector("#cmdprompt");

  cmdprompt.innerHTML = color("Welcome to BrowserLinux! Type `help` for help or `info --contributors` for contributors.", "violet") + "<br>"+color("Start typing...", "green") + " " + color(">>", "lightblue") + " ";
  currline = "";
  lastcmd = "";   // a stone-age approach to a command history
  pausedcmd = ""; //
  cmdkeybind = undefined;
  consolecolor = "white";
  index = -1;
      
  cmdprompt.addEventListener('keydown', function(e){
    if (typeof(cmdkeybind)=="undefined") {
      if(!(e.key=="Control" || e.key=="Shift" || e.key=="Escape" || e.key=="Tab" || e.key=="Backspace" || e.key=="Enter" || e.key.startsWith("Arrow") || e.key=="Meta" || e.key=="Alt")) {
        if(!e.ctrlKey){
          currline += e.key;
          scroll();
        } else if (e.key == "v" && e.shiftKey) {
          navigator.clipboard.readText()
          .then(text => {
            currline += text;
          })
          .catch(err => {
            print("vmsh: ClipboardPasteError: "+err);
          });
        }
      } else if (e.key == "Backspace") {
        scroll();
        if (e.ctrlKey) {
          currline = currline.slice(0, -5);
        } else {
          currline = currline.slice(0, -1);
        }
      } else if (e.key == "Enter") {
        parse(currline);
        cmdprompt.innerHTML += "<br>";
        lastcmd = currline;
        currline = "";
        scroll();
      } else if (e.key == "ArrowUp") {
        pausedcmd = currline;
        currline = lastcmd;
        scroll();
      } else if (e.key == "ArrowDown") {
        currline = pausedcmd;
        scroll();
      } else if (e.key == "Tab") {
        e.preventDefault();
        keywords = kwsearch(currline);
        if (keywords.length > 1) {
          setTimeout(function(){cmdprompt.innerHTML += "<br>" + color(keywords.join(" "), "yellow");}, 200);
        } else if (keywords.length == 1) {
          currline = keywords[0] + " ";
        } else if (currline == "") {
          setTimeout(function(){cmdprompt.innerHTML += "<br>" + color(Object.keys(builtin).concat(Object.keys(usr_bin)).join(" "), "yellow");}, 200);
        }
        cmdprompt.focus();
      }

      cmdlist = cmdprompt.innerHTML.split("<br>");
      if (cmdlist[0] == "") {
        cmdlist.shift();
      }
      cmdlist[cmdlist.length-1] = color(env["DIR"], "green") + " " + color(">>", "lightblue") + " " + color(currline, consolecolor);
      cmdprompt.innerHTML = cmdlist.join("<br>");
    } else {
      cmdkeybind(e);
    }
  });

  setInterval(function(){
    cmdprompt.style.width = String(Number(window.innerWidth) - 4);
    cmdprompt.style.height = String(window.innerHeight);
  }, 5000);
}, 500);
setInterval(function(){
  cmdprompt.focus();
}, 0);

function color(text="", forecolor="white", backcolor="black") {
  return "<div class='coloredtext fore_"+forecolor+" back_"+backcolor+"'>"+text+"</div>";
}

function bold(text="") {
  return "<strong>"+text+"</strong>";
}

function addCommandFromJS(cmd=function(args){}, name="", description="No description provided.") {
  if(typeof(usr_bin[name])=="undefined") {
    usr_bin[name] = {
      "exec": cmd,
      "desc": description
    };
    return 1;
  } else {
    return 0;
  }
}

function addCommandFromVMSH(cmd="", name="", description="No description provided.") {
  if(typeof(usr_bin[name])=="undefined") {
    usr_bin[name] = {
      "exec": function(args) {
        parse(cmd + " " + args);
      },
      "desc": description
    }
    return 1;
  } else {
    return 0;
  }
}

function kwsearch(cmd) {
  
  if (cmd == '') {
    return [];
  }
  var reg = new RegExp(cmd)
  return (Object.keys(builtin).concat(Object.keys(usr_bin))).filter(function(term) {
	  if (term.match(reg)) {
  	  return term;
	  }
  });
}
