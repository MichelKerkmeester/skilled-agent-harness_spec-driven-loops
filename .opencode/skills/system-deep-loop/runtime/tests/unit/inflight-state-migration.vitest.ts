// ───────────────────────────────────────────────────────────────────
// MODULE: In-Flight State Migration Tests
// ───────────────────────────────────────────────────────────────────

import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  createClassificationManifest,
  FROZEN_CENSUS_ROW_POLICIES,
  InflightDisposition,
} from '../../lib/inflight-state-classification/index.js';
import {
  appendInflightMigrationCheckpointEvent,
  assertBundleMatchesDigest,
  assertStampedIntegrity,
  buildBlockMigrationEnvelope,
  buildInflightMigrationCheckpointFacts,
  buildInflightMigrationHandoff,
  buildMigrationEnvelope,
  createInflightMigrationCheckpointEventRegistry,
  evidenceMatchesFrozenRow,
  executeBlock,
  executeFork,
  executeMigrate,
  executePin,
  executeUpcast,
  InflightMigrationError,
  MigrationCoordinator,
  MigrationOperationStatuses,
  prepareInflightMigrationCheckpointEventWrite,
  snapshotDigest,
  stampForStorage,
  verifyInflightMigrationHandoff,
  verifyMigrationEnvelope,
  verifyMigrationReceipt,
} from '../../lib/inflight-state-migration/index.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationResult,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  ClassificationEvidence,
  ClassifiedInflightStateRow,
  DispositionProof,
  InflightClassificationManifest,
  StateBackendCensus,
  StateBackendCensusRow,
} from '../../lib/inflight-state-classification/index.js';
import type { MigrationLedgerContext, MigrationReceipt } from '../../lib/inflight-state-migration/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. SHARED FIXTURES (mirrors tests/unit/cutover-certificate.vitest.ts)
// ───────────────────────────────────────────────────────────────────

const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(TEST_DIRECTORY, '../../../../../..');
const CENSUS_BYTES = readFileSync(join(
  REPOSITORY_ROOT,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation',
  '003-baseline-taxonomy-and-state-census/state-backend-census.json',
));
const CENSUS = JSON.parse(CENSUS_BYTES.toString('utf8')) as StateBackendCensus;

const UPCAST_ROW_ID = 'research-config';
const MIGRATE_ROW_ID = 'research-state';
const PIN_ROW_ID = 'research-strategy-inbox';
const FORK_ROW_ID = 'model-benchmark-hub-output';
const BLOCK_ROW_ID = 'research-controls';

function digest(label: string): string {
  return createHash('sha256').update(label, 'utf8').digest('hex');
}

function proofFor(rowId: string, disposition: keyof typeof InflightDisposition): DispositionProof {
  switch (disposition) {
    case InflightDisposition.UPCAST:
      return {
        kind: 'upcast',
        adjacentChainComplete: true,
        pure: true,
        deterministic: true,
        sideEffectFree: true,
        sourceBytesPreserved: true,
        immutableIdentityPreserved: true,
        replayEquivalent: true,
        sourceBytesDigest: digest(`${rowId}:source`),
        effectiveStateDigest: digest(`${rowId}:effective`),
        registryDigest: digest(`${rowId}:registry`),
        chainIdentitiesDigest: digest(`${rowId}:chain`),
      };
    case InflightDisposition.PIN:
      return {
        kind: 'pin',
        legacyWriterSoleAuthority: true,
        legacyCompletionAvailable: true,
        boundedCompletion: true,
        timedOut: false,
        terminalBoundary: 'legacy-terminal-receipt',
        terminalReceiptRequired: true,
      };
    case InflightDisposition.FORK:
      return {
        kind: 'fork',
        executionNamespace: `shadow-execution-${rowId}`,
        effectNamespace: `shadow-effects-${rowId}`,
        shadowOnlySink: true,
        livePublicationEnabled: false,
        sourceStateUnchanged: true,
        authorityUnaffected: true,
        budgetsUnaffected: true,
      };
    case InflightDisposition.MIGRATE:
      return {
        kind: 'migrate',
        quiescentCheckpoint: true,
        transactionalSnapshot: true,
        atomicImport: true,
        reversible: true,
        identityPreserved: true,
        orderPreserved: true,
        idempotencyPreserved: true,
        budgetsPreserved: true,
        receiptsPreserved: true,
        pendingWorkPreserved: true,
        checkpointDigest: digest(`${rowId}:checkpoint`),
        restorationReceiptDigest: digest(`${rowId}:restoration`),
      };
    case InflightDisposition.BLOCK:
      return { kind: 'block', veto: 'execution-control-must-drain' };
  }
}

