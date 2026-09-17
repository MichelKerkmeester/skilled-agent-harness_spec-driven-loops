// ───────────────────────────────────────────────────────────────────
// MODULE: Compatibility Doctor
// ───────────────────────────────────────────────────────────────────

import { deepFreeze } from '../fidelity/freeze.js';
import {
  checkCapabilityPresence,
  checkCredentialReferencePresence,
  checkEndpointReachability,
  checkPresentationTier,
  checkPrivacyFactFreshness,
  checkVersionCompatibility,
  createMalformedInputFinding,
} from './checks.js';

import type { DoctorFinding, DoctorInput, DoctorReport } from './types.js';

/** Diagnose the proposed route and force every blocked configuration to original-only. */
export async function runCompatibilityDoctor(input: DoctorInput): Promise<DoctorReport> {
  try {
    return createDoctorReport([
      checkVersionCompatibility(input),
      checkCapabilityPresence(input),
      await checkEndpointReachability(input),
      checkCredentialReferencePresence(input),
      checkPrivacyFactFreshness(input),
      checkPresentationTier(input),
    ]);
  } catch {
    return createDoctorReport([createMalformedInputFinding()]);
  }
}

function createDoctorReport(findings: DoctorFinding[]): DoctorReport {
  const hasBlock = findings.some((finding) => finding.severity === 'block');
  const hasWarning = findings.some((finding) => finding.severity === 'warn');
  const overallDecision = hasBlock ? 'blocked' : hasWarning ? 'degraded' : 'ready';

  return deepFreeze({
    reportVersion: 'compatibility-doctor/1.0.0',
    findings,
    overallDecision,
    routeSelection: hasBlock ? 'original-only' : 'proposed',
    contentFree: true,
  });
}
