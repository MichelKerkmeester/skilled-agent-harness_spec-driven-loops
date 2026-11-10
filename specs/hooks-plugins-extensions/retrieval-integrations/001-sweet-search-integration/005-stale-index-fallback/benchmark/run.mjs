#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Trigger Lookup Benchmark
// ───────────────────────────────────────────────────────────────────
// Records one labelled measurement of the trigger-index lookup so a change to
// its zero-hit behaviour can be diffed against the run taken before it. Each
// query row carries a class: `stale` phrases are declared only by spec docs the
// committed index does not list yet, `match` phrases the index already answers,
// and `none` phrases nobody declared.
//
// Every child is spawned from the repository root: the lookup resolves its
// artifact from the caller's working directory, so a run started elsewhere
// would measure a different index.
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
const LOOKUP = '.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs';
const PROMPT_SET = '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/prompt-set.json';
const INDEX = '.skilled/skills/system-spec-kit/runtime/data/trigger-index.json';
const QUERIES_PATH = path.join(SCRIPT_DIR, 'queries.txt');

/** Timed repeats per query row; the median absorbs a stray scheduler hiccup. */
const REPEATS = 5;

/** Passes over the fixture set; every case is timed once per pass. */
const ROUNDS = 5;

/** A cold lookup writes a short answer, but a lifted cap can grow it. */
const MAX_BUFFER = 32 * 1024 * 1024;

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * Runs one lookup and reports its wall-clock duration.
 *
 * @param {string[]} args Arguments after the script name.
 * @returns {{ ms: number, status: number, stderr: string, stdout: string }} Result and timing.
 */
function timed(args) {
  const started = process.hrtime.bigint();
  const result = spawnSync(process.execPath, [LOOKUP, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
  });
  const ms = Number(process.hrtime.bigint() - started) / 1e6;
  return {
    ms,
    status: result.status ?? -1,
    stderr: result.stderr ?? '',
    stdout: result.stdout ?? '',
  };
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
 * Nearest-rank percentile: the smallest value whose rank covers the cut.
 *
 * @param {number[]} sortedValues Ascending measurements.
 * @param {number} percentile Cut in [0, 100].
 * @returns {number | null} Selected value, or null when there is nothing to rank.
 */
function nearestRank(sortedValues, percentile) {
  if (sortedValues.length === 0) return null;
  const rank = Math.ceil((percentile / 100) * sortedValues.length);
  const index = Math.min(sortedValues.length, Math.max(1, rank)) - 1;
  return sortedValues[index];
}

/**
 * @param {number} value Raw milliseconds.
 * @returns {number} Milliseconds rounded for a stable diff.
 */
function round3(value) {
  return value === null ? null : Number(value.toFixed(3));
}

/** Query classes the table may use. */
const CLASSES = new Set(['stale', 'match', 'none']);

/**
 * Reads the query table, one `CLASS<TAB>QUERY` row per line.
 *
 * @returns {Array<{ queryClass: string, query: string }>} Parsed rows.
 */
function readQueries() {
  const lines = fs.readFileSync(QUERIES_PATH, 'utf8').split(/\r?\n/);
  const rows = [];
  for (const [index, line] of lines.entries()) {
    if (line.trim().length === 0) continue;
    const cut = line.indexOf('\t');
    if (cut === -1) throw new Error(`queries.txt line ${index + 1} is not CLASS<TAB>QUERY`);
    const queryClass = line.slice(0, cut).trim();
    const query = line.slice(cut + 1).trim();
    if (!CLASSES.has(queryClass)) throw new Error(`queries.txt line ${index + 1} has an unknown class`);
    if (query.length === 0) throw new Error(`queries.txt line ${index + 1} has an empty query`);
    rows.push({ queryClass, query });
  }
  return rows;
}

// ───────────────────────────────────────────────────────────────────
// 3. MEASUREMENT
// ───────────────────────────────────────────────────────────────────

/**
 * Times one query row and captures the answer it settles on. The JSON digest
 * drops `staleFallback`, so a matching query's answer can be compared across
 * runs on everything the index produced.
 *
 * @param {{ queryClass: string, query: string }} row Query under test.
 * @returns {Record<string, unknown>} One benchmark row.
 */
function measureRow({ queryClass, query }) {
  const timings = [];
  let last = null;
  for (let repeat = 0; repeat < REPEATS; repeat += 1) {
    last = timed(['--json', '--', query]);
    timings.push(last.ms);
  }

  let answer = {};
  try {
    answer = JSON.parse(last.stdout);
  } catch {
    answer = {};
  }
  const results = Array.isArray(answer.results) ? answer.results : [];
  const { staleFallback, ...indexAnswer } = answer;

  const human = timed(['--', query]);
  const fallbackLine = human.stdout
    .split(/\r?\n/)
    .find((line) => line.startsWith('fallback')) ?? null;

  return {
    queryClass,
    query,
    exit: last.status,
    resultCount: results.length,
    topPath: results.length > 0 ? results[0].path : null,
    staleFallback: staleFallback ?? null,
    fallbackLine,
    indexAnswerSha256: sha256(JSON.stringify(indexAnswer)),
    humanSha256: sha256(human.stdout),
    medianMs: round3(median(timings)),
  };
}

/**
 * Times every fixture case once per round, scoped as the fixture declares.
 *
 * @returns {{ cases: number, samples: number, p50Ms: number | null, p95Ms: number | null }} Distribution.
 */
function measurePromptSet() {
  const fixture = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, PROMPT_SET), 'utf8'));
  const cases = Array.isArray(fixture.cases) ? fixture.cases : [];

  const samples = [];
  for (let round = 0; round < ROUNDS; round += 1) {
    for (const item of cases) {
      const args = ['--json'];
      if (typeof item.specFolder === 'string' && item.specFolder.length > 0) {
        args.push('--spec-folder', item.specFolder);
      }
      args.push('--', item.query);
      samples.push(timed(args).ms);
    }
  }

  const sorted = [...samples].sort((a, b) => a - b);
  return {
    cases: cases.length,
    samples: samples.length,
    p50Ms: round3(nearestRank(sorted, 50)),
    p95Ms: round3(nearestRank(sorted, 95)),
  };
}

