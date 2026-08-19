// ───────────────────────────────────────────────────────────────────
// MODULE: Fleet Enablement Driver
// ───────────────────────────────────────────────────────────────────
//
// The driver stops at the first failed mode because each per-mode transition
// moves authority as a unit; once a mode has flipped, it must never be
// re-run. Halting on the first failure therefore guarantees a later retry
// resumes from a known-safe boundary instead of replaying a mode whose
// authority already changed, which would re-introduce a just-moved state.
//
// State is external (a JSON file on disk) so a crash mid-run can be recovered
// by reading what actually completed. Treating progress as durable facts rather
// than in-memory bookkeeping is what lets the driver both persist after every
// success and refuse to resume a corrupt state file rather than silently
// re-running modes that already moved authority.
//
// The per-mode step is injected rather than hardcoded because the transition
// is a property of each mode's own surface contract, not of the run harness.
// Injecting keeps this file mode-agnostic and testable with a controlled
// transitions, while `dryRun` lets callers validate the plan without any side
// effects — a dry run that mutated anything would be worthless as a safety
// check.
// ───────────────────────────────────────────────────────────────────

import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { dirname } from 'node:path';
import { FLEET_MODE_ORDER } from './mode-surface-map.js';
import type { CutoverCertificateMode } from '../per-mode-authority-flip/index.js';

export type EnablementCheck = 'protocol' | 'parity' | 'flip' | 'reader-contract';

export interface ModeStepOutcome {
  readonly mode: CutoverCertificateMode;
  readonly ok: boolean;
  readonly failedCheck: EnablementCheck | null;
  readonly reason: string | null;
}

export interface EnablementFailure {
  readonly mode: CutoverCertificateMode;
  readonly check: EnablementCheck;
  readonly reason: string;
}

export interface EnablementRunState {
  readonly version: 1;
  readonly completedModes: readonly CutoverCertificateMode[];
  readonly failure: EnablementFailure | null;
  readonly updatedAt: string;
}

export interface RunFleetEnablementOptions {
  readonly statePath: string;
  readonly dryRun: boolean;
  readonly runStep: (mode: CutoverCertificateMode) => Promise<ModeStepOutcome>;
  readonly now?: () => Date;
}

export interface FleetEnablementResult {
  readonly dryRun: boolean;
  readonly plannedModes: readonly CutoverCertificateMode[];
  readonly skippedModes: readonly CutoverCertificateMode[];
  readonly completedModes: readonly CutoverCertificateMode[];
  readonly failure: EnablementFailure | null;
  readonly untouchedModes: readonly CutoverCertificateMode[];
}

function persistState(statePath: string, state: EnablementRunState): void {
    const raw = JSON.stringify(state, null, 2);
    const tempPath = `${statePath}.tmp`;
    mkdirSync(dirname(statePath), { recursive: true });
    // A half-written state file cannot be told apart from a corrupt one, and
    // this record is the only thing that says which modes already moved, so it
    // is replaced atomically rather than overwritten in place. A reader ever
    // only sees a whole file.
    writeFileSync(tempPath, raw);
    renameSync(tempPath, statePath);
  }

export function readEnablementState(statePath: string): EnablementRunState | null {
  if (!existsSync(statePath)) {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(statePath, 'utf8'));
  } catch {
    throw new TypeError(`Enablement state file is not valid JSON: ${statePath}`);
  }
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('version' in parsed) ||
    (parsed as { version: unknown }).version !== 1
  ) {
    throw new TypeError(
      `Enablement state file is missing or has an unexpected version; expected 1: ${statePath}`,
    );
  }

  // A mis-shaped state file must not read as an empty one: silently treating
  // it as "nothing completed" would re-run modes whose authority already moved.
  const record = parsed as {
    completedModes: unknown;
    failure: unknown;
  };
  if (
    !Array.isArray(record.completedModes) ||
    record.completedModes.some((mode) => typeof mode !== 'string')
  ) {
    throw new TypeError(
      `Enablement state file has a malformed completedModes field; expected an array of mode strings: ${statePath}`,
    );
  }
  if (
    record.failure !== null &&
    record.failure !== undefined &&
    (typeof record.failure !== 'object' || Array.isArray(record.failure))
  ) {
    throw new TypeError(
      `Enablement state file has a malformed failure field; expected null or an object: ${statePath}`,
    );
  }
  return parsed as EnablementRunState;
}

export async function runFleetEnablement(
  options: RunFleetEnablementOptions,
): Promise<FleetEnablementResult> {
  const { statePath, dryRun, runStep, now = () => new Date() } = options;

  const prior = readEnablementState(statePath);
  const skippedModes: CutoverCertificateMode[] = prior
    ? [...prior.completedModes]
    : [];
  const skipped = new Set<CutoverCertificateMode>(skippedModes);
  const plannedModes = FLEET_MODE_ORDER.filter((mode) => !skipped.has(mode));

  const save = (
    completed: readonly CutoverCertificateMode[],
    failure: EnablementFailure | null,
  ): void => {
    // The state file is the record of which modes have already moved authority,
    // so it has to accumulate across runs: a resumed run that persisted only its
    // own progress would drop the earlier run's completions and let a later run
    // re-move a mode. Persist the union of prior and current completions.
    const persistedModes = FLEET_MODE_ORDER.filter(
      (mode) => skipped.has(mode) || completed.includes(mode),
    );
    const state: EnablementRunState = {
      version: 1,
      completedModes: persistedModes,
      failure,
      updatedAt: now().toISOString(),
    };
    persistState(statePath, state);
  };

  if (dryRun) {
    return {
      dryRun: true,
      plannedModes,
      skippedModes,
      completedModes: [],
      failure: null,
      untouchedModes: plannedModes,
    };
  }

  const completedModes: CutoverCertificateMode[] = [];
  const untouchedModes: CutoverCertificateMode[] = [];

  for (const mode of plannedModes) {
    const outcome = await runStep(mode);
    if (outcome.ok) {
      completedModes.push(mode);
      save(completedModes, null);
      continue;
    }

    const failedCheck: EnablementCheck = outcome.failedCheck ?? 'flip';
    const reason: string =
      outcome.reason ?? `Enablement step for mode failed at check: ${failedCheck}`;
    const failure: EnablementFailure = { mode, check: failedCheck, reason };
    save(completedModes, failure);
    for (const remaining of plannedModes.slice(plannedModes.indexOf(mode) + 1)) {
      untouchedModes.push(remaining);
    }
    return { dryRun, plannedModes, skippedModes, completedModes, failure, untouchedModes };
  }

  return {
    dryRun,
    plannedModes,
    skippedModes,
    completedModes,
    failure: null,
    untouchedModes,
  };
}