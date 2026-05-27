// ───────────────────────────────────────────────────────────────────
// MODULE: Bootstrap Embedder Auto-Selection
// ───────────────────────────────────────────────────────────────────

import { execFile } from 'node:child_process';
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { getCanonicalFallback, MANIFESTS } from './registry.js';
import type { ProviderResolution } from '../types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

export type AutoSelectedEmbedderProvider = 'voyage' | 'openai' | 'ollama' | 'hf-local';

export interface AutoSelectedEmbedder {
  readonly name: string;
  readonly dim: number;
  readonly provider: AutoSelectedEmbedderProvider;
}

export interface AutoSelectProbeResult {
  readonly tier: AutoSelectedEmbedderProvider;
  readonly ok: boolean;
  readonly reason: string;
}

export interface AutoSelectResult extends AutoSelectedEmbedder {
  readonly probes: readonly AutoSelectProbeResult[];
}

export interface AutoSelectMetadataStore {
  readActiveEmbedder(): AutoSelectedEmbedder | null;
  persistActiveEmbedder(embedder: AutoSelectedEmbedder): void;
}

/**
 * Content type the cascade should optimize for.
 *
 * - `'text'`: prose-tuned embedders (default). Used by mk-spec-memory and
 *   skill-advisor, which index prose memory and skill metadata respectively.
 * - `'code'`: code-tuned embedders. Today the TS-side shared cascade has no
 *   code consumer. The parameter is reserved for a future TS code consumer.
 *   Current cascade behaviour is
 *   identical regardless of `contentType` because every registered manifest
 *   is text-tuned. Voyage's `voyage-code-3` is documented as an acknowledged
 *   compromise for prose memory at current scale — a future contentType-aware
 *   refactor can split this probe.
 */
export type EmbedderContentType = 'text' | 'code';

export interface AutoSelectOptions {
  readonly env?: NodeJS.ProcessEnv;
  readonly fetchImpl?: typeof fetch;
  readonly timeoutMs?: number;
  readonly metadataStore?: AutoSelectMetadataStore;
  readonly lockPath?: string;
  readonly lockStaleMs?: number;
  readonly sleepMs?: number;
  readonly runPythonImportProbe?: () => Promise<boolean>;
  /**
   * Content type the consumer is optimising for. Defaults to `'text'`.
   * This parameter preserves the conceptual content-type split on the TS side
   * without forcing a runtime branch yet.
   */
  readonly contentType?: EmbedderContentType;
}

interface ProbeContext {
  readonly env: NodeJS.ProcessEnv;
  readonly fetchImpl: typeof fetch;
  readonly timeoutMs: number;
  readonly runPythonImportProbe: () => Promise<boolean>;
}

interface ProbeOutcome {
  readonly embedder?: AutoSelectedEmbedder;
  readonly reason: string;
}

