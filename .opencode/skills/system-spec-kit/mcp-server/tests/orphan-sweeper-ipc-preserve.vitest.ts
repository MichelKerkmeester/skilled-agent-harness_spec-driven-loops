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

const contextCommand = '/usr/local/bin/node /repo/system-spec-kit/mcp-server/dist/context-server.js';

function preservationReason(dbDir: string): string {
  return runSourcedHarness([
    `lsof() { if [[ " $* " = *" -FfnT "* ]]; then printf 'p4242\\nf18u\\nn->0xpeer\\n'; fi; }`,
    'CANDIDATE_PIDS=(4242)',
    'CANDIDATE_CLASSES=(spec-memory-context-server)',
    `CANDIDATE_DB_DIRS=(${JSON.stringify(dbDir)})`,
    `reason="$(preserve_reason 4242 spec-memory-context-server 600 ${JSON.stringify(contextCommand)} || true)"`,
    'printf "%s\\n" "${reason:-none}"',
  ]);
}

function writeMarker(dbDir: string, value: unknown): void {
  writeFileSync(join(dbDir, '.maintenance-active.json'), JSON.stringify(value));
}

type SingletonOptions = {
  dbDirs: [string, string];
  listenerPids?: number[];
  listenerState?: 'macos' | 'linux';
  markerPid?: number;
  otherSocketDir?: string;
  duplicateSocketState?: 'held-deleted' | 'failure' | 'none';
};

function runSingletonSelection({
  dbDirs,
  listenerPids = [],
  listenerState = 'macos',
  markerPid,
  otherSocketDir,
  duplicateSocketState = 'none',
}: SingletonOptions): string[] {
  if (markerPid !== undefined) {
    const markerDir = markerPid === 1001 ? dbDirs[0] : dbDirs[1];
    writeMarker(markerDir, { childPid: markerPid, activeUntilMs: Date.now() + 60_000 });
  }
  const socketCases = listenerPids
    .map(
      (pid) =>
        `*" -p ${pid} "*) printf 'p${pid}\\nf17u\\nn%s\\n${listenerState === 'linux' ? 'TST=LISTEN\\n' : ''}' ${JSON.stringify(join(dbDirs[pid === 1001 ? 0 : 1], 'daemon-ipc.sock'))} ;;`,
    )
    .concat(
      otherSocketDir
        ? [`*" -p 1002 "*) printf 'p1002\\nf17u\\nn%s\\n' ${JSON.stringify(join(otherSocketDir, 'daemon-ipc.sock'))} ;;`]
        : [],
    )
    .concat(
      duplicateSocketState === 'held-deleted'
        ? [`*" -p 1002 "*) printf 'p1002\\nf17u\\nn/some/dir/daemon-ipc.sock (deleted)\\n' ;;`]
        : duplicateSocketState === 'failure'
          ? [`*" -p 1002 "*) return 1 ;;`]
          : [],
    )
    .join('\n');
  const output = runSourcedHarness([
    'lsof() {',
    '  case " $* " in',
    '    *" -FfnT "*)',
    '      case " $* " in',
    socketCases,
    "        *) printf 'p%s\\nf18u\\nn->0xpeer\\n' \"$4\" ;;",
    '      esac',
    '      ;;',
    '  esac',
    '}',
    'CANDIDATE_PIDS=(1001 1002)',
    'CANDIDATE_PPIDS=(1 1)',
    'CANDIDATE_CLASSES=(spec-memory-context-server spec-memory-context-server)',
    'CANDIDATE_AGES=(600 600)',
    'CANDIDATE_ETIMES=(10:00 10:00)',
    'CANDIDATE_RSSES=(100 100)',
    `CANDIDATE_COMMANDS=(${JSON.stringify(contextCommand)} ${JSON.stringify(contextCommand)})`,
    `CANDIDATE_DB_DIRS=(${JSON.stringify(dbDirs[0])} ${JSON.stringify(dbDirs[1])})`,
    'MIN_CLASSES=(spec-memory-context-server)',
    'MIN_AGES=(10)',
    'MIN_PIDS=(1002)',
    'select_kill_candidates',
    'printf "kill=%s\\n" "${KILL_PIDS[*]:-}"',
    'build_context_singleton_decisions',
    'printf "r1=%s\\n" "$(context_singleton_reason_for_pid 1001 2>/dev/null || echo none)"',
    'printf "r2=%s\\n" "$(context_singleton_reason_for_pid 1002 2>/dev/null || echo none)"',
    `printf "p2=%s\\n" "$(preserve_reason 1002 spec-memory-context-server 600 ${JSON.stringify(contextCommand)} 2>/dev/null || echo none)"`,
  ]);
  return output.split('\n');
}

