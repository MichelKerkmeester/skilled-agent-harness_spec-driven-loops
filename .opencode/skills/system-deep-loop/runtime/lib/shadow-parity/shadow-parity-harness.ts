// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Parity Harness
// ───────────────────────────────────────────────────────────────────

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
} from 'node:fs';
import {
  basename,
  dirname,
  isAbsolute,
  parse,
  relative,
  resolve,
} from 'node:path';

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import { verifyReplayFingerprint } from '../replay-fingerprint/index.js';
import {
  SEALED_ARTIFACT_REPLAY_INPUT_KEY,
  artifactReferenceSetReplayInput,
  compareArtifactReferenceSets,
} from '../sealed-reference-artifacts/index.js';
import {
  MINIMUM_DETERMINISTIC_RUNS,
  ShadowParityError,
  ShadowParityErrorCodes,
} from './shadow-parity-types.js';

import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type { VerifiedReplayFingerprint } from '../replay-fingerprint/index.js';
import type {
  ParityCaseCapsule,
  ParityDivergenceClass,
  ParityDivergenceRecord,
  ParityExecutionContext,
  ParityFingerprintEvidence,
  ParityObservationClass,
  ParityPathExecution,
  ParityProjectionObservation,
  ParityRunEvidence,
  RunShadowParityCaseInput,
  ShadowEffectReceipt,
  ShadowEffectSink,
  ShadowParityCaseFailure,
  ShadowParityCaseResult,
  VerifiedParityCaseCapsule,
} from './shadow-parity-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. INTERNAL TYPES AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

const MAX_DIAGNOSTIC_LENGTH = 320;
const MAX_DETERMINISTIC_RUNS = 10;
const EXECUTION_ROOT_MODE = 0o700;

const DivergenceOwners: Readonly<Record<ParityDivergenceClass, string>> = Object.freeze({
  'input-inequivalent': 'sealed-input-owner',
  'harness-invalid': 'shadow-parity-harness',
  'replay-contract-drift': 'replay-contract-owner',
  'execution-outcome': 'mode-runtime-owner',
  'effective-event': 'ledger-transition-owner',
  'projection-semantic': 'projection-owner',
  'legacy-byte': 'legacy-projection-owner',
  'missing-observation': 'observation-boundary-owner',
  nondeterministic: 'first-differing-path-owner',
});

interface IsolationRoots {
  readonly legacy: string;
  readonly dark: string;
}

interface VerifiedPathOutput<TState extends JsonObject> {
  readonly execution: ParityPathExecution<TState>;
  readonly fingerprint: ParityFingerprintEvidence;
  readonly observationDigest: string;
  readonly projectionDigest: string;
  readonly pathEvidenceDigest: string;
}

interface ComparedPathOutput<TState extends JsonObject> {
  readonly verified: VerifiedPathOutput<TState> | null;
  readonly failure: ShadowParityCaseFailure | null;
}

// ───────────────────────────────────────────────────────────────────
// 2. DIGEST AND DIAGNOSTIC HELPERS
// ───────────────────────────────────────────────────────────────────

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonValue));
}

function bytesDigest(value: Uint8Array): string {
  return sha256Bytes(value);
}

function boundedMessage(value: unknown): string {
  const message = value instanceof Error ? value.message : String(value);
  return message.slice(0, MAX_DIAGNOSTIC_LENGTH);
}

