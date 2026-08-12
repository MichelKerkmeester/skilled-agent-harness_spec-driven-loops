// ───────────────────────────────────────────────────────────────────
// MODULE: Provider Adapter Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  createOpenCodeGoDeepSeekV4FlashRecord,
  getProviderAdapter,
} from '../../src/providers/index.js';
import {
  createPromptProfile,
  createProviderDocument,
  createProviderMatrix,
  ollamaResponse,
  openAiResponse,
} from './helpers.js';

describe('provider wire adapters', () => {
  it('compiles all four families from protected text and model-specific controls', () => {
    const document = createProviderDocument();
    for (const record of createProviderMatrix()) {
      const adapter = getProviderAdapter(record.family);
      const prepared = adapter.prepare({
        record,
        prompt: createPromptProfile(record),
        document,
        now: '2026-08-12T00:00:00.000Z',
        signal: new AbortController().signal,
      });

      expect(prepared.status, record.family).toBe('prepared');
      if (prepared.status !== 'prepared') {
        continue;
      }
      expect(prepared.request.modelId).toBe(record.provider.modelId);
      expect(prepared.request.credentialReference).toBe(record.provider.credentialReference);
      const serialized = JSON.stringify(prepared.request.body);
      expect(serialized).toContain(document.encodedText);
      expect(serialized).not.toContain('providerSecretCanary');
      expect(serialized).not.toContain('/srv/private');
      expect(serialized).not.toContain(document.exactOriginal.bytesBase64);

      if (record.family === 'ollama') {
        expect(prepared.request.body).toMatchObject({
          options: { temperature: 0.3 },
          think: false,
          stream: false,
        });
      } else if (record.family === 'llama-cpp') {
        expect(prepared.request.body).toMatchObject({
          temperature: 0.3,
          chat_template_kwargs: { enable_thinking: false },
          stream: false,
        });
      } else {
        expect(prepared.request.body).toMatchObject({
          temperature: 0.3,
          reasoning_effort: 'none',
          stream: false,
        });
      }

      const parsed = adapter.parse(record.family === 'ollama'
        ? ollamaResponse('Clear local rewrite.')
        : openAiResponse('Clear hosted rewrite.'));
      expect(parsed).toMatchObject({ status: 'candidate' });
    }
  });

  it('rejects unknown capabilities and unsafe wire paths before transport', () => {
    const record = createOpenCodeGoDeepSeekV4FlashRecord({
      credentialReference: 'managed:opencode-go-test',
    });
    const document = createProviderDocument();
    const prompt = createPromptProfile(record);
    const adapter = getProviderAdapter(record.family);

    expect(adapter.prepare({
      record,
      prompt,
      document,
      now: '2026-08-12T00:00:00.000Z',
      signal: new AbortController().signal,
    })).toMatchObject({
      status: 'unsupported',
      reasonCode: 'unsupported-control',
      control: 'temperature',
    });

    const confirmed = createProviderMatrix()[0];
    if (confirmed === undefined) {
      throw new Error('Expected confirmed hosted fixture.');
    }
    const basePrompt = createPromptProfile(confirmed);
    const unsafePrompt = {
      ...basePrompt,
      providerControlMappings: basePrompt.providerControlMappings.map((mapping, index) =>
        index === 0 ? { ...mapping, wireField: '__proto__.polluted' } : mapping),
    };
    expect(adapter.prepare({
      record: confirmed,
      prompt: unsafePrompt,
      document,
      now: '2026-08-12T00:00:00.000Z',
      signal: new AbortController().signal,
    })).toMatchObject({
      status: 'unsupported',
      reasonCode: 'unsupported-control',
      control: 'temperature',
    });
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();

    expect(adapter.prepare({
      record: confirmed,
      prompt: createPromptProfile(confirmed),
      document,
      now: '2026-08-21T00:00:00.000Z',
      signal: new AbortController().signal,
    })).toMatchObject({
      status: 'unsupported',
      reasonCode: 'unsupported-control',
      control: 'chat',
    });
  });

  it('maps HTTP, malformed, empty, and truncated responses to closed reasons', () => {
    const record = createProviderMatrix()[0];
    if (record === undefined) {
      throw new Error('Expected provider fixture.');
    }
    const adapter = getProviderAdapter(record.family);
    expect(adapter.parse({ status: 503, body: { raw: 'sensitive provider detail' } }))
      .toEqual({ status: 'failure', reasonCode: 'provider-error', terminal: 'error' });
    expect(adapter.parse({ status: 200, body: { choices: [] } }))
      .toEqual({ status: 'failure', reasonCode: 'invalid-response', terminal: 'error' });
    expect(adapter.parse(openAiResponse('   ')))
      .toEqual({ status: 'failure', reasonCode: 'empty-output', terminal: 'error' });
    expect(adapter.parse({
      status: 200,
      body: { choices: [{ finish_reason: 'length', message: { content: 'partial' } }] },
    })).toEqual({ status: 'failure', reasonCode: 'truncated', terminal: 'truncated' });

    const ollama = getProviderAdapter('ollama');
    expect(ollama.parse({ status: 200, body: { done: false, message: { content: 'partial' } } }))
      .toEqual({ status: 'failure', reasonCode: 'truncated', terminal: 'truncated' });
  });
});
