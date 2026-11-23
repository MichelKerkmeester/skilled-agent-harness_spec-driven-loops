// ───────────────────────────────────────────────────────────────
// MODULE: advisor_recommend Handler
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { disabledRecommendOutput, emptyOutput, requestWorkspaceRoot } from '../lib/advisor-disabled.js';
import { TRACKED_COMMANDS, attachCommand, commandRowFor, routeNeedsMode, typedCommandForTop } from '../lib/command-attach.js';
import { advisorPromptCache } from '../lib/prompt-cache.js';
import { extractMetalinguisticSkillMentions, stripLeadingPastedReply } from '../lib/prompt-policy.js';
import { routeExclusionsStamp } from '../lib/route-exclusions.js';
import {
  resolveAdvisorThresholdConfig,
} from '../lib/skill-advisor-brief.js';
import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
import {
  DEEP_ROUTING_PROJECTION_HASH,
  MERGED_DEEP_SKILL_ID,
  modeForAlias,
  modeForPromptAlias,
} from '../lib/scorer/aliases.js';
import { DEFAULT_SHADOW_SCORER_LANE_WEIGHTS } from '../lib/scorer/lane-registry.js';
import { sanitizeSkillLabel } from '../lib/render.js';
import { recordShadowDelta, shadowDeltaSinkEnabled } from '../lib/shadow/shadow-sink.js';
import {
  AdvisorRecommendInputSchema,
  AdvisorRecommendOutputSchema,
  type AdvisorRecommendInput,
  type AdvisorRecommendOutput,
} from '../schemas/advisor-tool-schemas.js';
import { readAdvisorStatus } from './advisor-status.js';
import {
  COMPILED_ROUTING_HUBS,
  compiledRoutingEnabledForHub,
  parseCompiledRoutingFlagMode,
} from '../lib/compiled-routing-flag.js';
import type { AdvisorScoringOptions } from '../lib/scorer/types.js';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

type HandlerResponse = { content: Array<{ type: string; text: string }> };
type AdvisorStatus = ReturnType<typeof readAdvisorStatus>;
type ScoredRecommendation = ReturnType<typeof scoreAdvisorPrompt>['recommendations'][number];
type PublicRecommendationStatus = NonNullable<AdvisorRecommendOutput['recommendations'][number]['status']>;
type PublicThresholds = AdvisorRecommendOutput['effectiveThresholds'];
type ShadowRecommendation = NonNullable<AdvisorRecommendOutput['_shadow']>['recommendations'][number];

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

// Emit-only, stderr, debug-gated compiled-routing diagnostic. Never written to
// stdout or the tool response, and never changes the recommendation outcome.
function emitCompiledRoutingBreadcrumb(message: string): void {
  if (process.env.SPECKIT_COMPILED_ROUTING_DEBUG) {
    process.stderr.write(`[compiled-routing] ${message}\n`);
  }
}

// The exclusion list is read beside the graph, so an edit to it retires cached
// answers the same way a graph rebuild does.
function cacheSourceSignature(status: AdvisorStatus): string {
  return `${status.freshness}:${status.generation}:${status.lastGenerationBump ?? 'never'}:${DEEP_ROUTING_PROJECTION_HASH}`
    + `:${routeExclusionsStamp()}`;
}

function recommendationLabels(output: AdvisorRecommendOutput): string[] {
  return output.recommendations.map((recommendation) => recommendation.skillId);
}

function publicThresholds(args: {
  confidenceThreshold?: number;
  uncertaintyThreshold?: number;
}): PublicThresholds {
  const resolved = resolveAdvisorThresholdConfig(args);
  return {
    confidenceThreshold: resolved.confidenceThreshold,
    uncertaintyThreshold: resolved.uncertaintyThreshold,
    confidenceOnly: resolved.confidenceOnly,
  };
}

function runtimeLaneHealthForStatus(status: AdvisorStatus): AdvisorScoringOptions['runtimeLaneHealth'] | undefined {
  if (status.freshness !== 'stale') {
    return undefined;
  }
  return {
    graph_causal: {
      status: 'runtime_degraded',
      reason: status.trustState.reason ?? 'skill_graph_stale',
    },
  };
}

function renderableStatus(status: AdvisorStatus): AdvisorStatus {
  const trustState = status.trustState.state;
  if (status.freshness === 'unavailable' && (trustState === 'live' || trustState === 'stale')) {
    return { ...status, freshness: trustState };
  }
  return status;
}

