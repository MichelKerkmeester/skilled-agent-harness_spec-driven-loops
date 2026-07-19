// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-spec-memory Regression Tests                              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Exercise plugin cache, bridge, hook-boundary, and message       ║
// ║          schema hardening without a live OpenCode session.              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '../../..');
const PLUGIN_PATH = path.join(ROOT, '.opencode', 'plugins', 'mk-spec-memory.js');
const SCHEMA_PATH = path.join(
  ROOT,
  '.opencode',
  'skills',
  'system-spec-kit',
  'mcp-server',
  'plugin_bridges',
  'spec-kit-opencode-message-schema.mjs',
);
const HOOK_ROOT = path.join(
  ROOT,
  '.opencode',
  'skills',
  'system-spec-kit',
  'mcp-server',
  'hooks',
  'claude',
);
const USER_PROMPT_PATH = path.join(HOOK_ROOT, 'user-prompt-submit.ts');
const MAX_BRIDGE_BYTES = 1024 * 1024;

function makeTempDir(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `${label}-`));
}

function writeExecutable(root, name, source) {
  const filePath = path.join(root, name);
  fs.writeFileSync(filePath, `#!/usr/bin/env node\n${source}`, 'utf8');
  fs.chmodSync(filePath, 0o755);
  return filePath;
}

async function importPlugin(tag = 'default') {
  const source = fs.readFileSync(PLUGIN_PATH, 'utf8')
    .replace("import { tool } from '@opencode-ai/plugin/tool';", 'const tool = (definition) => definition;')
    .replace(
      /const BRIDGE_PATH = .*?;\nconst SOURCE_PATHS = \[[\s\S]*?\n\];/,
      "const BRIDGE_PATH = '/test/mk-spec-memory-bridge.mjs';\nconst SOURCE_PATHS = [BRIDGE_PATH];",
    );
  const instrumented = `${source}\n// Test module identity: ${tag}-${Date.now()}-${Math.random()}\n`;
  return import(`data:text/javascript;base64,${Buffer.from(instrumented).toString('base64')}`);
}

async function createPlugin(binary, options = {}) {
  const pluginModule = await importPlugin(options.tag ?? 'bridge');
  return pluginModule.default(
    { directory: options.directory ?? ROOT },
    {
      nodeBinaryOverride: binary,
      sourceSignatureOverride: options.signature ?? 'test-signature',
      bridgeTimeoutMs: options.bridgeTimeoutMs ?? 1000,
      cliTimeoutMs: 500,
      cacheTtlMs: options.cacheTtlMs ?? 5000,
      maxBriefChars: options.maxBriefChars ?? 120,
    },
  );
}

async function statusForHome(home, configSetup) {
  const previousHome = process.env.HOME;
  process.env.HOME = home;
  try {
    if (configSetup) configSetup();
    const pluginModule = await importPlugin(`config-${path.basename(home)}`);
    const hooks = await pluginModule.default({ directory: ROOT }, { enabled: false });
    return hooks.tool.mk_spec_memory_status.execute();
  } finally {
    if (previousHome === undefined) delete process.env.HOME;
    else process.env.HOME = previousHome;
  }
}

function configPath(home) {
  return path.join(home, '.config', 'opencode', 'plugin', 'mk-spec-memory.json');
}

function readCount(filePath) {
  try {
    return Number(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return 0;
  }
}

async function waitForFile(filePath, timeoutMs = 1000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (fs.existsSync(filePath)) return;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error(`Timed out waiting for ${filePath}`);
}

function runUserPromptFixture(targetSource, input, timeout = 5000) {
  const root = makeTempDir('mk-spec-memory-prompt');
  const target = path.join(
    root,
    '.opencode',
    'skills',
    'system-skill-advisor',
    'mcp-server',
    'dist',
    'hooks',
    'claude',
    'user-prompt-submit.js',
  );
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, targetSource, 'utf8');
  const startedAt = Date.now();
  const result = spawnSync(process.execPath, [USER_PROMPT_PATH], {
    cwd: root,
    input,
    encoding: 'utf8',
    timeout,
    maxBuffer: 2 * 1024 * 1024,
    env: { ...process.env, SPECKIT_USER_PROMPT_TARGET: target },
  });
  const durationMs = Date.now() - startedAt;
  fs.rmSync(root, { recursive: true, force: true });
  return { result, durationMs };
}

test('exports only the OpenCode plugin factory', async () => {
  const pluginModule = await importPlugin('exports');
  assert.deepEqual(Object.keys(pluginModule), ['default']);
  assert.equal(typeof pluginModule.default, 'function');
});

