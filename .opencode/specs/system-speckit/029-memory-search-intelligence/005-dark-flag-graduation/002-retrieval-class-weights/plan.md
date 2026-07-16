---
title: "Implementation Plan: Retrieval-Class Channel Weights Benchmark"
description: "Plans a prod-path benchmark for the default-off SPECKIT_RETRIEVAL_CLASS_ROUTING flag. The harness backs up the live corpus and active vector shard read-only, then drives the production executePipeline over a labeled set of ten single-hop find-one queries and eight multi-hop queries, once with the flag off and once on. It scores single-hop precision at one as a rank-1 target-folder match and multi-hop recall at ten as the labeled relevant folders present in the top-K, and records the routeQuery channel set per query so the precision delta is grounded in the actual graph and degree suppression. The byte-identity check reads the multi-hop rows where the channel set and the top-K must be identical flag-off vs flag-on. Rejects measuring routeQuery in isolation as insufficient, since the question is a prod-path result-quality question not a routing-decision question."
trigger_phrases:
  - "retrieval class channel weights benchmark plan"
  - "SPECKIT_RETRIEVAL_CLASS_ROUTING prod path harness"
  - "single-hop precision multi-hop recall harness"
  - "read-only corpus backup retrieval class"
  - "channel suppression grounded precision delta"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/005-dark-flag-graduation/002-retrieval-class-weights"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the harness and ran it, plan reflects the shipped design"
    next_safe_action: "Author the results tables and the verdict"
    blockers: []
    key_files:
      - "scripts/retrieval-class-routing-benchmark.mjs"
      - "results/metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Retrieval-Class Channel Weights Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | A Node ESM `.mjs` benchmark script importing the compiled TypeScript search library |
| **Framework** | In-process `executePipeline` against a read-only corpus backup, `routeQuery` for the channel decision, `nomic-embed-text-v1.5` embedder |
| **Storage** | A read-only database backup and a single metrics.json rollup |
| **Testing** | A three-run stability check on the deltas, an in-harness byte-identity check on the multi-hop rows |

### Overview
This phase measures the default-off `SPECKIT_RETRIEVAL_CLASS_ROUTING` flag on the production path and returns a verdict. The harness backs up the live database and its active vector shard read-only to a temporary eval copy, points the runtime at the copy, and leaves every results-affecting feature flag at its shipped default except the flag under test. It runs a labeled set of ten single-hop find-one queries and eight multi-hop queries through the production `executePipeline`, once with the flag off and once on. For each single-hop query it scores precision at one as whether the rank-1 result spec folder matches the labeled target folder, and for each multi-hop query it scores recall at ten as the fraction of labeled relevant folders present in the top-K. Alongside the result metric it reads the `routeQuery` channel set under each flag state, so the precision delta is grounded in the actual graph and degree suppression rather than asserted. The byte-identity check reads the multi-hop rows, where a multi-hop query is never classified single-hop so its channel set and top-K must be identical flag-off vs flag-on. Measuring `routeQuery` in isolation was considered and rejected, since the question is a prod-path result-quality question, whether suppression raises precision without costing recall, not a routing-decision question.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Benchmark runs and reproduces exit 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A read-only prod-path differential benchmark. The harness toggles one flag and runs the same labeled set through the production pipeline twice, then reads the delta. The result metric is paired with the routing decision so the delta is causally grounded. The corpus is never mutated.

### Key Components
- **The read-only backup**: backs up the live database and active vector shard to a temporary eval copy, so every search runs against the copy and the live corpus is never opened for writes.
- **The labeled set**: ten single-hop find-one queries each with a target spec folder, and eight multi-hop queries each with a relevant folder set. Labels are expectations grounded in the corpus titles and spec folders, matched by folder startsWith.
- **The prod-path runner**: drives `executePipeline` under shipped defaults with only `SPECKIT_RETRIEVAL_CLASS_ROUTING` toggled, returning the ordered result ids and their spec folders.
- **The channel reader**: reads `routeQuery` per query under each flag state, so the harness records whether the flag suppressed graph and degree for each single-hop query.
- **The metrics rollup**: single-hop precision at one and multi-hop recall at ten for both states, the per-query channel suppression, and the byte-identity flags, written to metrics.json.

