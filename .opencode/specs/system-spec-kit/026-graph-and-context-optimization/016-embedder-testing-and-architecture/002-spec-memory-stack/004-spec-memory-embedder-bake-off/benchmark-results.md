---
title: "Benchmark Results: mk-spec-memory text-embedder bake-off (6 candidates)"
description: "Headline doc for the 016/004 mk-spec-memory embedder bake-off. 6 candidates measured against the cat-24/409 paraphrase-recall fixture (10 trigger-phrase lookups). jina-embeddings-v3 wins 9/10 with the retrieval-rescue layer and is the production default per ADR-012. Sibling: 016/004/004-extended-bake-off (CocoIndex code-side bake-off)."
trigger_phrases:
  - "spec memory benchmark"
  - "mk-spec-memory embedder benchmark"
  - "spec memory bake-off"
  - "text embedder benchmark"
  - "jina-embeddings-v3 spec memory"
  - "adr-012 production embedder"
  - "cat-24-409 benchmark"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Benchmark Results: mk-spec-memory text-embedder bake-off

> **One-line headline:** `jina-embeddings-v3 + retrieval-rescue layer` is the production default for mk-spec-memory. Won 9/10 on the cat-24/409 paraphrase-recall fixture. ADR-012 (decision-record.md) is the standing decision.

> **Looking for the code-side bake-off instead?** See `../../../004-code-index-stack/004-extended-bake-off/benchmark-results.md` (CocoIndex / sentence-transformers backend).

<!-- ANCHOR:headline -->
## 1. Headline

mk-spec-memory's embedder default after 6-candidate elimination + rescue-layer integration:

| Candidate | Backend | Dim | cat-24/409 top-3 | Median ms | p95 ms | Verdict |
|---|---|---|---|---|---|---|
| **jinaai/jina-embeddings-v3** ← PRODUCTION | Ollama (Q4_K_M GGUF) | 1024 | **9/10** | **893** | **1465** | ADR-012 PROMOTE |
| nomic-ai/nomic-embed-text-v1.5 | Ollama (F16) | 768 | 8/10 (D-RETRY) | 922 | 3045 | ADR-006 rolled back (still good runner-up) |
| google/embeddinggemma-300m | llama-cpp (Q8 GGUF) | 768 | 7/10 | 787 | 936 | Baseline; kept as fallback |
| BAAI/bge-m3 | Ollama | 1024 | 2/10 raw | — | — | ADR-007 rolled back |
| mixedbread-ai/mxbai-embed-large-v1 | Ollama | 1024 | 2/10 raw | — | — | ADR-001 rolled back |
| Snowflake/snowflake-arctic-embed-l-v2.0 | Ollama | 1024 | 1/10 raw | — | — | ADR-008 rolled back |

Plus a retrieval-rescue layer (sibling/backfill rescue + trigger-lane weighting) integrated on top → ADR-010 + ADR-011 (default-on).

**PASS gate** for cat-24/409: ≥8/10 top-3. Only jina-v3 (9/10) and nomic-v1.5 (8/10) reached it, both with the rescue layer enabled. Without the rescue layer, the best candidate was nomic at 5/10 — short of the gate.

The lesson from this bake-off: **for paraphrase-heavy text retrieval, the rescue layer (sibling injection + trigger-lane re-weighting) contributes more lift than the embedder swap**. The embedder choice still matters at the margin (jina vs nomic = 9 vs 8) but the rescue layer is the load-bearing piece.
<!-- /ANCHOR:headline -->

<!-- ANCHOR:methodology -->
## 2. Methodology

### Fixture
- **cat-24/409 — "LLM-made-memory recall"**: 10 paraphrased trigger-phrase queries where the expected memory exists in the corpus and the query is a paraphrase of its trigger phrase. PASS threshold: 8/10 top-3 hits.
- Also referenced: cat-24/402 (synonymy across vocabularies), cat-24/408 (compound concept synthesis). 402 + 408 remained FAIL for all candidates including the winner — the bake-off cleanly closed 409 but not the other two cat-24 scenarios.

### Search pipeline measured
Every measurement used:
1. `memory_search` MCP tool with `limit=3 includeTrace=true bypassCache=true`
2. Full corpus re-index after each embedder swap (~7,738 rows for jina-v3, dim 1024)
3. Retrieval-rescue layer **on** for the final ADR-012 comparison (gemma/nomic/jina-v3)
4. `vec_metadata.active_embedder_name` verified before each candidate's measurement window

