// ───────────────────────────────────────────────────────────────
// MODULE: Executor Delegation Resolver
// ───────────────────────────────────────────────────────────────

// Resolves prompts that explicitly delegate to a CLI executor (an OpenCode /
// Claude Code orchestrator, or one of the small-model executors that dispatch
// through one) and forces that executor to the top of the ranking.
//
// Two durable design choices:
//   1. The override is applied POST-FUSION. A pre-clamp explicit-lane penalty
//      cannot carry the negative evidence this needs: the explicit lane clamps
//      each skill at 1, so a delegation framing that saturates the code hub
//      (repeated "opencode" tokens + author matches) hides any small penalty
//      under the clamp. Re-lifting the executor and capping the code hub AFTER
//      confidence/uncertainty are settled is the only place the decision can be
//      expressed cleanly and reversibly.
//   2. The alias table is derived from METADATA, not hardcoded. Active executor
//      aliases come from the cli-family projection (each executor's intent
//      signals + derived trigger phrases + name variants); model aliases come
//      from the shared model-profile registry; a retired executor's aliases
//      come from its archived graph metadata. Adding a new executor, a new
//      small model, or retiring one needs no change here.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { matchesPhraseBoundary, phraseVariants, skillNameVariants } from './text.js';
import type {
  AdvisorProjection,
  AdvisorScoredRecommendation,
  SkillLifecycleStatus,
} from './types.js';

// The code hub is the fallback a bare executor framing otherwise saturates; it
// is the one skill this resolver deliberately demotes so the executor wins.
const CODE_HUB_SKILL_ID = 'sk-code';

// The cli-external-orchestration parent hub. After
// the cli-opencode/cli-claude-code fold-in, this is the only top-level
// family:'cli' projection entry — a non-executor hub identity that must never
// win a delegation route or survive an abstain suppression pass.
const CLI_HUB_SKILL_ID = 'cli-external-orchestration';

// A route lift must clear the strict dual threshold and sit clearly above the
// capped code hub so the executor is the unambiguous top.
const ROUTE_CONFIDENCE = 0.95;
const ROUTE_UNCERTAINTY = 0.2;
const CODE_HUB_CONFIDENCE_CAP = 0.88;

// Generic single tokens that appear in executor metadata as domain/topic labels
// rather than delegation cues. They would over-match general prompts, so they
// are never treated as executor aliases.
const ALIAS_STOPLIST: ReadonlySet<string> = new Set([
  'cli',
  'delegation',
  'cross-ai',
  'cross ai',
  'reasoning',
  'code-editing',
  'code editing',
  'code-generation',
  'code generation',
  'web-research',
  'web research',
  'parallel-sessions',
  'parallel sessions',
]);

// Delegation cues pair with an orchestrator noun to catch non-literal framings
// ("ask OpenCode …", "an OpenCode second opinion", "a small-model executor").
const DELEGATION_CUES = /\b(use|delegate to|ask|run|invoke|dispatch|hand off to|second opinion|small[- ]model)\b/;

// The negative guard forces NON-delegation. "opencode {standards|route|…}" and a
// bare ".opencode/" path are the code hub's own opencode surface, not an
// executor handoff, so they must never lift an executor.
const NEGATIVE_GUARD = /\bopencode[-\s]?(standards|route|skill|agent|plugin|command|convention)\b|\.opencode\//;

/** One resolved delegation decision. */
export interface ExecutorDelegation {
  /** The executor skill id, e.g. 'cli-opencode' | 'cli-claude-code'. Null when suppressed-only. */
  readonly executorSkillId: string | null;
  /** 'route'   -> lift executorSkillId to the top and suppress code-hub re-saturation.
   *  'abstain' -> archived/retired executor named: suppress the code-hub fallback, lift nothing. */
  readonly action: 'route' | 'abstain';
  /** The matched alias + the delegation cue, for evidence/reason strings. */
  readonly evidence: string;
}

/** Alias tables built once from metadata. */
export interface ExecutorAliasTable {
  /** alias phrase -> active executor skill id. */
  readonly activeAliases: ReadonlyMap<string, string>;
  /** alias phrases of retired/archived executors (suppress, never route). */
  readonly suppressedAliases: ReadonlySet<string>;
  /** orchestrator noun -> active executor skill id (used only with a delegation cue). */
  readonly orchestratorNouns: ReadonlyMap<string, string>;
  /** Live executor-kind ids sourced from cli-external-orchestration's mode-registry.json. */
  readonly activeExecutorIds: ReadonlySet<string>;
  readonly delegationCues: RegExp;
  readonly negativeGuard: RegExp;
}

