// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Tool Contract Keys
// ───────────────────────────────────────────────────────────────
// Parameter key tuples for the advisor_recommend and advisor_validate
// descriptors. Each descriptor types its JSON Schema `properties` record by
// its tuple, so a key added to or removed from one without the other fails the
// type check.
//
// The Zod input schemas in schemas/advisor-tool-schemas.ts do not read these
// tuples. For advisor_recommend, the descriptor and Zod option keys are held
// equal by tests/handlers/advisor-recommend-descriptor-parity.vitest.ts. The
// Zod schema also accepts a top-level workspaceRoot, which the descriptor does
// not list.

export const ADVISOR_RECOMMEND_PARAMETER_KEYS = [
  'prompt',
  'options',
] as const;

export type AdvisorRecommendParameterKey =
  (typeof ADVISOR_RECOMMEND_PARAMETER_KEYS)[number];

export const ADVISOR_VALIDATE_PARAMETER_KEYS = [
  'confirmHeavyRun',
  'workspaceRoot',
  'skillSlug',
  'outcomeEvents',
] as const;

export type AdvisorValidateParameterKey =
  (typeof ADVISOR_VALIDATE_PARAMETER_KEYS)[number];