function evidenceFor(row: StateBackendCensusRow): ClassificationEvidence {
  const policy = FROZEN_CENSUS_ROW_POLICIES[row.id as keyof typeof FROZEN_CENSUS_ROW_POLICIES];
  const isPin = policy.disposition === InflightDisposition.PIN;
  const isPolicyBlock = policy.disposition === InflightDisposition.BLOCK;
  return {
    rowId: row.id,
    isPresent: !isPolicyBlock,
    stateDigest: digest(`${row.id}:state`),
    shapeVersion: '1',
    shapeStatus: 'registered',
    schemaDigest: digest(`${row.id}:schema`),
    lifecyclePoint: row.lifecycle,
    authorityState: 'legacy_authoritative',
    authorityEpoch: 7,
    mutability: row.mutability,
    leaseState: isPin ? 'active' : 'none',
    activeLeaseCount: isPin ? 1 : 0,
    leaseSetDigest: digest(`${row.id}:leases`),
    pendingEffectsState: isPin ? 'active-legacy' : 'none',
    pendingEffectSetDigest: digest(`${row.id}:effects`),
    identityCoverage: true,
    orderCoverage: true,
    idempotencyCoverage: true,
    budgetCoverage: true,
    receiptCoverage: true,
    pendingWorkCoverage: true,
    isCorrupt: false,
    rollbackAnchor: {
      anchorId: `legacy-anchor-${row.id}`,
      digest: digest(`${row.id}:rollback-anchor`),
      retained: true,
      restorable: true,
      minimumRetentionDays: 14,
      minimumSuccessfulRuns: 5,
    },
    verifier: {
      verified: true,
      receiptDigest: digest(`${row.id}:verifier`),
      replayFingerprintDigest: policy.disposition === InflightDisposition.UPCAST
        ? digest(`${row.id}:replay-fingerprint`)
        : null,
      rollbackScenarioDigest: digest(`${row.id}:rollback-scenario`),
      parityCaseDigest: policy.disposition === InflightDisposition.FORK
        ? digest(`${row.id}:parity-case`)
        : null,
    },
    proof: proofFor(row.id, policy.disposition),
  };
}

function buildManifest(): InflightClassificationManifest {
  return createClassificationManifest({
    classificationId: 'inflight-state-migration-fixture',
    classifiedAt: '2026-08-09T00:00:00Z',
    classifierBuildId: 'inflight-state-migration-tests',
    censusBytes: CENSUS_BYTES,
    evidence: CENSUS.rows.map(evidenceFor),
  }).manifest;
}

const MANIFEST = buildManifest();

function rowFor(rowId: string): ClassifiedInflightStateRow {
  const row = MANIFEST.rows.find((candidate) => candidate.rowId === rowId);
  if (!row) throw new Error(`fixture row not found: ${rowId}`);
  return row;
}

function censusRowFor(rowId: string): StateBackendCensusRow {
  const row = CENSUS.rows.find((candidate) => candidate.id === rowId);
  if (!row) throw new Error(`census row not found: ${rowId}`);
  return row;
}

/** Fresh re-read of the exact same evidence used at classification time. */
function freshEvidenceFor(rowId: string): ClassificationEvidence {
  return evidenceFor(censusRowFor(rowId));
}

// ───────────────────────────────────────────────────────────────────
// 2. ENVELOPE
// ───────────────────────────────────────────────────────────────────

