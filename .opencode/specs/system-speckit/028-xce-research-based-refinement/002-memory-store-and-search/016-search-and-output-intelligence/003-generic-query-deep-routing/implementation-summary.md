---
title: "Implementation Summary — Generic-Query Deep Routing"
description: "Generic short queries now escalate to the full retrieval pipeline instead of the channel-reduced cheap route, and weak results return actionable broaden prompts."
trigger_phrases:
  - "generic query routing"
  - "deep routing escalation"
  - "low signal query"
  - "suggested queries recovery"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/003-generic-query-deep-routing"
    last_updated_at: "2026-06-17T08:48:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Implemented generic-query deep routing"
    next_safe_action: "Tune LOW_SIGNAL_STOPWORD_RATIO against real memory_search traffic"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-expander.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/recovery-payload.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/generic-query-deep-routing.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-027-002-017-003"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Optimal LOW_SIGNAL_STOPWORD_RATIO threshold under real traffic"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-generic-query-deep-routing |
| **Completed** | 2026-06-17 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Generic short queries used to read "weak" because the cheap simple route stripped them of the very recall machinery they need: a ≤3-term query classified `simple`, which trimmed the search to two channels and suppressed both rule-based and embedding query expansion. The same low-signal query then produced an empty `suggestedQueries` list, so the agent got no way to broaden. This change routes those queries to the full pipeline and hands back concrete alternatives, while leaving confident short queries on the fast path so cost does not balloon.

### Generic-query escalation in the classifier

The classifier now escalates a short query to the `complex` tier (full channels) with `low` confidence when it has at least two terms, no trigger-phrase anchor, and a stop-word ratio at or above 0.5. Because channel selection keys off the tier and both expansion guards skip only the `simple` tier, this single escalation simultaneously turns on all five channels and un-suppresses synonym/embedding expansion. Marking confidence `low` also lights up the existing `lowSignalQuery` flag in hybrid-search, so the dynamic token budget and weak-result recovery treat the query as the low-signal case it is. Crucially, the escalation adds **no LLM calls**: HyDE and LLM reformulation gate separately on deep request mode at call sites outside this change, and embedding expansion is a vector-only search.

### Actionable recovery suggestions

`generateSuggestedQueries` now appends synonym-expansion variants from the shared `expandQuery` expander after its existing heuristics. A low-signal query like `semantic search` that previously yielded `suggestedQueries: []` now returns broaden prompts such as `embedding search` / `semantic retrieval`. Expansion is best-effort and capped at three suggestions, so it only fills gaps the heuristics leave.

### Enriched memory-system synonym map

Added `semantic`, `retrieval`, `agent`, `skill`, and `council` to `DOMAIN_VOCABULARY_MAP` so the expander covers the memory-system vocabulary that generic queries in this corpus actually use. Existing entries are unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/query-classifier.ts` | Modified | Escalate low-signal short queries to `complex`/`low` (full channels + expansion); add `LOW_SIGNAL_STOPWORD_RATIO` and `isLowSignalShortQuery`. |
| `mcp_server/lib/search/query-expander.ts` | Modified | Add `semantic`, `retrieval`, `agent`, `skill`, `council` to the domain synonym map. |
| `mcp_server/lib/search/recovery-payload.ts` | Modified | Append `expandQuery` variants to `suggestedQueries` (best-effort, capped). |
| `mcp_server/tests/generic-query-deep-routing.vitest.ts` | Created | Pin escalation, cost-control, and recovery-suggestion contracts. |

`query-plan.ts` and `hyde.ts` were intentionally left untouched: `query-plan.ts` is telemetry-only and made no routing decision to change, and HyDE's deep-mode call-site gate lives outside the allowed write set, so editing it could not trigger HyDE without raising LLM cost — which the brief forbids.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The escalation lives entirely in the classifier because that is the only in-scope file whose output propagates to both channel routing (via tier) and the low-signal budget/recovery path (via confidence) — the router, stage1, and hybrid-search were out of scope and needed no edits. A new focused vitest suite plus the full existing query/router/recovery/expansion suites were run green before claiming completion.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Trigger on confidence/stop-word signal, not term count | The brief and research warn that escalating every short query inflates cost. A high stop-word ratio (≥0.5) with no trigger anchor is the available pre-search proxy for "generic"; specific short queries (ratio 0) stay cheap. |
| Set the stop-word floor at 0.5 | Ordinary verb-noun queries like "fix the bug" sit at 0.333 (one stop word of three). A 0.5 floor escalates genuinely vague phrases while keeping those on the fast path — and keeps the existing `simple`-tier contract tests green. |
| Require ≥2 terms | A single token (e.g. "a") is degenerate, gains little from the deep route, and an existing contract test pins it as `simple`. |
| Escalate to `complex`, not `moderate` | "Full channels" in the finding means all five; `complex` is the only tier that also un-suppresses expansion. Channels are local (no LLM), so the cost is bounded. |
| Append, not prepend, expansion variants in recovery | Existing recovery heuristics (parenthetical strip, first-3-words, stop-word trim) keep priority within the 3-item cap, so their contract tests stay green; expansion only fills the empty/low cases. |
| Leave `hyde.ts` and `query-plan.ts` unedited | Touching them could not deliver in-scope value without exceeding the allowed write set or adding LLM cost. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Baseline: the known pre-existing failures called out in the brief (`token-budget-enforcement`, `reconsolidation`, `dist-freshness` from unbuilt dist) were not run and not chased — they are owned by other phases / the orchestrator's dist rebuild.

| Check | Result |
|-------|--------|
| `npm run typecheck` (tsc --noEmit) | PASS — clean, no errors |
| New suite `generic-query-deep-routing.vitest.ts` (8 tests) | PASS |
| query/router/recovery/expander/plan suites (10 files) | PASS — 344 tests |
| Downstream classifier consumers (tier-classifier, smart-router, feature-eval, query-flow, surrogates — 8 files) | PASS — 231 tests |
| Expansion suites (embedding-expansion, -bound, stage1-expansion) | PASS — 24 passed, 13 skipped |
| Regression caught + fixed mid-implementation | `classifyQueryComplexity('a')` initially escalated (single stop-word token); added the ≥2-term guard, re-ran green |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two-content-term generic queries are not distinguishable pre-search.** A query like `semantic search` (two content words, stop-word ratio 0) does not escalate on the lexical signal alone. The complementary trigger the research names — a weak `requestQuality` preview computed *after* a search runs — lives in the S2 confidence-scoring path (out of scope here). The recovery-suggestion improvement still helps that case once a weak result comes back.
2. **`LOW_SIGNAL_STOPWORD_RATIO = 0.5` is a heuristic, not a tuned value.** The research explicitly flags routing thresholds for tuning against real `memory_search` traffic. Treat 0.5 as a conservative starting point.
3. **HyDE is not newly triggered by this change.** HyDE remains gated on deep request mode at its call site; escalating the tier does not flip request mode. This is deliberate (no added LLM cost) — full HyDE-on-generic routing would require a change outside the allowed write set.
<!-- /ANCHOR:limitations -->

---

## Claim I'd Most Expect to Be Wrong

That escalating to the `complex` tier adds no meaningful latency cost. It adds three local channels (bm25, graph, degree) plus a vector-only embedding-expansion search for every low-signal short query. That is non-LLM, but on a cold or large index the extra graph/degree channels could add measurable latency — worth measuring before widening the trigger.

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
