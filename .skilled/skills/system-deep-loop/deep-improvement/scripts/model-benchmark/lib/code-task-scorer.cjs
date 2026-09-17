// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ code-task-scorer — dimension-vector producer for one benchmark cell      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// Dimension-vector producer for ONE benchmark cell. Given a model's raw output
// and a code-task fixture, it extracts the target function, runs the fixture's
// visible + hidden tests as deep-equal oracles in ISOLATED child processes, and
// returns a correctness/format/length vector. Correctness is reported as a rate
// (0..1) so the reducer can gate on it; format-adherence stays in its own lane so
// a format/brevity winner is never mistaken for a correctness winner.
//
// Generalized from the one-off bake-off rig's extract + runtests + runner-child
// trio: extraction handles fenced and bare output and the function/arrow forms;
// per-case isolation means a model that throws, hangs, or defines globals on one
// input zeroes only that case, not the whole suite. Dependency-free (Node stdlib).

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Extraction: pull a single function definition out of a model response.
// Models often wrap code in a markdown fence even when told not to, so both
// fenced and bare output are handled, as are `function name(...)` and the
// `const name = (...) =>` / arrow forms.

/**
 * Strip the first fenced code block's fence markers.
 *
 * @param {string} text - Raw model text possibly containing a markdown fence.
 * @returns {{code: string, wasFenced: boolean}} Unfenced code and fence flag.
 */
function unfence(text) {
  const fenceRe = /```(?:[a-zA-Z0-9_-]+)?\n([\s\S]*?)```/;
  const m = String(text).match(fenceRe);
  if (m) return { code: m[1], wasFenced: true };
  return { code: String(text), wasFenced: false };
}

/**
 * Extract a function definition for `fnName` from raw model text.
 *
 * @param {string} rawText - Raw model output.
 * @param {string} fnName - Name of the function to extract.
 * @returns {{source: string, ok: boolean, reason: string}} Extracted source and status.
 */
