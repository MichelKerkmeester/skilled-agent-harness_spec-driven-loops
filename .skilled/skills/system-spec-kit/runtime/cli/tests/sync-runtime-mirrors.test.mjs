// ───────────────────────────────────────────────────────────────────
// MODULE: Sync Runtime Mirrors - orphan detection tests
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  rmdirSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test, { afterEach } from 'node:test';

const require = createRequire(import.meta.url);
// RUNTIME_MIRROR_TEST_ROOT pins the fixture to a folder a caller wants to inspect afterwards;
// without it each run gets a fresh system temp folder, so a plain `node --test` still works.
const scratchRoot = process.env.RUNTIME_MIRROR_TEST_ROOT || mkdtempSync(join(tmpdir(), 'sync-runtime-mirrors-'));
const fixtureRoot = join(resolve(scratchRoot), 'sync-runtime-mirrors-fixtures');
const {
  buildExpectedLinks,
  checkMirrors,
  findOrphans,
  writeMirrors,
} = require(join(dirname(fileURLToPath(import.meta.url)), '..', 'runtime-mirrors', 'sync-runtime-mirrors.cjs'));

const FIXTURE_FILES = [
  '.gitignore',
  'source.md',
  'private/agent.md',
  '.claude/agents/kept.md',
  '.claude/agents/dropped.md',
  '.claude/agents/local-file.md',
  '.claude/agents/local-link.md',
  '.claude/agents/fixture-agent.md',
  '.claude/commands/public/command.md',
  '.cursor/agents/fixture-agent.md',
  '.cursor/commands/public-command.md',
  '.devin/agents/fixture-agent/AGENT.md',
  '.skilled/commands/README.txt',
  '.skilled/commands/deep/command.md',
  '.skilled/commands/assets/private-command.md',
  '.skilled/commands/expected-root/command.md',
  '.skilled/commands/scripts/tool.cjs',
  '.opencode/commands/deep',
  '.opencode/commands/README.txt',
  '.opencode/commands/goal-opencode.md',
  '.opencode/commands/stray.md',
  '.opencode/commands/assets',
  '.opencode/commands/scripts',
  '.opencode/commands/expected-root',
];

const FIXTURE_DIRECTORIES = [
  'private',
  '.claude/agents',
  '.claude/commands/public',
  '.claude/commands',
  '.claude',
  '.cursor/agents',
  '.cursor/commands',
  '.cursor',
  '.devin/agents/fixture-agent',
  '.devin/agents',
  '.devin',
  '.skilled/commands/deep',
  '.skilled/commands/assets',
  '.skilled/commands/expected-root',
  '.skilled/commands/scripts',
  '.skilled/commands',
  '.skilled',
  '.opencode/commands',
  '.opencode',
];

function removeScratchPath(relativePath) {
  const absolutePath = join(fixtureRoot, relativePath);
  try {
    if (lstatSync(absolutePath).isDirectory()) rmdirSync(absolutePath);
    else unlinkSync(absolutePath);
  } catch (error) {
    if (error.code !== 'ENOENT' && error.code !== 'ENOTEMPTY') throw error;
  }
}

function clearFixture() {
  for (const relativePath of FIXTURE_FILES) removeScratchPath(relativePath);
  for (const relativePath of FIXTURE_DIRECTORIES) removeScratchPath(relativePath);
}

function startFixture() {
  mkdirSync(fixtureRoot, { recursive: true });
  if (!existsSync(join(fixtureRoot, '.git'))) {
    execFileSync('git', ['-c', 'core.fsmonitor=false', 'init'], {
      cwd: fixtureRoot,
      stdio: 'ignore',
    });
  }
  execFileSync('git', ['-c', 'core.fsmonitor=false', 'config', '--local', 'core.excludesFile', '/dev/null'], {
    cwd: fixtureRoot,
    stdio: 'ignore',
  });
  clearFixture();
  return fixtureRoot;
}

function fixture() {
  const root = startFixture();
  const mirrorDir = join(root, '.claude', 'agents');
  mkdirSync(mirrorDir, { recursive: true });
  writeFileSync(join(root, 'source.md'), '# source\n');
  symlinkSync(join('..', '..', 'source.md'), join(mirrorDir, 'kept.md'));
  const expected = [{ mirror: '.claude/agents/kept.md', source: 'source.md' }];
  return { root, mirrorDir, expected };
}

