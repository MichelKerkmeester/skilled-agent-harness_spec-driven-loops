# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (DeepSeek V4.1 Flash). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`
- `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/scratch/w4-build/design.md`, `specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/scratch/w4-build/rulings.md` (rulings override the design) and `specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/scratch/w4-session/notes.md` (the session's runs; there is no build-evidence.md). This review covers the code only; the docs are reviewed separately. Every code step, including the session's fix briefs, was written by DeepSeek; review the whole of both files. And the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
diff --git a/.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs b/.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs
new file mode 100644
index 0000000000..8b5b9bcc75
--- /dev/null
+++ b/.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs
@@ -0,0 +1,1706 @@
+#!/usr/bin/env node
+// ───────────────────────────────────────────────────────────────────
+// MODULE: Citation Drift Scan
+// ───────────────────────────────────────────────────────────────────
+// Measures whether a sentence's citation still points at the code window it
+// claims. The default run prints the census and makes no model call, reads no
+// credential and writes no file.
+//
+// Usage:
+//   node cite-drift-scan.mjs [--draw --seed <n>] [--jev] [--deem] [--out <dir>] [--labels <file>]
+//
+// Exit codes: 0 = report printed, a skipped or stopped arm included; 2 = bad
+// invocation or unreadable input, refused before any call.
+// ───────────────────────────────────────────────────────────────────
+
+import { spawn, spawnSync } from 'node:child_process';
+import { createHash } from 'node:crypto';
+import fs from 'node:fs';
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
+/** Repository root five levels above this shared script. */
+export const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..', '..', '..', '..');
+
+/** This skill's root, two levels above the script. */
+export const SKILL_ROOT = path.resolve(SCRIPT_DIR, '..', '..');
+
+/** Default labels file beside the script; only --draw writes it. */
+export const LABELS_PATH = path.join(SCRIPT_DIR, 'cite-drift-labels.jsonl');
+
+/** Tracked-file citation with an optional inclusive line range. */
+export const CITATION_RE = /(?<![\w./-])([A-Za-z0-9_./-]+\.(?:ts|cjs|mjs|js|py|md|json|sh)):(\d+)(?:-(\d+))?/g;
+
+/** Opening or closing line of a fenced block; fenced lines carry no prose. */
+export const FENCE_RE = /^\s*(?:```|~~~)/;
+
+/** Usage line printed when an invocation misses an input. */
+export const USAGE = 'usage: node cite-drift-scan.mjs [--draw --seed <n>] [--jev] [--deem] [--out <dir>] [--labels <file>]';
+
+// A large tree's `git ls-files -z` output runs far past Node's 1 MB default.
+const GIT_MAX_BUFFER = 268435456;
+
+/** Live rows an operator labels; the rest of the draw is construction-labeled. */
+export const LIVE_ROWS = 20;
+
+/** Constructed rows, each a citation whose window moved down its own file. */
+export const CONSTRUCTED_ROWS = 20;
+
+/** Lines a constructed window moves past the cited line. */
+export const CONSTRUCT_OFFSET_LINES = 60;
+
+/** Minimum distance between a constructed window's centre and the cited line. */
+export const CONSTRUCT_MIN_GAP_LINES = 20;
+
+/** A target shorter than this cannot hold a clearly separate window. */
+export const CONSTRUCT_MIN_FILE_LINES = 80;
+
+/** Half-width, in lines, of the window a row records. */
+export const WINDOW_RADIUS_LINES = 10;
+
+/** Rows carrying a verdict that the label gate needs before scoring. */
+export const LABEL_GATE = 40;
+
+/** A model probability at or above this reads as a flagged, drifted window. */
+export const FLAG_THRESHOLD = 0.5;
+
+/** Bounds one model call; a spawn past this is unmeasured, not an answer. */
+export const CALL_TIMEOUT_MS = 90000;
+
+/** The 10-point gain over the baseline that the keep rule requires. */
+export const MARGIN_LINE = 'margin: 0.10';
+
+/** Every keep-rule check in its order, restated for the report reader. */
+export const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, then precision 5*TP >= 4*(TP+FP) with TP+FP >= 1, then margin 10*(A-B) >= M, then sign test p < 0.05, then for jev flips 10*F <= 3*M';
+
+/** The fixed `-q` text every model call carries, printed before the first call. */
+export const INSTRUCTION = 'Does the cited code window still show what the citing sentence claims?';
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
+ * Full commit id of the repository's HEAD.
+ * @param {string} repoRoot
+ * @returns {string} 40 hex characters.
+ */
+export function headCommit(repoRoot) {
+  const result = spawnSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD'], {
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+    maxBuffer: GIT_MAX_BUFFER,
+  });
+  const commit = (result.stdout ?? '').trim();
+  if (result.error || result.status !== 0 || !/^[0-9a-f]{40}$/.test(commit)) {
+    const reason = (result.stderr ?? '').trim() || result.error?.message || `exit ${result.status}`;
+    throw new Error(`git rev-parse HEAD failed in ${repoRoot}: ${reason}`);
+  }
+  return commit;
+}
+
+/**
+ * Repo-relative paths the index tracks, as `git ls-files -z` reports them.
+ * @param {string} repoRoot
+ * @returns {Set<string>}
+ */
+export function listTrackedFiles(repoRoot) {
+  const result = spawnSync('git', ['-C', repoRoot, 'ls-files', '-z'], {
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+    maxBuffer: GIT_MAX_BUFFER,
+  });
+  if (result.error || result.status !== 0) {
+    const reason = (result.stderr ?? '').trim() || result.error?.message || `exit ${result.status}`;
+    throw new Error(`git ls-files failed in ${repoRoot}: ${reason}`);
+  }
+  return new Set((result.stdout ?? '').split('\0').filter((entry) => entry !== ''));
+}
+
+/**
+ * Citations in the prose of a document: every `path:line` or `path:line-end`
+ * span outside a fenced block, one entry per occurrence in source order. The
+ * sentence is the trimmed line that carries the citation.
+ * @param {string} text
+ * @param {string} doc Repo-relative path of the citing document.
+ * @returns {Array<{ doc: string, line: number, sentence: string, target: string, targetLine: number, targetLineEnd: number|null }>}
+ */
+export function extractCitations(text, doc) {
+  const citations = [];
+  const lines = text.split(/\r?\n/);
+  let inFence = false;
+  for (let index = 0; index < lines.length; index += 1) {
+    const line = lines[index];
+    if (FENCE_RE.test(line)) {
+      inFence = !inFence;
+      continue;
+    }
+    if (inFence) continue;
+    for (const match of line.matchAll(CITATION_RE)) {
+      citations.push({
+        doc,
+        line: index + 1,
+        sentence: line.trim(),
+        target: match[1],
+        targetLine: Number(match[2]),
+        targetLineEnd: match[3] === undefined ? null : Number(match[3]),
+      });
+    }
+  }
+  return citations;
+}
+
+/**
+ * Status of a tracked target. The worktree copy decides missing, and its line
+ * count decides whether the cited line or range fits.
+ * @param {string} repoPath Repo-relative path that the index tracks.
+ * @param {{ targetLine: number, targetLineEnd: number|null }} citation
+ * @param {string} repoRoot
+ * @returns {{ status: 'in_range'|'past_end'|'missing', path: string, endLine: number|null }}
+ */
+function resolveTracked(repoPath, citation, repoRoot) {
+  const endLine = citation.targetLineEnd ?? citation.targetLine;
+  let text;
+  try {
+    text = fs.readFileSync(path.join(repoRoot, repoPath), 'utf8');
+  } catch {
+    return { status: 'missing', path: repoPath, endLine: null };
+  }
+  const lines = text.split(/\r?\n/);
+  const lineCount = text === '' ? 0 : (text.endsWith('\n') ? lines.length - 1 : lines.length);
+  if (citation.targetLine > lineCount || endLine > lineCount) {
+    return { status: 'past_end', path: repoPath, endLine };
+  }
+  return { status: 'in_range', path: repoPath, endLine };
+}
+
+/**
+ * Resolved location of one citation, tested in order: the citing document's own
+ * folder, the repository root, the citing document's skill root, then a unique
+ * basename across the tracked set. Only a tracked path is read, so an untracked
+ * copy is refused rather than opened.
+ * @param {{ doc: string, target: string, targetLine: number, targetLineEnd: number|null }} citation
+ * @param {{ tracked: Set<string>, repoRoot: string, skillRoot?: string|null }} context
+ * @returns {{ status: 'in_range'|'past_end'|'ambiguous'|'unresolved'|'refused'|'missing', path: string|null, endLine: number|null }}
+ */
+export function resolveCitation(citation, { tracked, repoRoot, skillRoot = null }) {
+  const targetBase = path.posix.basename(citation.target);
+  if (targetBase.startsWith('.env')) return { status: 'refused', path: null, endLine: null };
+
+  const candidates = [
+    path.posix.join(path.posix.dirname(citation.doc), citation.target),
+    citation.target,
+  ];
+  if (typeof skillRoot === 'string' && skillRoot !== '') {
+    candidates.push(path.posix.join(skillRoot, citation.target));
+  }
+
+  for (const candidate of candidates) {
+    if (tracked.has(candidate)) return resolveTracked(candidate, citation, repoRoot);
+  }
+
+  const sameBase = [...tracked].filter((entry) => path.posix.basename(entry) === targetBase);
+  if (sameBase.length > 1) return { status: 'ambiguous', path: null, endLine: null };
+  if (sameBase.length === 1) return resolveTracked(sameBase[0], citation, repoRoot);
+
+  for (const candidate of candidates) {
+    if (fs.existsSync(path.join(repoRoot, candidate))) {
+      return { status: 'refused', path: null, endLine: null };
+    }
+  }
+  return { status: 'unresolved', path: null, endLine: null };
+}
+
+/**
+ * Per-skill census over every tracked skill markdown document, read through the
+ * committed tree. Reports citation counts by status, the dead list (missing
+ * plus past_end) and the refused count.
+ * @param {string} repoRoot
+ * @param {Set<string>} tracked
+ * @returns {{
+ *   commit: string,
+ *   perSkill: Array<{ skill: string, citations: number, in_range: number, past_end: number, ambiguous: number, unresolved: number, dead: number }>,
+ *   total: { citations: number, in_range: number, past_end: number, ambiguous: number, unresolved: number, dead: number },
+ *   dead: Array<{ doc: string, line: number, target: string, targetLine: number }>,
+ *   refused: number
+ * }}
+ */
+export function buildCensus(repoRoot, tracked) {
+  const commit = headCommit(repoRoot);
+  const perSkill = new Map();
+  const totals = { citations: 0, in_range: 0, past_end: 0, ambiguous: 0, unresolved: 0, refused: 0, missing: 0 };
+  const dead = [];
+
+  const docs = [...tracked]
+    .filter((entry) => entry.startsWith('.skilled/skills/') && entry.endsWith('.md'))
+    .sort();
+  for (const doc of docs) {
+    const shown = spawnSync('git', ['-C', repoRoot, 'show', `HEAD:${doc}`], {
+      encoding: 'utf8',
+      stdio: ['ignore', 'pipe', 'ignore'],
+      maxBuffer: GIT_MAX_BUFFER,
+    });
+    // A path the index tracks but HEAD does not hold has nothing committed to scan.
+    if (shown.error || shown.status !== 0) continue;
+    const skill = doc.split('/')[2];
+    const counts = perSkill.get(skill)
+      ?? { citations: 0, in_range: 0, past_end: 0, ambiguous: 0, unresolved: 0, refused: 0, missing: 0 };
+    const skillRoot = `.skilled/skills/${skill}`;
+    for (const citation of extractCitations(shown.stdout, doc)) {
+      const { status } = resolveCitation(citation, { tracked, repoRoot, skillRoot });
+      counts.citations += 1;
+      counts[status] += 1;
+      totals.citations += 1;
+      totals[status] += 1;
+      if (status === 'missing' || status === 'past_end') {
+        dead.push({ doc, line: citation.line, target: citation.target, targetLine: citation.targetLine });
+      }
+    }
+    perSkill.set(skill, counts);
+  }
+
+  const project = (counts) => ({
+    citations: counts.citations,
+    in_range: counts.in_range,
+    past_end: counts.past_end,
+    ambiguous: counts.ambiguous,
+    unresolved: counts.unresolved,
+    dead: counts.missing + counts.past_end,
+  });
+
+  return {
+    commit,
+    perSkill: [...perSkill.entries()]
+      .map(([skill, counts]) => ({ skill, ...project(counts) }))
+      .sort((left, right) => (left.skill < right.skill ? -1 : left.skill > right.skill ? 1 : 0)),
+    total: project(totals),
+    dead: [...dead].sort((left, right) => {
+      if (left.doc !== right.doc) return left.doc < right.doc ? -1 : 1;
+      return left.line - right.line;
+    }),
+    refused: totals.refused,
+  };
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 3. DRAW
+// ───────────────────────────────────────────────────────────────────
+
+/**
+ * Every line of one file as the recorded commit holds it, split the way
+ * extractCitations reads documents. Null when the commit does not hold it.
+ * @param {string} repoRoot
+ * @param {string} commit
+ * @param {string} filePath Repo-relative tracked path.
+ * @returns {string[]|null}
+ */
+function readCommittedLines(repoRoot, commit, filePath) {
+  const shown = spawnSync('git', ['-C', repoRoot, 'show', `${commit}:${filePath}`], {
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'ignore'],
+    maxBuffer: GIT_MAX_BUFFER,
+  });
+  if (shown.error || shown.status !== 0) return null;
+  const text = shown.stdout ?? '';
+  if (text === '') return [];
+  const lines = text.split(/\r?\n/);
+  if (lines[lines.length - 1] === '') lines.pop();
+  return lines;
+}
+
+/**
+ * Committed lines `start` to `end`, both inclusive and 1-based, of one file. A
+ * range past the file end yields only the lines that exist.
+ * @param {string} repoRoot
+ * @param {string} commit
+ * @param {string} filePath Repo-relative tracked path.
+ * @param {number} start First line, 1-based.
+ * @param {number} end Last line, inclusive.
+ * @returns {string[]}
+ */
+export function readWindow(repoRoot, commit, filePath, start, end) {
+  const lines = readCommittedLines(repoRoot, commit, filePath);
+  if (lines === null) return [];
+  const first = Math.max(1, start);
+  const last = Math.min(lines.length, end);
+  return first > last ? [] : lines.slice(first - 1, last);
+}
+
+/**
+ * A small seeded PRNG (mulberry32). The same seed replays the same picks, so a
+ * draw can be reproduced without carrying any other state.
+ * @param {number} seed
+ * @returns {() => number} Successive values in [0, 1).
+ */
+function mulberry32(seed) {
+  let state = seed >>> 0;
+  return () => {
+    state = (state + 0x6d2b79f5) >>> 0;
+    let t = state;
+    t = Math.imul(t ^ (t >>> 15), t | 1);
+    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
+    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
+  };
+}
+
+/**
+ * In-range citations of every scanned skill document, grouped by skill, read
+ * through the recorded commit so a later edit cannot move a row.
+ * @param {{ perSkill: Array<{ skill: string }> }} census
+ * @param {string} repoRoot
+ * @param {string} commit
+ * @returns {Map<string, Array<object>>}
+ */
+function inRangePools(census, repoRoot, commit) {
+  const tracked = listTrackedFiles(repoRoot);
+  const pools = new Map(census.perSkill.map((entry) => [entry.skill, []]));
+  const docs = [...tracked]
+    .filter((entry) => entry.startsWith('.skilled/skills/') && entry.endsWith('.md'))
+    .sort();
+  for (const doc of docs) {
+    const skill = doc.split('/')[2];
+    const pool = pools.get(skill);
+    if (pool === undefined) continue;
+    const lines = readCommittedLines(repoRoot, commit, doc);
+    if (lines === null) continue;
+    const skillRoot = `.skilled/skills/${skill}`;
+    for (const citation of extractCitations(lines.join('\n'), doc)) {
+      const { status, path: resolved } = resolveCitation(citation, { tracked, repoRoot, skillRoot });
+      if (status === 'in_range' && resolved !== null) pool.push({ ...citation, path: resolved });
+    }
+  }
+  return pools;
+}
+
+/**
+ * One labels row. It carries no window text, only what locates the window and
+ * lets a later read check that the window still shows the same lines.
+ * @param {object} entry Resolved citation.
+ * @param {'live'|'constructed'} kind
+ * @param {number} windowStart
+ * @param {number} windowEnd
+ * @param {string[]} windowLines
+ * @param {number} ordinal 1-based position within the kind.
+ * @param {string} commit
+ * @returns {object}
+ */
+function drawRow(entry, kind, windowStart, windowEnd, windowLines, ordinal, commit) {
+  return {
+    id: `${kind}-${String(ordinal).padStart(2, '0')}`,
+    doc: entry.doc,
+    doc_line: entry.line,
+    target: entry.path,
+    target_line: entry.targetLine,
+    window_start: windowStart,
+    window_end: windowEnd,
+    commit,
+    claim_sha12: sha256Hex(entry.sentence).slice(0, 12),
+    window_sha12: sha256Hex(windowLines.join('\n')).slice(0, 12),
+    kind,
+    verdict: kind === 'constructed' ? 'contradicts' : null,
+    labeler: kind === 'constructed' ? 'construction' : null,
+  };
+}
+
+/**
+ * The labels rows for one seed: live in-range citations plus the same number of
+ * constructed rows whose window moved down the same file, so a labelled set
+ * holds known-drifted windows beside citations that may still hold. One pick
+ * per skill per pass keeps a large skill from crowding out a smaller one.
+ * @param {{ census: object, repoRoot: string, commit: string, seed: number }} input
+ * @returns {Array<object>}
+ */
+export function drawRows({ census, repoRoot, commit, seed }) {
+  const pools = inRangePools(census, repoRoot, commit);
+  const random = mulberry32(seed);
+  const lineCache = new Map();
+  const linesOf = (filePath) => {
+    if (!lineCache.has(filePath)) lineCache.set(filePath, readCommittedLines(repoRoot, commit, filePath));
+    return lineCache.get(filePath);
+  };
+
+  const passes = (count, build) => {
+    const rows = [];
+    let progressed = true;
+    while (rows.length < count && progressed) {
+      progressed = false;
+      for (const pool of pools.values()) {
+        if (rows.length >= count) break;
+        if (pool.length === 0) continue;
+        const entry = pool.splice(Math.floor(random() * pool.length), 1)[0];
+        progressed = true;
+        const row = build(entry, rows.length + 1);
+        if (row !== null) rows.push(row);
+      }
+    }
+    return rows;
+  };
+
+  const live = passes(LIVE_ROWS, (entry, ordinal) => {
+    const lines = linesOf(entry.path);
+    if (lines === null) return null;
+    const start = Math.max(1, entry.targetLine - WINDOW_RADIUS_LINES);
+    const end = Math.min(lines.length, entry.targetLine + WINDOW_RADIUS_LINES);
+    const windowLines = readWindow(repoRoot, commit, entry.path, start, end);
+    return drawRow(entry, 'live', start, end, windowLines, ordinal, commit);
+  });
+  if (live.length < LIVE_ROWS) throw new Error(`draw: ${live.length} live citations, need ${LIVE_ROWS}`);
+
+  const constructed = passes(CONSTRUCTED_ROWS, (entry, ordinal) => {
+    const lines = linesOf(entry.path);
+    if (lines === null || lines.length < CONSTRUCT_MIN_FILE_LINES) return null;
+    const centre = ((entry.targetLine + CONSTRUCT_OFFSET_LINES - 1) % lines.length) + 1;
+    const direct = Math.abs(centre - entry.targetLine);
+    if (Math.min(direct, lines.length - direct) < CONSTRUCT_MIN_GAP_LINES) return null;
+    const start = Math.max(1, centre - WINDOW_RADIUS_LINES);
+    const end = Math.min(lines.length, centre + WINDOW_RADIUS_LINES);
+    const windowLines = readWindow(repoRoot, commit, entry.path, start, end);
+    return drawRow(entry, 'constructed', start, end, windowLines, ordinal, commit);
+  });
+  if (constructed.length < CONSTRUCTED_ROWS) throw new Error(`draw: ${constructed.length} constructed citations, need ${CONSTRUCTED_ROWS}`);
+
+  return [...live, ...constructed];
+}
+
+/**
+ * Rows from a JSONL labels file. Blank lines are skipped; a malformed row names
+ * its 1-based line so the file can be repaired.
+ * @param {string} text
+ * @returns {Array<object>}
+ */
+export function parseLabels(text) {
+  const rows = [];
+  const lines = text.split(/\r?\n/);
+  for (let index = 0; index < lines.length; index += 1) {
+    const line = lines[index];
+    if (line.trim() === '') continue;
+    let record;
+    try {
+      record = JSON.parse(line);
+    } catch {
+      throw new Error(`labels row ${index + 1}: not JSON`);
+    }
+    if (record === null || typeof record !== 'object' || Array.isArray(record)) {
+      throw new Error(`labels row ${index + 1}: not JSON`);
+    }
+    rows.push(record);
+  }
+  return rows;
+}
+
+/**
+ * Counts the label gate reads: rows carrying a verdict, and the two draw kinds.
+ * Constructed rows carry a verdict from the start, so a fresh draw is halfway to
+ * the gate and the operator's live labels complete it.
+ * @param {Array<{ kind?: string, verdict?: string|null }>} rows
+ * @returns {{ labeled: number, live: number, constructed: number }}
+ */
+export function labelCounts(rows) {
+  let labeled = 0;
+  let live = 0;
+  let constructed = 0;
+  for (const row of rows) {
+    if (row.verdict !== null && row.verdict !== undefined) labeled += 1;
+    if (row.kind === 'live') live += 1;
+    if (row.kind === 'constructed') constructed += 1;
+  }
+  return { labeled, live, constructed };
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 4. COMPARATORS AND LABEL GATE
+// ───────────────────────────────────────────────────────────────────
+
+/**
+ * Code-shaped tokens of a citing sentence: every backticked span split on
+ * non-identifier characters, dropped to two characters or more, with the
+ * target's own basename removed. These are the tokens the identifier-overlap
+ * comparator looks for in the target's window.
+ * @param {string} sentence
+ * @param {string} target Repo-relative target path.
+ * @returns {string[]} Unique tokens in sentence order.
+ */
+export function identifierTokens(sentence, target) {
+  const targetBase = path.posix.basename(target);
+  const tokens = [];
+  for (const match of sentence.matchAll(/`([^`]+)`/g)) {
+    for (const token of match[1].split(/[^A-Za-z0-9_]+/)) {
+      if (token.length < 2 || token === targetBase || tokens.includes(token)) continue;
+      tokens.push(token);
+    }
+  }
+  return tokens;
+}
+
+/**
+ * True when the sentence names at least one code token and the window text
+ * shows none of them, so the window no longer carries an identifier the
+ * sentence cites. A sentence with no such token is never flagged.
+ * @param {string} sentence
+ * @param {string} windowText The target's cited line -10..+10, clamped.
+ * @param {string} target Repo-relative target path.
+ * @returns {boolean}
+ */
+export function flagByIdentifierOverlap(sentence, windowText, target) {
+  const tokens = identifierTokens(sentence, target);
+  return tokens.length > 0 && !tokens.some((token) => windowText.includes(token));
+}
+
+/**
+ * Sentence and window text of every labels row, read at the commit the row
+ * recorded so a later edit cannot move a window. A row whose document or target
+ * the commit does not hold contributes empty text and is never flagged.
+ * @param {string} repoRoot
+ * @param {Array<object>} rows
+ * @returns {Map<string, { sentence: string, windowText: string }>}
+ */
+function buildWindows(repoRoot, rows) {
+  const docs = new Map();
+  const windows = new Map();
+  for (const row of rows) {
+    const docKey = `${row.commit}:${row.doc}`;
+    if (!docs.has(docKey)) docs.set(docKey, readCommittedLines(repoRoot, row.commit, row.doc));
+    const lines = docs.get(docKey);
+    const sentence = lines === null ? '' : lines[row.doc_line - 1] ?? '';
+    const windowText = readWindow(repoRoot, row.commit, row.target, row.window_start, row.window_end).join('\n');
+    windows.set(row.id, { sentence, windowText });
+  }
+  return windows;
+}
+
+/**
+ * Accuracy of the two mechanical comparators on identical labeled rows.
+ * Flag-nothing never flags; identifier overlap flags when the sentence's code
+ * tokens vanish from the window. Labels map supports to clean and anything
+ * else to drifted. The baseline is the comparator right on more rows, with
+ * flag-nothing winning a tie, so winnable rows are those it gets wrong.
+ * @param {Array<{ id?: string, target?: string, verdict?: string|null }>} rows
+ * @param {Map<string, { sentence: string, windowText: string }>} windows Keyed by row id.
+ * @returns {{
+ *   K: number,
+ *   flagNothing: { right: number, K: number, ratio: number },
+ *   identifierOverlap: { right: number, K: number, ratio: number },
+ *   baselineMethod: 'flag-nothing'|'identifier-overlap',
+ *   baselineRight: number,
+ *   baselineRatio: number,
+ *   headroom: boolean,
+ *   winnable: number
+ * }}
+ */
+export function scoreComparators(rows, windows) {
+  const labeled = rows.filter((row) => row.verdict !== null && row.verdict !== undefined);
+  const K = labeled.length;
+  let flagNothingRight = 0;
+  let identifierOverlapRight = 0;
+  for (const row of labeled) {
+    const drifted = row.verdict !== 'supports';
+    if (!drifted) flagNothingRight += 1;
+    const entry = windows.get(row.id);
+    const flagged = flagByIdentifierOverlap(entry?.sentence ?? '', entry?.windowText ?? '', row.target ?? '');
+    if (flagged === drifted) identifierOverlapRight += 1;
+  }
+  const baselineMethod = identifierOverlapRight > flagNothingRight ? 'identifier-overlap' : 'flag-nothing';
+  const baselineRight = Math.max(flagNothingRight, identifierOverlapRight);
+  return {
+    K,
+    flagNothing: { right: flagNothingRight, K, ratio: K === 0 ? 0 : flagNothingRight / K },
+    identifierOverlap: { right: identifierOverlapRight, K, ratio: K === 0 ? 0 : identifierOverlapRight / K },
+    baselineMethod,
+    baselineRight,
+    baselineRatio: K === 0 ? 0 : baselineRight / K,
+    // Above 90 percent baseline accuracy a 10-point gain cannot fit.
+    headroom: 10 * baselineRight <= 9 * K,
+    winnable: K - baselineRight,
+  };
+}
+
+/**
+ * The label-gate lines and the gate they support. Fewer rows than the gate
+ * needs stops before any scoring; otherwise both comparators score and the run
+ * stops when the baseline leaves no headroom or too few winnable rows. Only the
+ * planned gate prints the fixed instruction, so its text and hash sit on stdout
+ * before the first call.
+ * @param {{ rows: Array<object>, windows: Map<string, { sentence: string, windowText: string }> }} input
+ * @returns {{ lines: string[], gate: 'stop'|'no headroom'|'underpowered'|'planned' }}
+ */
+export function summaryLines({ rows, windows }) {
+  const lines = [MARGIN_LINE, KEEP_RULE_LINE];
+  const { labeled } = labelCounts(rows);
+  if (labeled < LABEL_GATE) {
+    return { lines: [...lines, `stop: fewer than ${LABEL_GATE} labeled rows`], gate: 'stop' };
+  }
+  const comparators = scoreComparators(rows, windows);
+  lines.push(
+    `comparator flag-nothing: ${comparators.flagNothing.right}/${comparators.K} = ${comparators.flagNothing.ratio.toFixed(4)}`,
+    `comparator identifier-overlap: ${comparators.identifierOverlap.right}/${comparators.K} = ${comparators.identifierOverlap.ratio.toFixed(4)}`,
+    `baseline method: ${comparators.baselineMethod}`,
+  );
+  if (!comparators.headroom) {
+    return { lines: [...lines, 'no headroom'], gate: 'no headroom' };
+  }
+  lines.push(`headroom: baseline=${comparators.baselineRatio.toFixed(4)} margin=0.10`);
+  if (comparators.winnable < 5) {
+    return { lines: [...lines, `underpowered: winnable=${comparators.winnable}`], gate: 'underpowered' };
+  }
+  lines.push(`instruction: "${INSTRUCTION}" sha256=${sha256Hex(INSTRUCTION)}`);
+  return { lines, gate: 'planned' };
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 5. VERDICT
+// ───────────────────────────────────────────────────────────────────
+
+// The keep rule is fixed before any model run, counts stay integers and the
+// sign test's tail is exact, so no rounding decides a verdict.
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
+ * A column's verdict, the first failed keep-rule check deciding, in this
+ * order: coverage, precision, margin, the sign test, then flips for a Jev
+ * column. The sign test's p rides on every outcome.
+ * @param {{ backend: string, K: number, M: number, A: number, B: number, W: number, L: number, TP: number, FP: number, F: number }} counts
+ * @returns {{ verdict: 'keep'|'kill (precision)'|'stop (coverage)'|'stop (margin)'|'stop (sign test)'|'stop (flips)', p: number }}
+ */
+export function decideVerdict({ backend, K, M, A, B, W, L, TP, FP, F }) {
+  const sign = binomialTail(W, W + L);
+  if (!(10 * M >= 9 * K)) return { verdict: 'stop (coverage)', p: sign.p };
+  if (!(TP + FP >= 1 && 5 * TP >= 4 * (TP + FP))) return { verdict: 'kill (precision)', p: sign.p };
+  if (!(10 * (A - B) >= M)) return { verdict: 'stop (margin)', p: sign.p };
+  if (!sign.below) return { verdict: 'stop (sign test)', p: sign.p };
+  if (backend === 'jev' && !(10 * F <= 3 * M)) return { verdict: 'stop (flips)', p: sign.p };
+  return { verdict: 'keep', p: sign.p };
+}
+
+/**
+ * The notice a column prints before its verdict when the report an earlier run
+ * left behind names another identity: a changed Deem commit pair, or a changed
+ * Jev provider or model. Null when no earlier column exists or it matches the
+ * identity this run used.
+ * @param {string} backend
+ * @param {object|null} stored Parsed report from an earlier run.
+ * @param {{ modelCommit?: string, sourceCommit?: string, provider?: string, model?: string }} identity
+ * @returns {string|null}
+ */
+function requalifyNotice(backend, stored, identity) {
+  const prior = stored?.columns?.[backend];
+  if (prior === undefined || prior === null) return null;
+  if (backend === 'deem' && (prior.modelCommit !== identity.modelCommit || prior.sourceCommit !== identity.sourceCommit)) {
+    return 'requalify: model commit changed';
+  }
+  if (backend === 'jev' && (prior.provider !== identity.provider || prior.model !== identity.model)) {
+    return 'requalify: model changed';
+  }
+  return null;
+}
+
+/**
+ * One column's verdict line: the verdict, every count, the sign test's p at
+ * four significant digits, the labels hash and the column's identity suffix.
+ * The flips count belongs to a Jev column, so a Deem column prints n/a. A
+ * stored report that names another identity puts its requalify notice on the
+ * line ahead of the verdict.
+ * @param {{ backend: string, verdict: string, K: number, M: number, A: number, B: number, W: number, L: number, TP: number, FP: number, F: number, p: number, stored?: object|null, model?: string, modelCommit?: string, sourceCommit?: string, provider?: string }} summary
+ * @param {string} labelsSha Truncated hash of the labels the column measured.
+ * @param {string} [suffix] Column identity text, appended when non-empty.
+ * @returns {string}
+ */
+export function verdictLine(summary, labelsSha, suffix = '') {
+  const { backend, verdict, K, M, A, B, W, L, TP, FP, F, p } = summary;
+  let line = `verdict ${backend}: ${verdict} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L}`
+    + ` TP=${TP} FP=${FP} F=${backend === 'jev' ? F : 'n/a'} p=${p.toPrecision(4)} labels_sha256=${labelsSha}`;
+  if (typeof suffix === 'string' && suffix !== '') line += ` ${suffix}`;
+  const notice = requalifyNotice(backend, summary.stored, summary);
+  return notice === null ? line : `${notice}\n${line}`;
+}
+
+/**
+ * Mean squared error of a column's probabilities against the outcomes: the
+ * Brier score. Each entry pairs the probability the backend gave a row with
+ * the row's outcome, 1 for a drifted window and 0 for a clean one. Entries
+ * without a finite probability in [0, 1] are skipped, and nothing counted has
+ * no score.
+ * @param {Array<{ probability: number, actual: number|boolean }>} probabilities
+ * @returns {number|null}
+ */
+export function brierScore(probabilities) {
+  let sum = 0;
+  let counted = 0;
+  for (const entry of probabilities) {
+    const probability = entry.probability;
+    if (!Number.isFinite(probability) || probability < 0 || probability > 1) continue;
+    sum += (probability - (entry.actual ? 1 : 0)) ** 2;
+    counted += 1;
+  }
+  return counted === 0 ? null : sum / counted;
+}
+
+/**
+ * Nearest-rank percentile. Empty lists have no rank.
+ * @param {number[]} values Raw values.
+ * @param {number} q Quantile in (0, 1].
+ * @returns {number|null}
+ */
+export function nearestRank(values, q) {
+  if (values.length === 0) return null;
+  const sorted = [...values].sort((left, right) => left - right);
+  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 6. DEEM ARM
+// ───────────────────────────────────────────────────────────────────
+
+// The gate reads the local model's health once and passes no key; a failed
+// check skips the arm, and one noul call per row is all the arm sends.
+
+/** Pinned Deem model name the health check accepts. */
+export const DEEM_MODEL = 'deem-0.8-v1';
+
+/** Deem noul p50 in milliseconds, from deem-local.md, used for the wall-time estimate. */
+export const DEEM_P50_MS = 60.5;
+
+/** Bounds the health spawn; cli-deem bounds its own HTTP health request. */
+export const HEALTH_TIMEOUT_MS = 10000;
+
+/** Repo copy of the cli-deem entry point, run under node when none is on PATH. */
+const REPO_CLI_DEEM = path.join(REPO_ROOT, '.skilled', 'skills', 'cli-classifier', 'cli-deem', 'scripts', 'cli-deem.mjs');
+
+/**
+ * First executable file of this name on PATH, or null when none is executable.
+ * Empty PATH entries are skipped, and a missing path, a directory or a file
+ * that cannot be executed is not a match.
+ * @param {string} name Executable file name.
+ * @param {{ PATH?: string }} env Environment whose PATH is searched.
+ * @returns {string|null}
+ */
+export function which(name, env) {
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
+ * One health check. An unreachable binary, a stub backend or a wrong model is
+ * a failed check the caller prints as a skip.
+ * @param {string[]} cmd Command from deemCommand.
+ * @param {Record<string, string|undefined>} env Environment for the call.
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
+ * Prints the health line, or a skip line when the check fails. A refused model
+ * or a body that does not fit prints the response it read beside the skip.
+ * @param {{ out: (line: string) => void, env: Record<string, string|undefined> }} ctx Line writer and environment.
+ * @returns {{ passed: boolean, cmd: string[], reason?: string }}
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
+ * One bounded child process. Resolves exactly once with the exit code, the
+ * collected output, the wall time, and whether the timeout fired. The timer
+ * kills the child and resolves at once, without waiting for close: a
+ * grandchild can hold the pipes open past the kill. Stdin is closed after the
+ * write because the CLI reads stdin to EOF. A spawn error is code 127 with the
+ * message as stderr.
+ * @param {string} file Executable to spawn.
+ * @param {string[]} args Arguments after the executable.
+ * @param {string} stdinText Text written to stdin, then closed.
+ * @param {Record<string, string|undefined>} env Child environment.
+ * @param {number} timeoutMs Kill and resolve after this many milliseconds.
+ * @returns {Promise<{ code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean }>}
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
+ * @param {string|undefined} outDir Directory that holds calls.jsonl.
+ * @returns {{ append: (record: object) => void }}
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
+ * Probability of one noul answer. A body that does not parse, or a noul that
+ * is not a finite number in [0, 1], is an unmeasured call, not a crash.
+ * @param {string} stdout Raw stdout of one noul call.
+ * @returns {number|null}
+ */
+function parseNoul(stdout) {
+  let parsed;
+  try {
+    parsed = JSON.parse(stdout);
+  } catch {
+    return null;
+  }
+  const value = parsed?.answers?.answer?.noul;
+  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) return null;
+  return value;
+}
+
+/**
+ * One noul call per labeled row whose sentence and window the recorded commit
+ * still holds, with one calls.jsonl record per spawn and one retry behind a
+ * fresh health check when a call exits 4. A stop prints the line and the rows
+ * that finished, and leaves the column and verdict unprinted.
+ * @param {{ rows: Array<object>, windows: Map<string, { sentence: string, windowText: string }>, labelsSha: string }} plan
+ * @param {{ cmd: string[], model: string, modelCommit: string, sourceCommit: string }} gate Passing deemGate result.
+ * @param {{ out: (line: string) => void, env: Record<string, string|undefined>, timeoutMs: number, callLog: { append: (record: object) => void }, stored: object|null }} ctx Line writer, environment, timeout, call log and an earlier run's report.
+ * @returns {Promise<{ column: object } | { stopped: string, partialRows: number }>}
+ */
+export async function runDeemArm(plan, gate, ctx) {
+  const labeled = plan.rows.filter((row) => row.verdict !== null && row.verdict !== undefined);
+  const ready = [];
+  for (const row of labeled) {
+    const entry = plan.windows.get(row.id);
+    // A row whose document or target the recorded commit does not hold has no
+    // state to send, so it stays unmeasured and costs no call.
+    if (entry === undefined || entry.sentence === '' || entry.windowText === '') continue;
+    ready.push({ row, entry });
+  }
+  const K = labeled.length;
+  ctx.out(`deem: nothing leaves the machine; planned calls: ${ready.length}; estimated wall time: ${(ready.length * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the noul p50 in deem-local.md`);
+
+  const results = new Map();
+  const wallTimes = [];
+  let finished = 0;
+
+  const stop = (line) => {
+    ctx.out(line);
+    ctx.out(`deem: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished };
+  };
+
+  for (const { row, entry } of ready) {
+    const state = JSON.stringify({ sentence: entry.sentence, target: row.target, window: entry.windowText });
+    const callArgs = [...gate.cmd.slice(1), 'noul', '-q', INSTRUCTION];
+
+    let call = await spawnCall(gate.cmd[0], callArgs, state, ctx.env, ctx.timeoutMs);
+    wallTimes.push(call.wallMs);
+
+    if (!call.timedOut && call.code === 4) {
+      ctx.callLog.append({
+        rowId: row.id,
+        rerun: 0,
+        wallMs: call.wallMs,
+        exitCode: call.code,
+        backend: 'deem',
+        probability: null,
+        flag: null,
+        status: 'unmeasured',
+        modelId: gate.model,
+        modelCommit: gate.modelCommit,
+        sourceCommit: gate.sourceCommit,
+      });
+      const health = readDeemHealth(gate.cmd, ctx.env);
+      if (!health.ok) return stop('deem arm stopped: server gone');
+      if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
+        return stop('deem arm stopped: model commit changed mid-run');
+      }
+
+      call = await spawnCall(gate.cmd[0], callArgs, state, ctx.env, ctx.timeoutMs);
+      wallTimes.push(call.wallMs);
+    }
+
+    let probability = null;
+    let flag = null;
+    let status = 'unmeasured';
+    let stopLine = null;
+    if (call.timedOut) {
+      status = 'unmeasured_timeout';
+    } else if (call.code === 0) {
+      probability = parseNoul(call.stdout);
+      if (probability === null) {
+        status = 'unmeasured';
+      } else {
+        status = 'measured';
+        flag = probability >= FLAG_THRESHOLD;
+      }
+    } else if (call.code === 2) {
+      stopLine = 'deem arm stopped: usage error';
+    } else if (call.code === 3) {
+      stopLine = 'deem arm stopped: backend refused';
+    } else if (call.code === 130) {
+      stopLine = 'deem arm stopped: interrupted';
+    }
+
+    ctx.callLog.append({
+      rowId: row.id,
+      rerun: 0,
+      wallMs: call.wallMs,
+      exitCode: call.code,
+      backend: 'deem',
+      probability,
+      flag,
+      status,
+      modelId: gate.model,
+      modelCommit: gate.modelCommit,
+      sourceCommit: gate.sourceCommit,
+    });
+    if (stopLine !== null) return stop(stopLine);
+    results.set(row.id, { probability, flag, status });
+    finished += 1;
+  }
+
+  let M = 0;
+  let A = 0;
+  let B = 0;
+  let W = 0;
+  let L = 0;
+  let TP = 0;
+  let FP = 0;
+  const scored = [];
+  for (const { row, entry } of ready) {
+    const result = results.get(row.id);
+    if (result === undefined || result.status !== 'measured') continue;
+    M += 1;
+    const drifted = row.verdict !== 'supports';
+    const flagged = result.flag === true;
+    if (flagged && drifted) TP += 1;
+    if (flagged && !drifted) FP += 1;
+    const modelRight = flagged === drifted;
+    if (modelRight) A += 1;
+    const comparatorRight = flagByIdentifierOverlap(entry.sentence, entry.windowText, row.target) === drifted;
+    if (comparatorRight) B += 1;
+    if (modelRight && !comparatorRight) W += 1;
+    if (!modelRight && comparatorRight) L += 1;
+    scored.push({ probability: result.probability, actual: drifted ? 1 : 0 });
+  }
+
+  const { verdict, p } = decideVerdict({ backend: 'deem', K, M, A, B, W, L, TP, FP, F: 0 });
+  const latency = { p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) };
+  ctx.out(`column deem: rows=${K} measured=${M} unmeasured=${K - M} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
+  const brier = brierScore(scored);
+  ctx.out(`brier deem: ${brier === null ? 'none' : brier.toFixed(4)}`);
+  ctx.out('flips: not applicable (deem noul)');
+
+  const line = verdictLine(
+    { backend: 'deem', verdict, K, M, A, B, W, L, TP, FP, F: 0, p, stored: ctx.stored, model: gate.model, modelCommit: gate.modelCommit, sourceCommit: gate.sourceCommit },
+    plan.labelsSha,
+    `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`,
+  );
+  for (const text of line.split('\n')) ctx.out(text);
+
+  return {
+    column: {
+      backend: 'deem',
+      verdict,
+      K,
+      M,
+      A,
+      B,
+      W,
+      L,
+      TP,
+      FP,
+      F: 0,
+      p,
+      latency,
+      model: gate.model,
+      modelCommit: gate.modelCommit,
+      sourceCommit: gate.sourceCommit,
+      line,
+    },
+  };
+}
+
+/**
+ * Parsed report.json written by an earlier run into the same out directory.
+ * @param {string|undefined} outDir Directory that may hold report.json.
+ * @returns {object|null} The parsed report, or null when outDir is empty, the
+ *   file is missing, or the file does not parse.
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
+ * The report.json body: the census totals, the label set, the comparator
+ * scores that gated the run, one entry per backend in columns, stopped and
+ * skipped, and the keep rule the columns were measured against.
+ * @param {{ census: object, labels: { path: string, sha256: string, rows: number, labeled: number }, comparators: object, columns?: object, stopped?: object, skipped?: object }} input
+ * @returns {object}
+ */
+export function buildReport({ census, labels, comparators, columns = {}, stopped = {}, skipped = {} }) {
+  return {
+    census: census.total,
+    commit: census.commit,
+    labels: {
+      path: labels.path,
+      sha256: labels.sha256,
+      rows: labels.rows,
+      labeled: labels.labeled,
+    },
+    comparators: {
+      K: comparators.K,
+      flagNothing: comparators.flagNothing,
+      identifierOverlap: comparators.identifierOverlap,
+    },
+    baselineMethod: comparators.baselineMethod,
+    headroom: comparators.headroom,
+    winnable: comparators.winnable,
+    keepRule: KEEP_RULE_LINE,
+    margin: MARGIN_LINE,
+    columns,
+    stopped,
+    skipped,
+  };
+}
+
+// ───────────────────────────────────────────────────────────────────
+// 7. JEV ARM
+// ───────────────────────────────────────────────────────────────────
+
+// The gate reads the pinned version and the credential the binary resolves
+// itself; the arm asks every row three times so a flip rate can be read from
+// the repeated answers, and every call carries the same provider.
+
+/** Pinned jev version the gate accepts. */
+export const JEV_VERSION = 'jev 0.6.2';
+
+/** Calls per row, so a repeated answer can be told from a flip. */
+export const JEV_RERUNS = 3;
+
+/** Wait behind the one retry an exit 4 earns. */
+export const BACKOFF_MS = 2000;
+
+/**
+ * Identity line, then the pinned version and a credential check. A miss prints
+ * a skip line and leaves the census text already written.
+ * @param {{ out: (line: string) => void, env: Record<string, string|undefined>, timeoutMs: number }} ctx Line writer, environment and per-call timeout.
+ * @returns {{ passed: boolean, path: string|null, provider: string, reason?: string }} True when the gate passed; a failed gate carries the skip line it printed.
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
+ * One auth test, then three noul calls per labeled row whose sentence and
+ * window the recorded commit still holds, with one calls.jsonl record per
+ * spawn and one backoff retry when a call exits 4. A row is measured only
+ * when every rerun returned a probability, its flag is the modal flag over
+ * those reruns, and the votes the modal flag lacks count as flips. A stop
+ * prints the line and the rows that finished, and leaves the column and
+ * verdict unprinted.
+ * @param {{ rows: Array<object>, windows: Map<string, { sentence: string, windowText: string }>, labelsSha: string }} plan
+ * @param {{ path: string, provider: string }} gate Passing jevGate result.
+ * @param {{ out: (line: string) => void, env: Record<string, string|undefined>, timeoutMs: number, backoffMs: number, callLog: { append: (record: object) => void }, stored: object|null }} ctx Line writer, environment, timeout, retry wait, the call log and an earlier run's report.
+ * @returns {Promise<{ column: object } | { stopped: string, partialRows: number }>}
+ */
+export async function runJevArm(plan, gate, ctx) {
+  const labeled = plan.rows.filter((row) => row.verdict !== null && row.verdict !== undefined);
+  const ready = [];
+  let chars = 0;
+  for (const row of labeled) {
+    const entry = plan.windows.get(row.id);
+    // A row whose document or target the recorded commit does not hold has no
+    // state to send, so it stays unmeasured and costs no call.
+    if (entry === undefined || entry.sentence === '' || entry.windowText === '') continue;
+    const state = JSON.stringify({ sentence: entry.sentence, target: row.target, window: entry.windowText });
+    ready.push({ row, entry, state });
+    chars += state.length + INSTRUCTION.length;
+  }
+  const K = labeled.length;
+  chars *= JEV_RERUNS;
+  ctx.out(`jev: payload: committed skill-doc sentences and tracked-file windows; planned calls: ${JEV_RERUNS * K + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);
+
+  const wallTimes = [];
+  let finished = 0;
+
+  const stop = (line) => {
+    ctx.out(line);
+    ctx.out(`jev: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished };
+  };
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
+    rowId: null,
+    rerun: null,
+    wallMs: auth.wallMs,
+    exitCode: auth.code,
+    backend: 'jev',
+    probability: null,
+    flag: null,
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
+  for (const { row, entry, state } of ready) {
+    const callArgs = ['noul', '--provider', gate.provider, '-q', INSTRUCTION];
+    const reruns = [];
+    let stopLine = null;
+
+    for (let rerun = 0; rerun < JEV_RERUNS; rerun += 1) {
+      let call = await spawnCall(gate.path, callArgs, state, ctx.env, ctx.timeoutMs);
+      wallTimes.push(call.wallMs);
+
+      if (!call.timedOut && call.code === 4) {
+        ctx.callLog.append({
+          rowId: row.id,
+          rerun,
+          wallMs: call.wallMs,
+          exitCode: call.code,
+          backend: 'jev',
+          probability: null,
+          flag: null,
+          status: 'unmeasured',
+          jevVersion: '0.6.2',
+          provider: gate.provider,
+          model,
+        });
+        await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
+        call = await spawnCall(gate.path, callArgs, state, ctx.env, ctx.timeoutMs);
+        wallTimes.push(call.wallMs);
+      }
+
+      let probability = null;
+      let flag = null;
+      let status = 'unmeasured';
+      if (call.timedOut) {
+        status = 'unmeasured_timeout';
+      } else if (call.code === 0) {
+        probability = parseNoul(call.stdout);
+        if (probability !== null) {
+          flag = probability >= FLAG_THRESHOLD;
+          status = 'measured';
+        }
+      } else if (call.code === 2) {
+        stopLine = 'jev arm stopped: usage error';
+      } else if (call.code === 3) {
+        stopLine = 'jev arm stopped: key rejected';
+      } else if (call.code === 130) {
+        stopLine = 'jev arm stopped: interrupted';
+      }
+
+      ctx.callLog.append({
+        rowId: row.id,
+        rerun,
+        wallMs: call.wallMs,
+        exitCode: call.code,
+        backend: 'jev',
+        probability,
+        flag,
+        status,
+        jevVersion: '0.6.2',
+        provider: gate.provider,
+        model,
+      });
+      if (stopLine !== null) return stop(stopLine);
+      reruns.push({ probability, flag, measured: status === 'measured' });
+    }
+
+    answers.set(row.id, reruns);
+    finished += 1;
+  }
+
+  let M = 0;
+  let A = 0;
+  let B = 0;
+  let W = 0;
+  let L = 0;
+  let TP = 0;
+  let FP = 0;
+  let F = 0;
+  const scored = [];
+  for (const { row, entry } of ready) {
+    const reruns = answers.get(row.id);
+    if (reruns === undefined || !reruns.every((rerun) => rerun.measured)) continue;
+    M += 1;
+    const votes = reruns.filter((rerun) => rerun.flag === true).length;
+    const top = Math.max(votes, JEV_RERUNS - votes);
+    F += JEV_RERUNS - top;
+    const flagged = 2 * votes > JEV_RERUNS;
+    const drifted = row.verdict !== 'supports';
+    if (flagged && drifted) TP += 1;
+    if (flagged && !drifted) FP += 1;
+    const modelRight = flagged === drifted;
+    if (modelRight) A += 1;
+    const comparatorRight = flagByIdentifierOverlap(entry.sentence, entry.windowText, row.target) === drifted;
+    if (comparatorRight) B += 1;
+    if (modelRight && !comparatorRight) W += 1;
+    if (!modelRight && comparatorRight) L += 1;
+    for (const rerun of reruns) scored.push({ probability: rerun.probability, actual: drifted ? 1 : 0 });
+  }
+
+  const { verdict, p } = decideVerdict({ backend: 'jev', K, M, A, B, W, L, TP, FP, F });
+  const latency = { p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) };
+  ctx.out(`column jev: rows=${K} measured=${M} unmeasured=${K - M} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
+  const brier = brierScore(scored);
+  ctx.out(`brier jev: ${brier === null ? 'none' : brier.toFixed(4)}`);
+
+  const line = verdictLine(
+    { backend: 'jev', verdict, K, M, A, B, W, L, TP, FP, F, p, stored: ctx.stored, provider: gate.provider, model },
+    plan.labelsSha,
+    `jev_version=0.6.2 provider=${gate.provider} model=${model}`,
+  );
+  for (const text of line.split('\n')) ctx.out(text);
+
+  return {
+    column: {
+      backend: 'jev',
+      verdict,
+      K,
+      M,
+      A,
+      B,
+      W,
+      L,
+      TP,
+      FP,
+      F,
+      p,
+      latency,
+      jevVersion: '0.6.2',
+      provider: gate.provider,
+      model,
+      line,
+    },
+  };
+}
+
+// ───────────────────────────────────────────────────────────────────
+// ENTRY POINT
+// ───────────────────────────────────────────────────────────────────
+
+/**
+ * Prints the census, the dead citations and the label-gate summary, then the
+ * arm each switch names. The default run spawns no model binary, writes no
+ * file and reads no credential beyond the labels file; --draw writes the
+ * labels file instead of printing.
+ * @param {string[]} argv Arguments after the script path.
+ * @param {Object} [deps]
+ * @param {string} [deps.repoRoot] Repository root. Default REPO_ROOT.
+ * @param {(line: string) => void} [deps.out] Line writer. Default writes the line plus '\n' to stdout.
+ * @param {(line: string) => void} [deps.err] Line writer. Default writes the line plus '\n' to stderr.
+ * @param {Record<string, string|undefined>} [deps.env] Arm environment. Default process.env.
+ * @param {number} [deps.timeoutMs] Per-call timeout. Default CALL_TIMEOUT_MS.
+ * @param {number} [deps.backoffMs] Retry wait behind an exit 4. Default BACKOFF_MS.
+ * @returns {Promise<number>} 0 = report printed, 2 = bad invocation or unreadable input.
+ */
+export async function main(argv, deps = {}) {
+  const repoRoot = deps.repoRoot ?? REPO_ROOT;
+  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
+  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
+  const env = deps.env ?? process.env;
+  const timeoutMs = deps.timeoutMs ?? CALL_TIMEOUT_MS;
+  const backoffMs = deps.backoffMs ?? BACKOFF_MS;
+
+  let parsed;
+  try {
+    parsed = parseArgs({
+      args: argv,
+      strict: true,
+      allowPositionals: false,
+      options: {
+        draw: { type: 'boolean' },
+        seed: { type: 'string' },
+        jev: { type: 'boolean' },
+        deem: { type: 'boolean' },
+        out: { type: 'string' },
+        labels: { type: 'string' },
+      },
+    });
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    return 2;
+  }
+  const { values } = parsed;
+  const labelsPath = values.labels ?? LABELS_PATH;
+
+  if ((values.jev === true || values.deem === true) && (typeof values.out !== 'string' || values.out === '')) {
+    err('--deem and --jev need --out <dir> so every call is recorded');
+    return 2;
+  }
+
+  let seed = null;
+  if (values.draw === true) {
+    const seedText = typeof values.seed === 'string' ? values.seed.trim() : '';
+    seed = seedText === '' ? Number.NaN : Number(seedText);
+    if (!Number.isInteger(seed)) {
+      err('--draw needs an integer --seed <n>');
+      return 2;
+    }
+    if (fs.existsSync(labelsPath)) {
+      let existing;
+      try {
+        existing = parseLabels(fs.readFileSync(labelsPath, 'utf8'));
+      } catch (error) {
+        err(error instanceof Error ? error.message : String(error));
+        return 2;
+      }
+      if (existing.some((row) => row.labeler !== null && row.labeler !== undefined)) {
+        err(`draw: refusing to overwrite ${labelsPath}, operator labels present`);
+        return 2;
+      }
+    }
+  }
+
+  let census;
+  try {
+    census = buildCensus(repoRoot, listTrackedFiles(repoRoot));
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    return 2;
+  }
+
+  if (values.draw === true) {
+    let rows;
+    try {
+      rows = drawRows({ census, repoRoot, commit: census.commit, seed });
+      fs.writeFileSync(labelsPath, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
+    } catch (error) {
+      err(error instanceof Error ? error.message : String(error));
+      return 2;
+    }
+    const counts = labelCounts(rows);
+    out(`draw: path=${labelsPath} seed=${seed} commit=${census.commit.slice(0, 12)} rows=${rows.length} live=${counts.live} constructed=${counts.constructed}`);
+    return 0;
+  }
+
+  let labelRows = [];
+  let labelsText = null;
+  if (fs.existsSync(labelsPath)) {
+    try {
+      labelsText = fs.readFileSync(labelsPath, 'utf8');
+      labelRows = parseLabels(labelsText);
+    } catch (error) {
+      err(error instanceof Error ? error.message : String(error));
+      return 2;
+    }
+  }
+
+  for (const entry of census.perSkill) {
+    out(`skill ${entry.skill}: citations=${entry.citations} in_range=${entry.in_range} past_end=${entry.past_end} ambiguous=${entry.ambiguous} unresolved=${entry.unresolved} dead=${entry.dead}`);
+  }
+  out(`citations=${census.total.citations} in_range=${census.total.in_range} past_end=${census.total.past_end} ambiguous=${census.total.ambiguous} unresolved=${census.total.unresolved} refused=${census.refused} dead=${census.total.dead} commit=${census.commit.slice(0, 12)}`);
+  for (const entry of census.dead) {
+    out(`cite dead: ${entry.doc}:${entry.line} -> ${entry.target}:${entry.targetLine}`);
+  }
+  const windows = buildWindows(repoRoot, labelRows);
+  const summary = summaryLines({ rows: labelRows, windows });
+  for (const line of summary.lines) {
+    out(line);
+  }
+
+  const armsRequested = values.jev === true || values.deem === true;
+  let callLog = null;
+  let stored = null;
+  if (armsRequested) {
+    callLog = createCallLog(values.out);
+    stored = readStoredReport(values.out);
+  }
+
+  const columns = {};
+  const stopped = {};
+  const skipped = {};
+
+  // The Jev arm runs first, on its own gate; a failed check never starts the
+  // other backend.
+  if (values.jev === true) {
+    const check = jevGate({ out, env, timeoutMs });
+    if (!check.passed) {
+      skipped.jev = check.reason;
+    } else if (summary.gate !== 'planned') {
+      const line = `jev arm skipped: ${summary.gate === 'stop' ? 'label gate' : summary.gate}`;
+      out(line);
+      skipped.jev = line;
+    } else {
+      const labelsSha = labelsText === null ? 'none' : sha256Hex(labelsText).slice(0, 12);
+      const result = await runJevArm(
+        { rows: labelRows, windows, labelsSha },
+        check,
+        { out, env, timeoutMs, backoffMs, callLog, stored },
+      );
+      if (result.stopped === undefined) {
+        columns.jev = result.column;
+      } else {
+        stopped.jev = { line: result.stopped, partialRows: result.partialRows };
+      }
+    }
+  }
+
+  // A switch runs its gate whenever it is set; a failed check prints its skip
+  // line and leaves every earlier line as it was.
+  if (values.deem === true) {
+    const check = deemGate({ out, env });
+    if (!check.passed) {
+      skipped.deem = check.reason;
+    } else if (summary.gate !== 'planned') {
+      const line = `deem arm skipped: ${summary.gate === 'stop' ? 'label gate' : summary.gate}`;
+      out(line);
+      skipped.deem = line;
+    } else {
+      const labelsSha = labelsText === null ? 'none' : sha256Hex(labelsText).slice(0, 12);
+      const result = await runDeemArm(
+        { rows: labelRows, windows, labelsSha },
+        check,
+        { out, env, timeoutMs, callLog, stored },
+      );
+      if (result.stopped === undefined) {
+        columns.deem = result.column;
+      } else {
+        stopped.deem = { line: result.stopped, partialRows: result.partialRows };
+      }
+    }
+  }
+
+  // The report follows the arms; a gate that stopped before them wrote nothing.
+  if (armsRequested && summary.gate === 'planned') {
+    const comparators = scoreComparators(labelRows, windows);
+    const report = buildReport({
+      census,
+      labels: {
+        path: labelsPath,
+        sha256: labelsText === null ? '' : sha256Hex(labelsText),
+        rows: labelRows.length,
+        labeled: labelCounts(labelRows).labeled,
+      },
+      comparators,
+      columns,
+      stopped,
+      skipped,
+    });
+    fs.mkdirSync(values.out, { recursive: true });
+    fs.writeFileSync(path.join(values.out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
+  }
+
+  return 0;
+}
+
+if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
+  process.exitCode = await main(process.argv.slice(2));
+}
diff --git a/.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs b/.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs
new file mode 100644
index 0000000000..7822410599
--- /dev/null
+++ b/.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs
@@ -0,0 +1,989 @@
+#!/usr/bin/env node
+// ───────────────────────────────────────────────────────────────────
+// MODULE: Citation Drift Scan Tests
+// ───────────────────────────────────────────────────────────────────
+// Fixture repositories in the OS temp directory with stub jev and cli-deem
+// binaries first on PATH; no test reaches a real backend.
+
+import assert from 'node:assert/strict';
+import { execFileSync } from 'node:child_process';
+import fs from 'node:fs';
+import os from 'node:os';
+import path from 'node:path';
+import test from 'node:test';
+
+import { buildCensus, decideVerdict, extractCitations, flagByIdentifierOverlap, headCommit, identifierTokens, INSTRUCTION, jevGate, KEEP_RULE_LINE, labelCounts, listTrackedFiles, main, MARGIN_LINE, parseLabels, resolveCitation, runJevArm, sha256Hex, verdictLine } from '../../shared/scripts/cite-drift-scan.mjs';
+
+const ALPHA_DOC = '.skilled/skills/alpha-skill/SKILL.md';
+const ALPHA_SKILL_ROOT = '.skilled/skills/alpha-skill';
+
+// A fixture must not inherit the caller's git redirectors or backend endpoints.
+function cleanEnv() {
+  const env = { ...process.env };
+  for (const key of [
+    'GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE', 'GIT_OBJECT_DIRECTORY',
+    'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_NAMESPACE', 'GIT_CEILING_DIRECTORIES',
+    'JEV_PROVIDER', 'CLI_DEEM_URL',
+  ]) {
+    delete env[key];
+  }
+  return env;
+}
+
+// The caller's global excludes, attributes and hooks must not shape a fixture.
+const GIT_CONFIG = [
+  '-c', 'user.email=fixture@example.com',
+  '-c', 'user.name=fixture',
+  '-c', 'commit.gpgsign=false',
+  '-c', 'core.hooksPath=/dev/null',
+  '-c', 'core.excludesFile=/dev/null',
+  '-c', 'core.attributesFile=/dev/null',
+];
+
+const runGit = (root, ...args) =>
+  execFileSync('git', ['-C', root, ...GIT_CONFIG, ...args], {
+    env: cleanEnv(),
+    stdio: 'pipe',
+    maxBuffer: 268435456,
+  });
+
+// Ten numbered lines: a cited line fits and a line past the end does not.
+const TEN_LINES = Array.from({ length: 10 }, (_, index) => `line ${index + 1}\n`).join('');
+
+// Test double for the stub jev and cli-deem binaries: it logs one line per call
+// and answers the Deem health shape and both noul shapes.
+function stubMain() {
+  const fs = require('node:fs');
+  const path = require('node:path');
+  const name = path.basename(process.argv[1]);
+  const args = process.argv.slice(2);
+  const env = process.env;
+  const logPath = env.STUB_LOG;
+  const prior = logPath && fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8').split('\n') : [];
+  if (logPath) fs.appendFileSync(logPath, `${name}\t${args.join(' ')}\n`);
+
+  if (name === 'cli-deem' && args[0] === 'health') {
+    if (env.STUB_DEEM_HEALTH === 'stub') {
+      process.stderr.write('{"ok":false,"error":"refused backend: ensemble:stub"}\n');
+      process.exit(3);
+    }
+    // A second health check answers with another pair when the test asks for
+    // one, as a server that loaded new weights between calls would.
+    const recheck = prior.filter((line) => line.startsWith('cli-deem\thealth')).length > 0;
+    const modelCommit = recheck && env.STUB_DEEM_RECHECK_COMMIT ? env.STUB_DEEM_RECHECK_COMMIT : 'stubmodel';
+    const sourceCommit = recheck && env.STUB_DEEM_RECHECK_SOURCE ? env.STUB_DEEM_RECHECK_SOURCE : 'stubsource';
+    process.stdout.write(`${JSON.stringify({ ok: true, backend: 'torch', model: 'deem-0.8-v1', model_commit: modelCommit, source_commit: sourceCommit })}\n`);
+  } else if (name === 'cli-deem' && args[0] === 'noul') {
+    if (env.STUB_DEEM_NOUL_EXIT) process.exit(Number(env.STUB_DEEM_NOUL_EXIT));
+    process.stdout.write('{"model":"deem-0.8-v1","answers":{"answer":{"noul":0.9}}}\n');
+  } else if (name === 'jev' && args[0] === '--version') {
+    process.stdout.write(`${env.STUB_JEV_VERSION || 'jev 0.6.2'}\n`);
+  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'status') {
+    process.exit(Number(env.STUB_AUTH_STATUS_EXIT || 0));
+  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'test') {
+    process.stdout.write('{"ok":true,"model":"stub-model"}\n');
+  } else if (name === 'jev' && args[0] === 'noul') {
+    if (env.STUB_JEV_NOUL_EXIT) process.exit(Number(env.STUB_JEV_NOUL_EXIT));
+    process.stdout.write('{"model":"stub-model","answers":{"answer":{"noul":0.9}}}\n');
+  } else {
+    process.exit(2);
+  }
+}
+
+const STUB_SOURCE = `#!/usr/bin/env node\n(${stubMain.toString()})();\n`;
+
+/**
+ * Fixture repository: two skill folders, their committed documents and targets,
+ * stub binaries on their own PATH entry, a live-window citation in the alpha
+ * skill document, and one optional dead or refused citation line ahead of it.
+ * Each option selects one dead or refused case.
+ * @param {{ deadMissing?: boolean, deadPastEnd?: boolean, dotEnv?: boolean, refusedUntracked?: boolean }} [options]
+ */
+const makeFixture = ({ deadMissing = false, deadPastEnd = false, dotEnv = false, refusedUntracked = false } = {}) => {
+  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cite-drift-test-'));
+  const alphaLines = ['# Alpha skill'];
+  if (deadMissing) alphaLines.push('The tracked target `gone/target.ts:1` is absent from the worktree.');
+  if (deadPastEnd) alphaLines.push('A line past the end: `src/inside.ts:999`.');
+  if (dotEnv) alphaLines.push('A credential path `config/.env.md:1` is never opened.');
+  if (refusedUntracked) alphaLines.push('An untracked path `src/untracked.ts:1` is not in the index.');
+  alphaLines.push('The live window `src/inside.ts:3` still holds.');
+  alphaLines.push('Example:', '```', 'Fenced `src/inside.ts:1` is not prose.', '```');
+
+  const files = {
+    [ALPHA_DOC]: `${alphaLines.join('\n')}\n`,
+    '.skilled/skills/beta-skill/SKILL.md': '# Beta skill\nAnother shared document.\n',
+    '.skilled/skills/alpha-skill/docs/note.md': 'The note sits beside its target.\n',
+    '.skilled/skills/alpha-skill/docs/src/dup.ts': 'export const beside = 1;\n',
+    '.skilled/skills/alpha-skill/gone/target.ts': 'export const gone = 1;\n',
+    'src/dup.ts': 'export const root = 1;\n',
+    'src/inside.ts': TEN_LINES,
+    'a/amb.ts': 'export const a = 1;\n',
+    'b/amb.ts': 'export const b = 1;\n',
+  };
+  for (const [rel, text] of Object.entries(files)) {
+    const full = path.join(root, rel);
+    fs.mkdirSync(path.dirname(full), { recursive: true });
+    fs.writeFileSync(full, text);
+  }
+
+  const bin = path.join(root, 'bin');
+  fs.mkdirSync(bin);
+  for (const name of ['cli-deem', 'jev']) fs.writeFileSync(path.join(bin, name), STUB_SOURCE, { mode: 0o755 });
+
+  runGit(root, 'init', '-q');
+  runGit(root, 'add', '-A');
+  runGit(root, 'commit', '-q', '-m', 'fixture');
+  return { root, bin };
+};
+
+const cleanup = (root) => fs.rmSync(root, { recursive: true, force: true });
+
+// The first citation of the committed alpha skill document.
+const alphaCitation = (root) =>
+  extractCitations(fs.readFileSync(path.join(root, ALPHA_DOC), 'utf8'), ALPHA_DOC)[0];
+
+const runMain = async (repoRoot) => {
+  const lines = [];
+  const errors = [];
+  const code = await main([], { repoRoot, out: (line) => lines.push(line), err: (line) => errors.push(line) });
+  return { code, lines, errors };
+};
+
+// A draw needs more committed in-range citations than the resolution cases:
+// 20 live rows plus 20 constructed windows over files long enough that the
+// 60-line offset still lands clear of the cited line.
+const makeDrawFixture = () => {
+  const { root } = makeFixture();
+  const docLines = (label) => {
+    const lines = [`# ${label} draw`];
+    for (let index = 0; index < 30; index += 1) {
+      lines.push(`Claim ${index + 1} reads \`big/${label}-target.ts:${index * 6 + 5}\`.`);
+    }
+    return `${lines.join('\n')}\n`;
+  };
+  const targetLines = (label) =>
+    Array.from({ length: 200 }, (_, index) => `${label} line ${index + 1}\n`).join('');
+  const files = {
+    '.skilled/skills/alpha-skill/draw.md': docLines('alpha'),
+    '.skilled/skills/beta-skill/draw.md': docLines('beta'),
+    '.skilled/skills/alpha-skill/big/alpha-target.ts': targetLines('alpha'),
+    '.skilled/skills/beta-skill/big/beta-target.ts': targetLines('beta'),
+  };
+  for (const [rel, text] of Object.entries(files)) {
+    const full = path.join(root, rel);
+    fs.mkdirSync(path.dirname(full), { recursive: true });
+    fs.writeFileSync(full, text);
+  }
+  runGit(root, 'add', '-A');
+  runGit(root, 'commit', '-q', '-m', 'draw fixture');
+  return root;
+};
+
+test('extract prose', () => {
+  const citations = extractCitations('The window at `src/a.ts:12` is claimed live.\n', 'docs/note.md');
+  assert.deepEqual(citations, [{
+    doc: 'docs/note.md',
+    line: 1,
+    sentence: 'The window at `src/a.ts:12` is claimed live.',
+    target: 'src/a.ts',
+    targetLine: 12,
+    targetLineEnd: null,
+  }]);
+});
+
+test('extract fenced skip', () => {
+  const prose = 'The window at `src/a.ts:12` is claimed live.';
+  assert.deepEqual(extractCitations(`\`\`\`\n${prose}\n\`\`\`\n`, 'docs/note.md'), []);
+  assert.deepEqual(extractCitations(`~~~\n${prose}\n~~~\n`, 'docs/note.md'), []);
+});
+
+test('resolve order', () => {
+  const { root } = makeFixture();
+  try {
+    const tracked = listTrackedFiles(root);
+    const citation = {
+      doc: `${ALPHA_SKILL_ROOT}/docs/note.md`,
+      line: 1,
+      sentence: 'The note sits beside its target.',
+      target: 'src/dup.ts',
+      targetLine: 1,
+      targetLineEnd: null,
+    };
+    const resolved = resolveCitation(citation, { tracked, repoRoot: root, skillRoot: ALPHA_SKILL_ROOT });
+    assert.equal(resolved.status, 'in_range');
+    assert.equal(resolved.path, `${ALPHA_SKILL_ROOT}/docs/src/dup.ts`);
+  } finally {
+    cleanup(root);
+  }
+});
+
+test('resolve ambiguous basename', () => {
+  const { root } = makeFixture();
+  try {
+    const tracked = listTrackedFiles(root);
+    const citation = {
+      doc: `${ALPHA_SKILL_ROOT}/docs/note.md`,
+      line: 1,
+      sentence: 'One of two files shares the name.',
+      target: 'amb.ts',
+      targetLine: 1,
+      targetLineEnd: null,
+    };
+    const resolved = resolveCitation(citation, { tracked, repoRoot: root, skillRoot: ALPHA_SKILL_ROOT });
+    assert.equal(resolved.status, 'ambiguous');
+    assert.equal(resolved.path, null);
+  } finally {
+    cleanup(root);
+  }
+});
+
+test('resolve unresolved', () => {
+  const { root } = makeFixture();
+  try {
+    const tracked = listTrackedFiles(root);
+    const citation = {
+      doc: `${ALPHA_SKILL_ROOT}/docs/note.md`,
+      line: 1,
+      sentence: 'No candidate holds this path.',
+      target: 'nowhere/missing.ts',
+      targetLine: 1,
+      targetLineEnd: null,
+    };
+    const resolved = resolveCitation(citation, { tracked, repoRoot: root, skillRoot: ALPHA_SKILL_ROOT });
+    assert.equal(resolved.status, 'unresolved');
+    assert.equal(resolved.path, null);
+  } finally {
+    cleanup(root);
+  }
+});
+
+test('dead missing target', async () => {
+  const { root } = makeFixture({ deadMissing: true });
+  try {
+    fs.rmSync(path.join(root, `${ALPHA_SKILL_ROOT}/gone/target.ts`));
+    const tracked = listTrackedFiles(root);
+    assert.ok(tracked.has(`${ALPHA_SKILL_ROOT}/gone/target.ts`));
+    const resolved = resolveCitation(alphaCitation(root), { tracked, repoRoot: root, skillRoot: ALPHA_SKILL_ROOT });
+    assert.equal(resolved.status, 'missing');
+    const run = await runMain(root);
+    assert.equal(run.code, 0);
+    assert.deepEqual(run.lines.filter((line) => line.startsWith('cite dead: ')), [
+      `cite dead: ${ALPHA_DOC}:2 -> gone/target.ts:1`,
+    ]);
+  } finally {
+    cleanup(root);
+  }
+});
+
+test('dead past end', async () => {
+  const { root } = makeFixture({ deadPastEnd: true });
+  try {
+    const tracked = listTrackedFiles(root);
+    const resolved = resolveCitation(alphaCitation(root), { tracked, repoRoot: root, skillRoot: ALPHA_SKILL_ROOT });
+    assert.equal(resolved.status, 'past_end');
+    assert.equal(resolved.endLine, 999);
+    const run = await runMain(root);
+    assert.equal(run.code, 0);
+    assert.deepEqual(run.lines.filter((line) => line.startsWith('cite dead: ')), [
+      `cite dead: ${ALPHA_DOC}:2 -> src/inside.ts:999`,
+    ]);
+  } finally {
+    cleanup(root);
+  }
+});
+
+test('refused .env', () => {
+  const { root } = makeFixture({ dotEnv: true });
+  try {
+    const envFile = path.join(root, `${ALPHA_SKILL_ROOT}/config/.env.md`);
+    fs.mkdirSync(path.dirname(envFile), { recursive: true });
+    fs.writeFileSync(envFile, 'example=1\n');
+    const tracked = listTrackedFiles(root);
+    assert.ok(!tracked.has(`${ALPHA_SKILL_ROOT}/config/.env.md`));
+    const resolved = resolveCitation(alphaCitation(root), { tracked, repoRoot: root, skillRoot: ALPHA_SKILL_ROOT });
+    assert.equal(resolved.status, 'refused');
+    assert.equal(resolved.path, null);
+  } finally {
+    cleanup(root);
+  }
+});
+
+test('refused untracked', async () => {
+  const { root } = makeFixture({ refusedUntracked: true });
+  try {
+    fs.writeFileSync(path.join(root, 'src/untracked.ts'), 'export const untracked = 1;\n');
+    const tracked = listTrackedFiles(root);
+    assert.ok(!tracked.has('src/untracked.ts'));
+    const resolved = resolveCitation(alphaCitation(root), { tracked, repoRoot: root, skillRoot: ALPHA_SKILL_ROOT });
+    assert.equal(resolved.status, 'refused');
+    assert.equal(resolved.path, null);
+    const census = buildCensus(root, tracked);
+    assert.equal(census.refused, 1);
+    const run = await runMain(root);
+    assert.equal(run.code, 0);
+    assert.match(run.lines.find((line) => line.startsWith('citations=')), /refused=1 dead=/);
+  } finally {
+    cleanup(root);
+  }
+});
+
+test('draw reproducible', async () => {
+  const root = makeDrawFixture();
+  const first = path.join(os.tmpdir(), `cite-drift-draw-${process.pid}-a.jsonl`);
+  const second = path.join(os.tmpdir(), `cite-drift-draw-${process.pid}-b.jsonl`);
+  try {
+    const draw = async (labelsPath) => {
+      const lines = [];
+      const errors = [];
+      const code = await main(['--draw', '--seed', '1', '--labels', labelsPath], {
+        repoRoot: root,
+        out: (line) => lines.push(line),
+        err: (line) => errors.push(line),
+      });
+      return { code, lines, errors };
+    };
+    const runA = await draw(first);
+    const runB = await draw(second);
+    assert.equal(runA.code, 0);
+    assert.equal(runB.code, 0);
+    assert.deepEqual(runA.errors, []);
+    assert.deepEqual(runB.errors, []);
+
+    const textA = fs.readFileSync(first, 'utf8');
+    const textB = fs.readFileSync(second, 'utf8');
+    assert.equal(textA, textB);
+
+    const commit = headCommit(root);
+    assert.deepEqual(runA.lines, [
+      `draw: path=${first} seed=1 commit=${commit.slice(0, 12)} rows=40 live=20 constructed=20`,
+    ]);
+
+    const rows = parseLabels(textA);
+    assert.equal(rows.length, 40);
+    assert.deepEqual(labelCounts(rows), { labeled: 20, live: 20, constructed: 20 });
+
+    // No row carries the window text itself: the field set is the whole row.
+    const fields = ['id', 'doc', 'doc_line', 'target', 'target_line', 'window_start', 'window_end', 'commit', 'claim_sha12', 'window_sha12', 'kind', 'verdict', 'labeler'];
+    for (const row of rows) {
+      assert.deepEqual(Object.keys(row).sort(), [...fields].sort());
+      assert.equal(row.commit, commit);
+      if (row.kind === 'live') {
+        assert.equal(row.verdict, null);
+        assert.equal(row.labeler, null);
+        assert.ok(row.window_start <= row.target_line && row.target_line <= row.window_end);
+      } else {
+        assert.equal(row.verdict, 'contradicts');
+        assert.equal(row.labeler, 'construction');
+        assert.ok(row.target_line < row.window_start || row.target_line > row.window_end);
+      }
+    }
+  } finally {
+    cleanup(root);
+    fs.rmSync(first, { force: true });
+    fs.rmSync(second, { force: true });
+  }
+});
+
+test('draw refuses labels', async () => {
+  const { root } = makeFixture();
+  const labelsPath = path.join(os.tmpdir(), `cite-drift-draw-refuse-${process.pid}.jsonl`);
+  try {
+    const operatorRow = {
+      id: 'live-01',
+      doc: ALPHA_DOC,
+      doc_line: 2,
+      target: 'src/inside.ts',
+      target_line: 3,
+      window_start: 1,
+      window_end: 10,
+      commit: '0'.repeat(40),
+      claim_sha12: '0'.repeat(12),
+      window_sha12: '0'.repeat(12),
+      kind: 'live',
+      verdict: 'supports',
+      labeler: 'operator',
+    };
+    fs.writeFileSync(labelsPath, `${JSON.stringify(operatorRow)}\n`);
+    const before = fs.readFileSync(labelsPath, 'utf8');
+    const lines = [];
+    const errors = [];
+    const code = await main(['--draw', '--seed', '1', '--labels', labelsPath], {
+      repoRoot: root,
+      out: (line) => lines.push(line),
+      err: (line) => errors.push(line),
+    });
+    assert.equal(code, 2);
+    assert.deepEqual(errors, [`draw: refusing to overwrite ${labelsPath}, operator labels present`]);
+    assert.equal(fs.readFileSync(labelsPath, 'utf8'), before);
+    assert.deepEqual(lines, []);
+  } finally {
+    cleanup(root);
+    fs.rmSync(labelsPath, { force: true });
+  }
+});
+
+const GATE_DOC = '.skilled/skills/alpha-skill/labels.md';
+const GATE_TARGET = 'src/window.ts';
+
+// A gate fixture whose doc places a row on either side of the comparator: one
+// sentence names a token the window shows, one names a token it lacks, and one
+// names no token at all.
+const makeGateFixture = () => {
+  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cite-drift-gate-'));
+  const targetText = Array.from({ length: 40 }, (_, index) =>
+    (index === 0 ? 'export function resolves() {}\n' : `window line ${index + 1}\n`)).join('');
+  const docText = [
+    '# Labels',
+    'The function `resolves` still sits here.',
+    'The function `vanished` is gone.',
+    'A plain sentence carries no code token.',
+    '',
+  ].join('\n');
+  for (const [rel, text] of [[GATE_DOC, docText], [GATE_TARGET, targetText]]) {
+    const full = path.join(root, rel);
+    fs.mkdirSync(path.dirname(full), { recursive: true });
+    fs.writeFileSync(full, text);
+  }
+  runGit(root, 'init', '-q');
+  runGit(root, 'add', '-A');
+  runGit(root, 'commit', '-q', '-m', 'gate fixture');
+  return { root, commit: headCommit(root) };
+};
+
+const gateRow = (commit, id, docLine, verdict) => ({
+  id,
+  doc: GATE_DOC,
+  doc_line: docLine,
+  target: GATE_TARGET,
+  target_line: docLine,
+  window_start: 1,
+  window_end: 40,
+  commit,
+  claim_sha12: '0'.repeat(12),
+  window_sha12: '0'.repeat(12),
+  kind: verdict === 'supports' ? 'live' : 'constructed',
+  verdict,
+  labeler: verdict === 'supports' ? 'operator' : 'construction',
+});
+
+// Clean rows cite the sentence whose token the window shows and drifted rows
+// cite the sentence with no token, so flag-nothing and identifier overlap are
+// right on exactly the clean rows and flag-nothing wins the baseline tie.
+const gateRows = (commit, clean, drifted) => [
+  ...Array.from({ length: clean }, (_, index) => gateRow(commit, `clean-${index + 1}`, 2, 'supports')),
+  ...Array.from({ length: drifted }, (_, index) => gateRow(commit, `drift-${index + 1}`, 4, 'partial')),
+];
+
+const writeGateLabels = (labelsPath, rows) =>
+  fs.writeFileSync(labelsPath, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
+
+const runGate = async (repoRoot, labelsPath) => {
+  const lines = [];
+  const errors = [];
+  const code = await main(['--labels', labelsPath], { repoRoot, out: (line) => lines.push(line), err: (line) => errors.push(line) });
+  return { code, lines, errors };
+};
+
+test('comparator flags', () => {
+  const sentence = 'The function `vanished` is gone.';
+  assert.deepEqual(identifierTokens(sentence, GATE_TARGET), ['vanished']);
+  assert.equal(flagByIdentifierOverlap(sentence, 'export function resolves() {}', GATE_TARGET), true);
+});
+
+test('comparator no token', () => {
+  const sentence = 'A plain sentence carries no code token.';
+  assert.deepEqual(identifierTokens(sentence, GATE_TARGET), []);
+  assert.equal(flagByIdentifierOverlap(sentence, 'window line 1', GATE_TARGET), false);
+  // The target's own basename is not a token, so naming the file itself never
+  // flags the row on that name.
+  assert.deepEqual(identifierTokens('Read `src/window:4` for the data.', 'src/window'), ['src']);
+});
+
+test('comparator token present', () => {
+  const sentence = 'The function `resolves` still sits here.';
+  assert.deepEqual(identifierTokens(sentence, GATE_TARGET), ['resolves']);
+  assert.equal(flagByIdentifierOverlap(sentence, 'export function resolves() {}', GATE_TARGET), false);
+});
+
+test('label gate 39', async () => {
+  const { root, commit } = makeGateFixture();
+  const labelsPath = path.join(os.tmpdir(), `cite-drift-gate-39-${process.pid}.jsonl`);
+  try {
+    writeGateLabels(labelsPath, gateRows(commit, 20, 19));
+    const run = await runGate(root, labelsPath);
+    assert.equal(run.code, 0);
+    assert.deepEqual(run.errors, []);
+    assert.equal(run.lines.at(-1), 'stop: fewer than 40 labeled rows');
+    assert.ok(run.lines.includes(MARGIN_LINE));
+    assert.ok(run.lines.includes(KEEP_RULE_LINE));
+    assert.ok(!run.lines.some((line) => line.startsWith('comparator ')));
+  } finally {
+    cleanup(root);
+    fs.rmSync(labelsPath, { force: true });
+  }
+});
+
+test('instruction printed', async () => {
+  const { root, commit } = makeGateFixture();
+  const labelsPath = path.join(os.tmpdir(), `cite-drift-instruction-${process.pid}.jsonl`);
+  try {
+    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
+    const run = await runGate(root, labelsPath);
+    assert.equal(run.code, 0);
+    assert.deepEqual(run.errors, []);
+    assert.deepEqual(run.lines.filter((line) => line.startsWith('instruction: ')), [
+      `instruction: "${INSTRUCTION}" sha256=${sha256Hex(INSTRUCTION)}`,
+    ]);
+    assert.ok(run.lines.includes('comparator flag-nothing: 30/40 = 0.7500'));
+    assert.ok(run.lines.includes('comparator identifier-overlap: 30/40 = 0.7500'));
+    assert.ok(run.lines.includes('baseline method: flag-nothing'));
+    assert.ok(run.lines.includes('headroom: baseline=0.7500 margin=0.10'));
+  } finally {
+    cleanup(root);
+    fs.rmSync(labelsPath, { force: true });
+  }
+});
+
+test('no headroom', async () => {
+  const { root, commit } = makeGateFixture();
+  const labelsPath = path.join(os.tmpdir(), `cite-drift-no-headroom-${process.pid}.jsonl`);
+  try {
+    writeGateLabels(labelsPath, gateRows(commit, 38, 2));
+    const run = await runGate(root, labelsPath);
+    assert.equal(run.code, 0);
+    assert.deepEqual(run.errors, []);
+    assert.ok(run.lines.includes('comparator flag-nothing: 38/40 = 0.9500'));
+    assert.equal(run.lines.at(-1), 'no headroom');
+    assert.ok(!run.lines.some((line) => line.startsWith('instruction: ')));
+  } finally {
+    cleanup(root);
+    fs.rmSync(labelsPath, { force: true });
+  }
+});
+
+test('underpowered', async () => {
+  const { root, commit } = makeGateFixture();
+  const labelsPath = path.join(os.tmpdir(), `cite-drift-underpowered-${process.pid}.jsonl`);
+  try {
+    writeGateLabels(labelsPath, gateRows(commit, 36, 4));
+    const run = await runGate(root, labelsPath);
+    assert.equal(run.code, 0);
+    assert.deepEqual(run.errors, []);
+    assert.ok(run.lines.includes('comparator flag-nothing: 36/40 = 0.9000'));
+    assert.ok(run.lines.includes('headroom: baseline=0.9000 margin=0.10'));
+    assert.equal(run.lines.at(-1), 'underpowered: winnable=4');
+  } finally {
+    cleanup(root);
+    fs.rmSync(labelsPath, { force: true });
+  }
+});
+
+test('default zero calls', async () => {
+  const { root, bin } = makeFixture();
+  const labelsPath = path.join(os.tmpdir(), `cite-drift-default-${process.pid}.jsonl`);
+  const logPath = path.join(os.tmpdir(), `cite-drift-default-stub-${process.pid}.log`);
+  const previousPath = process.env.PATH;
+  const previousLog = process.env.STUB_LOG;
+  try {
+    process.env.PATH = `${bin}${path.delimiter}${previousPath ?? ''}`;
+    process.env.STUB_LOG = logPath;
+    const run = await runGate(root, labelsPath);
+    assert.equal(run.code, 0);
+    assert.deepEqual(run.errors, []);
+    assert.ok(run.lines.some((line) => line.startsWith('citations=')));
+    assert.equal(run.lines.at(-1), 'stop: fewer than 40 labeled rows');
+    assert.ok(!fs.existsSync(labelsPath));
+    assert.ok(!fs.existsSync(logPath));
+    assert.equal(runGit(root, 'status', '--porcelain').toString(), '');
+  } finally {
+    if (previousPath === undefined) delete process.env.PATH; else process.env.PATH = previousPath;
+    if (previousLog === undefined) delete process.env.STUB_LOG; else process.env.STUB_LOG = previousLog;
+    cleanup(root);
+    fs.rmSync(labelsPath, { force: true });
+    fs.rmSync(logPath, { force: true });
+  }
+});
+
+test('verdict keep', () => {
+  const counts = { backend: 'deem', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, TP: 20, FP: 0, F: 0 };
+  const decision = decideVerdict(counts);
+  assert.equal(decision.verdict, 'keep');
+  const line = verdictLine({ ...counts, ...decision }, 'abc123abc123', 'model=deem-0.8-v1 model_commit=aaa source_commit=bbb');
+  assert.ok(line.startsWith('verdict deem: keep K=20 M=20 A=140 B=60 W=20 L=0 TP=20 FP=0 F=n/a p='));
+  assert.ok(line.endsWith('labels_sha256=abc123abc123 model=deem-0.8-v1 model_commit=aaa source_commit=bbb'));
+});
+
+test('verdict kill precision', () => {
+  const counts = { backend: 'deem', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, TP: 1, FP: 4, F: 0 };
+  const decision = decideVerdict(counts);
+  assert.equal(decision.verdict, 'kill (precision)');
+  assert.ok(verdictLine({ ...counts, ...decision }, 'abc123abc123', '').startsWith('verdict deem: kill (precision) '));
+});
+
+test('verdict stop coverage', () => {
+  const counts = { backend: 'deem', K: 10, M: 8, A: 70, B: 30, W: 8, L: 0, TP: 8, FP: 0, F: 0 };
+  const decision = decideVerdict(counts);
+  assert.equal(decision.verdict, 'stop (coverage)');
+  assert.ok(verdictLine({ ...counts, ...decision }, 'abc123abc123', '').startsWith('verdict deem: stop (coverage) '));
+});
+
+test('verdict stop margin', () => {
+  const counts = { backend: 'deem', K: 20, M: 20, A: 60, B: 60, W: 0, L: 0, TP: 20, FP: 0, F: 0 };
+  const decision = decideVerdict(counts);
+  assert.equal(decision.verdict, 'stop (margin)');
+  assert.ok(verdictLine({ ...counts, ...decision }, 'abc123abc123', '').startsWith('verdict deem: stop (margin) '));
+});
+
+test('verdict requalify', () => {
+  const stored = { columns: { deem: { modelCommit: 'aaa000000000', sourceCommit: 'bbb000000000' } } };
+  const summary = {
+    backend: 'deem', verdict: 'keep', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, TP: 20, FP: 0, F: 0, p: 0.5,
+    model: 'deem-0.8-v1', modelCommit: 'ccc111111111', sourceCommit: 'bbb000000000', stored,
+  };
+  const lines = verdictLine(summary, 'abc123abc123', 'model=deem-0.8-v1 model_commit=ccc111111111 source_commit=bbb000000000').split('\n');
+  assert.equal(lines[0], 'requalify: model commit changed');
+  assert.ok(lines[1].startsWith('verdict deem: keep '));
+
+  const jevSummary = {
+    backend: 'jev', verdict: 'keep', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, TP: 20, FP: 0, F: 0, p: 0.5,
+    provider: 'official', model: 'gpt-x', stored: { columns: { jev: { provider: 'other', model: 'gpt-x' } } },
+  };
+  const jevLines = verdictLine(jevSummary, 'abc123abc123', 'jev_version=0.6.2 provider=official model=gpt-x').split('\n');
+  assert.equal(jevLines[0], 'requalify: model changed');
+  assert.ok(jevLines[1].startsWith('verdict jev: keep '));
+});
+
+// The gate fixture holds no stub binaries, so a run that must answer the Deem
+// protocol gets them on its own PATH entry.
+const addStubBin = (root) => {
+  const bin = path.join(root, 'bin');
+  fs.mkdirSync(bin, { recursive: true });
+  for (const name of ['cli-deem', 'jev']) fs.writeFileSync(path.join(bin, name), STUB_SOURCE, { mode: 0o755 });
+  return bin;
+};
+
+const deemEnv = (root, extra = {}) => ({
+  ...cleanEnv(),
+  PATH: `${path.join(root, 'bin')}${path.delimiter}${process.env.PATH ?? ''}`,
+  STUB_LOG: path.join(root, 'stub.log'),
+  ...extra,
+});
+
+const readStubLog = (root) => {
+  const logPath = path.join(root, 'stub.log');
+  if (!fs.existsSync(logPath)) return [];
+  return fs.readFileSync(logPath, 'utf8').split('\n').filter((line) => line.length > 0);
+};
+
+const runWithEnv = async (argv, repoRoot, env) => {
+  const lines = [];
+  const errors = [];
+  const code = await main(argv, { repoRoot, out: (line) => lines.push(line), err: (line) => errors.push(line), env });
+  return { code, lines, errors };
+};
+
+test('deem gate pass', async () => {
+  const { root, commit } = makeGateFixture();
+  const labelsPath = path.join(os.tmpdir(), `cite-drift-deem-gate-${process.pid}.jsonl`);
+  const outDir = path.join(root, 'out');
+  try {
+    addStubBin(root);
+    const env = deemEnv(root);
+    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
+    const base = await runGate(root, labelsPath);
+    const run = await runWithEnv(['--labels', labelsPath, '--deem', '--out', outDir], root, env);
+    assert.equal(run.code, 0);
+    assert.deepEqual(run.errors, []);
+    assert.deepEqual(run.lines.slice(0, base.lines.length), base.lines);
+    assert.equal(run.lines[base.lines.length], 'deem: health backend=torch model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource');
+    assert.ok(run.lines.includes('deem: nothing leaves the machine; planned calls: 40; estimated wall time: 2.4 s at 60.5 ms per call, the noul p50 in deem-local.md'));
+    assert.ok(run.lines.some((line) => line.startsWith('column deem: rows=40 measured=40 unmeasured=0 latency_p50_ms=')));
+    assert.ok(run.lines.includes('brier deem: 0.6100'));
+    assert.ok(run.lines.includes('flips: not applicable (deem noul)'));
+    assert.ok(run.lines.some((line) => line.startsWith('verdict deem: kill (precision) K=40 M=40 A=10 B=30 W=10 L=30 TP=10 FP=30 F=n/a p=')));
+
+    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
+    assert.equal(calls.length, 40);
+    for (const call of calls) {
+      assert.deepEqual(Object.keys(call).sort(), ['backend', 'exitCode', 'flag', 'modelCommit', 'modelId', 'probability', 'rerun', 'rowId', 'sourceCommit', 'status', 'wallMs']);
+      assert.equal(call.backend, 'deem');
+      assert.equal(call.status, 'measured');
+      assert.equal(call.exitCode, 0);
+      assert.equal(call.probability, 0.9);
+      assert.equal(call.flag, true);
+      assert.equal(call.modelId, 'deem-0.8-v1');
+      assert.equal(call.modelCommit, 'stubmodel');
+      assert.equal(call.sourceCommit, 'stubsource');
+    }
+
+    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
+    assert.deepEqual(Object.keys(report).sort(), [
+      'baselineMethod', 'census', 'columns', 'commit', 'comparators', 'headroom',
+      'keepRule', 'labels', 'margin', 'skipped', 'stopped', 'winnable',
+    ]);
+    assert.deepEqual(Object.keys(report.labels).sort(), ['labeled', 'path', 'rows', 'sha256']);
+    assert.equal(report.labels.path, labelsPath);
+    assert.equal(report.labels.rows, 40);
+    assert.equal(report.labels.labeled, 40);
+    assert.equal(report.commit, commit);
+    assert.equal(report.baselineMethod, 'flag-nothing');
+    assert.equal(report.headroom, true);
+    assert.equal(report.winnable, 10);
+    assert.ok(report.columns.deem.line.startsWith('verdict deem: '));
+    assert.deepEqual(report.stopped, {});
+    assert.deepEqual(report.skipped, {});
+
+    const log = readStubLog(root);
+    assert.equal(log.filter((line) => line.startsWith('cli-deem\thealth')).length, 1);
+    assert.equal(log.filter((line) => line.startsWith('cli-deem\tnoul')).length, 40);
+  } finally {
+    cleanup(root);
+    fs.rmSync(labelsPath, { force: true });
+  }
+});
+
+test('deem stub backend', async () => {
+  const { root, commit } = makeGateFixture();
+  const labelsPath = path.join(os.tmpdir(), `cite-drift-deem-stub-${process.pid}.jsonl`);
+  const outDir = path.join(root, 'out');
+  try {
+    addStubBin(root);
+    const env = deemEnv(root, { STUB_DEEM_HEALTH: 'stub' });
+    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
+    const base = await runGate(root, labelsPath);
+    const run = await runWithEnv(['--labels', labelsPath, '--deem', '--out', outDir], root, env);
+    assert.equal(run.code, 0);
+    assert.deepEqual(run.errors, []);
+    assert.deepEqual(run.lines, [...base.lines, 'deem arm skipped: stub backend']);
+    assert.equal(readStubLog(root).length, 1);
+
+    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
+    assert.equal(report.skipped.deem, 'deem arm skipped: stub backend');
+    assert.deepEqual(report.columns, {});
+    assert.deepEqual(report.stopped, {});
+  } finally {
+    cleanup(root);
+    fs.rmSync(labelsPath, { force: true });
+  }
+});
+
+test('deem exit 4 changed pair', async () => {
+  const { root, commit } = makeGateFixture();
+  const labelsPath = path.join(os.tmpdir(), `cite-drift-deem-exit4-${process.pid}.jsonl`);
+  const outDir = path.join(root, 'out');
+  try {
+    addStubBin(root);
+    const env = deemEnv(root, {
+      STUB_DEEM_NOUL_EXIT: '4',
+      STUB_DEEM_RECHECK_COMMIT: 'stubmodel2',
+      STUB_DEEM_RECHECK_SOURCE: 'stubsource2',
+    });
+    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
+    const run = await runWithEnv(['--labels', labelsPath, '--deem', '--out', outDir], root, env);
+    assert.equal(run.code, 0);
+    assert.deepEqual(run.errors, []);
+    assert.ok(run.lines.includes('deem arm stopped: model commit changed mid-run'));
+    assert.ok(run.lines.includes('deem: partial rows=0'));
+    assert.ok(!run.lines.some((line) => line.startsWith('verdict deem:')));
+
+    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
+    assert.equal(calls.length, 1);
+    assert.equal(calls[0].exitCode, 4);
+    assert.equal(calls[0].status, 'unmeasured');
+    assert.equal(calls[0].modelCommit, 'stubmodel');
+
+    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
+    assert.deepEqual(report.stopped.deem, { line: 'deem arm stopped: model commit changed mid-run', partialRows: 0 });
+    assert.deepEqual(report.columns, {});
+    assert.equal(readStubLog(root).filter((line) => line.startsWith('cli-deem\thealth')).length, 2);
+  } finally {
+    cleanup(root);
+    fs.rmSync(labelsPath, { force: true });
+  }
+});
+
+test('--out required', async () => {
+  const { root } = makeFixture();
+  try {
+    const env = deemEnv(root);
+    const run = await runWithEnv(['--jev'], root, env);
+    assert.equal(run.code, 2);
+    assert.deepEqual(run.lines, []);
+    assert.match(run.errors.join('\n'), /--out/);
+    assert.ok(!fs.existsSync(path.join(root, 'stub.log')));
+    assert.ok(!fs.existsSync(path.join(root, 'out')));
+  } finally {
+    cleanup(root);
+  }
+});
+
+test('jev gate pass', async () => {
+  const { root, commit } = makeGateFixture();
+  const labelsPath = path.join(os.tmpdir(), `cite-drift-jev-gate-${process.pid}.jsonl`);
+  const outDir = path.join(root, 'out');
+  try {
+    addStubBin(root);
+    const env = deemEnv(root);
+    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
+    const base = await runGate(root, labelsPath);
+    const run = await runWithEnv(['--labels', labelsPath, '--jev', '--out', outDir], root, env);
+    assert.equal(run.code, 0);
+    assert.deepEqual(run.errors, []);
+    assert.deepEqual(run.lines.slice(0, base.lines.length), base.lines);
+
+    const tail = run.lines.slice(base.lines.length);
+    assert.equal(tail.length, 6);
+    assert.equal(tail[0], `jev: path=${path.join(root, 'bin', 'jev')} provider=official`);
+    assert.match(tail[1], /^jev: payload: committed skill-doc sentences and tracked-file windows; planned calls: 121; estimated input tokens: \d+$/);
+    assert.equal(tail[2], 'jev: auth test provider=official model=stub-model');
+    assert.ok(tail[3].startsWith('column jev: rows=40 measured=40 unmeasured=0 latency_p50_ms='));
+    assert.ok(tail[3].includes(' latency_p95_ms='));
+    assert.equal(tail[4], 'brier jev: 0.6100');
+    assert.ok(tail[5].startsWith('verdict jev: kill (precision) K=40 M=40 A=10 B=30 W=10 L=30 TP=10 FP=30 F=0 p='));
+    assert.ok(tail[5].endsWith('jev_version=0.6.2 provider=official model=stub-model'));
+
+    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
+    assert.equal(calls.length, 121);
+    assert.deepEqual(Object.keys(calls[0]).sort(), ['backend', 'exitCode', 'flag', 'jevVersion', 'model', 'probability', 'provider', 'rerun', 'rowId', 'status', 'wallMs']);
+    for (const call of calls) {
+      assert.equal(call.backend, 'jev');
+      assert.equal(call.provider, 'official');
+      assert.equal(call.model, 'stub-model');
+      assert.equal(call.jevVersion, '0.6.2');
+      assert.equal(call.exitCode, 0);
+    }
+    const authCalls = calls.filter((call) => call.rowId === null);
+    assert.equal(authCalls.length, 1);
+    assert.equal(authCalls[0].status, 'measured');
+    const rowCalls = calls.filter((call) => call.rowId !== null);
+    assert.equal(rowCalls.length, 120);
+    for (const call of rowCalls) {
+      assert.equal(call.status, 'measured');
+      assert.equal(call.probability, 0.9);
+      assert.equal(call.flag, true);
+      assert.ok(call.rerun >= 0 && call.rerun < 3);
+    }
+
+    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
+    assert.ok(report.columns.jev.line.startsWith('verdict jev: '));
+    assert.deepEqual(report.stopped, {});
+    assert.deepEqual(report.skipped, {});
+  } finally {
+    cleanup(root);
+    fs.rmSync(labelsPath, { force: true });
+  }
+});
+
+test('jev no credential', async () => {
+  const { root, commit } = makeGateFixture();
+  const labelsPath = path.join(os.tmpdir(), `cite-drift-jev-cred-${process.pid}.jsonl`);
+  const outDir = path.join(root, 'out');
+  try {
+    addStubBin(root);
+    const env = deemEnv(root, { STUB_AUTH_STATUS_EXIT: '3' });
+    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
+    const base = await runGate(root, labelsPath);
+    const run = await runWithEnv(['--labels', labelsPath, '--jev', '--out', outDir], root, env);
+    assert.equal(run.code, 0);
+    assert.deepEqual(run.errors, []);
+    assert.deepEqual(run.lines, [
+      ...base.lines,
+      `jev: path=${path.join(root, 'bin', 'jev')} provider=official`,
+      'jev arm skipped: no credential',
+    ]);
+    assert.deepEqual(readStubLog(root), [
+      'jev\t--version',
+      'jev\tauth status --provider official',
+    ]);
+
+    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
+    assert.equal(report.skipped.jev, 'jev arm skipped: no credential');
+    assert.deepEqual(report.columns, {});
+    assert.deepEqual(report.stopped, {});
+  } finally {
+    cleanup(root);
+    fs.rmSync(labelsPath, { force: true });
+  }
+});
+
+test('jev one provider', async () => {
+  const { root, commit } = makeGateFixture();
+  try {
+    addStubBin(root);
+    const env = deemEnv(root);
+    const gate = jevGate({ out: () => {}, env, timeoutMs: 90000 });
+    assert.equal(gate.passed, true);
+    assert.equal(gate.provider, 'official');
+    assert.equal(gate.path, path.join(root, 'bin', 'jev'));
+
+    const row = gateRow(commit, 'live-1', 2, 'supports');
+    const windows = new Map([[row.id, {
+      sentence: 'The function `resolves` still sits here.',
+      windowText: 'export function resolves() {}',
+    }]]);
+    const result = await runJevArm(
+      { rows: [row], windows, labelsSha: 'abc123abc123' },
+      gate,
+      {
+        out: () => {},
+        env,
+        timeoutMs: 90000,
+        backoffMs: 1,
+        callLog: { append() {} },
+        stored: null,
+      },
+    );
+    assert.equal(result.stopped, undefined);
+    assert.ok(result.column.line.startsWith('verdict jev: kill (precision) K=1 M=1 A=0 B=1 W=0 L=1 TP=0 FP=1 F=0 p='));
+    assert.ok(result.column.line.endsWith('labels_sha256=abc123abc123 jev_version=0.6.2 provider=official model=stub-model'));
+
+    const log = readStubLog(root);
+    const versionIndex = log.indexOf('jev\t--version');
+    assert.ok(versionIndex >= 0);
+    const calls = log.slice(versionIndex + 1).filter((line) => line.startsWith('jev\t'));
+    assert.equal(calls.filter((line) => line.startsWith('jev\tnoul')).length, 3);
+    for (const line of calls) {
+      assert.ok(line.includes('--provider official'));
+    }
+  } finally {
+    cleanup(root);
+  }
+});
+
+test('jev exit 3 after gate', async () => {
+  const { root, commit } = makeGateFixture();
+  const labelsPath = path.join(os.tmpdir(), `cite-drift-jev-exit3-${process.pid}.jsonl`);
+  const outDir = path.join(root, 'out');
+  try {
+    addStubBin(root);
+    const env = deemEnv(root, { STUB_JEV_NOUL_EXIT: '3' });
+    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
+    const base = await runGate(root, labelsPath);
+    const run = await runWithEnv(['--labels', labelsPath, '--jev', '--out', outDir], root, env);
+    assert.equal(run.code, 0);
+    assert.deepEqual(run.errors, []);
+    const tail = run.lines.slice(base.lines.length);
+    assert.equal(tail[0], `jev: path=${path.join(root, 'bin', 'jev')} provider=official`);
+    assert.match(tail[1], /^jev: payload: committed skill-doc sentences and tracked-file windows; planned calls: 121; estimated input tokens: \d+$/);
+    assert.equal(tail[2], 'jev: auth test provider=official model=stub-model');
+    assert.deepEqual(tail.slice(3), ['jev arm stopped: key rejected', 'jev: partial rows=0']);
+    assert.ok(!run.lines.some((line) => line.startsWith('verdict jev:')));
+
+    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
+    assert.equal(calls.length, 2);
+    assert.equal(calls[0].rowId, null);
+    assert.equal(calls[0].exitCode, 0);
+    assert.equal(calls[1].rowId, 'clean-1');
+    assert.equal(calls[1].exitCode, 3);
+    assert.equal(calls[1].status, 'unmeasured');
+
+    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
+    assert.deepEqual(report.stopped.jev, { line: 'jev arm stopped: key rejected', partialRows: 0 });
+    assert.deepEqual(report.columns, {});
+    assert.equal(readStubLog(root).filter((line) => line.startsWith('jev\tnoul')).length, 1);
+  } finally {
+    cleanup(root);
+    fs.rmSync(labelsPath, { force: true });
+  }
+});
+
```
