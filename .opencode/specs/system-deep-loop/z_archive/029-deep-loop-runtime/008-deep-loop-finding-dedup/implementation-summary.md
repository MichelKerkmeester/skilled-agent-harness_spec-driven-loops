---
title: "Implementation Summary"
description: "Status COMPLETE. Benchmarked the deep-loop fan-out near-duplicate finding dedup SPECKIT_FANOUT_NEAR_DUP_DEDUP plus the lag-ceiling and progress-heartbeat gauges, all default-off, against a labeled multi-worker fan-out finding set on the production merge and pool path. The dedup collapses every labeled near-duplicate restatement with pooled precision 1.0 and distinct-finding recall 1.0 across research and review, removes 7 of 17 records as restatement noise, keeps the strongest severity on review collapse, and is byte-identical when off. The lag-ceiling fires exactly one warning when on and zero when off, the heartbeat fires 43 steady records over a 2s run at 0.05s cadence when on and zero when off. Verdict GRADUATE for all three, the flip is a separate evidence-gated decision this phase recommends but does not enact."
trigger_phrases:
  - "deep loop finding dedup benchmark summary"
  - "fanout near dup dedup graduate verdict"
  - "SPECKIT_FANOUT_NEAR_DUP_DEDUP graduation"
  - "lag ceiling progress heartbeat graduate"
  - "fanout finding noise dedup precision recall"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-runtime/008-deep-loop-finding-dedup"
    last_updated_at: "2026-07-06T17:15:59.122Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran both benchmarks and authored the three graduate verdicts"
    next_safe_action: "Phase complete, verdict lives in benchmark-results.md"
    blockers: []
    key_files:
      - "scripts/dedup-benchmark.mjs"
      - "scripts/gauge-benchmark.mjs"
      - "results/dedup-metrics.json"
      - "results/gauge-metrics.json"
      - "benchmark-results.md"
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
| **Completed** | 2026-06-24 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A benchmark for three default-off deep-loop fan-out capabilities and the verdict it produced. The fan-out merge ships `SPECKIT_FANOUT_NEAR_DUP_DEDUP`, which collapses repeated finding bodies when different fan-out workers restate the same point under different ids and titles, keeping the strongest severity and distinct conflicting content. It also ships the lag-ceiling gauge (a fan-out lag warning) and the progress-heartbeat gauge (per-lineage progress events), both default to zero or off until cadence and benefit are benchmarked. This phase measured all three on the production path and returned a verdict per capability without flipping any default.

The findings:

**The dedup cuts noise with no distinct-finding loss.** A labeled multi-worker fan-out set of three research lineages (9 keyFindings) and three review lineages (8 openFindings), matching the real registry field shape, was merged through the production `mergeResearchRegistries` and `mergeReviewRegistries` exports off vs on. Pooled dedup precision is 1.0 and pooled distinct-finding recall is 1.0 across both paths. The on-path collapsed all five labeled near-duplicate clusters (cache-TTL across three workers, retry-backoff and tombstone-scan across two on research, cyclic-traversal across three and SQL-injection across two on review) and zero false-positive collapses, removing 7 of the 17 source records as restatement noise. Every labeled distinct singleton survived as its own record.

**The strongest severity survives a review collapse.** The cyclic-traversal restatement that one worker rated P0 and two rated P1 collapsed to a single P0 record, so the merge keeps the strictest severity any lineage reported rather than the first or the most common. This is the contract the dedup exists to honor on the review path.

**The dedup is byte-identical when off.** The default merge with no flag is byte-identical to the explicit off merge, and the env-driven on merge is byte-identical to the option-driven on merge. With the flag off the surface variants survive as separate records, exactly the production default, so no consumer sees the collapse until a separate graduation decision flips the flag.

**Both gauges fire usefully when on and are byte-silent when off.** The lag-ceiling fires exactly one `lag_ceiling_exceeded` warning when the oldest pending lineage crosses the configured ceiling (oldest_pending_lag_ms 62 vs ceiling 60), carries the lag gauges, and fires zero warnings at its default of zero. The progress-heartbeat fires 43 `progress` records over a 2-second stub run at a 0.05s cadence, each carrying the elapsed duration and the live lag/pending/failed gauges, a steady non-flooding cadence of one record per tick, and fires zero records at its default of zero.

