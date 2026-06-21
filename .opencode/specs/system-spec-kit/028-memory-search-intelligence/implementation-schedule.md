# 028 Dependency Ordered Build Schedule

Read basis: all 42 implementation child `spec.md` and `plan.md` files under `001-speckit-memory`, `002-code-graph`, `003-skill-advisor` and `004-deep-loop`.

This schedule orders phases, not task files. Candidate counts are phase-local candidate rows or explicit prose counts from the child docs. DONE candidates shipped in packet 030 stay skipped unless a phase also has pending residue.

## Fully Done Skip List

| Phase | Level | Count | Skip Reason |
|-------|-------|-------|-------------|
| `001-speckit-memory/004-graceful-degradation` | 1 | 1 done, 0 pending | C9 graceful embedder degrade shipped and validated |
| `004-deep-loop/001-reducer-anchor-fix` | 1 | 1 done, 0 pending | Reducer anchor template fix shipped in `738e118751` |

## Tier Table

| Tier | Phases | Depends On |
|------|--------|------------|
| 0 | `001/001-corpus-reindex-gate-zero`<br>`001/005-recall-render-escaper`<br>`001/013-enrichment-observability`<br>`001/016-iterative-agentic-recall`<br>`001/021-residual-correctness`<br>`002/003-generation-watermark` soft Q6-C2<br>`002/008-doc-symbol-lane`<br>`003/002-runtime-lane-health-degrade`<br>`004/002-fanout-determinism-observability` pending tests<br>`004/006-continuity-threading` | None beyond shipped 030 substrates |
| 1 | `001/002-determinism-content-id-foundation` foundation residue<br>`001/007-bitemporal-window`<br>`001/010-consolidation-cursor-clock`<br>`002/001-determinism-walk-order`<br>`002/006-edge-governance-vocab`<br>`003/001-rrf-determinism-spine`<br>`004/004-reliability-weighted-convergence` shared D-orderhelper and Beta primitive | Tier 0 where relevant, plus shipped 030 comparator, content-id, fuser and fanout gauges |
| 2 | `001/003-retrieval-class-routing`<br>`001/006-redteam-probe-gate`<br>`001/008-edge-presence-currentness`<br>`001/009-derived-id-provenance`<br>`001/019-eval-harness-extension`<br>`002/002-edge-staleness-correctness`<br>`003/003-embedding-staleness-signal`<br>`003/004-c4-shadow-seam-beta-posterior`<br>`004/003-fanout-failure-recovery`<br>`004/005-stop-input-corroboration` | Tier 1 foundations, gate-zero for recall metrics and the sibling trust spine for green red-team probes |
| 3 | `001/014-mem0-ranking-tweaks`<br>`001/015-summary-fusion-grounding`<br>`001/017-semantic-edge-layer`<br>`001/018-sleeptime-consolidation`<br>`002/005-seeded-ppr-ranking`<br>`003/005-conflict-rerank-query-routing`<br>`003/006-provenance-drift-observability`<br>`003/007-outcome-weighted-ranking-followon` | Tier 2 harnesses, async cursor, RRF spine, shared Beta and schema substrates |
| 4 | `001/011-retention-forgetting`<br>`001/012-procedural-reliability-benchmark`<br>`001/020-eval-calibration-ab`<br>`002/004-code-edge-bitemporal`<br>`002/007-parser-resilience` after sign-off | Prior tiers plus benchmark, schema or owner sign-off gates |

## Per-Subsystem Build Order

### Spec-Kit Memory

