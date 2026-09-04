#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// SCRIPT: Zvec Retrieval Lane
// ───────────────────────────────────────────────────────────────
// The concept lane beside the ripgrep lane: hybrid BM25 and local vector search
// over an on-disk index, for the queries where the caller does not know the
// wording. `index`, `status` and `search` are exposed as library functions and
// as a CLI, and every one of them normalizes an external tool whose contract
// differs from this repository's in four places that each read as success:
//
// 1. zvec-grep exits 0 or 1 and nothing else. A zero-hit query and a broken
//    invocation both leave stdout thin, and the tool never distinguishes them
//    by status. The retrieval convention needs three classes, so the mapping to
//    0 hit / 1 clean miss / 2+ fault is computed here from parsed output rather
//    than passed through.
// 2. `--json` was removed from the tool. The only machine-facing surface left is
//    the agent-markdown header line, so search parses that and emits the rank
//    tuple the ripgrep wrapper emits, letting a caller merge the two lanes.
// 3. Scores are printed only under `--trace`. Without it every hit reports the
//    same nothing, so the flag is not optional here.
// 4. Execution mode is ambient. ZVEC_GREP_MODE is set on every spawn so an
//    operator's exported `server` or `auto` cannot silently route a lane call
//    through a daemon this repository does not run.
//
// Scope is read from .zvec-grep-lane.json at the repository root, because the
// tool has no project config and stores its file selection inside the generated
// index instead, where no reviewer will ever see it.
//
// Usage:
//   node zvec-lane.mjs index  [--root <dir>] [--rebuild] [--reset-paths] [--json]
//   node zvec-lane.mjs status [--root <dir>] [--json]
//   node zvec-lane.mjs search <query> [--root <dir>] [--limit <n>] [--json]
//
// Exit codes: 0 = results, 1 = no results, 2 = execution or configuration error.
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { stableStringify } from './lib/artifact.mjs';

// ───────────────────────────────────────────────────────────────
// 1. CONTRACT
// ───────────────────────────────────────────────────────────────

/** Report schema; bump when a consumer would have to change to read it. */
export const SCHEMA_VERSION = 1;

/** The subcommands this lane accepts. */
export const SUBCOMMANDS = Object.freeze(['index', 'status', 'search']);

/**
 * Exit-status classes, identical to the ripgrep lane's so a caller can branch
 * on one mapping across both lanes.
 */
export const EXIT_MATCH = 0;
export const EXIT_NO_MATCH = 1;
export const EXIT_ERROR_FLOOR = 2;

/** Environment override for the zvec-grep entry point. */
export const ZVEC_BIN_ENV = 'SPECKIT_ZVEC_GREP_BIN';

/**
 * Direct execution, always. The lane runs no daemon, and an ambient
 * ZVEC_GREP_MODE of `server` or `auto` would otherwise route a call through one
 * and change both the refresh policy and the failure surface.
 */
export const EXECUTION_MODE = 'direct';

/** Committed scope file, read relative to the repository root. */
export const CONFIG_FILENAME = '.zvec-grep-lane.json';

/**
 * Embedding reference used when the config names none. A setting rather than a
 * constant because the backend moves to Ollama once that lands, and only this
 * default changes when it does.
 */
export const DEFAULT_EMBEDDING = 'local/nomic-embed-text-v1.5';

/** Result cap for a search, matching the tool's own default. */
export const DEFAULT_LIMIT = 7;

/** Generated index directory, relative to the workspace root. */
export const INDEX_DIRECTORY = '.zvec-grep';

/** Output cap. Agent-markdown output stays far inside this. */
const MAX_STDOUT_BYTES = 64 * 1024 * 1024;

/** Indexing downloads a model on first use and walks the corpus once. */
const INDEX_TIMEOUT_MS = 60 * 60 * 1000;

/** A query loads the model and hits the index. */
const QUERY_TIMEOUT_MS = 10 * 60 * 1000;

// ───────────────────────────────────────────────────────────────
// 2. BINARY RESOLUTION
// ───────────────────────────────────────────────────────────────

/**
 * Fork checkout, tried last. The clone is a working tree rather than an
 * install, so the entry point is a plain module that needs an interpreter — see
 * `spawnArgv`, which is why the resolution records the path and not a decision
 * about how to run it.
 *
 * Derived from the passed environment rather than captured at module load, so
 * resolution stays a pure function of its argument and a caller can reason
 * about the order without inheriting this process's home directory.
 *
 * @param {NodeJS.ProcessEnv} env Environment to read.
 * @returns {string} Absolute path to the fork's built entry point.
 */
export function forkCloneEntry(env) {
  return path.join(
    homeDirectory(env),
    'MEGA', 'Development', 'Code_Environment', 'zvec-grep', 'dist', 'cli', 'index.js',
  );
}

