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
      throw new Error('skill graph database is absent; shadow scoring disabled');
    }
    const active = getActiveEmbedder(database);
    const adapter = getAdapter(active.name);
    if (!adapter) {
      throw new Error(`active embedder is not registered: ${active.name}`);
    }

    const [vector] = await adapter.embed([prompt], { inputType: 'query' });
    setSemanticShadowPromptEmbedding(prompt, vector ?? null);
  } catch (error: unknown) {
    setSemanticShadowPromptEmbedding(prompt, null);
    const message = error instanceof Error ? error.message : String(error);
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

export function scoreSemanticShadowLane(prompt: string, projection: AdvisorProjection): LaneMatch[] {
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
      console.warn(`[semantic-shadow] Skill embedding load failed; cosine lane disabled (${message})`);
      return [];
    }
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
