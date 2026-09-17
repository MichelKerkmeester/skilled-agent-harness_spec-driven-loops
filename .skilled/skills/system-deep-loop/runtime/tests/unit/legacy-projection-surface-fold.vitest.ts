// Proves the surface-fold helper composes multiple single-artifact contracts
// from one census surface: a mixed jsonl+md surface, and a per-iteration delta
// fan-out that partitions the same events into one jsonl artifact per
// iteration. The negative-control toggle proves the delta assertion can go red.

import { describe, expect, it } from 'vitest';

import {
  foldLegacyProjectionSurface,
  serializeLegacyJsonl,
} from '../../lib/legacy-projections/index.js';

import type {
  EventReadResult,
  JsonObject,
} from '../../lib/event-envelope/index.js';
import type {
  LegacyProjectionContract,
  LegacyProjectionSurfaceContract,
} from '../../lib/legacy-projections/index.js';

const FIXED_TS = '2026-08-23T00:00:00.000Z';
const TEST_LEDGER_ID = 'test-ledger';
const GENESIS_HASH = '0'.repeat(64);

const head = Object.freeze({
  ledgerId: TEST_LEDGER_ID,
  sequence: 0,
  recordHash: GENESIS_HASH,
});

// Negative-control toggle for the delta-fan-out surface: when true the
// surface partitions events into one artifact per iteration; when false it
// collapses all events into a single artifact and the delta-fan-out
// assertion goes red. Left true in the committed suite.
const SPLIT_BY_ITERATION = true;

function surfaceEvent(iteration: number, label: string): EventReadResult {
  return {
    effective: {
      envelope: {
        event_type: 'test.surface.event',
        occurred_at: FIXED_TS,
        payload: { iteration, label },
      },
    },
  } as unknown as EventReadResult;
}

function jsonlRowsArtifact(
  artifactId: string,
  relativePath: string,
  filterIteration: number | null,
): LegacyProjectionContract<any> {
  return {
    artifactId,
    censusSurfaceId: 'test-surface',
    ledgerId: TEST_LEDGER_ID,
    streamIds: ['test-stream'],
    relativePath,
    format: 'jsonl',
    refreshBoundary: 'event',
    foldId: 'test-fold@1',
    reducerId: 'test-rows-reducer',
    projectionVersion: 'test-rows@1',
    reducerVersion: 'test-rows-reducer@1',
    serializerId: 'legacy-jsonl-row-v1',
    legacyWriter: 'test',
    readers: ['test'],
    base: {
      baseSha: '0'.repeat(40),
      baseDigest: GENESIS_HASH,
      bytes: new Uint8Array(),
      state: { rows: [] },
      ledgerHead: head,
    },
    acceptedEventVersions: { 'test.surface.event': [1] },
    reduce(state: any, event: EventReadResult): any {
      const payload = event.effective.envelope.payload as Record<string, unknown>;
      const iteration = typeof payload.iteration === 'number' ? payload.iteration : 0;
      if (filterIteration !== null && iteration !== filterIteration) {
        return state;
      }
      const label = typeof payload.label === 'string' ? payload.label : '';
      const row: JsonObject = {
        type: 'iteration',
        run: iteration,
        status: 'complete',
        focus: label,
        timestamp: event.effective.envelope.occurred_at,
      };
      return { rows: [...state.rows, row] };
    },
    serialize(state: any): Uint8Array {
      return serializeLegacyJsonl(state.rows);
    },
  } as unknown as LegacyProjectionContract<any>;
}

function mdSummaryArtifact(
  artifactId: string,
  relativePath: string,
): LegacyProjectionContract<any> {
  return {
    artifactId,
    censusSurfaceId: 'test-surface',
    ledgerId: TEST_LEDGER_ID,
    streamIds: ['test-stream'],
    relativePath,
    format: 'md',
    refreshBoundary: 'lifecycle',
    foldId: 'test-md-fold@1',
    reducerId: 'test-md-reducer',
    projectionVersion: 'test-md@1',
    reducerVersion: 'test-md-reducer@1',
    serializerId: 'legacy-markdown-v1',
    legacyWriter: 'test',
    readers: ['test'],
    base: {
      baseSha: '0'.repeat(40),
      baseDigest: GENESIS_HASH,
      bytes: new Uint8Array(),
      state: { lines: [] },
      ledgerHead: head,
    },
    acceptedEventVersions: { 'test.surface.event': [1] },
    reduce(state: any, event: EventReadResult): any {
      const payload = event.effective.envelope.payload as Record<string, unknown>;
      const label = typeof payload.label === 'string' ? payload.label : '';
      return { lines: [...state.lines, `- ${label}`] };
    },
    serialize(state: any): string {
      return `# Summary\n\n${state.lines.join('\n')}\n`;
    },
  } as unknown as LegacyProjectionContract<any>;
}

