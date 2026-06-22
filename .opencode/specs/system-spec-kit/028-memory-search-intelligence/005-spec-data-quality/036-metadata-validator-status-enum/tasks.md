---
title: "Tasks: Generated-Metadata Validator and Status Enum [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "generated metadata validator"
  - "derived status enum boundary"
  - "graph metadata integrity rule"
  - "stop preserving bad statuses"
  - "status enum schema close"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/036-metadata-validator-status-enum"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Listed build tasks for the enum, the integrity rule and the re-derive"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/scripts/rules/"
      - ".opencode/skills/system-spec-kit/scripts/rules/validator-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-036-metadata-validator-status-enum"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Generated-Metadata Validator and Status Enum

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

- [ ] T001 Confirm the shared Zod schemas cover `description.json` and `graph-metadata.json` and can back the integrity rule (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`)
- [ ] T002 Confirm the rule registry and strict-mode pathway accept a new error-level rule and a grandfather report mode flag (`.opencode/skills/system-spec-kit/scripts/rules/validator-registry.json`)
- [ ] T003 [P] Enumerate the current `derived.status` values the closed enum must admit from the existing normalizer cases (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T004 [P] Decide the default-off flag name and the grandfather report mode shape for the integrity rule and the re-derive path
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add `GRAPH_METADATA_STATUS_VALUES` and switch `derived.status` to `z.enum` so a prose value fails parse at the boundary (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`)
- [ ] T006 Change `normalizeDerivedStatus` so the default branch returns an enum value or null reading the shared const, removing the prose leak (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T007 Add the `GENERATED_METADATA_INTEGRITY` rule bridge validating both JSON files through the shared schemas plus the path-prefix and enum invariants (`.opencode/skills/system-spec-kit/scripts/rules/`)
- [ ] T008 Register `GENERATED_METADATA_INTEGRITY` as an error in strict mode behind the grandfather report mode flag (`.opencode/skills/system-spec-kit/scripts/rules/validator-registry.json`)
- [ ] T009 Change the parser so a missing `implementation-summary.md` preserves an existing status only when it is already an enum value, otherwise re-derives or falls back to `planned` plus a review flag (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Add the vitest proving the enum close, the normalizer null return, the integrity verdict and the legacy re-derive behind the flag (`.opencode/skills/system-spec-kit/scripts/tests/`)
- [ ] T011 Confirm a strict run over a prose-status or prefixed-path fixture errors from the integrity rule, a clean fixture passes, the grandfather arm warns rather than blocks, and a non-enum legacy status with no `implementation-summary.md` re-derives or falls back to `planned` plus a review flag
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
