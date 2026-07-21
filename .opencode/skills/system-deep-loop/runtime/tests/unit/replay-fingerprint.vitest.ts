// ───────────────────────────────────────────────────────────────────
// MODULE: Replay Fingerprint Tests
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TypedReducerRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  EventTypeRegistry,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  FINGERPRINT_CANONICALIZATION_ALGORITHM,
  FINGERPRINT_HASH_ALGORITHM,
  FingerprintVersionRegistry,
  REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE,
  ReplayComponentRegistry,
  ReplayFingerprintErrorCodes,
  createReplayFingerprintVersionRegistry,
  deriveReplayFingerprint,
  parseReplayFingerprintAttestationPayload,
  prepareReplayFingerprintAttestation,
  recordReplayFingerprintAttestation,
  replayFingerprintAttestationEventDefinition,
  serializeReplayFingerprintDescriptor,
  verifyReplayFingerprint,
} from '../../lib/replay-fingerprint/index.js';
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
  GatewayAllowProof,
  LedgerRecordFrame,
  TransitionAuthorizationRequest,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import type {
  EventEnvelope,
  EventTypeDefinition,
  EventTypeRegistry as EventTypeRegistryType,
  EventWritePreflight,
  JsonObject,
  JsonValue,
  UpcastOutcome,
} from '../../lib/event-envelope/index.js';
import type {
  DerivedReplayFingerprint,
  ReplayExecutionInput,
  ReplayFingerprintDescriptor,
  ReplayFingerprintVerificationResult,
} from '../../lib/replay-fingerprint/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE TYPES
// ───────────────────────────────────────────────────────────────────

interface CountProjection extends JsonObject {
  count: number;
  labels: string[];
}

interface Harness {
  readonly rootDirectory: string;
  readonly registry: EventTypeRegistryType;
  readonly policies: TransitionPolicyRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
}

interface RegistryOptions {
  readonly validator?: 'base' | 'drift';
  readonly upcaster?: 'a' | 'b';
  readonly attestation?: 'strict' | 'missing-version';
}

// ───────────────────────────────────────────────────────────────────
// 2. FIXTURE REGISTRIES
// ───────────────────────────────────────────────────────────────────

const AUXILIARY_EVENT_TYPE = 'deep-loop.fixture.auxiliary-recorded';
const RUN_ID = 'fixture-run';
const HOSTILE_LOCALE_FINGERPRINT_TEST_NAME =
  'keeps the fingerprint stable across a hostile-collation child process';
const INITIAL_STATE: CountProjection = Object.freeze({
  count: 0,
  labels: Object.freeze([]) as unknown as string[],
});
const temporaryRoots: string[] = [];

function validateFixturePayload(payload: Readonly<JsonObject>): boolean {
  return typeof payload.value === 'number'
    && Number.isSafeInteger(payload.value)
    && typeof payload.label === 'string'
    && payload.label.length > 0;
}

function validateFixturePayloadDrifted(payload: Readonly<JsonObject>): boolean {
  const isIntegerValue = typeof payload.value === 'number'
    && Number.isSafeInteger(payload.value);
  return isIntegerValue
    && typeof payload.label === 'string'
    && payload.label.length > 0;
}

function validateAuxiliaryPayload(payload: Readonly<JsonObject>): boolean {
  return typeof payload.value === 'string';
}

function upcastAuxiliaryA(event: EventEnvelope): UpcastOutcome {
  return {
    envelope: { ...event, event_version: 2 },
    sourceFieldMap: { value: 'value' },
  };
}

function upcastAuxiliaryB(event: EventEnvelope): UpcastOutcome {
  const envelope = { ...event, event_version: 2 };
  return {
    envelope,
    sourceFieldMap: { value: 'value' },
  };
}

function validateMissingVersionAttestation(payload: Readonly<JsonObject>): boolean {
  return typeof payload.ledger_id === 'string'
    && typeof payload.run_id === 'string'
    && typeof payload.descriptor === 'object'
    && payload.descriptor !== null
    && typeof payload.descriptor_bytes_base64 === 'string'
    && typeof payload.final_digest === 'string';
}

function missingVersionAttestationDefinition(): EventTypeDefinition {
  return {
    eventType: REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: [
          'ledger_id',
          'run_id',
          'range_start_sequence',
          'range_end_sequence',
          'descriptor',
          'descriptor_bytes_base64',
          'final_digest',
        ],
        validate: validateMissingVersionAttestation,
      },
    }],
    upcasters: [],
  };
}

function createEventRegistry(options: RegistryOptions = {}): EventTypeRegistryType {
  const fixtureDefinition: EventTypeDefinition = {
    eventType: FIXTURE_EVENT_TYPE,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: ['label', 'value'],
        validate: options.validator === 'drift'
          ? validateFixturePayloadDrifted
          : validateFixturePayload,
      },
    }],
    upcasters: [],
  };
  const auxiliaryDefinition: EventTypeDefinition = {
    eventType: AUXILIARY_EVENT_TYPE,
    currentVersion: 2,
    versions: [
      {
        version: 1,
        payload: {
          requiredFields: ['value'],
          validate: validateAuxiliaryPayload,
        },
      },
      {
        version: 2,
        payload: {
          requiredFields: ['value'],
          validate: validateAuxiliaryPayload,
        },
      },
    ],
    upcasters: [{
      identity: options.upcaster === 'b' ? 'auxiliary-b' : 'auxiliary-a',
      fromVersion: 1,
      toVersion: 2,
      upcast: options.upcaster === 'b' ? upcastAuxiliaryB : upcastAuxiliaryA,
    }],
  };
  const attestationDefinition = options.attestation === 'missing-version'
    ? missingVersionAttestationDefinition()
    : replayFingerprintAttestationEventDefinition();
  return new EventTypeRegistry([
    fixtureDefinition,
    auxiliaryDefinition,
    attestationDefinition,
  ]);
}

