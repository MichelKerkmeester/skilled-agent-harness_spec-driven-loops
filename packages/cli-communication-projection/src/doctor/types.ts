// ───────────────────────────────────────────────────────────────────
// MODULE: Compatibility Doctor Types
// ───────────────────────────────────────────────────────────────────

import type { ProviderModelRecord } from '../providers/types.js';
import type { SupportMatrix as SupportMatrixRecord } from '../release/types.js';

/** Stable identifiers for the doctor's independent diagnostic checks. */
export type DoctorCheckId =
  | 'capability-presence'
  | 'credential-reference-presence'
  | 'endpoint-reachability'
  | 'presentation-tier'
  | 'privacy-fact-freshness'
  | 'version-compatibility';

/** Closed diagnostic severity used to aggregate the overall decision. */
export type DoctorSeverity = 'block' | 'ok' | 'warn';

/** Content-free result of one compatibility or privacy check. */
export interface DoctorFinding {
  readonly checkId: DoctorCheckId;
  readonly severity: DoctorSeverity;
  readonly reasonCode: string;
  readonly remediation: string;
}

/** Proposed runtime path and presentation boundary. */
export interface DoctorRuntimeProposal {
  readonly runtime: string;
  readonly pathId: string;
  readonly runtimeVersion: string;
  readonly protocol: string;
  readonly protocolVersion: string;
  readonly presentationTier: string;
}

/** Required model capabilities for one proposed provider route. */
export interface DoctorModelProposal {
  readonly providerId: string;
  readonly modelId: string;
  readonly requiredCapabilities: readonly string[];
}

/** Availability assertion that deliberately contains no credential material. */
export interface DoctorCredentialReferencePresence {
  readonly providerId: string;
  readonly present: boolean | 'unknown';
}

/** Bounded request passed to the operator-supplied reachability probe. */
export interface DoctorReachabilityProbeRequest {
  readonly endpoint: string;
  readonly providerId: string;
  readonly deadlineMs: number;
  readonly remainingTotalDeadlineMs: number;
}

/** Deterministic probe outcome with injected budget consumption. */
export interface DoctorReachabilityProbeResult {
  readonly status: 'deadline-exceeded' | 'reachable' | 'unknown' | 'unreachable';
  readonly durationMs: number;
}

/** Injected boundary; implementations own transport and deadline enforcement. */
export type DoctorReachabilityProbe = (
  request: DoctorReachabilityProbeRequest,
) => DoctorReachabilityProbeResult | Promise<DoctorReachabilityProbeResult>;

/** Complete content-free configuration proposed for diagnosis. */
export interface DoctorInput {
  readonly proposedRuntimes: readonly DoctorRuntimeProposal[];
  readonly proposedProviders: readonly ProviderModelRecord[];
  readonly proposedModels: readonly DoctorModelProposal[];
  readonly credentialReferencePresence: readonly DoctorCredentialReferencePresence[];
  readonly reachabilityProbe: DoctorReachabilityProbe;
  readonly perProbeDeadlineMs: number;
  readonly totalDeadlineMs: number;
  readonly now: string;
  readonly supportMatrix?: SupportMatrixRecord;
}

/** Aggregated diagnosis that never carries message or credential content. */
export interface DoctorReport {
  readonly reportVersion: 'compatibility-doctor/1.0.0';
  readonly findings: readonly DoctorFinding[];
  readonly overallDecision: 'blocked' | 'degraded' | 'ready';
  readonly routeSelection: 'original-only' | 'proposed';
  readonly contentFree: true;
}
