// ───────────────────────────────────────────────────────────────────
// MODULE: Evidence-Backed Release Support Matrix
// ───────────────────────────────────────────────────────────────────

import { createSha256Digest } from '../contracts/exact-original.js';
import { deepFreeze } from '../fidelity/freeze.js';
import {
  createLlamaCppModelRecord,
  createOllamaModelRecord,
  createOpenCodeGoDeepSeekV4FlashRecord,
} from '../providers/presets.js';
import { ProviderFamilies, ProviderPrivacyFactNames } from '../providers/types.js';
import { RuntimeCapabilityMatrix } from '../runtimes/matrix.js';

import type { ProviderModelRecord } from '../providers/types.js';
import type { RuntimeCapabilityMatrixEntry } from '../runtimes/matrix.js';
import type {
  FreshSupportRow,
  FreshnessReasonCode,
  FreshnessResult,
  HostedPrivacyFreshnessResult,
  StaleSupportRow,
  SupportDimension,
  SupportMatrix as SupportMatrixRecord,
  SupportReleaseStatus,
  SupportRow,
} from './types.js';

/** Version of the deterministic support metadata contract. */
export const SUPPORT_MATRIX_VERSION = 'support-matrix/1.0.0' as const;

const RUNTIME_EVIDENCE_TTL_DAYS = 90;
const OPERATOR_SELECTED_MODEL = 'operator-selected-model';
const SUPPORT_MATRIX_CREDENTIAL_REFERENCE = 'managed:support-matrix-probe';
const REQUIRED_HOSTED_PRIVACY_FACTS = [
  ProviderPrivacyFactNames.RETENTION,
  ProviderPrivacyFactNames.TRAINING_USE,
] as const;
const DIMENSION_ORDER: readonly SupportDimension[] = [
  'runtime',
  'protocol',
  'provider',
  'model',
  'operating-system',
  'prompt-profile',
  'presentation-tier',
];
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;

/** Assemble the immutable matrix from provider presets and runtime records. */
export function createSupportMatrix(): SupportMatrixRecord {
  const runtimeRows = createRuntimeRows(RuntimeCapabilityMatrix);
  const evidenceDate = latestTestedDate(runtimeRows);
  const runtimeExpiryDate = addUtcDays(evidenceDate, RUNTIME_EVIDENCE_TTL_DAYS);
  const providers = createProviderRecords(evidenceDate, runtimeExpiryDate);
  const rows = [
    ...runtimeRows,
    ...createProviderRows(providers),
    createOperatingSystemRow(evidenceDate, runtimeExpiryDate),
    createPromptProfileRow(evidenceDate, runtimeExpiryDate),
  ].sort(compareRows);
  const version = SUPPORT_MATRIX_VERSION;
  const contentFreeDigest = createMatrixDigest(version, rows);
  return deepFreeze({ version, rows, contentFreeDigest });
}

/** Mark malformed or expired evidence stale and block the release decision. */
export function assessSupportMatrixFreshness(
  matrix: SupportMatrixRecord,
  now: string,
): FreshnessResult {
  const nowDate = normalizeDate(now);
  const freshRows: FreshSupportRow[] = [];
  const staleRows: StaleSupportRow[] = [];

  for (const row of matrix.rows) {
    const reasonCode = assessRowFreshness(row, nowDate);
    if (reasonCode === 'fresh') {
      freshRows.push({ row, reasonCode });
    } else {
      staleRows.push({ row, reasonCode });
    }
  }

  const isFresh = staleRows.length === 0;
  const reasonCodes = uniqueReasonCodes(freshRows, staleRows);
  return deepFreeze({
    status: isFresh ? 'fresh' : 'stale',
    decision: isFresh ? 'allow' : 'block',
    freshRows,
    staleRows,
    reasonCodes,
  });
}

