// ───────────────────────────────────────────────────────────────
// MODULE: Bm25 Index
// ───────────────────────────────────────────────────────────────
import type Database from 'better-sqlite3';
import { normalizeContentForBM25 } from '../parsing/content-normalizer.js';
import {
  normalizeLexicalQueryTokens,
  sanitizeFTS5Query,
  sanitizeQueryTokens,
  simpleStem,
  STOP_WORDS,
  tokenize,
} from './lexical-normalizer.js';
import type { NormalizedLexicalQueryTokens } from './lexical-normalizer.js';
import { clearRegisteredTimer, registerTimeout } from '../runtime/timer-registry.js';

// ───────────────────────────────────────────────────────────────
// 1. INTERFACES

// ───────────────────────────────────────────────────────────────
interface BM25SearchResult {
  id: string;
  /**
   * BM25 term-frequency relevance score (unbounded, typically 0-25+).
   * Higher = better lexical match. Not directly comparable to vector similarity
   * scores; use min-max normalization or RRF when combining with other methods.
   */
  score: number;
}

interface BM25Stats {
  documentCount: number;
  termCount: number;
  avgDocLength: number;
}

interface BM25DocumentSource {
  title?: string | null;
  content_text?: string | null;
  trigger_phrases?: string | string[] | null;
  file_path?: string | null;
}

/* ───────────────────────────────────────────────────────────────
   1B. CONSTANTS & FEATURE FLAG
   ──────────────────────────────────────────────────────────────── */

const DEFAULT_K1 = 1.2;
const DEFAULT_B = 0.75;
const BM25_WARMUP_BATCH_SIZE = 250;
const BM25_ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on', 'experimental', 'fallback']);
const BM25_DISABLED_VALUES = new Set(['0', 'false', 'no', 'off']);
const BM25_ENGINE_VALUES = ['auto', 'sqlite', 'packed-inmemory', 'legacy-inmemory'] as const;
type Bm25Engine = typeof BM25_ENGINE_VALUES[number];
type InMemoryBm25Engine = Extract<Bm25Engine, 'packed-inmemory' | 'legacy-inmemory'>;
type BM25FieldName = 'title' | 'trigger_phrases' | 'content_generic' | 'body';

const BM25_FIELD_NAMES = ['title', 'trigger_phrases', 'content_generic', 'body'] as const;
const BM25_ENGINE_LOGGED = new Set<string>();

/**
 * Field weight multipliers for weighted BM25 scoring.
 * When indexing a document composed of multiple fields, multiply
 * each field's token scores by the appropriate weight before
 * accumulating the total document score.
 *
 * These weights are shared by the FTS5 path and the packed in-memory
 * fallback so both lexical lanes preserve the same field-priority intent.
 *
 * title:           10.0 — exact title matches are the strongest signal
 * trigger_phrases:  5.0 — curated keywords next most important
 * content_generic:  2.0 — generic textual content (file_path, tags, etc.)
 * body:             1.0 — baseline weight for full body / content_text
 */
const BM25_FTS5_WEIGHTS = [10.0, 5.0, 2.0, 1.0] as const;

const BM25_FIELD_WEIGHTS: Record<string, number> = {
  title: BM25_FTS5_WEIGHTS[0],
  trigger_phrases: BM25_FTS5_WEIGHTS[1],
  content_generic: BM25_FTS5_WEIGHTS[2],
  body: BM25_FTS5_WEIGHTS[3],
};

type BM25FieldWeights = Record<BM25FieldName, number>;

interface BM25DocumentFields {
  title?: string | null;
  trigger_phrases?: string | string[] | null;
  content_generic?: string | null;
  body?: string | null;
}

interface BM25SearchOptions {
  fieldWeights?: Partial<BM25FieldWeights>;
}

interface LegacyDocumentRecord {
  tokens: string[];
  termFreq: Map<string, number>;
}

interface PackedTermFrequency {
  total: number;
  fields: Record<BM25FieldName, number>;
}

interface PackedDocumentRecord {
  numericId: number;
  id: string;
  length: number;
  terms: string[];
}

interface PackedPostingMutable {
  docIds: number[];
  totalTfs: number[];
  titleTfs: number[];
  triggerTfs: number[];
  pathTfs: number[];
  bodyTfs: number[];
}