function failure(
  input: RunShadowParityCaseInput<JsonObject>,
  divergenceClass: ParityDivergenceClass,
  runIndex: number,
  referenceSetDigest: string | null,
  component: string,
  expectedDigest: string | null,
  actualDigest: string | null,
  message: string,
  location: Readonly<{
    sequence?: number | null;
    hop?: number | null;
    stage?: string;
  }> = {},
): ShadowParityCaseFailure {
  const core = Object.freeze({
    caseId: input.caseDefinition.caseId,
    mode: input.caseDefinition.mode,
    class: divergenceClass,
    owner: DivergenceOwners[divergenceClass],
    runIndex,
    baseSha: input.legacy.capsule.baseSha,
    referenceSetDigest,
    expectedDigest,
    actualDigest,
    earliest: Object.freeze({
      component,
      sequence: location.sequence ?? null,
      hop: location.hop ?? null,
      stage: location.stage ?? component,
    }),
    message: boundedMessage(message),
    status: 'open' as const,
  });
  const divergence: ParityDivergenceRecord = Object.freeze({
    divergenceId: digest(core),
    ...core,
  });
  return Object.freeze({
    ok: false,
    caseId: input.caseDefinition.caseId,
    mode: input.caseDefinition.mode,
    divergence,
    openDivergenceCount: 1,
    authorityState: 'legacy_authoritative',
    authorityMutation: false,
  });
}

function asGenericInput<TState extends JsonObject>(
  input: RunShadowParityCaseInput<TState>,
): RunShadowParityCaseInput<JsonObject> {
  return input as unknown as RunShadowParityCaseInput<JsonObject>;
}

// ───────────────────────────────────────────────────────────────────
// 3. ISOLATION AND EFFECT SINKS
// ───────────────────────────────────────────────────────────────────

function prospectiveRealPath(path: string): string {
  const absolute = resolve(path);
  const missingSegments: string[] = [];
  let cursor = absolute;
  while (!existsSync(cursor)) {
    const parent = dirname(cursor);
    if (parent === cursor) break;
    missingSegments.unshift(basename(cursor));
    cursor = parent;
  }
  const physicalPrefix = realpathSync(cursor);
  return resolve(physicalPrefix, ...missingSegments);
}

function containsPath(parent: string, candidate: string): boolean {
  const pathFromParent = relative(parent, candidate);
  return pathFromParent === ''
    || (!pathFromParent.startsWith('..') && !isAbsolute(pathFromParent));
}

function createIsolationRoots<TState extends JsonObject>(
  input: RunShadowParityCaseInput<TState>,
  runIndex: number,
): IsolationRoots {
  if (!Array.isArray(input.protectedRoots) || input.protectedRoots.length === 0) {
    throw new ShadowParityError(
      ShadowParityErrorCodes.ISOLATION_FAILURE,
      'Shadow execution requires at least one declared protected authority root',
    );
  }
  const shadowCandidate = prospectiveRealPath(input.shadowRootDirectory);
  if (shadowCandidate === parse(shadowCandidate).root) {
    throw new ShadowParityError(
      ShadowParityErrorCodes.ISOLATION_FAILURE,
      'Shadow execution root cannot be a filesystem root',
    );
  }
  for (const protectedRoot of input.protectedRoots) {
    const protectedCandidate = prospectiveRealPath(protectedRoot);
    if (
      containsPath(protectedCandidate, shadowCandidate)
      || containsPath(shadowCandidate, protectedCandidate)
    ) {
      throw new ShadowParityError(
        ShadowParityErrorCodes.ISOLATION_FAILURE,
        'Shadow execution root collides with a protected authority root',
      );
    }
  }

  mkdirSync(shadowCandidate, { recursive: true, mode: EXECUTION_ROOT_MODE });
  const physicalShadowRoot = realpathSync(shadowCandidate);
  const safeCaseId = input.caseDefinition.caseId.replace(/[^A-Za-z0-9._-]/g, '-');
  const legacy = mkdtempSync(
    resolve(physicalShadowRoot, `${safeCaseId}-run-${runIndex}-legacy-`),
  );
  const dark = mkdtempSync(
    resolve(physicalShadowRoot, `${safeCaseId}-run-${runIndex}-dark-`),
  );
  if (
    legacy === dark
    || !containsPath(physicalShadowRoot, legacy)
    || !containsPath(physicalShadowRoot, dark)
  ) {
    throw new ShadowParityError(
      ShadowParityErrorCodes.ISOLATION_FAILURE,
      'Harness failed to create independent roots below the shadow boundary',
    );
  }
  return Object.freeze({ legacy, dark });
}

