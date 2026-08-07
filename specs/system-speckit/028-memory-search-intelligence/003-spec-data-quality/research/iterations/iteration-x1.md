# Iteration X1 - Cross-Cutting Feasibility Ranking (opus, prove-first)

## TITLE

Cohort X1 cross-cutting feasibility ranking. Model opus. Angle reorders the whole brief around the prod-path truncation law and ranks all ten candidates by prod impact times real-corpus feasibility.

## FINDINGS

The 3-result floor is code-confirmed not folklore. `confidence-truncation.ts:30-35` sets `DEFAULT_MIN_RESULTS = 3` with a gap-heuristic that cuts the tail above index >= minResults-1. The 028 record names the consequence directly at `028/before-vs-after.md:161` and measures the eval-vs-prod fidelity gap as completeRecall 0.212 eval-mode vs 0.036 prod-mode at K8 (`before-vs-after.md:159`). The doctrine at `:169` is that a feature earns a prod-path keep only by changing the composition of the truncated top-3 never by adding rows the floor cuts.

The cross-cutting insight that reorders the brief is that the truncation law is a tax on retrieval candidates only. It cannot cut what is not a retrieval result so adherence and logic candidates serve a different reader and bypass the floor entirely. This inverts naive ROI. The cheapest real wins are the adherence, logic and write-time candidates plus the narrow class of retrieval changes that re-order the top-3.

Measured corpus facts that ground feasibility:
- Embed text strips structure. `content-normalizer.ts:162-206` drops frontmatter, anchor markers, pipe-tables and heading hashes so bare prose is embedded. Header-path breadcrumb is not currently in the vector so candidate 1 is net-new not partly-shipped.
- Embedding is content-hash keyed (`chunking-orchestrator.ts:16,283-284`) so any change to embedded text forces a full re-index behind the gate-zero coverage guard.
- The JSON schema already exists but is unwired to the completion gate. `graph-metadata-schema.ts` is a real zod schema parsed at write time (`generate-context.ts:561-562`), but `validate.sh:177-180` only checks `legacy_grandfathered` and `:286` is a frontmatter pattern match. No strict schema gate exists so candidate 4 is the smallest real gap.
- Typed-edge slots exist but are 100 percent empty. Measured 2022 `graph-metadata.json` files with 0 carrying any non-empty `manual.depends_on/supersedes/related_to`. Candidates 6 and 7 have schema slots but no substrate.
- 028 already built-and-deleted the graph, edge and temporal retrieval lanes as eval-mirages (`before-vs-after.md:137,161`). The reranker is the one recall lever the truncation law permits but it scores 0.000 on real data (data-blocked not algorithm-blocked).

Feasibility ranking by prod impact times real-corpus feasibility:
- Rank 1 candidate 4 JSON-schema to validate.sh. Adherence plus logic. Bypasses floor. Schema exists just unwired. Quick win.
- Rank 2 candidate 3 EARS plus 3-tier constraints. Adherence. Bypasses floor. Pure template. Quick win.
- Rank 3 candidate 1 deterministic half (header-path plus global-id prefix). Retrieval. Moves top-3 composition. Gated on re-index. Quick win gated.
- Rank 4 candidate 8 embedding-metadata block plus drift re-embed. Retrieval. Freshness guarantor that enables re-index. Solid.
- Rank 5 candidate 10 freshness framing. Logic. Bypasses floor as governance. Solid.
- Rank 6 candidate 2 metadata-fusion vector. Retrieval. Moves top-3 but alpha un-calibrated. Conditional.
- Rank 7 candidate 5 LLM-as-judge quality score. Adherence. Floor-mirage unless a consumer reorders top-3. Conditional.
- Rank 8 candidate 6 GraphRAG community plus typed edges. Retrieval half proven-mirage (deleted), 0/2022 edges. Mirage.
- Rank 9 candidate 9 libSQL DiskANN sqlite-vec RRF. RRF plus sqlite-vec already shipped, swap moves nothing. Mirage.
- Rank 10 candidate 7 LightRAG incremental graph updates. No substrate, graph empty. Mirage.

## CONCRETE CHANGE

Ship the quick-win bundle in order:
1. Wire the existing `graphMetadataSchema` plus a description.json schema plus a frontmatter schema into `validate.sh --strict` as a hard rule, replacing the `legacy_grandfathered`-only check at `validate.sh:177-180`. On-write plus a one-time retroactive corpus sweep.
2. Add an EARS plus three-tier (always / ask-first / never) constraint block to the spec.md template, formalizing the requirements table that already exists.
3. Prepend a deterministic breadcrumb `{packet_id} > {anchor-id} > {header path}` to each chunk's embedded text at the chunking-orchestrator by content-normalizer seam (the normalizer comment at `:257-261` already anticipates this divergence). Ship behind the existing re-index coverage gate. No LLM blurb in v1.

## EVIDENCE

- Floor: `confidence-truncation.ts:30-35`, `028/before-vs-after.md:159,161,169`, `009-reranker-research/spec.md` (0.000 real-data).
- Candidate 1 net-new plus re-index cost: `content-normalizer.ts:162-206,257-261`, `chunking-orchestrator.ts:16,283-284`. Brief section 1 (35 to 49 percent top-20 failure cut, 82.5 vs 73.3 precision, +30pp Context@5).
- Candidate 4 gap: `graph-metadata-schema.ts`, `generate-context.ts:561-562`, `validate.sh:177-180,286`. Brief section 6 (remark-lint-frontmatter-schema).
- Candidate 3: brief section 2 (EARS five patterns at https://alistairmavin.com/ears/, Osmani 6-section plus 3-tier, Kiro GIVEN/WHEN/THEN). spec.md REQUIREMENTS table at `003-retrieval-class-routing/spec.md:153-169` is already EARS-adjacent.
- Mirages: measured 0/2022 typed edges, `028/graph-metadata.json:19-23`, `before-vs-after.md:137,161`. RRF plus sqlite-vec shipped at `shared/algorithms/rrf-fusion.ts`, `sqlite-fts.ts`, `node_modules/sqlite-vec`.

## READER

Adherence (bypasses floor): candidates 4, 3, 5 governance. Logic (bypasses floor): candidates 4, 10 freshness, 6 logic-half. Retrieval (must move top-3 and pays the re-index tax): candidates 1, 2, 8.

## ON-WRITE OR RETROACTIVE

Candidate 4 on-write gate plus one cheap retroactive sweep since validate.sh is corpus-runnable. Candidate 3 on-write for new packets, retroactive optional and gradual. Candidates 1, 2, 8 retroactive by necessity since they only take effect after a full re-index behind the coverage guard.

## RISK

Candidate 1 prod win is a hypothesis until the re-index runs and eval-v2 dual-mode read confirms the prod-mode number moves, since the brief external benchmarks measure recall@K which is the exact metric the floor hides. Candidate 3 hits the adherence ceiling (Fowler and Bockeler note no format guarantees adherence, pair with self-verification). Candidate 4 is the only change with essentially zero prod-path risk because it is validation not ranking, which is precisely why it ranks first under the truncation law.
