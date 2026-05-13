// ---------------------------------------------------------------
// MODULE: Llama.cpp Local
// ---------------------------------------------------------------

import os from 'os';
import path from 'path';
import { existsSync } from 'fs';
import { access } from 'fs/promises';
import { fileURLToPath, pathToFileURL } from 'url';
import { ALLOWED_LLAMA_CPP_DTYPES, EmbeddingProfile, normalizeProfileDtype } from '../profile.js';
import { semanticChunk, MAX_TEXT_LENGTH } from '../../chunking.js';
import type { EmbeddingProfileData, IEmbeddingProvider, ProviderMetadata } from '../../types.js';
import { getPrefixFor } from './hf-local.js';

// ---------------------------------------------------------------
// 1. CONFIGURATION
// ---------------------------------------------------------------

const DEFAULT_MODEL_ID = 'unsloth/embeddinggemma-300m-GGUF';
const DEFAULT_PREFIX_MODEL_ID = 'google/embeddinggemma-300m';
const DEFAULT_MODEL_FILE = 'embeddinggemma-300M-Q8_0.gguf';
const DEFAULT_MODEL_PATH = path.join(
  os.homedir(),
  '.cache',
  'huggingface',
  'gguf',
  'embeddinggemma-300m',
  DEFAULT_MODEL_FILE,
);
const EMBEDDING_DIM = 768;
const EMBEDDING_TIMEOUT = 30000;
const MODEL_LOAD_TIMEOUT = 120000;

interface LlamaCppOptions {
  model?: string;
  modelPath?: string;
  dim?: number;
  maxTextLength?: number;
  timeout?: number;
}

interface NodeLlamaCppModule {
  getLlama: () => Promise<LlamaRuntime>;
}

interface LlamaRuntime {
  loadModel: (options: Record<string, unknown>) => Promise<LlamaModel>;
  gpu?: string;
}

interface LlamaModel {
  createEmbeddingContext: (options?: Record<string, unknown>) => Promise<LlamaEmbeddingContext>;
  embeddingVectorSize?: number;
  dispose?: () => Promise<void>;
}

interface LlamaEmbeddingContext {
  getEmbeddingFor: (input: string) => Promise<{ vector: readonly number[] }>;
  dispose?: () => Promise<void>;
}

interface LlamaCppRuntimeState {
  llama: LlamaRuntime;
  model: LlamaModel;
  context: LlamaEmbeddingContext;
  modelPath: string;
  loadTimeMs: number;
  gpu: string | null;
}

let cachedRuntime: LlamaCppRuntimeState | null = null;
let runtimePromise: Promise<LlamaCppRuntimeState> | null = null;
let runtimePromisePath: string | null = null;

interface LlamaCppAvailability {
  available: boolean;
  reason?: string;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function withTimeout<T>(operation: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);

