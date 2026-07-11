// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-code-graph-freshness Regression Tests                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the two adversarial-review fixes on the freshness guard's   ║
// ║          adapters -- the OpenCode plugin's before/after callID           ║
// ║          correlation (P0: tool.execute.after has no `args` on its own    ║
// ║          output, only on input, so a guard reading output.args there is  ║
// ║          a silent no-op) and the Claude .cjs adapter's synchronous lock  ║
// ║          release (P1: its exit handler never fires because main() calls ║
// ║          process.exit(0) before the detached child can ever emit exit)  ║
// ║          -- against hermetic temp-project fixtures, no live daemon or   ║
// ║          real code-graph scan required.                                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const CLAUDE_HOOK_PATH = path.join(
  __dirname, '..', '..', 'skills', 'system-code-graph', 'runtime', 'hooks', 'claude', 'code-graph-freshness.cjs',
);
const freshnessCore = require(
  path.join(__dirname, '..', '..', 'skills', 'system-code-graph', 'runtime', 'lib', 'code-graph', 'freshness-core.cjs'),
);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function temporaryDirectory(t, prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

async function loadPlugin() {
  const pluginUrl = pathToFileURL(path.join(__dirname, '..', 'mk-code-graph-freshness.js')).href;
  return import(pluginUrl);
}

const DATABASE_RELATIVE_DIR = path.join('.opencode', 'skills', 'system-code-graph', 'mcp_server', 'database');

function seedReadiness(projectDir, graphFreshness) {
  const dir = path.join(projectDir, DATABASE_RELATIVE_DIR);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, '.code-graph-readiness.json'), JSON.stringify({ graphFreshness }), 'utf8');
}

function seedOwner(projectDir, lastHeartbeatIso, ttlMs) {
  const dir = path.join(projectDir, DATABASE_RELATIVE_DIR);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, '.code-graph-owner.json'), JSON.stringify({ lastHeartbeatIso, ttlMs }), 'utf8');
}

function seedDebounceState(projectDir, sessionID, state) {
  const { stateDir } = freshnessCore.resolveFreshnessPaths(projectDir);
  fs.mkdirSync(stateDir, { recursive: true });
  const key = freshnessCore.sessionStateKey(sessionID);
  fs.writeFileSync(path.join(stateDir, `${key}.json`), JSON.stringify(state), 'utf8');
}

function seedScanReadyForImmediateScan(projectDir, sessionID) {
  const now = Date.now();
  seedReadiness(projectDir, 'stale');
  seedOwner(projectDir, new Date(now).toISOString(), 60000);
  seedDebounceState(projectDir, sessionID, {
    pending: ['src/bar.ts'],
    firstPendingAt: now - 25000,
    lastEditAt: now - 25000,
  });
}

