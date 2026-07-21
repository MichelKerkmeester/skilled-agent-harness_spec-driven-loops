// ───────────────────────────────────────────────────────────────────
// TEST: Receipts and Effect Recovery
// ───────────────────────────────────────────────────────────────────

import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  createReplayFingerprintVersionRegistry,
  deriveReplayFingerprint,
} from '../../lib/replay-fingerprint/index.js';
import {
  AuthorizedEvidenceWriter,
  BoundaryReceiptIssuer,
  CertificationProviderRegistry,
  DEFAULT_BOUNDARY_DEFINITIONS,
  DEFAULT_BOUNDARY_MANIFEST_DIGEST,
  EFFECT_CONFIRMATION_EVENT_TYPE,
  EFFECT_CONFLICT_EVENT_TYPE,
  EFFECT_INTENT_EVENT_TYPE,
  EFFECT_OPERATOR_RESOLVED_EVENT_TYPE,
  EFFECT_RECONCILED_EVENT_TYPE,
  EFFECT_RECOVERY_STARTED_EVENT_TYPE,
  EffectRecoveryGateway,
  LEGACY_RECOVERY_SURFACES,
  LEGACY_RECOVERY_SURFACE_MANIFEST_DIGEST,
  ReceiptEffectErrorCodes,
  assessLegacyDispatchReceipt,
  atomicFileTargetIdentity,
  createAtomicFileEffectAdapter,
  createBoundaryRegistry,
  createEvidenceControlEventRegistry,
  createEvidenceControlReplayComponentRegistry,
  createEvidenceControlReplayInput,
  createHmacCertificationProvider,
  createIdempotentApiEffectAdapter,
  createSubprocessEffectAdapter,
  deriveEffectIdempotencyKey,
  effectAdapterManifestDigest,
  verifyBoundaryReceiptCertification,
  verifyBoundaryReceiptEvent,
} from '../../lib/receipts-and-effect-recovery/index.js';
import {
  deriveReceiptKey,
  signReceipt,
} from '../../lib/deep-loop/receipt-crypto.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type {
  EventTypeRegistry,
  JsonObject,
} from '../../lib/event-envelope/index.js';
import type {
  AtomicFileEffectRequest,
  BoundaryKind,
  BoundaryReceiptPayload,
  CertificationProfile,
  EffectAdapter,
  EffectExecutionInput,
  EffectObservation,
  EffectRecoveryClaim,
  EffectReconciliationObservation,
  RecoveryVerdict,
} from '../../lib/receipts-and-effect-recovery/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const T0 = '2026-07-21T10:00:00.000Z';
const T1 = '2026-07-21T10:01:00.000Z';
const T2 = '2026-07-21T10:02:00.000Z';
const T3 = '2026-07-21T10:03:00.000Z';
const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
const STATE_FINGERPRINT = sha256Bytes(canonicalBytes({ state: 'dark' }));
const EVIDENCE_DIGEST = sha256Bytes(canonicalBytes({ evidence: 'fixture' }));
const ARTIFACT_DIGEST = sha256Bytes(canonicalBytes({ artifact: 'fixture' }));
const REPLAY_FINGERPRINT = sha256Bytes(canonicalBytes({ replay: 'fixture' }));
const POSTCONDITION_DIGEST = sha256Bytes(canonicalBytes({ applied: true }));
const PROVIDER_SECRET = 'durable-provider-secret-material-0001';
const PRODUCER = Object.freeze({ name: 'receipt-effect-tests', version: '1' });

const roots: string[] = [];

interface Harness {
  readonly rootDirectory: string;
  readonly registry: EventTypeRegistry;
  readonly policies: TransitionPolicyRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly writer: AuthorizedEvidenceWriter;
}

interface ApiRequest {
  readonly mutation: string;
}

interface ApiTarget {
  readonly adapter: EffectAdapter<ApiRequest>;
  readonly mutations: () => number;
}

interface FileFixture {
  readonly adapter: EffectAdapter<AtomicFileEffectRequest>;
  readonly execution: EffectExecutionInput<AtomicFileEffectRequest>;
  readonly request: AtomicFileEffectRequest;
  readonly targetRoot: string;
}

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `receipt-effect-${label}-`));
  roots.push(root);
  return root;
}

function evaluateAllow(
  _input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  return { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['dark-write'] };
}

function createHarness(
  label: string,
  evaluate: (input: Readonly<PolicyEvaluationInput>) => PolicyEvaluationResult = evaluateAllow,
): Harness {
  const rootDirectory = temporaryRoot(label);
  const registry = createEvidenceControlEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'dark-evidence-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['dark-write'],
    evaluate,
  }]);
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: 'dark-evidence',
    auditLedgerId: 'dark-evidence-authorization',
    authorityProvider: () => AUTHORITY,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: 'dark-evidence-authorization',
    authorityProvider: () => AUTHORITY,
  }, ledger, policies);
  const writer = new AuthorizedEvidenceWriter({
    ledger,
    gateway,
    policies,
    registry,
    authorizationContext: (event) => ({
      mode: 'research',
      priorStateVersion: 'dark-state@1',
      priorStateFingerprint: STATE_FINGERPRINT,
      actorId: 'dark-service',
      capabilityId: 'write',
      authorityEpoch: event.identity.authorityEpoch,
      policyId: 'dark-evidence-policy',
      policyVersion: 1,
      evidenceDigest: event.canonicalDigest,
    }),
  });
  return { rootDirectory, registry, policies, ledger, writer };
}

function durableProfile(keyId = 'receipt-key-1'): CertificationProfile {
  return Object.freeze({
    scheme: 'hmac-sha256',
    provider_id: 'durable-fixture-provider',
    key_id: keyId,
    verifier_version: '1',
    trust_scope: 'durable-cross-resume',
  });
}