interface PackedPostingList {
  docIds: Uint32Array;
  totalTfs: Uint32Array;
  titleTfs: Uint32Array;
  triggerTfs: Uint32Array;
  pathTfs: Uint32Array;
  bodyTfs: Uint32Array;
}

/**
 * Check whether the in-memory BM25 index is enabled.
 *
 * @returns `true` when BM25 indexing/search is enabled for the current process.
 * @example
 * ```ts
 * if (isBm25Enabled()) {
 *   getIndex();
 * }
 * ```
 */
function isBm25Enabled(): boolean {
  const value = process.env.ENABLE_BM25?.trim().toLowerCase();
  if (!value) return true; // enabled by default
  if (BM25_DISABLED_VALUES.has(value)) return false;
  return BM25_ENABLED_VALUES.has(value);
}

// ───────────────────────────────────────────────────────────────
// 2. HELPERS

// ───────────────────────────────────────────────────────────────
/**
 * Count token frequency occurrences for BM25 scoring.
 *
 * @param tokens - Normalized tokens produced by {@link tokenize}.
 * @returns A frequency map keyed by token text.
 * @example
 * ```ts
 * getTermFrequencies(['memory', 'memory', 'search']).get('memory');
 * // 2
 * ```
 */
function getTermFrequencies(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const token of tokens) {
    freq.set(token, (freq.get(token) || 0) + 1);
  }
  return freq;
}

function visitBm25Tokens(text: string, visitor: (token: string) => void): void {
  if (!text || typeof text !== 'string') return;

  let token = '';
  const flush = () => {
    if (token.length >= 2 && !STOP_WORDS.has(token)) {
      visitor(simpleStem(token));
    }
    token = '';
  };

  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      token += String.fromCharCode(code + 32);
    } else if ((code >= 97 && code <= 122) || (code >= 48 && code <= 57) || code === 45 || code === 95) {
      token += text[i];
    } else if (token.length > 0) {
      flush();
    }
  }

  if (token.length > 0) {
    flush();
  }
}

function normalizeTriggerPhrasesForBM25(triggerPhrases: string | string[] | null | undefined): string {
  if (Array.isArray(triggerPhrases)) {
    return triggerPhrases
      .filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0)
      .join(' ');
  }

  if (typeof triggerPhrases !== 'string') {
    return '';
  }

  const trimmed = triggerPhrases.trim();
  if (!trimmed) {
    return '';
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed)) {
      return parsed
        .filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0)
        .join(' ');
    }
  } catch {
    // Fall back to raw string when the database value is not JSON.
  }

  return trimmed;
}

function defaultPackedTermFrequency(): PackedTermFrequency {
  return {
    total: 0,
    fields: {
      title: 0,
      trigger_phrases: 0,
      content_generic: 0,
      body: 0,
    },
  };
}

function resolveBm25FieldWeights(overrides: Partial<BM25FieldWeights> = {}): BM25FieldWeights {
  return {
    title: overrides.title ?? BM25_FIELD_WEIGHTS.title,
    trigger_phrases: overrides.trigger_phrases ?? BM25_FIELD_WEIGHTS.trigger_phrases,
    content_generic: overrides.content_generic ?? BM25_FIELD_WEIGHTS.content_generic,
    body: overrides.body ?? BM25_FIELD_WEIGHTS.body,
  };
}

function emitBm25EngineSelection(engine: Bm25Engine | InMemoryBm25Engine, reason: string): void {
  const key = `${engine}:${reason}`;
  if (BM25_ENGINE_LOGGED.has(key)) {
    return;
  }
  BM25_ENGINE_LOGGED.add(key);
  console.info(`[bm25-index] BM25 engine selected: ${engine} (${reason})`);
}

function resolveInMemoryBm25Engine(): InMemoryBm25Engine {
  const configured = resolveBm25Engine();
  if (configured === 'legacy-inmemory') {
    emitBm25EngineSelection('legacy-inmemory', 'explicit legacy in-memory flag');
    return 'legacy-inmemory';
  }

  if (configured === 'sqlite') {
    emitBm25EngineSelection('packed-inmemory', 'sqlite mode requested an in-memory fallback instance');
    return 'packed-inmemory';
  }

  if (configured === 'packed-inmemory') {
    emitBm25EngineSelection('packed-inmemory', 'explicit packed in-memory flag');
    return 'packed-inmemory';
  }

  emitBm25EngineSelection('packed-inmemory', 'auto mode fallback');
  return 'packed-inmemory';
}

