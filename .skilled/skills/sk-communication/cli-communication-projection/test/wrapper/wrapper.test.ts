// ───────────────────────────────────────────────────────────────────
// MODULE: CLI-Output Wrapper Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  decodeExactOriginal,
  listWrapperRuntimes,
  renderWrapperTerminal,
  resolveWrapperLaunchMode,
  resolveWrapperRuntime,
  runRuntimeWrapper,
  runWrapperProjection,
} from '../../src/index.js';
import { PROJECTION_ENABLE_ENV } from '../../src/config/enablement.js';
import { ollamaResponse } from '../providers/helpers.js';
import {
  WRAPPER_NOW,
  createClaudeErrorEnvelope,
  createClaudeFinalEnvelope,
  createWrapperConfig,
  createWrapperOriginal,
} from './helpers.js';

import type {
  ProjectMessageResult,
  ProviderTransport,
  RuntimeId,
} from '../../src/index.js';
import type { RuntimeAdapter } from '../../src/runtimes/adapter.js';

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

const throwingAdapter: RuntimeAdapter<unknown> = {
  adapterVersion: 'runtime-adapter/1.0.0',
  runtime: 'claude',
  capabilities: [],
  adapt: () => {
    throw new Error('adapter failure');
  },
  present: () => {
    throw new Error('unused');
  },
};

describe('resolveWrapperRuntime', () => {
  it('resolves the five wrapper-target runtimes with their declared modes', () => {
    expect(resolveWrapperRuntime('claude')).toMatchObject({
      runtime: 'claude',
      launchMode: 'headless',
      pathId: 'claude-headless-message-display',
      protocol: 'claude-headless-stream-json',
      runtimeVersion: '2.1.228',
      protocolVersion: '1.0.0',
    });
    expect(resolveWrapperRuntime('codex')).toMatchObject({ launchMode: 'stream' });
    expect(resolveWrapperRuntime('cursor')).toMatchObject({ launchMode: 'stream' });
    expect(resolveWrapperRuntime('devin')).toMatchObject({ launchMode: 'stream' });
    expect(resolveWrapperRuntime('pi')).toMatchObject({ launchMode: 'print' });
  });

  it('returns null for the native-hook runtime and unknown ids', () => {
    expect(resolveWrapperRuntime('opencode')).toBeNull();
    expect(resolveWrapperRuntime('bogus' as RuntimeId)).toBeNull();
  });

  it('lists every wrapper-target runtime in registry order', () => {
    expect(listWrapperRuntimes()).toEqual(['claude', 'codex', 'cursor', 'devin', 'pi']);
  });

  it('resolves the declared launch mode for each runtime', () => {
    expect(resolveWrapperLaunchMode('claude')).toBe('headless');
    expect(resolveWrapperLaunchMode('codex')).toBe('stream');
    expect(resolveWrapperLaunchMode('pi')).toBe('print');
    expect(resolveWrapperLaunchMode('opencode')).toBeNull();
  });
});

