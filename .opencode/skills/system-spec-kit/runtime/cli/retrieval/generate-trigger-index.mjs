#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// SCRIPT: Trigger Index Generator
// ───────────────────────────────────────────────────────────────
// Walks the documentation corpus, reads the trigger-phrase frontmatter out of
// every markdown document, and publishes one deterministic many-to-many index
// plus the manifest and diagnostics that describe the snapshot it was built
// from. Standard library only: no daemon, no database, no network.
//
// Determinism is the point. Two runs over one tree must produce byte-identical
// output, so nothing time-varying is emitted and every key and array is sorted.
//
// Publication is fail-closed. A corpus containing a document whose trigger
// declaration cannot be trusted leaves the previously published index in place
// and exits non-zero, because a partial index silently narrows retrieval. The
// one documented escape is the ignored-path list in lib/corpus.mjs, which names
// each exempt document and why it is exempt.
//
// The artifact is sized for a cold read, because every lookup pays to parse the
// whole of it. Paths are interned into one sorted table and referenced by
// integer, per-phrase token lists are left to be re-derived from the key, and
// raw phrase spellings move to a diagnostics fixture. Nothing stored here
// exists to answer partial substrings: the lookup scans the phrase keys, which
// is cheaper than shipping a posting list that reproduces them.
//
// Usage:
//   node generate-trigger-index.mjs [--repo-root <path>] [--allow-malformed] [--json] [--quiet]
//   node generate-trigger-index.mjs --out <path> --manifest <path> --diagnostics <path>
//                                   [--variants <path>]
//
// Exit codes: 0 = published, 1 = malformed corpus (nothing published), 2 = bad invocation.
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { TRIGGER_INDEX_SCHEMA_VERSION, assertTriggerIndexShape, publishJson, sha256, stableStringify } from './lib/artifact.mjs';
import { CORPUS_ROOTS, EXCLUSIONS, IGNORED_PATHS, walkCorpus } from './lib/corpus.mjs';
import { CATEGORY, MALFORMED_CATEGORIES, readTriggerPhrases } from './lib/frontmatter.mjs';
import { compareCodeUnits, NORMALIZATION } from './lib/normalize.mjs';

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────

/** Bumped whenever the frontmatter reader changes what it accepts or how it classifies. */
export const PARSER_VERSION = '1.0.0';

/** Bumped whenever the artifact shape changes in a way a reader must notice. */
export const INDEX_SCHEMA_VERSION = TRIGGER_INDEX_SCHEMA_VERSION;

export const CORPUS_HASH_RECIPE =
  'sha256 over, for each included path in code-unit order: utf8(path) + 0x00 + file bytes + 0x0a';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(SCRIPT_DIR, '..', '..', '..');

export const DEFAULT_INDEX_PATH = path.join(SKILL_ROOT, 'runtime', 'data', 'trigger-index.json');
export const DEFAULT_MANIFEST_PATH = path.join(SCRIPT_DIR, 'fixtures', 'corpus-manifest.json');
export const DEFAULT_DIAGNOSTICS_PATH = path.join(SCRIPT_DIR, 'fixtures', 'generation-diagnostics.json');
export const DEFAULT_VARIANTS_PATH = path.join(SCRIPT_DIR, 'fixtures', 'phrase-variants.json');

/**
 * Resolves the repository root by walking up from `start` until a directory
 * holding the documentation corpus appears — one that contains both `.opencode`
 * and `specs` — or the git root is reached, whichever comes first. A fixed hop
 * count from this file's location breaks the moment a directory level is added
 * or removed, and the break is silent: a root resolved one level off still
 * produces a well-formed index, just over a narrowed corpus, and the missing
 * documents are invisible unless someone counts them. The walk keeps that drift
 * impossible. The historical hop count survives only as a fallback for trees
 * where neither marker appears above the script.
 *
 * @param {string} [start] Directory to walk up from; defaults to this script's directory.
 * @returns {string} Absolute repository root.
 */
export function findRepoRoot(start = SCRIPT_DIR) {
  const origin = path.resolve(start);
  let directory = origin;
  for (;;) {
    const holdsCorpus = fs.existsSync(path.join(directory, '.opencode'))
      && fs.existsSync(path.join(directory, 'specs'));
    if (holdsCorpus || fs.existsSync(path.join(directory, '.git'))) {
      return directory;
    }
    const parent = path.dirname(directory);
    if (parent === directory) {
      return path.resolve(origin, '..', '..', '..', '..', '..');
    }
    directory = parent;
  }
}

/** Repository root the corpus roots resolve against. */
export const DEFAULT_REPO_ROOT = findRepoRoot();

/** Field separators folded into the corpus hash, per CORPUS_HASH_RECIPE. */
const NUL = Buffer.from([0x00]);
const LF = Buffer.from([0x0a]);

