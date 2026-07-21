// ───────────────────────────────────────────────────────────────────
// MODULE: Mode Contract Conformance Runner
// ───────────────────────────────────────────────────────────────────

import { canonicalJson } from '../event-envelope/index.js';
import {
  MODE_COMPATIBILITY_POLICY_VERSION,
  MODE_CONTRACT_INTERFACE_VERSION,
  MODE_CONTRACT_SHAPE,
  ModeArtifactEvidenceFieldSet,
  ModeCertificateFieldSet,
  ModeConvergenceHookSet,
  ModeConvergenceObservationFieldSet,
  ModeProvidedCapabilities,
} from './mode-contract-types.js';
import { resolveModeInterfaceCompatibility } from './compatibility-policy.js';
import { REQUIRED_MODE_SUBSTRATE_PORTS } from './substrate-ports.js';

import type { JsonObject } from '../event-envelope/index.js';
import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  ModeArtifactContext,
  ModeCertificateEvidence,
  ModeContract,
  ModeConvergenceHooks,
  ModeInterfaceVersion,
  ModeResumeSnapshot,
} from './mode-contract-types.js';
import type {
  ModeCompatibilityDecision,
  ModeCompatibilityInput,
} from './compatibility-policy.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE AND REPORT TYPES
// ───────────────────────────────────────────────────────────────────

export interface ModeContractEntry {
  readonly modeId: string;
  readonly contract: ModeContract;
}

export interface ModeEventWriteAttempt {
  readonly eventType: string;
  readonly schemaVersion: number;
  readonly interfaceVersion: ModeInterfaceVersion;
  readonly transitionIntent: string;
  readonly reducerOwner: string;
  readonly replayInputIds: readonly string[];
  readonly appendPath: string;
  readonly authorizationVerdict: 'allow' | 'deny' | 'missing';
  readonly directMutation: boolean;
}

export interface ModeWriteFixture {
  readonly fixtureId: string;
  readonly modeId: string;
  readonly attempt: ModeEventWriteAttempt;
  readonly expected: 'accept' | 'reject';
}

export interface ModeReducerFixture {
  readonly fixtureId: string;
  readonly modeId: string;
  readonly initialState: Readonly<JsonObject>;
  readonly event: VerifiedLedgerEvent;
  readonly expected: 'accept' | 'reject';
}

export interface ModeCertificateFixture {
  readonly fixtureId: string;
  readonly modeId: string;
  readonly evidence: ModeCertificateEvidence;
  readonly expected: 'accept' | 'reject';
}

export interface ModeArtifactFixture {
  readonly fixtureId: string;
  readonly modeId: string;
  readonly state: Readonly<JsonObject>;
  readonly context: ModeArtifactContext;
  readonly expected: 'accept' | 'reject';
}

export type ModeHookInputs = {
  readonly [THook in keyof ModeConvergenceHooks]: Parameters<ModeConvergenceHooks[THook]>[0];
};

export interface ModeHookFixture {
  readonly fixtureId: string;
  readonly modeId: string;
  readonly inputs: ModeHookInputs;
  readonly expected: 'accept' | 'reject';
}

export interface ModeResumeFixture {
  readonly fixtureId: string;
  readonly modeId: string;
  readonly snapshot: ModeResumeSnapshot<JsonObject>;
  readonly expectedOutcome: 'upcast' | 'pin-legacy' | 'fork' | 'migrate' | 'block';
}

export interface ModeCompatibilityFixture extends ModeCompatibilityInput {
  readonly fixtureId: string;
  readonly modeId: string;
  readonly expectedStatus: ModeCompatibilityDecision['status'];
}

export interface ModeConformanceFixtures {
  readonly writes: readonly ModeWriteFixture[];
  readonly reducers: readonly ModeReducerFixture[];
  readonly certificates: readonly ModeCertificateFixture[];
  readonly artifacts: readonly ModeArtifactFixture[];
  readonly hooks: readonly ModeHookFixture[];
  readonly resumes: readonly ModeResumeFixture[];
  readonly compatibility: readonly ModeCompatibilityFixture[];
}

export interface ModeConformanceInput {
  readonly manifest: unknown;
  readonly contracts: readonly ModeContractEntry[];
  readonly fixtures: ModeConformanceFixtures;
}

export interface ModeConformanceIssue {
  readonly code: string;
  readonly message: string;
  readonly modeId: string | null;
  readonly fixtureId: string | null;
}

export interface ModeConformanceRow {
  readonly modeId: string;
  readonly interfaceVersion: string | null;
  readonly status: 'pass' | 'reject';
  readonly issueCodes: readonly string[];
}

