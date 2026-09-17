// ───────────────────────────────────────────────────────────────────
// MODULE: Local Provider Projection Runtime Tests
// ───────────────────────────────────────────────────────────────────
// PURPOSE: Prove the local static-text entrypoint the `local` command branch
//          builds on: a configured provider projects the rewritten target text,
//          a meaning-dropping rewrite falls back to the byte-exact original, and
//          a disabled gate never dispatches.

import { afterEach, describe, expect, it, vi } from 'vitest';

import { runLocalProjection } from '../../src/runtime/index.js';
import { PROJECTION_ENABLE_ENV } from '../../src/config/enablement.js';
import { parseLocalProjectionConfig } from '../../src/config/local-provider.js';
import { ollamaResponse } from '../providers/helpers.js';

import type { LocalProjectionConfig } from '../../src/config/local-provider.js';
import type { ProviderTransport } from '../../src/index.js';

const NOW = '2026-08-14T00:00:00.000Z';
const SOURCE = 'deploy the `release` build now.';
const EXPECTED_PROJECTION = 'ship the `release` build today.';

const priorEnv = process.env[PROJECTION_ENABLE_ENV];
afterEach(() => {
  if (priorEnv === undefined) {
    delete process.env[PROJECTION_ENABLE_ENV];
  } else {
    process.env[PROJECTION_ENABLE_ENV] = priorEnv;
  }
});

function userContent(request: Parameters<ProviderTransport>[0]): string {
  const messages = (request.body as {
    messages: readonly { role: string; content: string }[];
  }).messages;
  return messages.find((entry) => entry.role === 'user')?.content ?? '';
}

function configWith(transport: ProviderTransport): LocalProjectionConfig {
  const config = parseLocalProjectionConfig({
    enabled: true,
    localProvider: { kind: 'ollama', model: 'llama3.2' },
  }, { now: NOW, transport });
  if (config === null) {
    throw new Error('Expected a projection config.');
  }
  return config;
}

describe('runLocalProjection', () => {
  it('projects the target text through the configured local provider', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>(async (request) =>
      ollamaResponse(userContent(request).replace('deploy', 'ship').replace(' now', ' today')));

    const result = await runLocalProjection({
      config: configWith(transport),
      sourceText: SOURCE,
      now: NOW,
    });

    expect(result.status).toBe('projection');
    if (result.status !== 'projection') {
      throw new Error('Expected a projection.');
    }
    expect(result.text).toBe(EXPECTED_PROJECTION);
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it('falls back to the exact original when the rewrite drops meaning', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const degradedSource = 'deploy the service to production and notify the team immediately';
    const transport = vi.fn<ProviderTransport>(async () => ollamaResponse('deploy production notify'));

    const result = await runLocalProjection({
      config: configWith(transport),
      sourceText: degradedSource,
      now: NOW,
    });

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'judge-rejected' });
    expect(result.text).toBe(degradedSource);
  });

  it('returns the exact original with no dispatch when projection is disabled', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '0';
    const transport = vi.fn<ProviderTransport>();

    const result = await runLocalProjection({
      config: configWith(transport),
      sourceText: SOURCE,
      now: NOW,
    });

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'projection-disabled' });
    expect(result.text).toBe(SOURCE);
    expect(transport).not.toHaveBeenCalled();
  });
});
