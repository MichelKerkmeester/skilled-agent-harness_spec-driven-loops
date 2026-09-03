#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// SCRIPT: Three-Arm Retrieval Parity Harness
// ───────────────────────────────────────────────────────────────
// Runs one frozen prompt set through three retrieval arms and reports the
// differences in both directions:
//
//   legacy  the substring trigger lane replayed straight against the sqlite
//           index, read-only and with no daemon in the path
//   index   the committed trigger index through the shipped lookup library
//   rg      the documented ripgrep recipes plus the caller-side rank tuple
//
// The two lexical arms were built from different checkouts, so the comparison
// runs over the paths present in both the database and the corpus manifest.
// Everything outside that intersection is counted and named rather than
// quietly folded into a difference.
//
// A difference is only ever "explained" when a mechanism was verified for that
// exact path — the legacy pre-scoring window cut it, the index result window
// cut it, the two corpora disagree about the document, the path sits under an
// excluded tree, or it is not Markdown. Anything else is unexplained and fails
// the run. Missing results alone are not the gate; both directions are.
//
// Semantic paraphrase rows never count toward the lexical verdict. They are
// recorded separately as boundary evidence, because the lane being replaced is
// a substring match and reporting paraphrase recall as parity would misstate
// what was lost.
//
// Usage:
//   node parity-check.mjs --db <sqlite path> [--json] [--limit <n>]
//                         [--prompt-set <path>] [--index <path>]
//                         [--manifest <path>] [--repo-root <path>]
//
// Exit codes: 0 = every case passed, 1 = at least one case failed, 2 = the run
// could not be made (bad invocation, unreadable input, ripgrep fault).
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { publishJson, sha256 } from './lib/artifact.mjs';
import {
  legacySearch,
  openLegacyDatabase,
} from './lib/legacy-lane.mjs';
import { compareCodeUnits, normalizeTriggerText, queryTokens } from './lib/normalize.mjs';
import {
  countRecipe,
  DEFAULT_ROOTS,
  parseJsonLines,
  pathOnlyRecipe,
  rankMatches,
  RIPGREP_BIN_ENV,
  ripgrepVersion,
  runRecipe,
  structuredCappedRecipe,
  structuredRecipe,
} from './lib/rg-lane.mjs';
import { loadIndex, lookup } from './lookup-trigger-index.mjs';

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.resolve(SCRIPT_DIR, '..', '..');
const REPO_ROOT = path.resolve(SKILL_DIR, '..', '..', '..');
const FIXTURE_DIR = path.join(SCRIPT_DIR, 'fixtures');

const DEFAULT_PROMPT_SET = path.join(FIXTURE_DIR, 'prompt-set.json');
const DEFAULT_MANIFEST = path.join(FIXTURE_DIR, 'corpus-manifest.json');
const DEFAULT_INDEX = path.join(SKILL_DIR, 'data', 'trigger-index.json');
const LOOKUP_CLI = path.join(SCRIPT_DIR, 'lookup-trigger-index.mjs');

const TRIGGER_GOLDENS = path.join(SKILL_DIR, 'mcp-server', 'tests', 'fixtures', 'trigger-goldens.json');
const GOLDEN_QUERIES = path.join(SKILL_DIR, 'mcp-server', 'tests', 'fixtures', 'golden-queries.json');

/** Result cap both lexical arms are compared at. */
const DEFAULT_LIMIT = 20;

/** Ranked ripgrep rows recorded per invocation; the full counts are kept alongside. */
const RG_SAMPLE_LIMIT = 5;

/** Scores are recorded at this precision so a float tail cannot make two equal runs differ. */
const SCORE_PRECISION = 6;

/** Stdout kept per recipe execution record. */
const RECIPE_SAMPLE_LINES = 3;

/**
 * How a difference between the two lexical arms may be accounted for. A path
 * that matches none of these is unexplained and fails the run.
 */
export const DIVERGENCE_MECHANISMS = Object.freeze({
  CORPUS_DRIFT: 'corpus-drift',
  EXCLUDED_TREE: 'excluded-tree',
  INDEX_RESULT_WINDOW: 'index-result-window',
  LEGACY_CANDIDATE_WINDOW: 'legacy-candidate-window',
  NON_MARKDOWN: 'non-markdown-row',
});

/** Trees the index corpus never walks. */
const EXCLUDED_SEGMENTS = Object.freeze(['z_archive', 'node_modules', 'scratch']);

// ───────────────────────────────────────────────────────────────
// 2. PATH POLICY
// ───────────────────────────────────────────────────────────────

/**
 * Folds a stored database path onto the repo-relative form the index uses. The
 * database was written from a different checkout, so the absolute prefix is
 * stripped by pattern rather than by comparing against this working tree.
 *
 * @param {string} storedPath Value of the file_path column.
 * @returns {string} Repo-relative POSIX path.
 */
