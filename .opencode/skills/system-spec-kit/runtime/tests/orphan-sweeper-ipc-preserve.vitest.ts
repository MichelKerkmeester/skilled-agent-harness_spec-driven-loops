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
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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

function runSourcedHarness(lines: string[], env: NodeJS.ProcessEnv = {}): string {
  const harness = join(dir, 'harness.sh');
  writeFileSync(
    harness,
    ['#!/usr/bin/env bash', 'set -euo pipefail', `source ${JSON.stringify(sweeper)}`, ...lines, ''].join(
      '\n',
    ),
    { mode: 0o755 },
  );
  chmodSync(harness, 0o755);
  return execFileSync('bash', [harness], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  }).trim();
}

const advisorCommand =
  '/usr/local/bin/node /repo/.opencode/skills/system-skill-advisor/mcp-server/dist/advisor-server.js';

type TerminationOptions = {
  currentCommand: string;
  dryRun?: boolean;
};

function runTermination({ currentCommand, dryRun = false }: TerminationOptions): string[] {
  const signalLog = join(dir, 'signals.log');
  writeFileSync(signalLog, '');
  const output = runSourcedHarness(
    [
      `signal_log=${JSON.stringify(signalLog)}`,
      'kill() { printf "%s\\n" "$*" >> "$signal_log"; }',
      'sleep() { :; }',
      'ps() {',
      '  if [[ "$1" = "-p" ]]; then',
      `    printf '%s\\n' ${JSON.stringify(currentCommand)}`,
      '  fi',
      '}',
      // A single peer FD is below the "in use" threshold, so the candidate stays unprotected and
      // the run reaches the signalling path this suite is about.
      `lsof() { if [[ " $* " = *" -FfnT "* ]]; then printf 'p4242\\nf18u\\nn->0xpeer\\n'; fi; }`,
      'KILL_PIDS=(4242)',
      'KILL_CLASSES=(skill-advisor-server)',
      'KILL_AGES=(600)',
      'KILL_ETIMES=(10:00)',
      'KILL_RSSES=(100)',
      `KILL_COMMANDS=(${JSON.stringify(advisorCommand)})`,
      dryRun ? 'DRY_RUN=true' : 'DRY_RUN=false',
      'terminate_candidates',
    ],
    { SIGNAL_LOG: signalLog },
  );
  const signals = readFileSync(signalLog, 'utf8').trim().split('\n').filter(Boolean);
  return [...signals, ...output.split('\n').filter(Boolean)];
}

describe('orphan sweeper UNIX-socket preserve', () => {
  it('preserves a daemon holding a listener plus a live peer connection on daemon-ipc.sock', () => {
    const result = runPredicateWithLsof([
      'node 4242 user 17u unix 0xaaa 0t0 /private/tmp/system-code-index/daemon-ipc.sock',
      'node 4242 user 23u unix 0xbbb 0t0 /private/tmp/system-code-index/daemon-ipc.sock',
    ]);
    expect(result).toBe('preserve');
  });

  it('does not preserve a daemon holding only the listener socket (no live peers)', () => {
    const result = runPredicateWithLsof([
      'node 4242 user 17u unix 0xaaa 0t0 /private/tmp/system-code-index/daemon-ipc.sock',
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

describe('orphan sweeper pre-signal reclassification', () => {
  it('sends neither TERM nor KILL when the pid now belongs to an unrelated command', () => {
    const result = runTermination({ currentCommand: '/usr/bin/sleep 10' });
    expect(result).not.toContain('-15 4242');
    expect(result).not.toContain('-9 4242');
    expect(result.join('\n')).toContain('reason=pid-reclassified');
  });

  it('sends neither TERM nor KILL when the pid has the same class but a different full command', () => {
    const result = runTermination({ currentCommand: `${advisorCommand} --replacement` });
    expect(result).not.toContain('-15 4242');
    expect(result).not.toContain('-9 4242');
    expect(result.join('\n')).toContain('reason=pid-reclassified');
  });

  it('sends TERM then KILL when command, class, and unprotected status remain unchanged', () => {
    const result = runTermination({ currentCommand: advisorCommand });
    expect(result.slice(0, 2)).toEqual(['-15 4242', '-9 4242']);
  });

  it('revalidates and logs TERM without signaling in dry-run mode', () => {
    const result = runTermination({ currentCommand: advisorCommand, dryRun: true });
    expect(result).not.toContain('-15 4242');
    expect(result.join('\n')).toContain('[DRY-RUN] action=kill signal=TERM pid=4242');
  });
});