/** Create a process-local sink that records canonical intent without dispatching an effect. */
export function createShadowEffectSink(): ShadowEffectSink {
  const recorded: ShadowEffectReceipt[] = [];
  return Object.freeze({
    record(intent: JsonValue): ShadowEffectReceipt {
      const intentDigest = digest(intent);
      const receipt = Object.freeze({
        intent_digest: intentDigest,
        receipt_digest: digest({ intent_digest: intentDigest, status: 'suppressed' }),
        status: 'suppressed' as const,
      });
      recorded.push(receipt);
      return receipt;
    },
    receipts(): readonly ShadowEffectReceipt[] {
      return Object.freeze([...recorded]);
    },
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. SEALED INPUT PREFLIGHT
// ───────────────────────────────────────────────────────────────────

function comparableCapsule(
  capsule: ParityCaseCapsule,
  replayInputDigest: string,
): JsonObject {
  return {
    base_sha: capsule.baseSha,
    base_digest: capsule.baseDigest,
    initial_state_digest: capsule.initialStateDigest,
    configuration_digest: capsule.configurationDigest,
    canonicalization_versions: { ...capsule.canonicalizationVersions },
    reference_set_digest: capsule.artifactReferenceSet.reference_set_digest,
    sealed_replay_input_digest: replayInputDigest,
    timeout_ms: capsule.timeoutMs,
    termination_policy: capsule.terminationPolicy,
  };
}

async function verifyInputEquivalence<TState extends JsonObject>(
  input: RunShadowParityCaseInput<TState>,
): Promise<
  | { readonly ok: true; readonly capsule: VerifiedParityCaseCapsule }
  | { readonly ok: false; readonly failure: ShadowParityCaseFailure }
> {
  const genericInput = asGenericInput(input);
  let legacyReplayInput;
  let darkReplayInput;
  try {
    [legacyReplayInput, darkReplayInput] = await Promise.all([
      artifactReferenceSetReplayInput(
        input.legacy.ledger,
        input.legacy.store,
        input.legacy.capsule.artifactReferenceSet,
      ),
      artifactReferenceSetReplayInput(
        input.dark.ledger,
        input.dark.store,
        input.dark.capsule.artifactReferenceSet,
      ),
    ]);
  } catch (error: unknown) {
    return Object.freeze({
      ok: false,
      failure: failure(
        genericInput,
        'input-inequivalent',
        0,
        null,
        'sealed-input-verification',
        input.legacy.capsule.artifactReferenceSet.reference_set_digest,
        input.dark.capsule.artifactReferenceSet.reference_set_digest,
        `Sealed input verification failed: ${boundedMessage(error)}`,
      ),
    });
  }

  const referenceSetComparison = compareArtifactReferenceSets(
    input.legacy.capsule.artifactReferenceSet,
    input.dark.capsule.artifactReferenceSet,
  );
  const legacyComparable = comparableCapsule(
    input.legacy.capsule,
    legacyReplayInput.digest,
  );
  const darkComparable = comparableCapsule(
    input.dark.capsule,
    darkReplayInput.digest,
  );
  const legacyDigest = digest(legacyComparable);
  const darkDigest = digest(darkComparable);
  if (
    !referenceSetComparison.ok
    || legacyReplayInput.digest !== darkReplayInput.digest
    || legacyDigest !== darkDigest
    || input.caseDefinition.timeoutMs !== input.legacy.capsule.timeoutMs
    || input.caseDefinition.terminationPolicy
      !== input.legacy.capsule.terminationPolicy
  ) {
    return Object.freeze({
      ok: false,
      failure: failure(
        genericInput,
        'input-inequivalent',
        0,
        null,
        'sealed-case-capsule',
        legacyDigest,
        darkDigest,
        'Legacy and dark paths did not present the same verified case capsule',
      ),
    });
  }

  const capsule: VerifiedParityCaseCapsule = Object.freeze({
    capsuleDigest: legacyDigest,
    referenceSetDigest: input.legacy.capsule.artifactReferenceSet.reference_set_digest,
    replayInput: legacyReplayInput,
    baseSha: input.legacy.capsule.baseSha,
    baseDigest: input.legacy.capsule.baseDigest,
    initialStateDigest: input.legacy.capsule.initialStateDigest,
    configurationDigest: input.legacy.capsule.configurationDigest,
    canonicalizationVersions: Object.freeze({
      ...input.legacy.capsule.canonicalizationVersions,
    }),
    timeoutMs: input.legacy.capsule.timeoutMs,
    terminationPolicy: input.legacy.capsule.terminationPolicy,
  });
  return Object.freeze({ ok: true, capsule });
}

// ───────────────────────────────────────────────────────────────────
// 5. EXECUTION AND CAPTURE VERIFICATION
// ───────────────────────────────────────────────────────────────────

async function executeWithTimeout<TState extends JsonObject>(
  executor: RunShadowParityCaseInput<TState>['executeLegacy'],
  context: Omit<ParityExecutionContext, 'signal'>,
  timeoutMs: number,
): Promise<ParityPathExecution<TState>> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | null = null;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error(`Parity execution exceeded ${timeoutMs}ms`));
    }, timeoutMs);
  });
  try {
    return await Promise.race([
      executor(Object.freeze({ ...context, signal: controller.signal })),
      timeout,
    ]);
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}

