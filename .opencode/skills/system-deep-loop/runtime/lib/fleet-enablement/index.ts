// ───────────────────────────────────────────────────────────────────
// MODULE: Fleet Mode Enablement Public API
// ───────────────────────────────────────────────────────────────────

export {
  FLEET_MODE_ORDER,
  deriveModeSurfaceSet,
  deriveAllModeSurfaceSets,
} from './mode-surface-map.js';
export type { ModeSurfaceSet } from './mode-surface-map.js';

export {
  readEnablementState,
  runFleetEnablement,
} from './enablement-driver.js';
export type {
  EnablementCheck,
  ModeStepOutcome,
  EnablementFailure,
  EnablementRunState,
  RunFleetEnablementOptions,
  FleetEnablementResult,
} from './enablement-driver.js';