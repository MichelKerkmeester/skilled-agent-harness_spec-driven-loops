// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Artifact Set
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
  artifactReferenceSetReplayInput,
  bindVerifiedArtifactReferences,
} from '../sealed-reference-artifacts/index.js';
import { DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY } from './deep-research-artifact-material.js';
import { parseDeepResearchSealedArtifactBinding } from './deep-research-sealed-artifacts.js';
import { DeepResearchArtifactKinds } from './deep-research-sealed-artifact-types.js';

import type { AppendOnlyLedger } from '../authorized-ledger/index.js';
import type {
  ArtifactInputEquivalenceResult,
  ArtifactReferenceSet,
  ArtifactReferenceSetEntry,
  ArtifactReplayInput,
  SealedArtifactStore,
} from '../sealed-reference-artifacts/index.js';
import type {
  DeepResearchArtifactKind,
  DeepResearchArtifactLifecycle,
  DeepResearchArtifactSet,
  DeepResearchArtifactSetContext,
  DeepResearchArtifactSetCore,
  DeepResearchArtifactSetMember,
  DeepResearchArtifactSetMemberInput,
} from './deep-research-sealed-artifact-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. ORDERING CONTRACT
// ───────────────────────────────────────────────────────────────────

export const DEEP_RESEARCH_ARTIFACT_SET_VERSION = 1 as const;

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,255}$/;
const SET_FIELDS = new Set([
  'artifactSetVersion',
  'context',
  'orderedMembers',
  'referenceSet',
]);
const CONTEXT_FIELDS = new Set([
  'runId',
  'lineageId',
  'generation',
  'sourceTailSequence',
  'replayContractDigest',
]);
const MEMBER_FIELDS = new Set([
  'position',
  'lifecycle',
  'iteration',
  'logicalSequence',
  'binding',
]);
const REFERENCE_SET_FIELDS = new Set([
  'reference_set_version',
  'ordered_artifacts',
  'reference_set_digest',
]);
const REFERENCE_ENTRY_FIELDS = new Set([
  'position',
  'reference',
  'descriptor_digest',
  'verification_result',
  'sealed_ledger_id',
  'sealed_sequence',
  'sealed_record_hash',
]);

const LifecycleOrder: Readonly<Record<DeepResearchArtifactLifecycle, number>> =
  Object.freeze({
    init: 0,
    gather: 1,
    analyze: 2,
    convergence: 3,
    synthesize: 4,
    'memory-save': 5,
  });

const RequiredKinds = Object.freeze(Object.values(DeepResearchArtifactKinds));
const RegistrationByKind = new Map(
  DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY.map((entry, kindIndex) => [
    entry.artifactKind,
    Object.freeze({ ...entry, kindIndex }),
  ]),
);

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION
// ───────────────────────────────────────────────────────────────────

