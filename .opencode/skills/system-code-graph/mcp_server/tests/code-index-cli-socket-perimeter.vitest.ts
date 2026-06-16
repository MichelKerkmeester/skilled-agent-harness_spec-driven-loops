// -----------------------------------------------------------------------------
// MODULE: Code Index CLI Socket Perimeter Tests
// -----------------------------------------------------------------------------
// The warm-only IPC client must refuse to probe/connect under a socket directory
// it does not own, a symlinked directory, or a group/world-writable directory, and
// must reject a symlinked socket node — otherwise a pre-planted fake daemon on a
// shared host can inject attacker-controlled status text into prompt-time context.

import { chmodSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { __testing } from '../code-index-cli.js';

const SOCKET_FILE_NAME = 'daemon-ipc.sock';
const tempDirs: string[] = [];

function makeRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'code-index-perimeter-'));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('code-index CLI socket perimeter', () => {
  it('accepts a private directory owned by the current user with no socket node', () => {
    const root = makeRoot();
    const socketDir = join(root, 'ipc');
    mkdirSync(socketDir, { recursive: true, mode: 0o700 });

    expect(() => __testing.assertSocketPerimeter(socketDir)).not.toThrow();
  });

  it('rejects a symlinked socket directory', () => {
    const root = makeRoot();
    const realDir = join(root, 'real');
    mkdirSync(realDir, { recursive: true, mode: 0o700 });
    const linkDir = join(root, 'link');
    symlinkSync(realDir, linkDir);

    expect(() => __testing.assertSocketPerimeter(linkDir)).toThrow(/symlink/i);
  });

  it('rejects a group/world-writable socket directory', () => {
    const root = makeRoot();
    const socketDir = join(root, 'ipc');
    mkdirSync(socketDir, { recursive: true, mode: 0o700 });
    chmodSync(socketDir, 0o777);

    expect(() => __testing.assertSocketPerimeter(socketDir)).toThrow(/group\/world-writable/i);
  });

  it('rejects a symlinked socket node inside an owned directory', () => {
    const root = makeRoot();
    const socketDir = join(root, 'ipc');
    mkdirSync(socketDir, { recursive: true, mode: 0o700 });
    const decoy = join(root, 'decoy.sock');
    writeFileSync(decoy, '');
    symlinkSync(decoy, join(socketDir, SOCKET_FILE_NAME));

    expect(() => __testing.assertSocketPerimeter(socketDir)).toThrow(/symlink/i);
  });
});
