// ───────────────────────────────────────────────────────────────────
// MODULE: Default Provider Transport Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import {
  createDefaultProviderTransport,
  createHostedHttpTransport,
  createLocalHttpTransport,
  defaultCredentialResolver,
} from '../../src/transports/index.js';

import type {
  CredentialResolver,
  HttpFetch,
  HttpFetchInit,
} from '../../src/transports/index.js';
import type { ProviderWireRequest } from '../../src/providers/index.js';

const ENDPOINT = 'https://provider.example.test/v1/chat/completions';

function request(credentialReference = 'env:TEST_KEY'): ProviderWireRequest {
  return {
    endpoint: ENDPOINT,
    providerId: 'hosted-test',
    modelId: 'model-test',
    protocol: 'openai-chat-completions',
    credentialReference,
    body: { model: 'model-test', messages: [] },
    signal: new AbortController().signal,
  };
}

describe('default provider transports', () => {
  it('posts to the endpoint with a bearer credential and parses a JSON body', async () => {
    const fetchImpl = vi.fn<HttpFetch>(async () => ({
      status: 200,
      text: async () => '{"ok":true}',
    }));
    const transport = createHostedHttpTransport({
      fetchImpl,
      credentialResolver: async () => 'secret-token',
    });

    const result = await transport(request());

    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as [string, HttpFetchInit];
    expect(url).toBe(ENDPOINT);
    expect(init.method).toBe('POST');
    expect(init.headers.authorization).toBe('Bearer secret-token');
    expect(init.headers['content-type']).toBe('application/json');
    expect(JSON.parse(init.body)).toEqual({ model: 'model-test', messages: [] });
  });

  it('fails closed with 401 when the hosted credential cannot be resolved', async () => {
    const fetchImpl = vi.fn<HttpFetch>();
    const transport = createHostedHttpTransport({
      fetchImpl,
      credentialResolver: async () => null,
    });

    const result = await transport(request());

    expect(result).toEqual({ status: 401, body: null });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('never attaches an authorization header on the local path', async () => {
    const fetchImpl = vi.fn<HttpFetch>(async () => ({
      status: 200,
      text: async () => '{"done":true,"message":{"content":"x"}}',
    }));
    const transport = createLocalHttpTransport({ fetchImpl });

    await transport(request('none:local'));

    const init = fetchImpl.mock.calls[0]?.[1] as HttpFetchInit | undefined;
    expect(init?.headers.authorization).toBeUndefined();
    expect(init?.headers['content-type']).toBe('application/json');
  });

  it('dispatches local references to the no-auth path and hosted to bearer', async () => {
    const fetchImpl = vi.fn<HttpFetch>(async () => ({
      status: 200,
      text: async () => '{}',
    }));
    const transport = createDefaultProviderTransport({
      fetchImpl,
      credentialResolver: async () => 'tok',
    });

    await transport(request('none:local'));
    await transport(request('env:TEST_KEY'));

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl.mock.calls[0]?.[1].headers.authorization).toBeUndefined();
    expect(fetchImpl.mock.calls[1]?.[1].headers.authorization).toBe('Bearer tok');
  });

  it('returns the raw text when the response body is not JSON', async () => {
    const fetchImpl = vi.fn<HttpFetch>(async () => ({
      status: 200,
      text: async () => 'plain text response',
    }));
    const transport = createLocalHttpTransport({ fetchImpl });

    const result = await transport(request('none:local'));

    expect(result).toEqual({ status: 200, body: 'plain text response' });
  });
});

describe('defaultCredentialResolver', () => {
  const resolver: CredentialResolver = defaultCredentialResolver;
  const signal = new AbortController().signal;

  it('leaves platform-managed references unresolved', async () => {
    await expect(resolver('managed:opencode', signal)).resolves.toBeNull();
    await expect(resolver('keychain:opencode', signal)).resolves.toBeNull();
    await expect(resolver('none:local', signal)).resolves.toBeNull();
  });

  it('resolves env references only when the variable holds a value', async () => {
    await expect(resolver('env:TRANSPORT_TEST_MISSING', signal)).resolves.toBeNull();
    process.env.TRANSPORT_TEST_PRESENT = 'secret-value';
    await expect(resolver('env:TRANSPORT_TEST_PRESENT', signal)).resolves.toBe('secret-value');
    delete process.env.TRANSPORT_TEST_PRESENT;
  });
});
