// ───────────────────────────────────────────────────────────────────
// MODULE: Local Provider Wrapper Projection Tests
// ───────────────────────────────────────────────────────────────────
// PURPOSE: Prove the wrapper seam projects when the bin builds its config
//          from the shared local-provider loader, and fails open to the
//          byte-exact captured original when the provider path fails.

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  resolveWrapperRuntime,
  runRuntimeWrapper,
  runWrapperProjection,
} from '../../src/index.js';
import { PROJECTION_ENABLE_ENV } from '../../src/config/enablement.js';
import { parseLocalProjectionConfig } from '../../src/config/local-provider.js';
import { ollamaResponse } from '../providers/helpers.js';
import {
  WRAPPER_NOW,
  createClaudeFinalEnvelope,
  createWrapperOriginal,
} from './helpers.js';

import type { LocalProjectionConfig } from '../../src/config/local-provider.js';
import type {
  ProviderTransport,
  WrapperProjectionConfig,
} from '../../src/index.js';

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

/** Wrap a loader config into the full wrapper projection config shape. */
function wrapperConfigFrom(local: LocalProjectionConfig): WrapperProjectionConfig {
  return {
    context: local.context,
    prompt: local.prompt,
    records: local.records,
    candidateProviderIds: local.candidateProviderIds,
    policy: local.policy,
    judgeMode: local.judgeMode,
    capabilities: local.capabilities,
    transport: local.transport,
    now: WRAPPER_NOW,
  };
}

describe('local-provider wrapper projection', () => {
  it('projects a captured runtime message through a loader-configured provider', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>(async (request) =>
      ollamaResponse(userContent(request).replace('deploy', 'ship').replace(' now', ' today')));
    const local = parseLocalProjectionConfig({
      enabled: true,
      localProvider: { kind: 'ollama', model: 'llama3.2' },
    }, { now: WRAPPER_NOW, transport });
    expect(local).not.toBeNull();
    if (local === null) {
      throw new Error('Expected a projection config.');
    }
    const original = createWrapperOriginal('wrapper-original', SOURCE);

    const result = await runRuntimeWrapper('claude', {
      original,
      envelopes: [createClaudeFinalEnvelope()],
      config: wrapperConfigFrom(local),
    });

    expect(result.status).toBe('projection');
    if (result.status !== 'projection') {
      throw new Error('Expected a projection.');
    }
    expect(result.text).toBe(EXPECTED_PROJECTION);
    expect(result.mode).toBe('atomic-replace');
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it('fails open to the byte-exact captured original when the local provider fails', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>(async () => ({ status: 503, body: {} }));
    const local = parseLocalProjectionConfig({
      enabled: true,
      localProvider: { kind: 'ollama', model: 'llama3.2' },
    }, { now: WRAPPER_NOW, transport });
    expect(local).not.toBeNull();
    if (local === null) {
      throw new Error('Expected a projection config.');
    }
    const original = createWrapperOriginal('wrapper-original', SOURCE);

    const result = await runRuntimeWrapper('claude', {
      original,
      envelopes: [createClaudeFinalEnvelope()],
      config: wrapperConfigFrom(local),
    });

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'provider-error' });
    expect(result.text).toBe(SOURCE);
  });

  it('passes the byte-exact captured original through when projection is disabled', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '0';
    const transport = vi.fn<ProviderTransport>();
    const local = parseLocalProjectionConfig({
      enabled: true,
      localProvider: { kind: 'ollama', model: 'llama3.2' },
    }, { now: WRAPPER_NOW, transport });
    expect(local).not.toBeNull();
    if (local === null) {
      throw new Error('Expected a projection config.');
    }
    const original = createWrapperOriginal('wrapper-original', SOURCE);

    const result = await runRuntimeWrapper('claude', {
      original,
      envelopes: [createClaudeFinalEnvelope()],
      config: wrapperConfigFrom(local),
    });

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'projection-disabled' });
    expect(result.text).toBe(SOURCE);
    expect(transport).not.toHaveBeenCalled();
  });
});

describe('runWrapperProjection with a loader config', () => {
  it('projects the captured assistant message through the shared seam', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>(async (request) =>
      ollamaResponse(userContent(request).replace('deploy', 'ship').replace(' now', ' today')));
    const local = parseLocalProjectionConfig({
      enabled: true,
      localProvider: { kind: 'ollama', model: 'llama3.2' },
    }, { now: WRAPPER_NOW, transport });
    expect(local).not.toBeNull();
    if (local === null) {
      throw new Error('Expected a projection config.');
    }
    const plan = resolveWrapperRuntime('claude');
    if (plan === null) {
      throw new Error('Expected a claude wrapper plan.');
    }
    const original = createWrapperOriginal('wrapper-original', SOURCE);

    const result = await runWrapperProjection(
      plan.adapter,
      original,
      [createClaudeFinalEnvelope()],
      wrapperConfigFrom(local),
    );

    expect(result.status).toBe('projection');
    if (result.status !== 'projection') {
      throw new Error('Expected a projection.');
    }
    expect(result.text).toBe(EXPECTED_PROJECTION);
  });
});
