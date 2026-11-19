// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Subprocess Output Cap Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { runAdvisorSubprocess } from '../lib/subprocess.js';

let workspaceRoot = '';

function writeScript(source: string): string {
  const path = join(workspaceRoot, 'advisor-child.cjs');
  writeFileSync(path, source, 'utf8');
  return path;
}

beforeEach(() => {
  workspaceRoot = mkdtempSync(join(tmpdir(), 'subprocess-output-cap-'));
});

afterEach(() => {
  rmSync(workspaceRoot, { recursive: true, force: true });
});

describe('runAdvisorSubprocess output cap', () => {
  it('reports a parse failure when a large array is cut short', async () => {
    const scriptPath = writeScript(`
process.stdin.resume();
process.stdin.on('end', () => {
  process.stdout.write(JSON.stringify(['x'.repeat(2 * 1024 * 1024)]));
});
`);
    const result = await runAdvisorSubprocess('prompt', {
      workspaceRoot,
      pythonBin: process.execPath,
      scriptPath,
      timeoutMs: 10000,
    });

    expect(result.errorCode).toBe('JSON_PARSE_FAILED');
  });

  // The cap bounds what is kept, not what is scanned, so a busy marker written
  // past it still decides the retry.
  it('retries once on a busy marker written after the cap', async () => {
    const scriptPath = writeScript(`
process.stdin.resume();
process.stdin.on('end', () => {
  process.stderr.write('e'.repeat(1024 * 1024));
  process.stderr.write('\\ndatabase is locked\\n');
  process.exitCode = 1;
});
`);
    const result = await runAdvisorSubprocess('prompt', {
      workspaceRoot,
      pythonBin: process.execPath,
      scriptPath,
      timeoutMs: 10000,
    });

    expect(result.ok).toBe(false);
    expect(result.errorCode).toBe('SQLITE_BUSY_EXHAUSTED');
    expect(result.retriesAttempted).toBe(1);
  });

  it('retries once on a busy marker split across two writes after the cap', async () => {
    const scriptPath = writeScript(`
process.stdin.resume();
process.stdin.on('end', () => {
  process.stderr.write('e'.repeat(1024 * 1024));
  process.stderr.write('\\ndatabase is ');
  setTimeout(() => {
    process.stderr.write('locked\\n');
    process.exitCode = 1;
  }, 20);
});
`);
    const result = await runAdvisorSubprocess('prompt', {
      workspaceRoot,
      pythonBin: process.execPath,
      scriptPath,
      timeoutMs: 10000,
    });

    expect(result.ok).toBe(false);
    expect(result.errorCode).toBe('SQLITE_BUSY_EXHAUSTED');
    expect(result.retriesAttempted).toBe(1);
  });
});

describe('runAdvisorSubprocess recommendation parser', () => {
  // The hook holds a floored route back against the session's earlier route,
  // so the flag has to survive the parse.
  it.each([
    ['keeps', true],
    ['does not add', false],
  ] as const)('%s the confidence floor flag', async (_label, floored) => {
    const row = {
      skill: 'sk-code',
      confidence: 0.82,
      uncertainty: 0.2,
      passes_threshold: true,
      ...(floored ? { confidenceFloored: true } : {}),
    };
    const scriptPath = writeScript(`
process.stdin.resume();
process.stdin.on('end', () => {
  process.stdout.write(${JSON.stringify(JSON.stringify([row]))});
});
`);
    const result = await runAdvisorSubprocess('prompt', {
      workspaceRoot,
      pythonBin: process.execPath,
      scriptPath,
      timeoutMs: 10000,
    });

    expect(result.ok).toBe(true);
    expect(result.recommendations[0]?.confidenceFloored).toBe(floored ? true : undefined);
  });
});
