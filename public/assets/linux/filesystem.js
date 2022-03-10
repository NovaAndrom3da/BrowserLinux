function Folder(children={}) {
  return {
    type: "folder",
    children: children,
  };
}

function File(content="", encoding="utf-8", plaintext=true) {
  return {
    type: "file",
    content: content,
    encoding: encoding,
    plaintext: plaintext,
  };
}

function SpecialFolder(children={}) {
  return {
    type: "specialfolder",
    children: children,
  };
}

function MergeFolder(foldera, folderb) {
  if (foldera.type === folderb.type) {
    return Folder();
  } else {
    return {
      type: foldera.type,
      children: {
        ...foldera.children,
        ...folderb.children,
      },
    };
  }
}

function UserSkeleton() {
  return Folder({
    "Desktop": Folder(),
    "Downloads": Folder(),
    "Documents": Folder(),
    "Music": Folder(),
    "Videos": Folder(),
    ".config": Folder(),
    ".cache": Folder(),
    ".bashrc": File(),
  });
}

function FilesystemInit() {
  usr_bin_mergefolder = MergeFolder(SpecialFolder(window.usr_bin), SpecialFolder(window.silent_usr_bin));
  return {
    "/": Folder({
      // / START
      "bin": SpecialFolder(window.bin),
      "sbin": SpecialFolder(window.bin),
      "usr": Folder({
        // /usr START
        "bin": usr_bin_mergefolder,
        "sbin": usr_bin_mergefolder,
        "share": Folder(),
        "lib": Folder(),
        "local": Folder({
          // /usr/local START
          "bin": usr_bin_mergefolder,
          "sbin": usr_bin_mergefolder,
          "etc": Folder(),
          "games": Folder(),
          "include": Folder(),
          "lib": Folder(),
          "share": Folder(),
          // /usr/local END
        }),
        "include": Folder(),
        "lib": Folder(),
        "lib32": Folder(),
        "libexec": Folder(),
        "src": Folder(),
        // /usr END
      }),
      "opt": usr_bin_mergefolder,
      "dev": Folder(),
      "lib": Folder(),
      "lib32": Folder(),
      "lib64": Folder(),
      "mnt": Folder(),
      "proc": Folder(),
      "root": UserSkeleton(),
      "tmp": Folder(),
      "var": Folder(),
      "home": Folder({
        // /home START
        "user": UserSkeleton(),
        // /home END
      }),
      "etc": Folder({
        // /etc START
        
        // /etc END
      }),
      // / END
    }),
  };
}

Filesystem = FilesystemInit();

filesystem_db = indexedDB.open("filesystem");

filesystem_db.onupgradeneeded = function() {
  window.db = filesystem_db.result;
  window.storage = db.createObjectStore("fs", {keyPath: "rootfs"});
  window.storage.put(Filesystem);
}

filesystem_db.onsuccess = function() {
  window.db = filesystem_db.result;
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
      console.log("not found");
    }
  };
}