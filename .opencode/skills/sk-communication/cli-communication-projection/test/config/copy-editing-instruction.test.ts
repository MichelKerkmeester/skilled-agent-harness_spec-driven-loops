// ───────────────────────────────────────────────────────────────────
// MODULE: Copy-Editing Instruction And Fidelity Outcome Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  decodeExactOriginal,
  FidelityReasonCodes,
  validateProjectionCandidate,
} from '../../src/index.js';
import {
  resolveCopyEditingInstruction,
  COPY_EDITING_TEMPERATURE,
} from '../../src/config/copy-editing-instruction.js';
import { createCopyEditingPrompt } from '../../src/config/local-provider.js';
import { buildPrompt } from '../../src/runtime/external-cli-projection.js';
import { createProtectedDocument, createValidationInput } from '../fidelity/helpers.js';
import { createProviderMatrix } from '../providers/helpers.js';

import type { FidelityReasonCode } from '../../src/fidelity/types.js';

const REPLY_SOURCE = 'each editor must sign the note. always keep the note dry.';

function primaryTestRecord() {
  const records = createProviderMatrix();
  const record = records[0];
  if (record === undefined) {
    throw new Error('Expected a provider record.');
  }
  return record;
}

describe('copy-editing instruction declaration', () => {
  it('gives both profiles one byte-identical instruction and temperature', () => {
    const record = primaryTestRecord();
    const local = createCopyEditingPrompt(record);
    const external = buildPrompt(record);
    expect(local.systemInstruction).toBe(resolveCopyEditingInstruction());
    expect(external.systemInstruction).toBe(resolveCopyEditingInstruction());
    expect(local.temperature).toBe(COPY_EDITING_TEMPERATURE);
    expect(external.temperature).toBe(COPY_EDITING_TEMPERATURE);
  });

  it('reads provider-default thinking in both profiles', () => {
    const record = primaryTestRecord();
    const local = createCopyEditingPrompt(record);
    const external = buildPrompt(record);
    expect(local.thinkingMode).toBe('provider-default');
    expect(external.thinkingMode).toBe('provider-default');
  });

  it('carries a voice directive sentence from the wording standard', () => {
    expect(resolveCopyEditingInstruction()).toContain('Use active voice. Subject before verb.');
    expect(COPY_EDITING_TEMPERATURE).toBe(0.2);
  });
});

describe('fidelity claim omission and change kind', () => {
  it('accepts an unchanged candidate as a no-op without earned pass markers', async () => {
    const protection = createProtectedDocument(
      'The worker must keep 3 replicas. It is not safe to disable retries.',
    );
    const result = await validateProjectionCandidate(createValidationInput(protection));
    expect(result).toMatchObject({
      status: 'accepted',
      reasonCode: FidelityReasonCodes.ACCEPTED,
    });
    if (result.status !== 'accepted') {
      throw new Error('Expected an accepted fidelity outcome.');
    }
    expect(result.changeKind).toBe('no-op');
    const vetoRuleIds = new Set<FidelityReasonCode>([
      FidelityReasonCodes.MARKDOWN_STRUCTURE_CHANGED,
      FidelityReasonCodes.FACT_ADDED,
      FidelityReasonCodes.POLARITY_CHANGED,
      FidelityReasonCodes.REQUIREMENT_STRENGTH_CHANGED,
      FidelityReasonCodes.PRIORITY_CHANGED,
    ]);
    expect(result.checks.filter((check) => vetoRuleIds.has(check.ruleId))).toHaveLength(0);
  });

  it('rejects a candidate that drops the requirement claim sentence', async () => {
    const protection = createProtectedDocument(REPLY_SOURCE);
    const result = await validateProjectionCandidate(createValidationInput(
      protection,
      protection.encodedText.replace('each editor must sign', 'someone shall sign'),
    ));
    expect(result).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.CLAIM_OMITTED,
    });
  });

  it('rejects a candidate that keeps every word and inverts the cause', async () => {
    const protection = createProtectedDocument(
      'each editor must sign the note. the deploy failed because the cache was stale.',
    );
    const result = await validateProjectionCandidate(createValidationInput(
      protection,
      protection.encodedText.replace(
        'the deploy failed because the cache was stale.',
        'the cache was stale because the deploy failed.',
      ),
    ));
    expect(result).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.CAUSE_INVERTED,
    });
  });

  it('rejects a candidate that drops the caveat claim sentence', async () => {
    const protection = createProtectedDocument(
      'each editor must sign the note. however, always keep the note dry.',
    );
    const result = await validateProjectionCandidate(createValidationInput(
      protection,
      protection.encodedText
        .replace('each editor must sign', 'someone shall sign')
        .replace('however, always keep the note dry.', 'the note however stays dry.'),
    ));
    expect(result).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.CLAIM_OMITTED,
    });
  });

  it('accepts a compressed claim pair that keeps both claims', async () => {
    const protection = createProtectedDocument(REPLY_SOURCE);
    const result = await validateProjectionCandidate(createValidationInput(
      protection,
      protection.encodedText.replace('note. always keep', 'note and always keep'),
    ));
    expect(result).toMatchObject({
      status: 'accepted',
      reasonCode: FidelityReasonCodes.ACCEPTED,
    });
    if (result.status !== 'accepted') {
      throw new Error('Expected an accepted fidelity outcome.');
    }
    expect(result.changeKind).toBe('reworded');
  });

  it('returns the exact original bytes from every failed path', async () => {
    const protection = createProtectedDocument('The worker must remain available.');
    const vetoed = await validateProjectionCandidate(createValidationInput(
      protection,
      protection.encodedText.replace('must', 'should'),
    ));
    if (vetoed.status === 'rejected') {
      throw new Error('Expected a fidelity outcome with an exact-original fallback.');
    }
    expect(vetoed).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.REQUIREMENT_STRENGTH_CHANGED,
    });
    expect(Buffer.from(decodeExactOriginal(vetoed.exactOriginal)).toString('utf8'))
      .toBe('The worker must remain available.');

    const disrupted = await validateProjectionCandidate(createValidationInput(
      protection,
      protection.encodedText,
      { providerTerminal: 'error' },
    ));
    if (disrupted.status === 'rejected') {
      throw new Error('Expected a fidelity outcome with an exact-original fallback.');
    }
    expect(disrupted).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.PROVIDER_ERROR,
    });
    expect(Buffer.from(decodeExactOriginal(disrupted.exactOriginal)).toString('utf8'))
      .toBe('The worker must remain available.');

    const claimProtection = createProtectedDocument(REPLY_SOURCE);
    const claimVeto = await validateProjectionCandidate(createValidationInput(
      claimProtection,
      claimProtection.encodedText.replace('each editor must sign', 'someone shall sign'),
    ));
    if (claimVeto.status === 'rejected') {
      throw new Error('Expected a fidelity outcome with an exact-original fallback.');
    }
    expect(claimVeto).toMatchObject({
      status: 'exact-original',
      reasonCode: FidelityReasonCodes.CLAIM_OMITTED,
    });
    expect(Buffer.from(decodeExactOriginal(claimVeto.exactOriginal)).toString('utf8'))
      .toBe(REPLY_SOURCE);
  });
});
