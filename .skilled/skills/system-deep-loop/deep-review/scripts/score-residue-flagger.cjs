#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: score-residue-flagger                                         ║
// ║ offline residue-flagger measurement census                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * score-residue-flagger.cjs — counts finding tables and resolvable citations
 * across committed review documents. The default run is a census
 * only: it spawns no backend call and writes no file.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawn, spawnSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SCRIPT_DIR = __dirname;
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const LABELS_PATH = path.join(SCRIPT_DIR, 'residue-flagger-labels.jsonl');
const CATEGORIES = ['correctness', 'traceability'];
const CANONICAL_DIMENSIONS = ['correctness', 'security', 'traceability', 'maintainability'];
const LABEL_GATE = 100;
const ROWS_TOTAL = 100;
const POSITIVES = 50;
const NEGATIVES = 50;
const PER_CATEGORY = 25;
const WINDOW_RADIUS = 10;
const NEGATIVE_MIN_GAP = 20;
const FLAG_AT = 0.5;
const JEV_RERUNS = 3;
const MARGIN_LINE = 'margin: 0.10';
const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, precision 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M (jev only)';
const USAGE = 'usage: score-residue-flagger.cjs [--labels <file>] [--draw --seed <n> | --jev] [--out <dir>]';
const INSTRUCTION_CORRECTNESS = 'Does this passage claim behavior that its own text shows to be wrong or inconsistent?';
const INSTRUCTION_TRACEABILITY = 'Does this passage name a spec item or requirement that the text it describes does not match or does not contain?';
const JEV_VERSION = 'jev 0.6.2';

const CALL_TIMEOUT_MS = 90000;
const BACKOFF_MS = 2000;


// ─────────────────────────────────────────────────────────────────────────────
// 3. CENSUS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run one git command against a repository and return its stdout.
 *
 * The caller's git redirector variables are stripped first, so a fixture
 * repository can never inherit an outer worktree's pointers.
 *
 * @param {string} repoRoot - Repository path handed to git as -C.
 * @param {string[]} args - Git arguments after the -C flag.
 * @returns {string} The command's standard output.
 * @throws {Error} When git exits non-zero.
 */
function git(repoRoot, args) {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (key.startsWith('GIT_')) delete env[key];
  }
  // A repository's full path list and file reads exceed the 1 MB spawn default.
  const result = spawnSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8', env, maxBuffer: 268435456 });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} exited ${result.status}`);
  }
  return result.stdout;
}

/**
 * List the paths in HEAD's tree in git's own order.
 *
 * Every read is at a commit, so a path only the index holds is left out,
 * and a path staged for deletion stays in.
 *
 * @param {string} repoRoot - Repository path.
 * @returns {string[]} Every path in HEAD's tree.
 */
function trackedFiles(repoRoot) {
  return git(repoRoot, ['ls-tree', '-r', '-z', '--name-only', 'HEAD']).split('\0').filter((entry) => entry.length > 0);
}

/**
 * Resolve the repository's current HEAD commit.
 *
 * @param {string} repoRoot - Repository path.
 * @returns {string} The full HEAD sha.
 */
function headCommit(repoRoot) {
  return git(repoRoot, ['rev-parse', 'HEAD']).trim();
}

/**
 * Read one tracked file's text at a commit.
 *
 * Every corpus read goes through git, so a dirty worktree can never
 * substitute for the committed tree under measurement.
 *
 * @param {string} repoRoot - Repository path.
 * @param {string} commit - Commit sha to read at.
 * @param {string} relPath - Repository-relative file path.
 * @returns {string} The file's text at that commit.
 * @throws {Error} When the path does not exist at that commit.
 */
function readAtCommit(repoRoot, commit, relPath) {
  return git(repoRoot, ['show', `${commit}:${relPath}`]);
}

/**
 * Select the review corpus from a tracked-path list: markdown under specs/
 * that lives in a review or ai-council folder, never in a context or scratch
 * folder.
 *
 * @param {string[]} tracked - Tracked paths from trackedFiles.
 * @returns {string[]} The matching paths in tracked order.
 */
function walkReviewFiles(tracked) {
  return tracked.filter((entry) =>
    entry.startsWith('specs/') &&
    entry.endsWith('.md') &&
    (entry.includes('/review/') || entry.includes('/ai-council/')) &&
    !entry.includes('/context/') &&
    !entry.includes('/scratch/'));
}

/**
 * Parse the finding tables of one review document.
 *
 * A recognized header names a severity column, a dimension column and a
 * location column; its shape is those three names joined by pipes. Only rows
 * whose severity cell is P0, P1 or P2 become finding rows. A table whose
 * header lacks any of the three is recorded as skipped with its header line
 * only when one of its data rows holds a cell exactly P0, P1 or P2.
 * Dimension cells map onto the canonical stems by substring, else 'other'.
 *
 * @param {string} text - The document's full text.
 * @param {string} file - The review file the text came from.
 * @returns {{tables: Array<{shape: string, headerLine: number, rows: Array<{line: number, severity: string, dimension: string, location: string}>}>, skipped: Array<{line: number, header: string}>}} The parsed tables and skipped headers.
 */
