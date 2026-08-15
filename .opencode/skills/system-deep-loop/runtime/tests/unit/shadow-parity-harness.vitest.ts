// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Parity Harness Tests
// ───────────────────────────────────────────────────────────────────

import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

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
  TypedReducerRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  EventTypeRegistry,
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import { LEGACY_PROJECTION_MANIFEST } from '../../lib/legacy-projections/index.js';
import {
  ReplayComponentRegistry,
  createReplayFingerprintVersionRegistry,
  deriveReplayFingerprint,
  prepareReplayFingerprintAttestation,
  recordReplayFingerprintAttestation,
  replayFingerprintAttestationEventDefinition,
} from '../../lib/replay-fingerprint/index.js';
import {
  SEALED_ARTIFACT_REPLAY_INPUT_KEY,
  InitialArtifactKinds,
  SealedArtifactStore,
  bindVerifiedArtifactReferences,
  prepareArtifactSealedEvent,
  readVerifiedArtifactEvidence,
  recordArtifactEvent,
  sealedArtifactEventDefinitions,
} from '../../lib/sealed-reference-artifacts/index.js';
import {
  ShadowParityErrorCodes,
  SHADOW_PARITY_SCHEMA_FILES,
  TRANSITION_ROLLBACK_MINIMUM_DAYS,
  TRANSITION_ROLLBACK_MINIMUM_SUCCESSFUL_RUNS,
  compileParityCaseManifest,
  closeParityDivergence,
  createParityInvalidationIdentityRegistry,
  issueParityCertificate,
  runShadowParityCase,
  verifyParityCertificate,
} from '../../lib/shadow-parity/index.js';
import {
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_EVENT_TYPE,
  FIXTURE_LEDGER_ID,
  FIXTURE_TIMESTAMP,
  createFixtureEvent,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from '../fixtures/authorized-ledger-fixtures.js';

import type {
  AuthoritySnapshot,
  GatewayAllowProof,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type {
  EventTypeDefinition,
  JsonObject,
  JsonValue,
} from '../../lib/event-envelope/index.js';
import type {
  ArtifactAuthorizationContext,
  ArtifactEventMetadata,
  ArtifactEventRecorder,
  ArtifactReferenceSet,
  VerifiedArtifactEvidence,
} from '../../lib/sealed-reference-artifacts/index.js';
import type {
  ParityBaselineRow,
  ParityCaseCapsule,
  ParityCaseDefinition,
  ParityCertificateBindings,
  ParityCertificateInvalidationBindings,
  ParityCertificate,
  ParityExecutionContext,
  ParityObservationClass,
  ParityPathExecutor,
  RunShadowParityCaseInput,
  ShadowParityCaseFailure,
  ShadowParityCasePass,
} from '../../lib/shadow-parity/index.js';
import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE TYPES AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

interface CountProjection extends JsonObject {
  count: number;
  labels: string[];
}

interface ArtifactHarness {
  readonly rootDirectory: string;
  readonly ledger: AppendOnlyLedger;
  readonly store: SealedArtifactStore;
  readonly recorder: ArtifactEventRecorder;
  readonly registry: EventTypeRegistry;
  readonly nextMetadata: (label: string) => ArtifactEventMetadata;
}

interface SealedFixture {
  readonly harness: ArtifactHarness;
  readonly forward: ArtifactReferenceSet;
  readonly reverse: ArtifactReferenceSet;
}

interface ExecutorOptions {
  readonly delayMs?: number;
  readonly effectTarget?: string;
  readonly eventValueOffset?: number;
  readonly projectionOffset?: number;
  readonly storedVariant?: boolean;
  readonly omitAttestation?: boolean;
  readonly omitObservation?: ParityObservationClass;
  readonly projectionBytes?: string;
  readonly projectionReaderResult?: JsonValue;
  readonly projectionIds?: readonly string[];
  readonly observationOverride?: Readonly<{
    observation: ParityObservationClass;
    value: JsonValue | ((context: ParityExecutionContext) => JsonValue);
  }>;
}

interface BehaviorScenario {
  readonly id: string;
  readonly mode: string;
  readonly contractDigest: string;
}

interface BehaviorBaseline {
  readonly baseSha: string;
  readonly existingScenarios: readonly BehaviorScenario[];
  readonly addedScenarios: readonly BehaviorScenario[];
  readonly workstreamAssertions: readonly Readonly<{
    workstream: string;
    scenarioId: string;
  }>[];
}

interface CensusRows {
  readonly rows: readonly Readonly<{
    id: string;
    readers?: readonly string[];
  }>[];
}

interface DefectLedgerRow {
  readonly classification: string;
  readonly scenarioOrFixture: string;
}

interface DefectLedger {
  readonly rows: readonly DefectLedgerRow[];
}

const REPOSITORY_ROOT = fileURLToPath(new URL('../../../../../..', import.meta.url));
const CENSUS_ROOT = join(
  REPOSITORY_ROOT,
  'specs/system-deep-loop/036-deep-loop-innovation',
  '001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census',
);
const SHADOW_PARITY_SCHEMA_ROOT = join(
  REPOSITORY_ROOT,
  '.opencode/skills/system-deep-loop/runtime/lib/shadow-parity/schemas',
);
const BASE_SHA = 'fe6ca3030917073f3b478bc044e10034dcc4394b';
const CONTRACT_DIGEST = sha256Bytes(canonicalBytes({ contract: 'shadow-parity' }));
const BASE_DIGEST = sha256Bytes(canonicalBytes({ base: BASE_SHA }));
const INITIAL_STATE: CountProjection = Object.freeze({
  count: 0,
  labels: Object.freeze([]) as unknown as string[],
});
const INITIAL_STATE_DIGEST = sha256Bytes(canonicalBytes(INITIAL_STATE));
const CONFIGURATION_DIGEST = sha256Bytes(canonicalBytes({ scale: 1 }));
const ARTIFACT_AUTHORITY: AuthoritySnapshot = Object.freeze({
  state: 'shadowing',
  epoch: 1,
});
const ARTIFACT_STATE_DIGEST = sha256Bytes(canonicalBytes({ state: 'sealed-inputs' }));
const REQUIRED_OBSERVATIONS: readonly ParityObservationClass[] = Object.freeze([
  'terminal-status',
  'return-value',
  'error-halt',
  'ordered-transitions',
  'effect-receipts',
  'budgets',
  'emitted-artifacts',
  'reader-results',
]);
const temporaryRoots: string[] = [];

// ───────────────────────────────────────────────────────────────────
// 2. SEALED INPUT FIXTURES
// ───────────────────────────────────────────────────────────────────

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `shadow-parity-${label}-`));
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

