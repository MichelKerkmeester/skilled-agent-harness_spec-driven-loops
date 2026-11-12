// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Guard Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Tests for the overlay-guard core and its five runtime adapters.
//
// The core runs against a fixture tree with a real overlay manifest and the
// real overlay engine, so a misread of the engine's --guard exit contract
// fails here rather than in a live session. The adapters run from a copy of
// this hook folder placed inside the fixture tree, so each one finds the tree
// root and the engine from its own location exactly as it does when vendored.

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const { after, test } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HOOK_SOURCE = path.resolve(__dirname, '..');
const SHARED_SOURCE = path.resolve(HOOK_SOURCE, '..', 'shared');
const ENGINE_SOURCE = path.resolve(HOOK_SOURCE, '..', '..', 'commands', 'doctor', 'scripts', 'overlay-engine.cjs');
const ENGINE_RELATIVE = path.join('.skilled', 'commands', 'doctor', 'scripts', 'overlay-engine.cjs');
const OWNED = path.join('.skilled', 'owned', 'target.txt');
const UNOWNED = path.join('.skilled', 'owned', 'free.txt');
const OVERLAY_SOURCE = 'files/owned.txt';
// Point every adapter at an absent flags file so nothing persisted on this
// machine can disable the guard and hide the output these tests assert on.
const ABSENT_FLAGS_CONFIG = path.join(os.tmpdir(), 'overlay-guard-absent-hook-flags.env');

const fixtures = [];
after(() => {
  for (const dir of fixtures) fs.rmSync(dir, { recursive: true, force: true });
});

// Loaded per test so a missing core fails each test on its own line.
function loadCore() {
  return require('./overlay-guard.cjs');
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

function writeFile(root, relative, text) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
}

/**
 * A vendored tree with the engine, one owned file and one unowned file.
 * @param {{overlays?: boolean, overlayDir?: string, manifestText?: string, withHook?: boolean}} options
 * @returns {string} The tree root, realpath-resolved.
 */
function makeTree(options = {}) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'overlay-guard-test-')));
  fixtures.push(root);
  fs.mkdirSync(path.dirname(path.join(root, ENGINE_RELATIVE)), { recursive: true });
  fs.copyFileSync(ENGINE_SOURCE, path.join(root, ENGINE_RELATIVE));
  writeFile(root, OWNED, 'owned\n');
  writeFile(root, UNOWNED, 'free\n');
  const overlays = options.overlays !== false;
  const overlayDir = options.overlayDir || 'skilled-overlays';
  if (options.overlayDir) writeFile(root, '.skilled-overlays.json', JSON.stringify({ overlayDir }) + '\n');
  if (overlays) {
    // The overlay copy differs from the live file and the manifest is one the
    // engine can apply, so a guard that applied would rewrite the live file
    // and leave a sync-state.json behind, and the no-write test would see it.
    writeFile(root, path.join(overlayDir, OVERLAY_SOURCE), 'overlay version\n');
    const manifest = options.manifestText || JSON.stringify({
      schemaVersion: 1,
      pin: { upstream: 'fixture', commit: 'pin-one' },
      overlays: [{ id: 'owned', scope: 'file', source: OVERLAY_SOURCE, destination: OWNED.split(path.sep).join('/') }],
    }, null, 2) + '\n';
    writeFile(root, path.join(overlayDir, 'overlay-manifest.json'), manifest);
  }
  if (options.withHook) {
    fs.cpSync(HOOK_SOURCE, path.join(root, '.skilled', 'hooks', 'overlay-guard'), { recursive: true });
    fs.cpSync(SHARED_SOURCE, path.join(root, '.skilled', 'hooks', 'shared'), { recursive: true });
    // Pi reaches the adapter through a one-line entry file that re-exports it,
    // so the fixture carries the same entry and the adapter loads from its own folder.
    writeFile(root, path.join('.pi', 'extensions', 'overlay-guard.ts'),
      "export { default } from '../../.skilled/hooks/overlay-guard/pi/overlay-guard.ts';\n");
    writeFile(root, 'package.json', '{"type":"module"}\n');
  }
  return root;
}

/** Every file under the tree with its hash, so a write anywhere shows up. */
function snapshot(root) {
  const out = {};
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else out[path.relative(root, full)] = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
    }
  };
  walk(root);
  return out;
}

/** The real spawnSync, counting how often the core starts a process. */
function countingSpawn() {
  const calls = [];
  const spawn = (...args) => {
    calls.push(args);
    return spawnSync(...args);
  };
  return { spawn, calls };
}

