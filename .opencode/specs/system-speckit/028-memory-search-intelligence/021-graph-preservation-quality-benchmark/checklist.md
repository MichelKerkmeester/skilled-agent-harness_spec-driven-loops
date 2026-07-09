---
title: "Verification Checklist: Graph Preservation Quality Benchmark"
description: "Verification Date: TBD, scaffold not yet built"
trigger_phrases:
  - "graph preservation quality benchmark"
  - "content rich short query graph preservation benchmark"
  - "retrieval class routing benchmark"
  - "F15 counter memory health wiring"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/021-graph-preservation-quality-benchmark"
    last_updated_at: "2026-07-09T20:40:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored checklist.md scaffold, status PLANNED, all items unchecked"
    next_safe_action: "Hold for implementation, no code has landed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-021-graph-preservation-quality-benchmark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Graph Preservation Quality Benchmark

<!-- SPECKIT_LEVEL: 3 -->
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
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available (run-retrieval-flag-eval.mjs, F15 counter, memory_health routing block)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented (F15 counter read fails gracefully, matching routingTelemetry/graphChannelMetrics precedent)
- [ ] CHK-013 [P1] Code follows project patterns (driver reuses prepareEvalDatabase/buildPerFlagSearchOptions/computeMeanMetrics rather than duplicating)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-008)
- [ ] CHK-021 [P0] Manual testing complete (a manual benchmark run against the reindexed snapshot, and a manual memory_health call confirming the F15 field)
- [ ] CHK-022 [P1] Edge cases tested (dual-predicate query tagging, control-slice drift, reindex-step failure, counter-read failure)
- [ ] CHK-023 [P1] Error scenarios validated (partial reindex refused, memory_health falls back on counter-read failure)
- [ ] CHK-024 [P0] Fixture verified: >=50 labeled queries, every query's slice membership confirmed against the live classifiers, not just hand-labeled
- [ ] CHK-025 [P0] Named tests present with their assertions (fixture-shape test, F15 counter-wiring test, additive-only diff test)
- [ ] CHK-026 [P1] Reindex step documented with a before/after confirmation that graph state actually changed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (N/A if no such fix in this packet — record the reason.)
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (three fixture slices x two flags x reindex before/after).
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (F15's counter is process-wide; a restart/reset variant is required).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented (N/A — no new external input surface; the driver reads existing DB/fixture files only)
- [ ] CHK-032 [P1] The reindexed eval-DB snapshot is a local temp-directory copy, never a write against the live production database (NFR-S01)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate (durable WHY only, no packet/spec IDs embedded per this repo's comment-hygiene rule)
- [ ] CHK-042 [P2] README updated (if applicable — N/A unless the driver's location changes an existing README's file inventory)
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
| P0 Items | 17 | 0/17 |
| P1 Items | 24 | 0/24 |
| P2 Items | 9 | 0/9 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 reuse-existing-harness, ADR-002 classifier-verified fixture, ADR-003 independent F15 wiring)
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted) -- all three currently Accepted
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (decision-record.md Alternatives Considered tables)
- [ ] CHK-103 [P2] Migration path documented (if applicable) -- N/A, no schema or data migration in this packet
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Benchmark driver cost scales linearly with flag count, no combinatorial sweep (NFR-P01)
- [ ] CHK-111 [P1] memory_health's F15 counter read adds no measurable latency to the health-check response (NFR-P02)
- [ ] CHK-112 [P2] Load testing completed -- deferred to a future soak-testing activity, out of this packet's scope per spec.md
- [ ] CHK-113 [P2] Performance benchmarks documented -- benchmark-results.md records the driver's own per-flag run cost/duration
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested (plan.md Rollback Plan, Enhanced Rollback)
- [ ] CHK-121 [P0] Feature flag configured (if applicable) -- N/A, this packet introduces no new feature flag; it measures two existing ones without changing their defaults (REQ-005)
- [ ] CHK-122 [P1] Monitoring/alerting configured -- the F15 memory_health field IS the monitoring surface this packet adds (REQ-006)
- [ ] CHK-123 [P1] Runbook created -- the reindex-before-benchmark step is documented as a runnable command in benchmark-results.md (REQ-003)
- [ ] CHK-124 [P2] Deployment runbook reviewed -- N/A, no production deployment; this packet ships spec-folder docs, a fixture, a driver script, and one additive handler field
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed -- reviewed for the one real surface change (memory_health field addition); no new external input surface (NFR-S01)
- [ ] CHK-131 [P1] Dependency licenses compatible -- N/A, no new third-party dependency introduced
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed -- N/A, this packet has no user-facing web surface; it is an internal eval harness and a read-only health-check field
- [ ] CHK-133 [P2] Data handling compliant with requirements -- the reindexed eval-DB snapshot is a local temp-directory copy, never a live-DB write (NFR-S01)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist/decision-record/implementation-summary)
- [ ] CHK-141 [P1] API documentation complete (if applicable) -- N/A, no new public API; `memory_health`'s existing response-shape documentation covers the additive field
- [ ] CHK-142 [P2] User-facing documentation updated -- N/A, this packet has no end-user-facing surface
- [ ] CHK-143 [P2] Knowledge transfer documented -- decision-record.md's three ADRs capture the reasoning for future packet authors
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| TBD | Technical Lead | [ ] Approved | |
| TBD | Product Owner | [ ] Approved | |
| TBD | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