export interface ModeConformanceReport {
  readonly passed: boolean;
  readonly manifestModeIds: readonly string[];
  readonly rows: readonly ModeConformanceRow[];
  readonly issues: readonly ModeConformanceIssue[];
}

interface ModeWriteEvaluation {
  readonly outcome: 'accept' | 'reject';
  readonly reasonCodes: readonly string[];
}

// ───────────────────────────────────────────────────────────────────
// 2. MANIFEST AND VALUE HELPERS
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Read the workstream list from the supplied manifest without a fallback list. */
export function modeWorkstreamsFromManifest(manifest: unknown): readonly string[] {
  if (!isRecord(manifest) || !Array.isArray(manifest.mode_workstreams_phase_013)) {
    throw new TypeError('Manifest must declare mode_workstreams_phase_013');
  }
  const modeIds = manifest.mode_workstreams_phase_013;
  if (
    modeIds.length === 0
    || modeIds.some((modeId) => typeof modeId !== 'string' || modeId.length === 0)
  ) {
    throw new TypeError('Manifest mode workstreams must be non-empty strings');
  }
  if (new Set(modeIds).size !== modeIds.length) {
    throw new TypeError('Manifest mode workstreams must be unique');
  }
  return Object.freeze([...modeIds]);
}

function pushIssue(
  issues: ModeConformanceIssue[],
  code: string,
  message: string,
  modeId: string | null = null,
  fixtureId: string | null = null,
): void {
  issues.push(Object.freeze({ code, message, modeId, fixtureId }));
}

function setDifference(left: readonly string[], right: readonly string[]): string[] {
  const rightSet = new Set(right);
  return left.filter((value) => !rightSet.has(value));
}

function hasExactMembers(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length
    && setDifference(left, right).length === 0
    && setDifference(right, left).length === 0
    && new Set(left).size === left.length;
}

function cloneJson<TValue extends JsonObject>(value: TValue): TValue {
  return JSON.parse(canonicalJson(value)) as TValue;
}

function deepFreeze<TValue>(value: TValue): TValue {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return value;
  for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  return Object.freeze(value);
}

function isDeepFrozen(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return true;
  if (!Object.isFrozen(value)) return false;
  return Object.values(value as Record<string, unknown>).every(isDeepFrozen);
}

function hasClosedObjectShape(value: unknown, fieldSet: object): value is Record<string, unknown> {
  if (!isRecord(value)) return false;
  const keys = Reflect.ownKeys(value);
  return keys.every((key): key is string => typeof key === 'string')
    && hasExactMembers(keys, Object.keys(fieldSet));
}

function changedObjectKeys(
  before: Readonly<JsonObject>,
  after: Readonly<JsonObject>,
): string[] {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys].filter((key) => {
    const existedBefore = Object.prototype.hasOwnProperty.call(before, key);
    const existsAfter = Object.prototype.hasOwnProperty.call(after, key);
    return existedBefore !== existsAfter || canonicalJson({ value: before[key] })
      !== canonicalJson({ value: after[key] });
  });
}

function hasUnknownResumeEvidence(snapshot: ModeResumeSnapshot<JsonObject>): boolean {
  return snapshot.evidence.replayFingerprint.status === 'unknown'
    || snapshot.evidence.lease.status === 'unknown'
    || snapshot.evidence.receipts.status === 'unknown'
    || snapshot.evidence.continuityIdentity.status === 'unknown'
    || snapshot.evidence.artifacts.status === 'unknown'
    || snapshot.evidence.pendingEffects.status === 'unknown';
}

function hasIncoherentResumeEvidence(snapshot: ModeResumeSnapshot<JsonObject>): boolean {
  const evidence = snapshot.evidence;
  return (
    evidence.replayFingerprint.status === 'verified'
    && evidence.replayFingerprint.verification === null
  ) || (
    evidence.lease.status === 'valid'
    && evidence.lease.lease === null
  ) || (
    evidence.receipts.status === 'verified'
    && evidence.receipts.receipts.length === 0
  ) || (
    evidence.continuityIdentity.status === 'verified'
    && evidence.continuityIdentity.frontier === null
  ) || (
    evidence.artifacts.status === 'verified'
    && evidence.artifacts.references.length === 0
  ) || (
    evidence.pendingEffects.status === 'recoverable'
    && evidence.pendingEffects.claims.length === 0
  ) || (
    evidence.replayFingerprint.status === 'mismatch'
    && evidence.replayFingerprint.verification !== null
  ) || (
    (evidence.lease.status === 'lost' || evidence.lease.status === 'stale')
    && evidence.lease.lease !== null
  ) || (
    (evidence.receipts.status === 'conflict' || evidence.receipts.status === 'missing')
    && evidence.receipts.receipts.length > 0
  ) || (
    (
      evidence.continuityIdentity.status === 'conflict'
      || evidence.continuityIdentity.status === 'missing'
    )
    && evidence.continuityIdentity.frontier !== null
  ) || (
    (evidence.artifacts.status === 'invalid' || evidence.artifacts.status === 'missing')
    && evidence.artifacts.references.length > 0
  ) || (
    evidence.pendingEffects.status === 'none'
    && evidence.pendingEffects.claims.length > 0
  );
}

