// ───────────────────────────────────────────────────────────────────
// MODULE: Rollback Drill Certificate
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  closeSync,
  existsSync,
  fsyncSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from 'node:fs';
import {
  dirname,
  isAbsolute,
  relative,
  resolve,
} from 'node:path';

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  RollbackDrillError,
} from './rollback-drill-contract.js';
import {
  DrillTimelineSteps,
  ROLLBACK_CERTIFICATE_SCHEMA_VERSION,
  RollbackDrillReasonCodes,
} from './rollback-drill-types.js';

import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  CertificationEnvelope,
  CertificationProfile,
  ReceiptCertificationProvider,
} from '../receipts-and-effect-recovery/index.js';
import type {
  Phase014RollbackEvidenceInput,
  Phase014RollbackEvidenceResult,
  RollbackDrillCertificate,
  RollbackDrillCertificateFacts,
  ReplayRangeCoverage,
} from './rollback-drill-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

function isContained(root: string, candidate: string): boolean {
  const pathFromRoot = relative(root, candidate);
  return pathFromRoot !== ''
    && !pathFromRoot.startsWith('..')
    && !isAbsolute(pathFromRoot);
}

function profileMatches(
  left: Readonly<CertificationProfile>,
  right: Readonly<CertificationProfile>,
): boolean {
  return canonicalJson(left) === canonicalJson(right);
}

function signingBytes(
  facts: Readonly<RollbackDrillCertificateFacts>,
  profile: Readonly<CertificationProfile>,
): Uint8Array {
  return Uint8Array.from(canonicalBytes({
    facts: facts as unknown as JsonObject,
    certification_profile: profile,
  }));
}

function parseSignature(base64: string): Uint8Array {
  const decoded = Buffer.from(base64, 'base64');
  if (
    decoded.length === 0
    || decoded.toString('base64').replace(/=+$/u, '') !== base64.replace(/=+$/u, '')
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.CERTIFICATE_INVALID,
      'Rollback certificate signature is not canonical base64',
    );
  }
  return Uint8Array.from(decoded);
}

function certificatePayloadDigest(
  facts: Readonly<RollbackDrillCertificateFacts>,
  certification: Readonly<CertificationEnvelope>,
): string {
  return sha256Bytes(canonicalBytes({
    facts: facts as unknown as JsonObject,
    certification,
  }));
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f0-9]{64}$/u.test(value);
}

function hasCompleteReplayRange(coverage: Readonly<ReplayRangeCoverage>): boolean {
  return coverage.rangeStartSequence === 1
    && coverage.rangeEndSequence > coverage.sealedHeadSequence
    && coverage.postDivergenceEventCount > 0
    && coverage.boundedSpineWorkCovered
    && coverage.effectEventsCovered
    && coverage.forwardCutoverCovered
    && coverage.rollbackTransitionCovered
    && coverage.restoredStateCovered;
}

function hasCompletePassingClosure(facts: Readonly<RollbackDrillCertificateFacts>): boolean {
  const transitions = facts.authorityTransitions;
  const first = transitions[0];
  const second = transitions[1];
  const third = transitions[2];
  const expectedTimeline = Object.values(DrillTimelineSteps);
  const actualTimeline = facts.timeline.map((entry) => entry.step);
  return facts.reasonCodes.length === 1
    && facts.reasonCodes[0] === RollbackDrillReasonCodes.PASSED
    && typeof facts.policyVersion === 'string'
    && facts.policyVersion.length > 0
    && typeof facts.faultCutPoint === 'string'
    && facts.faultCutPoint.length > 0
    && isDigest(facts.manifestDigest)
    && isDigest(facts.workloadDigest)
    && isDigest(facts.forwardCutoverReceiptId)
    && isDigest(facts.regressionEvidenceDigest)
    && isDigest(facts.admissionFreezeReceiptId)
    && isDigest(facts.spineFenceReceiptId)
    && isDigest(facts.legacyRestoreReceiptId)
    && transitions.length === 3
    && first?.fromState === 'cutover_ready'
    && first.toState === 'new_authoritative_reversible'
    && second?.fromState === 'new_authoritative_reversible'
    && second.toState === 'rollback_pending'
    && third?.fromState === 'rollback_pending'
    && third.toState === 'legacy_authoritative'
    && first.fromEpoch === facts.startingAuthorityEpoch
    && first.toEpoch === first.fromEpoch + 1
    && second.fromEpoch === first.toEpoch
    && second.toEpoch === second.fromEpoch + 1
    && third.fromEpoch === second.toEpoch
    && third.toEpoch === third.fromEpoch + 1
    && facts.restoredAuthorityEpoch === third.toEpoch
    && actualTimeline.length === expectedTimeline.length
    && actualTimeline.every((step, index) => step === expectedTimeline[index])
    && facts.dispositionCounts.BLOCK === 0
    && Object.values(facts.dispositionCounts).reduce((sum, count) => sum + count, 0)
      === facts.state.resumedDispositionCount
    && facts.state.expectedDispositionCount === facts.state.resumedDispositionCount
    && facts.state.reconstructionDigestMatch
    && hasCompleteReplayRange(facts.replay.controlRange)
    && hasCompleteReplayRange(facts.replay.resumedRange)
    && facts.state.cutoverEvidenceRetained
    && facts.state.preservedCutoverEventCount === facts.state.cutoverLedgerEventCount
    && facts.timing.elapsedMs >= 0;
}

