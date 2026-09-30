// ───────────────────────────────────────────────────────────────────
// MODULE: Alignment Suggestion Measurement Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';
import { binomTail, buildSyntheticTree, chooseBaseline, countVerdict, decideVerdict, deemGate, formatPathLines, jevGate, main, modalPick, parseRows, replayPath, scanText, scanTranscriptFile, summarizeEvents, verdictLine } from '../evals/score-alignment-suggestion';

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

    for (const name of ['jev', 'cli-deem']) {
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
    expect(existsSync(join(stubDir, 'cli-deem.log'))).toBe(false);
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

function writeRows(dir: string, specs: Array<{ label: string; state?: string | null }>): string {
  const rowsFile = join(dir, 'rows.jsonl');
  const rows = specs.map((spec, index) => ({
    id: `row-${String(index + 1).padStart(4, '0')}`,
    path: 'data',
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

    for (const name of ['jev', 'cli-deem']) {
      const stub = join(stubDir, name);
      writeFileSync(stub, `#!/bin/sh\necho "$*" >> "$(dirname "$0")/${name}.log"\nexit 0\n`);
      chmodSync(stub, 0o755);
    }

    const out: string[] = [];
    const err: string[] = [];
    const code = await main(['--score', f, '--deem', '--out', outDir], {
      out: (line) => out.push(line),
      err: (line) => err.push(line),
      env: { ...process.env, PATH: stubDir + delimiter + process.env.PATH },
    });

    expect(code).toBe(0);
    expect(out).toEqual([
      'rows: total=30 labeled=29 callable=29 state_null=0',
      'stop: fewer than 30 labeled rows (29 labeled)',
    ]);
    expect(existsSync(join(stubDir, 'jev.log'))).toBe(false);
    expect(existsSync(join(stubDir, 'cli-deem.log'))).toBe(false);
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
      'baseline: target=27 top=3 chosen=target',
      'margin: 0.10',
      'keep rule: coverage 10*M>=9*K, kill P(X>=L)<=0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M',
      'question: Which spec folder should this save go to?',
    ]);
  });

  it('rejects a foreign label by row id', async () => {
    const rowsDir = mkdtempSync(join(tmpdir(), 'alignment-suggestion-'));
    tempDirs.push(rowsDir);

    const f = writeRows(rowsDir, Array.from({ length: 30 }, (_, index) => ({
      label: index === 3 ? '999-elsewhere' : index === 6 ? 'bogus' : '001-a',
    })));

    const out: string[] = [];
    const err: string[] = [];
    const code = await main(['--score', f], { out: (line) => out.push(line), err: (line) => err.push(line) });

    expect(code).toBe(2);
    expect(out).toEqual([]);
    expect(err).toEqual(['foreign label in rows: row-0004, row-0007']);
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
    expect(verdictLine('deem', c, decideVerdict(c), 'target', 'model=deem-0.8-v1 model_commit=m1 source_commit=s1')).toBe(
      'verdict deem: keep K=30 M=30 A=30 B=20 W=10 L=0 F=0 p=0.0010 baseline=target model=deem-0.8-v1 model_commit=m1 source_commit=s1'
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
  choice) read -r state; case "$state" in pick:*) k="\${state#pick:}"; printf '{"model":"stub-model","answers":{"answer":{"choice":"%s","probabilities":{"%s":0.9}}}}\\n' "$k" "$k"; exit 0 ;; esac; exit 1 ;;
esac
exit 1
`;
  const cliDeem = `#!/bin/sh
echo "$*" >> "$(dirname "$0")/cli-deem.log"
case "$1" in
  health)
    case "\${STUB_DEEM_HEALTH:-ok}" in
      ok) echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}'; exit 0 ;;
      unreachable) exit 4 ;;
      stub) echo '{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}'; exit 0 ;;
      model) echo '{"ok":true,"backend":"torch","model":"other-model","model_commit":"m1","source_commit":"s1"}'; exit 0 ;;
      bad) echo 'not json'; exit 0 ;;
    esac ;;
  choice) read -r state; case "$state" in pick:*) k="\${state#pick:}"; printf '{"answers":{"answer":{"choice":"%s","probabilities":{"%s":0.9}}}}\\n' "$k" "$k"; exit 0 ;; esac; exit 1 ;;
esac
exit 1
`;

  writeFileSync(join(dir, 'jev'), jev);
  chmodSync(join(dir, 'jev'), 0o755);
  writeFileSync(join(dir, 'cli-deem'), cliDeem);
  chmodSync(join(dir, 'cli-deem'), 0o755);
  return dir;
}

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

  it('the deem gate passes a healthy stub', () => {
    const stub = makeBackendStubs();
    const out: string[] = [];
    const env = { ...process.env, PATH: stub + delimiter + process.env.PATH, STUB_DEEM_HEALTH: 'ok' };
    const result = deemGate({ out: (line) => out.push(line), env });

    expect(result.passed).toBe(true);
    expect(out).toEqual(['deem: health backend=torch model=deem-0.8-v1 model_commit=m1 source_commit=s1']);
  });

  it.each([
    { health: 'unreachable', expected: ['deem arm skipped: not reachable'] },
    { health: 'stub', expected: ['deem arm skipped: stub backend'] },
    { health: 'model', expected: ['deem arm skipped: model', 'deem: found="other-model"'] },
    { health: 'bad', expected: ['deem arm skipped: bad health response', 'deem: found="not json"'] },
  ])('the deem gate skips on $health', ({ health, expected }) => {
    const stub = makeBackendStubs();
    const out: string[] = [];
    const env = { ...process.env, PATH: stub + delimiter + process.env.PATH, STUB_DEEM_HEALTH: health };
    const result = deemGate({ out: (line) => out.push(line), env });

    expect(result.passed).toBe(false);
    expect(out).toEqual(expected);
  });
});
