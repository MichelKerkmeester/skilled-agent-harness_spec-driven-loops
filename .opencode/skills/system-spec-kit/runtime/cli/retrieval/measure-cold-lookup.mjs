#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// SCRIPT: Cold Lookup Latency Measurement
// ───────────────────────────────────────────────────────────────
// Spawns one fresh Node process per sample and times it end to end, because
// the number that matters is what a caller waits for on a cold start — process
// startup, module load, artifact parse and the query, not the query alone. An
// in-process benchmark would report the one part of that which is already fast.
//
// The first samples are thrown out of the percentiles because the first reads
// of a freshly written artifact pay for a cold page cache. They are reported
// alongside the kept samples rather than deleted, so the discard is auditable
// instead of a way to quietly drop the worst readings.
//
// Usage:
//   node measure-cold-lookup.mjs [--index <path>] [--lookup <path>] [--manifest <path>]
//                                [--runs <n>] [--warmup <n>] [--out <path>] [--json] [--quiet]
//
// Exit codes: 0 = within budget, 1 = over budget, 2 = bad invocation.
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { publishJson } from './lib/artifact.mjs';

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(SCRIPT_DIR, '..', '..', '..');

export const DEFAULT_LOOKUP_PATH = path.join(SCRIPT_DIR, 'lookup-trigger-index.mjs');
export const DEFAULT_INDEX_PATH = path.join(SKILL_ROOT, 'runtime', 'data', 'trigger-index.json');
export const DEFAULT_MANIFEST_PATH = path.join(SCRIPT_DIR, 'fixtures', 'corpus-manifest.json');
export const DEFAULT_REPORT_PATH = path.join(SCRIPT_DIR, 'fixtures', 'latency-report.json');

/** Budget the artifact encoding has to stay inside, at both p95 and max. */
export const BUDGET_MS = 200;

/** Samples kept per run. Round-robin over the prompt set, so every prompt is measured equally. */
export const DEFAULT_MEASURED_RUNS = 36;

/** Samples taken before measurement starts, reported but excluded from the percentiles. */
export const DEFAULT_WARMUP_RUNS = 2;

/**
 * Short, realistic prompts rather than synthetic worst cases. The set is fixed
 * so two runs of this script are comparable; changing it invalidates the
 * comparison, which is why it lives here and not on the command line.
 */
export const PROMPTS = Object.freeze([
  'spec folder question',
  'skill routing gate',
  'memory save continuity',
  'deep research convergence loop',
  'worktree branch commit',
  'documentation quality validation',
]);

// ───────────────────────────────────────────────────────────────
// 2. MEASUREMENT
// ───────────────────────────────────────────────────────────────

/**
 * Times one cold lookup. The clock brackets the spawn, so process startup and
 * module resolution are inside the measurement exactly as a caller pays them.
 *
 * @param {string} lookupPath Absolute path to the lookup script.
 * @param {string} indexPath Absolute path to the artifact.
 * @param {string} prompt Prompt text.
 * @returns {{ durationMs: number, exitCode: number, resultCount: number }} One sample.
 */
export function measureOnce(lookupPath, indexPath, prompt) {
  const started = process.hrtime.bigint();
  const run = spawnSync(
    process.execPath,
    [lookupPath, prompt, '--index', indexPath, '--json'],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  );
  const durationMs = Number(process.hrtime.bigint() - started) / 1e6;

  if (run.error) throw run.error;

  // Exit 1 means the prompt matched nothing, which is a valid timing sample.
  // Anything else means the lookup could not answer, and timing a failure would
  // report a fast number for a broken artifact.
  if (run.status !== 0 && run.status !== 1) {
    throw new Error(`lookup exited ${String(run.status)} for "${prompt}": ${run.stderr.trim()}`);
  }

  let resultCount = 0;
  try {
    resultCount = JSON.parse(run.stdout).results.length;
  } catch {
    throw new Error(`lookup did not emit parseable JSON for "${prompt}"`);
  }

  return { durationMs, exitCode: run.status, resultCount };
}

/**
 * Nearest-rank percentile over an ascending sample list: the smallest sample at
 * or above the requested share of the distribution. No interpolation, so every
 * reported number is a reading that actually happened.
 *
 * @param {number[]} ascending Sorted samples.
 * @param {number} fraction Share between 0 and 1.
 * @returns {number} The selected sample, or 0 when there are none.
 */
