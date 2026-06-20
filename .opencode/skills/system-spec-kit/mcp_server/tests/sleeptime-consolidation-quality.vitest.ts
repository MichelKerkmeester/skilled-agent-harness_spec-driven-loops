// ───────────────────────────────────────────────────────────────
// MODULE: Sleeptime Consolidation Quality (ON-path contract)
// ───────────────────────────────────────────────────────────────
//
// Guards the consolidation-quality contract that run-sleeptime-eval.mjs measures:
// with SPECKIT_SLEEPTIME_CONSOLIDATION ON, a bounded consolidation pass must
//   (1) collapse true duplicate spans (dedup precision), and
//   (2) preserve every unique-signal span (recall hold / no data loss),
// while SPECKIT_SLEEPTIME_LIVE_WRITE stays the second gate before any write.
//
// These are ON-path assertions: the flag is enabled and we assert the new
// behavior and its quality invariants, not flag-off byte-identity. The existing
// sleeptime-governor suite covers governor step/cost/ACL mechanics; this suite is
// disjoint and owns the consolidation quality contract.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { runSleeptimeAgent, type SleeptimeRange, type SleeptimeTranscriptMessage } from '../lib/cognitive/sleeptime-agent.js';

const CONSOLIDATION_FLAG = 'SPECKIT_SLEEPTIME_CONSOLIDATION';
const LIVE_WRITE_FLAG = 'SPECKIT_SLEEPTIME_LIVE_WRITE';

// Mirror of the eval driver's dedup range selector: one range per unique content,
// zero ranges for byte-identical duplicate spans.
function dedupRangeSelector(transcript: readonly SleeptimeTranscriptMessage[]): readonly SleeptimeRange[] {
  const seen = new Set<string>();
  const ranges: SleeptimeRange[] = [];
  for (const message of transcript) {
    if (seen.has(message.content)) continue;
    seen.add(message.content);
    ranges.push({ startIndex: message.index, endIndex: message.index, context: message.content });
  }
  return ranges;
}

function memoryIdsInRanges(ranges: readonly SleeptimeRange[]): Set<number> {
  const ids = new Set<number>();
  for (const range of ranges) {
    for (const match of range.context.matchAll(/\[mem:(\d+)\]/g)) {
      ids.add(Number(match[1]));
    }
  }
  return ids;
}

// Build a transcript with a known unique set plus injected byte-identical dupes.
function buildTranscript(uniqueCount: number, duplicateCount: number): {
  transcript: SleeptimeTranscriptMessage[];
  uniqueIds: number[];
} {
  const transcript: SleeptimeTranscriptMessage[] = [];
  const uniqueIds: number[] = [];
  let cursor = 0;
  for (let i = 0; i < uniqueCount; i += 1) {
    const id = 1000 + i;
    uniqueIds.push(id);
    transcript.push({ index: cursor, role: 'assistant', content: `[mem:${id}] unique signal ${i}` });
    cursor += 1;
  }
  for (let i = 0; i < duplicateCount; i += 1) {
    const id = 1000 + i; // echo the first `duplicateCount` unique spans verbatim
    transcript.push({ index: cursor, role: 'assistant', content: `[mem:${id}] unique signal ${i}` });
    cursor += 1;
  }
  return { transcript, uniqueIds };
}

describe('sleeptime consolidation quality (ON-path)', () => {
  const originalConsolidation = process.env[CONSOLIDATION_FLAG];
  const originalLiveWrite = process.env[LIVE_WRITE_FLAG];

  beforeEach(() => {
    delete process.env[CONSOLIDATION_FLAG];
    delete process.env[LIVE_WRITE_FLAG];
  });

  afterEach(() => {
    if (originalConsolidation === undefined) delete process.env[CONSOLIDATION_FLAG];
    else process.env[CONSOLIDATION_FLAG] = originalConsolidation;
    if (originalLiveWrite === undefined) delete process.env[LIVE_WRITE_FLAG];
    else process.env[LIVE_WRITE_FLAG] = originalLiveWrite;
  });

  it('flag ON: collapses duplicate spans with full dedup precision and zero data loss', async () => {
    process.env[CONSOLIDATION_FLAG] = 'true';
    const { transcript, uniqueIds } = buildTranscript(12, 4);

    const result = await runSleeptimeAgent({
      runId: 'consolidation-quality',
      transcript,
      mode: 'shadow',
      rangeSelector: dedupRangeSelector,
    });

    expect(result.status).toBe('shadow-recorded');
    const ranges = result.shadowRecord?.ranges ?? [];

    // Dedup precision: every duplicate span collapsed → range count == unique count.
    expect(ranges.length).toBe(uniqueIds.length);

    // Recall hold / no data loss: every unique memory id survives consolidation.
    const surviving = memoryIdsInRanges(ranges);
    for (const id of uniqueIds) {
      expect(surviving.has(id)).toBe(true);
    }
    expect(surviving.size).toBe(uniqueIds.length);
  });

  it('flag ON: does not collapse near-but-distinct spans (no false dedup)', async () => {
    process.env[CONSOLIDATION_FLAG] = 'true';
    // Two spans that differ by a single char must both survive as distinct ranges.
    const transcript: SleeptimeTranscriptMessage[] = [
      { index: 0, role: 'assistant', content: '[mem:2001] decision: keep shadow mode A' },
      { index: 1, role: 'assistant', content: '[mem:2002] decision: keep shadow mode B' },
    ];

    const result = await runSleeptimeAgent({
      runId: 'near-duplicate',
      transcript,
      mode: 'shadow',
      rangeSelector: dedupRangeSelector,
    });

    const ranges = result.shadowRecord?.ranges ?? [];
    expect(ranges.length).toBe(2);
    expect(memoryIdsInRanges(ranges)).toEqual(new Set([2001, 2002]));
  });

  it('flag ON but live-write OFF: records shadow ranges and never writes', async () => {
    process.env[CONSOLIDATION_FLAG] = 'true';
    const writer = vi.fn();
    const { transcript } = buildTranscript(6, 2);

    const result = await runSleeptimeAgent({
      runId: 'shadow-no-write',
      transcript,
      mode: 'live', // requests live, but the second gate is off
      rangeSelector: dedupRangeSelector,
      archiveWriter: writer,
    });

    expect(result.status).toBe('shadow-recorded');
    expect(result.shadowRecord?.liveWriteAttempted).toBe(false);
    expect(writer).not.toHaveBeenCalled();
  });

  it('both flags ON: live archival write runs over the deduped range set', async () => {
    process.env[CONSOLIDATION_FLAG] = 'true';
    process.env[LIVE_WRITE_FLAG] = 'true';
    const written: SleeptimeRange[][] = [];
    const { transcript, uniqueIds } = buildTranscript(5, 3);

    const result = await runSleeptimeAgent({
      runId: 'live-write',
      transcript,
      mode: 'live',
      rangeSelector: dedupRangeSelector,
      archiveWriter: (ranges) => { written.push([...ranges]); },
    });

    expect(result.status).toBe('live-written');
    expect(result.shadowRecord?.liveWriteAttempted).toBe(true);
    expect(written).toHaveLength(1);
    // The write target is the deduped set: no duplicate spans leaked into archival.
    expect(written[0].length).toBe(uniqueIds.length);
  });
});