/** Block OpenCode Go hosted routing when required privacy evidence is unusable. */
export function assessOpenCodeGoHostedPrivacyFreshness(
  record: ProviderModelRecord,
  now: string,
): HostedPrivacyFreshnessResult {
  if (
    record.family !== ProviderFamilies.OPENCODE_GO
    || record.provider.deploymentMode !== 'hosted'
  ) {
    return hostedPrivacyResult('block', 'not-opencode-go-hosted', []);
  }

  const nowDate = normalizeDate(now);
  if (nowDate === null) {
    return hostedPrivacyResult('block', 'now-invalid', []);
  }

  const facts = REQUIRED_HOSTED_PRIVACY_FACTS.map((name) => ({
    name,
    fact: record.privacyFacts.find((candidate) => candidate.name === name),
  }));
  const missingFacts = facts.filter(({ fact }) => fact === undefined).map(({ name }) => name);
  if (missingFacts.length > 0) {
    return hostedPrivacyResult('block', 'privacy-fact-missing', missingFacts);
  }

  const unknownFacts = facts
    .filter(({ fact }) => fact?.state !== 'known' || fact?.confidence !== 'confirmed')
    .map(({ name }) => name);
  if (unknownFacts.length > 0) {
    return hostedPrivacyResult('block', 'privacy-fact-unknown', unknownFacts);
  }

  const expiredFacts = facts
    .filter(({ fact }) => {
      const expiryDate = normalizeDate(fact?.expiresAt ?? '');
      return expiryDate === null || nowDate > expiryDate;
    })
    .map(({ name }) => name);
  if (expiredFacts.length > 0) {
    return hostedPrivacyResult('block', 'privacy-fact-expired', expiredFacts);
  }

  return hostedPrivacyResult('allow', 'fresh', []);
}

/** Built-in matrix used by release and compatibility consumers. */
export const SupportMatrix = createSupportMatrix();

function createRuntimeRows(
  records: readonly RuntimeCapabilityMatrixEntry[],
): SupportRow[] {
  return records.flatMap((record) => {
    const testedDate = toDateOnly(record.evidence.observedAt);
    const expiryDate = addUtcDays(testedDate, RUNTIME_EVIDENCE_TTL_DAYS);
    const releaseStatus = runtimeReleaseStatus(record);
    const evidenceRef = `src/runtimes/${record.runtime}.ts#${record.evidence.source}`;
    return [
      row(
        'runtime',
        `${record.runtime}:${record.pathId}@${record.testedVersions.runtime}`,
        evidenceRef,
        testedDate,
        expiryDate,
        releaseStatus,
      ),
      row(
        'protocol',
        `${record.protocol}@${record.testedVersions.protocol}:${record.runtime}:${record.pathId}`,
        evidenceRef,
        testedDate,
        expiryDate,
        releaseStatus,
      ),
      row(
        'presentation-tier',
        `${record.runtime}:${record.pathId}:${record.presentationTier}`,
        evidenceRef,
        testedDate,
        expiryDate,
        releaseStatus,
      ),
    ];
  });
}

function createProviderRecords(
  testedDate: string,
  expiryDate: string,
): readonly ProviderModelRecord[] {
  const observedAt = `${testedDate}T00:00:00.000Z`;
  const capabilitiesExpireAt = `${expiryDate}T23:59:59.000Z`;
  return [
    createOpenCodeGoDeepSeekV4FlashRecord({
      credentialReference: SUPPORT_MATRIX_CREDENTIAL_REFERENCE,
    }),
    createOllamaModelRecord({
      modelId: OPERATOR_SELECTED_MODEL,
      privacyClass: 'local-offline',
      observedAt,
      capabilitiesExpireAt,
    }),
    createLlamaCppModelRecord({
      modelId: OPERATOR_SELECTED_MODEL,
      privacyClass: 'local-offline',
      observedAt,
      capabilitiesExpireAt,
    }),
  ];
}

function createProviderRows(records: readonly ProviderModelRecord[]): SupportRow[] {
  return records.flatMap((record) => {
    const testedDate = toDateOnly(record.capabilityEvidence.observedAt);
    const expiryDate = providerExpiryDate(record);
    const releaseStatus = record.family === ProviderFamilies.OPENCODE_GO
      ? 'supported'
      : 'provisional';
    const evidenceRef = record.capabilityEvidence.sourceUrl;
    return [
      row(
        'provider',
        record.provider.providerId,
        evidenceRef,
        testedDate,
        expiryDate,
        releaseStatus,
      ),
      row(
        'model',
        `${record.provider.providerId}:${record.provider.modelId}`,
        evidenceRef,
        testedDate,
        expiryDate,
        releaseStatus,
      ),
      row(
        'protocol',
        `${record.provider.protocol}:${record.provider.providerId}`,
        evidenceRef,
        testedDate,
        expiryDate,
        releaseStatus,
      ),
    ];
  });
}

function createOperatingSystemRow(testedDate: string, expiryDate: string): SupportRow {
  return row(
    'operating-system',
    'node-22-portable-host',
    'package.json#engines',
    testedDate,
    expiryDate,
    'provisional',
  );
}

function createPromptProfileRow(testedDate: string, expiryDate: string): SupportRow {
  return row(
    'prompt-profile',
    'prompt-profile/1.0.0',
    'src/contracts/prompt.ts#PromptProfileRecord',
    testedDate,
    expiryDate,
    'provisional',
  );
}

