---
title: "Feature Specification: Graph Preservation Quality Benchmark"
description: "Two routing-affecting flags, SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION and SPECKIT_RETRIEVAL_CLASS_ROUTING, sit default-OFF because this repo's flag-graduation policy requires a reindexed before/after benchmark before default-ON shipment and neither flag has ever had one. A 7-query spot-check proved the content-rich-short flag roughly doubles graph-channel usage but was explicitly decision-neutral: no labeled ground truth existed to judge whether that shift is better or worse. This packet builds the missing evaluation harness -- 50+ labeled queries, a reindexed before/after snapshot, both flags measured in isolation -- plus wires the F15 in-process-only graph-preservation counter into memory_health's persistent reporting surface. It does not flip either flag."
trigger_phrases:
  - "graph preservation quality benchmark"
  - "content rich short query graph preservation benchmark"
  - "retrieval class routing benchmark"
  - "F15 counter memory health wiring"
  - "labeled ground truth graph preservation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/005-dark-flag-graduation/011-graph-preservation-quality-benchmark"
    last_updated_at: "2026-07-10T14:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented full packet: REQ-003 amended, F15 wired, fixture authored, driver run"
    next_safe_action: "None -- packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-graph-preservation-flag-eval.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/graph-preservation-ground-truth-data.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/data/graph-preservation-ground-truth.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-021-graph-preservation-quality-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Fixture location: scoped sibling file (graph-preservation-ground-truth.json). Reindex mechanism: scripted quiescence-verified clone-first preflight, not a manual command. See plan.md's answered_questions for the full rationale."
---
# Feature Specification: Graph Preservation Quality Benchmark

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This packet is EXPLICITLY ON HOLD for flag graduation. Its only job is to build the evaluation
harness this repo's own flag-graduation policy requires before `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION`
and `SPECKIT_RETRIEVAL_CLASS_ROUTING` can ever be considered for default-ON. Both flags shipped
default-OFF specifically because they lack a reindexed before/after benchmark with labeled ground
truth (`search-flags.ts:443-445`, `search-flags.ts:454-462`). A follow-up 7-query spot-check earlier
this session confirmed the content-rich-short flag materially changes routing (graph-channel usage
roughly doubled) but produced no verdict because it had no labeled ground truth to score against —
a decision-neutral result by design, not a finding either way. This packet closes that gap: it builds
a 50+-query labeled fixture representative of each flag's activation population, measures both flags
in isolation on a reindexed before/after snapshot using this repo's existing per-flag eval harness
(`run-retrieval-flag-eval.mjs`), and separately wires the already-shipped F15 in-process counter
(`query-router.ts:376-383`) into `memory_health`'s persistent `routing` reporting surface
(`memory-crud-health.ts:1517-1538`) so channel behavior stays observable once real load-testing
begins. Whether either flag graduates is a decision for a future packet, gated on this one's findings.

**Key Decisions**: Reuse the existing `run-retrieval-flag-eval.mjs` per-flag harness rather than
building a parallel one (ADR-001); author a scoped labeled fixture targeting each flag's exact
activation predicate rather than hoping the existing 18 simple-tier queries happen to cover it
(ADR-002); treat the F15 counter wiring as an independent, non-blocking sub-task inside the same
packet rather than a separate phase (ADR-003).

**Critical Dependencies**: A reindexed database snapshot (embeddings + causal_edges current); the
existing `run-retrieval-flag-eval.mjs` harness and `ground-truth.json` schema; the already-shipped
F15 counter and `memory_health` `routing` block, both landed in sibling packet `016-cross-package-flag-governance`.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P3 |
| **Status** | COMPLETE |
| **Created** | 2026-07-09 |
| **Branch** | `021-graph-preservation-quality-benchmark` |
| **Estimated LOC** | ~350-500 (new eval driver, fixture data, memory_health wiring, tests) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../010-flag-vocabulary-consolidation/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two routing-affecting flags carry the identical unmet obligation in their own source comments:

