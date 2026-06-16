// ───────────────────────────────────────────────────────────────
// MODULE: Orphan Sweeper IPC-Socket Preserve Tests
// ───────────────────────────────────────────────────────────────
// Regression for the orphan sweeper preserving a live re-elected MCP daemon
// that bridges a sibling session over its UNIX daemon-ipc.sock. The sweeper's
// TCP-only listener guard never covered the UNIX-socket daemons, so a still-
// serving (ppid=1, >AGE) daemon matched no preserve rule and could be SIGKILLed,
// dropping the transport for any concurrent live session. has_live_ipc_socket_connection
// preserves a daemon that holds more than one daemon-ipc.sock FD (listener + a peer).

import { execFileSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');
const sweeper = join(repoRoot, '.opencode/scripts/orphan-mcp-sweeper.sh');

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'orphan-sweeper-ipc-'));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

// Source the sweeper (its sourcing guard skips the process-scan main flow) with a
// stubbed `lsof` on PATH that emits the supplied UNIX-socket lines, then run the
// predicate and return its exit code via the harness's echoed result.
function runPredicateWithLsof(lsofLines: string[]): 'preserve' | 'sweep' {
  const stubBin = join(dir, 'bin');
  mkdirSync(stubBin, { recursive: true });
  const lsofStub = join(stubBin, 'lsof');
  const body = lsofLines.map((line) => `echo ${JSON.stringify(line)}`).join('\n');
  writeFileSync(lsofStub, `#!/bin/sh\n${body}\n`, { mode: 0o755 });
  chmodSync(lsofStub, 0o755);

  const harness = join(dir, 'harness.sh');
  writeFileSync(
    harness,
    [
      '#!/usr/bin/env bash',
      'set -euo pipefail',
      `source ${JSON.stringify(sweeper)}`,
      'if has_live_ipc_socket_connection 4242; then echo preserve; else echo sweep; fi',
      '',
    ].join('\n'),
    { mode: 0o755 },
  );
  chmodSync(harness, 0o755);

  const out = execFileSync('bash', [harness], {
    encoding: 'utf8',
    env: { ...process.env, PATH: `${stubBin}:${process.env.PATH ?? ''}` },
  }).trim();
  return out === 'preserve' ? 'preserve' : 'sweep';
}

describe('orphan sweeper UNIX-socket preserve', () => {
  it('preserves a daemon holding a listener plus a live peer connection on daemon-ipc.sock', () => {
    const result = runPredicateWithLsof([
      'node 4242 user 17u unix 0xaaa 0t0 /private/tmp/mk-code-index/daemon-ipc.sock',
      'node 4242 user 23u unix 0xbbb 0t0 /private/tmp/mk-code-index/daemon-ipc.sock',
    ]);
    expect(result).toBe('preserve');
  });

  it('does not preserve a daemon holding only the listener socket (no live peers)', () => {
    const result = runPredicateWithLsof([
      'node 4242 user 17u unix 0xaaa 0t0 /private/tmp/mk-code-index/daemon-ipc.sock',
    ]);
    expect(result).toBe('sweep');
  });

  it('does not preserve a process with no daemon-ipc.sock at all', () => {
    const result = runPredicateWithLsof([
      'node 4242 user 5u unix 0xccc 0t0 /some/other.sock',
    ]);
    expect(result).toBe('sweep');
  });
});
