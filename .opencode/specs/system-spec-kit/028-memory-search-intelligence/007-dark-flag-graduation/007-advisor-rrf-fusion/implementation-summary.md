---
title: "Implementation Summary"
description: "Status COMPLETE. Benchmarked the advisor RRF-fusion cluster against the weighted-sum baseline on routing top-1 correctness through the production scoreAdvisorPrompt path against a read-only copy of the live advisor projection. A 33-prompt labeled routing set grounded in the corpus trigger phrases scored three arms. RRF lifts top-1 from 28 of 33 (0.8485) to 29 of 33 (0.8788) with zero regressions and 0.9697 agreement, the one moved prompt (codex pr review) corrected from sk-code-review to cli-codex because rank fusion resisted the lexical lane magnitude that swamped the dominant explicit-author signal. The self-recommendation guard is inert on this set and the conflict-rerank seam is structurally dormant because the live corpus carries no conflicts_with edges. Default-off byte-identical across all 33 prompts, scorer deterministic, source database hash unchanged. Verdict REFINE: the RRF core is the closest to graduate-ready but a one-prompt margin and two unproven seams argue for a larger labeled set and live conflict data before a flip."
trigger_phrases:
  - "advisor rrf fusion benchmark"
  - "SPECKIT_ADVISOR_RRF_FUSION verdict"
  - "advisor routing top-1 correctness"
  - "advisor rrf refine verdict"
  - "advisor self recommendation guard dormant"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/007-advisor-rrf-fusion"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Measured the three-arm matrix and authored the REFINE verdict"
    next_safe_action: "Phase complete, verdict REFINE lives in benchmark-results.md"
    blockers: []
    key_files:
      - "results/metrics.json"
      - "benchmark-results.md"
      - "scripts/advisor-rrf-benchmark.mjs"
      - "scripts/labeled-routing-set.mjs"
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

A reproducible benchmark of the advisor RRF-fusion cluster against the weighted-sum baseline, and the verdict it produced. The cluster is `SPECKIT_ADVISOR_RRF_FUSION` (the lanes fused through the shared RRF primitive at `ADVISOR_RRF_K=8` with the RRF rank order as the post-bonus tiebreak), the conflict-rerank seam (graph conflict mass preserved as a deterministic post-fusion demotion), and `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` (the generalized self-penalty). All three ship default-off and byte-identical when off, and none had been measured against the real corpus on the production routing path.

The benchmark imports the compiled production scorer `scoreAdvisorPrompt` and the production projection loader `loadAdvisorProjection`, the exact pair the `advisor_recommend` handler calls, copies the live `skill-graph.sqlite` once and opens a read-only scratch copy, and runs a 33-prompt labeled routing set under three arms by toggling only the real flag readers. The semantic_shadow lane is left neutral so both arms share an identical live lane set. The findings:

**RRF lifts top-1 by one prompt with zero regressions.** Top-1 correctness rises from 28 of 33 (0.8485) under the weighted-sum baseline to 29 of 33 (0.8788) under RRF. The exact band rises from 0.8667 to 0.9333. The paraphrase band (0.75) and the hard band (1.00) are unchanged. The agreement spread versus baseline is 0.9697: exactly one prompt moved its top-1 and it moved from wrong to right. RRF regresses none of the 33.

**The moved prompt is the canonical rank-fusion case.** On `codex pr review` the weighted-sum baseline picked `sk-code-review` because the lexical tokens `pr` and `review` outweighed the explicit-author `codex` signal. RRF rank fusion put `cli-codex`'s explicit-author rank first, so the dominant intent won. Rank fusion resists a single lane's magnitude swamping the correct dominant rank, which is what RRF is built for.

**The four shared baseline failures are corpus gaps, not fusion failures.** `spec folder save context memory search` routes to the `memory:save` bridge, the two paraphrases for chrome-devtools and design-md-generator lose to `sk-code` on `inspect` and `css`, and `gather codebase context` loses to `system-spec-kit`. All four fail identically under both arms because the lane evidence itself points the wrong way, and RRF cannot promote a skill the lanes do not support.

**Two of the three seams are dormant on the live corpus.** The self-recommendation guard only fires for an advisor self-recommendation on a read-only-explainer prompt, and the labeled set carries none, so the RRF-plus-guard arm is byte-equal to the RRF arm. The conflict-rerank seam demotes by graph conflict mass that comes only from `conflicts_with` edges, and the live corpus carries only `enhances`, `siblings`, `prerequisite_for` and `depends_on` edges and zero `conflicts_with` edges, so the seam has nothing to demote and is structurally dormant. Neither seam can earn or fail a verdict on the current corpus.