function requiredCaptureFailure<TState extends JsonObject>(
  input: RunShadowParityCaseInput<TState>,
  execution: ParityPathExecution<TState>,
  sink: ShadowEffectSink,
  path: 'dark' | 'legacy',
  runIndex: number,
  referenceSetDigest: string,
): ShadowParityCaseFailure | null {
  const required = input.caseDefinition.requiredObservations;
  const captured = Object.keys(execution.observations);
  for (const observation of required) {
    if (!Object.prototype.hasOwnProperty.call(execution.observations, observation)) {
      return failure(
        asGenericInput(input),
        'missing-observation',
        runIndex,
        referenceSetDigest,
        observation,
        digest(required),
        digest(captured),
        `${path} path omitted a required observable`,
      );
    }
  }
  const extra = captured.find((entry) => !required.includes(entry as ParityObservationClass));
  if (extra) {
    return failure(
      asGenericInput(input),
      'harness-invalid',
      runIndex,
      referenceSetDigest,
      'observation-boundary',
      digest(required),
      digest(captured),
      `${path} path captured an undeclared observable`,
    );
  }
  if (
    required.includes('effect-receipts')
    && digest(execution.observations['effect-receipts']) !== digest(sink.receipts())
  ) {
    return failure(
      asGenericInput(input),
      'harness-invalid',
      runIndex,
      referenceSetDigest,
      'effect-receipts',
      digest(sink.receipts()),
      digest(execution.observations['effect-receipts']),
      `${path} path effect observation did not come from the suppressing sink`,
    );
  }

  const projectionIds = execution.projections.map((entry) => entry.artifactId);
  if (
    projectionIds.length !== input.caseDefinition.projectionIds.length
    || new Set(projectionIds).size !== projectionIds.length
    || input.caseDefinition.projectionIds.some((entry) => !projectionIds.includes(entry))
  ) {
    return failure(
      asGenericInput(input),
      'missing-observation',
      runIndex,
      referenceSetDigest,
      'legacy-projections',
      digest(input.caseDefinition.projectionIds),
      digest(projectionIds),
      `${path} path did not capture the complete declared projection set`,
    );
  }
  return null;
}

