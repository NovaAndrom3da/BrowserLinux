filesystem = indexedDB.open("filesystem");

filesystem.onupgradeneeded = function() {
  window.db = filesystem.result;
  const storage = db.createObjectStore("fs", {keyPath: "directory"});
  const fs_filename = storage.createIndex("by_filename", "filename");
  const fs_meta = storage.createIndex("by_meta", "meta");
  const fs_parentdir = storage.createIndex("by_parentdir", "parentdir");
  const fs_filetype = storage.createIndex("by_filetype", "filetype");
  const fs_content = storage.createIndex("by_content", "content");

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

function dirlist(directory) {
  index = storage.index("by_parentdir");
  request = index.openCursor(IDBKeyRange.only(directory));
  request.onsuccess = function() {
    cursor = request.result;
    if (cursor) {
      report(cursor.value.filename);
      cursor.continue();
    } else {
      report(null);
    }
  }
}

function read(directory) {
  
}