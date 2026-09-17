// ───────────────────────────────────────────────────────────────────
// MODULE: Render Decision and Evidence Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  RenderModes,
  RenderReasonCodes,
  createFidelityTelemetryEvent,
  createRenderTelemetryEvent,
  decideRender,
  decodeExactOriginal,
  validateProjectionCandidate,
  validateTelemetryEvent,
} from '../../src/index.js';
import {
  createProtectedDocument,
  createValidationInput,
} from './helpers.js';

import type { FidelityOutcome } from '../../src/index.js';
import type { RenderDecisionInput } from '../../src/index.js';

describe('capability-aware render decisions', () => {
  it('selects replace, append, sidecar, and original-only in preference order', async () => {
    const accepted = await createAccepted('Render canary text.');
    const cases = [
      [{ atomicReplace: true, appendAfterOriginal: true, sidecar: true }, RenderModes.ATOMIC_REPLACE],
      [{ atomicReplace: false, appendAfterOriginal: true, sidecar: true }, RenderModes.APPEND_AFTER_ORIGINAL],
      [{ atomicReplace: false, appendAfterOriginal: false, sidecar: true }, RenderModes.SIDECAR],
      [{ atomicReplace: false, appendAfterOriginal: false, sidecar: false }, RenderModes.EXACT_ORIGINAL_ONLY],
    ] as const;

    for (const [capabilities, mode] of cases) {
      const decision = decideRender({
        validation: accepted,
        currentSourceSha256: accepted.sourceSha256,
        sourceTerminal: 'completed',
        allPartsComplete: true,
        capabilities,
      });
      expect(decision.mode).toBe(mode);
      expect(Object.isFrozen(decision)).toBe(true);
      if (mode === RenderModes.EXACT_ORIGINAL_ONLY) {
        expect(decision.reasonCode).toBe(RenderReasonCodes.UNSUPPORTED_MODE);
      }
    }
  });

  it('falls back to exact stored bytes on stale source, incomplete source, or rejection', async () => {
    const source = 'The exact original must remain available.';
    const accepted = await createAccepted(source);
    const stale = decideRender({
      validation: accepted,
      currentSourceSha256: `sha256:${'0'.repeat(64)}`,
      sourceTerminal: 'completed',
      allPartsComplete: true,
      capabilities: { atomicReplace: true, appendAfterOriginal: true, sidecar: true },
    });
    expect(stale).toMatchObject({
      status: 'exact-original',
      mode: RenderModes.EXACT_ORIGINAL_ONLY,
      reasonCode: RenderReasonCodes.SOURCE_CHANGED,
    });

    const incomplete = decideRender({
      validation: accepted,
      currentSourceSha256: accepted.sourceSha256,
      sourceTerminal: 'completed',
      allPartsComplete: false,
      capabilities: { atomicReplace: true, appendAfterOriginal: true, sidecar: true },
    });
    expect(incomplete.reasonCode).toBe(RenderReasonCodes.INCOMPLETE_SOURCE);

    const protection = createProtectedDocument(source);
    const rejected = await validateProjectionCandidate(createValidationInput(
      protection,
      protection.encodedText.replace('must', 'should'),
    ));
    if (rejected.status === 'rejected') {
      throw new Error('Expected a fidelity outcome with an exact-original fallback.');
    }
    const rejectedDecision = decideRender({
      validation: rejected,
      currentSourceSha256: protection.sourceSha256,
      sourceTerminal: 'completed',
      allPartsComplete: true,
      capabilities: { atomicReplace: true, appendAfterOriginal: true, sidecar: true },
    });
    expect(rejectedDecision.reasonCode).toBe(RenderReasonCodes.VALIDATION_REJECTED);

    for (const decision of [stale, incomplete, rejectedDecision]) {
      expect(Buffer.from(decodeExactOriginal(decision.exactOriginal)).toString('utf8')).toBe(source);
      expect(decision.projectionText).toBeNull();
    }
  });

  it('honors explicit safe preferences and remains idempotent', async () => {
    const accepted = await createAccepted('Keep rendering deterministic.');
    const input = {
      validation: accepted,
      currentSourceSha256: accepted.sourceSha256,
      sourceTerminal: 'completed' as const,
      allPartsComplete: true,
      capabilities: { atomicReplace: true, appendAfterOriginal: true, sidecar: true },
      preferredModes: [RenderModes.SIDECAR, RenderModes.EXACT_ORIGINAL_ONLY],
    };
    const first = decideRender(input);
    const second = decideRender(input);

    expect(first.mode).toBe(RenderModes.SIDECAR);
    expect(first).toEqual(second);
    expect(accepted.exactOriginal.sha256).toBe(input.validation.exactOriginal.sha256);

    const original = decideRender({
      ...input,
      preferredModes: [RenderModes.EXACT_ORIGINAL_ONLY],
    });
    expect(original).toMatchObject({
      status: 'exact-original',
      reasonCode: RenderReasonCodes.ORIGINAL_SELECTED,
    });
  });

  it('rejects malformed capabilities and invalid validated projections', async () => {
    const accepted = await createAccepted('Keep the display decision closed.');
    const invalidCapabilities = decideRender({
      validation: accepted,
      currentSourceSha256: accepted.sourceSha256,
      sourceTerminal: 'completed',
      allPartsComplete: true,
      capabilities: {
        atomicReplace: true,
        appendAfterOriginal: true,
        sidecar: true,
        openEnded: true,
      },
    } as RenderDecisionInput);
    expect(invalidCapabilities).toMatchObject({
      status: 'exact-original',
      reasonCode: RenderReasonCodes.INVALID_INPUT,
    });

    const invalidProjection = {
      ...accepted,
      projectionSha256: `sha256:${'0'.repeat(64)}`,
    };
    const invalidDecision = decideRender({
      validation: invalidProjection,
      currentSourceSha256: invalidProjection.sourceSha256,
      sourceTerminal: 'completed',
      allPartsComplete: true,
      capabilities: { atomicReplace: true, appendAfterOriginal: true, sidecar: true },
    });
    expect(invalidDecision).toMatchObject({
      status: 'exact-original',
      reasonCode: RenderReasonCodes.INVALID_INPUT,
    });
  });
});

