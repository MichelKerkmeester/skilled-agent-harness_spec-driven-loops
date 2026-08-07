# Memory Search Intelligence Deep Dive — Verified Findings Ledger
(working notes; MY live verification status marked)

## LIVE-CONFIRMED BY ME (production DB + CLI probes, 2026-07-03)

### L1. Corpus identity split + duplicate rows (SEVERE, data quality)
- 12,306 rows under stale track prefix `system-spec-kit/`, 5,658 under current `system-speckit/`; 7,012 cross-prefix content dupes; 12,280 dup-hash parents overall.
- 12,352 rows cite dead file paths (old track dir removed). Live effect: "packet 028 status" query top-4 = SAME spec.md 4× (1 current + 3 stale snapshots, ids 38677/23682/25080/27018); freshness query 3/5 slots one doc.
- Dedup key at result time = row id (hybrid-search.ts:949 canonicalResultId), no file-identity collapse → dupes not collapsed.
- near_duplicate_of column: NEVER populated (0 rows).
- memory_stats.byStatus silently excludes tier='deprecated' (sums 25,762 vs 33,131) while memory_health counts raw — two surfaces disagree.

### L2. Orphan sweep can never catch up (P1, verified in code by me)
- handlers/memory-index.ts:684 calls sweepOrphanIndexRows({limit:200}) with NO cursor; incremental-index.ts:443-495 defaults cursor=0, returns nextCursor which is echoed but never persisted. Only ~200 lowest-id rows ever checked → 12,352 dead rows persist. Health "orphanFiles:25" is a 200-row sample.

### L3. Embedding coverage catastrophe (data quality)
- success 18,833/33,101 (57%); pending 8,761, failed 4,247, retry 1,260. 43% of corpus invisible to vector search (FTS-only).
- 367 rows status=success but vector MISSING (health consistency check) — dual-write desync residue; memory_embedding_reconcile NEVER run (maintenance.lastRunAt null).
- embedding_model attribution: 27,706 rows empty; two spellings of same model ('nomic-ai/nomic-embed-text-v1.5' 1,405 vs 'nomic-embed-text-v1.5' 3,990).
- Drain rate: retry-manager default 5 rows/5min (agent F) → backlog of 8.7k pending = days-weeks.

### L4. Trigger phrase data junk (data quality)
- 45% of 165,979 phrase occurrences are single words. Top "phrases": feature(2,072), specification(2,034), system-spec-kit(1,922), implementation(1,697), template(1,423)... even z_archive(848).
- Old rows store title-word-soup ["memory","alignment","fix","three","layer"...]; new rows fine.
- Live: match_triggers returns z_archive docs on single-word matches ("deep","memory","028"), weight 0.8. Gate-1 injection polluted.
- memory_match_triggers warm latency 2.3s (cold 17s) — hot path per user message; agent E: cache rebuild re-reads ALL spec docs from disk every 60s TTL.

### L5. Archive/tier pollution
- 11,086 z_archive rows (33% of corpus) rank alongside active: 272 critical, 4,278 important. is_archived=0 for ALL rows. includeArchived schema param hardcoded false but archive rows aren't marked archived anyway → both sides of archive filtering broken.
- Constitutional tier: 70 rows, only 20 distinct titles (3.5x dup); 1 sandbox row from /tmp/speckit-manual-playbook-sandbox (id 38797 'edit') AUTO-INJECTED into every session priming.
- tier='deprecated' 7,340 rows still rank at 0.85 in top-5 (observed live).

### L6. Daemon/ops (live)
- context-server crash-looping SIGBUS (launcher log 05:52-06:07) — self-healed later; MCP surface down entire session.
- Dist-freshness deadlock: entry spec-memory-cli compares mtime vs dist/spec-memory-cli.js; tsc --build skips re-emit of unchanged files; hash-cache only written AFTER mtime check passes → permanent false-stale, `npm run build` (exit 0) does NOT clear it. Live-reproduced. Bypass: SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1. Exit 75 misclassified "retryable" (agent I) → hooks drop continuity silently every session; --help/--version also blocked.
- Search latency: ~2-2.9s per search (stage1 0.5-1.5s, stage2 ~1.2s constant even for 15-19 candidates); first search +3.9s autoSurface.
- Index grew +30 rows during read-only probing (background watcher indexing recent file changes — benign but note activeScanJob:false).

