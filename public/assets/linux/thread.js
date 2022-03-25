var _threads = {};

function killThread(pid) {
  return _threads[pid].kill();
}

function threadConstructor(process, pid) {
  return {
    process,
    pid,
    kill: function() {
      
    },
  };
}

