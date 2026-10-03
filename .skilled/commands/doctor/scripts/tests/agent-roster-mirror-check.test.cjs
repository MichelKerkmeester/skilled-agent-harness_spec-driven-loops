#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Roster Mirror Check Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the roster checker as a process against throwaway roots holding the
// canonical Claude tree plus every runtime mirror, real symlinks included.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'agent-roster-mirror-check.cjs');
const AGENTS = ['alpha', 'beta'];

const roots = [];

function writeFile(abs, body) {
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, body);
}

function link(target, abs) {
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.symlinkSync(target, abs);
}

// A root where every surface mirrors the canonical roster the way the real
// tree does: relative symlinks for Cursor and Devin, native files elsewhere.
function buildRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-roster-mirror-'));
  roots.push(root);
  for (const name of AGENTS) {
    writeFile(path.join(root, '.claude/agents', `${name}.md`), `# ${name}\n`);
    link(`../../.claude/agents/${name}.md`, path.join(root, '.cursor/agents', `${name}.md`));
    link(`../../../.claude/agents/${name}.md`, path.join(root, '.devin/agents', name, 'AGENT.md'));
    writeFile(path.join(root, '.skilled/agents', `${name}.md`), `# ${name}\n`);
    writeFile(path.join(root, '.codex/agents', `${name}.toml`), `name = "${name}"\n`);
    writeFile(path.join(root, '.pi/agents', `${name}.md`), `# ${name}\n`);
  }
  return root;
}

function run(args) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

test.after(() => {
  for (const root of roots) fs.rmSync(root, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. HAPPY PATH, DRIFT AND ERROR PATH
// ─────────────────────────────────────────────────────────────────────────────

test('a root whose surfaces all mirror the roster passes', () => {
  const { status, out } = run(['--root', buildRoot()]);
  assert.equal(status, 0, out);
  assert.match(out, /canonical: \.claude\/agents \(2 agents\)/);
  assert.match(out, /STATUS=OK agent-roster-mirror/);
});

test('an authored surface missing an agent is drift', () => {
  const root = buildRoot();
  fs.rmSync(path.join(root, '.codex/agents/beta.toml'));
  const { status, out } = run(['--root', root]);
  assert.equal(status, 1, out);
  assert.match(out, /beta \(missing\)/);
  assert.match(out, /STATUS=DRIFT agent-roster-mirror/);
});

test('a real file where a symlink belongs is drift', () => {
  const root = buildRoot();
  const abs = path.join(root, '.cursor/agents/alpha.md');
  fs.rmSync(abs);
  writeFile(abs, '# forked\n');
  const { status, out } = run(['--root', root]);
  assert.equal(status, 1, out);
  assert.match(out, /alpha \(not a symlink/);
});

test('a missing canonical directory is a checker error, exit 2', () => {
  const root = buildRoot();
  fs.rmSync(path.join(root, '.claude'), { recursive: true });
  const { status, out } = run(['--root', root]);
  assert.equal(status, 2, out);
  assert.match(out, /STATUS=ERROR agent-roster-mirror/);
});

test('an unknown argument is a checker error with usage', () => {
  const { status, out } = run(['--bogus']);
  assert.equal(status, 2, out);
  assert.match(out, /Usage: agent-roster-mirror-check\.cjs/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. REGRESSIONS
// ─────────────────────────────────────────────────────────────────────────────

test('a broken symlink directly under the devin tree is reported, not a crash', () => {
  const root = buildRoot();
  link('../../nowhere', path.join(root, '.devin/agents/ghost'));
  const { status, out } = run(['--root', root]);
  assert.equal(status, 1, out);
  assert.match(out, /ghost \(broken symlink\)/);
  assert.match(out, /STATUS=DRIFT agent-roster-mirror/);
});

test('a README beside the authored agents is not an orphan', () => {
  const root = buildRoot();
  writeFile(path.join(root, '.skilled/agents/README.md'), '# Agents\n');
  const { status, out } = run(['--root', root]);
  assert.equal(status, 0, out);
});

test('an unexpected throw is a checker error with exit 2 and a STATUS line', () => {
  const root = buildRoot();
  // A file where a mirror directory belongs makes the orphan scan throw.
  fs.rmSync(path.join(root, '.pi/agents'), { recursive: true });
  writeFile(path.join(root, '.pi/agents'), 'not a directory\n');
  const { status, out } = run(['--root', root]);
  assert.equal(status, 2, out);
  assert.match(out, /STATUS=ERROR agent-roster-mirror/);
});
