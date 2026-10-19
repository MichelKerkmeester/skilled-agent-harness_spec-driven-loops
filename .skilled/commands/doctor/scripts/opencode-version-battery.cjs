#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Version Battery
// ───────────────────────────────────────────────────────────────────
'use strict';

// Compatibility battery for the OpenCode v1 and v2 surfaces: it proves the
// plugin folder is discovered, importable and active, and that the skill folder
// is visible, on whichever major version is installed.
//
// Every binary runs against a private data home, and the v2 leg starts its own
// `serve` on a loopback port with a private database, so the shared service is
// never started, stopped or contacted. The password that private server prints
// is only ever handed back to it as an environment variable, never printed or
// stored.
//
// Usage:
//   opencode-version-battery.cjs [--family=v1|v2|both] [--root=<dir>] [--json] [--out=<file>]
//
// Exit 0 when every requested leg passes, 1 on a failed leg, 3 when a leg is
// degraded or skipped, and 2 on a usage error or a crash.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawn, spawnSync } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { setTimeout: sleep } = require('node:timers/promises');
const { pathToFileURL } = require('node:url');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const USAGE = [
  'Usage: node opencode-version-battery.cjs [--family=v1|v2|both] [--root=<dir>] [--json] [--out=<file>]',
  '  --family  which family to check: v1, v2 or both (default: both)',
  '  --root    repository root to inspect (default: the repository root above this script)',
  '  --json    print the JSON summary on stdout instead of the human lines',
  '  --out     write the JSON summary to this file',
].join('\n');

// The version token rule is a local copy of the shared resolver's, so the
// battery and the router cannot disagree about which major version a binary reports.
const VERSION_PATTERN = /^\s*(?:[A-Za-z][\w.-]*\s+)?[vV]?(\d+)\.(\d+)\.(\d+)(?:[-+][\w.-]+)?\s*$/;

const FAMILIES = ['v1', 'v2'];
const PLUGIN_DIR_PARTS = ['.opencode', 'plugins'];

const PROBE_TIMEOUT_MS = 5000;
const CONFIG_TIMEOUT_MS = 60000;
const HARNESS_TIMEOUT_MS = 120000;
const API_TIMEOUT_MS = 20000;
const SERVER_WAIT_MS = 30000;
const SHUTDOWN_WAIT_MS = 2000;
const READ_ATTEMPTS = 15;
const READ_INTERVAL_MS = 2000;
const MAX_BUFFER = 64 * 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Builds one result row in the shared shape, so every leg reports alike.
function makeResult(leg, family, status, reason, details = []) {
  return { leg, family, status, reason, details };
}

// Creates the error the CLI turns into usage text on stderr.
function usageError(message) {
  const error = new Error(message);
  error.code = 'USAGE';
  return error;
}

// Parses a JSON object out of a stream that may carry leading noise, returning
// null when nothing parseable is present.
function parseJsonObject(text) {
  const trimmed = String(text ?? '').trim();
  if (!trimmed) return null;
  const attempt = (candidate) => {
    try {
      const value = JSON.parse(candidate);
      return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
    } catch {
      return null;
    }
  };
  const direct = attempt(trimmed);
  if (direct) return direct;
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  return start !== -1 && end > start ? attempt(trimmed.slice(start, end + 1)) : null;
}

// Renders an entry's source as text, whichever shape the server sends it in.
function sourceText(entry) {
  const source = entry?.source;
  if (typeof source === 'string') return source;
  try {
    return JSON.stringify(source) ?? '';
  } catch {
    return '';
  }
}

// Renders a whole entry as text so a file path can be looked for in any field shape.
function entryText(entry) {
  try {
    return JSON.stringify(entry) ?? '';
  } catch {
    return '';
  }
}

// The prefix a plugin entry's source must mention to belong to the inspected root.
function pluginDirPrefix(root) {
  return path.join(root, ...PLUGIN_DIR_PARTS) + path.sep;
}

// Counts plugin entries that belong to the inspected root, so entries from other
// checkouts never inflate the count.
function countEntriesUnder(entries, root) {
  const prefix = pluginDirPrefix(root);
  return entries.filter((entry) => sourceText(entry).includes(prefix)).length;
}

