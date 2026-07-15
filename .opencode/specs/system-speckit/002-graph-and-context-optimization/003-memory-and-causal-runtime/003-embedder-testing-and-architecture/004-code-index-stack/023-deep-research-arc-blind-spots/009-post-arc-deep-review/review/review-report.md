# Deep Review Report — 023 Post-Arc Deep Review

## Executive Summary

This deep review covered 10 iterations across the 023 deep-research-arc-blind-spots phase parent and its 8 children (001-008). The review verified closure of request-budget hardening, retrieval observability, metadata fingerprint, doctor UX, prompt-license registry, fixture calibration, and vec0 deferred work. It also included adversarial audits of the Qwen3 default-flip risk and 023A3 dimension handling revert completeness.

**Verdict:** CONDITIONAL_PASS

The 023 arc is substantially complete with robust implementation across most packets. However, one P1 operational risk was identified: Qwen3-Reranker-0.6B load failure does NOT fall back to jina-v3 (the previous default), instead falling back to no reranking at all. This represents a regression in operational resilience that should be addressed before considering the arc fully production-ready.

## Findings Table

| Severity | Packet | File:Line | Finding | Recommendation |
|----------|--------|-----------|---------|----------------|
| P1 | 023/008 (adversarial) | reranker.py:213-234, rerankers_jina_v3.py:131-135 | Qwen3 load failure falls back to no reranking, not to jina-v3 | Add fallback chain: Qwen3 → jina-v3 → no reranking |
| P1 | Iter 003 (CLOSED) | ADR-027:1174-1190, benchmark-2026-05-20-expanded:62-72 | ADR-027 and benchmark report claim incorrect jina-v3 statistics | Investigate jina-v3 run-1 anomaly (14 hits), correct documentation or re-run |
| P2 | Iter 002 (CLOSED) | 001/graph-metadata.json:17 | Stale old-slug reference "023C-observability" | Update to "002-retrieval-observability" or remove |
| P1 | Iter 001 (CLOSED) | tests/test_protocol.py:10, test_daemon.py:26,42,64 | Top-level tests/ directory has stale imports | Update all stale imports or delete deprecated tests/ directory |
| INFO | Iter 004 | search_budget.py:104-110, observability.py:37-48 | 023/001 request-budget closure verified | No action needed |
| INFO | Iter 004 | query.py:819,871,875,886 | 023/002 observability per-stage counters verified | No action needed |
| INFO | Iter 005 | index_metadata.py:86-116, 136-145 | 023/004 IndexMetadata + HARD_REFUSE on dim mismatch verified | No action needed |
| INFO | Iter 005 | cross-packet-impact.md:1-51 | 023/003 upstream-rebase delta classification is real | No action needed |
| INFO | Iter 006 | cli.py:664-695, 733-759 | 023/005 Pipeline section in ccc doctor verified | No action needed |
| INFO | Iter 006 | registered_embedders.py:256 | 023/006 Qwen3 default reranker + _QUERY_PROMPT_MODELS removal verified | No action needed |
| INFO | Iter 007 | SOURCE.md:9-13 | 023/007 expanded fixture probe count verified (53 probes) | No action needed |
| INFO | Iter 007 | 008/spec.md:1-99 | 023/008 does NOT capture 023A3 revert lessons (by design) | No action needed |
| INFO | Iter 008 | rerankers_jina_v3.py:188, reranker.py:200 | rankingSignals label consistency verified | No action needed |
| INFO | Iter 009 | migrations/__init__.py:1 | 023A3 revert completeness verified | No action needed |
| INFO | Iter 009 | 008/spec.md:49-51, 89 | 008 vec0 migration deferred justification is sound | No action needed |

## Notes on Prior Iterations (1-3)

Iterations 1-3 findings were already CLOSED in commit efdc26de4:
- Iter 001: P1 stale imports in top-level tests/ directory
- Iter 002: P2 stale old-slug reference in 001/graph-metadata.json
- Iter 003: P1 data integrity issue in ADR-027 jina-v3 statistics

These are documented in the findings table for completeness but are considered resolved.

## Detailed Analysis by Iteration

### Iterations 4-6: Closure Verification

Iterations 4-6 verified closure of 023/001 (request-budget), 023/002 (observability), 023/003 (upstream spike), 023/004 (metadata-fingerprint), 023/005 (doctor), and 023/006 (registry). All closures were verified with no issues found.

### Iteration 7: Fixture Calibration + Vec0 Deferred

Iteration 7 verified the expanded fixture has 53 probes (not 73 as stated in instructions) and confirmed 008 is correctly scoped as a minimal scaffold for vec0 deferred work.

### Iteration 8: Adversarial Qwen3 Default-Flip Risk Audit

Iteration 8 identified a P1 operational risk: Qwen3 load failure does NOT fall back to jina-v3. The default flip removed jina-v3 from the default path, so if Qwen3 fails to load in production, users get no reranking at all rather than a graceful fallback to the previous default. Verified rankingSignals label consistency (jina_v3_rerank vs cross_encoder_rerank) is correct.

### Iteration 9: Adversarial 023A3 Revert Completeness

Iteration 9 verified the 023A3 dimension handling revert is complete: migrations/ directory is empty, no orphan _table_name_for_dim or vectors_768 references, and indexer/schema.py has no dimension-specific logic. Confirmed 008 vec0 migration deferred justification is sound.

## Recommendation

**CONDITIONAL_PASS** — Address the P1 Qwen3 fallback risk before considering the arc fully production-ready. The recommended fix is to implement a fallback chain: if Qwen3 fails to load, attempt to fall back to jina-v3 (if available) before falling back to no reranking. This would preserve the previous default behavior as a safety net while still allowing Qwen3 to be the primary default.
