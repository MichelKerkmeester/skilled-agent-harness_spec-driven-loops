// ───────────────────────────────────────────────────────────────────
// MODULE: Wrapper Fail-Open Entrypoint-Throw Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/runtime/project-message.js', () => ({
  projectMessage: async () => {
    throw new Error('entrypoint failure');
  },
}));

import { runWrapperProjection } from '../../src/index.js';
import { PROJECTION_ENABLE_ENV } from '../../src/config/enablement.js';
import { claudeRuntimeAdapter } from '../../src/runtimes/claude.js';
import { createClaudeFinalEnvelope, createWrapperConfig, createWrapperOriginal } from './helpers.js';

const SOURCE = 'deploy the `release` build now.';

describe('runWrapperProjection fail-open', () => {
  it('passes the byte-exact original through when the entrypoint throws', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const original = createWrapperOriginal('wrapper-original', SOURCE);

    const result = await runWrapperProjection(
      claudeRuntimeAdapter,
      original,
      [createClaudeFinalEnvelope()],
      createWrapperConfig(),
    );

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'wrapper-failure' });
    expect(result.text).toBe(SOURCE);
  });

  it('does not reach the entrypoint when projection is disabled', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '0';
    const original = createWrapperOriginal('wrapper-original', SOURCE);

    const result = await runWrapperProjection(
      claudeRuntimeAdapter,
      original,
      [createClaudeFinalEnvelope()],
      createWrapperConfig(),
    );

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'projection-disabled' });
    expect(result.text).toBe(SOURCE);
  });
});