/** Context for the fusion-tail override helper. */
export interface ExecutorDelegationContext {
  readonly promptLower: string;
  readonly projection: AdvisorProjection;
  readonly workspaceRoot: string | undefined;
  readonly confidenceThreshold: number;
  readonly uncertaintyThreshold: number;
}

interface ModelExecutorEntry {
  readonly executor?: unknown;
  readonly status?: unknown;
}

interface ModelProfileEntry {
  readonly id?: unknown;
  readonly executors?: unknown;
  readonly capability?: { readonly model_slug?: unknown } | unknown;
}

interface ArchivedGraphMetadata {
  readonly family?: unknown;
  readonly intent_signals?: unknown;
  readonly derived?: { readonly trigger_phrases?: unknown } | unknown;
}

// The cli-external-orchestration hub's mode-registry.json packets (keyed by
// packetSkillName), NOT the top-level family==='cli' projection filter, are
// the executor-delegation scorer's source of truth. After the fold-in,
// cli-opencode/cli-claude-code are workflow modes nested under one hub
// identity, not separate top-level projection skills, and the hub's folded
// graph-metadata has no per-mode alias granularity — so per-executor alias
// phrases must come from the registry's own per-mode `aliases[]`, not from
// projection.skills[].intentSignals/derivedTriggers.
interface CliHubModeEntry {
  readonly packetKind?: unknown;
  readonly packetSkillName?: unknown;
  readonly aliases?: unknown;
}

interface CliHubRegistry {
  readonly modes?: unknown;
}

/** One cli-external-orchestration workflow-mode executor, sourced from mode-registry.json. */
interface HubExecutorEntry {
  readonly id: string;
  readonly aliases: readonly string[];
}

/** Filesystem-derived alias data (model registry + archived executors + hub executors). */
interface FilesystemAliasData {
  readonly modelAliases: ReadonlyMap<string, string>;
  readonly suppressedAliases: ReadonlySet<string>;
  readonly hubExecutors: readonly HubExecutorEntry[];
}

// Reads cli-external-orchestration's mode-registry.json workflow-mode packets as the
// executor-delegation source of truth. A missing or malformed
// registry degrades to zero hub executors, never a hard failure — mirrors the
// model_profiles.json degrade-on-error convention below.
function loadCliHubExecutors(skillsRoot: string): HubExecutorEntry[] {
  const registryPath = join(skillsRoot, 'cli-external-orchestration', 'mode-registry.json');
  const executors: HubExecutorEntry[] = [];
  try {
    if (existsSync(registryPath)) {
      const parsed = JSON.parse(readFileSync(registryPath, 'utf8')) as CliHubRegistry;
      const modes = Array.isArray(parsed.modes) ? (parsed.modes as CliHubModeEntry[]) : [];
      for (const mode of modes) {
        if (mode.packetKind !== 'workflow' || typeof mode.packetSkillName !== 'string') continue;
        executors.push({ id: mode.packetSkillName, aliases: stringArray(mode.aliases) });
      }
    }
  } catch {
    // A malformed hub registry degrades to zero hub executors, never a hard failure.
  }
  return executors;
}

// The filesystem read (model registry + archived metadata) is workspace-derived
// and projection-independent, so it is memoized by workspace root. The
// projection-derived active aliases are cheap (a handful of cli-family skills)
// and are recomputed per call so a fixture projection never contaminates the
// real one under a shared workspace root.
const filesystemAliasCache = new Map<string, FilesystemAliasData>();

function isAliasShaped(alias: string): boolean {
  if (!alias) return false;
  if (ALIAS_STOPLIST.has(alias)) return false;
  // Drop file-path-shaped and doc-name entities that leak in as metadata.
  if (alias.includes('/') && alias.includes('.')) return false;
  return true;
}

function aliasVariantsOf(phrase: string): string[] {
  return phraseVariants(phrase).filter((variant) => isAliasShaped(variant));
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
}

