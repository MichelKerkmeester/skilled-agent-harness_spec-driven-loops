---
title: "Implementation Plan: Query-Time Existence Filter Benchmark & Hardening"
description: "A read-only-corpus latency harness for REQ-008, a throwaway-DB concurrency stress test under stress_test/durability/, one end-to-end handler-level test for the transient-miss suspect-queue contract, and an additive aggregate exclusion counter -- no change to Layer 1/2/3 filtering, hook, or sweep logic itself."
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
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark"
    last_updated_at: "2026-07-11T17:47:04Z"
    last_updated_by: "openai-gpt-5.6-sol"
    recent_action: "Reconciled completed implementation and verification evidence into this plan"
    next_safe_action: "Use the recorded benchmark evidence for any future flag-graduation decision"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts"
      - ".opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation/002-retrieval-class-weights/scripts/retrieval-class-routing-benchmark.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-020-query-time-filter-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Query-Time Existence Filter Benchmark & Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node (mcp_server), one standalone `.mjs` benchmark script |
| **Framework** | vitest for the two new test files; a plain Node script (no test framework) for the benchmark, matching `004-dark-flag-graduation`'s existing harness shape |
| **Storage** | A read-only backup of the live SQLite corpus/vector shard for the benchmark; a throwaway in-memory `better-sqlite3` DB for the stress test and the e2e test (matching `stress_test/durability/`'s and `memory-drift-healing.vitest.ts`'s existing isolation patterns) |
| **Testing** | vitest (`npm run stress:durability` for the new stress file, the normal test run for the e2e file); the benchmark script is not itself a test, its output is evidence captured into `implementation-summary.md` |

### Overview
Four narrow, independent work items, each closing one gap identified in `spec.md`'s Problem Statement
against the already-shipped `011`/`014` implementation. None of the four touch Layer 1's filtering logic,
Layer 2's git hook, or Layer 3's sweep/confirm pass -- three are new measurement/test assets, and the
fourth (REQ-004) is one additive counter riding alongside code that already exists.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Requirements documented in spec.md with concrete acceptance criteria
- [x] The four cited gaps (REQ-008 unexecuted, single-process-only concurrency proof, split unit/confirmation
      coverage, ephemeral telemetry) re-confirmed against the live tree, since `011`/`014` may still be
      uncommitted at implementation time
- [x] `004-dark-flag-graduation`'s benchmark safety pattern and `stress_test/durability/`'s isolation
      pattern reviewed as the two structural precedents this phase reuses

### Definition of Done
- [x] All four REQ-001..REQ-004 acceptance criteria met with evidence in `implementation-summary.md`
- [x] New tests passing: the stress file under `npm run stress:durability`, the e2e file under the normal
      vitest run
- [x] `011/checklist.md` CHK-064 closed with a pointer to this phase's evidence (REQ-005)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary, plus `ENV_REFERENCE.md`)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Four self-contained, additive work items over an already-shipped feature. No new production subsystem;
the only production-code diff is the aggregate counter in REQ-004.

### Key Components