// ───────────────────────────────────────────────────────────────
// 2. BUILD
// ───────────────────────────────────────────────────────────────

/**
 * Reads the corpus and assembles the artifact, the manifest, the diagnostics
 * and the raw-variant sidecar without writing anything.
 *
 * @param {{
 *   repoRoot: string,
 *   roots?: readonly string[],
 *   ignoredPaths?: ReadonlyArray<{ path: string, reason: string }>
 * }} options Build inputs.
 * @returns {{
 *   index: Record<string, unknown>,
 *   manifest: Record<string, unknown>,
 *   diagnostics: Record<string, unknown>,
 *   variants: Record<string, unknown>,
 *   stats: Record<string, number>
 * }} Everything the caller needs to publish or to report a refusal.
 */
export function buildIndex(options) {
  const repoRoot = path.resolve(options.repoRoot);
  const roots = options.roots ?? CORPUS_ROOTS;
  const ignoredPaths = Array.from(options.ignoredPaths ?? IGNORED_PATHS)
    .map((entry) => ({ path: entry.path, reason: entry.reason }))
    .sort((a, b) => compareCodeUnits(a.path, b.path));
  const ignoredPathSet = new Set(ignoredPaths.map((entry) => entry.path));
  const ignoredPathsMatched = new Set();

  const { files, skipped } = walkCorpus(repoRoot, { roots });

  const corpusHasher = createHash('sha256');
  /** @type {Map<string, { paths: Set<string>, raw: Set<string> }>} */
  const phrases = new Map();
  /** @type {Array<Record<string, unknown>>} */
  const rows = [];
  /** @type {Record<string, number>} */
  const counts = {};
  let corpusBytes = 0;
  let phraseDeclarations = 0;
  let aliasDocuments = 0;
  let malformedDocuments = 0;
  let ignoredMalformedDocuments = 0;

  for (const relativePath of files) {
    const buffer = fs.readFileSync(path.join(repoRoot, relativePath));
    corpusHasher.update(relativePath, 'utf8');
    corpusHasher.update(NUL);
    corpusHasher.update(buffer);
    corpusHasher.update(LF);
    corpusBytes += buffer.length;

    const ignored = ignoredPathSet.has(relativePath);
    if (ignored) ignoredPathsMatched.add(relativePath);

    const parsed = readTriggerPhrases(buffer.toString('utf8'));
    counts[parsed.category] = (counts[parsed.category] ?? 0) + 1;
    if (parsed.alias) aliasDocuments += 1;
    if (MALFORMED_CATEGORIES.has(parsed.category)) {
      // An ignored document is still reported, just not counted against the
      // refusal. Dropping the row too would hide the defect the list documents.
      if (ignored) ignoredMalformedDocuments += 1;
      else malformedDocuments += 1;
    }

    if (parsed.category !== CATEGORY.OK) {
      const row = {
        category: parsed.category,
        line: parsed.line,
        path: relativePath,
        reason: parsed.reason,
      };
      if (parsed.alias) row.alias = true;
      if (ignored) row.ignored = true;
      if (parsed.rawKey) row.rawKey = parsed.rawKey;
      if (parsed.notes.length > 0) row.notes = parsed.notes.slice().sort(compareCodeUnits);
      rows.push(row);
    }

    for (const phrase of parsed.phrases) {
      phraseDeclarations += 1;
      let entry = phrases.get(phrase.normalized);
      if (!entry) {
        entry = { paths: new Set(), raw: new Set() };
        phrases.set(phrase.normalized, entry);
      }
      entry.paths.add(relativePath);
      entry.raw.add(phrase.raw);
    }
  }

  const corpusHash = corpusHasher.digest('hex');
  const includedPaths = files;

  const sortedPhrases = Array.from(phrases.entries())
    .sort(([a], [b]) => compareCodeUnits(a, b));

  // Only paths that own a phrase are interned. The rest of the corpus is
  // already enumerated by the manifest, and carrying it twice would grow the
  // one file every lookup parses for no lookup benefit.
  const owningPaths = new Set();
  for (const [, entry] of sortedPhrases) {
    for (const owner of entry.paths) owningPaths.add(owner);
  }
  const pathTable = Array.from(owningPaths).sort(compareCodeUnits);
  const pathIds = new Map(pathTable.map((value, id) => [value, id]));

  const manifestIdentity = {
    corpusHash,
    exclusions: Array.from(EXCLUSIONS),
    ignoredPaths,
    includedPathCount: includedPaths.length,
    indexSchemaVersion: INDEX_SCHEMA_VERSION,
    parserVersion: PARSER_VERSION,
    roots: Array.from(roots),
  };
  const manifestHash = sha256(stableStringify(manifestIdentity));

  const manifest = {
    ...manifestIdentity,
    corpusHashRecipe: CORPUS_HASH_RECIPE,
    includedPaths,
    manifestHash,
    // Owned by the parity harness, which pins its own frozen prompt set here.
    // Left null so the manifest hash stays stable when that value lands.
    promptSetHash: null,
    skippedPaths: skipped,
  };

  const index = {
    manifestHash,
    normalization: { ...NORMALIZATION, stopWords: Array.from(NORMALIZATION.stopWords) },
    paths: pathTable,
    phrases: Object.fromEntries(
      sortedPhrases.map(([normalized, entry]) => [
        normalized,
        Array.from(entry.paths, (owner) => pathIds.get(owner)).sort((a, b) => a - b),
      ]),
    ),
    schemaVersion: INDEX_SCHEMA_VERSION,
  };

  const diagnostics = {
    counts: Object.fromEntries(
      Object.entries(counts).sort(([a], [b]) => compareCodeUnits(a, b)),
    ),
    documentsScanned: includedPaths.length,
    ignoredMalformedDocuments,
    ignoredPaths,
    // A listed path that no longer exists is a dead exemption; naming it keeps
    // the list from quietly outliving the defect it was written for.
    ignoredPathsUnmatched: ignoredPaths
      .filter((entry) => !ignoredPathsMatched.has(entry.path))
      .map((entry) => entry.path),
    malformedDocuments,
    manifestHash,
    parserVersion: PARSER_VERSION,
    rows: rows.sort((a, b) => compareCodeUnits(String(a.path), String(b.path))
      || Number(a.line) - Number(b.line)),
    skippedPaths: skipped,
  };

  const variants = {
    manifestHash,
    parserVersion: PARSER_VERSION,
    // The spellings the index no longer carries. Lookup never reads them; they
    // exist so an operator can trace a normalized key back to what was written.
    variants: Object.fromEntries(
      sortedPhrases.map(([normalized, entry]) => [
        normalized,
        Array.from(entry.raw).sort(compareCodeUnits),
      ]),
    ),
  };

  return {
    diagnostics,
    index,
    manifest,
    stats: {
      aliasDocuments,
      corpusBytes,
      diagnosticRows: rows.length,
      documentsScanned: includedPaths.length,
      ignoredMalformedDocuments,
      indexedPaths: pathTable.length,
      malformedDocuments,
      phraseDeclarations,
      uniquePhrases: phrases.size,
    },
    variants,
  };
}

