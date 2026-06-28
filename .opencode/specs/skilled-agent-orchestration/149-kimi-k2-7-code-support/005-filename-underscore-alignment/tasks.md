---
title: "Tasks: Phase 5: filename-underscore-alignment [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "filename underscore alignment tasks"
  - "phase 005 tasks"
  - "rename git mv reference update"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-kimi-k2-7-code-support/005-filename-underscore-alignment"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Renamed 7 targets (git mv), repaired ~27 live reference files, drift guard exit 0"
    next_safe_action: "Phase complete; strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/assets/model_profiles.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-005-filename-underscore-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: filename-underscore-alignment

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

> Map the rename set and confirm the drift-guard coupling, then rename.

- [x] T001 Map the 7 rename targets and every live inbound reference; confirm `check-prompt-quality-card-sync.sh` couples model-profile filenames to the dashed model id
- [x] T002 `git mv` the 5 markdown files dash to underscore (sk-prompt-models assets + references)
- [x] T003 [P] `git mv` the 2 JSON assets to `model_profiles.json` and `per_model_budgets.json`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Repair every live reference.

- [x] T004 Replace the 6 unique filenames across the live file list (extension-anchored)
- [x] T005 Path-qualified replace for `sk-prompt-models/references/context-budget.md`; two targeted same-skill link edits (SKILL.md, pattern_index.md); leave cli-opencode's own file
- [x] T006 Update the functional drift-guard `json.load` path to `model_profiles.json` (check-prompt-quality-card-sync.sh)
- [x] T007 Reconcile parent 154 phase map (phase-5 row) and `children_ids` (graph-metadata.json)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Prove nothing dangles.

- [x] T008 Run the drift guard (exit 0) and the live-wiring stale-reference grep (zero hits except the cli-opencode context-budget keep)
- [x] T009 Confirm `git status` shows renames (R) and both renamed JSONs parse
- [x] T010 Strict-validate this phase; reconcile completion metadata
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
