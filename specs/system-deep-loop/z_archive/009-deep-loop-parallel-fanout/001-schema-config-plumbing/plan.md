<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan — Phase 001: Fan-out schema + config plumbing

## Approach
Add opt-in multi-executor config types alongside the existing single-executor schema, reusing `parseExecutorConfig` per entry. No behavior change; single-executor path byte-identical.

## Steps
1. Add `lineageExecutorSchema`, `fanoutConfigSchema`, `parseFanoutConfig`, `expandLineages` to `executor-config.ts` (do not touch existing schema/parser).
2. Thread optional `lineageId` through `executor-audit.ts` (input + record + builder), conditional so absent ⇒ unchanged.
3. Extend `executor-config.vitest.ts` with fan-out parse/expand/validation cases.

## Verification
Full `deep-loop-runtime/tests/unit/` green; existing single-executor tests unchanged.
