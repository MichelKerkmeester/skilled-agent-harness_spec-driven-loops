// ───────────────────────────────────────────────────────────────────
// MODULE: Privacy-First Routing Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import { selectPrivacyRoute } from '../../src/privacy/index.js';
import {
  NOW,
  approveRoute,
  createProviderMatrix,
  withFallback,
} from './helpers.js';

import type { ProviderModelRecord } from '../../src/providers/index.js';

const allowedClasses = [
  'hosted-retained',
  'hosted-zdr',
  'local-networked',
  'local-offline',
] as const;

describe('privacy-first provider routing', () => {
  it('denies hosted egress before invoking the ranker', () => {
    const hosted = createProviderMatrix()[0];
    if (hosted === undefined) {
      throw new Error('Expected hosted provider fixture.');
    }
    const ranker = vi.fn((eligible: readonly ProviderModelRecord[]) => eligible);
    const result = selectPrivacyRoute({
      records: [hosted],
      candidateProviderIds: [hosted.provider.providerId],
      policy: {
        allowedPrivacyClasses: allowedClasses,
        egressConsent: false,
        requiredKnownFacts: [],
      },
      now: NOW,
    }, ranker);

    expect(result).toMatchObject({ status: 'denied', reasonCode: 'egress-not-consented' });
    expect(ranker).not.toHaveBeenCalled();
  });

  it('passes only privacy-approved candidates into ranking', () => {
    const matrix = createProviderMatrix();
    const hosted = matrix[0];
    const local = matrix[1];
    if (hosted === undefined || local === undefined) {
      throw new Error('Expected hosted and local fixtures.');
    }
    const ranker = vi.fn((eligible: readonly ProviderModelRecord[]) => eligible);
    const result = selectPrivacyRoute({
      records: [hosted, local],
      candidateProviderIds: [hosted.provider.providerId, local.provider.providerId],
      policy: {
        allowedPrivacyClasses: allowedClasses,
        egressConsent: false,
        requiredKnownFacts: [],
      },
      now: NOW,
    }, ranker);

    expect(result.status).toBe('approved');
    expect(ranker).toHaveBeenCalledTimes(1);
    expect(ranker.mock.calls[0]?.[0].map((record) => record.provider.providerId))
      .toEqual(['ollama-local']);
  });

  it('never turns another ranked provider into an implicit fallback', () => {
    const matrix = createProviderMatrix();
    const local = matrix[1];
    if (local === undefined) {
      throw new Error('Expected local provider fixture.');
    }
    const route = approveRoute(matrix, local.provider.providerId);

    expect(route.status).toBe('approved');
    expect(route.attempts.map((record) => record.provider.providerId)).toEqual(['ollama-local']);
  });

  it('admits a cross-class fallback only when it is explicit, consented, and permitted', () => {
    const matrix = createProviderMatrix();
    const hosted = matrix[0];
    const local = matrix[1];
    if (hosted === undefined || local === undefined) {
      throw new Error('Expected hosted and local fixtures.');
    }
    const explicit = withFallback(local, {
      mode: 'explicit-list',
      providerIds: [hosted.provider.providerId],
      preservePrivacyClass: false,
    });
    const approved = approveRoute([explicit, hosted], explicit.provider.providerId);
    expect(approved.status).toBe('approved');
    expect(approved.attempts.map((record) => record.provider.providerId)).toEqual([
      'ollama-local',
      'opencode-go-deepseek-v4-flash',
    ]);

    const preserved = approveRoute([
      withFallback(local, {
        mode: 'explicit-list',
        providerIds: [hosted.provider.providerId],
        preservePrivacyClass: true,
      }),
      hosted,
    ], local.provider.providerId);
    expect(preserved.status).toBe('approved');
    expect(preserved.attempts).toHaveLength(1);
  });

  it('fails closed on stale terms, unknown required facts, and contradictory ZDR facts', () => {
    const hosted = createProviderMatrix()[0];
    if (hosted === undefined) {
      throw new Error('Expected hosted provider fixture.');
    }
    const stale = selectPrivacyRoute({
      records: [hosted],
      candidateProviderIds: [hosted.provider.providerId],
      policy: {
        allowedPrivacyClasses: allowedClasses,
        egressConsent: true,
        requiredKnownFacts: [],
      },
      now: '2026-09-01T00:00:00.000Z',
    });
    expect(stale).toMatchObject({ status: 'denied', reasonCode: 'terms-stale' });

    const residency = approveRoute([hosted], hosted.provider.providerId, {
      requiredKnownFacts: ['residency'],
    });
    expect(residency).toMatchObject({ status: 'denied', reasonCode: 'privacy-fact-unknown' });

    const contradictory = structuredClone({
      ...hosted,
      privacyFacts: hosted.privacyFacts.map((fact) =>
        fact.name === 'retention' ? { ...fact, value: '30-days' } : fact),
    });
    const contradiction = approveRoute([contradictory], contradictory.provider.providerId);
    expect(contradiction).toMatchObject({
      status: 'denied',
      reasonCode: 'privacy-fact-contradictory',
    });
  });
});
