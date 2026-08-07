---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: How should the sk-design skill and its five nested modes (interface, foundations, motion, audit, md-generator) smartly index, retrieve, and consume the ~1,290-style design-token library at .opencode/skills/sk-design/styles/?
- Started: 2026-07-18T09:27:16Z
- Status: COMPLETE
- Iteration: 8 of 10
- Session ID: fanout-sol-1784366607889-1j7alg
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Inventory corpus shape, quantify representative token/document characteristics, and map artifacts to sk-design hub and mode contracts | corpus-architecture | 1.00 | 6 | complete |
| 2 | Compare committed static indexing, a structured query store, on-demand DESIGN.md grep, and a layered hybrid using repository-native precedents and measured corpus costs | retrieval-architecture | 0.93 | 6 | complete |
| 3 | Run a bounded mode-specific relevance and context-cost ablation for deterministic eligibility, BM25 top-5 ranking, and optional semantic evidence on one pinned corpus snapshot | retrieval-validation | 0.83 | 6 | complete |
| 4 | Define and validate the hub-plus-five-mode consumption contract and deterministic one-coherent-reference versus bounded-synthesis procedure | mode-consumption | 0.85 | 6 | complete |
| 5 | Define and falsify an operational anti-slop proof gate for corpus use, including coherent-source fingerprinting, transformation deltas, trope limits, refusal paths, and audit integration | anti-slop-proof | 0.93 | 6 | complete |
| 6 | Specify the minimal repository-native build, query, refresh, validation, and corpus-change lifecycle for sk-design style retrieval | tooling-lifecycle | 0.93 | 6 | complete |
| 7 | Rank utilization strategies by leverage, build and operating cost, and provenance, license, staleness, size, and extraction-fidelity risk | strategy-risk-ranking | 0.85 | 6 | complete |
| 8 | Generation-bound human-auditable holdout and retrieval substrate closure | retrieval-validation | 0.85 | 6 | complete |