function absentOutput(
  status: AdvisorStatus,
  workspaceRoot: string,
  effectiveThresholds: AdvisorRecommendOutput['effectiveThresholds'],
): AdvisorRecommendOutput {
  return emptyOutput({
    workspaceRoot,
    effectiveThresholds,
    freshness: 'absent',
    trustState: status.trustState,
    warnings: [status.trustState.reason ?? 'ADVISOR_FRESHNESS_ABSENT'],
    abstainReasons: ['Skill advisor freshness is absent; returning fail-open empty recommendations.'],
  });
}

function unavailableOutput(
  status: AdvisorStatus,
  workspaceRoot: string,
  effectiveThresholds: AdvisorRecommendOutput['effectiveThresholds'],
): AdvisorRecommendOutput {
  return emptyOutput({
    workspaceRoot,
    effectiveThresholds,
    freshness: 'unavailable',
    trustState: {
      ...status.trustState,
      state: 'unavailable',
      reason: 'advisor_unavailable',
    },
    warnings: ['advisor_unavailable', ...(status.errors ?? [])],
    abstainReasons: ['Skill advisor freshness is unavailable; returning fail-open empty recommendations.'],
  });
}

function safeMany(values: readonly string[] | undefined): string[] {
  return (values ?? [])
    .map((value) => sanitizeSkillLabel(value))
    .filter((value): value is string => Boolean(value));
}

function evidenceFeature(value: string): string {
  const prefix = value.split(':', 1)[0];
  switch (prefix) {
    case 'phrase':
      return 'phrase_match';
    case 'token':
      return 'token_match';
    case 'hint':
      return 'category_hint';
    case 'derived':
      return 'derived_skill_signal';
    case 'doc':
      return 'doc_reference_signal';
    default:
      if (value.includes('disambiguation')) return 'disambiguation_rule';
      if (value.includes('surface')) return 'surface_signal';
      if (value.includes('intent')) return 'intent_signal';
      if (value.includes('loop')) return 'workflow_signal';
      return 'scorer_signal';
  }
}

function publicWhyRecommended(recommendation: ScoredRecommendation) {
  const positiveLanes = recommendation.laneContributions
    .filter((lane) => lane.rawScore > 0 || lane.weightedScore > 0)
    .sort((left, right) => right.weightedScore - left.weightedScore)
    .slice(0, 4);
  const matchedSkillFeatures = positiveLanes.flatMap((lane) => (
    Array.from(new Set(lane.evidence.map((entry) => evidenceFeature(entry)))).map((feature) => ({
      lane: lane.lane,
      feature,
    }))
  ));
  const dominant = recommendation.dominantLane;
  return {
    reason: dominant
      ? `Recommended from ranker signals: ${dominant} contributed the strongest live score.`
      : 'Recommended from ranker signals without a single dominant live lane.',
    dominantLane: dominant,
    topLanes: positiveLanes.map((lane) => ({
      lane: lane.lane,
      rawScore: lane.rawScore,
      weightedScore: lane.weightedScore,
      weight: lane.weight,
      shadowOnly: lane.shadowOnly,
      evidenceTypes: Array.from(new Set(lane.evidence.map((entry) => evidenceFeature(entry)))),
      evidenceCount: lane.evidence.length,
    })),
    matchedSkillFeatures,
  };
}

// Doc evidence entries are skill-relative markdown paths emitted by the
// derived lane as `doc:<path>`. The allowlist rejects anything that
// could smuggle prompt content or path traversal into the response.
const SAFE_DOC_PATH = /^(references|assets)\/[A-Za-z0-9_./-]+\.md$/;

export function matchedDocsFromContributions(
  recommendation: { readonly laneContributions: ReadonlyArray<{ readonly evidence: readonly string[] }> },
): string[] {
  const docs: string[] = [];
  for (const lane of recommendation.laneContributions) {
    for (const entry of lane.evidence) {
      if (!entry.startsWith('doc:')) continue;
      const path = entry.slice(4);
      if (!SAFE_DOC_PATH.test(path) || path.includes('..')) continue;
      if (!docs.includes(path)) docs.push(path);
      if (docs.length >= 3) return docs;
    }
  }
  return docs;
}

