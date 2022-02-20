// This file is for integrating brython (brython.js, brythin_stdlib.js)
// into the BrowserLinux environment.

// Init brython
head_element = document.querySelector("head");
brython_js = document.createElement("script");
brython_js.src = "/assets/brython.js";
head_element.appendChild(brython_js);
brython_stdlib_js = document.createElement("script");
brython_stdlib_js.src = "/assets/brython_stdlib.js";
head_element.appendChild(brython_stdlib_js);


function installBrython(){
  try {
    brython({debug: 1, pythonpath: ["/Lib", "/pip"], indexedDB: true});
    console.log("Brython loaded.")
  } catch {
    console.log("Couldn't load brython. Retrying in half a second...");
    setTimeout(installBrython, 500);
  }
}

setTimeout(installBrython, 1600);

function cmd_pip(args) {
  arglist = args.split(" ");
  subcmd = arglist.shift();
  if (subcmd == "install") {
    
  }
}

function python_interpreter_quit(){
  userHasAccess = true;
  delete(cmdkeybind);
  currline = "";
  print(" ");
  triggerPrompt();
  return;
}

