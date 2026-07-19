import { describe, expect, it } from 'vitest';

import { classifyProcesses, type ClassifiedProcess, type Inventory, type PidLockState } from '../ops/process-memory-harness.js';
import { planSweep } from '../ops/process-sweep.js';

function inventory(processes: ClassifiedProcess[], pidLocks: PidLockState[] = [], currentPid = 1000): Inventory {
  return {
    status: 'ok',
    timestamp: '2026-05-22T00:00:00.000Z',
    currentPid,
    currentAncestors: [],
    hostMemory: {
      pageSizeBytes: null,
      totalMemoryBytes: null,
      pages: {},
      approx: {},
      warnings: [],
    },
    processCount: processes.length,
    projectDaemonCount: processes.filter((row) => row.role === 'project-daemon').length,
    expectedDaemonCount: processes.filter((row) => row.role === 'expected-daemon').length,
    zombieCount: processes.filter((row) => row.role === 'zombie').length,
    orphanedProjectDaemonCount: processes.filter((row) => row.isOrphanedProjectDaemon).length,
    terminationCandidateCount: processes.filter((row) => row.terminationCandidate).length,
    processes,
    pidLocks,
  };
}

function degradedInventory(status: Inventory['status'], error?: string): Inventory {
  return {
    ...inventory([]),
    status,
    ...(error ? { error } : {}),
    processCount: 0,
    processes: [],
    pidLocks: [],
  };
}

function classifyRows(rows: Array<{ pid: number; ppid: number; command: string; stat?: string; rssKb?: number; eperm?: boolean }>): ClassifiedProcess[] {
  return classifyProcesses(
    rows.map((row) => ({
      stat: 'S',
      rssKb: 1000,
      ...row,
    })),
    { currentPid: 9999 },
  );
}

describe('process sweep', () => {
  it('never marks the current PID as eligible regardless of classification', () => {
    const processes = classifyRows([
      {
        pid: 5678,
        ppid: 1,
        command: 'node .opencode/skills/system-spec-kit/mcp-server/dist/context-server.js',
      },
    ]);

    const plan = planSweep(inventory(processes), { selfPid: 5678 });

    expect(plan.rows.find((row) => row.pid === 5678)).toMatchObject({
      eligibleForTermination: false,
      rationale: 'self-pid-refused',
    });
  });

  it('never marks ancestors as eligible even when they look orphaned', () => {
    const processes = classifyRows([
      {
        pid: 1234,
        ppid: 1,
        command: 'node .opencode/skills/system-spec-kit/mcp-server/dist/context-server.js',
      },
      { pid: 4321, ppid: 1234, command: 'zsh' },
      { pid: 5678, ppid: 4321, command: 'node scripts/ops/process-sweep.js plan' },
    ]);

    const plan = planSweep(inventory(processes), { selfPid: 5678 });

    expect(plan.rows.find((row) => row.pid === 1234)).toMatchObject({
      classification: 'orphaned-project-daemon',
      eligibleForTermination: false,
      rationale: 'ancestor-refused',
    });
  });

  it('preserves EPERM alive-but-unowned processes', () => {
    const processes = classifyRows([
      { pid: 2000, ppid: 1, command: 'node unknown-helper.js', eperm: true },
    ]);

    const plan = planSweep(inventory(processes), { selfPid: 1000 });

    expect(plan.rows[0]).toMatchObject({
      classification: 'eperm-alive-unowned',
      eligibleForTermination: false,
      rationale: 'unknown-owner-refused',
    });
  });

  it('marks stale project PID locks eligible after exact path identity proof', () => {
    const staleLock: PidLockState = {
      path: '.opencode/skills/system-spec-kit/run/stale.pid',
      raw: '3000',
      pid: 3000,
      state: 'stale',
      reason: 'PID lock points to a process that is not running',
    };

    const plan = planSweep(inventory([], [staleLock]), { selfPid: 1000 });

    expect(plan.rows.find((row) => row.pid === 3000)).toMatchObject({
      classification: 'stale-pid-lock',
      eligibleForTermination: true,
      rationale: 'stale-or-orphan',
    });
  });

  it('preserves expected warm daemons even with active port and owner-token evidence', () => {
    const processes = classifyRows([
      {
        pid: 4000,
        ppid: 1,
        command: '/opt/homebrew/opt/ollama/bin/ollama serve --port 8791 --owner-token abcdef0123456789abcdef0123456789',
      },
    ]);

    const plan = planSweep(inventory(processes), { selfPid: 1000 });

    expect(plan.rows[0]).toMatchObject({
      command: expect.stringContaining('--owner-token <redacted>'),
      classification: 'expected-warm-daemon',
      eligibleForTermination: false,
      rationale: 'expected-warm-preserved',
    });
  });

  it('preserves external MCP stdio processes', () => {
    const processes = classifyRows([
      { pid: 6000, ppid: 1, command: 'node /tmp/mcp-example --stdio' },
      { pid: 6001, ppid: 1, command: 'node tool.js --mcp-server stdio' },
    ]);

    const plan = planSweep(inventory(processes), { selfPid: 1000 });

    expect(plan.rows.map((row) => row.classification)).toEqual(['external-mcp-stdio', 'external-mcp-stdio']);
    expect(plan.rows.every((row) => !row.eligibleForTermination)).toBe(true);
  });

  it('preserves browser sessions without known project markers', () => {
    const processes = classifyRows([
      {
        pid: 7000,
        ppid: 1,
        command: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --type=renderer',
      },
    ]);

    const plan = planSweep(inventory(processes), { selfPid: 1000 });

    expect(plan.rows[0]).toMatchObject({
      classification: 'browser-session',
      eligibleForTermination: false,
      rationale: 'default-preserve',
    });
  });

  it('refuses unknown owners', () => {
    const processes = classifyRows([
      { pid: 8000, ppid: 1, command: 'node unrelated-helper.js' },
    ]);

    const plan = planSweep(inventory(processes), { selfPid: 1000 });

    expect(plan.rows[0]).toMatchObject({
      classification: 'unknown-owner',
      eligibleForTermination: false,
      rationale: 'unknown-owner-refused',
    });
  });

  it('marks orphaned project daemons eligible only with known project identity', () => {
    const processes = classifyRows([
      {
        pid: 9000,
        ppid: 1,
        command: 'node .opencode/skills/system-code-graph/mcp-server/dist/index.js',
      },
      {
        pid: 9001,
        ppid: 1,
        command: 'node system-code-graph/mcp-server/dist/index.js',
      },
    ]);

    const plan = planSweep(inventory(processes), { selfPid: 1000 });

    expect(plan.rows.find((row) => row.pid === 9000)).toMatchObject({
      classification: 'orphaned-project-daemon',
      eligibleForTermination: true,
      rationale: 'stale-or-orphan',
    });
    expect(plan.rows.find((row) => row.pid === 9001)).toMatchObject({
      classification: 'orphaned-project-daemon',
      eligibleForTermination: false,
      rationale: 'unknown-owner-refused',
    });
  });

  it('does not plan process termination when inventory is degraded', () => {
    const plan = planSweep(degradedInventory('ps-error', 'ps failed'), { selfPid: 1000 });

    expect(plan.inventoryStatus).toBe('ps-error');
    expect(plan.inventoryError).toBe('ps failed');
    expect(plan.rows).toEqual([]);
    expect(plan.summary.inventoryUnavailable).toBe(1);
  });
});
