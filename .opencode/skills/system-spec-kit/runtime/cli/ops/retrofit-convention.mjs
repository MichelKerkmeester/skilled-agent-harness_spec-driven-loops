#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Grep Convention Retrofit
// ───────────────────────────────────────────────────────────────────
// Applies the grep convention to the active spec corpus as an ordered pipeline:
// enumerate, dry-run, process, rescan. No stage begins before the previous
// stage's artifact is on disk, which is what makes a corpus-wide change
// reviewable one track at a time instead of as a single unreadable diff.
//
// Four decisions are load-bearing, and each exists because the obvious version
// of this tool is wrong in a way that still exits zero:
//
// 1. The manifest is frozen, not re-derived. Every stage after enumerate reads
//    the same file list and the same body hashes. A stage that re-walked the
//    tree would quietly widen its own scope whenever the working tree moved,
//    and the run would still look clean.
// 2. Classification fails closed. A document matching none of the eight
//    variants stops the run rather than falling through to skip, because a
//    silent default hands an unanticipated shape to a handler written for a
//    different one.
// 3. Writes are per-file atomic and preimage-checked before the rename. The
//    body hash is recomputed on the candidate text, and the rename happens only
//    if it still matches; a failure leaves the original file untouched.
// 4. Every changed line is bucketed as frontmatter, whole-line anchor marker,
//    or other. "No body was rewritten" is then a count of zero rather than a
//    reviewer's impression of a diff nobody can read end to end.
//
// Usage:
//   node retrofit-convention.mjs enumerate       [options]
//   node retrofit-convention.mjs dry-run         [options]
//   node retrofit-convention.mjs process         [options]
//   node retrofit-convention.mjs rescan          [options]
//   node retrofit-convention.mjs verify-preimage [options]
//
// Options:
//   --root <dir>        Repository root. Defaults to the working directory.
//   --track <path>      Restrict to one track, as `specs/<track>`.
//   --out <dir>         Artifact directory.
//   --manifest <path>   Frozen manifest. Defaults to <out>/manifest.json.
//   --probe <phrase>    Phrase the baseline recipes are executed against.
//   --include-hidden    Walk dot-directories, which the recipes cannot reach.
//   --json              Emit the stage report instead of a summary.
//
// Checking idempotence means running enumerate and then process, not process
// twice. The manifest froze the bytes the first pass read, so a second process
// against that same manifest is expected to refuse every document the first
// pass wrote — that is the staleness guard firing, not a failed second pass.
// Re-enumerate first, and the second process writes nothing.
//
// Exit codes: 0 = clean, 1 = residue or mismatch, 2 = execution error.
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { publishJson, sha256, stableStringify } from '../retrieval/lib/artifact.mjs';
import { EXCLUDED_DIR_NAMES as CORPUS_EXCLUDED_DIR_NAMES, canonicalRelativePath } from '../retrieval/lib/corpus.mjs';
import {
  ALIAS_KEY,
  CANONICAL_TRIGGER_KEY,
  DIAGNOSTIC_CATEGORIES,
  EXCEPTION_CLASSES,
  MAX_PHRASE_LENGTH,
  MAX_TRIGGER_LIST_MEMBERS,
  SEVERITY,
  VARIANTS,
  bodyPreimage,
  classifyDiff,
  classifyVariant,
  declaredTriggerMembers,
  degradesFrontmatter,
  planDocument,
  renderUnifiedDiff,
} from '../retrieval/lib/grep-convention.mjs';
import { compareCodeUnits } from '../retrieval/lib/normalize.mjs';
import { ripgrepVersion } from '../retrieval/lib/rg-lane.mjs';
import { RECIPES, search } from '../retrieval/rg-wrapper.mjs';
import { findRepoRoot as resolveRepoRoot } from '../../hooks/lib/workspace/repo-root.mjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Report schema; bump when a consumer would have to change to read it. */
export const SCHEMA_VERSION = 1;

export const EXIT_CLEAN = 0;
export const EXIT_RESIDUE = 1;
export const EXIT_ERROR = 2;

/** The stages, in the order they must run. */
export const STAGES = Object.freeze(['enumerate', 'dry-run', 'process', 'rescan', 'verify-preimage']);

/** Corpus root. The convention governs spec documents; other trees keep their own contracts. */
export const SCOPE_ROOT = 'specs';

/**
 * Names the shared corpus policy prunes at any depth that this pipeline
 * deliberately does not prune, kept as a declared subtraction from that
 * policy rather than a second hand-written exclusion list. The corpus's other
 * exclusion — a `lineages` directory directly under a `research` parent — is
 * a compound name+parent rule with no counterpart in the flat set below, so
 * it needs no subtraction entry: this pipeline was never built to apply it,
 * for the same reason `scratch` is named here.
 *
 * @type {ReadonlyArray<{ name: string, reason: string }>}
 */
export const NOT_PRUNED_DELTA = Object.freeze([
  Object.freeze({
    name: 'scratch',
    reason: 'this pipeline retrofits every document under specs/, scratch drafts included, so a draft already '
      + 'carries the convention by the time it is promoted out of scratch',
  }),
  Object.freeze({
    name: '.git',
    reason: 'already unreachable through the hidden-directory rule in walkScope below, which prunes every '
      + 'dot-prefixed directory by default; repeating it here would prune nothing the walk does not already prune',
  }),
]);

/** Directory names pruned wherever they appear, matching the recipes' negative globs. */
export const EXCLUDED_DIR_NAMES = Object.freeze(
  new Set([...CORPUS_EXCLUDED_DIR_NAMES].filter((name) => !NOT_PRUNED_DELTA.some((entry) => entry.name === name))),
);

