---
title: "Implementation Plan: Graph Preservation Quality Benchmark"
description: "Extend the existing per-flag before/after eval harness (run-retrieval-flag-eval.mjs) with both graph-preservation flags and a 50+-query labeled fixture targeting their exact activation predicates, run it against a reindexed snapshot, and separately wire F15's in-process counter into memory_health's routing block. No flag default changes."
trigger_phrases:
  - "graph preservation quality benchmark plan"
  - "content rich short query graph preservation benchmark plan"
  - "retrieval class routing benchmark plan"
  - "F15 counter memory health wiring plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/021-graph-preservation-quality-benchmark"
    last_updated_at: "2026-07-09T20:40:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md scaffold, status PLANNED"
    next_safe_action: "Resolve fixture-location and reindex decisions, start Phase 1"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-021-graph-preservation-quality-benchmark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Fixture location: scoped sibling file (graph-preservation-ground-truth.json), not an in-place ground-truth.json extension -- the shared fixture feeds unrelated calibration/ablation/BM25/false-confirm/eval-v2 scripts and map-ground-truth-ids.ts's --write path is hardcoded to it and mishandles special classes (hard_negative, off_corpus). Decided 2026-07-10 per feasibility investigation."
      - "Reindex mechanism: scripted, fail-closed, into the driver, not a manual pre-flight command -- no shipped tool performs full causal_edges regeneration (spec.md REQ-003 AMENDED to quiescence-verification instead), and a manual source-DB reindex would contradict the packet's own confined-to-temp-snapshot claim. Decided 2026-07-10 per feasibility investigation."
---
# Implementation Plan: Graph Preservation Quality Benchmark

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript compiled to `mcp_server/dist/**`, driver script in plain ESM (`.mjs`), run through Node directly (matching `run-retrieval-flag-eval.mjs`'s own invocation pattern, no build step for the driver itself) |
| **Framework** | None — a CLI eval driver extending existing eval-harness modules, no new abstraction layer |
| **Storage** | A local temp-directory copy of the live `better-sqlite3` database (`prepareEvalDatabase()` pattern), never the live DB itself; a new/extended JSON ground-truth fixture file |
| **Testing** | vitest for the fixture-shape and counter-wiring assertions; the benchmark run itself is a scripted Node driver, not a vitest suite (matching `040-flag-graduation-benchmark`'s and `run-retrieval-flag-eval.mjs`'s own precedent of a standalone eval script plus a narrower vitest for its option-builder functions) |

### Overview

This packet has two independent halves that share no code path:

1. **The benchmark harness** (the bulk of the work): extend the existing
   `run-retrieval-flag-eval.mjs` machinery — its `prepareEvalDatabase()` backup/restore,
   `buildPerFlagSearchOptions()`, `computeMeanMetrics()`, and `groupQueriesByClass()` functions — with
   the two graph-preservation flags and a new labeled fixture targeting their exact activation
   predicates. It does not rebuild any of that machinery from scratch.
2. **The F15 counter wiring** (small, additive, independent): export
   `getContentRichShortQueryGraphPreservationCount()` from `query-router.ts` through the handler layer
   and add one field to `memory_health`'s existing `routing` block
   (`memory-crud-health.ts:1517-1538`), following the same try/catch-and-fallback shape the block's
   other two telemetry reads already use.

Neither half depends on the other landing first; they can be built and verified in either order or in
parallel. The benchmark harness is the larger, riskier half (new fixture, new driver wiring, a
reindex step to get right); the counter wiring is a small, well-precedented addition to an existing
pattern.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, grounded in direct file:line reads of
  `search-flags.ts`, `query-router.ts`, `query-classifier.ts`, `retrieval-class-classifier.ts`,
  `memory-crud-health.ts`, and `run-retrieval-flag-eval.mjs` against the live tree)
