---
title: "Feature Specification: Query-Channel Calibration and Visibility [template:level_2/spec.md]"
description: "The graph/degree escalation hatch in query-classifier.ts requires a stopword ratio of 0.5 or higher, which content-rich 2-3-term queries (the dominant real-world query style) never hit. Live telemetry shows graph/degree ran on only 2/7 recent queries despite a 1.0 hit rate and fully corroborating results when they did run."
trigger_phrases:
  - "query channel calibration"
  - "graph degree channel skip"
  - "query classifier escalation hatch"
  - "skipped channels visibility"
  - "stopword ratio threshold"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/010-query-channel-calibration"
    last_updated_at: "2026-07-10T11:20:21.000Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffold template titles removed from four doc frontmatters; packet now strict-clean"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Query-Channel Calibration and Visibility

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
| **Priority** | P1 |
| **Status** | Implemented, verification-limited |
| **Created** | 2026-07-09 |
| **Branch** | `010-query-channel-calibration` |
| **Verdict** | GO (calibration + visibility fix, two confirmed root causes) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`classifyQueryComplexity` routes any query of `<=3` whitespace terms to the `simple` tier (`query-classifier.ts:228`), and `DEFAULT_ROUTING_CONFIG.simple` maps that tier to `['vector', 'fts']` only — graph and degree are excluded (`query-router.ts:114-118`). The one stopword-ratio-based hatch that can pull a simple-tier query back onto the full pipeline, `isLowSignalShortQuery`, only fires when `stopWordRatio >= LOW_SIGNAL_STOPWORD_RATIO` (`query-classifier.ts:39,157-166`), and `LOW_SIGNAL_STOPWORD_RATIO = 0.5`. The constant's own doc comment concedes the ceiling: it is set "above the one-stop-word-in-three ratio of ordinary verb-noun queries (e.g. 'fix the bug' = 0.333) so only genuinely vague queries escalate" (`query-classifier.ts:31-38`). Content-rich 2-3-term queries — the dominant real-world query style per the live telemetry sample — carry a stopword ratio well under 0.5 by design, so this hatch structurally cannot fire for them.

A second, independent escalation path already exists: `shouldPreserveGraph` in `query-router.ts:252-284` adds graph (and degree, when `includeDegree`) to non-complex tiers when intent is `find_spec`/`find_decision`, or when `getEntityDensityScore` returns `>= ENTITY_DENSITY_ACTIVATION_THRESHOLD` (2 query terms exact-matching titles/triggers of memory_index rows carrying `>=3` outgoing causal_edges; `query-router.ts:96,276-281`). This mechanism is not stopword-ratio-gated, but the live telemetry sample shows it is also under-firing: graph/degree ran on only 2 of 7 recent queries (28.6%), despite a `graphHitRate` of 1.0 and all 12 graph results returned in those 2 runs being multi-source corroborators — i.e., every time the channel ran, it demonstrably helped, and it was skipped roughly 71% of the time on the dominant query pattern.

Separately, the vector channel can silently vanish at runtime with no trace in the routing metadata a caller actually sees. When `generateQueryEmbedding` returns no usable embedding, `stage1-candidate-gen.ts` sets `vectorSearchSkipped = true` and falls back to lexical-only candidate generation (three call sites: `stage1-candidate-gen.ts:907-908`, `:939-944`, `:1265-1266`), logging only `console.warn('[stage1-candidate-gen] Embedding unavailable for hybrid search query, falling back to lexical candidate generation')` (`:942`). Stage 1's own return metadata does carry `embedderAvailable`/`vectorSearchSkipped`/`degradationReason` (`stage1-candidate-gen.ts:1859-1863`), but `hybrid-search.ts`'s `collectRawCandidates` (`:2262-2314`) never reads it, and the `s3meta.routing.skippedChannels` field callers do see is built exclusively from the router's *planned* channel subset (`allPossibleChannels.filter(ch => !activeChannels.has(ch))`, `hybrid-search.ts:1369-1392`) — a query where `vector` was planned to run and then failed at runtime reports `skippedChannels` as if vector ran successfully. The same pattern repeats for other channel-level failures caught with fail-open `console.warn`/`console.error` (e.g. `causal-boost.ts:457,762` for graph traversal and graph-context injection, `hybrid-search.ts:585,663,840` for BM25/FTS/trigger-phrase search) — none of these promote into the result's routing/queryPlan metadata a caller can act on or audit.

### Purpose

