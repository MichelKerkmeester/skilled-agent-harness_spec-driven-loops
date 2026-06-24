---
title: "Implementation Summary"
description: "Status COMPLETE. Benchmarked the default-off SPECKIT_RETRIEVAL_CLASS_ROUTING flag on the production search path. The flag suppresses the graph and degree channels for single-hop find-one queries. On a labeled set of ten single-hop and eight multi-hop queries through the production executePipeline against a read-only corpus backup, single-hop precision at one fell from 0.90 off to 0.80 on, a stable -0.10 across three runs, while multi-hop recall at ten held at 0.75 in both states with every multi-hop channel set and top-K byte-identical. The graph and degree channels were pulling the correct packet to rank one on the skill-advisor-daemon query, so suppressing them dropped the answer. The flag lowers precision with no recall benefit, since a multi-hop query is never single-hop so there was no recall cost to avoid. Verdict CUT, no measured win survives the production path, the flag and its SingleHop suppression branch can be deleted. No production default was flipped and no shared code was edited."
trigger_phrases:
  - "retrieval class channel weights summary"
  - "SPECKIT_RETRIEVAL_CLASS_ROUTING cut verdict"
  - "single-hop precision drop channel suppression"
  - "graph degree channel were helping single-hop"
  - "retrieval class routing graduation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/002-retrieval-class-weights"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the prod-path benchmark and authored the CUT verdict"
    next_safe_action: "Phase complete, verdict CUT lives in benchmark-results.md"
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

A prod-path benchmark for the default-off `SPECKIT_RETRIEVAL_CLASS_ROUTING` flag and the verdict it earned. The five-class query classifier runs always-on. This flag gates one behavior, for a narrow single-hop find-one-item query it suppresses the graph and degree channels before the intent and entity-density preservation checks run, on the theory those channels add noise where one exact item is the answer. The benchmark asks one question, does suppressing those channels raise precision at rank one on single-hop queries without costing recall on multi-hop queries, and measures it on the production path against a read-only backup of the live corpus.

The findings:

**The flag was measured on the production path, not the eval path.** Each of eighteen labeled queries ran through the production `executePipeline` under shipped default flags, with only `SPECKIT_RETRIEVAL_CLASS_ROUTING` toggled off then on. The channel decision was read from the production `routeQuery`, the same decision Stage 1 consumes, so the precision delta is grounded in the actual graph and degree suppression rather than asserted. The harness backed up the live database and its active vector shard read-only and ran every search against the copy.

**Single-hop precision fell, it did not rise.** Single-hop precision at one dropped from 0.90 with the flag off to 0.80 with it on, a stable -0.10 across three deterministic runs. The flag suppressed graph and degree on 8 of the 10 single-hop queries and reshuffled the top-K on 7. On 7 of those the rank-1 was already correct from vector and FTS, so removing the graph noise from the tail left precision unchanged. On one query, `sh-skill-advisor-daemon`, the graph and degree connectivity had put the correct packet (id 3843 under the `002-skill-advisor` target) at rank one, and suppressing those channels dropped it for a wrong folder (id 17850 in `027-.../skill-advisor-cli`). The channel the flag suppresses was carrying the answer.

**Multi-hop recall was untouched.** Multi-hop recall at ten held at 0.75 in both states, with every multi-hop channel set and top-K byte-identical flag-off vs flag-on. A multi-hop query is classified MultiHop or Neutral, never SingleHop, so the suppression short-circuit never fires for it. The recall-preservation half of the question is therefore true but moot, there was no recall cost to avoid because the flag never reaches a multi-hop query. The byte-identity across all eight multi-hop rows is the default-off byte-identity evidence on the production path.

