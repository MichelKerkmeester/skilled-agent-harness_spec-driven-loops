// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Adapter Tests - Post Edit Quality (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers shared-core parity and the fail-open throw policy of the post-edit
// quality adapter on a written file.

import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import qualityCore from '../lib/post-edit-router.cjs';
import { ERROR_POLICY as qualityPolicy, registerPostEditQuality } from '../dsh/post-edit-quality.mjs';
import { accept, adapterHarness, cleanup, enabled, tempDir } from '../../shared/tests/dsh-plugin-harness.mjs';

test('parity: post-edit quality preserves an ordinary file result with no core findings', async () => {
  const directory = tempDir();
  const filePath = path.join(directory, 'notes.txt');
  writeFileSync(filePath, 'plain text');
  try {
    const entries = qualityCore.resolveDispatch(filePath, directory);
    const findings = qualityCore.runChecks(entries, qualityCore.CLAUDE_HOOK_BUDGET_MS, {
      perChildTimeoutMs: qualityCore.CLAUDE_CHECKER_TIMEOUT_MS,
      minCheckerMs: qualityCore.CLAUDE_MIN_CHECKER_MS,
    });
    const banner = qualityCore.runDistStalenessCheck(filePath, directory, {
      timeoutMs: qualityCore.CLAUDE_CHECKER_TIMEOUT_MS,
    });
    assert.deepEqual(findings, []);
    assert.equal(banner, null);

    const { ctx, handlers } = adapterHarness();
    registerPostEditQuality(ctx, { core: qualityCore, isEnabled: enabled, cwd: directory });
    const result = await handlers.get('tools/post-execute')(
      { name: 'write', arguments: { file_path: 'notes.txt' } },
      { content: [{ type: 'text', text: 'written' }] },
      async () => ({ kind: 'accept', content: [{ type: 'text', text: 'written' }] }),
    );
    assert.deepEqual(result.content, [{ type: 'text', text: 'written' }]);
  } finally {
    cleanup(directory);
  }
});

test('throw policy: post-edit quality fails open and logs when its core throws', async () => {
  assert.equal(qualityPolicy, 'fail-open');
  const directory = tempDir();
  writeFileSync(path.join(directory, 'notes.txt'), 'plain text');
  try {
    const { ctx, handlers, logs } = adapterHarness();
    registerPostEditQuality(ctx, {
      core: { resolveDispatch() { throw new Error('fixture failure'); } },
      isEnabled: enabled,
      cwd: directory,
    });
    const result = await handlers.get('tools/post-execute')(
      { name: 'write', arguments: { file_path: 'notes.txt' } }, { content: [] }, accept,
    );
    assert.equal(result.kind, 'accept');
    assert.equal(logs.length, 1);
  } finally {
    cleanup(directory);
  }
});