function fingerprintEvidence<TState extends JsonObject>(
  verified: VerifiedReplayFingerprint<TState>,
): ParityFingerprintEvidence {
  const descriptor = verified.descriptor;
  const replayContract = {
    fingerprint_version: descriptor.fingerprint_version,
    hash_algorithm: descriptor.hash_algorithm,
    canonicalization_algorithm: descriptor.canonicalization_algorithm,
    envelope_registry_digest: descriptor.envelope_registry_digest,
    observed_event_type_versions: descriptor.observed_event_type_versions,
    upcaster_registry_digest: descriptor.upcaster_registry_digest,
    ordered_chain_identities: descriptor.ordered_chain_identities,
    reducer_id: descriptor.reducer_id,
    reducer_version: descriptor.reducer_version,
    projection_schema_version: descriptor.projection_schema_version,
    replay_input_digests: descriptor.replay_input_digests,
  };
  return Object.freeze({
    finalDigest: descriptor.final_digest,
    descriptorDigest: bytesDigest(verified.descriptorBytes),
    storedDigest: descriptor.stored_bytes_digest,
    effectiveEventDigest: descriptor.effective_event_digest,
    projectionDigest: descriptor.projection_digest,
    replayContractDigest: digest(replayContract),
    sealedInputDigest:
      descriptor.replay_input_digests[SEALED_ARTIFACT_REPLAY_INPUT_KEY] ?? '',
    attestationSequence: verified.attestationSequence,
    descriptor,
  });
}

function projectionDigest(
  projections: readonly ParityProjectionObservation[],
): string {
  return digest(projections.map((projection) => ({
    artifact_id: projection.artifactId,
    byte_length: projection.bytes.byteLength,
    bytes_digest: bytesDigest(projection.bytes),
    reader_result: projection.readerResult,
    publication_boundary: projection.publicationBoundary,
    watermark_digest: projection.watermarkDigest,
    integrity_digest: projection.integrityDigest,
  })));
}

function observationDigest<TState extends JsonObject>(
  input: RunShadowParityCaseInput<TState>,
  execution: ParityPathExecution<TState>,
): string {
  return digest(input.caseDefinition.requiredObservations.map((observation) => ({
    observation,
    value: execution.observations[observation] ?? null,
  })));
}

async function verifyPathOutput<TState extends JsonObject>(
  input: RunShadowParityCaseInput<TState>,
  execution: ParityPathExecution<TState>,
  sink: ShadowEffectSink,
  path: 'dark' | 'legacy',
  runIndex: number,
  capsule: VerifiedParityCaseCapsule,
): Promise<ComparedPathOutput<TState>> {
  const captureFailure = requiredCaptureFailure(
    input,
    execution,
    sink,
    path,
    runIndex,
    capsule.referenceSetDigest,
  );
  if (captureFailure) {
    return Object.freeze({ verified: null, failure: captureFailure });
  }
  const verification = await verifyReplayFingerprint({
    ...execution.verification,
    consumer: 'shadow-parity',
  });
  if (!verification.ok) {
    return Object.freeze({
      verified: null,
      failure: failure(
        asGenericInput(input),
        'replay-contract-drift',
        runIndex,
        capsule.referenceSetDigest,
        verification.failure.component,
        verification.failure.expectedDigest,
        verification.failure.actualDigest,
        `${path} path replay fingerprint did not verify: ${verification.failure.message}`,
        {
          sequence: verification.failure.earliestDivergence.sequence,
          hop: verification.failure.earliestDivergence.hop,
          stage: verification.failure.earliestDivergence.stage,
        },
      ),
    });
  }
  const fingerprint = fingerprintEvidence(verification.verified);
  if (fingerprint.sealedInputDigest !== capsule.replayInput.digest) {
    return Object.freeze({
      verified: null,
      failure: failure(
        asGenericInput(input),
        'input-inequivalent',
        runIndex,
        capsule.referenceSetDigest,
        'sealed-replay-input',
        capsule.replayInput.digest,
        fingerprint.sealedInputDigest || null,
        `${path} path fingerprint was not bound to the verified sealed inputs`,
      ),
    });
  }
  const capturedObservationDigest = observationDigest(input, execution);
  const capturedProjectionDigest = projectionDigest(execution.projections);
  const pathEvidenceDigest = digest({
    fingerprint: {
      final_digest: fingerprint.finalDigest,
      descriptor_digest: fingerprint.descriptorDigest,
      stored_digest: fingerprint.storedDigest,
      effective_event_digest: fingerprint.effectiveEventDigest,
      projection_digest: fingerprint.projectionDigest,
      replay_contract_digest: fingerprint.replayContractDigest,
      sealed_input_digest: fingerprint.sealedInputDigest,
    },
    observation_digest: capturedObservationDigest,
    legacy_projection_digest: capturedProjectionDigest,
  });
  return Object.freeze({
    verified: Object.freeze({
      execution,
      fingerprint,
      observationDigest: capturedObservationDigest,
      projectionDigest: capturedProjectionDigest,
      pathEvidenceDigest,
    }),
    failure: null,
  });
}