function buildBm25DocumentFields(row: BM25DocumentSource): BM25DocumentFields {
  return {
    title: typeof row.title === 'string' && row.title.trim() ? row.title.trim() : '',
    body: typeof row.content_text === 'string' && row.content_text.trim()
      ? normalizeContentForBM25(row.content_text)
      : '',
    trigger_phrases: normalizeTriggerPhrasesForBM25(row.trigger_phrases),
    content_generic: typeof row.file_path === 'string' && row.file_path.trim() ? row.file_path.trim() : '',
  };
}

function buildBm25DocumentText(row: BM25DocumentSource): string {
  const textParts: string[] = [];

  if (typeof row.title === 'string' && row.title.trim()) {
    textParts.push(row.title.trim());
  }

  if (typeof row.content_text === 'string' && row.content_text.trim()) {
    textParts.push(normalizeContentForBM25(row.content_text));
  }

  const triggerPhrases = normalizeTriggerPhrasesForBM25(row.trigger_phrases);
  if (triggerPhrases) {
    textParts.push(triggerPhrases);
  }

  if (typeof row.file_path === 'string' && row.file_path.trim()) {
    textParts.push(row.file_path.trim());
  }

  return textParts.join(' ').trim();
}

// ───────────────────────────────────────────────────────────────
// 3. BM25 INDEX CLASS

// ───────────────────────────────────────────────────────────────
class BM25Index {
  private k1: number;
  private b: number;
  private engine: InMemoryBm25Engine;
  private documents: Map<string, LegacyDocumentRecord>;
  private packedDocuments: Map<string, PackedDocumentRecord>;
  private packedDocIds: string[];
  private packedDocNumbersById: Map<string, number>;
  private packedMutablePostings: Map<string, PackedPostingMutable>;
  private packedPostings: Map<string, PackedPostingList>;
  private packedDirtyTerms: Set<string>;
  private documentFreq: Map<string, number>;
  private totalDocLength: number;
  private warmupHandle: ReturnType<typeof setTimeout> | null;
  private warmupGeneration: number;

  constructor(
    k1: number = DEFAULT_K1,
    b: number = DEFAULT_B,
    engine: InMemoryBm25Engine = resolveInMemoryBm25Engine()
  ) {
    this.k1 = k1;
    this.b = b;
    this.engine = engine;
    this.documents = new Map();
    this.packedDocuments = new Map();
    this.packedDocIds = [];
    this.packedDocNumbersById = new Map();
    this.packedMutablePostings = new Map();
    this.packedPostings = new Map();
    this.packedDirtyTerms = new Set();
    this.documentFreq = new Map();
    this.totalDocLength = 0;
    this.warmupHandle = null;
    this.warmupGeneration = 0;
  }

  addDocument(id: string, text: string): void {
    if (this.engine === 'packed-inmemory') {
      this.addDocumentFields(id, { body: text });
      return;
    }

    const tokens = tokenize(text);
    const termFreq = getTermFrequencies(tokens);

    if (this.documents.has(id)) {
      this.removeDocument(id);
    }

    this.documents.set(id, { tokens, termFreq });
    this.totalDocLength += tokens.length;

    // Update document frequency
    for (const term of termFreq.keys()) {
      this.documentFreq.set(term, (this.documentFreq.get(term) || 0) + 1);
    }
  }

  addDocumentFields(id: string, fields: BM25DocumentFields): void {
    if (this.engine === 'legacy-inmemory') {
      this.addDocument(id, this.joinDocumentFields(fields));
      return;
    }

    if (this.packedDocuments.has(id)) {
      this.removeDocument(id);
    }

    const termFreq = this.getPackedTermFrequencies(fields);
    const length = Array.from(termFreq.values()).reduce((sum, freq) => sum + freq.total, 0);
    if (length === 0) {
      return;
    }

    const numericId = this.getPackedNumericId(id);
    this.packedDocuments.set(id, { numericId, id, length, terms: Array.from(termFreq.keys()) });
    this.totalDocLength += length;

    for (const [term, frequency] of termFreq) {
      const postings = this.ensurePackedMutablePostings(term);
      this.setPackedMutablePosting(postings, numericId, frequency);
      this.packedDirtyTerms.add(term);
      this.documentFreq.set(term, (this.documentFreq.get(term) || 0) + 1);
    }
  }

