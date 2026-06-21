# Research Synthesis: Spec-Kit Data Quality by Default

<!-- ANCHOR:research-index -->
This is the canonical synthesis of the spec-kit data-quality deep-research. It converges nineteen by-angle iterations, three delta logs and the Stage 0 external brief into one go or no-go program. The unit of this packet is a verdict, not a build. Every retrieval verdict below stays a hypothesis until a prod-mode measurement runs on this corpus.

## 1. Executive Verdict

The research converged. The single finding that unifies every angle is the truncation law.

The production retrieval path truncates each query to a 3-result floor. The floor is code-confirmed at `confidence-truncation.ts:35` (`DEFAULT_MIN_RESULTS = 3`), it is wrapped in `if (!evaluationMode)` at `hybrid-search.ts:2049`, and 028 already measured its consequence on this exact corpus: completeRecall 0.212 in eval-mode against 0.036 in prod-mode at K8, a 5.9x fidelity gap (`028/before-vs-after.md:159`). The doctrine that follows is that a feature earns a prod keep only by changing the composition of the truncated top-3, never by adding rows the floor cuts (`028/before-vs-after.md:169`).

The law taxes one class of candidate only. It cannot cut what is not a retrieval result, so adherence candidates, logic candidates and write-time candidates serve a different reader and bypass the floor entirely. Retrieval candidates pay the floor tax AND must pay a re-index cost before they can even be measured. This inverts naive ROI. The cheapest real wins are the write-time gates, not the headline retrieval techniques the brief ranks first.

The decisive consequence for this packet is a single sentence. The external brief's numbers are all recall-or-precision at K of 5, 10 or 20 (Anthropic top-20-failure cut, HitRate@10 of 0.925, Context@5 plus 30 points, 82.5 percent precision). The prod floor returns K equal to 3. So every external number lands almost entirely in the K=4-and-above band that production never returns. The external validation is real and irrelevant in the same breath. It cannot promote a retrieval candidate here because it measures a metric the prod reader never sees. Only a prod-mode eval-v2 dual-mode read of completeRecall@3 can promote a retrieval candidate, and that read has not run.

The honest headline from the adversarial audit (N8): of the ten brief candidates, the program has one proven unconditional win, one cheap-and-sound bet whose benefit is unproven, a set of governance and metadata fields that bypass the floor and ship on cost alone, four retrieval or logic candidates that are hypothesis-until-prod-measured, plus a set of no-go items that are already shipped or premature. No amount of external benchmarking changes that tier split until the prod-mode read runs.

## 2. The Go / No-Go Tiering

Reader tags: R retrieval, A adherence, L logic. Timing: on-write or retroactive. Evidence is grounded to a file:line or to the external brief.

### Tier GO (measured, unconditional)

| Recommendation | Reader | Timing | Grounding | Verdict |
|----------------|--------|--------|-----------|---------|
| JSON-schema-validation gate wired into validate.sh: reuse the existing zod `graphMetadataSchema` plus a new `description.json` schema, replacing the legacy_grandfathered-only check | A, L | on-write plus one retroactive sweep | Schemas exist (`graph-metadata-schema.ts:61-71`, `description-schema.ts:51-69`), strict mode checks only `legacy_grandfathered` (`validate.sh:175-183`), surface and blast radius are counted not assumed (N7 re-measure: 11 invalid live-root graph files, 0 legacy_grandfathered packets), zero re-index | GO |

This is the only candidate that is neither hypothesis nor over-engineering. It touches validation not ranking, so it has zero prod-retrieval risk. Its surface is counted, its mechanism is shipped. It is the only measured unconditional GO per the N8 audit and it ships first.

### Tier GO-on-cost (cheap, benefit modest or unproven)

