// ───────────────────────────────────────────────────────────────────
// MODULE: Context, Prompt, Provider, and Outcome Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  validateContract,
  validatePrivacyDecision,
  validateProviderRecord,
} from '../../src/index.js';
import { readFixture } from './fixture-loader.js';

import type {
  BoundedContextRecord,
  ContractRecord,
  PrivacyDecision,
  PromptProfileRecord,
  ProviderRecord,
} from '../../src/index.js';
import type { FixtureCase, FixtureSet } from './fixture-loader.js';

const contexts = readFixture<FixtureSet<FixtureCase<BoundedContextRecord>>>(
  'context-cases.json',
);
const prompts = readFixture<FixtureSet<FixtureCase<PromptProfileRecord>>>(
  'prompt-profiles.json',
);
const providers = readFixture<FixtureSet<FixtureCase<ProviderRecord>>>(
  'provider-cases.json',
);
const outcomes = readFixture<FixtureSet<FixtureCase<ContractRecord>>>(
  'outcome-cases.json',
);

describe('bounded context and privacy', () => {
  it('validates present, absent, stale, truncated, denied, and meta-only cases', () => {
    expect(contexts.cases.map((fixture) => fixture.fixtureId)).toEqual([
      'context-present',
      'context-no-user',
      'context-stale',
      'context-truncated',
      'context-privacy-denied',
      'context-meta-only',
    ]);
    for (const fixture of contexts.cases) {
      expect(validateContract(fixture.record).success, fixture.fixtureId).toBe(true);
      expect(validatePrivacyDecision(fixture.record.privacy).success).toBe(true);
      expect(fixture.captureMethod).toBe('synthetic');
      expect(fixture.sanitizationStatus).toBe('synthetic');
    }
  });

  it('blocks hosted egress when explicit consent is absent', () => {
    const invalid: PrivacyDecision = {
      contractKind: 'privacy-decision',
      schemaVersion: '1.0.0',
      privacyClass: 'hosted-retained',
      route: 'hosted',
      egressConsent: false,
      decision: 'allow',
      reasonCode: 'allowed-by-policy',
    };
    const result = validatePrivacyDecision(invalid);
    expect(result.success).toBe(false);
    expect(!result.success && result.originalInput).toBe(invalid);
    expect(!result.success && result.issues.some((issue) => issue.code === 'egress_consent'))
      .toBe(true);
  });

  it('rejects present context after privacy denial or from a stale transcript', () => {
    const present = contexts.cases.find(
      (fixture) => fixture.fixtureId === 'context-present',
    );
    const denied = contexts.cases.find(
      (fixture) => fixture.fixtureId === 'context-privacy-denied',
    );
    expect(present).toBeDefined();
    expect(denied).toBeDefined();
    if (present === undefined || denied === undefined) {
      return;
    }

    const privacyMismatch = {
      ...present.record,
      privacy: denied.record.privacy,
    };
    const privacyResult = validateContract(privacyMismatch);
    expect(privacyResult.success).toBe(false);
    expect(
      !privacyResult.success
        && privacyResult.issues.some((issue) => issue.code === 'privacy_boundary'),
    ).toBe(true);

    const staleMismatch = {
      ...present.record,
      transcriptFreshness: {
        ...present.record.transcriptFreshness,
        state: 'stale',
      },
    };
    const staleResult = validateContract(staleMismatch);
    expect(staleResult.success).toBe(false);
    expect(
      !staleResult.success
        && staleResult.issues.some((issue) => issue.code === 'freshness'),
    ).toBe(true);
  });
});

