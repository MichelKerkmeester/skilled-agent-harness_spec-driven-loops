// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Prompts Mirror Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// The prompts mirror flattens `.skilled/commands` paths into one level, so two
// commands can flatten to the same prompt name. A collision must fail the run
// before anything is written, and a prompt whose source is gone must be pruned
// instead of outliving it.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../..');
const GENERATOR = join(
  REPO_ROOT,
  '.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-prompts-vibe.cjs',
);

/**
 * Builds an empty command source and prompt output tree for one run.
 * @returns {{root: string, source: string, output: string}} The fixture paths.
 */
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'vibe-prompts-'));
  const source = join(root, 'commands');
  const output = join(root, 'out');
  mkdirSync(source, { recursive: true });
  return { root, source, output };
}

/**
 * Writes one canonical command file, creating its folders.
 * @param {string} source - The command source folder.
 * @param {string} relativePath - The command path below the source root.
 * @param {string} contents - The command file contents.
 */
function writeCommand(source, relativePath, contents) {
  const commandPath = join(source, relativePath);
  mkdirSync(dirname(commandPath), { recursive: true });
  writeFileSync(commandPath, contents);
}

/**
 * Runs the generator against one fixture.
 * @param {{root: string, source: string, output: string}} env - The fixture.
 * @param {string[]} args - Extra arguments, such as --check.
 * @returns {import('node:child_process').SpawnSyncReturns<string>} The run.
 */
function run(env, args = []) {
  const result = spawnSync(process.execPath, [GENERATOR, ...args], {
    cwd: env.root,
    encoding: 'utf8',
    env: {
      ...process.env,
      VIBE_COMMANDS_SOURCE_DIR: env.source,
      VIBE_PROMPTS_OUTPUT_DIR: env.output,
    },
  });
  if (result.error) throw result.error;
  return result;
}

test('writes flat prompt stubs that point to canonical commands and end at User request', () => {
  const env = fixture();
  try {
    writeCommand(env.source, 'tools/audit.md', '# Audit\n');
    writeCommand(env.source, 'reformat.md', '# Reformat\n');

    const generated = run(env);
    assert.equal(generated.status, 0, generated.stderr);
    assert.match(generated.stdout, /Wrote 2 of 2 prompts/);

    const audit = readFileSync(join(env.output, 'tools-audit.md'), 'utf8');
    assert.match(audit, /\.skilled\/commands\/tools\/audit\.md/);
    assert.match(audit, /Read that file in full and follow its instructions/);
    assert.ok(audit.endsWith('User request:\n'));

    const checked = run(env, ['--check']);
    assert.equal(checked.status, 0, checked.stderr);
    assert.match(checked.stdout, /PASS: 2 prompt stubs are in sync/);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('fails without writing when two commands flatten to the same prompt name', () => {
  const env = fixture();
  try {
    writeCommand(env.source, 'tools/audit.md', '# Audit\n');
    writeCommand(env.source, 'tools-audit.md', '# Audit again\n');

    const generated = run(env);
    const output = generated.stdout + generated.stderr;
    assert.equal(generated.status, 1);
    assert.match(output, /flattened command name "tools-audit\.md" collides/);
    assert.ok(output.includes('tools/audit.md'), output);
    assert.ok(output.includes('tools-audit.md'), output);
    assert.equal(existsSync(env.output), false);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('reserves README, contract, asset, script, and fixture files from the prompt tree', () => {
  const env = fixture();
  try {
    writeCommand(env.source, 'README.md', '# Command index\n');
    writeCommand(env.source, 'tools/README.md', '# Nested index\n');
    writeCommand(env.source, 'nested/contract.contract.md', '# Contract\n');
    writeCommand(env.source, 'assets/template.md', '# Template\n');
    writeCommand(env.source, 'scripts/helper.md', '# Helper\n');
    writeCommand(env.source, 'fixtures/example.md', '# Fixture\n');
    writeCommand(env.source, 'nested/real.md', '# Real\n');

    const generated = run(env);
    assert.equal(generated.status, 0, generated.stderr);
    assert.equal(existsSync(join(env.output, 'README.md')), false);
    assert.equal(existsSync(join(env.output, 'nested-contract.md')), false);
    assert.equal(existsSync(join(env.output, 'assets-template.md')), false);
    assert.equal(existsSync(join(env.output, 'scripts-helper.md')), false);
    assert.equal(existsSync(join(env.output, 'fixtures-example.md')), false);
    assert.equal(existsSync(join(env.output, 'nested-real.md')), true);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('--check reports a missing, stale, or sourceless prompt without repairing it', () => {
  const env = fixture();
  try {
    writeCommand(env.source, 'tools/audit.md', '# Audit\n');
    writeCommand(env.source, 'reformat.md', '# Reformat\n');
    assert.equal(run(env).status, 0);

    const missing = join(env.output, 'tools-audit.md');
    const stale = join(env.output, 'reformat.md');
    const extra = join(env.output, 'retired.md');
    unlinkSync(missing);
    writeFileSync(stale, 'stale\n');
    writeFileSync(extra, 'sourceless\n');

    const checked = run(env, ['--check']);
    const output = checked.stdout + checked.stderr;
    assert.equal(checked.status, 1);
    assert.match(output, /MISSING .*tools-audit\.md/);
    assert.match(output, /STALE .*reformat\.md/);
    assert.match(output, /EXTRA .*retired\.md/);
    assert.equal(existsSync(missing), false);
    assert.equal(readFileSync(stale, 'utf8'), 'stale\n');
    assert.equal(readFileSync(extra, 'utf8'), 'sourceless\n');
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('prunes a sourceless prompt and leaves dotfiles and linked prompts alone', () => {
  const env = fixture();
  try {
    writeCommand(env.source, 'tools/audit.md', '# Audit\n');
    mkdirSync(env.output, { recursive: true });
    writeFileSync(join(env.output, 'retired.md'), 'sourceless\n');
    writeFileSync(join(env.output, '.DS_Store'), '');
    const privatePrompt = join(env.root, 'private-prompt.md');
    writeFileSync(privatePrompt, 'operator-owned\n');
    symlinkSync(privatePrompt, join(env.output, 'private.md'));

    const generated = run(env);
    assert.equal(generated.status, 0, generated.stderr);
    assert.match(generated.stdout, /pruned 1/);
    assert.equal(existsSync(join(env.output, 'retired.md')), false);
    assert.equal(existsSync(join(env.output, '.DS_Store')), true);
    assert.equal(lstatSync(join(env.output, 'private.md')).isSymbolicLink(), true);

    const checked = run(env, ['--check']);
    assert.equal(checked.status, 0, checked.stderr);
    assert.equal(checked.stderr.includes('.DS_Store'), false);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});
