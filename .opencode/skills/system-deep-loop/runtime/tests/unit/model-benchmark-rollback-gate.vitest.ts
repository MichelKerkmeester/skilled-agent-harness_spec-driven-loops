// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Rollback Gate Tests
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_DAYS,
  DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS,
} from '../../lib/deep-improvement-common-rollback-gate/index.js';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  ProtectedResourceKinds,
} from '../../lib/locks-and-fencing/index.js';
import { MODEL_BENCHMARK_EVENT_VERSION } from '../../lib/model-benchmark-ledger-schema/index.js';
import {
  MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
  MODEL_BENCHMARK_REDUCER_VERSION,
} from '../../lib/model-benchmark-reducers/index.js';
import {
  ModelBenchmarkModeMigrationGate,
  ModelBenchmarkRollbackSwitch,
  MODEL_BENCHMARK_ROLLBACK_GATE_SCHEMA_VERSION,
  MODEL_BENCHMARK_ROLLBACK_MINIMUM_DAYS,
  MODEL_BENCHMARK_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS,
  evaluateModelBenchmarkRollbackWindow,
} from '../../lib/model-benchmark-rollback-gate/index.js';
import {
  createModelBenchmarkModeGateInput,
} from '../../lib/model-benchmark-shadow-parity/index.js';
import { SealedArtifactStore } from '../../lib/sealed-reference-artifacts/index.js';
import { compileParityCaseManifest } from '../../lib/shadow-parity/index.js';
import {
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_LEDGER_ID,
  createFixtureEvent,
  createFixtureEventRegistry,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from '../fixtures/authorized-ledger-fixtures.js';

import type {
  AuthoritySnapshot,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepImprovementCommonModeGateInput,
} from '../../lib/deep-improvement-common-rollback-gate/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';
import type {
  ModelBenchmarkModeGateInput,
  ModelBenchmarkRollbackRequest,
  ModelBenchmarkRollbackWindowExecution,
} from '../../lib/model-benchmark-rollback-gate/index.js';

// Delegated services keep their own real-substrate suites as the executable contract.
import './deep-improvement-common-rollback-gate.vitest.js';
import './model-benchmark-certificates.vitest.js';
import './model-benchmark-resume-adapter.vitest.js';
import './model-benchmark-sealed-artifacts.vitest.js';
import './model-benchmark-shadow-parity.vitest.js';
import './model-benchmark-reducers.vitest.js';
import './model-benchmark-ledger-schema.vitest.js';

vi.setConfig({ testTimeout: 30_000 });

const BASE_SHA = '1'.repeat(40);
const CANDIDATE_SHA = '2'.repeat(40);
const temporaryRoots: string[] = [];

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `model-benchmark-rollback-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function hash(label: string): string {
  return createHash('sha256').update(label, 'utf8').digest('hex');
}

function successfulExecutions(count = 5): ModelBenchmarkRollbackWindowExecution[] {
  return Array.from({ length: count }, (_, index) => ({
    executionId: `execution-${index + 1}`,
    authorityState: 'new_authoritative_reversible',
    authorityEpoch: 9,
    result: 'trusted-completion',
    certificateDigest: hash(`certificate-${index + 1}`),
  }));
}

function successfulExecution(): ModelBenchmarkRollbackWindowExecution {
  const [execution] = successfulExecutions(1);
  if (execution === undefined) throw new Error('Expected one successful execution fixture');
  return execution;
}

function emptyCommonGateInput(): DeepImprovementCommonModeGateInput<JsonObject> {
  return {
    candidateSha: CANDIDATE_SHA,
    baseSha: BASE_SHA,
    sharedContractDigest: hash('shared-contract'),
    writeSetDigest: hash('write-set'),
    versions: {
      eventEnvelopeVersion: 1,
      eventSchemaVersion: 'deep-improvement-common-event@1',
      reducerVersion: 'deep-improvement-common-reducer@1',
      projectionVersion: 'deep-improvement-common-projection@1',
    },
    verifierIdentity: 'external-verifier',
    verifierVersion: 'verifier@1',
    authority: { state: 'legacy_authoritative', epoch: 1 },
    parity: null,
    sealedArtifacts: null,
    certificates: null,
    resumeEvidence: null,
    lifecycle: [],
    rollback: null,
    rollbackWindow: {
      openedAt: '2026-07-01T00:00:00.000Z',
      evaluatedAt: '2026-07-15T00:00:00.000Z',
      executions: successfulExecutions(),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    },
    unresolvedRiskIds: [],
  };
}

function emptyModeGateInput(): ModelBenchmarkModeGateInput<JsonObject> {
  const commonGateInput = emptyCommonGateInput();
  return {
    candidateSha: commonGateInput.candidateSha,
    baseSha: commonGateInput.baseSha,
    sharedContractDigest: commonGateInput.sharedContractDigest,
    writeSetDigest: commonGateInput.writeSetDigest,
    versions: {
      eventEnvelopeVersion: 1,
      eventSchemaVersion: `model-benchmark-event@${MODEL_BENCHMARK_EVENT_VERSION}`,
      reducerVersion: MODEL_BENCHMARK_REDUCER_VERSION,
      projectionVersion: MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
    },
    verifierIdentity: commonGateInput.verifierIdentity,
    verifierVersion: commonGateInput.verifierVersion,
    authority: commonGateInput.authority,
    commonGateInput,
    parity: null,
    sealedArtifacts: null,
    certificates: null,
    resumeEvidence: null,
    lifecycle: [],
    rollbackWindow: commonGateInput.rollbackWindow,
    unresolvedRiskIds: [],
  };
}

async function gatewayHarness(
  authority: AuthoritySnapshot = FIXTURE_AUTHORITY,
) {
  const rootDirectory = temporaryRoot('gateway');
  const registry = createFixtureEventRegistry();
  const policies = createFixturePolicyRegistry();
  const authorityProvider = () => authority;
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

afterEach(() => {
  while (temporaryRoots.length > 0) {
    const root = temporaryRoots.pop();
    if (root !== undefined) rmSync(root, { recursive: true, force: true });
  }
});

describe('model benchmark rollback window', () => {
  it('inherits the common minimums without forking policy', () => {
    expect(MODEL_BENCHMARK_ROLLBACK_MINIMUM_DAYS).toBe(14);
    expect(MODEL_BENCHMARK_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS).toBe(5);
    expect(MODEL_BENCHMARK_ROLLBACK_MINIMUM_DAYS)
      .toBe(DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_DAYS);
    expect(MODEL_BENCHMARK_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS)
      .toBe(DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS);
  });

  it('requires both calendar days and distinct successful executions', () => {
    const tooEarly = evaluateModelBenchmarkRollbackWindow({
      openedAt: '2026-07-01T00:00:00.000Z',
      evaluatedAt: '2026-07-14T23:59:59.999Z',
      executions: successfulExecutions(),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    const tooFew = evaluateModelBenchmarkRollbackWindow({
      openedAt: '2026-07-01T00:00:00.000Z',
      evaluatedAt: '2026-07-15T00:00:00.000Z',
      executions: successfulExecutions(4),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    const eligible = evaluateModelBenchmarkRollbackWindow({
      openedAt: '2026-07-01T00:00:00.000Z',
      evaluatedAt: '2026-07-15T00:00:00.000Z',
      executions: successfulExecutions(),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });

    expect(tooEarly).toMatchObject({ state: 'open', elapsedCalendarDays: 13 });
    expect(tooFew).toMatchObject({ state: 'open', successfulAuthoritativeExecutions: 4 });
    expect(eligible).toMatchObject({
      state: 'eligible_to_close',
      successfulAuthoritativeExecutions: 5,
      windowClosed: false,
    });
  });

  it('deduplicates repeated rows before the success threshold', () => {
    const execution = successfulExecution();
    const result = evaluateModelBenchmarkRollbackWindow({
      openedAt: '2026-07-01T00:00:00.000Z',
      evaluatedAt: '2026-07-15T00:00:00.000Z',
      executions: Array.from({ length: 20 }, () => ({ ...execution })),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(result).toMatchObject({ state: 'open', successfulAuthoritativeExecutions: 1 });
  });

  it('collapses execution and certificate aliases transitively', () => {
    const first = successfulExecution();
    const result = evaluateModelBenchmarkRollbackWindow({
      openedAt: '2026-07-01T00:00:00.000Z',
      evaluatedAt: '2026-07-15T00:00:00.000Z',
      executions: [
        { ...first, executionId: 'execution-a', certificateDigest: hash('certificate-a') },
        { ...first, executionId: 'execution-a', certificateDigest: hash('certificate-b') },
        { ...first, executionId: 'execution-b', certificateDigest: hash('certificate-b') },
        { ...first, executionId: 'execution-c', certificateDigest: hash('certificate-c') },
      ],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(result.successfulAuthoritativeExecutions).toBe(2);
    expect(result.state).toBe('open');
  });

  it.each([
    ['blocked', 'blocked'],
    ['failed', 'failed'],
    ['incomplete', 'incomplete'],
    ['abstained', 'abstained'],
  ] as const)('does not count a %s execution', (_label, executionResult) => {
    const executions: ModelBenchmarkRollbackWindowExecution[] = [
      ...successfulExecutions(4),
      {
        executionId: 'non-success',
        authorityState: 'new_authoritative_reversible',
        authorityEpoch: 9,
        result: executionResult,
        certificateDigest: hash(`non-success-${executionResult}`),
      },
    ];
    const evaluation = evaluateModelBenchmarkRollbackWindow({
      openedAt: '2026-07-01T00:00:00.000Z',
      evaluatedAt: '2026-07-15T00:00:00.000Z',
      executions,
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(evaluation.successfulAuthoritativeExecutions).toBe(4);
    expect(evaluation.state).toBe('open');
  });

  it('excludes executions outside reversible authority', () => {
    const executions = successfulExecutions().map((entry, index) => index === 4
      ? { ...entry, authorityState: 'legacy_authoritative' as const }
      : entry);
    const result = evaluateModelBenchmarkRollbackWindow({
      openedAt: '2026-07-01T00:00:00.000Z',
      evaluatedAt: '2026-07-15T00:00:00.000Z',
      executions,
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(result.successfulAuthoritativeExecutions).toBe(4);
  });

  it.each([
    ['low traffic', true, 0],
    ['unresolved evidence', false, 1],
    ['both extension causes', true, 9],
  ] as const)('extends for %s after both minimums are met', (
    _label,
    lowTraffic,
    unresolvedEvidenceCount,
  ) => {
    const result = evaluateModelBenchmarkRollbackWindow({
      openedAt: '2026-07-01T00:00:00.000Z',
      evaluatedAt: '2026-07-15T00:00:00.000Z',
      executions: successfulExecutions(),
      unresolvedEvidenceCount,
      lowTraffic,
    });
    expect(result.state).toBe('extended');
    expect(result.windowClosed).toBe(false);
  });

  it('commits the complete evidence input rather than only the summary', () => {
    const first = evaluateModelBenchmarkRollbackWindow({
      openedAt: '2026-07-01T00:00:00.000Z',
      evaluatedAt: '2026-07-15T00:00:00.000Z',
      executions: successfulExecutions(),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    const second = evaluateModelBenchmarkRollbackWindow({
      openedAt: '2026-07-01T00:00:00.000Z',
      evaluatedAt: '2026-07-15T00:00:00.000Z',
      executions: successfulExecutions().map((entry, index) => ({
        ...entry,
        executionId: `replacement-${index}`,
        certificateDigest: hash(`replacement-${index}`),
      })),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(second.state).toBe(first.state);
    expect(second.successfulAuthoritativeExecutions)
      .toBe(first.successfulAuthoritativeExecutions);
    expect(second.evaluationDigest).not.toBe(first.evaluationDigest);
  });

  it.each([
    {},
    { openedAt: 'not-a-date', evaluatedAt: '2026-07-15T00:00:00Z', executions: [], unresolvedEvidenceCount: 0, lowTraffic: false },
    { openedAt: '2026-07-15T00:00:00Z', evaluatedAt: '2026-07-01T00:00:00Z', executions: [], unresolvedEvidenceCount: 0, lowTraffic: false },
    { openedAt: '2026-07-01T00:00:00Z', evaluatedAt: '2026-07-15T00:00:00Z', executions: [], unresolvedEvidenceCount: -1, lowTraffic: false },
    { openedAt: '2026-07-01T00:00:00Z', evaluatedAt: '2026-07-15T00:00:00Z', executions: [], unresolvedEvidenceCount: 0, lowTraffic: 'false' },
  ])('rejects malformed standalone window input', (input) => {
    expect(() => evaluateModelBenchmarkRollbackWindow(input as never)).toThrow(TypeError);
  });
});

describe('model benchmark independent fail-closed gate', () => {
  it('maps every absent evidence bucket to its typed disposition', async () => {
    const result = await new ModelBenchmarkModeMigrationGate().evaluate(emptyModeGateInput());
    expect(result.certificate).toBeNull();
    expect(result.dispositions.map((entry) => [entry.input, entry.disposition, entry.reasonCode]))
      .toEqual([
        ['shadow_parity', 'blocked', 'EVIDENCE_MISSING'],
        ['sealed_artifacts', 'not_ready', 'EVIDENCE_MISSING'],
        ['certificates_receipts', 'blocked', 'EVIDENCE_MISSING'],
        ['lifecycle_resume', 'blocked', 'RESUME_INVALID'],
        ['rollback_readiness', 'rollback_required', 'COMMON_GATE_INVALID'],
      ]);
  });

  it('drives the real offline verifier and preserves its failure as a typed denial', async () => {
    const input = {
      ...emptyModeGateInput(),
      certificates: { verificationInput: {} as never },
    };
    const result = await new ModelBenchmarkModeMigrationGate().evaluate(input);
    expect(result).toMatchObject({ verdict: 'rollback_required', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'certificates_receipts',
      disposition: 'blocked',
      reasonCode: 'MODE_CERTIFICATE_INVALID',
    }));
  });

  it('does not adopt a self-reported passing parity handoff', async () => {
    const manifest = compileParityCaseManifest({
      baseSha: BASE_SHA,
      baselineRows: [{
        scenarioId: 'forged-green',
        mode: 'model-benchmark',
        contractDigest: hash('contract'),
        disposition: 'protected',
      }],
      cases: [{
        caseId: 'forged-green',
        scenarioId: 'forged-green',
        mode: 'model-benchmark',
        contractDigest: hash('contract'),
        requiredObservations: ['ordered-transitions'],
        projectionIds: ['model-benchmark'],
        timeoutMs: 1_000,
        terminationPolicy: 'bounded',
      }],
    });
    const computed = createModelBenchmarkModeGateInput({
      manifest,
      expectedFixtureIds: ['forged-green'],
      receipts: [],
    });
    const { gateInputDigest: ignored, ...reportedBody } = computed;
    void ignored;
    const forgedBody = {
      ...reportedBody,
      parityReceiptDigests: [hash('forged-receipt')],
      exitStatus: 'pass' as const,
      zeroUnexplainedDiffs: true,
      allReceiptsPresent: true,
      deterministicReplay: true,
      certificatesVerified: true,
      blockingReasonCode: null,
    };
    const modeGateInput = { ...forgedBody, gateInputDigest: digest(forgedBody) };
    const result = await new ModelBenchmarkModeMigrationGate().evaluate({
      ...emptyModeGateInput(),
      parity: {
        manifest,
        modeGateInput,
        receipts: [{ exitStatus: 'green', receiptDigest: hash('forged-receipt') }],
        authorizationAuditRootDirectory: temporaryRoot('forged-parity'),
        authorizationAuditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
      },
    });
    expect(result.certificate).toBeNull();
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'shadow_parity',
      disposition: 'blocked',
      reasonCode: 'EVIDENCE_MALFORMED',
    }));
  });

  it('still rejects forged green evidence when a real gateway audit contains an allow', async () => {
    const harness = await gatewayHarness();
    const event = createFixtureEvent(harness.registry, 1);
    const request = await createFixtureRequest(
      harness.ledger,
      event,
      harness.policies,
      'forged-green-audit-anchor',
      { mode: 'model-benchmark', evidenceDigest: hash('forged-attestation') },
    );
    expect((await harness.gateway.authorize(request)).verdict).toBe('allow');
    const manifest = compileParityCaseManifest({
      baseSha: BASE_SHA,
      baselineRows: [{ scenarioId: 'forged', mode: 'model-benchmark', contractDigest: hash('contract'), disposition: 'protected' }],
      cases: [{ caseId: 'forged', scenarioId: 'forged', mode: 'model-benchmark', contractDigest: hash('contract'), requiredObservations: ['ordered-transitions'], projectionIds: ['model-benchmark'], timeoutMs: 1_000, terminationPolicy: 'bounded' }],
    });
    const result = await new ModelBenchmarkModeMigrationGate().evaluate({
      ...emptyModeGateInput(),
      parity: {
        manifest,
        modeGateInput: { exitStatus: 'pass' },
        receipts: [{ exitStatus: 'green', ledgerStreamDigest: event.canonicalDigest }],
        authorizationAuditRootDirectory: harness.rootDirectory,
        authorizationAuditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
      },
    });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'shadow_parity',
      reasonCode: 'EVIDENCE_MALFORMED',
    }));
  });

  it('uses a real sealed store and treats absent mode claims as not ready', async () => {
    const store = new SealedArtifactStore({ rootDirectory: temporaryRoot('sealed') });
    const result = await new ModelBenchmarkModeMigrationGate().evaluate({
      ...emptyModeGateInput(),
      sealedArtifacts: { store, bindings: [] },
    });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'sealed_artifacts',
      disposition: 'not_ready',
      reasonCode: 'EVIDENCE_MISSING',
    }));
  });

  it.each([
    ['candidateSha', 'not-a-sha'],
    ['baseSha', 'not-a-sha'],
    ['sharedContractDigest', 'not-a-digest'],
    ['writeSetDigest', 'not-a-digest'],
    ['verifierIdentity', 'contains spaces'],
    ['verifierVersion', 'contains spaces'],
  ] as const)('turns malformed top-level %s into typed denials without throwing', async (
    field,
    value,
  ) => {
    const input = { ...emptyModeGateInput(), [field]: value };
    await expect(new ModelBenchmarkModeMigrationGate().evaluate(input))
      .resolves.toMatchObject({ certificate: null });
  });

  it.each([
    null,
    [],
    'not-an-object',
    42,
    Object.create({ inherited: true }),
  ])('never throws for a malformed top-level caller value', async (input) => {
    await expect(new ModelBenchmarkModeMigrationGate().evaluate(input as never))
      .resolves.toMatchObject({ certificate: null });
  });

  it('rejects unknown top-level fields instead of treating them as inert', async () => {
    const input = {
      ...emptyModeGateInput(),
      authorityOverride: 'new_authoritative_final',
    } as unknown as ModelBenchmarkModeGateInput<JsonObject>;
    const result = await new ModelBenchmarkModeMigrationGate().evaluate(input);
    expect(result.certificate).toBeNull();
    expect(result.dispositions.every((entry) => entry.reasonCode === 'EVIDENCE_MALFORMED'))
      .toBe(true);
  });

  it('rejects a versions object with extra consequential fields', async () => {
    const input = emptyModeGateInput();
    const result = await new ModelBenchmarkModeMigrationGate().evaluate({
      ...input,
      versions: { ...input.versions, authorityOverride: 'new_authoritative_final' } as never,
    });
    expect(result.certificate).toBeNull();
  });

  it('converts a malformed rollback window into rollback-required evidence', async () => {
    const input = emptyModeGateInput();
    const result = await new ModelBenchmarkModeMigrationGate().evaluate({
      ...input,
      rollbackWindow: { ...input.rollbackWindow, evaluatedAt: 'not-a-time' },
    });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'rollback_readiness',
      disposition: 'rollback_required',
      reasonCode: 'EVIDENCE_MALFORMED',
    }));
  });

  it('converts circular evidence into typed malformed dispositions', async () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    const result = await new ModelBenchmarkModeMigrationGate().evaluate({
      ...emptyModeGateInput(),
      parity: circular as never,
    });
    expect(result.certificate).toBeNull();
    expect(result.dispositions.every((entry) => entry.reasonCode === 'EVIDENCE_MALFORMED'))
      .toBe(true);
  });

  it('cannot turn unresolved risk assertions into a certificate', async () => {
    const result = await new ModelBenchmarkModeMigrationGate().evaluate({
      ...emptyModeGateInput(),
      unresolvedRiskIds: ['critical-invariant-unknown'],
    });
    expect(result.verdict).not.toBe('pass');
    expect(result.certificate).toBeNull();
  });
});

describe('model benchmark rollback switch caller boundary', () => {
  async function rollbackSwitch(authority: AuthoritySnapshot = FIXTURE_AUTHORITY) {
    const harness = await gatewayHarness(authority);
    const fencingCoordinator = new FencedLeaseCoordinator({
      rootDirectory: temporaryRoot('fencing'),
      operationTimeoutMs: 1_000,
    });
    return {
      harness,
      fencingCoordinator,
      rollbackSwitch: new ModelBenchmarkRollbackSwitch({
        gateway: harness.gateway,
        fencingCoordinator,
      }),
    };
  }

  it.each([
    [{}, 'MISSING_CONFIGURATION'],
    [{ configurationVersion: 'v1' }, 'UNKNOWN_STATE'],
    [{ configurationVersion: 'v1', operation: 'not-real', currentAuthority: FIXTURE_AUTHORITY, expectedAuthorityEpoch: 1 }, 'UNKNOWN_STATE'],
    [{ configurationVersion: 'v1', operation: 'rollback', currentAuthority: { state: 'invented', epoch: 1 }, expectedAuthorityEpoch: 1 }, 'UNKNOWN_STATE'],
    [{ configurationVersion: 'v1', operation: 'rollback', currentAuthority: FIXTURE_AUTHORITY, expectedAuthorityEpoch: 2 }, 'STALE_AUTHORITY_EPOCH'],
    [{ configurationVersion: 'v1', operation: 'rollback', currentAuthority: FIXTURE_AUTHORITY, expectedAuthorityEpoch: 1, gateCertificate: null }, 'ABSENT_GATE_CERTIFICATE'],
  ] as const)('returns typed denial %s without throwing', async (request, reasonCode) => {
    const fixture = await rollbackSwitch();
    await expect(fixture.rollbackSwitch.requestRollback(request as ModelBenchmarkRollbackRequest))
      .resolves.toMatchObject({
        disposition: 'denied',
        authorityState: 'legacy_authoritative',
        ledgerAuthority: 'denied',
        reasonCode,
        certificate: null,
      });
  });

  it.each([null, [], 'invalid', 9, Object.create({ inherited: true })])(
    'returns a typed denial for non-plain request input',
    async (input) => {
      const fixture = await rollbackSwitch();
      await expect(fixture.rollbackSwitch.requestRollback(input as never)).resolves.toMatchObject({
        disposition: 'denied',
        reasonCode: 'EVIDENCE_INCOMPLETE',
        certificate: null,
      });
    },
  );

  it('rejects unknown request fields before any gateway decision', async () => {
    const fixture = await rollbackSwitch();
    const result = await fixture.rollbackSwitch.requestRollback({
      configurationVersion: 'v1',
      operation: 'rollback',
      currentAuthority: FIXTURE_AUTHORITY,
      expectedAuthorityEpoch: 1,
      gateCertificate: null,
      selfAuthorization: true,
    } as unknown as ModelBenchmarkRollbackRequest);
    expect(result).toMatchObject({ disposition: 'denied', reasonCode: 'EVIDENCE_INCOMPLETE' });
  });

  it('rejects a self-consistent invented migration certificate by re-running the gate', async () => {
    const fixture = await rollbackSwitch();
    const core = {
      schemaVersion: MODEL_BENCHMARK_ROLLBACK_GATE_SCHEMA_VERSION,
      certificateKind: 'mode-migration-readiness' as const,
      mode: 'model-benchmark' as const,
      readiness: 'ready-for-phase-014-consideration' as const,
      authorityState: 'legacy_authoritative' as const,
      authorityMutation: false as const,
      rollbackWindowClosed: false as const,
      cutoverCertificate: false as const,
      selectionApplied: false as const,
      legacyWriterRetired: false as const,
      rollbackAnchorDigest: hash('rollback-anchor'),
    };
    const gateCertificate = { ...core, certificateDigest: digest(core) } as never;
    const result = await fixture.rollbackSwitch.requestRollback({
      configurationVersion: 'v1',
      operation: 'rollback',
      currentAuthority: FIXTURE_AUTHORITY,
      expectedAuthorityEpoch: 1,
      gateCertificate,
      gateInput: emptyModeGateInput(),
    });
    expect(result).toMatchObject({
      disposition: 'denied',
      reasonCode: 'ABSENT_GATE_CERTIFICATE',
      certificate: null,
    });
  });

  it.each(['truncate-ledger', 'rewrite-sealed-artifact', 'non-reproduction-proof'] as const)(
    'does not let the destructive %s intent become an operation',
    async (destructiveIntent) => {
      const fixture = await rollbackSwitch();
      const result = await fixture.rollbackSwitch.requestRollback({
        configurationVersion: 'v1',
        operation: 'rollback',
        currentAuthority: FIXTURE_AUTHORITY,
        expectedAuthorityEpoch: 1,
        gateCertificate: null,
        destructiveIntent,
      });
      expect(result.certificate).toBeNull();
      expect(result.authorityState).toBe('legacy_authoritative');
    },
  );

  it('proves the real coordinator advances a durable high-water mark above a stale token', async () => {
    const fixture = await rollbackSwitch();
    const resource = {
      kind: ProtectedResourceKinds.WRITER,
      components: { writerId: 'model-benchmark-ledger-writer' },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    } as const;
    const stale = await fixture.fencingCoordinator.acquire({
      resource,
      ownerId: 'stale-model-benchmark-writer',
      correlationId: 'stale-model-benchmark-writer',
      ttlMs: 60_000,
      acquireTimeoutMs: 1_000,
    });
    await fixture.fencingCoordinator.release(stale);
    const current = await fixture.fencingCoordinator.acquire({
      resource,
      ownerId: 'rollback-model-benchmark-writer',
      correlationId: 'rollback-model-benchmark-writer',
      ttlMs: 60_000,
      acquireTimeoutMs: 1_000,
    });
    const durable = await fixture.fencingCoordinator.inspect(resource);
    expect(stale.fenceToken).toBeLessThan(current.fenceToken);
    expect(stale.fenceToken).toBeLessThan(durable.lastFenceToken);
    expect(durable.activeLease?.leaseId).toBe(current.leaseId);
    await fixture.fencingCoordinator.release(current);
  });

  it('rejects a stale authority token at the real transition gateway', async () => {
    const authority = { state: 'legacy_authoritative', epoch: 2 } as const;
    const fixture = await rollbackSwitch(authority);
    const event = createFixtureEvent(fixture.harness.registry, 1, { authority_epoch: 1 });
    const request: TransitionAuthorizationRequest = await createFixtureRequest(
      fixture.harness.ledger,
      event,
      fixture.harness.policies,
      'stale-model-benchmark-token',
      { mode: 'model-benchmark', authorityEpoch: 1 },
    );
    await expect(fixture.harness.gateway.authorize(request)).resolves.toMatchObject({
      verdict: 'deny',
      reasonCode: 'stale_authority_epoch',
    });
  });

  it('keeps external policy denial distinct from malformed caller denial', async () => {
    const rootDirectory = temporaryRoot('denying-gateway');
    const registry = createFixtureEventRegistry();
    const policies = new TransitionPolicyRegistry([{
      policyId: 'fixture-capability-policy',
      policyVersion: 1,
      evaluatorVersion: '1',
      ruleIds: ['external-authority-only'],
      evaluate: () => ({
        verdict: 'deny',
        reasonCode: 'policy_denied',
        matchedRuleIds: ['external-authority-only'],
      }),
    }]);
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
    const event = createFixtureEvent(registry, 1);
    const request = await createFixtureRequest(
      ledger,
      event,
      policies,
      'self-authorized-model-benchmark-recovery',
      { mode: 'model-benchmark', capabilityId: 'self-authorized-recovery' },
    );
    await expect(gateway.authorize(request)).resolves.toMatchObject({
      verdict: 'deny',
      reasonCode: 'policy_denied',
    });
  });
});
