// ───────────────────────────────────────────────────────────────────
// MODULE: Sealed Reference Artifact Tests
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
  TypedReducerRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  EventTypeRegistry,
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  INITIAL_STATE_REPLAY_INPUT,
  ReplayComponentRegistry,
  createReplayFingerprintVersionRegistry,
  deriveReplayFingerprint,
} from '../../lib/replay-fingerprint/index.js';
import {
  ARTIFACT_LIFECYCLE_EVENT_TYPE,
  ArtifactDigestRegistry,
  ArtifactLifecycleActions,
  ArtifactRetentionRootTypes,
  InitialArtifactKinds,
  SEALED_ARTIFACT_REPLAY_INPUT_KEY,
  SealedArtifactError,
  SealedArtifactErrorCodes,
  SealedArtifactStore,
  artifactReferenceSetReplayInput,
  bindVerifiedArtifactReferences,
  compareArtifactReferenceSets,
  parseSealedArtifactReference,
  planArtifactRetention,
  prepareArtifactLifecycleEvent,
  prepareArtifactSealedEvent,
  readVerifiedArtifactEvidence,
  recordArtifactEvent,
  restoreArtifact,
  sealedArtifactEventDefinitions,
  sweepArtifact,
} from '../../lib/sealed-reference-artifacts/index.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type { JsonObject, JsonValue } from '../../lib/event-envelope/index.js';
import type {
  ArtifactAuthorizationContext,
  ArtifactEventMetadata,
  ArtifactEventRecorder,
  ArtifactLifecycleInput,
  ArtifactRetentionDecision,
  ArtifactRetentionRootType,
  ArtifactStoreFaultInjection,
  ArtifactStorePaths,
  ArtifactReferenceSet,
  VerifiedArtifactEvidence,
} from '../../lib/sealed-reference-artifacts/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE TYPES AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

interface Harness {
  readonly rootDirectory: string;
  readonly registry: EventTypeRegistry;
  readonly policies: TransitionPolicyRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly store: SealedArtifactStore;
  readonly recorder: ArtifactEventRecorder;
  readonly nextMetadata: (label: string) => ArtifactEventMetadata;
}

interface ArtifactProjection extends JsonObject {
  count: number;
  referenceSetDigest: string;
}

const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
const FIXED_TIME = '2026-07-21T00:00:00.000Z';
const REASON_DIGEST = sha256Bytes(canonicalBytes({ reason: 'fixture' }));
const STATE_DIGEST = sha256Bytes(canonicalBytes({ state: 'artifact-fixture' }));
const temporaryRoots: string[] = [];