export function percentile(ascending, fraction) {
  if (ascending.length === 0) return 0;
  const rank = Math.ceil(fraction * ascending.length);
  return ascending[Math.min(Math.max(rank, 1), ascending.length) - 1];
}

/**
 * Total bytes of the documents the manifest says were indexed. Read from the
 * manifest rather than re-walked, so the figure describes the same snapshot the
 * artifact was built from.
 *
 * @param {string} manifestPath Absolute manifest path.
 * @param {string} repoRoot Absolute repository root.
 * @returns {{ corpusBytes: number, missingPaths: number }} Corpus size and any paths gone since.
 */
export function measureCorpusBytes(manifestPath, repoRoot) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const included = Array.isArray(manifest.includedPaths) ? manifest.includedPaths : [];

  let corpusBytes = 0;
  let missingPaths = 0;
  for (const relativePath of included) {
    try {
      corpusBytes += fs.statSync(path.join(repoRoot, relativePath)).size;
    } catch {
      missingPaths += 1;
    }
  }
  return { corpusBytes, missingPaths };
}

/**
 * Runs the whole measurement and assembles the report without writing it.
 *
 * @param {{
 *   lookupPath?: string,
 *   indexPath?: string,
 *   manifestPath?: string,
 *   repoRoot?: string,
 *   measuredRuns?: number,
 *   warmupRuns?: number
 * }} [options] Measurement inputs.
 * @returns {Record<string, any>} The latency report.
 */
export function measure(options = {}) {
  const lookupPath = path.resolve(options.lookupPath ?? DEFAULT_LOOKUP_PATH);
  const indexPath = path.resolve(options.indexPath ?? DEFAULT_INDEX_PATH);
  const manifestPath = path.resolve(options.manifestPath ?? DEFAULT_MANIFEST_PATH);
  const repoRoot = path.resolve(options.repoRoot ?? path.resolve(SKILL_ROOT, '..', '..', '..'));
  const measuredRuns = options.measuredRuns ?? DEFAULT_MEASURED_RUNS;
  const warmupRuns = options.warmupRuns ?? DEFAULT_WARMUP_RUNS;

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const indexBytes = fs.statSync(indexPath).size;
  const { corpusBytes, missingPaths } = measureCorpusBytes(manifestPath, repoRoot);

  /** @type {Array<{ durationMs: number, prompt: string }>} */
  const warmup = [];
  for (let i = 0; i < warmupRuns; i += 1) {
    const prompt = PROMPTS[i % PROMPTS.length];
    warmup.push({ durationMs: measureOnce(lookupPath, indexPath, prompt).durationMs, prompt });
  }

  /** @type {Map<string, { durationsMs: number[], resultCount: number }>} */
  const byPrompt = new Map(PROMPTS.map((prompt) => [prompt, { durationsMs: [], resultCount: 0 }]));
  /** @type {number[]} */
  const durations = [];
  for (let i = 0; i < measuredRuns; i += 1) {
    const prompt = PROMPTS[i % PROMPTS.length];
    const sample = measureOnce(lookupPath, indexPath, prompt);
    const bucket = byPrompt.get(prompt);
    bucket.durationsMs.push(round(sample.durationMs));
    bucket.resultCount = sample.resultCount;
    durations.push(sample.durationMs);
  }

  const ascending = durations.slice().sort((a, b) => a - b);
  const p95 = percentile(ascending, 0.95);
  const max = ascending[ascending.length - 1];

  return {
    budgetMs: BUDGET_MS,
    corpusBytes,
    // A path in the manifest that no longer exists means the corpus moved under
    // the artifact, so the corpus figure understates what was indexed.
    corpusPathsMissing: missingPaths,
    indexBytes,
    indexPath,
    lookupPath,
    manifestHash: typeof index.manifestHash === 'string' ? index.manifestHash : '',
    measuredRuns,
    percentileMethod: 'nearest-rank, no interpolation',
    perPrompt: Object.fromEntries(
      Array.from(byPrompt, ([prompt, bucket]) => [prompt, {
        durationsMs: bucket.durationsMs,
        maxMs: round(Math.max(...bucket.durationsMs)),
        medianMs: round(percentile(bucket.durationsMs.slice().sort((a, b) => a - b), 0.5)),
        resultCount: bucket.resultCount,
      }]),
    ),
    platform: { arch: process.arch, nodeVersion: process.version, platform: process.platform },
    schemaVersion: typeof index.schemaVersion === 'number' ? index.schemaVersion : 0,
    summary: {
      maxMs: round(max),
      minMs: round(ascending[0]),
      p50Ms: round(percentile(ascending, 0.5)),
      p95Ms: round(p95),
      p99Ms: round(percentile(ascending, 0.99)),
    },
    warmup: {
      // Excluded from the percentiles above; kept so the exclusion is visible.
      durationsMs: warmup.map((sample) => round(sample.durationMs)),
      prompts: warmup.map((sample) => sample.prompt),
      runs: warmupRuns,
    },
    withinBudget: p95 < BUDGET_MS && max < BUDGET_MS,
  };
}