// ───────────────────────────────────────────────────────────────────
// 3. CONTRACT VALIDATION
// ───────────────────────────────────────────────────────────────────

function validateDescriptor(
  modeId: string,
  contract: ModeContract,
  issues: ModeConformanceIssue[],
): void {
  const descriptor = contract.describe();
  if (descriptor.modeId !== modeId) {
    pushIssue(issues, 'MODE_ID_MISMATCH', 'Contract identity differs from its matrix row', modeId);
  }
  if (
    descriptor.interfaceVersion !== MODE_CONTRACT_INTERFACE_VERSION
    || descriptor.interfaceShape !== MODE_CONTRACT_SHAPE
    || descriptor.compatibilityPolicyVersion !== MODE_COMPATIBILITY_POLICY_VERSION
  ) {
    pushIssue(
      issues,
      'INTERFACE_FORK',
      'Mode locally reinterprets the frozen interface identity',
      modeId,
    );
  }
  const changeKindsByPair = new Map<string, string>();
  for (const change of descriptor.compatibilityChanges) {
    const pair = [change.fromVersion, change.toVersion].sort().join('\u0000');
    const previousKind = changeKindsByPair.get(pair);
    if (previousKind !== undefined && previousKind !== change.kind) {
      pushIssue(
        issues,
        'COMPATIBILITY_CHANGE_CONFLICT',
        'One interface-version pair has conflicting compatibility classifications',
        modeId,
      );
    }
    changeKindsByPair.set(pair, change.kind);
  }
  const resumeEvidenceChecks: readonly (keyof ModeResumeSnapshot<JsonObject>['evidence'])[] = [
    'replayFingerprint',
    'lease',
    'receipts',
    'continuityIdentity',
    'artifacts',
    'pendingEffects',
  ];
  if (
    descriptor.resumeAdapters.length === 0
    || descriptor.resumeAdapters.some((adapter) => (
      adapter.adapterId.length === 0
      || adapter.toInterfaceVersion !== MODE_CONTRACT_INTERFACE_VERSION
      || adapter.deterministic !== true
      || !hasExactMembers(adapter.requiredChecks, resumeEvidenceChecks)
    ))
  ) {
    pushIssue(
      issues,
      'RESUME_ADAPTER_DECLARATION_INVALID',
      'Resume upcasters must be deterministic and bind every recovery evidence check',
      modeId,
    );
  }
  if (!hasExactMembers(descriptor.providedCapabilities, ModeProvidedCapabilities)) {
    pushIssue(
      issues,
      'CAPABILITY_SET_MISMATCH',
      'Mode capability declaration must equal the frozen lifecycle surface',
      modeId,
    );
  }
  if (!hasExactMembers(descriptor.requiredPorts, REQUIRED_MODE_SUBSTRATE_PORTS)) {
    pushIssue(
      issues,
      'PORT_SET_MISMATCH',
      'Mode port declaration must equal the complete substrate port set',
      modeId,
    );
  }
  if (
    descriptor.migrationPosture !== 'additive-dark'
    || descriptor.legacyAuthority !== 'authoritative'
    || descriptor.ledgerAuthority !== 'shadow-only'
    || descriptor.writeSet.authority !== 'legacy'
    || descriptor.writeSet.ledgerPosture !== 'shadow-write'
    || descriptor.writeSet.legacyProjection !== 'required'
  ) {
    pushIssue(
      issues,
      'AUTHORITY_POSTURE_INVALID',
      'Mode contract must preserve legacy authority and shadow-only ledger writes',
      modeId,
    );
  }

  for (const capability of ModeProvidedCapabilities) {
    if (typeof contract[capability] !== 'function') {
      pushIssue(
        issues,
        'CAPABILITY_MISSING',
        `Mode contract does not implement ${capability}`,
        modeId,
      );
    }
  }
}

