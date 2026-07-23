// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Ledger Schema Tests
// ───────────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  AuthorizedLedgerErrorCodes,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepResearchEventStems,
  DeepResearchWireEventTypes,
  createDeepResearchEventRegistry,
  decideDeepResearchCompatibility,
  prepareDeepResearchEvent,
  upcastLegacyDeepResearchRecord,
} from '../../lib/deep-research-ledger-schema/index.js';
import {
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  GatewayAllowProof,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepResearchEventInput,
  DeepResearchEventStem,
  DeepResearchPayloadMap,
  DeepResearchReplayMetadata,
  DeepResearchScopeMap,
} from '../../lib/deep-research-ledger-schema/index.js';
import type {
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../../lib/event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-21T10:00:00.000Z';
const LEDGER_ID = 'deep-research-shadow';
const AUDIT_LEDGER_ID = 'deep-research-shadow-authorization';
const AUTHORITY = Object.freeze({ state: 'shadowing' as const, epoch: 1 });
const temporaryRoots: string[] = [];

interface Harness {
  readonly registry: EventTypeRegistry;
  readonly policies: TransitionPolicyRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function temporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'deep-research-ledger-schema-'));
  temporaryRoots.push(root);
  return root;
}

function createHarness(): Harness {
  const rootDirectory = temporaryRoot();
  const registry = createDeepResearchEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'deep-research-shadow-write',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['known-deep-research-event', 'shadow-capability'],
    evaluate: (input) => ({
      verdict: input.requestedEventType.startsWith('deep-research.ledger.')
        && input.capabilityId === 'deep-research:append'
        ? 'allow'
        : 'deny',
      reasonCode: input.requestedEventType.startsWith('deep-research.ledger.')
        && input.capabilityId === 'deep-research:append'
        ? 'allowed'
        : 'policy_denied',
      matchedRuleIds: ['known-deep-research-event', 'shadow-capability'],
    }),
  }]);
  const authorityProvider = (): typeof AUTHORITY => AUTHORITY;
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: LEDGER_ID,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
  }, ledger, policies);
  return { registry, policies, ledger, gateway };
}

function replayMetadata(label: string): DeepResearchReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest(`replay:${label}`),
    replay_input_digests: { configuration: digest('configuration') },
  };
}

function scoreVector(): JsonObject {
  return {
    expectedYield: 0.8,
    contradictionRisk: 0.2,
    impact: 0.7,
    independenceGain: 0.6,
    staleness: 0.1,
    expectedCost: 0.3,
  };
}

function scopeFor<TStem extends DeepResearchEventStem>(
  stem: TStem,
  iteration: number,
): DeepResearchScopeMap[TStem] {
  const base = { runId: 'run-1', lineageId: 'lineage-1' };
  if (stem === 'deep_research.question_registered') {
    return { ...base, questionId: 'question-1' } as DeepResearchScopeMap[TStem];
  }
  if (stem === 'deep_research.branch_planned' || stem === 'deep_research.branch_selected') {
    return {
      ...base,
      questionId: 'question-1',
      branchId: 'branch-1',
    } as DeepResearchScopeMap[TStem];
  }
  if (stem === 'deep_research.source_captured') {
    return { ...base, iteration, sourceVersionId: 'source-version-1' } as DeepResearchScopeMap[TStem];
  }
  if (stem === 'deep_research.evidence_admission_decided') {
    return {
      ...base,
      iteration,
      sourceVersionId: 'source-version-1',
      evidenceId: 'evidence-1',
    } as DeepResearchScopeMap[TStem];
  }
  if (stem.startsWith('deep_research.claim_')) {
    return { ...base, iteration, claimVersionId: 'claim-version-2' } as DeepResearchScopeMap[TStem];
  }
  if (stem.startsWith('deep_research.iteration_')
    || stem.startsWith('deep_research.gap_')
    || stem.startsWith('deep_research.next_focus_')
    || stem.startsWith('deep_research.convergence_')) {
    return { ...base, iteration } as DeepResearchScopeMap[TStem];
  }
  return base as DeepResearchScopeMap[TStem];
}

