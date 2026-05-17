# 008 Rescue Default-On Regression Report

## Summary

- PASS rate: 50/50
- Regression count: 0/50
- Verdict: NO_REGRESSION
- Final recommendation: default-on KEEP
- Rescue layer mode: default-on (SPECKIT_RERANK_LAYER unset/true path; explicit false remains kill switch)
- Embedder: nomic-embed-text-v1.5, active source verified from vec_metadata
- Pre-probe: cat-24/409 fixture row 1 live MCP probe found expected source 4460 at rank 1 using scenario-contract args.

## Baselines Compared

- Prior 20-row smoke sample: 20/20 preserved under opt-in rescue layer (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-pluggable-embedder-architecture/004-mxbai-swap-and-008-closure/evidence/008-pass-sample-rerun.jsonl`)
- Original 008 closure baseline: 57 PASS / 51 FAIL closed, with cat-24/409 closed by 016/004 ADR-010
- Current 50-row default-on sample: 50/50 PASS

## Regression List

None.

## Latency

- Current default-on live MCP median: 332 ms
- Current default-on min/max: 244 / 614 ms
- Prior off-layer median: not re-run; recovery was not cheap without changing active runtime mode.
- ADR-010 opt-in smoke baseline: 20/20 preserved; no per-row latency captured in that JSONL.

## Verification

- `sqlite3 ... "SELECT key, value FROM vec_metadata WHERE key LIKE 'active_%';"`: active_embedder_name=nomic-embed-text-v1.5, active_embedder_dim=768
- `npm run typecheck`: PASS
- `node node_modules/vitest/vitest.mjs run tests/retrieval-rescue.vitest.ts tests/unit-rrf-fusion.vitest.ts tests/query-surrogates.vitest.ts tests/stage2b-enrichment-extended.vitest.ts tests/adaptive-ranking-e2e.vitest.ts`: PASS (5 files, 115 tests)

## Notes

The 50-row set is the first 50 final PASS rows from packet 008 after deduping by category and scenario id. Each row read the scenario contract and executed a live Memory MCP retrieval probe using the contract prompt text. The preservation verdict is backed by the default-on rescue regression suite. No ADR update is required because regression count is 0/50.
