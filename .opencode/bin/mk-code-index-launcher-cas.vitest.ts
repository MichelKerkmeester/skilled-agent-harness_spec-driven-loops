import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type OwnerLease = {
  ownerPid: number;
  ppid: number;
  executablePath: string;
  startedAtIso: string;
  lastHeartbeatIso: string;
  ttlMs: number;
  canonicalDbDir: string;
  socketPath: string | null;
};

type OwnerLeaseSnapshot = {
  lease: OwnerLease;
  mtimeMs: number;
  contentHash: string;
};

type AcquireOwnerLeaseFile = () => {
  acquired: boolean;
  holder?: OwnerLease;
  lease?: OwnerLease;
  reclaimed?: OwnerLease;
  classification?: string;
};

const require = createRequire(import.meta.url);
const fs = require('node:fs') as typeof import('node:fs');
const {
  acquireOwnerLeaseFile,
  configureLauncherPathsForTesting,
  ownerLeasePath,
  readOwnerLeaseFile,
  staleLeaseUnchanged,
} = require('./mk-code-index-launcher.cjs') as {
  acquireOwnerLeaseFile: AcquireOwnerLeaseFile;
  configureLauncherPathsForTesting: (nextPaths: Record<string, string>) => void;
  ownerLeasePath: () => string;
  readOwnerLeaseFile: (filePath?: string) => OwnerLease | null;
  staleLeaseUnchanged: (snapshot: OwnerLeaseSnapshot | null, current: OwnerLeaseSnapshot | null) => boolean;
};

const testDir = dirname(fileURLToPath(import.meta.url));

let tempRoot: string;

function leaseFor(ownerPid: number, overrides: Partial<OwnerLease> = {}): OwnerLease {
  const nowIso = new Date().toISOString();
  return {
    ownerPid,
    ppid: process.ppid,
    executablePath: process.execPath,
    startedAtIso: nowIso,
    lastHeartbeatIso: nowIso,
    ttlMs: 60_000,
    canonicalDbDir: tempRoot,
    socketPath: null,
    ...overrides,
  };
}

function writeLease(lease: OwnerLease): void {
  fs.writeFileSync(ownerLeasePath(), `${JSON.stringify(lease, null, 2)}\n`, { mode: 0o600 });
}

describe('owner lease stale-reclaim CAS', () => {
  beforeEach(() => {
    tempRoot = fs.mkdtempSync(join(testDir, '.mk-code-index-cas-'));
    configureLauncherPathsForTesting({
      dbDir: tempRoot,
      lockDir: join(tempRoot, 'bootstrap.lock'),
      stateFile: join(tempRoot, 'state.json'),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it('aborts stale reclaim when a successor lease supersedes the classified snapshot', () => {
    const staleLease = leaseFor(0, {
      lastHeartbeatIso: new Date(0).toISOString(),
    });
    const successorLease = leaseFor(process.pid, {
      startedAtIso: new Date(Date.now() + 1_000).toISOString(),
      lastHeartbeatIso: new Date(Date.now() + 1_000).toISOString(),
    });
    writeLease(staleLease);

    const leaseFile = ownerLeasePath();
    const realReadFileSync = fs.readFileSync.bind(fs);
    let leaseReads = 0;
    vi.spyOn(fs, 'readFileSync').mockImplementation((filePath: fs.PathOrFileDescriptor, options?: unknown) => {
      if (filePath === leaseFile) {
        leaseReads += 1;
        if (leaseReads === 2) {
          fs.writeFileSync(leaseFile, `${JSON.stringify(successorLease, null, 2)}\n`, { mode: 0o600 });
          const newer = new Date(Date.now() + 2_000);
          fs.utimesSync(leaseFile, newer, newer);
        }
      }
      return realReadFileSync(filePath, options as never);
    });
    const stderrWrite = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    const result = acquireOwnerLeaseFile();

    expect(result.acquired).toBe(false);
    expect(result.holder?.ownerPid).toBe(successorLease.ownerPid);
    expect(readOwnerLeaseFile(leaseFile)?.ownerPid).toBe(successorLease.ownerPid);
    expect(stderrWrite).toHaveBeenCalledWith(expect.stringContaining('reason=reclaim-superseded ownerPid='));
  });

  it('reclaims when the stale lease snapshot is unchanged before unlink', () => {
    const staleLease = leaseFor(0, {
      lastHeartbeatIso: new Date(0).toISOString(),
    });
    writeLease(staleLease);

    const result = acquireOwnerLeaseFile();

    expect(result.acquired).toBe(true);
    expect(result.reclaimed?.ownerPid).toBe(staleLease.ownerPid);
    expect(readOwnerLeaseFile()?.ownerPid).toBe(process.pid);
  });

  it('compares owner pid, mtime, and content hash when checking a stale snapshot', () => {
    const snapshot = {
      lease: leaseFor(10),
      mtimeMs: 100,
      contentHash: 'same',
    };

    expect(staleLeaseUnchanged(snapshot, { ...snapshot })).toBe(true);
    expect(staleLeaseUnchanged(snapshot, {
      ...snapshot,
      lease: { ...snapshot.lease, ownerPid: 11 },
    })).toBe(false);
    expect(staleLeaseUnchanged(snapshot, { ...snapshot, mtimeMs: 101 })).toBe(false);
    expect(staleLeaseUnchanged(snapshot, { ...snapshot, contentHash: 'different' })).toBe(false);
  });
});
