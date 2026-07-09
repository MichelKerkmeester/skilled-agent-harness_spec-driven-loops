---
title: "Verification Checklist: Query-Time Existence Filter Benchmark & Hardening [template:level_2/checklist.md]"
description: "Verification Date: TBD, scaffold not yet built"
trigger_phrases:
  - "query-time existence filter benchmark"
  - "REQ-008 latency benchmark"
  - "query-time filter concurrency soak test"
  - "transient-miss suspect queue end-to-end test"
  - "existence filter exclusion telemetry"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/020-query-time-filter-benchmark"
    last_updated_at: "2026-07-09T22:40:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored checklist.md alongside spec.md/plan.md/tasks.md, status PLANNED, all items unchecked"
    next_safe_action: "Await operator approval, then begin Phase 1 of plan.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-020-query-time-filter-benchmark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Query-Time Existence Filter Benchmark & Hardening

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
|----------|----------|---------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P0] 011-automatic-drift-self-healing's Layer 1 code and 014-self-healing-internals-hardening's F8 fix re-confirmed present in the live tree before implementation begins
- [ ] CHK-004 [P1] Dependencies identified and available (004-dark-flag-graduation benchmark pattern, stress_test/durability isolation pattern)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented (aggregate-counter write failure still returns the search response normally)
- [ ] CHK-013 [P1] Code follows project patterns (config-table reuse for REQ-004 Option A, or process-lifetime counter matching retrieval-telemetry.ts for Option B)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 benchmark numbers, REQ-002 concurrency safety, REQ-003 end-to-end transient-miss flow, REQ-004 aggregate counter)
- [ ] CHK-021 [P0] Manual verification: benchmark harness run once locally against a read-only corpus backup, real numbers captured
- [ ] CHK-022 [P1] Edge cases tested (zero-result query set, every-row-excluded fixture, concurrent write mid-fast-fail)
- [ ] CHK-023 [P1] Error scenarios validated (aggregate-counter persistence failure does not fail the search response)
- [ ] CHK-024 [P0] Benchmark thresholds pinned with reproduce command (filter overhead as a fraction of baseline query time)
- [ ] CHK-025 [P0] Named tests present with their assertions (.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/query-time-existence-filter-concurrency-stress.vitest.ts, .opencode/skills/system-spec-kit/mcp_server/tests/memory-search-transient-miss-e2e.vitest.ts)
- [ ] CHK-026 [P1] Default-off proven unaffected: SPECKIT_QUERY_TIME_EXISTENCE_FILTER stays default-off, and the REQ-004 counter only accumulates when the flag is on (flag-off byte-identical)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the four gaps has a finding class: REQ-008 unexecuted benchmark is `matrix/evidence`, single-process-only concurrency proof is `test-isolation`, split unit/confirmation coverage is `test-isolation`, ephemeral telemetry is `class-of-bug` (a real observability gap, not an instance)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: confirmed applyQueryTimeExistenceFilter() has exactly one production call site before adding the REQ-004 counter (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the new aggregate counter (confirmed no existing consumer beyond the new REQ-004 test)
- [ ] CHK-FIX-004 [P0] Concurrency-sensitive changes include adversarial tests (REQ-002's wide concurrent burst, contended vs. uncontended write)
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed (benchmark flag-on/off x warm-repeat count; stress-test concurrency width x contended/uncontended write; e2e excluded/restored/confirmed-missing states)
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed for the flag-gated counter (flag unset vs. explicit true/1 opt-in)
- [ ] CHK-FIX-007 [P1] Evidence pinned to an explicit diff range or commit SHA, not a moving branch-relative claim
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] The benchmark harness and the concurrency stress test never open the production database for writes (NFR-S01)
- [ ] CHK-032 [P1] Input validation implemented where applicable (benchmark query-set loading, if reading a fixture file)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate; no new comment embeds spec/packet/requirement/task IDs, only durable behavior
- [ ] CHK-042 [P1] ENV_REFERENCE.md updated with the existing per-query telemetry field and the new aggregate counter
- [ ] CHK-043 [P1] 011/checklist.md CHK-064 closed with a pointer to this phase's evidence (REQ-005)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ or system temp only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:benchmark-verification -->
## Benchmark & Soak Verification Evidence

- [ ] CHK-060 [P0] REQ-001: p50/p95/mean latency captured for flag-on vs. flag-off over the representative query set, on a read-only corpus/vector-shard backup, numbers written into implementation-summary.md
- [ ] CHK-061 [P0] REQ-002: the concurrency stress test's wide concurrent burst completes with no hang and no unhandled rejection
- [ ] CHK-062 [P0] REQ-002: the suspect-queue table remains readable and free of partial/corrupt rows after the burst
- [ ] CHK-063 [P0] REQ-003: a single continuous test proves exclude-while-missing, queue-not-drop, restore, re-include, and scan-clears-not-tombstones through the public memory_search/memory_index_scan handlers
- [ ] CHK-064 [P0] REQ-004: the aggregate counter's total matches the sum of per-query checked/excluded across a multi-query test sequence
- [ ] CHK-065 [P1] REQ-006: code-review confirms zero changes to Layer 1's filtering logic, Layer 2's git hook, or Layer 3's sweep/confirm pass beyond the REQ-004 counter
<!-- /ANCHOR:benchmark-verification -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 13 | 0/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->
