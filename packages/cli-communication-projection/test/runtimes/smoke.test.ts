// ───────────────────────────────────────────────────────────────────
// MODULE: Tier-Stratified Runtime Smoke Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import {
  applyDisplayPresentation,
  canClaimFullProjectionParity,
} from '../../src/clients/index.js';
import {
  createAcceptedRenderDecision,
  createRejectedRenderDecision,
} from './helpers.js';
import { RUNTIME_PATH_HARNESSES } from './replay-helpers.js';

import type { RenderDecision } from '../../src/index.js';
import type {
  PresentationTier,
  RuntimeTelemetryRecord,
} from '../../src/runtimes/index.js';

const TIERS = ['full-projection', 'safe-native'] as const;

interface TierSmokeReport {
  readonly tier: PresentationTier;
  readonly pathCount: number;
  readonly accepted: number;
  readonly rejected: number;
  readonly timedOut: number;
  readonly cancelled: number;
  readonly disconnected: number;
  readonly degradationAttempts: number;
  readonly degradedResults: number;
  readonly failClosedDegradationResults: number;
  readonly fullParityClaims: number;
}

const reports = new Map<PresentationTier, TierSmokeReport>();

describe('tier-stratified runtime smoke harness', () => {
  it.each(TIERS)('exercises accepted, rejected, terminal, and degradation flows for %s', async (
    tier,
  ) => {
    const report = await exerciseTier(tier);
    reports.set(tier, report);

    expect(report.pathCount).toBe(tier === 'full-projection' ? 6 : 2);
    expect(report).toMatchObject({
      accepted: report.pathCount,
      rejected: report.pathCount,
      timedOut: report.pathCount,
      cancelled: report.pathCount,
      disconnected: report.pathCount,
      degradationAttempts: report.pathCount,
    });
    if (tier === 'full-projection') {
      expect(report.fullParityClaims).toBe(report.pathCount);
      expect(report.degradedResults).toBe(0);
      expect(report.failClosedDegradationResults).toBe(report.pathCount);
    } else {
      expect(report.fullParityClaims).toBe(0);
      expect(report.degradedResults).toBe(report.pathCount);
      expect(report.failClosedDegradationResults).toBe(0);
    }
  });

  it('reports safe-native outcomes separately from full 1:1 parity', () => {
    const full = reports.get('full-projection');
    const safe = reports.get('safe-native');
    expect(full).toBeDefined();
    expect(safe).toBeDefined();
    expect(full).not.toBe(safe);
    expect(full?.tier).toBe('full-projection');
    expect(safe?.tier).toBe('safe-native');
    expect(full?.fullParityClaims).toBe(6);
    expect(safe?.fullParityClaims).toBe(0);
    expect((full?.fullParityClaims ?? 0) + (safe?.fullParityClaims ?? 0)).toBe(6);
  });
});

