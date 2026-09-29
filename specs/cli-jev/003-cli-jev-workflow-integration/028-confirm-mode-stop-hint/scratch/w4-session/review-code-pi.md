# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (DeepSeek V4.1 Flash). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-hint.vitest.ts`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint/scratch/w4-build/design.md`, `specs/cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint/scratch/w4-build/rulings.md` (rulings override the design) and `specs/cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint/scratch/w4-session/notes.md` (the session's runs; there is no build-evidence.md). This review covers the code only; the docs are not written yet. This script reads a phase 027 report and makes no model call, so the Jev and Deem gate checks in the list below apply only as 'the script never calls either', and the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
diff --git a/.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs b/.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs
new file mode 100644
index 0000000000..b9ebd76e47
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs
@@ -0,0 +1,574 @@
+#!/usr/bin/env node
+// ───────────────────────────────────────────────────────────────────
+// MODULE: score-stop-hint
+// ───────────────────────────────────────────────────────────────────
+'use strict';
+
+/**
+ * Replay a stop-rater report offline and score whether its recorded stops
+ * would have made good confirm-mode hints. A default run reads one report,
+ * makes no model call, and writes no file unless `--out` asks for one.
+ */
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 1. IMPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+const fs = require('node:fs');
+const path = require('node:path');
+const crypto = require('node:crypto');
+const { parseArgs } = require('node:util');
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 2. CONSTANTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The file a rater report lives under in its directory.
+const REPORT_FILE = 'report.json';
+// The line a run prints when the rater never confirmed the report's gold.
+const NO_GOLD_LINE = 'stop: rater report has no confirmed gold';
+// The suffix every skipped column's line carries.
+const SKIP_SUFFIX = 'column skipped: rater report has none';
+// The line a run prints when a stored report measured a different rater identity.
+const REQUALIFY_LINE = 'requalify: rater changed';
+// The two zero-call columns every report carries.
+const DEFAULT_COLUMNS = ['legacy', 'sources'];
+// The two model columns a run adds on request.
+const MODEL_COLUMNS = ['jev', 'deem'];
+// The leading hex characters of a report digest printed on a verdict line.
+const SHA_CHARS = 12;
+// The coverage floor: measured lineages as a share of the census.
+const COVERAGE_FLOOR = 0.9;
+// The loss tail a kill needs, and the win tail a keep needs.
+const KILL_ALPHA = 0.05;
+const SIGN_ALPHA = 0.05;
+// The right-hint floor over measured hints.
+const PRECISION_FLOOR = 0.9;
+// The win floor over measured lineages needed for a keep.
+const SAVINGS_FLOOR = 0.2;
+// The rerun flips allowed per ten measured jev calls.
+const FLIP_CEILING = 0.10;
+// The keep rule fixed as one line, so a printed verdict can be rechecked by hand.
+const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, precision 10*W >= 9*(W+L), savings 5*W >= M, sign test p_win < 0.05, flips 10*F <= C (jev only)';
+// The stored hint line: <column> is substituted, and <t> stays literal for the
+// live gate to fill with the iteration it is shown at.
+const KEEP_HINT_TEMPLATE = '**Stop hint**: <column> replay says this loop found its last new cited source by iteration <t>';
+// The usage line for the one supported invocation.
+const USAGE = 'node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report <dir> [--jev] [--deem] [--out <dir>]';
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 3. RATER REPORT
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Lowercase SHA-256 hex digest of a file's bytes.
+ *
+ * @param {string} file - Path to hash
+ * @returns {string} 64 hexadecimal characters
+ */
+function sha256(file) {
+  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
+}
+
+/**
+ * Read and validate one stop-rater report. The digest is taken over the same
+ * buffer the report is parsed from, so a later verdict line names exactly the
+ * bytes its numbers came from.
+ *
+ * @param {string} dir - Directory holding the rater's report file
+ * @returns {{ report: object, path: string, sha256: string }} Parsed report, its path, and its digest
+ * @throws {Error} When the file is missing, is not JSON, or is not shaped like a rater report
+ */
+function readRaterReport(dir) {
+  const file = path.join(dir, REPORT_FILE);
+  let bytes;
+  try {
+    bytes = fs.readFileSync(file);
+  } catch {
+    throw new Error(`rater report not found: ${file}`);
+  }
+  let report;
+  try {
+    report = JSON.parse(bytes.toString('utf8'));
+  } catch {
+    throw new Error(`rater report is not JSON: ${file}`);
+  }
+  if (report === null || typeof report !== 'object' || !Array.isArray(report.lineages)) {
+    throw new Error(`rater report has no lineage list: ${file}`);
+  }
+  for (let index = 0; index < report.lineages.length; index += 1) {
+    const entry = report.lineages[index];
+    const measured = entry !== null && typeof entry === 'object'
+      && typeof entry.gold === 'number' && typeof entry.lastIteration === 'number';
+    if (!measured) {
+      throw new Error(`rater report lineage ${index} is missing gold or lastIteration`);
+    }
+  }
+  const digest = crypto.createHash('sha256').update(bytes).digest('hex');
+  return { report, path: file, sha256: digest };
+}
+
+/**
+ * The stop line for a report whose gold the rater never confirmed. A missing,
+ * null or false label all read the same way: with no confirmed gold no replayed
+ * stop can be scored against it.
+ *
+ * @param {object} report - Parsed rater report
+ * @returns {string|null} The stop line, or null when the label gate passed
+ */
+function gateStopLine(report) {
+  return report?.gate?.label?.passed === true ? null : NO_GOLD_LINE;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 4. HINT COUNTER
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Score one lineage's recorded stop as a confirm-mode hint. A stop only says
+ * where the loop could have stopped early when it lands strictly before the
+ * recorded last iteration: a stop at or past the last iteration would have
+ * saved nothing, so it raises no hint. A hint at or after gold kept the last
+ * source; one before gold cut the source off. Only a right hint saves the
+ * iterations between where it lands and the record's last.
+ *
+ * @param {{ gold: number, lastIteration: number }} lineage - Lineage with the iteration its last source arrived and the iteration its record ends
+ * @param {number|null|undefined} stop - This column's recorded stop for the lineage, null or absent when unmeasured
+ * @returns {{ hint: number|null, right: boolean, wrong: boolean, saved: number }} The hint iteration, how it scored, and the iterations a right hint saves
+ */
+function hintFor(lineage, stop) {
+  if (typeof stop !== 'number' || !(stop < lineage.lastIteration)) {
+    return { hint: null, right: false, wrong: false, saved: 0 };
+  }
+  const right = lineage.gold <= stop;
+  return { hint: stop, right, wrong: !right, saved: right ? lineage.lastIteration - stop : 0 };
+}
+
+/**
+ * One column's hint counts over the census. Measured counts only the lineages
+ * the column replayed to a stop: a null stop is a missing measurement, not
+ * evidence against the column, and it lowers the share of the census the
+ * column can be judged on. Hints, right, wrong and saved read over the
+ * measured set alone.
+ *
+ * @param {Array<{ gold: number, lastIteration: number, stops?: object }>} lineages - Census lineages in report order
+ * @param {string} column - Column name, the key its stops are recorded under
+ * @returns {{ column: string, K: number, M: number, hints: number, W: number, L: number, noHint: number, saved: number }} The column's counts
+ */
+function countColumn(lineages, column) {
+  const K = lineages.length;
+  let M = 0;
+  let W = 0;
+  let L = 0;
+  let saved = 0;
+  for (const lineage of lineages) {
+    const stop = lineage.stops?.[column];
+    if (typeof stop === 'number') M += 1;
+    const scored = hintFor(lineage, stop);
+    if (scored.right) W += 1;
+    if (scored.wrong) L += 1;
+    saved += scored.saved;
+  }
+  const hints = W + L;
+  return { column, K, M, hints, W, L, noHint: M - hints, saved };
+}
+
+/**
+ * The column line: how much of the census the column measured, how many of
+ * those stops became hints, how many read right and wrong, how many measured
+ * stops raised no hint at all, and the iterations the right hints would have
+ * saved.
+ *
+ * @param {{ column: string, M: number, hints: number, W: number, L: number, noHint: number, saved: number }} counts - Counts from countColumn
+ * @returns {string} Column line for stdout and the report column
+ */
+function columnLine(counts) {
+  return `column ${counts.column}: measured ${counts.M} hints ${counts.hints} right ${counts.W} wrong ${counts.L} no hint ${counts.noHint} saved ${counts.saved}`;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 5. COLUMN SELECTION
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * The columns one run prints, in print order: the two zero-call columns first,
+ * then a requested model column. A model column is available only when the
+ * rater recorded a finished column for it. A column the rater skipped or
+ * stopped carries no replay stops, so it prints one skip line in its place
+ * rather than letting a missing column read as a column of zero hints.
+ *
+ * @param {object} report - Parsed rater report
+ * @param {{ jev?: boolean, deem?: boolean }} [options] - Model columns the run asked for
+ * @returns {Array<{ column: string, skip: boolean, skipLine: string|null }>} Columns in print order, each with its skip verdict
+ */
+function selectColumns(report, options = {}) {
+  const selected = DEFAULT_COLUMNS.map((column) => ({ column, skip: false, skipLine: null }));
+  for (const column of MODEL_COLUMNS) {
+    if (options?.[column] !== true) continue;
+    const recorded = report?.columns?.[column] !== undefined;
+    const withheld = report?.stopped?.[column] !== undefined || report?.skipped?.[column] !== undefined;
+    const skip = !recorded || withheld;
+    selected.push({ column, skip, skipLine: skip ? `${column} ${SKIP_SUFFIX}` : null });
+  }
+  return selected;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 6. VERDICT AND REQUALIFY
+// ─────────────────────────────────────────────────────────────────────────────
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
+ * First failed check decides, in the order the printed rule states: coverage,
+ * kill, precision, savings, sign test, then flips for the rerun-sampled jev
+ * column alone. A clean loss tail kills before precision is read, and the
+ * flips check binds only the column whose calls were rerun, since a single
+ * call cannot flip.
+ *
+ * @param {{ column: string, K: number, M: number, W: number, L: number, F?: number, C?: number }} counts - Column counts and the jev flip pair
+ * @returns {{ outcome: 'keep'|'kill'|'stop', reason: 'coverage'|'precision'|'savings'|'sign test'|'flips'|null, pWin: number, pLoss: number }} Verdict with both exact tails
+ */
+function decideVerdict({ column, K, M, W, L, F, C }) {
+  const win = binomialTail(W, W + L);
+  const loss = binomialTail(L, W + L);
+  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', pWin: win.p, pLoss: loss.p };
+  if (20n * loss.num < loss.den) return { outcome: 'kill', reason: null, pWin: win.p, pLoss: loss.p };
+  if (!(10 * W >= 9 * (W + L))) return { outcome: 'stop', reason: 'precision', pWin: win.p, pLoss: loss.p };
+  if (!(5 * W >= M)) return { outcome: 'stop', reason: 'savings', pWin: win.p, pLoss: loss.p };
+  if (!(20n * win.num < win.den)) return { outcome: 'stop', reason: 'sign test', pWin: win.p, pLoss: loss.p };
+  if (column === 'jev' && !(10 * F <= C)) return { outcome: 'stop', reason: 'flips', pWin: win.p, pLoss: loss.p };
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
+ * The rater identity a model column's verdict holds for. The two zero-call
+ * columns name no rater, and a column the report does not carry reads the
+ * same way, so a caller appends the result only when it is non-empty.
+ *
+ * @param {object} report - Parsed rater report
+ * @param {string} column - Column name
+ * @returns {string} Identity fields in print order, or '' when the column carries none
+ */
+function raterSuffix(report, column) {
+  const recorded = report?.columns?.[column];
+  if (recorded === null || typeof recorded !== 'object') return '';
+  if (column === 'jev') {
+    return `jev_version=${recorded.jevVersion} provider=${recorded.provider} model=${recorded.model}`;
+  }
+  if (column === 'deem') {
+    return `model=${recorded.modelId} model_commit=${recorded.modelCommit} source_commit=${recorded.sourceCommit}`;
+  }
+  return '';
+}
+
+/**
+ * The verdict line: one outcome, the counts it was read from, the exact tail
+ * the decision turned on, the digest of the report those numbers came from
+ * and, for a model column, the rater identity the verdict holds for. A kill
+ * prints its loss tail; every other outcome prints its win tail.
+ *
+ * @param {object} summary - Column counts with the verdict and the report digest
+ * @param {string} [raterSuffix] - Rater identity, appended when non-empty
+ * @returns {string} Verdict line for stdout and the report column
+ */
+function verdictLine(summary, raterSuffix) {
+  const outcomeText = summary.reason === null ? summary.outcome : `stop (${summary.reason})`;
+  const p = summary.outcome === 'kill' ? summary.pLoss : summary.pWin;
+  let line = `verdict ${summary.column}: ${outcomeText} K=${summary.K} M=${summary.M} W=${summary.W} L=${summary.L} saved=${summary.saved} p=${formatP(p)} report=${summary.report}`;
+  if (typeof raterSuffix === 'string' && raterSuffix.length > 0) line += ` ${raterSuffix}`;
+  return line;
+}
+
+/**
+ * Parsed report.json an earlier run wrote into the same output directory. A
+ * later run reads it to requalify a model column whose rater identity changed,
+ * before printing its own verdict for that column.
+ *
+ * @param {string|undefined|null} outDir - Directory that may hold report.json
+ * @returns {object|null} The parsed report, or null when outDir is empty, the file is missing, or the file does not parse
+ */
+function readStoredReport(outDir) {
+  if (typeof outDir !== 'string' || outDir === '') return null;
+  try {
+    return JSON.parse(fs.readFileSync(path.join(outDir, REPORT_FILE), 'utf8'));
+  } catch {
+    return null;
+  }
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 7. REPORT
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * The stop hint a kept column stores for the live gate to show. The iteration
+ * stays a literal placeholder because only the gate knows the iteration it is
+ * shown at, and the stored line must stay the same across replays.
+ *
+ * @param {string} column - Column name the hint belongs to
+ * @returns {string} Hint line with the column substituted
+ */
+function hintLine(column) {
+  return KEEP_HINT_TEMPLATE.replace('<column>', column);
+}
+
+/**
+ * The report one run writes to report.json: every printed verdict with the
+ * counts it came from, a kept column's stop hint, a skipped column's line,
+ * and the digest of the rater report the run scored. The digest names the
+ * exact bytes the counts came from, so a later run can tell when a model
+ * column was measured on a different rater.
+ *
+ * @param {object} parts - Report inputs
+ * @param {string} parts.generated - Run timestamp, ISO 8601
+ * @param {{ path: string, sha256: string }} parts.rater - Rater report path and digest
+ * @param {{ passed: boolean, line: string|null }} parts.gate - Gate read from the rater report
+ * @param {object} parts.columns - Finished column records by column name
+ * @param {object} parts.skipped - Skip lines by column name
+ * @param {object} parts.requalify - Requalify lines by model column name, null when unchanged
+ * @returns {object} Report object ready for JSON.stringify
+ */
+function buildReport(parts) {
+  const { generated, rater, gate, columns, skipped, requalify } = parts;
+  return {
+    generated,
+    rater: { path: rater.path, sha256: rater.sha256 },
+    gate: { passed: gate.passed, line: gate.line },
+    columns: { ...columns },
+    skipped: { ...skipped },
+    requalify: { ...requalify },
+  };
+}
+
+/**
+ * Write the run report into `report.json` under the output directory. A run
+ * without a directory writes nothing, and the file is written whole on every
+ * run, so an earlier report never merges into a later one.
+ *
+ * @param {string|undefined|null} outDir - Output directory, absent when the run requested none
+ * @param {object} report - Report object from buildReport
+ * @returns {string|null} Written path, or null when no directory was requested
+ */
+function writeReport(outDir, report) {
+  if (typeof outDir !== 'string' || outDir === '') return null;
+  fs.mkdirSync(outDir, { recursive: true });
+  const file = path.join(outDir, REPORT_FILE);
+  fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
+  return file;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 8. MAIN
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Parse the switches, read the rater report, and close with the stop line when
+ * the rater never confirmed its gold. A passed gate opens the column output
+ * the remaining sections print and, when `--out` names a directory, stores it
+ * in report.json.
+ *
+ * @param {string[]} argv - Command-line switches, without the node and script parts
+ * @param {object} [deps] - Injected seams: out, err, env
+ * @returns {Promise<number>} The exit code: 0 on a read report or gate stop, 2 on a parse, refusal, or read failure
+ */
+async function main(argv, deps = {}) {
+  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
+  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
+  const env = deps.env ?? process.env;
+
+  let values;
+  try {
+    ({ values } = parseArgs({
+      args: argv,
+      strict: true,
+      allowPositionals: false,
+      options: {
+        'rater-report': { type: 'string' },
+        jev: { type: 'boolean' },
+        deem: { type: 'boolean' },
+        out: { type: 'string' },
+      },
+    }));
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    return 2;
+  }
+
+  const raterDir = values['rater-report'];
+  if (typeof raterDir !== 'string' || raterDir === '') {
+    err('--rater-report <dir> is required');
+    return 2;
+  }
+
+  // A run that wrote its report over the report it read would destroy the only
+  // record of what the rater measured, so the collision is refused up front.
+  const outDir = typeof values.out === 'string' && values.out !== '' ? values.out : null;
+  if (outDir !== null && path.resolve(outDir, REPORT_FILE) === path.resolve(raterDir, REPORT_FILE)) {
+    err(`--out <dir> would overwrite the rater report: ${path.resolve(outDir, REPORT_FILE)}`);
+    return 2;
+  }
+
+  let loaded;
+  try {
+    loaded = readRaterReport(raterDir);
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    return 2;
+  }
+
+  const stopLine = gateStopLine(loaded.report);
+  if (stopLine !== null) {
+    out(stopLine);
+    return 0;
+  }
+
+  // The keep rule prints before the columns, so every verdict below can be
+  // rechecked by hand against the rule it was read from.
+  out(KEEP_RULE_LINE);
+
+  // A stored report is the only record of what an earlier run measured on, so
+  // this run can requalify a model column whose rater identity changed since.
+  const stored = readStoredReport(outDir);
+  const reportColumns = {};
+  const reportSkipped = {};
+  const reportRequalify = {};
+
+  for (const selection of selectColumns(loaded.report, { jev: values.jev === true, deem: values.deem === true })) {
+    if (selection.skip) {
+      out(selection.skipLine);
+      reportSkipped[selection.column] = selection.skipLine;
+      continue;
+    }
+    const counts = countColumn(loaded.report.lineages, selection.column);
+    const jevRecord = selection.column === 'jev' ? loaded.report.columns?.jev : undefined;
+    const verdict = decideVerdict({
+      column: selection.column,
+      K: counts.K,
+      M: counts.M,
+      W: counts.W,
+      L: counts.L,
+      F: jevRecord?.F,
+      C: jevRecord?.C,
+    });
+    const identity = raterSuffix(loaded.report, selection.column);
+    out(columnLine(counts));
+    const prior = stored?.columns?.[selection.column];
+    const requalified = prior !== null && typeof prior === 'object' && raterSuffix(stored, selection.column) !== identity;
+    if (requalified) {
+      out(REQUALIFY_LINE);
+    }
+    const line = verdictLine({ ...counts, ...verdict, report: loaded.sha256.slice(0, SHA_CHARS) }, identity);
+    out(line);
+    const record = {
+      K: counts.K,
+      M: counts.M,
+      hints: counts.hints,
+      W: counts.W,
+      L: counts.L,
+      noHint: counts.noHint,
+      saved: counts.saved,
+      outcome: verdict.outcome,
+      reason: verdict.reason,
+      p: verdict.outcome === 'kill' ? verdict.pLoss : verdict.pWin,
+      verdict: line,
+    };
+    if (verdict.outcome === 'keep') record.hintLine = hintLine(selection.column);
+    if (identity.length > 0) record.rater = identity;
+    if (requalified) record.requalify = REQUALIFY_LINE;
+    reportColumns[selection.column] = record;
+    if (MODEL_COLUMNS.includes(selection.column)) {
+      reportRequalify[selection.column] = requalified ? REQUALIFY_LINE : null;
+    }
+  }
+
+  // `--out` keeps the printed output on disk; the gate stop above returned first.
+  if (outDir !== null) {
+    writeReport(outDir, buildReport({
+      generated: new Date().toISOString(),
+      rater: { path: loaded.path, sha256: loaded.sha256 },
+      gate: { passed: true, line: null },
+      columns: reportColumns,
+      skipped: reportSkipped,
+      requalify: reportRequalify,
+    }));
+  }
+
+  return 0;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 9. EXPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+module.exports = {
+  REPORT_FILE,
+  NO_GOLD_LINE,
+  SKIP_SUFFIX,
+  REQUALIFY_LINE,
+  DEFAULT_COLUMNS,
+  MODEL_COLUMNS,
+  SHA_CHARS,
+  COVERAGE_FLOOR,
+  KILL_ALPHA,
+  PRECISION_FLOOR,
+  SAVINGS_FLOOR,
+  SIGN_ALPHA,
+  FLIP_CEILING,
+  KEEP_RULE_LINE,
+  KEEP_HINT_TEMPLATE,
+  USAGE,
+  sha256,
+  readRaterReport,
+  gateStopLine,
+  hintFor,
+  countColumn,
+  columnLine,
+  selectColumns,
+  binomialTail,
+  formatP,
+  decideVerdict,
+  raterSuffix,
+  verdictLine,
+  readStoredReport,
+  hintLine,
+  buildReport,
+  writeReport,
+  main,
+};
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 10. CLI ENTRYPOINT
+// ─────────────────────────────────────────────────────────────────────────────
+
+if (require.main === module) {
+  main(process.argv.slice(2)).then((code) => {
+    process.exitCode = code;
+  });
+}
diff --git a/.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-hint.vitest.ts b/.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-hint.vitest.ts
new file mode 100644
index 0000000000..0066cdb462
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-hint.vitest.ts
@@ -0,0 +1,422 @@
+// ───────────────────────────────────────────────────────────────────
+// MODULE: score-stop-hint
+//   Report reader (sha256, readRaterReport, gateStopLine)
+//   Hint counter (hintFor, countColumn, columnLine)
+//   Column selector (selectColumns)
+//   Verdict and requalify (binomialTail, formatP, decideVerdict, raterSuffix, verdictLine, readStoredReport)
+//   Report and no-call guard (hintLine, buildReport, writeReport)
+//   Gate stop (main)
+// ───────────────────────────────────────────────────────────────────
+
+import path from 'node:path';
+import fs from 'node:fs';
+import os from 'node:os';
+import { createHash } from 'node:crypto';
+import { createRequire } from 'node:module';
+import { fileURLToPath } from 'node:url';
+import { afterEach, describe, expect, it } from 'vitest';
+
+const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
+const require = createRequire(import.meta.url);
+const hint = require(path.join(TEST_DIR, '../../scripts/score-stop-hint.cjs')) as Record<string, any>;
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
+function lineage(index: number): Record<string, unknown> {
+  return {
+    path: `lineage-${index}`,
+    gold: 1,
+    lastIteration: 3,
+    stops: { recorded: 3, legacy: 2, sources: 2 },
+  };
+}
+
+function reportFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
+  return {
+    generated: '2026-09-29T00:00:00.000Z',
+    census: { sampled: 20 },
+    lineages: Array.from({ length: 20 }, (_, index) => lineage(index)),
+    gate: { label: { passed: true }, headroom: 'headroom: 0.02' },
+    columns: {},
+    stopped: {},
+    skipped: {},
+    requalify: {},
+    ...overrides,
+  };
+}
+
+function writeReport(dir: string, report: unknown): string {
+  const file = path.join(dir, 'report.json');
+  fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
+  return file;
+}
+
+async function runMain(argv: string[]): Promise<{ code: number; lines: string[]; errs: string[] }> {
+  const lines: string[] = [];
+  const errs: string[] = [];
+  const code = await hint.main(argv, {
+    out: (line: string) => lines.push(line),
+    err: (line: string) => errs.push(line),
+  });
+  return { code, lines, errs };
+}
+
+async function runMainWithEnv(
+  argv: string[],
+  env: NodeJS.ProcessEnv,
+): Promise<{ code: number; lines: string[]; errs: string[] }> {
+  const lines: string[] = [];
+  const errs: string[] = [];
+  const code = await hint.main(argv, {
+    out: (line: string) => lines.push(line),
+    err: (line: string) => errs.push(line),
+    env,
+  });
+  return { code, lines, errs };
+}
+
+function sha12Of(file: string): string {
+  return createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 12);
+}
+
+describe('score-stop-hint reader', () => {
+  it('reader accepts a gated report', () => {
+    const dir = tempDir('stop-hint-reader-');
+    const file = writeReport(dir, reportFixture());
+    const loaded = hint.readRaterReport(dir);
+    expect(Object.keys(loaded).sort()).toEqual(['path', 'report', 'sha256']);
+    expect(loaded.report.gate.label.passed).toBe(true);
+    expect(loaded.report.lineages).toHaveLength(20);
+    expect(loaded.path).toBe(file);
+    expect(loaded.sha256).toMatch(/^[0-9a-f]{64}$/);
+    expect(loaded.sha256).toBe(hint.sha256(file));
+    expect(loaded.sha256).toBe(createHash('sha256').update(fs.readFileSync(file)).digest('hex'));
+  });
+
+  it('reader refuses a missing report', async () => {
+    const dir = tempDir('stop-hint-missing-');
+    const { code, lines, errs } = await runMain(['--rater-report', dir]);
+    expect(code).toBe(2);
+    expect(lines).toEqual([]);
+    expect(errs).toEqual([`rater report not found: ${path.join(dir, 'report.json')}`]);
+  });
+
+  it('reader refuses an unparseable report', async () => {
+    const dir = tempDir('stop-hint-bad-json-');
+    fs.writeFileSync(path.join(dir, 'report.json'), '{', 'utf8');
+    const { code, lines, errs } = await runMain(['--rater-report', dir]);
+    expect(code).toBe(2);
+    expect(lines).toEqual([]);
+    expect(errs).toEqual([`rater report is not JSON: ${path.join(dir, 'report.json')}`]);
+  });
+});
+
+describe('score-stop-hint gate stop', () => {
+  it('gate stop prints the stop line and exits 0', async () => {
+    const dir = tempDir('stop-hint-stop-');
+    writeReport(dir, reportFixture({ gate: { label: { passed: false }, headroom: 'headroom: 0.0' } }));
+    const { code, lines, errs } = await runMain(['--rater-report', dir]);
+    expect(code).toBe(0);
+    expect(errs).toEqual([]);
+    expect(lines).toEqual(['stop: rater report has no confirmed gold']);
+  });
+
+  it('an unarmed report stops too', async () => {
+    const dir = tempDir('stop-hint-unarmed-');
+    writeReport(dir, reportFixture({ gate: { label: null, headroom: 'headroom: 0.0' } }));
+    const { code, lines } = await runMain(['--rater-report', dir]);
+    expect(code).toBe(0);
+    expect(lines).toEqual(['stop: rater report has no confirmed gold']);
+  });
+});
+
+describe('score-stop-hint hint counter', () => {
+  it('hint is right inside the gold window', () => {
+    expect(hint.hintFor({ gold: 1, lastIteration: 3 }, 2)).toEqual({ hint: 2, right: true, wrong: false, saved: 1 });
+  });
+
+  it('hint is wrong before gold', () => {
+    expect(hint.hintFor({ gold: 3, lastIteration: 5 }, 1)).toEqual({ hint: 1, right: false, wrong: true, saved: 0 });
+  });
+
+  it('a stop at the recorded last iteration raises no hint', () => {
+    const line = { gold: 1, lastIteration: 2, stops: { legacy: 2 } };
+    expect(hint.hintFor(line, line.stops.legacy)).toEqual({ hint: null, right: false, wrong: false, saved: 0 });
+    expect(hint.countColumn([line], 'legacy')).toEqual({ column: 'legacy', K: 1, M: 1, hints: 0, W: 0, L: 0, noHint: 1, saved: 0 });
+  });
+
+  it('a stop past the recorded last iteration raises no hint', () => {
+    const line = { gold: 2, lastIteration: 6, stops: { legacy: 7 } };
+    expect(hint.hintFor(line, line.stops.legacy)).toEqual({ hint: null, right: false, wrong: false, saved: 0 });
+  });
+
+  it('an unmeasured stop raises no hint and trims M', () => {
+    const measured = { gold: 1, lastIteration: 3, stops: { legacy: 2 } };
+    const unmeasured = { gold: 1, lastIteration: 3, stops: { legacy: null } };
+    expect(hint.hintFor(unmeasured, unmeasured.stops.legacy)).toEqual({ hint: null, right: false, wrong: false, saved: 0 });
+    expect(hint.countColumn([measured, unmeasured], 'legacy')).toEqual({ column: 'legacy', K: 2, M: 1, hints: 1, W: 1, L: 0, noHint: 0, saved: 1 });
+  });
+});
+
+describe('score-stop-hint column lines', () => {
+  it('column lines print measured hints right wrong no hint saved', async () => {
+    const dir = tempDir('stop-hint-columns-');
+    writeReport(dir, reportFixture());
+    const { code, lines, errs } = await runMain(['--rater-report', dir]);
+    expect(code).toBe(0);
+    expect(errs).toEqual([]);
+    expect(lines.filter((line) => line.startsWith('column '))).toEqual([
+      'column legacy: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
+      'column sources: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
+    ]);
+  });
+});
+
+describe('score-stop-hint column selection', () => {
+  it('default run prints legacy and sources only', async () => {
+    const dir = tempDir('stop-hint-default-');
+    writeReport(dir, reportFixture());
+    const { code, lines, errs } = await runMain(['--rater-report', dir]);
+    expect(code).toBe(0);
+    expect(errs).toEqual([]);
+    expect(lines.filter((line) => line.startsWith('column '))).toEqual([
+      'column legacy: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
+      'column sources: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
+    ]);
+    expect(lines.some((line) => line.startsWith('column jev:') || line.startsWith('column deem:'))).toBe(false);
+    expect(lines.some((line) => line.startsWith('verdict jev:') || line.startsWith('verdict deem:'))).toBe(false);
+  });
+
+  it('--jev/--deem skip a report with no rater columns and leave the rest byte-identical', async () => {
+    const dir = tempDir('stop-hint-skips-');
+    writeReport(dir, reportFixture({ columns: {}, stopped: {}, skipped: {} }));
+    const base = await runMain(['--rater-report', dir]);
+    const armed = await runMain(['--rater-report', dir, '--jev', '--deem']);
+    expect(armed.code).toBe(0);
+    expect(armed.lines).toEqual([
+      ...base.lines,
+      'jev column skipped: rater report has none',
+      'deem column skipped: rater report has none',
+    ]);
+    const withoutSkips = armed.lines.filter((line) => line !== 'jev column skipped: rater report has none' && line !== 'deem column skipped: rater report has none');
+    expect(withoutSkips).toEqual(base.lines);
+  });
+
+  it('--jev skips a column the rater stopped', async () => {
+    const dir = tempDir('stop-hint-stopped-');
+    writeReport(dir, reportFixture({ stopped: { jev: { line: 'jev arm stopped: usage error', partialLineages: 0 } } }));
+    const { code, lines, errs } = await runMain(['--rater-report', dir, '--jev']);
+    expect(code).toBe(0);
+    expect(errs).toEqual([]);
+    expect(lines.filter((line) => line.startsWith('column '))).toEqual([
+      'column legacy: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
+      'column sources: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
+    ]);
+    expect(lines[lines.length - 1]).toBe('jev column skipped: rater report has none');
+  });
+
+  it('--deem skips a column the rater skipped', async () => {
+    const dir = tempDir('stop-hint-skipped-');
+    writeReport(dir, reportFixture({ skipped: { deem: 'deem arm skipped: no backend' } }));
+    const { code, lines, errs } = await runMain(['--rater-report', dir, '--deem']);
+    expect(code).toBe(0);
+    expect(errs).toEqual([]);
+    expect(lines.filter((line) => line.startsWith('column '))).toEqual([
+      'column legacy: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
+      'column sources: measured 20 hints 20 right 20 wrong 0 no hint 0 saved 20',
+    ]);
+    expect(lines[lines.length - 1]).toBe('deem column skipped: rater report has none');
+  });
+});
+
+describe('score-stop-hint verdicts', () => {
+  it('verdict keep', async () => {
+    const dir = tempDir('stop-hint-keep-');
+    const right = Array.from({ length: 18 }, (_, index) => ({ path: `right-${index}`, gold: 1, lastIteration: 3, stops: { legacy: 2 } }));
+    const wrong = [{ path: 'wrong-0', gold: 3, lastIteration: 5, stops: { legacy: 1 } }];
+    const flat = [{ path: 'flat-0', gold: 1, lastIteration: 3, stops: { legacy: 3 } }];
+    const file = writeReport(dir, reportFixture({ lineages: [...right, ...wrong, ...flat] }));
+    const { code, lines, errs } = await runMain(['--rater-report', dir]);
+    expect(code).toBe(0);
+    expect(errs).toEqual([]);
+    const verdict = lines.find((line) => line.startsWith('verdict legacy: ')) as string;
+    expect(verdict).toBe(`verdict legacy: keep K=20 M=20 W=18 L=1 saved=18 p=0.00003815 report=${sha12Of(file)}`);
+  });
+
+  it('verdict kill', async () => {
+    const dir = tempDir('stop-hint-kill-');
+    const wrong = Array.from({ length: 5 }, (_, index) => ({ path: `wrong-${index}`, gold: 3, lastIteration: 5, stops: { legacy: 1 } }));
+    const flat = Array.from({ length: 15 }, (_, index) => ({ path: `flat-${index}`, gold: 1, lastIteration: 3, stops: { legacy: 3 } }));
+    writeReport(dir, reportFixture({ lineages: [...wrong, ...flat] }));
+    const { code, lines } = await runMain(['--rater-report', dir]);
+    expect(code).toBe(0);
+    const verdict = lines.find((line) => line.startsWith('verdict legacy: ')) as string;
+    expect(verdict.startsWith('verdict legacy: kill')).toBe(true);
+    expect(verdict).toContain('p=0.03125');
+  });
+
+  it('verdict stop (precision)', async () => {
+    const dir = tempDir('stop-hint-precision-');
+    const right = Array.from({ length: 17 }, (_, index) => ({ path: `right-${index}`, gold: 1, lastIteration: 3, stops: { legacy: 2 } }));
+    const wrong = Array.from({ length: 3 }, (_, index) => ({ path: `wrong-${index}`, gold: 3, lastIteration: 5, stops: { legacy: 1 } }));
+    writeReport(dir, reportFixture({ lineages: [...right, ...wrong] }));
+    const { code, lines } = await runMain(['--rater-report', dir]);
+    expect(code).toBe(0);
+    const verdict = lines.find((line) => line.startsWith('verdict legacy: ')) as string;
+    expect(verdict.startsWith('verdict legacy: stop (precision)')).toBe(true);
+    expect(verdict).toContain('W=17 L=3');
+  });
+
+  it('verdict stop (coverage)', async () => {
+    const dir = tempDir('stop-hint-coverage-');
+    const measured = Array.from({ length: 17 }, (_, index) => ({ path: `jev-${index}`, gold: 1, lastIteration: 3, stops: { jev: 2 } }));
+    const unmeasured = Array.from({ length: 3 }, (_, index) => ({ path: `jev-null-${index}`, gold: 1, lastIteration: 3, stops: { jev: null } }));
+    writeReport(dir, reportFixture({
+      lineages: [...measured, ...unmeasured],
+      columns: { jev: { jevVersion: 'jev-1.0', provider: 'official', model: 'stub-model', F: 0, C: 0 } },
+    }));
+    const { code, lines } = await runMain(['--rater-report', dir, '--jev']);
+    expect(code).toBe(0);
+    const verdict = lines.find((line) => line.startsWith('verdict jev: ')) as string;
+    expect(verdict.startsWith('verdict jev: stop (coverage)')).toBe(true);
+    expect(verdict).toContain('K=20 M=17');
+  });
+
+  it('verdict stop (savings)', async () => {
+    const dir = tempDir('stop-hint-savings-');
+    const right = [{ path: 'right-0', gold: 1, lastIteration: 3, stops: { legacy: 2 } }];
+    const flat = Array.from({ length: 19 }, (_, index) => ({ path: `flat-${index}`, gold: 1, lastIteration: 3, stops: { legacy: 3 } }));
+    writeReport(dir, reportFixture({ lineages: [...right, ...flat] }));
+    const { code, lines } = await runMain(['--rater-report', dir]);
+    expect(code).toBe(0);
+    const verdict = lines.find((line) => line.startsWith('verdict legacy: ')) as string;
+    expect(verdict.startsWith('verdict legacy: stop (savings)')).toBe(true);
+  });
+
+  it('verdict stop (sign test)', async () => {
+    const dir = tempDir('stop-hint-sign-');
+    const right = Array.from({ length: 4 }, (_, index) => ({ path: `right-${index}`, gold: 1, lastIteration: 3, stops: { legacy: 2 } }));
+    const flat = Array.from({ length: 16 }, (_, index) => ({ path: `flat-${index}`, gold: 1, lastIteration: 3, stops: { legacy: 3 } }));
+    writeReport(dir, reportFixture({ lineages: [...right, ...flat] }));
+    const { code, lines } = await runMain(['--rater-report', dir]);
+    expect(code).toBe(0);
+    const verdict = lines.find((line) => line.startsWith('verdict legacy: ')) as string;
+    expect(verdict.startsWith('verdict legacy: stop (sign test)')).toBe(true);
+  });
+
+  it('verdict stop (flips) on jev', async () => {
+    const dir = tempDir('stop-hint-flips-');
+    const right = Array.from({ length: 5 }, (_, index) => ({ path: `jev-${index}`, gold: 1, lastIteration: 3, stops: { jev: 2 } }));
+    const flat = Array.from({ length: 15 }, (_, index) => ({ path: `jev-flat-${index}`, gold: 1, lastIteration: 3, stops: { jev: 3 } }));
+    writeReport(dir, reportFixture({
+      lineages: [...right, ...flat],
+      columns: { jev: { jevVersion: 'jev-1.0', provider: 'official', model: 'stub-model', F: 2, C: 10 } },
+    }));
+    const { code, lines } = await runMain(['--rater-report', dir, '--jev']);
+    expect(code).toBe(0);
+    const verdict = lines.find((line) => line.startsWith('verdict jev: ')) as string;
+    expect(verdict.startsWith('verdict jev: stop (flips)')).toBe(true);
+  });
+
+  it('jev keep when the flip rate holds', async () => {
+    const dir = tempDir('stop-hint-jev-keep-');
+    const right = Array.from({ length: 5 }, (_, index) => ({ path: `jev-${index}`, gold: 1, lastIteration: 3, stops: { jev: 2 } }));
+    const flat = Array.from({ length: 15 }, (_, index) => ({ path: `jev-flat-${index}`, gold: 1, lastIteration: 3, stops: { jev: 3 } }));
+    writeReport(dir, reportFixture({
+      lineages: [...right, ...flat],
+      columns: { jev: { jevVersion: 'jev-1.0', provider: 'official', model: 'stub-model', F: 1, C: 10 } },
+    }));
+    const { code, lines } = await runMain(['--rater-report', dir, '--jev']);
+    expect(code).toBe(0);
+    const verdict = lines.find((line) => line.startsWith('verdict jev: ')) as string;
+    expect(verdict.startsWith('verdict jev: keep')).toBe(true);
+    expect(verdict).toContain('jev_version=jev-1.0 provider=official model=stub-model');
+  });
+});
+
+describe('score-stop-hint requalify', () => {
+  it('requalify prints before the verdict', async () => {
+    const dir = tempDir('stop-hint-requalify-');
+    const outDir = tempDir('stop-hint-requalify-out-');
+    writeReport(dir, reportFixture({ columns: { deem: { modelId: 'deem-1.0-v2', modelCommit: 'newc', sourceCommit: 'news' } } }));
+    fs.writeFileSync(
+      path.join(outDir, 'report.json'),
+      JSON.stringify({ columns: { deem: { modelId: 'deem-0.8-v1', modelCommit: 'oldc', sourceCommit: 'olds' } } }),
+      'utf8',
+    );
+    const { code, lines, errs } = await runMain(['--rater-report', dir, '--deem', '--out', outDir]);
+    expect(code).toBe(0);
+    expect(errs).toEqual([]);
+    const requalifyIndex = lines.indexOf('requalify: rater changed');
+    expect(requalifyIndex).toBeGreaterThanOrEqual(0);
+    expect(lines[requalifyIndex + 1].startsWith('verdict deem: ')).toBe(true);
+  });
+});
+
+describe('score-stop-hint report and out', () => {
+  it('a kept column writes the proposed hint line', async () => {
+    const dir = tempDir('stop-hint-hint-line-');
+    const outDir = tempDir('stop-hint-hint-line-out-');
+    writeReport(dir, reportFixture());
+    const { code, errs } = await runMain(['--rater-report', dir, '--out', outDir]);
+    expect(code).toBe(0);
+    expect(errs).toEqual([]);
+    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
+    expect(report.columns.legacy.hintLine).toBe(
+      '**Stop hint**: legacy replay says this loop found its last new cited source by iteration <t>',
+    );
+  });
+
+  it('report.json holds every verdict line', async () => {
+    const dir = tempDir('stop-hint-report-');
+    const outDir = tempDir('stop-hint-report-out-');
+    writeReport(dir, reportFixture());
+    const { code, lines, errs } = await runMain(['--rater-report', dir, '--out', outDir]);
+    expect(code).toBe(0);
+    expect(errs).toEqual([]);
+    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
+    const verdicts = lines.filter((line) => line.startsWith('verdict '));
+    expect(verdicts).toHaveLength(2);
+    for (const line of verdicts) {
+      const name = /^verdict ([^:]+):/.exec(line)?.[1] as string;
+      expect(report.columns[name].verdict).toBe(line);
+    }
+  });
+});
+
+describe('score-stop-hint no-call guard', () => {
+  it('stub jev and cli-deem log nothing in any mode', async () => {
+    const stubDir = tempDir('stop-hint-stubs-');
+    const stubLog = path.join(stubDir, 'backends.log');
+    for (const name of ['jev', 'cli-deem']) {
+      fs.writeFileSync(
+        path.join(stubDir, name),
+        `#!/bin/sh\necho "$0 $*" >> '${stubLog}'\n`,
+        { mode: 0o755 },
+      );
+    }
+    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubDir}${path.delimiter}${process.env.PATH ?? ''}` };
+    const dir = tempDir('stop-hint-no-call-');
+    writeReport(dir, reportFixture());
+    const base = await runMainWithEnv(['--rater-report', dir], env);
+    const armed = await runMainWithEnv(['--rater-report', dir, '--jev', '--deem'], env);
+    expect(base.code).toBe(0);
+    expect(armed.code).toBe(0);
+    expect(fs.existsSync(stubLog)).toBe(false);
+  });
+
+  it('the script holds no spawn of a rater', () => {
+    const source = fs.readFileSync(path.join(TEST_DIR, '../../scripts/score-stop-hint.cjs'), 'utf8');
+    expect(source).not.toMatch(/spawn.*(jev|cli-deem)/);
+  });
+});
```