describe('content-free fidelity evidence', () => {
  it('emits schema-valid validation and render events without source content', async () => {
    const canary = 'RAW_FIDELITY_CANARY_7c91';
    const accepted = await createAccepted(canary);
    const render = decideRender({
      validation: accepted,
      currentSourceSha256: accepted.sourceSha256,
      sourceTerminal: 'completed',
      allPartsComplete: true,
      capabilities: { atomicReplace: true, appendAfterOriginal: true, sidecar: true },
    });
    const options = {
      runtime: 'codex',
      privacyClass: 'local-offline',
      providerId: 'synthetic-provider',
      modelId: 'synthetic-model',
      providerMs: 4,
      validationMs: 2,
      totalMs: 6,
      attemptCount: 1,
      correlation: {
        value: 'fidelity-session',
        hmacKey: 'rotating-evidence-key',
        rotationId: 'rotation-2026-08-11',
      },
    } as const;

    const validationEvent = createFidelityTelemetryEvent(accepted, options);
    const renderEvent = createRenderTelemetryEvent(render, options);
    for (const emission of [validationEvent, renderEvent]) {
      expect(emission.status).toBe('emitted');
      if (emission.status !== 'emitted') {
        continue;
      }
      expect(validateTelemetryEvent(emission.event).success).toBe(true);
      const serialized = JSON.stringify(emission.event);
      expect(serialized).not.toContain(canary);
      expect(serialized).not.toContain('rotating-evidence-key');
    }
  });

  it('rejects open-ended evidence options', async () => {
    const accepted = await createAccepted('Evidence stays closed.');
    const result = createFidelityTelemetryEvent(accepted, {
      runtime: 'codex',
      privacyClass: 'local-offline',
      providerId: null,
      modelId: null,
      providerMs: 0,
      validationMs: 1,
      totalMs: 1,
      attemptCount: 1,
      rawText: 'must not escape',
    });
    expect(result.status).toBe('suppressed');
  });
});

async function createAccepted(source: string): Promise<Extract<FidelityOutcome, { status: 'accepted' }>> {
  const protection = createProtectedDocument(source);
  const result = await validateProjectionCandidate(createValidationInput(protection));
  if (result.status !== 'accepted') {
    throw new Error(`Expected an accepted validation result, received ${result.reasonCode}.`);
  }
  return result;
}
