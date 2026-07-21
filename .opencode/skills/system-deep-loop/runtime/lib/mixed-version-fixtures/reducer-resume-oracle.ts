// ───────────────────────────────────────────────────────────────────
// MODULE: Mixed-Version Reducer and Resume Oracle
// ───────────────────────────────────────────────────────────────────

import { resolve } from 'node:path';

import { canonicalBytes, canonicalJson, sha256Bytes } from '../event-envelope/index.js';
import {
  FROZEN_CENSUS_CONTRACT,
  InflightDisposition,
  createClassificationManifest,
  verifyClassificationManifest,
} from '../inflight-state-classification/index.js';
import { verifyCompiledMixedVersionCase } from './seal-compiler.js';
import {
  MixedVersionFixtureError,
  MixedVersionFixtureErrorCodes,
} from './mixed-version-types.js';

import type {
  ClassificationEvidence,
  CreateClassificationManifestInput,
  InflightDisposition as InflightDispositionType,
} from '../inflight-state-classification/index.js';
import type {
  AuthoredMixedVersionOutcome,
  MixedVersionCase,
  MixedVersionExecutionFixture,
  MixedVersionOracleFailure,
  MixedVersionOracleInput,
  MixedVersionOracleResult,
  MixedVersionReducerObservation,
  MixedVersionRestartMetadata,
  MixedVersionResumeClassification,
  MixedVersionResumeClassifierConfig,
} from './mixed-version-types.js';

const OBSERVATION_FIELDS = Object.freeze([
  'acceptedEventIds',
  'effectExecutions',
  'outputArtifacts',
  'pendingEffects',
  'receipts',
  'rejectedEventIds',
  'resumeClassification',
  'stateTransitions',
  'terminalResult',
]);

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach((entry) => deepFreeze(entry));
    Object.freeze(value);
  }
  return value;
}

function isolatedExecutionFixture(
  fixture: Readonly<MixedVersionCase>,
): MixedVersionExecutionFixture {
  const parsed = JSON.parse(
    canonicalJson(fixture),
  ) as MixedVersionCase;
  const { expected: _expected, ...executionInput } = parsed;
  return deepFreeze(executionInput);
}

function failure(
  caseId: string,
  code: MixedVersionOracleFailure['code'],
  stage: string,
  expectedDigest: string | null = null,
  actualDigest: string | null = null,
): MixedVersionOracleFailure {
  return Object.freeze({
    ok: false,
    caseId,
    code,
    stage,
    expectedDigest,
    actualDigest,
    parityEligible: false,
    certificateEligible: false,
    authorityState: 'legacy_authoritative',
    authorityMutation: false,
  });
}

function expectedObservation(
  expected: AuthoredMixedVersionOutcome,
): MixedVersionReducerObservation {
  return {
    acceptedEventIds: expected.acceptedEventIds,
    rejectedEventIds: expected.rejectedEventIds,
    stateTransitions: expected.stateTransitions,
    terminalResult: expected.terminalResult,
    pendingEffects: expected.pendingEffects,
    receipts: expected.receipts,
    effectExecutions: expected.effectExecutions,
    outputArtifacts: expected.outputArtifacts,
    resumeClassification: expected.resumeClassification,
  };
}

function validateObservationShape(observation: MixedVersionReducerObservation): boolean {
  return canonicalJson(Object.keys(observation).sort()) === canonicalJson(OBSERVATION_FIELDS);
}

function hasEffectViolation(observation: MixedVersionReducerObservation): boolean {
  const executions = observation.effectExecutions;
  if (new Set(executions).size !== executions.length) return true;
  if (executions.some((effect) => observation.pendingEffects.includes(effect))) return true;
  return executions.some((effect) => !observation.receipts.includes(`${effect}-receipt`));
}

