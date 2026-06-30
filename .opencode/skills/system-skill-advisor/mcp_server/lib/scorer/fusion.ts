// ───────────────────────────────────────────────────────────────
// MODULE: Advisor 5-Lane Fusion
// ───────────────────────────────────────────────────────────────

import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion.js';

import { applyAmbiguity, isAmbiguousTopTwo } from './ambiguity.js';
import { attributionReason, dominantLane, isDerivedDominant } from './attribution.js';
import {
  ADVISOR_HOOK_FRESHNESS_VALUES,
  ADVISOR_RUNTIME_VALUES,
  isSpeckitMetricsEnabled,
  speckitMetrics,
} from '../metrics.js';
import { normalize } from '../affordance-normalizer.js';
import { scoreDerivedLane } from './lanes/derived.js';
import { scoreExplicitLane } from './lanes/explicit.js';
import { scoreGraphCausalLaneSplit } from './lanes/graph-causal.js';
import { scoreLexicalLane } from './lanes/lexical.js';
import { scoreSemanticShadowExactSubset, scoreSemanticShadowLane } from './lanes/semantic-shadow.js';
import { loadAdvisorProjection } from './projection.js';
import { SCORING_CALIBRATION } from './scoring-constants.js';
import { isReadOnlyExplainer, matchesPhraseBoundary } from './text.js';
import {
  DEFAULT_SCORER_WEIGHTS,
  SCORER_LANES,
  liveWeightTotal,
} from './weights-config.js';
import { isLiveScorerLane } from './lane-registry.js';
import { SKILL_ADVISOR_COMPAT_CONTRACT, resolvedConfidenceThreshold, resolvedUncertaintyThreshold } from '../compat/contract.js';
import type {
  AdvisorProjection,
  AdvisorScoredRecommendation,
  AdvisorScoringOptions,
  AdvisorScoringResult,
  LaneContribution,
  LaneMatch,
  LaneRuntimeHealth,
  LaneScores,
  ScorerLane,
  SkillProjection,
} from './types.js';
import type { NormalizedAffordance } from '../affordance-normalizer.js';
import type { RankedList, RrfItem } from '@spec-kit/shared/algorithms/rrf-fusion.js';

const DEFAULT_CONFIDENCE_THRESHOLD = resolvedConfidenceThreshold();
const DEFAULT_UNCERTAINTY_THRESHOLD = resolvedUncertaintyThreshold();
export const ADVISOR_RRF_FUSION_FLAG = 'SPECKIT_ADVISOR_RRF_FUSION';
export const ADVISOR_SELF_RECOMMENDATION_GUARD_FLAG = 'SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD';
export const ADVISOR_QUERY_CLASS_ROUTING_FLAG = 'SPECKIT_ADVISOR_QUERY_CLASS_ROUTING';
export const ADVISOR_EXACT_SEMANTIC_RERANK_FLAG = 'SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK';
export const ADVISOR_RRF_K = 8;
export const ADVISOR_EXACT_SEMANTIC_RERANK_TOP_K = 10;
const ADVISOR_EXACT_SEMANTIC_RERANK_WINDOW = 0.05;
const TASK_INTENT = /\b(add|append|build|change|configure|create|edit|fix|generate|implement|modify|move|patch|refactor|rename|replace|run|start|sweep|update|write)\b/;
const DEEP_RESEARCH_CYCLE = /\b(automated research cycle|looped investigation|continue iteration|resume iteration|overnight run|overnight research run|packet-local iteration|delta record|canonical jsonl|same lineage)\b/;
const FILE_SAVE_OPERATION = /\bsave\b.{0,48}\b(file|files|document|documents|buffer|tab|workspace)\b|\b(file|files|document|documents|buffer|tab|workspace)\b.{0,48}\bsave\b/;
const MEMORY_SAVE_CONTEXT_ANCHOR = /\b(memory|context|conversation|session|handover|checkpoint|resume|preserve|remember|capture|store)\b|\/memory:save|memory:save/;
// Class C breadth/multi-concern abstention gates. A broad greenfield build or a
// multi-concern optimization is under-specified for single-skill routing.
const BREADTH_BUILD_VERB = /\b(build|create|implement|generate|scaffold)\b/;
const BREADTH_NOUN = /\b(full[- ]?stack|service|platform|application|microservice|saas|backend|whole (app|system))\b/;
// Narrow anchors that make a broad-build prompt specific enough to route.
const BREADTH_NARROW_ANCHOR = /\.[a-z]{2,4}\b|\b(test|tests|error|bug|failure|failing|handler|component|function|route|endpoint|class|method|benchmark|review|audit|migration|schema)\b/;
const MULTI_CONCERN_VERB = /\b(optimize|improve|enhance|harden|speed up)\b/;
const CONCERN_PERF = /\b(speed|latency|execution|throughput|performance|startup|memory|cpu)\b/;
const CONCERN_QUALITY = /\b(quality|accuracy|recommendation|recommendations|correctness|reliability|coverage)\b/;
const TRUE_FLAG_VALUES = new Set(['1', 'true', 'yes', 'on', 'enabled']);
const NO_RRF_RANK = Number.MAX_SAFE_INTEGER;
const ADVISOR_SELF_RECOMMENDATION_SKILL_IDS = new Set(['system-skill-advisor', 'skill-advisor']);

type MutableLaneScores = {
  -readonly [K in keyof LaneScores]: LaneMatch[];
};

interface LaneScoreBundle {
  readonly laneScores: LaneScores;
  readonly graphConflictMatches: readonly LaneMatch[];
}

interface AdvisorRrfFusion {
  readonly scoreBySkill: ReadonlyMap<string, number>;
  readonly rankBySkill: ReadonlyMap<string, number>;
}

type AdvisorRuntimeLabel = (typeof ADVISOR_RUNTIME_VALUES)[number];
type AdvisorFreshnessLabel = (typeof ADVISOR_HOOK_FRESHNESS_VALUES)[number];
export type AdvisorQueryClass = 'implementation' | 'review' | 'documentation' | 'memory' | 'tooling' | 'unknown';

interface ExactSemanticRerankEntry {
  readonly rawScore: number;
}

