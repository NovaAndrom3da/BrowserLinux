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
      
  cmdprompt.addEventListener('keydown', function(e){
    if(!(e.key=="Control" || e.key=="Shift" || e.key=="Escape" || e.key=="Tab" || e.key=="Backspace" || e.key=="Enter" || e.key.startsWith("Arrow") || e.key=="Meta" || e.key=="Alt")) {
      if(!e.ctrlKey){
        currline += e.key;
        scroll();
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
    }
    
    cmdlist = cmdprompt.innerHTML.split("<br>");
    cmdlist[cmdlist.length-1] = color(env["DIR"], "green") + " " + color(">>", "lightblue") + " " + currline;
    cmdprompt.innerHTML = cmdlist.join("<br>");
  });

  setInterval(function(){
    cmdprompt.style.width = String(Number(window.innerWidth) - 4);
    cmdprompt.style.height = String(window.innerHeight);
  }, 5000);
}, 500);
setInterval(function(){
  cmdprompt.focus();
}, 200);

function color(text="", forecolor="white", backcolor="black") {
  return "<div class='coloredtext fore_"+forecolor+" back_"+backcolor+"'>"+text+"</div>";
}