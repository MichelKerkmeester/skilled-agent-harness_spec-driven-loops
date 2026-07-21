// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Invocation Fingerprint Verification
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

import {
  canonicalBytes,
  immutableJsonClone,
  sha256Bytes,
} from '../event-envelope/canonical-json.js';
import {
  DispatchReceiptError,
  DispatchReceiptErrorCodes,
} from './errors.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  DispatchEffectiveConfig,
  ResolvedAdapterInvocation,
  VerifiedLaunchFacts,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const INVOCATION_FINGERPRINT_VERSION = 1;
export const INVOCATION_FINGERPRINT_ALGORITHM = 'sha256-over-json-stringify-v1';
export const INVOCATION_FINGERPRINT_NAMESPACE = 'phase-005-resolved-invocation';

const EFFECTIVE_CONFIG_FIELDS = new Set([
  'executable',
  'executableVersion',
  'kind',
  'model',
  'permissionMode',
  'reasoningEffort',
  'sandboxMode',
  'serviceTier',
  'webSearch',
]);
const INVOCATION_FINGERPRINT_PATTERN = /^inv:[a-f0-9]{64}$/;

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function digestText(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

function requireNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '' || value.length > 4_096) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.INVALID_INPUT,
      'input',
      'Resolved launch fields must be bounded non-empty strings',
      { field },
    );
  }
  return value;
}

function validateEffectiveConfig(input: unknown): DispatchEffectiveConfig {
  if (input === null || Array.isArray(input) || typeof input !== 'object') {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.INVALID_INPUT,
      'input',
      'Resolved effective configuration must be an object',
      { field: 'effectiveConfig' },
    );
  }
  const record = input as Record<string, unknown>;
  const fields = Object.keys(record);
  if (
    fields.length !== EFFECTIVE_CONFIG_FIELDS.size
    || fields.some((field) => !EFFECTIVE_CONFIG_FIELDS.has(field))
  ) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.INVALID_INPUT,
      'input',
      'Resolved effective configuration does not match the safe allowlist',
      { field: 'effectiveConfig' },
    );
  }
  const stringFields = [
    'executable',
    'executableVersion',
    'kind',
    'permissionMode',
    'sandboxMode',
    'webSearch',
  ] as const;
  stringFields.forEach((field) => requireNonEmptyString(record[field], `effectiveConfig.${field}`));
  const nullableFields = ['model', 'reasoningEffort', 'serviceTier'] as const;
  if (nullableFields.some((field) => !isNullableString(record[field]))) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.INVALID_INPUT,
      'input',
      'Optional effective configuration fields must be strings or null',
      { field: 'effectiveConfig' },
    );
  }
  return immutableJsonClone(record as JsonObject) as DispatchEffectiveConfig;
}

function validatePromptArgIndexes(
  args: readonly string[],
  prompt: string,
  input: readonly number[],
): ReadonlySet<number> {
  const indexes = new Set<number>();
  for (const index of input) {
    if (
      !Number.isSafeInteger(index)
      || index < 0
      || index >= args.length
      || indexes.has(index)
      || args[index] !== prompt
    ) {
      throw new DispatchReceiptError(
        DispatchReceiptErrorCodes.INVALID_INPUT,
        'input',
        'Prompt argument indexes must identify exact resolved prompt arguments',
        { field: 'promptArgIndexes' },
      );
    }
    indexes.add(index);
  }
  return indexes;
}

function fingerprintPayload(
  invocation: ResolvedAdapterInvocation,
  effectiveConfig: DispatchEffectiveConfig,
): JsonObject {
  const promptDigest = digestText(invocation.prompt);
  const promptArgIndexes = validatePromptArgIndexes(
    invocation.args,
    invocation.prompt,
    invocation.promptArgIndexes,
  );
  const argv = invocation.args.map((argument, index) => (
    promptArgIndexes.has(index) ? `<prompt:${promptDigest}>` : argument
  ));

  // Property order is part of the producing adapter's version-one byte contract.
  return {
    kind: effectiveConfig.kind,
    executable: invocation.command,
    executableVersion: effectiveConfig.executableVersion,
    model: effectiveConfig.model,
    effort: effectiveConfig.reasoningEffort,
    tier: effectiveConfig.serviceTier,
    sandboxPosture: {
      sandboxMode: effectiveConfig.sandboxMode,
      permissionMode: effectiveConfig.permissionMode,
    },
    webSearch: effectiveConfig.webSearch,
    argv,
    promptDigest,
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Recompute the producing adapter's version-one bytes and retain its original digest unchanged. */
export function verifyAdapterInvocationFingerprint(
  invocation: ResolvedAdapterInvocation,
): VerifiedLaunchFacts {
  requireNonEmptyString(invocation.adapterIdentity, 'adapterIdentity');
  requireNonEmptyString(invocation.adapterVersion, 'adapterVersion');
  requireNonEmptyString(invocation.command, 'command');
  if (
    !Array.isArray(invocation.args)
    || invocation.args.some((argument) => typeof argument !== 'string')
    || typeof invocation.prompt !== 'string'
    || !Array.isArray(invocation.promptArgIndexes)
  ) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.INVALID_INPUT,
      'input',
      'Resolved adapter invocation is incomplete',
    );
  }
  if (!INVOCATION_FINGERPRINT_PATTERN.test(invocation.invocationFingerprint)) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.INVOCATION_FINGERPRINT_CONFLICT,
      'fingerprint',
      'Adapter invocation fingerprint is not a version-one digest',
      { actualFingerprint: invocation.invocationFingerprint.slice(0, 96) },
    );
  }

  const effectiveConfig = validateEffectiveConfig(invocation.effectiveConfig);
  if (
    effectiveConfig.executable !== invocation.command
    || effectiveConfig.kind.trim() === ''
  ) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.INVALID_INPUT,
      'input',
      'Resolved command and effective configuration disagree',
      { field: 'effectiveConfig.executable' },
    );
  }
  const payload = fingerprintPayload(invocation, effectiveConfig);
  const expectedFingerprint = `inv:${digestText(JSON.stringify(payload))}`;
  if (expectedFingerprint !== invocation.invocationFingerprint) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.INVOCATION_FINGERPRINT_CONFLICT,
      'fingerprint',
      'Adapter invocation fingerprint conflicts with independently normalized launch facts',
      {
        actualFingerprint: invocation.invocationFingerprint,
        expectedFingerprint,
      },
    );
  }

  return Object.freeze({
    adapterIdentity: invocation.adapterIdentity,
    adapterVersion: invocation.adapterVersion,
    effectiveConfig,
    effectiveConfigDigest: sha256Bytes(canonicalBytes(effectiveConfig)),
    inputDigest: digestText(invocation.input ?? ''),
    invocationFingerprint: invocation.invocationFingerprint,
    promptDigest: payload.promptDigest as string,
  });
}