describe('buildMigrationEnvelope', () => {
  it('is deterministic for the same manifest, row, and evidence', () => {
    const row = rowFor(UPCAST_ROW_ID);
    const evidence = freshEvidenceFor(UPCAST_ROW_ID);
    const first = buildMigrationEnvelope(MANIFEST, row, row.disposition, evidence);
    const second = buildMigrationEnvelope(MANIFEST, row, row.disposition, evidence);
    expect(first.envelopeDigest).toBe(second.envelopeDigest);
    expect(first.migrationId).toBe(second.migrationId);
    expect(verifyMigrationEnvelope(first)).toBe(true);
  });

  it('changes digest when the operation class changes', () => {
    const row = rowFor(UPCAST_ROW_ID);
    const evidence = freshEvidenceFor(UPCAST_ROW_ID);
    const upcast = buildMigrationEnvelope(MANIFEST, row, 'UPCAST', evidence);
    const forced = buildMigrationEnvelope(MANIFEST, row, 'PIN', evidence);
    expect(upcast.envelopeDigest).not.toBe(forced.envelopeDigest);
  });

  it('rejects a tampered envelope digest', () => {
    const row = rowFor(UPCAST_ROW_ID);
    const evidence = freshEvidenceFor(UPCAST_ROW_ID);
    const envelope = buildMigrationEnvelope(MANIFEST, row, row.disposition, evidence);
    const tampered = { ...envelope, sourceDigest: digest('tampered') };
    expect(verifyMigrationEnvelope(tampered)).toBe(false);
  });

  it('builds a degenerate block envelope for a manifest-frozen BLOCK row', () => {
    const row = rowFor(BLOCK_ROW_ID);
    const envelope = buildBlockMigrationEnvelope(MANIFEST, row);
    expect(envelope.operationClass).toBe('BLOCK');
    expect(verifyMigrationEnvelope(envelope)).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. FRESHNESS BINDING
// ───────────────────────────────────────────────────────────────────

describe('evidenceMatchesFrozenRow', () => {
  it('accepts unchanged fresh evidence', () => {
    const row = rowFor(UPCAST_ROW_ID);
    expect(evidenceMatchesFrozenRow(row, freshEvidenceFor(UPCAST_ROW_ID))).toBe(true);
  });

  it('rejects drift in the state digest', () => {
    const row = rowFor(UPCAST_ROW_ID);
    const drifted = { ...freshEvidenceFor(UPCAST_ROW_ID), stateDigest: digest('drifted') };
    expect(evidenceMatchesFrozenRow(row, drifted)).toBe(false);
  });

  it('rejects drift in a verifier field the freshness digest does not cover', () => {
    const row = rowFor(FORK_ROW_ID);
    const base = freshEvidenceFor(FORK_ROW_ID);
    const drifted = { ...base, verifier: { ...base.verifier, parityCaseDigest: digest('drifted-parity') } };
    expect(evidenceMatchesFrozenRow(row, drifted)).toBe(false);
  });

  it('rejects drift in the proof itself', () => {
    const row = rowFor(UPCAST_ROW_ID);
    const base = freshEvidenceFor(UPCAST_ROW_ID);
    const drifted = { ...base, proof: { ...base.proof, sourceBytesDigest: digest('drifted-source') } as DispositionProof };
    expect(evidenceMatchesFrozenRow(row, drifted)).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. INTEGRITY BOUNDARY
// ───────────────────────────────────────────────────────────────────

describe('migration integrity helpers', () => {
  it('produces a deterministic snapshot digest', () => {
    const bundle = { a: 1, b: 'two' };
    expect(snapshotDigest(bundle)).toBe(snapshotDigest({ b: 'two', a: 1 }));
  });

  it('throws when a bundle no longer matches its recorded digest', () => {
    const bundle = { a: 1 };
    const recorded = snapshotDigest(bundle);
    expect(() => assertBundleMatchesDigest(recorded, { a: 2 }, {})).toThrow(InflightMigrationError);
  });

  it('hard-fails a corrupted stamped bundle instead of warning', () => {
    const stamped = stampForStorage({ a: 1 });
    const corrupted = { ...stamped, a: 2 };
    expect(() => assertStampedIntegrity(corrupted, {})).toThrow(InflightMigrationError);
    expect(() => assertStampedIntegrity(stamped, {})).not.toThrow();
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. DISPOSITION EXECUTORS (pure UPCAST / FORK / PIN / BLOCK)
// ───────────────────────────────────────────────────────────────────

describe('disposition executors', () => {
  const temporaryRoots: string[] = [];
  afterEach(() => {
    while (temporaryRoots.length > 0) {
      const root = temporaryRoots.pop();
      if (root) rmSync(root, { recursive: true, force: true });
    }
  });
  function temporaryRoot(label: string): string {
    const root = mkdtempSync(join(tmpdir(), `inflight-state-migration-${label}-`));
    temporaryRoots.push(root);
    return root;
  }

  it('executeUpcast writes a snapshot artifact and preserves source/effective digests', () => {
    const root = temporaryRoot('upcast');
    const row = rowFor(UPCAST_ROW_ID);
    const evidence = freshEvidenceFor(UPCAST_ROW_ID);
    const envelope = buildMigrationEnvelope(MANIFEST, row, row.disposition, evidence);
    const outcome = executeUpcast(envelope, evidence.proof, root);
    expect(outcome.sourceBytesDigest).toBe((evidence.proof as { sourceBytesDigest: string }).sourceBytesDigest);
    expect(existsSync(join(root, 'inflight-state-migration-v1', 'upcast-snapshots', `${envelope.migrationId}.json`))).toBe(true);
  });

  it('executeUpcast rejects a proof kind that does not match', () => {
    const root = temporaryRoot('upcast-mismatch');
    const row = rowFor(UPCAST_ROW_ID);
    const evidence = freshEvidenceFor(UPCAST_ROW_ID);
    const envelope = buildMigrationEnvelope(MANIFEST, row, row.disposition, evidence);
    expect(() => executeUpcast(envelope, proofFor(FORK_ROW_ID, 'FORK'), root)).toThrow(InflightMigrationError);
  });

  it('executeFork writes a dark artifact in an isolated namespace and never mutates the source', () => {
    const root = temporaryRoot('fork');
    const row = rowFor(FORK_ROW_ID);
    const evidence = freshEvidenceFor(FORK_ROW_ID);
    const envelope = buildMigrationEnvelope(MANIFEST, row, row.disposition, evidence);
    const outcome = executeFork(envelope, evidence.proof, evidence.verifier.parityCaseDigest ?? '', root);
    expect(outcome.executionNamespace).not.toBe(outcome.effectNamespace);
    const artifactPath = join(root, 'inflight-state-migration-v1', 'dark-forks', `${envelope.migrationId}.json`);
    expect(existsSync(artifactPath)).toBe(true);
    const artifact = JSON.parse(readFileSync(artifactPath, 'utf8')) as Record<string, unknown>;
    expect(artifact.shadowOnlySink).toBe(true);
  });

  it('executePin returns an admission outcome without writing any file', () => {
    const row = rowFor(PIN_ROW_ID);
    const evidence = freshEvidenceFor(PIN_ROW_ID);
    const envelope = buildMigrationEnvelope(MANIFEST, row, row.disposition, evidence);
    const outcome = executePin(envelope, evidence.proof);
    expect(outcome.terminalBoundary).toBe('legacy-terminal-receipt');
  });

  it('executeBlock is a pure veto with no side effects', () => {
    const outcome = executeBlock('drain first', 'POLICY_BLOCK');
    expect(outcome).toEqual({ kind: 'block', veto: 'drain first', blockReasonCode: 'POLICY_BLOCK' });
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. MIGRATE — fenced ledger checkpoint import
// ───────────────────────────────────────────────────────────────────

describe('MIGRATE ledger checkpoint import', () => {
  const temporaryRoots: string[] = [];
  afterEach(() => {
    while (temporaryRoots.length > 0) {
      const root = temporaryRoots.pop();
      if (root) rmSync(root, { recursive: true, force: true });
    }
  });
  function temporaryRoot(label: string): string {
    const root = mkdtempSync(join(tmpdir(), `inflight-state-migration-ledger-${label}-`));
    temporaryRoots.push(root);
    return root;
  }

  async function buildLedgerContext(
    rootDirectory: string,
    envelope: ReturnType<typeof buildMigrationEnvelope>,
    proof: DispositionProof,
  ): Promise<MigrationLedgerContext> {
    const registry = createInflightMigrationCheckpointEventRegistry();
    const policies = new TransitionPolicyRegistry([{
      policyId: 'inflight-migration-policy',
      policyVersion: 1,
      evaluatorVersion: '1',
      ruleIds: ['always-allow'],
      evaluate: (): PolicyEvaluationResult => (
        { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['always-allow'] }
      ),
    }]);
    const authority: AuthoritySnapshot = { state: 'legacy_authoritative', epoch: 1 };
    const ledger = new AppendOnlyLedger({
      rootDirectory,
      ledgerId: 'inflight-migration-domain',
      auditLedgerId: 'inflight-migration-audit',
      authorityProvider: () => authority,
    }, registry);
    const gateway = new TransitionAuthorizationGateway({
      rootDirectory,
      auditLedgerId: 'inflight-migration-audit',
      authorityProvider: () => authority,
    }, ledger, policies);

    const checkpointFacts = buildInflightMigrationCheckpointFacts(envelope, proof, '2026-08-09T00:05:00Z');
    const event = prepareInflightMigrationCheckpointEventWrite(checkpointFacts, {
      eventId: `checkpoint-${envelope.migrationId}`,
      streamId: `inflight-migration:${envelope.rowId}`,
      streamSequence: 1,
      occurredAt: '2026-08-09T00:05:00Z',
      recordedAt: '2026-08-09T00:05:00Z',
      producer: { name: 'inflight-state-migration-tests', version: '1' },
      authorityEpoch: authority.epoch,
      correlationId: `correlation-${envelope.migrationId}`,
      causationId: null,
      idempotencyKey: envelope.idempotencyKey,
    }, registry);

    const policy = policies.resolve('inflight-migration-policy', 1);
    const priorHead = await ledger.getVerifiedHead();
    const request: TransitionAuthorizationRequest = {
      requestId: `request-${envelope.migrationId}`,
      mode: 'research',
      event,
      priorHead,
      priorStateVersion: 'inflight-migration-state@1',
      priorStateFingerprint: sha256Bytes(canonicalBytes({ state: 'none' })),
      actorId: 'inflight-state-migration-tests',
      capabilityId: 'write',
      authorityEpoch: authority.epoch,
      policy: { policyId: policy.policyId, policyVersion: policy.policyVersion, policyDigest: policy.digest },
      evidenceDigest: sha256Bytes(canonicalBytes({ checkpointFacts } as never)),
    };
    const authorization = await gateway.authorize(request);
    if (authorization.verdict !== 'allow') throw new Error('expected allow');
    return { ledger, checkpointFacts, event, proof: authorization.proof };
  }

  it('appends exactly one checkpoint event through the fenced authorized-ledger seam', async () => {
    const root = temporaryRoot('append');
    const row = rowFor(MIGRATE_ROW_ID);
    const evidence = freshEvidenceFor(MIGRATE_ROW_ID);
    const envelope = buildMigrationEnvelope(MANIFEST, row, row.disposition, evidence);
    const ledgerContext = await buildLedgerContext(root, envelope, evidence.proof);
    const outcome = await executeMigrate(envelope, evidence.proof, ledgerContext);
    expect(outcome.ledgerEventId).toBe(`checkpoint-${envelope.migrationId}`);
    const events = await ledgerContext.ledger.readVerifiedEvents();
    expect(events).toHaveLength(1);
  });

  it('rejects ledger context facts that do not match the envelope and proof', async () => {
    const root = temporaryRoot('mismatch');
    const row = rowFor(MIGRATE_ROW_ID);
    const evidence = freshEvidenceFor(MIGRATE_ROW_ID);
    const envelope = buildMigrationEnvelope(MANIFEST, row, row.disposition, evidence);
    const ledgerContext = await buildLedgerContext(root, envelope, evidence.proof);
    const forged: MigrationLedgerContext = {
      ...ledgerContext,
      checkpointFacts: { ...ledgerContext.checkpointFacts, checkpointDigest: digest('forged') },
    };
    await expect(executeMigrate(envelope, evidence.proof, forged)).rejects.toThrow(InflightMigrationError);
  });

  it('refuses to append an event of a different type', async () => {
    const root = temporaryRoot('wrong-type');
    const row = rowFor(MIGRATE_ROW_ID);
    const evidence = freshEvidenceFor(MIGRATE_ROW_ID);
    const envelope = buildMigrationEnvelope(MANIFEST, row, row.disposition, evidence);
    const ledgerContext = await buildLedgerContext(root, envelope, evidence.proof);
    const forgedEvent = {
      ...ledgerContext.event,
      identity: { ...ledgerContext.event.identity, eventType: 'deep-loop-inflight-migration.ledger.something-else' },
    };
    await expect(appendInflightMigrationCheckpointEvent({
      ...ledgerContext,
      event: forgedEvent as never,
    })).rejects.toThrow(TypeError);
  });
});

// ───────────────────────────────────────────────────────────────────
// 7. COORDINATOR — end-to-end per disposition
// ───────────────────────────────────────────────────────────────────

describe('MigrationCoordinator.runRow', () => {
  const temporaryRoots: string[] = [];
  afterEach(() => {
    while (temporaryRoots.length > 0) {
      const root = temporaryRoots.pop();
      if (root) rmSync(root, { recursive: true, force: true });
    }
  });
  function temporaryRoot(label: string): string {
    const root = mkdtempSync(join(tmpdir(), `inflight-state-migration-coordinator-${label}-`));
    temporaryRoots.push(root);
    return root;
  }

  it('commits an UPCAST row and resumes idempotently without a second mutation', async () => {
    const root = temporaryRoot('upcast');
    const coordinator = new MigrationCoordinator({ rootDirectory: root });
    const row = rowFor(UPCAST_ROW_ID);
    const first = await coordinator.runRow({ manifest: MANIFEST, row, currentEvidence: freshEvidenceFor(UPCAST_ROW_ID) });
    expect(first.receipt.status).toBe(MigrationOperationStatuses.COMMITTED);
    expect(first.resumed).toBe(false);
    expect(verifyMigrationReceipt(first.receipt)).toBe(true);

    const second = await coordinator.runRow({ manifest: MANIFEST, row, currentEvidence: freshEvidenceFor(UPCAST_ROW_ID) });
    expect(second.resumed).toBe(true);
    expect(second.receipt.receiptDigest).toBe(first.receipt.receiptDigest);
  });

  it('commits a FORK row', async () => {
    const root = temporaryRoot('fork');
    const coordinator = new MigrationCoordinator({ rootDirectory: root });
    const row = rowFor(FORK_ROW_ID);
    const { receipt } = await coordinator.runRow({ manifest: MANIFEST, row, currentEvidence: freshEvidenceFor(FORK_ROW_ID) });
    expect(receipt.status).toBe(MigrationOperationStatuses.COMMITTED);
    expect(receipt.outcome?.kind).toBe('fork');
  });

  it('commits a PIN row', async () => {
    const root = temporaryRoot('pin');
    const coordinator = new MigrationCoordinator({ rootDirectory: root });
    const row = rowFor(PIN_ROW_ID);
    const { receipt } = await coordinator.runRow({ manifest: MANIFEST, row, currentEvidence: freshEvidenceFor(PIN_ROW_ID) });
    expect(receipt.status).toBe(MigrationOperationStatuses.COMMITTED);
    expect(receipt.outcome?.kind).toBe('pin');
  });

  it('blocks a manifest-frozen BLOCK row without acquiring a live fence mutation', async () => {
    const root = temporaryRoot('block');
    const coordinator = new MigrationCoordinator({ rootDirectory: root });
    const row = rowFor(BLOCK_ROW_ID);
    const { receipt } = await coordinator.runRow({ manifest: MANIFEST, row, currentEvidence: undefined });
    expect(receipt.status).toBe(MigrationOperationStatuses.BLOCKED);
    expect(receipt.outcome?.kind).toBe('block');
  });

  it('downgrades a live disposition to BLOCK when fresh evidence has drifted', async () => {
    const root = temporaryRoot('stale');
    const coordinator = new MigrationCoordinator({ rootDirectory: root });
    const row = rowFor(UPCAST_ROW_ID);
    const drifted = { ...freshEvidenceFor(UPCAST_ROW_ID), stateDigest: digest('drifted') };
    const { receipt } = await coordinator.runRow({ manifest: MANIFEST, row, currentEvidence: drifted });
    expect(receipt.status).toBe(MigrationOperationStatuses.BLOCKED);
    expect(receipt.reasonCode).toBe('CLASSIFICATION_STALE');
    expect(existsSync(join(root, 'inflight-state-migration-v1', 'upcast-snapshots', `${receipt.envelope.migrationId}.json`))).toBe(false);
  });

  it('blocks when fresh evidence is missing entirely', async () => {
    const root = temporaryRoot('missing-evidence');
    const coordinator = new MigrationCoordinator({ rootDirectory: root });
    const row = rowFor(UPCAST_ROW_ID);
    const { receipt } = await coordinator.runRow({ manifest: MANIFEST, row, currentEvidence: undefined });
    expect(receipt.status).toBe(MigrationOperationStatuses.BLOCKED);
    expect(receipt.reasonCode).toBe('MISSING_EVIDENCE');
  });

  it('rejects a MIGRATE row with no ledger context', async () => {
    const root = temporaryRoot('migrate-no-context');
    const coordinator = new MigrationCoordinator({ rootDirectory: root });
    const row = rowFor(MIGRATE_ROW_ID);
    await expect(coordinator.runRow({
      manifest: MANIFEST,
      row,
      currentEvidence: freshEvidenceFor(MIGRATE_ROW_ID),
    })).rejects.toThrow(InflightMigrationError);
  });

  it('resumes from operation_applied after a simulated crash without re-invoking the disposition executor', async () => {
    const root = temporaryRoot('crash-resume');
    const row = rowFor(UPCAST_ROW_ID);
    const evidence = freshEvidenceFor(UPCAST_ROW_ID);

    const crashing = new MigrationCoordinator({
      rootDirectory: root,
      faultInjection: {
        afterOperationAppliedBeforeCommit: () => {
          throw new Error('simulated process crash');
        },
      },
    });
    await expect(crashing.runRow({ manifest: MANIFEST, row, currentEvidence: evidence })).rejects.toThrow('simulated process crash');

    const pending = crashing.peekReceipt(MANIFEST.finalDigest, row.rowId);
    expect(pending?.status).toBe(MigrationOperationStatuses.OPERATION_APPLIED);

    // A fresh coordinator instance (simulating a new process) resumes and
    // completes without the disposition executor running a second time —
    // proven by never supplying a ledger context, which a live UPCAST
    // execution does not need but a second real invocation would still
    // succeed without; the real proof is the identical outcome digest.
    const resumed = new MigrationCoordinator({ rootDirectory: root });
    const completed = await resumed.runRow({ manifest: MANIFEST, row, currentEvidence: evidence });
    expect(completed.receipt.status).toBe(MigrationOperationStatuses.COMMITTED);
    expect(completed.receipt.outcome).toEqual(pending?.outcome);
  });

  it('resumes a crashed MIGRATE row from operation_applied without a second ledger append', async () => {
    const root = temporaryRoot('crash-resume-migrate');
    const row = rowFor(MIGRATE_ROW_ID);
    const evidence = freshEvidenceFor(MIGRATE_ROW_ID);
    const envelope = buildMigrationEnvelope(MANIFEST, row, row.disposition, evidence);

    const registry = createInflightMigrationCheckpointEventRegistry();
    const policies = new TransitionPolicyRegistry([{
      policyId: 'inflight-migration-crash-policy',
      policyVersion: 1,
      evaluatorVersion: '1',
      ruleIds: ['always-allow'],
      evaluate: (): PolicyEvaluationResult => (
        { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['always-allow'] }
      ),
    }]);
    const authority: AuthoritySnapshot = { state: 'legacy_authoritative', epoch: 1 };
    const ledger = new AppendOnlyLedger({
      rootDirectory: root,
      ledgerId: 'inflight-migration-crash-domain',
      auditLedgerId: 'inflight-migration-crash-audit',
      authorityProvider: () => authority,
    }, registry);
    const gateway = new TransitionAuthorizationGateway({
      rootDirectory: root,
      auditLedgerId: 'inflight-migration-crash-audit',
      authorityProvider: () => authority,
    }, ledger, policies);
    const checkpointFacts = buildInflightMigrationCheckpointFacts(envelope, evidence.proof, '2026-08-09T00:05:00Z');
    const event = prepareInflightMigrationCheckpointEventWrite(checkpointFacts, {
      eventId: `checkpoint-crash-${envelope.migrationId}`,
      streamId: `inflight-migration:${envelope.rowId}`,
      streamSequence: 1,
      occurredAt: '2026-08-09T00:05:00Z',
      recordedAt: '2026-08-09T00:05:00Z',
      producer: { name: 'inflight-state-migration-tests', version: '1' },
      authorityEpoch: authority.epoch,
      correlationId: randomUUID(),
      causationId: null,
      idempotencyKey: envelope.idempotencyKey,
    }, registry);
    const policy = policies.resolve('inflight-migration-crash-policy', 1);
    const priorHead = await ledger.getVerifiedHead();
    const authorization = await gateway.authorize({
      requestId: randomUUID(),
      mode: 'research',
      event,
      priorHead,
      priorStateVersion: 'inflight-migration-state@1',
      priorStateFingerprint: sha256Bytes(canonicalBytes({ state: 'none' })),
      actorId: 'inflight-state-migration-tests',
      capabilityId: 'write',
      authorityEpoch: authority.epoch,
      policy: { policyId: policy.policyId, policyVersion: policy.policyVersion, policyDigest: policy.digest },
      evidenceDigest: sha256Bytes(canonicalBytes({ checkpointFacts } as never)),
    });
    if (authorization.verdict !== 'allow') throw new Error('expected allow');
    const ledgerContext: MigrationLedgerContext = { ledger, checkpointFacts, event, proof: authorization.proof };

    const crashing = new MigrationCoordinator({
      rootDirectory: root,
      faultInjection: {
        afterOperationAppliedBeforeCommit: () => {
          throw new Error('simulated process crash');
        },
      },
    });
    await expect(crashing.runRow({
      manifest: MANIFEST, row, currentEvidence: evidence, ledgerContext,
    })).rejects.toThrow('simulated process crash');
    expect(await ledger.readVerifiedEvents()).toHaveLength(1);

    const resumed = new MigrationCoordinator({ rootDirectory: root });
    const completed = await resumed.runRow({ manifest: MANIFEST, row, currentEvidence: evidence });
    expect(completed.receipt.status).toBe(MigrationOperationStatuses.COMMITTED);
    expect(await ledger.readVerifiedEvents()).toHaveLength(1);
  });
});

// ───────────────────────────────────────────────────────────────────
// 8. SUCCESSOR HANDOFF
// ───────────────────────────────────────────────────────────────────

describe('inflight migration handoff', () => {
  const temporaryRoots: string[] = [];
  afterEach(() => {
    while (temporaryRoots.length > 0) {
      const root = temporaryRoots.pop();
      if (root) rmSync(root, { recursive: true, force: true });
    }
  });
  function temporaryRoot(label: string): string {
    const root = mkdtempSync(join(tmpdir(), `inflight-state-migration-handoff-${label}-`));
    temporaryRoots.push(root);
    return root;
  }

  async function runAllRowsToTerminal(root: string): Promise<Map<string, MigrationReceipt>> {
    const coordinator = new MigrationCoordinator({ rootDirectory: root });
    const receipts = new Map<string, MigrationReceipt>();
    for (const row of MANIFEST.rows) {
      // MIGRATE rows require a live ledger context this fixture does not
      // build per-row; omitting evidence forces a safe BLOCK outcome so
      // every row (including MIGRATE) still reaches a terminal receipt.
      const evidence = row.disposition === InflightDisposition.BLOCK
        || row.disposition === InflightDisposition.MIGRATE
        ? undefined
        : freshEvidenceFor(row.rowId);
      const { receipt } = await coordinator.runRow({ manifest: MANIFEST, row, currentEvidence: evidence });
      receipts.set(row.rowId, receipt);
    }
    return receipts;
  }

  it('rejects a handoff missing a receipt for one manifest row', () => {
    expect(() => buildInflightMigrationHandoff(MANIFEST, new Map())).toThrow(InflightMigrationError);
  });

  it('builds and verifies a handoff once every row has a terminal receipt', async () => {
    const receipts = await runAllRowsToTerminal(temporaryRoot('handoff'));
    const handoff = buildInflightMigrationHandoff(MANIFEST, receipts);
    expect(handoff.closure.totalRows).toBe(MANIFEST.rows.length);
    expect(handoff.closure.unsafeCommittedRows).toBe(0);
    expect(verifyInflightMigrationHandoff(MANIFEST, handoff)).toBe(true);
  });

  it('rejects a tampered handoff digest', async () => {
    const receipts = await runAllRowsToTerminal(temporaryRoot('handoff-tamper'));
    const handoff = buildInflightMigrationHandoff(MANIFEST, receipts);
    const tampered = { ...handoff, finalDigest: digest('tampered') };
    expect(verifyInflightMigrationHandoff(MANIFEST, tampered)).toBe(false);
  });

  it('rejects a handoff row whose disposition was forged away from the manifest', async () => {
    const receipts = await runAllRowsToTerminal(temporaryRoot('handoff-disposition-forge'));
    const handoff = buildInflightMigrationHandoff(MANIFEST, receipts);
    // A row the manifest froze as MIGRATE that vetoed to a terminal BLOCKED
    // receipt is a genuine unresolved block. Relabeling only its handoff
    // disposition to BLOCK (and recomputing the digest over the tampered core)
    // must not let it masquerade as a legitimate permanent-legacy pin.
    const migrateRowId = MANIFEST.rows.find(
      (row) => row.disposition === InflightDisposition.MIGRATE,
    )?.rowId;
    expect(migrateRowId).toBeDefined();
    const target = handoff.rows.find((row) => row.rowId === migrateRowId);
    expect(target?.status).toBe(MigrationOperationStatuses.BLOCKED);
    expect(target?.disposition).toBe(InflightDisposition.MIGRATE);
    const forgedRows = handoff.rows.map((row) =>
      row.rowId === migrateRowId ? { ...row, disposition: InflightDisposition.BLOCK } : row,
    );
    const forgedCore = {
      handoffVersion: handoff.handoffVersion,
      classificationManifestDigest: handoff.classificationManifestDigest,
      rows: forgedRows,
      blockedRowIds: handoff.blockedRowIds,
      pinnedRowIds: handoff.pinnedRowIds,
      closure: handoff.closure,
    };
    const forged = { ...forgedCore, finalDigest: sha256Bytes(canonicalBytes(forgedCore as never)) };
    expect(verifyInflightMigrationHandoff(MANIFEST, forged)).toBe(false);
  });
});