- [x] Success criteria measurable (spec.md SC-001 through SC-004)
- [x] Dependencies identified (existing eval harness, existing F15 counter and `memory_health` routing
  block, both already shipped by sibling packets)

### Definition of Done
- [ ] Fixture built: 50+ labeled queries with graded-relevance rows, predicate membership
  programmatically verified against the live classifiers (REQ-001)
- [ ] Both flags wired into the per-flag before/after driver, measured in isolation against a
  reindexed snapshot (REQ-002, REQ-003)
- [ ] Findings recorded in `benchmark-results.md` with per-flag, per-slice deltas (REQ-004)
- [ ] Zero behavioral change to either flag's default or routing-decision logic (REQ-005)
- [ ] F15 counter surfaced in `memory_health`'s `routing` block, additive-only (REQ-006, REQ-007)
- [ ] Control-slice delta confirms each flag's blast radius stays scoped (REQ-008)
- [ ] Docs updated (spec/plan/tasks/checklist/implementation-summary/decision-record)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two independent, additive extensions over already-shipped machinery — no new engine, no new storage
layer, no new abstraction. The benchmark half is an extension of an existing eval driver; the counter
half is one new field added to an existing reporting block.

### Key Components

**Fixture (`graph-preservation-ground-truth` — name and file location resolved at implementation
time, see Open Questions).** A set of ≥50 `GroundTruthQuery` + `GroundTruthRelevance` rows
(reusing the exact shape `ground-truth-data.ts:39-54` already defines) split into three labeled
slices:
- *Content-rich-short slice*: queries hand-authored to be 2-3 terms, no trigger-phrase match, and a
  low stop-word ratio — the exact shape `isContentRichShortQuery()` (`query-classifier.ts:174-183`)
  gates on. Each query in this slice is run through the real classifier at fixture-build time (not
  just asserted by eye) to confirm it actually trips the predicate before it is committed to the
  fixture, per REQ-001's programmatic-verification requirement.
- *SingleHop slice*: queries hand-authored to match one of `SINGLE_HOP_PATTERNS`
  (`retrieval-class-classifier.ts:53-58`, e.g. `find`/`show`/`get`/`locate`/`where`/`which`/`what
  is`-prefixed queries), verified the same way against the real `classifyRetrievalClass()`.
- *Control slice*: queries deliberately shaped to match neither predicate (multi-clause, trigger-anchored,
  or high-stop-word-ratio queries), used to prove each flag's effect stays scoped (REQ-008).

Each fixture query carries graded-relevance rows (0-3, matching `GroundTruthRelevance.relevance`'s
existing type) against real memory rows in the corpus, authored the same way the existing 103-query
corpus was — by identifying real spec-doc/memory rows the query should surface and grading their
relevance, not synthesizing placeholder IDs.

**Driver.** Either a new `run-graph-preservation-flag-eval.mjs` sibling script that imports and reuses
`run-retrieval-flag-eval.mjs`'s exported helpers (`buildPerFlagSearchOptions`,
`buildChannelAblationOptions`, `selectAblationChannels`), or a direct addition of both flags to
`run-retrieval-flag-eval.mjs`'s own `FLAG_SPECS` array (`run-retrieval-flag-eval.mjs:49-92`) with
`runSearch: true` — the file-layout choice is resolved during implementation (see plan.md Open
Questions) but the underlying mechanism is identical either way: `forceFlag()` sets the env var,
`restoreEnv()` resets it, `search()` runs `hybridSearchEnhanced()` through the real routing path per
variant, and `computeMeanMetrics()` scores each variant against the new fixture's ground truth,
sliced by the three labels above via the same `groupQueriesByClass()` mechanism the harness already
uses for its existing `category` dimension.

