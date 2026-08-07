---
title: "Implementation Summary: Styles-library utilization research"
description: "Completed SOL-xhigh deep-research over how sk-design and its five modes should index, retrieve, and consume the 1,290-style library: 8 iterations to stall-convergence, 48 findings, a ranked six-strategy verdict, and a three-phase implementation sequence."
trigger_phrases:
  - "styles utilization research summary"
  - "design library research status"
  - "deep research styles status"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/001-research-utilization"
    last_updated_at: "2026-07-18T12:27:00Z"
    last_updated_by: "claude"
    recent_action: "Research converged at 8 iters; ranked strategies synthesized"
    next_safe_action: "Seed packet-011 implementation phases from the Phase A/B/C sequence"
    blockers: []
    key_files:
      - "spec.md"
      - "research/lineages/sol/research.md"
      - "research/lineages/sol/deep-research-dashboard.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-styles-utilization-011-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Retrieval substrate: a layered local generation-bound pipeline, not any single substrate."
      - "One coherent anchor by default; multi-style synthesis is exceptional, axis-owned, and capped."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Styles-library utilization research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-research-utilization |
| **Status** | Complete |
| **Level** | 1 |
| **Origin** | First child of the styles-library utilization phase parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An evidence-backed answer to how the sk-design hub and its five modes should index, retrieve, and consume the 1,290-style library, delivered as the loop's synthesis (`research/lineages/sol/research.md`, 16 sections) plus a machine dashboard and a 48-finding registry. No retrieval system was built and the corpus was not modified — this phase is research only.

### Files Created / Changed

| File | Action | Result |
|------|--------|--------|
| `001-research-utilization/{spec,plan,tasks}.md` | Create | The research charter and approach. |
| `001-research-utilization/research/lineages/sol/research.md` | Create (by the loop) | The ranked synthesis with the retrieval-substrate verdict and Phase A/B/C sequence. |
| `001-research-utilization/research/lineages/sol/{deep-research-dashboard.md,findings-registry.json,deep-research-state.jsonl}` | Create (by the loop) | Machine state: 8 iterations, 48 findings, convergence trace. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A single cli-opencode lineage running `openai/gpt-5.6-sol-fast --variant xhigh` was dispatched through `fanout-run.cjs --loop-type research` over one question: how to index, retrieve, and consume the styles library across the hub and its five modes. It ran **8 evidence iterations and stopped on a legitimate stall-convergence** (the `stuckThreshold: 3` no-new-ideas detector fired below the planned 10-iteration ceiling), then ran `phase_synthesis`. The loop externalized state per iteration and bound its final holdout to a single corpus generation. It ran in parallel with the packet-010 extraction.

> A resume launched during this session to push toward the 10-iteration ceiling was found to be redundant — the original lineage had already converged and synthesized — and was stopped before it could re-enter the append-only ledger or overwrite the synthesis. The 8-iteration synthesis is the authoritative result.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Layered local retrieval, not one substrate | A static checked manifest gives deterministic eligibility and freshness; a disposable same-generation BM25/FTS projection adds lexical recall; a live source scan is the freshness oracle. The final holdout showed deterministic ranking (P@5 0.60) and generic BM25 (0.33) each win different mode intents, so no single ranker is authoritative. |
| One coherent anchor by default | Anti-slop core rule: retrieve broadly, select narrowly, transform from one real style. Multi-style synthesis is exceptional, axis-owned, capped, provenance-traceable, and forbidden from averaging raw token values or stacking signature motifs. |
| Semantic reranking is not a baseline dependency | No same-generation measured lift exists; it stays an optional later ablation gated on a larger frozen human-labeled holdout. |
| Bound everything to a generation hash | The corpus grew from 974 to 1,290 bundles mid-loop, so directory counts are observations, not identity; only a sorted content hash with pre/post quiescence is publishable. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:ranked-strategies -->
## Ranked Strategies (from `research.md` §11)

Leverage/distinctiveness scored 1–5 (5 strongest); dependency burden 1–5 (1 best).

| Rank | Strategy | Leverage | Cost | Decision |
|---:|---|---:|---|---|
| 1 | Checked manifest + deterministic eligibility + bounded lexical scan/rank + candidate cards + mode hydration + `CORPUS_USE_PROOF` gate | 5 | 5–8 days | **Ship first** |
| 2 | Disposable same-generation SQLite FTS5/BM25 projection | 4 | +1–2 days | Add after baseline if operational measurements justify it |
| 3 | Frozen human-labeled top-K relevance benchmark | 4 | 2–4 planning days | Validate next; prerequisite for any semantic claim |
| 4 | Optional semantic reranker / embedding projection | 2 (unproven) | ≥4–8 planning days | Defer until measured incremental lift |
| 5 | Watcher / daemon / network retrieval service | 1 | ≥3–5 planning days | **Reject** under sub-second lifecycle evidence |
| 6 | Default full-corpus or full-document prompt loading | 2 | very high recurring context cost | **Reject** |
<!-- /ANCHOR:ranked-strategies -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Loop dispatched (REQ-001) | VERIFIED: SOL-xhigh lineage `fanout-sol-1784366607889-1j7alg` ran to `exitCode 0` with `stall_detected`; `results[0].status = fulfilled`. |
| Ranked synthesis (REQ-002) | VERIFIED: `research/lineages/sol/research.md` is a 16-section synthesis ending in cited `[SOURCE: ...]` references; §11 holds the six-strategy ranking, §15 the Phase A/B/C sequence. |
| Evidence depth | VERIFIED: `findings-registry.json` holds 48 findings across 8 iterations; final holdout bound to generation `sha256:0f70d96a...` over 1,290 bundles / 41,371,290 bytes. |
| Packet validity | Re-confirm with `validate.sh .opencode/specs/sk-design/011-sk-design-styles-utilization --strict --recursive` after this file lands. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Stopped at 8 of a planned 10 iterations.** This was a legitimate stall-convergence, not a failure — the last iterations reported declining new-information ratios and the five required questions were answered. Two fewer iterations means slightly less adversarial pressure on the mode-specific scoring weights, which are left as implementation-time tuning.
2. **Semantic lift is unmeasured.** The recommendation defers semantic reranking precisely because no same-generation labeled comparison exists yet; Phase B must build that benchmark before any Phase C trial.
3. **This is a plan, not a build.** The Phase A/B/C sequence in `research.md` §15 is the input to packet-011 implementation phases; nothing in the sk-design runtime was changed.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:next-steps -->
## Next Steps

Seed the packet-011 parent phase map from `research.md` §15:

- **Phase A — Minimum viable utilization (5–8 eng-days):** retrieval-manifest schema + generator, content/generation hashes with atomic `--write`/`--check`, generic query cards, deterministic required-facet/exclusion filters, bounded source-scan fallback, generation-guarded hydration, mode request adapters for all five modes, `CORPUS_USE_PROOF v1`, and CI change/invalidation tests.
- **Phase B — Lexical acceleration + evaluation (+1–2 days FTS, 2–4 planning days benchmark):** disposable generation-bound FTS5 projection; a larger frozen human-labeled holdout with paraphrase, required-facet, explicit-negative, and hard-negative fixtures.
- **Phase C — Conditional semantic trial:** only if Phase B shows a material unresolved relevance gap; freeze prompts and labels first, measure incremental lift over the deterministic + lexical baseline, promote only if the lift justifies the dependency.
<!-- /ANCHOR:next-steps -->
