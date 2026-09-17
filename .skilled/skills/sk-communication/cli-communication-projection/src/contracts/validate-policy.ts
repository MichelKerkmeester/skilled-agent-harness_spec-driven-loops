// ───────────────────────────────────────────────────────────────────
// MODULE: Context, Prompt, Provider, and Projection Validators
// ───────────────────────────────────────────────────────────────────

import { ConfidenceStates, ContractKinds, RuntimeIds } from './common.js';
import {
  ContextAbsentReasons,
  PrivacyClasses,
  PrivacyReasonCodes,
} from './context.js';
import { ProjectionReasonCodes } from './projection.js';
import { ProviderCapabilityNames, ProviderProtocols } from './provider.js';
import { UnsupportedControlBehaviors } from './prompt.js';
import {
  ValidationCollector,
  expectEnum,
  expectIsoDate,
  expectNonNegativeInteger,
  expectNullableString,
  expectNumber,
  expectRecord,
  expectString,
  validateHeader,
} from './validator-utils.js';

import type { BoundedContextRecord, PrivacyDecision } from './context.js';
import type { ProjectionOutcome } from './projection.js';
import type { PromptProfileRecord } from './prompt.js';
import type { ProviderRecord } from './provider.js';
import type { ValidationResult } from './common.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const CREDENTIAL_REFERENCE_PATTERN = /^(?:env|keychain|managed|none):[A-Za-z0-9._-]+$/;

// ───────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Validate one privacy routing decision. */
export function validatePrivacyDecision(input: unknown): ValidationResult<PrivacyDecision> {
  const collector = new ValidationCollector();
  collectPrivacyDecision(input, '$', collector);
  return collector.result(input);
}

/** Validate bounded context, freshness, privacy, and absent-context behavior. */
export function validateBoundedContext(
  input: unknown,
): ValidationResult<BoundedContextRecord> {
  const collector = new ValidationCollector();
  const record = expectRecord(input, '$', collector);
  if (record === null) {
    return collector.result(input);
  }

  validateHeader(record, ContractKinds.BOUNDED_CONTEXT, '$', collector);
  expectString(record, 'contextId', '$', collector);
  const outcome = expectEnum(record, 'outcome', ['absent', 'present'], '$', collector);
  expectEnum(
    record,
    'noContextFallback',
    ['exact-original', 'rewrite-without-context'],
    '$',
    collector,
  );
  validateSelectedMessage(record.selectedMessage, outcome, collector);
  validateTruncation(record.truncation, collector);
  const privacy = collectPrivacyDecision(record.privacy, '$.privacy', collector);
  const freshness = validateFreshness(record.transcriptFreshness, collector);

  const absentReason = record.absentReason;
  collector.require(
    outcome === 'present'
      ? absentReason === null
      : typeof absentReason === 'string'
        && Object.values(ContextAbsentReasons).includes(
          absentReason as typeof ContextAbsentReasons[keyof typeof ContextAbsentReasons],
        ),
    '$.absentReason',
    'context_state',
    'Present context requires null; absent context requires a known reason.',
  );
  if (outcome === 'present') {
    collector.require(
      privacy?.decision === 'allow',
      '$.privacy.decision',
      'privacy_boundary',
      'Present context requires an allowed privacy decision.',
    );
    collector.require(
      freshness === 'fresh',
      '$.transcriptFreshness.state',
      'freshness',
      'Present context requires a fresh transcript.',
    );
  }
  if (privacy?.decision === 'deny' || absentReason === ContextAbsentReasons.PRIVACY_DENIED) {
    collector.require(
      outcome === 'absent'
        && absentReason === ContextAbsentReasons.PRIVACY_DENIED
        && privacy?.decision === 'deny',
      '$.absentReason',
      'privacy_boundary',
      'Privacy denial requires an absent context with the privacy-denied reason.',
    );
  }
  if (freshness === 'stale' || absentReason === ContextAbsentReasons.STALE_TRANSCRIPT) {
    collector.require(
      outcome === 'absent'
        && absentReason === ContextAbsentReasons.STALE_TRANSCRIPT
        && freshness === 'stale',
      '$.absentReason',
      'freshness',
      'A stale transcript requires an absent context with the stale-transcript reason.',
    );
  }

  return collector.result(input);
}

