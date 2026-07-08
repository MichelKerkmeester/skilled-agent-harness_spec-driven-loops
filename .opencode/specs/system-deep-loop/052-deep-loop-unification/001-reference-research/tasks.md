---
title: "Tasks: Reference Research — Deep-Loop Unification"
description: "Task ledger for the 20-iteration multi-model deep-research fanout validating the deep-loop merge design."
trigger_phrases:
  - "deep loop unification research tasks"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/001-reference-research"
    last_updated_at: "2026-07-08T06:06:21.300Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Fanout complete, synthesized, applied to 002"
    next_safe_action: "Execute 002-hub-rename-and-runtime-nesting"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-001-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Reference Research — Deep-Loop Unification

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Smoke-test the `sonnet5` lineage at `count: 1` before committing all 5 replicas.
- [x] T002 Confirm no stale writer-lock files under `deep-loop-runtime/database/` before dispatch.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Dispatch the full 20-replica `/deep:research` fanout per plan.md's `--executors` payload.
- [x] T004 Monitor GLM-5.2 replicas for `maxRetries` exhaustion; degrade gracefully or manually re-dispatch as `mimo-v2.5-pro`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Confirm every completed replica reached `minIterations: 3`.
- [x] T006 Confirm all 3 lineages produced at least one completed replica.
- [x] T007 Synthesize `research/research.md` + `research/resource-map.md`.
- [x] T008 Feed findings back into child 002/003's plan.md as revisions where warranted.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] `validate.sh --strict` exits 0 for this folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
