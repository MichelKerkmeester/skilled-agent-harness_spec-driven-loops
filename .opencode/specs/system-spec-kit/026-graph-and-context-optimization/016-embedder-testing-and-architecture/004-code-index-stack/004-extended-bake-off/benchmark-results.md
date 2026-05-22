---
title: "Benchmark Results: 4-candidate Embedder Bake-Off with hybrid+rerank defaults on (PARTIALLY INVALIDATED — see Erratum)"
description: "Detailed retrieval evaluation of jina-code, gemma, nomic-CodeRankEmbed, bge-code-v1, and stella against the 18-pair code-retrieval fixture, with hybrid (FTS5+vector RRF) and cross-encoder rerank enabled by default. Headline as recorded: bge-code-v1 wins 11/18 = 61.1%. ERRATUM 2026-05-18 evening: rerank was NOT firing in this bench because pipx daemon lacked the reranker module; see Section 0 + 016/007/003/pre-confirmation-margin-analysis.md."
trigger_phrases:
  - "bge-code-v1 benchmark"
  - "embedder bake-off results"
  - "hybrid rerank benchmark"
  - "stella xformers failure"
  - "016/004/004 results"
  - "May 18 benchmark erratum"
  - "rerank not firing baseline"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Benchmark Results: 4-candidate Code-Embedder Bake-Off (hybrid+rerank on)

<!-- ANCHOR:erratum -->
## 0. ERRATUM (added 2026-05-18 evening)

**The "hybrid+rerank ON" claim in this report is partially invalidated for the May 18 morning bench.** Cross-encoder rerank was NOT firing during the original measurements because the pipx-installed `cocoindex-code` at `~/.local/pipx/venvs/cocoindex-code/` was a non-editable May 7 copy that did not contain the `reranker.py`, `fts_index.py`, `fusion.py`, or `registered_embedders.py` modules. The bench harness invoked `ccc` from PATH which resolved to the stale pipx, so the rerank code path was effectively dead.

What this report ACTUALLY measured: pure vector retrieval against the chunk-1500/overlap-200 + RRF (without FTS5 sparse) + NO-rerank stack. The bge-code-v1 win at 11/18 = 61.1% was real, but the "+2 pairs via hybrid+rerank" framing is structurally wrong.

The instrumented evening re-bench (single candidate, after install hygiene fix) found bge-code-v1 drops to **10/18 = 55.6%** with rerank actually firing, AND all 4 previously-unique-win probes flip to MISSES with margins < 0.05. The rerank — when it fires — exhibits a systematic failure mode (tests / refs / .ts source outrank implementations / dist / integration tests on paraphrase-heavy queries).

**For the corrected numbers + a full 4-candidate re-baseline**, see:
- `../../007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md` — the invalidation finding + per-probe margin analysis
- `../../005-cross-cutting-quality/005-cocoindex-install-hygiene/` — the pipx editable + harness CCC-pinning fix that makes future bench runs production-truthful
- `../../007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/` (rescoped) — the planned 4-candidate re-baseline using the corrected pipeline

The rest of this doc (Sections 1-12) is preserved as historical record of what was measured at the time. Treat the numbers as "pure-vector + RRF-no-FTS5 + NO-rerank" results, not "hybrid+rerank ON" — and prefer the rescoped 007/003 packet for the production decision.
<!-- /ANCHOR:erratum -->

---

<!-- ANCHOR:headline -->
## 1. Headline (as originally measured — see Section 0 Erratum)

**`BAAI/bge-code-v1` wins both accuracy and latency.** 11/18 hits = 61.1%, +2 pairs (+11.1pp) over the 3-way tie at 9/18 = 50.0% held by jina-code, gemma-300m, and nomic-CodeRankEmbed. It is also ~2× faster at the median (504ms vs ~1000-1200ms).

Stella was skipped — its custom attention layer hard-requires `xformers`, which has no usable Apple Silicon build path.

