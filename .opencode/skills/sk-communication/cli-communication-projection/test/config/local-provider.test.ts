// ───────────────────────────────────────────────────────────────────
// MODULE: Local Provider Loader Unit Tests
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  buildLocalProjectionConfig,
  loadLocalProjectionConfig,
  LocalProviderKinds,
  parseLocalProjectionConfig,
} from '../../src/config/local-provider.js';
import { compilePromptControls } from '../../src/providers/index.js';

import type {
  LocalProviderConfig,
  LocalProjectionConfig,
  LocalProviderKind,
} from '../../src/config/local-provider.js';
import type { ProviderTransport } from '../../src/providers/index.js';

const NOW = '2026-08-14T00:00:00.000Z';
const ENABLEMENT_EXAMPLE_URL = new URL('../../enablement.local.json.example', import.meta.url);

function fullFile(kind: LocalProviderKind = LocalProviderKinds.OLLAMA, model = 'llama3.2', extra = {}) {
  return {
    enabled: true,
    localProvider: { kind, model, ...extra },
  };
}

/** A wiring that also compiles its own prompt controls is project-ready. */
function expectProjectReady(config: LocalProjectionConfig) {
  const record = config.records[0];
  if (record === undefined) {
    throw new Error('Expected a provider record.');
  }
  const compiled = compilePromptControls(record, config.prompt, {
    model: record.provider.modelId,
    messages: [],
    stream: false,
  }, NOW);
  expect(compiled.status).toBe('compiled');
}

describe('parseLocalProjectionConfig', () => {
  it('parses the shipped LM Studio example into project-ready local wiring', () => {
    const example = JSON.parse(readFileSync(ENABLEMENT_EXAMPLE_URL, 'utf8')) as unknown;
    const config = parseLocalProjectionConfig(example, { now: NOW });

    expect(example).not.toHaveProperty('lmStudioExample');
    expect(example).toMatchObject({
      enabled: true,
      localProvider: {
        kind: 'lmstudio',
        model: 'qwen2.5-7b-instruct',
        endpoint: 'http://localhost:1234/v1',
      },
    });
    expect(config).not.toBeNull();
    if (config === null) {
      throw new Error('Expected the shipped LM Studio example to parse.');
    }
    const record = config.records[0];
    if (record === undefined) {
      throw new Error('Expected the shipped example to create a provider record.');
    }
    expect(record.family).toBe('llama-cpp');
    expect(record.provider.endpoint).toBe('http://localhost:1234/v1/chat/completions');
    expect(record.provider.privacyClass).toBe('local-offline');
    expect(config.policy.allowedPrivacyClasses).toEqual(['local-offline']);
    expectProjectReady(config);
  });

  it('builds the full wiring for a valid ollama block', () => {
    const config = parseLocalProjectionConfig(fullFile(), { now: NOW });

    expect(config).not.toBeNull();
    if (config === null) {
      throw new Error('Expected a projection config.');
    }
    const record = config.records[0];
    if (record === undefined) {
      throw new Error('Expected a provider record.');
    }
    expect(record.family).toBe('ollama');
    expect(record.provider.modelId).toBe('llama3.2');
    expect(record.provider.endpoint).toBe('http://127.0.0.1:11434/api/chat');
    expect(record.provider.privacyClass).toBe('local-offline');
    expect(record.provider.deploymentMode).toBe('local');
    expect(config.candidateProviderIds).toEqual([record.provider.providerId]);
    expect(config.policy).toEqual({
      allowedPrivacyClasses: ['local-offline'],
      egressConsent: false,
      requiredKnownFacts: [],
    });
    expect(config.judgeMode).toBe('required');
    expect(config.prompt.systemInstruction.length).toBeGreaterThan(0);
    expect(config.prompt.providerControlMappings.length).toBeGreaterThan(0);
    expect(config.transport).toBeTypeOf('function');
    expect(config.context.noContextFallback).toBe('rewrite-without-context');
    expect(config.capabilities.atomicReplace).toBe(true);
    expectProjectReady(config);
  });

  it('maps llama.cpp and openai-compatible kinds to the llama-cpp family with the 8080 endpoint', () => {
    for (const kind of [LocalProviderKinds.LLAMA_CPP, LocalProviderKinds.OPENAI_COMPATIBLE]) {
      const config = parseLocalProjectionConfig(fullFile(kind, 'qwen3'), { now: NOW });
      expect(config).not.toBeNull();
      if (config === null) {
        throw new Error('Expected a projection config.');
      }
      const record = config.records[0];
      if (record === undefined) {
        throw new Error('Expected a provider record.');
      }
      expect(record.family).toBe('llama-cpp');
      expect(record.provider.endpoint).toBe('http://127.0.0.1:8080/v1/chat/completions');
      expect(config.prompt.providerControlMappings[0]?.wireField).toBe('temperature');
      expectProjectReady(config);
    }
  });

  it('maps the lmstudio kind to the llama-cpp family with the 1234 endpoint', () => {
    const config = parseLocalProjectionConfig(fullFile(LocalProviderKinds.LM_STUDIO, 'model-id'), {
      now: NOW,
    });

    expect(config).not.toBeNull();
    if (config === null) {
      throw new Error('Expected a projection config.');
    }
    const record = config.records[0];
    if (record === undefined) {
      throw new Error('Expected a provider record.');
    }
    expect(record.family).toBe('llama-cpp');
    expect(record.provider.endpoint).toBe('http://127.0.0.1:1234/v1/chat/completions');
  });

  it('preserves an explicit full LM Studio request endpoint', () => {
    const config = parseLocalProjectionConfig(fullFile(
      LocalProviderKinds.LM_STUDIO,
      'model-id',
      { endpoint: 'http://localhost:1234/v1/chat/completions' },
    ), { now: NOW });

    expect(config?.records[0]?.provider.endpoint)
      .toBe('http://localhost:1234/v1/chat/completions');
  });

  it('honors an explicit endpoint and derives local-networked for a non-loopback host', () => {
    const config = parseLocalProjectionConfig(fullFile(
      LocalProviderKinds.OLLAMA,
      'llama3.2',
      { endpoint: 'http://192.168.1.50:11434/api/chat' },
    ), { now: NOW });

    expect(config).not.toBeNull();
    if (config === null) {
      throw new Error('Expected a projection config.');
    }
    const record = config.records[0];
    if (record === undefined) {
      throw new Error('Expected a provider record.');
    }
    expect(record.provider.endpoint).toBe('http://192.168.1.50:11434/api/chat');
    expect(record.provider.privacyClass).toBe('local-networked');
    expect(config.policy.allowedPrivacyClasses).toEqual([
      'local-offline',
      'local-networked',
    ]);
    expectProjectReady(config);
  });

  it('keeps local-offline for an explicit loopback endpoint', () => {
    const config = parseLocalProjectionConfig(fullFile(
      LocalProviderKinds.OLLAMA,
      'llama3.2',
      { endpoint: 'http://127.0.0.1:11434/api/chat' },
    ), { now: NOW });

    expect(config).not.toBeNull();
    if (config === null) {
      throw new Error('Expected a projection config.');
    }
    const record = config.records[0];
    if (record === undefined) {
      throw new Error('Expected a provider record.');
    }
    expect(record.provider.privacyClass).toBe('local-offline');
    expect(config.policy.allowedPrivacyClasses).toEqual(['local-offline']);
  });
});

