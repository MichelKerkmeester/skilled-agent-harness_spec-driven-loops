// MODULE: Skill Benchmark Certificate Validation

import {
  parseDeepImprovementCommonCertificateBundle,
} from '../deep-improvement-common-certificates/index.js';
import {
  SkillBenchmarkArtifactKinds,
  parseSkillBenchmarkSealedArtifactBinding,
} from '../skill-benchmark-sealed-artifacts/index.js';
import {
  SkillBenchmarkCertificateError,
  SkillBenchmarkCertificateFailureCodes,
  SkillBenchmarkTransitionKinds,
} from './skill-benchmark-certificate-types.js';

import type { DeepImprovementCommonReceiptIdentity } from '../deep-improvement-common-certificates/index.js';
import type { BoundaryReceiptPayload } from '../receipts-and-effect-recovery/index.js';
import type {
  SkillBenchmarkCertificateArtifactClaim,
  SkillBenchmarkCertificateBundle,
  SkillBenchmarkNamedDigestClosureRule,
  SkillBenchmarkReceiptIdentity,
  SkillBenchmarkRunCertificate,
  SkillBenchmarkRunCertificateBody,
  SkillBenchmarkTransitionReceipt,
  SkillBenchmarkTransitionReceiptFacts,
} from './skill-benchmark-certificate-types.js';

type FieldRule =
  | { readonly kind: 'base64' }
  | { readonly kind: 'digest'; readonly nullable?: boolean }
  | { readonly kind: 'enum'; readonly values: ReadonlySet<string> }
  | { readonly kind: 'integer'; readonly minimum: number }
  | { readonly kind: 'qualified-digest' }
  | { readonly kind: 'ratio' }
  | { readonly kind: 'timestamp' }
  | { readonly kind: 'token'; readonly nullable?: boolean };

const TOKEN = /^[A-Za-z0-9][A-Za-z0-9._:@/+~-]{0,255}$/u;
const DIGEST = /^[a-f0-9]{64}$/u;
const QUALIFIED_DIGEST = /^[a-z0-9-]+:[a-f0-9]{64}$/u;
const BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u;
const TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u;
const TRANSITIONS = new Set(Object.values(SkillBenchmarkTransitionKinds));
const OUTCOMES = new Set(['completed', 'recovered', 'uncertain', 'vetoed']);
const DISPOSITIONS = new Set(['ABORT', 'FAIL', 'INSUFFICIENT_EVIDENCE', 'PASS']);
const ARTIFACT_ROLES = new Set([
  'benchmark-design',
  'causal-score-observation',
  'effect-certificate-input',
  'exposure-observation',
  'run-assignment',
  'scenario-gold-manifest',
  'skill-bundle-snapshot',
]);
const BOUNDARY_KINDS = new Set([
  'mode-abort', 'mode-completion', 'mode-enter', 'mode-handoff', 'mode-pause',
  'mode-resume', 'phase-abort', 'phase-completion', 'phase-enter', 'phase-handoff',
  'phase-pause', 'phase-resume',
]);
const BOUNDARY_SCOPES = new Set(['mode', 'phase']);
const TRUST_SCOPES = new Set(['durable-cross-resume', 'process-local-advisory']);

function invalid(location: string, reason: string): never {
  throw new SkillBenchmarkCertificateError(
    SkillBenchmarkCertificateFailureCodes.CERTIFICATE_INVALID,
    location,
    reason,
  );
}