| Embedder | Dim | Hit rate | Easy / Med / Hard | Median ms | p95 ms | Mean ms |
|---|---|---|---|---|---|---|
| **BAAI/bge-code-v1** ← winner | 768 | **11/18 = 61.1%** | **3 / 5 / 3** | **504** | 4974 | **765** |
| jinaai/jina-v2-base-code (default) | 768 | 9/18 = 50.0% | 3 / 4 / 2 | 1002 | 7305 | 1376 |
| google/embeddinggemma-300m | 768 | 9/18 = 50.0% | 3 / 4 / 2 | 947 | 18848 | 1989 |
| nomic-ai/CodeRankEmbed | 768 | 9/18 = 50.0% | 3 / 4 / 2 | 1204 | 2027 | 1253 |
| dunzhang/stella_en_400M_v5 | 1024 | SKIPPED | — | — | — | — |

Easy = 5 probes, Medium = 7 probes, Hard = 6 probes (totals: 5+7+6 = 18).
<!-- /ANCHOR:headline -->

<!-- ANCHOR:methodology -->
## 2. Methodology

### Fixture
- File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/002-baseline-fixture/evidence/code-retrieval-fixture.json`
- 18 pairs of `(natural-language query, expected_source_path)`
- Difficulty distribution: 5 easy / 7 medium / 6 hard
- Each query is paraphrased intent — not a code-token search. The fixture is designed to stress semantic understanding rather than lexical matching.

### Harness
- Script: `evidence/run-extended-bake-off-with-hybrid-rerank.sh`
- Per candidate the harness runs: pre-pull → `ccc reset --force` → `ccc index` → 18 × `ccc search "<query>" --limit 5` → CSV/JSONL emission → next candidate.
- Hit semantics: top-5 hit (the expected path appears anywhere in the first 5 results returned by `ccc search`), with mirror-tree path normalization (`.opencode/.claude/.codex/.gemini/` prefixes collapsed) and line-range suffixes (`:NN-MM`) stripped.
- Latency timer wraps the `ccc search` subprocess, so it includes daemon-side embedding + FTS5 + RRF fusion + reranker scoring.

### CocoIndex configuration
All candidates ran with the same retrieval stack, defaults flipped on in this session:

```
COCOINDEX_CHUNK_SIZE=1500          (was 1000 before 016/011)
COCOINDEX_CHUNK_OVERLAP=200        (was 150 before 016/011)
COCOINDEX_HYBRID=true              (was false → flipped to True default)
COCOINDEX_HYBRID_VECTOR_WEIGHT=0.7
COCOINDEX_HYBRID_FTS5_WEIGHT=0.7
COCOINDEX_HYBRID_RRF_K=60
COCOINDEX_RERANK=true              (was false → flipped to True default)
COCOINDEX_RERANK_MODEL=BAAI/bge-reranker-v2-m3   (swapped from Alibaba GTE multilingual; GTE silently fails on Apple Silicon MPS)
COCOINDEX_RERANK_TOP_K=20
```

Embedder pool size after re-index (per `.cocoindex_code/target_sqlite.db`):
- jina-code: 18,847 chunks
- gemma-300m: 18,847 chunks
- nomic-CodeRankEmbed: 18,847 chunks
- bge-code-v1: 18,847 chunks

### Environment
- Hardware: Apple Silicon (MPS backend)
- sentence-transformers 5.4.1, transformers 5.8.0, torch 2.11.0
- Reranker: cross-encoder `BAAI/bge-reranker-v2-m3` (verified end-to-end during validation; swapped after discovering GTE-multilingual silently fails on MPS via `AcceleratorError` caught by `reranker.py`'s try/except)
<!-- /ANCHOR:methodology -->

<!-- ANCHOR:embedder-profiles -->
## 3. Embedder Profiles

### 3.1 `BAAI/bge-code-v1` — winner

| Property | Value |
|---|---|
| HuggingFace | `BAAI/bge-code-v1` |
| Dim | 768 (no schema migration vs default) |
| Approx. RAM (loaded) | ~700 MB |
| Approx. disk (cache) | ~340 MB |
| Category | code-tuned |
| MPS compatible | Yes |
| Origin | BAAI (Beijing Academy of Artificial Intelligence) |
| Design intent | Multilingual code retrieval; trained on code-NL pairs across Python/JS/Java/Go/C++/etc. |
| Strengths observed | Best accuracy + lowest latency in this run. Picks up 4 unique hits the others miss (probes 3, 10, 14, 18). |
| Weaknesses observed | Loses probes 5 + 8 that the others hit — narrow miss on tests + readiness probe queries. |

### 3.2 `jinaai/jina-embeddings-v2-base-code` — current default

| Property | Value |
|---|---|
| HuggingFace | `jinaai/jina-embeddings-v2-base-code` |
| Dim | 768 |
| Approx. RAM (loaded) | ~600 MB |
| Approx. disk (cache) | ~280 MB |
| Category | code-tuned |
| MPS compatible | Yes |
| Origin | Jina AI |
| Design intent | Code-tuned over Python/JS/Go/Java/Ruby/PHP. 8192-token context window. |
| Strengths observed | Reliable middle-of-pack performer. Picks up probes 5 + 8 that bge-code misses. |
| Weaknesses observed | ~2× the median latency of bge-code-v1 (1002ms vs 504ms). |

### 3.3 `google/embeddinggemma-300m` — text-baseline reference

| Property | Value |
|---|---|
| HuggingFace | `google/embeddinggemma-300m` |
| Dim | 768 |
| Approx. RAM (loaded) | ~600 MB |
| Approx. disk (cache) | ~300 MB |
| Category | general text (NOT code-tuned) |
| MPS compatible | Yes |
| Origin | Google |
| Design intent | General-purpose 300M text embedder, retained as a "what if we used a strong general-text model?" baseline. |
| Strengths observed | Matches the two code-tuned models at 9/18 — text-tuned doesn't penalize this fixture as much as one might expect. |
| Weaknesses observed | Worst tail latency (p95 = 18,848ms) — a single hard probe stalled at ~19s. Median is fine. |

### 3.4 `nomic-ai/CodeRankEmbed` — alternative code-tuned

| Property | Value |
|---|---|
| HuggingFace | `nomic-ai/CodeRankEmbed` |
| Dim | 768 |
| Approx. RAM (loaded) | ~550 MB |
| Approx. disk (cache) | ~270 MB |
| Category | code-tuned |
| MPS compatible | Yes |
| Origin | Nomic AI |
| Design intent | Code-tuned with Python-leaning training mix. Promoted as a CoIR-strong retrieval embedder. |
| Strengths observed | Tightest latency distribution — p95 is 2027ms, only ~1.7× the median. |
| Weaknesses observed | Tied with jina/gemma at 9/18; no unique probes won. |

### 3.5 `dunzhang/stella_en_400M_v5` — SKIPPED (xformers required)

| Property | Value |
|---|---|
| HuggingFace | `dunzhang/stella_en_400M_v5` |
| Dim | 1024 (would require schema migration via `vec_1024`) |
| Approx. RAM (loaded) | ~800 MB |
| Approx. disk (cache) | ~400 MB |
| Category | general text (MTEB-strong on text + code) |
| Failure mode | Model construction hard-asserts `xformers` for its custom `NewAttention` layer. xformers has no working Apple Silicon build path (it targets CUDA; MPS support has historically been unstable). `ccc index` hung indefinitely with 0% CPU after the daemon failed to construct the model. |
| Workaround attempted | None — installing xformers from source on macOS is non-trivial and historically flaky, and even when built, MPS support is partial. Marked `mps_compatible=True` in `registered_embedders.py` is misleading and should be corrected to `False` (xformers gate makes it MPS-incompatible in practice). |
<!-- /ANCHOR:embedder-profiles -->

<!-- ANCHOR:per-probe-matrix -->
## 4. Per-Probe Hit Matrix

`✓` = expected path landed in top-5 (mirror-normalized). `✗` = miss.

| # | Difficulty | jina | gemma | nomic | bge-code | Query (truncated) |
|---|---|---|---|---|---|---|
| 1 | easy | ✗ | ✗ | ✗ | ✗ | registry of available embedding backends with dimensions and model notes |
| 2 | easy | ✓ | ✓ | ✓ | ✓ | handler that accepts an embedder name and queues a reindex job |
| 3 | easy | ✗ | ✗ | ✗ | **✓** | CocoIndex configuration that chooses the default local code embedder |
| 4 | easy | ✓ | ✓ | ✓ | ✓ | shell validator for spec folders with strict mode and recursion |
| 5 | easy | ✓ | ✓ | ✓ | ✗ | Vitest coverage for code graph readiness snapshots and staleness |
| 6 | medium | ✗ | ✗ | ✗ | ✗ | construct an Ollama-backed embedder and apply query/document prompts |
| 7 | medium | ✓ | ✓ | ✓ | ✓ | single scoring stage where recency, graph, feedback, and rest combine |
| 8 | medium | ✓ | ✓ | ✓ | ✗ | readiness probe that checks whether the semantic code index is fresh |
| 9 | medium | ✓ | ✓ | ✓ | ✓ | declarative list of vetted sentence transformer candidates for code |
| 10 | medium | ✗ | ✗ | ✗ | **✓** | context save command that reads structured JSON and refreshes graph |
| 11 | hard | ✗ | ✗ | ✗ | ✗ | Apple Silicon device fallback that prefers Metal when CUDA is absent |
| 12 | hard | ✗ | ✗ | ✗ | ✗ | paraphrase recovery path that promotes sibling memory artifacts |
| 13 | hard | ✓ | ✓ | ✓ | ✓ | bounded token budget allocation for assembling structural context |
| 14 | hard | ✗ | ✗ | ✗ | **✓** | filesystem walker that emits typed structural symbols and imports |
| 15 | hard | ✗ | ✗ | ✗ | ✗ | query-time path class adjustment that favors implementation paths |
| 16 | medium | ✓ | ✓ | ✓ | ✓ | atomic readiness marker persistence tested for partial writes |
| 17 | hard | ✓ | ✓ | ✓ | ✓ | file matcher that lets explicitly canonical skill resources through |
| 18 | medium | ✗ | ✗ | ✗ | **✓** | integration test for reprocessing only changed files during refresh |
| **Total** | | 9 | 9 | 9 | **11** | |

bge-code-v1's 4 unique wins are bold. Its 2 unique losses (probes 5, 8) are plain ✗ in the bge column while others hit.
<!-- /ANCHOR:per-probe-matrix -->

<!-- ANCHOR:latency-analysis -->
## 5. Latency Analysis

Percentiles computed across 18 probes per candidate. Latency includes embedder forward pass + FTS5 query + RRF fusion + cross-encoder reranker on top-20 → top-5 narrowing.

| Embedder | min | p25 | median | p75 | p95 | max | mean |
|---|---|---|---|---|---|---|---|
| **bge-code-v1** | **429** | **486** | **504** | **555** | 4974 | 4974 | **765** |
| jina-code | 800 | 884 | 1002 | 1218 | 7305 | 7305 | 1376 |
| gemma-300m | 767 | 833 | 947 | 1132 | 18848 | 18848 | 1989 |
| nomic-CodeRankEmbed | 808 | 1013 | 1204 | 1484 | 2027 | 2027 | 1253 |

(All values in milliseconds.)

Observations:
- **bge-code-v1 has the tightest core distribution.** The min/p25/median/p75 sit within a 130ms window (429-555). The p95 spike to 4974ms is one single probe — the only outlier.
- **gemma's p95 (18.8s) is a deal-breaker for interactive use.** One probe stalled near the 30s probe timeout; user-facing search expects sub-2s.
- **nomic has the best tail / median ratio** (2027/1204 ≈ 1.68×) — most predictable.
- **Mean ≪ p95 for every candidate** — the 18-pair fixture is small enough that one outlier dominates p95. Take p95 with caution at this sample size.
<!-- /ANCHOR:latency-analysis -->

<!-- ANCHOR:unique-wins -->
## 6. bge-code-v1's 4 Unique Wins

These are the probes only bge-code-v1 hit — the source of its +2-pair lead.

### Probe 3 (easy)
- Query: `CocoIndex configuration that chooses the default local code embedder`
- Expected: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`
- Why it's interesting: the file's identifier `config.py` is generic. The query has to resolve "CocoIndex configuration" + "chooses the default local code embedder" → `_DEFAULT_MODEL = "sbert/jinaai/..."` semantically. bge-code-v1 connects "default local code embedder" to the `_DEFAULT_MODEL` constant; the others land on `registered_embedders.py` instead (close but not the configuration entry point).