function createArtifactHarness(): ArtifactHarness {
  const rootDirectory = temporaryRoot('sealed');
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
    authorityProvider: () => ARTIFACT_AUTHORITY,
    now: () => new Date(FIXTURE_TIMESTAMP),
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: join(rootDirectory, 'ledger'),
    auditLedgerId: 'artifact-audit',
    authorityProvider: () => ARTIFACT_AUTHORITY,
    now: () => new Date(FIXTURE_TIMESTAMP),
    identityResolver: ({ evaluationInput }) => ({
      actorId: evaluationInput.actorId,
      capabilityId: evaluationInput.capabilityId,
      evidenceDigest: evaluationInput.evidenceDigest,
    }),
  }, ledger, policies);
  const store = new SealedArtifactStore({
    rootDirectory: join(rootDirectory, 'store'),
    now: () => new Date(FIXTURE_TIMESTAMP),
  });
  const policy = policies.resolve('artifact-policy', 1);
  let eventIndex = 0;
  const nextMetadata = (label: string): ArtifactEventMetadata => {
    eventIndex += 1;
    return {
      eventId: `${label}-${eventIndex}`,
      streamId: 'artifact-stream',
      streamSequence: eventIndex,
      occurredAt: FIXTURE_TIMESTAMP,
      recordedAt: FIXTURE_TIMESTAMP,
      producer: { name: 'shadow-parity-tests', version: '1' },
      authorityEpoch: ARTIFACT_AUTHORITY.epoch,
      correlationId: `artifact-correlation-${eventIndex}`,
      causationId: null,
      idempotencyKey: `artifact-idempotency-${eventIndex}`,
    };
  };
  const recorder: ArtifactEventRecorder = {
    ledger,
    gateway,
    authorizationContext: (event): ArtifactAuthorizationContext => ({
      requestId: `artifact-request-${event.identity.eventId}`,
      mode: 'research',
      priorStateVersion: 'artifact-state@1',
      priorStateFingerprint: ARTIFACT_STATE_DIGEST,
      actorId: 'shadow-parity-test',
      capabilityId: 'artifact-write',
      authorityEpoch: ARTIFACT_AUTHORITY.epoch,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: sha256Bytes(canonicalBytes({ event: event.canonicalDigest })),
    }),
  };
  return { rootDirectory, ledger, store, recorder, registry, nextMetadata };
}

async function sealAndRecord(
  harness: ArtifactHarness,
  artifactKind: string,
  source: unknown,
  label: string,
): Promise<VerifiedArtifactEvidence> {
  const sealed = await harness.store.seal(artifactKind, source);
  const event = prepareArtifactSealedEvent(
    sealed.artifact,
    harness.registry,
    harness.nextMetadata(label),
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

async function createSealedFixture(): Promise<SealedFixture> {
  const harness = createArtifactHarness();
  const fixture = await sealAndRecord(
    harness,
    InitialArtifactKinds.FIXTURE,
    { scenario: 'RSB-001', inputs: ['prompt', 'initial-state'] },
    'fixture-sealed',
  );
  const configuration = await sealAndRecord(
    harness,
    InitialArtifactKinds.CONFIGURATION,
    { scale: 1, mode: 'research' },
    'configuration-sealed',
  );
  return {
    harness,
    forward: bindVerifiedArtifactReferences([fixture, configuration]),
    reverse: bindVerifiedArtifactReferences([configuration, fixture]),
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. REPLAY EXECUTION FIXTURES
// ───────────────────────────────────────────────────────────────────

function validateFixturePayload(payload: Readonly<JsonObject>): boolean {
  return typeof payload.value === 'number'
    && Number.isSafeInteger(payload.value)
    && typeof payload.label === 'string'
    && payload.label.length > 0;
}

function createParityEventRegistry(): EventTypeRegistry {
  const fixtureDefinition: EventTypeDefinition = {
    eventType: FIXTURE_EVENT_TYPE,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: ['label', 'value'],
        validate: validateFixturePayload,
      },
    }],
    upcasters: [],
  };
  return new EventTypeRegistry([
    fixtureDefinition,
    replayFingerprintAttestationEventDefinition(),
  ]);
}

async function authorize(
  ledger: AppendOnlyLedger,
  gateway: TransitionAuthorizationGateway,
  policies: TransitionPolicyRegistry,
  event: Parameters<typeof createFixtureRequest>[1],
  requestId: string,
): Promise<GatewayAllowProof> {
  const request = await createFixtureRequest(
    ledger,
    event,
    policies,
    requestId,
  );
  const result = await gateway.authorize(request);
  if (result.verdict !== 'allow') throw new Error('Expected fixture authorization');
  return result.proof;
}

function createComponentRegistry(
  context: ParityExecutionContext,
  projectionOffset: number,
): ReplayComponentRegistry<CountProjection> {
  const bindReplayInputs = (
    replayInputs: Readonly<Record<string, JsonValue>>,
  ): TypedReducerRegistry<CountProjection> => {
    if (!replayInputs[SEALED_ARTIFACT_REPLAY_INPUT_KEY]) {
      throw new Error('Missing sealed reference input');
    }
    return new TypedReducerRegistry<CountProjection>([{
      eventType: FIXTURE_EVENT_TYPE,
      reducerVersion: '1',
      reduce: (state, event) => ({
        count: state.count
          + Number(event.effective.envelope.payload.value)
          + projectionOffset,
        labels: [...state.labels, String(event.effective.envelope.payload.label)],
      }),
    }]);
  };
  const replaySources = {
    [SEALED_ARTIFACT_REPLAY_INPUT_KEY]: context.capsule.replayInput.source,
  };
  return new ReplayComponentRegistry([{
    reducerId: 'shadow-parity-test-reducer',
    reducerVersion: '1',
    projectionSchemaVersion: 'shadow-parity-test@1',
    requiredReplayInputKeys: [
      'initial_state',
      SEALED_ARTIFACT_REPLAY_INPUT_KEY,
    ],
    reducerRegistry: bindReplayInputs(replaySources),
    replayInputSources: replaySources,
    bindReplayInputs,
  }]);
}

function attestationEnvelope(path: 'dark' | 'legacy') {
  return {
    eventId: `${path}-fingerprint-attestation`,
    streamId: 'fingerprint-attestations',
    streamSequence: 1,
    occurredAt: FIXTURE_TIMESTAMP,
    recordedAt: FIXTURE_TIMESTAMP,
    producer: { name: 'shadow-parity-tests', version: '1' },
    authorityEpoch: FIXTURE_AUTHORITY.epoch,
    correlationId: `${path}-fingerprint-correlation`,
    causationId: null,
    idempotencyKey: `${path}-fingerprint-idempotency`,
  };
}

async function createLedgerTemplate(options: ExecutorOptions = {}): Promise<string> {
  const rootDirectory = temporaryRoot('ledger-template');
  const registry = createParityEventRegistry();
  const policies = createFixturePolicyRegistry();
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
    now: () => new Date(FIXTURE_TIMESTAMP),
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
    now: () => new Date(FIXTURE_TIMESTAMP),
    identityResolver: ({ evaluationInput }) => ({
      actorId: evaluationInput.actorId,
      capabilityId: evaluationInput.capabilityId,
      evidenceDigest: evaluationInput.evidenceDigest,
    }),
  }, ledger, policies);
  for (let index = 1; index <= 2; index += 1) {
    const event = createFixtureEvent(registry, index, {
      recorded_at: options.storedVariant
        ? '2026-07-20T12:00:01.000Z'
        : FIXTURE_TIMESTAMP,
      payload: {
        label: `event-${index}`,
        value: index + (options.eventValueOffset ?? 0),
      },
    });
    const requestId = options.storedVariant
      ? `stored-variant-request-${index}`
      : `parity-request-${index}`;
    const proof = await authorize(ledger, gateway, policies, event, requestId);
    await appendAuthorizedForTest(ledger, event, proof);
  }
  return rootDirectory;
}

