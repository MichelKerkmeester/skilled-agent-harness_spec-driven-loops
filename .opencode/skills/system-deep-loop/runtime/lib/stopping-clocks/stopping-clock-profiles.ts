// ───────────────────────────────────────────────────────────────────
// MODULE: Stopping Clock Profiles
// ───────────────────────────────────────────────────────────────────

import { CYCLE_DETECTOR_POLICY_VERSION } from '../cycle-detection/index.js';
import { canonicalJson } from '../event-envelope/index.js';
import { StoppingClockKinds } from './stopping-clock-types.js';

import type {
  StoppingClockAdapterBinding,
  StoppingClockMode,
  StoppingClockProfile,
} from './stopping-clock-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. VERSIONED CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const STOPPING_CLOCK_SCHEMA_VERSION = 1;
export const STOPPING_CLOCK_TIE_RANK_VERSION = 'stopping-clock-tie-rank@1';
export const STOPPING_CLOCK_TIE_RANK = Object.freeze([
  'budget',
  'wall_time',
  'cycle',
  'novelty_decay',
  'coverage',
] as const);

export const STOPPING_CLOCK_ADAPTER_VERSIONS = Object.freeze({
  budget: 'budget-clock-adapter@1',
  novelty_decay: 'novelty-decay-clock-adapter@1',
  coverage: 'coverage-clock-adapter@1',
  wall_time: 'wall-time-clock-adapter@1',
  cycle: 'cycle-clock-adapter@1',
} as const);

const DEADLINES_MS: Readonly<Record<StoppingClockMode, number>> = Object.freeze({
  research: 3_600_000,
  review: 2_700_000,
  context: 1_800_000,
  alignment: 2_700_000,
  council: 3_600_000,
  improvement: 3_600_000,
  benchmark: 7_200_000,
});

const MODES = Object.freeze([
  'research',
  'review',
  'context',
  'alignment',
  'council',
  'improvement',
  'benchmark',
] as const);

// ───────────────────────────────────────────────────────────────────
// 2. PROFILE CONSTRUCTION
// ───────────────────────────────────────────────────────────────────

function adapters(): StoppingClockAdapterBinding[] {
  return [
    {
      clock_kind: 'budget',
      adapter_version: STOPPING_CLOCK_ADAPTER_VERSIONS.budget,
      evaluation_boundaries: ['pre_dispatch', 'post_receipt'],
      authority: 'shadow',
    },
    {
      clock_kind: 'novelty_decay',
      adapter_version: STOPPING_CLOCK_ADAPTER_VERSIONS.novelty_decay,
      evaluation_boundaries: ['committed_iteration'],
      authority: 'shadow',
    },
    {
      clock_kind: 'coverage',
      adapter_version: STOPPING_CLOCK_ADAPTER_VERSIONS.coverage,
      evaluation_boundaries: ['committed_iteration'],
      authority: 'shadow',
    },
    {
      clock_kind: 'wall_time',
      adapter_version: STOPPING_CLOCK_ADAPTER_VERSIONS.wall_time,
      evaluation_boundaries: ['pre_dispatch', 'post_receipt'],
      authority: 'shadow',
    },
    {
      clock_kind: 'cycle',
      adapter_version: STOPPING_CLOCK_ADAPTER_VERSIONS.cycle,
      evaluation_boundaries: ['committed_iteration'],
      authority: 'shadow',
    },
  ].map((binding) => Object.freeze({
    ...binding,
    evaluation_boundaries: Object.freeze([...binding.evaluation_boundaries]),
  })) as StoppingClockAdapterBinding[];
}

