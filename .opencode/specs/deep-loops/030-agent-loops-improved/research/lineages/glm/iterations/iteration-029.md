# Iteration 029 — NEW: P1-011 Leaf-Only Lineage Drop — Partial Fix, Residual Gap

**Focus:** Does reconstructReviewRegistryFromState fully close the leaf-only-lineage drop (GLM P1-011)?
**Angle:** Verify the fix covers research lineages too, not just review.

## Findings

**fanout-merge.cjs:762 `reconstructReviewRegistryFromState`** was added (with 009/001) to address GLM review P1-011 ("Leaf-only GLM lineage is skipped by registry-only fan-out merge"). It reconstructs a review registry from JSONL `findingDetails` when no registry file exists.

**Residual gap — RESEARCH lineages are NOT covered.** The function is named `reconstructReviewRegistryFromState` and is wired only into the review merge path. There is NO `reconstructResearchRegistryFromState` equivalent. If a leaf-only RESEARCH lineage (one that produced state JSONL with keyFindings in iteration records but no final registry file) reaches merge, it would STILL be silently dropped from the research merge.

**Is this a live risk?** The round-1 glm research lineage DID produce a registry (`deep-research-findings-registry.json`), so it wasn't leaf-only. But the architecture permits leaf-only research lineages (a lineage that crashes before synthesis). For those, the research merge would drop findings — the exact defect class 009/001 fixed for review but left open for research.

**GLM registry note (iter 004):** the registry has a `lineage_local_mitigation` field on P1-011-001 noting "Synthesis reconciled this lineage by writing a registry from JSONL findingDetails; the underlying merge-path issue remains for other leaf-only lineages." This ADMITS the residual gap. So the fix is knowingly incomplete — review-only, research-uncovered.

**Recommendation:** add a parallel `reconstructResearchRegistryFromState` (research registries use `keyFindings` + `openQuestions` instead of `openFindings`) and wire it into `mergeResearchRegistries`. Symmetric to the review fix.

## Evidence
[SOURCE: fanout-merge.cjs:762 — reconstructReviewRegistryFromState (review-only)]
[SOURCE: glm registry:101 — lineage_local_mitigation admits residual gap]

## newInfoRatio: 0.85 (asymmetry: review fixed, research uncovered; explicit admission in registry)
