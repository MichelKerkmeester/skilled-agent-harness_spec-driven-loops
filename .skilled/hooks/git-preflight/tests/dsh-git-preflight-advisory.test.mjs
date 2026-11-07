// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Adapter Tests - Git Preflight Advisory (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers the advisory context the git preflight adapter attaches and its
// fail-open throw policy.

import assert from 'node:assert/strict';
import test from 'node:test';

import { ERROR_POLICY as gitAdvisoryPolicy, registerGitPreflightAdvisory } from '../dsh/git-preflight-advisory.mjs';
import { accept, adapterHarness, enabled } from '../../shared/tests/dsh-plugin-harness.mjs';

test('git preflight attaches advisory context without changing the tool result', async () => {
  const { ctx, handlers } = adapterHarness();
  registerGitPreflightAdvisory(ctx, {
    core: {
      GIT_SHAPE: /git/,
      GIT_CHECKS: { fixture: true },
      readHardRules: () => [{ id: 'fixture-rule', check: 'fixture' }],
      createGitContext: () => ({ isRepo: () => true }),
      evaluate: () => [{ id: 'fixture-rule', message: 'Check this command.' }],
    },
    isEnabled: enabled,
    env: {},
    createNotice: async (text) => ({ role: 'user', content: [{ type: 'text', text }] }),
  });
  const result = await handlers.get('tools/post-execute')(
    { name: 'bash', arguments: { command: 'git checkout -b feature/x' } },
    { content: [] },
    accept,
  );
  assert.equal(result.kind, 'accept');
  assert.equal(result.additionalContexts[0].content[0].text.includes('fixture-rule'), true);
});

test('git preflight logs and continues when its core throws', async () => {
  assert.equal(gitAdvisoryPolicy, 'fail-open');
  const { ctx, handlers, logs } = adapterHarness();
  registerGitPreflightAdvisory(ctx, {
    core: {
      GIT_SHAPE: /git/,
      GIT_CHECKS: { fixture: true },
      readHardRules: () => [{ id: 'fixture-rule', check: 'fixture' }],
      createGitContext: () => ({ isRepo: () => true }),
      evaluate() { throw new Error('fixture failure'); },
    },
    isEnabled: enabled,
    env: {},
  });
  const result = await handlers.get('tools/post-execute')(
    { name: 'bash', arguments: { command: 'git checkout -b feature/x' } },
    { content: [] },
    accept,
  );
  assert.equal(result.kind, 'accept');
  assert.equal(result.additionalContexts, undefined);
  assert.equal(logs.length, 1);
});
