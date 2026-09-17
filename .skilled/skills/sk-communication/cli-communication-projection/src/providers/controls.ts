// ───────────────────────────────────────────────────────────────────
// MODULE: Provider Prompt Control Compilation
// ───────────────────────────────────────────────────────────────────

import { ConfidenceStates } from '../contracts/common.js';
import { ProviderCapabilityNames } from '../contracts/provider.js';
import { validatePromptProfile } from '../contracts/validate-policy.js';
import { deepFreeze } from '../fidelity/freeze.js';

import type { JsonObject, JsonValue } from '../contracts/common.js';
import type { ProviderCapabilityName } from '../contracts/provider.js';
import type { ProviderControlMapping, PromptProfileRecord } from '../contracts/prompt.js';
import type {
  MutableJsonObject,
  ProviderModelRecord,
  UnsupportedProviderRequest,
} from './types.js';

interface CompiledControls {
  readonly status: 'compiled';
  readonly body: JsonObject;
}

export type ControlCompilation = CompiledControls | UnsupportedProviderRequest;

const SAFE_WIRE_SEGMENT = /^[A-Za-z][A-Za-z0-9_]*$/u;
const FORBIDDEN_WIRE_SEGMENTS = new Set(['__proto__', 'constructor', 'prototype']);

/** Compile required prompt controls into an isolated body before transport exists. */
export function compilePromptControls(
  record: ProviderModelRecord,
  prompt: PromptProfileRecord,
  baseBody: MutableJsonObject,
  now: string,
): ControlCompilation {
  const promptResult = validatePromptProfile(prompt);
  if (
    !promptResult.success
    || !hasFreshCapabilityEvidence(record, now)
    || !hasCapability(record, ProviderCapabilityNames.CHAT)
  ) {
    return unsupported('chat');
  }
  const body = structuredClone(baseBody);
  const temperature = findMapping(record, prompt, 'temperature');
  if (
    !isSupportedMapping(temperature)
    || !hasCapability(record, ProviderCapabilityNames.TEMPERATURE_CONTROL)
    || !setWireValue(body, temperature.wireField, prompt.temperature)
  ) {
    return unsupported('temperature');
  }

  if (prompt.thinkingMode !== 'provider-default') {
    const thinking = findMapping(record, prompt, 'thinking');
    if (
      !isSupportedMapping(thinking)
      || !hasCapability(record, ProviderCapabilityNames.THINKING_CONTROL)
      || !setWireValue(
        body,
        thinking.wireField,
        thinkingWireValue(thinking.wireField, prompt.thinkingMode),
      )
    ) {
      return unsupported('thinking');
    }
  }
  return { status: 'compiled', body: deepFreeze(body) };
}

function hasFreshCapabilityEvidence(record: ProviderModelRecord, now: string): boolean {
  const nowMs = Date.parse(now);
  return Number.isFinite(nowMs)
    && Date.parse(record.capabilityEvidence.observedAt) <= nowMs
    && Date.parse(record.capabilityEvidence.expiresAt) > nowMs;
}

function findMapping(
  record: ProviderModelRecord,
  prompt: PromptProfileRecord,
  control: ProviderControlMapping['control'],
): ProviderControlMapping | null {
  const exact = prompt.providerControlMappings.find((mapping) =>
    mapping.control === control
      && matchesProvider(record, mapping.providerId)
      && mapping.modelPattern === record.provider.modelId);
  if (exact !== undefined) {
    return exact;
  }
  return prompt.providerControlMappings.find((mapping) =>
    mapping.control === control
      && matchesProvider(record, mapping.providerId)
      && mapping.modelPattern === '*') ?? null;
}

function matchesProvider(record: ProviderModelRecord, providerId: string): boolean {
  return providerId === record.controlProviderId || providerId === record.provider.providerId;
}

function isSupportedMapping(
  mapping: ProviderControlMapping | null,
): mapping is ProviderControlMapping & { readonly wireField: string } {
  return mapping !== null
    && mapping.support === 'yes'
    && mapping.confidence === ConfidenceStates.CONFIRMED
    && typeof mapping.wireField === 'string'
    && mapping.wireField.length > 0;
}

function hasCapability(
  record: ProviderModelRecord,
  name: ProviderCapabilityName,
): boolean {
  const capability = record.provider.capabilities.find((entry) => entry.name === name);
  return capability?.state === 'yes' && capability.confidence === ConfidenceStates.CONFIRMED;
}

function thinkingWireValue(
  wireField: string,
  mode: Exclude<PromptProfileRecord['thinkingMode'], 'provider-default'>,
): JsonValue {
  if (wireField === 'reasoning_effort') {
    return mode === 'disabled' ? 'none' : 'medium';
  }
  return mode === 'enabled';
}

function setWireValue(
  body: MutableJsonObject,
  wireField: string,
  value: JsonValue,
): boolean {
  const segments = wireField.split('.');
  if (
    segments.length === 0
    || segments.some((segment) =>
      !SAFE_WIRE_SEGMENT.test(segment) || FORBIDDEN_WIRE_SEGMENTS.has(segment))
  ) {
    return false;
  }
  let target = body;
  for (const segment of segments.slice(0, -1)) {
    const current = target[segment];
    if (current === undefined) {
      const child: MutableJsonObject = {};
      target[segment] = child;
      target = child;
    } else if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
      target = current as MutableJsonObject;
    } else {
      return false;
    }
  }
  const last = segments.at(-1);
  if (last === undefined) {
    return false;
  }
  target[last] = value;
  return true;
}

function unsupported(control: UnsupportedProviderRequest['control']): UnsupportedProviderRequest {
  return Object.freeze({
    status: 'unsupported',
    reasonCode: 'unsupported-control',
    control,
  });
}