- iterationsCompleted: 8
- keyFindings: 53
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance?
- [x] What should the hub and each of the five modes consume, and when should a task reference one coherent real style versus synthesize selected attributes across several styles?
- [x] Which anti-slop rules and proof gates keep outputs distinctive rather than averaging the corpus into a generic middle?
- [x] What index build, query, refresh, validation, and corpus-change tooling is justified by the repository's existing patterns?
- [x] How should utilization strategies rank by leverage versus build cost after accounting for size, staleness, licensing, provenance, and extraction fidelity risks?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▅▃▂▁▁▂▃▄▅▅▅▅▃▂▂▂▂
- score sparkline: █▇▆▅▃▂▁▁▂▃▄▅▅▅▅▃▂▂▂▂
- Last 3 ratios: 0.93 -> 0.85 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {"code":147,"other":18}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Mechanical all-corpus substring labels as the final gold standard:** useful for a bounded smoke test, but zero- and near-universal-positive sets cannot validate ranking quality. Future evaluation should use a small human-labeled holdout with known positives and hard negatives rather than vary this same rubric. (iteration 3)
- Claiming semantic improvement without a verified corpus-specific index and labels bound to the same snapshot. (iteration 3)
- Interpreting the motion 0.00 scores as evidence against either ranker. (iteration 3)
- Treating the five-query aggregate P@5 as a general corpus relevance score; the foundations and md-generator rubrics were too broad and the motion rubric had no positives. (iteration 3)
- Using BM25 without deterministic mode/provenance/axis eligibility, even though BM25 outperformed metadata on the discriminating lexical queries. (iteration 3)
- **Top-K-as-palette synthesis:** retrieving several relevant styles and blending their values cannot preserve provenance or a coherent design thesis. Candidate diversity is useful for selection or distinct alternatives, not averaging. (iteration 4)
- Letting corpus rank override hub routing, user pins, target evidence, mode standards, or live measured extraction. (iteration 4)
- Treating incidental temporal words in a static style as motion evidence. (iteration 4)
- Unbounded mixing of top-ranked styles or averaging token values. (iteration 4)
- Using more than one study pair or any corpus synthesis in md-generator's measured phases. (iteration 4)
- **Similarity or novelty scoring as the anti-slop authority:** a visually unusual trope stack can score as novel while violating its named thesis. Use evidence rows and hard contradictions; similarity may only be diagnostic. (iteration 5)
- A prose-only “be distinctive” reminder with no blocking evidence fields. (iteration 5)
- A source citation alone as proof of coherence; content identity does not establish design consistency. (iteration 5)
- Any numeric distinctiveness score that rewards adding more motifs. (iteration 5)
- Audit choosing the design thesis or overruling interface/foundations/motion taste decisions. (iteration 5)
- A committed SQLite/FTS database: it is larger than the compact manifest, environment-dependent, and fully derivable. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:401-417] (iteration 6)
- A filesystem watcher or daemon: full bounded inventory is 51.09 ms and prior generation was 171.1 ms, so lifecycle complexity has no measured justification. [INFERENCE: current bounded inventory and prior benchmark in findings-registry.json:383-399] (iteration 6)
- Do not retry “database as canonical state”; only a disposable generation-bound projection is justified. (iteration 6)
- Keep “semantic ranking before a labeled, generation-bound evaluation” blocked; changing the storage wrapper does not resolve the missing evidence. (iteration 6)
- Mandatory live Refero/browser tests in ordinary PR CI: the extractor already isolates that network-sensitive check behind `--self-test`. [SOURCE: .opencode/skills/sk-design/styles/_harness/README.md:98-106] (iteration 6)
- Per-mode taste rules in the hub or engine: mode-supplied generic requirements preserve the hub's routing boundary. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:164-190,232-290] [INFERENCE: generic capabilities avoid central taste policy] (iteration 6)
- Promote “watcher/daemon-based refresh for this corpus” to exhausted unless future profiling shows build/check latency above the interactive budget. (iteration 6)
- Semantic embeddings in the first build: semantic lift is still unmeasured on a generation-bound labeled holdout. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:531-548] (iteration 6)
- Default full-document loading and watcher/service infrastructure: the former externalizes cost into context and copying exposure; the latter has no measured runtime need. (iteration 7)
- Keep watcher/daemon/service retrieval and pre-evaluation semantic ranking blocked unless future measurements invalidate the current sub-second local lifecycle or demonstrate same-generation relevance lift. (iteration 7)
- Promote default full-corpus prompt loading to an exhausted strategy: its apparent zero build cost hides maximum recurring context cost and bypasses candidate, provenance, hydration, and coherence controls. (iteration 7)
- Shipping semantic reranking before a labeled, same-generation comparison: storage/versioning work cannot substitute for relevance evidence. (iteration 7)
- Treating absent license fields as either permission or prohibition: the metadata supports only `unknown`, not a legal verdict. (iteration 7)
- Treating the secondary scan's `malformed_urls` counter as corpus evidence: the URL regex consumed Markdown's `](` separator in duplicated link syntax; direct field coverage was retained, but that counter was discarded. (iteration 7)
- BM25-only ranking for compositional or negated mode intents; high term frequency can reward an explicit contradiction. (iteration 8)
- Metadata-only final ranking; prior interface/audit evidence shows material lexical gains after deterministic eligibility. (iteration 8)
- Promote “one ranker can be authoritative across all five modes” to exhausted; the evidence requires deterministic constraints, lexical ranking, and mode-owned judgment. (iteration 8)
- Promote “semantic reranking required before baseline launch” to exhausted for this decision. Reconsider only as a separately measured same-generation ablation. (iteration 8)
- Semantic reranking as a baseline dependency without a same-generation labeled comparison. (iteration 8)
- Treating pooled recall as corpus-wide recall or this nine-candidate-per-mode pool as a universal gold standard. (iteration 8)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