### L7. Envelope/presentation bloat (live)
- 17.6KB payload for 5 results. EVERY telemetry block double-emitted camelCase AND snake_case (artifactRouting/artifact_routing, graphContribution/graph_contribution, searchDecisionEnvelope/search_decision_envelope, appliedBoosts/applied_boosts).
- meta.tokenCount 6,455 vs enforced tokenBudget 3,500; results compacted (compact:true, empty snippets) while metadata survives.
- progressiveDisclosure.results: empty snippets, detailAvailable:false — useless layer emitted.
- trustBadges.orphan:true on the TOP fresh result (wrong). confidence.value 0.164 'medium' on 0.908-score top hit (calibrated P — confusing).
- causalBoostApplied:"applied" but causalBoosted:0 (T-0211 class, known-open).

### L8. Causal graph pollution (data quality, NEW vs known T-0211)
- 33,101 edges; 31,118 (94%) are 'supports' strength=0.7 auto-created by entity_linker (entity-linker.ts:865 INSERT ... 'supports', 0.7, 'entity_linker'). Real causal edges: ~1,983. Any causal boost would amplify noise. memory_entities 561,785 rows, entity_catalog 61,638.

### L9. Chunking dormant + oversized single-vector docs
- chunks=0, partial=0, no chunking history events. indexChunkedMemoryFile called ONLY from memory-save.ts:2511, never from scan path → 39 docs >50KB (up to 193KB) embedded as ONE vector (embedder context truncation → tail invisible to vector search). MPAB collapse machinery inert on dominant corpus.
- Agent F P0 (safe-swap deletes updated chunk rows) = real mechanism (I verified get_by_folder_and_path dedup has no parent filter, store:1857-1873; finalize deletes oldChildIds captured post-staging, chunking-orchestrator.ts:488-553) but DORMANT (fires when a chunked saved memory is re-saved).

## AGENT-REPORTED (spot-verified where noted)
### Agent E (tool surface) key items
- P1 memory-triggers.ts:449,269 specFolder EXACT match vs prefix everywhere else → phase-child recall loss in match_triggers.
- P1 progressive-disclosure cursor loses scopeKey after page1 + client-forgeable (tenant leak).
- P1 formatter drops canonicalSource/documentType fields handler stamps (test passes via formatter mock).
- P2 session dedup marks results 'sent' BEFORE budget truncation → never-shown memories suppressed all session.
- P2 memory-context budget enforced before graphContext/envelope attach (explains L7 budget breach) + dead sanity guard (608-625 unreachable).
- P2 world-summary prelude: bare LIMIT no ORDER BY → only oldest ~75 summaries considered.
- P2 result-explainability: every ranked row labeled semantic_match.
- P2 trigger backfill re-pends failed phrases forever (no cap).
- P2 includeContent unbounded (multi-MB envelopes possible).
- memory_context resume hardcodes fingerprintStatus:'verified'.
- Constitutional memories structurally invisible to match_triggers cache.
- intent promoted explicit at confidence 1.0 via memory_context→memory_search bypassing floor.

### Agent F (indexing) key items
- P0 chunking safe-swap self-delete (dormant, verified mechanism).
- P1 retry-manager drain writes only vec_memories not vec_<dim> (same class as 031 T-0175; rows success but invisible to active vector surface) — retry-manager.ts:747-765.
- P1 orphan sweep cursor never advances (L2 — verified by me).
- P1 move-reconcile doesn't repoint active_memory_projection → path-reuse steals projection, row permanently unsearchable.
- P2 scan coalescing scope-blind (scoped scan B reports success without scanning).
- P2 cancelled scan arms 30s cooldown as if completed.
- P2 lease heartbeat can resurrect released lease (phantom 60s block).
- P2 retry drain embeds different text than sync path + poisons shared embedding cache under same key.
- P2 retry-status rows at max retries invisible to scan reindex AND retry queue (24h dead-end).
- P2 stale-delete counts cascaded children as failures (noise).
- P2 content-router Tier-1 drops chunks containing 'tool:'/'user:' anywhere.
- OPT P1: keyword_search SELECT m.* whole table no LIMIT into JS (fallback path).
- OPT P1: listStaleIndexedPaths full-table + ~2 statSync/row per scan on event loop.
- OPT: interference recompute O(folder²) inside every insert/update tx.
- vec 'auto' embedder: shard-repair sentinel never clears (counts vec_<dim> while writes go to vec_memories).
- normalizeSpecFolderScope rejects legacy 'specs/'-prefixed scope silently.

