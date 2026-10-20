#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Version Battery Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the battery's exported legs and main() with fixture records. Every
// collector arrives through the injected deps, so no opencode binary starts and
// no network call happens; temporary roots live under the system temp directory
// until their test ends.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const {
  allowedCommandSources,
  ancestorPluginDirs,
  legCommandListed,
  legFamilyPresent,
  legPluginActive,
  legPluginDiscovered,
  legPluginLoad,
  legsForV2,
  listCommandNames,
  listPluginFiles,
  main,
  mcpServerNames,
  parseArgs,
  parseVersion,
  readV2,
  selectBinary,
  stableIndex,
  V2_BUILTIN_COMMANDS,
  v2ServerEnv,
} = require('../opencode-version-battery.cjs');
const { parseOpencodeVersion } = require(path.resolve(
  __dirname, '..', '..', '..', '..',
  'skills', 'system-deep-loop', 'runtime', 'scripts', 'opencode-version.cjs',
));

// Fixture paths stand in for an installed binary and a plugin folder; the legs
// judge records, so these paths never need to exist.
const V1_BIN = '/fixture/bin/opencode';
const V2_BIN = '/fixture/bin/opencode2';
const FIXTURE_ROOT = '/fixture/root';
const OTHER_ROOT = '/fixture/other';

// The battery's parser keeps its own copy of the version rule; one shared list
// pins it to the deep-loop resolver.
const VERSION_SAMPLES = [
  '1.19.3',
  '1.19.3\r\n',
  '1.19.3\n',
  'v1.19.3',
  '1.19.3 2.0.32',
  '1.19.3\n2.0.32',
  '2.0.32',
  'opencode 2.0.32',
  'opencode v2.0.32\nWARN: x',
  'OpenCode v1.19.3',
  '',
  '   ',
  'not a version',
  '1.19',
  '3.1.4',
  'opencode2',
  'opencode',
  '/opt/tools/1.19.3/opencode',
  '2.0.32-rc.1',
  'opencode v2.0.32\n1.19.3',
];

// The shared corpus is written from the reference parser, so this copy is pinned to the
// same answers every other copy is tested against.
const VERSION_CORPUS = JSON.parse(fs.readFileSync(path.resolve(
  __dirname, '..', '..', '..', '..',
  'hooks', 'dispatch', 'lib', 'opencode-version-corpus.json',
), 'utf8'));

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function tempRoot(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'opencode-battery-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function pluginRoot(t, names) {
  const root = tempRoot(t);
  const dir = path.join(root, '.opencode', 'plugins');
  fs.mkdirSync(dir, { recursive: true });
  for (const name of names) fs.writeFileSync(path.join(dir, name), 'export default async () => ({});\n');
  return root;
}

// Writes one command file, creating its sub-folders so a name like `b/c` lands in
// the nested shape the runtime registers as a slashed name.
function commandFile(root, name) {
  const file = path.join(root, '.opencode', 'commands', `${name}.md`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, '---\ndescription: fixture command\n---\n');
}

// Builds a HOME and an XDG config home under the system temp folder, so a leg that
// reads the global command directories never reads the operator's own.
function emptyEnv(t) {
  return { HOME: tempRoot(t), XDG_CONFIG_HOME: tempRoot(t) };
}

// The caller environment minus the two OpenCode 2 config switches, so a test of
// normal discovery never inherits a switch from whoever runs the suite.
function envWithoutSwitches() {
  const env = { ...process.env };
  delete env.OPENCODE_CONFIG_PROJECT_DISABLE;
  delete env.OPENCODE_DISABLE_PROJECT_CONFIG;
  delete env.OPENCODE_CONFIG_DIR;
  return env;
}

// Writes an executable stand-in for the v2 binary into a temporary folder: it
// answers the serve banner and every API read, and records its pid and private
// folder so the test can judge them once the battery has finished.
function fakeServer(t, root, options = {}) {
  const dir = tempRoot(t);
  const script = path.join(dir, 'fake-opencode.cjs');
  const record = path.join(dir, 'server.json');
  const source = `#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const root = ${JSON.stringify(root)};
const record = ${JSON.stringify(record)};
const ancestor = ${JSON.stringify(options.ancestor || null)};
const ignoreSwitches = ${JSON.stringify(Boolean(options.ignoreSwitches))};
const args = process.argv.slice(2);

// Mirrors OpenCode 2's plugin discovery: the ancestor walk merges an outer
// checkout's copies as duplicates, and the two config switches turn it off.
function pluginData() {
  const own = { id: 'alpha', source: { type: 'local', path: path.join(root, '.opencode', 'plugins', 'alpha.js') }, state: { status: 'active' } };
  const outer = ancestor
    ? { id: 'alpha', source: { type: 'local', path: path.join(ancestor, '.opencode', 'plugins', 'alpha.js') }, state: { status: 'active' } }
    : null;
  if (ignoreSwitches) return outer ? [outer, own] : [own];
  if (process.env.OPENCODE_CONFIG_PROJECT_DISABLE === '1') {
    return process.env.OPENCODE_CONFIG_DIR === path.join(root, '.opencode') ? [own] : [];
  }
  if (outer) {
    return [
      outer,
      { ...own, state: { status: 'failed', error: 'Duplicate plugin ID: alpha' } },
    ];
  }
  return [own];
}

if (args[0] === 'serve') {
  fs.writeFileSync(record, JSON.stringify({ pid: process.pid, dir: path.dirname(process.env.OPENCODE_DB), projectDisable: process.env.OPENCODE_CONFIG_PROJECT_DISABLE ?? null, configDir: process.env.OPENCODE_CONFIG_DIR ?? null }));
  console.log('server listening on http://127.0.0.1:' + args[2]);
  console.log('server password FAKE-SECRET-123');
  setInterval(() => {}, 1000);
} else if (args[0] === 'api') {
  const apiPath = args[4];
  const configOk = process.env.OPENCODE_CONFIG_PROJECT_DISABLE !== '1' || process.env.OPENCODE_CONFIG_DIR === path.join(root, '.opencode');
  const prompt = { name: 'code_mode:utcp_codemode_usage', description: 'fixture prompt' };
  const commands = ignoreSwitches && ancestor
    ? [{ name: 'battery', description: 'fixture command' }, { name: 'outer-only', description: 'fixture command' }, prompt]
    : (configOk ? [{ name: 'battery', description: 'fixture command' }, prompt] : []);
  if (apiPath.startsWith('/api/config')) {
    // The config endpoint answers with a top-level array, not the usual data envelope.
    console.log(JSON.stringify([{
      type: 'document',
      path: path.join(root, 'opencode.json'),
      info: { mcp: { servers: { code_mode: { type: 'local' } } } },
    }]));
  } else {
    const data = apiPath.startsWith('/api/plugin')
      ? pluginData()
      : apiPath.startsWith('/api/command')
        ? commands
        : (configOk ? [{ id: 'battery', path: path.join(root, '.opencode', 'skills', 'battery', 'SKILL.md') }] : []);
    console.log(JSON.stringify({ data }));
  }
}
`;
  fs.writeFileSync(script, source);
  fs.chmodSync(script, 0o755);
  return { script, record };
}