function dispositionToResume(
  disposition: InflightDispositionType,
): MixedVersionResumeClassification {
  switch (disposition) {
    case InflightDisposition.UPCAST:
      return 'upcast';
    case InflightDisposition.PIN:
      return 'pin-legacy';
    case InflightDisposition.FORK:
      return 'fork';
    case InflightDisposition.MIGRATE:
      return 'migrate';
    case InflightDisposition.BLOCK:
      return 'block';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function censusRowMetadata(
  censusBytes: Uint8Array,
  rowId: string,
): Readonly<{ lifecycle: string; mutability: string }> {
  try {
    const census: unknown = JSON.parse(
      new TextDecoder('utf-8', { fatal: true }).decode(censusBytes),
    );
    if (!isRecord(census) || !Array.isArray(census.rows)) throw new Error('invalid census');
    const row = census.rows.find((candidate: unknown) => (
      isRecord(candidate) && candidate.id === rowId
    ));
    if (
      !isRecord(row)
      || typeof row.lifecycle !== 'string'
      || typeof row.mutability !== 'string'
    ) {
      throw new Error('missing census row');
    }
    return { lifecycle: row.lifecycle, mutability: row.mutability };
  } catch {
    throw new MixedVersionFixtureError(
      MixedVersionFixtureErrorCodes.RESUME_DIVERGENCE,
      'resume-classification',
      'Frozen census row metadata could not be bound to restart evidence',
    );
  }
}

function restartClassificationEvidence(
  input: MixedVersionResumeClassifierConfig,
  restart: MixedVersionRestartMetadata,
): ClassificationEvidence {
  const row = censusRowMetadata(input.censusBytes, input.rowId);
  const activeLeaseCount = restart.leases.filter((lease) => lease.state === 'active').length;
  const leaseState = restart.leases.length === 0
    ? 'none'
    : restart.leases.some((lease) => lease.state === 'uncertain')
      ? 'uncertain'
      : activeLeaseCount > 0
        ? 'active'
        : 'quiescent';
  const receiptCoverage = restart.pendingEffects.every((effectId) => (
    restart.receipts.some((receipt) => receipt.effectId === effectId)
  ));
  const rollbackReady = restart.stopSequence !== null && restart.continuityId !== null;
  const pendingEffectsState = restart.pendingEffects.length === 0
    ? 'none'
    : receiptCoverage
      ? 'active-legacy'
      : 'uncertain';
  return {
    rowId: input.rowId,
    isPresent: true,
    stateDigest: digest(restart),
    shapeVersion: '1',
    shapeStatus: 'registered',
    schemaDigest: digest(Object.keys(restart).sort()),
    lifecyclePoint: `${row.lifecycle}:restart-${restart.stopSequence ?? 'unknown'}`,
    authorityState: 'legacy_authoritative',
    authorityEpoch: Math.max(0, ...restart.leases.map((lease) => lease.fencingToken)),
    mutability: row.mutability,
    leaseState,
    activeLeaseCount,
    leaseSetDigest: digest(restart.leases),
    pendingEffectsState,
    pendingEffectSetDigest: digest(restart.pendingEffects),
    identityCoverage: restart.continuityId !== null,
    orderCoverage: restart.stopSequence !== null,
    idempotencyCoverage: receiptCoverage,
    budgetCoverage: true,
    receiptCoverage,
    pendingWorkCoverage: restart.pendingEffects.length > 0,
    isCorrupt: false,
    rollbackAnchor: {
      anchorId: restart.continuityId ?? 'missing-continuity-anchor',
      digest: digest({
        continuityId: restart.continuityId,
        stopSequence: restart.stopSequence,
      }),
      retained: rollbackReady,
      restorable: rollbackReady,
      minimumRetentionDays: FROZEN_CENSUS_CONTRACT.rollbackMinimumDays,
      minimumSuccessfulRuns: FROZEN_CENSUS_CONTRACT.rollbackMinimumSuccessfulRuns,
    },
    verifier: {
      verified: rollbackReady && receiptCoverage && leaseState !== 'uncertain',
      receiptDigest: digest(restart.receipts),
      replayFingerprintDigest: null,
      rollbackScenarioDigest: digest({
        leaseState,
        pendingEffectsState,
        stopSequence: restart.stopSequence,
      }),
      parityCaseDigest: null,
    },
    proof: {
      kind: 'pin',
      legacyWriterSoleAuthority: true,
      legacyCompletionAvailable: restart.pendingEffects.length > 0 && receiptCoverage,
      boundedCompletion: rollbackReady && leaseState !== 'uncertain',
      timedOut: leaseState === 'uncertain',
      terminalBoundary: restart.continuityId ?? 'missing-continuity-boundary',
      terminalReceiptRequired: restart.pendingEffects.length > 0,
    },
  };
}

/** Bind one fixture restart decision to a verified frozen-census classification row. */
export function createFrozenInflightResumeClassifier(
  input: MixedVersionResumeClassifierConfig,
  restart: MixedVersionRestartMetadata,
): () => MixedVersionResumeClassification {
  return () => {
    const { rowId, ...manifestInput } = input;
    const evidence = restartClassificationEvidence(input, restart);
    const built = createClassificationManifest({
      ...manifestInput,
      evidence: [evidence],
    } satisfies CreateClassificationManifestInput);
    if (!verifyClassificationManifest(built.manifest)) {
      throw new MixedVersionFixtureError(
        MixedVersionFixtureErrorCodes.RESUME_DIVERGENCE,
        'resume-classification',
        'Frozen in-flight classification manifest failed verification',
      );
    }
    const row = built.manifest.rows.find((candidate) => candidate.rowId === rowId);
    if (!row) {
      throw new MixedVersionFixtureError(
        MixedVersionFixtureErrorCodes.RESUME_DIVERGENCE,
        'resume-classification',
        'Frozen in-flight classification omitted the declared state row',
      );
    }
    return dispositionToResume(row.disposition);
  };
}

/** Reject an authored resume outcome that disagrees with the frozen classifier. */
export function assertResumeClassification(
  authored: MixedVersionResumeClassification,
  classified: MixedVersionResumeClassification | undefined,
): void {
  if (classified !== authored) {
    throw new MixedVersionFixtureError(
      MixedVersionFixtureErrorCodes.RESUME_DIVERGENCE,
      'resume-classification',
      'Authored resume outcome disagrees with restart-state classification',
    );
  }
}

/** Compare isolated legacy and dark observations against immutable authored outcomes. */
export async function runMixedVersionOracle(
  input: MixedVersionOracleInput,
): Promise<MixedVersionOracleResult> {
  const caseId = input.compiled.caseId;
  try {
    const fixture = await verifyCompiledMixedVersionCase(input.store, input.compiled);
    const compatibility = input.compatibility.observe(fixture);
    if (
      canonicalJson(compatibility.eventHopTrace) !== canonicalJson(fixture.expected.eventHopTrace)
      || canonicalJson(compatibility.stateHopTrace) !== canonicalJson(fixture.expected.stateHopTrace)
      || compatibility.eventEffectiveVersions.some((version) => version !== 3)
      || compatibility.stateEffectiveVersion !== 3
      || canonicalJson(compatibility.eventStoredVersions)
        !== canonicalJson(fixture.eventVersions)
      || compatibility.stateStoredVersion !== fixture.stateVersion
    ) {
      return failure(
        caseId,
        MixedVersionFixtureErrorCodes.HOP_TRACE_MISMATCH,
        'compatibility-hop-trace',
        digest({
          events: fixture.expected.eventHopTrace,
          state: fixture.expected.stateHopTrace,
        }),
        digest({
          events: compatibility.eventHopTrace,
          state: compatibility.stateHopTrace,
        }),
      );
    }
    for (const [position, event] of fixture.events.entries()) {
      if (
        event.causalPosition !== position
        || JSON.parse(event.serializedEnvelope).stream_id !== fixture.causalBoundary.streamId
        || JSON.parse(event.serializedEnvelope).correlation_id
          !== fixture.causalBoundary.correlationId
      ) {
        return failure(
          caseId,
          MixedVersionFixtureErrorCodes.CAUSAL_BOUNDARY_MISMATCH,
          'causal-boundary',
        );
      }
    }
    if (fixture.scenarioFamily === 'mid-upgrade') {
      const boundaryEvent = fixture.events[fixture.causalBoundary.boundarySequence - 1];
      if (!boundaryEvent || boundaryEvent.storedVersion !== 3) {
        return failure(
          caseId,
          MixedVersionFixtureErrorCodes.CAUSAL_BOUNDARY_MISMATCH,
          'causal-boundary',
        );
      }
    }

    if (fixture.expected.resumeClassification !== null) {
      const classification = input.resumeClassifier === undefined
        ? undefined
        : createFrozenInflightResumeClassifier(
            input.resumeClassifier,
            fixture.replayInputs.restartMetadata,
          )();
      try {
        assertResumeClassification(fixture.expected.resumeClassification, classification);
      } catch (error: unknown) {
        if (!(error instanceof MixedVersionFixtureError)) throw error;
        return failure(
          caseId,
          error.code,
          'resume-classification',
          digest(fixture.expected.resumeClassification),
          classification === undefined ? null : digest(classification),
        );
      }
    }

    const expected = expectedObservation(fixture.expected);
    const roots = {
      legacy: resolve(input.executionRoot, caseId, 'legacy'),
      dark: resolve(input.executionRoot, caseId, 'dark'),
    };
    if (roots.legacy === roots.dark) {
      return failure(
        caseId,
        MixedVersionFixtureErrorCodes.INPUT_INEQUALITY,
        'path-isolation',
      );
    }
    let priorLegacyDigest: string | null = null;
    let priorDarkDigest: string | null = null;
    const runDigests: string[] = [];
    for (let runIndex = 1; runIndex <= 2; runIndex += 1) {
      const legacyFixture = isolatedExecutionFixture(fixture);
      const darkFixture = isolatedExecutionFixture(fixture);
      const [legacy, dark] = await Promise.all([
        input.executeLegacy({
          path: 'legacy',
          executionRoot: roots.legacy,
          runIndex,
          fixture: legacyFixture,
        }),
        input.executeDark({
          path: 'dark',
          executionRoot: roots.dark,
          runIndex,
          fixture: darkFixture,
        }),
      ]);
      const legacyDigest = digest(legacy);
      const darkDigest = digest(dark);
      if (
        (priorLegacyDigest !== null && priorLegacyDigest !== legacyDigest)
        || (priorDarkDigest !== null && priorDarkDigest !== darkDigest)
      ) {
        return failure(
          caseId,
          MixedVersionFixtureErrorCodes.NONDETERMINISTIC_RERUN,
          'deterministic-rerun',
          digest({ legacy: priorLegacyDigest, dark: priorDarkDigest }),
          digest({ legacy: legacyDigest, dark: darkDigest }),
        );
      }
      priorLegacyDigest = legacyDigest;
      priorDarkDigest = darkDigest;
      if (hasEffectViolation(legacy) || hasEffectViolation(dark)) {
        return failure(
          caseId,
          MixedVersionFixtureErrorCodes.DUPLICATE_EFFECT,
          'effect-recovery',
        );
      }
      if (
        !validateObservationShape(legacy)
        || !validateObservationShape(dark)
        || canonicalJson(legacy) !== canonicalJson(expected)
        || canonicalJson(dark) !== canonicalJson(expected)
        || canonicalJson(legacy) !== canonicalJson(dark)
      ) {
        return failure(
          caseId,
          MixedVersionFixtureErrorCodes.REDUCER_DIVERGENCE,
          'authored-reducer-outcome',
          digest(expected),
          digest({ legacy, dark }),
        );
      }
      runDigests.push(digest({ legacy, dark }));
    }
    return Object.freeze({
      ok: true,
      caseId,
      capsuleDigest: input.compiled.capsuleDigest,
      evidenceDigest: digest({
        capsuleDigest: input.compiled.capsuleDigest,
        compatibility,
        runDigests,
      }),
      deterministicRuns: 2,
      parityEligible: true,
      certificateEligible: true,
      authorityState: 'legacy_authoritative',
      authorityMutation: false,
    });
  } catch (error: unknown) {
    if (error instanceof MixedVersionFixtureError) {
      return failure(caseId, error.code, error.stage);
    }
    return failure(
      caseId,
      MixedVersionFixtureErrorCodes.SEAL_VERIFICATION_FAILED,
      'preflight',
    );
  }
}
