#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// SCRIPT: Memory Residue Sweep
// ───────────────────────────────────────────────────────────────
// Answers one question with an exit code: does any live consumer of the
// retired memory MCP surface still exist outside its own subsystem tree?
//
// Three decisions are load-bearing and each was made because the naive version
// lies:
//
// 1. `--no-ignore-global` and `--hidden`. The default ignore behavior hides
//    root `opencode.json` and `.utcp_config.json`, and the runtime configs live
//    under dot-directories, so a sweep that trusts the defaults under-reports
//    exactly the registrations that matter most.
// 2. JSONL parsing rather than line splitting. A path containing a colon splits
//    wrongly under ripgrep's line format, silently corrupting the path of every
//    hit it touches.
// 3. Streaming rather than buffering. The full term set emits well over a
//    hundred megabytes of JSONL, which is past the point where a single
//    captured string is safe.
//
// Exemptions are data, not code: every deliberate survivor is a row in the
// allowlist file with a written reason, so a reviewer can audit the whole
// exemption set without reading this script.
//
// Usage:
//   node sweep-memory-residue.mjs [--root <path>] [--allowlist <path>]
//                                 [--report <path>] [--json]
//
// Exit codes: 0 = no live hits, 1 = live hits remain, 2 = ripgrep or invocation error.
// ───────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

import { publishJson, stableStringify } from './lib/artifact.mjs';
import { compareCodeUnits } from './lib/normalize.mjs';
import { formatCommand, parseJsonLines, resolveRipgrep, ripgrepVersion } from './lib/rg-lane.mjs';

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

export const DEFAULT_ALLOWLIST_PATH = path.resolve(SCRIPT_DIR, 'fixtures', 'residue-allowlist.json');

/** Report schema; bump when a consumer would have to change to read it. */
export const SCHEMA_VERSION = 1;

/** Exit codes. */
export const EXIT_CLEAN = 0;
export const EXIT_LIVE_HITS = 1;
export const EXIT_ERROR = 2;

/**
 * The tools the retiring server exposes. Matched as whole tokens so that
 * `memory_index_scan` never absorbs the count of `memory_index_scan_status`.
 */
export const TOOL_NAMES = Object.freeze([
  'checkpoint_create',
  'checkpoint_delete',
  'checkpoint_list',
  'checkpoint_restore',
  'embedder_list',
  'embedder_set',
  'embedder_status',
  'eval_reporting_dashboard',
  'eval_run_ablation',
  'memory_bulk_delete',
  'memory_causal_link',
  'memory_causal_stats',
  'memory_causal_unlink',
  'memory_context',
  'memory_delete',
  'memory_drift_why',
  'memory_embedding_reconcile',
  'memory_get_learning_history',
  'memory_health',
  'memory_index_scan',
  'memory_index_scan_cancel',
  'memory_index_scan_status',
  'memory_ingest_cancel',
  'memory_ingest_start',
  'memory_ingest_status',
  'memory_learned_clear',
  'memory_learned_expire',
  'memory_list',
  'memory_match_triggers',
  'memory_quick_search',
  'memory_retention_sweep',
  'memory_save',
  'memory_search',
  'memory_stats',
  'memory_update',
  'memory_validate',
  'session_bootstrap',
  'session_health',
  'session_resume',
  'task_postflight',
  'task_preflight',
]);

/**
 * Substring terms. These are deliberately not word-bounded: the tool-call
 * prefix is always followed by a further word character, and the launcher and
 * shim names appear inside longer filenames.
 */
export const LITERAL_TERMS = Object.freeze([
  '.system-spec-memory-launcher',
  'mcp__system_spec_memory__',
  'spec-memory.cjs',
  'system-spec-memory',
]);

/** Trees that carry no live instruction, plus the subsystem tree being retired. */
export const EXCLUDE_GLOBS = Object.freeze([
  '!.git/**',
  '!**/node_modules/**',
  '!**/z_archive/**',
  '!**/research/lineages/**',
  '!**/scratch/**',
  '!.worktrees/**',
  '!.opencode/skills/system-spec-kit/mcp-server/**',
]);

/**
 * Directory names whose contents are recorded evidence rather than live
 * instruction. The rule is structural and conservative on purpose: it is a
 * triage label, not a claim that every file beneath one is semantically inert.
 */
export const HISTORICAL_SEGMENTS = Object.freeze([
  'archive',
  'deltas',
  'fixtures',
  'reports',
  'research',
  'reviews',
  'runs',
  'snapshots',
]);

/** Reported surface types, in the order the summary prints them. */
export const SURFACE_TYPES = Object.freeze([
  'agents',
  'commands',
  'skills',
  'hooks',
  'plugins',
  'bin',
  'config',
  'env',
  'code',
  'docs',
  'tests',
  'other',
]);