function parseFindingTables(text, file) {
  const tables = [];
  const skipped = [];
  const lines = String(text).split('\n');
  const cellsOf = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) {
      cellsOf.push(null);
      continue;
    }
    const parts = trimmed.split('|');
    if (parts[0].trim() === '') parts.shift();
    if (parts.length > 0 && parts[parts.length - 1].trim() === '') parts.pop();
    cellsOf.push(parts.map((cell) => cell.trim()));
  }
  const isDelimiter = cellsOf.map((cells) =>
    cells !== null && cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell)));
  let i = 0;
  while (i < lines.length) {
    const headerCells = cellsOf[i];
    const delimiterCells = i + 1 < lines.length ? cellsOf[i + 1] : null;
    if (headerCells === null || delimiterCells === null || !isDelimiter[i + 1] || delimiterCells.length !== headerCells.length) {
      i += 1;
      continue;
    }
    const headerLine = i + 1;
    let sevIdx = -1;
    let dimIdx = -1;
    let locIdx = -1;
    for (let c = 0; c < headerCells.length; c += 1) {
      const name = headerCells[c];
      if (sevIdx === -1 && (name === 'Severity' || name === 'Sev')) sevIdx = c;
      else if (dimIdx === -1 && name === 'Dimension') dimIdx = c;
      else if (locIdx === -1 && (name === 'File:Line' || name === 'File' || name === 'Evidence')) locIdx = c;
    }
    const recognized = sevIdx !== -1 && dimIdx !== -1 && locIdx !== -1;
    const table = recognized ? { shape: [headerCells[sevIdx], headerCells[dimIdx], headerCells[locIdx]].join('|'), headerLine, rows: [] } : null;
    let holdsSeverity = false;
    let j = i + 2;
    while (j < lines.length && cellsOf[j] !== null) {
      const data = cellsOf[j];
      if (data.some((cell) => cell === 'P0' || cell === 'P1' || cell === 'P2')) {
        holdsSeverity = true;
      }
      if (table !== null && data.length > locIdx) {
        const severity = data[sevIdx];
        if (severity === 'P0' || severity === 'P1' || severity === 'P2') {
          const dimLower = (data[dimIdx] || '').toLowerCase();
          let dimension = 'other';
          if (dimLower.includes('correctness')) dimension = 'correctness';
          else if (dimLower.includes('security')) dimension = 'security';
          else if (dimLower.includes('traceab')) dimension = 'traceability';
          else if (dimLower.includes('maintainab')) dimension = 'maintainability';
          table.rows.push({ line: j + 1, severity, dimension, location: data[locIdx] || '' });
        }
      }
      j += 1;
    }
    if (table !== null) {
      tables.push(table);
    } else if (holdsSeverity) {
      skipped.push({ line: headerLine, header: lines[i].trim() });
    }
    i = j;
  }
  return { tables, skipped };
}

/**
 * Find the commit that added a path.
 *
 * @param {string} repoRoot - Repository path.
 * @param {string} relPath - Repository-relative file path.
 * @returns {string|null} The adding commit's sha, or null when the path was never added.
 */
function addingCommit(repoRoot, relPath) {
  const out = git(repoRoot, ['log', '--diff-filter=A', '-1', '--format=%H', '--', relPath]).trim();
  return out.length > 0 ? out : null;
}

/**
 * Resolve the commit a review file's findings are judged against: the first
 * parent of the commit that added it. A root commit has no parent to review
 * against, so its rows leave the frame.
 *
 * @param {string} repoRoot - Repository path.
 * @param {string} relPath - Repository-relative review file path.
 * @returns {string|null} The reviewed commit's sha, or null when there is none.
 */
function reviewedCommit(repoRoot, relPath) {
  const added = addingCommit(repoRoot, relPath);
  if (added === null) return null;
  const parents = git(repoRoot, ['log', '-1', '--format=%P', added]).trim();
  if (parents === '') return null;
  return parents.split(' ')[0];
}

/**
 * Resolve one location cell to a cited line.
 *
 * The cell's first path token wins. A basename starting .env, or a path
 * outside the tracked list, is refused before anything opens. A missing line,
 * a line past the file's end at the reviewed commit, or a file absent at that
 * commit, is dropped.
 *
 * @param {string} cell - The location cell text.
 * @param {{commit: string, tracked: string[], repoRoot: string}} ctx - The reviewed commit, the tracked paths and the repository path.
 * @returns {{status: 'resolved'|'refused'|'dropped', path: string|null, line: number|null}} Where the cell landed.
 */
function resolveLocation(cell, { commit, tracked, repoRoot }) {
  const trackedSet = new Set(tracked);
  for (const token of String(cell).split(/\s+/)) {
    if (token.length === 0) continue;
    let cellPath = token;
    let cellLine = null;
    const withLine = /^(.*):([0-9]+)$/.exec(token);
    if (withLine !== null) {
      cellPath = withLine[1];
      cellLine = Number(withLine[2]);
    }
    const base = path.basename(cellPath);
    if (base.startsWith('.env')) {
      return { status: 'refused', path: cellPath, line: cellLine };
    }
    if (!cellPath.endsWith('.md')) continue;
    if (!trackedSet.has(cellPath)) {
      return { status: 'refused', path: cellPath, line: cellLine };
    }
    if (cellLine === null) {
      return { status: 'dropped', path: cellPath, line: null };
    }
    let cited;
    try {
      cited = readAtCommit(repoRoot, commit, cellPath);
    } catch {
      return { status: 'dropped', path: cellPath, line: cellLine };
    }
    const citedLines = cited.split('\n');
    if (citedLines.length > 0 && citedLines[citedLines.length - 1] === '') citedLines.pop();
    if (cellLine < 1 || cellLine > citedLines.length) {
      return { status: 'dropped', path: cellPath, line: cellLine };
    }
    return { status: 'resolved', path: cellPath, line: cellLine };
  }
  return { status: 'dropped', path: null, line: null };
}

/**
 * Census the corpus at HEAD: review files read, recognized tables, finding
 * rows, and where each row's location landed.
 *
 * Review documents read at HEAD; cited lines resolve at the row's reviewed
 * commit. Rows of a review file with no reviewed commit count as dropped.
 *
 * @param {string} repoRoot - Repository path.
 * @param {string[]} tracked - Tracked paths from trackedFiles.
 * @returns {{commit: string, files: number, tables: number, rows: number, bySeverity: Object<string, number>, byDimension: Object<string, number>, byShape: Object<string, {tables: number, rows: number}>, skipped: Array<{file: string, line: number, header: string}>, resolvable: Object<string, number>, refused: number, dropped: number}} The census counts.
 */
function buildCensus(repoRoot, tracked) {
  const commit = headCommit(repoRoot);
  const files = walkReviewFiles(tracked);
  let tables = 0;
  let rows = 0;
  let refused = 0;
  let dropped = 0;
  const bySeverity = { P0: 0, P1: 0, P2: 0 };
  const byDimension = {};
  for (const dimension of [...CANONICAL_DIMENSIONS, 'other']) byDimension[dimension] = 0;
  const byShape = {};
  const skipped = [];
  const resolvable = {};
  for (const category of CATEGORIES) resolvable[category] = 0;
  for (const file of files) {
    const parsed = parseFindingTables(readAtCommit(repoRoot, commit, file), file);
    // Resolving a reviewed commit costs two git log calls, so a file pays for
    // one only when it holds a parsed row: a rowless file's commit is unused.
    const reviewed = parsed.tables.some((table) => table.rows.length > 0) ? reviewedCommit(repoRoot, file) : null;
    for (const table of parsed.tables) {
      tables += 1;
      const shape = byShape[table.shape] || (byShape[table.shape] = { tables: 0, rows: 0 });
      shape.tables += 1;
      for (const row of table.rows) {
        rows += 1;
        shape.rows += 1;
        bySeverity[row.severity] += 1;
        byDimension[row.dimension] += 1;
        if (reviewed === null) {
          dropped += 1;
          continue;
        }
        const hit = resolveLocation(row.location, { commit: reviewed, tracked, repoRoot });
        if (hit.status === 'refused') refused += 1;
        else if (hit.status === 'dropped') dropped += 1;
        else if (CATEGORIES.includes(row.dimension)) resolvable[row.dimension] += 1;
      }
    }
    for (const entry of parsed.skipped) skipped.push({ file, line: entry.line, header: entry.header });
  }
  return { commit, files: files.length, tables, rows, bySeverity, byDimension, byShape, skipped, resolvable, refused, dropped };
}

