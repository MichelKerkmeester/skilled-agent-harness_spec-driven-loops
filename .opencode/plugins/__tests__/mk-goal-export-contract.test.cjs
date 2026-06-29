// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-goal Export Contract Tests                               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the OpenCode plugin loader export shape.                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');

async function main() {
  const pluginUrl = pathToFileURL(join(__dirname, '..', 'mk-goal.js')).href;
  const pluginModule = await import(pluginUrl);

  assert.deepEqual(Object.keys(pluginModule), ['default']);
  assert.equal(typeof pluginModule.default, 'function');
  assert.ok(pluginModule.default.__test);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
