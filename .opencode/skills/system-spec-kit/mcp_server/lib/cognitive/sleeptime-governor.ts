// ───────────────────────────────────────────────────────────────────
// MODULE: Sleeptime Governor
// ───────────────────────────────────────────────────────────────────

import { isSleeptimeConsolidationEnabled } from '../search/search-flags.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPE DEFINITIONS
──────────────────────────────────────────────────────────────── */

export type SleeptimePhase = 'init' | 'child' | 'continue' | 'terminal';

export type SleeptimeStep =
  | { readonly kind: 'tool_call'; readonly tool: string; readonly args?: Readonly<Record<string, unknown>> }
  | { readonly kind: 'terminal'; readonly result?: unknown };

export interface SleeptimeObservation {
  readonly tool: string;
  readonly ok: boolean;
  readonly result?: unknown;
  readonly error?: string;
}

export interface SleeptimeGovernorState {
  readonly phase: SleeptimePhase;
  readonly stepIndex: number;
  readonly costSpent: number;
  readonly observations: readonly SleeptimeObservation[];
}

export type SleeptimeStepProvider = (
  state: SleeptimeGovernorState,
) => Promise<SleeptimeStep> | SleeptimeStep;

export type SleeptimeToolExecutor = (
  call: { readonly tool: string; readonly args?: Record<string, unknown> },
) => Promise<unknown> | unknown;

export type SleeptimeCostFn = (step: SleeptimeStep, observation: SleeptimeObservation | null) => number;

export type SleeptimeStopReason =
  | 'terminal'
  | 'step_cap'
  | 'cost_ceiling'
  | 'tool_error'
  | 'acl_denied'
  | 'provider_error'
  | 'early_terminal'
  | 'flag_disabled';

export type SleeptimeGovernorStatus =
  | 'terminal'
  | 'forced-terminal'
  | 'aborted-partial'
  | 'disabled';

export interface SleeptimeGovernorResult {
  readonly status: SleeptimeGovernorStatus;
  readonly phase: SleeptimePhase;
  readonly steps: number;
  readonly costSpent: number;
  readonly observations: readonly SleeptimeObservation[];
  readonly stopReason: SleeptimeStopReason;
  readonly result: unknown;
}

export interface SleeptimeGovernorConfig {
  readonly stepProvider: SleeptimeStepProvider;
  readonly toolExecutor: SleeptimeToolExecutor;
  readonly allowedTools?: ReadonlySet<string>;
  readonly maxSteps?: number;
  readonly costCeiling?: number;
  readonly costFn?: SleeptimeCostFn;
  readonly seedResult?: unknown;
  readonly bypassFlagGate?: boolean;
  readonly allowEmptyTerminal?: boolean;
}

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

export const SLEEPTIME_DEFAULT_MAX_STEPS = 6;
export const SLEEPTIME_HARD_STEP_LIMIT = 32;
export const SLEEPTIME_DEFAULT_COST_CEILING = 10_000;

const DEFAULT_COST_FN: SleeptimeCostFn = () => 1;

/* ───────────────────────────────────────────────────────────────
   3. HELPERS
──────────────────────────────────────────────────────────────── */

function normalizeMaxSteps(raw: number | undefined): number {
  const value = typeof raw === 'number' && Number.isFinite(raw)
    ? Math.floor(raw)
    : SLEEPTIME_DEFAULT_MAX_STEPS;
  if (value < 1) return 1;
  return Math.min(value, SLEEPTIME_HARD_STEP_LIMIT);
}

function normalizeCostCeiling(raw: number | undefined): number {
  const value = typeof raw === 'number' && Number.isFinite(raw)
    ? raw
    : SLEEPTIME_DEFAULT_COST_CEILING;
  return value > 0 ? value : SLEEPTIME_DEFAULT_COST_CEILING;
}

function phaseForStep(stepIndex: number): SleeptimePhase {
  if (stepIndex === 0) return 'init';
  if (stepIndex === 1) return 'child';
  return 'continue';
}