### Probe 10 (medium)
- Query: `context save command that reads structured JSON and refreshes graph metadata`
- Expected: `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`
- Why it's interesting: the file is a built `.js` artifact in `dist/`. Other embedders likely surface the TypeScript source files (`src/memory/generate-context.ts`) which exist alongside it. bge-code-v1 prefers the actual command runtime — possibly because the script's CLI arg-parsing code chunks contain "structured JSON" + "refresh graph" tokens more densely.

### Probe 14 (hard)
- Query: `filesystem walker that emits typed structural symbols and imports`
- Expected: `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts`
- Why it's interesting: this is `structural-indexer.ts`, but the query says "filesystem walker" — the semantic bridge from `walker → indexer → emits typed structural symbols` is exactly what code-tuned multilingual training reinforces. The other three end up on `directory-walker.ts` or test files that have "walker" in the filename but no symbol-emission logic.

### Probe 18 (medium)
- Query: `integration test for reprocessing only changed files during refresh`
- Expected: `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py`
- Why it's interesting: this is a Python integration test that other embedders likely don't surface for an English-phrased query. bge-code-v1's multilingual training (Python + JS + Java + Go etc.) appears to pay off when the test file is the target.
<!-- /ANCHOR:unique-wins -->

<!-- ANCHOR:floor-and-ceiling -->
## 7. Universal Floor + Ceiling

