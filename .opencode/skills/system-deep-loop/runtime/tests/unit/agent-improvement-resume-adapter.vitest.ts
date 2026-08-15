import {
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
} from '../../lib/authorized-ledger/index.js';
import {
  createAgentImprovementEventRegistry,
  prepareAgentImprovementEvent,
} from '../../lib/agent-improvement-ledger-schema/index.js';
import {
  AGENT_IMPROVEMENT_PROJECTION_CODEC_VERSION,
  AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
  AGENT_IMPROVEMENT_REDUCER_VERSION,
  foldAgentImprovementEvents,
} from '../../lib/agent-improvement-reducers/index.js';
import {
  AGENT_IMPROVEMENT_CONTINUITY_LADDER,
  AGENT_IMPROVEMENT_RESUME_ADAPTER_VERSION,
  AgentImprovementResumeAdapter,
  agentImprovementMigrationRegistryDigest,
  agentImprovementResumeFingerprintDigest,
  parseAgentImprovementMigrationRegistry,
  parseAgentImprovementResumeRequest,
} from '../../lib/agent-improvement-resume-adapter/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_LEDGER_ID,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from '../fixtures/authorized-ledger-fixtures.js';

import type {
  AgentImprovementEventInput,
  AgentImprovementLedgerEvent,
} from '../../lib/agent-improvement-ledger-schema/index.js';
import type {
  AgentImprovementProjectionCheckpoint,
} from '../../lib/agent-improvement-reducers/index.js';
import type {
  AgentImprovementMigrationRegistry,
  AgentImprovementResumeAdapterOptions,
  AgentImprovementResumeComponentFact,
  AgentImprovementResumeFingerprint,
} from '../../lib/agent-improvement-resume-adapter/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';
import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

// The mode adapter preserves the common decision and effect objects verbatim.
// Running the owning contract suite keeps that delegated trust boundary live.
import './deep-improvement-common-resume-adapter.vitest.js';

const TIMESTAMP = '2026-07-28T10:00:00.000Z';
const RUN_ID = 'agent-improvement-resume-run';
const LINEAGE_ID = 'agent-improvement-lineage';
const STREAM_ID = 'agent-improvement-resume-stream';
const ZERO_DIGEST = '0'.repeat(64);
const temporaryRoots: string[] = [];

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function temporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'agent-improvement-resume-'));
  temporaryRoots.push(root);
  return root;
}

function currentInputs(): readonly AgentImprovementResumeComponentFact[] {
  return Object.freeze([
    ['tool', 'tool@1'],
    ['model', 'model@1'],
    ['policy', 'policy@1'],
    ['target', 'target@1'],
    ['schema', 'schema@1'],
    ['agent-ir', 'agent-ir@1'],
    ['change-contract', 'change-contract@1'],
    ['mutation-operator', 'mutation-operator@1'],
    ['behavior-manifest', 'behavior-manifest@1'],
    ['evaluator', 'evaluator@1'],
    ['executor', 'executor@1'],
    ['profile', 'profile@1'],
    ['topology', 'topology@1'],
    ['upcaster', 'upcaster@1'],
    ['reducer', AGENT_IMPROVEMENT_REDUCER_VERSION],
    ['adapter', AGENT_IMPROVEMENT_RESUME_ADAPTER_VERSION],
    ['codec', AGENT_IMPROVEMENT_PROJECTION_CODEC_VERSION],
  ].map(([component, version]) => Object.freeze({
    component,
    version,
    digest: digest(`${component}:${version}`),
  })) as readonly AgentImprovementResumeComponentFact[]);
}

function emptyRegistry(): AgentImprovementMigrationRegistry {
  const body = Object.freeze({
    registryVersion: 1 as const,
    entries: Object.freeze([]),
  });
  return Object.freeze({
    ...body,
    registryDigest: agentImprovementMigrationRegistryDigest(body),
  });
}

function startedInput(
  streamSequence = 1,
  causationId: string | null = null,
): AgentImprovementEventInput<'deep_improvement_common.run_started'> {
  return {
    stem: 'deep_improvement_common.run_started',
    scope: {
      runId: RUN_ID,
      lineageId: LINEAGE_ID,
      variant: 'agent-improvement',
    },
    prevEventHash: ZERO_DIGEST,
    replay: {
      fingerprint_version: 1,
      final_digest: digest('replay'),
      replay_input_digests: {
        configuration: digest('configuration'),
        evaluator: digest('evaluator'),
      },
    },
    data: {
      generation: 1,
      charterDigest: digest('charter'),
      configDigest: digest('configuration'),
      operatorRef: 'operator:agent-improvement',
      serviceContractVersion: 'deep-improvement-common@1',
      replayFingerprint: digest('run-replay'),
      maxIterations: 4,
    },
    eventId: `resume-event-${streamSequence}`,
    streamId: STREAM_ID,
    streamSequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: {
      name: 'agent-improvement-resume-tests',
      version: '1',
    },
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId,
    idempotencyKey: `resume-event-${streamSequence}`,
  };
}