- `isRetrievalClassRoutingEnabled()` (`search-flags.ts:447-449`): "It must earn promotion on a
  reindexed before/after benchmark before running by default" (`search-flags.ts:443-444`). When ON,
  a SingleHop-classified query (per `retrieval-class-classifier.ts:53-58`'s `SINGLE_HOP_PATTERNS`,
  e.g. queries starting `find`/`show`/`get`/`locate`/`where`/`which`/`what is`) suppresses the graph
  and degree channels at `query-router.ts:283-285`, dropping the intent-driven and entity-density
  graph preservation `shouldPreserveGraph()` (`query-router.ts:273-305`) would otherwise apply.
- `isContentRichShortQueryGraphPreservationEnabled()` (`search-flags.ts:464-466`): shipped default-ON
  originally, then flipped back to default-OFF in sibling packet `016-cross-package-flag-governance`
  because it "shipped default-ON with only unit-test/fixture verification, never a reindexed
  before/after production-path benchmark" (`search-flags.ts:454-456`). When ON, a simple-tier query
  with 2-3 terms, no trigger-phrase match, and a low stop-word ratio (`isContentRichShortQuery()`,
  `query-classifier.ts:174-183`) forces the graph and degree channels on at `query-router.ts:483-488`,
  incrementing the in-process `_contentRichShortQueryGraphPreservationCount` counter each time
  (`query-router.ts:487`).

Neither flag has ever had the benchmark its own docstring names as the graduation bar. The one
measurement that exists — a 7-query spot-check run earlier this session — is explicitly on record in
`search-flags.ts:456-459` as decision-neutral: it proved the content-rich-short flag "materially
changes routing (graph-channel usage roughly doubled)" but had "no labeled ground truth to judge
quality by," so it "does not meet the policy's bar for a default-ON shipment." Seven queries with no
ground truth cannot distinguish "the flag surfaces the graph edges the query actually needed" from
"the flag pollutes the result set with irrelevant graph noise" — both produce the same observed
symptom (more graph-channel invocations).

