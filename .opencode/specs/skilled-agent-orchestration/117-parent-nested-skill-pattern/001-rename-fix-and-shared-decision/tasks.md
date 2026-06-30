---
title: "Tasks: Fix the four-folder rename and record the shared/ decision"
description: "Tasks for phase 001 of the parent-nested-skill-pattern epic: the deterministic reference sweep from the four old bare packet paths to their deep- prefixed names, verification, and the shared/-stays decision."
trigger_phrases:
  - "deep-loop-workflows rename fix tasks"
  - "parent-nested-skill-pattern phase 001 tasks"
  - "deep- prefix sweep tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/117-parent-nested-skill-pattern/001-rename-fix-and-shared-decision"
    last_updated_at: "2026-06-15T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored task list for the rename-fix phase"
    next_safe_action: "Validate and commit scoped"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-001-rename-fix-and-shared-decision-tasks"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Fix the four-folder rename and record the shared/ decision

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Confirm the four on-disk renames and that `ai-council` is unchanged
- [x] T002 Capture a baseline match count for the old bare paths (zero-match guard)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 Repoint `mode-registry.json` packet keys (4) to the `deep-` prefixed names. (`.opencode/skills/deep-loop-workflows/mode-registry.json`)
- [x] T002 Rewrite the `/deep:*` command YAML assets referencing the four old packet paths. (`.opencode/commands/deep/assets/`)
- [x] T003 Fix `buildLoopPrompt` SKILL.md paths for context/research/review. (`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`)
- [x] T004 Update hub `graph-metadata.json` `key_files` + hub `SKILL.md` + `README.md`. (`.opencode/skills/deep-loop-workflows/`)
- [x] T005 Per-packet internal doc sweep across the four renamed packets, slash form (388 files). (`.opencode/skills/deep-loop-workflows/deep-*/`)
- [x] T006 Bare-form straggler sweep for quote-terminated refs (3 files). (`.opencode/skills/deep-loop-workflows/deep-*/`)
- [x] T007 Fix the cross-reference straggler outside the packet file-lists (3 refs in 1 file). (`.opencode/skills/cli-opencode/references/destructive_scope_violations.md`)
- [x] T008 Author the `shared/`-stays decision record. (`decision-record.md`)
- [x] T009 Refresh phase metadata and run strict validation. (`description.json`, `graph-metadata.json`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Broken-ref grep over live surfaces returns 0 (slash + bare forms)
- [x] T011 Packet `.cjs` require-resolution check passes for all packet scripts
- [x] T012 `deep-loop-runtime` vitest green modulo the documented pre-existing loop-lock flake
- [x] T013 Advisor `skill_graph_scan` clean (no rejected edges from this change)
- [x] T014 `validate.sh --strict` on this phase folder
- [x] T015 Commit scoped (`git commit --only -- <phase + swept paths>`)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation + verification tasks marked `[x]` (T009/T014/T015 closed out this turn).
- [x] No `[B]` blocked tasks remaining.
- [x] Broken-ref grep returns 0 in live surfaces.
- [x] `validate.sh --strict` green.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision**: See `decision-record.md`
- **Parent**: `../spec.md`

<!-- /ANCHOR:cross-refs -->
