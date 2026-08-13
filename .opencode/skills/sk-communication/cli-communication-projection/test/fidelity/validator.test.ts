// ───────────────────────────────────────────────────────────────────
// MODULE: Fidelity Validator Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import {
  decodeExactOriginal,
  FidelityReasonCodes,
  validateProjectionCandidate,
} from '../../src/index.js';
import {
  createProtectedDocument,
  createValidationInput,
} from './helpers.js';

describe('deterministic fidelity validation', () => {
  it('accepts an unchanged protected candidate and freezes the decision', async () => {
    const protection = createProtectedDocument(
      'The worker must keep 3 replicas. It is not safe to disable retries.',
    );
    const result = await validateProjectionCandidate(createValidationInput(protection));

    expect(result).toMatchObject({
      status: 'accepted',
      reasonCode: FidelityReasonCodes.ACCEPTED,
      projectionText: 'The worker must keep 3 replicas. It is not safe to disable retries.',
    });
    if (result.status === 'rejected') {
      throw new Error('Expected a fidelity outcome with an exact-original fallback.');
    }
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.exactOriginal)).toBe(true);
  });

  it('accepts a safe prose rewrite while restoring protected commands exactly', async () => {
    const protection = createProtectedDocument(
      'Run `npm run check`. The operation completed successfully.',
    );
    const candidate = protection.encodedText.replace('completed', 'finished');
    const result = await validateProjectionCandidate(createValidationInput(
      protection,
      candidate,
    ));

    expect(result).toMatchObject({
      status: 'accepted',
      projectionText: 'Run `npm run check`. The operation finished successfully.',
    });
  });

  it('rejects provider terminal failures before semantic checks', async () => {
    const protection = createProtectedDocument('The worker must remain available.');
    const cases = [
      ['error', FidelityReasonCodes.PROVIDER_ERROR],
      ['cancelled', FidelityReasonCodes.PROVIDER_CANCELLED],
      ['timeout', FidelityReasonCodes.PROVIDER_TIMEOUT],
      ['truncated', FidelityReasonCodes.TRUNCATED_OUTPUT],
    ] as const;

    for (const [providerTerminal, reasonCode] of cases) {
      const result = await validateProjectionCandidate(createValidationInput(
        protection,
        protection.encodedText,
        { providerTerminal },
      ));
      expect(result).toMatchObject({ status: 'exact-original', reasonCode });
    }
  });

  it('vetoes seeded semantic and completion regressions with named rules', async () => {
    const cases = [
      {
        source: 'The worker must remain available.',
        mutate: () => '',
        expected: FidelityReasonCodes.EMPTY_OUTPUT,
      },
      {
        source: 'The worker remains available.',
        mutate: () => 'Sorry, I cannot help with that.',
        expected: FidelityReasonCodes.REFUSAL_OUTPUT,
      },
      {
        source: 'The worker must remain available.',
        mutate: (value: string) => `${value} Version 99 ships tomorrow.`,
        expected: FidelityReasonCodes.FACT_ADDED,
      },
      {
        source: 'Amsterdam remains the deployment region.',
        mutate: (value: string) => value.replace('Amsterdam ', ''),
        expected: FidelityReasonCodes.FACT_OMITTED,
      },
      {
        source: 'It is not safe to disable retries.',
        mutate: (value: string) => value.replace('not ', ''),
        expected: FidelityReasonCodes.POLARITY_CHANGED,
      },
      {
        source: 'The worker must remain available.',
        mutate: (value: string) => value.replace('must', 'should'),
        expected: FidelityReasonCodes.REQUIREMENT_STRENGTH_CHANGED,
      },
      {
        source: 'The migration has high priority.',
        mutate: (value: string) => value.replace('high', 'low'),
        expected: FidelityReasonCodes.PRIORITY_CHANGED,
      },
      {
        source: 'The result is possibly delayed.',
        mutate: (value: string) => value.replace('possibly ', ''),
        expected: FidelityReasonCodes.UNCERTAINTY_CHANGED,
      },
      {
        source: 'However, keep the original during recovery.',
        mutate: (value: string) => value.replace('However, ', ''),
        expected: FidelityReasonCodes.CAVEAT_CHANGED,
      },
      {
        source: 'Next, restart the worker.',
        mutate: (value: string) => value.replace('restart', 'delete'),
        expected: FidelityReasonCodes.NEXT_STEP_CHANGED,
      },
    ] as const;

    for (const testCase of cases) {
      const protection = createProtectedDocument(testCase.source);
      const result = await validateProjectionCandidate(createValidationInput(
        protection,
        testCase.mutate(protection.encodedText),
      ));
      expect(result, testCase.source).toMatchObject({
        status: 'exact-original',
        reasonCode: testCase.expected,
      });
    }
  });

  it('rejects Markdown structure changes and stale canonical digests', async () => {
    const protection = createProtectedDocument('# Heading\n\n- Keep the first step.');
    const flattened = protection.encodedText.replace('\n\n', ' ');
    const structure = await validateProjectionCandidate(
      createValidationInput(protection, flattened),
    );
    expect(structure).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.MARKDOWN_STRUCTURE_CHANGED,
    });

    const stale = await validateProjectionCandidate(createValidationInput(
      protection,
      protection.encodedText,
      { currentSourceSha256: `sha256:${'0'.repeat(64)}` },
    ));
    expect(stale).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.SOURCE_CHANGED,
    });
  });

  it('lets a configured judge reject but never override deterministic rejection', async () => {
    const protection = createProtectedDocument('The worker must remain available.');
    const acceptingJudge = vi.fn(async () => 'accept' as const);
    const accepted = await validateProjectionCandidate(createValidationInput(
      protection,
      protection.encodedText,
      { judgeMode: 'required' },
    ), acceptingJudge);
    expect(accepted.status).toBe('accepted');
    expect(acceptingJudge).toHaveBeenCalledOnce();

    const rejectingJudge = vi.fn(async () => 'reject' as const);
    const rejected = await validateProjectionCandidate(createValidationInput(
      protection,
      protection.encodedText,
      { judgeMode: 'required' },
    ), rejectingJudge);
    expect(rejected).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.JUDGE_REJECTED,
    });

    const forbiddenOverride = vi.fn(async () => 'accept' as const);
    const deterministic = await validateProjectionCandidate(createValidationInput(
      protection,
      protection.encodedText.replace('must', 'should'),
      { judgeMode: 'required' },
    ), forbiddenOverride);
    expect(deterministic).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.REQUIREMENT_STRENGTH_CHANGED,
    });
    expect(forbiddenOverride).not.toHaveBeenCalled();
  });

  it('fails closed on judge outage, timeout, and cancellation', async () => {
    const protection = createProtectedDocument('The worker remains available.');
    const failed = await validateProjectionCandidate(createValidationInput(
      protection,
      protection.encodedText,
      { judgeMode: 'required' },
    ), async () => {
      throw new Error('raw provider detail');
    });
    expect(failed).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.JUDGE_FAILED,
    });
    expect(JSON.stringify(failed)).not.toContain('raw provider detail');

    const timedOut = await validateProjectionCandidate(createValidationInput(
      protection,
      protection.encodedText,
      { judgeMode: 'required', judgeTimeoutMs: 5 },
    ), async () => new Promise<'accept'>(() => undefined));
    expect(timedOut).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.JUDGE_TIMEOUT,
    });

    const controller = new AbortController();
    controller.abort();
    const cancelledJudge = vi.fn(async () => 'accept' as const);
    const cancelled = await validateProjectionCandidate(createValidationInput(
      protection,
      protection.encodedText,
      { judgeMode: 'required', signal: controller.signal },
    ), cancelledJudge);
    expect(cancelled).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.CANCELLED,
    });
    expect(cancelledJudge).not.toHaveBeenCalled();
  });

  it('fails closed on malformed protection and invalid boundary fields', async () => {
    const source = 'Keep `apiServer` unchanged.';
    const protection = createProtectedDocument(source);
    const malformed = {
      ...structuredClone(protection),
      encodedText: `${protection.encodedText} injected prose`,
    };
    const malformedResult = await validateProjectionCandidate(createValidationInput(
      malformed,
      malformed.encodedText,
    ));
    expect(malformedResult).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.INVALID_INPUT,
    });
    if (malformedResult.status === 'rejected') {
      throw new Error('A valid stored original must remain available on malformed protection.');
    }
    expect(Buffer.from(decodeExactOriginal(malformedResult.exactOriginal)).toString('utf8'))
      .toBe(source);

    const invalidField = await validateProjectionCandidate({
      ...createValidationInput(protection),
      rawText: 'must not enter diagnostics',
    });
    expect(invalidField).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.INVALID_INPUT,
    });
    expect(JSON.stringify(invalidField)).not.toContain('must not enter diagnostics');
  });

  it('names incomplete, oversized, invalid-encoding, and unavailable-judge outcomes', async () => {
    const protection = createProtectedDocument('Plain content remains available.');
    const cases = [
      [
        createValidationInput(protection, protection.encodedText, { allPartsComplete: false }),
        FidelityReasonCodes.TRUNCATED_OUTPUT,
      ],
      [
        createValidationInput(protection, protection.encodedText, { maximumOutputBytes: 1 }),
        FidelityReasonCodes.OUTPUT_LIMIT,
      ],
      [
        createValidationInput(protection, `${protection.encodedText}\uD800`),
        FidelityReasonCodes.INVALID_ENCODING,
      ],
      [
        createValidationInput(protection, protection.encodedText, { judgeMode: 'required' }),
        FidelityReasonCodes.JUDGE_UNAVAILABLE,
      ],
    ] as const;

    for (const [input, reasonCode] of cases) {
      const result = await validateProjectionCandidate(input);
      expect(result).toMatchObject({ status: 'exact-original', reasonCode });
    }
  });

  it('contains unexpected validator exceptions and retains only a content-free reason', async () => {
    const protection = createProtectedDocument('The worker remains available.');
    const crashingSignal = {
      get aborted(): boolean {
        throw new Error('RAW_VALIDATOR_CRASH_CANARY');
      },
      addEventListener(): void {},
      removeEventListener(): void {},
    };
    const result = await validateProjectionCandidate({
      ...createValidationInput(protection),
      signal: crashingSignal,
    });

    expect(result).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.VALIDATOR_FAILED,
    });
    expect(JSON.stringify(result)).not.toContain('RAW_VALIDATOR_CRASH_CANARY');
  });
});
