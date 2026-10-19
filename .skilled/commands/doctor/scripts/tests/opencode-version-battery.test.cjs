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
  legFamilyPresent,
  legPluginActive,
  legPluginDiscovered,
  legPluginLoad,
  legsForV2,
  listPluginFiles,
  main,
  parseArgs,
  parseVersion,
  readV2,
  selectBinary,
  stableIndex,
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

// Writes an executable stand-in for the v2 binary into a temporary folder: it
// answers the serve banner and both API reads, and records its pid and private
// folder so the test can judge them once the battery has finished.
function fakeServer(t, root) {
  const dir = tempRoot(t);
  const script = path.join(dir, 'fake-opencode.cjs');
  const record = path.join(dir, 'server.json');
  const source = `#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const root = ${JSON.stringify(root)};
const record = ${JSON.stringify(record)};
const args = process.argv.slice(2);
if (args[0] === 'serve') {
  fs.writeFileSync(record, JSON.stringify({ pid: process.pid, dir: path.dirname(process.env.OPENCODE_DB) }));
  console.log('server listening on http://127.0.0.1:' + args[2]);
  console.log('server password FAKE-SECRET-123');
  setInterval(() => {}, 1000);
} else if (args[0] === 'api') {
  const plugin = args[4].startsWith('/api/plugin');
  const data = plugin
    ? [{ id: 'alpha', source: { type: 'local', path: path.join(root, '.opencode', 'plugins', 'alpha.js') }, state: { status: 'active' } }]
    : [{ id: 'battery', path: path.join(root, '.opencode', 'skills', 'battery', 'SKILL.md') }];
  console.log(JSON.stringify({ data }));
}
`;
  fs.writeFileSync(script, source);
  fs.chmodSync(script, 0o755);
  return { script, record };
}

function fileRecord(root, name, broken = false) {
  return { name, path: path.join(root, '.opencode', 'plugins', name), broken };
}

function debugConfigFor(files) {
  return {
    exit: 0,
    stdout: JSON.stringify({
      plugin_origins: files.map((file) => ({ spec: pathToFileURL(file.path).href })),
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

test('R9: v2 a server that never started degrades plugin-active and skill-visible', async (t) => {
  const files = [fileRecord(FIXTURE_ROOT, 'alpha.js')];
  const reason = 'fixture: no listening line or password within 30 s';
  const [active, skill] = legsForV2(files, { started: false, reason }, FIXTURE_ROOT);
  assert.equal(active.status, 'DEGRADED');
  assert.equal(active.leg, 'plugin-active');
  assert.equal(active.family, 'v2');
  assert.match(active.reason, /no listening line/);
  assert.equal(skill.status, 'DEGRADED');
  assert.equal(skill.leg, 'skill-visible');
  assert.equal(skill.family, 'v2');
  assert.match(skill.reason, /no listening line/);

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

// ─────────────────────────────────────────────────────────────────────────────
// 4. ADVERSARIAL CASES AND CROSS-CHECKS
// ─────────────────────────────────────────────────────────────────────────────

test('parity: the battery parser and the deep-loop resolver agree on one shared list', () => {
  for (const sample of VERSION_SAMPLES) {
    assert.equal(parseVersion(sample), parseOpencodeVersion(sample), JSON.stringify(sample));
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
  const files = listPluginFiles(root);
  const { calls, deps } = makeDeps({
    env: { OPENCODE_BIN: V1_BIN },
    probeVersion: () => ({ output: '1.19.3', error: null }),
    runDebugConfig: () => debugConfigFor(files),
    runHarness: () => harnessFor(files),
  });
  const code = await main(['--family=v1', '--root=' + root, '--json'], deps);
  assert.equal(code, 0);
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
      reason: 'fixture: server started',
      reads: [{ entries }, { entries }],
      skills: { data: [{ id: 'battery', path: path.join(root, '.opencode', 'skills', 'battery', 'SKILL.md') }] },
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
  const server = fakeServer(t, root);
  const { calls, deps } = makeDeps({
    env: { OPENCODE_BIN: server.script },
    probeVersion: () => ({ output: '2.0.32', error: null }),
    readV2: (bin, dir) => readV2(bin, dir, process.env),
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
  assert.equal(calls.readV2.length, 1);

  const secret = 'FAKE-SECRET-123';
  assert.ok(!JSON.stringify(summary.results).includes(secret));
  assert.ok(!calls.stdout.join('').includes(secret));
  assert.ok(!calls.stderr.join('').includes(secret));

  const record = JSON.parse(fs.readFileSync(server.record, 'utf8'));
  const leftovers = fs.existsSync(record.dir) ? fs.readdirSync(record.dir) : [];
  assert.deepEqual(leftovers, []);
  assert.throws(() => process.kill(record.pid, 0), (error) => error.code === 'ESRCH');
});
