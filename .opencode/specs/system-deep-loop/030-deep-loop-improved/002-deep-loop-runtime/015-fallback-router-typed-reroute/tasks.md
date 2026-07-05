---
title: "Tasks: Phase 15: Fallback Router Typed Reroute"
description: "Completed task ledger for typed fallback route selection and graph preflight validation."
trigger_phrases:
  - "fallback-router typed reroute"
  - "failure-kind routing"
  - "route-trace metadata"
  - "fallback graph preflight"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/002-deep-loop-runtime/015-fallback-router-typed-reroute"
    last_updated_at: "2026-07-01T21:48:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold tasks with completed fallback-router ledger from spec.md"
    next_safe_action: "Use this task ledger as completion evidence for the shipped typed fallback router"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts"
    session_dedup:
      fingerprint: "sha256:015b6f8d0e2c4a7193d5f7a9b1c3e5d7f9a0b2c4d6e8f1a3b5c7d9e0f2a4b6e2"
      session_id: "scaffold-content-remediation-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 15: Fallback Router Typed Reroute

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

- [x] T001 Read the shipped phase spec and confirm `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` is the only implementation file in scope.
- [x] T002 Inspect existing fallback route config and startup initialization paths.
- [x] T003 Confirm multi-hop chains and cross-scope routing are out of scope.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add typed `onSuccess`, `onFailureTarget`, and `failureKind` route config fields.
- [x] T005 Make `failureKind` influence route selection when a typed failure target is configured.
- [x] T006 Emit `routeGroupId` trace metadata for each routing decision.
- [x] T007 Emit `hopIndex` trace metadata for each routing decision.
- [x] T008 Implement `validateFallbackGraph()` for missing routes, cycles, scope widening, and max-hop violations.
- [x] T009 Run `validateFallbackGraph()` at startup before dispatch.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify cyclic fallback config rejects at startup with a descriptive error before dispatch.
- [x] T011 Verify `failureKind: "timeout"` resolves to the typed `onFailureTarget`.
- [x] T012 Verify routing trace includes `routeGroupId` and `hopIndex`.
- [x] T013 Verify invalid graph checks are not deferred lazily.
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