/** Validate a versioned copy-editing prompt and its provider mappings. */
export function validatePromptProfile(
  input: unknown,
): ValidationResult<PromptProfileRecord> {
  const collector = new ValidationCollector();
  const record = expectRecord(input, '$', collector);
  if (record === null) {
    return collector.result(input);
  }

  validateHeader(record, ContractKinds.PROMPT_PROFILE, '$', collector);
  expectString(record, 'promptVersion', '$', collector);
  expectString(record, 'systemInstruction', '$', collector);
  expectEnum(record, 'copyEditingScope', ['assistant-message-only'], '$', collector);
  expectString(record, 'protectedValuePolicyVersion', '$', collector);
  expectNumber(record, 'temperature', '$', collector, 0, 2);
  expectEnum(
    record,
    'thinkingMode',
    ['disabled', 'enabled', 'provider-default'],
    '$',
    collector,
  );
  expectEnum(
    record,
    'unsupportedControlBehavior',
    Object.values(UnsupportedControlBehaviors),
    '$',
    collector,
  );

  collector.require(
    Array.isArray(record.providerControlMappings),
    '$.providerControlMappings',
    'type',
    'Expected an array of provider-control mappings.',
  );
  if (Array.isArray(record.providerControlMappings)) {
    collector.require(
      record.providerControlMappings.length > 0,
      '$.providerControlMappings',
      'coverage',
      'At least one provider-control mapping is required.',
    );
    const mappings = new Set<string>();
    for (const [index, mappingValue] of record.providerControlMappings.entries()) {
      const path = `$.providerControlMappings[${index}]`;
      const mapping = expectRecord(mappingValue, path, collector);
      if (mapping === null) {
        continue;
      }
      const providerId = expectString(mapping, 'providerId', path, collector);
      const modelPattern = expectString(mapping, 'modelPattern', path, collector);
      const control = expectEnum(
        mapping,
        'control',
        ['temperature', 'thinking'],
        path,
        collector,
      );
      expectNullableString(mapping, 'wireField', path, collector);
      const support = expectEnum(
        mapping,
        'support',
        ['no', 'unknown', 'yes'],
        path,
        collector,
      );
      expectEnum(mapping, 'confidence', Object.values(ConfidenceStates), path, collector);
      if (support === 'yes') {
        collector.require(
          typeof mapping.wireField === 'string' && mapping.wireField.length > 0,
          `${path}.wireField`,
          'control_mapping',
          'Supported controls require a non-empty wire field.',
        );
      } else if (support === 'no') {
        collector.require(
          mapping.wireField === null,
          `${path}.wireField`,
          'control_mapping',
          'Unsupported controls cannot declare a wire field.',
        );
      }
      if (providerId !== null && modelPattern !== null && control !== null) {
        const key = JSON.stringify([providerId, modelPattern, control]);
        collector.require(
          !mappings.has(key),
          path,
          'duplicate',
          'Provider-control mappings must be unique.',
        );
        mappings.add(key);
      }
    }
  }

  return collector.result(input);
}