**Reindex step (AMENDED 2026-07-10 — scripted, not manual; quiescence-verified, not regenerated).**
Before the driver runs, the source database that `prepareEvalDatabase()` copies from must be in a
known-quiescent state. `prepareEvalDatabase()` itself (`run-retrieval-flag-eval.mjs:200-224`) only
backs up whatever state the source DB is already in — it does not trigger a reindex, and no shipped
tool (`reindex-embeddings.ts:73-76` only forces `memory_index_scan({force:true})`, which creates
`causal_edges` for changed folders only and can still classify unchanged rows as unchanged) performs a
full `causal_edges` regeneration. This packet instead scripts a fail-closed pre-flight into the driver
itself:
1. Copy the metadata DB and active vector shard read-only via `prepareEvalDatabase()`.
2. Assert every writable DB/shard path the driver will touch resolves under the eval temp root (guards
   against `shared/paths.ts`'s workspace-boundary fallback silently redirecting a mutation back at the
   canonical checkout).
3. Read `memory_health` from the source before copying; refuse to proceed if there are pending/failed
   vectors or an active scan job (non-quiescent source).
4. Record the source health snapshot (pending/failed counts, scan-job state, timestamp) in the findings.

REQ-003 was amended accordingly: the requirement is quiescence-verification of the copied snapshot, not
regeneration-from-scratch (which no existing tool performs). A follow-up packet may add a true
clone-only causal-edge rebuild if a future benchmark needs it.

**F15 counter export + memory_health wiring.** `getContentRichShortQueryGraphPreservationCount()`
already exists and is already exported from `query-router.ts` (`query-router.ts:376-378,550-551`).
The wiring adds: (1) an import of that function into `memory-crud-health.ts`, (2) a
try/catch-guarded read of it inside `handleMemoryHealth()` following the exact shape the existing
`routingTelemetry` and `graphChannelMetrics` reads already use (`memory-crud-health.ts:1417-1457`),
falling back to `0` on any read failure with a hint pushed to the existing `hints` array, and (3) one
new field inside the `routing` object literal (`memory-crud-health.ts:1517-1538`), e.g.
`contentRichShortQueryGraphPreservationCount`, appended after the existing `degreeContributionCounters`
block so the change is a pure addition to the object literal, not a reordering.

### Data Flow

**Benchmark**: fixture authored + programmatically verified against live classifiers → source DB
reindexed → `prepareEvalDatabase()` copies to a temp dir → driver toggles one flag at a time via
`forceFlag()`/`restoreEnv()` → `search()` runs real `hybridSearchEnhanced()` per fixture query per
variant → `computeMeanMetrics()` scores Recall@K/nDCG/MRR against the fixture's graded relevance,
sliced by content-rich-short/SingleHop/control → deltas written to `benchmark-results.md`.

**Counter**: `query-router.ts`'s `routeQuery()` increments `_contentRichShortQueryGraphPreservationCount`
exactly as it does today (unchanged) → `handleMemoryHealth()` reads the counter via the newly-imported
getter inside its existing try/catch block → the value lands in `data.routing.contentRichShortQueryGraphPreservationCount`
on every `memory_health` call → an operator or soak-test script reads it from there instead of having
no visibility at all.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `run-retrieval-flag-eval.mjs` `FLAG_SPECS` (`:49-92`) | Lists 6 flags, none of which are the two graph-preservation flags | Add both flags with `runSearch: true` (or reuse its exported helpers from a sibling driver) | The driver's output report includes a non-`untestable:` row for both flags |
| `ground-truth-data.ts` / `ground-truth.json` | 103 queries, 275 relevances, 18 simple-tier, no content-rich-short or SingleHop label | Add 50+ labeled queries across the three slices (or a sibling fixture file using the identical `GroundTruthQuery`/`GroundTruthRelevance` shape) | `QUERY_DISTRIBUTION`-style count assertion in the new fixture-shape test confirms ≥50 new queries and non-zero relevance rows per query |
| `query-router.ts` `getContentRichShortQueryGraphPreservationCount` (`:376-378`) | Exported, but nothing outside the module's own tests calls it | Import it into `memory-crud-health.ts` | grep the import in `memory-crud-health.ts` after the change |
| `memory-crud-health.ts` `routing` block (`:1517-1538`) | Carries `routingTelemetry` and `graphChannelMetrics` fields, no F15 field | Add one new field, additive only | Diff of `memory_health`'s response before/after shows only the new field added, nothing else changed |

