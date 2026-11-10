#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Ripgrep Wrapper Benchmark
// ───────────────────────────────────────────────────────────────────
// Records one labelled measurement of the ripgrep wrapper's structured
// recipe, so a change to how it shapes results can be diffed against the run
// taken before it.
//
// "Shown rows" are what a reader sees: before shaping the JSON carried every
// match and only the human view stopped at 20 rows, so the first 20 rows stand
// for the shown set; after shaping the JSON results are the shown set.
//
// Every child runs from the repository root, because search roots are
// repo-relative.
//
// Usage:
//   node run.mjs <label>
//
// Writes <label>.json beside this script.
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..', '..', '..', '..');
const WRAPPER = '.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs';
const INDEX = '.skilled/skills/system-spec-kit/runtime/data/trigger-index.json';
const QUERIES_PATH = path.join(SCRIPT_DIR, 'queries.txt');

/** Timed repeats per query; the median absorbs a stray scheduler hiccup. */
const REPEATS = 5;

/** The human view's row cap before shaping existed. */
const DISPLAY_CAP = 20;

/** A flooded structured answer can be large. */
const MAX_BUFFER = 256 * 1024 * 1024;

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * Runs the wrapper once and reports its wall-clock duration.
 *
 * @param {string[]} args Arguments after the script name.
 * @returns {{ ms: number, status: number, stdout: string }} Result and timing.
 */
function timed(args) {
  const started = process.hrtime.bigint();
  const result = spawnSync(process.execPath, [WRAPPER, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
  });
  const ms = Number(process.hrtime.bigint() - started) / 1e6;
  return { ms, status: result.status ?? -1, stdout: result.stdout ?? '' };
}

/**
 * @param {Buffer | string} value Bytes or text to digest.
 * @returns {string} Lowercase hex SHA-256.
 */
function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * @param {number[]} values Measurements.
 * @returns {number} Middle value, or the mean of the two middles.
 */
function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Reads the query table, one `PHRASE<TAB>SEARCH_ROOT` row per line.
 *
 * @returns {Array<{ phrase: string, root: string }>} Parsed rows.
 */
function readQueries() {
  const rows = [];
  for (const [index, line] of fs.readFileSync(QUERIES_PATH, 'utf8').split(/\r?\n/).entries()) {
    if (line.trim().length === 0) continue;
    const cut = line.indexOf('\t');
    if (cut === -1) throw new Error(`queries.txt line ${index + 1} is not PHRASE<TAB>SEARCH_ROOT`);
    rows.push({ phrase: line.slice(0, cut).trim(), root: line.slice(cut + 1).trim() });
  }
  return rows;
}

// ───────────────────────────────────────────────────────────────────
// 3. MEASUREMENT
// ───────────────────────────────────────────────────────────────────

/**
 * Times one query and summarises what a reader of its answer would see.
 *
 * @param {{ phrase: string, root: string }} row Query under test.
 * @returns {Record<string, unknown>} One benchmark row.
 */
function measureRow({ phrase, root }) {
  const args = ['structured', phrase, '--search-root', root, '--json'];
  const timings = [];
  let last = null;
  for (let repeat = 0; repeat < REPEATS; repeat += 1) {
    last = timed(args);
    timings.push(last.ms);
  }

  let record = {};
  try {
    record = JSON.parse(last.stdout);
  } catch {
    record = {};
  }
  const results = Array.isArray(record.results) ? record.results : [];
  const shaped = typeof record.matchCount === 'number';
  const shown = shaped ? results : results.slice(0, DISPLAY_CAP);

  const perFile = new Map();
  for (const result of shown) perFile.set(result.path, (perFile.get(result.path) ?? 0) + 1);
  const matchCount = shaped ? record.matchCount : results.length;

  // What the answer itself says it left out; zero when it says nothing.
  const reportedHidden = shaped
    ? shown.reduce((sum, result) => sum + (result.moreInFile ?? 0), 0) + (record.hidden?.matches ?? 0)
    : 0;

  return {
    phrase,
    root,
    exit: last.status,
    schemaVersion: record.schemaVersion ?? null,
    matchCount,
    fileCount: shaped ? record.fileCount : new Set(results.map((result) => result.path)).size,
    shownRows: shown.length,
    shownDistinctFiles: perFile.size,
    maxShownRowsPerFile: Math.max(0, ...perFile.values()),
    hiddenMatches: matchCount - shown.length,
    reportedHidden,
    hidden: record.hidden ?? null,
    truncated: record.truncated ?? null,
    medianMs: Number(median(timings).toFixed(3)),
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. CLI
// ───────────────────────────────────────────────────────────────────

/**
 * @returns {number} Process exit code.
 */
function main() {
  const label = process.argv[2];
  if (typeof label !== 'string' || !/^[A-Za-z0-9._-]+$/.test(label)) {
    process.stderr.write('usage: node run.mjs <label>\n');
    return 2;
  }

  const rows = readQueries().map((row) => {
    const measured = measureRow(row);
    process.stderr.write(`  ${row.phrase} @ ${path.basename(path.dirname(row.root))}/${path.basename(row.root)}  files ${measured.shownDistinctFiles}  max ${measured.maxShownRowsPerFile}  ${measured.medianMs}ms\n`);
    return measured;
  });
  // The status count is a record only: the after run happens with the build
  // uncommitted, so it cannot match the before run by design.
  const status = spawnSync('git', ['-c', 'core.fsmonitor=false', 'status', '--porcelain'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
  });
  const state = {
    gitStatusCount: (status.stdout ?? '').split(/\r?\n/).filter((line) => line.length > 0).length,
    indexSha256: sha256(fs.readFileSync(path.join(REPO_ROOT, INDEX))),
  };
  const record = { label, createdAt: new Date().toISOString(), state, rows };

  const outPath = path.join(SCRIPT_DIR, `${label}.json`);
  fs.writeFileSync(outPath, `${JSON.stringify(record, null, 2)}\n`);
  process.stdout.write(`${path.relative(process.cwd(), outPath)}\n`);
  return 0;
}

process.exitCode = main();