| Order | Phase | Level | Count | Gate |
|-------|-------|-------|-------|------|
| 1 | `001-corpus-reindex-gate-zero` | 2 | 0 done, 1 pending | Gate-zero. Must restore embedding coverage before recall numbers |
| 2 | `005-recall-render-escaper` | 2 | 2 done, 4 pending | Benign corpus and live DB validation before marker filter and system-kind default |
| 3 | `013-enrichment-observability` | 1 | 1 done, 1 pending | Lag extends shipped backlog gauges |
| 4 | `021-residual-correctness` | 2 | 0 done, 2 pending | Verify-first correctness |
| 5 | `002-determinism-content-id-foundation` | 3 | 5 done, 4 pending | Keystone done, residue gated by C2-B, render build and multi-writer adoption |
| 6 | `010-consolidation-cursor-clock` | 3 | 0 done, 10 pending | Shared idempotent async primitive |
| 7 | `007-bitemporal-window` | 3 | 1 done, 4 pending | Schema migration |
| 8 | `003-retrieval-class-routing` | 3 | 0 done, 5 pending | C2-A classifier before C2-C and C2-B |
| 9 | `006-redteam-probe-gate` | 2 | 0 done, 1 pending | Green path waits on C8 escaper and namespace audit seam |
| 10 | `008-edge-presence-currentness` | 3 | 0 done, 5 pending | C3-B gates AsKnownAt and 4-channel matrix |
| 11 | `009-derived-id-provenance` | 3 | 0 done, 1 pending | Content-id module and schema migration |
| 12 | `019-eval-harness-extension` | 3 | 0 done, 1 pending | Gate-zero green first |
| 13 | `014-mem0-ranking-tweaks` | 2 | 0 done, 8 pending | Ranking candidates wait on gate-zero, entity boost waits on entity vector infra |
| 14 | `015-summary-fusion-grounding` | 2 | 0 done, 2 pending | RRF and channel weight surface coordination |
| 15 | `016-iterative-agentic-recall` | 3 | 0 done, 1 pending | Loop governor before wiring and benchmark |
| 16 | `017-semantic-edge-layer` | 3 | 0 done, 5 pending | Schema substrate first, post-reindex benchmark before promotion |
| 17 | `018-sleeptime-consolidation` | 3 | 0 done, 1 pending | 010 clock, cursor and cadence first |
| 18 | `011-retention-forgetting` | 2 | 0 done, 8 pending | Baselines, label or edge allowlist and schema gates |
| 19 | `012-procedural-reliability-benchmark` | 3 | 0 done, 4 pending | Outcome emitter, shared Beta and benchmark first |
| 20 | `020-eval-calibration-ab` | 2 | 0 done, 1 pending | 019 C9-3 and A8 gate first |

### Code Graph

| Order | Phase | Level | Count | Gate |
|-------|-------|-------|-------|------|
| 1 | `003-generation-watermark` | 2 | 0 done, 2 pending | Q6-C2 soft counter now, Q6-C1 deferred |
| 2 | `008-doc-symbol-lane` | 2 | 0 done, 2 pending | Independent tracks |
| 3 | `001-determinism-walk-order` | 2 | 1 done, 3 pending | 001 total comparator and fuser |
| 4 | `006-edge-governance-vocab` | 2 | 0 done, 5 pending | Live distinct scan before CHECK table rebuild |
| 5 | `002-edge-staleness-correctness` | 2 | 0 done, 4 pending | QueryImporters path and ordering gate, coordinate SUPERSEDES with 006 |
| 6 | `005-seeded-ppr-ranking` | 3 | 0 done, 6 pending | Traversal reuse confirm, benchmark and taxonomy |
| 7 | `004-code-edge-bitemporal` | 3 | 0 done, 5 deferred | Q6-C1, closed vocab, Memory C3-B and named consumer |
| 8 | `007-parser-resilience` | 1 | 0 done, 1 pending | Owner sign-off to reverse no self-heal stance |

### Skill Advisor

| Order | Phase | Level | Count | Gate |
|-------|-------|-------|-------|------|
| 1 | `002-runtime-lane-health-degrade` | 2 | 0 done, 3 pending | Baseline and lane-health signal are hard P0 |
| 2 | `001-rrf-determinism-spine` | 2 | 0 done, 3 pending | Shared fuser import and routing-agreement baseline |
| 3 | `003-embedding-staleness-signal` | 2 | 0 done, 2 pending | A-C shippable, D waits on Memory 010 |
| 4 | `004-c4-shadow-seam-beta-posterior` | 3 | 0 done, 9 pending | Shared Beta and durable shadow substrate |
| 5 | `005-conflict-rerank-query-routing` | 2 | 0 done, 3 pending | RRF spine, live conflict edge or routing benchmark |
| 6 | `006-provenance-drift-observability` | 2 | 0 done, 3 pending | Durable calibration substrate for drift and skip |
| 7 | `007-outcome-weighted-ranking-followon` | 3 | 0 done, 3 pending | Execution-success emitter, store, shared Beta and ambient tick |

### Deep Loop

| Order | Phase | Level | Count | Gate |
|-------|-------|-------|-------|------|
| 1 | `002-fanout-determinism-observability` | 2 | 3 done, 3 pending | Property test and content-normalization gate |
| 2 | `006-continuity-threading` | 2 | 0 done, 2 pending | Existing convergence stop and injection paths |
| 3 | `003-fanout-failure-recovery` | 2 | 0 done, 5 pending | Failure class before retry chain |
| 4 | `004-reliability-weighted-convergence` | 3 | 0 done, 9 pending | Benchmark gate before GO, shared Beta with advisor |
| 5 | `005-stop-input-corroboration` | 2 | 1 done, 6 pending | Novelty audit before STOP consumption, keep-both before conflict record |

