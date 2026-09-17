// ───────────────────────────────────────────────────────────────────
// MODULE: Compatibility Doctor Checks
// ───────────────────────────────────────────────────────────────────

import { ProviderFamilies, ProviderPrivacyFactNames } from '../providers/types.js';
import {
  SUPPORT_MATRIX_VERSION,
  SupportMatrix,
  assessOpenCodeGoHostedPrivacyFreshness,
  assessSupportMatrixFreshness,
} from '../release/support-matrix.js';
import { RuntimeCapabilityMatrix } from '../runtimes/matrix.js';

import type { ProviderModelRecord, ProviderPrivacyFact } from '../providers/types.js';
import type { SupportMatrix as SupportMatrixRecord, SupportRow } from '../release/types.js';
import type { RuntimeCapabilityMatrixEntry } from '../runtimes/matrix.js';
import type { DoctorFinding, DoctorInput, DoctorSeverity } from './types.js';

const OPERATOR_SELECTED_MODEL = 'operator-selected-model';
const REQUIRED_HOSTED_PRIVACY_FACTS = [
  ProviderPrivacyFactNames.RETENTION,
  ProviderPrivacyFactNames.TRAINING_USE,
] as const;

/** Verify runtime and protocol majors against fresh, published support rows. */
export function checkVersionCompatibility(input: DoctorInput): DoctorFinding {
  const matrix = input.supportMatrix ?? SupportMatrix;
  if (matrix.version !== SUPPORT_MATRIX_VERSION) {
    return block('version-compatibility', 'support-matrix-version-unknown',
      'Use a recognized support-matrix version before enabling the proposed route.');
  }
  if (input.proposedRuntimes.length === 0) {
    return block('version-compatibility', 'runtime-configuration-missing',
      'Configure a runtime path that appears in the fresh support matrix.');
  }

  let hasProvisionalSupport = false;
  for (const proposal of input.proposedRuntimes) {
    const entry = findRuntimeEntry(proposal.runtime, proposal.pathId);
    if (entry === undefined) {
      return block('version-compatibility', 'runtime-path-unknown',
        'Choose a runtime path listed in the fresh support matrix.');
    }
    if (proposal.protocol !== entry.protocol) {
      return block('version-compatibility', 'protocol-unsupported',
        'Use the protocol assigned to the selected runtime path.');
    }

    const runtimeMajor = versionMajor(proposal.runtimeVersion);
    const testedRuntimeMajor = versionMajor(entry.testedVersions.runtime);
    if (runtimeMajor === null || testedRuntimeMajor === null) {
      return block('version-compatibility', 'runtime-version-unknown',
        'Provide a version with a numeric major that can be compared safely.');
    }
    if (runtimeMajor !== testedRuntimeMajor) {
      return block('version-compatibility', 'runtime-major-unsupported',
        'Use a runtime major listed in the fresh support matrix.');
    }

    const protocolMajor = versionMajor(proposal.protocolVersion);
    const testedProtocolMajor = versionMajor(entry.testedVersions.protocol);
    if (protocolMajor === null || testedProtocolMajor === null) {
      return block('version-compatibility', 'protocol-version-unknown',
        'Provide a protocol version with a numeric major that can be compared safely.');
    }
    if (protocolMajor !== testedProtocolMajor) {
      return block('version-compatibility', 'protocol-major-unsupported',
        'Use a protocol major listed in the fresh support matrix.');
    }

    const rows = runtimeSupportRows(matrix, entry);
    if (rows.length !== 2) {
      return block('version-compatibility', 'version-support-unknown',
        'Refresh the support matrix with runtime and protocol evidence.');
    }
    if (!areRowsFresh(matrix, rows, input.now)) {
      return block('version-compatibility', 'version-support-stale',
        'Refresh the dated runtime and protocol evidence before routing.');
    }
    if (rows.some((row) => row.releaseStatus === 'unsupported')) {
      return block('version-compatibility', 'version-support-unsupported',
        'Choose a runtime and protocol combination marked supported.');
    }
    hasProvisionalSupport ||= rows.some((row) => row.releaseStatus === 'provisional');
  }

  return hasProvisionalSupport
    ? warn('version-compatibility', 'version-support-provisional',
      'Confirm the provisional version evidence before release.')
    : ok('version-compatibility', 'versions-compatible');
}