// ───────────────────────────────────────────────────────────────────
// 3. LEDGER FIXTURES
// ───────────────────────────────────────────────────────────────────

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), 'replay-fingerprint-' + label + '-'));
  temporaryRoots.push(root);
  return root;
}

function createHarness(
  registry = createEventRegistry(),
  rootDirectory = temporaryRoot('case'),
): Harness {
  const policies = createFixturePolicyRegistry();
  const authorityProvider = () => FIXTURE_AUTHORITY;
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider,
  }, ledger, policies);
  return { rootDirectory, registry, policies, ledger, gateway };
}

function reopenHarness(harness: Harness, registry: EventTypeRegistryType): Harness {
  return createHarness(registry, harness.rootDirectory);
}

async function authorize(
  harness: Harness,
  event: EventWritePreflight,
  requestId: string,
  overrides: Readonly<Partial<TransitionAuthorizationRequest>> = {},
): Promise<GatewayAllowProof> {
  const request = await createFixtureRequest(
    harness.ledger,
    event,
    harness.policies,
    requestId,
    overrides,
  );
  const result = await harness.gateway.authorize(request);
  expect(result.verdict).toBe('allow');
  if (result.verdict !== 'allow') {
    throw new Error('Expected authorized fixture event');
  }
  return result.proof;
}

async function appendFixtures(harness: Harness, count = 3): Promise<void> {
  for (let index = 1; index <= count; index += 1) {
    const event = createFixtureEvent(harness.registry, index);
    const proof = await authorize(harness, event, 'fixture-request-' + String(index));
    await harness.ledger.appendAuthorized(event, proof);
  }
}

async function committedHarness(
  options: RegistryOptions = {},
): Promise<Harness> {
  const harness = createHarness(createEventRegistry(options));
  await appendFixtures(harness);
  return harness;
}

function framePath(rootDirectory: string, sequence: number): string {
  return join(
    rootDirectory,
    FIXTURE_LEDGER_ID,
    'frames',
    String(sequence).padStart(16, '0') + '.frame',
  );
}

function cloneRoot(source: string, label: string): string {
  const destination = temporaryRoot(label);
  rmSync(destination, { recursive: true, force: true });
  cpSync(source, destination, { recursive: true, preserveTimestamps: true });
  return destination;
}

// ───────────────────────────────────────────────────────────────────
// 4. REPLAY FIXTURES
// ───────────────────────────────────────────────────────────────────

function createComponentRegistry(
  options: Readonly<{
    reducerId?: string;
    reducerVersion?: string;
    projectionSchemaVersion?: string;
    scale?: number;
    projectionOffset?: number;
  }> = {},
): ReplayComponentRegistry<CountProjection> {
  const reducerVersion = options.reducerVersion ?? '1';
  const config = Object.freeze({ scale: options.scale ?? 1 });
  const bindReplayInputs = (inputs: Readonly<Record<string, JsonValue>>) => {
    const supplied = inputs.fixture_config as Readonly<{ scale?: unknown }>;
    const scale = Number(supplied?.scale);
    if (!Number.isSafeInteger(scale)) throw new Error('Invalid fixture scale');
    return new TypedReducerRegistry<CountProjection>([{
      eventType: FIXTURE_EVENT_TYPE,
      reducerVersion,
      reduce: (state, event) => ({
        count: state.count
          + Number(event.effective.envelope.payload.value) * scale
          + (options.projectionOffset ?? 0),
        labels: [
          ...state.labels,
          String(event.effective.envelope.payload.label),
        ],
      }),
    }]);
  };
  const reducerRegistry = bindReplayInputs({ fixture_config: config });
  return new ReplayComponentRegistry([{
    reducerId: options.reducerId ?? 'fixture-reducer',
    reducerVersion,
    projectionSchemaVersion: options.projectionSchemaVersion ?? '1',
    requiredReplayInputKeys: ['initial_state', 'fixture_config'],
    reducerRegistry,
    replayInputSources: {
      fixture_config: { kind: 'content-addressed', value: config },
    },
    bindReplayInputs,
  }]);
}

function createReplayInput(
  overrides: Readonly<Partial<ReplayExecutionInput<CountProjection>>> = {},
): ReplayExecutionInput<CountProjection> {
  return {
    reducerId: 'fixture-reducer',
    reducerVersion: '1',
    projectionSchemaVersion: '1',
    initialState: INITIAL_STATE,
    replayInputDigests: {
      initial_state: sha256Bytes(canonicalBytes(INITIAL_STATE)),
      fixture_config: sha256Bytes(canonicalBytes({ scale: 1 })),
    },
    ...overrides,
  };
}

