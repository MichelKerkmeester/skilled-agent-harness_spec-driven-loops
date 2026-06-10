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

const FIXTURE_FILLER = [
  'the and of to in on at by from is it as was are be has had have been',
  'this that these those not no do does did so if then than too very',
].join(' ');

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

function makeCorpusFiller(targetBytes: number): string {
  const chunk = `${FIXTURE_FILLER} `;
  return chunk.repeat(Math.max(1, Math.ceil(targetBytes / chunk.length))).slice(0, targetBytes);
}

function createCorpusSizedDocuments(options: CorpusFixtureOptions = {}): BM25PackedFixtureDocument[] {
  const documentCount = options.documentCount ?? 10_245;
  const targetIndexedBytes = options.targetIndexedBytes ?? 69_200_000;
  const bytesPerDocument = Math.max(128, Math.floor(targetIndexedBytes / documentCount));
  const sharedBody = makeCorpusFiller(bytesPerDocument);
  const docs: BM25PackedFixtureDocument[] = [];

  for (let i = 0; i < documentCount; i += 1) {
    docs.push({
      id: 10_000 + i,
      title: `Corpus Fixture ${i}`,
      content_text: sharedBody,
      trigger_phrases: [`fixture-${i % 97}`, 'packed bm25'],
      file_path: `fixtures/corpus/${i}.md`,
    });
  }

  return docs;
}

function* iterateCorpusSizedDocuments(options: CorpusFixtureOptions = {}): Generator<BM25PackedFixtureDocument> {
  const documentCount = options.documentCount ?? 10_245;
  const targetIndexedBytes = options.targetIndexedBytes ?? 69_200_000;
  const bytesPerDocument = Math.max(128, Math.floor(targetIndexedBytes / documentCount));
  const sharedBody = makeCorpusFiller(bytesPerDocument);

  for (let i = 0; i < documentCount; i += 1) {
    yield {
      id: 10_000 + i,
      title: `Corpus Fixture ${i}`,
      content_text: sharedBody,
      trigger_phrases: [`fixture-${i % 97}`, 'packed bm25'],
      file_path: `fixtures/corpus/${i}.md`,
    };
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
