// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-dist-freshness-guard Regression Tests                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the plugin export shape and warn-only freshness behavior    ║
// ║          against hermetic package fixtures, and prove the guard never    ║
// ║          writes to the terminal (the TUI-overlay regression).            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const GUARD_LOG_RELATIVE = path.join('.opencode', 'logs', 'dist-freshness-guard.log');
const DIST_FRESHNESS_PATH = path.join(
  __dirname,
  '..',
  '..',
  'skills',
  'system-spec-kit',
  'scripts',
  'lib',
  'dist-freshness.cjs',
);
const CLAUDE_HOOK_PATH = path.join(
  __dirname,
  '..',
  '..',
  'skills',
  'sk-code',
  'code-quality',
  'scripts',
  'hooks',
  'claude-posttooluse.sh',
);
const CHECK_DIST_WRAPPER = path.join(
  __dirname,
  '..',
  '..',
  'skills',
  'sk-code',
  'code-quality',
  'scripts',
  'check-dist-staleness.sh',
);
const CHECKER_REL = path.join(
  '.opencode', 'skills', 'system-spec-kit', 'scripts', 'lib', 'dist-freshness.cjs',
);
const distFreshness = require(DIST_FRESHNESS_PATH);

// Drop a stub node checker at the workspace-relative path the wrapper resolves
// from os.getcwd(), so the wrapper's cwd branch runs it instead of the real one.
function writeFakeChecker(dir, body) {
  const checkerPath = path.join(dir, CHECKER_REL);
  fs.mkdirSync(path.dirname(checkerPath), { recursive: true });
  fs.writeFileSync(checkerPath, body);
  return checkerPath;
}

function writeFileWithMtime(filePath, content, mtimeMs) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  const mtime = new Date(mtimeMs);
  fs.utimesSync(filePath, mtime, mtime);
}

function writeCodeModeFixture(dir, stale) {
  const packageDir = path.join(dir, '.opencode', 'skills', 'mcp-code-mode', 'mcp-server');
  const sourceMtime = Date.now();
  const distMtime = stale ? sourceMtime - 10_000 : sourceMtime + 10_000;

  writeFileWithMtime(path.join(packageDir, 'package.json'), '{"scripts":{"build":"tsc"}}\n', sourceMtime);
  writeFileWithMtime(path.join(packageDir, 'tsconfig.json'), '{"include":["index.ts"]}\n', sourceMtime);
  writeFileWithMtime(path.join(packageDir, 'index.ts'), 'export const value = 1;\n', sourceMtime);
  writeFileWithMtime(path.join(packageDir, 'dist', 'index.js'), 'export const value = 1;\n', distMtime);
  return {
    packageDir,
    sourcePath: path.join(packageDir, 'index.ts'),
    distPath: path.join(packageDir, 'dist', 'index.js'),
  };
}

function fixtureContent(filePath) {
  return path.extname(filePath) === '.json' ? '{}\n' : 'export const fixture = true;\n';
}

