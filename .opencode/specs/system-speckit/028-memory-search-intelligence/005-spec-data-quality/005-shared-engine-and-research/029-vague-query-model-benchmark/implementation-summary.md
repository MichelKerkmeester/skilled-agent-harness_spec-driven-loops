---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status COMPLETE. Ran a 144-cell read-only benchmark of how MiMo, Kimi, DeepSeek and gpt-5.5 drive /memory:search on vague queries. The citation-policy surface is fully model-robust at a cite-correct rate of 1.0, DeepSeek is the best driver, Kimi over-explores, gpt-5.5 at medium drops envelope fields, and an off-corpus false-relevance on kubernetes is a calibration property shared by every model."
trigger_phrases:
  - "vague query model benchmark"
  - "memory search model comparison"
  - "model search recommendation"
  - "requestQuality citation robustness"
  - "search behavior benchmark"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/005-shared-engine-and-research/029-vague-query-model-benchmark"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran 144-cell matrix, parsed metrics, authored results and analysis"
    next_safe_action: "Consider a red-team query for the kubernetes false-relevance"
    blockers: []
    key_files:
      - "results/metrics.json"
      - "benchmark-results.md"
      - "scripts/run-benchmark.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-06-22, post-graduation re-run 2026-06-23 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A custom benchmark harness and the run it produced. The harness is three files in `scripts/`, a config naming the matrix, an idempotent concurrent dispatch driver, and an event-stream parser that aggregates to mean plus variance. It dispatched 144 bare `/memory:search` queries, four models by twelve vagueness-graded queries by three samples, all read-only, all parsed, none failed.

The findings:

**The citation surface is fully model-robust.** Every model honored the cite-iff-good rule at a rate of 1.0 across all twelve queries. Whenever all four models emitted a `requestQuality` verdict, the verdict was identical. Seven of twelve queries reached full agreement, and all five disagreements were a `null` field, a model not rendering the verdict, never two models returning conflicting good-versus-weak calls. The data-quality signal the command exposes does not depend on which model drives it. The only cross-model variance is in envelope fidelity, whether a model renders the full contract.

**DeepSeek is the best driver.** It posts the lowest tool count and the lowest variance, the fastest latency at 70 seconds, the highest envelope fidelity at 6.9 of 7, and the most stable verdicts at 0.92. MiMo is a close and cheaper second, lean at 5.1 tools and 90 seconds, spiking only when a query returns a strong head it chooses to chase.

**Kimi over-explores, expensively.** It averages 14.7 tool calls against the others near 5, peaks at a mean of 23.7 on deep-loop, and is the slowest at 271 seconds, slow enough that several cells hit the 600-second cap. The extra calls buy nothing, the verdict it reaches matches the lean models, and on two aligned queries the long exploration costs it the envelope field entirely.

**gpt-5.5 at medium is the weakest driver.** It carries the lowest envelope fidelity at 5.6 and the tersest output at 468 chars, and on three generic queries it both retrieves a markedly lower top score than the high trio and omits the verdict. Medium reasoning is too thin to render this command reliably, the comparison would close if it ran at high.

**An off-corpus false-relevance is a calibration property, not a model behavior.** `authentication` correctly lands weak near 0.50 across all four models. `kubernetes` lands good at 0.78 across all four, where the top hit is the unrelated Spec Memory Runtime Retention Cleanup summary. Identical across every model, this is the absolute-relevance calibration over-scoring an off-corpus term, and the models faithfully reported it. This is the one finding that touches 005 data quality directly, the quality gate can wave a confident citation through on a spurious match.

**Recommendation.** Use DeepSeek for `/memory:search` dispatches, MiMo when cost matters more than the last point of fidelity. Avoid Kimi for this command, and do not run gpt-5.5 below high.

