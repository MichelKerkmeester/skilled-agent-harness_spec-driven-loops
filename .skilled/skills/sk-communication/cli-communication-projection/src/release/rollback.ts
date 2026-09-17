// ───────────────────────────────────────────────────────────────────
// MODULE: Release Rollback Coordination
// ───────────────────────────────────────────────────────────────────

import { deepFreeze } from '../fidelity/freeze.js';

/** Conditions that can trigger the deterministic rollback plan. */
export type RollbackTrigger =
  | 'operator-request'
  | 'provider-failure'
  | 'release-gate-blocked'
  | 'runtime-failure';

/** Input that identifies the recoverable package and immutable state check. */
export interface PlanRollbackInput {
  readonly previousPackageVersion: string;
  readonly canonicalTranscriptDigest: string;
  readonly trigger: RollbackTrigger;
}

/** Provider-free safe mode available before package restoration completes. */
export interface OriginalOnlyEmergencyModeConfig {
  readonly mode: 'original-only';
  readonly projectionEnabled: false;
  readonly providerRequired: false;
  readonly networkRequired: false;
}

/** Step that stops all new display projections. */
export interface DisableProjectionRollbackStep {
  readonly order: 1;
  readonly action: 'disable-projection';
  readonly projectionEnabled: false;
}

/** Step that selects the provider-free exact-original path. */
export interface SelectOriginalOnlyRollbackStep {
  readonly order: 2;
  readonly action: 'select-original-only';
  readonly providerRequired: false;
  readonly networkRequired: false;
}

/** Step that restores the caller-selected previous package version. */
export interface RestorePreviousPackageRollbackStep {
  readonly order: 3;
  readonly action: 'restore-previous-package';
  readonly packageVersion: string;
}

/** Read-only integrity check proving canonical state stayed unchanged. */
export interface VerifyCanonicalTranscriptRollbackStep {
  readonly order: 4;
  readonly action: 'verify-canonical-transcript';
  readonly expectedDigest: string;
  readonly mutationAllowed: false;
}

/** Ordered rollback steps that preserve canonical transcript state. */
export type RollbackSteps = readonly [
  DisableProjectionRollbackStep,
  SelectOriginalOnlyRollbackStep,
  RestorePreviousPackageRollbackStep,
  VerifyCanonicalTranscriptRollbackStep,
];

/** Deterministic rollback plan that contains no transcript content. */
export interface RollbackPlan {
  readonly planVersion: 'release-rollback/1.0.0';
  readonly trigger: RollbackTrigger;
  readonly emergencyMode: OriginalOnlyEmergencyModeConfig;
  readonly mutatesCanonicalTranscript: false;
  readonly steps: RollbackSteps;
}

/** Built-in emergency mode that requires neither a provider nor a network. */
export const OriginalOnlyEmergencyMode: OriginalOnlyEmergencyModeConfig = deepFreeze({
  mode: 'original-only',
  projectionEnabled: false,
  providerRequired: false,
  networkRequired: false,
});

const SHA256_PATTERN = /^sha256:[a-f0-9]{64}$/u;
const PACKAGE_VERSION_PATTERN = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/u;
const ROLLBACK_TRIGGERS = new Set<RollbackTrigger>([
  'operator-request',
  'provider-failure',
  'release-gate-blocked',
  'runtime-failure',
]);

/** Plan a safe-mode switch, package restoration, and immutable-state check. */
export function planRollback(input: PlanRollbackInput): RollbackPlan {
  if (!PACKAGE_VERSION_PATTERN.test(input.previousPackageVersion)) {
    throw new TypeError('Previous package version must be a valid semantic version.');
  }
  if (!SHA256_PATTERN.test(input.canonicalTranscriptDigest)) {
    throw new TypeError('Canonical transcript digest must be a SHA-256 digest.');
  }
  if (!ROLLBACK_TRIGGERS.has(input.trigger)) {
    throw new TypeError('Rollback trigger must identify a supported failure boundary.');
  }

  const steps: RollbackSteps = [
    {
      order: 1,
      action: 'disable-projection',
      projectionEnabled: false,
    },
    {
      order: 2,
      action: 'select-original-only',
      providerRequired: false,
      networkRequired: false,
    },
    {
      order: 3,
      action: 'restore-previous-package',
      packageVersion: input.previousPackageVersion,
    },
    {
      order: 4,
      action: 'verify-canonical-transcript',
      expectedDigest: input.canonicalTranscriptDigest,
      mutationAllowed: false,
    },
  ];
  return deepFreeze({
    planVersion: 'release-rollback/1.0.0',
    trigger: input.trigger,
    emergencyMode: OriginalOnlyEmergencyMode,
    mutatesCanonicalTranscript: false,
    steps,
  });
}