test('reports missing, malformed, unreadable, and valid configuration safely', async () => {
  const roots = Array.from({ length: 4 }, (_, index) => makeTempDir(`mk-spec-memory-config-${index}`));
  try {
    assert.match(await statusForHome(roots[0]), /config_status=missing/);
    assert.match(await statusForHome(roots[1], () => {
      fs.mkdirSync(path.dirname(configPath(roots[1])), { recursive: true });
      fs.writeFileSync(configPath(roots[1]), '{broken', 'utf8');
    }), /config_status=parse_error\nconfig_error_code=INVALID_JSON/);
    assert.match(await statusForHome(roots[2], () => {
      fs.mkdirSync(configPath(roots[2]), { recursive: true });
    }), /config_status=read_error/);
    assert.match(await statusForHome(roots[3], () => {
      fs.mkdirSync(path.dirname(configPath(roots[3])), { recursive: true });
      fs.writeFileSync(configPath(roots[3]), '{"cacheTtlMs":42}', 'utf8');
    }), /config_status=loaded\nconfig_error_code=none/);
  } finally {
    for (const root of roots) fs.rmSync(root, { recursive: true, force: true });
  }
});

test('uses stable bounded markers and keeps ordinary message events inside the TTL', async () => {
  const root = makeTempDir('mk-spec-memory-cache');
  const countPath = path.join(root, 'count');
  const binary = writeExecutable(root, 'bridge.js', `
const fs = require('node:fs');
const countPath = ${JSON.stringify(countPath)};
const count = Number(fs.existsSync(countPath) ? fs.readFileSync(countPath, 'utf8') : 0) + 1;
fs.writeFileSync(countPath, String(count));
process.stdin.resume();
process.stdin.on('end', () => process.stdout.write(JSON.stringify({ status: 'ok', brief: 'Continuity '.repeat(30), metadata: {} })));
`);
  try {
    const hooks = await createPlugin(binary, { directory: root, maxBriefChars: 80 });
    const output = { system: [] };
    await hooks['experimental.chat.system.transform']({ sessionID: 'cache-session' }, output);
    await hooks['experimental.chat.system.transform']({ sessionID: 'cache-session' }, output);
    assert.equal(output.system.length, 1);
    assert.ok(output.system[0].length <= 80);
    assert.match(output.system[0], /\[mk-spec-memory:continuity:[a-f0-9]{16}\]$/);

    await hooks.event({ event: { type: 'message.updated', sessionID: 'cache-session' } });
    const secondOutput = { system: [] };
    await hooks['experimental.chat.system.transform']({ sessionID: 'cache-session' }, secondOutput);
    assert.equal(readCount(countPath), 1);

    await hooks.event({ event: { type: 'session.deleted', sessionID: 'cache-session' } });
    await hooks['experimental.chat.system.transform']({ sessionID: 'cache-session' }, { system: [] });
    assert.equal(readCount(countPath), 2);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('does not let an invalidated in-flight result replace a newer lookup', async () => {
  const root = makeTempDir('mk-spec-memory-race');
  const countPath = path.join(root, 'count');
  const readyPath = path.join(root, 'first-ready');
  const binary = writeExecutable(root, 'bridge.js', `
const fs = require('node:fs');
const countPath = ${JSON.stringify(countPath)};
const readyPath = ${JSON.stringify(readyPath)};
const count = Number(fs.existsSync(countPath) ? fs.readFileSync(countPath, 'utf8') : 0) + 1;
fs.writeFileSync(countPath, String(count));
if (count === 1) fs.writeFileSync(readyPath, 'ready');
process.stdin.resume();
process.stdin.on('end', () => setTimeout(() => {
  process.stdout.write(JSON.stringify({ status: 'ok', brief: count === 1 ? 'old continuity' : 'new continuity', metadata: {} }));
}, count === 1 ? 180 : 20));
`);
  try {
    const hooks = await createPlugin(binary, { directory: root });
    const oldOutput = { system: [] };
    const oldLookup = hooks['experimental.chat.system.transform']({ sessionID: 'race-session' }, oldOutput);
    await waitForFile(readyPath);
    await hooks.event({ event: { type: 'session.deleted', sessionID: 'race-session' } });
    const newOutput = { system: [] };
    await hooks['experimental.chat.system.transform']({ sessionID: 'race-session' }, newOutput);
    await oldLookup;

    const cachedOutput = { system: [] };
    await hooks['experimental.chat.system.transform']({ sessionID: 'race-session' }, cachedOutput);
    assert.match(newOutput.system[0], /new continuity/);
    assert.match(cachedOutput.system[0], /new continuity/);
    assert.equal(readCount(countPath), 2);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('accepts bridge stdout at the ceiling and rejects the first byte over it', async () => {
  const root = makeTempDir('mk-spec-memory-output');
  const atLimit = writeExecutable(root, 'at-limit.js', `
const value = JSON.stringify({ status: 'ok', brief: 'bounded', metadata: {} });
process.stdin.resume();
process.stdin.on('end', () => process.stdout.write(value + ' '.repeat(${MAX_BRIDGE_BYTES} - Buffer.byteLength(value))));
`);
  const overLimit = writeExecutable(root, 'over-limit.js', `
process.stdin.resume();
process.stdin.on('end', () => process.stdout.write(Buffer.alloc(${MAX_BRIDGE_BYTES + 1}, 0x78)));
`);
  try {
    const acceptedHooks = await createPlugin(atLimit, { directory: root, tag: 'at-limit' });
    const acceptedOutput = { system: [] };
    await acceptedHooks['experimental.chat.system.transform']({ sessionID: 'limit-session' }, acceptedOutput);
    assert.match(acceptedOutput.system[0], /bounded/);

    const rejectedHooks = await createPlugin(overLimit, { directory: root, tag: 'over-limit' });
    const rejectedOutput = { system: [] };
    await rejectedHooks['experimental.chat.system.transform']({ sessionID: 'overflow-session' }, rejectedOutput);
    assert.deepEqual(rejectedOutput.system, []);
    const status = await rejectedHooks.tool.mk_spec_memory_status.execute();
    assert.match(status, /last_error_code=STDOUT_OVERFLOW/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('fails open when the bridge exits before consuming stdin', async () => {
  const root = makeTempDir('mk-spec-memory-epipe');
  const binary = writeExecutable(root, 'early-exit.js', 'process.exit(2);\n');
  try {
    const hooks = await createPlugin(binary, { directory: root });
    const output = { system: [] };
    await assert.doesNotReject(
      hooks['experimental.chat.system.transform']({ sessionID: 'epipe-session' }, output),
    );
    assert.deepEqual(output.system, []);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('status names the runtime continuity capability boundaries', async () => {
  const root = makeTempDir('mk-spec-memory-capability');
  const binary = writeExecutable(root, 'bridge.js', `
process.stdin.resume();
process.stdin.on('end', () => process.stdout.write(JSON.stringify({ status: 'ok', metadata: {} })));
`);
  try {
    const hooks = await createPlugin(binary, { directory: root });
    const status = await hooks.tool.mk_spec_memory_status.execute();
    assert.match(status, /continuity_recovery=per_transform_warm/);
    assert.match(status, /continuity_compaction=unsupported_runtime_event/);
    assert.match(status, /continuity_autosave=unsupported_runtime_event/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('deduplicates marked synthetic text parts with unrelated extra fields', async () => {
  const source = fs.readFileSync(SCHEMA_PATH, 'utf8');
  const functionMatch = source.match(
    /export function hasSyntheticTextPartMarker\([\s\S]*?\n}\n/,
  );
  assert.ok(functionMatch, 'marker inspection function must remain directly testable');
  const hasSyntheticTextPartMarker = Function(
    `${functionMatch[0].replace('export ', '')}; return hasSyntheticTextPartMarker;`,
  )();
  const part = {
    id: 'part-1',
    sessionID: 'session-1',
    messageID: 'message-1',
    type: 'text',
    text: 'context',
    synthetic: true,
    metadata: { marker: 'dedupe-key', extraMetadata: true },
    addedByRuntime: 'future-field',
  };
  assert.equal(hasSyntheticTextPartMarker([part], 'marker', 'dedupe-key'), true);
  assert.equal(hasSyntheticTextPartMarker([{ ...part, synthetic: false }], 'marker', 'dedupe-key'), true);
  assert.equal(hasSyntheticTextPartMarker([{ ...part, type: 'tool' }], 'marker', 'dedupe-key'), false);
  assert.equal(hasSyntheticTextPartMarker([{ ...part, metadata: { marker: 'other' } }], 'marker', 'dedupe-key'), false);
  assert.match(source, /const parsed = textPartSchema\.safeParse\(candidate\)/);
});

test('UserPromptSubmit passes through one valid JSON line', () => {
  const { result } = runUserPromptFixture(
    "process.stdin.resume(); process.stdin.on('end', () => process.stdout.write('{\"ok\":true}'));\n",
    '{"prompt":"hello"}',
  );
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '{"ok":true}\n');
});

test('UserPromptSubmit maps malformed and nonzero child output to the safe JSON default', () => {
  const malformed = runUserPromptFixture("process.stdout.write('not-json');\n", '{}').result;
  const crashed = runUserPromptFixture('process.exit(3);\n', '{}').result;
  assert.equal(malformed.status, 0);
  assert.equal(malformed.stdout, '{}\n');
  assert.match(malformed.stderr, /INVALID_JSON/);
  assert.equal(crashed.status, 0);
  assert.equal(crashed.stdout, '{}\n');
  assert.match(crashed.stderr, /NONZERO_EXIT/);
});

test('UserPromptSubmit terminates a hanging child inside the outer hook budget', () => {
  const { result, durationMs } = runUserPromptFixture('setTimeout(() => {}, 10000);\n', '{}', 4000);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '{}\n');
  assert.match(result.stderr, /CHILD_TIMEOUT/);
  assert.ok(durationMs < 3000, `expected timeout below 3000ms, got ${durationMs}ms`);
});

test('UserPromptSubmit bounds both stdin and captured child output', () => {
  const outputOverflow = runUserPromptFixture(
    `process.stdout.write('x'.repeat(${MAX_BRIDGE_BYTES + 1}));\n`,
    '{}',
  ).result;
  const inputOverflow = runUserPromptFixture(
    "process.stdin.resume(); process.stdin.on('end', () => process.stdout.write('{}'));\n",
    'x'.repeat(MAX_BRIDGE_BYTES + 1),
  ).result;
  assert.equal(outputOverflow.status, 0);
  assert.equal(outputOverflow.stdout, '{}\n');
  assert.match(outputOverflow.stderr, /OUTPUT_OVERFLOW/);
  assert.equal(inputOverflow.status, 0);
  assert.equal(inputOverflow.stdout, '{}\n');
  assert.match(inputOverflow.stderr, /INPUT_OVERFLOW/);
});

test('Claude hook sources pin bounded, truthful, snapshot-consistent behavior', () => {
  const prime = fs.readFileSync(path.join(HOOK_ROOT, 'session-prime.ts'), 'utf8');
  const compact = fs.readFileSync(path.join(HOOK_ROOT, 'compact-inject.ts'), 'utf8');
  const stop = fs.readFileSync(path.join(HOOK_ROOT, 'session-stop.ts'), 'utf8');
  const shared = fs.readFileSync(path.join(HOOK_ROOT, 'shared.ts'), 'utf8');

  const resumeBlock = prime.slice(prime.indexOf('function handleResume'), prime.indexOf('function handleClear'));
  assert.doesNotMatch(resumeBlock, /title: 'Session Continuity'/);
  assert.match(resumeBlock, /title: 'Session Resume'/);

  assert.doesNotMatch(stop, /runContextAutosaveCliFallback|runWarmSpecMemoryCliTool|'deferred'/);
  assert.match(stop, /!autosaveState \|\| !patch\.sessionSummary/);
  assert.match(stop, /fd: fileDescriptor/);
  assert.match(stop, /end: endOffset - 1/);
  assert.match(stop, /autoClose: false/);
  assert.match(stop, /const transcriptStat = fstatSync\(openedDescriptor\)/);

  const tailBlock = compact.slice(compact.indexOf('export function tailFile'), compact.indexOf('function extractFilePaths'));
  assert.match(tailBlock, /MAX_TAIL_READ_BYTES/);
  assert.match(tailBlock, /readSync\(/);
  assert.doesNotMatch(tailBlock, /readFileSync\(/);
  assert.doesNotMatch(compact, /buildMergedPayloadContract|truncateToTokenBudget/);
  assert.match(compact, /renderBudgetedSections/);
  assert.ok(compact.indexOf('persistCompactResult(sessionId, baseline') < compact.indexOf('buildMergedCompactResult(transcriptLines'));
  assert.ok(compact.indexOf('persistCompactResult(sessionId, baseline') < compact.indexOf('runAuthoredSnapshot(transcriptLines'));
  assert.match(compact, /--authored-snapshot-worker/);
  assert.match(compact, /timeout,/);

  assert.match(shared, /MAX_HOOK_STDIN_BYTES/);
  assert.match(shared, /process\.stdin\.destroy\(\)/);
});
