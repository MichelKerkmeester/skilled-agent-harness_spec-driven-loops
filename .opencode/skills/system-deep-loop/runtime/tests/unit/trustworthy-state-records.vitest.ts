// ───────────────────────────────────────────────────────────────
// MODULE: Trustworthy state records
// ───────────────────────────────────────────────────────────────
//
// Two defects observed in real fan-out runs, both of which threw away completed
// work or recorded times that never happened.
//
// The command templates carry a literal `{ISO_8601_NOW}` placeholder for a model
// to substitute, and a model has no clock. Observed logs carried iteration times
// minutes into the future and neat ten-minute cadences for runs that finished in
// six. The append helper is the single path every state record travels, so it
// stamps the real time there and keeps the claim for forensics.
//
// The stop-policy validator matched one exact event name. Across three runs of
// the same model on the same prompt, producers wrote `synthesis_complete`, then
// `phase_synthesis_complete`, then `synthesis` — and a run that completed five
// iterations and wrote a full report was failed terminally for the third. The
// fixtures below use those exact strings.

import { describe, it, expect, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const RUNTIME = path.resolve(__dirname, '..', '..');
const APPENDER = path.join(RUNTIME, 'scripts', 'append-state-record.cjs');

const temps: string[] = [];
function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  temps.push(dir);
  return dir;
}
afterAll(() => { for (const d of temps) fs.rmSync(d, { recursive: true, force: true }); });

function append(logPath: string, record: unknown): void {
  execFileSync('node', [APPENDER, logPath], { input: JSON.stringify(record), encoding: 'utf8' });
}
function readRecords(logPath: string): Record<string, unknown>[] {
  return fs.readFileSync(logPath, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
}

describe('state records carry an observed time, not a claimed one', () => {
  it('replaces a fabricated future timestamp with the append time', () => {
    const log = path.join(tempDir('state-'), 'state.jsonl');
    const fabricated = '2099-01-01T00:00:00.000Z';
    append(log, { type: 'event', event: 'synthesis_complete', timestamp: fabricated });

    const [rec] = readRecords(log);
    expect(rec.timestamp).not.toBe(fabricated);
    expect(Date.parse(rec.timestamp as string)).toBeLessThanOrEqual(Date.now() + 1000);
  });

  it('keeps the producer claim so fabrication stays auditable', () => {
    const log = path.join(tempDir('state-'), 'state.jsonl');
    const fabricated = '2026-07-27T23:55:00.000Z';
    append(log, { type: 'iteration', iteration: 1, timestamp: fabricated });

    const [rec] = readRecords(log);
    expect(rec.reportedTimestamp).toBe(fabricated);
  });

  it('adds no claim field when the producer supplied no timestamp', () => {
    const log = path.join(tempDir('state-'), 'state.jsonl');
    append(log, { type: 'config' });

    const [rec] = readRecords(log);
    expect(typeof rec.timestamp).toBe('string');
    expect(rec).not.toHaveProperty('reportedTimestamp');
  });

  it('leaves every other field untouched', () => {
    const log = path.join(tempDir('state-'), 'state.jsonl');
    append(log, { type: 'event', event: 'synthesis_complete', totalIterations: 5, stopReason: 'maxIterationsReached' });

    const [rec] = readRecords(log);
    expect(rec.totalIterations).toBe(5);
    expect(rec.stopReason).toBe('maxIterationsReached');
    expect(rec.event).toBe('synthesis_complete');
  });
});

describe('a completed lineage is not failed over the word it chose', () => {
  // The validator is not exported, so completion is asserted through the shapes
  // it reads: the recognised event names, and the artifacts a finished run leaves.
  const NAMES_SEEN_IN_REAL_RUNS = ['synthesis_complete', 'phase_synthesis_complete', 'synthesis'];

  it('recognises every synthesis event name producers actually wrote', () => {
    const src = fs.readFileSync(path.join(RUNTIME, 'scripts', 'fanout-run.cjs'), 'utf8');
    for (const name of NAMES_SEEN_IN_REAL_RUNS) {
      expect(src).toContain(`'${name}'`);
    }
  });

  it('still treats an explicit incomplete report as incomplete', () => {
    const src = fs.readFileSync(path.join(RUNTIME, 'scripts', 'fanout-run.cjs'), 'utf8');
    const set = /SYNTHESIS_EVENT_NAMES = new Set\(\[([^\]]*)\]\)/.exec(src);
    expect(set).not.toBeNull();
    expect(set![1]).not.toContain('synthesis_incomplete');
  });

  it('falls back to artifacts, and the fallback can reach the lineage directory', () => {
    const src = fs.readFileSync(path.join(RUNTIME, 'scripts', 'fanout-run.cjs'), 'utf8');
    // The directory must be threaded in explicitly: it is not a field on the
    // lineage config object, so a fallback reading `lineage.artifactDir` would
    // silently never fire.
    expect(src).toContain('completionFromArtifacts({ lineageDir');
    expect(src).toContain('stopPolicy,\n        lineageDir,');
  });
});
