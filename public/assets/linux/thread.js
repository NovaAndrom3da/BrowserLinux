var _threads = {};

function killThread(pid) {
  if (Object.keys(_threads).includes(String(pid))) {
    const thread = _threads[String(pid)];
    for (var appindex = 0; appindex < thread.apps.length; appindex++) {
      // kill app with id `thread.apps[appindex]`
    }
  
    for (var iidindex = 0; iidindex < thread.iid.length; iidindex++) {
      clearInterval(Number(thread.iid[iidindex]));
    }

    return true;
  } else {
    return false;
  }
}

function threadConstructor(processname="none", pid="0") {
  return {
    processname,
    pid: String(pid),
    kill: function() { return killThread(String(pid)); },
    apps: [],
    iid: [],    
  };
}

function newPID() {
  const pid = Math.floor(Math.random()*Math.random()*100);
  if (Object.keys(_threads).includes(String(pid))) {
    return newPID();
  } else {
    return String(pid);
  }
}

function addIIDtoThread(iid, pid) {
  try {
    _thread[String(pid)].iid.push(String(iid));
    return true;
  } catch {
    return false;
  }
}

function instantiatePID(processname, pid=newPID()) {
  _threads[String(pid)] = threadConstructor(String(pid), processname);
  return String(pid);
}

function openApp(appID, pid=newPID()) {
  instantiatePID(appID, String(pid));
}


/* Add thread-related commands */
cmd_kill = function(args) {
  
}

cmd_pgrep = function(args) {
  
}