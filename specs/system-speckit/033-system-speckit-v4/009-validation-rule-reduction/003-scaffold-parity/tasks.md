---
title: "Task Breakdown: The Scaffold Passes Its Own Gate"
description: "Reproduce, fix each cause, lock with a test that was proven against the unfixed code."
trigger_phrases:
  - "scaffold parity"
  - "fresh scaffold passes"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-validation-reduction/003-scaffold-parity"
    last_updated_at: "2026-08-29T19:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Made a fresh scaffold pass the gate it ships with"
    next_safe_action: "Begin the next phase: stop copying derived facts into authored prose"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/create.sh"
      - ".opencode/skills/system-spec-kit/templates/core/spec.md.tmpl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Task Breakdown: The Scaffold Passes Its Own Gate

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

- [x] T-001 [P0] Scaffold a Level 2 folder, change nothing, validate it. Evidence: five errors on a packet nobody had opened.
- [x] T-002 [P1] Re-check the reported missing-document gap. It had already been closed by concurrent work picked up in a rebase, so the scaffolder does create the closure document.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-101 [P0] Scaffold a real default status instead of a menu of every option. The menu contained the word Complete, so the classifier read a new folder as finished.
- [x] T-102 [P1] Replace the author placeholder in the closure template with the value the generator already writes elsewhere.
- [x] T-103 [P0] Run the graph deriver over the documents the generator just wrote, instead of persisting a guess.
- [x] T-104 [P1] Accept the deliberate not-yet-filed marker in the path rule, since the never-touched rule already catches it if it survives to completion.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-201 [P0] A scaffold reports zero errors at levels 1, 2 and 3. Evidence: each validated immediately after creation.
- [x] T-202 [P0] The test detects a regression. Evidence: restoring the status menu fails three of five cases; reverting the restoration passes all five.
- [x] T-203 [P0] No packet regressed. Evidence: same 250-packet sample, zero moving from pass to fail.
- [x] T-204 [P1] The test leaves nothing behind. Evidence: no untracked probe folder after the suite runs.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- The system can produce a packet that satisfies the system.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — requirements REQ-001 … REQ-003
- `plan.md` — approach and rollback

<!-- /ANCHOR:cross-refs -->
