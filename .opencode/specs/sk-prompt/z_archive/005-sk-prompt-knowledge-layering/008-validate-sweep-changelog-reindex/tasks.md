---
title: "Tasks: Phase 8: validate-sweep-changelog-reindex [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "130 phase 8 tasks"
  - "validate sweep tasks"
  - "changelog reindex tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/005-sk-prompt-knowledge-layering/008-validate-sweep-changelog-reindex"
    last_updated_at: "2026-06-02T18:30:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "All tasks complete"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-validate-sweep-changelog-reindex-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: validate-sweep-changelog-reindex

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

- [x] T001 Confirm all 7 prior phases have populated implementation-summary.md files before starting sweep
- [x] T002 Identify which skill files were touched across phases 001-007 (used to scope changelog entries)
- [x] T003 [P] Confirm `check-prompt-quality-card-sync.sh` covers all 5 cli-* cards and path is correct
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run `validate.sh --strict` on the 008 child folder — exit 0 required before proceeding
- [x] T005 Run `check-prompt-quality-card-sync.sh` from repo root — confirm all 5 cli-* cards PASS and guard exits 0
- [x] T006 Verify `recommended_frameworks` field present on all 8 active small models in `sk-prompt/assets/model-profiles.json`
- [x] T007 Verify `profile_ref` in each model's `recommended_frameworks` resolves to an existing `.md` file under `sk-prompt-models/references/models/`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Populate phase-008 spec-folder docs: spec.md, plan.md, tasks.md, implementation-summary.md — no placeholders remaining
- [x] T009 Set `derived.status` to "complete" in `graph-metadata.json`; confirm valid JSON with `jq empty`
- [x] T010 Run final `validate.sh --strict` on 008 child — confirm exit 0
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
