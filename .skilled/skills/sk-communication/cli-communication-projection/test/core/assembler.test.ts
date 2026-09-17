// ───────────────────────────────────────────────────────────────────
// MODULE: Generation Assembly Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  AssemblyReasonCodes,
  MessageAssembler,
  decodeExactOriginal,
} from '../../src/index.js';
import { readFixture } from '../contracts/fixture-loader.js';
import {
  createByteOriginal,
  createGenerationKey,
  createSyntheticEvent,
  createTextOriginal,
} from './helpers.js';

import type {
  ContractFixtureCase,
  ExactOriginalRecord,
  GenerationKey,
  RuntimeFixtureCase,
} from '../../src/index.js';

interface RuntimeMatrix {
  readonly fixtureSetVersion: string;
  readonly description: string;
  readonly cases: readonly RuntimeFixtureCase[];
}

interface ExactOriginalSet {
  readonly fixtureSetVersion: string;
  readonly description: string;
  readonly cases: readonly ContractFixtureCase<ExactOriginalRecord>[];
}

const matrix = readFixture<RuntimeMatrix>('runtime-matrix.json');
const originals = readFixture<ExactOriginalSet>('exact-originals.json');

describe('generation-keyed assembly', () => {
  it('replays the full six-runtime behavior matrix with typed terminal outcomes', () => {
    const originalsById = new Map(
      originals.cases.map((fixture) => [fixture.record.originalId, fixture.record]),
    );

    for (const fixture of matrix.cases) {
      const original = originalsById.get(fixture.exactOriginalId);
      expect(original, fixture.fixtureId).toBeDefined();
      if (original === undefined) {
        continue;
      }
      const assembler = new MessageAssembler({ idleTimeoutMs: 10 });
      const eventBefore = JSON.stringify(fixture.event);
      const originalBefore = JSON.stringify(original);
      const key: GenerationKey = {
        runtime: fixture.runtime,
        sessionId: fixture.event.sessionId,
        turnId: fixture.event.turnId ?? 'missing-turn',
        messageId: fixture.event.messageId ?? 'missing-message',
        generationId: fixture.fixtureId,
        attempt: 1,
      };
      expect(assembler.startGeneration({ key, exactOriginal: original, startedAtMs: 0 }).status)
        .toBe('started');
      const transition = assembler.ingestEvent({
        key,
        event: fixture.event,
        original,
        observedAtMs: 1,
      });

      if (fixture.fixtureClass === 'streaming') {
        expect(transition.status, fixture.fixtureId).toBe('accepted');
        const expired = assembler.expireIdle(11);
        expect(expired).toHaveLength(1);
        expect(expired[0]?.reasonCode).toBe(AssemblyReasonCodes.TIMEOUT);
      } else {
        expect(transition.status, fixture.fixtureId).toBe('terminal');
        if (transition.status !== 'terminal') {
          continue;
        }
        if (fixture.fixtureClass === 'normal') {
          expect(transition.result.status).toBe('completed');
          if (transition.result.status === 'completed') {
            expect(transition.result.text).toBe(
              new TextDecoder().decode(decodeExactOriginal(original)),
            );
          }
        } else if (fixture.fixtureClass === 'error') {
          expect(transition.result.reasonCode).toBe(AssemblyReasonCodes.SOURCE_FAILED);
        } else if (fixture.fixtureClass === 'cancellation') {
          expect(transition.result.reasonCode).toBe(AssemblyReasonCodes.CANCELLED);
        } else {
          expect(transition.result.reasonCode).toBe(AssemblyReasonCodes.EMPTY_OUTPUT);
          expect(transition.result.events[0]?.extensions).toEqual(fixture.event.extensions);
        }
      }
      expect(assembler.activeGenerationCount, fixture.fixtureId).toBe(0);
      expect(JSON.stringify(fixture.event), fixture.fixtureId).toBe(eventBefore);
      expect(JSON.stringify(original), fixture.fixtureId).toBe(originalBefore);
    }
  });

  it('assembles out-of-order deltas once and preserves all three order domains', () => {
    const assembler = new MessageAssembler();
    const key = createGenerationKey('out-of-order');
    const fallback = createTextOriginal('fallback-abc', 'ABC');
    expect(assembler.startGeneration({ key, exactOriginal: fallback, startedAtMs: 0 }).status)
      .toBe('started');

    const partA = createTextOriginal('part-a', 'A');
    const partB = createTextOriginal('part-b', 'B');
    const partC = createTextOriginal('part-c', 'C');
    const terminalOriginal = createTextOriginal('terminal-metadata', 'metadata');
    const eventB = createSyntheticEvent({
      key,
      eventId: 'event-b',
      kind: 'assistant-message-delta',
      phase: 'streaming',
      terminalStatus: 'none',
      sourceSequence: 1,
      arrivalIndex: 0,
      original: partB,
    });
    const eventC = createSyntheticEvent({
      key,
      eventId: 'event-c',
      kind: 'assistant-message-delta',
      phase: 'streaming',
      terminalStatus: 'none',
      sourceSequence: 2,
      arrivalIndex: 1,
      original: partC,
    });
    const eventA = createSyntheticEvent({
      key,
      eventId: 'event-a',
      kind: 'assistant-message-delta',
      phase: 'streaming',
      terminalStatus: 'none',
      sourceSequence: 0,
      arrivalIndex: 2,
      original: partA,
    });
    const terminal = createSyntheticEvent({
      key,
      eventId: 'event-final',
      kind: 'extension',
      phase: 'final',
      terminalStatus: 'completed',
      sourceSequence: 3,
      arrivalIndex: 3,
      original: terminalOriginal,
    });

    expect(assembler.ingestEvent({ key, event: eventB, original: partB, observedAtMs: 1 }).status)
      .toBe('accepted');
    expect(assembler.ingestEvent({ key, event: eventC, original: partC, observedAtMs: 2 }).status)
      .toBe('accepted');
    expect(assembler.ingestEvent({ key, event: eventA, original: partA, observedAtMs: 3 }).status)
      .toBe('accepted');
    expect(assembler.ingestEvent({ key, event: eventB, original: partB, observedAtMs: 4 }).status)
      .toBe('duplicate');
    const result = assembler.ingestEvent({
      key,
      event: terminal,
      original: terminalOriginal,
      observedAtMs: 5,
    });

    expect(result.status).toBe('terminal');
    if (result.status !== 'terminal' || result.result.status !== 'completed') {
      return;
    }
    expect(result.result.text).toBe('ABC');
    expect(result.result.order.arrival.map((entry) => entry.eventId)).toEqual([
      'event-b', 'event-c', 'event-a', 'event-final',
    ]);
    expect(result.result.order.source.map((entry) => entry.eventId)).toEqual([
      'event-a', 'event-b', 'event-c', 'event-final',
    ]);
    expect(result.result.order.assembly.map((entry) => entry.index)).toEqual([0, 1, 2, 3]);

    const duplicateFinal = assembler.ingestEvent({
      key,
      event: terminal,
      original: terminalOriginal,
      observedAtMs: 6,
    });
    expect(duplicateFinal).toEqual({
      status: 'ignored-terminal',
      reasonCode: AssemblyReasonCodes.COMPLETED,
    });
  });

  it('isolates concurrent retry generations that share message identity', () => {
    const assembler = new MessageAssembler();
    const firstKey = createGenerationKey('retry-one', 1);
    const secondKey = createGenerationKey('retry-two', 2);
    const firstOriginal = createTextOriginal('retry-one-original', 'first');
    const secondOriginal = createTextOriginal('retry-two-original', 'second');
    expect(assembler.startGeneration({
      key: firstKey,
      exactOriginal: firstOriginal,
      startedAtMs: 0,
    }).status).toBe('started');
    expect(assembler.startGeneration({
      key: secondKey,
      exactOriginal: secondOriginal,
      startedAtMs: 0,
    }).status).toBe('started');

    const secondEvent = createSyntheticEvent({
      key: secondKey,
      eventId: 'retry-two-final',
      kind: 'assistant-message',
      phase: 'final',
      terminalStatus: 'completed',
      sourceSequence: 0,
      arrivalIndex: 0,
      original: secondOriginal,
    });
    const firstEvent = createSyntheticEvent({
      key: firstKey,
      eventId: 'retry-one-final',
      kind: 'assistant-message',
      phase: 'final',
      terminalStatus: 'completed',
      sourceSequence: 0,
      arrivalIndex: 0,
      original: firstOriginal,
    });
    const second = assembler.ingestEvent({
      key: secondKey,
      event: secondEvent,
      original: secondOriginal,
      observedAtMs: 1,
    });
    const first = assembler.ingestEvent({
      key: firstKey,
      event: firstEvent,
      original: firstOriginal,
      observedAtMs: 2,
    });

    expect(second.status === 'terminal' && second.result.status === 'completed'
      ? second.result.text
      : null).toBe('second');
    expect(first.status === 'terminal' && first.result.status === 'completed'
      ? first.result.text
      : null).toBe('first');
    expect(assembler.activeGenerationCount).toBe(0);
  });

  it('makes cancellation and timeout terminal while ignoring late data', () => {
    const assembler = new MessageAssembler({ idleTimeoutMs: 10 });
    const cancelKey = createGenerationKey('cancel-race');
    const fallback = createTextOriginal('cancel-race-original', 'keep me');
    expect(assembler.startGeneration({
      key: cancelKey,
      exactOriginal: fallback,
      startedAtMs: 0,
    }).status).toBe('started');
    const cancellation = createSyntheticEvent({
      key: cancelKey,
      eventId: 'cancel-race-cancelled',
      kind: 'cancellation',
      phase: 'cancelled',
      terminalStatus: 'cancelled',
      sourceSequence: 0,
      arrivalIndex: 0,
      original: fallback,
    });
    const cancelled = assembler.ingestEvent({
      key: cancelKey,
      event: cancellation,
      original: fallback,
      observedAtMs: 1,
    });
    expect(cancelled.status === 'terminal' ? cancelled.result.reasonCode : null)
      .toBe(AssemblyReasonCodes.CANCELLED);

    const lateOriginal = createTextOriginal('cancel-race-late', 'late response');
    const lateFinal = createSyntheticEvent({
      key: cancelKey,
      eventId: 'cancel-race-late-final',
      kind: 'assistant-message',
      phase: 'final',
      terminalStatus: 'completed',
      sourceSequence: 1,
      arrivalIndex: 1,
      original: lateOriginal,
    });
    expect(assembler.ingestEvent({
      key: cancelKey,
      event: lateFinal,
      original: lateOriginal,
      observedAtMs: 2,
    })).toEqual({
      status: 'ignored-terminal',
      reasonCode: AssemblyReasonCodes.CANCELLED,
    });

    const timeoutKey = createGenerationKey('timeout');
    const partial = createTextOriginal('timeout-partial', 'partial');
    expect(assembler.startGeneration({
      key: timeoutKey,
      exactOriginal: partial,
      startedAtMs: 0,
    }).status).toBe('started');
    const streaming = createSyntheticEvent({
      key: timeoutKey,
      eventId: 'timeout-streaming',
      kind: 'assistant-message-delta',
      phase: 'streaming',
      terminalStatus: 'none',
      sourceSequence: 0,
      arrivalIndex: 0,
      original: partial,
    });
    expect(assembler.ingestEvent({
      key: timeoutKey,
      event: streaming,
      original: partial,
      observedAtMs: 1,
    }).status).toBe('accepted');
    const expired = assembler.expireIdle(11);
    expect(expired).toHaveLength(1);
    expect(expired[0]?.reasonCode).toBe(AssemblyReasonCodes.TIMEOUT);
    expect(assembler.activeGenerationCount).toBe(0);
  });

  it('enforces byte, event, retry, conflict, encoding, and empty-output bounds', () => {
    const oversizedAssembler = new MessageAssembler({ maxBytes: 2 });
    const oversizedKey = createGenerationKey('oversized');
    const oversized = createTextOriginal('oversized-original', 'abc');
    expect(oversizedAssembler.startGeneration({
      key: oversizedKey,
      exactOriginal: oversized,
      startedAtMs: 0,
    }).status).toBe('started');
    const oversizedEvent = createSyntheticEvent({
      key: oversizedKey,
      eventId: 'oversized-final',
      kind: 'assistant-message',
      phase: 'final',
      terminalStatus: 'completed',
      sourceSequence: 0,
      arrivalIndex: 0,
      original: oversized,
    });
    const oversizedResult = oversizedAssembler.ingestEvent({
      key: oversizedKey,
      event: oversizedEvent,
      original: oversized,
      observedAtMs: 1,
    });
    expect(oversizedResult.status === 'terminal' ? oversizedResult.result.reasonCode : null)
      .toBe(AssemblyReasonCodes.BYTE_LIMIT);

    const eventLimitAssembler = new MessageAssembler({ maxEvents: 1 });
    const eventLimitKey = createGenerationKey('event-limit');
    const eventLimitFirst = createTextOriginal('event-limit-first', 'a');
    const eventLimitSecond = createTextOriginal('event-limit-second', 'b');
    eventLimitAssembler.startGeneration({
      key: eventLimitKey,
      exactOriginal: eventLimitFirst,
      startedAtMs: 0,
    });
    const eventLimitDelta = createSyntheticEvent({
      key: eventLimitKey,
      eventId: 'event-limit-delta',
      kind: 'assistant-message-delta',
      phase: 'streaming',
      terminalStatus: 'none',
      sourceSequence: 0,
      arrivalIndex: 0,
      original: eventLimitFirst,
    });
    const eventLimitFinal = createSyntheticEvent({
      key: eventLimitKey,
      eventId: 'event-limit-final',
      kind: 'assistant-message',
      phase: 'final',
      terminalStatus: 'completed',
      sourceSequence: 1,
      arrivalIndex: 1,
      original: eventLimitSecond,
    });
    expect(eventLimitAssembler.ingestEvent({
      key: eventLimitKey,
      event: eventLimitDelta,
      original: eventLimitFirst,
      observedAtMs: 1,
    }).status).toBe('accepted');
    const eventLimitResult = eventLimitAssembler.ingestEvent({
      key: eventLimitKey,
      event: eventLimitFinal,
      original: eventLimitSecond,
      observedAtMs: 2,
    });
    expect(eventLimitResult.status === 'terminal' ? eventLimitResult.result.reasonCode : null)
      .toBe(AssemblyReasonCodes.EVENT_LIMIT);

    const retryAssembler = new MessageAssembler({ maxAttempts: 1 });
    const retryKey = createGenerationKey('retry-limit', 2);
    expect(retryAssembler.startGeneration({
      key: retryKey,
      exactOriginal: oversized,
      startedAtMs: 0,
    })).toMatchObject({
      status: 'terminal',
      result: { reasonCode: AssemblyReasonCodes.RETRY_LIMIT },
    });

    const conflictAssembler = new MessageAssembler();
    const conflictKey = createGenerationKey('conflict');
    const first = createTextOriginal('conflict-a', 'a');
    const second = createTextOriginal('conflict-b', 'b');
    conflictAssembler.startGeneration({ key: conflictKey, exactOriginal: first, startedAtMs: 0 });
    const firstEvent = createSyntheticEvent({
      key: conflictKey,
      eventId: 'conflict-a',
      kind: 'assistant-message-delta',
      phase: 'streaming',
      terminalStatus: 'none',
      sourceSequence: 0,
      arrivalIndex: 0,
      original: first,
    });
    const secondEvent = createSyntheticEvent({
      key: conflictKey,
      eventId: 'conflict-b',
      kind: 'assistant-message-delta',
      phase: 'streaming',
      terminalStatus: 'none',
      sourceSequence: 0,
      arrivalIndex: 1,
      original: second,
    });
    expect(conflictAssembler.ingestEvent({
      key: conflictKey,
      event: firstEvent,
      original: first,
      observedAtMs: 1,
    }).status).toBe('accepted');
    const conflict = conflictAssembler.ingestEvent({
      key: conflictKey,
      event: secondEvent,
      original: second,
      observedAtMs: 2,
    });
    expect(conflict.status === 'terminal' ? conflict.result.reasonCode : null)
      .toBe(AssemblyReasonCodes.CONFLICTING_DUPLICATE);

    const corruptAssembler = new MessageAssembler();
    const corruptKey = createGenerationKey('corrupt');
    const corrupt = createByteOriginal('corrupt-original', new Uint8Array([0xff, 0xfe]));
    corruptAssembler.startGeneration({ key: corruptKey, exactOriginal: corrupt, startedAtMs: 0 });
    const corruptEvent = createSyntheticEvent({
      key: corruptKey,
      eventId: 'corrupt-final',
      kind: 'assistant-message',
      phase: 'final',
      terminalStatus: 'completed',
      sourceSequence: 0,
      arrivalIndex: 0,
      original: corrupt,
    });
    const corruptResult = corruptAssembler.ingestEvent({
      key: corruptKey,
      event: corruptEvent,
      original: corrupt,
      observedAtMs: 1,
    });
    expect(corruptResult.status === 'terminal' ? corruptResult.result.reasonCode : null)
      .toBe(AssemblyReasonCodes.CORRUPT_ENCODING);

    const emptyAssembler = new MessageAssembler();
    const emptyKey = createGenerationKey('empty');
    const metadata = createTextOriginal('empty-metadata', 'metadata');
    emptyAssembler.startGeneration({ key: emptyKey, exactOriginal: metadata, startedAtMs: 0 });
    const emptyEvent = createSyntheticEvent({
      key: emptyKey,
      eventId: 'empty-final',
      kind: 'extension',
      phase: 'final',
      terminalStatus: 'completed',
      sourceSequence: 0,
      arrivalIndex: 0,
      original: metadata,
    });
    const emptyResult = emptyAssembler.ingestEvent({
      key: emptyKey,
      event: emptyEvent,
      original: metadata,
      observedAtMs: 1,
    });
    expect(emptyResult.status === 'terminal' ? emptyResult.result.reasonCode : null)
      .toBe(AssemblyReasonCodes.EMPTY_OUTPUT);
  });

  it('rejects unsupported runtime keys and bounds terminal tombstones', () => {
    expect(() => new MessageAssembler(null)).toThrow(TypeError);
    expect(() => new MessageAssembler({ maxBytes: 0 })).toThrow(RangeError);
    expect(() => new MessageAssembler({ unknownBound: 1 })).toThrow(TypeError);

    const invalidKey = {
      ...createGenerationKey('invalid-runtime'),
      runtime: 'unknown-runtime',
    } as unknown as GenerationKey;
    const original = createTextOriginal('invalid-runtime-original', 'original');
    const invalidAssembler = new MessageAssembler();
    const invalid = invalidAssembler.startGeneration({
      key: invalidKey,
      exactOriginal: original,
      startedAtMs: 0,
    });
    expect(invalid.status).toBe('rejected');
    expect(invalidAssembler.startGeneration(null).status).toBe('rejected');
    expect(invalidAssembler.ingestEvent({ key: null }).status).toBe('rejected');

    const bounded = new MessageAssembler({ maxTerminalGenerations: 1 });
    for (const suffix of ['one', 'two']) {
      const key = createGenerationKey(`terminal-${suffix}`);
      const value = createTextOriginal(`terminal-${suffix}-original`, suffix);
      expect(bounded.startGeneration({ key, exactOriginal: value, startedAtMs: 0 }).status)
        .toBe('started');
      const event = createSyntheticEvent({
        key,
        eventId: `terminal-${suffix}-final`,
        kind: 'assistant-message',
        phase: 'final',
        terminalStatus: 'completed',
        sourceSequence: 0,
        arrivalIndex: 0,
        original: value,
      });
      expect(bounded.ingestEvent({ key, event, original: value, observedAtMs: 1 }).status)
        .toBe('terminal');
    }
    expect(bounded.terminalGenerationCount).toBe(1);
    expect(bounded.activeGenerationCount).toBe(0);
  });
});
