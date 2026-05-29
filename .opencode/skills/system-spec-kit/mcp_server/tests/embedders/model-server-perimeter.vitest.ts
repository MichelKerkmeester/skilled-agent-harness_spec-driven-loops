import { EventEmitter } from 'node:events';
import { existsSync, mkdtempSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const mss = require('../../../../../bin/lib/model-server-supervision.cjs') as {
  assertSocketDirOwnership: (socketPath: string, options?: Record<string, unknown>) => void;
  assertSunPathLimit: (socketPath: string) => void;
  createModelServerControl: (deps?: Record<string, unknown>) => {
    startDemandListener: (options?: Record<string, unknown>) => Promise<Record<string, unknown>>;
    clearTimers: () => void;
    stopDemandListener: () => Promise<void>;
  };
};

function expectCode(fn: () => unknown, code: string): void {
  try {
    fn();
  } catch (error) {
    expect((error as { code?: string }).code).toBe(code);
    return;
  }
  throw new Error(`Expected ${code}`);
}

describe('hf model server socket perimeter hardening', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    vi.restoreAllMocks();
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  function tempDir(prefix: string): string {
    const dir = mkdtempSync(join('/private/tmp', prefix));
    tempDirs.push(dir);
    return dir;
  }

  it('rejects UDS paths over the conservative macOS sun_path cap', () => {
    const longSocketPath = join('/private/tmp', `${'a'.repeat(110)}.sock`);

    expectCode(() => mss.assertSunPathLimit(longSocketPath), 'ESUNPATHTOOLONG');
  });

  it('rejects symlinked socket directories, foreign-owned directories, and symlinked socket nodes', () => {
    const realDir = tempDir('hf-perimeter-real-');
    const linkDir = `${realDir}-link`;
    tempDirs.push(linkDir);
    symlinkSync(realDir, linkDir);
    expectCode(
      () => mss.assertSocketDirOwnership(join(linkDir, 'hf-embed.sock'), { getuid: () => process.getuid?.() }),
      'ESOCKETDIRSYMLINK',
    );

    const statApi = {
      lstatSync(target: string) {
        if (target.endsWith('hf-embed.sock')) {
          const error = Object.assign(new Error('missing'), { code: 'ENOENT' });
          throw error;
        }
        return {
          uid: 2222,
          isSymbolicLink: () => false,
        };
      },
    };
    expectCode(
      () => mss.assertSocketDirOwnership(join('/private/tmp', 'owned-elsewhere', 'hf-embed.sock'), {
        statApi,
        getuid: () => 1111,
      }),
      'ESOCKETDIRFOREIGN',
    );

    const socketDir = tempDir('hf-perimeter-node-');
    const target = join(socketDir, 'target.sock');
    const socketPath = join(socketDir, 'hf-embed.sock');
    writeFileSync(target, 'not a socket', 'utf8');
    symlinkSync(target, socketPath);
    expectCode(() => mss.assertSocketDirOwnership(socketPath, { getuid: () => process.getuid?.() }), 'ESOCKETSYMLINK');
  });

  it('fails closed before mkdir/listen when SPECKIT_IPC_SOCKET_DIR is a symlink', async () => {
    const realDir = tempDir('hf-perimeter-start-real-');
    const linkDir = `${realDir}-link`;
    tempDirs.push(linkDir);
    symlinkSync(realDir, linkDir);
    const socketPath = join(linkDir, 'hf-embed.sock');
    const createServer = vi.fn();
    const control = mss.createModelServerControl({
      log: () => undefined,
      env: {},
      dbDir: () => realDir,
      httpCreateServer: createServer,
      getuid: () => process.getuid?.(),
    });

    await expect(control.startDemandListener({ socketPath })).rejects.toMatchObject({ code: 'ESOCKETDIRSYMLINK' });
    expect(createServer).not.toHaveBeenCalled();
  });

  it('rechecks the socket node before EADDRINUSE stale-socket reclaim unlinks', async () => {
    const socketDir = tempDir('hf-perimeter-reclaim-');
    const socketPath = join(socketDir, 'hf-embed.sock');
    const realSocketPlaceholder = join(socketDir, 'real.sock');
    writeFileSync(socketPath, 'initial stale socket', 'utf8');
    writeFileSync(realSocketPlaceholder, 'replacement', 'utf8');
    const server = new EventEmitter() as EventEmitter & {
      listen: (path: string) => void;
      close: (callback?: () => void) => void;
    };
    server.listen = () => {
      // The reap-before-respawn path may already have unlinked the stale socket before listen
      // runs; guard so the symlink injection (simulating a swapped-in symlinked node at the
      // socket path) is robust and the reclaim re-assert is what trips ESOCKETSYMLINK.
      if (existsSync(socketPath)) unlinkSync(socketPath);
      symlinkSync(realSocketPlaceholder, socketPath);
      queueMicrotask(() => server.emit('error', Object.assign(new Error('busy'), { code: 'EADDRINUSE' })));
    };
    server.close = (callback?: () => void) => callback?.();
    const control = mss.createModelServerControl({
      log: () => undefined,
      env: {},
      dbDir: () => socketDir,
      bridge: { probeModelServer: vi.fn(async () => ({ status: 'dead', reason: 'test-dead' })) },
      httpCreateServer: vi.fn(() => server),
      readModelServerPid: () => null,
      liveness: () => 'dead',
      getuid: () => process.getuid?.(),
    });

    await expect(control.startDemandListener({ socketPath })).rejects.toMatchObject({ code: 'ESOCKETSYMLINK' });
    expect(existsSync(socketPath)).toBe(true);
    control.clearTimers();
    await control.stopDemandListener();
  });
});