function advisoryProfile(): CertificationProfile {
  return Object.freeze({
    scheme: 'hmac-sha256',
    provider_id: 'process-local-provider',
    key_id: 'ephemeral-key',
    verifier_version: '1',
    trust_scope: 'process-local-advisory',
  });
}

function providers(profile = durableProfile()): CertificationProviderRegistry {
  return new CertificationProviderRegistry([
    createHmacCertificationProvider(profile, PROVIDER_SECRET),
  ]);
}

async function appendBoundaryResult(
  harness: Harness,
  options: Readonly<{
    boundaryId?: string;
    boundaryKind?: BoundaryKind;
    eventId?: string;
    evidenceDigest?: string;
    scopeId?: string;
    streamSequence?: number;
  }> = {},
): Promise<void> {
  const boundaries = createBoundaryRegistry();
  const definition = boundaries.resolve(options.boundaryKind ?? 'phase-completion');
  const boundaryId = options.boundaryId ?? 'boundary-1';
  const eventId = options.eventId ?? 'phase-result-1';
  const scopeId = options.scopeId ?? 'fixture-phase';
  const event = prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: eventId,
    event_type: definition.resultEventType,
    event_version: 1,
    stream_id: `${definition.scope}:${scopeId}`,
    stream_sequence: options.streamSequence ?? 1,
    occurred_at: T0,
    recorded_at: T0,
    producer: PRODUCER,
    authority_epoch: 1,
    correlation_id: 'boundary-correlation',
    causation_id: null,
    idempotency_key: `boundary-result:${eventId}`,
    payload: {
      boundary_id: boundaryId,
      scope_id: scopeId,
      from_state: definition.allowedFromStates[0],
      to_state: definition.toState,
      result_code: definition.resultCode,
      evidence_digest: options.evidenceDigest ?? EVIDENCE_DIGEST,
      artifact_digests: [ARTIFACT_DIGEST],
      replay_fingerprint: REPLAY_FINGERPRINT,
    },
  }, harness.registry);
  await harness.writer.append(event);
}

function receiptIssuer(
  harness: Harness,
  profile = durableProfile(),
  registry = providers(profile),
): BoundaryReceiptIssuer {
  return new BoundaryReceiptIssuer({
    writer: harness.writer,
    registry: harness.registry,
    boundaries: createBoundaryRegistry(),
    providers: registry,
    producer: PRODUCER,
    now: () => new Date(T1),
  });
}

function effectInput(
  overrides: Readonly<Partial<EffectExecutionInput<ApiRequest>>> = {},
): EffectExecutionInput<ApiRequest> {
  const request = overrides.request ?? { mutation: 'alpha' };
  return {
    runId: 'run-1',
    logicalEffectId: 'logical-effect-1',
    operation: 'apply-fixture-mutation',
    targetIdentity: 'api:fixture-target',
    request,
    canonicalInput: { mutation: request.mutation },
    safeMetadata: { mutation_kind: 'fixture' },
    secretReferences: ['vault:fixture/credential'],
    recoveryPolicy: 'reconcile-before-replay',
    expectedPostconditionDigest: POSTCONDITION_DIGEST,
    replayFingerprint: REPLAY_FINGERPRINT,
    requestedAt: T1,
    authorityEpoch: 1,
    correlationId: 'effect-correlation',
    causationId: null,
    ...overrides,
  };
}

function observation(
  intentKey: string,
  observedAt = T2,
): EffectObservation {
  return Object.freeze({
    durability: 'verified',
    external_receipt_digest: sha256Bytes(canonicalBytes({ intentKey })),
    postcondition_digest: POSTCONDITION_DIGEST,
    output_digest: sha256Bytes(canonicalBytes({ output: 'fixture' })),
    observed_at: observedAt,
    safe_result_metadata: Object.freeze({ result_kind: 'fixture' }),
  });
}

function apiTarget(
  forcedVerdict?: RecoveryVerdict,
  onMutate?: () => Promise<void> | void,
): ApiTarget {
  const applied = new Map<string, EffectObservation>();
  let mutationCount = 0;
  const adapter = createIdempotentApiEffectAdapter<ApiRequest>({
    adapterId: 'fixture-api',
    adapterVersion: '1',
    supportsProviderIdempotency: true,
    supportsStatusQuery: true,
    async mutate(_request, key): Promise<EffectObservation> {
      await onMutate?.();
      const existing = applied.get(key);
      if (existing) return existing;
      mutationCount += 1;
      const result = observation(key);
      applied.set(key, result);
      return result;
    },
    async query(_request, key): Promise<EffectReconciliationObservation> {
      const existing = applied.get(key);
      const verdict = forcedVerdict ?? (existing ? 'applied' : 'not_applied');
      return Object.freeze({
        verdict,
        reason_code: `fixture_${verdict}`,
        evidence_digest: sha256Bytes(canonicalBytes({ verdict, key })),
        observed_at: T3,
        observation: verdict === 'applied' ? existing ?? observation(key, T3) : null,
      });
    },
  });
  return { adapter, mutations: () => mutationCount };
}

function claim(overrides: Readonly<Partial<EffectRecoveryClaim>> = {}): EffectRecoveryClaim {
  return Object.freeze({
    claim_id: 'claim-1',
    claimant_id: 'recovery-worker',
    fence_token: 'fence-1',
    acquired_at: T2,
    ...overrides,
  });
}

function effectGateway(
  harness: Harness,
  options: Readonly<{
    afterIntent?: () => void;
    afterEffectBeforeConfirmation?: () => void;
    maxRecoveryAttempts?: number;
    validateClaim?: (candidate: Readonly<EffectRecoveryClaim>) => boolean;
  }> = {},
): EffectRecoveryGateway {
  return new EffectRecoveryGateway({
    writer: harness.writer,
    registry: harness.registry,
    producer: PRODUCER,
    now: () => new Date(T3),
    maxRecoveryAttempts: options.maxRecoveryAttempts,
    validateRecoveryClaim: (candidate) =>
      options.validateClaim?.(candidate) ?? candidate.fence_token === 'fence-1',
    faultInjection: {
      afterIntent: options.afterIntent,
      afterEffectBeforeConfirmation: options.afterEffectBeforeConfirmation,
    },
  });
}

