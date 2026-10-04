// ───────────────────────────────────────────────────────────────────
// MODULE: Alignment Suggestion Measurement Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { binomTail, buildDescriber, buildSyntheticTree, chooseBaseline, countVerdict, decideVerdict, formatPathLines, jevGate, main, modalPick, parseRows, replayPath, runArm, scanText, scanTranscriptFile, scoreProbabilityArm, summarizeEvents, verdictLine, wilsonInterval } from '../evals/score-alignment-suggestion';
import type { Row, VerdictCounts } from '../evals/score-alignment-suggestion';

const tempDirs: string[] = [];

const REPO = resolve(__dirname, '..', '..', '..', '..', '..', '..');

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('line scan', () => {
  it('bands each event by its decision line, not its printed percentage', () => {
    const text = [
      '   Phase 1B Alignment: 040-alpha-beta (40% match)',
      '   Warning: Moderate alignment (55%) - proceeding with caution',
      '   Phase 1B Alignment: 050-gamma (80% match)',
      '   Warning: INFRASTRUCTURE MISMATCH: Work is on .skilled/skill/',
      '   Warning: INFRASTRUCTURE ALIGNMENT WARNING',
    ].join('\n');

    expect(scanText(text)).toEqual([
      { path: 'cli', band: 'moderate', target: '040-alpha-beta', printedScore: 40, alternatives: [], hardBlock: false, pick: null },
      { path: 'cli', band: 'infrastructure', target: '050-gamma', printedScore: 80, alternatives: [], hardBlock: false, pick: null },
    ]);
  });

  it('reads a data-path low event with its alternatives and a pick', () => {
    const text = [
      '   Alignment check: 001-billing-export (0% match)',
      '',
      '   Warning: LOW ALIGNMENT WARNING (0% match)',
      '   The selected folder "001-billing-export" may not match conversation content.',
      '',
      '   Better matching alternatives:',
      '   1. 003-quantum-telemetry (100% match)',
      '   2. 002-quantum-lattice-orchard (100% match)',
      '   3. Continue with "001-billing-export" anyway',
      '   4. Abort and specify different folder',
      '   Proceeding with "001-billing-export" as requested',
    ].join('\n');

    expect(scanText(text)).toEqual([
      { path: 'data', band: 'low', target: '001-billing-export', printedScore: 0, alternatives: ['003-quantum-telemetry', '002-quantum-lattice-orchard'], hardBlock: false, pick: '001-billing-export' },
    ]);
  });

  it('counts unknown and decorated lines as nothing', () => {
    const text = [
      '   Warning: Something unrelated',
      '⚠️  LOW ALIGNMENT WARNING',
      '- below this triggers LOW ALIGNMENT WARNING',
      "console.log('   Content aligns with target folder');",
    ].join('\n');

    expect(scanText(text)).toEqual([]);
  });

  it('reads a JSON-escaped cli-path log with a hard block and no list', () => {
    const text = JSON.stringify({
      output: [
        '   Phase 1B Alignment: 001-research (0% match)',
        '',
        '   Warning: ALIGNMENT WARNING: Content may not match target folder',
        '   Target folder: 001-research (0% match)',
        '',
        '   ALIGNMENT_HARD_BLOCK: 0% alignment is below minimum non-interactive threshold (20%)',
      ].join('\n'),
    });

    expect(scanText(text)).toEqual([
      { path: 'cli', band: 'low', target: '001-research', printedScore: 0, alternatives: [], hardBlock: true, pick: null },
    ]);
  });

  it('finds a header that shares its line with a JSON key', () => {
    const text = JSON.stringify({
      output: [
        '   Alignment check: 007-zeta (10% match)',
        '',
        '   Warning: LOW ALIGNMENT WARNING (10% match)',
      ].join('\n'),
    });

    expect(scanText(text)).toEqual([
      { path: 'data', band: 'low', target: '007-zeta', printedScore: 10, alternatives: [], hardBlock: false, pick: null },
    ]);
  });

  it('ignores validator source quoted in a document', () => {
    const text = [
      '    Warning: INFRASTRUCTURE MISMATCH (${Math.round(workDomain.confidence * 100)}% of files in .opencode/)`);',
      "   Warning: ALIGNMENT WARNING: Content may not match target folder');",
    ].join('\n');

    expect(scanText(text)).toEqual([]);
  });

  it('reads a decision line that ends a JSON string', () => {
    const text = JSON.stringify({ output: '   Phase 1B Alignment: 010-x (90% match)\n' + '   Content aligns with target folder', exit: 0 });

    expect(scanText(text)).toEqual([
      { path: 'cli', band: 'aligned', target: '010-x', printedScore: 90, alternatives: [], hardBlock: false, pick: null },
    ]);
  });
});

