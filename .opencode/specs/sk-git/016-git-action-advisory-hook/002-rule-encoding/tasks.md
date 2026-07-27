---
title: "Task Breakdown: Rule Encoding"
description: "Task-level record of the rule encoding phase."
trigger_phrases:
  - "git hard rules encoding"
  - "sk-git advisory rules"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/002-rule-encoding"
    last_updated_at: "2026-07-27T23:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Encoded ten state-gated rules and extended the shared evaluator"
    next_safe_action: "Phase 003 wires the hook"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Extend the shared evaluator additively rather than build a git-specific sibling."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Task Breakdown: Rule Encoding

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[~]` blocked
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Read the evaluator and determine whether it can express state-gated rules
- [x] T-002 Resolve extend versus rebuild, and record why
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 Lazy state collector with soft failure
- [x] T-004 Ten checks, each keyed to a discriminator
- [x] T-005 Git command parser handling value-taking flags
- [x] T-006 `hard_rules:` frontmatter, version bump to 1.4.0.0
- [x] T-007 Additive options parameter on the shared evaluator
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-008 Reproduction test per rule against real repositories
- [x] T-009 Round-trip assertion: no orphan rule, no orphan check
- [x] T-010 Regression assertion: command-only rules unchanged
- [x] T-011 Fail-open assertion: a throwing check approves
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Complete: 18/18 tests pass, 10 rules with 0 orphans, all `warn`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Research authority: `../001-advisory-research/research.md`
- Successor: `../003-preflight-hook/`
<!-- /ANCHOR:cross-refs -->
