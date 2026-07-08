import { describe, expect, it } from 'vitest';

import {
  EVIDENCE_CLAIM_CLASSES,
  EVIDENCE_CONTRACT_FIELDS,
  EVIDENCE_SCOPE_STATES,
  validateEvidenceContract,
} from '../../lib/deep-loop/evidence-contract.js';

function validPayload(): Record<string, unknown> {
  return {
    claim_class: 'confirmed',
    would_confirm: 'rerun the gate and read the exit code',
    gate_delta: '351 -> 357 passing',
    scope_state: 'in_scope',
    child_result_verified: true,
  };
}

describe('evidence-contract schema', () => {
  it('exports the five canonical field names', () => {
    expect([...EVIDENCE_CONTRACT_FIELDS]).toEqual([
      'claim_class',
      'would_confirm',
      'gate_delta',
      'scope_state',
      'child_result_verified',
    ]);
    expect(EVIDENCE_CLAIM_CLASSES.length).toBeGreaterThan(0);
    expect(EVIDENCE_SCOPE_STATES.length).toBeGreaterThan(0);
  });

  it('classifies a complete, well-formed payload as present', () => {
    expect(validateEvidenceContract(validPayload())).toEqual({ status: 'present' });
  });

  it('classifies no metadata as absent (backward compatible)', () => {
    expect(validateEvidenceContract(undefined)).toEqual({ status: 'absent' });
    expect(validateEvidenceContract(null)).toEqual({ status: 'absent' });
    expect(validateEvidenceContract({})).toEqual({ status: 'absent' });
    expect(validateEvidenceContract('not-an-object')).toEqual({ status: 'absent' });
  });

  it('classifies a partial payload as malformed and names the missing fields', () => {
    const result = validateEvidenceContract({ claim_class: 'inferred' });
    expect(result.status).toBe('malformed');
    if (result.status !== 'malformed') return;
    const missing = result.issues.filter((i) => i.detail.endsWith('is missing')).map((i) => i.fieldPath);
    expect(missing).toContain('would_confirm');
    expect(missing).toContain('gate_delta');
    expect(missing).toContain('scope_state');
    expect(missing).toContain('child_result_verified');
  });

  it('flags a wrong-type child_result_verified', () => {
    const result = validateEvidenceContract({ ...validPayload(), child_result_verified: 'yes' });
    expect(result.status).toBe('malformed');
    if (result.status !== 'malformed') return;
    expect(result.issues.some((i) => i.fieldPath === 'child_result_verified')).toBe(true);
  });

  it('flags an unknown claim_class enum value', () => {
    const result = validateEvidenceContract({ ...validPayload(), claim_class: 'speculative' });
    expect(result.status).toBe('malformed');
    if (result.status !== 'malformed') return;
    const issue = result.issues.find((i) => i.fieldPath === 'claim_class');
    expect(issue?.detail).toContain('speculative');
  });

  it('flags an unknown scope_state enum value', () => {
    const result = validateEvidenceContract({ ...validPayload(), scope_state: 'maybe' });
    expect(result.status).toBe('malformed');
    if (result.status !== 'malformed') return;
    expect(result.issues.some((i) => i.fieldPath === 'scope_state')).toBe(true);
  });

  it('treats field values as inert data and never throws on hostile input', () => {
    expect(() =>
      validateEvidenceContract({
        ...validPayload(),
        would_confirm: '${process.exit(1)}',
        gate_delta: '"; rm -rf /; "',
      }),
    ).not.toThrow();
  });
});
