// ───────────────────────────────────────────────────────────────
// MODULE: Shadow-Weight Promoter (C4-seam) Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AdvisorHookOutcomeRecord } from '../../lib/metrics.js';
import {
  type AdvisorFeedbackCalibrationReport,
  reduceAdvisorFeedbackCalibration,
} from '../../lib/scorer/feedback-calibration.js';
import {
  LIVE_LANE_WEIGHTS_ENV_KEY,
  SHADOW_LANE_WEIGHTS_ENV_KEY,
} from '../../lib/scorer/lane-registry.js';
import {
  computeShadowWeightProposal,
  promoteShadowWeights,
} from '../../lib/scorer/shadow-weight-promoter.js';

const CURRENT_THRESHOLDS = { confidenceThreshold: 0.8, uncertaintyThreshold: 0.35 } as const;
const ATTRIBUTION = { alpha: 'explicit_author', beta: 'lexical' } as const;

function outcome(skillLabel: string, kind: AdvisorHookOutcomeRecord['outcome']): AdvisorHookOutcomeRecord {
  return { timestamp: '2026-06-10T00:00:00.000Z', runtime: 'codex', outcome: kind, skillLabel };
}

/** A report where `explicit_author` is a supported candidate with `count` all-
 * accepted samples spread across two skills (so concentration does not exclude
 * it). Varying `count` yields content-distinct reports (distinct attesters). */
