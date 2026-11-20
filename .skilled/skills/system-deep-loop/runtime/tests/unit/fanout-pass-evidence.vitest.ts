// ───────────────────────────────────────────────────────────────────
// MODULE: Fan-out pass evidence from the runner's own log
// ───────────────────────────────────────────────────────────────────
// A pass is judged from the tool calls the lineage log records between two
// gateway commits, and from the model stamp against the commit time, never
// from what the model's record says about itself.

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

type Commit = { iteration: number | null; committedAt: string; stampedAt?: string | null; findings?: number | null };
type Pass = {
  iteration: number;
  toolCalls: number | null;
  sourceReads: number | null;
  commitGapMs: number | null;
  skewMs: number | null;
  findings: number | null;
  unexamined: boolean | null;
  reasons: string[];
};

const here = fileURLToPath(new URL('.', import.meta.url));
const scriptsDir = resolve(here, '..', '..', 'scripts');
const requireCjs = createRequire(import.meta.url);
const { passEvidence, readLineageCommits, readLineagePassSummary } = requireCjs(
  join(scriptsDir, 'fanout-salvage.cjs'),
) as {
  passEvidence: (log: string, commits: Commit[]) => Pass[];
  readLineageCommits: (lineageDir: string) => Commit[];
  readLineagePassSummary: (lineageDir: string, liveLog?: string) => {
    iterations: number;
    lastCommitAt: string | null;
    flaggedPasses: number | null;
  };
};

const tempDirs: string[] = [];
afterEach(() => {
  while (tempDirs.length > 0) rmSync(tempDirs.pop() as string, { recursive: true, force: true });
});

const T0 = Date.parse('2026-11-20T10:00:00.000Z');
const at = (seconds: number) => new Date(T0 + seconds * 1000).toISOString();

function opencodeTool(tool: string, input: Record<string, unknown>, seconds: number): string {
  const start = T0 + seconds * 1000;
  return JSON.stringify({
    type: 'tool_use',
    timestamp: start + 500,
    sessionID: 'ses_fixture',
    part: { type: 'tool', tool, state: { status: 'completed', input, time: { start, end: start + 500 } } },
  });
}

function opencodeStep(seconds: number): string {
  return JSON.stringify({ type: 'step_start', timestamp: T0 + seconds * 1000, sessionID: 'ses_fixture', part: {} });
}

function claudeTool(name: string, input: Record<string, unknown>, seconds: number): string {
  return JSON.stringify({
    type: 'assistant',
    session_id: 'session-fixture',
    timestamp: at(seconds),
    message: { role: 'assistant', content: [{ type: 'tool_use', id: `toolu_${seconds}`, name, input }] },
  });
}

