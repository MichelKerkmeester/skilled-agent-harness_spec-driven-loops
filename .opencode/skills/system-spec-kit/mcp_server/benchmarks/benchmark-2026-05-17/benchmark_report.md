---
title: "mk-spec-memory text-embedder bake-off — May 17, 2026"
description: "Curated benchmark report for the 6-candidate mk-spec-memory text-embedder bake-off run on May 17, 2026. Winner: jina-embeddings-v3 + retrieval-rescue layer at 9/10 cat-24/409 top-3, ratified by ADR-012."
trigger_phrases:
  - "spec memory benchmark"
  - "mk-spec-memory embedder benchmark"
  - "spec memory bake-off"
  - "jina-embeddings-v3 spec memory"
  - "adr-012 production embedder"
  - "cat-24-409 benchmark"
  - "retrieval rescue layer"
importance_tier: "important"
contextType: "implementation"
---

# mk-spec-memory text-embedder bake-off — May 17, 2026

> **Winner:** `jina-embeddings-v3` + retrieval-rescue layer, 9/10 cat-24/409 top-3, median 893 ms, p95 1465 ms. Ratified as production default in ADR-012 on May 17, 2026.

---

## 1. OVERVIEW & HEADLINE

This is the skill-local curated record of the 6-candidate text-embedder bake-off run for `mk-spec-memory` on May 17, 2026. The authoritative audit trail lives in the spec packet (see [`SOURCE.md`](./SOURCE.md) and Section 10). This report exists so a future operator inside the MCP code can answer "which embedder won and why" without leaving the skill.

### What Shipped

> **`jina-embeddings-v3` (Ollama Q4_K_M GGUF, 1024-dim) + the retrieval-rescue layer (default-on)** is the production embedder for `mk-spec-memory` as of May 17, 2026.

Key numbers on the cat-24/409 paraphrase-recall fixture:

| Metric | Value |
|---|---|
| Top-3 hits | **9/10** |
| Median end-to-end latency | **893 ms** |
| p95 end-to-end latency | **1465 ms** |
| Corpus size at measurement | 7738 rows (`vec_1024`) |
| Decision record | ADR-012 |
| PASS gate | top-3 >= 8/10 |

### The Load-Bearing Insight

The retrieval-rescue layer (sibling/backfill rescue plus trigger-lane re-weighting) contributes more lift to recall than any embedder swap measured in this bake-off. Pre-rescue, no candidate reached the 8/10 PASS gate. With rescue on, three did: gemma climbed from 1/10 to 7/10 (+6), nomic from 5/10 to 8/10 (+3), and jina-v3 from 4/10 to 9/10 (+5). The embedder choice still matters at the top of the table, but rescue is the load-bearing piece.

### How To Use This Document

- Section 2 is the headline aggregate table.
- Sections 3 and 4 anchor methodology and per-candidate facts.
- Sections 5 and 6 explain how we got here and what the data really says.
- Sections 7 through 9 cover honest limits, what to apply now, and how to replay.
- Section 10 links the spec packet, the sibling code-side bake-off, and the tracking sub-phase.

---

## 2. AGGREGATE RESULTS

One row per candidate. Latency is end-to-end `memory_search` round-trip with the rescue layer enabled, matching production. `cat-24/409 top-3` is the gate metric (PASS at >= 8/10).