type ExactSemanticRerankIndex = ReadonlyMap<string, ExactSemanticRerankEntry>;

function emptyLaneScores(): MutableLaneScores {
  return Object.fromEntries(SCORER_LANES.map((lane) => [lane, []])) as unknown as MutableLaneScores;
}

export function isAdvisorRrfFusionEnabled(): boolean {
  const value = process.env[ADVISOR_RRF_FUSION_FLAG]?.trim().toLowerCase();
  return value ? TRUE_FLAG_VALUES.has(value) : false;
}

export function isAdvisorSelfRecommendationGuardEnabled(): boolean {
  const value = process.env[ADVISOR_SELF_RECOMMENDATION_GUARD_FLAG]?.trim().toLowerCase();
  return value ? TRUE_FLAG_VALUES.has(value) : false;
}

export function isAdvisorQueryClassRoutingEnabled(): boolean {
  const value = process.env[ADVISOR_QUERY_CLASS_ROUTING_FLAG]?.trim().toLowerCase();
  return value ? TRUE_FLAG_VALUES.has(value) : false;
}

export function isAdvisorExactSemanticRerankEnabled(): boolean {
  const value = process.env[ADVISOR_EXACT_SEMANTIC_RERANK_FLAG]?.trim().toLowerCase();
  return value ? TRUE_FLAG_VALUES.has(value) : false;
}

export function classifyAdvisorQuery(prompt: string): AdvisorQueryClass {
  const promptLower = prompt.toLowerCase();
  if (/\b(save context|save memory|handover|resume|checkpoint|spec folder|implementation summary|packet docs?)\b/.test(promptLower)) {
    return 'memory';
  }
  if (/\b(review|audit|findings|regression|pull request|pr readiness|release readiness)\b/.test(promptLower)) {
    return 'review';
  }
  if (/\b(readme|markdown|documentation|docs|manual testing playbook|feature catalog|taxonomy)\b/.test(promptLower)) {
    return 'documentation';
  }
  if (/\b(call_tool_chain|code mode|tool ?chain|chrome devtools|browser console|figma|github|clickup)\b/.test(promptLower)) {
    return 'tooling';
  }
  if (TASK_INTENT.test(promptLower) || /\b(typescript|javascript|python|vitest|mcp|handler|schema|fixture)\b/.test(promptLower)) {
    return 'implementation';
  }
  return 'unknown';
}

export function queryClassLaneMultipliers(queryClass: AdvisorQueryClass): Readonly<Partial<Record<ScorerLane, number>>> {
  switch (queryClass) {
    case 'implementation':
      return { explicit_author: 1.04, lexical: 1.00, graph_causal: 0.98, derived_generated: 0.98, semantic_shadow: 1.00 };
    case 'review':
      return { explicit_author: 1.03, lexical: 1.02, graph_causal: 0.96, derived_generated: 0.98, semantic_shadow: 1.00 };
    case 'documentation':
      return { explicit_author: 1.03, lexical: 0.98, graph_causal: 0.95, derived_generated: 1.04, semantic_shadow: 1.00 };
    case 'memory':
      return { explicit_author: 1.04, lexical: 0.98, graph_causal: 1.02, derived_generated: 1.00, semantic_shadow: 0.96 };
    case 'tooling':
      return { explicit_author: 1.04, lexical: 1.00, graph_causal: 0.98, derived_generated: 0.96, semantic_shadow: 1.00 };
    case 'unknown':
      return {};
  }
}

export function applyQueryClassLaneMultipliers(
  weights: Readonly<Record<ScorerLane, number>>,
  queryClass: AdvisorQueryClass,
): Readonly<Record<ScorerLane, number>> {
  const multipliers = queryClassLaneMultipliers(queryClass);
  if (Object.keys(multipliers).length === 0) return weights;
  const next = { ...weights };
  for (const lane of SCORER_LANES) {
    const multiplier = multipliers[lane];
    if (typeof multiplier === 'number' && Number.isFinite(multiplier)) {
      next[lane] = Number((next[lane] * multiplier).toFixed(6));
    }
  }
  const strongestOther = Math.max(...SCORER_LANES
    .filter((lane) => lane !== 'explicit_author')
    .map((lane) => next[lane]));
  if (next.explicit_author < strongestOther) {
    next.explicit_author = Number(strongestOther.toFixed(6));
  }
  return next;
}

function effectiveScorerWeights(
  override: AdvisorScoringOptions['laneWeightsOverride'] | undefined,
  queryClass: AdvisorQueryClass = 'unknown',
): Readonly<Record<ScorerLane, number>> {
  const base = !override ? DEFAULT_SCORER_WEIGHTS : (() => {
    const weights: Record<ScorerLane, number> = { ...DEFAULT_SCORER_WEIGHTS };
    const runtimeOverride = override as Partial<Record<string, number>>;
    for (const lane of SCORER_LANES) {
      const value = runtimeOverride[lane];
      if (typeof value === 'number' && Number.isFinite(value)) {
        weights[lane] = value;
      }
    }
    return weights;
  })();
  if (queryClass === 'unknown') return base;
  return applyQueryClassLaneMultipliers(base, queryClass);
}

function normalizeRuntimeLabel(value: string | undefined): AdvisorRuntimeLabel | null {
  if (value === undefined) {
    return null;
  }
  return ADVISOR_RUNTIME_VALUES.includes(value as AdvisorRuntimeLabel) ? value as AdvisorRuntimeLabel : null;
}

function normalizeFreshnessLabel(value: string | undefined): AdvisorFreshnessLabel | null {
  if (value === undefined) {
    return 'unavailable';
  }
  return ADVISOR_HOOK_FRESHNESS_VALUES.includes(value as AdvisorFreshnessLabel) ? value as AdvisorFreshnessLabel : null;
}

interface LaneMatchIndexEntry {
  rawScore: number;
  evidence: string[];
  producerSkillIds: string[];
}

type LaneMatchIndex = Map<string, LaneMatchIndexEntry>;

