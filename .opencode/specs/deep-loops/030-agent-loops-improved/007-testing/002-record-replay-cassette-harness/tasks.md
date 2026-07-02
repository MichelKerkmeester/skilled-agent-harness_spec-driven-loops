---
title: "Tasks: Record-Replay Cassette Harness for Convergence Regression"
description: "Completed task ledger for record/replay cassette helpers and convergence regression tests."
trigger_phrases:
  - "record replay cassette"
  - "cassette harness"
  - "convergence regression"
  - "recordScriptRun replayScriptRun"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/007-testing/002-record-replay-cassette-harness"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts"
      - ".opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Record-Replay Cassette Harness for Convergence Regression

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the completed spec and confirm convergence cassette scope (`spec.md`).
- [x] T002 Confirm hermetic test isolation prerequisite is complete (`001-hermetic-test-isolation/spec.md`).
- [x] T003 [P] Keep full MCP session replay and cassette UI out of scope (`spec.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `recordScriptRun()` to capture normalized dispatch envelopes (`spawn-cjs.ts`).
- [x] T005 Add `replayScriptRun()` to replay and compare cassette output (`spawn-cjs.ts`).
- [x] T006 Redact real paths, tokens, and timestamps by default (`spawn-cjs.ts`).
- [x] T007 Pin a convergence baseline cassette for a known dispatch pattern (`tests/fixtures/cassettes/`).
- [x] T008 Add cassette-based convergence regression coverage (`convergence-script.vitest.ts`).
- [x] T009 Wire optional fan-out replay coverage when in scope (`fanout-run.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify the same cassette replays identically across repeated runs.
- [x] T011 Verify convergence regression test passes against the pinned cassette.
- [x] T012 Verify a deliberate convergence output change fails with a diff.
- [x] T013 Verify cassette fixtures contain no real paths, tokens, or timestamps.
- [x] T014 Update plan and task docs to reflect completed implementation (`plan.md`, `tasks.md`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the completed specification.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
