---
title: "Verification Checklist: Durability Stress Domain"
description: "Verification Date: 2026-06-02"
trigger_phrases:
  - "durability stress checklist"
  - "checkpoint contention verification"
  - "index scan coalescing verification"
  - "stress durability gates"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored durability stress domain (4 cases) + stress:durability script"
    next_safe_action: "None binding; durability domain green (12/12)"
    blockers: []
    key_files:
      - "mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts"
      - "mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts"
      - "mcp_server/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "durability-stress-domain-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Durability Stress Domain

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-009)
- [x] CHK-002 [P0] Technical approach defined in plan.md (3 phases, public-API reuse)
- [x] CHK-003 [P1] Dependencies identified and available (injectable reopen, repairIncompleteMarkers, db-state injection, proxy `__testing`)
- [x] CHK-004 [P0] Isolation strategy defined (mkdtemp/`:memory:`/pure-logic; never the production DB or live socket)
- [x] CHK-005 [P1] Existing stress domain layout reviewed (substrate, matrix) before scaffolding
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each case imports the real public API of its durability surface (no copy-pasted logic)
- [x] CHK-011 [P0] Each case tears down its temp DB in `afterEach`
- [x] CHK-012 [P1] No comment in the test files embeds a spec-folder path, packet/phase number, or finding id (comment hygiene)
- [x] CHK-013 [P1] The new domain reuses `vitest.stress.config.ts` rather than introducing a new config
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `npm run stress:durability` green: 12/12 across the four cases
- [x] CHK-021 [P0] Checkpoint contention case: many interleaved create+restore cycles stay lossless, no orphaned snapshot/`.tmp-` dirs, on-disk snapshot set bounded by `MAX_CHECKPOINTS`
- [x] CHK-022 [P0] index-scan coalescing case: exactly one writer admitted under a 64-wide concurrent burst; the rest back off with `lease_active`/`cooldown`
- [x] CHK-023 [P1] enrichment-marker backfill case: a 300-row `pending` flood drains to `complete` through bounded passes; incomplete set reaches zero
- [x] CHK-024 [P1] daemon-recycle case: replayable reads survive, unsafe mutations refused with `-32001`, pending set drains with no leak
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each case maps to a finding class: `test-isolation` (hermetic DBs) plus `matrix/evidence` (surface x load x isolation coverage).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed (`stress:*` npm scripts) — `stress:durability` mirrors the existing three.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `createCheckpoint`, `restoreCheckpoint`, `repairIncompleteMarkers`, `acquireIndexScanLease`, `createPendingRequestsTracker`.
- [x] CHK-FIX-004 [P0] Each durability invariant traced to its source before asserting (e.g. catalog merges on restore, so the bounded property is the on-disk snapshot set, not the catalog count).
- [x] CHK-FIX-005 [P1] Matrix axes listed: surface (checkpoint, enrichment, index-scan, recycle) x load (contention, flood, burst, in-flight) x isolation (mkdtemp, :memory:, pure-logic).
- [x] CHK-FIX-006 [P1] Hostile/global-state variant handled: the index-scan case uses the process-wide `db-state` module — it injects a throwaway DB and resets via per-test setup.
- [x] CHK-FIX-007 [P1] Evidence pinned to the captured `npm run stress:durability` output in implementation-summary.md.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced
- [x] CHK-031 [P0] No case reads or writes outside its throwaway temp directory or in-memory database
- [x] CHK-032 [P1] No case connects to the live `daemon-ipc` socket or spawns a daemon
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks synchronized at completion
- [x] CHK-041 [P1] implementation-summary.md records the real stress command and result
- [x] CHK-042 [P2] decision-record.md ADR statuses reflect the as-built approach
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test files live only under `mcp_server/stress_test/durability/`
- [x] CHK-051 [P1] No temp artifacts committed (all temp DBs are `mkdtemp`/`:memory:` and torn down)
- [x] CHK-052 [P1] No edits outside this child packet for docs, and code edits confined to the allowed stress/script paths
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | All verified this session — `npm run stress:durability` green (12/12); evidence in implementation-summary.md |
| P1 Items | 14 | Met — see implementation-summary.md verification table |
| P2 Items | 9 | 6 met; 3 deferred with documented reason (CHK-112, CHK-124, CHK-142 — opt-in soak variant, CI wiring, operator soak note) |

**Verification Date**: 2026-06-02 — durability stress domain complete, green (12/12), no config breakage
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001..ADR-004)
- [x] CHK-101 [P1] All ADRs have status (Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (daemon harness reuse, raw throughput asserts, separate config)
- [x] CHK-103 [P2] Public-API-reuse boundary documented (no production runtime code touched)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] The whole domain completes in a few seconds (no daemon startup) — NFR-P01
- [x] CHK-111 [P1] Load counts (40 round-trips, 300-row flood, 64-wide burst, 200 in-flight) are bounded and deterministic
- [ ] CHK-112 [P2] Optional opt-in soak variant with larger counts — deferred (open question)
- [x] CHK-113 [P2] Domain run duration recorded in implementation-summary.md
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented (remove the directory + script line; purely additive)
- [x] CHK-121 [P0] Domain is safe to run against a live operator session (hermetic isolation)
- [x] CHK-122 [P1] Durability + an existing domain run together proven green
- [x] CHK-123 [P1] `stress:durability` script follows the existing `stress:*` convention
- [ ] CHK-124 [P2] CI wiring for the new domain — deferred to the orchestrator's CI config
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P0] Accuracy guardrails honored: `-32001` asserted LIVE (not removed); README "36-tool" and `SCHEMA_VERSION` not altered
- [x] CHK-131 [P1] No new dependencies introduced (uses existing better-sqlite3 + vitest)
- [x] CHK-132 [P2] Recycle replay partition reviewed against the proxy's real `classifyFrame`
- [x] CHK-133 [P2] Snapshot files at rest are confined to throwaway temp dirs
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All packet documents synchronized at completion
- [x] CHK-141 [P1] Domain README documents the run recipe and isolation boundary
- [ ] CHK-142 [P2] Operator note on opt-in soak counts — deferred (open question)
- [x] CHK-143 [P2] Continuity captured in implementation-summary.md `_memory.continuity`
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Orchestrator | [ ] Approved | |
| Stress gate | `npm run stress:durability` | [x] Green (12/12) | 2026-06-02 |
| Isolation | Hermetic-DB review | [x] Confirmed | 2026-06-02 |
<!-- /ANCHOR:sign-off -->
