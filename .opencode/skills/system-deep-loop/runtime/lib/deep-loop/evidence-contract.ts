// MODULE: Deep-Loop Evidence Contract
//
// A fixed, machine-checkable shape for the proof a load-bearing claim should
// carry at the dispatch boundary. The point is to give the doctrine "a finding
// is a hypothesis until verified" a place to land instead of relying on prose
// discipline alone. The contract is optional and advisory: a record that omits
// the metadata is valid, and a malformed payload is a warning, never a failure.

// ───── TYPE DEFINITIONS ─────

export const EVIDENCE_CLAIM_CLASSES = ['confirmed', 'inferred', 'hypothesis', 'unknown'] as const;
export type EvidenceClaimClass = typeof EVIDENCE_CLAIM_CLASSES[number];

export const EVIDENCE_SCOPE_STATES = ['in_scope', 'out_of_scope', 'scope_expanded'] as const;
export type EvidenceScopeState = typeof EVIDENCE_SCOPE_STATES[number];

// The five fields a claim carries. All optional at the type level so a partial
// payload is representable; the validator decides whether a partial payload is
// present, absent, or malformed.
export type EvidenceContract = {
  readonly claim_class?: EvidenceClaimClass;
  readonly would_confirm?: string;
  readonly gate_delta?: string;
  readonly scope_state?: EvidenceScopeState;
  readonly child_result_verified?: boolean;
};

export const EVIDENCE_CONTRACT_FIELDS = [
  'claim_class',
  'would_confirm',
  'gate_delta',
  'scope_state',
  'child_result_verified',
] as const;

export type EvidenceContractField = typeof EVIDENCE_CONTRACT_FIELDS[number];

export type EvidenceFieldIssue = {
  readonly fieldPath: EvidenceContractField;
  readonly detail: string;
};

export type EvidenceContractValidation =
  | { readonly status: 'absent' }
  | { readonly status: 'present' }
  | { readonly status: 'malformed'; readonly issues: readonly EvidenceFieldIssue[] };

// ───── HELPERS ─────

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function validateClaimClass(value: unknown): EvidenceFieldIssue | null {
  if (!isNonEmptyString(value)) {
    return { fieldPath: 'claim_class', detail: 'claim_class must be a non-empty string' };
  }
  if (!(EVIDENCE_CLAIM_CLASSES as readonly string[]).includes(value)) {
    return { fieldPath: 'claim_class', detail: `claim_class '${value}' is not one of ${EVIDENCE_CLAIM_CLASSES.join(', ')}` };
  }
  return null;
}

function validateScopeState(value: unknown): EvidenceFieldIssue | null {
  if (!isNonEmptyString(value)) {
    return { fieldPath: 'scope_state', detail: 'scope_state must be a non-empty string' };
  }
  if (!(EVIDENCE_SCOPE_STATES as readonly string[]).includes(value)) {
    return { fieldPath: 'scope_state', detail: `scope_state '${value}' is not one of ${EVIDENCE_SCOPE_STATES.join(', ')}` };
  }
  return null;
}

function validateStringField(field: 'would_confirm' | 'gate_delta', value: unknown): EvidenceFieldIssue | null {
  if (!isNonEmptyString(value)) {
    return { fieldPath: field, detail: `${field} must be a non-empty string` };
  }
  return null;
}

function validateChildResultVerified(value: unknown): EvidenceFieldIssue | null {
  if (typeof value !== 'boolean') {
    return { fieldPath: 'child_result_verified', detail: 'child_result_verified must be a boolean' };
  }
  return null;
}

// ───── EXPORTS ─────

/**
 * Validate an optional evidence-contract payload against the five-field schema.
 *
 * Classifies the input as:
 * - `absent`   - no evidence metadata at all (the common, backward-compatible
 *   case); callers must treat this as a pass with no warning.
 * - `present`  - all five fields are present and well-formed.
 * - `malformed` - the metadata exists but at least one field is missing, the
 *   wrong type, or an unknown enum value; carries per-field issues so a caller
 *   can name the offending field path in an advisory.
 *
 * This function never throws and never blocks: malformed metadata is reported,
 * not rejected. Field values are treated as inert data, never interpreted.
 *
 * @param input - The candidate evidence metadata (any shape).
 * @returns The classification plus per-field issues when malformed.
 */
export function validateEvidenceContract(input: unknown): EvidenceContractValidation {
  if (!isObjectRecord(input)) {
    return { status: 'absent' };
  }

  const present = EVIDENCE_CONTRACT_FIELDS.filter((field) =>
    Object.prototype.hasOwnProperty.call(input, field) && input[field] !== undefined,
  );

  if (present.length === 0) {
    return { status: 'absent' };
  }

  const issues: EvidenceFieldIssue[] = [];

  // A partial payload (some but not all five) is malformed: a claim that names
  // its class but not what would confirm it is exactly the gap the contract
  // exists to surface.
  for (const field of EVIDENCE_CONTRACT_FIELDS) {
    if (!present.includes(field)) {
      issues.push({ fieldPath: field, detail: `${field} is missing` });
    }
  }

  const claimClassIssue = present.includes('claim_class') ? validateClaimClass(input.claim_class) : null;
  if (claimClassIssue) issues.push(claimClassIssue);

  const wouldConfirmIssue = present.includes('would_confirm') ? validateStringField('would_confirm', input.would_confirm) : null;
  if (wouldConfirmIssue) issues.push(wouldConfirmIssue);

  const gateDeltaIssue = present.includes('gate_delta') ? validateStringField('gate_delta', input.gate_delta) : null;
  if (gateDeltaIssue) issues.push(gateDeltaIssue);

  const scopeStateIssue = present.includes('scope_state') ? validateScopeState(input.scope_state) : null;
  if (scopeStateIssue) issues.push(scopeStateIssue);

  const childIssue = present.includes('child_result_verified') ? validateChildResultVerified(input.child_result_verified) : null;
  if (childIssue) issues.push(childIssue);

  if (issues.length > 0) {
    return { status: 'malformed', issues };
  }

  return { status: 'present' };
}
