// ───────────────────────────────────────────────────────────────────
// MODULE: External CLI Provider Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import {
  createExternalCliModelRecord,
  executeProviderRoute,
  getProviderAdapter,
  validateProviderModelRecord,
} from '../../src/providers/index.js';
import { createExternalCliTransport } from '../../src/transports/index.js';

import {
  NOW,
  OBSERVED_AT,
  EXPIRES_AT,
  approveRoute,
  createProviderDocument,
  createPromptProfile,
} from './helpers.js';

import type { CliRunner } from '../../src/transports/index.js';
import type { ProviderModelRecord } from '../../src/providers/index.js';

function externalCliRecord(engine = 'devin'): ProviderModelRecord {
  return createExternalCliModelRecord({
    engine,
    modelId: 'gemini-3-7-flash-high',
    observedAt: OBSERVED_AT,
    termsExpireAt: EXPIRES_AT,
    capabilitiesExpireAt: EXPIRES_AT,
  });
}

describe('createExternalCliModelRecord', () => {
  it('produces a record that validates as a hosted-retained external-cli provider', () => {
    const record = externalCliRecord();
    const result = validateProviderModelRecord(record);

    expect(result.success).toBe(true);
    expect(record.family).toBe('external-cli');
    expect(record.provider.providerId).toBe('external-cli-devin');
    expect(record.provider.deploymentMode).toBe('hosted');
    expect(record.provider.privacyClass).toBe('hosted-retained');
    expect(record.authorizationScheme).toBe('none');
    expect(record.provider.credentialReference).toBe('none:cli');
  });

  it('routes under an egress-consented hosted-retained policy', () => {
    const record = externalCliRecord();

    const route = approveRoute([record], record.provider.providerId);

    expect(route.status).toBe('approved');
    if (route.status === 'approved') {
      expect(route.primary.provider.providerId).toBe('external-cli-devin');
    }
  });

  it('is denied when hosted egress is not consented', () => {
    const record = externalCliRecord();

    const route = approveRoute([record], record.provider.providerId, { egressConsent: false });

    expect(route.status).toBe('denied');
  });
});

describe('external-cli adapter and pipeline', () => {
  it('compiles a request that carries the system and user messages', () => {
    const record = externalCliRecord();
    const adapter = getProviderAdapter('external-cli');

    const prepared = adapter.prepare({
      record,
      prompt: createPromptProfile(record),
      document: createProviderDocument(),
      now: NOW,
      signal: new AbortController().signal,
    });

    expect(prepared.status).toBe('prepared');
    if (prepared.status === 'prepared') {
      const body = prepared.request.body as {
        messages: readonly { readonly role: string; readonly content: string }[];
      };
      expect(body.messages[0]?.role).toBe('system');
      expect(body.messages[1]?.role).toBe('user');
    }
  });

  it('returns a candidate when the CLI runner produces a rewrite', async () => {
    const record = externalCliRecord();
    const route = approveRoute([record], record.provider.providerId);
    if (route.status !== 'approved') {
      throw new Error('Expected the external-cli route to be approved.');
    }
    const runner = vi.fn<CliRunner>(async () => ({
      status: 'ok',
      text: 'Here is the plain English rewrite.',
    }));

    const result = await executeProviderRoute({
      route,
      prompt: createPromptProfile(record),
      document: createProviderDocument(),
      transport: createExternalCliTransport({ runner }),
      credentialStatus: async () => 'available',
      now: NOW,
    });

    expect(result.status).toBe('candidate');
    if (result.status === 'candidate') {
      expect(result.candidateText).toContain('plain English');
    }
    expect(runner).toHaveBeenCalledTimes(1);
  });

  it('falls back to the exact original when the CLI runner fails', async () => {
    const record = externalCliRecord();
    const route = approveRoute([record], record.provider.providerId);
    if (route.status !== 'approved') {
      throw new Error('Expected the external-cli route to be approved.');
    }

    const result = await executeProviderRoute({
      route,
      prompt: createPromptProfile(record),
      document: createProviderDocument(),
      transport: createExternalCliTransport({ runner: async () => ({ status: 'error', text: '' }) }),
      credentialStatus: async () => 'available',
      now: NOW,
    });

    expect(result.status).toBe('exact-original');
    if (result.status === 'exact-original') {
      expect(result.candidateText).toBeNull();
    }
  });
});
