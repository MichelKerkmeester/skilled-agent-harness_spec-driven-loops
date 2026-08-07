---
title: "Benchmark Results: Retrieval-Class Channel Weights"
description: "Measures the default-off SPECKIT_RETRIEVAL_CLASS_ROUTING flag on the production search path. The flag suppresses the graph and degree channels for single-hop find-one queries. On a labeled set of ten single-hop and eight multi-hop queries through the production executePipeline against a read-only corpus backup, single-hop precision at one falls from 0.90 off to 0.80 on, a 0.10 drop, while multi-hop recall at ten holds at 0.75 in both states with every multi-hop channel set and top-K byte-identical. The graph and degree channels were pulling the correct packet to rank one on one single-hop query, so suppressing them dropped the correct packet. The flag lowers precision with no recall benefit. Verdict CUT."
trigger_phrases:
  - "retrieval class channel weights benchmark"
  - "SPECKIT_RETRIEVAL_CLASS_ROUTING results"
  - "single-hop precision drop channel suppression"
  - "retrieval class routing cut verdict"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Retrieval-Class Channel Weights

## Question
`SPECKIT_RETRIEVAL_CLASS_ROUTING` is built and default-off. The five-class query classifier runs always-on. This flag gates one behavior. For a narrow single-hop find-one-item query it suppresses the graph and degree channels before the intent and entity-density preservation checks run, on the theory those channels add noise where one exact item is the answer. Does suppressing the graph and degree channels for single-hop queries raise precision at rank one without costing recall on multi-hop queries?

## Method
- **Flag:** `SPECKIT_RETRIEVAL_CLASS_ROUTING` (default-off). When on, a SingleHop query short-circuits graph preservation in `shouldPreserveGraph` and drops the graph and degree channels. The classifier itself runs always-on, only the suppression is gated.
- **Path:** each query runs through the production `executePipeline` under shipped default flags, with only `SPECKIT_RETRIEVAL_CLASS_ROUTING` toggled off then on. The channel set per query is read from the production `routeQuery`, the decision Stage 1 consumes.
- **Corpus:** a read-only backup of the live database and its active vector shard, embedder `nomic-embed-text-v1.5`. No write, no reindex.
- **Labeled set:** ten single-hop find-one queries each with a target spec folder, eight multi-hop queries each with a relevant folder set. Labels are expectations grounded in the corpus titles and spec folders, matched by folder startsWith.
- **Metrics:** single-hop precision at one is whether the rank-1 result spec folder matches the labeled target. Multi-hop recall at ten is the fraction of labeled relevant folders present in the top-K.
- **Stability:** the deltas repeated identically across three runs. The search path is deterministic for a fixed corpus.

## Results: precision drops, recall unchanged

| Metric | flag OFF | flag ON | delta |
|--------|----------|---------|-------|
| single-hop precision@1 | 0.90 | **0.80** | **-0.10** |
| multi-hop recall@10 | 0.75 | 0.75 | 0.00 |
| multi-hop channel sets identical OFF vs ON | yes | yes | n/a |
| multi-hop top-K identical OFF vs ON | yes | yes | n/a |

The flag suppressed graph and degree on 8 of the 10 single-hop queries and reshuffled the top-K on 7 of them. On 7 of those the rank-1 result was already correct from the vector and FTS channels, so removing the graph noise from the tail left precision unchanged. On one query it dropped the correct packet from rank one. Across the eight multi-hop queries the flag changed nothing, because a multi-hop query is never classified SingleHop so the suppression never fires.

### Single-hop per-query (precision@1, target-folder match on rank 1)
| query | class | graph+degree suppressed | precision OFF | precision ON | rank-1 changed |
|-------|-------|--------------------------|---------------|--------------|----------------|
| sh-evidence-gap-detector | SingleHop | yes | 1 | 1 | no |
| sh-retrieval-class-routing | Entity | no | 1 | 1 | no |
| sh-hybrid-search-bm25 | SingleHop | yes | 1 | 1 | no |
| sh-skill-advisor-daemon | SingleHop | yes | **1** | **0** | **yes** |
| sh-gap-threshold-calibration | SingleHop | yes | 1 | 1 | no |
| sh-relevance-aware-gap | SingleHop | yes | 1 | 1 | no |
| sh-conflict-rerank-routing | SingleHop | yes | 1 | 1 | no |
| sh-retrieval-class-tasks | Entity | no | 1 | 1 | no |
| sh-evidence-gap-checklist | SingleHop | yes | 1 | 1 | no |
| sh-complexity-router-spec | SingleHop | yes | 0 | 0 | no |