// ───────────────────────────────────────────────────────────────────
// 6. PATH COMPARISON
// ───────────────────────────────────────────────────────────────────

function observationDivergenceClass(
  observation: ParityObservationClass,
): ParityDivergenceClass {
  if (
    observation === 'emitted-artifacts'
    || observation === 'reader-results'
  ) {
    return 'projection-semantic';
  }
  if (
    observation === 'ordered-transitions'
    || observation === 'effect-receipts'
    || observation === 'budgets'
  ) {
    return 'effective-event';
  }
  return 'execution-outcome';
}

function compareProjectionBytes<TState extends JsonObject>(
  input: RunShadowParityCaseInput<TState>,
  legacy: VerifiedPathOutput<TState>,
  dark: VerifiedPathOutput<TState>,
  runIndex: number,
  referenceSetDigest: string,
): ShadowParityCaseFailure | null {
  const legacyById = new Map(
    legacy.execution.projections.map((entry) => [entry.artifactId, entry]),
  );
  const darkById = new Map(
    dark.execution.projections.map((entry) => [entry.artifactId, entry]),
  );
  for (const artifactId of input.caseDefinition.projectionIds) {
    const expected = legacyById.get(artifactId);
    const actual = darkById.get(artifactId);
    if (!expected || !actual) continue;
    if (Buffer.compare(Buffer.from(expected.bytes), Buffer.from(actual.bytes)) !== 0) {
      return failure(
        asGenericInput(input),
        'legacy-byte',
        runIndex,
        referenceSetDigest,
        artifactId,
        bytesDigest(expected.bytes),
        bytesDigest(actual.bytes),
        'Dark projection bytes differ from the authoritative legacy bytes',
      );
    }
    const expectedReader = digest(expected.readerResult);
    const actualReader = digest(actual.readerResult);
    if (expectedReader !== actualReader) {
      return failure(
        asGenericInput(input),
        'projection-semantic',
        runIndex,
        referenceSetDigest,
        `${artifactId}:reader-result`,
        expectedReader,
        actualReader,
        'Dark and legacy readers produced different results from equal bytes',
      );
    }
    const expectedBoundary = digest({
      publication_boundary: expected.publicationBoundary,
      watermark_digest: expected.watermarkDigest,
      integrity_digest: expected.integrityDigest,
    });
    const actualBoundary = digest({
      publication_boundary: actual.publicationBoundary,
      watermark_digest: actual.watermarkDigest,
      integrity_digest: actual.integrityDigest,
    });
    if (expectedBoundary !== actualBoundary) {
      return failure(
        asGenericInput(input),
        'legacy-byte',
        runIndex,
        referenceSetDigest,
        `${artifactId}:publication-boundary`,
        expectedBoundary,
        actualBoundary,
        'Dark projection publication or integrity boundary differs from legacy',
      );
    }
  }
  return null;
}

