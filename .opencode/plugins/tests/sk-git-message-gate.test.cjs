// ───────────────────────────────────────────────────────────────────
// MODULE: sk-git Message Contract Gate Plugin Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Pins the OpenCode transport over the shared message-contract gate against throwaway
// repositories: a refusal must surface as a thrown error the model reads, while a conforming
// command, a non-bash tool and a repository without a contract all pass untouched.

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const PLUGIN = path.join(__dirname, '..', 'sk-git-message-gate.js');
const COMMIT_TEMPLATE = path.join(__dirname, '..', '..', 'skills', 'sk-git', 'assets', 'commit-message-template.md');

function makeRepo(template) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-git-message-gate-'));
  execFileSync('git', ['init', '-q', dir]);
  if (template !== null) {
    fs.mkdirSync(path.join(dir, '.sk-git'));
    fs.writeFileSync(path.join(dir, '.sk-git', 'commit-message-template.md'), template);
  }
  return dir;
}

async function hooksFor(dir) {
  const plugin = await import(pathToFileURL(PLUGIN).href);
  return plugin.default({ directory: dir });
}

function bash(command) {
  return [{ tool: 'bash' }, { args: { command } }];
}

test('the module exports only the plugin factory', async () => {
  const plugin = await import(pathToFileURL(PLUGIN).href);
  assert.deepEqual(Object.keys(plugin), ['default']);
});

test('a commit message that breaks the template is refused with its rule ids', async () => {
  const dir = makeRepo(fs.readFileSync(COMMIT_TEMPLATE, 'utf8'));
  const hooks = await hooksFor(dir);
  await assert.rejects(
    hooks['tool.execute.before'](...bash('git commit -m "Fixed stuff"')),
    (err) => err.message.startsWith('sk-git-message-gate:') && err.message.includes('[subject.format]'),
  );
  fs.rmSync(dir, { recursive: true, force: true });
});

test('a conforming commit and a non-bash tool pass untouched', async () => {
  const dir = makeRepo(fs.readFileSync(COMMIT_TEMPLATE, 'utf8'));
  const hooks = await hooksFor(dir);
  await hooks['tool.execute.before'](...bash('git commit -m "docs(readme): record the baseline" -m "A body that says why."'));
  await hooks['tool.execute.before']({ tool: 'read' }, { args: { command: 'git commit -m "Fixed stuff"' } });
  fs.rmSync(dir, { recursive: true, force: true });
});

test('a repository without a contract is not checked', async () => {
  const dir = makeRepo(null);
  const hooks = await hooksFor(dir);
  await hooks['tool.execute.before'](...bash('git commit -m "Fixed stuff"'));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('a broken rules block is refused rather than passed', async () => {
  const dir = makeRepo('# Commit\n\n## Enforced rules\n\n```json\n{ not json\n```\n');
  const hooks = await hooksFor(dir);
  await assert.rejects(
    hooks['tool.execute.before'](...bash('git commit -m "docs(readme): record the baseline" -m "A body."')),
    (err) => err.message.includes('rules cannot be read'),
  );
  fs.rmSync(dir, { recursive: true, force: true });
});