/**
 * Format a census as its report lines: the census line, the severity and
 * dimension tallies, one sorted header line per recognized shape, one sorted
 * skip line per skipped table, then the resolvable tally.
 *
 * @param {{commit: string, files: number, tables: number, rows: number, bySeverity: Object<string, number>, byDimension: Object<string, number>, byShape: Object<string, {tables: number, rows: number}>, skipped: Array<{file: string, line: number, header: string}>, resolvable: Object<string, number>, refused: number, dropped: number}} census - A census from buildCensus.
 * @returns {string[]} The census lines, in report order.
 */
function censusLines(census) {
  const lines = [];
  lines.push(`census: commit=${census.commit.slice(0, 12)} files=${census.files} tables=${census.tables} rows=${census.rows} skipped=${census.skipped.length}`);
  lines.push(`severity P0=${census.bySeverity.P0} P1=${census.bySeverity.P1} P2=${census.bySeverity.P2}`);
  lines.push(`dimension correctness=${census.byDimension.correctness} security=${census.byDimension.security} traceability=${census.byDimension.traceability} maintainability=${census.byDimension.maintainability}`);
  for (const shape of Object.keys(census.byShape).sort()) {
    const cell = census.byShape[shape];
    lines.push(`header "${shape}": tables=${cell.tables} rows=${cell.rows}`);
  }
  const skippedSorted = [...census.skipped].sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : a.line - b.line));
  for (const entry of skippedSorted) {
    lines.push(`census skipped: ${entry.file}:${entry.line}`);
  }
  lines.push(`resolvable: correctness=${census.resolvable.correctness} traceability=${census.resolvable.traceability} refused=${census.refused} dropped=${census.dropped}`);
  return lines;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DRAW
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hash text with SHA-256. Every published digest comes from this one helper,
 * so a digest always compares across runs.
 *
 * @param {string} text - The text to hash.
 * @returns {string} The lowercase hex digest.
 */
