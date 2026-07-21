// ───────────────────────────────────────────────────────────────────
// MODULE: Next Focus Candidates
// ──────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { validatePivotCandidate } from '../deep-loop/pivot-candidates.js';
import { NextFocusError, NextFocusErrorCodes } from './next-focus-errors.js';

import type { PivotCandidateRejection } from '../deep-loop/pivot-candidates.js';
import type {
  NextFocusCandidate,
  NextFocusCandidateValidation,
  NextFocusDerivationSnapshot,
  NextFocusRegionInput,
  NextFocusSignal,
  NextFocusSignalName,
  NextFocusSignals,
  NextFocusSourceSnapshot,
  RequiredNextFocusSignal,
} from './next-focus-types.js';

const MIN_BPS = 0;
const MAX_BPS = 10_000;

function compareCodeUnits(left: string, right: string): number {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function nonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

function sortedUniqueStrings(value: unknown, field: string): readonly string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new NextFocusError(
      NextFocusErrorCodes.INVALID_INPUT,
      `${field} must contain at least one non-empty string.`,
      { field },
    );
  }
  const normalized = value.map(nonEmptyString);
  if (!normalized.every((entry): entry is string => entry !== null)) {
    throw new NextFocusError(
      NextFocusErrorCodes.INVALID_INPUT,
      `${field} must contain only non-empty strings.`,
      { field },
    );
  }
  const unique = new Set(normalized);
  if (unique.size !== normalized.length) {
    throw new NextFocusError(
      NextFocusErrorCodes.INVALID_INPUT,
      `${field} must not contain duplicate identifiers.`,
      { field },
    );
  }
  return Object.freeze([...unique].sort(compareCodeUnits));
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((entry, index) => entry === right[index]);
}

function requireBps(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < MIN_BPS || (value as number) > MAX_BPS) {
    throw new NextFocusError(
      NextFocusErrorCodes.INVALID_SIGNAL,
      `${field}.bps must be an integer from ${MIN_BPS} through ${MAX_BPS}.`,
      { field },
    );
  }
  return value as number;
}

function requireRequiredSignal(
  input: unknown,
  field: string,
  snapshotEvidenceIds: readonly string[],
): RequiredNextFocusSignal {
  if (!isRecord(input) || input.applicability !== 'required') {
    throw new NextFocusError(
      NextFocusErrorCodes.INVALID_SIGNAL,
      `${field} is required for this region kind and cannot default to zero.`,
      { field },
    );
  }
  const evidenceIds = sortedUniqueStrings(input.evidenceIds, `${field}.evidenceIds`);
  const snapshotEvidenceSet = new Set(snapshotEvidenceIds);
  if (!evidenceIds.every((evidenceId) => snapshotEvidenceSet.has(evidenceId))) {
    throw new NextFocusError(
      NextFocusErrorCodes.INVALID_SIGNAL,
      `${field} cites evidence outside the immutable source snapshot.`,
      { field },
    );
  }
  return Object.freeze({
    applicability: 'required',
    bps: requireBps(input.bps, field),
    evidenceIds,
  });
}

function nonApplicableSignal(rationale: string): NextFocusSignal {
  return Object.freeze({
    applicability: 'not_applicable',
    bps: 0,
    evidenceIds: Object.freeze([]) as readonly [],
    rationale,
  });
}

function sourceFingerprint(
  projectionWatermark: string,
  projectionVersion: string,
  evidenceIds: readonly string[],
): string {
  return sha256Bytes(canonicalBytes({
    projectionWatermark,
    projectionVersion,
    evidenceIds,
  }));
}

function candidateFingerprint(
  region: NextFocusRegionInput,
  snapshot: NextFocusSourceSnapshot,
): string {
  return sha256Bytes(canonicalBytes({
    regionKind: region.kind,
    title: region.title.normalize('NFKC').trim().toLowerCase(),
    focus: region.focus.normalize('NFKC').trim().toLowerCase(),
    sourceFingerprint: snapshot.sourceFingerprint,
  }));
}

function signalsFor(
  region: NextFocusRegionInput,
  evidenceIds: readonly string[],
): NextFocusSignals {
  const noveltyDecay = requireRequiredSignal(
    region.noveltyDecay,
    'noveltyDecay',
    evidenceIds,
  );
  if (region.kind === 'open_contradiction') {
    return Object.freeze({
      coverageGap: nonApplicableSignal('Coverage is not a contradiction-region signal.'),
      contradictionUrgency: requireRequiredSignal(
        region.contradictionUrgency,
        'contradictionUrgency',
        evidenceIds,
      ),
      noveltyDecay,
    });
  }
  return Object.freeze({
    coverageGap: requireRequiredSignal(region.coverageGap, 'coverageGap', evidenceIds),
    contradictionUrgency: nonApplicableSignal(
      'Contradiction urgency is not a coverage-region signal.',
    ),
    noveltyDecay,
  });
}