function compareVerifiedPaths<TState extends JsonObject>(
  input: RunShadowParityCaseInput<TState>,
  legacy: VerifiedPathOutput<TState>,
  dark: VerifiedPathOutput<TState>,
  runIndex: number,
  referenceSetDigest: string,
): ShadowParityCaseFailure | null {
  const fingerprintComparisons: readonly Readonly<{
    class: ParityDivergenceClass;
    component: string;
    expected: string;
    actual: string;
  }>[] = [
    {
      class: 'replay-contract-drift',
      component: 'replay-contract',
      expected: legacy.fingerprint.replayContractDigest,
      actual: dark.fingerprint.replayContractDigest,
    },
    {
      class: 'effective-event',
      component: 'stored',
      expected: legacy.fingerprint.storedDigest,
      actual: dark.fingerprint.storedDigest,
    },
    {
      class: 'effective-event',
      component: 'effective-event',
      expected: legacy.fingerprint.effectiveEventDigest,
      actual: dark.fingerprint.effectiveEventDigest,
    },
    {
      class: 'projection-semantic',
      component: 'projection',
      expected: legacy.fingerprint.projectionDigest,
      actual: dark.fingerprint.projectionDigest,
    },
  ];
  for (const comparison of fingerprintComparisons) {
    if (comparison.expected !== comparison.actual) {
      return failure(
        asGenericInput(input),
        comparison.class,
        runIndex,
        referenceSetDigest,
        comparison.component,
        comparison.expected,
        comparison.actual,
        `Verified ${comparison.component} fingerprint components diverged`,
      );
    }
  }

  for (const observation of input.caseDefinition.requiredObservations) {
    const expected = digest(legacy.execution.observations[observation]);
    const actual = digest(dark.execution.observations[observation]);
    if (expected !== actual) {
      return failure(
        asGenericInput(input),
        observationDivergenceClass(observation),
        runIndex,
        referenceSetDigest,
        observation,
        expected,
        actual,
        `Legacy and dark ${observation} observations diverged`,
      );
    }
  }
  return compareProjectionBytes(
    input,
    legacy,
    dark,
    runIndex,
    referenceSetDigest,
  );
}

// ───────────────────────────────────────────────────────────────────
// 7. PUBLIC HARNESS
// ───────────────────────────────────────────────────────────────────

