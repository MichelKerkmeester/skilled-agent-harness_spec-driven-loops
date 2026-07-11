---
title: "Verification Checklist: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening"
description: "Verification Date: Not yet run - this packet is Planned, implementation has not started."
trigger_phrases:
  - "verification"
  - "checklist"
  - "embedder relisten reaper hardening"
importance_tier: "high"
contextType: "implementation"
parent: "system-speckit/028-memory-search-intelligence/001-speckit-memory"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/032-embedder-relisten-and-reaper-hardening"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Deferred-work spec authored"
    next_safe_action: "Implement WS1 (embedder re-listen) first"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-embedder-relisten-and-reaper-hardening-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

**Status note**: This packet is Planned. Every item below is pending; none is checked. This checklist exists so implementation can verify against it in order once work starts.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-008 at spec.md:137-157)
- [x] CHK-002 [P0] Technical approach defined in plan.md (phases at plan.md:119-139, affected-surfaces addendum at plan.md:97-115)
- [ ] CHK-003 [P1] Dependencies identified and available - launcher/hf-local/sweeper code paths located and cited; adversarial reviewer availability for WS1/WS3 not yet confirmed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks - not applicable yet, no code written
- [ ] CHK-011 [P0] No console errors or warnings - not applicable yet, no code written
- [ ] CHK-012 [P1] Error handling implemented - WS1's re-arm check and WS2's fail-fast branch both need explicit error paths, not yet written
- [ ] CHK-013 [P1] Code follows project patterns - to be verified against existing launcher/sweeper conventions once implemented
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met - REQ-001 through REQ-008, none verified yet
- [ ] CHK-021 [P0] Manual testing complete - WS1 live-durability run with two real launchers, not yet performed
- [ ] CHK-022 [P1] Edge cases tested - the three edge cases in spec.md's L2 Edge Cases section (stale socket file, pid-reuse race, dual-daemon same-DB-dir), not yet exercised
- [ ] CHK-023 [P1] Error scenarios validated - WS2's no-owner-lease fail-fast path, not yet built or tested
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class - WS1 is `class-of-bug` (the re-arm gap applies to every adoption, not one instance); WS3's three patches are each `class-of-bug` within the sweeper's decision logic; WS2 is `algorithmic` (retry-vs-fail-fast branch logic); WS5 is `test-isolation` pending root cause
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed - confirmed one production call site for `startModelServerDemandListener` (`mk-spec-memory-launcher.cjs:1781`) via `rg`; the bridge/adopt call sites that should also call it (`:1656-1691`) are enumerated in plan.md's affected-surfaces table, not yet patched
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests - plan.md lists the known consumers (hf-local retry loop, sweeper functions); a full repo-wide consumer sweep is a Phase 1 setup task (T001/T003), not yet run
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases - not directly applicable (no path/parser/redaction surface here), but WS3's process-killer patches carry an equivalent adversarial-case requirement (pid-reuse race, dual-daemon race), tracked as REQ-005/REQ-006, not yet built
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed - plan.md's affected-surfaces addendum lists the WS1 matrix (3 lifecycle states x 3 socket states = 6 rows); WS3's matrix is not yet drafted, tracked as a Phase 1/2 task
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state - WS1/WS3 both read process-wide lease/marker/socket state; the hostile-variant test runs are not yet written
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range - not applicable yet, no fix has landed
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - 0/5 authored docs contain a secret/token/password/api-key string (checked with `rg -inE "secret|token|password|api[_-]?key"` across all five files)
- [ ] CHK-031 [P0] Input validation implemented - not applicable to the planning artifacts themselves; will apply to WS1/WS2/WS3 code once written
- [ ] CHK-032 [P1] Auth/authz working correctly - not applicable, this is internal process-lifecycle tooling with no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - WS1-WS5 are referenced 50/41/16 times in spec.md/plan.md/tasks.md respectively (checked with `rg -c "WS1|WS2|WS3|WS4|WS5"`)
- [x] CHK-041 [P1] Code comments adequate - 0/5 authored docs are code files, so no code comments exist to check yet
- [ ] CHK-042 [P2] README updated (if applicable) - WS4's runbook is the closest equivalent and is still pending (Phase 3, T014)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - confirmed via `ls scratch/ 2>&1`, which reports no such directory in this packet
- [x] CHK-051 [P1] scratch/ cleaned before completion - confirmed via `ls scratch/ 2>&1`, no scratch/ directory exists to clean
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 3/9 |
| P1 Items | 11 | 4/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet run - implementation has not started. This checklist will be re-verified item by item once WS1 through WS5 land.
<!-- /ANCHOR:summary -->
