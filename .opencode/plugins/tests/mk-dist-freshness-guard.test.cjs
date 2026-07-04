// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-dist-freshness-guard Regression Tests                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the plugin export shape and warn-only freshness behavior    ║
// ║          against hermetic package fixtures, and prove the guard never    ║
// ║          writes to the terminal (the TUI-overlay regression).            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const GUARD_LOG_RELATIVE = path.join('.opencode', 'logs', 'dist-freshness-guard.log');

function writeFileWithMtime(filePath, content, mtimeMs) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  const mtime = new Date(mtimeMs);
  fs.utimesSync(filePath, mtime, mtime);
}

function writeCodeModeFixture(dir, stale) {
  const packageDir = path.join(dir, '.opencode', 'skills', 'mcp-code-mode', 'mcp_server');
  const sourceMtime = Date.now();
  const distMtime = stale ? sourceMtime - 10_000 : sourceMtime + 10_000;

  writeFileWithMtime(path.join(packageDir, 'package.json'), '{"scripts":{"build":"tsc"}}\n', sourceMtime);
  writeFileWithMtime(path.join(packageDir, 'tsconfig.json'), '{"include":["index.ts"]}\n', sourceMtime);
  writeFileWithMtime(path.join(packageDir, 'index.ts'), 'export const value = 1;\n', sourceMtime);
  writeFileWithMtime(path.join(packageDir, 'dist', 'index.js'), 'export const value = 1;\n', distMtime);
}

async function loadPlugin() {
  const pluginUrl = pathToFileURL(path.join(__dirname, '..', 'mk-dist-freshness-guard.js')).href;
  return import(pluginUrl);
}

function guardLogLineCount(dir) {
  try {
    const text = fs.readFileSync(path.join(dir, GUARD_LOG_RELATIVE), 'utf8');
    return text.trimEnd() ? text.trimEnd().split('\n').filter(Boolean).length : 0;
  } catch (_) {
    return 0;
  }
}

function readGuardLog(dir) {
  try {
    return fs.readFileSync(path.join(dir, GUARD_LOG_RELATIVE), 'utf8');
  } catch (_) {
    return '';
  }
}

// Run a plugin interaction with console.warn/error/log trapped, and return any
// captured calls -- the guard must NEVER write to the terminal (that is exactly
// the overlay that corrupts the OpenCode chat input).
async function runTrapped(callback) {
  const consoleCalls = [];
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalLog = console.log;
  console.warn = (message) => consoleCalls.push(`warn:${message}`);
  console.error = (message) => consoleCalls.push(`error:${message}`);
  console.log = (message) => consoleCalls.push(`log:${message}`);
  try {
    await callback();
  } finally {
    console.warn = originalWarn;
    console.error = originalError;
    console.log = originalLog;
  }
  return consoleCalls;
}

async function main() {
  const pluginModule = await loadPlugin();
  assert.deepEqual(Object.keys(pluginModule), ['default']);
  assert.equal(typeof pluginModule.default, 'function');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mk-dist-freshness-guard-'));
  try {
    writeCodeModeFixture(tmpDir, true);
    const hooks = await pluginModule.default({ directory: tmpDir });
    const beforeHook = hooks['tool.execute.before'];
    const eventHook = hooks.event;
    const transformHook = hooks['experimental.chat.system.transform'];
    assert.equal(typeof beforeHook, 'function');
    assert.equal(typeof eventHook, 'function');
    assert.equal(typeof transformHook, 'function');

    // Non-bash and unrelated bash commands never trigger a freshness check.
    let before = guardLogLineCount(tmpDir);
    let console1 = await runTrapped(async () => {
      await beforeHook({ tool: 'read' }, { args: { command: 'validate.sh fixture' } });
      await beforeHook({ tool: 'bash' }, { args: { command: 'node scripts/safe.js' } });
    });
    assert.equal(console1.length, 0, 'plugin must never write to the console');
    assert.equal(guardLogLineCount(tmpDir) - before, 0, 'non-risky commands must not log');

    // Stale package + risky validate.sh logs exactly one warning (to file, not console).
    before = guardLogLineCount(tmpDir);
    let console2 = await runTrapped(async () => {
      await beforeHook({ tool: 'bash' }, { args: { command: 'bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh fixture' } });
    });
    assert.equal(console2.length, 0, 'stale warning must not reach the console');
    assert.equal(guardLogLineCount(tmpDir) - before, 1, 'stale package must log once before validate.sh');
    let log = readGuardLog(tmpDir);
    assert.match(log, /STALE DIST WARNING: @utcp\/code-mode-mcp/);
    assert.match(log, /cd \.opencode\/skills\/mcp-code-mode\/mcp_server && npm run build/);

    // The stale signal reaches the agent via bounded system-context injection.
    const transformOut = { system: [] };
    let console3 = await runTrapped(async () => {
      await transformHook({}, transformOut);
    });
    assert.equal(console3.length, 0, 'transform must not reach the console');
    assert.equal(transformOut.system.length, 1, 'stale dist must inject exactly one bounded system brief');
    assert.match(transformOut.system[0], /dist-freshness-guard/);
    assert.match(transformOut.system[0], /STALE DIST WARNING: @utcp\/code-mode-mcp/);

    // Fallback arg stringify still detects opencode run.
    before = guardLogLineCount(tmpDir);
    let console4 = await runTrapped(async () => {
      await beforeHook({ tool: 'bash' }, { args: { nested: { command: 'opencode run task' } } });
    });
    assert.equal(console4.length, 0, 'plugin must never write to the console');
    assert.equal(guardLogLineCount(tmpDir) - before, 1, 'fallback arg stringify must detect opencode run');

    // session.created logs once per session (dedupe).
    before = guardLogLineCount(tmpDir);
    let console5 = await runTrapped(async () => {
      await eventHook({ event: { type: 'session.created', sessionID: 'session-a' } });
      await eventHook({ event: { type: 'session.created', sessionID: 'session-a' } });
    });
    assert.equal(console5.length, 0, 'session warning must not reach the console');
    assert.equal(guardLogLineCount(tmpDir) - before, 1, 'session.created summary must log once per session');

    // Fresh dist: no new log line, and no system injection.
    writeCodeModeFixture(tmpDir, false);
    before = guardLogLineCount(tmpDir);
    const freshTransformOut = { system: [] };
    let console6 = await runTrapped(async () => {
      await beforeHook({ tool: 'bash' }, { args: { command: 'validate.sh fixture' } });
      await eventHook({ event: { type: 'session.created', sessionID: 'session-b' } });
      await transformHook({}, freshTransformOut);
    });
    assert.equal(console6.length, 0, 'plugin must never write to the console');
    assert.equal(guardLogLineCount(tmpDir) - before, 0, 'fresh dist must not log');
    assert.equal(freshTransformOut.system.length, 0, 'fresh dist must not inject a system brief');

    // Malformed fixtures never throw and never reach the console.
    let console7 = await runTrapped(async () => {
      await assert.doesNotReject(async () => {
        await beforeHook({ tool: 'bash' }, { args: null });
        await eventHook({ event: { type: 'session.created', sessionID: 'session-c' } });
        await transformHook({}, null);
      }, 'plugin must never throw on malformed fixtures');
    });
    assert.equal(console7.length, 0, 'plugin must never write to the console');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  console.log('mk-dist-freshness-guard.test.cjs: all assertions passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
