import { describe, expect, it } from 'vitest';

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runAuditedExecutorCommandAsync } from '../../lib/deep-loop/executor-audit.js';
import type { ExecutorConfig } from '../../lib/deep-loop/executor-config.js';

const posixIt = process.platform === 'win32' ? it.skip : it;

/**
 * Returns a default CLI executor config for use in tests.
 */
function cliClaudeExecutor(): ExecutorConfig {
  return {
    kind: 'cli-claude-code',
    model: 'claude-opus-4-6',
    reasoningEffort: 'high',
    serviceTier: null,
    sandboxMode: null,
    timeoutSeconds: 900,
  };
}

/**
 * Checks whether a process is alive using a zero-signal kill probe.
 */
function processIsAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/**
 * Polls until a process is no longer alive, with a limited number of attempts.
 */
async function waitUntilDead(pid: number): Promise<void> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (!processIsAlive(pid)) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

describe('executor-audit process-group supervisor', () => {
  posixIt('kills a SIGTERM-ignoring child and grandchild process group after timeout escalation', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'executor-process-group-'));
    const stateLogPath = join(tempDir, 'state.jsonl');
    const childScriptPath = join(tempDir, 'ignore-sigterm-child.cjs');
    const pidsPath = join(tempDir, 'pids.json');

    try {
      writeFileSync(stateLogPath, '{"type":"event","event":"start"}\n', 'utf8');
      writeFileSync(
        childScriptPath,
        [
          "const { spawn } = require('node:child_process');",
          "const { writeFileSync } = require('node:fs');",
          "const grandchild = spawn(process.execPath, ['-e', \"process.on('SIGTERM', () => {}); setInterval(() => {}, 1000);\"], { stdio: 'ignore' });",
          "writeFileSync(process.argv[2], JSON.stringify({ child: process.pid, grandchild: grandchild.pid }));",
          "process.on('SIGTERM', () => {});",
          'setInterval(() => {}, 1000);',
          '',
        ].join('\n'),
        'utf8',
      );

      const exitCode = await runAuditedExecutorCommandAsync({
        command: process.execPath,
        args: [childScriptPath, pidsPath],
        cwd: tempDir,
        timeoutSeconds: 0.15,
        timeoutGraceMs: 75,
        stateLogPath,
        executor: cliClaudeExecutor(),
        iteration: 4,
        guardContext: {
          env: {},
          ancestryCmdlines: [],
          statePaths: [],
        },
      });

      const pids = JSON.parse(readFileSync(pidsPath, 'utf8')) as { child: number; grandchild: number };
      await waitUntilDead(pids.child);
      await waitUntilDead(pids.grandchild);

      const records = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n').map((line) => JSON.parse(line));
      expect(exitCode).toBe(0);
      expect(processIsAlive(pids.child)).toBe(false);
      expect(processIsAlive(pids.grandchild)).toBe(false);
      expect(records.at(-1)).toMatchObject({
        type: 'event',
        event: 'dispatch_failure',
        iteration: 4,
        reason: 'timeout',
        executor: { kind: 'cli-claude-code' },
      });
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