/** Artifact directory used when `--out` is absent: a temp directory, so a run never writes into a packet by default. */
const DEFAULT_OUT_DIR = path.join(os.tmpdir(), 'retrofit-convention');

/** Phrase the baseline recipes run against when `--probe` is absent. */
const DEFAULT_PROBE = 'grep convention';

/** Variants whose documented treatment is to skip and report. */
const SKIP_VARIANTS = Object.freeze(new Set([
  'malformed-or-unclosed', 'non-yaml', 'wrong-list-type', 'non-string-members', 'oversized',
]));

/** Variants a completed run must have cleared from the corpus. */
const RESOLVABLE_VARIANTS = Object.freeze(new Set(['missing', 'duplicate']));

/**
 * Skip buckets for documents the processor declined to write. They are kept
 * apart rather than merged because they need different follow-up: an unsafe
 * edit needs a parser-aware repair, while a partial canonical block needs an
 * author to write the scalars this tool must not invent.
 */
const REFUSAL_SKIPS = Object.freeze(['refused-unsafe-edit', 'refused-partial-canonical-block']);

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

// ───────────────────────────────────────────────────────────────────
// 2. SCOPE WALK
// ───────────────────────────────────────────────────────────────────

/**
 * Collects every in-scope document. The walk is sorted at each level and
 * deduped by resolved path, so a document reachable through a symlink is
 * enumerated once, under its own location, and two runs on one tree produce the
 * same list in the same order.
 *
 * Dot-directories are pruned by default. Ripgrep does not descend into them
 * without `--hidden`, so retrofitting one would edit a document the convention's
 * own recipes can never reach — usually a dated backup copy, whose rewrite is
 * exactly the diff noise the archive exclusion already declined to take on.
 *
 * @param {string} repoRoot Absolute repository root.
 * @param {{ includeHidden?: boolean, scopeRoot?: string }} [options] Walk options.
 * @returns {{ files: string[], skipped: Array<{ path: string, reason: string }> }} Sorted paths plus prunings.
 */
export function walkScope(repoRoot, options = {}) {
  const includeHidden = options.includeHidden ?? false;
  const scopeRoot = options.scopeRoot ?? SCOPE_ROOT;
  /** @type {Map<string, { canonical: string, isLink: boolean }>} */
  const byRealPath = new Map();
  /** @type {Array<{ path: string, reason: string }>} */
  const skipped = [];

  const absoluteRoot = path.join(repoRoot, scopeRoot);
  if (!fs.existsSync(absoluteRoot)) {
    return { files: [], skipped: [{ path: scopeRoot, reason: 'scope root does not exist' }] };
  }

  /**
   * @param {string} directory Absolute directory.
   * @returns {void}
   */
  const walk = (directory) => {
    let entries;
    try {
      entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch (error) {
      skipped.push({
        path: toRelative(repoRoot, directory),
        reason: `unreadable directory: ${error instanceof Error ? error.message : String(error)}`,
      });
      return;
    }

    entries.sort((a, b) => compareCodeUnits(a.name, b.name));

    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      const relative = toRelative(repoRoot, absolute);

      if (!includeHidden && entry.name.startsWith('.')) {
        if (entry.isDirectory() || entry.name.endsWith('.md')) {
          skipped.push({ path: relative, reason: 'hidden path the convention recipes cannot reach' });
        }
        continue;
      }

      if (entry.isSymbolicLink()) {
        let stats;
        try {
          stats = fs.statSync(absolute);
        } catch {
          skipped.push({ path: relative, reason: 'broken symlink' });
          continue;
        }
        if (stats.isDirectory()) {
          skipped.push({ path: relative, reason: 'symlinked directory' });
          continue;
        }
        if (stats.isFile() && entry.name.endsWith('.md')) record(absolute, relative, true);
        continue;
      }

      if (entry.isDirectory()) {
        if (EXCLUDED_DIR_NAMES.has(entry.name)) {
          skipped.push({ path: relative, reason: 'excluded directory' });
          continue;
        }
        walk(absolute);
        continue;
      }

      if (entry.isFile() && entry.name.endsWith('.md')) record(absolute, relative, false);
    }
  };

  /**
   * @param {string} absolute Absolute file path.
   * @param {string} relative Repo-relative path.
   * @param {boolean} isLink Whether this route is a symlink.
   * @returns {void}
   */
  const record = (absolute, relative, isLink) => {
    let realPath;
    try {
      realPath = fs.realpathSync(absolute);
    } catch {
      skipped.push({ path: relative, reason: 'unresolvable path' });
      return;
    }

    const canonical = canonicalRelativePath(relative);
    const existing = byRealPath.get(realPath);
    if (existing === undefined) {
      byRealPath.set(realPath, { canonical, isLink });
      return;
    }

    const incomingWins = (existing.isLink && !isLink)
      || (existing.isLink === isLink && compareCodeUnits(canonical, existing.canonical) < 0);
    if (incomingWins) {
      skipped.push({ path: existing.canonical, reason: 'duplicate of an already-enumerated document' });
      byRealPath.set(realPath, { canonical, isLink });
      return;
    }
    skipped.push({ path: relative, reason: 'duplicate of an already-enumerated document' });
  };

  walk(absoluteRoot);

  const files = Array.from(byRealPath.values(), (entry) => entry.canonical).sort(compareCodeUnits);
  skipped.sort((a, b) => compareCodeUnits(a.path, b.path) || compareCodeUnits(a.reason, b.reason));
  return { files, skipped };
}