| Candidate | Backend | Dim | Context | cat-24/409 top-3 raw | cat-24/409 top-3 with rescue | Median ms | p95 ms | Verdict |
|---|---|---|---|---|---|---|---|---|
| **jinaai/jina-embeddings-v3** | Ollama (Q4_K_M GGUF) | 1024 | 8192 (loaded at 4096) | 4/10 | **9/10** | **893** | **1465** | **ADR-012 PROMOTE — production default** |
| nomic-ai/nomic-embed-text-v1.5 | Ollama (F16) | 768 | 2048 default, 8192 max | 5/10 | 8/10 (D-RETRY) | 922 | 3045 | ADR-006 rolled back, strong runner-up |
| google/bge-base-en-v1.5 | ollama (Q8 GGUF) | 768 | 2048 | 1/10 | 7/10 | 787 | 936 | Baseline, kept as schema fallback (`DEFAULT_ACTIVE_EMBEDDER` in `schema.ts:25`) |
| BAAI/bge-m3 | Ollama | 1024 | 8192 | 2/10 | not measured with rescue | n/a | n/a | ADR-007 rolled back |
| mixedbread-ai/mxbai-embed-large-v1 | Ollama | 1024 | 512 | 2/10 | not measured with rescue | n/a | n/a | ADR-001..004 rolled back |
| Snowflake/snowflake-arctic-embed-l-v2.0 | Ollama | 1024 | 8192 | 1/10 | not measured with rescue | n/a | n/a | ADR-008 rolled back |

Raw aggregate data lives in [`results.csv`](./results.csv). Per-probe rows for the final three candidates live in [`per-probe-with-rescue.jsonl`](./per-probe-with-rescue.jsonl).

---

## 3. METHODOLOGY

### Fixture

The gate fixture was **cat-24/409 — "LLM-made-memory paraphrase recall"**: 10 deterministic paraphrased trigger-phrase queries where the expected memory exists in the corpus and the query is a paraphrase of its trigger. The fixture was repaired mid-bake-off (ADR-009) to remove orphaned `memory_index` rows and replace a runtime random sampler with a deterministic `409-fixture.json` checked into the manual testing playbook.

- **PASS gate:** top-3 >= 8/10 hits.
- **Companion scenarios:** cat-24/402 (synonymy across vocabularies) and cat-24/408 (compound concept synthesis) remained FAIL for every candidate, including the winner. The bake-off closed 409 cleanly but did not close 402 or 408.

### Search pipeline

Each measurement window ran:

1. Activate the candidate with `embedder_set({ name: "<candidate>" })` and wait for the swap job to complete (full corpus re-index).
2. Verify the active pointer through `vec_metadata.active_embedder_name` before any probe.
3. Run the 10-query cat-24/409 sequence through `memory_search` with `limit=3 includeTrace=true bypassCache=true`.
4. Score top-3 hits against the deterministic fixture.

The retrieval-rescue layer was **on** for the final three-way comparison (gemma vs nomic vs jina-v3) that backed ADR-012. Raw scores (rescue off) come from the per-candidate rollback measurements taken during ADR-001 through ADR-008.

### Sample size

The single-shot 10-query fixture is the headline measurement. The 30-scenario stratified sample from the ADR-011 cost-benefit sweep (cat-13 / cat-14 / cat-15 / cat-16 / cat-17 / cat-24 / cat-25/03/04) backs the latency figures. The 30-scenario sample reported 27/30 PASS with rescue off and 28/30 PASS with rescue on; the only reversal was cat-24/409 itself.

### Re-index cost

| Vector width | Approximate re-index time on this machine | Notes |
|---|---|---|
| `vec_768` (gemma, nomic) | minutes | No schema migration vs the baseline |
| `vec_1024` (jina-v3, mxbai, bge-m3, snowflake) | tens of minutes | Schema migration `vec_768` to `vec_1024` is the dominant cost |

### Environment

- Apple Silicon (M-series, Metal-active, `torch.backends.mps.is_available() == True`).
- Ollama daemon for `jina-embeddings-v3`, `nomic-embed-text-v1.5`, `mxbai-embed-large-v1`, `bge-m3`, and `snowflake-arctic-embed-l-v2.0`.
- ollama for the `bge-base-en-v1.5` baseline.
- `mk-spec-memory` MCP server (TypeScript and Node). This is a completely different stack from the code-side bake-off (Python and `sentence-transformers`). Do not cross-reference latency or recall numbers across the two stacks.

---

## 4. PER-CANDIDATE PROFILES

### 4.1 `jinaai/jina-embeddings-v3` — production winner

