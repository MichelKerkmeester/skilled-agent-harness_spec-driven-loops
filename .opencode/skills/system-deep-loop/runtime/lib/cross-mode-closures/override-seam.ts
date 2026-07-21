// ───────────────────────────────────────────────────────────────────
// MODULE: Cross-Mode Closure Override Seam
// ───────────────────────────────────────────────────────────────────

import { assertExactKeys, requireIdentity } from './internal.js';

import type { ModeDataPolicyOverride } from './types.js';

const OVERRIDE_KEYS = Object.freeze([
  'policyOwner',
  'inputVersion',
  'outputVersion',
  'apply',
] as const);

/** Register data or policy selection without exposing a safety-port capability. */
export function defineModeDataPolicyOverride<TInput, TOutput>(
  input: ModeDataPolicyOverride<TInput, TOutput>,
): Readonly<ModeDataPolicyOverride<TInput, TOutput>> {
  assertExactKeys(input, OVERRIDE_KEYS);
  requireIdentity(input.policyOwner, 'override.policyOwner');
  requireIdentity(input.inputVersion, 'override.inputVersion');
  requireIdentity(input.outputVersion, 'override.outputVersion');
  if (typeof input.apply !== 'function') {
    throw new TypeError('override.apply must be a function');
  }
  return Object.freeze({ ...input });
}
