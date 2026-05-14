// repro.mjs - direct llama-cpp provider sweep for context-size hypothesis
import { writeFileSync } from 'fs';
import path from 'path';
import { getLlama } from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/node_modules/node-llama-cpp/dist/index.js';

const MODEL_PATH = '/Users/michelkerkmeester/.cache/huggingface/gguf/embeddinggemma-300m/embeddinggemma-300M-Q8_0.gguf';
const CONTEXT_SIZE = 512; // mirrors the hardcoded value being investigated
const EMBED_DIM = 768;
const SIZES = [256, 512, 1024, 2048, 3000, 4000, 5000, 6000, 7000, 8000, 10000];

const OUT_DIR = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/_sandbox/37--llama-cpp-context-size';
const JSONL_PATH = path.join(OUT_DIR, 'run-3.15.1.jsonl');
const TSV_PATH = path.join(OUT_DIR, 'run-3.15.1.summary.tsv');

// Generate a deterministic Lorem-Ipsum-ish body of exactly N chars
function makeBody(charCount) {
  const lorem = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ';
  let s = '';
  while (s.length < charCount) s += lorem;
  return s.slice(0, charCount);
}

async function main() {
  const llama = await getLlama({ gpu: 'metal' });
  const model = await llama.loadModel({ modelPath: MODEL_PATH });
  const context = await model.createEmbeddingContext({ contextSize: CONTEXT_SIZE });

  const rows = [];
  for (const size of SIZES) {
    const body = makeBody(size);
    const tokens = model.tokenize(body);
    const inputTokens = tokens.length;
    const start = Date.now();
    let result = 'vector';
    let errorMessage = null;
    let vectorLen = null;
    try {
      const vec = await context.getEmbeddingFor(body);
      if (vec == null) {
        result = 'null';
      } else {
        const arr = vec.vector ?? vec; // node-llama-cpp returns object or array depending on version
        vectorLen = Array.isArray(arr) || ArrayBuffer.isView(arr) ? arr.length : 'unknown';
      }
    } catch (e) {
      result = 'throw';
      errorMessage = e?.message ?? String(e);
    }
    const elapsedMs = Date.now() - start;
    const row = { inputChars: size, inputTokens, result, vectorLen, elapsedMs, errorMessage };
    rows.push(row);
    console.log(JSON.stringify(row));
  }

  writeFileSync(JSONL_PATH, rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
  const tsv = ['size\tchars\ttokens\tresult\tvectorLen\telapsedMs\terror']
    .concat(rows.map((r) => `${r.inputChars}\t${r.inputChars}\t${r.inputTokens}\t${r.result}\t${r.vectorLen ?? ''}\t${r.elapsedMs}\t${r.errorMessage ?? ''}`))
    .join('\n');
  writeFileSync(TSV_PATH, tsv + '\n');

  await context.dispose?.();
  await model.dispose?.();
  await llama.dispose?.();
}

main().catch((e) => {
  console.error('repro.mjs failed:', e);
  process.exit(1);
});
