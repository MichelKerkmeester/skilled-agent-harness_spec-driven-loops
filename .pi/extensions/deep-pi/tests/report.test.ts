// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Report Transport Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { access, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import deepPi from '../extensions/deeppi.js';
import { readStatsFile, reportSnapshotPath, statsPath } from '../extensions/deeppi/stats.js';
import {
  buildDeepPiReport,
  createTelemetryState,
  recordUsage,
  renderDeepPiReport,
} from '../extensions/deeppi/telemetry.js';
import { fakeContext, FakePi } from './fake-pi.js';

import type { ReportInput } from '../extensions/deeppi/telemetry.js';

// ───────────────────────────────────────────────────────────────────
// 2. TEST FIXTURES
// ───────────────────────────────────────────────────────────────────

let testRoot = '';

const pro = {
  provider: 'deepseek',
  id: 'deepseek-v4-pro' as const,
  cost: { input: 0.435, output: 0.87, cacheRead: 0.003625, cacheWrite: 0 },
};

function reportInput(): ReportInput {
  const telemetry = createTelemetryState();
  recordUsage(telemetry, pro, {
    input: 20_000,
    output: 1_000,
    cacheRead: 80_000,
    cacheWrite: 0,
    totalTokens: 101_000,
    cost: { input: 0.0087, output: 0.00087, cacheRead: 0.00029, cacheWrite: 0, total: 0.00986 },
  });
  return {
    eligible: true,
    modelId: 'deepseek-v4-pro',
    telemetry,
    latestChurn: ['tool-schema'],
    loopsGuarded: 2,
    loopsAborted: 1,
    editAttempts: 5,
    editMismatches: 1,
    editSuccesses: 4,
    errorsEnhanced: 0,
    prunedThinking: 0,
    preservedThinking: 0,
    transformErrors: 0,
    usageUnavailable: false,
    costMathErrors: 0,
  };
}

beforeEach(async () => {
  testRoot = await mkdtemp(join(tmpdir(), 'deep-pi-report-'));
});

afterEach(async () => {
  await rm(testRoot, { recursive: true, force: true });
});

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

describe('report layers', () => {
  it('builds plain versioned data and renders it separately', () => {
    const input = reportInput();
    const report = buildDeepPiReport(input);

    expect(report.schemaVersion).toBe(1);
    expect(report.totals).toEqual(input.telemetry.byModel['deepseek-v4-pro']);
    expect(report).not.toHaveProperty('formattedText');
    expect(renderDeepPiReport(report)).toContain('No-cache counterfactual savings:');
  });
});

describe('command transport', () => {
  it('writes a snapshot and stats without notifying in UI-less mode', async () => {
    const fake = new FakePi();
    deepPi(fake.asExtensionAPI());
    const ctx = fakeContext({ provider: 'openrouter', id: 'deepseek-v4-pro' });
    ctx.cwd = testRoot;
    ctx.hasUI = false;
    let notifications = 0;
    ctx.ui.notify = () => {
      notifications++;
    };

    // DeepPi registration installs the command synchronously before this lookup.
    await fake.commands.get('deeppi')!.handler('', ctx);

    expect(notifications).toBe(0);
    const snapshot = JSON.parse(await readFile(reportSnapshotPath(testRoot), 'utf8')) as {
      schemaVersion: number;
      eligible: boolean;
      totals: unknown;
    };
    expect(snapshot.schemaVersion).toBe(1);
    expect(snapshot.eligible).toBe(false);
    expect(snapshot.totals).toBeNull();
    expect((await readStatsFile(statsPath(testRoot))).status).toBe('ok');
  });

  it('does not write persistence on message_end but flushes on session shutdown', async () => {
    const fake = new FakePi();
    deepPi(fake.asExtensionAPI());
    const ctx = fakeContext(pro);
    ctx.cwd = testRoot;
    await fake.emit('session_start', {}, ctx);

    await fake.emit('message_end', {
      message: {
        role: 'assistant',
        provider: 'deepseek',
        model: 'deepseek-v4-pro',
        stopReason: 'stop',
        usage: {
          input: 10,
          output: 1,
          cacheRead: 20,
          cacheWrite: 0,
          totalTokens: 31,
          cost: {
            input: 0.00000435,
            output: 0.00000087,
            cacheRead: 0.0000000725,
            cacheWrite: 0,
            total: 0.00000435,
          },
        },
      },
    }, ctx);
    await expect(access(statsPath(testRoot))).rejects.toThrow();

    await fake.emit('session_shutdown', {}, ctx);
    expect((await readStatsFile(statsPath(testRoot))).status).toBe('ok');
  });
});
