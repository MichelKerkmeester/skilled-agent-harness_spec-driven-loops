---
title: "Tasks: Phase 16: LLM Judge Hardening"
description: "Completed task ledger for retry, fallback, timeout, format-strip retry, and quarantine hardening in judge validation."
trigger_phrases:
  - "llm-judge hardening"
  - "neutral fallback card"
  - "judge quarantine"
  - "post-dispatch validate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/002-deep-loop-runtime/016-llm-judge-hardening"
    last_updated_at: "2026-07-01T21:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold tasks with completed LLM judge hardening ledger from spec.md"
    next_safe_action: "Use this task ledger as completion evidence for the shipped judge hardening stack"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts"
    session_dedup:
      fingerprint: "sha256:016b6f8d0e2c4a7193d5f7a9b1c3e5d7f9a0b2c4d6e8f1a3b5c7d9e0f2a4b6e3"
      session_id: "scaffold-content-remediation-016"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "4-stage JSON extraction cascade deferred to a separate deep-rewrite ticket"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 16: LLM Judge Hardening

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

- [x] T001 Read the shipped phase spec and confirm `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` is the only implementation file in scope.
- [x] T002 Identify persistence, convergence, and coverage scoring write-path entry points for quarantine guards.
- [x] T003 Confirm the 4-stage JSON extraction cascade is deferred to a separate deep-rewrite ticket.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add configurable retry attempts and backoff for transient model judge failures.
- [x] T005 Add dual timeout races for fast-path timeout and slow-path escape hatch.
- [x] T006 Add format-strip retry to strip markdown fences and reparse model JSON.
- [x] T007 Add neutral fallback card creation with `quarantined:true` after exhausted recovery attempts.
- [x] T008 Record retry count and failure kind metadata on fallback cards.
- [x] T009 Enforce quarantine guards at persistence, convergence, and coverage scoring write paths.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify exhausted retries produce a fallback card with `quarantined:true`.
- [x] T011 Verify zero persistence writes occur for quarantined cards.
- [x] T012 Verify quarantined cards do not reach convergence or coverage scoring.
- [x] T013 Verify fenced JSON is parsed after strip without fallback.
- [x] T014 Verify transient model failure recovers within the retry window and returns a valid scored card.
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
