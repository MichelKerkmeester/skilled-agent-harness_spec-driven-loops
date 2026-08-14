// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Runtime Rollout Gate Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { evaluateRuntimeRollout } from '../../src/release/index.js';

import type { ReleaseGateDecision } from '../../src/evaluation/index.js';
import type {
  PrivacyCanaryEvidence,
  RuntimeRolloutInput,
  RuntimeSmokeEvidence,
} from '../../src/release/index.js';

const NOW = '2026-08-12T12:00:00.000Z';
const OBSERVED_AT = '2026-08-12T08:00:00.000Z';
const EXPIRES_AT = '2026-08-20T00:00:00.000Z';

const APPROVED: ReleaseGateDecision = {
  gateVersion: 'evaluation-release-gate/1.0.0',
  claimTier: 'full-projection',
  evidenceClass: 'human',
  isProvisional: false,
  status: 'pass',
  reasonCode: 'lower-bounds-clear-margins',
  releaseApproved: true,
  diagnosticMetricCount: 0,
  strata: [],
};

function smoke(
  runtime: 'claude',
  status: 'fail' | 'pass' = 'pass',
  observedAt: string = OBSERVED_AT,
  expiresAt: string = EXPIRES_AT,
): RuntimeSmokeEvidence {
  return {
    status,
    runtime,
    evidenceRef: `runtime/${runtime}/smoke.json`,
    observedAt,
    expiresAt,
  };
}

function canary(
  leakCount: number = 0,
  observedAt: string = OBSERVED_AT,
  expiresAt: string = EXPIRES_AT,
): PrivacyCanaryEvidence {
  return {
    status: 'pass',
    leakCount,
    evidenceRef: 'privacy/canaries.json',
    observedAt,
    expiresAt,
  };
}

function passingInput(overrides: Partial<RuntimeRolloutInput> = {}): RuntimeRolloutInput {
  return {
    runtime: 'claude',
    evaluation: {
      result: APPROVED,
      evidenceRef: 'evaluation/human-certified.json',
      observedAt: OBSERVED_AT,
      expiresAt: EXPIRES_AT,
    },
    smoke: smoke('claude'),
    privacyCanaries: [canary()],
    ...overrides,
  };
}

describe('evaluateRuntimeRollout', () => {
  it('marks a runtime rollout-ready on fresh non-inferiority, smoke, and canary evidence', () => {
    const decision = evaluateRuntimeRollout(passingInput(), NOW);

    expect(decision).toMatchObject({
      decisionVersion: 'runtime-rollout/1.0.0',
      runtime: 'claude',
      overallDecision: 'rollout-ready',
      aborts: [],
    });
  });

  it('blocks on a failing non-inferiority verdict', () => {
    const decision = evaluateRuntimeRollout(passingInput({
      evaluation: {
        result: { ...APPROVED, status: 'fail', releaseApproved: false, reasonCode: 'noninferiority-fail' },
        evidenceRef: 'evaluation/failing.json',
        observedAt: OBSERVED_AT,
        expiresAt: EXPIRES_AT,
      },
    }), NOW);

    expect(decision.overallDecision).toBe('blocked');
    expect(decision.aborts).toContainEqual({ inputName: 'evaluation', reasonCode: 'evaluation-not-approved' });
  });

  it('blocks on a provisional LLM-proxy verdict', () => {
    const decision = evaluateRuntimeRollout(passingInput({
      evaluation: {
        result: { ...APPROVED, evidenceClass: 'llm-proxy', isProvisional: true },
        evidenceRef: 'evaluation/proxy.json',
        observedAt: OBSERVED_AT,
        expiresAt: EXPIRES_AT,
      },
    }), NOW);

    expect(decision.overallDecision).toBe('blocked');
    expect(decision.aborts).toContainEqual({
      inputName: 'evaluation',
      reasonCode: 'evaluation-not-human-certifiable',
    });
  });

  it('blocks on stale smoke evidence', () => {
    const decision = evaluateRuntimeRollout(passingInput({
      smoke: smoke('claude', 'pass', OBSERVED_AT, '2026-08-12T09:00:00.000Z'),
    }), NOW);

    expect(decision.overallDecision).toBe('blocked');
    expect(decision.aborts).toContainEqual({ inputName: 'runtime-smokes', reasonCode: 'evidence-stale' });
  });

  it('blocks on a failing smoke', () => {
    const decision = evaluateRuntimeRollout(passingInput({
      smoke: smoke('claude', 'fail'),
    }), NOW);

    expect(decision.overallDecision).toBe('blocked');
    expect(decision.aborts).toContainEqual({ inputName: 'runtime-smokes', reasonCode: 'runtime-smoke-failed' });
  });

  it('blocks when the smoke names a different runtime', () => {
    const decision = evaluateRuntimeRollout(passingInput({
      smoke: smoke('claude'),
      runtime: 'codex',
    }), NOW);

    expect(decision.overallDecision).toBe('blocked');
    expect(decision.aborts).toContainEqual({
      inputName: 'runtime-smokes',
      reasonCode: 'runtime-smokes-incomplete',
    });
  });

  it('blocks on a privacy canary leak', () => {
    const decision = evaluateRuntimeRollout(passingInput({
      privacyCanaries: [canary(1)],
    }), NOW);

    expect(decision.overallDecision).toBe('blocked');
    expect(decision.aborts).toContainEqual({ inputName: 'privacy-canaries', reasonCode: 'privacy-canary-leak' });
  });

  it('blocks on missing privacy canaries', () => {
    const decision = evaluateRuntimeRollout(passingInput({
      privacyCanaries: [],
    }), NOW);

    expect(decision.overallDecision).toBe('blocked');
    expect(decision.aborts).toContainEqual({
      inputName: 'privacy-canaries',
      reasonCode: 'privacy-canaries-missing',
    });
  });
});