function lockPathFor(projectDir) {
  return freshnessCore.resolveFreshnessPaths(projectDir).lockPath;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. OPENCODE PLUGIN -- export shape + MUTATING_TOOLS (P2)
// ─────────────────────────────────────────────────────────────────────────────

test('OpenCode plugin exports only the default plugin factory', async () => {
  const pluginModule = await loadPlugin();
  assert.deepEqual(Object.keys(pluginModule), ['default']);
  assert.equal(typeof pluginModule.default, 'function');
});

test('MUTATING_TOOLS includes apply_patch and apply-patch alongside the original set (P2)', async () => {
  const pluginModule = await loadPlugin();
  const { MUTATING_TOOLS } = pluginModule.default.__test;
  for (const tool of ['write', 'edit', 'patch', 'multiedit', 'apply_patch', 'apply-patch']) {
    assert.ok(MUTATING_TOOLS.has(tool), `expected MUTATING_TOOLS to include "${tool}"`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. OPENCODE PLUGIN -- correlation map contract (P0)
// ─────────────────────────────────────────────────────────────────────────────

test('OpenCode plugin correlation map: stash -> retrieve+evict, unmatched take is a no-op, bounded eviction', async () => {
  const pluginModule = await loadPlugin();
  const map = pluginModule.default.__test.createCorrelationMap(2);
  assert.equal(map.take('missing'), null);

  map.stash('call-1', '/tmp/a.ts');
  map.stash('call-2', '/tmp/b.ts');
  assert.equal(map.size(), 2);

  assert.equal(map.take('call-1'), '/tmp/a.ts');
  assert.equal(map.size(), 1, 'take must evict the entry it retrieves');
  assert.equal(map.take('call-1'), null, 'a second take for the same callID is a no-op');

  map.stash('call-3', '/tmp/c.ts');
  map.stash('call-4', '/tmp/d.ts');
  assert.ok(map.size() <= 2, 'the map must stay bounded, evicting the oldest entry');
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. OPENCODE PLUGIN -- before/after wiring against the real Hooks shape (P0)
// ─────────────────────────────────────────────────────────────────────────────
//
// The @opencode-ai/plugin Hooks type puts `args` on tool.execute.before's
// OUTPUT (`{ args }`) but tool.execute.after's own output is `{ title, output,
// metadata }` -- no args. Every fixture below mirrors that real shape exactly
// (never `output.args` on the after call) so a regression back to reading
// output.args in after would show up as these tests failing to reach 'scan'.

test('OpenCode plugin: before stashes the path, after retrieves it via callID and reaches evaluateEdit (P0 fix)', async (t) => {
  const tmpDir = temporaryDirectory(t, 'mk-code-graph-freshness-e2e-');
  seedScanReadyForImmediateScan(tmpDir, 'session-e2e');

  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default({ directory: tmpDir });

  await hooks['tool.execute.before'](
    { tool: 'edit', sessionID: 'session-e2e', callID: 'call-1' },
    { args: { filePath: 'src/foo.ts' } },
  );
  // Real shape: tool.execute.after's OUTPUT never carries args.
  await hooks['tool.execute.after'](
    { tool: 'edit', sessionID: 'session-e2e', callID: 'call-1' },
    { title: 'x', output: '', metadata: {} },
  );

  const { stateDir } = freshnessCore.resolveFreshnessPaths(tmpDir);
  const key = freshnessCore.sessionStateKey('session-e2e');
  const debounceStatePath = path.join(stateDir, `${key}.json`);
  const state = JSON.parse(fs.readFileSync(debounceStatePath, 'utf8'));
  assert.deepEqual(state.pending, [], 'a scan decision must clear the debounce pending set');
});

test('OpenCode plugin: an after-hook with no preceding before call is a no-op (unmatched callID)', async (t) => {
  const tmpDir = temporaryDirectory(t, 'mk-code-graph-freshness-nomatch-');
  seedScanReadyForImmediateScan(tmpDir, 'session-nomatch');

  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default({ directory: tmpDir });

  await hooks['tool.execute.after'](
    { tool: 'edit', sessionID: 'session-nomatch', callID: 'never-stashed' },
    { title: 'x', output: '', metadata: {} },
  );

  const { stateDir } = freshnessCore.resolveFreshnessPaths(tmpDir);
  const key = freshnessCore.sessionStateKey('session-nomatch');
  const debounceStatePath = path.join(stateDir, `${key}.json`);
  const state = JSON.parse(fs.readFileSync(debounceStatePath, 'utf8'));
  assert.deepEqual(state.pending, ['src/bar.ts'], 'no correlated path means evaluateEdit must never run -- the pre-seeded pending set must be untouched');
});

test('OpenCode plugin: regression -- output.args on tool.execute.after alone (the pre-fix read source) is inert', async (t) => {
  const tmpDir = temporaryDirectory(t, 'mk-code-graph-freshness-oldbug-');
  seedScanReadyForImmediateScan(tmpDir, 'session-oldbug');

  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default({ directory: tmpDir });

  // Never call tool.execute.before. Simulate the ORIGINAL (buggy) assumption
  // that tool.execute.after's own output carries `args` -- it does not, so
  // even attaching it to the after-hook's output must not resurrect the bug.
  await hooks['tool.execute.after'](
    { tool: 'edit', sessionID: 'session-oldbug', callID: 'call-never-stashed' },
    { title: 'x', output: '', metadata: {}, args: { filePath: 'src/foo.ts' } },
  );

  const { stateDir } = freshnessCore.resolveFreshnessPaths(tmpDir);
  const key = freshnessCore.sessionStateKey('session-oldbug');
  const debounceStatePath = path.join(stateDir, `${key}.json`);
  const state = JSON.parse(fs.readFileSync(debounceStatePath, 'utf8'));
  assert.deepEqual(
    state.pending,
    ['src/bar.ts'],
    'the fixed after-hook must resolve the path only via the correlation map, never output.args -- the pre-seeded pending set must be untouched',
  );
});

test('OpenCode plugin: non-mutating tools are ignored by tool.execute.before (no stash)', async (t) => {
  const tmpDir = temporaryDirectory(t, 'mk-code-graph-freshness-nonmutating-');
  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default({ directory: tmpDir });

  await hooks['tool.execute.before']({ tool: 'bash', sessionID: 'session-x', callID: 'call-x' }, { args: { command: 'ls' } });
  await hooks['tool.execute.after']({ tool: 'bash', sessionID: 'session-x', callID: 'call-x' }, { title: 'x', output: '', metadata: {} });

  const { stateDir } = freshnessCore.resolveFreshnessPaths(tmpDir);
  assert.ok(!fs.existsSync(stateDir), 'a non-mutating tool must never create freshness state');
});

test('OpenCode plugin: kill-switch env makes before/after a full no-op', async (t) => {
  const tmpDir = temporaryDirectory(t, 'mk-code-graph-freshness-killswitch-');
  seedScanReadyForImmediateScan(tmpDir, 'session-kill');
  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default({ directory: tmpDir });

  process.env.MK_CODE_GRAPH_FRESHNESS_DISABLED = '1';
  try {
    await hooks['tool.execute.before']({ tool: 'edit', sessionID: 'session-kill', callID: 'call-1' }, { args: { filePath: 'src/foo.ts' } });
    await hooks['tool.execute.after']({ tool: 'edit', sessionID: 'session-kill', callID: 'call-1' }, { title: 'x', output: '', metadata: {} });
  } finally {
    delete process.env.MK_CODE_GRAPH_FRESHNESS_DISABLED;
  }

  const { stateDir } = freshnessCore.resolveFreshnessPaths(tmpDir);
  const key = freshnessCore.sessionStateKey('session-kill');
  const debounceStatePath = path.join(stateDir, `${key}.json`);
  const state = JSON.parse(fs.readFileSync(debounceStatePath, 'utf8'));
  assert.deepEqual(state.pending, ['src/bar.ts'], 'the kill-switch must suppress before AND after, so the pre-seeded pending state must stay untouched by this call');
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. CLAUDE ADAPTER -- synchronous lock release, no leaked lock (P1 fix)
// ─────────────────────────────────────────────────────────────────────────────

test('Claude hook releases the shared scan lock synchronously and never leaks it past its own exit (P1 fix)', (t) => {
  const tmpDir = temporaryDirectory(t, 'claude-freshness-lock-');
  seedScanReadyForImmediateScan(tmpDir, 'claude-session-lock');

  const result = spawnSync(process.execPath, [CLAUDE_HOOK_PATH], {
    input: JSON.stringify({ tool_name: 'Edit', tool_input: { file_path: 'src/foo.ts' }, cwd: tmpDir, session_id: 'claude-session-lock' }),
    encoding: 'utf8',
    timeout: 10_000,
  });

  assert.equal(result.status, 0, 'the hook must always exit 0');
  assert.ok(
    !fs.existsSync(lockPathFor(tmpDir)),
    'the scan lock must be released synchronously by this short-lived process, not left behind for its full TTL',
  );
});

test('Claude hook: two back-to-back scan-triggering invocations never leave a stale lock between them', (t) => {
  const tmpDir = temporaryDirectory(t, 'claude-freshness-lock-repeat-');

  seedScanReadyForImmediateScan(tmpDir, 'claude-session-repeat-1');
  const first = spawnSync(process.execPath, [CLAUDE_HOOK_PATH], {
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: 'src/foo.ts' }, cwd: tmpDir, session_id: 'claude-session-repeat-1' }),
    encoding: 'utf8',
    timeout: 10_000,
  });
  assert.equal(first.status, 0);
  assert.ok(!fs.existsSync(lockPathFor(tmpDir)), 'lock must be clear after the first dispatch');

  seedScanReadyForImmediateScan(tmpDir, 'claude-session-repeat-2');
  const second = spawnSync(process.execPath, [CLAUDE_HOOK_PATH], {
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: 'src/foo.ts' }, cwd: tmpDir, session_id: 'claude-session-repeat-2' }),
    encoding: 'utf8',
    timeout: 10_000,
  });
  assert.equal(second.status, 0);
  assert.ok(!fs.existsSync(lockPathFor(tmpDir)), 'a second, independent dispatch must not inherit or leave a stale lock either');
});

test('Claude hook rejects malformed envelopes without a traceback and always exits 0', () => {
  const malformed = [
    'not-json',
    '[]',
    'null',
    '"scalar"',
    '{"tool_name":"Write","tool_input":null}',
    '{"tool_name":"Bash","tool_input":{"file_path":"/etc/hosts"}}',
  ];
  for (const input of malformed) {
    const result = spawnSync(process.execPath, [CLAUDE_HOOK_PATH], { input, encoding: 'utf8' });
    assert.equal(result.status, 0, input);
    assert.equal(result.stdout, '', input);
    assert.doesNotMatch(result.stderr, /Traceback/, input);
  }
});

test('Claude hook is a full no-op under its kill-switch env (no lock ever acquired)', (t) => {
  const tmpDir = temporaryDirectory(t, 'claude-freshness-killswitch-');
  seedScanReadyForImmediateScan(tmpDir, 'claude-session-kill');

  const result = spawnSync(process.execPath, [CLAUDE_HOOK_PATH], {
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: 'src/foo.ts' }, cwd: tmpDir, session_id: 'claude-session-kill' }),
    encoding: 'utf8',
    env: { ...process.env, MK_CODE_GRAPH_FRESHNESS_DISABLED: '1' },
  });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
  assert.ok(!fs.existsSync(lockPathFor(tmpDir)));
});
