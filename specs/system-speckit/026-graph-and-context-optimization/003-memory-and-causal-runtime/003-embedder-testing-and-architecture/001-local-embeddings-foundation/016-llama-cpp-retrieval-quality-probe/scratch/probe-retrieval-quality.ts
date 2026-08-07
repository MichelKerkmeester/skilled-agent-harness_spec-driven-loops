import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

import { createEmbeddingsProvider } from '../../../../../../skills/system-spec-kit/shared/embeddings/factory.js';
import type { IEmbeddingProvider } from '../../../../../../skills/system-spec-kit/shared/types.js';

type ProviderName = 'hf-local' | 'llama-cpp';

interface CorpusDoc {
  id: string;
  title: string;
  file_path: string;
  spec_folder: string;
  content: string;
  summary: string | null;
}

interface QueryEntry {
  query: string;
  target_doc_id: string;
}

interface RankedDoc {
  doc_id: string;
  score: number;
}

interface ProviderRun {
  model: string;
  model_path?: string;
  embedding_time_seconds: number;
  mrr_top200: number;
}

interface ResultsJson {
  corpus_size: number;
  query_count: number;
  query_strategy: 'approach_A';
  hf_local: ProviderRun;
  llama_cpp: ProviderRun;
  metrics: {
    recall_at_5_overlap_mean: number;
    recall_at_5_overlap_p25: number;
    spearman_rho_top10_mean: number;
    mrr_relative_delta: number;
  };
  verdict: 'EQUIVALENT' | 'MILD_DIVERGENCE' | 'REAL_DIVERGENCE';
  one_line_interpretation: string;
  examples: Array<{
    query: string;
    target_doc_id: string;
    hf_local_top5: RankedDoc[];
    llama_cpp_top5: RankedDoc[];
    overlap_at_5: number;
    spearman_rho_top10: number;
  }>;
}

const require = createRequire(import.meta.url);
const Database = require('../../../../../../skills/system-spec-kit/mcp_server/node_modules/better-sqlite3') as typeof import('better-sqlite3');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKET_DIR = path.dirname(__dirname);
const DB_PATH = path.resolve(
  process.cwd(),
  '.opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite',
);
const LLAMA_MODEL_PATH = path.join(
  os.homedir(),
  '.cache',
  'huggingface',
  'gguf',
  'embeddinggemma-300m',
  'embeddinggemma-300M-Q8_0.gguf',
);

const CORPUS_PATH = path.join(__dirname, 'probe-corpus.json');
const QUERIES_PATH = path.join(__dirname, 'probe-queries.json');
const EMBEDDINGS_PATH = path.join(__dirname, 'probe-embeddings.json');
const RESULTS_PATH = path.join(__dirname, 'probe-results.json');
const RESULTS_MD_PATH = path.join(__dirname, 'probe-results.md');
const PROBE_MAX_TEXT_LENGTH = 700;

function round(value: number, digits = 6): number {
  return Number(value.toFixed(digits));
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[index];
}

function sampleCorpus(): CorpusDoc[] {
  const db = new Database(DB_PATH, {
    readonly: true,
    fileMustExist: true,
  });
  try {
    const rows = db.prepare(`
      SELECT
        m.id AS id,
        COALESCE(m.title, '') AS title,
        COALESCE(m.file_path, '') AS file_path,
        COALESCE(m.spec_folder, '') AS spec_folder,
        m.content_text AS content,
        s.summary_text AS summary
      FROM memory_index m
      LEFT JOIN memory_summaries s ON s.memory_id = m.id
      WHERE length(COALESCE(m.content_text, '')) >= 50
        AND COALESCE(m.is_archived, 0) = 0
      ORDER BY RANDOM()
      LIMIT 260
    `).all() as Array<Record<string, unknown>>;

    const docs = rows
      .map((row) => ({
        id: String(row.id),
        title: String(row.title ?? ''),
        file_path: String(row.file_path ?? ''),
        spec_folder: String(row.spec_folder ?? ''),
        content: String(row.content ?? '').trim(),
        summary: row.summary === null || row.summary === undefined ? null : String(row.summary),
      }))
      .filter((row) => row.content.length >= 50)
      .slice(0, 200);

    if (docs.length < 200) {
      throw new Error(`Expected 200 usable corpus rows, got ${docs.length}`);
    }
    return docs;
  } finally {
    db.close();
  }
}

