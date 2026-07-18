// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Corpus Context Plan Contract                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONTRACT CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const CORPUS_CONTEXT_PLAN_VERSION = 'CORPUS_CONTEXT_PLAN v1';
export const CORPUS_PROOF_HANDOFF_VERSION = 'CORPUS_PROOF_HANDOFF v1';

export const CAPABILITY_TOKENS = Object.freeze([
  'coherent-reference',
  'relationship-context',
  'counterexample-context',
  'critique-context',
  'provenance-context',
]);

export const AUTHORITY_ORDER = Object.freeze([
  'user-brief-and-owned-system',
  'selected-mode-judgment',
  'target-evidence-and-deterministic-checks',
  'corpus-reference-evidence',
  'transport-output',
]);

export const CORPUS_EVIDENCE_ALLOWED_USES = Object.freeze([
  'explain-relationships',
  'expose-counterexamples',
  'sharpen-critique',
  'preserve-provenance',
]);

export const CORPUS_EVIDENCE_PROHIBITIONS = Object.freeze([
  'select-mode',
  'prove-accessibility-or-performance',
  'assign-severity',
  'establish-copying',
  'authorize-exact-reuse',
  'accept-transport-output',
]);

export const CORPUS_EVIDENCE_SCOPE = 'advisory-only';

export const SEMANTIC_ROLES = Object.freeze([
  'none',
  'reference',
]);

export const SEMANTIC_DIMENSIONS = Object.freeze([
  'relationship',
  'rationale',
]);

export const PROOF_OUTCOMES = Object.freeze([
  'positive',
  'no-fit',
  'unavailable',
  'generation-mismatch',
  'unknown-rights',
]);

export const TRANSFORMATION_SUMMARIES = Object.freeze([
  'transformed-reference',
  'planned-reference',
  'no-source-influence',
]);

export const FALLBACK_REASONS = Object.freeze([
  'bounded-reference-fit',
  'target-derived-no-fit',
  'ordinary-workflow-unavailable',
  'requery-generation-mismatch',
  'target-derived-unknown-rights',
]);

export const COMMON_PROOF_HANDOFF_FIELD_DEFINITIONS = Object.freeze({
  generationIdentity: 'Generation requested, observed, and comparison state.',
  sourceIdentity: 'Source, content hash, and source URL, or null when no source influenced work.',
  provenanceUseLabel: 'Provenance, rights knowledge, and the bounded source-use label.',
  semanticRole: 'Generic evidence role and named dimensions owned by that role.',
  transformation: 'Target-owned transformation summary and anti-copy state.',
  fallback: 'Ordinary-workflow, target-derived, or re-query fallback.',
  proofState: 'Evidence outcome and target-check state without a ready claim.',
});

export const COMMON_PROOF_HANDOFF_FIELDS = Object.freeze(
  Object.keys(COMMON_PROOF_HANDOFF_FIELD_DEFINITIONS),
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. DECLARATIVE SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

export const COMMON_PROOF_HANDOFF_SCHEMA = Object.freeze({
  schemaVersion: CORPUS_PROOF_HANDOFF_VERSION,
  required: COMMON_PROOF_HANDOFF_FIELDS,
  additionalProperties: false,
  invariants: Object.freeze([
    'negative-outcomes-are-valid-evidence',
    'outcome-fields-form-a-closed-consistent-state',
    'target-checks-remain-not-assessed',
    'source-specific-material-is-never-copied',
  ]),
});

export const CORPUS_CONTEXT_PLAN_SCHEMA = Object.freeze({
  schemaVersion: CORPUS_CONTEXT_PLAN_VERSION,
  required: Object.freeze([
    'schemaVersion',
    'generationIdentity',
    'availability',
    'capabilityPlan',
    'hydration',
    'authority',
    'proofPlan',
  ]),
  additionalProperties: false,
  hydration: Object.freeze({
    owner: 'selected-mode',
    hydratedStyleCount: 0,
  }),
  capabilityPlan: Object.freeze({
    allowed: CAPABILITY_TOKENS,
  }),
  authority: Object.freeze({
    order: AUTHORITY_ORDER,
    corpusEvidenceScope: CORPUS_EVIDENCE_SCOPE,
    corpusEvidenceAllowedUses: CORPUS_EVIDENCE_ALLOWED_USES,
    corpusEvidenceProhibitions: CORPUS_EVIDENCE_PROHIBITIONS,
  }),
  proofRecord: COMMON_PROOF_HANDOFF_SCHEMA,
});