function sha256Hex(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Build a seeded 32-bit PRNG returning numbers in [0, 1), so one seed alone
 * fixes every pick a draw makes.
 *
 * @param {number} seed - The draw seed.
 * @returns {() => number} A function returning the next number in [0, 1).
 */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Draw the labels file's fixed budgets: PER_CATEGORY seeded positives per
 * category taken from the corpus's resolvable rows, and PER_CATEGORY seeded
 * negatives per category taken from the same documents at the same commits,
 * every one at least NEGATIVE_MIN_GAP lines from any line that document
 * cites. A row carries coordinates and a window hash, never passage text.
 * One seed reproduces one file byte for byte.
 *
 * @param {{resolvable: Object<string, number>}} census - A census from buildCensus; its resolvable counts gate the draw.
 * @param {string} repoRoot - Repository path.
 * @param {string} commit - The commit the corpus is read at.
 * @param {number} seed - The draw seed.
 * @returns {object[]} ROWS_TOTAL label rows, positives first, ids r001..r100.
 * @throws {Error} When a category holds fewer than PER_CATEGORY resolvable rows, or fewer than PER_CATEGORY spaced negative lines.
 */
function drawRows(census, repoRoot, commit, seed) {
  for (const category of CATEGORIES) {
    if (census.resolvable[category] < PER_CATEGORY) {
      throw new Error(`draw needs ${PER_CATEGORY} resolvable rows in ${category}, found ${census.resolvable[category]}`);
    }
  }
  const tracked = trackedFiles(repoRoot);
  const candidates = {};
  for (const category of CATEGORIES) candidates[category] = [];
  // Every resolved citation is remembered per document, so a negative stays
  // clear of all of a document's cited lines, not just its own category's.
  const documents = new Map();
  for (const file of walkReviewFiles(tracked)) {
    const reviewed = reviewedCommit(repoRoot, file);
    if (reviewed === null) continue;
    const parsed = parseFindingTables(readAtCommit(repoRoot, commit, file), file);
    for (const table of parsed.tables) {
      for (const row of table.rows) {
        const hit = resolveLocation(row.location, { commit: reviewed, tracked, repoRoot });
        if (hit.status !== 'resolved') continue;
        const key = `${hit.path}\u0000${reviewed}`;
        let document = documents.get(key);
        if (document === undefined) {
          document = { doc: hit.path, commit: reviewed, source: file, cited: new Set() };
          documents.set(key, document);
        }
        document.cited.add(hit.line);
        if (CATEGORIES.includes(row.dimension)) {
          candidates[row.dimension].push({ source: file, category: row.dimension, doc: hit.path, line: hit.line, commit: reviewed });
        }
      }
    }
  }
  const rand = mulberry32(seed);
  // Fisher-Yates over a copy on one shared stream: the seed alone fixes every pick.
  const shuffled = (items) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  // A document's lines at its reviewed commit, read once for both its windows
  // and its eligible negatives.
  const linesAt = new Map();
  const documentLines = (document) => {
    const key = `${document.doc}\u0000${document.commit}`;
    let lines = linesAt.get(key);
    if (lines === undefined) {
      lines = readAtCommit(repoRoot, document.commit, document.doc).split('\n');
      if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
      linesAt.set(key, lines);
    }
    return lines;
  };
  const rows = [];
  const addRow = (kind, candidate) => {
    const lines = documentLines(candidate);
    const start = Math.max(1, candidate.line - WINDOW_RADIUS);
    const end = Math.min(lines.length, candidate.line + WINDOW_RADIUS);
    rows.push({
      id: `r${String(rows.length + 1).padStart(3, '0')}`,
      source: candidate.source,
      category: candidate.category,
      doc: candidate.doc,
      line: candidate.line,
      window_start: start,
      window_end: end,
      commit: candidate.commit,
      window_sha12: sha256Hex(lines.slice(start - 1, end).join('\n')).slice(0, 12),
      kind,
      label: null,
      labeler: null
    });
  };
  for (const category of CATEGORIES) {
    for (const candidate of shuffled(candidates[category]).slice(0, PER_CATEGORY)) {
      addRow('positive', candidate);
    }
  }
  for (const category of CATEGORIES) {
    const pool = [];
    const seen = new Set();
    for (const candidate of candidates[category]) {
      const key = `${candidate.doc}\u0000${candidate.commit}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const document = documents.get(key);
      for (let line = 1; line <= documentLines(document).length; line += 1) {
        let spaced = true;
        for (const cited of document.cited) {
          if (Math.abs(line - cited) < NEGATIVE_MIN_GAP) {
            spaced = false;
            break;
          }
        }
        if (spaced) pool.push({ source: document.source, category, doc: document.doc, line, commit: document.commit });
      }
    }
    if (pool.length < PER_CATEGORY) {
      throw new Error(`draw needs ${PER_CATEGORY} negative lines for ${category}, found ${pool.length}`);
    }
    for (const candidate of shuffled(pool).slice(0, PER_CATEGORY)) {
      addRow('negative', candidate);
    }
  }
  return rows;
}

/**
 * Read a JSON Lines file, or null when the file does not exist. A line that is
 * not JSON names the file and line, so a corrupted labels file is never
 * silently treated as unlabeled.
 *
 * @param {string} file - The JSONL file path.
 * @returns {object[]|null} The parsed rows, or null when the file does not exist.
 */
function readJsonl(file) {
  if (!fs.existsSync(file)) return null;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const rows = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].trim() === '') continue;
    try {
      rows.push(JSON.parse(lines[i]));
    } catch {
      throw new Error(`${path.basename(file)}:${i + 1}: not JSON`);
    }
  }
  return rows;
}

/**
 * Write rows as JSON Lines, creating the parent directory first. Rows join in
 * a fixed shape, so one seed reproduces one file byte for byte.
 *
 * @param {string} file - The JSONL file path.
 * @param {object[]} rows - The rows to write, one per line.
 * @returns {void}
 */
function writeJsonl(file, rows) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
}

/**
 * Report whether any drawn row already carries a label. A draw refuses when it
 * does, so operator work is never overwritten.
 *
 * @param {object[]|null} rows - The rows read from the labels file.
 * @returns {boolean} True when at least one row carries a label.
 */
function holdsLabels(rows) {
  return (rows ?? []).some((row) => row.label !== null && row.label !== undefined);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LABEL GATE, BASELINE AND HEADROOM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Count the labeled rows and report whether the gate is complete. Only the
 * operator's two labels count, so a drawn row still carrying null holds every
 * run on the stop line.
 *
 * @param {object[]|null} rows - The rows read from the labels file.
 * @returns {{complete: boolean, labeled: number}} The gate counts and completeness.
 */
function labelGate(rows) {
  const labeled = (rows ?? []).filter((row) => row.label === 'defect' || row.label === 'clean').length;
  return { complete: labeled === LABEL_GATE, labeled };
}

/**
 * Format the flag-nothing baseline over the labeled rows: how often doing
 * nothing is right, and the defect share any gain has to come from.
 *
 * @param {{right: number, defect: number, K: number}} summary - The baseline summary built from the labeled rows.
 * @returns {string[]} The two baseline lines, in report order.
 */
function baselineLines(summary) {
  return [
    `baseline: flag-nothing right=${summary.right} of ${summary.K}`,
    `baseline: defect share=${summary.defect} of ${summary.K}`,
  ];
}

/**
 * Report the headroom the flag-nothing baseline leaves. A baseline right on
 * more than nine tenths of the rows has no room for a 10-point gain, and fewer
 * than five defect rows cannot carry a sign test to 0.05; otherwise the gain
 * still fits.
 *
 * @param {{right: number, defect: number, K: number}} summary - The baseline summary built from the labeled rows.
 * @returns {string} The headroom line, or why no arm may start.
 */
function headroomLine(summary) {
  if (10 * summary.right > 9 * summary.K) return 'no headroom';
  if (summary.defect < 5) return 'underpowered';
  return `headroom: a 10-point gain fits above ${summary.right}/${summary.K}`;
}

/**
 * Format the fixed rules as the report's lines: the margin and the whole keep
 * rule, restated for the reader before any call.
 *
 * @returns {string[]} The margin and keep-rule lines, in report order.
 */
function ruleLines() {
  return [MARGIN_LINE, KEEP_RULE_LINE];
}

/**
 * Format the two fixed instructions with their digests. The digest proves the
 * prompt text a run used, and both lines print before any call.
 *
 * @returns {string[]} The two instruction lines, in report order.
 */
function instructionLines() {
  return [
    `instruction correctness sha256=${sha256Hex(INSTRUCTION_CORRECTNESS)}: ${INSTRUCTION_CORRECTNESS}`,
    `instruction traceability sha256=${sha256Hex(INSTRUCTION_TRACEABILITY)}: ${INSTRUCTION_TRACEABILITY}`,
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. KEEP RULE AND VERDICT
// ─────────────────────────────────────────────────────────────────────────────

// Counts stay integers and the sign test's p is exact, so no rounding decides a verdict.

/**
 * One-sided sign test on the rows only this column got right against the rows
 * only the baseline got right. The tail sum is built coefficient by
 * coefficient in BigInt, and the threshold test is exact: 20 * num < 2^n is
 * p < 0.05 with no float comparison. No disagreements give p 1.
 *
 * @param {number} wins - Rows only the column got right.
 * @param {number} losses - Rows only the baseline got right.
 * @returns {{p: number, below: boolean}} The one-sided p and whether it is below 0.05.
 */
function signTestP(wins, losses) {
  const n = wins + losses;
  if (n === 0) return { p: 1, below: false };
  let coefficient = 1n;
  let num = 0n;
  for (let i = 0; i <= n; i += 1) {
    if (i > 0) coefficient = (coefficient * BigInt(n - i + 1)) / BigInt(i);
    if (i >= wins) num += coefficient;
  }
  const den = 1n << BigInt(n);
  return { p: Number(num) / Number(den), below: 20n * num < den };
}

/**
 * Score one column's probabilities against its labels over the rows it
 * measured. A row's probability is the mean of its finite per-call
 * probabilities in [0, 1], and the score is the mean squared error against
 * 1 for a defect row and 0 for a clean row. Nothing measured has no score.
 *
 * @param {Array<{rowId: string, probability: number}>} calls - The column's calls, unmeasured entries included.
 * @param {Array<{id: string, label: string|null}>} rows - The labeled draw rows.
 * @returns {number|null} The mean Brier score, or null when no row measured.
 */
function brierScore(calls, rows) {
  const byRow = new Map();
  for (const call of calls) {
    if (!Number.isFinite(call.probability) || call.probability < 0 || call.probability > 1) continue;
    const list = byRow.get(call.rowId);
    if (list === undefined) byRow.set(call.rowId, [call.probability]);
    else list.push(call.probability);
  }
  let sum = 0;
  let measured = 0;
  for (const row of rows) {
    if (row.label !== 'defect' && row.label !== 'clean') continue;
    const list = byRow.get(row.id);
    if (list === undefined) continue;
    const mean = list.reduce((total, value) => total + value, 0) / list.length;
    const actual = row.label === 'defect' ? 1 : 0;
    sum += (mean - actual) ** 2;
    measured += 1;
  }
  return measured === 0 ? null : sum / measured;
}

/**
 * Decide one column's verdict from its counts. The first failing check wins:
 * coverage, precision, margin, the sign test, then flips for the jev
 * backend. Every outcome carries the sign test's p.
 *
 * @param {{K: number, M: number, A: number, B: number, W: number, L: number, TP: number, FP: number, F: number}} counts - The column's counts.
 * @returns {{outcome: string, reason: string|null, p: number}} The outcome, its failing check or null, and the sign test's p.
 */
function decideVerdict({ K, M, A, B, W, L, TP, FP, F }) {
  const sign = signTestP(W, L);
  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', p: sign.p };
  if (!(TP + FP >= 1 && 5 * TP >= 4 * (TP + FP))) return { outcome: 'kill', reason: 'precision', p: sign.p };
  if (!(10 * (A - B) >= M)) return { outcome: 'stop', reason: 'margin', p: sign.p };
  if (!sign.below) return { outcome: 'stop', reason: 'sign test', p: sign.p };
  if (!(10 * F <= 3 * M)) return { outcome: 'stop', reason: 'flips', p: sign.p };
  return { outcome: 'keep', reason: null, p: sign.p };
}

/**
 * Render a verdict as its report words: keep, kill (precision), or stop
 * followed by the failing check.
 *
 * @param {{outcome: string, reason: string|null}} v - A verdict from decideVerdict.
 * @returns {string} The verdict text.
 */
function verdictText(v) {
  if (v.outcome === 'keep') return 'keep';
  if (v.outcome === 'kill') return 'kill (precision)';
  return `stop (${v.reason})`;
}

/**
 * Assemble one column's verdict line: the verdict, every count, the sign
 * test's p at four significant digits, and the column's identity suffix.

 *
 * @param {string} backend - The column's backend.
 * @param {{K: number, M: number, A: number, B: number, W: number, L: number, TP: number, FP: number, F: number}} counts - The column's counts.
 * @param {{p: number}} decision - The column's verdict from decideVerdict.
 * @param {string} suffix - The column identity text, appended when non-empty.
 * @returns {string} The verdict line.
 */
function verdictLine(backend, counts, decision, suffix) {
  const flips = counts.F;
  const line = `verdict ${backend}: ${verdictText(decision)} K=${counts.K} M=${counts.M} A=${counts.A} B=${counts.B} W=${counts.W} L=${counts.L} TP=${counts.TP} FP=${counts.FP} F=${flips} p=${decision.p.toPrecision(4)}`;
  return suffix ? `${line} ${suffix}` : line;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CALLS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped. A missing path, a directory, or a file that
 * cannot be executed is not a match.
 *
 * @param {string} name - Executable file name.
 * @param {{PATH?: string}} env - Environment whose PATH is searched.
 * @returns {string|null} The first executable match, or null when none is executable.
 */
function which(name, env) {
  for (const dir of (env.PATH ?? '').split(path.delimiter)) {
    if (dir.length === 0) continue;
    const candidate = path.join(dir, name);
    try {
      if (fs.statSync(candidate).isFile()) {
        fs.accessSync(candidate, fs.constants.X_OK);
        return candidate;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time and whether the timeout fired. The timer
 * kills the child and resolves at once, without waiting for close: a
 * grandchild can hold the pipes open past the kill. Stdin is closed after the
 * write because the CLI reads stdin to EOF and exits 2 on an inherited
 * terminal. A spawn error is code 127 with the message as stderr.
 *
 * @param {string} file - Executable to spawn.
 * @param {string[]} args - Arguments after the executable.
 * @param {string} stdinText - Text written to stdin, then closed.
 * @param {Record<string, string|undefined>} env - Child environment.
 * @param {number} timeoutMs - Kill and resolve after this many milliseconds.
 * @returns {Promise<{code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean}>} One call's outcome.
 */
function spawnCall(file, args, stdinText, env, timeoutMs) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(file, args, { env, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let settled = false;

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    // A child that exits before reading stdin cannot fail the call through
    // the pipe: its exit code is the outcome the caller needs.
    child.stdin.on('error', () => {});
    child.stdin.end(stdinText);

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      settle(null, true);
    }, timeoutMs);

    function settle(code, timedOut) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr, wallMs: Date.now() - start, timedOut });
    }

    child.on('close', (code) => settle(code === null ? -1 : code, false));
    child.on('error', (error) => {
      stderr = error.message;
      settle(127, false);
    });
  });
}

/**
 * One JSON-line record per model call under outDir. A missing or empty outDir
 * keeps no records, so nothing is created. The file is created empty on the
 * first append, and one line per call keeps a killed arm's earlier records
 * readable.
 *
 * @param {string|null} outDir - Directory that holds calls.jsonl.
 * @returns {{append: (record: object) => void}} Append-only call log.
 */
function createCallLog(outDir) {
  let created = false;
  return {
    append(record) {
      if (typeof outDir !== 'string' || outDir === '') return;
      const filePath = path.join(outDir, 'calls.jsonl');
      if (!created) {
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(filePath, '');
        created = true;
      }
      fs.appendFileSync(filePath, `${JSON.stringify(record)}\n`);
    },
  };
}

/**
 * Parsed report.json written by an earlier run into the same out directory.
 *
 * @param {string|null} outDir - Directory that may hold report.json.
 * @returns {object|null} The parsed report, or null when outDir is empty, the file is missing, or the file does not parse.
 */
function readStoredReport(outDir) {
  if (typeof outDir !== 'string' || outDir === '') return null;
  try {
    return JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. ARM PLAN AND COLUMN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the scored rows an arm reads: one entry per labeled row, with the
 * window text read back from the commit the row was drawn at and the fixed
 * instruction for its category. A window that no longer hashes to the drawn
 * value is an unreadable input, not a measurement.
 *
 * @param {string} repoRoot - Repository path.
 * @param {object[]} labels - The labeled draw rows.
 * @returns {{rows: Array<{id: string, category: string, label: string, instruction: string, text: string}>, baselineFlags: Map<string, boolean>}} The arm's rows and flag-nothing flags, every flag false because flag-nothing never flags.
 * @throws {Error} When a window does not match its recorded hash.
 */
function buildPlan(repoRoot, labels) {
  const rows = [];
  const baselineFlags = new Map();
  for (const row of labels) {
    if (row.label !== 'defect' && row.label !== 'clean') continue;
    const lines = readAtCommit(repoRoot, row.commit, row.doc).split('\n');
    if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
    const text = lines.slice(row.window_start - 1, row.window_end).join('\n');
    if (sha256Hex(text).slice(0, 12) !== row.window_sha12) {
      throw new Error(`${row.id}: window does not match its recorded hash`);
    }
    rows.push({
      id: row.id,
      category: row.category,
      label: row.label,
      instruction: row.category === 'correctness' ? INSTRUCTION_CORRECTNESS : INSTRUCTION_TRACEABILITY,
      text,
    });
    baselineFlags.set(row.id, false);
  }
  return { rows, baselineFlags };
}

/**
 * Score one backend's measured rows into its verdict column: the accuracy and
 * gain counts against flag-nothing, the sign test, the flag totals and the
 * report line. A row counts only once it holds exactly the expected calls,
 * each a finite probability in [0, 1]; rows that did not measure leave the
 * column.
 *
 * @param {string} backend - The column's backend.
 * @param {Array<{id: string, label: string}>} rows - The plan rows in draw order.
 * @param {Map<string, (number|null)[]>} probs - Per-row probabilities, one entry per call.
 * @param {Map<string, boolean>} baselineFlags - Per-row flags from the chosen baseline.
 * @param {string} suffix - Column identity text appended to the line when non-empty.
 * @returns {{backend: string, K: number, M: number, A: number, B: number, W: number, L: number, TP: number, FP: number, F: number, p: number, outcome: string, reason: string|null, line: string}} The column summary.
 */
function summarizeColumn(backend, rows, probs, baselineFlags, suffix) {
  const expected = JEV_RERUNS;
  const K = rows.length;
  let M = 0;
  let A = 0;
  let B = 0;
  let W = 0;
  let L = 0;
  let TP = 0;
  let FP = 0;
  let F = 0;
  for (const row of rows) {
    const list = probs.get(row.id);
    if (!Array.isArray(list) || list.length !== expected || !list.every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) continue;
    M += 1;
    const yes = list.filter((value) => value >= FLAG_AT).length;
    const flag = 2 * yes > list.length;
    F += Math.min(yes, list.length - yes);
    const right = (flag ? 'defect' : 'clean') === row.label;
    const baseRight = (baselineFlags.get(row.id) === true ? 'defect' : 'clean') === row.label;
    if (right) A += 1;
    if (baseRight) B += 1;
    if (right && !baseRight) W += 1;
    if (baseRight && !right) L += 1;
    if (flag) {
      if (row.label === 'defect') TP += 1;
      else FP += 1;
    }
  }
  const decision = decideVerdict({ K, M, A, B, W, L, TP, FP, F });
  const line = verdictLine(backend, { K, M, A, B, W, L, TP, FP, F }, decision, suffix);
  return { backend, K, M, A, B, W, L, TP, FP, F, p: decision.p, outcome: decision.outcome, reason: decision.reason, line };
}


// ─────────────────────────────────────────────────────────────────────────────
// 9. JEV ARM
// ─────────────────────────────────────────────────────────────────────────────

// jev resolves its own credential; this script reads and passes none, so a
// skipped arm writes no file.

/**
 * Identity line, then the pinned version and a credential check. A miss prints
 * a skip line and leaves the census text already written.
 *
 * @param {{out: (line: string) => void, env: Record<string, string|undefined>, timeoutMs: number}} ctx - Line writer, environment and per-call timeout.
 * @returns {{passed: boolean, path: string|null, provider: string, reason?: string}} True when the gate passed; a failed check carries the skip line it printed.
 */
function jevGate(ctx) {
  const provider = ctx.env.JEV_PROVIDER || 'official';
  const path = which('jev', ctx.env);
  ctx.out(`jev: path=${path ?? 'none'} provider=${provider}`);
  if (path === null) {
    const skipLine = 'jev arm skipped: jev not on PATH';
    ctx.out(skipLine);
    return { passed: false, path, provider, reason: skipLine };
  }

  const opts = {
    env: ctx.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: ctx.timeoutMs,
  };
  const version = spawnSync(path, ['--version'], opts);
  const trimmed = (version.stdout ?? '').trim();
  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
  if (found !== JEV_VERSION) {
    const skipLine = 'jev arm skipped: version';
    ctx.out(skipLine);
    ctx.out(`jev: found=${JSON.stringify(found)} path=${path}`);
    return { passed: false, path, provider, reason: skipLine };
  }

  const auth = spawnSync(path, ['auth', 'status', '--provider', provider], opts);
  if (auth.status !== 0) {
    const skipLine = 'jev arm skipped: no credential';
    ctx.out(skipLine);
    return { passed: false, path, provider, reason: skipLine };
  }
  return { passed: true, path, provider };
}

/**
 * One auth test, then JEV_RERUNS fresh `noul` calls per row, one calls.jsonl
 * record per spawn and no answer cache: every rerun is its own measurement.
 * Exit 4 gets one retry behind a backoff, because a dropped connection is not
 * a judgment. A stop prints the line and the rows that finished, and leaves
 * the column and verdict unprinted.
 *
 * @param {{rows: Array<{id: string, category: string, label: string, instruction: string, text: string}>, baselineFlags: Map<string, boolean>}} plan - The arm's rows and flag-nothing flags.
 * @param {{path: string, provider: string}} gate - A passing jevGate result.
 * @param {{out: (line: string) => void, env: Record<string, string|undefined>, timeoutMs: number, backoffMs: number, callLog: {append: (record: object) => void}, stored: object|null}} ctx - Line writer, environment, per-call timeout, retry backoff, the call log and an earlier run's report.
 * @returns {Promise<{stopped: string, partialRows: number}|{column: object, requalify: string|null}>} The stopped arm, or its column and requalify line.
 */
async function runJevArm(plan, gate, ctx) {
  let chars = 0;
  for (const row of plan.rows) chars += row.text.length + row.instruction.length;
  chars *= JEV_RERUNS;
  ctx.out(`jev: payload: windows of committed documents; planned calls: ${JEV_RERUNS * plan.rows.length + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);

  const probs = new Map();
  const calls = [];
  let finished = 0;

  const stop = (line) => {
    ctx.out(line);
    ctx.out(`jev: partial rows=${finished}`);
    return { stopped: line, partialRows: finished };
  };

  const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, ctx.timeoutMs);
  let model = 'unknown';
  if (auth.code === 0) {
    let parsed;
    try {
      parsed = JSON.parse(auth.stdout);
    } catch {
      // A body that does not parse leaves the model unknown.
    }
    if (typeof parsed?.model === 'string') model = parsed.model;
  }
  ctx.callLog.append({
    rowId: null,
    rerun: null,
    wallMs: auth.wallMs,
    exitCode: auth.code,
    backend: 'jev',
    probability: null,
    flag: null,
    status: auth.code === 0 ? 'measured' : 'unmeasured',
    jevVersion: JEV_VERSION,
    provider: gate.provider,
    model
  });
  if (auth.code !== 0) {
    if (auth.code === 3) return stop('jev arm stopped: key rejected');
    if (auth.code === 130) return stop('jev arm stopped: interrupted');
    return stop('jev arm stopped: auth test failed');
  }
  ctx.out(`jev: auth test provider=${gate.provider} model=${model}`);

  // A spawn that led to a stop or a retry carries no judgment, so its
  // probability, flag and status stay empty.
  const record = (row, rerun, r, probability, status) => ({
    rowId: row.id,
    rerun,
    wallMs: r.wallMs,
    exitCode: r.code,
    backend: 'jev',
    probability,
    flag: probability === null ? null : probability >= FLAG_AT,
    status,
    jevVersion: JEV_VERSION,
    provider: gate.provider,
    model
  });

  for (const row of plan.rows) {
    const callArgs = ['noul', '--provider', gate.provider, '-q', row.instruction];
    const list = [];
    for (let rerun = 0; rerun < JEV_RERUNS; rerun += 1) {
      let r = await spawnCall(gate.path, callArgs, row.text, ctx.env, ctx.timeoutMs);

      if (!r.timedOut && r.code === 4) {
        ctx.callLog.append(record(row, rerun, r, null, 'unmeasured'));
        await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
        r = await spawnCall(gate.path, callArgs, row.text, ctx.env, ctx.timeoutMs);
      }

      let probability = null;
      let status = 'unmeasured';
      let stopLine = null;
      if (r.timedOut) {
        status = 'unmeasured_timeout';
      } else if (r.code === 0) {
        let parsed;
        try {
          parsed = JSON.parse(r.stdout);
        } catch {
          // A body that does not parse is a missed measurement, not a crash.
        }
        const noul = parsed?.answers?.answer?.noul;
        if (Number.isFinite(noul) && noul >= 0 && noul <= 1) {
          probability = noul;
          status = 'measured';
        }
      } else if (r.code === 2) {
        stopLine = 'jev arm stopped: usage error';
      } else if (r.code === 3) {
        stopLine = 'jev arm stopped: key rejected';
      } else if (r.code === 130) {
        stopLine = 'jev arm stopped: interrupted';
      }

      ctx.callLog.append(record(row, rerun, r, probability, status));
      if (stopLine !== null) return stop(stopLine);
      list.push(probability);
      calls.push({ rowId: row.id, probability });
    }
    probs.set(row.id, list);
    finished += 1;
  }

  const suffix = `jev_version=${JEV_VERSION.split(' ')[1]} provider=${gate.provider} model=${model}`;
  const column = summarizeColumn('jev', plan.rows, probs, plan.baselineFlags, suffix);
  const brier = brierScore(calls, plan.rows);
  ctx.out(`brier jev: ${brier === null ? 'none' : brier.toFixed(4)}`);
  const storedJev = ctx.stored?.columns?.jev;
  let requalify = null;
  if (storedJev && (storedJev.provider !== gate.provider || storedJev.model !== model)) {
    requalify = 'requalify: model changed';
    ctx.out(requalify);
  }
  ctx.out(column.line);
  return {
    column: { ...column, brier, jevVersion: JEV_VERSION, provider: gate.provider, model },
    requalify
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. REPORT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The report.json body: the run's commit and census, the labels file and its
 * digest, the flag-nothing baseline and headroom, the fixed rules with their
 * digests, and one entry per arm that ran, stopped or was skipped. An arm
 * absent from the run stays out of every map.
 *
 * @param {{commit: string, census: object, labelsPath: string, labels: object[]|null, gate: {labeled: number}, summary: {right: number, defect: number, K: number}|null, headroom: string|null, jev: object|undefined}} input - The run's commit, census, labels, baseline, headroom and the arm result.
 * @returns {object} The report.json body.
 */
function buildReport({ commit, census, labelsPath, labels, gate, summary, headroom, jev }) {
  const report = {
    commit,
    census,
    labels: {
      path: labelsPath,
      sha256: sha256Hex(fs.readFileSync(labelsPath, 'utf8')),
      rows: Array.isArray(labels) ? labels.length : 0,
      labeled: gate.labeled
    },
    baseline: summary === null ? null : { right: summary.right, defect: summary.defect, K: summary.K },
    headroom,
    margin: MARGIN_LINE,
    keepRule: KEEP_RULE_LINE,
    instructions: {
      correctness: { sha256: sha256Hex(INSTRUCTION_CORRECTNESS) },
      traceability: { sha256: sha256Hex(INSTRUCTION_TRACEABILITY) }
    },
    columns: {},
    requalify: {},
    stopped: {},
    skipped: {}
  };
  for (const [backend, arm] of [['jev', jev]]) {
    if (arm === undefined) continue;
    if (typeof arm.skipped === 'string') {
      report.skipped[backend] = arm.skipped;
      continue;
    }
    if (typeof arm.stopped === 'string') {
      report.stopped[backend] = { line: arm.stopped, partialRows: arm.partialRows };
      continue;
    }
    if (arm.column === undefined) continue;
    report.columns[backend] = { ...arm.column };
    report.requalify[backend] = arm.requalify ?? null;
  }
  return report;
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the command line into flags.
 *
 * Value switches take exactly one argument and a non-integer seed is a bad
 * invocation. Cross-switch rules belong to the mode handlers, not here.
 *
 * @param {string[]} argv - Arguments after the script name.
 * @returns {{draw: boolean, seed: string|null, jev: boolean, out: string|null, labels: string|null}|{error: string}} The flags, or one error.
 */
function parseArgs(argv) {
  const flags = { draw: false, seed: null, jev: false, out: null, labels: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--draw') { flags.draw = true; continue; }
    if (arg === '--jev') { flags.jev = true; continue; }

    if (arg === '--seed' || arg === '--out' || arg === '--labels') {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('--')) return { error: `${arg} needs a value` };
      i += 1;
      if (arg === '--seed') {
        if (!/^[0-9]+$/.test(value)) return { error: `--seed must be a non-negative integer: ${value}` };
        flags.seed = value;
      } else if (arg === '--out') {
        flags.out = value;
      } else {
        flags.labels = value;
      }
      continue;
    }
    return { error: `unknown switch: ${arg}` };
  }
  return flags;
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. MAIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run one measurement pass and print its lines. The default pass is the
 * census only: zero backend calls and zero writes.
 *
 * @param {string[]} argv - Arguments after the script name.
 * @param {{repoRoot?: string, out?: (line: string) => void, err?: (line: string) => void, env?: Object, timeoutMs?: number, backoffMs?: number}} [deps] - Injection points for callers and tests.
 * @returns {Promise<0|2>} 0 when the report printed, 2 on a bad invocation.
 */
async function main(argv, deps = {}) {
  const repoRoot = deps.repoRoot ?? REPO_ROOT;
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`[score-residue-flagger] ${line}\n`));
  const env = deps.env ?? process.env;
  const timeoutMs = deps.timeoutMs ?? CALL_TIMEOUT_MS;
  const backoffMs = deps.backoffMs ?? BACKOFF_MS;
  const flags = parseArgs(argv);
  if ('error' in flags) {
    err(flags.error);
    return 2;
  }
  if (flags.draw) {
    if (flags.jev || flags.out !== null) {
      err('--draw takes only --seed and --labels');
      return 2;
    }
    if (flags.seed === null) {
      err('--draw needs --seed <n>');
      return 2;
    }
    const labelsPath = flags.labels ?? LABELS_PATH;
    try {
      if (holdsLabels(readJsonl(labelsPath))) {
        err(`draw refused: ${labelsPath} holds a label`);
        return 2;
      }
      const census = buildCensus(repoRoot, trackedFiles(repoRoot));
      const rows = drawRows(census, repoRoot, census.commit, Number(flags.seed));
      writeJsonl(labelsPath, rows);
      out(`draw: path=${labelsPath} seed=${flags.seed} commit=${census.commit.slice(0, 12)} rows=${ROWS_TOTAL} positives=${POSITIVES} negatives=${NEGATIVES}`);
      return 0;
    } catch (error) {
      err(error instanceof Error ? error.message : String(error));
      return 2;
    }
  }
  if (flags.jev && flags.out === null) {
    err('--jev needs --out <dir> so every call is recorded');
    return 2;
  }
  const tracked = trackedFiles(repoRoot);
  const census = buildCensus(repoRoot, tracked);
  for (const line of censusLines(census)) out(line);
  for (const line of ruleLines()) out(line);
  for (const line of instructionLines()) out(line);
  const labelsPath = flags.labels ?? LABELS_PATH;
  let labels;
  try {
    labels = readJsonl(labelsPath);
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }
  const gate = labelGate(labels);
  if (!gate.complete) out('stop: fewer than 100 labeled rows');
  const rows = labels ?? [];
  let summary = null;
  let headroom = null;
  if (gate.complete) {
    summary = {
      right: rows.filter((row) => row.label === 'clean').length,
      defect: rows.filter((row) => row.label === 'defect').length,
      K: gate.labeled
    };
    for (const line of baselineLines(summary)) out(line);
    headroom = headroomLine(summary);
    out(headroom);
  }
  const stored = flags.jev ? readStoredReport(flags.out) : null;
  const callLog = createCallLog(flags.out);
  let jev;
  if (flags.jev) {
    const check = jevGate({ out, env, timeoutMs });
    if (!check.passed) {
      jev = { skipped: check.reason };
    } else if (!gate.complete) {
      const line = 'jev arm skipped: fewer than 100 labeled rows';
      out(line);
      jev = { skipped: line };
    } else if (!headroom.startsWith('headroom:')) {
      const line = `jev arm skipped: ${headroom}`;
      out(line);
      jev = { skipped: line };
    } else {
      try {
        const plan = buildPlan(repoRoot, rows);
        jev = await runJevArm(plan, check, { out, env, timeoutMs, backoffMs, callLog, stored });
      } catch (error) {
        err(error instanceof Error ? error.message : String(error));
        return 2;
      }
    }
  }


  if (jev !== undefined && (jev.column !== undefined || jev.stopped !== undefined)) {
    const report = buildReport({ commit: census.commit, census, labelsPath, labels, gate, summary, headroom, jev });
    fs.mkdirSync(flags.out, { recursive: true });
    fs.writeFileSync(path.join(flags.out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  }
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  sha256Hex,
  git,
  trackedFiles,
  headCommit,
  readAtCommit,
  walkReviewFiles,
  parseFindingTables,
  addingCommit,
  reviewedCommit,
  resolveLocation,
  buildCensus,
  censusLines,
  mulberry32,
  drawRows,
  readJsonl,
  writeJsonl,
  holdsLabels,
  labelGate,
  baselineLines,
  headroomLine,
  ruleLines,
  instructionLines,
  signTestP,
  brierScore,
  decideVerdict,
  verdictText,
  verdictLine,
  which,

  jevGate,
  spawnCall,
  createCallLog,
  readStoredReport,

  runJevArm,
  buildReport,
  parseArgs,
  main
};

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