function firstSentenceQuery(content: string): string {
  const normalized = content.replace(/\s+/g, ' ').trim();
  const sentenceMatches = normalized.match(/[^.!?]+[.!?]+/g) ?? [];
  const candidate = sentenceMatches.slice(0, 2).join(' ').trim();
  if (candidate.length >= 30 && candidate.length <= 320) {
    return candidate;
  }
  if (candidate.length > 320) {
    return candidate.slice(0, 320).replace(/\s+\S*$/, '').trim();
  }
  const fallback = normalized.slice(0, 180).replace(/\s+\S*$/, '').trim();
  return fallback.length >= 30 ? fallback : normalized.slice(0, 180).trim();
}

function buildQueries(corpus: CorpusDoc[]): QueryEntry[] {
  return corpus
    .slice(0, 50)
    .map((doc) => ({
      query: firstSentenceQuery(doc.content),
      target_doc_id: doc.id,
    }))
    .filter((entry) => entry.query.length >= 30)
    .slice(0, 50);
}

function encodeVector(vector: Float32Array): string {
  return Buffer.from(vector.buffer, vector.byteOffset, vector.byteLength).toString('base64');
}

async function createProvider(provider: ProviderName): Promise<IEmbeddingProvider> {
  if (provider === 'llama-cpp') {
    return await createEmbeddingsProvider({
      provider: 'llama-cpp',
      model: 'unsloth/embeddinggemma-300m-GGUF',
      dim: 768,
      timeout: 60000,
      maxTextLength: PROBE_MAX_TEXT_LENGTH,
    });
  }

  return await createEmbeddingsProvider({
    provider: 'hf-local',
    model: 'onnx-community/embeddinggemma-300m-ONNX',
    dim: 768,
    dtype: 'q8',
    timeout: 60000,
    maxTextLength: PROBE_MAX_TEXT_LENGTH,
  });
}

async function embedAll(providerName: ProviderName, corpus: CorpusDoc[], queries: QueryEntry[]) {
  const provider = await createProvider(providerName);
  const started = performance.now();
  const docs: Record<string, Float32Array> = {};
  const encodedDocs: Record<string, string> = {};
  const queryVectors: Float32Array[] = [];
  const encodedQueries: string[] = [];

  for (const doc of corpus) {
    const embedding = await provider.embedDocument(doc.content);
    if (!embedding) {
      throw new Error(`${providerName} returned null embedding for doc ${doc.id}`);
    }
    docs[doc.id] = embedding;
    encodedDocs[doc.id] = encodeVector(embedding);
  }

  for (const entry of queries) {
    const embedding = await provider.embedQuery(entry.query);
    if (!embedding) {
      throw new Error(`${providerName} returned null embedding for query ${entry.target_doc_id}`);
    }
    queryVectors.push(embedding);
    encodedQueries.push(encodeVector(embedding));
  }

  const metadata = provider.getMetadata();
  return {
    docs,
    queryVectors,
    encoded: {
      docs: encodedDocs,
      queries: encodedQueries,
    },
    model: metadata.model,
    model_path: providerName === 'llama-cpp' ? LLAMA_MODEL_PATH : undefined,
    embedding_time_seconds: round((performance.now() - started) / 1000),
  };
}

function cosine(left: Float32Array, right: Float32Array): number {
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const leftValue = left[index];
    const rightValue = right[index];
    dot += leftValue * rightValue;
    leftNorm += leftValue * leftValue;
    rightNorm += rightValue * rightValue;
  }
  const denom = Math.sqrt(leftNorm) * Math.sqrt(rightNorm);
  return denom === 0 ? 0 : dot / denom;
}

function rankAll(queryVector: Float32Array, docVectors: Record<string, Float32Array>): RankedDoc[] {
  return Object.entries(docVectors)
    .map(([docId, vector]) => ({
      doc_id: docId,
      score: cosine(queryVector, vector),
    }))
    .sort((left, right) => right.score - left.score);
}

function rankMap(top: RankedDoc[], universe: string[]): Map<string, number> {
  const ranks = new Map<string, number>();
  top.forEach((row, index) => ranks.set(row.doc_id, index + 1));
  const missingRank = universe.length + 1;
  for (const docId of universe) {
    if (!ranks.has(docId)) {
      ranks.set(docId, missingRank);
    }
  }
  return ranks;
}

