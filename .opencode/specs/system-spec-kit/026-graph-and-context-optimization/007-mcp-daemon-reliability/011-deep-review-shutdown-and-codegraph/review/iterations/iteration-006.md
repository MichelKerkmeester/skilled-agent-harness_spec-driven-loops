# Iteration 006 — Completeness/Maintainability

**Verdict:** PASS | **Findings:** P0=0 P1=0 P2=1 | **newFindingsRatio:** 1.0 | **adversarial P0 replays:** 0

## Findings

### [P2] CM-01 — test-coverage-gap  (confidence 0.72)
- **[SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts:78-102]** · finding_class: `test-isolation`
- **Evidence:**
```
const shardCheckpointIndex = pragmaSpy.mock.calls.findIndex(
  ([statement]) => statement === `${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`,
);
... expect(shardCheckpointIndex).toBeGreaterThanOrEqual(0);
```
- **Why:** The shard-checkpoint-before-DETACH ordering test silently depends on initializeDb actually ATTACHing the shard (initialize_db -> attachActiveVectorShard at vector-index-store.ts:1247). If a future refactor made sqlite-vec unavailable in the test env so no shard attaches, get_attached_vector_path(db) would be falsy, close_db would still call the shard-checkpoint pragma (line 1305 runs unconditionally) so the test would NOT regress to a false pass here -- but the DETACH at line 808 is guarded by get_attached_vector_path, so detachIndex could become -1 and the test would fail loudly. Net: the test is sound today but its meaningfulness is implicit, not asserted (no precondition assert that the shard was attached). Low-risk maintainability note only.
- **Fix:** Add an explicit precondition assertion (e.g. expect a prior ATTACH exec call or non-null get_attached_vector_path) so the ordering test cannot silently degrade if shard attach stops happening.

## Coverage
Covered: all four scoped test files read in full and cross-checked against their implementation targets. (1) vector-index-store.vitest.ts -> close_db (vector-index-store.ts:1286-1311), checkpointAllWal (1313-1317), detachActiveVectorShard (804-809), initialize_db/attachActiveVectorShard (1164/1247), and export aliases (initializeDb@1596, checkpointAllWal@1313, clearConstitutionalCache@1605, get_constitutional_memories@1029, ACTIVE_VECTOR_SCHEMA@324) -- all exist and tests assert real fix behavior including a true at-rest durability/WAL-size-0 integration test. (2) ensure-ready.vitest.ts -> ensureCodeGraphReady@624 / getGraphFreshness@807; asserted fields autoRescanSafety/autoRescanBlockReason/selfHealAttempted/parse_error_backlog/auto-establish reason strings all present in ensure-ready.ts. (3) code-graph-default-scope.vitest.ts -> isDefaultEndUserScope@56 + resolveIndexScopePolicy@223 signatures match {env}, {includeSkills:[]} usage. (4) code-graph-tool-args-validation.vitest.ts -> validateToolArgs + schema bounds (limit max 1000@56, maxDepth max 20@58, queryMode enum without 'sideways'@80, error message strings@234/248/254) all match tool-schemas.ts. Verified all test files are collected by their vitest configs (spec-kit include glob mcp_server/tests/**; code-graph include glob covers all three; vector-index-store not in any exclude). Docs (ARCHITECTURE.md / SKILL.md) checked for WAL/daemon-reliability + auto-establish/guarded-scan drift: ensureCodeGraphReady false-safe contract documented (ARCHITECTURE.md:116, ADR-003:166); WAL-checkpoint work correctly absent from code-graph docs since it lives in system-spec-kit. No dead code, no docs-vs-code drift, no false-positive/vacuous assertions found. NOT verified: did not execute the test suites (read-only review, no test run); did not inspect the daemon-reliability launcher/IPC code referenced in recent commits (out of scoped-file set); only spot-checked the ensure-ready.ts decision branches via grep rather than full line-by-line of the 800-line file.

Review verdict: PASS
