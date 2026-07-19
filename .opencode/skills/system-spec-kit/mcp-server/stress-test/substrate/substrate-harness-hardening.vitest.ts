import { describe, expect, it } from 'vitest';

import {
  CODE_INDEX_INDEX_SUPPRESSION,
  RUN_ID,
  hermeticCodeIndexDbDir,
  leaseOwnerMatch,
  processStartedAt,
  renderSummaryTsv,
  summarySidecarPath,
  writeSummaryWithFallback,
} from './run-substrate-stress-harness.mjs';

// Owner-identity hardening: a live PID is necessary but not sufficient. After a hard crash the OS
// can recycle the crashed daemon's PID onto an unrelated live process; accepting it would mask a
// genuine crash as a tolerated SKIP. leaseOwnerMatch must require the process start time to match
// the lease's recorded start time, while falling back to liveness-only when the start time is
// unreadable (no regression below the prior behavior).
describe('substrate harness — owner identity (recycled-PID hardening)', () => {
  it('accepts the current process when the lease start time matches', () => {
    const start = processStartedAt(process.pid);
    expect(start).not.toBeNull();
    expect(leaseOwnerMatch(process.pid, start as number)).toBe(true);
  });

  it('rejects a live PID whose start time does not match the lease (recycled PID)', () => {
    // A live PID (this process) paired with a wildly old lease timestamp models a recycled PID:
    // the process is alive, but it is NOT the process that wrote the lease.
    const ancientLeaseStart = Date.parse('2000-01-01T00:00:00Z');
    expect(leaseOwnerMatch(process.pid, ancientLeaseStart)).toBe(false);
  });

  it('falls back to liveness-only when the lease has no parseable start time', () => {
    expect(leaseOwnerMatch(process.pid, Number.NaN)).toBe(true);
  });

  it('treats a dead/absent PID as not the owner', () => {
    expect(leaseOwnerMatch(2_147_483_646, Date.now())).toBe(false);
    expect(leaseOwnerMatch(0, Date.now())).toBe(false);
    expect(leaseOwnerMatch(-1, Date.now())).toBe(false);
  });
});

// Evidence-integrity hardening: the summary TSV must never silently present a prior run's pids.
describe('substrate harness — TSV run-id + sidecar', () => {
  const rows = [
    { scenario: 'runner:mk-spec-memory', verdict: 'SKIP', key_metric: 'k', detail: 'd' },
    { scenario: '410', verdict: 'PASS', key_metric: 'k2', detail: 'd2' },
  ];

  it('stamps every row with a trailing run_id column', () => {
    const lines = renderSummaryTsv(rows, 'RUNX').trim().split('\n');
    expect(lines[0]).toBe('scenario\tverdict\tkey_metric\tdetail\trun_id');
    expect(lines[1].split('\t')[4]).toBe('RUNX');
    expect(lines[2].split('\t')[4]).toBe('RUNX');
  });

  it('keeps scenario/verdict as the first two columns (no reader regression)', () => {
    const dataLines = renderSummaryTsv(rows, 'RUNX').trim().split('\n').slice(1);
    expect(dataLines[0].split('\t')[0]).toBe('runner:mk-spec-memory');
    expect(dataLines[0].split('\t')[1]).toBe('SKIP');
  });

  it('names the EPERM fallback sidecar with the run id and exposes a sane RUN_ID', () => {
    expect(summarySidecarPath('RUNX').endsWith('.RUNX.tsv')).toBe(true);
    expect(RUN_ID).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

// Clean-env hermeticity: a harness run must never trigger the maintainer-mode INDEX scan that
// rewrites graph-metadata across the tree. The flags below are spread into the code-index child env.
describe('substrate harness — maintainer-mode suppression', () => {
  it('forces maintainer mode and all five INDEX_* flags off for the code-index child', () => {
    expect(CODE_INDEX_INDEX_SUPPRESSION.SPECKIT_CODE_GRAPH_MAINTAINER_MODE).toBe('false');
    for (const key of [
      'SPECKIT_CODE_GRAPH_INDEX_SKILLS',
      'SPECKIT_CODE_GRAPH_INDEX_AGENTS',
      'SPECKIT_CODE_GRAPH_INDEX_COMMANDS',
      'SPECKIT_CODE_GRAPH_INDEX_SPECS',
      'SPECKIT_CODE_GRAPH_INDEX_PLUGINS',
    ] as const) {
      expect(CODE_INDEX_INDEX_SUPPRESSION[key]).toBe('false');
    }
  });
});

// EPERM fallback (forced via an injected writer): the canonical write throws EPERM, so the current
// run's evidence must be redirected to the run-id sidecar rather than silently dropped.
describe('substrate harness — EPERM sidecar fallback', () => {
  it('redirects to the run-id sidecar on EPERM and reports the fallback', () => {
    const written: string[] = [];
    const result = writeSummaryWithFallback('payload-body', {
      write: (p: string, _d: string) => {
        // Throw EPERM for the canonical path; succeed only for the run-id sidecar.
        if (!p.endsWith(`.${RUN_ID}.tsv`)) {
          const err = new Error('locked') as NodeJS.ErrnoException;
          err.code = 'EPERM';
          throw err;
        }
        written.push(p);
      },
      warn: () => {},
    });
    expect(result.fallback).toBe(true);
    expect(result.target).toBe(summarySidecarPath());
    expect(written).toEqual([summarySidecarPath()]);
  });

  it('writes the canonical path with no fallback on the happy path', () => {
    const written: string[] = [];
    const result = writeSummaryWithFallback('payload-body', {
      write: (p: string) => {
        written.push(p);
      },
      warn: () => {},
    });
    expect(result.fallback).toBe(false);
    expect(written).toHaveLength(1);
    expect(written[0].endsWith(`.${RUN_ID}.tsv`)).toBe(false);
  });
});

// Hermetic lever: opt-in via SPECKIT_SUBSTRATE_HERMETIC=1, giving the code-index child its own
// within-repo throwaway DB dir so it never contends with a live owner during clean-env runs.
describe('substrate harness — hermetic code-index DB dir', () => {
  it('returns null unless hermetic mode is explicitly enabled', () => {
    const prev = process.env.SPECKIT_SUBSTRATE_HERMETIC;
    try {
      delete process.env.SPECKIT_SUBSTRATE_HERMETIC;
      expect(hermeticCodeIndexDbDir('R1')).toBeNull();
      process.env.SPECKIT_SUBSTRATE_HERMETIC = '1';
      const dir = hermeticCodeIndexDbDir('R1');
      expect(dir).not.toBeNull();
      expect(dir).toContain('_sandbox');
      expect((dir as string).endsWith('/R1')).toBe(true);
    } finally {
      if (prev === undefined) delete process.env.SPECKIT_SUBSTRATE_HERMETIC;
      else process.env.SPECKIT_SUBSTRATE_HERMETIC = prev;
    }
  });
});