/**
 * Resolves the zvec-grep entry point and records which rung answered, so a
 * report names the build it measured rather than a name that could have come
 * from anywhere. An explicit override wins, then an installed `zg`, then the
 * fork checkout.
 *
 * @param {NodeJS.ProcessEnv} [env] Environment to read.
 * @returns {{ entry: string, source: 'env' | 'path' | 'fork-clone' | 'fallback' }} Resolution.
 */
export function resolveZvecGrep(env = process.env) {
  const override = env[ZVEC_BIN_ENV];
  if (typeof override === 'string' && override.length > 0) {
    return { entry: override, source: 'env' };
  }

  const pathDirs = String(env.PATH ?? '').split(path.delimiter).filter(Boolean);
  for (const dir of pathDirs) {
    const candidate = path.join(dir, 'zg');
    if (isExecutableFile(candidate)) return { entry: candidate, source: 'path' };
  }

  const fork = forkCloneEntry(env);
  if (isReadableFile(fork)) {
    return { entry: fork, source: 'fork-clone' };
  }

  // Nothing resolved. Return the bare name so the spawn failure names the tool
  // rather than a path this lane invented.
  return { entry: 'zg', source: 'fallback' };
}

/**
 * Splits a resolved entry into an executable and its leading arguments. A
 * module path is not executable on its own, and spawning it directly fails with
 * EACCES, which reads as a missing tool rather than a missing interpreter.
 *
 * @param {string} entry Resolved entry point.
 * @param {string[]} argv Tool arguments.
 * @returns {{ args: string[], executable: string }} Spawn plan.
 */
export function spawnArgv(entry, argv) {
  if (/\.(?:js|mjs|cjs)$/.test(entry) && !isExecutableFile(entry)) {
    return { args: [entry, ...argv], executable: process.execPath };
  }
  return { args: argv, executable: entry };
}

/**
 * @param {NodeJS.ProcessEnv} [env] Environment to read.
 * @returns {string} Home directory, or the empty string when unset.
 */
function homeDirectory(env = process.env) {
  return env.HOME || env.USERPROFILE || '';
}

/**
 * @param {string} candidate Absolute path.
 * @returns {boolean} True when the path is an executable file.
 */
function isExecutableFile(candidate) {
  try {
    fs.accessSync(candidate, fs.constants.X_OK);
    return fs.statSync(candidate).isFile();
  } catch {
    return false;
  }
}

/**
 * @param {string} candidate Absolute path.
 * @returns {boolean} True when the path is a readable file.
 */
function isReadableFile(candidate) {
  try {
    return fs.statSync(candidate).isFile();
  } catch {
    return false;
  }
}

/**
 * Reads the tool version once so a report names the build it measured.
 *
 * @param {{ env?: NodeJS.ProcessEnv }} [options] Resolution context.
 * @returns {string} Version line, or a reason it could not be read.
 */
export function zvecGrepVersion(options = {}) {
  const resolution = resolveZvecGrep(options.env);
  const plan = spawnArgv(resolution.entry, ['version']);
  const run = spawnSync(plan.executable, plan.args, { encoding: 'utf8' });
  if (run.error) return `unavailable: ${run.error.message}; set ${ZVEC_BIN_ENV} to the entry point`;
  return String(run.stdout ?? '').trim().split('\n')[0] ?? '';
}

// ───────────────────────────────────────────────────────────────
// 3. CONFIGURATION
// ───────────────────────────────────────────────────────────────

/**
 * Reads the committed scope file. A missing file is not an error: the lane
 * still runs with the default embedding and whatever selection the existing
 * index already stored, and the caller is told the file was absent rather than
 * being handed a silent default.
 *
 * @param {string} root Repository root.
 * @returns {{
 *   embedding: string,
 *   globs: string[],
 *   mode: string,
 *   path: string,
 *   present: boolean
 * }} Resolved configuration.
 */
export function readLaneConfig(root) {
  const configPath = path.join(root, CONFIG_FILENAME);
  const resolved = {
    embedding: DEFAULT_EMBEDDING,
    globs: [],
    mode: EXECUTION_MODE,
    path: configPath,
    present: false,
  };

  let raw;
  try {
    raw = fs.readFileSync(configPath, 'utf8');
  } catch {
    return resolved;
  }

  const parsed = JSON.parse(raw);
  resolved.present = true;
  if (typeof parsed.embedding === 'string' && parsed.embedding.length > 0) {
    resolved.embedding = parsed.embedding;
  }
  if (Array.isArray(parsed.globs)) {
    resolved.globs = parsed.globs.filter((glob) => typeof glob === 'string' && glob.length > 0);
  }
  return resolved;
}