/** Validate a model-specific provider and privacy record. */
export function validateProviderRecord(input: unknown): ValidationResult<ProviderRecord> {
  const collector = new ValidationCollector();
  const record = expectRecord(input, '$', collector);
  if (record === null) {
    return collector.result(input);
  }

  validateHeader(record, ContractKinds.PROVIDER, '$', collector);
  expectString(record, 'providerId', '$', collector);
  const deployment = expectEnum(record, 'deploymentMode', ['hosted', 'local'], '$', collector);
  expectEnum(record, 'protocol', Object.values(ProviderProtocols), '$', collector);
  const endpoint = expectString(record, 'endpoint', '$', collector);
  if (endpoint !== null) {
    collector.require(isHttpUrl(endpoint), '$.endpoint', 'url', 'Expected an HTTP or HTTPS URL.');
  }
  expectString(record, 'modelId', '$', collector);
  const credentialReference = expectString(record, 'credentialReference', '$', collector);
  if (credentialReference !== null) {
    collector.require(
      CREDENTIAL_REFERENCE_PATTERN.test(credentialReference),
      '$.credentialReference',
      'credential_reference',
      'Credentials must be represented by an opaque reference, never a value.',
    );
  }
  expectString(record, 'providerVersion', '$', collector);
  const privacyClass = expectEnum(
    record,
    'privacyClass',
    Object.values(PrivacyClasses),
    '$',
    collector,
  );
  expectIsoDate(record, 'termsCheckedAt', '$', collector, true);
  expectIsoDate(record, 'termsExpiresAt', '$', collector, true);
  validateCapabilities(record.capabilities, collector);
  validateFallbackPolicy(record.fallbackPolicy, collector);

  if (deployment === 'local' && privacyClass !== null) {
    collector.require(
      privacyClass === PrivacyClasses.LOCAL_NETWORKED
        || privacyClass === PrivacyClasses.LOCAL_OFFLINE,
      '$.privacyClass',
      'privacy_boundary',
      'Local deployments require a local privacy class.',
    );
  }
  if (deployment === 'hosted' && privacyClass !== null) {
    collector.require(
      privacyClass === PrivacyClasses.HOSTED_RETAINED
        || privacyClass === PrivacyClasses.HOSTED_ZDR
        || privacyClass === PrivacyClasses.UNKNOWN,
      '$.privacyClass',
      'privacy_boundary',
      'Hosted deployments cannot claim a local privacy class.',
    );
  }

  return collector.result(input);
}

/** Validate candidate, accepted, rejected, and exact-original outcomes. */
export function validateProjectionOutcome(
  input: unknown,
): ValidationResult<ProjectionOutcome> {
  const collector = new ValidationCollector();
  const record = expectRecord(input, '$', collector);
  if (record === null) {
    return collector.result(input);
  }

  validateHeader(record, ContractKinds.PROJECTION, '$', collector);
  expectString(record, 'projectionId', '$', collector);
  expectString(record, 'originalId', '$', collector);
  expectEnum(record, 'runtime', Object.values(RuntimeIds), '$', collector);
  expectString(record, 'promptVersion', '$', collector);
  const status = expectEnum(
    record,
    'status',
    ['accepted', 'candidate', 'exact-original', 'rejected'],
    '$',
    collector,
  );

  if (status === 'candidate') {
    expectString(record, 'projectedTextId', '$', collector);
    expectString(record, 'providerId', '$', collector);
    expectString(record, 'modelId', '$', collector);
  } else if (status === 'accepted') {
    expectString(record, 'projectedTextId', '$', collector);
    expectString(record, 'validationProfileVersion', '$', collector);
  } else if (status === 'rejected') {
    expectEnum(record, 'reasonCode', Object.values(ProjectionReasonCodes), '$', collector);
    expectNullableString(record, 'rejectedCandidateId', '$', collector);
  } else if (status === 'exact-original') {
    expectEnum(record, 'reasonCode', Object.values(ProjectionReasonCodes), '$', collector);
  }

  return collector.result(input);
}

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function collectPrivacyDecision(
  value: unknown,
  path: string,
  collector: ValidationCollector,
): Record<string, unknown> | null {
  const record = expectRecord(value, path, collector);
  if (record === null) {
    return null;
  }

  validateHeader(record, ContractKinds.PRIVACY_DECISION, path, collector);
  expectEnum(record, 'privacyClass', Object.values(PrivacyClasses), path, collector);
  const route = expectEnum(record, 'route', ['hosted', 'local'], path, collector);
  const decision = expectEnum(record, 'decision', ['allow', 'deny'], path, collector);
  expectEnum(record, 'reasonCode', Object.values(PrivacyReasonCodes), path, collector);
  collector.require(
    typeof record.egressConsent === 'boolean',
    `${path}.egressConsent`,
    'type',
    'Expected a boolean egress-consent decision.',
  );
  if (route === 'hosted' && decision === 'allow') {
    collector.require(
      record.egressConsent === true,
      `${path}.egressConsent`,
      'egress_consent',
      'Hosted routes require explicit egress consent.',
    );
  }
  return record;
}