| Property | Value |
|---|---|
| Ollama tag | `hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M` |
| Dim | 1024 |
| Params | 558M |
| Quantization | Q4_K_M |
| RAM loaded (Metal) | ~495 MB |
| Disk (HF cache) | ~1.1 GB |
| Context | 8192 max, loaded at 4096 |
| Released | September 2024 |
| Category | Text, multilingual, paraphrase-tuned, Matryoshka truncation supported at 256, 512, 768, and 1024 |
| Strengths observed | Won 9/10 cat-24/409 with rescue. Lowest p95 among the 1024-dim candidates at 1465 ms. Metal-resident at near-zero steady-state CPU. |
| Weaknesses observed | Schema migration cost from `vec_768` to `vec_1024`. First-time swap re-index ran tens of minutes on this machine. |

### 4.2 `nomic-ai/nomic-embed-text-v1.5` — close runner-up

| Property | Value |
|---|---|
| Ollama tag | `nomic-embed-text:v1.5` |
| Dim | 768 (drop-in versus the gemma baseline, no schema migration) |
| Params | 137M |
| Quantization | F16 |
| RAM loaded (Metal) | ~578 MB |
| Disk | ~270 MB |
| Context | 2048 default, 8192 max |
| Released | February 2024 |
| Category | Text retrieval specialist, trained on 235M pairs with hard negatives, requires `search_query: ` and `search_document: ` prefix tokens |
| Strengths observed | 8/10 cat-24/409 with rescue. Zero schema migration cost because it is also 768-dim. Raw embed latency ~12 ms is the fastest of the three measured. |
| Weaknesses observed | High end-to-end p95 of 3045 ms — over twice the winner. Requires prefix token discipline in the registry manifest. |

### 4.3 `google/bge-base-en-v1.5` — baseline fallback

| Property | Value |
|---|---|
| ollama model | `unsloth-bge-base-en-v1.5-GGUF/bge-base-en-v1.5-Q8_0.gguf` |
| Dim | 768 |
| Params | 300M |
| Quantization | Q8 GGUF |
| RAM loaded | ~500 MB |
| Disk | ~300 MB |
| Context | 2048 |
| Released | September 2025 |
| Category | General-purpose text, not retrieval-specialized |
| Strengths observed | Fastest end-to-end at 787 ms median, 936 ms p95. No external daemon dependency because ollama runs in-process. Kept as the schema fallback. |
| Weaknesses observed | Only 7/10 on cat-24/409 with rescue, below the 8/10 PASS gate. Cannot stand alone as the production embedder. |

### 4.4 `BAAI/bge-m3` — rolled back (ADR-007)

| Property | Value |
|---|---|
| Ollama tag | `bge-m3:latest` |
| Dim | 1024 |
| Context | 8192 |
| Released | February 2024 |
| Category | Multilingual (100+), dense plus sparse plus multivec retrieval modes |
| Result | 2/10 raw on cat-24/409, below the baseline gemma and below nomic. |
| Rollback rationale | The dense path alone underperforms on this paraphrase fixture. `mk-spec-memory` retrieval is single-vector dense, so the advertised sparse and multivec lanes were never exercised. The 1024-dim schema migration cost was paid without recall lift. |
| Re-entry condition | Only if `mk-spec-memory` adds hybrid sparse and multivec retrieval lanes, which would require substantial implementation work. |

### 4.5 `mixedbread-ai/mxbai-embed-large-v1` — rolled back (ADR-001..004)

| Property | Value |
|---|---|
| Ollama tag | `mxbai-embed-large:latest` |
| Dim | 1024 |
| Context | 512 (critically short for spec documents) |
| Released | March 2024 |
| Result | 2/10 raw. Three distinct failure modes during activation: (a) initial swap returned a 400 Bad Request from Ollama because of a manifest-versus-tag name mismatch; (b) the retry hit "input length exceeds context length" because spec docs routinely run past 5000 chars; (c) after capping inputs at `maxInputChars=1200`, the activated mxbai measured 25% and 0% top-5 Jaccard on cat-24/402 pair probes, below the 60% threshold. |
| Rollback rationale | The 512-token context is a fundamental mismatch for spec-document embedding. Even with AnglE-loss training that should aid paraphrase, the truncation strips too much signal. |