/**
 * Environment for every spawn. The execution mode is forced rather than
 * inherited, and the embedding reference is passed so a fresh index picks it up
 * without the caller having to remember the flag.
 *
 * @param {{ embedding: string }} config Resolved configuration.
 * @param {NodeJS.ProcessEnv} [env] Base environment.
 * @returns {NodeJS.ProcessEnv} Spawn environment.
 */
export function laneEnvironment(config, env = process.env) {
  return { ...env, ZVEC_GREP_EMBEDDING: config.embedding, ZVEC_GREP_MODE: EXECUTION_MODE };
}

// ───────────────────────────────────────────────────────────────
// 4. EXECUTION
// ───────────────────────────────────────────────────────────────

/**
 * Runs one zvec-grep invocation and returns its raw result. Classification is
 * left to the caller, because the tool's own status carries no information
 * beyond "threw" or "did not" and each subcommand decides what an empty answer
 * means for itself.
 *
 * @param {string[]} argv Tool arguments.
 * @param {{
 *   config: { embedding: string },
 *   cwd: string,
 *   env?: NodeJS.ProcessEnv,
 *   timeoutMs?: number
 * }} options Execution context.
 * @returns {{
 *   argv: string[],
 *   command: string,
 *   durationMs: number,
 *   resolution: { entry: string, source: string },
 *   spawnError: string,
 *   status: number,
 *   stderr: string,
 *   stdout: string
 * }} Execution record.
 */
export function runZvec(argv, options) {
  const resolution = resolveZvecGrep(options.env);
  const plan = spawnArgv(resolution.entry, argv);
  const startedAt = Date.now();

  const run = spawnSync(plan.executable, plan.args, {
    cwd: options.cwd,
    encoding: 'utf8',
    env: laneEnvironment(options.config, options.env),
    maxBuffer: MAX_STDOUT_BYTES,
    timeout: options.timeoutMs ?? QUERY_TIMEOUT_MS,
  });

  return {
    argv,
    command: formatCommand(argv),
    durationMs: Date.now() - startedAt,
    resolution,
    spawnError: run.error ? run.error.message : '',
    status: run.status ?? EXIT_ERROR_FLOOR,
    stderr: run.stderr ?? '',
    stdout: run.stdout ?? '',
  };
}

/**
 * @param {string[]} argv Tool arguments.
 * @returns {string} Copy-pasteable command line.
 */
export function formatCommand(argv) {
  return ['zg', ...argv.map(quoteArgument)].join(' ');
}

/**
 * @param {string} value Single argument.
 * @returns {string} Shell-safe rendering.
 */