### Re-index cost
- Vec-768 candidates (gemma, nomic): ~minutes for 7,738 rows
- Vec-1024 candidates (jina-v3, mxbai, bge-m3, snowflake): ~tens-of-minutes per swap on Apple Silicon Metal
- Schema migration (vec_768 → vec_1024) is the headline cost for any 1024-dim swap

### Environment
- Apple Silicon (M-series, Metal-active)
- Ollama daemon for jina-v3/nomic/mxbai/bge-m3/snowflake; llama-cpp for gemma baseline
- mk-spec-memory MCP server (TypeScript / Node) — NOT the Python sbert path that CocoIndex uses
- Different stack entirely from `016/004/004-extended-bake-off` (code-side)
<!-- /ANCHOR:methodology -->

<!-- ANCHOR:embedder-profiles -->
## 3. Per-Embedder Profiles

### 3.1 `jinaai/jina-embeddings-v3` — production winner

| Property | Value |
|---|---|
| HuggingFace / Ollama | `hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M` |
| Dim | 1024 |
| Params | 558M |
| RAM loaded | ~495 MB (Q4_K_M quantization) |
| Disk (HF cache) | ~1.1 GB |
| Context | 8192 (loaded at 4096) |
| Category | Text, multilingual + paraphrase-tuned, Matryoshka (256/512/768/1024 truncation supported) |
| Released | Sept 2024 |
| Strengths observed | Won 9/10 cat-24/409 with rescue; lowest p95 of the 1024d candidates (1465ms); GPU/Metal-resident at 0% steady-state CPU |
| Weaknesses observed | Schema migration cost (vec_1024 vs baseline vec_768) and ~tens-of-minutes re-index on first swap |

### 3.2 `nomic-ai/nomic-embed-text-v1.5` — close runner-up

