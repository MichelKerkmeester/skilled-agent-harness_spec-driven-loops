// 014/005 — Synthetic fp32 vs q4 vector comparison.
// Loads HfLocalProvider once under fp32 and once under q4, encodes the same N
// documents under each, and reports cosine similarity per row + summary stats.
// A high mean-similarity (e.g. >0.98) on the same corpus signals the two dtypes
// are "interchangeable enough" that switching to q4 won't tank retrieval quality.
// This is an in-distribution proxy, not a ground-truth recall benchmark — but
// it's the best we can do without labeled relevance data.

import { HfLocalProvider } from '../../../../../../skills/system-spec-kit/shared/dist/embeddings/providers/hf-local.js';

const MODEL = 'onnx-community/embeddinggemma-300m-ONNX';
const DIM = 768;

// Mixed corpus: code, prose, queries, multi-language tokens. Covers the
// realistic mix of content the memory store sees.
const CORPUS = [
  'HfLocalProvider loads ONNX models via transformers.js pipeline',
  'memory_index_scan force=true skips rows with embedding_status in pending or retry',
  'EmbeddingGemma-300m-ONNX supports fp32, fp16, q4, q4f16, int8 dtype variants',
  'voyage-4 was the previous embedding default before the local migration',
  'sqlite-vec stores float[768] embeddings in a virtual table with vec0 module',
  'cocoindex daemon writes 768-dim EmbeddingGemma vectors to target_sqlite.db',
  'when refresh_index is true the cocoindex search call triggers a daemon reindex',
  'multiprocessing.connection.Connection.send_bytes prepends a 4-byte length header',
  'the prefix registry maps model id to document and query prefix strings',
  'msgspec.DecodeError Input data was truncated indicates a malformed binary frame',
  '@huggingface/transformers v3.8.1 pipeline accepts dtype fp32 fp16 q4 q4f16',
  'spec-kit-memory launcher loads .env.local before spawning the context-server child',
  'launchctl unsetenv VOYAGE_API_KEY clears the persistent macOS launchd value',
  '14 local embeddings Setup A migration touches 9 sub-phases',
  'Voyage drift detection emits a console.warn once per process startup',
];

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function embedCorpus(dtype) {
  const p = new HfLocalProvider({ model: MODEL, dim: DIM, dtype });
  console.error(`[bench] warming ${dtype}...`);
  const t0 = Date.now();
  await p.warmup();
  console.error(`[bench] ${dtype} warmup ${Date.now()-t0}ms`);
  const vecs = [];
  const latencies = [];
  for (const text of CORPUS) {
    const t = Date.now();
    vecs.push(await p.embedQuery(text));
    latencies.push(Date.now() - t);
  }
  return { vecs, latencies };
}

(async () => {
  const fp32 = await embedCorpus('fp32');
  const q4 = await embedCorpus('q4');

  console.log('\n=== per-document fp32-vs-q4 cosine similarity ===');
  const sims = [];
  for (let i = 0; i < CORPUS.length; i++) {
    const s = cosine(fp32.vecs[i], q4.vecs[i]);
    sims.push(s);
    console.log(`  [${i.toString().padStart(2)}] sim=${s.toFixed(4)}  ${CORPUS[i].slice(0, 60)}...`);
  }

  const mean = sims.reduce((a,b)=>a+b,0)/sims.length;
  const min = Math.min(...sims);
  const max = Math.max(...sims);
  const variance = sims.reduce((a,b)=>a+(b-mean)**2,0)/sims.length;
  const stdev = Math.sqrt(variance);

  console.log('\n=== summary ===');
  console.log(`  N            : ${CORPUS.length}`);
  console.log(`  mean cosine  : ${mean.toFixed(4)}`);
  console.log(`  stdev        : ${stdev.toFixed(4)}`);
  console.log(`  min cosine   : ${min.toFixed(4)}`);
  console.log(`  max cosine   : ${max.toFixed(4)}`);

  const meanFp32Lat = fp32.latencies.reduce((a,b)=>a+b,0)/fp32.latencies.length;
  const meanQ4Lat = q4.latencies.reduce((a,b)=>a+b,0)/q4.latencies.length;
  console.log(`  fp32 mean inference: ${meanFp32Lat.toFixed(1)}ms`);
  console.log(`  q4 mean inference  : ${meanQ4Lat.toFixed(1)}ms`);
  console.log(`  q4 latency ratio   : ${(meanQ4Lat/meanFp32Lat).toFixed(2)}x`);

  console.log('\n=== verdict ===');
  if (mean >= 0.98) {
    console.log('  PASS — q4 vectors are >=0.98 mean cosine to fp32; effectively interchangeable.');
  } else if (mean >= 0.95) {
    console.log('  ACCEPT — q4 vectors are 0.95-0.98 mean cosine to fp32; small but measurable drift.');
  } else if (mean >= 0.90) {
    console.log('  CAUTION — q4 vectors are 0.90-0.95 mean cosine to fp32; noticeable drift, may degrade recall.');
  } else {
    console.log('  WARN — q4 vectors are <0.90 mean cosine to fp32; significant drift, do not switch defaults.');
  }
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
