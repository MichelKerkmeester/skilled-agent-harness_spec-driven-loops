// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Certificate Validation
// ───────────────────────────────────────────────────────────────────

import {
  parseDeepResearchSealedArtifactBinding,
} from '../deep-research-sealed-artifacts/index.js';
import {
  DeepResearchCertificateError,
  DeepResearchCertificateFailureCodes,
  DeepResearchTransitionKinds,
} from './deep-research-certificate-types.js';

import type { BoundaryReceiptPayload } from '../receipts-and-effect-recovery/index.js';
import type {
  DeepResearchCertificateArtifactClaim,
  DeepResearchCertificateBundle,
  DeepResearchCertificateConvergenceEvidence,
  DeepResearchCertificateStatusEvidence,
  DeepResearchRunCertificate,
  DeepResearchRunCertificateBody,
  DeepResearchTransitionReceipt,
  DeepResearchTransitionReceiptFacts,
} from './deep-research-certificate-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED FIELD RULES
// ───────────────────────────────────────────────────────────────────

type FieldRule =
  | { readonly kind: 'base64' }
  | { readonly kind: 'boolean' }
  | { readonly kind: 'digest'; readonly nullable?: boolean }
  | { readonly kind: 'enum'; readonly values: ReadonlySet<string> }
  | { readonly kind: 'integer'; readonly minimum: number }
  | { readonly kind: 'prose'; readonly nullable?: boolean }
  | { readonly kind: 'qualified-digest' }
  | { readonly kind: 'timestamp' }
  | { readonly kind: 'token'; readonly nullable?: boolean };

const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/+~-]{0,255}$/u;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/u;
const QUALIFIED_DIGEST_PATTERN = /^[a-z0-9-]+:[a-f0-9]{64}$/u;
const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u;
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u;

const TRANSITION_KINDS = new Set(Object.values(DeepResearchTransitionKinds));
const TRANSITION_DISPOSITIONS = new Set([
  'applied',
  'blocked',
  'failed',
  'in_doubt',
  'incomplete',
  'quarantined',
  'succeeded',
]);
const LIFECYCLE_RESULTS = new Set([
  'blocked',
  'failed',
  'incomplete',
  'quarantined',
  'trusted-completion',
]);
const CONVERGENCE_ELIGIBILITIES = new Set(['CONTINUE', 'STOP_ELIGIBLE', 'INDETERMINATE']);
const CONVERGENCE_OUTCOMES = new Set([
  'active',
  'blocked',
  'converged',
  'incomplete',
  'quarantined',
]);
const MODE_STATUSES = new Set([
  'planned',
  'active',
  'paused',
  'awaiting-evidence',
  'converged',
  'incomplete',
  'blocked',
  'quarantined',
  'failed',
]);
const BOUNDARY_KINDS = new Set([
  'mode-abort',
  'mode-completion',
  'mode-enter',
  'mode-handoff',
  'mode-pause',
  'mode-resume',
  'phase-abort',
  'phase-completion',
  'phase-enter',
  'phase-handoff',
  'phase-pause',
  'phase-resume',
]);
const BOUNDARY_SCOPES = new Set(['mode', 'phase']);
const TRUST_SCOPES = new Set(['durable-cross-resume', 'process-local-advisory']);

function invalid(location: string, failureReason: string): never {
  throw new DeepResearchCertificateError(
    DeepResearchCertificateFailureCodes.CERTIFICATE_INVALID,
    location,
    failureReason,
  );
}

function record(value: unknown, location: string): Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    return invalid(location, 'Expected a closed object');
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    return invalid(location, 'Expected a plain object');
  }
  return value as Record<string, unknown>;
}

function exactFields(
  value: Record<string, unknown>,
  fields: readonly string[],
  location: string,
): void {
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (actual.length !== expected.length || actual.some((field, index) => field !== expected[index])) {
    invalid(location, 'Object contains missing or unregistered fields');
  }
}