const CODE_EXTENSIONS = new Set(['.bash', '.cjs', '.cts', '.js', '.mjs', '.mts', '.py', '.rs', '.sh', '.ts', '.tsx']);
const CONFIG_EXTENSIONS = new Set(['.json', '.jsonc', '.toml', '.yaml', '.yml']);
const DOC_EXTENSIONS = new Set(['.md', '.mdx', '.txt']);
const TEST_FILE = /\.(?:vitest|test|spec)\.[cm]?[jt]sx?$/;

/** Term recorded when ripgrep matched a line no attribution rule can explain. */
export const UNATTRIBUTED_TERM = 'unattributed';

/** Live paths listed in the report, longest first. */
const TOP_LIVE_PATH_LIMIT = 20;

// ───────────────────────────────────────────────────────────────
// 2. TERM MATCHING
// ───────────────────────────────────────────────────────────────

/**
 * @param {string} value Literal text.
 * @returns {string} Regular-expression-safe rendering.
 */
export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Every term gets its own stateless matcher. Attributing with one combined
 * alternation would report only the leftmost term on a line that names several.
 */
const TERM_MATCHERS = Object.freeze([
  ...LITERAL_TERMS.map((term) => ({ regex: new RegExp(escapeRegExp(term), 'i'), term })),
  ...TOOL_NAMES.map((term) => ({ regex: new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i'), term })),
]);

/**
 * @param {string} lineText Matched line.
 * @returns {string[]} Every term the line names, in declaration order.
 */
export function attributeTerms(lineText) {
  const terms = TERM_MATCHERS.filter((matcher) => matcher.regex.test(lineText)).map((matcher) => matcher.term);
  return terms.length > 0 ? terms : [UNATTRIBUTED_TERM];
}

/**
 * @returns {string[]} Ripgrep arguments for the sweep.
 */
export function buildArgv() {
  const argv = ['--no-config', '--json', '--ignore-case', '--no-ignore-global', '--hidden'];
  for (const term of LITERAL_TERMS) argv.push('-e', escapeRegExp(term));
  argv.push('-e', `\\b(?:${TOOL_NAMES.map(escapeRegExp).join('|')})\\b`);
  for (const glob of EXCLUDE_GLOBS) argv.push('--glob', glob);
  argv.push('--', '.');
  return argv;
}

// ───────────────────────────────────────────────────────────────
// 3. CLASSIFICATION
// ───────────────────────────────────────────────────────────────

/**
 * @param {string} relativePath Repo-relative POSIX path.
 * @returns {'historical' | 'live'} Lifecycle label.
 */
export function classifyLifecycle(relativePath) {
  if (relativePath.toLowerCase().endsWith('.jsonl')) return 'historical';
  const segments = relativePath.split('/').slice(0, -1);
  return segments.some((segment) => HISTORICAL_SEGMENTS.includes(segment)) ? 'historical' : 'live';
}

/**
 * Assigns the surface a live hit has to be routed to. Rules are ordered, first
 * match wins, and the specific runtime surfaces are tested before the generic
 * extension buckets so a test file under a skill reports as a test.
 *
 * @param {string} relativePath Repo-relative POSIX path.
 * @returns {string} One of SURFACE_TYPES.
 */
export function classifySurface(relativePath) {
  const segments = relativePath.split('/');
  const basename = segments[segments.length - 1];
  const directories = segments.slice(0, -1);
  const extension = path.extname(basename).toLowerCase();
  const has = (name) => directories.includes(name);

  if (basename === '.env' || basename.startsWith('.env.') || basename === 'ENV-REFERENCE.md') return 'env';
  if (has('tests') || has('test') || has('__tests__') || TEST_FILE.test(basename)) return 'tests';
  if (has('hooks') || basename.toLowerCase().includes('hook')) return 'hooks';
  if (has('plugins')) return 'plugins';
  if (has('bin')) return 'bin';
  if (has('agents')) return 'agents';
  if (has('commands')) return 'commands';
  if (CONFIG_EXTENSIONS.has(extension) && segments[0] !== '.opencode' && segments[0] !== 'specs') return 'config';
  if (CODE_EXTENSIONS.has(extension)) return 'code';
  if (segments[0] === '.opencode' && segments[1] === 'skills') return 'skills';
  if (DOC_EXTENSIONS.has(extension)) return 'docs';
  return 'other';
}

/**
 * @param {string} pattern Glob with `*`, `**` and `?`.
 * @returns {RegExp} Anchored matcher over a repo-relative path.
 */
export function globToRegExp(pattern) {
  let source = '';
  for (let i = 0; i < pattern.length; i += 1) {
    const character = pattern[i];
    if (character === '*') {
      if (pattern[i + 1] === '*') {
        const consumesSeparator = pattern[i + 2] === '/';
        source += consumesSeparator ? '(?:.*/)?' : '.*';
        i += consumesSeparator ? 2 : 1;
        continue;
      }
      source += '[^/]*';
      continue;
    }
    if (character === '?') {
      source += '[^/]';
      continue;
    }
    source += escapeRegExp(character);
  }
  return new RegExp(`^${source}$`);
}

/**
 * @param {string} relativePath Repo-relative POSIX path.
 * @param {Array<{ pathPrefixOrGlob: string, reason: string, regex?: RegExp }>} entries Allowlist.
 * @returns {{ pathPrefixOrGlob: string, reason: string } | null} First matching entry.
 */
export function matchAllowlist(relativePath, entries) {
  for (const entry of entries) {
    if (entry.regex) {
      if (entry.regex.test(relativePath)) return entry;
      continue;
    }
    if (relativePath.startsWith(entry.pathPrefixOrGlob)) return entry;
  }
  return null;
}

/**
 * Reads the exemption set. A malformed file throws rather than degrading to an
 * empty allowlist, because a silently dropped exemption reads as new residue
 * and a silently dropped rule reads as a clean sweep.
 *
 * @param {string} allowlistPath Absolute or cwd-relative path.
 * @returns {Array<{ pathPrefixOrGlob: string, reason: string, regex?: RegExp }>} Compiled entries.
 */
export function loadAllowlist(allowlistPath) {
  const parsed = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
  const entries = parsed?.entries;
  if (!Array.isArray(entries)) throw new Error(`allowlist has no entries array: ${allowlistPath}`);

  return entries.map((entry, index) => {
    const pattern = entry?.pathPrefixOrGlob;
    const reason = entry?.reason;
    if (typeof pattern !== 'string' || pattern.length === 0) {
      throw new Error(`allowlist entry ${index} has no pathPrefixOrGlob: ${allowlistPath}`);
    }
    if (typeof reason !== 'string' || reason.length === 0) {
      throw new Error(`allowlist entry ${index} has no reason: ${allowlistPath}`);
    }
    return pattern.includes('*') || pattern.includes('?')
      ? { pathPrefixOrGlob: pattern, reason, regex: globToRegExp(pattern) }
      : { pathPrefixOrGlob: pattern, reason };
  });
}

// ───────────────────────────────────────────────────────────────
// 4. EXECUTION
// ───────────────────────────────────────────────────────────────

/**
 * Streams one ripgrep run and hands every match record to the caller. Output is
 * consumed line by line because the full term set emits far more JSONL than is
 * safe to hold as a single captured string.
 *
 * @param {string} root Absolute search root.
 * @param {(match: { line: number, path: string, text: string }) => void} onMatch Match sink.
 * @returns {Promise<{ command: string, exitCode: number, stderr: string, unparsedLines: number }>} Run record.
 */
async function streamRipgrep(root, onMatch) {
  const argv = buildArgv();
  const command = formatCommand(argv);
  const child = spawn(resolveRipgrep(), argv, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });

  let stderr = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (chunk) => {
    if (stderr.length < 64_000) stderr += chunk;
  });

  let unparsedLines = 0;
  const reader = readline.createInterface({ crlfDelay: Infinity, input: child.stdout });
  reader.on('line', (line) => {
    const parsed = parseJsonLines(line);
    unparsedLines += parsed.unparsedLines;
    for (const match of parsed.matches) onMatch(match);
  });

  const drained = new Promise((resolve) => reader.once('close', resolve));
  const exitCode = await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code) => resolve(code ?? EXIT_ERROR));
  });
  await drained;

  return { command, exitCode, stderr, unparsedLines };
}