function fileRecord(root, name, broken = false) {
  return { name, path: path.join(root, '.opencode', 'plugins', name), broken };
}

function debugConfigFor(files, commands = []) {
  return {
    exit: 0,
    stdout: JSON.stringify({
      plugin_origins: files.map((file) => ({ spec: pathToFileURL(file.path).href })),
      command: Object.fromEntries(commands.map((name) => [name, { template: 'fixture' }])),
    }),
  };
}

function harnessFor(files) {
  return {
    exit: 0,
    stdout: files.map((file) => JSON.stringify({ name: file.name, v1: 'loaded', detail: 'loaded' })).join('\n'),
  };
}

function v2Entry(file, status = 'active') {
  return {
    id: path.basename(file.name, '.js'),
    source: { type: 'local', path: file.path },
    state: { status },
  };
}

function resultText(result) {
  return [result.reason, ...(result.details || [])].join('\n');
}

function makeDeps(options = {}) {
  const calls = {
    probeVersion: [],
    which: [],
    runDebugConfig: [],
    runHarness: [],
    readV2: [],
    writeFile: [],
    stdout: [],
    stderr: [],
  };
  const deps = {
    env: options.env || {},
    probeVersion(candidate) {
      calls.probeVersion.push(candidate);
      return options.probeVersion ? options.probeVersion(candidate) : { output: '', error: null };
    },
    which(name) {
      calls.which.push(name);
      return options.which ? options.which(name) : null;
    },
    runDebugConfig(...args) {
      calls.runDebugConfig.push(args);
      return options.runDebugConfig ? options.runDebugConfig(...args) : { exit: 0, stdout: '{}' };
    },
    runHarness(...args) {
      calls.runHarness.push(args);
      return options.runHarness ? options.runHarness(...args) : { exit: 0, stdout: '' };
    },
    readV2(...args) {
      calls.readV2.push(args);
      return options.readV2
        ? options.readV2(...args)
        : Promise.resolve({ started: false, reason: 'fixture: the server never started' });
    },
    writeFile(...args) {
      calls.writeFile.push(args);
      if (options.writeFile) options.writeFile(...args);
    },
    stdout(text) {
      calls.stdout.push(text);
    },
    stderr(text) {
      calls.stderr.push(text);
    },
  };
  return { calls, deps };
}

function summaryOf(calls) {
  return JSON.parse(calls.stdout.join(''));
}