function dataFor<TStem extends DeepResearchEventStem>(
  stem: TStem,
): DeepResearchPayloadMap[TStem] {
  const hash = digest(stem);
  const data: Readonly<Record<DeepResearchEventStem, JsonObject>> = {
    'deep_research.run_initialized': {
      generation: 1,
      charterDigest: hash,
      configDigest: hash,
      executorFingerprint: hash,
      replayFingerprint: hash,
      maxIterations: 10,
      convergencePolicyVersion: 'convergence@1',
    },
    'deep_research.run_resumed': {
      priorTailDigest: hash,
      sourceLineageId: 'lineage-0',
      resumeReason: 'continue',
      generation: 1,
      compatibilityDecision: 'exact',
      recoveryReceiptRef: 'recovery-1',
    },
    'deep_research.run_restarted': {
      priorTailDigest: hash,
      archivedLineageId: 'lineage-0',
      restartReason: 'restart',
      generation: 2,
      compatibilityDecision: 'migrate',
      recoveryReceiptRef: 'recovery-2',
    },
    'deep_research.question_registered': {
      normalizedQuestionDigest: hash,
      dependencyQuestionIds: [],
      requiredSourceClasses: ['primary'],
      disconfirmingQueryRecipeIds: ['query-recipe-1'],
      budgetRef: 'budget-1',
    },
    'deep_research.branch_planned': {
      semanticClusterId: 'cluster-1',
      expectedYieldScoreVector: scoreVector(),
      contradictionRisk: 0.2,
      impact: 0.7,
      independenceGain: 0.6,
      staleness: 0.1,
      expectedCost: 0.3,
      tieBreakKey: 'tie-1',
      reservationRef: 'reservation-1',
    },
    'deep_research.branch_selected': {
      semanticClusterId: 'cluster-1',
      expectedYieldScoreVector: scoreVector(),
      contradictionRisk: 0.2,
      impact: 0.7,
      independenceGain: 0.6,
      staleness: 0.1,
      expectedCost: 0.3,
      tieBreakKey: 'tie-1',
      reservationRef: 'reservation-1',
    },
    'deep_research.iteration_started': {
      focusRef: 'focus-1',
      stateTailDigest: hash,
      strategyDigest: hash,
      status: 'started',
    },
    'deep_research.iteration_completed': {
      status: 'complete',
      rawNewInfoRatio: 0.4,
      trustedEvidenceYield: 0.7,
      outputDigest: hash,
      ruledOutApproachRefs: ['approach-1'],
      nextFocusCausationId: 'next-focus-1',
    },
    'deep_research.source_captured': {
      sourceIdentityDigest: hash,
      locator: {
        scheme: 'url',
        locatorDigest: hash,
        selector: 'https://example.test/source',
        revision: '2026-07-21',
      },
      capturedAt: TIMESTAMP,
      contentDigest: hash,
      mediaType: 'text/html',
      retrievalReceiptRef: 'retrieval-1',
      parentSourceVersionId: null,
      instructionScanResult: 'clean',
    },
    'deep_research.evidence_admission_decided': {
      disposition: 'admit',
      passageLocators: [{
        locatorDigest: hash,
        selector: 'paragraph:4',
        passageDigest: hash,
      }],
      atomicClaimRefs: ['atomic-claim-1'],
      derivativeSourceGroup: 'independent-group-1',
      admissionPolicyVersion: 'admission@1',
      contaminationStatus: 'clean',
      reasonCode: 'verified-primary-source',
    },
    'deep_research.claim_asserted': {
      claimId: 'claim-1',
      normalizedClaimDigest: hash,
      evidenceIds: ['evidence-1'],
      independenceGroup: 'independent-group-1',
      rawConfidence: 0.8,
      claimStatus: 'supported',
    },
    'deep_research.claim_relation_recorded': {
      claimId: 'claim-1',
      relatedClaimVersionId: 'claim-version-1',
      evidenceIds: ['evidence-1'],
      relation: 'supports',
      independenceGroup: 'independent-group-1',
      rawConfidence: 0.8,
      claimStatus: 'supported',
    },
    'deep_research.claim_superseded': {
      priorClaimVersionId: 'claim-version-1',
      successorClaimVersionId: 'claim-version-2',
      supersessionReason: 'stronger-evidence',
      effectiveAt: TIMESTAMP,
      replacementEvidenceIds: ['evidence-2'],
      invalidationScope: 'claim-only',
    },
    'deep_research.gap_detected': {
      obligationId: 'gap-1',
      gapKind: 'verification',
      affectedClaimIds: ['claim-1'],
      affectedQuestionIds: ['question-1'],
      criticality: 0.9,
      proposedQueryRecipeIds: ['query-recipe-2'],
    },
    'deep_research.next_focus_selected': {
      obligationId: 'gap-1',
      selectionScoreVector: scoreVector(),
      visitCooldown: 2,
      policyVersion: 'focus@1',
      chosenBranchId: 'branch-1',
      chosenQuestionId: null,
    },
    'deep_research.convergence_evaluated': {
      decision: 'continue',
      rawSignals: {
        newInfoRatio: 0.4,
        contradictionRisk: 0.2,
        citationDrift: 0.1,
        observationDigest: hash,
      },
      trustedSignals: {
        evidenceYield: 0.7,
        independentSourceRatio: 0.8,
        supportedClaimRatio: 0.6,
        assessmentDigest: hash,
      },
      qualityGateResults: {
        sourceDiversity: 'pass',
        contradictionResolution: 'pass',
        citationIntegrity: 'pass',
        policyVersion: 'quality-gates@1',
        resultDigest: hash,
      },
      blockerIds: [],
      policyFingerprint: hash,
      evaluatorFingerprint: hash,
      evidenceTailHash: hash,
      incompleteReason: null,
      recoveryReason: null,
    },
    'deep_research.convergence_blocked': {
      decision: 'blocked',
      rawSignals: {
        newInfoRatio: 0.1,
        contradictionRisk: 0.8,
        citationDrift: 0.5,
        observationDigest: hash,
      },
      trustedSignals: {
        evidenceYield: 0.1,
        independentSourceRatio: 0.2,
        supportedClaimRatio: 0.3,
        assessmentDigest: hash,
      },
      qualityGateResults: {
        sourceDiversity: 'fail',
        contradictionResolution: 'fail',
        citationIntegrity: 'unknown',
        policyVersion: 'quality-gates@1',
        resultDigest: hash,
      },
      blockerIds: ['source-diversity'],
      policyFingerprint: hash,
      evaluatorFingerprint: hash,
      evidenceTailHash: hash,
      incompleteReason: 'quality-gate-failed',
      recoveryReason: 'focus-pivot',
    },
    'deep_research.synthesis_started': {
      admittedLedgerRevision: 'ledger-revision-1',
      selectedClaimVersionSetDigest: hash,
      synthesisPolicyDigest: hash,
      reportRevision: 'report-1',
      unresolvedClaimIds: ['claim-2'],
      contestedClaimIds: ['claim-3'],
    },
    'deep_research.synthesis_committed': {
      admittedLedgerRevision: 'ledger-revision-1',
      selectedClaimVersionSetDigest: hash,
      synthesisPolicyDigest: hash,
      reportRevision: 'report-1',
      unresolvedClaimIds: ['claim-2'],
      contestedClaimIds: ['claim-3'],
      reportDigest: hash,
      citationEventIds: ['event-9'],
      synthesisReceiptRef: 'synthesis-receipt-1',
    },
    'deep_research.memory_save_requested': {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: hash,
      route: 'implementation-summary',
      mergeMode: 'merge',
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-20' },
    },
    'deep_research.memory_save_completed': {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: hash,
      route: 'implementation-summary',
      mergeMode: 'merge',
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-20' },
      persistenceReceiptRefs: ['memory-receipt-1'],
      continuityFingerprint: hash,
    },
    'deep_research.memory_save_failed': {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: hash,
      route: 'implementation-summary',
      mergeMode: 'merge',
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-20' },
      retryable: true,
      failureReason: 'storage-unavailable',
    },
    'deep_research.run_completed': {
      terminalStatus: 'completed',
      convergenceEventId: 'event-16',
      synthesisEventId: 'event-19',
      memorySaveEventId: 'event-21',
      finalLedgerTailHash: hash,
      counts: { iterations: 1, sources: 1, admittedEvidence: 1, claims: 1 },
      completionReason: 'converged',
      incompleteReason: null,
    },
  };
  return data[stem] as DeepResearchPayloadMap[TStem];
}

