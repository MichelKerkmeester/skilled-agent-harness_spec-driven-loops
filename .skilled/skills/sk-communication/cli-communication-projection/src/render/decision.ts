// ───────────────────────────────────────────────────────────────────
// MODULE: Capability-Aware Render Decision
// ───────────────────────────────────────────────────────────────────

import { createSha256Digest } from '../contracts/exact-original.js';
import { validateExactOriginal } from '../contracts/validate-event.js';
import { isRecord } from '../contracts/validator-utils.js';
import { deepFreeze } from '../fidelity/freeze.js';
import {
  RenderModes,
  RenderReasonCodes,
} from './types.js';

import type {
  ExactOriginalRenderDecision,
  RenderCapabilities,
  RenderDecision,
  RenderDecisionInput,
  RenderMode,
} from './types.js';

const INPUT_KEYS = [
  'validation',
  'currentSourceSha256',
  'sourceTerminal',
  'allPartsComplete',
  'capabilities',
  'preferredModes',
] as const;
const CAPABILITY_KEYS = ['atomicReplace', 'appendAfterOriginal', 'sidecar'] as const;
const SOURCE_TERMINALS = ['cancelled', 'completed', 'error', 'timeout'] as const;
const DEFAULT_MODE_PREFERENCE: readonly RenderMode[] = Object.freeze([
  RenderModes.ATOMIC_REPLACE,
  RenderModes.APPEND_AFTER_ORIGINAL,
  RenderModes.SIDECAR,
]);
const SHA256_PATTERN = /^sha256:[a-f0-9]{64}$/u;

/** Select one display mode without changing the canonical source or validation result. */
export function decideRender(input: RenderDecisionInput): RenderDecision {
  if (!isRecord(input) || !isRecord(input.validation)) {
    throw new TypeError('Render input did not contain a valid exact original.');
  }
  const exactResult = validateExactOriginal(input.validation.exactOriginal);
  if (!exactResult.success) {
    throw new TypeError('Render input did not contain a valid exact original.');
  }
  const exactOriginal = exactResult.value;

  if (!isValidInput(input)) {
    return originalDecision(input, RenderReasonCodes.INVALID_INPUT);
  }
  if (input.currentSourceSha256 !== input.validation.sourceSha256) {
    return originalDecision(input, RenderReasonCodes.SOURCE_CHANGED);
  }
  if (input.sourceTerminal !== 'completed' || !input.allPartsComplete) {
    return originalDecision(input, RenderReasonCodes.INCOMPLETE_SOURCE);
  }
  if (input.validation.status !== 'accepted') {
    return originalDecision(input, RenderReasonCodes.VALIDATION_REJECTED);
  }

  const projectionBytes = new TextEncoder().encode(input.validation.projectionText);
  if (
    projectionBytes.byteLength !== input.validation.projectionByteLength
    || createSha256Digest(projectionBytes) !== input.validation.projectionSha256
    || exactOriginal.sha256 !== input.validation.sourceSha256
  ) {
    return originalDecision(input, RenderReasonCodes.INVALID_INPUT);
  }

  const preferences = input.preferredModes ?? DEFAULT_MODE_PREFERENCE;
  const mode = preferences.find((candidate) => isModeSupported(candidate, input.capabilities));
  if (mode === undefined) {
    return originalDecision(input, RenderReasonCodes.UNSUPPORTED_MODE);
  }
  if (mode === RenderModes.EXACT_ORIGINAL_ONLY) {
    return originalDecision(input, RenderReasonCodes.ORIGINAL_SELECTED);
  }

  return deepFreeze({
    status: 'projection',
    mode,
    reasonCode: RenderReasonCodes.PROJECTION_ACCEPTED,
    renderProfileVersion: 'render/1.0.0',
    sourceSha256: input.validation.sourceSha256,
    exactOriginal,
    projectionSha256: input.validation.projectionSha256,
    projectionText: input.validation.projectionText,
  });
}

function isValidInput(input: RenderDecisionInput): boolean {
  if (!isRecord(input)) {
    return false;
  }
  if (Object.keys(input).some((key) => !(INPUT_KEYS as readonly string[]).includes(key))) {
    return false;
  }
  if (
    typeof input.currentSourceSha256 !== 'string'
    || !SHA256_PATTERN.test(input.currentSourceSha256)
    || typeof input.allPartsComplete !== 'boolean'
    || typeof input.sourceTerminal !== 'string'
    || !(SOURCE_TERMINALS as readonly string[]).includes(input.sourceTerminal)
  ) {
    return false;
  }
  if (!isRecord(input.capabilities)) {
    return false;
  }
  if (
    Object.keys(input.capabilities)
      .some((key) => !(CAPABILITY_KEYS as readonly string[]).includes(key))
    || CAPABILITY_KEYS.some((key) => typeof input.capabilities[key] !== 'boolean')
  ) {
    return false;
  }
  if (input.preferredModes !== undefined) {
    if (
      !Array.isArray(input.preferredModes)
      || input.preferredModes.length === 0
      || input.preferredModes.some((mode) => !isRenderMode(mode))
      || new Set(input.preferredModes).size !== input.preferredModes.length
    ) {
      return false;
    }
  }
  return isValidValidationShape(input);
}

function isValidValidationShape(input: RenderDecisionInput): boolean {
  const validation = input.validation;
  if (!isRecord(validation)) {
    return false;
  }
  if (
    validation.sourceSha256 !== validation.exactOriginal.sha256
    || typeof validation.validationProfileVersion !== 'string'
    || validation.validationProfileVersion !== 'fidelity/1.0.0'
  ) {
    return false;
  }
  if (validation.status === 'accepted') {
    return validation.reasonCode === 'accepted'
      && typeof validation.projectionText === 'string'
      && typeof validation.projectionSha256 === 'string'
      && SHA256_PATTERN.test(validation.projectionSha256)
      && typeof validation.projectionByteLength === 'number'
      && Number.isInteger(validation.projectionByteLength)
      && validation.projectionByteLength >= 0;
  }
  return validation.status === 'exact-original'
    && validation.projectionText === null
    && validation.projectionSha256 === null
    && validation.projectionByteLength === validation.exactOriginal.byteLength;
}

function isRenderMode(value: unknown): value is RenderMode {
  return typeof value === 'string'
    && (Object.values(RenderModes) as readonly string[]).includes(value);
}

function isModeSupported(mode: RenderMode, capabilities: RenderCapabilities): boolean {
  switch (mode) {
    case RenderModes.ATOMIC_REPLACE:
      return capabilities.atomicReplace;
    case RenderModes.APPEND_AFTER_ORIGINAL:
      return capabilities.appendAfterOriginal;
    case RenderModes.SIDECAR:
      return capabilities.sidecar;
    case RenderModes.EXACT_ORIGINAL_ONLY:
      return true;
  }
}

function originalDecision(
  input: RenderDecisionInput,
  reasonCode: ExactOriginalRenderDecision['reasonCode'],
): ExactOriginalRenderDecision {
  return deepFreeze({
    status: 'exact-original',
    mode: RenderModes.EXACT_ORIGINAL_ONLY,
    reasonCode,
    renderProfileVersion: 'render/1.0.0',
    sourceSha256: input.validation.sourceSha256,
    exactOriginal: input.validation.exactOriginal,
    projectionSha256: null,
    projectionText: null,
  });
}
