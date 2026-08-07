---
title: "Tasks: Hermetic Test Isolation (HOME/Temp-Dir + Child Env)"
description: "Completed task ledger for hermetic HOME, DB, temp-dir, and child-env isolation."
trigger_phrases:
  - "hermetic test isolation"
  - "spawn-cjs helper"
  - "test isolation home dir"
  - "vitest parallel isolation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/007-testing/001-hermetic-test-isolation"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts"
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
# Tasks: Hermetic Test Isolation (HOME/Temp-Dir + Child Env)

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

- [x] T001 Read the completed spec and confirm test-infrastructure-only scope (`spec.md`).
- [x] T002 Audit test targets for `database/`, `~`, and home-dir references (`spawn-cjs.ts`, `fanout-run.vitest.ts`).
- [x] T003 [P] Confirm cassette harness depends on hermetic isolation (`002-record-replay-cassette-harness/spec.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `createHermeticEnv(testId)` to the shared spawn helper (`spawn-cjs.ts`).
- [x] T005 Return isolated HOME, DB path, temp dir, and child env values (`spawn-cjs.ts`).
- [x] T006 Add cleanup handling for per-test temp trees (`spawn-cjs.ts`).
- [x] T007 Wire `fanout-run.vitest.ts` to use a hermetic env per test (`fanout-run.vitest.ts`).
- [x] T008 Pass hermetic env values into spawned child processes (`spawn-cjs.ts`, `fanout-run.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify parallel tests use unique HOME and DB paths.
- [x] T010 Verify `fanout-run.vitest.ts` passes under thread-pool mode.
- [x] T011 Verify no writes land in real HOME or project `database/` paths.
- [x] T012 Update plan and task docs to reflect completed implementation (`plan.md`, `tasks.md`).
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
