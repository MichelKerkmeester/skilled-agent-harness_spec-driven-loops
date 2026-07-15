---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will constrain importance_tier status and content_type to closed zod enums behind a flag seam in both JSON metadata schemas and close the three leaky producer paths. No code change has landed."
trigger_phrases:
  - "enum constrain schemas"
  - "importance_tier status content_type"
  - "graph-metadata zod schema"
  - "description schema enum"
  - "mutation_class enum discipline"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/001-on-write-quality/003-enum-constrain-schemas"
    last_updated_at: "2026-07-06T18:49:49.882Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase impl doc for A3 enum-constrain schemas scaffold"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-enum-constrain-schemas |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Flag-gated closed enums on the JSON metadata schemas

The phase will constrain the free-string controlled-vocabulary fields in the two zod metadata schemas to closed enums through a flag seam. The enum is not baked into the unconditionally parsed base schema. In `graph-metadata-schema.ts` the base `importance_tier` and `status` fields stay free-string and a strict schema variant (or a flag-gated `superRefine`) over the canonical tier and derived-status tuples carries the enum, and `content_type` gains an enum on the surface that carries it behind the same seam. In `description-schema.ts` the schema gains closed `importance_tier` and `content_type` enums behind the same seam, tightens its `type` field and keeps `.passthrough()` so unrelated authored keys survive. A new `isSchemaEnumEnforceEnabled()` resolver in `search-flags.ts` wraps `isFeatureEnabled('SPECKIT_SCHEMA_ENUM_ENFORCE')` and selects the strict variant only when the flag is on, so the default-off path parses byte-identical to baseline. Each vocabulary lands as one named `as const` tuple, mirroring the existing `SAVE_LINEAGE_VALUES` shape, so the enum and any consumer share one source of truth. Under the flag a drifted or mistyped controlled value fails validation at parse time instead of persisting silently.

### Three closed producer paths

The phase will guard all three out-of-enum producer paths that feed `graphMetadataSchema.parse` in `graph-metadata-parser.ts`, not only `normalizeDerivedStatus`. The `normalizeDerivedStatus` default branch returns the raw normalized token at line 180, `deriveStatus` returns the literal `'unknown'` at line 1041 (outside `{complete, in_progress, planned}`) and `deriveImportanceTier` returns the unnormalized frontmatter tier at lines 1071-1079 (so a value like `high` would throw). With each mapped to a defined in-enum fallback, `deriveStatus` and `deriveImportanceTier` only ever emit in-enum values, so a freshly derived file always parses clean against the strict variant and never leaks an unknown source token into the schema.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Planned modify | Add the three `as const` vocabularies and the flag-gated strict enum variant for `importance_tier`, `status` and `content_type`, leaving the base fields free-string |
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts` | Planned modify | Add `importance_tier` and `content_type` enums behind the same flag seam, tighten `type`, keep `.passthrough()` and the per-field issue formatter |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Planned modify | Guard all three producer paths (`normalizeDerivedStatus` default, `deriveStatus` `'unknown'`, `deriveImportanceTier` raw tier) so the producer only emits in-enum values |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Planned modify | Add the `isSchemaEnumEnforceEnabled()` resolver wrapping `isFeatureEnabled('SPECKIT_SCHEMA_ENUM_ENFORCE')` so the strict path is reachable only when the flag is on |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The enums will land in the warn tier so the legacy corpus never hard-breaks, and the error flip is handed to A4 under the parent phase `002`. The planned proof is a passing and a failing fixture for each constrained field plus a derive-then-parse round trip over a real packet that produces only in-enum values with zero re-index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the `SAVE_LINEAGE_VALUES` constant-then-enum shape | The pattern ships in the same file, so one named tuple per vocabulary feeds the enum and any consumer from a single source |
| Gate the enum behind a flag seam rather than baking a bare `z.enum` into the base schema | The base schema is parsed unconditionally at five `graphMetadataSchema.parse` sites, so only a dual free-string/strict schema or a flag-gated `superRefine` selected by `isSchemaEnumEnforceEnabled()` keeps the default-off path byte-identical to baseline |
| Land the enums in warn, hand the error flip to A4 | A4 consumes these enums for its count-to-zero flip, so the legacy corpus stays unbroken while this phase only tightens the schema shape |
| Source the content_type vocabulary from the live doc-type axis | Inventing values would drift the very field the enum is meant to guard, so the set is confirmed at build time not fabricated |
| Guard all three producer paths rather than only the default | `deriveStatus` `'unknown'` and the unnormalized `deriveImportanceTier` raw tier also feed the strict parse, so guarding only `normalizeDerivedStatus` would still let a derived file throw on real packets |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet.

| Check | Result |
|-------|--------|
| With the flag on, an out-of-enum `importance_tier`, `status`, or `content_type` fixture fails on both schemas | PLANNED, not yet run |
| An in-enum fixture passes on both schemas, and with the flag off an out-of-enum fixture parses byte-identical to baseline | PLANNED, not yet run |
| A derive-then-parse round trip over real packets exercising all three producer paths produces only in-enum values | PLANNED, not yet run |
| A description fixture with extra authored keys still parses | PLANNED, not yet run |
| An out-of-enum value yields a precise per-field message through `formatDescriptionSchemaIssues` | PLANNED, not yet run |
| No bare `z.enum` baked into the base schema, the enum runs only through the `isSchemaEnumEnforceEnabled()` seam | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Open content_type vocabulary.** The canonical `content_type` set must be confirmed from the live doc-type axis at build time before the enum is frozen. The `MemoryTypeName` record axis is a different field and must not be borrowed.
3. **Open schema-placement question.** Whether the description schema should also carry `status` or whether status stays graph-metadata-only is unresolved, pending the parent slate decision.
<!-- /ANCHOR:limitations -->

---
