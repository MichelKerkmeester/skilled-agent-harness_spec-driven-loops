// ───────────────────────────────────────────────────────────────────
// MODULE: Pre-Projection Gate Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  GateReasonCodes,
  consultPreProjectionGate,
  evaluatePreProjectionGate,
} from '../../src/runtime/index.js';
import {
  RUNTIME_NOW,
  createLocalProviderRecord,
  createReadyDoctorInput,
} from './helpers.js';

import type {
  DoctorFinding,
  DoctorReport,
} from '../../src/doctor/index.js';

function finding(
  checkId: DoctorFinding['checkId'],
  severity: DoctorFinding['severity'],
  reasonCode: string,
): DoctorFinding {
  return { checkId, severity, reasonCode, remediation: 'No remediation required.' };
}

function report(
  overallDecision: DoctorReport['overallDecision'],
  findings: readonly DoctorFinding[],
  routeSelection: DoctorReport['routeSelection'] = 'original-only',
): DoctorReport {
  return {
    reportVersion: 'compatibility-doctor/1.0.0',
    findings,
    overallDecision,
    routeSelection,
    contentFree: true,
  };
}

describe('evaluatePreProjectionGate', () => {
  it('proceeds on a fresh, capable, privacy-approved report', () => {
    const decision = evaluatePreProjectionGate(report('ready', [], 'proposed'));

    expect(decision).toEqual({ status: 'proceed' });
  });

  it('fails closed to exact-original on every block terminal', () => {
    const matrix: readonly [DoctorFinding['checkId'], string, string][] = [
      ['capability-presence', 'capability-unknown', GateReasonCodes.CAPABILITY_UNKNOWN],
      ['capability-presence', 'capability-unsupported', GateReasonCodes.CAPABILITY_UNSUPPORTED],
      ['credential-reference-presence', 'credential-reference-missing', GateReasonCodes.CREDENTIAL_UNAVAILABLE],
      ['endpoint-reachability', 'endpoint-unreachable', GateReasonCodes.ENDPOINT_UNREACHABLE],
      ['privacy-fact-freshness', 'privacy-fact-expired', GateReasonCodes.PRIVACY_FACT_STALE],
      ['privacy-fact-freshness', 'privacy-fact-missing', GateReasonCodes.PRIVACY_FACT_UNKNOWN],
      ['presentation-tier', 'presentation-tier-unsupported', GateReasonCodes.PRESENTATION_UNSUPPORTED],
      ['version-compatibility', 'runtime-major-unsupported', GateReasonCodes.VERSION_UNSUPPORTED],
      ['input-validation', 'input-malformed', GateReasonCodes.DOCTOR_MALFORMED],
    ];
    for (const [checkId, reasonCode, expected] of matrix) {
      const decision = evaluatePreProjectionGate(
        report('blocked', [finding(checkId, 'block', reasonCode)]),
      );
      expect(decision).toEqual({ status: 'exact-original', reasonCode: expected });
    }
  });

  it('proceeds on a degraded provisional report', () => {
    const decision = evaluatePreProjectionGate(
      report('degraded', [finding('version-compatibility', 'warn', 'version-support-provisional')], 'proposed'),
    );

    expect(decision).toEqual({ status: 'proceed' });
  });

  it('fails closed on a malformed report version', () => {
    const malformed = { ...report('ready', [], 'proposed'), reportVersion: 'compatibility-doctor/0.9.0' };
    const decision = evaluatePreProjectionGate(malformed as DoctorReport);

    expect(decision).toEqual({
      status: 'exact-original',
      reasonCode: GateReasonCodes.DOCTOR_MALFORMED,
    });
  });

  it('fails closed when content-free is violated', () => {
    const malformed = { ...report('ready', [], 'proposed'), contentFree: false };
    const decision = evaluatePreProjectionGate(malformed as DoctorReport);

    expect(decision).toEqual({
      status: 'exact-original',
      reasonCode: GateReasonCodes.DOCTOR_MALFORMED,
    });
  });
});

describe('consultPreProjectionGate', () => {
  it('runs the doctor and proceeds for a fresh capable combination', async () => {
    const record = createLocalProviderRecord();
    const decision = await consultPreProjectionGate(createReadyDoctorInput(record, RUNTIME_NOW));

    expect(decision).toEqual({ status: 'proceed' });
  });

  it('fails closed when the runtime proposal is missing', async () => {
    const record = createLocalProviderRecord();
    const decision = await consultPreProjectionGate(
      createReadyDoctorInput(record, RUNTIME_NOW, { proposedRuntimes: [] }),
    );

    expect(decision).toEqual({
      status: 'exact-original',
      reasonCode: GateReasonCodes.VERSION_UNSUPPORTED,
    });
  });

  it('fails closed when the endpoint probe reports unreachable', async () => {
    const record = createLocalProviderRecord();
    const decision = await consultPreProjectionGate(
      createReadyDoctorInput(record, RUNTIME_NOW, {
        reachabilityProbe: () => ({ status: 'unreachable', durationMs: 1 }),
      }),
    );

    expect(decision).toEqual({
      status: 'exact-original',
      reasonCode: GateReasonCodes.ENDPOINT_UNREACHABLE,
    });
  });
});
