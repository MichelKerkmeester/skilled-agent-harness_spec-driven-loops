// ───────────────────────────────────────────────────────────────────
// MODULE: Contradiction and Supersession Tests
// ───────────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildSync } from 'esbuild';
import { afterEach, describe, expect, it } from 'vitest';

import {
  TransitionAuthorizationGateway,
  readAuthorizationAudit,
} from '../../lib/authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  CLAIM_RELATIONSHIP_CAPABILITY,
  CLAIM_RELATIONSHIP_EVENT_VERSION,
  CLAIM_RELATIONSHIP_MODE,
  CLAIM_RELATIONSHIP_POLICY_ID,
  CLAIM_RELATIONSHIP_POLICY_VERSION,
  ClaimRelationshipErrorCodes,
  ContradictionSupersessionService,
  RelationshipEventTypes,
  auditClaimRelationships,
  createClaimRelationshipPolicyRegistry,
  createContradictionCandidate,
  createSupersessionCandidate,
  replayClaimRelationships,
  relationshipPayload,
} from '../../lib/contradiction-supersession/index.js';

import type {
  AuthoritySnapshot,
  LedgerRecordFrame,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  ContradictionCandidate,
  ContradictionSupersessionServiceOptions,
  RelationshipCandidate,
  RelationshipEvidenceRef,
  RelationshipRecordInput,
  RelationshipReferenceSnapshot,
} from '../../lib/contradiction-supersession/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-21T12:00:00.000Z';
const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 7 });
const LEDGER_ID = 'relationship-test-ledger';
const AUDIT_LEDGER_ID = 'relationship-test-audit';
const STREAM_ID = 'relationship-test-stream';
const temporaryRoots: string[] = [];

function digest(label: string): string {
  return sha256Bytes(canonicalBytes({ label }));
}

const SNAPSHOT: RelationshipReferenceSnapshot = Object.freeze({
  snapshot_ref: 'snapshot-claims-v1',
  claim_ids: ['claim-a', 'claim-b', 'claim-c', 'claim-d'],
  evidence_records: [
    { evidence_id: 'evidence-1', locator: 'ledger://evidence/1', digest: digest('evidence-1') },
    { evidence_id: 'evidence-2', locator: 'ledger://evidence/2', digest: digest('evidence-2') },
    { evidence_id: 'evidence-3', locator: 'ledger://evidence/3', digest: digest('evidence-3') },
  ],
});

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `claim-relationships-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function service(rootDirectory = temporaryRoot('case')): ContradictionSupersessionService {
  const options: ContradictionSupersessionServiceOptions = {
    rootDirectory,
    referenceSnapshot: SNAPSHOT,
    ledgerId: LEDGER_ID,
    auditLedgerId: AUDIT_LEDGER_ID,
    streamId: STREAM_ID,
    authorityProvider: () => AUTHORITY,
    now: () => new Date(TIMESTAMP),
  };
  return new ContradictionSupersessionService(options);
}

function evidence(
  evidenceId = 'evidence-1',
  position: RelationshipEvidenceRef['position'] = 'supporting',
): RelationshipEvidenceRef {
  const record = SNAPSHOT.evidence_records.find((entry) => entry.evidence_id === evidenceId);
  if (!record) {
    return {
      evidence_id: evidenceId,
      locator: `ledger://evidence/${evidenceId}`,
      digest: digest(evidenceId),
      position,
    };
  }
  return { ...record, position };
}

function contradiction(
  first = 'claim-a',
  second = 'claim-b',
  evidenceRefs: readonly RelationshipEvidenceRef[] = [evidence()],
): ContradictionCandidate {
  return createContradictionCandidate({
    observedClaimId: first,
    counterpartClaimId: second,
    incompatibilityScope: 'same factual proposition',
    semanticCommunityIds: ['community-facts'],
    evidenceRefs,
    provenanceRefs: ['source-primary'],
    independenceRefs: ['independent-origin-1'],
    detectorVersion: 'detector@1',
    evidenceSnapshotRef: SNAPSHOT.snapshot_ref,
  });
}

function supersession(
  predecessor: string,
  successor: string,
): RelationshipCandidate {
  return createSupersessionCandidate({
    predecessorClaimId: predecessor,
    successorClaimId: successor,
    replacementScope: 'same factual proposition',
    strengthRationale: 'Later evidence resolves the predecessor claim.',
    semanticCommunityIds: ['community-facts'],
    evidenceRefs: [evidence('evidence-3', 'supporting')],
    provenanceRefs: ['source-primary'],
    independenceRefs: ['independent-origin-2'],
    detectorVersion: 'detector@1',
    evidenceSnapshotRef: SNAPSHOT.snapshot_ref,
  });
}

