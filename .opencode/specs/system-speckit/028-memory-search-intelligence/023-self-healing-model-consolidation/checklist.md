---
title: "Verification Checklist: Self-Healing Model Consolidation [template:level_2/checklist.md]"
description: "Verification Date: TBD, scaffold not yet built"
trigger_phrases:
  - "self-healing model consolidation"
  - "suspect queue sole confirmation funnel"
  - "runSuspectConfirmation one confirmer"
  - "orphan sweep discoverer not deleter"
  - "drift suspect queue size cap"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/023-self-healing-model-consolidation"
    last_updated_at: "2026-07-09T20:30:10.000Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored verification checklist scaffold, all items unchecked"
    next_safe_action: "Build per tasks.md then verify each item"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Self-Healing Model Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims and hidden blocker deferrals.
-->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available (017/018/019 landed, line citations re-verified)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented (a failed enqueue from either new caller is caught and logged, never fatal to the scan, matching Layer 1's existing best-effort pattern)
- [ ] CHK-013 [P1] Code follows project patterns (reuses appendMemoryDriftSuspects/deleteIndexedRecordIds/buildPathExistenceCache verbatim, no parallel primitives added)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 orphan-sweep enqueues not deletes, REQ-002 scoped-delete enqueues not deletes, REQ-003 single confirmer grep, REQ-004 confirm-before-tombstone)
- [ ] CHK-021 [P0] Manual testing complete (local scan against a workspace with a real orphaned row and a real git-hook-driven rename/delete, observed across two scan invocations)
- [ ] CHK-022 [P1] Edge cases tested (double-enqueue dedup, empty candidate sets, at-cap and one-over-cap queue size)
- [ ] CHK-023 [P1] Error scenarios validated (enqueue failure under lock contention, confirmation failure on a large queue fails closed)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `deleteIndexedRecordIds`/`deleteStaleIndexedRecords`/`appendMemoryDriftSuspects` call sites re-grepped post-change.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `OrphanSweepDeleteResult`'s changed field semantics (every reader of `swept`/`failed`/`actions` re-checked).
- [ ] CHK-FIX-004 [P0] N/A for this packet — no security/path/parser/redaction surface touched (existing path-existence and delete primitives reused verbatim).
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (discoverer x outcome matrix from plan.md).
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed for the busy-timeout lock-contention test (REQ-007).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No new delete path added — every route to `deleteIndexedRecordIds` still passes through `runSuspectConfirmation`'s existence recheck (REQ-003/REQ-004)
- [ ] CHK-032 [P1] Suspect-queue size cap or metric prevents unbounded config-table blob growth and unbounded confirmation-pass query size (REQ-005)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate (durable WHY only — no spec/packet/task IDs embedded in code, per comment-hygiene rule)
- [ ] CHK-042 [P2] README updated (if applicable)
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
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->
