---
title: "Verification Checklist: Memory Consolidation Cursor + Clock (C4-A → C4-C → C-G1 chain)"
description: "Verification gates for the longest Memory consolidation chain, receipt scoping regression gate, crash-safety invariants and per-candidate test evidence. Planning-only: items are unchecked until implementation lands."
trigger_phrases:
  - "consolidation cursor checklist"
  - "c4-a regression gate"
  - "crash-safe consolidation verification"
  - "dead letter checklist"
  - "idempotency replay verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/011-consolidation-cursor-clock"
    last_updated_at: "2026-07-04T17:51:02.602Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 verification checklist (planning-only, unchecked)"
    next_safe_action: "Implement, check items with evidence as each candidate ships"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-010-consolidation-cursor-clock"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Memory Consolidation Cursor + Clock (C4-A → C4-C → C-G1 chain)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

> **Planning-only re-plan.** This is the authored sub-phase spec. Implementation has not started. All items below are unchecked until each candidate lands. None of these candidates shipped in the 030 Wave-0 record (C4-A was explicitly DEFERRED there).

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..010)
- [ ] CHK-002 [P0] Technical approach + chain sequencing defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified (C4-A chain head, entity confidence scoring Red for the retention guard)
- [ ] CHK-004 [P0] Baseline `handleMemoryUpdate` suite captured green (55/0) BEFORE flipping C4-A
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes tsc/lint
- [ ] CHK-011 [P0] No new console errors/warnings
- [ ] CHK-012 [P1] Error handling: the clock tick logs-and-continues (never fatal)
- [ ] CHK-013 [P1] Follows existing consolidation/enrichment patterns (grafts onto the existing cursor, no episode model)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..004 P0)
- [ ] CHK-021 [P0] `handleMemoryUpdate` suite stays 55/55 after C4-A default-on (the regression gate)
- [ ] CHK-022 [P0] Crash-safety: startup reset (`in_progress`→`raw`) + contiguous-prefix invariant tested
- [ ] CHK-023 [P0] Dead-letter: poison-pill reaches terminal `failed` and is queue-excluded (no infinite replay)
- [ ] CHK-024 [P1] Replay: commit-then-die re-derives the same content-addressed id (dedup no-op)
- [ ] CHK-025 [P1] Transient/Fatal classification tested, LT turns_counter cadence gate tested
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate has a finding class recorded (PENDING+gate or REFUTED) with a research citation
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: all `SPECKIT_MEMORY_IDEMPOTENCY` consumers found (receipt path + near-dup hint coupling)
- [ ] CHK-FIX-003 [P0] Consumer inventory for the changed status column (`post_insert_enrichment_status`, deferred/in_progress)
- [ ] CHK-FIX-004 [P0] Apply-once invariant tested: a re-run over already-`consolidated` items is a no-op
- [ ] CHK-FIX-005 [P1] Crash/restart matrix axes listed (mid-tick crash, commit-then-die, poison-pill, Transient vs Fatal)
- [ ] CHK-FIX-006 [P1] Restart/global-state variant executed (the retry budget reads process-wide state)
- [ ] CHK-FIX-007 [P1] Evidence pinned to each candidate's commit SHA, not a moving range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No new untrusted-input surface (consolidation operates over already-stored rows)
- [ ] CHK-032 [P1] N/A, recall-trust/escaper work is out of scope (sibling sub-phase)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist/decision-record synchronized
- [ ] CHK-041 [P1] Per-candidate STATUS (PENDING+gate / REFUTED) accurate vs the 030 §14 record
- [ ] CHK-042 [P2] No ephemeral artifact labels in code comments (durable WHY only)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 13 | 0/13 |
| P2 Items | 2 | 0/2 |

**Verification Date**: (pending implementation)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 (C4-A flag coupling), ADR-002 (durable-retry vs restart-self-heal), ADR-003 (cursor reuse) documented in decision-record.md
- [ ] CHK-101 [P1] ADR-002 resolved (durability decision) before T051 is unblocked
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (episode model rejected per ADR-003)
- [ ] CHK-103 [P2] No SCHEMA_VERSION bump (state columns are additive on existing tables)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Clock tick amortized via the turns_counter cadence gate (NFR-P01)
- [ ] CHK-111 [P2] No measured benefit number claimed (research banked zero benchmarks)
- [ ] CHK-112 [P2] Boot-replay backlog bounded by the per-row attempt cap
- [ ] CHK-113 [P2] M-detail-retention-guard benchmark gate honored (deferred until confidence scoring exists)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback documented: C4-A flag-reversible (inert residue), C-G1 driver disable-able
- [ ] CHK-121 [P0] C-G1 clock-driver flag-gated until idempotency is verified
- [ ] CHK-122 [P1] Health gauges (lag/pending/failed) consistent if surfaced
- [ ] CHK-123 [P2] Daemon recycle path for dist changes noted
- [ ] CHK-124 [P2] Per-candidate scoped commits (independently reversible)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Adversarial review of each shipped candidate (independent seat)
- [ ] CHK-131 [P2] N/A, no new dependency licenses
- [ ] CHK-132 [P2] N/A
- [ ] CHK-133 [P2] N/A
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All sub-phase docs synchronized + `validate.sh --strict` passes
- [ ] CHK-141 [P2] Cross-references to 030 §14 (DONE evidence) and parent research accurate
- [ ] CHK-142 [P2] N/A, no user-facing docs
- [ ] CHK-143 [P2] implementation-summary.md authored when tasks complete (Level-3 requirement on completion)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Memory MCP maintainer | Technical Lead | [ ] Approved | |
| Packet 028 owner | Product Owner | [ ] Approved | |
| Reviewer (independent seat) | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
