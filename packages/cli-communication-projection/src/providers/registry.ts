// ───────────────────────────────────────────────────────────────────
// MODULE: Model-Scoped Provider Registry
// ───────────────────────────────────────────────────────────────────

import { ConfidenceStates } from '../contracts/common.js';
import { ProviderCapabilityNames, ProviderProtocols } from '../contracts/provider.js';
import { validateProviderRecord } from '../contracts/validate-policy.js';
import { isRecord } from '../contracts/validator-utils.js';
import { deepFreeze } from '../fidelity/freeze.js';
import {
  ProviderFamilies,
  ProviderPrivacyFactNames,
} from './types.js';

import type {
  ValidationIssue,
  ValidationResult,
} from '../contracts/common.js';
import type { ProviderCapability } from '../contracts/provider.js';
import type {
  ProviderCapabilityMerge,
  ProviderCapabilitySnapshot,
  ProviderCostRecord,
  ProviderModelRecord,
  ProviderPrivacyFact,
} from './types.js';

const RECORD_KEYS = [
  'recordVersion',
  'family',
  'controlProviderId',
  'provider',
  'authorizationScheme',
  'timeoutMs',
  'priority',
  'capabilityEvidence',
  'cost',
  'privacyFacts',
] as const;
const COST_KEYS = [
  'state',
  'currency',
  'inputPerMillionTokens',
  'outputPerMillionTokens',
  'sourceUrl',
  'observedAt',
  'expiresAt',
] as const;
const FACT_KEYS = [
  'name',
  'state',
  'value',
  'confidence',
  'sourceUrl',
  'observedAt',
  'expiresAt',
] as const;
const SAFE_IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u;

/** Immutable model registry with unique provider identifiers. */
export interface ProviderRegistry {
  readonly records: readonly ProviderModelRecord[];
  get(providerId: string): ProviderModelRecord | null;
}

/** Validate one runtime provider record without accepting extension fields. */
export function validateProviderModelRecord(
  input: unknown,
): ValidationResult<ProviderModelRecord> {
  const issues: ValidationIssue[] = [];
  if (!isRecord(input)) {
    return failure(input, [issue('$', 'type', 'Provider model record must be an object.')]);
  }
  rejectUnknownKeys(input, RECORD_KEYS, '$', issues);
  requireValue(input.recordVersion === 'provider-model/1.0.0', '$.recordVersion', 'version', issues);
  requireValue(
    Object.values(ProviderFamilies).includes(input.family as never),
    '$.family',
    'enum',
    issues,
  );
  requireValue(
    typeof input.controlProviderId === 'string' && SAFE_IDENTIFIER.test(input.controlProviderId),
    '$.controlProviderId',
    'identifier',
    issues,
  );
  requireValue(
    input.authorizationScheme === 'bearer' || input.authorizationScheme === 'none',
    '$.authorizationScheme',
    'enum',
    issues,
  );
  requireInteger(input.timeoutMs, 1, 120_000, '$.timeoutMs', issues);
  requireInteger(input.priority, 0, 10_000, '$.priority', issues);
  validateCapabilityEvidence(input.capabilityEvidence, issues);

  const providerResult = validateProviderRecord(input.provider);
  if (!providerResult.success) {
    issues.push(...providerResult.issues.map((entry) => ({
      ...entry,
      path: entry.path === '$' ? '$.provider' : `$.provider${entry.path.slice(1)}`,
    })));
  } else {
    validateFamilyCompatibility(input, providerResult.value, issues);
    const usesNoCredential = providerResult.value.credentialReference.startsWith('none:');
    requireValue(
      (input.authorizationScheme === 'none') === usesNoCredential,
      '$.authorizationScheme',
      'credential_scheme',
      issues,
    );
  }

  validateCost(input.cost, issues);
  validatePrivacyFacts(input.privacyFacts, issues);
  if (issues.length > 0) {
    return failure(input, issues);
  }
  return { success: true, value: input as unknown as ProviderModelRecord };
}

