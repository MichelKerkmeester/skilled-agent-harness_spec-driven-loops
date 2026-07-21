// ───────────────────────────────────────────────────────────────────
// MODULE: Cross-Mode Closure Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import {
  ClosureResponsibilities,
  CrossModeClosureCatalog,
  CrossModeClosureErrorCodes,
  CrossModeClosureImplementations,
  PHASE_013_MODE_IDS,
  admitTypedBudget,
  compareAdditiveDark,
  createCrossModeClosureCatalog,
  createCrossModeClosureContext,
  defineModeDataPolicyOverride,
  invokeBlindedAdjudication,
  normalizeEvidence,
  orderReceiptAndEffects,
  runDeepImprovementCommon,
  updateProjectionAndGauge,
} from '../../lib/cross-mode-closures/index.js';
import { canonicalBytes, canonicalJson, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  AtomicityDomains,
  ProtectedResourceKinds,
  canonicalizeProtectedResource,
} from '../../lib/locks-and-fencing/index.js';

import type {
  AdjudicationInvocationPlan,
  ClosureServicePorts,
  CrossModeClosureContext,
  ModeDataPolicyOverride,
  ProjectionPolicyInput,
  ProjectionUpdateInput,
} from '../../lib/cross-mode-closures/index.js';
import type {
  BudgetDecision,
  BudgetMutationResult,
  BudgetVector,
} from '../../lib/hierarchical-budgets/index.js';
import type {
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../../lib/event-envelope/index.js';
import type { FencedLease, ReplayIdentity } from '../../lib/locks-and-fencing/index.js';
import type { ModeContract, ModeDescriptor } from '../../lib/mode-contracts/index.js';
import type { VerifiedLedgerEvent } from '../../lib/authorized-ledger/index.js';

const FIXED_TIMESTAMP = '2026-07-21T12:00:00.000Z';
const MODE_ID = '003-deep-ai-council';
const MODE_WRITE_RESOURCE = `${MODE_ID}:projection`;

function digest(label: string): string {
  return sha256Bytes(canonicalBytes({ label }));
}

function eventFixture(): EventWritePreflight {
  const envelope = Object.freeze({
    envelope_version: 1,
    event_id: 'event-fixture',
    event_type: 'deep-loop.closure.recorded',
    event_version: 1,
    stream_id: 'closure-stream',
    stream_sequence: 1,
    occurred_at: FIXED_TIMESTAMP,
    recorded_at: FIXED_TIMESTAMP,
    producer: Object.freeze({ name: 'closure-test', version: '1' }),
    authority_epoch: 1,
    correlation_id: 'correlation-fixture',
    causation_id: null,
    idempotency_key: 'closure-event-fixture',
    payload: Object.freeze({ delta: 1 }),
  });
  const bytes = canonicalBytes(envelope as unknown as JsonValue);
  return Object.freeze({
    envelope,
    canonicalBytes: bytes,
    canonicalDigest: sha256Bytes(bytes),
    registryDigest: digest('registry'),
    identity: Object.freeze({
      eventId: envelope.event_id,
      eventType: envelope.event_type,
      eventVersion: envelope.event_version,
      streamId: envelope.stream_id,
      streamSequence: envelope.stream_sequence,
      authorityEpoch: envelope.authority_epoch,
      idempotencyKey: envelope.idempotency_key,
    }),
  });
}

function verifiedEvent(event: EventWritePreflight): VerifiedLedgerEvent {
  return {
    frame: {
      frame_version: 1,
      ledger_id: 'closure-ledger',
      sequence: 1,
      prev_record_hash: '0'.repeat(64),
      canonical_event_hash: event.canonicalDigest,
      authorization_ref: {} as never,
      receipt: {} as never,
      canonical_event_bytes: Buffer.from(event.canonicalBytes).toString('base64'),
      record_hash: digest('record'),
    },
    event: {
      stored: {
        bytes: event.canonicalBytes,
        byteLength: event.canonicalBytes.byteLength,
        digest: event.canonicalDigest,
        envelope: event.envelope,
      },
      effective: {
        envelope: event.envelope,
        canonicalBytes: event.canonicalBytes,
        canonicalDigest: event.canonicalDigest,
      },
      storedVersion: 1,
      effectiveVersion: 1,
      registryDigest: event.registryDigest,
      chainIdentity: 'no-upcast',
      hopTrace: [],
    },
  };
}

function budgetVectorFixture(iterations = 1): BudgetVector {
  return {
    tokens: { kind: 'tokens', unit: 'token', count: 10 },
    cost: {
      kind: 'cost',
      unit: 'minor-unit',
      minorUnits: 2,
      scale: 2,
      currency: 'EUR',
      pricingDigest: digest('pricing'),
    },
    iterations: { kind: 'iterations', unit: 'attempt', attempts: iterations },
    wallTime: {
      kind: 'wall-time',
      unit: 'millisecond',
      durationMs: 100,
      deadlineMonotonicMs: 1_000,
    },
  };
}

function projectionResourceFixture() {
  return {
    kind: ProtectedResourceKinds.PROJECTION,
    components: {
      ledgerId: 'closure-ledger',
      projectionId: 'cross-mode-closure-fixture',
    },
    atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
  } as const;
}

function modeContractFixture(event: EventWritePreflight): ModeContract {
  const descriptor = Object.freeze({
    modeId: MODE_ID,
    displayName: MODE_ID,
    interfaceVersion: '1.0.0',
    interfaceShape: 'deep-loop.mode-contract@1.0.0',
    compatibilityPolicyVersion: 'mode-interface-compatibility@1',
    providedCapabilities: [],
    requiredPorts: [],
    migrationPosture: 'additive-dark',
    legacyAuthority: 'authoritative',
    ledgerAuthority: 'shadow-only',
    writeSet: Object.freeze({
      resources: Object.freeze([{
        resource: MODE_WRITE_RESOURCE,
        conflictKey: MODE_WRITE_RESOURCE,
        owner: Object.freeze({ kind: 'mode-reducer', ownerId: `${MODE_ID}:reducer` }),
        mutation: 'shadow-project',
        serialization: 'fenced-lease',
      }]),
      legacyProjection: 'required',
      ledgerPosture: 'shadow-write',
      authority: 'legacy',
    }),
    compatibilityChanges: [],
    compatibilityAdapters: [],
  } satisfies ModeDescriptor);
  return Object.freeze({
    describe: () => descriptor,
    eventTypes: () => Object.freeze([{
      eventType: event.identity.eventType,
      interfaceVersion: descriptor.interfaceVersion,
    }]),
  }) as unknown as ModeContract;
}

function budgetResult(
  status: BudgetDecision['status'],
  reasonCode: BudgetDecision['reasonCode'],
  dispatchAllowed: boolean,
): BudgetMutationResult {
  return {
    decision: {
      operation: status === 'granted' ? 'admit' : 'fixture',
      requestId: 'request-fixture',
      scopeId: 'mode-scope',
      status,
      reasonCode,
      dispatchAllowed,
      reservationId: 'reservation-fixture',
      dispatchId: 'dispatch-fixture',
      incomplete: status === 'denied' || status === 'anomaly',
      converged: false,
      authority: 'shadow',
    },
    receipt: null,
    isIdempotent: false,
  };
}

interface ContextHarness {
  readonly context: CrossModeClosureContext;
  readonly event: EventWritePreflight;
  readonly calls: string[];
  readonly services: ClosureServicePorts;
}

function contextHarness(options: {
  readonly sealedRead?: () => Promise<unknown>;
  readonly adjudicationInvoke?: ClosureServicePorts['adjudication']['invoke'];
  readonly budgetAdmit?: ClosureServicePorts['budgets']['admit'];
} = {}): ContextHarness {
  const event = eventFixture();
  const verified = verifiedEvent(event);
  const calls: string[] = [];
  const services = {
    authorization: {
      append: vi.fn(async () => {
        calls.push('authorized-ledger-append');
        return {
          status: 'appended' as const,
          receipt: {} as never,
          verified,
        };
      }),
    },
    receipts: {
      effects: {
        execute: vi.fn(async () => {
          calls.push('intent', 'effect', 'confirmation');
          return { status: 'confirmed' } as never;
        }),
        recover: vi.fn(async () => {
          calls.push('intent', 'recovery', 'confirmation');
          return { status: 'confirmed' } as never;
        }),
      },
      boundaries: {
        issue: vi.fn(async () => {
          calls.push('boundary-receipt');
          return { status: 'appended' } as never;
        }),
      },
    },
    sealedArtifacts: {
      readVerified: vi.fn(options.sealedRead ?? (async (reference) => ({ reference }))),
    },
    adjudication: {
      service: {} as never,
      invoke: options.adjudicationInvoke ?? vi.fn(async () => {
        throw new Error('unused adjudication fixture');
      }),
    },
    budgets: {
      admit: options.budgetAdmit ?? vi.fn(async () => budgetResult('granted', 'allowed', true)),
      startAttempt: vi.fn(async () => budgetResult('committed', 'allowed', false)),
      settle: vi.fn(async () => budgetResult('settled', 'allowed', false)),
    },
    gauges: {
      initialAccumulator: vi.fn(() => Object.freeze({ count: 0 })),
      reduce: vi.fn(() => Object.freeze({ count: 1 })),
      finalize: vi.fn(() => Object.freeze({ value: 1 })),
    } as never,
    fencing: {
      coordinator: {} as never,
      stateStore: {
        replace: vi.fn(async () => ({
          resourceDigest: digest('resource'),
          fenceToken: 1,
          priorVersion: 0,
          stateVersion: 1,
          stateDigest: digest('state'),
          replayFingerprint: digest('replay'),
        })),
      },
    },
  } satisfies ClosureServicePorts;

  return {
    event,
    calls,
    services,
    context: createCrossModeClosureContext({
      modeContract: modeContractFixture(event),
      lifecycleEvent: event,
      continuityIdentity: 'continuity-fixture',
      sealedReferences: [],
      services,
      budgetScope: {
        budgetVersion: 1,
        budgetId: 'budget-fixture',
        scope: { kind: 'mode', scopeId: 'mode-scope', parentScopeId: 'program-scope' },
        parentBudgetId: 'program-budget',
        policyVersion: '1',
        replayFingerprint: event.canonicalDigest,
        createdAtMonotonicMs: 0,
        limits: budgetVectorFixture(),
      },
      writeSet: [{
        modeResource: MODE_WRITE_RESOURCE,
        protectedResource: projectionResourceFixture(),
      }],
      correlation: {
        runId: 'run-fixture',
        correlationId: 'correlation-fixture',
        causationId: null,
      },
    }),
  };
}

function adjudicationPlan(event: EventWritePreflight): AdjudicationInvocationPlan {
  return {
    adjudicationId: 'adjudication-fixture',
    request: {
      requestVersion: 1,
      decisionKind: 'deep-ai-council',
      candidateDigests: [digest('a'), digest('b')],
      rubricDigest: digest('rubric'),
      referenceDigest: digest('reference'),
      presentationPolicyVersion: '1',
      judgePolicyVersion: '1',
      counterfactualPolicyVersion: '1',
      reducerVersion: '1',
      requiredCounterfactuals: ['order'],
      quorum: 1,
      minimumEffectiveIndependence: 1,
      tieBehavior: 'inconclusive',
      replayFingerprint: event.canonicalDigest,
      authorityPosture: 'legacy-canonical-shadow-only',
    },
    candidates: [],
    judgePolicy: {},
    counterfactualPolicy: {},
  };
}

function projectionInput(
  harness: ContextHarness,
  override: ModeDataPolicyOverride<ProjectionPolicyInput, JsonObject>,
): ProjectionUpdateInput {
  const lease = {
    resource: canonicalizeProtectedResource(projectionResourceFixture()),
    fenceToken: 1,
    leaseId: 'lease-fixture',
    ownerId: 'owner-fixture',
    correlationId: 'correlation-fixture',
    acquiredAt: FIXED_TIMESTAMP,
    renewedAt: FIXED_TIMESTAMP,
    expiresAt: '2026-07-21T12:05:00.000Z',
  } satisfies FencedLease;
  const replayIdentity = {
    fingerprintVersion: 1,
    ledgerId: 'closure-ledger',
    runId: 'run-fixture',
    rangeStartSequence: 1,
    rangeEndSequence: 1,
    finalDigest: digest('replay'),
  } satisfies ReplayIdentity;
  return {
    authorizedFact: harness.event,
    gaugeId: 'closure-gauge',
    gaugeVersion: '1',
    priorGaugeAccumulator: null,
    priorProjection: { prior: 0 },
    projectionKeys: ['prior', 'total'],
    lease,
    expectedVersion: 0,
    replayIdentity,
    override,
  };
}

describe('cross-mode closures', () => {
  it('binds all manifest modes to exactly one owner and implementation per responsibility', () => {
    expect(CrossModeClosureCatalog.map((row) => row.modeId)).toEqual(PHASE_013_MODE_IDS);
    for (const responsibility of Object.values(ClosureResponsibilities)) {
      expect(new Set(CrossModeClosureCatalog.map((row) => row.owners[responsibility])).size).toBe(1);
      expect(new Set(CrossModeClosureCatalog.map(
        (row) => row.implementations[responsibility],
      )).size).toBe(1);
      expect(CrossModeClosureCatalog[0]?.implementations[responsibility]).toBe(
        CrossModeClosureImplementations[responsibility],
      );
    }
    expect(() => createCrossModeClosureCatalog(PHASE_013_MODE_IDS.slice(0, 7))).toThrowError(
      expect.objectContaining({ code: CrossModeClosureErrorCodes.MANIFEST_INCOMPLETE }),
    );
  });

  it('rejects a mode override that attempts to acquire a safety-port bypass', async () => {
    const harness = contextHarness();
    const bypass = defineModeDataPolicyOverride({
      policyOwner: 'malicious-mode',
      inputVersion: '1',
      outputVersion: '1',
      apply: () => ({
        ...adjudicationPlan(harness.event),
        skipAuthorization: true,
      }),
    });
    await expect(invokeBlindedAdjudication(
      harness.context,
      {},
      bypass as never,
    )).rejects.toMatchObject({ code: CrossModeClosureErrorCodes.INVALID_OVERRIDE });
    expect(harness.services.adjudication.invoke).not.toHaveBeenCalled();
  });

  it('keeps raw service ports private to closure-owned call paths', () => {
    const harness = contextHarness();
    expect(Object.hasOwn(harness.context, 'services')).toBe(false);
    expect(() => (
      harness.context as unknown as { services: ClosureServicePorts }
    ).services.receipts.effects.execute({} as never, {} as never)).toThrow(TypeError);
    expect(harness.services.receipts.effects.execute).not.toHaveBeenCalled();
    expect(harness.services.authorization.append).not.toHaveBeenCalled();
  });

  it('rejects a mode attempt to re-reduce shared adjudication evidence', async () => {
    const harness = contextHarness();
    const localReduction = defineModeDataPolicyOverride({
      policyOwner: 'local-reducer',
      inputVersion: '1',
      outputVersion: '1',
      apply: () => ({
        ...adjudicationPlan(harness.event),
        localVerdict: 'pass',
      }),
    });
    await expect(invokeBlindedAdjudication(
      harness.context,
      {},
      localReduction as never,
    )).rejects.toMatchObject({
      code: CrossModeClosureErrorCodes.LOCAL_ADJUDICATION_REDUCTION_FORBIDDEN,
    });
    expect(harness.services.adjudication.invoke).not.toHaveBeenCalled();
  });

  it('orders authorization before intent, effect, confirmation, and boundary receipt', async () => {
    const harness = contextHarness();
    await orderReceiptAndEffects(harness.context, {
      authorizedFact: harness.event,
      effect: {
        input: {} as never,
        adapter: {} as never,
      },
      boundary: {
        boundaryId: 'boundary-fixture',
        boundaryKind: 'mode-completion',
        scopeId: 'mode-scope',
        resultEventId: harness.event.identity.eventId,
        issuer: 'closure-test',
        certificationProfile: {} as never,
      },
    });
    expect(harness.calls).toEqual([
      'authorized-ledger-append',
      'intent',
      'effect',
      'confirmation',
      'boundary-receipt',
    ]);
  });

  it('returns the shared verdict and raw probes without local re-reduction', async () => {
    const rawJudgments = Object.freeze([{ judgmentId: 'raw-one' }] as never[]);
    const counterfactualResults = Object.freeze([{ probeId: 'probe-one' }] as never[]);
    const event = eventFixture();
    const verdict = {
      adjudicationId: 'adjudication-fixture',
      replayFingerprint: event.canonicalDigest,
      legacyAuthority: 'canonical',
      serviceAuthority: 'shadow-only',
      status: 'unstable',
      preferredCandidateDigest: null,
    } as never;
    const invoke = vi.fn(async () => ({ verdict, rawJudgments, counterfactualResults }));
    const harness = contextHarness({ adjudicationInvoke: invoke });
    const override = defineModeDataPolicyOverride({
      policyOwner: 'council-policy',
      inputVersion: '1',
      outputVersion: '1',
      apply: () => adjudicationPlan(harness.event),
    });
    const output = await invokeBlindedAdjudication(harness.context, {}, override);
    expect(output.verdict).toBe(verdict);
    expect(output.rawJudgments).toBe(rawJudgments);
    expect(output.counterfactualResults).toBe(counterfactualResults);
    expect(output.verdict.status).toBe('unstable');
  });

  it('denies uncertain and exhausted budget accounting before dispatch', async () => {
    const exhausted = vi.fn(async () => budgetResult('denied', 'budget_exhausted', false));
    const harness = contextHarness({ budgetAdmit: exhausted });
    const override = defineModeDataPolicyOverride({
      policyOwner: 'budget-policy',
      inputVersion: '1',
      outputVersion: '1',
      apply: () => ({ estimate: budgetVectorFixture() }),
    });
    const common = {
      operation: 'admit' as const,
      requestId: 'request-fixture',
      reservationId: 'reservation-fixture',
      dispatchId: 'dispatch-fixture',
      leaseDurationMs: 100,
      actorId: 'actor-fixture',
      capabilityId: 'capability-fixture',
      authorityEpoch: 1,
      policyInput: {},
      override,
    };
    const uncertain = await admitTypedBudget(harness.context, {
      ...common,
      accountingStatus: 'uncertain',
    });
    expect(uncertain).toMatchObject({ status: 'denied', reasonCode: 'uncertain-accounting' });
    expect(exhausted).not.toHaveBeenCalled();

    const denied = await admitTypedBudget(harness.context, {
      ...common,
      accountingStatus: 'certain',
    });
    expect(denied).toMatchObject({ status: 'denied', reasonCode: 'budget_exhausted' });
    expect(harness.services.budgets.startAttempt).not.toHaveBeenCalled();
  });

  it('produces byte-stable projection and gauge results on replay', async () => {
    const harness = contextHarness();
    const override = defineModeDataPolicyOverride({
      policyOwner: 'projection-policy',
      inputVersion: '1',
      outputVersion: '1',
      apply: (input) => ({
        prior: input.priorProjection,
        total: (input.gaugeOutput.value as number) + (input.lifecyclePayload.delta as number),
      }),
    });
    const input = projectionInput(harness, override);
    const first = await updateProjectionAndGauge(harness.context, input);
    const second = await updateProjectionAndGauge(harness.context, input);
    expect(canonicalJson(first as unknown as JsonValue)).toBe(
      canonicalJson(second as unknown as JsonValue),
    );
    expect(first.projectionHash).toBe(second.projectionHash);
    expect(first.modeProjection).toEqual({ prior: { prior: 0 }, total: 2 });
  });

  it.each([
    ['nested safety field', { prior: {}, total: 2, meta: { skipFencing: true } }],
    ['top-level safety field', { prior: {}, total: 2, skipFencing: true }],
  ])('rejects projection override output with a %s', async (_case, output) => {
    const harness = contextHarness();
    const override = defineModeDataPolicyOverride<ProjectionPolicyInput, JsonObject>({
      policyOwner: 'projection-attacker',
      inputVersion: '1',
      outputVersion: '1',
      apply: () => output,
    });
    await expect(updateProjectionAndGauge(
      harness.context,
      projectionInput(harness, override),
    )).rejects.toMatchObject({ code: CrossModeClosureErrorCodes.INVALID_OVERRIDE });
    expect(harness.services.fencing.stateStore.replace).not.toHaveBeenCalled();
  });

  it('preserves raw mode evidence while attaching sealed provenance', async () => {
    const harness = contextHarness();
    const rawEvidence = {
      domain_score: 0.73,
      mode_disposition: 'retain-as-supplied',
      nested: { mode_specific: ['a', 'b'] },
    } satisfies JsonObject;
    const output = await normalizeEvidence(harness.context, {
      rawEvidence,
      claimClass: 'hypothesis',
      wouldConfirm: 'A verified replay',
      gateDelta: 'No transition authority',
      scopeState: 'in_scope',
      childResultVerified: false,
      provenance: { source: 'mode-fixture' },
    });
    expect(output.rawEvidence).toEqual(rawEvidence);
    expect(output.validation.status).toBe('present');
    expect(output.contract.claim_class).toBe('hypothesis');
    expect(output.provenance.mode_identity).toBe('003-deep-ai-council');
  });

  it('keeps the legacy result authoritative when shadow closure execution fails', async () => {
    const legacy = Object.freeze({ decision: 'legacy-pass', score: 0.8 });
    const comparison = await compareAdditiveDark(
      legacy,
      async () => { throw new Error('shadow failure'); },
      () => false,
    );
    expect(comparison.legacyResult).toBe(legacy);
    expect(comparison.legacyAuthority).toBe('authoritative');
    expect(comparison.shadow).toMatchObject({ status: 'failed', result: null });
  });

  it('runs deep-improvement common mechanics once before three thin variants', async () => {
    const ports = {
      evaluate: vi.fn(async () => ({ evaluated: true })),
      benchmark: vi.fn(async () => ({ benchmarked: true })),
      promote: vi.fn(async () => ({ promoted: true })),
      verifyMirrors: vi.fn(async () => ({ mirrors: 'verified' })),
    };
    const variant = (name: string) => ({
      policyInput: { schema: name },
      outputKeys: ['schema', 'common_digest'],
      override: defineModeDataPolicyOverride({
        policyOwner: `${name}-policy`,
        inputVersion: '1',
        outputVersion: '1',
        apply: (input: Readonly<JsonObject>) => ({
          schema: (input.variant_policy as JsonObject).schema,
          common_digest: digest(canonicalJson(input.common as JsonValue)),
        }),
      }),
    });
    const output = await runDeepImprovementCommon(ports, {
      commonInput: { candidate: 'fixture' },
      variants: {
        '005-agent-improvement': variant('agent'),
        '006-model-benchmark': variant('model'),
        '007-skill-benchmark': variant('skill'),
      },
    });
    expect(ports.evaluate).toHaveBeenCalledTimes(1);
    expect(ports.benchmark).toHaveBeenCalledTimes(1);
    expect(ports.promote).toHaveBeenCalledTimes(1);
    expect(ports.verifyMirrors).toHaveBeenCalledTimes(1);
    expect(output.executionOrder).toEqual([
      '004-deep-improvement-common',
      '005-agent-improvement',
      '006-model-benchmark',
      '007-skill-benchmark',
    ]);
    expect(Object.keys(output.variants)).toHaveLength(3);
    expect(output.variants['005-agent-improvement']).toEqual({
      schema: 'agent',
      common_digest: expect.any(String),
    });
  });

  it.each([
    ['nested safety field', { schema: 'agent', common_digest: digest('common'), meta: { skipBudgetAdmission: true } }],
    ['top-level safety field', { schema: 'agent', common_digest: digest('common'), skipBudgetAdmission: true }],
  ])('rejects deep-improvement variant output with a %s', async (_case, output) => {
    const ports = {
      evaluate: vi.fn(async () => ({ evaluated: true })),
      benchmark: vi.fn(async () => ({ benchmarked: true })),
      promote: vi.fn(async () => ({ promoted: true })),
      verifyMirrors: vi.fn(async () => ({ mirrors: 'verified' })),
    };
    const honestVariant = (name: string) => ({
      policyInput: { schema: name },
      outputKeys: ['schema', 'common_digest'],
      override: defineModeDataPolicyOverride({
        policyOwner: `${name}-policy`,
        inputVersion: '1',
        outputVersion: '1',
        apply: () => ({ schema: name, common_digest: digest('common') }),
      }),
    });
    await expect(runDeepImprovementCommon(ports, {
      commonInput: { candidate: 'fixture' },
      variants: {
        '005-agent-improvement': {
          policyInput: { schema: 'agent' },
          outputKeys: ['schema', 'common_digest'],
          override: defineModeDataPolicyOverride({
            policyOwner: 'agent-attacker',
            inputVersion: '1',
            outputVersion: '1',
            apply: () => output,
          }),
        },
        '006-model-benchmark': honestVariant('model'),
        '007-skill-benchmark': honestVariant('skill'),
      },
    })).rejects.toMatchObject({ code: CrossModeClosureErrorCodes.INVALID_OVERRIDE });
    expect(ports.verifyMirrors).toHaveBeenCalledTimes(1);
  });
});