describe('passEvidence', () => {
  it('counts each pass from the calls between its commit and the previous one', () => {
    const log = [
      opencodeStep(1),
      opencodeTool('read', { filePath: 'a.ts' }, 10),
      opencodeTool('shell', { command: 'rg -n "stamp" runtime/scripts' }, 20),
      opencodeTool('write', { filePath: 'iteration-001.md' }, 30),
      opencodeTool('shell', { command: 'cat b.ts | head -40' }, 70),
    ].join('\n');
    const passes = passEvidence(log, [
      { iteration: null, committedAt: at(0) },
      { iteration: 1, committedAt: at(40), stampedAt: at(39), findings: 3 },
      { iteration: 2, committedAt: at(90), stampedAt: at(89), findings: 1 },
    ]);

    expect(passes).toEqual([
      { iteration: 1, toolCalls: 3, sourceReads: 2, commitGapMs: 40_000, skewMs: -1000, findings: 3, unexamined: false, reasons: [] },
      { iteration: 2, toolCalls: 1, sourceReads: 1, commitGapMs: 50_000, skewMs: -1000, findings: 1, unexamined: false, reasons: [] },
    ]);
  });

  it('flags a batched commit, a pass with no reads and no findings, and a stamp later than its commit', () => {
    const log = [
      opencodeStep(1),
      opencodeTool('read', { filePath: 'a.ts' }, 10),
      opencodeTool('write', { filePath: 'iteration-002.md' }, 50),
    ].join('\n');
    const passes = passEvidence(log, [
      { iteration: null, committedAt: at(0) },
      { iteration: 1, committedAt: at(40), stampedAt: at(100), findings: 2 },
      { iteration: 2, committedAt: at(80), stampedAt: at(79), findings: 0 },
      { iteration: 3, committedAt: at(81), stampedAt: at(80), findings: 1 },
    ]);

    expect(passes.map((pass) => [pass.iteration, pass.unexamined, pass.reasons])).toEqual([
      [1, true, ['future_stamp']],
      [2, true, ['no_reads_no_findings']],
      [3, true, ['batched_commit']],
    ]);
  });

  it('counts claude stream-json tool calls by their event timestamps', () => {
    const log = [
      claudeTool('Read', { file_path: 'a.ts' }, 10),
      claudeTool('Bash', { command: 'sed -n 1,40p b.ts' }, 20),
      claudeTool('Write', { file_path: 'iteration-001.md' }, 30),
    ].join('\n');
    const [pass] = passEvidence(log, [
      { iteration: null, committedAt: at(0) },
      { iteration: 1, committedAt: at(40), stampedAt: at(39), findings: 0 },
    ]);
    expect(pass).toMatchObject({ toolCalls: 3, sourceReads: 2, unexamined: false });
  });

  it('reports counts as unknown for a log with no timed events, never as zero', () => {
    const textLog = 'A plain-text final answer.\nFANOUT_LINEAGE_COMPLETE:cursor';
    const passes = passEvidence(textLog, [
      { iteration: null, committedAt: at(0) },
      { iteration: 1, committedAt: at(40), stampedAt: at(39), findings: 0 },
      { iteration: 2, committedAt: at(42), stampedAt: at(60), findings: 0 },
    ]);
    expect(passes).toEqual([
      { iteration: 1, toolCalls: null, sourceReads: null, commitGapMs: 40_000, skewMs: -1000, findings: 0, unexamined: null, reasons: [] },
      { iteration: 2, toolCalls: null, sourceReads: null, commitGapMs: 2000, skewMs: 18_000, findings: 0, unexamined: true, reasons: ['future_stamp'] },
    ]);
  });
});

function writeFrame(framesDir: string, sequence: number, event: Record<string, unknown>, committedAt: string): void {
  writeFileSync(
    join(framesDir, `${String(sequence).padStart(16, '0')}.frame`),
    JSON.stringify({
      canonical_event_bytes: Buffer.from(JSON.stringify(event)).toString('base64'),
      receipt: { committed_at: committedAt },
      sequence,
    }),
  );
}

function lineageWithLedger(ledgerName: string): { lineageDir: string; framesDir: string } {
  const lineageDir = mkdtempSync(join(tmpdir(), 'fanout-pass-evidence-'));
  tempDirs.push(lineageDir);
  const framesDir = join(lineageDir, ledgerName, 'frames');
  mkdirSync(framesDir, { recursive: true });
  return { lineageDir, framesDir };
}