/**
 * @param {string} repoRoot Absolute repository root.
 * @param {string} absolute Absolute path.
 * @returns {string} Repo-relative POSIX path.
 */
function toRelative(repoRoot, absolute) {
  return path.relative(repoRoot, absolute).split(path.sep).join('/');
}

/**
 * @param {string} relativePath Repo-relative document path.
 * @returns {string} Track segment, or the scope root when the path has none.
 */
export function trackOf(relativePath) {
  const segments = relativePath.split('/');
  return segments.length >= 2 ? `${segments[0]}/${segments[1]}` : segments[0];
}

// ───────────────────────────────────────────────────────────────────
// 3. ENUMERATE
// ───────────────────────────────────────────────────────────────────

/**
 * Freezes the in-scope manifest, classifies every document into exactly one
 * variant, captures the body preimage, and inventories the exception classes
 * the retrofit reports but does not decide on its own.
 *
 * @param {{
 *   includeHidden?: boolean, outDir: string, probe?: string, repoRoot: string, track?: string
 * }} options Stage options.
 * @returns {{ artifacts: Record<string, string>, report: Record<string, any> }} Stage result.
 */
export function enumerate(options) {
  const { repoRoot } = options;
  const walked = walkScope(repoRoot, { includeHidden: options.includeHidden });
  const files = options.track ? walked.files.filter((file) => file.startsWith(`${options.track}/`)) : walked.files;

  // A track that selects nothing is almost always a typo, and freezing an empty
  // manifest would hand every later stage a clean run over no documents.
  if (options.track && files.length === 0) {
    throw new Error(`track '${options.track}' selects no in-scope document`);
  }

  const variantCounts = Object.fromEntries(VARIANTS.map((variant) => [variant, 0]));
  const detailCounts = {};
  const variantPaths = Object.fromEntries(VARIANTS.map((variant) => [variant, []]));
  const exceptionRows = Object.fromEntries(EXCEPTION_CLASSES.map((exception) => [exception, []]));
  const byTrack = {};

  /** @type {Array<{ path: string, reason: string }>} */
  const unclassified = [];
  /** @type {Record<string, string>} */
  const preimages = {};
  /** @type {Array<{ path: string, sha256: string }>} */
  const manifestEntries = [];

  const normalizedPhrases = new Set();
  let declaredMembers = 0;
  let parsedPhrases = 0;
  let documentsDeclaring = 0;
  let anchorMarkerLines = 0;
  let nonConformingAnchorIds = 0;

  for (const relativePath of files) {
    const absolute = path.join(repoRoot, relativePath);
    let text;
    try {
      text = fs.readFileSync(absolute, 'utf8');
    } catch (error) {
      unclassified.push({ path: relativePath, reason: `unreadable: ${error instanceof Error ? error.message : String(error)}` });
      continue;
    }

    manifestEntries.push({ path: relativePath, sha256: sha256(text) });

    let planned;
    try {
      planned = planDocument({ relativePath, text });
    } catch (error) {
      unclassified.push({ path: relativePath, reason: error instanceof Error ? error.message : String(error) });
      continue;
    }

    const { classification } = planned;
    variantCounts[classification.variant] += 1;
    variantPaths[classification.variant].push(relativePath);
    const detailKey = `${classification.variant}/${classification.detail}`;
    detailCounts[detailKey] = (detailCounts[detailKey] ?? 0) + 1;

    const track = trackOf(relativePath);
    byTrack[track] = byTrack[track] ?? Object.fromEntries(VARIANTS.map((variant) => [variant, 0]));
    byTrack[track][classification.variant] += 1;

    preimages[relativePath] = bodyPreimage(text).digest;

    const declared = declaredTriggerMembers(text);
    if (declared.key !== null) {
      documentsDeclaring += 1;
      declaredMembers += declared.members.length;
    }
    parsedPhrases += classification.phrases.length;
    for (const phrase of classification.phrases) normalizedPhrases.add(phrase.normalized);

    for (const rowEntry of planned.diagnostics) {
      if (exceptionRows[rowEntry.category]) exceptionRows[rowEntry.category].push(rowEntry);
    }

    anchorMarkerLines += planned.anchors.markers.length;
    nonConformingAnchorIds += planned.anchors.nonConformingIds.length;
  }

  const manifest = {
    contentHash: sha256(manifestEntries.map((entry) => `${entry.path}\0${entry.sha256}`).join('\n')),
    count: manifestEntries.length,
    files: manifestEntries,
    schemaVersion: SCHEMA_VERSION,
    scope: {
      excludedDirectories: [...EXCLUDED_DIR_NAMES].sort(compareCodeUnits),
      includeHidden: options.includeHidden ?? false,
      root: SCOPE_ROOT,
      track: options.track ?? null,
    },
    skipped: walked.skipped,
  };

  const inventory = {
    // Full path lists are carried for the variants a reviewer has to act on.
    // The conforming bucket is the corpus majority; listing it would bury the
    // seven lists that matter under one that needs no review.
    counts: variantCounts,
    detailCounts,
    manifestTotal: manifest.count,
    paths: Object.fromEntries(VARIANTS.map((variant) => [
      variant,
      variant === 'valid-empty' ? [] : variantPaths[variant],
    ])),
    schemaVersion: SCHEMA_VERSION,
    sum: Object.values(variantCounts).reduce((total, count) => total + count, 0),
    sumMatchesManifest: Object.values(variantCounts).reduce((total, count) => total + count, 0) === manifest.count,
    unclassified,
    variantsByTrack: byTrack,
  };

  const exceptionInventory = {
    anchorGrammar: { markerLines: anchorMarkerLines, nonConformingIds: nonConformingAnchorIds },
    counts: Object.fromEntries(EXCEPTION_CLASSES.map((exception) => [exception, exceptionRows[exception].length])),
    rows: exceptionRows,
    schemaVersion: SCHEMA_VERSION,
  };

  const baseline = buildBaseline({
    declaredMembers,
    documentsDeclaring,
    manifestCount: manifest.count,
    normalizedPhrases: normalizedPhrases.size,
    parsedPhrases,
    probe: options.probe ?? DEFAULT_PROBE,
    repoRoot,
    track: options.track ?? null,
  });

  const artifacts = {
    baseline: writeArtifact(options.outDir, 'baseline.json', baseline),
    exceptionInventory: writeArtifact(options.outDir, 'exception-inventory.json', exceptionInventory),
    manifest: writeArtifact(options.outDir, 'manifest.json', manifest),
    preimageManifest: writeArtifact(options.outDir, 'preimage-manifest.json', {
      digests: preimages,
      count: Object.keys(preimages).length,
      definition: 'sha256 over the content after the closing frontmatter fence, with whole-line anchor markers removed and no other normalization',
      schemaVersion: SCHEMA_VERSION,
    }),
    variantInventory: writeArtifact(options.outDir, 'variant-inventory.json', inventory),
  };

  return {
    artifacts,
    report: {
      baseline,
      exceptionCounts: exceptionInventory.counts,
      inventory,
      manifestCount: manifest.count,
      manifestHash: manifest.contentHash,
      skippedCount: walked.skipped.length,
      stage: 'enumerate',
    },
  };
}

