import assert from 'node:assert/strict';
import { test } from 'node:test';

// The README says its configuration table is generated from the code; this
// test is what makes that sentence true on every run.
test('README configuration table matches the env reads in the code', async () => {
  const mod = await import('./scripts/env-reader-table.mjs');
  const result = mod.checkReadme();
  assert.equal(result.ok, true, `README table drifted. Expected:\n${result.expected}\nActual:\n${result.actual}`);
});