function createExecutor(
  options: ExecutorOptions,
  template: Promise<string>,
): ParityPathExecutor<CountProjection> {
  return async (context): Promise<{
    verification: Parameters<typeof deriveReplayFingerprint<CountProjection>>[0];
    observations: Readonly<Partial<Record<ParityObservationClass, JsonValue>>>;
    projections: readonly Readonly<{
      artifactId: string;
      bytes: Uint8Array;
      readerResult: JsonValue;
      publicationBoundary: string;
      watermarkDigest: string;
      integrityDigest: string;
    }>[];
  }> => {
    if (options.delayMs) {
      await new Promise((resolveDelay) => setTimeout(resolveDelay, options.delayMs));
    }
    const templateRoot = await template;
    rmSync(context.executionRoot, { recursive: true, force: true });
    cpSync(templateRoot, context.executionRoot, {
      recursive: true,
      preserveTimestamps: true,
    });
    const registry = createParityEventRegistry();
    const policies = createFixturePolicyRegistry();
    const ledger = new AppendOnlyLedger({
      rootDirectory: context.executionRoot,
      ledgerId: FIXTURE_LEDGER_ID,
      auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
      authorityProvider: () => FIXTURE_AUTHORITY,
      now: () => new Date(FIXTURE_TIMESTAMP),
    }, registry);
    const gateway = new TransitionAuthorizationGateway({
      rootDirectory: context.executionRoot,
      auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
      authorityProvider: () => FIXTURE_AUTHORITY,
      now: () => new Date(FIXTURE_TIMESTAMP),
      identityResolver: ({ evaluationInput }) => ({
        actorId: evaluationInput.actorId,
        capabilityId: evaluationInput.capabilityId,
        evidenceDigest: evaluationInput.evidenceDigest,
      }),
    }, ledger, policies);
    const componentRegistry = createComponentRegistry(
      context,
      options.projectionOffset ?? 0,
    );
    const versionRegistry = createReplayFingerprintVersionRegistry();
    const runId = `${context.path}-run`;
    const replay = {
      reducerId: 'shadow-parity-test-reducer',
      reducerVersion: '1',
      projectionSchemaVersion: 'shadow-parity-test@1',
      initialState: INITIAL_STATE,
      replayInputDigests: {
        initial_state: INITIAL_STATE_DIGEST,
        [SEALED_ARTIFACT_REPLAY_INPUT_KEY]: context.capsule.replayInput.digest,
      },
    };
    const verification = {
      ledger,
      eventRegistry: registry,
      versionRegistry,
      componentRegistry,
      consumer: 'shadow-parity' as const,
      fingerprintVersion: 1,
      runId,
      rangeStartSequence: 1,
      rangeEndSequence: 2,
      replay,
    };
    const derived = await deriveReplayFingerprint(verification);
    if (!options.omitAttestation) {
      const attestation = prepareReplayFingerprintAttestation(
        derived,
        registry,
        versionRegistry,
        attestationEnvelope(context.path),
      );
      const proof = await authorize(
        ledger,
        gateway,
        policies,
        attestation,
        `${context.path}-attestation-request`,
      );
      await recordReplayFingerprintAttestation(
        ledger,
        attestation,
        proof,
        derived,
        versionRegistry,
      );
    }

    context.effectSink.record({
      operation: 'notify',
      target: options.effectTarget ?? 'shadow-only',
      payload_digest: sha256Bytes(canonicalBytes({ value: 3 })),
    });
    const observations: Partial<Record<ParityObservationClass, JsonValue>> = {
      'terminal-status': 'completed',
      'return-value': { count: 3 },
      'error-halt': null,
      'ordered-transitions': ['event-1', 'event-2'],
      'effect-receipts': context.effectSink.receipts() as JsonValue,
      budgets: { consumed: 2, remaining: 8 },
      'emitted-artifacts': ['legacy-state'],
      'reader-results': { count: 3 },
    };
    if (options.omitObservation) delete observations[options.omitObservation];
    if (options.observationOverride) {
      const override = options.observationOverride.value;
      observations[options.observationOverride.observation] =
        typeof override === 'function' ? override(context) : override;
    }
    const projectionIds = options.projectionIds ?? ['legacy-state'];
    return {
      verification,
      observations,
      projections: projectionIds.map((artifactId) => {
        const manifestEntry = LEGACY_PROJECTION_MANIFEST.find(
          (entry) => entry.surfaceId === artifactId,
        );
        const defaultText = manifestEntry?.format === 'jsonl'
          ? `${JSON.stringify({ artifactId, count: 3 })}\n`
          : `${JSON.stringify({ artifactId, count: 3 }, null, 2)}\n`;
        const projectionText = options.projectionBytes ?? defaultText;
        const projectionBytes = Uint8Array.from(Buffer.from(projectionText, 'utf8'));
        return Object.freeze({
          artifactId,
          bytes: projectionBytes,
          readerResult: options.projectionReaderResult ?? { artifactId, count: 3 },
          publicationBoundary: manifestEntry?.refreshBoundary ?? 'lifecycle',
          watermarkDigest: sha256Bytes(canonicalBytes({ artifactId, sequence: 2 })),
          integrityDigest: sha256Bytes(projectionBytes),
        });
      }),
    };
  };
}

