---
title: "Tasks: A3 Enum-Constrain JSON Metadata Schemas [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
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
    last_updated_by: "benchmark-spec-agent"
    recent_action: "Added benchmark, test and default-safety tasks to Phase 3"
    next_safe_action: "Hold for implementation, no task has started yet"
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
# Tasks: A3 Enum-Constrain JSON Metadata Schemas

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the field lines, the `SAVE_LINEAGE_VALUES` constant-then-enum pattern, and the `formatDescriptionSchemaIssues` message path (`graph-metadata-schema.ts`, `description-schema.ts`)
- [ ] T002 Confirm the canonical `content_type` vocabulary from the live doc-type axis at build time, not the `MemoryTypeName` record axis
- [ ] T003 [P] Confirm the derived-status set against `normalizeDerivedStatus` outputs (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the three `as const` vocabularies and swap `importance_tier` and `status` to `z.enum(...)`, adding `content_type` where the derived block carries it (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`)
- [ ] T005 Add closed `importance_tier` and `content_type` enums, tighten `type`, and keep `.passthrough()` (`.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts`)
- [ ] T006 Wire the out-of-enum message through `formatDescriptionSchemaIssues` so a failing parse names the field and its allowed set (`.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts`)
- [ ] T007 Close the `normalizeDerivedStatus` default branch so an unknown derived token maps to a defined fallback (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T008 Cite the `content_type` source vocabulary in a code comment that states the durable WHY with no artifact id (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Confirm an out-of-enum `importance_tier`, `status`, or `content_type` fixture fails while an in-enum fixture passes on both schemas
- [ ] T010 Run a derive-then-parse round trip over a real packet with a malformed source status, confirm an in-enum status parses clean, and confirm a description fixture with extra authored keys still passes while an out-of-enum tier fails
- [ ] T011 Author the named test asserting in-enum fixtures parse and out-of-enum fixtures fail with a per-field `formatDescriptionSchemaIssues` message for tier, status and content_type on both schemas (`.opencode/skills/system-spec-kit/mcp_server/tests/enum-constrain-schemas.vitest.ts`)
- [ ] T012 Capture the enum swap-precision benchmark, catch-rate 1.00 and false-reject-rate 0.00, then freeze the corpus conformance-count baseline through the warn-tier `GRAPH_METADATA_SHAPE` and `DESCRIPTION_SHAPE` rules and hand the count-to-zero to A4 (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`)
- [ ] T013 Prove flags-off byte-identical parse with `SPECKIT_SCHEMA_ENUM_ENFORCE` off and register the flag in the flag-ceiling drift guard (`.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
