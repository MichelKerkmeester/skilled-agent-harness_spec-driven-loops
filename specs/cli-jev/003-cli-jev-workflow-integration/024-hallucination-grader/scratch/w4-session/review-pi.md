# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (the code was written by DeepSeek V4.1 Flash through Devin; you are MiMo through Pi). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/scorer.vitest.ts`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/scratch/w4-build/build-evidence.md`, and the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

## What to look for

- Correctness against each requirement in the phase `spec.md`.
- Dormancy (parent D1): with neither Jev nor Deem available, behavior is exactly today's. A Jev arm runs only behind `--jev` after the identity line, `jev --version` printing `jev 0.6.2` and `jev auth status --provider <p>` exiting 0. A Deem arm runs only behind `--deem` after `cli-deem health` passes. Either failing prints one skip line and changes nothing.
- The zero-call first slice runs with no model call.
- The keep rule is fixed in code before any run: coverage, a margin over the baseline, an exact one-sided sign test at 0.05, a flip bound, and one verdict line `verdict <backend>: keep|kill|stop (...)`. Check the sign test arithmetic on one case by hand.
- Label gate: where the scorer needs operator labels, it prints `stop: fewer than N labeled rows` and no label file was written by a model.
- Secrets: no key, token or `.env` read, and no request that sends one. Jev gets no secret.
- Comment hygiene: no spec path, packet or phase number, REQ, task, ADR or finding id in a code comment.
- Tests: happy path plus one edge case per public surface, stubbed backends for both arms, and no test that asserts nothing or mirrors the implementation.
- Docs: each changed skill doc says what the code does, no more, and names the switches and the gate as the code spells them.

Skip style nits a formatter would settle.

## Severity

- P0: wrong behavior, data loss, a secret leak or a broken build.
- P1: a requirement not met, a missing edge case the spec names, a test gap on a changed public surface, dormancy broken, or a doc that states something the code does not do.
- P2: everything else worth fixing.

## Report (under 400 words)

One line per finding: `P0|P1|P2 file:line - what is wrong - the concrete input or state that shows it`. Then one line per requirement: `REQ-xxx met|not met|not checked - why`. End with exactly one line `VERDICT: PASS` (no P0 or P1) or `VERDICT: FAIL`.

## Appendix: the diff under review

