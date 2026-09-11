---
title: "Goal: Close every open goal decision"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/036-goal-unification/009-close-open-decisions"
    last_updated_at: "2026-09-11T20:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-system-spec-kit-goals"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Close every open goal decision

---

<!-- ANCHOR:directive -->
## 1. DIRECTIVE

**Objective:** Close every item the goal unification packet still had open, so nothing is carried
forward as a decision, an advisory or an unknown.

Four items needed an operator answer and one needed a live run. Everything else was already built or
already rejected with evidence. Take the five, close them, and pin each change with a test that fails
when the behaviour is removed.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 2. COMPLETION

- [x] Completion criteria render as their own field, whole items only, with a count when the budget trims
- [x] A log append refuses a goal document that is not valid UTF-8 and leaves the bytes untouched
- [x] The binding-row rule accepts link notation and enforces real-path containment
- [x] Claude Code and Codex have a hash-based resend signal and the workflows state the nesting rules
- [x] A test fails when the three lifecycle workflow goal blocks differ
- [x] The goal contract documents are reachable from the trigger index
- [x] The Devin host context merge rule is recorded from a live run
- [x] Every suite passes and the packet validates strict with no errors
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 3. LOG

| Item | State | Evidence |
|---|---|---|
| Operator decisions taken | Done | Four answers recorded in the implementation summary |
| Criteria field built | Done | Parity test extended and negative-controlled |
| Non-UTF-8 refusal built | Done | Error code and byte-identity asserted |
| Validator hardened | Done | Three new cases in the validator suite |
| Workflow drift check built | Done | Contract test negative-controlled |
| Corpus root added | Done | Retrieval suites pass; lookup returns the contract first |
| Devin merge rule settled | Done | Live run on CLI 3000.6.14 |
<!-- /ANCHOR:log -->