/** Build a caller-independent registry and reject duplicate model identifiers. */
export function createProviderRegistry(input: unknown): ValidationResult<ProviderRegistry> {
  if (!Array.isArray(input)) {
    return failure(input, [issue('$', 'type', 'Provider registry input must be an array.')]);
  }
  const issues: ValidationIssue[] = [];
  const records: ProviderModelRecord[] = [];
  const seen = new Set<string>();
  for (const [index, value] of input.entries()) {
    const result = validateProviderModelRecord(value);
    if (!result.success) {
      issues.push(...result.issues.map((entry) => ({
        ...entry,
        path: entry.path === '$' ? `$[${index}]` : `$[${index}]${entry.path.slice(1)}`,
      })));
      continue;
    }
    const providerId = result.value.provider.providerId;
    if (seen.has(providerId)) {
      issues.push(issue(`$[${index}].provider.providerId`, 'duplicate', 'Provider ID must be unique.'));
      continue;
    }
    seen.add(providerId);
    records.push(deepFreeze(structuredClone(result.value)));
  }
  if (issues.length > 0) {
    return failure(input, issues);
  }
  const frozenRecords = Object.freeze(records);
  const byId = new Map(frozenRecords.map((record) => [record.provider.providerId, record]));
  return {
    success: true,
    value: Object.freeze({
      records: frozenRecords,
      get(providerId: string): ProviderModelRecord | null {
        return byId.get(providerId) ?? null;
      },
    }),
  };
}

/** Merge fresh probe evidence or conservatively erase stale capability claims. */
export function mergeCapabilitySnapshot(
  record: ProviderModelRecord,
  snapshot: unknown,
  now: string,
): ProviderCapabilityMerge {
  const recordResult = validateProviderModelRecord(record);
  const snapshotResult = validateSnapshot(snapshot);
  if (!recordResult.success || !snapshotResult.success || !isIsoDate(now)) {
    return frozenMerge('rejected', 'invalid-snapshot', record);
  }
  const value = snapshotResult.value;
  if (
    value.providerId !== record.provider.providerId
    || value.modelId !== record.provider.modelId
  ) {
    return frozenMerge('rejected', 'identity-mismatch', record);
  }
  const nowMs = Date.parse(now);
  if (Date.parse(value.observedAt) > nowMs || Date.parse(value.expiresAt) <= nowMs) {
    return frozenMerge('stale', 'stale-snapshot', withUnknownCapabilities(record, value));
  }

  const replacements = new Map(value.capabilities.map((capability) => [capability.name, capability]));
  const capabilities = record.provider.capabilities.map(
    (capability) => replacements.get(capability.name) ?? capability,
  );
  for (const capability of value.capabilities) {
    if (!capabilities.some((current) => current.name === capability.name)) {
      capabilities.push(capability);
    }
  }
  const merged = deepFreeze(structuredClone({
    ...record,
    capabilityEvidence: {
      sourceUrl: value.sourceUrl,
      observedAt: value.observedAt,
      expiresAt: value.expiresAt,
    },
    provider: { ...record.provider, capabilities },
  }));
  return frozenMerge('applied', 'applied', merged);
}

function validateFamilyCompatibility(
  input: Record<string, unknown>,
  provider: ProviderModelRecord['provider'],
  issues: ValidationIssue[],
): void {
  const compatible = (input.family === ProviderFamilies.OPENCODE_GO
      && provider.deploymentMode === 'hosted'
      && provider.protocol === ProviderProtocols.OPENAI_CHAT_COMPLETIONS)
    || (input.family === ProviderFamilies.GENERIC_HOSTED
      && provider.deploymentMode === 'hosted'
      && provider.protocol === ProviderProtocols.OPENAI_CHAT_COMPLETIONS)
    || (input.family === ProviderFamilies.OLLAMA
      && provider.deploymentMode === 'local'
      && provider.protocol === ProviderProtocols.OLLAMA_NATIVE)
    || (input.family === ProviderFamilies.LLAMA_CPP
      && provider.deploymentMode === 'local'
      && provider.protocol === ProviderProtocols.LLAMA_CPP_OPENAI);
  requireValue(compatible, '$.family', 'protocol_family', issues);
}

function validateCost(input: unknown, issues: ValidationIssue[]): void {
  if (!isRecord(input)) {
    issues.push(issue('$.cost', 'type', 'Cost record must be an object.'));
    return;
  }
  rejectUnknownKeys(input, COST_KEYS, '$.cost', issues);
  const known = input.state === 'known';
  requireValue(known || input.state === 'unknown', '$.cost.state', 'enum', issues);
  requireValue(input.currency === 'USD', '$.cost.currency', 'enum', issues);
  validateNullableAmount(input.inputPerMillionTokens, known, '$.cost.inputPerMillionTokens', issues);
  validateNullableAmount(input.outputPerMillionTokens, known, '$.cost.outputPerMillionTokens', issues);
  validateDatedSource(input, '$.cost', issues);
}

