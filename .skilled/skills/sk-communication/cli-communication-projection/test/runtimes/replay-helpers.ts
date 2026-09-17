// ───────────────────────────────────────────────────────────────────
// MODULE: Pinned Runtime Replay Test Helpers
// ───────────────────────────────────────────────────────────────────

import {
  ClaudeCapabilityRecords,
  ClaudeRuntimePaths,
  CodexCapabilityRecords,
  CodexRuntimePaths,
  CursorCapabilityRecords,
  CursorRuntimePaths,
  DevinCapabilityRecords,
  DevinRuntimePaths,
  OpenCodeCapabilityRecords,
  OpenCodeRuntimePaths,
  PiCapabilityRecords,
  PiRuntimePaths,
  claudeRuntimeAdapter,
  codexRuntimeAdapter,
  cursorRuntimeAdapter,
  devinRuntimeAdapter,
  openCodeRuntimeAdapter,
  piRuntimeAdapter,
} from '../../src/runtimes/index.js';
import { OBSERVED_AT, createRuntimeInput } from './helpers.js';

import type { RenderDecision } from '../../src/index.js';
import type {
  DegradationMode,
  RuntimeAdapter,
  RuntimeAdapterResult,
  RuntimeCanonicalState,
  RuntimeCapabilityRecord,
  RuntimePresentationResult,
} from '../../src/runtimes/index.js';

export type TerminalFlow = 'cancelled' | 'disconnect' | 'error' | 'timeout';

export interface RuntimeAdaptOptions {
  readonly canonical?: RuntimeCanonicalState;
  readonly protocolVersion?: string;
  readonly runtimeVersion?: string;
}

export interface RuntimePresentOptions {
  readonly preferredDegradationModes?: readonly DegradationMode[];
  readonly protocolVersion?: string;
  readonly runtimeVersion?: string;
}

export interface RuntimePathHarness {
  readonly record: RuntimeCapabilityRecord;
  readonly extensionNamespace: string;
  adaptEvent(event: unknown, options?: RuntimeAdaptOptions): RuntimeAdapterResult;
  adaptExtension(options?: RuntimeAdaptOptions): RuntimeAdapterResult;
  adaptFinal(options?: RuntimeAdaptOptions): RuntimeAdapterResult;
  adaptStreaming(options?: RuntimeAdaptOptions): RuntimeAdapterResult;
  adaptTerminal(type: TerminalFlow, options?: RuntimeAdaptOptions): RuntimeAdapterResult;
  present(
    renderDecision: RenderDecision,
    options?: RuntimePresentOptions,
  ): RuntimePresentationResult;
}

interface RuntimeEventFactories<TRuntimeEvent> {
  readonly extension: (namespace: string, pathId: string) => TRuntimeEvent;
  readonly final: (pathId: string) => TRuntimeEvent;
  readonly streaming: (pathId: string) => TRuntimeEvent;
  readonly terminal: (type: TerminalFlow, pathId: string) => TRuntimeEvent;
}

function createPathHarness<TRuntimeEvent>(
  adapter: RuntimeAdapter<TRuntimeEvent>,
  record: RuntimeCapabilityRecord,
  factories: RuntimeEventFactories<TRuntimeEvent>,
): RuntimePathHarness {
  const extensionNamespace = `${record.runtime}.unknown-extension`;

  function adaptEvent(
    event: unknown,
    options: RuntimeAdaptOptions = {},
  ): RuntimeAdapterResult {
    return adapter.adapt(createRuntimeInput(event as TRuntimeEvent, {
      runtime: record.runtime,
      runtimeVersion: options.runtimeVersion ?? record.testedVersions.runtime,
      protocol: record.protocol,
      protocolVersion: options.protocolVersion ?? record.testedVersions.protocol,
      pathId: record.pathId,
      ...(options.canonical === undefined ? {} : { canonical: options.canonical }),
    }));
  }

  return Object.freeze({
    record,
    extensionNamespace,
    adaptEvent,
    adaptExtension(options: RuntimeAdaptOptions = {}): RuntimeAdapterResult {
      return adaptEvent(factories.extension(extensionNamespace, record.pathId), options);
    },
    adaptFinal(options: RuntimeAdaptOptions = {}): RuntimeAdapterResult {
      return adaptEvent(factories.final(record.pathId), options);
    },
    adaptStreaming(options: RuntimeAdaptOptions = {}): RuntimeAdapterResult {
      return adaptEvent(factories.streaming(record.pathId), options);
    },
    adaptTerminal(
      type: TerminalFlow,
      options: RuntimeAdaptOptions = {},
    ): RuntimeAdapterResult {
      return adaptEvent(factories.terminal(type, record.pathId), options);
    },
    present(
      renderDecision: RenderDecision,
      options: RuntimePresentOptions = {},
    ): RuntimePresentationResult {
      return adapter.present({
        pathId: record.pathId,
        runtimeVersion: options.runtimeVersion ?? record.testedVersions.runtime,
        protocolVersion: options.protocolVersion ?? record.testedVersions.protocol,
        renderDecision,
        ...(options.preferredDegradationModes === undefined
          ? {}
          : { preferredDegradationModes: options.preferredDegradationModes }),
      });
    },
  });
}

function capabilityFor(
  records: readonly RuntimeCapabilityRecord[],
  pathId: string,
): RuntimeCapabilityRecord {
  const record = records.find((candidate) => candidate.pathId === pathId);
  if (record === undefined) {
    throw new Error(`Missing pinned capability record for '${pathId}'.`);
  }
  return record;
}

