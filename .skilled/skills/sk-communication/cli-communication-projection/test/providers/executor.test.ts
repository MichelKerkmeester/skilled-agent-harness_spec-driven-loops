// ───────────────────────────────────────────────────────────────────
// MODULE: Provider Execution Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import { decodeExactOriginal } from '../../src/index.js';
import {
  createProviderTelemetryEvent,
  executeProviderRoute,
} from '../../src/providers/index.js';
import { selectPrivacyRoute } from '../../src/privacy/index.js';
import {
  NOW,
  approveRoute,
  createPromptProfile,
  createProviderDocument,
  createProviderMatrix,
  openAiResponse,
  withFallback,
  withTimeout,
} from './helpers.js';

import type { PromptProfileRecord } from '../../src/index.js';
import type { ProviderTransport } from '../../src/providers/index.js';

const available = async (): Promise<'available'> => 'available';

describe('bounded provider execution', () => {
  it('returns a candidate through OpenCode Go using only a credential reference', async () => {
    const record = createProviderMatrix()[0];
    if (record === undefined) {
      throw new Error('Expected OpenCode Go fixture.');
    }
    const document = createProviderDocument();
    const transport = vi.fn<ProviderTransport>(async (request) => {
      expect(request.providerId).toBe('opencode-go-deepseek-v4-flash');
      expect(request.modelId).toBe('deepseek-v4-flash');
      expect(request.credentialReference).toBe('managed:opencode-go-test');
      return openAiResponse('A simpler rewrite.');
    });
    const result = await executeProviderRoute({
      route: approveRoute([record], record.provider.providerId),
      prompt: createPromptProfile(record),
      document,
      transport,
      credentialStatus: available,
      now: NOW,
    });

    expect(result).toMatchObject({
      status: 'candidate',
      reasonCode: 'none',
      candidateText: 'A simpler rewrite.',
      attemptCount: 1,
    });
    expect(transport).toHaveBeenCalledTimes(1);
    expect(result.exactOriginal).toEqual(document.exactOriginal);
  });

  it('never calls transport after privacy denial or unsupported controls', async () => {
    const record = createProviderMatrix()[0];
    if (record === undefined) {
      throw new Error('Expected hosted provider fixture.');
    }
    const document = createProviderDocument();
    const deniedRoute = selectPrivacyRoute({
      records: [record],
      candidateProviderIds: [record.provider.providerId],
      policy: {
        allowedPrivacyClasses: ['hosted-zdr'],
        egressConsent: false,
        requiredKnownFacts: [],
      },
      now: NOW,
    });
    const transport = vi.fn<ProviderTransport>();
    const denied = await executeProviderRoute({
      route: deniedRoute,
      prompt: createPromptProfile(record),
      document,
      transport,
      credentialStatus: available,
      now: NOW,
    });
    expect(denied).toMatchObject({ status: 'exact-original', reasonCode: 'privacy-denied' });
    expect(transport).not.toHaveBeenCalled();

    const basePrompt = createPromptProfile(record);
    const unsupportedPrompt = {
      ...basePrompt,
      providerControlMappings: basePrompt.providerControlMappings.map((mapping, index) =>
        index === 0
          ? { ...mapping, support: 'unknown' as const, confidence: 'unknown' as const }
          : mapping),
    };
    const unsupported = await executeProviderRoute({
      route: approveRoute([record], record.provider.providerId),
      prompt: unsupportedPrompt,
      document,
      transport,
      credentialStatus: available,
      now: NOW,
    });
    expect(unsupported).toMatchObject({
      status: 'exact-original',
      reasonCode: 'unsupported-control',
    });
    expect(transport).not.toHaveBeenCalled();
  });

  it('does not use a hosted provider after local failure without an explicit fallback', async () => {
    const matrix = createProviderMatrix();
    const local = matrix[1];
    if (local === undefined) {
      throw new Error('Expected local provider fixture.');
    }
    const transport = vi.fn<ProviderTransport>(async () => ({ status: 503, body: {} }));
    const result = await executeProviderRoute({
      route: approveRoute(matrix, local.provider.providerId),
      prompt: createPromptProfile(local),
      document: createProviderDocument(),
      transport,
      credentialStatus: available,
      now: NOW,
    });

    expect(result).toMatchObject({
      status: 'exact-original',
      reasonCode: 'provider-error',
      providerId: 'ollama-local',
      attemptCount: 1,
    });
    expect(transport).toHaveBeenCalledTimes(1);
    expect(transport.mock.calls[0]?.[0].providerId).toBe('ollama-local');
  });

  it('uses a hosted fallback only from an explicit privacy-approved attempt plan', async () => {
    const matrix = createProviderMatrix();
    const hosted = matrix[0];
    const local = matrix[1];
    if (hosted === undefined || local === undefined) {
      throw new Error('Expected hosted and local fixtures.');
    }
    const primary = withFallback(local, {
      mode: 'explicit-list',
      providerIds: [hosted.provider.providerId],
      preservePrivacyClass: false,
    });
    const route = approveRoute([primary, hosted], primary.provider.providerId);
    const prompt = combinePrompts(createPromptProfile(primary, 'reject-provider'), createPromptProfile(hosted));
    const transport = vi.fn<ProviderTransport>(async (request) =>
      request.providerId === primary.provider.providerId
        ? { status: 503, body: {} }
        : openAiResponse('Fallback rewrite.'));

    const result = await executeProviderRoute({
      route,
      prompt,
      document: createProviderDocument(),
      transport,
      credentialStatus: available,
      now: NOW,
    });
    expect(result).toMatchObject({
      status: 'candidate',
      candidateText: 'Fallback rewrite.',
      providerId: 'opencode-go-deepseek-v4-flash',
      attemptCount: 2,
    });
    expect(transport.mock.calls.map((call) => call[0].providerId)).toEqual([
      'ollama-local',
      'opencode-go-deepseek-v4-flash',
    ]);
  });

  it('bounds timeout and cancellation and preserves the exact original', async () => {
    const local = createProviderMatrix()[1];
    if (local === undefined) {
      throw new Error('Expected local provider fixture.');
    }
    const bounded = withTimeout(local, 10);
    const document = createProviderDocument('Keep `exactValue` unchanged.');
    const hanging: ProviderTransport = async () => new Promise(() => {});
    const startedAt = Date.now();
    const timedOut = await executeProviderRoute({
      route: approveRoute([bounded], bounded.provider.providerId),
      prompt: createPromptProfile(bounded),
      document,
      transport: hanging,
      credentialStatus: available,
      now: NOW,
    });
    expect(Date.now() - startedAt).toBeLessThan(250);
    expect(timedOut).toMatchObject({
      status: 'exact-original',
      reasonCode: 'timeout',
      providerTerminal: 'timeout',
    });
    expect(Buffer.from(decodeExactOriginal(timedOut.exactOriginal)).toString('utf8'))
      .toBe('Keep `exactValue` unchanged.');

    const controller = new AbortController();
    controller.abort();
    const transport = vi.fn<ProviderTransport>();
    const cancelled = await executeProviderRoute({
      route: approveRoute([local], local.provider.providerId),
      prompt: createPromptProfile(local),
      document,
      transport,
      credentialStatus: available,
      now: NOW,
      signal: controller.signal,
    });
    expect(cancelled).toMatchObject({ status: 'exact-original', reasonCode: 'cancelled' });
    expect(transport).not.toHaveBeenCalled();
  });

  it('handles missing credentials before transport and emits content-free evidence', async () => {
    const hosted = createProviderMatrix()[0];
    if (hosted === undefined) {
      throw new Error('Expected hosted provider fixture.');
    }
    const document = createProviderDocument('Canary `RAW_PROVIDER_CONTENT_71f2` stays protected.');
    const transport = vi.fn<ProviderTransport>();
    const result = await executeProviderRoute({
      route: approveRoute([hosted], hosted.provider.providerId),
      prompt: createPromptProfile(hosted),
      document,
      transport,
      credentialStatus: async () => 'missing',
      now: NOW,
    });
    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'missing-credential' });
    expect(transport).not.toHaveBeenCalled();

    const expired = await executeProviderRoute({
      route: approveRoute([hosted], hosted.provider.providerId),
      prompt: createPromptProfile(hosted),
      document,
      transport,
      credentialStatus: async () => 'expired',
      now: NOW,
    });
    expect(expired).toMatchObject({ status: 'exact-original', reasonCode: 'expired-credential' });
    expect(transport).not.toHaveBeenCalled();

    const emission = createProviderTelemetryEvent(result, { runtime: 'codex' });
    expect(emission.status).toBe('emitted');
    expect(JSON.stringify(emission)).not.toContain('RAW_PROVIDER_CONTENT_71f2');
    expect(JSON.stringify(emission)).not.toContain('managed:opencode-go-test');
    expect(emission.status === 'emitted' && emission.event).toMatchObject({
      eventName: 'provider-terminal',
      outcome: 'exact-original',
      reasonCode: 'provider-error',
      attemptCount: 1,
    });
  });
});

function combinePrompts(
  primary: PromptProfileRecord,
  fallback: PromptProfileRecord,
): PromptProfileRecord {
  return {
    ...primary,
    providerControlMappings: [
      ...primary.providerControlMappings,
      ...fallback.providerControlMappings,
    ],
  };
}
