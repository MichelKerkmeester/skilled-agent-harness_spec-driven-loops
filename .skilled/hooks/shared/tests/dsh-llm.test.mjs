// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Shared Tests - LLM Loader (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers the anchored loader resolving the harness packages from the dsh
// binary, and a bad anchor leaving the cache clean. Skips when dsh is absent.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

test('the dsh-llm loader resolves from the dsh binary, and a bad anchor does not poison the cache', async (t) => {
  const which = spawnSync('sh', ['-c', 'command -v dsh'], { encoding: 'utf8' });
  if (which.status !== 0) {
    t.skip('dsh is not installed');
    return;
  }
  // A query string gives this test its own module instance, so no other test has filled the cache.
  const { loadDshLlm, loadDshTools } = await import('../dsh/dsh-llm.mjs?isolated');
  await assert.rejects(loadDshLlm(path.join(os.tmpdir(), 'no-such-dsh-entry.js')));
  const llm = await loadDshLlm(which.stdout.trim());
  assert.equal(typeof llm.createUserMessage, 'function');
  const tools = await loadDshTools(which.stdout.trim());
  assert.equal(typeof tools.defineTool, 'function');
});
