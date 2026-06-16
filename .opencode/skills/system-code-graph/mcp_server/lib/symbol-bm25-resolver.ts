// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Symbol BM25 Resolver
// ───────────────────────────────────────────────────────────────
// Optional, fallback-only symbol candidate scoring over indexed symbol fields.

export const CODE_GRAPH_BM25_SYMBOL_RESOLVER_ENV = 'SPECKIT_CODE_GRAPH_BM25_SYMBOL_RESOLVER';

const BM25_K1 = 1.2;
const BM25_B = 0.75;
const DEFAULT_LIMIT = 5;
const ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on', 'experimental', 'fallback']);

const SYMBOL_BM25_FIELD_NAMES = [
  'name',
  'fqName',
  'signature',
  'docstring',
  'filePath',
] as const;

export type SymbolBm25FieldName = typeof SYMBOL_BM25_FIELD_NAMES[number];
export type SymbolBm25FieldWeights = Record<SymbolBm25FieldName, number>;

export const SYMBOL_BM25_FIELD_WEIGHTS: SymbolBm25FieldWeights = {
  name: 4.0,
  fqName: 3.2,
  signature: 2.0,
  filePath: 1.2,
  docstring: 0.7,
};

export interface SymbolBm25Document {
  readonly symbolId: string;
  readonly fqName: string | null;
  readonly name: string | null;
  readonly kind: string | null;
  readonly filePath: string | null;
  readonly startLine: number | null;
  readonly signature: string | null;
  readonly docstring: string | null;
}

export interface SymbolBm25SearchOptions {
  readonly fieldWeights?: Partial<SymbolBm25FieldWeights>;
  readonly limit?: number;
}

export interface SymbolBm25Candidate {
  readonly symbolId: string;
  readonly fqName: string | null;
  readonly name: string | null;
  readonly kind: string | null;
  readonly filePath: string | null;
  readonly startLine: number | null;
  readonly score: number;
  readonly rawScore: number;
  readonly evidence: readonly string[];
  readonly disambiguationOnly: true;
}

export interface SymbolBm25FootprintStats {
  readonly documentCount: number;
  readonly termCount: number;
  readonly postingCount: number;
  readonly typedArrayBytes: number;
  readonly mutablePostingCount: number;
}

interface FieldTermFrequency {
  total: number;
  fields: Record<SymbolBm25FieldName, number>;
}

interface PackedSymbolDocument extends SymbolBm25Document {
  numericId: number;
  length: number;
}

interface PackedPostingMutable {
  docIds: number[];
  nameTfs: number[];
  fqNameTfs: number[];
  signatureTfs: number[];
  docstringTfs: number[];
  filePathTfs: number[];
}

interface PackedPostingList {
  docIds: Uint32Array;
  nameTfs: Uint32Array;
  fqNameTfs: Uint32Array;
  signatureTfs: Uint32Array;
  docstringTfs: Uint32Array;
  filePathTfs: Uint32Array;
}

function emptyFieldFrequency(): FieldTermFrequency {
  return {
    total: 0,
    fields: {
      name: 0,
      fqName: 0,
      signature: 0,
      docstring: 0,
      filePath: 0,
    },
  };
}

function resolveFieldWeights(overrides: Partial<SymbolBm25FieldWeights> = {}): SymbolBm25FieldWeights {
  return {
    name: overrides.name ?? SYMBOL_BM25_FIELD_WEIGHTS.name,
    fqName: overrides.fqName ?? SYMBOL_BM25_FIELD_WEIGHTS.fqName,
    signature: overrides.signature ?? SYMBOL_BM25_FIELD_WEIGHTS.signature,
    docstring: overrides.docstring ?? SYMBOL_BM25_FIELD_WEIGHTS.docstring,
    filePath: overrides.filePath ?? SYMBOL_BM25_FIELD_WEIGHTS.filePath,
  };
}

export function isCodeGraphBm25SymbolResolverEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const value = env[CODE_GRAPH_BM25_SYMBOL_RESOLVER_ENV]?.trim().toLowerCase();
  return value ? ENABLED_VALUES.has(value) : false;
}

function splitIdentifier(value: string): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2);
}

function trigrams(token: string): string[] {
  if (token.length < 4) return [];
  const grams: string[] = [];
  for (let index = 0; index <= token.length - 3; index += 1) {
    grams.push(`tri:${token.slice(index, index + 3)}`);
  }
  return grams;
}

function tokenize(value: string | null | undefined): string[] {
  if (!value) return [];
  const baseTokens = splitIdentifier(value);
  return baseTokens.flatMap((token) => [token, ...trigrams(token)]);
}

