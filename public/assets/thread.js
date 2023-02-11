_null = function(){};

// var _threads = {};

// function killThread(pid) {
//   if (Object.keys(_threads).includes(String(pid))) {
//     const thread = _threads[String(pid)];
//     for (var appindex = 0; appindex < thread.apps.length; appindex++) {
//       // kill app with id `thread.apps[appindex]`
//     }
  
//     for (var iidindex = 0; iidindex < thread.iid.length; iidindex++) {
//       clearInterval(Number(thread.iid[iidindex]));
//     }

//     return true;
//   } else {
//     return false;
//   }
// }

// function threadConstructor(processname="none", pid="0") {
//   return {
//     processname,
//     pid: String(pid),
//     kill: function() { return killThread(String(pid)); },
//     apps: [],
//     iid: [],    
//   };
// }

// function newPID() {
//   const pid = Math.floor(Math.random()*Math.random()*100);
//   if (Object.keys(_threads).includes(String(pid))) {
//     return newPID();
//   } else {
//     return String(pid);
//   }
// }

// function addIIDtoThread(iid, pid) {
//   try {
//     _thread[String(pid)].iid.push(String(iid));
//     return true;
//   } catch {
//     return false;
//   }
// }

// function instantiatePID(processname, pid=newPID()) {
//   _threads[String(pid)] = threadConstructor(String(pid), processname);
//   return String(pid);
// }

// function openApp(appID, pid=newPID()) {
//   instantiatePID(appID, String(pid));
// }


/* Add thread-related commands */
// cmd_kill = function(args) {
  
// }

// cmd_pgrep = function(args) {
  
// }









/* === New Process System === */
window.proc_list = {};
function ReservePID() {
  var newpid = 0;
  for (var i = 1; newpid == 0; i++) {
    if (!(window.proc_list[i])) {
      newpid = i;
    }
  }
  return newpid;
}

function StartProcess(process_pid) {
  return function() {
    proc = window.proc_list[process_pid];
    proc.running = true;
    while (proc.running) {
      try {
        proc.out = proc.exec();
      } catch {
        proc.exit = 1;
      }
      proc.stop();
    }
  }
}

function StopProcess(process_pid) {
  return function() {
    console.log("Error not implemented");
  };
}

function KillProcess(process_pid) {
  return function(){
    console.log("Error not implemented");
  };
}

function Proc(func, user, name) {
  var process_pid = ReservePID();
  var new_proc = {
    exec: func,
    user: user,
    name: name,
    pid: process_pid,
    start: StartProcess(process_pid),
    stop: StopProcess(process_pid),
    kill: KillProcess(process_pid),
    running: false,
    type: 0,
    exit: 0,
    out: undefined
  };
  window.proc_list[process_pid] = new_proc;
  return new_proc;
}

function StopIntervalProc(proc) {
  return function() {
    clearInterval(proc.exec);
    proc.running = false;
  }
}

function IntervalProc(interval, name) {
  var proc = Proc(interval, 'root', 'system ['+name+']');
  var stop = StopIntervalProc(proc);
  proc.running = true;
  proc.type = 1;
  proc.start = _null;
  proc.stop = stop;
  proc.kill = stop;
  return proc;
}