### Probes hit by ALL 4 (universal floor — easy wins for the stack)

7 probes (2, 4, 7, 9, 13, 16, 17) — the hybrid+rerank stack reliably surfaces these regardless of embedder choice. These are queries where either:
- The expected file has lexical tokens that hit FTS5 directly, OR
- The semantic match is so strong that any 768d code-aware embedding lands it

### Probes missed by ALL 4 (universal ceiling — stack failures)

5 probes (1, 6, 11, 12, 15). These are the queries where no embedder + hybrid + rerank combination found the expected file in top-5. They define the **stack-level retrieval ceiling** for this fixture.

| # | Difficulty | Query | Expected |
|---|---|---|---|
| 1 | easy | `registry of available embedding backends with dimensions and model notes` | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` |
| 6 | medium | `construct an Ollama-backed embedder and apply query/document prompts` | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts` |
| 11 | hard | `Apple Silicon device fallback that prefers Metal when CUDA is absent` | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` |
| 12 | hard | `paraphrase recovery path that promotes sibling memory artifacts` | `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts` |
| 15 | hard | `query-time path class adjustment that favors implementation paths` | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` |

Probe 1 is striking — an "easy" fixture entry missed by all four. The expected file `registry.ts` exists, but its contents are dominated by `MANIFESTS` array entries and type aliases. None of the four embedders bridge "registry" + "embedding backends with dimensions and model notes" → that file. Suspected cause: the `MANIFESTS` chunks all rank lower than the `MANIFESTS` chunks in `registered_embedders.py` because the Python file is denser in matching tokens.

