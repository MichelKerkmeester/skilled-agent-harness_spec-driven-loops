---
title: "Memclaw Derived Memory Hardening 001: Provenance and Audit"
description: "Schema v34 to v35 source_kind column with idempotent backfill, write-ingress automated-overwrite guard, deduped mutation-ledger audit, and an advisory constitutional rule."
trigger_phrases:
  - "007 001 provenance and audit changelog"
  - "source_kind schema v35 migration changelog"
  - "write-ingress overwrite guard shipped"
  - "mutation ledger deduped audit"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/001-provenance-and-audit` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening`

### Summary

This leaf advances the vector-index schema from v34 to v35 and makes write-ingress the enforcement point for memory provenance. Every new record now carries a server-derived `source_kind`. Automated writes that would overwrite protected manual or constitutional fields are stopped at pre-mutation time rather than after the fact. Repeated automated mutations are deduplicated in the audit ledger by a deterministic SHA-256 event key. An advisory constitutional rule records the automated-writers-never-overwrite-manual constraint in the constitutional loader.

### Added

- `source_kind` enum column in `vector-index-schema.ts` via schema migration 35 with idempotent `ALTER TABLE ... ADD COLUMN ... DEFAULT 'system'` and a backfill mapping (`manual` to `human`, `memory_index_scan` to `import`, `feedback-validator` to `feedback`, null to `system`).
- `buildGuardedUpdateParams` in `memory-crud-update.ts`: pre-mutation guard that skips automated overwrites of protected fields and returns a skipped-hint instead of throwing. Human writes and human-over-automated writes remain allowed.
- Deduped audit append in `mutation-ledger.ts` keyed by SHA-256 over actor, source, and reason. Re-running the same logical mutation appends zero additional rows. Append failure logs a warning and never fails the write being audited.
- `constitutional/automated-writers-never-overwrite-manual.md` registered through the constitutional loader as an advisory rule.
- 9 Vitest suites covering `create-record-identity`, `gate-d-regression-constitutional-memory`, `memory-crud-update-constitutional-guard`, `mutation-hooks`, `mutation-ledger`, `vector-index-schema-compatibility`, `vector-index-schema-migration-refinements`, `vector-index-schema-incremental-foundation`, and `causal-edges-write-safety`.

### Changed

- `create-record.ts`: persists server-derived `source_kind` inside the create transaction via `persistSourceKind`. Callers cannot assert `source_kind` directly.
- `memory-crud-update.ts`: derives update provenance server-side via `deriveSourceKindFromContext` and rejects forged `source_kind` or `__provenanceContext` input at the strict dispatch schema boundary.
- `mutation-hooks.ts`: scoped to post-write cache invalidation and audit append only. Integrity decisions were moved to the write-ingress phase.

### Fixed

- None.

### Verification

- `npm run build`: exit 0.
- Vitest: 9 suites, 74 tests green.
- Schema migration: `SCHEMA_VERSION` 34 to 35, migration registered as `migrations[35]`, idempotent re-run yields one column.
- Backfill mapping: `manual` to `human`, `memory_index_scan` to `import`, `feedback-validator` to `feedback`, null to `system`.
- Guard behavior: automated protected-field writes skip only protected fields, safe fields persist, response carries the skipped hint, and human writes remain allowed.
- Audit behavior: deduped by SHA-256 actor/source/reason key; repeated mutation appends zero rows; append failure warns without rollback.
- Constitutional rule: loader sees the rule and treats it as advisory.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modified | `source_kind` enum column and migration 35 with idempotent backfill. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts` | Modified | Server-derived `source_kind` persisted inside the create transaction. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | Modified | Update provenance derivation, forged-provenance rejection, and pre-mutation overwrite guard. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` | Modified | Scoped to post-write cache and audit only. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts` | Modified | Deduped audit append keyed by actor, source, and reason. |
| `.opencode/skills/system-spec-kit/constitutional/automated-writers-never-overwrite-manual.md` | Added | Advisory constitutional rule. |

### Follow-Ups

- Automated callers introduced in later phases must inject `__provenanceContext` so they are classified as non-human and governed by the guard.
- Startup drift repair re-runs the backfill each boot: convergent and protection-only, but a candidate for optimization later.
- Audit event key does not hash the mutated value: a follow-up could distinguish identical reasons that carry different values.