function buildLaneRuntimeHealth(
  laneScores: LaneScores,
  disabled: ReadonlySet<ScorerLane>,
  runtimeLaneHealth: AdvisorScoringOptions['runtimeLaneHealth'] | undefined,
): readonly LaneRuntimeHealth[] {
  return SCORER_LANES.map((lane): LaneRuntimeHealth => {
    const matchCount = laneScores[lane].length;
    const signal = runtimeLaneHealth?.[lane];
    if (!disabled.has(lane) && signal?.status === 'runtime_degraded' && matchCount === 0) {
      return {
        lane,
        status: 'runtime_degraded',
        matchCount,
        ...(signal.reason ? { reason: signal.reason } : {}),
      };
    }
    return {
      lane,
      status: matchCount > 0 ? 'healthy' : 'matched_nothing',
      matchCount,
      ...(signal?.reason && signal.status === 'healthy' ? { reason: signal.reason } : {}),
    };
  });
}

function projectionRuntimeLaneHealth(
  projection: AdvisorProjection,
  runtimeLaneHealth: AdvisorScoringOptions['runtimeLaneHealth'] | undefined,
): AdvisorScoringOptions['runtimeLaneHealth'] | undefined {
  if (!projection.embeddingStaleness?.stale) {
    return runtimeLaneHealth;
  }
  return {
    ...runtimeLaneHealth,
    semantic_shadow: runtimeLaneHealth?.semantic_shadow ?? {
      status: 'runtime_degraded',
      reason: projection.embeddingStaleness.reason ?? 'projection_embedding_stale',
    },
  };
}

function degradedLaneReason(degradedLanes: readonly ScorerLane[]): string | null {
  if (degradedLanes.length === 0) return null;
  return `Runtime-degraded scorer lanes omitted from confidence normalization: ${degradedLanes.join(', ')}.`;
}

function buildLaneMatchIndex(matches: readonly LaneMatch[]): LaneMatchIndex {
  const index: LaneMatchIndex = new Map();
  for (const match of matches) {
    const existing = index.get(match.skillId) ?? { rawScore: 0, evidence: [], producerSkillIds: [] };
    existing.rawScore = Math.max(existing.rawScore, match.score);
    if (existing.evidence.length < 6) {
      existing.evidence.push(...match.evidence.slice(0, 6 - existing.evidence.length));
    }
    for (const producerSkillId of match.producerSkillIds ?? []) {
      if (!existing.producerSkillIds.includes(producerSkillId)) {
        existing.producerSkillIds.push(producerSkillId);
      }
    }
    index.set(match.skillId, existing);
  }
  return index;
}

function buildConflictMatchIndex(matches: readonly LaneMatch[]): LaneMatchIndex {
  const index: LaneMatchIndex = new Map();
  for (const match of matches) {
    const existing = index.get(match.skillId) ?? { rawScore: 0, evidence: [], producerSkillIds: [] };
    existing.rawScore = Math.min(existing.rawScore, match.score);
    if (existing.evidence.length < 6) {
      existing.evidence.push(...match.evidence.slice(0, 6 - existing.evidence.length));
    }
    index.set(match.skillId, existing);
  }
  return index;
}

function rankedRrfItems(matches: readonly LaneMatch[]): RrfItem[] {
  return [...matches]
    .filter((match) => match.score > 0)
    .sort((left, right) => right.score - left.score || left.skillId.localeCompare(right.skillId))
    .map((match) => ({ id: match.skillId }));
}

export function fuseAdvisorLaneRanks(
  laneScores: LaneScores,
  weights: Readonly<Record<ScorerLane, number>>,
  disabled: ReadonlySet<ScorerLane> = new Set(),
  runtimeDegraded: ReadonlySet<ScorerLane> = new Set(),
): AdvisorRrfFusion {
  const lists: RankedList[] = SCORER_LANES.map((lane) => ({
    source: lane,
    results: rankedRrfItems(laneScores[lane]),
    weight: disabled.has(lane) || runtimeDegraded.has(lane) || !isLiveScorerLane(lane)
      ? 0
      : weights[lane],
  }));
  const fused = fuseResultsMulti(lists, {
    k: ADVISOR_RRF_K,
    convergenceBonus: 0,
    calibratedOverlapBeta: 0,
    bonusOverChannels: 'configured',
  });
  const scoreBySkill = new Map<string, number>();
  const rankBySkill = new Map<string, number>();
  fused.forEach((result, index) => {
    const skillId = String(result.id);
    scoreBySkill.set(skillId, result.rrfScore);
    rankBySkill.set(skillId, index);
  });
  return { scoreBySkill, rankBySkill };
}

function graphConflictAdjustment(
  conflictIndex: LaneMatchIndex,
  recommendation: AdvisorScoredRecommendation,
): number {
  return conflictIndex.get(recommendation.skill)?.rawScore ?? 0;
}

function buildExactSemanticRerankIndex(
  prompt: string,
  projection: AdvisorProjection,
  recommendations: readonly AdvisorScoredRecommendation[],
  fusion: AdvisorRrfFusion | null,
): ExactSemanticRerankIndex {
  if (!fusion) return new Map();
  const topSkillIds = [...recommendations]
    .filter((recommendation) => fusion.rankBySkill.has(recommendation.skill))
    .sort((left, right) => rrfRankFor(fusion, left) - rrfRankFor(fusion, right))
    .slice(0, ADVISOR_EXACT_SEMANTIC_RERANK_TOP_K)
    .map((recommendation) => recommendation.skill);
  const matches = scoreSemanticShadowExactSubset(prompt, projection, topSkillIds);
  return new Map(matches.map((match) => [match.skillId, {
    rawScore: match.score,
  }]));
}

function exactSemanticRerankScore(
  rerankIndex: ExactSemanticRerankIndex,
  recommendation: AdvisorScoredRecommendation,
): number | null {
  return rerankIndex.get(recommendation.skill)?.rawScore ?? null;
}

function rrfRankFor(
  fusion: AdvisorRrfFusion | null,
  recommendation: AdvisorScoredRecommendation,
): number {
  return fusion?.rankBySkill.get(recommendation.skill) ?? NO_RRF_RANK;
}

function promptMentionsSkill(promptLower: string, skill: SkillProjection): boolean {
  return [skill.id, skill.name, skill.id.replace(/-/g, ' ')].some((phrase) => matchesPhraseBoundary(promptLower, phrase.toLowerCase()));
}

