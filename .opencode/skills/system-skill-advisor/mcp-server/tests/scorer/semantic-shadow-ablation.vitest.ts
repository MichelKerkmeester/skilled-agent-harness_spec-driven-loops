// ───────────────────────────────────────────────────────────────
// MODULE: Semantic Shadow Ablation + Fail-On-Skip Guard
// ───────────────────────────────────────────────────────────────

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { createEmbeddingsProvider } from '@spec-kit/shared/embeddings/factory';

import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import {
  clearSemanticShadowPromptEmbedding,
  getSemanticShadowRuntimeHealth,
  scoreSemanticShadowLane,
  setSemanticShadowPromptEmbedding,
} from '../../lib/scorer/lanes/semantic-shadow.js';
import { createFixtureProjection, loadAdvisorProjection } from '../../lib/scorer/projection.js';
import type { AdvisorProjection, AdvisorScoringResult, SkillProjection } from '../../lib/scorer/types.js';
import * as skillGraphDb from '../../lib/skill-graph/skill-graph-db.js';
import { seedSkillEmbeddings, type SeedResult } from './fixtures/seed-skill-embeddings.js';

// The lane's live weight is the smallest of the five lanes. This harness measures,
// on the full labeled corpus with real seeded embeddings, how removing the lane
// moves top-1 routing. The measured swing is a negligible net band — the evidence
// that keeps the weight frozen: too small and, if anything, net-negative to
// justify raising it; too small to justify the structural cost of dropping it. It
// runs against a seeded, in-process cosine lane so the confirmation never depends
// on the daemon's mutable skill-graph vector store.

// Deterministic reproducibility anchor: the embedding provider MUST resolve to
// exactly this profile, or the ablation is not comparing what it claims to.
// A drift here is a loud failure under the opt-in flag, never a silent reseed —
// a missing or swapped provider can never masquerade as "semantic is irrelevant".
const PINNED_PROVIDER_MODEL_ID = 'ollama__nomic-embed-text-v1.5__768';

// Opt-in switch. Absent (default CI): the heavy corpus ablation is skipped so a
// machine without a local embedding provider stays green. Set to a truthy value:
// the ablation runs and a provider/pin/embedding failure becomes a hard error.
const ABLATION_FLAG = 'SPECKIT_ADVISOR_SEMANTIC_ABLATION';

const RRF_FUSION_FLAG = 'SPECKIT_ADVISOR_RRF_FUSION';
const EXACT_SEMANTIC_RERANK_FLAG = 'SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK';

const TRUE_FLAG_VALUES = new Set(['1', 'true', 'yes', 'on', 'enabled']);

function flagEnabled(name: string): boolean {
  const value = process.env[name]?.trim().toLowerCase();
  return value ? TRUE_FLAG_VALUES.has(value) : false;
}

const hardMode = flagEnabled(ABLATION_FLAG);

// The frozen lane's net effect on top-1 correctness must stay within a negligible
// band of the full corpus. A swing beyond this — in either direction — is no
// longer "frozen-neutral" and forces a conscious re-decision (raise, drop, or
// re-baseline) rather than a silent pass. Sized well under the corpus's own
// labeling-noise floor and the eval ratchet's actionable granularity.
const FREEZE_NET_CORRECTNESS_TOLERANCE = 3;

// Stable repo-root marker: the skill's own package.json, so the suite resolves
// the workspace root regardless of how spec folders are renumbered.
const WORKSPACE_ROOT_MARKER = join(
  '.opencode',
  'skills',
  'system-skill-advisor',
  'mcp-server',
  'package.json',
);

const CORPUS_RELATIVE_PATH = join(
  '.opencode',
  'skills',
  'system-skill-advisor',
  'mcp-server',
  'scripts',
  'routing-accuracy',
  'labeled-prompts.jsonl',
);

interface CorpusRow {
  readonly id: string;
  readonly prompt: string;
  readonly expectedSkill: string;
}

interface FlipRecord {
  readonly id: string;
  readonly expected: string;
  readonly full: string;
  readonly disabled: string;
}

