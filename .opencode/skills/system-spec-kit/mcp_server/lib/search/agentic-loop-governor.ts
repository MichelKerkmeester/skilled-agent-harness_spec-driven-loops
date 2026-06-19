// ───────────────────────────────────────────────────────────────
// MODULE: Agentic Loop Governor
// ───────────────────────────────────────────────────────────────
// Bounded controller for the opt-in ReAct agentic recall strategy.
//
// An agentic recall path injects an LLM reason-act-observe loop into the
// memory_context retrieval flow. Left ungoverned, such a loop is two failure
// modes waiting to happen: an unbounded reasoning loop, and a cost/latency
// explosion. This module is the safety boundary built BEFORE any router wiring,
// so the loop is provably terminating before it is ever reachable.
//
// The controller advances a four-phase tool-rule DAG — Init -> Child ->
// Continue -> Terminal — and never returns a "completed" answer before reaching
// a terminal step. Termination is guaranteed three ways: a hard step-cap, a hard
// cost-ceiling, and a deterministic stop-condition (the agent emitting a
// final answer). At the step-cap it forces a best-effort final answer rather
// than hanging; on a tool/provider failure it aborts with the best partial
// context gathered so far. Tool dispatch is allowlist-gated, so the loop can
// only reach the memory tool surface it was explicitly granted.
//
// The governor is intentionally pure: the "agent" (LLM step provider) and the
// tool executor are injected. It performs no I/O, no wall-clock reads, and no
// randomness, so its bounds are unit-provable and its output is deterministic
// given deterministic inputs.

import { isAgenticRecallEnabled } from './search-flags.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES & CONSTANTS
──────────────────────────────────────────────────────────────── */

/** Tool-rule DAG phases. The loop never returns `final` before `terminal`. */
export type AgenticPhase = 'init' | 'child' | 'continue' | 'terminal';

/** A single structured agent decision: either call a tool, or answer. */
export type AgenticStep =
  | { readonly kind: 'tool_call'; readonly tool: string; readonly args?: Readonly<Record<string, unknown>> }
  | { readonly kind: 'final_answer'; readonly answer: unknown };

/** The recorded outcome of executing one tool call. */
export interface AgenticObservation {
  readonly tool: string;
  readonly ok: boolean;
  readonly result?: unknown;
  readonly error?: string;
}

/** Immutable snapshot handed to the step provider each iteration. */
export interface AgenticLoopState {
  readonly phase: AgenticPhase;
  /** Number of completed steps so far (0-based at the first decision). */
  readonly stepIndex: number;
  readonly costSpent: number;
  readonly observations: readonly AgenticObservation[];
}

/** The injected "agent" — emits the next step from the current state. */
export type AgenticStepProvider = (state: AgenticLoopState) => Promise<AgenticStep> | AgenticStep;

/** The injected, ACL-gated tool dispatcher. Throws to signal a tool failure. */
export type AgenticToolExecutor = (
  call: { readonly tool: string; readonly args?: Record<string, unknown> },
) => Promise<unknown> | unknown;

/** Per-step cost accounting. Defaults to 1 unit per step when omitted. */
export type AgenticCostFn = (step: AgenticStep, observation: AgenticObservation | null) => number;

/** Why the loop stopped — every terminal path is named. */
export type GovernorStopReason =
  | 'final_answer'   // agent emitted a terminal answer (clean stop)
  | 'step_cap'       // hit max steps; forced a best-effort final answer
  | 'cost_ceiling'   // hit the cost budget
  | 'tool_error'     // a tool call failed
  | 'acl_denied'     // agent tried a tool outside its granted surface
  | 'provider_error' // the step provider threw
  | 'flag_disabled'  // SPECKIT_AGENTIC_RECALL is off
  | 'empty_seed';    // nothing to work on

/** Terminal classification of the run. */
export type GovernorStatus =
  | 'final'         // reached a clean terminal answer
  | 'forced-final'  // bounded out (step-cap / cost-ceiling) with a best-effort answer
  | 'aborted'       // a failure stopped the loop; best partial returned
  | 'degraded'      // bounded out before any result — caller should fall back
  | 'disabled';     // flag off; loop never ran

