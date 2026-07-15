---
title: "Feature Specification: Query-Time Existence Filter Benchmark & Hardening [template:level_2/spec.md]"
description: "SPECKIT_QUERY_TIME_EXISTENCE_FILTER (memory-search.ts:372-441, default OFF) ships cheap in principle but package 011's own REQ-008 latency-benchmark acceptance criterion was left unexecuted (checklist.md CHK-064, still unchecked). This phase runs that benchmark for real, soak-tests the filter under concurrent multi-session daemon load, proves the transient-miss-then-restored edge case end-to-end through the public handlers, and adds an aggregated exclusion-count telemetry surface -- closing the evidence bar for a future default-on decision without deciding it here."
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
    last_updated_at: "2026-07-10T04:43:21Z"
    last_updated_by: "openai/gpt-5.6-terra"
    recent_action: "Implemented and verified all scoped requirements"
    next_safe_action: "Use the benchmark evidence in a future default-on graduation decision"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-020-query-time-filter-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "REQ-001 reports benchmark evidence rather than imposing a graduation threshold."
      - "REQ-004 uses a process-lifetime in-memory counter to avoid hot-path database I/O."
---
# Feature Specification: Query-Time Existence Filter Benchmark & Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Completed |
| **Created** | 2026-07-09 |
| **Branch** | `020-query-time-filter-benchmark` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../027-eval-calibration-ab/spec.md |
| **Successor** | ../029-residual-correctness/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Background: related prior art (do not duplicate)
`SPECKIT_QUERY_TIME_EXISTENCE_FILTER` is Layer 1 of sibling phase `011-automatic-drift-self-healing`'s
three-layer self-healing design: a query-time existence check on `memory_search`'s already-ranked top-k
rows, `applyQueryTimeExistenceFilter()` (`memory-search.ts:372-441`), gated by
`isQueryTimeExistenceFilterEnabled()` (`capability-flags.ts:251-253`, default OFF, delegating to the
shared `isOptInEnabled()` helper per sibling `016-cross-package-flag-governance`'s F5b migration). Layer 2
(the post-commit/post-merge/post-rewrite git-hook dirty-marker) and Layer 3 (the full-scan orphan-sweep
backstop) already provide drift protection independent of Layer 1 being on, which is why this phase is
explicitly low urgency -- there is no rush to flip the flag, only a bar to clear when convenient. Sibling
`014-self-healing-internals-hardening` subsequently hardened Layer 1's own internals: F8 added a
25ms fast-fail `busy_timeout` bound around the suspect-queue write so a lock collision degrades the search
response by tens of milliseconds instead of blocking it for up to 10 seconds
(`DRIFT_SUSPECT_WRITE_BUSY_TIMEOUT_MS`, `memory-search.ts:224`, write path `memory-search.ts:421-437`), and
F11 made the suspect-queue reader log-and-continue instead of silently swallowing a parse error. This phase
does not re-implement or re-design Layer 1 -- it measures and hardens the evidence around the version 011
and 014 already shipped.

### Problem Statement

Four narrow, evidence-backed gaps remain open around an otherwise-complete, already-tested feature:

1. **REQ-008's numeric latency benchmark was never executed.** `011/spec.md:256` states the acceptance
   criterion in full ("A benchmark comparing search latency with the flag on vs. off over a representative
   query set shows the existence-check overhead is a small fraction of total query time, captured with
   numbers in `implementation-summary.md`"), and `011/checklist.md:140` (`CHK-064 [P1]`) still reads "Status:
   not yet executed as a numeric benchmark" as of this writing. `011/plan.md:96` and `011/plan.md:323` both
   name this same gap as the trigger for a rollback/refinement decision. No number exists anywhere in the
   tree today for the filter's real per-query cost.

2. **The filter's concurrency-safety behavior is proven only under a simulated single-process lock, never
   real multi-session contention.** `014`'s F8 fix is tested by
   `mcp_server/tests/memory-search-drift-suspect-write-timeout.vitest.ts:98` ("REQ-001: under a held write
   lock, the fixed suspect-write path fails in under 100ms..."), but that test acquires the write lock
   in-process via a held transaction, not from a second concurrent session. This repo has demonstrated real
   reliability issues under exactly this kind of load earlier this session: three daemon reliability bugs
   found and fixed under `002-graph-and-context-optimization/007-mcp-daemon-reliability/{032,033,034}`
   (a boot-integrity-rebuild marker starvation, a WAL/mmap`-shm` SIGBUS regression, and a rebuild-sentinel
   corruption-handling gap), all triggered by concurrent daemon activity a single-process test cannot
   reproduce. The existing `mcp_server/stress_test/durability/` suite already proves other 013-roadmap
   surfaces safe under exactly this class of load (e.g. `index-scan-coalescing-stress.vitest.ts`'s 64-wide
   concurrent lease-acquisition burst); Layer 1 has no equivalent.

3. **The transient-miss-then-restored correctness property is well covered at the unit and confirmation
   layers separately, but never driven through the public handlers as one continuous flow.**
   `mcp_server/tests/memory-drift-healing.vitest.ts:34-48` proves `applyQueryTimeExistenceFilter()` excludes
   a missing-path row and queues it as a suspect without deleting it, but calls the internal testable
   directly (`searchTestables.applyQueryTimeExistenceFilter`), not the `memory_search` handler with the flag
   read live from the environment. `mcp_server/tests/suspect-confirmation.vitest.ts:226-257` separately
   proves a suspect whose file "has reappeared (false alarm)" is cleared, not tombstoned, via
   `handler.runIndexScan`. No test drives the full sequence -- query while missing (excluded, queued), file
   restored, a second query (naturally included again, live `existsSync` re-check), then a scan (suspect
   cleared with no write) -- as one continuous scenario through the two public entrypoints
   (`memory_search`, `memory_index_scan`) a real caller actually uses.

4. **Per-query exclusion telemetry exists but is ephemeral, undocumented, and untested.** The current tree
   already attaches `extraData.queryTimeExistenceFilter = { enabled, checked, excluded }` to each
   `memory_search` response (`memory-search.ts:1722-1726`, fed by
   `QueryTimeExistenceFilterStats` at `memory-search.ts:214-219`). This answers "how many rows did this one
   query exclude," but there is no aggregate or persisted counter an operator can read to answer "how many
   exclusions has this flag caused across a session or a day" without capturing every individual response;
   `ENV_REFERENCE.md`'s `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` row (`:522`) does not mention this field at
   all; and no test asserts it is present or accurate.

### Purpose
Close all four gaps with real evidence and one small additive telemetry surface, so a future session
deciding whether to graduate the flag to default-on has the numbers 011 promised and never delivered,
confidence the filter survives real concurrent daemon load, one end-to-end proof of its core correctness
contract, and a way to observe its real-world impact once enabled -- without this phase itself deciding
graduation, which stays a separate, evidence-gated call per this repo's established flag-governance
practice (`016-cross-package-flag-governance`, `004-dark-flag-graduation`).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **REQ-008 latency benchmark (item 1).** A self-contained, read-only-corpus benchmark harness that
  measures `memory_search` wall-clock latency with the flag ON vs. OFF over a representative query set,
  reusing the methodology `004-dark-flag-graduation`'s children already established (read-only backup of
  the live corpus and vector shard, flag toggled per call via the environment, warm repeats, p50/p95/mean
  reported) -- see `002-retrieval-class-weights/scripts/retrieval-class-routing-benchmark.mjs` as the
  concrete precedent. Numbers land in `implementation-summary.md`.
- **Concurrency soak test (item 2).** A new stress test under `mcp_server/stress_test/durability/`,
  following that directory's existing throwaway-DB, no-production-touch isolation convention, that drives
  many concurrent `memory_search` calls (flag ON) against one shared connection while concurrent writes
  contend for the same suspect-queue table, and asserts the existing 25ms fast-fail bound holds (no query
  blocks for the connection's full `busy_timeout`, no suspect-queue corruption, no unhandled rejection).
- **End-to-end transient-miss test (item 3).** One new test driving `memory_search` then `memory_index_scan`
  through their public handler entrypoints (not internal testables) across the full
  excluded-queued-restored-cleared sequence in a single continuous scenario.
- **Aggregate exclusion telemetry (item 4).** A persisted or process-lifetime counter that accumulates
  `checked`/`excluded` across queries (not just the current per-response `extraData` field), documented in
  `ENV_REFERENCE.md`, and covered by a test. The existing per-query `extraData.queryTimeExistenceFilter`
  field stays as-is; this is additive.
- Updating `011/checklist.md` `CHK-064` and `011/spec.md`'s Implementation status note once REQ-008's
  benchmark lands, so the sibling packet's own open gap is closed by reference rather than left stale.

### Out of Scope
- Deciding or implementing graduation to default-ON. This phase produces evidence only; the graduation
  decision follows the same burden-of-proof practice `016-cross-package-flag-governance` already
  established for a different flag in this same file.
- Any change to Layer 1's filtering logic, Layer 2's git hook, or Layer 3's sweep/confirm behavior. This
  phase measures and tests the shipped `011`/`014` implementation; it does not modify it beyond the
  additive telemetry counter in item 4.
- Building an operator-facing dashboard or `/doctor` panel to *display* the new aggregate counter. This
  phase adds the counter and documents it; surfacing it in an admin UI is a future consumer, not this
  phase's deliverable (mirrors `016`'s F15 precedent: "a lightweight metric/log counter... not a required
  code change" beyond the counter itself).
- Re-running or duplicating `011`'s or `014`'s own test suites wholesale. This phase adds four new/extended
  tests targeted at the specific gaps above; it does not re-verify already-passing coverage.
- Any change to the suspect-row grace period or wall-clock confirmation window -- both remain open questions
  in `011/spec.md`'s own Open Questions and are not this phase's concern.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/specs/system-speckit/004-memory-search-intelligence/020-query-time-filter-benchmark/scripts/query-time-filter-latency-benchmark.mjs` | Create | REQ-001's self-contained latency harness, modeled on `004-dark-flag-graduation`'s per-child benchmark pattern |
| `.opencode/specs/system-speckit/004-memory-search-intelligence/020-query-time-filter-benchmark/results/` | Create | Raw benchmark output (JSON) backing the numbers reported in `implementation-summary.md` |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/query-time-existence-filter-concurrency-stress.vitest.ts` | Create | REQ-002's concurrency soak test, following the directory's existing isolation and `npm run stress:durability` convention |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-transient-miss-e2e.vitest.ts` | Create | REQ-003's end-to-end handler-level test |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modify | REQ-004: accumulate `checked`/`excluded` into a persisted or process-lifetime aggregate counter alongside the existing per-query `extraData.queryTimeExistenceFilter` field (`:1722-1726`) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts` (or a new small telemetry helper) | Modify | REQ-004: read/write side of the aggregate counter, reusing the existing config-table pattern already used for the suspect queue and the orphan-sweep cursor (`memory-index.ts:239`) |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Document the existing per-query telemetry field, the new aggregate counter, and point at the REQ-001 benchmark numbers once captured |
| `.opencode/specs/system-speckit/004-memory-search-intelligence/011-automatic-drift-self-healing/checklist.md` | Modify | Close `CHK-064` with a pointer to this phase's benchmark evidence once REQ-001 lands |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The system SHALL measure `memory_search` latency with `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` ON vs. OFF over a representative query set against a read-only backup of the live corpus, and report real numbers. | A benchmark run produces p50/p95/mean latency for both states plus the delta as a fraction of baseline query time; the numbers are written into `implementation-summary.md` with the reproduce command; the live database is never opened for writes during the run. |
| REQ-002 | The filter's suspect-queue write path SHALL remain safe (no hang, no corruption, no unhandled rejection) under many concurrent `memory_search` calls contending for the same connection. | A new stress test firing at least as many concurrent flag-ON queries as `index-scan-coalescing-stress.vitest.ts`'s existing 64-wide burst against one shared throwaway DB completes with every query either returning normally or degrading via the existing 25ms fast-fail path -- never blocking for the connection's full `busy_timeout` -- and the suspect-queue table is readable and uncorrupted afterward. |
| REQ-003 | A file excluded from a `memory_search` result as transiently missing SHALL be queued as a drift suspect (never silently dropped with no trace), and SHALL be cleared (not tombstoned) if it reappears before the next `memory_index_scan`, proven as one continuous flow through the public handlers. | A single test: (a) calls the `memory_search` handler with the flag on against a fixture where one indexed file is absent -- the row is excluded and its id appears in the suspect queue; (b) restores the file on disk; (c) calls `memory_search` again -- the row is now included, live; (d) calls the `memory_index_scan` handler -- the suspect entry is cleared with no tombstone write. All four steps run in one test against the same handler-level entrypoints a real caller uses. |
| REQ-004 | The system SHALL expose an aggregate exclusion-count signal beyond the existing per-response `extraData.queryTimeExistenceFilter` field, so an operator can observe cumulative filter impact without capturing every individual search response. | A test issues multiple flag-ON queries with a mix of excluded and non-excluded rows, then reads the aggregate counter and confirms it reflects the summed `checked`/`excluded` totals across all queries, not just the last one; the counter's location and semantics (persisted vs. process-lifetime) are documented in `ENV_REFERENCE.md`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `011/checklist.md`'s `CHK-064` SHALL be closed with a pointer to this phase's benchmark evidence once REQ-001 lands, so the sibling packet's own stated gap does not go stale relative to this phase's output. | `011/checklist.md` CHK-064 is updated from unchecked/"not yet executed" to checked with an evidence pointer into this phase's `implementation-summary.md`; `011/spec.md`'s Implementation status note is updated to drop the REQ-008 gap from its list of open items. |
| REQ-006 | This phase SHALL NOT change Layer 1's filtering behavior, Layer 2's hook, or Layer 3's sweep/confirm logic beyond the additive REQ-004 counter. | A code-review pass of the diff confirms `applyQueryTimeExistenceFilter()`'s exclusion logic, the git hooks, and the sweep/confirm pass in `memory-index.ts` are unchanged; the only production-path diff is the new counter accumulation site. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future session deciding whether to graduate `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` to
  default-on can read a real p50/p95/mean latency number from this phase instead of re-deriving one from
  scratch.
- **SC-002**: The filter's behavior under real concurrent multi-session-style load is proven by a repeatable
  stress test living in `mcp_server/stress_test/durability/`, not just asserted from the single-process F8
  test.
- **SC-003**: The transient-miss-then-restored correctness contract is proven end-to-end through the same
  two public handlers (`memory_search`, `memory_index_scan`) a real caller uses, not only through internal
  testables and a separate confirmation-phase test.
- **SC-004**: An operator can answer "how many results has this flag excluded across recent queries" by
  reading a single documented signal, without having to capture and sum every individual search response.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `011-automatic-drift-self-healing`'s Layer 1 implementation (`memory-search.ts:372-441`, `capability-flags.ts:251-253`) is the object under test. | If that code changes materially before this phase's implementation begins, the cited file:line references and any benchmark/soak evidence already captured would need re-verification. | This phase's `_memory.continuity.blockers` field records the dependency; Phase 1 of `plan.md` re-confirms the cited lines against the live tree before writing the harness. |
| Dependency | `014-self-healing-internals-hardening`'s F8 fast-fail bound (`memory-search.ts:224,421-437`) is what REQ-002's soak test is proving holds under real contention, not inventing. | If F8's fix is reverted or altered, the soak test would need to change what it asserts. | Same as above -- re-confirm the cited lines before writing the stress test. |
| Risk | A benchmark harness that opens the live database for writes, even accidentally, could corrupt the production memory index. | High blast radius on a database this repo cannot regenerate. | Follow `004-dark-flag-graduation`'s established safety pattern verbatim: read-only backup of the live corpus and vector shard, harness never opens the source for writes (see `retrieval-class-routing-benchmark.mjs`'s own "Safety" doc-comment section for the precedent). |
| Risk | A concurrency stress test that spawns real daemon processes could be flaky in CI or slow down the local test suite. | Wasted CI time, flaky gate | Follow `stress_test/durability/index-scan-coalescing-stress.vitest.ts`'s existing pattern: many concurrent async calls against one throwaway in-memory DB via the injectable `db-state` hook, not real spawned daemon processes -- matches this phase's actual claim (connection-level contention safety), not daemon-lifecycle safety, which is already covered elsewhere in that directory. |
| Risk | The aggregate telemetry counter (REQ-004) could be over-built into a new subsystem instead of a small additive counter, drifting scope toward a monitoring feature. | Scope creep, delayed close-out | Explicit Out of Scope line: no dashboard, no `/doctor` panel -- the counter and its documentation are the entire deliverable, mirroring `016`'s F15 precedent for exactly this kind of "observe before building more" telemetry addition. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The benchmark harness itself must not become the thing being measured -- it runs against a
  read-only backup copy so filesystem cost from the backup step is excluded from the reported per-query
  latency numbers.
- **NFR-P02**: The new aggregate counter's write cost per query must stay negligible relative to the
  existing per-query `checked`/`excluded` computation it rides alongside (`memory-search.ts:404,410`) -- no
  new synchronous cross-process call is added to the hot path.

### Security
- **NFR-S01**: The benchmark harness and the concurrency stress test never open the production database
  (`~/.mk-spec-memory` or equivalent) for writes; both operate against throwaway or read-only-backup copies,
  matching `stress_test/durability/README.md`'s stated isolation guarantee.

### Reliability
- **NFR-R01**: The soak test's assertions must hold regardless of run order or timing jitter -- no test
  depends on a specific interleaving of concurrent calls succeeding versus fast-failing, only on the
  invariant that every call resolves (no hang) and the suspect queue stays readable.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A query set with zero results carrying a `file_path` at all: the benchmark and the aggregate counter both
  treat this as a `checked: 0, excluded: 0` observation, not an error.
- Every result in a query excluded (a fixture where all backing files are missing): the aggregate counter
  still sums correctly and the suspect queue receives every id, not just the first.

### Error Scenarios
- A concurrent query issued while the suspect-queue write busy_timeout is mid-fast-fail: the query itself
  must still return its filtered result set normally per the existing `try/catch/finally` in
  `applyQueryTimeExistenceFilter()` (`memory-search.ts:421-437`) -- the soak test asserts this, it does not
  just assert the write itself fails fast.
- The aggregate counter's persistence write fails (e.g. the config table is locked): the query response
  must still return normally, matching the existing best-effort semantics of the neighboring suspect-queue
  write.

### State Transitions
- A row excluded once, restored, then deleted again before the next scan: the suspect queue holds at most
  one entry per id (existing dedupe behavior in `appendMemoryDriftSuspects`), and REQ-003's end-to-end test
  does not need to cover this compound case -- it is already implied by the existing round-trip test at
  `memory-drift-healing.vitest.ts:50-64`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | Two new test files, one new throwaway benchmark script plus results, one small additive counter across two existing files, no schema migration |
| Risk | 9/25 | Read-only/throwaway-DB harnesses only; the one production-path change (REQ-004's counter) is additive and reuses an existing persistence primitive |
| Research | 5/20 | Every cited gap, file:line, and existing-test boundary confirmed against the live tree at spec time |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does REQ-001's p50/p95 overhead get pinned as a numeric pass/fail threshold in this phase, or only
  reported as a number and left for a future graduation packet to judge against a governance bar?
- Should REQ-004's aggregate counter persist across daemon restarts (a config-table row, matching the
  suspect-queue and orphan-sweep-cursor pattern) or reset per process lifetime (an in-memory counter,
  cheaper, matching `retrieval-telemetry.ts`'s existing per-process model)? `plan.md` names both options;
  implementation should pick the one that adds the least new surface area and record the choice in
  `implementation-summary.md`.
<!-- /ANCHOR:questions -->