function workflowModeForRecommendation(
  recommendation: ScoredRecommendation,
  prompt: string,
): string | undefined {
  const directMode = modeForAlias(recommendation.skill);
  const promptMode = recommendation.skill === MERGED_DEEP_SKILL_ID
    ? modeForPromptAlias(prompt)
    : null;
  const workflowMode = sanitizeSkillLabel(directMode ?? promptMode ?? '');
  return workflowMode || undefined;
}

function publicRecommendation(
  recommendation: ScoredRecommendation,
  includeAttribution: boolean,
  prompt: string,
) {
  const skillId = sanitizeSkillLabel(recommendation.skill);
  if (!skillId) return null;
  const commandRow = commandRowFor(recommendation.skill);
  const matchedDocs = matchedDocsFromContributions(recommendation);
  const redirectFrom = safeMany(recommendation.redirectFrom);
  const redirectTo = sanitizeSkillLabel(recommendation.redirectTo ?? '');
  const heldBelow = sanitizeSkillLabel(recommendation.heldBelow ?? '');
  const sanitizedStatus = sanitizeSkillLabel(recommendation.lifecycleStatus);
  const status: PublicRecommendationStatus | undefined = sanitizedStatus === 'active'
    || sanitizedStatus === 'deprecated'
    || sanitizedStatus === 'archived'
    || sanitizedStatus === 'future'
    ? sanitizedStatus as PublicRecommendationStatus
    : undefined;
  const workflowMode = workflowModeForRecommendation(recommendation, prompt);
  // Callers read the per-lane scores under either name, so both carry the same
  // prompt-free numbers. Lane evidence stays out, because it can quote the prompt.
  const laneScores = includeAttribution
    ? recommendation.laneContributions.map((lane) => ({
      lane: lane.lane,
      rawScore: lane.rawScore,
      weightedScore: lane.weightedScore,
      weight: lane.weight,
      shadowOnly: lane.shadowOnly,
    }))
    : [];
  return {
    skillId,
    kind: recommendation.kind,
    score: recommendation.score,
    confidence: recommendation.confidence,
    uncertainty: recommendation.uncertainty,
    dominantLane: recommendation.dominantLane,
    ...(includeAttribution ? {
      laneBreakdown: laneScores,
      laneContributions: laneScores,
      why_recommended: publicWhyRecommended(recommendation),
    } : {}),
    ...(matchedDocs.length > 0 ? { matchedDocs } : {}),
    ...(redirectFrom.length > 0 ? { redirectFrom } : {}),
    ...(redirectTo ? { redirectTo } : {}),
    // Hook briefs re-derive ambiguity from the public list, so a skill the typed
    // command already ranked below its seed has to say so here.
    ...(heldBelow ? { heldBelow } : {}),
    // A hook holds back a floored route against the session's earlier one, so
    // the floor has to survive into the public list.
    ...(recommendation.confidenceFloored === true ? { confidenceFloored: true as const } : {}),
    ...(status ? { status } : {}),
    ...(workflowMode ? { workflowMode } : {}),
    // A command row is the contract a reader acts on, so its runnable string,
    // policy and owner travel with the pick. An id with no row adds nothing.
    ...(commandRow ? {
      command: commandRow.command,
      ...(commandRow.policy ? { policy: commandRow.policy } : {}),
      ownerSkillId: commandRow.ownerSkillId,
    } : {}),
  };
}

// The front door runs from the request's workspaceRoot, and a caller may name
// another checkout there, such as a worktree under the repository root. Its copy
// can predate --prompt-stdin and would resolve an empty prompt, so such a copy
// gets no compiled route rather than the prompt in argv.
export function frontDoorReadsPromptFromStdin(frontDoorPath: string): boolean {
  try {
    return readFileSync(frontDoorPath, 'utf8').includes('--prompt-stdin');
  } catch {
    return false;
  }
}