function createExecutorPair(
  legacyOptions: ExecutorOptions = {},
  darkOptions: ExecutorOptions = {},
): Readonly<{
  legacy: ParityPathExecutor<CountProjection>;
  dark: ParityPathExecutor<CountProjection>;
}> {
  const sharedTemplate = createLedgerTemplate();
  const legacyNeedsDistinctStoredInput = Boolean(
    legacyOptions.eventValueOffset || legacyOptions.storedVariant,
  );
  const darkNeedsDistinctStoredInput = Boolean(
    darkOptions.eventValueOffset || darkOptions.storedVariant,
  );
  const legacyTemplate = legacyNeedsDistinctStoredInput
    ? createLedgerTemplate(legacyOptions)
    : sharedTemplate;
  const darkTemplate = darkNeedsDistinctStoredInput
    ? createLedgerTemplate(darkOptions)
    : sharedTemplate;
  return Object.freeze({
    legacy: createExecutor(legacyOptions, legacyTemplate),
    dark: createExecutor(darkOptions, darkTemplate),
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. PARITY AND CERTIFICATE FIXTURES
// ───────────────────────────────────────────────────────────────────

function caseDefinition(
  overrides: Readonly<Partial<ParityCaseDefinition>> = {},
): ParityCaseDefinition {
  return {
    caseId: 'RSB-001',
    scenarioId: 'RSB-001',
    mode: 'research',
    contractDigest: CONTRACT_DIGEST,
    requiredObservations: REQUIRED_OBSERVATIONS,
    projectionIds: ['legacy-state'],
    timeoutMs: 10_000,
    terminationPolicy: 'bounded-completion',
    ...overrides,
  };
}

function capsule(
  referenceSet: ArtifactReferenceSet,
  overrides: Readonly<Partial<ParityCaseCapsule>> = {},
): ParityCaseCapsule {
  return {
    baseSha: BASE_SHA,
    baseDigest: BASE_DIGEST,
    initialStateDigest: INITIAL_STATE_DIGEST,
    configurationDigest: CONFIGURATION_DIGEST,
    canonicalizationVersions: {
      artifact: 'deep-loop-json@1',
      event: 'canonical-json@1',
    },
    artifactReferenceSet: referenceSet,
    timeoutMs: 10_000,
    terminationPolicy: 'bounded-completion',
    ...overrides,
  };
}

function parityInput(
  sealed: SealedFixture,
  overrides: Readonly<{
    caseDefinition?: ParityCaseDefinition;
    legacyCapsule?: ParityCaseCapsule;
    darkCapsule?: ParityCaseCapsule;
    executeLegacy?: ParityPathExecutor<CountProjection>;
    executeDark?: ParityPathExecutor<CountProjection>;
    shadowRootDirectory?: string;
    protectedRoots?: readonly string[];
  }> = {},
): RunShadowParityCaseInput<CountProjection> {
  const root = temporaryRoot('execution');
  const defaultExecutors = createExecutorPair();
  return {
    caseDefinition: overrides.caseDefinition ?? caseDefinition(),
    shadowRootDirectory: overrides.shadowRootDirectory ?? join(root, 'shadow'),
    protectedRoots: overrides.protectedRoots ?? [join(root, 'authoritative')],
    legacy: {
      ledger: sealed.harness.ledger,
      store: sealed.harness.store,
      capsule: overrides.legacyCapsule ?? capsule(sealed.forward),
    },
    dark: {
      ledger: sealed.harness.ledger,
      store: sealed.harness.store,
      capsule: overrides.darkCapsule ?? capsule(sealed.forward),
    },
    executeLegacy: overrides.executeLegacy ?? defaultExecutors.legacy,
    executeDark: overrides.executeDark ?? defaultExecutors.dark,
    deterministicRuns: 2,
  };
}

function oneCaseManifest(mode = 'research') {
  const definition = caseDefinition({ mode });
  return compileParityCaseManifest({
    baseSha: BASE_SHA,
    baselineRows: [{
      scenarioId: definition.scenarioId,
      mode,
      contractDigest: CONTRACT_DIGEST,
      disposition: 'protected',
    }],
    cases: [definition],
  });
}

function certificateBindings(
  overrides: Readonly<Partial<ParityCertificateInvalidationBindings>> = {},
): ParityCertificateInvalidationBindings {
  return {
    candidate_code_digest: sha256Bytes(canonicalBytes({ identity: 'candidate-code' })),
    candidate_build_digest: sha256Bytes(canonicalBytes({ identity: 'candidate' })),
    seal_registry_digest: sha256Bytes(canonicalBytes({ identity: 'seal-registry' })),
    upcaster_digest: sha256Bytes(canonicalBytes({ identity: 'upcaster' })),
    harness_digest: sha256Bytes(canonicalBytes({ identity: 'harness' })),
    comparator_digest: sha256Bytes(canonicalBytes({ identity: 'comparator' })),
    replay_contract_digest: sha256Bytes(canonicalBytes({ identity: 'replay' })),
    reducer_digest: sha256Bytes(canonicalBytes({ identity: 'reducer' })),
    projection_digest: sha256Bytes(canonicalBytes({ identity: 'projection' })),
    adapter_digest: sha256Bytes(canonicalBytes({ identity: 'adapter' })),
    policy_version: 'transition-policy@1',
    ...overrides,
  };
}

function certificateExpectation(
  certificate: ParityCertificate,
  manifest = oneCaseManifest(),
  bindings = certificateBindings(),
  overrides: Readonly<{
    mode?: string;
    caseEvidenceDigests?: readonly string[];
    referenceSetDigests?: readonly string[];
    attestationFinalDigests?: readonly string[];
  }> = {},
) {
  return {
    manifest,
    mode: overrides.mode ?? 'research',
    bindings,
    caseEvidenceDigests:
      overrides.caseEvidenceDigests ?? certificate.case_evidence_digests,
    referenceSetDigests:
      overrides.referenceSetDigests ?? certificate.reference_set_digests,
    attestationFinalDigests:
      overrides.attestationFinalDigests ?? certificate.attestation_final_digests,
  };
}

async function realPass(): Promise<ShadowParityCasePass> {
  const sealed = await createSealedFixture();
  const result = await runShadowParityCase(parityInput(sealed));
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error('Expected real parity pass');
  return result;
}

async function realFailure(
  darkOptions: ExecutorOptions,
): Promise<ShadowParityCaseFailure> {
  const sealed = await createSealedFixture();
  const executors = createExecutorPair({}, darkOptions);
  const result = await runShadowParityCase(parityInput(sealed, {
    executeLegacy: executors.legacy,
    executeDark: executors.dark,
  }));
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error('Expected real parity divergence');
  return result;
}

function expectCertificateRefusal(failure: ShadowParityCaseFailure): void {
  expect(failure.authorityMutation).toBe(false);
  expect(failure.divergence.owner.length).toBeGreaterThan(0);
  expect(failure.divergence.message.length).toBeLessThanOrEqual(320);
  expect(issueParityCertificate({
    manifest: oneCaseManifest(),
    mode: 'research',
    caseResults: [failure],
    bindings: certificateBindings(),
  })).toMatchObject({ ok: false, refusal: { code: 'OPEN_DIVERGENCE' } });
}

afterEach(() => {
  while (temporaryRoots.length > 0) {
    const root = temporaryRoots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 5. MANIFEST CLOSURE
// ───────────────────────────────────────────────────────────────────

describe('shadow parity manifest closure', () => {
  it('publishes strict versioned schemas for every protocol artifact', () => {
    expect(SHADOW_PARITY_SCHEMA_FILES).toHaveLength(5);
    for (const fileName of SHADOW_PARITY_SCHEMA_FILES) {
      const schema = JSON.parse(readFileSync(
        join(SHADOW_PARITY_SCHEMA_ROOT, fileName),
        'utf8',
      )) as Record<string, unknown>;
      expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
      expect(schema.$id).toMatch(/shadow-parity\/.+\.v1\.schema\.json$/);
      expect(schema.additionalProperties).toBe(false);
      expect(schema.required).toEqual(expect.any(Array));
    }
  });

  it('closes all fifty-six census scenarios without normalizing known defects', () => {
    const baseline = JSON.parse(readFileSync(
      join(CENSUS_ROOT, 'behavior-baseline.json'),
      'utf8',
    )) as BehaviorBaseline;
    const defectLedger = JSON.parse(readFileSync(
      join(CENSUS_ROOT, 'contract-defect-ledger.json'),
      'utf8',
    )) as DefectLedger;
    const stateCensus = JSON.parse(readFileSync(
      join(CENSUS_ROOT, 'state-backend-census.json'),
      'utf8',
    )) as CensusRows;
    const eventCensus = JSON.parse(readFileSync(
      join(CENSUS_ROOT, 'event-schema-census.json'),
      'utf8',
    )) as CensusRows;
    const knownDefectScenarios = new Set(
      defectLedger.rows
        .filter((row) => row.classification === 'known_defect')
        .flatMap((row) => row.scenarioOrFixture.match(/[A-Z]{2,3}B-\d{3}/g) ?? []),
    );
    const scenarios = [...baseline.existingScenarios, ...baseline.addedScenarios];
    const workstreamByScenario = new Map(baseline.workstreamAssertions.map(
      (entry) => [entry.scenarioId, entry.workstream],
    ));
    const stateSurfaceIds = stateCensus.rows.map((row) => row.id);
    const readerIds = Array.from(new Set([
      ...stateCensus.rows,
      ...eventCensus.rows,
    ].flatMap((row) => row.readers ?? []).map(
      (reader) => `reader-${sha256Bytes(canonicalBytes(reader)).slice(0, 16)}`,
    )));
    const effectIds = eventCensus.rows.map((row) => row.id);
    const projectionIds = LEGACY_PROJECTION_MANIFEST
      .filter((entry) => entry.disposition === 'project')
      .map((entry) => entry.surfaceId);
    const baselineRows: ParityBaselineRow[] = scenarios.map((scenario) => ({
      scenarioId: scenario.id,
      mode: scenario.mode,
      contractDigest: scenario.contractDigest,
      disposition: knownDefectScenarios.has(scenario.id) ? 'known-defect' : 'protected',
    }));
    const cases = scenarios.map((scenario, index): ParityCaseDefinition => ({
      caseId: scenario.id,
      scenarioId: scenario.id,
      mode: scenario.mode,
      contractDigest: scenario.contractDigest,
      requiredObservations: REQUIRED_OBSERVATIONS,
      projectionIds: index === 0 ? projectionIds : ['behavior-benchmark-output'],
      ...(workstreamByScenario.has(scenario.id)
        ? { workstreamId: String(workstreamByScenario.get(scenario.id)) }
        : {}),
      ...(index === 0 ? {
        stateSurfaceIds,
        readerIds,
        effectIds,
      } : {}),
      timeoutMs: 180_000,
      terminationPolicy: 'behavior-benchmark',
    }));

    const manifest = compileParityCaseManifest({
      baseSha: baseline.baseSha,
      baselineRows,
      cases,
      requiredCoverage: {
        modeIds: Array.from(new Set(scenarios.map((scenario) => scenario.mode))),
        workstreamIds: baseline.workstreamAssertions.map((entry) => entry.workstream),
        observationIds: [...REQUIRED_OBSERVATIONS],
        stateSurfaceIds,
        readerIds,
        effectIds,
        projectionIds,
      },
    });
    expect(manifest.caseCount).toBe(56);
    expect(manifest.cases).toHaveLength(56);
    expect(manifest.coverage.workstreamIds).toHaveLength(8);
    expect(manifest.coverage.stateSurfaceIds).toHaveLength(stateCensus.rows.length);
    expect(manifest.coverage.effectIds).toHaveLength(eventCensus.rows.length);
    expect(manifest.coverage.projectionIds).toHaveLength(projectionIds.length);
    expect(manifest.baselineRows.filter(
      (row) => row.disposition === 'known-defect',
    ).map((row) => row.scenarioId)).toEqual(expect.arrayContaining(['IMB-007', 'IMB-008']));
  });

  it('rejects a missing baseline case instead of certifying partial coverage', () => {
    expect(() => compileParityCaseManifest({
      baseSha: BASE_SHA,
      baselineRows: [{
        scenarioId: 'RSB-001',
        mode: 'research',
        contractDigest: CONTRACT_DIGEST,
        disposition: 'protected',
      }],
      cases: [],
    })).toThrowError(expect.objectContaining({ code: ShadowParityErrorCodes.MANIFEST_GAP }));
  });

  it('rejects duplicate scenario coverage with conflicting case identities', () => {
    const definition = caseDefinition();
    expect(() => compileParityCaseManifest({
      baseSha: BASE_SHA,
      baselineRows: [{
        scenarioId: definition.scenarioId,
        mode: definition.mode,
        contractDigest: definition.contractDigest,
        disposition: 'protected',
      }],
      cases: [definition, { ...definition, caseId: 'RSB-001-duplicate' }],
    })).toThrowError(expect.objectContaining({ code: ShadowParityErrorCodes.MANIFEST_CONFLICT }));
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. SEALED EXECUTION AND REPLAY PARITY
// ───────────────────────────────────────────────────────────────────

describe('shadow parity execution', () => {
  it('passes only after independent attestations verify equal stored, effective, and projection digests', async () => {
    const result = await realPass();
    expect(result.runs).toHaveLength(2);
    expect(result.runs[0].legacy.finalDigest).not.toBe(result.runs[0].dark.finalDigest);
    expect(result.runs[0].legacy.storedDigest).toBe(result.runs[0].dark.storedDigest);
    expect(result.runs[0].legacy.effectiveEventDigest).toBe(
      result.runs[0].dark.effectiveEventDigest,
    );
    expect(result.runs[0].legacy.projectionDigest).toBe(
      result.runs[0].dark.projectionDigest,
    );
    expect(result.runs[0].legacy.sealedInputDigest).toBe(
      result.runs[0].dark.sealedInputDigest,
    );
    expect(result.authorityState).toBe('legacy_authoritative');
    expect(result.authorityMutation).toBe(false);
  });

  it('matches every declared projectable legacy shape byte and reader result', async () => {
    const sealed = await createSealedFixture();
    const projectionIds = LEGACY_PROJECTION_MANIFEST
      .filter((entry) => entry.disposition === 'project')
      .map((entry) => entry.surfaceId);
    const executors = createExecutorPair(
      { projectionIds },
      { projectionIds },
    );
    const result = await runShadowParityCase(parityInput(sealed, {
      caseDefinition: caseDefinition({ projectionIds }),
      executeLegacy: executors.legacy,
      executeDark: executors.dark,
    }));
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('Expected complete legacy-shape parity');
    expect(projectionIds).toHaveLength(22);
    expect(result.runs.every((run) => (
      run.legacyProjectionDigest === run.darkProjectionDigest
    ))).toBe(true);
  });

  it('blocks reordered sealed references before either executor starts', async () => {
    const sealed = await createSealedFixture();
    let executionCount = 0;
    const executors = createExecutorPair();
    const counted: ParityPathExecutor<CountProjection> = async (context) => {
      executionCount += 1;
      return context.path === 'legacy'
        ? executors.legacy(context)
        : executors.dark(context);
    };
    const result = await runShadowParityCase(parityInput(sealed, {
      darkCapsule: capsule(sealed.reverse),
      executeLegacy: counted,
      executeDark: counted,
    }));
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error('Expected sealed-input divergence');
    expect(result.divergence.class).toBe('input-inequivalent');
    expect(executionCount).toBe(0);
    expectCertificateRefusal(result);
  });

  it.each([
    ['BASE', { baseDigest: sha256Bytes(canonicalBytes({ changed: 'base' })) }],
    ['initial state', { initialStateDigest: sha256Bytes(canonicalBytes({ changed: 'state' })) }],
    ['configuration', { configurationDigest: sha256Bytes(canonicalBytes({ changed: 'config' })) }],
    ['timeout contract', { timeoutMs: 9_999 }],
  ] as const)('blocks altered %s identity before execution', async (_label, capsuleChange) => {
    const sealed = await createSealedFixture();
    let executed = false;
    const executors = createExecutorPair();
    const counted: ParityPathExecutor<CountProjection> = async (context) => {
      executed = true;
      return context.path === 'legacy'
        ? executors.legacy(context)
        : executors.dark(context);
    };
    const result = await runShadowParityCase(parityInput(sealed, {
      darkCapsule: capsule(sealed.forward, capsuleChange),
      executeLegacy: counted,
      executeDark: counted,
    }));
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error('Expected capsule divergence');
    expect(result.divergence.class).toBe('input-inequivalent');
    expect(executed).toBe(false);
  });

  it('rejects a protected-root collision without invoking either path', async () => {
    const sealed = await createSealedFixture();
    const collisionRoot = temporaryRoot('collision');
    let executed = false;
    const executors = createExecutorPair();
    const counted: ParityPathExecutor<CountProjection> = async (context) => {
      executed = true;
      return context.path === 'legacy'
        ? executors.legacy(context)
        : executors.dark(context);
    };
    const result = await runShadowParityCase(parityInput(sealed, {
      shadowRootDirectory: collisionRoot,
      protectedRoots: [collisionRoot],
      executeLegacy: counted,
      executeDark: counted,
    }));
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error('Expected isolation failure');
    expect(result.divergence.class).toBe('harness-invalid');
    expect(executed).toBe(false);
    expectCertificateRefusal(result);
  });

  it.each(REQUIRED_OBSERVATIONS)(
    'fails when required observation %s is absent instead of comparing a subset',
    async (observation) => {
      const failure = await realFailure({ omitObservation: observation });
      expect(failure.divergence.class).toBe('missing-observation');
      expect(failure.divergence.earliest.component).toBe(observation);
      expectCertificateRefusal(failure);
    },
  );

  it('refuses a path that has no stored replay attestation', async () => {
    const failure = await realFailure({ omitAttestation: true });
    expect(failure.divergence.class).toBe('replay-contract-drift');
    expect(failure.divergence.earliest.component).toBe('attestation');
    expectCertificateRefusal(failure);
  });

  it('detects a verified event divergence even when the dark path attests itself', async () => {
    const failure = await realFailure({ eventValueOffset: 1 });
    expect(failure.divergence.class).toBe('effective-event');
    expect(['stored', 'effective-event']).toContain(failure.divergence.earliest.component);
    expectCertificateRefusal(failure);
  });

  it('detects a stored-ledger divergence before equal reducer output can mask it', async () => {
    const failure = await realFailure({ storedVariant: true });
    expect(failure.divergence.class).toBe('effective-event');
    expect(failure.divergence.earliest.component).toBe('stored');
  });

  it('detects a verified replay projection divergence', async () => {
    const failure = await realFailure({ projectionOffset: 1 });
    expect(failure.divergence.class).toBe('projection-semantic');
    expect(failure.divergence.earliest.component).toBe('projection');
    expectCertificateRefusal(failure);
  });

  it('classifies terminal behavior mismatch as execution-outcome', async () => {
    const failure = await realFailure({
      observationOverride: {
        observation: 'terminal-status',
        value: 'halted',
      },
    });
    expect(failure.divergence.class).toBe('execution-outcome');
    expectCertificateRefusal(failure);
  });

  it('classifies differing suppressed effect intent as a side-effect divergence', async () => {
    const failure = await realFailure({ effectTarget: 'different-shadow-target' });
    expect(failure.divergence.class).toBe('side-effect');
    expect(failure.divergence.owner).toBe('effect-adapter-owner');
    expectCertificateRefusal(failure);
  });

  it('classifies a bounded timeout as timing-termination and refuses certification', async () => {
    const sealed = await createSealedFixture();
    const executors = createExecutorPair({}, { delayMs: 40 });
    const boundedCase = caseDefinition({ timeoutMs: 10 });
    const result = await runShadowParityCase(parityInput(sealed, {
      caseDefinition: boundedCase,
      legacyCapsule: capsule(sealed.forward, { timeoutMs: 10 }),
      darkCapsule: capsule(sealed.forward, { timeoutMs: 10 }),
      executeLegacy: executors.legacy,
      executeDark: executors.dark,
    }));
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error('Expected timing divergence');
    expect(result.divergence.class).toBe('timing-termination');
    expect(issueParityCertificate({
      manifest: oneCaseManifest(),
      mode: 'research',
      caseResults: [result],
      bindings: certificateBindings(),
    })).toMatchObject({ ok: false, refusal: { code: 'OPEN_DIVERGENCE' } });
  });

  it('removes both isolated execution roots and records cleanup evidence', async () => {
    const sealed = await createSealedFixture();
    const root = temporaryRoot('cleanup');
    const shadowRoot = join(root, 'shadow');
    const result = await runShadowParityCase(parityInput(sealed, {
      shadowRootDirectory: shadowRoot,
      protectedRoots: [join(root, 'authoritative')],
    }));
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('Expected parity pass');
    expect(existsSync(shadowRoot)).toBe(true);
    expect(readdirSync(shadowRoot)).toEqual([]);
    expect(result.runs.every((run) => run.cleanupReceipt?.removed === true)).toBe(true);
  });

  it('compares exact legacy bytes instead of accepting matching semantic claims', async () => {
    const failure = await realFailure({
      projectionBytes: '{ "count": 3 }\n',
    });
    expect(failure.divergence.class).toBe('legacy-byte');
    expect(failure.divergence.earliest.component).toBe('legacy-state');
    expectCertificateRefusal(failure);
  });

  it('classifies a changed dark rerun as nondeterministic before cross-path comparison', async () => {
    const failure = await realFailure({
      observationOverride: {
        observation: 'return-value',
        value: (context) => ({ count: context.runIndex === 1 ? 3 : 4 }),
      },
    });
    expect(failure.divergence.class).toBe('nondeterministic');
    expect(failure.divergence.earliest.component).toBe('dark-rerun');
    expectCertificateRefusal(failure);
  });

  it('derives the same platform-neutral commitment in independent Node processes', () => {
    const material = {
      baseSha: BASE_SHA,
      components: ['effective-event', 'projection', 'legacy-bytes'],
      identities: certificateBindings(),
    };
    const script = [
      "import { createHash } from 'node:crypto';",
      'const sort = (value) => Array.isArray(value)',
      '  ? value.map(sort)',
      '  : value && typeof value === "object"',
      '    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, sort(value[key])]))',
      '    : value;',
      'const bytes = Buffer.from(JSON.stringify(sort(JSON.parse(process.argv[1]))));',
      'process.stdout.write(createHash("sha256").update(bytes).digest("hex"));',
    ].join('\n');
    const run = () => spawnSync(
      process.execPath,
      ['--input-type=module', '-e', script, JSON.stringify(material)],
      { encoding: 'utf8' },
    );
    const first = run();
    const second = run();
    expect(first.status).toBe(0);
    expect(second.status).toBe(0);
    expect(first.stdout).toBe(second.stdout);
    expect(first.stdout).toBe(sha256Bytes(canonicalBytes(material)));
  });

  it('preserves protected authority bytes across positive and negative runs', async () => {
    const sealed = await createSealedFixture();
    const root = temporaryRoot('authority-snapshot');
    const authorityRoot = join(root, 'authoritative');
    const authorityFile = join(authorityRoot, 'legacy-authority.json');
    mkdirSync(authorityRoot, { recursive: true });
    writeFileSync(authorityFile, '{"authority":"legacy"}\n', 'utf8');
    const before = readFileSync(authorityFile);
    const pass = await runShadowParityCase(parityInput(sealed, {
      shadowRootDirectory: join(root, 'shadow-pass'),
      protectedRoots: [authorityRoot],
    }));
    const executors = createExecutorPair({}, { projectionBytes: '{ "count": 3 }\n' });
    const mismatch = await runShadowParityCase(parityInput(sealed, {
      shadowRootDirectory: join(root, 'shadow-fail'),
      protectedRoots: [authorityRoot],
      executeLegacy: executors.legacy,
      executeDark: executors.dark,
    }));
    expect(pass.ok).toBe(true);
    expect(mismatch.ok).toBe(false);
    expect(readFileSync(authorityFile)).toEqual(before);
  });
});

// ───────────────────────────────────────────────────────────────────
// 7. CERTIFICATE GATES
// ───────────────────────────────────────────────────────────────────

describe('shadow parity certificates', () => {
  it('registers every invalidating identity in one deterministic commitment', async () => {
    const pass = await realPass();
    const manifest = oneCaseManifest();
    const bindings = certificateBindings();
    const registry = createParityInvalidationIdentityRegistry({
      manifest,
      caseResults: [pass],
      bindings,
    });
    expect(Object.keys(registry.identities).sort()).toEqual([
      'adapter',
      'base',
      'build',
      'code',
      'comparator',
      'harness',
      'projection',
      'reducer',
      'replay',
      'seal',
      'upcaster',
    ]);
    expect(registry.registry_digest).toMatch(/^[a-f0-9]{64}$/);
  });

  it('issues one idempotent shadow-only certificate for the complete green mode set', async () => {
    const pass = await realPass();
    const manifest = oneCaseManifest();
    const bindings = certificateBindings();
    const first = issueParityCertificate({
      manifest,
      mode: 'research',
      caseResults: [pass],
      bindings,
    });
    const second = issueParityCertificate({
      manifest,
      mode: 'research',
      caseResults: [pass, pass],
      bindings,
    });
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (!first.ok || !second.ok) throw new Error('Expected certificate issuance');
    expect(second.certificate).toEqual(first.certificate);
    expect(first.certificate.open_divergence_count).toBe(0);
    expect(first.certificate.authority_state).toBe('legacy_authoritative');
    expect(first.certificate.authority_mutation).toBe(false);
    expect(first.certificate.rollback_minimum_days).toBe(
      TRANSITION_ROLLBACK_MINIMUM_DAYS,
    );
    expect(first.certificate.rollback_minimum_successful_runs).toBe(
      TRANSITION_ROLLBACK_MINIMUM_SUCCESSFUL_RUNS,
    );
    expect(verifyParityCertificate(
      first.certificate,
      certificateExpectation(first.certificate, manifest, bindings),
    )).toEqual({
      ok: true,
      certificateDigest: first.certificate.certificate_digest,
    });
  });

  it('refuses certificate issuance for an unresolved real divergence', async () => {
    const divergence = await realFailure({ eventValueOffset: 1 });
    const issuance = issueParityCertificate({
      manifest: oneCaseManifest(),
      mode: 'research',
      caseResults: [divergence],
      bindings: certificateBindings(),
    });
    expect(issuance).toMatchObject({
      ok: false,
      refusal: { code: 'OPEN_DIVERGENCE' },
    });
    expect(issuance).not.toHaveProperty('certificate');
  });

  it('closes immutable divergence evidence only after a complete green rerun', async () => {
    const divergence = await realFailure({ eventValueOffset: 1 });
    const pass = await realPass();
    expect(closeParityDivergence({
      divergence: divergence.divergence,
      requiredCaseIds: [divergence.caseId],
      rerunResults: [divergence],
    })).toMatchObject({ ok: false, refusal: { code: 'OPEN_DIVERGENCE' } });
    const closure = closeParityDivergence({
      divergence: divergence.divergence,
      requiredCaseIds: [pass.caseId],
      rerunResults: [pass],
    });
    expect(closure).toMatchObject({ ok: true, closure: { status: 'closed' } });
    expect(divergence.divergence.status).toBe('open');
  });

  it('rejects conflicting duplicate evidence for one case identity', async () => {
    const pass = await realPass();
    const conflicting = Object.freeze({
      ...pass,
      evidenceDigest: sha256Bytes(canonicalBytes({ conflicting: true })),
    });
    expect(issueParityCertificate({
      manifest: oneCaseManifest(),
      mode: 'research',
      caseResults: [pass, conflicting],
      bindings: certificateBindings(),
    })).toMatchObject({ ok: false, refusal: { code: 'DUPLICATE_CONFLICT' } });
  });

  it('refuses zero-discovery and partial mode closures', async () => {
    const pass = await realPass();
    const manifest = oneCaseManifest();
    expect(issueParityCertificate({
      manifest,
      mode: 'review',
      caseResults: [],
      bindings: certificateBindings(),
    })).toMatchObject({ ok: false, refusal: { code: 'ZERO_DISCOVERY' } });
    expect(issueParityCertificate({
      manifest,
      mode: 'research',
      caseResults: [],
      bindings: certificateBindings(),
    })).toMatchObject({ ok: false, refusal: { code: 'PARTIAL_CASE_SET' } });
    expect(issueParityCertificate({
      manifest,
      mode: 'review',
      caseResults: [pass],
      bindings: certificateBindings(),
    })).toMatchObject({ ok: false, refusal: { code: 'ZERO_DISCOVERY' } });
  });

  it.each([
    'candidate_code_digest',
    'candidate_build_digest',
    'seal_registry_digest',
    'upcaster_digest',
    'harness_digest',
    'comparator_digest',
    'replay_contract_digest',
    'reducer_digest',
    'projection_digest',
    'adapter_digest',
    'policy_version',
  ] as const)('rejects certificate drift in %s', async (field) => {
    const pass = await realPass();
    const manifest = oneCaseManifest();
    const bindings = certificateBindings();
    const issuance = issueParityCertificate({
      manifest,
      mode: 'research',
      caseResults: [pass],
      bindings,
    });
    if (!issuance.ok) throw new Error('Expected certificate issuance');
    const changedValue = field === 'policy_version'
      ? 'transition-policy@2'
      : sha256Bytes(canonicalBytes({ changed: field }));
    const verification = verifyParityCertificate(
      issuance.certificate,
      certificateExpectation(
        issuance.certificate,
        manifest,
        certificateBindings({ [field]: changedValue }),
      ),
    );
    expect(verification).toMatchObject({
      ok: false,
      refusal: { code: 'STALE_EVIDENCE' },
    });
  });

  it('rejects certificate drift in the immutable BASE identity', async () => {
    const pass = await realPass();
    const manifest = oneCaseManifest();
    const bindings = certificateBindings();
    const issuance = issueParityCertificate({
      manifest,
      mode: 'research',
      caseResults: [pass],
      bindings,
    });
    if (!issuance.ok) throw new Error('Expected certificate issuance');
    const changedDefinition = caseDefinition();
    const changedManifest = compileParityCaseManifest({
      baseSha: 'a'.repeat(40),
      baselineRows: [{
        scenarioId: changedDefinition.scenarioId,
        mode: changedDefinition.mode,
        contractDigest: changedDefinition.contractDigest,
        disposition: 'protected',
      }],
      cases: [changedDefinition],
    });
    expect(verifyParityCertificate(
      issuance.certificate,
      certificateExpectation(issuance.certificate, changedManifest, bindings),
    )).toMatchObject({ ok: false, refusal: { code: 'STALE_EVIDENCE' } });
  });

  it('rejects missing, wrong-mode, and tampered certificates', async () => {
    const pass = await realPass();
    const manifest = oneCaseManifest();
    const bindings = certificateBindings();
    const issuance = issueParityCertificate({
      manifest,
      mode: 'research',
      caseResults: [pass],
      bindings,
    });
    if (!issuance.ok) throw new Error('Expected certificate issuance');
    expect(verifyParityCertificate(
      null,
      certificateExpectation(issuance.certificate, manifest, bindings),
    )).toMatchObject({ ok: false, refusal: { code: 'UNVERIFIABLE' } });
    expect(verifyParityCertificate(
      issuance.certificate,
      certificateExpectation(issuance.certificate, manifest, bindings, {
        mode: 'review',
      }),
    )).toMatchObject({ ok: false, refusal: { code: 'WRONG_MODE' } });
    expect(verifyParityCertificate({
      ...issuance.certificate,
      evidence_digest: sha256Bytes(canonicalBytes({ tampered: true })),
    }, certificateExpectation(
      issuance.certificate,
      manifest,
      bindings,
    ))).toMatchObject({ ok: false, refusal: { code: 'UNVERIFIABLE' } });
  });

  it.each([
    'caseEvidenceDigests',
    'referenceSetDigests',
    'attestationFinalDigests',
  ] as const)('rejects current replay-evidence drift in %s', async (field) => {
    const pass = await realPass();
    const manifest = oneCaseManifest();
    const bindings = certificateBindings();
    const issuance = issueParityCertificate({
      manifest,
      mode: 'research',
      caseResults: [pass],
      bindings,
    });
    if (!issuance.ok) throw new Error('Expected certificate issuance');
    const changed = [sha256Bytes(canonicalBytes({ changed: field }))];
    expect(verifyParityCertificate(
      issuance.certificate,
      certificateExpectation(issuance.certificate, manifest, bindings, {
        [field]: changed,
      }),
    )).toMatchObject({
      ok: false,
      refusal: { code: 'STALE_EVIDENCE' },
    });
  });
});
