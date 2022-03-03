var tempfs = {
  "rootfs": "/",
  "/": {type: "folder", children: {
    "bin": {type: "folder", children: {}},
    "usr": {type: "folder", children: {}},
    "home": {type: "folder", children: {
      "user": {type: "folder", children: {
        "Desktop": {type: "folder", children: {}},
        "Downloads": {type: "folder", children: {}},
        "Documents": {type: "folder", children: {}},
        "Music": {type: "folder", children: {}}
      }}
    }}
  }}
}
filesystem = indexedDB.open("filesystem");

filesystem.onupgradeneeded = function() {
  window.db = filesystem.result;
  window.storage = db.createObjectStore("fs", {keyPath: "rootfs"});
  window.storage.put(tempfs);
}

filesystem.onsuccess = function() {
  window.db = filesystem.result;
}

setTimeout(function(){
  window.fstx = db.transaction("fs", "readwrite");
  window.storage = fstx.objectStore("fs");
}, 250);

function write() {
  storage.put({"fs": "fs", content: window.fs});
}


function read(directory) {
  const request = window.fsstorage.get("/");
  request.onsuccess = function() {
    const matching = request.result;
    if (matching !== undefined) {
      // A match was found.
      console.log(matching);
    } else {
      // No match was found.
      report(null);
    }
  };
}