// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Adapter Tests - Git Message Gate (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers the shared message contract on fixture repositories and the gate's
// split policy: open on an unexpected error, closed on a contract error.

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { ContractError } from '../../../skills/sk-git/scripts/lib/message-contract.mjs';
import { ERROR_POLICY as gitGatePolicy, registerGitMessageGate } from '../dsh/git-message-gate.mjs';
import { adapterHarness, cleanup, tempDir } from '../../shared/tests/dsh-plugin-harness.mjs';

test('git message gate applies the shared contract to fixture repositories', async () => {
  assert.equal(gitGatePolicy, 'fail-open');
  const directory = tempDir();
  try {
    const contractDir = fileURLToPath(new URL(
      '../../../skills/sk-git/assets',
      import.meta.url,
    ));
    execFileSync('git', ['-C', directory, 'init', '-q'], { stdio: 'ignore' });
    execFileSync('git', ['-C', directory, 'config', 'skgit.contractDir', contractDir], { stdio: 'ignore' });

    const { ctx, handlers } = adapterHarness();
    registerGitMessageGate(ctx, { cwd: directory });
    let delegated = false;
    const invalid = await handlers.get('tools/pre-execute')({
      name: 'bash', arguments: { command: 'git commit -m "update stuff"' },
    }, async () => { delegated = true; return { kind: 'allow' }; });
    assert.equal(invalid.kind, 'deny');
    assert.match(invalid.reason, /subject\.format/);
    assert.equal(delegated, false);

    const valid = await handlers.get('tools/pre-execute')({
      name: 'bash',
      arguments: { command: 'git commit -m "feat(sk-git): add a thing" -m "Explains why."' },
    }, async () => ({ kind: 'allow' }));
    assert.equal(valid.kind, 'allow');
  } finally {
    cleanup(directory);
  }
});

test('git message gate logs unexpected core errors and fails closed on contract errors', async () => {
  const { ctx, handlers, logs } = adapterHarness();
  registerGitMessageGate(ctx, {
    core: { evaluateCommand() { throw new Error('fixture failure'); } },
    cwd: '/fixture/workspace',
  });
  let delegated = false;
  const call = { name: 'bash', arguments: { command: 'git commit -m "update stuff"' } };
  const result = await handlers.get('tools/pre-execute')(call, async () => {
    delegated = true;
    return { kind: 'allow' };
  });
  assert.equal(result.kind, 'allow');
  assert.equal(delegated, true);
  assert.equal(logs.length, 1);

  const second = adapterHarness();
  registerGitMessageGate(second.ctx, {
    core: { evaluateCommand() { throw new ContractError('fixture contract unavailable'); } },
    cwd: '/fixture/workspace',
  });
  let contractDelegated = false;
  const blocked = await second.handlers.get('tools/pre-execute')(call, async () => {
    contractDelegated = true;
    return { kind: 'allow' };
  });
  assert.equal(blocked.kind, 'deny');
  assert.match(blocked.reason, /contract could not be read/);
  assert.equal(contractDelegated, false);
  assert.equal(second.logs.length, 1);
});
