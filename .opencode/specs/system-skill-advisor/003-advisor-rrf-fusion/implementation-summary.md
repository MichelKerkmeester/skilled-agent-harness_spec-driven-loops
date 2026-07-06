---
title: "Implementation Summary"
description: "Status COMPLETE. Benchmarked the advisor RRF-fusion cluster against the weighted-sum baseline on routing top-1 correctness through the production scoreAdvisorPrompt path against a read-only copy of the live advisor projection, on a widened 42-prompt set with two bands that target the guard seams directly. RRF lifts top-1 from 37 of 42 (0.8810) to 38 of 42 (0.9048) with zero regressions and 0.9762 agreement. The self-recommendation guard moves zero top-1 even on four audit prompts built to trigger it and is behaviorally redundant with the existing generic explainer floor and the un-flagged audit penalty. The conflict-rerank seam, fed real conflicts_with mass through an in-memory overlay, corrects one top-1 (4 of 5 to 5 of 5) and repairs a regression RRF itself introduces, since plain RRF drops the signed conflict suppression the weighted-sum keeps natively. Default-off byte-identical across all 42 prompts, deterministic, source database hash unchanged, no production code edited. Verdict GRADUATE for the RRF core paired with the conflict-rerank seam, CUT for the self-recommendation guard."
trigger_phrases:
  - "advisor rrf fusion benchmark"
  - "SPECKIT_ADVISOR_RRF_FUSION verdict"
  - "advisor routing top-1 correctness"
  - "advisor conflict rerank seam graduate"
  - "advisor self recommendation guard cut"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/003-advisor-rrf-fusion"
    last_updated_at: "2026-07-06T17:16:00.338Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Re-benchmarked the widened set and authored the per-seam verdicts"
    next_safe_action: "Phase complete, verdicts live in benchmark-results.md"
    blockers: []
    key_files:
      - "results/metrics.json"
      - "benchmark-results.md"
      - "scripts/advisor-rrf-benchmark.mjs"
      - "scripts/labeled-routing-set.mjs"
      - "scripts/conflict-overlay.mjs"
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

A reproducible benchmark of the advisor RRF-fusion cluster against the weighted-sum baseline, widened to earn a verdict for each of the three seams. The cluster is `SPECKIT_ADVISOR_RRF_FUSION` (the lanes fused through the shared RRF primitive at `ADVISOR_RRF_K=8` with the RRF rank order as the post-bonus tiebreak), the conflict-rerank seam (graph conflict mass preserved as a deterministic post-fusion demotion), and `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` (the generalized self-penalty). All three ship default-off and byte-identical when off.

The first pass measured a 33-prompt set and returned REFINE: RRF showed a one-prompt lift, but the self-guard was inert and the conflict seam was structurally dormant because the live corpus carries no `conflicts_with` edges. This pass widened the set to 42 prompts, added a self_guard band of four audit prompts built to trigger the guard, added a conflict band of five near-tie prompts whose runner-up is a conflict target of the gold skill, and seeded five `conflicts_with` edges into the in-memory projection through a benchmark overlay so the conflict seam has real mass to demote. The live corpus stays read-only, the overlay is a benchmark fixture merged into the loaded projection, not a corpus write. The findings:

**RRF lifts top-1 by one prompt with zero regressions.** Top-1 correctness rises from 37 of 42 (0.8810) under the weighted-sum baseline to 38 of 42 (0.9048) under RRF. The exact band rises from 0.8667 to 0.9333. The paraphrase, hard, self_guard and conflict bands are unchanged in the main arm table. The agreement spread versus baseline is 0.9762: exactly one prompt moved its top-1 and it moved from wrong to right. RRF regresses none of the 42. On `codex pr review` the weighted-sum baseline picked `sk-code-review` because the lexical tokens outweighed the explicit-author `codex` signal, and RRF rank fusion put `cli-codex` first, the canonical case rank fusion is built for.

**The self-recommendation guard shows no signal and is behaviorally redundant.** Over the four audit-recommendation-quality prompts that make `system-skill-advisor` a strong candidate, the guard moves zero top-1, correct with the guard off is 4 of 4 and correct with the guard on is 4 of 4. Reading the production scorer shows why this is structural, not a thin-set artifact. On any read-only-explainer prompt the generic floor pins every skill to the explainer floor, and `system-skill-advisor` is never in the `readOnlyRouteAllowed` allowlist, so its confidence-floor branch under the guard is unreachable as distinct behavior. On audit prompts the `auditRecsAdvisorPenalty` already fires for `system-skill-advisor` in the guard-off path, so the guard only generalizes a penalty that was already applied. The guard duplicates demotions the scorer already makes.

**The conflict-rerank seam shows signal and repairs a regression RRF itself introduces.** Over the five conflict prompts the conflict differential compares RRF against the live projection (no conflict edges) with RRF against the overlay (five `conflicts_with` edges). Conflict mass moves one top-1, correct without the overlay is 4 of 5 and correct with the overlay is 5 of 5. The corrected prompt is the key finding: on `find the structural impact of this code change across callers` the weighted-sum baseline already routes correctly to `system-code-graph` because the graph-causal lane folds the signed conflict mass into the weighted sum natively, plain RRF regresses it to `sk-code` because RRF rank fusion discards the signed conflict suppression, and the conflict-rerank seam re-injects that suppression as a comparator demotion and restores `system-code-graph`. The seam is not a luxury, it is the safety net that keeps RRF from regressing conflict-bearing prompts.

