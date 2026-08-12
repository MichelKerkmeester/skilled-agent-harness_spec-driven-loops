---
title: "Tasks: Adapter Live-Delivery Verification"
description: "Canceled phase-017 task register. The invalid discovery-symlink deletion plan is superseded; phase 018 owns all implementation and proof work."
status: "blocked"
completion_pct: 0
trigger_phrases:
  - "adapter live delivery verification tasks"
  - "017 tasks"
importance_tier: "normal"
contextType: "implementation"
parent: "hooks/002-injection-bloat-reduction"
predecessor: "016-directive-playbook-alignment"
successor: "018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/017-adapter-live-delivery-verification"
    last_updated_at: "2026-08-11T14:00:00Z"
    last_updated_by: "pi"
    recent_action: "Canceled every phase 017 execution task and preserved the historical handoff"
    next_safe_action: "Use phase 018 tasks beginning with the whole-gate baseline"
    blockers:
      - "Superseded by phase 018"
    completion_pct: 0
    key_files:
      - "spec.md"
      - "../018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/tasks.md"
    session_dedup:
      fingerprint: "sha256:d557960bdf31285ae296790ae17d0953cc5b41bd9a7e6474eb65f77950e90ca5"
      session_id: "2026-08-11-adapter-live-delivery-verification"
      parent_session_id: null
    open_questions: []
    answered_questions:
      - "No phase 017 task may execute"
---
# Tasks: Adapter Live-Delivery Verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> **SUPERSEDED — DO NOT EXECUTE.** The former cleanup, retargeting, PASS-record, live-fire, and adapter-test tasks are canceled.

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Historical reconciliation completed with evidence |
| `[~]` | Canceled by phase-018 supersession; not executable |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Record that the runtime-dir user-prompt paths are intentional discovery symlinks. Evidence: `spec.md` problem statement and protected scope.
- [x] T-002 Prohibit deletion, replacement, or conversion of the four discovery symlinks. Evidence: `spec.md` REQ-001 and `plan.md` protected surface.
- [x] T-003 Assign phase 018 as the sole implementation successor. Evidence: packet frontmatter and parent phase map.
- [x] T-003A Withdraw phase-017 host-delivery and benchmark PASS claims. Evidence: `implementation-summary.md` verification table classifies them as unverified historical reports.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [~] T-004 Delete or repair runtime discovery paths — canceled because the diagnosis was false.
- [~] T-005 Retarget scenario 457 from this packet — canceled; phase 018 owns evidence taxonomy and durable fixtures.
- [~] T-006 Persist corrected PASS records from this packet — canceled; adapter evidence cannot be promoted to native-host evidence.
- [~] T-007 Claim all-runtime live delivery — canceled; host receipts remain separately classified.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [~] T-008 Runtime correctness, store security, adapter parity, benchmark provenance, and metadata reconciliation — transferred to phase 018.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

This packet never reaches implementation completion. Historical reconciliation is complete when the packet is blocked, every former task is non-executable, discovery symlinks are protected, and phase 018 is the active successor.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Successor specification**: `../018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/spec.md`
- **Successor tasks**: `../018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/tasks.md`
<!-- /ANCHOR:cross-refs -->