describe('census', () => {
  it('summarizes events per path', () => {
    const counts = summarizeEvents([
      { path: 'cli', band: 'low', target: null, printedScore: null, alternatives: ['x', 'y'], hardBlock: false, pick: 'x' },
      { path: 'cli', band: 'low', target: null, printedScore: null, alternatives: [], hardBlock: true, pick: null },
      { path: 'cli', band: 'infrastructure', target: null, printedScore: null, alternatives: [], hardBlock: false, pick: null },
      { path: 'cli', band: 'moderate', target: null, printedScore: null, alternatives: [], hardBlock: false, pick: null },
      { path: 'data', band: 'aligned', target: null, printedScore: null, alternatives: [], hardBlock: false, pick: null },
    ]);

    expect(counts.cli).toEqual({ aligned: 0, moderate: 1, low: 2, infrastructure: 1, below50: 3, withAlternatives: 1, withoutAlternatives: 2, hardBlocks: 1, picks: 1 });
    expect(counts.data).toEqual({ aligned: 1, moderate: 0, low: 0, infrastructure: 0, below50: 0, withAlternatives: 0, withoutAlternatives: 0, hardBlocks: 0, picks: 0 });
    expect(formatPathLines('committed', counts)[0]).toBe('committed path cli: aligned=0 moderate=1 low=2 infrastructure=1 below50=3 with_alternatives=1 without_alternatives=2 hard_blocks=1 picks=1');
  });

  it('a census run makes no model call and writes counts only', async () => {
    const logsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    const stubDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    const reportDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    const specsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(logsDir, stubDir, reportDir, specsDir);

    const a = join(logsDir, 'a.log');
    writeFileSync(a, [
      '   Phase 1B Alignment: 001-research (0% match)',
      '',
      '   Warning: ALIGNMENT WARNING: Content may not match target folder',
      '   Target folder: 001-research (0% match)',
      '',
      '   ALIGNMENT_HARD_BLOCK: 0% alignment is below minimum non-interactive threshold (20%)',
    ].join('\n'));

    const b = join(logsDir, 'b.txt');
    writeFileSync(b, [
      '   Phase 1B Alignment: 902-e2e/001-phase-1 (60% match)',
      '   Warning: Moderate alignment (60%) - proceeding with caution',
    ].join('\n'));

    for (const name of ['jev']) {
      const stub = join(stubDir, name);
      writeFileSync(stub, `#!/bin/sh\necho "$*" >> "$(dirname "$0")/${name}.log"\nexit 0\n`);
      chmodSync(stub, 0o755);
    }

    const out: string[] = [];
    const err: string[] = [];
    const code = await main(['--report', reportDir], {
      out: (line) => out.push(line),
      err: (line) => err.push(line),
      env: { ...process.env, PATH: stubDir + delimiter + process.env.PATH },
      trackedFiles: () => ({ files: [a, b], skippedSource: 1 }),
      specsRoot: specsDir,
    });

    expect(code).toBe(0);
    expect(out).toContain('committed: files=2 events=2 skipped_source=1');
    expect(out).toContain('committed path cli: aligned=0 moderate=1 low=1 infrastructure=0 below50=1 with_alternatives=0 without_alternatives=1 hard_blocks=1 picks=0');
    expect(out).toContain('replay cli: validateContentAlignment root=specs numbered_folders=0 decision=low alternatives listed: 0');
    expect(out).toContain('replay data: validateFolderAlignment root=synthetic numbered_folders=3 decision=low alternatives listed: 2');
    expect(out).toContain('transcript events: not measured');
    expect(existsSync(join(stubDir, 'jev.log'))).toBe(false);
    const report = JSON.parse(readFileSync(join(reportDir, 'report.json'), 'utf8')) as { committed: { events: number } };
    expect(report.committed.events).toBe(2);
  });

  it('--report inside the repository is refused before any output', async () => {
    const out: string[] = [];
    const err: string[] = [];
    const code = await main(['--report', join(REPO, '.skilled', 'skills', 'system-spec-kit', 'SKILL.md', 'report-dir')], {
      trackedFiles: () => ({ files: [], skippedSource: 0 }),
      out: (line) => out.push(line),
      err: (line) => err.push(line),
    });

    expect(code).toBe(2);
    expect(out).toEqual([]);
    expect(err).toEqual(['refused: --report path is inside the repository']);
  });
});

describe('path replay', () => {
  it('the cli path lists no alternative on a root with no numbered folder', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(dir);
    mkdirSync(join(dir, 'cli-jev'));
    mkdirSync(join(dir, 'sk-doc'));

    await expect(replayPath('cli', dir, '000-replay-target')).resolves.toEqual({
      numberedFolders: 0,
      decision: 'low',
      alternatives: [],
    });
  });

  it('the data path lists the higher-scoring siblings and restores the terminal flags', async () => {
    const before = [process.stdout.isTTY, process.stdin.isTTY];
    const tree = buildSyntheticTree();
    tempDirs.push(tree.root);

    await expect(replayPath('data', tree.root, tree.target)).resolves.toEqual({
      numberedFolders: 3,
      decision: 'low',
      alternatives: ['003-quantum-telemetry', '002-quantum-lattice-orchard'],
    });
    expect([process.stdout.isTTY, process.stdin.isTTY]).toEqual(before);
  });
});

function transcriptDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
  tempDirs.push(dir);

  const output = [
    '   Alignment check: 001-billing-export (0% match)',
    '',
    '   Warning: LOW ALIGNMENT WARNING (0% match)',
    '   The selected folder "001-billing-export" may not match conversation content.',
    '',
    '   Better matching alternatives:',
    '   1. 003-quantum-telemetry (100% match)',
    '   2. 002-quantum-lattice-orchard (100% match)',
    '   3. Continue with "001-billing-export" anyway',
    '   4. Abort and specify different folder',
  ].join('\n');

  const lines = [
    JSON.stringify({ type: 'assistant', message: { content: [{ type: 'tool_use', id: 'toolu_1', name: 'Bash', input: { command: "node generate-context.js --json '" + JSON.stringify({ specFolder: '001-billing-export', sessionSummary: 'Paired summary text' }) + "'" } }] } }),
    JSON.stringify({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 'toolu_1', content: output }] }, toolUseResult: { stdout: output } }),
    JSON.stringify({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 'toolu_9', content: output }] }, toolUseResult: { stdout: output } }),
  ];

  writeFileSync(join(dir, 's1.jsonl'), lines.join('\n'));
  return dir;
}