async function derive(
  harness: Harness,
  options: Readonly<{
    versionRegistry?: FingerprintVersionRegistry;
    componentRegistry?: ReplayComponentRegistry<CountProjection>;
    replay?: ReplayExecutionInput<CountProjection>;
    runId?: string;
  }> = {},
): Promise<DerivedReplayFingerprint<CountProjection>> {
  return deriveReplayFingerprint({
    ledger: harness.ledger,
    eventRegistry: harness.registry,
    versionRegistry: options.versionRegistry
      ?? createReplayFingerprintVersionRegistry(),
    componentRegistry: options.componentRegistry ?? createComponentRegistry(),
    runId: options.runId ?? RUN_ID,
    rangeStartSequence: 1,
    rangeEndSequence: 3,
    replay: options.replay ?? createReplayInput(),
  });
}

function attestationEnvelope(index: number) {
  return {
    eventId: 'fingerprint-attestation-' + String(index),
    streamId: 'fingerprint-attestations',
    streamSequence: index,
    occurredAt: FIXTURE_TIMESTAMP,
    recordedAt: FIXTURE_TIMESTAMP,
    producer: { name: 'replay-fingerprint-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: 'fingerprint-correlation-' + String(index),
    causationId: null,
    idempotencyKey: 'fingerprint-idempotency-' + String(index),
  };
}

async function deriveAndRecord(
  harness: Harness,
  options: Readonly<{
    derived?: DerivedReplayFingerprint<CountProjection>;
    versionRegistry?: FingerprintVersionRegistry;
    index?: number;
  }> = {},
) {
  const versionRegistry = options.versionRegistry
    ?? createReplayFingerprintVersionRegistry();
  const derived = options.derived ?? await derive(harness, { versionRegistry });
  const index = options.index ?? 1;
  const event = prepareReplayFingerprintAttestation(
    derived,
    harness.registry,
    versionRegistry,
    attestationEnvelope(index),
  );
  const proof = await authorize(
    harness,
    event,
    'fingerprint-attestation-request-' + String(index),
  );
  const write = await recordReplayFingerprintAttestation(
    harness.ledger,
    event,
    proof,
    derived,
    versionRegistry,
  );
  return { derived, event, proof, write, versionRegistry };
}

async function appendRawAttestation(
  harness: Harness,
  derived: DerivedReplayFingerprint<CountProjection>,
  versionRegistry: FingerprintVersionRegistry,
  mutate: (payload: JsonObject) => void,
): Promise<void> {
  const prepared = prepareReplayFingerprintAttestation(
    derived,
    harness.registry,
    versionRegistry,
    attestationEnvelope(1),
  );
  const payload = JSON.parse(JSON.stringify(prepared.envelope.payload)) as JsonObject;
  mutate(payload);
  const event = prepareEventWrite({
    ...prepared.envelope,
    payload,
  }, harness.registry);
  const proof = await authorize(harness, event, 'raw-fingerprint-attestation-request');
  await harness.ledger.appendAuthorized(event, proof);
}

function verificationInput(
  harness: Harness,
  options: Readonly<{
    componentRegistry?: ReplayComponentRegistry<CountProjection>;
    replay?: ReplayExecutionInput<CountProjection>;
    versionRegistry?: FingerprintVersionRegistry;
    fingerprintVersion?: unknown;
    rangeStartSequence?: number;
    rangeEndSequence?: number;
    consumer?: 'shadow-parity' | 'whole-system-replay';
  }> = {},
) {
  return {
    ledger: harness.ledger,
    eventRegistry: harness.registry,
    versionRegistry: options.versionRegistry
      ?? createReplayFingerprintVersionRegistry(),
    componentRegistry: options.componentRegistry ?? createComponentRegistry(),
    consumer: options.consumer ?? 'shadow-parity' as const,
    fingerprintVersion: Object.prototype.hasOwnProperty.call(options, 'fingerprintVersion')
      ? options.fingerprintVersion
      : 1,
    runId: RUN_ID,
    rangeStartSequence: options.rangeStartSequence ?? 1,
    rangeEndSequence: options.rangeEndSequence ?? 3,
    replay: options.replay ?? createReplayInput(),
  };
}

function expectFailure(
  result: ReplayFingerprintVerificationResult<CountProjection>,
  component: string,
): void {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error('Expected fail-closed verification result');
  expect(result.exitCode).toBe(1);
  expect(result.failure.component).toBe(component);
  expect(result).not.toHaveProperty('verified');
  expect(result.failure.expectedDigest === null
    || result.failure.expectedDigest.length <= 96).toBe(true);
  expect(result.failure.actualDigest === null
    || result.failure.actualDigest.length <= 96).toBe(true);
}

function descriptorOverride(
  derived: DerivedReplayFingerprint<CountProjection>,
  overrides: Readonly<Partial<ReplayFingerprintDescriptor>>,
  versionRegistry: FingerprintVersionRegistry,
): DerivedReplayFingerprint<CountProjection> {
  const implementation = versionRegistry.resolve(derived.descriptor.fingerprint_version);
  const {
    final_digest: ignored,
    ...baseCore
  } = derived.descriptor;
  void ignored;
  const core = { ...baseCore, ...overrides };
  delete (core as Partial<ReplayFingerprintDescriptor>).final_digest;
  const commitmentBytes = implementation.serializeDescriptor(core, false);
  const descriptor: ReplayFingerprintDescriptor = Object.freeze({
    ...core,
    final_digest: sha256Bytes(commitmentBytes),
  });
  return Object.freeze({
    descriptor,
    commitmentBytes,
    descriptorBytes: implementation.serializeDescriptor(descriptor, true),
    projection: derived.projection,
  });
}

afterEach(() => {
  while (temporaryRoots.length > 0) {
    const root = temporaryRoots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 5. DETERMINISM AND SUCCESS
// ───────────────────────────────────────────────────────────────────

describe('replay fingerprint determinism and consumer gate', () => {
  it(HOSTILE_LOCALE_FINGERPRINT_TEST_NAME, async () => {
    const childMode = process.env.DEEP_LOOP_HOSTILE_FINGERPRINT_CHILD === '1';
    const originalLocaleCompare = String.prototype.localeCompare;
    if (childMode) {
      String.prototype.localeCompare = function hostileLocaleCompare(
        this: string,
        other: string,
      ): number {
        return this < other ? 1 : this > other ? -1 : 0;
      } as typeof String.prototype.localeCompare;
    }
    try {
      const harness = childMode
        ? createHarness(
          createEventRegistry(),
          String(process.env.DEEP_LOOP_HOSTILE_FINGERPRINT_LEDGER_ROOT),
        )
        : await committedHarness();
      const derived = await derive(harness);
      if (childMode) {
        expect(harness.registry.digest).toBe(
          process.env.DEEP_LOOP_EXPECTED_FINGERPRINT_REGISTRY_DIGEST,
        );
        expect(derived.descriptor).toEqual(
          JSON.parse(Buffer.from(
            String(process.env.DEEP_LOOP_EXPECTED_FINGERPRINT_DESCRIPTOR),
            'base64',
          ).toString('utf8')),
        );
        return;
      }

      const vitestBin = fileURLToPath(new URL(
        '../../../../system-spec-kit/mcp-server/node_modules/.bin/vitest',
        import.meta.url,
      ));
      const child = spawnSync(vitestBin, [
        'run',
        '--no-coverage',
        fileURLToPath(import.meta.url),
        '-t',
        HOSTILE_LOCALE_FINGERPRINT_TEST_NAME,
      ], {
        encoding: 'utf8',
        env: {
          ...process.env,
          LANG: 'tr_TR.UTF-8',
          LC_ALL: 'tr_TR.UTF-8',
          DEEP_LOOP_HOSTILE_FINGERPRINT_CHILD: '1',
          DEEP_LOOP_HOSTILE_FINGERPRINT_LEDGER_ROOT: harness.rootDirectory,
          DEEP_LOOP_EXPECTED_FINGERPRINT_REGISTRY_DIGEST: harness.registry.digest,
          DEEP_LOOP_EXPECTED_FINGERPRINT_DESCRIPTOR: Buffer.from(
            JSON.stringify(derived.descriptor),
            'utf8',
          ).toString('base64'),
        },
      });
      expect(child.status, child.stdout + child.stderr).toBe(0);
    } finally {
      String.prototype.localeCompare = originalLocaleCompare;
    }
  });

  it('emits byte-identical descriptors and final digests across repeated derivations', async () => {
    const harness = await committedHarness();
    const first = await derive(harness);
    const reorderedReplay = createReplayInput({
      replayInputDigests: {
        fixture_config: sha256Bytes(canonicalBytes({ scale: 1 })),
        initial_state: sha256Bytes(canonicalBytes(INITIAL_STATE)),
      },
    });
    const second = await derive(harness, { replay: reorderedReplay });

    expect(Buffer.from(second.descriptorBytes)).toEqual(Buffer.from(first.descriptorBytes));
    expect(Buffer.from(second.commitmentBytes)).toEqual(Buffer.from(first.commitmentBytes));
    expect(second.descriptor).toEqual(first.descriptor);
    expect(second.descriptor.final_digest).toBe(first.descriptor.final_digest);
    expect(first.descriptor.event_count).toBe(3);
    expect(first.descriptor.ordered_record_hashes).toHaveLength(3);
    const implementation = createReplayFingerprintVersionRegistry().resolve(1);
    const changedFinalDigest = {
      ...first.descriptor,
      final_digest: 'f'.repeat(64),
    };
    expect(Buffer.from(
      implementation.serializeDescriptor(changedFinalDigest, false),
    )).toEqual(Buffer.from(first.commitmentBytes));
    expect(Buffer.from(
      implementation.serializeDescriptor(changedFinalDigest, true),
    )).not.toEqual(Buffer.from(first.descriptorBytes));
  });

  it('returns trusted projection only through the same API for both consumers', async () => {
    const harness = await committedHarness();
    await deriveAndRecord(harness);
    const shadow = await verifyReplayFingerprint(verificationInput(harness));
    const wholeSystem = await verifyReplayFingerprint(verificationInput(harness, {
      consumer: 'whole-system-replay',
    }));

    expect(shadow.ok).toBe(true);
    expect(wholeSystem.ok).toBe(true);
    if (!shadow.ok || !wholeSystem.ok) throw new Error('Expected trusted verification');
    expect(shadow.verified.attestationSequence).toBe(4);
    expect(shadow.verified.projection.digest).toBe(
      wholeSystem.verified.projection.digest,
    );
    expect(shadow.verified.projection.state.count).toBe(6);
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. STORED RANGE FAILURES
// ───────────────────────────────────────────────────────────────────

describe('stored range failure matrix', () => {
  it.each(['mutation', 'deletion', 'insertion', 'reorder'] as const)(
    'fails closed on covered-frame %s',
    async (fault) => {
      const base = await committedHarness();
      await deriveAndRecord(base);
      const root = cloneRoot(base.rootDirectory, fault);

      if (fault === 'mutation') {
        const path = framePath(root, 2);
        const frame = JSON.parse(readFileSync(path, 'utf8')) as LedgerRecordFrame;
        writeFileSync(path, JSON.stringify({
          ...frame,
          record_hash: 'f'.repeat(64),
        }) + '\n');
      } else if (fault === 'deletion') {
        unlinkSync(framePath(root, 2));
      } else if (fault === 'insertion') {
        renameSync(framePath(root, 4), framePath(root, 5));
        renameSync(framePath(root, 3), framePath(root, 4));
        renameSync(framePath(root, 2), framePath(root, 3));
        cpSync(framePath(root, 1), framePath(root, 2));
      } else {
        const first = readFileSync(framePath(root, 1));
        const second = readFileSync(framePath(root, 2));
        writeFileSync(framePath(root, 1), second);
        writeFileSync(framePath(root, 2), first);
      }

      const corrupted = createHarness(base.registry, root);
      const result = await verifyReplayFingerprint(verificationInput(corrupted));
      expectFailure(result, 'stored');
    },
  );

  it('surfaces requested range drift without selecting another attestation', async () => {
    const harness = await committedHarness();
    await deriveAndRecord(harness);
    const result = await verifyReplayFingerprint(verificationInput(harness, {
      rangeEndSequence: 2,
    }));
    expectFailure(result, 'range');
  });
});

// ───────────────────────────────────────────────────────────────────
// 7. CONTRACT AND RESULT DRIFT
// ───────────────────────────────────────────────────────────────────

describe('replay contract and result drift', () => {
  it('surfaces envelope registry drift independently of upcasters', async () => {
    const harness = await committedHarness();
    await deriveAndRecord(harness);
    const drifted = reopenHarness(harness, createEventRegistry({ validator: 'drift' }));
    const result = await verifyReplayFingerprint(verificationInput(drifted));
    expectFailure(result, 'envelope_registry');
  });

  it('surfaces upcaster registry drift before the aggregate envelope digest', async () => {
    const harness = await committedHarness({ upcaster: 'a' });
    await deriveAndRecord(harness);
    const drifted = reopenHarness(harness, createEventRegistry({ upcaster: 'b' }));
    const result = await verifyReplayFingerprint(verificationInput(drifted));
    expectFailure(result, 'upcaster_registry');
  });

  it('surfaces reducer identity drift', async () => {
    const harness = await committedHarness();
    await deriveAndRecord(harness);
    const components = createComponentRegistry({
      reducerId: 'fixture-reducer-v2',
      reducerVersion: '2',
    });
    const replay = createReplayInput({
      reducerId: 'fixture-reducer-v2',
      reducerVersion: '2',
    });
    const result = await verifyReplayFingerprint(verificationInput(harness, {
      componentRegistry: components,
      replay,
    }));
    expectFailure(result, 'reducer');
  });

  it('surfaces projection schema drift', async () => {
    const harness = await committedHarness();
    await deriveAndRecord(harness);
    const components = createComponentRegistry({ projectionSchemaVersion: '2' });
    const replay = createReplayInput({ projectionSchemaVersion: '2' });
    const result = await verifyReplayFingerprint(verificationInput(harness, {
      componentRegistry: components,
      replay,
    }));
    expectFailure(result, 'projection_schema');
  });

  it('rejects a claimed config digest that differs from the content supplied to reducers', async () => {
    const harness = await committedHarness();
    const components = createComponentRegistry({ scale: 2 });
    const claimed = sha256Bytes(canonicalBytes({ scale: 1 }));
    const resolved = sha256Bytes(canonicalBytes({ scale: 2 }));

    await expect(derive(harness, {
      componentRegistry: components,
    })).rejects.toMatchObject({
      code: ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
      component: 'replay_input',
      expectedDigest: resolved,
      actualDigest: claimed,
      stage: 'replay-input-provenance-fixture_config',
    });
  });

  it('surfaces projection byte drift under the same registered identities and inputs', async () => {
    const harness = await committedHarness();
    await deriveAndRecord(harness);
    const components = createComponentRegistry({ projectionOffset: 1 });
    const result = await verifyReplayFingerprint(verificationInput(harness, {
      componentRegistry: components,
    }));
    expectFailure(result, 'projection');
  });

  it('surfaces an effective-event digest mismatch from an authorized false claim', async () => {
    const harness = await committedHarness();
    const versionRegistry = createReplayFingerprintVersionRegistry();
    const derived = await derive(harness, { versionRegistry });
    const falseClaim = descriptorOverride(derived, {
      effective_event_digest: sha256Bytes(canonicalBytes('different-effective-events')),
    }, versionRegistry);
    const event = prepareReplayFingerprintAttestation(
      falseClaim,
      harness.registry,
      versionRegistry,
      attestationEnvelope(1),
    );
    const proof = await authorize(harness, event, 'authorized-false-effective-claim');
    await harness.ledger.appendAuthorized(event, proof);

    const result = await verifyReplayFingerprint(verificationInput(harness));
    expectFailure(result, 'effective');
  });

  it('rejects missing ledger-addressed replay inputs before projection trust', async () => {
    const harness = await committedHarness();
    await deriveAndRecord(harness);
    const replay = createReplayInput({
      replayInputDigests: {
        initial_state: sha256Bytes(canonicalBytes(INITIAL_STATE)),
      },
    });
    const result = await verifyReplayFingerprint(verificationInput(harness, { replay }));
    expectFailure(result, 'replay_input');
  });

  it('rejects a reducer that produces different bytes on repeated reduction', async () => {
    const harness = await committedHarness();
    await deriveAndRecord(harness);
    let invocation = 0;
    const reducerRegistry = new TypedReducerRegistry<CountProjection>([{
      eventType: FIXTURE_EVENT_TYPE,
      reducerVersion: '1',
      reduce: (state, event) => {
        invocation += 1;
        return {
          count: state.count
            + Number(event.effective.envelope.payload.value)
            + invocation,
          labels: [...state.labels],
        };
      },
    }]);
    const components = new ReplayComponentRegistry<CountProjection>([{
      reducerId: 'fixture-reducer',
      reducerVersion: '1',
      projectionSchemaVersion: '1',
      requiredReplayInputKeys: ['initial_state', 'fixture_config'],
      reducerRegistry,
      replayInputSources: {
        fixture_config: {
          kind: 'content-addressed',
          value: { scale: 1 },
        },
      },
      bindReplayInputs: () => reducerRegistry,
    }]);
    const result = await verifyReplayFingerprint(verificationInput(harness, {
      componentRegistry: components,
    }));
    expectFailure(result, 'reducer');
  });
});

describe('fingerprint field mutation ownership', () => {
  it.each([
    ['authorization linkage', 'authorization_linkage'],
    ['observed versions', 'observed_event_versions'],
    ['chain identities', 'upcaster_chain'],
    ['replay input', 'replay_input'],
    ['canonicalization', 'canonicalization'],
    ['final commitment', 'final_digest'],
  ] as const)('surfaces %s mutation in %s', async (mutation, component) => {
    const harness = await committedHarness();
    const versionRegistry = createReplayFingerprintVersionRegistry();
    const derived = await derive(harness, { versionRegistry });

    if (mutation === 'canonicalization' || mutation === 'final commitment') {
      await appendRawAttestation(harness, derived, versionRegistry, (payload) => {
        const descriptor = payload.descriptor as JsonObject;
        if (mutation === 'canonicalization') {
          descriptor.canonicalization_algorithm =
            String(descriptor.canonicalization_algorithm) + '-mutated';
        } else {
          descriptor.final_digest = sha256Bytes(canonicalBytes('mutated-final-commitment'));
        }
      });
    } else {
      let overrides: Readonly<Partial<ReplayFingerprintDescriptor>>;
      if (mutation === 'authorization linkage') {
        overrides = {
          authorization_linkage_digest: sha256Bytes(canonicalBytes('mutated-authorization')),
        };
      } else if (mutation === 'observed versions') {
        overrides = {
          observed_event_type_versions: ['deep-loop.fixture.mutated@1'],
        };
      } else if (mutation === 'chain identities') {
        overrides = {
          ordered_chain_identities: ['sequence=1|event=mutated@1|chain=mutated|hop=none'],
        };
      } else {
        overrides = {
          replay_input_digests: {
            ...derived.descriptor.replay_input_digests,
            fixture_config: sha256Bytes(canonicalBytes({ scale: 9 })),
          },
        };
      }
      const falseClaim = descriptorOverride(derived, overrides, versionRegistry);
      await deriveAndRecord(harness, { derived: falseClaim, versionRegistry });
    }

    const result = await verifyReplayFingerprint(verificationInput(harness, {
      versionRegistry,
    }));
    expectFailure(result, component);
  });
});

// ───────────────────────────────────────────────────────────────────
// 8. VERSION AND ATTESTATION RULES
// ───────────────────────────────────────────────────────────────────

describe('fingerprint version and attestation rules', () => {
  it.each([
    ['descriptor bytes', 'attestation', 'descriptor-bytes-binding'],
    ['metadata', 'attestation', 'attestation-metadata-binding'],
    ['digest', 'final_digest', 'attestation-digest-binding'],
  ] as const)('reports an accurate %s binding mismatch', async (
    mismatchKind,
    component,
    stage,
  ) => {
    const harness = await committedHarness();
    const versionRegistry = createReplayFingerprintVersionRegistry();
    const implementation = versionRegistry.resolve(1);
    const derived = await derive(harness, { versionRegistry });
    const event = prepareReplayFingerprintAttestation(
      derived,
      harness.registry,
      versionRegistry,
      attestationEnvelope(1),
    );
    const payload = JSON.parse(JSON.stringify(event.envelope.payload)) as JsonObject;
    if (mismatchKind === 'descriptor bytes') {
      const bytes = Buffer.from(String(payload.descriptor_bytes_base64), 'base64');
      bytes[bytes.length - 1] ^= 0x01;
      payload.descriptor_bytes_base64 = bytes.toString('base64');
    } else if (mismatchKind === 'metadata') {
      payload.run_id = String(payload.run_id) + '-mutated';
    } else {
      payload.final_digest = sha256Bytes(canonicalBytes('mutated-attestation-digest'));
    }

    let caught: unknown;
    try {
      parseReplayFingerprintAttestationPayload(payload, implementation);
    } catch (error: unknown) {
      caught = error;
    }
    expect(caught).toMatchObject({ component, stage });
    const diagnostic = caught as {
      expectedDigest: string | null;
      actualDigest: string | null;
    };
    expect(diagnostic.expectedDigest).not.toBeNull();
    expect(diagnostic.actualDigest).not.toBeNull();
    expect(diagnostic.expectedDigest).not.toBe(diagnostic.actualDigest);
  });

  it('fails closed when the required attestation is missing', async () => {
    const harness = await committedHarness();
    const result = await verifyReplayFingerprint(verificationInput(harness));
    expectFailure(result, 'attestation');
  });

  it.each([
    ['unknown future', 99],
    ['missing', undefined],
  ] as const)('rejects %s fingerprint_version without envelope-version inference', async (
    _label,
    fingerprintVersion,
  ) => {
    const harness = await committedHarness();
    const result = await verifyReplayFingerprint(verificationInput(harness, {
      fingerprintVersion,
    }));
    expectFailure(result, 'fingerprint_version');
  });

  it('rejects an attestation payload that omits fingerprint_version', async () => {
    const base = await committedHarness();
    const lax = reopenHarness(
      base,
      createEventRegistry({ attestation: 'missing-version' }),
    );
    const versionRegistry = createReplayFingerprintVersionRegistry();
    const derived = await derive(lax, { versionRegistry });
    const payload = {
      ledger_id: derived.descriptor.ledger_id,
      run_id: derived.descriptor.run_id,
      range_start_sequence: derived.descriptor.range_start_sequence,
      range_end_sequence: derived.descriptor.range_end_sequence,
      descriptor: derived.descriptor as unknown as JsonObject,
      descriptor_bytes_base64: Buffer.from(derived.descriptorBytes).toString('base64'),
      final_digest: derived.descriptor.final_digest,
    };
    const event = prepareEventWrite({
      envelope_version: CURRENT_ENVELOPE_VERSION,
      event_id: 'missing-fingerprint-version',
      event_type: REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE,
      event_version: 1,
      stream_id: 'fingerprint-attestations',
      stream_sequence: 1,
      occurred_at: FIXTURE_TIMESTAMP,
      recorded_at: FIXTURE_TIMESTAMP,
      producer: { name: 'replay-fingerprint-tests', version: '1' },
      authority_epoch: 1,
      correlation_id: 'missing-fingerprint-version',
      causation_id: null,
      idempotency_key: 'missing-fingerprint-version',
      payload,
    }, lax.registry);
    const proof = await authorize(lax, event, 'missing-fingerprint-version-request');
    await lax.ledger.appendAuthorized(event, proof);

    const result = await verifyReplayFingerprint(verificationInput(lax));
    expectFailure(result, 'fingerprint_version');
  });

  it('retains historical verification while current writers emit the latest version', async () => {
    const harness = await committedHarness();
    await deriveAndRecord(harness);
    const versionOne = createReplayFingerprintVersionRegistry().resolve(1);
    const expanded = new FingerprintVersionRegistry([
      versionOne,
      {
        fingerprintVersion: 2,
        hashAlgorithm: FINGERPRINT_HASH_ALGORITHM,
        canonicalizationAlgorithm: FINGERPRINT_CANONICALIZATION_ALGORITHM + '-v2',
        serializeDescriptor: serializeReplayFingerprintDescriptor,
      },
    ]);
    const historical = await verifyReplayFingerprint(verificationInput(harness, {
      versionRegistry: expanded,
      fingerprintVersion: 1,
    }));
    const current = await derive(harness, { versionRegistry: expanded });

    expect(historical.ok).toBe(true);
    expect(current.descriptor.fingerprint_version).toBe(2);
  });

  it('rejects a fingerprint serializer that omits committed fields', () => {
    const registered = createReplayFingerprintVersionRegistry().resolve(1) as unknown as {
      implementationIdentity: string;
    };
    expect(registered.implementationIdentity).toMatch(/^[a-f0-9]{64}$/);
    expect(() => new FingerprintVersionRegistry([{
      fingerprintVersion: 1,
      hashAlgorithm: FINGERPRINT_HASH_ALGORITHM,
      canonicalizationAlgorithm: FINGERPRINT_CANONICALIZATION_ALGORITHM,
      serializeDescriptor: () => Uint8Array.from([1]),
    }])).toThrowError(expect.objectContaining({
      code: ReplayFingerprintErrorCodes.INVALID_INPUT,
      component: 'fingerprint_version',
      stage: 'fingerprint-registry-probe',
    }));
  });

  it('rejects non-initial replay inputs without a registered source and binding', () => {
    const reducerRegistry = new TypedReducerRegistry<CountProjection>([{
      eventType: FIXTURE_EVENT_TYPE,
      reducerVersion: '1',
      reduce: (state) => ({ ...state }),
    }]);
    expect(() => new ReplayComponentRegistry([{
      reducerId: 'fixture-reducer',
      reducerVersion: '1',
      projectionSchemaVersion: '1',
      requiredReplayInputKeys: ['initial_state', 'fixture_config'],
      reducerRegistry,
    }])).toThrowError(expect.objectContaining({
      code: ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
      component: 'replay_input',
      stage: 'replay-input-provenance',
    }));
  });

  it('appends after the range, excludes itself, and makes exact duplicates idempotent', async () => {
    const harness = await committedHarness();
    const recorded = await deriveAndRecord(harness);
    const retry = await recordReplayFingerprintAttestation(
      harness.ledger,
      recorded.event,
      recorded.proof,
      recorded.derived,
      recorded.versionRegistry,
    );

    expect(recorded.write.status).toBe('appended');
    expect(recorded.write.receipt.sequence).toBe(4);
    expect(retry.status).toBe('idempotent');
    expect(retry.receipt).toEqual(recorded.write.receipt);
    expect((await harness.ledger.getVerifiedHead()).sequence).toBe(4);
    expect(recorded.derived.descriptor.range_end_sequence).toBe(3);
    expect(recorded.derived.descriptor.ordered_record_hashes).toHaveLength(3);
    expect(recorded.derived.descriptor.ordered_record_hashes).not.toContain(
      recorded.write.receipt.recordHash,
    );
  });

  it('rejects conflicting attestations for one run, range, and version', async () => {
    const harness = await committedHarness();
    const recorded = await deriveAndRecord(harness);
    const conflicting = await derive(harness, {
      componentRegistry: createComponentRegistry({ projectionOffset: 1 }),
    });
    const event = prepareReplayFingerprintAttestation(
      conflicting,
      harness.registry,
      recorded.versionRegistry,
      attestationEnvelope(2),
    );
    const proof = await authorize(harness, event, 'conflicting-attestation-request');

    await expect(recordReplayFingerprintAttestation(
      harness.ledger,
      event,
      proof,
      conflicting,
      recorded.versionRegistry,
    )).rejects.toMatchObject({
      code: ReplayFingerprintErrorCodes.ATTESTATION_CONFLICT,
      component: 'attestation',
    });
    expect((await harness.ledger.getVerifiedHead()).sequence).toBe(4);
  });

  it('rejects host-derived replay input names', () => {
    const reducerRegistry = new TypedReducerRegistry<CountProjection>([{
      eventType: FIXTURE_EVENT_TYPE,
      reducerVersion: '1',
      reduce: (state) => ({ ...state }),
    }]);
    expect(() => new ReplayComponentRegistry([{
      reducerId: 'fixture-reducer',
      reducerVersion: '1',
      projectionSchemaVersion: '1',
      requiredReplayInputKeys: ['initial_state', 'host_path'],
      reducerRegistry,
    }])).toThrowError(expect.objectContaining({
      code: ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
      component: 'replay_input',
    }));
  });
});

// ───────────────────────────────────────────────────────────────────
// 9. NON-REBASELINING
// ───────────────────────────────────────────────────────────────────

describe('non-rebaselining verification', () => {
  it('leaves legacy authority unchanged when dark fingerprint verification fails', async () => {
    const harness = await committedHarness();
    await deriveAndRecord(harness);
    const legacyAuthority = Object.freeze({
      authority: 'legacy',
      result: 'committed',
      state: { completedTransitions: 3 },
    });
    const legacyBytesBefore = Buffer.from(canonicalBytes(legacyAuthority));
    const headBefore = await harness.ledger.getVerifiedHead();

    const result = await verifyReplayFingerprint(verificationInput(harness, {
      componentRegistry: createComponentRegistry({ projectionOffset: 1 }),
    }));

    expectFailure(result, 'projection');
    expect(Buffer.from(canonicalBytes(legacyAuthority))).toEqual(legacyBytesBefore);
    expect(await harness.ledger.getVerifiedHead()).toEqual(headBefore);
  });

  it('never rewrites or promotes a mismatched actual digest', async () => {
    const harness = await committedHarness();
    await deriveAndRecord(harness);
    const attestationPath = framePath(harness.rootDirectory, 4);
    const beforeBytes = readFileSync(attestationPath);
    const beforeHead = await harness.ledger.getVerifiedHead();
    const components = createComponentRegistry({ projectionOffset: 1 });

    const first = await verifyReplayFingerprint(verificationInput(harness, {
      componentRegistry: components,
    }));
    const second = await verifyReplayFingerprint(verificationInput(harness, {
      componentRegistry: components,
    }));

    expectFailure(first, 'projection');
    expectFailure(second, 'projection');
    if (first.ok || second.ok) throw new Error('Expected repeated mismatch');
    expect(first.failure.expectedDigest).toBe(second.failure.expectedDigest);
    expect(first.failure.actualDigest).toBe(second.failure.actualDigest);
    expect(readFileSync(attestationPath)).toEqual(beforeBytes);
    expect(await harness.ledger.getVerifiedHead()).toEqual(beforeHead);
  });
});