describe('prompt and provider policy', () => {
  it('freezes the reference-like prompt and exact-original control fallback', () => {
    for (const fixture of prompts.cases) {
      expect(validateContract(fixture.record).success, fixture.fixtureId).toBe(true);
      expect(fixture.record.copyEditingScope).toBe('assistant-message-only');
      expect(fixture.record.temperature).toBe(0.3);
      expect(fixture.record.thinkingMode).toBe('disabled');
      expect(fixture.record.unsupportedControlBehavior).toBe('exact-original');
    }

    const unsupported = prompts.cases.find(
      (fixture) => fixture.fixtureId === 'prompt-unsupported-controls',
    );
    expect(unsupported).toBeDefined();
    expect(unsupported?.expectedResult).toBe('exact-original');
    expect(
      unsupported?.record.providerControlMappings.every(
        (mapping) => mapping.support === 'no' && mapping.wireField === null,
      ),
    ).toBe(true);
  });

  it('validates plural hosted and local provider routes without credential values', () => {
    expect(new Set(providers.cases.map((fixture) => fixture.record.deploymentMode)))
      .toEqual(new Set(['hosted', 'local']));
    expect(providers.cases.map((fixture) => fixture.record.providerId)).toContain(
      'opencode-go-deepseek-v4-flash',
    );
    expect(providers.cases.map((fixture) => fixture.record.providerId)).toContain(
      'ollama-local',
    );
    expect(providers.cases.map((fixture) => fixture.record.providerId)).toContain(
      'llama-cpp-local',
    );

    for (const fixture of providers.cases) {
      expect(validateProviderRecord(fixture.record).success, fixture.fixtureId).toBe(true);
      expect(fixture.record.credentialReference)
        .toMatch(/^(?:env|keychain|managed|none):[A-Za-z0-9._-]+$/);
    }
  });

  it('rejects contradictory and duplicate provider-control mappings', () => {
    const base = prompts.cases.find(
      (fixture) => fixture.fixtureId === 'prompt-unsupported-controls',
    );
    expect(base).toBeDefined();
    if (base === undefined) {
      return;
    }
    const firstMapping = base.record.providerControlMappings[0];
    expect(firstMapping).toBeDefined();
    if (firstMapping === undefined) {
      return;
    }

    const contradictory = {
      ...base.record,
      providerControlMappings: [
        { ...firstMapping, wireField: 'temperature' },
      ],
    };
    const contradictoryResult = validateContract(contradictory);
    expect(contradictoryResult.success).toBe(false);
    expect(
      !contradictoryResult.success
        && contradictoryResult.issues.some((issue) => issue.code === 'control_mapping'),
    ).toBe(true);

    const duplicate = {
      ...base.record,
      providerControlMappings: [firstMapping, { ...firstMapping }],
    };
    const duplicateResult = validateContract(duplicate);
    expect(duplicateResult.success).toBe(false);
    expect(
      !duplicateResult.success
        && duplicateResult.issues.some((issue) => issue.code === 'duplicate'),
    ).toBe(true);
  });

  it('rejects a literal credential value', () => {
    const base = providers.cases[0];
    expect(base).toBeDefined();
    if (base === undefined) {
      return;
    }
    const invalid = {
      ...base.record,
      credentialReference: 'literal-secret-value',
    };
    const result = validateProviderRecord(invalid);
    expect(result.success).toBe(false);
    expect(!result.success && result.originalInput).toBe(invalid);
  });
});

describe('typed projection and error outcomes', () => {
  it('validates all success and fail-closed records', () => {
    for (const fixture of outcomes.cases) {
      expect(validateContract(fixture.record).success, fixture.fixtureId).toBe(true);
    }
  });

  it('selects exact-original for every seeded unsafe or failed condition', () => {
    const exactOriginalReasons: string[] = [];
    const errorFallbacks: string[] = [];
    for (const fixture of outcomes.cases) {
      const record = fixture.record;
      if (record.contractKind === 'projection' && record.status === 'exact-original') {
        exactOriginalReasons.push(record.reasonCode);
      }
      if (record.contractKind === 'error') {
        errorFallbacks.push(record.fallback);
      }
    }

    expect(new Set(exactOriginalReasons)).toEqual(new Set([
      'cancelled',
      'empty-output',
      'incomplete-source',
      'privacy-denied',
      'provider-error',
      'timeout',
      'unsupported-control',
      'unsupported-schema',
      'validation-rejected',
    ]));
    expect(errorFallbacks).not.toHaveLength(0);
    expect(errorFallbacks.every((fallback) => fallback === 'exact-original')).toBe(true);
  });
});