    operation
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

function normalizeModelPath(configuredPath?: string): string {
  const rawPath = configuredPath || process.env.LLAMA_CPP_EMBEDDINGS_MODEL_PATH || DEFAULT_MODEL_PATH;
  if (rawPath.startsWith('~/')) {
    return path.join(os.homedir(), rawPath.slice(2));
  }
  return path.resolve(rawPath);
}

function resolveLlamaCppDtype(): string {
  const configured = normalizeProfileDtype(process.env.LLAMA_CPP_EMBEDDINGS_DTYPE);
  if (!configured || !ALLOWED_LLAMA_CPP_DTYPES.includes(configured) || configured === 'q8_0') {
    return 'q8';
  }
  return configured;
}

function resolveProfileModel(model: string): string {
  return model.replace(/\//g, '-');
}

function resolveGpuLayers(): number | 'auto' | 'max' {
  const configured = process.env.LLAMA_CPP_EMBEDDINGS_GPU_LAYERS?.trim();
  if (!configured) {
    return 0;
  }
  if (configured === 'auto' || configured === 'max') {
    return configured;
  }
  const parsed = Number.parseInt(configured, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

async function loadNodeLlamaCpp(): Promise<NodeLlamaCppModule> {
  try {
    const moduleName = 'node-llama-cpp';
    const mod = await import(moduleName) as unknown;
    if (!mod || typeof mod !== 'object' || typeof (mod as NodeLlamaCppModule).getLlama !== 'function') {
      throw new Error('node-llama-cpp loaded without getLlama() export');
    }
    return mod as NodeLlamaCppModule;
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    if (
      message.includes('Cannot find package') ||
      message.includes('Cannot find module') ||
      message.includes('ERR_MODULE_NOT_FOUND') ||
      message.includes('MODULE_NOT_FOUND')
    ) {
      const fallbackEntrypoint = resolveWorkspaceNodeLlamaCppEntrypoint();
      if (fallbackEntrypoint) {
        const mod = await import(pathToFileURL(fallbackEntrypoint).href) as unknown;
        if (!mod || typeof mod !== 'object' || typeof (mod as NodeLlamaCppModule).getLlama !== 'function') {
          throw new Error('node-llama-cpp loaded without getLlama() export');
        }
        return mod as NodeLlamaCppModule;
      }
      throw new Error(getInstallHint());
    }
    throw error;
  }
}

function getInstallHint(): string {
  return 'node-llama-cpp is not installed. Run `npm install node-llama-cpp@3.17.1 --save-optional` ' +
    'from .opencode/skills/system-spec-kit/mcp_server to enable EMBEDDINGS_PROVIDER=llama-cpp.';
}

function resolveWorkspaceNodeLlamaCppEntrypoint(): string | null {
  let currentDir = path.dirname(fileURLToPath(import.meta.url));
  while (currentDir !== path.dirname(currentDir)) {
    const candidates = [
      path.join(currentDir, 'node_modules', 'node-llama-cpp', 'dist', 'index.js'),
      path.join(currentDir, 'mcp_server', 'node_modules', 'node-llama-cpp', 'dist', 'index.js'),
    ];
    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return candidate;
      }
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
}

async function ensureReadableModel(modelPath: string): Promise<void> {
  try {
    await access(modelPath);
  } catch (_error: unknown) {
    throw new Error(
      `llama-cpp GGUF model not found at ${modelPath}. ` +
      'Set LLAMA_CPP_EMBEDDINGS_MODEL_PATH or download a GGUF EmbeddingGemma model first.',
    );
  }
}

async function loadRuntime(modelPath: string): Promise<LlamaCppRuntimeState> {
  if (cachedRuntime && cachedRuntime.modelPath === modelPath) {
    return cachedRuntime;
  }
  if (runtimePromise && runtimePromisePath === modelPath) {
    return await runtimePromise;
  }

  runtimePromisePath = modelPath;
  runtimePromise = (async (): Promise<LlamaCppRuntimeState> => {
    await ensureReadableModel(modelPath);

    const start = Date.now();
    const llamaModule = await loadNodeLlamaCpp();
    const llama = await llamaModule.getLlama();
    const model = await llama.loadModel({
      modelPath,
      embedding: true,
      gpuLayers: resolveGpuLayers(),
    });
    const context = await model.createEmbeddingContext({
      contextSize: 512,
      batchSize: 512,
    });

    const runtime = {
      llama,
      model,
      context,
      modelPath,
      loadTimeMs: Date.now() - start,
      gpu: typeof llama.gpu === 'string' ? llama.gpu : null,
    };
    cachedRuntime = runtime;
    return runtime;
  })();

  try {
    return await runtimePromise;
  } catch (error: unknown) {
    runtimePromise = null;
    runtimePromisePath = null;
    cachedRuntime = null;
    throw error;
  }
}

function l2Normalize(vector: Float32Array): Float32Array {
  let norm = 0;
  for (const value of vector) {
    norm += value * value;
  }
  norm = Math.sqrt(norm);
  if (!Number.isFinite(norm) || norm === 0) {
    return vector;
  }

  const normalized = new Float32Array(vector.length);
  for (let index = 0; index < vector.length; index += 1) {
    normalized[index] = vector[index] / norm;
  }
  return normalized;
}

function coerceDimension(vector: readonly number[], dim: number): Float32Array {
  if (vector.length < dim) {
    throw new Error(`Embedding dimension mismatch: expected at least ${dim}, got ${vector.length}`);
  }
  if (vector.length === dim) {
    return new Float32Array(vector);
  }
  return new Float32Array(vector.slice(0, dim));
}

// ---------------------------------------------------------------
// 2. PROVIDER CLASS
// ---------------------------------------------------------------

export class LlamaCppProvider implements IEmbeddingProvider {
  modelName: string;
  modelPath: string;
  dim: number;
  maxTextLength: number;
  timeout: number;
  modelLoadTime: number | null;
  isHealthy: boolean;
  prefixModelId: string;

  constructor(options: LlamaCppOptions = {}) {
    this.modelName = options.model || process.env.LLAMA_CPP_EMBEDDINGS_MODEL || DEFAULT_MODEL_ID;
    this.modelPath = normalizeModelPath(options.modelPath);
    this.dim = options.dim || EMBEDDING_DIM;
    this.maxTextLength = options.maxTextLength || MAX_TEXT_LENGTH;
    this.timeout = options.timeout || EMBEDDING_TIMEOUT;
    this.modelLoadTime = null;
    this.isHealthy = true;
    this.prefixModelId = process.env.LLAMA_CPP_EMBEDDINGS_PREFIX_MODEL || DEFAULT_PREFIX_MODEL_ID;
  }

  static async canLoad(options: Pick<LlamaCppOptions, 'modelPath'> = {}): Promise<LlamaCppAvailability> {
    const modelPath = normalizeModelPath(options.modelPath);
    try {
      await ensureReadableModel(modelPath);
      await loadNodeLlamaCpp();
      return { available: true };
    } catch (error: unknown) {
      return {
        available: false,
        reason: getErrorMessage(error),
      };
    }
  }

  async getRuntime(): Promise<LlamaCppRuntimeState> {
    const runtime = await withTimeout(
      loadRuntime(this.modelPath),
      MODEL_LOAD_TIMEOUT,
      `llama-cpp model loading timed out after ${MODEL_LOAD_TIMEOUT}ms`,
    );
    this.modelLoadTime = runtime.loadTimeMs;
    return runtime;
  }

  async generateEmbedding(text: string): Promise<Float32Array | null> {
    if (!text || typeof text !== 'string') {
      console.warn('[llama-cpp] Empty or invalid text provided');
      return null;
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      console.warn('[llama-cpp] Empty text after trim');
      return null;
    }

    let inputText = trimmedText;
    if (inputText.length > this.maxTextLength) {
      console.warn(`[llama-cpp] Text ${inputText.length} chars exceeds max ${this.maxTextLength}, applying semantic chunking`);
      inputText = semanticChunk(inputText, this.maxTextLength);
    }

    try {
      const runtime = await this.getRuntime();
      const embedding = await withTimeout(
        runtime.context.getEmbeddingFor(inputText),
        this.timeout,
        `llama-cpp inference timed out after ${this.timeout}ms`,
      );
      const coerced = coerceDimension(embedding.vector, this.dim);
      return l2Normalize(coerced);
    } catch (error: unknown) {
      this.isHealthy = false;
      console.warn(`[llama-cpp] Generation failed: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async embedDocument(text: string): Promise<Float32Array | null> {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    return await this.generateEmbedding(getPrefixFor(this.prefixModelId, 'document') + text);
  }

  async embedQuery(text: string): Promise<Float32Array | null> {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    return await this.generateEmbedding(getPrefixFor(this.prefixModelId, 'query') + text);
  }

  async warmup(): Promise<boolean> {
    try {
      await this.embedQuery('test warmup query');
      this.isHealthy = true;
      return true;
    } catch (_error: unknown) {
      this.isHealthy = false;
      return false;
    }
  }

  getMetadata(): ProviderMetadata {
    return {
      provider: 'llama-cpp',
      model: this.modelName,
      dim: this.dim,
      healthy: this.isHealthy,
      device: cachedRuntime?.gpu ?? null,
      loaded: cachedRuntime !== null,
      loadTimeMs: this.modelLoadTime,
    };
  }

  getProfile(): EmbeddingProfileData {
    return new EmbeddingProfile({
      provider: 'llama-cpp',
      model: resolveProfileModel(this.modelName),
      dim: this.dim,
      dtype: resolveLlamaCppDtype(),
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.embedQuery('health check');
      this.isHealthy = result !== null;
      return this.isHealthy;
    } catch (_error: unknown) {
      this.isHealthy = false;
      return false;
    }
  }

  getProviderName(): string {
    return 'llama-cpp';
  }
}
