// ───────────────────────────────────────────────────────────────────
// MODULE: Continuation Log Test Helpers
// ───────────────────────────────────────────────────────────────────
'use strict';

const { readFile } = require('node:fs/promises');
const { join } = require('node:path');

/**
 * Read and parse the continuation log written under a state directory.
 * A missing log is an empty history, not an error.
 *
 * @param {string} stateDir - Directory holding `.continuation.log`.
 * @returns {Promise<Array<object>>} Parsed log entries, oldest first.
 */
async function readContinuationEntries(stateDir) {
  try {
    const raw = await readFile(join(stateDir, '.continuation.log'), 'utf8');
    return raw.trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

/**
 * Put an environment variable back to a captured prior value.
 * An undefined prior value means the variable was absent, so it is deleted.
 *
 * @param {string} name - Environment variable name.
 * @param {string|undefined} value - Captured prior value.
 * @returns {void}
 */
function restoreEnv(name, value) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }
  process.env[name] = value;
}

module.exports = {
  readContinuationEntries,
  restoreEnv,
};
