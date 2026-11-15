// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Killer Spawn Recorder
// ───────────────────────────────────────────────────────────────────
'use strict';

const fs = require('node:fs');
const childProcess = require('node:child_process');
const { syncBuiltinESMExports } = require('node:module');

const originalSpawn = childProcess.spawn;
childProcess.spawn = function (command, args = [], options = {}) {
  if (typeof args[0] === 'string' && args[0].endsWith('killer.cjs')) {
    fs.writeFileSync(
      process.env.CODEX_KILLER_ARGS_FILE,
      JSON.stringify({ command, args, options }),
    );
    return { unref() { return this; } };
  }
  return originalSpawn.call(this, command, args, options);
};

syncBuiltinESMExports();
