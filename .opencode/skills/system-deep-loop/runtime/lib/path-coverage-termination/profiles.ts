// ───────────────────────────────────────────────────────────────────
// MODULE: Mode Coverage Profiles
// ───────────────────────────────────────────────────────────────────

import { canonicalJson } from '../event-envelope/index.js';

import type {
  MajorRegionDefinition,
  ModeCoverageProfile,
  PathCoverageMode,
} from './types.js';

const CLOSEABLE_STATUSES = Object.freeze(['addressed', 'excluded'] as const);

function region(
  regionId: string,
  dimensionIds: readonly string[],
  requiredEvidenceClasses: readonly string[],
  weight: number,
): MajorRegionDefinition {
  return Object.freeze({
    regionId,
    dimensionIds: Object.freeze([...dimensionIds]),
    mandatory: true,
    major: true,
    weight,
    requiredEvidenceClasses: Object.freeze([...requiredEvidenceClasses]),
  });
}

function profile(
  mode: PathCoverageMode,
  dimensions: readonly Readonly<{
    dimensionId: string;
    source: 'declared' | 'semantic-community';
  }>[],
  regions: readonly MajorRegionDefinition[],
): ModeCoverageProfile {
  const mandatoryEvidenceClasses = [...new Set(
    regions.flatMap((entry) => entry.requiredEvidenceClasses),
  )].sort();
  return Object.freeze({
    mode,
    profileVersion: `${mode}-coverage@1`,
    pathDimensions: Object.freeze(dimensions.map((entry) => Object.freeze({
      ...entry,
      required: true as const,
    }))),
    majorRegionRule: Object.freeze({
      ruleId: `${mode}-major-regions@1`,
      kind: 'cartesian-products' as const,
      regions: Object.freeze([...regions]),
    }),
    mandatoryEvidenceClasses: Object.freeze(mandatoryEvidenceClasses),
    contradictionPolicy: Object.freeze({
      policyId: `${mode}-critical-contradictions`,
      policyVersion: '1',
      blockUnresolvedCritical: true as const,
    }),
    closeableStatuses: CLOSEABLE_STATUSES,
  });
}

export const MODE_COVERAGE_PROFILES: readonly ModeCoverageProfile[] = Object.freeze([
  profile('research', [
    { dimensionId: 'question-branch', source: 'declared' },
    { dimensionId: 'source-class', source: 'declared' },
    { dimensionId: 'falsification-obligation', source: 'declared' },
    { dimensionId: 'semantic-community', source: 'semantic-community' },
  ], [
    region('research-question-branch', ['question-branch'], ['ledger-event', 'projection-row'], 4),
    region('research-source-class', ['source-class'], ['ledger-event'], 2),
    region('research-falsification', ['falsification-obligation'], ['refutation'], 5),
    region('research-semantic-community', ['semantic-community'], ['semantic-membership'], 4),
  ]),
  profile('review', [
    { dimensionId: 'changed-surface', source: 'declared' },
    { dimensionId: 'applicable-dimension', source: 'declared' },
    { dimensionId: 'critical-finding', source: 'declared' },
  ], [
    region('review-surface-dimension', ['changed-surface', 'applicable-dimension'], ['projection-row'], 3),
    region('review-critical-finding', ['critical-finding'], ['refutation', 'ledger-event'], 5),
  ]),
  profile('context', [
    { dimensionId: 'context-slice', source: 'declared' },
    { dimensionId: 'reuse-candidate', source: 'declared' },
    { dimensionId: 'dependency', source: 'declared' },
  ], [
    region('context-slice', ['context-slice'], ['projection-row'], 3),
    region('context-reuse-candidate', ['reuse-candidate'], ['independent-evidence'], 2),
    region('context-dependency', ['dependency'], ['projection-row'], 4),
  ]),
  profile('alignment', [
    { dimensionId: 'changed-surface', source: 'declared' },
    { dimensionId: 'alignment-dimension', source: 'declared' },
    { dimensionId: 'critical-refutation', source: 'declared' },
  ], [
    region('alignment-surface-dimension', ['changed-surface', 'alignment-dimension'], ['projection-row'], 3),
    region('alignment-critical-refutation', ['critical-refutation'], ['refutation'], 5),
  ]),
  profile('council', [
    { dimensionId: 'agenda-branch', source: 'declared' },
    { dimensionId: 'independent-evidence-region', source: 'declared' },
    { dimensionId: 'dissent-region', source: 'declared' },
  ], [
    region('council-agenda-branch', ['agenda-branch'], ['ledger-event'], 3),
    region('council-independent-evidence', ['independent-evidence-region'], ['independent-evidence'], 4),
    region('council-dissent', ['dissent-region'], ['refutation'], 5),
  ]),
  profile('improvement', [
    { dimensionId: 'candidate', source: 'declared' },
    { dimensionId: 'evaluator', source: 'declared' },
    { dimensionId: 'canary', source: 'declared' },
    { dimensionId: 'unresolved-failure', source: 'declared' },
  ], [
    region('improvement-candidate-evaluator', ['candidate', 'evaluator'], ['evaluator-result'], 3),
    region('improvement-candidate-canary', ['candidate', 'canary'], ['canary-result'], 4),
    region('improvement-unresolved-failure', ['unresolved-failure'], ['refutation'], 5),
  ]),
  profile('benchmark', [
    { dimensionId: 'candidate', source: 'declared' },
    { dimensionId: 'evaluator', source: 'declared' },
    { dimensionId: 'scenario', source: 'declared' },
    { dimensionId: 'unresolved-failure', source: 'declared' },
  ], [
    region('benchmark-candidate-evaluator', ['candidate', 'evaluator'], ['evaluator-result'], 3),
    region('benchmark-scenario-candidate', ['scenario', 'candidate'], ['scenario-result'], 4),
    region('benchmark-unresolved-failure', ['unresolved-failure'], ['refutation'], 5),
  ]),
]);

