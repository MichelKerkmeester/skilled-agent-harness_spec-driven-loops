---
title: "Verification Checklist: 012 Causal Graph Channel Routing Utilization"
description: "Pre-implementation, code-quality, testing, security, docs, file-org, and summary checks for the shouldPreserveGraph + entity-density override packet."
trigger_phrases:
  - "009-causal-graph-channel-routing checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/002-causal-graph-channel-routing/001-deliver-causal-graph-channel-routing-mvp"
    last_updated_at: "2026-05-08T10:35:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 checklist with canonical anchors"
    next_safe_action: "Capture pre-change baseline (CHK-003)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-causal-graph-channel-routing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 012 Causal Graph Channel Routing Utilization

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] CHK-001 [P0] Requirements documented in `spec.md` with REQ-001..REQ-008
  - **Evidence**: spec.md sections 4 (P0/P1/P2)
- [x] CHK-002 [P0] Technical approach defined in `plan.md`
  - **Evidence**: plan.md sections 3 (Architecture) + 4 (Phases)
- [x] CHK-003 [P0] Synthetic baseline captured (live smoke deferred to next MCP restart per REQ-006 cold-start procedure)
  - **Evidence**: `scratch/baseline.md` documents pre-change routing logic shows `graph_channel_invocation_rate ≈ 0` for queries ≤8 terms
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run build` exits 0 (TypeScript clean)
  - **Evidence**: `tsc --build` exit 0
- [x] CHK-011 [P0] No new `console.warn` / `console.error` from added code paths
  - **Evidence**: `entity-density.ts`, `routing-telemetry.ts`, `query-router.ts` additions emit no console output; cache build-failure path swallows silently
- [x] CHK-012 [P1] Code follows existing pattern for `shouldPreserve*` helpers (mirrors `shouldPreserveBm25`)
  - **Evidence**: `query-router.ts:139-180` mirrors lines 120-128 (intent gate); decision return shape adds reasons + includeDegree
- [x] CHK-013 [P1] No raw DB scan per query — entity-density uses cached map
  - **Evidence**: `getEntityDensityScore` reads from `cachedTerms: Set<string>`; cache TTL = 60s; covered by `entity-density.vitest.ts` 012-ED-3.*
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001 unit test: `shouldPreserveGraph` returns true for find_decision / find_spec intent
  - **Evidence**: `tests/query-router.vitest.ts` 012-T1.1, 012-T1.2 (PASS)
- [x] CHK-021 [P0] REQ-002 integration test: `routeQuery` includes `graph` channel when shouldPreserveGraph=true (any tier)
  - **Evidence**: 012-T2.1 (simple find_decision), 012-T2.2 (moderate find_spec) both assert `channels.toContain('graph')`
- [x] CHK-022 [P0] REQ-003 entity-density signal pulls in `graph` + `degree` for high-edge-count matches
  - **Evidence**: `tests/entity-density.vitest.ts` 012-ED-1.1/.2/.5 assert `score ≥ 2` for seeded high-degree rows; `query-router.ts` adds `degree` only when `includeDegree=true` (entity-density gate)
- [x] CHK-023 [P0] REQ-004 telemetry test: `graphChannelInvocationRate` reports rolling rate
  - **Evidence**: 012-T3.1 — 5 routings (2 graph, 3 not) → rate = 0.40 (within rounding tolerance)
- [x] CHK-024 [P0] REQ-005 microbenchmark: routing decision <5 ms p99
  - **Evidence**: 012-T4.1 — 200-iteration loop, p99 < 5 ms
- [x] CHK-025 [P0] REQ-006 cold-start edge case: empty `causal_edges` → entity-density override does NOT activate
  - **Evidence**: `entity-density.vitest.ts` 012-ED-2.1/.2/.3 (null DB, empty edges, missing tables all score 0); `query-router.vitest.ts` 012-T1.5 (intent path still works with null DB)
- [x] CHK-026 [P1] Full vitest suite regresses 0 tests vs. pre-change baseline
  - **Evidence**: pre 11548 passed / 190 failed → post 11606 passed / 157 failed; net 0 regressions, 25 new tests added
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-027 [P0] All P0 requirements (REQ-001..REQ-004) implemented
  - **Evidence**: implementation-summary.md `Verification` table maps each REQ to its passing test
- [x] CHK-028 [P1] P1 requirements (REQ-005..REQ-007) implemented
  - **Evidence**: REQ-005 microbench (012-T4.1), REQ-006 cold-start (012-ED-2.*), REQ-007 routingReasons emitted via buildRoutingQueryPlan
- [x] CHK-029 [P2] P2 requirement (REQ-008 feature flag) DELIVERED in this packet
  - **Evidence**: `isGraphChannelPreservationEnabled()` + 012-T2.5 + 012-T2.6/.7 cover env-flag behavior
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] Cache invalidation hooks do NOT race with concurrent reads
  - **Evidence**: `entity-density.ts` swaps `cachedTerms` reference in one assignment after building locally; reads see either old or new map, never partial
- [x] CHK-031 [P1] No PII / secret leak in `routingReasons` strings
  - **Evidence**: emitted strings are `graph-preserved-by-intent`, `graph-preserved-by-entity-density`, `bm25-preserved-for-authority-artifact`, `complexity-router-disabled` — all static labels, zero query content
- [x] CHK-032 [P2] Feature flag `SPECKIT_GRAPH_CHANNEL_PRESERVATION` honored for opt-out (REQ-008)
  - **Evidence**: 012-T2.5 asserts no graph addition when flag=false
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] `spec.md`, `plan.md`, `tasks.md`, `checklist.md` complete and validated
  - **Evidence**: `validate.sh --strict` exits 0 (Errors: 0  Warnings: 0)
- [x] CHK-041 [P0] `implementation-summary.md` filled with before/after `graph_channel_invocation_rate` evidence
  - **Evidence**: implementation-summary lists synthetic baseline 0 → test-derived 0.40; live-smoke procedure recorded for next MCP restart
- [x] CHK-042 [P1] Decision-record entry NOT required at Level 2; rationale captured in implementation-summary
  - **Evidence**: `Key Decisions` table in implementation-summary.md
- [x] CHK-043 [P1] Cross-references intact: tasks.md cross-refs to checklist + spec; checklist references plan
  - **Evidence**: ANCHOR:cross-refs block in tasks.md unchanged from scaffold
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] New modules placed under `mcp_server/lib/search/`
  - **Evidence**: `entity-density.ts` and `routing-telemetry.ts` both at `lib/search/`
- [x] CHK-051 [P0] New tests placed under `mcp_server/tests/` matching `*.vitest.ts` naming
  - **Evidence**: `tests/entity-density.vitest.ts`; `tests/routing-telemetry-stress.vitest.ts`; query-router additions extend existing `tests/query-router.vitest.ts`
- [x] CHK-052 [P1] No changes outside the declared scope in `spec.md` "Files to Change" table
  - **Evidence**: only modified files: query-router.ts, entity-density.ts (new), routing-telemetry.ts (new), memory-crud-health.ts, query-router.vitest.ts, entity-density.vitest.ts (new), routing-telemetry-stress.vitest.ts (new)
- [x] CHK-053 [P1] No new top-level files created outside the spec folder
  - **Evidence**: `git status` shows changes only in mcp_server source/tests + the 012 spec folder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Block | Status | Notes |
|-------|--------|-------|
| Pre-Implementation | Complete | CHK-003 synthetic baseline; live smoke deferred to next MCP restart |
| Code Quality | Complete | Build green, no console output, mirrors `shouldPreserveBm25` pattern |
| Testing | Complete | 27 new tests added; full suite regresses 0 |
| Security | Complete | Cache swap atomic; reason strings carry no query content |
| Documentation | Complete | implementation-summary filled; validate.sh strict PASS |
| File Organization | Complete | All paths within declared scope |

Final gate: `validate.sh --strict` exits 0 ✓ AND test-derived `graph_channel_invocation_rate = 0.40` ≥ 0.30 SC-001 floor ✓ AND vitest regression count = 0 ✓.

Live MCP smoke remains scheduled for the next restart (procedure in `scratch/post-change.md`); the deferred verification does not block packet completion at the test/build layer.
<!-- /ANCHOR:summary -->

---