function evaluate(root, paths, extra = {}) {
  return loadCore().evaluateWrite({
    paths,
    sessionDir: root,
    treeRoot: root,
    enginePath: path.join(root, ENGINE_RELATIVE),
    ...extra,
  });
}

function hookEnv(extra = {}) {
  const env = { ...process.env, HOOK_FLAGS_CONFIG: ABSENT_FLAGS_CONFIG, ...extra };
  delete env.SYSTEM_HOOKS_DISABLED;
  delete env.SYSTEM_OVERLAY_GUARD_DISABLED;
  delete env.CLAUDE_PROJECT_DIR;
  delete env.CODEX_PROJECT_DIR;
  delete env.DEVIN_PROJECT_DIR;
  return env;
}

function runAdapter(root, relative, payload) {
  return spawnSync(process.execPath, [path.join(root, '.skilled', 'hooks', 'overlay-guard', relative)], {
    cwd: root,
    input: JSON.stringify(payload),
    encoding: 'utf8',
    env: hookEnv(),
    timeout: 15_000,
  });
}

function denyReason(stdout) {
  return JSON.parse(stdout).hookSpecificOutput.permissionDecisionReason;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE
// ─────────────────────────────────────────────────────────────────────────────

test('no manifest allows at once and starts no process', () => {
  const root = makeTree({ overlays: false });
  const { spawn, calls } = countingSpawn();
  const result = evaluate(root, [OWNED], { spawn });
  assert.equal(result.decision, 'allow');
  assert.deepEqual(result.notes, []);
  assert.equal(calls.length, 0, 'the engine is not spawned without a manifest');
});

test('a setting that names a folder with no manifest allows without spawning', () => {
  const root = makeTree({ overlays: false, overlayDir: 'custom-overlays' });
  const { spawn, calls } = countingSpawn();
  const result = evaluate(root, [OWNED], { spawn });
  assert.equal(result.decision, 'allow');
  assert.deepEqual(result.notes, []);
  assert.equal(calls.length, 0);
});

test('an owned path is refused with the overlay file to edit', () => {
  const root = makeTree();
  const result = evaluate(root, [OWNED]);
  assert.equal(result.decision, 'deny');
  assert.match(result.reason, /^refuse: \.skilled\/owned\/target\.txt is owned by skilled-overlays\/files\/owned\.txt/);
});

test('the overlay folder comes from the engine, so a custom overlayDir is honoured', () => {
  const root = makeTree({ overlayDir: 'custom-overlays' });
  const result = evaluate(root, [path.join(root, OWNED)]);
  assert.equal(result.decision, 'deny');
  assert.match(result.reason, /owned by custom-overlays\/files\/owned\.txt/);
});

test('an unowned path in a tree with a manifest is allowed', () => {
  const root = makeTree();
  const { spawn, calls } = countingSpawn();
  const result = evaluate(root, [UNOWNED], { spawn });
  assert.equal(result.decision, 'allow');
  assert.deepEqual(result.notes, []);
  assert.equal(calls.length, 1, 'the engine judged the one path');
});

test('with strictWrites on, an unowned vendored path and a new file are refused with the adopt command', () => {
  const manifestText = JSON.stringify({
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    strictWrites: true,
    generated: ['.skilled/generated/**'],
    overlays: [{ id: 'owned', scope: 'file', source: OVERLAY_SOURCE, destination: OWNED.split(path.sep).join('/') }],
  }, null, 2) + '\n';
  const root = makeTree({ manifestText });

  const edit = evaluate(root, [UNOWNED]);
  assert.equal(edit.decision, 'deny');
  assert.match(edit.reason, /^refuse: \.skilled\/owned\/free\.txt is a vendored file no overlay owns.* apply --adopt \.skilled\/owned\/free\.txt/);

  const created = evaluate(root, [path.join('.skilled', 'fresh', 'new.txt')]);
  assert.equal(created.decision, 'deny');
  assert.match(created.reason, /is a new file in the vendored tree.* apply --adopt \.skilled\/fresh$/);

  assert.equal(evaluate(root, [path.join('.skilled', 'generated', 'index.json')]).decision, 'allow');
  assert.equal(evaluate(root, ['notes.md']).decision, 'allow');
});

test('a call naming several paths is refused when any one is owned', () => {
  const root = makeTree();
  const result = evaluate(root, [UNOWNED, OWNED]);
  assert.equal(result.decision, 'deny');
  assert.match(result.reason, /skilled-overlays\/files\/owned\.txt/);
});

test('no path allows without spawning', () => {
  const root = makeTree();
  const { spawn, calls } = countingSpawn();
  assert.equal(evaluate(root, [], { spawn }).decision, 'allow');
  assert.equal(evaluate(root, ['', '   '], { spawn }).decision, 'allow');
  assert.equal(calls.length, 0);
});

test('a refused write to an owned path leaves the tree byte-identical', () => {
  const root = makeTree();
  const before = snapshot(root);
  assert.equal(evaluate(root, [OWNED]).decision, 'deny');
  assert.deepEqual(snapshot(root), before, 'the guard applied, captured or wrote nothing');
});

test('an engine error fails open with a one-line note', () => {
  const root = makeTree({ manifestText: '{ not json' });
  const result = evaluate(root, [OWNED]);
  assert.equal(result.decision, 'allow');
  assert.equal(result.notes.length, 1);
  assert.doesNotMatch(result.notes[0], /\n/);
  assert.match(result.notes[0], /overlay-guard: could not judge/);
  assert.match(result.notes[0], /JSON/);
});

test('an engine timeout fails open with a note', () => {
  const root = makeTree();
  const timedOut = () => ({ status: null, signal: 'SIGKILL', stdout: '', stderr: '', error: Object.assign(new Error('spawnSync node ETIMEDOUT'), { code: 'ETIMEDOUT' }) });
  const result = evaluate(root, [OWNED], { spawn: timedOut });
  assert.equal(result.decision, 'allow');
  assert.equal(result.notes.length, 1);
  assert.match(result.notes[0], /ETIMEDOUT/);
});

test('an unreadable overlay setting fails open with a note', () => {
  const root = makeTree();
  writeFile(root, '.skilled-overlays.json', '{ broken');
  const result = evaluate(root, [OWNED]);
  assert.equal(result.decision, 'allow');
  assert.equal(result.notes.length, 1);
  assert.match(result.notes[0], /\.skilled-overlays\.json/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. ADAPTERS
// ─────────────────────────────────────────────────────────────────────────────

test('claude: Edit, Write and MultiEdit map file_path, and an unowned path passes silently', () => {
  const root = makeTree({ withHook: true });
  for (const [tool, filePath] of [['Edit', OWNED], ['Write', path.join(root, OWNED)], ['MultiEdit', OWNED]]) {
    const proc = runAdapter(root, 'claude/overlay-guard.cjs', { tool_name: tool, tool_input: { file_path: filePath }, cwd: root });
    assert.equal(proc.status, 0, `${tool}: ${proc.stderr}`);
    const parsed = JSON.parse(proc.stdout);
    assert.equal(parsed.hookSpecificOutput.permissionDecision, 'deny', tool);
    assert.match(denyReason(proc.stdout), /skilled-overlays\/files\/owned\.txt/, tool);
  }
  const free = runAdapter(root, 'claude/overlay-guard.cjs', { tool_name: 'Write', tool_input: { file_path: UNOWNED }, cwd: root });
  assert.equal(free.status, 0);
  assert.equal(free.stdout, '');
  const bash = runAdapter(root, 'claude/overlay-guard.cjs', { tool_name: 'Bash', tool_input: { command: `echo x > ${OWNED}` }, cwd: root });
  assert.equal(bash.stdout, '', 'Bash is not parsed');
});

test('claude: a tree with no manifest passes silently', () => {
  const root = makeTree({ overlays: false, withHook: true });
  const proc = runAdapter(root, 'claude/overlay-guard.cjs', { tool_name: 'Edit', tool_input: { file_path: OWNED }, cwd: root });
  assert.equal(proc.status, 0);
  assert.equal(proc.stdout, '');
  assert.equal(proc.stderr, '');
});

test('codex: apply_patch file headers and Move to targets map to paths', () => {
  const root = makeTree({ withHook: true });
  const owned = OWNED.split(path.sep).join('/');
  const patches = [
    `*** Begin Patch\n*** Update File: ${owned}\n@@\n-owned\n+edited\n*** End Patch`,
    `*** Begin Patch\n*** Update File: .skilled/owned/free.txt\n*** Move to: ${owned}\n*** End Patch`,
    `*** Begin Patch\n*** Add File: .skilled/owned/new.txt\n+x\n*** Delete File: ${owned}\n*** End Patch`,
  ];
  for (const patch of patches) {
    const proc = runAdapter(root, 'codex/overlay-guard.cjs', { tool_name: 'apply_patch', tool_input: { command: patch }, cwd: root });
    assert.equal(proc.status, 0, proc.stderr);
    assert.match(denyReason(proc.stdout), /skilled-overlays\/files\/owned\.txt/, patch);
  }
  const edit = runAdapter(root, 'codex/overlay-guard.cjs', { tool_name: 'edit', tool_input: { path: OWNED }, cwd: root });
  assert.match(denyReason(edit.stdout), /skilled-overlays\/files\/owned\.txt/);
  const free = runAdapter(root, 'codex/overlay-guard.cjs', {
    tool_name: 'apply_patch', tool_input: { input: '*** Begin Patch\n*** Update File: .skilled/owned/free.txt\n*** End Patch' }, cwd: root,
  });
  assert.equal(free.stdout, '');
});

test('cursor: Write maps file_path and answers with its own permission envelope', () => {
  const root = makeTree({ withHook: true });
  const denied = runAdapter(root, 'cursor/overlay-guard.mjs', { tool_name: 'Write', tool_input: { file_path: OWNED }, workspace_roots: [root] });
  assert.equal(denied.status, 2, denied.stderr);
  const parsed = JSON.parse(denied.stdout);
  assert.equal(parsed.permission, 'deny');
  assert.match(parsed.agent_message, /skilled-overlays\/files\/owned\.txt/);
  const allowed = runAdapter(root, 'cursor/overlay-guard.mjs', { tool_name: 'Write', tool_input: { file_path: UNOWNED }, workspace_roots: [root] });
  assert.equal(allowed.status, 0);
  assert.equal(JSON.parse(allowed.stdout).permission, 'allow');
});

test('cursor: the registered command delivers the deny intact', () => {
  // Cursor blocks on exit 2. A `|| { fallback }` chain after the adapter would
  // run on that exit, append an allow envelope to stdout and exit 0, so the
  // registration has to carry no fallback for the deny to reach Cursor.
  const repoRoot = path.resolve(HOOK_SOURCE, '..', '..', '..');
  const hooks = JSON.parse(fs.readFileSync(path.join(repoRoot, '.cursor', 'hooks.json'), 'utf8')).hooks.preToolUse;
  const entry = hooks.find((hook) => hook.command.includes('overlay-guard/cursor/overlay-guard.mjs'));
  assert.ok(entry, 'the cursor adapter is registered');
  const root = makeTree({ withHook: true });
  const proc = spawnSync('bash', ['-c', entry.command], {
    cwd: root,
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: OWNED }, workspace_roots: [root] }),
    encoding: 'utf8',
    env: hookEnv(),
    timeout: 15_000,
  });
  assert.equal(proc.status, 2, proc.stderr);
  assert.equal(JSON.parse(proc.stdout).permission, 'deny', 'stdout is exactly one deny envelope');
});

test('devin: edit and write map file_path', () => {
  const root = makeTree({ withHook: true });
  for (const tool of ['edit', 'write']) {
    const proc = runAdapter(root, 'devin/overlay-guard.cjs', { tool_name: tool, tool_input: { file_path: OWNED }, cwd: root });
    assert.equal(proc.status, 0, proc.stderr);
    assert.match(denyReason(proc.stdout), /skilled-overlays\/files\/owned\.txt/, tool);
  }
  const free = runAdapter(root, 'devin/overlay-guard.cjs', { tool_name: 'edit', tool_input: { file_path: UNOWNED }, cwd: root });
  assert.equal(free.stdout, '');
});

test('pi: edit and write map input.path to a block', async () => {
  const root = makeTree({ withHook: true });
  const extension = await import(pathToFileURL(path.join(root, '.pi', 'extensions', 'overlay-guard.ts')).href);
  const handlers = {};
  extension.default({ on: (event, handler) => { handlers[event] = handler; } });
  assert.equal(typeof handlers.tool_call, 'function');
  const previous = process.env.HOOK_FLAGS_CONFIG;
  process.env.HOOK_FLAGS_CONFIG = ABSENT_FLAGS_CONFIG;
  try {
    for (const tool of ['edit', 'write']) {
      const answer = await handlers.tool_call({ toolName: tool, input: { path: OWNED } }, { cwd: root });
      assert.equal(answer?.block, true, tool);
      assert.match(answer.reason, /skilled-overlays\/files\/owned\.txt/, tool);
    }
    assert.equal(await handlers.tool_call({ toolName: 'edit', input: { path: UNOWNED } }, { cwd: root }), undefined);
    assert.equal(await handlers.tool_call({ toolName: 'bash', input: { command: 'true' } }, { cwd: root }), undefined);
  } finally {
    if (previous === undefined) delete process.env.HOOK_FLAGS_CONFIG;
    else process.env.HOOK_FLAGS_CONFIG = previous;
  }
});