/**
 * Runs the sweep and builds the report.
 *
 * @param {{ allowlistPath?: string, root?: string }} [options] Sweep options.
 * @returns {Promise<Record<string, any>>} Report.
 */
export async function sweep(options = {}) {
  const root = path.resolve(options.root ?? process.cwd());
  if (!fs.existsSync(path.join(root, '.opencode'))) {
    throw new Error(`root does not look like the repository root (no .opencode): ${root}`);
  }

  const allowlistPath = path.resolve(options.allowlistPath ?? DEFAULT_ALLOWLIST_PATH);
  const allowlist = loadAllowlist(allowlistPath);

  /** @type {Array<Record<string, any>>} */
  const records = [];
  const counts = { allowlisted: 0, historical: 0, live: 0 };
  const paths = new Set();
  const livePaths = new Set();
  const liveBySurface = Object.fromEntries(SURFACE_TYPES.map((surface) => [surface, 0]));
  const liveRecordsByPath = new Map();
  let hitLines = 0;

  const run = await streamRipgrep(root, (match) => {
    const relativePath = match.path.replace(/^\.\//, '');
    hitLines += 1;
    paths.add(relativePath);

    const exemption = matchAllowlist(relativePath, allowlist);
    const lifecycle = classifyLifecycle(relativePath);
    const klass = exemption ? 'allowlisted' : lifecycle;
    const surfaceType = classifySurface(relativePath);

    for (const term of attributeTerms(match.text)) {
      records.push({
        allowlistReason: exemption ? exemption.reason : null,
        class: klass,
        line: match.line,
        path: relativePath,
        surfaceType,
        term,
      });
      counts[klass] += 1;
      if (klass === 'live') {
        liveBySurface[surfaceType] += 1;
        livePaths.add(relativePath);
        liveRecordsByPath.set(relativePath, (liveRecordsByPath.get(relativePath) ?? 0) + 1);
      }
    }
  });

  if (run.exitCode >= EXIT_ERROR) {
    const detail = run.stderr.trim() || `ripgrep exited ${run.exitCode}`;
    throw new Error(`ripgrep failed: ${detail}`);
  }

  records.sort((a, b) => compareCodeUnits(a.path, b.path)
    || (a.line - b.line)
    || compareCodeUnits(a.term, b.term));

  const topLivePaths = [...liveRecordsByPath.entries()]
    .sort((a, b) => (b[1] - a[1]) || compareCodeUnits(a[0], b[0]))
    .slice(0, TOP_LIVE_PATH_LIMIT)
    .map(([livePath, recordCount]) => ({ path: livePath, records: recordCount }));

  return {
    allowlistPath,
    counts: {
      ...counts,
      hitLines,
      livePaths: livePaths.size,
      paths: paths.size,
      records: records.length,
    },
    excludeGlobs: [...EXCLUDE_GLOBS],
    generatedFrom: {
      command: run.command,
      ripgrepVersion: ripgrepVersion(),
      root,
    },
    liveBySurface,
    records,
    schemaVersion: SCHEMA_VERSION,
    terms: { literals: [...LITERAL_TERMS], tools: [...TOOL_NAMES] },
    topLivePaths,
    unparsedLines: run.unparsedLines,
  };
}

// ───────────────────────────────────────────────────────────────
// 5. CLI
// ───────────────────────────────────────────────────────────────

/**
 * @param {string[]} argv Arguments after the script name.
 * @returns {{ allowlistPath: string | undefined, json: boolean, reportPath: string | null, root: string | undefined }} Parsed options.
 */
export function parseArgs(argv) {
  let allowlistPath;
  let json = false;
  let reportPath = null;
  let root;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') { json = true; continue; }
    if (arg === '--allowlist' || arg === '--report' || arg === '--root') {
      const value = argv[i + 1];
      if (value === undefined) throw new Error(`${arg} requires a value`);
      if (arg === '--allowlist') allowlistPath = value;
      if (arg === '--report') reportPath = value;
      if (arg === '--root') root = value;
      i += 1;
      continue;
    }
    throw new Error(`unknown argument: ${arg}`);
  }

  return { allowlistPath, json, reportPath, root };
}