interface OllamaManifest {
  readonly name: string;
  readonly dim: number;
  readonly ollamaName: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

// Cascade-probe timing constants. Each accepts an optional env-var
// override so operators can tune the cascade without code edits. Defaults are
// empirically tuned for the cascade reorder.
function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (typeof value !== 'string') return fallback;
  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const DEFAULT_TIMEOUT_MS = parsePositiveInt(
  process.env.SPECKIT_CASCADE_PROBE_TIMEOUT_MS,
  2_500,
);
const DEFAULT_LOCK_STALE_MS = parsePositiveInt(
  process.env.SPECKIT_CASCADE_LOCK_STALE_MS,
  30_000,
);
const DEFAULT_SLEEP_MS = parsePositiveInt(
  process.env.SPECKIT_CASCADE_SLEEP_MS,
  25,
);
const VOYAGE_MODEL = getCanonicalFallback('voyage');
const VOYAGE_DIM = 1024;
const OPENAI_MODEL = getCanonicalFallback('openai');
const OPENAI_DIM = 1536;
const HF_LOCAL_MODEL = getCanonicalFallback('hf-local');
const HF_LOCAL_DIM = 768;

const OLLAMA_PRIORITY: readonly OllamaManifest[] = Object.freeze(
  MANIFESTS.map(m => ({
    name: m.name,
    dim: m.dim,
    ollamaName: m.ollamaName!,
  })),
);

const execFileAsync = promisify(execFile);

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function resolveVoyageBaseUrl(env: NodeJS.ProcessEnv): string {
  return (env.VOYAGE_BASE_URL || 'https://api.voyageai.com/v1').replace(/\/+$/, '');
}

function resolveOpenAiBaseUrl(env: NodeJS.ProcessEnv): string {
  return (env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
}

function resolveOllamaBaseUrl(env: NodeJS.ProcessEnv): string {
  return (env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/+$/, '');
}

function hasUsableKey(value: string | undefined): boolean {
  if (!value || value.trim().length < 10) {
    return false;
  }
  const upperValue = value.toUpperCase();
  return !upperValue.includes('YOUR_')
    && !upperValue.includes('PLACEHOLDER')
    && !upperValue.includes('HERE');
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function fetchJsonWithTimeout(
  fetchImpl: typeof fetch,
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<{ response: Response; body: unknown }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      ...init,
      signal: controller.signal,
    });
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    return { response, body };
  } finally {
    clearTimeout(timeoutId);
  }
}

function readEmbeddingDim(body: unknown): number | null {
  if (!body || typeof body !== 'object') {
    return null;
  }
  const data = (body as { data?: unknown }).data;
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  const first = data[0] as { embedding?: unknown } | undefined;
  if (!first || !Array.isArray(first.embedding)) {
    return null;
  }
  return first.embedding.every((value) => typeof value === 'number' && Number.isFinite(value))
    ? first.embedding.length
    : null;
}

function parseOllamaTags(body: unknown): Set<string> {
  if (!body || typeof body !== 'object') {
    return new Set();
  }
  const models = (body as { models?: unknown }).models;
  if (!Array.isArray(models)) {
    return new Set();
  }
  return new Set(models.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') {
      return [];
    }
    const record = entry as Record<string, unknown>;
    return [record.name, record.model].filter((value): value is string => typeof value === 'string');
  }));
}

function tagAliases(tag: string): string[] {
  const aliases = new Set<string>([tag]);
  if (tag.endsWith(':latest')) {
    aliases.add(tag.slice(0, -':latest'.length));
  } else if (!tag.includes(':')) {
    aliases.add(`${tag}:latest`);
  }
  return Array.from(aliases);
}

function tagsContain(tags: Set<string>, tag: string): boolean {
  return tagAliases(tag).some((alias) => tags.has(alias));
}