function isDefaultRoutable(promptLower: string, skill: SkillProjection): boolean {
  if (skill.lifecycleStatus === 'archived' || skill.lifecycleStatus === 'future') return false;
  if (skill.lifecycleStatus === 'deprecated') return promptMentionsSkill(promptLower, skill);
  return true;
}

function isAdvisorSelfRecommendationSkill(skillId: string): boolean {
  return ADVISOR_SELF_RECOMMENDATION_SKILL_IDS.has(skillId);
}

function hasAdvisorSelfAuthoredSignal(skillId: string, explicitMatch: LaneMatchIndexEntry | undefined): boolean {
  return isAdvisorSelfRecommendationSkill(skillId)
    && explicitMatch?.producerSkillIds.some((producerSkillId) => producerSkillId === skillId) === true;
}

function shouldApplyAdvisorSelfRecommendationGuard(args: {
  readonly skillId: string;
  readonly guardEnabled: boolean;
  readonly hasSelfAuthoredSignal?: boolean;
}): boolean {
  return args.guardEnabled
    && isAdvisorSelfRecommendationSkill(args.skillId)
    && (args.hasSelfAuthoredSignal ?? true);
}

function confidenceFor(args: {
  liveNormalized: number;
  directScore: number;
  readOnlyExplainer: boolean;
  hasExplicitWorkflowSignal: boolean;
  hasTaskIntent: boolean;
  readOnlyRouteAllowed: boolean;
  derivedDominant: boolean;
  skillId: string;
  selfRecommendationGuardEnabled: boolean;
  hasAdvisorSelfAuthoredSignal: boolean;
}): number {
  const C = SCORING_CALIBRATION.confidence;
  if (!args.selfRecommendationGuardEnabled && args.readOnlyExplainer && args.skillId === 'skill-advisor') return C.readOnlyExplainerFloor;
  if (args.readOnlyExplainer && shouldApplyAdvisorSelfRecommendationGuard({
    skillId: args.skillId,
    guardEnabled: args.selfRecommendationGuardEnabled,
    hasSelfAuthoredSignal: args.hasAdvisorSelfAuthoredSignal,
  })) {
    return C.readOnlyExplainerFloor;
  }
  const base = C.baseConstant
    + Math.min(1, args.liveNormalized * C.liveNormalizedRampGain) * C.liveNormalizedRampCoefficient;
  if (args.readOnlyExplainer && !args.readOnlyRouteAllowed) return C.readOnlyExplainerFloor;
  if (args.readOnlyRouteAllowed) {
    return Number(Math.max(base, C.readOnlyRouteAllowedFloor).toFixed(4));
  }
  if (args.derivedDominant && args.directScore < C.derivedDominantDirectScoreCeiling) {
    return C.derivedDominantConfidence;
  }
  if (args.hasTaskIntent
    && (args.directScore >= C.taskIntentDirectScoreFloor
      || args.liveNormalized >= C.taskIntentLiveNormalizedFloor)) {
    // Token-stuffing dispersion guard. Without this, a prompt
    // with task-intent + many weak signals (saturating liveNormalized) but
    // no strong direct anchor would force confidence to taskIntentFloor for
    // many unrelated skills. The guard fires when liveNormalized is near-
    // saturated AND directScore is below the directScoreLiftThreshold —
    // the precise signature of a token-stuffed prompt. Legitimate task-intent
    // prompts have at least one strong direct hit and pass via directScore;
    // they don't hit this branch. When the guard fires we fall through to
    // the standard `base + directBonus` math below.
    const dispersionGuardTripped = args.liveNormalized >= 0.95
      && args.directScore < C.directScoreLiftThreshold;
    if (!dispersionGuardTripped) {
      return Number(Math.max(base, C.taskIntentFloor).toFixed(4));
    }
  }
  if (args.directScore >= C.directScoreLiftThreshold) {
    return Number(Math.max(base, C.directScoreFloor).toFixed(4));
  }
  const directBonus = args.directScore >= C.directScoreBonusThreshold ? C.directScoreBonus : 0;
  return Number(Math.max(0, Math.min(C.hardCeiling, base + directBonus)).toFixed(4));
}

function uncertaintyFor(contributions: readonly LaneContribution[], confidence: number, ambiguousPressure: number): number {
  const U = SCORING_CALIBRATION.uncertainty;
  const evidenceCount = contributions.reduce((total, contribution) => total + contribution.evidence.length, 0);
  const direct = contributions
    .filter((contribution) => contribution.lane === 'explicit_author' || contribution.lane === 'lexical')
    .reduce((max, contribution) => Math.max(max, contribution.rawScore), 0);
  let uncertainty = U.noEvidenceDefault;
  if (evidenceCount >= U.highEvidenceCount) uncertainty = U.lowFloor;
  else if (evidenceCount >= U.mediumEvidenceCount) uncertainty = U.mediumFloor;
  else if (evidenceCount >= U.someEvidenceCount) uncertainty = U.elevatedFloor;
  if (direct >= U.directEvidenceDiscountThreshold) uncertainty -= U.directEvidenceDiscount;
  if (confidence < U.lowConfidencePenaltyThreshold) uncertainty += U.lowConfidencePenalty;
  uncertainty += ambiguousPressure;
  return Number(Math.max(U.hardFloor, Math.min(U.hardCeiling, uncertainty)).toFixed(2));
}

