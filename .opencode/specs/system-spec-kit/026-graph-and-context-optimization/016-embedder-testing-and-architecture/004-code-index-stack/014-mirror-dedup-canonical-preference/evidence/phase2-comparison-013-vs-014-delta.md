# Phase 2 Delta - 013 Corrected Baseline vs 014 Mirror Dedup

## Inputs

| Artifact | Path |
|---|---|
| 013 corrected baseline | `../011-rerank-model-fit-investigation/research/phase2-bench/phase2-comparison-corrected.md` |
| 014 dedup comparison | `evidence/phase2-comparison-014-dedup.md` |
| Fixture | `../011-rerank-model-fit-investigation/research/phase2-bench/code-retrieval-fixture-corrected.json` |
| Bench command | `FIXTURE_OVERRIDE=.../code-retrieval-fixture-corrected.json OUTPUT_TAG=-014-dedup COMPARISON_OUTPUT=.../014-mirror-dedup-canonical-preference/evidence/phase2-comparison-014-dedup.md bash .../phase2-bench/run-phase2-smoke.sh` |

## Result Summary

| Lane | 013 hits | 014 hits | Probe regressions | 013 p95 ms | 014 p95 ms | p95 delta |
|---|---:|---:|---:|---:|---:|---:|
| baseline-bge | 14/18 | 14/18 | 0 | 3365 | 2876 | -14.53% |
| bge-path-class | 14/18 | 14/18 | 0 | 3028 | 2899 | -4.26% |
| jina-v3 | 14/18 | 14/18 | 0 | 3022 | 2850 | -5.69% |

## Per-Probe Delta

No probe changed hit/miss status in any lane. The 014 mirror-collapse patch is therefore a retrieval hygiene win, not a hit-rate win on the corrected 18-probe fixture.

## Latency Note

The first 014 run tied hit rate but measured `bge-path-class` p95 at 3335 ms, 4 ms above the 10% threshold relative to the corrected baseline. The spec risk section explicitly allows a second run when bench variance dominates, so the bench was rerun with the same fixture and output tag. The rerun is the retained evidence artifact and clears the latency gate in all lanes.

## Mirror Evidence

Direct unit coverage verifies the intended candidate behavior:

- Four runtime mirror copies collapse to the canonical `.opencode/` copy.
- If the canonical copy is absent, the first ranked mirror copy is kept.
- Non-mirror same-stem files are preserved.
- `COCOINDEX_MIRROR_PREFIXES='[]'` disables the mirror-collapse pass.

The generated rerank-score JSONL files for this run are empty in the current daemon path, so mirror reduction is demonstrated by the targeted integration tests rather than per-probe rerank-score rows.