/** Raised when a caller requests or supplies an unregistered denominator contract. */
export class ModeCoverageProfileError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'ModeCoverageProfileError';
  }
}

function registryKey(mode: string, profileVersion: string): string {
  return `${mode}\u0000${profileVersion}`;
}

/** Reject any profile that differs from a complete registered contract. */
export function validateModeCoverageProfile(candidate: ModeCoverageProfile): ModeCoverageProfile {
  const expected = MODE_COVERAGE_PROFILES.find((entry) => (
    entry.mode === candidate.mode && entry.profileVersion === candidate.profileVersion
  ));
  if (!expected) {
    throw new ModeCoverageProfileError(
      `Unknown mode coverage profile: ${candidate.mode}@${candidate.profileVersion}`,
    );
  }
  if (canonicalJson(candidate) !== canonicalJson(expected)) {
    throw new ModeCoverageProfileError(
      `Incomplete or altered mode coverage profile: ${candidate.mode}@${candidate.profileVersion}`,
    );
  }
  return expected;
}

/** Immutable resolver for versioned mode coverage contracts. */
export class ModeCoverageProfileRegistry {
  private readonly profiles: ReadonlyMap<string, ModeCoverageProfile>;

  public constructor(profiles: readonly ModeCoverageProfile[] = MODE_COVERAGE_PROFILES) {
    const entries = profiles.map((entry) => {
      const validated = validateModeCoverageProfile(entry);
      return [registryKey(validated.mode, validated.profileVersion), validated] as const;
    });
    if (new Set(entries.map(([key]) => key)).size !== entries.length) {
      throw new ModeCoverageProfileError('Mode coverage registry contains duplicate versions');
    }
    this.profiles = new Map(entries);
  }

  /** Resolve one exact mode and version without fallback or profile completion. */
  public resolve(mode: string, profileVersion: string): ModeCoverageProfile {
    const resolved = this.profiles.get(registryKey(mode, profileVersion));
    if (!resolved) {
      throw new ModeCoverageProfileError(
        `Unknown mode coverage profile: ${mode}@${profileVersion}`,
      );
    }
    return resolved;
  }

  /** Return the frozen supported inventory in deterministic order. */
  public list(): readonly ModeCoverageProfile[] {
    return Object.freeze([...this.profiles.values()].sort((left, right) => (
      left.mode < right.mode ? -1 : left.mode > right.mode ? 1 : 0
    )));
  }
}

export const modeCoverageProfiles = new ModeCoverageProfileRegistry();