function mixedSurface(): LegacyProjectionSurfaceContract {
  return {
    surfaceId: 'test-mixed',
    ledgerId: TEST_LEDGER_ID,
    buildArtifacts() {
      return [
        jsonlRowsArtifact('mixed-rows', 'research/state.jsonl', null),
        mdSummaryArtifact('mixed-summary', 'research/summary.md'),
      ];
    },
  };
}

function deltaSurface(): LegacyProjectionSurfaceContract {
  return {
    surfaceId: 'test-deltas',
    ledgerId: TEST_LEDGER_ID,
    buildArtifacts(events: readonly EventReadResult[]) {
      if (!SPLIT_BY_ITERATION) {
        return [jsonlRowsArtifact('deltas-all', 'deltas/iter-all.jsonl', null)];
      }
      const iterations = new Set<number>();
      for (const event of events) {
        const payload = event.effective.envelope.payload as Record<string, unknown>;
        if (typeof payload.iteration === 'number') {
          iterations.add(payload.iteration);
        }
      }
      return [...iterations].sort((a, b) => a - b).map((iter) => {
        const padded = String(iter).padStart(3, '0');
        return jsonlRowsArtifact(
          `deltas-iter-${padded}`,
          `deltas/iter-${padded}.jsonl`,
          iter,
        );
      });
    },
  };
}

function decodeUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

function parseJsonl(bytes: Uint8Array): JsonObject[] {
  const text = decodeUtf8(bytes).trimEnd();
  if (text === '') return [];
  return text.split('\n').map((line) => JSON.parse(line) as JsonObject);
}

describe('foldLegacyProjectionSurface', () => {
  it('folds a mixed-format surface into one jsonl and one markdown artifact', () => {
    const events = [
      surfaceEvent(1, 'alpha'),
      surfaceEvent(2, 'beta'),
    ];
    const folded = foldLegacyProjectionSurface(mixedSurface(), events, head);

    expect(folded).toHaveLength(2);

    expect(folded[0].artifactId).toBe('mixed-rows');
    expect(folded[0].relativePath).toBe('research/state.jsonl');
    expect(folded[0].format).toBe('jsonl');

    expect(folded[1].artifactId).toBe('mixed-summary');
    expect(folded[1].relativePath).toBe('research/summary.md');
    expect(folded[1].format).toBe('md');

    const rows = parseJsonl(folded[0].bytes);
    expect(rows).toEqual([
      { type: 'iteration', run: 1, status: 'complete', focus: 'alpha', timestamp: FIXED_TS },
      { type: 'iteration', run: 2, status: 'complete', focus: 'beta', timestamp: FIXED_TS },
    ]);

    const mdText = decodeUtf8(folded[1].bytes);
    expect(mdText).toBe('# Summary\n\n- alpha\n- beta\n');
  });

  it('partitions events by iteration into one jsonl artifact per iteration', () => {
    const events = [
      surfaceEvent(1, 'a1'),
      surfaceEvent(1, 'a2'),
      surfaceEvent(2, 'b1'),
    ];
    const folded = foldLegacyProjectionSurface(deltaSurface(), events, head);

    expect(folded).toHaveLength(2);
    expect(folded[0].relativePath).toBe('deltas/iter-001.jsonl');
    expect(folded[1].relativePath).toBe('deltas/iter-002.jsonl');

    const rows1 = parseJsonl(folded[0].bytes);
    expect(rows1).toHaveLength(2);
    expect(rows1.every((r) => r.run === 1)).toBe(true);

    const rows2 = parseJsonl(folded[1].bytes);
    expect(rows2).toHaveLength(1);
    expect(rows2[0].run).toBe(2);
  });
});