// ───────────────────────────────────────────────────────────────────
// 2. FIXTURE HELPERS
// ───────────────────────────────────────────────────────────────────

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `sealed-artifact-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function evaluateArtifactPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  return input.capabilityId === 'artifact-write'
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['artifact-write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['artifact-write'] };
}

function createHarness(capabilityId = 'artifact-write'): Harness {
  const rootDirectory = temporaryRoot('harness');
  const registry = new EventTypeRegistry(sealedArtifactEventDefinitions());
  const policies = new TransitionPolicyRegistry([{
    policyId: 'artifact-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['artifact-write'],
    evaluate: evaluateArtifactPolicy,
  }]);
  const ledger = new AppendOnlyLedger({
    rootDirectory: join(rootDirectory, 'ledger'),
    ledgerId: 'artifact-domain',
    auditLedgerId: 'artifact-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date(FIXED_TIME),
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: join(rootDirectory, 'ledger'),
    auditLedgerId: 'artifact-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date(FIXED_TIME),
  }, ledger, policies);
  const store = new SealedArtifactStore({
    rootDirectory: join(rootDirectory, 'artifacts'),
    now: () => new Date(FIXED_TIME),
  });
  let eventIndex = 0;
  const nextMetadata = (label: string): ArtifactEventMetadata => {
    eventIndex += 1;
    return {
      eventId: `${label}-${eventIndex}`,
      streamId: 'artifact-stream',
      streamSequence: eventIndex,
      occurredAt: FIXED_TIME,
      recordedAt: FIXED_TIME,
      producer: { name: 'sealed-artifact-tests', version: '1' },
      authorityEpoch: AUTHORITY.epoch,
      correlationId: `artifact-correlation-${eventIndex}`,
      causationId: null,
      idempotencyKey: `artifact-idempotency-${eventIndex}`,
    };
  };
  const policy = policies.resolve('artifact-policy', 1);
  const recorder: ArtifactEventRecorder = {
    ledger,
    gateway,
    authorizationContext: (event): ArtifactAuthorizationContext => ({
      requestId: `request-${event.identity.eventId}`,
      mode: 'research',
      priorStateVersion: 'artifact-state@1',
      priorStateFingerprint: STATE_DIGEST,
      actorId: 'artifact-test-actor',
      capabilityId,
      authorityEpoch: AUTHORITY.epoch,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: sha256Bytes(canonicalBytes({ event: event.canonicalDigest })),
    }),
  };
  return {
    rootDirectory,
    registry,
    policies,
    ledger,
    gateway,
    store,
    recorder,
    nextMetadata,
  };
}

async function sealAndRecord(
  harness: Harness,
  artifactKind: string,
  source: unknown,
  label = artifactKind,
): Promise<VerifiedArtifactEvidence> {
  const sealed = await harness.store.seal(artifactKind, source);
  const event = prepareArtifactSealedEvent(
    sealed.artifact,
    harness.registry,
    harness.nextMetadata(`${label}-sealed`),
    'run-retained',
  );
  await recordArtifactEvent(harness.recorder, event);
  return readVerifiedArtifactEvidence(
    harness.ledger,
    harness.store,
    sealed.artifact.reference,
    artifactKind,
  );
}

async function recordLifecycle(
  harness: Harness,
  evidence: VerifiedArtifactEvidence,
  input: ArtifactLifecycleInput,
  label: string,
): Promise<void> {
  const event = prepareArtifactLifecycleEvent(
    evidence.artifact.reference,
    harness.registry,
    harness.nextMetadata(label),
    input,
  );
  await recordArtifactEvent(harness.recorder, event);
}

async function eligibleDecision(
  harness: Harness,
  evidence: VerifiedArtifactEvidence,
): Promise<ArtifactRetentionDecision> {
  await recordLifecycle(harness, evidence, {
    action: ArtifactLifecycleActions.RETENTION_SET,
    retentionUntil: '2026-07-20T00:00:00.000Z',
    reasonDigest: REASON_DIGEST,
  }, 'retention-set');
  await recordLifecycle(harness, evidence, {
    action: ArtifactLifecycleActions.DELETION_ELIGIBLE,
    reasonDigest: REASON_DIGEST,
  }, 'deletion-eligible');
  const plan = await planArtifactRetention(
    harness.ledger,
    [evidence.artifact.reference],
    { scanComplete: true, evaluatedAt: FIXED_TIME },
  );
  const decision = plan.decisions[0];
  if (!decision) throw new Error('Expected one retention decision');
  return decision;
}

function overwrite(path: string, bytes: Uint8Array): void {
  chmodSync(path, 0o600);
  writeFileSync(path, bytes);
}

async function expectArtifactFailure(
  operation: Promise<unknown>,
  code: string,
): Promise<SealedArtifactError> {
  try {
    await operation;
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(SealedArtifactError);
    const typed = error as SealedArtifactError;
    expect(typed.code).toBe(code);
    expect(typed).not.toHaveProperty('bytes');
    expect(typed.details).not.toHaveProperty('bytes');
    return typed;
  }
  throw new Error(`Expected artifact failure ${code}`);
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 3. CANONICALIZATION AND PUBLICATION
// ───────────────────────────────────────────────────────────────────

describe('sealed reference artifacts', () => {
  it.each(Object.values(InitialArtifactKinds))(
    'canonicalizes equivalent %s sources to identical bytes and digests',
    (artifactKind) => {
      const store = new SealedArtifactStore({ rootDirectory: temporaryRoot(artifactKind) });
      const first = store.derive(artifactKind, {
        z: ['line-one\r\nline-two', 'Cafe\u0301'],
        a: { enabled: true, count: 2 },
      });
      const second = store.derive(artifactKind, {
        a: { count: 2, enabled: true },
        z: ['line-one\nline-two', 'Café'],
      });
      expect(Buffer.from(first.bytes).equals(Buffer.from(second.bytes))).toBe(true);
      expect(first.reference).toEqual(second.reference);
      expect(first.descriptor).toEqual(second.descriptor);
    },
  );

  it('rejects unregistered kinds, ambiguous byte inputs, and oversized content', () => {
    const store = new SealedArtifactStore({ rootDirectory: temporaryRoot('invalid-source') });
    expect(() => store.derive('unknown-kind', { value: 1 })).toThrowError(
      expect.objectContaining({ code: SealedArtifactErrorCodes.UNSUPPORTED_ARTIFACT_KIND }),
    );
    expect(() => store.derive(InitialArtifactKinds.FIXTURE, Uint8Array.from([1, 2]))).toThrowError(
      expect.objectContaining({ code: SealedArtifactErrorCodes.INVALID_INPUT }),
    );
    expect(() => store.derive(
      InitialArtifactKinds.PROMPT_SET,
      'x'.repeat(1_100_000),
    )).toThrowError(expect.objectContaining({ code: SealedArtifactErrorCodes.INVALID_INPUT }));
  });

  it.each([
    'beforeBlobWrite',
    'beforeDescriptorWrite',
    'beforePersistenceVerification',
    'beforeReferencePublication',
  ] as const)(
    'keeps a crash at %s unreachable',
    async (boundary) => {
      const rootDirectory = temporaryRoot(`fault-${boundary}`);
      const faultInjection = {
        [boundary]: (): void => {
          throw new Error(`fault-${boundary}`);
        },
      } as ArtifactStoreFaultInjection;
      const store = new SealedArtifactStore({ rootDirectory, faultInjection });
      const derived = store.derive(InitialArtifactKinds.FIXTURE, { value: boundary });
      await expect(store.seal(
        InitialArtifactKinds.FIXTURE,
        { value: boundary },
      )).rejects.toThrow(`fault-${boundary}`);
      expect(existsSync(store.inspectPaths(derived.reference).referencePath)).toBe(false);
      await expectArtifactFailure(
        store.readVerified(derived.reference),
        SealedArtifactErrorCodes.ARTIFACT_MISSING,
      );
    },
  );

  it('seals identical canonical bytes idempotently without changing identity', async () => {
    const store = new SealedArtifactStore({ rootDirectory: temporaryRoot('idempotent') });
    const first = await store.seal(InitialArtifactKinds.CONFIGURATION, { b: 2, a: 1 });
    const second = await store.seal(InitialArtifactKinds.CONFIGURATION, { a: 1, b: 2 });
    expect(first.status).toBe('sealed');
    expect(second.status).toBe('idempotent');
    expect(second.artifact.reference).toEqual(first.artifact.reference);
    expect(Buffer.from(second.artifact.bytes)).toEqual(Buffer.from(first.artifact.bytes));
  });

  it('quarantines a forced digest collision instead of selecting either candidate', async () => {
    const digest = 'a'.repeat(64);
    const digests = new ArtifactDigestRegistry([{
      algorithm: 'collision-test',
      implementationIdentity: 'collision-test-v1',
      digest: () => digest,
    }]);
    const store = new SealedArtifactStore(
      { rootDirectory: temporaryRoot('collision') },
      undefined,
      digests,
    );
    const first = await store.seal(
      InitialArtifactKinds.FIXTURE,
      { value: 'a' },
      { digestAlgorithm: 'collision-test' },
    );
    await expectArtifactFailure(
      store.seal(
        InitialArtifactKinds.FIXTURE,
        { value: 'b' },
        { digestAlgorithm: 'collision-test' },
      ),
      SealedArtifactErrorCodes.DIGEST_CONFLICT,
    );
    const paths = store.inspectPaths(first.artifact.reference);
    expect(existsSync(paths.quarantineMarkerPath)).toBe(true);
    expect(existsSync(paths.referencePath)).toBe(false);
  });

  it.each([
    ['path-only', { path: '/tmp/latest' }],
    ['alias-only', { alias: 'stable' }],
    ['tag-only', { tag: 'v1' }],
    ['latest-only', { latest: true }],
    ['malformed', { qualified_digest: 'sha256:nope' }],
  ])('rejects %s mutable or malformed references', (_label, candidate) => {
    expect(() => parseSealedArtifactReference(candidate)).toThrowError(
      expect.objectContaining({ code: SealedArtifactErrorCodes.INVALID_INPUT }),
    );
  });

  it('rejects unsupported digest and canonicalization identities before storage lookup', async () => {
    const store = new SealedArtifactStore({ rootDirectory: temporaryRoot('unsupported') });
    const derived = store.derive(InitialArtifactKinds.FIXTURE, { value: 1 });
    const unsupportedAlgorithm = {
      ...derived.reference,
      digest_algorithm: 'unknown',
      qualified_digest: `unknown:${derived.reference.content_digest}`,
    };
    await expectArtifactFailure(
      store.readVerified(unsupportedAlgorithm),
      SealedArtifactErrorCodes.UNSUPPORTED_DIGEST_ALGORITHM,
    );
    const unsupportedCanonicalization = {
      ...derived.reference,
      canonicalization_version: 'unknown@1',
    };
    await expectArtifactFailure(
      store.readVerified(unsupportedCanonicalization),
      SealedArtifactErrorCodes.UNSUPPORTED_CANONICALIZATION,
    );
    expect(() => parseSealedArtifactReference({
      ...derived.reference,
      reference_version: 2,
    })).toThrowError(expect.objectContaining({
      code: SealedArtifactErrorCodes.UNSUPPORTED_REFERENCE_VERSION,
    }));
    expect(() => parseSealedArtifactReference({
      ...derived.reference,
      descriptor_version: 2,
    })).toThrowError(expect.objectContaining({
      code: SealedArtifactErrorCodes.UNSUPPORTED_DESCRIPTOR_VERSION,
    }));
  });

  it.each(Object.values(InitialArtifactKinds))(
    'covers negative, corruption, and unsupported-version failures for %s',
    async (artifactKind) => {
      const store = new SealedArtifactStore({ rootDirectory: temporaryRoot(`matrix-${artifactKind}`) });
      expect(() => store.derive(artifactKind, Uint8Array.from([1]))).toThrowError(
        expect.objectContaining({ code: SealedArtifactErrorCodes.INVALID_INPUT }),
      );
      const sealed = await store.seal(artifactKind, { kind: artifactKind });
      expect(() => parseSealedArtifactReference({
        ...sealed.artifact.reference,
        descriptor_version: 2,
      })).toThrowError(expect.objectContaining({
        code: SealedArtifactErrorCodes.UNSUPPORTED_DESCRIPTOR_VERSION,
      }));
      const paths = store.inspectPaths(sealed.artifact.reference);
      overwrite(paths.blobPath, Buffer.from('{"corrupted":true}'));
      await expectArtifactFailure(
        store.readVerified(sealed.artifact.reference),
        SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      );
    },
  );

  it('rejects a symbolic-link storage boundary before publication', async () => {
    const rootDirectory = temporaryRoot('symlink-boundary');
    const storeRoot = join(rootDirectory, 'store');
    const outside = join(rootDirectory, 'outside');
    const store = new SealedArtifactStore({ rootDirectory: storeRoot });
    const derived = store.derive(InitialArtifactKinds.FIXTURE, { value: 1 });
    const blobPath = store.inspectPaths(derived.reference).blobPath;
    mkdirSync(outside);
    symlinkSync(outside, join(storeRoot, 'blobs'), 'dir');
    expect(() => store.inspectPaths(derived.reference)).toThrowError(
      expect.objectContaining({ code: SealedArtifactErrorCodes.INVALID_INPUT }),
    );
    expect(existsSync(dirname(blobPath))).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────────
  // 4. VERIFIED READ FAILURE MATRIX
  // ─────────────────────────────────────────────────────────────────

  it.each([
    ['missing blob', (paths: ArtifactStorePaths): void => rmSync(paths.blobPath)],
    ['changed blob', (paths: ArtifactStorePaths): void => overwrite(
      paths.blobPath,
      Buffer.from('{"value":"changed"}'),
    )],
    ['truncated blob', (paths: ArtifactStorePaths): void => overwrite(
      paths.blobPath,
      Buffer.from('{'),
    )],
    ['substituted blob', (paths: ArtifactStorePaths): void => overwrite(
      paths.blobPath,
      Buffer.from('{"other":true}'),
    )],
    ['missing descriptor', (paths: ArtifactStorePaths): void => rmSync(paths.descriptorPath)],
    ['wrong descriptor size', (paths: ArtifactStorePaths): void => {
      const descriptor = JSON.parse(readFileSync(paths.descriptorPath, 'utf8')) as Record<string, unknown>;
      descriptor.byte_length = 999;
      overwrite(paths.descriptorPath, Uint8Array.from(canonicalBytes(descriptor)));
    }],
    ['descriptor drift', (paths: ArtifactStorePaths): void => {
      const descriptor = JSON.parse(readFileSync(paths.descriptorPath, 'utf8')) as Record<string, unknown>;
      descriptor.media_type = 'application/drifted';
      overwrite(paths.descriptorPath, Uint8Array.from(canonicalBytes(descriptor)));
    }],
  ] as const)(
    'releases zero bytes for %s',
    async (_label, corrupt) => {
      const store = new SealedArtifactStore({ rootDirectory: temporaryRoot('corrupt') });
      const sealed = await store.seal(InitialArtifactKinds.FIXTURE, { value: 'original' });
      const paths = store.inspectPaths(sealed.artifact.reference);
      corrupt(paths);
      const error = await expectArtifactFailure(
        store.readVerified(sealed.artifact.reference),
        _label === 'wrong descriptor size' || _label === 'descriptor drift'
          ? SealedArtifactErrorCodes.DESCRIPTOR_CONFLICT
          : SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      );
      expect(error.message).not.toContain('original');
      expect(existsSync(paths.quarantineMarkerPath)).toBe(true);
    },
  );

  it('rejects wrong-kind consumption without quarantining valid bytes', async () => {
    const store = new SealedArtifactStore({ rootDirectory: temporaryRoot('wrong-kind') });
    const sealed = await store.seal(InitialArtifactKinds.FIXTURE, { value: 'fixture' });
    await expectArtifactFailure(
      store.readVerified(sealed.artifact.reference, InitialArtifactKinds.CONFIGURATION),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
    expect(existsSync(store.inspectPaths(sealed.artifact.reference).quarantineMarkerPath)).toBe(false);
    await expect(store.readVerified(sealed.artifact.reference)).resolves.toMatchObject({
      descriptor: { artifact_kind: InitialArtifactKinds.FIXTURE },
    });
  });

  it('returns a copy of the exact bytes that were hashed', async () => {
    const store = new SealedArtifactStore({ rootDirectory: temporaryRoot('returned-bytes') });
    const sealed = await store.seal(InitialArtifactKinds.FIXTURE, { value: 'stable' });
    const first = await store.readVerified(sealed.artifact.reference);
    const original = Buffer.from(first.bytes);
    first.bytes[0] = first.bytes[0] === 0 ? 1 : 0;
    const second = await store.readVerified(sealed.artifact.reference);
    expect(Buffer.from(second.bytes)).toEqual(original);
    expect(sha256Bytes(second.bytes)).toBe(second.descriptor.content_digest);
  });

  // ─────────────────────────────────────────────────────────────────
  // 5. AUTHORIZED EVIDENCE AND REPLAY BINDING
  // ─────────────────────────────────────────────────────────────────

  it('records and reads creation evidence through gateway, ledger, and event boundary', async () => {
    const harness = createHarness();
    const evidence = await sealAndRecord(
      harness,
      InitialArtifactKinds.PROMPT_SET,
      { prompts: ['one', 'two'] },
    );
    const head = await harness.ledger.getVerifiedHead();
    const events = await harness.ledger.readVerifiedEvents();
    expect(head.sequence).toBe(1);
    expect(events).toHaveLength(1);
    expect(evidence.receipt.authorizationRef.audit_sequence).toBe(1);
    expect(evidence.sealedEvent.event.registryDigest).toBe(harness.registry.digest);
    expect(Buffer.from(evidence.artifact.bytes).toString('utf8')).toContain('prompts');
  });

  it('leaves the domain ledger unchanged when the gateway denies evidence', async () => {
    const harness = createHarness('read-only');
    const sealed = await harness.store.seal(InitialArtifactKinds.FIXTURE, { value: 1 });
    const event = prepareArtifactSealedEvent(
      sealed.artifact,
      harness.registry,
      harness.nextMetadata('denied-seal'),
      'run-retained',
    );
    await expectArtifactFailure(
      recordArtifactEvent(harness.recorder, event),
      SealedArtifactErrorCodes.LEDGER_AUTHORIZATION_DENIED,
    );
    expect((await harness.ledger.getVerifiedHead()).sequence).toBe(0);
  });

  it('blocks trusted evidence and reference-set binding for an unrecorded seal', async () => {
    const harness = createHarness();
    const sealed = await harness.store.seal(InitialArtifactKinds.FIXTURE, { value: 1 });
    await expectArtifactFailure(
      readVerifiedArtifactEvidence(
        harness.ledger,
        harness.store,
        sealed.artifact.reference,
      ),
      SealedArtifactErrorCodes.EVIDENCE_MISSING,
    );
    expect(() => bindVerifiedArtifactReferences([{} as VerifiedArtifactEvidence])).toThrowError(
      expect.objectContaining({ code: SealedArtifactErrorCodes.EVIDENCE_CONFLICT }),
    );
  });

  it('binds order and verification evidence into replay and parity inputs', async () => {
    const harness = createHarness();
    const first = await sealAndRecord(
      harness,
      InitialArtifactKinds.FIXTURE,
      { value: 'first' },
      'first',
    );
    const second = await sealAndRecord(
      harness,
      InitialArtifactKinds.CONFIGURATION,
      { value: 'second' },
      'second',
    );
    const forward = bindVerifiedArtifactReferences([first, second]);
    const reverse = bindVerifiedArtifactReferences([second, first]);
    expect(forward.reference_set_digest).not.toBe(reverse.reference_set_digest);
    expect(artifactReferenceSetReplayInput(forward).digest).not.toBe(
      artifactReferenceSetReplayInput(reverse).digest,
    );
    expect(compareArtifactReferenceSets(forward, forward)).toEqual({
      ok: true,
      referenceSetDigest: forward.reference_set_digest,
    });
    expect(compareArtifactReferenceSets(forward, reverse)).toMatchObject({
      ok: false,
      code: SealedArtifactErrorCodes.INPUT_EQUIVALENCE_FAILURE,
    });
  });

  it('changes the phase fingerprint when the verified artifact order changes', async () => {
    const harness = createHarness();
    const first = await sealAndRecord(
      harness,
      InitialArtifactKinds.FIXTURE,
      { value: 'first' },
      'first',
    );
    const second = await sealAndRecord(
      harness,
      InitialArtifactKinds.CONFIGURATION,
      { value: 'second' },
      'second',
    );
    const forward = bindVerifiedArtifactReferences([first, second]);
    const reverse = bindVerifiedArtifactReferences([second, first]);
    const initialState: ArtifactProjection = { count: 0, referenceSetDigest: '' };

    const derive = async (referenceSet: ArtifactReferenceSet): Promise<string> => {
      const replayInput = artifactReferenceSetReplayInput(referenceSet);
      const baseReducers = new TypedReducerRegistry<ArtifactProjection>([{
        eventType: 'deep-loop.artifact.sealed',
        reducerVersion: 'artifact-reducer@1',
        reduce: (state) => ({ ...state, count: state.count + 1 }),
      }]);
      const componentRegistry = new ReplayComponentRegistry<ArtifactProjection>([{
        reducerId: 'artifact-reducer',
        reducerVersion: 'artifact-reducer@1',
        projectionSchemaVersion: 'artifact-projection@1',
        requiredReplayInputKeys: [
          INITIAL_STATE_REPLAY_INPUT,
          SEALED_ARTIFACT_REPLAY_INPUT_KEY,
        ],
        reducerRegistry: baseReducers,
        replayInputSources: {
          [SEALED_ARTIFACT_REPLAY_INPUT_KEY]: replayInput.source,
        },
        bindReplayInputs: (values: Readonly<Record<string, JsonValue>>) => {
          const value = values[SEALED_ARTIFACT_REPLAY_INPUT_KEY] as Record<string, JsonValue>;
          const boundDigest = String(value.reference_set_digest);
          return new TypedReducerRegistry<ArtifactProjection>([{
            eventType: 'deep-loop.artifact.sealed',
            reducerVersion: 'artifact-reducer@1',
            reduce: (state) => ({
              count: state.count + 1,
              referenceSetDigest: boundDigest,
            }),
          }]);
        },
      }]);
      const derived = await deriveReplayFingerprint({
        ledger: harness.ledger,
        eventRegistry: harness.registry,
        versionRegistry: createReplayFingerprintVersionRegistry(),
        componentRegistry,
        runId: 'artifact-run',
        rangeStartSequence: 1,
        rangeEndSequence: 2,
        replay: {
          reducerId: 'artifact-reducer',
          reducerVersion: 'artifact-reducer@1',
          projectionSchemaVersion: 'artifact-projection@1',
          initialState,
          replayInputDigests: {
            [INITIAL_STATE_REPLAY_INPUT]: sha256Bytes(canonicalBytes(initialState)),
            [SEALED_ARTIFACT_REPLAY_INPUT_KEY]: replayInput.digest,
          },
        },
      });
      expect(derived.projection.state.referenceSetDigest).toBe(referenceSet.reference_set_digest);
      return derived.descriptor.final_digest;
    };

    const forwardDigest = await derive(forward);
    expect(await derive(forward)).toBe(forwardDigest);
    expect(await derive(reverse)).not.toBe(forwardDigest);
  });

  // ─────────────────────────────────────────────────────────────────
  // 6. CONSERVATIVE RETENTION AND RESTORATION
  // ─────────────────────────────────────────────────────────────────

  it('retains every candidate when root discovery is incomplete', async () => {
    const harness = createHarness();
    const evidence = await sealAndRecord(
      harness,
      InitialArtifactKinds.PRIOR_RUN_OUTPUT,
      { output: 'retained' },
    );
    const plan = await planArtifactRetention(
      harness.ledger,
      [evidence.artifact.reference],
      { scanComplete: false, evaluatedAt: FIXED_TIME },
    );
    expect(plan).toMatchObject({ retainedCount: 1, deletionCount: 0 });
    expect(plan.decisions[0]).toMatchObject({ decision: 'retain', reason: 'scan-incomplete' });
  });

  it.each(Object.values(ArtifactRetentionRootTypes))(
    'retains an artifact protected by the %s root',
    async (rootType: ArtifactRetentionRootType) => {
      const harness = createHarness();
      const evidence = await sealAndRecord(
        harness,
        InitialArtifactKinds.FIXTURE,
        { rootType },
      );
      await recordLifecycle(harness, evidence, {
        action: ArtifactLifecycleActions.RETENTION_SET,
        retentionUntil: '2026-07-20T00:00:00.000Z',
        reasonDigest: REASON_DIGEST,
      }, 'retention-set');
      await recordLifecycle(harness, evidence, {
        action: ArtifactLifecycleActions.DELETION_ELIGIBLE,
        reasonDigest: REASON_DIGEST,
      }, 'deletion-eligible');
      await recordLifecycle(harness, evidence, {
        action: rootType === ArtifactRetentionRootTypes.EXPLICIT_HOLD
          ? ArtifactLifecycleActions.HOLD_PLACED
          : ArtifactLifecycleActions.REFERENCE_ADDED,
        rootType,
        rootId: `root-${rootType}`,
        reasonDigest: REASON_DIGEST,
      }, 'root-added');
      const plan = await planArtifactRetention(
        harness.ledger,
        [evidence.artifact.reference],
        { scanComplete: true, evaluatedAt: FIXED_TIME },
      );
      expect(plan.decisions[0]).toMatchObject({
        decision: 'retain',
        reason: rootType === ArtifactRetentionRootTypes.EXPLICIT_HOLD
          ? 'hold-active'
          : 'protected-root',
      });
    },
  );

  it('sweeps only an eligible artifact and binds its tombstone to ledger evidence', async () => {
    const harness = createHarness();
    const evidence = await sealAndRecord(
      harness,
      InitialArtifactKinds.PRIOR_RUN_OUTPUT,
      { output: 'delete-me' },
    );
    const paths = harness.store.inspectPaths(evidence.artifact.reference);
    const blobBefore = sha256Bytes(Uint8Array.from(readFileSync(paths.blobPath)));
    const descriptorBefore = sha256Bytes(Uint8Array.from(readFileSync(paths.descriptorPath)));
    const decision = await eligibleDecision(harness, evidence);
    expect(sha256Bytes(Uint8Array.from(readFileSync(paths.blobPath)))).toBe(blobBefore);
    expect(sha256Bytes(Uint8Array.from(readFileSync(paths.descriptorPath)))).toBe(
      descriptorBefore,
    );
    expect(decision).toMatchObject({ decision: 'delete', reason: 'eligible' });
    const swept = await sweepArtifact(
      harness.store,
      harness.recorder,
      harness.registry,
      evidence,
      decision,
      harness.nextMetadata('deletion-authorized'),
      REASON_DIGEST,
    );
    expect(swept.tombstone.deletion_record_hash).toBe(swept.lifecycle.receipt.recordHash);
    expect(existsSync(paths.tombstonePath)).toBe(true);
    expect(existsSync(paths.referencePath)).toBe(false);
    expect(existsSync(paths.blobPath)).toBe(false);
    expect(existsSync(paths.descriptorPath)).toBe(false);
    await expectArtifactFailure(
      harness.store.readVerified(evidence.artifact.reference),
      SealedArtifactErrorCodes.ARTIFACT_TOMBSTONED,
    );
    const events = await harness.ledger.readVerifiedEvents();
    expect(events.at(-1)?.event.effective.envelope.event_type).toBe(
      ARTIFACT_LIFECYCLE_EVENT_TYPE,
    );
    expect(events.at(-1)?.event.effective.envelope.payload.action).toBe(
      ArtifactLifecycleActions.DELETION_AUTHORIZED,
    );
  });

  it('restores only byte-identical canonical content under the original digest', async () => {
    const harness = createHarness();
    const source = { output: 'restore-me', nested: { stable: true } };
    const evidence = await sealAndRecord(
      harness,
      InitialArtifactKinds.PRIOR_RUN_OUTPUT,
      source,
    );
    const decision = await eligibleDecision(harness, evidence);
    await sweepArtifact(
      harness.store,
      harness.recorder,
      harness.registry,
      evidence,
      decision,
      harness.nextMetadata('delete-before-restore'),
      REASON_DIGEST,
    );
    const headBeforeRejectedRestore = await harness.ledger.getVerifiedHead();
    await expectArtifactFailure(
      harness.store.validateRestoration(
        evidence.artifact.reference,
        { output: 'changed', nested: { stable: true } },
      ),
      SealedArtifactErrorCodes.RESTORATION_MISMATCH,
    );
    expect((await harness.ledger.getVerifiedHead()).sequence).toBe(
      headBeforeRejectedRestore.sequence,
    );
    const restored = await restoreArtifact(
      harness.store,
      harness.recorder,
      harness.registry,
      evidence.artifact.reference,
      source,
      harness.nextMetadata('restore-authorized'),
      REASON_DIGEST,
    );
    expect(restored.artifact.reference).toEqual(evidence.artifact.reference);
    expect(Buffer.from(restored.artifact.bytes)).toEqual(Buffer.from(evidence.artifact.bytes));
    await expect(harness.store.readVerified(evidence.artifact.reference)).resolves.toMatchObject({
      reference: evidence.artifact.reference,
    });
  });
});
