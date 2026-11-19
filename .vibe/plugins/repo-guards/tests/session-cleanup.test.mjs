// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe session-cleanup Hook Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// The hook builds the OpenCode session-cleanup plugin's hooks and runs them at
// session start and end. Its guard turns any error into a silent allow, so a
// call to a plugin entry that no longer exists would skip every startup check
// and the end-of-session cleanup while the hook still exits 0. Running the hook
// starts the real guards, so these cases pin the contract instead: each method
// the hook calls on the plugin is a function the plugin really exposes.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const HOOK = join(HERE, '..', 'session-cleanup.mjs');
const PLUGIN = join(HERE, '../../../../.opencode/plugins/session-cleanup.js');

function calledEntries(source) {
  return [...source.matchAll(/sessionCleanupPlugin\.(\w+)\(/g)].map((match) => match[1]);
}

test('every plugin method the hook calls exists on the session-cleanup plugin', async () => {
  const { default: plugin } = await import(pathToFileURL(PLUGIN).href);
  const entries = calledEntries(readFileSync(HOOK, 'utf8'));

  assert.ok(entries.length > 0, 'the hook calls the plugin');
  for (const entry of entries) {
    assert.equal(typeof plugin[entry], 'function', `session-cleanup plugin has no ${entry}()`);
  }
});

test('the plugin factory builds the event and dispose hooks the hook runs', async () => {
  const { default: plugin } = await import(pathToFileURL(PLUGIN).href);
  const hooks = await plugin.factory({ worktree: HERE }, {
    spawn: () => ({ unref() {}, on() {} }),
    spawnSync: () => ({ status: 0, stdout: '', stderr: '' }),
  });

  assert.equal(typeof hooks.event, 'function');
  assert.equal(typeof hooks.dispose, 'function');
  assert.equal(typeof hooks['experimental.chat.system.transform'], 'function');
});
