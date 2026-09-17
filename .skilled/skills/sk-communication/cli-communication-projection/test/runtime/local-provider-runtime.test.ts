// ───────────────────────────────────────────────────────────────────
// MODULE: Local Provider Runtime Projection Tests
// ───────────────────────────────────────────────────────────────────
// PURPOSE: Prove the seam the OpenCode plugin builds from the shared
//          local-provider loader: a configured provider projects the
//          rewritten text, the loader's local-only policy denies a hosted
//          record before any call, and the null fallback stays byte-exact.

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  decodeExactOriginal,
  projectMessage,
} from '../../src/index.js';
import { PROJECTION_ENABLE_ENV } from '../../src/config/enablement.js';
import { parseLocalProjectionConfig } from '../../src/config/local-provider.js';
import { ollamaResponse } from '../providers/helpers.js';
import {
  createCompletedGeneration,
  createHostedProviderRecord,
} from './helpers.js';

import type { LocalProjectionConfig } from '../../src/config/local-provider.js';
import type {
  ProjectMessageInput,
  ProviderTransport,
} from '../../src/index.js';

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

/** A stub transport that applies the canonical test rewrite to the user message. */
function rewritingTransport() {
  return vi.fn<ProviderTransport>(async (request) =>
    ollamaResponse(userContent(request).replace('deploy', 'ship').replace(' now', ' today')));
}

/** Build the projectMessage input the way the plugin does from a loader config. */
function inputFromConfig(config: LocalProjectionConfig, sourceText: string): ProjectMessageInput {
  const completed = createCompletedGeneration(sourceText);
  return {
    generation: completed.generation,
    events: completed.events,
    context: config.context,
    prompt: config.prompt,
    records: config.records,
    candidateProviderIds: config.candidateProviderIds,
    policy: config.policy,
    judgeMode: config.judgeMode,
    capabilities: config.capabilities,
    transport: config.transport,
    now: NOW,
  };
}

/** The exact-original input the plugin falls back to when the loader returns null. */
function fallbackInput(sourceText: string, transport: ProviderTransport): ProjectMessageInput {
  const completed = createCompletedGeneration(sourceText);
  return {
    generation: completed.generation,
    events: completed.events,
    context: {
      contextId: 'plugin-fallback:context',
      transcript: null,
      privacy: {
        contractKind: 'privacy-decision',
        schemaVersion: '1.0.0',
        privacyClass: 'local-offline',
        route: 'local',
        egressConsent: false,
        decision: 'allow',
        reasonCode: 'allowed-by-policy',
      },
      now: NOW,
      maximumAgeMs: 600_000,
      limitCodepoints: 4_000,
      noContextFallback: 'exact-original',
    },
    prompt: {
      contractKind: 'prompt-profile',
      schemaVersion: '1.0.0',
      promptVersion: '1.0.0',
      systemInstruction: '',
      copyEditingScope: 'assistant-message-only',
      protectedValuePolicyVersion: '1.0.0',
      temperature: 0.2,
      thinkingMode: 'provider-default',
      providerControlMappings: [],
      unsupportedControlBehavior: 'exact-original',
    },
    records: [],
    candidateProviderIds: [],
    policy: { allowedPrivacyClasses: [], egressConsent: false, requiredKnownFacts: [] },
    judgeMode: 'disabled',
    capabilities: { atomicReplace: true, appendAfterOriginal: true, sidecar: true },
    transport,
    now: NOW,
  };
}

describe('local-provider runtime projection', () => {
  it('projects the rewritten text through a loader-configured local provider', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = rewritingTransport();
    const config = parseLocalProjectionConfig({
      enabled: true,
      localProvider: { kind: 'ollama', model: 'llama3.2' },
    }, { now: NOW, transport });
    expect(config).not.toBeNull();
    if (config === null) {
      throw new Error('Expected a projection config.');
    }

    const result = await projectMessage(inputFromConfig(config, SOURCE));

    expect(result.status).toBe('projection');
    if (result.status !== 'projection') {
      throw new Error('Expected a projection.');
    }
    expect(result.text).toBe(EXPECTED_PROJECTION);
    expect(result.mode).toBe('atomic-replace');
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it('runs the shipped reject-only judge under judgeMode required and rejects meaning loss', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const degradedSource = 'deploy the service to production and notify the team immediately';
    const transport = vi.fn<ProviderTransport>(async () =>
      ollamaResponse('deploy production notify'));
    const config = parseLocalProjectionConfig({
      enabled: true,
      localProvider: { kind: 'ollama', model: 'llama3.2' },
    }, { now: NOW, transport });
    expect(config).not.toBeNull();
    if (config === null) {
      throw new Error('Expected a projection config.');
    }
    expect(config.judgeMode).toBe('required');

    const result = await projectMessage(inputFromConfig(config, degradedSource));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'judge-rejected' });
    expect(result.text).toBe(degradedSource);
  });

  it('denies a hosted record before any call under the loader local-only policy', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>();
    const config = parseLocalProjectionConfig({
      enabled: true,
      localProvider: { kind: 'ollama', model: 'llama3.2' },
    }, { now: NOW, transport });
    expect(config).not.toBeNull();
    if (config === null) {
      throw new Error('Expected a projection config.');
    }
    const hosted = createHostedProviderRecord();
    const completed = createCompletedGeneration(SOURCE);
    const input: ProjectMessageInput = {
      generation: completed.generation,
      events: completed.events,
      context: config.context,
      prompt: config.prompt,
      records: [hosted],
      candidateProviderIds: [hosted.provider.providerId],
      policy: config.policy,
      judgeMode: config.judgeMode,
      capabilities: config.capabilities,
      transport,
      now: NOW,
    };

    const result = await projectMessage(input);

    expect(result.status).toBe('exact-original');
    expect(result.text).toBe(SOURCE);
    expect(transport).not.toHaveBeenCalled();
  });

  it('keeps the byte-exact original when the loader config is absent', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = vi.fn<ProviderTransport>();
    const input = fallbackInput(SOURCE, transport);

    const result = await projectMessage(input);

    expect(result.status).toBe('exact-original');
    expect(result.text).toBe(SOURCE);
    expect(transport).not.toHaveBeenCalled();
  });

  it('leaves the canonical original bytes unchanged across a local projection', async () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    const transport = rewritingTransport();
    const config = parseLocalProjectionConfig({
      enabled: true,
      localProvider: { kind: 'ollama', model: 'llama3.2' },
    }, { now: NOW, transport });
    expect(config).not.toBeNull();
    if (config === null) {
      throw new Error('Expected a projection config.');
    }
    const completed = createCompletedGeneration(SOURCE);
    const before = Buffer.from(decodeExactOriginal(completed.original)).toString('utf8');

    await projectMessage(inputFromConfig(config, SOURCE));
    const after = Buffer.from(decodeExactOriginal(completed.original)).toString('utf8');

    expect(before).toBe(SOURCE);
    expect(after).toBe(SOURCE);
  });
});
