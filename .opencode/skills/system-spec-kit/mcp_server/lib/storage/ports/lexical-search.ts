// -------------------------------------------------------------------
// MODULE: Storage Ports - Lexical Search
// -------------------------------------------------------------------

import {
  BM25Index,
  buildBm25DocumentFields,
  type BM25DocumentFields,
  type BM25DocumentSource,
  type BM25FieldWeights,
  type BM25SearchResult,
  type BM25Stats,
  type InMemoryBm25Engine,
} from '../../search/bm25-index.js';

/** Fielded document payload accepted by lexical search indexes. */
export type LexicalDocumentFields = BM25DocumentFields;

/** Source row shape that can be normalized into lexical document fields. */
export type LexicalDocumentSource = BM25DocumentSource;

/** Ranked lexical search result. */
export type LexicalSearchResult = BM25SearchResult;

/** Lexical index statistics. */
export type LexicalSearchStats = BM25Stats;

/** Query-time options for lexical scoring. */
export interface LexicalSearchOptions {
  readonly limit?: number;
  readonly fieldWeights?: Partial<BM25FieldWeights>;
}

/**
 * Port for document indexing and ranked lexical retrieval.
 * Implementations may use SQLite FTS, in-memory BM25, or a test double.
 */
export interface LexicalSearch {
  /** Index a plain-text document body. */
  addDocument(id: string, text: string): void;

  /** Index a fielded document with title, trigger, path, and body signals. */
  addDocumentFields(id: string, fields: LexicalDocumentFields): void;

  /** Remove a document from the lexical index. */
  removeDocument(id: string): boolean;

  /** Search indexed documents by query text. */
  search(query: string, options?: LexicalSearchOptions): LexicalSearchResult[];

  /** Return current index statistics. */
  getStats(): LexicalSearchStats;

  /** Clear all indexed documents. */
  clear(): void;
}

/** Packed BM25 lexical-search adapter over the shipped in-memory engine. */
export class PackedBm25LexicalSearch implements LexicalSearch {
  private readonly index: BM25Index;

  constructor(engine: InMemoryBm25Engine = 'packed-inmemory') {
    this.index = new BM25Index(undefined, undefined, engine);
  }

  addDocument(id: string, text: string): void {
    this.index.addDocument(id, text);
  }

  addDocumentFields(id: string, fields: LexicalDocumentFields): void {
    this.index.addDocumentFields(id, fields);
  }

  addDocumentSource(id: string, source: LexicalDocumentSource): void {
    this.addDocumentFields(id, buildBm25DocumentFields(source));
  }

  removeDocument(id: string): boolean {
    return this.index.removeDocument(id);
  }

  search(query: string, options: LexicalSearchOptions = {}): LexicalSearchResult[] {
    return this.index.search(query, options.limit, { fieldWeights: options.fieldWeights });
  }

  getStats(): LexicalSearchStats {
    return this.index.getStats();
  }

  clear(): void {
    this.index.clear();
  }

  finalize(): void {
    this.index.finalizePackedPostings();
  }
}
