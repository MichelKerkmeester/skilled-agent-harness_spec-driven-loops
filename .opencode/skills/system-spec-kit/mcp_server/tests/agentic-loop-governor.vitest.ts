// ───────────────────────────────────────────────────────────────
// AGENTIC LOOP GOVERNOR — BOUND & ISOLATION TESTS
// ───────────────────────────────────────────────────────────────
// Proves the bounded controller terminates three ways (step-cap, cost-ceiling,
// terminal answer), fails closed when the flag is off, gates tool dispatch to
// an allowlist, and never throws on provider/tool failure. Pure: no DB, no LLM,
// no wall-clock — the step provider and tool executor are injected mocks.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  runAgenticLoop,
  HARD_STEP_LIMIT,
  type AgenticStep,
  type AgenticStepProvider,
  type AgenticToolExecutor,
  type GovernorConfig,
} from '../lib/search/agentic-loop-governor';

const FLAG = 'SPECKIT_AGENTIC_RECALL';

/** A step provider that always asks to call `tool` — drives the loop to its cap. */
function alwaysCall(tool: string, args?: Record<string, unknown>): AgenticStepProvider {
  return () => ({ kind: 'tool_call', tool, args });
}

/** A tool executor that echoes a fixed result. */
function echoExecutor(result: unknown = 'ok'): AgenticToolExecutor {
  return ({ tool }) => ({ tool, result });
}

/** Base config with the flag bypassed and a single allowed tool. */
function baseConfig(overrides: Partial<GovernorConfig> = {}): GovernorConfig {
  return {
    stepProvider: alwaysCall('search'),
    toolExecutor: echoExecutor(),
    allowedTools: new Set(['search']),
    bypassFlagGate: true,
    ...overrides,
  };
}

