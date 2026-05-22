import { describe, expect, it } from 'vitest';

import {
  buildHarnessSnapshot,
  classifyPidLock,
  classifyProcesses,
  getAncestorPids,
  getDescendantPids,
  parsePsOutput,
  parseVmStat,
  syntheticFixtureSnapshot,
} from '../ops/process-memory-harness.js';

const PS_FIXTURE = `  PID  PPID STAT    RSS COMMAND
 1000     1 S     5000 opencode
 1001  1000 S     4000 node synthetic-child.js
 1002  1001 S     3000 node synthetic-grandchild.js
 2000     1 S    96000 /opt/homebrew/bin/python .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc run-daemon
 2001     1 S    44000 /opt/homebrew/bin/python .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc mcp
 2002     1 S    32000 /opt/homebrew/bin/node /repo/.opencode/skills/system-code-graph/mcp_server/dist/index.js
 3000     1 S   120000 uvicorn rerank_sidecar:app --host 127.0.0.1
 4000     1 S    24000 /opt/homebrew/opt/ollama/bin/ollama serve
 5000   918 Z        0 <defunct>
`;

describe('process memory harness', () => {
  it('parses ps rows with full commands intact', () => {
    const rows = parsePsOutput(PS_FIXTURE);

    expect(rows).toHaveLength(9);
    expect(rows[3]).toMatchObject({
      pid: 2000,
      ppid: 1,
      stat: 'S',
      rssKb: 96000,
      command: expect.stringContaining('ccc run-daemon'),
    });
  });

  it('classifies child and grandchild ancestry as current-session protected', () => {
    const rows = parsePsOutput(PS_FIXTURE);
    const classified = classifyProcesses(rows, { currentPid: 1000 });

    expect(getDescendantPids(1000, rows)).toEqual([1001, 1002]);
    expect(getAncestorPids(1002, rows)).toEqual([1001, 1000, 1]);
    expect(classified.find((row) => row.pid === 1001)?.role).toBe('current-session');
    expect(classified.find((row) => row.pid === 1002)?.terminationCandidate).toBe(false);
  });

  it('classifies project daemons, expected daemons, and zombies without marking expected daemons killable', () => {
    const classified = classifyProcesses(parsePsOutput(PS_FIXTURE), { currentPid: 1000 });

    expect(classified.find((row) => row.pid === 2000)).toMatchObject({
      role: 'project-daemon',
      ruleId: 'cocoindex-daemon',
      isOrphanedProjectDaemon: true,
      terminationCandidate: true,
    });
    expect(classified.find((row) => row.pid === 3000)).toMatchObject({
      role: 'expected-daemon',
      ruleId: 'rerank-sidecar',
      terminationCandidate: false,
    });
    expect(classified.find((row) => row.pid === 4000)).toMatchObject({
      role: 'expected-daemon',
      ruleId: 'ollama-serve',
      terminationCandidate: false,
    });
    expect(classified.find((row) => row.pid === 5000)).toMatchObject({
      role: 'zombie',
      rssMb: 0,
      terminationCandidate: false,
    });
  });

  it('parses vm_stat and sysctl into byte estimates', () => {
    const snapshot = parseVmStat(
      `Mach Virtual Memory Statistics: (page size of 16384 bytes)\nPages free: 10.\nPages speculative: 2.\nPages wired down: 40.\nPages occupied by compressor: 50.\n`,
      'hw.memsize: 68719476736',
    );

    expect(snapshot.pageSizeBytes).toBe(16384);
    expect(snapshot.totalMemoryBytes).toBe(68719476736);
    expect(snapshot.approx.freeBytes).toBe(12 * 16384);
    expect(snapshot.approx.wiredBytes).toBe(40 * 16384);
    expect(snapshot.approx.compressorBytes).toBe(50 * 16384);
    expect(snapshot.warnings).toEqual([]);
  });

  it('classifies stale, live, invalid, empty, and zombie PID locks', () => {
    const rows = parsePsOutput(PS_FIXTURE);

    expect(classifyPidLock('live.pid', '2000', rows).state).toBe('live');
    expect(classifyPidLock('stale.pid', '9999', rows).state).toBe('stale');
    expect(classifyPidLock('invalid.pid', 'abc', rows).state).toBe('invalid');
    expect(classifyPidLock('empty.pid', '   ', rows).state).toBe('empty');
    expect(classifyPidLock('zombie.pid', '5000', rows).state).toBe('zombie');
  });

  it('builds a fixture snapshot with the required phase-002 evidence axes', () => {
    const snapshot = syntheticFixtureSnapshot();

    expect(snapshot.processCount).toBeGreaterThan(0);
    expect(snapshot.projectDaemonCount).toBeGreaterThanOrEqual(4);
    expect(snapshot.expectedDaemonCount).toBeGreaterThanOrEqual(2);
    expect(snapshot.zombieCount).toBe(1);
    expect(snapshot.orphanedProjectDaemonCount).toBeGreaterThanOrEqual(4);
    expect(snapshot.pidLocks.map((lock) => lock.state).sort()).toEqual([
      'invalid',
      'live',
      'stale',
      'zombie',
    ]);
  });

  it('builds snapshots from injected command output without shelling out', () => {
    const snapshot = buildHarnessSnapshot({
      psOutput: PS_FIXTURE,
      vmStatOutput: 'Mach Virtual Memory Statistics: (page size of 4096 bytes)\nPages free: 1.\n',
      sysctlOutput: 'hw.memsize: 1024',
      currentPid: 1000,
      lockContents: { 'stale.pid': '9999' },
      timestamp: '2026-05-22T00:00:00.000Z',
    });

    expect(snapshot.timestamp).toBe('2026-05-22T00:00:00.000Z');
    expect(snapshot.hostMemory.approx.freeBytes).toBe(4096);
    expect(snapshot.pidLocks[0]).toMatchObject({ state: 'stale', pid: 9999 });
  });
});