function passingV1Options(root) {
  const files = listPluginFiles(root);
  return {
    env: { OPENCODE_BIN: V1_BIN },
    probeVersion: () => ({ output: '1.19.3', error: null }),
    runDebugConfig: () => debugConfigFor(files),
    runHarness: () => harnessFor(files),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ROW TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('R1: v1 every plugin file discovered and loaded passes both legs', () => {
  const files = [fileRecord(FIXTURE_ROOT, 'alpha.js'), fileRecord(FIXTURE_ROOT, 'beta.js')];
  const discovered = legPluginDiscovered(files, debugConfigFor(files));
  assert.equal(discovered.status, 'PASS');
  assert.equal(discovered.leg, 'plugin-discovered');
  assert.equal(discovered.family, 'v1');
  const loaded = legPluginLoad(files, harnessFor(files));
  assert.equal(loaded.status, 'PASS');
  assert.equal(loaded.leg, 'plugin-load');
  assert.equal(loaded.family, 'v1');
});

test('R2: v1 a file missing from the debug config fails plugin-discovered naming it', () => {
  const files = [fileRecord(FIXTURE_ROOT, 'alpha.js'), fileRecord(FIXTURE_ROOT, 'beta.js')];
  const result = legPluginDiscovered(files, debugConfigFor([files[0]]));
  assert.equal(result.status, 'FAIL');
  assert.match(resultText(result), /beta\.js/);
});

test('R3: v1 a harness failure fails plugin-load naming the plugin and its detail', () => {
  const files = [fileRecord(FIXTURE_ROOT, 'alpha.js'), fileRecord(FIXTURE_ROOT, 'beta.js')];
  const harness = {
    exit: 0,
    stdout: [
      JSON.stringify({ name: 'alpha.js', v1: 'loaded', detail: 'loaded' }),
      JSON.stringify({ name: 'beta.js', v1: 'failed', detail: 'import threw: boom' }),
    ].join('\n'),
  };
  const result = legPluginLoad(files, harness);
  assert.equal(result.status, 'FAIL');
  const text = resultText(result);
  assert.match(text, /beta\.js/);
  assert.match(text, /boom/);
});

test('R4: v1 a non-zero debug config or unparseable stdout fails plugin-discovered', () => {
  const files = [fileRecord(FIXTURE_ROOT, 'alpha.js')];
  assert.equal(legPluginDiscovered(files, { exit: 1, stdout: '' }).status, 'FAIL');
  assert.equal(legPluginDiscovered(files, { exit: 0, stdout: '' }).status, 'FAIL');
  assert.equal(legPluginDiscovered(files, { exit: 0, stdout: 'not json at all' }).status, 'FAIL');
});

test('R5: v1 a plugin with no harness line degrades plugin-load naming it', () => {
  const files = [fileRecord(FIXTURE_ROOT, 'alpha.js'), fileRecord(FIXTURE_ROOT, 'beta.js')];
  const harness = { exit: 0, stdout: JSON.stringify({ name: 'alpha.js', v1: 'loaded', detail: 'loaded' }) };
  const result = legPluginLoad(files, harness);
  assert.equal(result.status, 'DEGRADED');
  assert.match(resultText(result), /beta\.js/);
});

test('R6: v2 every plugin active on a stable read passes plugin-active', () => {
  const files = [fileRecord(FIXTURE_ROOT, 'alpha.js'), fileRecord(FIXTURE_ROOT, 'beta.js')];
  const entries = files.map((file) => v2Entry(file));
  const result = legPluginActive(files, [{ entries }, { entries }], FIXTURE_ROOT);
  assert.equal(result.status, 'PASS');
  assert.equal(result.leg, 'plugin-active');
  assert.equal(result.family, 'v2');
});

test('R7: v2 an entry with a failed status fails plugin-active naming plugin and status', () => {
  const files = [fileRecord(FIXTURE_ROOT, 'alpha.js'), fileRecord(FIXTURE_ROOT, 'beta.js')];
  const entries = [v2Entry(files[0]), v2Entry(files[1], 'failed')];
  const result = legPluginActive(files, [{ entries }, { entries }], FIXTURE_ROOT);
  assert.equal(result.status, 'FAIL');
  const text = resultText(result);
  assert.match(text, /beta/);
  assert.match(text, /failed/);
});

test('R8: v2 counts that never stabilise degrade plugin-active with the counts', () => {
  const files = [fileRecord(FIXTURE_ROOT, 'alpha.js')];
  const read = (count) => ({ entries: Array.from({ length: count }, () => v2Entry(files[0])) });
  const zeros = legPluginActive(files, [read(0), read(0), read(0)], FIXTURE_ROOT);
  assert.equal(zeros.status, 'DEGRADED');
  assert.match(resultText(zeros), /0\D+0\D+0/);
  const climbing = legPluginActive(files, [read(3), read(4), read(5)], FIXTURE_ROOT);
  assert.equal(climbing.status, 'DEGRADED');
  assert.match(resultText(climbing), /3\D+4\D+5/);
  assert.equal(stableIndex([0, 0, 0]), -1);
  assert.equal(stableIndex([3, 4, 5]), -1);
  assert.equal(stableIndex([3, 3]), 1);
  assert.equal(stableIndex([0, 3, 3]), 2);
});

test('R9: v2 a server that never started degrades plugin-active, skill-visible and command-listed', async (t) => {
  const files = [fileRecord(FIXTURE_ROOT, 'alpha.js')];
  const reason = 'fixture: no listening line or password within 30 s';
  const [active, skill, commands] = legsForV2(files, { started: false, reason }, FIXTURE_ROOT);
  assert.equal(active.status, 'DEGRADED');
  assert.equal(active.leg, 'plugin-active');
  assert.equal(active.family, 'v2');
  assert.match(active.reason, /no listening line/);
  assert.equal(skill.status, 'DEGRADED');
  assert.equal(skill.leg, 'skill-visible');
  assert.equal(skill.family, 'v2');
  assert.match(skill.reason, /no listening line/);
  assert.equal(commands.status, 'DEGRADED');
  assert.equal(commands.leg, 'command-listed');
  assert.equal(commands.family, 'v2');
  assert.match(commands.reason, /no listening line/);

  const root = pluginRoot(t, ['alpha.js']);
  const { calls, deps } = makeDeps({
    env: { OPENCODE_BIN: V2_BIN },
    probeVersion: () => ({ output: '2.0.32', error: null }),
    readV2: async () => ({ started: false, reason: 'fixture: the server never started' }),
  });
  const code = await main(['--family=v2', '--root=' + root, '--json'], deps);
  assert.equal(code, 3);
  const degraded = summaryOf(calls).results.filter((result) => result.status === 'DEGRADED');
  assert.ok(degraded.some((result) => result.leg === 'plugin-active'));
  assert.ok(degraded.some((result) => result.leg === 'skill-visible'));
  assert.ok(degraded.some((result) => result.leg === 'command-listed'));
});

test('R10: family v2 requested with only a v1 candidate skips and exits 3', async (t) => {
  const root = pluginRoot(t, ['alpha.js']);
  const { calls, deps } = makeDeps({
    env: { OPENCODE_BIN: V1_BIN },
    probeVersion: () => ({ output: '1.19.3', error: null }),
  });
  const code = await main(['--family=v2', '--root=' + root, '--json'], deps);
  assert.equal(code, 3);
  const summary = summaryOf(calls);
  assert.equal(summary.exit, 3);
  const present = summary.results.find((result) => result.leg === 'family-present' && result.family === 'v2');
  assert.ok(present);
  assert.equal(present.status, 'SKIP');
  assert.match(present.reason, /no v2 binary installed/);
  assert.ok(summary.results.every((result) => result.status !== 'FAIL'));
  assert.equal(legFamilyPresent('v2', null).status, 'SKIP');
});

test('R11: family both with only v1 installed skips v2 and exits 3 while the v1 legs pass', async (t) => {
  const root = pluginRoot(t, ['alpha.js', 'beta.js']);
  const files = listPluginFiles(root);
  const { calls, deps } = makeDeps({
    env: { OPENCODE_BIN: V1_BIN },
    probeVersion: () => ({ output: '1.19.3', error: null }),
    runDebugConfig: () => debugConfigFor(files),
    runHarness: () => harnessFor(files),
  });
  const code = await main(['--family=both', '--root=' + root, '--json'], deps);
  assert.equal(code, 3);
  const summary = summaryOf(calls);
  const v1 = summary.results.filter((result) => result.family === 'v1');
  assert.ok(v1.length >= 2);
  assert.ok(v1.every((result) => result.status === 'PASS'));
  const v2 = summary.results.filter((result) => result.family === 'v2');
  assert.ok(v2.length >= 1);
  assert.ok(v2.every((result) => result.status === 'SKIP'));
  assert.ok(v2.some((result) => result.leg === 'family-present'));
  assert.ok(summary.results.every((result) => result.status !== 'FAIL'));
  assert.equal(calls.readV2.length, 0);
});

test('R12: zero plugin files fails', async (t) => {
  assert.equal(legPluginDiscovered([], { exit: 0, stdout: '{}' }).status, 'FAIL');
  assert.equal(legPluginLoad([], { exit: 0, stdout: '' }).status, 'FAIL');
  const root = tempRoot(t);
  fs.mkdirSync(path.join(root, '.opencode', 'plugins'), { recursive: true });
  const { calls, deps } = makeDeps({
    env: { OPENCODE_BIN: V1_BIN },
    probeVersion: () => ({ output: '1.19.3', error: null }),
  });
  const code = await main(['--family=v1', '--root=' + root, '--json'], deps);
  assert.equal(code, 1);
  assert.ok(summaryOf(calls).results.some((result) => result.status === 'FAIL'));
});

test('R13: --out to an unwritable path exits 2', async (t) => {
  const root = pluginRoot(t, ['alpha.js']);
  const out = path.join(root, 'missing-dir', 'summary.json');
  const { deps } = makeDeps({
    ...passingV1Options(root),
    writeFile: (file, text) => fs.writeFileSync(file, text),
  });
  const code = await main(['--family=v1', '--root=' + root, '--out=' + out], deps);
  assert.equal(code, 2);
});

test('R14: an unknown argument exits 2 with usage on stderr', async () => {
  assert.throws(() => parseArgs(['--nonsense']), (error) => error.code === 'USAGE');
  assert.throws(() => parseArgs(['--family=v3']), (error) => error.code === 'USAGE');
  const { calls, deps } = makeDeps();
  const code = await main(['--nonsense'], deps);
  assert.equal(code, 2);
  assert.match(calls.stderr.join(''), /usage/i);
});

test('R15: v2 a plugin file with no entry under the root fails naming the file', () => {
  const files = [fileRecord(FIXTURE_ROOT, 'alpha.js'), fileRecord(FIXTURE_ROOT, 'beta.js')];
  const elsewhere = {
    id: 'beta',
    source: { type: 'local', path: path.join(OTHER_ROOT, '.opencode', 'plugins', 'beta.js') },
    state: { status: 'active' },
  };
  const entries = [v2Entry(files[0]), elsewhere];
  const result = legPluginActive(files, [{ entries }, { entries }], FIXTURE_ROOT);
  assert.equal(result.status, 'FAIL');
  assert.match(resultText(result), /beta\.js/);
  const onlyElsewhere = legPluginActive(files, [{ entries: [elsewhere] }, { entries: [elsewhere] }], FIXTURE_ROOT);
  assert.equal(onlyElsewhere.status, 'DEGRADED');
  assert.match(resultText(onlyElsewhere), /0\D+0/);
});

test('R16: --out <file> and --root <dir> parse the same as the = forms', () => {
  const joined = parseArgs(['--family=v1', '--root=/fixture/root', '--out=/fixture/out.json']);
  const spaced = parseArgs([
    '--family', 'v1', '--root', '/fixture/root', '--out', '/fixture/out.json',
  ]);
  assert.deepEqual(spaced, joined);
  assert.equal(spaced.family, 'v1');
  assert.equal(spaced.root, path.resolve('/fixture/root'));
  assert.equal(spaced.out, '/fixture/out.json');
});

test('R17: --out as the last argument is a usage error', () => {
  assert.throws(() => parseArgs(['--out']), (error) => error.code === 'USAGE');
  assert.throws(() => parseArgs(['--root']), (error) => error.code === 'USAGE');
  assert.throws(() => parseArgs(['--family']), (error) => error.code === 'USAGE');
});

test('R18: a spaced value that is itself a flag is a usage error, the = form is kept', () => {
  const cases = [
    { args: ['--out', '--json'], error: '--out needs a value' },
    { args: ['--out=--json'], out: '--json', json: false },
    { args: ['--root', '--family=v1'], error: '--root needs a value' },
    { args: ['--out'], error: '--out needs a value' },
    { args: ['--out', 'report.json', '--json'], out: 'report.json', json: true },
  ];

  for (const c of cases) {
    const label = JSON.stringify(c.args);
    if (c.error) {
      assert.throws(
        () => parseArgs(c.args),
        (error) => error.code === 'USAGE' && error.message === c.error,
        label,
      );
      continue;
    }
    const parsed = parseArgs(c.args);
    assert.equal(parsed.out, c.out, label);
    assert.equal(parsed.json, c.json, label);
  }
});

test('C1: v2 lists a nested project and allows the ancestor folder and the built-ins', (t) => {
  const outer = tempRoot(t);
  commandFile(outer, 'outer-only');
  const inner = path.join(outer, 'inner');
  commandFile(inner, 'a');
  commandFile(inner, 'b/c');
  const sources = allowedCommandSources(inner, 'v2', emptyEnv(t));
  assert.deepEqual(sources.required, ['a', 'b/c']);
  const result = legCommandListed('v2', ['a', 'b/c', 'outer-only', ...V2_BUILTIN_COMMANDS], sources);
  assert.equal(result.status, 'PASS');
  assert.equal(result.leg, 'command-listed');
  assert.equal(result.family, 'v2');
  assert.equal(result.reason, 'all 2 command files listed');
  assert.deepEqual(result.details, ['listed: 5', 'required: 2']);
});

test('C2: v2 without the ancestor folder fails naming the ancestor command, then passes', (t) => {
  const isolated = tempRoot(t);
  commandFile(isolated, 'a');
  commandFile(isolated, 'b/c');
  const env = emptyEnv(t);
  const refused = legCommandListed(
    'v2', ['a', 'b/c', 'outer-only', ...V2_BUILTIN_COMMANDS], allowedCommandSources(isolated, 'v2', env),
  );
  assert.equal(refused.status, 'FAIL');
  assert.match(resultText(refused), /outer-only: listed, in no command folder/);
  const accepted = legCommandListed(
    'v2', ['a', 'b/c', ...V2_BUILTIN_COMMANDS], allowedCommandSources(isolated, 'v2', env),
  );
  assert.equal(accepted.status, 'PASS');
});

test('C3: v1 does not walk up, so an ancestor command and a built-in are both strays', (t) => {
  const outer = tempRoot(t);
  commandFile(outer, 'outer-only');
  const inner = path.join(outer, 'inner');
  commandFile(inner, 'a');
  commandFile(inner, 'b/c');
  const env = emptyEnv(t);
  const walkUp = legCommandListed('v1', ['a', 'b/c', 'outer-only'], allowedCommandSources(inner, 'v1', env));
  assert.equal(walkUp.status, 'FAIL');
  assert.match(resultText(walkUp), /outer-only: listed, in no command folder/);
  const builtin = legCommandListed('v1', ['a', 'b/c', 'init'], allowedCommandSources(inner, 'v1', env));
  assert.equal(builtin.status, 'FAIL');
  assert.match(resultText(builtin), /init: listed, in no command folder/);
});

test('C4: v2 fails when a project command file is missing from the listing', (t) => {
  const root = tempRoot(t);
  commandFile(root, 'a');
  commandFile(root, 'b/c');
  const result = legCommandListed(
    'v2', ['a', ...V2_BUILTIN_COMMANDS], allowedCommandSources(root, 'v2', emptyEnv(t)),
  );
  assert.equal(result.status, 'FAIL');
  assert.match(resultText(result), /b\/c: in the command folder, not listed/);
});

test('C5: a listing that did not parse fails command-listed on either family', (t) => {
  const root = tempRoot(t);
  commandFile(root, 'a');
  const env = emptyEnv(t);
  for (const family of ['v1', 'v2']) {
    const result = legCommandListed(family, null, allowedCommandSources(root, family, env));
    assert.equal(result.status, 'FAIL', family);
    assert.equal(result.reason, 'the command listing did not parse');
  }
});

test('C6: a command file in the global config folder is allowed on both families', (t) => {
  const root = tempRoot(t);
  commandFile(root, 'a');
  const env = emptyEnv(t);
  const globalDir = path.join(env.XDG_CONFIG_HOME, 'opencode', 'commands');
  fs.mkdirSync(globalDir, { recursive: true });
  fs.writeFileSync(path.join(globalDir, 'g.md'), '---\ndescription: global command\n---\n');
  for (const family of ['v1', 'v2']) {
    const sources = allowedCommandSources(root, family, env);
    assert.ok(sources.allowed.has('g'), family);
    assert.ok(!sources.required.includes('g'), family);
    const listed = family === 'v1' ? ['a', 'g'] : ['a', 'g', ...V2_BUILTIN_COMMANDS];
    assert.equal(legCommandListed(family, listed, sources).status, 'PASS', family);
  }
});

test('C7: both command folder spellings are read, with slashed names and a followed link', (t) => {
  const root = tempRoot(t);
  const opencode = path.join(root, '.opencode');
  fs.mkdirSync(path.join(opencode, 'command', 'create'), { recursive: true });
  fs.writeFileSync(path.join(opencode, 'command', 'agent-router.md'), '');
  fs.writeFileSync(path.join(opencode, 'command', 'create', 'readme.md'), '');
  fs.mkdirSync(path.join(opencode, 'commands'), { recursive: true });
  fs.writeFileSync(path.join(opencode, 'commands', 'linked.md'), '');
  fs.symlinkSync(path.join(opencode, 'commands', 'linked.md'), path.join(opencode, 'commands', 'alias.md'));
  assert.deepEqual(listCommandNames(opencode), ['agent-router', 'alias', 'create/readme', 'linked']);
  assert.deepEqual(listCommandNames(path.join(root, 'missing')), []);
});

test('C8: v2 a command listing that never settles degrades command-listed', (t) => {
  const root = pluginRoot(t, ['alpha.js']);
  const files = listPluginFiles(root);
  const entries = files.map((file) => v2Entry(file));
  const result = legsForV2(
    files,
    {
      started: true,
      reads: [{ entries }, { entries }],
      skills: { data: [{ id: 'battery', path: path.join(root, '.opencode', 'skills', 'battery', 'SKILL.md') }] },
      commands: { data: [] },
      commandCounts: [0, 0, 0],
      commandsStable: false,
    },
    root,
    emptyEnv(t),
  ).find((item) => item.leg === 'command-listed');
  assert.ok(result);
  assert.equal(result.status, 'DEGRADED');
  assert.equal(result.family, 'v2');
  assert.equal(result.reason, 'the command listing never settled on a non-zero count');
  assert.deepEqual(result.details, ['counts: [0,0,0]']);
});

test('C9: mcpServerNames reads both config shapes and refuses a non-array', () => {
  const v2 = [
    { type: 'document', path: '/fixture/opencode.json', info: { mcp: { servers: { zebra: {}, code_mode: {} } } } },
    { type: 'directory', path: '/fixture/.opencode' },
  ];
  assert.deepEqual(mcpServerNames(v2), ['code_mode', 'zebra']);
  const v1 = [{ info: { mcp: { code_mode: {}, servers: null } } }];
  assert.deepEqual(mcpServerNames(v1), ['code_mode']);
  assert.deepEqual(mcpServerNames(null), []);
  assert.deepEqual(mcpServerNames({ info: { mcp: { servers: { code_mode: {} } } } }), []);
});

test('C10: v2 passes when the listing carries a prompt from a configured MCP server', (t) => {
  const root = pluginRoot(t, ['alpha.js']);
  commandFile(root, 'battery');
  const files = listPluginFiles(root);
  const config = [{
    type: 'document',
    path: path.join(root, 'opencode.json'),
    info: { mcp: { servers: { code_mode: { type: 'local' } } } },
  }];
  const listed = [{ name: 'battery' }, { name: 'code_mode:utcp_codemode_usage' }];
  const result = legsForV2(
    files,
    {
      started: true,
      reads: [{ entries: files.map((file) => v2Entry(file)) }],
      skills: { data: [{ id: 'battery', path: path.join(root, '.opencode', 'skills', 'battery', 'SKILL.md') }] },
      commands: { data: listed },
      commandCounts: [listed.length, listed.length],
      commandsStable: true,
      config,
    },
    root,
    emptyEnv(t),
  ).find((item) => item.leg === 'command-listed');
  assert.ok(result);
  assert.equal(result.status, 'PASS');
  assert.deepEqual(result.details, ['listed: 2', 'required: 1', 'mcp prompts: 1']);
});

test('C11: an unconfigured server prefix and an unprefixed stray both fail', (t) => {
  const root = tempRoot(t);
  commandFile(root, 'a');
  const sources = { ...allowedCommandSources(root, 'v2', emptyEnv(t)), mcpServers: ['code_mode'] };
  const other = legCommandListed('v2', ['a', 'other_server:prompt'], sources);
  assert.equal(other.status, 'FAIL');
  assert.match(resultText(other), /other_server:prompt: listed, in no command folder/);
  const stray = legCommandListed('v2', ['a', 'stray'], sources);
  assert.equal(stray.status, 'FAIL');
  assert.match(resultText(stray), /stray: listed, in no command folder/);
  const accepted = legCommandListed('v2', ['a', 'code_mode:x'], sources);
  assert.equal(accepted.status, 'PASS');
  assert.ok(accepted.details.includes('mcp prompts: 1'));
});

test('C12: legsForV2 with an unreadable config degrades an MCP prompt and still fails a stray', (t) => {
  const root = pluginRoot(t, ['alpha.js']);
  commandFile(root, 'battery');
  const files = listPluginFiles(root);
  const base = {
    started: true,
    reads: [{ entries: files.map((file) => v2Entry(file)) }],
    skills: { data: [{ id: 'battery', path: path.join(root, '.opencode', 'skills', 'battery', 'SKILL.md') }] },
    commands: { data: [{ name: 'battery' }] },
    commandCounts: [1, 1],
    commandsStable: true,
    config: null,
  };
  const pass = legsForV2(files, base, root, emptyEnv(t)).find((item) => item.leg === 'command-listed');
  assert.equal(pass.status, 'PASS');
  assert.ok(!pass.details.some((detail) => detail.startsWith('mcp prompts:')));
  const prefixed = {
    ...base,
    commands: { data: [{ name: 'battery' }, { name: 'code_mode:x' }] },
    commandCounts: [2, 2],
  };
  const degraded = legsForV2(files, prefixed, root, emptyEnv(t)).find((item) => item.leg === 'command-listed');
  assert.equal(degraded.status, 'DEGRADED');
  assert.equal(degraded.reason, 'the config sources did not parse, so MCP prompt commands cannot be judged');
  assert.deepEqual(degraded.details, ['code_mode:x: listed, in no command folder']);
  const stray = {
    ...base,
    commands: { data: [{ name: 'battery' }, { name: 'stray' }] },
    commandCounts: [2, 2],
  };
  const fail = legsForV2(files, stray, root, emptyEnv(t)).find((item) => item.leg === 'command-listed');
  assert.equal(fail.status, 'FAIL');
  assert.match(resultText(fail), /stray: listed, in no command folder/);
});

test('C13: legsForV2 with an unreadable config and a stray keeps the stray a failure', (t) => {
  const root = pluginRoot(t, ['alpha.js']);
  commandFile(root, 'battery');
  const files = listPluginFiles(root);
  const listed = [{ name: 'battery' }, { name: 'code_mode:x' }, { name: 'stray-command' }];
  const result = legsForV2(
    files,
    {
      started: true,
      reads: [{ entries: files.map((file) => v2Entry(file)) }],
      skills: { data: [{ id: 'battery', path: path.join(root, '.opencode', 'skills', 'battery', 'SKILL.md') }] },
      commands: { data: listed },
      commandCounts: [listed.length, listed.length],
      commandsStable: true,
      config: null,
    },
    root,
    emptyEnv(t),
  ).find((item) => item.leg === 'command-listed');
  assert.ok(result);
  assert.equal(result.status, 'FAIL');
  assert.match(resultText(result), /stray-command: listed, in no command folder/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. ADVERSARIAL CASES AND CROSS-CHECKS
// ─────────────────────────────────────────────────────────────────────────────

test('parity: the battery parser and the deep-loop resolver agree on one shared list', () => {
  for (const sample of VERSION_SAMPLES) {
    assert.equal(parseVersion(sample), parseOpencodeVersion(sample), JSON.stringify(sample));
  }
});

test('parity: every shared corpus entry keeps its expected family', () => {
  assert.ok(VERSION_CORPUS.length >= 12);
  for (const { output, family } of VERSION_CORPUS) {
    assert.equal(parseVersion(output), family, JSON.stringify(output));
  }
});

test('adversarial: path-qualified, prerelease and joined output answer the pinned families', () => {
  const pinned = [
    ['', 'unknown'],
    ['opencode2', 'unknown'],
    ['opencode', 'unknown'],
    ['/opt/tools/1.19.3/opencode', 'unknown'],
    ['2.0.32-rc.1', 'v2'],
    ['1.19.3 2.0.32', 'v1'],
    ['opencode v2.0.32\n1.19.3', 'v2'],
  ];
  for (const [sample, family] of pinned) {
    assert.equal(parseVersion(sample), family, JSON.stringify(sample));
  }
});

test('adversarial: CRLF and joined version output read as v1, empty and garbage as unknown', () => {
  assert.equal(parseVersion('1.19.3\r\n'), 'v1');
  assert.equal(parseVersion('1.19.3 2.0.32'), 'v1');
  assert.equal(parseVersion('opencode v2.0.32\nWARN: x'), 'v2');
  assert.equal(parseVersion(''), 'unknown');
  assert.equal(parseVersion('   '), 'unknown');
  assert.equal(parseVersion('garbage'), 'unknown');
});

test('adversarial: empty version output is skipped and the family reports SKIP', async (t) => {
  assert.equal(selectBinary([{ path: V1_BIN, output: '', error: null }], 'v1'), null);
  const root = pluginRoot(t, ['alpha.js']);
  const { calls, deps } = makeDeps({
    env: { OPENCODE_BIN: V1_BIN },
    probeVersion: () => ({ output: '', error: null }),
  });
  const code = await main(['--family=v1', '--root=' + root, '--json'], deps);
  assert.equal(code, 3);
  const summary = summaryOf(calls);
  const present = summary.results.find((result) => result.leg === 'family-present' && result.family === 'v1');
  assert.ok(present);
  assert.equal(present.status, 'SKIP');
  assert.deepEqual(calls.probeVersion, [V1_BIN]);
  assert.equal(calls.runDebugConfig.length, 0);
  assert.equal(calls.runHarness.length, 0);
  assert.equal(calls.readV2.length, 0);
  assert.ok(summary.results.every((result) => result.status !== 'FAIL'));
});

test('adversarial: a probe error skips the candidate instead of assuming it', () => {
  const errored = { path: V1_BIN, output: '1.19.3', error: 'spawn ENOENT' };
  const healthy = { path: V2_BIN, output: '2.0.32', error: null };
  assert.equal(selectBinary([errored], 'v1'), null);
  assert.equal(selectBinary([errored, healthy], 'v1'), null);
  const selected = selectBinary([errored, healthy], 'v2');
  assert.ok(selected);
  assert.equal(selected.path, V2_BIN);
  assert.equal(selected.family, 'v2');
  assert.equal(selectBinary([{ path: V1_BIN, output: 'garbage', error: null }], 'v1'), null);
});

test('adversarial: a root without .opencode/plugins fails naming the root', async (t) => {
  const root = tempRoot(t);
  assert.throws(() => listPluginFiles(root), (error) => error.code === 'NO_PLUGIN_DIR');
  const { calls, deps } = makeDeps({
    env: { OPENCODE_BIN: V1_BIN },
    probeVersion: () => ({ output: '1.19.3', error: null }),
  });
  const code = await main(['--family=v1', '--root=' + root, '--json'], deps);
  assert.equal(code, 1);
  const failures = summaryOf(calls).results.filter((result) => result.status === 'FAIL');
  assert.ok(failures.length >= 1);
  assert.ok(failures.some((result) => resultText(result).includes(root)));
});

test('adversarial: a root with spaces and $(id) reaches the collectors as one string', async (t) => {
  const parent = tempRoot(t);
  const root = path.join(parent, 'battery root $(id) 4242');
  const dir = path.join(root, '.opencode', 'plugins');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'alpha.js'), 'export default async () => ({});\n');
  commandFile(root, 'alpha');
  const files = listPluginFiles(root);
  const { calls, deps } = makeDeps({
    env: { OPENCODE_BIN: V1_BIN },
    probeVersion: () => ({ output: '1.19.3', error: null }),
    runDebugConfig: () => debugConfigFor(files, ['alpha']),
    runHarness: () => harnessFor(files),
  });
  const code = await main(['--family=v1', '--root=' + root, '--json'], deps);
  assert.equal(code, 0);
  const listed = summaryOf(calls).results.find((result) => result.leg === 'command-listed');
  assert.ok(listed);
  assert.equal(listed.status, 'PASS');
  assert.equal(listed.reason, 'all 1 command files listed');
  assert.equal(calls.runDebugConfig.length, 1);
  assert.deepEqual(calls.runDebugConfig[0], [V1_BIN, root]);
  assert.equal(calls.runHarness.length, 1);
  assert.deepEqual(calls.runHarness[0], [root]);
  assert.equal(summaryOf(calls).root, root);
});

test('probe count: three candidates sharing one path probe each distinct path once', async (t) => {
  const root = pluginRoot(t, ['alpha.js']);
  const files = listPluginFiles(root);
  const entries = files.map((file) => v2Entry(file));
  const probes = {
    [V1_BIN]: { output: '1.19.3', error: null },
    [V2_BIN]: { output: '2.0.32', error: null },
  };
  const { calls, deps } = makeDeps({
    env: { OPENCODE_BIN: V1_BIN },
    which: (name) => (name === 'opencode' ? V1_BIN : V2_BIN),
    probeVersion: (candidate) => probes[candidate] || { output: '', error: 'unexpected probe' },
    runDebugConfig: () => debugConfigFor(files),
    runHarness: () => harnessFor(files),
    readV2: async () => ({
      started: true,
      commandsStable: true,
      reason: 'fixture: server started',
      reads: [{ entries }, { entries }],
      skills: { data: [{ id: 'battery', path: path.join(root, '.opencode', 'skills', 'battery', 'SKILL.md') }] },
      commands: { data: [] },
    }),
  });
  const code = await main(['--family=both', '--root=' + root, '--json'], deps);
  assert.equal(code, 0);
  assert.deepEqual(calls.probeVersion, [V1_BIN, V2_BIN]);
});

test('a broken symlink in the plugin folder fails plugin-discovered naming it', (t) => {
  const root = tempRoot(t);
  const dir = path.join(root, '.opencode', 'plugins');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'alpha.js'), 'export default async () => ({});\n');
  fs.symlinkSync(path.join(dir, 'missing-target.js'), path.join(dir, 'broken.js'));
  const files = listPluginFiles(root);
  assert.deepEqual(files.map((file) => file.name), ['alpha.js', 'broken.js']);
  assert.equal(files.find((file) => file.name === 'alpha.js').broken, false);
  assert.equal(files.find((file) => file.name === 'broken.js').broken, true);
  const result = legPluginDiscovered(files, debugConfigFor(files));
  assert.equal(result.status, 'FAIL');
  assert.match(resultText(result), /broken\.js/);
});

test('real readV2: the password reaches no result, stream or leftover file and the fake server is gone', async (t) => {
  const root = pluginRoot(t, ['alpha.js']);
  commandFile(root, 'battery');
  const server = fakeServer(t, root);
  let collected = null;
  const { calls, deps } = makeDeps({
    env: { OPENCODE_BIN: server.script },
    probeVersion: () => ({ output: '2.0.32', error: null }),
    readV2: async (bin, dir) => {
      collected = await readV2(bin, dir, envWithoutSwitches());
      return collected;
    },
  });

  const code = await main(['--family=v2', '--root=' + root, '--json'], deps);
  if (code !== 0) {
    const printed = calls.stdout.join('');
    const results = printed.trim() ? summaryOf(calls).results : [];
    assert.fail(`main exited ${code}\nstderr: ${calls.stderr.join('')}\nresults: ${JSON.stringify(results)}`);
  }
  const summary = summaryOf(calls);
  const active = summary.results.find((result) => result.leg === 'plugin-active');
  assert.ok(active);
  assert.equal(active.status, 'PASS');
  const listed = summary.results.find((result) => result.leg === 'command-listed');
  assert.ok(listed);
  assert.equal(listed.status, 'PASS');
  assert.equal(calls.readV2.length, 1);
  assert.equal(collected.commandsStable, true);
  assert.ok(Array.isArray(collected.config));
  assert.deepEqual(mcpServerNames(collected.config), ['code_mode']);
  const judged = legsForV2(
    listPluginFiles(root), collected, root, { OPENCODE_BIN: server.script },
  ).find((result) => result.leg === 'command-listed');
  assert.ok(judged);
  assert.equal(judged.status, 'PASS');
  assert.ok(judged.details.includes('mcp prompts: 1'), JSON.stringify(judged.details));

  const secret = 'FAKE-SECRET-123';
  assert.ok(!JSON.stringify(summary.results).includes(secret));
  assert.ok(!calls.stdout.join('').includes(secret));
  assert.ok(!calls.stderr.join('').includes(secret));

  const record = JSON.parse(fs.readFileSync(server.record, 'utf8'));
  // A plain root keeps OpenCode 2's own project discovery.
  assert.equal(record.projectDisable, null);
  assert.equal(record.configDir, null);
  assert.deepEqual(collected.shadowing, []);
  const leftovers = fs.existsSync(record.dir) ? fs.readdirSync(record.dir) : [];
  assert.deepEqual(leftovers, []);
  assert.throws(() => process.kill(record.pid, 0), (error) => error.code === 'ESRCH');
});

// A worktree under another checkout: the outer plugin folder is the one ancestor found.
test('nested: ancestorPluginDirs names the outer plugin folder and nothing for a plain root', (t) => {
  const outer = tempRoot(t);
  fs.mkdirSync(path.join(outer, '.opencode', 'plugins'), { recursive: true });
  const root = path.join(outer, 'wt');
  fs.mkdirSync(path.join(root, '.opencode', 'plugins'), { recursive: true });
  assert.deepEqual(ancestorPluginDirs(root), [path.join(outer, '.opencode', 'plugins')]);
  assert.deepEqual(ancestorPluginDirs(tempRoot(t)), []);
});

test('nested: v2ServerEnv isolates a nested root and leaves a plain root alone', (t) => {
  const outer = tempRoot(t);
  fs.mkdirSync(path.join(outer, '.opencode', 'plugins'), { recursive: true });
  const root = path.join(outer, 'wt');
  fs.mkdirSync(root, { recursive: true });
  const temp = tempRoot(t);
  const nested = v2ServerEnv({ KEEP: 'x' }, root, temp);
  assert.equal(nested.childEnv.OPENCODE_CONFIG_PROJECT_DISABLE, '1');
  assert.equal(nested.childEnv.OPENCODE_CONFIG_DIR, path.join(root, '.opencode'));
  assert.equal(nested.childEnv.KEEP, 'x');
  assert.equal(nested.childEnv.OPENCODE_DB, path.join(temp, 'private.db'));
  const plain = v2ServerEnv({}, tempRoot(t), temp);
  assert.deepEqual(plain.shadowing, []);
  assert.equal(plain.childEnv.OPENCODE_CONFIG_PROJECT_DISABLE, undefined);
  assert.equal(plain.childEnv.OPENCODE_CONFIG_DIR, undefined);
});

// The outer checkout's copy would shadow the root's as a duplicate ID; the isolated
// read judges the root's own plugin and says why.
test('nested: real readV2 under an outer checkout passes plugin-active with an isolated line', async (t) => {
  const outer = tempRoot(t);
  fs.mkdirSync(path.join(outer, '.opencode', 'plugins'), { recursive: true });
  fs.writeFileSync(path.join(outer, '.opencode', 'plugins', 'alpha.js'), 'export default async () => ({});\n');
  const root = path.join(outer, 'wt');
  fs.mkdirSync(path.join(root, '.opencode', 'plugins'), { recursive: true });
  fs.writeFileSync(path.join(root, '.opencode', 'plugins', 'alpha.js'), 'export default async () => ({});\n');
  commandFile(root, 'battery');
  const server = fakeServer(t, root, { ancestor: outer });
  const { calls, deps } = makeDeps({
    env: { OPENCODE_BIN: server.script },
    probeVersion: () => ({ output: '2.0.32', error: null }),
    readV2: (bin, dir) => readV2(bin, dir, { ...envWithoutSwitches(), OPENCODE_CONFIG_DIR: '/fixture/caller-config' }),
  });

  const code = await main(['--family=v2', '--root=' + root, '--json'], deps);
  const summary = summaryOf(calls);
  assert.equal(code, 0, JSON.stringify(summary.results));
  const active = summary.results.find((result) => result.leg === 'plugin-active');
  assert.ok(active);
  assert.equal(active.status, 'PASS', resultText(active));
  assert.match(active.details[0], /^isolated: OpenCode 2 also loads /);
  assert.ok(active.details[0].includes(path.join(outer, '.opencode', 'plugins')));
  const skill = summary.results.find((result) => result.leg === 'skill-visible');
  assert.ok(skill);
  assert.equal(skill.status, 'PASS', resultText(skill));
  const listed = summary.results.find((result) => result.leg === 'command-listed');
  assert.ok(listed);
  assert.equal(listed.status, 'PASS', resultText(listed));
  const record = JSON.parse(fs.readFileSync(server.record, 'utf8'));
  assert.equal(record.projectDisable, '1');
  assert.equal(record.configDir, path.join(root, '.opencode'));
});

// A worktree reached through a symlinked alias must still be found nested and
// isolated, or the outer checkout's plugin copy would shadow the aliased root's.
test('nested: real readV2 through a symlinked alias of a nested root isolates and passes plugin-active', async (t) => {
  const outer = tempRoot(t);
  fs.mkdirSync(path.join(outer, '.opencode', 'plugins'), { recursive: true });
  fs.writeFileSync(path.join(outer, '.opencode', 'plugins', 'alpha.js'), 'export default async () => ({});\n');
  const real = path.join(outer, 'wt');
  fs.mkdirSync(path.join(real, '.opencode', 'plugins'), { recursive: true });
  fs.writeFileSync(path.join(real, '.opencode', 'plugins', 'alpha.js'), 'export default async () => ({});\n');
  commandFile(real, 'battery');
  const alias = path.join(tempRoot(t), 'alias');
  fs.symlinkSync(real, alias);
  const server = fakeServer(t, alias, { ancestor: outer });
  const { calls, deps } = makeDeps({
    env: { OPENCODE_BIN: server.script },
    probeVersion: () => ({ output: '2.0.32', error: null }),
    readV2: (bin, dir) => readV2(bin, dir, envWithoutSwitches()),
  });

  const code = await main(['--family=v2', '--root=' + alias, '--json'], deps);
  const summary = summaryOf(calls);
  assert.equal(code, 0, JSON.stringify(summary.results));
  const active = summary.results.find((result) => result.leg === 'plugin-active');
  assert.ok(active);
  assert.equal(active.status, 'PASS', resultText(active));
  assert.match(active.details[0], /^isolated: OpenCode 2 also loads /);
  assert.ok(active.details[0].includes(path.join(fs.realpathSync(outer), '.opencode', 'plugins')));
  const skill = summary.results.find((result) => result.leg === 'skill-visible');
  assert.ok(skill);
  assert.equal(skill.status, 'PASS', resultText(skill));
  const listed = summary.results.find((result) => result.leg === 'command-listed');
  assert.ok(listed);
  assert.equal(listed.status, 'PASS', resultText(listed));
  const record = JSON.parse(fs.readFileSync(server.record, 'utf8'));
  assert.equal(record.projectDisable, '1');
  assert.equal(record.configDir, path.join(alias, '.opencode'));
});

test('nested: ancestorPluginDirs follows a symlinked root to its real parents and walks nothing from the filesystem root', (t) => {
  const outer = tempRoot(t);
  fs.mkdirSync(path.join(outer, '.opencode', 'plugins'), { recursive: true });
  const real = path.join(outer, 'wt');
  fs.mkdirSync(path.join(real, '.opencode', 'plugins'), { recursive: true });
  const elsewhere = tempRoot(t);
  const alias = path.join(elsewhere, 'alias');
  fs.symlinkSync(real, alias);
  assert.deepEqual(ancestorPluginDirs(alias), [path.join(outer, '.opencode', 'plugins')]);
  assert.deepEqual(ancestorPluginDirs(path.parse(process.cwd()).root), []);
});

test('nested: a caller switch survives on a plain root and is overridden on a nested root', (t) => {
  const temp = tempRoot(t);
  const plain = v2ServerEnv({ OPENCODE_CONFIG_PROJECT_DISABLE: '1', OPENCODE_CONFIG_DIR: '/caller' }, tempRoot(t), temp);
  assert.equal(plain.childEnv.OPENCODE_CONFIG_PROJECT_DISABLE, '1');
  assert.equal(plain.childEnv.OPENCODE_CONFIG_DIR, '/caller');
  const outer = tempRoot(t);
  fs.mkdirSync(path.join(outer, '.opencode', 'plugins'), { recursive: true });
  const root = path.join(outer, 'wt');
  fs.mkdirSync(root, { recursive: true });
  const nested = v2ServerEnv({ OPENCODE_CONFIG_PROJECT_DISABLE: '0', OPENCODE_CONFIG_DIR: '/caller' }, root, temp);
  assert.equal(nested.childEnv.OPENCODE_CONFIG_PROJECT_DISABLE, '1');
  assert.equal(nested.childEnv.OPENCODE_CONFIG_DIR, path.join(root, '.opencode'));
});

// A future OpenCode 2 that ignored the switches would bring the ancestor's entries
// back; the isolated read must fail then, not pass on the root's active copy.
test('nested: an isolated read that still carries ancestor entries fails plugin-active and command-listed', async (t) => {
  const outer = tempRoot(t);
  fs.mkdirSync(path.join(outer, '.opencode', 'plugins'), { recursive: true });
  fs.writeFileSync(path.join(outer, '.opencode', 'plugins', 'alpha.js'), 'export default async () => ({});\n');
  commandFile(outer, 'outer-only');
  const root = path.join(outer, 'wt');
  fs.mkdirSync(path.join(root, '.opencode', 'plugins'), { recursive: true });
  fs.writeFileSync(path.join(root, '.opencode', 'plugins', 'alpha.js'), 'export default async () => ({});\n');
  commandFile(root, 'battery');
  const server = fakeServer(t, root, { ancestor: outer, ignoreSwitches: true });
  const { calls, deps } = makeDeps({
    env: { OPENCODE_BIN: server.script },
    probeVersion: () => ({ output: '2.0.32', error: null }),
    readV2: (bin, dir) => readV2(bin, dir, envWithoutSwitches()),
  });

  const code = await main(['--family=v2', '--root=' + root, '--json'], deps);
  assert.notEqual(code, 0);
  const summary = summaryOf(calls);
  const active = summary.results.find((result) => result.leg === 'plugin-active');
  assert.equal(active.status, 'FAIL', resultText(active));
  assert.match(resultText(active), /loaded from .* although the read was isolated/);
  const listed = summary.results.find((result) => result.leg === 'command-listed');
  assert.equal(listed.status, 'FAIL', resultText(listed));
  assert.match(resultText(listed), /outer-only/);
});

test('nested: allowedCommandSources allows ancestor commands only when the read is not isolated', (t) => {
  const outer = tempRoot(t);
  commandFile(outer, 'outer-only');
  const root = path.join(outer, 'wt');
  commandFile(root, 'battery');
  const env = emptyEnv(t);
  assert.ok(allowedCommandSources(root, 'v2', env).allowed.has('outer-only'));
  assert.ok(!allowedCommandSources(root, 'v2', env, true).allowed.has('outer-only'));
  assert.ok(allowedCommandSources(root, 'v2', env, true).allowed.has('init'));
});

// The caller's config folder is not what an isolated read loaded, so a command
// found only there and in an ancestor must still be a stray.
test('nested: an isolated read builds the command allowlist from the root, not the caller config folder', (t) => {
  const outer = tempRoot(t);
  fs.mkdirSync(path.join(outer, '.opencode', 'plugins'), { recursive: true });
  commandFile(outer, 'leaked');
  const root = path.join(outer, 'wt');
  const file = fileRecord(root, 'alpha.js');
  fs.mkdirSync(path.dirname(file.path), { recursive: true });
  fs.writeFileSync(file.path, 'export default async () => ({});\n');
  commandFile(root, 'battery');
  const caller = tempRoot(t);
  commandFile(caller, 'leaked');
  const entries = [v2Entry(file)];
  const v2 = {
    started: true,
    reads: [{ entries }, { entries }],
    skills: { data: [{ id: 'battery', path: path.join(root, '.opencode', 'skills', 'battery', 'SKILL.md') }] },
    commands: { data: [{ name: 'battery' }, { name: 'leaked' }] },
    commandsStable: true,
    shadowing: [path.join(outer, '.opencode', 'plugins')],
  };
  const env = { ...emptyEnv(t), OPENCODE_CONFIG_DIR: path.join(caller, '.opencode') };
  const listed = legsForV2([file], v2, root, env).find((result) => result.leg === 'command-listed');
  assert.equal(listed.status, 'FAIL', resultText(listed));
  assert.match(resultText(listed), /leaked/);
});
