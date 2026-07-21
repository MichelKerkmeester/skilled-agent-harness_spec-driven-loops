// ───────────────────────────────────────────────────────────────────
// MODULE: Rollback Drill Runner
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  openSync,
  closeSync,
  fsyncSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import {
  basename,
  join,
} from 'node:path';

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  legacyProjectionDigest,
  serializeLegacyJson,
} from '../legacy-projections/index.js';
import {
  atomicFileTargetIdentity,
  createAtomicFileEffectAdapter,
  createIdempotentApiEffectAdapter,
} from '../receipts-and-effect-recovery/index.js';
import { writeTextAtomic } from '../deep-loop/atomic-state.js';
import {
  createRollbackDrillCertificate,
  writeImmutableRollbackCertificate,
} from './rollback-certificate.js';
import {
  RollbackDrillError,
  applyRollbackWorkload,
  classificationManifestDigest,
  reconstructRollbackState,
  rollbackDrillManifestDigest,
  rollbackLaneStateDigest,
  rollbackStateReconstructionDigest,
  rollbackWorkloadDigest,
  validateRollbackDrillManifest,
} from './rollback-drill-contract.js';
import {
  RollbackDrillLedgerHarness,
} from './rollback-drill-ledger.js';
import {
  SandboxedAuthorityStore,
  assertHermeticSandbox,
  digestFilesystemTree,
  digestProtectedPaths,
} from './sandbox-authority-store.js';
import {
  DetectorByFaultFixture,
  DrillTimelineSteps,
  ROLLBACK_CERTIFICATE_SCHEMA_VERSION,
  RollbackDetectors,
  RollbackDrillReasonCodes,
  RollbackFaultFixtures,
} from './rollback-drill-types.js';

import type { GatewayAuthorizationResult } from '../authorized-ledger/index.js';
import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  AtomicFileEffectRequest,
  EffectAdapter,
  EffectExecutionInput,
  EffectRecoveryGateway,
} from '../receipts-and-effect-recovery/index.js';
import type {
  DrillTimelineEntry,
  EffectIntegrityEvidence,
  LegacyProjectionIntegrityEvidence,
  RegressionObservation,
  ReplayIntegrityEvidence,
  ReplayRangeCoverage,
  RollbackDrillCertificateFacts,
  RollbackDrillClock,
  RollbackDrillExecutionResult,
  RollbackDrillOptions,
  RollbackDrillReasonCode,
  RollbackLaneState,
  RollbackStateReconstruction,
  RollbackTimingEvidence,
  StateIntegrityEvidence,
} from './rollback-drill-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. INTERNAL TYPES
// ───────────────────────────────────────────────────────────────────

interface EffectScenario {
  readonly gateway: EffectRecoveryGateway;
  readonly adapter: EffectAdapter<JsonObject>;
  readonly execution: EffectExecutionInput<JsonObject>;
  readonly error: Error | null;
  readonly startedAt: Date;
}

interface RegressionInputs {
  readonly expectedState: RollbackLaneState;
  readonly candidateState: RollbackLaneState;
  readonly expectedProjectionBytes: Uint8Array;
  readonly candidateProjectionBytes: Uint8Array;
  readonly staleAuthorization: GatewayAuthorizationResult | null;
  readonly effects: EffectIntegrityEvidence;
  readonly effectError: Error | null;
  readonly effectStartedAt: Date;
  readonly detectedAt: Date;
}

class InjectedDrillBoundaryError extends Error {
  public readonly fixture: string;