function extensionEvent(namespace: string, pathId: string) {
  return {
    type: 'extension' as const,
    eventId: `${pathId}-extension`,
    index: 2,
    final: true,
    sourceTimestamp: OBSERVED_AT,
    namespace,
    value: { opaqueState: 'retained' },
  };
}

function terminalEvent(type: TerminalFlow, pathId: string) {
  return {
    type,
    eventId: `${pathId}-${type}`,
    index: 3,
    sourceTimestamp: OBSERVED_AT,
  };
}

const claudeFactories = {
  extension: extensionEvent,
  final: (pathId: string) => ({
    type: 'message-display' as const,
    eventId: `${pathId}-final`,
    index: 1,
    final: true,
    sourceTimestamp: OBSERVED_AT,
  }),
  streaming: (pathId: string) => ({
    type: 'message-display' as const,
    eventId: `${pathId}-streaming`,
    index: 0,
    final: false,
    sourceTimestamp: OBSERVED_AT,
  }),
  terminal: terminalEvent,
};

const codexFactories = {
  extension: extensionEvent,
  final: (pathId: string) => ({
    type: 'agent-message' as const,
    eventId: `${pathId}-final`,
    index: 1,
    sourceTimestamp: OBSERVED_AT,
    itemId: `${pathId}-item`,
    toolCallId: null,
  }),
  streaming: (pathId: string) => ({
    type: 'agent-message-delta' as const,
    eventId: `${pathId}-streaming`,
    index: 0,
    sourceTimestamp: OBSERVED_AT,
    itemId: `${pathId}-item`,
    toolCallId: null,
  }),
  terminal: terminalEvent,
};

const cursorFactories = {
  extension: extensionEvent,
  final: (pathId: string) => ({
    type: 'agent-message-chunk' as const,
    eventId: `${pathId}-final`,
    index: 1,
    final: true,
    sourceTimestamp: OBSERVED_AT,
  }),
  streaming: (pathId: string) => ({
    type: 'agent-message-chunk' as const,
    eventId: `${pathId}-streaming`,
    index: 0,
    final: false,
    sourceTimestamp: OBSERVED_AT,
  }),
  terminal: terminalEvent,
};

const devinFactories = {
  extension: extensionEvent,
  final: (pathId: string) => ({
    type: 'agent-message-chunk' as const,
    eventId: `${pathId}-final`,
    index: 1,
    final: true,
    sourceTimestamp: OBSERVED_AT,
  }),
  streaming: (pathId: string) => ({
    type: 'agent-message-chunk' as const,
    eventId: `${pathId}-streaming`,
    index: 0,
    final: false,
    sourceTimestamp: OBSERVED_AT,
  }),
  terminal: terminalEvent,
};

const openCodeFactories = {
  extension: extensionEvent,
  final: (pathId: string) => ({
    type: 'message-part' as const,
    eventId: `${pathId}-final`,
    index: 1,
    final: true,
    sourceTimestamp: OBSERVED_AT,
    partId: `${pathId}-part`,
  }),
  streaming: (pathId: string) => ({
    type: 'message-part' as const,
    eventId: `${pathId}-streaming`,
    index: 0,
    final: false,
    sourceTimestamp: OBSERVED_AT,
    partId: `${pathId}-part`,
  }),
  terminal: terminalEvent,
};

const piFactories = {
  extension: extensionEvent,
  final: (pathId: string) => ({
    type: 'message-end' as const,
    eventId: `${pathId}-final`,
    index: 1,
    sourceTimestamp: OBSERVED_AT,
  }),
  streaming: (pathId: string) => ({
    type: 'message-update' as const,
    eventId: `${pathId}-streaming`,
    index: 0,
    sourceTimestamp: OBSERVED_AT,
  }),
  terminal: terminalEvent,
};

export const RUNTIME_PATH_HARNESSES: readonly RuntimePathHarness[] = Object.freeze([
  createPathHarness(
    claudeRuntimeAdapter,
    capabilityFor(ClaudeCapabilityRecords, ClaudeRuntimePaths.HEADLESS),
    claudeFactories,
  ),
  createPathHarness(
    claudeRuntimeAdapter,
    capabilityFor(ClaudeCapabilityRecords, ClaudeRuntimePaths.INTERACTIVE),
    claudeFactories,
  ),
  createPathHarness(
    codexRuntimeAdapter,
    capabilityFor(CodexCapabilityRecords, CodexRuntimePaths.APP_SERVER),
    codexFactories,
  ),
  createPathHarness(
    piRuntimeAdapter,
    capabilityFor(PiCapabilityRecords, PiRuntimePaths.JSON_RPC),
    piFactories,
  ),
  createPathHarness(
    piRuntimeAdapter,
    capabilityFor(PiCapabilityRecords, PiRuntimePaths.DISPLAY_TRANSFORMER),
    piFactories,
  ),
  createPathHarness(
    openCodeRuntimeAdapter,
    capabilityFor(OpenCodeCapabilityRecords, OpenCodeRuntimePaths.SERVER_SSE),
    openCodeFactories,
  ),
  createPathHarness(
    devinRuntimeAdapter,
    capabilityFor(DevinCapabilityRecords, DevinRuntimePaths.ACP),
    devinFactories,
  ),
  createPathHarness(
    cursorRuntimeAdapter,
    capabilityFor(CursorCapabilityRecords, CursorRuntimePaths.ACP),
    cursorFactories,
  ),
]);