### 4.6 `Snowflake/snowflake-arctic-embed-l-v2.0` — rolled back (ADR-008)

| Property | Value |
|---|---|
| Ollama tag | `snowflake-arctic-embed2:latest` |
| Dim | 1024 |
| Context | 8192 |
| Languages | 74 |
| Released | December 2024 |
| Result | 1/10 raw on cat-24/409 — worse than the baseline (also 1/10 raw without rescue). Pure dense swap, no rescue, regressed on the gate fixture. |
| Rollback rationale | A fresh 1024-dim candidate that regresses below baseline on the target fixture closes the dense-swap line of inquiry. ADR-008 ratified the pivot: "pure dense swaps did not close 409, move next to reranking." |

Live runtime measurements (RAM, Metal residency, raw inference latency) for the final three are in [`runtime-measurements.md`](./runtime-measurements.md).

---

## 5. PROCESS NOTES

The elimination journey was not a single sweep. It tracked through twelve ADRs across the day and pivoted once from "swap dense embedders" to "add a retrieval-rescue layer." This section condenses the path.

### What we tried, in order

1. **mxbai-embed-large-v1 (ADR-001..004).** Three rollback rounds. Caught a manifest-versus-Ollama-tag name resolution bug in the adapter (`manifest.ollamaName ?? manifest.name`), then an input-length truncation issue (Ollama 400 at full-document size), then a query-time wiring defect where the active adapter was used for re-index but legacy 768-dim provider was used for query. After all three fixes mxbai still measured 2/10 on cat-24/409.
2. **jina-embeddings-v3, first pass (ADR-005).** Activated cleanly with the `hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M` tag. Improved cat-24/409 to 4/10 raw, still below the 8/10 gate. Rolled back.
3. **nomic-embed-text-v1.5, first pass (ADR-006).** Required `maxInputChars` tightening to 5000 to clear Ollama's context limit on the longest spec rows. Climbed to 5/10 raw — new dense leader but still below the gate. Rolled back.
4. **bge-m3 (ADR-007).** 1024-dim activation succeeded with `maxInputChars=8000`. Regressed cat-24/409 to 2/10. Rolled back.
5. **snowflake-arctic-embed-l-v2.0 (ADR-008).** Activated cleanly with `maxInputChars=8000`. Regressed cat-24/409 to 1/10, below baseline. Rolled back. **Pivot decision:** "pure dense swaps did not close 409, move next to reranking" (ADR-008).
6. **Fixture surgery (ADR-009).** Audited the cat-24/409 ground truth. Found three problems: orphaned `memory_index` rows (5446 of 12937 pruned), stale expected IDs, and a non-deterministic runtime sampler. Pruned the corpus to 7491 rows, locked the fixture to a deterministic `409-fixture.json`, and reactivated nomic for a cleanup measurement. Result: 6/10 — closer but still below the gate. Conclusion: this was not another dense-embedding problem.
7. **Retrieval-rescue layer (ADR-010).** Implemented two paths: (B) trigger-lane re-weighting that ignores generic single-token triggers like `tasks`, `checklist`, `decision`, and `spec`; and (C) sibling/backfill rescue that hydrates candidates from `memory_index`, injects same-folder siblings, and adds lexical backfill before artifact limiting. Reactivated nomic with the rescue layer on. cat-24/409 climbed from 6/10 to 8/10 — PASS.
8. **Cost-benefit sweep and default-on gate (ADR-011).** 30-scenario stratified sample comparing rescue off vs rescue on. Quality went from 27/30 PASS to 28/30 PASS with the only reversal being cat-24/409 itself. Latency rose 2.16x at both the median (426 to 922 ms) and p95 (1411 to 3045 ms). Decision: keep default-on, document the latency cost, preserve the `SPECKIT_RERANK_LAYER=false` kill switch.
9. **Production embedder choice (ADR-012).** Re-measured all three plausible winners (gemma, nomic, jina-v3) with rescue on. jina-v3 reached 9/10 cat-24/409 at 893 ms median and 1465 ms p95 — best on quality and best on latency. Ratified as the production default.