**Verdict: REFINE.** RRF fusion is a real, regression-free directional improvement, and with a deterministic scorer the one-prompt lift exceeds the zero run-to-run variance. But the margin is a single prompt of 33, the self-recommendation guard is inert, and the conflict-rerank seam is structurally dormant, so two of the cluster's three seams cannot be measured on the current corpus. The honest verdict is REFINE: the RRF core is the closest to graduate-ready, but a wider labeled set (with deliberate advisor-self read-only-explainer prompts and more near-tie paraphrases) and live `conflicts_with` edges are the named refinement that would let the RRF core graduate on a margin wider than one prompt and let the two guards land their own evidence. The refinement lands entirely behind the existing default-off flags, so it stays safe to ship dark.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The setup confirmed the production scorer entry point `scoreAdvisorPrompt` and verified the compiled dist bundle carries the RRF tiebreak, the conflict adjustment and the self-guard, then confirmed the projection loader reads `skill-graph.sqlite` from `MK_SKILL_ADVISOR_DB_DIR` read-only. The labeled routing set in `scripts/labeled-routing-set.mjs` pairs 33 prompts with the correct skill, each gold answer grounded in that skill's own corpus trigger phrases, across exact, paraphrase and hard bands. The harness in `scripts/advisor-rrf-benchmark.mjs` copies the live database into `results/skill-graph.backup.sqlite` as the evidence record and into a tmp dir as the loader scratch copy, points the loader at the tmp dir, loads the projection once and reuses it, then runs the three arms by clearing and setting `SPECKIT_ADVISOR_RRF_FUSION` and `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`. It computes per-arm top-1 correctness, the per-band breakdown and the agreement spread versus baseline, adds a determinism pass and a default-off byte-identity pass over all 33 prompts, and writes `results/metrics.json`, the single source for the data tables and the verdict.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Import the compiled production scorer, do not reimplement it.** The harness calls the same `scoreAdvisorPrompt` and `loadAdvisorProjection` the recommend handler uses and toggles only the real flag readers, so the measured path is the shipped path rather than an eval surrogate.
- **Leave the semantic_shadow lane neutral.** No prompt embedding is injected and no VITEST fixture vector is used, so both arms see an identical, embedder-free live lane set and the comparison isolates the fusion change rather than measuring embedder variance.
- **Ground the gold answers in the corpus, not invent them.** Each prompt's gold skill traces to that skill's own derived trigger phrases, so the benchmark measures routing against the advisor's own declared routing targets.
- **Report the two dormant seams honestly rather than manufacture a result.** The self-guard never fires and the conflict seam has no conflict mass on the live corpus, so they are recorded as untestable-because-dormant rather than claimed as wins or losses, which is what pushes the cluster verdict to REFINE.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- The benchmark imports the compiled production `scoreAdvisorPrompt` and `loadAdvisorProjection` and toggles only `SPECKIT_ADVISOR_RRF_FUSION` and `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`, so the measured path is the production routing path.
- The projection loads from `sqlite` with 27 entries against the read-only backup copy, and the source `skill-graph.sqlite` hash is unchanged after the run.
- `results/metrics.json` reports the per-prompt top-1 for all three arms, the per-band breakdown, the agreement spread, the determinism pass and the byte-identity pass.
- RRF lifts top-1 from 28 of 33 (0.8485) to 29 of 33 (0.8788) with 0.9697 agreement, one prompt moved, every number sourced from metrics.json.
- The off-arm is byte-identical across repeated runs over all 33 prompts and every arm is run-to-run top-1 stable.
- `node scripts/advisor-rrf-benchmark.mjs` reproduces the benchmark from the read-only projection copy, exit 0.
- `validate.sh --strict` on this phase exits clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **One labeled set, one corpus snapshot, and a one-prompt margin.** The top-1 and agreement numbers are measured on 33 prompts against one read-only corpus backup, and the RRF lift is a single corrected prompt. With a deterministic scorer the lift exceeds run-to-run variance, but a one-prompt margin is a thin basis to graduate the cluster, which is why the verdict is REFINE rather than GRADUATE.
- **The self-recommendation guard is unmeasured.** The guard fires only for an advisor self-recommendation on a read-only-explainer prompt, which the labeled set does not contain, so the guard is confirmed safe-and-inert but earns no verdict of its own. A set with deliberate advisor-self prompts is the named follow-up.
- **The conflict-rerank seam is structurally dormant.** The seam demotes by graph conflict mass from `conflicts_with` edges, and the live corpus carries none, so the seam has nothing to demote. It cannot be benchmarked until the corpus carries conflict edges, which matches the conflict-rerank phase's own follow-up.
- **The four shared baseline failures are out of scope for this cluster.** They are corpus and lane-signal routing gaps that neither arm fixes, and resolving them is a routing-quality question for the advisor corpus rather than a fusion question for this flag.
<!-- /ANCHOR:limitations -->