describe('parseLocalProjectionConfig fail-closed matrix', () => {
  it('returns null when projection is not opted in', () => {
    expect(parseLocalProjectionConfig(null, { now: NOW })).toBeNull();
    expect(parseLocalProjectionConfig({ enabled: false, localProvider: fullFile().localProvider }, { now: NOW })).toBeNull();
    expect(parseLocalProjectionConfig({ enabled: 'yes', localProvider: fullFile().localProvider }, { now: NOW })).toBeNull();
    expect(parseLocalProjectionConfig({}, { now: NOW })).toBeNull();
  });

  it('returns null when the localProvider block is absent or not an object', () => {
    expect(parseLocalProjectionConfig({ enabled: true }, { now: NOW })).toBeNull();
    expect(parseLocalProjectionConfig({ enabled: true, localProvider: null }, { now: NOW })).toBeNull();
    expect(parseLocalProjectionConfig({ enabled: true, localProvider: 'ollama' }, { now: NOW })).toBeNull();
  });

  it('returns null for an unknown kind or a missing model', () => {
    expect(parseLocalProjectionConfig(fullFile('claude-local' as LocalProviderKind, 'm'), { now: NOW })).toBeNull();
    expect(parseLocalProjectionConfig({ enabled: true, localProvider: { model: 'm' } }, { now: NOW })).toBeNull();
    expect(parseLocalProjectionConfig({ enabled: true, localProvider: { kind: 'ollama' } }, { now: NOW })).toBeNull();
    expect(parseLocalProjectionConfig({ enabled: true, localProvider: { kind: 'ollama', model: '' } }, { now: NOW })).toBeNull();
    expect(parseLocalProjectionConfig({ enabled: true, localProvider: { kind: 'ollama', model: 42 } }, { now: NOW })).toBeNull();
  });

  it('returns null for a malformed or non-URL endpoint', () => {
    expect(parseLocalProjectionConfig({ enabled: true, localProvider: { kind: 'ollama', model: 'm', endpoint: 42 } }, { now: NOW })).toBeNull();
    expect(parseLocalProjectionConfig({ enabled: true, localProvider: { kind: 'ollama', model: 'm', endpoint: 'not-a-url' } }, { now: NOW })).toBeNull();
    expect(parseLocalProjectionConfig({ enabled: true, localProvider: { kind: 'ollama', model: 'm', endpoint: 'ftp://127.0.0.1/x' } }, { now: NOW })).toBeNull();
    expect(parseLocalProjectionConfig({ enabled: true, localProvider: { kind: 'ollama', model: 'm', endpoint: '' } }, { now: NOW })).toBeNull();
  });
});

describe('buildLocalProjectionConfig', () => {
  it('injects the transport and the capability timestamps', () => {
    const transport: ProviderTransport = async () => ({ status: 200, body: {} });
    const provider: LocalProviderConfig = { kind: 'ollama', model: 'llama3.2' };

    const config = buildLocalProjectionConfig(provider, { now: NOW, transport });

    expect(config).not.toBeNull();
    if (config === null) {
      throw new Error('Expected a projection config.');
    }
    expect(config.transport).toBe(transport);
    const record = config.records[0];
    if (record === undefined) {
      throw new Error('Expected a provider record.');
    }
    expect(record.capabilityEvidence.observedAt).toBe(NOW);
    expect(Date.parse(record.capabilityEvidence.expiresAt)).toBeGreaterThan(Date.parse(NOW));
  });

  it('fails closed on a malformed endpoint', () => {
    const provider: LocalProviderConfig = {
      kind: 'ollama',
      model: 'llama3.2',
      endpoint: 'not-a-url',
    };
    expect(buildLocalProjectionConfig(provider, { now: NOW })).toBeNull();
  });
});

describe('loadLocalProjectionConfig', () => {
  it('never throws when the enablement file is absent, unreadable, or malformed', () => {
    expect(() => loadLocalProjectionConfig({ now: NOW })).not.toThrow();
  });
});
