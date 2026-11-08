// ───────────────────────────────────────────────────────────────────
// MODULE: Session Reader Declaration Tests
// ───────────────────────────────────────────────────────────────────
// TypeScript callers read the committed `.d.mts` beside each reader, so a reader
// change that leaves its declaration behind hides the new shape from them. The
// check rebuilds every declaration in a temporary copy and compares.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const SCRIPT = fileURLToPath(new URL('../../session-reader-declarations.mjs', import.meta.url));
const CANNOT_RUN = 3;

test('every committed reader declaration matches its source', (t) => {
  const result = spawnSync(process.execPath, [SCRIPT, '--check'], { encoding: 'utf8' });
  if (result.status === CANNOT_RUN) {
    t.skip('the TypeScript compiler is not installed');
    return;
  }
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