type TerminationOptions = {
  currentCommand: string;
  dbDir: string;
  secondCandidate?: boolean;
  listenerAfterSleep?: boolean;
  dryRun?: boolean;
};

function runTermination({
  currentCommand,
  dbDir,
  secondCandidate = false,
  listenerAfterSleep = false,
  dryRun = false,
}: TerminationOptions): string[] {
  const signalLog = join(dir, 'signals.log');
  writeFileSync(signalLog, '');
  const output = runSourcedHarness(
    [
      'phase=before',
      `signal_log=${JSON.stringify(signalLog)}`,
      'kill() { printf "%s\\n" "$*" >> "$signal_log"; }',
      'sleep() { phase=after; }',
      'ps() {',
      '  if [[ "$1" = "-p" ]]; then',
      `    printf '%s\\n' ${JSON.stringify(currentCommand)}`,
      '  fi',
      '}',
      'lsof() {',
      listenerAfterSleep
        ? `  if [[ " $* " = *" -FfnT "* ]] && { { [[ "$phase" = before ]] && [[ " $* " = *" -p 4343 "* ]]; } || { [[ "$phase" = after ]] && [[ " $* " = *" -p 4242 "* ]]; }; }; then printf 'f17u\\nn%s\\nTST=LISTEN\\n' ${JSON.stringify(join(dbDir, 'daemon-ipc.sock'))}; elif [[ " $* " = *" -FfnT "* ]]; then printf 'p4242\\nf18u\\nn->0xpeer\\n'; fi`
        : `  if [[ " $* " = *" -FfnT "* ]]; then printf 'p4242\\nf18u\\nn->0xpeer\\n'; fi`,
      '}',
      'KILL_PIDS=(4242)',
      'KILL_CLASSES=(spec-memory-context-server)',
      'KILL_AGES=(600)',
      'KILL_ETIMES=(10:00)',
      'KILL_RSSES=(100)',
      `KILL_COMMANDS=(${JSON.stringify(contextCommand)})`,
      dryRun ? 'DRY_RUN=true' : 'DRY_RUN=false',
      secondCandidate ? 'CANDIDATE_PIDS=(4242 4343)' : 'CANDIDATE_PIDS=(4242)',
      secondCandidate
        ? 'CANDIDATE_CLASSES=(spec-memory-context-server spec-memory-context-server)'
        : 'CANDIDATE_CLASSES=(spec-memory-context-server)',
      secondCandidate ? `CANDIDATE_DB_DIRS=(${JSON.stringify(dbDir)} ${JSON.stringify(dbDir)})` : `CANDIDATE_DB_DIRS=(${JSON.stringify(dbDir)})`,
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

describe('orphan sweeper maintenance marker preserve', () => {
  it('preserves a candidate named by a fresh maintenance marker', () => {
    writeMarker(dir, { childPid: 4242, activeUntilMs: Date.now() + 60_000 });
    expect(preservationReason(dir)).toBe('maintenance-active');
  });

  it.each([
    ['expired', { childPid: 4242, activeUntilMs: Date.now() - 1 }],
    ['different pid', { childPid: 9999, activeUntilMs: Date.now() + 60_000 }],
  ])('does not protect an %s marker', (_label, marker) => {
    writeMarker(dir, marker);
    expect(preservationReason(dir)).toBe('none');
  });

  it('does not protect a malformed marker', () => {
    writeFileSync(join(dir, '.maintenance-active.json'), '{not-json');
    expect(preservationReason(dir)).toBe('none');
  });

  it('preserves a context server whose database directory is unresolved', () => {
    expect(preservationReason('unknown')).toBe('db-dir-unresolved');
  });
});

describe('orphan sweeper same-database singleton selection', () => {
  it('selects only the non-listener duplicate from macOS path-only lsof output', () => {
    const result = runSingletonSelection({ dbDirs: [dir, dir], listenerPids: [1001] });
    expect(result).toContain('kill=1002');
    expect(result).toContain('r1=same-db-singleton-listener');
    expect(result).toContain('r2=same-db-nonlistener-duplicate');
    expect(result).toContain('p2=none');
  });

  it('preserves a mis-grouped duplicate that holds a daemon socket for another directory', () => {
    const other = join(dir, 'other');
    mkdirSync(other);
    const result = runSingletonSelection({
      dbDirs: [dir, dir],
      listenerPids: [1001],
      otherSocketDir: other,
    });
    expect(result).toContain('kill=');
    expect(result).toContain('r2=same-db-nonlistener-duplicate');
    expect(result).toContain('p2=holds-daemon-socket-preserve');
  });

  it('preserves a non-listener duplicate whose daemon socket is annotated as deleted', () => {
    const result = runSingletonSelection({
      dbDirs: [dir, dir],
      listenerPids: [1001],
      duplicateSocketState: 'held-deleted',
    });
    expect(result).toContain('kill=');
    expect(result).toContain('p2=holds-daemon-socket-preserve');
  });

  it('preserves a non-listener duplicate when the daemon socket probe fails', () => {
    const result = runSingletonSelection({
      dbDirs: [dir, dir],
      listenerPids: [1001],
      duplicateSocketState: 'failure',
    });
    expect(result).toContain('kill=');
    expect(result).toContain('p2=daemon-socket-probe-unknown-preserve');
  });

  it('selects a non-listener duplicate only after affirmative non-socket fd evidence', () => {
    const result = runSingletonSelection({
      dbDirs: [dir, dir],
      listenerPids: [1001],
      duplicateSocketState: 'none',
    });
    expect(result).toContain('kill=1002');
    expect(result).toContain('p2=none');
  });

  it('selects only the non-listener duplicate from Linux LISTEN-state lsof output', () => {
    const result = runSingletonSelection({
      dbDirs: [dir, dir],
      listenerPids: [1001],
      listenerState: 'linux',
    });
    expect(result).toContain('kill=1002');
    expect(result).toContain('r1=same-db-singleton-listener');
    expect(result).toContain('r2=same-db-nonlistener-duplicate');
  });

  it('does not classify servers using different database directories as duplicates', () => {
    const other = join(dir, 'other');
    mkdirSync(other);
    const result = runSingletonSelection({ dbDirs: [dir, other] });
    expect(result).toContain('r1=none');
    expect(result).toContain('r2=none');
  });

  it.each([
    ['zero', []],
    ['two', [1001, 1002]],
  ])('preserves both candidates when %s listeners are confirmed', (_label, listenerPids) => {
    const result = runSingletonSelection({ dbDirs: [dir, dir], listenerPids });
    expect(result).toContain('kill=');
    expect(result).toContain('r1=same-db-listener-ambiguous');
    expect(result).toContain('r2=same-db-listener-ambiguous');
  });

  it('lets an active maintenance marker protect the non-listener duplicate', () => {
    const result = runSingletonSelection({ dbDirs: [dir, dir], listenerPids: [1001], markerPid: 1002 });
    expect(result).toContain('kill=');
  });

  it('preserves a lone canonical socket holder when macOS omits UNIX listener state', () => {
    const result = runSourcedHarness([
      `lsof() { printf 'p4242\\nf16\\nn%s\\n' ${JSON.stringify(join(dir, 'daemon-ipc.sock'))}; }`,
      'CANDIDATE_PIDS=(4242)',
      'CANDIDATE_CLASSES=(spec-memory-context-server)',
      `CANDIDATE_DB_DIRS=(${JSON.stringify(dir)})`,
      `preserve_reason 4242 spec-memory-context-server 600 ${JSON.stringify(contextCommand)}`,
    ]);
    expect(result).toBe('daemon-socket-listener-ambiguous');
  });
});

describe('orphan sweeper pre-signal reclassification', () => {
  it('sends neither TERM nor KILL when the pid now belongs to an unrelated command', () => {
    const result = runTermination({ currentCommand: '/usr/bin/sleep 10', dbDir: dir });
    expect(result).not.toContain('-15 4242');
    expect(result).not.toContain('-9 4242');
    expect(result.join('\n')).toContain('reason=pid-reclassified');
  });

  it('sends neither TERM nor KILL when the pid has the same class but a different full command', () => {
    const result = runTermination({ currentCommand: `${contextCommand} --replacement`, dbDir: dir });
    expect(result).not.toContain('-15 4242');
    expect(result).not.toContain('-9 4242');
    expect(result.join('\n')).toContain('reason=pid-reclassified');
  });

  it('sends TERM then KILL when command, class, and unprotected status remain unchanged', () => {
    const result = runTermination({ currentCommand: contextCommand, dbDir: dir });
    expect(result.slice(0, 2)).toEqual(['-15 4242', '-9 4242']);
  });

  it('revalidates and logs TERM without signaling in dry-run mode', () => {
    const result = runTermination({ currentCommand: contextCommand, dbDir: dir, dryRun: true });
    expect(result).not.toContain('-15 4242');
    expect(result.join('\n')).toContain('[DRY-RUN] action=kill signal=TERM pid=4242');
  });

  it('does not send KILL when the unchanged candidate becomes the singleton listener', () => {
    const result = runTermination({
      currentCommand: contextCommand,
      dbDir: dir,
      secondCandidate: true,
      listenerAfterSleep: true,
    });
    expect(result[0]).toBe('-15 4242');
    expect(result).not.toContain('-9 4242');
    expect(result.join('\n')).toContain('reason=same-db-singleton-listener');
  });
});
