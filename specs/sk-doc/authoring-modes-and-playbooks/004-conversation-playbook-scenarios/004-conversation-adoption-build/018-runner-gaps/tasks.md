---
title: "Tasks: Phase 18: runner-gaps"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "runner gaps tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 18: runner-gaps

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Collect any gap the other phases recorded. Verify: `rg -l 'runner-gaps' ../0*/implementation-summary.md` lists them.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 [P] Probe the Cursor, Hermes and Aside interactive screens in a private tmux socket. Verify: one screen capture per runtime under `scratch/probes/`.
- [ ] T003 Sketch the `fork` and product-restart actions against the runner's action contract. Verify: both sketches are in the design note.
- [ ] T004 Write `scratch/runner-gaps-design.md`. Verify: it names a build-or-skip recommendation for all six gaps.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Ask the operator for each decision and record it. Verify: `decision-record.md` holds one row per gap.
- [ ] T006 Validate this phase. Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] No tmux probe socket left running
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