describe('runRuntimeWrapper', () => {
  it('projects a captured runtime message end-to-end through a stub transport', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>(async (request) =>
      ollamaResponse(userContent(request).replace('deploy', 'ship').replace(' now', ' today')));
    const original = createWrapperOriginal('wrapper-original', SOURCE);
    const config = createWrapperConfig({ transport });

    const result = await runRuntimeWrapper('claude', {
      original,
      envelopes: [createClaudeFinalEnvelope()],
      config,
    });

    expect(result.status).toBe('projection');
    if (result.status !== 'projection') {
      throw new Error('Expected a projection.');
    }
    expect(result.text).toBe(EXPECTED_PROJECTION);
    expect(result.mode).toBe('atomic-replace');
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it('passes the byte-exact original through when projection is disabled', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '0';
    const transport = vi.fn<ProviderTransport>();
    const original = createWrapperOriginal('wrapper-original', SOURCE);

    const result = await runRuntimeWrapper('claude', {
      original,
      envelopes: [createClaudeFinalEnvelope()],
      config: createWrapperConfig({ transport }),
    });

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'projection-disabled' });
    expect(result.text).toBe(SOURCE);
    expect(transport).not.toHaveBeenCalled();
  });

  it('passes the byte-exact original through for an incapable runtime', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>();
    const original = createWrapperOriginal('wrapper-original', SOURCE);

    const result = await runRuntimeWrapper('opencode', {
      original,
      envelopes: [createClaudeFinalEnvelope()],
      config: createWrapperConfig({ transport }),
    });

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'runtime-incapable' });
    expect(result.text).toBe(SOURCE);
    expect(transport).not.toHaveBeenCalled();
  });

  it('passes the byte-exact original through for an unknown runtime', async () => {
    const original = createWrapperOriginal('wrapper-original', SOURCE);

    const result = await runRuntimeWrapper('bogus' as RuntimeId, {
      original,
      envelopes: [createClaudeFinalEnvelope()],
      config: createWrapperConfig(),
    });

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'runtime-incapable' });
    expect(result.text).toBe(SOURCE);
  });

  it('fails open to the byte-exact original on a terminal runtime error', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const original = createWrapperOriginal('wrapper-original', SOURCE);

    const result = await runRuntimeWrapper('claude', {
      original,
      envelopes: [createClaudeErrorEnvelope()],
      config: createWrapperConfig(),
    });

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'runtime-failure' });
    expect(result.text).toBe(SOURCE);
  });

  it('fails open to the byte-exact original on an empty captured stream', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const original = createWrapperOriginal('wrapper-original', SOURCE);

    const result = await runRuntimeWrapper('claude', {
      original,
      envelopes: [],
      config: createWrapperConfig(),
    });

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'incomplete-assembly' });
    expect(result.text).toBe(SOURCE);
  });

  it('fails open to the byte-exact original when the provider transport fails', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>(async () => ({ status: 503, body: {} }));
    const original = createWrapperOriginal('wrapper-original', SOURCE);

    const result = await runRuntimeWrapper('claude', {
      original,
      envelopes: [createClaudeFinalEnvelope()],
      config: createWrapperConfig({ transport }),
    });

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'provider-error' });
    expect(result.text).toBe(SOURCE);
  });

  it('leaves the canonical captured bytes unchanged across the pipeline', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>(async (request) =>
      ollamaResponse(userContent(request)));
    const original = createWrapperOriginal('wrapper-original', SOURCE);
    const before = Buffer.from(decodeExactOriginal(original)).toString('utf8');

    await runRuntimeWrapper('claude', {
      original,
      envelopes: [createClaudeFinalEnvelope()],
      config: createWrapperConfig({ transport }),
    });
    const after = Buffer.from(decodeExactOriginal(original)).toString('utf8');

    expect(before).toBe(SOURCE);
    expect(after).toBe(SOURCE);
  });
});

describe('runWrapperProjection', () => {
  it('fails open to the byte-exact original when the adapter throws', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const original = createWrapperOriginal('wrapper-original', SOURCE);

    const result = await runWrapperProjection(
      throwingAdapter,
      original,
      [createClaudeFinalEnvelope()],
      createWrapperConfig(),
    );

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'normalization-failed' });
    expect(result.text).toBe(SOURCE);
  });
});

describe('renderWrapperTerminal', () => {
  it('re-renders an accepted projection in place', () => {
    const projection: ProjectMessageResult = {
      status: 'projection',
      text: 'ship it',
      mode: 'atomic-replace',
    };

    const result = renderWrapperTerminal(projection);

    expect(result).toMatchObject({ status: 'projection', text: 'ship it', mode: 'atomic-replace' });
  });

  it('passes the byte-exact original through on a non-accept terminal', () => {
    const exact: ProjectMessageResult = {
      status: 'exact-original',
      text: 'keep exactly',
      reasonCode: 'provider-error',
    };

    const result = renderWrapperTerminal(exact);

    expect(result).toMatchObject({
      status: 'exact-original',
      text: 'keep exactly',
      reasonCode: 'provider-error',
    });
  });
});

describe('wrapper config sanity', () => {
  it('records the captured-at timestamp used for assembly ordering', () => {
    expect(WRAPPER_NOW).toBe('2026-08-12T00:00:00.000Z');
  });
});
