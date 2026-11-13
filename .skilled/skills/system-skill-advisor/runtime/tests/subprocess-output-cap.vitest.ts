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

  // The returned stderr is cut short whatever the cap, so the retry decision is
  // the one reading that shows where collection stopped.
  it('stops reading stderr at the cap, so a busy marker past it is not seen', async () => {
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
    expect(result.errorCode).toBe('NON_ZERO_EXIT');
    expect(result.retriesAttempted).toBe(0);
  });
});
