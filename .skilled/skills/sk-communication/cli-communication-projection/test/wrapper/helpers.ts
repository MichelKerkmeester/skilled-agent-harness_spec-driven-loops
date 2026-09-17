// ───────────────────────────────────────────────────────────────────
// MODULE: Wrapper Test Helpers
// ───────────────────────────────────────────────────────────────────

import {
  createExactOriginalRecord,
} from '../../src/index.js';
import {
  createContextInput,
  createLocalPolicy,
  createLocalProviderRecord,
  createRuntimePrompt,
} from '../runtime/helpers.js';

import type {
  ExactOriginalRecord,
  FixtureProvenance,
  WrapperProjectionConfig,
} from '../../src/index.js';
import type { ClaudeRuntimeEvent } from '../../src/runtimes/claude.js';
import type { RuntimeEnvelope } from '../../src/runtimes/types.js';

export const WRAPPER_NOW = '2026-08-12T00:00:00.000Z';

const provenance: FixtureProvenance = {
  sourceFamily: 'wrapper-test',
  sourceVersion: '1.0.0',
  captureMethod: 'synthetic',
  sanitizationStatus: 'synthetic',
  capturedAt: WRAPPER_NOW,
};

/** Wrap captured bytes in a deterministic exact-original record. */
export function createWrapperOriginal(
  originalId: string,
  text: string,
): ExactOriginalRecord {
  return createExactOriginalRecord(
    originalId,
    new TextEncoder().encode(text),
    'text/markdown; charset=utf-8',
    provenance,
  );
}

/** A final Claude headless message-display envelope. */
export function createClaudeFinalEnvelope(
  overrides: Partial<RuntimeEnvelope<ClaudeRuntimeEvent>> = {},
): RuntimeEnvelope<ClaudeRuntimeEvent> {
  return {
    envelopeVersion: 'runtime-envelope/1.0.0',
    runtime: 'claude',
    runtimeVersion: '2.1.228',
    protocol: 'claude-headless-stream-json',
    protocolVersion: '1.0.0',
    pathId: 'claude-headless-message-display',
    sessionId: 'session-claude',
    turnId: 'turn-claude',
    messageId: 'message-claude',
    generationId: 'generation-claude',
    attempt: 1,
    capturedAt: WRAPPER_NOW,
    event: {
      type: 'message-display',
      eventId: 'claude-final',
      index: 0,
      final: true,
      sourceTimestamp: null,
    },
    ...overrides,
  };
}

/** A terminal Claude error envelope. */
export function createClaudeErrorEnvelope(): RuntimeEnvelope<ClaudeRuntimeEvent> {
  return {
    envelopeVersion: 'runtime-envelope/1.0.0',
    runtime: 'claude',
    runtimeVersion: '2.1.228',
    protocol: 'claude-headless-stream-json',
    protocolVersion: '1.0.0',
    pathId: 'claude-headless-message-display',
    sessionId: 'session-claude',
    turnId: 'turn-claude',
    messageId: 'message-claude',
    generationId: 'generation-claude',
    attempt: 1,
    capturedAt: WRAPPER_NOW,
    event: {
      type: 'error',
      eventId: 'claude-error',
      index: 0,
      sourceTimestamp: null,
    },
  };
}

/** A projection config backed by a local offline provider. */
export function createWrapperConfig(
  overrides: Partial<WrapperProjectionConfig> = {},
): WrapperProjectionConfig {
  const record = createLocalProviderRecord();
  return {
    context: createContextInput(),
    prompt: createRuntimePrompt(record),
    records: [record],
    candidateProviderIds: [record.provider.providerId],
    policy: createLocalPolicy(),
    judgeMode: 'disabled',
    capabilities: {
      atomicReplace: true,
      appendAfterOriginal: true,
      sidecar: true,
    },
    now: WRAPPER_NOW,
    ...overrides,
  };
}