function validateField(value: unknown, rule: FieldRule, location: string): void {
  if (value === null && 'nullable' in rule && rule.nullable === true) return;
  switch (rule.kind) {
    case 'base64':
      if (typeof value !== 'string' || value.length === 0 || !BASE64_PATTERN.test(value)) {
        invalid(location, 'Expected canonical base64');
      }
      return;
    case 'boolean':
      if (typeof value !== 'boolean') invalid(location, 'Expected a boolean');
      return;
    case 'digest':
      if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
        invalid(location, 'Expected a lowercase sha256 digest');
      }
      return;
    case 'enum':
      if (typeof value !== 'string' || !rule.values.has(value)) {
        invalid(location, 'Expected a registered enum member');
      }
      return;
    case 'integer':
      if (!Number.isSafeInteger(value) || Number(value) < rule.minimum) {
        invalid(location, 'Expected a bounded safe integer');
      }
      return;
    case 'prose':
      if (
        typeof value !== 'string'
        || value.length === 0
        || value.length > 512
        || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value)
      ) {
        invalid(location, 'Expected bounded prose without control characters');
      }
      return;
    case 'qualified-digest':
      if (typeof value !== 'string' || !QUALIFIED_DIGEST_PATTERN.test(value)) {
        invalid(location, 'Expected an algorithm-qualified digest');
      }
      return;
    case 'timestamp':
      if (
        typeof value !== 'string'
        || !ISO_TIMESTAMP_PATTERN.test(value)
        || Number.isNaN(Date.parse(value))
      ) {
        invalid(location, 'Expected a canonical UTC timestamp');
      }
      return;
    case 'token':
      if (typeof value !== 'string' || !TOKEN_PATTERN.test(value)) {
        invalid(location, 'Expected a bounded identity token');
      }
      return;
    default: {
      const exhaustiveRule: never = rule;
      return exhaustiveRule;
    }
  }
}

function scalarArray(
  value: unknown,
  rule: FieldRule,
  location: string,
  allowEmpty = true,
): readonly string[] {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0) || value.length > 256) {
    return invalid(location, 'Expected a bounded array');
  }
  value.forEach((entry, index) => validateField(entry, rule, `${location}:${index}`));
  if (new Set(value).size !== value.length) invalid(location, 'Array entries must be unique');
  return Object.freeze([...value]) as readonly string[];
}

// ───────────────────────────────────────────────────────────────────
// 2. SHARED RECEIPT AND DOMAIN RECEIPT PARSERS
// ───────────────────────────────────────────────────────────────────

const SHARED_RECEIPT_FIELDS = Object.freeze([
  'receipt_id', 'boundary_id', 'boundary_kind', 'scope', 'scope_id',
  'from_state', 'to_state', 'from_head', 'result_head', 'result_event_id',
  'result_event_type', 'result_event_digest', 'result_code', 'evidence_digest',
  'artifact_digests', 'replay_fingerprint', 'authority_epoch', 'correlation_id',
  'causation_id', 'issuer', 'issued_at', 'idempotency_key', 'certification',
]);

function parseHead(value: unknown, location: string) {
  const candidate = record(value, location);
  exactFields(candidate, ['ledger_id', 'sequence', 'record_hash'], location);
  validateField(candidate.ledger_id, { kind: 'token' }, `${location}:ledger_id`);
  validateField(candidate.sequence, { kind: 'integer', minimum: 0 }, `${location}:sequence`);
  validateField(candidate.record_hash, { kind: 'digest' }, `${location}:record_hash`);
  return Object.freeze({
    ledger_id: candidate.ledger_id as string,
    sequence: candidate.sequence as number,
    record_hash: candidate.record_hash as string,
  });
}

