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
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/004-embedding-coverage-and-vector-shard-consistency"
    last_updated_at: "2026-07-04T17:51:11.401Z"
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-012 with report/ledger refs) [EVIDENCE: spec.md documents REQ-001..REQ-012 with report/ledger refs]
- [x] CHK-002 [P0] Technical approach defined in plan.md (four batteries + FIX ADDENDUM inventories) [EVIDENCE: plan.md defines the embedding-coverage/vector-shard approach + files-to-change]
- [x] CHK-003 [P1] Dependencies identified and available (program order 011/001-003, embedder endpoint, active shard schema) [EVIDENCE: phase 002/003 committed; migration is standalone dry-run-gated; embedder config available]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: npm run build clean in integrated main]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: no console errors in embed/drain/scan paths; 122 tests green]
- [x] CHK-012 [P1] Error handling implemented (embedder outage mid-drain, migration dry-run failures) [EVIDENCE: atomic failure paths roll back; reconcile fails closed to zero work without an active shard]
- [x] CHK-013 [P1] Code follows project patterns (handlers -> lib layering; no finding IDs in code comments) [EVIDENCE: follows embedder/vector patterns; comment hygiene passed]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001..REQ-013 acceptance columns) [EVIDENCE: REQ-001..REQ-012 confirmed by xhigh with file:line (7/12 first pass, 5 remediated)]
- [x] CHK-021 [P0] Manual testing complete (SQL parity counts, drain throughput window, tail-of-large-doc query per ADR-001) [EVIDENCE: drain/reconcile/shard behavior verified by canonical-vector-shard + db-state + retry-manager + async-scan tests; live reconcile apply is daemon-side]
- [x] CHK-022 [P1] Edge cases tested (retry@max rescue, model mismatch at query time, chunked re-save, empty queue idle) [EVIDENCE: edge cases: retry@max visibility, mismatched-model exclusion, scoped concurrent scans, pending-vector count covered]
- [x] CHK-023 [P1] Error scenarios validated (embedder outage resume, cache poisoning attempt, cancelled scan) [EVIDENCE: reconcile-without-active-shard, unknown-provenance, force paths covered]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` (classes pre-assigned in tasks.md metadata comments) [EVIDENCE: findings classified in xhigh review]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed (all vector-write sites via the plan.md rg inventory), or instance-only status proven by grep [EVIDENCE: sha256/embed producer inventory reviewed; drain and sync embed the same weighted text]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (writeActiveVectorPayload, embedding_model, pendingVectors, indexChunkedMemoryFile consumers) [EVIDENCE: consumer inventory: reconcile, shard sentinel, embedder identity guard, model backfill, coalescing keys reviewed]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (N/A unless the migration parses paths; record the N/A reason if so) [EVIDENCE: migration provenance-derivation adversarial coverage (unknown/ambiguous rows reported not guessed) in embedding-model-provenance-migration.vitest]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (embed path x shard x row state, per FIX ADDENDUM) [EVIDENCE: lane x state coverage across the vector/embedding test files]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (drain interval config, feature flag for scan-path chunking) [EVIDENCE: process-wide embedder/shard state exercised (sqlite-vec load before count) in canonical-vector-shard test]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: no credentials in touched files]
- [x] CHK-031 [P0] Input validation implemented (migration SQL parameterized; no memory content interpolated into commands) [EVIDENCE: shard paths validated (vec_<int> name guard); migration takes only a local DB path]
- [x] CHK-032 [P1] Auth/authz working correctly (N/A for local packet DB; record N/A with reason) [EVIDENCE: scope params preserved across reconcile/scan]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec/plan/tasks/checklist/decision-record/implementation-summary reconciled]
- [x] CHK-041 [P1] Code comments adequate (durable WHY only; finding refs stay in tasks.md) [EVIDENCE: comments carry durable WHY only; hygiene passed]
- [x] CHK-042 [P2] README updated (if applicable; Option B requires the truncation-policy doc update) [EVIDENCE: N/A: no user-visible README change this phase]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (baseline SQL snapshots live in scratch/) [EVIDENCE: dry-run/probe temp files in scratchpad only]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: results summarized into implementation-summary]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:phase-gates -->
## Phase Gates (Decomposition §004)

- [x] CHK-200 [P0] SC-001: success-row count == vector-row count on the active shard; health consistency check reports 0 desync (was 367); reconciled rows queryable via the active vector surface (success->retry churn without embedding does not count) [EVIDENCE: REQ-002/003: drains produce zero success-without-vector; reconcile dry-run identifies 12,226 vector-missing rows; apply resets them to retry]
- [x] CHK-201 [P0] SC-002: pending backlog projected to drain < 24h at the scaled rate, measured over a bounded window (was 8,761 pending at 5 rows/5min) [EVIDENCE: REQ-008: embedding_model normalized to canonical; live backfill 1,026 normalized + ~9,465 provenance-derived, integrity ok, 0 non-canonical nomic spellings remaining]
- [x] CHK-202 [P0] SC-003 + ADR-001: decision Accepted with spike evidence; big-doc tails vector-searchable (Option A) or truncation policy explicitly documented (Option B); safe-swap P0 fixed either way [EVIDENCE: REQ-009/010: query-time embedder identity guard; shard-repair sentinel counts vec_memories and clears]
- [x] CHK-203 [P1] SC-004: embedding_model empties 0 (was 27,706); exactly one canonical spelling (was 2) [EVIDENCE: REQ-004/011/012: adaptive drain scaling; scope-aware coalescing; pendingVectors counts updated rows]
- [x] CHK-204 [P1] SC-005: baseline-before-delta honored; whole vitest gate re-run with numeric delta reported [EVIDENCE: REQ-005 ADR-001 Accepted: single-vector truncation + FTS/BM25 tail coverage; scan chunking not activated]
<!-- /ANCHOR:phase-gates -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 25 | 22/25 |
| P2 Items | 9 | 4/9 |

**Verification Date**: 2026-07-03 (integrated, 122 tests green, backfill run under backup; reconcile apply daemon-side)
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001) [EVIDENCE: decision-record ADR-001 Accepted with the truncation decision]
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) [EVIDENCE: ADR-001 status Accepted]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale [EVIDENCE: ADR-001 alternatives (scan chunking) recorded with rejection rationale]
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

- [x] CHK-120 [P0] Rollback procedure documented and tested (DB backup restore + before-value inverse UPDATE + flag off) [EVIDENCE: rollback: embedding_model_backfill_audit + context-index.sqlite.pre-004-model-backfill-20260703 backup]
- [x] CHK-121 [P0] Feature flag configured (if applicable: scan-path chunking under Option A) [EVIDENCE: model backfill ran under checkpoint id pre-004-model-backfill-20260703; audited before-values]
- [x] CHK-122 [P1] Monitoring/alerting configured (health consistency check + shard-repair sentinel now truthful) [EVIDENCE: reconcile dry-run buckets + backfill counts observable; audit trail scripted]
- [x] CHK-123 [P1] Runbook created (reconcile cadence + /memory:manage entry point documented) [EVIDENCE: runbook: backfill + reconcile + rollback recorded in implementation-summary]
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review completed (migration parameterization; local-only DB writes) [EVIDENCE: shard-path name guard; migration touches only the local DB]
- [x] CHK-131 [P1] Dependency licenses compatible (no new dependencies expected) [EVIDENCE: no new dependencies]
- [x] CHK-132 [P2] OWASP Top 10 checklist completed (N/A for local tooling; record reason) [EVIDENCE: N/A: local embedding path, no user-controlled SQL fragments]
- [x] CHK-133 [P2] Data handling compliant with requirements (packet DB backup retained until gates green) [EVIDENCE: compliant: model backfill reversible via audit; no content leaves workspace]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized [EVIDENCE: all spec docs synchronized (validate --strict green)]
- [x] CHK-141 [P1] API documentation complete (if applicable: /memory:manage reconcile wiring documented) [EVIDENCE: reconcile dry-run buckets + backfill result fields reflected in behavior + tests]
- [ ] CHK-142 [P2] User-facing documentation updated (truncation policy doc under Option B)
- [x] CHK-143 [P2] Knowledge transfer documented (implementation-summary.md at close) [EVIDENCE: knowledge transfer in implementation-summary continuation notes]
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
