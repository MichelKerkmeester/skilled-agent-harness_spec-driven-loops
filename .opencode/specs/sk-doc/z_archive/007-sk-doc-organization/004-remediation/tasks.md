---
title: "Tasks: Phase 4: remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "068/004 tasks"
  - "remediation tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/007-sk-doc-organization/004-remediation"
    last_updated_at: "2026-05-05T11:55:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored tasks.md after 3 fixes already applied"
    next_safe_action: "Author impl-summary, commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase4-authoring"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: remediation

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

- [x] T001 Read review-report.md and identify 4 target files
- [x] T002 Confirm on main branch (`git branch --show-current = main`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation (4 file edits)

- [x] T003 Fix P1-003-A — change `(../agents/command_template.md)` to `(../command_template.md)` at `.opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md:770`
- [x] T004 Fix iter4-F1 P2 — rewrite ASCII project-structure tree at `.opencode/skills/sk-doc/references/global/quick_reference.md:174-189` to reflect new flat layout (4 promoted items at assets/ root, no assets/agents/ line)
- [x] T005 Fix P2-003-A (file 1) — remove `assets/agents/` from illustrative example list at `.opencode/skills/sk-doc/assets/skill/skill_md_template.md:593`
- [x] T006 Fix P2-003-A (file 2) — remove `assets/agents/` from illustrative example list at `.opencode/skills/sk-doc/references/specific/skill_creation.md:56`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 `test -f .opencode/skills/sk-doc/assets/command_template.md` exits 0 (link target exists)
- [x] T008 `rg -c "assets/agents/" .opencode/skills/sk-doc/references/global/quick_reference.md` returns 0
- [x] T009 `rg -c "assets/agents/" .opencode/skills/sk-doc/assets/skill/skill_md_template.md` returns 0
- [x] T010 `rg -c "assets/agents/" .opencode/skills/sk-doc/references/specific/skill_creation.md` returns 0
- [x] T011 `bash validate.sh --strict` on parent 068 → exit 0, 0 errors, 0 warnings
- [x] T012 Active-scope residual rg → 0 hits
- [ ] T013 Stage 4 fix files + 004 spec docs + parent spec + graph-metadata
- [ ] T014 Commit: `feat(sk-doc): remediate review findings (068/004)`
- [ ] T015 Confirm `git branch --show-current = main`; no surviving feature branch
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T015 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] One terminal commit on main; packet 068 final
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent Spec**: See `../spec.md`
- **Predecessor**: `../003-verify-and-ship/implementation-summary.md`
- **Source of findings**: `../review/review-report.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
-->