This is a **fixture limitation hint**: hard ceiling probes may be revealing fixture-vs-corpus mismatches as much as embedder weakness. Worth re-evaluating the expected paths during the next fixture refresh.
<!-- /ANCHOR:floor-and-ceiling -->

<!-- ANCHOR:stella-failure -->
## 8. Stella Failure Analysis (xformers)

### What happened
At `pre-pull` for stella, `SentenceTransformer('dunzhang/stella_en_400M_v5', trust_remote_code=True)` triggers stella's custom `modeling.py` which routes attention construction through `NEW_ATTENTION_CLASSES`. Inside:

```python
# modeling.py:451
assert self.memory_efficient_attention is not None, 'please install xformers'
```

`memory_efficient_attention` is set by importing `xformers.ops`. Without xformers, model construction crashes with `AssertionError: please install xformers`.

The bench harness's `pre_pull` check was insufficient — it inspects only the last line of output. The traceback's last informative line is the `AssertionError`, but it's followed by Python's exit-message line, so the harness wrongly logged `pre-pull done` and proceeded.

`ccc index` then attempted the same model load inside the daemon, which hung indefinitely (no timeout in the indexing path). Killed manually after 25 minutes wall-time at 0% CPU.

### Why xformers won't work
- **xformers ships pre-built wheels for CUDA only.** macOS install requires source build with `nvcc` not present.
- **Even with a successful Apple Silicon source build, MPS support in xformers is partial.** The `memory_efficient_attention` op routes to a CUDA kernel by default; MPS fallback is incomplete.
- **Trying = high-risk for low reward.** stella is a general-text embedder; the 4 code-tuned candidates we did measure already span the relevant capability axes.

