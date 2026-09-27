// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Metrics File Permission Tests
// ───────────────────────────────────────────────────────────────

import { chmodSync, mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

// Each case can make the next chmod calls fail, as they do on a log another user owns.
const chmodFailures = vi.hoisted(() => ({ remaining: 0 }));

vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs/promises')>();
  return {
    ...actual,
    chmod: async (...args: Parameters<typeof actual.chmod>) => {
      if (chmodFailures.remaining > 0) {
        chmodFailures.remaining -= 1;
        throw Object.assign(new Error('operation not permitted'), { code: 'EPERM' });
      }
      return actual.chmod(...args);
    },
  };
});

const originalTmpdir = process.env.TMPDIR;
const scratchRoots: string[] = [];

// The metrics root is fixed from os.tmpdir() when the module loads, so each
// case points TMPDIR at its own scratch root before a fresh import.
async function loadMetrics(root: string) {
  process.env.TMPDIR = root;
  vi.resetModules();
  return import('../lib/metrics.js');
}

function scratchRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'advisor-metrics-perms-'));
  scratchRoots.push(root);
  return root;
}

afterEach(() => {
  chmodFailures.remaining = 0;
  if (originalTmpdir === undefined) delete process.env.TMPDIR;
  else process.env.TMPDIR = originalTmpdir;
  for (const root of scratchRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe.skipIf(process.platform === 'win32')('advisor metrics file permissions', () => {
  const record = {
    runtime: 'claude',
    outcome: 'accepted',
    skillLabel: 'sk-code',
    timestamp: '2026-09-27T00:00:00.000Z',
  } as const;

  it('creates the metrics directory and log private to the user', async () => {
    const root = scratchRoot();
    const metrics = await loadMetrics(root);
    const logPath = await metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record));
    expect(statSync(join(root, 'speckit-skill-advisor-metrics')).mode & 0o777).toBe(0o700);
    expect(statSync(logPath).mode & 0o777).toBe(0o600);
  });

  it('tightens a directory and log an older writer left open', async () => {
    const root = scratchRoot();
    const dir = join(root, 'speckit-skill-advisor-metrics');
    mkdirSync(dir);
    chmodSync(dir, 0o755);
    const metrics = await loadMetrics(root);
    const logPath = metrics.advisorHookOutcomesPath(root);
    writeFileSync(logPath, '');
    chmodSync(logPath, 0o644);
    await metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record));
    expect(statSync(dir).mode & 0o777).toBe(0o700);
    expect(statSync(logPath).mode & 0o777).toBe(0o600);
  });

  it('retries a tightening whose chmod failed on the next write', async () => {
    const root = scratchRoot();
    const dir = join(root, 'speckit-skill-advisor-metrics');
    mkdirSync(dir);
    chmodSync(dir, 0o755);
    const metrics = await loadMetrics(root);
    const logPath = metrics.advisorHookOutcomesPath(root);
    writeFileSync(logPath, '');
    chmodSync(logPath, 0o644);
    chmodFailures.remaining = 2;
    await metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record));
    expect(statSync(dir).mode & 0o777).toBe(0o755);
    expect(statSync(logPath).mode & 0o777).toBe(0o644);
    await metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record));
    expect(statSync(dir).mode & 0o777).toBe(0o700);
    expect(statSync(logPath).mode & 0o777).toBe(0o600);
  });
});