function eventInput<TStem extends DeepResearchEventStem>(
  stem: TStem,
  index: number,
  prevEventHash: string,
): DeepResearchEventInput<TStem> {
  return {
    stem,
    scope: scopeFor(stem, Math.max(1, index)),
    prevEventHash,
    replay: replayMetadata(stem),
    data: dataFor(stem),
    eventId: `event-${index}`,
    streamId: 'deep-research-run-1',
    streamSequence: index,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-research-shadow-schema', version: '1' },
    authorityEpoch: 1,
    correlationId: 'run-1',
    causationId: index === 1 ? null : `event-${index - 1}`,
    idempotencyKey: `deep-research-event-${index}`,
  };
}

function eventInputWithDataField<TStem extends DeepResearchEventStem>(
  stem: TStem,
  index: number,
  field: string,
  value: unknown,
): DeepResearchEventInput<TStem> {
  const input = eventInput(stem, index, '0'.repeat(64));
  return {
    ...input,
    data: { ...input.data, [field]: value } as DeepResearchPayloadMap[TStem],
  };
}

async function authorizationRequest(
  harness: Harness,
  event: EventWritePreflight,
  requestId: string,
  capabilityId = 'deep-research:append',
): Promise<TransitionAuthorizationRequest> {
  const policy = harness.policies.resolve('deep-research-shadow-write', 1);
  return {
    requestId,
    mode: 'research',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: 'deep-research-shadow@1',
    priorStateFingerprint: digest('prior-state'),
    actorId: 'deep-research-runtime',
    capabilityId,
    authorityEpoch: 1,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: digest('authorization-evidence'),
  };
}