/**
 * Records what the corpus measured before any document was rewritten. Two
 * different phrase counts are kept because they answer different questions and
 * are routinely confused: one counts distinct search keys, the other counts what
 * authors wrote.
 *
 * @param {Record<string, any>} input Measured totals and execution context.
 * @returns {Record<string, any>} Baseline artifact.
 */
function buildBaseline(input) {
  const recipeRuns = RECIPES.map((recipe) => {
    const record = search(recipe, input.probe, { cwd: input.repoRoot });
    return {
      command: record.command,
      exitCode: record.exitCode,
      outcome: record.outcome,
      recipe,
      resultCount: record.results?.length ?? record.paths?.length ?? record.counts?.length ?? 0,
      stderr: record.stderr.trim(),
    };
  });

  return {
    budgets: { maxPhraseLength: MAX_PHRASE_LENGTH, maxTriggerListMembers: MAX_TRIGGER_LIST_MEMBERS },
    measures: {
      declaredMembers: {
        definition: 'trigger_phrases members as written across the in-scope corpus, before dedupe or normalization',
        value: input.declaredMembers,
      },
      documentsDeclaringTriggerPhrases: {
        definition: 'in-scope documents carrying a trigger_phrases or triggerPhrases key',
        value: input.documentsDeclaring,
      },
      parsedPhrases: {
        definition: 'phrases surviving the strict reader per document, summed across the corpus',
        value: input.parsedPhrases,
      },
      uniqueNormalizedPhrases: {
        definition: 'distinct normalizeTriggerText values across the in-scope corpus; the measure the trigger index reports',
        value: input.normalizedPhrases,
      },
    },
    // The corpus-wide figure quoted in the packet was measured over a wider
    // walk than this one. Naming the primary measure and its scope keeps a
    // later comparison from reading two different populations as a regression.
    primaryMeasure: 'uniqueNormalizedPhrases',
    probe: input.probe,
    recipeRuns,
    ripgrepVersion: ripgrepVersion(),
    schemaVersion: SCHEMA_VERSION,
    scope: { documents: input.manifestCount, root: SCOPE_ROOT, track: input.track },
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. DRY-RUN
// ───────────────────────────────────────────────────────────────────

/**
 * Computes every edit and emits the diff without touching a document. This is
 * the stage a reviewer reads before the corpus is written to, so it also runs
 * the two gates the processor runs — the body preimage and the diff rule — and
 * reports a blocker rather than letting one surface mid-write.
 *
 * @param {{ manifestPath: string, outDir: string, repoRoot: string, track?: string }} options Stage options.
 * @returns {{ artifacts: Record<string, string>, report: Record<string, any> }} Stage result.
 */
export function dryRun(options) {
  const manifest = readArtifact(options.manifestPath);
  const entries = selectEntries(manifest, options.track);

  const diffChunks = [];
  const byTrack = {};
  const blockers = [];
  const diagnostics = [];
  let planned = 0;

  for (const entry of entries) {
    const absolute = path.join(options.repoRoot, entry.path);
    const text = fs.readFileSync(absolute, 'utf8');
    const result = planDocument({ relativePath: entry.path, text });
    diagnostics.push(...result.diagnostics);

    if (result.nextText === text) continue;

    const gate = checkGates(entry.path, text, result.nextText);
    if (!gate.ok) {
      blockers.push(gate);
      continue;
    }

    planned += 1;
    const track = trackOf(entry.path);
    byTrack[track] = (byTrack[track] ?? 0) + 1;
    diffChunks.push(renderUnifiedDiff(entry.path, text, result.nextText));
  }

  const diffText = diffChunks.join('');
  const diffPath = path.resolve(options.outDir, 'plan.diff');
  fs.mkdirSync(path.dirname(diffPath), { recursive: true });
  fs.writeFileSync(diffPath, diffText, 'utf8');

  const report = {
    blockers,
    considered: entries.length,
    diffBytes: Buffer.byteLength(diffText),
    diffPath,
    plannedByTrack: byTrack,
    plannedDocuments: planned,
    severityCounts: countSeverities(diagnostics),
    stage: 'dry-run',
  };

  return {
    artifacts: {
      plan: diffPath,
      summary: writeArtifact(options.outDir, 'dry-run-report.json', { ...report, schemaVersion: SCHEMA_VERSION }),
    },
    report,
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. PROCESS
// ───────────────────────────────────────────────────────────────────

/**
 * Applies the planned edits, one file at a time, through a same-directory
 * temporary file. The candidate text is preimage-checked and diff-checked
 * before the rename, so a document that would fail either gate is left exactly
 * as it was and the run reports it instead of half-writing it.
 *
 * @param {{ manifestPath: string, outDir: string, repoRoot: string, track?: string }} options Stage options.
 * @returns {{ artifacts: Record<string, string>, report: Record<string, any> }} Stage result.
 */
export function processCorpus(options) {
  const manifest = readArtifact(options.manifestPath);
  const entries = selectEntries(manifest, options.track);

  const diagnostics = [];
  const failures = [];
  const writtenByTrack = {};
  let written = 0;
  let unchanged = 0;

  for (const entry of entries) {
    const absolute = path.join(options.repoRoot, entry.path);
    const text = fs.readFileSync(absolute, 'utf8');

    // The manifest froze this document's bytes. A document that moved since
    // then is outside the reviewed plan, so it is reported rather than edited
    // against a plan computed from content it no longer has.
    if (sha256(text) !== entry.sha256) {
      failures.push({
        kind: 'stale-manifest',
        path: entry.path,
        reason: 'document changed since the manifest was frozen; re-run enumerate before process',
      });
      continue;
    }

    const result = planDocument({ relativePath: entry.path, text });
    diagnostics.push(...result.diagnostics);

    if (result.nextText === text) {
      unchanged += 1;
      continue;
    }

    const gate = checkGates(entry.path, text, result.nextText);
    if (!gate.ok) {
      failures.push({ kind: 'gate', path: entry.path, reason: gate.reason });
      continue;
    }

    try {
      writeAtomic(absolute, text, result.nextText);
    } catch (error) {
      failures.push({
        kind: 'write',
        path: entry.path,
        reason: error instanceof Error ? error.message : String(error),
      });
      continue;
    }

    written += 1;
    const track = trackOf(entry.path);
    writtenByTrack[track] = (writtenByTrack[track] ?? 0) + 1;
  }

  // The category enum is closed, and `preimage-mismatch` is its only member for
  // "a digest recorded earlier no longer matches", which is literally what a
  // stale manifest is. The distinction a reader needs lives in `reason` and in
  // the `kind` counts, rather than in a category the schema does not define.
  for (const failure of failures) {
    diagnostics.push({
      category: 'preimage-mismatch',
      line: 0,
      path: failure.path,
      rawKey: failure.kind,
      reason: failure.reason,
      severity: SEVERITY.ERROR,
    });
  }

  const report = {
    considered: entries.length,
    failures,
    failuresByKind: countKinds(failures),
    severityCounts: countSeverities(diagnostics),
    stage: 'process',
    unchanged,
    written,
    writtenByTrack,
  };

  // One diagnostics file per track. A single fixed name would leave only the
  // last track's rows on disk after a per-track run, which is precisely the
  // corpus-wide evidence the pipeline exists to produce.
  const diagnosticsName = options.track
    ? `diagnostics-${options.track.replace(/\//g, '-')}.json`
    : 'diagnostics.json';

  return {
    artifacts: {
      diagnostics: writeArtifact(options.outDir, diagnosticsName, {
        categories: [...DIAGNOSTIC_CATEGORIES],
        counts: countCategories(diagnostics),
        failuresByKind: report.failuresByKind,
        rows: diagnostics.sort((a, b) => compareCodeUnits(a.path, b.path)
          || (a.line - b.line)
          || compareCodeUnits(a.category, b.category)),
        schemaVersion: SCHEMA_VERSION,
        severityCounts: countSeverities(diagnostics),
        track: options.track ?? null,
      }),
    },
    report,
  };
}

/**
 * Writes through a same-directory temporary file and renames only after the
 * candidate passes its own preimage check. A rename inside one directory is the
 * only step here that is atomic, which is why the check happens before it and
 * not after.
 *
 * @param {string} absolute Absolute document path.
 * @param {string} before Text as read.
 * @param {string} after Candidate text.
 * @returns {void}
 */
export function writeAtomic(absolute, before, after) {
  const directory = path.dirname(absolute);
  const temporaryPath = path.join(directory, `.${path.basename(absolute)}.retrofit-${process.pid}`);

  try {
    fs.writeFileSync(temporaryPath, after, 'utf8');
    const readBack = fs.readFileSync(temporaryPath, 'utf8');
    if (readBack !== after) throw new Error('temporary file did not round-trip');
    if (bodyPreimage(readBack).digest !== bodyPreimage(before).digest) {
      throw new Error('post-edit body preimage does not match the pre-edit digest');
    }
    fs.renameSync(temporaryPath, absolute);
  } catch (error) {
    try {
      fs.rmSync(temporaryPath, { force: true });
    } catch {
      // The temporary file is best-effort cleanup; the write failure is the
      // error worth surfacing, and the original document is still intact.
    }
    throw error;
  }
}

/**
 * The two gates every write must pass: the body did not change, and no changed
 * line is anything but frontmatter or a whole-line marker.
 *
 * @param {string} relativePath Repo-relative path.
 * @param {string} before Text before.
 * @param {string} after Text after.
 * @returns {{ counts?: Record<string, number>, ok: boolean, path: string, reason: string }} Gate result.
 */
export function checkGates(relativePath, before, after) {
  // Checked first because neither gate below can see it: an edit that stops the
  // frontmatter parsing stays inside the block, so the preimage holds and every
  // changed line buckets as frontmatter while the declaration is destroyed.
  const degradation = degradesFrontmatter(before, after);
  if (degradation) {
    return {
      ok: false,
      path: relativePath,
      reason: `edit would turn this ${degradation.from} document into ${degradation.to}`,
    };
  }

  if (bodyPreimage(before).digest !== bodyPreimage(after).digest) {
    return { ok: false, path: relativePath, reason: 'body preimage would change' };
  }

  const diff = classifyDiff(before, after);
  if (diff.counts.other > 0) {
    const sample = diff.changed.find((change) => change.bucket === 'other');
    return {
      counts: diff.counts,
      ok: false,
      path: relativePath,
      reason: `${diff.counts.other} changed line(s) are neither frontmatter nor a whole-line marker, first at line ${sample?.line}`,
    };
  }

  return { counts: diff.counts, ok: true, path: relativePath, reason: '' };
}

// ───────────────────────────────────────────────────────────────────
// 6. RESCAN
// ───────────────────────────────────────────────────────────────────

/**
 * Re-walks the frozen manifest and asks one question: is any document still
 * carrying a variant a completed run should have cleared?
 *
 * The five skip-and-report variants are not residue. Their documented treatment
 * is to be left alone, so a rescan that counted them would never go green and
 * would say nothing about whether the run finished. A document the processor
 * refused because the edit would have destroyed its frontmatter is skipped for
 * the same reason: the pipeline decided not to write it, and reporting a
 * deliberate refusal as unresolved residue would make a correct run look
 * unfinished forever.
 *
 * @param {{ manifestPath: string, outDir: string, repoRoot: string, track?: string }} options Stage options.
 * @returns {{ artifacts: Record<string, string>, report: Record<string, any> }} Stage result.
 */
export function rescan(options) {
  const manifest = readArtifact(options.manifestPath);
  const entries = selectEntries(manifest, options.track);

  const residue = [];
  // Skips are reported by path, not merely counted: a skip is a document a
  // human has to look at, and a count alone cannot be acted on.
  const skippedByDesign = Object.fromEntries(
    [...SKIP_VARIANTS, ...REFUSAL_SKIPS].map((key) => [key, { count: 0, paths: [] }]),
  );
  const counts = Object.fromEntries(VARIANTS.map((variant) => [variant, 0]));

  for (const entry of entries) {
    const absolute = path.join(options.repoRoot, entry.path);
    let text;
    try {
      text = fs.readFileSync(absolute, 'utf8');
    } catch (error) {
      residue.push({ path: entry.path, reason: `unreadable: ${error instanceof Error ? error.message : String(error)}`, variant: null });
      continue;
    }

    let classification;
    try {
      classification = classifyVariant(text);
    } catch (error) {
      residue.push({ path: entry.path, reason: error instanceof Error ? error.message : String(error), variant: null });
      continue;
    }

    counts[classification.variant] += 1;
    if (SKIP_VARIANTS.has(classification.variant)) {
      skippedByDesign[classification.variant].count += 1;
      skippedByDesign[classification.variant].paths.push(entry.path);
      continue;
    }
    if (RESOLVABLE_VARIANTS.has(classification.variant)) {
      // A resolvable variant that is still here is residue only if the
      // processor would have written it. Re-plan to tell the two apart: a
      // refusal is a decision the pipeline already made and recorded.
      const planned = planDocument({ relativePath: entry.path, text });
      const refusal = REFUSAL_SKIPS.find((skip) => planned.actions.includes(skip));
      if (refusal) {
        skippedByDesign[refusal].count += 1;
        skippedByDesign[refusal].paths.push(entry.path);
        continue;
      }
      residue.push({ path: entry.path, reason: classification.reason, variant: classification.variant });
      continue;
    }
    if (classification.alias) {
      residue.push({ path: entry.path, reason: `key still spelled ${ALIAS_KEY}`, variant: classification.variant });
    }
  }

  const report = {
    canonicalKey: CANONICAL_TRIGGER_KEY,
    considered: entries.length,
    counts,
    residue,
    residueCount: residue.length,
    skippedByDesign,
    stage: 'rescan',
  };

  return {
    artifacts: { residue: writeArtifact(options.outDir, 'residue-report.json', { ...report, schemaVersion: SCHEMA_VERSION }) },
    report,
  };
}

// ───────────────────────────────────────────────────────────────────
// 7. VERIFY PREIMAGE
// ───────────────────────────────────────────────────────────────────

/**
 * Rehashes every document against the captured manifest. This is the
 * independent check: it reads the corpus as it stands now and compares against
 * a digest taken before any write, so it holds whether the change was applied,
 * reverted, or applied and then edited by hand.
 *
 * @param {{ outDir: string, preimagePath?: string, repoRoot: string, track?: string }} options Stage options.
 * @returns {{ artifacts: Record<string, string>, report: Record<string, any> }} Stage result.
 */
export function verifyPreimage(options) {
  const preimagePath = options.preimagePath ?? path.resolve(options.outDir, 'preimage-manifest.json');
  const captured = readArtifact(preimagePath);

  const mismatches = [];
  const missing = [];
  let verified = 0;

  for (const [relativePath, digest] of Object.entries(captured.digests)) {
    if (options.track && !relativePath.startsWith(`${options.track}/`)) continue;

    const absolute = path.join(options.repoRoot, relativePath);
    let text;
    try {
      text = fs.readFileSync(absolute, 'utf8');
    } catch {
      missing.push(relativePath);
      continue;
    }

    const current = bodyPreimage(text).digest;
    if (current === digest) {
      verified += 1;
      continue;
    }
    mismatches.push({ captured: digest, current, path: relativePath });
  }

  const report = {
    capturedCount: Object.keys(captured.digests).length,
    mismatchCount: mismatches.length,
    mismatches,
    missing,
    stage: 'verify-preimage',
    verified,
  };

  return {
    artifacts: { verification: writeArtifact(options.outDir, 'preimage-verification.json', { ...report, schemaVersion: SCHEMA_VERSION }) },
    report,
  };
}

// ───────────────────────────────────────────────────────────────────
// 8. ARTIFACT HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * @param {string} outDir Artifact directory.
 * @param {string} name File name.
 * @param {unknown} value Value to publish.
 * @returns {string} Absolute artifact path.
 */
function writeArtifact(outDir, name, value) {
  const target = path.resolve(outDir, name);
  publishJson(target, value);
  return target;
}

/**
 * @param {string} artifactPath Absolute or relative artifact path.
 * @returns {Record<string, any>} Parsed artifact.
 */
function readArtifact(artifactPath) {
  const resolved = path.resolve(artifactPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`required artifact is missing, run the previous stage first: ${resolved}`);
  }
  return JSON.parse(fs.readFileSync(resolved, 'utf8'));
}

/**
 * @param {Record<string, any>} manifest Frozen manifest.
 * @param {string | undefined} track Track filter.
 * @returns {Array<{ path: string, sha256: string }>} Selected entries.
 */
function selectEntries(manifest, track) {
  if (!track) return manifest.files;
  const selected = manifest.files.filter((entry) => entry.path.startsWith(`${track}/`));
  if (selected.length === 0) {
    throw new Error(`track '${track}' selects no document in the frozen manifest`);
  }
  return selected;
}

/**
 * @param {Array<{ severity: string }>} diagnostics Diagnostic rows.
 * @returns {{ error: number, warn: number }} Counts by severity.
 */
function countSeverities(diagnostics) {
  return {
    error: diagnostics.filter((row) => row.severity === SEVERITY.ERROR).length,
    warn: diagnostics.filter((row) => row.severity === SEVERITY.WARN).length,
  };
}

/**
 * @param {Array<{ kind: string }>} failures Failure rows.
 * @returns {Record<string, number>} Counts by failure kind.
 */
function countKinds(failures) {
  const counts = { gate: 0, 'stale-manifest': 0, write: 0 };
  for (const failure of failures) counts[failure.kind] = (counts[failure.kind] ?? 0) + 1;
  return counts;
}

/**
 * @param {Array<{ category: string }>} diagnostics Diagnostic rows.
 * @returns {Record<string, number>} Counts by category.
 */
function countCategories(diagnostics) {
  const counts = Object.fromEntries(DIAGNOSTIC_CATEGORIES.map((category) => [category, 0]));
  for (const row of diagnostics) counts[row.category] = (counts[row.category] ?? 0) + 1;
  return counts;
}

// ───────────────────────────────────────────────────────────────────
// 9. CLI
// ───────────────────────────────────────────────────────────────────

/**
 * @param {string[]} argv Arguments after the script name.
 * @returns {Record<string, any>} Parsed options.
 */
export function parseArgs(argv) {
  const [stage, ...rest] = argv;
  if (!STAGES.includes(stage)) {
    throw new Error(`first argument must be one of ${STAGES.join(', ')}`);
  }

  const parsed = { includeHidden: false, json: false, stage };

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === '--json') { parsed.json = true; continue; }
    if (arg === '--include-hidden') { parsed.includeHidden = true; continue; }
    if (['--root', '--track', '--out', '--manifest', '--probe', '--preimage'].includes(arg)) {
      const value = rest[i + 1];
      if (value === undefined) throw new Error(`${arg} requires a value`);
      parsed[arg.slice(2)] = value;
      i += 1;
      continue;
    }
    throw new Error(`unknown argument: ${arg}`);
  }

  const repoRoot = path.resolve(parsed.root ?? findRepoRoot());
  const outDir = path.resolve(parsed.out ?? DEFAULT_OUT_DIR);

  return {
    includeHidden: parsed.includeHidden,
    json: parsed.json,
    manifestPath: path.resolve(parsed.manifest ?? path.join(outDir, 'manifest.json')),
    outDir,
    preimagePath: parsed.preimage ? path.resolve(parsed.preimage) : undefined,
    probe: parsed.probe,
    repoRoot,
    stage,
    track: parsed.track ? parsed.track.replace(/\/+$/, '') : undefined,
  };
}

/**
 * Walks up from this script until a directory holding the scope root appears.
 * A retrofit invoked from inside a packet should still see the whole corpus.
 *
 * @returns {string} Repository root.
 */
function findRepoRoot() {
  return resolveRepoRoot(SCRIPT_DIR);
}

/**
 * @param {Record<string, any>} report Stage report.
 * @returns {string} Human-readable summary.
 */
export function formatSummary(report) {
  const lines = [`stage      : ${report.stage}`];

  if (report.stage === 'enumerate') {
    lines.push(
      `documents  : ${report.manifestCount}`,
      `contentHash: ${report.manifestHash}`,
      `skipped    : ${report.skippedCount}`,
      `sum check  : ${report.inventory.sum} vs manifest ${report.inventory.manifestTotal} (${report.inventory.sumMatchesManifest ? 'match' : 'MISMATCH'})`,
      `unclassifd : ${report.inventory.unclassified.length}`,
      '',
      'variants:',
    );
    for (const variant of VARIANTS) {
      lines.push(`  ${variant.padEnd(22)} ${String(report.inventory.counts[variant]).padStart(6)}`);
    }
    lines.push('', 'exception classes:');
    for (const exception of EXCEPTION_CLASSES) {
      lines.push(`  ${exception.padEnd(22)} ${String(report.exceptionCounts[exception]).padStart(6)}`);
    }
    lines.push('', 'baseline measures:');
    for (const [name, measure] of Object.entries(report.baseline.measures)) {
      lines.push(`  ${name.padEnd(34)} ${String(measure.value).padStart(8)}`);
    }
    lines.push('', 'recipe runs:');
    for (const run of report.baseline.recipeRuns) {
      lines.push(`  ${run.recipe.padEnd(12)} exit ${run.exitCode} (${run.outcome}), ${run.resultCount} result(s)`);
    }
  }

  if (report.stage === 'dry-run') {
    lines.push(
      `considered : ${report.considered}`,
      `planned    : ${report.plannedDocuments}`,
      `diff bytes : ${report.diffBytes}`,
      `diff path  : ${report.diffPath}`,
      `blockers   : ${report.blockers.length}`,
      `severity   : ${report.severityCounts.error} error, ${report.severityCounts.warn} warn`,
      '',
      'planned by track:',
    );
    for (const [track, count] of Object.entries(report.plannedByTrack).sort()) {
      lines.push(`  ${track.padEnd(46)} ${String(count).padStart(6)}`);
    }
  }

  if (report.stage === 'process') {
    lines.push(
      `considered : ${report.considered}`,
      `written    : ${report.written}`,
      `unchanged  : ${report.unchanged}`,
      `failures   : ${report.failures.length} (stale manifest ${report.failuresByKind['stale-manifest']}, gate ${report.failuresByKind.gate}, write ${report.failuresByKind.write})`,
      `severity   : ${report.severityCounts.error} error, ${report.severityCounts.warn} warn`,
    );
    if (report.failuresByKind['stale-manifest'] > 0) {
      lines.push('', 'the manifest predates these documents; re-run enumerate, then process');
    }
  }

  if (report.stage === 'rescan') {
    lines.push(`considered : ${report.considered}`, `residue    : ${report.residueCount}`, '', 'skipped by design:');
    for (const [variant, entry] of Object.entries(report.skippedByDesign)) {
      lines.push(`  ${variant.padEnd(22)} ${String(entry.count).padStart(6)}`);
      for (const skippedPath of entry.paths) lines.push(`      ${skippedPath}`);
    }
  }

  if (report.stage === 'verify-preimage') {
    lines.push(
      `captured   : ${report.capturedCount}`,
      `verified   : ${report.verified}`,
      `mismatches : ${report.mismatchCount}`,
      `missing    : ${report.missing.length}`,
    );
  }

  return `${lines.join('\n')}\n`;
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
    return EXIT_ERROR;
  }

  let result;
  try {
    if (args.stage === 'enumerate') result = enumerate(args);
    else if (args.stage === 'dry-run') result = dryRun(args);
    else if (args.stage === 'process') result = processCorpus(args);
    else if (args.stage === 'rescan') result = rescan(args);
    else result = verifyPreimage(args);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    return EXIT_ERROR;
  }

  process.stdout.write(args.json
    ? `${stableStringify({ artifacts: result.artifacts, report: result.report })}\n`
    : `${formatSummary(result.report)}${formatArtifacts(result.artifacts)}`);

  return exitFor(args.stage, result.report);
}