function parseSharedReceipt(value: unknown, location: string): BoundaryReceiptPayload {
  const candidate = record(value, location);
  exactFields(candidate, SHARED_RECEIPT_FIELDS, location);
  validateField(candidate.receipt_id, { kind: 'token' }, `${location}:receipt_id`);
  validateField(candidate.boundary_id, { kind: 'token' }, `${location}:boundary_id`);
  validateField(candidate.boundary_kind, { kind: 'enum', values: BOUNDARY_KINDS }, `${location}:boundary_kind`);
  validateField(candidate.scope, { kind: 'enum', values: BOUNDARY_SCOPES }, `${location}:scope`);
  for (const field of [
    'scope_id', 'from_state', 'to_state', 'result_event_id', 'result_event_type',
    'result_code', 'correlation_id', 'causation_id', 'issuer', 'idempotency_key',
  ] as const) {
    validateField(candidate[field], { kind: 'token' }, `${location}:${field}`);
  }
  for (const field of ['result_event_digest', 'evidence_digest', 'replay_fingerprint'] as const) {
    validateField(candidate[field], { kind: 'digest' }, `${location}:${field}`);
  }
  parseHead(candidate.from_head, `${location}:from_head`);
  parseHead(candidate.result_head, `${location}:result_head`);
  scalarArray(candidate.artifact_digests, { kind: 'digest' }, `${location}:artifact_digests`);
  validateField(candidate.authority_epoch, { kind: 'integer', minimum: 1 }, `${location}:authority_epoch`);
  validateField(candidate.issued_at, { kind: 'timestamp' }, `${location}:issued_at`);

  const certification = record(candidate.certification, `${location}:certification`);
  exactFields(certification, [
    'scheme', 'provider_id', 'key_id', 'verifier_version', 'trust_scope',
    'signed_digest', 'signature_base64',
  ], `${location}:certification`);
  for (const field of ['scheme', 'provider_id', 'key_id', 'verifier_version'] as const) {
    validateField(certification[field], { kind: 'token' }, `${location}:certification:${field}`);
  }
  validateField(
    certification.trust_scope,
    { kind: 'enum', values: TRUST_SCOPES },
    `${location}:certification:trust_scope`,
  );
  validateField(certification.signed_digest, { kind: 'digest' }, `${location}:certification:signed_digest`);
  validateField(certification.signature_base64, { kind: 'base64' }, `${location}:certification:signature_base64`);
  return candidate as unknown as BoundaryReceiptPayload;
}

const RECEIPT_FACT_FIELDS = Object.freeze([
  'receiptVersion', 'runId', 'transitionId', 'transitionKind', 'logicalOperationId',
  'attemptIds', 'resultEventId', 'resultEventType', 'resultEventDigest',
  'authorizationDecisionDigest', 'fromHead', 'resultHead',
  'inputArtifactQualifiedDigests', 'outputArtifactQualifiedDigests',
  'resultDisposition', 'dispositionReason', 'replayFingerprint', 'authorityEpoch',
  'priorReceiptDigest',
]);

function parseReceiptFacts(value: unknown, location: string): DeepResearchTransitionReceiptFacts {
  const candidate = record(value, location);
  exactFields(candidate, RECEIPT_FACT_FIELDS, location);
  if (candidate.receiptVersion !== 1) invalid(`${location}:receiptVersion`, 'Unsupported receipt version');
  for (const field of [
    'runId', 'transitionId', 'logicalOperationId', 'resultEventId', 'resultEventType',
  ] as const) {
    validateField(candidate[field], { kind: 'token' }, `${location}:${field}`);
  }
  validateField(candidate.transitionKind, { kind: 'enum', values: TRANSITION_KINDS }, `${location}:transitionKind`);
  validateField(candidate.resultDisposition, { kind: 'enum', values: TRANSITION_DISPOSITIONS }, `${location}:resultDisposition`);
  validateField(candidate.dispositionReason, { kind: 'prose' }, `${location}:dispositionReason`);
  for (const field of [
    'resultEventDigest', 'authorizationDecisionDigest', 'replayFingerprint',
  ] as const) {
    validateField(candidate[field], { kind: 'digest' }, `${location}:${field}`);
  }
  validateField(candidate.priorReceiptDigest, { kind: 'digest', nullable: true }, `${location}:priorReceiptDigest`);
  validateField(candidate.authorityEpoch, { kind: 'integer', minimum: 1 }, `${location}:authorityEpoch`);
  parseHead(candidate.fromHead, `${location}:fromHead`);
  parseHead(candidate.resultHead, `${location}:resultHead`);
  scalarArray(candidate.attemptIds, { kind: 'token' }, `${location}:attemptIds`, false);
  scalarArray(candidate.inputArtifactQualifiedDigests, { kind: 'qualified-digest' }, `${location}:inputArtifactQualifiedDigests`);
  scalarArray(candidate.outputArtifactQualifiedDigests, { kind: 'qualified-digest' }, `${location}:outputArtifactQualifiedDigests`);
  return candidate as unknown as DeepResearchTransitionReceiptFacts;
}

