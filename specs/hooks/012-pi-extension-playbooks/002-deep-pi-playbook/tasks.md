---
title: "Tasks: Phase 2 deep-pi playbook"
description: "Task ledger for the deep-pi playbook, harness, and benchmark run."
trigger_phrases:
  - "deep-pi playbook tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/012-pi-extension-playbooks/002-deep-pi-playbook"
    last_updated_at: "2026-08-17T16:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete: 6/6 scenarios PASS, benchmark recorded"
    next_safe_action: "Reconcile packet metadata and validate"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-17-pi-extension-playbooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 2 deep-pi playbook

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T201 Read `isDeepPiModel` and the `/deeppi` command handler. — eligibility and report behavior confirmed.
- [x] T202 Author 6 scenarios across 2 categories. — `eligibility` and `cache-measurement`.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T203 Build the `vitest` harness driving the real extension via `FakePi`. — feeds a known `message_end` usage event with `80000` cache-read tokens.
- [x] T204 Assert activation, dormancy, warning, report, and footer. — all `6` checks pass, recorded in `results.json`.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T205 Run the canonical wrapper into `benchmark/reports/`. — folder `2026-08-17--manual-testing-playbook--deeppi-behavior`.
- [x] T206 Move the harness out of the `vitest` glob and confirm the own suite. — `81` tests pass after the move.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. — `6` of `6` tasks complete.
- [x] No blocked tasks remain. — `0` blocked tasks.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.

<!-- /ANCHOR:cross-refs -->
