// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Spawned Checks
// ───────────────────────────────────────────────────────────────────
'use strict';

// The checks the runner starts as processes: the comment-hygiene checker under the repository's
// own policy, one node --check pool per JavaScript change, bash -n per shell file, one python3
// parse floor for Python, YAML and TOML, and the dist adapter for a declared build output. A tool
// that is not there, a deadline that passes and an argument the checker refuses are states this
// module reports rather than errors it raises, because each one is evidence the verdict carries.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const qualityConfig = require('./quality-config.cjs');
const { findTool, spawnArgv } = require('./run-check.cjs');

const {
  DEFAULT_TIMEOUT_SEC, DIST_CHECKER, HUB_ROOT, HYGIENE_CHECKER, NODE_CHECK_HELPER, aggregateState, checkEntry,
  excerpt, fileOrigin, finding, originFor, realpathOrSelf,
} = require('./gate-core.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// A syntax check on a fifty-file change is fifty interpreters, and a sequential loop
// spent most of the check's time starting them. The pool is bounded well below the core
// count so the rest of the run, and the machine, keep room, and a single-file change
// still starts one child.
const NODE_CHECK_MAX_PARALLEL = 8;
const NODE_CHECK_GRACE_MS = 5000;

const DIST_STALE = 'STALE DIST WARNING:';
const DIST_ERROR = 'DIST FRESHNESS CHECK ERROR:';
const DIST_UNMATCHED = 'DIST FRESHNESS CHECK UNMATCHED:';

// One python3 process parses every Python, YAML and TOML file in scope. ast.parse
// compiles nothing to disk, and compose_all reads YAML structure without building
// objects, so an unknown tag is never a parse fault. The user site is added back
// because isolated mode drops it, and that is where a user-installed PyYAML lives.
const PARSE_SCRIPT = [
  'import ast, json, re, site, sys',
  'try:',
  '    site.addsitedir(site.getusersitepackages())',
  'except Exception:',
  '    pass',
  'try:',
  '    import yaml',
  'except Exception:',
  '    yaml = None',
  'try:',
  '    import tomllib',
  'except Exception:',
  '    tomllib = None',
  'results = []',
  'for item in json.load(sys.stdin):',
  '    path, kind = item["path"], item["kind"]',
  '    entry = {"path": path, "kind": kind, "ok": True}',
  '    try:',
  '        with open(path, "rb") as handle:',
  '            data = handle.read()',
  '        if kind == "python":',
  '            ast.parse(data, filename=path)',
  '        elif kind == "yaml" and yaml is None:',
  '            entry = {"path": path, "kind": kind, "unavailable": True}',
  '        elif kind == "yaml":',
  '            for _ in yaml.compose_all(data.decode("utf-8-sig"), Loader=yaml.SafeLoader):',
  '                pass',
  '        elif kind == "toml" and tomllib is None:',
  '            entry = {"path": path, "kind": kind, "unavailable": True}',
  '        elif kind == "toml":',
  '            tomllib.loads(data.decode("utf-8-sig"))',
  '    except SyntaxError as error:',
  '        entry = {"path": path, "kind": kind, "ok": False, "line": error.lineno, "message": error.msg}',
  '    except OSError as error:',
  '        entry = {"path": path, "kind": kind, "error": str(error)}',
  '    except Exception as error:',
  '        text = str(error) or type(error).__name__',
  '        mark = getattr(error, "problem_mark", None)',
  '        found = re.search(r"line (\\d+)", text)',
  '        line = mark.line + 1 if mark is not None else (int(found.group(1)) if found else None)',
  '        entry = {"path": path, "kind": kind, "ok": False, "line": line, "message": text.splitlines()[0]}',
  '    results.append(entry)',
  'json.dump(results, sys.stdout)',
].join('\n');

const HYGIENE_FLAG_FIELDS = Object.freeze({
  '--ticket-prefix': 'commentHygiene.ticketPrefixes',
  '--extension': 'commentHygiene.extensions',
  '--extra-pattern': 'commentHygiene.extraPatterns',
  '--disable-rule': 'commentHygiene.disableRules',
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. HYGIENE CHECKER
// ─────────────────────────────────────────────────────────────────────────────

// The repository's hygiene policy reaches the checker as its own flags: additions on top
// of the core patterns, and the core rules the repository switched off, which the checker
// refuses for any rule the shared contract fixes. A value it refuses ends its run with a
// usage error, which the row reports with the checker's own message. A refusal that
// names one of these flags is a config fault instead, because only the field that
// supplied the value can be repaired, so the gate reports that field the way a bad
// config file is reported.
function hygieneFlags(context) {
  return qualityConfig.hygieneCheckerFlags(context.merged.commentHygiene);
}

// The checker marks its own refusal with ERROR, and the interpreter can print a warning
// above that line, so the marker decides which line carries the refusal. A stderr with no
// marked line falls back to the first line that is not part of the usage text.
function hygieneRefusal(stderr) {
  const lines = stderr.split('\n').map((line) => line.trim()).filter((line) => line);
  return lines.find((line) => line.startsWith('ERROR:')) || lines.find((line) => !line.startsWith('Usage:')) || '';
}

// A flag refusal starts with the flag the checker named, so its first word decides which
// field supplied the value. A flag the runner supplies itself names no field, so its row
// stays a plain error.
function refusedHygieneField(refusal) {
  const [flag] = (refusal || '').split(/[^A-Za-z0-9-]+/).filter(Boolean);
  return flag && Object.prototype.hasOwnProperty.call(HYGIENE_FLAG_FIELDS, flag) ? HYGIENE_FLAG_FIELDS[flag] : null;
}

function runHygiene(files, context) {
  const argv = [context.python, '-B', '-I', HYGIENE_CHECKER, '--json', ...hygieneFlags(context), '--', ...files.map((facts) => facts.rel)];
  const result = spawnArgv(argv, { cwd: context.root, env: context.env, timeoutMs: context.timeoutMs });
  const base = { exit: result.exit, duration_ms: result.durationMs };
  if (result.state === 'TIMEOUT' || result.state === 'ERROR') return { ...base, state: result.state, findings: [] };
  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    const refusal = hygieneRefusal(result.stderr);
    const quoted = (refusal || '').replace(/^ERROR:\s*/, '');
    const field = refusedHygieneField(quoted);
    if (field) {
      return { ...base, state: 'ERROR', findings: [],
        configFault: { field, message: `${field}: the checker refused the value: ${quoted}` } };
    }
    return { ...base, state: 'ERROR', findings: [],
      repair: refusal ? `the checker refused its arguments: ${refusal}` : 'the checker printed no comment-hygiene/v1 document' };
  }
  const byRel = new Map(files.map((facts) => [facts.rel, facts]));
  const findings = [];
  let unreadable = false;
  for (const record of Array.isArray(report.files) ? report.files : []) {
    const facts = byRel.get(record.file);
    if (record.status === 'unreadable') unreadable = true;
    if (!facts) continue;
    for (const hit of record.findings || []) {
      findings.push(finding({ rule: `hygiene.${hit.rule}`, severity: 'P0', confidence: 'exact', file: facts.rel,
        line: hit.line, origin: originFor(facts, hit.line), reason: hit.reason, excerpt: hit.excerpt ? excerpt(String(hit.excerpt)) : null,
        check: 'comment-hygiene' }));
    }
  }
  const failed = unreadable || ![0, 1, 2].includes(report.exit_code);
  return { ...base, state: failed ? 'ERROR' : findings.length ? 'RAN_FAIL' : 'RAN_CLEAN', findings };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. NODE POOL
// ─────────────────────────────────────────────────────────────────────────────

// How many syntax checks may run at once. One is the floor, because a pool of none would
// never finish, and one core is left for the parent so the pool cannot starve the process
// that reads its result. The ceiling keeps a large change from taking every core the rest
// of the run needs.
function nodeCheckPoolLimit() {
  const cores = typeof os.availableParallelism === 'function' ? os.availableParallelism() : os.cpus().length;
  return Math.max(1, Math.min(NODE_CHECK_MAX_PARALLEL, cores - 1));
}

// The helper prints one record per file, in the order it was given. Anything else, a
// partial write from a killed helper included, is a result the parent cannot trust, so it
// reports the check the way a sequential run reported a check that never returned.
/**
 * Parse and validate the helper's ordered syntax-check records.
 *
 * @param {string} stdout - Serialized records returned by the helper.
 * @param {number} expected - Number of files the helper was asked to check.
 * @returns {Array<Object>|null} Valid records, or null when the output is incomplete or invalid.
 */
function nodeCheckRecords(stdout, expected) {
  let records;
  try {
    records = JSON.parse(stdout);
  } catch {
    return null;
  }
  if (!Array.isArray(records) || records.length !== expected) return null;
  return records.every((record) => record && typeof record.file === 'string' && typeof record.stderr === 'string') ? records : null;
}

// One record reads back as the result a sequential `node --check` returned: the same
// stderr and the same verdict, so the finding built from it is built from the same
// evidence.
/**
 * Convert one helper record to the gate's syntax-check result shape.
 *
 * @param {Object} record - One validated syntax-check record.
 * @returns {{state:string, stderr:string}} The gate state and captured error output.
 */
function nodeCheckResult(record) {
  if (record.timedOut) return { state: 'TIMEOUT', stderr: record.stderr };
  if (record.error) return { state: 'ERROR', stderr: record.stderr };
  return { state: record.status === 0 ? 'RAN_CLEAN' : 'RAN_FAIL', stderr: record.stderr };
}

// Every file still gets its own `node --check`, because that command is the authority the
// check reports on and an in-process compiler would answer a different question. Only the
// waiting overlaps: one helper starts the children, bounded by the core count, inside the
// single window the runner already holds for its built-in checks, and returns them in
// input order so a finding is built from the same record and reported in the same place.
function runNodeCheck(files, context) {
  if (files.length === 0) return { state: 'RAN_CLEAN', findings: [], duration_ms: 0 };
  const parallel = nodeCheckPoolLimit();
  // The helper gives each child the full per-check deadline, so its own deadline covers
  // every wave it may run plus a margin for the helper and the parent to start and stop.
  const waves = Math.ceil(files.length / parallel);
  // The helper starts every child in its own process group and stops them all when it is
  // asked to, so the deadline sends SIGTERM rather than SIGKILL: a helper starved past its
  // own children's deadlines can then take its children with it, and it leaves on that
  // signal without waiting, so the parent's wait still ends.
  const result = spawnArgv([process.execPath, NODE_CHECK_HELPER, process.execPath, String(parallel), String(context.timeoutMs)], {
    cwd: context.root,
    env: context.env,
    timeoutMs: context.timeoutMs * waves + NODE_CHECK_GRACE_MS,
    killSignal: 'SIGTERM',
    input: JSON.stringify(files.map((facts) => facts.abs)),
  });
  const records = nodeCheckRecords(result.stdout, files.length);
  if (records === null) {
    return { state: result.state === 'TIMEOUT' ? 'TIMEOUT' : 'ERROR', findings: [], duration_ms: result.durationMs };
  }
  const results = records.map(nodeCheckResult);
  const findings = [];
  results.forEach((outcome, index) => {
    if (outcome.state !== 'RAN_FAIL') return;
    const facts = files[index];
    const where = /:(\d+)\s*$/.exec(outcome.stderr.split('\n')[0]);
    const message = /^(?:SyntaxError|Error): (.*)$/m.exec(outcome.stderr);
    const exact = facts.syntax === 'mjs';
    findings.push(finding({ rule: exact ? 'syntax.mjs' : 'syntax.js', severity: 'P0', confidence: exact ? 'exact' : 'heuristic',
      file: facts.rel, line: where ? Number(where[1]) : null, origin: fileOrigin(facts),
      reason: `node --check: ${message ? message[1] : outcome.stderr.trim().split('\n').pop()}`, check: 'syntax-node' }));
  });
  return { state: aggregateState(results, findings.length > 0), findings, duration_ms: result.durationMs };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SHELL AND PARSE FLOOR
// ─────────────────────────────────────────────────────────────────────────────

function runShellCheck(files, context) {
  const results = [];
  const findings = [];
  for (const facts of files) {
    const result = spawnArgv([context.bash, '-n', facts.abs], { cwd: context.root, env: context.env, timeoutMs: context.timeoutMs });
    results.push(result);
    if (result.state !== 'RAN_FAIL') continue;
    const where = /line (\d+): (.*)$/m.exec(result.stderr);
    findings.push(finding({ rule: 'syntax.shell', severity: 'P0', confidence: 'exact', file: facts.rel,
      line: where ? Number(where[1]) : null, origin: fileOrigin(facts),
      reason: `bash -n: ${where ? where[2] : result.stderr.trim().split('\n')[0]}`, check: 'syntax-shell' }));
  }
  return { state: aggregateState(results, findings.length > 0), findings, duration_ms: results.reduce((sum, r) => sum + r.durationMs, 0) };
}

const PARSE_CHECKS = Object.freeze({ python: 'syntax-python', yaml: 'syntax-yaml', toml: 'syntax-toml' });
const PARSER_REPAIRS = Object.freeze({
  'syntax-yaml': 'install PyYAML for python3 to parse YAML',
  'syntax-toml': 'run Python 3.11 or later, whose tomllib parses TOML',
});

// One process parses every Python, YAML and TOML file, and its result is split back
// into the three checks it serves.
function runParseFloor(byCheck, context) {
  const items = [];
  for (const [kind, id] of Object.entries(PARSE_CHECKS)) {
    for (const facts of byCheck[id] || []) items.push({ path: facts.abs, kind, facts });
  }
  const result = spawnArgv([context.python, '-B', '-I', '-c', PARSE_SCRIPT], {
    cwd: context.root,
    env: context.env,
    timeoutMs: context.timeoutMs,
    input: JSON.stringify(items.map(({ path: file, kind }) => ({ path: file, kind }))),
  });
  const outcome = {};
  const fail = (state, repair) => {
    for (const id of Object.keys(byCheck)) outcome[id] = { state, findings: [], repair, duration_ms: result.durationMs };
    return outcome;
  };
  if (result.state !== 'RAN_CLEAN') return fail(result.state === 'TIMEOUT' ? 'TIMEOUT' : 'ERROR', null);
  let parsed;
  try {
    parsed = JSON.parse(result.stdout);
  } catch {
    return fail('ERROR', 'the parse floor printed no result list');
  }
  for (const id of Object.keys(byCheck)) outcome[id] = { findings: [], unavailable: false, failed: false, duration_ms: result.durationMs };
  parsed.forEach((entry, index) => {
    const item = items[index];
    if (!item) return;
    const id = PARSE_CHECKS[item.kind];
    if (entry.unavailable) outcome[id].unavailable = true;
    else if (entry.error) outcome[id].failed = true;
    else if (entry.ok === false) {
      outcome[id].findings.push(finding({ rule: `syntax.${item.kind}`, severity: 'P0', confidence: 'exact', file: item.facts.rel,
        line: entry.line || null, origin: fileOrigin(item.facts), reason: `does not parse: ${entry.message}`, check: id }));
    }
  });
  for (const id of Object.keys(byCheck)) {
    const entry = outcome[id];
    if (entry.unavailable) Object.assign(entry, { state: 'SKIPPED_ABSENT', repair: PARSER_REPAIRS[id] });
    else entry.state = entry.failed ? 'ERROR' : entry.findings.length ? 'RAN_FAIL' : 'RAN_CLEAN';
  }
  return outcome;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DIST ADAPTER
// ─────────────────────────────────────────────────────────────────────────────

function readHookFlags(file) {
  const flags = {};
  try {
    for (const raw of fs.readFileSync(file, 'utf8').replace(/^﻿/, '').split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('#') || !line.includes('=')) continue;
      const key = line.slice(0, line.indexOf('=')).trim();
      let value = line.slice(line.indexOf('=') + 1).replace(/[ \t]#.*$/, '').trim();
      if (value.length >= 2 && value[0] === value[value.length - 1] && ['"', "'"].includes(value[0])) value = value.slice(1, -1);
      if (key) flags[key] = value;
    }
  } catch {
    return {};
  }
  return flags;
}

// The dist checker stays silent when its hook switch is off, so the adapter reads the
// switch the way the checker does and reports the skip instead of reading silence as
// fresh.
function distSwitchOn(script, env) {
  const truthy = (value) => ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase());
  const sourceRoot = path.resolve(path.dirname(realpathOrSelf(script)), '..', '..', '..', '..');
  const flags = readHookFlags(env.HOOK_FLAGS_CONFIG || path.join(sourceRoot, 'hooks', 'hook-flags.env'));
  const resolve = (key) => (Object.prototype.hasOwnProperty.call(env, key) ? env[key] : flags[key]);
  return !truthy(resolve('SYSTEM_HOOKS_DISABLED')) && !truthy(resolve('SYSTEM_DIST_FRESHNESS_DISABLED'));
}

// The checker prints the path it could not resolve before the separator, and the
// row already carries the path the runner passed, so only the reason is kept.
function distUnmatchedDetail(line) {
  const text = line.slice(DIST_UNMATCHED.length).trim();
  const separator = text.indexOf(' -- ');
  return separator === -1 ? text : text.slice(separator + 4).trim();
}

/**
 * Check declared generated files with the dist checker's per-file mode, which never
 * rebuilds and writes no cache record. It always exits 0, so the banner it prints is the
 * only signal, and any line it does not recognize reads as an error, never as fresh.
 *
 * @param {Array<{rel:string, abs:string}>} files - Declared generated files in scope.
 * @param {Object} [options] - env, timeoutMs, noRun, script, cwd and workspaceRoot.
 *   The workspace root defaults to the cwd, and the run passes the repository it
 *   scanned so the checker maps a declared path in that repository.
 * @returns {{check:Object, findings:Object[]}}
 */
function runDistAdapter(files, { env = process.env, timeoutMs = DEFAULT_TIMEOUT_SEC * 1000, noRun = false,
  script = DIST_CHECKER, cwd = path.resolve(HUB_ROOT, '..', '..', '..'), workspaceRoot = cwd } = {}) {
  const check = checkEntry('dist-staleness', { argv: ['python3', '-B', script, '{file}'], cwd, files: files.length });
  if (files.length === 0) return { check, findings: [] };
  if (!distSwitchOn(script, env)) {
    return { check: { ...check, state: 'SKIPPED_BY_FLAG', repair: 'the dist-freshness hook switch is off, so no file was checked' }, findings: [] };
  }
  const python = findTool('python3', env);
  if (!python) return { check: { ...check, state: 'SKIPPED_ABSENT', repair: 'install python3' }, findings: [] };
  if (noRun) return { check: { ...check, state: 'LISTED' }, findings: [] };
  const findings = [];
  const results = [];
  const unmatched = [];
  for (const file of files) {
    const result = spawnArgv([python, '-B', script, file.abs], {
      cwd,
      // The checker resolves packages against the repository the run scanned, not
      // the checkout that happens to hold the script, so both halves of the run
      // agree on which package owns a declared path.
      env: { ...env, SPECKIT_DIST_AUTO_REBUILD: '0', SPECKIT_DIST_READ_ONLY: '1', SPECKIT_DIST_WORKSPACE_ROOT: workspaceRoot },
      timeoutMs,
    });
    const banner = result.stdout.split('\n').map((line) => line.trim()).filter(Boolean);
    const unmatchedLine = banner.find((line) => line.startsWith(DIST_UNMATCHED));
    if (unmatchedLine) {
      unmatched.push({ rel: file.rel, detail: distUnmatchedDetail(unmatchedLine) });
      results.push({ ...result, state: 'ERROR' });
      continue;
    }
    const unknown = banner.some((line) => !line.startsWith(DIST_STALE));
    const broken = result.state === 'RAN_FAIL' || result.stderr.trim() !== '' || unknown;
    results.push(broken && !['TIMEOUT', 'ERROR'].includes(result.state) ? { ...result, state: 'ERROR' } : result);
    if (broken) continue;
    for (const line of banner) {
      findings.push(finding({ rule: 'dist.stale', severity: 'P1', confidence: 'exact', file: file.rel, line: null,
        origin: 'changed-line', reason: line, check: 'dist-staleness' }));
    }
  }
  const duration = results.reduce((sum, result) => sum + result.durationMs, 0);
  // A generated path the checker cannot map to a package was not checked at all.
  // An empty banner would otherwise count the file as verified, so the row fails
  // and names every path it could not resolve.
  const state = unmatched.length > 0 ? 'ERROR' : aggregateState(results, findings.length > 0);
  const repair = unmatched.length > 0
    ? `the dist freshness check did not recognize ${unmatched.map(({ rel, detail }) => `${rel} (${detail})`).join(', ')}`
    : null;
  return { check: { ...check, state, duration_ms: duration, repair }, findings };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  PARSE_CHECKS, hygieneFlags, nodeCheckRecords, nodeCheckResult, runDistAdapter, runHygiene, runNodeCheck,
  runParseFloor, runShellCheck,
};