| Property | Value |
|---|---|
| HuggingFace / Ollama | `nomic-embed-text:v1.5` |
| Dim | 768 (drop-in, no schema migration vs gemma baseline) |
| Params | 137M |
| RAM loaded | ~578 MB (F16) |
| Disk | ~270 MB |
| Context | 2048 default / 8192 max |
| Category | Text retrieval-specialist, trained on 235M pairs with hard negatives |
| Released | Feb 2024 |
| Strengths observed | 8/10 cat-24/409 with rescue (D-RETRY measurement); 768-dim drop-in = zero schema migration cost; raw embed latency ~12ms (fastest of the three measured) |
| Weaknesses observed | High p95 (3045ms vs jina-v3's 1465ms) — wider end-to-end tail; requires `search_query: ` / `search_document: ` prefix tokens |

### 3.3 `google/embeddinggemma-300m` — baseline fallback

| Property | Value |
|---|---|
| HuggingFace / Ollama | `unsloth-embeddinggemma-300m-GGUF/embeddinggemma-300m-Q8_0.gguf` (llama-cpp) |
| Dim | 768 |
| Params | 300M |
| RAM loaded | ~500 MB (Q8 GGUF) |
| Disk | ~300 MB |
| Context | 2048 |
| Category | General-purpose text (not specialized for retrieval) |
| Released | Sept 2025 |
| Strengths observed | Fastest end-to-end (787ms median); kept as schema fallback (still listed as `DEFAULT_ACTIVE_EMBEDDER` in `schema.ts:26`); llama-cpp backend = no external daemon dependency |
| Weaknesses observed | Only 7/10 on cat-24/409 — below the 8/10 PASS gate even with rescue layer on |

### 3.4 `BAAI/bge-m3` — rolled back (ADR-007)

| Property | Value |
|---|---|
| HuggingFace / Ollama | `bge-m3:latest` |
| Dim | 1024 |
| Context | 8192 |
| Category | Multilingual (100+), dense+sparse+multivec retrieval modes |
| Released | Feb 2024 |
| Result | 2/10 raw on cat-24/409 — worse than baseline gemma's 1/10 raw + 7/10 with rescue. The 1024d schema migration was paid but did not deliver paraphrase-recall lift. |
| Why rolled back | The dense path alone underperforms on this fixture. The advertised multi-functionality (dense+sparse+colbert) wasn't exercised — mk-spec-memory's retrieval is single-vector dense only. |
| Could it come back? | Only if mk-spec-memory's retrieval stack adds sparse-vector + multivec hybrid lanes, which would require substantial implementation. |

### 3.5 `mixedbread-ai/mxbai-embed-large-v1` — rolled back (ADR-001..004)

| Property | Value |
|---|---|
| HuggingFace / Ollama | `mxbai-embed-large:latest` |
| Dim | 1024 |
| Context | 512 (critically short for spec docs) |
| Released | Mar 2024 |
| Result | 2/10 raw. Multiple failure modes: (a) initial swap returned 400 Bad Request from Ollama; (b) retry with smaller batch hit "input length exceeds context length" because spec docs are routinely 5000+ chars; (c) when finally activated with `maxInputChars=1200`, jaccard overlap on cat-24/402 paraphrase pairs was 25% / 0% — below the 60% threshold. |
| Why rolled back | The 512-token context is a fundamental mismatch for spec-doc embedding. Despite the AnglE-loss training that should help paraphrase, the context truncation strips too much signal. |

### 3.6 `Snowflake/snowflake-arctic-embed-l-v2.0` — rolled back (ADR-008)

| Property | Value |
|---|---|
| Ollama | `snowflake-arctic-embed-l-v2.0:latest` |
| Dim | 1024 |
| Context | 8192 |
| Languages | 74 |
| Released | Dec 2024 |
| Result | 1/10 raw cat-24/409 — *worse* than baseline (also 1/10 raw). Pure dense swap, no rescue, didn't move the needle in the right direction. |
| Why rolled back | If a fresh 1024d candidate regresses below baseline on the target fixture, the bake-off committee called it: "pure dense swaps did not close 409, move next to reranking" (ADR-008). |
<!-- /ANCHOR:embedder-profiles -->

<!-- ANCHOR:rescue-layer -->
## 4. The Retrieval-Rescue Layer (ADR-010 + ADR-011)

The most surprising finding from this bake-off: **no embedder alone closed the cat-24/409 gate**. The best pure-dense candidate (nomic) reached 5/10. The gate is 8/10.

What closed it: a retrieval-rescue layer added on top of the existing search pipeline. Two paths:

- **Path B (trigger-lane weighting):** generic one-token triggers (`tasks`, `checklist`, `decision`, `spec`) are no longer counted as decisive ranking evidence. Reduces false positives on broad-vocab queries.
- **Path C (sibling/backfill rescue):** hydrates candidates from `memory_index`, injects same-folder siblings, and adds lexical backfill before artifact limiting. Recovers near-miss matches that ranked just below top-3.

Cost: **~2.16× latency** end-to-end (ADR-011 cost-benefit). Gated default-on with the kill switch `SPECKIT_RERANK_LAYER=false` if an operator wants to disable.

Lift breakdown (jina-v3 specifically):
| Stage | top-3 cat-24/409 |
|---|---|
| jina-v3 raw (no rescue) | 4/10 |
| jina-v3 + rescue layer | **9/10** |
| Δ from rescue | **+5/10 = +50pp** |

For reference, gemma + rescue went from 1/10 → 7/10 (+6/10), and nomic from 5/10 → 8/10 (+3/10).

**Implication for future text-embedder swaps:** the rescue layer is doing more work than the embedder swap. Future candidates should be measured *with* the rescue layer on (mirrors production) and the comparison should be against jina-v3 + rescue as the production baseline.
<!-- /ANCHOR:rescue-layer -->

<!-- ANCHOR:adr-trail -->
## 5. ADR Trail (decision-record.md)

The full decision history is in `decision-record.md`. Quick map:

| ADR | Subject | Outcome |
|---|---|---|
| 001 | Roll back mxbai-embed-large-v1 activation | Rolled back — 400 Bad Request from Ollama on first swap |
| 002 | mxbai failure mode + rollback command | Failure-mode documentation |
| 003 | Keep rollback after retry | Rolled back again — context-length failure on second attempt |
| 004 | Keep rollback after truncation retry | Rolled back — `maxInputChars=1200` doesn't close 409 |
| 005 | Roll back jina-embeddings-v3 (first pass) | Rolled back — improved 4/10 but not PASS (this was BEFORE rescue layer existed) |
| 006 | Roll back nomic-embed-text-v1.5 (first pass) | Rolled back — new leader at 5/10 but still below PASS |
| 007 | Roll back bge-m3 | Rolled back — long-context activated but 409 regressed to 2/10 |
| 008 | Roll back snowflake-arctic-embed-l-v2.0 | Rolled back — 1/10 cat-24/409, regression from baseline |
| **009** | **Keep 409 open after fixture surgery; move to reranking** | Pivot decision — dense swaps exhausted, add rescue layer |
| **010** | **Keep opt-in retrieval rescue layer** | Closed cat-24/409 at 8/10 under nomic with rescue ON |
| **011** | **Gate retrieval rescue default-on** | Default-on after 2.16× latency cost/benefit review |
| **012** | **Production embedder choice — jina-embeddings-v3 + rescue** | Final decision: jina-v3 wins over nomic on quality + latency |
<!-- /ANCHOR:adr-trail -->

<!-- ANCHOR:caveats -->
## 6. Caveats

- **Single fixture (cat-24/409).** This bake-off measured one paraphrase-recall scenario. cat-24/402 (synonymy) and cat-24/408 (compound concepts) both remained FAIL under all candidates — they were not the gate but their persistence suggests future fixture work.
- **Rescue layer changes the game.** Pre-rescue numbers (gemma 1/10, jina 4/10, nomic 5/10) suggested very different rankings. Always measure with rescue on if comparing against production.
- **Schema-migration cost is high but one-time.** Once jina-v3's vec_1024 table is built, subsequent searches see no further migration cost. Swap risk is mostly the re-index window, not steady-state.
- **bge-m3 lost decisively** — its sparse+multivec modes are unused in mk-spec-memory's single-vector dense pipeline. If future work adds hybrid lanes, re-measure bge-m3 then.
- **Latency profile may shift.** End-to-end p95 of 1465ms for jina-v3 is dominated by rescue-layer overhead, not raw embed time (60ms). Optimizing the rescue layer's stage-3 cost would benefit ALL candidates equally.
- **Stack distinction:** mk-spec-memory uses **Ollama** as its primary backend; **CocoIndex** uses **sentence-transformers (sbert)** as its primary backend. The same model name often exists in both, but the quantization, runtime, and latency profile differ. Do NOT cross-reference performance numbers between this bake-off and `016/004/004-extended-bake-off`.
<!-- /ANCHOR:caveats -->

<!-- ANCHOR:see-also -->
## 7. See Also

- **`decision-record.md`** — the full ADR-001..012 history (this packet's primary historical record; mandatory read for context on why each rollback happened).
- **`implementation-summary.md`** — what was built end-to-end (rescue layer code, jina-v3 swap, packet 008 closure).
- **`evidence/INDEX.md`** — file-by-file evidence navigation (per-embedder cat-24 reruns, rescue cost/benefit, jina runtime measurements, fixture audit).
- **`evidence/embedder-comparison-with-rescue.jsonl`** — the 3 final rows that ADR-012 cites.
- **`evidence/jina-runtime-measurements.md`** — live RAM / Metal / per-query latency for jina-v3 vs nomic vs gemma.
- **`../CHANGELOG.md` v4.0 section** — operator-facing summary of this bake-off + rescue layer ship.
- **`016/004/004-extended-bake-off/benchmark-results.md`** — sibling code-side bake-off (4 sbert candidates against an 18-pair code-retrieval fixture; bge-code-v1 wins 11/18). Different stack, different fixture, different conclusions.
- **`016/007-ollama-and-bge-promotion-arc/004-newer-text-embedders-survey/`** — follow-on sub-phase being rescoped (bge-m3 lost here, so the re-bench would just repeat a failed experiment; re-scoping to "newer text embedders survey" — see commit history).
<!-- /ANCHOR:see-also -->

<!-- ANCHOR:rename-history -->
## 8. Rename History

- **2026-05-18:** Folder renamed `004-mxbai-swap-and-008-closure` → `004-spec-memory-embedder-bake-off` for discoverability. The original name described the entry hypothesis (swap to mxbai + close packet 008's cat-24/409) but the work expanded to a 6-candidate bake-off + rescue-layer integration that the original name didn't surface. All internal references and 25+ external references updated in the same commit. `git log --follow` preserves history through the rename.
<!-- /ANCHOR:rename-history -->