Recalibrate the channel-skip heuristics so that graph/degree escalate for the query pattern the telemetry proves benefits from them, and make every channel skip — planned or runtime, heuristic or exception-driven — visible in result metadata instead of console-only.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Recalibrate the escalation heuristic(s) that gate graph/degree for `simple`-tier queries so that a content-rich 2-3-term query has a realistic path to the full channel set, without abandoning the stopword-ratio signal's original purpose (`query-classifier.ts`'s `isLowSignalShortQuery`/`LOW_SIGNAL_STOPWORD_RATIO`) or discarding the existing entity-density mechanism (`query-router.ts`'s `shouldPreserveGraph`/`ENTITY_DENSITY_ACTIVATION_THRESHOLD`) — the two hatches must be reconciled, not duplicated.
- Record the runtime vector-channel skip (embedding generation failure) into the routing/queryPlan metadata surface (`skippedChannels` / `QueryPlan.skippedChannels`) so it is indistinguishable from a planned skip only in that its `reason` differs, not in whether it is reported at all.
- Promote channel-level exception handling that is currently `console.warn`/`console.error`-only (graph traversal, graph-context injection, BM25/FTS/trigger-phrase search failures) into the same result-visible metadata surface, at minimum recording channel name + failure reason.
- Instrument or reuse the existing rolling telemetry window (`routing-telemetry.ts`) to produce a before/after graph/degree invocation-rate comparison against the live sample this finding cites.

### Out of Scope

- `007-search-index-integrity-sweep` (F10, the 42%-stale-index fix) — this phase is sequenced strictly after it so that escalating graph/degree usage amplifies a clean index rather than surfacing more of the stale rows F10 removes. This phase does not touch index-freshness or row-existence checks.
- Any other Track 1 finding (F1-F13) or Track 2 presentation finding (P1-P3) — out of scope by the master plan's phase boundaries.
- The `moderate`/`complex` tier definitions, `COMPLEX_TERM_THRESHOLD`, and BM25 preservation (`shouldPreserveBm25`) — unrelated to the graph/degree gap this phase addresses.
- The `summary`/`community` channels — the finding and the telemetry sample are specific to graph/degree.
- Any change to `getEntityDensityScore`'s underlying causal-edge traversal logic or the causal graph schema itself — this phase may recalibrate the *threshold* the router applies to that score, not the scoring algorithm.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts` | Modify | Recalibrate `LOW_SIGNAL_STOPWORD_RATIO` / `isLowSignalShortQuery`, or replace the stopword-ratio proxy with a signal that fires for content-rich short queries |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts` | Modify | Recalibrate `ENTITY_DENSITY_ACTIVATION_THRESHOLD` and/or `shouldPreserveGraph`'s gating so the dominant 2-3-term content-rich pattern reaches graph/degree more often |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modify | Surface `vectorSearchSkipped`/`embedderAvailable`/`degradationReason` to the caller instead of stopping at Stage 1's internal return value |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modify | Fold the runtime vector skip into `s3meta.routing.skippedChannels`; promote fail-open channel exceptions (graph, BM25, FTS, trigger-phrase) into the same metadata surface |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts` | Modify | Report `injectGraphContext`/traversal failures through the shared channel-exception metadata path in addition to the existing `console.warn` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/routing-telemetry.ts` | Investigate | Confirm whether the rolling window already gives a sufficient before/after signal, or needs an additional dimension (e.g. per-tier or per-query-shape breakdown) to prove the recalibration worked |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | When a query is 2-3 whitespace terms with a stopword ratio below the current 0.5 escalation threshold (content-rich short query), the system SHALL give it a realistic, telemetry-grounded path to include the graph and degree channels. | A frozen fixture of representative 2-3-term content-rich queries (drawn from or modeled on the live telemetry sample) shows a materially higher graph/degree invocation rate after the fix than the current baseline, measured via `routing-telemetry.ts`'s rolling-window snapshot. |
| REQ-002 | When the vector channel is skipped at runtime due to embedding-generation failure, the system SHALL record that skip in the same routing/queryPlan metadata surface used for planned tier-based skips, with a distinct reason string. | A fixture that forces `generateQueryEmbedding` to return null shows `vector` present in `skippedChannels`/`QueryPlan.skippedChannels` with a runtime-failure reason, not silently absent. |
| REQ-003 | The recalibrated escalation heuristic SHALL NOT regress the `simple`-tier fast path for queries that are genuinely low-signal or intentionally narrow (e.g. exact trigger-phrase matches, single-token lookups). | The existing `query-classifier.ts` and `query-router.ts` test suites pass unchanged on trigger-match and single-token fixtures; no fixture in that class gains graph/degree it did not have before. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-004 | Channel-level exceptions currently caught with a fail-open `console.warn`/`console.error` only (graph traversal, graph-context injection, BM25/FTS/trigger-phrase search) SHALL also be recorded in the result-visible metadata surface. | A fixture that forces each of the named failure paths shows the corresponding channel + reason in the result metadata, in addition to the existing console log. |
| REQ-005 | The before/after comparison SHALL be reproducible against the same telemetry sample the finding cites (or an equivalent frozen fixture) rather than a one-off manual read of `routing-telemetry.ts` state. | A named script or test captures the graph/degree invocation rate on the frozen fixture before and after the recalibration and asserts the after-rate exceeds the before-rate. |
| REQ-006 | The recalibration SHALL be reversible without a restart. | A flag (existing `SPECKIT_GRAPH_CHANNEL_PRESERVATION` or a new dedicated flag introduced by this phase) returns the router to pre-recalibration thresholds when toggled off, verified by a fixture run before and after the toggle. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On the frozen fixture modeling the live telemetry sample's dominant query shape (2-3 content-rich terms), the graph/degree invocation rate measured via `routing-telemetry.ts` rises materially above the pre-fix baseline (2/7 = 28.6%), without the fixture's genuinely-vague or trigger-anchored queries gaining channels they should not.
- **SC-002**: A query that fails embedding generation reports `vector` in `skippedChannels` with a runtime-failure reason on 100% of forced-failure fixture runs; today it reports 0%.
- **SC-003**: At least the four channel-exception call sites named in REQ-004 surface their failure in result metadata on a forced-failure fixture, not only in process logs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `007-search-index-integrity-sweep` (F10) | Escalating graph/degree usage before the index is clean would amplify recall of the 42% stale rows F10 removes | Sequence this phase strictly after 007 ships; do not start Core Implementation until 007's fix lands |
| Risk | Recalibrating the stopword-ratio or entity-density threshold too loosely | Simple-tier fast path loses its latency advantage broadly, not just for the dominant content-rich pattern this phase targets | REQ-003's regression fixture on genuinely-vague and trigger-anchored queries; latency measurement alongside the recall measurement in Phase 3 |
| Risk | Two independent escalation hatches (`query-classifier.ts` stopword-ratio, `query-router.ts` entity-density) recalibrated inconsistently | A query could pass one hatch and fail the other in ways that are hard to reason about, or the two fixes could double-fire and destabilize `enforceMinimumChannels` invariants | Investigation task in Phase 1 maps which of the 5 skipped queries in the live sample failed which hatch before deciding whether to change one, the other, or both |
| Risk | Entity-density scoring (`getEntityDensityScore`) depends on the causal graph, which F1-F3 (data-quality track) show carries drift | A recalibrated entity-density threshold could be tuned against a corpus state that is itself unreliable | This phase does not touch the causal-graph data quality; the fixture-based before/after measurement is the guard against tuning to a moving target |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Widening graph/degree invocation for the dominant query pattern SHALL NOT push the majority of `simple`-tier queries onto the `complex`-tier latency profile; the recalibration targets the escalation hatch, not the tier boundary itself.
- **NFR-P02**: The before/after measurement SHALL include a latency comparison alongside the recall/invocation-rate comparison, so a recall gain is not accepted at an unbounded latency cost.

### Reliability
- **NFR-R01**: The recalibrated heuristic SHALL degrade to the pre-fix behavior (channels planned but not preserved) if the entity-density DB lookup fails, matching `shouldPreserveGraph`'s existing cold-start behavior (`query-router.ts:244-245,293-305`).

### Observability
- **NFR-O01**: Every channel skip — planned, runtime-failure, or exception-driven — SHALL be attributable to a specific reason string in result metadata, closing the current console-only gap.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A query with 0 stopwords and 0 entity-density hits (e.g. a novel term not yet in memory_index): recalibration must not force graph/degree for every zero-density query, or the fast path is lost entirely for genuinely narrow lookups.
- A query that already matches `find_spec`/`find_decision` intent: already escalates via the existing intent-driven branch of `shouldPreserveGraph`; the recalibration must not double-count or conflict with that path.
- `complex`-tier queries: already receive graph/degree by default (`DEFAULT_ROUTING_CONFIG.complex`); the recalibration is a no-op there and must stay a no-op.

### Error Scenarios
- `generateQueryEmbedding` throws rather than returning null: confirm the existing catch path still sets `vectorSearchSkipped` and now also reports it in `skippedChannels`.
- `getEntityDensityScore`'s DB handle is unavailable (`safeGetDb` returns null, `query-router.ts:293-305`): entity-density scores 0, the preservation override stays inactive — recalibration must not change this cold-start contract.
- A channel-exception fixture where more than one channel fails in the same query: the metadata surface must attribute each failure to its own channel, not collapse them into one generic error.

### State Transitions
- `SPECKIT_GRAPH_CHANNEL_PRESERVATION` toggled off mid-session: graph preservation (both intent-driven and entity-density-driven) already short-circuits to `{ preserved: false }` (`query-router.ts:258-260`); the recalibrated threshold must respect the same flag rather than bypassing it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two existing heuristics recalibrated, one metadata-propagation gap closed, no new channel or index logic |
| Risk | 15/25 | Runtime behavior change for the majority of production queries (per the master plan's own framing); latency/recall tradeoff needs real measurement, not just a threshold tweak |
| Research | 8/20 | Both root causes confirmed to file:line in this spec; the open item is which of the two hatches accounts for which fraction of the 5 skipped-but-should-have-run queries in the live sample |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 7. CONCRETE CHANGE AND SEAMS

The exact seams, verified to file:line against the live tree.

- `LOW_SIGNAL_STOPWORD_RATIO = 0.5` (`query-classifier.ts:39`) and `isLowSignalShortQuery` (`:157-166`) are the sole stopword-ratio-based escalation hatch for `simple`-tier queries; the constant's own doc comment (`:31-38`) confirms it is deliberately set above ordinary verb-noun stopword ratios, which is precisely why content-rich 2-3-term queries never cross it.
- `DEFAULT_ROUTING_CONFIG.simple = ['vector', 'fts']` (`query-router.ts:115`) is the tier-to-channel mapping the classifier's tier decision drives.
- `shouldPreserveGraph` (`query-router.ts:252-284`) and `ENTITY_DENSITY_ACTIVATION_THRESHOLD = 2` (`:96`) are a second, already-shipped escalation path independent of stopword ratio, gated by intent (`find_spec`/`find_decision`) or entity-density (`getEntityDensityScore(query, db) >= 2`). The live telemetry's 2/7 = 28.6% graph/degree invocation rate reflects the combined effect of both hatches, not the stopword-ratio hatch alone.
- `routeQuery` (`query-router.ts:364-478`) is the call site that runs both hatches: it computes `classification.tier` from `query-classifier.ts`, resolves `channels = getChannelSubset(classification.tier)`, then conditionally layers in `shouldPreserveGraph`'s override at `:436-446`.
- `vectorSearchSkipped` is set at three call sites in `stage1-candidate-gen.ts` (`:907-908`, `:939-944`, `:1265-1266`) on embedding-generation failure, each logging only `console.warn`; the value reaches Stage 1's own return metadata (`:1859-1863`) but `hybrid-search.ts`'s `collectRawCandidates` (`:2262-2314`) does not read it.
- `s3meta.routing.skippedChannels` (`hybrid-search.ts:1369-1392`) is derived exclusively from `routeResult.channels` (the *planned* subset), via `allPossibleChannels.filter(ch => !activeChannels.has(ch))` — a channel that was planned to run and then failed at runtime is absent from this list, not present with a failure reason.
- `routing-telemetry.ts`'s rolling 200-decision window (`recordInvocation`, `:29-36`) and `graphChannelInvocationRate` snapshot field are the existing instrument this phase's before/after measurement should reuse rather than duplicate.

## 8. DEPENDENCIES AND VERDICT

- **Depends on 007-search-index-integrity-sweep**: this phase is sequenced strictly after 007 so that escalating graph/degree usage for the dominant query pattern amplifies a clean index rather than surfacing more of the 42%-stale rows F10 removes. Build gate: do not start Phase 2 (Core Implementation) until 007's fix has shipped.
- **Two pre-existing escalation hatches, not one**: the master plan's finding text names only the `query-classifier.ts` stopword-ratio hatch, but this spec's own investigation surfaced a second, independent entity-density-based hatch already shipped in `query-router.ts`. Both are in scope; `plan.md` records this as an item needing brief investigation (which hatch accounts for how much of the 28.6% rate) before the exact recalibration mechanism is finalized.
- **Verdict: GO**. Both root causes are confirmed to file:line, the fix is a threshold/heuristic recalibration plus a metadata-propagation fix, not a new subsystem. The one open question — whether to recalibrate the stopword-ratio hatch, the entity-density hatch, or both — is resolvable from the same telemetry sample already cited by the finding and does not block scoping this phase.

---

## 10. OPEN QUESTIONS

- Of the 5 skipped-but-should-have-run queries in the live 7-query telemetry sample, how many failed the stopword-ratio hatch versus the entity-density hatch? This determines whether Phase 2 recalibrates `query-classifier.ts`, `query-router.ts`, or both.
- Should the recalibrated threshold be a single new constant, or should the two independent hatches be merged into one signal (e.g. a combined content-richness score) to avoid maintaining two thresholds that must be kept in calibration sync going forward?
- What is the acceptable latency ceiling for the widened graph/degree invocation rate, and who owns that tradeoff decision if the before/after measurement shows a nontrivial latency increase?
<!-- /ANCHOR:questions -->
