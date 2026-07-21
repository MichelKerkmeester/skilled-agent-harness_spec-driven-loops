// ───────────────────────────────────────────────────────────────────
// MODULE: Authorized Ledger Tests
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  cpSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  AuthorizationReasonCodes,
  AuthorizedLedgerErrorCodes,
  DarkLedgerAdapter,
  LEGACY_DARK_BOUNDARIES,
  TransitionAuthorizationGateway,
  TypedReducerRegistry,
  rebuildProjection,
  readAuthorizationAudit,
  verifyAuthorizationReplay,
} from '../../lib/authorized-ledger/index.js';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_EVENT_TYPE,
  FIXTURE_LEDGER_ID,
  createFixtureEvent,
  createFixtureEventRegistry,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from '../fixtures/authorized-ledger-fixtures.js';

import type {
  GatewayAllowProof,
  LedgerRecordFrame,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type { EventTypeRegistry, EventWritePreflight, JsonObject } from '../../lib/event-envelope/index.js';
import type { TransitionPolicyRegistry } from '../../lib/authorized-ledger/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

interface Harness {
  readonly rootDirectory: string;
  readonly registry: EventTypeRegistry;
  readonly policies: TransitionPolicyRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
}

interface CountProjection extends JsonObject {
  count: number;
  ids: string[];
}

// ───────────────────────────────────────────────────────────────────
// 2. FIXTURE HELPERS
// ───────────────────────────────────────────────────────────────────

const temporaryRoots: string[] = [];
const FILE_MODE = 0o600;

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `authorized-ledger-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function createHarness(
  rootDirectory = temporaryRoot('case'),
  overrides: Readonly<{
    authorityProvider?: () => typeof FIXTURE_AUTHORITY | Promise<typeof FIXTURE_AUTHORITY>;
    beforeDomainCommit?: () => void;
    evaluatorTimeoutMs?: number;
  }> = {},
): Harness {
  const registry = createFixtureEventRegistry();
  const policies = createFixturePolicyRegistry();
  const authorityProvider = overrides.authorityProvider ?? (() => FIXTURE_AUTHORITY);
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider,
    faultInjection: overrides.beforeDomainCommit
      ? { beforeDomainCommit: overrides.beforeDomainCommit }
      : undefined,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider,
    evaluatorTimeoutMs: overrides.evaluatorTimeoutMs,
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
  expect(result.verdict).toBe('allow');
  if (result.verdict !== 'allow') throw new Error(`Expected allow, received ${result.reasonCode}`);
  return result.proof;
}

async function appendFixture(
  harness: Harness,
  index: number,
): Promise<{ readonly event: EventWritePreflight; readonly proof: GatewayAllowProof }> {
  const event = createFixtureEvent(harness.registry, index);
  const proof = await authorize(harness, event, `request-${index}`);
  await harness.ledger.appendAuthorized(event, proof);
  return { event, proof };
}

function frameDirectory(rootDirectory: string): string {
  return join(rootDirectory, FIXTURE_LEDGER_ID, 'frames');
}

function framePath(rootDirectory: string, sequence: number): string {
  return join(frameDirectory(rootDirectory), `${String(sequence).padStart(16, '0')}.frame`);
}

function readFrame(rootDirectory: string, sequence: number): LedgerRecordFrame {
  return JSON.parse(readFileSync(framePath(rootDirectory, sequence), 'utf8')) as LedgerRecordFrame;
}

function writeFrame(rootDirectory: string, sequence: number, frame: LedgerRecordFrame): void {
  const target = framePath(rootDirectory, sequence);
  writeFileSync(target, `${JSON.stringify(frame)}\n`, { encoding: 'utf8', mode: FILE_MODE });
  chmodSync(target, FILE_MODE);
}

function withRecomputedHash(
  frame: Omit<LedgerRecordFrame, 'record_hash'>,
): LedgerRecordFrame {
  return {
    ...frame,
    record_hash: sha256Bytes(canonicalBytes(frame)),
  };
}

async function committedHarness(count = 3): Promise<{
  readonly harness: Harness;
  readonly appends: readonly {
    readonly event: EventWritePreflight;
    readonly proof: GatewayAllowProof;
  }[];
}> {
  const harness = createHarness();
  const appends = [];
  for (let index = 1; index <= count; index += 1) {
    appends.push(await appendFixture(harness, index));
  }
  return { harness, appends };
}

function cloneRoot(source: string, label: string): string {
  const destination = temporaryRoot(label);
  rmSync(destination, { recursive: true, force: true });
  cpSync(source, destination, { recursive: true, preserveTimestamps: true });
  return destination;
}

function runWorker(rootDirectory: string, index: number): Promise<Record<string, unknown>> {
  const tsxLoader = resolve(
    import.meta.dirname,
    '../../../../system-spec-kit/scripts/node_modules/tsx/dist/loader.mjs',
  );
  const worker = resolve(import.meta.dirname, '../fixtures/authorized-ledger-worker.ts');
  return new Promise((resolveWorker, rejectWorker) => {
    const child = spawn(
      process.execPath,
      ['--import', tsxLoader, worker, rootDirectory, String(index)],
      {
      cwd: resolve(import.meta.dirname, '../..'),
      stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    let output = '';
    let errorOutput = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => { output += chunk; });
    child.stderr.on('data', (chunk: string) => { errorOutput += chunk; });
    child.on('error', rejectWorker);
    child.on('close', (code) => {
      if (code !== 0) {
        rejectWorker(new Error(`Writer ${index} exited ${code}: ${errorOutput}`));
        return;
      }
      resolveWorker(JSON.parse(output) as Record<string, unknown>);
    });
  });
}

afterEach(() => {
  while (temporaryRoots.length > 0) {
    const root = temporaryRoots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 3. AUTHORIZATION BOUNDARY
// ───────────────────────────────────────────────────────────────────

describe('coupled authorization and append boundary', () => {
  it('rejects direct domain append when no durable allow proof exists', async () => {
    const harness = createHarness();
    const event = createFixtureEvent(harness.registry, 1);

    expect((harness.ledger as unknown as { append?: unknown }).append).toBeUndefined();
    await expect(harness.ledger.appendAuthorized(event, undefined as never)).rejects.toMatchObject({
      code: AuthorizedLedgerErrorCodes.AUTHORIZATION_REQUIRED,
    });
    expect(await harness.ledger.getVerifiedHead()).toMatchObject({ sequence: 0 });
  });

  it('uses one exact allow once, returns the original receipt on retry, and rejects ID conflict', async () => {
    const harness = createHarness();
    const event = createFixtureEvent(harness.registry, 1);
    const proof = await authorize(harness, event, 'allow-once');
    const first = await harness.ledger.appendAuthorized(event, proof);
    const retry = await harness.ledger.appendAuthorized(event, proof);
    expect(retry).toEqual(first);
    expect(await harness.ledger.getVerifiedHead()).toMatchObject({ sequence: 1 });

    const conflicting = createFixtureEvent(harness.registry, 2, {
      event_id: event.identity.eventId,
      idempotency_key: event.identity.idempotencyKey,
    });
    const conflictingProof = await authorize(harness, conflicting, 'conflicting-event-id');
    await expect(
      harness.ledger.appendAuthorized(conflicting, conflictingProof),
    ).rejects.toMatchObject({ code: AuthorizedLedgerErrorCodes.EVENT_ID_CONFLICT });
    expect(await harness.ledger.getVerifiedHead()).toMatchObject({ sequence: 1 });
  });

  it('rejects one allow when presented for a different event or ledger identity', async () => {
    const harness = createHarness();
    const event = createFixtureEvent(harness.registry, 1);
    const differentEvent = createFixtureEvent(harness.registry, 2);
    const proof = await authorize(harness, event, 'bound-allow');

    await expect(harness.ledger.appendAuthorized(differentEvent, proof)).rejects.toMatchObject({
      code: AuthorizedLedgerErrorCodes.AUTHORIZATION_INVALID,
    });

    const otherLedger = new AppendOnlyLedger({
      rootDirectory: harness.rootDirectory,
      ledgerId: 'other-domain',
      auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
      authorityProvider: () => FIXTURE_AUTHORITY,
    }, harness.registry);
    await expect(otherLedger.appendAuthorized(event, proof)).rejects.toMatchObject({
      code: AuthorizedLedgerErrorCodes.AUTHORIZATION_INVALID,
    });
    expect(await harness.ledger.getVerifiedHead()).toMatchObject({ sequence: 0 });
  });

  it('records a deny only in the non-domain audit stream', async () => {
    const harness = createHarness();
    const event = createFixtureEvent(harness.registry, 1);
    const request = await createFixtureRequest(
      harness.ledger,
      event,
      harness.policies,
      'deny-request',
      { capabilityId: 'read' },
    );
    const result = await harness.gateway.authorize(request);

    expect(result).toMatchObject({
      verdict: 'deny',
      reasonCode: AuthorizationReasonCodes.POLICY_DENIED,
    });
    expect(await harness.ledger.getVerifiedHead()).toMatchObject({ sequence: 0 });
    const audit = await readAuthorizationAudit(
      harness.rootDirectory,
      FIXTURE_AUDIT_LEDGER_ID,
    );
    expect(audit.head.sequence).toBe(1);
    expect(audit.entries[0].decision.decision).toBe('deny');
    expect(audit.entries[0].event.effective.envelope.event_type)
      .toBe('authorization.decision.recorded');
  });

  it('defaults missing, unknown, unsupported, stale, exceptional, and timed-out inputs to deny', async () => {
    const harness = createHarness(undefined, { evaluatorTimeoutMs: 5 });
    const event = createFixtureEvent(harness.registry, 1);
    const valid = await createFixtureRequest(
      harness.ledger,
      event,
      harness.policies,
      'matrix-valid',
    );
    const throwing = harness.policies.resolve('fixture-throwing-policy', 1);
    const timeout = harness.policies.resolve('fixture-timeout-policy', 1);
    const cases: readonly [unknown, string][] = [
      [undefined, AuthorizationReasonCodes.INVALID_INPUT],
      [{ ...valid, requestId: 'unknown-policy', policy: {
        policyId: 'missing-policy', policyVersion: 1, policyDigest: '0'.repeat(64),
      } }, AuthorizationReasonCodes.UNKNOWN_POLICY],
      [{ ...valid, requestId: 'unsupported-registry', event: {
        ...event, registryDigest: '0'.repeat(64),
      } }, AuthorizationReasonCodes.UNSUPPORTED_EVENT],
      [{ ...valid, requestId: 'stale-head', priorHead: {
        ...valid.priorHead, recordHash: 'f'.repeat(64),
      } }, AuthorizationReasonCodes.STALE_HEAD],
      [{ ...valid, requestId: 'stale-epoch', authorityEpoch: 2 },
        AuthorizationReasonCodes.STALE_AUTHORITY_EPOCH],
      [{ ...valid, requestId: 'throwing-policy', policy: {
        policyId: throwing.policyId,
        policyVersion: throwing.policyVersion,
        policyDigest: throwing.digest,
      } }, AuthorizationReasonCodes.EVALUATOR_EXCEPTION],
      [{ ...valid, requestId: 'timeout-policy', policy: {
        policyId: timeout.policyId,
        policyVersion: timeout.policyVersion,
        policyDigest: timeout.digest,
      } }, AuthorizationReasonCodes.EVALUATOR_TIMEOUT],
    ];

    for (const [candidate, reasonCode] of cases) {
      await expect(harness.gateway.authorize(candidate)).resolves.toMatchObject({
        verdict: 'deny',
        reasonCode,
      });
    }
    expect(await harness.ledger.getVerifiedHead()).toMatchObject({ sequence: 0 });
    const audit = await readAuthorizationAudit(
      harness.rootDirectory,
      FIXTURE_AUDIT_LEDGER_ID,
    );
    expect(audit.entries).toHaveLength(cases.length);
    expect(audit.entries.every((entry) => entry.decision.decision === 'deny')).toBe(true);
  });

  it('fails closed when authority or audit storage is unavailable', async () => {
    const unavailable = createHarness(undefined, {
      authorityProvider: async () => { throw new Error('authority unavailable'); },
    });
    const event = createFixtureEvent(unavailable.registry, 1);
    const policy = unavailable.policies.resolve('fixture-capability-policy', 1);
    const request = {
      requestId: 'authority-unavailable',
      mode: 'research',
      event,
      priorHead: { ledgerId: FIXTURE_LEDGER_ID, sequence: 0, recordHash: '0'.repeat(64) },
      priorStateVersion: 'fixture-state@1',
      priorStateFingerprint: '1'.repeat(64),
      actorId: 'fixture-actor',
      capabilityId: 'write',
      authorityEpoch: 1,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: '2'.repeat(64),
    };
    await expect(unavailable.gateway.authorize(request)).resolves.toMatchObject({
      verdict: 'deny',
      reasonCode: AuthorizationReasonCodes.GATEWAY_FAILURE,
    });

    const corrupt = createHarness();
    const corruptEvent = createFixtureEvent(corrupt.registry, 1);
    const corruptRequest = await createFixtureRequest(
      corrupt.ledger,
      corruptEvent,
      corrupt.policies,
      'audit-unavailable',
    );
    writeFileSync(
      join(corrupt.rootDirectory, FIXTURE_AUDIT_LEDGER_ID, 'frames', 'unexpected'),
      'corrupt',
      { mode: FILE_MODE },
    );
    await expect(corrupt.gateway.authorize(corruptRequest)).resolves.toMatchObject({
      verdict: 'deny',
      reasonCode: AuthorizationReasonCodes.AUDIT_STORAGE_FAILURE,
      decision: null,
    });
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. DARK LEGACY ISOLATION
// ───────────────────────────────────────────────────────────────────

describe('dark adapter legacy isolation', () => {
  it('pins every legacy boundary named by the persistence census', () => {
    expect(LEGACY_DARK_BOUNDARIES.map((entry) => entry.source)).toEqual([
      'deep-research/scripts/reduce-state.cjs',
      'runtime/scripts/reduce-state.cjs',
      'runtime/scripts/reduce-alignment-state.cjs',
      'deep-improvement/scripts/shared/reduce-state.cjs',
      'runtime/lib/deep-loop/atomic-state.ts',
      'runtime/lib/deep-loop/jsonl-repair.ts',
      'runtime/lib/council/round-state-jsonl.cjs',
      'runtime/scripts/fanout-pool.cjs',
      'runtime/scripts/fanout-run.cjs',
      'runtime/lib/deep-loop/observability-events.cjs',
      'runtime/scripts/verify-iteration.cjs',
    ]);
  });

  it('returns the same legacy result for allow, deny, and typed-ledger failure', async () => {
    const legacyResult = Object.freeze({ status: 'legacy-ok', exitCode: 0 });

    const allowed = createHarness();
    const allowedEvent = createFixtureEvent(allowed.registry, 1);
    const allowedRequest = await createFixtureRequest(
      allowed.ledger,
      allowedEvent,
      allowed.policies,
      'dark-allow',
    );
    const allowedAdapter = new DarkLedgerAdapter(allowed.gateway, allowed.ledger);
    expect(await allowedAdapter.recordAfterLegacy(
      'research-state-jsonl',
      legacyResult,
      allowedEvent,
      allowedRequest,
    )).toBe(legacyResult);
    expect(allowedAdapter.readTelemetry()).toMatchObject([{ status: 'appended' }]);

    const denied = createHarness();
    const deniedEvent = createFixtureEvent(denied.registry, 1);
    const deniedRequest = await createFixtureRequest(
      denied.ledger,
      deniedEvent,
      denied.policies,
      'dark-deny',
      { capabilityId: 'read' },
    );
    const deniedAdapter = new DarkLedgerAdapter(denied.gateway, denied.ledger);
    expect(await deniedAdapter.recordAfterLegacy(
      'council-round-state',
      legacyResult,
      deniedEvent,
      deniedRequest,
    )).toBe(legacyResult);
    expect(deniedAdapter.readTelemetry()).toMatchObject([{
      status: 'denied',
      reasonCode: AuthorizationReasonCodes.POLICY_DENIED,
    }]);
    expect(await denied.ledger.getVerifiedHead()).toMatchObject({ sequence: 0 });

    const failed = createHarness(undefined, {
      beforeDomainCommit: () => { throw new Error('dark ledger unavailable'); },
    });
    const failedEvent = createFixtureEvent(failed.registry, 1);
    const failedRequest = await createFixtureRequest(
      failed.ledger,
      failedEvent,
      failed.policies,
      'dark-failure',
    );
    const failedAdapter = new DarkLedgerAdapter(failed.gateway, failed.ledger, {
      observe: () => { throw new Error('telemetry sink unavailable'); },
    });
    expect(await failedAdapter.recordAfterLegacy(
      'fanout-wait-checkpoint',
      legacyResult,
      failedEvent,
      failedRequest,
    )).toBe(legacyResult);
    expect(failedAdapter.readTelemetry()).toMatchObject([{
      status: 'failed',
      errorCode: 'UNEXPECTED_FAILURE',
    }]);
    expect(await failed.ledger.getVerifiedHead()).toMatchObject({ sequence: 0 });
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. ORDERING, INTEGRITY, AND RECOVERY
// ───────────────────────────────────────────────────────────────────

describe('locked ordering and immutable integrity', () => {
  it('rejects unsafe ledger identities and uses owner-only immutable frame permissions', async () => {
    const rootDirectory = temporaryRoot('permissions');
    const registry = createFixtureEventRegistry();
    expect(() => new AppendOnlyLedger({
      rootDirectory,
      ledgerId: '../escape',
      authorityProvider: () => FIXTURE_AUTHORITY,
    }, registry)).toThrow();

    const harness = createHarness(rootDirectory);
    await appendFixture(harness, 1);
    expect(statSync(framePath(rootDirectory, 1)).mode & 0o777).toBe(0o600);
    expect(statSync(frameDirectory(rootDirectory)).mode & 0o777).toBe(0o700);
  });

  it('serializes concurrent processes into one contiguous unambiguous head', async () => {
    const rootDirectory = temporaryRoot('multiprocess');
    const receipts = await Promise.all(
      Array.from({ length: 6 }, (_, index) => runWorker(rootDirectory, index + 1)),
    );
    expect(receipts.map((receipt) => receipt.sequence).sort((a, b) =>
      Number(a) - Number(b))).toEqual([1, 2, 3, 4, 5, 6]);

    const harness = createHarness(rootDirectory);
    const events = await harness.ledger.readVerifiedEvents();
    expect(events.map((verified) => verified.frame.sequence)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(events.map((verified) => verified.frame.record_hash)).size).toBe(6);
    expect(await harness.ledger.getVerifiedHead()).toMatchObject({ sequence: 6 });
  });

  it.each([
    ['mutation', (root: string) => {
      const frame = readFrame(root, 2);
      writeFrame(root, 2, { ...frame, canonical_event_hash: 'f'.repeat(64) });
    }],
    ['deletion', (root: string) => unlinkSync(framePath(root, 2))],
    ['insertion', (root: string) => writeFileSync(
      join(frameDirectory(root), '0000000000000002.inserted'),
      'inserted',
      { mode: FILE_MODE },
    )],
    ['reorder', (root: string) => {
      const first = readFileSync(framePath(root, 1));
      const second = readFileSync(framePath(root, 2));
      writeFileSync(framePath(root, 1), second, { mode: FILE_MODE });
      writeFileSync(framePath(root, 2), first, { mode: FILE_MODE });
    }],
    ['fork', (root: string) => writeFileSync(
      join(frameDirectory(root), '0000000000000003.branch'),
      readFileSync(framePath(root, 3)),
      { mode: FILE_MODE },
    )],
  ])('detects %s before yielding a typed event', async (_label, mutate) => {
    const base = await committedHarness();
    const root = cloneRoot(base.harness.rootDirectory, String(_label));
    mutate(root);
    const harness = createHarness(root);
    await expect(harness.ledger.readVerifiedEvents()).rejects.toBeDefined();
  });

  it('detects and byte-preserves a torn tail, then resumes at the same next sequence', async () => {
    const { harness, appends } = await committedHarness();
    const lastPath = framePath(harness.rootDirectory, 3);
    const original = readFileSync(lastPath);
    const torn = original.subarray(0, Math.floor(original.length / 2));
    writeFileSync(lastPath, torn, { mode: FILE_MODE });
    chmodSync(lastPath, FILE_MODE);

    await expect(harness.ledger.getVerifiedHead()).rejects.toMatchObject({
      code: AuthorizedLedgerErrorCodes.TORN_TAIL,
    });
    const recoveredHead = await harness.ledger.recoverTornTail();
    expect(recoveredHead.sequence).toBe(2);
    const quarantineDirectory = join(
      harness.rootDirectory,
      FIXTURE_LEDGER_ID,
      'quarantine',
    );
    const quarantined = readdirSync(quarantineDirectory);
    expect(quarantined).toHaveLength(1);
    expect(sha256Bytes(readFileSync(join(quarantineDirectory, quarantined[0]))))
      .toBe(sha256Bytes(torn));

    const receipt = await harness.ledger.appendAuthorized(appends[2].event, appends[2].proof);
    expect(receipt.sequence).toBe(3);
    expect(await harness.ledger.getVerifiedHead()).toMatchObject({ sequence: 3 });
  });

  it('rejects a recomputed frame carrying an unknown event type or altered authorization link', async () => {
    const base = await committedHarness(1);
    const unknownRoot = cloneRoot(base.harness.rootDirectory, 'unknown-type');
    const unknown = readFrame(unknownRoot, 1);
    const decoded = JSON.parse(
      Buffer.from(unknown.canonical_event_bytes, 'base64').toString('utf8'),
    ) as Record<string, unknown>;
    decoded.event_type = 'unknown.fixture.event';
    const unknownBytes = canonicalBytes(decoded);
    const { record_hash: ignoredUnknownHash, ...unknownHashInput } = unknown;
    void ignoredUnknownHash;
    writeFrame(unknownRoot, 1, withRecomputedHash({
      ...unknownHashInput,
      canonical_event_hash: sha256Bytes(unknownBytes),
      canonical_event_bytes: Buffer.from(unknownBytes).toString('base64'),
    }));
    await expect(createHarness(unknownRoot).ledger.readVerifiedEvents()).rejects.toMatchObject({
      code: 'REGISTRY_UNKNOWN_EVENT_TYPE',
    });

    const authorizationRoot = cloneRoot(base.harness.rootDirectory, 'authorization-link');
    const altered = readFrame(authorizationRoot, 1);
    const { record_hash: ignoredAuthorizationHash, ...authorizationHashInput } = altered;
    void ignoredAuthorizationHash;
    writeFrame(authorizationRoot, 1, withRecomputedHash({
      ...authorizationHashInput,
      authorization_ref: {
        ...altered.authorization_ref,
        decision_digest: 'f'.repeat(64),
      },
    }));
    await expect(createHarness(authorizationRoot).ledger.readVerifiedEvents())
      .rejects.toMatchObject({ code: AuthorizedLedgerErrorCodes.AUTHORIZATION_INVALID });
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. REPLAY AND REDUCTION
// ───────────────────────────────────────────────────────────────────

describe('verified replay and disposable projections', () => {
  it('rebuilds byte-identical projections from verified events only', async () => {
    const { harness } = await committedHarness(3);
    const events = await harness.ledger.readVerifiedEvents();
    const head = await harness.ledger.getVerifiedHead();
    const reducers = new TypedReducerRegistry<CountProjection>([{
      eventType: FIXTURE_EVENT_TYPE,
      reducerVersion: 'count@1',
      reduce: (state, event) => ({
        count: state.count + 1,
        ids: [...state.ids, event.effective.envelope.event_id],
      }),
    }]);
    const first = rebuildProjection(events, { count: 0, ids: [] }, 'count@1', head, reducers);
    const second = rebuildProjection(events, { count: 0, ids: [] }, 'count@1', head, reducers);

    expect(Buffer.from(first.canonicalBytes)).toEqual(Buffer.from(second.canonicalBytes));
    expect(first.digest).toBe(second.digest);
    expect(first.state).toEqual({
      count: 3,
      ids: ['fixture-event-1', 'fixture-event-2', 'fixture-event-3'],
    });
  });

  it('verifies allow linkage, deny absence, and policy parity across both streams', async () => {
    const harness = createHarness();
    await appendFixture(harness, 1);
    const deniedEvent = createFixtureEvent(harness.registry, 2);
    const deniedRequest = await createFixtureRequest(
      harness.ledger,
      deniedEvent,
      harness.policies,
      'replay-denial',
      { capabilityId: 'read' },
    );
    await harness.gateway.authorize(deniedRequest);

    const report = await verifyAuthorizationReplay(
      harness.ledger,
      harness.rootDirectory,
      harness.policies,
      FIXTURE_AUDIT_LEDGER_ID,
    );
    expect(report.domainHead.sequence).toBe(1);
    expect(report.auditHead.sequence).toBe(2);
    expect(report.appliedDecisionIds).toHaveLength(1);
    expect(report.deniedDecisionIds).toHaveLength(1);
    expect(report.unappliedAllowDecisionIds).toEqual([]);
    expect(report.policyDivergences).toEqual([]);
  });

  it('keeps a crash-before-domain-commit allow durable and visibly unapplied', async () => {
    const harness = createHarness(undefined, {
      beforeDomainCommit: () => { throw new Error('simulated crash before domain commit'); },
    });
    const event = createFixtureEvent(harness.registry, 1);
    const proof = await authorize(harness, event, 'crash-before-domain');
    await expect(harness.ledger.appendAuthorized(event, proof)).rejects.toThrow(
      'simulated crash before domain commit',
    );
    expect(await harness.ledger.getVerifiedHead()).toMatchObject({ sequence: 0 });

    const report = await verifyAuthorizationReplay(
      harness.ledger,
      harness.rootDirectory,
      harness.policies,
      FIXTURE_AUDIT_LEDGER_ID,
    );
    expect(report.unappliedAllowDecisionIds).toEqual([proof.decision.decision_id]);
    expect(report.appliedDecisionIds).toEqual([]);
  });
});
