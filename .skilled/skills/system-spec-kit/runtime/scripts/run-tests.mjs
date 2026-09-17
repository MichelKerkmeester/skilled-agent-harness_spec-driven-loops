#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ MODULE: Test Runner — bounded Vitest test invocations                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// Route `npm test -- --run ...` to the requested Vitest lane without running the full core suite first.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const vitestBin = fileURLToPath(new URL(`../node_modules/.bin/vitest${process.platform === 'win32' ? '.cmd' : ''}`, import.meta.url));
const DEFAULT_TEST_RUN_TIMEOUT_MS = 10 * 60_000;
const testRunTimeoutMs = resolveTestRunTimeoutMs();
const PROCESS_GROUP_RUNNER = String.raw`
import os
import signal
import subprocess
import sys
import time

timeout_ms = int(sys.argv[1])
TERMINATION_GRACE_SECONDS = 2
command = sys.argv[2:]
if not command:
    print('[test-bound] no command was provided', file=sys.stderr, flush=True)
    sys.exit(2)

process = subprocess.Popen(command, start_new_session=True, stdin=subprocess.DEVNULL)
try:
    process.wait(timeout=timeout_ms / 1000)
except subprocess.TimeoutExpired:
    print(f'[test-bound] invocation exceeded {timeout_ms}ms; terminating process group', file=sys.stderr, flush=True)
    try:
        os.killpg(process.pid, signal.SIGTERM)
    except ProcessLookupError:
        pass

    deadline = time.monotonic() + TERMINATION_GRACE_SECONDS
    while time.monotonic() < deadline and process.poll() is None:
        time.sleep(0.05)

    try:
        os.killpg(process.pid, signal.SIGKILL)
    except ProcessLookupError:
        pass
    process.wait()
    sys.exit(124)

return_code = process.returncode
sys.exit(return_code if return_code >= 0 else 128 - return_code)
`.trim();
const laneSelectors = new Map([
  ['--security', ['run', 'tests/security/redteam-probe-gate.vitest.ts']],
  ['security', ['run', 'tests/security/redteam-probe-gate.vitest.ts']],
  ['redteam-probe-gate', ['run', 'tests/security/redteam-probe-gate.vitest.ts']],
]);

function resolveTestRunTimeoutMs() {
  const rawTimeout = process.env.SPECKIT_TEST_RUN_TIMEOUT_MS;
  if (rawTimeout === undefined) {
    return DEFAULT_TEST_RUN_TIMEOUT_MS;
  }

  const timeoutMs = Number(rawTimeout);
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) {
    console.error('[test-bound] SPECKIT_TEST_RUN_TIMEOUT_MS must be a positive integer');
    process.exit(2);
  }
  return timeoutMs;
}

function run(command, commandArgs) {
  const startedAt = Date.now();
  const result = spawnSync('python3', [
    '-c',
    PROCESS_GROUP_RUNNER,
    String(testRunTimeoutMs),
    command,
    ...commandArgs,
  ], {
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: false,
  });

  if (result.error) {
    console.error(`[test-bound] failed to start ${command}: ${result.error.message}`);
    return 1;
  }

  if (result.status === 0) {
    const elapsedMs = Date.now() - startedAt;
    console.error(
      `[test-bound] healthy invocation completed in ${elapsedMs}ms; `
      + `bound ${testRunTimeoutMs}ms; margin ${testRunTimeoutMs - elapsedMs}ms`,
    );
  }

  return result.status ?? 1;
}

const selectedLane = laneSelectors.get(args[0]);
if (selectedLane) {
  process.exit(run(vitestBin, [...selectedLane, ...args.slice(1)]));
}

if (args.length > 0) {
  process.exit(run(vitestBin, args));
}

let status = run('npm', ['run', 'test:core']);
if (status !== 0) {
  process.exit(status);
}

status = run('npm', ['run', 'test:file-watcher']);
if (status !== 0) {
  process.exit(status);
}

status = run('npm', ['run', 'test:spec-validation']);
process.exit(status);
