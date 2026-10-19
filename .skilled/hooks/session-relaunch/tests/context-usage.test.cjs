// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Context Usage Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  readClaudeFill,
  resolveWindow,
  fillRatio,
  fillFromPiUsage,
  fillFromOpenCodeTokens,
  readCodexUsage,
  resolveCodexWindow,
} = require('../lib/context-usage.cjs');

const TRANSCRIPT_FIXTURE = path.join(__dirname, 'fixtures', 'transcript-usage.jsonl');
const PI_CAPTURE = require('./fixtures/pi-assistant-message-end.json');
const OPENCODE_CAPTURE = require('./fixtures/opencode-assistant-message-updated.json');
const CODEX_ROLLOUT_CAPTURE = require('./fixtures/codex-rollout-token-count.json');

function createSandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-usage-'));
  const repoRoot = path.join(root, 'repo');
  const xdgRuntimeDir = path.join(root, 'runtime');
  const home = path.join(root, 'home');
  fs.mkdirSync(repoRoot, { recursive: true });
  fs.mkdirSync(xdgRuntimeDir, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  const env = { ...process.env, HOME: home, XDG_RUNTIME_DIR: xdgRuntimeDir, SESSION_RELAUNCH_REPO_ROOT: repoRoot };
  for (const key of [
    'SESSION_RELAUNCH_WINDOW_TOKENS',
    'SYSTEM_SESSION_RELAUNCH_DISABLED',
    'SKILLED_LOOP_ID',
    'SKILLED_LOOP_HOPS',
  ]) delete env[key];
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, repoRoot, xdgRuntimeDir, home, env };
}

function writeSettings(directory, fileName, autoCompactWindow) {
  const settingsPath = path.join(directory, '.claude', fileName);
  fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
  fs.writeFileSync(settingsPath, JSON.stringify({ autoCompactWindow }));
  return settingsPath;
}

function mainEntryFromFixture() {
  return fs.readFileSync(TRANSCRIPT_FIXTURE, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line))[1];
}

test('readClaudeFill uses the last main-chain usage, not sidechain or cumulative usage', (t) => {
  const sandbox = createSandbox(t);
  const result = readClaudeFill(TRANSCRIPT_FIXTURE, { tailBytes: 262144, env: sandbox.env });
  assert.deepEqual(result, { fillTokens: 400843, model: 'claude-haiku-5-5' });
  assert.notEqual(result.fillTokens, 900002);
});

test('resolveWindow gives SESSION_RELAUNCH_WINDOW_TOKENS precedence over settings', (t) => {
  const sandbox = createSandbox(t);
  writeSettings(sandbox.repoRoot, 'settings.local.json', 710000);
  writeSettings(sandbox.repoRoot, 'settings.json', 620000);
  writeSettings(sandbox.home, 'settings.json', 590000);
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '880000';
  assert.equal(
    resolveWindow({
      env: sandbox.env,
      cwd: sandbox.repoRoot,
      home: sandbox.home,
      model: 'claude-haiku-5-5',
    }),
    880000,
  );
});

test('resolveWindow prefers settings.local.json over project and home settings', (t) => {
  const sandbox = createSandbox(t);
  writeSettings(sandbox.repoRoot, 'settings.local.json', 710000);
  writeSettings(sandbox.repoRoot, 'settings.json', 620000);
  writeSettings(sandbox.home, 'settings.json', 590000);
  assert.equal(
    resolveWindow({
      env: sandbox.env,
      cwd: sandbox.repoRoot,
      home: sandbox.home,
      model: 'claude-haiku-5-5',
    }),
    710000,
  );
});

test('resolveWindow uses project settings.json before the home setting', (t) => {
  const sandbox = createSandbox(t);
  writeSettings(sandbox.repoRoot, 'settings.json', 620000);
  writeSettings(sandbox.home, 'settings.json', 590000);
  assert.equal(
    resolveWindow({
      env: sandbox.env,
      cwd: sandbox.repoRoot,
      home: sandbox.home,
      model: 'claude-haiku-5-5',
    }),
    620000,
  );
});

