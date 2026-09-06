---
title: "Task Breakdown: A Warning Stops Being A Failure"
description: "Measure, remove the promotion, restore the enforcement that depended on it, reconcile the tests."
trigger_phrases:
  - "warnings stop blocking tasks"
  - "promotion clause removal"
  - "warnings enforcement path restore"
  - "registry ceilings raised"
  - "fixed stride sample baseline"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/001-warnings-stop-blocking"
    last_updated_at: "2026-08-29T18:45:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed every task with measured evidence"
    next_safe_action: "Begin the next phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Task Breakdown: A Warning Stops Being A Failure

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

- [x] T-001 [P0] Capture a per-packet baseline over a fixed stride sample of live packets. Evidence: 250 packets sampled from 2,583; 99 passing (39.6%).

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-101 [P0] Remove the clause that promotes a warning to a failure under strict.
- [x] T-102 [P0] Find every rule whose enforcement depended on that promotion. Two were found: both emitted only a warning while their own tests asserted a hard failure.
- [x] T-103 [P0] Make those two rules emit a failure when enforcing, and raise their registry ceilings so the dispatcher does not clamp it back to a warning.
- [x] T-104 [P1] Reconcile tests that encoded the old contract, keeping their detection assertions and changing only the exit expectation.
- [x] T-105 [P1] Repair the sweep fixture, which established a failing folder using a rule that is now advisory and so no longer fails.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-201 [P0] Re-measure the same sample with the same command. Evidence: 190 passing (76.0%), up 36.4 points.
- [x] T-202 [P0] No packet moved from passing to failing. Evidence: per-packet comparison reports 0 regressions.
- [x] T-203 [P0] The two enforcement paths still block. Evidence: their tests assert a hard failure and pass.
- [x] T-204 [P1] The affected suites pass. Evidence: 29 vitest cases in the scripts package, 13 in mcp-server, 117 in the chained shell suite.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- A warning reports and does not block.
- Nothing that blocked before this change stops blocking without being noticed.
- No packet regressed.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — requirements REQ-001 … REQ-004
- `plan.md` — approach, gates, rollback

<!-- /ANCHOR:cross-refs -->