### Spec-Kit Data Quality

RESEARCH-ONLY. This is Track-C `005-spec-data-quality`, a 28-phase scaffold where every child carries spec, plan, tasks, checklist and implementation-summary all PLANNED with no code landed. The order below is the build plan for a future packet, not work in progress, so the Count column reads scaffold because nothing is done. Two hard constraints drive the order. 026 the shared safe-fix engine ships first because the on-write and retroactive front doors reuse it. 015 the C2 prod-mode benchmark gate ships before every Tier-C retrieval phase and the 027 floor experiment because no retrieval candidate promotes without a prod-mode completeRecall@3 read.

| Order | Phase | Level | Count | Gate |
|-------|-------|-------|-------|------|
| 1 | `026-shared-safe-fix-engine` | 2 | 0 done, scaffold | Infra foundation. The one fix engine the on-write and retroactive front doors share, ships before A1, B1 and B2 |
| 2 | `015-c2-prodmode-recall-gate` | 2 | 0 done, scaffold | CONDITIONAL. Prod-mode completeRecall@3 benchmark that unblocks the whole retrieval tier and the 027 experiment |
| 3 | `004-a4-schema-warn-to-error` | 2 | 0 done, scaffold | GO measured. Promote the JSON-schema shape rules from warn to error, validation not ranking, no re-index, leads Tier A |
| 4 | `001-a1-extend-quality-loop-authored` | 2 | 0 done, scaffold | GO-on-cost. Keystone on-write seam, extends the live quality loop to authored docs, reuses 026 |
| 5 | `002-a2-trigger-propagation-description` | 2 | 0 done, scaffold | GO-on-cost. Propagate trigger phrases into description.json |
| 6 | `003-a3-enum-constrain-schemas` | 2 | 0 done, scaffold | GO-on-cost. Enum-constrain the two metadata JSON schemas |
| 7 | `005-a5-trigger-coherence-assertion` | 2 | 0 done, scaffold | GO-on-cost. Assert trigger coherence between spec.md and description.json |
| 8 | `006-a6-hvr-style-autofix` | 2 | 0 done, scaffold | GO-on-cost. Autofix HVR style violations at write time |
| 9 | `007-a7-ears-constraints-req-coverage` | 2 | 0 done, scaffold | GO-on-cost. EARS constraints and requirement-coverage checks |
| 10 | `008-a8-surface-provenance-fields` | 2 | 0 done, scaffold | GO-on-cost. Surface provenance fields on each doc |
| 11 | `009-a9-content-hash-integrity` | 2 | 0 done, scaffold | GO-on-cost. Content-hash integrity field so a stale or tampered doc errors |
| 12 | `010-a10-per-surface-gates` | 2 | 0 done, scaffold | GO-on-cost. Per-surface gates so each doc family enforces only its checks |
| 13 | `011-b1-scheduled-dq-sweep` | 2 | 0 done, scaffold | GO-on-cost. Standing scheduled DQ sweep with guarded auto-fix, reuses 026 |
| 14 | `012-b2-doctor-dq-route` | 2 | 0 done, scaffold | GO-on-cost. /doctor data-quality auto-remediation route, reuses 026 |
| 15 | `013-b3-retrieval-feedback-edge` | 2 | 0 done, scaffold | GO-on-cost. Retrieval-learning feedback edge from observed recall |
| 16 | `019-novel-contradiction-detection` | 2 | 0 done, scaffold | GO. Floor-bypassing report-only seam, cross-doc contradiction detection |
| 17 | `020-novel-embedding-drift-monitor` | 2 | 0 done, scaffold | GO. Floor-bypassing report-only seam, embedding-drift monitor |
| 18 | `021-novel-example-test-generation` | 2 | 0 done, scaffold | GO. Floor-bypassing report-only seam, auto example and test generation |
| 19 | `022-novel-context-budget-assembler` | 2 | 0 done, scaffold | GO. Floor-bypassing report-only seam, context-budget assembler |
| 20 | `023-novel-typed-relation-kg` | 2 | 0 done, scaffold | GO. Floor-bypassing report-only seam, typed-relation knowledge graph |
| 21 | `024-novel-freshness-decay-queue` | 2 | 0 done, scaffold | GO. Floor-bypassing report-only seam, freshness-decay re-check queue |
| 22 | `025-novel-per-doc-quality-slas` | 2 | 0 done, scaffold | GO. Floor-bypassing report-only seam, per-doc quality SLAs |
| 23 | `014-c1-chunk-prefix` | 2 | 0 done, scaffold | CONDITIONAL. Header-path and global-identity chunk prefix, gated behind 015 |
| 24 | `016-c3-answerable-questions-tags` | 2 | 0 done, scaffold | CONDITIONAL. Answerable-questions tags, gated behind 015 |
| 25 | `017-c4-metadata-fusion` | 2 | 0 done, scaffold | CONDITIONAL. Metadata fused into the embedding, gated behind 015 |
| 26 | `018-c5-llm-judge-scorer` | 2 | 0 done, scaffold | CONDITIONAL. LLM-judge scorer for floor-hidden candidates, gated behind 015 |
| 27 | `027-retrieval-floor-experiment` | 2 | 0 done, scaffold | Infra. Raise the result budget and measure whether results 4 through 10 are signal, gated behind 015 |
| 28 | `028-governance-rollout` | 2 | 0 done, scaffold | Infra. Owns the full 17-stage rollout, four-beat migration, safety model and measurement plan |

