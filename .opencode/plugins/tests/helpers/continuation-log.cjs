'use strict';

const { readFile } = require('node:fs/promises');
const { join } = require('node:path');

async function readContinuationEntries(stateDir) {
  try {
    const raw = await readFile(join(stateDir, '.continuation.log'), 'utf8');
    return raw.trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

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
