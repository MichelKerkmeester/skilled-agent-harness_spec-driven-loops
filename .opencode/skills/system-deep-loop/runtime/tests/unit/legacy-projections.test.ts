// ───────────────────────────────────────────────────────────────────
// TEST: Legacy Projections
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  cpSync,
  existsSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TypedReducerRegistry,
} from '../../lib/authorized-ledger/index.js';
import { computeIntegrityHash } from '../../lib/deep-loop/atomic-state.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  LEGACY_PROJECTION_MANIFEST,
  LEGACY_PROJECTION_MANIFEST_DIGEST,
  LegacyProjectionEngine,
  LegacyProjectionErrorCodes,
  legacyProjectionDigest,
  serializeLegacyJson,
  serializeLegacyJsonl,
  validateLegacyProjectionManifest,
} from '../../lib/legacy-projections/index.js';
import {
  INITIAL_STATE_REPLAY_INPUT,
  ReplayComponentRegistry,
  createReplayFingerprintVersionRegistry,
  deriveReplayFingerprint,
} from '../../lib/replay-fingerprint/index.js';
import {
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_EVENT_TYPE,
  FIXTURE_LEDGER_ID,
  FIXTURE_TIMESTAMP,
  createFixtureEvent,
  createFixtureEventRegistry,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from '../fixtures/authorized-ledger-fixtures.js';

import type {
  GatewayAllowProof,
  LedgerHead,
  LedgerRecordFrame,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../../lib/event-envelope/index.js';
import type {
  LegacyProjectionContract,
  LegacyProjectionEngineOptions,
  LegacyProjectionObservation,
} from '../../lib/legacy-projections/index.js';
import type { DerivedReplayFingerprint } from '../../lib/replay-fingerprint/index.js';
import type { TransitionPolicyRegistry } from '../../lib/authorized-ledger/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE TYPES AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

interface Harness {
  readonly rootDirectory: string;
  readonly registry: EventTypeRegistry;
  readonly policies: TransitionPolicyRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
}

interface JsonlProjectionState extends JsonObject {
  rows: JsonObject[];
  lastValue: number | null;
}

interface SnapshotProjectionState extends JsonObject {
  status: string;
  count: number;
  labels: string[];
}

interface TestEnvironment {
  readonly root: string;
  readonly legacyRoot: string;
  readonly legacyPath: string;
  readonly shadowRoot: string;
}

interface StateCensus {
  readonly rows: readonly {
    readonly id: string;
    readonly surface: string;
    readonly resolvedPath: string;
    readonly owner: string;
    readonly archivalReader: string;
    readonly fixture: string;
  }[];
}

interface EventStreamCensusFixture {
  readonly baseSha: string;
  readonly streams: Readonly<Record<string, {
    readonly schemaSha256: string;
    readonly writerSourceSha256: string;
    readonly rows: readonly JsonValue[];
  }>>;
}

const BASE_SHA = 'fe6ca3030917073f3b478bc044e10034dcc4394b';
const GENESIS_HASH = '0'.repeat(64);
const FILE_MODE = 0o600;
const CENSUS_ROOT = resolve(
  import.meta.dirname,
  '../../../../../specs/system-deep-loop/036-deep-loop-innovation',
  '003-baseline-taxonomy-and-state-census',
);
const temporaryRoots: string[] = [];

// ───────────────────────────────────────────────────────────────────
// 2. FIXTURE HELPERS
// ───────────────────────────────────────────────────────────────────

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `legacy-projections-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function createHarness(rootDirectory = temporaryRoot('ledger')): Harness {
  const registry = createFixtureEventRegistry();
  const policies = createFixturePolicyRegistry();
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
  }, ledger, policies);
  return { rootDirectory, registry, policies, ledger, gateway };
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
  if (result.verdict !== 'allow') throw new Error(`Expected allow, received ${result.reasonCode}`);
  return result.proof;
}

async function appendFixture(
  harness: Harness,
  index: number,
  payload?: Readonly<{ label: string; value: number }>,
): Promise<void> {
  const event = createFixtureEvent(
    harness.registry,
    index,
    payload === undefined ? {} : { payload },
  );
  const proof = await authorize(harness, event, `projection-request-${index}`);
  await harness.ledger.appendAuthorized(event, proof);
}

function environment(label: string): TestEnvironment {
  const root = temporaryRoot(label);
  const legacyRoot = join(root, 'legacy');
  const legacyPath = join(legacyRoot, 'authoritative.jsonl');
  const shadowRoot = join(root, 'shadow');
  mkdirSync(legacyRoot, { recursive: true });
  writeFileSync(legacyPath, 'legacy-authoritative\n', { mode: FILE_MODE });
  return { root, legacyRoot, legacyPath, shadowRoot };
}

function baseHead(): LedgerHead {
  return Object.freeze({
    ledgerId: FIXTURE_LEDGER_ID,
    sequence: 0,
    recordHash: GENESIS_HASH,
  });
}

function jsonlContract(
  relativePath = 'research/deep-research-state.jsonl',
): LegacyProjectionContract<JsonlProjectionState> {
  const baseBytes = serializeLegacyJsonl([]);
  return {
    artifactId: 'research-state',
    censusSurfaceId: 'research-state',
    ledgerId: FIXTURE_LEDGER_ID,
    streamIds: ['fixture-stream'],
    relativePath,
    format: 'jsonl',
    refreshBoundary: 'event',
    foldId: 'legacy-research-state-fold@1',
    reducerId: 'legacy-research-state-reducer',
    projectionVersion: 'legacy-research-state@1',
    reducerVersion: 'research-state-reducer@1',
    serializerId: 'legacy-jsonl-row-v1',
    legacyWriter: 'deep-research',
    readers: ['deep-research reducer'],
    base: {
      baseSha: BASE_SHA,
      baseDigest: legacyProjectionDigest(baseBytes),
      bytes: baseBytes,
      state: { rows: [], lastValue: null },
      ledgerHead: baseHead(),
    },
    acceptedEventVersions: { [FIXTURE_EVENT_TYPE]: [1] },
    reduce(state, event): JsonlProjectionState {
      const payload = event.effective.envelope.payload;
      if (typeof payload.value !== 'number' || typeof payload.label !== 'string') {
        throw new TypeError('Fixture payload does not match the legacy row contract');
      }
      if (state.lastValue === payload.value) {
        return { rows: [...state.rows], lastValue: state.lastValue };
      }
      return {
        rows: [...state.rows, {
          type: 'iteration',
          run: payload.value,
          status: 'complete',
          focus: payload.label,
          findingsCount: 1,
          newInfoRatio: 1,
          timestamp: event.effective.envelope.occurred_at,
        }],
        lastValue: payload.value,
      };
    },
    serialize(state): Uint8Array {
      return serializeLegacyJsonl(state.rows);
    },
  };
}

function snapshotDocument(state: SnapshotProjectionState): JsonObject {
  const payload: JsonObject = {
    status: state.status,
    count: state.count,
    labels: [...state.labels],
  };
  return { ...payload, _integrity: computeIntegrityHash(payload) };
}

function snapshotContract(): LegacyProjectionContract<SnapshotProjectionState> {
  const baseState: SnapshotProjectionState = { status: 'idle', count: 0, labels: [] };
  const baseBytes = serializeLegacyJson(snapshotDocument(baseState));
  return {
    artifactId: 'fanout-checkpoint',
    censusSurfaceId: 'fanout-checkpoints',
    ledgerId: FIXTURE_LEDGER_ID,
    streamIds: ['fixture-stream'],
    relativePath: 'fanout/orchestration-summary.json',
    format: 'json',
    refreshBoundary: 'lifecycle',
    foldId: 'legacy-fanout-checkpoints-fold@1',
    reducerId: 'legacy-fanout-checkpoint-reducer',
    projectionVersion: 'legacy-fanout-checkpoint@1',
    reducerVersion: 'fanout-checkpoint-reducer@1',
    serializerId: 'legacy-pretty-json-v1',
    legacyWriter: 'fanout run and pool',
    readers: ['fanout resume and operator'],
    base: {
      baseSha: BASE_SHA,
      baseDigest: legacyProjectionDigest(baseBytes),
      bytes: baseBytes,
      state: baseState,
      ledgerHead: baseHead(),
    },
    acceptedEventVersions: { [FIXTURE_EVENT_TYPE]: [1] },
    reduce(state, event): SnapshotProjectionState {
      const payload = event.effective.envelope.payload;
      if (typeof payload.label !== 'string') throw new TypeError('Fixture label is required');
      return {
        status: 'complete',
        count: state.count + 1,
        labels: [...state.labels, payload.label],
      };
    },
    serialize(state): Uint8Array {
      return serializeLegacyJson(snapshotDocument(state));
    },
  };
}

function expectedRows(values: readonly { readonly label: string; readonly value: number }[]): Uint8Array {
  return serializeLegacyJsonl(values.map(({ label, value }) => ({
    type: 'iteration',
    run: value,
    status: 'complete',
    focus: label,
    findingsCount: 1,
    newInfoRatio: 1,
    timestamp: FIXTURE_TIMESTAMP,
  })));
}

async function replayFingerprint<TState extends JsonObject>(
  harness: Harness,
  contract: LegacyProjectionContract<TState>,
): Promise<DerivedReplayFingerprint<TState>> {
  const head = await harness.ledger.getVerifiedHead();
  const reducers = new TypedReducerRegistry<TState>([{
    eventType: FIXTURE_EVENT_TYPE,
    reducerVersion: contract.reducerVersion,
    reduce: (state, event) => contract.reduce(state, event),
  }]);
  const components = new ReplayComponentRegistry<TState>([{
    reducerId: contract.reducerId,
    reducerVersion: contract.reducerVersion,
    projectionSchemaVersion: contract.projectionVersion,
    requiredReplayInputKeys: [INITIAL_STATE_REPLAY_INPUT],
    reducerRegistry: reducers,
  }]);
  return deriveReplayFingerprint({
    ledger: harness.ledger,
    eventRegistry: harness.registry,
    versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry: components,
    runId: `legacy-projection-${contract.artifactId}`,
    rangeStartSequence: contract.base.ledgerHead.sequence + 1,
    rangeEndSequence: head.sequence,
    replay: {
      reducerId: contract.reducerId,
      reducerVersion: contract.reducerVersion,
      projectionSchemaVersion: contract.projectionVersion,
      initialState: contract.base.state,
      replayInputDigests: {
        [INITIAL_STATE_REPLAY_INPUT]: sha256Bytes(canonicalBytes(contract.base.state)),
      },
    },
  });
}

async function projectJsonl(
  engine: LegacyProjectionEngine,
  harness: Harness,
  expectedLegacyBytes: Uint8Array,
  contract = jsonlContract(),
  fingerprintContract = contract,
) {
  return engine.project({
    contract,
    ledger: harness.ledger,
    replayFingerprint: await replayFingerprint(harness, fingerprintContract),
    expectedLegacyBytes,
  });
}

function engine(
  testEnvironment: TestEnvironment,
  overrides: Partial<LegacyProjectionEngineOptions> = {},
): LegacyProjectionEngine {
  return new LegacyProjectionEngine({
    shadowRoot: testEnvironment.shadowRoot,
    protectedLegacyPaths: [testEnvironment.legacyRoot],
    now: () => new Date('2026-07-21T12:00:00.000Z'),
    ...overrides,
  });
}

function cloneLedger(source: string, label: string): string {
  const destination = temporaryRoot(label);
  rmSync(destination, { recursive: true, force: true });
  cpSync(source, destination, { recursive: true, preserveTimestamps: true });
  return destination;
}

function framePath(rootDirectory: string, sequence: number): string {
  return join(
    rootDirectory,
    FIXTURE_LEDGER_ID,
    'frames',
    `${String(sequence).padStart(16, '0')}.frame`,
  );
}

afterEach(() => {
  while (temporaryRoots.length > 0) {
    const root = temporaryRoots.pop();
    if (root !== undefined) rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 3. CENSUS AND BYTE CONTRACTS
// ───────────────────────────────────────────────────────────────────

describe('legacy projection census and byte contracts', () => {
  it('closes every JSON-bearing state census row with one owned disposition', () => {
    const censusPath = join(CENSUS_ROOT, 'state-backend-census.json');
    const census = JSON.parse(readFileSync(censusPath, 'utf8')) as StateCensus;
    const censusIds = census.rows
      .filter((row) => row.surface.toLowerCase().includes('json'))
      .map((row) => row.id)
      .sort();
    const manifestIds = LEGACY_PROJECTION_MANIFEST.map((row) => row.surfaceId).sort();
    const censusRows = new Map(census.rows.map((row) => [row.id, row]));

    expect(censusIds).toEqual(manifestIds);
    expect(LEGACY_PROJECTION_MANIFEST).toHaveLength(28);
    expect(LEGACY_PROJECTION_MANIFEST.filter((row) => row.disposition === 'project')).toHaveLength(22);
    expect(LEGACY_PROJECTION_MANIFEST.filter((row) => row.disposition === 'retain-legacy-input'))
      .toHaveLength(6);
    expect(LEGACY_PROJECTION_MANIFEST_DIGEST).toMatch(/^[a-f0-9]{64}$/u);
    for (const entry of LEGACY_PROJECTION_MANIFEST) {
      const censusRow = censusRows.get(entry.surfaceId);
      expect(censusRow?.resolvedPath).toBe(entry.pathTemplate);
      expect(censusRow?.owner).toBe(entry.legacyWriter);
      expect(censusRow?.archivalReader).toBe(entry.readers.join('; '));
      expect(censusRow?.fixture).toBe(entry.fixture);
      expect(entry.orderingSemantics).not.toBe('');
      expect(entry.publicationSemantics).not.toBe('');
      expect(entry.repairSemantics).not.toBe('');
      expect(entry.archivalObligation).not.toBe('');
    }
    expect(() => validateLegacyProjectionManifest(LEGACY_PROJECTION_MANIFEST)).not.toThrow();
    expect(() => validateLegacyProjectionManifest([])).toThrowError(
      expect.objectContaining({ code: LegacyProjectionErrorCodes.MANIFEST_INVALID }),
    );
  });

  it('preserves all 22 frozen event-stream row shapes and insertion order', () => {
    const fixture = JSON.parse(readFileSync(
      join(CENSUS_ROOT, 'fixtures/event-streams.json'),
      'utf8',
    )) as EventStreamCensusFixture;
    const streams = Object.values(fixture.streams);

    expect(fixture.baseSha).toBe(BASE_SHA);
    expect(streams).toHaveLength(22);
    for (const stream of streams) {
      const expectedText = stream.rows.length === 0
        ? ''
        : `${stream.rows.map((row) => JSON.stringify(row)).join('\n')}\n`;
      expect(Buffer.from(serializeLegacyJsonl(stream.rows)).toString('utf8')).toBe(expectedText);
      expect(stream.schemaSha256).toMatch(/^[a-f0-9]{64}$/u);
      expect(stream.writerSourceSha256).toMatch(/^[a-f0-9]{64}$/u);
    }
  });

  it('renders insertion-ordered JSONL bytes while leaving the legacy file untouched', async () => {
    const testEnvironment = environment('jsonl-bytes');
    const harness = createHarness();
    await appendFixture(harness, 1);
    await appendFixture(harness, 2);
    const expected = expectedRows([
      { label: 'event-1', value: 1 },
      { label: 'event-2', value: 2 },
    ]);
    const observations: LegacyProjectionObservation[] = [];
    const result = await projectJsonl(
      engine(testEnvironment, { observe: (event) => observations.push(event) }),
      harness,
      expected,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) throw result.error;
    expect(readFileSync(result.receipt.outputPath)).toEqual(Buffer.from(expected));
    expect(readFileSync(testEnvironment.legacyPath, 'utf8')).toBe('legacy-authoritative\n');
    expect(result.receipt).toMatchObject({
      publication: 'replaced',
      expectedDigest: legacyProjectionDigest(expected),
      projectedDigest: legacyProjectionDigest(expected),
    });
    expect(result.receipt.expectedBytes).toEqual(Array.from(expected));
    expect(result.receipt.projectedBytes).toEqual(Array.from(expected));
    expect(observations).toMatchObject([{ status: 'published', code: null }]);
  });

  it('renders snapshot indentation, insertion order, newline, and integrity stamp exactly', async () => {
    const testEnvironment = environment('snapshot-bytes');
    const harness = createHarness();
    await appendFixture(harness, 1);
    await appendFixture(harness, 2);
    const contract = snapshotContract();
    const expectedState: SnapshotProjectionState = {
      status: 'complete',
      count: 2,
      labels: ['event-1', 'event-2'],
    };
    const expected = serializeLegacyJson(snapshotDocument(expectedState));
    const result = await engine(testEnvironment).project({
      contract,
      ledger: harness.ledger,
      replayFingerprint: await replayFingerprint(harness, contract),
      expectedLegacyBytes: expected,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw result.error;
    const output = readFileSync(result.receipt.outputPath, 'utf8');
    expect(output).toBe(Buffer.from(expected).toString('utf8'));
    expect(output.startsWith('{\n  "status": "complete",\n  "count": 2,\n  "labels": [')).toBe(true);
    expect(output.endsWith('\n')).toBe(true);
    expect(readFileSync(testEnvironment.legacyPath, 'utf8')).toBe('legacy-authoritative\n');
    const repeated = await engine(testEnvironment).project({
      contract,
      ledger: harness.ledger,
      replayFingerprint: await replayFingerprint(harness, contract),
      expectedLegacyBytes: expected,
    });
    expect(repeated.ok && repeated.receipt.publication).toBe('unchanged');
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. INCREMENTAL, RESTART, AND CRASH RECOVERY
// ───────────────────────────────────────────────────────────────────

describe('legacy projection progress and recovery', () => {
  it('appends incrementally, suppresses unchanged rows, and is restart-idempotent', async () => {
    const testEnvironment = environment('incremental');
    const harness = createHarness();
    const firstEngine = engine(testEnvironment);
    await appendFixture(harness, 1);
    const firstExpected = expectedRows([{ label: 'event-1', value: 1 }]);
    const first = await projectJsonl(firstEngine, harness, firstExpected);
    expect(first.ok && first.receipt.publication).toBe('replaced');

    await appendFixture(harness, 2);
    const secondExpected = expectedRows([
      { label: 'event-1', value: 1 },
      { label: 'event-2', value: 2 },
    ]);
    const second = await projectJsonl(firstEngine, harness, secondExpected);
    expect(second.ok && second.receipt.publication).toBe('appended');
    if (!second.ok) throw second.error;
    expect(JSON.parse(readFileSync(second.receipt.watermarkPath, 'utf8'))).toMatchObject({
      ledger_sequence: 2,
      prior_ledger_sequence: 1,
      prior_output_digest: legacyProjectionDigest(firstExpected),
    });

    await appendFixture(harness, 3, { label: 'duplicate-state', value: 2 });
    const suppressed = await projectJsonl(firstEngine, harness, secondExpected);
    expect(suppressed.ok && suppressed.receipt.publication).toBe('recovered');
    const restarted = await projectJsonl(engine(testEnvironment), harness, secondExpected);
    expect(restarted.ok && restarted.receipt.publication).toBe('unchanged');
    if (!restarted.ok) throw restarted.error;
    expect(readFileSync(restarted.receipt.outputPath)).toEqual(Buffer.from(secondExpected));
  });

  it('recovers output made durable before a crash without duplicating JSONL rows', async () => {
    const testEnvironment = environment('crash-recovery');
    const harness = createHarness();
    await appendFixture(harness, 1);
    const expected = expectedRows([{ label: 'event-1', value: 1 }]);
    let injected = false;
    const crashing = engine(testEnvironment, {
      faultInjection: {
        afterOutputDurableBeforeWatermark: () => {
          if (!injected) {
            injected = true;
            throw new Error('simulated crash');
          }
        },
      },
    });
    const failed = await projectJsonl(crashing, harness, expected);
    expect(failed).toMatchObject({
      ok: false,
      error: { code: LegacyProjectionErrorCodes.PUBLICATION_FAILED },
    });
    const outputPath = join(testEnvironment.shadowRoot, 'research/deep-research-state.jsonl');
    expect(readFileSync(outputPath)).toEqual(Buffer.from(expected));
    expect(existsSync(join(
      testEnvironment.shadowRoot,
      '.legacy-projection-watermarks/research-state.json',
    ))).toBe(false);

    const recovered = await projectJsonl(engine(testEnvironment), harness, expected);
    expect(recovered.ok && recovered.receipt.publication).toBe('recovered');
    expect(readFileSync(outputPath)).toEqual(Buffer.from(expected));
    expect(readFileSync(testEnvironment.legacyPath, 'utf8')).toBe('legacy-authoritative\n');
  });

  it('leaves no output or watermark when a crash occurs before output commit', async () => {
    const testEnvironment = environment('pre-commit-crash');
    const harness = createHarness();
    await appendFixture(harness, 1);
    const expected = expectedRows([{ label: 'event-1', value: 1 }]);
    const failed = await projectJsonl(engine(testEnvironment, {
      faultInjection: {
        beforeOutputCommit: () => { throw new Error('simulated pre-commit crash'); },
      },
    }), harness, expected);

    expect(failed).toMatchObject({
      ok: false,
      error: { code: LegacyProjectionErrorCodes.PUBLICATION_FAILED },
    });
    expect(existsSync(join(
      testEnvironment.shadowRoot,
      'research/deep-research-state.jsonl',
    ))).toBe(false);
    expect(existsSync(join(
      testEnvironment.shadowRoot,
      '.legacy-projection-watermarks/research-state.json',
    ))).toBe(false);
    expect(readFileSync(testEnvironment.legacyPath, 'utf8')).toBe('legacy-authoritative\n');
  });

  it('rebuilds disposable torn shadow output before advancing its watermark', async () => {
    const testEnvironment = environment('torn-shadow');
    const harness = createHarness();
    await appendFixture(harness, 1);
    const expected = expectedRows([{ label: 'event-1', value: 1 }]);
    const first = await projectJsonl(engine(testEnvironment), harness, expected);
    if (!first.ok) throw first.error;
    writeFileSync(first.receipt.outputPath, '{"partial":', 'utf8');

    const repaired = await projectJsonl(engine(testEnvironment), harness, expected);
    expect(repaired.ok && repaired.receipt.publication).toBe('replaced');
    if (!repaired.ok) throw repaired.error;
    expect(readFileSync(repaired.receipt.outputPath)).toEqual(Buffer.from(expected));
  });

  it('rejects a projection head older than the durable watermark', async () => {
    const testEnvironment = environment('watermark-regression');
    const harness = createHarness();
    await appendFixture(harness, 1);
    const oldRoot = cloneLedger(harness.rootDirectory, 'old-ledger');
    await appendFixture(harness, 2);
    const currentExpected = expectedRows([
      { label: 'event-1', value: 1 },
      { label: 'event-2', value: 2 },
    ]);
    const current = await projectJsonl(engine(testEnvironment), harness, currentExpected);
    expect(current.ok).toBe(true);

    const oldHarness = createHarness(oldRoot);
    const oldExpected = expectedRows([{ label: 'event-1', value: 1 }]);
    const regressed = await projectJsonl(engine(testEnvironment), oldHarness, oldExpected);
    expect(regressed).toMatchObject({
      ok: false,
      error: { code: LegacyProjectionErrorCodes.WATERMARK_REGRESSION },
    });

    const reducerMismatch = await projectJsonl(
      engine(testEnvironment),
      harness,
      currentExpected,
      { ...jsonlContract(), reducerVersion: 'research-state-reducer@2' },
    );
    expect(reducerMismatch).toMatchObject({
      ok: false,
      error: { code: LegacyProjectionErrorCodes.REDUCER_VERSION_MISMATCH },
    });
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. FAIL-CLOSED ADVERSARIAL BOUNDARIES
// ───────────────────────────────────────────────────────────────────

describe('legacy projection fail-closed boundaries', () => {
  it('observes byte parity failure without creating shadow output or mutating legacy', async () => {
    const testEnvironment = environment('parity-failure');
    const harness = createHarness();
    await appendFixture(harness, 1);
    const observations: LegacyProjectionObservation[] = [];
    const result = await projectJsonl(
      engine(testEnvironment, { observe: (event) => observations.push(event) }),
      harness,
      Buffer.from('{"wrong":true}\n'),
    );

    expect(result).toMatchObject({
      ok: false,
      error: { code: LegacyProjectionErrorCodes.BYTE_PARITY_MISMATCH },
    });
    expect(existsSync(join(testEnvironment.shadowRoot, 'research/deep-research-state.jsonl')))
      .toBe(false);
    expect(readFileSync(testEnvironment.legacyPath, 'utf8')).toBe('legacy-authoritative\n');
    expect(observations).toMatchObject([{
      status: 'failed',
      code: LegacyProjectionErrorCodes.BYTE_PARITY_MISMATCH,
    }]);
  });

  it('rejects lookalike ledger sources that bypass authorized-ledger verification', async () => {
    const testEnvironment = environment('forged-ledger-source');
    const forgedLedger = {
      ledgerId: FIXTURE_LEDGER_ID,
      readVerifiedEvents: async () => [],
      getVerifiedHead: async () => baseHead(),
    } as unknown as AppendOnlyLedger;
    const result = await engine(testEnvironment).project({
      contract: jsonlContract(),
      ledger: forgedLedger,
      replayFingerprint: {} as DerivedReplayFingerprint<JsonlProjectionState>,
      expectedLegacyBytes: serializeLegacyJsonl([]),
    });

    expect(result).toMatchObject({
      ok: false,
      error: { code: LegacyProjectionErrorCodes.LEDGER_INVALID },
    });
    expect(existsSync(join(testEnvironment.shadowRoot, 'research/deep-research-state.jsonl')))
      .toBe(false);
    expect(readFileSync(testEnvironment.legacyPath, 'utf8')).toBe('legacy-authoritative\n');
  });

  it('rejects traversal, symlink escape, direct live roots, and hard-link aliases', async () => {
    const traversalEnvironment = environment('traversal');
    const traversalHarness = createHarness();
    await appendFixture(traversalHarness, 1);
    const expected = expectedRows([{ label: 'event-1', value: 1 }]);
    const traversal = await projectJsonl(
      engine(traversalEnvironment),
      traversalHarness,
      expected,
      jsonlContract('../legacy/authoritative.jsonl'),
    );
    expect(traversal).toMatchObject({
      ok: false,
      error: { code: LegacyProjectionErrorCodes.PATH_ESCAPE },
    });

    const symlinkEnvironment = environment('symlink');
    const symlinkHarness = createHarness();
    await appendFixture(symlinkHarness, 1);
    const symlinkEngine = engine(symlinkEnvironment);
    symlinkSync(symlinkEnvironment.legacyRoot, join(symlinkEnvironment.shadowRoot, 'escape'));
    const symlink = await projectJsonl(
      symlinkEngine,
      symlinkHarness,
      expected,
      jsonlContract('escape/authoritative.jsonl'),
    );
    expect(symlink).toMatchObject({
      ok: false,
      error: { code: LegacyProjectionErrorCodes.SYMLINK_ESCAPE },
    });

    expect(() => new LegacyProjectionEngine({
      shadowRoot: symlinkEnvironment.legacyRoot,
      protectedLegacyPaths: [symlinkEnvironment.legacyRoot],
    })).toThrowError(expect.objectContaining({ code: LegacyProjectionErrorCodes.LIVE_TARGET_REJECTED }));

    const hardLinkEnvironment = environment('hardlink');
    const hardLinkHarness = createHarness();
    await appendFixture(hardLinkHarness, 1);
    const hardLinkEngine = new LegacyProjectionEngine({
      shadowRoot: hardLinkEnvironment.shadowRoot,
      protectedLegacyPaths: [hardLinkEnvironment.legacyPath],
    });
    const hardLinkTarget = join(
      hardLinkEnvironment.shadowRoot,
      'research/deep-research-state.jsonl',
    );
    mkdirSync(dirname(hardLinkTarget), { recursive: true });
    linkSync(hardLinkEnvironment.legacyPath, hardLinkTarget);
    const hardLink = await projectJsonl(hardLinkEngine, hardLinkHarness, expected);
    expect(hardLink).toMatchObject({
      ok: false,
      error: { code: LegacyProjectionErrorCodes.LIVE_TARGET_REJECTED },
    });
    expect(readFileSync(hardLinkEnvironment.legacyPath, 'utf8')).toBe('legacy-authoritative\n');
  });

  it('rejects corrupt ledger frames and unknown event versions before publication', async () => {
    const corruptEnvironment = environment('corrupt-ledger');
    const corruptHarness = createHarness();
    await appendFixture(corruptHarness, 1);
    const corruptContract = jsonlContract();
    const corruptReplay = await replayFingerprint(corruptHarness, corruptContract);
    const targetFrame = framePath(corruptHarness.rootDirectory, 1);
    const frame = JSON.parse(readFileSync(targetFrame, 'utf8')) as LedgerRecordFrame;
    writeFileSync(targetFrame, `${JSON.stringify({ ...frame, record_hash: 'f'.repeat(64) })}\n`, {
      mode: FILE_MODE,
    });
    chmodSync(targetFrame, FILE_MODE);
    const expected = expectedRows([{ label: 'event-1', value: 1 }]);
    const corrupt = await engine(corruptEnvironment).project({
      contract: corruptContract,
      ledger: corruptHarness.ledger,
      replayFingerprint: corruptReplay,
      expectedLegacyBytes: expected,
    });
    expect(corrupt).toMatchObject({
      ok: false,
      error: { code: LegacyProjectionErrorCodes.LEDGER_INVALID },
    });
    expect(existsSync(join(corruptEnvironment.shadowRoot, 'research/deep-research-state.jsonl')))
      .toBe(false);

    const unknownEnvironment = environment('unknown-event');
    const unknownHarness = createHarness();
    await appendFixture(unknownHarness, 1);
    const unsupported = {
      ...jsonlContract(),
      acceptedEventVersions: { 'deep-loop.fixture.other-recorded': [1] },
    } satisfies LegacyProjectionContract<JsonlProjectionState>;
    const unknown = await projectJsonl(
      engine(unknownEnvironment),
      unknownHarness,
      expected,
      unsupported,
    );
    expect(unknown).toMatchObject({
      ok: false,
      error: { code: LegacyProjectionErrorCodes.EVENT_UNSUPPORTED },
    });
  });

  it('rejects invalid replay identity and nondeterministic reducers or serializers', async () => {
    const testEnvironment = environment('determinism');
    const harness = createHarness();
    await appendFixture(harness, 1);
    const expected = expectedRows([{ label: 'event-1', value: 1 }]);
    const contract = jsonlContract();
    const validReplay = await replayFingerprint(harness, contract);
    const invalidFingerprint = {
      ...validReplay,
      descriptor: Object.freeze({
        ...validReplay.descriptor,
        final_digest: 'f'.repeat(64),
      }),
    } satisfies DerivedReplayFingerprint<JsonlProjectionState>;
    const invalidReplay = await engine(testEnvironment).project({
      contract,
      ledger: harness.ledger,
      replayFingerprint: invalidFingerprint,
      expectedLegacyBytes: expected,
    });
    expect(invalidReplay).toMatchObject({
      ok: false,
      error: { code: LegacyProjectionErrorCodes.REPLAY_FINGERPRINT_MISMATCH },
    });

    let reductionRun = 0;
    const nondeterministicReducer = {
      ...jsonlContract(),
      reduce(): JsonlProjectionState {
        reductionRun += 1;
        return {
          rows: [{ type: 'iteration', run: reductionRun }],
          lastValue: reductionRun,
        };
      },
    } satisfies LegacyProjectionContract<JsonlProjectionState>;
    const reducerFailure = await projectJsonl(
      engine(environment('nondeterministic-reducer')),
      harness,
      expected,
      nondeterministicReducer,
      jsonlContract(),
    );
    expect(reducerFailure).toMatchObject({
      ok: false,
      error: { code: LegacyProjectionErrorCodes.REDUCER_NONDETERMINISTIC },
    });

    let serializationRun = 0;
    const baseContract = jsonlContract();
    const nondeterministicSerializer = {
      ...baseContract,
      serialize(state: Readonly<JsonlProjectionState>): Uint8Array {
        const stable = serializeLegacyJsonl(state.rows);
        if (state.rows.length === 0) return stable;
        serializationRun += 1;
        return Buffer.concat([Buffer.from(stable), Buffer.from(`#${serializationRun}`)]);
      },
    } satisfies LegacyProjectionContract<JsonlProjectionState>;
    const serializerFailure = await projectJsonl(
      engine(environment('nondeterministic-serializer')),
      harness,
      expected,
      nondeterministicSerializer,
    );
    expect(serializerFailure).toMatchObject({
      ok: false,
      error: { code: LegacyProjectionErrorCodes.SERIALIZER_NONDETERMINISTIC },
    });
  });

  it('keeps observation sinks outside projector control flow', async () => {
    const testEnvironment = environment('observer');
    const harness = createHarness();
    await appendFixture(harness, 1);
    const expected = expectedRows([{ label: 'event-1', value: 1 }]);
    const result = await projectJsonl(engine(testEnvironment, {
      observe: () => { throw new Error('observer unavailable'); },
    }), harness, expected);
    expect(result.ok).toBe(true);
    expect(readFileSync(testEnvironment.legacyPath, 'utf8')).toBe('legacy-authoritative\n');
  });
});