function validateEventsAndReducers(
  modeId: string,
  contract: ModeContract,
  issues: ModeConformanceIssue[],
): void {
  const descriptor = contract.describe();
  const events = contract.eventTypes();
  const reducers = contract.reducers.definitions;
  const persistedFields = contract.reducers.persistedFields;
  if (events.length === 0) {
    pushIssue(issues, 'EVENT_SCHEMA_MISSING', 'Mode must declare at least one event schema', modeId);
  }
  if (reducers.length === 0) {
    pushIssue(issues, 'REDUCER_MISSING', 'Mode must declare at least one reducer', modeId);
  }

  const eventTypes = new Set<string>();
  const reducerIds = new Set<string>();
  const fieldOwners = new Map<string, string>();
  const fieldOwnerCounts = new Map<string, number>();
  for (const reducer of reducers) {
    if (reducerIds.has(reducer.reducerId)) {
      pushIssue(issues, 'REDUCER_DUPLICATE', 'Reducer identifiers must be unique', modeId);
    }
    reducerIds.add(reducer.reducerId);
    if (
      reducer.ownedFields.length === 0
      || reducer.inputEventTypes.length === 0
      || reducer.replaySource !== 'verified-ledger-events-only'
      || reducer.outputRule !== 'immutable'
    ) {
      pushIssue(
        issues,
        'REDUCER_CONTRACT_INCOMPLETE',
        'Reducer ownership, inputs, replay source, and immutable output are mandatory',
        modeId,
      );
    }
    for (const field of reducer.ownedFields) {
      const owner = fieldOwners.get(field);
      const ownerCount = (fieldOwnerCounts.get(field) ?? 0) + 1;
      fieldOwnerCounts.set(field, ownerCount);
      if (ownerCount > 1) {
        pushIssue(
          issues,
          'REDUCER_OWNER_CONFLICT',
          `Persisted field ${field} does not have exactly one reducer owner`,
          modeId,
        );
      }
      if (!owner) fieldOwners.set(field, reducer.reducerId);
    }
  }

  if (
    persistedFields.length === 0
    || !hasExactMembers(persistedFields, [...fieldOwners.keys()])
  ) {
    pushIssue(
      issues,
      'PERSISTED_FIELD_OWNERSHIP_INCOMPLETE',
      'Persisted fields must equal the closed set owned by reducers',
      modeId,
    );
  }

  for (const event of events) {
    if (eventTypes.has(event.eventType)) {
      pushIssue(issues, 'EVENT_TYPE_DUPLICATE', 'Event types must be unique', modeId);
    }
    eventTypes.add(event.eventType);
    const eventReducers = reducers.filter((candidate) => (
      candidate.inputEventTypes.includes(event.eventType)
    ));
    const reducer = eventReducers.find((candidate) => candidate.reducerId === event.reducerOwner);
    if (
      event.eventType.length === 0
      || !Number.isSafeInteger(event.schemaVersion)
      || event.schemaVersion < 1
      || event.interfaceVersion !== descriptor.interfaceVersion
      || event.requiredFields.length === 0
      || event.transitionIntent.length === 0
      || event.replayInputs.length === 0
      || event.replayInputs.some((input) => !input.digestRequired)
      || event.writeBoundary.authorization !== 'TransitionAuthorizationGateway'
      || event.writeBoundary.append !== 'AppendOnlyLedger.appendAuthorized'
      || event.definition.eventType !== event.eventType
      || event.definition.currentVersion !== event.schemaVersion
    ) {
      pushIssue(
        issues,
        'EVENT_SCHEMA_INVALID',
        'Event schema lacks stable version, transition, replay, or authorized-write metadata',
        modeId,
      );
    }
    if (!reducer || eventReducers.length !== 1) {
      pushIssue(
        issues,
        'EVENT_REDUCER_UNOWNED',
        'Every event must route to exactly one declared reducer owner',
        modeId,
      );
    }
  }
}

function validateFixtureCoverage(
  manifestModeIds: readonly string[],
  fixtures: ModeConformanceFixtures,
  issues: ModeConformanceIssue[],
): void {
  const fixtureGroups = Object.entries(fixtures) as Array<[
    keyof ModeConformanceFixtures,
    readonly { readonly fixtureId: string; readonly modeId: string }[],
  ]>;
  for (const [groupName, group] of fixtureGroups) {
    const fixtureModeIds = group.map((fixture) => fixture.modeId);
    for (const modeId of manifestModeIds) {
      if (!fixtureModeIds.includes(modeId)) {
        pushIssue(
          issues,
          'FIXTURE_COVERAGE_MISSING',
          `Fixture group ${groupName} does not cover the manifest workstream`,
          modeId,
        );
      }
    }
    for (const fixture of group) {
      if (!manifestModeIds.includes(fixture.modeId)) {
        pushIssue(
          issues,
          'FIXTURE_MODE_UNEXPECTED',
          `Fixture group ${groupName} names a mode outside the manifest`,
          fixture.modeId,
          fixture.fixtureId,
        );
      }
    }
  }
}

