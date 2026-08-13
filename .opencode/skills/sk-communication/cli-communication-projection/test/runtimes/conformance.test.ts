// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Adapter Conformance Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import {
  ClaudeRuntimePaths,
  assertRuntimeAdapterConformance,
  claudeRuntimeAdapter,
} from '../../src/runtimes/index.js';
import {
  createCanonicalState,
  createClaudeInput,
  finalMessage,
} from './helpers.js';

import type {
  ClaudeRuntimeEvent,
  RuntimeAdapter,
  RuntimeCanonicalState,
  RuntimeConformanceCase,
} from '../../src/runtimes/index.js';

describe('runtime adapter conformance harness', () => {
  it('asserts shared envelopes, extensions, lifecycle, cancellation, and generations', () => {
    const cases: readonly RuntimeConformanceCase<ClaudeRuntimeEvent>[] = [
      {
        input: createClaudeInput(finalMessage()),
        expectedKind: 'assistant-message',
        expectedPhase: 'final',
        expectedTerminalStatus: 'completed',
        expectedReasonCode: 'none',
      },
      {
        input: createClaudeInput({
          type: 'extension',
          eventId: 'claude-extension',
          index: 2,
          final: true,
          sourceTimestamp: '2026-08-12T00:00:00.000Z',
          namespace: 'claude.message-display',
          value: { cacheState: 'isolated' },
        }, { pathId: ClaudeRuntimePaths.INTERACTIVE }),
        expectedKind: 'extension',
        expectedPhase: 'final',
        expectedTerminalStatus: 'completed',
        expectedReasonCode: 'none',
        expectedExtensionNamespace: 'claude.message-display',
      },
      {
        input: createClaudeInput({
          type: 'cancelled',
          eventId: 'claude-cancelled',
          index: 3,
          sourceTimestamp: '2026-08-12T00:00:00.000Z',
        }),
        expectedKind: 'cancellation',
        expectedPhase: 'cancelled',
        expectedTerminalStatus: 'cancelled',
        expectedReasonCode: 'cancelled',
      },
    ];

    const report = assertRuntimeAdapterConformance({
      adapter: claudeRuntimeAdapter,
      cases,
    });
    expect(report).toEqual({
      adapterVersion: 'runtime-adapter/1.0.0',
      runtime: 'claude',
      casesChecked: 3,
      emittedEvents: 3,
      extensionEvents: 1,
      cancellationEvents: 1,
      canonicalWrites: 0,
    });
  });

  it('proves the Claude adapter never writes through the canonical boundary', () => {
    const writeSpy = vi.fn();
    const canonical = new Proxy(createCanonicalState(), {
      set(target, property, value, receiver) {
        writeSpy(property, value);
        return Reflect.set(target, property, value, receiver);
      },
    });
    const input = createClaudeInput(finalMessage('claude-spy-final'), { canonical });

    expect(() => assertRuntimeAdapterConformance({
      adapter: claudeRuntimeAdapter,
      cases: [{
        input,
        expectedKind: 'assistant-message',
        expectedPhase: 'final',
        expectedTerminalStatus: 'completed',
        expectedReasonCode: 'none',
      }],
    })).not.toThrow();
    expect(writeSpy).not.toHaveBeenCalled();
  });

  it('rejects an adapter that writes canonical state', () => {
    const mutatingAdapter: RuntimeAdapter<ClaudeRuntimeEvent> = {
      ...claudeRuntimeAdapter,
      adapt(input) {
        const mutable = input.canonical as RuntimeCanonicalState & {
          transcriptRevision: string;
        };
        mutable.transcriptRevision = 'mutated';
        return claudeRuntimeAdapter.adapt(input);
      },
    };
    const input = createClaudeInput(finalMessage('claude-negative-control'));

    expect(() => assertRuntimeAdapterConformance({
      adapter: mutatingAdapter,
      cases: [{
        input,
        expectedKind: 'assistant-message',
        expectedPhase: 'final',
        expectedTerminalStatus: 'completed',
        expectedReasonCode: 'none',
      }],
    })).toThrow('Adapter mutated canonical runtime state.');
  });
});