export function canonicalDatabasePath(storedPath) {
  let value = String(storedPath ?? '').replace(/\\/g, '/');
  const marker = value.lastIndexOf('/specs/');
  if (value.startsWith('/') && marker !== -1) {
    value = value.slice(marker + 1);
  } else {
    const skillMarker = value.lastIndexOf('/.opencode/');
    if (value.startsWith('/') && skillMarker !== -1) value = value.slice(skillMarker + 1);
  }
  if (value.startsWith('.opencode/specs/')) value = `specs/${value.slice('.opencode/specs/'.length)}`;
  return value.replace(/^\.\//, '');
}

/**
 * The database stores the spec folder without the corpus root that the index
 * carries in every path, so the two scope arguments are the same string with
 * and without that prefix.
 *
 * @param {string | null} specFolder Repo-relative folder, or null.
 * @returns {string | null} Folder as the database stores it.
 */
export function legacySpecFolder(specFolder) {
  if (typeof specFolder !== 'string' || specFolder.length === 0) return null;
  return specFolder.startsWith('specs/') ? specFolder.slice('specs/'.length) : specFolder;
}

/**
 * @param {string} documentPath Repo-relative path.
 * @returns {boolean} True when the path sits under a tree the index excludes.
 */
export function isExcludedTree(documentPath) {
  return documentPath.split('/').some((segment) => EXCLUDED_SEGMENTS.includes(segment));
}

// ───────────────────────────────────────────────────────────────
// 3. CORPUS INTERSECTION
// ───────────────────────────────────────────────────────────────

/**
 * Builds the comparable path set and the per-path phrase sets both arms are
 * judged against.
 *
 * @param {import('better-sqlite3').Database} db Open read-only handle.
 * @param {{ includedPaths: string[] }} manifest Frozen corpus manifest.
 * @param {{ paths: string[], phrases: Record<string, number[]> }} index Loaded artifact.
 * @returns {{
 *   comparable: Set<string>,
 *   databasePhrases: Map<string, Set<string>>,
 *   indexPhrases: Map<string, Set<string>>,
 *   stats: Record<string, number>
 * }} Intersection and its receipts.
 */
export function buildIntersection(db, manifest, index) {
  const included = new Set(manifest.includedPaths);
  const rows = db.prepare(`
      SELECT m.file_path, m.trigger_phrases
      FROM memory_index m
      WHERE m.trigger_phrases IS NOT NULL
        AND m.trigger_phrases != ''
        AND m.trigger_phrases != '[]'
        AND m.deleted_at IS NULL
    `).all();

  /** @type {Map<string, Set<string>>} */
  const databasePhrases = new Map();
  for (const row of rows) {
    const documentPath = canonicalDatabasePath(row.file_path);
    let phrases = databasePhrases.get(documentPath);
    if (!phrases) {
      phrases = new Set();
      databasePhrases.set(documentPath, phrases);
    }
    let parsed = [];
    try {
      const value = JSON.parse(String(row.trigger_phrases));
      if (Array.isArray(value)) parsed = value;
    } catch {
      parsed = [];
    }
    for (const phrase of parsed) {
      const normalized = normalizeTriggerText(phrase);
      if (normalized) phrases.add(normalized);
    }
  }

  /** @type {Map<string, Set<string>>} */
  const indexPhrases = new Map();
  for (const [phrase, posting] of Object.entries(index.phrases)) {
    for (const pathId of posting) {
      const documentPath = index.paths[pathId];
      if (documentPath === undefined) continue;
      let phrases = indexPhrases.get(documentPath);
      if (!phrases) {
        phrases = new Set();
        indexPhrases.set(documentPath, phrases);
      }
      phrases.add(phrase);
    }
  }

  const comparable = new Set();
  for (const documentPath of databasePhrases.keys()) {
    if (included.has(documentPath) && indexPhrases.has(documentPath)) comparable.add(documentPath);
  }

  let databaseInManifest = 0;
  for (const documentPath of databasePhrases.keys()) {
    if (included.has(documentPath)) databaseInManifest += 1;
  }
  let indexInDatabase = 0;
  for (const documentPath of indexPhrases.keys()) {
    if (databasePhrases.has(documentPath)) indexInDatabase += 1;
  }

  // A lifecycle filter that matches nothing proves nothing, so the counts the
  // expiry and tier clauses actually act on are recorded next to the verdict.
  const lifecycle = db.prepare(`
      SELECT
        SUM(CASE WHEN expires_at IS NOT NULL AND expires_at <= datetime('now') THEN 1 ELSE 0 END) AS expired,
        SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) AS deleted,
        SUM(CASE WHEN lower(importance_tier) IN ('archived','deprecated') THEN 1 ELSE 0 END) AS cold
      FROM memory_index
    `).get();

  return {
    comparable,
    databasePhrases,
    indexPhrases,
    stats: {
      coldTierRows: Number(lifecycle?.cold ?? 0),
      comparablePaths: comparable.size,
      deletedRows: Number(lifecycle?.deleted ?? 0),
      expiredRows: Number(lifecycle?.expired ?? 0),
      databaseInManifest,
      databaseOutsideManifest: databasePhrases.size - databaseInManifest,
      databasePathsWithPhrases: databasePhrases.size,
      databaseRowsWithPhrases: rows.length,
      indexOutsideDatabase: indexPhrases.size - indexInDatabase,
      indexOwningPaths: indexPhrases.size,
      manifestIncludedPaths: included.size,
      manifestOutsideDatabase: included.size - databaseInManifest,
    },
  };
}

// ───────────────────────────────────────────────────────────────
// 4. ARMS
// ───────────────────────────────────────────────────────────────

/**
 * @param {number} value Raw score.
 * @returns {number} Score at the recorded precision.
 */
function round(value) {
  return Number(value.toFixed(SCORE_PRECISION));
}

/**
 * Runs the legacy arm, keeping both the shipped windowed result and an
 * unwindowed scoring pass. The second one is what makes "the candidate window
 * cut this path" a checked statement rather than an assumption.
 *
 * @param {import('better-sqlite3').Database} db Open handle.
 * @param {Record<string, unknown>} testCase Frozen case.
 * @param {{ limit: number, nowMs: number }} options Run options.
 * @returns {Record<string, unknown>} Arm record plus its diagnostic sets.
 */
function runLegacyArm(db, testCase, options) {
  const specFolder = legacySpecFolder(testCase.specFolder ?? null);
  const shared = { limit: options.limit, nowMs: options.nowMs, specFolder };
  const windowed = legacySearch(db, testCase.query, shared);
  const unwindowed = legacySearch(db, testCase.query, { ...shared, windowed: false });

  /** @type {Map<string, { matchClass: string, score: number }>} */
  const unwindowedByPath = new Map();
  for (const row of unwindowed.results) {
    const documentPath = canonicalDatabasePath(row.path);
    const current = unwindowedByPath.get(documentPath);
    if (!current || row.score > current.score) {
      unwindowedByPath.set(documentPath, { matchClass: row.matchClass, score: row.score });
    }
  }

  return {
    candidateLimit: windowed.candidateLimit,
    candidateRowCount: windowed.candidateRowCount,
    normalizedQuery: windowed.normalizedQuery,
    rows: windowed.results.map((row) => ({
      importanceTier: row.importanceTier,
      matchClass: row.matchClass,
      matchScore: round(row.matchScore),
      path: canonicalDatabasePath(row.path),
      score: round(row.score),
    })),
    saturated: windowed.saturated,
    sql: windowed.sql,
    tokens: windowed.tokens,
    unwindowedByPath,
    unwindowedScoredPaths: unwindowedByPath.size,
  };
}

/**
 * Runs the index arm at no limit, so the result window can be applied after
 * the comparison filter instead of before it.
 *
 * The lookup library labels a candidate the substring gate admits but the score
 * function rejects as `partial` at score zero, and returns it. The lane being
 * compared drops that same candidate outright once it scores zero, so the
 * scoring candidates are what the two arms have in common and zero-score rows
 * are held back as a separate count rather than compared against nothing.
 *
 * @param {ReturnType<typeof loadIndex>} loaded Loaded artifact.
 * @param {Record<string, unknown>} testCase Frozen case.
 * @returns {Record<string, unknown>} Arm record plus its diagnostic sets.
 */
function runIndexArm(loaded, testCase) {
  const answer = lookup(loaded, testCase.query, {
    limit: 0,
    specFolder: testCase.specFolder ?? null,
  });

  const scoring = answer.results.filter((row) => row.score > 0);

  return {
    candidatePhraseCount: answer.candidatePhraseCount,
    discardedTokens: answer.discardedTokens,
    normalizedQuery: answer.normalizedQuery,
    orderedPaths: scoring.map((row) => row.path),
    returnedPathCount: answer.results.length,
    scoredPathCount: scoring.length,
    tokens: answer.tokens,
    zeroScorePathCount: answer.results.length - scoring.length,
  };
}

/**
 * Runs the documented structured recipe for the normalized phrase and for each
 * effective query token, then ranks every parsed match with the caller-side
 * tuple. A recipe that exits at the error floor aborts the run: reporting an
 * execution fault as a clean miss is the failure this mapping exists to stop.
 *
 * @param {Record<string, unknown>} testCase Frozen case.
 * @param {{ repoRoot: string, roots: string[] }} options Run options.
 * @returns {Record<string, unknown>} Arm record.
 */
function runRipgrepArm(testCase, options) {
  const normalizedQuery = normalizeTriggerText(testCase.query);
  const { tokens } = queryTokens(testCase.query);
  const roots = testCase.specFolder ? [testCase.specFolder] : options.roots;
  const probes = [{ kind: 'normalized-phrase', pattern: normalizedQuery, recipe: 'structured-jsonl' }];
  for (const token of tokens) {
    probes.push({ kind: 'token', pattern: token, recipe: 'structured-jsonl-max-count-1' });
  }

  const invocations = [];
  for (const probe of probes) {
    if (probe.pattern.length === 0) continue;
    const argv = probe.recipe === 'structured-jsonl'
      ? structuredRecipe(probe.pattern, roots)
      : structuredCappedRecipe(probe.pattern, roots);
    const execution = runRecipe(argv, { cwd: options.repoRoot });
    if (execution.outcome === 'error') {
      throw new Error(`ripgrep exited ${execution.exitCode} for ${execution.command}: ${execution.stderr.trim()}`
        + ` (set ${RIPGREP_BIN_ENV} when ripgrep is not a binary on PATH)`);
    }
    const parsed = parseJsonLines(execution.stdout);
    const ranked = rankMatches(parsed.matches, {
      cwd: options.repoRoot,
      normalizedQuery: probe.pattern,
    });
    invocations.push({
      command: execution.command,
      exitCode: execution.exitCode,
      kind: probe.kind,
      matchRecordCount: parsed.matches.length,
      matchedPathCount: new Set(parsed.matches.map((match) => match.path)).size,
      outcome: execution.outcome,
      pattern: probe.pattern,
      recipe: probe.recipe,
      rankedSample: ranked.slice(0, RG_SAMPLE_LIMIT).map((row) => ({
        evidenceField: row.evidenceField,
        line: row.line,
        matchClass: row.matchClass,
        path: row.path,
      })),
      unparsedLines: parsed.unparsedLines,
    });
  }

  return {
    invocations,
    roots,
    totalMatchRecords: invocations.reduce((sum, row) => sum + row.matchRecordCount, 0),
  };
}

// ───────────────────────────────────────────────────────────────
// 5. DIVERGENCE CLASSIFICATION
// ───────────────────────────────────────────────────────────────

/**
 * Names the mechanism that accounts for one path being absent from one arm, or
 * returns null when nothing accounts for it. `missingFrom` is the arm that does
 * not carry the path, so the check runs against that arm's own cut.
 *
 * @param {{
 *   documentPath: string,
 *   indexArm: Record<string, any>,
 *   intersection: ReturnType<typeof buildIntersection>,
 *   legacyArm: Record<string, any>,
 *   limit: number,
 *   missingFrom: 'legacy' | 'index'
 * }} input Classification input.
 * @returns {{ evidence: string, mechanism: string } | null} Verified mechanism.
 */
export function classifyDivergence(input) {
  const { documentPath, indexArm, intersection, legacyArm, limit, missingFrom } = input;

  if (isExcludedTree(documentPath)) {
    return {
      evidence: 'path sits under a tree the index corpus never walks',
      mechanism: DIVERGENCE_MECHANISMS.EXCLUDED_TREE,
    };
  }
  if (!documentPath.endsWith('.md')) {
    return {
      evidence: 'index corpus is Markdown only',
      mechanism: DIVERGENCE_MECHANISMS.NON_MARKDOWN,
    };
  }

  const databasePhrases = intersection.databasePhrases.get(documentPath) ?? new Set();
  const indexPhrases = intersection.indexPhrases.get(documentPath) ?? new Set();

  if (missingFrom === 'legacy') {
    const scored = legacyArm.unwindowedByPath.get(documentPath);
    if (scored) {
      return {
        evidence: `legacy scores this path at ${round(scored.score)} without the pre-scoring limit of ${legacyArm.candidateLimit}, and read ${legacyArm.candidateRowCount} rows with it`,
        mechanism: DIVERGENCE_MECHANISMS.LEGACY_CANDIDATE_WINDOW,
      };
    }
    const missing = [...indexPhrases].filter((phrase) => !databasePhrases.has(phrase));
    if (missing.length > 0) {
      return {
        evidence: `index carries ${missing.length} phrase(s) the database row does not: ${sample(missing)}`,
        mechanism: DIVERGENCE_MECHANISMS.CORPUS_DRIFT,
      };
    }
    return null;
  }

  const position = indexArm.orderedPaths.indexOf(documentPath);
  if (position >= limit) {
    return {
      evidence: `index ranks this path at position ${position} of ${indexArm.orderedPaths.length} scoring paths, below the result limit of ${limit}`,
      mechanism: DIVERGENCE_MECHANISMS.INDEX_RESULT_WINDOW,
    };
  }
  const missing = [...databasePhrases].filter((phrase) => !indexPhrases.has(phrase));
  if (missing.length > 0) {
    return {
      evidence: `database row carries ${missing.length} phrase(s) the index does not: ${sample(missing)}`,
      mechanism: DIVERGENCE_MECHANISMS.CORPUS_DRIFT,
    };
  }
  return null;
}

/**
 * @param {string[]} values Phrase list.
 * @returns {string} Bounded, sorted rendering.
 */
function sample(values) {
  return values.sort(compareCodeUnits).slice(0, 3).map((value) => JSON.stringify(value)).join(', ');
}

// ───────────────────────────────────────────────────────────────
// 6. CASE EXECUTION
// ───────────────────────────────────────────────────────────────

/**
 * Runs one frozen case across all three arms and decides its verdict.
 *
 * @param {{
 *   db: import('better-sqlite3').Database,
 *   intersection: ReturnType<typeof buildIntersection>,
 *   limit: number,
 *   loaded: ReturnType<typeof loadIndex>,
 *   nowMs: number,
 *   repoRoot: string,
 *   roots?: string[],
 *   testCase: Record<string, any>
 * }} input Case input. `roots` names the ripgrep search roots, which a corpus
 *   outside this repository has to supply because the shipped default does not
 *   exist there.
 * @returns {Record<string, unknown>} Case record.
 */
export function runCase(input) {
  const { db, intersection, limit, loaded, nowMs, repoRoot, testCase } = input;

  const legacyArm = runLegacyArm(db, testCase, { limit, nowMs });
  const indexArm = runIndexArm(loaded, testCase);
  const ripgrepArm = runRipgrepArm(testCase, { repoRoot, roots: input.roots ?? DEFAULT_ROOTS });

  const legacyOutside = [];
  const legacyCompared = [];
  for (const row of legacyArm.rows) {
    if (intersection.comparable.has(row.path)) legacyCompared.push(row);
    else legacyOutside.push({ path: row.path, reason: outsideReason(row.path, intersection) });
  }

  const indexOutside = [];
  const indexCompared = [];
  for (const documentPath of indexArm.orderedPaths) {
    if (intersection.comparable.has(documentPath)) {
      if (indexCompared.length < limit) indexCompared.push(documentPath);
    } else if (indexOutside.length < limit) {
      indexOutside.push({ path: documentPath, reason: outsideReason(documentPath, intersection) });
    }
  }

  const legacySet = new Set(legacyCompared.map((row) => row.path));
  const indexSet = new Set(indexCompared);

  const explain = (documentPath, missingFrom) => classifyDivergence({
    documentPath, indexArm, intersection, legacyArm, limit, missingFrom,
  }) ?? { evidence: 'no mechanism accounts for this path', mechanism: null };

  const divergences = [];
  for (const documentPath of [...legacySet].filter((value) => !indexSet.has(value)).sort(compareCodeUnits)) {
    divergences.push({ direction: 'legacyOnly', path: documentPath, ...explain(documentPath, 'index') });
  }
  for (const documentPath of [...indexSet].filter((value) => !legacySet.has(value)).sort(compareCodeUnits)) {
    divergences.push({ direction: 'indexOnly', path: documentPath, ...explain(documentPath, 'legacy') });
  }

  // A frozen case names the documents that declare its phrase. Losing one is a
  // recall failure in that arm, so it is explained by the same mechanisms or it
  // is not explained at all.
  const expectedPaths = Array.isArray(testCase.expectedPaths) ? testCase.expectedPaths : [];
  const expectedMisses = [];
  for (const documentPath of expectedPaths) {
    if (!legacySet.has(documentPath)) {
      expectedMisses.push({ missingFrom: 'legacy', path: documentPath, ...explain(documentPath, 'legacy') });
    }
    if (!indexSet.has(documentPath)) {
      expectedMisses.push({ missingFrom: 'index', path: documentPath, ...explain(documentPath, 'index') });
    }
  }

  const unexplained = divergences.filter((row) => row.mechanism === null).length
    + expectedMisses.filter((row) => row.mechanism === null).length;

  const declared = new Set((testCase.allowedDivergence ?? []).map((row) => row.mechanism));
  const undeclaredMechanisms = [...new Set([...divergences, ...expectedMisses]
    .map((row) => row.mechanism)
    .filter((mechanism) => mechanism !== null && !declared.has(mechanism)))].sort(compareCodeUnits);

  const verdict = unexplained === 0 ? 'PASS' : 'FAIL';

  return {
    class: testCase.class,
    divergences,
    expectedBehaviour: testCase.expectedBehaviour,
    expectedMisses,
    expectedPaths,
    id: testCase.id,
    index: {
      candidatePhraseCount: indexArm.candidatePhraseCount,
      comparedPaths: indexCompared,
      discardedTokens: indexArm.discardedTokens,
      normalizedQuery: indexArm.normalizedQuery,
      outsideIntersection: indexOutside,
      returnedPathCount: indexArm.returnedPathCount,
      scoredPathCount: indexArm.scoredPathCount,
      tokens: indexArm.tokens,
      zeroScorePathCount: indexArm.zeroScorePathCount,
    },
    legacy: {
      candidateLimit: legacyArm.candidateLimit,
      candidateRowCount: legacyArm.candidateRowCount,
      comparedRows: legacyCompared,
      normalizedQuery: legacyArm.normalizedQuery,
      outsideIntersection: legacyOutside,
      saturated: legacyArm.saturated,
      tokens: legacyArm.tokens,
      unwindowedScoredPaths: legacyArm.unwindowedScoredPaths,
    },
    query: testCase.query,
    ripgrep: ripgrepArm,
    specFolder: testCase.specFolder ?? null,
    undeclaredMechanisms,
    unexplainedCount: unexplained,
    verdict,
  };
}

/**
 * @param {string} documentPath Repo-relative path.
 * @param {ReturnType<typeof buildIntersection>} intersection Corpus intersection.
 * @returns {string} Why the path is outside the comparison set.
 */
function outsideReason(documentPath, intersection) {
  if (isExcludedTree(documentPath)) return 'excluded-tree';
  if (!documentPath.endsWith('.md')) return 'non-markdown-row';
  if (!intersection.indexPhrases.has(documentPath)) return 'absent-from-index-corpus';
  if (!intersection.databasePhrases.has(documentPath)) return 'absent-from-database';
  return 'absent-from-manifest';
}

// ───────────────────────────────────────────────────────────────
// 7. BOUNDARY PROBES
// ───────────────────────────────────────────────────────────────

/**
 * Runs the paraphrase and stemming fixtures through the index arm. These rows
 * describe what a lexical replacement cannot do; they are labelled and kept out
 * of the lexical verdict entirely.
 *
 * @param {ReturnType<typeof loadIndex>} loaded Loaded artifact.
 * @param {number} limit Result cap.
 * @returns {Record<string, unknown>} Probe report.
 */
export function runSemanticProbes(loaded, limit) {
  const goldens = JSON.parse(fs.readFileSync(TRIGGER_GOLDENS, 'utf8'));
  const queries = JSON.parse(fs.readFileSync(GOLDEN_QUERIES, 'utf8'));

  const paraphraseRows = [];
  for (const testCase of goldens.cases) {
    for (const variant of ['exact', 'paraphrase', 'distractor']) {
      const query = testCase.variants?.[variant];
      if (typeof query !== 'string') continue;
      paraphraseRows.push({
        ...probe(loaded, query, limit),
        caseId: testCase.id,
        label: 'semantic-trigger-shadow',
        locale: testCase.locale ?? null,
        triggerPhrase: testCase.triggerPhrase,
        variant,
      });
    }
  }

  const stemmingRows = [];
  for (const row of queries.queries) {
    if (row.class !== 'stemming') continue;
    stemmingRows.push({
      ...probe(loaded, row.query, limit),
      label: 'lexical-expansion-check',
      queryId: row.id,
    });
  }

  return {
    contract: 'boundary evidence only; never a lexical pass criterion',
    hitDefinitions: {
      returnedHit: 'the lookup returned at least one candidate, including the zero-score partial rows the replayed lane drops',
      scoringHit: 'at least one candidate scored above zero, which is what the replayed lane would have returned',
    },
    paraphrase: {
      rateByVariant: rateByVariant(paraphraseRows),
      rows: paraphraseRows,
      source: path.relative(REPO_ROOT, TRIGGER_GOLDENS),
    },
    stemming: {
      returnedHits: stemmingRows.filter((row) => row.returnedHit).length,
      rows: stemmingRows,
      scoringHits: stemmingRows.filter((row) => row.scoringHit).length,
      source: path.relative(REPO_ROOT, GOLDEN_QUERIES),
      total: stemmingRows.length,
    },
  };
}

/**
 * One boundary probe. Both hit definitions are reported because the substring
 * gate admits far more than the score function keeps, and a probe that counted
 * only the gate would read as recall the lane never had.
 *
 * @param {ReturnType<typeof loadIndex>} loaded Loaded artifact.
 * @param {string} query Probe text.
 * @param {number} limit Result cap.
 * @returns {Record<string, unknown>} Probe row.
 */
function probe(loaded, query, limit) {
  const answer = lookup(loaded, query, { limit });
  const scoring = answer.results.filter((row) => row.score > 0);
  return {
    normalizedQuery: answer.normalizedQuery,
    query,
    returnedCount: answer.results.length,
    returnedHit: answer.results.length > 0,
    scoringCount: scoring.length,
    scoringHit: scoring.length > 0,
    tokens: answer.tokens,
    topScoringPaths: scoring.slice(0, 3).map((row) => row.path),
  };
}

/**
 * @param {Array<{ returnedHit: boolean, scoringHit: boolean, variant: string }>} rows Probe rows.
 * @returns {Record<string, Record<string, number>>} Rates per variant.
 */
function rateByVariant(rows) {
  /** @type {Record<string, { returnedHits: number, returnedRate: number, scoringHits: number, scoringRate: number, total: number }>} */
  const summary = {};
  for (const row of rows) {
    const bucket = summary[row.variant]
      ?? { returnedHits: 0, returnedRate: 0, scoringHits: 0, scoringRate: 0, total: 0 };
    bucket.total += 1;
    if (row.returnedHit) bucket.returnedHits += 1;
    if (row.scoringHit) bucket.scoringHits += 1;
    summary[row.variant] = bucket;
  }
  for (const bucket of Object.values(summary)) {
    bucket.returnedRate = bucket.total === 0 ? 0 : Number((bucket.returnedHits / bucket.total).toFixed(4));
    bucket.scoringRate = bucket.total === 0 ? 0 : Number((bucket.scoringHits / bucket.total).toFixed(4));
  }
  return summary;
}

// ───────────────────────────────────────────────────────────────
// 8. RECIPE AND DAEMON RECORDS
// ───────────────────────────────────────────────────────────────

/**
 * Executes each documented recipe once against a phrase that hits, a phrase
 * that does not, and a search root that does not exist, so all three exit
 * classes are observed rather than asserted.
 *
 * @param {{ hitPhrase: string, missPhrase: string, repoRoot: string }} options Run options.
 * @returns {Record<string, unknown>} Execution record.
 */
export function runRecipeExecutions(options) {
  const missingRoot = 'no-such-search-root';
  const recipes = [
    { build: structuredRecipe, name: 'structured-jsonl' },
    { build: pathOnlyRecipe, name: 'path-only' },
    { build: countRecipe, name: 'count' },
  ];
  const inputs = [
    { name: 'real-phrase', pattern: options.hitPhrase, roots: DEFAULT_ROOTS },
    { name: 'no-hit-phrase', pattern: options.missPhrase, roots: DEFAULT_ROOTS },
    { name: 'nonexistent-root', pattern: options.hitPhrase, roots: [missingRoot] },
  ];

  const runs = [];
  for (const recipe of recipes) {
    for (const input of inputs) {
      const execution = runRecipe(recipe.build(input.pattern, input.roots), { cwd: options.repoRoot });
      runs.push({
        command: execution.command,
        exitCode: execution.exitCode,
        input: input.name,
        outcome: execution.outcome,
        pattern: input.pattern,
        recipe: recipe.name,
        stderrFirstLine: firstLines(execution.stderr, 1),
        stdoutFirstLines: firstLines(execution.stdout, RECIPE_SAMPLE_LINES),
      });
    }
  }

  return {
    exitMapping: { 0: 'match', 1: 'no-match', '2+': 'execution or configuration error' },
    ripgrepVersion: ripgrepVersion(),
    runs,
    source: '.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md',
  };
}

/**
 * Records whether the retired daemon is present and runs the lookup command
 * line regardless. The point is that the lookup path does not consult it: a
 * running process is recorded as an observation, never as a dependency.
 *
 * @param {{ prompts: string[], repoRoot: string }} options Run options.
 * @returns {Record<string, unknown>} Proof record.
 */
export function runDaemonProof(options) {
  const probes = [
    { argv: ['-fl', 'system-spec-memory'], name: 'system-spec-memory' },
    { argv: ['-fl', 'context-server'], name: 'context-server' },
  ];

  const processProbes = probes.map((probe) => {
    const run = spawnSync('pgrep', probe.argv, { encoding: 'utf8' });
    const exitCode = run.status ?? 2;
    return {
      command: `pgrep ${probe.argv.join(' ')}`,
      exitCode,
      matchCount: run.stdout ? run.stdout.trim().split('\n').filter(Boolean).length : 0,
      name: probe.name,
      running: exitCode === 0,
    };
  });

  const lookups = options.prompts.map((prompt) => {
    const run = spawnSync('node', [LOOKUP_CLI, '--json', '--no-index-hash', '--', prompt], {
      cwd: options.repoRoot,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
    let resultCount = null;
    try {
      resultCount = JSON.parse(run.stdout).results.length;
    } catch {
      resultCount = null;
    }
    return {
      command: `node ${path.relative(options.repoRoot, LOOKUP_CLI)} --json --no-index-hash -- ${JSON.stringify(prompt)}`,
      exitCode: run.status ?? 2,
      prompt,
      resultCount,
    };
  });

  return {
    contract: 'the lookup path reads a committed file; a running daemon is recorded, never consulted',
    lookups,
    processProbes,
  };
}

/**
 * @param {string} text Raw stream.
 * @param {number} count Lines to keep.
 * @returns {string[]} Bounded lines.
 */
function firstLines(text, count) {
  return String(text ?? '').split('\n').filter((line) => line.length > 0).slice(0, count);
}

// ───────────────────────────────────────────────────────────────
// 9. CLI
// ───────────────────────────────────────────────────────────────

/**
 * @param {string[]} argv Arguments after the script name.
 * @returns {Record<string, any>} Parsed invocation.
 */
function parseArgs(argv) {
  const parsed = {
    databasePath: null,
    indexPath: DEFAULT_INDEX,
    json: false,
    limit: DEFAULT_LIMIT,
    manifestPath: DEFAULT_MANIFEST,
    promptSetPath: DEFAULT_PROMPT_SET,
    repoRoot: REPO_ROOT,
  };
  const valued = {
    '--db': 'databasePath',
    '--index': 'indexPath',
    '--manifest': 'manifestPath',
    '--prompt-set': 'promptSetPath',
    '--repo-root': 'repoRoot',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') { parsed.json = true; continue; }
    if (arg === '--limit') {
      const value = Number.parseInt(argv[i + 1] ?? '', 10);
      if (!Number.isFinite(value) || value <= 0) throw new Error('--limit requires a positive integer');
      parsed.limit = value;
      i += 1;
      continue;
    }
    const key = valued[arg];
    if (key) {
      const value = argv[i + 1];
      if (value === undefined) throw new Error(`${arg} requires a value`);
      parsed[key] = path.resolve(value);
      i += 1;
      continue;
    }
    throw new Error(`unknown argument: ${arg}`);
  }

  if (!parsed.databasePath) throw new Error('--db <sqlite path> is required');
  return parsed;
}

/**
 * @param {Record<string, any>} baseline Completed baseline.
 * @returns {string} Human-readable summary.
 */
function formatSummary(baseline) {
  const lines = [
    `prompt set   : ${baseline.promptSetPath} (${baseline.totals.cases} cases, sha256 ${baseline.promptSetHash.slice(0, 12)})`,
    `manifest     : ${baseline.manifestHash.slice(0, 12)}  index ${baseline.indexHash.slice(0, 12)}`,
    `database     : ${baseline.databasePath} (${baseline.intersection.databaseRowsWithPhrases} rows with phrases)`,
    `intersection : ${baseline.intersection.comparablePaths} comparable paths`
      + ` | ${baseline.intersection.databaseOutsideManifest} database paths outside`
      + ` | ${baseline.intersection.manifestOutsideDatabase} manifest paths outside`,
    '',
    `${'class'.padEnd(30)} ${'lgc'.padStart(4)} ${'idx'.padStart(4)} ${'lOnly'.padStart(6)} ${'iOnly'.padStart(6)} ${'expl'.padStart(5)} verdict`,
  ];
  for (const row of baseline.cases) {
    const legacyOnly = row.divergences.filter((d) => d.direction === 'legacyOnly').length;
    const indexOnly = row.divergences.filter((d) => d.direction === 'indexOnly').length;
    const explained = row.divergences.filter((d) => d.mechanism !== null).length;
    lines.push(`${row.class.padEnd(30)} ${String(row.legacy.comparedRows.length).padStart(4)} ${String(row.index.comparedPaths.length).padStart(4)} ${String(legacyOnly).padStart(6)} ${String(indexOnly).padStart(6)} ${String(explained).padStart(5)} ${row.verdict}`);
  }
  lines.push(
    '',
    `unexplained  : ${baseline.totals.unexplained}`,
    `verdict      : ${baseline.totals.verdict}`,
  );
  return `${lines.join('\n')}\n`;
}

/**
 * @returns {number} Process exit code.
 */
function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 2;
  }

  const started = Date.now();
  let db;
  try {
    const promptSetText = fs.readFileSync(args.promptSetPath, 'utf8');
    const promptSet = JSON.parse(promptSetText);
    const promptSetHash = sha256(promptSetText);
    const manifest = JSON.parse(fs.readFileSync(args.manifestPath, 'utf8'));
    const loaded = loadIndex(args.indexPath);

    db = openLegacyDatabase(args.databasePath);
    const intersection = buildIntersection(db, manifest, loaded.index);

    // The recency boost reads a clock. Pinning it to the newest row in the
    // snapshot keeps the recency ordering the shipped lane produces while
    // making two replays of one snapshot byte-identical.
    const clockRow = db.prepare('SELECT MAX(COALESCE(updated_at, created_at)) AS newest FROM memory_index').get();
    const clockIso = String(clockRow?.newest ?? '');
    const nowMs = Date.parse(clockIso);
    if (!Number.isFinite(nowMs)) throw new Error('database has no usable timestamp to pin the recency clock to');

    const cases = promptSet.cases.map((testCase) => runCase({
      db, intersection, limit: args.limit, loaded, nowMs, repoRoot: args.repoRoot, testCase,
    }));

    const unexplained = cases.reduce((sum, row) => sum + row.unexplainedCount, 0);
    const failed = cases.filter((row) => row.verdict === 'FAIL').map((row) => row.id);

    const baseline = {
      cases,
      clock: {
        pinnedTo: clockIso,
        reason: 'newest COALESCE(updated_at, created_at) in the snapshot; the shipped lane reads the process clock here',
      },
      comparisonPolicy: [
        'each arm is restricted to the database and manifest intersection, then cut at the result limit',
        'the index arm is compared on its scoring candidates only, because the replayed lane drops a zero-score row while the lookup library labels it partial and returns it',
      ],
      databasePath: args.databasePath,
      durationMs: 0,
      indexHash: loaded.indexHash,
      intersection: intersection.stats,
      limit: args.limit,
      manifestHash: manifest.manifestHash,
      mechanisms: Object.values(DIVERGENCE_MECHANISMS).sort(compareCodeUnits),
      node: process.version,
      platform: `${process.platform}-${process.arch}`,
      promptSetHash,
      promptSetPath: path.relative(args.repoRoot, args.promptSetPath),
      ripgrepVersion: ripgrepVersion(),
      schemaVersion: loaded.schemaVersion,
      totals: {
        cases: cases.length,
        divergencesExplained: cases.reduce((sum, row) => sum + row.divergences.filter((d) => d.mechanism !== null).length, 0),
        expectedMisses: cases.reduce((sum, row) => sum + row.expectedMisses.length, 0),
        expectedPaths: cases.reduce((sum, row) => sum + row.expectedPaths.length, 0),
        failed,
        indexOnly: cases.reduce((sum, row) => sum + row.divergences.filter((d) => d.direction === 'indexOnly').length, 0),
        legacyOnly: cases.reduce((sum, row) => sum + row.divergences.filter((d) => d.direction === 'legacyOnly').length, 0),
        passed: cases.length - failed.length,
        unexplained,
        verdict: failed.length === 0 ? 'PASS' : 'FAIL',
      },
    };

    baseline.durationMs = Date.now() - started;
    publishJson(path.join(FIXTURE_DIR, 'parity-baseline.json'), baseline);
    publishJson(path.join(FIXTURE_DIR, 'semantic-probes.json'), {
      ...runSemanticProbes(loaded, args.limit),
      manifestHash: manifest.manifestHash,
      promptSetHash,
    });
    publishJson(path.join(FIXTURE_DIR, 'recipe-execution.json'), runRecipeExecutions({
      hitPhrase: promptSet.recipeProbe.hitPhrase,
      missPhrase: promptSet.recipeProbe.missPhrase,
      repoRoot: args.repoRoot,
    }));
    publishJson(path.join(FIXTURE_DIR, 'daemon-off-proof.json'), runDaemonProof({
      prompts: promptSet.daemonProbe.prompts,
      repoRoot: args.repoRoot,
    }));
    publishJson(args.manifestPath, { ...manifest, promptSetHash });

    process.stdout.write(args.json ? `${JSON.stringify(baseline, null, 2)}\n` : formatSummary(baseline));
    return failed.length === 0 ? 0 : 1;
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
    return 2;
  } finally {
    if (db) db.close();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main();
}