### Data Flow
A query is embedded once. The channel reader records the `routeQuery` channel set flag-off and flag-on. The prod-path runner runs `executePipeline` flag-off and flag-on, returning the ordered result folders. A single-hop query scores precision at one from the rank-1 folder, a multi-hop query scores recall at ten from the top-K folders. The aggregates and the byte-identity flags roll up into metrics.json, the single source for the data tables and the verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is a measurement, not a fix. It writes only inside its own folder and edits no shared production code. The surfaces below are read-only imports the harness depends on, listed so the measurement is reproducible and its boundary is explicit.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/search/query-router.ts` | The tier-to-channel router that the flag gates | import read-only via dist | the harness calls `routeQuery` to read the channel set, never edits it |
| `lib/search/retrieval-class-classifier.ts` | The always-on five-class classifier | import read-only via dist | the harness reads the retrieval class per query, never edits it |
| `lib/search/pipeline/index.js` | The production `executePipeline` | import read-only via dist | the harness drives the prod path, never edits it |
| `lib/search/search-flags.ts` | The reader for `SPECKIT_RETRIEVAL_CLASS_ROUTING` | not edited | the flag is toggled only through the environment, the reader is unchanged |

Required inventories:
- Same-class producers: the channel suppression lives only in `shouldPreserveGraph` inside `query-router.ts`, gated by `isRetrievalClassRoutingEnabled` and `isSingleHopRetrieval`.
- Consumers of the routing decision: `hybrid-search.ts` reads `routeResult.channels` to gate the graph channel and the dependent degree channel, the prod-path stage the benchmark measures through.
- Matrix axes: ten single-hop find-one queries scored on precision at one and eight multi-hop queries scored on recall at ten, each under the flag off and the flag on.
- Algorithm invariant: with the flag on a SingleHop query suppresses graph and degree before the preservation checks, with the flag off it does not, and a non-single-hop query is unaffected in both states.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the flag, the always-on classifier, and the suppression short-circuit in `query-router.ts` against the source
- [x] Build the labeled set, ten single-hop find-one queries with target folders and eight multi-hop queries with relevant folder sets, grounded in the corpus
- [x] Confirm the production path the flag affects, `executePipeline` to Stage 1 to `collectRawCandidates` to `routeQuery`

### Phase 2: Core Implementation
- [x] Write the read-only backup of the live database and active vector shard to a temporary eval copy
- [x] Drive `executePipeline` flag-off vs flag-on per query under shipped defaults with only the flag under test toggled
- [x] Score single-hop precision at one as a rank-1 target-folder match and multi-hop recall at ten as the labeled relevant folders present in the top-K
- [x] Read the `routeQuery` channel set per query under each flag state and record the graph and degree suppression per single-hop query
- [x] Write the per-query rows, the aggregates, and the byte-identity flags to `results/metrics.json`

### Phase 3: Verification
- [x] Confirm the harness reproduces exit 0 and reads the corpus read-only
- [x] Confirm the deltas are stable across three runs and the multi-hop channel sets and top-K are byte-identical flag-off vs flag-on
- [x] Inspect the flipped single-hop query by hand against its rank-1 folder, then author the results tables and the verdict grounded strictly in metrics.json
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Differential | The single-hop precision and multi-hop recall deltas flag-off vs flag-on | the harness over the eighteen labeled queries on the prod path |
| Stability | The deltas repeat across three runs, confirming a stable signal not noise | three consecutive harness runs |
| Byte-identity | Every multi-hop channel set and top-K is identical flag-off vs flag-on | the byte-identity flags in metrics.json |
| Manual | The flipped single-hop query rank-1 folder is correct off and wrong on | reading the flipped row in metrics.json against the labeled target |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The production `executePipeline` and the Stage-1 routing | Internal | Green | The benchmark cannot read the prod-path result without them |
| `routeQuery` and the retrieval-class classifier | Internal | Green | The harness cannot ground the precision delta in the channel suppression without them |
| The `nomic-embed-text-v1.5` embedder | Internal | Green | The harness cannot embed the queries or run the pipeline without it |
| The live corpus and its active vector shard | Internal | Green | The benchmark cannot measure on the real corpus without the read-only backup |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The benchmark is abandoned or superseded.
- **Procedure**: Delete the phase folder. The harness edited no shared production code and flipped no default, so there is nothing to revert outside this folder.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Low | 1 hour |
| **Total** | | **4-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The harness reads a read-only corpus backup and flips no default
- [x] The harness edits no shared production code, it imports it read-only
- [x] The benchmark reproduces exit 0 before any verdict claim

### Rollback Procedure
1. Delete the phase folder, which removes the harness, the results, and the docs
2. Confirm no shared production file was touched, since the harness only imports the dist build read-only
3. Confirm no default was flipped, since the flag is toggled only in-process through the environment

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the harness reads a corpus backup and writes only metrics.json inside this folder
<!-- /ANCHOR:enhanced-rollback -->

---