function quoteArgument(value) {
  return /^[A-Za-z0-9_./:@=-]+$/.test(value) ? value : `'${value.replace(/'/g, `'\\''`)}'`;
}

// ───────────────────────────────────────────────────────────────
// 5. OUTPUT PARSING
// ───────────────────────────────────────────────────────────────

/**
 * A ranked hit header from the agent-markdown output, which is the only
 * machine-facing surface the tool still offers. `--json` was removed from it,
 * so this shape is the contract:
 *
 *   #1 matchedBy=fts+vector score=0.0164 path/to/file.md:12-40
 *
 * The optional bracket carries a selection reason, the score appears only under
 * `--trace`, and the trailing label is a line, a line range, or a non-line
 * locator such as `bytes:0-40`, `page:3` or `file`.
 */
const HIT_HEADER = /^#(\d+)(?:\s+\[[^\]]*\])?\s+matchedBy=(\S+)(?:\s+score=(-?[\d.]+(?:[eE][+-]?\d+)?))?\s+(.+)$/;

/** A text range at the tail of a locator: `12` or `12-40`. */
const TEXT_RANGE = /^(.*):(\d+)(?:-(\d+))?$/;

/** A non-line locator the tool emits for binary, paged or whole-file hits. */
const OTHER_RANGE = /^(.*):((?:bytes|page):.*|file)$/;

/**
 * Extracts ranked hits from agent-markdown output. Everything that is not a hit
 * header is ignored rather than parsed: group banners, previews and source
 * excerpts all vary with flags, and a parser that tracked them would break on a
 * presentation change that costs the caller nothing.
 *
 * A header that matches the hit shape but carries no readable locator is
 * reported rather than dropped, because silent loss here reads as a clean miss.
 *
 * @param {string} stdout Raw agent-markdown text.
 * @returns {{
 *   hits: Array<{
 *     endLine: number | null,
 *     line: number | null,
 *     matchedBy: string,
 *     path: string,
 *     rangeLabel: string,
 *     rank: number,
 *     score: number | null
 *   }>,
 *   unparsedHeaders: number
 * }} Parsed hits in the order the tool ranked them.
 */
export function parseAgentMarkdown(stdout) {
  const hits = [];
  let unparsedHeaders = 0;

  for (const line of String(stdout ?? '').split('\n')) {
    const header = HIT_HEADER.exec(line.trim());
    if (!header) continue;

    const [, rank, matchedBy, score, locator] = header;
    const located = parseLocator(locator);
    if (!located) {
      unparsedHeaders += 1;
      continue;
    }

    hits.push({
      endLine: located.endLine,
      line: located.line,
      matchedBy,
      path: located.path,
      rangeLabel: located.rangeLabel,
      rank: Number(rank),
      score: score === undefined ? null : Number(score),
    });
  }

  return { hits, unparsedHeaders };
}

/**
 * Splits a `path:range` locator.
 *
 * The labelled forms are tested first, and the order is load-bearing rather
 * than stylistic. A byte locator ends in digits and a hyphen exactly like a
 * line range does, so the line pattern matches `file.json:bytes:0-4096` by
 * folding the label into the path and reporting line 0 — a plausible-looking
 * number for a hit that has no line at all. Reading the label first is the only
 * thing that keeps a byte offset from being served to a caller as a line.
 *
 * @param {string} locator Raw locator text.
 * @returns {{
 *   endLine: number | null,
 *   line: number | null,
 *   path: string,
 *   rangeLabel: string
 * } | null} Parsed locator, or null when it carries no range at all.
 */
function parseLocator(locator) {
  const other = OTHER_RANGE.exec(locator);
  if (other) {
    const [, filePath, label] = other;
    return { endLine: null, line: null, path: filePath, rangeLabel: label };
  }

  const text = TEXT_RANGE.exec(locator);
  if (text) {
    const [, filePath, startLine, endLine] = text;
    return {
      endLine: endLine === undefined ? Number(startLine) : Number(endLine),
      line: Number(startLine),
      path: filePath,
      rangeLabel: endLine === undefined ? startLine : `${startLine}-${endLine}`,
    };
  }

  return null;
}

// ───────────────────────────────────────────────────────────────
// 6. RANK TUPLE NORMALIZATION
// ───────────────────────────────────────────────────────────────

/**
 * Evidence field for a semantic hit. The vector lane returns a passage rather
 * than a field, so the only honest classification available before reading the
 * file is where the passage sits: a hit inside the leading frontmatter block is
 * declared metadata, everything else is body.
 */
export const EVIDENCE_FIELDS = Object.freeze(['frontmatter', 'body', 'unlocated']);

/**
 * Match classes for the zvec lane. These are lane labels, not the lexical
 * scorer's classes: nothing here was matched by literal containment, so reusing
 * `exact` or `phrase-containment` would claim a precision the vector lane never
 * establishes.
 */
export const MATCH_CLASSES = Object.freeze(['lexical-and-semantic', 'lexical', 'semantic', 'unclassified']);

/**
 * Maps the tool's `matchedBy` to a lane match class.
 *
 * @param {string} matchedBy Raw value: `fts`, `vector` or `fts+vector`.
 * @returns {string} One of MATCH_CLASSES.
 */
export function matchClassFor(matchedBy) {
  if (matchedBy === 'fts+vector') return 'lexical-and-semantic';
  if (matchedBy === 'fts') return 'lexical';
  if (matchedBy === 'vector') return 'semantic';
  return 'unclassified';
}

/**
 * Normalizes parsed hits into the rank tuple the ripgrep wrapper emits, so a
 * caller can merge the two lanes without a per-lane branch. The added field is
 * the semantic score, which ripgrep has no analogue for and which the caller
 * needs in order to weigh a concept hit against a literal one.
 *
 * Order is the tool's own rank, and this is the one place the lane defers to an
 * external ranker rather than re-deriving order. It has to: the fusion score
 * behind that rank is not reconstructible from the printed output, and
 * re-sorting on a tuple that ignores it would discard the only relevance signal
 * the lane has. The rank is carried through so a caller can see it.
 *
 * @param {Array<Record<string, unknown>>} hits Parsed hits.
 * @param {{ cwd: string }} options Ranking context.
 * @returns {Array<{
 *   evidenceField: string,
 *   lane: string,
 *   line: number | null,
 *   matchClass: string,
 *   packetPath: string,
 *   path: string,
 *   rangeLabel: string,
 *   rank: number,
 *   score: number | null
 * }>} Ranked evidence.
 */
export function normalizeHits(hits, options) {
  /** @type {Map<string, number>} */
  const frontmatterEnds = new Map();

  return hits.map((hit) => {
    let end = frontmatterEnds.get(hit.path);
    if (end === undefined) {
      end = readFrontmatterEnd(path.resolve(options.cwd, hit.path));
      frontmatterEnds.set(hit.path, end);
    }

    let evidenceField = 'unlocated';
    if (hit.line !== null) evidenceField = hit.line <= end ? 'frontmatter' : 'body';

    return {
      evidenceField,
      lane: 'zvec',
      line: hit.line,
      matchClass: matchClassFor(hit.matchedBy),
      packetPath: path.dirname(hit.path),
      path: hit.path,
      rangeLabel: hit.rangeLabel,
      rank: hit.rank,
      score: hit.score,
    };
  });
}

/**
 * One-based line of the closing `---` of a document's leading frontmatter. Only
 * the leading block counts: a `---` further down is a horizontal rule.
 *
 * @param {string} filePath Absolute path.
 * @returns {number} Closing line, or 0 when the file has no leading block.
 */
function readFrontmatterEnd(filePath) {
  let text;
  try {
    text = fs.readFileSync(filePath, 'utf8');
  } catch {
    return 0;
  }

  const lines = text.split('\n');
  if (lines[0]?.trim() !== '---') return 0;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') return i + 1;
  }
  return 0;
}

// ───────────────────────────────────────────────────────────────
// 7. SUBCOMMAND: INDEX
// ───────────────────────────────────────────────────────────────

/**
 * Builds or updates the workspace index for a repository root, with the scope
 * the committed config declares.
 *
 * The glob arguments are passed only when the config carries them, and an
 * existing index reuses its stored selection unless `--reset-paths` or
 * `--rebuild` is set. Passing globs to an existing index without one of those
 * is accepted by the tool and changes nothing, which is why the record reports
 * whether the selection was actually replaced.
 *
 * @param {{
 *   cwd?: string,
 *   env?: NodeJS.ProcessEnv,
 *   rebuild?: boolean,
 *   resetPaths?: boolean
 * }} [options] Execution context.
 * @returns {Record<string, unknown>} Execution record.
 */
export function index(options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const config = readLaneConfig(cwd);

  const argv = ['index', cwd, '--mode', EXECUTION_MODE];
  if (options.rebuild) argv.push('--rebuild');
  if (options.resetPaths) argv.push('--reset-paths');
  argv.push('--embedding', config.embedding);

  // Without `--hidden` the scanner skips every dotted directory, so the whole
  // .opencode tree is dropped while its globs are still accepted, the build
  // still succeeds and status still reports 100% coverage of what it did scan.
  // Measured against a four-file corpus: two files indexed, the two under
  // .opencode silently absent, and no warning anywhere. The flag is not
  // optional for a corpus whose skill and command sources live under a dot.
  argv.push('--hidden');

  for (const glob of config.globs) argv.push('--glob', glob);

  const run = runZvec(argv, { config, cwd, env: options.env, timeoutMs: INDEX_TIMEOUT_MS });
  const record = baseRecord('index', config, run);

  if (run.spawnError) return failed(record, run.spawnError);
  if (run.status !== 0) return failed(record, run.stderr.trim() || 'zg index failed');

  record.exitCode = EXIT_MATCH;
  record.outcome = 'ok';
  record.output = run.stdout.trim();
  record.selectionReplaced = Boolean(options.rebuild || options.resetPaths);
  record.indexSizeBytes = indexSizeBytes(cwd);
  return record;
}

/**
 * Total size of the generated index directory. Reported because it is the cost
 * side of the lane and it is invisible to git, the directory being ignored.
 *
 * @param {string} root Workspace root.
 * @returns {number} Bytes on disk, 0 when no index exists.
 */
export function indexSizeBytes(root) {
  const directory = path.join(root, INDEX_DIRECTORY);
  let total = 0;

  /** @param {string} current Directory to walk. */
  const walk = (current) => {
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) { walk(absolute); continue; }
      try {
        total += fs.statSync(absolute).size;
      } catch {
        // A file removed mid-walk is not a measurement failure.
      }
    }
  };

  walk(directory);
  return total;
}

// ───────────────────────────────────────────────────────────────
// 8. SUBCOMMAND: STATUS
// ───────────────────────────────────────────────────────────────

/**
 * Reports index presence, coverage, freshness and the embedding schema.
 *
 * The embedding provider, model and dimension are read from the generated
 * manifest rather than scraped from the status text, because the manifest is
 * the field the tool itself reads and the text is presentation. Readiness comes
 * from `--check-ready`, whose non-zero exit is a verdict rather than a fault:
 * an absent index is a valid empty answer and maps to the lane's no-result
 * class, not to its error class.
 *
 * @param {{ cwd?: string, env?: NodeJS.ProcessEnv }} [options] Execution context.
 * @returns {Record<string, unknown>} Execution record.
 */
export function status(options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const config = readLaneConfig(cwd);

  const run = runZvec(['status', cwd, '--mode', EXECUTION_MODE, '--check-ready'], {
    config, cwd, env: options.env,
  });
  const record = baseRecord('status', config, run);

  if (run.spawnError) return failed(record, run.spawnError);

  // `--check-ready` exits 1 for two unrelated reasons — an index that is not
  // ready, and a genuine engine fault — and both print an `Error:` line, so the
  // presence of that line separates nothing. The verdict is distinguishable
  // only by its sentence: the not-ready path throws a plain Error carrying the
  // state, while an engine fault carries a `Code:` line the plain Error has no
  // field for. Matching the sentence is therefore the discriminator, and it
  // fails in the safe direction: if the wording changes, an unready index is
  // reported as a fault rather than a fault being reported as calm.
  const verdict = /Workspace index is not ready \(state: ([a-z]+)\)/i.exec(run.stderr);
  if (run.status !== 0 && !verdict) {
    return failed(record, run.stderr.trim() || 'zg status failed');
  }

  const manifest = readManifest(cwd);
  record.indexState = verdict ? verdict[1] : 'ready';
  record.indexPresent = manifest !== null;
  record.indexSizeBytes = indexSizeBytes(cwd);
  record.output = run.stdout.trim();
  record.ready = run.status === 0;
  record.coverage = parseCoverage(run.stdout);
  record.embedding = manifest?.embedding ?? null;
  record.indexPolicy = manifest?.indexPolicy ?? null;
  record.rootPaths = manifest ? summarizeRootPaths(manifest.rootPaths) : null;
  record.freshness = manifest
    ? { createdTime: manifest.createdTime ?? null, updatedTime: manifest.updatedTime ?? null }
    : null;

  // A missing or unready index is an empty answer, never a fault. The tool
  // reports both by exiting non-zero, and collapsing that into the error class
  // would make "no index yet" indistinguishable from "the tool is broken".
  record.exitCode = record.ready ? EXIT_MATCH : EXIT_NO_MATCH;
  record.outcome = record.ready ? 'ready' : 'not-ready';
  return record;
}

/**
 * @param {string} root Workspace root.
 * @returns {Record<string, any> | null} Parsed manifest, or null when absent or unreadable.
 */
export function readManifest(root) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, INDEX_DIRECTORY, 'manifest.json'), 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Pulls the indexed-file counts out of the status text. Presentation, not
 * contract, so every field is optional and a shape change costs the caller the
 * counts rather than the whole status.
 *
 * Every pattern is anchored to its own label at the start of a line. The tool
 * prints the label before the number — `Entities    6` — on a block of aligned
 * rows, so an unanchored `(\d+)\s+entities` finds nothing while a neighbouring
 * pattern happily reads across the newline and captures the previous row's
 * number. That mis-capture is silent and produces a plausible count, which is
 * why the anchoring is not cosmetic.
 *
 * @param {string} stdout Raw status text.
 * @returns {Record<string, number>} Parsed counts, empty when none were printed.
 */
export function parseCoverage(stdout) {
  /** @type {Record<string, number>} */
  const coverage = {};
  const text = String(stdout ?? '');

  const indexed = /^\s*Coverage\b[^\n]*?([\d,]+)\s*\/\s*([\d,]+)\s+files/im.exec(text);
  if (indexed) {
    coverage.indexedFiles = toCount(indexed[1]);
    coverage.totalFiles = toCount(indexed[2]);
  }

  const entities = /^\s*Entities\s+([\d,]+)/im.exec(text);
  if (entities) coverage.entities = toCount(entities[1]);

  const truncated = /^\s*Truncated\s+([\d,]+)/im.exec(text);
  if (truncated) coverage.truncated = toCount(truncated[1]);

  const queue = /^\s*Queue\s+([\d,]+)\s+pending[^\n\d]+([\d,]+)\s+failed/im.exec(text);
  if (queue) {
    coverage.pending = toCount(queue[1]);
    coverage.failed = toCount(queue[2]);
  }

  return coverage;
}

/**
 * @param {string} value Digit group, possibly thousands-separated.
 * @returns {number} Parsed count.
 */
function toCount(value) {
  return Number(value.replace(/,/g, ''));
}

/**
 * @param {ReadonlyArray<Record<string, any>>} [rootPaths] Stored selection.
 * @returns {Array<Record<string, unknown>>} Compact selection summary.
 */
function summarizeRootPaths(rootPaths) {
  if (!Array.isArray(rootPaths)) return [];
  return rootPaths.map((entry) => ({
    globs: entry.globs ?? [],
    path: entry.absolutePath ?? '',
    recursive: entry.recursive ?? null,
  }));
}

// ───────────────────────────────────────────────────────────────
// 9. SUBCOMMAND: SEARCH
// ───────────────────────────────────────────────────────────────

/**
 * Runs one hybrid query and returns hits in the shared rank-tuple shape.
 *
 * `--trace` is not a debugging option here. Scores are printed only under it,
 * and a hit without a score cannot be weighed against a ripgrep hit, which is
 * the entire point of normalizing the two lanes onto one shape.
 *
 * @param {string} query Free-text query.
 * @param {{
 *   cwd?: string,
 *   env?: NodeJS.ProcessEnv,
 *   limit?: number
 * }} [options] Execution context.
 * @returns {Record<string, unknown>} Execution record.
 */
export function search(query, options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const config = readLaneConfig(cwd);
  const limit = options.limit ?? DEFAULT_LIMIT;

  const run = runZvec([
    'query', query,
    '--mode', EXECUTION_MODE,
    '--limit', String(limit),
    '--preview', 'none',
    '--trace',
    '--no-color',
  ], { config, cwd, env: options.env });

  const record = baseRecord('search', config, run);
  record.query = query;
  record.limit = limit;

  if (run.spawnError) return failed(record, run.spawnError);
  if (run.status !== 0) return failed(record, run.stderr.trim() || 'zg query failed');

  const parsed = parseAgentMarkdown(run.stdout);
  record.results = normalizeHits(parsed.hits, { cwd });
  record.unparsedHeaders = parsed.unparsedHeaders;

  // The tool exits 0 whether or not it found anything, so the class comes from
  // the parsed hit count. Reading its status alone would report every miss as a
  // match.
  record.exitCode = record.results.length > 0 ? EXIT_MATCH : EXIT_NO_MATCH;
  record.outcome = record.results.length > 0 ? 'match' : 'no-match';
  return record;
}

// ───────────────────────────────────────────────────────────────
// 10. RECORD SHAPE
// ───────────────────────────────────────────────────────────────

/**
 * @param {string} subcommand One of SUBCOMMANDS.
 * @param {Record<string, any>} config Resolved configuration.
 * @param {Record<string, any>} run Execution record.
 * @returns {Record<string, unknown>} Base record every subcommand extends.
 */
function baseRecord(subcommand, config, run) {
  return {
    binary: run.resolution.entry,
    binarySource: run.resolution.source,
    command: run.command,
    config: {
      embedding: config.embedding,
      globCount: config.globs.length,
      path: config.path,
      present: config.present,
    },
    durationMs: run.durationMs,
    exitCode: EXIT_ERROR_FLOOR,
    mode: EXECUTION_MODE,
    outcome: 'error',
    schemaVersion: SCHEMA_VERSION,
    stderr: run.stderr,
    subcommand,
    toolStatus: run.status,
  };
}

/**
 * Marks a record as an execution fault. The message is appended only when it
 * adds something the captured stderr does not already say, because the common
 * case passes that same stderr back in and a naive append prints it twice.
 *
 * @param {Record<string, any>} record Base record.
 * @param {string} message Failure text.
 * @returns {Record<string, unknown>} Failed record.
 */
function failed(record, message) {
  record.exitCode = EXIT_ERROR_FLOOR;
  record.outcome = 'error';

  const existing = String(record.stderr ?? '').trim();
  const addition = String(message ?? '').trim();
  if (!existing) record.stderr = addition;
  else if (addition && !existing.includes(addition)) record.stderr = `${existing}\n${addition}`;
  else record.stderr = existing;

  return record;
}

// ───────────────────────────────────────────────────────────────
// 11. CLI
// ───────────────────────────────────────────────────────────────

/**
 * @param {string[]} argv Arguments after the script name.
 * @returns {{
 *   json: boolean,
 *   limit: number | undefined,
 *   query: string | undefined,
 *   rebuild: boolean,
 *   resetPaths: boolean,
 *   root: string | undefined,
 *   subcommand: string
 * }} Parsed options.
 */
export function parseArgs(argv) {
  const positional = [];
  let json = false;
  let limit;
  let rebuild = false;
  let resetPaths = false;
  let root;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') { json = true; continue; }
    if (arg === '--rebuild') { rebuild = true; continue; }
    if (arg === '--reset-paths') { resetPaths = true; continue; }
    if (arg === '--root' || arg === '--limit') {
      const value = argv[i + 1];
      if (value === undefined) throw new Error(`${arg} requires a value`);
      if (arg === '--root') root = value; else limit = Number(value);
      i += 1;
      continue;
    }
    if (arg.startsWith('--')) throw new Error(`unknown argument: ${arg}`);
    positional.push(arg);
  }

  const [subcommand, query] = positional;
  if (!SUBCOMMANDS.includes(subcommand)) {
    throw new Error(`first argument must be one of ${SUBCOMMANDS.join(', ')}`);
  }
  if (subcommand === 'search' && query === undefined) throw new Error('a query is required');
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    throw new Error('--limit requires a positive integer');
  }

  return { json, limit, query, rebuild, resetPaths, root, subcommand };
}

/**
 * @param {Record<string, any>} record Execution record.
 * @returns {string} Human-readable summary.
 */
export function formatSummary(record) {
  const lines = [
    `lane    : zvec (${record.mode})`,
    `binary  : ${record.binary} (${record.binarySource})`,
    `command : ${record.command}`,
    `exit    : ${record.exitCode} (${record.outcome})`,
  ];

  if (record.outcome === 'error') {
    lines.push(`stderr  : ${String(record.stderr).trim() || '(empty)'}`);
    return `${lines.join('\n')}\n`;
  }

  if (record.subcommand === 'index') {
    lines.push(
      `embed   : ${record.config.embedding}`,
      `globs   : ${record.config.globCount} from ${record.config.path}`,
      `replaced: ${record.selectionReplaced}`,
      `size    : ${formatBytes(record.indexSizeBytes)}`,
      `elapsed : ${formatDuration(record.durationMs)}`,
    );
    return `${lines.join('\n')}\n`;
  }

  if (record.subcommand === 'status') {
    const embedding = record.embedding;
    lines.push(
      `present : ${record.indexPresent}`,
      `state   : ${record.indexState}`,
      `embed   : ${embedding ? `${embedding.provider}/${embedding.model} dim=${embedding.dimension} metric=${embedding.metric}` : '(no manifest)'}`,
      `coverage: ${formatCoverage(record.coverage)}`,
      `updated : ${formatTime(record.freshness?.updatedTime)}`,
      `size    : ${formatBytes(record.indexSizeBytes)}`,
    );
    return `${lines.join('\n')}\n`;
  }

  lines.push(`hits    : ${record.results.length}, unparsed headers ${record.unparsedHeaders}`);
  for (const result of record.results) {
    const score = result.score === null ? 'n/a' : result.score.toFixed(4);
    lines.push(`  #${result.rank} ${result.matchClass.padEnd(20)} ${score.padStart(8)}  ${result.path}:${result.rangeLabel}`);
  }
  return `${lines.join('\n')}\n`;
}