| Recommendation | Reader | Timing | Grounding | Verdict |
|----------------|--------|--------|-----------|---------|
| EARS patterns plus a three-tier always / ask-first / never constraint block in the templates plus a soft EARS linter | A, L | on-write plus a retroactive info linter | Templates ship prose requirement tables with no EARS and no constraint tier (`spec.md.tmpl:96-105`), the adherence ceiling is real (brief: no format guarantees adherence), benefit needs an A/B authoring study | GO-on-cost |
| REQ_COVERAGE cross-artifact gate reusing the already-shipped AC_COVERAGE pattern plus a per-requirement self-verification ledger | A, L | on-write plus a no-op-safe retroactive pass | AC_COVERAGE is a working shipped instance of exactly this rule shape (`check-ac-coverage.sh:167`, `validator-registry.json:51`), the spec-REQ to tasks gap is real (`tasks.md.tmpl:46` carries zero REQ linkage), default-OFF and warn so it never breaks the legacy corpus | GO-on-cost |
| description.json ops and logic fields: embedding-metadata block, content_type, temporal and freshness governance, provenance generating_model plus source_commit | R via content_type, L and governance via the rest | on-write plus a backfill that needs no re-embed | These are Surface-1 fields read by validate.sh and the resume ladder, they bypass truncation by construction (X3), the embedding block is a cheap rollup of live chunk-grain columns (`vector-index-schema.ts:128,171,181,319,591`), passthrough keeps hand-written values durable (`description-schema.ts:69`) | GO-on-cost |
| graph-metadata child-aggregation fix: enrich the existing first-class rollup record, do not add a node type | R, L | on-write plus a retroactive backfill over the phase-parents | The rollup record already exists first-class and embedded at weight 0.75 (`document-helpers.ts:34`), the defect is content not mechanism (the flattener writes bare child IDs at `graph-metadata-parser.ts:1327-1329` and the track-root causal_summary is a stale single-packet artifact), 57 files carry 103 real edges so the edge slots stay, an opt-in warn-only derived_edges sibling avoids polluting the manual bucket | GO-on-cost |
| read-time content_hash integrity verification | R as governance, not ranking | read-time, no re-index | content_hash is stored as a cache and idempotency key only and is never re-checked (`vector-index-schema.ts:771-785`), a read-time recompute catches silent DB or migration corruption inside the existing trust boundary | GO-on-cost |

These bypass the floor or cost almost nothing. They ship on cost and structural soundness, not on a proven retrieval lift. The child-aggregation fix carries the one caution in the whole set, recorded in Section 3.

### Tier CONDITIONAL (build default-off, gated on a re-index plus a prod-mode completeRecall@3 proof)

| Recommendation | Reader | Timing | Grounding | Verdict |
|----------------|--------|--------|-----------|---------|
| Deterministic header-path / global-id prefix on embedded chunks | R | retroactive by necessity, behind a new coverage guard | Highest-ROI retrieval candidate in the brief, but the embed path strips structure before hashing (`content-normalizer.ts:216-232`, `normalizeHeadings` flattens the header), it needs a full re-embed behind a coverage guard that does NOT exist yet (grep for embeddingCoverage and coverageThreshold is empty per N7), and the dual-cache-key gotcha means it no-ops unless the strategy version is folded into BOTH the persistent cache PK (`embedding-cache.ts:157`) and the in-process LRU (`shared/embeddings.ts:309-311`), it can reorder the top-3 only if the prod-mode read confirms it | CONDITIONAL |
| answerable_questions plus semantic_intent tags | R | on-write plus backfill, re-index for retrieval effect | Floor-escape-capable but only if the parser allow-list at `memory-parser.ts:528,595,609` is extended, otherwise the field persists on disk and is silently dropped from the vector (the 028 trap), answerable_questions widens the thin folder pre-filter surface but enriches one candidate, it does not beat the floor | CONDITIONAL |
| Metadata fusion, alpha times text plus one minus alpha times metadata | R | retroactive, after the prefix proves the floor can move | Subsumed by the prefix in its cheaper deterministic form, alpha is un-calibrated on this corpus, the "global-ids carry most signal" claim is a SEC-10K finding not a spec-corpus finding, build only after the prefix shows the floor can move at all | CONDITIONAL |
| LLM-as-judge quality scorer | A and governance, R marginal | on-write async plus a retroactive backfill | Governance-only honest role, the quality_score column already exists (`vector-index-schema.ts:643`) and its plus-or-minus-10 percent fusion multiplier already exists (`stage2-fusion.ts:272-276`), so a real semantic score can nudge the top-3 only at the margin, but the marginal value of LLM semantics over the existing form-only scorers is unproven and costs an LLM pass per doc, prove marginal value first | CONDITIONAL |

