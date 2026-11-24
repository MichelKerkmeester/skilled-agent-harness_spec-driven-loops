// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Metrics File Permission Tests
// ───────────────────────────────────────────────────────────────

import {
  chmodSync,
  existsSync,
  linkSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

// Each case can make the next chmod calls fail, as they do on a log another user owns.
const chmodFailures = vi.hoisted(() => ({ remaining: 0 }));
const fileChmodFailures = vi.hoisted(() => ({ remaining: 0 }));
const openFailures = vi.hoisted(() => ({ code: null as string | null }));

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
    open: async (...args: Parameters<typeof actual.open>) => {
      if (openFailures.code) {
        const code = openFailures.code;
        openFailures.code = null;
        throw Object.assign(new Error('open failed'), { code });
      }
      const handle = await actual.open(...args);
      const originalChmod = handle.chmod.bind(handle);
      Object.defineProperty(handle, 'chmod', {
        configurable: true,
        value: async (...chmodArgs: Parameters<typeof handle.chmod>) => {
          if (fileChmodFailures.remaining > 0) {
            fileChmodFailures.remaining -= 1;
            throw Object.assign(new Error('operation not permitted'), { code: 'EPERM' });
          }
          return originalChmod(...chmodArgs);
        },
      });
      return handle;
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
  vi.restoreAllMocks();
  chmodFailures.remaining = 0;
  fileChmodFailures.remaining = 0;
  openFailures.code = null;
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
    const lines = readFileSync(logPath, 'utf8').trim().split('\n');
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('"skillLabel":"sk-code"');
  });

  it('tightens a group-writable directory and an older log', async () => {
    const root = scratchRoot();
    const dir = join(root, 'speckit-skill-advisor-metrics');
    mkdirSync(dir);
    chmodSync(dir, 0o775);
    const metrics = await loadMetrics(root);
    const logPath = metrics.advisorHookOutcomesPath(root);
    writeFileSync(logPath, '');
    chmodSync(logPath, 0o644);
    await metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record));
    expect(statSync(dir).mode & 0o777).toBe(0o700);
    expect(statSync(logPath).mode & 0o777).toBe(0o600);
  });

  it('stops the write when the folder chmod fails and retries next time', async () => {
    const root = scratchRoot();
    const dir = join(root, 'speckit-skill-advisor-metrics');
    mkdirSync(dir);
    chmodSync(dir, 0o755);
    const metrics = await loadMetrics(root);
    const logPath = metrics.advisorHookOutcomesPath(root);
    writeFileSync(logPath, '');
    chmodSync(logPath, 0o644);
    chmodFailures.remaining = 1;
    await metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record));
    expect(statSync(dir).mode & 0o777).toBe(0o755);
    expect(statSync(logPath).mode & 0o777).toBe(0o644);
    expect(readFileSync(logPath, 'utf8')).toBe('');
    await metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record));
    expect(statSync(dir).mode & 0o777).toBe(0o700);
    expect(statSync(logPath).mode & 0o777).toBe(0o600);
    expect(readFileSync(logPath, 'utf8').trim().split('\n')).toHaveLength(1);
  });

  it('skips the append when the log chmod fails', async () => {
    const root = scratchRoot();
    const dir = join(root, 'speckit-skill-advisor-metrics');
    mkdirSync(dir, { mode: 0o700 });
    const metrics = await loadMetrics(root);
    const logPath = metrics.advisorHookOutcomesPath(root);
    writeFileSync(logPath, '');
    chmodSync(logPath, 0o644);
    fileChmodFailures.remaining = 1;

    await expect(
      metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record)),
    ).resolves.toBe(logPath);
    expect(readFileSync(logPath, 'utf8')).toBe('');
    expect(statSync(logPath).mode & 0o777).toBe(0o644);

    await metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record));
    expect(readFileSync(logPath, 'utf8').trim().split('\n')).toHaveLength(1);
    expect(statSync(logPath).mode & 0o777).toBe(0o600);
  });

  it('leaves a symlinked log target unchanged', async () => {
    const root = scratchRoot();
    const dir = join(root, 'speckit-skill-advisor-metrics');
    const victim = join(root, 'victim.txt');
    mkdirSync(dir, { mode: 0o700 });
    writeFileSync(victim, 'orig\n');
    chmodSync(victim, 0o644);
    const metrics = await loadMetrics(root);
    const logPath = metrics.advisorHookOutcomesPath(root);
    symlinkSync(victim, logPath);

    await expect(
      metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record)),
    ).resolves.toBe(logPath);

    expect(readFileSync(victim, 'utf8')).toBe('orig\n');
    expect(statSync(victim).mode & 0o777).toBe(0o644);
    expect(lstatSync(logPath).isSymbolicLink()).toBe(true);
  });

  it('skips a metrics folder another user owns', async () => {
    const root = scratchRoot();
    const metrics = await loadMetrics(root);
    const logPath = metrics.advisorHookOutcomesPath(root);
    const currentUid = process.getuid();
    vi.spyOn(process, 'getuid').mockReturnValue(currentUid + 1);

    await expect(
      metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record)),
    ).resolves.toBe(logPath);
    expect(existsSync(logPath)).toBe(false);
  });

  it('refuses a symlinked metrics folder', async () => {
    const root = scratchRoot();
    const elsewhere = join(root, 'elsewhere');
    const dir = join(root, 'speckit-skill-advisor-metrics');
    mkdirSync(elsewhere);
    chmodSync(elsewhere, 0o755);
    symlinkSync(elsewhere, dir);
    const metrics = await loadMetrics(root);
    const logPath = metrics.advisorHookOutcomesPath(root);

    await expect(
      metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record)),
    ).resolves.toBe(logPath);
    expect(readdirSync(elsewhere)).toEqual([]);
    expect(statSync(elsewhere).mode & 0o777).toBe(0o755);
  });

  it('does not append through a hard-linked log', async () => {
    const root = scratchRoot();
    const dir = join(root, 'speckit-skill-advisor-metrics');
    const victim = join(root, 'victim.txt');
    mkdirSync(dir, { mode: 0o700 });
    writeFileSync(victim, 'orig\n');
    chmodSync(victim, 0o600);
    const metrics = await loadMetrics(root);
    const logPath = metrics.advisorHookOutcomesPath(root);
    linkSync(victim, logPath);

    await expect(
      metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record)),
    ).resolves.toBe(logPath);
    expect(readFileSync(victim, 'utf8')).toBe('orig\n');
    expect(statSync(logPath).nlink).toBe(2);
  });

  it('skips the write when O_NOFOLLOW reports EMLINK', async () => {
    const root = scratchRoot();
    const metrics = await loadMetrics(root);
    const logPath = metrics.advisorHookOutcomesPath(root);
    openFailures.code = 'EMLINK';

    await expect(
      metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record)),
    ).resolves.toBe(logPath);
    expect(existsSync(logPath)).toBe(false);
  });

  it('does not write the trim through a planted temp name', async () => {
    const root = scratchRoot();
    const victim = join(root, 'victim.txt');
    writeFileSync(victim, 'orig\n');
    const metrics = await loadMetrics(root);
    const logPath = metrics.advisorHookOutcomesPath(root);

    for (let index = 0; index < 300; index += 1) {
      await metrics.persistAdvisorHookOutcomeRecord(
        root,
        metrics.createAdvisorHookOutcomeRecord(record),
      );
    }

    const temporaryPath = logPath + '.' + process.pid + '.1.tmp';
    symlinkSync(victim, temporaryPath);
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(1);
    try {
      await expect(
        metrics.persistAdvisorHookOutcomeRecord(root, metrics.createAdvisorHookOutcomeRecord(record)),
      ).rejects.toMatchObject({ code: 'EEXIST' });
    } finally {
      dateNowSpy.mockRestore();
    }
    expect(readFileSync(victim, 'utf8')).toBe('orig\n');
    expect(readFileSync(logPath, 'utf8').trim().split('\n')).toHaveLength(301);
  });
});