function documentFields(document: SymbolBm25Document): Record<SymbolBm25FieldName, readonly string[]> {
  return {
    name: [document.name ?? ''],
    fqName: [document.fqName ?? ''],
    signature: [document.signature ?? ''],
    docstring: [document.docstring ?? ''],
    filePath: [document.filePath ?? ''],
  };
}

function fieldTermFrequencies(document: SymbolBm25Document): Map<string, FieldTermFrequency> {
  const frequencies = new Map<string, FieldTermFrequency>();
  for (const fieldName of SYMBOL_BM25_FIELD_NAMES) {
    for (const value of documentFields(document)[fieldName]) {
      for (const token of tokenize(value)) {
        let frequency = frequencies.get(token);
        if (!frequency) {
          frequency = emptyFieldFrequency();
          frequencies.set(token, frequency);
        }
        frequency.total += 1;
        frequency.fields[fieldName] += 1;
      }
    }
  }
  return frequencies;
}

function weightedFrequency(
  postings: PackedPostingList,
  index: number,
  weights: SymbolBm25FieldWeights,
): number {
  return postings.nameTfs[index] * weights.name
    + postings.fqNameTfs[index] * weights.fqName
    + postings.signatureTfs[index] * weights.signature
    + postings.docstringTfs[index] * weights.docstring
    + postings.filePathTfs[index] * weights.filePath;
}

function topWeightedFields(
  postings: PackedPostingList,
  index: number,
  weights: SymbolBm25FieldWeights,
): SymbolBm25FieldName[] {
  return [
    { field: 'name' as const, value: postings.nameTfs[index] * weights.name },
    { field: 'fqName' as const, value: postings.fqNameTfs[index] * weights.fqName },
    { field: 'signature' as const, value: postings.signatureTfs[index] * weights.signature },
    { field: 'filePath' as const, value: postings.filePathTfs[index] * weights.filePath },
    { field: 'docstring' as const, value: postings.docstringTfs[index] * weights.docstring },
  ]
    .filter((entry) => entry.value > 0)
    .sort((left, right) => right.value - left.value)
    .map((entry) => entry.field)
    .slice(0, 3);
}

export class SymbolPackedBm25Index {
  private readonly symbolIds: string[] = [];
  private readonly symbolNumbersById = new Map<string, number>();
  private readonly documents = new Map<string, PackedSymbolDocument>();
  private readonly documentFreq = new Map<string, number>();
  private readonly mutablePostings = new Map<string, PackedPostingMutable>();
  private readonly packedPostings = new Map<string, PackedPostingList>();
  private totalDocumentLength = 0;

  constructor(documents: readonly SymbolBm25Document[] = []) {
    for (const document of documents) {
      this.addDocument(document);
    }
    this.finalize();
  }

  addDocument(document: SymbolBm25Document): void {
    // Idempotency guard: re-adding an already-indexed symbolId would
    // double-count totalDocumentLength and re-append postings under the same
    // numericId, corrupting averageLength and per-term scoring. The production
    // caller (querySymbolIndexRows) dedups via a UNIQUE symbol_id column, but
    // the exported index must stay safe for arbitrary direct callers.
    if (this.symbolNumbersById.has(document.symbolId)) return;
    const frequencies = fieldTermFrequencies(document);
    const length = Array.from(frequencies.values()).reduce((total, frequency) => total + frequency.total, 0);
    if (length === 0) return;

    const numericId = this.nextNumericId(document.symbolId);
    this.documents.set(document.symbolId, { ...document, numericId, length });
    this.totalDocumentLength += length;

    for (const term of [...frequencies.keys()].sort()) {
      const frequency = frequencies.get(term);
      if (!frequency) continue;
      this.documentFreq.set(term, (this.documentFreq.get(term) ?? 0) + 1);
      const postings = this.ensureMutablePostings(term);
      postings.docIds.push(numericId);
      postings.nameTfs.push(frequency.fields.name);
      postings.fqNameTfs.push(frequency.fields.fqName);
      postings.signatureTfs.push(frequency.fields.signature);
      postings.docstringTfs.push(frequency.fields.docstring);
      postings.filePathTfs.push(frequency.fields.filePath);
    }
  }

  finalize(): void {
    for (const [term, postings] of this.mutablePostings.entries()) {
      const order = postings.docIds.map((docId, index) => ({ docId, index }))
        .sort((left, right) => left.docId - right.docId);
      this.packedPostings.set(term, {
        docIds: Uint32Array.from(order.map((entry) => entry.docId)),
        nameTfs: Uint32Array.from(order.map((entry) => postings.nameTfs[entry.index])),
        fqNameTfs: Uint32Array.from(order.map((entry) => postings.fqNameTfs[entry.index])),
        signatureTfs: Uint32Array.from(order.map((entry) => postings.signatureTfs[entry.index])),
        docstringTfs: Uint32Array.from(order.map((entry) => postings.docstringTfs[entry.index])),
        filePathTfs: Uint32Array.from(order.map((entry) => postings.filePathTfs[entry.index])),
      });
    }
    this.mutablePostings.clear();
  }

