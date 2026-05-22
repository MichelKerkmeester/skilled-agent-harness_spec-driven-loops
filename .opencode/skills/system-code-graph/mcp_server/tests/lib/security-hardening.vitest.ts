import { existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { getCocoIndexBinaryPath } from '../../lib/shared/cocoindex-path.js';
import { startIpcSocketServer } from '../../lib/ipc/socket-server.js';

const tempDirs: string[] = [];
const originalCocoIndexBinPath = process.env.COCOINDEX_BIN_PATH;

function tempRoot(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  if (originalCocoIndexBinPath === undefined) {
    delete process.env.COCOINDEX_BIN_PATH;
  } else {
    process.env.COCOINDEX_BIN_PATH = originalCocoIndexBinPath;
  }
  delete process.env.SPECKIT_IPC_SOCKET_DIR;
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('Code Graph B3 security hardening', () => {
  it('rejects COCOINDEX_BIN_PATH outside the workspace', () => {
    const root = tempRoot('cg-coco-root-');
    const outside = join(tempRoot('cg-coco-outside-'), 'ccc');
    writeFileSync(outside, '#!/usr/bin/env bash\n', { mode: 0o755 });
    process.env.COCOINDEX_BIN_PATH = outside;

    expect(() => getCocoIndexBinaryPath(root)).toThrow(/workspace root/);
  });

  it('rejects COCOINDEX_BIN_PATH symlink escapes', () => {
    const root = tempRoot('cg-coco-root-');
    const outside = join(tempRoot('cg-coco-outside-'), 'ccc');
    const alias = join(root, '.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc');
    mkdirSync(dirname(alias), { recursive: true });
    writeFileSync(outside, '#!/usr/bin/env bash\n', { mode: 0o755 });
    symlinkSync(outside, alias);
    process.env.COCOINDEX_BIN_PATH = alias;

    expect(() => getCocoIndexBinaryPath(root)).toThrow(/workspace root/);
  });

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
});
