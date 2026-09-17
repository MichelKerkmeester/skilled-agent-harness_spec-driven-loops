// ───────────────────────────────────────────────────────────────────
// MODULE: Fidelity Test Helpers
// ───────────────────────────────────────────────────────────────────

import {
  createExactOriginalRecord,
  protectMarkdown,
} from '../../src/index.js';

import type {
  FixtureProvenance,
  ProtectedDocument,
  ProjectionValidationInput,
} from '../../src/index.js';

const provenance: FixtureProvenance = {
  sourceFamily: 'fidelity-test',
  sourceVersion: '1.0.0',
  captureMethod: 'synthetic',
  sanitizationStatus: 'synthetic',
  capturedAt: '2026-08-11T18:00:00.000Z',
};

/** Protect one synthetic UTF-8 original or fail the test setup. */
export function createProtectedDocument(
  sourceText: string,
  configuredLiterals: readonly string[] = [],
): ProtectedDocument {
  const exactOriginal = createExactOriginalRecord(
    `fidelity-${createStableId(sourceText)}`,
    new TextEncoder().encode(sourceText),
    'text/markdown; charset=utf-8',
    provenance,
  );
  const result = protectMarkdown({
    sourceText,
    exactOriginal,
    configuredLiterals,
  });
  if (result.status !== 'protected') {
    throw new Error(`Expected protection to succeed, received ${result.reasonCode}.`);
  }
  return result.document;
}

/** Create the deterministic validation input used by focused tests. */
export function createValidationInput(
  protection: ProtectedDocument,
  candidateText = protection.encodedText,
  overrides: Partial<ProjectionValidationInput> = {},
): ProjectionValidationInput {
  return {
    protection,
    candidateText,
    providerTerminal: 'success',
    allPartsComplete: true,
    currentSourceSha256: protection.sourceSha256,
    judgeMode: 'disabled',
    ...overrides,
  };
}

function createStableId(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}
