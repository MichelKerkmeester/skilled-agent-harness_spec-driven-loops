---
title: "Tasks: Review Drift Remediation"
description: "Task breakdown for reconciling the 036 parent's documentation and metadata drift, all complete with evidence from the current working-tree diff."
trigger_phrases:
  - "review drift remediation tasks"
  - "children_ids reconciliation task"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup/002-review-drift-remediation"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "markdown-agent"
    recent_action: "Checked off all tasks with evidence from git diff and validate.sh output"
    next_safe_action: "None; packet complete, no follow-up required"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Review Drift Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> All tasks complete. The reconciliation landed as working-tree edits; evidence below is reproduced from `git diff`/`git status` and `validate.sh` output captured during this documentation pass.

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

- [x] T001 Enumerate on-disk `[0-9]{3}-*` children under the parent
  - **Evidence**: 44 folders listed via `ls specs/system-deep-loop/036-deep-loop-innovation`.
- [x] T002 [P] Diff parent `graph-metadata.json.children_ids` against the on-disk census
  - **Evidence**: `git diff` showed 38→44, missing `051`-`056`.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Extend `graph-metadata.json.children_ids` to all 44 on-disk children [REQ-001]
  - **Evidence**: `git diff specs/system-deep-loop/036-deep-loop-innovation/graph-metadata.json` shows `051`-`056` appended.
- [x] T004 Refresh `spec.md` PHASE DOCUMENTATION MAP rows/statuses from each child's `derived.status` [REQ-002]
  - **Evidence**: `git diff specs/system-deep-loop/036-deep-loop-innovation/spec.md` shows updated statuses (e.g. 003 Planned→Complete, 019/020 Planned→Complete, 033 row added) and the new "Map maintenance" note.
- [x] T005 Drop legacy `065` child-alias duplicates from `004`, `006`-`014` [REQ-003]
  - **Evidence**: `git diff specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/graph-metadata.json` shows 3 `system-deep-loop/065-deep-loop-innovation/...` lines removed; `git status` confirms the same 10 folders (`004`,`006`-`014`) as modified.
- [x] T006 Reconcile `029` status contradiction [REQ-004]
  - **Evidence**: `029/spec.md:70` and `029/implementation-summary.md:42` both read "Complete (13/13 findings landed...)".
- [x] T007 Update `handover.md` framing and mark superseded narrative
  - **Evidence**: `git diff specs/system-deep-loop/036-deep-loop-innovation/handover.md` shows the "17-phase" framing replaced and a "Superseded narrative" callout added around the stale 2026-08-08 block.
- [x] T008 Update `manifest/phase-tree.json` framing
  - **Evidence**: `git diff` shows `live_direct_children: 44` and `original_program_range: "001-017"` fields added, plus a corresponding note.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `validate.sh <parent> --strict`, confirm the parent's own report shows Errors: 0
  - **Evidence**: Parent-only block in the captured output: `Summary: Errors: 0  Warnings: 2` (warnings are `FRONTMATTER_MEMORY_BLOCK` and `PHASE_LINKS`, unrelated to this packet's scope).
- [x] T010 Confirm the child manifest control fires and is reachable
  - **Evidence**: `Child manifest accepted: 40 entries (sha256: f6cf1e943d...)` printed at the top of the `validate.sh` run.
- [x] T011 Confirm `GRAPH_METADATA_CHILD_DRIFT` passes on the parent
  - **Evidence**: `+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children` in the parent's own check block.
- [x] T012 Author host packet documentation (spec, plan, tasks, implementation-summary) to Level 1
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` created/completed in this documentation pass.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
  - **Evidence**: T001-T012 above.
- [x] No `[B]` blocked tasks remaining
  - **Evidence**: No `[B]` markers present in this file.
- [x] Parent's own strict check reports Errors: 0 with the manifest control firing
  - **Evidence**: T009-T011 above.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md` and `../graph-metadata.json`

<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