/** Run both paths on one verified capsule and fail closed on the first mismatch. */
export async function runShadowParityCase<TState extends JsonObject>(
  input: RunShadowParityCaseInput<TState>,
): Promise<ShadowParityCaseResult> {
  const deterministicRuns = input.deterministicRuns ?? MINIMUM_DETERMINISTIC_RUNS;
  if (
    !Number.isSafeInteger(deterministicRuns)
    || deterministicRuns < MINIMUM_DETERMINISTIC_RUNS
    || deterministicRuns > MAX_DETERMINISTIC_RUNS
  ) {
    return failure(
      asGenericInput(input),
      'harness-invalid',
      0,
      null,
      'deterministic-runs',
      String(MINIMUM_DETERMINISTIC_RUNS),
      String(deterministicRuns),
      'Parity requires a bounded repeated execution count',
    );
  }

  const preflight = await verifyInputEquivalence(input);
  if (!preflight.ok) return preflight.failure;
  const runEvidence: ParityRunEvidence[] = [];
  let priorLegacyDigest: string | null = null;
  let priorDarkDigest: string | null = null;

  for (let runIndex = 1; runIndex <= deterministicRuns; runIndex += 1) {
    let roots: IsolationRoots;
    try {
      roots = createIsolationRoots(input, runIndex);
    } catch (error: unknown) {
      return failure(
        asGenericInput(input),
        'harness-invalid',
        runIndex,
        preflight.capsule.referenceSetDigest,
        'isolation-root',
        null,
        null,
        boundedMessage(error),
      );
    }

    const legacySink = createShadowEffectSink();
    const darkSink = createShadowEffectSink();
    let legacyExecution: ParityPathExecution<TState>;
    let darkExecution: ParityPathExecution<TState>;
    try {
      [legacyExecution, darkExecution] = await Promise.all([
        executeWithTimeout(input.executeLegacy, {
          path: 'legacy',
          caseDefinition: input.caseDefinition,
          executionRoot: roots.legacy,
          capsule: preflight.capsule,
          effectSink: legacySink,
          runIndex,
        }, preflight.capsule.timeoutMs),
        executeWithTimeout(input.executeDark, {
          path: 'dark',
          caseDefinition: input.caseDefinition,
          executionRoot: roots.dark,
          capsule: preflight.capsule,
          effectSink: darkSink,
          runIndex,
        }, preflight.capsule.timeoutMs),
      ]);
    } catch (error: unknown) {
      return failure(
        asGenericInput(input),
        'execution-outcome',
        runIndex,
        preflight.capsule.referenceSetDigest,
        'execution',
        null,
        digest(boundedMessage(error)),
        `Parity path failed or timed out: ${boundedMessage(error)}`,
      );
    }

    const [legacyResult, darkResult] = await Promise.all([
      verifyPathOutput(
        input,
        legacyExecution,
        legacySink,
        'legacy',
        runIndex,
        preflight.capsule,
      ),
      verifyPathOutput(
        input,
        darkExecution,
        darkSink,
        'dark',
        runIndex,
        preflight.capsule,
      ),
    ]);
    if (legacyResult.failure) return legacyResult.failure;
    if (darkResult.failure) return darkResult.failure;
    if (!legacyResult.verified || !darkResult.verified) {
      return failure(
        asGenericInput(input),
        'harness-invalid',
        runIndex,
        preflight.capsule.referenceSetDigest,
        'verified-output',
        null,
        null,
        'Harness produced neither trusted evidence nor a typed failure',
      );
    }

    if (
      priorLegacyDigest !== null
      && priorLegacyDigest !== legacyResult.verified.pathEvidenceDigest
    ) {
      return failure(
        asGenericInput(input),
        'nondeterministic',
        runIndex,
        preflight.capsule.referenceSetDigest,
        'legacy-rerun',
        priorLegacyDigest,
        legacyResult.verified.pathEvidenceDigest,
        'Legacy path changed across identical sealed-case reruns',
      );
    }
    if (
      priorDarkDigest !== null
      && priorDarkDigest !== darkResult.verified.pathEvidenceDigest
    ) {
      return failure(
        asGenericInput(input),
        'nondeterministic',
        runIndex,
        preflight.capsule.referenceSetDigest,
        'dark-rerun',
        priorDarkDigest,
        darkResult.verified.pathEvidenceDigest,
        'Dark path changed across identical sealed-case reruns',
      );
    }
    priorLegacyDigest = legacyResult.verified.pathEvidenceDigest;
    priorDarkDigest = darkResult.verified.pathEvidenceDigest;

    const comparisonFailure = compareVerifiedPaths(
      input,
      legacyResult.verified,
      darkResult.verified,
      runIndex,
      preflight.capsule.referenceSetDigest,
    );
    if (comparisonFailure) return comparisonFailure;

    const evidenceCore = {
      run_index: runIndex,
      legacy_path_digest: legacyResult.verified.pathEvidenceDigest,
      dark_path_digest: darkResult.verified.pathEvidenceDigest,
      observation_digest: legacyResult.verified.observationDigest,
      legacy_projection_digest: legacyResult.verified.projectionDigest,
      dark_projection_digest: darkResult.verified.projectionDigest,
    };
    runEvidence.push(Object.freeze({
      runIndex,
      legacy: legacyResult.verified.fingerprint,
      dark: darkResult.verified.fingerprint,
      observationDigest: legacyResult.verified.observationDigest,
      legacyProjectionDigest: legacyResult.verified.projectionDigest,
      darkProjectionDigest: darkResult.verified.projectionDigest,
      runEvidenceDigest: digest(evidenceCore),
    }));
  }

  const evidenceDigest = digest({
    case_id: input.caseDefinition.caseId,
    mode: input.caseDefinition.mode,
    capsule_digest: preflight.capsule.capsuleDigest,
    run_evidence_digests: runEvidence.map((entry) => entry.runEvidenceDigest),
  });
  return Object.freeze({
    ok: true,
    caseId: input.caseDefinition.caseId,
    mode: input.caseDefinition.mode,
    referenceSetDigest: preflight.capsule.referenceSetDigest,
    capsuleDigest: preflight.capsule.capsuleDigest,
    runs: Object.freeze(runEvidence),
    evidenceDigest,
    openDivergenceCount: 0,
    authorityState: 'legacy_authoritative',
    authorityMutation: false,
  });
}
