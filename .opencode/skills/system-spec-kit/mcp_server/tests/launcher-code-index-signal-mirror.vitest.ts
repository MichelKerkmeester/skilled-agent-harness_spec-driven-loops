// ───────────────────────────────────────────────────────────────
// MODULE: mk-code-index Launcher Signal-Mirror Tests
// ───────────────────────────────────────────────────────────────
// Regression for the child-exit signal mirror: when the daemon child is killed by
// a catchable signal (SIGTERM/SIGINT/SIGHUP/SIGQUIT), the launcher must terminate
// with the SAME signal so a supervisor sees abnormal death — not exit 0. Before the
// fix, the self-sent signal re-entered the launcher's own handler (childProcess.killed
// === false for an external kill) which exits 0, masking the abnormal termination.
// The fix removes the launcher's own handler for that signal before re-raising.
//
// This validates the mechanism in isolation (the real path lives inside launchServer's
// child-exit handler, which requires a spawned daemon): a process that installs the
// launcher's signal handlers and then runs the fixed mirror (removeAllListeners +
// self-kill) terminates via the signal, whereas the buggy mirror (self-kill only) does
// not produce the signaled status.

import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

// Installs the same catchable-signal handlers the launcher installs, then runs either
// the FIXED mirror (removeAllListeners first) or the BUGGY mirror (self-kill only).
function runMirrorHarness(mode: 'fixed' | 'buggy'): { status: number | null; signal: NodeJS.Signals | null } {
  const script = `
    const SIGS = ['SIGINT','SIGTERM','SIGHUP','SIGQUIT'];
    // Launcher installs these handlers; for an externally-killed child the handler
    // path exits 0 (childProcess.killed === false), masking the signal.
    for (const sig of SIGS) {
      process.on(sig, () => { process.exit(0); });
    }
    const signal = 'SIGTERM';
    if (${JSON.stringify(mode)} === 'fixed') {
      process.removeAllListeners(signal);
    }
    process.kill(process.pid, signal);
    // If the signal was swallowed by a handler that did not exit, keep the loop alive
    // briefly so the test can observe a non-signaled exit.
    setTimeout(() => process.exit(7), 200);
  `;
  const result = spawnSync(process.execPath, ['-e', script], { encoding: 'utf8', timeout: 5000 });
  return { status: result.status, signal: result.signal };
}

describe('mk-code-index launcher signal mirror', () => {
  it('FIXED mirror terminates the process via the signal (not a clean exit)', () => {
    const { status, signal } = runMirrorHarness('fixed');
    // Killed by SIGTERM: node reports signal === 'SIGTERM' and status === null.
    expect(signal).toBe('SIGTERM');
    expect(status).toBeNull();
  });

  it('BUGGY mirror (self-kill only) is intercepted by the launcher handler and does NOT signal-terminate', () => {
    const { status, signal } = runMirrorHarness('buggy');
    // The own handler catches the self-sent signal and exits 0 — proving the bug the
    // fix closes: an externally-killed daemon would be misreported as a clean shutdown.
    expect(signal).toBeNull();
    expect(status).toBe(0);
  });

  it('source: the child-exit handler removes its own signal listener before re-raising', async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, resolve } = await import('node:path');
    const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');
    const src = readFileSync(resolve(repoRoot, '.opencode/bin/mk-code-index-launcher.cjs'), 'utf8');
    // The removeAllListeners(signal) call must precede the self-kill mirror.
    const removeIdx = src.indexOf('process.removeAllListeners(signal)');
    const killIdx = src.indexOf('process.kill(process.pid, signal)');
    expect(removeIdx).toBeGreaterThan(-1);
    expect(killIdx).toBeGreaterThan(-1);
    expect(removeIdx).toBeLessThan(killIdx);
  });
});