export interface GovernorResult {
  readonly status: GovernorStatus;
  /** Best-effort final answer; null when no answer could be produced. */
  readonly answer: unknown;
  /** Terminal phase reached. */
  readonly phase: AgenticPhase;
  /** Steps actually executed. */
  readonly steps: number;
  readonly costSpent: number;
  readonly observations: readonly AgenticObservation[];
  readonly stopReason: GovernorStopReason;
}

export interface GovernorConfig {
  readonly stepProvider: AgenticStepProvider;
  readonly toolExecutor: AgenticToolExecutor;
  /** Hard step-cap. Clamped to [1, HARD_STEP_LIMIT] so it can never be unbounded. */
  readonly maxSteps?: number;
  /** Hard cost-ceiling. Clamped to a positive minimum. */
  readonly costCeiling?: number;
  /** Tools the loop is permitted to call. An empty/omitted set denies everything. */
  readonly allowedTools?: ReadonlySet<string>;
  /** Per-step cost; default 1 unit/step. */
  readonly costFn?: AgenticCostFn;
  /** Best-effort answer used when the loop is forced to terminate without one. */
  readonly seedAnswer?: unknown;
  /**
   * Run even though the runtime flag is off. For tests and explicit programmatic
   * callers only; the production handler path leaves this unset so the flag gates.
   */
  readonly bypassFlagGate?: boolean;
}

/** Default step-cap when a caller does not specify one. */
export const DEFAULT_MAX_STEPS = 4;

/** Default cost-ceiling (abstract cost units) when a caller does not specify one. */
export const DEFAULT_COST_CEILING = 10_000;

/**
 * Absolute upper bound on steps regardless of caller config. A misconfigured
 * huge maxSteps still cannot run away — the loop is structurally bounded.
 */
export const HARD_STEP_LIMIT = 32;

/** Default cost: one unit per step. */
const DEFAULT_COST_FN: AgenticCostFn = () => 1;

/* ───────────────────────────────────────────────────────────────
   2. BOUNDS NORMALIZATION
──────────────────────────────────────────────────────────────── */

/** Clamp the step-cap into [1, HARD_STEP_LIMIT]; non-finite/<=0 falls back to 1. */
function normalizeMaxSteps(raw: number | undefined): number {
  const value = typeof raw === 'number' && Number.isFinite(raw) ? Math.floor(raw) : DEFAULT_MAX_STEPS;
  if (value < 1) return 1;
  if (value > HARD_STEP_LIMIT) return HARD_STEP_LIMIT;
  return value;
}

/** Clamp the cost-ceiling to a positive finite value. */
function normalizeCostCeiling(raw: number | undefined): number {
  const value = typeof raw === 'number' && Number.isFinite(raw) ? raw : DEFAULT_COST_CEILING;
  return value > 0 ? value : DEFAULT_COST_CEILING;
}

/* ───────────────────────────────────────────────────────────────
   3. RESULT BUILDERS
──────────────────────────────────────────────────────────────── */

/** Best-effort answer when forced to terminate: seed, else last good result, else null. */
function bestEffortAnswer(seedAnswer: unknown, observations: readonly AgenticObservation[]): unknown {
  if (seedAnswer !== undefined) return seedAnswer;
  for (let i = observations.length - 1; i >= 0; i--) {
    const obs = observations[i];
    if (obs.ok && obs.result !== undefined) return obs.result;
  }
  return null;
}

/* ───────────────────────────────────────────────────────────────
   4. GOVERNOR
──────────────────────────────────────────────────────────────── */

/**
 * Run the bounded agentic loop.
 *
 * Guarantees (structural, not disciplinary):
 * - Returns within `min(maxSteps, HARD_STEP_LIMIT)` provider invocations.
 * - Never exceeds the cost-ceiling without terminating.
 * - Never returns `final` before a terminal step; a forced stop is labelled
 *   `forced-final` / `degraded`, never silently dressed up as a clean answer.
 * - Never throws: provider/tool failures become a typed `aborted` result with
 *   the best partial context gathered so far.
 */