This repo already owns a real per-flag before/after eval harness,
`run-retrieval-flag-eval.mjs` (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs`),
that toggles a flag in isolation against a backed-up eval copy of the live database
(`prepareEvalDatabase()`, `run-retrieval-flag-eval.mjs:200-224`) and reports Recall@K, nDCG@10, and
MRR deltas per query-class dimension (`run-retrieval-flag-eval.mjs:270-352`) against a 103-query,
275-relevance labeled ground-truth corpus (`ground-truth.json`). Neither
`SPECKIT_RETRIEVAL_CLASS_ROUTING` nor `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` appears
in that harness's `FLAG_SPECS` list (`run-retrieval-flag-eval.mjs:49-92`) — they were never wired in.
And even if they were, the existing ground-truth corpus carries only 18 `simple`-complexityTier
queries total (measured via `python3 -c` count against `ground-truth.json`), with no query-shape
label distinguishing "SingleHop" or "content-rich-short" queries from the other 85 queries — so the
existing corpus cannot, by itself, isolate either flag's target population well enough to produce a
statistically legible before/after delta.

A third, smaller gap sits alongside the benchmark gap: F15, the monitor-only counter that already
ships in production (`query-router.ts:370-383`, landed by sibling packet
`016-cross-package-flag-governance`, `spec.md:135-136,225-231`), increments an in-process module
variable that nothing outside `query-router.ts`'s own test suite ever reads. `memory_health` already
carries a persistent `routing` reporting block (`memory-crud-health.ts:1517-1538`) with an analogous
in-process, resets-on-restart telemetry pattern (`routing-telemetry.ts:6` — "Pure in-memory state —
no persistence, resets on process restart") for `graphChannelInvocationRate` and
`channelInvocationCounts`. F15's counter follows the identical pattern but was never plugged into
that surface, so an operator watching `memory_health` today has no way to see how often the
content-rich-short-query override actually fires in real traffic — the exact visibility this repo's
own flag-graduation policy will need once soak testing on either flag begins.

### Purpose

Build the missing evaluation harness end to end: author a labeled fixture of 50+ queries
representative of each flag's exact activation predicate (content-rich-short-query shape for
`SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION`, SingleHop shape for
`SPECKIT_RETRIEVAL_CLASS_ROUTING`), each with known-correct expected results (graded relevance rows,
not just "did the result set change"); wire both flags into a reindexed-before/after driver built on
top of the existing `run-retrieval-flag-eval.mjs` machinery; run it warm against a freshly reindexed
snapshot of the real search index; and record the measured findings. Separately, wire F15's counter
into `memory_health`'s persistent `routing` block so channel behavior is observable before any soak
test starts leaning on it. This packet does not flip either flag's default. Graduation is a decision
for a follow-up packet, made after this one's findings exist.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A labeled fixture of 50+ queries with known-correct (graded relevance) expected results, split
  across the two flags' activation predicates: queries matching `isContentRichShortQuery()`'s shape
  (2-3 terms, no trigger match, low stop-word ratio) for the content-rich-short flag, and queries
  matching `SINGLE_HOP_PATTERNS` (`retrieval-class-classifier.ts:53-58`) for the retrieval-class flag.
  A negative/control slice (queries that do NOT match either predicate) is included so the benchmark
  can confirm each flag's blast radius stays scoped to its target population and does not leak into
  unrelated queries.
- A driver that toggles `SPECKIT_RETRIEVAL_CLASS_ROUTING` and
  `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` in isolation (one flag at a time, the other
  held at its shipped default) against a reindexed before/after snapshot of the real search index,
  reusing `run-retrieval-flag-eval.mjs`'s `prepareEvalDatabase()` backup-and-restore pattern
  (`run-retrieval-flag-eval.mjs:200-224`) and `buildPerFlagSearchOptions()` /
  `computeMeanMetrics()` machinery rather than building parallel infrastructure.
- Both flags added to (or a sibling of) the `FLAG_SPECS` list (`run-retrieval-flag-eval.mjs:49-92`)
  with `runSearch: true`, so the driver actually measures them instead of recording an
  `untestable:` note.
- A written findings record (a new `benchmark-results.md` in this packet, following the sibling
  `040-flag-graduation-benchmark/benchmark-results.md` convention) capturing per-flag Recall@K,
  nDCG@10, and MRR deltas, split by the content-rich-short / SingleHop / control slices, run against
  the reindexed snapshot.
- Wiring the F15 counter (`getContentRichShortQueryGraphPreservationCount()`,
  `query-router.ts:376-378`) into `memory_health`'s persistent `routing` block
  (`memory-crud-health.ts:1517-1538`), following the same in-process/no-DB-persistence pattern the
  existing `routingTelemetry` and `graphChannelMetrics` fields already use in that block.
- A vitest asserting the F15 counter appears in `memory_health`'s JSON response and increments
  correctly across the wiring boundary.

### Out of Scope

- Flipping either flag's default (`SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` or
  `SPECKIT_RETRIEVAL_CLASS_ROUTING`) to ON. That is a decision for a follow-up packet made after this
  one's benchmark findings exist, per this packet's explicit on-hold framing.
- Any change to `shouldPreserveGraph()`, `shouldPreserveGraphForContentRichShortQuery()`, or
  `isSingleHopRetrieval()`'s routing logic itself (`query-router.ts:233-305`,
  `retrieval-class-classifier.ts:125-126`). This packet measures the existing logic, it does not
  modify it.
- Building a brand-new eval harness from scratch. `run-retrieval-flag-eval.mjs` and its
  `prepareEvalDatabase()` / `computeMeanMetrics()` / `groupQueriesByClass()` machinery
  (`run-retrieval-flag-eval.mjs:200-352`) already solve the reindexed-copy-and-restore and
  per-class-metric problem; this packet extends it, it does not replace it.
- Sibling flag `SPECKIT_LEXICAL_GROUNDING_V1` or the four `028-scoring-hardening` flags — those are
  a different flag family already benchmarked by `040-flag-graduation-benchmark`
  (`002-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark`); not this
  packet's scope.
- Any timeout, circuit-breaker, or concurrency limiter for the graph/degree channel work F15's
  counter observes. Sibling packet `016-cross-package-flag-governance` already ruled that out for
  F15's own scope (`spec.md:229`, "F15's counter is a monitoring aid, not a fix") and this packet
  inherits the same boundary — it only adds a reporting surface, not a safety valve.
- Soak testing itself. This packet wires the counter into `memory_health` so a soak test CAN read it;
  running that soak test is a separate future activity.
- Any change to `feature-flags.md`'s narrative sections describing other flag families
  (`004-memory-search-intelligence/feature-flags.md`), beyond whatever this packet's own findings
  eventually get appended to that document by a later packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/graph-preservation-ground-truth.json` (or a `ground-truth.json` extension, decided in plan.md) | Create | 50+ labeled queries with graded-relevance rows targeting the content-rich-short and SingleHop activation predicates, plus a control slice |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-graph-preservation-flag-eval.mjs` (or `FLAG_SPECS` additions to `run-retrieval-flag-eval.mjs`, decided in plan.md) | Create/Modify | Wires both flags into the existing per-flag before/after driver |
| `.opencode/specs/system-speckit/004-memory-search-intelligence/021-graph-preservation-quality-benchmark/benchmark-results.md` | Create | Findings record: per-flag, per-slice Recall@K/nDCG/MRR deltas on the reindexed snapshot |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts` | Modify | Export `getContentRichShortQueryGraphPreservationCount()` for the `memory_health` wiring (already internally exported at `query-router.ts:550-551`; confirm the handler-facing import path) |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modify | Add the F15 counter to the `routing` block (`memory-crud-health.ts:1517-1538`) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts` (or a new sibling test file) | Modify/Create | Assert the F15 counter surfaces in `memory_health`'s JSON response |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The fixture SHALL contain at least 50 labeled queries with graded-relevance (known-correct) expected results, distributed across the content-rich-short activation predicate, the SingleHop activation predicate, and a control slice that matches neither. | A test asserts the fixture query count is ≥50, every query has at least one relevance row, and each query's predicate membership (content-rich-short / SingleHop / control) is programmatically verifiable by running the query through `isContentRichShortQuery()` and the `SINGLE_HOP_PATTERNS` matcher, not just hand-labeled. |
| REQ-002 | The benchmark SHALL measure `SPECKIT_RETRIEVAL_CLASS_ROUTING` and `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` each in isolation (one flag toggled, the other held at its shipped default) against the same reindexed before/after snapshot, reusing `run-retrieval-flag-eval.mjs`'s `prepareEvalDatabase()` and per-class metric machinery rather than new parallel infrastructure. | A test asserts each flag's before/after run only changes that flag's env var, the eval DB snapshot path is a fresh copy created via the reused `prepareEvalDatabase()` call, and the report attributes the measured delta to a single flag. |
| REQ-003 | The benchmark run SHALL execute against a health-verified, quiescent snapshot — embeddings confirmed fully processed (no pending/failed vectors) and the `causal_edges` table confirmed consistent with that embedding state (not mid-scan) — copied read-only into the eval temp root, so the entity-density signal `shouldPreserveGraph()` reads (`query-router.ts:297-302`) reflects a coherent graph state. **AMENDED 2026-07-10**: no shipped tool performs a full `causal_edges` regeneration; `reindex-embeddings.ts` only forces an embedding rescan (`memory_index_scan({force:true})`), which creates edges solely for changed folders and can still classify unchanged rows as unchanged. Requiring "regenerated" causal edges is therefore unsatisfiable with existing tooling. This packet requires quiescence-verification instead of regeneration-from-scratch; a follow-up packet may add true clone-only causal-edge rebuild if a future benchmark needs it. | The findings record documents the pre-flight health check taken immediately before the benchmark run (command, timestamp, embedding pending/failed counts = 0, and confirmation no scan job was active), plus the source `memory_health` state the snapshot was copied from. |
| REQ-004 | Findings SHALL be recorded in `benchmark-results.md` with per-flag, per-slice (content-rich-short / SingleHop / control) Recall@K, nDCG@10, and MRR deltas, not just an aggregate before/after result set-size comparison. | `benchmark-results.md` exists after the run and contains a delta table per flag broken out by slice, matching the granularity the existing `040-flag-graduation-benchmark/benchmark-results.md` sibling establishes as this parent's convention. |
| REQ-005 | This packet SHALL NOT change either flag's default value in `search-flags.ts`, nor change `shouldPreserveGraph()`, `shouldPreserveGraphForContentRichShortQuery()`, or `isSingleHopRetrieval()`'s decision logic. | A diff of `search-flags.ts`, `query-router.ts`'s routing-decision functions, and `retrieval-class-classifier.ts` after this packet's implementation phase shows no behavioral change outside the new counter export; both flags' `isOptInEnabled(...)` calls are byte-identical to today. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | F15's counter (`getContentRichShortQueryGraphPreservationCount()`) SHALL appear in `memory_health`'s JSON response under the existing `routing` block, following the same in-process/no-DB-persistence contract the block's other fields already use. | A test calls `handleMemoryHealth()`, fires a content-rich-short query through the router, calls it again, and asserts `data.routing` carries a field reflecting the counter's incremented value; a process restart (simulated via the existing `resetContentRichShortQueryGraphPreservationCount()` test hook) returns it to 0, matching the block's documented "resets on process restart" contract. |
| REQ-007 | The counter wiring SHALL be additive-only: it MUST NOT change any other field already present in `memory_health`'s response, nor alter `routeQuery()`'s returned routing plan. | A before/after diff of `memory_health`'s response on a fixed fixture query set is identical except for the new counter field; a before/after diff of `routeQuery()`'s output for the same fixture queries is byte-identical. |
| REQ-008 | The fixture's control slice (queries matching neither activation predicate) SHALL show no material Recall@K/nDCG/MRR delta when either flag is toggled, confirming each flag's blast radius stays scoped to its intended population. | The findings record's control-slice row for both flags shows a delta within the noise band the existing `040-flag-graduation-benchmark` convention uses for a "neutral" verdict (see that packet's `spec.md:126` open-question framing on noise-band width, resolved independently per-packet). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reproducible before/after benchmark exists for both `SPECKIT_RETRIEVAL_CLASS_ROUTING`
  and `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION`, each measured in isolation against a
  reindexed snapshot, on a 50+-query labeled fixture with graded-relevance ground truth — not a
  result-set-changed/unchanged spot-check.
- **SC-002**: The findings record (`benchmark-results.md`) reports a per-flag, per-slice quality
  verdict (positive, negative, or neutral) with numbers, closing the exact gap the prior 7-query
  spot-check left open (`search-flags.ts:456-459`).
- **SC-003**: F15's counter is visible in `memory_health`'s persistent `routing` reporting surface,
  verified by a passing test, before any soak test that would depend on watching it begins.
- **SC-004**: Neither flag's default value nor routing-decision logic changed as a side effect of
  building the harness — the harness observes, it does not decide.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The existing 18 simple-tier ground-truth queries do not cleanly split into content-rich-short / SingleHop / control without hand-verification drifting from the classifiers' actual runtime behavior. | A fixture that claims to test a predicate but does not actually trigger it, producing a meaningless delta | REQ-001 requires each query's predicate membership be programmatically verified by running it through the real `isContentRichShortQuery()` and `SINGLE_HOP_PATTERNS` matcher, not asserted by inspection alone |
| Risk | "Reindexed" is under-specified — a stale embeddings/causal_edges snapshot could produce a benchmark that looks clean but does not reflect current graph state. | A benchmark result that does not generalize to production behavior | REQ-003 requires the findings record document the concrete reindex step and a before/after confirmation the graph state actually changed |
| Risk | Building the driver as a second parallel harness instead of extending `run-retrieval-flag-eval.mjs` duplicates the backup/restore and per-class metric logic, doubling future maintenance. | Two eval harnesses drift out of sync over time | REQ-002 requires reuse of `prepareEvalDatabase()` and the per-class metric functions; the plan.md decision on file layout picks extension over duplication unless a concrete blocker is found during implementation |
| Risk | F15's counter wiring silently changes `memory_health`'s response shape in a way an existing consumer did not expect. | A downstream dashboard or test that snapshots the full `memory_health` response breaks | REQ-007 requires an additive-only diff; existing `handler-memory-health-edge.vitest.ts` regression coverage is re-run unchanged after the wiring lands |
| Dependency | `run-retrieval-flag-eval.mjs` and its `dist/` compiled dependencies (`hybrid-search.js`, `query-router` module, `eval-metrics.js`) | The driver has no per-flag toggle-and-measure mechanism of its own to build from scratch | Confirm the harness runs cleanly on the current tree before extending it (Phase 1 setup task) |
| Dependency | Sibling packet `016-cross-package-flag-governance`'s F15 implementation (`query-router.ts:370-383`) | Nothing to wire into `memory_health` if the counter itself does not exist | Confirmed shipped and passing `validate.sh --strict` per that packet's own `implementation-summary.md`; this packet only adds a consumer, it does not touch the producer |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The benchmark driver runs the harness once per flag per variant (off/on) plus one
  baseline, matching `run-retrieval-flag-eval.mjs`'s existing per-flag cost model
  (`run-retrieval-flag-eval.mjs:467-573`) — no combinatorial flag-combination sweep.
- **NFR-P02**: The F15 counter read inside `memory_health` is a single in-memory variable read, adding
  no measurable latency to the health-check response (matching the existing `routingTelemetry` and
  `graphChannelMetrics` reads already in that same block).

### Reliability
- **NFR-R01**: A `memory_health` call still succeeds and returns a valid response if the F15 counter
  read throws for any reason, following the same try/catch-and-fallback pattern already used for
  `routingTelemetry` and `graphChannelMetrics` in the same handler (`memory-crud-health.ts:1417-1457`).
- **NFR-R02**: The benchmark run is reproducible: with the reindexed snapshot and fixture fixed, a
  re-run produces the same before/after deltas (matching `040-flag-graduation-benchmark`'s own
  `NFR-R01` precedent for reproducibility).

### Security
- **NFR-S01**: The reindexed eval-DB snapshot is a local temp-directory copy (reusing
  `prepareEvalDatabase()`'s existing `fs.mkdtempSync` pattern, `run-retrieval-flag-eval.mjs:200-201`),
  never a write against the live production database.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- A fixture query that happens to match both the content-rich-short predicate and a SingleHop
  pattern (e.g. a 3-term query starting with "find"): the fixture-authoring step tags it by its
  dominant/tested predicate and excludes it from the other flag's slice, so no query double-counts
  toward two different deltas.
- A control-slice query that a future classifier change unintentionally starts matching one of the
  predicates: the programmatic verification in REQ-001 catches this at benchmark-run time (the
  predicate check re-runs against the live classifier, not a frozen label), rather than silently
  reporting the query as "control" when it no longer is.

### Error Scenarios
- The reindex step fails partway (e.g. embeddings provider unavailable): the benchmark driver refuses
  to run rather than measuring against a half-reindexed snapshot, matching the
  `040-flag-graduation-benchmark` precedent of refusing to measure an inconsistent corpus
  (`040-flag-graduation-benchmark/spec.md:179`, REQ-007).
- `memory_health`'s F15 counter read throws (e.g. the module failed to load): the handler falls back
  to a zeroed/absent value and appends a hint, following the existing `routingTelemetry` catch
  pattern (`memory-crud-health.ts:1422-1436`) rather than failing the whole health check.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | A new labeled fixture (50+ queries), a driver extension over existing eval machinery, a findings doc, plus an independent small handler wiring |
| Risk | 10/25 | No production routing/default change (explicitly out of scope); the only production-code touch is one additive `memory_health` field |
| Research | 8/20 | Every cited mechanism confirmed against the live tree (search-flags.ts, query-router.ts, query-classifier.ts, retrieval-class-classifier.ts, memory-crud-health.ts, run-retrieval-flag-eval.mjs); two implementation-time decisions remain open (fixture location, reindex mechanism) |
| Multi-Agent | 3/15 | Single-session buildable; no cross-workstream coordination required |
| Coordination | 3/15 | No hard sequencing dependency on another un-shipped 028 sibling; both precedent packets (016, 040) are already complete |
| **Total** | **38/70** | **Level 3** (kept at Level 3 for the explicit ADR/decision-record discipline this packet's on-hold framing and dual-flag scope warrant) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Fixture predicate-membership drifts from classifier reality over time | M | M | Programmatic re-verification against the live classifier at benchmark-run time (REQ-001) |
| R-002 | Benchmark measured against a stale/half-reindexed snapshot | H | L | REQ-003's documented reindex-confirmation step; driver refuses to run on an unconfirmed snapshot |
| R-003 | Parallel eval-harness duplication instead of extension | M | M | REQ-002's reuse requirement; plan.md decision favors extension |
| R-004 | F15 wiring silently reshapes `memory_health`'s response for an existing consumer | M | L | REQ-007's additive-only requirement plus unchanged regression suite re-run |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Operator Decides Whether a Flag Earns Default-ON (Priority: P0)

**As an** operator evaluating `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` or
`SPECKIT_RETRIEVAL_CLASS_ROUTING` for graduation, **I want** a labeled before/after benchmark with a
per-slice quality verdict, **so that** I can decide graduation on measured evidence instead of a
result-set-changed spot-check.

**Acceptance Criteria**:
1. Given the reindexed snapshot and the 50+-query fixture, When the benchmark driver runs both flags in
   isolation, Then `benchmark-results.md` reports a per-flag, per-slice Recall@K/nDCG/MRR delta.
2. Given a flag whose control-slice delta exceeds the noise band, When the findings are reviewed, Then
   the record explicitly flags that the flag's blast radius leaked beyond its intended population.

### US-002: Soak-Test Operator Observes Real Content-Rich-Short-Query Traffic (Priority: P1)

**As an** operator running a soak test against `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION`,
**I want** the F15 counter visible in `memory_health`, **so that** I can see how often the override
actually fires in real traffic without instrumenting a separate probe.

**Acceptance Criteria**:
1. Given the flag is enabled and content-rich-short queries are issued, When `memory_health` is called,
   Then the response's `routing` block reports a non-zero count for the override.
2. Given a process restart, When `memory_health` is called again, Then the counter reads 0, matching the
   documented in-process/no-persistence contract.

### US-003: Future Packet Author Reuses This Fixture Without Re-Verifying It (Priority: P2)

**As a** future packet author extending either flag's benchmark, **I want** each fixture query's slice
membership to be programmatically verifiable against the live classifiers, **so that** I can trust the
fixture without re-deriving its predicate membership by hand.

**Acceptance Criteria**:
1. Given the fixture-shape test, When it runs against the live `isContentRichShortQuery()` and
   `classifyRetrievalClass()` functions, Then every fixture query's labeled slice matches the live
   classifier's real output.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Whether the 50+ new labeled queries extend `ground-truth.json` in place (adding new `QueryCategory`
  values, e.g. `content_rich_short` / `single_hop`) or live in a separate scoped fixture file specific
  to this packet's driver. Decided in plan.md; both are compatible with `GroundTruthQuery`'s existing
  shape (`ground-truth-data.ts:39-48`).
- Whether the reindexed before/after snapshot reuses `prepareEvalDatabase()`'s backup-and-restore
  verbatim, or needs a variant that also forces a fresh embeddings/causal_edges regeneration pass
  before the copy (since `prepareEvalDatabase()` today only backs up whatever state the source DB is
  already in, per `run-retrieval-flag-eval.mjs:200-224` — it does not itself trigger a reindex).
- What noise-band width counts as "no material delta" for the control slice (REQ-008), resolved the
  same way `040-flag-graduation-benchmark`'s own open question about noise-band width was left to
  implementation-time decision (`040-flag-graduation-benchmark/spec.md:201`).
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Sibling precedent (flag graduation benchmark shape)**: `002-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/spec.md`
- **Sibling precedent (F15 counter origin)**: `016-cross-package-flag-governance/spec.md`
<!-- /ANCHOR:related-docs -->
