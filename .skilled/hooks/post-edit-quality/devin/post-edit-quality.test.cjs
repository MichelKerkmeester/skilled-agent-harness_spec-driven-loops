// Tests for the Devin PostToolUse quality-hook adapter.
//
// Every case builds a throwaway project tree so the hook's project-root
// resolution and checker dispatch run against a fixture, never this repo: the
// hook derives the checker path from the payload's cwd and the shared router
// table, so a temp root carrying the stub checker is what makes the envelope
// it emits observable at all.
//
// Devin's file-write tool is named `write`, so the adapter must treat `write`
// alongside `edit` as an edit event, or a write escapes quality checking
// entirely. The `write` case pins that contract; `edit` is the positive
// control; `read` is the negative control that must stay silent.

'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');
const { test } = require('node:test');

const HOOK_PATH = join(__dirname, 'post-edit-quality.cjs');

// Repo-relative path the shared dispatch table resolves for an in-scope source
// file; mirrored here so the fixture mirrors the layout the table expects.
const CHECKER_RELATIVE_PATH = join(
  '.skilled',
  'skills',
  'sk-code',
  'sk-code-quality',
  'scripts',
  'check-comment-hygiene.sh',
);

// An enabled hook is the precondition for every assertion below, and any of
// these switches would make the hook a silent no-op -- turning the cases into
// false negatives. The child therefore gets a sanitized environment: the
// disable names are dropped, and the operator config is pointed at a path that
// does not exist so a persisted switch cannot leak in either.
const DISABLE_ENV_KEYS = [
  'SYSTEM_HOOKS_DISABLED',
  'MK_HOOKS_DISABLED',
  'SK_CODE_POST_EDIT_QUALITY_DISABLED',
  'MK_POST_EDIT_QUALITY_DISABLED',
];

function makeFixtureProject() {
  const projectDir = mkdtempSync(join(tmpdir(), 'devin-post-edit-quality-'));

  mkdirSync(join(projectDir, 'src'), { recursive: true });
  writeFileSync(join(projectDir, 'src', 'app.js'), '// app\nmodule.exports = {};\n', 'utf8');

  // Stub checker: always reports one violation and exits 1, which is the
  // exit-plus-stdout surface convention the router treats as a finding. Its
  // argv and cwd are irrelevant -- the output is fixed so assertions can name
  // the exact text without depending on the real checker's rules.
  const checkerPath = join(projectDir, CHECKER_RELATIVE_PATH);
  mkdirSync(dirname(checkerPath), { recursive: true });
  writeFileSync(checkerPath, '#!/bin/sh\nprintf "src/app.js:1 x\\n"\nexit 1\n', 'utf8');
  chmodSync(checkerPath, 0o755);

  return projectDir;
}

function runHook(projectDir, toolName) {
  const payload = {
    tool_name: toolName,
    cwd: projectDir,
    tool_input: { file_path: 'src/app.js' },
  };

  const env = { ...process.env };
  for (const key of DISABLE_ENV_KEYS) delete env[key];
  env.HOOK_FLAGS_CONFIG = join(projectDir, 'hook-flags.env.missing');

  return spawnSync(process.execPath, [HOOK_PATH], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    cwd: projectDir,
    env,
    timeout: 20000,
  });
}

// A clean edit produces no output at all, so absent or unparsable stdout means
// "no advisory" -- mirroring the hook's fail-open contract instead of making
// the test brittle against an empty stream.
function additionalContext(stdout) {
  if (!stdout.trim()) return '';
  try {
    const parsed = JSON.parse(stdout);
    return (parsed && parsed.hookSpecificOutput && parsed.hookSpecificOutput.additionalContext) || '';
  } catch {
    return '';
  }
}

test('write payload reaches post-edit quality', (t) => {
  const projectDir = makeFixtureProject();
  t.after(() => rmSync(projectDir, { recursive: true, force: true }));

  const result = runHook(projectDir, 'write');

  assert.equal(result.status, 0, `hook must stay fail-open; stderr: ${result.stderr}`);
  const context = additionalContext(result.stdout);
  assert.ok(
    context.includes('COMMENT HYGIENE WARNING'),
    `a write event must surface the checker finding; stdout was: ${JSON.stringify(result.stdout)}`,
  );
});

test('edit payload reaches post-edit quality', (t) => {
  const projectDir = makeFixtureProject();
  t.after(() => rmSync(projectDir, { recursive: true, force: true }));

  const result = runHook(projectDir, 'edit');

  assert.equal(result.status, 0, `hook must stay fail-open; stderr: ${result.stderr}`);
  const context = additionalContext(result.stdout);
  assert.ok(
    context.includes('COMMENT HYGIENE WARNING'),
    `an edit event must surface the checker finding; stdout was: ${JSON.stringify(result.stdout)}`,
  );
});

test('read payload is not an edit event', (t) => {
  const projectDir = makeFixtureProject();
  t.after(() => rmSync(projectDir, { recursive: true, force: true }));

  const result = runHook(projectDir, 'read');

  assert.equal(result.status, 0, `hook must stay fail-open; stderr: ${result.stderr}`);
  const context = additionalContext(result.stdout);
  assert.ok(
    !context.includes('COMMENT HYGIENE WARNING'),
    `a read must not carry an edit advisory; stdout was: ${JSON.stringify(result.stdout)}`,
  );
  assert.ok(!result.stdout.includes('COMMENT HYGIENE WARNING'), 'raw stdout must stay free of the edit advisory');
});
