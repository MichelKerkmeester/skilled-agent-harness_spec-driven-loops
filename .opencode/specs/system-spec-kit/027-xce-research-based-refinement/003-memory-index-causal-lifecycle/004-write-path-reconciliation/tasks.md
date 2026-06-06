---
title: "Tasks: 027/006 Write Path Reconciliation"
description: "Task list for explicit statediff action planning and subscriber-based cache/hygiene reconciliation."
trigger_phrases:
  - "027 phase 006 tasks"
  - "statediff reconciliation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle/004-write-path-reconciliation"
    last_updated_at: "2026-06-04T00:00:00Z"
    last_updated_by: "gpt-5-5"
    recent_action: "Replaced scaffold defaults with statediff reconciliation tasks from continuation research."
    next_safe_action: "Design the action model before changing handlers."
    blockers: ["003-incremental-index-foundation should provide stable chunk ids and fingerprints first."]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-phase-006-research-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 027/006 Write Path Reconciliation

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

- [ ] T001 Confirm Phase 003 stable chunk keys are available or define whole-document fallback behavior.
- [ ] T002 Inventory inline reconciliation branches in `memory-index.ts`, `memory-save.ts`, `memory-bulk-delete.ts`, and `mutation-hooks.ts`.
- [ ] T003 Inventory entity-density, graph, alias, divergence, retention, and feedback hook consumers.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `mcp_server/lib/storage/statediff.ts` with typed action variants.
- [ ] T005 Add deterministic diff planning for insert, upsert, replace, delete, and no-op.
- [ ] T006 Add composite target support for parent rows and child projections.
- [ ] T007 Add target sink interfaces for memory index, embedding/cache, lexical rows, generated graph edges, and child projections.
- [ ] T008 Add action subscriber interface with target, action, source operation, and state-hash context.
- [ ] T009 Convert entity-density invalidation into an action subscriber.
- [ ] T010 Convert graph/degree/related cache clearing into action-specific subscribers.
- [ ] T011 Convert scan reconciliation to plan-before-write and preserve failed-replacement stale-delete guard.
- [ ] T012 Convert save reconciliation after semantic policy gates.
- [ ] T013 Convert bulk delete to delete action batches and subscriber notifications.
- [ ] T014 Update mutation feedback reporting for subscriber-based outcomes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Test all diff action variants and deterministic ordering.
- [ ] T016 Test no-op scan applies no durable writes.
- [ ] T017 Test failed replacement indexing does not apply stale delete actions.
- [ ] T018 Test save, scan, and bulk delete invalidate entity-density through subscribers.
- [ ] T019 Test graph cache subscribers fire only for relevant graph actions.
- [ ] T020 Run focused TypeScript tests.
- [ ] T021 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle/004-write-path-reconciliation --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Write paths produce explicit action batches before mutation where this phase owns the path.
- [ ] Cache and hygiene effects subscribe to applied actions rather than scattered handler-specific calls.
- [ ] Statediff is documented as reconciliation aid, not as an implicit source of semantic truth.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research Evidence**: `../research/research.md` iterations 048 and 060
<!-- /ANCHOR:cross-refs -->
