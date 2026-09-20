---
title: "Task Breakdown: Pathspec Integrity"
description: "Task-level record of the noise measurement phase."
trigger_phrases:
  - "advisory noise audit"
  - "git advisory fire rate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/004-pathspec-integrity"
    last_updated_at: "2026-07-27T23:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Measured the real fire rate with a control group"
    next_safe_action: "Operator reviews the packet"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Task Breakdown: Pathspec Integrity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[~]` blocked
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Confirm the pathspec failure is covered by an existing rule and its reproduction
- [x] T-002 Choose ordinary shapes weighted to real reflog prevalence
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 Replay and report per-rule and aggregate rates
- [x] T-004 Control group of shapes that must fire
- [x] T-005 Refuse a verdict when no rules are loaded
- [x] T-006 Refuse a verdict when no control shape fires
- [x] T-007 Resolve probe paths from the target repository
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-008 Build worktree measured
- [x] T-009 Dirty repository with untracked files measured
- [x] T-010 Repository with no rules loaded refuses a verdict
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Complete: 0 of 25 ordinary commands fire in both measured repositories, 5 of 5 control shapes fire, and the no-rules case exits non-zero without a verdict.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Rules and their reproductions: `../002-rule-encoding/`
- Budget source: `../001-advisory-research/research.md`
<!-- /ANCHOR:cross-refs -->
