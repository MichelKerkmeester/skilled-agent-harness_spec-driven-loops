// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Parity Schema Registry
// ───────────────────────────────────────────────────────────────────

/** Closed schema file inventory; unknown artifact kinds cannot join trusted evidence. */
export const SHADOW_PARITY_SCHEMA_FILES = Object.freeze([
  'parity-case-capsule.v1.schema.json',
  'observable-transcript.v1.schema.json',
  'divergence-record.v1.schema.json',
  'parity-certificate.v1.schema.json',
  'certificate-verification-response.v1.schema.json',
] as const);

export type ShadowParitySchemaFile = typeof SHADOW_PARITY_SCHEMA_FILES[number];