/** Require every requested model capability to be present and confirmed. */
export function checkCapabilityPresence(input: DoctorInput): DoctorFinding {
  const matrix = input.supportMatrix ?? SupportMatrix;
  if (matrix.version !== SUPPORT_MATRIX_VERSION) {
    return block('capability-presence', 'support-matrix-version-unknown',
      'Use a recognized support-matrix version before enabling the proposed route.');
  }
  if (input.proposedProviders.length === 0 || input.proposedModels.length === 0) {
    return block('capability-presence', 'model-configuration-missing',
      'Configure an evidence-backed provider model and its required capabilities.');
  }

  for (const record of input.proposedProviders) {
    const matchingModels = input.proposedModels.filter((model) =>
      model.providerId === record.provider.providerId
      && model.modelId === record.provider.modelId);
    if (matchingModels.length !== 1) {
      return block('capability-presence', 'provider-model-unknown',
        'Declare exactly one model configuration for every proposed provider.');
    }
  }

  let hasProvisionalSupport = false;
  for (const model of input.proposedModels) {
    const record = input.proposedProviders.find((candidate) =>
      candidate.provider.providerId === model.providerId
      && candidate.provider.modelId === model.modelId);
    if (record === undefined) {
      return block('capability-presence', 'provider-model-unknown',
        'Choose a provider model included in the proposed configuration.');
    }

    const rows = providerSupportRows(matrix, record);
    if (rows.length !== 2) {
      return block('capability-presence', 'model-support-unknown',
        'Refresh the support matrix with provider and model evidence.');
    }
    if (!areRowsFresh(matrix, rows, input.now)) {
      return block('capability-presence', 'model-support-stale',
        'Refresh the dated provider and model evidence before routing.');
    }
    if (rows.some((row) => row.releaseStatus === 'unsupported')) {
      return block('capability-presence', 'model-support-unsupported',
        'Choose a provider model marked supported or provisional.');
    }
    hasProvisionalSupport ||= rows.some((row) => row.releaseStatus === 'provisional');

    const requiredCapabilities = new Set(['chat', ...model.requiredCapabilities]);
    for (const requiredCapability of requiredCapabilities) {
      const capability = record.provider.capabilities.find((candidate) =>
        candidate.name === requiredCapability);
      if (capability === undefined
        || capability.state === 'unknown'
        || capability.confidence !== 'confirmed') {
        return block('capability-presence', 'capability-unknown',
          'Confirm every required model capability with fresh evidence.');
      }
      if (capability.state === 'no') {
        return block('capability-presence', 'capability-unsupported',
          'Remove the unsupported capability or choose a compatible model.');
      }
    }
  }

  return hasProvisionalSupport
    ? warn('capability-presence', 'model-support-provisional',
      'Confirm the provisional provider-model evidence before release.')
    : ok('capability-presence', 'capabilities-confirmed');
}

/** Probe provider endpoints through the injected, deterministically budgeted boundary. */
export async function checkEndpointReachability(input: DoctorInput): Promise<DoctorFinding> {
  if (!isPositiveInteger(input.perProbeDeadlineMs)
    || !isPositiveInteger(input.totalDeadlineMs)) {
    return block('endpoint-reachability', 'endpoint-probe-deadline-invalid',
      'Configure positive integer per-probe and total deadlines.');
  }
  if (input.proposedProviders.length === 0) {
    return block('endpoint-reachability', 'provider-configuration-missing',
      'Configure an evidence-backed provider before probing reachability.');
  }

  let remainingTotalDeadlineMs = input.totalDeadlineMs;
  const probedEndpoints = new Set<string>();
  for (const record of input.proposedProviders) {
    const endpoint = record.provider.endpoint;
    if (endpoint.length === 0) {
      return block('endpoint-reachability', 'endpoint-unknown',
        'Configure a provider endpoint before enabling the route.');
    }
    if (probedEndpoints.has(endpoint)) {
      continue;
    }
    probedEndpoints.add(endpoint);
    if (remainingTotalDeadlineMs <= 0) {
      return block('endpoint-reachability', 'endpoint-total-deadline-exceeded',
        'Increase the total probe budget or reduce the proposed endpoints.');
    }

    const deadlineMs = Math.min(input.perProbeDeadlineMs, remainingTotalDeadlineMs);
    let result;
    try {
      result = await input.reachabilityProbe({
        endpoint,
        providerId: record.provider.providerId,
        deadlineMs,
        remainingTotalDeadlineMs,
      });
    } catch {
      return block('endpoint-reachability', 'endpoint-probe-failed',
        'Repair the reachability probe and rerun the diagnosis.');
    }

    if (!Number.isFinite(result.durationMs) || result.durationMs < 0) {
      return block('endpoint-reachability', 'endpoint-probe-result-invalid',
        'Return a finite, non-negative duration from the reachability probe.');
    }
    if (result.durationMs > deadlineMs || result.durationMs > remainingTotalDeadlineMs
      || result.status === 'deadline-exceeded') {
      return block('endpoint-reachability', 'endpoint-probe-deadline-exceeded',
        'Restore endpoint responsiveness or adjust the explicit probe budgets.');
    }
    remainingTotalDeadlineMs -= result.durationMs;
    if (result.status === 'unreachable') {
      return block('endpoint-reachability', 'endpoint-unreachable',
        'Restore endpoint reachability before enabling the provider route.');
    }
    if (result.status !== 'reachable') {
      return block('endpoint-reachability', 'endpoint-reachability-unknown',
        'Confirm endpoint reachability before enabling the provider route.');
    }
  }

  return ok('endpoint-reachability', 'endpoints-reachable');
}

