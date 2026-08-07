---
title: "Benchmark Results: Save-Reconsolidation Merge Precision"
description: "Benchmarks the destructive save-time reconsolidation flag SPECKIT_RECONSOLIDATION_ENABLED against the production determineAction band and mergeContent line-union over a read-only backup of the live 17605-row corpus. On a labeled fixture of 32 content-hash duplicate pairs and 5888 same-folder distinct pairs, merge precision is 0.017 and conflict precision is 0.000. True duplicates sit at cosine 1.000 while the nomic embedder compresses distinct same-folder documents to a p99 of 0.954 and a max of 0.973, so the 0.88 merge band fires on 1816 distinct pairs and the 0.75 conflict band on 2721. The merge line-union never truncates a line, but the real loss is the deprecation of a distinct predecessor row. A separate in-memory harness confirms the checkpoint gate, the default-off byte-identity and the merge and deprecate writes all behave. Verdict CUT, the cosine band cannot separate duplicates from distinct documents on this corpus and the destructive path loses information."
trigger_phrases:
  - "save reconsolidation merge precision results"
  - "SPECKIT_RECONSOLIDATION_ENABLED benchmark"
  - "reconsolidation merge precision cut"
  - "near duplicate merge precision corpus"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Save-Reconsolidation Merge Precision

## Question

`SPECKIT_RECONSOLIDATION_ENABLED` is the opt-in gate that lets the save flow run the destructive `reconsolidate()` path, which merges near-duplicate memories at cosine 0.88 and above and deprecates older rows at cosine 0.75 to 0.88. Does save-time near-duplicate merge cut corpus redundancy without losing distinct information? The destructive path makes a wrong merge irreversible, so the precision question is the whole question.

## Method

- **Flag:** `SPECKIT_RECONSOLIDATION_ENABLED` (default-off). When on, the save flow runs `reconsolidate()` after the per-spec-folder `pre-reconsolidation` checkpoint gate passes. The merge band `MERGE_THRESHOLD` is 0.88 and the conflict (deprecate) band `CONFLICT_THRESHOLD` is 0.75, both read from the production module, never reimplemented.
- **Corpus:** a read-only backup of the live 17605-row database and its active `nomic-embed-text-v1.5` (768-dimension) vector shard. Every read runs against the copy. The live database file is untouched.
- **Labeled fixture:** mined from the real corpus. Known-duplicate pairs are two active rows sharing one content_hash, exact textual duplicates that should merge. Known-distinct pairs are two active rows in one spec folder with a different title and a different content_hash, distinct documents that should not merge. The same-folder scope mirrors the production `findScopeFilteredCandidates` candidate search, so the precision is on the production scope, not an unforced cross-corpus scope.
- **Precision:** every pair is routed through the production `determineAction(cosine)`. Merge precision is the duplicate fraction of the pairs routed to MERGE. Conflict precision is the duplicate fraction of the pairs routed to CONFLICT.
- **Recall preservation:** the production `mergeContent` line-union is run on the pairs, and the surviving-new-line fraction is measured.
- **Gate and writes:** a sibling in-memory harness seeds a throwaway database from the live schema text and drives `reconsolidate()`, `hasReconsolidationCheckpoint()` and the merge and deprecate writers to verify the checkpoint gate, the default-off byte-identity and the destructive writes.

## Results: the band cannot separate duplicates from distinct documents

The cosine distributions of the two labeled classes overlap almost entirely above the thresholds.

| Class | n | cosine distribution |
|-------|---|---------------------|
| duplicate (same content_hash) | 32 | min 1.000, median 1.000, max 1.000 |
| distinct (diff title and hash, same folder) | 5888 | p50 0.842, p90 0.921, p95 0.932, p99 0.954, max 0.973 |

The distinct-document distribution sits squarely on top of and above the 0.88 merge band. The merge band fires on 1816 of the 5888 distinct pairs and the conflict band on 2721 of them.

| Band | rule | true positives (dup) | false positives (distinct) | precision |
|------|------|----------------------|-----------------------------|-----------|
| MERGE | cosine >= 0.88 | 32 | 1816 | **0.0173** |
| CONFLICT (deprecate) | 0.75 <= cosine < 0.88 | 0 | 2721 | **0.000** |

Merge precision is 0.0173. For every genuine duplicate the band merges, it merges about fifty-six distinct documents. Conflict precision is 0.000 because the 32 true duplicates all sit at cosine 1.000, so none land in the 0.75 to 0.88 conflict band, while 2721 distinct pairs do, and every one would deprecate a distinct row. Duplicate merge recall is 1.000, the band does catch every true duplicate, but it catches them buried in a flood of distinct documents.

### The merge false positives are distinct documents, not near-duplicates

The highest-confidence merge false positives are different spec documents for the same packet.