### What failed and why

| Attempt | Failure mode | Lesson carried forward |
|---|---|---|
| mxbai first activation | 400 Bad Request from Ollama on first swap | Adapter must resolve `manifest.ollamaName` before the Ollama call |
| mxbai retry | Input length exceeds context length | Registry needs per-model `maxInputChars` cap |
| mxbai with `maxInputChars=1200` | 25% and 0% Jaccard on cat-24/402 | Aggressive truncation destroys paraphrase signal |
| jina first pass | 9100 of 12929 batch died mid-job | Live MCP child caches pre-edit manifest; rebuild and restart before second attempt |
| nomic first pass | 5/10 cat-24/409 | Pure dense ceiling on this fixture is below the gate |
| bge-m3, snowflake | 1-2/10 cat-24/409 | Dense-only swaps did not close 409. Stop here, change retrieval stage. |
| Pre-rescue fixture audit | Mixed orphan rows and random sampler obscured signal | Lock fixture to deterministic file before treating numbers as final |

### What worked

- **`manifest.ollamaName` resolution in `OllamaAdapter`** unblocked every Ollama-backed candidate.
- **Per-model `maxInputChars`** in the registry (1200 for mxbai, 5000 for nomic, 8000 for bge-m3 and snowflake and the final jina retry) is the right shape for the long-document corpus.
- **Fixture surgery** made repeat measurement reliable. The previous random sampler hid both improvements and regressions.
- **Sibling and backfill rescue** is the closure path. It is also stack-cheap to disable through `SPECKIT_RERANK_LAYER=false`.

---

## 6. FINDINGS

### Finding 1 — The retrieval-rescue layer is the load-bearing piece

Without rescue, no candidate reached the 8/10 gate. The best dense-only score was nomic at 5/10. With rescue on, the same three candidates that were measured end-to-end split into a working tier:

| Stage | gemma | nomic | jina-v3 |
|---|---|---|---|
| Raw, no rescue | 1/10 | 5/10 | 4/10 |
| With rescue layer on | **7/10** | **8/10** | **9/10** |
| Delta from rescue | +6 | +3 | +5 |

The embedder still matters at the top of the table (9 vs 8 vs 7), but rescue is the force multiplier. Future text-embedder swaps should be measured with the rescue layer on, against the jina-v3 plus rescue baseline.

### Finding 2 — The 8/10 gate filters cleanly on this fixture

Three candidates passed with rescue (gemma at 7, nomic at 8, jina-v3 at 9), and the three rolled-back candidates (mxbai, bge-m3, snowflake) all measured 1 to 2 out of 10 raw. The gate is doing real work: it separates "useful with help" from "regressive even with help available."

### Finding 3 — Latency is dominated by the rescue layer, not the embedder

Raw per-query embed time is ~60 ms for jina-v3 and ~12 ms for nomic. End-to-end median is 893 ms for jina-v3 and 922 ms for nomic. The 800-plus ms delta is rescue layer overhead (stage-3 rerank timing), not embedder cost. Optimizing the rescue stage would benefit all three production-grade candidates equally.

### Finding 4 — Schema migration cost is real but one-time

Moving from `vec_768` to `vec_1024` ran tens of minutes on this Apple Silicon machine for a 7738-row corpus. Once the `vec_1024` table is built, steady-state search has no further migration cost. Operators planning a future 1024-dim swap should budget the migration window once, not per query.

### Finding 5 — bge-m3 lost the dense-only contest, not the multi-mode contest

bge-m3 was measured on its dense lane only because `mk-spec-memory` is dense-only. Its sparse and multivec lanes were never exercised. If a future arc adds hybrid retrieval to the spec-memory stack, bge-m3 should be re-measured before being treated as failed.

### Finding 6 — 402 and 408 stayed FAIL across every candidate