/**
 * Captures what the run was measured against, so two labels are comparable.
 *
 * @returns {{ indexSha256: string, gitStatusCount: number }} Artifact identity and tree churn.
 */
function readState() {
  const indexSha256 = sha256(fs.readFileSync(path.join(REPO_ROOT, INDEX)));
  const status = spawnSync('git', ['-c', 'core.fsmonitor=false', 'status', '--porcelain'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
  });
  const gitStatusCount = (status.stdout ?? '').split(/\r?\n/).filter((line) => line.length > 0).length;
  return { indexSha256, gitStatusCount };
}

// ───────────────────────────────────────────────────────────────────
// 4. CLI
// ───────────────────────────────────────────────────────────────────

/**
 * @returns {number} Process exit code.
 */
function main() {
  const label = process.argv[2];
  if (typeof label !== 'string' || label.length === 0) {
    process.stderr.write('usage: node run.mjs <label>\n');
    return 2;
  }
  if (!/^[A-Za-z0-9._-]+$/.test(label)) {
    process.stderr.write('label may only contain letters, digits, dot, dash and underscore\n');
    return 2;
  }

  const rows = readQueries().map((row) => {
    const measured = measureRow(row);
    process.stderr.write(`  ${row.queryClass.padEnd(5)}  exit ${measured.exit}  ${row.query}  ${measured.medianMs}ms\n`);
    return measured;
  });

  const promptSet = measurePromptSet();
  const state = readState();
  const record = { label, createdAt: new Date().toISOString(), state, rows, promptSet };

  const outPath = path.join(SCRIPT_DIR, `${label}.json`);
  fs.writeFileSync(outPath, `${JSON.stringify(record, null, 2)}\n`);
  process.stdout.write(`${path.relative(process.cwd(), outPath)}\n`);
  return 0;
}

process.exitCode = main();