/** Parse one receipt with closed field coverage and no free-string fallback. */
export function parseDeepResearchTransitionReceipt(
  value: unknown,
  location = 'receipt',
): DeepResearchTransitionReceipt {
  const candidate = record(value, location);
  exactFields(candidate, ['facts', 'receiptDigest', 'sharedReceipt'], location);
  const facts = parseReceiptFacts(candidate.facts, `${location}:facts`);
  validateField(candidate.receiptDigest, { kind: 'digest' }, `${location}:receiptDigest`);
  const sharedReceipt = parseSharedReceipt(candidate.sharedReceipt, `${location}:sharedReceipt`);
  return Object.freeze({
    facts,
    receiptDigest: candidate.receiptDigest as string,
    sharedReceipt,
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. CERTIFICATE PARSERS
// ───────────────────────────────────────────────────────────────────

function parseArtifactClaim(value: unknown, location: string): DeepResearchCertificateArtifactClaim {
  const candidate = record(value, location);
  exactFields(candidate, [
    'binding', 'descriptorDigest', 'contentDigest', 'canonicalizationVersion',
  ], location);
  const binding = parseDeepResearchSealedArtifactBinding(candidate.binding);
  validateField(candidate.descriptorDigest, { kind: 'digest' }, `${location}:descriptorDigest`);
  validateField(candidate.contentDigest, { kind: 'digest' }, `${location}:contentDigest`);
  validateField(candidate.canonicalizationVersion, { kind: 'token' }, `${location}:canonicalizationVersion`);
  return Object.freeze({
    binding,
    descriptorDigest: candidate.descriptorDigest as string,
    contentDigest: candidate.contentDigest as string,
    canonicalizationVersion: candidate.canonicalizationVersion as string,
  });
}

function parseConvergenceEvidence(
  value: unknown,
  location: string,
): DeepResearchCertificateConvergenceEvidence {
  const candidate = record(value, location);
  exactFields(candidate, [
    'eligibility', 'outcome', 'evaluationEventId', 'policyFingerprint',
    'evaluatorFingerprint', 'evidenceTailHash', 'blockerIds',
  ], location);
  validateField(candidate.eligibility, { kind: 'enum', values: CONVERGENCE_ELIGIBILITIES }, `${location}:eligibility`);
  validateField(candidate.outcome, { kind: 'enum', values: CONVERGENCE_OUTCOMES }, `${location}:outcome`);
  validateField(candidate.evaluationEventId, { kind: 'token' }, `${location}:evaluationEventId`);
  for (const field of ['policyFingerprint', 'evaluatorFingerprint', 'evidenceTailHash'] as const) {
    validateField(candidate[field], { kind: 'digest' }, `${location}:${field}`);
  }
  scalarArray(candidate.blockerIds, { kind: 'token' }, `${location}:blockerIds`);
  return candidate as unknown as DeepResearchCertificateConvergenceEvidence;
}

function parseStatusEvidence(
  value: unknown,
  location: string,
): DeepResearchCertificateStatusEvidence {
  const candidate = record(value, location);
  exactFields(candidate, ['state', 'terminal', 'statusEventId'], location);
  validateField(candidate.state, { kind: 'enum', values: MODE_STATUSES }, `${location}:state`);
  validateField(candidate.terminal, { kind: 'boolean' }, `${location}:terminal`);
  validateField(candidate.statusEventId, { kind: 'token' }, `${location}:statusEventId`);
  return candidate as unknown as DeepResearchCertificateStatusEvidence;
}

const CERTIFICATE_BODY_FIELDS = Object.freeze([
  'certificateVersion', 'authority', 'runId', 'lineageId', 'generation',
  'lifecycleResult', 'startHead', 'finalHead', 'artifactClaims', 'artifactSetDigest',
  'receiptDigests', 'receiptChainDigest', 'replayFingerprint',
  'replayFingerprintVersion', 'projectionIntegrityDigest', 'convergenceEvidence',
  'statusEvidence', 'outputArtifactQualifiedDigests', 'openObligationIds',
]);

function parseCertificateBody(value: unknown, location: string): DeepResearchRunCertificateBody {
  const candidate = record(value, location);
  exactFields(candidate, CERTIFICATE_BODY_FIELDS, location);
  if (candidate.certificateVersion !== 1) {
    invalid(`${location}:certificateVersion`, 'Unsupported certificate version');
  }
  if (candidate.authority !== 'dark-evidence-only') {
    invalid(`${location}:authority`, 'Certificate cannot carry execution authority');
  }
  validateField(candidate.runId, { kind: 'token' }, `${location}:runId`);
  validateField(candidate.lineageId, { kind: 'token' }, `${location}:lineageId`);
  validateField(candidate.generation, { kind: 'integer', minimum: 1 }, `${location}:generation`);
  validateField(candidate.lifecycleResult, { kind: 'enum', values: LIFECYCLE_RESULTS }, `${location}:lifecycleResult`);
  parseHead(candidate.startHead, `${location}:startHead`);
  parseHead(candidate.finalHead, `${location}:finalHead`);
  if (!Array.isArray(candidate.artifactClaims) || candidate.artifactClaims.length === 0) {
    invalid(`${location}:artifactClaims`, 'Certificate requires verified sealed artifacts');
  }
  candidate.artifactClaims.forEach((claim, index) => parseArtifactClaim(claim, `${location}:artifactClaims:${index}`));
  for (const field of [
    'artifactSetDigest', 'receiptChainDigest', 'replayFingerprint',
    'projectionIntegrityDigest',
  ] as const) {
    validateField(candidate[field], { kind: 'digest' }, `${location}:${field}`);
  }
  validateField(candidate.replayFingerprintVersion, { kind: 'integer', minimum: 1 }, `${location}:replayFingerprintVersion`);
  scalarArray(candidate.receiptDigests, { kind: 'digest' }, `${location}:receiptDigests`, false);
  scalarArray(candidate.outputArtifactQualifiedDigests, { kind: 'qualified-digest' }, `${location}:outputArtifactQualifiedDigests`, false);
  scalarArray(candidate.openObligationIds, { kind: 'token' }, `${location}:openObligationIds`);
  parseConvergenceEvidence(candidate.convergenceEvidence, `${location}:convergenceEvidence`);
  parseStatusEvidence(candidate.statusEvidence, `${location}:statusEvidence`);
  return candidate as unknown as DeepResearchRunCertificateBody;
}

/** Parse a run certificate without trusting any of its evidence claims. */
export function parseDeepResearchRunCertificate(
  value: unknown,
  location = 'certificate',
): DeepResearchRunCertificate {
  const candidate = record(value, location);
  exactFields(candidate, ['body', 'certificateDigest', 'sharedCertificationReceipt'], location);
  const body = parseCertificateBody(candidate.body, `${location}:body`);
  validateField(candidate.certificateDigest, { kind: 'digest' }, `${location}:certificateDigest`);
  const sharedCertificationReceipt = parseSharedReceipt(
    candidate.sharedCertificationReceipt,
    `${location}:sharedCertificationReceipt`,
  );
  return Object.freeze({
    body,
    certificateDigest: candidate.certificateDigest as string,
    sharedCertificationReceipt,
  });
}

/** Parse the transport bundle while leaving every attested fact untrusted. */
export function parseDeepResearchCertificateBundle(value: unknown): DeepResearchCertificateBundle {
  const candidate = record(value, 'bundle');
  exactFields(candidate, ['bundleVersion', 'certificate', 'receipts'], 'bundle');
  if (candidate.bundleVersion !== 1) invalid('bundle:bundleVersion', 'Unsupported bundle version');
  if (!Array.isArray(candidate.receipts)) invalid('bundle:receipts', 'Expected a receipt array');
  const receipts = candidate.receipts.map((receipt, index) => (
    parseDeepResearchTransitionReceipt(receipt, `bundle:receipts:${index}`)
  ));
  return Object.freeze({
    bundleVersion: 1,
    certificate: parseDeepResearchRunCertificate(candidate.certificate),
    receipts: Object.freeze(receipts),
  });
}