function validateSelectedMessage(
  value: unknown,
  outcome: string | null,
  collector: ValidationCollector,
): void {
  if (outcome === 'absent') {
    collector.require(
      value === null,
      '$.selectedMessage',
      'context_state',
      'Absent context cannot carry a selected message.',
    );
    return;
  }

  const record = expectRecord(value, '$.selectedMessage', collector);
  if (record === null) {
    return;
  }
  expectString(record, 'messageId', '$.selectedMessage', collector);
  expectEnum(record, 'role', ['user'], '$.selectedMessage', collector);
  collector.require(
    record.isMeta === false,
    '$.selectedMessage.isMeta',
    'meta',
    'Selected rewrite context must be a non-meta user message.',
  );
  expectString(record, 'textOriginalId', '$.selectedMessage', collector);
}

function validateTruncation(value: unknown, collector: ValidationCollector): void {
  const record = expectRecord(value, '$.truncation', collector);
  if (record === null) {
    return;
  }
  expectEnum(record, 'unit', ['bytes', 'codepoints', 'tokens'], '$.truncation', collector);
  const limit = expectNonNegativeInteger(record, 'limit', '$.truncation', collector);
  const original = expectNonNegativeInteger(record, 'originalUnits', '$.truncation', collector);
  const selected = expectNonNegativeInteger(record, 'selectedUnits', '$.truncation', collector);
  collector.require(
    typeof record.wasTruncated === 'boolean',
    '$.truncation.wasTruncated',
    'type',
    'Expected a boolean truncation result.',
  );
  if (limit !== null && selected !== null) {
    collector.require(
      selected <= limit,
      '$.truncation.selectedUnits',
      'limit',
      'Selected units exceed the limit.',
    );
  }
  if (original !== null && selected !== null && typeof record.wasTruncated === 'boolean') {
    collector.require(
      record.wasTruncated === (selected < original),
      '$.truncation.wasTruncated',
      'truncation_state',
      'Truncation flag must match the observed unit counts.',
    );
  }
}

function validateFreshness(value: unknown, collector: ValidationCollector): string | null {
  const record = expectRecord(value, '$.transcriptFreshness', collector);
  if (record === null) {
    return null;
  }
  const state = expectEnum(
    record,
    'state',
    ['fresh', 'stale', 'unknown'],
    '$.transcriptFreshness',
    collector,
  );
  expectIsoDate(record, 'observedAt', '$.transcriptFreshness', collector);
  expectNonNegativeInteger(record, 'maximumAgeMs', '$.transcriptFreshness', collector);
  return state;
}

function validateCapabilities(value: unknown, collector: ValidationCollector): void {
  collector.require(Array.isArray(value), '$.capabilities', 'type', 'Expected a capability array.');
  if (!Array.isArray(value)) {
    return;
  }
  const seen = new Set<string>();
  for (const [index, capabilityValue] of value.entries()) {
    const path = `$.capabilities[${index}]`;
    const capability = expectRecord(capabilityValue, path, collector);
    if (capability === null) {
      continue;
    }
    const name = expectEnum(
      capability,
      'name',
      Object.values(ProviderCapabilityNames),
      path,
      collector,
    );
    expectEnum(capability, 'state', ['no', 'unknown', 'yes'], path, collector);
    expectEnum(capability, 'confidence', Object.values(ConfidenceStates), path, collector);
    if (name !== null) {
      collector.require(
        !seen.has(name),
        `${path}.name`,
        'duplicate',
        'Capability names must be unique.',
      );
      seen.add(name);
    }
  }
}

function validateFallbackPolicy(value: unknown, collector: ValidationCollector): void {
  const record = expectRecord(value, '$.fallbackPolicy', collector);
  if (record === null) {
    return;
  }
  const mode = expectEnum(record, 'mode', ['explicit-list', 'none'], '$.fallbackPolicy', collector);
  collector.require(
    Array.isArray(record.providerIds)
      && record.providerIds.every(
        (providerId) => typeof providerId === 'string' && providerId.length > 0,
      ),
    '$.fallbackPolicy.providerIds',
    'type',
    'Expected an array of provider identifiers.',
  );
  if (mode === 'none' && Array.isArray(record.providerIds)) {
    collector.require(
      record.providerIds.length === 0,
      '$.fallbackPolicy.providerIds',
      'fallback_policy',
      'No-fallback policy requires an empty provider list.',
    );
  }
  collector.require(
    typeof record.preservePrivacyClass === 'boolean',
    '$.fallbackPolicy.preservePrivacyClass',
    'type',
    'Expected a boolean privacy-preservation policy.',
  );
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error: unknown) {
    return false;
  }
}