/**
 * Exit status per stage. The inventory stages report and return clean: their
 * job is to describe a corpus that is known not to conform yet, so failing them
 * on a finding would stop the pipeline before its first step. The gate stages
 * fail on the conditions they exist to catch.
 *
 * @param {string} stage Stage name.
 * @param {Record<string, any>} report Stage report.
 * @returns {number} Exit code.
 */
function exitFor(stage, report) {
  if (stage === 'enumerate') {
    return report.inventory.unclassified.length > 0 || !report.inventory.sumMatchesManifest
      ? EXIT_ERROR
      : EXIT_CLEAN;
  }
  if (stage === 'dry-run') return report.blockers.length > 0 ? EXIT_RESIDUE : EXIT_CLEAN;
  if (stage === 'process') return report.failures.length > 0 ? EXIT_RESIDUE : EXIT_CLEAN;
  if (stage === 'rescan') return report.residueCount > 0 ? EXIT_RESIDUE : EXIT_CLEAN;
  return report.mismatchCount > 0 || report.missing.length > 0 ? EXIT_RESIDUE : EXIT_CLEAN;
}

/**
 * @param {Record<string, string>} artifacts Artifact paths by name.
 * @returns {string} Rendered artifact list.
 */
function formatArtifacts(artifacts) {
  const names = Object.keys(artifacts).sort(compareCodeUnits);
  return `\nartifacts:\n${names.map((name) => `  ${name.padEnd(18)} ${artifacts[name]}`).join('\n')}\n`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