// Names a plugin entry for a failure line: its source file when there is one.
function entryLabel(entry) {
  const sourcePath = typeof entry?.source?.path === 'string' ? entry.source.path : null;
  if (sourcePath) return path.basename(sourcePath);
  return typeof entry?.id === 'string' ? entry.id : 'plugin entry';
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PARSERS AND LEGS
// ─────────────────────────────────────────────────────────────────────────────

// Reads the first version token that parses and lets it decide the family, so a
// joined or noisy probe line is read the same way the router reads it.
function parseVersion(text) {
  if (typeof text !== 'string') return 'unknown';
  const trimmed = text.trim();
  if (!trimmed) return 'unknown';

  for (const line of trimmed.split(/\r?\n/)) {
    const tokens = line.trim().split(/\s+/).filter(Boolean);

    for (let index = 0; index < tokens.length; index += 1) {
      const candidates = [tokens[index]];
      if (index + 1 < tokens.length) candidates.push(`${tokens[index]} ${tokens[index + 1]}`);

      for (const candidate of candidates) {
        const match = VERSION_PATTERN.exec(candidate);
        if (!match) continue;

        const major = Number(match[1]);
        if (major === 1) return 'v1';
        if (major === 2) return 'v2';
        return 'unknown';
      }
    }
  }

  return 'unknown';
}

// Parses the CLI surface; anything unknown becomes a usage error so a typo never
// silently checks the wrong thing.
function parseArgs(argv) {
  const parsed = {
    family: 'both',
    root: path.resolve(__dirname, '..', '..', '..', '..'),
    json: false,
    out: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') {
      parsed.json = true;
      continue;
    }

    let key;
    let value;
    const joined = /^--(family|root|out)=(.*)$/.exec(arg);
    if (joined) {
      key = joined[1];
      value = joined[2];
    } else {
      const spaced = /^--(family|root|out)$/.exec(arg);
      if (!spaced) throw usageError(`unknown argument: ${arg}`);
      key = spaced[1];
      const next = argv[index + 1];
      if (next === undefined || next.startsWith('--')) throw usageError(`--${key} needs a value`);
      index += 1;
      value = next;
    }

    if (key === 'family') {
      if (!FAMILIES.includes(value) && value !== 'both') throw usageError(`bad --family value: ${value}`);
      parsed.family = value;
    } else if (key === 'root') {
      if (!value) throw usageError('--root needs a directory');
      parsed.root = path.resolve(value);
    } else {
      if (!value) throw usageError('--out needs a file path');
      parsed.out = value;
    }
  }

  return parsed;
}

// Lists the top-level plugin scripts, flagging a symlink whose target is gone so
// the discovery leg can fail on it instead of silently missing the file.
function listPluginFiles(root) {
  const dir = path.join(root, ...PLUGIN_DIR_PARTS);
  let names;
  try {
    names = fs.readdirSync(dir);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
    const missing = new Error(`no plugin folder at ${dir}`);
    missing.code = 'NO_PLUGIN_DIR';
    throw missing;
  }

  return names
    .filter((name) => name.endsWith('.js'))
    .sort()
    .map((name) => {
      const filePath = path.join(dir, name);
      let broken = false;
      try {
        fs.statSync(filePath);
      } catch {
        broken = true;
      }
      return { name, path: filePath, broken };
    });
}

// Picks the first probed candidate whose parsed family matches the requested one;
// a failed probe or unknown output is never assumed to be the right family.
function selectBinary(candidates, family) {
  for (const candidate of candidates) {
    if (candidate.error) continue;
    if (parseVersion(candidate.output ?? '') !== family) continue;
    return { path: candidate.path, family };
  }
  return null;
}

// Reports the family itself before any leg runs, so a missing binary reads as a
// skip rather than a failure the other legs would have to explain.
function legFamilyPresent(family, selected) {
  if (selected) {
    return makeResult('family-present', family, 'PASS', `a ${family} binary is installed`, [selected.path]);
  }
  return makeResult('family-present', family, 'SKIP', `no ${family} binary installed`);
}

