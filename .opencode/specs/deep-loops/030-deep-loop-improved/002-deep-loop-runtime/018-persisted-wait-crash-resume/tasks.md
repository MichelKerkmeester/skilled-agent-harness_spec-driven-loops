---
title: "Tasks: Phase 18: Persisted-Wait Crash Resume"
description: "Completed task ledger for persisted wait checkpoints and first-priority resume-waiting startup classification."
trigger_phrases:
  - "persisted-wait crash-resume"
  - "resume-waiting classifier"
  - "wait-checkpoint schema"
  - "nextRunAt crash recovery"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/002-deep-loop-runtime/018-persisted-wait-crash-resume"
    last_updated_at: "2026-07-01T21:54:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold tasks with completed persisted-wait crash-resume ledger from spec.md"
    next_safe_action: "Use this task ledger as completion evidence for the shipped wait-resume crash recovery"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:018b6f8d0e2c4a7193d5f7a9b1c3e5d7f9a0b2c4d6e8f1a3b5c7d9e0f2a4b6e5"
      session_id: "scaffold-content-remediation-018"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Missing wait-checkpoint fields are treated as null/not waiting with no operator prompt"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 18: Persisted-Wait Crash Resume

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

- [x] T001 Read the shipped phase spec and confirm the scope is `fanout-run.cjs` and `deep_research_auto.yaml`.
- [x] T002 Identify the startup classifier entry point where `resume-waiting` must run first.
- [x] T003 Confirm legacy state files missing checkpoint fields should be treated as null/not waiting with no operator prompt.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add nullable `nextRunAt` and `remainingDelayMs` fields to persisted state schema.
- [x] T005 Persist wait checkpoint at the explicit pre-dispatch wait boundary in `fanout-run.cjs`.
- [x] T006 Add `resume-waiting` classifier branch for future wait checkpoints.
- [x] T007 Evaluate `resume-waiting` before any dispatch logic on startup.
- [x] T008 Load missing checkpoint fields as null/not waiting for legacy state files.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify state with `nextRunAt` 30 seconds in the future waits remaining delay and triggers no dispatch during that window.
- [x] T010 Verify crash during a 60-second wait resumes with remaining delay rather than zero delay.
- [x] T011 Verify legacy state without checkpoint fields loads as not waiting without throwing.
- [x] T012 Verify classifier ordering checks `resume-waiting` before dispatch logic.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the spec.md acceptance criteria.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
