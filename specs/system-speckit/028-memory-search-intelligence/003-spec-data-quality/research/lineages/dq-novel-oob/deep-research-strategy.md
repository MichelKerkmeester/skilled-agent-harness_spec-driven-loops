# Deep Research Strategy: dq-novel-oob

## Topic

Hunt for NOVEL, ambitious, out-of-the-box data-quality capabilities the prior reuse-first lineages deliberately did NOT propose. Go beyond extending existing machinery. Aim for the BEST POSSIBLE automated and perfected data quality on this corpus. For each candidate: concept, value per reader (R retrieval, A adherence, L logic), feasibility, survival under the truncation law, go/no-go.

## Known Context

Inherited as settled from the parent and sibling lineages (NOT re-derived):

- **The truncation law.** Prod retrieval truncates each query to a 3-result floor (`confidence-truncation.ts:35` `DEFAULT_MIN_RESULTS=3`, wrapped in `if(!evaluationMode)` at `hybrid-search.ts:2049`). 028 measured completeRecall 0.212 eval vs 0.036 prod at K8 (5.9x gap). A feature earns a prod keep only by changing the composition of the truncated top-3, never by adding rows the floor cuts. Retrieval candidates pay the floor tax + a re-index cost. Adherence, logic, and write-time candidates bypass the floor.
- **The ranking consumer seam (verified this lineage).** `stage2-fusion.ts:264-296` `applyValidationSignalScoring` multiplies the composite score by `qualityFactor = 0.9 + qualityScore*0.2` → [0.9, 1.1], PLUS `specLevel`, `completionStatus`, `hasChecklist` bonuses. This runs BEFORE truncation, so a per-doc quality signal written into `validationMetadata.qualityScore` CAN reorder the prod top-3. This is the one live consumer any quality score must reach to be retrieval-relevant.
- **Dropped fields (verified this lineage).** `answerable_questions` / `semantic_intent` have NO live consumer anywhere in mcp_server search (grep empty); they persist on disk and are silently dropped from the vector and from ranking.
- **The decay primitive exists.** `fsrs-scheduler.ts` is the canonical long-term decay (retrievability, stability, nextReviewDate); consumed by composite-scoring temporal.
- **content_hash** is stored as a cache/idempotency key only, never re-checked (`vector-index-schema.ts:771-785`).

What the reuse-first program ALREADY proposed (the exclusion set — do NOT re-list these as novel):

- A1 extend the live quality-loop to authored/JSON surface; A2-A8 enum/schema/propagation/EARS/REQ_COVERAGE/HVR-linter/provenance surfacing; B1 standing scheduled sweep; B2 /doctor auto-remediation tier; B3 retrieval-learning feedback edge (report-only queue, never refines); C1 header-path chunk prefix; C2 prod-mode completeRecall@3 benchmark+regression gate; the DQI scorer; the empty cron tier; per-surface detectors.
- Two hard rails the reuse-first program froze: NO body-mutating auto-fix; NO retrieval promotion without a prod@3 read.

resource-map.md not present; skipping coverage gate.

## Key Questions

- KQ1: A context-budget optimizer that picks the highest-value rows under the truncation floor — does it reach or protect the prod top-3, or is it just a reranker that pays the floor tax?
- KQ2: LLM-as-judge semantic quality scoring wired to the `qualityScore` ranking consumer (not governance-only) and answerable-questions/semantic-intent AUTO-GENERATED and fused — do these beat the form-only scorer and reach the floor?
- KQ3: Retrieval-driven doc AUTO-REWRITING (the aggressive version the reuse-first rail stopped at) — value, safety, and does an improved body reach the floor?
- KQ4: Knowledge-graph enrichment auto-extracted from content + auto-summarization rollup nodes — do they beat the rejected new-node-type verdict?
- KQ5: Cross-doc contradiction + staleness detection, and doc-freshness decay with auto-refresh queueing — feasibility and reader value.
- KQ6: Embedding-drift monitoring with alerting + automatic example/test generation from specs — feasibility and reader value.
- KQ7: Doc-quality leaderboard/dashboard + per-doc quality SLAs — do they change any reader outcome or are they only operator instrumentation?
- KQ8 (adversarial): Which novel candidates actually survive the truncation law and earn a GO distinct from the reuse-first program?

## Next Focus

None. Lineage converged at iteration 8 (newInfoRatio 0.05). Synthesis written to research.md.

## Non-Goals

- Re-listing the reuse-first program (A1-A8, B1-B3, C1-C2, DQI, cron tier, per-surface detectors). Those are the exclusion set.
- Building or shipping anything. This lineage produces verdicts only.
- Re-deriving the truncation law or the ranking-consumer seam; they are inherited settled.
- Touching any path outside this lineage's artifact_dir.

## Stop Conditions

- All 13 candidates carry a concept + value-per-reader + feasibility + floor-survival + go/no-go verdict.
- An adversarial pass has tested each GO against the truncation law and the two hard rails.
- newInfoRatio drops below 0.05, or 15 iterations reached.

## What Worked

- Reading the one live pre-truncation ranking consumer (`stage2-fusion.ts:264-296`) first. It became the discriminator for every candidate: a quality signal is retrieval-relevant only if it reaches that [0.9,1.1] multiplier, and even then within a ±10 percent band.
- Splitting ambiguous candidates into a novel half and a reuse-first half (KQ1 budget optimizer, KQ2 LLM-judge). The novel half is always the floor-bypassing one.
- Grepping for the existence of each capability before judging it. The entity-extractor and FSRS scheduler already ship; contradiction, drift, and test-generation grep empty. This separated half-built from green-field cleanly.

## What Failed

- The most ambitious candidate (auto-rewriting) failed three independent tests (authorship integrity, the proxy trap, irreversibility) and re-derived the no-body-mutate rail adversarially.
- Auto-summarization rollups collapsed into the already-rejected new-node-type with an added LLM infidelity term.
- The leaderboard/dashboard failed to clear the floor-irrelevance bar: it is human instrumentation, redundant with the B1 sweep report.

## Exhausted

- Trying to find a novel idea that beats the truncation floor on recall. None exists; the law is airtight against out-of-the-box framing. Do not retry this angle.
- All-pairs contradiction scanning and embedding-similarity-alone contradiction (both ruled out; use graph-nominated pairs + entailment).
