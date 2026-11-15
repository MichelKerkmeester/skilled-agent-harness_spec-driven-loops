// ───────────────────────────────────────────────────────────────────
// MODULE: Session Handover History Lookup Entry Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const ENTRY_PATH = path.join(__dirname, '..', 'bin', 'history-lookup.mjs');
const OFFER_PATH = path.join(
  __dirname, '..', '..', '..', 'skills', 'system-spec-kit', 'runtime', 'dist',
  'hooks', 'lib', 'history', 'lookup-offer.js',
);
const ENTRY_RELATIVE_PATH = '.skilled/hooks/session-handover/bin/history-lookup.mjs';
const CORE_RELATIVE_PATH = '.skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js';

function writePlaceholder(root, relativePath) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, '');
}

function checkout(t, { withCore }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'history-lookup-entry-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, '.git'));
  writePlaceholder(root, ENTRY_RELATIVE_PATH);
  if (withCore) writePlaceholder(root, CORE_RELATIVE_PATH);
  return root;
}

async function loadLookupRunsFrom() {
  const offer = await import(pathToFileURL(OFFER_PATH).href);
  return offer.lookupRunsFrom;
}

test('the entry refuses an empty invocation with the CLI refusal code', () => {
  const result = spawnSync(process.execPath, [ENTRY_PATH], { encoding: 'utf8' });

  assert.equal(result.stdout, '{"ok":false,"code":"invalid_usage"}\n');
  assert.equal(result.status, 2);
});

test('the entry names a core that cannot load apart from bad arguments', (t) => {
  const root = checkout(t, { withCore: false });
  const entryCopy = path.join(root, ENTRY_RELATIVE_PATH);
  fs.copyFileSync(ENTRY_PATH, entryCopy);

  const result = spawnSync(process.execPath, [
    entryCopy, '--session', 'session-entry-00000001', '--handle', `hl1_${'0'.repeat(32)}`,
    'browse', '{}',
  ], { cwd: root, encoding: 'utf8' });

  assert.equal(result.stdout, '{"ok":false,"code":"core_unavailable"}\n');
  assert.equal(result.status, 2);
});

test('withholds the offer when the compiled core is missing', async (t) => {
  const root = checkout(t, { withCore: false });
  const lookupRunsFrom = await loadLookupRunsFrom();

  assert.equal(lookupRunsFrom(root), false);
});

test('offers the lookup when the entry and the compiled core both exist', async (t) => {
  const root = checkout(t, { withCore: true });
  const lookupRunsFrom = await loadLookupRunsFrom();

  assert.equal(lookupRunsFrom(root), true);
});
