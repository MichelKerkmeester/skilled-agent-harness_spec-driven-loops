// ───────────────────────────────────────────────────────────────
// MODULE: Deterministic Multi-Hop Recall
// ───────────────────────────────────────────────────────────────
// Feature flag: SPECKIT_DETERMINISTIC_MULTIHOP (default: OFF / opt-in)
//
// A spec doc routinely names its siblings and cross-references by their folder
// slug ("see 027-foo", "supersedes 014-bar") in its own prose. When a query
// recalls a hub doc on its own merit, the docs it explicitly points at are the
// natural next hop — yet the fused lanes never surface them unless they also
// matched the query lexically or semantically. This module follows those
// already-written pointers deterministically: it parses the slugs out of the
// content of the top recalled hop-1 docs, resolves each to a UNIQUE spec
// folder, and appends that folder's spec.md to the TAIL.
//
// It is deliberately the cheapest possible hop: no LLM, no re-embedding, no new
// similarity computation — only a regex over text the pipeline already trusts
// and a 1:1 slug→folder lookup. Resolution is intentionally strict: a slug that
// maps to more than one folder (the same NNN-name reused under different tracks)
// is AMBIGUOUS and skipped, because a wrong hop is worse than no hop.
//
// The append-not-displace contract mirrors graph-additive-recall: hop-2 docs are
// added past the baseline window and can fill empty tail slots, but a multihop
// candidate can never evict a baseline hit. Anything already present in the
// protected window (the fused results that came before) is deduped out, so the
// hop only ever extends recall.

import type Database from 'better-sqlite3';

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS

// ───────────────────────────────────────────────────────────────
/** Hop-1 docs whose content we mine for outbound slug references. */
const DEFAULT_HOP1_SCAN_LIMIT = 5;
/** Hard cap on hop-2 docs appended to the tail, per the additive budget. */
const DEFAULT_MAX_APPEND = 10;

// A spec-folder slug: a 3-digit phase prefix plus a lowercase hyphenated name,
// e.g. `027-xce-research-based-refinement`. This is the same shape spec folders
// are named with, so it is what authors write when they cross-reference. A
// trailing `[a-z0-9]` anchor avoids trapping a dangling hyphen.
const SLUG_PATTERN = /\b\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*\b/g;

// ───────────────────────────────────────────────────────────────
// 2. INTERFACES

// ───────────────────────────────────────────────────────────────
/** Minimal shape of a fused result this module reads and emits. */
export interface MultihopResult {
  id: number | string;
  score: number;
  source?: string;
  sources?: string[];
  [key: string]: unknown;
}

/** Metadata describing what the multihop append did. */
export interface MultihopMetadata {
  /** True when the flag was on and the hop was evaluated. */
  applied: boolean;
  /** Distinct slugs parsed out of the scanned hop-1 content. */
  slugsParsed: number;
  /** Slugs that resolved 1:1 to a unique spec folder. */
  slugsResolved: number;
  /** Hop-2 spec.md docs actually appended to the tail. */
  appendedCount: number;
}

/** Return value of applyDeterministicMultihop(). Preserves caller element type. */
export interface MultihopOutput<T extends MultihopResult> {
  results: T[];
  multihop: MultihopMetadata;
}

export interface MultihopOptions {
  /** Restrict resolution to a single track when the caller is folder-scoped. */
  specFolder?: string;
  /** Override the hop-1 scan window (top-N recalled docs). */
  hop1ScanLimit?: number;
  /** Override the tail append cap. */
  maxAppend?: number;
}

// ───────────────────────────────────────────────────────────────
// 3. INTERNAL HELPERS

// ───────────────────────────────────────────────────────────────
/**
 * Stable canonical id so a hop-2 candidate already present in the protected
 * window is recognised regardless of numeric-vs-string id representation.
 */
function canonicalId(id: number | string): string {
  return typeof id === 'number' ? String(id) : id.trim();
}

/**
 * Parse distinct folder slugs out of a block of doc content, preserving first-
 * seen order so the strongest hop-1 doc's references hop first. Returns at most
 * a generous cap so a pathological doc cannot blow up resolution work.
 */
