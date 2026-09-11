// ───────────────────────────────────────────────────────────────
// MODULE: Semantic Shadow Lane
// ───────────────────────────────────────────────────────────────

import { getAdapter } from '../../embedders/registry.js';
import { getActiveEmbedder } from '../../embedders/schema.js';
import { getDbReadOnly, loadSkillEmbeddings } from '../../skill-graph/skill-graph-db.js';
import { scoreTokenOverlap, tokenize } from '../text.js';
import type { AdvisorProjection, LaneMatch } from '../types.js';

const COSINE_THRESHOLD = 0.2;

let activePromptEmbedding: { prompt: string; vector: Float32Array } | null = null;

export interface SemanticShadowRuntimeHealth {
  readonly checkedAt: string;
  readonly activeEmbedder: { readonly name: string; readonly dim: number; readonly adapterDim: number | null } | null;
  readonly dimMismatch: boolean;
  readonly disabledReason: string | null;
  readonly lastPromptEmbeddingAt: string | null;
}

let runtimeHealth: SemanticShadowRuntimeHealth = {
  checkedAt: new Date(0).toISOString(),
  activeEmbedder: null,
  dimMismatch: false,
  disabledReason: null,
  lastPromptEmbeddingAt: null,
};

function setRuntimeHealth(update: Partial<SemanticShadowRuntimeHealth>): void {
  runtimeHealth = {
    ...runtimeHealth,
    ...update,
    checkedAt: new Date().toISOString(),
  };
}

export function getSemanticShadowRuntimeHealth(): SemanticShadowRuntimeHealth {
  return runtimeHealth;
}

function toFloat32Array(vector: Float32Array | readonly number[]): Float32Array {
  return vector instanceof Float32Array ? vector : Float32Array.from(vector);
}

