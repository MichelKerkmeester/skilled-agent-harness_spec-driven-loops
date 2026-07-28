// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Certificate Validation
// ───────────────────────────────────────────────────────────────────

import {
  DeepImprovementCommonArtifactKinds,
  parseDeepImprovementCommonSealedArtifactBinding,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import {
  DeepImprovementCommonCertificateError,
  DeepImprovementCommonCertificateFailureCodes,
  DeepImprovementCommonTransitionKinds,
} from './deep-improvement-common-certificate-types.js';

import type { BoundaryReceiptPayload } from '../receipts-and-effect-recovery/index.js';
import type {
  DeepImprovementCommonCertificateArtifactClaim,
  DeepImprovementCommonCertificateBundle,
  DeepImprovementCommonNamedDigestClosureRule,
  DeepImprovementCommonReceiptIdentity,
  DeepImprovementCommonRunCertificate,
  DeepImprovementCommonRunCertificateBody,
  DeepImprovementCommonTransitionReceipt,
  DeepImprovementCommonTransitionReceiptFacts,
} from './deep-improvement-common-certificate-types.js';

type FieldRule =
  | { readonly kind: 'base64' }
  | { readonly kind: 'digest'; readonly nullable?: boolean }
  | { readonly kind: 'enum'; readonly values: ReadonlySet<string> }
  | { readonly kind: 'integer'; readonly minimum: number }
  | { readonly kind: 'qualified-digest' }
  | { readonly kind: 'timestamp' }
  | { readonly kind: 'token' };

const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/+~-]{0,255}$/u;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/u;
const QUALIFIED_DIGEST_PATTERN = /^[a-z0-9-]+:[a-f0-9]{64}$/u;
const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u;
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u;
const TRANSITION_KINDS = new Set(Object.values(DeepImprovementCommonTransitionKinds));
const TRANSITION_OUTCOMES = new Set(['completed', 'recovered', 'uncertain', 'vetoed']);
const UNCERTAINTY_STATES = new Set(['known', 'unknown-effect']);
const CERTIFICATE_VERDICTS = new Set(['PASS', 'FAIL', 'ABORT', 'INSUFFICIENT_EVIDENCE']);
const ARTIFACT_KINDS = new Set(Object.values(DeepImprovementCommonArtifactKinds));
const CLOSURE_FIELDS = new Set(['unresolvedEvidenceDigests[]', 'vetoEvidenceDigests[]']);
const BOUNDARY_KINDS = new Set([
  'mode-abort', 'mode-completion', 'mode-enter', 'mode-handoff', 'mode-pause',
  'mode-resume', 'phase-abort', 'phase-completion', 'phase-enter', 'phase-handoff',
  'phase-pause', 'phase-resume',
]);
const BOUNDARY_SCOPES = new Set(['mode', 'phase']);
const TRUST_SCOPES = new Set(['durable-cross-resume', 'process-local-advisory']);

function invalid(location: string, reason: string): never {
  throw new DeepImprovementCommonCertificateError(
    DeepImprovementCommonCertificateFailureCodes.CERTIFICATE_INVALID,
    location,
    reason,
  );
}

