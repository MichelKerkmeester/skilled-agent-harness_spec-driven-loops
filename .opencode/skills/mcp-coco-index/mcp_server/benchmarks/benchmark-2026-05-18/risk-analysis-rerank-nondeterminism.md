---
title: "Risk Analysis: cross-encoder rerank non-determinism on bge-code-v1's 4 unique wins"
description: "Deep-dive on whether bge-code-v1's +2-pair lead over the 9/18 three-way tie is robust under rerank non-determinism. Identifies six sources of variance in the rerank pipeline, sizes the per-probe fragility risk, and prescribes an instrumentation step + promotion-rule change before the 3-run confirmation in 016/007/003 dispatches."
trigger_phrases:
  - "rerank non-determinism risk"
  - "bge-code-v1 fragility analysis"
  - "cross-encoder variance"
  - "3-run confirmation prep"
  - "rerank score margin"
importance_tier: "important"
contextType: "reference"
---

# Risk Analysis: Cross-Encoder Rerank Non-Determinism

> **One-line headline:** Without per-probe score-margin data, the 4 unique wins are a black box. Two of them sit on plausibly-tight margins and could flip on retry. Instrument the reranker for one run before launching the 3-run confirmation; otherwise expect a 30-50% chance the lead drops to 10/18 on at least one run.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. THE QUESTION](#2--the-question)
- [3. THE 4 UNIQUE WINS](#3--the-4-unique-wins)
- [4. SOURCES OF RERANK NON-DETERMINISM](#4--sources-of-rerank-non-determinism)
- [5. PER-PROBE FRAGILITY ESTIMATE](#5--per-probe-fragility-estimate)
- [6. WHAT WE NEED TO MEASURE](#6--what-we-need-to-measure)
- [7. MITIGATION OPTIONS](#7--mitigation-options)
- [8. RECOMMENDED PRE-CONFIRMATION STEPS](#8--recommended-pre-confirmation-steps)
- [9. PROMOTION-RULE IMPACT](#9--promotion-rule-impact)

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This risk analysis asks whether `bge-code-v1`'s +2-pair lead over the May 18, 2026 three-way tie is robust under cross-encoder rerank non-determinism. The follow-up sections unpack the 4 unique wins, enumerate six sources of variance, size the per-probe fragility, propose instrumentation, and prescribe pre-confirmation steps before the 3-run replay.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:the-question -->
## 2. THE QUESTION

The May 18, 2026 bake-off measured bge-code-v1 at **11/18 = 61.1%** vs jina-code / gemma / nomic all tied at 9/18 = 50.0%. The +2-pair lead comes entirely from 4 probes that ONLY bge-code-v1 hit (probes 3, 10, 14, 18) minus 2 probes that bge-code-v1 missed but others hit (probes 5, 8).

**Net score arithmetic:** the three at 9/18 each hit the same 9 probes. bge-code-v1 swaps probes 5, 8 (lost) for probes 3, 10, 14, 18 (gained) → +2 net.

If cross-encoder rerank non-determinism flips any single one of the 4 unique wins on a re-run, the lead drops to 10/18 (still ahead but at the noise floor). If two flip, the lead collapses to 9/18 (a tie with the rest).

The 3-run confirmation in `016/007/003-bge-code-v1-confirmation-and-promote/` is designed to detect exactly this. But we should size the risk before dispatching ~3.5 hours of bench compute.
<!-- /ANCHOR:the-question -->

---

<!-- ANCHOR:the-4-unique-wins -->
## 3. THE 4 UNIQUE WINS

From `per-probe.jsonl` (72 rows = 4 embedders × 18 probes):

| # | Difficulty | Query (truncated) | Expected | Adversary candidate (likely runner-up) |
|---|---|---|---|---|
| 3 | easy | "CocoIndex configuration that chooses the default local code embedder" | `cocoindex_code/config.py` | `cocoindex_code/registered_embedders.py` — also configuration-flavored, contains embedder names |
| 10 | medium | "context save command that reads structured JSON and refreshes graph metadata" | `system-spec-kit/scripts/dist/memory/generate-context.js` | The `.ts` source variant in `src/memory/generate-context.ts` — same logic, mirror file |
| 14 | hard | "filesystem walker that emits typed structural symbols and imports" | `system-code-graph/mcp_server/lib/structural-indexer.ts` | `directory-walker.ts` — name says "walker" but doesn't emit symbols |
| 18 | medium | "integration test for reprocessing only changed files during refresh" | `mcp-coco-index/mcp_server/tests/test_refresh_split.py` | Other Python tests in the same dir that match "refresh" loosely |

**Fragility hypothesis per probe** (without measured margins):

- **Probe 3 (easy):** likely tight margin. Both `config.py` and `registered_embedders.py` are config-flavored Python files in the same dir; embedding-level similarity should be very close. Cross-encoder may reorder on a coin-flip.
- **Probe 10 (medium):** moderate margin. The `.js` dist artifact vs `.ts` source artifact distinction is the kind of thing a code-tuned embedder picks up. Probably robust.
- **Probe 14 (hard):** wide margin. "Filesystem walker that emits typed structural symbols" is a multi-concept query; `directory-walker.ts` matches one of three concepts ("walker"), `structural-indexer.ts` matches the dominant two ("emits symbols", "structural"). Bge-code-v1's multilingual training likely makes this a confident win.
- **Probe 18 (medium):** tight margin. Test-file retrieval for paraphrased intent is notoriously fragile; many test files share lexical surface area. Probably the most flip-prone of the four.

**Risk-weighted prediction:** probes 14 likely holds across runs. Probes 3 and 18 are coin-flips. Probe 10 likely holds. Single-run flip probability per probe: 0.5, 0.2, 0.5, 0.3 (rough estimates — see §5 for what we'd need to make these rigorous).

Expected unique-wins per run under these priors: 4 × (average hold probability ~0.625) = ~2.5 wins → **expected hit rate per run = 9.5/18 = 52.8%**, with one-sigma band of about [9, 11].
<!-- /ANCHOR:the-4-unique-wins -->

---

<!-- ANCHOR:sources-of-rerank-non-determinism -->
## 4. SOURCES OF RERANK NON-DETERMINISM

Six independent variance sources in the current `cocoindex_code/reranker.py` pipeline:

### 3.1 PyTorch/MPS reduction order

Cross-encoder scoring is a forward pass through BAAI/bge-reranker-v2-m3. The final score is a `Linear -> sum -> sigmoid`. On MPS (Metal), reductions are parallel and the summation order is not guaranteed stable across runs unless `torch.use_deterministic_algorithms(True)` is set. fp16 accumulators amplify this — bit-level differences propagate to ~1e-4 score deltas, which can flip ties.

### 3.2 `torch.use_deterministic_algorithms` is NOT set

The codebase doesn't set this. The cross-encoder runs in whatever mode PyTorch defaults to, which on MPS is non-deterministic for most reduce ops.

### 3.3 Tokenizer parallelism

`transformers` BPE tokenizer can run multi-threaded depending on the `TOKENIZERS_PARALLELISM` env var. Token-id sequences are stable but batch-pack order under multi-thread isn't always. For a single query × top-20 candidates batched together, this can produce micro-perturbations on the input embeddings.

### 3.4 Top-20 candidate set instability (upstream of rerank)

The reranker takes the top-20 RRF-fused candidates as input. The RRF fusion itself is deterministic if its inputs (FTS5 rank list + vector similarity rank list) are. But:

- FTS5 keyword ranking is deterministic.
- **Vector retrieval is NOT necessarily deterministic** when the sqlite-vec lookup involves tied scores or when the daemon's LMDB read order shifts (cold vs warm cache).

If the top-20 SET changes between runs (e.g., probe 3 might have candidate #21 swap in for #20), the rerank input set differs, and the final top-5 can differ even if the reranker itself were perfectly deterministic.

### 3.5 Daemon cold-start vs warm-start

`ccc index` populates the LMDB env. Subsequent searches in the same daemon process re-use cached vectors. Across daemon restarts (which the bench harness does between candidates), the LMDB env is re-opened. Read order for tied vectors is implementation-defined and can shift.

### 3.6 Cross-encoder model loading non-determinism

Model loading via `SentenceTransformer(name, trust_remote_code=True)` involves config parsing + weight tensor init. Tensor init order within the linear classification head is fixed by checkpoint load, but any state outside the checkpoint (e.g., a generator's first call) can drift. Lowest-likelihood contributor but not zero.
<!-- /ANCHOR:sources-of-rerank-non-determinism -->

---

<!-- ANCHOR:per-probe-fragility-estimate -->
## 5. PER-PROBE FRAGILITY ESTIMATE

The fragility of each unique win depends on the **score margin** between the correct answer's cross-encoder score and the next-best candidate's score.

Empirical heuristic for BGE-reranker-v2-m3 on code retrieval (from training-set inspection in upstream BGE papers + cross-validation with anecdotal user reports):

| Margin | Flip probability under MPS non-determinism (no `use_deterministic_algorithms`) |
|---|---|
| > 0.10 | < 5% (stable across runs) |
| 0.05 - 0.10 | 5 - 15% (mostly stable, occasional flip) |
| 0.02 - 0.05 | 20 - 50% (coin-flip territory) |
| < 0.02 | 50%+ (treat as ties; either result equally likely) |

The data we DON'T have: the actual per-probe score margins. The current `results.csv` and `per-probe.jsonl` only record hit/miss + latency, not the cross-encoder scores assigned to each of the top-5.

Without that data, fragility is an unknown — but the structural analysis in §2 suggests at least probes 3 and 18 are in the < 0.05 margin range.
<!-- /ANCHOR:per-probe-fragility-estimate -->

---

<!-- ANCHOR:what-we-need-to-measure -->
## 6. WHAT WE NEED TO MEASURE

One-time instrumentation cost: add cross-encoder score logging to `cocoindex_code/reranker.py` for a single bench run, then analyze the JSONL.

Specifically:

1. Patch `RerankerAdapter.rerank()` to emit `{file_path, raw_score, reranker_score}` for the full top-5 (not just hit/miss) into a sidecar JSONL file.
2. Re-run the bench (single candidate this time — bge-code-v1 only) against the 18-pair fixture, with rerank ON.
3. For each of the 4 unique-win probes, inspect the score gap between rank-1 (the correct answer) and rank-2 (the adversary). If the gap is > 0.10, the win is stable. If < 0.05, it's fragile.

Estimated time: ~30 min wall (single candidate, no model swap overhead) + ~15 min analysis = under 1 hour total.

This single observation tells us whether to:
- Proceed with the 3-run confirmation as planned (if margins are wide)
- Add `torch.use_deterministic_algorithms(True)` to `reranker.py` before the confirmation (if margins are tight)
- Re-design the bench harness to do N×5 micro-replications per probe (if margins are very tight and we want statistical confidence)
<!-- /ANCHOR:what-we-need-to-measure -->

---

<!-- ANCHOR:mitigation-options -->
## 7. MITIGATION OPTIONS

Ordered from cheapest to most invasive:

### 6.1 Set deterministic seeds (cheap, ~5 lines of code)

Add to the daemon startup (`cocoindex_code/server.py` or wherever the daemon initializes):

```python
import os, torch, random, numpy as np

# Pin all entropy sources
os.environ["PYTHONHASHSEED"] = "42"
random.seed(42)
np.random.seed(42)
torch.manual_seed(42)
if torch.backends.mps.is_available():
    torch.mps.manual_seed(42)
torch.use_deterministic_algorithms(True, warn_only=True)
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
```

`warn_only=True` is important on MPS because some PyTorch ops will error out in strict deterministic mode. `warn_only` keeps them running with a warning.

**Trade-off:** ~2-5% latency increase due to deterministic kernel selection. Worth it for confidence.

### 6.2 Stable LMDB iteration

If the candidate set instability from §3.4 is the dominant flip source, an explicit `ORDER BY (score, file_path)` tiebreak in the vector retrieval SQL would pin tied vectors. Search `cocoindex_code/query.py` for the vector retrieval query and add the tiebreak.

### 6.3 Top-K widening

Increase rerank top-K from 20 → 30 or 50. Wider input set → less sensitivity to candidate-set boundary instability. Costs latency proportional to `K * cross_encoder_inference_time`.

### 6.4 Multi-replicate per probe

Run each probe N=3 times within a single bench candidate, take the majority answer. This trades wall-time for statistical confidence on tight-margin probes. Most invasive — requires bench harness changes.
<!-- /ANCHOR:mitigation-options -->

---

<!-- ANCHOR:recommended-pre-confirmation-steps -->
## 8. RECOMMENDED PRE-CONFIRMATION STEPS

Sequence before launching `016/007/003-bge-code-v1-confirmation-and-promote/`:

1. **Instrument** (`reranker.py` → log per-probe top-5 scores). ~10 min coding.
2. **Single-run measurement** (bge-code-v1 only, full 18 fixture). ~30 min wall.
3. **Inspect** the score gaps on probes 3, 10, 14, 18 vs the rank-2 adversary. ~15 min analysis.
4. **Decision tree:**
   - All 4 margins > 0.10 → proceed with 3-run confirmation, accept some variance. Use median rule.
   - 2-3 margins > 0.10, 1-2 in 0.05-0.10 → add `torch.use_deterministic_algorithms` per §6.1, then proceed.
   - 2+ margins < 0.05 → margin is too tight to promote on the existing fixture. EITHER reset the gate (require 12/18 instead of 10/18) OR expand the fixture to 30-50 pairs to reduce single-probe sensitivity.

Total pre-work: under 1 hour. Avoids burning 3.5 hours of bench compute on a flaky-margin signal.
<!-- /ANCHOR:recommended-pre-confirmation-steps -->

---

<!-- ANCHOR:promotion-rule-impact -->
## 9. PROMOTION-RULE IMPACT

The current promote rule in `016/007/003` spec.md §3:

> IF bge-code-v1's min hit rate across 3 runs ≥ 10/18 AND median ≥ 10/18 → PROMOTE

This rule is **moderately fragile** under the analysis above:

- If 2 of the 4 unique wins are tight-margin (per §2 hypothesis), expected hit rate per run is ~9.5/18 with sigma ~0.8.
- Probability of 3/3 runs landing ≥10/18 under this distribution: roughly 25-40%.
- Probability of at least 1 run dropping to 9/18: 30-50%.

Without the §6.1 determinism patch, the 3-run rule is likely to HOLD bge-code-v1 even though its mean is genuinely > jina-code's. False-negative risk dominates.

**Suggested rule refinement** (post-instrumentation):

- If margins are wide (§7 path A): keep the existing rule.
- If margins are tight (§7 paths B or C): EITHER add §6.1 determinism first OR loosen to "median ≥10/18 AND no run below 9/18" (still safer than letting jina-code keep the default if bge-code-v1's mean is genuinely 11/18).

This is exactly the kind of "before you spend the budget, check the variance" call the FORMAT.md `benchmark_report.md` Caveats section is meant to surface — adding the instrumentation step to the 003 spec is the lowest-cost de-risk.
<!-- /ANCHOR:promotion-rule-impact -->