## Gated Track

| Phase | Gate | Concrete Unblock Condition |
|-------|------|----------------------------|
| `001/001-corpus-reindex-gate-zero` | gate-zero | Pre and post `memory_health`, force reindex, reconcile apply and `assertEmbeddingCoverage` passing |
| `001/002-determinism-content-id-foundation` residue | shared-infra-dep | C-X1 configured waits on C2-B plus fusion-bonus unit test, C5-A waits on render golden rebaseline, identity pair waits on multi-writer adoption |
| `001/007-bitemporal-window` | schema-migration | Additive four-timestamp window, event-time source recorded and reader transparency proven |
| `001/008-edge-presence-currentness` | schema-migration, needs-benchmark | C3-B landed for AsKnownAt, unforget half present for 4-channel matrix and range-filter precision benchmark recorded |
| `001/009-derived-id-provenance` | schema-migration | Anchor-inclusive derived-id recipe fixed, additive column plus unique index backfill proven |
| `001/011-retention-forgetting` | needs-benchmark, schema-migration, shared-infra-dep | Recall baseline captured, forget allowlist label or live-edge symbol located, reconsolidation flag present and erasure work split out |
| `001/012-procedural-reliability-benchmark` | needs-benchmark, schema-migration, shared-infra-dep | Outcome emitter built, shared Beta available, benchmark proves value, HAS_FAILURE path or deprecated precedent chosen |
| `001/014-mem0-ranking-tweaks` | gate-zero, shared-infra-dep | Reindexed recall baseline for ranking, entity vector index before entity boost and verify-first reprocess gap confirmed |
| `001/015-summary-fusion-grounding` | needs-benchmark, shared-infra-dep | Retrieval baseline captured, RRF lane wired under shadow flag and weight retune measured |
| `001/016-iterative-agentic-recall` | needs-benchmark | Governor and flag-off wiring verified, latency, cost and determinism benchmark recorded |
| `001/017-semantic-edge-layer` | gate-zero, schema-migration, shared-infra-dep | Edge-vector schema and store landed, consolidation embedder works in shadow and post-reindex lift benchmark recorded |
| `001/018-sleeptime-consolidation` | needs-benchmark, shared-infra-dep | Memory 010 clock, cursor and cadence landed, shadow telemetry records value before live opt-in |
| `001/019-eval-harness-extension` | gate-zero | Coverage guard passes before C9-1, C9-2, C9-3 and A8 run |
| `001/020-eval-calibration-ab` | needs-benchmark, shared-infra-dep | 019 C9-3 and A8 gate built, held-out ECE lane present and lever A/B deltas recorded |
| `002/001-determinism-walk-order` tuning | needs-benchmark, shared-infra-dep | 001 total comparator and fuser consumed, code-graph retrieval benchmark exists before tuning magnitudes |
| `002/002-edge-staleness-correctness` | needs-benchmark | Path-filtered importer query built, pre-replaceNodes capture proven and fan-in benchmark recorded |
| `002/004-code-edge-bitemporal` | schema-migration | Named as-of consumer, Q6-C1 hard generation, 006 closed vocab and Memory C3-B shape all present |
| `002/005-seeded-ppr-ranking` | needs-benchmark, shared-infra-dep | 027 traversal reuse confirmed, PPR core built, class taxonomy present and retrieval benchmark recorded |
| `002/006-edge-governance-vocab` | schema-migration | Live `edge_type` distinct scan clean or repaired, table rebuild round-trip proven and `SUPERSEDES` admitted |
| `002/007-parser-resilience` | owner sign-off | Owner approves transient self-heal reversal, then durable attempt-count retry path can build |
| `003/001-rrf-determinism-spine` | needs-benchmark | Top-1 and top-3 routing-agreement baseline captured before live flip |
| `003/004-c4-shadow-seam-beta-posterior` | needs-benchmark, shared-infra-dep | Lane-health baseline, shared Beta primitive, durable shadow substrate and promoter reload path confirmed |
| `003/005-conflict-rerank-query-routing` | needs-benchmark, shared-infra-dep | RRF spine shipped, reciprocal conflict edge exists for C1, routing benchmark and taxonomy exist for QCR |
| `003/006-provenance-drift-observability` | shared-infra-dep | Durable cross-session calibration substrate replaces tmpdir JSONL for drift and skip reasons |
| `003/007-outcome-weighted-ranking-followon` | needs-benchmark, shared-infra-dep | Execution-success emitter, durable store, shared Beta and ambient tick present, then shadow benchmark recorded |
| `004/002-fanout-determinism-observability` tail | verification-gate, content-normalization-gated | Arrival-order property test protects shipped comparator, near-dup collapse only after normalized-content proof |
| `004/003-fanout-failure-recovery` | needs-benchmark | Failure class and durable retry fixtures prove retry-success counts and exhaustion behavior |
| `004/004-reliability-weighted-convergence` | needs-benchmark, shared-infra-dep | Benefit micro-benchmark decides GO, D1 f64 Beta and D-orderhelper land before D2, D3 and consumers |
| `004/005-stop-input-corroboration` | needs-benchmark, anchor-confirm | Graph novelty benchmark, lag ceiling benchmark, downstream dedup check and conflict-record anchor confirmed |