Required inventories:
- Existing per-flag harness precedent: `rg -n "FLAG_SPECS|prepareEvalDatabase|buildPerFlagSearchOptions" .opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs` — confirms the exact functions this plan reuses.
- Existing `memory_health` routing-block precedent: `rg -n "routingTelemetry|graphChannelMetrics" .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` — confirms the try/catch shape the F15 wiring follows.
- Consumers of the fixture format: `rg -n "GROUND_TRUTH_QUERIES|GROUND_TRUTH_RELEVANCES" .opencode/skills/system-spec-kit/mcp_server` — confirms every place that would need to know about a new fixture file if the plan.md decision is a sibling file rather than an in-place extension.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm `run-retrieval-flag-eval.mjs` runs cleanly end to end on the current tree (baseline smoke
  run before extending it)
- [ ] Resolve the two open implementation-time decisions: fixture location (in-place extension vs.
  sibling file) and the reindex mechanism (documented manual pre-flight vs. a scripted step inside the
  driver)
- [ ] Confirm the current F15 counter and `memory_health` routing block both behave exactly as
  `spec.md`'s citations describe, in case a concurrent session has touched either file since this plan
  was written

### Phase 2: Fixture Authoring
- [ ] Author the content-rich-short slice: hand-write candidate queries, run each through the real
  `isContentRichShortQuery()` classifier, keep only the queries that actually trip the predicate
- [ ] Author the SingleHop slice: hand-write candidate queries, run each through the real
  `classifyRetrievalClass()`, keep only the queries that actually classify as `SingleHop`
