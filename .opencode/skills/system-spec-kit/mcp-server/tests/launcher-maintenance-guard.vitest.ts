import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

type MaintenanceMarker = {
  childPid: number;
  activeUntilMs: number;
  jobId?: string;
  refreshedAtIso?: string;
};

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/mk-spec-memory-launcher.cjs') as {
  readMaintenanceMarker: (
    dbDir: string,
    options?: { fs?: { readFileSync?: (path: string, encoding?: string) => string } },
  ) => MaintenanceMarker | null;
  shouldAdoptDespiteProbe: (options?: {
    marker?: MaintenanceMarker | null;
    childPid?: number;
    childLiveness?: string;
    nowMs?: number | (() => number);
  }) => boolean;
};

describe('launcher maintenance-active adopt guard', () => {
  const NOW = Date.parse('2026-06-09T00:00:00.000Z');
  const freshMarker = (childPid: number): MaintenanceMarker => ({
    childPid,
    activeUntilMs: NOW + 30_000,
    jobId: 'index-scan-1',
    refreshedAtIso: '2026-06-09T00:00:00.000Z',
  });

  it('adopts a fresh marker that names this exact live child (a)', () => {
    // Busy-by-design: the marker is unexpired, names the probed child, and the
    // child is alive — the only case where adoption beats reaping.
    expect(
      launcher.shouldAdoptDespiteProbe({
        marker: freshMarker(4242),
        childPid: 4242,
        childLiveness: 'alive',
        nowMs: NOW,
      }),
    ).toBe(true);
  });

  it('reaps once the marker has expired (b)', () => {
    // A genuinely wedged daemon cannot fire its refresh timer, so the marker
    // ages out (activeUntilMs <= nowMs) and normal reaping must resume.
    expect(
      launcher.shouldAdoptDespiteProbe({
        marker: { ...freshMarker(4242), activeUntilMs: NOW },
        childPid: 4242,
        childLiveness: 'alive',
        nowMs: NOW,
      }),
    ).toBe(false);
  });

  it('reaps when the marker names a different child (c)', () => {
    // A marker left over from a prior daemon child must never pin the current
    // one; a childPid mismatch falls through to the reap path.
    expect(
      launcher.shouldAdoptDespiteProbe({
        marker: freshMarker(4242),
        childPid: 9999,
        childLiveness: 'alive',
        nowMs: NOW,
      }),
    ).toBe(false);
  });

  it('reaps when the probed child is dead (d)', () => {
    expect(
      launcher.shouldAdoptDespiteProbe({
        marker: freshMarker(4242),
        childPid: 4242,
        childLiveness: 'dead',
        nowMs: NOW,
      }),
    ).toBe(false);
  });

  it('reaps when liveness is unknown-eperm rather than confirmably alive (e)', () => {
    // Fail-safe toward reaping: anything other than a confirmed 'alive' must not
    // adopt, so an EPERM-masked liveness does not pin a possibly-dead daemon.
    expect(
      launcher.shouldAdoptDespiteProbe({
        marker: freshMarker(4242),
        childPid: 4242,
        childLiveness: 'unknown-eperm',
        nowMs: NOW,
      }),
    ).toBe(false);
  });

  it('reaps when there is no marker at all (f)', () => {
    expect(
      launcher.shouldAdoptDespiteProbe({
        marker: null,
        childPid: 4242,
        childLiveness: 'alive',
        nowMs: NOW,
      }),
    ).toBe(false);
  });

  it('reaps for an invalid childPid (0 / non-integer) (g)', () => {
    for (const childPid of [0, -1, 4242.5, Number.NaN] as number[]) {
      expect(
        launcher.shouldAdoptDespiteProbe({
          marker: freshMarker(4242),
          childPid,
          childLiveness: 'alive',
          nowMs: NOW,
        }),
      ).toBe(false);
    }
  });

  // The guard is label-agnostic (it only looks at childPid/activeUntilMs/liveness), so a
  // marker written by the boot-time FTS integrity-rebuild call site is spared exactly like
  // any other maintenance source. This is the shape context-server.ts's maintenance-marker.ts
  // wrap actually writes to disk (see maintenance-marker.vitest.ts's boot-rebuild coverage).
  const bootRebuildMarker = (childPid: number): MaintenanceMarker => ({
    childPid,
    activeUntilMs: NOW + 30_000,
    jobId: undefined,
    refreshedAtIso: '2026-06-09T00:00:00.000Z',
  });

  it('adopts a daemon busy with the boot-time FTS integrity-rebuild (h)', () => {
    expect(
      launcher.shouldAdoptDespiteProbe({
        marker: bootRebuildMarker(4242),
        childPid: 4242,
        childLiveness: 'alive',
        nowMs: NOW,
      }),
    ).toBe(true);
  });

  it('reaps once a boot-rebuild marker has lapsed past its activeUntilMs (i)', () => {
    // A genuinely wedged rebuild cannot refresh the marker, so it ages out and normal
    // reaping resumes — the fail-safe this fix intentionally does not touch.
    expect(
      launcher.shouldAdoptDespiteProbe({
        marker: { ...bootRebuildMarker(4242), activeUntilMs: NOW - 1 },
        childPid: 4242,
        childLiveness: 'alive',
        nowMs: NOW,
      }),
    ).toBe(false);
  });
});

describe('launcher maintenance marker reader (injected fs)', () => {
  const injectFs = (readFileSync: (path: string) => string) =>
    ({ fs: { readFileSync } });

  it('returns the parsed object for a valid marker (a)', () => {
    const marker = {
      childPid: 4242,
      activeUntilMs: 1_700_000_000_000,
      jobId: 'index-scan-1',
      refreshedAtIso: '2026-06-09T00:00:00.000Z',
    };
    expect(
      launcher.readMaintenanceMarker('/db', injectFs(() => JSON.stringify(marker))),
    ).toEqual(marker);
  });

  it('returns null when the marker file is missing (ENOENT) (b)', () => {
    expect(
      launcher.readMaintenanceMarker('/db', injectFs(() => {
        throw Object.assign(new Error('no such file'), { code: 'ENOENT' });
      })),
    ).toBeNull();
  });

  it('returns null for corrupt JSON (c)', () => {
    expect(
      launcher.readMaintenanceMarker('/db', injectFs(() => 'not json {')),
    ).toBeNull();
  });

  it('returns null when childPid is missing (d)', () => {
    expect(
      launcher.readMaintenanceMarker(
        '/db',
        injectFs(() => JSON.stringify({ activeUntilMs: 1_700_000_000_000, jobId: 'x' })),
      ),
    ).toBeNull();
  });

  it('returns null when activeUntilMs is non-finite (e)', () => {
    expect(
      launcher.readMaintenanceMarker(
        '/db',
        // JSON.stringify turns Infinity into null, which is non-finite by the
        // reader's Number.isFinite gate — the canonical corrupt-time shape.
        injectFs(() => JSON.stringify({ childPid: 4242, activeUntilMs: Infinity })),
      ),
    ).toBeNull();
  });
});
