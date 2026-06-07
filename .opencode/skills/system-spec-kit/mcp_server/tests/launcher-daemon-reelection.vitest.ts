import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/mk-spec-memory-launcher.cjs') as {
  daemonReelectionEnabled: (env?: Record<string, string | undefined>) => boolean;
  contextServerSpawnIo: (reelectionEnabled: boolean) => { detached: boolean; stdio: [string, string, string] };
  shouldReleaseDaemonForReelection: (args?: { enabled?: boolean; hasLiveDaemon?: boolean }) => boolean;
};

describe('daemon re-election flag', () => {
  it('is off by default and on only for explicit 1/on', () => {
    // Default OFF is the safety contract: every other code path collapses to today's behavior.
    expect(launcher.daemonReelectionEnabled({})).toBe(false);
    expect(launcher.daemonReelectionEnabled({ SPECKIT_DAEMON_REELECTION: '1' })).toBe(true);
    expect(launcher.daemonReelectionEnabled({ SPECKIT_DAEMON_REELECTION: 'on' })).toBe(true);
    expect(launcher.daemonReelectionEnabled({ SPECKIT_DAEMON_REELECTION: '0' })).toBe(false);
    expect(launcher.daemonReelectionEnabled({ SPECKIT_DAEMON_REELECTION: 'yes' })).toBe(false);
  });
});

describe('context-server spawn io gating', () => {
  it('flag-off reproduces the historical spawn options exactly', () => {
    // This is the regression guard: with re-election off, the daemon must be spawned exactly as before
    // (tied to the owner, inherited stderr, not detached).
    expect(launcher.contextServerSpawnIo(false)).toEqual({
      detached: false,
      stdio: ['ignore', 'ignore', 'inherit'],
    });
  });

  it('flag-on spawns detached with no inherited stdio so the daemon can outlive the owner', () => {
    expect(launcher.contextServerSpawnIo(true)).toEqual({
      detached: true,
      stdio: ['ignore', 'ignore', 'ignore'],
    });
  });
});

describe('shouldReleaseDaemonForReelection', () => {
  it('never releases when re-election is off (the daemon is killed as today)', () => {
    expect(launcher.shouldReleaseDaemonForReelection({ enabled: false, hasLiveDaemon: true })).toBe(false);
    expect(launcher.shouldReleaseDaemonForReelection()).toBe(false);
  });

  it('only releases when enabled AND a live daemon exists to adopt', () => {
    expect(launcher.shouldReleaseDaemonForReelection({ enabled: true, hasLiveDaemon: false })).toBe(false);
    expect(launcher.shouldReleaseDaemonForReelection({ enabled: true, hasLiveDaemon: true })).toBe(true);
  });
});
