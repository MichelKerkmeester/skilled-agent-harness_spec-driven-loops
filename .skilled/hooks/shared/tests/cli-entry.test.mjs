// ───────────────────────────────────────────────────────────────────
// MODULE: Shared Tests - CLI Entry Check (node --test)
// ───────────────────────────────────────────────────────────────────
//
// A hook started through a symlinked path must still see itself as the entry
// script, and a module that is only imported must not.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

const HELPER_URL = pathToFileURL(path.resolve(import.meta.dirname, '..', 'cli-entry.mjs')).href;

// A real folder holding an entry script and a module it imports, plus a symlink to the folder.
function makeScripts(t) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'cli-entry-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const real = path.join(root, 'real');
  mkdirSync(real);
  const probe = `import { isCliEntry } from '${HELPER_URL}';\n`;
  writeFileSync(path.join(real, 'imported.mjs'), `${probe}export const imported = isCliEntry(import.meta.url);\n`);
  writeFileSync(
    path.join(real, 'entry.mjs'),
    `${probe}import { imported } from './imported.mjs';\nconsole.log(JSON.stringify({ entry: isCliEntry(import.meta.url), imported }));\n`,
  );
  const link = path.join(root, 'link');
  symlinkSync(real, link);
  return { real, link };
}

function run(script) {
  const result = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test('a script run by its real path is the entry and its import is not', (t) => {
  const { real } = makeScripts(t);
  assert.deepEqual(run(path.join(real, 'entry.mjs')), { entry: true, imported: false });
});

test('a script run through a symlinked folder is still the entry', (t) => {
  const { link } = makeScripts(t);
  assert.deepEqual(run(path.join(link, 'entry.mjs')), { entry: true, imported: false });
});

test('no script argument is never the entry', async () => {
  const { isCliEntry } = await import(HELPER_URL);
  assert.equal(isCliEntry(HELPER_URL, undefined), false);
});
