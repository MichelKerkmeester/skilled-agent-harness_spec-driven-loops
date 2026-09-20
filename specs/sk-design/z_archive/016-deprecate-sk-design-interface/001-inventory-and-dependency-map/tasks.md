---
title: "Tasks: sk-design reference inventory and dependency map"
description: "Task breakdown for the read-only inventory phase."
trigger_phrases:
  - "sk-design inventory tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/001-inventory-and-dependency-map"
    last_updated_at: "2026-08-19T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Marked all tasks complete; map produced"
    next_safe_action: "Author + execute phase 002 extraction via cli-devin"
    blockers: []
    key_files:
      - "dependency-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: sk-design reference inventory and dependency map

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm `rg`/`git grep` and repo root — done; switched to `git grep` after `rg` timed out on the full tree.
- [x] T002 Fix the reference-token set and bucket rules from `spec.md §3` / `plan.md §3`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the sweeps; captured totals — 5,354 tracked `sk-design` files; 305 out-of-tree pool.
- [x] T004 Classify every hit into one bucket — recorded in `dependency-map.md` §BUCKET COUNTS (78 frozen / 19 generated / 208 live-contract).
- [x] T005 Write `dependency-map.md` (classification table + per-bucket counts + live-contract action list).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Reconcile bucket sum against `git grep` totals (305 = 78 + 19 + 208 ±1 overlap).
- [x] T007 Confirm `git status` shows only this packet changed (map addition); ran `validate.sh --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] `dependency-map.md` present and reconciled
- [x] Read-only proven (`git status` vs baseline)
- [x] `validate.sh --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