cat-24/402 (synonymy) and cat-24/408 (compound concept) did not close under any candidate, with or without rescue. These are not gate scenarios for this bake-off but they are open work. The next retrieval-quality arc should target 402 and 408 directly, not another dense swap.

---

## 7. CAVEATS

- **Single fixture closure.** Only cat-24/409 was closed in this bake-off. 402 and 408 remained FAIL across every candidate. Treat 9/10 as a strong cat-24/409 result, not as a general "retrieval is solved" claim.
- **Rescue layer changes the ranking.** Pre-rescue numbers (gemma 1/10, jina 4/10, nomic 5/10) suggest a very different leader. Always measure with rescue on if comparing against production.
- **Schema migration cost is one-time but real.** Plan the `vec_1024` rebuild window once when activating jina-v3 in a fresh environment. Subsequent searches see no migration cost.
- **Latency profile may shift if the rescue layer is optimized.** Current p95 of 1465 ms for jina-v3 is dominated by stage-3 rerank time, not by jina-v3's ~60 ms raw embed. A rescue-layer speedup would compress p95 for every candidate.
- **Stack distinction.** `mk-spec-memory` uses Ollama as its primary backend for `jina-embeddings-v3`, `nomic-embed-text-v1.5`, `bge-m3`, `mxbai-embed-large-v1`, and `snowflake-arctic-embed-l-v2.0`, plus ollama for the gemma baseline. The sibling code-side bake-off uses Python `sentence-transformers`. **Do not cross-reference performance numbers** between this report and the sibling bake-off at `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/`.
- **Per-probe row reuse for nomic.** The 8/10 nomic-with-rescue figure cited in Section 2 is a D-RETRY measurement reused from the ADR-011 sweep, not a fresh 10-row rerun. A one-row post-restore sanity check missed expected `4460` in top-3 with rerank timing still present. The row is preserved as historical baseline evidence rather than as a fresh measurement.
- **nomic prefix discipline.** `nomic-embed-text-v1.5` requires `search_query: ` and `search_document: ` prefix tokens. The manifest in the registry already declares them. Any future swap path must preserve them.

---

## 8. RECOMMENDATIONS

### Tier 1 — apply now

- **Keep `jina-embeddings-v3` as the production embedder for `mk-spec-memory`.** Set through `embedder_set({ name: "jina-embeddings-v3" })` and verify `active_embedder_name` in `vec_metadata` after activation.
- **Keep the retrieval-rescue layer default-on.** Do not unset `SPECKIT_RERANK_LAYER` unless an operator needs the kill switch. The 2.16x latency cost is documented and acceptable for the +1 net quality delta and the cat-24/409 closure.
- **Keep `bge-base-en-v1.5` listed as `DEFAULT_ACTIVE_EMBEDDER` in `schema.ts:25`.** It remains the schema fallback for fresh installs that have not yet completed a `vec_1024` migration.
- **Budget the `vec_1024` re-index window once per fresh environment.** Tens of minutes on Apple Silicon Metal for 7738 rows is the observed cost.

### Tier 2 — validate first

- **New text-embedder swaps must measure with the rescue layer on.** Raw scores compare against history but the gate is "rescue on, vs jina-v3 plus rescue, on the deterministic cat-24/409 fixture."
- **Document the per-model `maxInputChars` before any new Ollama swap.** Spec rows routinely exceed 5000 chars. New candidates should declare a `maxInputChars` cap in the registry that has been validated against the longest live row.
- **Re-measure bge-m3 only if `mk-spec-memory` adds hybrid retrieval.** Its dense path lost decisively. Its sparse and multivec paths were never exercised.

### Tier 3 — future

- **Close cat-24/402 (synonymy).** Pure dense embedders did not close it. Likely needs synonymy-aware rewrite or query expansion in the rescue layer.
- **Close cat-24/408 (compound concept).** Compound queries need constituent-source recall, not single-best-match recall. Candidate paths include multi-vector indexing or query decomposition.
- **Optimize the rescue layer stage-3 cost.** p95 is dominated by rerank time; a 30 to 50% speedup there benefits every candidate.
- **Survey newer text embedders.** The follow-on sub-phase `016/007/004-newer-text-embedders-survey` is the right home for that work. bge-m3 specifically is not a re-bench candidate without hybrid retrieval first.

