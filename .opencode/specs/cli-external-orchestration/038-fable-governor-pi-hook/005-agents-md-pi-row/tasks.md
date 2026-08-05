---
title: "Tasks: AGENTS.md Pi Row"
description: "Check coordination, add row, verify."
trigger_phrases:
  - "AGENTS.md pi row tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Tasks authored"
    next_safe_action: "T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: AGENTS.md Pi Row

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Check agents/002-runtime-surface-coverage T001 state (six-runtime table)
  - [evidence: `grep -n ".pi/agents" AGENTS.md` returned 0 before the change — 002 packet T001 not yet executed; coordination noted]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add Pi → `.pi/agents/` row to AGENTS.md §8 if absent
  - [evidence: row added at `AGENTS.md:479`: `| **Pi**            | `.pi/agents/`       |` matching sibling formatting]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T003 grep AGENTS.md: exactly one pi row; sibling formatting matched
  - [evidence: `grep -c ".pi/agents" AGENTS.md` = 1; `git diff` shows only the single insertion; `git diff --check` clean]
- [x] T004 Run validate.sh --strict on this folder
  - [evidence: `validate.sh --strict` on this folder — PASSED (Errors: 0, Warnings: 0)]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]`
  - [evidence: `grep -c "\[x\]" tasks.md` matches task count; completion verified via `validate.sh --strict`]
- [x] validate.sh --strict exits 0
  - [evidence: `bash validate.sh <folder> --strict` — RESULT: PASSED, 0 errors 0 warnings]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