  removeDocument(id: string): boolean {
    if (this.engine === 'packed-inmemory') {
      return this.removePackedDocument(id);
    }

    const doc = this.documents.get(id);
    if (!doc) return false;

    this.totalDocLength -= doc.tokens.length;

    for (const term of doc.termFreq.keys()) {
      const count = this.documentFreq.get(term) || 0;
      if (count <= 1) {
        this.documentFreq.delete(term);
      } else {
        this.documentFreq.set(term, count - 1);
      }
    }

    this.documents.delete(id);
    return true;
  }

  calculateIdf(term: string): number {
    const n = this.getDocumentCount();
    const df = this.documentFreq.get(term) || 0;
    if (df === 0 || n === 0) return 0;
    return Math.log((n - df + 0.5) / (df + 0.5) + 1);
  }

  calculateScore(queryTokens: string[], docId: string, options: BM25SearchOptions = {}): number {
    if (this.engine === 'packed-inmemory') {
      return this.calculatePackedScore(queryTokens, docId, options);
    }

    const doc = this.documents.get(docId);
    if (!doc) return 0;

    const avgDl = this.getAverageDocumentLength();
    const dl = doc.tokens.length;

    let score = 0;
    for (const term of queryTokens) {
      const tf = doc.termFreq.get(term) || 0;
      if (tf === 0) continue;

      const idf = this.calculateIdf(term);
      const numerator = tf * (this.k1 + 1);
      const denominator = tf + this.k1 * (1 - this.b + this.b * (dl / Math.max(avgDl, 1)));
      score += idf * (numerator / denominator);
    }

    return score;
  }

