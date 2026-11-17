// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Loop Wrapper Tests: One Repository Root Per Loop
// ───────────────────────────────────────────────────────────────────
'use strict';

// A looped session can run the hand-over CLI of a different checkout than the one whose
// wrapper started it. Every copy reads its notes from the root the wrapper exports, so the
// wrapper pins that root, and a note that still lands elsewhere is named with a command that
// can claim it.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  OPEN_NOTE, expectedClaudeManualCommand, createSandbox, installRuntimeStub, runWrapper,
  readRecords,
} = require('./skilled-loop-wrapper-harness.cjs');

const WRAPPER_ROOT = fs.realpathSync(path.resolve(__dirname, '..', '..', '..', '..'));

test('the wrapper exports its own real checkout root when the caller set none', (t) => {
  const sandbox = createSandbox(t);
  delete sandbox.env.SESSION_HANDOVER_REPO_ROOT;
  const { recordPath } = installRuntimeStub(sandbox);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const [record] = readRecords(recordPath);
  assert.equal(record.env.SESSION_HANDOVER_REPO_ROOT, WRAPPER_ROOT);
});

test('the wrapper keeps a repository root the caller exported', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const [record] = readRecords(recordPath);
  assert.equal(record.env.SESSION_HANDOVER_REPO_ROOT, sandbox.repoRoot);
});

// A wrapper started from a looped session's shell inherits that loop's root, which belongs
// to the outer wrapper's checkout and not to this one.
test('a wrapper started inside another loop pins its own root, not the inherited one', (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = '424242';
  const { recordPath } = installRuntimeStub(sandbox);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const [record] = readRecords(recordPath);
  assert.equal(record.env.SESSION_HANDOVER_REPO_ROOT, WRAPPER_ROOT);
});

test('a note outside the pinned root is named, with a claim command for its own root', (t) => {
  const sandbox = createSandbox(t);
  const otherRoot = path.join(sandbox.root, 'other-checkout');
  const outsideNote = path.join(
    otherRoot, '.skilled', 'skills', '.state', 'session-handover', 'handoffs', 'handoff.md',
  );
  fs.mkdirSync(path.dirname(outsideNote), { recursive: true });
  fs.writeFileSync(outsideNote, OPEN_NOTE);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1', HANDOFF_PATH: outsideNote });

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 1, result.stderr);
  assert.equal(readRecords(recordPath).length, 1);
  assert.doesNotMatch(result.stderr, /note is missing/);
  const warning = result.stderr.split('\n').find((line) => line.includes('outside'));
  assert.ok(warning, result.stderr);
  assert.ok(warning.includes(otherRoot), warning);
  assert.ok(warning.includes(sandbox.repoRoot), warning);
  assert.equal(
    result.stdout.split('\n').find((line) => line.includes('skilled-loop ')),
    `SESSION_HANDOVER_REPO_ROOT=${otherRoot} ${expectedClaudeManualCommand(outsideNote, '')}`,
  );
});