async function exerciseTier(tier: PresentationTier): Promise<TierSmokeReport> {
  const harnesses = RUNTIME_PATH_HARNESSES.filter(
    (harness) => harness.record.presentationTier === tier,
  );
  const acceptedDecision = await createAcceptedRenderDecision(
    `${tier} validated projection body CREDENTIAL_CANARY`,
  );
  const degradationDecision = await createAcceptedRenderDecision(
    `${tier} validated degradation body CREDENTIAL_CANARY`,
    { atomicReplace: false, appendAfterOriginal: true, sidecar: true },
  );
  const rejectedDecision = await createRejectedRenderDecision(`${tier} rejected projection body.`);
  let fullParityClaims = 0;
  let degradedResults = 0;
  let failClosedDegradationResults = 0;

  for (const harness of harnesses) {
    const record = harness.record;
    const ownership = {
      ownsCompleteMessage: record.evidence.completeMessage.state === 'yes'
        && record.evidence.completeMessage.confidence === 'confirmed',
      ownsAtomicRenderDecision: record.evidence.atomicRenderDecision.state === 'yes'
        && record.evidence.atomicRenderDecision.confidence === 'confirmed',
    };
    expect(canClaimFullProjectionParity(ownership)).toBe(tier === 'full-projection');

    const accepted = harness.present(acceptedDecision, {
      preferredDegradationModes: ['append'],
    });
    const acceptedSurface = {
      commitAtomicReplacement: vi.fn(() => true),
      appendAfterOriginal: vi.fn(() => true),
    };
    const applied = applyDisplayPresentation({
      messageId: `${record.pathId}-accepted`,
      outcome: accepted,
      ownership,
      surface: acceptedSurface,
    });

    if (tier === 'full-projection') {
      expect(record.evidence).toMatchObject({
        completeMessage: { state: 'yes', confidence: 'confirmed' },
        atomicRenderDecision: { state: 'yes', confidence: 'confirmed' },
      });
      expect(accepted).toMatchObject({
        status: 'projection',
        mode: 'atomic-replace',
        originalSuppressed: true,
      });
      expect(applied).toMatchObject({
        status: 'projection',
        originalVisible: false,
        projectionVisible: true,
      });
      expect(acceptedSurface.commitAtomicReplacement).toHaveBeenCalledOnce();
      fullParityClaims += 1;
    } else {
      expect(ownership.ownsCompleteMessage && ownership.ownsAtomicRenderDecision).toBe(false);
      expect(accepted).toMatchObject({
        status: 'degraded',
        mode: 'append',
        originalSuppressed: false,
      });
      expect(applied).toMatchObject({
        status: 'degraded',
        originalVisible: true,
        projectionVisible: true,
      });
      expect(acceptedSurface.commitAtomicReplacement).not.toHaveBeenCalled();
      expect(acceptedSurface.appendAfterOriginal).toHaveBeenCalledOnce();
    }
    assertContentFreeTelemetry(accepted.telemetry, acceptedDecision);

    const rejected = harness.present(rejectedDecision, {
      preferredDegradationModes: ['append'],
    });
    const rejectedSurface = {
      commitAtomicReplacement: vi.fn(() => true),
      appendAfterOriginal: vi.fn(() => true),
    };
    const rejectedApplication = applyDisplayPresentation({
      messageId: `${record.pathId}-rejected`,
      outcome: rejected,
      ownership,
      surface: rejectedSurface,
    });
    expect(rejected).toMatchObject({
      status: 'exact-original',
      reasonCode: 'projection-rejected',
      originalSuppressed: false,
    });
    expect(rejectedApplication).toMatchObject({
      status: 'exact-original',
      originalVisible: true,
      projectionVisible: false,
    });
    expect(rejectedSurface.commitAtomicReplacement).not.toHaveBeenCalled();
    expect(rejectedSurface.appendAfterOriginal).not.toHaveBeenCalled();

    expect(harness.adaptTerminal('timeout')).toMatchObject({
      status: 'exact-original',
      reasonCode: 'timeout',
    });
    expect(harness.adaptTerminal('cancelled')).toMatchObject({
      status: 'exact-original',
      reasonCode: 'cancelled',
    });
    expect(harness.adaptTerminal('disconnect')).toMatchObject({
      status: 'exact-original',
      reasonCode: 'disconnected',
    });

    const degradation = harness.present(degradationDecision, {
      preferredDegradationModes: ['append'],
    });
    assertContentFreeTelemetry(degradation.telemetry, degradationDecision);
    if (degradation.status === 'degraded') {
      degradedResults += 1;
      expect(degradation).toMatchObject({
        presentationTier: 'safe-native',
        mode: 'append',
        originalSuppressed: false,
      });
    } else {
      failClosedDegradationResults += 1;
      expect(degradation).toMatchObject({
        status: 'exact-original',
        reasonCode: 'unsupported-presentation',
        originalSuppressed: false,
      });
    }
  }

  return Object.freeze({
    tier,
    pathCount: harnesses.length,
    accepted: harnesses.length,
    rejected: harnesses.length,
    timedOut: harnesses.length,
    cancelled: harnesses.length,
    disconnected: harnesses.length,
    degradationAttempts: harnesses.length,
    degradedResults,
    failClosedDegradationResults,
    fullParityClaims,
  });
}

function assertContentFreeTelemetry(
  telemetry: RuntimeTelemetryRecord,
  decision: RenderDecision,
): void {
  const serialized = JSON.stringify(telemetry);
  expect(serialized).not.toContain(decision.exactOriginal.bytesBase64);
  if (decision.status === 'projection') {
    expect(serialized).not.toContain(decision.projectionText);
  }
  expect(serialized).not.toContain('CREDENTIAL_CANARY');
  expect(serialized).not.toContain('credential');
}