**Verdict: GRADUATE for all three.** The dedup is a strict improvement on the inflated distinct-finding count that feeds the convergence diversity signal, precision and recall both 1.0, and changes nothing when off. The lag-ceiling adds a one-shot operational warning that cannot flood and is silent when off. The progress-heartbeat adds a steady per-lineage progress signal that is silent when off. The graduation flip is a separate evidence-gated decision driven after the suite verdicts land, which this phase recommends but does not enact.

This phase shipped two read-only benchmark harnesses and three graduate verdicts, edited no shared production code, and flipped no default.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The setup confirmed the production merge, pool, and runner exports and the real research keyFindings and review openFindings field shapes from sampled production registries, then built the labeled research and review fan-out sets with a ground-truth near-duplicate or distinct label per finding cluster. The dedup harness `scripts/dedup-benchmark.mjs` drives `mergeResearchRegistries` and `mergeReviewRegistries` off vs on, maps each merged record back to its ground-truth cluster to count true and false positive collapses and surviving distinct clusters, and scores precision, distinct-finding recall, noise reduction, severity preservation, and off-path byte-identity into `results/dedup-metrics.json`. The gauge harness `scripts/gauge-benchmark.mjs` drives the production `runCappedPool` with a 40ms worker and a 60ms ceiling to capture the one-shot lag warning, spawns the real `fanout-run.cjs` CLI with a sleeping stub executor and a 0.05s cadence to capture the progress records over a 2-second run, and re-runs each gauge at its default off to confirm silence, writing `results/gauge-metrics.json`. Both harnesses read the production modules read-only and synthesize their own fixtures, so neither opens the corpus or the database and neither edits shared code.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Drive the production merge exports, not a reimplementation.** The dedup harness imports the same `mergeResearchRegistries` and `mergeReviewRegistries` the fan-out CLI re-execs rather than reimplementing the collapse, so the precision and recall numbers prove a production-path keep, which is the verdict gate the suite requires.
- **A labeled set grounded in the real registry shape.** The fixtures carry the real research id/title/summary and review findingId/severity/status/title fields read from sampled production registries, so the collapse keys on the same body text the production `nearDuplicateContentKey` reads and the numbers transfer to production.
- **Spawn the real runner for the heartbeat.** The progress-heartbeat helper cannot be imported in isolation because the runner module runs its CLI main on load, so the gauge harness drives the heartbeat through the spawned production CLI exactly as the runtime does, which is the most faithful path to its cadence.
- **Recommend graduation, do not flip the default.** All three capabilities earned a graduate verdict on their own axis, but the flip is a separate evidence-gated decision driven after the suite verdicts land, so this phase records the recommendation and leaves every default off.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `node scripts/dedup-benchmark.mjs` and `node scripts/gauge-benchmark.mjs` run exit 0 and rebuild their metrics files, reading no corpus or database.
- The dedup numbers reproduce across re-runs, and the off path is byte-identical to the production default, proven by the default-versus-explicit-off comparison.
- `results/dedup-metrics.json` reports pooled dedup precision 1.0, pooled distinct-finding recall 1.0, zero false-positive collapses, 7 noise records removed, and the strongest severity kept on the review collapse, every number sourced from the file.
- `results/gauge-metrics.json` reports the lag-ceiling firing one warning when on and zero when off, and the heartbeat firing 43 records when on and zero when off, every number sourced from the file.
- `validate.sh --strict` on this phase exits clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **A synthesized labeled set, not a captured production run.** The fan-out set is synthesized to match the real registry field shape with known near-duplicate and distinct clusters, which gives a clean ground truth for precision and recall but is not a captured multi-model run. The numbers establish that the dedup collapses true restatements and keeps distinct findings on the production merge, but a captured run with noisier real bodies would test the normalized-body match against more surface variation.
- **The heartbeat default cadence is not picked.** The progress-heartbeat earns a graduate verdict on cadence and silence, but the operator-facing default cadence in seconds is a tuning question the benchmark does not settle. A production flip should match the cadence to the typical lineage runtime so the signal is informative without being chatty, which is a configuration choice rather than a defect.
- **The lag-ceiling threshold is a configuration, not a measured optimum.** The benchmark proves the one-shot warning fires at the configured ceiling and is silent at the default, but it does not derive the operator-facing ceiling that best separates a healthy slow lineage from a stuck one, which depends on the deployment's lineage timeout budget.
- **The graduation flip is out of scope.** The three verdicts are recommendations with evidence. The flip to default-on is a separate evidence-gated decision driven after the suite verdicts land, and this phase changes no production default.
<!-- /ANCHOR:limitations -->
