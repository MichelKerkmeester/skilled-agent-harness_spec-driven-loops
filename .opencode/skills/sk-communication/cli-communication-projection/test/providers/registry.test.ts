// ───────────────────────────────────────────────────────────────────
// MODULE: Provider Registry Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  createOpenCodeGoDeepSeekV4FlashRecord,
  createProviderRegistry,
  mergeCapabilitySnapshot,
  validateProviderModelRecord,
} from '../../src/providers/index.js';
import {
  EXPIRES_AT,
  NOW,
  OBSERVED_AT,
  confirmPromptControls,
  createProviderMatrix,
} from './helpers.js';

describe('model-scoped provider registry', () => {
  it('pins OpenCode Go DeepSeek V4 Flash without storing a credential value', () => {
    const record = createOpenCodeGoDeepSeekV4FlashRecord({
      credentialReference: 'managed:opencode-go-production',
    });

    expect(validateProviderModelRecord(record).success).toBe(true);
    expect(record).toMatchObject({
      family: 'opencode-go',
      authorizationScheme: 'bearer',
      provider: {
        providerId: 'opencode-go-deepseek-v4-flash',
        endpoint: 'https://opencode.ai/zen/go/v1/chat/completions',
        modelId: 'deepseek-v4-flash',
        credentialReference: 'managed:opencode-go-production',
        privacyClass: 'hosted-zdr',
      },
    });
    expect(record.provider.termsExpiresAt).toBe('2026-08-31T23:59:59.000Z');
    expect(record.privacyFacts).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'retention', state: 'known', value: '0-days' }),
      expect.objectContaining({ name: 'training-use', state: 'known', value: 'not-used' }),
      expect.objectContaining({ name: 'residency', state: 'unknown', value: null }),
    ]));
    expect(JSON.stringify(record)).not.toContain('raw-api-token');
  });

  it('validates all four adapter families and freezes registry-owned copies', () => {
    const matrix = createProviderMatrix();
    const result = createProviderRegistry(matrix);

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.value.records.map((record) => record.family)).toEqual([
      'opencode-go',
      'ollama',
      'llama-cpp',
      'generic-hosted',
    ]);
    expect(result.value.records.every(Object.isFrozen)).toBe(true);
    expect(result.value.get('ollama-local')?.provider.modelId).toBe('test-ollama-model');
    expect(result.value.get('missing-provider')).toBeNull();
  });

  it('rejects duplicate IDs and incomplete dated privacy facts', () => {
    const first = createProviderMatrix()[0];
    if (first === undefined) {
      throw new Error('Expected a provider fixture.');
    }
    expect(createProviderRegistry([first, first]).success).toBe(false);

    const incomplete = structuredClone({
      ...first,
      privacyFacts: first.privacyFacts.filter((fact) => fact.name !== 'residency'),
    });
    const result = validateProviderModelRecord(incomplete);
    expect(result.success).toBe(false);
    expect(!result.success && result.issues.some((issue) => issue.code === 'coverage')).toBe(true);
  });

  it('applies fresh capability evidence and downgrades every stale claim to unknown', () => {
    const base = createOpenCodeGoDeepSeekV4FlashRecord({
      credentialReference: 'managed:opencode-go-test',
    });
    const confirmed = confirmPromptControls(base);
    expect(confirmed.provider.capabilities).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'temperature-control', state: 'yes' }),
      expect.objectContaining({ name: 'thinking-control', state: 'yes' }),
    ]));

    const stale = mergeCapabilitySnapshot(confirmed, {
      providerId: confirmed.provider.providerId,
      modelId: confirmed.provider.modelId,
      sourceUrl: 'https://provider.example.test/capabilities',
      observedAt: OBSERVED_AT,
      expiresAt: EXPIRES_AT,
      capabilities: confirmed.provider.capabilities,
    }, '2026-08-21T00:00:00.000Z');
    expect(stale.status).toBe('stale');
    expect(stale.record.provider.capabilities.every((capability) =>
      capability.state === 'unknown' && capability.confidence === 'unknown')).toBe(true);

    const mismatch = mergeCapabilitySnapshot(confirmed, {
      providerId: 'different-provider',
      modelId: confirmed.provider.modelId,
      sourceUrl: 'https://provider.example.test/capabilities',
      observedAt: OBSERVED_AT,
      expiresAt: EXPIRES_AT,
      capabilities: confirmed.provider.capabilities,
    }, NOW);
    expect(mismatch).toMatchObject({ status: 'rejected', reasonCode: 'identity-mismatch' });
  });
});
