// ───────────────────────────────────────────────────────────────────
// MODULE: Llama.cpp Local
// ───────────────────────────────────────────────────────────────────
import os from 'os';
import path from 'path';
import { existsSync } from 'fs';
import { access } from 'fs/promises';
import { fileURLToPath, pathToFileURL } from 'url';
import { ALLOWED_LLAMA_CPP_DTYPES, EmbeddingProfile, normalizeProfileDtype } from '../profile.js';
import { semanticChunk, MAX_TEXT_LENGTH } from '../../chunking.js';
import { getPrefixFor } from './hf-local.js';
// ---------------------------------------------------------------
// 1. CONFIGURATION
// ---------------------------------------------------------------
const DEFAULT_MODEL_ID = 'unsloth/embeddinggemma-300m-GGUF';
const DEFAULT_PREFIX_MODEL_ID = 'google/embeddinggemma-300m';
const DEFAULT_MODEL_FILE = 'embeddinggemma-300M-Q8_0.gguf';
const DEFAULT_MODEL_PATH = path.join(os.homedir(), '.cache', 'huggingface', 'gguf', 'embeddinggemma-300m', DEFAULT_MODEL_FILE);
const EMBEDDING_DIM = 768;
const EMBEDDING_TIMEOUT = 30000;
const MODEL_LOAD_TIMEOUT = 120000;
let cachedRuntime = null;
let runtimePromise = null;
let runtimePromisePath = null;
let testRuntimeOverride = null;
let testNodeLlamaCppModule = null;
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
async function withTimeout(operation, timeoutMs, message) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
        operation
            .then((value) => {
            clearTimeout(timeoutId);
            resolve(value);
        })
            .catch((error) => {
            clearTimeout(timeoutId);
            reject(error);
        });
    });
}
function normalizeModelPath(configuredPath) {
    const rawPath = configuredPath || process.env.LLAMA_CPP_EMBEDDINGS_MODEL_PATH || DEFAULT_MODEL_PATH;
    if (rawPath.startsWith('~/')) {
        return path.join(os.homedir(), rawPath.slice(2));
    }
    return path.resolve(rawPath);
}
function resolveLlamaCppDtype() {
    const configured = normalizeProfileDtype(process.env.LLAMA_CPP_EMBEDDINGS_DTYPE);
    if (!configured || !ALLOWED_LLAMA_CPP_DTYPES.includes(configured) || configured === 'q8_0') {
        return 'q8';
    }
    return configured;
}
function resolveProfileModel(model) {
    return model.replace(/\//g, '-');
}
function resolveGpuLayers() {
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
async function loadNodeLlamaCpp() {
    if (testNodeLlamaCppModule) {
        return testNodeLlamaCppModule;
    }
    try {
        const moduleName = 'node-llama-cpp';
        const mod = await import(moduleName);
        if (!mod || typeof mod !== 'object' || typeof mod.getLlama !== 'function') {
            throw new Error('node-llama-cpp loaded without getLlama() export');
        }
        return mod;
    }
    catch (error) {
        const message = getErrorMessage(error);
        if (message.includes('Cannot find package') ||
            message.includes('Cannot find module') ||
            message.includes('ERR_MODULE_NOT_FOUND') ||
            message.includes('MODULE_NOT_FOUND')) {
            const fallbackEntrypoint = resolveWorkspaceNodeLlamaCppEntrypoint();
            if (fallbackEntrypoint) {
                const mod = await import(pathToFileURL(fallbackEntrypoint).href);
                if (!mod || typeof mod !== 'object' || typeof mod.getLlama !== 'function') {
                    throw new Error('node-llama-cpp loaded without getLlama() export');
                }
                return mod;
            }
            throw new Error(getInstallHint());
        }
        throw error;
    }
}
function getInstallHint() {
    return 'node-llama-cpp is not installed. Run `npm install node-llama-cpp@3.17.1 --save-optional` ' +
        'from .opencode/skills/system-spec-kit/mcp_server to enable EMBEDDINGS_PROVIDER=llama-cpp.';
}
function resolveWorkspaceNodeLlamaCppEntrypoint() {
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
async function ensureReadableModel(modelPath) {
    try {
        await access(modelPath);
    }
    catch (_error) {
        throw new Error(`llama-cpp GGUF model not found at ${modelPath}. ` +
            'Set LLAMA_CPP_EMBEDDINGS_MODEL_PATH or download a GGUF EmbeddingGemma model first.');
    }
}
async function loadRuntime(modelPath) {
    if (testRuntimeOverride) {
        return testRuntimeOverride;
    }
    if (cachedRuntime && cachedRuntime.modelPath === modelPath) {
        return cachedRuntime;
    }
    if (runtimePromise && runtimePromisePath === modelPath) {
        return await runtimePromise;
    }
    runtimePromisePath = modelPath;
    runtimePromise = (async () => {
        await ensureReadableModel(modelPath);
        const start = Date.now();
        const llamaModule = await loadNodeLlamaCpp();
        const llama = await llamaModule.getLlama();
        const model = await llama.loadModel({
            modelPath,
            embedding: true,
            gpuLayers: resolveGpuLayers(),
        });
        const trainContextSize = model.trainContextSize ?? 2048;
        const context = await model.createEmbeddingContext({
            contextSize: 'auto',
            minContextSize: 512,
            maxContextSize: trainContextSize,
            batchSize: Math.min(512, trainContextSize),
        });
        const tokenBudget = Math.floor(trainContextSize * 0.9);
        const runtime = {
            llama,
            model,
            context,
            modelPath,
            loadTimeMs: Date.now() - start,
            gpu: typeof llama.gpu === 'string' ? llama.gpu : null,
            tokenBudget,
            contextSize: trainContextSize,
        };
        cachedRuntime = runtime;
        return runtime;
    })();
    try {
        return await runtimePromise;
    }
    catch (error) {
        runtimePromise = null;
        runtimePromisePath = null;
        cachedRuntime = null;
        throw error;
    }
}
function l2Normalize(vector) {
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
function coerceDimension(vector, dim) {
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
export class LlamaCppProvider {
    modelName;
    modelPath;
    dim;
    maxTextLength;
    timeout;
    modelLoadTime;
    isHealthy;
    prefixModelId;
    constructor(options = {}) {
        this.modelName = options.model || process.env.LLAMA_CPP_EMBEDDINGS_MODEL || DEFAULT_MODEL_ID;
        this.modelPath = normalizeModelPath(options.modelPath);
        this.dim = options.dim || EMBEDDING_DIM;
        this.maxTextLength = options.maxTextLength || MAX_TEXT_LENGTH;
        this.timeout = options.timeout || EMBEDDING_TIMEOUT;
        this.modelLoadTime = null;
        this.isHealthy = true;
        this.prefixModelId = process.env.LLAMA_CPP_EMBEDDINGS_PREFIX_MODEL || DEFAULT_PREFIX_MODEL_ID;
    }
    static async canLoad(options = {}) {
        const modelPath = normalizeModelPath(options.modelPath);
        try {
            await ensureReadableModel(modelPath);
            await loadNodeLlamaCpp();
            return { available: true };
        }
        catch (error) {
            return {
                available: false,
                reason: getErrorMessage(error),
            };
        }
    }
    async getRuntime() {
        const runtime = await withTimeout(loadRuntime(this.modelPath), MODEL_LOAD_TIMEOUT, `llama-cpp model loading timed out after ${MODEL_LOAD_TIMEOUT}ms`);
        this.modelLoadTime = runtime.loadTimeMs;
        return runtime;
    }
    async generateEmbedding(text) {
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
            if (typeof runtime.model.tokenize !== 'function' || typeof runtime.model.detokenize !== 'function') {
                throw new Error('llama-cpp model tokenizer is unavailable; cannot enforce token budget');
            }
            const tokens = runtime.model.tokenize(inputText);
            if (tokens.length > runtime.tokenBudget) {
                console.warn(`[llama-cpp] Text ${tokens.length} tokens exceeds budget ${runtime.tokenBudget}, truncating`);
                const truncated = tokens.slice(0, runtime.tokenBudget);
                inputText = runtime.model.detokenize(truncated);
            }
            const embedding = await withTimeout(runtime.context.getEmbeddingFor(inputText), this.timeout, `llama-cpp inference timed out after ${this.timeout}ms`);
            const coerced = coerceDimension(embedding.vector, this.dim);
            return l2Normalize(coerced);
        }
        catch (error) {
            this.isHealthy = false;
            console.warn(`[llama-cpp] Generation failed: ${getErrorMessage(error)}`);
            throw error;
        }
    }
    async embedDocument(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return null;
        }
        return await this.generateEmbedding(getPrefixFor(this.prefixModelId, 'document') + text);
    }
    async embedQuery(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return null;
        }
        return await this.generateEmbedding(getPrefixFor(this.prefixModelId, 'query') + text);
    }
    async warmup() {
        try {
            await this.embedQuery('test warmup query');
            this.isHealthy = true;
            return true;
        }
        catch (_error) {
            this.isHealthy = false;
            return false;
        }
    }
    getMetadata() {
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
    getProfile() {
        return new EmbeddingProfile({
            provider: 'llama-cpp',
            model: resolveProfileModel(this.modelName),
            dim: this.dim,
            dtype: resolveLlamaCppDtype(),
        });
    }
    async healthCheck() {
        try {
            const result = await this.embedQuery('health check');
            this.isHealthy = result !== null;
            return this.isHealthy;
        }
        catch (_error) {
            this.isHealthy = false;
            return false;
        }
    }
    getProviderName() {
        return 'llama-cpp';
    }
}
function resetRuntimeForTesting() {
    cachedRuntime = null;
    runtimePromise = null;
    runtimePromisePath = null;
    testRuntimeOverride = null;
    testNodeLlamaCppModule = null;
}
export const __llamaCppTestables = {
    DEFAULT_MODEL_PATH,
    loadRuntime,
    resetRuntimeForTesting,
    setRuntimeOverride(runtime) {
        testRuntimeOverride = runtime;
    },
    setNodeLlamaCppModule(module) {
        testNodeLlamaCppModule = module;
    },
};
//# sourceMappingURL=llama-cpp.js.map