function fail(
  code: 'EVIDENCE_CONFLICT' | 'EVIDENCE_MISSING',
  message: string,
  details: Readonly<Record<string, string | number | boolean | null>> = {},
): never {
  throw new SealedArtifactError(code, 'evidence', message, details);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactFields(
  value: Record<string, unknown>,
  fields: ReadonlySet<string>,
): boolean {
  return Object.keys(value).length === fields.size
    && Object.keys(value).every((field) => fields.has(field));
}

function requireToken(field: string, value: unknown): string {
  if (typeof value !== 'string' || !TOKEN_PATTERN.test(value)) {
    return fail(SealedArtifactErrorCodes.EVIDENCE_CONFLICT, 'Artifact-set context is invalid', {
      field,
    });
  }
  return value;
}

function requireSafeInteger(field: string, value: unknown, minimum: number): number {
  if (!Number.isSafeInteger(value) || (value as number) < minimum) {
    return fail(SealedArtifactErrorCodes.EVIDENCE_CONFLICT, 'Artifact-set sequence is invalid', {
      field,
    });
  }
  return value as number;
}

function parseContext(input: unknown): DeepResearchArtifactSetContext {
  if (!isRecord(input) || !hasExactFields(input, CONTEXT_FIELDS)) {
    return fail(SealedArtifactErrorCodes.EVIDENCE_CONFLICT, 'Artifact-set context is malformed');
  }
  const replayContractDigest = input.replayContractDigest;
  if (typeof replayContractDigest !== 'string' || !DIGEST_PATTERN.test(replayContractDigest)) {
    return fail(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'Artifact-set replay contract digest is invalid',
    );
  }
  return Object.freeze({
    runId: requireToken('runId', input.runId),
    lineageId: requireToken('lineageId', input.lineageId),
    generation: requireSafeInteger('generation', input.generation, 0),
    sourceTailSequence: requireSafeInteger(
      'sourceTailSequence',
      input.sourceTailSequence,
      0,
    ),
    replayContractDigest,
  });
}

function registrationFor(artifactKind: DeepResearchArtifactKind) {
  const registration = RegistrationByKind.get(artifactKind);
  if (!registration) {
    return fail(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'Artifact-set member kind is not registered',
      { artifactKind },
    );
  }
  return registration;
}

function compareMembers(
  left: Pick<DeepResearchArtifactSetMember, 'binding' | 'iteration' | 'logicalSequence'>,
  right: Pick<DeepResearchArtifactSetMember, 'binding' | 'iteration' | 'logicalSequence'>,
): number {
  const leftRegistration = registrationFor(left.binding.artifactKind);
  const rightRegistration = registrationFor(right.binding.artifactKind);
  return LifecycleOrder[leftRegistration.lifecycle] - LifecycleOrder[rightRegistration.lifecycle]
    || left.iteration - right.iteration
    || left.logicalSequence - right.logicalSequence
    || leftRegistration.kindIndex - rightRegistration.kindIndex
    || left.binding.reference.qualified_digest.localeCompare(
      right.binding.reference.qualified_digest,
    );
}

function validateCompleteOrder(members: readonly DeepResearchArtifactSetMember[]): void {
  if (members.length === 0) {
    return fail(
      SealedArtifactErrorCodes.EVIDENCE_MISSING,
      'Deep Research replay requires a non-empty artifact set',
    );
  }
  const presentKinds = new Set(members.map((member) => member.binding.artifactKind));
  const missingKind = RequiredKinds.find((artifactKind) => !presentKinds.has(artifactKind));
  if (missingKind) {
    return fail(
      SealedArtifactErrorCodes.EVIDENCE_MISSING,
      'Deep Research artifact set is missing a required lifecycle kind',
      { artifactKind: missingKind },
    );
  }
  const logicalSequences = new Set<number>();
  for (const [position, member] of members.entries()) {
    const registration = registrationFor(member.binding.artifactKind);
    if (member.position !== position || member.lifecycle !== registration.lifecycle) {
      return fail(
        SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
        'Artifact-set member position or lifecycle is inconsistent',
        { position },
      );
    }
    const expectedMinimumIteration = member.lifecycle === 'init' ? 0 : 1;
    if (
      !Number.isSafeInteger(member.iteration)
      || member.iteration < expectedMinimumIteration
      || (member.lifecycle === 'init' && member.iteration !== 0)
      || !Number.isSafeInteger(member.logicalSequence)
      || member.logicalSequence < 1
      || logicalSequences.has(member.logicalSequence)
    ) {
      return fail(
        SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
        'Artifact-set iteration or logical sequence is invalid',
        { position },
      );
    }
    logicalSequences.add(member.logicalSequence);
    if (position > 0) {
      const previous = members[position - 1];
      if (
        !previous
        || member.logicalSequence <= previous.logicalSequence
        || compareMembers(previous, member) >= 0
      ) {
        return fail(
          SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
          'Artifact-set members are not in canonical lifecycle order',
          { position },
        );
      }
    }
  }
}

function canonicalCore(
  context: DeepResearchArtifactSetContext,
  orderedMembers: readonly DeepResearchArtifactSetMember[],
  referenceSet: ArtifactReferenceSet,
): DeepResearchArtifactSetCore {
  return Object.freeze({
    artifactSetVersion: DEEP_RESEARCH_ARTIFACT_SET_VERSION,
    context,
    orderedMembers,
    referenceSet,
  });
}

function validateReferenceAlignment(
  members: readonly DeepResearchArtifactSetMember[],
  referenceSet: ArtifactReferenceSet,
): ArtifactReferenceSet {
  if (
    !isRecord(referenceSet)
    || !hasExactFields(referenceSet, REFERENCE_SET_FIELDS)
    || referenceSet.reference_set_version !== 1
    || !Array.isArray(referenceSet.ordered_artifacts)
    || referenceSet.ordered_artifacts.length !== members.length
    || typeof referenceSet.reference_set_digest !== 'string'
    || !DIGEST_PATTERN.test(referenceSet.reference_set_digest)
  ) {
    return fail(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'Shared artifact reference set does not match the mode set',
    );
  }
  const normalizedEntries: ArtifactReferenceSetEntry[] = [];
  for (const [position, member] of members.entries()) {
    const candidate = referenceSet.ordered_artifacts[position];
    if (!isRecord(candidate) || !hasExactFields(candidate, REFERENCE_ENTRY_FIELDS)) {
      return fail(
        SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
        'Shared reference-set entry is malformed',
        { position },
      );
    }
    const referenceEntry = candidate as unknown as ArtifactReferenceSetEntry;
    if (
      referenceEntry.position !== position
      || referenceEntry.verification_result !== 'verified'
      || referenceEntry.descriptor_digest !== member.binding.reference.descriptor_digest
      || typeof referenceEntry.sealed_ledger_id !== 'string'
      || referenceEntry.sealed_ledger_id.length === 0
      || !Number.isSafeInteger(referenceEntry.sealed_sequence)
      || referenceEntry.sealed_sequence < 1
      || typeof referenceEntry.sealed_record_hash !== 'string'
      || !DIGEST_PATTERN.test(referenceEntry.sealed_record_hash)
      || canonicalJson(referenceEntry.reference) !== canonicalJson(member.binding.reference)
    ) {
      return fail(
        SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
        'Mode member and shared reference-set entry do not share one identity',
        { position },
      );
    }
    normalizedEntries.push(Object.freeze({
      position,
      reference: member.binding.reference,
      descriptor_digest: referenceEntry.descriptor_digest,
      verification_result: 'verified',
      sealed_ledger_id: referenceEntry.sealed_ledger_id,
      sealed_sequence: referenceEntry.sealed_sequence,
      sealed_record_hash: referenceEntry.sealed_record_hash,
    }));
  }
  const referenceSetCore = Object.freeze({
    reference_set_version: 1,
    ordered_artifacts: referenceSet.ordered_artifacts,
  });
  if (sha256Bytes(canonicalBytes(referenceSetCore)) !== referenceSet.reference_set_digest) {
    return fail(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'Shared reference-set digest does not match its canonical entries',
    );
  }
  return Object.freeze({
    reference_set_version: 1,
    ordered_artifacts: Object.freeze(normalizedEntries) as unknown as ArtifactReferenceSetEntry[],
    reference_set_digest: referenceSet.reference_set_digest,
  });
}

function parseMember(input: unknown, position: number): DeepResearchArtifactSetMember {
  if (!isRecord(input) || !hasExactFields(input, MEMBER_FIELDS)) {
    return fail(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'Artifact-set member is malformed',
      { position },
    );
  }
  let binding;
  try {
    binding = parseDeepResearchSealedArtifactBinding(input.binding);
  } catch {
    return fail(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'Artifact-set binding is invalid',
      { position },
    );
  }
  const registration = registrationFor(binding.artifactKind);
  if (input.lifecycle !== registration.lifecycle) {
    return fail(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'Artifact-set lifecycle does not match its registered kind',
      { position },
    );
  }
  return Object.freeze({
    position: requireSafeInteger('position', input.position, 0),
    lifecycle: registration.lifecycle,
    iteration: requireSafeInteger('iteration', input.iteration, 0),
    logicalSequence: requireSafeInteger('logicalSequence', input.logicalSequence, 1),
    binding,
  });
}

/** Parse and re-derive a complete artifact set before any replay use. */
export function parseDeepResearchArtifactSet(input: unknown): DeepResearchArtifactSet {
  if (!isRecord(input) || !hasExactFields(input, SET_FIELDS)) {
    return fail(SealedArtifactErrorCodes.EVIDENCE_CONFLICT, 'Artifact set is malformed');
  }
  if (input.artifactSetVersion !== DEEP_RESEARCH_ARTIFACT_SET_VERSION) {
    return fail(SealedArtifactErrorCodes.EVIDENCE_CONFLICT, 'Artifact-set version is unsupported');
  }
  if (!Array.isArray(input.orderedMembers)) {
    return fail(SealedArtifactErrorCodes.EVIDENCE_CONFLICT, 'Artifact-set members are missing');
  }
  const context = parseContext(input.context);
  const orderedMembers = Object.freeze(
    input.orderedMembers.map((member, position) => parseMember(member, position)),
  );
  validateCompleteOrder(orderedMembers);
  if (!isRecord(input.referenceSet)) {
    return fail(SealedArtifactErrorCodes.EVIDENCE_CONFLICT, 'Shared reference set is malformed');
  }
  const referenceSet = validateReferenceAlignment(
    orderedMembers,
    input.referenceSet as unknown as ArtifactReferenceSet,
  );
  const core = canonicalCore(context, orderedMembers, referenceSet);
  return core;
}

// ───────────────────────────────────────────────────────────────────
// 3. BINDING AND CONSUMPTION
// ───────────────────────────────────────────────────────────────────

/** Bind the complete canonical mode lifecycle to shared verified creation evidence. */
export function bindDeepResearchArtifactSet(
  contextInput: DeepResearchArtifactSetContext,
  membersInput: readonly DeepResearchArtifactSetMemberInput[],
): DeepResearchArtifactSet {
  const context = parseContext(contextInput);
  if (!Array.isArray(membersInput)) {
    return fail(SealedArtifactErrorCodes.EVIDENCE_MISSING, 'Artifact-set members are missing');
  }
  const members = membersInput.map((member, position): DeepResearchArtifactSetMember => {
    const candidate: unknown = member;
    if (!isRecord(candidate)) {
      return fail(
        SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
        'Artifact-set member input is malformed',
        { position },
      );
    }
    let binding;
    try {
      binding = parseDeepResearchSealedArtifactBinding(candidate.binding);
    } catch {
      return fail(
        SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
        'Artifact-set binding is invalid',
        { position },
      );
    }
    const evidence = candidate.evidence;
    if (
      !isRecord(evidence)
      || !isRecord(evidence.artifact)
      || canonicalJson(evidence.artifact.reference) !== canonicalJson(binding.reference)
    ) {
      return fail(
        SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
        'Artifact binding does not match its verified creation evidence',
        { position },
      );
    }
    const registration = registrationFor(binding.artifactKind);
    return Object.freeze({
      position,
      lifecycle: registration.lifecycle,
      iteration: requireSafeInteger('iteration', candidate.iteration, 0),
      logicalSequence: requireSafeInteger(
        'logicalSequence',
        candidate.logicalSequence,
        1,
      ),
      binding,
    });
  });
  const orderedMembers = Object.freeze(members);
  validateCompleteOrder(orderedMembers);
  const referenceSet = validateReferenceAlignment(
    orderedMembers,
    bindVerifiedArtifactReferences(membersInput.map((member) => member.evidence)),
  );
  return canonicalCore(context, orderedMembers, referenceSet);
}

/** Return canonical bytes while retaining the shared reference-set digest as sole identity. */
export function canonicalDeepResearchArtifactSetBytes(input: unknown): Uint8Array {
  return Uint8Array.from(canonicalBytes(parseDeepResearchArtifactSet(input)));
}

/** Re-resolve every artifact and ledger claim before producing shared replay input. */
export async function deepResearchArtifactSetReplayInput(
  ledger: AppendOnlyLedger,
  store: SealedArtifactStore,
  input: unknown,
  expectedContextInput: DeepResearchArtifactSetContext,
): Promise<ArtifactReplayInput> {
  const artifactSet = parseDeepResearchArtifactSet(input);
  const expectedContext = parseContext(expectedContextInput);
  if (canonicalJson(artifactSet.context) !== canonicalJson(expectedContext)) {
    return fail(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'Artifact set is stale for the requested run context',
    );
  }
  return artifactReferenceSetReplayInput(ledger, store, artifactSet.referenceSet);
}

/** Gate mode parity on exact context, lifecycle order, and shared evidence identity. */
export function compareDeepResearchArtifactSets(
  legacyInput: unknown,
  darkInput: unknown,
): ArtifactInputEquivalenceResult {
  const legacy = parseDeepResearchArtifactSet(legacyInput);
  const dark = parseDeepResearchArtifactSet(darkInput);
  if (canonicalJson(legacy) === canonicalJson(dark)) {
    return Object.freeze({
      ok: true,
      referenceSetDigest: legacy.referenceSet.reference_set_digest,
    });
  }
  return Object.freeze({
    ok: false,
    code: SealedArtifactErrorCodes.INPUT_EQUIVALENCE_FAILURE,
    legacyReferenceSetDigest: legacy.referenceSet.reference_set_digest,
    darkReferenceSetDigest: dark.referenceSet.reference_set_digest,
    message: 'Parity requires the same verified Deep Research artifact set and order',
  });
}