let workspaceRoot: string;
let corpus: CorpusRow[] = [];
let ablationProjection: AdvisorProjection | null = null;
let seedResult: SeedResult | null = null;
let seedSkipReason: string | null = null;
let promptVectorsByPrompt = new Map<string, Float32Array>();

function findWorkspaceRoot(start = process.cwd()): string {
  let current = resolve(start);
  while (current !== dirname(current)) {
    if (existsSync(join(current, WORKSPACE_ROOT_MARKER))) {
      return current;
    }
    current = dirname(current);
  }
  throw new Error(`Could not find workspace root containing ${WORKSPACE_ROOT_MARKER}`);
}

function loadCorpus(root: string): CorpusRow[] {
  const contents = readFileSync(join(root, CORPUS_RELATIVE_PATH), 'utf8').trim();
  return contents.split('\n').map((line) => {
    const row = JSON.parse(line) as { id: string; prompt: string; skill_top_1: string };
    return { id: row.id, prompt: row.prompt, expectedSkill: row.skill_top_1 };
  });
}

// The corpus encodes a correct abstain as the gold label "none"; the scorer
// encodes it as unknown / null top skill. Normalize both arms the same way so
// the two arms differ only in whether the semantic lane contributes.
function labelOf(result: AdvisorScoringResult): string {
  return result.unknown || result.topSkill === null ? 'none' : result.topSkill;
}

function providerModelId(profile: {
  provider: string;
  model: string;
  dim: number;
  dtype?: string | null;
  slug?: string;
}): string {
  return profile.slug ?? [profile.provider, profile.model, profile.dim, profile.dtype ?? null]
    .filter((part): part is string | number => part !== null && part !== undefined && part !== '')
    .join(':');
}

function fixtureSkill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  return {
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: overrides.id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
    ...overrides,
    id: overrides.id,
  };
}

