// ───────────────────────────────────────────────────────────────────
// MODULE: External CLI Projection Runtime Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

import { runExternalCliProjection } from '../../src/runtime/index.js';
import { PROJECTION_ENABLE_ENV } from '../../src/config/enablement.js';

import type { CliRunner, SpawnImpl, SpawnRequest } from '../../src/transports/index.js';

const NOW = '2026-08-12T00:00:00.000Z';
const SOURCE = 'The deployment finished and every check passed.';
const REWRITE = 'The deploy is done and all checks passed.';

const priorEnv = process.env[PROJECTION_ENABLE_ENV];
afterEach(() => {
  if (priorEnv === undefined) {
    delete process.env[PROJECTION_ENABLE_ENV];
  } else {
    process.env[PROJECTION_ENABLE_ENV] = priorEnv;
  }
});

describe('runExternalCliProjection', () => {
  it('projects the target message when the CLI runner returns a faithful rewrite', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const runner = vi.fn<CliRunner>(async () => ({ status: 'ok', text: REWRITE }));

    const result = await runExternalCliProjection({
      engine: 'codex',
      modelId: 'gpt-5.5',
      sourceText: SOURCE,
      now: NOW,
      runner,
      judge: async () => 'accept',
    });

    expect(result.status).toBe('projection');
    if (result.status !== 'projection') {
      throw new Error('Expected a projection.');
    }
    expect(result.text).toBe(REWRITE);
    expect(runner).toHaveBeenCalledTimes(1);
  });

  it('falls back to the exact original when the CLI runner fails', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const runner: CliRunner = async () => ({ status: 'error', text: '' });

    const result = await runExternalCliProjection({
      engine: 'codex',
      modelId: 'gpt-5.5',
      sourceText: SOURCE,
      now: NOW,
      runner,
    });

    expect(result.status).toBe('exact-original');
    expect(result.text).toBe(SOURCE);
  });

  it('returns the exact original with no dispatch when projection is disabled', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '0';
    const runner = vi.fn<CliRunner>();

    const result = await runExternalCliProjection({
      engine: 'codex',
      modelId: 'gpt-5.5',
      sourceText: SOURCE,
      now: NOW,
      runner,
    });

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'projection-disabled' });
    expect(result.text).toBe(SOURCE);
    expect(runner).not.toHaveBeenCalled();
  });

  it('drives the resolved engine command through the injected spawn boundary', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const calls: SpawnRequest[] = [];
    const spawnImpl: SpawnImpl = async (request) => {
      calls.push(request);
      return { code: 0, stdout: REWRITE, stderr: '', timedOut: false };
    };

    const result = await runExternalCliProjection({
      engine: 'opencode',
      modelId: 'deepseek/deepseek-v4-pro',
      sourceText: SOURCE,
      now: NOW,
      spawnImpl,
      judge: async () => 'accept',
    });

    expect(result.status).toBe('projection');
    expect(calls).toHaveLength(1);
    const call = calls[0];
    expect(call?.command).toBe('opencode');
    expect(call?.args.slice(0, 3)).toEqual(['run', '--model', 'deepseek/deepseek-v4-pro']);
    expect(call?.args.at(-1)).toContain('deployment finished');
    expect(call?.input).toBeNull();
    expect(call?.env).toMatchObject({ SYSTEM_SPEC_GATE_ENFORCE: '0', AI_SESSION_CHILD: '1' });
  });
});
