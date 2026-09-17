// ───────────────────────────────────────────────────────────────────
// MODULE: Bounded Context Selector Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  selectBoundedContext,
  validateBoundedContext,
} from '../../src/index.js';
import { readFixture } from '../contracts/fixture-loader.js';

import type {
  BoundedContextRecord,
  ContextSelectionInput,
  PrivacyDecision,
  TranscriptMessageView,
} from '../../src/index.js';
import type { FixtureCase, FixtureSet } from '../contracts/fixture-loader.js';

const contexts = readFixture<FixtureSet<FixtureCase<BoundedContextRecord>>>(
  'context-cases.json',
);

describe('bounded context selection', () => {
  it('reproduces all six present and absent contract fixtures', () => {
    for (const fixture of contexts.cases) {
      const expected = fixture.record;
      const transcript = createFixtureTranscript(expected, fixture.fixtureId);
      const now = expected.transcriptFreshness.state === 'stale'
        ? new Date(
          Date.parse(expected.transcriptFreshness.observedAt)
            + expected.transcriptFreshness.maximumAgeMs
            + 1,
        ).toISOString()
        : expected.transcriptFreshness.observedAt;
      const result = selectBoundedContext({
        contextId: expected.contextId,
        transcript,
        privacy: structuredClone(expected.privacy),
        now,
        maximumAgeMs: expected.transcriptFreshness.maximumAgeMs,
        limitCodepoints: expected.truncation.limit,
        noContextFallback: expected.noContextFallback,
      });

      expect(result.success, fixture.fixtureId).toBe(true);
      if (!result.success) {
        continue;
      }
      expect(result.value.record, fixture.fixtureId).toEqual(expected);
      expect(validateBoundedContext(result.value.record).success).toBe(true);
      if (expected.outcome === 'present') {
        expect(Array.from(result.value.selectedText ?? '')).toHaveLength(
          expected.truncation.selectedUnits,
        );
      } else {
        expect(result.value.selectedText).toBeNull();
      }
    }
  });

  it('selects the last non-meta user message and truncates on codepoint boundaries', () => {
    const privacy = localPrivacy();
    const emojiText = '😀'.repeat(801);
    const result = selectBoundedContext({
      contextId: 'unicode-context',
      transcript: {
        observedAt: '2026-08-11T12:00:00.000Z',
        messages: [
          userMessage('old-user', 'old-original', 'older question', false),
          userMessage('meta-user', 'meta-original', 'system-generated note', true),
          userMessage('latest-user', 'latest-original', emojiText, false),
        ],
      },
      privacy,
      now: '2026-08-11T12:00:00.000Z',
      maximumAgeMs: 30_000,
      limitCodepoints: 800,
      noContextFallback: 'exact-original',
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.value.record.selectedMessage?.messageId).toBe('latest-user');
    expect(result.value.record.truncation).toMatchObject({
      unit: 'codepoints',
      originalUnits: 801,
      selectedUnits: 800,
      wasTruncated: true,
    });
    expect(Array.from(result.value.selectedText ?? '')).toHaveLength(800);
    expect(result.value.selectedText).toBe('😀'.repeat(800));
  });

  it('keeps denied context and raw text out of the serializable record', () => {
    const canary = 'RAW_CONTEXT_CANARY_7ad61b';
    const privacy: PrivacyDecision = {
      contractKind: 'privacy-decision',
      schemaVersion: '1.0.0',
      privacyClass: 'hosted-retained',
      route: 'hosted',
      egressConsent: false,
      decision: 'deny',
      reasonCode: 'egress-not-consented',
    };
    const result = selectBoundedContext({
      contextId: 'denied-canary',
      transcript: {
        observedAt: '2026-08-11T12:00:00.000Z',
        messages: [userMessage('canary-user', 'canary-original', canary, false)],
      },
      privacy,
      now: '2026-08-11T12:00:00.000Z',
      maximumAgeMs: 30_000,
      limitCodepoints: 800,
      noContextFallback: 'exact-original',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.record.absentReason).toBe('privacy-denied');
      expect(result.value.selectedText).toBeNull();
      expect(JSON.stringify(result.value.record)).not.toContain(canary);
    }
  });

  it('returns typed unavailable and invalid-policy outcomes', () => {
    const unavailable = selectBoundedContext({
      contextId: 'unavailable',
      transcript: null,
      privacy: localPrivacy(),
      now: '2026-08-11T12:00:00.000Z',
      maximumAgeMs: 30_000,
      limitCodepoints: 800,
      noContextFallback: 'exact-original',
    });
    expect(unavailable.success).toBe(true);
    if (unavailable.success) {
      expect(unavailable.value.record.absentReason).toBe('transcript-unavailable');
      expect(unavailable.value.record.transcriptFreshness.state).toBe('unknown');
    }

    const invalidInput: ContextSelectionInput = {
      contextId: 'invalid-policy',
      transcript: null,
      privacy: {
        contractKind: 'privacy-decision',
        schemaVersion: '1.0.0',
        privacyClass: 'hosted-retained',
        route: 'hosted',
        egressConsent: false,
        decision: 'allow',
        reasonCode: 'allowed-by-policy',
      },
      now: '2026-08-11T12:00:00.000Z',
      maximumAgeMs: 30_000,
      limitCodepoints: 800,
      noContextFallback: 'exact-original',
    };
    const invalid = selectBoundedContext(invalidInput);
    expect(invalid.success).toBe(false);
    expect(!invalid.success && invalid.originalInput).toBe(invalidInput);

    const malformed = { transcript: { messages: 'not-an-array' } };
    const malformedResult = selectBoundedContext(malformed);
    expect(malformedResult.success).toBe(false);
    expect(!malformedResult.success && malformedResult.originalInput).toBe(malformed);
  });
});

function createFixtureTranscript(
  record: BoundedContextRecord,
  fixtureId: string,
): { readonly observedAt: string; readonly messages: readonly TranscriptMessageView[] } {
  const text = 'x'.repeat(record.truncation.originalUnits);
  if (fixtureId === 'context-no-user') {
    return {
      observedAt: record.transcriptFreshness.observedAt,
      messages: [{
        messageId: 'assistant-only',
        role: 'assistant',
        isMeta: false,
        textOriginalId: 'assistant-original',
        text: 'assistant text',
      }],
    };
  }
  const selected = record.selectedMessage;
  return {
    observedAt: record.transcriptFreshness.observedAt,
    messages: [userMessage(
      selected?.messageId ?? `${fixtureId}-user`,
      selected?.textOriginalId ?? `${fixtureId}-original`,
      text,
      fixtureId === 'context-meta-only',
    )],
  };
}

function userMessage(
  messageId: string,
  textOriginalId: string,
  text: string,
  isMeta: boolean,
): TranscriptMessageView {
  return { messageId, role: 'user', isMeta, textOriginalId, text };
}

function localPrivacy(): PrivacyDecision {
  return {
    contractKind: 'privacy-decision',
    schemaVersion: '1.0.0',
    privacyClass: 'local-offline',
    route: 'local',
    egressConsent: false,
    decision: 'allow',
    reasonCode: 'allowed-by-policy',
  };
}