function commandRootFixture() {
  const root = startFixture();
  writeFileSync(join(root, '.gitignore'), '/.opencode/commands/assets\n/.opencode/commands/scripts\n');
  mkdirSync(join(root, '.claude', 'agents'), { recursive: true });
  mkdirSync(join(root, '.claude', 'commands'), { recursive: true });
  mkdirSync(join(root, '.opencode', 'commands'), { recursive: true });
  mkdirSync(join(root, '.skilled', 'commands', 'assets'), { recursive: true });
  mkdirSync(join(root, '.skilled', 'commands', 'expected-root'), { recursive: true });
  mkdirSync(join(root, '.skilled', 'commands', 'scripts'), { recursive: true });
  writeFileSync(join(root, '.claude', 'agents', 'fixture-agent.md'), '# agent\n');
  writeFileSync(join(root, '.skilled', 'commands', 'assets', 'private-command.md'), '# private\n');
  writeFileSync(join(root, '.skilled', 'commands', 'expected-root', 'command.md'), '# expected\n');
  writeFileSync(join(root, '.skilled', 'commands', 'scripts', 'tool.cjs'), 'module.exports = {};\n');
  symlinkSync(
    join('..', '..', '.skilled', 'commands', 'scripts'),
    join(root, '.opencode', 'commands', 'scripts'),
  );
  execFileSync('git', ['-c', 'core.fsmonitor=false', 'add', '--force', '--', '.opencode/commands/scripts'], {
    cwd: root,
    stdio: 'ignore',
  });
  return root;
}

function captureConsole(method, action) {
  const original = console[method];
  const messages = [];
  console[method] = (...args) => messages.push(args.join(' '));
  try {
    return { value: action(), messages };
  } finally {
    console[method] = original;
  }
}

afterEach(clearFixture);

test('reports an entry no canonical source expects as an orphan', () => {
  const env = fixture();
  writeFileSync(join(env.mirrorDir, 'dropped.md'), '# dropped\n');
  assert.deepEqual(findOrphans(env.expected, env.root), ['.claude/agents/dropped.md']);
});

test('never reports a private local-* entry as an orphan, as a file or as a link', () => {
  const env = fixture();
  writeFileSync(join(env.mirrorDir, 'local-file.md'), '# private\n');
  mkdirSync(join(env.root, 'private'), { recursive: true });
  writeFileSync(join(env.root, 'private', 'agent.md'), '# private\n');
  symlinkSync(join(env.root, 'private', 'agent.md'), join(env.mirrorDir, 'local-link.md'));
  assert.deepEqual(findOrphans(env.expected, env.root), []);
});

test('omits ignored command roots, keeps tracked roots and reports a missing OpenCode link', () => {
  const root = commandRootFixture();
  const expected = buildExpectedLinks(root);
  const openCodeMirrors = expected
    .filter((link) => link.tree === 'opencode-commands')
    .map((link) => link.mirror);
  assert.equal(openCodeMirrors.includes('.opencode/commands/assets'), false);
  assert.equal(openCodeMirrors.includes('.opencode/commands/scripts'), true);
  assert.equal(
    execFileSync('git', ['-c', 'core.fsmonitor=false', 'ls-files', '--error-unmatch', '.opencode/commands/scripts'], {
      cwd: root,
      encoding: 'utf8',
    }).trim(),
    '.opencode/commands/scripts',
  );

  const result = captureConsole('error', () => checkMirrors(expected, root));
  assert.equal(result.value, false);
  assert.equal(result.messages.some((line) => line.includes('MISSING .opencode/commands/expected-root')), true);
});

test('write sync leaves ignored roots uncreated and preserves an existing ignored link', () => {
  const root = commandRootFixture();
  const expected = buildExpectedLinks(root);
  const ignoredLink = join(root, '.opencode', 'commands', 'assets');

  captureConsole('log', () => writeMirrors(expected, root));
  assert.equal(existsSync(ignoredLink), false);
  assert.equal(lstatSync(join(root, '.opencode', 'commands', 'expected-root')).isSymbolicLink(), true);

  symlinkSync(join('..', '..', '.skilled', 'commands', 'assets'), ignoredLink);
  assert.deepEqual(findOrphans(expected, root), []);
  captureConsole('log', () => writeMirrors(expected, root));
  assert.equal(lstatSync(ignoredLink).isSymbolicLink(), true);
});

test('keeps the OpenCode native goal command and a mirrored README, but flags a stray entry', () => {
  const root = startFixture();
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
});