function parseSlugs(contentBlocks: string[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const block of contentBlocks) {
    if (!block) continue;
    const matches = block.match(SLUG_PATTERN);
    if (!matches) continue;
    for (const raw of matches) {
      const slug = raw.toLowerCase();
      if (seen.has(slug)) continue;
      seen.add(slug);
      ordered.push(slug);
      // A single hop never needs more than a few dozen distinct slugs; the
      // append cap downstream is the real limiter.
      if (ordered.length >= 64) return ordered;
    }
  }
  return ordered;
}

/**
 * Resolve a slug to a UNIQUE spec_folder. A spec folder is either the bare slug
 * (`027-name`) or a tracked path ending in it (`track/027-name`). The slug is
 * accepted only when exactly ONE distinct folder matches — a slug reused under
 * multiple tracks is ambiguous and rejected, because following the wrong edge
 * costs recall instead of adding it.
 *
 * @returns the unique spec_folder, or null when zero or many folders match.
 */
function resolveSlugToFolder(
  db: Database.Database,
  slug: string,
  specFolder: string | undefined,
): string | null {
  // ESCAPE keeps a literal slug (no wildcards expected, but defensive) safe.
  const params: unknown[] = [slug, `%/${slug}`];
  let sql =
    'SELECT DISTINCT spec_folder FROM memory_index ' +
    "WHERE spec_folder IS NOT NULL AND (spec_folder = ? OR spec_folder LIKE ? ESCAPE '\\')";
  if (specFolder) {
    sql += ' AND spec_folder LIKE ?';
    params.push(`${specFolder}%`);
  }
  sql += ' LIMIT 2';
  const rows = db.prepare(sql).all(...params) as Array<{ spec_folder: string | null }>;
  const folders = rows
    .map((row) => row.spec_folder)
    .filter((value): value is string => typeof value === 'string' && value.length > 0);
  return folders.length === 1 ? folders[0] : null;
}

/**
 * Fetch the spec.md row for a resolved folder. Returns the id + score-bearing
 * fields needed to materialise a tail candidate, or null when the folder has no
 * indexed spec.md (e.g. a phase parent documented elsewhere).
 */
function fetchSpecDoc(
  db: Database.Database,
  folder: string,
): { id: number; spec_folder: string } | null {
  const row = db
    .prepare(
      'SELECT id, spec_folder FROM memory_index ' +
        "WHERE spec_folder = ? AND file_path LIKE '%/spec.md' " +
        'ORDER BY id LIMIT 1',
    )
    .get(folder) as { id: number; spec_folder: string } | undefined;
  return row ?? null;
}

// ───────────────────────────────────────────────────────────────
// 4. MAIN EXPORT

// ───────────────────────────────────────────────────────────────
/**
 * Append deterministic hop-2 spec docs to the tail of a fused result list.
 *
 * Behaviour:
 *  - `enabled === false` or no `db` → pass the list through unchanged
 *    (byte-identical ordering, `applied = false`), preserving the flag-off path.
 *  - `enabled === true` → scan the top hop-1 docs' content for outbound slugs,
 *    resolve each 1:1 to a unique spec folder, fetch that folder's spec.md, dedup
 *    against the protected window, and APPEND up to `maxAppend` to the tail under
 *    a new `multihop` source. The baseline list keeps its exact order and slots.
 *
 * No baseline candidate is reordered, rescored, or dropped — the hop can only add
 * tail candidates that downstream truncation may keep or trim like any other tail
 * hit. A multihop candidate therefore can never evict a baseline top-K hit.
 *
 * @param fusedResults - Post-fusion results in fused order (the protected window).
 * @param enabled      - Whether SPECKIT_DETERMINISTIC_MULTIHOP is active.
 * @param db           - Open DB handle for content + folder resolution lookups.
 * @param options      - Optional scan/append caps and folder scope.
 */