function buildLaneScores(
  prompt: string,
  projection: AdvisorProjection,
  disabled: Set<ScorerLane>,
  affordances: readonly NormalizedAffordance[],
  useRrfFusion: boolean,
  includeProducerIdentity: boolean,
): LaneScoreBundle {
  const scores = emptyLaneScores();
  if (!disabled.has('explicit_author')) {
    scores.explicit_author = scoreExplicitLane(prompt, projection, { includeProducerIdentity });
  }
  if (!disabled.has('lexical')) scores.lexical = scoreLexicalLane(prompt, projection);
  if (!disabled.has('derived_generated')) scores.derived_generated = scoreDerivedLane(prompt, projection, new Date(), affordances);
  if (!disabled.has('semantic_shadow')) scores.semantic_shadow = scoreSemanticShadowLane(prompt, projection);
  let graphConflictMatches: readonly LaneMatch[] = [];
  if (!disabled.has('graph_causal')) {
    const graphSplit = scoreGraphCausalLaneSplit([
      ...scores.explicit_author,
      ...scores.lexical,
      ...scores.derived_generated,
    ], projection, {}, affordances);
    scores.graph_causal = useRrfFusion ? graphSplit.positiveMatches : graphSplit.combinedMatches;
    graphConflictMatches = graphSplit.conflictMatches;
  }
  return { laneScores: scores, graphConflictMatches };
}

function hasExplicitWorkflowSignal(contributions: readonly LaneContribution[], skillId: string): boolean {
  const explicit = contributions.find((contribution) => contribution.lane === 'explicit_author');
  if (!explicit || explicit.rawScore < 0.55) return false;
  return explicit.evidence.some((entry) => (
    entry.startsWith('phrase:')
    || entry.startsWith('explicit:')
    || entry.startsWith('author:')
    || entry.includes(skillId)
    || entry.includes('loop')
    || entry.includes('write-')
  ));
}

function readOnlyRouteAllowed(promptLower: string, skillId: string): boolean {
  if (/\b(no edits?|without making changes|do not (change|edit|modify|touch)|read-only only|no edits yet|only; do not|just show|just list)\b/.test(promptLower)) {
    return false;
  }
  if (skillId === 'sk-code-review' && /\b(compare|audit|review)\b/.test(promptLower)
    && /\b(classifier|vocabulary|prose|implementation|agents\.md|drift|mismatch)\b/.test(promptLower)) {
    return true;
  }
  if (skillId === 'system-spec-kit' && /\b(memory_save|resume_write|routing taxonomy|corpus|source-type|routing bucket)\b/.test(promptLower)) {
    return true;
  }
  if (skillId === 'system-spec-kit' && /\b(packet|spec folder|save memory|phase|continuation prompts|resume handling)\b/.test(promptLower)) {
    return true;
  }
  if (skillId === 'deep-loop-workflows' && /\b(ai council|planning council|council deliberation|council artifacts|multi-seat planning)\b/.test(promptLower)) {
    return true;
  }
  if (skillId === 'mcp-chrome-devtools' && /\b(\.opencode\/agents|state log|predictions schema|current labels|gate-3-classifier\.ts)\b/.test(promptLower)) {
    return true;
  }
  // Browser/devtools inspection is a genuine chrome-devtools task even though
  // its verb ("inspect") reads as a read-only explainer. Lift it off the
  // explainer floor when the prompt carries devtools-specific vocabulary.
  if (skillId === 'mcp-chrome-devtools'
    && /\b(network waterfall|network tab|network request|dev ?tools|browser console|page inspector|dom inspector|performance trace|inspect (the )?(network|dom|page|element|browser))\b/.test(promptLower)) {
    return true;
  }
  if (skillId === 'sk-code' && /\bgate-3-classifier\.ts\b/.test(promptLower)) {
    return true;
  }
  return false;
}

function isPlainFileSavePrompt(promptLower: string): boolean {
  return FILE_SAVE_OPERATION.test(promptLower) && !MEMORY_SAVE_CONTEXT_ANCHOR.test(promptLower.replace(/\bfile(s)?\b/g, ''));
}