async function authorizedHistory(
  input = startedInput(),
): Promise<{
  readonly ledger: AppendOnlyLedger;
  readonly event: AgentImprovementLedgerEvent;
}> {
  const rootDirectory = temporaryRoot();
  const registry = createAgentImprovementEventRegistry();
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
    identityResolver: ({ evaluationInput }) => ({
      actorId: evaluationInput.actorId,
      capabilityId: evaluationInput.capabilityId,
      evidenceDigest: evaluationInput.evidenceDigest,
    }),
  }, ledger, policies);
  const prepared = prepareAgentImprovementEvent(input, registry);
  const request = await createFixtureRequest(
    ledger,
    prepared,
    policies,
    `resume-request-${input.streamSequence}`,
  );
  const authorization = await gateway.authorize(request);
  if (authorization.verdict !== 'allow') {
    throw new Error(`Fixture authorization failed: ${authorization.reasonCode}`);
  }
  await appendAuthorizedForTest(ledger, prepared, authorization.proof);
  return {
    ledger,
    event: prepared.envelope as AgentImprovementLedgerEvent,
  };
}

function malformedBundle(
  frontier?: {
    readonly startHeadHash: string;
    readonly finalHeadHash: string;
  },
): JsonObject {
  return {
    bundleVersion: 1,
    certificate: frontier === undefined ? {} : {
      body: frontier,
    },
    receipts: [],
    commonBundle: {},
  };
}

function resumeRequest(
  priorRunBundle: JsonObject = malformedBundle(),
  checkpoint: AgentImprovementProjectionCheckpoint | null = null,
) {
  return {
    runId: RUN_ID,
    idempotencyKey: 'resume-request-1',
    requestedAt: TIMESTAMP,
    resumeReason: 'Recover an interrupted dark run.',
    currentInputs: currentInputs(),
    migrationRegistry: emptyRegistry(),
    lease: {
      runId: RUN_ID,
      leaseId: 'lease-1',
      lineageId: LINEAGE_ID,
      generation: 1,
      deadlineAt: '2026-07-28T11:00:00.000Z',
      remainingMs: 3_600_000,
      certificateDigest: ZERO_DIGEST,
      replayFingerprint: ZERO_DIGEST,
    },
    checkpoint,
    priorRunBundle,
  };
}

function adapterOptions(
  ledger: AppendOnlyLedger,
  events: readonly AgentImprovementLedgerEvent[],
): AgentImprovementResumeAdapterOptions {
  return {
    verification: {
      projectionEvents: events,
      artifactStore: {},
      replay: {
        ledger,
        rangeStartSequence: 1,
        rangeEndSequence: events.length,
      },
      commonVerification: {},
      providers: {},
    },
    effectLedger: ledger,
    trustedMigrationRegistryDigests: [emptyRegistry().registryDigest],
  } as unknown as AgentImprovementResumeAdapterOptions;
}

function checkpointFor(
  event: AgentImprovementLedgerEvent,
): AgentImprovementProjectionCheckpoint {
  const result = foldAgentImprovementEvents([event]);
  if (result.outcome !== 'projected') {
    throw new Error(`Fixture projection failed: ${result.reasonCodes.join(',')}`);
  }
  return result.checkpoint;
}