### Agent I (commands/presentation) key items
- P1 envelope-fidelity flag documented default-OFF, actually default-ON (search.md:78 vs search-flags.ts:702).
- P1 exit-75 taxonomy: stale dist not retryable; --help/--version blocked by gate; recovery text inconsistent; hooks fail_open silently (continuity dropped each session start with stale dist — LIVE now).
- README.txt drift cluster: --intent:type colon form never parsed; validate <useful|not> vs <true|false>; tool-coverage matrix points at tools not in allowed-tools; assets/ folder claimed absent but required.
- manage_presentation stats field names don't match handler (totalRecords vs totalMemories etc).
- --format text = summary line only, all rows dropped silently.
- 'why' computed (default-ON) but no render slot — tokens spent, zero user value.
- memory_context nests search envelope JSON-in-string (double encoding).
- schema v37 vs v41 doc drift; 4-state vs 5-state model drift; hooks README documents nonexistent opencode/ folder.
- Dual command trees (.opencode/commands + .claude/commands) byte-identical, no sync check.
- Startup truncation cuts mid-section; constitutional ~2k tokens rides every call in fallback chains.

### Agent A (prior work) — dedup against these
- Known-open: T-0211 causal boost never applies; T-0212 community fallback never surfaces; REQ-214 context headers; Group A shared root cause (flag read at process start vs per-request). 028/006/002 pending (derived_id split, semantic-edge embed inside BEGIN IMMEDIATE, retention stale snapshot). 028/006/004 91 P2s pending. T-0444 advisor gold labels stale. T-0372 session_resume strict-mode. Phase-2 appendix ~22 open.
- Truncation law: prod render floor K=3 taxes retrieval candidates.
- Dark flags: multihop graduate-ready(deep-K), retrieval-class routing CUT, reconsolidation cosine-band CUT (→content-hash), true-citation REFINE (data-gated), advisor RRF graduate.
- Deliberately not built: reranker (conditional-go, ledger density prereq), calibration re-fit (proven non-fix; banding reads pre-calibration at confidence-scoring.ts:400).