| cosine | titleA | titleB |
|--------|--------|--------|
| 0.973 | Implementation Plan: 101/003 Deep AI Council Graph Support | Feature Specification: 101/003 Deep AI Council Graph Support |
| 0.973 | Feature Specification: 101/003 Deep AI Council Graph Support | Implementation Plan: 101/003 Deep AI Council Graph Support |

An implementation plan and a feature specification for the same packet are distinct documents with distinct content serving distinct purposes. At cosine 0.973 the merge band would collapse them into one row and deprecate the other. That is exactly the distinct-information loss the destructive path was supposed to avoid.

## Recall preservation: the line-union does not truncate, but that is not the loss

The production `mergeContent` is a line-union, every non-empty incoming line either already exists in the predecessor or is appended. Measured over the fixture, line preservation is 1.000 for both the duplicate and the distinct pairs, no line is dropped.

That number is a trap, not a reassurance. The information loss from a wrong merge is not line truncation. It is the **deprecation of the predecessor row** and the **collapse of two distinct documents into one record**. The gate-and-writes harness confirms the destructive effect directly: at a merge the predecessor is retired through a `supersedes` edge, and at a conflict the existing distinct row is marked `deprecated`. A reader who later searches for the deprecated document gets the merged row instead, and the distinct document is gone from the active projection. Line preservation of 1.000 does not make a wrong merge safe.

## Separation: no useful threshold exists on this corpus

The threshold that would exclude every distinct pair sits above the distinct-pair max of 0.973. At that threshold duplicate recall is still 1.000, since true duplicates sit at 1.000. So the only safe cosine threshold on this corpus is one so close to 1.000 that it is indistinguishable from an exact-match rule. The embedder simply does not leave a usable margin between a true duplicate and a distinct same-folder document. The 0.88 merge band sits deep inside the distinct-document distribution, between its p50 and its p90.

## Gate and destructive-write verification: the safety machinery works

The path's safety machinery is sound, the problem is the band it gates. The in-memory harness reports all twelve checks passing.

| Check | Result |
|-------|--------|
| GATE-OFF reconsolidate returns null when `SPECKIT_RECONSOLIDATION=false` | pass |
| CHECKPOINT absent then gate false | pass |
| CHECKPOINT present for folder then gate true | pass |
| CHECKPOINT folder-scoped row does not satisfy a different folder | pass |
| MERGE-WRITE routes to merge at cosine >= 0.88 | pass |
| MERGE-WRITE creates a supersedes edge (predecessor retired) | pass |
| MERGE-WRITE merged row keeps the old line and gains the new line | pass |
| DEPRECATE-WRITE routes to conflict in the 0.75 to 0.88 band | pass |
| DEPRECATE-WRITE marks the existing distinct row deprecated | pass |
| DEPRECATE-WRITE creates a supersedes edge | pass |
| COMPLEMENT routes to complement below 0.75 | pass |
| COMPLEMENT leaves the existing row active (no destructive write) | pass |

The checkpoint gate is correct, the default-off byte-identity holds, and the merge and deprecate writes do exactly what they claim. The destructive path is well built. It is also pointed at a similarity band that cannot tell duplicates from distinct documents.

## Verdict: CUT

The honest call is CUT. The destructive cosine-band merge path loses distinct information on the production corpus and no threshold rescues it.

- **Merge precision is 0.017, the destructive path is wrong fifty-six times for every time it is right.** On the production same-folder scope the 0.88 band merges 1816 distinct documents for 32 true duplicates. This is the opposite of the conservative bar a destructive path requires.
- **Recall preservation is a red herring.** The line-union preserves 1.000 of the lines, but the loss is the deprecation of a distinct predecessor and the collapse of two documents into one, which the writes confirm directly.
- **No threshold rescues it.** Zero distinct false-positive requires a threshold above 0.973, which is an exact-match rule in disguise. The nomic embedder leaves no usable margin between a true duplicate and a distinct same-folder document.
- **The machinery is not the problem.** The checkpoint gate, the byte-identity and the writes all pass. Cutting the path is a verdict on the cosine band, not on the engineering.

Recommendation: CUT `SPECKIT_RECONSOLIDATION_ENABLED` and the cosine-band destructive merge it gates. The 32 true duplicates this benchmark found are exactly the content_hash matches, which a deterministic exact-duplicate merge would catch with perfect precision and zero distinct-document risk. That content-hash path, plus the already-graduated assistive shadow path that surfaces high-similarity pairs as advisory recommendations without any destructive write, together deliver the redundancy-flagging value the cut path was meant to provide, without the irreversible merge of distinct documents.

## Reproduce

`node scripts/recon-precision-benchmark.mjs` rebuilds `results/precision-metrics.json` from a read-only corpus backup, exit 0. `node scripts/recon-gate-and-writes.mjs` rebuilds `results/gate-metrics.json` from an in-memory database, exit 0.