function validateEvidencePolicies(
  modeId: string,
  contract: ModeContract,
  issues: ModeConformanceIssue[],
): void {
  if (contract.artifactPolicies.length === 0 || contract.certificatePolicies.length === 0) {
    pushIssue(
      issues,
      'EVIDENCE_POLICY_MISSING',
      'Artifact and certificate policies are both required',
      modeId,
    );
  }
  for (const policy of contract.artifactPolicies) {
    if (
      policy.authorityEffect !== 'none'
      || policy.sealBoundary !== 'SealedArtifactStore'
      || policy.requiredInputDigests.length === 0
      || policy.sourceEventTypes.length === 0
      || policy.invalidationConditions.length === 0
    ) {
      pushIssue(
        issues,
        'ARTIFACT_POLICY_INVALID',
        'Artifacts must be sealed, digest-bound, invalidatable evidence without authority',
        modeId,
      );
    }
  }
  for (const policy of contract.certificatePolicies) {
    if (
      policy.authorityEffect !== 'none'
      || policy.legacyAuthority !== 'unchanged'
      || !policy.evidenceReferencesRequired
      || policy.invalidationConditions.length === 0
    ) {
      pushIssue(
        issues,
        'CERTIFICATE_POLICY_INVALID',
        'Certificates must remain invalidatable evidence and cannot change authority',
        modeId,
      );
    }
  }
}

function validateConvergenceHooks(
  modeId: string,
  contract: ModeContract,
  issues: ModeConformanceIssue[],
): void {
  const hooks = contract.convergenceHooks();
  const expected = Object.keys(ModeConvergenceHookSet);
  const actual = Object.keys(hooks);
  if (!hasExactMembers(actual, expected)) {
    pushIssue(
      issues,
      'HOOK_SET_MISMATCH',
      'Convergence hooks must expose the complete observation-only signal set',
      modeId,
    );
  }
  for (const hookName of expected) {
    if (typeof (hooks as unknown as Record<string, unknown>)[hookName] !== 'function') {
      pushIssue(issues, 'HOOK_MISSING', `Convergence hook ${hookName} is not callable`, modeId);
    }
  }
}

