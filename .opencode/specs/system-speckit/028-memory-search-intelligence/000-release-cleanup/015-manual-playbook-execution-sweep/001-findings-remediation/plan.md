---
title: "Implementation Plan: Manual Playbook Sweep Findings Remediation [template:level_2/plan.md]"
description: "Per-finding root-cause hypotheses and proposed fixes, grouped by theme, updated dynamically as new FAILs are confirmed."
trigger_phrases:
  - "playbook sweep findings remediation plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Manual Playbook Sweep Findings Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

## Approach

For each FAIL scenario, this plan states: the observed symptom (from the scenario's own Evidence/VERDICT text), a root-cause hypothesis, the files most likely responsible (per the scenario's own Failure Triage pointers where present), and a proposed fix direction. Entries are grouped by theme where a shared root cause is plausible. **No fix has been implemented yet** — this is planning only, per REQ scope. Each hypothesis must be re-verified against real code before any change lands (a dispatch's self-reported root cause is a hypothesis, not a fact).

---

## Group A: Feature-flag / kill-switch propagation bugs

FIVE findings now show the same shape: a boolean env flag doesn't actually control its feature's effect, despite unit tests passing. This is a strong signal there may be ONE shared root cause (e.g. a common flag-reading utility that's broken, or a caching layer that ignores flag state) rather than 5 independent bugs -- worth checking for a shared pattern before fixing each individually. Members: REQ-110 (SPECKIT_GRAPH_UNIFIED), REQ-113 (SPECKIT_MEMORY_ADAPTIVE_RANKING), REQ-200 (ENABLE_BM25), REQ-211 (SPECKIT_CAUSAL_BOOST / isCausalBoostEnabled), REQ-212 (SPECKIT_COMMUNITY_SEARCH_FALLBACK), REQ-214 (isContextHeadersEnabled / contextual tree injection) -- SIX findings now, strong signal of a shared root cause worth investigating as ONE fix before touching each site individually.

### REQ-110 — `SPECKIT_GRAPH_UNIFIED=false` doesn't disable graph signals
- **Symptom**: `meta.cacheHit: true`, `killSwitchActive:false`, `graphSignalsApplied:true`, `selectedChannels` still includes `graph`/`degree` even with the flag off.
- **Root-cause hypothesis**: Stage 2 of the unified retrieval pipeline reads a cached result computed while the flag was on, or checks the flag at the wrong stage boundary (a caching/staleness issue, not a missing flag-check).
- **Affected files**: graph contribution trace metadata path (`graphContribution` in the unified retrieval Stage 2 code), CTE/query-plan construction for graph channels.
- **Proposed fix**: Ensure the flag is re-checked (not just cached) at Stage 2 entry; invalidate `cacheHit` when the flag state differs from the cached computation's flag state.

### REQ-113 — `SPECKIT_MEMORY_ADAPTIVE_RANKING=true` doesn't emit `adaptiveShadow` proposal
- **Symptom**: Flag-on run produces no `adaptiveShadow` proposal payload; flag-off run also produces no proposal output (expected — but flag-on should differ from flag-off and doesn't).
- **Root-cause hypothesis**: The proposal-emission code path is gated on a second condition beyond the flag (e.g. a minimum access/validation signal count) that isn't being met in the test scenario, OR the emission path was never wired to this flag.
- **Affected files**: Adaptive-ranking proposal emission logic; bounded delta cap check.
- **Proposed fix**: Verify adaptive signals are actually being recorded from access/validation events first (per the scenario's own triage); if they are, trace why the bounded delta cap or emission gate suppresses output.

---

## Group B: "Read-only" paths that mutate data

### REQ-156 — `indexMemoryDeferred` "read-only" same-path update mutates `encoding_intent`
- **Symptom**: Correct intent labels assigned/persisted for document/code/structured examples, but a same-path update changed row `id: 2`'s `encoding_intent` from `"code"` to `"document"` — this path is documented/expected to be read-only for existing rows.
- **Root-cause hypothesis**: The deferred indexing path recomputes `encoding_intent` on every pass (including for already-indexed rows) instead of only computing it once at first-index time, and the recompute uses a different/updated classification heuristic than the original.
- **Affected files**: Intent classification rules, metadata persistence in the deferred-indexing write path.
- **Proposed fix**: Gate the `encoding_intent` write behind an "is this a first-time index" check, or make the deferred path explicitly skip re-classification of fields that already have a value (true read-only-on-existing-rows semantics).

---

## Group C: Scoring / fusion pipeline gaps

Three findings all touch the Stage-2 scoring/fusion pipeline; worth investigating as one connected root cause before assuming three separate bugs.

### REQ-129 — Stage-2 score sync missing for non-hybrid path
- **Symptom**: `searchType: "hybrid"`, `isHybrid: true`, `intentWeightsApplied: "off"`, no Step 4 `intentAdjustedScore`, no trace-level Math.max sync progression — for a request expected to take the non-hybrid path.
- **Root-cause hypothesis**: The request is being routed into the hybrid path even when non-hybrid was expected/requested, OR the non-hybrid path exists but never runs the Math.max score-sync step that the hybrid path does.
- **Affected files**: Stage-2 intent weighting logic, `resolveEffectiveScore` fallback chain.
- **Proposed fix**: First confirm routing (is this scenario actually reaching non-hybrid code, or mis-routed into hybrid?) — the fix branches depending on that answer.

### REQ-133 — Channel min-representation ignores `QUALITY_FLOOR=0.005`
- **Symptom**: Top-k representation logic present, but channels scoring `0.004`/`0.001` (below the `0.005` floor) still receive representative slots/promotions.
- **Root-cause hypothesis**: The quality-floor check is applied before min-representation guarantees are computed, so min-representation's "ensure every channel gets ≥1 slot" logic overrides the floor instead of being bounded by it.
- **Affected files**: Channel min-representation algorithm, quality-floor threshold check ordering.
- **Proposed fix**: Apply the quality floor as a hard filter before min-representation selection, not after (or make min-representation floor-aware).

### REQ-134 — `confidenceTruncation` metadata missing from real traces
- **Symptom**: Synthetic long-tail test passes (cliff detection + documented tests), but a real long-tail query's trace doesn't expose `thresholdMultiplier`/`medianGap`/`cutoffGap`/`minResultsGuaranteed`.
- **Root-cause hypothesis**: The metadata is computed but only attached to the trace object in the synthetic-test code path, not in the real query execution path (a wiring gap between test harness and production trace assembly).
- **Affected files**: Cliff-detection algorithm's trace-metadata emission.
- **Proposed fix**: Confirm the metadata computation itself runs on real queries (add a log/assert), then trace why it isn't reaching the trace object that ships to callers.

---

## Group D: Individual findings (no shared theme identified yet)

### REQ-003 — BM25 re-index gate
- **Symptom**: Gate doesn't reliably detect trigger mutations vs FTS5-only lexical updates.
- **Fix direction**: Inspect `syncChangedRows()`; ensure BM25 enablement state is checked separately from generic FTS5 sync evidence.

### REQ-004 — Bounded graph walk trace fields missing
- **Fix direction**: `mcp_server/formatters/search-results.ts`, `mcp_server/lib/search/hybrid-search.ts` — confirm bounded-graph fields are populated in the trace envelope; cross-check against `search-results-format.vitest.ts`.

### REQ-015 — Trigger-phrase matching cache/reload issue
- **Fix direction**: Verify `idx_trigger_cache_source` index exists; confirm reload query filters to successful rows with non-empty trigger phrases.

### REQ-016 — `memory_context` specFolder/intent mismatch
- **Fix direction**: Check intent resolution when specFolder is provided without explicit intent.