function validateCapabilityEvidence(input: unknown, issues: ValidationIssue[]): void {
  if (!isRecord(input)) {
    issues.push(issue('$.capabilityEvidence', 'type', 'Capability evidence must be an object.'));
    return;
  }
  rejectUnknownKeys(
    input,
    ['sourceUrl', 'observedAt', 'expiresAt'],
    '$.capabilityEvidence',
    issues,
  );
  validateDatedSource(input, '$.capabilityEvidence', issues);
  requireValue(typeof input.expiresAt === 'string', '$.capabilityEvidence.expiresAt', 'date', issues);
}

function validatePrivacyFacts(input: unknown, issues: ValidationIssue[]): void {
  if (!Array.isArray(input)) {
    issues.push(issue('$.privacyFacts', 'type', 'Privacy facts must be an array.'));
    return;
  }
  const requiredNames = Object.values(ProviderPrivacyFactNames);
  const seen = new Set<string>();
  for (const [index, value] of input.entries()) {
    const path = `$.privacyFacts[${index}]`;
    if (!isRecord(value)) {
      issues.push(issue(path, 'type', 'Privacy fact must be an object.'));
      continue;
    }
    rejectUnknownKeys(value, FACT_KEYS, path, issues);
    requireValue(requiredNames.includes(value.name as never), `${path}.name`, 'enum', issues);
    if (typeof value.name === 'string') {
      requireValue(!seen.has(value.name), `${path}.name`, 'duplicate', issues);
      seen.add(value.name);
    }
    const known = value.state === 'known';
    requireValue(known || value.state === 'unknown', `${path}.state`, 'enum', issues);
    requireValue(
      known
        ? typeof value.value === 'string' && value.value.length > 0
        : value.value === null,
      `${path}.value`,
      'fact_state',
      issues,
    );
    requireValue(
      known
        ? value.confidence === ConfidenceStates.CONFIRMED
          || value.confidence === ConfidenceStates.INFERRED
        : value.confidence === ConfidenceStates.UNKNOWN,
      `${path}.confidence`,
      'fact_state',
      issues,
    );
    validateDatedSource(value, path, issues);
  }
  for (const name of requiredNames) {
    requireValue(seen.has(name), '$.privacyFacts', 'coverage', issues);
  }
}

function validateSnapshot(input: unknown): ValidationResult<ProviderCapabilitySnapshot> {
  const issues: ValidationIssue[] = [];
  if (!isRecord(input)) {
    return failure(input, [issue('$', 'type', 'Capability snapshot must be an object.')]);
  }
  rejectUnknownKeys(
    input,
    ['providerId', 'modelId', 'sourceUrl', 'observedAt', 'expiresAt', 'capabilities'],
    '$',
    issues,
  );
  requireValue(typeof input.providerId === 'string' && input.providerId.length > 0, '$.providerId', 'type', issues);
  requireValue(typeof input.modelId === 'string' && input.modelId.length > 0, '$.modelId', 'type', issues);
  requireValue(typeof input.sourceUrl === 'string' && isHttpUrl(input.sourceUrl), '$.sourceUrl', 'url', issues);
  requireValue(isIsoDate(input.observedAt), '$.observedAt', 'date', issues);
  requireValue(isIsoDate(input.expiresAt), '$.expiresAt', 'date', issues);
  const capabilities = parseCapabilities(input.capabilities, issues);
  if (isIsoDate(input.observedAt) && isIsoDate(input.expiresAt)) {
    requireValue(Date.parse(input.expiresAt) > Date.parse(input.observedAt), '$.expiresAt', 'date_order', issues);
  }
  if (issues.length > 0 || capabilities === null) {
    return failure(input, issues);
  }
  return { success: true, value: { ...input, capabilities } as ProviderCapabilitySnapshot };
}