function acceptedReport(count: number): AdvisorFeedbackCalibrationReport {
  const half = Math.floor(count / 2);
  const records = [
    ...Array.from({ length: count - half }, () => outcome('alpha', 'accepted')),
    ...Array.from({ length: half }, () => outcome('beta', 'accepted')),
  ];
  return reduceAdvisorFeedbackCalibration(records, {
    currentThresholds: CURRENT_THRESHOLDS,
    minSamples: 8,
    laneAttributionBySkill: { alpha: 'explicit_author', beta: 'explicit_author' },
    generatedAt: `2026-06-10T00:00:${String(count).padStart(2, '0')}.000Z`,
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('computeShadowWeightProposal — guardrails', () => {
  it('targets ONLY the shadow channel and keeps the live channel frozen', () => {
    const proposal = computeShadowWeightProposal([]);
    expect(proposal.envKey).toBe(SHADOW_LANE_WEIGHTS_ENV_KEY);
    expect(proposal.envKey).not.toBe(LIVE_LANE_WEIGHTS_ENV_KEY);
    expect(proposal.liveWeightsFrozen).toBe(true);
    expect(proposal.autoPromotion).toBe(false);
    // The live env key must never appear anywhere in the produced artifact.
    expect(JSON.stringify(proposal)).not.toContain(LIVE_LANE_WEIGHTS_ENV_KEY);
  });

  it('proposes the frozen default shadow weights when there is no evidence', () => {
    const proposal = computeShadowWeightProposal([]);
    expect(proposal.distinctReports).toBe(0);
    expect(proposal.shadowWeights.explicit_author).toBe(0.4);
    expect(proposal.audits.every((audit) => audit.auditTag !== 'promoted')).toBe(true);
  });
});

describe('computeShadowWeightProposal — two-gate + fold', () => {
  it('refuses to promote on the k-floor (a single attesting snapshot)', () => {
    const proposal = computeShadowWeightProposal([acceptedReport(10)]);
    const explicit = proposal.audits.find((audit) => audit.lane === 'explicit_author')!;
    expect(proposal.distinctReports).toBe(1);
    expect(explicit.distinctAttesters).toBe(1);
    expect(explicit.twoGate).toBe('below_k_floor');
    expect(explicit.shadowWeight).toBe(0.4); // held at frozen default
    expect(explicit.auditTag).toBe('frozen_default');
  });

  it('promotes (shadow-only) once k≥2 distinct snapshots corroborate a strong posterior', () => {
    const proposal = computeShadowWeightProposal([acceptedReport(10), acceptedReport(12)]);
    const explicit = proposal.audits.find((audit) => audit.lane === 'explicit_author')!;
    expect(proposal.distinctReports).toBe(2);
    expect(explicit.distinctAttesters).toBe(2);
    expect(explicit.twoGate).toBe('two_gate_satisfied');
    expect(explicit.auditTag).toBe('promoted');
    expect(explicit.posterior).toBeGreaterThan(0.6);
    expect(explicit.shadowWeight).toBeGreaterThan(0.4); // raised off the default
    // Other lanes saw no attributed evidence — they stay at their defaults.
    const lexical = proposal.audits.find((audit) => audit.lane === 'lexical')!;
    expect(lexical.shadowWeight).toBe(0.25);
    expect(lexical.twoGate).toBe('below_k_floor');
  });

  it('folds a replayed report exactly once (content-addressed, replay-safe)', () => {
    const report = acceptedReport(10);
    const proposal = computeShadowWeightProposal([report, report]);
    const explicit = proposal.audits.find((audit) => audit.lane === 'explicit_author')!;
    expect(proposal.distinctReports).toBe(1); // replay deduped
    expect(explicit.distinctAttesters).toBe(1);
    expect(explicit.twoGate).toBe('below_k_floor');
  });

  it('is order-independent', () => {
    const a = acceptedReport(10);
    const b = acceptedReport(12);
    const stamp = '2026-06-10T00:00:00.000Z';
    expect(computeShadowWeightProposal([a, b], { generatedAt: stamp }))
      .toEqual(computeShadowWeightProposal([b, a], { generatedAt: stamp }));
  });
});

describe('promoteShadowWeights — out-of-process tick', () => {
  it('reads the calibration JSONL, writes the shadow artifact, and is idempotent', () => {
    const dir = mkdtempSync(join(tmpdir(), 'shadow-promoter-'));
    const calibrationPath = join(dir, 'feedback-calibration.jsonl');
    writeFileSync(
      calibrationPath,
      `${[acceptedReport(10), acceptedReport(12)].map((report) => JSON.stringify(report)).join('\n')}\n`,
      'utf8',
    );
    vi.stubEnv('SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_PATH', calibrationPath);
    vi.stubEnv('SPECKIT_ADVISOR_OUTCOME_STORE_DIR', dir);

    const first = promoteShadowWeights(process.cwd(), { generatedAt: '2026-06-10T01:00:00.000Z' });
    expect(first.changed).toBe(true);
    expect(first.proposal.envKey).toBe(SHADOW_LANE_WEIGHTS_ENV_KEY);

    const persisted = JSON.parse(readFileSync(first.artifactPath, 'utf8')) as typeof first.proposal;
    expect(persisted.liveWeightsFrozen).toBe(true);
    const explicit = persisted.audits.find((audit) => audit.lane === 'explicit_author')!;
    expect(explicit.auditTag).toBe('promoted');
    expect(JSON.parse(persisted.shadowWeightsJson).explicit_author).toBe(explicit.shadowWeight);

    // A second tick over unchanged data writes nothing.
    const second = promoteShadowWeights(process.cwd(), { generatedAt: '2026-06-10T02:00:00.000Z' });
    expect(second.changed).toBe(false);

    rmSync(dir, { recursive: true, force: true });
  });

  it('produces an empty-evidence default proposal when no JSONL exists', () => {
    const dir = mkdtempSync(join(tmpdir(), 'shadow-promoter-empty-'));
    vi.stubEnv('SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_PATH', join(dir, 'missing.jsonl'));
    vi.stubEnv('SPECKIT_ADVISOR_OUTCOME_STORE_DIR', dir);

    const result = promoteShadowWeights(process.cwd(), { generatedAt: '2026-06-10T01:00:00.000Z' });
    expect(result.proposal.distinctReports).toBe(0);
    expect(result.proposal.shadowWeights.explicit_author).toBe(0.4);

    rmSync(dir, { recursive: true, force: true });
  });
});
