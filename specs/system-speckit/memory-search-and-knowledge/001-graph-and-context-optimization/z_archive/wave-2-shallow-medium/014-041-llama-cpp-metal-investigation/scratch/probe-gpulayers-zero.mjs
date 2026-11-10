import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const nodeLlamaEntrypoint = path.join(
  repoRoot,
  '.opencode',
  'skills',
  'system-spec-kit',
  'mcp_server',
  'node_modules',
  'node-llama-cpp',
  'dist',
  'index.js',
);

const modelPath = process.env.LLAMA_CPP_EMBEDDINGS_MODEL_PATH || path.join(
  os.homedir(),
  '.cache',
  'huggingface',
  'gguf',
  'embeddinggemma-300m',
  'embeddinggemma-300M-Q8_0.gguf',
);

const mode = process.argv[2] || 'auto';
const moduleUrl = pathToFileURL(nodeLlamaEntrypoint).href;
const { getLlama } = await import(moduleUrl);

const getLlamaOptions = mode === 'cpu' ? { gpu: false, build: 'never' } : undefined;
const start = Date.now();
const llama = await getLlama(getLlamaOptions);
const model = await llama.loadModel({
  modelPath,
  embedding: true,
  gpuLayers: 0,
});

const trainContextSize = model.trainContextSize ?? 2048;
const context = await model.createEmbeddingContext({
  contextSize: 'auto',
  minContextSize: 512,
  maxContextSize: trainContextSize,
  batchSize: Math.min(512, trainContextSize),
});

const embedding = await context.getEmbeddingFor('llama-cpp Metal warning probe');
const result = {
  mode,
  getLlamaOptions,
  modelPath,
  node: process.version,
  platform: `${process.platform}/${process.arch}`,
  llamaGpu: llama.gpu,
  modelGpuLayers: model.gpuLayers,
  vectorLength: embedding.vector.length,
  elapsedMs: Date.now() - start,
};

console.log(JSON.stringify(result, null, 2));

if (typeof context.dispose === 'function') {
  await context.dispose();
}
if (typeof model.dispose === 'function') {
  await model.dispose();
}
