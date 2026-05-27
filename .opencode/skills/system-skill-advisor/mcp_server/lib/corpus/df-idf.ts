// ───────────────────────────────────────────────────────────────
// MODULE: Skill Corpus DF-IDF
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
// Keep `filterCorpusStatEligible` as the default predicate so
// existing callers see no behavioral change, but expose a `predicate`
// parameter on `computeCorpusStats` so callers can pass a different filter
// (or the eligible documents directly) without the corpus math module
// reaching into the lifecycle subsystem.
import { filterCorpusStatEligible } from '../lifecycle/archive-handling.js';

export type CorpusEligibilityPredicate = <T extends { sourcePath: string }>(
  entries: readonly T[],
) => readonly T[];

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface CorpusDocument {
  readonly skillId: string;
  readonly sourcePath: string;
  readonly terms: readonly string[];
  readonly graphMetadataMtimeMs?: number;
}

export interface CorpusTermStat {
  readonly term: string;
  readonly documentFrequency: number;
  readonly idf: number;
}

export interface CorpusStats {
  readonly documentCount: number;
  readonly vocabularyHash: string;
  readonly generatedAt: string;
  readonly terms: CorpusTermStat[];
}

export interface CorpusStatsCacheOptions {
  readonly cachePath?: string;
  readonly workspaceRoot?: string;
  readonly now?: Date;
  readonly predicate?: CorpusEligibilityPredicate;
}

export interface CorpusStatsCacheResult {
  readonly stats: CorpusStats;
  readonly cacheHit: boolean;
  readonly cachePath: string;
  readonly sourceKey: string;
}

interface CorpusStatsCacheFile {
  readonly schemaVersion: 1;
  readonly sourceKey: string;
  readonly stats: CorpusStats;
}

export interface DebouncedCorpusUpdater {
  readonly schedule: (documents: readonly CorpusDocument[]) => void;
  readonly flush: () => CorpusStats | null;
}

// ───────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────

function normalizeTerms(terms: readonly string[]): string[] {
  return [...new Set(terms.map((term) => term.toLowerCase().trim()).filter(Boolean))].sort();
}

function defaultCorpusStatsCachePath(workspaceRoot = process.cwd()): string {
  return join(
    workspaceRoot,
    '.opencode',
    'skills',
    'system-skill-advisor',
    'mcp_server',
    'database',
    'df-idf-corpus-cache.json',
  );
}

function computeCorpusStatsForActiveDocuments(activeDocuments: readonly CorpusDocument[], now: Date): CorpusStats {
  const documentFrequency = new Map<string, number>();
  for (const document of activeDocuments) {
    for (const term of normalizeTerms(document.terms)) {
      documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
    }
  }

  const documentCount = activeDocuments.length;
  const terms = [...documentFrequency.entries()]
    .map(([term, df]) => ({
      term,
      documentFrequency: df,
      idf: Number((Math.log((1 + documentCount) / (1 + df)) + 1).toFixed(6)),
    }))
    .sort((left, right) => left.term.localeCompare(right.term));
  const vocabularyHash = `sha256:${createHash('sha256').update(JSON.stringify(terms)).digest('hex')}`;
  return {
    documentCount,
    vocabularyHash,
    generatedAt: now.toISOString(),
    terms,
  };
}

function corpusSourceKey(activeDocuments: readonly CorpusDocument[]): string {
  const material = activeDocuments
    .map((document) => ({
      skillId: document.skillId,
      sourcePath: document.sourcePath,
      graphMetadataMtimeMs: document.graphMetadataMtimeMs ?? null,
      terms: normalizeTerms(document.terms),
    }))
    .sort((left, right) => left.sourcePath.localeCompare(right.sourcePath) || left.skillId.localeCompare(right.skillId));
  return `sha256:${createHash('sha256').update(JSON.stringify({ schemaVersion: 1, material })).digest('hex')}`;
}

function readCachedCorpusStats(cachePath: string, sourceKey: string): CorpusStats | null {
  if (!existsSync(cachePath)) return null;
  try {
    const parsed = JSON.parse(readFileSync(cachePath, 'utf8')) as Partial<CorpusStatsCacheFile>;
    if (parsed.schemaVersion !== 1 || parsed.sourceKey !== sourceKey || !parsed.stats) return null;
    return parsed.stats;
  } catch {
    return null;
  }
}

function writeCachedCorpusStats(cachePath: string, sourceKey: string, stats: CorpusStats): void {
  mkdirSync(dirname(cachePath), { recursive: true });
  const tmpPath = `${cachePath}.${process.pid}.${Date.now()}.tmp`;
  try {
    writeFileSync(tmpPath, `${JSON.stringify({ schemaVersion: 1, sourceKey, stats }, null, 2)}\n`, 'utf8');
    renameSync(tmpPath, cachePath);
  } catch (error) {
    rmSync(tmpPath, { force: true });
    throw error;
  }
}

export function computeCorpusStats(
  documents: readonly CorpusDocument[],
  now = new Date(),
  // Predicate is opt-in; default keeps the existing
  // lifecycle-aware behavior so callers that do not pass a predicate get
  // the same result as before. Callers that already filter their documents
  // upstream can pass `(entries) => entries` to skip the inner pass.
  predicate: CorpusEligibilityPredicate = filterCorpusStatEligible,
): CorpusStats {
  return computeCorpusStatsForActiveDocuments(predicate(documents), now);
}

export function computeCorpusStatsCached(
  documents: readonly CorpusDocument[],
  options: CorpusStatsCacheOptions = {},
): CorpusStatsCacheResult {
  const predicate = options.predicate ?? filterCorpusStatEligible;
  const activeDocuments = predicate(documents);
  const sourceKey = corpusSourceKey(activeDocuments);
  const cachePath = options.cachePath ?? defaultCorpusStatsCachePath(options.workspaceRoot);
  const cached = readCachedCorpusStats(cachePath, sourceKey);
  if (cached) {
    return {
      stats: cached,
      cacheHit: true,
      cachePath,
      sourceKey,
    };
  }

  const stats = computeCorpusStatsForActiveDocuments(activeDocuments, options.now ?? new Date());
  writeCachedCorpusStats(cachePath, sourceKey, stats);
  return {
    stats,
    cacheHit: false,
    cachePath,
    sourceKey,
  };
}

export function createDebouncedCorpusUpdater(
  callback: (stats: CorpusStats) => void,
  debounceMs = 250,
  now = () => new Date(),
  cacheOptions?: Omit<CorpusStatsCacheOptions, 'now'>,
): DebouncedCorpusUpdater {
  let timer: NodeJS.Timeout | null = null;
  let pendingDocuments: readonly CorpusDocument[] | null = null;
  let lastStats: CorpusStats | null = null;

  function flush(): CorpusStats | null {
    if (!pendingDocuments) return lastStats;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastStats = cacheOptions
      ? computeCorpusStatsCached(pendingDocuments, { ...cacheOptions, now: now() }).stats
      : computeCorpusStats(pendingDocuments, now());
    pendingDocuments = null;
    callback(lastStats);
    return lastStats;
  }

  return {
    schedule(documents) {
      pendingDocuments = documents;
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, debounceMs);
      timer.unref?.();
    },
    flush,
  };
}
