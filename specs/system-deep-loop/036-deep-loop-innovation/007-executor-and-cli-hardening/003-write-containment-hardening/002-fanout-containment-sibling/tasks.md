---
title: "Tasks: fanout containment sibling lineage scope"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/003-write-containment-hardening/002-fanout-containment-sibling"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked landed containment tasks complete with evidence"
    next_safe_action: "Commit the packet doc closeout"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-042-fanout-containment-sibling"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: fanout containment sibling lineage scope

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Reproduce attribution bug from three-lane fan-out failure (`spec.md` §2)
- [x] T002 Confirm sole containment consumer is `fanout-run.cjs:2238`
- [x] T003 [P] Define `unattributableDirs` contract `write-containment.ts:56`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `unattributableDirs` option and repo-relative resolution `write-containment.ts:264`
- [x] T005 Exclude unattributable dirs from snapshot and detect `write-containment.ts:328`
- [x] T006 Compute `siblingLineageDirs` and pass on both worker calls `fanout-run.cjs:2605`
- [x] T007 Drop non-repo-relative and leaf-own-dir exclusions `write-containment.ts:282`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add concurrent-sibling regression block `write-containment.vitest.ts:459`
- [x] T009 Cover outside-root, no-op, and genuine-repo cases `write-containment.vitest.ts:523`
- [x] T010 Run suite green — `vitest` 22/22 passing
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

