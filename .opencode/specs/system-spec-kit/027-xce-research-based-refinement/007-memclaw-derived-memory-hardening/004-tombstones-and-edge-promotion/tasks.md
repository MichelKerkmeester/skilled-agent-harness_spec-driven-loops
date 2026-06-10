---
title: "Tasks: Phase 4: tombstones-and-edge-promotion [template:level_1/tasks.md]"
description: "Completed task list for default-off tombstone gating, skip-manual causal-edge promotion, active/purgeable partial indexes, and entity-not-causal documentation."
trigger_phrases:
  - "tombstone soft-delete idempotent deleted_at tasks"
  - "causal edge promotion skip manual created_by"
  - "active purgeable partial index split"
  - "entity co-occurrence not causal truth invariant"
  - "tombstones edge promotion phase tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion"
    last_updated_at: "2026-06-10T14:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Marked delivered tombstone phase tasks"
    next_safe_action: "Keep tombstone flag off until recall filters land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-tombstones-and-edge-promotion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: tombstones-and-edge-promotion

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Add active (`deleted_at IS NULL`) and purgeable (`deleted_at IS NOT NULL`) partial indexes + forward migration; schema version remains 37 (`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Keep default single-row delete on the existing hard-delete path; COALESCE-preserve the first tombstone timestamp only when `SPECKIT_SOFT_DELETE_TOMBSTONES=true` (`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`)
- [x] T003 Apply the same default-off tombstone gate and first-timestamp idempotence to the bulk delete path (`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`)
- [x] T004 Make `insertEdge` natural-key idempotent and skip-manual: on a natural-key match against a manual row, never overwrite `created_by`/evidence (`.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`)
- [x] T005 Record the entity-not-causal invariant as a constitutional rule: entity/co-occurrence signals are recall evidence only, never causal truth (`.opencode/skills/system-spec-kit/constitutional/entity-cooccurrence-is-not-causal.md`)
- [x] T006 Gate retention sweep partitioning: active expired rows reap by default; purgeable partition is used only when tombstones are enabled (`.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P] Unit-test default hard-delete and flag-on tombstone idempotence: repeated single and bulk delete preserve the first `deleted_at` only when the flag is enabled (`.opencode/skills/system-spec-kit/mcp_server/tests/causal-edge-tombstones.vitest.ts`)
- [x] T008 [P] Unit-test edge skip-manual: an auto promotion against a manual edge never overwrites `created_by`/evidence (`.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges-write-safety.vitest.ts`)
- [x] T009 Update docs to describe default-off tombstones, the recall-filter follow-up, skip-manual edge rule, and entity-not-causal invariant (`implementation-summary.md`, `spec.md`, `plan.md`, `checklist.md`, `ENV_REFERENCE.md`)
- [x] T010 Source-based verification: tsc passed, targeted vitest passed 4 files and 48 tests, and spec validation passed (`tsconfig.json`, `vitest`, `validate.sh`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Requested source-based verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