function assertCertificateShape(value: unknown): asserts value is RollbackDrillCertificate {
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.CERTIFICATE_INVALID,
      'Rollback certificate must be a canonical object',
    );
  }
  const certificate = value as Partial<RollbackDrillCertificate>;
  if (
    Object.keys(value).sort().join(',') !== 'certificateDigest,certification,facts'
    || certificate.facts === undefined
    || certificate.certification === undefined
    || typeof certificate.certificateDigest !== 'string'
    || certificate.facts.schemaVersion !== ROLLBACK_CERTIFICATE_SCHEMA_VERSION
    || typeof certificate.facts.passed !== 'boolean'
    || typeof certificate.facts.mode !== 'string'
    || typeof certificate.certification.signature_base64 !== 'string'
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.CERTIFICATE_INVALID,
      'Rollback certificate is incomplete or uses an unregistered schema',
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. CERTIFICATE IO
// ───────────────────────────────────────────────────────────────────

/** Sign complete facts and create a certificate whose trust profile carries no key material. */
export async function createRollbackDrillCertificate(
  facts: Readonly<RollbackDrillCertificateFacts>,
  provider: ReceiptCertificationProvider,
  profile: Readonly<CertificationProfile>,
): Promise<RollbackDrillCertificate> {
  if (
    !profileMatches(provider.profile, profile)
    || profile.trust_scope !== 'durable-cross-resume'
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.CERTIFICATE_INVALID,
      'Rollback certificates require an exact durable cross-resume provider profile',
    );
  }
  const bytes = signingBytes(facts, profile);
  const signature = await provider.sign(bytes);
  if (signature.length === 0) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.CERTIFICATE_INVALID,
      'Rollback certificate provider returned an empty signature',
    );
  }
  const certification: CertificationEnvelope = Object.freeze({
    ...profile,
    signed_digest: sha256Bytes(bytes),
    signature_base64: Buffer.from(signature).toString('base64'),
  });
  return Object.freeze({
    facts,
    certification,
    certificateDigest: certificatePayloadDigest(facts, certification),
  });
}

/** Write once, fsync, and remove write bits so repeated issuance cannot replace evidence. */
export function writeImmutableRollbackCertificate(
  evidenceRoot: string,
  fileName: string,
  certificate: Readonly<RollbackDrillCertificate>,
): string {
  mkdirSync(evidenceRoot, { recursive: true, mode: 0o700 });
  const physicalRoot = realpathSync(evidenceRoot);
  const candidate = resolve(physicalRoot, fileName);
  if (!isContained(physicalRoot, candidate) || existsSync(candidate)) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.CERTIFICATE_INVALID,
      'Rollback certificate destination escaped its evidence root or already exists',
    );
  }
  const descriptor = openSync(candidate, 'wx', 0o400);
  try {
    writeFileSync(
      descriptor,
      Uint8Array.from(canonicalBytes(certificate as unknown as JsonObject)),
    );
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
  chmodSync(candidate, 0o400);
  const directoryDescriptor = openSync(dirname(candidate), 'r');
  try {
    fsyncSync(directoryDescriptor);
  } finally {
    closeSync(directoryDescriptor);
  }
  return candidate;
}

