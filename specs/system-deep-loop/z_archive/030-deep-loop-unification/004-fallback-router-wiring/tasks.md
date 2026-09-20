---
title: "Tasks: Fallback-Router Wiring (Optional)"
description: "Task ledger for wiring fallback-router.ts into fanout-pool.cjs."
trigger_phrases:
  - "fallback router wiring tasks"
importance_tier: "low"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/004-fallback-router-wiring"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored task ledger, not yet executed, optional"
    next_safe_action: "Awaiting operator decision on scope"
    blockers:
      - "Awaiting operator decision on whether this is in-scope"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-004-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Fallback-Router Wiring (Optional)

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

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

- [B] T001 Operator scope decision: fold into this packet or defer. Blocked on operator input.
- [ ] T002 Author the `ModelRegistry` entry (glm-5.2 -> mimo-v2.5-pro).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add `resolveFallback()` call in `fanout-pool.cjs`'s retry-exhausted branch.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T004 Forced-failure integration test confirms fallback dispatch.
- [ ] T005 Confirm `fallback-router.vitest.ts` still passes unmodified.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or phase explicitly deferred by operator.
- [ ] No `[B]` blocked tasks remaining if the phase proceeds.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
