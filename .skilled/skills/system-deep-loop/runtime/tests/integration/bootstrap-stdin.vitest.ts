// ───────────────────────────────────────────────────────────────────
// MODULE: TSX Bootstrap Stdin Integration Tests
// ───────────────────────────────────────────────────────────────────
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  cleanupNamespace,
  namespaceArgs,
  runtimeRoot,
  uniqueNamespace,
  type ScriptNamespace,
} from '../helpers/spawn-cjs';

// An automated runner often hands a script a stdin it never writes or closes.
// The bootstrap that re-executes a script under the TSX loader must not read
// that stdin itself: a blocking read never returns, and a non-blocking one
// throws EAGAIN before the script can validate its arguments.

const STDIN_TIMEOUT_MS = 20000;
const BOOTSTRAPPED_SCRIPTS = ['convergence', 'query', 'status', 'upsert'] as const;

interface OpenStdinRun {
  exitCode: number | null;
  timedOut: boolean;
  stdout: string;
  stderr: string;
}

/**
 * Runs a script with a stdin pipe that is never written or closed unless
 * `input` is given, and kills it after the timeout.
 */
function runWithOpenStdin(scriptName: string, args: string[], input?: string): Promise<OpenStdinRun> {
  return new Promise((done) => {
    const child = spawn(process.execPath, [resolve(runtimeRoot, 'scripts', `${scriptName}.cjs`), ...args], {
      cwd: runtimeRoot,
      env: process.env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, STDIN_TIMEOUT_MS);
    child.on('close', (exitCode) => {
      clearTimeout(timer);
      done({ exitCode, timedOut, stdout: stdout.trim(), stderr: stderr.trim() });
    });
    if (input !== undefined) {
      child.stdin.end(input);
    }
  });
}

function lastJsonLine(stdout: string): Record<string, unknown> {
  const line = stdout.split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';
  return JSON.parse(line) as Record<string, unknown>;
}

const namespaces: ScriptNamespace[] = [];

afterEach(async () => {
  while (namespaces.length > 0) {
    const namespace = namespaces.pop();
    if (namespace) await cleanupNamespace(namespace);
  }
});

describe('TSX bootstrap with an open stdin', () => {
  for (const scriptName of BOOTSTRAPPED_SCRIPTS) {
    it(`${scriptName}.cjs reports a bad loop type without reading stdin`, async () => {
      const run = await runWithOpenStdin(scriptName, [
        '--spec-folder', 'specs/bootstrap-stdin-probe',
        '--session-id', 'probe',
        '--loop-type', 'not-a-loop-type',
      ]);

      expect(run.timedOut, run.stderr).toBe(false);
      expect(run.exitCode, run.stderr).toBe(3);
      expect(lastJsonLine(run.stdout)).toMatchObject({ status: 'error', code: 'INPUT_VALIDATION' });
    }, STDIN_TIMEOUT_MS + 10000);
  }

  it('upsert.cjs still reads --events - from stdin', async () => {
    const namespace = uniqueNamespace('upsert-stdin-events');
    namespaces.push(namespace);

    const run = await runWithOpenStdin('upsert', [...namespaceArgs(namespace), '--events', '-'], 'not json');

    expect(run.timedOut, run.stderr).toBe(false);
    expect(run.exitCode, run.stderr).toBe(3);
    expect(lastJsonLine(run.stdout)).toMatchObject({ status: 'error', code: 'INPUT_VALIDATION' });
    expect(String(lastJsonLine(run.stdout).error)).toContain('events must be valid JSON');
  }, STDIN_TIMEOUT_MS + 10000);
});