function validateWriteSet(
  modeId: string,
  contract: ModeContract,
  issues: ModeConformanceIssue[],
): void {
  const resources = contract.describe().writeSet.resources;
  if (resources.length === 0) {
    pushIssue(issues, 'WRITE_SET_MISSING', 'Mode must declare every write resource', modeId);
  }
  const resourceIds = new Set<string>();
  for (const resource of resources) {
    if (
      resource.resource.length === 0
      || resource.conflictKey.length === 0
      || resource.owner.ownerId.length === 0
    ) {
      pushIssue(issues, 'WRITE_SET_INVALID', 'Write resources need stable ownership keys', modeId);
    }
    if (resourceIds.has(resource.resource)) {
      pushIssue(issues, 'WRITE_RESOURCE_DUPLICATE', 'Write resources must be unique', modeId);
    }
    resourceIds.add(resource.resource);
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. FIXTURE EVALUATION
// ───────────────────────────────────────────────────────────────────

/** Evaluate a proposed mode event without performing a runtime write. */
export function evaluateModeEventWrite(
  contract: ModeContract,
  attempt: ModeEventWriteAttempt,
): ModeWriteEvaluation {
  const schema = contract.eventTypes().find((candidate) => candidate.eventType === attempt.eventType);
  const reasons: string[] = [];
  if (!schema) reasons.push('event-type-undeclared');
  if (attempt.directMutation) reasons.push('direct-mutation');
  if (attempt.authorizationVerdict !== 'allow') reasons.push('authorization-not-allowed');
  if (attempt.appendPath !== 'AppendOnlyLedger.appendAuthorized') reasons.push('append-path-invalid');
  if (schema) {
    if (schema.writeBoundary.authorization !== 'TransitionAuthorizationGateway') {
      reasons.push('schema-authorization-boundary-invalid');
    }
    if (schema.writeBoundary.append !== 'AppendOnlyLedger.appendAuthorized') {
      reasons.push('schema-append-boundary-invalid');
    }
    if (attempt.schemaVersion !== schema.schemaVersion) reasons.push('schema-version-stale');
    if (attempt.interfaceVersion !== schema.interfaceVersion) reasons.push('interface-version-stale');
    if (attempt.transitionIntent !== schema.transitionIntent) reasons.push('transition-intent-mismatch');
    if (attempt.reducerOwner !== schema.reducerOwner) reasons.push('reducer-owner-mismatch');
    const declaredInputs = schema.replayInputs.map((input) => input.inputId);
    if (!hasExactMembers(attempt.replayInputIds, declaredInputs)) {
      reasons.push('replay-inputs-mismatch');
    }
  }
  return Object.freeze({
    outcome: reasons.length === 0 ? 'accept' : 'reject',
    reasonCodes: Object.freeze(reasons),
  });
}

function runWriteFixtures(
  entries: ReadonlyMap<string, ModeContract>,
  fixtures: readonly ModeWriteFixture[],
  issues: ModeConformanceIssue[],
): void {
  for (const fixture of fixtures) {
    const contract = entries.get(fixture.modeId);
    if (!contract) continue;
    const result = evaluateModeEventWrite(contract, fixture.attempt);
    if (
      fixture.attempt.directMutation
      || fixture.attempt.authorizationVerdict !== 'allow'
      || fixture.attempt.appendPath !== 'AppendOnlyLedger.appendAuthorized'
    ) {
      pushIssue(
        issues,
        'WRITE_BOUNDARY_INVARIANT',
        'Mode event writes must use the authorized append-only boundary',
        fixture.modeId,
        fixture.fixtureId,
      );
    }
    if (result.outcome !== fixture.expected) {
      pushIssue(
        issues,
        'WRITE_FIXTURE_MISMATCH',
        `Write fixture expected ${fixture.expected} but received ${result.outcome}`,
        fixture.modeId,
        fixture.fixtureId,
      );
    }
  }
}

function runReducerFixtures(
  entries: ReadonlyMap<string, ModeContract>,
  fixtures: readonly ModeReducerFixture[],
  issues: ModeConformanceIssue[],
): void {
  for (const fixture of fixtures) {
    const contract = entries.get(fixture.modeId);
    if (!contract) continue;
    let outcome: 'accept' | 'reject' = 'accept';
    let ownershipInvariantViolated = false;
    try {
      const firstInput = deepFreeze(cloneJson(fixture.initialState));
      const secondInput = deepFreeze(cloneJson(fixture.initialState));
      const initialDigest = canonicalJson(firstInput);
      const first = contract.reduce(fixture.event, firstInput);
      const second = contract.reduce(fixture.event, secondInput);
      const firstReducer = contract.reducers.definitions.find((definition) => (
        definition.reducerId === first.reducerId
      ));
      const secondReducer = contract.reducers.definitions.find((definition) => (
        definition.reducerId === second.reducerId
      ));
      const firstChangedFields = changedObjectKeys(firstInput, first.state);
      const secondChangedFields = changedObjectKeys(secondInput, second.state);
      const firstOwnershipViolation = firstReducer === undefined
        || firstChangedFields.some((field) => !firstReducer.ownedFields.includes(field));
      const secondOwnershipViolation = secondReducer === undefined
        || secondChangedFields.some((field) => !secondReducer.ownedFields.includes(field));
      ownershipInvariantViolated = firstOwnershipViolation || secondOwnershipViolation;
      if (
        canonicalJson(first.state) !== canonicalJson(second.state)
        || canonicalJson(firstInput) !== initialDigest
        || canonicalJson(secondInput) !== initialDigest
        || !isDeepFrozen(first.state)
        || !isDeepFrozen(second.state)
        || first.reducerId !== second.reducerId
        || first.stateVersion !== second.stateVersion
        || firstReducer === undefined
        || secondReducer === undefined
        || firstOwnershipViolation
        || secondOwnershipViolation
      ) {
        outcome = 'reject';
      }
    } catch {
      outcome = 'reject';
    }
    if (ownershipInvariantViolated) {
      pushIssue(
        issues,
        'REDUCER_OWNERSHIP_INVARIANT',
        'Mode reducer output must change only fields owned by the returned reducer',
        fixture.modeId,
        fixture.fixtureId,
      );
    }
    if (outcome !== fixture.expected) {
      pushIssue(
        issues,
        'REDUCER_FIXTURE_MISMATCH',
        `Reducer fixture expected ${fixture.expected} but received ${outcome}`,
        fixture.modeId,
        fixture.fixtureId,
      );
    }
  }
}

function runArtifactFixtures(
  entries: ReadonlyMap<string, ModeContract>,
  fixtures: readonly ModeArtifactFixture[],
  issues: ModeConformanceIssue[],
): void {
  for (const fixture of fixtures) {
    const contract = entries.get(fixture.modeId);
    if (!contract) continue;
    let outcome: 'accept' | 'reject' = 'accept';
    let authorityInvariantViolated = false;
    try {
      const artifacts = contract.sealArtifacts(fixture.state, fixture.context);
      authorityInvariantViolated = !Array.isArray(artifacts) || artifacts.some((artifact) => (
        !hasClosedObjectShape(artifact, ModeArtifactEvidenceFieldSet)
        || artifact.authorityEffect !== 'none'
        || artifact.legacyAuthority !== 'unchanged'
      ));
      if (
        !Array.isArray(artifacts)
        || artifacts.length === 0
        || authorityInvariantViolated
      ) {
        outcome = 'reject';
      }
    } catch {
      outcome = 'reject';
    }
    if (authorityInvariantViolated) {
      pushIssue(
        issues,
        'ARTIFACT_AUTHORITY_INVARIANT',
        'Mode artifact output must remain authority-neutral',
        fixture.modeId,
        fixture.fixtureId,
      );
    }
    if (outcome !== fixture.expected) {
      pushIssue(
        issues,
        'ARTIFACT_FIXTURE_MISMATCH',
        `Artifact fixture expected ${fixture.expected} but received ${outcome}`,
        fixture.modeId,
        fixture.fixtureId,
      );
    }
  }
}

function runCertificateFixtures(
  entries: ReadonlyMap<string, ModeContract>,
  fixtures: readonly ModeCertificateFixture[],
  issues: ModeConformanceIssue[],
): void {
  for (const fixture of fixtures) {
    const contract = entries.get(fixture.modeId);
    if (!contract) continue;
    let outcome: 'accept' | 'reject' = 'accept';
    let authorityInvariantViolated = false;
    try {
      const certificate = contract.issueCertificate(fixture.evidence);
      authorityInvariantViolated = !hasClosedObjectShape(certificate, ModeCertificateFieldSet)
        || certificate.authorityEffect !== 'none'
        || certificate.legacyAuthority !== 'unchanged';
      if (
        authorityInvariantViolated
        || certificate.evidenceReferences.length === 0
        || certificate.invalidationConditions.length === 0
      ) {
        outcome = 'reject';
      }
    } catch {
      outcome = 'reject';
    }
    if (authorityInvariantViolated) {
      pushIssue(
        issues,
        'CERTIFICATE_AUTHORITY_INVARIANT',
        'Mode certificate output must remain authority-neutral',
        fixture.modeId,
        fixture.fixtureId,
      );
    }
    if (outcome !== fixture.expected) {
      pushIssue(
        issues,
        'CERTIFICATE_FIXTURE_MISMATCH',
        `Certificate fixture expected ${fixture.expected} but received ${outcome}`,
        fixture.modeId,
        fixture.fixtureId,
      );
    }
  }
}

function runHookFixtures(
  entries: ReadonlyMap<string, ModeContract>,
  fixtures: readonly ModeHookFixture[],
  issues: ModeConformanceIssue[],
): void {
  for (const fixture of fixtures) {
    const contract = entries.get(fixture.modeId);
    if (!contract) continue;
    let outcome: 'accept' | 'reject' = 'accept';
    let authorityInvariantViolated = false;
    try {
      const hooks = contract.convergenceHooks();
      for (const hookName of Object.keys(ModeConvergenceHookSet) as (keyof ModeConvergenceHooks)[]) {
        const hook = hooks[hookName] as unknown as (signal: unknown) => unknown;
        const output = hook(fixture.inputs[hookName]);
        const outputViolatesAuthority = !hasClosedObjectShape(
          output,
          ModeConvergenceObservationFieldSet,
        ) || output.authority !== 'observation-only';
        authorityInvariantViolated ||= outputViolatesAuthority;
        if (
          !isRecord(output)
          || outputViolatesAuthority
        ) {
          outcome = 'reject';
        }
      }
    } catch {
      outcome = 'reject';
    }
    if (authorityInvariantViolated) {
      pushIssue(
        issues,
        'HOOK_AUTHORITY_INVARIANT',
        'Mode hook output must remain observation-only and policy-neutral',
        fixture.modeId,
        fixture.fixtureId,
      );
    }
    if (outcome !== fixture.expected) {
      pushIssue(
        issues,
        'HOOK_FIXTURE_MISMATCH',
        `Hook fixture expected ${fixture.expected} but received ${outcome}`,
        fixture.modeId,
        fixture.fixtureId,
      );
    }
  }
}

function runResumeFixtures(
  entries: ReadonlyMap<string, ModeContract>,
  fixtures: readonly ModeResumeFixture[],
  issues: ModeConformanceIssue[],
): void {
  for (const fixture of fixtures) {
    const contract = entries.get(fixture.modeId);
    if (!contract) continue;
    try {
      const result = contract.classifyResume(fixture.snapshot);
      if (
        result.outcome !== fixture.expectedOutcome
        || result.snapshotId !== fixture.snapshot.snapshotId
        || result.evidence !== fixture.snapshot.evidence
        || (hasUnknownResumeEvidence(fixture.snapshot) && result.outcome !== 'block')
        || (hasIncoherentResumeEvidence(fixture.snapshot) && result.outcome !== 'block')
      ) {
        pushIssue(
          issues,
          'RESUME_FIXTURE_MISMATCH',
          `Resume fixture expected ${fixture.expectedOutcome} but received ${result.outcome}`,
          fixture.modeId,
          fixture.fixtureId,
        );
      }
    } catch {
      pushIssue(
        issues,
        'RESUME_FIXTURE_EXCEPTION',
        'Resume classification must return an explicit fail-closed outcome',
        fixture.modeId,
        fixture.fixtureId,
      );
    }
  }
}

function runCompatibilityFixtures(
  fixtures: readonly ModeCompatibilityFixture[],
  issues: ModeConformanceIssue[],
): void {
  for (const fixture of fixtures) {
    const result = resolveModeInterfaceCompatibility(fixture);
    if (result.status !== fixture.expectedStatus) {
      pushIssue(
        issues,
        'COMPATIBILITY_FIXTURE_MISMATCH',
        `Compatibility fixture expected ${fixture.expectedStatus} but received ${result.status}`,
        fixture.modeId,
        fixture.fixtureId,
      );
    }
  }
}

function validateCrossModeWriteConflicts(
  entries: ReadonlyMap<string, ModeContract>,
  issues: ModeConformanceIssue[],
): void {
  const byConflictKey = new Map<string, Array<{
    readonly modeId: string;
    readonly serialization: 'fenced-lease' | 'single-writer' | null;
  }>>();
  for (const [modeId, contract] of entries) {
    for (const resource of contract.describe().writeSet.resources) {
      const group = byConflictKey.get(resource.conflictKey) ?? [];
      group.push({ modeId, serialization: resource.serialization });
      byConflictKey.set(resource.conflictKey, group);
    }
  }
  for (const [conflictKey, group] of byConflictKey) {
    if (new Set(group.map((entry) => entry.modeId)).size < 2) continue;
    const serializations = new Set(group.map((entry) => entry.serialization));
    if (serializations.size !== 1 || serializations.has(null)) {
      for (const entry of group) {
        pushIssue(
          issues,
          'WRITE_SET_CONFLICT',
          `Shared conflict key ${conflictKey} lacks one explicit serialization rule`,
          entry.modeId,
        );
      }
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. CONFORMANCE MATRIX
// ───────────────────────────────────────────────────────────────────

/** Run the closed contract and fixture matrix for every manifest workstream. */
export function runModeConformance(input: ModeConformanceInput): ModeConformanceReport {
  const manifestModeIds = modeWorkstreamsFromManifest(input.manifest);
  const issues: ModeConformanceIssue[] = [];
  const entries = new Map<string, ModeContract>();

  for (const entry of input.contracts) {
    if (entries.has(entry.modeId)) {
      pushIssue(issues, 'MODE_DUPLICATE', 'Conformance matrix contains a duplicate mode', entry.modeId);
      continue;
    }
    entries.set(entry.modeId, entry.contract);
  }

  for (const modeId of manifestModeIds) {
    const contract = entries.get(modeId);
    if (!contract) {
      pushIssue(issues, 'MODE_MISSING', 'Manifest workstream has no mode contract', modeId);
      continue;
    }
    validateDescriptor(modeId, contract, issues);
    validateEventsAndReducers(modeId, contract, issues);
    validateEvidencePolicies(modeId, contract, issues);
    validateConvergenceHooks(modeId, contract, issues);
    validateWriteSet(modeId, contract, issues);
  }

  for (const modeId of entries.keys()) {
    if (!manifestModeIds.includes(modeId)) {
      pushIssue(issues, 'MODE_UNEXPECTED', 'Mode contract is absent from the manifest', modeId);
    }
  }

  validateFixtureCoverage(manifestModeIds, input.fixtures, issues);
  runWriteFixtures(entries, input.fixtures.writes, issues);
  runReducerFixtures(entries, input.fixtures.reducers, issues);
  runCertificateFixtures(entries, input.fixtures.certificates, issues);
  runArtifactFixtures(entries, input.fixtures.artifacts, issues);
  runHookFixtures(entries, input.fixtures.hooks, issues);
  runResumeFixtures(entries, input.fixtures.resumes, issues);
  runCompatibilityFixtures(input.fixtures.compatibility, issues);
  validateCrossModeWriteConflicts(entries, issues);

  const rows = manifestModeIds.map((modeId): ModeConformanceRow => {
    const rowIssues = issues.filter((issue) => issue.modeId === modeId);
    return Object.freeze({
      modeId,
      interfaceVersion: entries.get(modeId)?.describe().interfaceVersion ?? null,
      status: rowIssues.length === 0 ? 'pass' : 'reject',
      issueCodes: Object.freeze(rowIssues.map((issue) => issue.code)),
    });
  });

  return Object.freeze({
    passed: issues.length === 0,
    manifestModeIds,
    rows: Object.freeze(rows),
    issues: Object.freeze(issues),
  });
}