test('resolveWindow treats settings read errors as absent', (t) => {
  const sandbox = createSandbox(t);
  const unreadablePath = writeSettings(sandbox.repoRoot, 'settings.local.json', 710000);
  writeSettings(sandbox.repoRoot, 'settings.json', 620000);
  const originalReadFileSync = fs.readFileSync;
  fs.readFileSync = function (filePath, ...args) {
    if (filePath === unreadablePath) {
      const error = new Error('permission denied');
      error.code = 'EACCES';
      throw error;
    }
    return originalReadFileSync.call(this, filePath, ...args);
  };
  t.after(() => {
    fs.readFileSync = originalReadFileSync;
  });

  assert.equal(
    resolveWindow({
      env: sandbox.env,
      cwd: sandbox.repoRoot,
      home: sandbox.home,
      model: 'claude-haiku-5-5',
    }),
    620000,
  );
});

test('resolveWindow falls back to the home Claude setting', (t) => {
  const sandbox = createSandbox(t);
  writeSettings(sandbox.home, 'settings.json', 590000);
  assert.equal(
    resolveWindow({
      env: sandbox.env,
      cwd: sandbox.repoRoot,
      home: sandbox.home,
      model: 'claude-haiku-5-5',
    }),
    590000,
  );
});

test('resolveWindow selects a one-million-token window for a model containing [1m]', (t) => {
  const sandbox = createSandbox(t);
  assert.equal(
    resolveWindow({
      env: sandbox.env,
      cwd: sandbox.repoRoot,
      home: sandbox.home,
      model: 'claude-haiku-5-5[1m]',
    }),
    1000000,
  );
});

test('resolveWindow defaults to a 200000-token window', (t) => {
  const sandbox = createSandbox(t);
  assert.equal(
    resolveWindow({
      env: sandbox.env,
      cwd: sandbox.repoRoot,
      home: sandbox.home,
      model: 'claude-haiku-5-5',
    }),
    200000,
  );
});

test('readClaudeFill finds a complete entry at the end of a long transcript', (t) => {
  const sandbox = createSandbox(t);
  const entry = mainEntryFromFixture();
  const targetLine = JSON.stringify(entry);
  const olderEntry = JSON.stringify({
    type: 'user',
    message: { content: 'older transcript entry' },
  });
  const padding = `${olderEntry}\n`.repeat(100);
  const transcriptPath = path.join(sandbox.repoRoot, 'large-transcript.jsonl');
  fs.writeFileSync(transcriptPath, `${padding}${targetLine}\n`);
  const result = readClaudeFill(transcriptPath, {
    tailBytes: Buffer.byteLength(targetLine) + 1,
    env: sandbox.env,
  });
  assert.deepEqual(result, { fillTokens: 400843, model: 'claude-haiku-5-5' });
});

test('readClaudeFill treats transcript read errors as absent', (t) => {
  const sandbox = createSandbox(t);
  const transcriptPath = path.join(sandbox.repoRoot, 'unreadable-transcript.jsonl');
  const originalOpenSync = fs.openSync;
  fs.openSync = function (filePath, ...args) {
    if (filePath === transcriptPath) {
      const error = new Error('permission denied');
      error.code = 'EACCES';
      throw error;
    }
    return originalOpenSync.call(this, filePath, ...args);
  };
  t.after(() => {
    fs.openSync = originalOpenSync;
  });

  assert.equal(readClaudeFill(transcriptPath), null);
});

test('fillRatio divides plainly and returns zero for a zero window', (t) => {
  createSandbox(t);
  assert.equal(fillRatio(400843, 500000), 400843 / 500000);
  assert.equal(fillRatio(400843, 0), 0);
});

test('fillFromPiUsage reads the assistant usage payload captured from Pi', () => {
  assert.equal(typeof fillFromPiUsage, 'function');
  assert.equal(fillFromPiUsage(PI_CAPTURE.usage), 1627);
});

test('fillFromOpenCodeTokens reads the completed assistant tokens captured from OpenCode', () => {
  assert.equal(typeof fillFromOpenCodeTokens, 'function');
  assert.equal(fillFromOpenCodeTokens(OPENCODE_CAPTURE.properties.info.tokens), 17444);
});