/** Check only credential-reference availability, never credential material. */
export function checkCredentialReferencePresence(input: DoctorInput): DoctorFinding {
  if (input.proposedProviders.length === 0) {
    return block('credential-reference-presence', 'provider-configuration-missing',
      'Configure an evidence-backed provider before checking credentials.');
  }

  for (const record of input.proposedProviders) {
    if (record.authorizationScheme === 'none') {
      if (!/^none:[^\s]+$/u.test(record.provider.credentialReference)) {
        return block('credential-reference-presence', 'credential-reference-invalid',
          'Use a valid non-secret reference for the local provider.');
      }
      continue;
    }
    if (!/^(?:env|keychain|managed):[^\s]+$/u.test(record.provider.credentialReference)) {
      return block('credential-reference-presence', 'credential-reference-invalid',
        'Use a supported credential-reference scheme without embedding a value.');
    }
    const assertions = input.credentialReferencePresence.filter((candidate) =>
      candidate.providerId === record.provider.providerId);
    const assertion = assertions[0];
    if (assertions.length !== 1 || assertion === undefined || assertion.present === 'unknown') {
      return block('credential-reference-presence', 'credential-reference-unknown',
        'Confirm the credential reference is available without reading its value.');
    }
    if (!assertion.present) {
      return block('credential-reference-presence', 'credential-reference-missing',
        'Provision the referenced credential before enabling the hosted route.');
    }
  }

  return ok('credential-reference-presence', 'credential-references-present');
}

/** Require fresh retention and training-use facts for every hosted route. */
export function checkPrivacyFactFreshness(input: DoctorInput): DoctorFinding {
  for (const record of input.proposedProviders) {
    if (record.provider.deploymentMode !== 'hosted') {
      continue;
    }
    if (record.family === ProviderFamilies.OPENCODE_GO) {
      const result = assessOpenCodeGoHostedPrivacyFreshness(record, input.now);
      if (result.decision === 'block') {
        return block('privacy-fact-freshness', result.reasonCode,
          'Refresh the required hosted privacy facts before enabling the route.');
      }
      continue;
    }

    const nowTimestamp = Date.parse(input.now);
    if (Number.isNaN(nowTimestamp)) {
      return block('privacy-fact-freshness', 'now-invalid',
        'Provide a valid injected timestamp for privacy-fact evaluation.');
    }
    const facts = REQUIRED_HOSTED_PRIVACY_FACTS.map((name) =>
      record.privacyFacts.find((fact) => fact.name === name));
    if (facts.some((fact) => fact === undefined)) {
      return block('privacy-fact-freshness', 'privacy-fact-missing',
        'Publish the required hosted privacy facts before enabling the route.');
    }
    if (facts.some((fact) => !isConfirmedPrivacyFact(fact))) {
      return block('privacy-fact-freshness', 'privacy-fact-unknown',
        'Confirm the required hosted privacy facts before enabling the route.');
    }
    if (facts.some((fact) => isExpiredPrivacyFact(fact, nowTimestamp))) {
      return block('privacy-fact-freshness', 'privacy-fact-expired',
        'Refresh the required hosted privacy facts before enabling the route.');
    }
  }

  return ok('privacy-fact-freshness', 'privacy-facts-fresh');
}