- [ ] Author the control slice: hand-write queries that trip neither predicate, verified the same way
- [ ] Grade relevance for every fixture query against real corpus rows (0-3 scale, matching the
  existing corpus's convention), reaching ≥50 total queries across the three slices
- [ ] Fixture-shape test: asserts ≥50 queries, every query has ≥1 relevance row, every query's labeled
  slice matches its live-classifier-verified predicate

### Phase 3: Benchmark Driver
- [ ] Wire both flags into the per-flag before/after mechanism (new sibling driver or `FLAG_SPECS`
  addition, per the Phase 1 decision)
- [ ] Reindex the source database (documented command) immediately before the benchmark run
- [ ] Run the driver: each flag toggled in isolation against the reindexed snapshot, scored against
  the new fixture, sliced by content-rich-short/SingleHop/control
- [ ] Record findings in `benchmark-results.md`: per-flag, per-slice Recall@K/nDCG/MRR deltas, plus the
  reindex step's before/after confirmation

### Phase 4: F15 Counter Wiring (independent of Phases 2-3)
- [ ] Import `getContentRichShortQueryGraphPreservationCount()` into `memory-crud-health.ts`
- [ ] Add the try/catch-guarded read inside `handleMemoryHealth()`, following the existing
  `routingTelemetry`/`graphChannelMetrics` shape
- [ ] Add the new field to the `routing` object literal, additive only
- [ ] Test: the counter appears in `memory_health`'s JSON response, increments correctly, and a
  simulated restart (via the existing test-only reset hook) returns it to 0
- [ ] Test: a before/after diff of `memory_health`'s response and of `routeQuery()`'s output confirms
  the wiring is additive-only (REQ-007)

### Phase 5: Verification
- [ ] `bash validate.sh --strict` run, evidence captured
- [ ] Confirm zero change to either flag's default value or routing-decision logic (REQ-005 diff check)
- [ ] Confirm the existing `handler-memory-health-edge.vitest.ts` regression suite still passes
  unchanged
- [ ] Documentation updated (spec/plan/tasks/checklist/implementation-summary/decision-record)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Fixture-shape | ≥50 query count, relevance-row presence, live-classifier-verified predicate membership | A new vitest asserting fixture invariants against the real `isContentRichShortQuery()`/`classifyRetrievalClass()` imports |
| Benchmark | Per-flag, per-slice Recall@K/nDCG/MRR before/after on the reindexed snapshot | The extended/new Node eval driver, reusing `prepareEvalDatabase()` |
| Counter wiring | F15 counter surfaces in `memory_health`, increments correctly, additive-only diff | vitest extending or sibling to `handler-memory-health-edge.vitest.ts` |
| Regression | Existing `handler-memory-health-edge.vitest.ts` and `query-router.vitest.ts` suites re-run unchanged | vitest |
| Regression | `validate.sh --strict` sweep after implementation | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `run-retrieval-flag-eval.mjs` and its `dist/` compiled imports | Internal | Shipped, in active use by CI/manual runs | No per-flag toggle-and-measure mechanism to extend; would force building one from scratch, well outside this packet's intended scope |
| F15 counter (`query-router.ts:370-383`) | Internal | Shipped by sibling packet `016-cross-package-flag-governance`, `validate.sh --strict` clean per that packet's `implementation-summary.md` | Nothing to wire into `memory_health`; Phase 4 has no starting point |
| `memory_health`'s existing `routing` block (`memory-crud-health.ts:1517-1538`) | Internal | Shipped, already reports `routingTelemetry`/`graphChannelMetrics` | No established pattern to extend; the wiring would need to invent its own reporting shape |
| A reindex mechanism producing current embeddings/causal_edges state | Internal (existing tooling) | Available per this repo's own `reindex-embeddings.js`/`memory_index_scan` tooling, but the exact invocation for this packet's snapshot is an implementation-time decision | Benchmark cannot claim "reindexed" per REQ-003 without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The fixture's predicate-verification step finds the hand-authored queries do not
  actually trip the intended classifier at a usable rate (e.g. fewer than 50 total queries survive
  verification), or the F15 wiring is found to change `memory_health`'s response shape beyond the one
  additive field.
- **Procedure**: The benchmark half and the counter half are independent — either can be reverted on
  its own via git without affecting the other. Neither introduces a new feature flag or a schema
  migration, so rollback is a direct code/doc revert. The fixture file and driver script are new files
  with no existing consumers, so removing them is a clean delete with no downstream cleanup.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Fixture) ──► Phase 3 (Driver) ──┐
                └──► Phase 4 (F15 wiring, independent) ──────┼──► Phase 5 (Verify)
                                                              ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Fixture, F15 wiring |