function regionIdFor(region: NextFocusRegionInput): string {
  if (region.kind === 'coverage_gap') return region.gap.nodeId;
  if (region.kind === 'open_contradiction') return region.relationshipId;
  return region.communityId;
}

function invalidField(field: string, message: string): PivotCandidateRejection {
  return { code: 'invalid_candidate', field, message };
}

function validateSignal(
  input: unknown,
  field: NextFocusSignalName,
  required: boolean,
  snapshotEvidenceIds: readonly string[],
): NextFocusSignal {
  if (!isRecord(input)) {
    throw new NextFocusError(
      NextFocusErrorCodes.INVALID_SIGNAL,
      `${field} must declare required or not_applicable.`,
      { field },
    );
  }
  if (required) return requireRequiredSignal(input, field, snapshotEvidenceIds);
  const rationale = nonEmptyString(input.rationale);
  if (
    input.applicability !== 'not_applicable'
    || input.bps !== 0
    || !Array.isArray(input.evidenceIds)
    || input.evidenceIds.length !== 0
    || rationale === null
  ) {
    throw new NextFocusError(
      NextFocusErrorCodes.INVALID_SIGNAL,
      `${field} may be zero only with an explicit not_applicable declaration.`,
      { field },
    );
  }
  return nonApplicableSignal(rationale);
}

/** Create the canonical immutable source snapshot shared by one decision. */
export function createNextFocusSourceSnapshot(
  input: Pick<NextFocusDerivationSnapshot, 'projectionWatermark' | 'projectionVersion' | 'evidenceIds'>,
): NextFocusSourceSnapshot {
  const projectionWatermark = nonEmptyString(input.projectionWatermark);
  const projectionVersion = nonEmptyString(input.projectionVersion);
  if (projectionWatermark === null || projectionVersion === null) {
    throw new NextFocusError(
      NextFocusErrorCodes.INVALID_INPUT,
      'Projection watermark and version must be non-empty strings.',
    );
  }
  const evidenceIds = sortedUniqueStrings(input.evidenceIds, 'evidenceIds');
  return Object.freeze({
    projectionWatermark,
    projectionVersion,
    evidenceIds,
    sourceFingerprint: sourceFingerprint(projectionWatermark, projectionVersion, evidenceIds),
  });
}

/** Derive all candidate kinds from one immutable projection snapshot. */
export function deriveNextFocusCandidates(
  input: NextFocusDerivationSnapshot,
): readonly NextFocusCandidate[] {
  const snapshot = createNextFocusSourceSnapshot(input);
  if (!Array.isArray(input.regions)) {
    throw new NextFocusError(
      NextFocusErrorCodes.INVALID_INPUT,
      'regions must be an array.',
      { field: 'regions' },
    );
  }
  return Object.freeze(input.regions.map((region, index) => {
    const rawRegion: unknown = region;
    if (!isRecord(rawRegion)) {
      throw new NextFocusError(
        NextFocusErrorCodes.INVALID_INPUT,
        `regions[${index}] must be an object.`,
        { field: `regions[${index}]` },
      );
    }
    const regionId = regionIdFor(region);
    if (nonEmptyString(regionId) === null) {
      throw new NextFocusError(
        NextFocusErrorCodes.INVALID_INPUT,
        `regions[${index}] must have a non-empty source region identifier.`,
        { field: `regions[${index}]` },
      );
    }
    const candidate: NextFocusCandidate = Object.freeze({
      id: region.candidateId,
      title: region.title,
      focus: region.focus,
      evidenceRefs: snapshot.evidenceIds,
      relevanceRationale: region.relevanceRationale,
      boundaryVerdict: Object.freeze({
        status: 'within_boundary',
        rationale: region.boundaryRationale,
      }),
      fingerprint: candidateFingerprint(region, snapshot),
      seatProvenance: Object.freeze([...region.seatProvenance]),
      regionKind: region.kind,
      regionId,
      projectionWatermark: snapshot.projectionWatermark,
      projectionVersion: snapshot.projectionVersion,
      snapshotEvidenceIds: snapshot.evidenceIds,
      sourceFingerprint: snapshot.sourceFingerprint,
      signals: signalsFor(region, snapshot.evidenceIds),
    });
    const validation = validateNextFocusCandidate(candidate);
    if (!validation.valid) {
      throw new NextFocusError(
        NextFocusErrorCodes.INVALID_INPUT,
        `Derived candidate "${region.candidateId}" is invalid: ${validation.rejections
          .map((rejection) => rejection.message)
          .join('; ')}`,
        { candidateId: region.candidateId },
      );
    }
    return validation.candidate;
  }));
}