function profile(mode: StoppingClockMode): StoppingClockProfile {
  const candidate: StoppingClockProfile = {
    mode,
    profile_version: `${mode}-stopping-clocks@1`,
    authority: 'shadow',
    required_clocks: [...StoppingClockKinds],
    adapters: adapters(),
    budget_policy_version: 'hierarchical-budget-policy@1',
    novelty_decay: {
      policy_version: `${mode}-novelty-decay@1`,
      warm_up_observations: 3,
      observation_window: 6,
      patience: 3,
      decay_factor_bps: 5_000,
      concept_floor_bps: 2_000,
      independent_evidence_floor_bps: 2_000,
    },
    coverage_profile_version: `${mode}-coverage@1`,
    cycle: {
      detector_policy_version: CYCLE_DETECTOR_POLICY_VERSION,
      minimum_severity_bps: 10_000,
      minimum_occurrences: 3,
      maximum_source_lag_events: 2,
    },
    monotonic_clock_version: 'monotonic-clock@1',
    hard_deadline_ms: DEADLINES_MS[mode],
    tie_rank_version: STOPPING_CLOCK_TIE_RANK_VERSION,
    unknown_input_behavior: 'fail_closed',
  };
  Object.freeze(candidate.required_clocks);
  Object.freeze(candidate.adapters);
  Object.freeze(candidate.novelty_decay);
  Object.freeze(candidate.cycle);
  return Object.freeze(candidate);
}

export const STOPPING_CLOCK_PROFILES: readonly StoppingClockProfile[] = Object.freeze(
  MODES.map(profile),
);

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION AND RESOLUTION
// ───────────────────────────────────────────────────────────────────

/** Raised when a profile is missing, altered, or incomplete. */
export class StoppingClockProfileError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'StoppingClockProfileError';
  }
}

function registryKey(mode: string, version: string): string {
  return `${mode}\u0000${version}`;
}

/** Reject altered profile bytes or incomplete adapter inventories. */
export function validateStoppingClockProfile(
  candidate: StoppingClockProfile,
): StoppingClockProfile {
  const expected = STOPPING_CLOCK_PROFILES.find((entry) => (
    entry.mode === candidate.mode && entry.profile_version === candidate.profile_version
  ));
  if (!expected) {
    throw new StoppingClockProfileError(
      `Unknown stopping-clock profile: ${candidate.mode}@${candidate.profile_version}`,
    );
  }
  if (canonicalJson(candidate) !== canonicalJson(expected)) {
    throw new StoppingClockProfileError(
      `Altered stopping-clock profile: ${candidate.mode}@${candidate.profile_version}`,
    );
  }
  if (
    canonicalJson(candidate.required_clocks) !== canonicalJson(StoppingClockKinds)
    || new Set(candidate.adapters.map((entry) => entry.clock_kind)).size !== StoppingClockKinds.length
    || candidate.adapters.some((entry) => entry.authority !== candidate.authority)
    || candidate.tie_rank_version !== STOPPING_CLOCK_TIE_RANK_VERSION
    || candidate.unknown_input_behavior !== 'fail_closed'
  ) {
    throw new StoppingClockProfileError('Stopping-clock profile is incomplete or unsafe');
  }
  return expected;
}

/** Immutable resolver with no defaults for unknown versions. */
export class StoppingClockProfileRegistry {
  private readonly profiles: ReadonlyMap<string, StoppingClockProfile>;

  public constructor(profiles: readonly StoppingClockProfile[] = STOPPING_CLOCK_PROFILES) {
    const entries = profiles.map((entry) => {
      const validated = validateStoppingClockProfile(entry);
      return [registryKey(validated.mode, validated.profile_version), validated] as const;
    });
    if (new Set(entries.map(([key]) => key)).size !== entries.length) {
      throw new StoppingClockProfileError('Stopping-clock registry contains duplicates');
    }
    this.profiles = new Map(entries);
  }

  /** Resolve one exact mode and version without fallback. */
  public resolve(mode: string, version: string): StoppingClockProfile {
    const resolved = this.profiles.get(registryKey(mode, version));
    if (!resolved) {
      throw new StoppingClockProfileError(`Unknown stopping-clock profile: ${mode}@${version}`);
    }
    return resolved;
  }

  /** Return the frozen supported inventory in deterministic mode order. */
  public list(): readonly StoppingClockProfile[] {
    return Object.freeze([...this.profiles.values()].sort((left, right) => (
      left.mode < right.mode ? -1 : left.mode > right.mode ? 1 : 0
    )));
  }
}

export const stoppingClockProfiles = new StoppingClockProfileRegistry();