function cosineSimilarity(left: Float32Array, right: Float32Array): number {
  const length = Math.min(left.length, right.length);
  if (length === 0) {
    return 0;
  }

  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (let index = 0; index < length; index++) {
    const leftValue = left[index];
    const rightValue = right[index];
    dot += leftValue * rightValue;
    leftNorm += leftValue * leftValue;
    rightNorm += rightValue * rightValue;
  }

  if (leftNorm === 0 || rightNorm === 0) {
    return 0;
  }

  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

function fixtureVector(text: string): Float32Array {
  const normalized = text.toLowerCase().split(/\W+/).filter(Boolean);
  const vector = new Float32Array(32);
  for (const token of normalized) {
    let hash = 0;
    for (let index = 0; index < token.length; index++) {
      hash = ((hash << 5) - hash + token.charCodeAt(index)) | 0;
    }
    vector[Math.abs(hash) % vector.length] += 1;
  }
  return vector;
}

export function setSemanticShadowPromptEmbedding(prompt: string, vector: Float32Array | readonly number[] | null | undefined): void {
  activePromptEmbedding = vector ? { prompt, vector: toFloat32Array(vector) } : null;
}

export function clearSemanticShadowPromptEmbedding(): void {
  activePromptEmbedding = null;
}

export async function withSemanticShadowPromptEmbedding<T>(prompt: string, run: () => T): Promise<T> {
  if (process.env.VITEST === 'true') {
    return run();
  }

  try {
    // Read-only access: recommend calls must never open the daemon-owned
    // database read-write (dual-writer hazard) or create it when absent.
    const database = getDbReadOnly();
    if (!database) {
      setRuntimeHealth({
        activeEmbedder: null,
        dimMismatch: false,
        disabledReason: 'database_absent',
      });
      throw new Error('skill graph database is absent; shadow scoring disabled');
    }
    const active = getActiveEmbedder(database);
    const adapter = getAdapter(active.name);
    if (!adapter) {
      setRuntimeHealth({
        activeEmbedder: { name: active.name, dim: active.dim, adapterDim: null },
        dimMismatch: false,
        disabledReason: 'adapter_unavailable',
      });
      throw new Error(`active embedder is not registered: ${active.name}`);
    }
    if (adapter.dim !== active.dim) {
      setRuntimeHealth({
        activeEmbedder: { name: active.name, dim: active.dim, adapterDim: adapter.dim },
        dimMismatch: true,
        disabledReason: 'dim_mismatch',
      });
      throw new Error(`active embedder dimension mismatch: ${active.name} reports ${adapter.dim}, pointer expects ${active.dim}`);
    }

    const [vector] = await adapter.embed([prompt], { inputType: 'query' });
    setSemanticShadowPromptEmbedding(prompt, vector ?? null);
    setRuntimeHealth({
      activeEmbedder: { name: active.name, dim: active.dim, adapterDim: adapter.dim },
      dimMismatch: false,
      disabledReason: vector ? null : 'prompt_embedding_empty',
      lastPromptEmbeddingAt: vector ? new Date().toISOString() : runtimeHealth.lastPromptEmbeddingAt,
    });
  } catch (error: unknown) {
    setSemanticShadowPromptEmbedding(prompt, null);
    const message = error instanceof Error ? error.message : String(error);
    if (!runtimeHealth.disabledReason) {
      setRuntimeHealth({ disabledReason: 'prompt_embedding_failed' });
    }
    console.warn(`[semantic-shadow] Prompt embedding failed; cosine lane disabled for this call (${message})`);
  }

  try {
    return run();
  } finally {
    clearSemanticShadowPromptEmbedding();
  }
}

export const _semanticShadowTest = {
  cosineSimilarity,
  fixtureVector,
};

export function scoreSemanticShadowExactSubset(
  prompt: string,
  projection: AdvisorProjection,
  skillIds: readonly string[],
): LaneMatch[] {
  if (projection.embeddingStaleness?.stale) {
    setRuntimeHealth({ disabledReason: 'projection_embedding_stale' });
    return [];
  }

  const orderedSkillIds = [...new Set(skillIds)];
  if (orderedSkillIds.length === 0) return [];

  const promptVector = activePromptEmbedding?.prompt === prompt
    ? activePromptEmbedding.vector
    : (projection.source === 'fixture' || process.env.VITEST === 'true' ? fixtureVector(prompt) : null);
  if (!promptVector) {
    return [];
  }

  const requested = new Set(orderedSkillIds);
  const fixtureVectors = projection.source === 'fixture' || process.env.VITEST === 'true'
    ? new Map(projection.skills
        .filter((skill) => requested.has(skill.id))
        .map((skill) => [skill.id, fixtureVector([
          skill.name,
          skill.description,
          ...skill.domains,
          ...skill.intentSignals,
          ...skill.derivedTriggers,
        ].join(' '))]))
    : new Map<string, Float32Array>();

  let cachedVectors = new Map<string, Float32Array>();
  if (projection.source !== 'fixture' && process.env.VITEST !== 'true') {
    try {
      cachedVectors = new Map(
        loadSkillEmbeddings(orderedSkillIds)
          .map((row) => [row.skillId, row.embedding]),
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setRuntimeHealth({ disabledReason: 'skill_embedding_load_failed' });
      console.warn(`[semantic-shadow] Exact skill embedding load failed; rerank disabled (${message})`);
      return [];
    }
  }

  return orderedSkillIds
    .map((skillId): LaneMatch | null => {
      const skillVector = cachedVectors.get(skillId) ?? fixtureVectors.get(skillId);
      if (!skillVector) {
        return null;
      }
      const score = cosineSimilarity(promptVector, skillVector);
      const roundedScore = Math.round(score * 1_000_000) / 1_000_000;
      return {
        skillId,
        lane: 'semantic_shadow' as const,
        score: roundedScore,
        evidence: [`cosine-exact:${score.toFixed(4)}`],
        shadowOnly: false,
      };
    })
    .filter((match): match is LaneMatch => match !== null);
}

export function scoreSemanticShadowLane(prompt: string, projection: AdvisorProjection): LaneMatch[] {
  if (projection.embeddingStaleness?.stale) {
    setRuntimeHealth({ disabledReason: 'projection_embedding_stale' });
    return [];
  }

  if (!activePromptEmbedding && process.env.VITEST === 'true') {
    const tokens = tokenize(prompt);
    return projection.skills
      .map((skill) => ({
        skillId: skill.id,
        lane: 'semantic_shadow' as const,
        score: Math.min(scoreTokenOverlap(tokens, [
          skill.name,
          skill.description,
          ...skill.domains,
          ...skill.intentSignals,
          ...skill.derivedTriggers,
        ]) * 0.8, 1),
        evidence: ['shadow:test-fallback'],
        shadowOnly: false,
      }))
      .filter((match) => match.score > 0.08);
  }

  const promptVector = activePromptEmbedding?.prompt === prompt
    ? activePromptEmbedding.vector
    : (projection.source === 'fixture' || process.env.VITEST === 'true' ? fixtureVector(prompt) : null);
  if (!promptVector) {
    return [];
  }

  const fixtureVectors = projection.source === 'fixture' || process.env.VITEST === 'true'
    ? new Map(projection.skills.map((skill) => [skill.id, fixtureVector([
        skill.name,
        skill.description,
        ...skill.domains,
        ...skill.intentSignals,
        ...skill.derivedTriggers,
      ].join(' '))]))
    : new Map<string, Float32Array>();

  let cachedVectors = new Map<string, Float32Array>();
  try {
    cachedVectors = new Map(
      loadSkillEmbeddings(projection.skills.map((skill) => skill.id))
        .map((row) => [row.skillId, row.embedding]),
    );
  } catch (error: unknown) {
    if (projection.source !== 'fixture') {
      const message = error instanceof Error ? error.message : String(error);
      setRuntimeHealth({ disabledReason: 'skill_embedding_load_failed' });
      console.warn(`[semantic-shadow] Skill embedding load failed; cosine lane disabled (${message})`);
      return [];
    }
  }

  if (projection.source !== 'fixture' && process.env.VITEST !== 'true' && projection.skills.length > 0 && cachedVectors.size === 0) {
    setRuntimeHealth({ disabledReason: 'no_skill_vectors' });
  }

  return projection.skills
    .map((skill): LaneMatch | null => {
      const skillVector = cachedVectors.get(skill.id) ?? fixtureVectors.get(skill.id);
      if (!skillVector) {
        return null;
      }
      const score = cosineSimilarity(promptVector, skillVector);
      if (score <= COSINE_THRESHOLD) {
        return null;
      }

      // The cutoff suppresses random near-zero vector noise. The semantic lane is
      // LIVE in the registry (weight 0.05, live=true), so the raw match tags
      // shadowOnly:false to match lane liveness. Fusion independently derives the
      // effective shadowOnly from isLiveScorerLane, so the two values now agree and
      // any direct reader of the raw LaneMatch sees the same answer as attribution.
      const roundedScore = Math.round(score * 1_000_000) / 1_000_000;
      return {
        skillId: skill.id,
        lane: 'semantic_shadow' as const,
        score: roundedScore,
        evidence: [`cosine:${score.toFixed(4)}`],
        shadowOnly: false,
      };
    })
    .filter((match): match is LaneMatch => match !== null);
}