```diff
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs
index 6dc7a01d400..698fa922ddc 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs
+++ b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs
@@ -577,9 +577,20 @@ async function main() {
   const graderKind = args.grader || 'noop';
   const samples = Math.max(1, parseInt(args.samples, 10) || 1);
   const allowSameFamily = args['allow-same-family'] === true || args['allow-same-family'] === 'true';
+  const usage = 'Usage: node run-benchmark.cjs --profile <path-or-id> --outputs-dir <path> [--output <path>] [--state-log <path>] [--label <string>] [--profiles-dir <path>] [--integration-report <path>] [--scorer pattern|5dim] [--grader noop|mock|llm] [--samples <n>] [--allow-same-family]\n';
 
   if (!profileArg || !outputsDir || !outputPath) {
-    process.stderr.write('Usage: node run-benchmark.cjs --profile <path-or-id> --outputs-dir <path> [--output <path>] [--state-log <path>] [--label <string>] [--profiles-dir <path>] [--integration-report <path>] [--scorer pattern|5dim] [--grader noop|mock|llm] [--samples <n>] [--allow-same-family]\n');
+    process.stderr.write(usage);
+    process.exit(2);
+  }
+
+  // The scorer turns any grader kind it does not know into the mock stub, so an
+  // unknown value would score with fake D4 numbers and print nothing. Refuse it
+  // here, before any profile loads.
+  const VALID_GRADERS = new Set(['noop', 'mock', 'llm']);
+  if (!VALID_GRADERS.has(graderKind)) {
+    process.stderr.write(`run-benchmark: unknown --grader '${graderKind}' (expected noop, mock or llm)\n`);
+    process.stderr.write(usage);
     process.exit(2);
   }
 
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs
index ef390034fa9..4846c2b637b 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs
+++ b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs
@@ -203,11 +203,17 @@ function applyHardGate(d1, d2) {
  *
  * @param {string} graderKind - Grader selector: 'llm', 'mock', or 'noop'
  * @returns {Function} Async grader function (virtualFixture, outputText, opts)
+ * @throws {Error} When graderKind is not 'llm', 'mock' or 'noop'
  */
 function buildGraderFn(graderKind) {
   if (graderKind === 'noop') {
     return async () => ({ score: 1.0, confidence: 1.0, parse_status: 'noop', dim_id: 'D4', rationale: 'grader disabled (noop)', evidence: [] });
   }
+  // An unknown kind used to fall through to the mock stub, which scores D4
+  // with fake numbers; fail loudly so the caller sees the typo.
+  if (graderKind !== 'llm' && graderKind !== 'mock') {
+    throw new Error(`buildGraderFn: unknown grader kind '${graderKind}' (expected noop, mock or llm)`);
+  }
   const mode = graderKind === 'llm' ? 'real' : 'mock';
   return async (virtualFixture, outputText, opts) => {
     try {
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts
index d4a669b8410..c9ee9db608c 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts
+++ b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts
@@ -262,3 +262,15 @@ describe('P2 regex DoS guard', () => {
     expect(data.error).toMatch(/pattern exceeds 512 chars/);
   });
 });
+
+describe('unknown grader kind', () => {
+  it('exits 2 before loading the profile, naming the value and printing the usage line', () => {
+    const outDir = path.join(work, 'outputs');
+    const report = path.join(outDir, 'report.json');
+    const r = runBenchmark(path.join(work, 'no-such-profile.json'), outDir, report, ['--scorer', '5dim', '--grader', 'jev']);
+    expect(r.status).toBe(2);
+    expect(r.stderr).toContain("unknown --grader 'jev'");
+    expect(r.stderr).toContain('Usage: node run-benchmark.cjs --profile');
+    expect(fs.existsSync(report)).toBe(false);
+  });
+});
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/scorer.vitest.ts b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/scorer.vitest.ts
index 960f95d1360..a313074f68a 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/scorer.vitest.ts
+++ b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/scorer.vitest.ts
@@ -157,4 +157,7 @@ describe('buildGraderFn factory', () => {
     expect(typeof res.score).toBe('number');
     expect(res.score).toBeGreaterThan(0);
   });
+  it('throws for a grader kind outside noop, mock and llm', () => {
+    expect(() => scorer.buildGraderFn('jev')).toThrow(/unknown grader kind 'jev'/);
+  });
 });
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
new file mode 100644
index 0000000000..8560ce0a76
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
@@ -0,0 +1,1323 @@
+#!/usr/bin/env node
+// ╔══════════════════════════════════════════════════════════════════════════╗
+// ║ score-d4-agreement — offline D4 hallucination-judgment agreement         ║
+// ╚══════════════════════════════════════════════════════════════════════════╝
+'use strict';
+
+/**
+ * Measure offline whether a Jev or Deem noul that flags invented flags, files
+ * or functions agrees with the operator's labels more often than the
+ * deterministic hallucination-flag check. The default run makes no model call
+ * and writes no file, and the script holds and reads no credential.
+ */
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 1. IMPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+const fs = require('node:fs');
+const os = require('node:os');
+const path = require('node:path');
+const crypto = require('node:crypto');
+const { spawn, spawnSync } = require('node:child_process');
+const { parseArgs } = require('node:util');
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 2. CONSTANTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The one judgment question a noul answers; both arms ask exactly this.
+const QUESTION = 'Does this output name a command-line flag, file or function that the task does not provide?';
+// The margin the keep rule demands between the column and the baseline.
+const MARGIN_LINE = 'margin: 0.10';
+// The keep rule, fixed so a printed verdict can be rechecked by hand.
+const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= 3*M (jev only)';
+// The power note, fixed so the five-win floor behind a keep is stated.
+const POWER_LINE = 'power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031';
+// The labeled-output floor below which no arm opens.
+const LABEL_GATE = 30;
+// The per-class labeled-output floor below which no arm opens.
+const CLASS_GATE = 5;
+// Reruns per jev call, since the hosted noul is sampled once per call.
+const JEV_RERUNS = 3;
+// The fixture set the default run scores against.
+const DEFAULT_FIXTURES_DIR = path.resolve(__dirname, '../../../assets/model-benchmark/benchmark-fixtures');
+// The deterministic check the baseline column runs.
+const HALLUCINATION_CHECK = path.join(__dirname, 'deterministic', 'hallucination-flag.cjs');
+// The usage line printed whenever the run cannot start.
+const USAGE = 'usage: score-d4-agreement.cjs --outputs <dir> [--fixtures <dir>] [--labels <file>] [--jev] [--deem] [--out <dir>] [--accept-payload]';
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 3. CENSUS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * List the markdown outputs in a directory, sorted by file name, folding a
+ * `.run<k>` rerun suffix into the id it reruns.
+ *
+ * @param {string} outputsDir - Directory holding candidate output files
+ * @returns {Array<{ file: string, id: string }>} One entry per regular markdown file
+ * @throws {Error} When the directory cannot be read
+ */
+function listOutputs(outputsDir) {
+  const runSuffix = /^(.+)\.run([1-9]\d*)\.md$/;
+  return fs
+    .readdirSync(outputsDir, { withFileTypes: true })
+    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
+    .map((entry) => {
+      const run = runSuffix.exec(entry.name);
+      return { file: entry.name, id: run ? run[1] : entry.name.slice(0, -'.md'.length) };
+    })
+    .sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0));
+}
+
+/**
+ * Read every fixture JSON in a directory into an id-keyed map, counting how
+ * many carry an allowlist.
+ *
+ * @param {string} fixturesDir - Directory holding `*.json` fixture files
+ * @returns {{ total: number, withAllowlist: number, byId: Map<string, object> }} Fixture census
+ * @throws {Error} When a fixture cannot be read or parsed, or an id repeats
+ */
+function loadFixtures(fixturesDir) {
+  const names = fs
+    .readdirSync(fixturesDir, { withFileTypes: true })
+    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
+    .map((entry) => entry.name)
+    .sort();
+  const byId = new Map();
+  let withAllowlist = 0;
+  for (const name of names) {
+    let fixture;
+    try {
+      fixture = JSON.parse(fs.readFileSync(path.join(fixturesDir, name), 'utf8'));
+    } catch (err) {
+      throw new Error(`cannot read fixture ${name}: ${err.message}`);
+    }
+    const id = fixture && fixture.id;
+    const key = typeof id === 'string' && id.length > 0 ? id : name.slice(0, -'.json'.length);
+    if (byId.has(key)) throw new Error(`duplicate fixture id: ${key}`);
+    byId.set(key, fixture);
+    if (fixture && typeof fixture === 'object' && Object.prototype.hasOwnProperty.call(fixture, 'allowlist')) withAllowlist++;
+  }
+  return { total: names.length, withAllowlist, byId };
+}
+
+/**
+ * Split census entries into those a fixture claims and those it does not,
+ * keeping the census order.
+ *
+ * @param {Array<{ file: string, id: string }>} outputs - Census entries from listOutputs
+ * @param {{ byId: Map<string, object> }} fixtures - Fixture census from loadFixtures
+ * @returns {{ matched: Array<{ file: string, id: string, fixture: object }>, unmatched: Array<{ file: string, id: string }> }} Match split
+ */
+function matchOutputs(outputs, fixtures) {
+  const matched = [];
+  const unmatched = [];
+  for (const output of outputs) {
+    const fixture = fixtures.byId.get(output.id);
+    if (fixture) matched.push({ file: output.file, id: output.id, fixture });
+    else unmatched.push({ file: output.file, id: output.id });
+  }
+  return { matched, unmatched };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 4. LABELS
+// ─────────────────────────────────────────────────────────────────────────────
+
+// Labels are the operator's gold, so a typo must stop the run rather than drop a row.
+/**
+ * Parse the operator's label file into an output-file-keyed map.
+ *
+ * @param {string} text - Label file contents, one JSON object per line
+ * @returns {Map<string, 'yes'|'no'>} Output file name -> operator label
+ * @throws {Error} When a row is not JSON, names no plain output file, carries a
+ *   value other than yes or no, or repeats an output
+ */
+function parseLabels(text) {
+  const labels = new Map();
+  const lines = text.split('\n');
+  for (let i = 0; i < lines.length; i++) {
+    const row = i + 1;
+    if (lines[i].trim() === '') continue;
+    let parsed;
+    try {
+      parsed = JSON.parse(lines[i]);
+    } catch {
+      throw new Error(`labels row ${row}: not JSON`);
+    }
+    const isPlainObject = parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
+    const output = isPlainObject ? parsed.output : undefined;
+    if (typeof output !== 'string' || output.length === 0 || output.includes('/')) {
+      throw new Error(`labels row ${row}: output must be a file name`);
+    }
+    const value = parsed.hallucinated;
+    if (value !== 'yes' && value !== 'no') {
+      throw new Error(`labels row ${row}: hallucinated must be yes or no, got ${JSON.stringify(value)}`);
+    }
+    if (labels.has(output)) throw new Error(`labels row ${row}: duplicate output ${output}`);
+    labels.set(output, value);
+  }
+  return labels;
+}
+
+/**
+ * Hash text or bytes with SHA-256.
+ *
+ * @param {string|Buffer} input - Text or bytes to hash
+ * @returns {string} Lowercase hex digest
+ */
+function sha256Hex(input) {
+  return crypto.createHash('sha256').update(input).digest('hex');
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 5. BASELINE
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Build the text a model reads for one output: the task, the visible spec, the
+ * allowlist and the output, as sections joined by one blank line.
+ *
+ * @param {object} fixture - Fixture the output answers
+ * @param {string} outputText - Text of the output file
+ * @returns {string} State text handed to the model
+ */
+function buildState(fixture, outputText) {
+  const sections = [];
+  if (typeof fixture.task === 'string') sections.push(`Task:\n${fixture.task}`);
+  if (typeof fixture.visibleSpec === 'string') sections.push(`Visible spec:\n${fixture.visibleSpec}`);
+  if (Object.prototype.hasOwnProperty.call(fixture, 'allowlist')) sections.push(`Allowlist:\n${JSON.stringify(fixture.allowlist)}`);
+  sections.push(`Output:\n${outputText}`);
+  return sections.join('\n\n');
+}
+
+// The check runs unchanged, and a failure stops the run because a default score
+// would fake the baseline the columns are compared against.
+/**
+ * Run the deterministic hallucination check on one output and map its score to
+ * a yes or no call.
+ *
+ * @param {object} fixture - Fixture the output answers
+ * @param {string} outputPath - Path of the output file to check
+ * @returns {'yes'|'no'} Yes when the check scores below 1, else no
+ * @throws {Error} When the check fails to run, exits non-zero or prints no
+ *   parseable score
+ */
+function deterministicCall(fixture, outputPath) {
+  const name = path.basename(outputPath);
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'd4-check-'));
+  try {
+    const fixtureJson = path.join(dir, 'fixture.json');
+    fs.writeFileSync(fixtureJson, JSON.stringify({ id: fixture.id, allowlist: fixture.allowlist || {} }), 'utf8');
+    const res = spawnSync(process.execPath, [HALLUCINATION_CHECK, fixtureJson, outputPath], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
+    if (res.error || res.status !== 0) {
+      const detail = (res.stderr || '').trim() || `exit ${res.status}`;
+      throw new Error(`deterministic check failed on ${name}: ${detail}`);
+    }
+    let parsed;
+    try {
+      parsed = JSON.parse((res.stdout || '').trim());
+    } catch {
+      throw new Error(`deterministic check failed on ${name}: unparseable result`);
+    }
+    if (!parsed || !Number.isFinite(parsed.score)) throw new Error(`deterministic check failed on ${name}: unparseable result`);
+    return parsed.score < 1 ? 'yes' : 'no';
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+  }
+}
+
+/**
+ * Pick the stronger of the two baseline methods: the deterministic check when
+ * it is at least as right as the majority class, else the majority class.
+ *
+ * @param {Array<{ file: string, label: 'yes'|'no', check: 'yes'|'no' }>} rows - Labeled rows with both calls
+ * @returns {{ method: 'check'|'majority', majorityClass: 'yes'|'no', checkRight: number, majorityRight: number, right: number, calls: Map<string, 'yes'|'no'> }} The chosen baseline
+ */
+function chooseBaseline(rows) {
+  let yesLabels = 0;
+  let noLabels = 0;
+  for (const row of rows) {
+    if (row.label === 'yes') yesLabels++;
+    else noLabels++;
+  }
+  const majorityClass = yesLabels > noLabels ? 'yes' : 'no';
+  let checkRight = 0;
+  let majorityRight = 0;
+  for (const row of rows) {
+    if (row.check === row.label) checkRight++;
+    if (row.label === majorityClass) majorityRight++;
+  }
+  const method = checkRight >= majorityRight ? 'check' : 'majority';
+  const right = method === 'check' ? checkRight : majorityRight;
+  const calls = new Map(rows.map((row) => [row.file, method === 'check' ? row.check : majorityClass]));
+  return { method, majorityClass, checkRight, majorityRight, right, calls };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 6. KEEP RULE
+// ─────────────────────────────────────────────────────────────────────────────
+
+// Counts stay integers and the tails are exact (a BigInt sum over 2^trials),
+// so no rounding decides a verdict.
+
+/**
+ * Exact one-sided chance of `successes` or more in `trials` fair coin flips.
+ * The tail sum is built coefficient by coefficient in BigInt, and the below
+ * 0.05 test stays exact as 20 * num < den, never a float comparison.
+ *
+ * @param {number} successes - Outcomes whose tail is summed
+ * @param {number} trials - Total flips
+ * @returns {{ num: bigint, den: bigint, p: number }} Tail numerator over 2^trials
+ */
+function binomialTail(successes, trials) {
+  let coefficient = 1n;
+  let num = 0n;
+  for (let i = 0; i <= trials; i += 1) {
+    if (i > 0) coefficient = (coefficient * BigInt(trials - i + 1)) / BigInt(i);
+    if (i >= successes) num += coefficient;
+  }
+  const den = 1n << BigInt(trials);
+  return { num, den, p: Number(num) / Number(den) };
+}
+
+/**
+ * First failed check decides, in this order: coverage, kill, margin, sign
+ * test, flips. A lopsided loss tail kills before the margin is read, and the
+ * flips check binds only the rerun-sampled backend, since a single call
+ * cannot flip.
+ *
+ * @param {{ backend: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number }} counts - Column counts
+ * @returns {{ outcome: 'keep'|'kill'|'stop', reason: 'coverage'|'margin'|'sign test'|'flips'|null, pWin: number, pLoss: number }} Verdict with both exact tails
+ */
+function decideVerdict({ backend, K, M, A, B, W, L, F }) {
+  const win = binomialTail(W, W + L);
+  const loss = binomialTail(L, W + L);
+  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', pWin: win.p, pLoss: loss.p };
+  if (20n * loss.num < loss.den) return { outcome: 'kill', reason: null, pWin: win.p, pLoss: loss.p };
+  if (!(10 * (A - B) >= M)) return { outcome: 'stop', reason: 'margin', pWin: win.p, pLoss: loss.p };
+  if (!(20n * win.num < win.den)) return { outcome: 'stop', reason: 'sign test', pWin: win.p, pLoss: loss.p };
+  if (backend === 'jev' && !(10 * F <= 3 * M)) return { outcome: 'stop', reason: 'flips', pWin: win.p, pLoss: loss.p };
+  return { outcome: 'keep', reason: null, pWin: win.p, pLoss: loss.p };
+}
+
+/**
+ * @param {number} p - Probability in [0, 1]
+ * @returns {string} Four significant digits
+ */
+function formatP(p) {
+  return p.toPrecision(4);
+}
+
+/**
+ * One column's counts and verdict. A row is measured only when its answer
+ * array holds exactly one answer per call and every answer is a finite
+ * number in [0, 1]; every other row stays unmeasured. The call is the answer
+ * class named at least twice, and the reruns that dissent from it add to the
+ * flip count, so an unstable call is never hidden.
+ *
+ * @param {'jev'|'deem'} backend - Backend name, printed on the verdict line
+ * @param {Array<{ file: string, label: 'yes'|'no' }>} rows - Labeled rows, in file order
+ * @param {Map<string, Array<number|null>>} answers - Output file name -> submitted answers
+ * @param {Map<string, 'yes'|'no'>} baselineCalls - Output file name -> baseline call
+ * @param {string} labelsSha - Label digest printed on the verdict line
+ * @param {string} suffix - Backend identity appended to the line when non-empty
+ * @returns {{ backend: string, K: number, M: number, unmeasured: number, A: number, B: number, W: number, L: number, F: number|null, pWin: number, pLoss: number, outcome: string, reason: string|null, line: string }} Column summary
+ */
+function summarizeColumn(backend, rows, answers, baselineCalls, labelsSha, suffix) {
+  const expected = backend === 'jev' ? JEV_RERUNS : 1;
+  const K = rows.length;
+  let M = 0;
+  let A = 0;
+  let B = 0;
+  let W = 0;
+  let L = 0;
+  let F = 0;
+  for (const row of rows) {
+    const values = answers.get(row.file);
+    if (!Array.isArray(values) || values.length !== expected) continue;
+    if (!values.every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) continue;
+    M += 1;
+    let call;
+    if (backend === 'jev') {
+      const yesVotes = values.filter((value) => value >= 0.5).length;
+      call = yesVotes >= 2 ? 'yes' : 'no';
+      F += expected - (yesVotes >= 2 ? yesVotes : expected - yesVotes);
+    } else {
+      call = values[0] >= 0.5 ? 'yes' : 'no';
+    }
+    const columnRight = call === row.label;
+    const baselineRight = baselineCalls.get(row.file) === row.label;
+    if (columnRight) A += 1;
+    if (baselineRight) B += 1;
+    if (columnRight && !baselineRight) W += 1;
+    if (baselineRight && !columnRight) L += 1;
+  }
+  const verdict = decideVerdict({ backend, K, M, A, B, W, L, F });
+  const outcomeText = verdict.reason === null ? verdict.outcome : `stop (${verdict.reason})`;
+  let line = `verdict ${backend}: ${outcomeText} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L} F=${backend === 'jev' ? F : 'n/a'} p_win=${formatP(verdict.pWin)} p_loss=${formatP(verdict.pLoss)} labels_sha256=${labelsSha}`;
+  if (typeof suffix === 'string' && suffix.length > 0) line += ` ${suffix}`;
+  return { backend, K, M, unmeasured: K - M, A, B, W, L, F: backend === 'jev' ? F : null, pWin: verdict.pWin, pLoss: verdict.pLoss, outcome: verdict.outcome, reason: verdict.reason, line };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 7. DEEM GATE
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The model the Deem arm requires; any other is a failed health check.
+const DEEM_MODEL = 'deem-0.8-v1';
+// The noul p50 in deem-local.md, used for the wall-time estimate.
+const DEEM_P50_MS = 60.5;
+// Process cap; cli-deem applies its own 2,000 ms HTTP timeout.
+const HEALTH_TIMEOUT_MS = 10000;
+// Repo copy of the cli-deem entry point, run under node when none is on PATH.
+const REPO_CLI_DEEM = path.resolve(__dirname, '../../../../../cli-classifier/cli-deem/scripts/cli-deem.mjs');
+
+/**
+ * First executable file of this name on PATH, or null when none is executable.
+ * Empty PATH entries are skipped. A missing path, a directory, or a file that
+ * cannot be executed is not a match.
+ *
+ * @param {string} name Executable file name.
+ * @param {{ PATH?: string }} env Environment whose PATH is searched.
+ * @returns {string | null} First executable match, or null when none is executable.
+ */
+function which(name, env) {
+  for (const dir of (env.PATH ?? '').split(path.delimiter)) {
+    if (dir.length === 0) continue;
+    const candidate = path.join(dir, name);
+    try {
+      if (fs.statSync(candidate).isFile()) {
+        fs.accessSync(candidate, fs.constants.X_OK);
+        return candidate;
+      }
+    } catch {
+      continue;
+    }
+  }
+  return null;
+}
+
+/**
+ * cli-deem on PATH when that file is executable, otherwise the repo copy under node.
+ *
+ * @param {{ PATH?: string }} env Environment whose PATH is searched.
+ * @returns {string[]} Command and leading arguments for one call.
+ */
+function deemCommand(env) {
+  const onPath = which('cli-deem', env);
+  if (onPath !== null) return [onPath];
+  return [process.execPath, REPO_CLI_DEEM];
+}
+
+/**
+ * One health check. An unreachable binary, a stub backend, or a wrong model
+ * is a failed check the caller prints as a skip.
+ *
+ * @param {string[]} cmd Command from deemCommand.
+ * @param {Record<string, string | undefined>} env Environment for the call.
+ * @returns {{ ok: true, backend: string, model: string, modelCommit: string, sourceCommit: string } | { ok: false, reason: string, found: unknown }}
+ */
+function readDeemHealth(cmd, env) {
+  const result = spawnSync(cmd[0], [...cmd.slice(1), 'health'], {
+    env,
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+    timeout: HEALTH_TIMEOUT_MS,
+  });
+  let errorText = (result.stderr ?? '').trim();
+  try {
+    errorText = JSON.parse(errorText).error;
+  } catch {
+    // Leave the trimmed stderr when it is not JSON.
+  }
+
+  if (result.error || result.status === 4) {
+    return { ok: false, reason: 'not reachable', found: errorText };
+  }
+  if (result.status === 3) {
+    let reason = 'bad health response';
+    if (typeof errorText === 'string' && errorText.includes('stub')) reason = 'stub backend';
+    else if (typeof errorText === 'string' && errorText.includes('refused model')) reason = 'model';
+    return { ok: false, reason, found: errorText };
+  }
+  if (result.status === 0) {
+    const stdoutText = (result.stdout ?? '').trim();
+    let body;
+    try {
+      body = JSON.parse(stdoutText);
+    } catch {
+      return { ok: false, reason: 'bad health response', found: stdoutText };
+    }
+    const backend = body?.backend;
+    if (typeof backend === 'string' && backend.includes('stub')) {
+      return { ok: false, reason: 'stub backend', found: backend };
+    }
+    if (backend !== 'torch' && !(typeof backend === 'string' && backend.startsWith('ensemble:'))) {
+      return { ok: false, reason: 'bad health response', found: String(backend) };
+    }
+    const model = body?.model;
+    if (model !== DEEM_MODEL) {
+      return { ok: false, reason: 'model', found: String(model) };
+    }
+    const modelCommit = body?.model_commit;
+    const sourceCommit = body?.source_commit;
+    if (
+      body?.ok !== true
+      || typeof modelCommit !== 'string'
+      || modelCommit === ''
+      || typeof sourceCommit !== 'string'
+      || sourceCommit === ''
+    ) {
+      return { ok: false, reason: 'bad health response', found: stdoutText };
+    }
+    return { ok: true, backend, model, modelCommit, sourceCommit };
+  }
+  return { ok: false, reason: 'bad health response', found: `exit ${result.status}: ${errorText}` };
+}
+
+/**
+ * Prints the health line, or a skip line when the check fails.
+ *
+ * @param {{ out: (line: string) => void, env: Record<string, string | undefined> }} ctx Line writer and environment.
+ * @returns {{ passed: boolean, cmd: string[], reason?: string }} True when the health check passed; a failed check carries the skip line it printed.
+ */
+function deemGate(ctx) {
+  const cmd = deemCommand(ctx.env);
+  const health = readDeemHealth(cmd, ctx.env);
+  if (health.ok) {
+    ctx.out(`deem: health backend=${health.backend} model=${health.model} model_commit=${health.modelCommit} source_commit=${health.sourceCommit}`);
+    return { passed: true, cmd, ...health };
+  }
+  const skipLine = `deem arm skipped: ${health.reason}`;
+  ctx.out(skipLine);
+  if (health.reason === 'model' || health.reason === 'bad health response') {
+    ctx.out(`deem: found=${JSON.stringify(health.found)}`);
+  }
+  return { passed: false, cmd, reason: skipLine };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 8. JEV GATE
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The pinned client version the gate accepts.
+const JEV_VERSION = 'jev 0.6.2';
+
+// An untracked output may hold text nobody committed, which is why it needs
+// the operator's explicit accept before it leaves the machine.
+/**
+ * The names git tracks in a directory, from `git ls-files -z`. A git failure
+ * returns an empty set, because an output whose status cannot be read must not
+ * count as committed.
+ *
+ * @param {string} dir Directory the git command runs in.
+ * @param {string[]} names File names to test.
+ * @returns {Set<string>} The subset of names git tracks.
+ */
+function trackedFiles(dir, names) {
+  const res = spawnSync('git', ['ls-files', '-z', '--', ...names], {
+    cwd: dir,
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+  });
+  if (res.error || res.status !== 0) return new Set();
+  return new Set((res.stdout ?? '').split('\0').filter((name) => name.length > 0));
+}
+
+/**
+ * Identity line, then the pinned version, a credential check and the payload
+ * rule. A miss prints a skip line and leaves the census text already written.
+ *
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number,
+ *   outputsDir: string,
+ *   labeledFiles: string[],
+ *   acceptPayload: boolean
+ * }} ctx Line writer, environment, per-call timeout, outputs directory, labeled
+ *   file names and the operator's payload accept.
+ * @returns {{ passed: boolean, path: string | null, provider: string, untracked: number, reason?: string }}
+ *   True when the gate passed; a failed gate carries the skip line it printed.
+ */
+function jevGate(ctx) {
+  const provider = ctx.env.JEV_PROVIDER || 'official';
+  const jevPath = which('jev', ctx.env);
+  ctx.out(`jev: path=${jevPath ?? 'none'} provider=${provider}`);
+  if (jevPath === null) {
+    const skipLine = 'jev arm skipped: jev not on PATH';
+    ctx.out(skipLine);
+    return { passed: false, path: jevPath, provider, untracked: 0, reason: skipLine };
+  }
+
+  const opts = {
+    env: ctx.env,
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+    timeout: ctx.timeoutMs,
+  };
+  const version = spawnSync(jevPath, ['--version'], opts);
+  const trimmed = (version.stdout ?? '').trim();
+  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
+  if (found !== JEV_VERSION) {
+    const skipLine = 'jev arm skipped: version';
+    ctx.out(skipLine);
+    ctx.out(`jev: found=${JSON.stringify(found)} path=${jevPath}`);
+    return { passed: false, path: jevPath, provider, untracked: 0, reason: skipLine };
+  }
+
+  const auth = spawnSync(jevPath, ['auth', 'status', '--provider', provider], opts);
+  if (auth.status !== 0) {
+    const skipLine = 'jev arm skipped: no credential';
+    ctx.out(skipLine);
+    return { passed: false, path: jevPath, provider, untracked: 0, reason: skipLine };
+  }
+
+  let untracked = 0;
+  if (ctx.labeledFiles.length > 0) {
+    const tracked = trackedFiles(ctx.outputsDir, ctx.labeledFiles);
+    untracked = ctx.labeledFiles.filter((name) => !tracked.has(name)).length;
+  }
+  if (untracked > 0 && ctx.acceptPayload !== true) {
+    const skipLine = 'jev arm skipped: payload not accepted';
+    ctx.out(skipLine);
+    return { passed: false, path: jevPath, provider, untracked, reason: skipLine };
+  }
+  return { passed: true, path: jevPath, provider, untracked };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 9. ARM HELPERS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Nearest-rank percentile. Empty lists have no rank.
+ *
+ * @param {number[]} values Raw values.
+ * @param {number} q Quantile in (0, 1].
+ * @returns {number | null}
+ */
+function nearestRank(values, q) {
+  if (values.length === 0) return null;
+  const sorted = [...values].sort((left, right) => left - right);
+  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
+}
+
+/**
+ * One bounded child process. Resolves exactly once with the exit code, the
+ * collected output, the wall time, and whether the timeout fired. The timer
+ * kills the child and resolves at once, without waiting for close: a
+ * grandchild can hold the pipes open past the kill. Stdin is closed after the
+ * write because the CLI reads stdin to EOF and exits 2 on an inherited
+ * terminal. A spawn error is code 127 with the message as stderr.
+ *
+ * @param {string} file Executable to spawn.
+ * @param {string[]} args Arguments after the executable.
+ * @param {string} stdinText Text written to stdin, then closed.
+ * @param {Record<string, string | undefined>} env Child environment.
+ * @param {number} timeoutMs Kill and resolve after this many milliseconds.
+ * @returns {Promise<{
+ *   code: number | null,
+ *   stdout: string,
+ *   stderr: string,
+ *   wallMs: number,
+ *   timedOut: boolean
+ * }>}
+ */
+function spawnCall(file, args, stdinText, env, timeoutMs) {
+  return new Promise((resolve) => {
+    const start = Date.now();
+    const child = spawn(file, args, { env, stdio: ['pipe', 'pipe', 'pipe'] });
+    let stdout = '';
+    let stderr = '';
+    let settled = false;
+
+    child.stdout.setEncoding('utf8');
+    child.stderr.setEncoding('utf8');
+    child.stdout.on('data', (chunk) => { stdout += chunk; });
+    child.stderr.on('data', (chunk) => { stderr += chunk; });
+    // A child that exits before reading stdin cannot fail the call through
+    // the pipe: its exit code is the outcome the caller needs.
+    child.stdin.on('error', () => {});
+    child.stdin.end(stdinText);
+
+    const timer = setTimeout(() => {
+      child.kill('SIGKILL');
+      settle(null, true);
+    }, timeoutMs);
+
+    function settle(code, timedOut) {
+      if (settled) return;
+      settled = true;
+      clearTimeout(timer);
+      resolve({ code, stdout, stderr, wallMs: Date.now() - start, timedOut });
+    }
+
+    child.on('close', (code) => settle(code === null ? -1 : code, false));
+    child.on('error', (error) => {
+      stderr = error.message;
+      settle(127, false);
+    });
+  });
+}
+
+/**
+ * One JSON-line record per model call under outDir. A missing or empty outDir
+ * keeps no records, so nothing is created. The file is created empty on the
+ * first append, and one line per call keeps a killed arm's earlier records
+ * readable.
+ *
+ * @param {string | undefined} outDir Directory that holds calls.jsonl.
+ * @returns {{ append: (record: object) => void }} Append-only call log.
+ */
+function createCallLog(outDir) {
+  let created = false;
+  return {
+    append(record) {
+      if (typeof outDir !== 'string' || outDir === '') return;
+      const filePath = path.join(outDir, 'calls.jsonl');
+      if (!created) {
+        fs.mkdirSync(outDir, { recursive: true });
+        fs.writeFileSync(filePath, '');
+        created = true;
+      }
+      fs.appendFileSync(filePath, `${JSON.stringify(record)}\n`);
+    },
+  };
+}
+
+/**
+ * Parsed report.json written by an earlier run into the same out directory.
+ *
+ * @param {string | undefined} outDir Directory that may hold report.json.
+ * @returns {object | null} The parsed report, or null when outDir is empty,
+ *   the file is missing, or the file does not parse.
+ */
+function readStoredReport(outDir) {
+  if (typeof outDir !== 'string' || outDir === '') return null;
+  try {
+    return JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
+  } catch {
+    return null;
+  }
+}
+
+/**
+ * The report one run writes to report.json. The census keeps its counts, the
+ * labeled set its row count and class split, the baseline its summary, and
+ * each arm entry, undefined or { skipped } or { stopped, partialRows } or
+ * { column, requalify }, fills one bucket: a finished column under columns, a
+ * stop under stopped, a skip under skipped, and a finished column also
+ * records the line that explains a re-run.
+ *
+ * @param {{
+ *   census: { outputs: number, matched: number, unmatched: number, fixtures: number, allowlist: number },
+ *   labeled: { K: number, yes: number, no: number, dropped: number },
+ *   baseline: { method: 'check'|'majority', majorityClass: 'yes'|'no', checkRight: number, majorityRight: number, right: number },
+ *   gateLine: string,
+ *   labelsSha: string | null,
+ *   jev?: object,
+ *   deem?: object
+ * }} parts
+ * @returns {object} Report object ready for JSON.stringify.
+ */
+function buildReport(parts) {
+  const { census, labeled, baseline, gateLine, labelsSha, jev, deem } = parts;
+  const report = {
+    question: QUESTION,
+    labelsSha256: labelsSha,
+    census,
+    labeled,
+    baseline: {
+      method: baseline.method,
+      majorityClass: baseline.majorityClass,
+      checkRight: baseline.checkRight,
+      majorityRight: baseline.majorityRight,
+      right: baseline.right,
+    },
+    gate: gateLine,
+    columns: {},
+    stopped: {},
+    skipped: {},
+    requalify: {},
+  };
+
+  for (const [backend, arm] of [['jev', jev], ['deem', deem]]) {
+    if (!arm) continue;
+    if (typeof arm.skipped === 'string') {
+      report.skipped[backend] = arm.skipped;
+      continue;
+    }
+    if (typeof arm.stopped === 'string') {
+      report.stopped[backend] = { line: arm.stopped, partialRows: arm.partialRows };
+      continue;
+    }
+    if (!arm.column) continue;
+    const { column } = arm;
+    report.columns[backend] = {
+      verdict: column.outcome,
+      reason: column.reason,
+      line: column.line,
+      K: column.K,
+      M: column.M,
+      A: column.A,
+      B: column.B,
+      W: column.W,
+      L: column.L,
+      F: column.F,
+      pWin: column.pWin,
+      pLoss: column.pLoss,
+      unmeasured: column.unmeasured,
+      latency: column.latency,
+    };
+    if (backend === 'deem') {
+      report.columns[backend].modelId = column.modelId;
+      report.columns[backend].modelCommit = column.modelCommit;
+      report.columns[backend].sourceCommit = column.sourceCommit;
+    }
+    if (backend === 'jev') {
+      report.columns[backend].jevVersion = column.jevVersion;
+      report.columns[backend].provider = column.provider;
+      report.columns[backend].model = column.model;
+    }
+    report.requalify[backend] = arm.requalify ?? null;
+  }
+
+  return report;
+}
+
+/**
+ * The Deem arm: one local noul per labeled row, one answer per call. A
+ * measured call is exit 0 with a finite noul in [0, 1]; exit 0 without one is
+ * a failed measurement. An exit-4 call rechecks the server health and retries
+ * once, and a stop line ends the arm with the row count it finished. Nothing
+ * leaves the machine, so no payload accept applies.
+ *
+ * @param {{
+ *   rows: Array<{ file: string, label: 'yes'|'no', state: string }>,
+ *   baselineCalls: Map<string, 'yes'|'no'>,
+ *   labelsSha: string
+ * }} plan Labeled rows with their state text, the baseline calls and the label
+ *   digest.
+ * @param {{ cmd: string[], model: string, modelCommit: string, sourceCommit: string }} gate
+ *   Passing gate result: the command and the health identity.
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number,
+ *   callLog: { append: (record: object) => void },
+ *   stored: object | null
+ * }} ctx Line writer, environment, per-call timeout, call log and the stored
+ *   report.
+ * @returns {{ column: object, requalify: string | null } | { stopped: string, partialRows: number }}
+ *   The finished column or the stop line with the rows finished.
+ */
+async function runDeemArm(plan, gate, ctx) {
+  ctx.out(`deem: nothing leaves the machine; planned calls: ${plan.rows.length}; estimated wall time: ${(plan.rows.length * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the noul p50 from deem-local.md`);
+
+  const answers = new Map();
+  const wallTimes = [];
+  let finished = 0;
+
+  /**
+   * One calls.jsonl record. A spawn that led to a stop or a retry carries no
+   * judgment, so its noul and status stay empty.
+   */
+  function record(row, attempt, r, noul, status) {
+    return {
+      backend: 'deem',
+      output: row.file,
+      rerun: 1,
+      attempt,
+      wallMs: r.wallMs,
+      exitCode: r.code,
+      noul,
+      status,
+      modelId: gate.model,
+      modelCommit: gate.modelCommit,
+      sourceCommit: gate.sourceCommit,
+    };
+  }
+
+  function stop(line) {
+    ctx.out(line);
+    ctx.out(`deem: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished };
+  }
+
+  for (const row of plan.rows) {
+    const callArgs = [...gate.cmd.slice(1), 'noul', '-q', QUESTION];
+    let attempt = 1;
+    let r = await spawnCall(gate.cmd[0], callArgs, row.state, ctx.env, ctx.timeoutMs);
+    wallTimes.push(r.wallMs);
+
+    if (!r.timedOut && r.code === 4) {
+      ctx.callLog.append(record(row, attempt, r, null, 'unmeasured'));
+      const health = readDeemHealth(gate.cmd, ctx.env);
+      if (!health.ok) return stop('deem arm stopped: server gone');
+      if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
+        return stop('deem arm stopped: model commit changed mid-run');
+      }
+      attempt = 2;
+      r = await spawnCall(gate.cmd[0], callArgs, row.state, ctx.env, ctx.timeoutMs);
+      wallTimes.push(r.wallMs);
+    }
+
+    let noul = null;
+    let status = 'unmeasured';
+    let stopLine = null;
+    if (r.timedOut) {
+      status = 'unmeasured_timeout';
+    } else if (r.code === 0) {
+      let parsed;
+      try {
+        parsed = JSON.parse(r.stdout);
+      } catch {
+        // A body that does not parse is a failed measurement, not a crash.
+      }
+      const value = parsed?.answers?.answer?.noul;
+      if (Number.isFinite(value) && value >= 0 && value <= 1) {
+        noul = value;
+        status = 'measured';
+      } else {
+        status = 'failed';
+      }
+    } else if (r.code === 2) {
+      stopLine = 'deem arm stopped: usage error';
+    } else if (r.code === 3) {
+      stopLine = 'deem arm stopped: backend refused';
+    } else if (r.code === 130) {
+      stopLine = 'deem arm stopped: interrupted';
+    }
+
+    ctx.callLog.append(record(row, attempt, r, noul, status));
+    if (stopLine !== null) return stop(stopLine);
+    answers.set(row.file, [noul]);
+    finished += 1;
+  }
+
+  const column = summarizeColumn(
+    'deem',
+    plan.rows,
+    answers,
+    plan.baselineCalls,
+    plan.labelsSha,
+    `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`,
+  );
+  const latency = {
+    p50: nearestRank(wallTimes, 0.5),
+    p95: nearestRank(wallTimes, 0.95),
+  };
+  ctx.out(`column deem: K=${column.K} measured=${column.M} unmeasured=${column.unmeasured} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
+  ctx.out('flips: n/a (commit pair)');
+  const storedDeem = ctx.stored?.columns?.deem;
+  let requalify = null;
+  if (
+    storedDeem
+    && (storedDeem.modelCommit !== gate.modelCommit || storedDeem.sourceCommit !== gate.sourceCommit)
+  ) {
+    requalify = 'requalify: model commit changed';
+    ctx.out(requalify);
+  }
+  ctx.out(column.line);
+
+  return {
+    column: {
+      ...column,
+      latency,
+      modelId: gate.model,
+      modelCommit: gate.modelCommit,
+      sourceCommit: gate.sourceCommit,
+    },
+    requalify,
+  };
+}
+
+/**
+ * The Jev arm: one auth test, then JEV_RERUNS hosted noul calls per labeled
+ * row, since the hosted noul is sampled once per call. A measured call is
+ * exit 0 with a finite noul in [0, 1]; exit 0 without one is a failed
+ * measurement. An exit-4 call waits and retries once, and a stop line ends
+ * the arm with the row count it finished. The payload is the benchmark
+ * outputs and fixture task text the gate accepted.
+ *
+ * @param {{
+ *   rows: Array<{ file: string, label: 'yes'|'no', state: string }>,
+ *   baselineCalls: Map<string, 'yes'|'no'>,
+ *   labelsSha: string
+ * }} plan Labeled rows with their state text, the baseline calls and the label
+ *   digest.
+ * @param {{ path: string, provider: string, untracked: number }} gate
+ *   Passing gate result: the client path, the provider and the untracked
+ *   labeled-output count.
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number,
+ *   backoffMs: number,
+ *   callLog: { append: (record: object) => void },
+ *   stored: object | null
+ * }} ctx Line writer, environment, per-call timeout, retry wait, call log and
+ *   the stored report.
+ * @returns {{ column: object, requalify: string | null } | { stopped: string, partialRows: number }}
+ *   The finished column or the stop line with the rows finished.
+ */
+async function runJevArm(plan, gate, ctx) {
+  const jevVersion = JEV_VERSION.split(' ')[1];
+  let chars = 0;
+  for (const row of plan.rows) chars += row.state.length + QUESTION.length;
+  chars *= JEV_RERUNS;
+  ctx.out(`jev: payload: ${gate.untracked === 0 ? 'committed' : 'untracked'} benchmark outputs and fixture task text; planned calls: ${JEV_RERUNS * plan.rows.length + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);
+
+  const wallTimes = [];
+  let finished = 0;
+
+  function stop(line) {
+    ctx.out(line);
+    ctx.out(`jev: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished };
+  }
+
+  const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, ctx.timeoutMs);
+  wallTimes.push(auth.wallMs);
+  let model = 'unknown';
+  if (auth.code === 0) {
+    let parsed;
+    try {
+      parsed = JSON.parse(auth.stdout);
+    } catch {
+      // A body that does not parse leaves the model unknown.
+    }
+    if (typeof parsed?.model === 'string') model = parsed.model;
+  }
+  ctx.callLog.append({
+    backend: 'jev',
+    output: null,
+    rerun: null,
+    attempt: 1,
+    wallMs: auth.wallMs,
+    exitCode: auth.code,
+    noul: null,
+    status: auth.code === 0 ? 'measured' : 'unmeasured',
+    jevVersion,
+    provider: gate.provider,
+    model,
+  });
+  if (auth.code !== 0) {
+    if (auth.code === 3) return stop('jev arm stopped: key rejected');
+    if (auth.code === 130) return stop('jev arm stopped: interrupted');
+    return stop('jev arm stopped: auth test failed');
+  }
+  ctx.out(`jev: auth test provider=${gate.provider} model=${model}`);
+
+  const answers = new Map();
+
+  /**
+   * One calls.jsonl record. A spawn that led to a stop or a retry carries no
+   * judgment, so its noul and status stay empty.
+   */
+  function record(row, rerun, attempt, r, noul, status) {
+    return {
+      backend: 'jev',
+      output: row.file,
+      rerun,
+      attempt,
+      wallMs: r.wallMs,
+      exitCode: r.code,
+      noul,
+      status,
+      jevVersion,
+      provider: gate.provider,
+      model,
+    };
+  }
+
+  for (const row of plan.rows) {
+    const values = [];
+    for (let rerun = 1; rerun <= JEV_RERUNS; rerun += 1) {
+      const callArgs = ['noul', '--provider', gate.provider, '-q', QUESTION];
+      let attempt = 1;
+      let r = await spawnCall(gate.path, callArgs, row.state, ctx.env, ctx.timeoutMs);
+      wallTimes.push(r.wallMs);
+
+      if (!r.timedOut && r.code === 4) {
+        ctx.callLog.append(record(row, rerun, attempt, r, null, 'unmeasured'));
+        await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
+        attempt = 2;
+        r = await spawnCall(gate.path, callArgs, row.state, ctx.env, ctx.timeoutMs);
+        wallTimes.push(r.wallMs);
+      }
+
+      let noul = null;
+      let status = 'unmeasured';
+      let stopLine = null;
+      if (r.timedOut) {
+        status = 'unmeasured_timeout';
+      } else if (r.code === 0) {
+        let parsed;
+        try {
+          parsed = JSON.parse(r.stdout);
+        } catch {
+          // A body that does not parse is a failed measurement, not a crash.
+        }
+        const value = parsed?.answers?.answer?.noul;
+        if (Number.isFinite(value) && value >= 0 && value <= 1) {
+          noul = value;
+          status = 'measured';
+        } else {
+          status = 'failed';
+        }
+      } else if (r.code === 2) {
+        stopLine = 'jev arm stopped: usage error';
+      } else if (r.code === 3) {
+        stopLine = 'jev arm stopped: key rejected';
+      } else if (r.code === 130) {
+        stopLine = 'jev arm stopped: interrupted';
+      }
+
+      ctx.callLog.append(record(row, rerun, attempt, r, noul, status));
+      if (stopLine !== null) return stop(stopLine);
+      values.push(noul);
+    }
+    answers.set(row.file, values);
+    finished += 1;
+  }
+
+  const column = summarizeColumn(
+    'jev',
+    plan.rows,
+    answers,
+    plan.baselineCalls,
+    plan.labelsSha,
+    `jev_version=${jevVersion} provider=${gate.provider} model=${model}`,
+  );
+  const latency = {
+    p50: nearestRank(wallTimes, 0.5),
+    p95: nearestRank(wallTimes, 0.95),
+  };
+  ctx.out(`column jev: K=${column.K} measured=${column.M} unmeasured=${column.unmeasured} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
+  const storedJev = ctx.stored?.columns?.jev;
+  let requalify = null;
+  if (storedJev && (storedJev.provider !== gate.provider || storedJev.model !== model)) {
+    requalify = 'requalify: model changed';
+    ctx.out(requalify);
+  }
+  ctx.out(column.line);
+
+  return {
+    column: {
+      ...column,
+      latency,
+      jevVersion,
+      provider: gate.provider,
+      model,
+    },
+    requalify,
+  };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 10. MAIN
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Print the zero-call report: census the outputs, match them against the
+ * fixtures, read the operator's labels, run the deterministic check on every
+ * labeled row and pick the baseline the arms are compared against. The default
+ * run spawns nothing but the deterministic check and writes no file.
+ *
+ * @param {string[]} argv - Arguments after the node and script paths
+ * @param {object} [deps] - Injected dependencies
+ * @param {(line: string) => void} [deps.out] - Line writer. Default writes the line plus '\n' to stdout.
+ * @param {(line: string) => void} [deps.err] - Line writer. Default writes the line plus '\n' to stderr.
+ * @param {Record<string, string | undefined>} [deps.env] - Model arm environment. Default process.env.
+ * @param {number} [deps.timeoutMs] - Model arm call timeout. Default 90000.
+ * @param {number} [deps.backoffMs] - Model arm retry wait. Default 2000.
+ * @returns {Promise<number>} 0 = report printed, 2 = bad invocation or unreadable input
+ */
+async function main(argv, deps = {}) {
+  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
+  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
+  const env = deps.env ?? process.env;
+  const timeoutMs = deps.timeoutMs ?? 90000;
+  const backoffMs = deps.backoffMs ?? 2000;
+
+  let parsed;
+  try {
+    parsed = parseArgs({
+      args: argv,
+      strict: true,
+      allowPositionals: false,
+      options: {
+        outputs: { type: 'string' },
+        fixtures: { type: 'string' },
+        labels: { type: 'string' },
+        out: { type: 'string' },
+        deem: { type: 'boolean' },
+        jev: { type: 'boolean' },
+        'accept-payload': { type: 'boolean' },
+      },
+    });
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    return 2;
+  }
+  const { values } = parsed;
+  if (typeof values.outputs !== 'string' || values.outputs === '') {
+    err(USAGE);
+    return 2;
+  }
+  if ((values.deem === true || values.jev === true) && (typeof values.out !== 'string' || values.out === '')) {
+    err(values.deem === true
+      ? '--deem needs --out <dir> so every call is recorded'
+      : '--jev needs --out <dir> so every call is recorded');
+    return 2;
+  }
+
+  let outputs;
+  let fixtures;
+  let matched;
+  let unmatched;
+  let labels;
+  let labelsSha;
+  let rows;
+  let baseline;
+  try {
+    outputs = listOutputs(values.outputs);
+    fixtures = loadFixtures(values.fixtures ?? DEFAULT_FIXTURES_DIR);
+    const split = matchOutputs(outputs, fixtures);
+    matched = split.matched;
+    unmatched = split.unmatched;
+    if (typeof values.labels === 'string') {
+      const bytes = fs.readFileSync(values.labels);
+      labels = parseLabels(bytes.toString('utf8'));
+      labelsSha = sha256Hex(bytes);
+    } else {
+      labels = new Map();
+      labelsSha = null;
+    }
+    rows = matched
+      .filter((entry) => labels.has(entry.file))
+      .map((entry) => {
+        const outputPath = path.join(values.outputs, entry.file);
+        return {
+          file: entry.file,
+          id: entry.id,
+          fixture: entry.fixture,
+          outputPath,
+          label: labels.get(entry.file),
+          check: deterministicCall(entry.fixture, outputPath),
+        };
+      });
+    baseline = chooseBaseline(rows);
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    return 2;
+  }
+
+  let yes = 0;
+  let no = 0;
+  for (const row of rows) {
+    if (row.label === 'yes') yes += 1;
+    else no += 1;
+  }
+
+  const K = rows.length;
+  out(`outputs: ${outputs.length}`);
+  out(`matched: ${matched.length}`);
+  out(`unmatched: ${unmatched.length}`);
+  out(`allowlist: ${fixtures.withAllowlist} of ${fixtures.total}`);
+  out(labelsSha === null ? 'labels: none' : `labels: sha256=${labelsSha} rows=${labels.size}`);
+  out(`labeled: ${K} (yes ${yes}, no ${no})`);
+  out(`labels dropped: ${labels.size - K}`);
+  out(`baseline check: right ${baseline.checkRight} of ${K}`);
+  out(`baseline majority: ${baseline.majorityClass} right ${baseline.majorityRight} of ${K}`);
+  out(`baseline method: ${baseline.method} right ${baseline.right} of ${K}`);
+  out(`question: ${QUESTION}`);
+  out(MARGIN_LINE);
+  out(KEEP_RULE_LINE);
+  out(POWER_LINE);
+  let gate;
+  let gateLine;
+  if (K < LABEL_GATE) {
+    gate = 'label';
+    gateLine = `stop: fewer than ${LABEL_GATE} labeled outputs`;
+  } else if (yes < CLASS_GATE) {
+    gate = 'label';
+    gateLine = `stop: fewer than ${CLASS_GATE} labeled yes outputs`;
+  } else if (no < CLASS_GATE) {
+    gate = 'label';
+    gateLine = `stop: fewer than ${CLASS_GATE} labeled no outputs`;
+  } else if (10 * baseline.right > 9 * K) {
+    gate = 'headroom';
+    gateLine = 'no headroom';
+  } else {
+    gate = 'open';
+    gateLine = `planned calls: jev ${3 * K + 1}, deem ${K}`;
+  }
+  out(gateLine);
+
+  const stored = values.deem === true || values.jev === true ? readStoredReport(values.out) : null;
+  const callLog = createCallLog(values.out);
+  const plan = gate === 'open' ? { rows: rows.map((row) => ({ file: row.file, label: row.label, state: buildState(row.fixture, fs.readFileSync(row.outputPath, 'utf8')) })), baselineCalls: baseline.calls, labelsSha } : null;
+
+  let jevResult;
+  if (values.jev === true) {
+    const jevCheck = jevGate({ out, env, timeoutMs, outputsDir: values.outputs, labeledFiles: rows.map((row) => row.file), acceptPayload: values['accept-payload'] === true });
+    if (!jevCheck.passed) {
+      jevResult = { skipped: jevCheck.reason };
+    } else if (gate !== 'open') {
+      const line = gate === 'headroom' ? 'jev arm skipped: no headroom' : 'jev arm skipped: label gate';
+      out(line);
+      jevResult = { skipped: line };
+    } else {
+      jevResult = await runJevArm(plan, jevCheck, { out, env, timeoutMs, backoffMs, callLog, stored });
+    }
+  }
+  let deemResult;
+  if (values.deem === true) {
+    const deemCheck = deemGate({ out, env });
+    if (!deemCheck.passed) {
+      deemResult = { skipped: deemCheck.reason };
+    } else if (gate !== 'open') {
+      const line = gate === 'headroom' ? 'deem arm skipped: no headroom' : 'deem arm skipped: label gate';
+      out(line);
+      deemResult = { skipped: line };
+    } else {
+      deemResult = await runDeemArm(plan, deemCheck, { out, env, timeoutMs, callLog, stored });
+    }
+  }
+  if (values.deem === true || values.jev === true) {
+    const report = buildReport({
+      census: { outputs: outputs.length, matched: matched.length, unmatched: unmatched.length, fixtures: fixtures.total, allowlist: fixtures.withAllowlist },
+      labeled: { K, yes, no, dropped: labels.size - K },
+      baseline,
+      gateLine,
+      labelsSha,
+      jev: jevResult,
+      deem: deemResult,
+    });
+    fs.mkdirSync(values.out, { recursive: true });
+    fs.writeFileSync(path.join(values.out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
+  }
+  return 0;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 11. EXPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+module.exports = { QUESTION, MARGIN_LINE, KEEP_RULE_LINE, POWER_LINE, LABEL_GATE, CLASS_GATE, JEV_RERUNS, DEFAULT_FIXTURES_DIR, HALLUCINATION_CHECK, USAGE, DEEM_MODEL, DEEM_P50_MS, JEV_VERSION, listOutputs, loadFixtures, matchOutputs, parseLabels, sha256Hex, buildState, deterministicCall, chooseBaseline, binomialTail, decideVerdict, formatP, summarizeColumn, which, deemCommand, readDeemHealth, deemGate, trackedFiles, jevGate, nearestRank, spawnCall, createCallLog, readStoredReport, buildReport, runDeemArm, runJevArm, main };
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 12. CLI ENTRYPOINT
+// ─────────────────────────────────────────────────────────────────────────────
+
+if (require.main === module) {
+  main(process.argv.slice(2)).then((code) => {
+    process.exitCode = code;
+  });
+}
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts
new file mode 100644
index 0000000000..509194c116
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts
@@ -0,0 +1,741 @@
+// ───────────────────────────────────────────────────────────────────
+// MODULE: score-d4-agreement
+//   Output census (listOutputs)
+//   Fixture census (loadFixtures)
+//   Output-to-fixture matching (matchOutputs)
+//   Labels parser (parseLabels, sha256Hex)
+//   Deterministic baseline (buildState, deterministicCall, chooseBaseline)
+//   Keep rule (binomialTail, decideVerdict, summarizeColumn)
+//   Deem gate (deemGate)
+//   Deem arm (runDeemArm)
+//   Jev arm (runJevArm)
+//   Jev gate (jevGate, trackedFiles)
+//   Arm helpers and report (spawnCall, buildReport)
+//   Zero-call run (main)
+// ───────────────────────────────────────────────────────────────────
+
+import path from 'node:path';
+import fs from 'node:fs';
+import os from 'node:os';
+import { createRequire } from 'node:module';
+import { fileURLToPath } from 'node:url';
+import { afterEach, describe, expect, it } from 'vitest';
+
+const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
+const require = createRequire(import.meta.url);
+const d4 = require(path.join(TEST_DIR, '../scorer/score-d4-agreement.cjs')) as Record<string, any>;
+
+const tempDirs: string[] = [];
+
+function tempDir(prefix: string): string {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
+  tempDirs.push(dir);
+  return dir;
+}
+
+afterEach(() => {
+  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
+});
+
+function writeFixtures(): string {
+  const dir = tempDir('d4-fixtures-');
+  fs.writeFileSync(
+    path.join(dir, 'fx-a.json'),
+    JSON.stringify({
+      id: 'fx-a',
+      task: 'Write add(a, b).',
+      visibleSpec: 'add(1, 2) is 3',
+      allowlist: { cli_flags: ['--dry-run'], symbols: ['add'] },
+    }),
+    'utf8',
+  );
+  fs.writeFileSync(
+    path.join(dir, 'fx-b.json'),
+    JSON.stringify({ id: 'fx-b', task: 'Write sub(a, b).', visibleSpec: 'sub(3, 1) is 2' }),
+    'utf8',
+  );
+  fs.writeFileSync(path.join(dir, 'fx-c-file.json'), JSON.stringify({ id: 'fx-c', title: 'no task' }), 'utf8');
+  return dir;
+}
+
+function writeOutputs(names: string[]): string {
+  const dir = tempDir('d4-outputs-');
+  for (const name of names) fs.writeFileSync(path.join(dir, name), `output for ${name}\n`, 'utf8');
+  return dir;
+}
+
+function stubDir(bodies: Record<string, string>): string {
+  const dir = tempDir('d4-stubs-');
+  for (const [name, body] of Object.entries(bodies)) {
+    const file = path.join(dir, name);
+    fs.writeFileSync(file, `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`, 'utf8');
+    fs.chmodSync(file, 0o755);
+  }
+  return dir;
+}
+
+async function runMain(
+  argv: string[],
+  env: NodeJS.ProcessEnv = process.env,
+): Promise<{ code: number; lines: string[]; errs: string[] }> {
+  const lines: string[] = [];
+  const errs: string[] = [];
+  const code = await d4.main(argv, {
+    out: (line: string) => lines.push(line),
+    err: (line: string) => errs.push(line),
+    env,
+    timeoutMs: 5000,
+    backoffMs: 1,
+  });
+  return { code, lines, errs };
+}
+
+function labeledSet(yesFlag: number, yesPlain: number, no: number): { outputs: string; fixtures: string; labels: string } {
+  const fixtures = writeFixtures();
+  const outputs = tempDir('d4-outputs-');
+  const rows: string[] = [];
+  for (let i = 1; i <= yesFlag + yesPlain + no; i += 1) {
+    const name = `fx-b.run${i}.md`;
+    let body = 'A plain correct answer.\n';
+    if (i <= yesFlag) body = 'Use tool --force\nHALLUCINATED\n';
+    else if (i <= yesFlag + yesPlain) body = 'The tool has a hidden mode.\nHALLUCINATED\n';
+    fs.writeFileSync(path.join(outputs, name), body, 'utf8');
+    rows.push(JSON.stringify({ output: name, hallucinated: i <= yesFlag + yesPlain ? 'yes' : 'no' }));
+  }
+  const labels = path.join(tempDir('d4-labels-'), 'labels.jsonl');
+  fs.writeFileSync(labels, `${rows.join('\n')}\n`, 'utf8');
+  return { outputs, fixtures, labels };
+}
+
+describe('score-d4-agreement census', () => {
+  it('lists markdown files sorted by name, folding a run suffix into the id', () => {
+    const dir = writeOutputs(['fx-a.md', 'fx-b.run2.md', 'fx-c.md', 'orphan.md', 'report.json']);
+    fs.mkdirSync(path.join(dir, 'dir.md'));
+    expect(d4.listOutputs(dir)).toEqual([
+      { file: 'fx-a.md', id: 'fx-a' },
+      { file: 'fx-b.run2.md', id: 'fx-b' },
+      { file: 'fx-c.md', id: 'fx-c' },
+      { file: 'orphan.md', id: 'orphan' },
+    ]);
+  });
+
+  it('keys fixtures by their id field and matches outputs against them', () => {
+    const fixtures = d4.loadFixtures(writeFixtures());
+    expect(fixtures.total).toBe(3);
+    expect(fixtures.withAllowlist).toBe(1);
+    expect(fixtures.byId.has('fx-c')).toBe(true);
+    expect(fixtures.byId.has('fx-c-file')).toBe(false);
+
+    const outputs = d4.listOutputs(writeOutputs(['fx-a.md', 'fx-b.run2.md', 'fx-c.md', 'orphan.md']));
+    const { matched, unmatched } = d4.matchOutputs(outputs, fixtures);
+    expect(matched.map((entry: { file: string }) => entry.file)).toEqual(['fx-a.md', 'fx-b.run2.md', 'fx-c.md']);
+    expect(unmatched).toEqual([{ file: 'orphan.md', id: 'orphan' }]);
+  });
+
+  it('rejects a duplicate fixture id', () => {
+    const dir = writeFixtures();
+    fs.writeFileSync(path.join(dir, 'dup.json'), JSON.stringify({ id: 'fx-a' }), 'utf8');
+    expect(() => d4.loadFixtures(dir)).toThrow('duplicate fixture id: fx-a');
+  });
+});
+
+describe('score-d4-agreement labels', () => {
+  it('parses one yes or no label per output and skips blank lines', () => {
+    const labels = d4.parseLabels('{"output":"fx-a.md","hallucinated":"yes"}\n\n{"output":"fx-b.run2.md","hallucinated":"no"}\n');
+    expect([...labels.entries()]).toEqual([['fx-a.md', 'yes'], ['fx-b.run2.md', 'no']]);
+    expect(d4.sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
+  });
+
+  it('rejects a bad label value, a non-JSON row and a duplicate output, naming the row', () => {
+    expect(() => d4.parseLabels('{"output":"x.md","hallucinated":"no"}\n{"output":"y.md","hallucinated":"maybe"}\n')).toThrow('labels row 2: hallucinated must be yes or no, got "maybe"');
+    expect(() => d4.parseLabels('not json\n')).toThrow('labels row 1: not JSON');
+    expect(() => d4.parseLabels('{"output":"x.md","hallucinated":"no"}\n{"output":"x.md","hallucinated":"yes"}\n')).toThrow('labels row 2: duplicate output x.md');
+  });
+});
+
+describe('score-d4-agreement baseline', () => {
+  it('reads an unlisted flag as yes and an allowlisted flag as no', () => {
+    const fixtures = d4.loadFixtures(writeFixtures());
+    const dir = writeOutputs([]);
+    const file = path.join(dir, 'fx-a.md');
+    fs.writeFileSync(file, 'Run: tool --dry-run\n');
+    expect(d4.deterministicCall(fixtures.byId.get('fx-a'), file)).toBe('no');
+    expect(d4.deterministicCall(fixtures.byId.get('fx-b'), file)).toBe('yes');
+  });
+
+  it('keeps the check on a tie and takes the majority class when the check does worse', () => {
+    const tie = d4.chooseBaseline([
+      { file: 'a', label: 'yes', check: 'no' },
+      { file: 'b', label: 'no', check: 'no' },
+    ]);
+    expect(tie.method).toBe('check');
+    expect(tie.right).toBe(1);
+    expect(tie.majorityClass).toBe('no');
+
+    const worse = d4.chooseBaseline([
+      { file: 'a', label: 'yes', check: 'yes' },
+      { file: 'b', label: 'no', check: 'yes' },
+      { file: 'c', label: 'no', check: 'no' },
+      { file: 'd', label: 'no', check: 'yes' },
+    ]);
+    expect(worse.method).toBe('majority');
+    expect(worse.checkRight).toBe(2);
+    expect(worse.majorityRight).toBe(3);
+    expect(worse.right).toBe(3);
+    expect([...worse.calls.values()]).toEqual(['no', 'no', 'no', 'no']);
+  });
+
+  it('builds the state from the task, the visible spec, the allowlist and the output', () => {
+    const fixtures = d4.loadFixtures(writeFixtures());
+    expect(d4.buildState(fixtures.byId.get('fx-a'), 'X')).toBe(
+      'Task:\nWrite add(a, b).\n\nVisible spec:\nadd(1, 2) is 3\n\nAllowlist:\n{"cli_flags":["--dry-run"],"symbols":["add"]}\n\nOutput:\nX',
+    );
+    expect(d4.buildState(fixtures.byId.get('fx-c'), 'X')).toBe('Output:\nX');
+  });
+});
+
+describe('score-d4-agreement keep rule', () => {
+  it('keeps a column whose win tail is below 0.05 and whose loss tail is clean', () => {
+    const verdict = d4.decideVerdict({ backend: 'deem', K: 30, M: 30, A: 30, B: 20, W: 10, L: 0, F: 0 });
+    expect(verdict.outcome).toBe('keep');
+    expect(verdict.reason).toBe(null);
+    expect(d4.formatP(verdict.pWin)).toBe('0.0009766');
+    expect(verdict.pLoss).toBe(1);
+    expect(d4.binomialTail(5, 5).num).toBe(1n);
+    expect(d4.binomialTail(5, 5).den).toBe(32n);
+  });
+
+  it('kills a column the baseline beats with a clean loss tail', () => {
+    const verdict = d4.decideVerdict({ backend: 'deem', K: 30, M: 30, A: 20, B: 28, W: 0, L: 8, F: 0 });
+    expect(verdict.outcome).toBe('kill');
+    expect(verdict.reason).toBe(null);
+  });
+
+  it('stops a column short of the margin', () => {
+    const verdict = d4.decideVerdict({ backend: 'deem', K: 30, M: 30, A: 24, B: 22, W: 5, L: 3, F: 0 });
+    expect(verdict.outcome).toBe('stop');
+    expect(verdict.reason).toBe('margin');
+  });
+
+  it('stops a column that measured too few rows', () => {
+    const verdict = d4.decideVerdict({ backend: 'deem', K: 30, M: 26, A: 26, B: 10, W: 16, L: 0, F: 0 });
+    expect(verdict.outcome).toBe('stop');
+    expect(verdict.reason).toBe('coverage');
+  });
+
+  it('stops on flips only for the rerun-sampled backend', () => {
+    const counts = { K: 30, M: 30, A: 30, B: 20, W: 10, L: 0, F: 10 };
+    expect(d4.decideVerdict({ backend: 'jev', ...counts }).reason).toBe('flips');
+    expect(d4.decideVerdict({ backend: 'deem', ...counts }).outcome).toBe('keep');
+  });
+
+  it('summarizes a column from answers, baseline calls and labels', () => {
+    const rows = [
+      { file: 'a', label: 'yes' },
+      { file: 'b', label: 'no' },
+      { file: 'c', label: 'no' },
+    ];
+    const baselineCalls = new Map([
+      ['a', 'no'],
+      ['b', 'no'],
+      ['c', 'no'],
+    ]);
+    const jev = d4.summarizeColumn(
+      'jev',
+      rows,
+      new Map([
+        ['a', [0.9, 0.8, 0.2]],
+        ['b', [0.1, 0.1, 0.1]],
+        ['c', [0.9, null, 0.9]],
+      ]),
+      baselineCalls,
+      'abc',
+      'jev_version=0.6.2 provider=official model=m',
+    );
+    expect(jev.K).toBe(3);
+    expect(jev.M).toBe(2);
+    expect(jev.A).toBe(2);
+    expect(jev.B).toBe(1);
+    expect(jev.W).toBe(1);
+    expect(jev.L).toBe(0);
+    expect(jev.F).toBe(1);
+    expect(jev.line).toBe(
+      'verdict jev: stop (coverage) K=3 M=2 A=2 B=1 W=1 L=0 F=1 p_win=0.5000 p_loss=1.000 labels_sha256=abc jev_version=0.6.2 provider=official model=m',
+    );
+
+    const deem = d4.summarizeColumn(
+      'deem',
+      rows,
+      new Map([
+        ['a', [0.7]],
+        ['b', [0.2]],
+        ['c', [1.5]],
+      ]),
+      baselineCalls,
+      'abc',
+      '',
+    );
+    expect(deem.M).toBe(2);
+    expect(deem.F).toBe(null);
+    expect(deem.line).toContain(' F=n/a ');
+    expect(deem.line.endsWith('labels_sha256=abc')).toBe(true);
+  });
+});
+
+describe('score-d4-agreement zero-call run', () => {
+  it('prints the zero-call report and runs no stub', async () => {
+    const fixtures = writeFixtures();
+    const outputs = writeOutputs(['fx-a.md', 'fx-b.run2.md', 'fx-c.md', 'orphan.md']);
+    const stubs = stubDir({ 'cli-deem': 'exit 0', jev: 'exit 0' });
+    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
+
+    const { code, lines } = await runMain(['--outputs', outputs, '--fixtures', fixtures], env);
+
+    expect(code).toBe(0);
+    expect(lines).toEqual([
+      'outputs: 4',
+      'matched: 3',
+      'unmatched: 1',
+      'allowlist: 1 of 3',
+      'labels: none',
+      'labeled: 0 (yes 0, no 0)',
+      'labels dropped: 0',
+      'baseline check: right 0 of 0',
+      'baseline majority: no right 0 of 0',
+      'baseline method: check right 0 of 0',
+      `question: ${d4.QUESTION}`,
+      d4.MARGIN_LINE,
+      d4.KEEP_RULE_LINE,
+      d4.POWER_LINE,
+      'stop: fewer than 30 labeled outputs',
+    ]);
+    expect(fs.readdirSync(stubs).filter((name) => name.endsWith('.log'))).toEqual([]);
+    expect(fs.readdirSync(outputs).sort()).toEqual(['fx-a.md', 'fx-b.run2.md', 'fx-c.md', 'orphan.md']);
+  });
+
+  it('stops at the class gate when too few yes labels exist', async () => {
+    const set = labeledSet(4, 0, 26);
+
+    const { code, lines } = await runMain(['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels]);
+
+    expect(code).toBe(0);
+    expect(lines).toContain('labeled: 30 (yes 4, no 26)');
+    expect(lines[lines.length - 1]).toBe('stop: fewer than 5 labeled yes outputs');
+  });
+
+  it('reports no headroom on a perfect check and the open gate otherwise', async () => {
+    const perfect = labeledSet(10, 0, 20);
+    const capped = await runMain(['--outputs', perfect.outputs, '--fixtures', perfect.fixtures, '--labels', perfect.labels]);
+    expect(capped.code).toBe(0);
+    expect(capped.lines[capped.lines.length - 1]).toBe('no headroom');
+
+    const plain = labeledSet(0, 10, 20);
+    const open = await runMain(['--outputs', plain.outputs, '--fixtures', plain.fixtures, '--labels', plain.labels]);
+    expect(open.code).toBe(0);
+    expect(open.lines).toContain('baseline method: check right 20 of 30');
+    expect(open.lines[open.lines.length - 1]).toBe('planned calls: jev 91, deem 30');
+  });
+
+  it('refuses a model arm without --out, a missing --outputs and a bad label value', async () => {
+    const outputs = writeOutputs(['fx-a.md']);
+
+    const arm = await runMain(['--outputs', outputs, '--deem']);
+    expect(arm.code).toBe(2);
+    expect(arm.lines).toEqual([]);
+    expect(arm.errs).toEqual(['--deem needs --out <dir> so every call is recorded']);
+
+    const bare = await runMain([]);
+    expect(bare.code).toBe(2);
+    expect(bare.errs).toEqual([d4.USAGE]);
+
+    const labels = path.join(tempDir('d4-labels-'), 'labels.jsonl');
+    fs.writeFileSync(labels, '{"output":"fx-a.md","hallucinated":"maybe"}\n', 'utf8');
+    const bad = await runMain(['--outputs', outputs, '--fixtures', writeFixtures(), '--labels', labels]);
+    expect(bad.code).toBe(2);
+    expect(bad.errs).toEqual(['labels row 1: hallucinated must be yes or no, got "maybe"']);
+  });
+});
+
+describe('score-d4-agreement deem gate', () => {
+  const HEALTHY = 'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi';
+
+  it('passes a healthy server and prints the commit pair', async () => {
+    const fixtures = writeFixtures();
+    const outputs = writeOutputs(['fx-a.md', 'orphan.md']);
+    const stubs = stubDir({ 'cli-deem': HEALTHY });
+    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
+    const argv = ['--outputs', outputs, '--fixtures', fixtures];
+    const base = await runMain(argv, env);
+
+    const { code, lines } = await runMain([...argv, '--deem', '--out', tempDir('d4-out-')], env);
+
+    expect(code).toBe(0);
+    expect(lines).toEqual([
+      ...base.lines,
+      'deem: health backend=torch model=deem-0.8-v1 model_commit=m1 source_commit=s1',
+      'deem arm skipped: label gate',
+    ]);
+    expect(fs.readFileSync(path.join(stubs, 'cli-deem.log'), 'utf8').trim().split('\n')).toEqual(['health']);
+  });
+
+  it('skips a stub backend with the rest of the output byte-identical', async () => {
+    const fixtures = writeFixtures();
+    const outputs = writeOutputs(['fx-a.md', 'orphan.md']);
+    const stubs = stubDir({
+      'cli-deem': 'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi',
+    });
+    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
+    const argv = ['--outputs', outputs, '--fixtures', fixtures];
+    const base = await runMain(argv, env);
+
+    const { code, lines } = await runMain([...argv, '--deem', '--out', tempDir('d4-out-')], env);
+
+    expect(code).toBe(0);
+    expect(lines).toContain('deem arm skipped: stub backend');
+    expect(lines.filter((line) => line !== 'deem arm skipped: stub backend')).toEqual(base.lines);
+  });
+
+  it('skips an unreachable server, a wrong model and a bad health body', async () => {
+    const fixtures = writeFixtures();
+    const outputs = writeOutputs(['fx-a.md', 'orphan.md']);
+    const argv = ['--outputs', outputs, '--fixtures', fixtures];
+    const cases: Array<[string, string[]]> = [
+      ['exit 4', ['deem arm skipped: not reachable']],
+      [
+        'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"torch","model":"other","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi',
+        ['deem arm skipped: model', 'deem: found="other"'],
+      ],
+      ["echo 'not json'", ['deem arm skipped: bad health response', 'deem: found="not json"']],
+    ];
+
+    for (const [body, expected] of cases) {
+      const stubs = stubDir({ 'cli-deem': body });
+      const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
+      const base = await runMain(argv, env);
+
+      const { code, lines } = await runMain([...argv, '--deem', '--out', tempDir('d4-out-')], env);
+
+      expect(code).toBe(0);
+      expect(lines.slice(base.lines.length)).toEqual(expected);
+    }
+  });
+});
+
+describe('score-d4-agreement jev gate', () => {
+  const PASSING_JEV = 'case "$1" in --version) echo \'jev 0.6.2\';; auth) exit 0;; esac';
+  const HEALTHY_DEEM = 'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi';
+
+  function jevEnv(stubs: string): NodeJS.ProcessEnv {
+    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
+    delete env.JEV_PROVIDER;
+    return env;
+  }
+
+  it('prints the identity line and passes when auth status exits 0', async () => {
+    const fixtures = writeFixtures();
+    const outputs = writeOutputs(['fx-a.md', 'orphan.md']);
+    const stubs = stubDir({ jev: PASSING_JEV });
+    const env = jevEnv(stubs);
+    const argv = ['--outputs', outputs, '--fixtures', fixtures];
+    const base = await runMain(argv, env);
+
+    const { code, lines } = await runMain([...argv, '--jev', '--out', tempDir('d4-out-')], env);
+
+    expect(code).toBe(0);
+    expect(lines).toEqual([
+      ...base.lines,
+      `jev: path=${path.join(stubs, 'jev')} provider=official`,
+      'jev arm skipped: label gate',
+    ]);
+    expect(fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n')).toEqual(['--version', 'auth status --provider official']);
+  });
+
+  it('skips with no credential or a wrong version, the rest byte-identical', async () => {
+    const cases: Array<{ body: string; tail: (stubs: string) => string[] }> = [
+      {
+        body: 'case "$1" in --version) echo \'jev 0.6.2\';; auth) exit 3;; esac',
+        tail: () => ['jev arm skipped: no credential'],
+      },
+      {
+        body: 'case "$1" in --version) echo \'0.2.3\';; esac',
+        tail: (stubs) => ['jev arm skipped: version', `jev: found="0.2.3" path=${path.join(stubs, 'jev')}`],
+      },
+    ];
+
+    for (const { body, tail } of cases) {
+      const fixtures = writeFixtures();
+      const outputs = writeOutputs(['fx-a.md', 'orphan.md']);
+      const stubs = stubDir({ jev: body });
+      const env = jevEnv(stubs);
+      const argv = ['--outputs', outputs, '--fixtures', fixtures];
+      const base = await runMain(argv, env);
+
+      const { code, lines } = await runMain([...argv, '--jev', '--out', tempDir('d4-out-')], env);
+
+      expect(code).toBe(0);
+      expect(lines.slice(0, base.lines.length)).toEqual(base.lines);
+      expect(lines.slice(base.lines.length)).toEqual([
+        `jev: path=${path.join(stubs, 'jev')} provider=official`,
+        ...tail(stubs),
+      ]);
+    }
+  });
+
+  it('refuses untracked labeled outputs without --accept-payload and still runs the Deem gate', async () => {
+    const set = labeledSet(0, 10, 20);
+    const stubs = stubDir({ jev: PASSING_JEV, 'cli-deem': HEALTHY_DEEM });
+    const env = jevEnv(stubs);
+    const argv = ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels];
+
+    const { code, lines } = await runMain([...argv, '--jev', '--deem', '--out', tempDir('d4-out-')], env);
+
+    expect(code).toBe(0);
+    const payloadIndex = lines.indexOf('jev arm skipped: payload not accepted');
+    const healthIndex = lines.indexOf('deem: health backend=torch model=deem-0.8-v1 model_commit=m1 source_commit=s1');
+    expect(payloadIndex).toBeGreaterThanOrEqual(0);
+    expect(healthIndex).toBeGreaterThan(payloadIndex);
+    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
+    expect(log.some((line) => line.startsWith('noul') || line.startsWith('auth test'))).toBe(false);
+  });
+});
+
+describe('score-d4-agreement report', () => {
+  it('spawnCall feeds stdin, returns the exit code and kills a slow child', async () => {
+    const ok = await d4.spawnCall('/bin/sh', ['-c', 'cat; exit 3'], 'hi', process.env, 5000);
+    expect(ok.code).toBe(3);
+    expect(ok.stdout).toBe('hi');
+    expect(ok.timedOut).toBe(false);
+
+    const slow = await d4.spawnCall('/bin/sh', ['-c', 'sleep 5'], '', process.env, 100);
+    expect(slow.timedOut).toBe(true);
+    expect(slow.code).toBe(null);
+  });
+
+  it('records a skipped arm in report.json and writes no call log', async () => {
+    const fixtures = writeFixtures();
+    const outputs = writeOutputs(['fx-a.md', 'orphan.md']);
+    const stubs = stubDir({
+      'cli-deem': 'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi',
+    });
+    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
+    const out = tempDir('d4-out-');
+
+    const { code } = await runMain(['--outputs', outputs, '--fixtures', fixtures, '--deem', '--out', out], env);
+
+    expect(code).toBe(0);
+    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
+    expect(report.skipped.deem).toBe('deem arm skipped: stub backend');
+    expect(report.columns).toEqual({});
+    expect(report.labelsSha256).toBe(null);
+    expect(report.gate).toBe('stop: fewer than 30 labeled outputs');
+    expect(report.census).toEqual({ outputs: 2, matched: 1, unmatched: 1, fixtures: 3, allowlist: 1 });
+    expect(fs.existsSync(path.join(out, 'calls.jsonl'))).toBe(false);
+  });
+});
+
+describe('score-d4-agreement deem arm', () => {
+  const DEEM = `if [ "$1" = health ]; then n=$(cat "$D/n" 2>/dev/null || echo 0); n=$((n+1)); echo $n > "$D/n"; mc=m1; if [ -f "$D/newpair" ] && [ $n -gt 1 ]; then mc=m2; fi; echo "{\\"ok\\":true,\\"backend\\":\\"torch\\",\\"model\\":\\"deem-0.8-v1\\",\\"model_commit\\":\\"$mc\\",\\"source_commit\\":\\"s1\\"}"; exit 0; fi
+p=$(cat); case "$p" in *EXIT4*) exit 4;; *EXIT3*) exit 3;; *BADJSON*) echo 'not json'; exit 0;; *HALLUCINATED*) v=0.9;; *) v=0.1;; esac
+echo "{\\"model\\":\\"deem-0.8-v1\\",\\"answers\\":{\\"answer\\":{\\"noul\\":$v}}}"`;
+
+  function readCalls(out: string): any[] {
+    return fs
+      .readFileSync(path.join(out, 'calls.jsonl'), 'utf8')
+      .trim()
+      .split('\n')
+      .map((line) => JSON.parse(line));
+  }
+
+  it('asks one noul per labeled output and prints keep', async () => {
+    const set = labeledSet(0, 10, 20);
+    const stubs = stubDir({ 'cli-deem': DEEM });
+    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
+    const out = tempDir('d4-out-');
+    const sha = d4.sha256Hex(fs.readFileSync(set.labels));
+
+    const { code, lines } = await runMain(
+      ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels, '--deem', '--out', out],
+      env,
+    );
+
+    expect(code).toBe(0);
+    expect(lines).toContain(
+      'deem: nothing leaves the machine; planned calls: 30; estimated wall time: 1.8 s at 60.5 ms per call, the noul p50 from deem-local.md',
+    );
+    expect(lines).toContain('flips: n/a (commit pair)');
+    expect(lines).toContain(
+      `verdict deem: keep K=30 M=30 A=30 B=20 W=10 L=0 F=n/a p_win=0.0009766 p_loss=1.000 labels_sha256=${sha} model=deem-0.8-v1 model_commit=m1 source_commit=s1`,
+    );
+
+    const log = fs.readFileSync(path.join(stubs, 'cli-deem.log'), 'utf8').trim().split('\n');
+    expect(log).toHaveLength(31);
+    expect(log[0]).toBe('health');
+
+    const calls = readCalls(out);
+    expect(calls).toHaveLength(30);
+    for (const call of calls) {
+      expect(call.status).toBe('measured');
+      expect(call.exitCode).toBe(0);
+      expect(typeof call.wallMs).toBe('number');
+      expect(call.modelId).toBe('deem-0.8-v1');
+      expect(call.modelCommit).toBe('m1');
+      expect(call.sourceCommit).toBe('s1');
+    }
+    expect(JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8')).columns.deem.verdict).toBe('keep');
+  });
+
+  it('stops with partial rows and no verdict on a changed commit pair or a refused backend', async () => {
+    const changed = labeledSet(0, 10, 20);
+    const changedStubs = stubDir({ 'cli-deem': DEEM });
+    fs.appendFileSync(path.join(changed.outputs, 'fx-b.run1.md'), 'EXIT4\n');
+    fs.writeFileSync(path.join(changedStubs, 'newpair'), '', 'utf8');
+    const changedOut = tempDir('d4-out-');
+
+    const changedRun = await runMain(
+      ['--outputs', changed.outputs, '--fixtures', changed.fixtures, '--labels', changed.labels, '--deem', '--out', changedOut],
+      { ...process.env, PATH: `${changedStubs}${path.delimiter}${process.env.PATH}` },
+    );
+
+    expect(changedRun.code).toBe(0);
+    expect(changedRun.lines).toContain('deem arm stopped: model commit changed mid-run');
+    expect(changedRun.lines).toContain('deem: partial rows=0');
+    expect(changedRun.lines.some((line) => line.startsWith('verdict deem:'))).toBe(false);
+    const changedReport = JSON.parse(fs.readFileSync(path.join(changedOut, 'report.json'), 'utf8'));
+    expect(changedReport.stopped.deem.partialRows).toBe(0);
+
+    const refused = labeledSet(0, 10, 20);
+    const refusedStubs = stubDir({ 'cli-deem': DEEM });
+    fs.appendFileSync(path.join(refused.outputs, 'fx-b.run1.md'), 'EXIT3\n');
+    const refusedOut = tempDir('d4-out-');
+
+    const refusedRun = await runMain(
+      ['--outputs', refused.outputs, '--fixtures', refused.fixtures, '--labels', refused.labels, '--deem', '--out', refusedOut],
+      { ...process.env, PATH: `${refusedStubs}${path.delimiter}${process.env.PATH}` },
+    );
+
+    expect(refusedRun.code).toBe(0);
+    expect(refusedRun.lines).toContain('deem arm stopped: backend refused');
+    expect(refusedRun.lines).toContain('deem: partial rows=0');
+  });
+
+  it('marks an unparseable answer failed, stops on coverage and requalifies a changed pair', async () => {
+    const set = labeledSet(0, 10, 20);
+    for (let i = 1; i <= 4; i += 1) fs.appendFileSync(path.join(set.outputs, `fx-b.run${i}.md`), 'BADJSON\n');
+    const stubs = stubDir({ 'cli-deem': DEEM });
+    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
+    const out = tempDir('d4-out-');
+    fs.writeFileSync(
+      path.join(out, 'report.json'),
+      JSON.stringify({ columns: { deem: { modelCommit: 'old', sourceCommit: 's1' } } }),
+      'utf8',
+    );
+
+    const { code, lines } = await runMain(
+      ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels, '--deem', '--out', out],
+      env,
+    );
+
+    expect(code).toBe(0);
+    const calls = readCalls(out);
+    expect(calls).toHaveLength(30);
+    expect(calls.filter((call) => call.status === 'failed')).toHaveLength(4);
+    const requalifyIndex = lines.indexOf('requalify: model commit changed');
+    expect(requalifyIndex).toBeGreaterThanOrEqual(0);
+    expect(lines[requalifyIndex + 1].startsWith('verdict deem: stop (coverage) K=30 M=26 ')).toBe(true);
+  });
+});
+
+describe('score-d4-agreement jev arm', () => {
+  const JEV = `case "$1" in --version) echo 'jev 0.6.2'; exit 0;; auth) if [ "$2" = test ]; then echo '{"ok":true,"valid":true,"model":"stub-model"}'; fi; exit 0;; esac
+p=$(cat); n=$(cat "$D/calls" 2>/dev/null || echo 0); n=$((n+1)); echo $n > "$D/calls"
+case "$p" in *FLIP*) if [ $((n % 3)) -eq 0 ]; then v=0.1; else v=0.9; fi;; *HALLUCINATED*) v=0.9;; *) v=0.1;; esac
+echo "{\\"answers\\":{\\"answer\\":{\\"noul\\":$v}}}"`;
+
+  function readCalls(out: string): any[] {
+    return fs
+      .readFileSync(path.join(out, 'calls.jsonl'), 'utf8')
+      .trim()
+      .split('\n')
+      .map((line) => JSON.parse(line));
+  }
+
+  function jevEnv(stubs: string): NodeJS.ProcessEnv {
+    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
+    delete env.JEV_PROVIDER;
+    return env;
+  }
+
+  it('runs one auth test and three reruns per output under one provider and prints keep', async () => {
+    const set = labeledSet(0, 10, 20);
+    const stubs = stubDir({ jev: JEV });
+    const env = jevEnv(stubs);
+    const out = tempDir('d4-out-');
+    const sha = d4.sha256Hex(fs.readFileSync(set.labels));
+
+    const { code, lines } = await runMain(
+      ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels, '--jev', '--accept-payload', '--out', out],
+      env,
+    );
+
+    expect(code).toBe(0);
+    expect(
+      lines.some((line) =>
+        line.startsWith(
+          'jev: payload: untracked benchmark outputs and fixture task text; planned calls: 91; estimated input tokens: ',
+        ),
+      ),
+    ).toBe(true);
+    expect(lines).toContain('jev: auth test provider=official model=stub-model');
+    expect(lines).toContain(
+      `verdict jev: keep K=30 M=30 A=30 B=20 W=10 L=0 F=0 p_win=0.0009766 p_loss=1.000 labels_sha256=${sha} jev_version=0.6.2 provider=official model=stub-model`,
+    );
+
+    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
+    expect(log).toHaveLength(93);
+    expect(log.slice(0, 3)).toEqual(['--version', 'auth status --provider official', 'auth test --provider official']);
+    expect(log.slice(3)).toEqual(Array.from({ length: 90 }, () => `noul --provider official -q ${d4.QUESTION}`));
+
+    const calls = readCalls(out);
+    expect(calls).toHaveLength(91);
+    for (const call of calls) {
+      expect(call.provider).toBe('official');
+      expect(call.model).toBe('stub-model');
+      expect(call.jevVersion).toBe('0.6.2');
+    }
+  });
+
+  it('stops on flips when the reruns disagree', async () => {
+    const set = labeledSet(0, 10, 20);
+    for (let i = 1; i <= 10; i += 1) fs.appendFileSync(path.join(set.outputs, `fx-b.run${i}.md`), 'FLIP\n');
+    const stubs = stubDir({ jev: JEV });
+    const env = jevEnv(stubs);
+    const out = tempDir('d4-out-');
+
+    const { code, lines } = await runMain(
+      ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels, '--jev', '--accept-payload', '--out', out],
+      env,
+    );
+
+    expect(code).toBe(0);
+    expect(lines.some((line) => line.startsWith('verdict jev: stop (flips) K=30 M=30 A=30 B=20 W=10 L=0 F=10 '))).toBe(true);
+  });
+
+  it('stops with key rejected when the auth test exits 3', async () => {
+    const set = labeledSet(0, 10, 20);
+    const stubs = stubDir({ jev: 'case "$1" in --version) echo \'jev 0.6.2\'; exit 0;; auth) [ "$2" = test ] && exit 3; exit 0;; esac' });
+    const env = jevEnv(stubs);
+    const out = tempDir('d4-out-');
+
+    const { code, lines } = await runMain(
+      ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels, '--jev', '--accept-payload', '--out', out],
+      env,
+    );
+
+    expect(code).toBe(0);
+    expect(lines).toContain('jev arm stopped: key rejected');
+    expect(lines).toContain('jev: partial rows=0');
+    expect(lines.some((line) => line.startsWith('verdict jev:'))).toBe(false);
+    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
+    expect(log.some((line) => line.startsWith('noul'))).toBe(false);
+  });
+});
```