/**
 * @param {Record<string, any>} report Sweep report.
 * @returns {string} Human-readable summary.
 */
export function formatSummary(report) {
  const lines = [
    `root       : ${report.generatedFrom.root}`,
    `ripgrep    : ${report.generatedFrom.ripgrepVersion}`,
    `allowlist  : ${report.allowlistPath}`,
    `hit lines  : ${report.counts.hitLines} across ${report.counts.paths} path(s)`,
    `records    : ${report.counts.records} (live ${report.counts.live}, historical ${report.counts.historical}, allowlisted ${report.counts.allowlisted})`,
    `live paths : ${report.counts.livePaths}`,
    `unparsed   : ${report.unparsedLines}`,
    '',
    'live records by surface type:',
  ];

  for (const surface of SURFACE_TYPES) {
    lines.push(`  ${surface.padEnd(10)} ${report.liveBySurface[surface]}`);
  }

  if (report.topLivePaths.length > 0) {
    lines.push('', `top ${report.topLivePaths.length} live path(s):`);
    for (const entry of report.topLivePaths) {
      lines.push(`  ${String(entry.records).padStart(5)}  ${entry.path}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

/**
 * @param {string[]} argv Arguments after the script name.
 * @returns {Promise<number>} Process exit code.
 */
export async function main(argv) {
  let args;
  try {
    args = parseArgs(argv);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return EXIT_ERROR;
  }

  let report;
  try {
    report = await sweep({ allowlistPath: args.allowlistPath, root: args.root });
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return EXIT_ERROR;
  }

  if (args.reportPath) publishJson(path.resolve(args.reportPath), report);
  process.stdout.write(args.json ? `${stableStringify(report)}\n` : formatSummary(report));

  return report.counts.live > 0 ? EXIT_LIVE_HITS : EXIT_CLEAN;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then(
    (code) => { process.exitCode = code; },
    (error) => {
      process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
      process.exitCode = EXIT_ERROR;
    },
  );
}
