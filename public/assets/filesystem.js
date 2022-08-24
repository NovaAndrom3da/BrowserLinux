filesystem = indexedDB.open("filesystem");

filesystem.onupgradeneeded = function() {
  window.db = filesystem.result;
  const storage = db.createObjectStore("fs", {keyPath: "directory"});

//  storage.put({filename: "bin", parentdir: "/", filetype: "folder", directory: "/bin", content=bin});
//  storage.put({filename: "bin", parentdir: "/usr", filetype: "folder", directory: "/usr/bin", content=usr_bin});
}

filesystem.onsuccess = function() {
  window.db = filesystem.result;
}

setTimeout(function(){
  window.fstx = db.transaction("fs", "readwrite");
  window.storage = fstx.objectStore("fs");
}, 250);

function write(parentdir, filename, content, type="folder") {
  storage.put({filename: filename, parentdir: parentdir, filetype: type, directory: parentdir+"/"+filename, content: content});
}


function read(directory) {
  
}