## Cross-Subsystem Shared Infra

| Primitive | Owner Phase | Consumers |
|-----------|-------------|-----------|
| Total comparator and content-id primitives | `001/002` | `002/001`, `001/009`, `004/002`, `004/005`, `004/006` and C5-A residue |
| `fuseResultsMulti` and `bonusOverChannels` | `001/002` | `003/001`, `002/001`, `001/003`, `001/015` and advisor C6 downstream |
| RRF determinism spine | `003/001` | `003/005` conflict rerank, QCR and exact rerank |
| Shared bounded Beta posterior | `004/004` plus `003/004` | `003/004`, `003/007`, `004/004` consumers and `001/012` procedural reliability |
| Bi-temporal validity-window shape | `001/007` | `001/008` and `002/004` |
| Idempotent async cursor, clock and retry primitive | `001/010` | `003/003` rebuild phase and `001/018` sleeptime consolidation |
| Closed code-edge vocabulary | `002/006` | `002/002` SUPERSEDES and `002/004` code-edge bitemporal |
| Eval harness C9 and A8 gate | `001/019` | `001/020`, `001/014`, `001/015`, `001/017` and recall calibration consumers |
| Fanout gauges and merge comparator | `004/002` shipped trio | `004/003` failure recovery and `004/005` STOP corroboration |

## Critical Path

The longest dependency chain is the recall measurement path: `001/001-corpus-reindex-gate-zero` -> `001/019-eval-harness-extension` C9-1 snapshot -> C9-2 labels -> C9-3 metrics -> A8 promotion gate -> `001/020-eval-calibration-ab` calibration harvest -> held-out ECE and lever A/B. This chain gates any trustworthy recall, calibration, cold-tier and ranking claim. The main gated cross-subsystem tail is separate: `001/007-bitemporal-window` + `002/003-generation-watermark` + `002/006-edge-governance-vocab` -> `002/004-code-edge-bitemporal`. The research-only Track-C data-quality retrieval tier rides the same discipline: every Tier-C phase plus the `005/027-retrieval-floor-experiment` gates on the `005/015-c2-prodmode-recall-gate` prod-mode completeRecall@3 benchmark, the data-quality mirror of this packet's prod-mode-benchmark gate.

## Recommended First Wave

Run `001/001-corpus-reindex-gate-zero` first and in parallel start the low-dependency correctness work: `001/005-recall-render-escaper`, `003/002-runtime-lane-health-degrade`, `002/003-generation-watermark` Q6-C2, `002/008-doc-symbol-lane`, `004/006-continuity-threading`, `001/021-residual-correctness` and `001/013-enrichment-observability`. That wave clears the recall benchmark floor, closes the highest-risk trust boundary and gives later tiers stable health, generation and continuity signals without touching schema-heavy or benchmark-gated tails.
