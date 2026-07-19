import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const launcherPath = join(repoRoot, '.opencode/bin/mk-spec-memory-launcher.cjs');

type RecycleDeps = {
  getContextChild?: () => unknown;
  hfControl?: Record<string, unknown>;
  isChildRunning?: (child: unknown) => boolean;
  waitForChildExit?: (child: unknown, ms: number) => Promise<boolean>;
  clearLease?: () => void;
  clearWatchdog?: () => void;
  isRecycleInProgress?: () => boolean;
  setRecycleInProgress?: (value: boolean) => void;
  log?: (message: string) => void;
};

const launcher = require(launcherPath) as {
  recycleDaemonInPlace: (graceMs: number, deps?: RecycleDeps) => Promise<void>;
};

function fakeHfControl() {
  return {
    clearTimers: vi.fn(),
    stopDemandListener: vi.fn(() => Promise.resolve()),
    getChild: vi.fn(() => null),
    reapProcessTree: vi.fn(),
  };
}

describe('recycleDaemonInPlace single-writer lease retention', () => {
  it('keeps the lease held when an in-place recycle kills a live context-server child', async () => {
    const clearLease = vi.fn();
    const contextChild = { pid: 4242, kill: vi.fn() };
    let recycleFlag = false;

    await launcher.recycleDaemonInPlace(50, {
      getContextChild: () => contextChild,
      hfControl: fakeHfControl(),
      // The context-server child is alive at recycle time, exits cleanly on the first SIGTERM.
      isChildRunning: (child) => child === contextChild,
      waitForChildExit: () => Promise.resolve(true),
      clearLease,
      clearWatchdog: () => undefined,
      isRecycleInProgress: () => recycleFlag,
      setRecycleInProgress: (value) => { recycleFlag = value; },
      log: () => undefined,
    });

    // The launcher process stays alive across the recycle; clearing the lease here would
    // open a competing-launch window. Relaunch rewrites childPid, so the lease must persist.
    expect(clearLease).not.toHaveBeenCalled();
    expect(contextChild.kill).toHaveBeenCalledWith('SIGTERM');
  });

  it('escalates to SIGKILL but still keeps the lease when the child ignores SIGTERM', async () => {
    const clearLease = vi.fn();
    const contextChild = { pid: 4243, kill: vi.fn() };
    let recycleFlag = false;

    await launcher.recycleDaemonInPlace(50, {
      getContextChild: () => contextChild,
      hfControl: fakeHfControl(),
      isChildRunning: (child) => child === contextChild,
      // First grace wait reports the child still running, forcing the SIGKILL backstop.
      waitForChildExit: () => Promise.resolve(false),
      clearLease,
      clearWatchdog: () => undefined,
      isRecycleInProgress: () => recycleFlag,
      setRecycleInProgress: (value) => { recycleFlag = value; },
      log: () => undefined,
    });

    expect(contextChild.kill).toHaveBeenCalledWith('SIGTERM');
    expect(contextChild.kill).toHaveBeenCalledWith('SIGKILL');
    expect(clearLease).not.toHaveBeenCalled();
  });

  it('still clears the lease on the already-dead-child early-return branch', async () => {
    const clearLease = vi.fn();
    let recycleFlag = false;

    await launcher.recycleDaemonInPlace(50, {
      getContextChild: () => null,
      hfControl: fakeHfControl(),
      isChildRunning: () => false,
      waitForChildExit: () => Promise.resolve(true),
      clearLease,
      clearWatchdog: () => undefined,
      isRecycleInProgress: () => recycleFlag,
      setRecycleInProgress: (value) => { recycleFlag = value; },
      log: () => undefined,
    });

    // The dead-child path is a different branch from the cited fix and is left intact.
    expect(clearLease).toHaveBeenCalledTimes(1);
  });
});