describe('semantic-shadow paired ablation (opt-in, seeded)', () => {
  beforeAll(async () => {
    workspaceRoot = findWorkspaceRoot();
    // Default CI does not pay for provider embeddings; the ablation tests skip
    // themselves when the opt-in flag is absent.
    if (!hardMode) return;

    corpus = loadCorpus(workspaceRoot);
    const fullProjection = loadAdvisorProjection(workspaceRoot);
    const describedSkills = fullProjection.skills.filter(
      (projectionSkill) => projectionSkill.description.trim().length > 0,
    );
    // Score against a fixture projection of every described skill so the cosine
    // lane can pull toward ANY skill (a wrong flip is as observable as a right
    // one), and so sqlite embedding-staleness never silently disables the lane.
    ablationProjection = createFixtureProjection(describedSkills);

    const seededSkills = describedSkills.map((projectionSkill) => ({
      id: projectionSkill.id,
      description: projectionSkill.description,
    }));

    seedResult = await seedSkillEmbeddings(seededSkills);
    if (seedResult.skipped) {
      seedSkipReason = seedResult.skipReason ?? 'embedding provider unavailable';
      return;
    }
    if (seedResult.providerModelId !== PINNED_PROVIDER_MODEL_ID) {
      seedSkipReason = `provider model id '${seedResult.providerModelId}' != pinned '${PINNED_PROVIDER_MODEL_ID}'`;
      return;
    }

    // Feed the seeded skill vectors through the same accessor the lane uses, so
    // no live daemon database is opened for skill vectors during scoring.
    vi.spyOn(skillGraphDb, 'loadSkillEmbeddings').mockImplementation((skillIds?: readonly string[]) => {
      const ids = skillIds && skillIds.length > 0 ? skillIds : [...seedResult!.vectorsBySkillId.keys()];
      return ids.flatMap((skillId) => {
        const embedding = seedResult!.vectorsBySkillId.get(skillId);
        return embedding
          ? [{
              skillId,
              embedding,
              modelId: seedResult!.providerModelId,
              contentHash: 'seeded-ablation',
            }]
          : [];
      });
    });

    try {
      const provider = await createEmbeddingsProvider();
      const queryProviderModelId = providerModelId(provider.getProfile());
      if (queryProviderModelId !== seedResult.providerModelId) {
        seedSkipReason = `provider changed between skill and prompt seeding (${seedResult.providerModelId} -> ${queryProviderModelId})`;
        return;
      }
      // Sequential to keep the local provider from being flooded with 193
      // concurrent requests; the embed call is HTTP, not a native module.
      for (const row of corpus) {
        const vector = await provider.embedQuery(row.prompt);
        if (!vector) {
          throw new Error(`provider returned no query vector for ${row.id}`);
        }
        promptVectorsByPrompt.set(row.prompt, vector instanceof Float32Array ? vector : Float32Array.from(vector));
      }
    } catch (error: unknown) {
      seedSkipReason = error instanceof Error ? error.message : String(error);
    }
  }, 300_000);

  afterAll(() => {
    clearSemanticShadowPromptEmbedding();
    vi.restoreAllMocks();
  });

  it('activates the seeded semantic lane (fail-on-skip under the opt-in flag)', (context) => {
    if (!hardMode) {
      context.skip(true, `set ${ABLATION_FLAG}=1 to run the seeded semantic ablation`);
      return;
    }
    if (seedSkipReason !== null) {
      throw new Error(`[semantic-ablation] provider/pin unavailable under the opt-in flag: ${seedSkipReason}`);
    }
    expect(seedResult).not.toBeNull();
    expect(seedResult!.providerModelId).toBe(PINNED_PROVIDER_MODEL_ID);
    expect(corpus.length).toBe(193);
    expect(promptVectorsByPrompt.size).toBe(corpus.length);

    // Isolate the semantic lane (all other weights zeroed) and confirm it emits
    // a real, non-zero cosine score. An all-zero result means the seeded
    // injection is not flowing — the exact failure this guard exists to catch.
    const probe = corpus[0];
    setSemanticShadowPromptEmbedding(probe.prompt, promptVectorsByPrompt.get(probe.prompt));
    const probeResult = scoreAdvisorPrompt(probe.prompt, {
      workspaceRoot,
      projection: ablationProjection!,
      includeAllCandidates: true,
      laneWeightsOverride: {
        explicit_author: 0,
        lexical: 0,
        graph_causal: 0,
        derived_generated: 0,
        semantic_shadow: 1,
      },
    });
    clearSemanticShadowPromptEmbedding();

    const hasNonZeroSemantic = probeResult.recommendations.some((recommendation) => (
      (recommendation.laneContributions.find((entry) => entry.lane === 'semantic_shadow')?.rawScore ?? 0) > 0
    ));
    expect(
      hasNonZeroSemantic,
      'seeded cosine lane produced no raw semantic score; loadSkillEmbeddings injection is not flowing through',
    ).toBe(true);
  });

  it('keeps the semantic lane within its frozen-weight neutral band over the full corpus', (context) => {
    if (!hardMode) {
      context.skip(true, `set ${ABLATION_FLAG}=1 to run the seeded semantic ablation`);
      return;
    }
    if (seedSkipReason !== null) {
      throw new Error(`[semantic-ablation] provider/pin unavailable under the opt-in flag: ${seedSkipReason}`);
    }

    // The two arms may differ ONLY in the semantic lane. The exact-semantic
    // rerank is a separate consumption site not gated by disabledLanes, so it
    // must be OFF (its default) or the disabled arm would still be reranked.
    const rrfOn = flagEnabled(RRF_FUSION_FLAG);
    const rerankOn = flagEnabled(EXACT_SEMANTIC_RERANK_FLAG);
    expect(
      rerankOn,
      'exact-semantic rerank must be OFF so the two arms differ only in the semantic lane',
    ).toBe(false);

    let fullCorrect = 0;
    let disabledCorrect = 0;
    let missing = 0;
    const flips: FlipRecord[] = [];

    for (const row of corpus) {
      const vector = promptVectorsByPrompt.get(row.prompt);
      if (!vector) {
        missing += 1;
        continue;
      }
      setSemanticShadowPromptEmbedding(row.prompt, vector);
      let fullLabel: string;
      let disabledLabel: string;
      try {
        const full = scoreAdvisorPrompt(row.prompt, {
          workspaceRoot,
          projection: ablationProjection!,
          disabledLanes: [],
        });
        const disabled = scoreAdvisorPrompt(row.prompt, {
          workspaceRoot,
          projection: ablationProjection!,
          disabledLanes: ['semantic_shadow'],
        });
        fullLabel = labelOf(full);
        disabledLabel = labelOf(disabled);
      } finally {
        clearSemanticShadowPromptEmbedding();
      }
      if (fullLabel === row.expectedSkill) fullCorrect += 1;
      if (disabledLabel === row.expectedSkill) disabledCorrect += 1;
      if (fullLabel !== disabledLabel) {
        flips.push({ id: row.id, expected: row.expectedSkill, full: fullLabel, disabled: disabledLabel });
      }
    }

    const delta = disabledCorrect - fullCorrect;
    const summary = {
      rows: corpus.length,
      fullTop1Correct: fullCorrect,
      disabledTop1Correct: disabledCorrect,
      delta,
      flips: flips.length,
      providerModelId: seedResult!.providerModelId,
      cacheHits: seedResult!.cacheHits,
      cacheMisses: seedResult!.cacheMisses,
      rrfFusion: rrfOn,
      exactSemanticRerank: rerankOn,
    };
    // Emitted before the assertions so the measured numbers surface even if the
    // freeze thesis were ever violated.
    console.log(`[semantic-ablation] summary ${JSON.stringify(summary)}`);
    console.log(`[semantic-ablation] flips ${JSON.stringify(flips)}`);

    expect(missing).toBe(0);
    // Not asserted to zero: with real embeddings the lane is a marginal
    // net-negative, not a no-op. Freeze holds while its net correctness effect
    // stays inside the band; the exact counts and the flip list are recorded in
    // the decision record. A larger swing would fail here and force a re-decision.
    expect(Math.abs(delta)).toBeLessThanOrEqual(FREEZE_NET_CORRECTNESS_TOLERANCE);
    expect(fullCorrect - disabledCorrect).toBeLessThanOrEqual(FREEZE_NET_CORRECTNESS_TOLERANCE);
  });
});