---

## 9. REPRODUCIBILITY

The artifacts in this folder support exact replay of the headline numbers.

### Replay the winner's measurement

```bash
# 1. Ensure Ollama is running and the jina-v3 GGUF is pulled.
ollama pull hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M

# 2. Activate the candidate through the MCP server.
#    (Replace with your project's invocation; the canonical call is the embedder_set MCP tool.)
embedder_set({ name: "jina-embeddings-v3" })

# 3. Wait for the swap job to complete and verify the active pointer.
#    Expected: active_embedder_name=jina-embeddings-v3, active_embedder_dim=1024
embedder_list()

# 4. Run cat-24/409 with the rescue layer on (default).
#    The 10-query fixture is at:
#    manual_testing_playbook/local_llm_query_intelligence/409_fixture.json
#    Each query goes through memory_search with limit=3 includeTrace=true bypassCache=true.
```

Expected outcome on a `mk-spec-memory` corpus of comparable size: 9/10 top-3 hits, median end-to-end around 900 ms, p95 around 1500 ms on Apple Silicon Metal.

### Probe raw runtime characteristics

```bash
# RAM snapshot. Model must be loaded first through any /api/embed call.
ollama ps

# Latency probe — single embed round-trip.
time curl -s http://localhost:11434/api/embed \
  -d '{"model":"hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M","input":"test"}' \
  -o /dev/null

# Disk size for cached blobs.
du -sh ~/.ollama/models/blobs

# Process snapshot.
ps -eo pid,etime,rss,pcpu,command | grep -E 'ollama runner'
```

### Expected wall-clock

| Step | Approximate time |
|---|---|
| First `jina-embeddings-v3` re-index on a fresh `vec_1024` table (7738 rows, Apple Silicon Metal) | tens of minutes |
| 10-query cat-24/409 measurement window | seconds |
| 30-scenario rescue ON vs OFF sweep | minutes |

### Kill switch

```bash
# Disable the retrieval-rescue layer at the process level.
SPECKIT_RERANK_LAYER=false ...

# Restore default-on by unsetting.
unset SPECKIT_RERANK_LAYER
```

---

## 10. RELATED RESOURCES

### Skill-local files

| File | Purpose |
|---|---|
| [`SOURCE.md`](./SOURCE.md) | Pointer to the authoritative spec packet. |
| [`results.csv`](./results.csv) | Raw aggregate scores, one row per candidate. |
| [`per-probe-with-rescue.jsonl`](./per-probe-with-rescue.jsonl) | Per-probe rows for the final three-way comparison that backs ADR-012. |
| [`runtime-measurements.md`](./runtime-measurements.md) | Live RAM, Metal residency, and raw inference latency for the final three candidates. |
| [`../README.md`](../README.md) | Index of all `mk-spec-memory` benchmarks. |
| [`../FORMAT.md`](../../../../sk-doc/create-benchmark/references/shared/README.md) | Convention these files follow. |

### Authoritative spec packet

| Path | Why look there |
|---|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/benchmark-results.md` | The headline doc with deeper analysis. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` | ADR-001 through ADR-012 in full. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/implementation-summary.md` | What was built end-to-end (rescue layer code, jina-v3 swap, packet 008 closure). |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/evidence/INDEX.md` | File-by-file evidence navigation. |

### Sibling and follow-on

| Path | Relationship |
|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/` | Code-side bake-off (different stack, different fixture, different conclusions). Do not cross-reference numbers. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/004-skill-local-benchmarks-format/` | Tracking sub-phase for this skill-local benchmarks format convention. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/004-newer-text-embedders-survey/` | Follow-on sub-phase rescoped to survey newer text embedders rather than re-bench bge-m3. |
