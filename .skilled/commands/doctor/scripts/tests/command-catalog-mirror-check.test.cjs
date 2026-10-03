#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Command Catalog Mirror Check Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the catalog checker as a process against throwaway repo-shaped roots,
// so every verdict is observed through its exit code and STATUS line, the two
// things the runtime-mirrors workflow reads.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'command-catalog-mirror-check.cjs');

const COMMAND_FILES = {
  'agent-router.md': 'Route a request',
  'vision.md': 'Read the latest image',
  'create/skill.md': 'Create a skill',
  'create/skill-parent.md': 'Create a parent skill',
  'deep/research.md': 'Run a research loop',
  'doctor/speckit.md': 'Dispatch doctor targets',
  'prompt/improve.md': 'Improve a prompt',
};

const GROUP_ROWS = [
  '| **create** | `commands/create/` | 2 | Scaffold components |',
  '| **deep** | `commands/deep/` | 1 | Deep loops |',
  '| **doctor** | `commands/doctor/` | 1 | Diagnostics |',
  '| **prompt** | `commands/prompt/` | 1 | Prompt surface (`/prompt:improve`) |',
  '| **root** | `commands/` | 2 | Standalone `/agent-router` and `/vision` utilities |',
];

const COMMAND_ROWS = [
  '| Skill | `/create:skill <name>` | Create a skill |',
  '| Parent Skill | `/create:skill-parent <name>` | Create a parent skill |',
  '| Research | `/deep:research <topic>` | Research loop |',
  '| Doctor Router | `/doctor:speckit <target>` (backed by `doctor/speckit.md`) | Router |',
  '| Agent Router | `/agent-router <request>` | Route a request |',
  '| Prompt | `/prompt:improve <topic>` | Improve a prompt |',
  '| Vision | `/vision [question]` | Read the latest image |',
];

const roots = [];

function writeFile(abs, body) {
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, body);
}

function catalogText(groupRows, commandRows) {
  return [
    '# Commands',
    '',
    '| Group | Path | Commands | Purpose |',
    '|-------|------|----------|---------|',
    ...groupRows,
    '',
    '| Command | Invocation | Purpose |',
    '|---------|------------|---------|',
    ...commandRows,
    '',
  ].join('\n');
}

// A healthy tree: every command listed, every namespace and the root in the
// group table with the right count, and one hub metadata file that covers create/.
function buildRoot({ groupRows = GROUP_ROWS, commandRows = COMMAND_ROWS, metadata = null } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'command-catalog-mirror-'));
  roots.push(root);
  const commandsDir = path.join(root, '.skilled', 'commands');
  for (const [rel, description] of Object.entries(COMMAND_FILES)) {
    writeFile(path.join(commandsDir, rel), `---\ndescription: "${description}"\n---\n# Command\n`);
  }
  writeFile(path.join(commandsDir, 'README.txt'), catalogText(groupRows, commandRows));
  const entries = metadata || [
    { command: '/create:skill', description: 'Create a skill' },
    { command: '/create:skill-parent', description: 'Create a parent skill' },
  ];
  const metadataFile = path.join(root, '.skilled', 'skills', 'sk-doc', 'command-metadata.json');
  writeFile(metadataFile, JSON.stringify(entries));
  return root;
}

function run(root, extra = []) {
  const args = [SCRIPT, '--root', root, ...extra];
  const result = spawnSync(process.execPath, args, { encoding: 'utf8' });
  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

function without(rows, needle) {
  return rows.filter((row) => !row.includes(needle));
}

test.after(() => {
  for (const root of roots) fs.rmSync(root, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. HAPPY PATH AND ERROR PATH
// ─────────────────────────────────────────────────────────────────────────────

test('a tree whose catalog and metadata cover every command passes', () => {
  const { status, out } = run(buildRoot());
  assert.equal(status, 0, out);
  assert.match(out, /STATUS=OK command-catalog-mirror/);
});

test('a row that names its command only by backing file still counts as listed', () => {
  const commandRows = COMMAND_ROWS.map((row) => (row.includes('/doctor:speckit')
    ? '| Doctor Router | `doctor/speckit.md` | Router |'
    : row));
  const { status, out } = run(buildRoot({ commandRows }));
  assert.equal(status, 0, out);
});

test('a missing commands directory is a checker error, exit 2', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'command-catalog-mirror-'));
  roots.push(root);
  const { status, out } = run(root);
  assert.equal(status, 2, out);
  assert.match(out, /STATUS=ERROR command-catalog-mirror/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. COVERAGE IS JUDGED BY EACH ROW'S OWN COMMAND ID
// ─────────────────────────────────────────────────────────────────────────────

test('deleting a command row is drift even when a longer id contains its text', () => {
  const commandRows = without(COMMAND_ROWS, '`/create:skill <name>`');
  const { status, out } = run(buildRoot({ commandRows }));
  assert.equal(status, 1, out);
  assert.match(out, /\/create:skill not listed/);
  assert.match(out, /STATUS=DRIFT/);
});

test('deleting command rows is drift even when group-table prose mentions them', () => {
  const commandRows = without(without(COMMAND_ROWS, '`/vision'), '`/prompt:improve');
  const { status, out } = run(buildRoot({ commandRows }));
  assert.equal(status, 1, out);
  assert.match(out, /\/vision not listed/);
  assert.match(out, /\/prompt:improve not listed/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE GROUP TABLE IS CHECKED IN BOTH DIRECTIONS
// ─────────────────────────────────────────────────────────────────────────────

test('a namespace with commands but no group row is drift', () => {
  const groupRows = without(GROUP_ROWS, '**deep**');
  const { status, out } = run(buildRoot({ groupRows }));
  assert.equal(status, 1, out);
  assert.match(out, /'deep' has 1 command\(s\) but no group-table row/);
});

test('root commands with no root group row are drift', () => {
  const groupRows = without(GROUP_ROWS, '**root**');
  const { status, out } = run(buildRoot({ groupRows }));
  assert.equal(status, 1, out);
  assert.match(out, /'root' has 2 command\(s\) but no group-table row/);
});

test('a new namespace listed in the command table but missing from the group table is drift', () => {
  const root = buildRoot({ commandRows: [...COMMAND_ROWS, '| Bar | `/foo:bar` | New command |'] });
  const barFile = path.join(root, '.skilled', 'commands', 'foo', 'bar.md');
  writeFile(barFile, '---\ndescription: "Bar"\n---\n');
  const { status, out } = run(root);
  assert.equal(status, 1, out);
  assert.match(out, /'foo' has 1 command\(s\) but no group-table row/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. MALFORMED INPUT AND CRASHES
// ─────────────────────────────────────────────────────────────────────────────

test('a non-object metadata entry is reported as drift, not a crash', () => {
  const metadata = [
    null,
    { command: '/create:skill', description: 'Create a skill' },
    { command: '/create:skill-parent', description: 'Create a parent skill' },
  ];
  const { status, out } = run(buildRoot({ metadata }));
  assert.equal(status, 1, out);
  assert.match(out, /entry 1 is not an object/);
  assert.match(out, /STATUS=DRIFT/);
});

test('an unexpected throw is a checker error with exit 2 and a STATUS line', () => {
  const root = buildRoot();
  // A directory named like a command file makes the frontmatter read throw.
  fs.mkdirSync(path.join(root, '.skilled', 'commands', 'deep', 'broken.md'));
  const { status, out } = run(root);
  assert.equal(status, 2, out);
  assert.match(out, /STATUS=ERROR command-catalog-mirror/);
});
