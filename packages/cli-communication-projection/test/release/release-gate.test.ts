// ───────────────────────────────────────────────────────────────────
// MODULE: Release Readiness Gate Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { SupportMatrix, evaluateReleaseReadiness } from '../../src/release/index.js';

import type { DoctorReport } from '../../src/doctor/index.js';
import type { ReleaseGateDecision } from '../../src/evaluation/index.js';
import type {
  ReleaseCheckEvidence,
  ReleaseEvidenceInput,
  RuntimeSmokeEvidence,
} from '../../src/release/index.js';

const NOW = '2026-08-12T12:00:00.000Z';
const OBSERVED_AT = '2026-08-12T08:00:00.000Z';
const EXPIRES_AT = '2026-08-20T00:00:00.000Z';
const RUNTIMES = ['claude', 'codex', 'cursor', 'devin', 'opencode', 'pi'] as const;

const READY_DOCTOR: DoctorReport = {
  reportVersion: 'compatibility-doctor/1.0.0',
  findings: [],
  overallDecision: 'ready',
  routeSelection: 'proposed',
  contentFree: true,
};

const HUMAN_EVALUATION: ReleaseGateDecision = {
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

describe('release readiness gate', () => {
  it('releases only a complete, fresh, passing, human-certified bundle', () => {
    const decision = evaluateReleaseReadiness(createPassingInput(), NOW);

    expect(decision).toMatchObject({
      overallDecision: 'release-ready',
      aborts: [],
      manifest: {
        manifestVersion: 'release-evidence-manifest/1.0.0',
        evaluatedAt: NOW,
        overallDecision: 'release-ready',
      },
    });
    expect(decision.manifest.entries).toHaveLength(8);
    expect(decision.manifest.entries.every((entry) => entry.status === 'pass')).toBe(true);
  });

  it('blocks a numerically passing provisional LLM-proxy evaluation', () => {
    const input = createPassingInput();
    const decision = evaluateReleaseReadiness({
      ...input,
      evaluation: dated({
        ...HUMAN_EVALUATION,
        evidenceClass: 'llm-proxy',
        isProvisional: true,
      }, 'evaluation/proxy-pass.json'),
    }, NOW);

    expect(decision.overallDecision).toBe('blocked');
    expect(decision.aborts).toContainEqual({
      inputName: 'evaluation',
      reasonCode: 'evaluation-not-human-certifiable',
    });
    expect(decision.manifest.entries).toContainEqual(expect.objectContaining({
      inputName: 'evaluation',
      status: 'provisional',
      reasonCode: 'evaluation-not-human-certifiable',
    }));
  });

  it('blocks stale support-matrix evidence', () => {
    const input = createPassingInput();
    const decision = evaluateReleaseReadiness({ ...input, supportMatrix: SupportMatrix },
      '2026-09-01T00:00:00.000Z');

    expect(decision.overallDecision).toBe('blocked');
    expect(decision.aborts).toContainEqual({
      inputName: 'support-matrix',
      reasonCode: 'support-matrix-stale',
    });
  });

  it('blocks a support matrix whose rows do not match its digest', () => {
    const input = createPassingInput();
    const rows = SupportMatrix.rows.map((row, index) =>
      index === 0 ? { ...row, identifier: `${row.identifier}-modified` } : row);
    const decision = evaluateReleaseReadiness({
      ...input,
      supportMatrix: { ...SupportMatrix, rows },
    }, NOW);

    expect(decision.overallDecision).toBe('blocked');
    expect(decision.aborts).toContainEqual({
      inputName: 'support-matrix',
      reasonCode: 'support-matrix-digest-mismatch',
    });
  });

  it('blocks a doctor report whose overall decision is blocked', () => {
    const input = createPassingInput();
    const decision = evaluateReleaseReadiness({
      ...input,
      doctor: dated({
        ...READY_DOCTOR,
        overallDecision: 'blocked',
        routeSelection: 'original-only',
      }, 'doctor/blocked.json'),
    }, NOW);

    expect(decision.aborts).toContainEqual({
      inputName: 'doctor',
      reasonCode: 'doctor-not-ready',
    });
  });

  it('blocks when any runtime smoke fails', () => {
    const input = createPassingInput();
    if (input.runtimeSmokes === undefined) {
      throw new Error('Expected runtime smoke fixtures.');
    }
    const runtimeSmokes = input.runtimeSmokes.map((smoke, index) =>
      index === 0 ? { ...smoke, status: 'fail' as const } : smoke);
    const decision = evaluateReleaseReadiness({ ...input, runtimeSmokes }, NOW);

    expect(decision.aborts).toContainEqual({
      inputName: 'runtime-smokes',
      reasonCode: 'runtime-smoke-failed',
    });
  });

  it('blocks when any privacy canary reports a leak', () => {
    const input = createPassingInput();
    const privacyCanary = input.privacyCanaries?.[0];
    if (privacyCanary === undefined) {
      throw new Error('Expected a privacy canary fixture.');
    }
    const decision = evaluateReleaseReadiness({
      ...input,
      privacyCanaries: [{ ...privacyCanary, leakCount: 1 }],
    }, NOW);

    expect(decision.aborts).toContainEqual({
      inputName: 'privacy-canaries',
      reasonCode: 'privacy-canary-leak',
    });
  });

  it('creates a reproducible manifest without raw content, secrets, or references', () => {
    const secretCanary = 'credential-CANARY-2fd91';
    const contentCanary = 'raw-content-CANARY-771c0';
    const input = {
      ...createPassingInput(),
      providerContracts: [passingCheck(`evidence/${secretCanary}/${contentCanary}`)],
    };

    const first = evaluateReleaseReadiness(input, NOW).manifest;
    const second = evaluateReleaseReadiness(input, NOW).manifest;
    const serialized = JSON.stringify(first);

    expect(first).toEqual(second);
    expect(first.contentFreeDigest).toMatch(/^sha256:[a-f0-9]{64}$/u);
    expect(serialized).not.toContain(secretCanary);
    expect(serialized).not.toContain(contentCanary);
    expect(serialized).not.toContain('evidence/');
    expect(first.entries.flatMap((entry) => entry.references)
      .every((reference) => /^sha256:[a-f0-9]{64}$/u.test(reference.referenceDigest)))
      .toBe(true);
  });
});

function createPassingInput(): ReleaseEvidenceInput {
  const runtimeSmokes: RuntimeSmokeEvidence[] = RUNTIMES.map((runtime) => ({
    ...passingCheck(`runtime/${runtime}/smoke.json`),
    runtime,
  }));
  return {
    supportMatrix: SupportMatrix,
    doctor: dated(READY_DOCTOR, 'doctor/ready.json'),
    runtimeSmokes,
    providerContracts: [passingCheck('providers/contracts.json')],
    fidelityNegativeControls: [passingCheck('fidelity/negative-controls.json')],
    privacyCanaries: [{ ...passingCheck('privacy/canaries.json'), leakCount: 0 }],
    evaluation: dated(HUMAN_EVALUATION, 'evaluation/human-certified.json'),
    strictPacketValidation: passingCheck('packets/strict-validation.json'),
  };
}

function passingCheck(evidenceRef: string): ReleaseCheckEvidence {
  return {
    status: 'pass',
    evidenceRef,
    observedAt: OBSERVED_AT,
    expiresAt: EXPIRES_AT,
  };
}

function dated<TResult>(result: TResult, evidenceRef: string) {
  return {
    result,
    evidenceRef,
    observedAt: OBSERVED_AT,
    expiresAt: EXPIRES_AT,
  };
}
