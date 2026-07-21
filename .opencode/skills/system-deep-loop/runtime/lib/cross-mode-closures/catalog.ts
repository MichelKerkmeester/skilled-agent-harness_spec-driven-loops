// ───────────────────────────────────────────────────────────────────
// MODULE: Cross-Mode Closure Ownership Catalog
// ───────────────────────────────────────────────────────────────────

import { invokeBlindedAdjudication } from './adjudication.js';
import { admitTypedBudget } from './budgets.js';
import { DeepImprovementCommonLegacySources } from './deep-improvement-common.js';
import {
  CrossModeClosureError,
  CrossModeClosureErrorCodes,
} from './errors.js';
import { normalizeEvidence } from './evidence.js';
import { LegacyParitySources } from './parity.js';
import { updateProjectionAndGauge } from './projections.js';
import { orderReceiptAndEffects } from './receipts-effects.js';
import {
  ClosureOwnerIds,
  ClosureResponsibilities,
  PHASE_013_MODE_IDS,
} from './types.js';

import type {
  ClosureResponsibility,
  Phase013ModeId,
} from './types.js';

export const CrossModeClosureImplementations = Object.freeze({
  [ClosureResponsibilities.EVIDENCE]: normalizeEvidence,
  [ClosureResponsibilities.RECEIPTS_EFFECTS]: orderReceiptAndEffects,
  [ClosureResponsibilities.ADJUDICATION]: invokeBlindedAdjudication,
  [ClosureResponsibilities.BUDGETS]: admitTypedBudget,
  [ClosureResponsibilities.PROJECTIONS]: updateProjectionAndGauge,
});

/** One manifest mode's consumption of the common implementation identities. */
export interface ModeClosureConsumption {
  readonly modeId: Phase013ModeId;
  readonly owners: Readonly<Record<ClosureResponsibility, string>>;
  readonly implementations: typeof CrossModeClosureImplementations;
  readonly paritySources: typeof LegacyParitySources;
  readonly deepImprovementCommonSources: readonly string[];
  readonly deepImprovementRole: 'common' | 'standalone' | 'thin-variant';
}

/** Bind every manifest workstream to the same five implementation identities. */
export function createCrossModeClosureCatalog(
  manifestModes: readonly string[],
): readonly Readonly<ModeClosureConsumption>[] {
  if (
    manifestModes.length !== PHASE_013_MODE_IDS.length
    || manifestModes.some((modeId, index) => modeId !== PHASE_013_MODE_IDS[index])
  ) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.MANIFEST_INCOMPLETE,
      'Closure ownership requires the exact ordered manifest workstream set',
      { manifestModes },
    );
  }
  return Object.freeze(PHASE_013_MODE_IDS.map((modeId) => Object.freeze({
    modeId,
    owners: ClosureOwnerIds,
    implementations: CrossModeClosureImplementations,
    paritySources: LegacyParitySources,
    deepImprovementCommonSources: modeId === '004-deep-improvement-common'
      || DEEP_IMPROVEMENT_VARIANTS.has(modeId)
      ? DeepImprovementCommonLegacySources
      : Object.freeze([]),
    deepImprovementRole: modeId === '004-deep-improvement-common'
      ? 'common'
      : DEEP_IMPROVEMENT_VARIANTS.has(modeId)
        ? 'thin-variant'
        : 'standalone',
  })));
}

const DEEP_IMPROVEMENT_VARIANTS: ReadonlySet<Phase013ModeId> = new Set([
  '005-agent-improvement',
  '006-model-benchmark',
  '007-skill-benchmark',
]);

export const CrossModeClosureCatalog = createCrossModeClosureCatalog(PHASE_013_MODE_IDS);