function compiledRouteForRecommendation(
  skillId: string,
  prompt: string,
  workspaceRoot: string,
  surfaceHint?: string,
): Record<string, unknown> | undefined {
  if (!COMPILED_ROUTING_HUBS.has(skillId)) return undefined;
  const frontDoor = resolve(workspaceRoot, '.skilled', 'bin', 'compiled-route.cjs');
  if (!frontDoorReadsPromptFromStdin(frontDoor)) {
    emitCompiledRoutingBreadcrumb(`compiled-route front door cannot read the prompt from stdin; skipping hub=${skillId}`);
    return undefined;
  }
  try {
    const args = [
      frontDoor,
      '--hub',
      skillId,
      '--prompt-stdin',
    ];
    // A hint the caller already holds is forwarded as its own argv element;
    // the front door ignores a value that names no known surface.
    if (surfaceHint) args.push('--surface-hint', surfaceHint);
    const output = execFileSync(process.execPath, args, {
      cwd: workspaceRoot,
      encoding: 'utf8',
      input: prompt,
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 5_000,
      maxBuffer: 1_048_576,
    });
    const parsed: unknown = JSON.parse(output.trim());
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return undefined;
    }
    const compiledRoute = parsed as Record<string, unknown>;
    return compiledRoute.servingAuthority === 'legacy' ? undefined : compiledRoute;
  } catch (error) {
    // Surface the otherwise-silent fallback (debug-gated), including any child
    // stderr the pipe above now captures instead of discarding. The served
    // outcome is unchanged: a failed probe attaches no compiled route (legacy).
    const childStderr = (error as { stderr?: unknown } | null)?.stderr;
    const detail = typeof childStderr === 'string' && childStderr.trim()
      ? ` child-stderr=${childStderr.trim()}`
      : '';
    emitCompiledRoutingBreadcrumb(
      `compiled-route subprocess failed for hub=${skillId}: ${error instanceof Error ? error.message : String(error)}${detail}`,
    );
    return undefined;
  }
}

function enrichCompiledRoutes(
  output: AdvisorRecommendOutput,
  prompt: string,
  workspaceRoot: string,
  surfaceHint?: string,
  topOnly = false,
): AdvisorRecommendOutput {
  const mode = parseCompiledRoutingFlagMode(process.env.SPECKIT_COMPILED_ROUTING);
  if (mode === 'invalid') {
    emitCompiledRoutingBreadcrumb(
      `ignoring invalid SPECKIT_COMPILED_ROUTING=${JSON.stringify(process.env.SPECKIT_COMPILED_ROUTING)}; serving legacy`,
    );
  }
  // Only enrich hubs the flag permits. The default cohort now covers all 7
  // compiled-eligible hubs (mirrors the runtime resolver's own default-on
  // cohort), so unset attaches compiledRoute for those hubs; the kill-switch
  // ('0'|'false'|'off') and invalid values still skip enrichment for every hub.
  // Skip the schema re-parse entirely when nothing is eligible so the output is
  // returned unchanged.
  const anyEligible = output.recommendations.some((r) => compiledRoutingEnabledForHub(r.skillId));
  if (!anyEligible) return output;
  const namedSkills = extractMetalinguisticSkillMentions(prompt);
  // A command row that already ranks in this result offers its command by itself,
  // so the owning hub must not offer the same one again and spend a second slot on it.
  const alreadyOffered = new Set<string>();
  for (const recommendation of output.recommendations) {
    if (recommendation.command) alreadyOffered.add(recommendation.command);
  }
  return AdvisorRecommendOutputSchema.parse({
    ...output,
    recommendations: output.recommendations.map((recommendation, index) => {
      // Each lookup is a subprocess, so a caller that acts on the top pick alone
      // pays for that one and no more.
      if (topOnly && index > 0) return recommendation;
      if (!compiledRoutingEnabledForHub(recommendation.skillId)) return recommendation;
      const compiledRoute = compiledRouteForRecommendation(
        recommendation.skillId,
        prompt,
        workspaceRoot,
        surfaceHint,
      );
      if (!compiledRoute) return recommendation;
      // The route answers which mode the hub would take; the command is what a reader
      // types to run it, so it rides along only when the route names exactly one mode
      // that has a command. A broader route leaves the key off rather than guessing.
      const command = attachCommand(recommendation.skillId, compiledRoute, prompt);
      // Every caller renders the head and at most one partner, so a command a
      // lower row carries would never reach the reader. The head keeps the
      // command whichever request shape the caller asked for.
      return command && (!alreadyOffered.has(command) || index === 0)
        ? {
          ...recommendation,
          compiledRoute,
          command,
          ...(Object.hasOwn(TRACKED_COMMANDS, command) ? { policy: TRACKED_COMMANDS[command].policy } : {}),
        }
        : { ...recommendation, compiledRoute, ...(!command && routeNeedsMode(recommendation.skillId, compiledRoute, namedSkills) ? { needsMode: true as const } : {}) };
    }),
  });
}

