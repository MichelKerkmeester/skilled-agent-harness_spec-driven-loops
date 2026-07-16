---
title: "Verification Checklist: Live two-session daemon re-election adoption test"
description: "Verification Date: 2026-06-08"
trigger_phrases:
  - "live reelection validation checklist"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation"
    last_updated_at: "2026-06-08T05:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified live test, reap fix, and doc reconciliation"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-028-live-session-reelection-validation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Live two-session daemon re-election adoption test

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (the `reapLeaseChildBeforeRespawn` helper already exists)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Launcher parses (`node --check` PASS) and comment hygiene clean (no IDs or paths in the added comment)
- [x] CHK-011 [P0] No console errors; durability + launcher-lease suites run clean
- [x] CHK-012 [P1] Error handling implemented (EPERM-uncertain orphan aborts the spawn and reports the lease held)
- [x] CHK-013 [P1] Code follows project patterns (mirrors the dead-socket reap branch, reuses the tested helper)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (live test 3/3, single-writer invariant proven)
- [x] CHK-021 [P0] Manual testing complete (standalone repro shows the orphan reaped within 1s)
- [x] CHK-022 [P1] Edge cases tested (dead orphan fast path, alive orphan reaped, flag off kills)
- [x] CHK-023 [P1] Error scenarios validated (launcher-lease suite 11/11 confirms no reclaim regression)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug` (a structural asymmetry: liveness keyed on the dead owner pid, not the live childPid).
- [x] CHK-FIX-002 [P0] Same-class producer inventory: grep of the reclaim branches confirmed only the stale-owner reclaim path lacked the reap; the dead-socket branch already reaps.
- [x] CHK-FIX-003 [P0] Consumer inventory: `reapLeaseChildBeforeRespawn` reused with no signature change; one new caller added; no other consumers affected.
- [x] CHK-FIX-004 [P0] Adversarial cases covered: alive orphan reaped, already-dead orphan no-op, EPERM-uncertain aborts to lease-held.
- [x] CHK-FIX-005 [P1] Matrix axes: flag {on, off} x session {connected-secondary, fresh-after-dispose}; three live cases.
- [x] CHK-FIX-006 [P1] Hostile env/global-state: the live test runs each case in an isolated fake-root with pinned socket and DB env.
- [x] CHK-FIX-007 [P1] Evidence pinned to the fix commit on `main` and the durability suite run output.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (lifecycle change only)
- [x] CHK-031 [P0] Input validation: childPid is integer-checked before signalling; N/A for external input (no new input surface)
- [x] CHK-032 [P1] Auth/authz: N/A; the reap signals only a pid recorded in the owner-held lease
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (durable WHY on the reap, no perishable labels)
- [x] CHK-042 [P2] README: N/A; changelog, RELEASE_NOTES, and ENV_REFERENCE reconciled instead
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Harness scripts and council outputs live in scratch/ only
- [x] CHK-051 [P1] No stray test daemons; production lease confirmed untouched
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-08
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