function parseCapabilities(input: unknown, issues: ValidationIssue[]): readonly ProviderCapability[] | null {
  if (!Array.isArray(input) || input.length === 0) {
    issues.push(issue('$.capabilities', 'type', 'Capabilities must be a non-empty array.'));
    return null;
  }
  const names = Object.values(ProviderCapabilityNames);
  const seen = new Set<string>();
  for (const [index, value] of input.entries()) {
    const path = `$.capabilities[${index}]`;
    if (!isRecord(value)) {
      issues.push(issue(path, 'type', 'Capability must be an object.'));
      continue;
    }
    rejectUnknownKeys(value, ['name', 'state', 'confidence'], path, issues);
    requireValue(names.includes(value.name as never), `${path}.name`, 'enum', issues);
    requireValue(value.state === 'yes' || value.state === 'no' || value.state === 'unknown', `${path}.state`, 'enum', issues);
    requireValue(Object.values(ConfidenceStates).includes(value.confidence as never), `${path}.confidence`, 'enum', issues);
    if (typeof value.name === 'string') {
      requireValue(!seen.has(value.name), `${path}.name`, 'duplicate', issues);
      seen.add(value.name);
    }
  }
  return input as readonly ProviderCapability[];
}

function withUnknownCapabilities(
  record: ProviderModelRecord,
  snapshot: ProviderCapabilitySnapshot,
): ProviderModelRecord {
  return deepFreeze(structuredClone({
    ...record,
    capabilityEvidence: {
      sourceUrl: snapshot.sourceUrl,
      observedAt: snapshot.observedAt,
      expiresAt: snapshot.expiresAt,
    },
    provider: {
      ...record.provider,
      capabilities: record.provider.capabilities.map((capability) => ({
        ...capability,
        state: 'unknown' as const,
        confidence: 'unknown' as const,
      })),
    },
  }));
}

function validateDatedSource(
  input: Record<string, unknown>,
  path: string,
  issues: ValidationIssue[],
): void {
  requireValue(typeof input.sourceUrl === 'string' && isHttpUrl(input.sourceUrl), `${path}.sourceUrl`, 'url', issues);
  requireValue(isIsoDate(input.observedAt), `${path}.observedAt`, 'date', issues);
  requireValue(input.expiresAt === null || isIsoDate(input.expiresAt), `${path}.expiresAt`, 'date', issues);
  if (isIsoDate(input.observedAt) && isIsoDate(input.expiresAt)) {
    requireValue(Date.parse(input.expiresAt) > Date.parse(input.observedAt), `${path}.expiresAt`, 'date_order', issues);
  }
}

function validateNullableAmount(
  value: unknown,
  known: boolean,
  path: string,
  issues: ValidationIssue[],
): void {
  requireValue(
    known
      ? typeof value === 'number' && Number.isFinite(value) && value >= 0
      : value === null,
    path,
    'cost_state',
    issues,
  );
}

function frozenMerge(
  status: ProviderCapabilityMerge['status'],
  reasonCode: ProviderCapabilityMerge['reasonCode'],
  record: ProviderModelRecord,
): ProviderCapabilityMerge {
  return deepFreeze({ status, reasonCode, record: deepFreeze(structuredClone(record)) });
}

function rejectUnknownKeys(
  input: Record<string, unknown>,
  keys: readonly string[],
  path: string,
  issues: ValidationIssue[],
): void {
  for (const key of Object.keys(input)) {
    if (!keys.includes(key)) {
      issues.push(issue(`${path}.${key}`, 'unknown_key', 'Field is not permitted at this boundary.'));
    }
  }
}

function requireInteger(
  value: unknown,
  minimum: number,
  maximum: number,
  path: string,
  issues: ValidationIssue[],
): void {
  requireValue(
    typeof value === 'number'
      && Number.isSafeInteger(value)
      && value >= minimum
      && value <= maximum,
    path,
    'range',
    issues,
  );
}

function requireValue(
  condition: boolean,
  path: string,
  code: string,
  issues: ValidationIssue[],
): void {
  if (!condition) {
    issues.push(issue(path, code, 'Value is not valid for this boundary.'));
  }
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error: unknown) {
    return false;
  }
}

function issue(path: string, code: string, message: string): ValidationIssue {
  return { path, code, message };
}

function failure(input: unknown, issues: readonly ValidationIssue[]): ValidationResult<never> {
  return { success: false, issues: Object.freeze([...issues]), originalInput: input };
}