**Verdicts: GRADUATE the RRF core with the conflict-rerank seam, CUT the self-recommendation guard.** RRF is a real, regression-free improvement and the conflict seam is load-bearing for RRF because RRF drops the conflict suppression weighted-sum holds natively, so the two graduate together. The self-guard adds no demotion the scorer was not already making, so it is dead weight behind a flag and the honest move is to delete it. All measurements are deterministic and byte-identical when off, and the conflict overlay does not change the default-off top-1, so the graduation recommendation stays safe to flip.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The setup confirmed the production scorer entry point `scoreAdvisorPrompt` and verified the compiled dist bundle carries the RRF tiebreak, the conflict adjustment and the self-guard, then read the conflict path in `graph-causal.ts` (the `conflicts_with` multiplier is -0.35 and the signed conflict mass splits into a conflict view) and the guard path in `fusion.ts` (the generic explainer floor and the un-flagged audit penalty). The labeled routing set in `scripts/labeled-routing-set.mjs` pairs 42 prompts with the correct skill across five bands, each gold answer grounded in the corpus trigger phrases, with the self_guard band built to trigger the guard and the conflict band built so each runner-up is a conflict target. The conflict overlay in `scripts/conflict-overlay.mjs` carries five `conflicts_with` edges modeling real routing conflicts and merges them into the loaded projection for the conflict band only. The harness in `scripts/advisor-rrf-benchmark.mjs` copies the live database into `results/skill-graph.backup.sqlite` as the evidence record and into a tmp dir as the loader scratch copy, loads the projection once, runs the three arms by toggling only the real flag readers, runs the self-guard and conflict differentials, and writes `results/metrics.json`, the single source for the data tables and the verdicts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Import the compiled production scorer, do not reimplement it.** The harness calls the same `scoreAdvisorPrompt` and `loadAdvisorProjection` the recommend handler uses and toggles only the real flag readers, so the measured path is the shipped path rather than an eval surrogate.
- **Seed conflict mass through an in-memory overlay, not a live-corpus write.** The phase keeps the live corpus read-only, so the five `conflicts_with` edges are merged into the loaded projection the harness already controls. The production conflict path runs against real mass without mutating any production data, which honors the read-only constraint while giving the seam something to demote.
- **Score the conflict band per arm.** The conflict comparator demotion is RRF-gated, so the baseline scores the conflict band against the live projection and the RRF arms against the overlay. Scoring the baseline against the overlay too would have hidden that RRF without the seam regresses the structural-impact prompt.
- **Cut the self-guard on structural evidence, not just a null result.** The guard moving zero top-1 is the symptom, the cause is that its two branches duplicate the generic explainer floor and the un-flagged audit penalty. Reading the scorer turned an inert measurement into a CUT verdict grounded in why the guard cannot bite.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- The benchmark imports the compiled production `scoreAdvisorPrompt` and `loadAdvisorProjection` and toggles only `SPECKIT_ADVISOR_RRF_FUSION` and `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`, so the measured path is the production routing path.
- The projection loads from `sqlite` with 27 entries against the read-only backup copy, and the source `skill-graph.sqlite` hash is unchanged after the run, confirmed by git showing no change.
- `results/metrics.json` reports the per-prompt top-1 for all three arms, the per-band breakdown, the agreement spread, the self-guard differential, the conflict differential, the determinism pass and the byte-identity pass.
- RRF lifts top-1 from 37 of 42 (0.8810) to 38 of 42 (0.9048) with 0.9762 agreement, one prompt moved. The self-guard differential shows 0 of 4 top-1 moved. The conflict differential shows 1 of 5 top-1 moved and correct rising from 4 of 5 to 5 of 5. Every number is sourced from metrics.json.
- The off-arm is byte-identical across repeated runs over all 42 prompts, every arm is run-to-run top-1 stable, and the conflict overlay changes no default-off top-1.
- `node scripts/advisor-rrf-benchmark.mjs` reproduces the benchmark from the read-only projection copy and the in-memory overlay, exit 0.
- `validate.sh --strict` on this phase exits clean. No production code was edited and no flag default was flipped.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **The conflict seam was measured against a benchmark overlay.** The live corpus carries no `conflicts_with` edges, so the seam was fed conflict mass through an in-memory overlay rather than the live corpus, which the phase keeps read-only. The graduation holds as a property of RRF (the seam prevents an RRF regression on any conflict-bearing prompt), and the seam is inert on the current corpus precisely because there are no conflict edges. Authoring `conflicts_with` edges into the live corpus is a separate corpus-authoring decision, after which the seam begins to add routing value rather than only preventing a regression.
- **The RRF lift is one prompt of 42.** With a deterministic scorer the lift exceeds run-to-run variance and is regression-free, so it is a defensible graduate, but the routing margin is still narrow and a larger or harder set could widen or narrow it.
- **The four shared baseline failures are out of scope.** `spec folder save context memory search`, the chrome-devtools and design-md-generator paraphrases and `gather codebase context` fail under both arms because the lane evidence points the wrong way. They are corpus and lane-signal routing gaps, not a fusion question for this flag.
- **The CUT of the self-guard rests on the current scorer.** The guard is redundant because of the generic explainer floor and the un-flagged audit penalty as they exist today. A future change that lifts `system-skill-advisor` off the explainer floor or removes the un-flagged audit penalty would change that calculus, so the CUT should be paired with the deletion of the guard code rather than left as a dormant flag.
<!-- /ANCHOR:limitations -->
