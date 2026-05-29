import { chmodSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { startIpcSocketServer } from '../../lib/ipc/socket-server.js';

const tempDirs: string[] = [];

function tempRoot(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  delete process.env.SPECKIT_IPC_SOCKET_DIR;
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('Code Graph B3 security hardening', () => {
  it('refuses to unlink an existing non-socket IPC path', async () => {
    const rootLocalDir = mkdtempSync(join(process.cwd(), '.opencode', '.tmp-ipc-'));
    tempDirs.push(rootLocalDir);
    const socketPath = join(rootLocalDir, 'daemon-ipc.sock');
    writeFileSync(socketPath, 'not a socket', 'utf8');

    await expect(
      startIpcSocketServer({
        socketPath,
        createServer: () => {
          throw new Error('server should not be created');
        },
        log: () => undefined,
      }),
    ).rejects.toMatchObject({ code: 'EADDRINUSE' });

    expect(existsSync(socketPath)).toBe(true);
  });

  it.skipIf(typeof process.getuid !== 'function')(
    'DR-008-01: refuses to bind under a group/world-writable socket dir',
    async () => {
      const dir = tempRoot('cg-ipc-perms-');
      chmodSync(dir, 0o777); // pre-existing dir the mkdir mode:0o700 cannot tighten
      const socketPath = join(dir, 'daemon-ipc.sock');

      await expect(
        startIpcSocketServer({
          socketPath,
          createServer: () => {
            throw new Error('server should not be created');
          },
          log: () => undefined,
        }),
      ).rejects.toThrow(/group\/world-writable/);

      expect(existsSync(socketPath)).toBe(false);
    },
  );
});
