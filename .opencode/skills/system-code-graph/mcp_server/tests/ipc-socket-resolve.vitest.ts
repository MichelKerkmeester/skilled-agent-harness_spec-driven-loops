// ───────────────────────────────────────────────────────────────
// MODULE: IPC socket-dir resolution regression
// ───────────────────────────────────────────────────────────────
// resolveIpcSocketPath must canonicalize the socket dir even when it does not
// exist yet. A /tmp socket dir cleared on reboot previously stayed literal
// (/tmp/...) and failed the allowed-root check (which canonicalizes /tmp to
// /private/tmp on macOS), crashing the server with MCP error -32000. The guard
// must still reject directories outside the workspace root and system temp dirs.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { join } from 'node:path';

import { resolveIpcSocketPath } from '../lib/ipc/socket-server.js';

const ORIGINAL = process.env.SPECKIT_IPC_SOCKET_DIR;

beforeEach(() => {
  delete process.env.SPECKIT_IPC_SOCKET_DIR;
});

afterEach(() => {
  if (ORIGINAL === undefined) {
    delete process.env.SPECKIT_IPC_SOCKET_DIR;
  } else {
    process.env.SPECKIT_IPC_SOCKET_DIR = ORIGINAL;
  }
});

describe('resolveIpcSocketPath canonicalization', () => {
  it('resolves a non-existent /tmp socket dir without throwing (reboot-cleared dir)', () => {
    const leaf = `mk-code-index-resolve-test-${process.pid}-${Date.now()}`;
    const missingDir = join('/tmp', leaf);
    process.env.SPECKIT_IPC_SOCKET_DIR = missingDir;

    let socketPath = '';
    expect(() => {
      socketPath = resolveIpcSocketPath('/unused/db/dir');
    }).not.toThrow();
    // Returns <canonicalized missing dir>/<socket file>: keeps the unique leaf and appends a file.
    expect(socketPath).toContain(leaf);
    expect(socketPath.length).toBeGreaterThan(missingDir.length);
  });

  it('still rejects a non-existent dir outside the workspace and system temp dirs', () => {
    process.env.SPECKIT_IPC_SOCKET_DIR = '/var/mk-code-index-out-of-root-xyz';
    expect(() => resolveIpcSocketPath('/unused/db/dir')).toThrow(/must stay within/);
  });
});
