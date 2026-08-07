# Phase 2 Bench — 011 Rerank Model Fit Investigation

## Probe subset (8 probes)

**4 failures** (BGE-reranker-v2-m3 misses with lexical-cue-density root cause per iter 2):
- Probe 3 — `config.py:Config.from_env` (CocoIndex config) — test/impl rank flip
- Probe 10 — `dist/memory/generate-context.js` (HELP_TEXT) — `.ts` source vs `.js` dist fixture-truth ambiguity
- Probe 14 — `structural-indexer.ts:StructuralIndexer` (filesystem walker) — vitest stress-test outranks implementation
- Probe 18 — `tests/test_refresh_split.py:test_refresh` — reference doc outranks integration test

**4 controls** stratified by:
- Path-class diversity — 2 implementation + 2 tests probes (gives sensitivity to test-class regression from the 0.85 tests factor in path-class boost)
- Difficulty span — 2 easy + 1 medium + 1 hard

Controls:
- Probe 1 — `registry.ts:listManifests` (easy, implementation)
- Probe 5 — `code-graph-status-readiness-snapshot.vitest.ts` (easy, tests)
- Probe 11 — `config.py:_resolve_device` (hard, implementation; shares file with probe 3 to test whether path-class boost helps the failure without over-correcting on the same file)
- Probe 16 — `readiness-marker-atomic-write.vitest.ts` (medium, tests)

## Bench wrapper

`run-phase2-smoke.sh` runs 3 lanes sequentially:
1. **baseline-bge** — current BGE-reranker-v2-m3 with no boost (regression baseline)
2. **bge-path-class** — same BGE model + `COCOINDEX_RERANK_PATH_CLASS_BOOST=1` (Track A hero)
3. **jina-v3** — `jinaai/jina-reranker-v3` via the throwaway adapter (Track B diagnostic)

Each lane: clears CocoIndex daemon to drop `_ADAPTERS` cache, sets env vars (model, boost flag, log path), invokes upstream `run-extended-bake-off-with-hybrid-rerank.sh` with `FIXTURE_OVERRIDE=probe-subset.json`, captures per-probe rerank scores via `COCOINDEX_RERANK_LOG_PATH`.

Output: `baseline-bge.rerank-scores.jsonl`, `bge-path-class.rerank-scores.jsonl`, `jina-v3.rerank-scores.jsonl` + a comparison report `phase2-comparison.md`.

## Corrected measurement baseline

Packet `016/004/013` hardened the harness path extractor and audited the full 18-probe fixture against `.cocoindex_code/target_sqlite.db`. Use these artifacts as the canonical baseline for downstream packets 014-018:

- `code-retrieval-fixture-audited.json` — all 18 probes annotated with `_fixture_status` and sqlite vec/FTS evidence.
- `code-retrieval-fixture-corrected.json` — corrected benchmark fixture; probe 10 points at indexed TypeScript source `scripts/memory/generate-context.ts` instead of excluded `scripts/dist/**` output.
- `phase2-comparison-corrected.md` — corrected 18-probe re-bench result.
- `phase2-comparison-baseline-vs-corrected-delta.md` — explains historical-vs-corrected flips by harness fix, fixture fix, or residual regression.

Re-run without overwriting historical Phase 2 artifacts:

```bash
FIXTURE_OVERRIDE=phase2-bench/code-retrieval-fixture-corrected.json \
OUTPUT_TAG=-corrected \
COMPARISON_OUTPUT=phase2-bench/phase2-comparison-corrected.md \
bash phase2-bench/run-phase2-smoke.sh
```

The original `phase2-comparison.md` remains historical evidence. New measurement claims should compare against `phase2-comparison-corrected.md`.

## Decision rubric

**Track A SHIPS** iff: ≥2 of probes {3, 10, 14, 18} flip miss → hit AND 0 of probes {1, 5, 11, 16} flip hit → miss AND p95 latency delta < 5%.

**Track B INFORMS** (never ships from this throwaway): if jina-v3 fixes more probes than path-class without more control regressions → escalate to production jina-v3 adapter packet. Otherwise → delete `rerankers_jina_v3.py` + its test file.

**Track B BLOCKED is acceptable**: MPS fp16-SDPA rejection on listwise forward pass → fallback to `COCOINDEX_CODE_DEVICE=cpu` for jina-v3 lane only. CPU OOM or missing op → log BLOCKED in `phase2-comparison.md`, delete throwaway files.

See `011/research/research-convergence.md` §"Decision Rubric" for the full SWAP/HOLD/NEEDS-CUSTOM gate.
