---
title: "Tasks: 012 Causal Graph Channel Routing Utilization"
description: "Task list for the shouldPreserveGraph + entity-density override + telemetry packet."
trigger_phrases:
  - "009-causal-graph-channel-routing tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/002-causal-graph-channel-routing/001-deliver-causal-graph-channel-routing-mvp"
    last_updated_at: "2026-05-08T10:35:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author tasks for graph-channel routing utilization"
    next_safe_action: "Capture pre-change baseline (T001), then T004 shouldPreserveGraph helper"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 012 Causal Graph Channel Routing Utilization

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Spec authored — `spec.md`
- [x] T002 Plan authored — `plan.md`
- [x] T003 Tasks authored — `tasks.md`
- [x] T003a Synthetic baseline captured in `scratch/baseline.md` (live smoke deferred to next MCP restart per REQ-006 cold-start procedure)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `shouldPreserveGraph(query)` to `query-router.ts` mirroring `shouldPreserveBm25` (REQ-001)
- [x] T005 Create `entity-density.ts` with `getEntityDensityScore` + cached title→edge-count map (REQ-003)
- [x] T006 Wire `shouldPreserveGraph` + entity-density into `routeQuery()`; emit `graph-preserved-by-*` reasons (REQ-002, REQ-007)
- [x] T007 Create `routing-telemetry.ts` with rolling-window per-channel counter (REQ-004)
- [x] T008 Surface `data.routing.graphChannelInvocationRate` in `memory_health` handler (REQ-004)
- [x] T009 [P] Unit tests for `shouldPreserveGraph` (REQ-001) — `tests/query-router.vitest.ts` 012-T1.*
- [x] T010 [P] Integration tests for `routeQuery` channel-list adjustment (REQ-002) — 012-T2.*
- [x] T011 [P] Edge-case test for cold-start DB (REQ-006) — `tests/entity-density.vitest.ts` 012-ED-2.*
- [x] T012 [P] Microbenchmark for routing latency p99 (REQ-005) — 012-T4.1
- [x] T013 [P] Feature-flag wiring for `SPECKIT_GRAPH_CHANNEL_PRESERVATION` (REQ-008, P2)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 `cd mcp_server && npm run build` exits 0
- [x] T015 Full vitest: 11606 passed / 157 failed vs baseline 11548 / 190 — 0 net regressions, 25 new tests added
- [x] T016 Synthetic baseline + test-derived rate (012-T3.1 = 0.40) recorded in `scratch/post-change.md`; live MCP smoke captured in `scratch/live-smoke-results.md` (2026-05-08T14:47Z, post-MCP-restart) — `data.routing.graphChannelInvocationRate` moved from 0.714 (21 prior) to 0.625 across 40 routings; intent-only path verified to add `graph` WITHOUT `degree` (parity broken cleanly: graph=0.625 vs degree=0.525)
- [x] T017 `validate.sh --strict` exits 0
- [x] T018 `implementation-summary.md` filled
- [x] T020 Stress test FULL COVERAGE — 012-T4.1 microbenchmark green + new `routing-telemetry-stress.vitest.ts` 11/11 PASS (012-S1.*: ring overflow ×4; 012-S2.*: 1000-iter latency p99<5ms ×2; 012-S3.*: cache invalidation under stress ×2; 012-S4.*: feature flag OFF live-path ×3). Plus 25 live `memory_search` calls producing 104 new routing decisions; 37/104 had graph WITHOUT degree (empirical spec-compliance). Final live snapshot: graph=0.568 vs degree=0.304. All sub-criteria PASS, no deferred items. Results in `scratch/stress-test-results.md`.
- [ ] T019 `/memory:save` to persist continuity (next user-driven step)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 + P1 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Tests + build green; zero net regressions
- [ ] Post-change smoke shows `graph_channel_invocation_rate ≥ 0.30`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Routing precedent**: `mcp_server/lib/search/query-router.ts:120-128` (`shouldPreserveBm25`)
- **Causal stats baseline**: `memory_causal_stats` snapshot 2026-05-08T10:34Z — 1,328 edges, 46.14% coverage
<!-- /ANCHOR:cross-refs -->

---