describe('readLineageCommits and readLineagePassSummary', () => {
  it('reads flaggedPasses as unknown when one attempt left an untimed plain-text log', () => {
    const { lineageDir, framesDir } = lineageWithLedger('deep-research-ledger');
    writeFrame(framesDir, 1, { occurred_at: at(0), payload: { stem: 'deep_research.run_initialized', scope: {}, data: {} } }, at(0));
    writeFrame(framesDir, 2, {
      occurred_at: at(39),
      payload: { stem: 'deep_research.iteration_completed', scope: { iteration: 1 }, data: { findingsCount: 2 } },
    }, at(40));
    writeFrame(framesDir, 3, {
      occurred_at: at(44),
      payload: { stem: 'deep_research.iteration_completed', scope: { iteration: 2 }, data: { findingsCount: 1 } },
    }, at(45));
    mkdirSync(join(lineageDir, 'logs'));
    writeFileSync(join(lineageDir, 'logs', 'fanout-lineage.1.out'), 'Iteration 2 written by a text-mode attempt.\n');
    writeFileSync(join(lineageDir, 'logs', 'fanout-lineage.out'), [opencodeStep(1), opencodeTool('read', { filePath: 'a.ts' }, 10)].join('\n'));

    expect(readLineagePassSummary(lineageDir)).toEqual({ iterations: 2, lastCommitAt: at(45), flaggedPasses: null });
  });

  it('reads research commits and summarizes the lineage from its logs on disk', () => {
    const { lineageDir, framesDir } = lineageWithLedger('deep-research-ledger');
    writeFrame(framesDir, 1, { occurred_at: at(0), payload: { stem: 'deep_research.run_initialized', scope: {}, data: {} } }, at(0));
    writeFrame(framesDir, 2, {
      occurred_at: at(39),
      payload: { stem: 'deep_research.iteration_completed', scope: { iteration: 1 }, data: { findingsCount: 4 } },
    }, at(40));
    writeFrame(framesDir, 3, { occurred_at: at(41), payload: { stem: 'deep_research.synthesis_complete', scope: {}, data: {} } }, at(41));
    mkdirSync(join(lineageDir, 'logs'));
    writeFileSync(join(lineageDir, 'logs', 'fanout-lineage.out'), [opencodeStep(1), opencodeTool('read', { filePath: 'a.ts' }, 10)].join('\n'));

    expect(readLineageCommits(lineageDir)).toEqual([
      { iteration: null, committedAt: at(0), stampedAt: null, findings: null },
      { iteration: 1, committedAt: at(40), stampedAt: at(39), findings: 4 },
    ]);
    expect(readLineagePassSummary(lineageDir)).toEqual({ iterations: 1, lastCommitAt: at(40), flaggedPasses: 0 });
  });

  it('judges a gateway-timed research pass by the stamp the model claimed', () => {
    const { lineageDir, framesDir } = lineageWithLedger('deep-research-ledger');
    writeFrame(framesDir, 1, { occurred_at: at(0), payload: { stem: 'deep_research.run_initialized', scope: {}, data: {} } }, at(0));
    writeFrame(framesDir, 2, {
      occurred_at: at(40),
      payload: { stem: 'deep_research.iteration_completed', scope: { iteration: 1 }, data: { findingsCount: 3, claimedTimestamp: at(90) } },
    }, at(40));

    expect(readLineageCommits(lineageDir)).toEqual([
      { iteration: null, committedAt: at(0), stampedAt: null, findings: null },
      { iteration: 1, committedAt: at(40), stampedAt: at(90), findings: 3 },
    ]);
  });

  it('takes the stamp from a review record and leaves flaggedPasses unknown while a pass cannot be judged', () => {
    const { lineageDir, framesDir } = lineageWithLedger('deep-review-ledger');
    writeFrame(framesDir, 1, { occurred_at: at(0), payload: { stem: 'deep_review.run_initialized', scope: {}, data: {} } }, at(0));
    writeFrame(framesDir, 2, {
      occurred_at: at(39),
      payload: {
        stem: 'deep_review.iteration_recorded',
        scope: {},
        data: { record: { iteration: 1, findingsCount: 0, timestamp: at(120) } },
      },
    }, at(40));

    expect(readLineageCommits(lineageDir)).toEqual([
      { iteration: null, committedAt: at(0), stampedAt: null, findings: null },
      { iteration: 1, committedAt: at(40), stampedAt: at(120), findings: 0 },
    ]);
    expect(readLineagePassSummary(lineageDir)).toEqual({ iterations: 1, lastCommitAt: at(40), flaggedPasses: 1 });

    writeFrame(framesDir, 3, {
      occurred_at: at(99),
      payload: { stem: 'deep_review.iteration_recorded', scope: {}, data: { record: { iteration: 2, findingsCount: 0 } } },
    }, at(100));
    expect(readLineagePassSummary(lineageDir).flaggedPasses).toBeNull();
    expect(readLineagePassSummary(lineageDir, [opencodeStep(50), opencodeTool('read', { filePath: 'a.ts' }, 60)].join('\n')))
      .toEqual({ iterations: 2, lastCommitAt: at(100), flaggedPasses: 1 });
  });
});