function writeAllPackageFixtures(dir) {
  const sourceMtime = Date.now();
  const distMtime = sourceMtime + 10_000;
  for (const pkg of distFreshness.DIST_PACKAGES) {
    const packageDir = path.join(dir, pkg.root);
    for (const candidate of pkg.sourceCandidates) {
      const candidatePath = path.resolve(packageDir, candidate);
      const basename = path.basename(candidatePath);
      if (path.extname(basename) || basename === 'package.json') {
        writeFileWithMtime(candidatePath, fixtureContent(candidatePath), sourceMtime);
      } else {
        writeFileWithMtime(path.join(candidatePath, 'fixture.ts'), 'export const fixture = true;\n', sourceMtime);
      }
    }
    for (const distEntry of Object.values(pkg.distEntries)) {
      writeFileWithMtime(path.join(packageDir, distEntry), 'export const fixture = true;\n', distMtime);
    }
  }
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

function temporaryDirectory(t, prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

test('exports only the OpenCode plugin factory', async () => {
  const pluginModule = await loadPlugin();
  assert.deepEqual(Object.keys(pluginModule), ['default']);
  assert.equal(typeof pluginModule.default, 'function');
});

test('injects stale and check-error diagnostics without terminal output', async (t) => {
  const tmpDir = temporaryDirectory(t, 'mk-dist-freshness-guard-diagnostics-');
  writeCodeModeFixture(tmpDir, true);
  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default({ directory: tmpDir });
  const beforeHook = hooks['tool.execute.before'];
  const transformHook = hooks['experimental.chat.system.transform'];
  const before = guardLogLineCount(tmpDir);
  const output = { system: [] };

  const consoleCalls = await runTrapped(async () => {
    await beforeHook({ tool: 'bash' }, { args: { command: 'validate.sh fixture' } });
    await transformHook({}, output);
  });

  assert.deepEqual(consoleCalls, []);
  assert.equal(guardLogLineCount(tmpDir) - before, 1);
  assert.equal(output.system.length, 1);
  assert.match(output.system[0], /STALE DIST WARNING: @utcp\/code-mode-mcp/);
  assert.match(output.system[0], /CHECK ERROR/);
  assert.ok(output.system[0].split('\n').length <= 10, 'system brief must remain bounded');
});

test('invalidates a warm cache for watched source mutations', async (t) => {
  for (const tool of ['write', 'edit', 'apply_patch']) {
    const tmpDir = temporaryDirectory(t, `mk-dist-freshness-guard-${tool}-`);
    writeAllPackageFixtures(tmpDir);
    const fixture = writeCodeModeFixture(tmpDir, false);
    assert.equal(distFreshness.preparePackageBuild('mcp-code-mode/mcp-server', { workspaceRoot: tmpDir }).status, 'prepared');
    assert.equal(distFreshness.recordPackageBuild('mcp-code-mode/mcp-server', { workspaceRoot: tmpDir }).status, 'recorded');

    const pluginModule = await loadPlugin();
    const hooks = await pluginModule.default({ directory: tmpDir });
    const firstOutput = { system: [] };
    await hooks['experimental.chat.system.transform']({}, firstOutput);
    assert.deepEqual(firstOutput.system, [], `${tool} fixture must start fresh`);

    const oldMtime = fs.statSync(fixture.sourcePath).mtime;
    fs.writeFileSync(fixture.sourcePath, 'export const value = 2;\n');
    fs.utimesSync(fixture.sourcePath, oldMtime, oldMtime);
    const args = tool === 'apply_patch' ? {} : { filePath: fixture.sourcePath };
    await hooks['tool.execute.before']({ tool }, { args });
    const nextOutput = { system: [] };
    await hooks['experimental.chat.system.transform']({}, nextOutput);
    assert.match(nextOutput.system[0], /STALE DIST WARNING: @utcp\/code-mode-mcp/);
  }
});

test('bounds session state and rotates the audit log', async (t) => {
  const tmpDir = temporaryDirectory(t, 'mk-dist-freshness-guard-retention-');
  writeCodeModeFixture(tmpDir, true);
  const logPath = path.join(tmpDir, GUARD_LOG_RELATIVE);
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.writeFileSync(logPath, 'x'.repeat(256 * 1024));

  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default({ directory: tmpDir });
  await hooks.event({ event: { type: 'session.created', sessionID: 'session-a' } });
  const afterFirst = guardLogLineCount(tmpDir);
  assert.ok(fs.existsSync(`${logPath}.1`));
  assert.equal(fs.statSync(`${logPath}.1`).size, 256 * 1024);
  assert.ok(fs.statSync(logPath).size < 256 * 1024);

  await hooks.event({ event: { type: 'session.created', sessionID: 'session-a' } });
  assert.equal(guardLogLineCount(tmpDir), afterFirst);
  await hooks.event({ event: { type: 'session.deleted', properties: { info: { id: 'session-a' } } } });
  await hooks.event({ event: { type: 'session.created', sessionID: 'session-a' } });
  assert.equal(guardLogLineCount(tmpDir), afterFirst + 1);
  await hooks.event({ event: { type: 'global.disposed' } });
  await hooks.event({ event: { type: 'session.created', sessionID: 'session-a' } });
  assert.equal(guardLogLineCount(tmpDir), afterFirst + 2);
});

test('evicts the oldest session ID when the deduplication cap is reached', async (t) => {
  const tmpDir = temporaryDirectory(t, 'mk-dist-freshness-guard-session-cap-');
  writeAllPackageFixtures(tmpDir);
  const fixture = writeCodeModeFixture(tmpDir, true);
  const pluginModule = await loadPlugin();
  const hooks = await pluginModule.default({ directory: tmpDir });

  for (let index = 0; index <= 1_000; index += 1) {
    await hooks.event({ event: { type: 'session.created', sessionID: `session-${index}` } });
  }
  const beforeReplay = guardLogLineCount(tmpDir);
  await hooks.event({ event: { type: 'session.created', sessionID: 'session-0' } });
  assert.equal(guardLogLineCount(tmpDir), beforeReplay + 1);
  assert.ok(fs.existsSync(fixture.sourcePath));
});

test('requires staged build provenance and verifies source and dist content', (t) => {
  const tmpDir = temporaryDirectory(t, 'dist-freshness-attestation-');
  const fixture = writeCodeModeFixture(tmpDir, false);
  const options = { workspaceRoot: tmpDir };

  assert.equal(distFreshness.preparePackageBuild('mcp-code-mode/mcp-server', options).status, 'prepared');
  assert.equal(distFreshness.recordPackageBuild('mcp-code-mode/mcp-server', options).status, 'recorded');
  assert.equal(distFreshness.checkPackageFreshness('mcp-code-mode/mcp-server', options).origin, 'build');

  const sourceMtime = fs.statSync(fixture.sourcePath).mtime;
  fs.writeFileSync(fixture.sourcePath, 'export const value = 2;\n');
  fs.utimesSync(fixture.sourcePath, sourceMtime, sourceMtime);
  assert.equal(distFreshness.checkPackageFreshness('mcp-code-mode/mcp-server', options).status, 'stale');

  fs.writeFileSync(fixture.sourcePath, 'export const value = 1;\n');
  fs.utimesSync(fixture.sourcePath, sourceMtime, sourceMtime);
  const distStat = fs.statSync(fixture.distPath);
  fs.writeFileSync(fixture.distPath, 'export const value = 2;\n');
  fs.utimesSync(fixture.distPath, distStat.atime, distStat.mtime);
  assert.equal(fs.statSync(fixture.distPath).size, distStat.size);
  assert.equal(distFreshness.checkPackageFreshness('mcp-code-mode/mcp-server', options).status, 'stale');
});

test('refuses promotion when watched input changes during a build', (t) => {
  const tmpDir = temporaryDirectory(t, 'dist-freshness-race-');
  const fixture = writeCodeModeFixture(tmpDir, false);
  const options = { workspaceRoot: tmpDir };
  assert.equal(distFreshness.preparePackageBuild('mcp-code-mode/mcp-server', options).status, 'prepared');
  fs.writeFileSync(fixture.sourcePath, 'export const value = 2;\n');
  const result = distFreshness.recordPackageBuild('mcp-code-mode/mcp-server', options);
  assert.equal(result.status, 'error');
  assert.match(result.message, /changed while building/);
});

test('keeps JSON build inputs watched and preserves checker mtime fallback', (t) => {
  const tmpDir = temporaryDirectory(t, 'dist-freshness-json-');
  writeAllPackageFixtures(tmpDir);
  const jsonPath = path.join(
    tmpDir,
    '.opencode',
    'skills',
    'system-skill-advisor',
    'mcp-server',
    'data',
    'routing-prototypes.json',
  );
  writeFileWithMtime(jsonPath, '{"value":1}\n', Date.now());
  assert.equal(distFreshness.packageForSourceFile(jsonPath, { workspaceRoot: tmpDir }).id, 'system-skill-advisor/mcp-server');

  const fallback = distFreshness.checkPackageFreshness('mcp-code-mode/mcp-server', { workspaceRoot: tmpDir });
  assert.equal(fallback.status, 'fresh');
  assert.equal(fallback.origin, 'checker');

  const options = { workspaceRoot: tmpDir };
  assert.equal(distFreshness.preparePackageBuild('system-skill-advisor/mcp-server', options).status, 'prepared');
  assert.equal(distFreshness.recordPackageBuild('system-skill-advisor/mcp-server', options).status, 'recorded');
  const oldMtime = fs.statSync(jsonPath).mtime;
  fs.writeFileSync(jsonPath, '{"value":2}\n');
  fs.utimesSync(jsonPath, oldMtime, oldMtime);
  assert.equal(distFreshness.checkPackageFreshness('system-skill-advisor/mcp-server', options).status, 'stale');
});

test('prunes only old matching cache temporaries', (t) => {
  const tmpDir = temporaryDirectory(t, 'dist-freshness-temp-');
  writeCodeModeFixture(tmpDir, false);
  const options = { workspaceRoot: tmpDir };
  const cached = distFreshness.writePackageSourceHashCache('mcp-code-mode/mcp-server', options);
  const oldTemp = `${cached.cachePath}.99999.tmp`;
  const recentTemp = `${cached.cachePath}.99998.tmp`;
  fs.writeFileSync(oldTemp, 'old');
  fs.writeFileSync(recentTemp, 'recent');
  const oldDate = new Date(Date.now() - (48 * 60 * 60 * 1000));
  fs.utimesSync(oldTemp, oldDate, oldDate);

  distFreshness.writePackageSourceHashCache('mcp-code-mode/mcp-server', options);
  assert.equal(fs.existsSync(oldTemp), false);
  assert.equal(fs.existsSync(recentTemp), true);
});

test('reports aggregate checker errors as degraded with exit zero', (t) => {
  const tmpDir = temporaryDirectory(t, 'dist-freshness-degraded-');
  const result = spawnSync(
    process.execPath,
    [DIST_FRESHNESS_PATH, 'check-all', '--workspace-root', tmpDir, '--json'],
    { encoding: 'utf8' },
  );
  assert.equal(result.status, 0);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.status, 'degraded');
  assert.equal(payload.stale, false);
  assert.equal(payload.degraded, true);
  assert.ok(payload.errors.length > 0);
});

test('Claude hook rejects malformed envelopes without traceback', () => {
  const malformed = [
    'not-json',
    '[]',
    'null',
    '"scalar"',
    '{"tool_name":"Write","tool_input":null}',
    '{"tool_name":"Write","tool_input":{"file_path":42}}',
    '{"tool_name":"Write","tool_input":{"file_path":"/missing"},"cwd":null}',
  ];
  for (const input of malformed) {
    const result = spawnSync(CLAUDE_HOOK_PATH, [], { input, encoding: 'utf8' });
    assert.equal(result.status, 0, input);
    assert.equal(result.stdout, '', input);
    assert.doesNotMatch(result.stderr, /Traceback/, input);
  }
});

test('Claude hook shares one deadline across sequential checkers', (t) => {
  const tmpDir = temporaryDirectory(t, 'dist-freshness-hook-budget-');
  const scriptsDir = path.join(tmpDir, '.opencode', 'skills', 'sk-code', 'code-quality', 'scripts');
  const editedFile = path.join(tmpDir, 'edited.ts');
  const commentChecker = path.join(scriptsDir, 'check-comment-hygiene.sh');
  const distChecker = path.join(scriptsDir, 'check-dist-staleness.sh');
  fs.mkdirSync(scriptsDir, { recursive: true });
  fs.writeFileSync(editedFile, 'export const edited = true;\n');
  fs.writeFileSync(commentChecker, '#!/usr/bin/env python3\nimport time\ntime.sleep(8.2)\n');
  fs.writeFileSync(distChecker, '#!/usr/bin/env python3\nprint("DIST CHECK REACHED")\n');
  fs.chmodSync(commentChecker, 0o755);
  fs.chmodSync(distChecker, 0o755);

  const startedAt = Date.now();
  const result = spawnSync(CLAUDE_HOOK_PATH, [], {
    input: JSON.stringify({
      tool_name: 'Write',
      tool_input: { file_path: editedFile },
      cwd: tmpDir,
    }),
    encoding: 'utf8',
    timeout: 11_000,
  });
  const elapsedMs = Date.now() - startedAt;
  assert.equal(result.status, 0);
  assert.ok(elapsedMs < 10_000, `hook exceeded host budget: ${elapsedMs}ms`);
  assert.match(result.stderr, /comment hygiene checker failed/);
  assert.ok(result.stdout.includes('DIST CHECK REACHED') || result.stderr.includes('deadline is exhausted'));
});

test('standalone wrapper resolves the shared checker from a non-repo-root cwd', (t) => {
  const tmpDir = temporaryDirectory(t, 'check-dist-staleness-fallback-');
  // A cwd without .opencode forces the script-relative fallback. Before the
  // parent-count fix it resolved to <repo>/.opencode and appended .opencode again,
  // yielding "checker not found"; the fix must reach the real workspace root.
  const result = spawnSync('python3', [CHECK_DIST_WRAPPER, DIST_FRESHNESS_PATH], {
    cwd: tmpDir,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0);
  assert.doesNotMatch(result.stderr, /checker not found/);
});

test('standalone wrapper surfaces checker errors and stale results distinctly', (t) => {
  const tmpDir = temporaryDirectory(t, 'check-dist-staleness-error-');
  writeFakeChecker(
    tmpDir,
    'const a=process.argv.slice(2);'
    + "if(a.includes('check-all')){process.stdout.write(JSON.stringify({status:'degraded',stale:false,"
    + "results:[{stale:true,packageName:'@x/y',rebuildCommand:'npm run build'},"
    + "{status:'error',message:'watched source path missing',packageName:'@a/b'}]})+'\\n');}"
    + "else{process.stdout.write(JSON.stringify({status:'error',message:'watched source path missing',"
    + "packageName:'@x/y'})+'\\n');}",
  );
  const edited = path.join(tmpDir, 'edited.ts');
  fs.writeFileSync(edited, 'export const edited = true;\n');

  const single = spawnSync('python3', [CHECK_DIST_WRAPPER, edited], { cwd: tmpDir, encoding: 'utf8' });
  assert.equal(single.status, 0);
  assert.match(single.stdout, /DIST FRESHNESS CHECK ERROR: @x\/y -- watched source path missing/);

  const all = spawnSync('python3', [CHECK_DIST_WRAPPER, '--all'], { cwd: tmpDir, encoding: 'utf8' });
  assert.equal(all.status, 0);
  assert.match(all.stdout, /STALE DIST WARNING: @x\/y/);
  assert.match(all.stdout, /DIST FRESHNESS CHECK ERROR: @a\/b -- watched source path missing/);
});

test('standalone wrapper still prints the stale banner for a stale package', (t) => {
  const tmpDir = temporaryDirectory(t, 'check-dist-staleness-stale-');
  writeFakeChecker(
    tmpDir,
    "process.stdout.write(JSON.stringify({stale:true,packageName:'@spec-kit/mcp-server',"
    + "rebuildCommand:'cd pkg && npm run build'})+'\\n');",
  );
  const edited = path.join(tmpDir, 'edited.ts');
  fs.writeFileSync(edited, 'export const edited = true;\n');
  const result = spawnSync('python3', [CHECK_DIST_WRAPPER, edited], { cwd: tmpDir, encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /STALE DIST WARNING: @spec-kit\/mcp-server -- run: cd pkg && npm run build/);
});
