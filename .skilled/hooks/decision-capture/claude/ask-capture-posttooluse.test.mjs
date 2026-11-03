// ───────────────────────────────────────────────────────────────────
// MODULE: Claude PostToolUse Decision Capture Tests
// ───────────────────────────────────────────────────────────────────
// The adapter runs as a child process on a recorded payload, so each case sees
// exactly what the hook leaves on disk when Claude Code calls it.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ADAPTER = join(HERE, 'ask-capture-posttooluse.mjs');
const FIXTURE = join(HERE, 'fixtures', 'claude-posttooluse-askuserquestion.json');

function hookEnv() {
  const env = { ...process.env };
  for (const name of [
    'SYSTEM_HOOKS_DISABLED',
    'MK_HOOKS_DISABLED',
    'SYSTEM_DECISION_CAPTURE_DISABLED',
    'CLAUDE_PROJECT_DIR',
  ]) {
    delete env[name];
  }
  return env;
}

function withTempDir(prefix, run) {
  const tempDir = mkdtempSync(join(tmpdir(), prefix));
  try {
    run(tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function entriesUnder(dir, prefix = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = join(prefix, entry.name);
    const fullPath = join(dir, entry.name);
    return entry.isDirectory()
      ? [relativePath, ...entriesUnder(fullPath, relativePath)]
      : [relativePath];
  });
}

function runAdapter(payload, cwd) {
  return spawnSync(process.execPath, [ADAPTER], {
    cwd,
    input: JSON.stringify(payload),
    encoding: 'utf8',
    env: hookEnv(),
    timeout: 15000,
  });
}

function fixturePayload() {
  return JSON.parse(readFileSync(FIXTURE, 'utf8'));
}

test('missing project directory exits silently without creating anything', () => {
  withTempDir('claude-capture-empty-', (hookCwd) => {
    const payload = fixturePayload();
    delete payload.cwd;

    const result = runAdapter(payload, hookCwd);

    assert.equal(result.status, 0);
    assert.equal(result.stdout, '');
    assert.deepEqual(entriesUnder(hookCwd), []);
  });
});

test('payload cwd receives queue lines when the environment has no project directory', () => {
  withTempDir('claude-capture-hook-', (hookCwd) => {
    withTempDir('claude-capture-project-', (projectDir) => {
      const payload = { ...fixturePayload(), cwd: projectDir };

      const result = runAdapter(payload, hookCwd);

      assert.equal(result.status, 0);
      assert.equal(result.stdout, '');
      assert.deepEqual(entriesUnder(hookCwd), []);

      const queueFiles = entriesUnder(projectDir).filter((path) => path.endsWith('.jsonl'));
      const queueLines = queueFiles.flatMap((path) => readFileSync(join(projectDir, path), 'utf8')
        .split(/\r?\n/)
        .filter(Boolean));
      assert.ok(queueLines.length > 0);
    });
  });
});