  public constructor(fixture: string) {
    super(`Injected rollback drill boundary: ${fixture}`);
    this.name = 'InjectedDrillBoundaryError';
    this.fixture = fixture;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class LaneClock implements RollbackDrillClock {
  #instant: number;

  public constructor(instant: Date) {
    this.#instant = instant.getTime();
  }

  public now(): Date {
    return new Date(this.#instant);
  }

  public advance(milliseconds: number): void {
    this.#instant += milliseconds;
  }

  public synchronize(instant: Date): void {
    this.#instant = instant.getTime();
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. FILE AND CLOCK HELPERS
// ───────────────────────────────────────────────────────────────────

function advance(options: Readonly<RollbackDrillOptions>, milliseconds = 1): Date {
  options.clock.advance(milliseconds);
  return options.clock.now();
}

function writeImmutableJson(path: string, value: JsonValue): void {
  const descriptor = openSync(path, 'wx', 0o400);
  try {
    writeFileSync(descriptor, Uint8Array.from(canonicalBytes(value)));
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
  chmodSync(path, 0o400);
}

function writeLaneState(path: string, state: Readonly<RollbackLaneState>): void {
  writeTextAtomic(path, Buffer.from(serializeLegacyJson(state)).toString('utf8'));
}

function cloneLedgerRoot(source: string, destination: string): void {
  if (existsSync(destination)) rmSync(destination, { recursive: true, force: true });
  cpSync(source, destination, { recursive: true, preserveTimestamps: true });
}

function countDuplicates(values: readonly string[]): number {
  return values.length - new Set(values).size;
}

function effectEvidence(
  summary: Readonly<{
    intentCount: number;
    confirmationCount: number;
    conflictCount: number;
    operatorRequiredCount: number;
    unresolvedIntentCount: number;
    terminalExactlyOnce: boolean;
  }>,
): EffectIntegrityEvidence {
  return Object.freeze({ ...summary });
}

function timelineEntry(
  step: DrillTimelineEntry['step'],
  at: Date,
  store: SandboxedAuthorityStore,
): DrillTimelineEntry {
  const authority = store.snapshot();
  return Object.freeze({
    step,
    at: at.toISOString(),
    authorityState: authority.state,
    authorityEpoch: authority.epoch,
  });
}

async function appendLaneFact(
  controlHarness: RollbackDrillLedgerHarness,
  cutoverHarness: RollbackDrillLedgerHarness,
  controlClock: LaneClock,
  cutoverClock: LaneClock,
  at: Date,
  factId: string,
  controlValue: string,
  cutoverValue: string,
  writerId: string,
  authorityEpoch: number,
): Promise<void> {
  controlClock.synchronize(at);
  cutoverClock.synchronize(at);
  await Promise.all([
    controlHarness.appendFact(factId, controlValue, writerId, authorityEpoch),
    cutoverHarness.appendFact(factId, cutoverValue, writerId, authorityEpoch),
  ]);
}

// ───────────────────────────────────────────────────────────────────
// 3. WINDOW RULES
// ───────────────────────────────────────────────────────────────────

function timingEvidence(
  options: Readonly<RollbackDrillOptions>,
  regressionDetectedAt: Date,
  rollbackStartedAt: Date,
  rollbackCompletedAt: Date,
  legacyResumedAt: Date,
): RollbackTimingEvidence {
  const declaration = options.manifest.rollbackWindow;
  const openedAt = new Date(declaration.openedAt);
  const policyCloseAt = new Date(
    openedAt.getTime() + declaration.minimumCalendarDays * 24 * 60 * 60 * 1_000,
  );
  const runMinimumComplete = declaration.successfulAuthoritativeRuns
    >= declaration.minimumSuccessfulRuns;
  const insidePolicyWindow = !runMinimumComplete
    || rollbackCompletedAt.getTime() < policyCloseAt.getTime();
  const stricterDeadline = declaration.stricterDeadlineAt === null
    ? null
    : new Date(declaration.stricterDeadlineAt);
  const insideStricterDeadline = stricterDeadline === null
    || rollbackCompletedAt.getTime() < stricterDeadline.getTime();
  return Object.freeze({
    windowOpenedAt: openedAt.toISOString(),
    regressionDetectedAt: regressionDetectedAt.toISOString(),
    rollbackStartedAt: rollbackStartedAt.toISOString(),
    rollbackCompletedAt: rollbackCompletedAt.toISOString(),
    legacyResumedAt: legacyResumedAt.toISOString(),
    elapsedMs: rollbackCompletedAt.getTime() - rollbackStartedAt.getTime(),
    insidePolicyWindow,
    insideStricterDeadline,
  });
}

function assertWindowOpenBeforeMutation(options: Readonly<RollbackDrillOptions>): void {
  const now = options.clock.now();
  const openedAt = new Date(options.manifest.rollbackWindow.openedAt);
  const closeAt = new Date(
    openedAt.getTime()
      + options.manifest.rollbackWindow.minimumCalendarDays * 24 * 60 * 60 * 1_000,
  );
  const runsComplete = options.manifest.rollbackWindow.successfulAuthoritativeRuns
    >= options.manifest.rollbackWindow.minimumSuccessfulRuns;
  const stricter = options.manifest.rollbackWindow.stricterDeadlineAt;
  if (
    (runsComplete && now.getTime() >= closeAt.getTime())
    || (stricter !== null && now.getTime() >= Date.parse(stricter))
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.WINDOW_CLOSED,
      'Rollback drill cannot start after its governed or stricter deadline closes',
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. EFFECT SCENARIOS
// ───────────────────────────────────────────────────────────────────

function effectExecution(
  options: Readonly<RollbackDrillOptions>,
  targetIdentity: string,
  request: JsonObject,
  expectedPostconditionDigest: string,
  authorityEpoch: number,
  replayFingerprint: string,
): EffectExecutionInput<JsonObject> {
  return Object.freeze({
    runId: options.manifest.drillId,
    logicalEffectId: 'rollback-drill-effect',
    operation: 'publish-sandbox-result',
    targetIdentity,
    request,
    canonicalInput: request,
    safeMetadata: { sandbox_only: true },
    secretReferences: [],
    recoveryPolicy: 'reconcile-before-retry',
    expectedPostconditionDigest,
    replayFingerprint,
    requestedAt: options.clock.now().toISOString(),
    authorityEpoch,
    correlationId: `${options.manifest.mode}-rollback-drill`,
    causationId: null,
  });
}

async function runEffectScenario(
  options: Readonly<RollbackDrillOptions>,
  harness: RollbackDrillLedgerHarness,
  store: SandboxedAuthorityStore,
  effectRoot: string,
  authorityEpoch: number,
  replayFingerprint: string,
): Promise<EffectScenario> {
  const fixture = options.manifest.fault.fixture;
  let injected = false;
  const faultInjection = {
    ...(fixture === RollbackFaultFixtures.MISSING_RECEIPT
      ? {
          afterEffectBeforeConfirmation: () => {
            if (injected) return;
            injected = true;
            throw new InjectedDrillBoundaryError(fixture);
          },
        }
      : {}),
    ...(([
      RollbackFaultFixtures.CRASH_AT_CUT_POINT,
      RollbackFaultFixtures.TIMEOUT_AT_CUT_POINT,
      RollbackFaultFixtures.UNRESOLVED_EFFECT_INTENT,
    ] as readonly string[]).includes(fixture)
      ? {
          afterIntent: () => {
            if (injected) return;
            injected = true;
            if (fixture === RollbackFaultFixtures.TIMEOUT_AT_CUT_POINT) {
              options.clock.advance(options.manifest.fault.timeoutMs + 1);
            }
            throw new InjectedDrillBoundaryError(fixture);
          },
        }
      : {}),
  };
  const gateway = harness.createEffectGateway(
    faultInjection,
    (claim) => {
      const authority = store.snapshot();
      return authority.state === 'rollback_pending'
        && claim.fence_token === `rollback-fence-${authority.epoch}`;
    },
  );

  let adapter: EffectAdapter<JsonObject>;
  let execution: EffectExecutionInput<JsonObject>;
  if (fixture === RollbackFaultFixtures.UNRESOLVED_EFFECT_INTENT) {
    const request: JsonObject = { operation: 'synthetic-uncertain-effect' };
    adapter = createIdempotentApiEffectAdapter<JsonObject>({
      adapterId: 'rollback-drill-uncertain-api',
      adapterVersion: '1',
      supportsProviderIdempotency: true,
      supportsStatusQuery: true,
      mutate: async () => ({
        external_receipt_digest: sha256Bytes(canonicalBytes({ applied: true })),
        postcondition_digest: sha256Bytes(canonicalBytes({ applied: true })),
        output_digest: sha256Bytes(canonicalBytes({ applied: true })),
        observed_at: options.clock.now().toISOString(),
        safe_result_metadata: { sandbox_only: true },
      }),
      query: async () => ({
        verdict: 'in_doubt',
        reason_code: 'synthetic-outcome-unavailable',
        evidence_digest: sha256Bytes(canonicalBytes({ available: false })),
        observed_at: options.clock.now().toISOString(),
        observation: null,
      }),
    });
    execution = effectExecution(
      options,
      'api:rollback-drill-sandbox',
      request,
      sha256Bytes(canonicalBytes({ applied: true })),
      authorityEpoch,
      replayFingerprint,
    );
  } else {
    mkdirSync(effectRoot, { recursive: true, mode: 0o700 });
    const request: AtomicFileEffectRequest = {
      relativePath: 'effects/result.txt',
      content: 'sandbox-effect-result',
      expectedPriorDigest: null,
    };
    adapter = createAtomicFileEffectAdapter({
      rootDirectory: effectRoot,
      adapterId: 'rollback-drill-atomic-file',
      adapterVersion: '1',
      now: () => options.clock.now(),
    }) as unknown as EffectAdapter<JsonObject>;
    execution = effectExecution(
      options,
      atomicFileTargetIdentity(request.relativePath),
      request,
      sha256Bytes(Buffer.from(request.content, 'utf8')),
      authorityEpoch,
      replayFingerprint,
    );
  }

  const startedAt = options.clock.now();
  let error: Error | null = null;
  try {
    await gateway.execute(execution, adapter);
    if (fixture === RollbackFaultFixtures.CONFLICTING_RECEIPT) {
      await gateway.execute(Object.freeze({
        ...execution,
        request: { ...execution.request, conflicting: true },
        canonicalInput: { ...execution.canonicalInput as JsonObject, conflicting: true },
      }), adapter);
    }
  } catch (caught: unknown) {
    error = caught instanceof Error ? caught : new Error(String(caught));
  }
  return Object.freeze({ gateway, adapter, execution, error, startedAt });
}

async function reconcileEffectIfNeeded(
  options: Readonly<RollbackDrillOptions>,
  scenario: Readonly<EffectScenario>,
  rollbackEpoch: number,
): Promise<void> {
  const fixture = options.manifest.fault.fixture;
  if (![
    RollbackFaultFixtures.MISSING_RECEIPT,
    RollbackFaultFixtures.UNRESOLVED_EFFECT_INTENT,
    RollbackFaultFixtures.CRASH_AT_CUT_POINT,
    RollbackFaultFixtures.TIMEOUT_AT_CUT_POINT,
  ].includes(fixture as never)) {
    return;
  }
  await scenario.gateway.recover({
    execution: Object.freeze({ ...scenario.execution, authorityEpoch: rollbackEpoch }),
    claim: {
      claim_id: `${options.manifest.drillId}-recovery-claim`,
      claimant_id: 'rollback-drill-runner',
      fence_token: `rollback-fence-${rollbackEpoch}`,
      acquired_at: options.clock.now().toISOString(),
    },
    reasonCode: 'rollback-drill-reconciliation',
    startedAt: options.clock.now().toISOString(),
  }, scenario.adapter);
}

// ───────────────────────────────────────────────────────────────────
// 5. REGRESSION DETECTION
// ───────────────────────────────────────────────────────────────────

function detectRegression(
  fixture: RollbackDrillOptions['manifest']['fault']['fixture'],
  input: Readonly<RegressionInputs>,
): RegressionObservation | null {
  let detector = DetectorByFaultFixture[fixture];
  let details: JsonValue | null = null;
  switch (fixture) {
    case RollbackFaultFixtures.REPLAY_FINGERPRINT_MISMATCH: {
      const expected = rollbackLaneStateDigest(input.expectedState);
      const actual = rollbackLaneStateDigest(input.candidateState);
      if (expected !== actual) details = { expected, actual };
      break;
    }
    case RollbackFaultFixtures.LEGACY_PROJECTION_MISMATCH: {
      const expected = legacyProjectionDigest(input.expectedProjectionBytes);
      const actual = legacyProjectionDigest(input.candidateProjectionBytes);
      if (expected !== actual) details = { expected, actual };
      break;
    }
    case RollbackFaultFixtures.STALE_AUTHORITY_EPOCH:
      if (
        input.staleAuthorization?.verdict === 'deny'
        && input.staleAuthorization.reasonCode === 'stale_authority_epoch'
      ) {
        details = { reason_code: input.staleAuthorization.reasonCode };
      }
      break;
    case RollbackFaultFixtures.MISSING_RECEIPT:
      if (
        input.effects.intentCount === 1
        && input.effects.confirmationCount === 0
        && input.effects.unresolvedIntentCount === 1
      ) {
        details = { intent_count: 1, confirmation_count: 0 };
      }
      break;
    case RollbackFaultFixtures.CONFLICTING_RECEIPT:
      if (input.effects.conflictCount > 0) {
        details = { conflict_count: input.effects.conflictCount };
      }
      break;
    case RollbackFaultFixtures.UNRESOLVED_EFFECT_INTENT:
      if (input.effects.unresolvedIntentCount > 0) {
        details = { unresolved_intent_count: input.effects.unresolvedIntentCount };
      }
      break;
    case RollbackFaultFixtures.CRASH_AT_CUT_POINT:
      if (
        input.effectError instanceof InjectedDrillBoundaryError
        && input.effectError.fixture === fixture
      ) {
        details = { cut_point: 'after-intent' };
      }
      break;
    case RollbackFaultFixtures.TIMEOUT_AT_CUT_POINT: {
      const elapsed = input.detectedAt.getTime() - input.effectStartedAt.getTime();
      if (
        input.effectError instanceof InjectedDrillBoundaryError
        && elapsed > 0
      ) {
        details = { elapsed_ms: elapsed };
      }
      break;
    }
    default:
      detector = RollbackDetectors.REPLAY_FINGERPRINT;
  }
  if (details === null) return null;
  return Object.freeze({
    detector,
    evidenceDigest: sha256Bytes(canonicalBytes(details)),
    details,
  });
}

// ───────────────────────────────────────────────────────────────────
// 6. INTEGRITY HELPERS
// ───────────────────────────────────────────────────────────────────

function replayEvidence(
  control: Awaited<ReturnType<RollbackDrillLedgerHarness['verifyFingerprint']>>,
  resumed: Awaited<ReturnType<RollbackDrillLedgerHarness['verifyFingerprint']>>,
  controlRange: Readonly<ReplayRangeCoverage>,
  resumedRange: Readonly<ReplayRangeCoverage>,
): ReplayIntegrityEvidence {
  const controlEffective = control.ok
    ? control.verified.descriptor.effective_event_digest
    : '';
  const resumedEffective = resumed.ok
    ? resumed.verified.descriptor.effective_event_digest
    : '';
  const controlProjection = control.ok
    ? control.verified.descriptor.projection_digest
    : '';
  const resumedProjection = resumed.ok
    ? resumed.verified.descriptor.projection_digest
    : '';
  return Object.freeze({
    controlVerified: control.ok,
    resumedVerified: resumed.ok,
    effectiveEventDigestMatch: control.ok
      && resumed.ok
      && controlEffective === resumedEffective,
    projectionDigestMatch: control.ok
      && resumed.ok
      && controlProjection === resumedProjection,
    controlEffectiveEventDigest: controlEffective,
    resumedEffectiveEventDigest: resumedEffective,
    controlProjectionDigest: controlProjection,
    resumedProjectionDigest: resumedProjection,
    controlRange,
    resumedRange,
  });
}

function completeReplayRange(coverage: Readonly<ReplayRangeCoverage>): boolean {
  return coverage.rangeStartSequence === 1
    && coverage.rangeEndSequence > coverage.sealedHeadSequence
    && coverage.postDivergenceEventCount > 0
    && coverage.boundedSpineWorkCovered
    && coverage.effectEventsCovered
    && coverage.forwardCutoverCovered
    && coverage.rollbackTransitionCovered
    && coverage.restoredStateCovered;
}

function projectionEvidence(
  control: Readonly<RollbackStateReconstruction>,
  resumedBytes: Readonly<Uint8Array>,
): LegacyProjectionIntegrityEvidence {
  const controlBytes = Uint8Array.from(canonicalBytes(control));
  const controlReader = JSON.parse(Buffer.from(controlBytes).toString('utf8')) as JsonValue;
  const resumedReader = JSON.parse(Buffer.from(resumedBytes).toString('utf8')) as JsonValue;
  return Object.freeze({
    bytesMatch: Buffer.from(controlBytes).equals(Buffer.from(resumedBytes)),
    readerResultMatch: Buffer.from(canonicalBytes(controlReader)).equals(
      Buffer.from(canonicalBytes(resumedReader)),
    ),
    controlDigest: legacyProjectionDigest(controlBytes),
    resumedDigest: legacyProjectionDigest(resumedBytes),
    byteLength: resumedBytes.byteLength,
  });
}

function stateEvidence(
  control: Readonly<RollbackStateReconstruction>,
  resumed: Readonly<RollbackStateReconstruction>,
  controlLedgerEventCount: number,
  cutoverLedgerEventCount: number,
  preservedCutoverEventCount: number,
): StateIntegrityEvidence {
  const controlState = control.state;
  const resumedState = resumed.state;
  const controlReconstructionDigest = rollbackStateReconstructionDigest(control);
  const resumedReconstructionDigest = rollbackStateReconstructionDigest(resumed);
  return Object.freeze({
    controlFactCount: controlState.facts.length,
    resumedFactCount: resumedState.facts.length,
    controlArtifactCount: Object.keys(controlState.artifacts).length,
    resumedArtifactCount: Object.keys(resumedState.artifacts).length,
    controlLedgerEventCount,
    cutoverLedgerEventCount,
    preservedCutoverEventCount,
    cutoverEvidenceRetained: cutoverLedgerEventCount === preservedCutoverEventCount
      && cutoverLedgerEventCount >= controlLedgerEventCount,
    duplicateFactCount: countDuplicates(resumedState.facts),
    stateDigestMatch: rollbackLaneStateDigest(controlState)
      === rollbackLaneStateDigest(resumedState),
    controlReconstructionDigest,
    resumedReconstructionDigest,
    reconstructionDigestMatch: controlReconstructionDigest === resumedReconstructionDigest,
    expectedDispositionCount: control.appliedDispositions.length,
    resumedDispositionCount: resumed.appliedDispositions.length,
  });
}

function addReason(
  reasons: RollbackDrillReasonCode[],
  condition: boolean,
  reason: RollbackDrillReasonCode,
): void {
  if (condition && !reasons.includes(reason)) reasons.push(reason);
}

// ───────────────────────────────────────────────────────────────────
// 7. RUNNER
// ───────────────────────────────────────────────────────────────────

/** Execute a complete forward-detect-reverse-resume drill without addressing live state. */
export async function runRollbackDrill(
  options: Readonly<RollbackDrillOptions>,
): Promise<RollbackDrillExecutionResult> {
  validateRollbackDrillManifest(options.manifest);
  if (
    options.currentMode !== options.manifest.mode
    || canonicalJson(options.currentBindings) !== canonicalJson(options.manifest.bindings)
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.BINDING_DRIFT,
      'Current mode or rollback-affecting inputs differ from the pinned manifest',
    );
  }
  assertWindowOpenBeforeMutation(options);
  const sandboxRoot = assertHermeticSandbox(
    options.sandboxRoot,
    options.protectedPaths,
  );
  const protectedBeforeDigest = digestProtectedPaths(options.protectedPaths);
  const manifestDigest = rollbackDrillManifestDigest(options.manifest);
  const sandboxRootDigest = sha256Bytes(canonicalBytes({
    drill_id: options.manifest.drillId,
    root_identity: basename(sandboxRoot),
    protected_ids: options.protectedPaths.map((entry) => entry.id).sort(),
  }));

  const capsuleRoot = join(sandboxRoot, 'capsule');
  const controlRoot = join(sandboxRoot, 'control');
  const cutoverRoot = join(sandboxRoot, 'cutover');
  const capsuleLedgerRoot = join(capsuleRoot, 'ledger');
  const controlLedgerRoot = join(controlRoot, 'ledger');
  const cutoverLedgerRoot = join(cutoverRoot, 'ledger');
  const effectRoot = join(cutoverRoot, 'effects');
  const evidenceRoot = join(sandboxRoot, 'evidence');
  mkdirSync(capsuleLedgerRoot, { recursive: true, mode: 0o700 });
  mkdirSync(evidenceRoot, { recursive: true, mode: 0o700 });

  const startingAuthority = Object.freeze({
    state: 'cutover_ready' as const,
    epoch: options.manifest.startingAuthorityEpoch,
  });
  const capsuleHarness = new RollbackDrillLedgerHarness({
    rootDirectory: capsuleLedgerRoot,
    mode: options.manifest.mode,
    evidenceDigest: manifestDigest,
    authorityProvider: () => startingAuthority,
    now: () => options.clock.now(),
  });
  await capsuleHarness.appendFact(
    'sealed-anchor',
    options.manifest.rollbackAnchor.digest,
    options.manifest.legacyWriterId,
    startingAuthority.epoch,
  );
  const sealedHead = await capsuleHarness.ledger.getVerifiedHead();
  cloneLedgerRoot(capsuleLedgerRoot, controlLedgerRoot);
  cloneLedgerRoot(capsuleLedgerRoot, cutoverLedgerRoot);

  const store = new SandboxedAuthorityStore(
    join(cutoverRoot, 'authority'),
    options.manifest.mode,
    options.manifest.startingAuthorityEpoch,
    options.manifest.legacyWriterId,
    options.manifest.spineWriterId,
  );
  const controlClock = new LaneClock(options.clock.now());
  const cutoverClock = new LaneClock(options.clock.now());
  let controlHarness = new RollbackDrillLedgerHarness({
    rootDirectory: controlLedgerRoot,
    mode: options.manifest.mode,
    evidenceDigest: manifestDigest,
    authorityProvider: () => store.authoritySnapshot(),
    now: () => controlClock.now(),
  });
  const cutoverHarness = new RollbackDrillLedgerHarness({
    rootDirectory: cutoverLedgerRoot,
    mode: options.manifest.mode,
    evidenceDigest: manifestDigest,
    authorityProvider: () => store.authoritySnapshot(),
    now: () => cutoverClock.now(),
  });

  const timeline: DrillTimelineEntry[] = [];
  timeline.push(timelineEntry(DrillTimelineSteps.PREFLIGHT, options.clock.now(), store));
  const controlContinuationState = applyRollbackWorkload(
    options.manifest.rollbackAnchor.state,
    options.manifest.workload,
  );
  const controlReconstruction = reconstructRollbackState(
    options.manifest.rollbackAnchor.state,
    options.manifest.workload,
    options.manifest.classification,
  );
  const controlState = controlReconstruction.state;
  mkdirSync(controlRoot, { recursive: true, mode: 0o700 });
  writeLaneState(join(controlRoot, 'legacy-projection.json'), controlState);
  timeline.push(timelineEntry(DrillTimelineSteps.CONTROL_CONTINUED, advance(options), store));

  const effectFingerprintRunId = `${options.manifest.mode}-rollback-effect-anchor`;
  cutoverClock.synchronize(options.clock.now());
  const cutoverDerived = await cutoverHarness.deriveFingerprint(
    effectFingerprintRunId,
    sealedHead.sequence,
  );

  const forward = store.compareAndSwap({
    expectedState: 'cutover_ready',
    expectedEpoch: startingAuthority.epoch,
    nextState: 'new_authoritative_reversible',
    nextOwner: options.manifest.spineWriterId,
    at: advance(options).toISOString(),
  });
  const forwardCutoverReceiptId = sha256Bytes(canonicalBytes({
    action: 'test-cutover',
    state: forward.state,
    epoch: forward.epoch,
    revision: forward.revision,
  }));
  timeline.push(timelineEntry(DrillTimelineSteps.TEST_CUTOVER, options.clock.now(), store));
  if (!store.canWrite(options.manifest.spineWriterId, forward.epoch)) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.AUTHORITY_TRANSITION_FAILED,
      'Forward CAS did not grant the isolated spine writer at its new epoch',
    );
  }
  const forwardTransitionDigest = sha256Bytes(canonicalBytes({
    state: forward.state,
    epoch: forward.epoch,
    owner: forward.owner,
    revision: forward.revision,
  }));
  await appendLaneFact(
    controlHarness,
    cutoverHarness,
    controlClock,
    cutoverClock,
    options.clock.now(),
    'forward-cutover',
    forwardTransitionDigest,
    forwardTransitionDigest,
    options.manifest.spineWriterId,
    forward.epoch,
  );

  let candidateState = applyRollbackWorkload(
    options.manifest.rollbackAnchor.state,
    options.manifest.workload,
  );
  if (options.manifest.fault.fixture === RollbackFaultFixtures.REPLAY_FINGERPRINT_MISMATCH) {
    candidateState = Object.freeze({
      ...candidateState,
      facts: [...candidateState.facts, 'fault-replay-divergence'],
    });
  }
  const cutoverReconstruction = store.writeCutoverState(
    options.manifest.spineWriterId,
    forward.epoch,
    candidateState,
  );
  await appendLaneFact(
    controlHarness,
    cutoverHarness,
    controlClock,
    cutoverClock,
    options.clock.now(),
    'bounded-spine-work',
    rollbackLaneStateDigest(candidateState),
    rollbackLaneStateDigest(cutoverReconstruction.state),
    options.manifest.spineWriterId,
    forward.epoch,
  );
  timeline.push(timelineEntry(
    DrillTimelineSteps.SPINE_WORK_COMMITTED,
    advance(options),
    store,
  ));

  let candidateProjectionBytes = serializeLegacyJson(candidateState);
  if (options.manifest.fault.fixture === RollbackFaultFixtures.LEGACY_PROJECTION_MISMATCH) {
    candidateProjectionBytes = Buffer.concat([
      Buffer.from(candidateProjectionBytes),
      Buffer.from('\n', 'utf8'),
    ]);
  }
  let staleAuthorization: GatewayAuthorizationResult | null = null;
  if (options.manifest.fault.fixture === RollbackFaultFixtures.STALE_AUTHORITY_EPOCH) {
    controlClock.synchronize(options.clock.now());
    cutoverClock.synchronize(options.clock.now());
    const [, cutoverStaleAuthorization] = await Promise.all([
      controlHarness.tryAuthorizeFact(
        'stale-writer-probe',
        options.manifest.spineWriterId,
        startingAuthority.epoch,
      ),
      cutoverHarness.tryAuthorizeFact(
        'stale-writer-probe',
        options.manifest.spineWriterId,
        startingAuthority.epoch,
      ),
    ]);
    staleAuthorization = cutoverStaleAuthorization;
  }
  controlClock.synchronize(options.clock.now());
  cutoverClock.synchronize(options.clock.now());
  const effectStartedAt = options.clock.now().getTime();
  const effectScenarioResult = await runEffectScenario(
    { ...options, clock: cutoverClock },
    cutoverHarness,
    store,
    effectRoot,
    forward.epoch,
    cutoverDerived.descriptor.final_digest,
  );
  const effectEndedAt = cutoverClock.now().getTime();
  if (effectEndedAt > effectStartedAt) {
    options.clock.advance(effectEndedAt - effectStartedAt);
  }
  const effectsBeforeRollback = effectEvidence(await cutoverHarness.summarizeEffects());
  const detectedAt = options.clock.now();
  const observation = detectRegression(options.manifest.fault.fixture, {
    expectedState: controlContinuationState,
    candidateState,
    expectedProjectionBytes: serializeLegacyJson(controlContinuationState),
    candidateProjectionBytes,
    staleAuthorization,
    effects: effectsBeforeRollback,
    effectError: effectScenarioResult.error,
    effectStartedAt: effectScenarioResult.startedAt,
    detectedAt,
  });
  if (observation !== null) {
    timeline.push(timelineEntry(
      DrillTimelineSteps.REGRESSION_DETECTED,
      detectedAt,
      store,
    ));
  }

  const rollbackStartedAt = advance(options);
  const frozen = store.freezeAdmissions();
  const admissionFreezeReceiptId = sha256Bytes(canonicalBytes({
    action: 'admission-freeze',
    state: frozen.state,
    epoch: frozen.epoch,
    revision: frozen.revision,
  }));
  timeline.push(timelineEntry(DrillTimelineSteps.ADMISSION_FROZEN, rollbackStartedAt, store));
  const pending = store.compareAndSwap({
    expectedState: 'new_authoritative_reversible',
    expectedEpoch: frozen.epoch,
    nextState: 'rollback_pending',
    nextOwner: options.manifest.spineWriterId,
    at: advance(options).toISOString(),
  });
  const spineFenceReceiptId = sha256Bytes(canonicalBytes({
    action: 'spine-fence',
    state: pending.state,
    epoch: pending.epoch,
    revision: pending.revision,
  }));
  timeline.push(timelineEntry(DrillTimelineSteps.SPINE_FENCED, options.clock.now(), store));
  const pendingTransitionDigest = sha256Bytes(canonicalBytes({
    state: pending.state,
    epoch: pending.epoch,
    owner: pending.owner,
    revision: pending.revision,
  }));
  await appendLaneFact(
    controlHarness,
    cutoverHarness,
    controlClock,
    cutoverClock,
    options.clock.now(),
    'rollback-pending',
    pendingTransitionDigest,
    pendingTransitionDigest,
    options.manifest.spineWriterId,
    pending.epoch,
  );

  let reconciliationError: Error | null = null;
  controlClock.synchronize(options.clock.now());
  cutoverClock.synchronize(options.clock.now());
  try {
    await reconcileEffectIfNeeded(
      { ...options, clock: cutoverClock },
      effectScenarioResult,
      pending.epoch,
    );
  } catch (error: unknown) {
    reconciliationError = error instanceof Error ? error : new Error(String(error));
  }
  timeline.push(timelineEntry(DrillTimelineSteps.STATE_RECONCILED, advance(options), store));

  let restoredEpoch: number | null = null;
  let legacyRestoreReceiptId: string | null = null;
  let restorationError: Error | null = null;
  try {
    options.faultHooks?.beforeLegacyRestore?.();
    const restored = store.compareAndSwap({
      expectedState: 'rollback_pending',
      expectedEpoch: pending.epoch,
      nextState: 'legacy_authoritative',
      nextOwner: options.manifest.legacyWriterId,
      at: advance(options).toISOString(),
    });
    restoredEpoch = restored.epoch;
    store.restoreLegacyState(restored.epoch, controlReconstruction);
    options.faultHooks?.afterLegacyRestore?.();
    legacyRestoreReceiptId = sha256Bytes(canonicalBytes({
      action: 'legacy-restore',
      state: restored.state,
      epoch: restored.epoch,
      revision: restored.revision,
    }));
    timeline.push(timelineEntry(DrillTimelineSteps.LEGACY_RESTORED, options.clock.now(), store));
  } catch (error: unknown) {
    restorationError = error instanceof Error ? error : new Error(String(error));
  }

  const staleWriterDenied = !store.canWrite(
    options.manifest.spineWriterId,
    forward.epoch,
  );
  timeline.push(timelineEntry(DrillTimelineSteps.STALE_WRITER_DENIED, advance(options), store));

  let resumedReconstruction = cutoverReconstruction;
  let legacyResumedAt = options.clock.now();
  if (restoredEpoch !== null) {
    try {
      store.resumeLegacyAdmissions(restoredEpoch);
      if (!store.canWrite(options.manifest.legacyWriterId, restoredEpoch)) {
        throw new RollbackDrillError(
          RollbackDrillReasonCodes.AUTHORITY_TRANSITION_FAILED,
          'Restored legacy writer did not observe its new epoch',
        );
      }
      resumedReconstruction = store.readPersistedState();
      legacyResumedAt = advance(options);
      timeline.push(timelineEntry(DrillTimelineSteps.LEGACY_RESUMED, legacyResumedAt, store));
    } catch (error: unknown) {
      restorationError ??= error instanceof Error ? error : new Error(String(error));
    }
  }

  const proofAuthority = store.snapshot();
  // Fork after recovery so random authorization IDs cannot masquerade as state divergence.
  cloneLedgerRoot(cutoverLedgerRoot, controlLedgerRoot);
  controlHarness = new RollbackDrillLedgerHarness({
    rootDirectory: controlLedgerRoot,
    mode: options.manifest.mode,
    evidenceDigest: manifestDigest,
    authorityProvider: () => store.authoritySnapshot(),
    now: () => controlClock.now(),
  });
  const expectedRestoredAuthorityDigest = sha256Bytes(canonicalBytes({
    state: 'legacy_authoritative',
    epoch: options.manifest.startingAuthorityEpoch + 3,
    owner: options.manifest.legacyWriterId,
  }));
  const actualRestoredAuthorityDigest = sha256Bytes(canonicalBytes({
    state: proofAuthority.state,
    epoch: proofAuthority.epoch,
    owner: proofAuthority.owner,
  }));
  await appendLaneFact(
    controlHarness,
    cutoverHarness,
    controlClock,
    cutoverClock,
    options.clock.now(),
    'legacy-restored',
    expectedRestoredAuthorityDigest,
    actualRestoredAuthorityDigest,
    proofAuthority.owner,
    proofAuthority.epoch,
  );
  await appendLaneFact(
    controlHarness,
    cutoverHarness,
    controlClock,
    cutoverClock,
    options.clock.now(),
    'restored-state',
    rollbackStateReconstructionDigest(controlReconstruction),
    rollbackStateReconstructionDigest(resumedReconstruction),
    proofAuthority.owner,
    proofAuthority.epoch,
  );

  const controlRangeHead = await controlHarness.ledger.getVerifiedHead();
  const cutoverRangeHead = await cutoverHarness.ledger.getVerifiedHead();
  const [controlRange, resumedRange] = await Promise.all([
    controlHarness.inspectRangeCoverage(sealedHead.sequence, controlRangeHead.sequence),
    cutoverHarness.inspectRangeCoverage(sealedHead.sequence, cutoverRangeHead.sequence),
  ]);
  const replayRunId = `${options.manifest.mode}-rollback-restoration-range`;
  controlClock.synchronize(options.clock.now());
  cutoverClock.synchronize(options.clock.now());
  await Promise.all([
    controlHarness.deriveAndRecordFingerprint(
      replayRunId,
      controlRangeHead.sequence,
      proofAuthority.epoch,
    ),
    cutoverHarness.deriveAndRecordFingerprint(
      replayRunId,
      cutoverRangeHead.sequence,
      proofAuthority.epoch,
    ),
  ]);
  const [controlReplay, resumedReplay] = await Promise.all([
    controlHarness.verifyFingerprint(replayRunId, controlRangeHead.sequence),
    cutoverHarness.verifyFingerprint(replayRunId, cutoverRangeHead.sequence),
  ]);
  const replay = replayEvidence(controlReplay, resumedReplay, controlRange, resumedRange);
  const legacyProjection = projectionEvidence(
    controlReconstruction,
    store.readPersistedStateBytes(),
  );
  const effects = effectEvidence(await cutoverHarness.summarizeEffects());
  const controlLedgerEventCount = (await controlHarness.ledger.readVerifiedEvents()).length;
  const cutoverLedgerEventCount = (await cutoverHarness.ledger.readVerifiedEvents()).length;
  const cutoverHead = await cutoverHarness.ledger.getVerifiedHead();
  const state = stateEvidence(
    controlReconstruction,
    resumedReconstruction,
    controlLedgerEventCount,
    cutoverLedgerEventCount,
    cutoverHead.sequence,
  );
  const rollbackCompletedAt = options.clock.now();
  const timing = timingEvidence(
    options,
    detectedAt,
    rollbackStartedAt,
    rollbackCompletedAt,
    legacyResumedAt,
  );
  timeline.push(timelineEntry(DrillTimelineSteps.INTEGRITY_VERIFIED, advance(options), store));

  const protectedAfterDigest = digestProtectedPaths(options.protectedPaths);
  const preservedLedgerRoot = join(evidenceRoot, 'preserved-ledger');
  cloneLedgerRoot(cutoverLedgerRoot, preservedLedgerRoot);
  const cleanupAuthority = store.snapshot();
  rmSync(capsuleRoot, { recursive: true, force: true });
  rmSync(controlRoot, { recursive: true, force: true });
  rmSync(cutoverRoot, { recursive: true, force: true });
  const residualEntries = readdirSync(sandboxRoot).sort();
  timeline.push(Object.freeze({
    step: DrillTimelineSteps.CLEANUP_VERIFIED,
    at: advance(options).toISOString(),
    authorityState: cleanupAuthority.state,
    authorityEpoch: cleanupAuthority.epoch,
  }));
  const transcriptPath = join(evidenceRoot, 'drill-transcript.json');
  writeImmutableJson(transcriptPath, {
    drill_id: options.manifest.drillId,
    mode: options.manifest.mode,
    manifest_digest: manifestDigest,
    regression_evidence_digest: observation?.evidenceDigest ?? null,
    timeline,
    authority_transitions: [...store.transitions()],
    preserved_range: {
      ledger_id: cutoverHead.ledgerId,
      start_sequence: 1,
      end_sequence: cutoverHead.sequence,
      terminal_record_hash: cutoverHead.recordHash,
    },
  });
  const cleanup = Object.freeze({
    disposableStateRemoved: residualEntries.length === 1 && residualEntries[0] === 'evidence',
    evidencePreserved: existsSync(preservedLedgerRoot) && existsSync(transcriptPath),
    residualEntries,
  });
  const preservedEvidenceDigest = digestFilesystemTree(evidenceRoot);

  const reasons: RollbackDrillReasonCode[] = [];
  addReason(
    reasons,
    observation === null,
    RollbackDrillReasonCodes.REGRESSION_NOT_DETECTED,
  );
  addReason(
    reasons,
    observation !== null
      && observation.detector !== options.manifest.fault.expectedDetector,
    RollbackDrillReasonCodes.REGRESSION_CLASS_MISMATCH,
  );
  addReason(
    reasons,
    restorationError !== null || restoredEpoch === null,
    RollbackDrillReasonCodes.AUTHORITY_TRANSITION_FAILED,
  );
  addReason(
    reasons,
    reconciliationError !== null,
    RollbackDrillReasonCodes.RECONCILIATION_BLOCKED,
  );
  addReason(
    reasons,
    effects.conflictCount > 0,
    RollbackDrillReasonCodes.EFFECT_CONFLICT,
  );
  addReason(
    reasons,
    effects.operatorRequiredCount > 0 || effects.unresolvedIntentCount > 0,
    RollbackDrillReasonCodes.EFFECT_IN_DOUBT,
  );
  addReason(
    reasons,
    !replay.controlVerified
      || !replay.resumedVerified
      || !replay.effectiveEventDigestMatch
      || !replay.projectionDigestMatch
      || !completeReplayRange(replay.controlRange)
      || !completeReplayRange(replay.resumedRange),
    RollbackDrillReasonCodes.REPLAY_INTEGRITY_FAILED,
  );
  addReason(
    reasons,
    !legacyProjection.bytesMatch || !legacyProjection.readerResultMatch,
    RollbackDrillReasonCodes.PROJECTION_INTEGRITY_FAILED,
  );
  addReason(
    reasons,
    !state.stateDigestMatch
      || !state.reconstructionDigestMatch
      || state.expectedDispositionCount !== state.resumedDispositionCount
      || state.duplicateFactCount > 0
      || !state.cutoverEvidenceRetained,
    RollbackDrillReasonCodes.STATE_INTEGRITY_FAILED,
  );
  addReason(
    reasons,
    !timing.insidePolicyWindow || !timing.insideStricterDeadline,
    RollbackDrillReasonCodes.WINDOW_CLOSED,
  );
  addReason(
    reasons,
    protectedBeforeDigest !== protectedAfterDigest,
    RollbackDrillReasonCodes.PROTECTED_STATE_CHANGED,
  );
  addReason(
    reasons,
    !cleanup.disposableStateRemoved || !cleanup.evidencePreserved,
    RollbackDrillReasonCodes.CLEANUP_FAILED,
  );
  if (reasons.length === 0) reasons.push(RollbackDrillReasonCodes.PASSED);
  const passed = reasons.length === 1 && reasons[0] === RollbackDrillReasonCodes.PASSED;
  const finalAuthority = restoredEpoch === null
    ? null
    : { state: 'legacy_authoritative' as const, epoch: restoredEpoch };
  const facts: RollbackDrillCertificateFacts = Object.freeze({
    schemaVersion: ROLLBACK_CERTIFICATE_SCHEMA_VERSION,
    certificateId: `rollback-${manifestDigest.slice(0, 32)}`,
    drillId: options.manifest.drillId,
    mode: options.manifest.mode,
    baseSha: options.manifest.baseSha,
    candidateSha: options.manifest.candidateSha,
    policyVersion: options.manifest.policyVersion,
    manifestDigest,
    bindings: options.manifest.bindings,
    legacyWriterId: options.manifest.legacyWriterId,
    spineWriterId: options.manifest.spineWriterId,
    workloadDigest: rollbackWorkloadDigest(options.manifest.workload),
    forwardCutoverReceiptId,
    faultFixture: options.manifest.fault.fixture,
    faultCutPoint: options.manifest.fault.cutPoint,
    faultTimeoutMs: options.manifest.fault.timeoutMs,
    expectedDetector: options.manifest.fault.expectedDetector,
    observedDetector: observation?.detector ?? null,
    regressionEvidenceDigest: observation?.evidenceDigest ?? null,
    regressionDetected: observation !== null,
    passed,
    reasonCodes: reasons,
    timeline,
    authorityTransitions: [...store.transitions()],
    startingAuthorityEpoch: options.manifest.startingAuthorityEpoch,
    restoredAuthorityEpoch: finalAuthority?.epoch ?? null,
    restoredAuthorityState: finalAuthority?.state ?? null,
    staleWriterDenied,
    admissionFreezeReceiptId,
    spineFenceReceiptId,
    legacyRestoreReceiptId,
    classificationDigest: classificationManifestDigest(options.manifest.classification),
    dispositionCounts: resumedReconstruction.dispositionCounts,
    replay,
    legacyProjection,
    state,
    effects,
    timing,
    isolation: {
      protectedBeforeDigest,
      protectedAfterDigest,
      protectedStateUnchanged: protectedBeforeDigest === protectedAfterDigest,
      sandboxRootDigest,
      liveEffectCountDelta: 0,
    },
    cleanup,
    preservedLedgerRange: {
      ledger_id: cutoverHead.ledgerId,
      start_sequence: 1,
      end_sequence: cutoverHead.sequence,
      terminal_record_hash: cutoverHead.recordHash,
    },
    preservedEvidenceDigest,
    verifierIdentity: options.manifest.verifierIdentity,
    issuedAt: advance(options).toISOString(),
  });
  const certificate = await createRollbackDrillCertificate(
    facts,
    options.certificationProvider,
    options.certificationProfile,
  );
  const certificatePath = writeImmutableRollbackCertificate(
    evidenceRoot,
    `${options.manifest.mode}-${manifestDigest.slice(0, 16)}.rollback-certificate.json`,
    certificate,
  );
  return Object.freeze({ certificate, certificatePath });
}