function recordInput(
  candidate: RelationshipCandidate,
  index: number,
  overrides: Readonly<Partial<RelationshipRecordInput>> = {},
): RelationshipRecordInput {
  return {
    candidate,
    action: 'assert',
    eventId: `relationship-event-${index}`,
    requestId: `relationship-request-${index}`,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    correlationId: 'relationship-correlation',
    causationId: index === 1 ? null : `relationship-event-${index - 1}`,
    idempotencyKey: `relationship-idempotency-${index}`,
    actorId: 'relationship-test-actor',
    ...overrides,
  };
}

async function appendWithoutDomainValidation(
  target: ContradictionSupersessionService,
  rootDirectory: string,
  candidate: RelationshipCandidate,
  index: number,
): Promise<void> {
  const policies = createClaimRelationshipPolicyRegistry();
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider: () => AUTHORITY,
    now: () => new Date(TIMESTAMP),
  }, target.ledger, policies);
  const head = await target.ledger.getVerifiedHead();
  const payload = relationshipPayload(candidate, 'assert');
  const event = prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: `raw-relationship-event-${index}`,
    event_type: candidate.kind === 'CONTRADICTION'
      ? RelationshipEventTypes.CONTRADICTION_RECORDED
      : RelationshipEventTypes.SUPERSESSION_RECORDED,
    event_version: CLAIM_RELATIONSHIP_EVENT_VERSION,
    stream_id: STREAM_ID,
    stream_sequence: head.sequence + 1,
    occurred_at: TIMESTAMP,
    recorded_at: TIMESTAMP,
    producer: { name: 'raw-invalid-fixture', version: '1' },
    authority_epoch: AUTHORITY.epoch,
    correlation_id: 'raw-invalid-fixture',
    causation_id: head.sequence === 0 ? null : `raw-relationship-event-${index - 1}`,
    idempotency_key: `raw-invalid-idempotency-${index}`,
    payload,
  }, target.eventRegistry);
  const policy = policies.resolve(
    CLAIM_RELATIONSHIP_POLICY_ID,
    CLAIM_RELATIONSHIP_POLICY_VERSION,
  );
  const request: TransitionAuthorizationRequest = {
    requestId: `raw-relationship-request-${index}`,
    mode: CLAIM_RELATIONSHIP_MODE,
    event,
    priorHead: head,
    priorStateVersion: 'raw-invalid-state@1',
    priorStateFingerprint: digest(`raw-state-${index}`),
    actorId: 'raw-invalid-fixture',
    capabilityId: CLAIM_RELATIONSHIP_CAPABILITY,
    authorityEpoch: AUTHORITY.epoch,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: digest(`raw-evidence-${index}`),
  };
  const authorization = await gateway.authorize(request);
  expect(authorization.verdict).toBe('allow');
  if (authorization.verdict !== 'allow') throw new Error(authorization.reasonCode);
  await target.ledger.appendAuthorized(event, authorization.proof);
}

function framePath(rootDirectory: string, sequence: number): string {
  return join(
    rootDirectory,
    LEDGER_ID,
    'frames',
    `${String(sequence).padStart(16, '0')}.frame`,
  );
}

