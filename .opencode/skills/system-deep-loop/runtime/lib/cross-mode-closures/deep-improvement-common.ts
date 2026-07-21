// ───────────────────────────────────────────────────────────────────
// MODULE: Shared Deep-Improvement Pipeline
// ───────────────────────────────────────────────────────────────────

import {
  CrossModeClosureError,
  CrossModeClosureErrorCodes,
} from './errors.js';
import {
  applyDeterministicOverride,
  assertExactKeys,
  cloneFrozenJson,
} from './internal.js';

import type { JsonObject } from '../event-envelope/index.js';
import type { ModeDataPolicyOverride } from './types.js';

export const DEEP_IMPROVEMENT_VARIANT_IDS = Object.freeze([
  '005-agent-improvement',
  '006-model-benchmark',
  '007-skill-benchmark',
] as const);

/** Shipped shared mechanics invoked behind the common pipeline ports. */
export const DeepImprovementCommonLegacySources = Object.freeze([
  'deep-improvement/typed-errors',
  'deep-improvement/promotion-gates',
  'deep-improvement/mirror-sync-verify',
  'deep-improvement/profile-resolve',
] as const);

/** Thin variant identity permitted after the common mechanics pass. */
export type DeepImprovementVariantId = typeof DEEP_IMPROVEMENT_VARIANT_IDS[number];

/** Existing evaluator, benchmark, promotion, and mirror verification seams. */
export interface DeepImprovementCommonPorts {
  evaluate(input: Readonly<JsonObject>): Promise<Readonly<JsonObject>>;
  benchmark(input: Readonly<JsonObject>): Promise<Readonly<JsonObject>>;
  promote(input: Readonly<JsonObject>): Promise<Readonly<JsonObject>>;
  verifyMirrors(input: Readonly<JsonObject>): Promise<Readonly<JsonObject>>;
}

/** Schema or policy supplied by one thin deep-improvement variant. */
export interface DeepImprovementVariantInput {
  readonly policyInput: Readonly<JsonObject>;
  readonly outputKeys: readonly string[];
  readonly override: ModeDataPolicyOverride<JsonObject, JsonObject>;
}

/** Common input plus the exact three manifest variants. */
export interface DeepImprovementCommonInput {
  readonly commonInput: Readonly<JsonObject>;
  readonly variants: Readonly<Record<DeepImprovementVariantId, DeepImprovementVariantInput>>;
}

/** One shared mechanics result followed by three data-only variant results. */
export interface DeepImprovementCommonOutcome {
  readonly executionOrder: readonly string[];
  readonly common: Readonly<JsonObject>;
  readonly variants: Readonly<Record<DeepImprovementVariantId, Readonly<JsonObject>>>;
}

/** Run shared mechanics once, then let each variant provide only schema or policy. */
export async function runDeepImprovementCommon(
  ports: DeepImprovementCommonPorts,
  input: Readonly<DeepImprovementCommonInput>,
): Promise<Readonly<DeepImprovementCommonOutcome>> {
  const actualVariants = Object.keys(input.variants).sort();
  const expectedVariants = [...DEEP_IMPROVEMENT_VARIANT_IDS].sort();
  if (JSON.stringify(actualVariants) !== JSON.stringify(expectedVariants)) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.COMMON_PIPELINE_INVALID,
      'Deep-improvement variants must be manifest-complete and thin',
      { actualVariants, expectedVariants },
    );
  }

  const evaluation = await ports.evaluate(input.commonInput);
  const benchmark = await ports.benchmark(evaluation);
  const promotion = await ports.promote(benchmark);
  const mirrorVerification = await ports.verifyMirrors(promotion);
  const common = cloneFrozenJson({
    evaluation,
    benchmark,
    promotion,
    mirror_verification: mirrorVerification,
  } as unknown as JsonObject);

  const variants = {} as Record<DeepImprovementVariantId, Readonly<JsonObject>>;
  for (const variantId of DEEP_IMPROVEMENT_VARIANT_IDS) {
    const variant = input.variants[variantId];
    const output = await applyDeterministicOverride(variant.override, {
      common,
      variant_policy: variant.policyInput,
    });
    assertExactKeys(output, variant.outputKeys);
    variants[variantId] = output;
  }
  return Object.freeze({
    executionOrder: Object.freeze([
      '004-deep-improvement-common',
      ...DEEP_IMPROVEMENT_VARIANT_IDS,
    ]),
    common,
    variants: Object.freeze(variants),
  });
}