**Verdict: CUT.** The flag's hypothesis is falsified on the real corpus. It produced no precision win on any single-hop query and a -0.10 regression overall, while its recall-preservation guarantee protects against a cost that does not exist. The graph and degree channels were net-helpful or net-neutral on single-hop find-one queries here, so suppressing them is dead weight. By the suite verdict gate, no measured win survives the production path, so the honest move is to delete the flag and its SingleHop suppression branch, the same verdict that retired the 16 cut experiments. The graduation flip is a separate decision and is not enacted here, but the recommendation is to cut rather than graduate.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The setup confirmed the flag, the always-on five-class classifier, and the SingleHop suppression short-circuit in `shouldPreserveGraph` against the source, and traced the production path the flag affects, `executePipeline` to Stage 1 to `collectRawCandidates` to `routeQuery`. The core wrote `scripts/retrieval-class-routing-benchmark.mjs`, which backs up the live database and active vector shard read-only to a temporary eval copy, builds a labeled set of ten single-hop find-one queries with target spec folders and eight multi-hop queries with relevant folder sets, and drives `executePipeline` flag-off vs flag-on per query under shipped defaults. It scores single-hop precision at one as a rank-1 target-folder match and multi-hop recall at ten as the labeled relevant folders present in the top-K, records the `routeQuery` channel set per query under each flag state, and writes the per-query rows, the aggregates, and the byte-identity flags to `results/metrics.json`. The verification reproduced the run exit 0, confirmed the deltas were stable across three runs and the multi-hop rows byte-identical, inspected the one flipped single-hop query by hand against its rank-1 folder, and authored the data tables and the verdict grounded strictly in metrics.json.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Measure the prod-path result, not the routing decision alone.** The question is whether suppression raises precision without costing recall, a result-quality question, so the harness drives the full `executePipeline` and scores the returned results, while still reading `routeQuery` to ground the delta in the channel change.
- **Score correctness by target spec folder, not by hand-picked row id.** A single-hop find-one query targets one correct packet, so precision at one is whether the rank-1 result lives in the target folder, matched by startsWith. This is robust to corpus drift in a way a fixed row id is not.
- **Read byte-identity off the multi-hop rows.** A multi-hop query is never single-hop, so its channel set and top-K must be identical flag-off vs flag-on. Their identity across all eight rows is the off-equals-baseline proof on the production path, stronger than asserting it from the code.
- **Recommend CUT, do not refine in place.** The flat suppression as built shows no win to refine toward, and the entity-density preservation a refined variant would defer to already runs when the flag is off, so the honest verdict is to cut rather than to keep the flag for a hypothetical density-aware future.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- The benchmark ran on the production `executePipeline` against a read-only corpus backup, embedder `nomic-embed-text-v1.5`, exit 0.
- `results/metrics.json` reports the per-query rows for ten single-hop and eight multi-hop queries with the channel set, the suppression flags, and the precision and recall under both flag states, plus the aggregate deltas.
- Single-hop precision at one is 0.90 off and 0.80 on, delta -0.10. Multi-hop recall at ten is 0.75 in both states, delta 0.00. Every number is sourced from metrics.json.
- Every multi-hop channel set and top-K is byte-identical flag-off vs flag-on, the default-off byte-identity evidence on the production path.
- The deltas repeated identically across three consecutive runs, confirming a stable signal not run-to-run noise.
- `node scripts/retrieval-class-routing-benchmark.mjs` reproduces the benchmark from the read-only corpus backup, exit 0.
- `validate.sh --strict` on this phase exits clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **One labeled set, one corpus snapshot.** The precision and recall numbers are measured on eighteen labeled queries against one read-only corpus backup. The -0.10 single-hop precision delta rests on one flipped query out of ten, so a larger set or a re-indexed corpus could move the precise number. The direction of the finding is robust though, the flag produced no precision win on any query.
- **Labels are expectations, not external ground truth.** Each target and relevant folder is grounded in the corpus titles and spec folders, not a human-judged gold set. The one query that drives the precision delta was inspected by hand to confirm the rank-1 folder is correct off and wrong on. One single-hop query (`sh-complexity-router-spec`) scores precision 0 in both states, an identical near-miss the flag does not touch, so it does not affect the delta.
- **The two zero-recall multi-hop rows are corpus coverage misses.** `mh-entity-density-graph` and `mh-dark-flag-graduation` score 0 recall in both states because the labeled relevant folders are sparse in the corpus, not because the flag suppressed anything. They are identical off and on so they do not bias the recall delta.
- **The density-aware refinement is not measured.** The verdict notes that an entity-density-aware suppression could recover the lost precision, but it is not built or benchmarked here, since the current flag shows no win to refine toward.
<!-- /ANCHOR:limitations -->
