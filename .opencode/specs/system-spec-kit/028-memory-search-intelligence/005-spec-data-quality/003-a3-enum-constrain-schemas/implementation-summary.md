---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will constrain importance_tier status and content_type to closed zod enums in both JSON metadata schemas and close the leaky producer default. No code change has landed."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/003-a3-enum-constrain-schemas"
    last_updated_at: "2026-06-21T00:00:00Z"
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
| **Spec Folder** | 003-a3-enum-constrain-schemas |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Closed enums on the JSON metadata schemas

The phase will replace the free-string controlled-vocabulary fields in the two zod metadata schemas with closed enums. In `graph-metadata-schema.ts` the `importance_tier` and `status` fields move from `z.string().min(1)` to `z.enum(...)` over the canonical tier and derived-status tuples, and `content_type` gains an enum where the derived block carries it. In `description-schema.ts` the schema gains closed `importance_tier` and `content_type` enums, tightens its `type` field, and keeps `.passthrough()` so unrelated authored keys survive. Each vocabulary lands as one named `as const` tuple, mirroring the existing `SAVE_LINEAGE_VALUES` shape, so the enum and any consumer share one source of truth. After the swap a drifted or mistyped controlled value fails validation at parse time instead of persisting silently.

### A closed producer default

The phase will close the `normalizeDerivedStatus` default branch in `graph-metadata-parser.ts`, which today returns the raw normalized token at lines 179-180. With the default closed to a defined fallback, `deriveStatus` and `deriveImportanceTier` only ever emit in-enum values, so a freshly derived file always parses clean against its own enums and never leaks an unknown source token into the schema.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Planned modify | Add the three `as const` vocabularies, swap `importance_tier` and `status` to `z.enum(...)`, add the `content_type` enum |
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts` | Planned modify | Add `importance_tier` and `content_type` enums, tighten `type`, keep `.passthrough()` and the per-field issue formatter |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Planned modify | Close the `normalizeDerivedStatus` default so the producer only emits in-enum values |
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
| Land the enums in warn, hand the error flip to A4 | A4 consumes these enums for its count-to-zero flip, so the legacy corpus stays unbroken while this phase only tightens the schema shape |
| Source the content_type vocabulary from the live doc-type axis | Inventing values would drift the very field the enum is meant to guard, so the set is confirmed at build time not fabricated |
| Close the producer default rather than leak raw | A closed `normalizeDerivedStatus` default keeps a freshly derived file always parsing clean against its own enums |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet.

| Check | Result |
|-------|--------|
| An out-of-enum `importance_tier`, `status`, or `content_type` fixture fails on both schemas | PLANNED, not yet run |
| An in-enum fixture passes on both schemas | PLANNED, not yet run |
| A derive-then-parse round trip over a real packet produces only in-enum values | PLANNED, not yet run |
| A description fixture with extra authored keys still parses | PLANNED, not yet run |
| An out-of-enum value yields a precise per-field message through `formatDescriptionSchemaIssues` | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Open content_type vocabulary.** The canonical `content_type` set must be confirmed from the live doc-type axis at build time before the enum is frozen. The `MemoryTypeName` record axis is a different field and must not be borrowed.
3. **Open schema-placement question.** Whether the description schema should also carry `status` or whether status stays graph-metadata-only is unresolved, pending the parent slate decision.
<!-- /ANCHOR:limitations -->

---
