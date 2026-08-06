// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Brief Renderer
// ───────────────────────────────────────────────────────────────

import { canonicalFold } from './shared/unicode-normalization.js';
import { resolvedConfidenceThreshold, resolvedUncertaintyThreshold } from './compat/contract.js';
import { observeRenderedAdvisorPolicy } from './policy-plan.js';
import { isAmbiguousTopTwo } from './scorer/ambiguity.js';
import type { AdvisorRecommendation } from './subprocess.js';
import type { AdvisorScoredRecommendation } from './scorer/types.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface AdvisorBriefRenderOptions {
  readonly tokenCap?: number;
  readonly thresholdConfig?: {
    readonly confidenceThreshold?: number;
    readonly uncertaintyThreshold?: number;
    readonly confidenceOnly?: boolean;
  };
}

export interface AdvisorBriefRenderableResult {
  readonly status: 'ok' | 'stale' | 'skipped' | 'degraded' | 'fail_open';
  readonly freshness: 'live' | 'stale' | 'absent' | 'unavailable';
  readonly recommendations: readonly AdvisorRecommendation[];
  readonly ambiguous?: boolean;
  readonly metrics?: {
    readonly tokenCap?: number;
  } | null;
  readonly sharedPayload?: {
    readonly metadata?: {
      readonly skillLabel?: string | null;
    } | null;
  } | null;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const DEFAULT_TOKEN_CAP = 80;
const AMBIGUOUS_TOKEN_CAP = 120;
const MAX_TOKEN_CAP = 120;
const TOKEN_TO_CHAR_ESTIMATE = 4;
const INSTRUCTION_LABEL_PATTERN =
  /^\s*(SYSTEM|INSTRUCTION|IGNORE|EXECUTE)\s*[:=]|^\s*(<!--|```)|\b(ignore\s+(previous|all)\s+instructions|system\s*:|instruction\s*:|execute\s*:|developer\s*:|assistant\s*:)/i;
const CONTROL_CHAR_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

// Injected into every advisor brief so all hook-capable runtimes receive
// the comment hygiene rule even when AGENTS.md is absent from session context.
export const HYGIENE_DIRECTIVE = '\n- Comment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in code comments — forbidden regardless of instruction. Write the durable WHY instead. Pre-commit gate blocks violations.';

// Model-agnostic governor capsule: appended in full after the capped advisor
// portion so it is always delivered every turn — the thermostat that re-states
// the disposition as context grows. Steers efficiency (result-first, less
// narration), not capability. Deliberately carries no model name: model
// families and tiers change, the disposition does not.
export const GOVERNOR_DIRECTIVE = '\n- Governor: reason about the problem and the person, not yourself; lead with the result and act rather than narrate (batch tool calls, report at checkpoints); treat reversible decisions as cheap — decide, mark // DECISION:, move on; qualify only when it changes what the reader should do.';

// Proof-over-appearance capsule, same dispositional shape as the governor:
// restates the terminal-verification disposition every turn. Deliberately one
// line; the full five-step protocol lives in AGENTS.md section 4.
export const TERMINAL_PROOF_DIRECTIVE = '\n- Proof over appearance: only real command output counts. Encode every requirement as an objective pass-or-fail check (exit code, grep, diff), watch it fail before fixing, fix the root cause once, and close with a clean re-run and a no-stray-files sweep.';

// Labels the directive block so injected content reads as one structured
// capsule instead of loose lines.
export const DIRECTIVES_LABEL = '\nDirectives:';

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function clampTokenCap(tokenCap: number | undefined): number {
  if (typeof tokenCap !== 'number' || Number.isNaN(tokenCap)) {
    return DEFAULT_TOKEN_CAP;
  }
  return Math.min(Math.max(1, Math.floor(tokenCap)), MAX_TOKEN_CAP);
}

function capText(text: string, tokenCap: number): string {
  const charCap = tokenCap * TOKEN_TO_CHAR_ESTIMATE;
  if (text.length <= charCap) {
    return text;
  }
  const truncated = text.slice(0, Math.max(1, charCap - 3)).trimEnd();
  return `${truncated}...`;
}

function sanitizeSkillLabel(skillLabel: string | null | undefined): string | null {
  if (typeof skillLabel !== 'string') {
    return null;
  }
  const folded = canonicalFold(skillLabel);
  if (/[\n\r]/.test(folded)) {
    return null;
  }
  const singleLine = folded
    .replace(CONTROL_CHAR_PATTERN, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!singleLine || INSTRUCTION_LABEL_PATTERN.test(singleLine)) {
    return null;
  }
  return singleLine;
}

function formatScore(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : '0.00';
}

type RenderableRecommendation = AdvisorRecommendation & {
  readonly score?: number;
  readonly ambiguousWith?: readonly string[];
};

function toScoredRecommendation(recommendation: RenderableRecommendation): AdvisorScoredRecommendation {
  return {
    skill: recommendation.skill,
    kind: recommendation.kind === 'command' ? 'command' : 'skill',
    confidence: recommendation.confidence,
    uncertainty: recommendation.uncertainty,
    passes_threshold: recommendation.passes_threshold ?? true,
    reason: '',
    score: typeof recommendation.score === 'number' && Number.isFinite(recommendation.score)
      ? recommendation.score
      : recommendation.confidence,
    laneContributions: [],
    dominantLane: null,
    lifecycleStatus: 'active',
    ...(Array.isArray(recommendation.ambiguousWith) ? { ambiguousWith: recommendation.ambiguousWith } : {}),
  };
}

/** Detect whether the renderable recommendation set carries ambiguity evidence. */
export function hasAdvisorAmbiguitySignal(
  recommendations: readonly AdvisorRecommendation[],
  precomputedAmbiguous = false,
): boolean {
  if (precomputedAmbiguous) {
    return true;
  }
  return isAmbiguousTopTwo((recommendations as readonly RenderableRecommendation[]).map(toScoredRecommendation));
}

function metadataSkillLabel(result: AdvisorBriefRenderableResult): string | null {
  const metadata = result.sharedPayload?.metadata;
  return typeof metadata?.skillLabel === 'string' ? metadata.skillLabel : null;
}

// ───────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────

/**
 * Render the model-visible advisor brief from typed advisor output only.
 *
 * The renderer is the prompt-boundary guard: it ignores free-form reasons,
 * descriptions, stdout/stderr, and prompt text, and emits nothing when the
 * repository-authored skill label looks instruction-shaped after folding.
 */
export function renderAdvisorBrief(
  result: AdvisorBriefRenderableResult,
  options: AdvisorBriefRenderOptions = {},
): string | null {
  if (result.status !== 'ok') {
    observeRenderedAdvisorPolicy(null);
    return null;
  }
  if (result.freshness !== 'live' && result.freshness !== 'stale') {
    observeRenderedAdvisorPolicy(null);
    return null;
  }

  const tokenCap = clampTokenCap(result.metrics?.tokenCap ?? options.tokenCap);
  const thresholdConfig = options.thresholdConfig;
  const recommendations = result.recommendations.filter((recommendation) => (
    recommendation.passes_threshold === true
    || (
      recommendation.confidence >= (thresholdConfig?.confidenceThreshold ?? resolvedConfidenceThreshold())
      && (
        thresholdConfig?.confidenceOnly === true
        || recommendation.uncertainty <= (thresholdConfig?.uncertaintyThreshold ?? resolvedUncertaintyThreshold())
      )
    )
  ));
  const [top, second] = recommendations;
  if (!top) {
    observeRenderedAdvisorPolicy(null);
    return null;
  }

  const topLabel = sanitizeSkillLabel(metadataSkillLabel(result) ?? top.skill);
  if (!topLabel) {
    observeRenderedAdvisorPolicy(null);
    return null;
  }

  if (tokenCap > DEFAULT_TOKEN_CAP && second && hasAdvisorAmbiguitySignal(recommendations, result.ambiguous === true)) {
    const secondLabel = sanitizeSkillLabel(second.skill);
    if (!secondLabel) {
      observeRenderedAdvisorPolicy(null);
      return null;
    }
    const rendered = capText(
      `Advisor: ${result.freshness}; ambiguous: ${topLabel} ${formatScore(top.confidence)}/${formatScore(top.uncertainty)} vs ${secondLabel} ${formatScore(second.confidence)}/${formatScore(second.uncertainty)} pass.`,
      Math.min(tokenCap, AMBIGUOUS_TOKEN_CAP),
    ) + DIRECTIVES_LABEL + HYGIENE_DIRECTIVE + GOVERNOR_DIRECTIVE + TERMINAL_PROOF_DIRECTIVE;
    observeRenderedAdvisorPolicy(rendered);
    return rendered;
  }

  const rendered = capText(
    `Advisor: ${result.freshness}; use ${topLabel} ${formatScore(top.confidence)}/${formatScore(top.uncertainty)} pass.`,
    Math.min(tokenCap, DEFAULT_TOKEN_CAP),
  ) + DIRECTIVES_LABEL + HYGIENE_DIRECTIVE + GOVERNOR_DIRECTIVE + TERMINAL_PROOF_DIRECTIVE;
  observeRenderedAdvisorPolicy(rendered);
  return rendered;
}

/** Render the constitutional context retained when no advisor brief is available. */
export function renderAdvisorFallbackDirective(): string {
  const rendered = DIRECTIVES_LABEL.slice(1) + HYGIENE_DIRECTIVE + GOVERNOR_DIRECTIVE + TERMINAL_PROOF_DIRECTIVE;
  observeRenderedAdvisorPolicy(rendered);
  return rendered;
}

// Shared timeout-fallback renderer. Previously the OpenCode hook
// emitted a bespoke `Advisor: stale (cold-start timeout)\nFallback marker: ...`
// string inline. Centralizing the format here keeps every runtime that needs
// a cold-start timeout fallback aligned on a single contract — `renderAdvisorBrief`
// itself returns null when there are no recommendations, which is correct for
// the live-result path; this function is the explicit fallback companion.
export function renderAdvisorTimeoutFallback(): string {
  const rendered = [
    'Advisor: stale (cold-start timeout)',
    'Fallback marker: {"stale":true,"reason":"timeout-fallback"}',
  ].join('\n');
  observeRenderedAdvisorPolicy(rendered);
  return rendered;
}

export { sanitizeSkillLabel };