function extractFunction(rawText, fnName) {
  if (!rawText || !String(rawText).trim()) {
    return { source: '', ok: false, reason: 'empty response' };
  }
  const { code } = unfence(rawText);

  // Find a `function fnName` declaration and capture its full body via brace
  // matching, which is robust to nested braces in the implementation.
  const declRe = new RegExp('function\\s+' + escapeRegExp(fnName) + '\\s*\\(');
  let idx = code.search(declRe);
  if (idx === -1) {
    // Arrow / const forms: `const fnName = (...) => { ... }` or `= ... =>`.
    const arrowRe = new RegExp('(?:const|let|var)\\s+' + escapeRegExp(fnName) + '\\s*=');
    idx = code.search(arrowRe);
    if (idx === -1) {
      return { source: '', ok: false, reason: 'no definition for ' + fnName };
    }
  }

  // From idx, walk to the matching closing brace of the function body.
  const open = code.indexOf('{', idx);
  if (open === -1) {
    // Concise arrow body `const f = x => x*2;` — take to end of statement.
    const semi = code.indexOf(';', idx);
    const end = semi === -1 ? code.length : semi + 1;
    return { source: code.slice(idx, end).trim(), ok: true, reason: 'concise-arrow' };
  }
  let depth = 0;
  let end = -1;
  for (let i = open; i < code.length; i++) {
    const ch = code[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) return { source: '', ok: false, reason: 'unbalanced braces' };
  return { source: code.slice(idx, end).trim(), ok: true, reason: 'ok' };
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Decide whether the model honoured "return ONLY the function code".
 *
 * Exactly one fenced block OR no fence is allowed; substantive prose (a sentence)
 * appearing OUTSIDE the code body is rejected. Comments inside the function body
 * are fine.
 *
 * @param {string} rawText - Raw model output.
 * @param {string} fnName - Name of the expected function.
 * @returns {{adherent: boolean, reason: string}} Adherence verdict and reason.
 */
function detectFormatAdherence(rawText, fnName) {
  if (!rawText) return { adherent: false, reason: 'empty' };
  const fenceCount = (String(rawText).match(/```/g) || []).length;
  // More than one fenced block (i.e. >2 backtick-fences) means extra content.
  if (fenceCount > 2) return { adherent: false, reason: 'multiple code blocks' };

  const { code } = unfence(rawText);
  const ext = extractFunction(rawText, fnName);
  let leftover = code;
  if (ext.ok) leftover = code.replace(ext.source, '');
  leftover = leftover.replace(/```[a-zA-Z0-9_-]*/g, '').trim();

  let outside = String(rawText);
  const fenceBlock = String(rawText).match(/```[\s\S]*?```/);
  if (fenceBlock) outside = outside.replace(fenceBlock[0], '');
  outside = outside.trim();

  // Prose signal: a run of five space-separated alphabetic words outside the
  // function/fence. Catches a preamble like "Here you go:" or an explanation.
  const proseSignal = /[A-Za-z]{2,}\s+[A-Za-z]{2,}\s+[A-Za-z]{2,}\s+[A-Za-z]{2,}\s+[A-Za-z]{2,}/;
  const combined = (outside + '\n' + leftover).trim();
  if (combined && proseSignal.test(combined)) {
    return { adherent: false, reason: 'prose outside code' };
  }
  return { adherent: true, reason: 'code only' };
}

// Isolated execution: ONE child process per test case. The child source is
// materialized to a temp file and spawned with the case payload on argv. Per-case
// isolation is the reason this is a subprocess and not an in-process eval: model
// code may throw, loop forever, or define globals, and a hang on one input must
// not mask which other cases passed — each child has its own hard timeout.

// Self-contained runner-child program. It defines the model's function via the
// Function constructor (scoped, not a leaked global eval), runs ONE test with
// structural deep-equality, and prints a JSON result. `probe_only` just checks
// that the function defines without calling it.
const RUNNER_CHILD_SOURCE = `'use strict';
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  if (a && b && typeof a === 'object') {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (const k of ka) if (!deepEqual(a[k], b[k])) return false;
    return true;
  }
  return false;
}
function emit(obj) { process.stdout.write(JSON.stringify(obj)); }
function main() {
  let payload;
  try { payload = JSON.parse(process.argv[2]); }
  catch (e) { emit({ name: 'unknown', ok: false, error: 'bad payload' }); return; }
  const { source, fnName, test } = payload;
  let fn;
  try {
    const factory = new Function(source + '\\nreturn typeof ' + fnName + " === 'function' ? " + fnName + ' : undefined;');
    fn = factory();
  } catch (e) {
    emit({ name: test.name, ok: false, define_error: String(e.message || e) }); return;
  }
  if (typeof fn !== 'function') {
    emit({ name: test.name, ok: false, define_error: fnName + ' not defined' }); return;
  }
  if (test.probe_only) { emit({ name: test.name, ok: true }); return; }
  try {
    const args = JSON.parse(JSON.stringify(test.args));
    const got = fn.apply(null, args);
    const ok = deepEqual(got, test.expect);
    emit(ok ? { name: test.name, ok: true } : { name: test.name, ok: false, got });
  } catch (e) {
    emit({ name: test.name, ok: false, error: String(e.message || e) });
  }
}
main();
`;

// Cache the materialized child path per process so a sweep of many cells does
// not rewrite the same temp file thousands of times. Keyed by content hash so a
// stale file from a prior version can never be reused.
let CACHED_CHILD_PATH = null;
function childRunnerPath() {
  if (CACHED_CHILD_PATH && fs.existsSync(CACHED_CHILD_PATH)) return CACHED_CHILD_PATH;
  const hash = crypto.createHash('sha256').update(RUNNER_CHILD_SOURCE).digest('hex').slice(0, 12);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'code-task-scorer-'));
  const file = path.join(dir, 'runner-child-' + hash + '.cjs');
  fs.writeFileSync(file, RUNNER_CHILD_SOURCE, 'utf8');
  CACHED_CHILD_PATH = file;
  return file;
}

function runOne(childPath, source, fnName, test, timeoutMs) {
  const payload = JSON.stringify({ source, fnName, test });
  const res = spawnSync('node', [childPath, payload], {
    encoding: 'utf8',
    timeout: timeoutMs,
    maxBuffer: 2 * 1024 * 1024,
  });
  if (res.error && res.error.code === 'ETIMEDOUT') {
    return { name: test.name, ok: false, error: 'timeout' };
  }
  if (res.status !== 0 || !res.stdout) {
    return {
      name: test.name,
      ok: false,
      error: 'child exit ' + res.status + ' ' + (res.stderr || '').slice(0, 120),
    };
  }
  try {
    return JSON.parse(res.stdout.trim());
  } catch (e) {
    return { name: test.name, ok: false, error: 'unparseable: ' + res.stdout.slice(0, 120) };
  }
}

/**
 * Run an extracted function against a list of test cases.
 *
 * A define-time probe runs first: if the function will not even define, every
 * case fails for the same reason, so surface it once instead of spawning a child
 * per case.
 *
 * @param {string} source - Extracted function source code.
 * @param {string} fnName - Name of the function under test.
 * @param {Object[]} tests - Test cases with args/expect/name.
 * @param {number} timeoutMs - Per-case child process timeout in milliseconds.
 * @returns {{total: number, passed: number, pass_rate: number, per_test: Object[], define_error?: string}} Suite result.
 */
function runSuite(source, fnName, tests, timeoutMs) {
  const childPath = childRunnerPath();
  const probe = runOne(
    childPath,
    source,
    fnName,
    { name: '__probe__', args: [], expect: undefined, probe_only: true },
    timeoutMs,
  );
  if (probe.define_error) {
    return {
      total: tests.length,
      passed: 0,
      pass_rate: tests.length ? 0 : 1,
      per_test: tests.map((t) => ({ name: t.name, ok: false, error: 'define: ' + probe.define_error })),
      define_error: probe.define_error,
    };
  }

  const per_test = [];
  let passed = 0;
  for (const t of tests) {
    const r = runOne(childPath, source, fnName, t, timeoutMs);
    const ok = !!r.ok;
    if (ok) passed++;
    per_test.push(r);
  }
  return {
    total: tests.length,
    passed,
    // An empty oracle is treated as vacuously correct (rate 1) so a fixture
    // authored without tests does not look like a hard failure.
    pass_rate: tests.length ? passed / tests.length : 1,
    per_test,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

// The public scorer.

function wordCount(s) {
  const m = String(s || '').trim().match(/\S+/g);
  return m ? m.length : 0;
}

/**
 * Score ONE cell's model output against a fixture.
 *
 * The oracle is the fixture's visible `tests` PLUS any `hidden_tests` (held-out,
 * anti-overfitting cases) so a model cannot pattern-match only the prompt-visible
 * examples. The returned dimension vector carries:
 *   correctness_pass_rate : passed / total over visible+hidden oracles (0..1)
 *   assertions_passed     : count of oracle cases that passed
 *   assertions_total      : count of oracle cases run
 *   format_adherent       : did the model return ONLY the function (bool)
 *   output_words          : whitespace-delimited token count of raw output
 *   output_chars          : raw output length
 *   per_test              : [{name, ok, ...}] per oracle case
 *   extracted             : was a function definition found at all (bool)
 *   extract_reason        : why extraction succeeded/failed
 *
 * @param {string} modelOutput - Raw model output for the cell.
 * @param {Object} fixture - Code-task fixture (requires string `fn_name`).
 * @param {Object} [opts] - Options (timeoutMs for per-case child timeout).
 * @returns {Object} Dimension vector describing the scored cell.
 */
function scoreCodeTask(modelOutput, fixture, opts) {
  const options = opts || {};
  const timeoutMs = typeof options.timeoutMs === 'number' ? options.timeoutMs : 3000;

  if (!fixture || typeof fixture !== 'object') {
    throw new Error('scoreCodeTask: fixture must be an object');
  }
  const fnName = fixture.fn_name;
  if (typeof fnName !== 'string' || !fnName.trim()) {
    throw new Error('scoreCodeTask: fixture must carry a string `fn_name`');
  }

  const raw = modelOutput == null ? '' : String(modelOutput);
  const visible = Array.isArray(fixture.tests) ? fixture.tests : [];
  const hidden = Array.isArray(fixture.hidden_tests) ? fixture.hidden_tests : [];
  const oracle = visible.concat(hidden);

  const ext = extractFunction(raw, fnName);
  const fmt = detectFormatAdherence(raw, fnName);

  let suite;
  if (ext.ok) {
    suite = runSuite(ext.source, fnName, oracle, timeoutMs);
  } else {
    // No extractable function: every oracle case fails for the same reason.
    suite = {
      total: oracle.length,
      passed: 0,
      pass_rate: oracle.length ? 0 : 1,
      per_test: oracle.map((t) => ({ name: t.name, ok: false, error: 'extract: ' + ext.reason })),
    };
  }

  return {
    correctness_pass_rate: suite.pass_rate,
    assertions_passed: suite.passed,
    assertions_total: suite.total,
    format_adherent: fmt.adherent,
    format_reason: fmt.reason,
    output_words: wordCount(raw),
    output_chars: raw.length,
    per_test: suite.per_test,
    extracted: ext.ok,
    extract_reason: ext.reason,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  scoreCodeTask,
  // Exported for unit reuse and so the sweep layer can share extraction.
  extractFunction,
  detectFormatAdherence,
  unfence,
  runSuite,
};