/** Require the requested presentation tier to match fresh runtime evidence. */
export function checkPresentationTier(input: DoctorInput): DoctorFinding {
  const matrix = input.supportMatrix ?? SupportMatrix;
  if (matrix.version !== SUPPORT_MATRIX_VERSION) {
    return block('presentation-tier', 'support-matrix-version-unknown',
      'Use a recognized support-matrix version before enabling the proposed route.');
  }
  if (input.proposedRuntimes.length === 0) {
    return block('presentation-tier', 'runtime-configuration-missing',
      'Configure a runtime path with a supported presentation tier.');
  }

  let hasProvisionalSupport = false;
  for (const proposal of input.proposedRuntimes) {
    const entry = findRuntimeEntry(proposal.runtime, proposal.pathId);
    if (entry === undefined) {
      return block('presentation-tier', 'runtime-path-unknown',
        'Choose a runtime path listed in the fresh support matrix.');
    }
    if (proposal.presentationTier !== entry.presentationTier) {
      return block('presentation-tier', 'presentation-tier-unsupported',
        'Use the presentation tier assigned to the selected runtime path.');
    }
    const row = matrix.rows.find((candidate) =>
      candidate.dimension === 'presentation-tier'
      && candidate.identifier
        === `${entry.runtime}:${entry.pathId}:${entry.presentationTier}`);
    if (row === undefined) {
      return block('presentation-tier', 'presentation-tier-unknown',
        'Refresh the support matrix with presentation-tier evidence.');
    }
    if (!areRowsFresh(matrix, [row], input.now)) {
      return block('presentation-tier', 'presentation-tier-stale',
        'Refresh the dated presentation-tier evidence before routing.');
    }
    if (row.releaseStatus === 'unsupported') {
      return block('presentation-tier', 'presentation-tier-unsupported',
        'Choose a presentation tier marked supported.');
    }
    hasProvisionalSupport ||= row.releaseStatus === 'provisional';
  }

  return hasProvisionalSupport
    ? warn('presentation-tier', 'presentation-tier-provisional',
      'Confirm the provisional presentation-tier evidence before release.')
    : ok('presentation-tier', 'presentation-tier-supported');
}

/** Represent structurally unusable input without retaining its content. */
export function createMalformedInputFinding(): DoctorFinding {
  return block('input-validation', 'input-malformed',
    'Provide a structurally valid compatibility-doctor input.');
}

function findRuntimeEntry(runtime: string, pathId: string): RuntimeCapabilityMatrixEntry | undefined {
  return RuntimeCapabilityMatrix.find((entry) =>
    entry.runtime === runtime && entry.pathId === pathId);
}

function runtimeSupportRows(
  matrix: SupportMatrixRecord,
  entry: RuntimeCapabilityMatrixEntry,
): SupportRow[] {
  const identifiers = new Set([
    `${entry.runtime}:${entry.pathId}@${entry.testedVersions.runtime}`,
    `${entry.protocol}@${entry.testedVersions.protocol}:${entry.runtime}:${entry.pathId}`,
  ]);
  return matrix.rows.filter((row) =>
    (row.dimension === 'runtime' || row.dimension === 'protocol')
    && identifiers.has(row.identifier));
}

function providerSupportRows(
  matrix: SupportMatrixRecord,
  record: ProviderModelRecord,
): SupportRow[] {
  const modelIdentifier = record.provider.deploymentMode === 'local'
    ? `${record.provider.providerId}:${OPERATOR_SELECTED_MODEL}`
    : `${record.provider.providerId}:${record.provider.modelId}`;
  return matrix.rows.filter((row) =>
    (row.dimension === 'provider' && row.identifier === record.provider.providerId)
    || (row.dimension === 'model' && row.identifier === modelIdentifier));
}

function areRowsFresh(
  matrix: SupportMatrixRecord,
  rows: readonly SupportRow[],
  now: string,
): boolean {
  return assessSupportMatrixFreshness({ ...matrix, rows }, now).decision === 'allow';
}

function versionMajor(version: string): number | null {
  const match = /^(?:v)?(\d+)(?:\.|$)/u.exec(version);
  if (match?.[1] === undefined) {
    return null;
  }
  const major = Number(match[1]);
  return Number.isSafeInteger(major) ? major : null;
}

function isConfirmedPrivacyFact(
  fact: ProviderPrivacyFact | undefined,
): fact is ProviderPrivacyFact {
  return fact !== undefined && fact.state === 'known' && fact.confidence === 'confirmed';
}

function isExpiredPrivacyFact(
  fact: ProviderPrivacyFact | undefined,
  nowTimestamp: number,
): boolean {
  if (fact?.expiresAt === null || fact?.expiresAt === undefined) {
    return true;
  }
  const expiryTimestamp = Date.parse(fact.expiresAt);
  return Number.isNaN(expiryTimestamp) || nowTimestamp > expiryTimestamp;
}

function isPositiveInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0;
}

function ok(checkId: DoctorFinding['checkId'], reasonCode: string): DoctorFinding {
  return finding(checkId, 'ok', reasonCode, 'No remediation required.');
}

function warn(
  checkId: DoctorFinding['checkId'],
  reasonCode: string,
  remediation: string,
): DoctorFinding {
  return finding(checkId, 'warn', reasonCode, remediation);
}

function block(
  checkId: DoctorFinding['checkId'],
  reasonCode: string,
  remediation: string,
): DoctorFinding {
  return finding(checkId, 'block', reasonCode, remediation);
}

function finding(
  checkId: DoctorFinding['checkId'],
  severity: DoctorSeverity,
  reasonCode: string,
  remediation: string,
): DoctorFinding {
  return Object.freeze({ checkId, severity, reasonCode, remediation });
}