function primaryIntentBonus(
  promptLower: string,
  recommendation: AdvisorScoredRecommendation,
  selfRecommendationGuardEnabled: boolean,
): number {
  const R = SCORING_CALIBRATION.routing;
  if (/\bsemantic (code )?search\b/.test(promptLower)) {
    if (recommendation.skill === 'system-code-graph') return R.semanticSearchCodeGraphBonus;
  }
  if (/\bdeep[- ]review\b/.test(promptLower)) {
    if (recommendation.skill === 'sk-code-review') return R.deepReviewSkCodeReviewPenalty;
  }
  if (/\bdeep[- ]research\b/.test(promptLower)) {
    if (recommendation.skill === 'system-spec-kit' || recommendation.skill === 'sk-code-review') return R.deepResearchOtherSkillsPenalty;
  }
  if (DEEP_RESEARCH_CYCLE.test(promptLower)) {
    if (recommendation.skill === 'system-spec-kit' || recommendation.skill === 'sk-code-review' || recommendation.skill === 'sk-code') return R.deepResearchCycleOtherSkillsPenalty;
  }
  if (/\b(compare|audit|review)\b/.test(promptLower) && /\b(classifier|vocabulary|prose|implementation|agents\.md|drift|mismatch)\b/.test(promptLower)) {
    if (recommendation.skill === 'sk-code-review') return R.compareAuditCodeReviewBonus;
    if (recommendation.skill === 'sk-code') return R.compareAuditCodeOpenCodePenalty;
  }
  if (/\b(corpus ids?|first-100 predictions|continuation prompts|routing study config|confusion matrix|source-mix note|prompt template|packet-local)\b/.test(promptLower)) {
    if (recommendation.skill === 'system-spec-kit') return R.corpusStudySpecKitBonus;
    if (recommendation.skill === 'sk-prompt' || recommendation.skill === 'mcp-chrome-devtools' || recommendation.skill === 'sk-doc') return R.corpusStudyOtherSkillsPenalty;
  }
  if (promptLower.includes('/speckit:resume')) {
    if (recommendation.skill === 'system-spec-kit') return R.speckitResumeSpecKitBonus;
    if (recommendation.skill === 'command-spec-kit') return R.speckitResumeCommandPenalty;
  }
  if (promptLower.includes('/speckit:plan')) {
    if (recommendation.skill === 'command-spec-kit') return R.speckitPlanCommandBonus;
    if (recommendation.skill === 'sk-doc') return R.speckitPlanSkDocPenalty;
  }
  // External-tool-chain ("call_tool_chain") vocabulary belongs to mcp-code-mode,
  // not the generic code skill. Disambiguate so the best guess for these
  // toolchain-shaped prompts is mcp-code-mode.
  // Toolchain + external-data-source vocabulary (webflow CMS, cms collection)
  // is mcp-code-mode territory, not the generic code skill.
  if (/\b(call_tool_chain|code mode|tool ?chain|api chain|webflow cms|cms collection)\b/.test(promptLower)) {
    if (recommendation.skill === 'mcp-code-mode') return R.mcpToolchainCodeModeBonus;
    if (recommendation.skill === 'sk-code') return R.mcpToolchainSkCodePenalty;
  }
  // A "code audit" is a code-review task, not a deep-review loop. On the
  // near-tie this phrase produces, prefer sk-code-review over deep-review.
  if (/\bcode audit\b/.test(promptLower)) {
    if (recommendation.skill === 'sk-code-review') return R.codeAuditCodeReviewBonus;
    if (recommendation.skill === 'deep-review' || recommendation.skill === 'deep-loop-workflows') return R.codeAuditDeepReviewPenalty;
  }
  // Colon-command review-loop syntax (":review:auto") invokes the deep-review
  // loop; rank it above single-pass code review.
  if (/:review:(auto|confirm)\b/.test(promptLower)) {
    if (recommendation.skill === 'deep-loop-workflows') return R.reviewLoopDeepReviewBonus;
    if (recommendation.skill === 'sk-code-review') return R.deepReviewSkCodeReviewPenalty;
  }
  // Auditing recommendation quality is a review task, not an advisor-self task.
  if (/\baudit\b/.test(promptLower) && /\b(recommendation|recommendations|recommendation quality|routing quality)\b/.test(promptLower)) {
    if (recommendation.skill === 'sk-code-review') return R.auditRecsCodeReviewBonus;
    if (!selfRecommendationGuardEnabled && isAdvisorSelfRecommendationSkill(recommendation.skill)) return R.auditRecsAdvisorPenalty;
    if (shouldApplyAdvisorSelfRecommendationGuard({
      skillId: recommendation.skill,
      guardEnabled: selfRecommendationGuardEnabled,
    })) {
      return R.auditRecsAdvisorPenalty;
    }
  }
  if (/\b(save context|save memory)\b/.test(promptLower)) {
    if (recommendation.skill === 'memory:save') return R.saveContextMemorySaveBonus;
    if (recommendation.skill === 'system-spec-kit') return R.saveContextMemorySpecKitPenalty;
  }
  if (/\b(create (a )?new agent|create agent)\b/.test(promptLower) || promptLower.includes('/create:agent')) {
    if (recommendation.skill === 'create:agent') return R.createAgentCreateAgentBonus;
    if (recommendation.skill === 'sk-doc') return R.createAgentSkDocPenalty;
  }
  if (/\bcreate (a )?(test|testing) playbook\b/.test(promptLower) || promptLower.includes('/create:testing-playbook')) {
    if (recommendation.skill === 'create:testing-playbook' || recommendation.skill === 'command-create-testing-playbook') return R.createTestingPlaybookBonus;
    if (recommendation.skill === 'sk-doc') return R.createTestingPlaybookSkDocPenalty;
    if (recommendation.skill === 'deep-loop-workflows') return R.createTestingPlaybookOtherSkillsPenalty;
  }
  if (/\bphase folder\b/.test(promptLower)) {
    if (recommendation.skill === 'system-spec-kit') return R.phaseFolderSpecKitBonus;
  }
  return 0;
}