describe('agentic-loop-governor', () => {
  const originalFlag = process.env[FLAG];

  beforeEach(() => {
    delete process.env[FLAG];
  });

  afterEach(() => {
    if (originalFlag === undefined) delete process.env[FLAG];
    else process.env[FLAG] = originalFlag;
  });

  describe('flag gate (fail-closed)', () => {
    it('returns disabled and runs zero steps when the flag is off', async () => {
      let providerCalls = 0;
      const result = await runAgenticLoop({
        stepProvider: () => {
          providerCalls += 1;
          return { kind: 'tool_call', tool: 'search' };
        },
        toolExecutor: echoExecutor(),
        allowedTools: new Set(['search']),
        // no bypassFlagGate → governed by the (unset) runtime flag
      });

      expect(result.status).toBe('disabled');
      expect(result.stopReason).toBe('flag_disabled');
      expect(result.steps).toBe(0);
      expect(result.phase).toBe('init');
      expect(providerCalls).toBe(0);
    });

    it('runs when the runtime flag is explicitly enabled', async () => {
      process.env[FLAG] = 'true';
      const result = await runAgenticLoop({
        stepProvider: () => ({ kind: 'final_answer', answer: 'done' }),
        toolExecutor: echoExecutor(),
        allowedTools: new Set(['search']),
      });

      expect(result.status).toBe('final');
      expect(result.answer).toBe('done');
    });

    it('bypassFlagGate runs the loop regardless of the flag', async () => {
      const result = await runAgenticLoop(baseConfig({
        stepProvider: () => ({ kind: 'final_answer', answer: 42 }),
      }));
      expect(result.status).toBe('final');
      expect(result.answer).toBe(42);
    });
  });

  describe('termination — step-cap', () => {
    it('forces a final answer at the step-cap and never exceeds it', async () => {
      const result = await runAgenticLoop(baseConfig({ maxSteps: 3 }));

      expect(result.status).toBe('forced-final');
      expect(result.stopReason).toBe('step_cap');
      expect(result.steps).toBe(3);
      expect(result.observations).toHaveLength(3);
      expect(result.phase).toBe('terminal');
    });

    it('clamps an over-large maxSteps to the hard limit (never unbounded)', async () => {
      const result = await runAgenticLoop(baseConfig({ maxSteps: 10_000 }));
      expect(result.status).toBe('forced-final');
      expect(result.steps).toBe(HARD_STEP_LIMIT);
    });

    it('clamps a non-positive maxSteps up to at least one step', async () => {
      const result = await runAgenticLoop(baseConfig({ maxSteps: 0 }));
      expect(result.steps).toBe(1);
      expect(result.status).toBe('forced-final');
    });

    it('uses the last successful observation as the best-effort forced answer', async () => {
      const result = await runAgenticLoop(baseConfig({
        maxSteps: 2,
        toolExecutor: ({ tool }) => `result-for-${tool}`,
      }));
      expect(result.answer).toBe('result-for-search');
    });

    it('prefers the seed answer over observations when forced', async () => {
      const result = await runAgenticLoop(baseConfig({ maxSteps: 2, seedAnswer: 'SEED' }));
      expect(result.answer).toBe('SEED');
    });
  });

  describe('termination — cost-ceiling', () => {
    it('forced-final when the ceiling is hit after at least one observation', async () => {
      // cost 5/step, ceiling 8: step 1 spends 5 (<8) and gathers a result; step 2
      // spends to 10 (>=8) before its tool runs → forced-final with the partial.
      const result = await runAgenticLoop(baseConfig({
        maxSteps: 10,
        costCeiling: 8,
        costFn: () => 5,
      }));

      expect(result.stopReason).toBe('cost_ceiling');
      expect(result.status).toBe('forced-final');
      expect(result.observations).toHaveLength(1);
      expect(result.costSpent).toBeGreaterThanOrEqual(8);
    });

    it('degrades when the budget is exhausted before any tool result', async () => {
      // The first reasoning step alone (cost 10) blows the ceiling (4) before any
      // tool runs → graceful-degrade signal, no observations gathered.
      const result = await runAgenticLoop(baseConfig({
        maxSteps: 10,
        costCeiling: 4,
        costFn: () => 10,
      }));

      expect(result.status).toBe('degraded');
      expect(result.stopReason).toBe('cost_ceiling');
      expect(result.observations).toHaveLength(0);
      expect(result.answer).toBeNull();
    });

    it('returns the seed answer when degrading before any result', async () => {
      const result = await runAgenticLoop(baseConfig({
        maxSteps: 10,
        costCeiling: 4,
        costFn: () => 10,
        seedAnswer: 'focused-fallback',
      }));
      expect(result.status).toBe('degraded');
      expect(result.answer).toBe('focused-fallback');
    });
  });

  describe('termination — terminal answer (clean stop)', () => {
    it('returns final immediately when the agent answers on the first step', async () => {
      const result = await runAgenticLoop(baseConfig({
        stepProvider: () => ({ kind: 'final_answer', answer: { value: 1 } }),
      }));
      expect(result.status).toBe('final');
      expect(result.stopReason).toBe('final_answer');
      expect(result.phase).toBe('terminal');
      expect(result.steps).toBe(0);
      expect(result.answer).toEqual({ value: 1 });
    });

    it('answers after a few tool calls (Init -> Child -> Continue -> Terminal)', async () => {
      const phasesSeen: string[] = [];
      let n = 0;
      const stepProvider: AgenticStepProvider = (state) => {
        phasesSeen.push(state.phase);
        n += 1;
        if (n >= 3) return { kind: 'final_answer', answer: 'final' };
        return { kind: 'tool_call', tool: 'search' };
      };
      const result = await runAgenticLoop(baseConfig({ stepProvider, maxSteps: 10 }));

      expect(result.status).toBe('final');
      // First decision is 'child', subsequent are 'continue'.
      expect(phasesSeen[0]).toBe('child');
      expect(phasesSeen[1]).toBe('continue');
      expect(phasesSeen[2]).toBe('continue');
      expect(result.observations).toHaveLength(2);
    });
  });

  describe('ACL gating', () => {
    it('aborts when the agent calls a tool outside the allowlist', async () => {
      const result = await runAgenticLoop(baseConfig({
        stepProvider: alwaysCall('rm_rf'),
        allowedTools: new Set(['search']),
      }));
      expect(result.status).toBe('aborted');
      expect(result.stopReason).toBe('acl_denied');
      expect(result.observations.at(-1)).toMatchObject({ tool: 'rm_rf', ok: false });
    });

    it('denies everything when no allowlist is provided', async () => {
      const result = await runAgenticLoop({
        stepProvider: alwaysCall('search'),
        toolExecutor: echoExecutor(),
        bypassFlagGate: true,
      });
      expect(result.status).toBe('aborted');
      expect(result.stopReason).toBe('acl_denied');
    });
  });

  describe('failure handling (never throws)', () => {
    it('aborts with the best partial when the tool executor throws', async () => {
      let calls = 0;
      const toolExecutor: AgenticToolExecutor = () => {
        calls += 1;
        if (calls === 2) throw new Error('boom');
        return 'first-good';
      };
      const result = await runAgenticLoop(baseConfig({ maxSteps: 10, toolExecutor }));

      expect(result.status).toBe('aborted');
      expect(result.stopReason).toBe('tool_error');
      // The good first observation is preserved as the best-effort answer.
      expect(result.answer).toBe('first-good');
      expect(result.observations.at(-1)).toMatchObject({ ok: false, error: 'boom' });
    });

    it('aborts with a typed result when the step provider throws', async () => {
      const result = await runAgenticLoop(baseConfig({
        stepProvider: () => { throw new Error('provider down'); },
      }));
      expect(result.status).toBe('aborted');
      expect(result.stopReason).toBe('provider_error');
      expect(result.answer).toBeNull();
    });
  });

  describe('determinism', () => {
    it('produces identical results across repeated runs with identical inputs', async () => {
      const make = (): GovernorConfig => {
        let n = 0;
        return baseConfig({
          maxSteps: 5,
          stepProvider: (): AgenticStep => {
            n += 1;
            return n >= 3 ? { kind: 'final_answer', answer: `ans-${n}` } : { kind: 'tool_call', tool: 'search' };
          },
        });
      };
      const a = await runAgenticLoop(make());
      const b = await runAgenticLoop(make());
      expect(a).toEqual(b);
    });
  });
});