describe('transcripts and rows', () => {
  it('pairs an event with the save call that produced it', () => {
    const dir = transcriptDir();
    const events = scanTranscriptFile(readFileSync(join(dir, 's1.jsonl'), 'utf8'));

    expect(events).toHaveLength(2);
    expect(events[0].state).toBe('Paired summary text');
    expect(events[1].state).toBeNull();
    expect(events.map((event) => event.band)).toEqual(['low', 'low']);
    expect(events[0].alternatives).toHaveLength(2);
    expect(events[1].alternatives).toHaveLength(2);
  });

  it('a transcript census prints counts and no transcript text', async () => {
    const dir = transcriptDir();
    const specsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(specsDir);
    const out: string[] = [];
    const err: string[] = [];

    const code = await main(['--transcripts', dir], {
      out: (line) => out.push(line),
      err: (line) => err.push(line),
      trackedFiles: () => ({ files: [], skippedSource: 0 }),
      specsRoot: specsDir,
    });

    expect(code).toBe(0);
    expect(out).toContain('transcripts: files=1 events=2');
    expect(out).toContain('transcripts path data: aligned=0 moderate=0 low=2 infrastructure=0 below50=2 with_alternatives=2 without_alternatives=0 hard_blocks=0 picks=0');
    expect(out).not.toContain('transcript events: not measured');
    expect(out.join('\n')).not.toContain('Paired summary text');
    expect(out.join('\n')).not.toContain('quantum');
  });

  it('the rows writer leaves every label empty and a null state when no save call pairs', async () => {
    const dir = transcriptDir();
    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    const specsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(rowsDir, specsDir);
    const rowsFile = join(rowsDir, 'rows.jsonl');
    const out: string[] = [];
    const err: string[] = [];

    const code = await main(['--transcripts', dir, '--rows-out', rowsFile], {
      out: (line) => out.push(line),
      err: (line) => err.push(line),
      trackedFiles: () => ({ files: [], skippedSource: 0 }),
      specsRoot: specsDir,
    });

    expect(code).toBe(0);
    expect(out).toContain('rows written: 2 state_null=1');

    const rows = readFileSync(rowsFile, 'utf8').trim().split(/\n/).map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({
      id: 'row-0001',
      path: 'data',
      target: '001-billing-export',
      alternatives: ['003-quantum-telemetry', '002-quantum-lattice-orchard'],
      state: 'Paired summary text',
      gold: null,
      label: '',
    });
    expect(rows[1].id).toBe('row-0002');
    expect(rows[1].state).toBeNull();
    expect(rows[1].label).toBe('');
  });

  it('--rows-out inside the repository is refused before any output', async () => {
    const dir = transcriptDir();
    const out: string[] = [];
    const err: string[] = [];

    const code = await main(
      ['--transcripts', dir, '--rows-out', join(REPO, '.skilled', 'skills', 'system-spec-kit', 'SKILL.md', 'rows.jsonl')],
      { out: (line) => out.push(line), err: (line) => err.push(line), trackedFiles: () => ({ files: [], skippedSource: 0 }) }
    );

    expect(code).toBe(2);
    expect(out).toEqual([]);
    expect(err).toEqual(['refused: --rows-out path is inside the repository']);
  });
});