The `sh-skill-advisor-daemon` row is the only precision flip and it is a regression. With the flag off the graph and degree channels pulled id 3843 under the target `002-skill-advisor` folder to rank one, a correct find-one result. With the flag on those channels are suppressed and rank one becomes id 17850 in `027-.../skill-advisor-cli`, a wrong folder. The graph and degree connectivity was the signal that put the right packet on top, so suppressing it lost the answer.

The `sh-complexity-router-spec` row scores precision 0 in both states, an identical miss the flag does not touch. Its rank-1 result is a doctor-router doc rather than the labeled retrieval-class folder, so the label is a near-miss, but it is the same near-miss off and on so it does not move the delta.

### Multi-hop per-query (recall@10, relevant folders present in top-K)
| query | class | recall OFF | recall ON | channels identical | top-K identical |
|-------|-------|------------|-----------|--------------------|-----------------|
| mh-gap-overcap-cause | MultiHop | 1.00 | 1.00 | yes | yes |
| mh-class-router-suppress | MultiHop | 1.00 | 1.00 | yes | yes |
| mh-router-hybrid-dependency | MultiHop | 1.00 | 1.00 | yes | yes |
| mh-zscore-vs-relevance | MultiHop | 1.00 | 1.00 | yes | yes |
| mh-degree-channel-impact | MultiHop | 1.00 | 1.00 | yes | yes |
| mh-entity-density-graph | MultiHop | 0.00 | 0.00 | yes | yes |
| mh-complexity-skip-graph | MultiHop | 1.00 | 1.00 | yes | yes |
| mh-dark-flag-graduation | MultiHop | 0.00 | 0.00 | yes | yes |

Every multi-hop row is byte-identical flag-off vs flag-on, on the channel set and on the top-K. The two zero-recall rows are corpus coverage misses, identical in both states, not a flag effect. The flag cannot regress multi-hop recall because it never touches a multi-hop query, which the byte-identity confirms on the production path rather than by assertion.

## Default-off byte-identity
With the flag off the result equals the pre-flag baseline. The eight multi-hop rows prove this on the production path, every channel set and top-K identical flag-off vs flag-on. On the single-hop side the two Entity-class queries and the queries where graph was never preserved are identical in both states as well, since the suppression is a no-op there. The flag changes a result only on a single-hop query where graph and degree were otherwise preserved, and on those the change is the suppression under test.

## Verdict: CUT
The flag's hypothesis is that suppressing the graph and degree channels for single-hop queries raises precision. The real corpus on the production path falsifies it.

- **No precision win.** Single-hop precision at one falls from 0.90 to 0.80, a stable -0.10 across three runs. The flag did not raise precision on a single query, it lowered it on one.
- **No recall at risk to protect.** Multi-hop recall holds at 0.75 with every channel set and top-K byte-identical, because a multi-hop query is never single-hop so the flag never touches it. The recall-preservation half of the question is true but moot, there was no recall cost to avoid.
- **The graph and degree channels were helping.** On `sh-skill-advisor-daemon` the graph and degree connectivity put the correct packet at rank one, and suppressing it lost the answer. On the other seven suppressed single-hop queries the rank-1 was already correct without graph, so the suppression was at best a no-op and at worst a regression.

No measured win survives the production path. By the suite verdict gate the honest move is CUT, the same verdict that retired the 16 cut experiments. The flag and its SingleHop suppression branch can be deleted.

## Refinement considered and not pursued
The single regression came from a flat, unconditional suppression. An entity-density-aware variant would keep graph and degree when the single-hop query hits high-degree memory rows, which is exactly the case that helped `sh-skill-advisor-daemon`. That would plausibly recover the lost precision while still trimming noise on sparse single-hop queries. It is not pursued here because the flat suppression as built shows no win to refine toward, and the entity-density preservation it would defer to already runs when the flag is off. A future phase could measure the density-aware variant if the precision ceiling is worth chasing, but the current flag is not the path to it.

## Reproduce
`node scripts/retrieval-class-routing-benchmark.mjs` rebuilds `results/metrics.json` from the read-only corpus backup, exit 0.
