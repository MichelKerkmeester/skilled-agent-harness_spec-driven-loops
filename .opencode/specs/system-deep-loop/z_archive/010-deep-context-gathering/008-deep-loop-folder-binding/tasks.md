---
title: "Tasks: Fix deep-loop spec-folder binding: extract a named spec-folder path from the positional scope and add a fail-closed standalone guard across the /deep:* command family [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "deep loop folder binding"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/010-deep-context-gathering/008-deep-loop-folder-binding"
    last_updated_at: "2026-06-07T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete"
    next_safe_action: "Commit via sk-git when ready"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-fix-008-deep-loop-folder-binding"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fix deep-loop spec-folder binding: extract a named spec-folder path from the positional scope and add a fail-closed standalone guard across the /deep:* command family

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

- [x] T001 Locate root cause across skill/command/agent (two Explore passes + source confirmation)
- [x] T002 Choose fix scope = whole /deep:* family
- [x] T003 [P] Allocate tracking packet 029 (Level 2)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add scope-extract Tier-1 source + fail-closed guard (auto_mode_contract.md §1/§3)
- [x] T005 deep-context: spec_folder row + §0 bind-from-scope + Q1 option E guard (start-context-loop.md)
- [x] T006 deep-context: preflight fail-closed (deep_start-context-loop_auto.yaml + _confirm.yaml)
- [x] T007 [P] deep-context: host-guard line (SKILL.md + loop_protocol.md)
- [x] T008 [P] Sibling parity rows (start-research-loop.md + start-review-loop.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Dry-run original failing scope through patched §0 (binds 026, output 026/context/)
- [x] T010 Edge cases: symlink form, trailing punctuation, no-match fall-through
- [x] T011 validate.sh --strict on 029; update spec/plan/tasks/checklist/summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (dry-run + validate)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