/**
 * @param {number} value Milliseconds.
 * @returns {number} Value rounded to three decimals.
 */
function round(value) {
  return Math.round(value * 1000) / 1000;
}

// ───────────────────────────────────────────────────────────────
// 3. CLI
// ───────────────────────────────────────────────────────────────

/**
 * @param {string[]} argv Arguments after the script name.
 * @returns {Record<string, string | boolean>} Parsed flags.
 */
function parseArgs(argv) {
  /** @type {Record<string, string | boolean>} */
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case '--json':
      case '--quiet':
        flags[arg.slice(2)] = true;
        break;
      case '--index':
      case '--lookup':
      case '--manifest':
      case '--out':
      case '--repo-root':
      case '--runs':
      case '--warmup': {
        const value = argv[i + 1];
        if (value === undefined || value.startsWith('--')) throw new Error(`${arg} requires a value`);
        flags[arg.slice(2)] = value;
        i += 1;
        break;
      }
      default:
        throw new Error(`unknown argument: ${arg}`);
    }
  }
  return flags;
}

/**
 * @param {string | boolean | undefined} value Raw flag value.
 * @param {string} name Flag name for the error message.
 * @returns {number | undefined} Parsed count.
 */
function parseCount(value, name) {
  if (typeof value !== 'string') return undefined;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${name} requires a non-negative integer`);
  return parsed;
}

/**
 * @param {Record<string, any>} report Latency report.
 * @returns {string} Human-readable summary.
 */
function formatReport(report) {
  const lines = [
    report.withinBudget
      ? `cold lookup within budget (< ${report.budgetMs} ms at p95 and max)`
      : `cold lookup OVER budget (>= ${report.budgetMs} ms at p95 or max)`,
    `  schema version : ${report.schemaVersion}`,
    `  index bytes    : ${report.indexBytes}`,
    `  corpus bytes   : ${report.corpusBytes}`,
    `  manifest hash  : ${report.manifestHash || '(none)'}`,
    `  node / platform: ${report.platform.nodeVersion} ${report.platform.platform}/${report.platform.arch}`,
    `  measured runs  : ${report.measuredRuns} (after ${report.warmup.runs} warm-up)`,
    `  warm-up ms     : ${report.warmup.durationsMs.join(', ') || '(none)'}`,
    `  p50 / p95 / p99: ${report.summary.p50Ms} / ${report.summary.p95Ms} / ${report.summary.p99Ms} ms`,
    `  min / max      : ${report.summary.minMs} / ${report.summary.maxMs} ms`,
    '  per prompt (median ms, results):',
  ];
  for (const [prompt, bucket] of Object.entries(report.perPrompt)) {
    lines.push(`    ${String(bucket.medianMs).padStart(8)}  ${String(bucket.resultCount).padStart(3)}  ${prompt}`);
  }
  return `${lines.join('\n')}\n`;
}

/**
 * @returns {number} Process exit code.
 */
function main() {
  let flags;
  let report;
  try {
    flags = parseArgs(process.argv.slice(2));
    report = measure({
      indexPath: typeof flags.index === 'string' ? flags.index : undefined,
      lookupPath: typeof flags.lookup === 'string' ? flags.lookup : undefined,
      manifestPath: typeof flags.manifest === 'string' ? flags.manifest : undefined,
      measuredRuns: parseCount(flags.runs, '--runs'),
      repoRoot: typeof flags['repo-root'] === 'string' ? flags['repo-root'] : undefined,
      warmupRuns: parseCount(flags.warmup, '--warmup'),
    });
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 2;
  }

  const reportPath = typeof flags.out === 'string' ? flags.out : DEFAULT_REPORT_PATH;
  publishJson(reportPath, report);

  if (flags.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else if (!flags.quiet) {
    process.stdout.write(formatReport(report));
    process.stdout.write(`  report written to ${reportPath}\n`);
  }

  return report.withinBudget ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main();
}