function fileFixture(label: string, relativePath = 'published.txt'): FileFixture {
  const targetRoot = temporaryRoot(label);
  const request: AtomicFileEffectRequest = {
    relativePath,
    content: 'durable content\n',
    expectedPriorDigest: null,
  };
  const contentDigest = sha256Bytes(Buffer.from(request.content, 'utf8'));
  return {
    targetRoot,
    request,
    execution: {
      ...effectInput(),
      logicalEffectId: `file-publication-${label}`,
      operation: 'publish-file',
      targetIdentity: atomicFileTargetIdentity(request.relativePath),
      request,
      canonicalInput: {
        relative_path: request.relativePath,
        content: request.content,
        expected_prior_digest: request.expectedPriorDigest,
      },
      expectedPostconditionDigest: contentDigest,
      safeMetadata: { publication_kind: 'fixture' },
    },
    adapter: createAtomicFileEffectAdapter({
      rootDirectory: targetRoot,
      now: () => new Date(T2),
    }),
  };
}

async function eventTypes(harness: Harness): Promise<string[]> {
  return (await harness.writer.readVerifiedEvents())
    .map((event) => event.event.effective.envelope.event_type);
}

afterEach(() => {
  while (roots.length > 0) {
    const root = roots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 2. BOUNDARY RECEIPTS
// ───────────────────────────────────────────────────────────────────

describe('boundary receipts', () => {
  it('registers every phase and mode boundary without intermediate events', () => {
    expect(DEFAULT_BOUNDARY_DEFINITIONS).toHaveLength(12);
    expect(new Set(DEFAULT_BOUNDARY_DEFINITIONS.map((entry) => entry.boundaryKind)).size).toBe(12);
    expect(DEFAULT_BOUNDARY_DEFINITIONS.every((entry) =>
      ['enter', 'pause', 'resume', 'completion', 'abort', 'handoff'].includes(entry.action))).toBe(true);
  });

  it.each(DEFAULT_BOUNDARY_DEFINITIONS)(
    'certifies and deduplicates the $boundaryKind boundary',
    async (definition) => {
      const harness = createHarness(`boundary-${definition.boundaryKind}`);
      const boundaryId = `boundary-${definition.boundaryKind}`;
      const resultEventId = `result-${definition.boundaryKind}`;
      const scopeId = `fixture-${definition.scope}`;
      await appendBoundaryResult(harness, {
        boundaryId,
        boundaryKind: definition.boundaryKind,
        eventId: resultEventId,
        scopeId,
      });
      const issuer = receiptIssuer(harness);
      const issueInput = {
        boundaryId,
        boundaryKind: definition.boundaryKind,
        scopeId,
        resultEventId,
        issuer: 'fixture-issuer',
        certificationProfile: durableProfile(),
      };
      const issued = await issuer.issue(issueInput);
      const retry = await issuer.issue(issueInput);
      const events = await harness.writer.readVerifiedEvents();

      expect(issued.status).toBe('appended');
      expect(retry.status).toBe('idempotent');
      expect(events.filter((event) =>
        event.event.effective.envelope.event_type === 'deep-loop.receipt.boundary-certified'))
        .toHaveLength(1);
      await expect(verifyBoundaryReceiptEvent(
        events[1]!,
        events,
        createBoundaryRegistry(),
        providers(),
      )).resolves.toMatchObject({ boundary_kind: definition.boundaryKind });
    },
  );

  it('issues one durable receipt after the exact committed result and head', async () => {
    const harness = createHarness('receipt-order');
    await appendBoundaryResult(harness);
    const providerRegistry = providers();
    const result = await receiptIssuer(harness, durableProfile(), providerRegistry).issue({
      boundaryId: 'boundary-1',
      boundaryKind: 'phase-completion',
      scopeId: 'fixture-phase',
      resultEventId: 'phase-result-1',
      issuer: 'fixture-issuer',
      certificationProfile: durableProfile(),
    });

    expect(result.status).toBe('appended');
    expect(result.receipt.sequence).toBe(2);
    expect(result.payload.result_head.sequence).toBe(1);
    expect(result.payload.from_head.sequence).toBe(0);
    const events = await harness.writer.readVerifiedEvents();
    await expect(verifyBoundaryReceiptEvent(
      events[1]!,
      events,
      createBoundaryRegistry(),
      providerRegistry,
    )).resolves.toMatchObject({ receipt_id: result.payload.receipt_id });
  });

  it('returns the original receipt on exact retry without another frame', async () => {
    const harness = createHarness('receipt-retry');
    await appendBoundaryResult(harness);
    const firstIssuer = receiptIssuer(harness);
    const secondIssuer = receiptIssuer(harness);
    const request = {
      boundaryId: 'boundary-1',
      boundaryKind: 'phase-completion' as const,
      scopeId: 'fixture-phase',
      resultEventId: 'phase-result-1',
      issuer: 'fixture-issuer',
      certificationProfile: durableProfile(),
    };
    const [first, concurrent] = await Promise.all([
      firstIssuer.issue(request),
      secondIssuer.issue(request),
    ]);
    const retry = await firstIssuer.issue(request);

    expect(retry.status).toBe('idempotent');
    expect(retry.payload).toEqual(first.payload);
    expect([first.status, concurrent.status].sort()).toEqual(['appended', 'idempotent']);
    expect((await harness.ledger.getVerifiedHead()).sequence).toBe(2);
  });

  it('verifies after provider reconstruction and rejects any fact mutation', async () => {
    const harness = createHarness('receipt-restart');
    await appendBoundaryResult(harness);
    const issued = await receiptIssuer(harness).issue({
      boundaryId: 'boundary-1',
      boundaryKind: 'phase-completion',
      scopeId: 'fixture-phase',
      resultEventId: 'phase-result-1',
      issuer: 'fixture-issuer',
      certificationProfile: durableProfile(),
    });
    const restartedProviders = providers();
    await expect(verifyBoundaryReceiptCertification(
      issued.payload,
      restartedProviders,
    )).resolves.toBeUndefined();

    const mutated = JSON.parse(JSON.stringify(issued.payload)) as BoundaryReceiptPayload;
    (mutated as { result_code: string }).result_code = 'aborted';
    await expect(verifyBoundaryReceiptCertification(mutated, restartedProviders))
      .rejects.toMatchObject({ code: ReceiptEffectErrorCodes.CERTIFICATION_INVALID });
  });

  it('fails closed for unknown providers and advisory process-local profiles', async () => {
    const harness = createHarness('receipt-trust');
    await appendBoundaryResult(harness);
    const issued = await receiptIssuer(harness).issue({
      boundaryId: 'boundary-1',
      boundaryKind: 'phase-completion',
      scopeId: 'fixture-phase',
      resultEventId: 'phase-result-1',
      issuer: 'fixture-issuer',
      certificationProfile: durableProfile(),
    });
    await expect(verifyBoundaryReceiptCertification(
      issued.payload,
      new CertificationProviderRegistry([]),
    )).rejects.toMatchObject({
      code: ReceiptEffectErrorCodes.CERTIFICATION_PROVIDER_UNKNOWN,
    });

    const advisoryProviders = providers(advisoryProfile());
    await expect(receiptIssuer(harness, advisoryProfile(), advisoryProviders).issue({
      boundaryId: 'boundary-2',
      boundaryKind: 'phase-completion',
      scopeId: 'fixture-phase',
      resultEventId: 'phase-result-1',
      issuer: 'fixture-issuer',
      certificationProfile: advisoryProfile(),
    })).rejects.toMatchObject({
      code: ReceiptEffectErrorCodes.DURABLE_CERTIFICATION_REQUIRED,
    });
  });

  it('rejects reused boundary identity with changed result or signer metadata', async () => {
    const harness = createHarness('receipt-conflict');
    await appendBoundaryResult(harness);
    await receiptIssuer(harness).issue({
      boundaryId: 'boundary-1',
      boundaryKind: 'phase-completion',
      scopeId: 'fixture-phase',
      resultEventId: 'phase-result-1',
      issuer: 'fixture-issuer',
      certificationProfile: durableProfile(),
    });
    await appendBoundaryResult(harness, {
      eventId: 'phase-result-2',
      streamSequence: 2,
      evidenceDigest: sha256Bytes(canonicalBytes({ evidence: 'changed' })),
    });
    await expect(receiptIssuer(harness).issue({
      boundaryId: 'boundary-1',
      boundaryKind: 'phase-completion',
      scopeId: 'fixture-phase',
      resultEventId: 'phase-result-2',
      issuer: 'fixture-issuer',
      certificationProfile: durableProfile(),
    })).rejects.toMatchObject({ code: ReceiptEffectErrorCodes.RECEIPT_CONFLICT });

    const changedProfile = durableProfile('receipt-key-2');
    await expect(receiptIssuer(harness, changedProfile, providers(changedProfile)).issue({
      boundaryId: 'boundary-1',
      boundaryKind: 'phase-completion',
      scopeId: 'fixture-phase',
      resultEventId: 'phase-result-1',
      issuer: 'fixture-issuer',
      certificationProfile: changedProfile,
    })).rejects.toMatchObject({ code: ReceiptEffectErrorCodes.RECEIPT_CONFLICT });
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. EFFECT ORDERING AND IDEMPOTENCY
// ───────────────────────────────────────────────────────────────────

describe('effect ordering and idempotency', () => {
  it('derives stable keys across resume and excludes attempt and process identity', () => {
    const first = effectInput();
    const resumed = {
      ...effectInput(),
      requestedAt: T3,
      attempt: 99,
      processId: 12345,
    };
    expect(deriveEffectIdempotencyKey(first)).toBe(deriveEffectIdempotencyKey(resumed));
    expect(deriveEffectIdempotencyKey(effectInput({ targetIdentity: 'api:other' })))
      .not.toBe(deriveEffectIdempotencyKey(first));
    expect(deriveEffectIdempotencyKey(effectInput({
      request: { mutation: 'beta' },
      canonicalInput: { mutation: 'beta' },
    }))).not.toBe(deriveEffectIdempotencyKey(first));
  });

  it('makes intent visible through the verified reader before adapter invocation', async () => {
    const harness = createHarness('intent-order');
    const target = apiTarget(undefined, async () => {
      expect(await eventTypes(harness)).toEqual([EFFECT_INTENT_EVENT_TYPE]);
    });
    const result = await effectGateway(harness).execute(effectInput(), target.adapter);

    expect(result.status).toBe('confirmed');
    expect(await eventTypes(harness)).toEqual([
      EFFECT_INTENT_EVENT_TYPE,
      EFFECT_CONFIRMATION_EVENT_TYPE,
    ]);
  });

  it('does not invoke an adapter when transition authorization denies intent', async () => {
    const harness = createHarness('intent-denied', () => ({
      verdict: 'deny',
      reasonCode: 'policy_denied',
      matchedRuleIds: [],
    }));
    const target = apiTarget();

    await expect(effectGateway(harness).execute(effectInput(), target.adapter))
      .rejects.toMatchObject({ code: ReceiptEffectErrorCodes.AUTHORIZATION_DENIED });
    expect(target.mutations()).toBe(0);
    expect(await eventTypes(harness)).toEqual([]);
  });

  it('does not return success when target application precedes a missing confirmation', async () => {
    const harness = createHarness('confirmation-order');
    const target = apiTarget();
    const gateway = effectGateway(harness, {
      afterEffectBeforeConfirmation: () => { throw new Error('response lost'); },
    });
    await expect(gateway.execute(effectInput(), target.adapter)).rejects.toThrow('response lost');
    expect(target.mutations()).toBe(1);
    expect(await eventTypes(harness)).toEqual([EFFECT_INTENT_EVENT_TYPE]);
  });

  it('deduplicates concurrent and later exact calls to one external mutation', async () => {
    const harness = createHarness('effect-concurrency');
    const target = apiTarget();
    const firstGateway = effectGateway(harness);
    const secondGateway = effectGateway(harness);
    const [first, second] = await Promise.all([
      firstGateway.execute(effectInput(), target.adapter),
      secondGateway.execute(effectInput(), target.adapter),
    ]);
    const third = await firstGateway.execute(effectInput(), target.adapter);

    expect(target.mutations()).toBe(1);
    expect([first.status, second.status].sort()).toEqual(['confirmed', 'idempotent']);
    expect(third.status).toBe('idempotent');
    expect(await eventTypes(harness)).toEqual([
      EFFECT_INTENT_EVENT_TYPE,
      EFFECT_CONFIRMATION_EVENT_TYPE,
    ]);
  });

  it('records changed logical-effect facts as conflict without another mutation', async () => {
    const harness = createHarness('effect-conflict');
    const target = apiTarget();
    const gateway = effectGateway(harness);
    await gateway.execute(effectInput(), target.adapter);
    await expect(gateway.execute(effectInput({
      request: { mutation: 'beta' },
      canonicalInput: { mutation: 'beta' },
    }), target.adapter)).rejects.toMatchObject({ code: ReceiptEffectErrorCodes.EFFECT_CONFLICT });

    expect(target.mutations()).toBe(1);
    expect(await eventTypes(harness)).toEqual([
      EFFECT_INTENT_EVENT_TYPE,
      EFFECT_CONFIRMATION_EVENT_TYPE,
      EFFECT_CONFLICT_EVENT_TYPE,
    ]);
  });

  it('rejects secret-shaped evidence and non-replayable API capabilities before intent', async () => {
    const harness = createHarness('effect-security');
    const target = apiTarget();
    await expect(effectGateway(harness).execute(effectInput({
      safeMetadata: { api_token: 'sk-secret-value-123456' },
    }), target.adapter)).rejects.toMatchObject({
      code: ReceiptEffectErrorCodes.SECRET_MATERIAL_FORBIDDEN,
    });
    await expect(effectGateway(harness).execute(effectInput({
      secretReferences: ['raw-secret-value'],
    }), target.adapter)).rejects.toMatchObject({
      code: ReceiptEffectErrorCodes.SECRET_MATERIAL_FORBIDDEN,
    });

    const unsupported = createIdempotentApiEffectAdapter<ApiRequest>({
      adapterId: 'opaque-api',
      adapterVersion: '1',
      supportsProviderIdempotency: false,
      supportsStatusQuery: false,
      mutate: async () => observation('opaque'),
      query: async () => ({
        verdict: 'in_doubt',
        reason_code: 'unavailable',
        evidence_digest: EVIDENCE_DIGEST,
        observed_at: T2,
        observation: null,
      }),
    });
    await expect(effectGateway(harness).execute(effectInput(), unsupported))
      .rejects.toMatchObject({ code: ReceiptEffectErrorCodes.ADAPTER_UNSUPPORTED });
    expect(await eventTypes(harness)).toEqual([]);
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. CRASH AND RECOVERY
// ───────────────────────────────────────────────────────────────────

describe('crash and recovery', () => {
  it('leaves no durable intent or target mutation when execution stops before intent', async () => {
    const harness = createHarness('crash-before-intent');
    const target = apiTarget();
    const gateway = new EffectRecoveryGateway({
      writer: harness.writer,
      registry: harness.registry,
      producer: PRODUCER,
      now: () => new Date(T3),
      validateRecoveryClaim: () => true,
      faultInjection: {
        beforeIntent: () => { throw new Error('crash before intent'); },
      },
    });

    await expect(gateway.execute(effectInput(), target.adapter))
      .rejects.toThrow('crash before intent');
    expect(target.mutations()).toBe(0);
    expect(await eventTypes(harness)).toEqual([]);
  });

  it('deduplicates response loss after durable confirmation without replay', async () => {
    const harness = createHarness('crash-after-confirmation');
    const target = apiTarget();
    const gateway = new EffectRecoveryGateway({
      writer: harness.writer,
      registry: harness.registry,
      producer: PRODUCER,
      now: () => new Date(T3),
      validateRecoveryClaim: () => true,
      faultInjection: {
        afterConfirmationBeforeResponse: () => { throw new Error('response lost'); },
      },
    });

    await expect(gateway.execute(effectInput(), target.adapter))
      .rejects.toThrow('response lost');
    expect(target.mutations()).toBe(1);
    expect(await eventTypes(harness)).toEqual([
      EFFECT_INTENT_EVENT_TYPE,
      EFFECT_CONFIRMATION_EVENT_TYPE,
    ]);
    await expect(effectGateway(harness).execute(effectInput(), target.adapter))
      .resolves.toMatchObject({ status: 'idempotent' });
    expect(target.mutations()).toBe(1);
  });

  it('recovers an adapter interruption without losing the durable intent', async () => {
    const harness = createHarness('crash-during-effect');
    let interrupt = true;
    const target = apiTarget(undefined, () => {
      if (interrupt) {
        interrupt = false;
        throw new Error('adapter interrupted');
      }
    });

    await expect(effectGateway(harness).execute(effectInput(), target.adapter))
      .rejects.toMatchObject({ code: ReceiptEffectErrorCodes.EFFECT_EXECUTION_FAILED });
    expect(target.mutations()).toBe(0);
    expect(await eventTypes(harness)).toEqual([EFFECT_INTENT_EVENT_TYPE]);

    await expect(effectGateway(harness).recover({
      execution: effectInput(),
      claim: claim(),
      reasonCode: 'resume_interrupted_adapter',
      startedAt: T2,
    }, target.adapter)).resolves.toMatchObject({ status: 'confirmed', verdict: 'not_applied' });
    expect(target.mutations()).toBe(1);
  });

  it('recovers post-intent/pre-effect as not_applied and executes once with the same key', async () => {
    const harness = createHarness('recover-not-applied');
    const target = apiTarget();
    await expect(effectGateway(harness, {
      afterIntent: () => { throw new Error('crash after intent'); },
    }).execute(effectInput(), target.adapter)).rejects.toThrow('crash after intent');
    expect(target.mutations()).toBe(0);

    const recovered = await effectGateway(harness).recover({
      execution: effectInput(),
      claim: claim(),
      reasonCode: 'resume_unresolved_intent',
      startedAt: T2,
    }, target.adapter);
    expect(recovered).toMatchObject({ status: 'confirmed', verdict: 'not_applied' });
    expect(target.mutations()).toBe(1);
    expect(await eventTypes(harness)).toEqual([
      EFFECT_INTENT_EVENT_TYPE,
      EFFECT_RECOVERY_STARTED_EVENT_TYPE,
      EFFECT_RECONCILED_EVENT_TYPE,
      EFFECT_CONFIRMATION_EVENT_TYPE,
    ]);
  });

  it('recovers post-application/pre-confirmation as applied without replay', async () => {
    const harness = createHarness('recover-applied');
    const target = apiTarget();
    await expect(effectGateway(harness, {
      afterEffectBeforeConfirmation: () => { throw new Error('crash after application'); },
    }).execute(effectInput(), target.adapter)).rejects.toThrow('crash after application');
    expect(target.mutations()).toBe(1);

    const recovered = await effectGateway(harness).recover({
      execution: effectInput(),
      claim: claim(),
      reasonCode: 'resume_unresolved_intent',
      startedAt: T2,
    }, target.adapter);
    expect(recovered).toMatchObject({ status: 'confirmed', verdict: 'applied' });
    expect(target.mutations()).toBe(1);
  });

  it('records in_doubt and requires operator action without replay or confirmation', async () => {
    const harness = createHarness('recover-in-doubt');
    const target = apiTarget('in_doubt');
    await expect(effectGateway(harness, {
      afterIntent: () => { throw new Error('crash after intent'); },
    }).execute(effectInput(), target.adapter)).rejects.toThrow();
    const gateway = effectGateway(harness);
    const recovered = await gateway.recover({
      execution: effectInput(),
      claim: claim(),
      reasonCode: 'resume_unresolved_intent',
      startedAt: T2,
    }, target.adapter);

    expect(recovered).toMatchObject({ status: 'operator_required', verdict: 'in_doubt' });
    expect(target.mutations()).toBe(0);
    expect(await eventTypes(harness)).not.toContain(EFFECT_CONFIRMATION_EVENT_TYPE);
    await expect(gateway.resolveOperatorDecision({
      execution: effectInput(),
      adapter: target.adapter,
      recoveryId: recovered.recovery.recovery_id,
      operatorId: 'operator-1',
      resolution: 'terminal_failed',
      evidenceDigest: EVIDENCE_DIGEST,
      resolvedAt: T3,
    })).resolves.toBeNull();
    expect(await eventTypes(harness)).toContain(EFFECT_OPERATOR_RESOLVED_EVENT_TYPE);
  });

  it('records conflicting target evidence and performs no mutation', async () => {
    const harness = createHarness('recover-conflict');
    const target = apiTarget('conflict');
    await expect(effectGateway(harness, {
      afterIntent: () => { throw new Error('crash after intent'); },
    }).execute(effectInput(), target.adapter)).rejects.toThrow();
    const recovered = await effectGateway(harness).recover({
      execution: effectInput(),
      claim: claim(),
      reasonCode: 'resume_unresolved_intent',
      startedAt: T2,
    }, target.adapter);

    expect(recovered).toMatchObject({ status: 'conflict', verdict: 'conflict' });
    expect(target.mutations()).toBe(0);
    expect(await eventTypes(harness)).not.toContain(EFFECT_CONFIRMATION_EVENT_TYPE);
  });

  it.each([
    ['not_applied', 'confirmed', 1],
    ['applied', 'confirmed', 0],
    ['in_doubt', 'operator_required', 0],
    ['conflict', 'conflict', 0],
  ] as const)(
    'applies the %s recovery verdict to logical subprocess evidence',
    async (verdict, expectedStatus, expectedDispatches) => {
      const harness = createHarness(`subprocess-recovery-${verdict}`);
      let dispatches = 0;
      const adapter = createSubprocessEffectAdapter<ApiRequest>({
        adapterId: 'fixture-subprocess',
        adapterVersion: '1',
        hasDurableOutcomeQuery: true,
        async dispatch(_request, logicalInvocationId): Promise<EffectObservation> {
          dispatches += 1;
          return observation(logicalInvocationId);
        },
        async queryOutcome(_request, logicalInvocationId): Promise<EffectReconciliationObservation> {
          return {
            verdict,
            reason_code: `subprocess_${verdict}`,
            evidence_digest: sha256Bytes(canonicalBytes({ logicalInvocationId, verdict })),
            observed_at: T3,
            observation: verdict === 'applied' ? observation(logicalInvocationId, T3) : null,
          };
        },
      });
      const execution = effectInput({
        logicalEffectId: `logical-subprocess-${verdict}`,
        operation: 'run-hermetic-subprocess',
        targetIdentity: `subprocess:fixture:${verdict}`,
      });
      await expect(effectGateway(harness, {
        afterIntent: () => { throw new Error('crash after subprocess intent'); },
      }).execute(execution, adapter)).rejects.toThrow('crash after subprocess intent');

      const recovered = await effectGateway(harness).recover({
        execution,
        claim: claim(),
        reasonCode: 'resume_subprocess',
        startedAt: T2,
      }, adapter);
      expect(recovered).toMatchObject({ status: expectedStatus, verdict });
      expect(dispatches).toBe(expectedDispatches);
    },
  );

  it.each([
    ['not_applied', 'confirmed'],
    ['applied', 'confirmed'],
    ['in_doubt', 'operator_required'],
    ['conflict', 'conflict'],
  ] as const)(
    'applies the %s recovery verdict to atomic file evidence',
    async (verdict, expectedStatus) => {
      const harness = createHarness(`file-recovery-${verdict}`);
      const fixture = fileFixture(
        `file-recovery-${verdict}`,
        verdict === 'in_doubt' ? '../outside.txt' : 'published.txt',
      );
      const crashGateway = verdict === 'applied'
        ? effectGateway(harness, {
          afterEffectBeforeConfirmation: () => { throw new Error('crash after file publication'); },
        })
        : effectGateway(harness, {
          afterIntent: () => { throw new Error('crash after file intent'); },
        });
      await expect(crashGateway.execute(fixture.execution, fixture.adapter)).rejects.toThrow();
      if (verdict === 'conflict') {
        writeFileSync(join(fixture.targetRoot, fixture.request.relativePath), 'unexpected content\n');
      }

      const recovered = await effectGateway(harness).recover({
        execution: fixture.execution,
        claim: claim(),
        reasonCode: 'resume_file_publication',
        startedAt: T2,
      }, fixture.adapter);
      expect(recovered).toMatchObject({ status: expectedStatus, verdict });
      if (verdict === 'not_applied' || verdict === 'applied') {
        expect(readFileSync(
          join(fixture.targetRoot, fixture.request.relativePath),
          'utf8',
        )).toBe(fixture.request.content);
      }
    },
  );

  it('rejects stale recovery claims and stops after the bounded retry budget', async () => {
    const harness = createHarness('recover-bounds');
    const target = apiTarget('in_doubt');
    await expect(effectGateway(harness, {
      afterIntent: () => { throw new Error('crash after intent'); },
    }).execute(effectInput(), target.adapter)).rejects.toThrow();
    await expect(effectGateway(harness).recover({
      execution: effectInput(),
      claim: claim({ fence_token: 'stale-fence' }),
      reasonCode: 'resume_unresolved_intent',
      startedAt: T2,
    }, target.adapter)).rejects.toMatchObject({
      code: ReceiptEffectErrorCodes.RECOVERY_CLAIM_REJECTED,
    });

    const bounded = effectGateway(harness, { maxRecoveryAttempts: 2 });
    for (let attempt = 0; attempt < 2; attempt += 1) {
      await bounded.recover({
        execution: effectInput(),
        claim: claim({ claim_id: `claim-${attempt + 1}` }),
        reasonCode: 'resume_unresolved_intent',
        startedAt: T2,
      }, target.adapter);
    }
    await expect(bounded.recover({
      execution: effectInput(),
      claim: claim({ claim_id: 'claim-3' }),
      reasonCode: 'resume_unresolved_intent',
      startedAt: T2,
    }, target.adapter)).rejects.toMatchObject({ code: ReceiptEffectErrorCodes.RECOVERY_EXHAUSTED });
    expect(target.mutations()).toBe(0);
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. ADAPTERS, REPLAY, AND LEGACY COMPATIBILITY
// ───────────────────────────────────────────────────────────────────

describe('adapter conformance and replay', () => {
  it('pins the key-free candidate service manifests', () => {
    const harness = createHarness('candidate-manifests');
    const file = fileFixture('candidate-file-manifest');
    const subprocess = createSubprocessEffectAdapter<ApiRequest>({
      adapterId: 'fixture-subprocess',
      adapterVersion: '1',
      hasDurableOutcomeQuery: true,
      dispatch: async (_request, invocation) => observation(invocation),
      queryOutcome: async () => ({
        verdict: 'not_applied',
        reason_code: 'manifest_only',
        evidence_digest: EVIDENCE_DIGEST,
        observed_at: T3,
        observation: null,
      }),
    });
    const manifests = {
      boundary_manifest: DEFAULT_BOUNDARY_MANIFEST_DIGEST,
      boundary_registry: createBoundaryRegistry().digest,
      certification_registry: providers().digest,
      effect_adapter_manifest: effectAdapterManifestDigest([
        apiTarget().adapter as EffectAdapter<unknown>,
        file.adapter as EffectAdapter<unknown>,
        subprocess as EffectAdapter<unknown>,
      ]),
      event_registry: harness.registry.digest,
      legacy_surface_manifest: LEGACY_RECOVERY_SURFACE_MANIFEST_DIGEST,
      policy_registry: harness.policies.digest,
    };

    console.info(`[receipt-effect-manifests] ${JSON.stringify(manifests)}`);
    expect(Object.values(manifests).every((digest) => /^[a-f0-9]{64}$/u.test(digest)))
      .toBe(true);
  });

  it('publishes files atomically and reconciles by content rather than process state', async () => {
    const harness = createHarness('file-adapter');
    const targetRoot = temporaryRoot('file-target');
    const request: AtomicFileEffectRequest = {
      relativePath: 'published.txt',
      content: 'durable content\n',
      expectedPriorDigest: null,
    };
    const contentDigest = sha256Bytes(Buffer.from(request.content, 'utf8'));
    const execution: EffectExecutionInput<AtomicFileEffectRequest> = {
      ...effectInput(),
      logicalEffectId: 'file-publication',
      operation: 'publish-file',
      targetIdentity: atomicFileTargetIdentity(request.relativePath),
      request,
      canonicalInput: {
        relative_path: request.relativePath,
        content: request.content,
        expected_prior_digest: request.expectedPriorDigest,
      },
      expectedPostconditionDigest: contentDigest,
      safeMetadata: { publication_kind: 'fixture' },
    };
    const adapter = createAtomicFileEffectAdapter({
      rootDirectory: targetRoot,
      now: () => new Date(T2),
    });
    const result = await effectGateway(harness).execute(execution, adapter);

    expect(result.status).toBe('confirmed');
    expect(readFileSync(join(targetRoot, request.relativePath), 'utf8')).toBe(request.content);
    expect(existsSync(join(targetRoot, '.effect-staging'))).toBe(true);
    await expect(adapter.reconcile(result.intent, request)).resolves.toMatchObject({
      verdict: 'applied',
    });
  });

  it('uses logical subprocess outcome evidence and refuses missing reconciliation capability', async () => {
    const harness = createHarness('subprocess-adapter');
    let dispatches = 0;
    const adapter = createSubprocessEffectAdapter<ApiRequest>({
      adapterId: 'fixture-subprocess',
      adapterVersion: '1',
      hasDurableOutcomeQuery: true,
      async dispatch(_request, logicalInvocationId): Promise<EffectObservation> {
        dispatches += 1;
        return observation(logicalInvocationId);
      },
      async queryOutcome(_request, logicalInvocationId): Promise<EffectReconciliationObservation> {
        return {
          verdict: dispatches > 0 ? 'applied' : 'not_applied',
          reason_code: 'artifact_status_query',
          evidence_digest: sha256Bytes(canonicalBytes({ logicalInvocationId, dispatches })),
          observed_at: T3,
          observation: dispatches > 0 ? observation(logicalInvocationId, T3) : null,
        };
      },
    });
    const execution = effectInput({
      logicalEffectId: 'logical-subprocess-invocation',
      operation: 'run-hermetic-subprocess',
      targetIdentity: 'subprocess:fixture',
    });
    await effectGateway(harness).execute(execution, adapter);
    expect(dispatches).toBe(1);

    const unsupported = createSubprocessEffectAdapter<ApiRequest>({
      adapterId: 'pid-only-subprocess',
      adapterVersion: '1',
      hasDurableOutcomeQuery: false,
      dispatch: async () => observation('pid-only'),
      queryOutcome: async () => ({
        verdict: 'in_doubt',
        reason_code: 'pid_is_not_evidence',
        evidence_digest: EVIDENCE_DIGEST,
        observed_at: T3,
        observation: null,
      }),
    });
    await expect(effectGateway(createHarness('subprocess-unsupported')).execute(
      effectInput(),
      unsupported,
    )).rejects.toMatchObject({ code: ReceiptEffectErrorCodes.ADAPTER_UNSUPPORTED });
  });

  it('derives byte-stable replay fingerprints over receipt and effect records', async () => {
    const harness = createHarness('replay');
    await appendBoundaryResult(harness);
    await receiptIssuer(harness).issue({
      boundaryId: 'boundary-1',
      boundaryKind: 'phase-completion',
      scopeId: 'fixture-phase',
      resultEventId: 'phase-result-1',
      issuer: 'fixture-issuer',
      certificationProfile: durableProfile(),
    });
    const target = apiTarget();
    await effectGateway(harness).execute(effectInput(), target.adapter);
    const head = await harness.ledger.getVerifiedHead();
    const fingerprintInput = {
      ledger: harness.ledger,
      eventRegistry: harness.registry,
      versionRegistry: createReplayFingerprintVersionRegistry(),
      componentRegistry: createEvidenceControlReplayComponentRegistry(),
      runId: 'run-1',
      rangeStartSequence: 1,
      rangeEndSequence: head.sequence,
      replay: createEvidenceControlReplayInput(),
    };
    const first = await deriveReplayFingerprint(fingerprintInput);
    const second = await deriveReplayFingerprint(fingerprintInput);

    expect(first.descriptor.final_digest).toBe(second.descriptor.final_digest);
    expect(first.projection.state.receipts).toHaveLength(1);
    expect(first.projection.state.confirmations).toHaveLength(1);
    expect(first.descriptor.event_count).toBe(4);
  });

  it('keeps legacy recovery surfaces authoritative and dispatch MACs advisory', () => {
    expect(LEGACY_RECOVERY_SURFACES).toHaveLength(5);
    expect(LEGACY_RECOVERY_SURFACES.every((surface) =>
      surface.authority === 'legacy-authoritative'
      && surface.dark_service_action === 'observe-only')).toBe(true);

    const dispatchId = 'dispatch-fixture';
    const key = deriveReceiptKey('process-local-secret', dispatchId);
    const unsigned = {
      version: 1,
      type: 'dispatch_receipt',
      phase: 'completion',
      dispatchId,
      issuedAt: T0,
      facts: { exitStatus: 0 },
    };
    const record = { ...unsigned, mac: signReceipt(unsigned, key) };
    expect(assessLegacyDispatchReceipt(record, key)).toEqual({
      kind: 'legacy-dispatch-receipt',
      trust_scope: 'process-local-advisory',
      same_process_mac_valid: true,
      durable_cross_resume_accepted: false,
    });
    expect(assessLegacyDispatchReceipt(record)).toMatchObject({
      same_process_mac_valid: null,
      durable_cross_resume_accepted: false,
    });
  });
});