export function applyDeterministicMultihop<T extends MultihopResult>(
  fusedResults: T[],
  enabled: boolean,
  db: Database.Database | null,
  options: MultihopOptions = {},
): MultihopOutput<T> {
  const noop: MultihopOutput<T> = {
    results: fusedResults,
    multihop: { applied: false, slugsParsed: 0, slugsResolved: 0, appendedCount: 0 },
  };
  if (!enabled || !db || fusedResults.length === 0) {
    return noop;
  }

  const hop1Limit = options.hop1ScanLimit ?? DEFAULT_HOP1_SCAN_LIMIT;
  const maxAppend = options.maxAppend ?? DEFAULT_MAX_APPEND;

  // Hop-1 frontier: the top recalled docs, by their numeric ids. Non-numeric
  // ids (synthetic rows) carry no content_text and are skipped.
  const hop1Ids = fusedResults
    .slice(0, hop1Limit)
    .map((result) => result.id)
    .filter((id): id is number => typeof id === 'number');
  if (hop1Ids.length === 0) {
    return { results: fusedResults, multihop: { applied: true, slugsParsed: 0, slugsResolved: 0, appendedCount: 0 } };
  }

  // Pull the content of the frontier docs in a single statement.
  const placeholders = hop1Ids.map(() => '?').join(', ');
  const contentRows = db
    .prepare(`SELECT id, content_text FROM memory_index WHERE id IN (${placeholders})`)
    .all(...hop1Ids) as Array<{ id: number; content_text: string | null }>;
  // Preserve frontier order (the prepared IN clause does not guarantee it) so
  // the strongest hop-1 doc's references are followed first.
  const contentById = new Map(contentRows.map((row) => [row.id, row.content_text ?? '']));
  const orderedContent = hop1Ids.map((id) => contentById.get(id) ?? '');

  const slugs = parseSlugs(orderedContent);
  if (slugs.length === 0) {
    return { results: fusedResults, multihop: { applied: true, slugsParsed: 0, slugsResolved: 0, appendedCount: 0 } };
  }

  // The protected window: everything already fused. A hop-2 doc already here
  // earned its slot on its own merit and must not be re-appended.
  const protectedIds = new Set(fusedResults.map((result) => canonicalId(result.id)));
  // The tail score sits just below the weakest baseline hit so the append never
  // reorders the baseline when a downstream stage re-sorts by score.
  const weakestBaselineScore = fusedResults.reduce(
    (min, result) => (typeof result.score === 'number' && result.score < min ? result.score : min),
    Number.POSITIVE_INFINITY,
  );
  const tailScoreBase = Number.isFinite(weakestBaselineScore) ? weakestBaselineScore : 0;

  const appended: T[] = [];
  let slugsResolved = 0;
  const appendedFolders = new Set<string>();

  for (const slug of slugs) {
    if (appended.length >= maxAppend) break;
    const folder = resolveSlugToFolder(db, slug, options.specFolder);
    if (!folder) continue; // ambiguous or unknown slug — skip the hop
    slugsResolved += 1;
    if (appendedFolders.has(folder)) continue; // two slugs, same folder
    const doc = fetchSpecDoc(db, folder);
    if (!doc) continue;
    const canonical = canonicalId(doc.id);
    if (protectedIds.has(canonical)) continue; // already recalled — dedup
    appendedFolders.add(folder);
    // Strictly-decreasing tail score keeps appended docs in resolution order and
    // below every baseline hit. A tiny epsilon step avoids ties that a stable
    // sort would otherwise leave to insertion order.
    const tailScore = tailScoreBase - 1e-6 * (appended.length + 1);
    appended.push({
      id: doc.id,
      score: tailScore,
      source: 'multihop',
      sources: ['multihop'],
      spec_folder: doc.spec_folder,
    } as unknown as T);
  }

  if (appended.length === 0) {
    return {
      results: fusedResults,
      multihop: { applied: true, slugsParsed: slugs.length, slugsResolved, appendedCount: 0 },
    };
  }

  return {
    results: [...fusedResults, ...appended],
    multihop: {
      applied: true,
      slugsParsed: slugs.length,
      slugsResolved,
      appendedCount: appended.length,
    },
  };
}
