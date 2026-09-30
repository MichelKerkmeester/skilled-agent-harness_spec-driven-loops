# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (the code was written by DeepSeek V4.1 Flash through Devin; you are MiMo through Pi). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs`
- `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/scratch/w4-build/build-evidence.md`, and the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
diff --git a/.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs b/.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs
new file mode 100644
index 0000000000..b5a0fc78d3
--- /dev/null
+++ b/.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs
@@ -0,0 +1,1479 @@
+#!/usr/bin/env node
+// ───────────────────────────────────────────────────────────────────
+// MODULE: Reply Judge Agreement
+// ───────────────────────────────────────────────────────────────────
+// Measures offline whether a Jev or Deem score per rubric dimension agrees
+// with the operator's grades of masked replies more often than the mechanical
+// scores of score.mjs. The default run makes no model call and writes no file.
+// The script holds and reads no credential.
+//
+// Usage:
+//   node judge-agreement.mjs --masked <dir>... --replies <dir>... [--labels <file>] [--jev] [--deem] [--out <dir>] [--accept-payload]
+//
+// Exit codes: 0 = report printed, a skipped or stopped arm included; 2 = bad
+// invocation or unreadable input, refused before any call.
+// ───────────────────────────────────────────────────────────────────
+
+import { spawn, spawnSync } from 'node:child_process';
+import { createHash } from 'node:crypto';
+import fs from 'node:fs';
+import os from 'node:os';
+import path from 'node:path';
+import process from 'node:process';
+import { fileURLToPath } from 'node:url';
+import { parseArgs } from 'node:util';
+
+// ───────────────────────────────────────────────────────────────────
+// 1. CONSTANTS
+// ───────────────────────────────────────────────────────────────────
+
+const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
+
+/** Repository root five levels above this benchmark script. */
+export const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..', '..', '..', '..');
+
+/** Mechanical scorer beside this script, the arm a judge arm is measured against. */
+export const SCORE_SCRIPT = path.join(SCRIPT_DIR, 'score.mjs');
+
+/** Rubric the judge scores by, the same file the mechanical scorer applies. */
+export const RUBRIC_PATH = path.join(SCRIPT_DIR, 'rubric.json');
+
+/** Case ids every replies dir is scored over, the same file the mechanical scorer reads. */
+export const CASES_PATH = path.join(SCRIPT_DIR, 'cases.json');
+
+/** Levels a rubric dimension can take, weakest first. */
+export const LEVELS = Object.freeze(['absent', 'partly met', 'fully met']);
+
+/** Graded distinct replies the operator must supply before any model call. */
+export const LABEL_GATE = 20;
+
+// ───────────────────────────────────────────────────────────────────
+// 2. CENSUS
+// ───────────────────────────────────────────────────────────────────
+
+/**
+ * Lowercase hex SHA-256 of the UTF-8 text.
+ * @param {string} text
+ * @returns {string}
+ */
+export function sha256Hex(text) {
+  return createHash('sha256').update(text, 'utf8').digest('hex');
+}
+
+/**
+ * Bare reply body under the `Reply <label>:` marker, or null when the file
+ * carries no marker.
+ * @param {string} text
+ * @returns {string|null}
+ */
+export function readMaskedReply(text) {
+  const match = /^Reply [AB]:[ \t]*\r?$/m.exec(text);
+  if (match === null) return null;
+  return text.slice(match.index + match[0].length).trim();
+}
+
+/**
+ * Absolute paths of the markdown files directly in dir, sorted by file name.
+ * @param {string} dir
+ * @returns {string[]}
+ */
+export function listMarkdown(dir) {
+  let stat;
+  try {
+    stat = fs.statSync(dir);
+  } catch {
+    throw new Error(`not a directory: ${dir}`);
+  }
+  if (!stat.isDirectory()) throw new Error(`not a directory: ${dir}`);
+  return fs
+    .readdirSync(dir, { withFileTypes: true })
+    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
+    .map((entry) => entry.name)
+    .sort()
+    .map((name) => path.resolve(dir, name));
+}
+
+/**
+ * Masks, replies, and the SHA match between them for one census pass.
+ * @param {string[]} maskedDirs
+ * @param {string[]} repliesDirs
+ * @returns {{ maskedFiles: Array<{ file: string, text: string, sha: string }>, replyBySha: Map<string, { file: string, caseId: string }>, masked: number, distinct: number, matched: number, unmatched: number }}
+ */
+export function buildCensus(maskedDirs, repliesDirs) {
+  const replyBySha = new Map();
+  for (const dir of repliesDirs) {
+    for (const file of listMarkdown(dir)) {
+      const sha = sha256Hex(fs.readFileSync(file, 'utf8').trim());
+      if (!replyBySha.has(sha)) replyBySha.set(sha, { file, caseId: path.basename(file, '.md') });
+    }
+  }
+
+  const maskedFiles = [];
+  for (const dir of maskedDirs) {
+    for (const file of listMarkdown(dir)) {
+      const text = fs.readFileSync(file, 'utf8');
+      const reply = readMaskedReply(text);
+      if (reply === null) throw new Error(`not a masked reply: ${file}`);
+      maskedFiles.push({ file, text, sha: sha256Hex(reply) });
+    }
+  }
+
+  const distinctShas = new Set(maskedFiles.map((entry) => entry.sha));
+  const matched = [...distinctShas].filter((sha) => replyBySha.has(sha)).length;
+  return {
+    maskedFiles,
+    replyBySha,
+    masked: maskedFiles.length,
+    distinct: distinctShas.size,
+    matched,
+    unmatched: distinctShas.size - matched,
+  };
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 3. MECHANICAL BASELINE
+// ───────────────────────────────────────────────────────────────────
+
+// A score of 0 is absent, 1 is fully met and anything strictly between is partly met;
+// the mapping is fixed before any model run.
+/**
+ * Rubric level of a mechanical score, or null when the value is no score.
+ * @param {number} value
+ * @returns {string|null}
+ */
+export function levelOfScore(value) {
+  if (typeof value !== 'number' || Number.isNaN(value)) return null;
+  if (value === 0) return 'absent';
+  if (value === 1) return 'fully met';
+  if (value > 0 && value < 1) return 'partly met';
+  return null;
+}
+
+/**
+ * Mechanical dimension scores per absolute reply file path, one score.mjs run
+ * per replies dir; an empty or missing reply file is stood in for so the rest
+ * of its dir still scores and that reply keeps no entry; a run that fails
+ * throws with the scorer's stderr.
+ * @param {string[]} repliesDirs
+ * @returns {Map<string, Record<string, number>>}
+ */
+export function runBaseline(repliesDirs) {
+  const caseIds = JSON.parse(fs.readFileSync(CASES_PATH, 'utf8')).map((c) => c.id);
+  const scoresByReply = new Map();
+  for (const dir of repliesDirs) {
+    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-'));
+    try {
+      fs.mkdirSync(path.join(tmp, 'replies'));
+      const standIns = new Set();
+      for (const id of caseIds) {
+        const file = path.join(dir, `${id}.md`);
+        const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
+        // A stand-in keeps score.mjs from refusing the directory, and its row is
+        // dropped below, so no reply is ever scored without its own text.
+        if (text.trim() !== '') {
+          fs.writeFileSync(path.join(tmp, 'replies', `${id}.md`), text);
+        } else {
+          fs.writeFileSync(path.join(tmp, 'replies', `${id}.md`), 'placeholder for an empty or missing reply\n');
+          standIns.add(id);
+        }
+        const meta = path.join(dir, `${id}.meta.json`);
+        if (fs.existsSync(meta)) fs.copyFileSync(meta, path.join(tmp, 'replies', `${id}.meta.json`));
+      }
+      // No --prompts is passed, so the condition value only labels the output.
+      const result = spawnSync(
+        process.execPath,
+        [SCORE_SCRIPT, '--condition', 'after', '--replies', path.join(tmp, 'replies'), '--out', path.join(tmp, 'scores.json')],
+        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 600000 },
+      );
+      if (result.status !== 0) {
+        throw new Error(`score.mjs failed on ${dir}: ${String(result.stderr || result.error?.message || '').trim().slice(0, 300)}`);
+      }
+      const results = JSON.parse(fs.readFileSync(path.join(tmp, 'scores.json'), 'utf8'));
+      for (const row of [...results.rows, ...results.noOps]) {
+        const id = path.basename(row.replyFile, '.md');
+        if (standIns.has(id)) continue;
+        scoresByReply.set(path.resolve(dir, `${id}.md`), row.dimensionScores);
+      }
+    } finally {
+      fs.rmSync(tmp, { recursive: true, force: true });
+    }
+  }
+  return scoresByReply;
+}
+
+/**
+ * Level of each named dimension, read from one reply's mechanical scores.
+ * @param {Record<string, number>} dimensionScores
+ * @param {string[]} dimensionIds
+ * @returns {Record<string, string|null>}
+ */
+export function baselineLevels(dimensionScores, dimensionIds) {
+  const levels = {};
+  for (const id of dimensionIds) levels[id] = levelOfScore(dimensionScores[id]);
+  return levels;
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 4. LABELS
+// ───────────────────────────────────────────────────────────────────
+
+/**
+ * Rubric dimensions in file order, each with the guidance a judge reads.
+ * @param {string} [rubricPath]
+ * @returns {Array<{ id: string, judgeGuidance: string }>}
+ */
+export function loadRubric(rubricPath = RUBRIC_PATH) {
+  let text;
+  try {
+    text = fs.readFileSync(rubricPath, 'utf8');
+  } catch (error) {
+    throw new Error(`${rubricPath}: cannot read: ${error.message}`);
+  }
+  let parsed;
+  try {
+    parsed = JSON.parse(text);
+  } catch {
+    throw new Error(`${rubricPath}: not JSON`);
+  }
+  const dimensions = parsed?.dimensions;
+  if (!Array.isArray(dimensions) || dimensions.length === 0) throw new Error(`${rubricPath}: dimensions must be a non-empty array`);
+  const rubric = [];
+  const seen = new Set();
+  for (const dimension of dimensions) {
+    const { id, judgeGuidance } = dimension ?? {};
+    if (typeof id !== 'string' || id.trim() === '') throw new Error(`${rubricPath}: every dimension needs a non-empty id`);
+    if (seen.has(id)) throw new Error(`${rubricPath}: duplicate dimension ${id}`);
+    if (typeof judgeGuidance !== 'string' || judgeGuidance.trim() === '') throw new Error(`${rubricPath}: dimension ${id} needs a non-empty judgeGuidance`);
+    seen.add(id);
+    rubric.push({ id, judgeGuidance });
+  }
+  return rubric;
+}
+
+/**
+ * Operator grades from the labels JSONL, each row numbered by its 1-based line.
+ * @param {string} text
+ * @param {string[]} dimensionIds
+ * @returns {Array<{ row: number, masked: string, grades: Record<string, string> }>}
+ */
+export function parseLabels(text, dimensionIds) {
+  const rows = [];
+  const lines = text.split(/\r?\n/);
+  for (let index = 0; index < lines.length; index++) {
+    const line = lines[index];
+    if (line.trim() === '') continue;
+    const n = index + 1;
+    let record;
+    try {
+      record = JSON.parse(line);
+    } catch {
+      throw new Error(`labels row ${n}: not JSON`);
+    }
+    if (record === null || typeof record !== 'object' || Array.isArray(record)) throw new Error(`labels row ${n}: not JSON`);
+    if (typeof record.masked !== 'string' || record.masked.trim() === '') throw new Error(`labels row ${n}: masked must be a non-empty path`);
+    const grades = record.grades;
+    if (grades === null || typeof grades !== 'object' || Array.isArray(grades)) throw new Error(`labels row ${n}: grades must be an object`);
+    for (const id of dimensionIds) {
+      if (!Object.hasOwn(grades, id)) throw new Error(`labels row ${n}: missing dimension ${id}`);
+    }
+    for (const key of Object.keys(grades)) {
+      if (!dimensionIds.includes(key)) throw new Error(`labels row ${n}: unknown dimension ${key}`);
+    }
+    for (const id of dimensionIds) {
+      if (!LEVELS.includes(grades[id])) throw new Error(`labels row ${n}: ${id} must be absent, partly met or fully met`);
+    }
+    rows.push({ row: n, masked: record.masked, grades });
+  }
+  return rows;
+}
+
+// The operator grades masked files, and two masked files can carry the same reply,
+// so the join goes through the reply text's SHA.
+/**
+ * One entry per graded reply SHA, plus the count of graded rows whose source reply
+ * changed after masking and the first grade disagreement between two rows on one reply.
+ * An entry holds the winning labels row, the census masked file it names and that file's text.
+ * @param {Array<{ row: number, masked: string, grades: Record<string, string> }>} rows
+ * @param {{ maskedFiles: Array<{ file: string, text: string, sha: string }>, replyBySha: Map<string, { file: string, caseId: string }> }} census
+ * @param {string} repoRoot
+ * @returns {{ labeled: Map<string, { grades: Record<string, string>, maskedFile: string, text: string, row: { row: number, masked: string, grades: Record<string, string> } }>, unmatchedRows: number, conflict: string|null }}
+ */
+export function joinLabels(rows, census, repoRoot) {
+  const labeled = new Map();
+  let unmatchedRows = 0;
+  for (const row of rows) {
+    const target = path.resolve(repoRoot, row.masked);
+    const maskedFile = census.maskedFiles.find((entry) => path.resolve(entry.file) === target);
+    if (maskedFile === undefined) throw new Error(`labels row ${row.row}: masked file is not in the census: ${row.masked}`);
+    if (!census.replyBySha.has(maskedFile.sha)) {
+      unmatchedRows += 1;
+      continue;
+    }
+    const first = labeled.get(maskedFile.sha)?.row;
+    if (first === undefined) {
+      labeled.set(maskedFile.sha, { grades: row.grades, maskedFile: maskedFile.file, text: maskedFile.text, row });
+      continue;
+    }
+    if (Object.keys(first.grades).some((id) => first.grades[id] !== row.grades[id])) {
+      return { labeled, unmatchedRows, conflict: `labels rows ${first.row} and ${row.row} grade the same reply differently` };
+    }
+  }
+  return { labeled, unmatchedRows, conflict: null };
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 5. SUMMARY
+// ───────────────────────────────────────────────────────────────────
+
+/** The 10-point gain over the baseline that the keep rule requires. */
+export const MARGIN_LINE = 'margin: 0.10';
+
+/** Every keep-rule check in its order, restated for the report reader. */
+export const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, then kill when p_loss < 0.05, then margin 10*(A-B) >= 7*M, then sign test p_win < 0.05, then for jev flips 10*F <= 21*M';
+
+/** Why one keep needs five wins and no loss. */
+export const POWER_LINE = 'power: a keep needs at least 5 wins with no loss, 0.5^5 = 0.03125 < 0.05';
+
+/**
+ * SHA-256 of the question set a judge run was built from, so two runs can be
+ * told apart by rubric text alone.
+ * @param {Array<{ id: string, judgeGuidance: string }>} dimensions
+ * @returns {string}
+ */
+export function questionSetSha(dimensions) {
+  return sha256Hex(JSON.stringify({ questions: dimensions.map((d) => [d.id, d.judgeGuidance]), levels: LEVELS }));
+}
+
+/**
+ * Per-dimension agreement between the operator's grades and the mechanical
+ * levels, with the totals the headroom rule reads.
+ * @param {Map<string, { grades: Record<string, string> }>} labeled
+ * @param {Map<string, Record<string, string|null>>} baseline
+ * @param {string[]} dimensionIds
+ * @returns {{ cells: number, agree: number, perDimension: Record<string, { agree: number, cells: number }> }}
+ */
+export function agreementCounts(labeled, baseline, dimensionIds) {
+  const perDimension = {};
+  for (const id of dimensionIds) perDimension[id] = { agree: 0, cells: 0 };
+  for (const [sha, entry] of labeled) {
+    const levels = baseline.get(sha);
+    for (const id of dimensionIds) {
+      perDimension[id].cells += 1;
+      if (levels[id] === entry.grades[id]) perDimension[id].agree += 1;
+    }
+  }
+  let cells = 0;
+  let agree = 0;
+  for (const id of dimensionIds) {
+    cells += perDimension[id].cells;
+    agree += perDimension[id].agree;
+  }
+  return { cells, agree, perDimension };
+}
+
+/**
+ * Report lines, the gate the label supply supports, and the agreement counts.
+ * @param {{ census: { masked: number, distinct: number, matched: number, unmatched: number }, dimensionIds: string[], questionsSha: string, baseline: Map<string, Record<string, string|null>>, labelsInfo: { rows: number, sha256: string, unmatchedRows: number, noBaselineRows: number }|null, labeled: Map<string, { grades: Record<string, string> }>, noBaseline: number }} input
+ * @returns {{ lines: string[], gate: 'stop'|'no headroom'|'planned', agreement: { cells: number, agree: number, perDimension: Record<string, { agree: number, cells: number }> } }}
+ */
+export function summaryLines({ census, dimensionIds, questionsSha, baseline, labelsInfo, labeled, noBaseline = 0 }) {
+  const levelCounts = { absent: 0, 'partly met': 0, 'fully met': 0 };
+  for (const levels of baseline.values()) {
+    for (const level of Object.values(levels)) {
+      if (level !== null) levelCounts[level] += 1;
+    }
+  }
+  const k = labeled.size;
+  const d = dimensionIds.length;
+  const agreement = agreementCounts(labeled, baseline, dimensionIds);
+  const lines = [
+    `masked: ${census.masked}`,
+    `distinct: ${census.distinct}`,
+    `matched: ${census.matched}`,
+    `unmatched: ${census.unmatched}`,
+    `no baseline: ${noBaseline}`,
+    `questions sha256: ${questionsSha}`,
+    'baseline: score.mjs dimension scores, 0 = absent, 1 = fully met, between = partly met',
+    `baseline levels: absent=${levelCounts.absent} partly met=${levelCounts['partly met']} fully met=${levelCounts['fully met']}`,
+    labelsInfo === null ? 'labels: none' : `labels: rows=${labelsInfo.rows} sha256=${labelsInfo.sha256} unmatched=${labelsInfo.unmatchedRows} no_baseline=${labelsInfo.noBaselineRows ?? 0}`,
+    `labeled: ${k}`,
+  ];
+  if (k === 0) {
+    lines.push('baseline agreement: n/a');
+  } else {
+    lines.push(`baseline agreement: ${agreement.agree}/${agreement.cells} = ${(agreement.agree / agreement.cells).toFixed(4)}`);
+    for (const id of dimensionIds) lines.push(`baseline agreement ${id}: ${agreement.perDimension[id].agree}/${agreement.perDimension[id].cells}`);
+  }
+  lines.push(MARGIN_LINE, KEEP_RULE_LINE, POWER_LINE);
+  // Above 90 percent baseline agreement a 10-point gain cannot fit, so no arm calls.
+  if (k < LABEL_GATE) return { lines: [...lines, `stop: fewer than ${LABEL_GATE} labeled replies`], gate: 'stop', agreement };
+  if (10 * agreement.agree > 9 * agreement.cells) return { lines: [...lines, 'no headroom'], gate: 'no headroom', agreement };
+  return { lines: [...lines, `planned calls: deem=${d * k} jev=${3 * d * k + 1}`], gate: 'planned', agreement };
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 6. VERDICT
+// ───────────────────────────────────────────────────────────────────
+
+// The keep rule is fixed before any model run, counts stay integers and both
+// tails are exact, so no rounding decides a verdict.
+
+/**
+ * One-sided exact tail P(X >= k) for X ~ Binomial(n, 1/2), summed coefficient
+ * by coefficient in BigInt. The threshold test is exact too: 20 * num < 2^n is
+ * p < 0.05 with no float comparison. No trials give p 1.
+ * @param {number} k Successes the tail starts at.
+ * @param {number} n Trials.
+ * @returns {{ p: number, below: boolean }}
+ */
+export function binomialTail(k, n) {
+  if (n === 0) return { p: 1, below: false };
+  let coefficient = 1n;
+  let num = 0n;
+  for (let i = 0; i <= n; i += 1) {
+    if (i > 0) coefficient = (coefficient * BigInt(n - i + 1)) / BigInt(i);
+    if (i >= k) num += coefficient;
+  }
+  const den = 1n << BigInt(n);
+  return { p: Number(num) / Number(den), below: 20n * num < den };
+}
+
+/**
+ * The level more than half the reruns name, with its count. One rerun is its
+ * own level; three different levels name no winner and keep the top count at
+ * 1, the unstable case.
+ * @param {string[]} levels Levels one dimension took across the reruns.
+ * @returns {{ level: string|null, top: number }}
+ */
+export function modalLevel(levels) {
+  if (levels.length === 1) return { level: levels[0], top: 1 };
+  const counts = new Map();
+  for (const level of levels) counts.set(level, (counts.get(level) ?? 0) + 1);
+  for (const [level, count] of counts) {
+    if (2 * count > levels.length) return { level, top: count };
+  }
+  return { level: null, top: 1 };
+}
+
+/**
+ * First failed check decides, in this order: coverage, kill, margin, sign
+ * test, flips. Every outcome carries both exact tails.
+ * @param {{ backend: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number }} counts
+ * @returns {{ verdict: string, pWin: number, pLoss: number }}
+ */
+export function decideVerdict({ backend, K, M, A, B, W, L, F }) {
+  const win = binomialTail(W, W + L);
+  const loss = binomialTail(L, W + L);
+  if (!(10 * M >= 9 * K)) return { verdict: 'stop (coverage)', pWin: win.p, pLoss: loss.p };
+  if (loss.below) return { verdict: 'kill', pWin: win.p, pLoss: loss.p };
+  if (!(10 * (A - B) >= 7 * M)) return { verdict: 'stop (margin)', pWin: win.p, pLoss: loss.p };
+  if (!win.below) return { verdict: 'stop (sign test)', pWin: win.p, pLoss: loss.p };
+  if (backend === 'jev' && !(10 * F <= 21 * M)) return { verdict: 'stop (flips)', pWin: win.p, pLoss: loss.p };
+  return { verdict: 'keep', pWin: win.p, pLoss: loss.p };
+}
+
+/**
+ * @param {number} p Probability in [0, 1].
+ * @returns {string} Four significant digits.
+ */
+export function formatP(p) {
+  return p.toPrecision(4);
+}
+
+/**
+ * One backend column's counts and verdict. A reply is measured only when
+ * every dimension holds exactly `reruns` levels and none is null; every other
+ * reply stays unmeasured. A dimension whose reruns name no level is unstable
+ * and counts as a miss, and the votes a level lacks add to the flip count.
+ * @param {{ backend: string, labeled: Map<string, { grades: Record<string, string> }>, baseline: Map<string, Record<string, string|null>>, answers: Map<string, Record<string, Array<string|null>>>, dimensionIds: string[], reruns: number }} input
+ * @returns {{ backend: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number, unstable: number, perDimension: Record<string, { column: number, baseline: number, cells: number }>, verdict: string, pWin: number, pLoss: number }}
+ */
+export function summarizeColumn({ backend, labeled, baseline, answers, dimensionIds, reruns }) {
+  const K = labeled.size;
+  let M = 0;
+  let A = 0;
+  let B = 0;
+  let W = 0;
+  let L = 0;
+  let F = 0;
+  let unstable = 0;
+  const perDimension = {};
+  for (const id of dimensionIds) perDimension[id] = { column: 0, baseline: 0, cells: 0 };
+  for (const sha of [...labeled.keys()].sort()) {
+    const grades = labeled.get(sha).grades;
+    const levels = answers.get(sha);
+    const measured = dimensionIds.every((id) => Array.isArray(levels?.[id])
+      && levels[id].length === reruns
+      && levels[id].every((level) => level !== null));
+    if (!measured) continue;
+    M += 1;
+    let column = 0;
+    let base = 0;
+    for (const id of dimensionIds) {
+      const { level, top } = modalLevel(levels[id]);
+      F += reruns - top;
+      if (level === null) unstable += 1;
+      perDimension[id].cells += 1;
+      if (level === grades[id]) {
+        column += 1;
+        perDimension[id].column += 1;
+      }
+      if (baseline.get(sha)[id] === grades[id]) {
+        base += 1;
+        perDimension[id].baseline += 1;
+      }
+    }
+    A += column;
+    B += base;
+    if (column > base) W += 1;
+    if (column < base) L += 1;
+  }
+  const { verdict, pWin, pLoss } = decideVerdict({ backend, K, M, A, B, W, L, F });
+  return { backend, K, M, A, B, W, L, F, unstable, perDimension, verdict, pWin, pLoss };
+}
+
+/**
+ * The one-line verdict with both exact tails and the labels SHA.
+ * @param {{ backend: string, verdict: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number, pWin: number, pLoss: number }} summary
+ * @param {string} labelsSha
+ * @param {string} [suffix] Appended when a non-empty string.
+ * @returns {string}
+ */
+export function verdictLine(summary, labelsSha, suffix) {
+  const { backend, verdict, K, M, A, B, W, L, F, pWin, pLoss } = summary;
+  let line = `verdict ${backend}: ${verdict} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L}`
+    + ` F=${backend === 'jev' ? F : 'n/a'} p_win=${formatP(pWin)} p_loss=${formatP(pLoss)} labels_sha256=${labelsSha}`;
+  if (typeof suffix === 'string' && suffix !== '') line += ` ${suffix}`;
+  return line;
+}
+
+// The per-dimension table is reported for the reader and never decides a verdict;
+// the keep rule reads the column totals.
+/**
+ * One line per dimension with both hit counts over the measured cells.
+ * @param {{ backend: string, perDimension: Record<string, { column: number, baseline: number, cells: number }> }} summary
+ * @param {string[]} dimensionIds
+ * @returns {string[]}
+ */
+export function dimensionLines(summary, dimensionIds) {
+  return dimensionIds.map((id) => {
+    const { column, baseline, cells } = summary.perDimension[id];
+    return `dimension ${summary.backend} ${id}: column=${column}/${cells} baseline=${baseline}/${cells}`;
+  });
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 7. DEEM ARM
+// ───────────────────────────────────────────────────────────────────
+
+// The gate runs only behind --deem, reads the local model's health once,
+// passes no key and never starts the server.
+
+/** Pinned Deem model name the health check accepts. */
+export const DEEM_MODEL = 'deem-0.8-v1';
+
+/** Deem 3-level score p50 in milliseconds, from deem-local.md, used for the wall-time estimate. */
+export const DEEM_P50_MS = 60.2;
+
+/** Bounds the health spawn; cli-deem bounds its own HTTP health request at 2,000 ms. */
+export const HEALTH_TIMEOUT_MS = 10000;
+
+/** Repo copy of the cli-deem entry point, run under node when none is on PATH. */
+const REPO_CLI_DEEM = path.join(REPO_ROOT, '.skilled', 'skills', 'cli-classifier', 'cli-deem', 'scripts', 'cli-deem.mjs');
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
+export function deemCommand(env) {
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
+export function readDeemHealth(cmd, env) {
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
+export function deemGate(ctx) {
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
+/**
+ * Nearest-rank percentile. Empty lists have no rank.
+ *
+ * @param {number[]} values Raw values.
+ * @param {number} q Quantile in (0, 1].
+ * @returns {number | null}
+ */
+export function nearestRank(values, q) {
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
+export function spawnCall(file, args, stdinText, env, timeoutMs) {
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
+export function createCallLog(outDir) {
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
+ * Level position from one score answer. A backend may return a fractional
+ * position, so it rounds to the nearest level, and a value outside 0 to 2
+ * or a body that does not parse is an unmeasured call, not a crash.
+ *
+ * @param {string} stdout Raw stdout of one score call.
+ * @returns {0 | 1 | 2 | null} Level position, or null when unmeasured.
+ */
+export function parseScoreAnswer(stdout) {
+  let parsed;
+  try {
+    parsed = JSON.parse(stdout);
+  } catch {
+    return null;
+  }
+  const score = parsed?.answers?.answer?.score;
+  if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 2) return null;
+  return Math.round(score);
+}
+
+/**
+ * One `score` call per labeled reply and rubric dimension, with one calls.jsonl
+ * record per spawn. Exit 4 gets one retry behind a fresh health check, because
+ * a dropped connection is not a judgment. A stop prints the line and the
+ * replies that finished, and leaves the column and verdict unprinted.
+ *
+ * @param {{
+ *   labeled: Map<string, { grades: Record<string, string>, text: string }>,
+ *   baseline: Map<string, Record<string, string | null>>,
+ *   dimensions: Array<{ id: string, judgeGuidance: string }>,
+ *   labelsSha: string
+ * }} plan Labeled replies, the mechanical baseline, the rubric and the labels SHA.
+ * @param {{ cmd: string[], model: string, modelCommit: string, sourceCommit: string }} gate Passing deemGate result.
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number,
+ *   callLog: { append: (record: object) => void },
+ *   stored: object | null
+ * }} ctx Line writer, environment, per-call timeout, the call log and an earlier run's report.
+ * @returns {Promise<
+ *   { stopped: string, partialReplies: number }
+ *   | {
+ *     column: {
+ *       backend: string, K: number, M: number, A: number, B: number, W: number, L: number,
+ *       F: number, unstable: number,
+ *       perDimension: Record<string, { column: number, baseline: number, cells: number }>,
+ *       verdict: string, pWin: number, pLoss: number, line: string,
+ *       latency: { p50: number | null, p95: number | null },
+ *       modelId: string, modelCommit: string, sourceCommit: string
+ *     },
+ *     requalify: string | null
+ *   }
+ * >}
+ */
+export async function runDeemArm(plan, gate, ctx) {
+  const dimensionIds = plan.dimensions.map((dimension) => dimension.id);
+  const K = plan.labeled.size;
+  const planned = dimensionIds.length * K;
+  ctx.out(`deem: nothing leaves the machine; planned calls: ${planned}; estimated wall time: ${(planned * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the 3-level score p50 in deem-local.md`);
+
+  const answers = new Map();
+  const wallTimes = [];
+  let finished = 0;
+
+  /**
+   * One calls.jsonl record. A spawn that led to a stop or a retry carries no
+   * judgment, so its position stays empty and its status is unmeasured.
+   */
+  function record(sha, dimension, attempt, r, position, status) {
+    return {
+      backend: 'deem',
+      replySha: sha.slice(0, 12),
+      dimension: dimension.id,
+      rerun: 0,
+      attempt,
+      wallMs: r.wallMs,
+      exitCode: r.code,
+      position,
+      status,
+      modelId: gate.model,
+      modelCommit: gate.modelCommit,
+      sourceCommit: gate.sourceCommit,
+    };
+  }
+
+  function stop(line) {
+    ctx.out(line);
+    ctx.out(`deem: partial replies=${finished}`);
+    return { stopped: line, partialReplies: finished };
+  }
+
+  for (const sha of [...plan.labeled.keys()].sort()) {
+    const entry = plan.labeled.get(sha);
+    const levels = {};
+    for (const dimension of plan.dimensions) {
+      const callArgs = [...gate.cmd.slice(1), 'score', '-q', dimension.judgeGuidance, '-l', LEVELS[0], '-l', LEVELS[1], '-l', LEVELS[2]];
+      let attempt = 1;
+      let r = await spawnCall(gate.cmd[0], callArgs, entry.text, ctx.env, ctx.timeoutMs);
+      wallTimes.push(r.wallMs);
+
+      if (!r.timedOut && r.code === 4) {
+        ctx.callLog.append(record(sha, dimension, attempt, r, null, 'unmeasured'));
+        const health = readDeemHealth(gate.cmd, ctx.env);
+        if (!health.ok) return stop('deem arm stopped: server gone');
+        if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
+          return stop('deem arm stopped: model commit changed mid-run');
+        }
+        attempt = 2;
+        r = await spawnCall(gate.cmd[0], callArgs, entry.text, ctx.env, ctx.timeoutMs);
+        wallTimes.push(r.wallMs);
+      }
+
+      let position = null;
+      let status = 'unmeasured';
+      let stopLine = null;
+      if (r.timedOut) {
+        status = 'unmeasured_timeout';
+      } else if (r.code === 0) {
+        position = parseScoreAnswer(r.stdout);
+        status = position === null ? 'unmeasured' : 'measured';
+      } else if (r.code === 2) {
+        stopLine = 'deem arm stopped: usage error';
+      } else if (r.code === 3) {
+        stopLine = 'deem arm stopped: backend refused';
+      } else if (r.code === 130) {
+        stopLine = 'deem arm stopped: interrupted';
+      }
+
+      ctx.callLog.append(record(sha, dimension, attempt, r, position, status));
+      if (stopLine !== null) return stop(stopLine);
+      levels[dimension.id] = [position === null ? null : LEVELS[position]];
+    }
+    answers.set(sha, levels);
+    finished += 1;
+  }
+
+  const summary = summarizeColumn({ backend: 'deem', labeled: plan.labeled, baseline: plan.baseline, answers, dimensionIds, reruns: 1 });
+  const latency = { p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) };
+  ctx.out(`column deem: replies=${K} measured=${summary.M} unmeasured=${K - summary.M} unstable=${summary.unstable} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
+  for (const line of dimensionLines(summary, dimensionIds)) ctx.out(line);
+  ctx.out('flips: n/a (commit pair)');
+  const storedDeem = ctx.stored?.columns?.deem;
+  let requalify = null;
+  if (storedDeem && (storedDeem.modelCommit !== gate.modelCommit || storedDeem.sourceCommit !== gate.sourceCommit)) {
+    requalify = 'requalify: model commit changed';
+    ctx.out(requalify);
+  }
+  const line = verdictLine(summary, plan.labelsSha, `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`);
+  ctx.out(line);
+
+  return {
+    column: { ...summary, line, latency, modelId: gate.model, modelCommit: gate.modelCommit, sourceCommit: gate.sourceCommit },
+    requalify,
+  };
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 8. JEV ARM
+// ───────────────────────────────────────────────────────────────────
+
+// The gate runs only behind --jev, reads no key and passes none, because
+// jev resolves its own credential.
+
+/** Pinned jev version the gate accepts. */
+export const JEV_VERSION = 'jev 0.6.2';
+
+/**
+ * Identity line, then the pinned version and a credential check.
+ * A miss prints a skip line and leaves the census text already written.
+ *
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number
+ * }} ctx Line writer, environment and per-call timeout.
+ * @returns {{ passed: boolean, path: string | null, provider: string, reason?: string }}
+ *   True when the gate passed; a failed gate carries the skip line it printed.
+ */
+export function jevGate(ctx) {
+  const provider = ctx.env.JEV_PROVIDER || 'official';
+  const path = which('jev', ctx.env);
+  ctx.out(`jev: path=${path ?? 'none'} provider=${provider}`);
+  if (path === null) {
+    const skipLine = 'jev arm skipped: jev not on PATH';
+    ctx.out(skipLine);
+    return { passed: false, path, provider, reason: skipLine };
+  }
+
+  const opts = {
+    env: ctx.env,
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+    timeout: ctx.timeoutMs,
+  };
+  const version = spawnSync(path, ['--version'], opts);
+  const trimmed = (version.stdout ?? '').trim();
+  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
+  if (found !== JEV_VERSION) {
+    const skipLine = 'jev arm skipped: version';
+    ctx.out(skipLine);
+    ctx.out(`jev: found=${JSON.stringify(found)} path=${path}`);
+    return { passed: false, path, provider, reason: skipLine };
+  }
+
+  const auth = spawnSync(path, ['auth', 'status', '--provider', provider], opts);
+  if (auth.status !== 0) {
+    const skipLine = 'jev arm skipped: no credential';
+    ctx.out(skipLine);
+    return { passed: false, path, provider, reason: skipLine };
+  }
+  return { passed: true, path, provider };
+}
+
+/**
+ * Git tracking class of the masked replies. An untracked masked file may hold
+ * text never meant to leave this machine, so Jev needs --accept-payload for it.
+ * @param {Array<{ file: string }>} maskedFiles
+ * @returns {'untracked masked replies' | 'committed masked replies'}
+ */
+export function payloadClass(maskedFiles) {
+  const trackedByDir = new Map();
+  for (const entry of maskedFiles) {
+    const dir = path.dirname(entry.file);
+    if (trackedByDir.has(dir)) continue;
+    const result = spawnSync('git', ['-C', dir, 'ls-files', '-z', '--', '.'], {
+      encoding: 'utf8',
+      stdio: ['ignore', 'pipe', 'ignore'],
+      timeout: 10000,
+    });
+    trackedByDir.set(dir, result.status === 0 ? new Set(result.stdout.split('\0').filter(Boolean)) : new Set());
+  }
+  for (const entry of maskedFiles) {
+    if (!trackedByDir.get(path.dirname(entry.file)).has(path.basename(entry.file))) return 'untracked masked replies';
+  }
+  return 'committed masked replies';
+}
+
+/**
+ * One auth test, then three score calls per labeled reply and rubric dimension,
+ * one per rerun, with one calls.jsonl record per spawn. Exit 4 gets one retry
+ * after the backoff, because a dropped connection is not a judgment. A stop
+ * prints the line and the replies that finished, and leaves the column and
+ * verdict unprinted.
+ *
+ * @param {{
+ *   labeled: Map<string, { grades: Record<string, string>, text: string }>,
+ *   baseline: Map<string, Record<string, string | null>>,
+ *   dimensions: Array<{ id: string, judgeGuidance: string }>,
+ *   labelsSha: string,
+ *   payload: string
+ * }} plan Labeled replies, the mechanical baseline, the rubric, the labels SHA
+ *   and the payload class.
+ * @param {{ path: string, provider: string }} gate Passing jevGate result.
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number,
+ *   backoffMs: number,
+ *   callLog: { append: (record: object) => void },
+ *   stored: object | null
+ * }} ctx Line writer, environment, per-call timeout, retry wait, the call log
+ *   and an earlier run's report.
+ * @returns {Promise<
+ *   { stopped: string, partialReplies: number }
+ *   | {
+ *     column: {
+ *       backend: string, K: number, M: number, A: number, B: number, W: number, L: number,
+ *       F: number, unstable: number,
+ *       perDimension: Record<string, { column: number, baseline: number, cells: number }>,
+ *       verdict: string, pWin: number, pLoss: number, line: string,
+ *       latency: { p50: number | null, p95: number | null },
+ *       jevVersion: string, provider: string, model: string
+ *     },
+ *     requalify: string | null
+ *   }
+ * >}
+ */
+export async function runJevArm(plan, gate, ctx) {
+  const reruns = 3;
+  const dimensionIds = plan.dimensions.map((dimension) => dimension.id);
+  const K = plan.labeled.size;
+  let chars = 0;
+  for (const entry of plan.labeled.values()) {
+    for (const dimension of plan.dimensions) {
+      chars += entry.text.length + dimension.judgeGuidance.length + LEVELS.join('').length;
+    }
+  }
+  chars *= reruns;
+  ctx.out(`jev: payload: ${plan.payload}; planned calls: ${reruns * dimensionIds.length * K + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);
+
+  const wallTimes = [];
+  let finished = 0;
+
+  function stop(line) {
+    ctx.out(line);
+    ctx.out(`jev: partial replies=${finished}`);
+    return { stopped: line, partialReplies: finished };
+  }
+
+  const auth = await spawnCall(
+    gate.path,
+    ['auth', 'test', '--provider', gate.provider],
+    '',
+    ctx.env,
+    ctx.timeoutMs,
+  );
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
+    replySha: null,
+    dimension: null,
+    rerun: null,
+    attempt: 1,
+    wallMs: auth.wallMs,
+    exitCode: auth.code,
+    position: null,
+    status: auth.code === 0 ? 'measured' : 'unmeasured',
+    jevVersion: '0.6.2',
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
+   * judgment, so its position stays empty and its status is unmeasured.
+   */
+  function record(sha, dimension, rerun, attempt, r, position, status) {
+    return {
+      backend: 'jev',
+      replySha: sha.slice(0, 12),
+      dimension: dimension.id,
+      rerun,
+      attempt,
+      wallMs: r.wallMs,
+      exitCode: r.code,
+      position,
+      status,
+      jevVersion: '0.6.2',
+      provider: gate.provider,
+      model,
+    };
+  }
+
+  for (const sha of [...plan.labeled.keys()].sort()) {
+    const entry = plan.labeled.get(sha);
+    const levels = {};
+    for (const dimension of plan.dimensions) {
+      const callArgs = ['score', '--provider', gate.provider, '-q', dimension.judgeGuidance, '-l', LEVELS[0], '-l', LEVELS[1], '-l', LEVELS[2]];
+      const rerunLevels = [];
+      for (let rerun = 0; rerun < reruns; rerun += 1) {
+        let attempt = 1;
+        let r = await spawnCall(gate.path, callArgs, entry.text, ctx.env, ctx.timeoutMs);
+        wallTimes.push(r.wallMs);
+
+        if (!r.timedOut && r.code === 4) {
+          ctx.callLog.append(record(sha, dimension, rerun, attempt, r, null, 'unmeasured'));
+          await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
+          attempt = 2;
+          r = await spawnCall(gate.path, callArgs, entry.text, ctx.env, ctx.timeoutMs);
+          wallTimes.push(r.wallMs);
+        }
+
+        let position = null;
+        let status = 'unmeasured';
+        let stopLine = null;
+        if (r.timedOut) {
+          status = 'unmeasured_timeout';
+        } else if (r.code === 0) {
+          position = parseScoreAnswer(r.stdout);
+          status = position === null ? 'unmeasured' : 'measured';
+        } else if (r.code === 2) {
+          stopLine = 'jev arm stopped: usage error';
+        } else if (r.code === 3) {
+          stopLine = 'jev arm stopped: key rejected';
+        } else if (r.code === 130) {
+          stopLine = 'jev arm stopped: interrupted';
+        }
+
+        ctx.callLog.append(record(sha, dimension, rerun, attempt, r, position, status));
+        if (stopLine !== null) return stop(stopLine);
+        rerunLevels.push(position === null ? null : LEVELS[position]);
+      }
+      levels[dimension.id] = rerunLevels;
+    }
+    answers.set(sha, levels);
+    finished += 1;
+  }
+
+  const summary = summarizeColumn({ backend: 'jev', labeled: plan.labeled, baseline: plan.baseline, answers, dimensionIds, reruns });
+  const latency = { p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) };
+  ctx.out(`column jev: replies=${K} measured=${summary.M} unmeasured=${K - summary.M} unstable=${summary.unstable} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
+  for (const line of dimensionLines(summary, dimensionIds)) ctx.out(line);
+  const storedJev = ctx.stored?.columns?.jev;
+  let requalify = null;
+  if (storedJev && (storedJev.provider !== gate.provider || storedJev.model !== model)) {
+    requalify = 'requalify: model changed';
+    ctx.out(requalify);
+  }
+  const line = verdictLine(summary, plan.labelsSha, `jev_version=0.6.2 provider=${gate.provider} model=${model}`);
+  ctx.out(line);
+
+  return {
+    column: { ...summary, line, latency, jevVersion: '0.6.2', provider: gate.provider, model },
+    requalify,
+  };
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 9. ENTRY POINT
+// ───────────────────────────────────────────────────────────────────
+
+/** Usage line printed when an invocation misses an input. */
+export const USAGE = 'usage: node judge-agreement.mjs --masked <dir>... --replies <dir>... [--labels <file>] [--jev] [--deem] [--out <dir>] [--accept-payload]';
+
+/**
+ * Parsed report.json written by an earlier run into the same out directory.
+ *
+ * @param {string | undefined} outDir Directory that may hold report.json.
+ * @returns {object | null} The parsed report, or null when outDir is empty,
+ *   the file is missing, or the file does not parse.
+ */
+export function readStoredReport(outDir) {
+  if (typeof outDir !== 'string' || outDir === '') return null;
+  try {
+    return JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
+  } catch {
+    return null;
+  }
+}
+
+/**
+ * The report.json body. An arm with no result is left out of every map; a
+ * skipped arm records its line, a stopped arm its line and the replies that
+ * finished, and a column arm its counts plus the requalify flag.
+ *
+ * @param {{
+ *   census: { masked: number, distinct: number, matched: number, unmatched: number },
+ *   questionsSha: string,
+ *   labelsSha: string,
+ *   K: number,
+ *   agreement: { agree: number, cells: number },
+ *   jev: object | undefined,
+ *   deem: object | undefined
+ * }} input Census counts, the two SHAs, the labeled count, the baseline agreement and one result per arm.
+ * @returns {object} The report.json body.
+ */
+export function buildReport({ census, questionsSha, labelsSha, K, agreement, jev, deem }) {
+  const report = {
+    census: { masked: census.masked, distinct: census.distinct, matched: census.matched, unmatched: census.unmatched },
+    questionsSha256: questionsSha,
+    labelsSha256: labelsSha,
+    K,
+    baselineAgreement: { agree: agreement.agree, cells: agreement.cells },
+    keepRule: KEEP_RULE_LINE,
+    columns: {},
+    stopped: {},
+    skipped: {},
+    requalify: {},
+  };
+  for (const [backend, arm] of [['jev', jev], ['deem', deem]]) {
+    if (arm === undefined) continue;
+    if (arm.skipped !== undefined) report.skipped[backend] = arm.skipped;
+    if (arm.stopped !== undefined) report.stopped[backend] = { line: arm.stopped, partialReplies: arm.partialReplies };
+    if (arm.column !== undefined) {
+      report.columns[backend] = arm.column;
+      report.requalify[backend] = arm.requalify ?? null;
+    }
+  }
+  return report;
+}
+
+/**
+ * Prints the zero-call census report. The default run writes no file and
+ * spawns no model binary, so its stdout is the same on every run.
+ * @param {string[]} argv - Arguments after the script path.
+ * @param {Object} [deps] - Input, writer and judge arm replacements.
+ * @param {string} [deps.repoRoot] - Repository root. Default REPO_ROOT.
+ * @param {(line: string) => void} [deps.out] - Line writer. Default writes the line plus '\n' to stdout.
+ * @param {(line: string) => void} [deps.err] - Line writer. Default writes the line plus '\n' to stderr.
+ * @param {Record<string, string | undefined>} [deps.env] - Judge arm environment. Default process.env.
+ * @param {number} [deps.timeoutMs] - Judge arm call timeout. Default 90000.
+ * @param {number} [deps.backoffMs] - Judge arm retry wait. Default 2000.
+ * @returns {Promise<number>} 0 = report printed, 2 = bad invocation or unreadable input.
+ */
+export async function main(argv, deps = {}) {
+  const repoRoot = deps.repoRoot ?? REPO_ROOT;
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
+        masked: { type: 'string', multiple: true },
+        replies: { type: 'string', multiple: true },
+        labels: { type: 'string' },
+        deem: { type: 'boolean' },
+        jev: { type: 'boolean' },
+        out: { type: 'string' },
+        'accept-payload': { type: 'boolean' },
+      },
+    });
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    return 2;
+  }
+  const { values } = parsed;
+
+  const masked = values.masked ?? [];
+  const replies = values.replies ?? [];
+  if (masked.length === 0 || replies.length === 0) {
+    err(USAGE);
+    return 2;
+  }
+  if ((values.deem === true || values.jev === true) && (typeof values.out !== 'string' || values.out === '')) {
+    err('--deem and --jev need --out <dir> so every call is recorded');
+    return 2;
+  }
+
+  let dimensions;
+  let ids;
+  let census;
+  let scores;
+  let labelsText = null;
+  let rows;
+  let joined;
+  try {
+    dimensions = loadRubric();
+    ids = dimensions.map((dimension) => dimension.id);
+    census = buildCensus(masked, replies);
+    scores = runBaseline(replies);
+    labelsText = typeof values.labels === 'string' ? fs.readFileSync(values.labels, 'utf8') : null;
+    rows = labelsText === null ? [] : parseLabels(labelsText, ids);
+    joined = joinLabels(rows, census, repoRoot);
+  } catch (error) {
+    err(error.message);
+    return 2;
+  }
+
+  if (joined.conflict !== null) {
+    out('stop: label conflict');
+    err(joined.conflict);
+    return 2;
+  }
+
+  const baseline = new Map();
+  let noBaseline = 0;
+  for (const sha of new Set(census.maskedFiles.map((entry) => entry.sha))) {
+    const reply = census.replyBySha.get(sha);
+    if (reply === undefined) continue;
+    const levels = scores.get(path.resolve(reply.file));
+    if (levels === undefined) {
+      noBaseline += 1;
+      continue;
+    }
+    baseline.set(sha, baselineLevels(levels, ids));
+  }
+
+  const labeled = new Map();
+  let noBaselineRows = 0;
+  for (const [sha, entry] of joined.labeled) {
+    if (!baseline.has(sha)) {
+      noBaselineRows += 1;
+      continue;
+    }
+    labeled.set(sha, entry);
+  }
+
+  const labelsInfo = labelsText === null
+    ? null
+    : { rows: rows.length, sha256: sha256Hex(labelsText), unmatchedRows: joined.unmatchedRows, noBaselineRows };
+  const labelsSha = labelsInfo === null ? 'none' : labelsInfo.sha256;
+  const summary = summaryLines({
+    census,
+    dimensionIds: ids,
+    questionsSha: questionSetSha(dimensions),
+    baseline,
+    labelsInfo,
+    labeled,
+    noBaseline,
+  });
+  for (const line of summary.lines) out(line);
+
+  const outDir = values.out;
+  let callLog = null;
+  let stored = null;
+  if (values.deem === true || values.jev === true) {
+    callLog = createCallLog(outDir);
+    stored = readStoredReport(outDir);
+  }
+
+  // Jev goes first, then Deem: each arm runs only on its own switch and checks,
+  // and a failed check never starts the other arm.
+  let jevResult;
+  if (values.jev === true) {
+    const check = jevGate({ out, env, timeoutMs });
+    if (!check.passed) {
+      jevResult = { skipped: check.reason };
+    } else {
+      const payload = payloadClass(census.maskedFiles);
+      if (payload === 'untracked masked replies' && values['accept-payload'] !== true) {
+        out('jev arm skipped: payload not accepted');
+        jevResult = { skipped: 'jev arm skipped: payload not accepted' };
+      } else if (summary.gate !== 'planned') {
+        const line = `jev arm skipped: ${summary.gate === 'stop' ? 'label gate' : 'no headroom'}`;
+        out(line);
+        jevResult = { skipped: line };
+      } else {
+        jevResult = await runJevArm({ labeled, baseline, dimensions, labelsSha, payload }, check, { out, env, timeoutMs, backoffMs, callLog, stored });
+      }
+    }
+  }
+
+  // A skipped or refused gate leaves every earlier line as it was.
+  let deemResult;
+  if (values.deem === true) {
+    const check = deemGate({ out, env });
+    if (!check.passed) {
+      deemResult = { skipped: check.reason };
+    } else if (summary.gate !== 'planned') {
+      const line = `deem arm skipped: ${summary.gate === 'stop' ? 'label gate' : 'no headroom'}`;
+      out(line);
+      deemResult = { skipped: line };
+    } else {
+      deemResult = await runDeemArm(
+        { labeled, baseline, dimensions, labelsSha },
+        check,
+        { out, env, timeoutMs, callLog, stored },
+      );
+    }
+  }
+
+  if (values.deem === true || values.jev === true) {
+    const report = buildReport({
+      census,
+      questionsSha: questionSetSha(dimensions),
+      labelsSha,
+      K: labeled.size,
+      agreement: summary.agreement,
+      jev: jevResult,
+      deem: deemResult,
+    });
+    fs.mkdirSync(outDir, { recursive: true });
+    fs.writeFileSync(path.join(outDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
+  }
+  return 0;
+}
+
+if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
+  process.exitCode = await main(process.argv.slice(2));
+}
diff --git a/.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs b/.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs
new file mode 100644
index 0000000000..d62ec544a2
--- /dev/null
+++ b/.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs
@@ -0,0 +1,920 @@
+import assert from 'node:assert/strict';
+import { spawnSync } from 'node:child_process';
+import fs from 'node:fs';
+import os from 'node:os';
+import path from 'node:path';
+import test from 'node:test';
+import { fileURLToPath } from 'node:url';
+
+import { baselineLevels, binomialTail, buildCensus, createCallLog, decideVerdict, joinLabels, levelOfScore, LEVELS, listMarkdown, loadRubric, main, modalLevel, parseLabels, parseScoreAnswer, payloadClass, POWER_LINE, readMaskedReply, readStoredReport, runBaseline, sha256Hex, spawnCall, summarizeColumn, summaryLines, verdictLine } from './judge-agreement.mjs';
+
+const CASE_IDS = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'NC1'];
+
+const makeFixture = ({ editOneAfterMasking = false } = {}) => {
+  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-test-'));
+  const repliesDirs = ['r1', 'r2', 'r3'].map((name) => path.join(root, name));
+  for (const dir of repliesDirs) {
+    const dirName = path.basename(dir);
+    fs.mkdirSync(dir);
+    for (const caseId of CASE_IDS) {
+      fs.writeFileSync(
+        path.join(dir, `${caseId}.md`),
+        `Reply ${dirName} ${caseId}: the answer sits in \`src/${caseId}.ts\` and the run printed exit 0.\n`,
+      );
+    }
+  }
+
+  const maskedDirs = ['m1', 'm2'].map((name) => path.join(root, name));
+  const sources = [
+    [repliesDirs[0], repliesDirs[1]],
+    [repliesDirs[1], repliesDirs[2]],
+  ];
+  for (let i = 0; i < maskedDirs.length; i++) {
+    fs.mkdirSync(maskedDirs[i]);
+    for (const caseId of CASE_IDS) {
+      for (const [label, source] of [['A', sources[i][0]], ['B', sources[i][1]]]) {
+        const reply = fs.readFileSync(path.join(source, `${caseId}.md`), 'utf8');
+        fs.writeFileSync(
+          path.join(maskedDirs[i], `${caseId}-${label}.md`),
+          `Case: ${caseId}\n\nPrompt for ${caseId}\n\nReply ${label}:\n\n${reply.trim()}\n`,
+        );
+      }
+    }
+  }
+
+  if (editOneAfterMasking) fs.writeFileSync(path.join(repliesDirs[2], 'C1.md'), 'edited after masking\n');
+
+  return { root, repliesDirs, maskedDirs };
+};
+
+// Test double for the cli-deem and jev binaries: it logs one line per call and answers from a table.
+function stubMain() {
+  const fs = require('node:fs');
+  const path = require('node:path');
+  const { createHash } = require('node:crypto');
+  const name = path.basename(process.argv[1]);
+  const args = process.argv.slice(2);
+  const env = process.env;
+  const scoring = args[0] === 'score';
+  const stdin = scoring ? fs.readFileSync(0, 'utf8') : '';
+  const key = scoring ? `${createHash('sha256').update(stdin).digest('hex')}|${args[args.indexOf('-q') + 1]}` : '';
+  const prior = env.STUB_LOG && fs.existsSync(env.STUB_LOG) ? fs.readFileSync(env.STUB_LOG, 'utf8').split('\n') : [];
+  const rerun = prior.filter((line) => scoring && line.split('\t')[0] === name && line.split('\t')[2] === key).length;
+  if (env.STUB_LOG) fs.appendFileSync(env.STUB_LOG, `${name}\t${args.join(' ')}\t${key}\n`);
+  if (name === 'cli-deem' && args[0] === 'health') {
+    if (env.STUB_HEALTH === 'stub') {
+      process.stderr.write('{"ok":false,"error":"refused backend: ensemble:stub"}\n');
+      process.exit(3);
+    }
+    process.stdout.write('{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"stubmodel","source_commit":"stubsource"}\n');
+  } else if (name === 'jev' && args[0] === '--version') {
+    process.stdout.write(`${env.STUB_JEV_VERSION || 'jev 0.6.2'}\n`);
+  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'status') {
+    process.exit(Number(env.STUB_AUTH_STATUS_EXIT || 0));
+  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'test') {
+    process.stdout.write('{"ok":true,"model":"stub-model"}\n');
+  } else if (scoring) {
+    if (env.STUB_SCORE_EXIT) process.exit(Number(env.STUB_SCORE_EXIT));
+    const table = env.STUB_ANSWERS ? JSON.parse(fs.readFileSync(env.STUB_ANSWERS, 'utf8')) : {};
+    const entry = table[key];
+    const position = Array.isArray(entry) ? entry[rerun % entry.length] : (entry ?? 0);
+    process.stdout.write(`${JSON.stringify({ model: 'deem-0.8-v1', answers: { answer: { score: position } } })}\n`);
+  } else {
+    process.exit(2);
+  }
+}
+
+const STUB_SOURCE = `#!/usr/bin/env node\n(${stubMain.toString()})();\n`;
+
+const makeStubBin = (root) => {
+  const bin = path.join(root, 'bin');
+  fs.mkdirSync(bin);
+  for (const name of ['cli-deem', 'jev']) fs.writeFileSync(path.join(bin, name), STUB_SOURCE, { mode: 0o755 });
+  return bin;
+};
+
+const stubEnv = (root, extra = {}) => ({
+  ...process.env,
+  PATH: `${path.join(root, 'bin')}${path.delimiter}${process.env.PATH}`,
+  STUB_LOG: path.join(root, 'stub.log'),
+  JEV_PROVIDER: '',
+  ...extra,
+});
+
+const readStubLog = (root) => {
+  const logPath = path.join(root, 'stub.log');
+  if (!fs.existsSync(logPath)) return [];
+  return fs.readFileSync(logPath, 'utf8').split('\n').filter((line) => line.length > 0);
+};
+
+const run = async (argv, env) => {
+  const lines = [];
+  const errors = [];
+  const code = await main(argv, { out: (line) => lines.push(line), err: (line) => errors.push(line), env });
+  return { code, lines, errors };
+};
+
+test('readMaskedReply returns the body under the marker and null without one', () => {
+  assert.equal(readMaskedReply('Case: C1\n\nQ?\n\nReply B:\n\n  body text \n'), 'body text');
+  assert.equal(readMaskedReply('no marker'), null);
+});
+
+test('buildCensus counts every masked file and matches every distinct reply', () => {
+  const { root, repliesDirs, maskedDirs } = makeFixture();
+  try {
+    const census = buildCensus(maskedDirs, repliesDirs);
+    assert.equal(census.masked, 28);
+    assert.equal(census.distinct, 21);
+    assert.equal(census.matched, 21);
+    assert.equal(census.unmatched, 0);
+  } finally {
+    fs.rmSync(root, { recursive: true, force: true });
+  }
+});
+
+test('buildCensus reports the masked reply whose source changed after masking', () => {
+  const { root, repliesDirs, maskedDirs } = makeFixture({ editOneAfterMasking: true });
+  try {
+    const census = buildCensus(maskedDirs, repliesDirs);
+    assert.equal(census.distinct, 21);
+    assert.equal(census.matched, 20);
+    assert.equal(census.unmatched, 1);
+  } finally {
+    fs.rmSync(root, { recursive: true, force: true });
+  }
+});
+
+test('listMarkdown refuses a path that is not a directory', () => {
+  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-test-'));
+  try {
+    assert.throws(() => listMarkdown(path.join(root, 'missing')), /not a directory/);
+  } finally {
+    fs.rmSync(root, { recursive: true, force: true });
+  }
+});
+
+test('levelOfScore reads 0 as absent, 1 as fully met and a value between as partly met', () => {
+  assert.equal(levelOfScore(0), 'absent');
+  assert.equal(levelOfScore(1), 'fully met');
+  assert.equal(levelOfScore(0.4), 'partly met');
+  assert.deepEqual(baselineLevels({ a: 0, b: 0.5, c: 1 }, ['a', 'b', 'c']), { a: 'absent', b: 'partly met', c: 'fully met' });
+});
+
+test('levelOfScore returns null outside the scale or without a number', () => {
+  for (const value of [-0.1, 1.5, NaN, '1', undefined]) assert.equal(levelOfScore(value), null);
+});
+
+const listJudgeTmpDirs = () =>
+  fs
+    .readdirSync(os.tmpdir())
+    .filter((name) => name.startsWith('judge-agreement-') && !name.startsWith('judge-agreement-test-'))
+    .sort();
+
+test('runBaseline maps every reply file to its dimension scores and leaves no temp dir', () => {
+  const { root, repliesDirs } = makeFixture();
+  try {
+    const before = listJudgeTmpDirs();
+    const scores = runBaseline(repliesDirs);
+    assert.equal(scores.size, 21);
+    const expectedKeys = [
+      'answer-position', 'next-action-honesty', 'receipts', 'tone',
+      'tangent-suppression', 'completeness-under-cap', 'mechanical-tells',
+    ].sort();
+    for (const value of scores.values()) assert.deepEqual(Object.keys(value).sort(), expectedKeys);
+    assert.deepEqual(listJudgeTmpDirs(), before);
+  } finally {
+    fs.rmSync(root, { recursive: true, force: true });
+  }
+});
+
+test('runBaseline stands in for a missing and an empty reply and still scores the rest', () => {
+  const { root, repliesDirs } = makeFixture();
+  try {
+    fs.rmSync(path.join(repliesDirs[0], 'C1.md'));
+    fs.writeFileSync(path.join(repliesDirs[0], 'C2.md'), '');
+    const scores = runBaseline([repliesDirs[0]]);
+    assert.equal(scores.size, 5);
+    assert.ok(!scores.has(path.resolve(repliesDirs[0], 'C1.md')));
+    assert.ok(!scores.has(path.resolve(repliesDirs[0], 'C2.md')));
+  } finally {
+    fs.rmSync(root, { recursive: true, force: true });
+  }
+});
+
+test('runBaseline throws when score.mjs fails on a replies dir', () => {
+  const { root, repliesDirs } = makeFixture();
+  try {
+    fs.writeFileSync(path.join(repliesDirs[0], 'C3.meta.json'), '{not json');
+    assert.throws(() => runBaseline([repliesDirs[0]]), /score\.mjs failed on/);
+  } finally {
+    fs.rmSync(root, { recursive: true, force: true });
+  }
+});
+
+const ids = loadRubric().map((d) => d.id);
+
+const all = (level) => Object.fromEntries(ids.map((id) => [id, level]));
+
+test('parseLabels numbers a row by its 1-based line and skips the empty ones', () => {
+  const rows = parseLabels('\n' + JSON.stringify({ masked: 'x.md', grades: all('absent') }), ids);
+  assert.equal(rows.length, 1);
+  assert.equal(rows[0].row, 2);
+  assert.equal(rows[0].masked, 'x.md');
+});
+
+test('parseLabels names the first missing dimension', () => {
+  const grades = all('absent');
+  delete grades.tone;
+  assert.throws(() => parseLabels(JSON.stringify({ masked: 'x.md', grades }), ids), /labels row 1: missing dimension tone/);
+});
+
+test('parseLabels rejects a grade outside the three levels', () => {
+  assert.throws(
+    () => parseLabels(JSON.stringify({ masked: 'x.md', grades: { ...all('absent'), tone: 'mostly' } }), ids),
+    /tone must be absent, partly met or fully met/,
+  );
+});
+
+test('joinLabels keys one entry per reply SHA and reports a grade conflict', () => {
+  const { root, repliesDirs, maskedDirs } = makeFixture();
+  try {
+    const census = buildCensus(maskedDirs, repliesDirs);
+    const rows = [
+      { row: 1, masked: path.join(maskedDirs[0], 'C1-B.md'), grades: all('absent') },
+      { row: 2, masked: path.join(maskedDirs[1], 'C1-A.md'), grades: all('absent') },
+    ];
+    const joined = joinLabels(rows, census, '/');
+    assert.equal(joined.labeled.size, 1);
+    assert.equal(joined.unmatchedRows, 0);
+    assert.equal(joined.conflict, null);
+    const conflicting = joinLabels([rows[0], { ...rows[1], grades: { ...all('absent'), tone: 'fully met' } }], census, '/');
+    assert.match(conflicting.conflict, /rows 1 and 2 grade the same reply differently/);
+  } finally {
+    fs.rmSync(root, { recursive: true, force: true });
+  }
+});
+
+test('joinLabels skips a graded reply edited after masking and refuses a path outside the census', () => {
+  const { root, repliesDirs, maskedDirs } = makeFixture({ editOneAfterMasking: true });
+  try {
+    const census = buildCensus(maskedDirs, repliesDirs);
+    const joined = joinLabels([{ row: 1, masked: path.join(maskedDirs[1], 'C1-B.md'), grades: all('absent') }], census, '/');
+    assert.equal(joined.labeled.size, 0);
+    assert.equal(joined.unmatchedRows, 1);
+    assert.throws(
+      () => joinLabels([{ row: 1, masked: path.join(root, 'missing.md'), grades: all('absent') }], census, '/'),
+      /masked file is not in the census/,
+    );
+  } finally {
+    fs.rmSync(root, { recursive: true, force: true });
+  }
+});
+
+const synthetic = (n, agreeing) => {
+  const baseline = new Map();
+  const labeled = new Map();
+  for (let i = 0; i < n; i++) {
+    const sha = `sha${i}`;
+    baseline.set(sha, all('fully met'));
+    labeled.set(sha, { grades: Object.fromEntries(ids.map((id, index) => [id, index < agreeing ? 'fully met' : 'absent'])) });
+  }
+  return { ids, baseline, labeled };
+};
+
+test('summaryLines stops below the label gate', () => {
+  const { ids: dimensionIds, baseline, labeled } = synthetic(19, 3);
+  const summary = summaryLines({
+    census: { masked: 1, distinct: 1, matched: 1, unmatched: 0 },
+    dimensionIds,
+    questionsSha: 'q',
+    baseline,
+    labelsInfo: { rows: 19, sha256: 'h', unmatchedRows: 0 },
+    labeled,
+  });
+  assert.equal(summary.gate, 'stop');
+  assert.equal(summary.lines.at(-1), 'stop: fewer than 20 labeled replies');
+});
+
+test('summaryLines plans the arm calls and reports agreement above the gate', () => {
+  const { ids: dimensionIds, baseline, labeled } = synthetic(20, 3);
+  const summary = summaryLines({
+    census: { masked: 1, distinct: 1, matched: 1, unmatched: 0 },
+    dimensionIds,
+    questionsSha: 'q',
+    baseline,
+    labelsInfo: { rows: 20, sha256: 'h', unmatchedRows: 0 },
+    labeled,
+  });
+  assert.equal(summary.gate, 'planned');
+  assert.equal(summary.lines.at(-1), 'planned calls: deem=140 jev=421');
+  assert.ok(summary.lines.includes('baseline agreement: 60/140 = 0.4286'));
+  assert.ok(summary.lines.includes('baseline agreement tone: 0/20'));
+  assert.equal(summary.lines.at(-2), POWER_LINE);
+});
+
+test('summaryLines refuses headroom when the baseline already agrees', () => {
+  const { ids: dimensionIds, baseline, labeled } = synthetic(20, 7);
+  const summary = summaryLines({
+    census: { masked: 1, distinct: 1, matched: 1, unmatched: 0 },
+    dimensionIds,
+    questionsSha: 'q',
+    baseline,
+    labelsInfo: { rows: 20, sha256: 'h', unmatchedRows: 0 },
+    labeled,
+  });
+  assert.equal(summary.gate, 'no headroom');
+  assert.equal(summary.lines.at(-1), 'no headroom');
+});
+
+test('the stub jev answers --version and logs the call, and cli-deem health exits 3', () => {
+  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-test-'));
+  try {
+    makeStubBin(root);
+    const version = spawnSync('jev', ['--version'], { env: stubEnv(root), encoding: 'utf8' });
+    assert.equal(version.status, 0);
+    assert.equal(version.stdout, 'jev 0.6.2\n');
+    const log = readStubLog(root);
+    assert.equal(log.length, 1);
+    assert.ok(log[0].startsWith('jev\t--version'));
+    const health = spawnSync('cli-deem', ['health'], { env: stubEnv(root, { STUB_HEALTH: 'stub' }), encoding: 'utf8' });
+    assert.equal(health.status, 3);
+  } finally {
+    fs.rmSync(root, { recursive: true, force: true });
+  }
+});
+
+test('the stub scores the same state 2, then 2, then 0 from the answers table', () => {
+  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-test-'));
+  try {
+    makeStubBin(root);
+    const answersPath = path.join(root, 'answers.json');
+    fs.writeFileSync(answersPath, JSON.stringify({ [`${sha256Hex('state')}|Q`]: [2, 2, 0] }));
+    const env = stubEnv(root, { STUB_ANSWERS: answersPath });
+    const scores = [];
+    for (let i = 0; i < 3; i++) {
+      const run = spawnSync('jev', ['score', '--provider', 'official', '-q', 'Q', '-l', 'a', '-l', 'b', '-l', 'c'], { env, input: 'state', encoding: 'utf8' });
+      scores.push(JSON.parse(run.stdout).answers.answer.score);
+    }
+    assert.deepEqual(scores, [2, 2, 0]);
+  } finally {
+    fs.rmSync(root, { recursive: true, force: true });
+  }
+});
+
+test('main prints the census report and the label gate stop on the default run', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const entriesBefore = fs.readdirSync(fixture.root).sort();
+    const { code, lines } = await run(
+      [
+        '--masked', fixture.maskedDirs[0],
+        '--masked', fixture.maskedDirs[1],
+        '--replies', fixture.repliesDirs[0],
+        '--replies', fixture.repliesDirs[1],
+        '--replies', fixture.repliesDirs[2],
+      ],
+      stubEnv(fixture.root),
+    );
+    assert.equal(code, 0);
+    assert.deepEqual(lines.slice(0, 4), ['masked: 28', 'distinct: 21', 'matched: 21', 'unmatched: 0']);
+    assert.ok(lines.includes('labels: none'));
+    assert.ok(lines.includes('labeled: 0'));
+    assert.equal(lines.at(-1), 'stop: fewer than 20 labeled replies');
+    assert.deepEqual(readStubLog(fixture.root), []);
+    assert.deepEqual(fs.readdirSync(fixture.root).sort(), entriesBefore);
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('main keeps an empty reply out of the baseline and still reports the census', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    fs.writeFileSync(path.join(fixture.repliesDirs[0], 'C1.md'), '\n');
+    fs.writeFileSync(path.join(fixture.maskedDirs[0], 'C1-A.md'), 'Case: C1\n\nPrompt for C1\n\nReply A:\n\n\n');
+    const { code, lines } = await run(
+      [
+        '--masked', fixture.maskedDirs[0],
+        '--masked', fixture.maskedDirs[1],
+        '--replies', fixture.repliesDirs[0],
+        '--replies', fixture.repliesDirs[1],
+        '--replies', fixture.repliesDirs[2],
+      ],
+      stubEnv(fixture.root),
+    );
+    assert.equal(code, 0);
+    assert.ok(lines.includes('matched: 21'));
+    assert.ok(lines.includes('no baseline: 1'));
+    assert.equal(lines.at(-1), 'stop: fewer than 20 labeled replies');
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('main refuses --deem without --out before reading any file', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const { code, lines, errors } = await run(
+      [
+        '--masked', fixture.maskedDirs[0],
+        '--masked', fixture.maskedDirs[1],
+        '--replies', fixture.repliesDirs[0],
+        '--replies', fixture.repliesDirs[1],
+        '--replies', fixture.repliesDirs[2],
+        '--deem',
+      ],
+      stubEnv(fixture.root),
+    );
+    assert.equal(code, 2);
+    assert.deepEqual(lines, []);
+    assert.ok(errors.includes('--deem and --jev need --out <dir> so every call is recorded'));
+    assert.deepEqual(readStubLog(fixture.root), []);
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('main prints the deem health line and skips the arm at the label gate', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const argv = [
+      '--masked', fixture.maskedDirs[0],
+      '--masked', fixture.maskedDirs[1],
+      '--replies', fixture.repliesDirs[0],
+      '--replies', fixture.repliesDirs[1],
+      '--replies', fixture.repliesDirs[2],
+    ];
+    const base = await run(argv, stubEnv(fixture.root));
+    const { code, lines } = await run([...argv, '--deem', '--out', path.join(fixture.root, 'out')], stubEnv(fixture.root));
+    assert.equal(code, 0);
+    assert.deepEqual(lines, [
+      ...base.lines,
+      'deem: health backend=torch model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource',
+      'deem arm skipped: label gate',
+    ]);
+    const log = readStubLog(fixture.root);
+    assert.equal(log.length, 1);
+    assert.ok(log[0].startsWith('cli-deem\thealth'));
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('main skips the deem arm when the health check reports a stub backend', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const argv = [
+      '--masked', fixture.maskedDirs[0],
+      '--masked', fixture.maskedDirs[1],
+      '--replies', fixture.repliesDirs[0],
+      '--replies', fixture.repliesDirs[1],
+      '--replies', fixture.repliesDirs[2],
+    ];
+    const env = stubEnv(fixture.root, { STUB_HEALTH: 'stub' });
+    const base = await run(argv, env);
+    const { code, lines } = await run([...argv, '--deem', '--out', path.join(fixture.root, 'out')], env);
+    assert.equal(code, 0);
+    assert.deepEqual(lines, [...base.lines, 'deem arm skipped: stub backend']);
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('main reports a labels row that drops a dimension', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const grades = all('absent');
+    delete grades.tone;
+    const labelsPath = path.join(fixture.root, 'labels.jsonl');
+    fs.writeFileSync(labelsPath, `${JSON.stringify({ masked: path.join(fixture.maskedDirs[0], 'C1-A.md'), grades })}\n`);
+    const { code, lines, errors } = await run(
+      [
+        '--masked', fixture.maskedDirs[0],
+        '--masked', fixture.maskedDirs[1],
+        '--replies', fixture.repliesDirs[0],
+        '--replies', fixture.repliesDirs[1],
+        '--replies', fixture.repliesDirs[2],
+        '--labels', labelsPath,
+      ],
+      stubEnv(fixture.root),
+    );
+    assert.equal(code, 2);
+    assert.deepEqual(lines, []);
+    assert.match(errors.join('\n'), /labels row 1: missing dimension tone/);
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('main stops on a label conflict between two rows grading one reply', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const grades = all('absent');
+    const labelsPath = path.join(fixture.root, 'labels.jsonl');
+    fs.writeFileSync(
+      labelsPath,
+      [
+        JSON.stringify({ masked: path.join(fixture.maskedDirs[0], 'C1-B.md'), grades }),
+        JSON.stringify({ masked: path.join(fixture.maskedDirs[1], 'C1-A.md'), grades: { ...grades, tone: 'fully met' } }),
+      ].join('\n') + '\n',
+    );
+    const { code, lines } = await run(
+      [
+        '--masked', fixture.maskedDirs[0],
+        '--masked', fixture.maskedDirs[1],
+        '--replies', fixture.repliesDirs[0],
+        '--replies', fixture.repliesDirs[1],
+        '--replies', fixture.repliesDirs[2],
+        '--labels', labelsPath,
+      ],
+      stubEnv(fixture.root),
+    );
+    assert.equal(code, 2);
+    assert.deepEqual(lines, ['stop: label conflict']);
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('the script exits 2 with usage on stderr when --replies is missing', () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const script = fileURLToPath(new URL('./judge-agreement.mjs', import.meta.url));
+    const result = spawnSync(process.execPath, [script, '--masked', fixture.maskedDirs[0]], {
+      env: stubEnv(fixture.root),
+      encoding: 'utf8',
+    });
+    assert.equal(result.status, 2);
+    assert.match(result.stderr, /usage:/);
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('binomialTail sums the exact upper tail and flags p below 0.05', () => {
+  assert.deepEqual(binomialTail(5, 5), { p: 0.03125, below: true });
+  assert.deepEqual(binomialTail(4, 4), { p: 0.0625, below: false });
+  assert.deepEqual(binomialTail(0, 0), { p: 1, below: false });
+  assert.deepEqual(binomialTail(0, 3), { p: 1, below: false });
+});
+
+test('modalLevel names the level over half the reruns and the unstable three-way split', () => {
+  assert.deepEqual(modalLevel(['absent', 'absent', 'fully met']), { level: 'absent', top: 2 });
+  assert.deepEqual(modalLevel(['absent', 'partly met', 'fully met']), { level: null, top: 1 });
+  assert.deepEqual(modalLevel(['partly met']), { level: 'partly met', top: 1 });
+});
+
+test('decideVerdict stops at the first failed check in keep-rule order', () => {
+  assert.equal(decideVerdict({ backend: 'deem', K: 20, M: 17, A: 119, B: 51, W: 17, L: 0, F: 0 }).verdict, 'stop (coverage)');
+  assert.equal(decideVerdict({ backend: 'deem', K: 20, M: 20, A: 0, B: 60, W: 0, L: 20, F: 0 }).verdict, 'kill');
+  assert.equal(decideVerdict({ backend: 'deem', K: 20, M: 20, A: 60, B: 60, W: 0, L: 0, F: 0 }).verdict, 'stop (margin)');
+  assert.equal(decideVerdict({ backend: 'deem', K: 20, M: 20, A: 140, B: 60, W: 4, L: 0, F: 0 }).verdict, 'stop (sign test)');
+  assert.equal(decideVerdict({ backend: 'jev', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, F: 100 }).verdict, 'stop (flips)');
+  assert.equal(decideVerdict({ backend: 'jev', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, F: 42 }).verdict, 'keep');
+  assert.equal(decideVerdict({ backend: 'deem', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, F: 0 }).verdict, 'keep');
+});
+
+test('summarizeColumn counts column and baseline hits and prints the verdict line', () => {
+  const labeled = new Map();
+  const baseline = new Map();
+  const answers = new Map();
+  for (let i = 0; i < 20; i++) {
+    const sha = `sha${i}`;
+    labeled.set(sha, { grades: all('fully met') });
+    baseline.set(sha, Object.fromEntries(ids.map((id, index) => [id, index < 3 ? 'fully met' : 'absent'])));
+    answers.set(sha, Object.fromEntries(ids.map((id) => [id, ['fully met']])));
+  }
+  const summary = summarizeColumn({ backend: 'deem', labeled, baseline, answers, dimensionIds: ids, reruns: 1 });
+  assert.equal(summary.A, 140);
+  assert.equal(summary.B, 60);
+  assert.equal(summary.W, 20);
+  assert.equal(summary.L, 0);
+  assert.equal(summary.verdict, 'keep');
+  const line = verdictLine(summary, 'abc', 'model=m');
+  assert.ok(line.startsWith('verdict deem: keep K=20 M=20 A=140 B=60 W=20 L=0 F=n/a p_win='));
+  assert.ok(line.endsWith(' labels_sha256=abc model=m'));
+});
+
+test('parseScoreAnswer rounds a fractional score to the nearest level and rejects anything off the scale', () => {
+  assert.equal(parseScoreAnswer('{"answers":{"answer":{"score":1.4}}}'), 1);
+  assert.equal(parseScoreAnswer('{"answers":{"answer":{"score":1.5}}}'), 2);
+  assert.equal(parseScoreAnswer('{"answers":{"answer":{"score":0}}}'), 0);
+  assert.equal(parseScoreAnswer('{"answers":{"answer":{"score":2.2}}}'), null);
+  assert.equal(parseScoreAnswer('{"answers":{"answer":{"score":-0.1}}}'), null);
+  assert.equal(parseScoreAnswer('not json'), null);
+  assert.equal(parseScoreAnswer('{}'), null);
+});
+
+test('createCallLog keeps no record without an out dir and writes one line per call with one', () => {
+  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-test-'));
+  try {
+    createCallLog(undefined).append({ a: 1 });
+    assert.deepEqual(fs.readdirSync(d), []);
+    const log = createCallLog(path.join(d, 'out'));
+    log.append({ a: 1 });
+    log.append({ a: 1 });
+    const lines = fs.readFileSync(path.join(d, 'out', 'calls.jsonl'), 'utf8').split('\n').filter((line) => line.length > 0);
+    assert.deepEqual(lines, ['{"a":1}', '{"a":1}']);
+    assert.equal(readStoredReport(path.join(d, 'none')), null);
+  } finally {
+    fs.rmSync(d, { recursive: true, force: true });
+  }
+});
+
+test('spawnCall pipes stdin to stdout, closes a child that overruns the timeout and reports both', async () => {
+  const echoed = await spawnCall(process.execPath, ['-e', 'process.stdin.pipe(process.stdout)'], 'hi', process.env, 5000);
+  assert.equal(echoed.code, 0);
+  assert.equal(echoed.stdout, 'hi');
+  assert.equal(echoed.timedOut, false);
+  const stalled = await spawnCall(process.execPath, ['-e', 'setTimeout(() => {}, 5000)'], '', process.env, 200);
+  assert.equal(stalled.timedOut, true);
+});
+
+// Grades copy the baseline on the first three dimensions and rotate one level on the
+// rest, so one stub answer table can drive every agreement shape the arm reports.
+const scenario = (fixture, pick) => {
+  const dims = loadRubric();
+  const dimensionIds = dims.map((dimension) => dimension.id);
+  const census = buildCensus(fixture.maskedDirs, fixture.repliesDirs);
+  const scores = runBaseline(fixture.repliesDirs);
+  const rows = [];
+  const answers = {};
+  const seen = new Set();
+  for (const maskedFile of census.maskedFiles) {
+    const reply = census.replyBySha.get(maskedFile.sha);
+    if (reply === undefined || seen.has(maskedFile.sha)) continue;
+    seen.add(maskedFile.sha);
+    const base = baselineLevels(scores.get(reply.file), dimensionIds);
+    const grades = {};
+    dims.forEach((dimension, index) => {
+      grades[dimension.id] = index < 3 ? base[dimension.id] : LEVELS[(LEVELS.indexOf(base[dimension.id]) + 1) % 3];
+    });
+    rows.push(JSON.stringify({ masked: maskedFile.file, grades }));
+    for (const dimension of dims) {
+      answers[`${sha256Hex(maskedFile.text)}|${dimension.judgeGuidance}`] = pick(LEVELS.indexOf(grades[dimension.id]), LEVELS.indexOf(base[dimension.id]));
+    }
+  }
+  const labelsPath = path.join(fixture.root, 'labels.jsonl');
+  const answersPath = path.join(fixture.root, 'answers.json');
+  fs.writeFileSync(labelsPath, `${rows.join('\n')}\n`);
+  fs.writeFileSync(answersPath, JSON.stringify(answers));
+  return { labelsPath, answersPath };
+};
+
+const third = (g, b) => [0, 1, 2].find((i) => i !== g && i !== b);
+
+test('the deem arm measures every reply and dimension and the report keeps the column', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const { labelsPath, answersPath } = scenario(fixture, (g) => g);
+    const outDir = path.join(fixture.root, 'out');
+    const { code, lines } = await run(
+      [
+        '--masked', fixture.maskedDirs[0],
+        '--masked', fixture.maskedDirs[1],
+        '--replies', fixture.repliesDirs[0],
+        '--replies', fixture.repliesDirs[1],
+        '--replies', fixture.repliesDirs[2],
+        '--labels', labelsPath,
+        '--deem',
+        '--out', outDir,
+      ],
+      stubEnv(fixture.root, { STUB_ANSWERS: answersPath }),
+    );
+    assert.equal(code, 0);
+    const last = lines.at(-1);
+    assert.ok(last.startsWith('verdict deem: keep K=21 M=21 A=147 B=63 W=21 L=0 F=n/a'));
+    assert.ok(last.endsWith('model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource'));
+    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').split('\n').filter((line) => line.length > 0);
+    assert.equal(calls.length, 147);
+    for (const line of calls) {
+      const record = JSON.parse(line);
+      assert.equal(typeof record.wallMs, 'number');
+      assert.equal(typeof record.exitCode, 'number');
+      assert.equal(record.modelId, 'deem-0.8-v1');
+      assert.equal(record.modelCommit, 'stubmodel');
+      assert.equal(record.sourceCommit, 'stubsource');
+    }
+    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
+    assert.equal(report.columns.deem.verdict, 'keep');
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('the deem arm stops on the margin when the column repeats the baseline', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const { labelsPath, answersPath } = scenario(fixture, (g, b) => b);
+    const outDir = path.join(fixture.root, 'out');
+    const { code, lines } = await run(
+      [
+        '--masked', fixture.maskedDirs[0],
+        '--masked', fixture.maskedDirs[1],
+        '--replies', fixture.repliesDirs[0],
+        '--replies', fixture.repliesDirs[1],
+        '--replies', fixture.repliesDirs[2],
+        '--labels', labelsPath,
+        '--deem',
+        '--out', outDir,
+      ],
+      stubEnv(fixture.root, { STUB_ANSWERS: answersPath }),
+    );
+    assert.equal(code, 0);
+    assert.ok(lines.at(-1).startsWith('verdict deem: stop (margin) K=21 M=21 A=63 B=63 W=0 L=0'));
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('the deem arm kills a column that matches neither the grades nor the baseline', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const { labelsPath, answersPath } = scenario(fixture, third);
+    const outDir = path.join(fixture.root, 'out');
+    const { code, lines } = await run(
+      [
+        '--masked', fixture.maskedDirs[0],
+        '--masked', fixture.maskedDirs[1],
+        '--replies', fixture.repliesDirs[0],
+        '--replies', fixture.repliesDirs[1],
+        '--replies', fixture.repliesDirs[2],
+        '--labels', labelsPath,
+        '--deem',
+        '--out', outDir,
+      ],
+      stubEnv(fixture.root, { STUB_ANSWERS: answersPath }),
+    );
+    assert.equal(code, 0);
+    assert.ok(lines.at(-1).startsWith('verdict deem: kill K=21 M=21 A=0 B=63 W=0 L=21'));
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('the deem arm reports a coverage stop when every score call exits 1', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const { labelsPath, answersPath } = scenario(fixture, (g) => g);
+    const outDir = path.join(fixture.root, 'out');
+    const { code, lines } = await run(
+      [
+        '--masked', fixture.maskedDirs[0],
+        '--masked', fixture.maskedDirs[1],
+        '--replies', fixture.repliesDirs[0],
+        '--replies', fixture.repliesDirs[1],
+        '--replies', fixture.repliesDirs[2],
+        '--labels', labelsPath,
+        '--deem',
+        '--out', outDir,
+      ],
+      stubEnv(fixture.root, { STUB_ANSWERS: answersPath, STUB_SCORE_EXIT: '1' }),
+    );
+    assert.equal(code, 0);
+    assert.ok(lines.at(-1).startsWith('verdict deem: stop (coverage) K=21 M=0'));
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('main prints the jev identity line and skips the arm without a credential', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const argv = [
+      '--masked', fixture.maskedDirs[0],
+      '--masked', fixture.maskedDirs[1],
+      '--replies', fixture.repliesDirs[0],
+      '--replies', fixture.repliesDirs[1],
+      '--replies', fixture.repliesDirs[2],
+    ];
+    const env = stubEnv(fixture.root, { STUB_AUTH_STATUS_EXIT: '3' });
+    const base = await run(argv, env);
+    const { code, lines } = await run([...argv, '--jev', '--out', path.join(fixture.root, 'out')], env);
+    assert.equal(code, 0);
+    assert.deepEqual(lines, [
+      ...base.lines,
+      `jev: path=${path.join(fixture.root, 'bin', 'jev')} provider=official`,
+      'jev arm skipped: no credential',
+    ]);
+    assert.deepEqual(
+      readStubLog(fixture.root).map((line) => line.split('\t').slice(0, 2)),
+      [['jev', '--version'], ['jev', 'auth status --provider official']],
+    );
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('main takes --accept-payload for an untracked masked dir and still stops at the label gate', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const argv = [
+      '--masked', fixture.maskedDirs[0],
+      '--masked', fixture.maskedDirs[1],
+      '--replies', fixture.repliesDirs[0],
+      '--replies', fixture.repliesDirs[1],
+      '--replies', fixture.repliesDirs[2],
+    ];
+    const env = stubEnv(fixture.root);
+    const base = await run(argv, env);
+    const { code, lines } = await run([...argv, '--jev', '--accept-payload', '--out', path.join(fixture.root, 'out')], env);
+    assert.equal(code, 0);
+    assert.deepEqual(lines.slice(0, -2), base.lines);
+    assert.deepEqual(lines.slice(-2), [
+      `jev: path=${path.join(fixture.root, 'bin', 'jev')} provider=official`,
+      'jev arm skipped: label gate',
+    ]);
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('main refuses an untracked payload without --accept-payload and still runs the deem arm', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const { labelsPath, answersPath } = scenario(fixture, (g) => g);
+    const { code, lines } = await run(
+      [
+        '--masked', fixture.maskedDirs[0],
+        '--masked', fixture.maskedDirs[1],
+        '--replies', fixture.repliesDirs[0],
+        '--replies', fixture.repliesDirs[1],
+        '--replies', fixture.repliesDirs[2],
+        '--labels', labelsPath,
+        '--jev',
+        '--deem',
+        '--out', path.join(fixture.root, 'out'),
+      ],
+      stubEnv(fixture.root, { STUB_ANSWERS: answersPath }),
+    );
+    assert.equal(code, 0);
+    assert.ok(lines.includes('jev arm skipped: payload not accepted'));
+    assert.ok(lines.at(-1).startsWith('verdict deem: keep'));
+    assert.ok(readStubLog(fixture.root).every((line) => !line.startsWith('jev\tscore')));
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('payloadClass reads an untracked masked reply as needing --accept-payload', () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const census = buildCensus(fixture.maskedDirs, fixture.repliesDirs);
+    assert.equal(payloadClass(census.maskedFiles), 'untracked masked replies');
+    assert.equal(payloadClass([{ file: fileURLToPath(new URL('./score.mjs', import.meta.url)) }]), 'committed masked replies');
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
+
+test('the jev arm reruns every score three times and stops on the flips', async () => {
+  const fixture = makeFixture();
+  try {
+    makeStubBin(fixture.root);
+    const { labelsPath, answersPath } = scenario(fixture, (g, b) => [g, g, third(g, b)]);
+    const outDir = path.join(fixture.root, 'out');
+    const { code, lines } = await run(
+      [
+        '--masked', fixture.maskedDirs[0],
+        '--masked', fixture.maskedDirs[1],
+        '--replies', fixture.repliesDirs[0],
+        '--replies', fixture.repliesDirs[1],
+        '--replies', fixture.repliesDirs[2],
+        '--labels', labelsPath,
+        '--jev',
+        '--accept-payload',
+        '--out', outDir,
+      ],
+      stubEnv(fixture.root, { STUB_ANSWERS: answersPath }),
+    );
+    assert.equal(code, 0);
+    const last = lines.at(-1);
+    assert.ok(last.startsWith('verdict jev: stop (flips) K=21 M=21 A=147 B=63 W=21 L=0 F=147'));
+    assert.ok(last.endsWith('jev_version=0.6.2 provider=official model=stub-model'));
+    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').split('\n').filter((line) => line.length > 0);
+    assert.equal(calls.length, 442);
+    for (const line of readStubLog(fixture.root)) {
+      const [name, args] = line.split('\t');
+      if (name !== 'jev' || args === '--version') continue;
+      assert.ok(args.includes('--provider official'));
+    }
+  } finally {
+    fs.rmSync(fixture.root, { recursive: true, force: true });
+  }
+});
```
