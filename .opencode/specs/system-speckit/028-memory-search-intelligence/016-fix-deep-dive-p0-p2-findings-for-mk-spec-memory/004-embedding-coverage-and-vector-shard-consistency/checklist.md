---
title: "Verification Checklist: Phase 4: embedding-coverage-and-vector-shard-consistency"
description: "Verification checklist for embedding coverage repair, vector shard consistency, provenance backfill, chunking decision, and scan-lifecycle fixes. Verification date pending: phase not started."
trigger_phrases:
  - "embedding coverage checklist"
  - "vector shard consistency"
  - "pending vectors drain"
  - "embedding verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/004-embedding-coverage-and-vector-shard-consistency"
    last_updated_at: "2026-07-03T10:05:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 verification checklist with phase gates"
    next_safe_action: "Fill evidence per item during Phase 3 verification; no rubber-stamping"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-016-004-embedding-coverage"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 4: embedding-coverage-and-vector-shard-consistency

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
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-012 with report/ledger refs)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (four batteries + FIX ADDENDUM inventories)
- [ ] CHK-003 [P1] Dependencies identified and available (program order 011/001-003, embedder endpoint, active shard schema)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented (embedder outage mid-drain, migration dry-run failures)
- [ ] CHK-013 [P1] Code follows project patterns (handlers -> lib layering; no finding IDs in code comments)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..REQ-013 acceptance columns)
- [ ] CHK-021 [P0] Manual testing complete (SQL parity counts, drain throughput window, tail-of-large-doc query per ADR-001)
- [ ] CHK-022 [P1] Edge cases tested (retry@max rescue, model mismatch at query time, chunked re-save, empty queue idle)
- [ ] CHK-023 [P1] Error scenarios validated (embedder outage resume, cache poisoning attempt, cancelled scan)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` (classes pre-assigned in tasks.md metadata comments)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed (all vector-write sites via the plan.md rg inventory), or instance-only status proven by grep
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (writeActiveVectorPayload, embedding_model, pendingVectors, indexChunkedMemoryFile consumers)
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (N/A unless the migration parses paths; record the N/A reason if so)
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (embed path x shard x row state, per FIX ADDENDUM)
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (drain interval config, feature flag for scan-path chunking)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented (migration SQL parameterized; no memory content interpolated into commands)
- [ ] CHK-032 [P1] Auth/authz working correctly (N/A for local packet DB; record N/A with reason)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate (durable WHY only; finding refs stay in tasks.md)
- [ ] CHK-042 [P2] README updated (if applicable; Option B requires the truncation-policy doc update)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only (baseline SQL snapshots live in scratch/)
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:phase-gates -->
## Phase Gates (Decomposition §004)

- [ ] CHK-200 [P0] SC-001: success-row count == vector-row count on the active shard; health consistency check reports 0 desync (was 367); reconciled rows queryable via the active vector surface (success->retry churn without embedding does not count)
- [ ] CHK-201 [P0] SC-002: pending backlog projected to drain < 24h at the scaled rate, measured over a bounded window (was 8,761 pending at 5 rows/5min)
- [ ] CHK-202 [P0] SC-003 + ADR-001: decision Accepted with spike evidence; big-doc tails vector-searchable (Option A) or truncation policy explicitly documented (Option B); safe-swap P0 fixed either way
- [ ] CHK-203 [P1] SC-004: embedding_model empties 0 (was 27,706); exactly one canonical spelling (was 2)
- [ ] CHK-204 [P1] SC-005: baseline-before-delta honored; whole vitest gate re-run with numeric delta reported
<!-- /ANCHOR:phase-gates -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 0/18 |
| P1 Items | 25 | 0/25 |
| P2 Items | 9 | 0/9 |

**Verification Date**: Pending (phase not started)
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001)
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable: provenance backfill reversal via before-value log)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time targets met (NFR-P01: memory_search p50 within noise of baseline during drain)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02: drain >= 400 rows/hour sustained)
- [ ] CHK-112 [P2] Load testing completed (drain under sustained backlog observation window)
- [ ] CHK-113 [P2] Performance benchmarks documented (drain rows/hour, scan-latency delta if Option A)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested (DB backup restore + before-value inverse UPDATE + flag off)
- [ ] CHK-121 [P0] Feature flag configured (if applicable: scan-path chunking under Option A)
- [ ] CHK-122 [P1] Monitoring/alerting configured (health consistency check + shard-repair sentinel now truthful)
- [ ] CHK-123 [P1] Runbook created (reconcile cadence + /memory:manage entry point documented)
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed (migration parameterization; local-only DB writes)
- [ ] CHK-131 [P1] Dependency licenses compatible (no new dependencies expected)
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed (N/A for local tooling; record reason)
- [ ] CHK-133 [P2] Data handling compliant with requirements (packet DB backup retained until gates green)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable: /memory:manage reconcile wiring documented)
- [ ] CHK-142 [P2] User-facing documentation updated (truncation policy doc under Option B)
- [ ] CHK-143 [P2] Knowledge transfer documented (implementation-summary.md at close)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Technical Lead | [ ] Approved | |
| Michel Kerkmeester | Product Owner | [ ] Approved | |
| Michel Kerkmeester | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
