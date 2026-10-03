// ───────────────────────────────────────────────────────────────────
// MODULE: capture-reviewer-outputs
//   Path classification (classifyPath)
//   Capture run (main)
//   No-call guarantee (spawned run)
//   Default output path (spawned run)
//   Refusals (main)
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const CAPTURE = path.join(TEST_DIR, '../lib/capture-reviewer-outputs.cjs');
const capture = require(CAPTURE) as Record<string, any>;
const reviewerScorer = require(path.join(TEST_DIR, '../lib/reviewer-scorer.cjs')) as Record<string, any>;

const tempDirs: string[] = [];

function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

const TREE: Record<string, string> = {
  'a/review/iterations/iteration-001.md': '# Iteration 1\n\nVERDICT: PASS\n',
  'a/review/iterations/iteration-002.md': '# Iteration 2\n\nReview verdict: CONDITIONAL\n',
  'a/review/review-report.md': '# Report\n\nVerdict: FAIL\n',
  'b/review/lineages/x/iterations/iteration-001.md': '# Iteration 1\n\nVERDICT: PASS\n',
  'c/review/iterations/iteration-003.md': `${'x'.repeat(200)}\nVERDICT: PASS\n`,
  'a/review/prompts/iteration-001.md': 'VERDICT: BLOCK\n',
  'a/research/iterations/iteration-001.md': 'VERDICT: BLOCK\n',
  'node_modules/p/review/iterations/iteration-001.md': 'VERDICT: BLOCK\n',
};

function writeTree(root: string): string {
  for (const [relative, text] of Object.entries(TREE)) {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  }
  return root;
}

function runCapture(argv: string[]): { code: number; stdout: string[]; stderr: string[] } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const code = capture.main(argv, {
    out: (line: string) => stdout.push(line),
    err: (line: string) => stderr.push(line),
  });
  return { code, stdout, stderr };
}

describe('capture-reviewer-outputs', () => {
  it('classifies iteration and report paths and rejects lookalikes', () => {
    const table: Array<[string, string | null]> = [
      ['x/review/iterations/iteration-001.md', 'iteration'],
      ['x/review/lineages/a/iterations/iteration-012.md', 'iteration'],
      ['x/review/iterations-codex/iteration-001.md', 'iteration'],
      ['x/review/prompts/iteration-001.md', null],
      ['x/research/iterations/iteration-001.md', null],
      ['x/review/iterations/iteration-template.md', null],
      ['x/review-report.md', 'report'],
      ['x/review/review-report-v2.md', 'report'],
    ];
    for (const [input, expected] of table) {
      expect(capture.classifyPath(input)).toBe(expected);
    }
  });

  it('captures deduplicated rows and prints the census line', () => {
    const root = writeTree(tempDir('capture-root-'));
    const outFile = path.join(tempDir('capture-out-'), 'nested', 'rows.jsonl');
    const { code, stdout, stderr } = runCapture(['--root', root, '--out', outFile, '--max-bytes', '128']);

    expect(code).toBe(0);
    expect(stderr).toEqual([]);
    expect(stdout).toEqual([
      `census: rows=3 regex_misses=1 regex_hits=2 (pass 1, fail 1, block 0, abstain 0) iterations=2 reports=1 files=5 duplicates=1 oversize=1 out=${outFile}`,
    ]);

    expect(fs.existsSync(outFile)).toBe(true);
    expect(fs.statSync(outFile).mode & 0o777).toBe(0o600);

    const rows = fs
      .readFileSync(outFile, 'utf8')
      .split('\n')
      .filter((line) => line.length > 0)
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(rows).toHaveLength(3);
    expect(rows[0].kind).toBe('iteration');
    expect(rows[0].copies).toBe(2);
    expect(rows[1].kind).toBe('iteration');
    expect(rows[1].copies).toBe(1);
    expect(rows[2].kind).toBe('report');
    expect(rows.map((row) => row.regexVerdict)).toEqual(['pass', null, 'fail']);
    for (const row of rows) {
      expect(Object.keys(row)).toEqual(['id', 'sha256', 'kind', 'source', 'copies', 'bytes', 'regexVerdict', 'regexMethod', 'output']);
      expect(row.id).toBe((row.sha256 as string).slice(0, 16));
      expect(row.regexVerdict).toBe(reviewerScorer.extractVerdict(row.output as string).verdict);
      expect('label' in row).toBe(false);
    }
  });

  it('makes no external call and writes a byte-stable file', () => {
    const root = writeTree(tempDir('capture-root-'));
    const bin = tempDir('capture-bin-');
    const jev = path.join(bin, 'jev');
    fs.writeFileSync(
      jev,
      ['#!/bin/sh', 'printf \'%s\\n\' "$*" >> "$(dirname "$0")/jev.log"', 'exit 0', ''].join('\n'),
      { mode: 0o755 },
    );
    fs.chmodSync(jev, 0o755);
    const outDir = tempDir('capture-out-');
    const out1 = path.join(outDir, 'one.jsonl');
    const out2 = path.join(outDir, 'two.jsonl');
    const env = { ...process.env, PATH: `${bin}:${process.env.PATH}`, JEV_TRANSPORT: 'jev' };

    const first = spawnSync(process.execPath, [CAPTURE, '--root', root, '--out', out1], { env, encoding: 'utf8' });
    const second = spawnSync(process.execPath, [CAPTURE, '--root', root, '--out', out2], { env, encoding: 'utf8' });

    expect(first.status).toBe(0);
    expect(second.status).toBe(0);
    expect(fs.readFileSync(out2, 'utf8')).toBe(fs.readFileSync(out1, 'utf8'));
    expect(fs.existsSync(path.join(bin, 'jev.log'))).toBe(false);
  });

  it('defaults the output file under HOME', () => {
    const root = writeTree(tempDir('capture-root-'));
    const home = tempDir('capture-home-');
    const result = spawnSync(process.execPath, [CAPTURE, '--root', root], {
      env: { ...process.env, HOME: home, JEV_TRANSPORT: 'jev' },
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    const expected = path.join(home, '.skilled', '.labels', '025-real-outputs.jsonl');
    expect(fs.existsSync(expected)).toBe(true);
    expect(result.stdout.trimEnd().endsWith(`out=${expected}`)).toBe(true);
  });

  it('refuses a missing root and a non-positive max-bytes', () => {
    const root = writeTree(tempDir('capture-root-'));
    const outDir = tempDir('capture-out-');
    const outFile = path.join(outDir, 'never.jsonl');
    const missing = path.join(outDir, 'definitely-missing');

    const missingRun = runCapture(['--root', missing, '--out', outFile]);
    expect(missingRun.code).toBe(2);
    expect(missingRun.stderr.some((line) => line.includes('root not found:'))).toBe(true);
    expect(missingRun.stdout).toEqual([]);
    expect(fs.existsSync(outFile)).toBe(false);

    const bytesRun = runCapture(['--root', root, '--out', outFile, '--max-bytes', '0']);
    expect(bytesRun.code).toBe(2);
    expect(bytesRun.stderr.some((line) => line.includes('--max-bytes must be a positive integer'))).toBe(true);
    expect(bytesRun.stdout).toEqual([]);
    expect(fs.existsSync(outFile)).toBe(false);
  });
});
