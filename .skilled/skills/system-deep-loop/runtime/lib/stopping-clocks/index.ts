// ───────────────────────────────────────────────────────────────────
// MODULE: Stopping Clocks Public API
// ───────────────────────────────────────────────────────────────────

export {
  STOPPING_CLOCK_CAUSES,
  STOPPING_CLOCK_TERMINATION_CLASSES,
  observeBudgetClock,
  observeCoverageClock,
  observeCycleClock,
  observeNoveltyDecayClock,
  observeWallTimeClock,
} from './stopping-clock-adapters.js';
export {
  arbitrateStoppingClocks,
  validateLoopTerminationDeclared,
} from './stopping-clock-arbiter.js';
export {
  LOOP_TERMINATION_DECLARED_EVENT_TYPE,
  LOOP_TERMINATION_DECLARED_EVENT_VERSION,
  STOPPING_CLOCK_CAPABILITY_ID,
  STOPPING_CLOCK_POLICY_ID,
  STOPPING_CLOCK_POLICY_VERSION,
  STOPPING_CLOCK_SHADOW_MODE,
  createStoppingClockEventRegistry,
  createStoppingClockPolicyRegistry,
  loopTerminationDeclaredEventDefinition,
  prepareLoopTerminationDeclaredEvent,
  recordLoopTerminationDeclaredEvent,
  stoppingClockWriteContext,
} from './stopping-clock-events.js';
export {
  STOPPING_CLOCK_ADAPTER_VERSIONS,
  STOPPING_CLOCK_PROFILES,
  STOPPING_CLOCK_SCHEMA_VERSION,
  STOPPING_CLOCK_TIE_RANK,
  STOPPING_CLOCK_TIE_RANK_VERSION,
  StoppingClockProfileError,
  StoppingClockProfileRegistry,
  stoppingClockProfiles,
  validateStoppingClockProfile,
} from './stopping-clock-profiles.js';
export { createStoppingClocksShadowResult } from './stopping-clock-shadow.js';
export { StoppingClockKinds, StoppingClockStates } from './stopping-clock-types.js';

export type * from './stopping-clock-types.js';
export type {
  LoopTerminationEventEnvelopeInput,
  LoopTerminationEventRecordResult,
  StoppingClockWriteContext,
} from './stopping-clock-events.js';