function replayProjectionInChildProcess(rootDirectory: string): string {
  const entryPath = join(rootDirectory, 'replay-child.ts');
  const bundlePath = join(rootDirectory, 'replay-child.mjs');
  const relationshipModule = fileURLToPath(new URL(
    '../../lib/contradiction-supersession/index.ts',
    import.meta.url,
  ));
  const ledgerModule = fileURLToPath(new URL(
    '../../lib/authorized-ledger/index.ts',
    import.meta.url,
  ));
  writeFileSync(entryPath, [
    `import { AppendOnlyLedger } from ${JSON.stringify(ledgerModule)};`,
    `import { createClaimRelationshipEventRegistry, replayClaimRelationships } from ${JSON.stringify(relationshipModule)};`,
    `const snapshot = JSON.parse(Buffer.from(process.argv[2], 'base64').toString('utf8'));`,
    `const rootDirectory = process.argv[3];`,
    `const registry = createClaimRelationshipEventRegistry();`,
    `const ledger = new AppendOnlyLedger({`,
    `  rootDirectory,`,
    `  ledgerId: ${JSON.stringify(LEDGER_ID)},`,
    `  auditLedgerId: ${JSON.stringify(AUDIT_LEDGER_ID)},`,
    `  authorityProvider: () => ({ state: 'shadowing', epoch: ${String(AUTHORITY.epoch)} }),`,
    `}, registry);`,
    `const result = await replayClaimRelationships({`,
    `  ledger,`,
    `  eventRegistry: registry,`,
    `  referenceSnapshot: snapshot,`,
    `  runId: 'relationship-replay-success',`,
    `});`,
    `if (!result.ok) throw new Error(result.failure.message);`,
    `process.stdout.write(Buffer.from(result.fingerprint.projection.canonicalBytes).toString('base64'));`,
  ].join('\n'));
  buildSync({
    entryPoints: [entryPath],
    outfile: bundlePath,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node22',
    logLevel: 'silent',
  });
  const snapshotBase64 = Buffer.from(JSON.stringify(SNAPSHOT)).toString('base64');
  const child = spawnSync(process.execPath, [bundlePath, snapshotBase64, rootDirectory], {
    encoding: 'utf8',
    env: {
      ...process.env,
      LANG: 'tr_TR.UTF-8',
      LC_ALL: 'tr_TR.UTF-8',
    },
  });
  if (child.status !== 0) throw new Error(child.stderr || 'Cross-process replay failed');
  return child.stdout;
}