| Fixture | Setup | Driver |
| Driver | Fixture | Verify |
| F15 wiring | Setup | Verify |
| Verify | Driver, F15 wiring | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | 1-2 hours |
| Fixture Authoring | Med-High | 6-10 hours (50+ hand-verified queries with graded relevance is the bulk of this packet's cost) |
| Benchmark Driver | Med | 4-6 hours |
| F15 Counter Wiring | Low | 1-2 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **13-22 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Fixture location decision recorded before Phase 2 starts
- [ ] Reindex mechanism decision recorded before Phase 3 starts
- [ ] Baseline smoke run of `run-retrieval-flag-eval.mjs` confirmed green before extension begins

### Rollback Procedure
1. Benchmark half: delete the new fixture file and driver script (or revert the `FLAG_SPECS` addition
   and `benchmark-results.md`); no other code depends on either.
2. F15 wiring half: revert the `memory-crud-health.ts` diff (one import, one try/catch block, one
   object-literal field); `query-router.ts` itself is untouched by this packet.
3. Re-run `validate.sh --strict` and the existing `handler-memory-health-edge.vitest.ts` /
   `query-router.vitest.ts` suites to confirm the revert restored expected behavior.

### Data Reversal
- **Has data migrations?** No — no schema change, no DB write path. The benchmark's reindexed snapshot
  lives in a temp directory (`prepareEvalDatabase()`'s existing pattern) and is never the live DB.
- **Reversal procedure**: Not applicable. Delete the temp eval-DB directory if one is left over from an
  interrupted run; no persistent state to clean up otherwise.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2    │────►│   Phase 5   │
│   Setup     │     │  Fixture +   │     │   Verify    │
└─────────────┘     │   Driver     │     └─────────────┘
      │              │ (Phase 2-3) │            ▲
      │              └──────────────┘            │
      └────────────►┌──────────────┐─────────────┘
                     │   Phase 4    │
                     │ F15 wiring   │
                     │ (independent)│
                     └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup (Phase 1) | None | Resolved open questions, confirmed baseline | Fixture, F15 wiring |
| Fixture (Phase 2) | Setup | Labeled ≥50-query corpus, predicate-verified | Driver |
| Driver (Phase 3) | Fixture | `benchmark-results.md` findings | Verify |
| F15 wiring (Phase 4) | Setup | `memory_health` routing field | Verify |
| Verify (Phase 5) | Driver, F15 wiring | `validate.sh --strict` clean, docs updated | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup** - 1-2 hours - CRITICAL
2. **Fixture Authoring** - 6-10 hours - CRITICAL
3. **Benchmark Driver** - 4-6 hours - CRITICAL
4. **Verification** - 1-2 hours - CRITICAL

**Total Critical Path**: 12-20 hours

**Parallel Opportunities**:
- F15 Counter Wiring (Phase 4, 1-2 hours) can run in parallel with Fixture Authoring and Benchmark
  Driver (Phase 2-3) — it depends only on Setup, not on the fixture or driver.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Setup complete | Open questions resolved, baseline harness confirmed green | End of Phase 1 |
| M2 | Fixture built | ≥50 labeled queries, predicate-verified against live classifiers (REQ-001) | End of Phase 2 |
| M3 | Benchmark run | Both flags measured in isolation, findings recorded (REQ-002-004) | End of Phase 3 |
| M4 | F15 wired | Counter visible in `memory_health`, additive-only (REQ-006-007) | End of Phase 4 |
| M5 | Verified | `validate.sh --strict` clean, all docs updated | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm the current spec folder is this packet before touching any file
- [ ] Confirm `run-retrieval-flag-eval.mjs` and the F15 counter still match this plan's file:line
  citations (re-`rg` if a concurrent session may have touched them)
- [ ] Confirm which of the two open implementation-time decisions (fixture location, reindex
  mechanism) is being executed against before writing fixture or driver code

### Execution Rules (TASK-SEQ / TASK-SCOPE)
| Rule | Requirement |
|------|-------------|
| TASK-SEQ-001 | Phase 2 (Fixture) MUST complete and pass its shape test before Phase 3 (Driver) starts consuming it |
| TASK-SEQ-002 | Phase 4 (F15 wiring) MAY run at any point after Phase 1, independent of Phase 2-3 |
| TASK-SCOPE-001 | No task in this packet may change `search-flags.ts`'s default values or any routing-decision function (REQ-005) |
| TASK-SCOPE-002 | No task in this packet may touch files outside this packet's `spec.md` "Files to Change" table |

### Status Reporting Format
Each task update reports: task ID, one-line result, and evidence (file:line, command output, or test
name) — matching the same evidence-over-narrative discipline this repo's `tasks.md` already applies
per completed task line.

### Blocked Task Protocol
A `[B]`-tagged task in `tasks.md` is BLOCKED until its declared blocker resolves. On hitting a blocker
not already declared: stop, record the blocker in this packet's frontmatter `_memory.continuity.blockers`
list, and do not silently work around it by touching an out-of-scope file.
<!-- /ANCHOR:ai-execution -->