async function authorize(
  harness: Harness,
  event: EventWritePreflight,
  requestId: string,
): Promise<GatewayAllowProof> {
  const result = await harness.gateway.authorize(
    await authorizationRequest(harness, event, requestId),
  );
  expect(result.verdict).toBe('allow');
  if (result.verdict !== 'allow') throw new Error(result.reasonCode);
  return result.proof;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

// ───────────────────────────────────────────────────────────────────
// 2. AUTHORIZATION AND REPLAY MATRIX
// ───────────────────────────────────────────────────────────────────

describe('deep-research typed ledger schema', () => {
  it('authorizes and appends every event stem with replay-addressable metadata', async () => {
    const harness = createHarness();
    let priorHash = '0'.repeat(64);
    for (const [offset, stem] of DeepResearchEventStems.entries()) {
      const index = offset + 1;
      let event: EventWritePreflight;
      try {
        event = prepareDeepResearchEvent(
          eventInput(stem, index, priorHash),
          harness.registry,
        );
      } catch (error: unknown) {
        throw new Error(`${stem}: ${error instanceof Error ? error.message : String(error)}`);
      }
      const proof = await authorize(harness, event, `request-${index}`);
      const receipt = await harness.ledger.appendAuthorized(event, proof);
      expect(receipt.authorizationRef.decision_id).toBe(proof.decision.decision_id);
      priorHash = receipt.recordHash;
    }

    const verified = await harness.ledger.readVerifiedEvents();
    expect(verified).toHaveLength(DeepResearchEventStems.length);
    expect(verified.map((entry) => entry.event.stored.envelope.event_type)).toEqual(
      DeepResearchEventStems.map((stem) => DeepResearchWireEventTypes[stem]),
    );
    for (const [index, entry] of verified.entries()) {
      const stem = DeepResearchEventStems[index];
      expect(entry.event.stored.envelope.event_id).toBe(`event-${index + 1}`);
      expect(entry.event.stored.envelope.payload.stem).toBe(stem);
      expect(entry.event.stored.envelope.payload.replay).toEqual(replayMetadata(stem));
      expect(entry.frame.authorization_ref.decision_id).not.toBe('');
    }
  });

  it('produces stable canonical identity and replay metadata for the same input', () => {
    const registry = createDeepResearchEventRegistry();
    const input = eventInput('deep_research.run_initialized', 1, '0'.repeat(64));
    const first = prepareDeepResearchEvent(input, registry);
    const second = prepareDeepResearchEvent(input, registry);
    expect(second.identity).toEqual(first.identity);
    expect(second.canonicalDigest).toBe(first.canonicalDigest);
    expect(second.envelope.payload.payloadDigest).toBe(first.envelope.payload.payloadDigest);
    expect(second.envelope.payload.replay).toEqual(first.envelope.payload.replay);
  });

  // ─────────────────────────────────────────────────────────────────
  // 3. FAIL-CLOSED VALIDATION
  // ─────────────────────────────────────────────────────────────────

  it('rejects missing identities and absent previous-event hashes', () => {
    const registry = createDeepResearchEventRegistry();
    const event = prepareDeepResearchEvent(
      eventInput('deep_research.run_initialized', 1, '0'.repeat(64)),
      registry,
    );
    const scope = { ...(event.envelope.payload.scope as JsonObject) };
    delete scope.runId;
    expect(() => prepareEventWrite({
      ...event.envelope,
      payload: { ...event.envelope.payload, scope },
    }, registry)).toThrow();

    const payload = { ...event.envelope.payload };
    delete payload.prevEventHash;
    expect(() => prepareEventWrite({ ...event.envelope, payload }, registry)).toThrow();
    expect(() => prepareEventWrite({ ...event.envelope, event_id: '' }, registry)).toThrow();
  });

  it('rejects mutable prose smuggled inside convergence signal sets', () => {
    const registry = createDeepResearchEventRegistry();
    const proseBlob = 'mutable research narrative '.repeat(80);
    const evaluated = eventInput(
      'deep_research.convergence_evaluated',
      16,
      '0'.repeat(64),
    );
    expect(() => prepareDeepResearchEvent({
      ...evaluated,
      data: {
        ...evaluated.data,
        rawSignals: { ...evaluated.data.rawSignals, notes: proseBlob },
      },
    }, registry)).toThrow();
    expect(() => prepareDeepResearchEvent({
      ...evaluated,
      data: {
        ...evaluated.data,
        trustedSignals: { ...evaluated.data.trustedSignals, commentary: proseBlob },
      },
    }, registry)).toThrow();

    const blocked = eventInput(
      'deep_research.convergence_blocked',
      17,
      '0'.repeat(64),
    );
    expect(() => prepareDeepResearchEvent({
      ...blocked,
      data: {
        ...blocked.data,
        qualityGateResults: { ...blocked.data.qualityGateResults, summary: proseBlob },
      },
    }, registry)).toThrow();
  });

  it('authorizes closed convergence signals with numeric and digest evidence', async () => {
    const harness = createHarness();
    const input = eventInput('deep_research.convergence_evaluated', 16, '0'.repeat(64));
    const event = prepareDeepResearchEvent(input, harness.registry);
    const proof = await authorize(harness, event, 'convergence-signal-request');
    await harness.ledger.appendAuthorized(event, proof);

    const [verified] = await harness.ledger.readVerifiedEvents();
    expect(verified.event.stored.envelope.payload.data).toEqual(input.data);
  });

  it('rejects prose and oversized values in scalar reference fields', () => {
    const registry = createDeepResearchEventRegistry();
    const referenceCases = [
      ['deep_research.run_resumed', 2, 'recoveryReceiptRef'],
      ['deep_research.question_registered', 4, 'budgetRef'],
      ['deep_research.branch_planned', 5, 'reservationRef'],
      ['deep_research.iteration_started', 7, 'focusRef'],
      ['deep_research.synthesis_committed', 19, 'synthesisReceiptRef'],
      ['deep_research.branch_selected', 6, 'semanticClusterId'],
      ['deep_research.gap_detected', 14, 'obligationId'],
      ['deep_research.synthesis_started', 18, 'admittedLedgerRevision'],
      ['deep_research.synthesis_started', 18, 'reportRevision'],
    ] as const;

    for (const [stem, index, field] of referenceCases) {
      expect(() => prepareDeepResearchEvent(
        eventInputWithDataField(stem, index, field, 'free prose is not a reference'),
        registry,
      )).toThrow();
    }
    expect(() => prepareDeepResearchEvent(
      eventInputWithDataField(
        'deep_research.run_resumed',
        2,
        'recoveryReceiptRef',
        `receipt-${'x'.repeat(257)}`,
      ),
      registry,
    )).toThrow();
  });

  it('rejects a quoted passage disguised as an admission reason code before append', async () => {
    const harness = createHarness();
    const fakeQuotedPassage = (
      '"The collected source states mutable evidence that belongs outside the ledger." '
    ).repeat(40);
    expect(fakeQuotedPassage.length).toBeGreaterThan(2_700);

    expect(() => prepareDeepResearchEvent(
      eventInputWithDataField(
        'deep_research.evidence_admission_decided',
        1,
        'reasonCode',
        fakeQuotedPassage,
      ),
      harness.registry,
    )).toThrow();
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({ sequence: 0 });
    await expect(harness.ledger.readVerifiedEvents()).resolves.toHaveLength(0);
  });

  it('rejects prose in every top-level policy-version field', async () => {
    const harness = createHarness();
    const policyProse = 'mutable policy narrative with quoted evidence '.repeat(30);
    const cases = [
      ['deep_research.run_initialized', 1, 'convergencePolicyVersion'],
      ['deep_research.evidence_admission_decided', 2, 'admissionPolicyVersion'],
      ['deep_research.next_focus_selected', 3, 'policyVersion'],
    ] as const;

    for (const [stem, index, field] of cases) {
      expect(() => prepareDeepResearchEvent(
        eventInputWithDataField(stem, index, field, policyProse),
        harness.registry,
      )).toThrow();
    }
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({ sequence: 0 });
  });

  it('rejects over-long prose across representative semantic field kinds', () => {
    const registry = createDeepResearchEventRegistry();
    const overlongProse = 'unbounded mutable narrative '.repeat(200);
    const qualityGateInput = dataFor('deep_research.convergence_evaluated');
    const cases = [
      ['deep_research.run_initialized', 1, 'charterDigest', overlongProse],
      ['deep_research.run_resumed', 2, 'sourceLineageId', overlongProse],
      ['deep_research.run_resumed', 2, 'resumeReason', overlongProse],
      ['deep_research.question_registered', 4, 'requiredSourceClasses', [overlongProse]],
      ['deep_research.branch_planned', 5, 'tieBreakKey', overlongProse],
      ['deep_research.iteration_started', 7, 'status', overlongProse],
      ['deep_research.source_captured', 9, 'capturedAt', overlongProse],
      ['deep_research.claim_asserted', 11, 'rawConfidence', overlongProse],
      ['deep_research.convergence_evaluated', 16, 'qualityGateResults', {
        ...qualityGateInput.qualityGateResults,
        policyVersion: overlongProse,
      }],
      ['deep_research.memory_save_requested', 20, 'sourceEventRange', {
        firstEventId: overlongProse,
        lastEventId: 'event-20',
      }],
    ] as const;

    for (const [stem, index, field, value] of cases) {
      expect(() => prepareDeepResearchEvent(
        eventInputWithDataField(stem, index, field, value),
        registry,
      )).toThrow();
    }
  });

  it('rejects whitespace-only source and passage locator selectors before append', async () => {
    const harness = createHarness();
    const blankSelectors = [' ', '\u00a0'.repeat(2)];

    for (const selector of blankSelectors) {
      const source = eventInput('deep_research.source_captured', 9, '0'.repeat(64));
      expect(() => prepareDeepResearchEvent({
        ...source,
        data: {
          ...source.data,
          locator: { ...source.data.locator, selector },
        },
      }, harness.registry)).toThrow();

      const admission = eventInput(
        'deep_research.evidence_admission_decided',
        10,
        '0'.repeat(64),
      );
      expect(() => prepareDeepResearchEvent({
        ...admission,
        data: {
          ...admission.data,
          passageLocators: admission.data.passageLocators.map((locator) => ({
            ...locator,
            selector,
          })),
        },
      }, harness.registry)).toThrow();
    }

    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({ sequence: 0 });
    await expect(harness.ledger.readVerifiedEvents()).resolves.toHaveLength(0);
  });

  it('rejects prose-shaped source and passage locator selectors before append', async () => {
    const harness = createHarness();
    const proseSelectors = [
      'The collected source states mutable evidence that belongs outside the ledger. '.repeat(30),
      'The collected source states mutable evidence that belongs entirely outside of the append only ledger record boundary here',
    ];

    for (const selector of proseSelectors) {
      const source = eventInput('deep_research.source_captured', 9, '0'.repeat(64));
      expect(() => prepareDeepResearchEvent({
        ...source,
        data: {
          ...source.data,
          locator: { ...source.data.locator, selector },
        },
      }, harness.registry)).toThrow();

      const admission = eventInput(
        'deep_research.evidence_admission_decided',
        10,
        '0'.repeat(64),
      );
      expect(() => prepareDeepResearchEvent({
        ...admission,
        data: {
          ...admission.data,
          passageLocators: admission.data.passageLocators.map((locator) => ({
            ...locator,
            selector,
          })),
        },
      }, harness.registry)).toThrow();
    }

    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({ sequence: 0 });
    await expect(harness.ledger.readVerifiedEvents()).resolves.toHaveLength(0);
  });

  it('accepts a structured locator selector containing a few spaces', () => {
    const harness = createHarness();
    const source = eventInput('deep_research.source_captured', 9, '0'.repeat(64));
    expect(() => prepareDeepResearchEvent({
      ...source,
      data: {
        ...source.data,
        locator: {
          ...source.data.locator,
          selector: 'body > main article p:first-child span.highlight',
        },
      },
    }, harness.registry)).not.toThrow();
  });

  it('authorizes and reads back legitimate tokens and explanatory reasons', async () => {
    const harness = createHarness();
    const cases = [
      ['deep_research.run_initialized', 'convergencePolicyVersion', 'convergence-policy@2'],
      ['deep_research.run_resumed', 'resumeReason', 'Resume after an operator-approved pause.'],
      ['deep_research.run_restarted', 'restartReason', 'Restart after incompatible state.'],
      ['deep_research.evidence_admission_decided', 'admissionPolicyVersion', 'admission@2'],
      ['deep_research.evidence_admission_decided', 'reasonCode', 'verified-primary-source'],
      ['deep_research.claim_superseded', 'supersessionReason', 'Stronger independent evidence.'],
      ['deep_research.next_focus_selected', 'policyVersion', 'focus-policy@2'],
      ['deep_research.convergence_evaluated', 'incompleteReason', 'Coverage remains incomplete.'],
      ['deep_research.convergence_evaluated', 'recoveryReason', 'Gather another source class.'],
      ['deep_research.convergence_blocked', 'incompleteReason', 'A quality gate remains unresolved.'],
      ['deep_research.convergence_blocked', 'recoveryReason', 'Pivot to an independent source.'],
      ['deep_research.memory_save_failed', 'failureReason', 'Storage was temporarily unavailable.'],
      ['deep_research.run_completed', 'completionReason', 'Convergence gates passed.'],
      ['deep_research.run_completed', 'incompleteReason', 'The source-diversity floor was not met.'],
    ] as const;
    let priorHash = '0'.repeat(64);

    for (const [offset, [stem, field, value]] of cases.entries()) {
      const index = offset + 1;
      const input = {
        ...eventInputWithDataField(stem, index, field, value),
        prevEventHash: priorHash,
      };
      const event = prepareDeepResearchEvent(input, harness.registry);
      const proof = await authorize(harness, event, `field-kind-positive-${index}`);
      const receipt = await harness.ledger.appendAuthorized(event, proof);
      priorHash = receipt.recordHash;
    }

    const verified = await harness.ledger.readVerifiedEvents();
    expect(verified).toHaveLength(cases.length);
    for (const [index, entry] of verified.entries()) {
      const [, field, value] = cases[index];
      expect(entry.event.stored.envelope.payload.data[field]).toEqual(value);
    }
  });

  it('rejects in-place claim and judgment updates', () => {
    const registry = createDeepResearchEventRegistry();
    const supersessionInput = eventInput('deep_research.claim_superseded', 13, '0'.repeat(64));
    expect(() => prepareDeepResearchEvent({
      ...supersessionInput,
      data: {
        ...supersessionInput.data,
        successorClaimVersionId: supersessionInput.data.priorClaimVersionId,
      },
    }, registry)).toThrow();

    const asserted = prepareDeepResearchEvent(
      eventInput('deep_research.claim_asserted', 11, '0'.repeat(64)),
      registry,
    );
    expect(() => prepareEventWrite({
      ...asserted.envelope,
      event_type: 'deep-research.ledger.claim-updated',
    }, registry)).toThrow();
    expect(() => prepareEventWrite({
      ...asserted.envelope,
      event_type: 'deep-research.ledger.evidence-admission-updated',
    }, registry)).toThrow();
  });

  it('denies unauthorized transitions before the domain append boundary', async () => {
    const harness = createHarness();
    const event = prepareDeepResearchEvent(
      eventInput('deep_research.run_initialized', 1, '0'.repeat(64)),
      harness.registry,
    );
    const denied = await harness.gateway.authorize(
      await authorizationRequest(harness, event, 'denied-request', 'read-only'),
    );
    expect(denied.verdict).toBe('deny');
    await expect(harness.ledger.appendAuthorized(
      event,
      undefined as unknown as GatewayAllowProof,
    )).rejects.toMatchObject({ code: AuthorizedLedgerErrorCodes.AUTHORIZATION_REQUIRED });
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({ sequence: 0 });
  });

  it('validates the complete admission, relation, claim-status, and convergence vocabularies', () => {
    const registry = createDeepResearchEventRegistry();
    for (const disposition of ['admit', 'degrade', 'quarantine'] as const) {
      const input = eventInput('deep_research.evidence_admission_decided', 10, '0'.repeat(64));
      expect(() => prepareDeepResearchEvent({
        ...input,
        data: { ...input.data, disposition },
      }, registry)).not.toThrow();
    }
    for (const relation of ['contextualizes', 'contradicts', 'qualifies', 'supports'] as const) {
      const input = eventInput('deep_research.claim_relation_recorded', 12, '0'.repeat(64));
      expect(() => prepareDeepResearchEvent({
        ...input,
        data: { ...input.data, relation },
      }, registry)).not.toThrow();
    }
    for (const claimStatus of ['contested', 'supported', 'unresolved'] as const) {
      const input = eventInput('deep_research.claim_asserted', 11, '0'.repeat(64));
      expect(() => prepareDeepResearchEvent({
        ...input,
        data: { ...input.data, claimStatus },
      }, registry)).not.toThrow();
    }
    for (const convergenceDecision of [
      'blocked', 'continue', 'converged', 'incomplete', 'recover',
    ] as const) {
      const input = eventInput('deep_research.convergence_evaluated', 16, '0'.repeat(64));
      expect(() => prepareDeepResearchEvent({
        ...input,
        data: { ...input.data, decision: convergenceDecision },
      }, registry)).not.toThrow();
    }
  });

  // ─────────────────────────────────────────────────────────────────
  // 4. LEGACY COMPATIBILITY
  // ─────────────────────────────────────────────────────────────────

  it('covers every compatibility outcome and blocks unknown events and versions', () => {
    expect(decideDeepResearchCompatibility({
      format: 'deep-research-ledger',
      stem: 'deep_research.run_initialized',
      eventVersion: 1,
    }).status).toBe('exact');
    expect(decideDeepResearchCompatibility({ type: 'progress', schemaVersion: 1 }).status)
      .toBe('compatible');
    expect(decideDeepResearchCompatibility({
      type: 'iteration',
      schemaVersion: 1,
      sessionId: 'run-1',
      parentSessionId: 'lineage-1',
      run: 1,
    }).status).toBe('migrate');
    expect(decideDeepResearchCompatibility({
      type: 'event',
      event: 'idea_promoted',
      schemaVersion: 1,
    }).status).toBe('pin-old-runtime');
    expect(decideDeepResearchCompatibility({ type: 'unknown', schemaVersion: 1 }).status)
      .toBe('blocked');
    expect(decideDeepResearchCompatibility({
      type: 'iteration',
      schemaVersion: 99,
      sessionId: 'run-1',
      parentSessionId: 'lineage-1',
      run: 1,
    }).status).toBe('blocked');
  });

  it('upcasts legacy JSONL purely while preserving source and upcaster digests', () => {
    const record = {
      type: 'iteration',
      schemaVersion: 1,
      sessionId: 'run-1',
      parentSessionId: 'lineage-1',
      run: 1,
      status: 'complete',
      focus: 'source verification',
      newInfoRatio: 0.5,
      ruledOut: [{ approach: 'mutable evidence' }],
    };
    const context = {
      scope: { runId: 'run-1', lineageId: 'lineage-1', iteration: 1 },
      prevEventHash: '0'.repeat(64),
      replay: replayMetadata('legacy-iteration'),
    };
    const first = upcastLegacyDeepResearchRecord(record, context);
    const second = upcastLegacyDeepResearchRecord(record, context);
    expect(second).toEqual(first);
    expect(first.status).toBe('migrated');
    if (first.status !== 'migrated') throw new Error(first.decision.reasonCode);
    expect(first.targetStem).toBe('deep_research.iteration_completed');
    expect(first.originalRecordDigest).toBe(digest(record));
    expect(first.upcasterFingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(record).toEqual(expect.objectContaining({ focus: 'source verification' }));
  });
});