// ───────────────────────────────────────────────────────────────
// 3. PUBLICATION
// ───────────────────────────────────────────────────────────────

/**
 * Builds the artifact and publishes it unless the corpus contains a document
 * whose trigger declaration cannot be trusted. Diagnostics are written either
 * way, because a refusal is worthless without the rows that explain it.
 *
 * @param {{
 *   repoRoot?: string,
 *   roots?: readonly string[],
 *   ignoredPaths?: ReadonlyArray<{ path: string, reason: string }>,
 *   indexPath?: string,
 *   manifestPath?: string,
 *   diagnosticsPath?: string,
 *   variantsPath?: string,
 *   allowMalformed?: boolean
 * }} [options] Generation inputs.
 * @returns {{
 *   published: boolean,
 *   stats: Record<string, number>,
 *   counts: Record<string, number>,
 *   manifestHash: string,
 *   indexBytes: number,
 *   indexSha256: string,
 *   manifestBytes: number,
 *   diagnosticsBytes: number,
 *   variantsBytes: number,
 *   durationMs: number,
 *   paths: Record<string, string>
 * }} Publication report.
 */
export function generate(options = {}) {
  const started = process.hrtime.bigint();
  const repoRoot = options.repoRoot ?? DEFAULT_REPO_ROOT;
  const indexPath = options.indexPath ?? DEFAULT_INDEX_PATH;
  const manifestPath = options.manifestPath ?? DEFAULT_MANIFEST_PATH;
  const diagnosticsPath = options.diagnosticsPath ?? DEFAULT_DIAGNOSTICS_PATH;
  const variantsPath = options.variantsPath ?? DEFAULT_VARIANTS_PATH;
  const artifactPaths = {
    diagnostics: diagnosticsPath,
    index: indexPath,
    manifest: manifestPath,
    variants: variantsPath,
  };

  const built = buildIndex({
    ignoredPaths: options.ignoredPaths,
    repoRoot,
    roots: options.roots,
  });
  const diagnosticsResult = publishJson(diagnosticsPath, built.diagnostics);

  if (built.stats.malformedDocuments > 0 && !options.allowMalformed) {
    return {
      counts: built.diagnostics.counts,
      diagnosticsBytes: diagnosticsResult.bytes,
      durationMs: elapsedMs(started),
      indexBytes: 0,
      indexSha256: '',
      manifestBytes: 0,
      manifestHash: String(built.manifest.manifestHash),
      paths: artifactPaths,
      published: false,
      stats: built.stats,
      variantsBytes: 0,
    };
  }

  const expected = {
    manifestHash: String(built.index.manifestHash),
    pathCount: built.index.paths.length,
    phraseCount: Object.keys(built.index.phrases).length,
  };
  const indexResult = publishJson(indexPath, built.index, (parsed) => validateIndex(parsed, expected));
  const manifestResult = publishJson(manifestPath, built.manifest);
  const variantsResult = publishJson(variantsPath, built.variants);

  return {
    counts: built.diagnostics.counts,
    diagnosticsBytes: diagnosticsResult.bytes,
    durationMs: elapsedMs(started),
    indexBytes: indexResult.bytes,
    indexSha256: indexResult.sha256,
    manifestBytes: manifestResult.bytes,
    manifestHash: expected.manifestHash,
    paths: artifactPaths,
    published: true,
    stats: built.stats,
    variantsBytes: variantsResult.bytes,
  };
}