/** Read only regular immutable certificate files; symlink indirection is rejected. */
export function readRollbackDrillCertificate(path: string): RollbackDrillCertificate {
  const status = lstatSync(path);
  if (!status.isFile() || status.isSymbolicLink()) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.CERTIFICATE_INVALID,
      'Rollback certificate path must address one regular file',
    );
  }
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as JsonValue;
  assertCertificateShape(parsed);
  canonicalBytes(parsed);
  return parsed;
}

/** Verify digest, exact provider identity, durable scope, and signature bytes. */
export async function verifyRollbackDrillCertificate(
  certificate: Readonly<RollbackDrillCertificate>,
  provider: ReceiptCertificationProvider,
): Promise<void> {
  assertCertificateShape(certificate);
  const expectedCertificateDigest = certificatePayloadDigest(
    certificate.facts,
    certificate.certification,
  );
  const profile: CertificationProfile = Object.freeze({
    scheme: certificate.certification.scheme,
    provider_id: certificate.certification.provider_id,
    key_id: certificate.certification.key_id,
    verifier_version: certificate.certification.verifier_version,
    trust_scope: certificate.certification.trust_scope,
  });
  const bytes = signingBytes(certificate.facts, profile);
  if (
    certificate.certificateDigest !== expectedCertificateDigest
    || !profileMatches(provider.profile, profile)
    || profile.trust_scope !== 'durable-cross-resume'
    || certificate.certification.signed_digest !== sha256Bytes(bytes)
    || !await provider.verify(
      bytes,
      parseSignature(certificate.certification.signature_base64),
    )
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.CERTIFICATE_INVALID,
      'Rollback certificate digest, trust profile, or signature did not verify',
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. CUTOVER PREFLIGHT
// ───────────────────────────────────────────────────────────────────

/** Refuse real cutover unless one current, passing, fully verified mode certificate exists. */
export async function verifyPhase014RollbackEvidence(
  input: Readonly<Phase014RollbackEvidenceInput>,
): Promise<Phase014RollbackEvidenceResult> {
  try {
    const certificate = readRollbackDrillCertificate(input.certificatePath);
    await verifyRollbackDrillCertificate(certificate, input.certificationProvider);
    const facts = certificate.facts;
    if (facts.mode !== input.expectedMode) {
      return {
        ok: false,
        reasonCode: RollbackDrillReasonCodes.BINDING_DRIFT,
        message: 'Rollback certificate belongs to a different mode',
      };
    }
    if (canonicalJson(facts.bindings) !== canonicalJson(input.currentBindings)) {
      return {
        ok: false,
        reasonCode: RollbackDrillReasonCodes.BINDING_DRIFT,
        message: 'Rollback certificate input bindings are stale',
      };
    }
    const integrityPasses = facts.passed
      && hasCompletePassingClosure(facts)
      && facts.regressionDetected
      && facts.observedDetector === facts.expectedDetector
      && facts.restoredAuthorityState === 'legacy_authoritative'
      && facts.restoredAuthorityEpoch !== null
      && facts.staleWriterDenied
      && facts.replay.controlVerified
      && facts.replay.resumedVerified
      && facts.replay.effectiveEventDigestMatch
      && facts.replay.projectionDigestMatch
      && hasCompleteReplayRange(facts.replay.controlRange)
      && hasCompleteReplayRange(facts.replay.resumedRange)
      && facts.legacyProjection.bytesMatch
      && facts.legacyProjection.readerResultMatch
      && facts.state.stateDigestMatch
      && facts.state.reconstructionDigestMatch
      && facts.state.expectedDispositionCount === facts.state.resumedDispositionCount
      && facts.state.duplicateFactCount === 0
      && facts.effects.terminalExactlyOnce
      && facts.timing.insidePolicyWindow
      && facts.timing.insideStricterDeadline
      && facts.isolation.protectedStateUnchanged
      && facts.isolation.liveEffectCountDelta === 0
      && facts.cleanup.disposableStateRemoved
      && facts.cleanup.evidencePreserved;
    if (!integrityPasses) {
      return {
        ok: false,
        reasonCode: RollbackDrillReasonCodes.CERTIFICATE_INVALID,
        message: 'Rollback certificate is failed, partial, or lacks closure evidence',
      };
    }
    return { ok: true, certificate };
  } catch (error: unknown) {
    return {
      ok: false,
      reasonCode: error instanceof RollbackDrillError
        ? error.reasonCode
        : RollbackDrillReasonCodes.CERTIFICATE_INVALID,
      message: error instanceof Error
        ? error.message
        : 'Rollback certificate verification failed',
    };
  }
}
