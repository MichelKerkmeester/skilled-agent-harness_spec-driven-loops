// ───────────────────────────────────────────────────────────────────
// MODULE: Fan-Out Signal Stop Ledger Tests
// ───────────────────────────────────────────────────────────────────
//
// A runner ended by a signal must close each lineage it was running in the ledger, as an
// operator's --stop does. A lineage left open is requeued as an orphan by the next run and
// charged a retry it never failed, and the summary would still call it running.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';

import { afterEach, describe, expect, it } from 'vitest';

import { createHermeticEnv, runtimeRoot, type HermeticEnv } from '../helpers/spawn-cjs';

const fanoutRunScript = join(runtimeRoot, 'scripts', 'fanout-run.cjs');
const SPEC_FOLDER = 'specs/test-fanout-signal-stop';
const RELATIVE_BASE_DIR = `${SPEC_FOLDER}/research`;

const hermeticEnvs: HermeticEnv[] = [];
const ownedGroups: number[] = [];

afterEach(() => {
  while (ownedGroups.length > 0) {
    const pid = ownedGroups.pop();
    try {
      if (pid) process.kill(-pid, 'SIGKILL');
    } catch {
      // Already gone.
    }
  }
  while (hermeticEnvs.length > 0) hermeticEnvs.pop()?.cleanup();
});

type LedgerRow = { event?: string; label?: string; pid?: number; signal?: string; rerun_command?: string; status?: string };

function readLedger(baseDir: string): LedgerRow[] {
  const ledgerPath = join(baseDir, 'orchestration-status.log');
  if (!existsSync(ledgerPath)) return [];
  return readFileSync(ledgerPath, 'utf8')
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line) as LedgerRow);
}

async function waitFor<T>(probe: () => T | null | undefined | false, timeoutMs = 20_000): Promise<T> {
  const startedAt = Date.now();
  for (;;) {
    const value = probe();
    if (value) return value;
    if (Date.now() - startedAt > timeoutMs) throw new Error('timed out waiting for condition');
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 50));
  }
}