### Metadata correction needed
`registered_embedders.py:118` lists stella as `mps_compatible=True`. This is misleading — `mps_compatible` should reflect whether the model can actually run on MPS in our environment, not whether PyTorch's MPS backend supports the model abstractly. **Recommend changing to `False` with a `notes:` clarification: "Custom attention requires xformers; not viable on Apple Silicon."**

### Operator action
- For Apple Silicon users: stella is effectively non-functional. Suppress it from the listed candidates or gate the registry entry with a `requires_xformers=True` flag and a CLI warning.
- For CUDA users with xformers installed: stella may work, but was not measured here.
<!-- /ANCHOR:stella-failure -->

<!-- ANCHOR:caveats -->
## 9. Caveats

### Single-run signal
- **One run per candidate.** Per the lessons from `113/005-extraction-rerun` (memory: `project_116_confirmation_rcaf_holds`), single-sample wins under ~2% on the fixture are noise-floor.
- bge-code-v1's 11.1pp lead is well above the noise floor, BUT — only 4 unique probes account for the entire gap. If any of those 4 are fragile to retry variance, the lead could shrink.
- **Recommend a 3-run confirmation** before promoting bge-code-v1 as the new default. Variance comes from: cross-encoder reranker non-determinism if `torch.use_deterministic_algorithms(True)` isn't set; tokenizer order under multi-threaded BPE; LMDB read order.

### Stack-level confound
- All 4 candidates ran with the same hybrid+rerank stack. The +2pp lift from bge-code-v1 is on top of an already-uplifted baseline. We do not measure bge-code-v1 against the pre-016/011 stack (chunk 1000/150, no FTS5, no rerank).
- The 50% three-way tie is partly the reranker working: the BGE cross-encoder reorders the top-20 RRF candidates, and 3 different vector spaces converge on the same top-5 after reranking. The reranker is doing more lift than vector choice on those 9 probes.

### Fixture limitations
- 18 pairs is small for stable percentile estimates. p95 is dominated by single outliers (probe 5 for jina at 7305ms; probe 8 for gemma at 18848ms).
- The 5-probe universal ceiling suggests the fixture has at least 2 entries (probes 1, 11) where the expected path may not be the actually most-relevant answer for the query.
- Mirror-tree normalization is generous — it counts `.gemini/skills/.../X.py` as a hit for `.opencode/skills/.../X.py`. This is correct for our 4-way mirror setup but inflates hit rates vs a single-mirror codebase.

