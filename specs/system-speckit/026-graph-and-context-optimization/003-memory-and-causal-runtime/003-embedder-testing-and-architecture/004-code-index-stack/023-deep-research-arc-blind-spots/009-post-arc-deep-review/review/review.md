# Post-Arc Deep Review — Running Synthesis

## Iteration 001 — Restructure Import Correctness

**Status:** Complete

**Key findings:**
- P1: Top-level tests/ directory has stale imports and is not being run by pytest
- P2: Documentation import path in INSTALL_GUIDE.md may be stale
- INFO: Active test suite (mcp_server/tests/) uses correct imports, all 222 tests pass

**Summary:** The post-restructure import sweep (commit ed7dcd0ac) correctly updated the active test suite (mcp_server/tests/) but missed several files in the dormant top-level tests/ directory. Since pytest only runs mcp_server/tests/, these stale imports were masked.

## Iteration 002 — Phase-Parent Rename Correctness

**Status:** Complete

**Key findings:**
- P2: Stale old-slug reference "023C-observability" in 001-request-budget-hardening/graph-metadata.json
- INFO: Historical references to old slugs in research notes are acceptable
- INFO: All strict-validate checks pass for parent and all 8 children

**Summary:** The phase-parent rename was structurally successful (all validations pass) but missed one graph-metadata.json related_to entry that still references the old "023C-observability" slug instead of the new "002-retrieval-observability".

## Iteration 003 — Qwen3 Default Flip Soundness

**Status:** Complete

**Key findings:**
- P1: ADR-027 and benchmark report claim incorrect jina-v3 statistics (evidence mismatch with actual JSON data)
- INFO: Implementation correctness verified (DEFAULT_RERANKER_NAME, _DEFAULT_RERANK_MODEL, ccc doctor all correct)

**Summary:** Implementation is correct, but evidence documentation has a data integrity issue. ADR-027 claims jina-v3 had 29.0/73 hits with zero stddev, but actual JSON data shows [14, 29, 29] with mean 24.0 and stddev 8.49. Qwen3-0.6B data is consistent (30/30/30 hits, zero stddev). The jina-v3 run-1 anomaly (14 hits) needs investigation.

## Iteration 004 — 023/001 (request-budget) + 023/002 (observability) closure verification

**Status:** Complete

**Key findings:**
- INFO — 023/001 request-budget closure verified: SearchBudgetExceeded fires for offset>1000 with proper error structure
- INFO — 023/002 observability per-stage counters verified: RetrievalDiagnostics has all nine required fields

**Summary:** Verified closure of 023/001 request-budget hardening and 023/002 retrieval observability. SearchBudgetExceeded correctly fires for offset>1000 with proper error structure. Per-stage diagnostic counters (including vec_candidates_count) are correctly defined, recorded in query.py, and emitted via log_retrieval_diagnostics.

## Iteration 005 — 023/003 (upstream spike) + 023/004 (metadata-fingerprint)

**Status:** Complete

**Key findings:**
- INFO — 023/004 IndexMetadata dataclass + HARD_REFUSE on dim mismatch verified
- INFO — 023/003 upstream-rebase delta classification is real (not placeholder)

**Summary:** Verified 023/004 IndexMetadata dataclass with embedder_dim field and HARD_REFUSE on dimension mismatch. Verified 023/003 upstream-rebase delta classification is real with specific technical guidance for prompt policy, license registry, dimension handling, and fixture expansion.

## Iteration 006 — 023/005 (doctor) + 023/006 (registry) closure

**Status:** Complete

**Key findings:**
- INFO — 023/005 Pipeline section in ccc doctor verified
- INFO — 023/006 Qwen3 default reranker + _QUERY_PROMPT_MODELS removal verified

**Summary:** Verified 023/005 Pipeline section in ccc doctor with stage_1 (bi-encoder embedder) and stage_2 (cross-encoder reranker) details in both human-readable and JSON output. Verified 023/006 Qwen3-Reranker-0.6B as default reranker and _QUERY_PROMPT_MODELS dict literal removal from shared.py.

## Iteration 007 — 023/007 (fixture-calibration) + 023/008 (vec0 deferred)

**Status:** Complete

**Key findings:**
- INFO — 023/007 expanded fixture probe count verified (53 probes, not 73 as stated in instruction)
- INFO — 023/008 does NOT capture 023A3 revert lessons (by design)

**Summary:** Verified 023/007 expanded fixture has 53 probes (18 original + 15 architecture-invariant + 10 multilingual + 5 short + 5 long). Verified 023/008 is a minimal scaffold for vec0 deferred work and does not capture 023A3 dimension handling revert lessons (those live in 023/003 cross-packet-impact.md).

## Iteration 008 — Adversarial: Qwen3 default-flip risk audit

**Status:** Complete

**Key findings:**
- P1 — Qwen3 load failure does NOT fall back to jina-v3; falls back to no reranking
- INFO — rankingSignals label consistency verified

**Summary:** Found P1 risk: Qwen3 load failure does NOT fall back to jina-v3; it falls back to no reranking. The default flip removes jina-v3 from the default path, so if Qwen3 fails to load in production, users get no reranking at all. Verified rankingSignals label consistency: jina-v3 uses "jina_v3_rerank", Qwen3 uses "cross_encoder_rerank" (correct differentiation by reranker family).

## Iteration 009 — Adversarial: 023A3 revert completeness

**Status:** Complete

**Key findings:**
- INFO — 023A3 revert completeness verified
- INFO — 008 vec0 migration deferred justification is sound

**Summary:** Verified 023A3 revert completeness: migrations/ directory is empty (placeholder only), no orphan _table_name_for_dim or vectors_768 references in codebase, indexer/schema.py has no dimension-specific logic. Verified 008 vec0 migration deferred justification is sound: packet clearly defers implementation without authorization, includes explicit risk warning about misinterpretation.

## Iteration 010 — Synthesis + Verdict

**Status:** Complete

**Verdict:** CONDITIONAL_PASS

**Summary:** The 023 arc is substantially complete with robust implementation across most packets. However, one P1 operational risk was identified: Qwen3-Reranker-0.6B load failure does NOT fall back to jina-v3 (the previous default), instead falling back to no reranking at all. This represents a regression in operational resilience that should be addressed before considering the arc fully production-ready. Recommendation: Add fallback chain (Qwen3 → jina-v3 → no reranking) to preserve previous default behavior as a safety net.

See review-report.md for detailed findings table and analysis.
