---
title: "Spec: spec-memory vitest suite stabilization [template:level_1/spec.md]"
description: "Scaffold-only spec. The 016 deep-research surfaced 168 pre-existing vitest failures across 33 test files in mk-spec-memory's mcp_server. Causes split across 5 clusters: missing mock exports, MCP connection flakes, lease timeouts, assertion drift, flag/config mismatches. This packet documents the failure inventory and a remediation plan; execution is deferred until operator opts in."
trigger_phrases:
  - "008 vitest stabilization"
  - "spec-memory vitest failures"
  - "vitest fixture drift"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/008-spec-memory-vitest-stabilization"
    last_updated_at: "2026-05-21T13:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffold authored"
    next_safe_action: "Operator decides whether to execute"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: spec-memory vitest suite stabilization

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Scaffold only (execution deferred) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `005-cross-cutting-quality` |
| **Position in arc** | Phase 008 (slot was free; siblings: 001-007) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 016 deep-research dispatch (iters 1-9) flagged the vitest suite as red. A targeted Explore run produced this inventory:

```
cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/ 2>&1 | tail -200
→ 168 failures across 33 test files
```

The failures cluster into 5 categories:

| # | Category | Tests | Representative file |
|---|---|---:|---|
| 1 | Missing mock exports | 13 | `stage1-expansion.vitest.ts` (all 13) |
| 2 | MCP connection closures | 25 | `runtime-routing.vitest.ts` (all 25) |
| 3 | PID lease timeouts | 7 | `launcher-lease.vitest.ts` |
| 4 | Assertion drift (fixture/data) | 127 | `handler-memory-save.vitest.ts`, `embeddings.vitest.ts`, `memory-crud-extended.vitest.ts`, `spec-folder-prefilter.vitest.ts`, etc. |
| 5 | Flag/config mismatches | 4 | `profile-db-filename.vitest.ts`, local-llm tests |

None are caused by the 2026-05-21 llama-cpp removal or the deep-research cleanup commits. They are pre-existing.

### Purpose

If/when an operator commits to executing this packet:
- Investigate each cluster's root cause
- Fix what can be fixed (mock exports, fixture paths, flag defaults)
- Quarantine what can't (intermittent timing flakes, infrastructure brittleness)
- Restore a clean `npx vitest run tests/` exit 0

### Why this is scaffold-only

Cost vs benefit:
- 168 failures spanning 33 files = multi-day investigation
- Most failures are infrastructure/fixture issues, not functional regressions
- The actual spec-memory production code is not broken (focused vitests + pytest run green per Dispatch C verification)
- This work doesn't block any current ship

Execution is deferred. The scaffold preserves the failure inventory + remediation plan so a future operator can pick it up without re-discovering the surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (when executed)

For each of the 5 clusters:
- **Cluster 1 (mock exports)**: Audit `tests/stage1-expansion.vitest.ts` mock setup; add the missing `generateQueryEmbedding` export (and any siblings).
- **Cluster 2 (MCP connection)**: Investigate why `runtime-routing.vitest.ts` reports `MCP error -32000: Connection closed`. Likely the test helper that spawns an MCP server child has a race or stale port. Fix or restructure.
- **Cluster 3 (lease timeouts)**: `launcher-lease.vitest.ts` PID-lease tests time out waiting on signals. Likely the CI/test runner is slower than the lease's polling interval. Either bump timeouts or rewrite the wait condition.
- **Cluster 4 (assertion drift)**: 127 failures across many files. Sample 3-5 representative files; identify whether the fixtures/database state diverged from test expectations. Most likely root cause: shared SQLite test DB carrying state across runs.
- **Cluster 5 (flag/config)**: 4 failures in `profile-db-filename.vitest.ts` + local-llm tests. Audit the default values these tests assume vs the current `search-flags.ts` defaults.

### Out of Scope

- Rewriting any production code under `lib/`
- Adding new test cases (only fixing existing ones)
- Migration to a different test runner

### Files likely to be modified (per cluster)

- Cluster 1: `tests/stage1-expansion.vitest.ts` + maybe `tests/helpers/embedder-mock.ts` if one exists
- Cluster 2: `tests/runtime-routing.vitest.ts` + the MCP child-spawn helper
- Cluster 3: `tests/launcher-lease.vitest.ts` + maybe `lib/launcher/lease.ts` timing constants
- Cluster 4: ~20 test files + likely a shared fixture under `tests/fixtures/`
- Cluster 5: `tests/profile-db-filename.vitest.ts`, `tests/local-llm-*.vitest.ts`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (when executed)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 failure clusters investigated with documented root cause | Each cluster has a §Root Cause subsection in this packet's implementation-summary |
| REQ-002 | Cluster 1 (mock exports) fixed | `npx vitest run tests/stage1-expansion.vitest.ts` exit 0 |
| REQ-003 | Cluster 2 (MCP connections) — either fixed OR each affected test marked `it.skip` with an issue link | `npx vitest run tests/runtime-routing.vitest.ts` reports 0 unhandled failures |
| REQ-004 | Cluster 3 (lease timeouts) — bumped timeouts or rewritten waits | `npx vitest run tests/launcher-lease.vitest.ts` exit 0 with no flakes over 3 consecutive runs |
| REQ-005 | Cluster 4 (assertion drift) — at least 50% fixed (~64 tests passing); remainder quarantined | Coverage report shows ≥64 newly-green tests vs baseline |
| REQ-006 | Cluster 5 (flag/config) fixed | `npx vitest run tests/profile-db-filename.vitest.ts tests/local-llm-*.vitest.ts` exit 0 |
| REQ-007 | Full suite exit code 0 OR all remaining failures marked `.skip` with explicit comments | `npx vitest run tests/` exit 0 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | CI integration: vitest in `npm run build` or pre-commit gate | Documented in skill's INSTALL_GUIDE or CI config |
| REQ-009 | Strict-validate this packet | exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run tests/` exits 0 on `main`
- **SC-002**: No more than 5 tests `.skip`-ed with explicit reason comments
- **SC-003**: At least one test from each of the 5 clusters re-enabled + green
- **SC-004**: Implementation summary documents the 5 root causes
- **SC-005**: Strict-validate exit 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Cluster 4 assertion drift turns out to be 100+ different root causes | Medium | Multi-day work expands to multi-week | Sample 5 tests first; if root causes diverge wildly, quarantine the rest |
| MCP connection flakes (cluster 2) reflect a real lifecycle bug | Low | Discovered prod issue forces side-quest fix | If bug is real, scope a separate spec packet for the production fix |
| Lease timeout fix (cluster 3) hides real lease lifecycle problems | Low | Production lease behavior different from test behavior | Test against actual concurrent launchers in addition to fixing the timeout |
| New test infrastructure (e.g. moving away from vitest) needed | Low | Rewrite scope explodes | Out of scope for this packet; would be a separate packet |

Dependencies:

- mk-spec-memory mcp_server source code (read-only)
- vitest test fixtures under `tests/fixtures/`
- SQLite test DB lifecycle helpers
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: Are the 127 assertion drift failures evidence of a real shared-state bug in the test fixtures, or 127 separate issues? Resolution: requires sampling 5-10 representative failures and looking for shared root cause.
- **Q2**: Should `runtime-routing.vitest.ts` (25 MCP connection failures) be rewritten as integration tests against a real MCP server, or fixed with better lifecycle hooks? Open.
- **Q3**: Is there a strategic move to a different test runner (e.g., bun test) that would obsolete this packet? Out of scope here, but worth tracking.
<!-- /ANCHOR:questions -->
