// ───────────────────────────────────────────────────────────────────
// MODULE: Deterministic Wave Plan
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, canonicalJson, sha256Bytes } from '../event-envelope/index.js';
import {
  BranchOrchestrationError,
  BranchOrchestrationErrorCodes,
} from './errors.js';

import type {
  CompiledLogicalBranch,
  ImmutableWave,
  ImmutableWavePlan,
  WavePolicy,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const WAVE_PLAN_VERSION = 1;
export const WAVE_POLICY_VERSION = 1;

const WAVE_ID_PATTERN = /^wave-v1-[a-f0-9]{24}$/u;

// ───────────────────────────────────────────────────────────────────
// 2. COMPILATION
// ───────────────────────────────────────────────────────────────────

function normalizeWavePolicy(input: WavePolicy): WavePolicy {
  if (input.policyVersion !== WAVE_POLICY_VERSION) {
    throw new BranchOrchestrationError(
      BranchOrchestrationErrorCodes.WAVE_PLAN_DRIFT,
      'wave',
      'Wave policy version is not supported',
      { policyVersion: input.policyVersion },
    );
  }
  if (!Number.isSafeInteger(input.maxBranchesPerWave) || input.maxBranchesPerWave <= 0) {
    throw new BranchOrchestrationError(
      BranchOrchestrationErrorCodes.WAVE_PLAN_DRIFT,
      'wave',
      'Wave size must be a positive safe integer',
      { maxBranchesPerWave: input.maxBranchesPerWave },
    );
  }
  return Object.freeze({
    policyVersion: input.policyVersion,
    maxBranchesPerWave: input.maxBranchesPerWave,
  });
}

/** Compile immutable sequential waves from canonical branch order. */
export function compileImmutableWavePlan<TItem>(
  manifestFingerprint: string,
  branches: readonly Pick<CompiledLogicalBranch<TItem>, 'logicalBranchId'>[],
  policyInput: WavePolicy,
): ImmutableWavePlan {
  const policy = normalizeWavePolicy(policyInput);
  const branchIds = branches.map((branch) => branch.logicalBranchId).sort();
  if (branchIds.length === 0 || new Set(branchIds).size !== branchIds.length) {
    throw new BranchOrchestrationError(
      BranchOrchestrationErrorCodes.WAVE_PLAN_DRIFT,
      'wave',
      'Wave planner requires a non-empty unique canonical branch set',
    );
  }
  const planSeed = sha256Bytes(canonicalBytes({
    planVersion: WAVE_PLAN_VERSION,
    manifestFingerprint,
    policy,
    branchIds,
  }));

  const waves: ImmutableWave[] = [];
  for (let offset = 0; offset < branchIds.length; offset += policy.maxBranchesPerWave) {
    const ordinal = waves.length;
    const memberBranchIds = branchIds.slice(offset, offset + policy.maxBranchesPerWave);
    const prerequisiteWaveIds = ordinal === 0 ? [] : [waves[ordinal - 1].waveId];
    const waveId = `wave-v1-${sha256Bytes(canonicalBytes({
      planSeed,
      ordinal,
      memberBranchIds,
      prerequisiteWaveIds,
    })).slice(0, 24)}`;
    waves.push(Object.freeze({
      waveId,
      ordinal,
      memberBranchIds: Object.freeze(memberBranchIds) as unknown as string[],
      prerequisiteWaveIds: Object.freeze(prerequisiteWaveIds) as unknown as string[],
    }));
  }

  const planFingerprint = sha256Bytes(canonicalBytes({
    planVersion: WAVE_PLAN_VERSION,
    manifestFingerprint,
    policy,
    waves,
  }));
  return Object.freeze({
    planVersion: WAVE_PLAN_VERSION,
    policy,
    manifestFingerprint,
    planFingerprint,
    waves: Object.freeze(waves) as unknown as ImmutableWave[],
  });
}

/** Validate persisted wave fields before replay gives them scheduling authority. */
export function validateImmutableWavePlan(input: ImmutableWavePlan): ImmutableWavePlan {
  const rebuiltBranches = input.waves
    .flatMap((wave) => wave.memberBranchIds)
    .map((logicalBranchId) => ({ logicalBranchId }));
  const rebuilt = compileImmutableWavePlan(
    input.manifestFingerprint,
    rebuiltBranches,
    input.policy,
  );
  if (
    input.planVersion !== WAVE_PLAN_VERSION
    || input.planFingerprint !== rebuilt.planFingerprint
    || input.waves.length !== rebuilt.waves.length
    || input.waves.some((wave, index) => (
      !WAVE_ID_PATTERN.test(wave.waveId)
      || canonicalJson(wave) !== canonicalJson(rebuilt.waves[index])
    ))
  ) {
    throw new BranchOrchestrationError(
      BranchOrchestrationErrorCodes.WAVE_PLAN_DRIFT,
      'wave',
      'Persisted wave plan does not match its deterministic derivation',
      { planFingerprint: input.planFingerprint },
    );
  }
  return input;
}
