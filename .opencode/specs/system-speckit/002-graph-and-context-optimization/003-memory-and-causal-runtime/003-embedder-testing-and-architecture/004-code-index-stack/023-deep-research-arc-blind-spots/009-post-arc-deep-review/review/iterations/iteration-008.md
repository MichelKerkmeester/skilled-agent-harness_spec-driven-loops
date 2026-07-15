# Iteration 008 — Adversarial: Qwen3 default-flip risk audit

## Hypotheses going in

The Qwen3 default flip may have fallback risks. Need to verify: (1) what happens if Qwen3 fails to load, and (2) whether rankingSignals labels are consistent between jina-v3 and cross-encoder paths.

## Files read

- cocoindex_code/rerankers/rerankers_jina_v3.py (JinaRerankerAdapter)
- cocoindex_code/rerankers/reranker.py (CrossEncoderRerankerAdapter, get_reranker_adapter)
- Grep for rankingSignals across cocoindex_code/

## Findings

### P1 — Qwen3 load failure does NOT fall back to jina-v3; falls back to no reranking

**Evidence:**
- `cocoindex_code/rerankers/reranker.py:213-234` implements `get_reranker_adapter()` which dispatches to JinaRerankerAdapter if model_name starts with "jinaai/jina-reranker-v3", otherwise CrossEncoderRerankerAdapter
- `cocoindex_code/rerankers/reranker.py:117-126` and `cocoindex_code/rerankers/rerankers_jina_v3.py:59-72` both implement `_load_model()` with `_load_failed` flag
- `cocoindex_code/rerankers/reranker.py:167-171` and `cocoindex_code/rerankers/rerankers_jina_v3.py:131-135` both return original order (no reranking) when model is None, calling `diagnostics.record_reranker_fallback("model_load_failed")`
- There is NO logic that falls back from Qwen3 to jina-v3 on load failure

**Analysis:** If Qwen3-Reranker-0.6B fails to load (insufficient RAM, import error, etc.), the system does NOT fall back to jina-v3. Instead, it returns the original candidate order without reranking and logs "model_load_failed" in diagnostics. This is a P1 risk because the default flip from jina-v3 to Qwen3 removes jina-v3 from the default path, and if Qwen3 fails to load in production, users get no reranking at all rather than a graceful fallback to the previous default.

**Recommendation:** Consider adding a fallback chain: if Qwen3 fails to load, fall back to jina-v3 (if available) before falling back to no reranking. This would preserve the previous default behavior as a safety net.

**Severity:** P1 — operational risk. Qwen3 load failure results in no reranking rather than graceful fallback to previous default.

### INFO — rankingSignals label consistency verified

**Evidence:**
- `cocoindex_code/rerankers/rerankers_jina_v3.py:188` adds `"jina_v3_rerank"` to rankingSignals for jina-v3 reranked results
- `cocoindex_code/rerankers/reranker.py:200` adds `"cross_encoder_rerank"` to rankingSignals for cross-encoder reranked results
- Qwen3-Reranker-0.6B uses CrossEncoderRerankerAdapter (via sentence-transformers), so it would add "cross_encoder_rerank"
- The two labels are different because they represent different reranker families (Jina's native listwise API vs sentence-transformers CrossEncoder)

**Analysis:** The rankingSignals labels are correctly differentiated by reranker family. jina-v3 uses "jina_v3_rerank" while Qwen3 (and other cross-encoders) use "cross_encoder_rerank". This is consistent and allows operators to distinguish which reranker was used via the signals.

**Severity:** INFO — label consistency is correct.

## Updates to review.md

Iteration 008 completed. Found P1 risk: Qwen3 load failure does NOT fall back to jina-v3; it falls back to no reranking. The default flip removes jina-v3 from the default path, so if Qwen3 fails to load in production, users get no reranking at all. Verified rankingSignals label consistency: jina-v3 uses "jina_v3_rerank", Qwen3 uses "cross_encoder_rerank" (correct differentiation by reranker family).

## NO-EARLY-STOP confirmation

Iteration 8 of 10 complete. Continuing to iteration 9.
