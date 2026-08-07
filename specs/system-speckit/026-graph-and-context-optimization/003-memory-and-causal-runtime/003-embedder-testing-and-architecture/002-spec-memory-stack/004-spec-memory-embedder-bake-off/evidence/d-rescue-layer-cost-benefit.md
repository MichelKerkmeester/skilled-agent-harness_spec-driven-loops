# Retrieval Rescue Layer Cost/Benefit Sweep

Date: 2026-05-17

Active embedder source of truth:

```text
active_embedder_name=nomic-embed-text-v1.5
active_embedder_dim=768
```

Runner: `mk-spec-memory` MCP `memory_search` over JSON-RPC. `scripts/run-scenario.sh` is absent in this repo, so the sweep used warmed MCP child processes with `SPECKIT_RERANK_LAYER=true` for ON and `SPECKIT_RERANK_LAYER=false` for OFF. Each measured query used `bypassCache:true`.

Sample evidence:
- `evidence/d-sample-30.json`
- `evidence/d-rescue-on-vs-off.jsonl`

Sanity probe:
- cat-24/409 row 1 expected source `4460`.
- ON row 1 top-5: `4460,8410,6118,8411,8412`.
- OFF row 1 top-5: `4460,11240,8411,11045,10825`.
- Full cat-24/409 flipped from OFF `4/10` top-3 FAIL to ON `8/10` top-3 PASS, so the env toggle is active.

## Sample Composition

| Category | n | Scenarios |
|---|---:|---|
| cat-13 | 6 | 003, 042, 133, 155, 177, 203 |
| cat-14 | 4 | 049, 129, 203, 204 |
| cat-15 | 4 | 055, 057, 096, 145 |
| cat-16 | 5 | 237, 240, 281, 282, 283 |
| cat-17 | 3 | 273, 274, 276 |
| cat-24 | 5 | 402, 408, 409, 405, 407 |
| cat-25/03/04 | 3 | cat-03/015, cat-03/016, cat-04/014 |

## Latency

| Category | n | OFF median | OFF p95 | ON median | ON p95 | Delta median | Delta p95 |
|---|---:|---:|---:|---:|---:|---:|---:|
| cat-13 | 6 | 888 ms | 986 ms | 1944 ms | 2384 ms | +1056 ms | +1398 ms |
| cat-14 | 4 | 562.5 ms | 638 ms | 1837 ms | 2237 ms | +1274.5 ms | +1599 ms |
| cat-15 | 4 | 464 ms | 525 ms | 860 ms | 2146 ms | +396 ms | +1621 ms |
| cat-16 | 5 | 288 ms | 318 ms | 800 ms | 942 ms | +512 ms | +624 ms |
| cat-17 | 3 | 329 ms | 425 ms | 721 ms | 871 ms | +392 ms | +446 ms |
| cat-24 | 5 | 306 ms | 4038 ms | 903 ms | 8482 ms | +597 ms | +4444 ms |
| cat-25/03/04 | 3 | 356 ms | 484 ms | 826 ms | 985 ms | +470 ms | +501 ms |
| Overall | 30 | 426.5 ms | 1411 ms | 922.5 ms | 3045 ms | +496 ms | +1634 ms |

Overall median ratio: `2.16x` ON/OFF.
Overall p95 ratio: `2.16x` ON/OFF.

## Quality

| Category | n | OFF PASS rate | ON PASS rate | Delta |
|---|---:|---:|---:|---:|
| cat-13 | 6 | 6/6 (100%) | 6/6 (100%) | 0 |
| cat-14 | 4 | 4/4 (100%) | 4/4 (100%) | 0 |
| cat-15 | 4 | 4/4 (100%) | 4/4 (100%) | 0 |
| cat-16 | 5 | 5/5 (100%) | 5/5 (100%) | 0 |
| cat-17 | 3 | 3/3 (100%) | 3/3 (100%) | 0 |
| cat-24 | 5 | 2/5 (40%) | 3/5 (60%) | +1 |
| cat-25/03/04 | 3 | 3/3 (100%) | 3/3 (100%) | 0 |
| Overall | 30 | 27/30 (90%) | 28/30 (93.3%) | +1 |

No category regressed. cat-24/402 improved from `2/4` top-5 expected hits OFF to `3/4` ON but remained FAIL. cat-24/408 improved from `0/4` constituent top-5 hits OFF to `1/4` ON but remained FAIL.

## Reversals

| ID | OFF result | ON result | OFF top-3 | ON top-3 | Verdict |
|---|---|---|---:|---:|---|
| cat-24/409 | FAIL | PASS | 4 | 8 | ON closes the deterministic recall gate; keep the layer guarded by the false kill switch. |

## Verdict

Verdict: **GATE default-on**.

Reason: ON quality is better than OFF quality by one scenario, with no observed quality regressions across the 30-scenario sweep. However, ON latency exceeds the `2x` criterion by both overall median and overall p95 (`2.16x` for each), so this does not qualify as unconditional KEEP under the stated rule.

Recommendation: keep default-on because it closes cat-24/409 and does not degrade sampled quality, but document the latency cost in the changelog and keep `SPECKIT_RERANK_LAYER=false` as the operator kill switch.