// Fails when the debug config cannot be read or does not list every plugin file,
// so discovery is proven from the binary's own view of the folder.
function legPluginDiscovered(files, debugConfig) {
  if (debugConfig?.exit !== 0) {
    return makeResult('plugin-discovered', 'v1', 'FAIL', `debug config exited with status ${debugConfig?.exit}`);
  }
  const parsed = parseJsonObject(String(debugConfig?.stdout ?? ''));
  if (!parsed) {
    return makeResult('plugin-discovered', 'v1', 'FAIL', 'debug config printed no parseable JSON object');
  }

  const origins = Array.isArray(parsed.plugin_origins)
    ? parsed.plugin_origins
    : Array.isArray(parsed.plugin) ? parsed.plugin : [];
  const specs = new Set();
  for (const origin of origins) {
    const spec = typeof origin === 'string' ? origin : origin?.spec;
    if (typeof spec === 'string' && spec.length > 0) specs.add(spec.split(/[?#]/)[0]);
  }

  const missing = files.filter((file) => !specs.has(pathToFileURL(file.path).href));
  if (missing.length > 0) {
    return makeResult(
      'plugin-discovered', 'v1', 'FAIL', 'the debug config does not list every plugin file',
      missing.map((file) => `${file.name}: not listed in the debug config`),
    );
  }
  if (files.length === 0) {
    return makeResult('plugin-discovered', 'v1', 'FAIL', 'no plugin files in the plugin folder');
  }
  const broken = files.filter((file) => file.broken);
  if (broken.length > 0) {
    return makeResult(
      'plugin-discovered', 'v1', 'FAIL', 'a plugin file is a broken symlink',
      broken.map((file) => `${file.name}: broken symlink`),
    );
  }
  return makeResult(
    'plugin-discovered', 'v1', 'PASS', `all ${files.length} plugin files discovered`,
    files.map((file) => file.name),
  );
}

// Fails on every plugin the harness reports as failed and degrades when a file
// has no harness line, because a config read alone never proves a plugin loaded.
function legPluginLoad(files, harness) {
  if (files.length === 0) {
    return makeResult('plugin-load', 'v1', 'FAIL', 'no plugin files in the plugin folder');
  }

  const records = new Map();
  for (const line of String(harness?.stdout ?? '').split('\n')) {
    const text = line.trim();
    if (!text) continue;
    let record = null;
    try {
      record = JSON.parse(text);
    } catch {
      continue; // Non-JSON noise on stdout is not a plugin record.
    }
    if (record && typeof record.name === 'string') records.set(record.name, record);
  }

  const failed = [];
  const missing = [];
  for (const file of files) {
    const record = records.get(file.name);
    if (!record) {
      missing.push(file.name);
      continue;
    }
    if (record.v1 !== 'loaded') {
      const detail = typeof record.detail === 'string' && record.detail.length > 0 ? record.detail : 'failed';
      failed.push(`${file.name}: ${detail}`);
    }
  }

  if (failed.length > 0) {
    return makeResult('plugin-load', 'v1', 'FAIL', 'the import harness could not load every plugin', failed);
  }
  if (harness?.exit !== 0) {
    return makeResult(
      'plugin-load', 'v1', 'DEGRADED', `the import harness exited with status ${harness?.exit}`,
      missing.map((name) => `${name}: no harness line`),
    );
  }
  if (missing.length > 0) {
    return makeResult(
      'plugin-load', 'v1', 'DEGRADED', 'some plugin files have no harness line',
      missing.map((name) => `${name}: no harness line`),
    );
  }
  return makeResult('plugin-load', 'v1', 'PASS', `all ${files.length} plugin files loaded`, files.map((file) => file.name));
}

// Finds the first read whose count matches the previous one and is above zero,
// which is the only point the plugin list can be judged from.
function stableIndex(counts) {
  for (let index = 1; index < counts.length; index += 1) {
    if (counts[index] > 0 && counts[index] === counts[index - 1]) return index;
  }
  return -1;
}

// Judges the plugin endpoint once its entry count stabilises, failing on any
// file missing from the stable read or any entry that is not active.
function legPluginActive(files, reads, root) {
  const readList = Array.isArray(reads) ? reads : [];
  const counts = readList.map((read) => countEntriesUnder(Array.isArray(read?.entries) ? read.entries : [], root));
  const stable = stableIndex(counts);
  if (stable === -1) {
    return makeResult(
      'plugin-active', 'v2', 'DEGRADED', 'the plugin entry count never stabilised',
      [`counts: ${counts.join(', ')}`],
    );
  }
  if (files.length === 0) {
    return makeResult('plugin-active', 'v2', 'FAIL', `no plugin files under ${root}`);
  }

  const prefix = pluginDirPrefix(root);
  const entries = Array.isArray(readList[stable]?.entries) ? readList[stable].entries : [];
  const scoped = entries.filter((entry) => sourceText(entry).includes(prefix));

  const details = [];
  for (const file of files) {
    if (!scoped.some((entry) => entryText(entry).includes(file.path))) {
      details.push(`${file.name}: no plugin entry under ${root}`);
    }
  }
  for (const entry of scoped) {
    const status = entry?.state?.status;
    if (status !== 'active') details.push(`${entryLabel(entry)}: status ${status ?? 'unknown'}`);
  }

  if (details.length > 0) {
    return makeResult('plugin-active', 'v2', 'FAIL', 'the stable read shows missing or inactive plugins', details);
  }
  return makeResult(
    'plugin-active', 'v2', 'PASS', `all ${files.length} plugin files active`,
    files.map((file) => file.name),
  );
}

// A server that never started makes both v2 legs unjudgeable, so they degrade
// with the collector's reason instead of failing on evidence nobody gathered.
function legsForV2(files, v2, root) {
  if (!v2 || v2.started !== true) {
    const reason = v2?.reason || 'the private v2 server did not start';
    return [
      makeResult('plugin-active', 'v2', 'DEGRADED', reason),
      makeResult('skill-visible', 'v2', 'DEGRADED', reason),
    ];
  }
  return [legPluginActive(files, v2.reads, root), legSkillVisible(v2.skills, root)];
}

// Passes when the skill endpoint lists at least one entry from this root, so a
// server answering with an empty list is never mistaken for a working install.
function legSkillVisible(response, root) {
  if (!response || typeof response !== 'object' || !Array.isArray(response.data)) {
    return makeResult('skill-visible', 'v2', 'FAIL', 'the skill listing did not parse');
  }
  const visible = response.data.filter((entry) => entryText(entry).includes(root));
  if (visible.length === 0) {
    return makeResult('skill-visible', 'v2', 'FAIL', `no skill entry mentions ${root}`);
  }
  return makeResult(
    'skill-visible', 'v2', 'PASS', `${visible.length} skill entries visible`,
    [`entries: ${response.data.length}`, `visible: ${visible.length}`],
  );
}

// Collapses the rows into the exit code, worst first: a failure outranks a
// degraded or skipped leg, which outranks a clean pass.
function worstExit(results) {
  if (results.some((item) => item.status === 'FAIL')) return 1;
  if (results.some((item) => item.status === 'DEGRADED' || item.status === 'SKIP')) return 3;
  return 0;
}

// Renders the rows for a terminal: one status line per leg, details indented
// under it so a failure explains itself without a second command.
function formatHuman(results) {
  const lines = [];
  for (const item of results) {
    lines.push(`${item.status} ${item.family} ${item.leg}: ${item.reason}`);
    for (const detail of item.details || []) lines.push(`  ${detail}`);
  }
  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MAIN
// ─────────────────────────────────────────────────────────────────────────────

// Probes each distinct candidate path once and keeps the raw output, so the
// family decision is made without ever running a binary twice.
function probeCandidates(deps) {
  const paths = [];
  for (const candidate of [deps.env?.OPENCODE_BIN, deps.which('opencode'), deps.which('opencode2')]) {
    if (typeof candidate === 'string' && candidate.length > 0 && !paths.includes(candidate)) {
      paths.push(candidate);
    }
  }
  return paths.map((candidatePath) => {
    const probe = deps.probeVersion(candidatePath) || {};
    return { path: candidatePath, output: probe.output ?? '', error: probe.error ?? null };
  });
}

// Runs every requested leg and returns the exit code the CLI reports; the
// collectors arrive through deps, so the battery is testable without an installed
// binary and the real ones stay swappable.
async function main(argv, deps = {}) {
  const runtime = { ...defaultDeps(), ...deps };

  let args;
  try {
    args = parseArgs(argv);
  } catch (error) {
    runtime.stderr(`${USAGE}\n${error?.message ?? ''}\n`);
    return 2;
  }

  try {
    const probed = probeCandidates(runtime);
    const results = [];

    for (const family of args.family === 'both' ? FAMILIES : [args.family]) {
      const selected = selectBinary(probed, family);
      results.push(legFamilyPresent(family, selected));
      if (!selected) continue;

      if (family === 'v1') {
        let files;
        try {
          files = listPluginFiles(args.root);
        } catch (error) {
          results.push(makeResult('plugin-discovered', 'v1', 'FAIL', error.message));
          results.push(makeResult('plugin-load', 'v1', 'FAIL', error.message));
          continue;
        }
        results.push(legPluginDiscovered(files, runtime.runDebugConfig(selected.path, args.root)));
        results.push(legPluginLoad(files, runtime.runHarness(args.root)));
      } else {
        let files = [];
        try {
          files = listPluginFiles(args.root);
        } catch (error) {
          if (error?.code !== 'NO_PLUGIN_DIR') throw error;
        }
        const v2 = await runtime.readV2(selected.path, args.root);
        results.push(...legsForV2(files, v2, args.root));
      }
    }

    const exit = worstExit(results);
    const summary = { root: args.root, family: args.family, results, exit };
    const summaryJson = `${JSON.stringify(summary, null, 2)}\n`;

    if (args.out) {
      try {
        runtime.writeFile(args.out, summaryJson);
      } catch (error) {
        runtime.stderr(`cannot write ${args.out}: ${error?.message ?? error}\n`);
        return 2;
      }
    }

    runtime.stdout(args.json ? summaryJson : `${formatHuman(results)}\n`);
    return exit;
  } catch (error) {
    runtime.stderr(`opencode-version-battery: ${error?.message ?? error}\n`);
    return 2;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. REAL COLLECTORS
// ─────────────────────────────────────────────────────────────────────────────

// OpenCode truncates a piped stdout at exactly 65,536 bytes, so the child's
// stdout goes into a file in the caller's temporary folder and is read back.
function captureStdout(dir, run) {
  const file = path.join(dir, 'stdout.txt');
  const fd = fs.openSync(file, 'w');
  try {
    const result = run(fd);
    return { ...result, stdout: fs.readFileSync(file, 'utf8') };
  } finally {
    fs.closeSync(fd);
    fs.rmSync(file, { force: true });
  }
}

// Probes one binary with a private data home, so a version check cannot write
// into the operator's real XDG tree.
function probeVersion(binaryPath, env = process.env) {
  const dataHome = fs.mkdtempSync(path.join(os.tmpdir(), 'opencode-battery-probe-'));
  try {
    const result = captureStdout(dataHome, (fd) => spawnSync(binaryPath, ['--version'], {
      input: '',
      timeout: PROBE_TIMEOUT_MS,
      env: { ...env, XDG_DATA_HOME: dataHome },
      stdio: ['pipe', fd, 'pipe'],
    }));
    const output = [result.stdout?.toString() ?? '', result.stderr?.toString() ?? '']
      .filter((part) => part.length > 0)
      .join('\n');
    const error = result.error
      ? result.error.message
      : result.status === 0 ? null : `probe exited with status ${result.status ?? result.signal ?? 'unknown'}`;
    return { output, error };
  } finally {
    fs.rmSync(dataHome, { recursive: true, force: true });
  }
}

// Resolves a command on PATH without a shell, returning the first executable
// regular file so a name is never assumed to resolve.
function whichBinary(name, env = process.env) {
  const searchPath = typeof env?.PATH === 'string' ? env.PATH : '';
  for (const dir of searchPath.split(path.delimiter)) {
    if (!dir) continue;
    const candidate = path.join(dir, name);
    try {
      if (!fs.statSync(candidate).isFile()) continue;
      fs.accessSync(candidate, fs.constants.X_OK);
      return candidate;
    } catch {
      // Keep searching; this directory does not hold an executable.
    }
  }
  return null;
}

// Runs `debug config` from the repository root with a private data home and a
// buffer sized for a large config dump.
function runDebugConfig(bin, root, env = process.env) {
  const dataHome = fs.mkdtempSync(path.join(os.tmpdir(), 'opencode-battery-config-'));
  try {
    const result = captureStdout(dataHome, (fd) => spawnSync(bin, ['debug', 'config'], {
      cwd: root,
      stdio: ['ignore', fd, 'pipe'],
      timeout: CONFIG_TIMEOUT_MS,
      env: { ...env, XDG_DATA_HOME: dataHome },
      maxBuffer: MAX_BUFFER,
    }));
    return {
      exit: typeof result.status === 'number' ? result.status : 1,
      stdout: result.stdout?.toString() ?? '',
    };
  } finally {
    fs.rmSync(dataHome, { recursive: true, force: true });
  }
}

// The import harness runs inside the repository root, so every plugin imports
// through the resolver a real session would use; it prints one JSON line per
// file and always exits 0, because a plugin failure is data, not a crash.
const HARNESS_SOURCE = `
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[1];
const dir = path.join(root, '.opencode', 'plugins');
const client = new Proxy(function batteryClient() {}, {
  get(_target, property) { return property === 'then' ? undefined : client; },
  apply() { return client; },
  construct() { return client; },
});

const names = readdirSync(dir).filter((name) => name.endsWith('.js')).sort();
for (const name of names) {
  let record = { name, v1: 'failed', detail: 'the factory did not resolve' };
  try {
    const loaded = await import(pathToFileURL(path.join(dir, name)).href);
    const fallback = loaded.default;
    const factory = typeof fallback === 'function'
      ? fallback
      : fallback && typeof fallback.server === 'function' ? fallback.server : null;
    if (!factory) throw new Error('the plugin exports neither a function nor a server function');
    await factory({
      client,
      project: { id: 'battery' },
      worktree: root,
      directory: root,
      serverUrl: new URL('http://127.0.0.1:0'),
      $: client,
    });
    record = { name, v1: 'loaded', detail: 'loaded' };
  } catch (error) {
    record = { name, v1: 'failed', detail: error && error.message ? error.message : String(error) };
  }
  console.log(JSON.stringify(record));
}
process.exit(0);
`;

// Runs the import harness through the same Node binary as this script, so the
// plugins are judged by the interpreter that would load them.
function runHarness(root) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'opencode-battery-harness-'));
  try {
    const args = ['--input-type=module', '-e', HARNESS_SOURCE, root];
    const result = captureStdout(temp, (fd) => spawnSync(process.execPath, args, {
      cwd: root,
      timeout: HARNESS_TIMEOUT_MS,
      maxBuffer: MAX_BUFFER,
      stdio: ['ignore', fd, 'pipe'],
    }));
    return {
      exit: typeof result.status === 'number' ? result.status : 1,
      stdout: result.stdout?.toString() ?? '',
    };
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

// Reserves a loopback port and releases it for the private server, so two
// batteries can run side by side without colliding.
function findFreePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.unref();
    probe.on('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

// Waits for both startup lines on stdout and returns the password alone; null
// means the child died or the deadline passed, and the password never travels
// further than the environment of the private server's own clients.
function waitForBanner(child, port, timeoutMs) {
  return new Promise((resolve) => {
    let buffer = '';
    let settled = false;

    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      child.stdout.removeListener('data', onData);
      child.removeListener('exit', onExit);
      child.removeListener('error', onError);
      resolve(value);
    };
    const onData = (chunk) => {
      buffer += chunk.toString();
      const listening = buffer.includes(`server listening on http://127.0.0.1:${port}`);
      const password = /server password (\S+)/.exec(buffer);
      if (listening && password) finish(password[1]);
    };
    const onExit = () => finish(null);
    const onError = () => finish(null);
    const timer = setTimeout(() => finish(null), timeoutMs);

    child.stdout.on('data', onData);
    child.on('exit', onExit);
    child.on('error', onError);
  });
}

// Terminates the private server and escalates to SIGKILL, so no exit path leaves
// an orphaned process behind.
async function stopChild(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  child.kill('SIGTERM');
  await Promise.race([once(child, 'exit').catch(() => {}), sleep(SHUTDOWN_WAIT_MS)]);
  if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
}

// Runs one authenticated read against the private server; a failed spawn or an
// unparseable body returns null so the caller degrades instead of crashing.
function readApiJson(bin, serverUrl, apiPath, env, cwd) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'opencode-battery-api-'));
  try {
    const args = ['api', '--server', serverUrl, 'GET', apiPath];
    const result = captureStdout(temp, (fd) => spawnSync(bin, args, {
      cwd,
      env,
      timeout: API_TIMEOUT_MS,
      maxBuffer: MAX_BUFFER,
      stdio: ['ignore', fd, 'pipe'],
    }));
    return parseJsonObject(result.stdout?.toString() ?? '');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

// Starts a private v2 server on a free loopback port, reads the plugin endpoint
// until its count stabilises, then reads the skill endpoint; the server is killed
// and the private folder removed on every path, including a thrown error or a signal.
async function readV2(bin, root, env = process.env) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'opencode-battery-v2-'));
  const childEnv = {
    ...env,
    OPENCODE_DB: path.join(temp, 'private.db'),
    XDG_DATA_HOME: path.join(temp, 'data'),
  };
  let child = null;
  let cleaning = null;

  // Stops the private server and removes its folder once. Both paths await the
  // same promise, so a signal that lands while the finally path is cleaning up
  // waits for that cleanup instead of exiting through it.
  const cleanup = () => {
    cleaning ??= (async () => {
      try {
        await stopChild(child);
      } finally {
        fs.rmSync(temp, { recursive: true, force: true });
      }
    })();
    return cleaning;
  };

  // A signal mid-read must still stop the private server and remove its folder,
  // so the handlers go up before the first await that follows the folder's creation.
  const onSignal = (code) => async () => {
    await cleanup().catch(() => {});
    process.exit(code);
  };
  const onSigint = onSignal(130);
  const onSigterm = onSignal(143);
  process.once('SIGINT', onSigint);
  process.once('SIGTERM', onSigterm);

  try {
    fs.mkdirSync(childEnv.XDG_DATA_HOME, { recursive: true });
    const port = await findFreePort();
    const serverUrl = `http://127.0.0.1:${port}`;

    child = spawn(bin, ['serve', '--port', String(port)], {
      cwd: root,
      env: childEnv,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.stderr.on('data', () => {}); // Drain stderr so a full pipe cannot stall the server.

    const password = await waitForBanner(child, port, SERVER_WAIT_MS);
    if (password === null) {
      return { started: false, reason: `no listening line or password within ${SERVER_WAIT_MS / 1000} s` };
    }

    const apiEnv = { ...childEnv, OPENCODE_PASSWORD: password };
    const pluginPath = `/api/plugin?location%5Bdirectory%5D=${encodeURIComponent(root)}`;
    const reads = [];
    const counts = [];

    for (let attempt = 0; attempt < READ_ATTEMPTS; attempt += 1) {
      const body = readApiJson(bin, serverUrl, pluginPath, apiEnv, root);
      const entries = Array.isArray(body?.data) ? body.data : [];
      reads.push({ entries });
      counts.push(countEntriesUnder(entries, root));
      if (stableIndex(counts) !== -1) break;
      if (attempt < READ_ATTEMPTS - 1) await sleep(READ_INTERVAL_MS);
    }

    const skillPath = `/api/skill?location%5Bdirectory%5D=${encodeURIComponent(root)}`;
    const skills = readApiJson(bin, serverUrl, skillPath, apiEnv, root);
    return { started: true, reason: 'the private v2 server answered', reads, skills };
  } finally {
    await cleanup();
    process.removeListener('SIGINT', onSigint);
    process.removeListener('SIGTERM', onSigterm);
  }
}

// Wires the real collectors and process streams, injectable per call so tests can
// drive every leg without spawning a binary.
function defaultDeps() {
  return {
    env: process.env,
    probeVersion: (binaryPath) => probeVersion(binaryPath, process.env),
    which: (name) => whichBinary(name, process.env),
    runDebugConfig: (bin, root) => runDebugConfig(bin, root, process.env),
    runHarness: (root) => runHarness(root),
    readV2: (bin, root) => readV2(bin, root, process.env),
    writeFile: (file, text) => fs.writeFileSync(file, text),
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS AND CLI ENTRY
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  parseVersion,
  parseArgs,
  listPluginFiles,
  selectBinary,
  legFamilyPresent,
  legPluginDiscovered,
  legPluginLoad,
  stableIndex,
  legPluginActive,
  legsForV2,
  legSkillVisible,
  worstExit,
  formatHuman,
  main,
  probeVersion,
  runDebugConfig,
  runHarness,
  readV2,
  HARNESS_SOURCE,
};

// The entry sets the exit code instead of calling process.exit, so pending
// stream writes flush before the process ends.
if (require.main === module) {
  main(process.argv.slice(2)).then(
    (code) => { process.exitCode = code; },
    (error) => {
      process.stderr.write(`${error?.message ?? error}\n`);
      process.exitCode = 2;
    },
  );
}