function fingerprintBody(): Omit<AgentImprovementResumeFingerprint, 'finalDigest'> {
  return Object.freeze({
    fingerprintVersion: 1,
    runId: RUN_ID,
    certificateDigest: digest('certificate'),
    replayFingerprint: digest('replay'),
    reducerVersion: AGENT_IMPROVEMENT_REDUCER_VERSION,
    adapterVersion: AGENT_IMPROVEMENT_RESUME_ADAPTER_VERSION,
    schemaVersion: AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
    codecVersion: AGENT_IMPROVEMENT_PROJECTION_CODEC_VERSION,
    artifactSetDigest: digest('artifacts'),
    receiptChainDigest: digest('receipts'),
    componentFacts: currentInputs(),
  });
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('agent improvement resume adapter', () => {
  it('publishes the complete mode continuity ladder', () => {
    expect(AGENT_IMPROVEMENT_CONTINUITY_LADDER.map((row) => row.step)).toEqual([
      'run-identity',
      'agent-ir-and-change-contract',
      'candidate-generation',
      'behavior-experiment',
      'evaluation-and-scoring',
      'canary-and-promotion',
      'terminal-or-blocked',
    ]);
    expect(AGENT_IMPROVEMENT_CONTINUITY_LADDER.every(
      (row) => row.reentryActions.length > 0 && row.reducerFields.length > 0,
    )).toBe(true);
  });

  it('recomputes the fingerprint across schema, reducer, adapter, and codec versions', () => {
    const original = fingerprintBody();
    const originalDigest = agentImprovementResumeFingerprintDigest(original);
    for (const [field, value] of [
      ['schemaVersion', 'agent-improvement-projection-schema@changed'],
      ['reducerVersion', 'agent-improvement-reducer@changed'],
      ['adapterVersion', 'agent-improvement-resume-adapter@changed'],
      ['codecVersion', 'agent-improvement-projection-codec@changed'],
      ['certificateDigest', digest('changed-certificate')],
      ['artifactSetDigest', digest('changed-artifacts')],
      ['receiptChainDigest', digest('changed-receipts')],
    ] as const) {
      expect(agentImprovementResumeFingerprintDigest({
        ...original,
        [field]: value,
      })).not.toBe(originalDigest);
    }
  });

  it('recomputes the fingerprint when any real compatibility input changes', () => {
    const original = fingerprintBody();
    const changed = original.componentFacts.map((fact) => (
      fact.component === 'model'
        ? { ...fact, digest: digest('changed-model') }
        : fact
    ));
    expect(agentImprovementResumeFingerprintDigest({
      ...original,
      componentFacts: changed,
    })).not.toBe(agentImprovementResumeFingerprintDigest(original));
  });

  it('rejects a caller-authored compatibility verdict', () => {
    expect(() => parseAgentImprovementResumeRequest({
      ...resumeRequest(),
      compatibilityOutcome: 'compatible',
    })).toThrow(/closed request shape/u);
  });

  it('rejects an unauthenticated migration-registry mutation', () => {
    const registry = emptyRegistry();
    expect(() => parseAgentImprovementMigrationRegistry({
      ...registry,
      entries: [{
        component: 'model',
        fromVersion: 'model@1',
        fromDigest: digest('model-1'),
        toVersion: 'model@2',
        toDigest: digest('model-2'),
        outcome: 'compatible',
        revision: 'revision-1',
      }],
    })).toThrow(/does not commit its entries/u);
  });

  it('blocks a prior certificate that does not offline-verify', async () => {
    const { ledger, event } = await authorizedHistory();
    const result = await new AgentImprovementResumeAdapter(
      adapterOptions(ledger, [event]),
    ).resume(resumeRequest());
    expect(result.offlineVerification.verdict).not.toBe('valid');
    expect(result.decision.disposition).toBe('blocked');
    expect(result.reasonCodes).toEqual(['certificate-unverified']);
    expect(result.continuity).toBeNull();
    expect(result.projection).toBeNull();
  });

  it('rejects a non-null checkpoint with a forged stream cursor', async () => {
    const { ledger, event } = await authorizedHistory();
    const checkpoint = checkpointFor(event);
    const forged = {
      ...checkpoint,
      sourceStreamTails: checkpoint.sourceStreamTails.map((tail) => ({
        ...tail,
        lastSequence: tail.lastSequence + 1,
      })),
    };
    const result = await new AgentImprovementResumeAdapter(
      adapterOptions(ledger, [event]),
    ).resume(resumeRequest(malformedBundle(), forged));
    expect(result.decision.disposition).toBe('rebuild-required');
    expect(result.reasonCodes).toContain('cursor-gap');
  });

  it('rejects a self-consistent-looking checkpoint with the wrong digest', async () => {
    const { ledger, event } = await authorizedHistory();
    const checkpoint = checkpointFor(event);
    const forged = {
      ...checkpoint,
      integrityDigest: digest('forged-checkpoint'),
    };
    const result = await new AgentImprovementResumeAdapter(
      adapterOptions(ledger, [event]),
    ).resume(resumeRequest(malformedBundle(), forged));
    expect(result.decision.disposition).toBe('rebuild-required');
    expect(result.reasonCodes).toContain('checkpoint-digest-mismatch');
  });

  it('rejects a certificate frontier that differs from the replayed ledger tail', async () => {
    const { ledger, event } = await authorizedHistory();
    const result = await new AgentImprovementResumeAdapter(
      adapterOptions(ledger, [event]),
    ).resume(resumeRequest(malformedBundle({
      startHeadHash: digest('wrong-start'),
      finalHeadHash: digest('wrong-final'),
    })));
    expect(result.decision.disposition).toBe('rebuild-required');
    expect(result.reasonCodes).toEqual(['frontier-mismatch']);
  });

  it('rejects an authenticated history with a causal cursor gap', async () => {
    const { ledger, event } = await authorizedHistory(
      startedInput(2, null),
    );
    const result = await new AgentImprovementResumeAdapter(
      adapterOptions(ledger, [event]),
    ).resume(resumeRequest());
    expect(result.decision.disposition).toBe('rebuild-required');
    expect(result.reasonCodes).toEqual(['cursor-gap']);
  });

  it('rejects reducer input that diverges from the authenticated ledger history', async () => {
    const { ledger, event } = await authorizedHistory();
    const divergent = prepareAgentImprovementEvent(
      startedInput(1, null),
      createAgentImprovementEventRegistry(),
    ).envelope as AgentImprovementLedgerEvent;
    const result = await new AgentImprovementResumeAdapter(
      adapterOptions(ledger, [{
        ...divergent,
        event_id: 'different-event-id',
      }]),
    ).resume(resumeRequest());
    expect(result.decision.disposition).toBe('rebuild-required');
    expect(result.reasonCodes).toEqual(['authenticated-history-invalid']);
  });
});