function bestPartial(seedResult: unknown, observations: readonly SleeptimeObservation[]): unknown {
  if (seedResult !== undefined) return seedResult;
  for (let index = observations.length - 1; index >= 0; index -= 1) {
    const observation = observations[index];
    if (observation.ok && observation.result !== undefined) {
      return observation.result;
    }
  }
  return null;
}

/* ───────────────────────────────────────────────────────────────
   4. CORE LOGIC
──────────────────────────────────────────────────────────────── */

/** Run a bounded sleep-time tool-rule loop. */
export async function runSleeptimeGovernor(
  config: SleeptimeGovernorConfig,
): Promise<SleeptimeGovernorResult> {
  if (!config.bypassFlagGate && !isSleeptimeConsolidationEnabled()) {
    return {
      status: 'disabled',
      phase: 'init',
      steps: 0,
      costSpent: 0,
      observations: [],
      stopReason: 'flag_disabled',
      result: null,
    };
  }

  const maxSteps = normalizeMaxSteps(config.maxSteps);
  const costCeiling = normalizeCostCeiling(config.costCeiling);
  const costFn = config.costFn ?? DEFAULT_COST_FN;
  const allowedTools = config.allowedTools ?? new Set<string>();
  const observations: SleeptimeObservation[] = [];

  let costSpent = 0;
  let stepIndex = 0;

  while (stepIndex < maxSteps) {
    const phase = phaseForStep(stepIndex);
    let step: SleeptimeStep;
    try {
      step = await config.stepProvider({ phase, stepIndex, costSpent, observations });
    } catch {
      return {
        status: 'aborted-partial',
        phase: 'terminal',
        steps: stepIndex,
        costSpent,
        observations,
        stopReason: 'provider_error',
        result: bestPartial(config.seedResult, observations),
      };
    }

    costSpent += costFn(step, null);
    if (costSpent >= costCeiling) {
      return {
        status: 'aborted-partial',
        phase: 'terminal',
        steps: stepIndex,
        costSpent,
        observations,
        stopReason: 'cost_ceiling',
        result: bestPartial(config.seedResult, observations),
      };
    }

    if (step.kind === 'terminal') {
      if (observations.length === 0 && !config.allowEmptyTerminal) {
        return {
          status: 'aborted-partial',
          phase: 'terminal',
          steps: stepIndex,
          costSpent,
          observations,
          stopReason: 'early_terminal',
          result: bestPartial(config.seedResult, observations),
        };
      }
      return {
        status: 'terminal',
        phase: 'terminal',
        steps: stepIndex + 1,
        costSpent,
        observations,
        stopReason: 'terminal',
        result: step.result ?? bestPartial(config.seedResult, observations),
      };
    }

    if (!allowedTools.has(step.tool)) {
      observations.push({ tool: step.tool, ok: false, error: 'acl_denied' });
      return {
        status: 'aborted-partial',
        phase: 'terminal',
        steps: stepIndex,
        costSpent,
        observations,
        stopReason: 'acl_denied',
        result: bestPartial(config.seedResult, observations),
      };
    }

    try {
      const result = await config.toolExecutor({ tool: step.tool, args: step.args ? { ...step.args } : undefined });
      observations.push({ tool: step.tool, ok: true, result });
    } catch (error: unknown) {
      observations.push({
        tool: step.tool,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        status: 'aborted-partial',
        phase: 'terminal',
        steps: stepIndex + 1,
        costSpent,
        observations,
        stopReason: 'tool_error',
        result: bestPartial(config.seedResult, observations),
      };
    }

    stepIndex += 1;
  }

  return {
    status: 'forced-terminal',
    phase: 'terminal',
    steps: stepIndex,
    costSpent,
    observations,
    stopReason: 'step_cap',
    result: bestPartial(config.seedResult, observations),
  };
}
