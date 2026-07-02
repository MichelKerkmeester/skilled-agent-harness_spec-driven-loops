// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-dist-freshness-guard Regression Tests                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the plugin export shape and warn-only freshness behavior    ║
// ║          against hermetic package fixtures.                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

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

async function captureWarns(callback) {
  const warnings = [];
  const originalWarn = console.warn;
  const originalError = console.error;
  console.warn = (message) => warnings.push(String(message));
  console.error = (message) => warnings.push(String(message));
  try {
    await callback();
  } finally {
    console.warn = originalWarn;
    console.error = originalError;
  }
  return warnings;
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
    assert.equal(typeof beforeHook, 'function');
    assert.equal(typeof eventHook, 'function');

    let warnings = await captureWarns(async () => {
      await beforeHook({ tool: 'read' }, { args: { command: 'validate.sh fixture' } });
      await beforeHook({ tool: 'bash' }, { args: { command: 'node scripts/safe.js' } });
    });
    assert.equal(warnings.length, 0, 'non-bash and unrelated bash commands must not warn');

    warnings = await captureWarns(async () => {
      await beforeHook({ tool: 'bash' }, { args: { command: 'bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh fixture' } });
    });
    assert.equal(warnings.length, 1, 'stale package must warn before validate.sh');
    assert.match(warnings[0], /STALE DIST WARNING: @utcp\/code-mode-mcp/);
    assert.match(warnings[0], /cd \.opencode\/skills\/mcp-code-mode\/mcp_server && npm run build/);

    warnings = await captureWarns(async () => {
      await beforeHook({ tool: 'bash' }, { args: { nested: { command: 'opencode run task' } } });
    });
    assert.equal(warnings.length, 1, 'fallback arg stringify must detect opencode run');

    warnings = await captureWarns(async () => {
      await eventHook({ event: { type: 'session.created', sessionID: 'session-a' } });
      await eventHook({ event: { type: 'session.created', sessionID: 'session-a' } });
    });
    assert.equal(warnings.length, 1, 'session.created summary must emit once per session');
    assert.match(warnings[0], /session\.created/);

    writeCodeModeFixture(tmpDir, false);
    warnings = await captureWarns(async () => {
      await beforeHook({ tool: 'bash' }, { args: { command: 'validate.sh fixture' } });
      await eventHook({ event: { type: 'session.created', sessionID: 'session-b' } });
    });
    assert.equal(warnings.length, 0, 'fresh dist must not warn');

    await assert.doesNotReject(async () => {
      await beforeHook({ tool: 'bash' }, { args: null });
      await eventHook({ event: { type: 'session.created', sessionID: 'session-c' } });
    }, 'plugin must never throw on malformed fixtures');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  console.log('mk-dist-freshness-guard.test.cjs: all assertions passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
