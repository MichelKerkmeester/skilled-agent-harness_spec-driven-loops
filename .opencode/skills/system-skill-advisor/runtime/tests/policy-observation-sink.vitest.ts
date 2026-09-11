// ───────────────────────────────────────────────────────────────────
// MODULE: Host-Observation Sink Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import { evidenceBindsToCell } from '../../../../specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix-evidence.mjs';
import {
  clearPolicyObservationSink,
  deliveryEvidenceFromObservation,
  DeliveryStateMachine,
  getPolicyObservationRecords,
  observationBindsToCell,
  POLICY_COMMENT_HYGIENE_ID,
  recordObservedPolicyDelivery,
} from '../lib/policy-plan.js';
import {
  observeEmittedAdvisorPolicy,
  renderAdvisorBrief,
  renderAdvisorFallbackDirective,
} from '../lib/render.js';
import type { AdvisorBriefRenderableResult } from '../lib/render.js';

function advisorResult(): AdvisorBriefRenderableResult {
  return {
    status: 'ok',
    freshness: 'live',
    recommendations: [{
      skill: 'sk-code',
      kind: 'skill',
      confidence: 0.91,
      uncertainty: 0.23,
      passes_threshold: true,
    }],
    sharedPayload: { metadata: { skillLabel: 'sk-code' } },
  };
}

function sessionWithEpoch(sessionId: string, machine: DeliveryStateMachine): number {
  machine.advanceForSignals({
    sessionId,
    sessionIdentityConfirmed: true,
    lifecycleEvent: 'startup',
  });
  return machine.currentEpoch({ sessionId, sessionIdentityConfirmed: true });
}

afterEach(() => {
  clearPolicyObservationSink();
});

describe('policy observation sink', () => {
  it('records an observed receipt after an emitted advisor-policy block', () => {
    const rendered = renderAdvisorBrief(advisorResult()) ?? renderAdvisorFallbackDirective();
    const machine = new DeliveryStateMachine();
    const sessionId = 'session-observed-1';
    const epoch = sessionWithEpoch(sessionId, machine);
    observeEmittedAdvisorPolicy(rendered, {
      runtime: 'Claude Code',
      candidate: '004',
      sessionId,
      sessionIdentityConfirmed: true,
      stateMachine: machine,
    });

    const records = getPolicyObservationRecords();
    expect(records.length).toBeGreaterThan(0);
    expect(records.every((record) => record.binding.hostReceiptStatus === 'observed')).toBe(true);
    expect(records.some((record) => record.binding.blockId === POLICY_COMMENT_HYGIENE_ID)).toBe(true);
    expect(records.every((record) => record.binding.runtime === 'Claude Code')).toBe(true);
    expect(records.every((record) => record.binding.candidate === '004')).toBe(true);
    expect(records.every((record) => record.receipt.lifecycleEpoch === epoch)).toBe(true);
    expect(records.every((record) => record.receipt.lifecycleEpoch > 0)).toBe(true);
    expect(records.every((record) => record.receipt.plannedHash === record.binding.contentHash)).toBe(true);
    expect(records.every((record) => record.binding.artifactDigest.length > 0)).toBe(true);
  });

  it('records no observed receipt when advisor delivery is absent', () => {
    observeEmittedAdvisorPolicy(null, {
      runtime: 'Claude Code',
      candidate: '004',
      sessionId: 'session-missing-1',
      sessionIdentityConfirmed: true,
    });
    expect(getPolicyObservationRecords()).toHaveLength(0);
  });

  it('rejects lifecycle epoch zero at the sink boundary', () => {
    const rejected = recordObservedPolicyDelivery({
      runtime: 'OpenCode',
      candidate: '004',
      blockId: POLICY_COMMENT_HYGIENE_ID,
      content: 'Comment policy',
      contentHash: 'hash-epoch-zero',
      lifecycleEpoch: 0,
      sessionId: 'session-epoch-zero',
      sessionIdentityConfirmed: true,
    });
    expect(rejected).toBeNull();
    expect(getPolicyObservationRecords()).toHaveLength(0);
  });

  it('accepts sink evidence for the matching cell and rejects a different cell', () => {
    const contentHash = 'hash-advisor-route';
    const record = recordObservedPolicyDelivery({
      runtime: 'OpenCode',
      candidate: '004',
      blockId: POLICY_COMMENT_HYGIENE_ID,
      content: 'Comment policy',
      contentHash,
      lifecycleEpoch: 2,
      sessionId: 'session-cell-bind',
      sessionIdentityConfirmed: true,
    });
    expect(record).not.toBeNull();

    const matchingCell = {
      runtime: 'OpenCode',
      candidate: '004',
      contentHash,
      lifecycleEpoch: 2,
      artifactDigest: record!.binding.artifactDigest,
    };
    const mismatchedCell = {
      runtime: 'Cursor',
      candidate: '004',
      contentHash,
      lifecycleEpoch: 2,
      artifactDigest: record!.binding.artifactDigest,
    };
    const wrongDigestCell = {
      runtime: 'OpenCode',
      candidate: '004',
      contentHash,
      lifecycleEpoch: 2,
      artifactDigest: 'digest-not-bound-to-cell',
    };

    expect(observationBindsToCell(record!, matchingCell)).toBe(true);
    expect(observationBindsToCell(record!, mismatchedCell)).toBe(false);
    expect(observationBindsToCell(record!, wrongDigestCell)).toBe(false);

    const deliveryEvidence = deliveryEvidenceFromObservation(record!);
    const behavioralEvidence = { ...deliveryEvidence };
    expect(evidenceBindsToCell(behavioralEvidence, deliveryEvidence, matchingCell)).toBe(true);
    expect(evidenceBindsToCell(behavioralEvidence, deliveryEvidence, mismatchedCell)).toBe(false);
  });

  it('does not record when observation runs before a committed emission payload exists', () => {
    const machine = new DeliveryStateMachine();
    const sessionId = 'session-pre-emission';
    const epoch = sessionWithEpoch(sessionId, machine);
    const contentHash = 'hash-pre-emission';
    const preEmission = recordObservedPolicyDelivery({
      runtime: 'Claude Code',
      candidate: '004',
      blockId: POLICY_COMMENT_HYGIENE_ID,
      content: 'pre-emission probe',
      contentHash,
      lifecycleEpoch: epoch,
      sessionId,
      sessionIdentityConfirmed: true,
    });
    expect(preEmission).not.toBeNull();
    clearPolicyObservationSink();

    const rendered = renderAdvisorFallbackDirective();
    const output = {
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit' as const,
        additionalContext: rendered,
      },
    };
    expect(output.hookSpecificOutput.additionalContext).toBe(rendered);
    observeEmittedAdvisorPolicy(output.hookSpecificOutput.additionalContext, {
      runtime: 'Claude Code',
      candidate: '004',
      sessionId,
      sessionIdentityConfirmed: true,
      stateMachine: machine,
    });

    const records = getPolicyObservationRecords();
    expect(records.length).toBeGreaterThan(0);
    expect(records.some((entry) => entry.binding.contentHash === contentHash)).toBe(false);
  });
});
