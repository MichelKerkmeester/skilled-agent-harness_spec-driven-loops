// ───────────────────────────────────────────────────────────────────
// MODULE: Shared Mode Contracts Public API
// ───────────────────────────────────────────────────────────────────

export {
  MODE_COMPATIBILITY_POLICY_VERSION,
  MODE_CONTRACT_INTERFACE_VERSION,
  MODE_CONTRACT_SHAPE,
  ModeConvergenceHookSet,
  ModeProvidedCapabilities,
} from './mode-contract-types.js';
export {
  ModeSubstratePortSet,
  REQUIRED_MODE_SUBSTRATE_PORTS,
} from './substrate-ports.js';
export { resolveModeInterfaceCompatibility } from './compatibility-policy.js';
export {
  evaluateModeEventWrite,
  modeWorkstreamsFromManifest,
  runModeConformance,
} from './conformance.js';

export type * from './mode-contract-types.js';
export type * from './substrate-ports.js';
export type * from './compatibility-policy.js';
export type * from './conformance.js';
