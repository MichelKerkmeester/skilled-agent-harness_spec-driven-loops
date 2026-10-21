---
title: "Tasks: Phase 53: final-commit-live-proof"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "final commit live proof tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 53: final-commit-live-proof

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

- [x] T001 Fast-forward worktree `196-v1-default-llmgateway` to origin/main `dfdc523af5`
- [x] T002 Extract each scenario's own `Exact Command Sequence` block from the 17 `plugin-utilization` files, to be run unchanged (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the 17 blocks in sequence on OpenCode 1.19.3 and 2.0.32 between 21:14 and 21:25 UTC; every block exits 0 (`scratch/live-runs/summary.txt`)
- [x] T004 Read each cell's verdict from the evidence files per version, never from the model's reply or from `summary.txt` alone (`scratch/live-runs/`, `scratch/live-runs/effects/`)
- [x] T005 Rerun the `system-completion-sentinel` block unchanged at 21:24 UTC, after the first pass exited 0 without writing an advisory: the model's disclaimer after the fixture sentence pushed the claim outside the sentinel's 160-character tail (`scratch/live-runs/system-completion-sentinel.rerun1.txt`)
- [x] T006 Write the matrix with the totals, the rerun note, the kill-switch line and the shared-service line (`scratch/live-runs/results-matrix.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Check that no evidence file contains the llmgateway key (0 matches across the scenario logs and the effect and exit files)
- [x] T008 Confirm every v2 run used `--standalone` and PID 46220 was never stopped, started or attached to (`scratch/live-runs/summary.txt`)
- [x] T009 Fill this phase's four docs and add the parent map and handoff rows for 053 (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `../spec.md`)
- [x] T010 Run strict validation of this folder: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/053-final-commit-live-proof --strict` - `RESULT: PASSED`
- [ ] T011 Push to main
- [ ] T012 Record CI on the pushed commit (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [ ] T011 and T012 stay open for the orchestrator: push to main, then record CI on the pushed commit
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Live matrix**: See `scratch/live-runs/results-matrix.md`
<!-- /ANCHOR:cross-refs -->

---
