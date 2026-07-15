---
title: "Tasks: A4 Schema Warn to Error [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "schema warn to error"
  - "description shape"
  - "graph metadata shape"
  - "legacy grandfathered"
  - "zod schema validation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/004-schema-warn-to-error"
    last_updated_at: "2026-07-04T17:12:01.279Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase task breakdown for A4 schema warn-to-error scaffold"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-description-shape.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-shape.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: A4 Schema Warn to Error

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

- [ ] T001 Confirm `folderDescriptionSchema`, `graphMetadataSchema`, and `formatDescriptionSchemaIssues` are exported and importable (`description-schema.ts`, `graph-metadata-schema.ts`)
- [ ] T002 Choose the Node entry shape for the schema call, matching the existing `tsx_bin` resolution (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`)
- [ ] T003 [P] Capture the baseline failing count from a dry-run census over `.opencode/specs`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Replace the inline hand-rolled check with a `folderDescriptionSchema` call routed through `formatDescriptionSchemaIssues`, surfacing every issue as error (`.opencode/skills/system-spec-kit/scripts/rules/check-description-shape.sh`)
- [ ] T005 Replace the inline hand-rolled check with a `graphMetadataSchema` call, keeping the phase-parent `last_active_child_id` pointer check and promoting remaining warnings to error (`.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-shape.sh`)
- [ ] T006 Backfill every file the new schemas surface as failing, then re-measure the census to zero
- [ ] T007 Flip `severity` to `error` for `GRAPH_METADATA_SHAPE` and `DESCRIPTION_SHAPE` (`.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json`)
- [ ] T008 Delete `detect_legacy_grandfathered` (175-183), its declaration (41), its call site (1044), and all four `LEGACY_GRANDFATHERED` reads (912, 927, 935, 1062) (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Confirm a valid corpus passes `validate.sh --strict` with exit 0 and a malformed file reports an error not a warning
- [ ] T010 Add the regression proof that a deliberately corrupted scratch packet exits 2 under `--strict`, and grep `validate.sh` for zero `legacy_grandfathered` and `LEGACY_GRANDFATHERED` matches
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
