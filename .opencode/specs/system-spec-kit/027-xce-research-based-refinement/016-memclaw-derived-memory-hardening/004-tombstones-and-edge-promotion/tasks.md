---
title: "Tasks: Phase 4: tombstones-and-edge-promotion [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
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
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion"
    last_updated_at: "2026-06-06T10:10:49Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Populate Phase 4 tombstones-and-edge-promotion task list"
    next_safe_action: "Plan or implement T001 active/purgeable partial indexes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-tombstones-and-edge-promotion"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Add active (`deleted_at IS NULL`) and purgeable (`deleted_at IS NOT NULL`) partial indexes + forward migration (`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 COALESCE-preserve the first tombstone timestamp on single-row soft-delete: `deleted_at = COALESCE(deleted_at, <now>)` inside the existing transaction (`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`)
- [ ] T003 Apply the same first-timestamp tombstone idempotence to the bulk soft-delete path (`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`)
- [ ] T004 Make `insertEdge` natural-key idempotent and skip-manual: on a natural-key match against a manual row, never overwrite `created_by`/evidence (skip the update, or add parallel low-strength evidence only) (`.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`)
- [ ] T005 Record the entity-not-causal invariant as a constitutional rule: entity/co-occurrence signals are recall evidence only, never causal truth (`.opencode/skills/system-spec-kit/constitutional/entity-cooccurrence-is-not-causal.md`)
- [ ] T006 Append an audit row for tombstone and edge-promotion mutations and report "skipped manual edge" / tombstone state via the auto-promotion callers (`.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 [P] Unit-test tombstone idempotence: a repeat delete (single and bulk) preserves the first `deleted_at` and does not extend retention (vitest) (`.opencode/skills/system-spec-kit/mcp_server/handlers/__tests__/memory-crud-delete.test.ts`)
- [ ] T008 [P] Unit-test edge skip-manual: an auto promotion against a manual edge never overwrites `created_by`/evidence (skips, or adds parallel low-strength evidence only) (vitest) (`.opencode/skills/system-spec-kit/mcp_server/lib/storage/__tests__/causal-edges.test.ts`)
- [ ] T009 Update the memory-system docs to describe first-timestamp tombstones, the skip-manual edge rule, and the entity-not-causal invariant (`.opencode/skills/system-spec-kit/mcp_server/README.md`)
- [ ] T010 Manual end-to-end verification: a repeat delete does not extend retention and `/memory:manage` / causal search reports "skipped manual edge" and tombstone state (`.opencode/commands/doctor/assets/doctor_memory.yaml`)
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

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