export async function runAgenticLoop(config: GovernorConfig): Promise<GovernorResult> {
  // Fail-closed: the agentic path is unreachable unless explicitly enabled.
  if (!config.bypassFlagGate && !isAgenticRecallEnabled()) {
    return {
      status: 'disabled',
      answer: null,
      phase: 'init',
      steps: 0,
      costSpent: 0,
      observations: [],
      stopReason: 'flag_disabled',
    };
  }

  const maxSteps = normalizeMaxSteps(config.maxSteps);
  const costCeiling = normalizeCostCeiling(config.costCeiling);
  const allowedTools = config.allowedTools ?? new Set<string>();
  const costFn = config.costFn ?? DEFAULT_COST_FN;

  const observations: AgenticObservation[] = [];
  let phase: AgenticPhase = 'init';
  let costSpent = 0;
  let stepIndex = 0;

  while (stepIndex < maxSteps) {
    // Init advances to Child on the first decision, then Continue thereafter.
    phase = stepIndex === 0 ? 'child' : 'continue';

    let step: AgenticStep;
    try {
      step = await config.stepProvider({ phase, stepIndex, costSpent, observations });
    } catch {
      return {
        status: 'aborted',
        answer: bestEffortAnswer(config.seedAnswer, observations),
        phase: 'terminal',
        steps: stepIndex,
        costSpent,
        observations,
        stopReason: 'provider_error',
      };
    }

    // Terminal stop-condition: the agent chose to answer.
    if (step.kind === 'final_answer') {
      costSpent += costFn(step, null);
      return {
        status: 'final',
        answer: step.answer,
        phase: 'terminal',
        steps: stepIndex,
        costSpent,
        observations,
        stopReason: 'final_answer',
      };
    }

    // The reasoning that produced this tool call is the expensive part (the LLM
    // turn), so charge it up front — before the tool runs. This makes the
    // cost-ceiling reachable even when no tool result is ever gathered.
    costSpent += costFn(step, null);

    // ACL gate: a tool outside the granted surface is a hard stop.
    if (!allowedTools.has(step.tool)) {
      observations.push({ tool: step.tool, ok: false, error: 'acl_denied' });
      return {
        status: 'aborted',
        answer: bestEffortAnswer(config.seedAnswer, observations),
        phase: 'terminal',
        steps: stepIndex,
        costSpent,
        observations,
        stopReason: 'acl_denied',
      };
    }

    // Budget exhausted by reasoning. With no results yet this is a graceful
    // degrade (caller falls back to the deterministic path); mid-run it forces
    // a best-effort final answer from the partial context already gathered.
    if (costSpent >= costCeiling) {
      const degraded = observations.length === 0;
      return {
        status: degraded ? 'degraded' : 'forced-final',
        answer: degraded ? (config.seedAnswer ?? null) : bestEffortAnswer(config.seedAnswer, observations),
        phase: 'terminal',
        steps: stepIndex,
        costSpent,
        observations,
        stopReason: 'cost_ceiling',
      };
    }

    let observation: AgenticObservation;
    try {
      const result = await config.toolExecutor({ tool: step.tool, args: step.args ? { ...step.args } : undefined });
      observation = { tool: step.tool, ok: true, result };
    } catch (error: unknown) {
      observation = { tool: step.tool, ok: false, error: error instanceof Error ? error.message : String(error) };
      observations.push(observation);
      return {
        status: 'aborted',
        answer: bestEffortAnswer(config.seedAnswer, observations),
        phase: 'terminal',
        steps: stepIndex + 1,
        costSpent,
        observations,
        stopReason: 'tool_error',
      };
    }

    observations.push(observation);
    stepIndex += 1;
  }

  // Step-cap reached without a terminal answer: force a best-effort final answer.
  return {
    status: 'forced-final',
    answer: bestEffortAnswer(config.seedAnswer, observations),
    phase: 'terminal',
    steps: stepIndex,
    costSpent,
    observations,
    stopReason: 'step_cap',
  };
}
