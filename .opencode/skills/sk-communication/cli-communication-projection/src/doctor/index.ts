// ───────────────────────────────────────────────────────────────────
// MODULE: Compatibility Doctor Public API
// ───────────────────────────────────────────────────────────────────

export {
  checkCapabilityPresence,
  checkCredentialReferencePresence,
  checkEndpointReachability,
  checkPresentationTier,
  checkPrivacyFactFreshness,
  checkVersionCompatibility,
} from './checks.js';
export { runCompatibilityDoctor } from './doctor.js';

export type {
  DoctorCheckId,
  DoctorCredentialReferencePresence,
  DoctorFinding,
  DoctorInput,
  DoctorModelProposal,
  DoctorReachabilityProbe,
  DoctorReachabilityProbeRequest,
  DoctorReachabilityProbeResult,
  DoctorReport,
  DoctorRuntimeProposal,
  DoctorSeverity,
} from './types.js';
