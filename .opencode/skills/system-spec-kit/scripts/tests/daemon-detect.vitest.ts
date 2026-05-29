// ───────────────────────────────────────────────────────────────────
// MODULE: Daemon Detect Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { isSpecMemoryDaemonAlive, resolveSpecMemoryDaemonLeasePath } from '../core/daemon-detect';

// ───────────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────────

describe('isSpecMemoryDaemonAlive', () => {
  let tempDir: string;
  let leasePath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-daemon-detect-'));
    leasePath = path.join(tempDir, '.mk-spec-memory-launcher.json');
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('returns alive=true for a lease with a live pid', () => {
    fs.writeFileSync(leasePath, JSON.stringify({
      pid: process.pid,
      ownerPid: process.pid,
      startedAt: '2026-05-29T00:00:00.000Z',
    }));

    expect(isSpecMemoryDaemonAlive(leasePath)).toEqual({
      alive: true,
      pid: process.pid,
    });
  });

  it('returns alive=false for a lease with a dead pid', () => {
    const exited = spawnSync(process.execPath, ['-e', ''], { stdio: 'ignore' });
    const deadPid = exited.pid ?? 999_999;
    fs.writeFileSync(leasePath, JSON.stringify({
      pid: deadPid,
      ownerPid: deadPid,
      startedAt: '2026-05-29T00:00:00.000Z',
    }));

    expect(isSpecMemoryDaemonAlive(leasePath)).toEqual({ alive: false });
  });

  it('returns alive=false for a missing lease', () => {
    expect(isSpecMemoryDaemonAlive(leasePath)).toEqual({ alive: false });
  });

  // Regression guard (026/007/013 review): the default lease path MUST resolve to the launcher's real
  // location <system-spec-kit>/mcp_server/database/, NOT scripts/mcp_server/. A fixed up-count from
  // dist/core previously landed at the nonexistent scripts/mcp_server/database -> the guard was dead code.
  it('resolves the default lease path to the launcher-canonical system-spec-kit/mcp_server/database dir', () => {
    const resolved = resolveSpecMemoryDaemonLeasePath();
    expect(resolved.endsWith(path.join('system-spec-kit', 'mcp_server', 'database', '.mk-spec-memory-launcher.json'))).toBe(true);
    expect(resolved.includes(path.join('scripts', 'mcp_server'))).toBe(false);
  });
});