function unsupported(location: string, reason: string): never {
  throw new SkillBenchmarkCertificateError(
    SkillBenchmarkCertificateFailureCodes.UNSUPPORTED_VERSION,
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
      if (typeof value !== 'string' || value.length === 0 || !BASE64.test(value)) {
        invalid(location, 'Expected canonical base64');
      }
      return;
    case 'digest':
      if (typeof value !== 'string' || !DIGEST.test(value)) {
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
      if (typeof value !== 'string' || !QUALIFIED_DIGEST.test(value)) {
        invalid(location, 'Expected an algorithm-qualified digest');
      }
      return;
    case 'ratio':
      if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
        invalid(location, 'Expected a finite ratio from zero through one');
      }
      return;
    case 'timestamp':
      if (typeof value !== 'string' || !TIMESTAMP.test(value) || Number.isNaN(Date.parse(value))) {
        invalid(location, 'Expected a canonical UTC timestamp');
      }
      return;
    case 'token':
      if (typeof value !== 'string' || !TOKEN.test(value)) {
        invalid(location, 'Expected a bounded identity token');
      }
      return;
    default: {
      const exhaustive: never = rule;
      return exhaustive;
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

function parseSharedReceipt(value: unknown, location: string): BoundaryReceiptPayload {
  const candidate = record(value, location);
  exactFields(candidate, [
    'receipt_id', 'boundary_id', 'boundary_kind', 'scope', 'scope_id',
    'from_state', 'to_state', 'from_head', 'result_head', 'result_event_id',
    'result_event_type', 'result_event_digest', 'result_code', 'evidence_digest',
    'artifact_digests', 'replay_fingerprint', 'authority_epoch', 'correlation_id',
    'causation_id', 'issuer', 'issued_at', 'idempotency_key', 'certification',
  ], location);
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

function parseCommonIdentity(
  value: unknown,
  location: string,
): DeepImprovementCommonReceiptIdentity {
  const candidate = record(value, location);
  exactFields(candidate, [
    'identityVersion', 'runId', 'transitionKind', 'logicalOperationId',
    'effectIdempotencyKey', 'digest',
  ], location);
  if (candidate.identityVersion !== 1) unsupported(`${location}:identityVersion`, 'Unsupported identity version');
  for (const name of [
    'runId', 'transitionKind', 'logicalOperationId', 'effectIdempotencyKey',
  ] as const) field(candidate[name], { kind: 'token' }, `${location}:${name}`);
  field(candidate.digest, { kind: 'digest' }, `${location}:digest`);
  return candidate as unknown as DeepImprovementCommonReceiptIdentity;
}

function parseIdentity(value: unknown, location: string): SkillBenchmarkReceiptIdentity {
  const candidate = record(value, location);
  exactFields(candidate, [
    'identityVersion', 'runId', 'transitionKind', 'logicalOperationId',
    'effectIdempotencyKey', 'digest',
  ], location);
  if (candidate.identityVersion !== 1) invalid(`${location}:identityVersion`, 'Unsupported identity version');
  field(candidate.runId, { kind: 'token' }, `${location}:runId`);
  field(candidate.transitionKind, { kind: 'enum', values: TRANSITIONS }, `${location}:transitionKind`);
  field(candidate.logicalOperationId, { kind: 'token' }, `${location}:logicalOperationId`);
  field(candidate.effectIdempotencyKey, { kind: 'token' }, `${location}:effectIdempotencyKey`);
  field(candidate.digest, { kind: 'digest' }, `${location}:digest`);
  return candidate as unknown as SkillBenchmarkReceiptIdentity;
}

function identityArray<T>(
  value: unknown,
  parser: (entry: unknown, location: string) => T,
  location: string,
): readonly T[] {
  if (!Array.isArray(value) || value.length > 256) invalid(location, 'Expected a bounded identity array');
  const parsed = value.map((entry, index) => parser(entry, `${location}:${index}`));
  const digests = parsed.map((entry) => (entry as { readonly digest: string }).digest);
  if (new Set(digests).size !== digests.length) invalid(location, 'Identity digests must be unique');
  return Object.freeze(parsed);
}

function parseReceiptFacts(
  value: unknown,
  location: string,
): SkillBenchmarkTransitionReceiptFacts {
  const candidate = record(value, location);
  exactFields(candidate, [
    'receiptVersion', 'identity', 'predecessorReceiptDigests', 'commonReceiptIdentities',
    'runId', 'transitionKind', 'logicalOperationId', 'effectIdempotencyKey',
    'attemptNumber', 'resultEventId', 'resultEventType', 'resultEventDigest',
    'authorizationDecisionDigest', 'fromHeadHash', 'resultHeadHash',
    'inputArtifactQualifiedDigests', 'outputArtifactQualifiedDigests',
    'evidenceArtifactQualifiedDigests', 'outcome', 'substrateReplayFingerprint',
    'transitionFingerprint', 'authorityEpoch',
  ], location);
  if (candidate.receiptVersion !== 1) unsupported(`${location}:receiptVersion`, 'Unsupported receipt version');
  parseIdentity(candidate.identity, `${location}:identity`);
  identityArray(candidate.commonReceiptIdentities, parseCommonIdentity, `${location}:commonReceiptIdentities`);
  scalarArray(candidate.predecessorReceiptDigests, { kind: 'digest' }, `${location}:predecessorReceiptDigests`);
  for (const name of [
    'runId', 'logicalOperationId', 'effectIdempotencyKey', 'resultEventId',
    'resultEventType',
  ] as const) field(candidate[name], { kind: 'token' }, `${location}:${name}`);
  field(candidate.transitionKind, { kind: 'enum', values: TRANSITIONS }, `${location}:transitionKind`);
  field(candidate.attemptNumber, { kind: 'integer', minimum: 1 }, `${location}:attemptNumber`);
  for (const name of [
    'resultEventDigest', 'authorizationDecisionDigest', 'fromHeadHash', 'resultHeadHash',
    'substrateReplayFingerprint', 'transitionFingerprint',
  ] as const) field(candidate[name], { kind: 'digest' }, `${location}:${name}`);
  for (const name of [
    'inputArtifactQualifiedDigests', 'outputArtifactQualifiedDigests',
    'evidenceArtifactQualifiedDigests',
  ] as const) scalarArray(candidate[name], { kind: 'qualified-digest' }, `${location}:${name}`);
  field(candidate.outcome, { kind: 'enum', values: OUTCOMES }, `${location}:outcome`);
  field(candidate.authorityEpoch, { kind: 'integer', minimum: 1 }, `${location}:authorityEpoch`);
  return candidate as unknown as SkillBenchmarkTransitionReceiptFacts;
}

export function parseSkillBenchmarkTransitionReceipt(
  value: unknown,
  location = 'receipt',
): SkillBenchmarkTransitionReceipt {
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
): SkillBenchmarkCertificateArtifactClaim {
  const candidate = record(value, location);
  exactFields(candidate, [
    'role', 'expectedArtifactKind', 'binding', 'descriptorDigest',
    'contentDigest', 'canonicalizationVersion',
  ], location);
  field(candidate.role, { kind: 'enum', values: ARTIFACT_ROLES }, `${location}:role`);
  field(candidate.expectedArtifactKind, { kind: 'token' }, `${location}:expectedArtifactKind`);
  const binding = parseSkillBenchmarkSealedArtifactBinding(candidate.binding);
  if (candidate.expectedArtifactKind !== binding.artifactKind) {
    invalid(`${location}:expectedArtifactKind`, 'Artifact claim kind differs from its binding');
  }
  for (const name of ['descriptorDigest', 'contentDigest'] as const) {
    field(candidate[name], { kind: 'digest' }, `${location}:${name}`);
  }
  field(candidate.canonicalizationVersion, { kind: 'token' }, `${location}:canonicalizationVersion`);
  return Object.freeze({
    role: candidate.role,
    expectedArtifactKind: candidate.expectedArtifactKind,
    binding,
    descriptorDigest: candidate.descriptorDigest,
    contentDigest: candidate.contentDigest,
    canonicalizationVersion: candidate.canonicalizationVersion,
  }) as SkillBenchmarkCertificateArtifactClaim;
}

function parseClosureRule(
  value: unknown,
  location: string,
): SkillBenchmarkNamedDigestClosureRule {
  const candidate = record(value, location);
  exactFields(candidate, [
    'containingArtifactKind',
    'referenceField',
    'digestField',
    'expectedArtifactKind',
  ], location);
  const artifactKinds = new Set(Object.values(SkillBenchmarkArtifactKinds));
  field(candidate.containingArtifactKind, { kind: 'enum', values: artifactKinds }, `${location}:containingArtifactKind`);
  field(candidate.expectedArtifactKind, { kind: 'enum', values: artifactKinds }, `${location}:expectedArtifactKind`);
  field(candidate.referenceField, {
    kind: 'enum',
    values: new Set(['assignmentId', 'skillBundleRef']),
  }, `${location}:referenceField`);
  field(candidate.digestField, {
    kind: 'enum',
    values: new Set(['assignmentDigest', 'skillBundleDigest']),
  }, `${location}:digestField`);
  return candidate as unknown as SkillBenchmarkNamedDigestClosureRule;
}

function parseBody(value: unknown, location: string): SkillBenchmarkRunCertificateBody {
  const candidate = record(value, location);
  exactFields(candidate, [
    'certificateVersion', 'authority', 'mode', 'certificateSchema', 'runId',
    'lineageId', 'generation', 'evaluatorEpochId', 'canaryEpochId',
    'benchmarkDesignId', 'designDigest', 'taskSetDigest', 'skillBundleDigest',
    'registryDigest', 'executorDigest', 'environmentDigest', 'dependencyDigest',
    'workloadDigest', 'disposition', 'modeState', 'certificateState',
    'requiredScenarioCount', 'assignedScenarioCount', 'acceptedGoldScenarioCount',
    'collectionComplete', 'scoringComplete', 'certificateReady', 'treatmentArms',
    'blockingVetoCodes', 'blockerCodes', 'evidenceSetDigest',
    'validityDomainDigest', 'expiryTriggers',
    'artifactClaims', 'artifactSetDigest', 'namedDigestClosureRules',
    'orderedDependencyClosure', 'benchmarkDesignQualifiedDigest',
    'skillBundleQualifiedDigest', 'goldManifestQualifiedDigests',
    'runAssignmentQualifiedDigests', 'exposureObservationQualifiedDigests',
    'causalScoreObservationQualifiedDigests', 'certificateInputQualifiedDigest',
    'commonCertificateDigest', 'commonReceiptIdentities',
    'receiptIdentities', 'receiptDigests', 'receiptChainDigest',
    'substrateReplayFingerprint', 'replayFingerprint', 'replayFingerprintVersion',
    'projectionIntegrityDigest', 'startHeadHash', 'finalHeadHash',
  ], location);
  if (candidate.certificateVersion !== 1) unsupported(`${location}:certificateVersion`, 'Unsupported certificate version');
  if (candidate.authority !== 'dark-evidence-only') invalid(`${location}:authority`, 'Certificate cannot carry authority');
  if (candidate.mode !== 'skill-benchmark') invalid(`${location}:mode`, 'Certificate belongs to another mode');
  if (candidate.certificateSchema !== 'skill-effect-certificate.v1') {
    invalid(`${location}:certificateSchema`, 'Unsupported Skill Benchmark certificate schema');
  }
  for (const name of [
    'runId', 'lineageId', 'evaluatorEpochId', 'canaryEpochId', 'benchmarkDesignId',
  ] as const) field(candidate[name], { kind: 'token' }, `${location}:${name}`);
  field(candidate.generation, { kind: 'integer', minimum: 1 }, `${location}:generation`);
  for (const name of [
    'designDigest', 'taskSetDigest', 'skillBundleDigest', 'registryDigest',
    'executorDigest', 'environmentDigest', 'dependencyDigest', 'workloadDigest',
    'evidenceSetDigest', 'validityDomainDigest', 'artifactSetDigest',
    'commonCertificateDigest', 'receiptChainDigest',
    'substrateReplayFingerprint', 'replayFingerprint', 'projectionIntegrityDigest',
    'startHeadHash', 'finalHeadHash',
  ] as const) field(candidate[name], { kind: 'digest' }, `${location}:${name}`);
  field(candidate.disposition, { kind: 'enum', values: DISPOSITIONS }, `${location}:disposition`);
  if (candidate.modeState !== 'issued' || candidate.certificateState !== 'issued') {
    invalid(`${location}:modeState`, 'Certificate requires the reducer-derived issued state');
  }
  for (const name of [
    'requiredScenarioCount', 'assignedScenarioCount', 'acceptedGoldScenarioCount',
  ] as const) field(candidate[name], { kind: 'integer', minimum: 1 }, `${location}:${name}`);
  for (const name of [
    'collectionComplete', 'scoringComplete', 'certificateReady',
  ] as const) {
    if (candidate[name] !== true) invalid(`${location}:${name}`, 'Trusted certificate fact must be true');
  }
  field(candidate.replayFingerprintVersion, { kind: 'integer', minimum: 1 }, `${location}:replayFingerprintVersion`);
  if (!Array.isArray(candidate.artifactClaims) || candidate.artifactClaims.length === 0) {
    invalid(`${location}:artifactClaims`, 'Certificate requires sealed artifact claims');
  }
  for (const name of [
    'benchmarkDesignQualifiedDigest', 'skillBundleQualifiedDigest',
    'certificateInputQualifiedDigest',
  ] as const) field(candidate[name], { kind: 'qualified-digest' }, `${location}:${name}`);
  for (const name of [
    'goldManifestQualifiedDigests', 'runAssignmentQualifiedDigests',
    'exposureObservationQualifiedDigests', 'causalScoreObservationQualifiedDigests',
  ] as const) {
    scalarArray(candidate[name], { kind: 'qualified-digest' }, `${location}:${name}`, false);
  }
  for (const name of [
    'treatmentArms', 'blockingVetoCodes', 'blockerCodes', 'expiryTriggers',
  ] as const) scalarArray(candidate[name], { kind: 'token' }, `${location}:${name}`);
  candidate.artifactClaims.forEach((claim, index) => parseArtifactClaim(claim, `${location}:artifactClaims:${index}`));
  if (!Array.isArray(candidate.namedDigestClosureRules) || candidate.namedDigestClosureRules.length === 0) {
    invalid(`${location}:namedDigestClosureRules`, 'Skill Benchmark requires its named-digest closure map');
  }
  candidate.namedDigestClosureRules.forEach((rule, index) => (
    parseClosureRule(rule, `${location}:namedDigestClosureRules:${index}`)
  ));
  scalarArray(candidate.orderedDependencyClosure, { kind: 'qualified-digest' }, `${location}:orderedDependencyClosure`, false);
  identityArray(candidate.commonReceiptIdentities, parseCommonIdentity, `${location}:commonReceiptIdentities`);
  identityArray(candidate.receiptIdentities, parseIdentity, `${location}:receiptIdentities`);
  scalarArray(candidate.receiptDigests, { kind: 'digest' }, `${location}:receiptDigests`, false);
  return candidate as unknown as SkillBenchmarkRunCertificateBody;
}

export function parseSkillBenchmarkRunCertificate(
  value: unknown,
  location = 'certificate',
): SkillBenchmarkRunCertificate {
  const candidate = record(value, location);
  exactFields(candidate, ['body', 'certificateDigest', 'sharedCertificationReceipt'], location);
  const body = parseBody(candidate.body, `${location}:body`);
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

export function parseSkillBenchmarkCertificateBundle(
  value: unknown,
): SkillBenchmarkCertificateBundle {
  const candidate = record(value, 'bundle');
  exactFields(candidate, ['bundleVersion', 'certificate', 'receipts', 'commonBundle'], 'bundle');
  if (candidate.bundleVersion !== 1) unsupported('bundle:bundleVersion', 'Unsupported bundle version');
  if (!Array.isArray(candidate.receipts)) invalid('bundle:receipts', 'Expected a receipt array');
  return Object.freeze({
    bundleVersion: 1,
    certificate: parseSkillBenchmarkRunCertificate(candidate.certificate),
    receipts: Object.freeze(candidate.receipts.map((receipt, index) => (
      parseSkillBenchmarkTransitionReceipt(receipt, `bundle:receipts:${index}`)
    ))),
    commonBundle: parseDeepImprovementCommonCertificateBundle(candidate.commonBundle),
  });
}