/**
 * Rejects an artifact that parsed but does not describe the corpus just walked.
 *
 * @param {unknown} parsed Artifact read back from the temporary file.
 * @param {{ manifestHash: string, pathCount: number, phraseCount: number }} expected Build facts.
 * @returns {void}
 */
function validateIndex(parsed, expected) {
  const { paths, phrases } = assertTriggerIndexShape(parsed);
  const candidate = /** @type {Record<string, unknown>} */ (parsed);

  if (candidate.manifestHash !== expected.manifestHash) {
    throw new Error('index manifestHash does not match the corpus just walked');
  }
  if (paths.length !== expected.pathCount) {
    throw new Error('index path count changed between build and read-back');
  }
  if (Object.keys(phrases).length !== expected.phraseCount) {
    throw new Error('index phrase count changed between build and read-back');
  }
}

/**
 * @param {bigint} started High-resolution start reading.
 * @returns {number} Elapsed milliseconds, rounded to three decimals.
 */
function elapsedMs(started) {
  return Number(process.hrtime.bigint() - started) / 1e6;
}

// ───────────────────────────────────────────────────────────────
// 4. CLI
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
      case '--allow-malformed':
      case '--json':
      case '--quiet':
        flags[arg.slice(2)] = true;
        break;
      case '--repo-root':
      case '--out':
      case '--manifest':
      case '--diagnostics':
      case '--variants': {
        const value = argv[i + 1];
        if (value === undefined || value.startsWith('--')) {
          throw new Error(`${arg} requires a path`);
        }
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
 * @returns {number} Process exit code.
 */
function main() {
  let flags;
  try {
    flags = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 2;
  }

  const report = generate({
    allowMalformed: Boolean(flags['allow-malformed']),
    diagnosticsPath: typeof flags.diagnostics === 'string' ? flags.diagnostics : undefined,
    indexPath: typeof flags.out === 'string' ? flags.out : undefined,
    manifestPath: typeof flags.manifest === 'string' ? flags.manifest : undefined,
    repoRoot: typeof flags['repo-root'] === 'string' ? flags['repo-root'] : undefined,
    variantsPath: typeof flags.variants === 'string' ? flags.variants : undefined,
  });

  if (flags.json) {
    process.stdout.write(`${stableStringify(report)}\n`);
  } else if (!flags.quiet) {
    process.stdout.write(formatReport(report));
  }

  return report.published ? 0 : 1;
}

/**
 * @param {ReturnType<typeof generate>} report Publication report.
 * @returns {string} Human-readable summary.
 */
function formatReport(report) {
  const lines = [
    report.published ? 'trigger index published' : 'trigger index NOT published (malformed corpus)',
    `  documents scanned : ${report.stats.documentsScanned}`,
    `  unique phrases    : ${report.stats.uniquePhrases}`,
    `  phrase decls      : ${report.stats.phraseDeclarations}`,
    `  indexed paths     : ${report.stats.indexedPaths}`,
    `  corpus bytes      : ${report.stats.corpusBytes}`,
    `  index bytes       : ${report.indexBytes}`,
    `  variants bytes    : ${report.variantsBytes}`,
    `  index sha256      : ${report.indexSha256 || '(not published)'}`,
    `  manifest hash     : ${report.manifestHash}`,
    `  ignored malformed : ${report.stats.ignoredMalformedDocuments}`,
    `  duration ms       : ${report.durationMs.toFixed(1)}`,
    '  diagnostics:',
  ];
  for (const [category, count] of Object.entries(report.counts)) {
    lines.push(`    ${category.padEnd(24)} ${count}`);
  }
  if (!report.published) {
    lines.push(`  refused: ${report.stats.malformedDocuments} document(s) carry an untrusted trigger declaration`);
    lines.push(`  rows written to ${report.paths.diagnostics}`);
  }
  return `${lines.join('\n')}\n`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main();
}
