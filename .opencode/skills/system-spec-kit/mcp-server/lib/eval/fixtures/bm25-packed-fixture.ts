// ───────────────────────────────────────────────────────────────
// MODULE: BM25 Packed Engine Fixtures
// ───────────────────────────────────────────────────────────────
import type { BM25ComparisonQuery } from '../bm25-baseline.js';

interface BM25PackedFixtureDocument {
  id: number;
  title: string;
  content_text: string;
  trigger_phrases: string[];
  file_path: string;
}

interface CorpusFixtureOptions {
  documentCount?: number;
  targetIndexedBytes?: number;
}

/**
 * Synthetic corpus vocabulary for the RAM/warmup gates.
 *
 * The body filler must survive BM25 tokenization — stop-word text would index
 * zero body postings and the memory gate would measure an empty postings
 * store instead of a corpus-shaped one. Composing three vowel-terminated
 * syllables yields 4,096 distinct words that are never stop words, never
 * altered by the suffix stemmer, and never collide after stemming.
 */
const FIXTURE_SYLLABLES = [
  'ba', 'ce', 'di', 'fo', 'gu', 'ha', 'ki', 'lo',
  'mu', 'ne', 'po', 'ra', 'su', 'ta', 'vi', 'wo',
] as const;

const FIXTURE_VOCABULARY: string[] = (() => {
  const words: string[] = [];
  for (const first of FIXTURE_SYLLABLES) {
    for (const second of FIXTURE_SYLLABLES) {
      for (const third of FIXTURE_SYLLABLES) {
        words.push(`${first}${second}${third}`);
      }
    }
  }
  return words;
})();

/**
 * Each document draws from its own rotating vocabulary window so postings,
 * document frequencies, and per-document distinct-term counts resemble a real
 * corpus instead of one shared body. The stride is coprime with the vocabulary
 * size, so consecutive documents get different (overlapping) windows.
 */
const CORPUS_DISTINCT_TERMS_PER_DOC = 256;
const CORPUS_WINDOW_STRIDE = 89;

function buildCorpusBody(docIndex: number, targetBytes: number): string {
  const vocabularySize = FIXTURE_VOCABULARY.length;
  const windowStart = (docIndex * CORPUS_WINDOW_STRIDE) % vocabularySize;
  const words: string[] = [];
  let bytes = 0;

  for (let cursor = 0; bytes < targetBytes; cursor += 1) {
    const word = FIXTURE_VOCABULARY[(windowStart + (cursor % CORPUS_DISTINCT_TERMS_PER_DOC)) % vocabularySize];
    words.push(word);
    bytes += word.length + 1;
  }

  return words.join(' ').slice(0, targetBytes);
}

const GOLDEN_DOCUMENTS: BM25PackedFixtureDocument[] = [
  {
    id: 101,
    title: 'Auth Guard Session Renewal',
    content_text: 'Policy for renewing authenticated sessions and preserving access control context.',
    trigger_phrases: ['auth guard', 'session renewal'],
    file_path: 'specs/auth/session-renewal.md',
  },
  {
    id: 102,
    title: 'Cache Eviction Strategy',
    content_text: 'Cache lifecycle and invalidation notes for retrieval pressure management.',
    trigger_phrases: ['cache eviction', 'stale cache'],
    file_path: 'specs/cache/eviction.md',
  },
  {
    id: 103,
    title: 'Trigger Phrase Backfill',
    content_text: 'Backfill process for curated phrases and lexical discovery coverage.',
    trigger_phrases: ['trigger phrase', 'phrase backfill'],
    file_path: 'specs/search/trigger-backfill.md',
  },
  {
    id: 104,
    title: 'Vector Retention Policy',
    content_text: 'Retention and retry behavior for vector embeddings and missing shard coverage.',
    trigger_phrases: ['vector retention', 'embedding retry'],
    file_path: 'specs/vector/retention.md',
  },
  {
    id: 105,
    title: 'Memory Search Ranking',
    content_text: 'Ranking calibration for lexical search and semantic fusion channels.',
    trigger_phrases: ['memory search', 'ranking calibration'],
    file_path: 'specs/search/ranking.md',
  },
  {
    id: 106,
    title: 'Generic Operations Notes',
    content_text: 'Auth guard appears repeatedly in a generic operational body auth guard auth guard auth guard.',
    trigger_phrases: ['operations'],
    file_path: 'specs/ops/generic.md',
  },
];

const GOLDEN_QUERIES: BM25ComparisonQuery[] = [
  {
    id: 1,
    query: 'auth guard',
    relevances: [{ queryId: 1, memoryId: 101, relevance: 3 }],
  },
  {
    id: 2,
    query: 'cache eviction',
    relevances: [{ queryId: 2, memoryId: 102, relevance: 3 }],
  },
  {
    id: 3,
    query: 'trigger phrase backfill',
    relevances: [{ queryId: 3, memoryId: 103, relevance: 3 }],
  },
  {
    id: 4,
    query: 'vector retention',
    relevances: [{ queryId: 4, memoryId: 104, relevance: 3 }],
  },
  {
    id: 5,
    query: 'memory search ranking',
    relevances: [{ queryId: 5, memoryId: 105, relevance: 3 }],
  },
];

function makeCorpusDocument(docIndex: number, bytesPerDocument: number): BM25PackedFixtureDocument {
  return {
    id: 10_000 + docIndex,
    title: `Corpus Fixture ${docIndex}`,
    content_text: buildCorpusBody(docIndex, bytesPerDocument),
    trigger_phrases: [`fixture-${docIndex % 97}`, 'packed bm25'],
    file_path: `fixtures/corpus/${docIndex}.md`,
  };
}

function createCorpusSizedDocuments(options: CorpusFixtureOptions = {}): BM25PackedFixtureDocument[] {
  const documentCount = options.documentCount ?? 10_245;
  const targetIndexedBytes = options.targetIndexedBytes ?? 69_200_000;
  const bytesPerDocument = Math.max(128, Math.floor(targetIndexedBytes / documentCount));
  const docs: BM25PackedFixtureDocument[] = [];

  for (let i = 0; i < documentCount; i += 1) {
    docs.push(makeCorpusDocument(i, bytesPerDocument));
  }

  return docs;
}

function* iterateCorpusSizedDocuments(options: CorpusFixtureOptions = {}): Generator<BM25PackedFixtureDocument> {
  const documentCount = options.documentCount ?? 10_245;
  const targetIndexedBytes = options.targetIndexedBytes ?? 69_200_000;
  const bytesPerDocument = Math.max(128, Math.floor(targetIndexedBytes / documentCount));

  for (let i = 0; i < documentCount; i += 1) {
    yield makeCorpusDocument(i, bytesPerDocument);
  }
}

function createPackedEvalDocuments(): BM25PackedFixtureDocument[] {
  return GOLDEN_DOCUMENTS.map((doc) => ({ ...doc, trigger_phrases: [...doc.trigger_phrases] }));
}

function createPackedEvalQueries(): BM25ComparisonQuery[] {
  return GOLDEN_QUERIES.map((query) => ({
    ...query,
    relevances: query.relevances.map((relevance) => ({ ...relevance })),
  }));
}

export {
  createCorpusSizedDocuments,
  iterateCorpusSizedDocuments,
  createPackedEvalDocuments,
  createPackedEvalQueries,
};

export type {
  BM25PackedFixtureDocument,
  CorpusFixtureOptions,
};