// A typed command is the reader's own choice, so it outranks a routed mode: the
// reader already named the command, and a compiled route only guesses which mode
// they meant. The top recommendation carries it because that is the row a reader
// acts on, and an unrelated top keeps the output it had.
export function attachTypedCommand(
  output: AdvisorRecommendOutput,
  prompt: string,
): AdvisorRecommendOutput {
  const top = output.recommendations[0];
  if (!top) return output;
  const typed = typedCommandForTop(top.skillId, prompt);
  if (!typed) return output;
  return AdvisorRecommendOutputSchema.parse({
    ...output,
    recommendations: [
      {
        ...top,
        command: typed.command,
        policy: typed.policy,
        ownerSkillId: typed.ownerSkillId,
        typed: true as const,
      },
      ...output.recommendations.slice(1),
    ],
  });
}

function publicShadowRecommendations(recommendations: readonly ScoredRecommendation[], topK: number): ShadowRecommendation[] {
  const shadowRecommendations: ShadowRecommendation[] = [];
  for (const recommendation of recommendations) {
    const skillId = sanitizeSkillLabel(recommendation.skill);
    if (!skillId) continue;
    const shadowContributions = recommendation.laneContributions.map((lane) => ({
      lane: lane.lane,
      weightedScore: lane.rawScore * DEFAULT_SHADOW_SCORER_LANE_WEIGHTS[lane.lane],
    }));
    const shadowScore = roundScore(shadowContributions.reduce((total, lane) => total + lane.weightedScore, 0));
    const dominant = shadowContributions
      .filter((lane) => lane.weightedScore > 0)
      .sort((left, right) => right.weightedScore - left.weightedScore)[0]?.lane ?? null;
    shadowRecommendations.push({
        skillId,
        liveScore: recommendation.score,
        shadowScore,
        delta: roundScore(shadowScore - recommendation.score),
        dominantShadowLane: dominant,
    });
  }
  return shadowRecommendations
    .sort((left, right) => right.shadowScore - left.shadowScore || left.skillId.localeCompare(right.skillId))
    .slice(0, topK);
}