Every item here is hypothesis-until-prod-measured. Each ships default-off behind the re-index and eval-v2 dual-mode gate. The unblock condition for each is the same: prod-mode completeRecall@3 must rise, not eval-mode at K.

### Tier NO-GO (already-shipped or premature or over-engineering)

| Recommendation | Reader | Grounding | Verdict |
|----------------|--------|-----------|---------|
| libSQL / DiskANN / sqlite-vec swap | R | RRF plus sqlite-vec already shipped (`rrf-fusion.ts`, `vector-index-queries.ts:164,193`, vendored sqlite-vec), the swap moves nothing measurable and re-pays the whole migration surface for zero delta | NO-GO |
| LightRAG incremental set-merge | L | Freshness-only and premature, full rebuild is cheap at this scale and there is no rollup substrate to keep fresh yet | NO-GO |
| Quantization tiers (F8, F1BIT) | R | Premature on a roughly 2022-row corpus, brute-force scalar scan is already sub-millisecond, this is a 100k-plus-vector lever | NO-GO |
| Ed25519 signing | governance | Wrong threat model for single-author local memory, the DB file is already inside the same trust boundary as the signing key would be, signing buys provenance theatre not a defended boundary | NO-GO |
| Any new rollup node type or new index lane | R, L | The first-class embedded rollup record already exists, a parallel lane duplicates it and risks a self-referential community cycle, enrich the existing record instead | NO-GO |

## 3. Cross-Cutting Findings

**The truncation law.** The 3-result prod floor is the spine of the synthesis. It taxes retrieval candidates only and is blind in the eval harness, which runs with the tail intact. Every retrieval verdict in Section 2 inherits its unblock condition from this law.

**Recall@K is hidden.** The external brief's numbers are all measured at K of 5 or wider. The prod floor is K equal to 3. So the external evidence justifies spending the re-index to find out, and it cannot stand in for the find-out. This is the single most seductive trap in the whole packet, because the external percentages read as proof of a prod win when they are proof of a recall@K win on other corpora.

**Reuse first.** The loop repeatedly found that the lever already exists half-built, so the work is wiring not inventing. The first-class embedded rollup record already exists at weight 0.75. The quality_score column already exists with a live fusion multiplier. The AC_COVERAGE traceability pattern already ships as a working rule. The typed edges are sparse not absent, 57 files carry 103 real entries. The zod schemas already exist and parse at write time. In each case the brief's headline candidate maps to an enrichment of shipped machinery, not a green-field build.

**The one net-negative caution.** Every other rejected or deferred candidate is at worst inert, it wastes effort and changes nothing. The graph-metadata rollup is the single candidate that can go net-negative. A rollup that wins a broad query by displacing a child ALSO displaces a real specific child on a mis-classified narrow query, and the broad-versus-narrow gate is a heuristic not a measurement. So the rollup build is justified only if the narrow-query regression is measured in the SAME pass as the broad-query win. Building it on the broad-query story alone is the riskiest move in the set.

## 4. Staged Rollout

The order is the safety property. No gate reaches error before its backfill has run. Each stage carries a rollback and a re-measured checkpoint.

**Stage 0, baseline capture, read-only.** Record the real starting numbers before any change: 11 invalid graph files on the live root, 0 legacy_grandfathered packets, the frontmatter and continuity gaps from the dry-run report, plus the current embedded-chunk count. Rollback: none, read-only. Checkpoint: the counts are written before any mutation.

