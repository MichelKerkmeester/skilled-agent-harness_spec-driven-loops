---
title: "Tasks: Document Composer 2.5 Max-Mode Absence in cli-cursor"
description: "Task breakdown for the three docs-only cli-cursor edits and the validate gate."
trigger_phrases:
  - "cursor composer max mode tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/051-cli-cursor-max-mode-doc"
    last_updated_at: "2026-08-19T19:25:45Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete; validate --strict PASSED Errors:0"
    next_safe_action: "Operator review, then commit"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-051-cli-cursor-max-mode-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Document Composer 2.5 Max-Mode Absence in cli-cursor

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Establish the finding by live probe — `cursor-agent --list-models` returns only `composer-2.5` + `composer-2.5-fast` (2/2 Composer ids), and `composer-2.5[context=1m]` → `Cannot use this model`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add "Use Composer max" refusal row to the `SKILL.md` override table (points at the two real ids, forbids `-max` substitution)
- [x] T003 Extend the `README.md` Composer clause with the no-`-max` (1M Max Mode) fact
- [x] T004 Add the "Max Mode = `-max` id" paragraph to `providers-and-models.md` §4, after the `[context=1m]` bracket-rejection line
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Confirm no runtime change — `git diff --stat` shows only 3 cli-cursor doc files (`4 insertions(+), 1 deletion(-)`), zero `.ts`/`.cjs`
- [x] T006 Run `validate.sh 051-cli-cursor-max-mode-doc --strict` → Errors:0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `T001`–`T006` marked `[x]`
- [x] Scoped `git diff` shows docs-only change (no allowlist id added/removed)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