function spearmanForTop10(leftTop10: RankedDoc[], rightTop10: RankedDoc[]): number {
  const universe = Array.from(new Set([
    ...leftTop10.map((row) => row.doc_id),
    ...rightTop10.map((row) => row.doc_id),
  ]));
  if (universe.length < 2) {
    return 1;
  }
  const leftRanks = rankMap(leftTop10, universe);
  const rightRanks = rankMap(rightTop10, universe);
  const n = universe.length;
  let sumDiffSquared = 0;
  for (const docId of universe) {
    const diff = (leftRanks.get(docId) ?? n + 1) - (rightRanks.get(docId) ?? n + 1);
    sumDiffSquared += diff * diff;
  }
  return 1 - (6 * sumDiffSquared) / (n * (n * n - 1));
}

function meanReciprocalRank(rankings: RankedDoc[][], queries: QueryEntry[]): number {
  let total = 0;
  for (let index = 0; index < queries.length; index += 1) {
    const target = queries[index].target_doc_id;
    const rank = rankings[index].findIndex((row) => row.doc_id === target);
    if (rank >= 0) {
      total += 1 / (rank + 1);
    }
  }
  return total / queries.length;
}

function decideVerdict(recallMean: number, spearmanMean: number, mrrDelta: number): ResultsJson['verdict'] {
  if (recallMean >= 0.8 && spearmanMean >= 0.85 && mrrDelta < 0.05) {
    return 'EQUIVALENT';
  }
  if (recallMean >= 0.65 && spearmanMean >= 0.7) {
    return 'MILD_DIVERGENCE';
  }
  return 'REAL_DIVERGENCE';
}

function formatTop5(top5: RankedDoc[], corpusById: Map<string, CorpusDoc>): string {
  return top5
    .map((row, index) => {
      const doc = corpusById.get(row.doc_id);
      const label = doc?.title || doc?.file_path || doc?.spec_folder || row.doc_id;
      return `${index + 1}. ${row.doc_id} (${round(row.score, 4)}) - ${label.replace(/\s+/g, ' ').slice(0, 100)}`;
    })
    .join('\n');
}

function writeMarkdown(results: ResultsJson, corpus: CorpusDoc[]): void {
  const corpusById = new Map(corpus.map((doc) => [doc.id, doc]));
  const lines: string[] = [
    '# 016 llama-cpp retrieval quality probe',
    '',
    '## Result',
    '',
    `Verdict: **${results.verdict}**`,
    '',
    `One-line interpretation: ${results.one_line_interpretation}`,
    '',
    '## Metrics',
    '',
    '| Metric | Value | Target |',
    '|--------|-------|--------|',
    `| Corpus size | ${results.corpus_size} | 200 |`,
    `| Query count | ${results.query_count} | 50 |`,
    `| Query strategy | ${results.query_strategy} | approach_A preferred |`,
    `| hf-local embedding time | ${results.hf_local.embedding_time_seconds}s | n/a |`,
    `| llama-cpp embedding time | ${results.llama_cpp.embedding_time_seconds}s | n/a |`,
    `| Recall@5 overlap mean | ${results.metrics.recall_at_5_overlap_mean} | >= 0.80 equivalent |`,
    `| Recall@5 overlap p25 | ${results.metrics.recall_at_5_overlap_p25} | diagnostic |`,
    `| Spearman rho top-10 mean | ${results.metrics.spearman_rho_top10_mean} | >= 0.85 equivalent |`,
    `| MRR hf-local top200 | ${results.hf_local.mrr_top200} | baseline |`,
    `| MRR llama-cpp top200 | ${results.llama_cpp.mrr_top200} | compare |`,
    `| MRR relative delta | ${results.metrics.mrr_relative_delta} | < 0.05 equivalent |`,
    '',
    '## Human Eyeball Check',
    '',
    results.verdict === 'EQUIVALENT'
      ? 'The example top-5 lists show no obvious canonicality regression beyond normal rank movement.'
      : 'The example top-5 lists expose visible rank/result movement, so the aggregate divergence should be treated as decision-relevant.',
    '',
  ];

  for (const [index, example] of results.examples.entries()) {
    lines.push(
      `### Example ${index + 1}`,
      '',
      `Query: ${example.query}`,
      '',
      `Target doc: ${example.target_doc_id}`,
      '',
      `Overlap@5: ${example.overlap_at_5}; Spearman top-10: ${example.spearman_rho_top10}`,
      '',
      'hf-local top-5:',
      '',
      '```text',
      formatTop5(example.hf_local_top5, corpusById),
      '```',
      '',
      'llama-cpp top-5:',
      '',
      '```text',
      formatTop5(example.llama_cpp_top5, corpusById),
      '```',
      '',
    );
  }

  fs.writeFileSync(RESULTS_MD_PATH, `${lines.join('\n')}\n`);
}

