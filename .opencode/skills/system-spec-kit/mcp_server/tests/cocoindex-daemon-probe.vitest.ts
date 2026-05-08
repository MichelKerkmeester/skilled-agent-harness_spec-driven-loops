import { afterEach, describe, expect, it, vi } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  probeCocoIndexDaemon,
  resetCocoIndexDaemonProbeCache,
} from '../lib/cocoindex/daemon-probe';

function makeDaemonDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'cocoindex-daemon-probe-'));
}

function writeDaemonFile(dir: string, name: string, content = ''): void {
  fs.writeFileSync(path.join(dir, name), content);
}

describe('CocoIndex daemon probe', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    resetCocoIndexDaemonProbeCache();
  });

  it('reports reachable when pid, socket, log, and lock evidence are present', () => {
    const dir = makeDaemonDir();
    vi.stubEnv('COCOINDEX_CODE_DIR', dir);
    writeDaemonFile(dir, 'daemon.pid', String(process.pid));
    writeDaemonFile(dir, 'daemon.sock');
    writeDaemonFile(dir, 'daemon.log', 'ready');
    writeDaemonFile(dir, 'daemon.lock');
    writeDaemonFile(dir, 'daemon.spawn-lock');

    const probe = probeCocoIndexDaemon({ force: true });

    expect(probe.status).toBe('reachable');
    expect(probe.pidLockHolder?.pid).toBe(process.pid);
    expect(probe.logCapState).toBe('ok');
  });

  it('reports unreachable when daemon pid evidence is missing', () => {
    const dir = makeDaemonDir();
    vi.stubEnv('COCOINDEX_CODE_DIR', dir);

    const probe = probeCocoIndexDaemon({ force: true });

    expect(probe.status).toBe('unreachable');
    expect(probe.pidLockHolder).toBeNull();
  });

  it('reports degraded when pid is alive but socket evidence is missing', () => {
    const dir = makeDaemonDir();
    vi.stubEnv('COCOINDEX_CODE_DIR', dir);
    writeDaemonFile(dir, 'daemon.pid', String(process.pid));
    writeDaemonFile(dir, 'daemon.log', 'ready');
    writeDaemonFile(dir, 'daemon.lock');

    const probe = probeCocoIndexDaemon({ force: true });

    expect(probe.status).toBe('degraded');
    expect(probe.reason).toContain('socket');
  });
});
