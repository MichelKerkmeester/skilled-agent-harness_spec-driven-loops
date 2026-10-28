// ───────────────────────────────────────────────────────────────────
// MODULE: Sync Runtime Mirrors - orphan detection tests
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { findOrphans } = require(join(dirname(fileURLToPath(import.meta.url)), '..', 'runtime-mirrors', 'sync-runtime-mirrors.cjs'));

// One flat mirror tree that expects a single entry, so any other entry in it is an orphan.
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'runtime-mirrors-'));
  const mirrorDir = join(root, '.claude', 'agents');
  mkdirSync(mirrorDir, { recursive: true });
  writeFileSync(join(root, 'source.md'), '# source\n');
  symlinkSync(join('..', '..', 'source.md'), join(mirrorDir, 'kept.md'));
  const expected = [{ mirror: '.claude/agents/kept.md', source: 'source.md' }];
  return { root, mirrorDir, expected };
}

test('reports an entry no canonical source expects as an orphan', () => {
  const env = fixture();
  try {
    writeFileSync(join(env.mirrorDir, 'dropped.md'), '# dropped\n');
    assert.deepEqual(findOrphans(env.expected, env.root), ['.claude/agents/dropped.md']);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('never reports a private local-* entry as an orphan, as a file or as a link', () => {
  const env = fixture();
  try {
    writeFileSync(join(env.mirrorDir, 'local-file.md'), '# private\n');
    mkdirSync(join(env.root, 'private'), { recursive: true });
    writeFileSync(join(env.root, 'private', 'agent.md'), '# private\n');
    symlinkSync(join(env.root, 'private', 'agent.md'), join(env.mirrorDir, 'local-link.md'));
    assert.deepEqual(findOrphans(env.expected, env.root), []);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('keeps the OpenCode native goal command and a mirrored README, but flags a stray entry', () => {
  const root = mkdtempSync(join(tmpdir(), 'runtime-mirrors-'));
  try {
    const commandsDir = join(root, '.opencode', 'commands');
    mkdirSync(join(root, '.skilled', 'commands', 'deep'), { recursive: true });
    writeFileSync(join(root, '.skilled', 'commands', 'README.txt'), 'commands\n');
    mkdirSync(commandsDir, { recursive: true });
    symlinkSync(join('..', '..', '.skilled', 'commands', 'deep'), join(commandsDir, 'deep'));
    symlinkSync(join('..', '..', '.skilled', 'commands', 'README.txt'), join(commandsDir, 'README.txt'));
    writeFileSync(join(commandsDir, 'goal-opencode.md'), '# goal\n');
    writeFileSync(join(commandsDir, 'stray.md'), '# stray\n');
    const expected = [
      { mirror: '.opencode/commands/deep', source: '.skilled/commands/deep' },
      { mirror: '.opencode/commands/README.txt', source: '.skilled/commands/README.txt' },
    ];
    assert.deepEqual(findOrphans(expected, root), ['.opencode/commands/stray.md']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
