---
title: "Task Breakdown: Preflight Hook"
description: "Task-level record of the preflight advisory hook phase."
trigger_phrases:
  - "git preflight hook"
  - "sk-git advisory hook"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/003-preflight-hook"
    last_updated_at: "2026-07-27T23:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Built and registered the preflight advisory hook"
    next_safe_action: "Phase 004 measures the fire rate"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Task Breakdown: Preflight Hook

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[~]` blocked
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Read the proven sibling hook and its output contract
- [x] T-002 Confirm the existing PreToolUse Bash group and its shape
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 Hook with a shape fast-exit before any git call
- [x] T-004 Three suppression tiers resolved from the environment
- [x] T-005 Advisory line naming the invoked subcommand
- [x] T-006 Output cap with an explicit note when truncating
- [x] T-007 Register as the third entry in the existing Bash group
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-008 Fires on the real directory-scoped commit failure
- [x] T-009 Silent on an ordinary commit
- [x] T-010 Silent on a non-git command
- [x] T-011 Global kill silences it
- [x] T-012 Per-rule opt-out silences it
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Complete: five end-to-end payload cases behave as specified, and the hook never emits a permission decision.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Rules: `../002-rule-encoding/`
- Noise measurement: `../004-pathspec-integrity/`
<!-- /ANCHOR:cross-refs -->
