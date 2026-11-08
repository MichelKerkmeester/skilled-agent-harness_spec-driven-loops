// ───────────────────────────────────────────────────────────────────
// MODULE: Sync DSH Prompts - generator tests
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const SCRIPT = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'dsh',
  'sync-prompts-dsh.cjs',
);

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'dsh-prompts-'));
  const source = join(root, 'commands');
  const output = join(root, 'out');
  mkdirSync(source, { recursive: true });
  return { root, source, output };
}

function writeCommand(source, relativePath, contents) {
  const commandPath = join(source, relativePath);
  mkdirSync(dirname(commandPath), { recursive: true });
  writeFileSync(commandPath, contents);
}

function run(env, args = []) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: env.root,
    encoding: 'utf8',
    env: {
      ...process.env,
      DSH_COMMANDS_SOURCE_DIR: env.source,
      DSH_PROMPTS_OUTPUT_DIR: env.output,
    },
  });
  if (result.error) throw result.error;
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

test('writes flat prompt stubs that point to canonical commands and end at User request', () => {
  const env = fixture();
  try {
    writeCommand(env.source, 'tools/audit.md', '# Audit\n');
    writeCommand(env.source, 'reformat.md', '# Reformat\n');
    writeCommand(env.source, 'README.md', '# Command index\n');
    writeCommand(env.source, 'nested/README.md', '# Nested index\n');
    writeCommand(env.source, 'nested/contract.contract.md', '# Contract\n');
    writeCommand(env.source, 'assets/template.md', '# Template\n');
    writeCommand(env.source, 'scripts/helper.md', '# Helper\n');
    writeCommand(env.source, 'fixtures/example.md', '# Fixture\n');

    const result = run(env);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Wrote 2 of 2 prompts/);

    const audit = readFileSync(join(env.output, 'tools-audit.md'), 'utf8');
    assert.match(audit, /\.skilled\/commands\/tools\/audit\.md/);
    assert.match(audit, /Read that file in full and follow its instructions/);
    assert.ok(audit.endsWith('User request:\n'));
    assert.equal(audit.includes('$ARGUMENTS'), false);
    assert.equal(readFileSync(join(env.output, 'reformat.md'), 'utf8').endsWith('User request:\n'), true);
    assert.equal(existsSync(join(env.output, 'README.md')), false);
    assert.equal(existsSync(join(env.output, 'nested-contract.md')), false);
    assert.equal(existsSync(join(env.output, 'assets-template.md')), false);

    const check = run(env, ['--check']);
    assert.equal(check.status, 0, check.stderr);
    assert.match(check.stdout, /PASS: 2 prompt stubs are in sync/);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('--check reports missing, stale, and extra prompts without writing', () => {
  const env = fixture();
  try {
    writeCommand(env.source, 'tools/audit.md', '# Audit\n');
    writeCommand(env.source, 'reformat.md', '# Reformat\n');
    assert.equal(run(env).status, 0);

    const missing = join(env.output, 'tools-audit.md');
    const stale = join(env.output, 'reformat.md');
    const extra = join(env.output, 'extra.md');
    rmSync(missing);
    writeFileSync(stale, 'stale\n');
    writeFileSync(extra, 'extra\n');

    const check = run(env, ['--check']);
    const output = check.stdout + check.stderr;
    assert.equal(check.status, 1);
    assert.match(output, /MISSING .*tools-audit\.md/);
    assert.match(output, /STALE .*reformat\.md/);
    assert.match(output, /EXTRA .*extra\.md/);
    assert.equal(existsSync(missing), false);
    assert.equal(readFileSync(stale, 'utf8'), 'stale\n');
    assert.equal(readFileSync(extra, 'utf8'), 'extra\n');

    const repaired = run(env);
    assert.equal(repaired.status, 0, repaired.stderr);
    assert.equal(existsSync(extra), false);
    assert.equal(run(env, ['--check']).status, 0);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

// A linked worktree reaches the operator's private command, and that command's
// prompt, through links to the primary checkout. Neither link is this repository's
// output, so the check must not report the prompt as extra or prune it.
test('leaves a linked private prompt alone when its command is linked too', () => {
  const env = fixture();
  try {
    writeCommand(env.source, 'tools/audit.md', '# Audit\n');
    const primary = join(env.root, 'primary');
    mkdirSync(primary, { recursive: true });
    writeFileSync(join(primary, 'local-private.md'), '# Private\n');
    writeFileSync(join(primary, 'local-private-prompt.md'), 'private prompt\n');
    symlinkSync(join(primary, 'local-private.md'), join(env.source, 'local-private.md'));
    assert.equal(run(env).status, 0);
    const linkedPrompt = join(env.output, 'local-private.md');
    symlinkSync(join(primary, 'local-private-prompt.md'), linkedPrompt);

    const check = run(env, ['--check']);
    assert.equal(check.status, 0, check.stdout + check.stderr);

    assert.equal(run(env).status, 0);
    assert.equal(lstatSync(linkedPrompt).isSymbolicLink(), true);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});