async function defaultPythonImportProbe(): Promise<boolean> {
  const python = process.env.SPECKIT_SENTENCE_TRANSFORMERS_PYTHON
    || process.env.PYTHON
    || 'python3';
  try {
    await execFileAsync(python, ['-c', 'import sentence_transformers'], {
      timeout: DEFAULT_TIMEOUT_MS,
      windowsHide: true,
    });
    return true;
  } catch {
    return false;
  }
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function acquireLock(
  lockPath: string,
  staleMs: number,
  sleepMs: number,
): Promise<() => Promise<void>> {
  const deadline = Date.now() + staleMs;
  while (Date.now() < deadline) {
    try {
      await mkdir(lockPath, { recursive: false });
      await writeFile(
        path.join(lockPath, 'owner.json'),
        JSON.stringify({
          pid: process.pid,
          host: os.hostname(),
          acquiredAt: new Date().toISOString(),
        }, null, 2),
        'utf8',
      );
      return async () => {
        await rm(lockPath, { recursive: true, force: true });
      };
    } catch (error: unknown) {
      if ((error as { code?: string }).code !== 'EEXIST') {
        throw error;
      }
      try {
        const lockStat = await stat(lockPath);
        if (Date.now() - lockStat.mtimeMs > staleMs) {
          await rm(lockPath, { recursive: true, force: true });
          continue;
        }
      } catch {
        continue;
      }
      await delay(sleepMs);
    }
  }
  throw new Error(`Timed out waiting for embedder auto-selection lock: ${lockPath}`);
}

async function withOptionalLock<T>(
  options: AutoSelectOptions,
  operation: () => Promise<T>,
): Promise<T> {
  if (!options.lockPath) {
    return operation();
  }

  const release = await acquireLock(
    options.lockPath,
    options.lockStaleMs ?? DEFAULT_LOCK_STALE_MS,
    options.sleepMs ?? DEFAULT_SLEEP_MS,
  );
  try {
    return await operation();
  } finally {
    await release();
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. PROBES
// ───────────────────────────────────────────────────────────────────

async function probeVoyage(context: ProbeContext): Promise<ProbeOutcome> {
  if (!hasUsableKey(context.env.VOYAGE_API_KEY)) {
    return { reason: 'VOYAGE_API_KEY not set or placeholder' };
  }

  try {
    const { response, body } = await fetchJsonWithTimeout(
      context.fetchImpl,
      `${resolveVoyageBaseUrl(context.env)}/embeddings`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${context.env.VOYAGE_API_KEY}`,
        },
        body: JSON.stringify({
          input: ['spec-memory bootstrap probe'],
          model: VOYAGE_MODEL,
          input_type: 'query',
        }),
      },
      context.timeoutMs,
    );
    if (!response.ok) {
      return { reason: `Voyage embeddings probe returned ${response.status} ${response.statusText}` };
    }
    const dim = readEmbeddingDim(body) ?? VOYAGE_DIM;
    return {
      embedder: {
        name: VOYAGE_MODEL,
        dim,
        provider: 'voyage',
      },
      reason: `Voyage ${VOYAGE_MODEL} probe succeeded (${dim}d)`,
    };
  } catch (error: unknown) {
    return { reason: `Voyage embeddings probe failed: ${errorMessage(error)}` };
  }
}

async function probeOpenAi(context: ProbeContext): Promise<ProbeOutcome> {
  if (!hasUsableKey(context.env.OPENAI_API_KEY)) {
    return { reason: 'OPENAI_API_KEY not set or placeholder' };
  }

  try {
    const { response, body } = await fetchJsonWithTimeout(
      context.fetchImpl,
      `${resolveOpenAiBaseUrl(context.env)}/embeddings`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${context.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          input: 'spec-memory bootstrap probe',
          model: OPENAI_MODEL,
          encoding_format: 'float',
        }),
      },
      context.timeoutMs,
    );
    if (!response.ok) {
      return { reason: `OpenAI embeddings probe returned ${response.status} ${response.statusText}` };
    }
    const dim = readEmbeddingDim(body) ?? OPENAI_DIM;
    return {
      embedder: {
        name: OPENAI_MODEL,
        dim,
        provider: 'openai',
      },
      reason: `OpenAI ${OPENAI_MODEL} probe succeeded (${dim}d)`,
    };
  } catch (error: unknown) {
    return { reason: `OpenAI embeddings probe failed: ${errorMessage(error)}` };
  }
}

async function probeOllama(context: ProbeContext): Promise<ProbeOutcome> {
  const baseUrl = resolveOllamaBaseUrl(context.env);
  try {
    const { response, body } = await fetchJsonWithTimeout(
      context.fetchImpl,
      `${baseUrl}/api/tags`,
      { method: 'GET' },
      context.timeoutMs,
    );
    if (!response.ok) {
      return { reason: `Ollama /api/tags returned ${response.status} ${response.statusText}` };
    }
    const tags = parseOllamaTags(body);
    if (tags.size === 0) {
      return { reason: 'Ollama /api/tags returned no pulled models' };
    }
    for (const manifest of OLLAMA_PRIORITY) {
      if (tagsContain(tags, manifest.ollamaName) || tagsContain(tags, manifest.name)) {
        return {
          embedder: {
            name: manifest.name,
            dim: manifest.dim,
            provider: 'ollama',
          },
          reason: `Ollama has pulled model ${manifest.ollamaName}`,
        };
      }
    }
    return {
      reason: `Ollama reachable but none of ${OLLAMA_PRIORITY.map((manifest) => manifest.name).join(', ')} are pulled`,
    };
  } catch (error: unknown) {
    return { reason: `Ollama probe failed at ${baseUrl}: ${errorMessage(error)}` };
  }
}

async function probeHfLocal(context: ProbeContext): Promise<ProbeOutcome> {
  const model = context.env.HF_LOCAL_MODEL || context.env.HF_EMBEDDINGS_MODEL || HF_LOCAL_MODEL;
  const importable = await context.runPythonImportProbe();
  if (!importable) {
    return { reason: 'sentence-transformers is not importable by the configured Python runtime' };
  }
  return {
    embedder: {
      name: model,
      dim: HF_LOCAL_DIM,
      provider: 'hf-local',
    },
    reason: `sentence-transformers import succeeded; selected ${model}`,
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

export class AutoSelectEmbedderError extends Error {
  readonly probes: readonly AutoSelectProbeResult[];

  constructor(probes: readonly AutoSelectProbeResult[]) {
    super(
      'Unable to auto-select an active embedder. Probed tiers: '
      + probes.map((probe) => `${probe.tier}: ${probe.reason}`).join('; '),
    );
    this.name = 'AutoSelectEmbedderError';
    this.probes = probes;
  }
}

async function selectWithoutPersistence(options: AutoSelectOptions): Promise<AutoSelectResult> {
  const context: ProbeContext = {
    env: options.env ?? process.env,
    fetchImpl: options.fetchImpl ?? fetch,
    timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    runPythonImportProbe: options.runPythonImportProbe ?? defaultPythonImportProbe,
  };

  const probes: AutoSelectProbeResult[] = [];
  // Local-first cascade. Try Ollama first, fall through to hf-local
  // (Python/sentence-transformers), then escalate to cloud APIs (OpenAI, Voyage)
  // only when nothing local works. Supersedes the cloud-first ordering.
  const sequence: Array<readonly [AutoSelectedEmbedderProvider, (ctx: ProbeContext) => Promise<ProbeOutcome>]> = [
    ['ollama', probeOllama],
    ['hf-local', probeHfLocal],
    ['openai', probeOpenAi],
    ['voyage', probeVoyage],
  ];

  for (const [tier, probe] of sequence) {
    const outcome = await probe(context);
    probes.push({
      tier,
      ok: Boolean(outcome.embedder),
      reason: outcome.reason,
    });
    if (outcome.embedder) {
      return {
        ...outcome.embedder,
        probes,
      };
    }
  }

  throw new AutoSelectEmbedderError(probes);
}

export async function autoSelectActiveEmbedder(options: AutoSelectOptions = {}): Promise<AutoSelectResult> {
  return withOptionalLock(options, async () => {
    const existing = options.metadataStore?.readActiveEmbedder();
    if (existing) {
      return {
        ...existing,
        probes: [{
          tier: existing.provider,
          ok: true,
          reason: 'active embedder already persisted in vec_metadata',
        }],
      };
    }

    const selected = await selectWithoutPersistence(options);
    options.metadataStore?.persistActiveEmbedder(selected);
    return selected;
  });
}

export function providerResolutionFromAutoSelect(result: AutoSelectedEmbedder): ProviderResolution {
  return {
    name: result.provider,
    reason: `auto-selected ${result.name} from bootstrap precedence chain`,
  };
}

export const __autoSelectTestables = {
  parseOllamaTags,
  tagsContain,
  readEmbeddingDim,
};