/** Validate the next-focus extension only after the shipped generic safety gate passes. */
export function validateNextFocusCandidate(input: unknown): NextFocusCandidateValidation {
  const base = validatePivotCandidate(input);
  if (!base.valid) return base;
  if (!isRecord(input)) {
    return {
      valid: false,
      rejections: [invalidField('candidate', 'Candidate must be an object.')],
    };
  }

  const rejections: PivotCandidateRejection[] = [];
  const regionKind = input.regionKind;
  const regionId = nonEmptyString(input.regionId);
  const projectionWatermark = nonEmptyString(input.projectionWatermark);
  const projectionVersion = nonEmptyString(input.projectionVersion);
  const fingerprint = nonEmptyString(input.sourceFingerprint);
  if (
    regionKind !== 'coverage_gap'
    && regionKind !== 'open_contradiction'
    && regionKind !== 'under_covered_community'
  ) {
    rejections.push(invalidField('regionKind', 'Candidate regionKind is not supported.'));
  }
  if (regionId === null) rejections.push(invalidField('regionId', 'Candidate regionId is required.'));
  if (projectionWatermark === null) {
    rejections.push(invalidField('projectionWatermark', 'Projection watermark is required.'));
  }
  if (projectionVersion === null) {
    rejections.push(invalidField('projectionVersion', 'Projection version is required.'));
  }
  if (fingerprint === null) {
    rejections.push(invalidField('sourceFingerprint', 'Source fingerprint is required.'));
  }

  let evidenceIds: readonly string[] = [];
  try {
    evidenceIds = sortedUniqueStrings(input.snapshotEvidenceIds, 'snapshotEvidenceIds');
    const normalizedBaseEvidence = [...base.candidate.evidenceRefs].sort(compareCodeUnits);
    if (!sameStrings(evidenceIds, normalizedBaseEvidence)) {
      rejections.push(invalidField(
        'snapshotEvidenceIds',
        'Candidate evidenceRefs must exactly match the immutable snapshot evidence ids.',
      ));
    }
  } catch (error: unknown) {
    rejections.push(invalidField(
      'snapshotEvidenceIds',
      error instanceof Error ? error.message : 'Snapshot evidence ids are invalid.',
    ));
  }

  let signals: NextFocusSignals | null = null;
  try {
    if (!isRecord(input.signals)) {
      throw new NextFocusError(NextFocusErrorCodes.INVALID_SIGNAL, 'signals must be an object.');
    }
    const coverageRequired = regionKind === 'coverage_gap'
      || regionKind === 'under_covered_community';
    const contradictionRequired = regionKind === 'open_contradiction';
    signals = Object.freeze({
      coverageGap: validateSignal(
        input.signals.coverageGap,
        'coverageGap',
        coverageRequired,
        evidenceIds,
      ),
      contradictionUrgency: validateSignal(
        input.signals.contradictionUrgency,
        'contradictionUrgency',
        contradictionRequired,
        evidenceIds,
      ),
      noveltyDecay: validateSignal(
        input.signals.noveltyDecay,
        'noveltyDecay',
        true,
        evidenceIds,
      ),
    });
  } catch (error: unknown) {
    rejections.push(invalidField(
      'signals',
      error instanceof Error ? error.message : 'Candidate signals are invalid.',
    ));
  }

  if (rejections.length > 0 || signals === null) return { valid: false, rejections };
  return {
    valid: true,
    candidate: Object.freeze({
      ...base.candidate,
      evidenceRefs: Object.freeze([...base.candidate.evidenceRefs].sort(compareCodeUnits)),
      seatProvenance: Object.freeze([...base.candidate.seatProvenance]),
      boundaryVerdict: Object.freeze({ ...base.candidate.boundaryVerdict }),
      regionKind: regionKind as NextFocusCandidate['regionKind'],
      regionId: regionId as string,
      projectionWatermark: projectionWatermark as string,
      projectionVersion: projectionVersion as string,
      snapshotEvidenceIds: evidenceIds,
      sourceFingerprint: fingerprint as string,
      signals,
    }),
  };
}