function roundScore(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function outputWarnings(
  status: AdvisorStatus,
  result: ReturnType<typeof scoreAdvisorPrompt>,
): string[] {
  const degradedLanes = result.metrics.degradedLanes ?? [];
  return [
    ...(status.freshness === 'stale' ? [status.trustState.reason ?? 'STALE_ADVISOR_FRESHNESS'] : []),
    ...(degradedLanes.length > 0
      ? [`runtime_degraded_lanes:${degradedLanes.join(',')}`]
      : []),
  ];
}

function outputAbstainReasons(
  input: AdvisorRecommendInput,
  result: ReturnType<typeof scoreAdvisorPrompt>,
): string[] {
  if (!input.options?.includeAbstainReasons) return [];
  return [
    ...(result.unknown ? ['No recommendation passed confidence and uncertainty thresholds.'] : []),
    ...(result.abstainReasons ?? []),
  ];
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

async function computeRecommendationOutput(input: AdvisorRecommendInput): Promise<AdvisorRecommendOutput> {
  // Canonicalize via realpath after the schema allowlist check.
  const workspaceRoot = requestWorkspaceRoot(input.workspaceRoot);
  const effectiveThresholds = publicThresholds({
    confidenceThreshold: input.options?.confidenceThreshold,
    uncertaintyThreshold: input.options?.uncertaintyThreshold,
  });
  // Detect on-disk corruption here too: without it a malformed artifact reads
  // 'live' from the generation counters and the recommend path would serve
  // results as fresh. The verdict is cached per generation, so the quick_check
  // runs at most once per rebuild rather than on every recommendation.
  const status = renderableStatus(readAdvisorStatus({ workspaceRoot, checkArtifactIntegrity: true }));
  if (status.freshness === 'unavailable') {
    return unavailableOutput(status, workspaceRoot, effectiveThresholds);
  }
  if (status.freshness === 'absent') {
    return absentOutput(status, workspaceRoot, effectiveThresholds);
  }
  const sourceSignature = cacheSourceSignature(status);
  advisorPromptCache.invalidateSourceSignatureChange(sourceSignature);
  // Stripped once here so the cache key and the scorer see the same text.
  const scoredPrompt = stripLeadingPastedReply(input.prompt);
  const key = advisorPromptCache.makeKey({
    canonicalPrompt: scoredPrompt.trim(),
    sourceSignature,
    workspaceRoot,
    runtime: 'mcp',
    maxTokens: input.options?.topK,
    thresholdConfig: {
      confidenceThreshold: input.options?.confidenceThreshold,
      uncertaintyThreshold: input.options?.uncertaintyThreshold,
      includeAttribution: input.options?.includeAttribution,
      includeAbstainReasons: input.options?.includeAbstainReasons,
    },
  });
  const cached = advisorPromptCache.get(key);
  if (cached) {
    const cachedOutput = cached.value as AdvisorRecommendOutput;
    const parsedCachedOutput = AdvisorRecommendOutputSchema.parse({
      ...cachedOutput,
      workspaceRoot,
      effectiveThresholds,
      cache: {
        ...cachedOutput.cache,
        hit: true,
      },
    });
    return attachTypedCommand(
      input.options?.includeCompiledRoute === false
        ? parsedCachedOutput
        : enrichCompiledRoutes(parsedCachedOutput, scoredPrompt, workspaceRoot, input.options?.surfaceHint, input.options?.compiledRouteTopOnly === true),
      scoredPrompt,
    );
  }

  const topK = input.options?.topK ?? 3;
  const result = scoreAdvisorPrompt(scoredPrompt, {
    workspaceRoot,
    confidenceThreshold: input.options?.confidenceThreshold,
    uncertaintyThreshold: input.options?.uncertaintyThreshold,
    runtimeLaneHealth: runtimeLaneHealthForStatus(status),
  });
  const recommendations = result.recommendations
    .map((recommendation) => publicRecommendation(
      recommendation,
      Boolean(input.options?.includeAttribution),
      scoredPrompt,
    ))
    .filter((recommendation): recommendation is NonNullable<typeof recommendation> => Boolean(recommendation))
    .slice(0, topK);
  const degradedLanes = result.metrics.degradedLanes ?? [];
  const warnings = outputWarnings(status, result);
  const abstainReasons = outputAbstainReasons(input, result);
  const output: AdvisorRecommendOutput = {
    workspaceRoot,
    effectiveThresholds,
    recommendations,
    ambiguous: result.ambiguous,
    freshness: status.freshness,
    trustState: status.trustState,
    generatedAt: new Date().toISOString(),
    cache: {
      hit: false,
      sourceSignaturePresent: status.generation > 0 || status.lastGenerationBump !== null,
    },
    _shadow: {
      model: 'advisor-shadow-learned-weights-v1',
      liveWeightsFrozen: true,
      recommendations: publicShadowRecommendations(result.recommendations, topK),
    },
    ...(degradedLanes.length > 0 ? {
      runtimeLaneHealth: {
        liveLaneCount: result.metrics.liveLaneCount,
        degradedLanes: [...degradedLanes],
      },
    } : {}),
    ...(warnings.length > 0 ? { warnings } : {}),
    ...(abstainReasons.length > 0 ? { abstainReasons } : {}),
  };
  const parsed = AdvisorRecommendOutputSchema.parse(output);
  if (shadowDeltaSinkEnabled()) {
    for (const shadow of parsed._shadow?.recommendations ?? []) {
      recordShadowDelta({
        prompt: `hmac:${key}`,
        recommendation: shadow.skillId,
        liveScore: shadow.liveScore,
        shadowScore: shadow.shadowScore,
        delta: shadow.delta,
        dominantLane: shadow.dominantShadowLane,
        timestamp: parsed.generatedAt,
      });
    }
  }
  advisorPromptCache.set({
    key,
    sourceSignature,
    value: parsed,
    skillLabels: recommendationLabels(parsed),
  });
  return attachTypedCommand(
    input.options?.includeCompiledRoute === false
      ? parsed
      : enrichCompiledRoutes(parsed, scoredPrompt, workspaceRoot, input.options?.surfaceHint, input.options?.compiledRouteTopOnly === true),
    scoredPrompt,
  );
}

// ───────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ───────────────────────────────────────────────────────────────────

export async function handleAdvisorRecommend(args: unknown): Promise<HandlerResponse> {
  const input = AdvisorRecommendInputSchema.parse(args);
  // A shared daemon decides from the environment it was started with and never
  // from the flags file, because a caller's own `0` must beat the file and only
  // the caller can see it.
  const data = disabledRecommendOutput(input, process.env, {}) ?? await computeRecommendationOutput(input);
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data }, null, 2),
    }],
  };
}

