---
title: "Plan: spec-memory vitest stabilization [template:level_1/plan.md]"
description: "Cluster-by-cluster remediation plan for 168 pre-existing vitest failures."
trigger_phrases:
  - "008 vitest plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/008-spec-memory-vitest-stabilization"
    last_updated_at: "2026-05-21T13:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan scaffolded"
    next_safe_action: "Execute cluster 1 first (cheapest, smallest blast radius)"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: spec-memory vitest stabilization

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Five-cluster remediation. Cluster ordering: cheapest + smallest blast radius first; broadest + flakiest last. Total estimate: 1-3 working days for high-confidence clusters (1, 5, 3, 2), open-ended for cluster 4.

| Phase | Cluster | What | Wall clock |
|-------|---|------|------|
| A | 1 — mock exports | Audit `stage1-expansion.vitest.ts` mock setup; add missing exports | ~1-2 hours |
| B | 5 — flag/config | Reconcile test expectations with current `search-flags.ts` defaults | ~1-2 hours |
| C | 3 — lease timeouts | Bump timeouts or rewrite waits in `launcher-lease.vitest.ts` | ~2-4 hours |
| D | 2 — MCP connection flakes | Investigate `runtime-routing.vitest.ts` lifecycle; fix or quarantine | ~4-8 hours |
| E | 4 — assertion drift | Sample 5-10 tests; identify shared root cause; fix or quarantine the rest | ~8-24+ hours |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

```
COMPLETE iff
  npx vitest run tests/ exits 0 OR all remaining failures marked .skip with explicit reason
  AND each cluster has a §Root Cause subsection in implementation-summary
  AND no production code under lib/ was modified
ELSE PARTIAL (clusters fixed are listed; remainder deferred to follow-on packet).
```

Auxiliary:
- strict-validate exit 0 on this packet
- focused vitest runs from Dispatch C (skill-advisor 34 tests + spec-kit embedder-sidecar 10 tests + system-skill-advisor pytest 4 tests) still PASS after this work
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

This packet does NOT change production code. All edits are in `tests/` paths.

### Cluster 1 — mock exports (cheapest)
The `stage1-expansion.vitest.ts` test file mocks `vector-index` but the mock object is missing `generateQueryEmbedding`. Pattern:
```ts
vi.mock('../lib/search/vector-index', () => ({
  // missing: generateQueryEmbedding
  ...
}));
```
Fix: add the missing export (probably a `vi.fn()`).

### Cluster 5 — flag/config drift (cheap)
`profile-db-filename.vitest.ts` and local-llm tests assume defaults that have shifted. Audit each failure; update assertions to match current `lib/search/search-flags.ts`.

### Cluster 3 — lease timeouts (medium)
`launcher-lease.vitest.ts` has `Timed out waiting for lease pid` failures. Options:
1. Bump timeout from default (1s?) to 5s
2. Switch the wait loop from polling to event-based (file watcher)
3. Pre-warm the lease before the test asserts

Pick the lightest fix that stabilizes 3 consecutive runs.

### Cluster 2 — MCP connection (medium-large)
`runtime-routing.vitest.ts` failures all show `MCP error -32000: Connection closed`. The test helper spawns an MCP server child but the child dies before the assertion runs. Investigate:
- Is the child OOM'ing?
- Is there a race between spawn and the first request?
- Is the port colliding with other tests?

Fix the helper OR quarantine the 25 tests with an issue tracking the production-side investigation.

### Cluster 4 — assertion drift (open-ended)
127 failures across many files. Most likely root cause hypothesis: shared SQLite test DB carrying state across runs. Verify:
```bash
# Look for shared fixture DB usage
grep -rl "context-index.sqlite\|memory.db\|test.db" tests/
```
If shared, each test should use a `tmpdir` SQLite. Refactor the test base class to spin up an isolated DB per test.

If the root cause is NOT shared state, sample 5 more tests and re-hypothesize.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Cluster 1

1. Run `npx vitest run tests/stage1-expansion.vitest.ts` and capture the exact error
2. Inspect the `vi.mock` block; identify missing exports
3. Add the missing `vi.fn()` exports
4. Re-run: expect 13/13 pass

### Phase B — Cluster 5

1. Run `npx vitest run tests/profile-db-filename.vitest.ts tests/local-llm-*.vitest.ts`
2. For each failure, inspect the assertion + the current `search-flags.ts` default
3. Update the assertion OR set env explicitly in `beforeEach`
4. Re-run: expect all 4 pass

### Phase C — Cluster 3

1. Run `npx vitest run tests/launcher-lease.vitest.ts --reporter=verbose`
2. Identify the timeout value
3. Bump to 5s OR rewrite the wait condition
4. Run 3 consecutive times; expect all 7 pass each run

### Phase D — Cluster 2

1. Inspect `tests/runtime-routing.vitest.ts` MCP child spawn helper
2. Add logging around child PID + ready signal
3. Run with `vitest --no-isolate` to see lifecycle order
4. Either fix the helper OR mark all 25 `.skip` with a reason comment

### Phase E — Cluster 4 (open-ended)

1. Sample 5 failing tests across diverse files
2. Check if they share SQLite state by reading their setup hooks
3. If yes: refactor to per-test tmpdir; fix all 127 at once
4. If no: pick top-5 lowest-hanging-fruit; quarantine the rest with `.skip`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

After each phase:
- Re-run the target test file; assert pass
- Re-run the full focused suites that Dispatch C verified still pass
- Track delta vs baseline (168 failures) in the implementation-summary

Final gate: `npx vitest run tests/` exit 0 OR documented `.skip` reasons for any remaining failure.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- mk-spec-memory mcp_server source code (read-only)
- `vitest` test runner (already installed via npm)
- `vi.fn()` + `vi.mock()` API
- SQLite test DB lifecycle helpers (likely under `tests/_helpers/`)
- The 2026-05-21 deep-research finding inventory (this packet was scoped from those findings)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This packet only touches `tests/` files. To revert:
1. `git checkout HEAD~1 -- .opencode/skills/system-spec-kit/mcp_server/tests/`
2. Rebuild: `cd .opencode/skills/system-spec-kit/mcp_server && npm run build`

No production rollback needed because no production code is changed.
<!-- /ANCHOR:rollback -->
