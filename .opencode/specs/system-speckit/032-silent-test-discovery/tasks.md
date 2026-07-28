---
title: "Task Breakdown: Silent Test Discovery"
description: "Discovery runner and pre-push gate for the thirty-seven silently unrun test files."
trigger_phrases:
  - "silent test discovery docs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-silent-test-discovery"
    last_updated_at: "2026-07-28T08:20:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Built the runner and wired the report-only pre-push gate"
    next_safe_action: "Spec-kit repairs completion-state; then flip the gate to enforce"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-speckit-032"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Task Breakdown: Silent Test Discovery

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[~]` blocked
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Enumerate every `*.test.mjs` outside node_modules and worktrees
- [x] T-002 Time the full run and decompose the failures by cause
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 Runner with live-root scope and dialect partition
- [x] T-004 Honest exits: empty discovery, unparseable summary, missing vitest all non-zero
- [x] T-005 Pre-push gate, report-only default, enforce and skip flags
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-006 Main tree: 409/0 node:test, 56/9 vitest, runner exit 1
- [x] T-007 Pre-push syntax check passes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Complete when every discovered file is hosted by its own dialect and a failing suite is visible on every push. Enforcement is deliberately not a completion criterion here; it is gated on repairing what discovery found.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Runner: `.opencode/scripts/run-node-tests.mjs`
- Gate: `.opencode/scripts/git-hooks/pre-push`
<!-- /ANCHOR:cross-refs -->
