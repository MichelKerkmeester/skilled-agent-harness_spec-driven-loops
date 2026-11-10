'use strict';
// Compiles module source in memory under a real file name, so its relative requires
// resolve exactly as the file on disk would, without writing a patched copy.
const Module = require('node:module');
const path = require('node:path');

function loadFromSource(source, filename) {
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod._compile(source, filename);
  return mod.exports;
}

module.exports = { loadFromSource };
