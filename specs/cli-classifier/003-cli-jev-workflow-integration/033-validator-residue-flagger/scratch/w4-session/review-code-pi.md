# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (DeepSeek V4.1 Flash). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs`
- `.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger/scratch/w4-build/design.md`, `specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger/scratch/w4-build/rulings.md` (rulings override the design) and `specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger/scratch/w4-session/notes.md` (the session's runs; there is no build-evidence.md). This review covers the code only; the docs are reviewed separately. Step 1 was written by MiMo and every later step (including the fixes 7f, 7g and 7h) by DeepSeek; review the whole of both files. And the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
diff --git a/.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs b/.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs
new file mode 100644
index 0000000000..62c03298b3
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs
@@ -0,0 +1,1645 @@
+#!/usr/bin/env node
+// ╔══════════════════════════════════════════════════════════════════════════╗
+// ║ score-residue-flagger — offline residue-flagger measurement census       ║
+// ╚══════════════════════════════════════════════════════════════════════════╝
+'use strict';
+
+/**
+ * score-residue-flagger.cjs — counts finding tables and resolvable citations
+ * across committed review documents. The default run is a census
+ * only: it spawns no backend call and writes no file.
+ */
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 1. IMPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+const { spawn, spawnSync } = require('child_process');
+const crypto = require('crypto');
+const fs = require('fs');
+const path = require('path');
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 2. CONSTANTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+const SCRIPT_DIR = __dirname;
+const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
+const LABELS_PATH = path.join(SCRIPT_DIR, 'residue-flagger-labels.jsonl');
+const CATEGORIES = ['correctness', 'traceability'];
+const CANONICAL_DIMENSIONS = ['correctness', 'security', 'traceability', 'maintainability'];
+const LABEL_GATE = 100;
+const ROWS_TOTAL = 100;
+const POSITIVES = 50;
+const NEGATIVES = 50;
+const PER_CATEGORY = 25;
+const WINDOW_RADIUS = 10;
+const NEGATIVE_MIN_GAP = 20;
+const FLAG_AT = 0.5;
+const JEV_RERUNS = 3;
+const MARGIN_LINE = 'margin: 0.10';
+const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, precision 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M (jev only)';
+const USAGE = 'usage: score-residue-flagger.cjs [--labels <file>] [--draw --seed <n> | --jev | --deem] [--out <dir>]';
+const INSTRUCTION_CORRECTNESS = 'Does this passage claim behavior that its own text shows to be wrong or inconsistent?';
+const INSTRUCTION_TRACEABILITY = 'Does this passage name a spec item or requirement that the text it describes does not match or does not contain?';
+const JEV_VERSION = 'jev 0.6.2';
+const DEEM_MODEL = 'deem-0.8-v1';
+const HEALTH_TIMEOUT_MS = 2000;
+const CALL_TIMEOUT_MS = 90000;
+const BACKOFF_MS = 2000;
+const DEEM_P50_MS = 60.5;
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 3. CENSUS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Run one git command against a repository and return its stdout.
+ *
+ * The caller's git redirector variables are stripped first, so a fixture
+ * repository can never inherit an outer worktree's pointers.
+ *
+ * @param {string} repoRoot - Repository path handed to git as -C.
+ * @param {string[]} args - Git arguments after the -C flag.
+ * @returns {string} The command's standard output.
+ * @throws {Error} When git exits non-zero.
+ */
+function git(repoRoot, args) {
+  const env = { ...process.env };
+  for (const key of Object.keys(env)) {
+    if (key.startsWith('GIT_')) delete env[key];
+  }
+  // A repository's full path list and file reads exceed the 1 MB spawn default.
+  const result = spawnSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8', env, maxBuffer: 268435456 });
+  if (result.status !== 0) {
+    throw new Error(`git ${args.join(' ')} exited ${result.status}`);
+  }
+  return result.stdout;
+}
+
+/**
+ * List the repository's tracked paths in git's own order.
+ *
+ * @param {string} repoRoot - Repository path.
+ * @returns {string[]} Every tracked path.
+ */
+function trackedFiles(repoRoot) {
+  return git(repoRoot, ['ls-files', '-z']).split('\0').filter((entry) => entry.length > 0);
+}
+
+/**
+ * Resolve the repository's current HEAD commit.
+ *
+ * @param {string} repoRoot - Repository path.
+ * @returns {string} The full HEAD sha.
+ */
+function headCommit(repoRoot) {
+  return git(repoRoot, ['rev-parse', 'HEAD']).trim();
+}
+
+/**
+ * Read one tracked file's text at a commit.
+ *
+ * Every corpus read goes through git, so a dirty worktree can never
+ * substitute for the committed tree under measurement.
+ *
+ * @param {string} repoRoot - Repository path.
+ * @param {string} commit - Commit sha to read at.
+ * @param {string} relPath - Repository-relative file path.
+ * @returns {string} The file's text at that commit.
+ * @throws {Error} When the path does not exist at that commit.
+ */
+function readAtCommit(repoRoot, commit, relPath) {
+  return git(repoRoot, ['show', `${commit}:${relPath}`]);
+}
+
+/**
+ * Select the review corpus from a tracked-path list: markdown under specs/
+ * that lives in a review or ai-council folder, never in a context or scratch
+ * folder.
+ *
+ * @param {string[]} tracked - Tracked paths from trackedFiles.
+ * @returns {string[]} The matching paths in tracked order.
+ */
+function walkReviewFiles(tracked) {
+  return tracked.filter((entry) =>
+    entry.startsWith('specs/') &&
+    entry.endsWith('.md') &&
+    (entry.includes('/review/') || entry.includes('/ai-council/')) &&
+    !entry.includes('/context/') &&
+    !entry.includes('/scratch/'));
+}
+
+/**
+ * Parse the finding tables of one review document.
+ *
+ * A recognized header names a severity column, a dimension column and a
+ * location column; its shape is those three names joined by pipes. Only rows
+ * whose severity cell is P0, P1 or P2 become finding rows. A table whose
+ * header lacks any of the three is recorded as skipped with its header line
+ * only when one of its data rows holds a cell exactly P0, P1 or P2.
+ * Dimension cells map onto the canonical stems by substring, else 'other'.
+ *
+ * @param {string} text - The document's full text.
+ * @param {string} file - The review file the text came from.
+ * @returns {{tables: Array<{shape: string, headerLine: number, rows: Array<{line: number, severity: string, dimension: string, location: string}>}>, skipped: Array<{line: number, header: string}>}} The parsed tables and skipped headers.
+ */
+function parseFindingTables(text, file) {
+  const tables = [];
+  const skipped = [];
+  const lines = String(text).split('\n');
+  const cellsOf = [];
+  for (const line of lines) {
+    const trimmed = line.trim();
+    if (!trimmed.startsWith('|')) {
+      cellsOf.push(null);
+      continue;
+    }
+    const parts = trimmed.split('|');
+    if (parts[0].trim() === '') parts.shift();
+    if (parts.length > 0 && parts[parts.length - 1].trim() === '') parts.pop();
+    cellsOf.push(parts.map((cell) => cell.trim()));
+  }
+  const isDelimiter = cellsOf.map((cells) =>
+    cells !== null && cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell)));
+  let i = 0;
+  while (i < lines.length) {
+    const headerCells = cellsOf[i];
+    const delimiterCells = i + 1 < lines.length ? cellsOf[i + 1] : null;
+    if (headerCells === null || delimiterCells === null || !isDelimiter[i + 1] || delimiterCells.length !== headerCells.length) {
+      i += 1;
+      continue;
+    }
+    const headerLine = i + 1;
+    let sevIdx = -1;
+    let dimIdx = -1;
+    let locIdx = -1;
+    for (let c = 0; c < headerCells.length; c += 1) {
+      const name = headerCells[c];
+      if (sevIdx === -1 && (name === 'Severity' || name === 'Sev')) sevIdx = c;
+      else if (dimIdx === -1 && name === 'Dimension') dimIdx = c;
+      else if (locIdx === -1 && (name === 'File:Line' || name === 'File' || name === 'Evidence')) locIdx = c;
+    }
+    const recognized = sevIdx !== -1 && dimIdx !== -1 && locIdx !== -1;
+    const table = recognized ? { shape: [headerCells[sevIdx], headerCells[dimIdx], headerCells[locIdx]].join('|'), headerLine, rows: [] } : null;
+    let holdsSeverity = false;
+    let j = i + 2;
+    while (j < lines.length && cellsOf[j] !== null) {
+      const data = cellsOf[j];
+      if (data.some((cell) => cell === 'P0' || cell === 'P1' || cell === 'P2')) {
+        holdsSeverity = true;
+      }
+      if (table !== null && data.length > locIdx) {
+        const severity = data[sevIdx];
+        if (severity === 'P0' || severity === 'P1' || severity === 'P2') {
+          const dimLower = (data[dimIdx] || '').toLowerCase();
+          let dimension = 'other';
+          if (dimLower.includes('correctness')) dimension = 'correctness';
+          else if (dimLower.includes('security')) dimension = 'security';
+          else if (dimLower.includes('traceab')) dimension = 'traceability';
+          else if (dimLower.includes('maintainab')) dimension = 'maintainability';
+          table.rows.push({ line: j + 1, severity, dimension, location: data[locIdx] || '' });
+        }
+      }
+      j += 1;
+    }
+    if (table !== null) {
+      tables.push(table);
+    } else if (holdsSeverity) {
+      skipped.push({ line: headerLine, header: lines[i].trim() });
+    }
+    i = j;
+  }
+  return { tables, skipped };
+}
+
+/**
+ * Find the commit that added a path.
+ *
+ * @param {string} repoRoot - Repository path.
+ * @param {string} relPath - Repository-relative file path.
+ * @returns {string|null} The adding commit's sha, or null when the path was never added.
+ */
+function addingCommit(repoRoot, relPath) {
+  const out = git(repoRoot, ['log', '--diff-filter=A', '-1', '--format=%H', '--', relPath]).trim();
+  return out.length > 0 ? out : null;
+}
+
+/**
+ * Resolve the commit a review file's findings are judged against: the first
+ * parent of the commit that added it. A root commit has no parent to review
+ * against, so its rows leave the frame.
+ *
+ * @param {string} repoRoot - Repository path.
+ * @param {string} relPath - Repository-relative review file path.
+ * @returns {string|null} The reviewed commit's sha, or null when there is none.
+ */
+function reviewedCommit(repoRoot, relPath) {
+  const added = addingCommit(repoRoot, relPath);
+  if (added === null) return null;
+  const parents = git(repoRoot, ['log', '-1', '--format=%P', added]).trim();
+  if (parents === '') return null;
+  return parents.split(' ')[0];
+}
+
+/**
+ * Resolve one location cell to a cited line.
+ *
+ * The cell's first path token wins. A basename starting .env, or a path
+ * outside the tracked list, is refused before anything opens. A missing line,
+ * a line past the file's end at the reviewed commit, or a file absent at that
+ * commit, is dropped.
+ *
+ * @param {string} cell - The location cell text.
+ * @param {{commit: string, tracked: string[], repoRoot: string}} ctx - The reviewed commit, the tracked paths and the repository path.
+ * @returns {{status: 'resolved'|'refused'|'dropped', path: string|null, line: number|null}} Where the cell landed.
+ */
+function resolveLocation(cell, { commit, tracked, repoRoot }) {
+  const trackedSet = new Set(tracked);
+  for (const token of String(cell).split(/\s+/)) {
+    if (token.length === 0) continue;
+    let cellPath = token;
+    let cellLine = null;
+    const withLine = /^(.*):([0-9]+)$/.exec(token);
+    if (withLine !== null) {
+      cellPath = withLine[1];
+      cellLine = Number(withLine[2]);
+    }
+    const base = path.basename(cellPath);
+    if (base.startsWith('.env')) {
+      return { status: 'refused', path: cellPath, line: cellLine };
+    }
+    if (!cellPath.endsWith('.md')) continue;
+    if (!trackedSet.has(cellPath)) {
+      return { status: 'refused', path: cellPath, line: cellLine };
+    }
+    if (cellLine === null) {
+      return { status: 'dropped', path: cellPath, line: null };
+    }
+    let cited;
+    try {
+      cited = readAtCommit(repoRoot, commit, cellPath);
+    } catch {
+      return { status: 'dropped', path: cellPath, line: cellLine };
+    }
+    const citedLines = cited.split('\n');
+    if (citedLines.length > 0 && citedLines[citedLines.length - 1] === '') citedLines.pop();
+    if (cellLine < 1 || cellLine > citedLines.length) {
+      return { status: 'dropped', path: cellPath, line: cellLine };
+    }
+    return { status: 'resolved', path: cellPath, line: cellLine };
+  }
+  return { status: 'dropped', path: null, line: null };
+}
+
+/**
+ * Census the corpus at HEAD: review files read, recognized tables, finding
+ * rows, and where each row's location landed.
+ *
+ * Review documents read at HEAD; cited lines resolve at the row's reviewed
+ * commit. Rows of a review file with no reviewed commit count as dropped.
+ *
+ * @param {string} repoRoot - Repository path.
+ * @param {string[]} tracked - Tracked paths from trackedFiles.
+ * @returns {{commit: string, files: number, tables: number, rows: number, bySeverity: Object<string, number>, byDimension: Object<string, number>, byShape: Object<string, {tables: number, rows: number}>, skipped: Array<{file: string, line: number, header: string}>, resolvable: Object<string, number>, refused: number, dropped: number}} The census counts.
+ */
+function buildCensus(repoRoot, tracked) {
+  const commit = headCommit(repoRoot);
+  const files = walkReviewFiles(tracked);
+  let tables = 0;
+  let rows = 0;
+  let refused = 0;
+  let dropped = 0;
+  const bySeverity = { P0: 0, P1: 0, P2: 0 };
+  const byDimension = {};
+  for (const dimension of [...CANONICAL_DIMENSIONS, 'other']) byDimension[dimension] = 0;
+  const byShape = {};
+  const skipped = [];
+  const resolvable = {};
+  for (const category of CATEGORIES) resolvable[category] = 0;
+  for (const file of files) {
+    const parsed = parseFindingTables(readAtCommit(repoRoot, commit, file), file);
+    // Resolving a reviewed commit costs two git log calls, so a file pays for
+    // one only when it holds a parsed row: a rowless file's commit is unused.
+    const reviewed = parsed.tables.some((table) => table.rows.length > 0) ? reviewedCommit(repoRoot, file) : null;
+    for (const table of parsed.tables) {
+      tables += 1;
+      const shape = byShape[table.shape] || (byShape[table.shape] = { tables: 0, rows: 0 });
+      shape.tables += 1;
+      for (const row of table.rows) {
+        rows += 1;
+        shape.rows += 1;
+        bySeverity[row.severity] += 1;
+        byDimension[row.dimension] += 1;
+        if (reviewed === null) {
+          dropped += 1;
+          continue;
+        }
+        const hit = resolveLocation(row.location, { commit: reviewed, tracked, repoRoot });
+        if (hit.status === 'refused') refused += 1;
+        else if (hit.status === 'dropped') dropped += 1;
+        else if (CATEGORIES.includes(row.dimension)) resolvable[row.dimension] += 1;
+      }
+    }
+    for (const entry of parsed.skipped) skipped.push({ file, line: entry.line, header: entry.header });
+  }
+  return { commit, files: files.length, tables, rows, bySeverity, byDimension, byShape, skipped, resolvable, refused, dropped };
+}
+
+/**
+ * Format a census as its report lines: the census line, the severity and
+ * dimension tallies, one sorted header line per recognized shape, one sorted
+ * skip line per skipped table, then the resolvable tally.
+ *
+ * @param {{commit: string, files: number, tables: number, rows: number, bySeverity: Object<string, number>, byDimension: Object<string, number>, byShape: Object<string, {tables: number, rows: number}>, skipped: Array<{file: string, line: number, header: string}>, resolvable: Object<string, number>, refused: number, dropped: number}} census - A census from buildCensus.
+ * @returns {string[]} The census lines, in report order.
+ */
+function censusLines(census) {
+  const lines = [];
+  lines.push(`census: commit=${census.commit.slice(0, 12)} files=${census.files} tables=${census.tables} rows=${census.rows} skipped=${census.skipped.length}`);
+  lines.push(`severity P0=${census.bySeverity.P0} P1=${census.bySeverity.P1} P2=${census.bySeverity.P2}`);
+  lines.push(`dimension correctness=${census.byDimension.correctness} security=${census.byDimension.security} traceability=${census.byDimension.traceability} maintainability=${census.byDimension.maintainability}`);
+  for (const shape of Object.keys(census.byShape).sort()) {
+    const cell = census.byShape[shape];
+    lines.push(`header "${shape}": tables=${cell.tables} rows=${cell.rows}`);
+  }
+  const skippedSorted = [...census.skipped].sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : a.line - b.line));
+  for (const entry of skippedSorted) {
+    lines.push(`census skipped: ${entry.file}:${entry.line}`);
+  }
+  lines.push(`resolvable: correctness=${census.resolvable.correctness} traceability=${census.resolvable.traceability} refused=${census.refused} dropped=${census.dropped}`);
+  return lines;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 4. DRAW
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Hash text with SHA-256. Every published digest comes from this one helper,
+ * so a digest always compares across runs.
+ *
+ * @param {string} text - The text to hash.
+ * @returns {string} The lowercase hex digest.
+ */
+function sha256Hex(text) {
+  return crypto.createHash('sha256').update(text).digest('hex');
+}
+
+/**
+ * Build a seeded 32-bit PRNG returning numbers in [0, 1), so one seed alone
+ * fixes every pick a draw makes.
+ *
+ * @param {number} seed - The draw seed.
+ * @returns {() => number} A function returning the next number in [0, 1).
+ */
+function mulberry32(seed) {
+  let a = seed >>> 0;
+  return () => {
+    a = (a + 0x6d2b79f5) >>> 0;
+    let t = a;
+    t = Math.imul(t ^ (t >>> 15), t | 1);
+    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
+    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
+  };
+}
+
+/**
+ * Draw the labels file's fixed budgets: PER_CATEGORY seeded positives per
+ * category taken from the corpus's resolvable rows, and PER_CATEGORY seeded
+ * negatives per category taken from the same documents at the same commits,
+ * every one at least NEGATIVE_MIN_GAP lines from any line that document
+ * cites. A row carries coordinates and a window hash, never passage text.
+ * One seed reproduces one file byte for byte.
+ *
+ * @param {{resolvable: Object<string, number>}} census - A census from buildCensus; its resolvable counts gate the draw.
+ * @param {string} repoRoot - Repository path.
+ * @param {string} commit - The commit the corpus is read at.
+ * @param {number} seed - The draw seed.
+ * @returns {object[]} ROWS_TOTAL label rows, positives first, ids r001..r100.
+ * @throws {Error} When a category holds fewer than PER_CATEGORY resolvable rows, or fewer than PER_CATEGORY spaced negative lines.
+ */
+function drawRows(census, repoRoot, commit, seed) {
+  for (const category of CATEGORIES) {
+    if (census.resolvable[category] < PER_CATEGORY) {
+      throw new Error(`draw needs ${PER_CATEGORY} resolvable rows in ${category}, found ${census.resolvable[category]}`);
+    }
+  }
+  const tracked = trackedFiles(repoRoot);
+  const candidates = {};
+  for (const category of CATEGORIES) candidates[category] = [];
+  // Every resolved citation is remembered per document, so a negative stays
+  // clear of all of a document's cited lines, not just its own category's.
+  const documents = new Map();
+  for (const file of walkReviewFiles(tracked)) {
+    const reviewed = reviewedCommit(repoRoot, file);
+    if (reviewed === null) continue;
+    const parsed = parseFindingTables(readAtCommit(repoRoot, commit, file), file);
+    for (const table of parsed.tables) {
+      for (const row of table.rows) {
+        const hit = resolveLocation(row.location, { commit: reviewed, tracked, repoRoot });
+        if (hit.status !== 'resolved') continue;
+        const key = `${hit.path}\u0000${reviewed}`;
+        let document = documents.get(key);
+        if (document === undefined) {
+          document = { doc: hit.path, commit: reviewed, source: file, cited: new Set() };
+          documents.set(key, document);
+        }
+        document.cited.add(hit.line);
+        if (CATEGORIES.includes(row.dimension)) {
+          candidates[row.dimension].push({ source: file, category: row.dimension, doc: hit.path, line: hit.line, commit: reviewed });
+        }
+      }
+    }
+  }
+  const rand = mulberry32(seed);
+  // Fisher-Yates over a copy on one shared stream: the seed alone fixes every pick.
+  const shuffled = (items) => {
+    const copy = [...items];
+    for (let i = copy.length - 1; i > 0; i -= 1) {
+      const j = Math.floor(rand() * (i + 1));
+      [copy[i], copy[j]] = [copy[j], copy[i]];
+    }
+    return copy;
+  };
+  // A document's lines at its reviewed commit, read once for both its windows
+  // and its eligible negatives.
+  const linesAt = new Map();
+  const documentLines = (document) => {
+    const key = `${document.doc}\u0000${document.commit}`;
+    let lines = linesAt.get(key);
+    if (lines === undefined) {
+      lines = readAtCommit(repoRoot, document.commit, document.doc).split('\n');
+      if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
+      linesAt.set(key, lines);
+    }
+    return lines;
+  };
+  const rows = [];
+  const addRow = (kind, candidate) => {
+    const lines = documentLines(candidate);
+    const start = Math.max(1, candidate.line - WINDOW_RADIUS);
+    const end = Math.min(lines.length, candidate.line + WINDOW_RADIUS);
+    rows.push({
+      id: `r${String(rows.length + 1).padStart(3, '0')}`,
+      source: candidate.source,
+      category: candidate.category,
+      doc: candidate.doc,
+      line: candidate.line,
+      window_start: start,
+      window_end: end,
+      commit: candidate.commit,
+      window_sha12: sha256Hex(lines.slice(start - 1, end).join('\n')).slice(0, 12),
+      kind,
+      label: null,
+      labeler: null
+    });
+  };
+  for (const category of CATEGORIES) {
+    for (const candidate of shuffled(candidates[category]).slice(0, PER_CATEGORY)) {
+      addRow('positive', candidate);
+    }
+  }
+  for (const category of CATEGORIES) {
+    const pool = [];
+    const seen = new Set();
+    for (const candidate of candidates[category]) {
+      const key = `${candidate.doc}\u0000${candidate.commit}`;
+      if (seen.has(key)) continue;
+      seen.add(key);
+      const document = documents.get(key);
+      for (let line = 1; line <= documentLines(document).length; line += 1) {
+        let spaced = true;
+        for (const cited of document.cited) {
+          if (Math.abs(line - cited) < NEGATIVE_MIN_GAP) {
+            spaced = false;
+            break;
+          }
+        }
+        if (spaced) pool.push({ source: document.source, category, doc: document.doc, line, commit: document.commit });
+      }
+    }
+    if (pool.length < PER_CATEGORY) {
+      throw new Error(`draw needs ${PER_CATEGORY} negative lines for ${category}, found ${pool.length}`);
+    }
+    for (const candidate of shuffled(pool).slice(0, PER_CATEGORY)) {
+      addRow('negative', candidate);
+    }
+  }
+  return rows;
+}
+
+/**
+ * Read a JSON Lines file, or null when the file does not exist. A line that is
+ * not JSON names the file and line, so a corrupted labels file is never
+ * silently treated as unlabeled.
+ *
+ * @param {string} file - The JSONL file path.
+ * @returns {object[]|null} The parsed rows, or null when the file does not exist.
+ */
+function readJsonl(file) {
+  if (!fs.existsSync(file)) return null;
+  const lines = fs.readFileSync(file, 'utf8').split('\n');
+  const rows = [];
+  for (let i = 0; i < lines.length; i += 1) {
+    if (lines[i].trim() === '') continue;
+    try {
+      rows.push(JSON.parse(lines[i]));
+    } catch {
+      throw new Error(`${path.basename(file)}:${i + 1}: not JSON`);
+    }
+  }
+  return rows;
+}
+
+/**
+ * Write rows as JSON Lines, creating the parent directory first. Rows join in
+ * a fixed shape, so one seed reproduces one file byte for byte.
+ *
+ * @param {string} file - The JSONL file path.
+ * @param {object[]} rows - The rows to write, one per line.
+ * @returns {void}
+ */
+function writeJsonl(file, rows) {
+  fs.mkdirSync(path.dirname(file), { recursive: true });
+  fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
+}
+
+/**
+ * Report whether any drawn row already carries a label. A draw refuses when it
+ * does, so operator work is never overwritten.
+ *
+ * @param {object[]|null} rows - The rows read from the labels file.
+ * @returns {boolean} True when at least one row carries a label.
+ */
+function holdsLabels(rows) {
+  return (rows ?? []).some((row) => row.label !== null && row.label !== undefined);
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 5. LABEL GATE, BASELINE AND HEADROOM
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Count the labeled rows and report whether the gate is complete. Only the
+ * operator's two labels count, so a drawn row still carrying null holds every
+ * run on the stop line.
+ *
+ * @param {object[]|null} rows - The rows read from the labels file.
+ * @returns {{complete: boolean, labeled: number}} The gate counts and completeness.
+ */
+function labelGate(rows) {
+  const labeled = (rows ?? []).filter((row) => row.label === 'defect' || row.label === 'clean').length;
+  return { complete: labeled === LABEL_GATE, labeled };
+}
+
+/**
+ * Format the flag-nothing baseline over the labeled rows: how often doing
+ * nothing is right, and the defect share any gain has to come from.
+ *
+ * @param {{right: number, defect: number, K: number}} summary - The baseline summary built from the labeled rows.
+ * @returns {string[]} The two baseline lines, in report order.
+ */
+function baselineLines(summary) {
+  return [
+    `baseline: flag-nothing right=${summary.right} of ${summary.K}`,
+    `baseline: defect share=${summary.defect} of ${summary.K}`,
+  ];
+}
+
+/**
+ * Report the headroom the flag-nothing baseline leaves. A baseline right on
+ * more than nine tenths of the rows has no room for a 10-point gain, and fewer
+ * than five defect rows cannot carry a sign test to 0.05; otherwise the gain
+ * still fits.
+ *
+ * @param {{right: number, defect: number, K: number}} summary - The baseline summary built from the labeled rows.
+ * @returns {string} The headroom line, or why no arm may start.
+ */
+function headroomLine(summary) {
+  if (10 * summary.right > 9 * summary.K) return 'no headroom';
+  if (summary.defect < 5) return 'underpowered';
+  return `headroom: a 10-point gain fits above ${summary.right}/${summary.K}`;
+}
+
+/**
+ * Format the fixed rules as the report's lines: the margin and the whole keep
+ * rule, restated for the reader before any call.
+ *
+ * @returns {string[]} The margin and keep-rule lines, in report order.
+ */
+function ruleLines() {
+  return [MARGIN_LINE, KEEP_RULE_LINE];
+}
+
+/**
+ * Format the two fixed instructions with their digests. The digest proves the
+ * prompt text a run used, and both lines print before any call.
+ *
+ * @returns {string[]} The two instruction lines, in report order.
+ */
+function instructionLines() {
+  return [
+    `instruction correctness sha256=${sha256Hex(INSTRUCTION_CORRECTNESS)}: ${INSTRUCTION_CORRECTNESS}`,
+    `instruction traceability sha256=${sha256Hex(INSTRUCTION_TRACEABILITY)}: ${INSTRUCTION_TRACEABILITY}`,
+  ];
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 6. KEEP RULE AND VERDICT
+// ─────────────────────────────────────────────────────────────────────────────
+
+// Counts stay integers and the sign test's p is exact, so no rounding decides a verdict.
+
+/**
+ * One-sided sign test on the rows only this column got right against the rows
+ * only the baseline got right. The tail sum is built coefficient by
+ * coefficient in BigInt, and the threshold test is exact: 20 * num < 2^n is
+ * p < 0.05 with no float comparison. No disagreements give p 1.
+ *
+ * @param {number} wins - Rows only the column got right.
+ * @param {number} losses - Rows only the baseline got right.
+ * @returns {{p: number, below: boolean}} The one-sided p and whether it is below 0.05.
+ */
+function signTestP(wins, losses) {
+  const n = wins + losses;
+  if (n === 0) return { p: 1, below: false };
+  let coefficient = 1n;
+  let num = 0n;
+  for (let i = 0; i <= n; i += 1) {
+    if (i > 0) coefficient = (coefficient * BigInt(n - i + 1)) / BigInt(i);
+    if (i >= wins) num += coefficient;
+  }
+  const den = 1n << BigInt(n);
+  return { p: Number(num) / Number(den), below: 20n * num < den };
+}
+
+/**
+ * Score one column's probabilities against its labels over the rows it
+ * measured. A row's probability is the mean of its finite per-call
+ * probabilities in [0, 1], and the score is the mean squared error against
+ * 1 for a defect row and 0 for a clean row. Nothing measured has no score.
+ *
+ * @param {Array<{rowId: string, probability: number}>} calls - The column's calls, unmeasured entries included.
+ * @param {Array<{id: string, label: string|null}>} rows - The labeled draw rows.
+ * @returns {number|null} The mean Brier score, or null when no row measured.
+ */
+function brierScore(calls, rows) {
+  const byRow = new Map();
+  for (const call of calls) {
+    if (!Number.isFinite(call.probability) || call.probability < 0 || call.probability > 1) continue;
+    const list = byRow.get(call.rowId);
+    if (list === undefined) byRow.set(call.rowId, [call.probability]);
+    else list.push(call.probability);
+  }
+  let sum = 0;
+  let measured = 0;
+  for (const row of rows) {
+    if (row.label !== 'defect' && row.label !== 'clean') continue;
+    const list = byRow.get(row.id);
+    if (list === undefined) continue;
+    const mean = list.reduce((total, value) => total + value, 0) / list.length;
+    const actual = row.label === 'defect' ? 1 : 0;
+    sum += (mean - actual) ** 2;
+    measured += 1;
+  }
+  return measured === 0 ? null : sum / measured;
+}
+
+/**
+ * Decide one column's verdict from its counts. The first failing check wins:
+ * coverage, precision, margin, the sign test, then flips for the jev
+ * backend. Every outcome carries the sign test's p.
+ *
+ * @param {{backend: string, K: number, M: number, A: number, B: number, W: number, L: number, TP: number, FP: number, F: number}} counts - The column's backend and counts.
+ * @returns {{outcome: string, reason: string|null, p: number}} The outcome, its failing check or null, and the sign test's p.
+ */
+function decideVerdict({ backend, K, M, A, B, W, L, TP, FP, F }) {
+  const sign = signTestP(W, L);
+  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', p: sign.p };
+  if (!(TP + FP >= 1 && 5 * TP >= 4 * (TP + FP))) return { outcome: 'kill', reason: 'precision', p: sign.p };
+  if (!(10 * (A - B) >= M)) return { outcome: 'stop', reason: 'margin', p: sign.p };
+  if (!sign.below) return { outcome: 'stop', reason: 'sign test', p: sign.p };
+  if (backend === 'jev' && !(10 * F <= 3 * M)) return { outcome: 'stop', reason: 'flips', p: sign.p };
+  return { outcome: 'keep', reason: null, p: sign.p };
+}
+
+/**
+ * Render a verdict as its report words: keep, kill (precision), or stop
+ * followed by the failing check.
+ *
+ * @param {{outcome: string, reason: string|null}} v - A verdict from decideVerdict.
+ * @returns {string} The verdict text.
+ */
+function verdictText(v) {
+  if (v.outcome === 'keep') return 'keep';
+  if (v.outcome === 'kill') return 'kill (precision)';
+  return `stop (${v.reason})`;
+}
+
+/**
+ * Assemble one column's verdict line: the verdict, every count, the sign
+ * test's p at four significant digits, and the column's identity suffix.
+ * Flips count only for jev, so a deem column prints n/a.
+ *
+ * @param {string} backend - The column's backend, jev or deem.
+ * @param {{K: number, M: number, A: number, B: number, W: number, L: number, TP: number, FP: number, F: number}} counts - The column's counts.
+ * @param {{p: number}} decision - The column's verdict from decideVerdict.
+ * @param {string} suffix - The column identity text, appended when non-empty.
+ * @returns {string} The verdict line.
+ */
+function verdictLine(backend, counts, decision, suffix) {
+  const flips = backend === 'deem' ? 'n/a' : counts.F;
+  const line = `verdict ${backend}: ${verdictText(decision)} K=${counts.K} M=${counts.M} A=${counts.A} B=${counts.B} W=${counts.W} L=${counts.L} TP=${counts.TP} FP=${counts.FP} F=${flips} p=${decision.p.toPrecision(4)}`;
+  return suffix ? `${line} ${suffix}` : line;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 7. CALLS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * First executable file of this name on PATH, or null when none is executable.
+ * Empty PATH entries are skipped. A missing path, a directory, or a file that
+ * cannot be executed is not a match.
+ *
+ * @param {string} name - Executable file name.
+ * @param {{PATH?: string}} env - Environment whose PATH is searched.
+ * @returns {string|null} The first executable match, or null when none is executable.
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
+ * One bounded child process. Resolves exactly once with the exit code, the
+ * collected output, the wall time and whether the timeout fired. The timer
+ * kills the child and resolves at once, without waiting for close: a
+ * grandchild can hold the pipes open past the kill. Stdin is closed after the
+ * write because the CLI reads stdin to EOF and exits 2 on an inherited
+ * terminal. A spawn error is code 127 with the message as stderr.
+ *
+ * @param {string} file - Executable to spawn.
+ * @param {string[]} args - Arguments after the executable.
+ * @param {string} stdinText - Text written to stdin, then closed.
+ * @param {Record<string, string|undefined>} env - Child environment.
+ * @param {number} timeoutMs - Kill and resolve after this many milliseconds.
+ * @returns {Promise<{code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean}>} One call's outcome.
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
+ * @param {string|null} outDir - Directory that holds calls.jsonl.
+ * @returns {{append: (record: object) => void}} Append-only call log.
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
+ * @param {string|null} outDir - Directory that may hold report.json.
+ * @returns {object|null} The parsed report, or null when outDir is empty, the file is missing, or the file does not parse.
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
+// ─────────────────────────────────────────────────────────────────────────────
+// 8. ARM PLAN AND COLUMN
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Build the scored rows an arm reads: one entry per labeled row, with the
+ * window text read back from the commit the row was drawn at and the fixed
+ * instruction for its category. A window that no longer hashes to the drawn
+ * value is an unreadable input, not a measurement.
+ *
+ * @param {string} repoRoot - Repository path.
+ * @param {object[]} labels - The labeled draw rows.
+ * @returns {{rows: Array<{id: string, category: string, label: string, instruction: string, text: string}>, baselineFlags: Map<string, boolean>}} The arm's rows and flag-nothing flags, every flag false because flag-nothing never flags.
+ * @throws {Error} When a window does not match its recorded hash.
+ */
+function buildPlan(repoRoot, labels) {
+  const rows = [];
+  const baselineFlags = new Map();
+  for (const row of labels) {
+    if (row.label !== 'defect' && row.label !== 'clean') continue;
+    const lines = readAtCommit(repoRoot, row.commit, row.doc).split('\n');
+    if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
+    const text = lines.slice(row.window_start - 1, row.window_end).join('\n');
+    if (sha256Hex(text).slice(0, 12) !== row.window_sha12) {
+      throw new Error(`${row.id}: window does not match its recorded hash`);
+    }
+    rows.push({
+      id: row.id,
+      category: row.category,
+      label: row.label,
+      instruction: row.category === 'correctness' ? INSTRUCTION_CORRECTNESS : INSTRUCTION_TRACEABILITY,
+      text,
+    });
+    baselineFlags.set(row.id, false);
+  }
+  return { rows, baselineFlags };
+}
+
+/**
+ * Score one backend's measured rows into its verdict column: the accuracy and
+ * gain counts against flag-nothing, the sign test, the flag totals and the
+ * report line. A row counts only once it holds exactly the expected calls,
+ * each a finite probability in [0, 1]; rows that did not measure leave the
+ * column.
+ *
+ * @param {string} backend - The column's backend, jev or deem.
+ * @param {Array<{id: string, label: string}>} rows - The plan rows in draw order.
+ * @param {Map<string, (number|null)[]>} probs - Per-row probabilities, one entry per call.
+ * @param {Map<string, boolean>} baselineFlags - Per-row flags from the chosen baseline.
+ * @param {string} suffix - Column identity text appended to the line when non-empty.
+ * @returns {{backend: string, K: number, M: number, A: number, B: number, W: number, L: number, TP: number, FP: number, F: number, p: number, outcome: string, reason: string|null, line: string}} The column summary.
+ */
+function summarizeColumn(backend, rows, probs, baselineFlags, suffix) {
+  const expected = backend === 'jev' ? JEV_RERUNS : 1;
+  const K = rows.length;
+  let M = 0;
+  let A = 0;
+  let B = 0;
+  let W = 0;
+  let L = 0;
+  let TP = 0;
+  let FP = 0;
+  let F = 0;
+  for (const row of rows) {
+    const list = probs.get(row.id);
+    if (!Array.isArray(list) || list.length !== expected || !list.every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) continue;
+    M += 1;
+    const yes = list.filter((value) => value >= FLAG_AT).length;
+    const flag = 2 * yes > list.length;
+    F += Math.min(yes, list.length - yes);
+    const right = (flag ? 'defect' : 'clean') === row.label;
+    const baseRight = (baselineFlags.get(row.id) === true ? 'defect' : 'clean') === row.label;
+    if (right) A += 1;
+    if (baseRight) B += 1;
+    if (right && !baseRight) W += 1;
+    if (baseRight && !right) L += 1;
+    if (flag) {
+      if (row.label === 'defect') TP += 1;
+      else FP += 1;
+    }
+  }
+  const decision = decideVerdict({ backend, K, M, A, B, W, L, TP, FP, F });
+  const line = verdictLine(backend, { K, M, A, B, W, L, TP, FP, F }, decision, suffix);
+  return { backend, K, M, A, B, W, L, TP, FP, F, p: decision.p, outcome: decision.outcome, reason: decision.reason, line };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 9. DEEM ARM
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The gate reads the local model's health once, passes no key and starts no
+// server, so a skipped arm writes no file.
+
+/**
+ * cli-deem on PATH when that file is executable, otherwise the repo copy under
+ * node, so a checkout measures without installing a second binary.
+ *
+ * @param {{PATH?: string}} env - Environment whose PATH is searched.
+ * @param {string} repoRoot - Repository path that holds the repo copy.
+ * @returns {string[]} Command and leading arguments for one call.
+ */
+function deemCommand(env, repoRoot) {
+  const onPath = which('cli-deem', env);
+  if (onPath !== null) return [onPath];
+  return [process.execPath, path.join(repoRoot, '.skilled', 'skills', 'cli-classifier', 'cli-deem', 'scripts', 'cli-deem.mjs')];
+}
+
+/**
+ * One health check. An unreachable binary, a stub backend, or a wrong model
+ * is a failed check the caller prints as a skip.
+ *
+ * @param {string[]} cmd - Command from deemCommand.
+ * @param {Record<string, string|undefined>} env - Environment for the call.
+ * @returns {{ok: true, backend: string, model: string, modelCommit: string, sourceCommit: string}|{ok: false, reason: string, found: unknown}} The health identity, or why the check failed.
+ */
+function readDeemHealth(cmd, env) {
+  const result = spawnSync(cmd[0], [...cmd.slice(1), 'health'], {
+    env,
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+    timeout: HEALTH_TIMEOUT_MS
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
+ * Prints the health line, or the skip line and the found line when the check
+ * fails.
+ *
+ * @param {{out: (line: string) => void, env: Record<string, string|undefined>, repoRoot: string}} ctx - Line writer, environment and repository path.
+ * @returns {{passed: boolean, cmd: string[], reason?: string}} True when the health check passed; a failed check carries the skip line it printed.
+ */
+function deemGate(ctx) {
+  const cmd = deemCommand(ctx.env, ctx.repoRoot);
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
+ * One `noul` call per row, one calls.jsonl record per spawn. Exit 4 gets one
+ * retry behind a fresh health check, because a dropped connection is not a
+ * judgment. A stop prints the line and the rows that finished, and leaves the
+ * column and verdict unprinted.
+ *
+ * @param {{rows: Array<{id: string, category: string, label: string, instruction: string, text: string}>, baselineFlags: Map<string, boolean>}} plan - The arm's rows and flag-nothing flags.
+ * @param {{cmd: string[], model: string, modelCommit: string, sourceCommit: string}} gate - A passing deemGate result.
+ * @param {{out: (line: string) => void, env: Record<string, string|undefined>, timeoutMs: number, callLog: {append: (record: object) => void}, stored: object|null}} ctx - Line writer, environment, per-call timeout, the call log and an earlier run's report.
+ * @returns {Promise<{stopped: string, partialRows: number}|{column: object, requalify: string|null}>} The stopped arm, or its column and requalify line.
+ */
+async function runDeemArm(plan, gate, ctx) {
+  ctx.out(`deem: nothing leaves the machine; planned calls: ${plan.rows.length}; estimated wall time: ${(plan.rows.length * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the noul p50 in deem-local.md`);
+
+  const probs = new Map();
+  const calls = [];
+  let finished = 0;
+
+  // A spawn that led to a stop or a retry carries no judgment, so its
+  // probability, flag and status stay empty.
+  const record = (row, r, probability, status) => ({
+    rowId: row.id,
+    rerun: 0,
+    wallMs: r.wallMs,
+    exitCode: r.code,
+    backend: 'deem',
+    probability,
+    flag: probability === null ? null : probability >= FLAG_AT,
+    status,
+    modelId: gate.model,
+    modelCommit: gate.modelCommit,
+    sourceCommit: gate.sourceCommit
+  });
+
+  const stop = (line) => {
+    ctx.out(line);
+    ctx.out(`deem: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished };
+  };
+
+  for (const row of plan.rows) {
+    const callArgs = [...gate.cmd.slice(1), 'noul', '-q', row.instruction];
+    let r = await spawnCall(gate.cmd[0], callArgs, row.text, ctx.env, ctx.timeoutMs);
+
+    if (!r.timedOut && r.code === 4) {
+      ctx.callLog.append(record(row, r, null, 'unmeasured'));
+      const health = readDeemHealth(gate.cmd, ctx.env);
+      if (!health.ok) return stop('deem arm stopped: server gone');
+      if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
+        return stop('deem arm stopped: model commit changed mid-run');
+      }
+      r = await spawnCall(gate.cmd[0], callArgs, row.text, ctx.env, ctx.timeoutMs);
+    }
+
+    let probability = null;
+    let status = 'unmeasured';
+    let stopLine = null;
+    if (r.timedOut) {
+      status = 'unmeasured_timeout';
+    } else if (r.code === 0) {
+      let parsed;
+      try {
+        parsed = JSON.parse(r.stdout);
+      } catch {
+        // A body that does not parse is a missed measurement, not a crash.
+      }
+      const noul = parsed?.answers?.answer?.noul;
+      if (Number.isFinite(noul) && noul >= 0 && noul <= 1) {
+        probability = noul;
+        status = 'measured';
+      }
+    } else if (r.code === 2) {
+      stopLine = 'deem arm stopped: usage error';
+    } else if (r.code === 3) {
+      stopLine = 'deem arm stopped: backend refused';
+    } else if (r.code === 130) {
+      stopLine = 'deem arm stopped: interrupted';
+    }
+
+    ctx.callLog.append(record(row, r, probability, status));
+    if (stopLine !== null) return stop(stopLine);
+    calls.push({ rowId: row.id, probability });
+    probs.set(row.id, [probability]);
+    finished += 1;
+  }
+
+  const suffix = `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`;
+  const column = summarizeColumn('deem', plan.rows, probs, plan.baselineFlags, suffix);
+  const brier = brierScore(calls, plan.rows);
+  ctx.out(`brier deem: ${brier === null ? 'none' : brier.toFixed(4)}`);
+  ctx.out('flips: not applicable (deem noul)');
+  const storedDeem = ctx.stored?.columns?.deem;
+  let requalify = null;
+  if (storedDeem && (storedDeem.modelCommit !== gate.modelCommit || storedDeem.sourceCommit !== gate.sourceCommit)) {
+    requalify = 'requalify: model commit changed';
+    ctx.out(requalify);
+  }
+  ctx.out(column.line);
+  return {
+    column: { ...column, brier, modelId: gate.model, modelCommit: gate.modelCommit, sourceCommit: gate.sourceCommit },
+    requalify
+  };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 10. JEV ARM
+// ─────────────────────────────────────────────────────────────────────────────
+
+// jev resolves its own credential; this script reads and passes none, so a
+// skipped arm writes no file.
+
+/**
+ * Identity line, then the pinned version and a credential check. A miss prints
+ * a skip line and leaves the census text already written.
+ *
+ * @param {{out: (line: string) => void, env: Record<string, string|undefined>, timeoutMs: number}} ctx - Line writer, environment and per-call timeout.
+ * @returns {{passed: boolean, path: string|null, provider: string, reason?: string}} True when the gate passed; a failed check carries the skip line it printed.
+ */
+function jevGate(ctx) {
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
+ * One auth test, then JEV_RERUNS fresh `noul` calls per row, one calls.jsonl
+ * record per spawn and no answer cache: every rerun is its own measurement.
+ * Exit 4 gets one retry behind a backoff, because a dropped connection is not
+ * a judgment. A stop prints the line and the rows that finished, and leaves
+ * the column and verdict unprinted.
+ *
+ * @param {{rows: Array<{id: string, category: string, label: string, instruction: string, text: string}>, baselineFlags: Map<string, boolean>}} plan - The arm's rows and flag-nothing flags.
+ * @param {{path: string, provider: string}} gate - A passing jevGate result.
+ * @param {{out: (line: string) => void, env: Record<string, string|undefined>, timeoutMs: number, backoffMs: number, callLog: {append: (record: object) => void}, stored: object|null}} ctx - Line writer, environment, per-call timeout, retry backoff, the call log and an earlier run's report.
+ * @returns {Promise<{stopped: string, partialRows: number}|{column: object, requalify: string|null}>} The stopped arm, or its column and requalify line.
+ */
+async function runJevArm(plan, gate, ctx) {
+  let chars = 0;
+  for (const row of plan.rows) chars += row.text.length + row.instruction.length;
+  chars *= JEV_RERUNS;
+  ctx.out(`jev: payload: windows of committed documents; planned calls: ${JEV_RERUNS * plan.rows.length + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);
+
+  const probs = new Map();
+  const calls = [];
+  let finished = 0;
+
+  const stop = (line) => {
+    ctx.out(line);
+    ctx.out(`jev: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished };
+  };
+
+  const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, ctx.timeoutMs);
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
+    jevVersion: JEV_VERSION,
+    provider: gate.provider,
+    model
+  });
+  if (auth.code !== 0) {
+    if (auth.code === 3) return stop('jev arm stopped: key rejected');
+    if (auth.code === 130) return stop('jev arm stopped: interrupted');
+    return stop('jev arm stopped: auth test failed');
+  }
+  ctx.out(`jev: auth test provider=${gate.provider} model=${model}`);
+
+  // A spawn that led to a stop or a retry carries no judgment, so its
+  // probability, flag and status stay empty.
+  const record = (row, rerun, r, probability, status) => ({
+    rowId: row.id,
+    rerun,
+    wallMs: r.wallMs,
+    exitCode: r.code,
+    backend: 'jev',
+    probability,
+    flag: probability === null ? null : probability >= FLAG_AT,
+    status,
+    jevVersion: JEV_VERSION,
+    provider: gate.provider,
+    model
+  });
+
+  for (const row of plan.rows) {
+    const callArgs = ['noul', '--provider', gate.provider, '-q', row.instruction];
+    const list = [];
+    for (let rerun = 0; rerun < JEV_RERUNS; rerun += 1) {
+      let r = await spawnCall(gate.path, callArgs, row.text, ctx.env, ctx.timeoutMs);
+
+      if (!r.timedOut && r.code === 4) {
+        ctx.callLog.append(record(row, rerun, r, null, 'unmeasured'));
+        await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
+        r = await spawnCall(gate.path, callArgs, row.text, ctx.env, ctx.timeoutMs);
+      }
+
+      let probability = null;
+      let status = 'unmeasured';
+      let stopLine = null;
+      if (r.timedOut) {
+        status = 'unmeasured_timeout';
+      } else if (r.code === 0) {
+        let parsed;
+        try {
+          parsed = JSON.parse(r.stdout);
+        } catch {
+          // A body that does not parse is a missed measurement, not a crash.
+        }
+        const noul = parsed?.answers?.answer?.noul;
+        if (Number.isFinite(noul) && noul >= 0 && noul <= 1) {
+          probability = noul;
+          status = 'measured';
+        }
+      } else if (r.code === 2) {
+        stopLine = 'jev arm stopped: usage error';
+      } else if (r.code === 3) {
+        stopLine = 'jev arm stopped: key rejected';
+      } else if (r.code === 130) {
+        stopLine = 'jev arm stopped: interrupted';
+      }
+
+      ctx.callLog.append(record(row, rerun, r, probability, status));
+      if (stopLine !== null) return stop(stopLine);
+      list.push(probability);
+      calls.push({ rowId: row.id, probability });
+    }
+    probs.set(row.id, list);
+    finished += 1;
+  }
+
+  const suffix = `jev_version=${JEV_VERSION.split(' ')[1]} provider=${gate.provider} model=${model}`;
+  const column = summarizeColumn('jev', plan.rows, probs, plan.baselineFlags, suffix);
+  const brier = brierScore(calls, plan.rows);
+  ctx.out(`brier jev: ${brier === null ? 'none' : brier.toFixed(4)}`);
+  const storedJev = ctx.stored?.columns?.jev;
+  let requalify = null;
+  if (storedJev && (storedJev.provider !== gate.provider || storedJev.model !== model)) {
+    requalify = 'requalify: model changed';
+    ctx.out(requalify);
+  }
+  ctx.out(column.line);
+  return {
+    column: { ...column, brier, jevVersion: JEV_VERSION, provider: gate.provider, model },
+    requalify
+  };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 11. REPORT
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * The report.json body: the run's commit and census, the labels file and its
+ * digest, the flag-nothing baseline and headroom, the fixed rules with their
+ * digests, and one entry per arm that ran, stopped or was skipped. An arm
+ * absent from the run stays out of every map.
+ *
+ * @param {{commit: string, census: object, labelsPath: string, labels: object[]|null, gate: {labeled: number}, summary: {right: number, defect: number, K: number}|null, headroom: string|null, jev: object|undefined, deem: object|undefined}} input - The run's commit, census, labels, baseline, headroom and one arm result per backend.
+ * @returns {object} The report.json body.
+ */
+function buildReport({ commit, census, labelsPath, labels, gate, summary, headroom, jev, deem }) {
+  const report = {
+    commit,
+    census,
+    labels: {
+      path: labelsPath,
+      sha256: sha256Hex(fs.readFileSync(labelsPath, 'utf8')),
+      rows: Array.isArray(labels) ? labels.length : 0,
+      labeled: gate.labeled
+    },
+    baseline: summary === null ? null : { right: summary.right, defect: summary.defect, K: summary.K },
+    headroom,
+    margin: MARGIN_LINE,
+    keepRule: KEEP_RULE_LINE,
+    instructions: {
+      correctness: { sha256: sha256Hex(INSTRUCTION_CORRECTNESS) },
+      traceability: { sha256: sha256Hex(INSTRUCTION_TRACEABILITY) }
+    },
+    columns: {},
+    requalify: {},
+    stopped: {},
+    skipped: {}
+  };
+  for (const [backend, arm] of [['jev', jev], ['deem', deem]]) {
+    if (arm === undefined) continue;
+    if (typeof arm.skipped === 'string') {
+      report.skipped[backend] = arm.skipped;
+      continue;
+    }
+    if (typeof arm.stopped === 'string') {
+      report.stopped[backend] = { line: arm.stopped, partialRows: arm.partialRows };
+      continue;
+    }
+    if (arm.column === undefined) continue;
+    report.columns[backend] = { ...arm.column };
+    report.requalify[backend] = arm.requalify ?? null;
+  }
+  return report;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 12. ARGUMENTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Parse the command line into flags.
+ *
+ * Value switches take exactly one argument and a non-integer seed is a bad
+ * invocation. Cross-switch rules belong to the mode handlers, not here.
+ *
+ * @param {string[]} argv - Arguments after the script name.
+ * @returns {{draw: boolean, seed: string|null, jev: boolean, deem: boolean, out: string|null, labels: string|null}|{error: string}} The flags, or one error.
+ */
+function parseArgs(argv) {
+  const flags = { draw: false, seed: null, jev: false, deem: false, out: null, labels: null };
+  for (let i = 0; i < argv.length; i += 1) {
+    const arg = argv[i];
+    if (arg === '--draw') { flags.draw = true; continue; }
+    if (arg === '--jev') { flags.jev = true; continue; }
+    if (arg === '--deem') { flags.deem = true; continue; }
+    if (arg === '--seed' || arg === '--out' || arg === '--labels') {
+      const value = argv[i + 1];
+      if (value === undefined || value.startsWith('--')) return { error: `${arg} needs a value` };
+      i += 1;
+      if (arg === '--seed') {
+        if (!/^[0-9]+$/.test(value)) return { error: `--seed must be a non-negative integer: ${value}` };
+        flags.seed = value;
+      } else if (arg === '--out') {
+        flags.out = value;
+      } else {
+        flags.labels = value;
+      }
+      continue;
+    }
+    return { error: `unknown switch: ${arg}` };
+  }
+  return flags;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 13. MAIN
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Run one measurement pass and print its lines. The default pass is the
+ * census only: zero backend calls and zero writes.
+ *
+ * @param {string[]} argv - Arguments after the script name.
+ * @param {{repoRoot?: string, out?: (line: string) => void, err?: (line: string) => void, env?: Object, timeoutMs?: number, backoffMs?: number}} [deps] - Injection points for callers and tests.
+ * @returns {Promise<0|2>} 0 when the report printed, 2 on a bad invocation.
+ */
+async function main(argv, deps = {}) {
+  const repoRoot = deps.repoRoot ?? REPO_ROOT;
+  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
+  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
+  const env = deps.env ?? process.env;
+  const timeoutMs = deps.timeoutMs ?? CALL_TIMEOUT_MS;
+  const backoffMs = deps.backoffMs ?? BACKOFF_MS;
+  const flags = parseArgs(argv);
+  if ('error' in flags) {
+    err(flags.error);
+    return 2;
+  }
+  if (flags.draw) {
+    if (flags.jev || flags.deem || flags.out !== null) {
+      err('--draw takes only --seed and --labels');
+      return 2;
+    }
+    if (flags.seed === null) {
+      err('--draw needs --seed <n>');
+      return 2;
+    }
+    const labelsPath = flags.labels ?? LABELS_PATH;
+    try {
+      if (holdsLabels(readJsonl(labelsPath))) {
+        err(`draw refused: ${labelsPath} holds a label`);
+        return 2;
+      }
+      const census = buildCensus(repoRoot, trackedFiles(repoRoot));
+      const rows = drawRows(census, repoRoot, census.commit, Number(flags.seed));
+      writeJsonl(labelsPath, rows);
+      out(`draw: path=${labelsPath} seed=${flags.seed} commit=${census.commit.slice(0, 12)} rows=${ROWS_TOTAL} positives=${POSITIVES} negatives=${NEGATIVES}`);
+      return 0;
+    } catch (error) {
+      err(error instanceof Error ? error.message : String(error));
+      return 2;
+    }
+  }
+  if ((flags.jev || flags.deem) && flags.out === null) {
+    err('--jev and --deem need --out <dir> so every call is recorded');
+    return 2;
+  }
+  const tracked = trackedFiles(repoRoot);
+  const census = buildCensus(repoRoot, tracked);
+  for (const line of censusLines(census)) out(line);
+  for (const line of ruleLines()) out(line);
+  for (const line of instructionLines()) out(line);
+  const labelsPath = flags.labels ?? LABELS_PATH;
+  let labels;
+  try {
+    labels = readJsonl(labelsPath);
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    return 2;
+  }
+  const gate = labelGate(labels);
+  if (!gate.complete) out('stop: fewer than 100 labeled rows');
+  const rows = labels ?? [];
+  let summary = null;
+  let headroom = null;
+  if (gate.complete) {
+    summary = {
+      right: rows.filter((row) => row.label === 'clean').length,
+      defect: rows.filter((row) => row.label === 'defect').length,
+      K: gate.labeled
+    };
+    for (const line of baselineLines(summary)) out(line);
+    headroom = headroomLine(summary);
+    out(headroom);
+  }
+  const stored = flags.jev || flags.deem ? readStoredReport(flags.out) : null;
+  const callLog = createCallLog(flags.out);
+  let jev;
+  if (flags.jev) {
+    const check = jevGate({ out, env, timeoutMs });
+    if (!check.passed) {
+      jev = { skipped: check.reason };
+    } else if (!gate.complete) {
+      const line = 'jev arm skipped: fewer than 100 labeled rows';
+      out(line);
+      jev = { skipped: line };
+    } else if (!headroom.startsWith('headroom:')) {
+      const line = `jev arm skipped: ${headroom}`;
+      out(line);
+      jev = { skipped: line };
+    } else {
+      try {
+        const plan = buildPlan(repoRoot, rows);
+        jev = await runJevArm(plan, check, { out, env, timeoutMs, backoffMs, callLog, stored });
+      } catch (error) {
+        err(error instanceof Error ? error.message : String(error));
+        return 2;
+      }
+    }
+  }
+
+  let deem;
+  if (flags.deem) {
+    const check = deemGate({ out, env, repoRoot });
+    if (!check.passed) {
+      deem = { skipped: check.reason };
+    } else if (!gate.complete) {
+      const line = 'deem arm skipped: fewer than 100 labeled rows';
+      out(line);
+      deem = { skipped: line };
+    } else if (!headroom.startsWith('headroom:')) {
+      const line = `deem arm skipped: ${headroom}`;
+      out(line);
+      deem = { skipped: line };
+    } else {
+      try {
+        const plan = buildPlan(repoRoot, rows);
+        deem = await runDeemArm(plan, check, { out, env, timeoutMs, callLog, stored });
+      } catch (error) {
+        err(error instanceof Error ? error.message : String(error));
+        return 2;
+      }
+    }
+  }
+  if ([jev, deem].some((arm) => arm !== undefined && (arm.column !== undefined || arm.stopped !== undefined))) {
+    const report = buildReport({ commit: census.commit, census, labelsPath, labels, gate, summary, headroom, jev, deem });
+    fs.mkdirSync(flags.out, { recursive: true });
+    fs.writeFileSync(path.join(flags.out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
+  }
+  return 0;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 14. EXPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+module.exports = {
+  sha256Hex,
+  git,
+  trackedFiles,
+  headCommit,
+  readAtCommit,
+  walkReviewFiles,
+  parseFindingTables,
+  addingCommit,
+  reviewedCommit,
+  resolveLocation,
+  buildCensus,
+  censusLines,
+  mulberry32,
+  drawRows,
+  readJsonl,
+  writeJsonl,
+  holdsLabels,
+  labelGate,
+  baselineLines,
+  headroomLine,
+  ruleLines,
+  instructionLines,
+  signTestP,
+  brierScore,
+  decideVerdict,
+  verdictText,
+  verdictLine,
+  which,
+  deemCommand,
+  readDeemHealth,
+  deemGate,
+  jevGate,
+  spawnCall,
+  createCallLog,
+  readStoredReport,
+  runDeemArm,
+  runJevArm,
+  buildReport,
+  parseArgs,
+  main
+};
+
+if (require.main === module) {
+  main(process.argv.slice(2)).then((code) => {
+    process.exitCode = code;
+  });
+}
diff --git a/.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs b/.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs
new file mode 100644
index 0000000000..8ab2ec9784
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs
@@ -0,0 +1,976 @@
+#!/usr/bin/env node
+// ╔══════════════════════════════════════════════════════════════════════════╗
+// ║ score-residue-flagger.test — corpus, parser and location coverage        ║
+// ╚══════════════════════════════════════════════════════════════════════════╝
+'use strict';
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 1. IMPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+const test = require('node:test');
+const assert = require('node:assert/strict');
+const { execFileSync } = require('node:child_process');
+const fs = require('node:fs');
+const os = require('node:os');
+const path = require('node:path');
+
+const S = require('../score-residue-flagger.cjs');
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 2. FIXTURE
+// ─────────────────────────────────────────────────────────────────────────────
+
+// A fixture must not inherit the caller's git redirectors or backend endpoints.
+function cleanEnv() {
+  const env = { ...process.env };
+  for (const key of Object.keys(env)) {
+    if (key.startsWith('GIT_') || key === 'JEV_PROVIDER' || key === 'CLI_DEEM_URL') delete env[key];
+  }
+  return env;
+}
+
+// Fresh temp directory whose name marks it as a fixture.
+function tempDir(prefix) {
+  return fs.mkdtempSync(path.join(os.tmpdir(), `residue-flgr-${prefix}-`));
+}
+
+// The caller's global excludes and attributes files must not hide or rewrite fixture files.
+function runGit(root, args) {
+  const base = [
+    '-C', root,
+    '-c', 'user.email=fixture@example.com', '-c', 'user.name=fixture',
+    '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null',
+    '-c', 'core.excludesFile=/dev/null', '-c', 'core.attributesFile=/dev/null'
+  ];
+  return execFileSync('git', [...base, ...args], { env: cleanEnv(), encoding: 'utf8' });
+}
+
+function writeFiles(root, files) {
+  for (const [rel, text] of Object.entries(files)) {
+    const full = path.join(root, rel);
+    fs.mkdirSync(path.dirname(full), { recursive: true });
+    fs.writeFileSync(full, text);
+  }
+}
+
+// One 10-line document, so a cited line 5 resolves and a cited line 999 drops.
+function docLines(name) {
+  return Array.from({ length: 10 }, (_, n) => `${name} line ${n + 1}.`).join('\n') + '\n';
+}
+
+// Four tables: the three recognized header shapes and one unrecognized shape.
+const FINDINGS = [
+  '# Findings',
+  '',
+  '| Severity | Dimension | File:Line | Finding |',
+  '| --- | --- | --- | --- |',
+  '| P0 | Correctness | docs/a.md:5 | behavior its own text disproves |',
+  '| P1 | Spec-Alignment / Traceability | docs/a.md:999 | cites a line past the end |',
+  '| P2 | Maintainability | docs/b.md:3 | stale comment |',
+  '',
+  '| Sev | Dimension | File |',
+  '| --- | --- | --- |',
+  '| P1 | Security | .env.example:3 |',
+  '| P2 | Traceability | docs/b.md |',
+  '',
+  '| Severity | Dimension | Evidence |',
+  '| --- | --- | --- |',
+  '| P0 | Traceability | docs/b.md:7 |',
+  '',
+  '| Level | Area | Where |',
+  '| --- | --- | --- |',
+  '| P0 | Correctness | docs/a.md:5 |',
+  ''
+].join('\n');
+
+// A shaped table that must add no rows when its file is outside the corpus walk.
+const TRIPWIRE = [
+  '| Severity | Dimension | File:Line |',
+  '| --- | --- | --- |',
+  '| P0 | Correctness | docs/a.md:5 |',
+  ''
+].join('\n');
+
+// The temp git repository: commit 1 adds the cited documents, commit 2 adds
+// the review files, and one review file stays untracked on purpose.
+function makeFixture() {
+  const root = tempDir('repo');
+  runGit(root, ['init', '-q']);
+  writeFiles(root, {
+    'docs/a.md': docLines('a'),
+    'docs/b.md': docLines('b'),
+    '.env.example': 'TOKEN=stub\n'
+  });
+  runGit(root, ['add', '-A']);
+  runGit(root, ['commit', '-q', '-m', 'documents']);
+  const commit1 = runGit(root, ['rev-parse', 'HEAD']).trim();
+  writeFiles(root, {
+    'specs/demo/review/findings.md': FINDINGS,
+    'specs/demo/ai-council/council.md': '# Council\n\nNo findings here.\n',
+    'specs/demo/context/notes.md': TRIPWIRE,
+    'specs/demo/scratch/draft.md': TRIPWIRE,
+    'specs/demo/review/extra.txt': TRIPWIRE
+  });
+  runGit(root, ['add', '-A']);
+  runGit(root, ['commit', '-q', '-m', 'reviews']);
+  const commit2 = runGit(root, ['rev-parse', 'HEAD']).trim();
+  writeFiles(root, { 'specs/demo/review/untracked.md': TRIPWIRE });
+  return { root, commit1, commit2 };
+}
+
+// A stub binary that logs one line of JSON arguments per call and exits 0.
+function stubScript(logName) {
+  return [
+    '#!/usr/bin/env node',
+    "const fs = require('fs');",
+    "const path = require('path');",
+    `fs.appendFileSync(path.join(__dirname, '${logName}'), JSON.stringify(process.argv.slice(2)) + '\\n');`,
+    ''
+  ].join('\n');
+}
+
+// Stub jev and cli-deem binaries first on PATH; no case reaches a real backend.
+function makeStubs() {
+  const bin = tempDir('bin');
+  fs.writeFileSync(path.join(bin, 'jev'), stubScript('jev.log'), { mode: 0o755 });
+  fs.writeFileSync(path.join(bin, 'cli-deem'), stubScript('cli-deem.log'), { mode: 0o755 });
+  return bin;
+}
+
+// The argument arrays the named stub recorded, empty when it never ran.
+function stubLog(bin, name) {
+  const file = path.join(bin, `${name}.log`);
+  if (!fs.existsSync(file)) return [];
+  return fs.readFileSync(file, 'utf8').split('\n').slice(0, -1).map((line) => JSON.parse(line));
+}
+
+function findingsText(root) {
+  return fs.readFileSync(path.join(root, 'specs/demo/review/findings.md'), 'utf8');
+}
+
+// The draw corpus: two 100-line documents, each cited by 30 findings, so a
+// full draw has enough resolvable rows and enough spaced negative lines.
+const DRAW_DOC_LINES = 100;
+
+function drawDocLines(name) {
+  return Array.from({ length: DRAW_DOC_LINES }, (_, n) => `${name} line ${n + 1}.`).join('\n') + '\n';
+}
+
+function makeDrawFixture() {
+  const root = tempDir('draw-repo');
+  runGit(root, ['init', '-q']);
+  writeFiles(root, {
+    'docs/a.md': drawDocLines('a'),
+    'docs/b.md': drawDocLines('b')
+  });
+  runGit(root, ['add', '-A']);
+  runGit(root, ['commit', '-q', '-m', 'documents']);
+  const commit1 = runGit(root, ['rev-parse', 'HEAD']).trim();
+  const cited = [];
+  for (let line = 1; line <= 30; line += 1) cited.push(`| P0 | Correctness | docs/a.md:${line} | cited |`);
+  for (let line = 1; line <= 30; line += 1) cited.push(`| P1 | Traceability | docs/b.md:${line} | cited |`);
+  writeFiles(root, {
+    'specs/demo/review/draw.md': ['| Severity | Dimension | File:Line |', '| --- | --- | --- |', ...cited, ''].join('\n')
+  });
+  runGit(root, ['add', '-A']);
+  runGit(root, ['commit', '-q', '-m', 'reviews']);
+  return { root, commit1 };
+}
+
+// Runs main against one fixture repository and collects its output lines and exit code.
+async function runMain(args, options = {}) {
+  const lines = [];
+  const errs = [];
+  const code = await S.main(args, {
+    repoRoot: options.root,
+    out: (line) => lines.push(line),
+    err: (line) => errs.push(line),
+    env: cleanEnv(),
+    timeoutMs: 20000,
+    backoffMs: 1
+  });
+  return { code, lines, errs };
+}
+
+// Runs main with the stub binaries first on PATH, so any call a case makes is
+// logged by the stub instead of reaching a real backend.
+async function runMainWithStubs(args, { root, bin }) {
+  const lines = [];
+  const errs = [];
+  const code = await S.main(args, {
+    repoRoot: root,
+    out: (line) => lines.push(line),
+    err: (line) => errs.push(line),
+    env: { ...cleanEnv(), PATH: `${bin}${path.delimiter}${process.env.PATH}` },
+    timeoutMs: 20000,
+    backoffMs: 1
+  });
+  return { code, lines, errs };
+}
+
+// Writes a drawn labels file relabeled for the gate and baseline cases. The
+// draw is the operator's own, so the row shape under test stays the drawn shape.
+function writeLabels(root, seed, labelFor) {
+  const census = S.buildCensus(root, S.trackedFiles(root));
+  const rows = S.drawRows(census, root, census.commit, seed);
+  const file = path.join(tempDir('labels'), 'labels.jsonl');
+  S.writeJsonl(file, rows.map((row, index) => {
+    const label = labelFor(index);
+    return label === null ? { ...row, label: null, labeler: null } : { ...row, label, labeler: 'fixture' };
+  }));
+  return file;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 3. TESTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+test('corpus walk', () => {
+  const { root } = makeFixture();
+  const tracked = S.trackedFiles(root);
+  assert.deepEqual(S.walkReviewFiles(tracked), ['specs/demo/ai-council/council.md', 'specs/demo/review/findings.md']);
+  assert.equal(S.buildCensus(root, tracked).files, 2);
+});
+
+test('parser three shapes', () => {
+  const { root } = makeFixture();
+  const parsed = S.parseFindingTables(findingsText(root), 'specs/demo/review/findings.md');
+  assert.deepEqual(parsed.tables.map((table) => table.shape), [
+    'Severity|Dimension|File:Line',
+    'Sev|Dimension|File',
+    'Severity|Dimension|Evidence'
+  ]);
+  assert.deepEqual(parsed.tables.map((table) => table.rows.length), [3, 2, 1]);
+  const severity = { P0: 0, P1: 0, P2: 0 };
+  for (const table of parsed.tables) {
+    for (const row of table.rows) severity[row.severity] += 1;
+  }
+  assert.deepEqual(severity, { P0: 2, P1: 2, P2: 2 });
+});
+
+test('parser skipped shape', () => {
+  const { root } = makeFixture();
+  const parsed = S.parseFindingTables(findingsText(root), 'specs/demo/review/findings.md');
+  assert.deepEqual(parsed.skipped, [{ line: 18, header: '| Level | Area | Where |' }]);
+  let rows = 0;
+  for (const table of parsed.tables) rows += table.rows.length;
+  assert.equal(rows, 6);
+});
+
+test('parser ignores a table without severities', () => {
+  const text = [
+    '| Metric | Value |',
+    '| --- | --- |',
+    '| iterations | 5 |',
+    '| findings | 3 |',
+    ''
+  ].join('\n');
+  const parsed = S.parseFindingTables(text, 'specs/demo/review/findings.md');
+  assert.deepEqual(parsed.tables, []);
+  assert.deepEqual(parsed.skipped, []);
+});
+
+test('dimension mapping', () => {
+  const { root } = makeFixture();
+  const parsed = S.parseFindingTables(findingsText(root), 'specs/demo/review/findings.md');
+  const rows = [];
+  for (const table of parsed.tables) rows.push(...table.rows);
+  assert.equal(rows.find((row) => row.location === 'docs/a.md:5').dimension, 'correctness');
+  assert.equal(rows.find((row) => row.location === 'docs/a.md:999').dimension, 'traceability');
+  const census = S.buildCensus(root, S.trackedFiles(root));
+  assert.equal(census.byDimension.correctness, 1);
+  assert.equal(census.byDimension.traceability, 3);
+});
+
+test('commit resolution', () => {
+  const { root, commit1, commit2 } = makeFixture();
+  assert.equal(S.addingCommit(root, 'specs/demo/review/findings.md'), commit2);
+  assert.equal(S.reviewedCommit(root, 'specs/demo/review/findings.md'), commit1);
+});
+
+test('git output above 1 MB', () => {
+  const root = tempDir('big-repo');
+  runGit(root, ['init', '-q']);
+  writeFiles(root, { 'docs/big.md': 'x'.repeat(2000000) });
+  runGit(root, ['add', '-A']);
+  runGit(root, ['commit', '-q', '-m', 'big document']);
+  const commit = runGit(root, ['rev-parse', 'HEAD']).trim();
+  assert.equal(S.readAtCommit(root, commit, 'docs/big.md').length, 2000000);
+});
+
+test('untracked review file', () => {
+  const { root } = makeFixture();
+  const tracked = S.trackedFiles(root);
+  assert.ok(!tracked.includes('specs/demo/review/untracked.md'));
+  assert.ok(!S.walkReviewFiles(tracked).includes('specs/demo/review/untracked.md'));
+  const census = S.buildCensus(root, tracked);
+  assert.equal(census.files, 2);
+  assert.equal(census.rows, 6);
+});
+
+test('location resolves', () => {
+  const { root, commit1 } = makeFixture();
+  const tracked = S.trackedFiles(root);
+  assert.deepEqual(
+    S.resolveLocation('docs/a.md:5', { commit: commit1, tracked, repoRoot: root }),
+    { status: 'resolved', path: 'docs/a.md', line: 5 }
+  );
+  assert.equal(S.buildCensus(root, tracked).resolvable.correctness, 1);
+});
+
+test('location dropped', () => {
+  const { root, commit1 } = makeFixture();
+  const tracked = S.trackedFiles(root);
+  assert.deepEqual(
+    S.resolveLocation('docs/a.md:999', { commit: commit1, tracked, repoRoot: root }),
+    { status: 'dropped', path: 'docs/a.md', line: 999 }
+  );
+  assert.equal(
+    S.buildCensus(root, tracked).dropped, 2,
+    'the past-end row and the missing-line row are both counted'
+  );
+});
+
+test('refused .env', () => {
+  const { root } = makeFixture();
+  const tracked = S.trackedFiles(root);
+  assert.ok(tracked.includes('.env.example'));
+  // A commit that cannot be read would drop the row, so a refusal here proves
+  // the file was never opened.
+  assert.deepEqual(
+    S.resolveLocation('.env.example:3', { commit: 'no-such-commit', tracked, repoRoot: root }),
+    { status: 'refused', path: '.env.example', line: 3 }
+  );
+  assert.equal(S.buildCensus(root, tracked).refused, 1);
+});
+
+test('draw reproducible', async () => {
+  const { root, commit1 } = makeDrawFixture();
+  const fileA = path.join(tempDir('draw-a'), 'labels.jsonl');
+  const fileB = path.join(tempDir('draw-b'), 'labels.jsonl');
+  const first = await runMain(['--draw', '--seed', '1', '--labels', fileA], { root });
+  const second = await runMain(['--draw', '--seed', '1', '--labels', fileB], { root });
+  assert.equal(first.code, 0, first.errs.join('\n'));
+  assert.equal(second.code, 0, second.errs.join('\n'));
+  assert.equal(fs.readFileSync(fileA, 'utf8'), fs.readFileSync(fileB, 'utf8'));
+  const rows = S.readJsonl(fileA);
+  assert.equal(rows.length, 100);
+  assert.deepEqual(Object.keys(rows[0]), ['id', 'source', 'category', 'doc', 'line', 'window_start', 'window_end',
+    'commit', 'window_sha12', 'kind', 'label', 'labeler']);
+  assert.deepEqual([...rows.map((row) => row.id)].sort(),
+    Array.from({ length: 100 }, (_, n) => `r${String(n + 1).padStart(3, '0')}`).sort());
+  assert.equal(rows.filter((row) => row.kind === 'positive').length, 50);
+  assert.equal(rows.filter((row) => row.kind === 'negative').length, 50);
+  for (const category of ['correctness', 'traceability']) {
+    assert.equal(rows.filter((row) => row.kind === 'positive' && row.category === category).length, 25);
+    assert.equal(rows.filter((row) => row.kind === 'negative' && row.category === category).length, 25);
+  }
+  for (const row of rows) {
+    assert.ok(!('text' in row) && !('passage' in row), `${row.id} must carry no passage text`);
+    assert.equal(row.commit, commit1);
+    assert.equal(row.label, null);
+    assert.equal(row.labeler, null);
+    assert.match(row.window_sha12, /^[0-9a-f]{12}$/);
+    assert.ok(row.window_start >= 1 && row.window_start <= row.line && row.line <= row.window_end);
+  }
+  assert.equal(first.lines.length, 1);
+  assert.equal(first.lines[0],
+    `draw: path=${fileA} seed=1 commit=${S.headCommit(root).slice(0, 12)} rows=100 positives=50 negatives=50`);
+});
+
+test('draw spacing', async () => {
+  const { root } = makeDrawFixture();
+  const labels = path.join(tempDir('draw-c'), 'labels.jsonl');
+  const run = await runMain(['--draw', '--seed', '1', '--labels', labels], { root });
+  assert.equal(run.code, 0, run.errs.join('\n'));
+  const negatives = S.readJsonl(labels).filter((row) => row.kind === 'negative');
+  assert.equal(negatives.length, 50);
+  const citedLines = { 'docs/a.md': [], 'docs/b.md': [] };
+  for (let line = 1; line <= 30; line += 1) {
+    citedLines['docs/a.md'].push(line);
+    citedLines['docs/b.md'].push(line);
+  }
+  for (const negative of negatives) {
+    assert.ok(Object.hasOwn(citedLines, negative.doc), `${negative.id} is drawn from a document no finding cites`);
+    for (const line of citedLines[negative.doc]) {
+      assert.ok(Math.abs(negative.line - line) >= 20,
+        `${negative.id} at line ${negative.line} sits within 20 lines of cited line ${line}`);
+    }
+  }
+});
+
+test('draw refuses labels', async () => {
+  const { root } = makeDrawFixture();
+  const labels = path.join(tempDir('draw-d'), 'labels.jsonl');
+  assert.equal((await runMain(['--draw', '--seed', '1', '--labels', labels], { root })).code, 0);
+  const rows = S.readJsonl(labels);
+  rows[0] = { ...rows[0], label: 'defect', labeler: 'operator' };
+  S.writeJsonl(labels, rows);
+  const before = fs.readFileSync(labels, 'utf8');
+  const refused = await runMain(['--draw', '--seed', '2', '--labels', labels], { root });
+  assert.equal(refused.code, 2);
+  assert.deepEqual(refused.lines, []);
+  assert.deepEqual(refused.errs, [`draw refused: ${labels} holds a label`]);
+  assert.equal(fs.readFileSync(labels, 'utf8'), before);
+});
+
+test('draw shortfall', async () => {
+  const { root } = makeFixture();
+  const labels = path.join(tempDir('draw-e'), 'labels.jsonl');
+  const run = await runMain(['--draw', '--seed', '1', '--labels', labels], { root });
+  assert.equal(run.code, 2);
+  assert.deepEqual(run.lines, []);
+  assert.deepEqual(run.errs, ['draw needs 25 resolvable rows in correctness, found 1']);
+  assert.equal(fs.existsSync(labels), false);
+});
+
+test('label gate 99', async () => {
+  const { root } = makeDrawFixture();
+  const bin = makeStubs();
+  const labels = writeLabels(root, 11, (index) => (index < 99 ? 'clean' : null));
+  assert.deepEqual(S.labelGate(S.readJsonl(labels)), { complete: false, labeled: 99 });
+  const run = await runMainWithStubs(['--labels', labels], { root, bin });
+  assert.equal(run.code, 0, run.errs.join('\n'));
+  assert.ok(run.lines.includes('stop: fewer than 100 labeled rows'));
+  assert.ok(!run.lines.some((line) => line.startsWith('baseline:')));
+  assert.deepEqual(stubLog(bin, 'jev'), []);
+  assert.deepEqual(stubLog(bin, 'cli-deem'), []);
+});
+
+test('default zero calls', async () => {
+  const { root } = makeFixture();
+  const bin = makeStubs();
+  const before = runGit(root, ['status', '--porcelain']);
+  const run = await runMainWithStubs([], { root, bin });
+  assert.equal(run.code, 0, run.errs.join('\n'));
+  assert.ok(run.lines.some((line) => line.startsWith('census: ')));
+  assert.ok(run.lines.some((line) => line.startsWith('severity ')));
+  assert.ok(run.lines.some((line) => line.startsWith('dimension ')));
+  assert.deepEqual(stubLog(bin, 'jev'), []);
+  assert.deepEqual(stubLog(bin, 'cli-deem'), []);
+  assert.equal(runGit(root, ['status', '--porcelain']), before);
+  assert.equal(fs.existsSync(path.join(root, 'report.json')), false);
+  assert.equal(fs.existsSync(path.join(root, 'calls.jsonl')), false);
+});
+
+test('baseline and headroom', async () => {
+  const { root } = makeDrawFixture();
+  const bin = makeStubs();
+  const labels = writeLabels(root, 12, (index) => (index < 60 ? 'clean' : 'defect'));
+  const run = await runMainWithStubs(['--labels', labels], { root, bin });
+  assert.equal(run.code, 0, run.errs.join('\n'));
+  assert.ok(run.lines.includes('baseline: flag-nothing right=60 of 100'));
+  assert.ok(run.lines.includes('baseline: defect share=40 of 100'));
+  assert.ok(run.lines.includes('margin: 0.10'));
+  assert.ok(run.lines.includes('keep rule: coverage 10*M >= 9*K, precision 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M (jev only)'));
+  assert.ok(run.lines.includes('headroom: a 10-point gain fits above 60/100'));
+  assert.deepEqual(S.ruleLines(), ['margin: 0.10',
+    'keep rule: coverage 10*M >= 9*K, precision 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M (jev only)']);
+  const correctness = 'Does this passage claim behavior that its own text shows to be wrong or inconsistent?';
+  const traceability = 'Does this passage name a spec item or requirement that the text it describes does not match or does not contain?';
+  assert.deepEqual(S.instructionLines(), [
+    `instruction correctness sha256=${S.sha256Hex(correctness)}: ${correctness}`,
+    `instruction traceability sha256=${S.sha256Hex(traceability)}: ${traceability}`
+  ]);
+  assert.deepEqual(stubLog(bin, 'jev'), []);
+  assert.deepEqual(stubLog(bin, 'cli-deem'), []);
+});
+
+test('no headroom', async () => {
+  const { root } = makeDrawFixture();
+  const bin = makeStubs();
+  const labels = writeLabels(root, 13, (index) => (index < 95 ? 'clean' : 'defect'));
+  const run = await runMainWithStubs(['--labels', labels], { root, bin });
+  assert.equal(run.code, 0, run.errs.join('\n'));
+  assert.ok(run.lines.includes('baseline: flag-nothing right=95 of 100'));
+  assert.ok(run.lines.includes('baseline: defect share=5 of 100'));
+  assert.ok(run.lines.includes('no headroom'));
+  assert.ok(!run.lines.some((line) => line.startsWith('headroom:')));
+  assert.equal(S.headroomLine({ right: 95, defect: 5, K: 100 }), 'no headroom');
+  assert.deepEqual(stubLog(bin, 'jev'), []);
+  assert.deepEqual(stubLog(bin, 'cli-deem'), []);
+});
+
+test('underpowered', () => {
+  // Four defect rows in ten: below the five a sign test needs, so no arm may start.
+  assert.equal(S.headroomLine({ right: 6, defect: 4, K: 10 }), 'underpowered');
+});
+
+test('verdict keep', () => {
+  const counts = { K: 90, M: 90, A: 90, B: 60, W: 30, L: 0, TP: 30, FP: 0, F: 0 };
+  const verdict = S.decideVerdict({ backend: 'jev', ...counts });
+  assert.equal(verdict.outcome, 'keep');
+  assert.equal(verdict.reason, null);
+  assert.equal(S.verdictText(verdict), 'keep');
+  assert.deepEqual(S.signTestP(5, 0), { p: 0.03125, below: true });
+  assert.equal(S.signTestP(4, 0).below, false, 'p 0.0625 is not below the 0.05 bar');
+  assert.equal(
+    S.verdictLine('jev', counts, verdict, 'jev_version=0.6.2 provider=official model=stub-model'),
+    'verdict jev: keep K=90 M=90 A=90 B=60 W=30 L=0 TP=30 FP=0 F=0 p=9.313e-10 jev_version=0.6.2 provider=official model=stub-model'
+  );
+});
+
+test('verdict kill precision', () => {
+  const verdict = S.decideVerdict({ backend: 'jev', K: 90, M: 90, A: 85, B: 60, W: 28, L: 3, TP: 3, FP: 2, F: 0 });
+  assert.equal(verdict.outcome, 'kill');
+  assert.equal(verdict.reason, 'precision');
+  assert.equal(S.verdictText(verdict), 'kill (precision)');
+  const counts = { K: 10, M: 10, A: 6, B: 6, W: 0, L: 0, TP: 0, FP: 0, F: 0 };
+  const deem = S.decideVerdict({ backend: 'deem', ...counts });
+  assert.equal(S.verdictText(deem), 'kill (precision)');
+  assert.equal(
+    S.verdictLine('deem', counts, deem, ''),
+    'verdict deem: kill (precision) K=10 M=10 A=6 B=6 W=0 L=0 TP=0 FP=0 F=n/a p=1.000'
+  );
+});
+
+test('verdict stop coverage', () => {
+  const verdict = S.decideVerdict({ backend: 'jev', K: 10, M: 8, A: 8, B: 3, W: 5, L: 0, TP: 5, FP: 0, F: 0 });
+  assert.equal(verdict.outcome, 'stop');
+  assert.equal(verdict.reason, 'coverage');
+  assert.equal(S.verdictText(verdict), 'stop (coverage)');
+});
+
+test('verdict stop margin', () => {
+  const verdict = S.decideVerdict({ backend: 'deem', K: 90, M: 90, A: 66, B: 60, W: 8, L: 2, TP: 28, FP: 2, F: 0 });
+  assert.equal(verdict.outcome, 'stop');
+  assert.equal(verdict.reason, 'margin');
+  assert.equal(S.verdictText(verdict), 'stop (margin)');
+});
+
+test('brier score', () => {
+  const rows = [
+    { id: 'r001', label: 'defect' },
+    { id: 'r002', label: 'clean' },
+    { id: 'r003', label: 'defect' },
+    { id: 'r004', label: 'defect' }
+  ];
+  const calls = [
+    { rowId: 'r001', probability: 1 },
+    { rowId: 'r002', probability: 0 },
+    { rowId: 'r003', probability: 0.5 }
+  ];
+  assert.equal(S.brierScore(calls, rows), 0.25 / 3, 'the unmeasured row leaves the score');
+  assert.equal(S.brierScore([], rows), null);
+});
+
+// A cli-deem stub driven by a JSON config beside it: health answers by call
+// index, and each noul answer is keyed by the window hash, so a call's
+// judgment follows the text the arm sent rather than its position.
+function writeDeemStub(bin, config) {
+  fs.writeFileSync(path.join(bin, 'cli-deem.config.json'), JSON.stringify(config));
+  const script = [
+    '#!/usr/bin/env node',
+    "'use strict';",
+    "const fs = require('fs');",
+    "const path = require('path');",
+    "const crypto = require('crypto');",
+    'const dir = __dirname;',
+    "const config = JSON.parse(fs.readFileSync(path.join(dir, 'cli-deem.config.json'), 'utf8'));",
+    'const argv = process.argv.slice(2);',
+    "fs.appendFileSync(path.join(dir, 'cli-deem.log'), JSON.stringify(argv) + '\\n');",
+    'function bump(name) {',
+    '  const file = path.join(dir, name);',
+    "  const next = (fs.existsSync(file) ? Number(fs.readFileSync(file, 'utf8')) : 0) + 1;",
+    '  fs.writeFileSync(file, String(next));',
+    '  return next - 1;',
+    '}',
+    "if (argv[0] === 'health') {",
+    "  const answer = config.health[Math.min(bump('health.count'), config.health.length - 1)];",
+    "  if (answer.stderr !== undefined) process.stderr.write(answer.stderr);",
+    '  if (answer.exit !== 0) process.exit(answer.exit);',
+    '  process.stdout.write(JSON.stringify(answer.body));',
+    '  process.exit(0);',
+    '}',
+    "if (argv[0] === 'noul') {",
+    "  const answer = config.noul[Math.min(bump('noul.count'), config.noul.length - 1)];",
+    '  if (answer.exit !== 0) process.exit(answer.exit);',
+    "  let stdin = '';",
+    "  process.stdin.setEncoding('utf8');",
+    "  process.stdin.on('data', (chunk) => { stdin += chunk; });",
+    "  process.stdin.on('end', () => {",
+    "    const key = crypto.createHash('sha256').update(stdin).digest('hex').slice(0, 12);",
+    '    const noul = (answer.probabilities ?? {})[key] ?? null;',
+    '    process.stdout.write(JSON.stringify({ answers: { answer: { noul } } }));',
+    '    process.exit(0);',
+    '  });',
+    '  return;',
+    '}',
+    'process.exit(2);',
+    ''
+  ].join('\n');
+  fs.writeFileSync(path.join(bin, 'cli-deem'), script, { mode: 0o755 });
+}
+
+// The environment the fixtures reach the stubs through: first on PATH, no
+// redirectors inherited from the caller.
+function stubEnv(bin) {
+  return { ...cleanEnv(), PATH: `${bin}${path.delimiter}${process.env.PATH}` };
+}
+
+// A hand-built plan the size of a small run, one window per row, so a case
+// reaches the arm without a drawn file.
+function smallPlan(defects, cleans) {
+  const rows = [];
+  const add = (label) => {
+    const category = rows.length % 2 === 0 ? 'correctness' : 'traceability';
+    rows.push({
+      id: `r${String(rows.length + 1).padStart(3, '0')}`,
+      category,
+      label,
+      instruction: `Q ${category}`,
+      text: `window ${rows.length + 1}`
+    });
+  };
+  for (let n = 0; n < defects; n += 1) add('defect');
+  for (let n = 0; n < cleans; n += 1) add('clean');
+  const baselineFlags = new Map(rows.map((row) => [row.id, false]));
+  return { rows, baselineFlags };
+}
+
+// The probabilities a stub answers for each hand-built plan window.
+function planProbabilities(plan) {
+  const probabilities = {};
+  for (const row of plan.rows) {
+    probabilities[S.sha256Hex(row.text).slice(0, 12)] = row.label === 'defect' ? 0.9 : 0.1;
+  }
+  return probabilities;
+}
+
+// The probabilities a stub answers for each drawn row's window, read back at
+// the commit the row names.
+function labelsProbabilities(root, labelsFile, probabilityForLabel) {
+  const probabilities = {};
+  for (const row of S.readJsonl(labelsFile)) {
+    const lines = S.readAtCommit(root, row.commit, row.doc).split('\n');
+    if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
+    const text = lines.slice(row.window_start - 1, row.window_end).join('\n');
+    probabilities[S.sha256Hex(text).slice(0, 12)] = probabilityForLabel(row.label);
+  }
+  return probabilities;
+}
+
+// The identity a stub health reports.
+function deemHealthBody(modelCommit, sourceCommit) {
+  return { ok: true, backend: 'torch', model: 'deem-0.8-v1', model_commit: modelCommit, source_commit: sourceCommit };
+}
+
+test('deem gate pass', async () => {
+  const bin = makeStubs();
+  const plan = smallPlan(5, 5);
+  writeDeemStub(bin, {
+    health: [{ exit: 0, body: deemHealthBody('mdl-gate', 'src-gate') }],
+    noul: [{ exit: 0, probabilities: planProbabilities(plan) }]
+  });
+  const lines = [];
+  const out = (line) => lines.push(line);
+  const env = stubEnv(bin);
+  const gate = S.deemGate({ out, env, repoRoot: tempDir('deem-gate-root') });
+  assert.equal(gate.passed, true);
+  assert.deepEqual(lines, ['deem: health backend=torch model=deem-0.8-v1 model_commit=mdl-gate source_commit=src-gate']);
+  const outDir = tempDir('deem-gate-out');
+  const result = await S.runDeemArm(plan, gate, { out, env, timeoutMs: 20000, callLog: S.createCallLog(outDir), stored: null });
+  assert.equal(result.column.line,
+    'verdict deem: keep K=10 M=10 A=10 B=5 W=5 L=0 TP=5 FP=0 F=n/a p=0.03125 model=deem-0.8-v1 model_commit=mdl-gate source_commit=src-gate');
+  assert.equal(lines[1], 'deem: nothing leaves the machine; planned calls: 10; estimated wall time: 0.6 s at 60.5 ms per call, the noul p50 in deem-local.md');
+  assert.ok(lines.includes('brier deem: 0.0100'));
+  assert.ok(lines.includes('flips: not applicable (deem noul)'));
+  assert.equal(lines[lines.length - 1], result.column.line);
+  assert.equal(S.readJsonl(path.join(outDir, 'calls.jsonl')).length, 10);
+  assert.deepEqual(stubLog(bin, 'cli-deem')[0], ['health']);
+});
+
+test('deem stub backend', async () => {
+  const { root } = makeDrawFixture();
+  const bin = makeStubs();
+  const labels = writeLabels(root, 31, (index) => (index < 50 ? 'defect' : 'clean'));
+  writeDeemStub(bin, { health: [{ exit: 3, stderr: '{"error":"stub backend"}' }], noul: [] });
+  const outDir = tempDir('deem-stub-out');
+  const plain = await runMainWithStubs(['--labels', labels], { root, bin });
+  const skipped = await runMainWithStubs(['--labels', labels, '--deem', '--out', outDir], { root, bin });
+  assert.equal(plain.code, 0, plain.errs.join('\n'));
+  assert.equal(skipped.code, 0, skipped.errs.join('\n'));
+  assert.deepEqual(skipped.lines.slice(0, plain.lines.length), plain.lines);
+  assert.deepEqual(skipped.lines.slice(plain.lines.length), ['deem arm skipped: stub backend']);
+  assert.deepEqual(stubLog(bin, 'cli-deem'), [['health']]);
+  assert.equal(fs.existsSync(path.join(outDir, 'calls.jsonl')), false);
+  assert.equal(fs.existsSync(path.join(outDir, 'report.json')), false);
+});
+
+test('deem keep', async () => {
+  const { root } = makeDrawFixture();
+  const bin = makeStubs();
+  const labels = writeLabels(root, 32, (index) => (index < 50 ? 'defect' : 'clean'));
+  writeDeemStub(bin, {
+    health: [{ exit: 0, body: deemHealthBody('mdl-keep', 'src-keep') }],
+    noul: [{ exit: 0, probabilities: labelsProbabilities(root, labels, (label) => (label === 'defect' ? 0.9 : 0.1)) }]
+  });
+  const outDir = tempDir('deem-keep-out');
+  const run = await runMainWithStubs(['--labels', labels, '--deem', '--out', outDir], { root, bin });
+  assert.equal(run.code, 0, run.errs.join('\n'));
+  assert.ok(run.lines.includes('brier deem: 0.0100'));
+  assert.ok(run.lines.includes('flips: not applicable (deem noul)'));
+  const verdicts = run.lines.filter((line) => line.startsWith('verdict deem: '));
+  assert.equal(verdicts.length, 1);
+  assert.equal(verdicts[0],
+    'verdict deem: keep K=100 M=100 A=100 B=50 W=50 L=0 TP=50 FP=0 F=n/a p=8.882e-16 model=deem-0.8-v1 model_commit=mdl-keep source_commit=src-keep');
+  const calls = S.readJsonl(path.join(outDir, 'calls.jsonl'));
+  assert.equal(calls.length, 100);
+  for (const call of calls) {
+    assert.equal(call.backend, 'deem');
+    assert.equal(call.rerun, 0);
+    assert.ok(Number.isFinite(call.wallMs) && call.wallMs >= 0);
+    assert.equal(call.exitCode, 0);
+    assert.equal(call.modelId, 'deem-0.8-v1');
+    assert.equal(call.modelCommit, 'mdl-keep');
+    assert.equal(call.sourceCommit, 'src-keep');
+    assert.equal(call.status, 'measured');
+    assert.equal(call.flag, call.probability >= 0.5);
+  }
+  const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
+  assert.deepEqual(Object.keys(report),
+    ['commit', 'census', 'labels', 'baseline', 'headroom', 'margin', 'keepRule', 'instructions', 'columns', 'requalify', 'stopped', 'skipped']);
+  assert.deepEqual(Object.keys(report.labels), ['path', 'sha256', 'rows', 'labeled']);
+  assert.equal(report.labels.path, labels);
+  assert.equal(report.labels.sha256, S.sha256Hex(fs.readFileSync(labels, 'utf8')));
+  assert.equal(report.labels.rows, 100);
+  assert.equal(report.labels.labeled, 100);
+  assert.deepEqual(report.baseline, { right: 50, defect: 50, K: 100 });
+  assert.equal(report.headroom, 'headroom: a 10-point gain fits above 50/100');
+  assert.equal(report.margin, 'margin: 0.10');
+  assert.ok(report.keepRule.startsWith('keep rule: coverage 10*M >= 9*K'));
+  const correctness = 'Does this passage claim behavior that its own text shows to be wrong or inconsistent?';
+  const traceability = 'Does this passage name a spec item or requirement that the text it describes does not match or does not contain?';
+  assert.deepEqual(report.instructions, {
+    correctness: { sha256: S.sha256Hex(correctness) },
+    traceability: { sha256: S.sha256Hex(traceability) }
+  });
+  assert.equal(report.columns.deem.line, verdicts[0]);
+  assert.equal(report.columns.deem.modelCommit, 'mdl-keep');
+  assert.equal(report.requalify.deem, null);
+  assert.deepEqual(report.stopped, {});
+  assert.deepEqual(report.skipped, {});
+  assert.equal(report.commit, report.census.commit);
+});
+
+test('deem exit 4 changed pair', async () => {
+  const bin = makeStubs();
+  const plan = smallPlan(5, 5);
+  writeDeemStub(bin, {
+    health: [
+      { exit: 0, body: deemHealthBody('mdl-one', 'src-one') },
+      { exit: 0, body: deemHealthBody('mdl-two', 'src-two') }
+    ],
+    noul: [{ exit: 4 }]
+  });
+  const lines = [];
+  const out = (line) => lines.push(line);
+  const env = stubEnv(bin);
+  const gate = S.deemGate({ out, env, repoRoot: tempDir('deem-stop-root') });
+  assert.equal(gate.passed, true);
+  const outDir = tempDir('deem-stop-out');
+  const result = await S.runDeemArm(plan, gate, { out, env, timeoutMs: 20000, callLog: S.createCallLog(outDir), stored: null });
+  assert.deepEqual(result, { stopped: 'deem arm stopped: model commit changed mid-run', partialRows: 0 });
+  assert.ok(lines.includes('deem arm stopped: model commit changed mid-run'));
+  assert.ok(lines.includes('deem: partial rows=0'));
+  assert.ok(!lines.some((line) => line.startsWith('verdict ')));
+  assert.deepEqual(stubLog(bin, 'cli-deem'), [['health'], ['noul', '-q', 'Q correctness'], ['health']]);
+  const calls = S.readJsonl(path.join(outDir, 'calls.jsonl'));
+  assert.equal(calls.length, 1);
+  assert.equal(calls[0].rowId, 'r001');
+  assert.equal(calls[0].rerun, 0);
+  assert.ok(Number.isFinite(calls[0].wallMs));
+  assert.equal(calls[0].exitCode, 4);
+  assert.equal(calls[0].backend, 'deem');
+  assert.equal(calls[0].probability, null);
+  assert.equal(calls[0].flag, null);
+  assert.equal(calls[0].status, 'unmeasured');
+  assert.equal(calls[0].modelCommit, 'mdl-one');
+  assert.equal(calls[0].sourceCommit, 'src-one');
+});
+
+test('--out required', async () => {
+  const { root } = makeFixture();
+  const bin = makeStubs();
+  const run = await runMainWithStubs(['--jev'], { root, bin });
+  assert.equal(run.code, 2);
+  assert.deepEqual(run.lines, []);
+  assert.deepEqual(run.errs, ['--jev and --deem need --out <dir> so every call is recorded']);
+  assert.deepEqual(stubLog(bin, 'jev'), []);
+  assert.deepEqual(stubLog(bin, 'cli-deem'), []);
+  assert.equal(fs.existsSync(path.join(root, 'report.json')), false);
+});
+
+test('requalify', async () => {
+  const bin = makeStubs();
+  const plan = smallPlan(5, 5);
+  writeDeemStub(bin, {
+    health: [{ exit: 0, body: deemHealthBody('mdl-new', 'src-new') }],
+    noul: [{ exit: 0, probabilities: planProbabilities(plan) }]
+  });
+  const lines = [];
+  const out = (line) => lines.push(line);
+  const env = stubEnv(bin);
+  const gate = S.deemGate({ out, env, repoRoot: tempDir('deem-requalify-root') });
+  const outDir = tempDir('deem-requalify-out');
+  const stored = { columns: { deem: { modelCommit: 'mdl-old', sourceCommit: 'src-old' } } };
+  const result = await S.runDeemArm(plan, gate, { out, env, timeoutMs: 20000, callLog: S.createCallLog(outDir), stored });
+  assert.equal(result.requalify, 'requalify: model commit changed');
+  const index = lines.indexOf('requalify: model commit changed');
+  assert.ok(index >= 0);
+  assert.ok(lines[index + 1].startsWith('verdict deem: '));
+  assert.equal(lines.filter((line) => line.startsWith('requalify:')).length, 1);
+});
+
+// A jev stub driven by a JSON config beside it: the version and credential
+// answers for the gate, then the model identity and a per-window noul answer
+// per call, so a call's judgment follows the text the arm sent.
+function writeJevStub(bin, config) {
+  fs.writeFileSync(path.join(bin, 'jev.config.json'), JSON.stringify(config));
+  const script = [
+    '#!/usr/bin/env node',
+    "'use strict';",
+    "const fs = require('fs');",
+    "const path = require('path');",
+    "const crypto = require('crypto');",
+    'const dir = __dirname;',
+    "const config = JSON.parse(fs.readFileSync(path.join(dir, 'jev.config.json'), 'utf8'));",
+    'const argv = process.argv.slice(2);',
+    "fs.appendFileSync(path.join(dir, 'jev.log'), JSON.stringify(argv) + '\\n');",
+    'function bump(name) {',
+    '  const file = path.join(dir, name);',
+    "  const next = (fs.existsSync(file) ? Number(fs.readFileSync(file, 'utf8')) : 0) + 1;",
+    '  fs.writeFileSync(file, String(next));',
+    '  return next - 1;',
+    '}',
+    "if (argv[0] === '--version') {",
+    "  process.stdout.write((config.version ?? 'jev 0.6.2') + '\\n');",
+    '  process.exit(0);',
+    '}',
+    "if (argv[0] === 'auth' && argv[1] === 'status') {",
+    "  const answer = config.status[Math.min(bump('status.count'), config.status.length - 1)];",
+    '  if (answer.stderr !== undefined) process.stderr.write(answer.stderr);',
+    '  process.exit(answer.exit);',
+    '}',
+    "if (argv[0] === 'auth' && argv[1] === 'test') {",
+    "  process.stdout.write(JSON.stringify({ model: config.model ?? 'stub-model' }));",
+    '  process.exit(0);',
+    '}',
+    "if (argv[0] === 'noul') {",
+    "  const answer = config.noul[Math.min(bump('noul.count'), config.noul.length - 1)];",
+    '  if (answer.exit !== 0) process.exit(answer.exit);',
+    "  let stdin = '';",
+    "  process.stdin.setEncoding('utf8');",
+    "  process.stdin.on('data', (chunk) => { stdin += chunk; });",
+    "  process.stdin.on('end', () => {",
+    "    const key = crypto.createHash('sha256').update(stdin).digest('hex').slice(0, 12);",
+    '    const noul = (answer.probabilities ?? {})[key] ?? null;',
+    '    process.stdout.write(JSON.stringify({ answers: { answer: { noul } } }));',
+    '    process.exit(0);',
+    '  });',
+    '  return;',
+    '}',
+    'process.exit(2);',
+    ''
+  ].join('\n');
+  fs.writeFileSync(path.join(bin, 'jev'), script, { mode: 0o755 });
+}
+
+test('jev gate pass', async () => {
+  const bin = makeStubs();
+  const plan = smallPlan(5, 5);
+  writeJevStub(bin, {
+    version: 'jev 0.6.2',
+    status: [{ exit: 0 }],
+    model: 'stub-model',
+    noul: [{ exit: 0, probabilities: planProbabilities(plan) }]
+  });
+  const lines = [];
+  const out = (line) => lines.push(line);
+  const env = stubEnv(bin);
+  const gate = S.jevGate({ out, env, timeoutMs: 20000 });
+  assert.equal(gate.passed, true);
+
+  const outDir = tempDir('jev-gate-out');
+  const result = await S.runJevArm(plan, gate, { out, env, timeoutMs: 20000, backoffMs: 1, callLog: S.createCallLog(outDir), stored: null });
+  assert.deepEqual(lines, [
+    `jev: path=${path.join(bin, 'jev')} provider=official`,
+    'jev: payload: windows of committed documents; planned calls: 31; estimated input tokens: 162',
+    'jev: auth test provider=official model=stub-model',
+    'brier jev: 0.0100',
+    'verdict jev: keep K=10 M=10 A=10 B=5 W=5 L=0 TP=5 FP=0 F=0 p=0.03125 jev_version=0.6.2 provider=official model=stub-model'
+  ]);
+  assert.equal(result.requalify, null);
+  assert.equal(S.readJsonl(path.join(outDir, 'calls.jsonl')).length, 31);
+
+  const requalified = await S.runJevArm(plan, gate, {
+    out, env, timeoutMs: 20000, backoffMs: 1, callLog: S.createCallLog(tempDir('jev-requalify-out')),
+    stored: { columns: { jev: { provider: 'openrouter', model: 'stub-model' } } }
+  });
+  assert.equal(requalified.requalify, 'requalify: model changed');
+  assert.equal(lines.at(-2), 'requalify: model changed');
+  assert.equal(lines.at(-1), requalified.column.line);
+});
+
+test('jev no credential', async () => {
+  const { root } = makeFixture();
+  const bin = makeStubs();
+  writeJevStub(bin, { version: 'jev 0.6.2', status: [{ exit: 3 }], model: 'stub-model', noul: [] });
+  const labels = path.join(tempDir('jev-labels'), 'labels.jsonl');
+  S.writeJsonl(labels, Array.from({ length: 99 }, (_, n) => ({ id: `r${String(n + 1).padStart(3, '0')}`, label: 'clean', labeler: 'fixture' })));
+  const outDir = path.join(tempDir('jev-no-cred'), 'run');
+  const run = await runMainWithStubs(['--labels', labels, '--jev', '--out', outDir], { root, bin });
+  assert.equal(run.code, 0, run.errs.join('\n'));
+  assert.ok(run.lines.includes('stop: fewer than 100 labeled rows'));
+  assert.ok(run.lines.includes(`jev: path=${path.join(bin, 'jev')} provider=official`));
+  assert.ok(run.lines.includes('jev arm skipped: no credential'));
+  assert.ok(!run.lines.some((line) => line.startsWith('verdict ')));
+  assert.equal(fs.existsSync(outDir), false);
+  assert.deepEqual(stubLog(bin, 'jev'), [['--version'], ['auth', 'status', '--provider', 'official']]);
+});
+
+test('jev one provider', async () => {
+  const bin = makeStubs();
+  const plan = smallPlan(1, 0);
+  writeJevStub(bin, {
+    version: 'jev 0.6.2',
+    status: [{ exit: 0 }],
+    model: 'stub-model',
+    noul: [{ exit: 0, probabilities: planProbabilities(plan) }]
+  });
+  const lines = [];
+  const out = (line) => lines.push(line);
+  const env = stubEnv(bin);
+  const gate = S.jevGate({ out, env, timeoutMs: 20000 });
+  assert.equal(gate.passed, true);
+  const outDir = tempDir('jev-provider-out');
+  const result = await S.runJevArm(plan, gate, { out, env, timeoutMs: 20000, backoffMs: 1, callLog: S.createCallLog(outDir), stored: null });
+  assert.equal(result.column.M, 1);
+  const noulCalls = stubLog(bin, 'jev').filter((args) => args[0] === 'noul');
+  assert.equal(noulCalls.length, 3);
+  for (const args of stubLog(bin, 'jev').filter((args) => args[0] !== '--version')) {
+    assert.equal(args.filter((arg) => arg === '--provider').length, 1);
+    assert.equal(args[args.indexOf('--provider') + 1], 'official');
+  }
+});
+
+test('jev exit 3 after gate', async () => {
+  const bin = makeStubs();
+  const plan = smallPlan(1, 0);
+  writeJevStub(bin, {
+    version: 'jev 0.6.2',
+    status: [{ exit: 0 }],
+    model: 'stub-model',
+    noul: [{ exit: 3 }]
+  });
+  const lines = [];
+  const out = (line) => lines.push(line);
+  const env = stubEnv(bin);
+  const gate = S.jevGate({ out, env, timeoutMs: 20000 });
+  const outDir = tempDir('jev-key-out');
+  const result = await S.runJevArm(plan, gate, { out, env, timeoutMs: 20000, backoffMs: 1, callLog: S.createCallLog(outDir), stored: null });
+  assert.deepEqual(result, { stopped: 'jev arm stopped: key rejected', partialRows: 0 });
+  assert.deepEqual(lines.slice(-2), ['jev arm stopped: key rejected', 'jev: partial rows=0']);
+  assert.ok(!lines.some((line) => line.startsWith('verdict ')));
+});
```