**REQ-001 -- latency benchmark harness.** A new standalone script,
`scripts/query-time-filter-latency-benchmark.mjs`, living under this packet's own folder (mirroring
`004-dark-flag-graduation`'s per-child convention of a self-contained `scripts/` + `results/` pair, even
though this packet is not nested under `004`). It follows `002-retrieval-class-weights/scripts/
retrieval-class-routing-benchmark.mjs`'s established shape: resolve the `mcp_server` dist build, open a
read-only backup of the live corpus DB and vector shard (never the source for writes), run a representative
query set through the production `memory_search` path once with `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` unset
and once with it set to `true`, repeat each query enough times to get a stable warm reading, and record
per-query wall-clock latency. The query set can reuse or adapt an existing labeled/representative set from
a sibling benchmark (e.g. `002-retrieval-class-weights`'s query fixtures) rather than inventing a new corpus
sample from scratch, since the property under test (added existence-check overhead) is query-shape-agnostic
-- what matters is result-set size (top-k), not query semantics. Output: a `results/*.json` file plus a
`benchmark-results.md` summary, with p50/p95/mean reported for both states and the delta expressed as a
fraction of baseline query time, matching the reporting shape `implementation-summary.md`'s Verification
table will cite.

**REQ-002 -- concurrency stress test.** A new file,
`mcp_server/stress_test/durability/query-time-existence-filter-concurrency-stress.vitest.ts`, following
`index-scan-coalescing-stress.vitest.ts`'s exact isolation pattern: a throwaway in-memory `better-sqlite3`
DB installed via the injectable `db-state.init()` hook (`dbState.init({ vectorIndex: { getDb, initializeDb }
})`), never the production DB or a real daemon. The test seeds a fixture with a mix of existing and
missing-path rows, then fires a wide concurrent burst (at least 64, matching the existing precedent's
concurrency width) of `applyQueryTimeExistenceFilter()` calls (or, if feasible without excessive setup, full
`memory_search` handler calls) against the shared connection, asserting: every call resolves (no hang);
calls either complete the suspect-queue write or degrade via the existing 25ms fast-fail `busy_timeout`
bound (`memory-search.ts:421-437`) -- never blocking for the connection's full default timeout; and the
suspect-queue table is readable and contains no partial/corrupt rows afterward. This is a connection-level
contention proof (matching what F8 actually changed), not a multi-process daemon-lifecycle proof -- that
different class of concurrency (daemon crash/recycle/re-election) is already covered by this same
directory's `daemon-reelection-*` and `daemon-recycle-transparency-stress.vitest.ts` files and is out of
scope here.

**REQ-003 -- end-to-end transient-miss test.** A new file, `mcp_server/tests/
memory-search-transient-miss-e2e.vitest.ts`, kept separate from `suspect-confirmation.vitest.ts` (which
stays scoped to scan-only confirmation behavior) and from `memory-drift-healing.vitest.ts` (which stays
scoped to the internal-testable unit level). The new test wires a temp workspace the same way
`suspect-confirmation.vitest.ts` already does (`makeTempWorkspace`, `loadRealModules`, `seedSuspectCandidate`
helpers already present in that file and reusable here), then drives, in one test body: `handler.search()`
(or the equivalent public `memory_search` entrypoint) with the flag on against a fixture with one missing
file -- assert exclusion and suspect-queue presence; restore the file on disk; call `handler.search()` again
-- assert inclusion; call `handler.runIndexScan()` -- assert the suspect entry clears with no tombstone
write. Reuses existing fixture-building helpers rather than duplicating them.

**REQ-004 -- aggregate exclusion counter.** Extends the existing per-query telemetry site
(`memory-search.ts:1722-1726`, fed by `QueryTimeExistenceFilterStats` at `:214-219`) with an accumulation
step. Two candidate mechanisms, either acceptable, final choice made at implementation time and recorded in
`implementation-summary.md`'s Key Decisions:
  - **Option A (persisted):** a new config-table counter row in `memory-drift-healing.ts`, reusing the exact
    read/increment/write pattern already proven for the suspect queue and the orphan-sweep cursor
    (`memory-index.ts:239`'s `config` table). Survives daemon restarts; costs one extra read+write per query
    that has at least one exclusion (matching the existing "only write when there is something to record"
    shape already used for the suspect-queue append at `memory-search.ts:421`).
  - **Option B (process-lifetime):** an in-memory module-level counter, matching
    `retrieval-telemetry.ts`'s existing per-process accumulation model. Cheaper (no I/O), resets on daemon
    restart/recycle.
  Whichever is chosen, the counter is read-accessible (a small exported getter, mirroring
  `getResponseEnvelopeSerializationDiagnostics()`'s existing pattern at `memory-search.ts:273-275`) so a
  test can assert on it directly without needing a full `memory_search` round trip per assertion.
  `ENV_REFERENCE.md`'s `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` row is updated to document both the existing
  per-query field and the new aggregate.

### Data Flow
The benchmark and the stress test are both fully self-contained -- they do not modify or read from the
production data flow at all, only exercise it against copies. REQ-004 is the only change to the live data
flow: after `applyQueryTimeExistenceFilter()` computes its per-query `stats.checked`/`stats.excluded`
(unchanged), one new accumulation call folds those numbers into the aggregate counter before the existing
`extraData.queryTimeExistenceFilter` assignment (unchanged).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict,
or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public
responses, or shared policy. Included here because REQ-004 touches the search hot path's public response
shape.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `memory-search.ts`'s `extraData.queryTimeExistenceFilter` (`:1722-1726`) | Existing per-query telemetry field | Unchanged; the aggregate counter is a separate additive field, not a replacement | A test asserts the existing per-query field's shape is byte-identical before/after this phase |
| `capability-flags.ts`'s `isQueryTimeExistenceFilterEnabled()` (`:251-253`) | Gates Layer 1 default-off | Not a consumer of this phase's changes; read as-is | No diff expected in this file |
| `memory-index.ts`'s `config` table pattern (`:239`) | Owns the orphan-sweep cursor and (via `memory-drift-healing.ts`) the suspect queue | Reused verbatim for REQ-004 Option A, not extended with a new table | grep the new counter key alongside the existing `ORPHAN_SWEEP_CURSOR_KEY`/suspect-queue key after implementation |
| `stress_test/durability/` directory | Houses 013-roadmap durability/concurrency stress coverage | Gains one new file for Layer 1's connection-contention safety, following the existing convention | `npm run stress:durability` includes the new file automatically (directory-glob run recipe) |

Required inventories:
- Same-class producers: `rg -n 'QueryTimeExistenceFilterStats|applyQueryTimeExistenceFilter' .opencode/skills/system-spec-kit/mcp_server` -- confirms the filter has exactly one production call site (`memory-search.ts:1597-1603`) before adding the counter.
- Consumers of changed symbols: `extraData.queryTimeExistenceFilter`'s only consumer today is the response envelope itself (no downstream handler reads it); the new aggregate getter's only consumer is the new REQ-004 test until a future dashboard/`/doctor` panel is built (explicitly out of scope here).
- Matrix axes: benchmark flag-on/flag-off x warm-repeat count; stress test concurrency width x contended/uncontended write; e2e test excluded/restored/confirmed-missing states.
- Algorithm invariant: the aggregate counter's total across N queries equals the sum of each query's own `stats.checked`/`stats.excluded` -- REQ-004's test asserts this directly.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-confirm all file:line references cited in spec.md and this plan against the live tree (011/014 may
      still be uncommitted at implementation time)
- [x] Confirm the `004-dark-flag-graduation` benchmark harness pattern and the `stress_test/durability/`
      isolation pattern are still current by reading one harness of each kind end to end
- [x] Identify or adapt a representative query set for REQ-001 from an existing sibling benchmark's fixtures

### Phase 2: Core Implementation
- [x] Build the REQ-001 latency benchmark harness and run it, capturing real p50/p95/mean numbers
- [x] Build the REQ-002 concurrency stress test under `stress_test/durability/`
- [x] Build the REQ-003 end-to-end handler-level test
- [x] Implement the REQ-004 aggregate counter (Option A or B, decision recorded) plus its read-accessible
      getter and `ENV_REFERENCE.md` update

### Phase 3: Verification
- [x] REQ-001 numbers written into `implementation-summary.md` with the reproduce command
- [x] REQ-002 stress test passes under `npm run stress:durability`
- [x] REQ-003 e2e test passes under the normal vitest run
- [x] REQ-004's aggregate-counter test passes and `ENV_REFERENCE.md` is updated
- [x] `011/checklist.md` CHK-064 closed with a pointer to this phase's evidence (REQ-005)
- [x] Code-review confirms no Layer 1/2/3 filtering/hook/sweep logic changed beyond the REQ-004 counter
      (REQ-006)
- [x] Documentation updated (spec/plan/tasks/checklist/implementation-summary)

### Benchmark (Specified here; run and recorded in `implementation-summary.md`)

This phase's own deliverable IS the benchmark (REQ-001), so there is no separate meta-benchmark to specify
here. The benchmark's own pass/fail framing:

**Frozen fixture**: a representative query set (adapted from an existing sibling benchmark's labeled
queries where reasonable) run against a read-only backup of the live corpus and vector shard.

| Metric | Pass threshold | Regress threshold | Reproduce |
|--------|-----------------|--------------------|-----------|
| Filter overhead (p50) | Existence-check overhead is a small fraction of total query time (REQ-001, matching `011/spec.md:256`'s framing) | Overhead is a substantial fraction of total query time, or scales with corpus size rather than result-set size | `node scripts/query-time-filter-latency-benchmark.mjs` from the packet's own folder |
| Concurrency safety | Every call in the REQ-002 burst resolves; no query blocks for the full `busy_timeout`; suspect queue stays readable | Any call hangs, throws unhandled, or the suspect queue is unreadable/corrupt afterward | `npm run stress:durability -- query-time-existence-filter-concurrency-stress` |
| Aggregate-counter correctness | Counter total equals the sum of per-query `checked`/`excluded` across the test's query sequence | Counter drifts from the summed per-query values | The REQ-004 vitest assertion |

The named tests are `stress_test/durability/query-time-existence-filter-concurrency-stress.vitest.ts` (REQ-002),
`mcp_server/tests/memory-search-transient-miss-e2e.vitest.ts` (REQ-003), and the REQ-004 aggregate-counter
assertion (added to an existing or new small telemetry test file, decided at implementation time).

**Default-safety**: `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` stays default-off throughout this phase; nothing
here changes its default. REQ-004's counter accumulates only when the flag is on (it rides inside the
already-flag-gated call site at `memory-search.ts:1597-1603`), so flag-off behavior stays byte-identical.
Runtime reversibility is unchanged from `011`: `SPECKIT_QUERY_TIME_EXISTENCE_FILTER=false` (or unset)
returns to legacy behavior with no restart needed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Benchmark | REQ-001's flag-on/flag-off latency delta on a read-only corpus backup | `query-time-filter-latency-benchmark.mjs`, plain Node, no test framework |
| Stress/Concurrency | REQ-002's connection-contention safety under a wide concurrent burst | vitest, `stress_test/durability/`, `npm run stress:durability` |
| Integration (e2e) | REQ-003's full excluded-restored-confirmed flow through the public handlers | vitest, `mcp_server/tests/memory-search-transient-miss-e2e.vitest.ts` |
| Unit | REQ-004's aggregate-counter accumulation correctness | vitest, extends or adds a small telemetry test alongside the existing `memory-drift-healing.vitest.ts`/`memory-roadmap-flags.vitest.ts` coverage |
| Regression | Confirm REQ-006: no Layer 1/2/3 behavior change beyond the counter | Code-review diff pass; existing `011`/`014` test suites re-run unmodified and still green |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `011-automatic-drift-self-healing` Layer 1 implementation | Internal | Present in the live tree as of spec time (status: In Progress, may be uncommitted) | This phase has nothing to benchmark, soak-test, or extend without it |
| `014-self-healing-internals-hardening` F8 fast-fail bound | Internal | Present in the live tree as of spec time | REQ-002's soak test would have nothing to prove holds -- the un-hardened synchronous write would simply fail the stress test outright rather than confirming a fix |
| `004-dark-flag-graduation` benchmark harness precedent | Internal (pattern reuse only, no code dependency) | Shipped, multiple children complete | Loss of this precedent would mean designing a benchmark safety pattern from scratch instead of reusing a proven one |
| `stress_test/durability/` isolation convention | Internal (pattern reuse only) | Shipped, actively maintained | Loss of this precedent would mean designing stress-test isolation from scratch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: REQ-001's benchmark reveals overhead that is NOT a small fraction of query time (contradicting
  the "cheap in principle" framing this phase was scoped under), or REQ-002's soak test surfaces a real
  concurrency bug in the shipped F8 fix.
- **Procedure**: This phase adds no production behavior change except REQ-004's counter, which is flag-gated
  and additive -- reverting it is a straight file revert with no residual state. If REQ-001 or REQ-002
  surfaces a real problem in `011`/`014`'s shipped code, that is a finding for those packets to remediate,
  not something this phase's own rollback needs to fix; this phase's rollback only concerns its own new
  assets (the benchmark script, the two new test files, the counter).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 011/014 present in the tree | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 4-6 hours |
| Verification | Low-Med | 2-3 hours |
| **Total** | | **7-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Benchmark harness confirmed to open only a read-only backup, never the live DB, before its first run
- [x] Stress test confirmed to use only a throwaway in-memory DB before its first run
- [x] REQ-004's counter confirmed flag-gated (only accumulates when `SPECKIT_QUERY_TIME_EXISTENCE_FILTER`
      is on) before merging

### Rollback Procedure
1. Revert the REQ-004 counter diff via git if it introduces any measurable flag-off behavior change
2. The benchmark script and both new test files are pure additions -- delete or revert via git with no
   further cleanup needed
3. No stakeholder notification needed; this phase is internal evidence-gathering infra

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. REQ-004's persisted-counter option (if chosen) adds one config-table key;
  reversal is dropping that key, no schema migration involved.
<!-- /ANCHOR:enhanced-rollback -->
