// ───────────────────────────────────────────────────────────────────
// MODULE: Skip Fsync Preload
// ───────────────────────────────────────────────────────────────────

'use strict';

// Durable writes dominate this suite's run time, and no test can observe
// durability without a power loss. Tests keep every write and rename and skip
// only the flush to disk. Loaded with --require, so child processes skip it too.
const fs = require('node:fs');
const { syncBuiltinESMExports } = require('node:module');

fs.fsyncSync = () => {};
fs.fdatasyncSync = () => {};
syncBuiltinESMExports();