afterEach(() => {
  while (temporaryRoots.length > 0) {
    rmSync(temporaryRoots.pop() as string, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 2. CANDIDATES AND CANONICAL IDENTITIES
// ───────────────────────────────────────────────────────────────────

describe('contradiction and supersession events', () => {
  it('keeps detector candidates inert until authorization and durable append', async () => {
    const target = service();
    const candidate = contradiction('claim-b', 'claim-a');

    expect(candidate).toMatchObject({
      leftClaimId: 'claim-a',
      rightClaimId: 'claim-b',
      semanticCommunityIds: ['community-facts'],
      evidenceRefs: [evidence()],
      provenanceRefs: ['source-primary'],
      independenceRefs: ['independent-origin-1'],
      detectorVersion: 'detector@1',
      evidenceSnapshotRef: SNAPSHOT.snapshot_ref,
    });
    expect((await target.ledger.getVerifiedHead()).sequence).toBe(0);
    expect((await target.projection()).active_relationships).toEqual([]);
    expect((await target.projection()).claims['claim-a'].status).toBe('active');
  });

  it('keeps a candidate inert when the authorization epoch changes before append', async () => {
    const root = temporaryRoot('authorization-denied');
    let authorityRead = 0;
    const target = new ContradictionSupersessionService({
      rootDirectory: root,
      referenceSnapshot: SNAPSHOT,
      ledgerId: LEDGER_ID,
      auditLedgerId: AUDIT_LEDGER_ID,
      streamId: STREAM_ID,
      authorityProvider: () => ({
        state: 'shadowing',
        epoch: authorityRead++ === 0 ? AUTHORITY.epoch : AUTHORITY.epoch + 1,
      }),
      now: () => new Date(TIMESTAMP),
    });

    await expect(target.record(recordInput(contradiction(), 1))).rejects.toMatchObject({
      code: ClaimRelationshipErrorCodes.AUTHORIZATION_DENIED,
    });
    expect((await target.ledger.getVerifiedHead()).sequence).toBe(0);
    expect((await target.projection()).claims['claim-a'].status).toBe('active');
  });

  it('canonicalizes symmetric contradictions while preserving supersession direction', () => {
    const forward = contradiction('claim-a', 'claim-b');
    const reverseObservation = contradiction('claim-b', 'claim-a');
    const replaces = supersession('claim-a', 'claim-b');
    const reverseReplacement = supersession('claim-b', 'claim-a');

    expect(reverseObservation.relationshipId).toBe(forward.relationshipId);
    expect(reverseObservation.leftClaimId).toBe(forward.leftClaimId);
    expect(reverseObservation.rightClaimId).toBe(forward.rightClaimId);
    expect(reverseReplacement.relationshipId).not.toBe(replaces.relationshipId);
  });

  // ─────────────────────────────────────────────────────────────────
  // 3. ASSERTION, WITHDRAWAL, AND STATUS
  // ─────────────────────────────────────────────────────────────────

  it('projects one canonical contradiction with typed counterparts and evidence state', async () => {
    const target = service();
    const candidate = contradiction('claim-a', 'claim-b', [
      evidence('evidence-1', 'supporting'),
      evidence('evidence-2', 'refuting'),
    ]);
    const recorded = await target.record(recordInput(candidate, 1));

    expect(recorded.projection.authority_mode).toBe('additive-dark');
    expect(recorded.projection.canonical_active_contradiction_count).toBe(1);
    expect(recorded.projection.claims['claim-a']).toMatchObject({
      status: 'contested',
      active_contradiction_relation_ids: [candidate.relationshipId],
      contradiction_counterpart_claim_ids: ['claim-b'],
    });
    expect(recorded.projection.claims['claim-a'].evidence_state[0].evidence_refs)
      .toEqual(candidate.evidenceRefs);
  });

  it('withdraws by prior event identity without deleting assertion or evidence history', async () => {
    const target = service();
    const candidate = contradiction();
    await target.record(recordInput(candidate, 1));
    const withdrawn = await target.record(recordInput(candidate, 2, {
      action: 'withdraw',
      retractsEventId: 'relationship-event-1',
    }));

    expect(withdrawn.projection.canonical_active_contradiction_count).toBe(0);
    expect(withdrawn.projection.claims['claim-a'].status).toBe('active');
    expect(withdrawn.projection.history).toHaveLength(1);
    expect(withdrawn.projection.history[0]).toMatchObject({
      assertion_event_id: 'relationship-event-1',
      withdrawal_event_id: 'relationship-event-2',
    });
    expect(withdrawn.projection.history[0].evidence_state.assertion_evidence_refs)
      .toEqual(candidate.evidenceRefs);
    expect(withdrawn.projection.history[0].evidence_state.withdrawal_evidence_refs)
      .toEqual(candidate.evidenceRefs);
    expect((await target.ledger.readVerifiedEvents())).toHaveLength(2);
  });

  it('withdraws a directional supersession without reversing or deleting its history', async () => {
    const target = service();
    const candidate = supersession('claim-a', 'claim-b');
    await target.record(recordInput(candidate, 1));
    const withdrawn = await target.record(recordInput(candidate, 2, {
      action: 'withdraw',
      retractsEventId: 'relationship-event-1',
    }));

    expect(withdrawn.projection.claims['claim-a'].status).toBe('active');
    expect(withdrawn.projection.claims['claim-b'].predecessor_claim_ids).toEqual([]);
    expect(withdrawn.projection.history[0]).toMatchObject({
      kind: 'SUPERSESSION',
      source_claim_id: 'claim-a',
      counterpart_claim_id: 'claim-b',
      withdrawal_event_id: 'relationship-event-2',
    });
  });

  it('returns the original receipt on exact retry and rejects changed bytes under the same event id', async () => {
    const target = service();
    const input = recordInput(contradiction(), 1);
    const first = await target.record(input);
    const repeated = await target.record(input);

    expect(repeated.receipt).toEqual(first.receipt);
    expect((await target.ledger.getVerifiedHead()).sequence).toBe(1);
    await expect(target.record({
      ...input,
      correlationId: 'changed-canonical-content',
    })).rejects.toMatchObject({ code: ClaimRelationshipErrorCodes.EVENT_ID_CONFLICT });
    expect((await target.ledger.getVerifiedHead()).sequence).toBe(1);
  });

  it('rejects missing references, self-relations, and non-canonical pairs before append', async () => {
    const missingTarget = service();
    const missingClaim = contradiction('claim-a', 'claim-unknown');
    await expect(missingTarget.record(recordInput(missingClaim, 1))).rejects.toMatchObject({
      code: ClaimRelationshipErrorCodes.REFERENCE_MISSING,
    });
    expect((await missingTarget.ledger.getVerifiedHead()).sequence).toBe(0);

    const missingEvidenceTarget = service();
    const missingEvidence = contradiction('claim-a', 'claim-b', [evidence('evidence-unknown')]);
    await expect(missingEvidenceTarget.record(recordInput(missingEvidence, 1))).rejects.toMatchObject({
      code: ClaimRelationshipErrorCodes.REFERENCE_MISSING,
    });
    expect((await missingEvidenceTarget.ledger.getVerifiedHead()).sequence).toBe(0);

    expect(() => contradiction('claim-a', 'claim-a')).toThrowError(
      expect.objectContaining({ code: ClaimRelationshipErrorCodes.SELF_RELATION }),
    );
    expect(() => supersession('claim-a', 'claim-a')).toThrowError(
      expect.objectContaining({ code: ClaimRelationshipErrorCodes.SELF_RELATION }),
    );

    const nonCanonicalTarget = service();
    const canonical = contradiction();
    const nonCanonical = {
      ...canonical,
      leftClaimId: canonical.rightClaimId,
      rightClaimId: canonical.leftClaimId,
    } as ContradictionCandidate;
    await expect(nonCanonicalTarget.record(recordInput(nonCanonical, 1))).rejects.toBeDefined();
    expect((await nonCanonicalTarget.ledger.getVerifiedHead()).sequence).toBe(0);
  });

  it('rejects an absent withdrawal target before authorization or sequence allocation', async () => {
    const root = temporaryRoot('ambiguous-withdrawal');
    const target = service(root);
    await expect(target.record(recordInput(contradiction(), 1, {
      action: 'withdraw',
      retractsEventId: 'missing-assertion',
    }))).rejects.toMatchObject({ code: ClaimRelationshipErrorCodes.AMBIGUOUS_WITHDRAWAL });

    expect((await target.ledger.getVerifiedHead()).sequence).toBe(0);
    expect((await readAuthorizationAudit(root, AUDIT_LEDGER_ID)).head.sequence).toBe(0);
  });

  // ─────────────────────────────────────────────────────────────────
  // 4. DIRECTIONAL GRAPH AND PRECEDENCE
  // ─────────────────────────────────────────────────────────────────

  it('folds directional supersession chains without reversing predecessor semantics', async () => {
    const target = service();
    await target.record(recordInput(supersession('claim-a', 'claim-b'), 1));
    const result = await target.record(recordInput(supersession('claim-b', 'claim-c'), 2));

    expect(result.projection.claims['claim-a']).toMatchObject({
      status: 'superseded',
      successor_claim_ids: ['claim-b'],
      terminal_successor_claim_id: 'claim-c',
    });
    expect(result.projection.claims['claim-b']).toMatchObject({
      status: 'superseded',
      predecessor_claim_ids: ['claim-a'],
      successor_claim_ids: ['claim-c'],
      terminal_successor_claim_id: 'claim-c',
    });
    expect(result.projection.claims['claim-c']).toMatchObject({
      status: 'active',
      predecessor_claim_ids: ['claim-b'],
      terminal_successor_claim_id: null,
    });
  });

  it('gives supersession precedence without erasing active contradiction evidence', async () => {
    const target = service();
    const contradictionCandidate = contradiction('claim-a', 'claim-c', [
      evidence('evidence-1', 'supporting'),
      evidence('evidence-2', 'refuting'),
    ]);
    await target.record(recordInput(contradictionCandidate, 1));
    const result = await target.record(recordInput(supersession('claim-a', 'claim-b'), 2));

    expect(result.projection.claims['claim-a'].status).toBe('superseded');
    expect(result.projection.claims['claim-a'].active_contradiction_relation_ids)
      .toEqual([contradictionCandidate.relationshipId]);
    expect(result.projection.claims['claim-a'].evidence_state).toHaveLength(2);
    expect(result.projection.claims['claim-c'].status).toBe('contested');
    expect(result.projection.canonical_active_contradiction_count).toBe(1);
  });

  it('rejects competing active successors before append', async () => {
    const root = temporaryRoot('competing');
    const target = service(root);
    await target.record(recordInput(supersession('claim-a', 'claim-b'), 1));
    await expect(target.record(recordInput(supersession('claim-a', 'claim-c'), 2)))
      .rejects.toMatchObject({ code: ClaimRelationshipErrorCodes.COMPETING_SUCCESSOR });

    expect((await target.ledger.getVerifiedHead()).sequence).toBe(1);
    expect((await readAuthorizationAudit(root, AUDIT_LEDGER_ID)).head.sequence).toBe(1);
  });

  it('rejects a supersession cycle before append', async () => {
    const root = temporaryRoot('cycle');
    const target = service(root);
    await target.record(recordInput(supersession('claim-a', 'claim-b'), 1));
    await target.record(recordInput(supersession('claim-b', 'claim-c'), 2));
    await expect(target.record(recordInput(supersession('claim-c', 'claim-a'), 3)))
      .rejects.toMatchObject({ code: ClaimRelationshipErrorCodes.SUPERSESSION_CYCLE });

    expect((await target.ledger.getVerifiedHead()).sequence).toBe(2);
    expect((await readAuthorizationAudit(root, AUDIT_LEDGER_ID)).head.sequence).toBe(2);
  });

  // ─────────────────────────────────────────────────────────────────
  // 5. REPLAY AND CORRUPTION
  // ─────────────────────────────────────────────────────────────────

  it('binds successful replay to verified bytes, authorization, reducer, and reference inputs', async () => {
    const root = temporaryRoot('replay-success');
    const target = service(root);
    await target.record(recordInput(contradiction(), 1));
    const result = await replayClaimRelationships({
      ledger: target.ledger,
      eventRegistry: target.eventRegistry,
      referenceSnapshot: SNAPSHOT,
      runId: 'relationship-replay-success',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.failure.message);
    expect(result.projection.claims['claim-a'].status).toBe('contested');
    expect(result.fingerprint.descriptor.event_count).toBe(1);
    expect(Object.keys(result.fingerprint.descriptor.replay_input_digests).sort())
      .toEqual(['initial_state', 'reference_snapshot']);

    const repeated = await replayClaimRelationships({
      ledger: target.ledger,
      eventRegistry: target.eventRegistry,
      referenceSnapshot: SNAPSHOT,
      runId: 'relationship-replay-success',
    });
    expect(repeated.ok).toBe(true);
    if (!repeated.ok) throw new Error(repeated.failure.message);
    expect(repeated.fingerprint.descriptorBytes).toEqual(result.fingerprint.descriptorBytes);
    expect(replayProjectionInChildProcess(root)).toBe(
      Buffer.from(result.fingerprint.projection.canonicalBytes).toString('base64'),
    );

    const audit = await auditClaimRelationships({
      ledger: target.ledger,
      eventRegistry: target.eventRegistry,
      referenceSnapshot: SNAPSHOT,
      runId: 'relationship-replay-success',
    });
    expect(audit.ok).toBe(true);
    if (!audit.ok) throw new Error(audit.failure.message);
    expect(audit.report.records[0]).toMatchObject({
      event_id: 'relationship-event-1',
      ledger_sequence: 1,
      relation_action: 'assert',
      detector_version: 'detector@1',
      reducer_version: 'claim-relationships@1',
      authorization_reference: {
        audit_ledger_id: AUDIT_LEDGER_ID,
        authority_epoch: AUTHORITY.epoch,
      },
    });
    expect(audit.report.replay_fingerprint).toBe(result.fingerprint.descriptor.final_digest);
  });

  it('reports the earliest invalid stored cycle and returns no trusted projection', async () => {
    const root = temporaryRoot('stored-cycle');
    const target = service(root);
    await appendWithoutDomainValidation(target, root, supersession('claim-a', 'claim-b'), 1);
    await appendWithoutDomainValidation(target, root, supersession('claim-b', 'claim-a'), 2);
    const result = await replayClaimRelationships({
      ledger: target.ledger,
      eventRegistry: target.eventRegistry,
      referenceSnapshot: SNAPSHOT,
      runId: 'relationship-replay-cycle',
    });

    expect(result).toMatchObject({
      ok: false,
      trusted: false,
      projection: null,
      fingerprint: null,
      failure: {
        code: ClaimRelationshipErrorCodes.SUPERSESSION_CYCLE,
        sequence: 2,
        eventId: 'raw-relationship-event-2',
      },
    });
  });

  it('fails closed on fingerprint mismatch and stored-frame corruption', async () => {
    const root = temporaryRoot('corruption');
    const target = service(root);
    await target.record(recordInput(contradiction(), 1));

    const mismatch = await replayClaimRelationships({
      ledger: target.ledger,
      eventRegistry: target.eventRegistry,
      referenceSnapshot: SNAPSHOT,
      runId: 'relationship-replay-mismatch',
      expectedFinalDigest: 'f'.repeat(64),
    });
    expect(mismatch).toMatchObject({
      ok: false,
      trusted: false,
      projection: null,
      fingerprint: null,
      failure: { code: ClaimRelationshipErrorCodes.FINGERPRINT_MISMATCH },
    });

    const path = framePath(root, 1);
    const frame = JSON.parse(readFileSync(path, 'utf8')) as LedgerRecordFrame;
    writeFileSync(path, `${JSON.stringify({ ...frame, record_hash: '0'.repeat(64) })}\n`);
    const corrupt = await replayClaimRelationships({
      ledger: target.ledger,
      eventRegistry: target.eventRegistry,
      referenceSnapshot: SNAPSHOT,
      runId: 'relationship-replay-corrupt',
    });
    expect(corrupt).toMatchObject({
      ok: false,
      trusted: false,
      projection: null,
      fingerprint: null,
    });
  });
});