**Post-graduation re-run (2026-06-23) confirms the calibration fix.** The off-corpus false-relevance above was the one finding that touched 005 data quality directly. The noise-floor and lexical-grounding flags that close it graduated to default-ON, and a four-model re-run on the same matrix against the live flags moved the discriminating queries exactly as intended. `kubernetes` dropped from `good` at 0.79 to `weak` at 0.53, `authentication` from `weak` to `gap`, and the post-graduation scores now stratify cleanly by query alignment from aligned 0.68 to max-vague 0.23. The re-run also surfaced findings the first pass could not: the new cite_with_caveat tier is live and coherent, the intent classifier collapses every vague query to `understand` with no weights applied, and Kimi is two and a half times slower while accounting for eight of ten unparsed cells. A dashboard review then found a `good` verdict rendered beside an `[EVIDENCE GAP DETECTED]` banner on 19 of 144 cells, the one substantive presentation bug. gpt-5.5 at medium showed the same calibration fix and its envelope fidelity actually rose from 5.6 to 6.6 against the cleaner verdict path, softening the original weakest-driver verdict. The full re-run data, the cross-cutting findings and the dashboard review are sections 5 through 8 of `benchmark-results.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The driver expanded the config into one cell per model, query and sample, then ran them through an async spawn pool at a concurrency of three, the cli-opencode launch-race ceiling. Each cell dispatched `opencode run --command memory/search` with stdin closed and a hard timeout, wrote its raw event stream and a timing sidecar, and retried once on an empty output. The nine cells overlapping an earlier pilot were folded in as sample one. The parser read every raw stream into per-cell metrics and aggregated them to `results/metrics.json`, the single source for both data tables and this analysis.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **A custom harness, not the deep model-benchmark sweep.** That sweep scores on correctness assertions and pass-rate, which would penalize the behavioral diversity this benchmark exists to measure. A purpose-built parser reads behavior instead.
- **gpt-5.5 at medium, the others at high.** The operator named medium for gpt-5.5 and the high trio reused the pilot. The cost is a tier mismatch, recorded as a limitation, the medium fidelity result should be read against that.
- **Three samples per cell.** LLM dispatches are non-deterministic, so every metric carries variance rather than a single point estimate, which is what exposed Kimi's wide tool-count spread.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `results/metrics.json` reports 144 of 144 cells parsed, zero failed or truncated below the 200-byte floor.
- Every number in `benchmark-results.md` and in the findings above is sourced from `metrics.json`, generated by the parser from the raw streams.
- The run is read-only, only bare-query retrieval was dispatched, no analysis subcommand, so no memory record was written.
- `node scripts/run-benchmark.mjs` reproduces the matrix from the committed config, skipping any cell that already has a raw file.
- `validate.sh --strict` on this phase exits clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **The variant axis is not apples-to-apples.** gpt-5.5 ran at medium against a high trio, so its weakest-driver result conflates the model with the reasoning tier. A follow-on running every model at both medium and high would separate the two.
- **Latency is wall-clock, not billed compute.** It includes queueing and the launch pool, so it ranks the models rather than pricing them.
- **The kubernetes false-relevance is one off-corpus term.** It shows the gate can over-score a spurious match, but a single term does not measure the rate. A standing red-team query set would. The 2026-06-23 re-run confirms the graduated flags fixed this one term, but the rate question stands.
- **Open follow-ups from the re-run.** The `good`-verdict-beside-evidence-gap-banner contradiction on 18 of 110 cells needs tracing to the Stage-4 bridge or a separate render-time banner. The cite-correct metric in `extract-metrics.mjs` must be made three-tier-aware before its column reads true again. The intent classifier returning `understand` for every vague query is a routing ceiling worth a decision. The full list is section 8 of `benchmark-results.md`.
- **The variant axis is still not apples-to-apples in the re-run.** gpt-5.5 ran at medium against the high trio in both passes, so its numbers improved post-graduation but still carry the tier handicap. A both-tiers run would separate model from reasoning depth.
<!-- /ANCHOR:limitations -->