  search(query: string, options: SymbolBm25SearchOptions = {}): SymbolBm25Candidate[] {
    const queryTerms = [...new Set(tokenize(query))];
    if (queryTerms.length === 0 || this.documents.size === 0) return [];

    const weights = resolveFieldWeights(options.fieldWeights);
    const scores = new Map<number, { rawScore: number; evidence: string[] }>();
    const averageLength = Math.max(this.totalDocumentLength / this.documents.size, 1);

    for (const term of queryTerms) {
      const postings = this.packedPostings.get(term);
      if (!postings) continue;
      const idf = this.idf(term);
      for (let index = 0; index < postings.docIds.length; index += 1) {
        const numericId = postings.docIds[index];
        const symbolId = this.symbolIds[numericId];
        const document = symbolId ? this.documents.get(symbolId) : undefined;
        if (!document) continue;
        const weightedTf = weightedFrequency(postings, index, weights);
        if (weightedTf <= 0) continue;

        const termScore = idf * ((weightedTf * (BM25_K1 + 1))
          / (weightedTf + BM25_K1 * (1 - BM25_B + BM25_B * (document.length / averageLength))));
        const existing = scores.get(numericId) ?? { rawScore: 0, evidence: [] };
        existing.rawScore += termScore;
        if (existing.evidence.length < 6) {
          existing.evidence.push(`bm25:${term}`);
          for (const field of topWeightedFields(postings, index, weights)) {
            if (existing.evidence.length >= 6) break;
            existing.evidence.push(`field:${field}`);
          }
        }
        scores.set(numericId, existing);
      }
    }

    const matches = [...scores.entries()]
      .flatMap(([numericId, result]) => {
        const symbolId = this.symbolIds[numericId];
        const document = symbolId ? this.documents.get(symbolId) : undefined;
        if (!document) return [];
        return [{
          symbolId: document.symbolId,
          fqName: document.fqName,
          name: document.name,
          kind: document.kind,
          filePath: document.filePath,
          startLine: document.startLine,
          rawScore: Number(result.rawScore.toFixed(6)),
          score: Number((result.rawScore / (result.rawScore + 4)).toFixed(6)),
          evidence: result.evidence,
          disambiguationOnly: true,
        } satisfies SymbolBm25Candidate];
      })
      .filter((match) => match.score > 0);

    return matches
      .sort((left, right) => right.score - left.score
        || (left.filePath ?? '').localeCompare(right.filePath ?? '')
        || (left.startLine ?? Number.MAX_SAFE_INTEGER) - (right.startLine ?? Number.MAX_SAFE_INTEGER)
        || left.symbolId.localeCompare(right.symbolId))
      .slice(0, options.limit ?? DEFAULT_LIMIT);
  }

  getFootprintStats(): SymbolBm25FootprintStats {
    let postingCount = 0;
    let typedArrayBytes = 0;
    for (const postings of this.packedPostings.values()) {
      postingCount += postings.docIds.length;
      typedArrayBytes += postings.docIds.byteLength
        + postings.nameTfs.byteLength
        + postings.fqNameTfs.byteLength
        + postings.signatureTfs.byteLength
        + postings.docstringTfs.byteLength
        + postings.filePathTfs.byteLength;
    }
    return {
      documentCount: this.documents.size,
      termCount: this.packedPostings.size,
      postingCount,
      typedArrayBytes,
      mutablePostingCount: this.mutablePostings.size,
    };
  }

  private nextNumericId(symbolId: string): number {
    const existing = this.symbolNumbersById.get(symbolId);
    if (existing !== undefined) return existing;
    const numericId = this.symbolIds.length;
    this.symbolIds.push(symbolId);
    this.symbolNumbersById.set(symbolId, numericId);
    return numericId;
  }

  private ensureMutablePostings(term: string): PackedPostingMutable {
    const existing = this.mutablePostings.get(term);
    if (existing) return existing;
    const postings: PackedPostingMutable = {
      docIds: [],
      nameTfs: [],
      fqNameTfs: [],
      signatureTfs: [],
      docstringTfs: [],
      filePathTfs: [],
    };
    this.mutablePostings.set(term, postings);
    return postings;
  }

  private idf(term: string): number {
    const docFreq = this.documentFreq.get(term) ?? 0;
    return Math.log(1 + (this.documents.size - docFreq + 0.5) / (docFreq + 0.5));
  }
}

export function resolveSymbolBm25Candidates(
  query: string,
  documents: readonly SymbolBm25Document[],
  options: SymbolBm25SearchOptions = {},
): SymbolBm25Candidate[] {
  return new SymbolPackedBm25Index(documents).search(query, options);
}