  search(query: string, limit: number = 10, options: BM25SearchOptions = {}): BM25SearchResult[] {
    const queryTokens = normalizeLexicalQueryTokens(query).bm25;
    if (queryTokens.length === 0) return [];

    if (this.engine === 'packed-inmemory') {
      return this.searchPacked(queryTokens, limit, options);
    }

    const results: BM25SearchResult[] = [];

    for (const [id] of this.documents) {
      const score = this.calculateScore(queryTokens, id);
      if (score > 0) {
        results.push({ id, score });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  getStats(): BM25Stats {
    return {
      documentCount: this.getDocumentCount(),
      termCount: this.documentFreq.size,
      avgDocLength: this.getAverageDocumentLength(),
    };
  }

  clear(): void {
    this.cancelWarmup();
    this.documents.clear();
    this.packedDocuments.clear();
    this.packedDocIds = [];
    this.packedDocNumbersById.clear();
    this.packedMutablePostings.clear();
    this.packedPostings.clear();
    this.packedDirtyTerms.clear();
    this.documentFreq.clear();
    this.totalDocLength = 0;
  }

  addDocuments(docs: Array<{ id: string; text: string }>): void {
    for (const doc of docs) {
      this.addDocument(doc.id, doc.text);
    }
  }

  finalizePackedPostings(): void {
    if (this.engine === 'legacy-inmemory') {
      return;
    }

    for (const term of Array.from(this.packedDirtyTerms)) {
      this.getPackedPosting(term);
    }
    this.packedMutablePostings.clear();
  }

  /**
   * Incrementally synchronize changed rows from the database into the in-memory index.
   */
  syncChangedRows(database: Database.Database, rowIds: Array<number | string>): number {
    const normalizedIds = Array.from(
      new Set(
        rowIds
          .map((rowId) => Number(rowId))
          .filter((rowId) => Number.isInteger(rowId) && rowId > 0)
      )
    );

    if (normalizedIds.length === 0) {
      return 0;
    }

    try {
      const placeholders = normalizedIds.map(() => '?').join(', ');
      const rows = (database.prepare(
        `SELECT id, title, content_text, trigger_phrases, file_path
         FROM memory_index
         WHERE id IN (${placeholders})`
      ) as Database.Statement).all(...normalizedIds) as Array<{
        id: number;
        title: string | null;
        content_text: string | null;
        trigger_phrases: string | null;
        file_path: string | null;
      }>;

      const activeRowMap = new Map<number, typeof rows[number]>();
      for (const row of rows) {
        activeRowMap.set(row.id, row);
      }

      for (const rowId of normalizedIds) {
        const row = activeRowMap.get(rowId);
        if (!row) {
          this.removeDocument(String(rowId));
          continue;
        }

        const fields = buildBm25DocumentFields(row);
        if (this.joinDocumentFields(fields).trim()) {
          this.addDocumentFields(String(row.id), fields);
        } else {
          this.removeDocument(String(row.id));
        }
      }

      return normalizedIds.length;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[bm25-index] Failed to sync BM25 rows: ${msg}`);
      return 0;
    }
  }

  /**
   * Defer full startup warmup into batched row-ID syncs so process
   * initialization is not blocked by a monolithic in-memory rebuild.
   */
  rebuildFromDatabase(database: Database.Database): number {
    this.clear();

    try {
      const rows = (database.prepare(
        `SELECT id
         FROM memory_index
         ORDER BY id`
      ) as Database.Statement).all() as Array<{ id: number }>;

      const pendingIds = rows.map((row) => row.id);
      if (pendingIds.length === 0) {
        return 0;
      }

      const warmupGeneration = ++this.warmupGeneration;
      const processBatch = () => {
        if (warmupGeneration !== this.warmupGeneration) {
          return;
        }

        const batchIds = pendingIds.splice(0, BM25_WARMUP_BATCH_SIZE);
        if (batchIds.length === 0) {
          this.finalizePackedPostings();
          this.warmupHandle = null;
          return;
        }

        this.syncChangedRows(database, batchIds);

        if (pendingIds.length > 0) {
          this.warmupHandle = registerTimeout(processBatch, 0, { unref: true });
        } else {
          // The queue drains on the last non-empty batch, so the empty-batch
          // finalize above never runs on this path. Finalize here too, or the
          // whole corpus stays in mutable number[] postings and the packed
          // engine's RAM bound is lost until every term is searched.
          this.finalizePackedPostings();
          this.warmupHandle = null;
        }
      };

      this.warmupHandle = registerTimeout(processBatch, 0, { unref: true });
      return pendingIds.length;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[bm25-index] Failed to schedule BM25 warmup: ${msg}`);
      return 0;
    }
  }

  cancelWarmup(): void {
    this.warmupGeneration += 1;
    if (this.warmupHandle) {
      clearRegisteredTimer(this.warmupHandle);
      this.warmupHandle = null;
    }
  }

  private getDocumentCount(): number {
    return this.engine === 'packed-inmemory' ? this.packedDocuments.size : this.documents.size;
  }

  private getAverageDocumentLength(): number {
    const documentCount = this.getDocumentCount();
    return documentCount > 0 ? this.totalDocLength / documentCount : 0;
  }

  private joinDocumentFields(fields: BM25DocumentFields): string {
    const parts: string[] = [];
    for (const fieldName of BM25_FIELD_NAMES) {
      const value = fields[fieldName];
      if (Array.isArray(value)) {
        parts.push(value.join(' '));
      } else if (typeof value === 'string' && value.trim()) {
        parts.push(value.trim());
      }
    }
    return parts.join(' ').trim();
  }

  private getPackedNumericId(id: string): number {
    const existing = this.packedDocNumbersById.get(id);
    if (existing !== undefined) {
      return existing;
    }

    const numericId = this.packedDocIds.length;
    this.packedDocIds.push(id);
    this.packedDocNumbersById.set(id, numericId);
    return numericId;
  }

  private getPackedTermFrequencies(fields: BM25DocumentFields): Map<string, PackedTermFrequency> {
    const termFreq = new Map<string, PackedTermFrequency>();

    for (const fieldName of BM25_FIELD_NAMES) {
      const rawValue = fields[fieldName];
      const text = Array.isArray(rawValue) ? rawValue.join(' ') : (rawValue ?? '');
      visitBm25Tokens(text, (token) => {
        let frequency = termFreq.get(token);
        if (!frequency) {
          frequency = defaultPackedTermFrequency();
          termFreq.set(token, frequency);
        }
        frequency.total += 1;
        frequency.fields[fieldName] += 1;
      });
    }

    return termFreq;
  }

  private removePackedDocument(id: string): boolean {
    const doc = this.packedDocuments.get(id);
    if (!doc) return false;

    this.totalDocLength -= doc.length;

    for (const term of doc.terms) {
      const postings = this.ensurePackedMutablePostings(term);
      this.deletePackedMutablePosting(postings, doc.numericId);
      this.packedDirtyTerms.add(term);

      const count = this.documentFreq.get(term) || 0;
      if (count <= 1) {
        this.documentFreq.delete(term);
        this.packedMutablePostings.delete(term);
        this.packedPostings.delete(term);
      } else {
        this.documentFreq.set(term, count - 1);
      }
    }

    this.packedDocuments.delete(id);
    return true;
  }

  private getPackedPosting(term: string): PackedPostingList | undefined {
    if (!this.packedDirtyTerms.has(term)) {
      return this.packedPostings.get(term);
    }

    const mutable = this.packedMutablePostings.get(term);
    if (!mutable || mutable.docIds.length === 0) {
      this.packedDirtyTerms.delete(term);
      this.packedPostings.delete(term);
      return undefined;
    }

    this.sortPackedMutablePosting(mutable);

    const packed: PackedPostingList = {
      docIds: Uint32Array.from(mutable.docIds),
      totalTfs: Uint32Array.from(mutable.totalTfs),
      titleTfs: Uint32Array.from(mutable.titleTfs),
      triggerTfs: Uint32Array.from(mutable.triggerTfs),
      pathTfs: Uint32Array.from(mutable.pathTfs),
      bodyTfs: Uint32Array.from(mutable.bodyTfs),
    };
    this.packedPostings.set(term, packed);
    // Free the mutable copy once packed; ensurePackedMutablePostings rehydrates
    // from the typed arrays on the next mutation, so keeping it only costs RAM.
    this.packedMutablePostings.delete(term);
    this.packedDirtyTerms.delete(term);
    return packed;
  }

  private ensurePackedMutablePostings(term: string): PackedPostingMutable {
    const existing = this.packedMutablePostings.get(term);
    if (existing) {
      return existing;
    }

    const hydrated: PackedPostingMutable = {
      docIds: [],
      totalTfs: [],
      titleTfs: [],
      triggerTfs: [],
      pathTfs: [],
      bodyTfs: [],
    };
    const packed = this.packedPostings.get(term);
    if (packed) {
      for (let i = 0; i < packed.docIds.length; i += 1) {
        hydrated.docIds.push(packed.docIds[i]);
        hydrated.totalTfs.push(packed.totalTfs[i]);
        hydrated.titleTfs.push(packed.titleTfs[i]);
        hydrated.triggerTfs.push(packed.triggerTfs[i]);
        hydrated.pathTfs.push(packed.pathTfs[i]);
        hydrated.bodyTfs.push(packed.bodyTfs[i]);
      }
    }

    this.packedMutablePostings.set(term, hydrated);
    return hydrated;
  }

  private setPackedMutablePosting(
    postings: PackedPostingMutable,
    numericId: number,
    frequency: PackedTermFrequency
  ): void {
    const existingIndex = postings.docIds.indexOf(numericId);
    if (existingIndex >= 0) {
      postings.totalTfs[existingIndex] = frequency.total;
      postings.titleTfs[existingIndex] = frequency.fields.title;
      postings.triggerTfs[existingIndex] = frequency.fields.trigger_phrases;
      postings.pathTfs[existingIndex] = frequency.fields.content_generic;
      postings.bodyTfs[existingIndex] = frequency.fields.body;
      return;
    }

    postings.docIds.push(numericId);
    postings.totalTfs.push(frequency.total);
    postings.titleTfs.push(frequency.fields.title);
    postings.triggerTfs.push(frequency.fields.trigger_phrases);
    postings.pathTfs.push(frequency.fields.content_generic);
    postings.bodyTfs.push(frequency.fields.body);
  }

  private deletePackedMutablePosting(postings: PackedPostingMutable, numericId: number): void {
    const index = postings.docIds.indexOf(numericId);
    if (index < 0) {
      return;
    }
    postings.docIds.splice(index, 1);
    postings.totalTfs.splice(index, 1);
    postings.titleTfs.splice(index, 1);
    postings.triggerTfs.splice(index, 1);
    postings.pathTfs.splice(index, 1);
    postings.bodyTfs.splice(index, 1);
  }

  private sortPackedMutablePosting(postings: PackedPostingMutable): void {
    const order = postings.docIds.map((docId, index) => ({ docId, index }));
    order.sort((a, b) => a.docId - b.docId);

    postings.docIds = order.map((entry) => entry.docId);
    postings.totalTfs = order.map((entry) => postings.totalTfs[entry.index]);
    postings.titleTfs = order.map((entry) => postings.titleTfs[entry.index]);
    postings.triggerTfs = order.map((entry) => postings.triggerTfs[entry.index]);
    postings.pathTfs = order.map((entry) => postings.pathTfs[entry.index]);
    postings.bodyTfs = order.map((entry) => postings.bodyTfs[entry.index]);
  }

  private calculatePackedScore(
    queryTokens: string[],
    docId: string,
    options: BM25SearchOptions
  ): number {
    const doc = this.packedDocuments.get(docId);
    if (!doc) return 0;

    const weights = resolveBm25FieldWeights(options.fieldWeights);
    const avgDl = Math.max(this.getAverageDocumentLength(), 1);
    let score = 0;

    for (const term of queryTokens) {
      const postings = this.getPackedPosting(term);
      if (!postings) continue;
      const postingIndex = this.findPackedPostingIndex(postings, doc.numericId);
      if (postingIndex < 0) continue;

      const weightedTf = this.calculateWeightedPostingFrequency(postings, postingIndex, weights);
      if (weightedTf <= 0) continue;

      const idf = this.calculateIdf(term);
      score += this.calculateBm25TermScore(weightedTf, doc.length, avgDl, idf);
    }

    return score;
  }

  private searchPacked(
    queryTokens: string[],
    limit: number,
    options: BM25SearchOptions
  ): BM25SearchResult[] {
    const weights = resolveBm25FieldWeights(options.fieldWeights);
    const avgDl = Math.max(this.getAverageDocumentLength(), 1);
    const scores = new Map<number, number>();

    for (const term of queryTokens) {
      const postings = this.getPackedPosting(term);
      if (!postings) continue;

      const idf = this.calculateIdf(term);
      for (let i = 0; i < postings.docIds.length; i += 1) {
        const numericId = postings.docIds[i];
        const id = this.packedDocIds[numericId];
        if (!id) continue;
        const doc = this.packedDocuments.get(id);
        if (!doc) continue;

        const weightedTf = this.calculateWeightedPostingFrequency(postings, i, weights);
        if (weightedTf <= 0) continue;

        const termScore = this.calculateBm25TermScore(weightedTf, doc.length, avgDl, idf);
        scores.set(numericId, (scores.get(numericId) || 0) + termScore);
      }
    }

    return Array.from(scores.entries())
      .map(([numericId, score]) => ({ id: this.packedDocIds[numericId], score }))
      .filter((result): result is BM25SearchResult => typeof result.id === 'string' && result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private calculateWeightedPostingFrequency(
    postings: PackedPostingList,
    index: number,
    weights: BM25FieldWeights
  ): number {
    return (
      postings.titleTfs[index] * weights.title +
      postings.triggerTfs[index] * weights.trigger_phrases +
      postings.pathTfs[index] * weights.content_generic +
      postings.bodyTfs[index] * weights.body
    );
  }

  private findPackedPostingIndex(postings: PackedPostingList, numericId: number): number {
    let low = 0;
    let high = postings.docIds.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const value = postings.docIds[mid];
      if (value === numericId) return mid;
      if (value < numericId) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return -1;
  }

  private calculateBm25TermScore(tf: number, dl: number, avgDl: number, idf: number): number {
    const numerator = tf * (this.k1 + 1);
    const denominator = tf + this.k1 * (1 - this.b + this.b * (dl / avgDl));
    return idf * (numerator / denominator);
  }
}

// ───────────────────────────────────────────────────────────────
// 4. SINGLETON

// ───────────────────────────────────────────────────────────────
let indexInstance: BM25Index | null = null;

/**
 * Retrieve the shared in-memory BM25 index singleton.
 *
 * @returns The process-wide {@link BM25Index} instance.
 * @example
 * ```ts
 * const index = getIndex();
 * index.addDocument('123', 'memory search');
 * ```
 */
function getIndex(): BM25Index {
  if (!indexInstance) {
    indexInstance = new BM25Index();
  }
  return indexInstance;
}

/**
 * Reset the shared BM25 index singleton.
 *
 * @returns Nothing.
 * @example
 * ```ts
 * resetIndex();
 * ```
 */
function resetIndex(): void {
  indexInstance?.cancelWarmup();
  indexInstance = null;
}

// ───────────────────────────────────────────────────────────────
// 5. LEXICAL ENGINE ROUTING

// ───────────────────────────────────────────────────────────────
function resolveBm25Engine(): Bm25Engine {
  const value = process.env.SPECKIT_BM25_ENGINE?.trim().toLowerCase();
  if (!value) {
    return 'auto';
  }

  if ((BM25_ENGINE_VALUES as readonly string[]).includes(value)) {
    return value as Bm25Engine;
  }

  console.warn(`[bm25-index] Unsupported SPECKIT_BM25_ENGINE=${value}; falling back to auto`);
  return 'auto';
}

function isMemoryFtsAvailable(database: Database.Database | null | undefined): boolean {
  if (!database) {
    return false;
  }

  try {
    const result = (database.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
    ) as Database.Statement).get() as { name: string } | undefined;
    return !!result;
  } catch {
    return false;
  }
}

function shouldWarmInMemoryBm25(database: Database.Database | null | undefined): boolean {
  if (!isBm25Enabled()) {
    return false;
  }

  const engine = resolveBm25Engine();
  emitBm25EngineSelection(engine, 'warmup routing');
  if (engine === 'sqlite') {
    if (!isMemoryFtsAvailable(database)) {
      throw new Error('SPECKIT_BM25_ENGINE=sqlite requires the memory_fts table; JS BM25 warmup is disabled in sqlite mode');
    }
    return false;
  }

  if (engine === 'auto') {
    return !isMemoryFtsAvailable(database);
  }

  if (engine === 'packed-inmemory') {
    return true;
  }

  return true;
}

function shouldUseSqliteLexicalEngine(database: Database.Database | null | undefined): boolean {
  const engine = resolveBm25Engine();
  emitBm25EngineSelection(engine, 'lexical routing');
  if (engine === 'sqlite') {
    if (!isMemoryFtsAvailable(database)) {
      throw new Error('SPECKIT_BM25_ENGINE=sqlite requires the memory_fts table for lexical BM25 search');
    }
    return true;
  }

  if (engine === 'auto') {
    return isMemoryFtsAvailable(database);
  }

  return false;
}

function getBm25EngineStatus(database: Database.Database | null | undefined = null): {
  lexical_engine: Bm25Engine;
  fts5_available: boolean;
  warms_in_memory_bm25: boolean;
  bm25_enabled: boolean;
} {
  const lexical_engine = resolveBm25Engine();
  const fts5_available = isMemoryFtsAvailable(database);
  let warms_in_memory_bm25 = false;

  try {
    warms_in_memory_bm25 = shouldWarmInMemoryBm25(database);
  } catch {
    warms_in_memory_bm25 = false;
  }

  return {
    lexical_engine,
    fts5_available,
    warms_in_memory_bm25,
    bm25_enabled: isBm25Enabled(),
  };
}

// ───────────────────────────────────────────────────────────────
// 6. EXPORTS

// ───────────────────────────────────────────────────────────────
export {
  BM25Index,
  getIndex,
  resetIndex,
  tokenize,
  simpleStem,
  getTermFrequencies,
  isBm25Enabled,
  resolveBm25Engine,
  isMemoryFtsAvailable,
  shouldWarmInMemoryBm25,
  shouldUseSqliteLexicalEngine,
  getBm25EngineStatus,
  sanitizeQueryTokens,
  sanitizeFTS5Query,
  normalizeLexicalQueryTokens,
  buildBm25DocumentText,
  buildBm25DocumentFields,
  DEFAULT_K1,
  DEFAULT_B,
  BM25_FTS5_WEIGHTS,
  BM25_FIELD_WEIGHTS,
};

export type {
  BM25SearchResult,
  BM25Stats,
  BM25DocumentSource,
  BM25DocumentFields,
  BM25FieldWeights,
  BM25SearchOptions,
  Bm25Engine,
  InMemoryBm25Engine,
  NormalizedLexicalQueryTokens,
};