### Cross-encoder reranker model lock-in
- Results are valid for the `BAAI/bge-reranker-v2-m3` reranker. The original default was `Alibaba-NLP/gte-multilingual-reranker-base`, which silently failed on MPS (caught + dropped by `reranker.py`'s try/except, so prior measurements with rerank-on are suspect).
- If the reranker is swapped again, all hit-rate numbers need re-measurement. The reranker contributes more lift than the embedder on this fixture.
<!-- /ANCHOR:caveats -->

<!-- ANCHOR:recommendations -->
## 10. Recommendations

### Tier 1 — Apply directly
1. **Fix stella metadata in `registered_embedders.py`.** Change `mps_compatible=True` → `False` and update `notes:` to flag the xformers requirement. (~2-line change.)
2. **Tighten the bench harness pre-pull check.** Current `tail -1 | grep -qi "error|fail"` misses mid-traceback assertions. Replace with: run pre-pull as a subprocess, check exit code, AND grep entire output for `AssertionError|ImportError|FileNotFoundError`.

### Tier 2 — Validate before applying
3. **Confirm bge-code-v1's lead with a 3-run replay** before promoting it as the new `_DEFAULT_MODEL` in `cocoindex_code/config.py`. If hit rate sits in 10/18-12/18 across runs, swap. If it drops to 9/18 on any run, hold at jina-code.
4. **Investigate the 5 universal-ceiling probes.** For each, manually verify the expected path is correct, then either fix the fixture or use the probes as a forcing function for further reranker tuning.

### Tier 3 — Future work
5. **Adapter benchmark.** The +1pp lift from chunk-size tuning + reranker swap is large enough that revisiting other adapter params (`hybrid_rrf_k`, vector vs FTS5 weights, rerank top-k) on a fresh 30-50 pair fixture would surface more lift.
6. **Add a CUDA-only test path.** Stella + SFR-Embedding-Code-2B-R both need GPU/RAM headroom + (in stella's case) xformers. A separate `cuda-bench` harness gated by host detection would unblock those measurements without polluting the Mac-default flow.
<!-- /ANCHOR:recommendations -->

<!-- ANCHOR:reproducibility -->
## 11. Reproducibility

### Files
- Harness: `evidence/run-extended-bake-off-with-hybrid-rerank.sh`
- Fixture: `../002-baseline-fixture/evidence/code-retrieval-fixture.json` (18 pairs)
- CSV: `evidence/cocoindex-embedder-comparison-with-hybrid-rerank.csv`
- JSONL (per-probe rows): `evidence/cocoindex-embedder-comparison-with-hybrid-rerank.jsonl` (72 rows = 4 embedders × 18 probes)
- Runlog: `evidence/runlog-with-hybrid-rerank.txt`

### Replay
```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

# Stop daemon + clear LMDB wedge state
pkill -KILL -f "ccc run-daemon" && rm -f .cocoindex_code/lock.mdb

# Run all 4 candidates with hybrid+rerank defaults on
bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh \
  sbert/jinaai/jina-embeddings-v2-base-code \
  sbert/google/embeddinggemma-300m \
  sbert/nomic-ai/CodeRankEmbed \
  sbert/BAAI/bge-code-v1
```
Expected wall: ~80-110 minutes total (pre-pull + reset + index + 18 probes × 4 candidates).

### Total wall-clock
Bench harness measured 3161s = 52 min for the 2-candidate resumed run (bge-code-v1 + stella attempt). Prior 3-candidate run (jina-code + gemma + nomic) was ~75 min — total measurement campaign = ~127 min.
<!-- /ANCHOR:reproducibility -->

<!-- ANCHOR:see-also -->
## 12. See Also

- `spec.md` — original packet scope (extended bake-off with nomic + stella). Note: the actual measurement scope expanded to all 4 reachable candidates after 016/011 shipped hybrid+rerank.
- `../004-code-index-stack/CHANGELOG.md` — plain-English changelog for the code-index-stack covering 016/011 features (chunking + hybrid + reranker) that produced the baseline this bench measured against.
- `evidence/cocoindex-embedder-comparison-extended.csv` — prior 3-candidate baseline (jina-code + gemma + nomic) without hybrid+rerank, for ΔΔ comparison.
- `registered_embedders.py:52-122` — embedder registry with RAM/disk/MPS metadata.
- `cocoindex_code/config.py:18,309,328` — config flags flipped this session: `_DEFAULT_RERANK_MODEL`, `hybrid_enabled`, `rerank_enabled`.
<!-- /ANCHOR:see-also -->
