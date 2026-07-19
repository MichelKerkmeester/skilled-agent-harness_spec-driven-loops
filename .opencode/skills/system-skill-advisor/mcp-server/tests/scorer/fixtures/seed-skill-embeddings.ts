// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Sweep Skill Embedding Seeder
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createEmbeddingsProvider } from '@spec-kit/shared/embeddings/factory';

export interface SeededSkill {
  readonly id: string;
  readonly description: string;
}

export interface SeedResult {
  readonly vectorsBySkillId: Map<string, Float32Array>;
  readonly providerModelId: string;
  readonly cacheHits: number;
  readonly cacheMisses: number;
  readonly skipped: boolean;
  readonly skipReason: string | null;
}

interface CacheEntry {
  readonly vector: readonly number[];
}

interface CacheManifest {
  readonly version: 1;
  readonly entries: Record<string, CacheEntry>;
}

const CACHE_DIR = join(dirname(fileURLToPath(import.meta.url)), '.embeddings-cache');
const CACHE_PATH = join(CACHE_DIR, 'skill-embeddings.json');

function emptyManifest(): CacheManifest {
  return { version: 1, entries: {} };
}

function readManifest(): CacheManifest {
  if (!existsSync(CACHE_PATH)) {
    return emptyManifest();
  }

  try {
    const parsed = JSON.parse(readFileSync(CACHE_PATH, 'utf8')) as Partial<CacheManifest>;
    if (parsed.version !== 1 || !parsed.entries || typeof parsed.entries !== 'object') {
      return emptyManifest();
    }
    return {
      version: 1,
      entries: parsed.entries,
    };
  } catch {
    return emptyManifest();
  }
}

function writeManifest(manifest: CacheManifest): void {
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CACHE_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

function cacheKey(description: string, providerModelId: string): string {
  return `${createHash('sha256').update(description).digest('hex').slice(0, 16)}:${providerModelId}`;
}

function providerModelId(profile: { provider: string; model: string; dim: number; dtype?: string | null; slug?: string }): string {
  return profile.slug ?? [profile.provider, profile.model, profile.dim, profile.dtype ?? null]
    .filter((part): part is string | number => part !== null && part !== undefined && part !== '')
    .join(':');
}

function skip(reason: string): SeedResult {
  return {
    vectorsBySkillId: new Map(),
    providerModelId: 'unavailable',
    cacheHits: 0,
    cacheMisses: 0,
    skipped: true,
    skipReason: reason,
  };
}

/**
 * Seeds fixture skill description embeddings for the lane-weight sweep.
 *
 * Cache entries live under `fixtures/.embeddings-cache/` and are keyed as
 * `sha256(skill.description).slice(0, 16) + ':' + providerModelId`, so changing
 * either the skill description or the active embedding provider invalidates
 * only the affected row. Provider creation or embedding-call failures are
 * treated as environment skips: the helper returns `skipped: true`, an empty
 * vector map, and a human-readable `skipReason` instead of throwing, allowing
 * Vitest to skip the seeded sweep when the local provider is unavailable.
 */
export async function seedSkillEmbeddings(skills: readonly SeededSkill[]): Promise<SeedResult> {
  let provider;
  let modelId: string;
  try {
    provider = await createEmbeddingsProvider();
    modelId = providerModelId(provider.getProfile());
  } catch (error: unknown) {
    return skip(error instanceof Error ? error.message : String(error));
  }

  const manifest = readManifest();
  const vectorsBySkillId = new Map<string, Float32Array>();
  let cacheHits = 0;
  let cacheMisses = 0;
  let changed = false;

  for (const skill of skills) {
    const description = skill.description.trim();
    if (!description) {
      continue;
    }

    const key = cacheKey(description, modelId);
    const cached = manifest.entries[key];
    if (cached) {
      vectorsBySkillId.set(skill.id, Float32Array.from(cached.vector));
      cacheHits++;
      continue;
    }

    try {
      const vector = await provider.embedDocument(description);
      if (!vector) {
        return skip(`provider returned no vector for ${skill.id}`);
      }
      const array = vector instanceof Float32Array ? vector : Float32Array.from(vector);
      manifest.entries[key] = { vector: Array.from(array) };
      vectorsBySkillId.set(skill.id, array);
      cacheMisses++;
      changed = true;
    } catch (error: unknown) {
      return skip(error instanceof Error ? error.message : String(error));
    }
  }

  if (changed) {
    writeManifest(manifest);
  }

  return {
    vectorsBySkillId,
    providerModelId: modelId,
    cacheHits,
    cacheMisses,
    skipped: false,
    skipReason: null,
  };
}