**Stage 1, sweep the 11 invalid graph files.** Each of the 11 sits in a research iterations directory and opens with `Packet:` as plain text instead of JSON. Each carries a description.json with no spec.md so it is mis-detected as a Level-1 spec folder. Either regenerate valid JSON or remove the stray files so the folder stops being detected as a packet. Rollback: git revert, the files are tracked. Checkpoint: the JSON.parse scan returns 0 invalid graph files.

**Stage 2, land the JSON-schema rule as warn-only.** Wire the graph and description schema into the orchestrator plus a shell fallback, emit warn not error, leave the dormant legacy_grandfathered bypass in place. Run it corpus-wide as a report. Rollback: revert the rule commit. Checkpoint: the warn report shows 0 shape warnings corpus-wide, proving the corpus is gate-ready.

**Stage 3, flip the JSON-schema rule to error and remove the dormant legacy bypass.** Only after Stage 2 reports clean. The shape rule becomes a hard strict failure and the legacy_grandfathered escape hatch is deleted, since 0 packets use it. Rollback: revert to warn and restore the bypass, both single-commit reversions. Checkpoint: strict still exits 0 corpus-wide, and a deliberately corrupted graph file in a scratch packet now exits 2.

**Stage 4, frontmatter and continuity backfill behind a deferred gate.** Run a dry-run backfill report and apply in batches through the description and continuity refresh paths. Leave the existing frontmatter warn rules untouched until the backfill clears. Do not introduce any new frontmatter or continuity hard rule until the report reads zero. Rollback: the backfill is additive, revert the batch commits. Checkpoint: re-measure both gaps to zero before any frontmatter rule is considered for promotion.

**Stage 5, header-path prefix behind the new coverage guard plus a full re-index.** Introduce an embedding_context_version and a coverage readout that counts chunks embedded under the current version over total chunks. Ship the prefix on-write first, then run a full re-index. Refuse to publish or trust any recall number while coverage is below threshold, because partial coverage mixes prefixed and unprefixed vectors under the 3-result floor and confounds the delta. Rollback: the version field falls back to the prior vectors, the prefix disables at the chunking seam with no data migration. Checkpoint: coverage reaches 100 percent under the new version, then a dual-mode eval read confirms the prod-mode number moves, not just the eval-mode number.

## 5. Prove-First Caveats

This is a research deliverable, not a build. Nothing here is shipped. The tiers separate what is true today from what must be proven.

**Measured or externally-validated-and-mechanically-transferable.** The JSON-schema gate is measured: its surface and blast radius are counted, its schemas exist, its mechanism is validation not ranking. The embedding-metadata block is a validated enabler: it guarantees re-index correctness as a mechanical fact. The reuse-first corrections are confirmed by file:line: the rollup record, the quality_score column, the AC_COVERAGE pattern and the 103 typed edges all already exist or are partly built.

**Hypothesis-until-prod-measured.** Every retrieval candidate is a hypothesis on this corpus. The header-path prefix, metadata fusion, answerable_questions and semantic_intent for retrieval, the rollup broad-query win and the LLM-judge retrieval nudge are all unproven until a full re-index runs and eval-v2 dual-mode shows prod-mode completeRecall@3 rise. The EARS and constraint benefit is a hypothesis until an A/B authoring study runs. The rollup narrow-query safety is unproven and must be measured in the same pass as its broad-query win.

**The restated discipline.** The retrieval candidates remain unproven on this corpus until the prod-mode measurement runs. The external brief's recall@K percentages cannot promote them, because the K=3 floor hides exactly the band those percentages measure. A release reviewer must read the prod-mode column, not the eval-mode column, or they repeat the 028 saturation mistake. The data-quality program has one proven win it can ship now, a set of cheap floor-bypassing fields and gates it can ship on cost, plus a retrieval slate it cannot promote until the measurement it depends on is run.
<!-- /ANCHOR:research-index -->
