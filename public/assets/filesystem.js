/* .promisify from node module `util` */
var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}


//import util from 'util'
//import * as fs from 'fs';
//const util = import('/assets/lib/util.js');
const fs = BrowserFS.BFSRequire('fs');
const fsPromises = fs.promises;

BrowserFS.install(window);
BrowserFS.configure({
  fs: "IndexedDB",
  options: {
    "/tmp": { fs: "InMemory" },
  },
}, function(e) {
  if (e) {
    // An error happened!
    throw e;
  }
  // Otherwise, BrowserFS is ready-to-use!
});



// Synchronous functions for FileIO
function FSWriteSync(dir, value, callback=function(err){}) {
  fs.writeFile(dir, value, callback);
}

function FSReadSync(dir, callback=function(err, value){}) {
  fs.readFile(dir, callback);
}


// Asynchronous functions for FileIO
async function FSWrite(dir, value) {
  return await promisify(fs.writeFile)(dir, value);
}

async function FSRead(dir) {
  return await promisify(fs.readFile)(dir); 
}

/*
window.FSWrite = FSWrite;
window.FSRead  = FSRead;
*/


/* ===== Initiate FS ===== */
fs.mkdir("/bin");
fs.mkdir("/usr");
fs.mkdir("/usr/bin");
fs.mkdir("/home");
fs.mkdir("/home/user");