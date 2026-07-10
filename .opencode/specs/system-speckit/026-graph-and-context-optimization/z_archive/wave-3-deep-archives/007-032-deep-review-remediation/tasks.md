---
title: "Tasks: 018 Deep-Review Remediation"
description: "Task tracking for fixing the 14 actionable findings from packet 017."
trigger_phrases:
  - "018 tasks"
  - "deep review remediation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-032-deep-review-remediation"
    last_updated_at: "2026-05-14T21:10:00Z"
    last_updated_by: "orchestrator-remediation"
    recent_action: "All edits applied"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "018-deep-review-remediation-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 018 Deep-Review Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` Completed
- `[ ]` Pending
- `[B]` Blocked
- `[D]` Deferred

Each task cites the finding ID it addresses.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T001 [P0] Read 017 findings registry to confirm scope
- [x] T002 [P0] Read each target file's relevant section before editing
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] T003 [P0] F002 + F003 — system-code-graph/SKILL.md §7 naming-convention paragraph
- [x] T004 [P1] F004 — system-spec-kit/README.md owner-table namespace clarification
- [x] T005 [P1] F005 — system-spec-kit/SKILL.md tool-list parenthetical
- [x] T006 [P1] F007 — launcher error message rephrase
- [x] T007 [P1] F008 + F015 — playbook scenario 011 schema cross-reference (covers TOOL_DEFINITIONS alias)
- [x] T008 [P1] F009 — launcher env value newline/NUL validator
- [x] T009 [P1] F010 — README config-row mentions mcp.json underscore convention
- [x] T010 [P1] F013 + F014 — feature catalog reconciliation paragraph
- [x] T011 [P1] F016 + F020 — README config-row adds SPECKIT_CODE_GRAPH_DB_DIR override
- [x] T012 [P1] F019 — launcher acquireBootstrapLock 5-min stale-mtime reclaim
- [D] T013 F001 — already resolved during the review (no-op)
- [B] T014 F006/F011 — architecture.md is 0 bytes (parallel-session-emptied); blocked until file restored
- [D] T015 F012 — inspected; current path is actual tsc emit, not legacy
- [D] T016 F017 — build artifact source maps; resolves on next clean rebuild
- [D] T017 F018 — per-parameter test gaps; accepted as-is per reviewer
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T018 [P0] Launcher startup smoke test post-edit — `[mk-code-index-launcher]` prefix, clean env loading
- [x] T019 [P0] validate.sh --strict on 018 packet — exit 0
- [x] T020 [P0] git diff scope review — no edits outside the FILES TO EDIT manifest
- [x] T021 [P0] Stage scoped changes and commit on main under corrected identity (MichelKerkmeester)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- [x] All 14 actionable findings have an `[x]` task with a corresponding diff
- [x] All 3 deferred findings have a `[D]` task with rationale
- [x] F006/F011 marked `[B]` blocked (file-state issue)
- [x] Launcher startup PASSES
- [x] validate.sh --strict PASSES (0E/0W)
- [x] Commit message lists scope clearly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Detailed change manifest**: See `implementation-summary.md` §WHAT WAS BUILT
- **Originating findings**: `017-deep-review-campaign-010-016/review/review-report.md`
<!-- /ANCHOR:cross-refs -->