### Agent C (scoring/cognitive) key items
- P1 stage2-fusion.ts:1311 non-hybrid path: step-4 intent weighting RECOMPUTES score from raw similarity, wiping recency/co-activation/community/graph boosts (computed, telemetry-recorded, discarded). intentWeights always non-null (fallback 'understand').
- P1 composite-scoring.ts + interference-scoring: ZERO production callers (only importer attention-decay.ts, itself dead). Interference O(folder²) Jaccard on write path feeds column nothing reads. Doc-type multipliers never influence ranking. memory-search.ts:711 hardcodes interferenceApplied:false.
- P1 working-memory.ts:601-616 event decay re-applied fully each prompt (counter +1 not =current) + mention boost re-added each pass → attention degenerates binary (pinned 1.0 or deleted in ~8 prompts).
- P1 causal-boost.ts:520-569 typed traversal (default ON): avgSeedScore×prior×decay ≈0.35-0.70 all above 0.20 cap → flat max boost for every neighbor, relation priors/hop decay inert. Classic path was 0.025-0.10 graduated.
- P2 rrf min-max pins top=1.0; later boosts clamp at 1.0 → boosts structurally inert at top ranks; all-equal fusion → all 1.0.
- P2 causal/graph injection has NO tier/parent filter → deprecated + chunk rows re-enter via graph (deprecated exclusion bypassed).
- P2 community injectedScore baseScore defaults 1.0, bypasses COMMUNITY_SCORE_CAP, communityDelta recorded 0 → calibration blind, telemetry permanently 0.
- P2 recencyWeight (convex fusion weight) reused as additive bonus rate → cap-saturated flat +0.10 for anything <10 days.
- P2 parseFloat||default falsy-zero: GRAPH_WEIGHT_CAP, RECENCY_FUSION_WEIGHT/CAP, smartRanking.recencyWeight can't be set to 0.
- P2 FSRS last_review written CURRENT_TIMESTAMP (space form, UTC) parsed new Date() as LOCAL → tz-offset decay skew; mixed formats in column.
- P2 momentum requires snapshot_date EXACTLY now-7d; missed day → channel zero all day.
- P2 graph-signals module caches keyed by memoryId only (no DB identity) — sibling of wave-3 cache-key bug class.
- P2 session-boost writes ranking score into attentionScore alias when unset (violates stage2's own preservation contract).
- OPT: computeGraphWalkMetrics rebuilds FULL edge adjacency per search (uncached, O(E)).
- OPT: adaptive_signal_events unbounded (1 row/result/search, no retention).
- CONTRACT: similarity = (1+cos)/2·100 NOT cosine (0.5 = orthogonal); comments/thresholds understate inflation.
- CONTRACT: eval-reporting exercises LEGACY hybridSearch() monolith with own co-activation/truncation — eval metrics ≠ production executePipeline composition.
- CONTRACT: constitutional recency exemption = perpetual +0.07 (critical gets none — tier order violated in recency channel).
- CONTRACT: fsrs hybrid-decay doc says default-OFF, code default-ON inside applyClassificationDecay before flag check ("do not combine" violated, latent while composite dead).

### DUP MECHANISM (verified by me)
- Migration v28 (vector-index-schema.ts:1460-1487) soft-retires dup active rows → tier='deprecated'; unique index idx_memory_logical_key_active_unique (:2403) is PARTIAL (active rows only) → deprecated rows exempt from uniqueness.
- Deprecated exclusion is CHANNEL-INCONSISTENT: vector channel filters deprecated (vector-index-queries.ts:431 per agent C) but lexical channels surface them (live: deprecated rows at ranks 2-4, score 0.85) + graph injection has no deprecated/parent filter (causal-boost.ts:457,687). → 7,340 deprecated snapshots pollute results via FTS/BM25/graph.

### Agent G (learning/feedback/eval) key items
- P1 retrieval-rescue.ts:210 + stage2:1425 (default ON): final score = 0.03*base + 0.78*lexicalRescue for ALL rows → learned boosts (+0.7), negative demotions (×0.3), graph/recency all compressed to ≤0.021. NOTE: may be deliberate 026-lexical-grounding-floor design — report as architecture tension. Validation multiplier (stage2:1470 ×[0.9,1.21]) runs AFTER rescue → survives; anything before :1425 is neutered.
- P1 PE-gate UPDATE/REINFORCE unreachable (pe-gating.ts:172-174 excludes same-path candidates; pe-orchestration.ts:88-97 rewrites to CREATE) → every save creates new row; FSRS reinforcement never fires; test mocks mask it.
- P1 cross-file SUPERSEDE from regex ("instead","actually") ≥85% sim marks SIBLING docs tier='deprecated' (pe-gating.ts:293-298) — wrong-direction live mutation; canonical-path guard covers UPDATE/REINFORCE only.
- P1 learned-feedback.ts:381 8-term cap counts EXPIRED terms; expireLearnedTerms has no callers → memory permanently stops learning after first 8 terms age out.
- P1 batch-learning.ts:314-326 query_reformulated (dissatisfaction) counted POSITIVE in boost (subtracted correctly in weightedHitCount — sign inconsistency).
- P1 eval ablation DB swap (eval-reporting.ts:138) leaves graphSearchFn closure over CLOSED startup connection after restore (rebindDatabaseConsumers reuses ref) → graph lane broken till restart; concurrent searches hit eval DB.
- P2 evidence-gap Z-score: n=2 always z=1.0 < 1.3 → every 2-result search flags gap.
- P2 batch-learning re-runs per restart, no idempotency key → same window inserted N×.
- P2 corrections compound penalty on retry (0.25×) + undo restores stale absolute values.
- P2 quality-loop rejection returns bestContent with LAST attempt's score; auto-fix REPLACES user-authored trigger phrases when extracted>existing (memory-save.ts:537, default ON) → user triggers dropped, index diverges from frontmatter (feeds L4 trigger churn).
- P2 dashboard trend: 'latency' prefix check fails on 'ablation_latency_*' → rising latency labeled improved. quality snapshots all eval_run_id=0 ("run-0" eternal sprint).
- P2 unbounded ledgers: feedback_events (~20 rows/search, default ON), shadow_scoring_log, batch_learning_log, promotion/conflict audits — no age-based retention anywhere.
- P2 shadow NDCG uses query-independent global labels + static seed phrases → promotion gate + threshold tuning driven by metric that never measured query relevance.
- P2 true-citation: bare-id regex matches "8" in "8 packets" (false used); ALL-words anchor requirement (false not-used). Flag OFF.
- P2 session-trace causal reducer: same-query co-retrieval preferred as "cause", single co-occurrence, no threshold (flag OFF).
- REFINEMENT: no tier demotion path/hysteresis; promotion throttle global (3/8h across ALL memories); retention extend sees only 7-day window.
- CONTRACT: result_cited = "content loaded" not "assistant cited" — batch-learning treats as strong 1.0 → display-popularity bias. shadow-feedback doc says OFF, code default ON. precision@k divides by k (under-reports short lists). prediction-error-gate.init(db) never called (T-09 audit dead).

### Agent D (query understanding + graph search) key items
- P1 hyde.ts:88 low-confidence gate vs min-max-normalized scores (top≡1.0) → HyDE NEVER fires when any candidate exists (only on empty baseline). With normalization off it would ALWAYS fire. Gate on absolute relevance instead.
- P1 graph-lifecycle.ts:309-323 recomputeLocal = additive ratchet (strength = MIN(1, strength + deg/max*0.1)) on EVERY save even with 0 new edges → all edge strengths converge to 1.0, destroying strength signal for graph ordering/BFS/communities.
- P1 graph-search-fn.ts:161-176 graph channel FTS = implicit AND over ALL tokens (stopwords incl) → verbose queries (the ones routed to graph) get 0 graph candidates silently; lexical lane uses OR.
- P2 graph-lifecycle.ts:532 surrogates generated with placeholder title "Memory ${id}" → question channel = "What is Memory 4821?" (7,108 surrogate rows affected).
- P2 stage1:1677 surrogate boost applies below MIN_MATCH_THRESHOLD and PINS intentAdjustedScore (top precedence in resolveEffectiveScore) for all later stages.
- P2 entity-linker incremental matching raw/case-sensitive vs full-run normalized → different graphs per path; createEntityLinks doesn't invalidate degree cache; reversed A→B/B→A dup pairs not deduped.
- P2 intent-classifier: "how does X work" (no article) zero understand evidence; substring keywords ('fix'⊂prefix, 'spec'⊂inspect, 'add'⊂address) steal intents → wrong MMR lambda/profile/channels.
- P2 query-router.ts:316 quality-gap fallback plan DEAD — no production caller passes qualitySignal → fts5/bm25/grep broadening tiers never activate (live-confirmed: engaged:false always).
- P2 llm-reformulation: memory content interpolated UNFENCED into prompt (injection vector); cache checked before flag; no negative caching (8s stall per deep query on outage); HyDE/reformulation share cache key without model/endpoint.
- P2 entity-linker density guard counts pseudo-edges (heading:/alias:/concept:) against memory rows → cross-doc linking silently disables as pseudo-edges accumulate.
- P2 community: applyCommunityBoost injects member ids with NO existence check (phantom rows for deleted memories); communities rebuilt ONLY on checkpoint-restore (frozen membership); "Louvain" is actually unweighted label propagation; fingerprint sum-collision + module cache not reset on DB rebind.
- P2 community-search.ts:91 substring scoring ("art" matches "start"/"partial").
- P2 retrieval-directives parseCandidateLine indexOf mid-word ("only" inside "Commonly") → malformed directives to LLM.
- OPT: applyCommunityBoost re-loads+parses ALL communities per candidate row per search (O(rows×communities×members)); intent classifier re-embeds query 7× per classification, classify runs 6-8× per deep query; enrichWithRetrievalDirectives readFileSync per constitutional result per search.
- REFINEMENT: concept alias map expands common words ('context'→memory, 'plan'→spec) default-ON → dilutes lexical precision; entity catalog LIMIT 500 no ORDER BY (nondeterministic aliases); no pruning for entity_catalog/memory_entities (561k rows).
- CONTRACT: pseudo-node ids share causal_edges with numeric ids — estimateComponentSize + recomputeLocal traverse/mutate them unfiltered; per-memory linking error falls back to FULL-corpus run inside save path.

### Agent H (save path) key items
- P0 memory-crud-delete.ts:82-99 soft-delete tombstones (opt-in flag) invisible to EVERY read path — no deleted_at filter in search/triggers/list/stats/dedup; edges hard-deleted anyway (restore loses graph). Dormant (flag off, deleted_at=0 rows live).
- P0 memory-save.ts:1803+ full-auto canonical routed save ALWAYS self-rejects: POST_SAVE_FINGERPRINT reads target file BEFORE promotePendingFile → fingerprint mismatch → rejection (validator even writes snapshot back). AND the advertised apply follow-up (plannerMode full-auto + routeAs) routes to plain indexMemoryFile — canonical writer has NO non-test caller. Success-parity tests describe.skip'd.
- P1 memory-save.ts:2618 transactional complement recheck enforces reconsolidation thresholds even with recon DISABLED (default), ignores force → E088 candidate_changed aborts on direct re-save of updated docs; retry hint ineffective.
- P1 quality-gate Layer-3 semantic dedup doesn't exclude own predecessor (PE path does) → lightly-edited re-save rejected as near-dup of itself (enforce mode after 14d warn window).
- P1 memory-crud-update tier validation lowercases for check, stores RAW ('Deprecated' passes, escapes all case-sensitive SQL tier predicates incl. unique-index partition + search exclusion).
- P1 memory-crud-health.ts:463 exclusion audit queries nonexistent column `content` (vs content_text) → prepare throws → caught → hard-exclusion-risk diagnostic can NEVER fire, exclusionAudit always 'ok'.
- P1 recon conflict path inserts new row before deprecating predecessor → active-row unique index collision → every same-path conflict-tier re-save fails (opt-in path).
- P2 ROOT CAUSE of L1 churn: content hash = raw sha256, no normalization (CRLF/trailing-ws/`last_updated_at` churn) → same-path supersede chain per save: retire predecessor (tier→'deprecated') + insert new row + lineage/history rows, zero semantic change. Continuity timestamp refresh alone triggers it.
- P2 [CRITICAL]/[IMPORTANT] bare substring ANYWHERE in body sets tier (memory-parser.ts:892) → docs quoting log formats get critical tier (no decay, 2× boost). Explains 948 critical incl. 272 in z_archive.
- P2 preflight exact-dup check has no same-path exclusion → re-save unchanged file = ERROR duplicate-of-itself (vs benign 'unchanged').
- P2 dedup matches tombstoned/deprecated rows → re-save over tombstone silently no-ops (never resurrects); retire-carry re-stamps 'deprecated' onto successor (invisible new rows reporting success!).
- P2 stats/health count deprecated+tombstoned as live (totalMemories/totalTriggerPhrases overstated).
- P2 bulk tombstone delete re-deletes same rows every run (no deleted_at IS NULL filter).
- P2 causal-links fuzzy LIKE '%ref%' fallback links arbitrary newest memory on any unresolved reference (graph pollution #2); 'blocks' mapped to reversed 'enabled' (inverted polarity).
- P2 governance rollback deletes new row but leaves predecessor deprecated → doc invisible until next scan.
- P2 spec-folder mutex reclaim race (two owners); BM25 in-memory add inside tx not rollback-safe; multi-line trigger phrases with apostrophes silently dropped.
- REFINEMENT: 'archived' tier referenced in exclusion predicates + idempotency + enrichment-skip but NOT in VALID_TIERS — phantom tier, can never be set. Whole archive concept unimplemented end-to-end (ties to L5: is_archived=0 everywhere, includeArchived hardcoded false).
- CONTRACT: two different exported buildContinuityFingerprint builders (input-chunk vs doc-content, different zeroing) → CONTINUITY_FRESHNESS permanent mismatch risk. Similarity scale sim>1?/100 heuristic replicated per-consumer, nothing asserts scale.
- OPT: last_review refreshed on every applyPostInsertMetadata incl. empty calls → FSRS clock resets on no-op saves. Embedding cache key content-only while embedded text includes title → cross-doc vector reuse.

## PENDING AGENT REPORTS: B (pipeline core)