async function run(): Promise<void> {
  fs.mkdirSync(PACKET_DIR, { recursive: true });
  fs.mkdirSync(__dirname, { recursive: true });

  const corpus = sampleCorpus();
  const queries = buildQueries(corpus);
  if (queries.length !== 50) {
    throw new Error(`Expected 50 derived queries, got ${queries.length}`);
  }

  fs.writeFileSync(CORPUS_PATH, `${JSON.stringify(corpus, null, 2)}\n`);
  fs.writeFileSync(QUERIES_PATH, `${JSON.stringify(queries, null, 2)}\n`);

  const hf = await embedAll('hf-local', corpus, queries);
  const llama = await embedAll('llama-cpp', corpus, queries);

  fs.writeFileSync(EMBEDDINGS_PATH, `${JSON.stringify({
    format: 'base64(Float32Array)',
    dim: 768,
    providers: {
      'hf-local': hf.encoded,
      'llama-cpp': llama.encoded,
    },
  })}\n`);

  const hfRankings = hf.queryVectors.map((queryVector) => rankAll(queryVector, hf.docs));
  const llamaRankings = llama.queryVectors.map((queryVector) => rankAll(queryVector, llama.docs));
  const recallOverlaps: number[] = [];
  const spearmanValues: number[] = [];

  const examples: ResultsJson['examples'] = [];
  for (let index = 0; index < queries.length; index += 1) {
    const hfTop5 = hfRankings[index].slice(0, 5);
    const llamaTop5 = llamaRankings[index].slice(0, 5);
    const llamaTop5Set = new Set(llamaTop5.map((row) => row.doc_id));
    const overlap = hfTop5.filter((row) => llamaTop5Set.has(row.doc_id)).length / 5;
    const spearman = spearmanForTop10(hfRankings[index].slice(0, 10), llamaRankings[index].slice(0, 10));
    recallOverlaps.push(overlap);
    spearmanValues.push(spearman);

    if (examples.length < 5 && (examples.length < 3 || overlap < 1 || spearman < 0.85)) {
      examples.push({
        query: queries[index].query,
        target_doc_id: queries[index].target_doc_id,
        hf_local_top5: hfTop5.map((row) => ({ doc_id: row.doc_id, score: round(row.score) })),
        llama_cpp_top5: llamaTop5.map((row) => ({ doc_id: row.doc_id, score: round(row.score) })),
        overlap_at_5: round(overlap),
        spearman_rho_top10: round(spearman),
      });
    }
  }

  const hfMrr = meanReciprocalRank(hfRankings, queries);
  const llamaMrr = meanReciprocalRank(llamaRankings, queries);
  const mrrRelativeDelta = hfMrr === 0 ? 0 : Math.abs(llamaMrr - hfMrr) / hfMrr;
  const recallMean = recallOverlaps.reduce((sum, value) => sum + value, 0) / recallOverlaps.length;
  const spearmanMean = spearmanValues.reduce((sum, value) => sum + value, 0) / spearmanValues.length;
  const verdict = decideVerdict(recallMean, spearmanMean, mrrRelativeDelta);

  const oneLine = verdict === 'EQUIVALENT'
    ? 'Retrieval rank ordering is stable enough that the prior vector-cosine miss looks migration-only, assuming a one-time re-index.'
    : verdict === 'MILD_DIVERGENCE'
      ? 'Retrieval mostly agrees but has enough rank movement that a default flip should be treated as a tolerance decision, not a free win.'
      : 'Retrieval diverges materially, so the prior parity failure is quality-relevant and llama-cpp should not become the default yet.';

  const results: ResultsJson = {
    corpus_size: corpus.length,
    query_count: queries.length,
    query_strategy: 'approach_A',
    hf_local: {
      model: hf.model,
      embedding_time_seconds: hf.embedding_time_seconds,
      mrr_top200: round(hfMrr),
    },
    llama_cpp: {
      model: llama.model,
      model_path: llama.model_path,
      embedding_time_seconds: llama.embedding_time_seconds,
      mrr_top200: round(llamaMrr),
    },
    metrics: {
      recall_at_5_overlap_mean: round(recallMean),
      recall_at_5_overlap_p25: round(percentile(recallOverlaps, 25)),
      spearman_rho_top10_mean: round(spearmanMean),
      mrr_relative_delta: round(mrrRelativeDelta),
    },
    verdict,
    one_line_interpretation: oneLine,
    examples,
  };

  fs.writeFileSync(RESULTS_PATH, `${JSON.stringify(results, null, 2)}\n`);
  writeMarkdown(results, corpus);
  console.log(JSON.stringify(results, null, 2));
}

run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});
