// ───────────────────────────────────────────────────────────────────
// MODULE: Fan-out Iteration Budget Flag And Lineage Log Masking Tests
// ───────────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';

import { afterEach, describe, expect, it } from 'vitest';

import { createHermeticEnv, runtimeRoot, spawnCjs, type HermeticEnv } from '../helpers/spawn-cjs';

const requireCjs = createRequire(import.meta.url);
const fanoutRunScript = resolve(runtimeRoot, 'scripts', 'fanout-run.cjs');

type Lineage = { label: string; iterations?: number };
const runner = requireCjs('../../scripts/fanout-run.cjs') as {
  flagLineageBudgets: (lineages: Lineage[], maxIterations: number | null) => Lineage[];
  expansiveLineageBudgets: (lineages: Lineage[], options: { loopType: string; partition: Record<string, unknown[]> | null }) => Lineage[];
  redactProviderText: (text: string) => string;
  rerunCommandFor: (label: string, argv: string[]) => string;
};

const hermeticEnvs: HermeticEnv[] = [];
const tempDirs: string[] = [];
afterEach(() => {
  for (const env of hermeticEnvs.splice(0)) env.cleanup();
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('fanout-run.cjs — an explicit --max-iterations binds the lineage budget', () => {
  it('binds an expansive lineage the matrix gave no iterations, ahead of its seed share', () => {
    const seeded = { a: [{}, {}, {}, {}, {}, {}], b: [] };
    const flagged = runner.flagLineageBudgets([{ label: 'a' }, { label: 'b' }], 8);
    const budgeted = runner.expansiveLineageBudgets(flagged, { loopType: 'review', partition: seeded });
    expect(budgeted.map((lineage) => lineage.iterations)).toEqual([8, 8]);
  });

  it('keeps a matrix iterations value as given, and derives from the seed when the flag is absent', () => {
    const flagged = runner.flagLineageBudgets([{ label: 'a', iterations: 3 }, { label: 'b' }], 8);
    expect(flagged.map((lineage) => lineage.iterations)).toEqual([3, 8]);
    const unflagged = runner.flagLineageBudgets([{ label: 'a' }], null);
    const derived = runner.expansiveLineageBudgets(unflagged, { loopType: 'review', partition: { a: [] } });
    expect(Number.isInteger(derived[0].iterations)).toBe(true);
    expect(derived[0].iterations).not.toBe(8);
  });

  it('keeps the flag in the command that reruns one lineage', () => {
    const command = runner.rerunCommandFor('a', ['--loop-type', 'review', '--max-iterations', '8', '--only-lineage', 'b']);
    expect(command).toMatch(/ --max-iterations 8 /);
    expect(command).toMatch(/ --only-lineage a$/);
    expect(command).not.toContain('--only-lineage b');
  });

  async function preview(testId: string, extra: string[]) {
    const hermetic = createHermeticEnv(testId);
    hermeticEnvs.push(hermetic);
    const binDir = mkdtempSync(join(tmpdir(), 'fanout-budget-bin-'));
    tempDirs.push(binDir);
    writeFileSync(join(binDir, 'opencode'), '#!/bin/sh\nif [ "$1" = "--version" ]; then echo 2.3.2; exit 0; fi\nexit 0\n', { mode: 0o755 });
    const specFolder = `specs/test-fanout-budget-${testId}`;
    const baseDir = join(hermetic.tmpDir, specFolder, 'research');
    mkdirSync(baseDir, { recursive: true });
    return spawnCjs(fanoutRunScript, [
      '--spec-folder', specFolder,
      '--loop-type', 'research',
      '--research-topic', 'Topic',
      '--fanout-config-json', JSON.stringify({
        executors: [
          { label: 'free', kind: 'cli-opencode', model: 'llmgateway/deepseek-v4.1-flash-1017' },
          { label: 'pinned', kind: 'cli-opencode', model: 'llmgateway/deepseek-v4.1-flash-1017', iterations: 2 },
        ],
        concurrency: 2,
      }),
      '--base-artifact-dir', baseDir,
      '--preview',
      ...extra,
    ], { cwd: hermetic.tmpDir, env: { ...hermetic.env, PATH: `${binDir}:${hermetic.env['PATH'] ?? ''}` }, timeoutMs: 15_000 });
  }

  for (const depthMode of ['default', 'expansive']) {
    it(`binds a ${depthMode}-mode lineage from the flag and says so on stderr`, async () => {
      const result = await preview(`flag-${depthMode}`, ['--depth-mode', depthMode, '--max-iterations', '8']);
      expect(result.exitCode, result.stderr).toBe(0);
      const payload = JSON.parse(result.stdout) as { lineages: Array<{ label: string; iterations: number | null }> };
      expect(Object.fromEntries(payload.lineages.map((lineage) => [lineage.label, lineage.iterations])))
        .toEqual({ free: 8, pinned: 2 });
      expect(result.stderr).toContain('lineage free budget 8 iterations, from --max-iterations');
      expect(result.stderr).not.toContain('lineage pinned budget');
    });
  }

  it('refuses a flag value that is not a positive integer', async () => {
    const result = await preview('flag-zero', ['--max-iterations', '0']);
    expect(result.exitCode).not.toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toContain('maxIterations must be a positive integer');
  });
});

describe('fanout-run.cjs — lineage log masking', () => {
  it('masks an email address and a provider id', () => {
    const text = 'Author: Jane Doe <jane.doe@example.com>\n{"workspaceID":"wrk_01JQZ8FAKEWORKSPACE"} sk_ABCDEF123456\n';
    const masked = runner.redactProviderText(text);
    expect(masked).not.toContain('jane.doe@example.com');
    expect(masked).not.toContain('wrk_01JQZ8FAKEWORKSPACE');
    expect(masked).not.toContain('sk_ABCDEF123456');
    expect(masked).toContain('<email>');
  });

  it('leaves text with no secrets unchanged and is stable when applied twice', () => {
    const plain = '{"type":"step_finish","part":{"cost":0.2,"tool":"read","state":{"input":{"filePath":"a.ts"}}}}\n';
    expect(runner.redactProviderText(plain)).toBe(plain);
    const once = runner.redactProviderText('mail jane@example.com at https://x.test/ws/1 id ses_e0aeFAKESESSION');
    expect(runner.redactProviderText(once)).toBe(once);
  });

  // A regex runs synchronously, so the test timeout cannot stop a slow mask; the bound
  // is asserted on the measured time, and the timeout only has to outlast a slow run.
  it('masks a 12 MB log of long word runs in linear time and still finds the address in it', () => {
    const run = `${'a'.repeat(1500)} `;
    const half = run.repeat(Math.ceil((6 * 1024 * 1024) / run.length));
    const text = `${half}Author: Jane Doe <jane.doe@example.com>\n${half}`;
    const startedAt = performance.now();
    const masked = runner.redactProviderText(text);
    const elapsedMs = performance.now() - startedAt;
    expect(masked).not.toContain('jane.doe@example.com');
    expect(masked).toContain('Author: Jane Doe <<email>>');
    expect(elapsedMs).toBeLessThan(2500);
  }, 60_000);
});
