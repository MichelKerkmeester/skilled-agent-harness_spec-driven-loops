---
title: "Task Breakdown: The Framework Document Describes The Gate That Exists"
description: "Test each claim, correct what disagrees, verify the neighbouring git rules."
trigger_phrases:
  - "framework doc matches behaviour"
  - "agents md validation claims"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-validation-reduction/005-framework-doc-matches-behaviour"
    last_updated_at: "2026-08-29T21:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Corrected the framework doc's validation claims to match the gate"
    next_safe_action: "None outstanding for this phase"
    blockers: []
    key_files:
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Task Breakdown: The Framework Document Describes The Gate That Exists
# Task Breakdown: The Framework Document Describes The Gate That Exists

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

- `[x]` complete · `[ ]` open
- `T-0NN` setup · `T-1NN` implementation · `T-2NN` verification

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T-001 [P1] Test the exit-code claim. Evidence: a warnings-only packet under strict exits 0, where the document said 2.
- [x] T-002 [P0] Test the grandfather claim. Evidence: the word appears nowhere in the rule said to honour it.
- [x] T-003 [P1] Test the git claims rather than assuming they were stale. Evidence: the pre-push hook exists at the configured hooks path and enforces the remote-push policy; commit and merge hooks are installed.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-101 [P1] Rewrite the exit-code and strict-mode sentence to describe warnings as advice and strict as a rule selector.
- [x] T-102 [P0] Rewrite the freshness sentence: opt-in decided at the rule's own entry point, warning by default, error under the enforce flag, and no grandfather exemption.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-201 [P1] Each corrected sentence matches observed output.
- [x] T-202 [P0] No mention of a grandfather mechanism remains.
- [x] T-203 [P1] No rule deleted by this packet is named anywhere in the document.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- The always-loaded document describes the gate that exists.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — requirements REQ-001 and REQ-002
- `plan.md` — approach and rollback

<!-- /ANCHOR:cross-refs -->