function row(
  dimension: SupportDimension,
  identifier: string,
  evidenceRef: string,
  testedDate: string,
  expiryDate: string,
  releaseStatus: SupportReleaseStatus,
): SupportRow {
  return { dimension, identifier, evidenceRef, testedDate, expiryDate, releaseStatus };
}

function runtimeReleaseStatus(
  record: RuntimeCapabilityMatrixEntry,
): SupportReleaseStatus {
  return record.evidence.safePresentationBoundary.state === 'yes'
    && record.evidence.safePresentationBoundary.confidence === 'confirmed'
    ? 'supported'
    : 'unsupported';
}

function providerExpiryDate(record: ProviderModelRecord): string {
  const expiryDates = [
    record.capabilityEvidence.expiresAt,
    record.provider.termsExpiresAt,
    ...record.privacyFacts.map((fact) => fact.expiresAt),
  ]
    .filter((value): value is string => value !== null)
    .map(toDateOnly)
    .sort(compareText);
  const earliest = expiryDates[0];
  if (earliest === undefined) {
    throw new TypeError(`Provider '${record.provider.providerId}' has no dated evidence expiry.`);
  }
  return earliest;
}

function createMatrixDigest(
  version: SupportMatrixRecord['version'],
  rows: readonly SupportRow[],
): string {
  const metadata = { version, rows };
  return createSha256Digest(new TextEncoder().encode(JSON.stringify(metadata)));
}

function assessRowFreshness(
  rowValue: SupportRow,
  nowDate: string | null,
): FreshnessReasonCode {
  if (nowDate === null) {
    return 'now-invalid';
  }
  const testedDate = parseDateOnly(rowValue.testedDate);
  if (testedDate === null) {
    return 'tested-date-invalid';
  }
  const expiryDate = parseDateOnly(rowValue.expiryDate);
  if (expiryDate === null) {
    return 'expiry-date-invalid';
  }
  if (expiryDate < testedDate) {
    return 'expiry-before-tested';
  }
  const nowTimestamp = parseDateOnly(nowDate);
  return nowTimestamp !== null && nowTimestamp > expiryDate ? 'expired' : 'fresh';
}

function uniqueReasonCodes(
  freshRows: readonly FreshSupportRow[],
  staleRows: readonly StaleSupportRow[],
): FreshnessReasonCode[] {
  return [...new Set<FreshnessReasonCode>([
    ...freshRows.map((entry) => entry.reasonCode),
    ...staleRows.map((entry) => entry.reasonCode),
  ])];
}

function hostedPrivacyResult(
  decision: HostedPrivacyFreshnessResult['decision'],
  reasonCode: HostedPrivacyFreshnessResult['reasonCode'],
  factNames: HostedPrivacyFreshnessResult['factNames'],
): HostedPrivacyFreshnessResult {
  return deepFreeze({ decision, reasonCode, factNames: [...factNames] });
}

function latestTestedDate(rows: readonly SupportRow[]): string {
  const dates = rows.map((entry) => entry.testedDate).sort(compareText);
  const latest = dates.at(-1);
  if (latest === undefined) {
    throw new TypeError('Runtime capability matrix contains no dated evidence.');
  }
  return latest;
}

function normalizeDate(value: string): string | null {
  if (ISO_DATE_PATTERN.test(value)) {
    return parseDateOnly(value) === null ? null : value;
  }
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : new Date(timestamp).toISOString().slice(0, 10);
}

function toDateOnly(value: string): string {
  const normalized = normalizeDate(value);
  if (normalized === null) {
    throw new TypeError(`Invalid evidence date '${value}'.`);
  }
  return normalized;
}

function parseDateOnly(value: string): number | null {
  if (!ISO_DATE_PATTERN.test(value)) {
    return null;
  }
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  if (Number.isNaN(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) {
    return null;
  }
  return timestamp;
}

function addUtcDays(date: string, days: number): string {
  const timestamp = parseDateOnly(date);
  if (timestamp === null) {
    throw new TypeError(`Invalid evidence date '${date}'.`);
  }
  return new Date(timestamp + days * 24 * 60 * 60 * 1_000).toISOString().slice(0, 10);
}

function compareRows(left: SupportRow, right: SupportRow): number {
  const dimensionDifference = DIMENSION_ORDER.indexOf(left.dimension)
    - DIMENSION_ORDER.indexOf(right.dimension);
  return dimensionDifference !== 0
    ? dimensionDifference
    : compareText(left.identifier, right.identifier);
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