describe('semantic-shadow runtime degradation detector', () => {
  afterAll(() => {
    clearSemanticShadowPromptEmbedding();
  });

  // A silent degradation (stale projection embeddings, absent database, embed
  // failure) must be readable as telemetry, not swallowed into a console.warn.
  // This exercises the stale path and asserts the health struct names it.
  it('surfaces a silent lane degradation through getSemanticShadowRuntimeHealth', () => {
    const staleProjection: AdvisorProjection = {
      skills: [fixtureSkill({ id: 'alpha', description: 'stale projection probe' })],
      edges: [],
      generatedAt: new Date().toISOString(),
      source: 'sqlite',
      embeddingStaleness: {
        stale: true,
        reason: 'degradation detector probe',
        active: null,
        stored: null,
        vectorCount: 0,
      },
    };

    setSemanticShadowPromptEmbedding('probe', new Float32Array([1, 0, 0]));
    const matches = scoreSemanticShadowLane('probe', staleProjection);
    clearSemanticShadowPromptEmbedding();

    const health = getSemanticShadowRuntimeHealth();
    expect(matches).toEqual([]);
    expect(health.disabledReason).toBe('projection_embedding_stale');
    expect(typeof health.checkedAt).toBe('string');
    expect(Number.isNaN(Date.parse(health.checkedAt))).toBe(false);
  });

  it('exposes the runtime-health telemetry contract', () => {
    const health = getSemanticShadowRuntimeHealth();
    expect(health).toHaveProperty('checkedAt');
    expect(health).toHaveProperty('activeEmbedder');
    expect(health).toHaveProperty('dimMismatch');
    expect(health).toHaveProperty('disabledReason');
    expect(health).toHaveProperty('lastPromptEmbeddingAt');
    expect(typeof health.dimMismatch).toBe('boolean');
  });
});