export function scoreAdvisorPrompt(prompt: string, options: AdvisorScoringOptions): AdvisorScoringResult {
  const projection = options.projection ?? loadAdvisorProjection(options.workspaceRoot);
  const promptLower = prompt.toLowerCase();
  const queryClass = classifyAdvisorQuery(promptLower);
  const weights = effectiveScorerWeights(
    options.laneWeightsOverride,
    isAdvisorQueryClassRoutingEnabled() ? queryClass : 'unknown',
  );
  const disabled = new Set(options.disabledLanes ?? []);
  const affordances = normalize(options.affordances ?? []);
  const useRrfFusion = isAdvisorRrfFusionEnabled();
  const useExactSemanticRerank = useRrfFusion && isAdvisorExactSemanticRerankEnabled();
  const selfRecommendationGuardEnabled = isAdvisorSelfRecommendationGuardEnabled();
  const { laneScores, graphConflictMatches } = buildLaneScores(
    prompt,
    projection,
    disabled,
    affordances,
    useRrfFusion,
    selfRecommendationGuardEnabled,
  );
  const runtimeLaneHealth = projectionRuntimeLaneHealth(projection, options.runtimeLaneHealth);
  const laneHealth = buildLaneRuntimeHealth(laneScores, disabled, runtimeLaneHealth);
  const degradedLanes = laneHealth
    .filter((lane) => lane.status === 'runtime_degraded')
    .map((lane) => lane.lane);
  const runtimeDegradedLanes = new Set(degradedLanes);
  const graphConflictIndex = buildConflictMatchIndex(graphConflictMatches);
  const rrfFusion = useRrfFusion
    ? fuseAdvisorLaneRanks(laneScores, weights, disabled, runtimeDegradedLanes)
    : null;
  const laneScoreIndexes = Object.fromEntries(
    SCORER_LANES.map((lane) => [lane, buildLaneMatchIndex(laneScores[lane])]),
  ) as Record<ScorerLane, LaneMatchIndex>;
  const liveTotal = SCORER_LANES
    .filter((lane) => !disabled.has(lane) && !runtimeDegradedLanes.has(lane))
    .reduce((total, lane) => isLiveScorerLane(lane) ? total + weights[lane] : total, 0) || liveWeightTotal();
  const runtimeLiveLaneCount = SCORER_LANES
    .filter((lane) => isLiveScorerLane(lane) && !disabled.has(lane) && !runtimeDegradedLanes.has(lane))
    .length;
  if (isSpeckitMetricsEnabled() && liveTotal > 0) {
    for (const lane of SCORER_LANES) {
      if (!isLiveScorerLane(lane) || disabled.has(lane) || runtimeDegradedLanes.has(lane)) continue;
      speckitMetrics.setGauge('spec_kit.scorer.fusion_live_weight_share', weights[lane] / liveTotal, { lane });
    }
  }
  const readOnlyExplainer = isReadOnlyExplainer(promptLower);
  const hasTaskIntent = TASK_INTENT.test(promptLower);
  const recommendations: AdvisorScoredRecommendation[] = [];

  for (const skill of projection.skills) {
    if (!isDefaultRoutable(promptLower, skill)) continue;
    const contributions: LaneContribution[] = SCORER_LANES.map((lane) => {
      const laneMatch = laneScoreIndexes[lane].get(skill.id);
      const rawScore = laneMatch?.rawScore ?? 0;
      const shadowOnly = !isLiveScorerLane(lane);
      const runtimeDegraded = runtimeDegradedLanes.has(lane);
      return {
        lane,
        rawScore,
        weightedScore: shadowOnly || disabled.has(lane) || runtimeDegraded ? 0 : rawScore * weights[lane],
        weight: disabled.has(lane) || runtimeDegraded ? 0 : weights[lane],
        evidence: laneMatch?.evidence ?? [],
        shadowOnly,
      };
    });
    const weightedScore = contributions.reduce((total, contribution) => total + contribution.weightedScore, 0);
    const rrfScore = rrfFusion?.scoreBySkill.get(skill.id);
    const score = useRrfFusion ? rrfScore ?? 0 : weightedScore;
    if (score <= 0 && contributions.every((contribution) => contribution.rawScore <= 0)) continue;
    if (isSpeckitMetricsEnabled()) {
      for (const contribution of contributions) {
        if (contribution.weightedScore !== 0) {
          speckitMetrics.setGauge('spec_kit.scorer.lane_contribution', contribution.weightedScore, { lane: contribution.lane, skill_id: skill.id });
        }
      }
    }

    const directScore = Math.max(
      contributions.find((contribution) => contribution.lane === 'explicit_author')?.rawScore ?? 0,
      contributions.find((contribution) => contribution.lane === 'lexical')?.rawScore ?? 0,
    );
    const derivedDominant = isDerivedDominant(contributions);
    const explicitSignal = hasExplicitWorkflowSignal(contributions, skill.id);
    const explicitMatch = laneScoreIndexes.explicit_author.get(skill.id);
    const liveNormalized = score / liveTotal;
    let confidence = confidenceFor({
      liveNormalized,
      directScore,
      readOnlyExplainer,
      hasExplicitWorkflowSignal: explicitSignal,
      hasTaskIntent,
      readOnlyRouteAllowed: readOnlyRouteAllowed(promptLower, skill.id),
      derivedDominant,
      skillId: skill.id,
      selfRecommendationGuardEnabled,
      hasAdvisorSelfAuthoredSignal: hasAdvisorSelfAuthoredSignal(skill.id, explicitMatch),
    });
    if ((skill.id === 'memory:save' || skill.id === 'command-memory-save') && isPlainFileSavePrompt(promptLower)) {
      confidence = Math.min(confidence, 0.49);
    }
    recommendations.push({
      skill: skill.id,
      kind: skill.kind,
      confidence,
      uncertainty: uncertaintyFor(contributions, confidence, 0),
      passes_threshold: false,
      reason: attributionReason(contributions),
      score: useRrfFusion ? score : Number(score.toFixed(6)),
      laneContributions: contributions,
      dominantLane: dominantLane(contributions),
      redirectTo: skill.redirectTo ?? undefined,
      redirectFrom: skill.redirectFrom,
      lifecycleStatus: skill.lifecycleStatus,
    });
  }

  if (isSpeckitMetricsEnabled()) {
    for (const recommendation of recommendations) {
      if (primaryIntentBonus(promptLower, recommendation, selfRecommendationGuardEnabled) !== 0) {
        speckitMetrics.incrementCounter('spec_kit.scorer.primary_intent_bonus_applied_total', { skill_id: recommendation.skill });
      }
      if (useRrfFusion && graphConflictAdjustment(graphConflictIndex, recommendation) !== 0) {
        speckitMetrics.incrementCounter('spec_kit.scorer.graph_conflict_demote_applied_total', { skill_id: recommendation.skill });
      }
    }
  }
  const exactSemanticRerankIndex = useExactSemanticRerank
    ? buildExactSemanticRerankIndex(prompt, projection, recommendations, rrfFusion)
    : new Map<string, ExactSemanticRerankEntry>();
  let ranked = recommendations.sort((left, right) => {
    const leftCommandBonus = left.kind === 'command' && !promptLower.includes('/') ? -0.08 : 0;
    const rightCommandBonus = right.kind === 'command' && !promptLower.includes('/') ? -0.08 : 0;
    const leftIntent = primaryIntentBonus(promptLower, left, selfRecommendationGuardEnabled);
    const rightIntent = primaryIntentBonus(promptLower, right, selfRecommendationGuardEnabled);
    const leftConflict = useRrfFusion ? graphConflictAdjustment(graphConflictIndex, left) : 0;
    const rightConflict = useRrfFusion ? graphConflictAdjustment(graphConflictIndex, right) : 0;
    const adjustedScoreDiff = (right.score + rightCommandBonus + rightIntent + rightConflict)
      - (left.score + leftCommandBonus + leftIntent + leftConflict);
    if (useRrfFusion) {
      const leftExactSemantic = exactSemanticRerankScore(exactSemanticRerankIndex, left);
      const rightExactSemantic = exactSemanticRerankScore(exactSemanticRerankIndex, right);
      if (leftExactSemantic !== null
        && rightExactSemantic !== null
        && Math.abs(adjustedScoreDiff) <= ADVISOR_EXACT_SEMANTIC_RERANK_WINDOW) {
        const exactSemanticDiff = rightExactSemantic - leftExactSemantic;
        if (exactSemanticDiff !== 0) {
          return exactSemanticDiff;
        }
      }
      return adjustedScoreDiff
        || rrfRankFor(rrfFusion, left) - rrfRankFor(rrfFusion, right)
        || left.skill.localeCompare(right.skill);
    }
    return adjustedScoreDiff
      || right.confidence - left.confidence
      || left.skill.localeCompare(right.skill);
  });

  ranked = ranked.map((recommendation, index) => {
    const next = ranked[index + 1];
    const ambiguityPressure = next && Math.abs(recommendation.confidence - next.confidence) <= 0.05 ? 0.04 : 0;
    const uncertainty = uncertaintyFor(recommendation.laneContributions, recommendation.confidence, ambiguityPressure);
    return {
      ...recommendation,
      uncertainty,
      passes_threshold: recommendation.confidence >= (options.confidenceThreshold ?? DEFAULT_CONFIDENCE_THRESHOLD)
        && uncertainty <= (options.uncertaintyThreshold ?? DEFAULT_UNCERTAINTY_THRESHOLD),
    };
  });
  ranked = applyAmbiguity(ranked);

  // Low-information ambiguity abstention: a short, intent-less prompt that lands
  // in a multi-candidate ambiguity cluster is genuinely under-specified. Floor
  // every cluster member's uncertainty above the strict threshold so strict
  // callers abstain, while confidence-only callers still surface the best guess
  // (the disambiguated top-ranked candidate).
  const meaningfulTokenCount = promptLower.split(/\s+/).filter((token) => token.length > 1).length;
  const lowInfoPrompt = meaningfulTokenCount <= 3 && !hasTaskIntent && !promptLower.includes('/');
  if (lowInfoPrompt) {
    const clusterMembers = ranked.filter((recommendation) => (recommendation.ambiguousWith?.length ?? 0) > 0);
    // Only abstain when the cluster's lead is built from diffuse, shared
    // single-word keyword matches rather than a distinctive multi-word phrase
    // anchor (an explicit-author/derived phrase match such as "code audit").
    // A multi-word anchor means the prompt does pin a specific skill, so it
    // should route instead of abstaining.
    const clusterHasPhraseAnchor = clusterMembers.some((recommendation) => (
      recommendation.laneContributions.some((contribution) => (
        (contribution.lane === 'explicit_author' || contribution.lane === 'derived_generated')
        && contribution.evidence.some((entry) => entry.includes(' '))
      ))
    ));
    if (clusterMembers.length >= 2 && !clusterHasPhraseAnchor) {
      const confThreshold = options.confidenceThreshold ?? DEFAULT_CONFIDENCE_THRESHOLD;
      const uncThreshold = options.uncertaintyThreshold ?? DEFAULT_UNCERTAINTY_THRESHOLD;
      const floor = SCORING_CALIBRATION.uncertainty.lowInfoAmbiguityFloor;
      ranked = ranked.map((recommendation) => {
        if ((recommendation.ambiguousWith?.length ?? 0) === 0) return recommendation;
        const uncertainty = Math.max(recommendation.uncertainty, floor);
        return {
          ...recommendation,
          uncertainty,
          passes_threshold: recommendation.confidence >= confThreshold && uncertainty <= uncThreshold,
        };
      });
    }
  }

  // Class C: breadth / multi-concern abstention. A broad greenfield build
  // ("build full stack typescript service") or a multi-concern optimization
  // ("optimize X execution speed and recommendation quality") is under-specified
  // for single-skill routing. When the top code-like candidate carries that
  // shape, floor every passing candidate's uncertainty so strict callers abstain.
  // Narrow anchors (a file, failing test, named component/route, benchmark, or
  // review intent) bypass the broad-build branch; the multi-concern branch
  // requires two distinct concern classes, so a file + single concern still routes.
  if (!promptLower.includes('/')) {
    const concernClasses = (CONCERN_PERF.test(promptLower) ? 1 : 0) + (CONCERN_QUALITY.test(promptLower) ? 1 : 0);
    const broadBuild = BREADTH_BUILD_VERB.test(promptLower) && BREADTH_NOUN.test(promptLower) && !BREADTH_NARROW_ANCHOR.test(promptLower);
    const multiConcern = MULTI_CONCERN_VERB.test(promptLower) && concernClasses >= 2;
    if (broadBuild || multiConcern) {
      const topRec = ranked.find((recommendation) => recommendation.passes_threshold) ?? null;
      if (topRec && (topRec.skill === 'sk-code' || topRec.skill === 'system-skill-advisor')) {
        const confThreshold = options.confidenceThreshold ?? DEFAULT_CONFIDENCE_THRESHOLD;
        const uncThreshold = options.uncertaintyThreshold ?? DEFAULT_UNCERTAINTY_THRESHOLD;
        const floor = SCORING_CALIBRATION.uncertainty.lowInfoAmbiguityFloor;
        ranked = ranked.map((recommendation) => {
          if (!recommendation.passes_threshold) return recommendation;
          const uncertainty = Math.max(recommendation.uncertainty, floor);
          return {
            ...recommendation,
            uncertainty,
            passes_threshold: recommendation.confidence >= confThreshold && uncertainty <= uncThreshold,
          };
        });
      }
    }
  }

  const passing = ranked.filter((recommendation) => recommendation.passes_threshold);
  const visible = options.includeAllCandidates ? ranked : passing;
  const top = passing[0] ?? null;
  const laneHealthReason = degradedLaneReason(degradedLanes);
  const abstainReasons = laneHealthReason ? [laneHealthReason] : [];
  if (isSpeckitMetricsEnabled() && top) {
    const runtimeLabel = normalizeRuntimeLabel(process.env.SPECKIT_RUNTIME);
    const freshnessLabel = normalizeFreshnessLabel(process.env.SPECKIT_ADVISOR_FRESHNESS);
    if (runtimeLabel && freshnessLabel) {
      speckitMetrics.incrementCounter('spec_kit.advisor.recommendation_emitted_total', { runtime: runtimeLabel, freshness_state: freshnessLabel });
    }
    speckitMetrics.recordConfidenceBracket(top.confidence);
  }
  return {
    recommendations: visible,
    topSkill: top?.skill ?? null,
    unknown: !top,
    ambiguous: isAmbiguousTopTwo(ranked),
    metrics: {
      candidateCount: ranked.length,
      liveLaneCount: runtimeLiveLaneCount,
      ...(degradedLanes.length > 0 ? { degradedLanes, laneHealth } : {}),
    },
    ...(abstainReasons.length > 0 ? { abstainReasons } : {}),
  };
}
