---
title: "Tasks: Phase 6: research-lineage-reducer-path"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "research lineage reducer path tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: research-lineage-reducer-path

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

- [x] T001 Capture the baseline: 8 test files, 84 tests passing; compiled contract in sync
- [x] T002 Score and tighten both delegate briefs through the prompt-improver (Sonnet; Opus is barred by the agent definition). Brief 1 scored 36/50, brief 2 34/50; fixes applied: lineage strategy file, js-yaml path, confirm-file insertion point
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Delegate 1 (Haiku 5.5, max): reducer `--artifact-dir` flag and unit test (`deep-research/scripts/reduce-state.cjs`)
- [x] T004 Review delegate 1 diff and rerun its checks: `node --check` exit 0; missing value exits 1 with `--artifact-dir requires a path value`; reducer test file 22/22 (baseline 21 + 1)
- [x] T005 Delegate 2 (Haiku 5.5, max): workflow wiring and contract regeneration (`deep-research-auto.yaml`, `deep-research-confirm.yaml`)
- [x] T006 Review delegate 2 diff and rerun its checks: 5 per-iteration calls carry the argument, 4 synthesis calls unchanged; contract in sync
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Rerun the full baseline test set: 85/85 (84 + the new case), no regressions
- [x] T008 Run the reducer with `--artifact-dir` on the stale lineage from the 2026-10-09 Ponytail run: exit 0, `iterationsCompleted` 10, corruption 0; lineage registry rewritten 15:27 -> 16:19 and dashboard created; base research folder untouched
- [x] T009 Run `validate.sh --strict` on this folder
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