test('Pi and OpenCode usage helpers treat missing fields as zero', () => {
  assert.equal(typeof fillFromPiUsage, 'function');
  assert.equal(typeof fillFromOpenCodeTokens, 'function');
  assert.equal(fillFromPiUsage({}), 0);
  assert.equal(fillFromPiUsage({ input: 7 }), 7);
  assert.equal(fillFromOpenCodeTokens({}), 0);
  assert.equal(fillFromOpenCodeTokens({ input: 7 }), 7);
});

test('readCodexUsage selects the latest token_count and its last input usage', (t) => {
  const sandbox = createSandbox(t);
  const earlier = JSON.parse(JSON.stringify(CODEX_ROLLOUT_CAPTURE));
  earlier.payload.info.last_token_usage.input_tokens = 12000;
  const unrelated = { type: 'token_usage_record', payload: {} };
  const latest = JSON.parse(JSON.stringify(CODEX_ROLLOUT_CAPTURE));
  latest.payload.info.total_token_usage.input_tokens = 99000;
  latest.payload.info.last_token_usage.input_tokens = 13523;
  const transcriptPath = path.join(sandbox.repoRoot, 'codex-rollout.jsonl');
  fs.writeFileSync(
    transcriptPath,
    [earlier, unrelated, latest].map((entry) => JSON.stringify(entry)).join('\n') + '\n',
  );

  assert.deepEqual(readCodexUsage(transcriptPath), {
    fillTokens: 13523,
    modelContextWindow: 258400,
  });
});

test('readCodexUsage treats missing rollout files as absent', (t) => {
  const sandbox = createSandbox(t);
  const transcriptPath = path.join(sandbox.repoRoot, 'missing-codex-rollout.jsonl');
  assert.equal(readCodexUsage(transcriptPath), null);
});

test('resolveCodexWindow prefers the shared override to the rollout window', () => {
  assert.equal(
    resolveCodexWindow(258400, { SESSION_RELAUNCH_WINDOW_TOKENS: '100000' }),
    100000,
  );
  assert.equal(resolveCodexWindow(258400, {}), 258400);
  assert.equal(resolveCodexWindow(null, {}), null);
});

test('resolveWindow reads the repository settings from a subdirectory cwd', (t) => {
  const sandbox = createSandbox(t);
  fs.mkdirSync(path.join(sandbox.repoRoot, '.git'));
  writeSettings(sandbox.repoRoot, 'settings.json', 620000);
  writeSettings(sandbox.home, 'settings.json', 590000);
  const subdirectory = path.join(sandbox.repoRoot, 'packages', 'app');
  fs.mkdirSync(subdirectory, { recursive: true });
  assert.equal(
    resolveWindow({ env: sandbox.env, cwd: subdirectory, home: sandbox.home, model: 'claude-haiku-5-5' }),
    620000,
  );
  // A nearer settings file wins over the repository root's.
  writeSettings(path.join(sandbox.repoRoot, 'packages'), 'settings.local.json', 640000);
  assert.equal(
    resolveWindow({ env: sandbox.env, cwd: subdirectory, home: sandbox.home, model: 'claude-haiku-5-5' }),
    640000,
  );
});

test('resolveWindow stops at the repository boundary and walks nowhere outside a repository', (t) => {
  const sandbox = createSandbox(t);
  // A worktree marks its root with a .git file rather than a directory.
  fs.writeFileSync(path.join(sandbox.repoRoot, '.git'), 'gitdir: /elsewhere\n');
  writeSettings(sandbox.root, 'settings.json', 700000);
  const inside = path.join(sandbox.repoRoot, 'sub');
  fs.mkdirSync(inside);
  assert.equal(
    resolveWindow({ env: sandbox.env, cwd: inside, home: sandbox.home, model: 'claude-haiku-5-5' }),
    200000,
  );

  const outside = path.join(sandbox.root, 'loose', 'dir');
  fs.mkdirSync(outside, { recursive: true });
  assert.equal(
    resolveWindow({ env: sandbox.env, cwd: outside, home: sandbox.home, model: 'claude-haiku-5-5' }),
    200000,
  );
});
