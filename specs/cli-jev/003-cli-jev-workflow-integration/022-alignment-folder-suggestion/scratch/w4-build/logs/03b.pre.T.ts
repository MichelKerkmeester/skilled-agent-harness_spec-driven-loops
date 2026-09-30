// ───────────────────────────────────────────────────────────────────
// MODULE: Alignment Suggestion Measurement Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';
import { buildSyntheticTree, formatPathLines, main, replayPath, scanText, summarizeEvents } from '../evals/score-alignment-suggestion';

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