function loadFilesystemAliasData(workspaceRoot: string | undefined): FilesystemAliasData {
  const cacheKey = workspaceRoot ?? '';
  const cached = filesystemAliasCache.get(cacheKey);
  if (cached) return cached;

  const skillsRoot = join(workspaceRoot ?? process.cwd(), '.opencode', 'skills');
  const modelAliases = new Map<string, string>();
  const suppressedAliases = new Set<string>();

  // Model -> executor aliases from the shared small-model profile registry.
  // Only active executor paths lift; an optional/unverified path is recorded
  // nowhere so a bare model mention never auto-routes to it.
  const modelProfilesPath = join(skillsRoot, 'sk-prompt', 'prompt-models', 'assets', 'model-profiles.json');
  try {
    if (existsSync(modelProfilesPath)) {
      const parsed = JSON.parse(readFileSync(modelProfilesPath, 'utf8')) as { models?: unknown };
      const models = Array.isArray(parsed.models) ? (parsed.models as ModelProfileEntry[]) : [];
      for (const model of models) {
        const executors = Array.isArray(model.executors) ? (model.executors as ModelExecutorEntry[]) : [];
        const activeExecutor = executors.find((entry) => entry.status === 'active');
        if (!activeExecutor || typeof activeExecutor.executor !== 'string') continue;
        const executorId = activeExecutor.executor;
        const modelPhrases: string[] = [];
        if (typeof model.id === 'string') modelPhrases.push(model.id);
        const capability = model.capability;
        if (capability && typeof capability === 'object' && 'model_slug' in capability) {
          const slug = (capability as { model_slug?: unknown }).model_slug;
          if (typeof slug === 'string') modelPhrases.push(slug);
        }
        for (const phrase of modelPhrases) {
          for (const variant of aliasVariantsOf(phrase)) {
            if (!modelAliases.has(variant)) modelAliases.set(variant, executorId);
          }
        }
      }
    }
  } catch {
    // A malformed registry degrades to no model aliases, never a hard failure.
  }

  // Retired/archived executor aliases. Any archived cli-family skill's declared
  // triggers become a suppressed set so "use codex …" abstains instead of
  // falling back to the code hub.
  const archiveRoot = join(skillsRoot, 'z_archive');
  try {
    if (existsSync(archiveRoot)) {
      for (const entry of readdirSync(archiveRoot, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const metadataPath = join(archiveRoot, entry.name, 'graph-metadata.json');
        if (!existsSync(metadataPath)) continue;
        let metadata: ArchivedGraphMetadata;
        try {
          metadata = JSON.parse(readFileSync(metadataPath, 'utf8')) as ArchivedGraphMetadata;
        } catch {
          continue;
        }
        if (metadata.family !== 'cli') continue;
        const derived = metadata.derived && typeof metadata.derived === 'object'
          ? (metadata.derived as { trigger_phrases?: unknown })
          : {};
        const phrases = [
          ...stringArray(metadata.intent_signals),
          ...stringArray(derived.trigger_phrases),
        ];
        for (const phrase of phrases) {
          for (const variant of aliasVariantsOf(phrase)) {
            suppressedAliases.add(variant);
          }
        }
      }
    }
  } catch {
    // No archive (or unreadable) simply means an empty suppressed set.
  }

  const hubExecutors = loadCliHubExecutors(skillsRoot);

  const data: FilesystemAliasData = { modelAliases, suppressedAliases, hubExecutors };
  filesystemAliasCache.set(cacheKey, data);
  return data;
}

/**
 * Build (memoized filesystem part) the alias tables from metadata.
 *
 * Executors are enumerated from
 * cli-external-orchestration's mode-registry.json workflow-mode packets (keyed by
 * packetSkillName), NOT the top-level `family === 'cli'` projection filter.
 * After the cli-opencode/cli-claude-code fold-in, that filter would select
 * the HUB (cli-external-orchestration) instead of the two leaf executors — the hub's
 * folded graph-metadata carries the union of both modes' signals with no
 * per-mode attribution, so a projection-filter read would (a) map every
 * folded alias to the non-executor id 'cli-external-orchestration', and (b) derive the
 * orchestrator noun 'external' from the hub id. Sourcing from the registry's
 * per-mode `aliases[]` instead avoids both failure modes, and no noun is
 * ever derived from the hub id itself (only from each mode's
 * packetSkillName), so 'external' never enters `orchestratorNouns`.
 * `projection` is kept for API compatibility with existing callers; hub
 * executor resolution no longer depends on it.
 */
export function buildExecutorAliasTable(
  projection: AdvisorProjection,
  workspaceRoot: string | undefined,
): ExecutorAliasTable {
  const filesystem = loadFilesystemAliasData(workspaceRoot);
  const activeAliases = new Map<string, string>();
  const orchestratorNouns = new Map<string, string>();

  const activeExecutorIds = new Set(filesystem.hubExecutors.map((executor) => executor.id));

  for (const executor of filesystem.hubExecutors) {
    // Author-declared delegation vocabulary only: name variants + the
    // registry's own per-mode aliases[]. Unlike the pre-dissolution
    // projection read, the hub's graph-metadata folds both modes' intent
    // signals into one union, so per-mode phrases now come from
    // mode-registry.json instead of projection.skills[].intentSignals /
    // .derivedTriggers.
    const phrases = [
      ...skillNameVariants(executor.id),
      ...executor.aliases,
    ];
    for (const phrase of phrases) {
      for (const variant of aliasVariantsOf(phrase)) {
        if (!activeAliases.has(variant)) activeAliases.set(variant, executor.id);
      }
    }
    // Orchestrator noun derived ONLY from each mode's packetSkillName
    // ("cli-opencode" -> "opencode", "cli-claude-code" -> "claude-code"/
    // "claude code") — never from the hub id, so 'external' never enters
    // this table.
    const noun = executor.id.replace(/^cli-/, '');
    if (noun && noun !== executor.id) {
      orchestratorNouns.set(noun, executor.id);
      const spaced = noun.replace(/-/g, ' ');
      if (spaced !== noun) orchestratorNouns.set(spaced, executor.id);
    }
  }

  // Model aliases back-stop the registry: any active model whose executor is
  // a routable cli-external-orchestration mode contributes its aliases even if the
  // executor's registry aliases[] has not yet been re-synced with that model.
  for (const [alias, executorId] of filesystem.modelAliases) {
    if (!activeExecutorIds.has(executorId)) continue;
    if (!activeAliases.has(alias)) activeAliases.set(alias, executorId);
  }

  return {
    activeAliases,
    suppressedAliases: filesystem.suppressedAliases,
    orchestratorNouns,
    activeExecutorIds,
    delegationCues: DELEGATION_CUES,
    negativeGuard: NEGATIVE_GUARD,
  };
}

function longestPhraseMatch(promptLower: string, phrases: Iterable<[string, string]>): { phrase: string; value: string } | null {
  let best: { phrase: string; value: string } | null = null;
  for (const [phrase, value] of phrases) {
    if (!matchesPhraseBoundary(promptLower, phrase)) continue;
    if (!best || phrase.length > best.phrase.length) best = { phrase, value };
  }
  return best;
}

/** Pure detector: returns a delegation decision or null (no delegation present). */
export function resolveExecutorDelegation(
  promptLower: string,
  table: ExecutorAliasTable,
): ExecutorDelegation | null {
  // Highest precedence: the code hub's opencode surface is not a handoff.
  if (table.negativeGuard.test(promptLower)) return null;

  // A retired executor named explicitly must abstain, never fall back.
  for (const alias of table.suppressedAliases) {
    if (matchesPhraseBoundary(promptLower, alias)) {
      return { executorSkillId: null, action: 'abstain', evidence: `suppressed-executor:${alias}` };
    }
  }

  // A direct, unambiguous alias routes without needing a separate cue.
  const directMatch = longestPhraseMatch(promptLower, table.activeAliases.entries());
  if (directMatch) {
    return { executorSkillId: directMatch.value, action: 'route', evidence: `executor-alias:${directMatch.phrase}` };
  }

  // Otherwise an orchestrator noun co-occurring with a delegation cue routes.
  if (table.delegationCues.test(promptLower)) {
    const orchestratorMatch = longestPhraseMatch(promptLower, table.orchestratorNouns.entries());
    if (orchestratorMatch) {
      return {
        executorSkillId: orchestratorMatch.value,
        action: 'route',
        evidence: `executor-orchestrator:${orchestratorMatch.phrase}`,
      };
    }
  }

  return null;
}

function appendEvidence(reason: string, evidence: string): string {
  const note = `[delegation: ${evidence}]`;
  return reason.includes(note) ? reason : `${reason} ${note}`.trim();
}

function synthesizeExecutorRecommendation(
  executorId: string,
  projection: AdvisorProjection,
  ranked: readonly AdvisorScoredRecommendation[],
  evidence: string,
): AdvisorScoredRecommendation {
  const projectionSkill = projection.skills.find((skill) => skill.id === executorId);
  const kind: AdvisorScoredRecommendation['kind'] = projectionSkill?.kind ?? 'skill';
  const lifecycleStatus: SkillLifecycleStatus = projectionSkill?.lifecycleStatus ?? 'active';
  const topScore = ranked.reduce((max, rec) => Math.max(max, rec.score), 0);
  return {
    skill: executorId,
    kind,
    confidence: ROUTE_CONFIDENCE,
    uncertainty: ROUTE_UNCERTAINTY,
    passes_threshold: true,
    reason: appendEvidence('Executor delegation resolved', evidence),
    score: topScore,
    laneContributions: [],
    dominantLane: null,
    lifecycleStatus,
  };
}

/**
 * Post-fusion override. Lifts a metadata-resolved executor to the top (or
 * abstains for a retired one). Returns `ranked` unchanged on the common path
 * where no delegation is present, so it is a no-op on every non-delegation
 * prompt.
 */
export function applyExecutorDelegationOverride(
  ranked: readonly AdvisorScoredRecommendation[],
  ctx: ExecutorDelegationContext,
): AdvisorScoredRecommendation[] {
  const table = buildExecutorAliasTable(ctx.projection, ctx.workspaceRoot);
  const decision = resolveExecutorDelegation(ctx.promptLower, table);
  if (!decision) return [...ranked];

  if (decision.action === 'abstain') {
    // A named retired executor cannot be honored and must not silently reroute:
    // suppress the code-hub fallback, every live cli-external-orchestration executor mode
    // (sourced from table.activeExecutorIds, the hub's
    // mode-registry.json, not a projection family scan — cli-opencode/
    // cli-claude-code are no longer separate top-level projection skills),
    // and the non-executor hub identity itself (cli-external-orchestration must never win a
    // fallback route, same invariant as the route path below). Whatever
    // non-executor skill legitimately passes becomes the top, else none.
    const suppressed = new Set<string>([CODE_HUB_SKILL_ID, CLI_HUB_SKILL_ID, ...table.activeExecutorIds]);
    return ranked.map((rec) => (
      suppressed.has(rec.skill) ? { ...rec, passes_threshold: false } : rec
    ));
  }

  const executorId = decision.executorSkillId;
  if (executorId === null) return [...ranked];

  const rest: AdvisorScoredRecommendation[] = [];
  let executorRec: AdvisorScoredRecommendation | null = null;
  for (const rec of ranked) {
    if (rec.skill === executorId) {
      executorRec = {
        ...rec,
        confidence: Math.max(rec.confidence, ROUTE_CONFIDENCE),
        uncertainty: Math.min(rec.uncertainty, ROUTE_UNCERTAINTY),
        passes_threshold: ROUTE_CONFIDENCE >= ctx.confidenceThreshold && ROUTE_UNCERTAINTY <= ctx.uncertaintyThreshold,
        reason: appendEvidence(rec.reason, decision.evidence),
      };
      continue;
    }
    // Cap the code hub so it cannot out-rank or tie the resolved executor.
    rest.push(
      rec.skill === CODE_HUB_SKILL_ID
        ? { ...rec, confidence: Math.min(rec.confidence, CODE_HUB_CONFIDENCE_CAP) }
        : rec,
    );
  }

  if (executorRec === null) {
    // Injection-if-absent: the harder orchestrator framings never surface the
    // executor as a candidate, so synthesize it to actually resolve the route.
    executorRec = synthesizeExecutorRecommendation(executorId, ctx.projection, ranked, decision.evidence);
    executorRec = {
      ...executorRec,
      passes_threshold: ROUTE_CONFIDENCE >= ctx.confidenceThreshold && ROUTE_UNCERTAINTY <= ctx.uncertaintyThreshold,
    };
  }

  return [executorRec, ...rest];
}
