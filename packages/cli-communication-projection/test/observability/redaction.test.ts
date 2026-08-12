// ───────────────────────────────────────────────────────────────────
// MODULE: Redaction Canary Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  REDACTION_CANARIES,
  aggregateLifecycleEvents,
  assertNoRedactionCanaryLeak,
  scanForRedactionCanaries,
} from '../../src/observability/index.js';

describe('redaction canary scanning', () => {
  it('finds zero canaries in aggregates and nested provider error metadata', () => {
    const aggregate = aggregateLifecycleEvents([]);
    const providerError = {
      contractKind: 'error',
      schemaVersion: '1.0.0',
      errorId: 'provider-error-1',
      code: 'provider-failed',
      message: 'Provider request failed.',
      retryable: true,
      fallback: 'exact-original',
      details: {
        provider: {
          error: {
            metadata: {
              statusCode: 503,
              reasonCode: 'upstream-unavailable',
            },
          },
        },
      },
    };

    expect(scanForRedactionCanaries([aggregate, providerError])).toEqual([]);
    expect(() => assertNoRedactionCanaryLeak([aggregate, providerError])).not.toThrow();
  });

  it('detects synthetic secrets and personal data at any nesting depth', () => {
    const nested = {
      details: {
        provider: {
          error: {
            metadata: Object.fromEntries(
              REDACTION_CANARIES.map((canary) => [canary.id, canary.value]),
            ),
          },
        },
      },
    };
    const findings = scanForRedactionCanaries(nested);

    expect(findings).toHaveLength(REDACTION_CANARIES.length);
    expect(new Set(findings.map((finding) => finding.canaryId))).toEqual(
      new Set(REDACTION_CANARIES.map((canary) => canary.id)),
    );
    expect(findings.every((finding) => finding.path.includes('provider.error.metadata')))
      .toBe(true);
    for (const canary of REDACTION_CANARIES) {
      expect(JSON.stringify(findings)).not.toContain(canary.value);
    }
    expect(() => assertNoRedactionCanaryLeak(nested))
      .toThrow('Redaction canary detected in telemetry data.');
  });

  it('detects base64 and typed-array encodings without reflecting their contents', () => {
    const secret = REDACTION_CANARIES[0];
    if (secret === undefined) {
      throw new Error('Expected a synthetic secret canary.');
    }
    const encodedSecret = Buffer.from(secret.value).toString('base64');
    const typedSecret = Uint16Array.from(
      secret.value,
      (character) => character.charCodeAt(0),
    );
    const nestedError = Object.assign(new Error('Provider request failed.'), {
      details: { encodedSecret },
    });

    const base64Findings = scanForRedactionCanaries(nestedError);
    const typedFindings = scanForRedactionCanaries({ details: { typedSecret } });

    expect(base64Findings).toEqual([
      expect.objectContaining({
        path: '$.details.encodedSecret',
        canaryId: secret.id,
      }),
    ]);
    expect(typedFindings).toEqual([
      expect.objectContaining({
        path: '$.details.typedSecret',
        canaryId: secret.id,
      }),
    ]);
    expect(() => assertNoRedactionCanaryLeak(nestedError))
      .toThrow('Redaction canary detected in telemetry data.');
    expect(() => assertNoRedactionCanaryLeak(typedSecret))
      .toThrow('Redaction canary detected in telemetry data.');
  });
});
