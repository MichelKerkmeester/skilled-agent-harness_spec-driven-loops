#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: capture-reviewer-outputs                                      ║
// ║ unlabeled real reviewer-output capture                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Walk spec folders for real deep-review outputs, deduplicate them by content,
 * and write one unlabeled JSON line per distinct output together with the
 * verdict the deterministic extractor reads from it.
 *
 * The run spawns no process and makes no network or model call: its only job
 * is to grow a corpus of real outputs for later labeling. The label key is
 * deliberately absent from every row so the file stays a capture rather than
 * a judgment, and a later labeling pass can never mistake an unlabeled row for
 * a decided one.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { parseArgs } = require('node:util');

const { extractVerdict } = require('./reviewer-scorer.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The repository root, used to shorten reported paths.
const REPO_ROOT = path.resolve(__dirname, '../../../../../../..');
// The default corpus is every spec folder in the repository.
const DEFAULT_ROOT = path.join(REPO_ROOT, 'specs');
// Largest output read by default; a larger file is census noise, not signal.
const DEFAULT_MAX_BYTES = 65536;
// Directories that never hold deep-review output and can be arbitrarily large.
const SKIP_DIRS = new Set(['node_modules', '.git']);
// The usage line printed whenever the run cannot start.
const USAGE = 'usage: capture-reviewer-outputs.cjs [--root <dir>]... [--out <file>] [--max-bytes <n>]';

/**
 * Return the default label file under the home directory in force right now.
 *
 * The path is computed per call rather than stored at load time: a process may
 * redirect HOME after this module is required, and the capture must land in
 * the home that is active when main runs.
 *
 * @returns {string} Absolute path to the default JSONL label file.
 */
function defaultOut() {
  return path.join(os.homedir(), '.skilled', '.labels', '025-real-outputs.jsonl');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PATH CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Classify a path as a deep-review iteration, a review report, or neither.
 *
 * Deep-review iterations live under a folder carrying a literal `review`
 * segment and an `iterations` folder; those segment checks keep prompt
 * fixtures, research lineages and templates that reuse the same filenames out
 * of the corpus. Reports are recognized by filename alone because their name
 * is unique to deep review.
 *
 * @param {string} filePath - Path to classify, absolute or relative.
 * @returns {'iteration' | 'report' | null} The candidate kind, or null when
 *   the path is not deep-review output.
 */
function classifyPath(filePath) {
  const segments = String(filePath)
    .split('/')
    .flatMap((part) => part.split(path.sep))
    .filter((part) => part.length > 0);
  const name = segments.at(-1) || '';
  const parent = segments.at(-2) || '';
  if (/^review-report.*\.md$/.test(name)) return 'report';
  if (
    /^iteration-\d+\.md$/.test(name)
    && /(^|-)iterations(-|$)/.test(parent)
    && segments.slice(0, -2).some((segment) => segment === 'review')
  ) {
    return 'iteration';
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CANDIDATE DISCOVERY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Walk the roots and collect every deep-review candidate file.
 *
 * Only real directories are descended into and only regular files are kept, so
 * a symlink cannot pull the walk outside the corpus, loop it, or abort the run
 * on a dangling target; dependency caches and the git
 * store are skipped because they never hold review output. The result is
 * deduplicated by absolute path and sorted in code-unit order so the same tree
 * yields the same row order on every run.
 *
 * @param {string[]} roots - Directories to walk.
 * @returns {string[]} Absolute candidate file paths, sorted.
 */
function listCandidates(roots) {
  const found = new Set();
  const pending = roots.map((root) => path.resolve(root));
  while (pending.length > 0) {
    const dir = pending.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue; // an unreadable directory contributes no candidate
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) pending.push(full);
      } else if (entry.isFile() && classifyPath(full) !== null) {
        found.add(full);
      }
    }
  }
  return [...found].sort();
}

/**
 * Render a file path for display.
 *
 * Paths inside the repository are shortened and forced to `/` separators so a
 * capture reads the same on every platform; paths outside it stay absolute so
 * they still identify the file.
 *
 * @param {string} file - Absolute file path.
 * @returns {string} Repository-relative or absolute display path.
 */
function displayPath(file) {
  const relative = path.relative(REPO_ROOT, file);
  if (relative === '' || relative.startsWith('..') || path.isAbsolute(relative)) return file;
  return relative.split(path.sep).join('/');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ROW COLLECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read each candidate once and build the unlabeled rows plus the run census.
 *
 * Outputs are deduplicated by content hash, not by path: the same reviewer
 * output can be copied into a lineage and a phase folder, and counting it
 * twice would overstate the corpus. An oversize file is skipped unread so a
 * stray log cannot dominate the capture. Misses are tracked explicitly because
 * they are the reason the capture exists: they are what a model must later
 * judge.
 *
 * @param {string[]} files - Candidate paths, in sort order.
 * @param {number} maxBytes - Largest file size to read, in bytes.
 * @returns {{ rows: Array<object>, census: object }} Deduplicated rows and the
 *   census counters.
 */
function collectRows(files, maxBytes) {
  const rows = [];
  const byHash = new Map();
  const census = {
    files: files.length,
    rows: 0,
    duplicates: 0,
    oversize: 0,
    iterations: 0,
    reports: 0,
    hits: 0,
    misses: 0,
    hitVerdicts: { pass: 0, fail: 0, block: 0, abstain: 0 },
  };
  for (const file of files) {
    if (fs.statSync(file).size > maxBytes) {
      census.oversize += 1;
      continue;
    }
    const bytes = fs.readFileSync(file);
    const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
    const kept = byHash.get(sha256);
    if (kept) {
      census.duplicates += 1;
      kept.copies += 1;
      continue;
    }
    const output = bytes.toString('utf8');
    const { verdict, method } = extractVerdict(output);
    const kind = classifyPath(file);
    const row = {
      id: sha256.slice(0, 16),
      sha256,
      kind,
      source: displayPath(file),
      copies: 1,
      bytes: bytes.length,
      regexVerdict: verdict,
      regexMethod: method,
      output,
    };
    byHash.set(sha256, row);
    rows.push(row);
    if (kind === 'iteration') census.iterations += 1;
    else if (kind === 'report') census.reports += 1;
    if (verdict !== null) {
      census.hits += 1;
      census.hitVerdicts[verdict] += 1;
    }
  }
  census.rows = rows.length;
  census.misses = census.rows - census.hits;
  return { rows, census };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. OUTPUT WRITING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return the single census line printed after a capture.
 *
 * The format is fixed so two runs can be diffed by eye or by a test, and it
 * carries the counts that explain the file instead of leaving them to be
 * recomputed by hand.
 *
 * @param {object} census - Counters returned by collectRows.
 * @param {string} outFile - Path the rows were written to.
 * @returns {string} One-line census summary.
 */
function censusLine(census, outFile) {
  return `census: rows=${census.rows} regex_misses=${census.misses} regex_hits=${census.hits} (pass ${census.hitVerdicts.pass}, fail ${census.hitVerdicts.fail}, block ${census.hitVerdicts.block}, abstain ${census.hitVerdicts.abstain}) iterations=${census.iterations} reports=${census.reports} files=${census.files} duplicates=${census.duplicates} oversize=${census.oversize} out=${outFile}`;
}

/**
 * Write the rows atomically to the label file.
 *
 * The payload lands in a sibling temp file first and is renamed into place, so
 * an interrupted run can never leave a half-written corpus behind; the temp
 * file is removed when the rename fails. Both the directory and the file are
 * private because a capture is an operator-local working set.
 *
 * @param {string} outFile - Destination JSONL path.
 * @param {Array<object>} rows - Rows to serialize, one JSON object per line.
 * @returns {void}
 */
function writeRows(outFile, rows) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true, mode: 0o700 });
  const payload = rows.length > 0 ? `${rows.map((row) => JSON.stringify(row)).join('\n')}\n` : '';
  const tmpFile = `${outFile}.tmp-${process.pid}`;
  fs.writeFileSync(tmpFile, payload, { mode: 0o600 });
  try {
    fs.renameSync(tmpFile, outFile);
  } catch (error) {
    fs.rmSync(tmpFile, { force: true });
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the command line, capture the corpus, and print one census line.
 *
 * Validation happens before any write: a mistyped root or a bad size limit
 * must fail without touching the operator's previous capture. Every failure
 * path writes its reason to the error writer and returns a nonzero code so a
 * wrapper can branch on the result without parsing output.
 *
 * @param {string[]} argv - Arguments after the script name.
 * @param {{ out?: (line: string) => void, err?: (line: string) => void }} [deps]
 *   Line writers, defaulting to stdout and stderr.
 * @returns {number} Process exit code: 0 on success, 2 on a refused run.
 */
function main(argv, deps = {}) {
  const out = deps.out || ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err || ((line) => process.stderr.write(`[capture-reviewer-outputs] ${line}\n`));
  let values;
  try {
    ({ values } = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: false,
      options: {
        root: { type: 'string', multiple: true },
        out: { type: 'string' },
        'max-bytes': { type: 'string' },
      },
    }));
  } catch (error) {
    err(error.message);
    err(USAGE);
    return 2;
  }
  let maxBytes = DEFAULT_MAX_BYTES;
  if (values['max-bytes'] !== undefined) {
    if (!/^[1-9]\d*$/.test(values['max-bytes'])) {
      err('--max-bytes must be a positive integer');
      return 2;
    }
    maxBytes = Number(values['max-bytes']);
  }
  const rootArgs = values.root && values.root.length > 0 ? values.root : [DEFAULT_ROOT];
  const roots = rootArgs.map((root) => path.resolve(process.cwd(), root));
  for (const root of roots) {
    let isDirectory = false;
    try {
      isDirectory = fs.statSync(root).isDirectory();
    } catch {
      isDirectory = false;
    }
    if (!isDirectory) {
      err(`root not found: ${root}`);
      return 2;
    }
  }
  const outFile = path.resolve(process.cwd(), values.out === undefined ? defaultOut() : values.out);
  try {
    const files = listCandidates(roots);
    const captured = collectRows(files, maxBytes);
    writeRows(outFile, captured.rows);
    out(censusLine(captured.census, outFile));
  } catch (error) {
    err(error.message);
    return 2;
  }
  return 0;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = {
  classifyPath,
  listCandidates,
  displayPath,
  collectRows,
  censusLine,
  writeRows,
  main,
  REPO_ROOT,
  DEFAULT_ROOT,
  DEFAULT_MAX_BYTES,
  SKIP_DIRS,
  USAGE,
  // Late-bound so an accessor sees the home directory in force at read time.
  get DEFAULT_OUT() {
    return defaultOut();
  },
};
