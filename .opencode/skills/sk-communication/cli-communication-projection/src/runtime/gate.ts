// ───────────────────────────────────────────────────────────────────
// MODULE: Pre-Projection Capability and Privacy Gate
// ───────────────────────────────────────────────────────────────────

import { runCompatibilityDoctor } from '../doctor/doctor.js';
import { deepFreeze } from '../fidelity/freeze.js';

import type { DoctorFinding, DoctorInput, DoctorReport } from '../doctor/types.js';

/** Content-free reason for every unsafe terminal the gate can select. */
export const GateReasonCodes = {
  CAPABILITY_UNKNOWN: 'capability-unknown',
  CAPABILITY_UNSUPPORTED: 'capability-unsupported',
  CREDENTIAL_UNAVAILABLE: 'credential-unavailable',
  DOCTOR_MALFORMED: 'doctor-malformed',
  ENDPOINT_UNREACHABLE: 'endpoint-unreachable',
  PRESENTATION_UNSUPPORTED: 'presentation-unsupported',
  PRIVACY_FACT_STALE: 'privacy-fact-stale',
  PRIVACY_FACT_UNKNOWN: 'privacy-fact-unknown',
  VERSION_UNSUPPORTED: 'version-unsupported',
} as const;

/** Content-free gate reason. */
export type GateReasonCode = typeof GateReasonCodes[keyof typeof GateReasonCodes];

/** Typed terminal returned by the pre-projection gate. */
export type GateDecision =
  | { readonly status: 'proceed' }
  | { readonly status: 'exact-original'; readonly reasonCode: GateReasonCode };

const DOCTOR_REPORT_VERSION = 'compatibility-doctor/1.0.0';

/**
 * Map a compatibility-doctor report onto a typed decision and fail closed on
 * every unknown, stale, or incapable terminal. Only a fresh, capable,
 * privacy-approved report proceeds; every blocked or malformed report selects
 * the exact original with a content-free reason code and never a rewrite.
 */
export function evaluatePreProjectionGate(report: DoctorReport): GateDecision {
  if (
    report.reportVersion !== DOCTOR_REPORT_VERSION
    || report.contentFree !== true
    || !Array.isArray(report.findings)
  ) {
    return exactOriginal(GateReasonCodes.DOCTOR_MALFORMED);
  }
  if (report.overallDecision === 'blocked' || report.routeSelection !== 'proposed') {
    const block = report.findings.find((finding) => finding.severity === 'block');
    return exactOriginal(
      block !== undefined ? reasonForFinding(block) : GateReasonCodes.DOCTOR_MALFORMED,
    );
  }
  return deepFreeze({ status: 'proceed' });
}

/** Run the compatibility doctor for a proposed combination and map to a decision. */
export async function consultPreProjectionGate(input: DoctorInput): Promise<GateDecision> {
  return evaluatePreProjectionGate(await runCompatibilityDoctor(input));
}

function reasonForFinding(finding: DoctorFinding): GateReasonCode {
  switch (finding.checkId) {
    case 'capability-presence':
      return finding.reasonCode.includes('unsupported')
        ? GateReasonCodes.CAPABILITY_UNSUPPORTED
        : GateReasonCodes.CAPABILITY_UNKNOWN;
    case 'credential-reference-presence':
      return GateReasonCodes.CREDENTIAL_UNAVAILABLE;
    case 'endpoint-reachability':
      return GateReasonCodes.ENDPOINT_UNREACHABLE;
    case 'privacy-fact-freshness':
      return finding.reasonCode.includes('missing') || finding.reasonCode.includes('unknown')
        ? GateReasonCodes.PRIVACY_FACT_UNKNOWN
        : GateReasonCodes.PRIVACY_FACT_STALE;
    case 'presentation-tier':
      return GateReasonCodes.PRESENTATION_UNSUPPORTED;
    case 'version-compatibility':
      return GateReasonCodes.VERSION_UNSUPPORTED;
    case 'input-validation':
    default:
      return GateReasonCodes.DOCTOR_MALFORMED;
  }
}

function exactOriginal(reasonCode: GateReasonCode): GateDecision {
  return deepFreeze({ status: 'exact-original', reasonCode });
}