describe('fanout-run.cjs — a signal stop closes its lineages in the ledger', () => {
  for (const signal of ['SIGTERM', 'SIGHUP'] as const) {
    it(`records ${signal} as a stopped row with an absolute rerun for the running lineage only`, async () => {
      const hermetic = createHermeticEnv(`fanout-signal-stop-${signal.toLowerCase()}`);
      hermeticEnvs.push(hermetic);
      const binDir = join(hermetic.tmpDir, 'bin');
      mkdirSync(binDir, { recursive: true });
      // The first lineage fails at once and settles before the stop; the second keeps running.
      const marker = join(hermetic.tmpDir, 'first-lineage.marker');
      writeFileSync(
        join(binDir, 'opencode'),
        [
          '#!/bin/sh',
          'if [ "$1" = "--version" ]; then echo 2.3.2; exit 0; fi',
          `if [ ! -e '${marker}' ]; then : > '${marker}'; exit 1; fi`,
          'sleep 60',
          'exit 0',
          '',
        ].join('\n'),
        { mode: 0o755 },
      );
      const baseDir = join(hermetic.tmpDir, RELATIVE_BASE_DIR);
      mkdirSync(baseDir, { recursive: true });
      const args = [
        '--spec-folder', SPEC_FOLDER,
        '--loop-type', 'research',
        '--fanout-config-json', JSON.stringify({
          executors: [{ label: 'seat', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 2 }],
          concurrency: 1,
          maxRetries: 0,
        }),
        // Relative on purpose: the rerun command must not depend on the launch directory.
        '--base-artifact-dir', RELATIVE_BASE_DIR,
      ];
      const env = { ...hermetic.env, PATH: `${binDir}:${hermetic.env['PATH'] ?? ''}` };
      const child = spawn(process.execPath, [fanoutRunScript, ...args], {
        cwd: hermetic.tmpDir,
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      child.stdout?.resume();
      child.stderr?.resume();
      const closed = new Promise<number | null>((resolvePromise) => child.on('close', (code) => resolvePromise(code)));

      const failedLabel = await waitFor(() => readLedger(baseDir).find((row) => row.event === 'failed' && row.label)?.label);
      const running = await waitFor(() => readLedger(baseDir).find((row) => row.event === 'spawned' && row.label !== failedLabel));
      ownedGroups.push(running.pid as number);
      // A log kept from an earlier attempt, carrying what a provider echoes back.
      const runningLog = join(baseDir, 'lineages', running.label as string, 'logs', 'fanout-lineage.out');
      mkdirSync(join(baseDir, 'lineages', running.label as string, 'logs'), { recursive: true });
      writeFileSync(runningLog, 'refused for dev@example.com in workspace wrk_AbCdEf123456\n');

      child.kill(signal);
      await closed;

      const keptLog = readFileSync(runningLog, 'utf8');
      expect(keptLog).not.toContain('dev@example.com');
      expect(keptLog).not.toContain('wrk_AbCdEf123456');

      const ledger = readLedger(baseDir);
      const stoppedRows = ledger.filter((row) => row.event === 'stopped' && row.label);
      expect(stoppedRows.map((row) => row.label)).toEqual([running.label]);
      expect(stoppedRows[0]).toMatchObject({ status: 'stopped', pid: running.pid, signal });
      // One event name, one shape: no label-less row may share the lineage row's name.
      expect(ledger.filter((row) => row.event === 'stopped' && !row.label)).toEqual([]);
      const rerun = stoppedRows[0].rerun_command ?? '';
      expect(rerun).toMatch(new RegExp(`--only-lineage ${running.label}$`));
      const baseArg = rerun.split(' ')[rerun.split(' ').indexOf('--base-artifact-dir') + 1];
      expect(isAbsolute(baseArg)).toBe(true);
      expect(baseArg.endsWith(RELATIVE_BASE_DIR)).toBe(true);

      const summary = JSON.parse(readFileSync(join(baseDir, 'orchestration-summary.json'), 'utf8')) as {
        results?: Array<{ label: string; status: string }>;
      };
      expect(summary.results).toEqual(expect.arrayContaining([
        expect.objectContaining({ label: running.label, status: 'stopped' }),
        expect.objectContaining({ label: failedLabel, status: 'rejected' }),
      ]));

      const status = spawnSync(process.execPath, [fanoutRunScript, '--status', '--base-artifact-dir', RELATIVE_BASE_DIR], {
        cwd: hermetic.tmpDir,
        env,
        encoding: 'utf8',
      });
      expect(status.status).toBe(0);
      const statusLine = status.stdout.split('\n').find((line) => line.startsWith(`${running.label} `)) ?? '';
      expect(statusLine.split(/\s{2,}/)[1]).toBe('stopped');
    }, 60_000);
  }
});

describe('fanout-run.cjs — the bootstrap forwards every signal until its child closes', () => {
  const requireCjs = createRequire(import.meta.url);
  const { forwardSignalsToChild } = requireCjs('../../scripts/fanout-run.cjs') as {
    forwardSignalsToChild: (child: EventEmitter & { kill: (signal: string) => void }) => void;
  };

  function fakeChild() {
    const killed: string[] = [];
    const child = Object.assign(new EventEmitter(), { kill: (signal: string) => { killed.push(signal); } });
    return { child, killed };
  }

  it('forwards a second SIGTERM, and leaves no handler once the child closes', () => {
    const signals = ['SIGINT', 'SIGTERM', 'SIGHUP'] as const;
    const baseline = signals.map((signal) => process.listenerCount(signal));
    const { child, killed } = fakeChild();
    forwardSignalsToChild(child);

    process.emit('SIGTERM');
    process.emit('SIGTERM');
    expect(killed).toEqual(['SIGTERM', 'SIGTERM']);

    child.emit('close', null, 'SIGTERM');
    expect(signals.map((signal) => process.listenerCount(signal))).toEqual(baseline);
  });

  it('stops forwarding to a closed child', () => {
    const { child, killed } = fakeChild();
    forwardSignalsToChild(child);
    child.emit('close', 0, null);

    process.emit('SIGHUP');
    expect(killed).toEqual([]);
  });
});