/**
 * @param {Record<string, number>} coverage Parsed counts.
 * @returns {string} Compact rendering.
 */
function formatCoverage(coverage) {
  const entries = Object.entries(coverage ?? {});
  if (entries.length === 0) return '(not printed)';
  return entries.map(([key, value]) => `${key}=${value}`).join(' ');
}

/**
 * @param {number} bytes Size on disk.
 * @returns {string} Compact rendering.
 */
function formatBytes(bytes) {
  if (typeof bytes !== 'number' || bytes <= 0) return '0 B';
  const units = ['B', 'KiB', 'MiB', 'GiB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit += 1; }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

/**
 * @param {number} milliseconds Elapsed time.
 * @returns {string} Compact rendering.
 */
function formatDuration(milliseconds) {
  if (typeof milliseconds !== 'number') return 'unknown';
  const seconds = milliseconds / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

/**
 * @param {number | null | undefined} epoch Epoch milliseconds.
 * @returns {string} ISO rendering, or a marker when absent.
 */
function formatTime(epoch) {
  if (typeof epoch !== 'number' || !Number.isFinite(epoch)) return '(unknown)';
  return new Date(epoch).toISOString();
}

/**
 * @param {string[]} argv Arguments after the script name.
 * @returns {number} Process exit code.
 */
export function main(argv) {
  let args;
  try {
    args = parseArgs(argv);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return EXIT_ERROR_FLOOR;
  }

  const cwd = args.root ? path.resolve(args.root) : process.cwd();
  let record;
  try {
    if (args.subcommand === 'index') {
      record = index({ cwd, rebuild: args.rebuild, resetPaths: args.resetPaths });
    } else if (args.subcommand === 'status') {
      record = status({ cwd });
    } else {
      record = search(args.query, { cwd, limit: args.limit });
    }
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return EXIT_ERROR_FLOOR;
  }

  if (record.outcome === 'error') {
    process.stderr.write(`${record.command}\n${String(record.stderr).trim() || 'zvec-grep failed'}\n`);
    return EXIT_ERROR_FLOOR;
  }

  process.stdout.write(args.json ? `${stableStringify(record)}\n` : formatSummary(record));
  return record.exitCode;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