function unsupported(location: string, reason: string): never {
  throw new DeepImprovementCommonCertificateError(
    DeepImprovementCommonCertificateFailureCodes.UNSUPPORTED_VERSION,
    location,
    reason,
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

function field(value: unknown, rule: FieldRule, location: string): void {
  if (value === null && 'nullable' in rule && rule.nullable === true) return;
  switch (rule.kind) {
    case 'base64':
      if (typeof value !== 'string' || value.length === 0 || !BASE64_PATTERN.test(value)) {
        invalid(location, 'Expected canonical base64');
      }
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
    case 'qualified-digest':
      if (typeof value !== 'string' || !QUALIFIED_DIGEST_PATTERN.test(value)) {
        invalid(location, 'Expected an algorithm-qualified digest');
      }
      return;
    case 'timestamp':
      if (typeof value !== 'string' || !ISO_TIMESTAMP_PATTERN.test(value) || Number.isNaN(Date.parse(value))) {
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
  value.forEach((entry, index) => field(entry, rule, `${location}:${index}`));
  if (new Set(value).size !== value.length) invalid(location, 'Array entries must be unique');
  return Object.freeze([...value]) as readonly string[];
}

function parseHead(value: unknown, location: string) {
  const candidate = record(value, location);
  exactFields(candidate, ['ledger_id', 'sequence', 'record_hash'], location);
  field(candidate.ledger_id, { kind: 'token' }, `${location}:ledger_id`);
  field(candidate.sequence, { kind: 'integer', minimum: 0 }, `${location}:sequence`);
  field(candidate.record_hash, { kind: 'digest' }, `${location}:record_hash`);
}

const SHARED_RECEIPT_FIELDS = Object.freeze([
  'receipt_id', 'boundary_id', 'boundary_kind', 'scope', 'scope_id',
  'from_state', 'to_state', 'from_head', 'result_head', 'result_event_id',
  'result_event_type', 'result_event_digest', 'result_code', 'evidence_digest',
  'artifact_digests', 'replay_fingerprint', 'authority_epoch', 'correlation_id',
  'causation_id', 'issuer', 'issued_at', 'idempotency_key', 'certification',
]);

function parseSharedReceipt(value: unknown, location: string): BoundaryReceiptPayload {
  const candidate = record(value, location);
  exactFields(candidate, SHARED_RECEIPT_FIELDS, location);
  for (const name of [
    'receipt_id', 'boundary_id', 'scope_id', 'from_state', 'to_state',
    'result_event_id', 'result_event_type', 'result_code', 'correlation_id',
    'causation_id', 'issuer', 'idempotency_key',
  ] as const) field(candidate[name], { kind: 'token' }, `${location}:${name}`);
  field(candidate.boundary_kind, { kind: 'enum', values: BOUNDARY_KINDS }, `${location}:boundary_kind`);
  field(candidate.scope, { kind: 'enum', values: BOUNDARY_SCOPES }, `${location}:scope`);
  for (const name of ['result_event_digest', 'evidence_digest', 'replay_fingerprint'] as const) {
    field(candidate[name], { kind: 'digest' }, `${location}:${name}`);
  }
  parseHead(candidate.from_head, `${location}:from_head`);
  parseHead(candidate.result_head, `${location}:result_head`);
  scalarArray(candidate.artifact_digests, { kind: 'digest' }, `${location}:artifact_digests`);
  field(candidate.authority_epoch, { kind: 'integer', minimum: 1 }, `${location}:authority_epoch`);
  field(candidate.issued_at, { kind: 'timestamp' }, `${location}:issued_at`);
  const certification = record(candidate.certification, `${location}:certification`);
  exactFields(certification, [
    'scheme', 'provider_id', 'key_id', 'verifier_version', 'trust_scope',
    'signed_digest', 'signature_base64',
  ], `${location}:certification`);
  for (const name of ['scheme', 'provider_id', 'key_id', 'verifier_version'] as const) {
    field(certification[name], { kind: 'token' }, `${location}:certification:${name}`);
  }
  field(certification.trust_scope, { kind: 'enum', values: TRUST_SCOPES }, `${location}:certification:trust_scope`);
  field(certification.signed_digest, { kind: 'digest' }, `${location}:certification:signed_digest`);
  field(certification.signature_base64, { kind: 'base64' }, `${location}:certification:signature_base64`);
  return candidate as unknown as BoundaryReceiptPayload;
}

function parseIdentity(value: unknown, location: string): DeepImprovementCommonReceiptIdentity {
  const candidate = record(value, location);
  exactFields(candidate, [
    'identityVersion', 'runId', 'transitionKind', 'logicalOperationId',
    'effectIdempotencyKey', 'digest',
  ], location);
  if (candidate.identityVersion !== 1) {
    unsupported(`${location}:identityVersion`, 'Unsupported identity version');
  }
  for (const name of ['runId', 'logicalOperationId', 'effectIdempotencyKey'] as const) {
    field(candidate[name], { kind: 'token' }, `${location}:${name}`);
  }
  field(candidate.transitionKind, { kind: 'enum', values: TRANSITION_KINDS }, `${location}:transitionKind`);
  field(candidate.digest, { kind: 'digest' }, `${location}:digest`);
  return candidate as unknown as DeepImprovementCommonReceiptIdentity;
}

function identityArray(value: unknown, location: string): readonly DeepImprovementCommonReceiptIdentity[] {
  if (!Array.isArray(value) || value.length > 16) invalid(location, 'Expected a bounded identity array');
  const parsed = value.map((entry, index) => parseIdentity(entry, `${location}:${index}`));
  if (new Set(parsed.map((identity) => identity.digest)).size !== parsed.length) {
    invalid(location, 'Receipt identities must be unique');
  }
  return Object.freeze(parsed);
}

function parseReceiptFacts(value: unknown, location: string): DeepImprovementCommonTransitionReceiptFacts {
  const candidate = record(value, location);
  exactFields(candidate, [
    'receiptVersion', 'identity', 'predecessorReceiptIdentities',
    'predecessorReceiptDigests', 'runId', 'transitionKind', 'logicalOperationId',
    'effectIdempotencyKey', 'attemptNumber', 'resultEventId', 'resultEventType',
    'resultEventDigest', 'authorizationDecisionDigest', 'fromHeadHash',
    'resultHeadHash', 'inputArtifactQualifiedDigests',
    'outputArtifactQualifiedDigests', 'evidenceArtifactQualifiedDigests',
    'outcome', 'uncertaintyState', 'serviceVersion', 'replayFingerprint',
    'transitionFingerprint', 'authorityEpoch',
  ], location);
  if (candidate.receiptVersion !== 1) {
    unsupported(`${location}:receiptVersion`, 'Unsupported receipt version');
  }
  parseIdentity(candidate.identity, `${location}:identity`);
  identityArray(candidate.predecessorReceiptIdentities, `${location}:predecessorReceiptIdentities`);
  scalarArray(candidate.predecessorReceiptDigests, { kind: 'digest' }, `${location}:predecessorReceiptDigests`);
  for (const name of [
    'runId', 'logicalOperationId', 'effectIdempotencyKey', 'resultEventId',
    'resultEventType', 'serviceVersion',
  ] as const) field(candidate[name], { kind: 'token' }, `${location}:${name}`);
  field(candidate.transitionKind, { kind: 'enum', values: TRANSITION_KINDS }, `${location}:transitionKind`);
  field(candidate.attemptNumber, { kind: 'integer', minimum: 1 }, `${location}:attemptNumber`);
  for (const name of [
    'resultEventDigest', 'authorizationDecisionDigest', 'fromHeadHash',
    'resultHeadHash', 'replayFingerprint', 'transitionFingerprint',
  ] as const) field(candidate[name], { kind: 'digest' }, `${location}:${name}`);
  for (const name of [
    'inputArtifactQualifiedDigests', 'outputArtifactQualifiedDigests',
    'evidenceArtifactQualifiedDigests',
  ] as const) scalarArray(candidate[name], { kind: 'qualified-digest' }, `${location}:${name}`);
  field(candidate.outcome, { kind: 'enum', values: TRANSITION_OUTCOMES }, `${location}:outcome`);
  field(candidate.uncertaintyState, { kind: 'enum', values: UNCERTAINTY_STATES }, `${location}:uncertaintyState`);
  field(candidate.authorityEpoch, { kind: 'integer', minimum: 1 }, `${location}:authorityEpoch`);
  return candidate as unknown as DeepImprovementCommonTransitionReceiptFacts;
}

export function parseDeepImprovementCommonTransitionReceipt(
  value: unknown,
  location = 'receipt',
): DeepImprovementCommonTransitionReceipt {
  const candidate = record(value, location);
  exactFields(candidate, ['facts', 'receiptDigest', 'sharedReceipt'], location);
  const facts = parseReceiptFacts(candidate.facts, `${location}:facts`);
  field(candidate.receiptDigest, { kind: 'digest' }, `${location}:receiptDigest`);
  return Object.freeze({
    facts,
    receiptDigest: candidate.receiptDigest as string,
    sharedReceipt: parseSharedReceipt(candidate.sharedReceipt, `${location}:sharedReceipt`),
  });
}

function parseArtifactClaim(
  value: unknown,
  location: string,
): DeepImprovementCommonCertificateArtifactClaim {
  const candidate = record(value, location);
  exactFields(candidate, ['binding', 'descriptorDigest', 'contentDigest', 'canonicalizationVersion'], location);
  const binding = parseDeepImprovementCommonSealedArtifactBinding(candidate.binding);
  field(candidate.descriptorDigest, { kind: 'digest' }, `${location}:descriptorDigest`);
  field(candidate.contentDigest, { kind: 'digest' }, `${location}:contentDigest`);
  field(candidate.canonicalizationVersion, { kind: 'token' }, `${location}:canonicalizationVersion`);
  return Object.freeze({
    binding,
    descriptorDigest: candidate.descriptorDigest as string,
    contentDigest: candidate.contentDigest as string,
    canonicalizationVersion: candidate.canonicalizationVersion as string,
  });
}

function parseClosureRule(
  value: unknown,
  location: string,
): DeepImprovementCommonNamedDigestClosureRule {
  const candidate = record(value, location);
  exactFields(candidate, ['containingArtifactKind', 'field', 'expectedArtifactKind'], location);
  field(candidate.containingArtifactKind, { kind: 'enum', values: ARTIFACT_KINDS }, `${location}:containingArtifactKind`);
  field(candidate.field, { kind: 'enum', values: CLOSURE_FIELDS }, `${location}:field`);
  field(candidate.expectedArtifactKind, { kind: 'enum', values: ARTIFACT_KINDS }, `${location}:expectedArtifactKind`);
  return candidate as unknown as DeepImprovementCommonNamedDigestClosureRule;
}

function parseCertificateBody(value: unknown, location: string): DeepImprovementCommonRunCertificateBody {
  const candidate = record(value, location);
  exactFields(candidate, [
    'certificateVersion', 'authority', 'sharedContractId', 'runId', 'lineageId',
    'generation', 'evaluatorEpochId', 'candidateId', 'baselineId', 'canaryEpochId',
    'verdict', 'artifactClaims', 'artifactSetDigest', 'evaluatorCapsuleQualifiedDigest',
    'candidateInputQualifiedDigest', 'baselineInputQualifiedDigest',
    'rawObservationQualifiedDigests', 'canaryEpochQualifiedDigest',
    'promotionEvidenceQualifiedDigest', 'namedDigestClosureRules',
    'orderedDependencyClosure', 'receiptIdentities', 'receiptDigests',
    'receiptChainDigest', 'substrateReplayFingerprint', 'replayFingerprint',
    'replayFingerprintVersion', 'projectionIntegrityDigest', 'evaluatorPolicyDigest',
    'budgetDigest', 'vetoEvidenceDigests', 'startHeadHash', 'finalHeadHash',
  ], location);
  if (candidate.certificateVersion !== 1) {
    unsupported(`${location}:certificateVersion`, 'Unsupported certificate version');
  }
  if (candidate.authority !== 'dark-evidence-only') invalid(`${location}:authority`, 'Certificate cannot carry authority');
  if (candidate.sharedContractId !== 'deep-improvement-common-certificates') {
    invalid(`${location}:sharedContractId`, 'Unknown shared contract');
  }
  for (const name of [
    'runId', 'lineageId', 'evaluatorEpochId', 'candidateId', 'baselineId', 'canaryEpochId',
  ] as const) field(candidate[name], { kind: 'token' }, `${location}:${name}`);
  field(candidate.generation, { kind: 'integer', minimum: 1 }, `${location}:generation`);
  field(candidate.verdict, { kind: 'enum', values: CERTIFICATE_VERDICTS }, `${location}:verdict`);
  if (!Array.isArray(candidate.artifactClaims) || candidate.artifactClaims.length === 0) {
    invalid(`${location}:artifactClaims`, 'Certificate requires sealed artifact claims');
  }
  candidate.artifactClaims.forEach((claim, index) => parseArtifactClaim(claim, `${location}:artifactClaims:${index}`));
  for (const name of [
    'artifactSetDigest', 'receiptChainDigest', 'substrateReplayFingerprint',
    'replayFingerprint', 'projectionIntegrityDigest', 'evaluatorPolicyDigest',
    'budgetDigest', 'startHeadHash', 'finalHeadHash',
  ] as const) field(candidate[name], { kind: 'digest' }, `${location}:${name}`);
  for (const name of [
    'evaluatorCapsuleQualifiedDigest', 'candidateInputQualifiedDigest',
    'baselineInputQualifiedDigest', 'canaryEpochQualifiedDigest',
    'promotionEvidenceQualifiedDigest',
  ] as const) field(candidate[name], { kind: 'qualified-digest' }, `${location}:${name}`);
  scalarArray(candidate.rawObservationQualifiedDigests, { kind: 'qualified-digest' }, `${location}:rawObservationQualifiedDigests`, false);
  scalarArray(candidate.orderedDependencyClosure, { kind: 'qualified-digest' }, `${location}:orderedDependencyClosure`, false);
  scalarArray(candidate.receiptDigests, { kind: 'digest' }, `${location}:receiptDigests`, false);
  scalarArray(candidate.vetoEvidenceDigests, { kind: 'digest' }, `${location}:vetoEvidenceDigests`);
  if (!Array.isArray(candidate.namedDigestClosureRules) || candidate.namedDigestClosureRules.length === 0) {
    invalid(`${location}:namedDigestClosureRules`, 'Certificate requires the frozen named-digest closure map');
  }
  candidate.namedDigestClosureRules.forEach((rule, index) => parseClosureRule(rule, `${location}:namedDigestClosureRules:${index}`));
  identityArray(candidate.receiptIdentities, `${location}:receiptIdentities`);
  field(candidate.replayFingerprintVersion, { kind: 'integer', minimum: 1 }, `${location}:replayFingerprintVersion`);
  return candidate as unknown as DeepImprovementCommonRunCertificateBody;
}

export function parseDeepImprovementCommonRunCertificate(
  value: unknown,
  location = 'certificate',
): DeepImprovementCommonRunCertificate {
  const candidate = record(value, location);
  exactFields(candidate, ['body', 'certificateDigest', 'sharedCertificationReceipt'], location);
  const body = parseCertificateBody(candidate.body, `${location}:body`);
  field(candidate.certificateDigest, { kind: 'digest' }, `${location}:certificateDigest`);
  return Object.freeze({
    body,
    certificateDigest: candidate.certificateDigest as string,
    sharedCertificationReceipt: parseSharedReceipt(
      candidate.sharedCertificationReceipt,
      `${location}:sharedCertificationReceipt`,
    ),
  });
}

export function parseDeepImprovementCommonCertificateBundle(
  value: unknown,
): DeepImprovementCommonCertificateBundle {
  const candidate = record(value, 'bundle');
  exactFields(candidate, ['bundleVersion', 'certificate', 'receipts'], 'bundle');
  if (candidate.bundleVersion !== 1) {
    unsupported('bundle:bundleVersion', 'Unsupported bundle version');
  }
  if (!Array.isArray(candidate.receipts)) invalid('bundle:receipts', 'Expected a receipt array');
  return Object.freeze({
    bundleVersion: 1,
    certificate: parseDeepImprovementCommonRunCertificate(candidate.certificate),
    receipts: Object.freeze(candidate.receipts.map((receipt, index) => (
      parseDeepImprovementCommonTransitionReceipt(receipt, `bundle:receipts:${index}`)
    ))),
  });
}
