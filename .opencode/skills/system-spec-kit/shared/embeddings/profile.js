// ---------------------------------------------------------------
// MODULE: Profile
// ---------------------------------------------------------------
import * as fs from 'fs';
import * as path from 'path';
import { getLlamaCppAvailability } from './llama-cpp-availability.js';
// ---------------------------------------------------------------
// 1. UTILITY FUNCTIONS
// ---------------------------------------------------------------
/** Create safe slug for filenames (e.g., openai__text-embedding-3-small__1536) */
export function createProfileSlug(provider, model, dim, dtype) {
    const safeModel = model
        .replace(/[^a-zA-Z0-9-_.]/g, '_')
        .replace(/__+/g, '_')
        .toLowerCase();
    const safeDtype = dtype
        ? dtype.replace(/[^a-zA-Z0-9-_.]/g, '_').replace(/__+/g, '_').toLowerCase()
        : null;
    return safeDtype
        ? `${provider}__${safeModel}__${dim}__${safeDtype}`
        : `${provider}__${safeModel}__${dim}`;
}
/** Parse profile slug back to components */
export function parseProfileSlug(slug) {
    const parts = slug.split('__');
    if (parts.length !== 3 && parts.length !== 4)
        return null;
    const dim = parseInt(parts[2], 10);
    if (isNaN(dim))
        return null;
    return {
        provider: parts[0],
        model: parts[1],
        dim,
        dtype: parts[3] ?? null,
    };
}
/** Provides embedding profile. */
export class EmbeddingProfile {
    provider;
    model;
    dim;
    dtype;
    baseUrl;
    slug;
    constructor({ provider, model, dim, dtype = null, baseUrl = null }) {
        this.provider = provider;
        this.model = model;
        this.dim = dim;
        this.dtype = dtype;
        this.baseUrl = baseUrl;
        this.slug = createProfileSlug(provider, model, dim, dtype);
    }
    /** Get database path for the profile-keyed sqlite file. */
    getDatabasePath(baseDir) {
        return `${baseDir}/context-index__${this.slug}.sqlite`;
    }
    toFilename() {
        // dtype is part of the sqlite filename when present, preventing mixed-precision reuse.
        return `context-index__${this.slug}.sqlite`;
    }
    toDisplayString() {
        return this.dtype
            ? `${this.provider}:${this.model}:${this.dim}:${this.dtype}`
            : `${this.provider}:${this.model}:${this.dim}`;
    }
    equals(other) {
        return this.provider === other.provider
            && this.model === other.model
            && this.dim === other.dim
            && this.dtype === other.dtype
            && this.baseUrl === other.baseUrl;
    }
    toJson() {
        return {
            provider: this.provider,
            model: this.model,
            dim: this.dim,
            dtype: this.dtype,
            baseUrl: this.baseUrl,
            slug: this.slug,
        };
    }
}
export const ALLOWED_HF_LOCAL_DTYPES = [
    'fp32',
    'fp16',
    'q4',
    'q4f16',
    'q8',
    'int8',
    'uint8',
    'bnb4',
];
export const ALLOWED_LLAMA_CPP_DTYPES = [
    'q8',
    'q4',
    'q4_0',
    'q4_1',
    'q5_0',
    'q5_1',
    'q8_0',
    'f16',
    'f32',
];
function normalizeProfileProvider(value) {
    const normalized = value?.trim().toLowerCase();
    if (normalized === 'voyage'
        || normalized === 'openai'
        || normalized === 'hf-local'
        || normalized === 'llama-cpp') {
        return normalized;
    }
    return null;
}
function hasUsableApiKey(value) {
    if (!value || value.trim().length < 10) {
        return false;
    }
    const upperValue = value.toUpperCase();
    return !upperValue.includes('YOUR_')
        && !upperValue.includes('PLACEHOLDER')
        && !upperValue.includes('HERE');
}
export function resolveActiveProfileProvider() {
    const explicitProvider = normalizeProfileProvider(process.env.EMBEDDINGS_PROVIDER);
    if (explicitProvider) {
        return explicitProvider;
    }
    if (hasUsableApiKey(process.env.VOYAGE_API_KEY)) {
        return 'voyage';
    }
    if (hasUsableApiKey(process.env.OPENAI_API_KEY)) {
        return 'openai';
    }
    if (getLlamaCppAvailability().available) {
        return 'llama-cpp';
    }
    return 'hf-local';
}
function resolveActiveProfileModel(provider) {
    switch (provider) {
        case 'voyage':
            return process.env.VOYAGE_EMBEDDINGS_MODEL || 'voyage-4';
        case 'openai':
            return process.env.OPENAI_EMBEDDINGS_MODEL || 'text-embedding-3-small';
        case 'llama-cpp':
            return (process.env.LLAMA_CPP_EMBEDDINGS_MODEL || 'unsloth/embeddinggemma-300m-GGUF').replace(/\//g, '-');
        case 'hf-local':
        default:
            return process.env.HF_EMBEDDINGS_MODEL || 'onnx-community/embeddinggemma-300m-ONNX';
    }
}
function resolveActiveProfileDim(provider, model) {
    const explicitDim = Number.parseInt(process.env.EMBEDDING_DIM || '', 10);
    if (Number.isFinite(explicitDim) && explicitDim > 0) {
        return explicitDim;
    }
    if (provider === 'openai' && model === 'text-embedding-3-large') {
        return 3072;
    }
    if (provider === 'hf-local' && model === 'intfloat/e5-large-v2') {
        return 1024;
    }
    if (provider === 'hf-local' && model === 'mixedbread-ai/mxbai-embed-large-v1') {
        return 1024;
    }
    if (provider === 'hf-local' && model === 'Snowflake/snowflake-arctic-embed-l-v2.0') {
        return 1024;
    }
    if (provider === 'hf-local' && model === 'BAAI/bge-m3') {
        return 1024;
    }
    if (provider === 'voyage') {
        return 1024;
    }
    return 768;
}
export function normalizeProfileDtype(value) {
    const normalized = value?.trim().toLowerCase();
    if (!normalized) {
        return null;
    }
    return normalized.replace(/[^a-z0-9-_.]/g, '_').replace(/__+/g, '_');
}
function resolveAllowedDtype(value, allowed, fallback) {
    const configured = normalizeProfileDtype(value);
    if (configured && allowed.includes(configured)) {
        return configured === 'q8_0' ? 'q8' : configured;
    }
    return fallback;
}
export function resolveActiveProfileDtype(provider) {
    if (provider === 'hf-local') {
        return resolveAllowedDtype(process.env.HF_EMBEDDINGS_DTYPE, ALLOWED_HF_LOCAL_DTYPES, 'q8');
    }
    if (provider === 'llama-cpp') {
        return resolveAllowedDtype(process.env.LLAMA_CPP_EMBEDDINGS_DTYPE, ALLOWED_LLAMA_CPP_DTYPES, 'q8');
    }
    if (provider === 'voyage' || provider === 'openai') {
        return 'cloud';
    }
    return null;
}
function createActiveProfileFromEnv() {
    const provider = resolveActiveProfileProvider();
    const model = resolveActiveProfileModel(provider);
    return new EmbeddingProfile({
        provider,
        model,
        dim: resolveActiveProfileDim(provider, model),
        dtype: resolveActiveProfileDtype(provider),
        baseUrl: provider === 'voyage' ? (process.env.VOYAGE_API_URL || null) : null,
    });
}
function findUp(startDir, predicate) {
    let currentDir = startDir;
    while (true) {
        if (predicate(currentDir)) {
            return currentDir;
        }
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            return null;
        }
        currentDir = parentDir;
    }
}
function resolveDefaultActiveProfileDbDir() {
    const configuredDir = process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR;
    if (configuredDir && configuredDir.trim().length > 0) {
        return path.resolve(process.cwd(), configuredDir.trim());
    }
    const workspaceRoot = findUp(process.cwd(), (dir) => (fs.existsSync(path.join(dir, 'mcp_server', 'database'))
        && fs.existsSync(path.join(dir, 'shared'))));
    if (workspaceRoot) {
        return path.join(workspaceRoot, 'mcp_server', 'database');
    }
    const repoRoot = findUp(process.cwd(), (dir) => (fs.existsSync(path.join(dir, '.opencode', 'skills', 'system-spec-kit', 'mcp_server', 'database'))));
    if (repoRoot) {
        return path.join(repoRoot, '.opencode', 'skills', 'system-spec-kit', 'mcp_server', 'database');
    }
    return path.resolve(process.cwd(), 'mcp_server', 'database');
}
export function resolveActiveProfileDbPath(profile, dbDir) {
    const activeProfile = profile ?? createActiveProfileFromEnv();
    const databaseDir = dbDir && dbDir.trim().length > 0
        ? path.resolve(process.cwd(), dbDir.trim())
        : resolveDefaultActiveProfileDbDir();
    return activeProfile.getDatabasePath(databaseDir);
}
//# sourceMappingURL=profile.js.map