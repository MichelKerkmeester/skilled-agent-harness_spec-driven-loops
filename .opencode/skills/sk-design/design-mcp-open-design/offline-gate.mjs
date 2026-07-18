// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Open Design Offline Contract Gate                                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import {
  ALIGNED_RECONCILIATION_FIXTURE,
  DIVERGED_RECONCILIATION_FIXTURE,
  POSITIVE_RECEIPT_FIXTURE,
  RECEIPT_FIXTURES,
  RECONCILIATION_FIXTURES,
} from './fixtures/offline-fixtures.mjs';
import { validateGroundingReceipt } from './grounding-receipt.mjs';
import {
  reconcileTransportReturn,
  validateReconciliationRecord,
  validateReturnEvidence,
} from './return-reconciliation.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. GATE STATE
// ─────────────────────────────────────────────────────────────────────────────

const issuedGateResults = new WeakSet();

// ─────────────────────────────────────────────────────────────────────────────
// 3. PUBLIC GATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run the daemon-free contract fixtures that must pass before live transport.
 *
 * @returns {Readonly<Object>} An identity-bound gate result.
 */
export function runOfflineContractGate() {
  const errors = [];
  for (const fixture of RECEIPT_FIXTURES) {
    const validation = validateGroundingReceipt(fixture);
    if (!validation.valid) errors.push(...validation.errors.map((error) => `${fixture.receiptId}:${error}`));
  }

  for (const fixture of RECONCILIATION_FIXTURES) {
    try {
      const record = reconcileTransportReturn(fixture);
      if (record.outcome !== fixture.expectedOutcome) {
        errors.push(`${fixture.name}:unexpected-outcome:${record.outcome}`);
      }
    } catch (error) {
      errors.push(`${fixture.name}:${error.message}`);
    }
  }

  const cacheViolation = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  cacheViolation.cachedOpenDesignPayload = { html: '<html><body>forbidden</body></html>' };
  if (validateGroundingReceipt(cacheViolation).valid) {
    errors.push('no-cache-falsifier:violation-was-accepted');
  }

  const allowedFieldPayload = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  allowedFieldPayload.corpusContext.proof.transformationState = '<button>forbidden</button>';
  if (validateGroundingReceipt(allowedFieldPayload).valid) {
    errors.push('allowed-field-falsifier:raw-payload-was-accepted');
  }

  const missingReceiptAuthority = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  delete missingReceiptAuthority.authority.decisionOwner;
  if (validateGroundingReceipt(missingReceiptAuthority).valid) {
    errors.push('receipt-authority-falsifier:missing-field-was-accepted');
  }

  const authoritative = structuredClone(
    reconcileTransportReturn(RECONCILIATION_FIXTURES[0]),
  );
  authoritative.authority.transportAuthoritative = true;
  if (validateReconciliationRecord(authoritative).valid) {
    errors.push('authority-falsifier:transport-authority-was-accepted');
  }

  const semanticForgery = structuredClone(
    reconcileTransportReturn(DIVERGED_RECONCILIATION_FIXTURE),
  );
  semanticForgery.outcome = 'aligned';
  semanticForgery.divergences = [];
  if (validateReconciliationRecord(semanticForgery).valid) {
    errors.push('semantic-falsifier:forged-alignment-was-accepted');
  }

  const rawReturn = structuredClone(ALIGNED_RECONCILIATION_FIXTURE.returnEvidence);
  rawReturn.rawPayload = '<html>forbidden</html>';
  if (validateReturnEvidence(rawReturn).valid) {
    errors.push('return-cache-falsifier:raw-payload-was-accepted');
  }

  const duplicateEvidence = structuredClone(ALIGNED_RECONCILIATION_FIXTURE);
  duplicateEvidence.modeEvidence.push({ ...duplicateEvidence.modeEvidence[0] });
  try {
    reconcileTransportReturn(duplicateEvidence);
    errors.push('duplicate-evidence-falsifier:duplicate-was-accepted');
  } catch {
    // Expected: duplicate classifications cannot be collapsed into one decision.
  }

  const unboundEvidence = structuredClone(ALIGNED_RECONCILIATION_FIXTURE);
  unboundEvidence.modeEvidence[0].artifactHash = `sha256:${'f'.repeat(64)}`;
  try {
    reconcileTransportReturn(unboundEvidence);
    errors.push('artifact-binding-falsifier:unbound-hash-was-accepted');
  } catch {
    // Expected: classifications only speak for returned artifacts.
  }

  if (errors.length) {
    throw new Error(`Open Design offline contract gate failed: ${errors.join(', ')}`);
  }

  const result = Object.freeze({
    status: 'passed',
    receiptFixturesPassed: RECEIPT_FIXTURES.length,
    reconciliationFixturesPassed: RECONCILIATION_FIXTURES.length,
    noCacheFalsifierPassed: true,
    authorityFalsifierPassed: true,
    closedFieldFalsifierPassed: true,
    semanticFalsifierPassed: true,
    evidenceIntegrityFalsifierPassed: true,
  });
  issuedGateResults.add(result);
  return result;
}

/**
 * Reject copied or caller-asserted gate-shaped objects before live I/O.
 *
 * @param {unknown} result - Candidate gate result.
 */
export function assertOfflineContractGate(result) {
  if (!result || typeof result !== 'object' || !issuedGateResults.has(result)) {
    throw new Error('Live Open Design transport requires a fresh in-process offline contract gate.');
  }
}