function writeRows(dir: string, specs: Array<{ label: string; state?: string | null; path?: string }>): string {
  const rowsFile = join(dir, 'rows.jsonl');
  const rows = specs.map((spec, index) => ({
    id: `row-${String(index + 1).padStart(4, '0')}`,
    path: spec.path ?? 'data',
    target: '001-a',
    alternatives: ['002-b', '003-c'],
    state: spec.state === undefined ? 'pick:001-a' : spec.state,
    gold: null,
    label: spec.label,
  }));
  writeFileSync(rowsFile, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
  return rowsFile;
}

describe('scorer and gate', () => {
  it('stops below 30 labeled rows and runs no arm, even with a switch', async () => {
    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    const stubDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    const outDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(rowsDir, stubDir, outDir);

    const f = writeRows(rowsDir, [
      ...Array.from({ length: 29 }, () => ({ label: '001-a' })),
      { label: '' },
    ]);

    for (const name of ['jev']) {
      const stub = join(stubDir, name);
      writeFileSync(stub, `#!/bin/sh\necho "$*" >> "$(dirname "$0")/${name}.log"\nexit 0\n`);
      chmodSync(stub, 0o755);
    }

    const out: string[] = [];
    const err: string[] = [];
    const code = await main(['--score', f, '--jev', '--out', outDir], {
      out: (line) => out.push(line),
      err: (line) => err.push(line),
      env: { ...process.env, PATH: stubDir + delimiter + process.env.PATH },
    });

    expect(code).toBe(0);
    expect(out).toEqual([
      'rows: total=30 labeled=29 callable=29 state_null=0',
      'save path split: content=0 folder=30 other=0',
      'candidate recall: content=0/0 (n/a) folder=29/29 (100.0%) overall=29/29 (100.0%)',
      'stop: fewer than 30 labeled rows (29 labeled)',
    ]);
    expect(existsSync(join(stubDir, 'jev.log'))).toBe(false);
  });

  it('passes the gate at 30 labeled rows', async () => {
    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(rowsDir);

    const f = writeRows(rowsDir, [
      ...Array.from({ length: 27 }, () => ({ label: '001-a' })),
      ...Array.from({ length: 3 }, () => ({ label: '002-b' })),
    ]);

    const out: string[] = [];
    const err: string[] = [];
    const code = await main(['--score', f], { out: (line) => out.push(line), err: (line) => err.push(line) });

    expect(code).toBe(0);
    expect(out).toEqual([
      'rows: total=30 labeled=30 callable=30 state_null=0',
      'save path split: content=0 folder=30 other=0',
      'candidate recall: content=0/0 (n/a) folder=30/30 (100.0%) overall=30/30 (100.0%)',
      'baseline: target=27 top=3 chosen=target comparator=auto',
      'margin: 0.10',
      'keep rule: coverage 10*M>=9*K, kill P(X>=L)<=0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M',
      'question: Which spec folder should this save go to?',
    ]);
  });

  it('reports candidate recall by save path when a destination was not offered', async () => {
    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(rowsDir);

    const f = writeRows(rowsDir, [
      ...Array.from({ length: 15 }, () => ({ label: '001-a', path: 'cli' })),
      ...Array.from({ length: 14 }, () => ({ label: '002-b', path: 'data' })),
      { label: '004-not-offered', path: 'data' },
    ]);

    const out: string[] = [];
    const err: string[] = [];
    const code = await main(['--score', f], { out: (line) => out.push(line), err: (line) => err.push(line) });

    expect(code).toBe(0);
    expect(err).toEqual([]);
    expect(out).toContain('save path split: content=15 folder=15 other=0');
    expect(out).toContain('candidate recall: content=15/15 (100.0%) folder=14/15 (93.3%) overall=29/30 (96.7%)');
  });

  it('honors a predeclared comparator', async () => {
    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(rowsDir);
    const f = writeRows(rowsDir, [
      ...Array.from({ length: 20 }, () => ({ label: '001-a' })),
      ...Array.from({ length: 10 }, () => ({ label: '002-b' })),
    ]);

    const out: string[] = [];
    const err: string[] = [];
    const code = await main(['--score', f, '--baseline', 'target'], { out: (line) => out.push(line), err: (line) => err.push(line) });

    expect(code).toBe(0);
    expect(err).toEqual([]);
    expect(out).toContain('baseline: target=20 top=10 chosen=target comparator=declared');
  });

  it('rejects an unsupported comparator', async () => {
    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(rowsDir);
    const f = writeRows(rowsDir, Array.from({ length: 30 }, () => ({ label: '001-a' })));
    const out: string[] = [];
    const err: string[] = [];

    const code = await main(['--score', f, '--baseline', 'auto'], { out: (line) => out.push(line), err: (line) => err.push(line) });

    expect(code).toBe(2);
    expect(out).toEqual([]);
    expect(err).toEqual(['--baseline must be target or top']);
  });

  it('the baseline stays with the target on a tie', () => {
    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(rowsDir);

    const f = writeRows(rowsDir, [
      ...Array.from({ length: 15 }, () => ({ label: '001-a' })),
      ...Array.from({ length: 15 }, () => ({ label: '002-b' })),
    ]);

    const parsed = parseRows(readFileSync(f, 'utf8'));
    if ('error' in parsed) throw new Error(parsed.error);

    expect(chooseBaseline(parsed.rows)).toEqual({ target: 15, top: 15, chosen: 'target' });
  });

  it('prints no headroom when the baseline is right on more than 90 percent', async () => {
    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(rowsDir);

    const f = writeRows(rowsDir, [
      ...Array.from({ length: 28 }, () => ({ label: '001-a' })),
      ...Array.from({ length: 2 }, () => ({ label: '002-b' })),
    ]);

    const out: string[] = [];
    const err: string[] = [];
    const code = await main(['--score', f], { out: (line) => out.push(line), err: (line) => err.push(line) });

    expect(code).toBe(0);
    expect(out[out.length - 1]).toBe('no headroom baseline_right=28 K=30');
    expect(out.some((line) => line.startsWith('margin:'))).toBe(false);
  });
});

describe('keep rule', () => {
  it('binomTail gives exact tails', () => {
    expect(binomTail(10, 10)).toBeCloseTo(1 / 1024, 12);
    expect(binomTail(5, 0)).toBe(1);
    expect(binomTail(3, 4)).toBe(0);
    expect(binomTail(3, 2)).toBeCloseTo(0.5, 12);
  });

  it('bounds the discordant-row win rate and handles an empty sample', () => {
    const interval = wilsonInterval(10, 11);

    expect(interval.lower).toBeLessThan(10 / 11);
    expect(interval.upper).toBeGreaterThan(10 / 11);
    expect(interval.lower).toBeGreaterThan(0);
    expect(interval.upper).toBeLessThan(1);
    expect(wilsonInterval(0, 0)).toEqual({ lower: 0, upper: 1 });
  });

  it('modalPick finds the mode, an unstable row and a missing answer', () => {
    expect(modalPick(['a', 'a', 'b'])).toEqual({ pick: 'a', flips: 1 });
    expect(modalPick(['a', 'a', 'a'])).toEqual({ pick: 'a', flips: 0 });
    expect(modalPick(['a', 'b', 'c'])).toEqual({ pick: 'unstable', flips: 2 });
    expect(modalPick(['a', null, 'a'])).toEqual({ pick: null, flips: 0 });
  });

  it('counts a column over measured rows only', () => {
    const rowsText = [
      { id: 'r1', path: 'data', target: '001-a', alternatives: ['002-b', '003-c'], state: 's', gold: null, label: '001-a' },
      { id: 'r2', path: 'data', target: '001-a', alternatives: ['002-b', '003-c'], state: 's', gold: null, label: '002-b' },
      { id: 'r3', path: 'data', target: '001-a', alternatives: ['002-b', '003-c'], state: 's', gold: null, label: '001-a' },
    ]
      .map((row) => JSON.stringify(row))
      .join('\n');

    const parsed = parseRows(rowsText);
    if ('error' in parsed) throw new Error(parsed.error);

    const picks = {
      r1: ['001-a', '001-a', '002-b'],
      r2: ['002-b', '002-b', '002-b'],
      r3: ['001-a', null, '001-a'],
    };

    expect(countVerdict(parsed.rows, picks, 'target')).toEqual({ K: 3, M: 2, A: 2, B: 1, W: 1, L: 0, F: 1 });
  });

  it('keeps a column that beats the baseline', () => {
    const c = { K: 30, M: 30, A: 30, B: 20, W: 10, L: 0, F: 0 };

    expect(decideVerdict(c).verdict).toBe('keep');
    expect(decideVerdict(c).p).toBeCloseTo(1 / 1024, 12);
    expect(verdictLine('jev', c, decideVerdict(c), 'target', 'jev_version=jev 0.6.2 provider=official model=m')).toBe(
      'verdict jev: keep K=30 M=30 A=30 B=20 W=10 L=0 F=0 p=0.0010 baseline=target jev_version=jev 0.6.2 provider=official model=m'
    );
  });

  it('kills a column the baseline beats', () => {
    const c = { K: 30, M: 30, A: 5, B: 27, W: 0, L: 22, F: 0 };
    const v = decideVerdict(c);

    expect(v.verdict).toBe('kill');
    expect(v.p).toBeCloseTo(2 ** -22, 15);

    const line = verdictLine('jev', c, v, 'target', 'jev_version=jev 0.6.2 provider=official model=m');
    expect(line.startsWith('verdict jev: kill K=30')).toBe(true);
    expect(line).toContain(' p=0.0000 baseline=target jev_version=jev 0.6.2');
  });

  it('stops on margin and on coverage', () => {
    expect(decideVerdict({ K: 30, M: 30, A: 27, B: 27, W: 0, L: 0, F: 0 })).toEqual({ verdict: 'stop (margin)', p: 1 });
    expect(decideVerdict({ K: 30, M: 26, A: 26, B: 20, W: 6, L: 0, F: 0 })).toEqual({ verdict: 'stop (coverage)', p: 1 });
  });

  it('stops on the sign test and on flips', () => {
    const sign = decideVerdict({ K: 30, M: 30, A: 30, B: 27, W: 3, L: 0, F: 0 });

    expect(sign.verdict).toBe('stop (sign test)');
    expect(sign.p).toBeCloseTo(0.125, 12);
    expect(decideVerdict({ K: 30, M: 30, A: 30, B: 20, W: 10, L: 0, F: 10 }).verdict).toBe('stop (flips)');
  });
});

function makeBackendStubs(): string {
  const dir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
  tempDirs.push(dir);

  const jev = `#!/bin/sh
echo "$*" >> "$(dirname "$0")/jev.log"
case "$1" in
  --version) echo "\${STUB_JEV_VERSION:-jev 0.6.2}"; exit 0 ;;
  auth) if [ "$2" = status ]; then exit "\${STUB_JEV_AUTH:-0}"; fi; echo '{"model":"stub-model"}'; exit 0 ;;
  choice) read -r state; case "$state" in
    split) case "$7" in 003-c=*) k="001-a"; p="0.95" ;; *) k="002-b"; p="0.4" ;; esac; printf '{"model":"stub-model","answers":{"answer":{"choice":"%s","probabilities":{"%s":%s}}}}\\n' "$k" "$k" "$p"; exit 0 ;;
    pick:*) k="\${state#pick:}"; p="\${STUB_JEV_PROB:-0.9}"; printf '{"model":"stub-model","answers":{"answer":{"choice":"%s","probabilities":{"%s":%s}}}}\\n' "$k" "$k" "$p"; exit 0 ;;
  esac; exit 1 ;;
esac
exit 1
`;

  writeFileSync(join(dir, 'jev'), jev);
  chmodSync(join(dir, 'jev'), 0o755);
  return dir;
}

describe('path-resolved descriptions', () => {
  it('shows two same-named folders with their descriptions and excludes archives from the basename index', async () => {
    const specsRoot = mkdtempSync(join(tmpdir(), 'alignment-suggestion-specs-'));
    const stub = makeBackendStubs();
    const outDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(specsRoot, outDir);

    const first = join(specsRoot, 'track-a', '001-deep-research');
    const second = join(specsRoot, 'z_archive', 'track-b', '001-deep-research');
    mkdirSync(first, { recursive: true });
    mkdirSync(second, { recursive: true });
    writeFileSync(join(first, 'description.json'), JSON.stringify({ description: 'Current description' }));
    writeFileSync(join(second, 'description.json'), JSON.stringify({ description: 'Archived description' }));

    const row = {
      id: 'description-collision',
      path: 'cli',
      target: 'track-a/001-deep-research',
      alternatives: ['z_archive/track-b/001-deep-research'],
      state: 'pick:track-a/001-deep-research',
      gold: null,
      label: 'track-a/001-deep-research',
    };
    await runArm(
      'jev',
      [row],
      'target',
      { cmd: [join(stub, 'jev')] },
      {
        out: () => undefined,
        env: { ...process.env, PATH: stub + delimiter + process.env.PATH },
        timeoutMs: 1000,
        backoffMs: 0,
        outDir,
        describe: buildDescriber(specsRoot),
      }
    );

    expect(buildDescriber(specsRoot)('001-deep-research')).toBe('Current description');
    const log = readFileSync(join(stub, 'jev.log'), 'utf8');
    expect(log).toContain('-o track-a/001-deep-research=Current description');
    expect(log).toContain('-o z_archive/track-b/001-deep-research=Archived description');
  });

  it('resolves a bare option to the row sibling over a same-named folder in another track', () => {
    const specsRoot = mkdtempSync(join(tmpdir(), 'alignment-suggestion-specs-'));
    tempDirs.push(specsRoot);

    const sibling = join(specsRoot, 'track-a', '002-other');
    const sameNameElsewhere = join(specsRoot, 'track-b', '002-other');
    const rowPacket = join(specsRoot, 'track-a', '001-own');
    mkdirSync(sibling, { recursive: true });
    mkdirSync(sameNameElsewhere, { recursive: true });
    mkdirSync(rowPacket, { recursive: true });
    writeFileSync(join(sibling, 'description.json'), JSON.stringify({ description: 'Sibling description' }));
    writeFileSync(join(sameNameElsewhere, 'description.json'), JSON.stringify({ description: 'Other-track description' }));

    const describe = buildDescriber(specsRoot);
    expect(describe('002-other')).toBe('002-other');
    expect(describe('002-other', join('track-a', '001-own', 'plan.md'))).toBe('Sibling description');
  });

  it('resolves a census row option to the target sibling when the bare name collides', async () => {
    const specsRoot = mkdtempSync(join(tmpdir(), 'alignment-suggestion-specs-'));
    tempDirs.push(specsRoot);

    const ownPacket = join(specsRoot, 'track-a', '001-own');
    const siblingA = join(specsRoot, 'track-a', '002-other');
    const siblingB = join(specsRoot, 'track-b', '002-other');
    for (const dir of [ownPacket, siblingA, siblingB]) mkdirSync(dir, { recursive: true });
    writeFileSync(join(ownPacket, 'description.json'), JSON.stringify({ description: 'Own description' }));
    writeFileSync(join(siblingA, 'description.json'), JSON.stringify({ description: 'Track A sibling' }));
    writeFileSync(join(siblingB, 'description.json'), JSON.stringify({ description: 'Track B sibling' }));

    const runRow = async (row: Row): Promise<string> => {
      const stub = makeBackendStubs();
      const outDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
      tempDirs.push(outDir);
      await runArm(
        'jev',
        [row],
        'target',
        { cmd: [join(stub, 'jev')] },
        {
          out: () => undefined,
          env: { ...process.env, PATH: stub + delimiter + process.env.PATH },
          timeoutMs: 1000,
          backoffMs: 0,
          outDir,
          describe: buildDescriber(specsRoot),
        }
      );
      return readFileSync(join(stub, 'jev.log'), 'utf8');
    };

    const shared = {
      target: '001-own',
      alternatives: ['002-other'],
      state: 'pick:002-other',
      gold: null,
      label: '002-other',
    };
    const fileRow: Row = { id: 'file-row', path: join('track-a', '001-own', 'plan.md'), ...shared };
    const censusRow: Row = { id: 'census-row', path: 'cli', ...shared };

    const fileLog = await runRow(fileRow);
    const censusLog = await runRow(censusRow);

    expect(fileLog).toContain('-o 002-other=Track A sibling');
    expect(censusLog).toContain('-o 002-other=Track A sibling');
    expect(censusLog).not.toContain('Track B sibling');
    expect(censusLog).not.toContain('-o 002-other=002-other');
  });
});

describe('backend gates', () => {
  it('the jev gate passes a stub with a credential and an accepted payload', () => {
    const stub = makeBackendStubs();
    const out: string[] = [];
    const env = { ...process.env, PATH: stub + delimiter + process.env.PATH };
    const result = jevGate({ out: (line) => out.push(line), env, acceptPayload: true });

    expect(result.passed).toBe(true);
    expect(result.provider).toBe('official');
    expect(out).toEqual([`jev: path=${join(stub, 'jev')} provider=official`]);
  });

  it.each([
    {
      name: 'jev not on PATH',
      jevPath: 'none',
      extraEnv: {},
      acceptPayload: true,
      suffix: (_stub: string) => ['jev arm skipped: jev not on PATH'],
    },
    {
      name: 'version',
      jevPath: 'stub',
      extraEnv: { STUB_JEV_VERSION: 'jev 0.5.0' },
      acceptPayload: true,
      suffix: (stub: string) => ['jev arm skipped: version', `jev: found="jev 0.5.0" path=${join(stub, 'jev')}`],
    },
    {
      name: 'no credential',
      jevPath: 'stub',
      extraEnv: { STUB_JEV_AUTH: '1' },
      acceptPayload: true,
      suffix: (_stub: string) => ['jev arm skipped: no credential'],
    },
    {
      name: 'payload not accepted',
      jevPath: 'stub',
      extraEnv: {},
      acceptPayload: false,
      suffix: (_stub: string) => ['jev arm skipped: payload not accepted'],
    },
  ])('the jev gate skips on $name', ({ jevPath, extraEnv, acceptPayload, suffix }) => {
    const stub = makeBackendStubs();
    const emptyDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(emptyDir);
    const searchPath = jevPath === 'none' ? emptyDir : stub + delimiter + process.env.PATH;
    const out: string[] = [];
    const result = jevGate({ out: (line) => out.push(line), env: { ...process.env, ...extraEnv, PATH: searchPath }, acceptPayload });
    const found = jevPath === 'none' ? 'none' : join(stub, 'jev');

    expect(result.passed).toBe(false);
    expect(out).toEqual([`jev: path=${found} provider=official`, ...suffix(stub)]);
  });

});

describe('model arms', () => {
  it('leaves the census output unchanged when the Jev payload is withheld', async () => {
    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    const outDir1 = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    const outDir2 = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(rowsDir, outDir1, outDir2);
    const stub = makeBackendStubs();

    const f = writeRows(rowsDir, [
      ...Array.from({ length: 20 }, () => ({ label: '001-a', state: 'pick:001-a' })),
      ...Array.from({ length: 10 }, () => ({ label: '002-b', state: 'pick:002-b' })),
    ]);

    const env = { ...process.env, PATH: stub + delimiter + process.env.PATH };
    const firstOut: string[] = [];
    const firstCode = await main(['--score', f, '--out', outDir1], {
      out: (line) => firstOut.push(line),
      env,
      describe: (folder) => folder,
    });
    const secondOut: string[] = [];
    const secondCode = await main(['--score', f, '--jev', '--out', outDir2], {
      out: (line) => secondOut.push(line),
      env,
      describe: (folder) => folder,
    });

    expect(firstCode).toBe(0);
    expect(secondCode).toBe(0);
    expect(secondOut).toContain('jev arm skipped: payload not accepted');
    expect(secondOut.filter((line) => !line.startsWith('jev') && !line.startsWith('pins:'))).toEqual(firstOut);
    expect(secondOut.some((line) => line.startsWith('pins:'))).toBe(true);
    const jevLog = readFileSync(join(stub, 'jev.log'), 'utf8').trim().split(/\n/);
    expect(jevLog.some((line) => line.startsWith('choice'))).toBe(false);
  });

  it('a Jev column with an accepted payload reports its cost and verdict', async () => {
    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    const outDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(rowsDir, outDir);
    const stub = makeBackendStubs();

    const f = writeRows(rowsDir, [
      ...Array.from({ length: 20 }, () => ({ label: '001-a', state: 'pick:001-a' })),
      ...Array.from({ length: 10 }, () => ({ label: '002-b', state: 'pick:002-b' })),
    ]);

    const out: string[] = [];
    const err: string[] = [];
    const code = await main(['--score', f, '--jev', '--accept-payload', '--out', outDir], {
      out: (line) => out.push(line),
      err: (line) => err.push(line),
      env: { ...process.env, PATH: stub + delimiter + process.env.PATH },
      describe: (folder) => folder,
    });

    expect(code).toBe(0);
    expect(out.some((line) => line.startsWith('jev: payload=operator session summaries and folder descriptions planned_calls=91 est_input_tokens='))).toBe(true);
    expect(out).toContain(
      'verdict jev: keep K=30 M=30 A=30 B=20 W=10 L=0 F=0 p=0.0010 baseline=target jev_version=jev 0.6.2 provider=official model=stub-model'
    );
  });

  it('pins corpus, report and scorer hashes and reports discordances, intervals and negative controls', async () => {
    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    const outDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(rowsDir, outDir);
    const stub = makeBackendStubs();
    const f = writeRows(rowsDir, [
      ...Array.from({ length: 19 }, () => ({ label: '001-a', state: 'pick:002-b' })),
      ...Array.from({ length: 10 }, () => ({ label: '003-c', state: 'pick:003-c' })),
      { label: '002-b', state: 'pick:001-a' },
    ]);
    const out: string[] = [];
    const err: string[] = [];

    const code = await main(['--score', f, '--baseline', 'top', '--jev', '--accept-payload', '--out', outDir], {
      out: (line) => out.push(line),
      err: (line) => err.push(line),
      env: { ...process.env, PATH: stub + delimiter + process.env.PATH, STUB_JEV_PROB: '1' },
      describe: (folder) => folder,
    });

    const report = JSON.parse(readFileSync(join(outDir, 'report.json'), 'utf8')) as {
      baseline: { target: number; top: number; chosen: string; comparator: string };
      pins: { corpus_sha256: string; scorer_sha256: string };
      columns: {
        jev: { counts: { W: number; L: number }; discordantRows: unknown[] };
        confidenceGated: { choiceCalls: number };
        negativeControls: { labelSwap: { verdict: string }; distractorState: { verdict: string } };
      };
    };
    const pins = JSON.parse(readFileSync(join(outDir, 'pins.json'), 'utf8')) as Record<string, string>;
    const digest = (contents: Buffer | string): string => createHash('sha256').update(contents).digest('hex');
    const reportBytes = readFileSync(join(outDir, 'report.json'));
    const scorerBytes = readFileSync(resolve(__dirname, '../evals/score-alignment-suggestion.ts'));

    expect(code).toBe(0);
    expect(err).toEqual([]);
    expect(report.baseline).toEqual({ target: 19, top: 1, chosen: 'top', comparator: 'declared' });
    expect(report.columns.jev.counts).toMatchObject({ W: 10, L: 1 });
    expect(report.columns.jev.discordantRows).toHaveLength(11);
    expect(report.columns.confidenceGated.choiceCalls).toBe(30);
    expect(report.columns.negativeControls.labelSwap.verdict).toEqual(expect.any(String));
    expect(report.columns.negativeControls.distractorState.verdict).toEqual(expect.any(String));
    expect(report.pins.corpus_sha256).toBe(digest(readFileSync(f)));
    expect(report.pins.scorer_sha256).toBe(digest(scorerBytes));
    expect(pins).toEqual({
      corpus_sha256: digest(readFileSync(f)),
      report_sha256: digest(reportBytes),
      scorer_sha256: digest(scorerBytes),
    });
    expect(out.some((line) => line.startsWith('jev: W+L=11 interval95=['))).toBe(true);
    expect(out).toContain('confidence-gated: choice_calls=30 full_pass_calls=90 saved=60');
    expect(out.some((line) => line.startsWith('negative control label-swap: W+L='))).toBe(true);
    expect(out.some((line) => line.startsWith('negative control distractor-state: W+L='))).toBe(true);
    expect(out).toContain(`pins: corpus_sha256=${pins.corpus_sha256} report_sha256=${pins.report_sha256} scorer_sha256=${pins.scorer_sha256}`);
    expect(readFileSync(join(stub, 'jev.log'), 'utf8').split('\n').filter((line) => line.startsWith('choice '))).toHaveLength(210);
  });

  it('skips passes two and three only after a probability of exactly 1.0', async () => {
    const stub = makeBackendStubs();
    const row = {
      id: 'gated-row',
      path: 'data',
      target: '001-a',
      alternatives: ['002-b', '003-c'],
      state: 'pick:001-a',
      gold: null,
      label: '001-a',
    };
    const choiceCounts: number[] = [];
    const scoredCounts: VerdictCounts[] = [];
    const scoredPicks: Array<Array<string | null>> = [];

    for (const probability of ['1', '0.99']) {
      const outDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
      tempDirs.push(outDir);
      const result = await runArm(
        'jev',
        [row],
        'target',
        { cmd: [join(stub, 'jev')] },
        {
          out: () => undefined,
          env: { ...process.env, PATH: stub + delimiter + process.env.PATH, STUB_JEV_PROB: probability },
          timeoutMs: 1000,
          backoffMs: 0,
          outDir,
          describe: (folder) => folder,
        },
        { name: 'confidence-gated', confidenceGated: true }
      );
      if ('choiceCalls' in result) choiceCounts.push(result.choiceCalls);
      if ('counts' in result) {
        scoredCounts.push(result.counts);
        scoredPicks.push(result.picks['gated-row']);
      }
    }

    expect(choiceCounts).toEqual([1, 3]);
    // A certainty-one row must still count as measured and score its single pick;
    // asserting only the call count would pass even if the row went unmeasured.
    expect(scoredCounts).toEqual([
      { K: 1, M: 1, A: 1, B: 1, W: 0, L: 0, F: 0 },
      { K: 1, M: 1, A: 1, B: 1, W: 0, L: 0, F: 0 },
    ]);
    expect(scoredPicks).toEqual([['001-a'], ['001-a', '001-a', '001-a']]);
  });
});

describe('probability-aware arm and out guard', () => {
  function splitRows(dir: string): string {
    return writeRows(dir, [
      ...Array.from({ length: 20 }, () => ({ label: '001-a', state: 'split' })),
      ...Array.from({ length: 10 }, () => ({ label: '002-b', state: 'pick:002-b' })),
    ]);
  }

  function runScore(f: string, outDir: string, stub: string, out: string[], err: string[]): Promise<number> {
    return main(['--score', f, '--jev', '--accept-payload', '--out', outDir], {
      out: (line) => out.push(line),
      err: (line) => err.push(line),
      env: { ...process.env, PATH: stub + delimiter + process.env.PATH, JEV_TRANSPORT: 'jev' },
      describe: (folder) => folder,
    });
  }

  it('prints the probability-aware verdict, decided subset, slack and bootstrap after the Jev arm', async () => {
    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    const outDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(rowsDir, outDir);
    const stub = makeBackendStubs();
    const f = splitRows(rowsDir);

    const out: string[] = [];
    const err: string[] = [];
    const code = await runScore(f, outDir, stub, out, err);

    expect(code).toBe(0);
    expect(err).toEqual([]);
    const pinsIndex = out.findIndex((line) => line.startsWith('pins:'));
    expect(pinsIndex).toBeGreaterThan(0);
    expect(out.slice(pinsIndex - 4, pinsIndex)).toEqual([
      'verdict probability-aware: stop (flips) K=30 M=30 A=30 B=20 W=10 L=0 F=20 p=0.0010 baseline=target',
      'decided-subset probability-aware: 30/30 accuracy=1.0000',
      'margin slack probability-aware: 7.0 rows',
      'bootstrap probability-aware vs baseline: accuracy_delta_95_ci=[0.3333,0.3333] clusters=1 replicates=1000',
    ]);
    expect(out.findIndex((line) => line.startsWith('verdict probability-aware:'))).toBeGreaterThan(
      out.findIndex((line) => line.startsWith('verdict jev:'))
    );

    const report = JSON.parse(readFileSync(join(outDir, 'report.json'), 'utf8')) as {
      analysis: { probabilityAware: { line: string } };
      dataPin: { rowCount: number; rows: Array<Record<string, unknown>> };
    };
    expect(report.analysis.probabilityAware.line).toBe(
      'verdict probability-aware: stop (flips) K=30 M=30 A=30 B=20 W=10 L=0 F=20 p=0.0010 baseline=target'
    );
    expect(report.dataPin.rowCount).toBe(30);
    expect(Object.keys(report.dataPin.rows[0])).toEqual(['id', 'target', 'label', 'stateSha256']);
  });

  it("sums each pass's none probability into the none key when the pick named a real folder", async () => {
    const scorerReport = (await import(
      pathToFileURL(join(REPO, '.skilled', 'skills', 'cli-classifier', 'shared', 'scripts', 'scorer-report.mjs')).href
    )) as Parameters<typeof scoreProbabilityArm>[0];
    const rows: Row[] = [
      { id: 'none-row', path: 'data', target: '001-a', alternatives: ['002-b'], state: 's', gold: null, label: 'none_of_these' },
    ];

    const analysis = scoreProbabilityArm(
      scorerReport,
      rows,
      { 'none-row': ['001-a', '001-a', '001-a'] },
      { 'none-row': [0.1, 0.1, 0.1] },
      { 'none-row': [0.9, 0.9, 0.9] },
      'target'
    );

    expect(analysis.probabilityAware).toMatchObject({ K: 1, M: 1, A: 1, B: 0, W: 1, L: 0, F: 0 });
    expect(analysis.probabilityAware.line).toBe(
      'verdict probability-aware: stop (sign test) K=1 M=1 A=1 B=0 W=1 L=0 F=0 p=0.5000 baseline=target'
    );
  });

  it('refuses a second run into the same --out and leaves the first report unchanged', async () => {
    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    const outDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(rowsDir, outDir);
    const stub = makeBackendStubs();
    const f = splitRows(rowsDir);

    const firstCode = await runScore(f, outDir, stub, [], []);
    const reportBytes = readFileSync(join(outDir, 'report.json'));

    const out: string[] = [];
    const err: string[] = [];
    const secondCode = await runScore(f, outDir, stub, out, err);

    expect(firstCode).toBe(0);
    expect(secondCode).toBe(2);
    expect(out).toEqual([]);
    expect(err).toEqual(['--out directory already holds a run']);
    expect(readFileSync(join(outDir, 'report.json')).equals(reportBytes)).toBe(true);
  });
});
